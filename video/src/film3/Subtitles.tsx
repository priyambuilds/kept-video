// The Keeper's lines as subtitles (v3 §0.6): bottom-centre, one phrase at a time, a small Keeper bust as the
// speaker tag. Words fill in as he says them (upcoming words wait at 30 %); key words go lime, loss words red.
// Drawn outside the 3D stage, so no phone or prop can ever cover a line.
import React from "react";
import { clamp, ease } from "../lib/anim";
import { SANS } from "../lib/theme";
import type { PlacedLine } from "../data/vo";
import { KeeperSVG } from "../keeper/KeeperSVG";
import type { KeeperMood } from "../keeper/rig";

const RED = new Set(["pays.", "out.", "bed.", "misses.", "143."]);
/** Display text that differs from the spoken words (numbers), per line id and phrase index. */
const DISPLAY: Record<string, Record<number, string>> = { K15: { 0: "Arjun? Down 143." }, K20: { 3: "On Seeker. October 16." } };
const strip = (w: string) => w.replace(/[“”"]/g, (m) => m);

export function Subtitles({ t, lines, mood = "neutral", y = 1000, W = 1920, fs = 40, skip = [] }: { t: number; lines: PlacedLine[]; mood?: KeeperMood | ((t: number) => KeeperMood); y?: number; W?: number; fs?: number; skip?: string[] }) {
  // The active phrase: the latest phrase that has started (minus a short lead-in) and is not long over.
  let cur: { line: PlacedLine; i: number; start: number; end: number } | null = null;
  for (const l of lines) {
    if (skip.includes(l.id)) continue;
    l.phrases.forEach((ph, i) => {
      const start = ph.start + l.offset, end = ph.end + l.offset;
      if (t >= start - 0.12 && t <= end + 0.9 && (!cur || start > cur.start)) cur = { line: l, i, start, end };
    });
  }
  if (!cur) return null;
  const c = cur as { line: PlacedLine; i: number; start: number; end: number };
  // Hold until the next phrase of any line starts (or 0.9 s after the end); fade 0.15 s.
  let next = Infinity;
  for (const l of lines) for (const ph of l.phrases) { const s = ph.start + l.offset; if (s > c.start + 0.01 && s < next) next = s; }
  const until = Math.min(c.end + 0.9, next - 0.12);
  const a = clamp((t - (c.start - 0.12)) / 0.15) * (1 - clamp((t - until) / 0.15));
  if (a <= 0) return null;
  const spoken = c.line.words.filter((w) => w.phrase === c.i);
  const alt = DISPLAY[c.line.id]?.[c.i];
  const words = alt ? alt.split(" ").map((w, k, all) => ({ w, start: c.start + ((c.end - c.start) * k) / all.length, key: spoken.some((x) => x.key) && k === all.length - 1 })) : spoken;
  const rise = ease.out(clamp((t - (c.start - 0.12)) / 0.3));
  const m = typeof mood === "function" ? mood(t) : mood;
  const tag = fs * 1.5;
  return (
    <div style={{ position: "absolute", left: 0, width: W, top: y, display: "flex", justifyContent: "center", zIndex: 200, pointerEvents: "none", opacity: a, transform: `translateY(${(1 - rise) * 14 - fs * 0.75}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: fs * 0.45, padding: `${fs * 0.28}px ${fs * 0.7}px ${fs * 0.28}px ${fs * 0.3}px`, borderRadius: fs * 0.9, background: "rgba(12,12,14,0.78)", boxShadow: "0 10px 40px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.07)", backdropFilter: "blur(14px)" }}>
        <div style={{ width: tag, height: tag, borderRadius: tag / 2, overflow: "hidden", background: "radial-gradient(circle at 50% 35%, #2B2F22, #121214 70%)", boxShadow: "inset 0 0 0 1.5px rgba(197,242,92,0.55)", flex: "none" }}>
          <svg viewBox="30 8 100 100" width={tag} height={tag}><KeeperSVG id="subtag" mood={m} t={t + 3} bust noFloor /></svg>
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: fs, letterSpacing: -0.02 * fs, color: "#FFFFFF", whiteSpace: "nowrap", lineHeight: 1.15 }}>
          {words.map((w, k) => {
            const on = clamp((t - w.start + 0.04) / 0.12);
            const red = RED.has(w.w.toLowerCase());
            return (
              <span key={k} style={{ marginRight: k < words.length - 1 ? fs * 0.26 : 0, opacity: 0.3 + 0.7 * on, color: w.key || red ? (red ? "#F87171" : "#C5F25C") : undefined }}>{strip(w.w)}</span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
