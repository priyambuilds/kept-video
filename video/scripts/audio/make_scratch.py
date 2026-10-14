"""Scratch music beds (28 s and 15 s) and synthesised SFX for the animatic and drafts.

Everything here is generated from oscillators and noise, so nothing is derived from the reference tracks
(audio/music-refs/ is never read). The beds follow MUSIC_BRIEF §4 / §4b bar for bar at 137.14 BPM so the
picture can be timed before audio/track.mp3 exists. They are TIMING ONLY and must never ship in a final.
The SFX are the "Ⓢ synthesise" items of docs/SFX_LIST.md (plus stand-ins for the sourced ones until
audio/sfx/ is filled); a file of the same name in audio/sfx/ always wins over these.

  ~/.cache/kept/tts/bin/python video/scripts/audio/make_scratch.py
"""
import os
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

SR = 48000
BEAT = 60 / 137.142857
BAR = BEAT * 4
OUT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "generated", "audio"))
rng = np.random.default_rng(7)
F1 = 43.65  # F1, the key root (F minor)


def t_(d): return np.arange(int(d * SR)) / SR
def noise(d): return rng.standard_normal(int(d * SR))
def lp(x, f, o=2): return sosfilt(butter(o, f, "low", fs=SR, output="sos"), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, "high", fs=SR, output="sos"), x)
def bp(x, a, b, o=2): return sosfilt(butter(o, [a, b], "band", fs=SR, output="sos"), x)
def mix(*xs):
    n = max(len(x) for x in xs); out = np.zeros(n)
    for x in xs: out[: len(x)] += x
    return out
def norm(x, peak=0.9): m = np.max(np.abs(x)) or 1; return x / m * peak
def fade(x, a=0.002, b=0.01):
    x = x.copy(); na, nb = int(a * SR), int(b * SR)
    if na: x[:na] *= np.linspace(0, 1, na)
    if nb: x[-nb:] *= np.linspace(1, 0, nb)
    return x


# ── instruments ──
def kick(dur=0.35, f0=150, f1=45, drive=1.5):
    t = t_(dur); f = f1 + (f0 - f1) * np.exp(-t * 32)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7.5)
    x += 0.4 * hp(noise(dur), 3000) * np.exp(-t * 300)
    return np.tanh(x * drive) * 0.9
def hat(dur=0.06, open_=False):
    t = t_(0.22 if open_ else dur)
    return hp(noise(len(t) / SR), 7000, 4) * np.exp(-t * (14 if open_ else 70)) * 0.35
def clap():
    t = t_(0.25); x = bp(noise(0.25), 900, 3200) * np.exp(-t * 18)
    for d in (0.008, 0.018):
        n = int(d * SR); x[n:] += bp(noise(0.25), 900, 3200)[: len(x) - n] * np.exp(-t[: len(x) - n] * 40) * 0.6
    return x * 0.5
def snare():
    t = t_(0.18); return (bp(noise(0.18), 1500, 6000) * np.exp(-t * 25) + 0.4 * np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30)) * 0.4
def tick():  # clock tick (woodblock)
    t = t_(0.05); return np.sin(2 * np.pi * 1850 * t) * np.exp(-t * 160) * 0.35
def bell(f, dur=0.5, amp=0.3, ratio=2.76):  # FM-ish metallic (coins)
    t = t_(dur); mod = np.sin(2 * np.pi * f * ratio * t) * 2.5 * np.exp(-t * 12)
    return np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 9) * amp
def saw(f, t): return 2 * ((f * t) % 1) - 1
def stab(dur=0.4, notes=(174.6, 207.7, 261.6), amp=0.35, cutoff=1800):  # F minor triad
    t = t_(dur); x = sum(saw(n, t) + saw(n * 1.006, t) for n in notes)
    return lp(x, cutoff, 2) * np.exp(-t * 7) * amp / len(notes)
