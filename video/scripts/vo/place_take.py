#!/usr/bin/env python3
"""Lays a one-take Keeper read (split by split_take.py) onto the v5 film and writes everything the render and the
mix need (docs/KEEPER_VOICE_GUIDE.md):

  video/src/data/vo5.json                   the timing map the film plays: his mouth and the subtitles follow the take
  audio/vo5/S01.wav … S33.wav               each line as placed (processed), for editors
  renders/final_v5/stems/keeper_vo.wav      the VO alone, film length, 48 kHz, −18 LUFS over speech

Placement keeps the performance: every line starts on its designed beat (data/vo5_design.json) and keeps the take's
own pauses inside it, so the read stays one continuous performance. A few lines are pinned to the picture (ANCHOR,
NOT_BEFORE). A line that would run past a hard edge (WINDOW, or the next line) first moves earlier, then gives up
pause, never speech. Sighs and laughs before a phrase stay in the audio; the mouth starts on the word.

Levels: each phrase keeps 30 % of its loudness difference from the take's median (the hushed lines stay hushed but
audible over the music), then a gentle voice chain: high-pass 80 Hz, −1.5 dB at 250 Hz, +2.5 dB at 3.2 kHz, 2.5:1
compression.

  ~/.cache/kept/tts/bin/python video/scripts/vo/place_take.py audio/vo_elevenlabs/keeper_one_take_v4.split.json
"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf, pyloudnorm as pyln

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
DATA = os.path.join(ROOT, "video", "src", "data")
SR, PAD, FILM = 48000, 0.2, 113.167
ANCHOR = {"S12": 38.25,    # Arjun's peek rises at 38.17; "Finally." lands before he sinks
          "S22": 67.05}    # inside the payday close-up (66.99–70.24)
NOT_BEFORE = {("S06", 2): 20.55,   # "I give it three days." on the How long? screen (3 · 7 · 14)
              ("S17", 0): 52.6}    # after the retry passes
WINDOW = {"S16": (49.83, 51.18), "S22": (66.99, 70.24), "S17": (52.6, 54.6), "S12": (37.9, 40.1), "S33": (110.0, 112.9)}
MIN_GAP = 0.15   # least pause kept between phrases when a line has to give some back
CHAIN = "highpass=f=80,equalizer=f=250:t=q:w=1:g=-1.5,equalizer=f=3200:t=q:w=0.9:g=2.5,acompressor=threshold=-24dB:ratio=2.5:attack=8:release=120:makeup=1.5"


def main():
    split = json.load(open(sys.argv[1]))
    design = json.load(open(os.path.join(DATA, "vo5_design.json")))["lines"]
    take = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", os.path.join(ROOT, split["file"]), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                                        check=True, capture_output=True).stdout, np.float32).copy()
    ph = split["phrases"]
    lines = {}
    for p in ph:
        lines.setdefault(p["line"], []).append(p)
    ids = list(design)
    assert ids == list(lines), "the take's lines don't match the script"

    # loudness: keep 30 % of each phrase's difference from the median
    meter = pyln.Meter(SR, block_size=0.2)
    loud = {}
    for p in ph:
        seg = take[int(p["start"] * SR):int(p["end"] * SR)]
        loud[(p["line"], p["phrase"])] = meter.integrated_loudness(np.stack([seg, seg], 1))
    med = float(np.median(list(loud.values())))
    gain = {k: float(np.clip(-0.7 * (v - med), -8, 8)) for k, v in loud.items()}

    # placement: film time of each phrase's speech start
    placed, report = {}, []
    prev_end = 0.0
    for n, lid in enumerate(ids):
        P = lines[lid]
        lead = [p["start"] - p["audio"] for p in P]
        dur = [p["end"] - p["start"] for p in P]
        gaps = [P[k]["audio"] - P[k - 1]["end"] for k in range(1, len(P))]   # pause before phrase k's first sound
        at = ANCHOR.get(lid, design[lid]["at"])
        nxt_at = ANCHOR.get(ids[n + 1], design[ids[n + 1]]["at"]) - lead_of(lines[ids[n + 1]]) if n + 1 < len(ids) else FILM
        lo, hi = WINDOW.get(lid, (None, None))
        hi = min(hi if hi is not None else FILM, nxt_at - 0.15)
        lo = max(lo if lo is not None else 0.0, prev_end + 0.15 + lead[0])
        lo = max(lo, NOT_BEFORE.get((lid, 0), 0.0))

        def layout(start, g):
            s, out = start, []
            for k in range(len(P)):
                if k:
                    s = max(out[-1][1] + g[k - 1] + lead[k], NOT_BEFORE.get((lid, k), 0.0))
                out.append((s, s + dur[k]))
            return out

        at = max(at, lo)
        lay = layout(at, gaps)
        moved = []
        if lay[-1][1] > hi:                                   # too long: start earlier, as far as allowed
            at2 = max(lo, at - (lay[-1][1] - hi))
            if at2 < at:
                moved.append(f"start {at:.2f}→{at2:.2f}"); at = at2; lay = layout(at, gaps)
        if lay[-1][1] > hi and gaps:                          # still: give back pause, never speech
            over = lay[-1][1] - hi
            room = sum(max(0, g - MIN_GAP) for g in gaps)
            k = min(1.0, over / room) if room else 0
            g2 = [g - k * max(0, g - MIN_GAP) for g in gaps]
            moved.append(f"pauses −{sum(gaps) - sum(g2):.2f}s"); lay = layout(at, g2)
        if lay[-1][1] > hi + 0.01:
            moved.append(f"OVERRUNS by {lay[-1][1] - hi:.2f}s")
        placed[lid] = lay
        prev_end = lay[-1][1]
        report.append(f"{lid}  at {lay[0][0]:6.2f} (designed {design[lid]['at']:6.2f})  ends {lay[-1][1]:6.2f}  next {nxt_at:6.2f}  {'; '.join(moved)}")

    # the VO stem: each phrase from its first sound (lead-in included) to its end, gained, faded, on the film clock
    vo = np.zeros(int(FILM * SR) + SR, np.float32)
    for lid in ids:
        for k, p in enumerate(lines[lid]):
            s_film = placed[lid][k][0]
            a = max(0.0, p["audio"] - 0.02); b = min(len(take) / SR, p["end"] + 0.08)
            seg = take[int(a * SR):int(b * SR)].copy() * 10 ** (gain[(lid, p["phrase"])] / 20)
            fi, fo = int(0.008 * SR), int(0.04 * SR)
            seg[:fi] *= np.linspace(0, 1, fi); seg[-fo:] *= np.linspace(1, 0, fo)
            i0 = int((s_film - (p["start"] - a)) * SR)
            vo[i0:i0 + len(seg)] += seg
    vo = vo[:int(FILM * SR)]
    proc = subprocess.run(["ffmpeg", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", "-af", CHAIN, "-f", "f32le", "-"],
                          input=vo.tobytes(), check=True, capture_output=True).stdout
    vo = np.frombuffer(proc, np.float32)[:int(FILM * SR)].copy()
    st = np.stack([vo, vo], 1)
    st *= 10 ** ((-18.0 - pyln.Meter(SR).integrated_loudness(st)) / 20)
    os.makedirs(os.path.join(ROOT, "renders", "final_v5", "stems"), exist_ok=True)
    sf.write(os.path.join(ROOT, "renders", "final_v5", "stems", "keeper_vo.wav"), st, SR, subtype="PCM_24")

    # the timing map the film plays, and one file per line
    out, os_ = {}, os.path.join(ROOT, "audio", "vo5")
    os.makedirs(os_, exist_ok=True)
    for lid in ids:
        P, lay = lines[lid], placed[lid]
        f0 = lay[0][0] - (P[0]["start"] - P[0]["audio"]) - PAD      # line file starts PAD before its first sound
        rel = lambda t: round(t - f0, 3)
        phrases = []
        for k, p in enumerate(P):
            sh = lay[k][0] - p["start"]
            phrases.append({"text": design[lid]["phrases"][k]["text"], "start": rel(lay[k][0]), "end": rel(lay[k][1]), "key": design[lid]["phrases"][k]["key"],
                            "words": [{"w": w["w"], "start": rel(w["start"] + sh), "end": rel(w["end"] + sh)} for w in p["words"]]})
        end = phrases[-1]["end"] + PAD
        sf.write(os.path.join(os_, f"{lid}.wav"), st[int(f0 * SR):int((f0 + end) * SR)], SR, subtype="PCM_24")
        out[lid] = {"file": f"vo5/{lid}.wav", "at": round(lay[0][0], 3), "duration": round(end, 3), "speechStart": phrases[0]["start"],
                    "speechEnd": phrases[-1]["end"], "phrases": phrases}
    json.dump({"$doc": f"Generated by video/scripts/vo/place_take.py from {split['file']} (one-take ElevenLabs read) on the designed beats of vo5_design.json. Times in seconds from the start of each line's file (audio/vo5/<id>.wav); `at` is the line's speech start on the film clock.",
               "lines": out}, open(os.path.join(DATA, "vo5.json"), "w"), indent=1, ensure_ascii=False)
    print("\n".join(report))
    print(f"phrase gains {min(gain.values()):+.1f}…{max(gain.values()):+.1f} dB · wrote vo5.json, audio/vo5/, renders/final_v5/stems/keeper_vo.wav")


def lead_of(P):
    return P[0]["start"] - P[0]["audio"]


if __name__ == "__main__":
    main()
