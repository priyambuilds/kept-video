#!/usr/bin/env python3
"""Ducks the music stem under a script's Keeper lines, for the editor: the same curve as Sound4's "musicDucked" stem
(−7 dB while a line plays, 80 ms in, 350 ms out), without a Remotion render. The music itself doesn't change between
scripts, only where it dips.

  ~/.cache/kept/tts/bin/python video/scripts/audio/duck_stem.py v5   → renders/final_v5/stems/music_ducked_for_vo.wav
  ~/.cache/kept/tts/bin/python video/scripts/audio/duck_stem.py v4 OUT.wav   (check against the rendered v4 stem)
"""
import csv, os, sys
import numpy as np, soundfile as sf

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
SHEETS = {"v4": "renders/final/KEPT_launch_final_VO_script.csv", "v5": "renders/final_v5/KEPT_launch_v5_VO_script.csv"}


def main():
    ver = sys.argv[1] if len(sys.argv) > 1 else "v5"
    out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, f"renders/final_{ver}/stems/music_ducked_for_vo.wav")
    spans = {}
    for r in csv.DictReader(open(os.path.join(ROOT, SHEETS[ver]))):   # a line ducks from its first phrase to its last
        a, b = spans.get(r["line"], (float(r["in_s"]), 0.0))
        spans[r["line"]] = (a, float(r["out_s"]))
    y, sr = sf.read(os.path.join(ROOT, "renders/final/stems/music.wav"), dtype="float32")
    t = np.arange(len(y)) / sr
    g = np.zeros(len(y))
    depth = -7.0
    for s, e in spans.values():
        a = s - 0.08
        g = np.minimum(g, np.where((t >= a) & (t <= e), depth, 0))
        g = np.minimum(g, np.where((t > e) & (t < e + 0.35), depth * (1 - (t - e) / 0.35), 0))
        g = np.minimum(g, np.where((t > a - 0.08) & (t < a), depth * ((t - (a - 0.08)) / 0.08), 0))
    os.makedirs(os.path.dirname(out), exist_ok=True)
    sf.write(out, y * (10 ** (g / 20))[:, None], sr, subtype="PCM_24")
    print(f"{len(spans)} lines ducked → {os.path.relpath(out, ROOT)}")


if __name__ == "__main__":
    main()
