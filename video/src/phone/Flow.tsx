// What the phone shows over film time: a list of screens, each mounted at `at` (s) and clocked from there,
// with the app's real transitions (flows.md): stack push = slide from right (old screen slides 30 % left and
// dims), moments = fade, tabs = instant, back = reverse slide. Plus the touch indicator for every tap.
import React from "react";
import type { ReactNode } from "react";
import { ClockRoot } from "../app/motion";
import { E, cl } from "../app/motion";
import { SCREEN_W } from "../app/Screen";

export type Trans = "push" | "back" | "fade" | "cut" | "up";
export interface Step { at: number; el: ReactNode; trans?: Trans }
const DUR: Record<Trans, number> = { push: 0.36, back: 0.32, fade: 0.28, cut: 0, up: 0.42 };

export function Flow({ t, steps }: { t: number; steps: Step[] }) {
  let i = -1;
  for (let k = 0; k < steps.length; k++) if (t >= steps[k].at) i = k;
  if (i < 0) return null;
  const cur = steps[i], prev = steps[i - 1];
  const trans = cur.trans ?? "push";
  const d = DUR[trans];
  const p = d ? cl((t - cur.at) / d) : 1;
  const e = E.enter(p);
  const layer = (s: Step, style: React.CSSProperties, shade = 0) => (
    <div key={s.at} style={{ position: "absolute", inset: 0, ...style }}>
      <ClockRoot ms={(t - s.at) * 1000}>{s.el}</ClockRoot>
      {shade > 0 ? <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${shade})` }} /> : null}
    </div>
  );
  if (!prev || p >= 1) return layer(cur, {});
  if (trans === "push") return <>{layer(prev, { transform: `translateX(${-0.3 * SCREEN_W * e}px)` }, 0.35 * e)}{layer(cur, { transform: `translateX(${SCREEN_W * (1 - e)}px)`, boxShadow: "-20px 0 40px rgba(0,0,0,0.4)" })}</>;
  if (trans === "back") return <>{layer(cur, { transform: `translateX(${-0.3 * SCREEN_W * (1 - e)}px)` }, 0.35 * (1 - e))}{layer(prev, { transform: `translateX(${SCREEN_W * e}px)` })}</>;
  if (trans === "up") return <>{layer(prev, {}, 0.4 * e)}{layer(cur, { transform: `translateY(${844 * (1 - e)}px)` })}</>;
  return <>{layer(prev, {})}{layer(cur, { opacity: E.out(p) })}</>;
}

/** Touch indicator: a soft white fingertip dot that lands, presses (ripple) and lifts. x/y in screen dp. */
export interface Tap { at: number; x: number; y: number; hold?: number; to?: [number, number] }
export function Touches({ t, taps }: { t: number; taps: Tap[] }) {
  return (
    <>
      {taps.map((tp, i) => {
        const hold = tp.hold ?? 0.12;
        const a = t - tp.at;
        if (a < -0.28 || a > hold + 0.5) return null;
        const inP = E.out(cl((a + 0.28) / 0.22));
        const outP = cl((a - hold - 0.12) / 0.25);
        const pressed = a >= 0 && a <= hold + 0.12;
        const drag = tp.to ? E.inOut(cl(a / Math.max(0.05, hold))) : 0;
        const x = tp.to ? tp.x + (tp.to[0] - tp.x) * drag : tp.x, y = tp.to ? tp.y + (tp.to[1] - tp.y) * drag : tp.y;
        const rip = cl(a / 0.45);
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, zIndex: 85, pointerEvents: "none" }}>
            {a >= 0 && rip < 1 ? <div style={{ position: "absolute", left: tp.x - 40, top: tp.y - 40, width: 80, height: 80, borderRadius: 40, border: "2px solid rgba(255,255,255,0.7)", opacity: 0.8 * (1 - rip), transform: `scale(${0.5 + 0.9 * E.out(rip)})` }} /> : null}
            <div style={{
              position: "absolute", left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: 22,
              background: "radial-gradient(circle, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.45) 55%, rgba(255,255,255,0.0) 72%)",
              boxShadow: "0 0 0 1.5px rgba(255,255,255,0.35)",
              opacity: inP * (1 - outP), transform: `translate(${(1 - inP) * 26}px, ${(1 - inP) * 36}px) scale(${pressed ? 0.82 : 1})`,
            }} />
          </div>
        );
      })}
    </>
  );
}
export const _n: ReactNode = null;
