// Backgrounds (brief §9): the dark void with a very subtle lime glow that drifts slowly and never leaves
// the edges (the app's Ambient orbs, pushed to the frame edges), cream with light grain, and grain itself.
import React from "react";
import { AbsoluteFill } from "remotion";
import { film } from "../lib/theme";

export function Void({ t, W, H, tone = "lime", amount = 1 }: { t: number; W: number; H: number; tone?: "lime" | "red" | "grey"; amount?: number }) {
  const c = tone === "red" ? "248,113,113" : tone === "grey" ? "140,140,150" : "197,242,92";
  const c2 = tone === "red" ? "251,146,60" : "94,234,212";
  const m = Math.max(W, H);
  // Two orbs on slow ellipses hugging the corners (drift 16 s / 19 s like the app's `drift`).
  const a = (t / 16) * Math.PI * 2, b = (t / 19) * Math.PI * 2 + 2;
  const o1 = { x: -0.12 * W + Math.cos(a) * 0.05 * W, y: -0.15 * H + Math.sin(a) * 0.05 * H };
  const o2 = { x: 1.05 * W + Math.cos(b) * 0.05 * W, y: 1.0 * H + Math.sin(b) * 0.05 * H };
  return (
    <AbsoluteFill style={{ background: film.void }}>
      <AbsoluteFill style={{
        opacity: amount,
        background: `radial-gradient(${m * 0.55}px circle at ${o1.x}px ${o1.y}px, rgba(${c},0.16), rgba(${c},0) 70%),
          radial-gradient(${m * 0.5}px circle at ${o2.x}px ${o2.y}px, rgba(${c2},0.10), rgba(${c2},0) 70%)`,
      }} />
    </AbsoluteFill>
  );
}

export function Cream() {
  return <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 50% 40%, #F7F1E7 0%, ${film.cream} 60%, #ECE3D5 100%)` }} />;
}

/** Film grain: SVG turbulence, reseeded every 2 frames (deterministic). */
export function Grain({ frame, opacity = 0.06, blend = "multiply" }: { frame: number; opacity?: number; blend?: React.CSSProperties["mixBlendMode"] }) {
  const seed = Math.floor(frame / 2) % 50;
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: blend, pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id={`g${seed}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width="100%" height="100%" filter={`url(#g${seed})`} />
      </svg>
    </AbsoluteFill>
  );
}
