#!/usr/bin/env python3
"""Analyse generated score takes: tempo, beat grid, first downbeat, per-bar energy (RMS dB, low/mid/high share).
Usage: ~/.cache/kept/tts/bin/python video/scripts/audio/analyse_song.py <wav> [...]  → prints a bar map + writes <wav>.grid.json"""
import sys, json
import numpy as np, librosa

for path in sys.argv[1:]:
    y, sr = librosa.load(path, sr=22050, mono=True)
    dur = len(y) / sr
    onset = librosa.onset.onset_strength(y=y, sr=sr)
    tempo, beats = librosa.beat.beat_track(onset_envelope=onset, sr=sr, start_bpm=124, tightness=400)
    bt = librosa.frames_to_time(beats, sr=sr)
    tempo = float(np.atleast_1d(tempo)[0])
    # regularise: fit a straight grid through the tracked beats
    if len(bt) > 8:
        k = np.arange(len(bt)); A = np.vstack([k, np.ones_like(k)]).T
        period, t0 = np.linalg.lstsq(A, bt, rcond=None)[0]
    else:
        period, t0 = 60 / 124, 0.0
    # downbeat phase: which of the 4 beat phases has the most low-band onset energy
    S = np.abs(librosa.stft(y, n_fft=2048, hop_length=512))
    freqs = librosa.fft_frequencies(sr=sr, n_fft=2048)
    low = S[freqs < 150].sum(0); lowt = librosa.frames_to_time(np.arange(len(low)), sr=sr, hop_length=512)
    def at(times):
        return np.interp(times, lowt, low)
    grid = t0 + period * np.arange(-4, int(dur / period) + 4)
    grid = grid[(grid >= 0) & (grid < dur)]
    phase = max(range(4), key=lambda p: at(grid[p::4]).mean())
    bars = grid[phase::4]
    rms = librosa.feature.rms(y=y, frame_length=2048, hop_length=512)[0]
    rt = librosa.frames_to_time(np.arange(len(rms)), sr=sr, hop_length=512)
    out = []
    for i, b in enumerate(bars):
        e = b + 4 * period
        m = (rt >= b) & (rt < e)
        if not m.any(): continue
        db = 20 * np.log10(rms[m].mean() + 1e-9)
        fm = (lowt >= b) & (lowt < e)
        tot = S[:, fm].sum() + 1e-9
        lo, hi = S[freqs < 250][:, fm].sum() / tot, S[freqs > 4000][:, fm].sum() / tot
        out.append({"bar": i, "t": round(float(b), 3), "db": round(float(db), 1), "low": round(float(lo), 2), "high": round(float(hi), 2)})
    peak = max(o["db"] for o in out)
    print(f"\n== {path.split('/')[-1]}  dur {dur:.1f}s  tempo {tempo:.2f} (grid {60/period:.2f} BPM)  first downbeat {bars[0]:.3f}s  bars {len(out)}")
    for o in out:
        n = max(0, int((o['db'] - peak + 30) / 1.2))
        print(f"{o['bar']:3d} {o['t']:7.2f}s {o['db']:6.1f}dB low{o['low']:.2f} hi{o['high']:.2f} " + "#" * n)
    json.dump({"bpm": 60 / period, "beat": period, "downbeat": float(bars[0]), "bars": out}, open(path + ".grid.json", "w"), indent=1)
