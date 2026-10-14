// Film helpers: the dark stage (KEPT #0E0E0E, lime edge glow, grain), a CSS-3D camera space, pose keyframes,
// and the headline typography (mono eyebrow + heavy Geist, word-by-word mask reveal, lime marker on key words).
import React from "react";
import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { clamp, ease, lerp } from "../lib/anim";
import type { EaseFn } from "../lib/anim";
import { MONO, SANS } from "../lib/theme";
import type { Pose } from "../phone/Phone";
import { PHONE_H, PHONE_W } from "../phone/Phone";

export const W = 1920, H = 1080;

/** Pose keyframes: [time, pose, ease into this key]. Fields missing from a key hold their previous value. */
export type PoseKey = [number, Partial<Pose>, EaseFn?];
export function poseAt(t: number, keys: PoseKey[]): Pose {
  const full: Pose[] = [];
  let acc: Pose = { x: W / 2, y: H / 2, s: 1, rx: 0, ry: 0, rz: 0, z: 0, opacity: 1, blur: 0, dim: 0 };
  for (const k of keys) { acc = { ...acc, ...k[1] }; full.push(acc); }
  if (t <= keys[0][0]) return full[0];
  for (let i = 1; i < keys.length; i++) {
    const t0 = keys[i - 1][0], t1 = keys[i][0];
    if (t <= t1) {
      const e = (keys[i][2] ?? ease.inOut)(clamp((t - t0) / Math.max(1e-6, t1 - t0)));
      const a = full[i - 1], b = full[i];
      const o: Record<string, number> = {};
      for (const f of Object.keys(b) as (keyof Pose)[]) o[f] = lerp((a[f] ?? 0) as number, (b[f] ?? 0) as number, e);
      return o as unknown as Pose;
    }
  }
  return full[full.length - 1];
}
/** Pose that puts screen point (sx, sy) (dp) at stage point (X, Y) at scale s (no tilt). */
export function focus(sx: number, sy: number, X: number, Y: number, s: number): Partial<Pose> {
  return { x: X - (sx - 195) * s, y: Y - (sy - 422) * s, s };
}
/** Stage px of a screen point for a flat (untilted) pose. */
export function screenToStage(p: Pose, sx: number, sy: number): [number, number] {
  return [p.x + (sx - 195) * p.s, p.y + (sy - 422) * p.s];
}
export const _dims = { PHONE_W, PHONE_H };

export function Stage({ t, children, glow = "lime", glowAmt = 1 }: { t: number; children: ReactNode; glow?: "lime" | "red" | "none"; glowAmt?: number }) {
  const a = (t / 16) * Math.PI * 2, b = (t / 19) * Math.PI * 2 + 2;
  const c = glow === "red" ? "248,113,113" : "197,242,92";
  return (
    <AbsoluteFill style={{ background: "#0E0E0E", overflow: "hidden" }}>
      {glow !== "none" ? <AbsoluteFill style={{ opacity: glowAmt, background: `radial-gradient(1100px circle at ${-200 + Math.cos(a) * 90}px ${-160 + Math.sin(a) * 60}px, rgba(${c},0.15), rgba(${c},0) 70%), radial-gradient(1000px circle at ${2050 + Math.cos(b) * 90}px ${1120 + Math.sin(b) * 60}px, rgba(94,234,212,0.09), rgba(94,234,212,0) 70%)` }} /> : null}
      <AbsoluteFill style={{ perspective: 2600, perspectiveOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>{children}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/** Headline: eyebrow, lines of heavy type revealed word by word, key words marked lime, a sub line. */
export function Headline({ t, at, out, x, y, w = 760, eyebrow, lines, keys = [], red = [], sub, size = 88, align = "left", color = "#FFFFFF" }: {
  t: number; at: number; out?: number; x: number; y: number; w?: number; eyebrow?: string; lines: string[]; keys?: string[]; red?: string[]; sub?: string; size?: number; align?: "left" | "center"; color?: string;
}) {
  if (t < at - 0.05 || (out !== undefined && t > out + 0.45)) return null;
  const leave = out !== undefined ? ease.in(clamp((t - out) / 0.4)) : 0;
  let wi = 0;
  const stag = 0.05;
  const words = lines.map((ln) => ln.split(" "));
  const total = words.flat().length;
  const subAt = at + 0.25 + total * stag;
  return (
    <div style={{ position: "absolute", left: align === "center" ? x - w / 2 : x, top: y, width: w, textAlign: align, opacity: 1 - leave, transform: `translateY(${-30 * leave}px)`, zIndex: 30 }}>
      {eyebrow ? (
        <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 21, letterSpacing: 4, color: "#C5F25C", marginBottom: 22, opacity: clamp((t - at) / 0.3), transform: `translateX(${(1 - ease.out(clamp((t - at) / 0.5))) * -20}px)` }}>{eyebrow}</div>
      ) : null}
      {words.map((ln, li) => (
        <div key={li} style={{ fontFamily: SANS, fontWeight: 800, fontSize: size, lineHeight: 1.02, letterSpacing: -0.045 * size, color, whiteSpace: "nowrap" }}>
          {ln.map((wd, k) => {
            const i = wi++;
            const p = ease.out(clamp((t - at - 0.12 - i * stag) / 0.55));
            const isKey = keys.includes(wd), isRed = red.includes(wd);
            const mk = ease.out(clamp((t - at - 0.45 - i * stag) / 0.35));
            return (
              <span key={k} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: size * 0.08, marginBottom: -size * 0.08, marginRight: size * 0.24 }}>
                <span style={{
                  display: "inline-block", transform: `translateY(${(1 - p) * 105}%)`, color: isRed ? "#F87171" : undefined,
                  backgroundImage: isKey ? "linear-gradient(#C5F25C, #C5F25C)" : undefined, backgroundRepeat: "no-repeat", backgroundPosition: "0 86%", backgroundSize: isKey ? `${mk * 100}% 34%` : undefined,
                  ...(isKey ? { color: mk > 0.5 ? "#FFFFFF" : undefined } : {}),
                }}>{wd}</span>
              </span>
            );
          })}
        </div>
      ))}
      {sub ? <div style={{ marginTop: 26, fontFamily: SANS, fontWeight: 500, fontSize: 30, lineHeight: 1.3, color: "#9A9A9A", letterSpacing: -0.4, maxWidth: w, opacity: clamp((t - subAt) / 0.4), transform: `translateY(${(1 - ease.out(clamp((t - subAt) / 0.5))) * 12}px)` }}>{sub}</div> : null}
    </div>
  );
}
