// v3 building blocks: in-world time cards (the journey markers), friend name tags over phones, the 2D camera
// for multi-phone shots, the Keeper reaction close-up, small captions and the big statement type.
import React from "react";
import { clamp, ease, lerp } from "../lib/anim";
import { MONO, SANS } from "../lib/theme";
import type { Pose } from "../phone/Phone";
import { MEMBER } from "../app/theme";
import { Avatar } from "../app/kit/Avatar";
import { Keeper } from "../keeper/Keeper";
import type { Perf } from "../keeper/Keeper";
import { W, H } from "../film2/stage";

export type Who = "Y" | "R" | "A" | "D";
export const NAME: Record<Who, string> = { Y: "You", R: "Riya", A: "Arjun", D: "Dev" };

/** 2D camera over stage poses: zoom `s` about the frame centre, pan so stage point (x, y) sits at the centre, roll rz. */
export interface Cam { x: number; y: number; s: number; rz?: number }
export function viaCam(c: Cam, p: Pose): Pose {
  const a = ((c.rz ?? 0) * Math.PI) / 180;
  const dx = (p.x - c.x) * c.s, dy = (p.y - c.y) * c.s;
  return { ...p, x: W / 2 + dx * Math.cos(a) - dy * Math.sin(a), y: H / 2 + dx * Math.sin(a) + dy * Math.cos(a), s: p.s * c.s, rz: (p.rz ?? 0) + (c.rz ?? 0) };
}
export function camAt(t: number, keys: [number, Cam, ((x: number) => number)?][]): Cam {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, b, e] = keys[i], [t0, a] = keys[i - 1];
    if (t <= t1) {
      const k = (e ?? ease.inOut)(clamp((t - t0) / Math.max(1e-6, t1 - t0)));
      return { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), s: lerp(a.s, b.s, k), rz: lerp(a.rz ?? 0, b.rz ?? 0, k) };
    }
  }
  return keys[keys.length - 1][1];
}

