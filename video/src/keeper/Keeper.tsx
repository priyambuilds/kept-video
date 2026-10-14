// The Keeper on screen. A scene gives a `perf` function (time → pose + placement); this draws him
// with his floor point at (x, y), leans rotate about that floor point, and fast right-glove moves get
// a short motion smear (two ghost gloves from the previous frames), the film's only "blur" on him.
import React from "react";
import { FPS } from "../lib/anim";
import { KeeperSVG, rightHandMatrix } from "./KeeperSVG";
import type { KeeperDrawProps } from "./KeeperSVG";

export interface KeeperShot {
  /** Floor point (between his robe hems) in px. */
  x: number; y: number;
  /** Width in px (full body is size × 1.125 tall). */
  size: number;
  /** Lean in degrees about the floor point (+ = clockwise). */
  lean?: number;
  /** Robe sway: skewX in degrees about the floor point (+ = top moves right). */
  skew?: number;
  /** Extra CSS filter (e.g. depth-of-field blur). */
  filter?: string;
  opacity?: number;
  draw: Omit<KeeperDrawProps, "id" | "smear">;
}
export type Perf = (t: number) => KeeperShot;

const SMEAR_PX = 22; // per frame, in screen px, before ghosts appear

export function Keeper({ id, t, perf, z, depth = 0 }: { id: string; t: number; perf: Perf; z?: number; depth?: number }) {
  const s = perf(t);
  if ((s.opacity ?? 1) <= 0) return null;
  const k = s.size / 160;
  // Smear: compare the glove's position now with one and two frames ago.
  const now = rightHandMatrix(s.draw as KeeperDrawProps);
  const ghosts: number[][] = [];
  for (const back of [0.5, 1, 1.5]) {
    const p = perf(t - back / FPS);
    if (p.size !== s.size) break;
    const m = rightHandMatrix(p.draw as KeeperDrawProps);
    const d = Math.hypot(m[4] - now[4], m[5] - now[5]) * k / back;
    if (d > SMEAR_PX) ghosts.push(m);
  }
  const w = s.size, h = (s.size * 180) / 160;
  return (
    <div style={{
      position: "absolute", left: s.x - w / 2, top: s.y - (178 / 180) * h, width: w, height: h, zIndex: z,
      transform: s.lean || s.skew || depth ? `${depth ? `translateZ(${depth}px) ` : ""}rotate(${s.lean ?? 0}deg) skewX(${-(s.skew ?? 0)}deg)` : undefined, filter: s.filter, transformOrigin: `${w / 2}px ${(178 / 180) * h}px`, opacity: s.opacity ?? 1,
    }}>
      <svg viewBox="0 0 160 180" width={w} height={h} style={{ overflow: "visible", position: "absolute", inset: 0 }}>
        <KeeperSVG {...(s.draw as KeeperDrawProps)} id={id} smear={ghosts} />
      </svg>
    </div>
  );
}
