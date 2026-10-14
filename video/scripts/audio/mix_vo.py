#!/usr/bin/env python3
"""The voiced master for the v5 film: the music ducked under the Keeper's lines, the SFX, and his voice
(renders/final_v5/stems/keeper_vo.wav from place_take.py), mastered to −14 LUFS integrated, −1 dBTP.

The duck is the same curve as duck_stem.py (80 ms in, 350 ms out) but deeper (−10 dB): with a real voice on top,
−7 dB left the drops too close to him. The script reports how far the voice sits above the music and SFX on every
line (K-weighted, 400 ms blocks), so a buried line shows up here, not on a phone speaker.

  ~/.cache/kept/tts/bin/python video/scripts/audio/mix_vo.py [--depth -10] [--vo-gain 1.5]
  → renders/final_v5/stems/master_with_vo.wav
"""
import argparse, csv, os, subprocess
import numpy as np, soundfile as sf, pyloudnorm as pyln

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
F = os.path.join(ROOT, "renders", "final_v5")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--depth", type=float, default=-10.0)
    ap.add_argument("--vo-gain", type=float, default=1.5, help="dB on the −18 LUFS voice stem")
    a = ap.parse_args()
    spans = {}
    for r in csv.DictReader(open(os.path.join(F, "KEPT_launch_v5_VO_script.csv"))):
        s, e = spans.get(r["line"], (float(r["in_s"]), 0.0))
        spans[r["line"]] = (s, float(r["out_s"]))
    music, sr = sf.read(os.path.join(ROOT, "renders", "final", "stems", "music.wav"), dtype="float32")
    sfx, _ = sf.read(os.path.join(F, "stems", "sfx.wav"), dtype="float32")
    vo, _ = sf.read(os.path.join(F, "stems", "keeper_vo.wav"), dtype="float32")
    n = min(len(music), len(sfx), len(vo))
    music, sfx, vo = music[:n], sfx[:n], vo[:n] * 10 ** (a.vo_gain / 20)
    t = np.arange(n) / sr
    g = np.zeros(n)
    for s, e in spans.values():
        x = s - 0.08
        g = np.minimum(g, np.where((t >= x) & (t <= e), a.depth, 0))
        g = np.minimum(g, np.where((t > e) & (t < e + 0.35), a.depth * (1 - (t - e) / 0.35), 0))
        g = np.minimum(g, np.where((t > x - 0.08) & (t < x), a.depth * ((t - (x - 0.08)) / 0.08), 0))
    bed = music * (10 ** (g / 20))[:, None] + sfx
    mix = bed + vo

    m = pyln.Meter(sr, block_size=0.4)
    rows = []
    for lid, (s, e) in spans.items():
        i, j = int(s * sr), int(max(e, s + 0.45) * sr)
        rows.append((m.integrated_loudness(vo[i:j]) - m.integrated_loudness(bed[i:j]), lid))
    rows.sort()
    mask = np.zeros(n, bool)
    for s, e in spans.values():
        mask[int(s * sr):int(e * sr)] = True
    print(f"voice above music+SFX over the speech: {pyln.Meter(sr).integrated_loudness(vo[mask]) - pyln.Meter(sr).integrated_loudness(bed[mask]):.1f} LU; "
          f"lowest lines: " + ", ".join(f"{l} {d:.1f}" for d, l in rows[:5]))

    # master: gain to −14 LUFS, then a limiter; re-measure the true peak with ffmpeg's ebur128
    raw = os.path.join(F, "stems", "_mix_raw.wav")
    sf.write(raw, mix * 10 ** ((-14.0 - pyln.Meter(sr).integrated_loudness(mix)) / 20), sr, subtype="FLOAT")
    out = os.path.join(F, "stems", "master_with_vo.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af", "alimiter=limit=0.84:attack=2:release=60:level=0", "-c:a", "pcm_s24le", out], check=True)
    os.remove(raw)
    rep = subprocess.run(["ffmpeg", "-hide_banner", "-i", out, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    summ = [l.strip() for l in rep.splitlines() if l.strip().startswith(("I:", "Peak:"))][-2:]
    print("master:", " · ".join(summ), "→", os.path.relpath(out, ROOT))


if __name__ == "__main__":
    main()