/** Journey marker: "MON · 6:58 AM" over "DAY 1", top-left, wipes in and out. */
export function TimeCard({ t, at, out, when, day, x = 110, y = 96, red }: { t: number; at: number; out: number; when: string; day: string; x?: number; y?: number; red?: boolean }) {
  if (t < at || t > out + 0.4) return null;
  const a = ease.out(clamp((t - at) / 0.45)), b = ease.in(clamp((t - out) / 0.35));
  const accent = red ? "#F87171" : "#C5F25C";
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 150, opacity: 1 - b, transform: `translateY(${-16 * b}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, clipPath: `inset(0 ${100 - 100 * a}% 0 0)` }}>
        <div style={{ width: 12, height: 12, borderRadius: 6, background: accent, boxShadow: `0 0 18px ${accent}`, opacity: 0.5 + 0.5 * Math.abs(Math.sin(t * 3)) }} />
        <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 26, letterSpacing: 5, color: "#E8E8E8" }}>{when}</div>
      </div>
      <div style={{ overflow: "hidden", marginTop: 6 }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 88, letterSpacing: -4, lineHeight: 1, color: "#FFFFFF", transform: `translateY(${(1 - a) * 100}%)` }}>{day}</div>
      </div>
    </div>
  );
}

/** Whose phone this is: an avatar chip that floats above the phone (flat poses only). */
export function NameTag({ who, pose, t, at = -1, label, accent }: { who: Who; pose: Pose; t: number; at?: number; label?: string; accent?: string }) {
  const p = ease.outBack(clamp((t - at) / 0.4));
  if (p <= 0 || (pose.opacity ?? 1) <= 0.02) return null;
  const s = Math.max(0.55, Math.min(1.25, pose.s));
  const x = pose.x, y = pose.y - (844 / 2 + 15) * pose.s - 38 * s;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 60, transform: `translate(-50%,-50%) scale(${s * (0.7 + 0.3 * p)})`, opacity: clamp(p * 2) * (pose.opacity ?? 1), display: "flex", alignItems: "center", gap: 10, padding: "6px 18px 6px 6px", borderRadius: 30, background: "rgba(20,20,22,0.92)", boxShadow: `0 10px 30px rgba(0,0,0,0.5), inset 0 0 0 1.5px ${accent ?? "rgba(255,255,255,0.12)"}` }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, overflow: "hidden", background: MEMBER[who].color }}><Avatar config={MEMBER[who].avatar} size={40} /></div>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: "#FFFFFF", letterSpacing: -0.5, whiteSpace: "nowrap" }}>{label ?? NAME[who]}</div>
    </div>
  );
}

/** Small caption (the only explanatory text we allow): white 34 px, one line. */
export function Caption({ t, at, out, x, y, text, align = "left", size = 34 }: { t: number; at: number; out: number; x: number; y: number; text: string; align?: "left" | "center"; size?: number }) {
  if (t < at || t > out + 0.4) return null;
  const a = ease.out(clamp((t - at) / 0.4)), b = clamp((t - out) / 0.3);
  return <div style={{ position: "absolute", left: align === "center" ? x - 700 : x, width: align === "center" ? 1400 : undefined, top: y, textAlign: align, zIndex: 150, fontFamily: SANS, fontWeight: 600, fontSize: size, color: "#D9D9D9", letterSpacing: -0.5, opacity: a * (1 - b), transform: `translateY(${(1 - a) * 12}px)` }}>{text}</div>;
}

/** Big statement type, word-by-word rise, key words lime-marked. */
export function Statement({ t, at, out, x, y, lines, keys = [], red = [], size = 120, align = "left", w = 1400 }: { t: number; at: number; out: number; x: number; y: number; lines: string[]; keys?: string[]; red?: string[]; size?: number; align?: "left" | "center"; w?: number }) {
  if (t < at - 0.05 || t > out + 0.45) return null;
  const leave = ease.in(clamp((t - out) / 0.4));
  let wi = 0;
  return (
    <div style={{ position: "absolute", left: align === "center" ? x - w / 2 : x, top: y, width: w, textAlign: align, zIndex: 150, opacity: 1 - leave, transform: `translateY(${-24 * leave}px)` }}>
      {lines.map((ln, li) => (
        <div key={li} style={{ fontFamily: SANS, fontWeight: 800, fontSize: size, lineHeight: 1.0, letterSpacing: -0.045 * size, color: "#FFFFFF", whiteSpace: "nowrap" }}>
          {ln.split(" ").map((wd, k) => {
            const i = wi++;
            const p = ease.out(clamp((t - at - i * 0.07) / 0.5));
            const mk = ease.out(clamp((t - at - 0.35 - i * 0.07) / 0.35));
            const key = keys.includes(wd);
            return (
              <span key={k} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: size * 0.08, marginBottom: -size * 0.08, marginRight: size * 0.24 }}>
                <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 105}%)`, color: red.includes(wd) ? "#F87171" : undefined, backgroundImage: key ? "linear-gradient(#C5F25C,#C5F25C)" : undefined, backgroundRepeat: "no-repeat", backgroundPosition: "0 86%", backgroundSize: key ? `${mk * 100}% 32%` : undefined }}>{wd}</span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/**
 * Reaction close-up (a sitcom cutaway): a hard cut to the Keeper's face filling the frame, on a dark lime-lit
 * backdrop, for [at, out). `perf` draws him; the backdrop slowly pushes in.
 */
export function KeeperCU({ t, at, out, perf, id, tone = "lime" }: { t: number; at: number; out: number; perf: Perf; id: string; tone?: "lime" | "red" | "gold" }) {
  if (t < at || t >= out) return null;
  const c = tone === "red" ? "248,113,113" : tone === "gold" ? "255,206,84" : "197,242,92";
  const k = (t - at) / Math.max(0.1, out - at);
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 120, overflow: "hidden", background: "#0B0B0C" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(900px 700px at 50% 40%, rgba(${c},0.22), rgba(${c},0) 70%)`, transform: `scale(${1 + 0.04 * k})` }} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.05 * k})`, transformOrigin: "50% 40%" }}>
        <Keeper id={id} t={t} perf={perf} />
      </div>
      <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 220px rgba(0,0,0,0.8)" }} />
    </div>
  );
}

/** A whip-pan's blur in px for progress 0..1 (peak mid-move). */
export const whipBlur = (p: number) => 14 * Math.sin(clamp(p) * Math.PI);
