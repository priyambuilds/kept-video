"""Lays ElevenLabs takes of the Keeper onto the finished film without re-rendering it (docs/KEEPER_VOICE_GUIDE.md).

Takes go in audio/vo_elevenlabs/, one file per line named by its ID (.mp3, .wav, .m4a or .flac): S01 … S33 for the
v5 script (the default), F01 … F26 with --film v4. A line can also come as one file per phrase (S05_1, S05_2). Each
take is split into its phrases at its pauses, and every phrase is placed so its first sound lands on the frame where
the Keeper's mouth starts moving (the In times in the film's VO_script.csv). A phrase that runs a little long or short is time-stretched
(pitch kept) to end where his mouth closes; one that is off by more than --max-stretch is placed as is and
flagged for a new take. ElevenLabs' own pause lengths don't matter, only that the pauses are there.

  ~/.cache/kept/tts/bin/python video/scripts/vo/fit_takes.py              # fit, report, VO stem
  ~/.cache/kept/tts/bin/python video/scripts/vo/fit_takes.py --preview    # + the subtitled master with the VO mixed in

Writes renders/final_v5/elevenlabs/ (or renders/final/elevenlabs/ for v4): keeper_vo_placed.wav (the VO alone, film
length, 48 kHz), fit_report.md and, with --preview, the subtitled master with the VO mixed in (<master>_VO.mp4: the
stems summed like the master, +2.8 dB into −1 dBTP).
"""
import argparse, csv, itertools, os, subprocess, sys
import numpy as np, soundfile as sf, librosa, pyloudnorm as pyln

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
FILMS = {   # folder, timing sheet, subtitled master
    "v5": ("final_v5", "KEPT_launch_v5_VO_script.csv", "KEPT_launch_v5_16x9_1080p60_subtitled.mp4"),
    "v4": ("final", "KEPT_launch_final_VO_script.csv", "KEPT_launch_final_16x9_1080p60_subtitled.mp4"),
}
SR = 48000
PRE, POST = 0.03, 0.12   # kept before a phrase's first sound and after its last (breath-in, decay)
VO_LUFS = -18.0          # the VO stem over its speech: the level the stems were mixed for


def decode(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                         check=True, capture_output=True).stdout
    return np.frombuffer(raw, np.float32).copy()


