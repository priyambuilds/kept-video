// The phone: a Seeker-style Android slab (thin even bezel, punch-hole camera, flat titanium rim, right-side
// keys) holding the real 390 × 844 app screen. Lives on a CSS-3D stage; `pose` places, scales and tilts it.
import React from "react";
import type { ReactNode } from "react";
import { SCREEN_H, SCREEN_W } from "../app/Screen";

export const BEZEL = 11, RIM = 4, R_SCREEN = 44;
export const PHONE_W = SCREEN_W + 2 * (BEZEL + RIM), PHONE_H = SCREEN_H + 2 * (BEZEL + RIM);

export interface Pose {
  /** Centre of the phone in stage px. */
  x: number; y: number;
  /** Scale of the 390-dp screen (1 = 1 px per dp). */
  s: number;
  rx?: number; ry?: number; rz?: number;
  /** Depth (px toward the camera). */
  z?: number;
  opacity?: number;
  /** Blur in px (depth of field for background phones). */
  blur?: number;
  /** Dim 0..1 (focus moved elsewhere). */
  dim?: number;
}

/** Scale is applied as CSS `zoom` (re-laid-out, so text stays sharp at any size); the transform only moves and tilts. */
export function poseTransform(p: Pose) {
  return `translate3d(${(p.x - (PHONE_W * p.s) / 2) / p.s}px, ${(p.y - (PHONE_H * p.s) / 2) / p.s}px, ${(p.z ?? 0) / p.s}px) rotateX(${p.rx ?? 0}deg) rotateY(${p.ry ?? 0}deg) rotateZ(${p.rz ?? 0}deg)`;
}

/** Phone at `pose`; children = the screen content (390 × 844). `glare` 0..1 sweeps a reflection. */
export function Phone({ pose, children, glare = 0.35, shadow = true, over }: { pose: Pose; children: ReactNode; glare?: number; shadow?: boolean; over?: ReactNode }) {
  const tiltShade = Math.max(-1, Math.min(1, (pose.ry ?? 0) / 40));
  return (
    <div style={{
      position: "absolute", left: 0, top: 0, width: PHONE_W, height: PHONE_H, transformOrigin: "50% 50%", transformStyle: "preserve-3d",
      zoom: pose.s, transform: poseTransform(pose), opacity: pose.opacity ?? 1, filter: pose.blur ? `blur(${pose.blur}px)` : undefined,
    }}>
      {shadow ? <div style={{ position: "absolute", left: 30, right: 30, top: 60, bottom: -30, borderRadius: 80, background: "rgba(0,0,0,0.55)", filter: "blur(40px)", transform: "translateZ(-40px)" }} /> : null}
      {/* rim */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: R_SCREEN + BEZEL + RIM,
        background: `linear-gradient(${120 + tiltShade * 40}deg, #4a4a50 0%, #1b1b1f 18%, #0c0c0e 50%, #26262b 82%, #55555c 100%)`,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10), inset 0 1.5px 0 rgba(255,255,255,0.16)",
      }} />
      {/* keys */}
      <div style={{ position: "absolute", right: -3, top: 190, width: 4, height: 64, borderRadius: 2, background: "linear-gradient(90deg,#2a2a2e,#4b4b52)" }} />
      <div style={{ position: "absolute", right: -3, top: 290, width: 4, height: 110, borderRadius: 2, background: "linear-gradient(90deg,#2a2a2e,#4b4b52)" }} />
      {/* glass + bezel */}
      <div style={{ position: "absolute", inset: RIM, borderRadius: R_SCREEN + BEZEL, background: "#050505", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)" }} />
      {/* screen */}
      <div style={{ position: "absolute", left: RIM + BEZEL, top: RIM + BEZEL, width: SCREEN_W, height: SCREEN_H, borderRadius: R_SCREEN, overflow: "hidden", background: "#131313", isolation: "isolate" }}>
        {children}
        {/* punch hole */}
        <div style={{ position: "absolute", left: SCREEN_W / 2 - 6, top: 13, width: 12, height: 12, borderRadius: 6, background: "#000", boxShadow: "0 0 0 1.5px #1a1a1a, inset 0 0 2px rgba(80,90,140,0.6)", zIndex: 90 }} />
        {over}
        {/* glass reflection */}
        <div style={{ position: "absolute", inset: 0, zIndex: 95, pointerEvents: "none", background: `linear-gradient(${115 + tiltShade * 25}deg, rgba(255,255,255,0) 30%, rgba(255,255,255,${0.05 * glare}) 42%, rgba(255,255,255,${0.11 * glare}) 47%, rgba(255,255,255,0) 60%)` }} />
      </div>
    </div>
  );
}
