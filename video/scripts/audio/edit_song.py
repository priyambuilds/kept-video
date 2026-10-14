#!/usr/bin/env python3
"""Cut a generated score take to the film's bar map (video/src/film3/timeline.ts), on its own beat grid.

Recipe = film-bar segments taken from source bars, joined with 10 ms crossfades, plus the teaser's gestures:
a whole-mix tape stop on "from bed" (film bar 1), silence, a reversed swell into drop 1 (bar 2), a one-beat
dropout before midnight (bar 29), and a tail fade. Writes generated/audio/music/song/edit.wav + edit.json (bar length).
Run: ~/.cache/kept/tts/bin/python video/scripts/audio/edit_song.py B_23
"""
import sys, json, os
import numpy as np, soundfile as sf, librosa

ROOT = os.path.join(os.path.dirname(__file__), "../../generated/audio/music/song")  # npm run sync copies it to public/gen
take = sys.argv[1] if len(sys.argv) > 1 else "B_23"
CUT = sys.argv[2] if len(sys.argv) > 2 else "v3"   # v3 = film3 bar map; v4 = film4 (final) bar map
y, sr = sf.read(os.path.join(ROOT, f"{take}.wav"), dtype="float32", always_2d=True)
mono = librosa.to_mono(y.T)
yy = librosa.resample(mono, orig_sr=sr, target_sr=22050)
o = librosa.onset.onset_strength(y=yy, sr=22050)
_, beats = librosa.beat.beat_track(onset_envelope=o, sr=22050, start_bpm=123, tightness=200, units="time")
k = np.arange(len(beats)); period, t0 = np.polyfit(k, beats, 1)
grid = json.load(open(os.path.join(ROOT, f"{take}.wav.grid.json")))
down = grid["downbeat"]
# snap the downbeat phase onto the fitted beat grid
n0 = round((down - t0) / period); down = t0 + n0 * period
while down - 4 * period >= -0.01: down -= 4 * period
BAR = 4 * period
print(f"{take}: beat {period:.5f}s ({60/period:.3f} BPM), bar {BAR:.5f}s, downbeat {down:.4f}s")

XF = int(0.010 * sr)
def src(bar, nbars):
    a = int(round((down + bar * BAR) * sr)); b = int(round((down + (bar + nbars) * BAR) * sr)) + XF
    seg = y[max(0, a):b]
    if a < 0: seg = np.vstack([np.zeros((-a, 2), np.float32), seg])
    return seg

RECIPES = {
    # film bars:  0-1 intro · 2-4 drop 1 · 4-13 groove (welcome, promise) · 13-20 hook (friends) · 20-25 groove (day 1)
    #             25-29 breakdown (Arjun) · 29-33 drop 2 (payday) · 33-40 groove (review, day 7) · 40-45 hook (bounties)
    #             45-47 hook (record) · 47-50 sparse (who's your Arjun) · 50-54 last full bar + tail (CTA)
    "B_23": [(0, 2), (24, 2), (8, 9), (26, 7), (9, 5), (17, 4), (24, 4), (10, 7), (32, 5), (37, 2), (41, 3), (40, 1), (44, 3)],
    "B_11": [(0, 2), (17, 2), (7, 9), (19, 7), (8, 5), (27, 4), (34, 4), (7, 7), (38, 5), (44, 2), (50, 3), (49, 1), (50, 3)],
}
# v4 (video/src/film4/timeline.ts): 0-3 hook · 3-9 drop 1 (welcome, sign-in) · 9-16 groove + build (oath) ·
# 16-23 chorus 2 (friends) · 23-28 groove (day 1) · 28-32 breakdown + build (Arjun's night) · 32-36 chorus (midnight) ·
# 36-39 chorus tail (review) · 39-43 groove (day 7) · 43-48 chorus 2 tail (bounties) · 48-52 breakdown 2 (record, wall) ·
# 52-58 last chorus + outro (end card)
V4 = [(0, 2), (7, 1), (24, 2), (8, 4), (12, 5), (22, 2), (32, 7), (8, 5), (17, 3), (23, 1), (24, 4), (28, 3), (12, 4), (36, 5), (41, 4), (24, 4), (46, 2)]
if CUT == "v4":
    RECIPES[take] = V4