def stretch(x, factor):
    """Pitch-kept tempo change; factor > 1 makes it shorter."""
    if abs(factor - 1) < 1e-3:
        return x
    p = subprocess.run(["ffmpeg", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", "-af", f"atempo={factor:.5f}", "-f", "f32le", "-"],
                       input=x.astype(np.float32).tobytes(), check=True, capture_output=True)
    return np.frombuffer(p.stdout, np.float32).copy()


def sounds(y):
    """Spoken stretches of a take, in seconds: anything within 45 dB of its peak (a deadpan line can trail off
    quietly), less breaths: stretches longer than 0.12 s that come after a pause, aren't loud and have no pitch.
    A final consonant's release ("-pt" in "Kept.") is just as quiet and pitchless but hangs on to its word."""
    peak = np.abs(y).max()

    def breath(a, b):
        x = y[a:b]
        if b - a < 0.12 * SR or np.abs(x).max() > peak * 10 ** (-20 / 20):
            return False
        _, voiced, _ = librosa.pyin(librosa.resample(x, orig_sr=SR, target_sr=16000), fmin=60, fmax=400, sr=16000, frame_length=1024)
        return voiced.mean() < 0.1

    iv = librosa.effects.split(y, top_db=45, frame_length=1024, hop_length=128)
    return [(a / SR, b / SR) for i, (a, b) in enumerate(iv)
            if not ((i == 0 or a - iv[i - 1][1] >= 0.06 * SR) and breath(a, b))]


def find(takes, stem):
    for ext in (".wav", ".mp3", ".m4a", ".flac"):
        p = os.path.join(takes, stem + ext)
        if os.path.exists(p):
            return p
    return None


def phrases_of(lid, targets, takes):
    """[(audio, speech start, speech end)] per phrase, and a note (or None); ([], reason) when it can't."""
    n = len(targets)
    parts = [find(takes, f"{lid}_{i + 1}") for i in range(n)]
    if n > 1 and all(parts):
        out = []
        for p in parts:
            y = decode(p); iv = sounds(y)
            if not iv:
                return [], f"{os.path.basename(p)} is silent"
            out.append((y, iv[0][0], iv[-1][1]))
        return out, None
    path = find(takes, lid)
    if not path:
        return [], "no take"
    y = decode(path); iv = sounds(y)
    if not iv:
        return [], "silent take"
    if n == 1:
        return [(y, iv[0][0], iv[-1][1])], None
    gap = lambda i: iv[i + 1][0] - iv[i][1]
    cand = sorted(sorted([i for i in range(len(iv) - 1) if gap(i) >= 0.06], key=gap, reverse=True)[:12])
    if len(cand) < n - 1:
        return [], f"needs {n} phrases with a pause between them; heard no clear pause. Re-take with a beat between phrases, or export them as {lid}_1, {lid}_2 …"

    def split(cuts):
        b, s = [], 0
        for c in cuts:
            b.append((iv[s][0], iv[c][1])); s = c + 1
        return b + [(iv[s][0], iv[-1][1])]

    # The split whose phrase lengths best match the slots, favouring real pauses over gaps inside words.
    score = lambda cuts: sum(abs(np.log((e - s) / t)) for (s, e), t in zip(split(cuts), targets)) - 0.5 * sum(min(gap(c), 0.3) for c in cuts)
    cuts = min(itertools.combinations(cand, n - 1), key=score)
    weak = [round(float(gap(c)), 2) for c in cuts if gap(c) < 0.1]
    return [(y, s, e) for s, e in split(cuts)], (f"pause of only {weak} s between phrases: listen to the split" if weak else None)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--takes", default=os.path.join(ROOT, "audio", "vo_elevenlabs"))
    ap.add_argument("--max-stretch", type=float, default=0.10, help="largest tempo change applied to a phrase (0.10 = ±10 %%)")
    ap.add_argument("--preview", action="store_true")
    ap.add_argument("--film", choices=list(FILMS), default="v5")
    ap.add_argument("--out", help="default: <film folder>/elevenlabs")
    a = ap.parse_args()
    folder, sheet, master = FILMS[a.film]
    FINAL = os.path.join(ROOT, "renders", folder)
    a.out = a.out or os.path.join(FINAL, "elevenlabs")

    lines = {}
    for r in csv.DictReader(open(os.path.join(FINAL, sheet))):
        lines.setdefault(r["line"], []).append(r)
    ids = list(lines)
    dur = sf.info(os.path.join(FINAL, "stems", "music_ducked_for_vo.wav")).duration
    vo = np.zeros(int(dur * SR), np.float32)
    rows, todo = [], []

    for li, lid in enumerate(ids):
        ph = lines[lid]
        targets = [float(p["out_s"]) - float(p["in_s"]) for p in ph]
        got, note = phrases_of(lid, targets, a.takes)
        if not got:
            rows.append(f"| {lid} | – | {' / '.join(p['say_it_as'] for p in ph)} | {ph[0]['in_tc_60fps']} | {sum(targets):.2f} | – | – | **{note}** |")
            todo.append(lid); continue
        for k, ((y, s, e), p, t) in enumerate(zip(got, ph, targets)):
            t_in = float(p["in_s"])
            nxt = float(ph[k + 1]["in_s"]) if k + 1 < len(ph) else (float(lines[ids[li + 1]][0]["in_s"]) if li + 1 < len(ids) else dur)
            ratio = (e - s) / t
            fits = abs(ratio - 1) <= a.max_stretch
            factor = ratio if fits else 1.0
            pre = min(PRE, s)
            seg = y[int((s - pre) * SR): int(min(len(y) / SR, e + POST) * SR)].copy()
            fi, fo = int(0.008 * SR), int(0.04 * SR)
            seg[:fi] *= np.linspace(0, 1, fi); seg[-fo:] *= np.linspace(1, 0, fo)
            seg = stretch(seg, factor)
            i0 = max(0, int((t_in - pre / factor) * SR))
            seg = seg[: len(vo) - i0]
            vo[i0: i0 + len(seg)] += seg
            end = t_in + (e - s) / factor
            if not fits:
                status = f"**REDO: {'long' if ratio > 1 else 'short'} by {abs((e - s) - t):.2f} s ({(ratio - 1) * 100:+.0f} %)**"
                todo.append(f"{lid}.{k + 1}")
            else:
                status = "fits" if abs(ratio - 1) < 0.02 else f"fits, stretched {(1 / factor - 1) * 100:+.0f} %"
            if end + POST * 0.5 > nxt:
                status += f" · runs {end - nxt + POST * 0.5:.2f} s into the next line"
            if note and k == 0:
                status += f" · {note}"
            rows.append(f"| {lid} | {k + 1} | {p['say_it_as']} | {p['in_tc_60fps']} | {t:.2f} | {e - s:.2f} | {(ratio - 1) * 100:+.0f} % | {status} |")

    if not np.abs(vo).max() > 0:
        print(f"No takes found in {os.path.relpath(a.takes, ROOT)}/ (expected {ids[0]} … {ids[-1]}, .mp3/.wav/.m4a/.flac). Nothing written.")
        return 1
    meter = pyln.Meter(SR)
    st = np.stack([vo, vo], 1)
    if np.abs(vo).max() > 0:
        st *= 10 ** ((VO_LUFS - meter.integrated_loudness(st)) / 20)
    os.makedirs(a.out, exist_ok=True)
    stem = os.path.join(a.out, "keeper_vo_placed.wav")
    sf.write(stem, st, SR, subtype="PCM_24")
    head = ("# Keeper VO fit report\n\nTakes from `" + os.path.relpath(a.takes, ROOT) + "`. Each phrase starts on its In frame; *take* is the phrase's spoken"
            " length, *slot* is how long the Keeper's mouth moves. Up to ±" + f"{a.max_stretch * 100:.0f}" + " % is stretched to fit (pitch kept); more is flagged.\n\n"
            "| Line | Phrase | Text | In (60 fps) | Slot s | Take s | Off | Result |\n|---|---|---|---|---|---|---|---|\n")
    open(os.path.join(a.out, "fit_report.md"), "w").write(head + "\n".join(rows) + "\n\n" + (f"**Redo:** {', '.join(todo)}\n" if todo else "**Every phrase fits.**\n"))
    print("\n".join(rows))
    print(f"\nwrote {os.path.relpath(stem, ROOT)} and fit_report.md · " + (f"redo: {', '.join(todo)}" if todo else "every phrase fits"))

    if a.preview:
        mp4 = os.path.join(a.out, master.replace(".mp4", "_VO.mp4"))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(FINAL, master),
                        "-i", os.path.join(FINAL, "stems", "music_ducked_for_vo.wav"), "-i", os.path.join(FINAL, "stems", "sfx.wav"), "-i", stem,
                        "-filter_complex", "[1:a][2:a][3:a]amix=inputs=3:normalize=0,volume=2.8dB,alimiter=limit=0.891:level=0[a]",
                        "-map", "0:v:0", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "320k", "-ar", "48000", "-shortest", mp4], check=True)
        print("wrote", os.path.relpath(mp4, ROOT))
    return 0


if __name__ == "__main__":
    sys.exit(main())
