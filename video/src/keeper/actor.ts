// The Keeper's body acting for v3 (docs/LAUNCH_FILM_V3_PLAN.md §4), layered on the on-model rig:
// travel along keyed paths (glides, or hops with anticipation / stretch / landing squash), lean from velocity,
// a robe sway that lags the move (follow-through), and a bigger breath. Pure functions of time.
import { clamp, ease, lerp } from "../lib/anim";
import type { EaseFn } from "../lib/anim";

/** [time, x, y, ease into this key, hop height px (0 = glide)]. */
export type PathKey = [number, number, number, EaseFn?, number?];

function pos(t: number, keys: PathKey[]): { x: number; y: number; air: number; seg: number } {
  if (t <= keys[0][0]) return { x: keys[0][1], y: keys[0][2], air: 0, seg: -1 };
  for (let i = 1; i < keys.length; i++) {
    const [t1, x1, y1, e, hop] = keys[i], [t0, x0, y0] = keys[i - 1];
    if (t <= t1) {
      const lp = clamp((t - t0) / Math.max(1e-6, t1 - t0));
      const k = (e ?? ease.inOut)(lp);
      const h = hop ?? 0;
      return { x: lerp(x0, x1, k), y: lerp(y0, y1, k) - h * 4 * lp * (1 - lp), air: h > 0 ? lp : 0, seg: i };
    }
  }
  const l = keys[keys.length - 1];
  return { x: l[1], y: l[2], air: 0, seg: keys.length };
}

export interface Body { x: number; y: number; lean: number; skew: number; sx: number; sy: number; vx: number }
/** Body state at t: position, lean (deg), robe skew (deg), squash/stretch about the floor point. */
export function body(t: number, keys: PathKey[], o: { leanK?: number; breath?: number } = {}): Body {
  const p = pos(t, keys);
  const dt = 1 / 60;
  const a = pos(t - dt, keys), b = pos(t + dt, keys);
  const vx = (b.x - a.x) / (2 * dt);
  const lag = pos(t - 0.1, keys), lag2 = pos(t - 0.1 - 2 * dt, keys);
  const vLag = (lag.x - lag2.x) / (2 * dt);
  const lean = clamp(vx * (o.leanK ?? 0.008), -10, 10);
  const skew = clamp(-vLag * 0.006, -7, 7) + clamp(vx * 0.002, -2, 2);
  // Squash & stretch around hops: anticipation (0.12 s before take-off), stretch at mid-air, landing squash.
  let sy = 1;
  for (let i = 1; i < keys.length; i++) {
    const hop = keys[i][4] ?? 0;
    if (!hop) continue;
    const t0 = keys[i - 1][0], t1 = keys[i][0];
    const pre = (t - (t0 - 0.12)) / 0.12;
    if (pre >= 0 && pre < 1) sy *= 1 - 0.12 * Math.sin(pre * Math.PI);
    if (t >= t0 && t <= t1) sy *= 1 + 0.08 * Math.sin(((t - t0) / (t1 - t0)) * Math.PI);
    const post = (t - t1) / 0.22;
    if (post >= 0 && post < 1) sy *= 1 - 0.14 * Math.sin(post * Math.PI) * (1 - post);
  }
  sy *= 1 + (o.breath ?? 0.014) * Math.sin(t * 2.4);
  return { x: p.x, y: p.y, lean, skew, sx: 1 / Math.sqrt(sy), sy, vx };
}

/** A beat bob (head nod on the music) between t0 and t1: returns rig `ty` units. */
export const groove = (t: number, t0: number, t1: number, beat: number, amp = 2.2) =>
  t < t0 || t > t1 ? 0 : amp * Math.pow(Math.abs(Math.sin(((t - t0) / beat) * Math.PI)), 3) * clamp((t - t0) / 0.3) * clamp((t1 - t) / 0.3);
