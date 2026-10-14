// Captions = the Keeper's speech (brief §6): a white speech bubble by his head (KeeperPlacement's bubble:
// radius 17/17/17/4, −3° / +2°, `bubble` springHard pop), words appearing as he says them, the punch
// word on a lime marker (or in red for the losses). Muted viewers get the whole film from these.
import React from "react";
import { clamp, ease, prog } from "../lib/anim";
import { SANS, color, film } from "../lib/theme";
import type { PlacedLine } from "../data/vo";

export interface BubbleProps {
  t: number;
  line: PlacedLine;
  /** Tail point (near his head) in px. */
  x: number; y: number;
  /** Which side of the tail the bubble grows to. */
  side: "left" | "right";
  fs: number;
  maxW: number;
  /** Punch-word treatment. */
  red?: boolean;
  /** Visible until (defaults to line end + 0.6 s). */
  until?: number;
  /** Phrase indices to show (default: all, accumulating). Pass to split a long line into bubbles. */
  phrases?: number[];
  scale?: number;
}

export function Bubble({ t, line, x, y, side, fs, maxW, red, until, phrases, scale = 1 }: BubbleProps) {
  const words = line.words.filter((w) => !phrases || phrases.includes(w.phrase));
  if (!words.length) return null;
  const t0 = words[0].start - 0.08, t1 = until ?? words[words.length - 1].end + 0.6;
  if (t < t0 || t > t1 + 0.15) return null;
  const pop = prog(t, t0, 0.42, ease.springHard);
  const out = prog(t, t1, 0.15, ease.in);
  const tilt = side === "right" ? 2 : -3;
  const r = fs * 1.2, tail = fs * 0.28;
  return (
    <div style={{
      position: "absolute", left: side === "right" ? x : undefined, right: side === "left" ? `calc(100% - ${x}px)` : undefined, bottom: `calc(100% - ${y}px)`,
      maxWidth: maxW, transformOrigin: side === "right" ? "0% 100%" : "100% 100%", zIndex: 40,
      transform: `translateY(${(1 - pop) * fs * 0.6}px) scale(${(0.6 + 0.4 * pop) * scale * (1 - 0.15 * out)}) rotate(${tilt}deg)`, opacity: clamp(pop * 2) * (1 - out),
    }}>
      <div style={{
        background: "#FFFFFF", color: color.text.onLime, fontFamily: SANS, fontWeight: 600, fontSize: fs, lineHeight: 1.22, letterSpacing: -0.02 * fs,
        padding: `${fs * 0.55}px ${fs * 0.75}px`, borderRadius: side === "right" ? `${r}px ${r}px ${r}px ${tail}px` : `${r}px ${r}px ${tail}px ${r}px`,
        boxShadow: "0 8px 20px rgba(0,0,0,0.40), 0 2px 0 rgba(0,0,0,0.06)",
      }}>
        {words.filter((w) => t >= w.start - 0.05).map((w, i) => {
          const a = prog(t, w.start - 0.04, 0.16, ease.out);
          const k = w.key;
          return (
            <span key={i} style={{ display: "inline-block", marginRight: fs * 0.26, opacity: a, transform: `translateY(${(1 - a) * fs * 0.25}px)` }}>
              <span style={{
                position: "relative", color: k && red ? film.redOnCream : undefined,
                backgroundImage: k && !red ? `linear-gradient(${color.lime.base}, ${color.lime.base})` : undefined,
                backgroundSize: k && !red ? `${100 * prog(t, w.start, 0.22, ease.out)}% 42%` : undefined, backgroundPosition: "0 88%", backgroundRepeat: "no-repeat",
              }}>{w.w}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