def sub(dur, f=F1, amp=0.5, drive=2.2):
    t = t_(dur); x = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t)
    return np.tanh(x * drive) * amp * fade(np.ones(len(t)), 0.004, 0.03)
def boom(dur=1.3, amp=0.95):
    t = t_(dur); f = 38 + 60 * np.exp(-t * 9)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.6)
    return np.tanh(x * 1.8) * amp + 0.25 * lp(noise(dur), 300) * np.exp(-t * 12)
def riser(dur, f0=400, f1=7000, amp=0.25):
    n = int(dur * SR); x = noise(dur); out = np.zeros(n); blk = 1024
    for i in range(0, n, blk):
        k = i / n; f = f0 * (f1 / f0) ** k
        out[i:i + blk] = bp(x[i:i + blk + 512], f * 0.7, min(f * 1.4, SR / 2 - 100))[:len(out[i:i + blk])]
    return out * np.linspace(0, 1, n) ** 2 * amp
def sweep_down(dur=0.5, f0=3000, f1=60, amp=0.4):
    t = t_(dur); f = f0 * (f1 / f0) ** (t / dur)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3) * amp


class Track:
    def __init__(self, dur): self.x = np.zeros(int(dur * SR) + SR)
    def add(self, at, s, g=1.0):
        i = int(at * SR)
        if i < 0: s = s[-i:]; i = 0
        n = min(len(s), len(self.x) - i)
        if n > 0: self.x[i:i + n] += s[:n] * g
    def silence(self, a, b, fade_=0.004):
        i, j, f = int(a * SR), int(b * SR), int(fade_ * SR)
        self.x[i - f:i] *= np.linspace(1, 0, f); self.x[i:j] = 0; self.x[j:j + f] *= np.linspace(0, 1, f)
    def tape_stop(self, at, d=0.3):
        i0, i1 = int((at - d) * SR), int(at * SR)
        seg = self.x[i0:i1].copy(); n = len(seg)
        rate = np.linspace(1, 0, n) ** 1.5; pos = np.cumsum(rate)
        self.x[i0:i1] = np.interp(pos, np.arange(n), seg) * np.linspace(1, 0.3, n)