segs = [src(b, n) for b, n in RECIPES[take]]
# Overlap-add: each segment carries XF extra samples that crossfade into the next, so every join stays on the grid.
total = sum(n for _, n in RECIPES[take])
out = np.zeros((int(round(total * BAR * sr)) + XF, 2), np.float32)
pos = 0.0
for (b, n), seg in zip(RECIPES[take], segs):
    i = int(round(pos * BAR * sr)); seg = seg.copy()
    f = np.linspace(0, 1, XF, dtype=np.float32)[:, None]
    if i > 0: seg[:XF] *= f
    seg[-XF:] *= 1 - f
    out[i:i + len(seg)] += seg[:len(out) - i]
    pos += n
fb = lambda n: int(round(n * BAR * sr))
beat = lambda n: int(round(n * period * sr))

if CUT == "v4":
    # A reversed swell (the drop's first two beats, reversed) under the last half bar into drop 1 (film bar 3).
    sw = out[fb(3):fb(3) + beat(2)][::-1].copy() * (np.linspace(0, 1, beat(2)) ** 2)[:, None] * 0.55
    out[fb(3) - beat(2):fb(3)] += sw
    # One beat of silence before midnight (film bar 32).
    d = fb(32) - beat(1); out[d:fb(32)] *= np.concatenate([np.linspace(1, 0, int(0.03 * sr)), np.zeros(fb(32) - d - int(0.03 * sr))])[:, None]
    out = out[:fb(58)]
    t = np.linspace(1, 0, fb(58) - fb(56)) ** 1.5; out[fb(56):] *= t[:, None]
    out /= max(1e-6, np.abs(out).max()) / 0.89
    sf.write(os.path.join(ROOT, "edit4.wav"), out, sr, subtype="PCM_16")
    json.dump({"take": take, "bar": BAR, "bpm": 60 / period, "bars": 58, "recipe": V4}, open(os.path.join(ROOT, "edit4.json"), "w"), indent=1)
    print("wrote edit4.wav", len(out) / sr, "s"); sys.exit(0)
# Tape stop into film bar 1 (0.38 s): playback rate ramps 1 → 0.
L = int(0.38 * sr); a = fb(1) - L
rate = np.linspace(1, 0.0, L); pos = a + np.cumsum(rate)
for c in range(2):
    out[a:fb(1), c] = np.interp(pos, np.arange(len(out)), out[:, c])[:L] * np.linspace(1, 0.6, L)
# Silence until the slap, then a reversed swell (the drop's first two beats, reversed) into drop 1.
out[fb(1):fb(2)] = 0
sw = out[fb(2):fb(2) + beat(2)][::-1].copy() * (np.linspace(0, 1, beat(2)) ** 2)[:, None] * 0.8
out[fb(2) - beat(2):fb(2)] = sw
# One beat of silence before midnight (film bar 29).
d = fb(29) - beat(1); out[d:fb(29)] *= np.concatenate([np.linspace(1, 0, int(0.03 * sr)), np.zeros(fb(29) - d - int(0.03 * sr))])[:, None]
# Tail: fade the last 2 bars; total = 54 bars.
out = out[:fb(54)]
t = np.linspace(1, 0, fb(54) - fb(52)) ** 1.5; out[fb(52):] *= t[:, None]
out /= max(1e-6, np.abs(out).max()) / 0.89
sf.write(os.path.join(ROOT, "edit.wav"), out, sr, subtype="PCM_16")
json.dump({"take": take, "bar": BAR, "bpm": 60 / period, "bars": 54}, open(os.path.join(ROOT, "edit.json"), "w"), indent=1)
print("wrote edit.wav", len(out) / sr, "s")
