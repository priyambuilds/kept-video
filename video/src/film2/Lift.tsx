// A piece of the app lifted out of the phone into 3D (Ref A, 5.5 s): it starts exactly over its place on the
// screen, rises toward the camera with a tilt and a deep shadow while the phone dims, then (optionally) settles back.
import React from "react";
import type { ReactNode } from "react";
import { ClockRoot } from "../app/motion";
import { clamp, ease, lerp } from "../lib/anim";
import type { Pose } from "../phone/Phone";

export interface LiftTarget { x: number; y: number; s: number; rx?: number; ry?: number; rz?: number }
/** `rect` = [x, y, w, h] on the screen (dp). Up at [a0, a1], back down at [b0, b1] (omit b0 to stay). */
export function Lift({ t, pose, rect, to, a0, a1, b0, b1, children, ms = 9000 }: { t: number; pose: Pose; rect: [number, number, number, number]; to: LiftTarget; a0: number; a1: number; b0?: number; b1?: number; children: ReactNode; ms?: number }) {
  if (t < a0 || (b1 !== undefined && t > b1)) return null;
  const up = ease.out(clamp((t - a0) / (a1 - a0)));
  const down = b0 !== undefined && b1 !== undefined ? ease.inOut(clamp((t - b0) / (b1 - b0))) : 0;
  const k = up * (1 - down);
  const [rx, ry, rw, rh] = rect;
  const sx = pose.x + (rx + rw / 2 - 195) * pose.s, sy = pose.y + (ry + rh / 2 - 422) * pose.s;
  const x = lerp(sx, to.x, k), y = lerp(sy, to.y, k), s = lerp(pose.s, to.s, k);
  return (
    <div style={{
      position: "absolute", left: 0, top: 0, width: rw, height: rh, zoom: s, transformStyle: "preserve-3d", zIndex: 25,
      transform: `translate3d(${(x - (rw * s) / 2) / s}px, ${(y - (rh * s) / 2) / s}px, ${Math.max(220 * k, 90 * (1 - Math.pow(down, 6)) * (up > 0 ? 1 : 0)) / s}px) rotateX(${lerp(pose.rx ?? 0, to.rx ?? 0, k)}deg) rotateY(${lerp(pose.ry ?? 0, to.ry ?? 0, k)}deg) rotateZ(${(to.rz ?? 0) * k}deg)`,
    }}>
      <div style={{ position: "absolute", inset: -6, borderRadius: 30, background: "rgba(0,0,0,0.6)", filter: `blur(${10 + 30 * k}px)`, transform: `translate(${14 * k}px, ${40 * k}px)`, opacity: k }} />
      <ClockRoot ms={ms}>{children}</ClockRoot>
    </div>
  );
}
