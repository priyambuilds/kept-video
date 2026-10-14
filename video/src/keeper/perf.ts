// Performance helpers: how a scene acts the Keeper (RECON §4–5).
// - moods switch only inside a blink (eyes close ~3 frames either side of the switch)
// - hands follow keyframe tracks; `toRig` converts a screen target into rig space so a glove lands on UI
// - speech beats (head bob, punch squash, stitch wiggle) come from the placed VO, never mouth shapes
import { clamp, ease, lerp } from "../lib/anim";
import type { EaseFn } from "../lib/anim";
import { mouth, speech } from "../data/vo";
import type { PlacedLine } from "../data/vo";
import type { FrameOver, Hand, HandPose, KeeperMood } from "./rig";

/** Mood at t from switch keys, plus the eye openness that hides each switch inside a blink. */
export function moodTrack(t: number, keys: [number, KeeperMood][]): { mood: KeeperMood; eyes: number } {
  let mood = keys[0][1], eyes = 1;
  for (const [k, m] of keys) {
    if (t >= k) mood = m;
    const d = Math.abs(t - k);
    if (k > keys[0][0] && d < 0.06) eyes = Math.min(eyes, 0.12 + (d / 0.06) * 0.88);
  }
  return { mood, eyes };
}

export type HandKey = [number, Hand | null, EaseFn?];
/** Hand override from keys (null = the rig's own hand). Returns {at, mix} for FrameOver. */
export function handTrack(t: number, keys: HandKey[]): { at: Hand; mix: number } | undefined {
  if (!keys.length || t < keys[0][0]) return keys.length && keys[0][1] && t >= keys[0][0] ? { at: keys[0][1], mix: 1 } : undefined;
  for (let i = 1; i < keys.length; i++) {
    const [t1, h1, e] = keys[i], [t0, h0] = keys[i - 1];
    if (t <= t1) {
      const k = (e ?? ease.inOut)(clamp((t - t0) / (t1 - t0 || 1e-6)));
      if (h0 && h1) return { at: [lerp(h0[0], h1[0], k), lerp(h0[1], h1[1], k), lerp(h0[2], h1[2], k), k < 0.5 ? h0[3] : h1[3]], mix: 1 };
      if (h1) return { at: h1, mix: k };        // from the rig's hand into h1
      if (h0) return { at: h0, mix: 1 - k };    // from h0 back to the rig's hand
      return undefined;
    }
  }
  const last = keys[keys.length - 1][1];
  return last ? { at: last, mix: 1 } : undefined;
}

/** Screen px → rig units for a Keeper whose floor point is (x, y) at width `size`. */
export const toRig = (sx: number, sy: number, x: number, y: number, size: number) => {
  const k = size / 160;
  return [80 + (sx - x) / k, 178 + (sy - y) / k] as const;
};
/** A pointing hand whose fingertip lands on rig point (px, py), the finger rotated `rot` degrees. */
export function pointAt(px: number, py: number, rot: number, pose: HandPose = "point"): Hand {
  const a = (rot * Math.PI) / 180, tip = [-4.5 * 1.75, -19 * 1.75];
  const dx = tip[0] * Math.cos(a) - tip[1] * Math.sin(a), dy = tip[0] * Math.sin(a) + tip[1] * Math.cos(a);
  return [px - dx, py - dy, rot, pose];
}

/** Speech beats merged into a FrameOver. */
export function talk(lines: PlacedLine[], t: number, over: FrameOver = {}): { over: FrameOver; wiggle: number } {
  const s = speech(lines, t);
  const mo = mouth(lines, t);
  return {
    over: { ...over, jaw: mo.jaw, round: mo.round, ty: (over.ty ?? 0) + s.bob, tilt: (over.tilt ?? 0) + s.bob * 0.6, sy: (over.sy ?? 1) * (1 + s.squash), sx: (over.sx ?? 1) * (1 - s.squash * 0.6) },
    wiggle: s.wiggle,
  };
}
