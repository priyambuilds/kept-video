// Time, beat grid and easing helpers. Everything is a pure function of time in seconds, so a scene
// reads the same at any frame (deterministic renders, any format, any fps).
import { Easing } from "remotion";
import { easingTokens } from "./theme";

export const FPS = 60;
export const BPM = 137.142857; // 1 bar = 1.75 s exactly (MUSIC_BRIEF §2)
export const BEAT = 60 / BPM;   // 0.4375 s
export const BAR = BEAT * 4;
/** Time of bar.beat (both 1-based), e.g. at(11, 1) = 17.5. */
export const at = (bar: number, beat = 1) => (bar - 1) * BAR + (beat - 1) * BEAT;

const bz = (k: keyof typeof easingTokens) => {
  const v = easingTokens[k] as unknown as number[];
  return Easing.bezier(v[0], v[1], v[2], v[3]);
};
export const ease = {
  spring: bz("spring"), springSoft: bz("springSoft"), springHard: bz("springHard"), enter: bz("enter"),
  burst: bz("burst"), rise: bz("rise"), draw: bz("draw"),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),       // camera moves (RECON P2)
  out: Easing.bezier(0.16, 1, 0.3, 1),           // expo-ish out (snappy glove moves)
  in: Easing.bezier(0.55, 0, 1, 0.45),
  outBack: Easing.bezier(0.34, 1.56, 0.64, 1),
  linear: (x: number) => x,
  cubicOut: (x: number) => 1 - Math.pow(1 - x, 3), // countUp (motion.md)
};
export type EaseFn = (x: number) => number;

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** 0→1 progress of t over [t0, t0 + d], eased. */
export const prog = (t: number, t0: number, d: number, e: EaseFn = ease.linear) => e(clamp((t - t0) / d));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/** Keyframes [time, value, easeIntoThisKey?]; holds outside the range. */
export type Key = [number, number, EaseFn?];
export function kf(t: number, keys: Key[]): number {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1, e] = keys[i], [t0, v0] = keys[i - 1];
    if (t <= t1) return lerp(v0, v1, (e ?? ease.inOut)(clamp((t - t0) / (t1 - t0 || 1e-6))));
  }
  return keys[keys.length - 1][1];
}
/** Step keys [time, value]: the last key at or before t. */
export function step<T>(t: number, keys: [number, T][]): T {
  let v = keys[0][1];
  for (const [k, val] of keys) if (t >= k) v = val;
  return v;
}
/** Decaying shake / wobble: sin with exponential decay after t0. */
export const wobble = (t: number, t0: number, amp: number, hz = 12, decay = 9) =>
  t < t0 ? 0 : amp * Math.sin((t - t0) * hz * Math.PI * 2) * Math.exp(-(t - t0) * decay);
/** Deterministic hash noise in [0,1). */
export const rnd = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