def groove(tr, a, b, *, heart=False, four=True, hats=True, claps=True, bass=True, coins=True, filt=None, ticks=False, snares=None):
    """Lay drums and bass from a to b (seconds), beat by beat."""
    n = int(round((b - a) / BEAT))
    for i in range(n):
        tb = a + i * BEAT
        if heart:
            tr.add(tb, kick(0.3, 110, 42, 1.2), 0.7); tr.add(tb + 0.16, kick(0.25, 95, 40, 1.0), 0.4)
        elif four:
            tr.add(tb, kick(), 0.95)
        if hats: tr.add(tb + BEAT / 2, hat(open_=i % 2 == 1), 0.8)
        if claps and i % 2 == 1: tr.add(tb, clap(), 0.8)
        if ticks:
            tr.add(tb, tick(), 0.6); tr.add(tb + BEAT / 2, tick(), 0.4)
        if coins:
            for s in (1, 3): tr.add(tb + s * BEAT / 4, bell(2400 + 300 * ((i + s) % 3), 0.12, 0.05, 1.41), 1)
        if bass:
            note = sub(BEAT * 0.45, F1 * (1.0 if (i // 4) % 2 == 0 else 1.189), 0.38)
            if filt: note = lp(note, filt)
            tr.add(tb + BEAT / 2, note)
        if snares == "8":
            tr.add(tb, snare(), 0.5); tr.add(tb + BEAT / 2, snare(), 0.5)
        elif snares == "16":
            for s in range(4): tr.add(tb + s * BEAT / 4, snare(), 0.35 + 0.15 * s / 3)


def halftime(tr, a, b):
    n = int(round((b - a) / BEAT))
    for i in range(n):
        tb = a + i * BEAT
        if i % 4 == 0: tr.add(tb, kick(0.5, 160, 38, 2.0), 1.0); tr.add(tb, sub(BEAT * 1.8, F1, 0.55))
        if i % 4 == 1: tr.add(tb + BEAT / 2, kick(0.3), 0.6)
        if i % 4 == 2: tr.add(tb, snare(), 0.9); tr.add(tb, clap(), 0.7)
        tr.add(tb + BEAT / 2, hat(), 0.6)
        for s in range(4): tr.add(tb + s * BEAT / 4, bell(2600 + 200 * (s % 2), 0.1, 0.045, 1.41), 1)


def bed28():
    tr = Track(28.5)
    tr.add(0, stab(0.5, cutoff=900), 1.2)
    groove(tr, 0, 1.75, heart=True, hats=False, claps=False, coins=False, filt=300)
    tr.tape_stop(1.75); tr.silence(1.75, 2.625)
    tr.add(2.625 - 0.45, riser(0.45, 300, 6000, 0.22))
    groove(tr, 2.625, 3.5, heart=True, hats=False, claps=False, coins=False, filt=500)
    groove(tr, 3.5, 5.25, four=True, hats=False, claps=False, coins=False, ticks=True, filt=800, snares="8")
    groove(tr, 5.25, 7.0, four=True, hats=True, claps=False, coins=False, ticks=True, filt=1400, snares="16")
    tr.add(3.5, riser(3.06, 300, 8000, 0.28))
    tr.silence(6.5625, 7.0)
    tr.add(7.0, boom(), 1.0); tr.add(7.0, stab(0.6), 1.0)
    groove(tr, 7.0, 17.0625)
    for s in (7.0 + BAR * k + BEAT * 2.75 for k in range(5)): tr.add(s, stab(0.25, cutoff=1400), 0.6)
    tr.silence(17.0625, 17.5)
    tr.add(17.5 - 0.44, riser(0.44, 600, 9000, 0.35))
    tr.add(17.5, boom(1.6), 1.0); tr.add(17.5, bell(3100, 0.6, 0.3, 3.1))
    halftime(tr, 17.5, 21.0)
    groove(tr, 21.0, 21.4375, hats=False, coins=False)
    for s in (21.4375, 21.875, 22.3125): tr.add(s, stab(0.3, cutoff=2400), 1.2); tr.add(s, kick(), 0.9)
    for i in range(12):  # strip back: sub pulse on 1 and 3
        tb = 22.75 + i * BEAT
        if i % 2 == 0: tr.add(tb, sub(BEAT * 0.9, F1, 0.35))
        if i % 4 == 0: tr.add(tb, kick(0.3, 100, 40, 1), 0.5)
    tr.add(24.5, boom(1.8), 1.0); tr.add(24.5, stab(1.2, cutoff=1200), 0.9)
    tr.add(26.25, sub(1.6, F1, 0.25))
    return tr.x[: int(28.0 * SR)]


def bed15():
    tr = Track(15.5)
    tr.add(0, stab(0.5, cutoff=900), 1.2)
    groove(tr, 0, 1.75, heart=True, hats=False, claps=False, coins=False, filt=300)
    tr.tape_stop(1.75); tr.silence(1.75, 2.625)
    groove(tr, 2.625, 3.5, four=True, hats=True, claps=False, coins=False, ticks=True, filt=900, snares="16")
    tr.add(2.625, riser(0.875, 400, 8000, 0.3)); tr.silence(3.0625, 3.5)
    tr.add(3.5, boom(), 1.0); tr.add(3.5, stab(0.6), 1.0)
    groove(tr, 3.5, 8.3125)
    tr.silence(8.3125, 8.75); tr.add(8.75 - 0.44, riser(0.44, 600, 9000, 0.35))
    tr.add(8.75, boom(1.6), 1.0); tr.add(8.75, bell(3100, 0.6, 0.3, 3.1))
    halftime(tr, 8.75, 11.8125)
    for i in range(8):
        tb = 11.8125 + i * BEAT
        if i % 2 == 0: tr.add(tb, sub(BEAT * 0.9, F1, 0.35))
    tr.add(12.25, boom(1.8), 1.0); tr.add(12.25, stab(1.2, cutoff=1200), 0.9)
    tr.add(14.0, sub(1.0, F1, 0.2))
    return tr.x[: int(15.0 * SR)]


def bed_launch():
    """Launch film v2 (docs/LAUNCH_FILM_PLAN.md §3): drops at 5.25 and 45.5, 87.5 s."""
    tr = Track(88.5)
    tr.add(0, stab(0.5, cutoff=700), 0.9)
    groove(tr, 0, 3.5, heart=True, hats=False, claps=False, coins=False, filt=300, ticks=True)
    groove(tr, 3.5, 4.8125, four=True, hats=False, claps=False, coins=False, ticks=True, filt=700, snares="8")
    tr.add(3.0, riser(1.8, 300, 8000, 0.26))
    tr.silence(4.8125, 5.25)
    tr.add(5.25, boom(), 1.0); tr.add(5.25, stab(0.6), 1.0)
    groove(tr, 5.25, 8.75)
    groove(tr, 8.75, 15.75, claps=False, coins=False, filt=1800)
    tr.add(15.75 - 0.44, riser(0.44, 600, 7000, 0.25))
    groove(tr, 15.75, 29.75)
    for k in range(8): tr.add(15.75 + BAR * k + BEAT * 2.75, stab(0.25, cutoff=1400), 0.55)
    groove(tr, 29.75, 33.25, ticks=True, coins=False)
    groove(tr, 33.25, 43.75, ticks=True, coins=False, claps=True, filt=2400)
    groove(tr, 43.75, 44.625, four=True, hats=False, claps=False, coins=False, snares="8", filt=900)
    groove(tr, 44.625, 45.0625, four=True, hats=True, claps=False, coins=False, snares="16", filt=1500)
    tr.add(43.75, riser(1.31, 300, 9000, 0.3))
    tr.silence(45.0625, 45.5)
    tr.add(45.5, boom(1.6), 1.0); tr.add(45.5, bell(3100, 0.6, 0.3, 3.1))
    halftime(tr, 45.5, 49.0)
    groove(tr, 49.0, 56.0)
    tr.add(56.0 - 0.44, riser(0.44, 600, 7000, 0.25)); tr.add(56.0, stab(0.4), 0.8)
    groove(tr, 56.0, 68.25)
    for k in range(7): tr.add(56.0 + BAR * k + BEAT * 2.75, stab(0.25, cutoff=1600), 0.5)
    groove(tr, 68.25, 72.5, claps=False, filt=1600)
    tr.add(72.5, boom(1.2), 0.7)
    groove(tr, 72.5, 76.5625)
    tr.add(75.25, riser(1.31, 400, 9000, 0.3)); tr.silence(76.5625, 77.0)
    tr.add(77.0, boom(1.8), 1.0); tr.add(77.0, stab(1.0, cutoff=1200), 0.9)
    for i in range(int(6.5 / BEAT)):
        tb = 77.0 + i * BEAT
        if i % 2 == 0: tr.add(tb, sub(BEAT * 0.9, F1, 0.33))
        if i % 4 == 0: tr.add(tb, kick(0.3, 100, 40, 1), 0.5)
        tr.add(tb + BEAT / 2, hat(), 0.35)
    tr.add(83.6, boom(1.8), 1.0); tr.add(83.6, stab(1.4, cutoff=1300), 0.9)
    tr.add(85.35, sub(1.8, F1, 0.22))
    return tr.x[: int(87.5 * SR)]


# ── SFX (names follow docs/SFX_LIST.md) ──
def S():
    s = {}
    t = t_
    s["sfx_01_ding_cheap"] = (np.sin(2 * np.pi * 1320 * t(0.4)) + 0.3 * np.sin(2 * np.pi * 2640 * t(0.4))) * np.exp(-t(0.4) * 9) * 0.35
    s["sfx_02_tick_cheap"] = np.sin(2 * np.pi * 900 * t(0.06)) * np.exp(-t(0.06) * 90) * 0.3
    s["sfx_03_record_scratch"] = mix(bp(noise(0.45), 500, 3000) * np.abs(np.sin(2 * np.pi * 9 * t(0.45))) * np.exp(-t(0.45) * 4) * 0.5, sweep_down(0.45, 900, 80, 0.3))
    s["sfx_04_cloth_lean"] = bp(noise(0.6), 300, 2500) * np.sin(np.pi * t(0.6) / 0.6) * 0.12
    s["sfx_05_flick"] = hp(noise(0.12), 2000) * np.exp(-t(0.12) * 60) * 0.5 + np.sin(2 * np.pi * 1400 * t(0.12)) * np.exp(-t(0.12) * 80) * 0.2
    cr = hp(noise(0.7), 2500) * np.exp(-t(0.7) * 14) * 0.5
    for k in range(9): cr += np.roll(bell(3000 + 900 * rng.random(), 0.7, 0.08, 2.3), int(rng.random() * 0.15 * SR))
    s["sfx_06_flame_crack"] = mix(cr, kick(0.3, 90, 40, 1) * 0.5)
    ct = np.zeros(int(0.65 * SR))
    for k in range(12):
        tk = np.sin(2 * np.pi * (1600 - 80 * k) * t(0.04)) * np.exp(-t(0.04) * 120) * 0.3
        i = int(k * 0.05 * SR); ct[i:i + len(tk)] += tk[: len(ct) - i]
    s["sfx_07_count_down"] = ct
    for k, f in zip("abc", (330, 300, 270)):
        s[f"sfx_08_reminder_pop_{k}"] = lp(np.sin(2 * np.pi * f * t(0.15)) + 0.5 * saw(f, t(0.15)), 900) * np.exp(-t(0.15) * 25) * 0.3
    for k, f in zip("abc", (800, 1100, 1500)):
        sw = bp(noise(0.35), f * 0.5, f * 2) * np.sin(np.pi * np.clip(t(0.35) / 0.2, 0, 1)) ** 2 * np.exp(-t(0.35) * 6) * 0.5
        sw[: int(0.01 * SR)] += hp(noise(0.01), 1500) * 0.8
        s[f"sfx_09_swat_{k}"] = sw
    sl = mix(hp(noise(0.5), 800) * np.exp(-t(0.5) * 40) * 0.8, kick(0.3, 120, 50) * 0.5)
    s["sfx_10_slap_collapse"] = mix(sl, riser(0.5, 6000, 200, 0.4)[::-1] * 0.6)
    s["sfx_11_logo_boom"] = boom(1.3)
    s["sfx_12_check_draw"] = bp(noise(0.25), 2500, 9000) * np.sin(np.pi * t(0.25) / 0.25) * 0.35
    s["sfx_13_keeper_popin"] = mix(lp(noise(0.4), 600) * np.sin(np.pi * t(0.4) / 0.4) * 0.5, sweep_down(0.3, 300, 90, 0.3))
    for k, f in zip("abcd", (2093, 2349, 2637, 2794)):
        s[f"sfx_14_tap_{k}"] = (np.sin(2 * np.pi * f * t(0.08)) * np.exp(-t(0.08) * 70) + hp(noise(0.08), 4000) * np.exp(-t(0.08) * 200)) * 0.3
    rf = np.zeros(int(0.4 * SR))
    for k in range(10): i = int(k * 0.035 * SR); c = hp(noise(0.02), 1500) * np.exp(-t(0.02) * 150) * 0.4; rf[i:i + len(c)] += c[: len(rf) - i]
    s["sfx_15_shuffle_tiles"] = rf
    cr2 = np.zeros(int(0.8 * SR))
    for k in range(16): i = int((k / 16) ** 0.7 * 0.6 * SR); c = bell(3200 + 40 * k, 0.08, 0.06, 1.41); cr2[i:i + len(c)] += c[: len(cr2) - i]
    cr2[int(0.62 * SR):] += bell(2637, 0.18, 0.25, 2.76)[: len(cr2) - int(0.62 * SR)]
    s["sfx_16_coin_roll"] = cr2
    for k, f in zip("abc", (900, 1100, 1300)):
        s[f"sfx_17_avatar_whoosh_{k}"] = bp(noise(0.25), f * 0.6, f * 2.5) * np.sin(np.pi * t(0.25) / 0.25) ** 2 * 0.35
    s["sfx_18_slam_stamp"] = mix(kick(0.4, 140, 45, 2) * 0.9, lp(noise(0.12), 2500) * np.exp(-t(0.12) * 50) * 0.6)
    s["sfx_19_card_flip"] = hp(noise(0.25), 1200) * (np.exp(-t(0.25) * 60) + 0.6 * np.exp(-np.clip(t(0.25) - 0.09, 0, None) * 60) * (t(0.25) > 0.09)) * 0.4
    s["sfx_20_viewfinder_open"] = np.concatenate([hp(noise(0.02), 2500) * 0.3, np.zeros(int(0.05 * SR)), bp(noise(0.3), 400, 3000) * np.linspace(1, 0, int(0.3 * SR)) * 0.2])
    sh = np.zeros(int(0.15 * SR)); c1 = hp(noise(0.015), 3000) * 0.6; sh[:len(c1)] += c1; sh[int(0.05 * SR):int(0.05 * SR) + len(c1)] += c1 * 0.7
    s["sfx_21_shutter"] = sh + bp(noise(0.15), 800, 5000) * np.exp(-t(0.15) * 30) * 0.2
    s["sfx_22_scan_hum"] = (saw(110, t(0.5)) * 0.2 + np.sin(2 * np.pi * 220 * t(0.5)) * 0.2) * np.sin(np.pi * t(0.5) / 0.5) * (0.6 + 0.4 * np.sin(2 * np.pi * 14 * t(0.5)))
    bz = np.sign(np.sin(2 * np.pi * 98 * t(0.14))) * 0.25
    s["sfx_23_error_buzz"] = lp(np.concatenate([bz, np.zeros(int(0.05 * SR)), bz]), 1500)
    s["sfx_24_shake"] = sum(np.roll(hp(noise(0.2), 3000) * np.exp(-t(0.2) * 40) * 0.15, int(k * 0.05 * SR)) for k in range(3))
    for k, f in zip("123", (698.5, 830.6, 1046.5)):  # F5, Ab5, C6
        s[f"sfx_25_check_tick_{k}"] = (np.sin(2 * np.pi * f * t(0.15)) + 0.3 * np.sin(2 * np.pi * 2 * f * t(0.15))) * np.exp(-t(0.15) * 22) * 0.3
    s["sfx_26_hp_fill"] = mix(riser(0.4, 1500, 9000, 0.25), sum(bell(2000 + 500 * k, 0.4, 0.03, 1.5) for k in range(4)))
    s["sfx_27_scythe_windup"] = mix(bell(1400, 0.45, 0.25, 3.7), riser(0.45, 800, 6000, 0.2)[::-1])[::-1]
    s["sfx_28_scythe_swish"] = bp(noise(0.35), 400, 6000) * np.exp(-((t(0.35) - 0.06) / 0.05) ** 2) * 0.9 + hp(noise(0.35), 3000) * np.exp(-t(0.35) * 12) * 0.2
    s["sfx_29_slice_transient"] = mix(bell(4200, 0.2, 0.35, 3.3), hp(noise(0.2), 5000) * np.exp(-t(0.2) * 50) * 0.4)
    gl = np.zeros(int(0.8 * SR))
    for k in range(40):
        i = int(rng.random() ** 2 * 0.35 * SR); c = bell(3500 + 4000 * rng.random(), 0.25, 0.05, 2.1 + rng.random()); gl[i:i + len(c)] += c[: len(gl) - i]
    s["sfx_30_glass_shatter"] = gl + hp(noise(0.8), 4000) * np.exp(-t(0.8) * 10) * 0.3
    cb = np.zeros(int(0.7 * SR))
    for k in range(30):
        i = int(rng.random() * 0.4 * SR); c = bell(2500 + 1500 * rng.random(), 0.15, 0.06, 1.41); cb[i:i + len(c)] += c[: len(cb) - i]
    s["sfx_31_coin_burst"] = cb
    for k in range(12):
        s[f"sfx_32_coin_land_{k + 1:02d}"] = mix(bell(2300 + 180 * (k % 5) + 40 * k, 0.15, 0.22, 1.41), kick(0.05, 400, 200, 1) * 0.1)
    cr3 = np.zeros(int(0.9 * SR))
    for k in range(25): i = int(k * 0.034 * SR); c = np.sin(2 * np.pi * 2600 * t(0.02)) * np.exp(-t(0.02) * 200) * 0.18; cr3[i:i + len(c)] += c[: len(cr3) - i]
    s["sfx_33_counter_roll"] = cr3
    s["sfx_34_ledger_drop"] = mix(lp(noise(0.3), 700) * np.exp(-t(0.3) * 25) * 0.6, bell(2637, 0.3, 0.12, 1.41))
    s["sfx_35_giddy_shimmy"] = sum(np.roll(bell(3000 + 300 * k, 0.12, 0.04, 1.41), int(k * 0.11 * SR)) for k in range(7))
    for k in "123":
        s[f"sfx_36_ledger_stamp_{k}"] = mix(lp(noise(0.2), 1200) * np.exp(-t(0.2) * 35) * 0.6, kick(0.15, 160, 60, 1) * 0.4)
    s["sfx_37_ledger_close"] = mix(lp(noise(0.5), 900) * np.exp(-t(0.5) * 14) * 0.7, kick(0.3, 120, 45) * 0.7)
    s["sfx_38_word_tick"] = np.sin(2 * np.pi * 3000 * t(0.03)) * np.exp(-t(0.03) * 200) * 0.12
    s["sfx_39_logo_hit_final"] = mix(boom(0.9), stab(0.6, cutoff=1500) * 0.6)
    s["sfx_40_lean_creak"] = lp(noise(0.3), 400) * np.exp(-t(0.3) * 20) * 0.4
    s["sfx_41_visor_glint"] = sum(bell(5200 + 700 * k, 0.4, 0.06, 1.5) * (1 if k == 0 else 0.5) for k in range(3))
    st = np.concatenate([(bell(523.25, 0.6, 0.3, 2.0)[::-1]), hp(noise(0.03), 2000) * 0.3])
    s["sfx_42_sting_watching"] = st
    return s


def main():
    os.makedirs(os.path.join(OUT, "music"), exist_ok=True)
    os.makedirs(os.path.join(OUT, "sfx"), exist_ok=True)
    for name, x in (("scratch_28", bed28()), ("scratch_15", bed15()), ("scratch_launch", bed_launch())):
        x = norm(lp(x, 14000), 0.7)
        sf.write(os.path.join(OUT, "music", f"{name}.wav"), np.stack([x, x], 1), SR, subtype="PCM_16")
    for name, x in S().items():
        x = np.asarray(x, dtype=np.float64)
        sf.write(os.path.join(OUT, "sfx", f"{name}.wav"), fade(norm(x, 0.8), 0.001, 0.005), SR, subtype="PCM_16")
    print("wrote", OUT)


if __name__ == "__main__":
    main()
