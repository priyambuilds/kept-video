// S1 HOOK + S2 PROBLEM (SHOTLIST). A deliberately bland, non-KEPT habit app (system font, grey, flat):
// the only invented UI the brief allows. The Keeper leans in, judges the bed-tap, the music stops for
// "from bed.", he cloak-wipes into the streak, flicks it, swats the nags and slaps the clutter into one
// lime point (the ember that draws the brand check on the drop).
import React from "react";
import { AbsoluteFill } from "remotion";
import { Keeper } from "../keeper/Keeper";
import { handTrack, moodTrack, pointAt, talk } from "../keeper/perf";
import type { HandKey } from "../keeper/perf";
import { clamp, ease, kf, prog, wobble } from "../lib/anim";
import { color, film } from "../lib/theme";
import { Bubble } from "../ui/Caption";
import { Void } from "../ui/Backgrounds";
import { Icon } from "../ui/kit";
import { line } from "../data/cuts";
import { pick } from "./common";
import type { SceneProps } from "./common";

const SYS = `-apple-system, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif`;

function HabitList({ t, tap }: { t: number; tap: number }) {
  const done = t >= tap;
  const rows = ["Gym", "Read 10 pages", "Drink water", "Meditate"];
  return (
    <div style={{ width: 520, background: "#F2F2F7", borderRadius: 28, padding: "26px 0 10px", fontFamily: SYS, boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
      <div style={{ padding: "0 26px 14px", fontSize: 30, fontWeight: 700, color: "#1C1C1E" }}>Today's habits</div>
      {rows.map((r, i) => {
        const on = i === 0 && done;
        return (
          <div key={r} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 26px", borderTop: "1px solid #E0E0E5", background: "#FFFFFF" }}>
            <div style={{ width: 30, height: 30, borderRadius: 15, border: on ? "none" : "2px solid #C7C7CC", background: on ? "#8E8E93" : "transparent", display: "grid", placeItems: "center", transform: `scale(${on ? 1 + 0.15 * Math.max(0, 1 - (t - tap) * 6) : 1})` }}>
              {on ? <Icon name="check-bold" size={18} fill="#FFFFFF" /> : null}
            </div>
            <div style={{ fontSize: 22, color: on ? "#8E8E93" : "#1C1C1E", textDecoration: on ? "line-through" : "none" }}>{r}</div>
            {on ? <div style={{ marginLeft: "auto", fontSize: 16, color: "#8E8E93" }}>Done ✓</div> : null}
          </div>
        );
      })}
      {/* the "celebration": three sad grey dots */}
      {done ? [0, 1, 2].map((k) => {
        const p = prog(t, tap, 0.6, ease.out);
        return <div key={k} style={{ position: "absolute", left: 70 + k * 18, top: 110 - p * (30 + k * 8), width: 8, height: 8, borderRadius: 4, background: "#C7C7CC", opacity: 1 - p }} />;
      }) : null}
    </div>
  );
}

function StreakBadge({ t, flick, crack }: { t: number; flick: number; crack: number }) {
  const spin = kf(t, [[flick, 0], [crack, 340, ease.out]]);
  const n = t < crack ? 12 : Math.max(0, Math.round(12 * (1 - prog(t, crack + 0.05, 0.55, ease.in))));
  const broken = t >= crack;
  const sh = wobble(t, crack, 10, 14, 7);
  return (
    <div style={{ width: 360, padding: "34px 30px", background: "#FFFFFF", borderRadius: 32, fontFamily: SYS, textAlign: "center", transform: `rotate(${spin + sh * 0.3}deg) translateX(${sh}px)`, boxShadow: "0 30px 60px rgba(0,0,0,0.5)", position: "relative" }}>
      <Icon name="fire" size={110} fill={broken ? "#C7C7CC" : "#FF9500"} style={{ margin: "0 auto" }} />
      <div style={{ fontSize: 120, fontWeight: 800, lineHeight: 1, color: broken ? film.redOnCream : "#1C1C1E", fontVariantNumeric: "tabular-nums" }}>{n}</div>
      <div style={{ fontSize: 24, color: "#8E8E93", marginTop: 6 }}>day streak</div>
      {broken ? (
        <svg viewBox="0 0 360 340" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <path d="M190 0 L170 90 L205 140 L160 210 L190 260 L175 340" stroke="#1C1C1E" strokeWidth={4} fill="none" strokeDasharray="600" strokeDashoffset={600 * (1 - prog(t, crack, 0.12))} />
          <path d="M205 140 L270 170 M160 210 L90 230" stroke="#1C1C1E" strokeWidth={3} fill="none" strokeDasharray="200" strokeDashoffset={200 * (1 - prog(t, crack + 0.05, 0.12))} />
        </svg>
      ) : null}
    </div>
  );
}

const NAGS = ["Don't forget your habit!", "You can do it!", "Streak at risk!"];
function Nag({ text }: { text: string }) {
  return (
    <div style={{ width: 420, display: "flex", gap: 14, alignItems: "center", padding: "14px 18px", background: "rgba(242,242,247,0.96)", borderRadius: 22, fontFamily: SYS, boxShadow: "0 16px 40px rgba(0,0,0,0.45)" }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: "#C7C7CC", flex: "none" }} />
      <div><div style={{ fontSize: 15, color: "#8E8E93" }}>Habits · now</div><div style={{ fontSize: 19, fontWeight: 600, color: "#1C1C1E" }}>{text}</div></div>
    </div>
  );
}

export function S1Opening({ t, cut, fmt, W, H }: SceneProps) {
  const b = cut.b, st = b.streak;
  // ── layout ──
  const ui = pick(fmt, { h: { x: 1420, y: 520, s: 1.15 }, v: { x: 540, y: 640, s: 1.5 }, s: { x: 680, y: 400, s: 1.05 } });
  const home = pick(fmt, { h: { x: 470, y: 1010, size: 330 }, v: { x: 330, y: 1720, size: 560 }, s: { x: 250, y: 1040, size: 360 } });
  const size = home.size, k = size / 160;
  const inHook = t < b.cloak + 0.12;
  // ── the Keeper's acting: one pure function of time (so the smear can sample past frames) ──
  const lines = cut.vo.filter((l) => l.id === "L01" || l.id === "L02" || l.id === "L03a");
  const moods: [number, "side" | "bored" | "smug" | "stern"][] = [[0, "side"], [b.freeze - 0.04, "bored"], ...(st ? [[3.88, "smug"], [4.9, "bored"]] as [number, "smug" | "bored"][] : []), [b.raise, "stern"]];
  const R: HandKey[] = [];
  if (st) {
    R.push([2.8, null], [2.95, pointAt(175, 70, 70)], [st.flick - 0.05, pointAt(178, 66, 64)], [st.flick + 0.06, [190, 50, 10, "open"], ease.out], [st.flick + 0.35, null]);
    R.push([4.9, null]);
    for (const s of st.swat) R.push([s - 0.14, [165, 45, -50, "open"], ease.inOut], [s, [205, 120, 60, "open"], ease.out], [s + 0.18, [180, 100, 30, "open"], ease.inOut]);
  }
  R.push([b.raise - 0.05, R.length ? [180, 100, 30, "open"] : null], [b.raise + 0.18, [130, 62, 20, "open"], ease.out], [b.slap - 0.06, [134, 50, 25, "open"]], [b.slap, [108, 150, 70, "open"], ease.in], [b.slap + 0.4, [110, 146, 60, "open"]]);
  const L: HandKey[] = [[b.raise - 0.05, null], [b.raise + 0.18, [30, 62, -20, "open"], ease.out], [b.slap - 0.06, [26, 50, -25, "open"]], [b.slap, [52, 150, -70, "open"], ease.in], [b.slap + 0.4, [50, 146, -60, "open"]]];
  const hookXAt = (tt: number) => home.x - size * 0.75 * (1 - prog(tt, 0.2, 1.0, ease.inOut)) - size * 0.05;
  const perf = (tt: number) => {
    const hook = tt < b.cloak + 0.12;
    const mt = moodTrack(tt, moods);
    const leanIn = prog(tt, 0.2, 1.0, ease.inOut);
    const lean = hook ? -30 * (1 - leanIn) - 8 + 8 * prog(tt, b.freeze, 0.5, ease.inOut) : 0;
    const look = st && tt > 4.35 && tt < 4.95;
    const gx = hook ? kf(tt, [[0, 2], [0.6, 4], [1.1, 4], [1.75, -5, ease.inOut]]) : look ? 3 : -5;
    const twitch = tt > 0.6 && tt < 0.66 ? 0.55 : 1;
    const slapSquash = tt >= b.slap ? 1 - 0.12 * Math.sin(clamp((tt - b.slap) / 0.18) * Math.PI) : 1;
    const raiseStretch = 1 + 0.05 * (prog(tt, b.raise, 0.2, ease.out) - prog(tt, b.slap - 0.05, 0.05));
    const shrug = !!st && tt > st.shrug && tt < st.shrug + 0.75;
    const sp = talk(lines, tt, { gx, gy: look ? -2 : 0, eyes: Math.min(mt.eyes, twitch), sy: slapSquash * raiseStretch, sx: 2 - slapSquash });
    const R0 = handTrack(tt, R), L0 = handTrack(tt, L);
    return {
      x: hook ? hookXAt(tt) : home.x, y: home.y, size, lean,
      draw: {
        mood: mt.mood, anim: (shrug ? "shrug" : "idle") as "shrug" | "idle", t: shrug ? 0.001 + (tt - st!.shrug) : tt + 1.3, wiggle: sp.wiggle,
        over: { ...sp.over, ...(R0 && !shrug ? { right: R0 } : {}), ...(L0 && !shrug ? { left: L0 } : {}) },
      },
    };
  };
  const hookX = hookXAt(t);
  // ── stage ──
  const freeze = t >= b.freeze && t < b.cloak;
  const tU = freeze ? b.freeze : t; // the UI stops dead on the scratch
  // Collapse: everything is sucked into one lime point at the UI centre on the slap.
  const suck = prog(t, b.slap, 0.3, ease.in);
  const dropout = t >= b.slap + 0.3;
  const cursorP = kf(tU, [[0, 0], [0.5, 1, ease.inOut]]);
  const cur = { x: ui.x + 330 - 300 * cursorP, y: ui.y + 260 - 165 * cursorP };
  // Cloak wipe: a black robe sweeps across the lens with its lime piping.
  const cw = prog(t, b.cloak, 0.3, ease.inOut);
  const nagIn = (i: number) => st ? prog(t, st.nag[i], 0.25, ease.springHard) : 0;
  const nagOut = (i: number) => st ? prog(t, st.swat[i], 0.3, ease.in) : 0;
  const L01 = line(cut, "L01"), L02 = line(cut, "L02"), L03a = line(cut, "L03a");
  const head = { x: (inHook ? hookX : home.x) + 40 * k, y: home.y - 150 * k };
  const fs = pick(fmt, { h: 46, v: 58, s: 44 });
  return (
    <AbsoluteFill>
      <Void t={t} W={W} H={H} tone="grey" amount={dropout ? 0 : 0.8} />
      {!dropout ? (
        <div style={{ position: "absolute", left: ui.x, top: ui.y, transform: `translate(-50%,-50%) scale(${ui.s * (1 - suck)})`, filter: freeze ? "saturate(0.7)" : undefined, opacity: 1 - suck * 0.3 }}>
          {inHook ? <div style={{ position: "relative" }}><HabitList t={tU} tap={b.hookTap} /></div> : st ? (
            <div style={{ position: "relative" }}>
              <div style={{ transform: `translate(${kf(t, [[st.swat[2] - 0.05, 0], [st.swat[2] + 0.35, -260, ease.in]])}px, ${kf(t, [[st.swat[2] - 0.05, 0], [st.swat[2] + 0.35, 60, ease.in]])}px)` }}>
                <StreakBadge t={t} flick={st.flick} crack={st.crack} />
              </div>
              {NAGS.map((n, i) => (
                <div key={n} style={{
                  position: "absolute", left: 180 + i * 26, top: -120 + i * 92,
                  transform: `translate(${(1 - nagIn(i)) * 300 + nagOut(i) * 1400}px, ${-nagOut(i) * 300}px) rotate(${nagOut(i) * 50 - 4 + i * 3}deg)`, opacity: nagIn(i),
                }}><Nag text={n} /></div>
              ))}
            </div>
          ) : (
            // 15 s: no streak; the grey cards are the clutter he slaps.
            <div style={{ position: "relative" }}><HabitList t={tU} tap={b.hookTap} />{NAGS.map((n, i) => (
              <div key={n} style={{ position: "absolute", left: 140 + i * 30, top: -60 + i * 90, opacity: prog(t, b.cloak + 0.1 + i * 0.05, 0.2) }}><Nag text={n} /></div>
            ))}</div>
          )}
          {inHook && !freeze ? <svg width={28} height={40} style={{ position: "absolute", left: cur.x - ui.x + 260, top: cur.y - ui.y + 170 }} viewBox="0 0 28 40"><path d="M2 2 L2 32 L10 25 L16 38 L21 36 L15 23 L26 23 Z" fill="#FFFFFF" stroke="#1C1C1E" strokeWidth={2} /></svg> : null}
        </div>
      ) : null}
      {/* the lime point (the ember) */}
      {t >= b.slap ? <div style={{ position: "absolute", left: ui.x - 9, top: ui.y - 9, width: 18, height: 18, borderRadius: 9, background: color.lime.base, boxShadow: `0 0 ${20 + 20 * Math.sin(t * 30)}px ${color.lime.base}`, opacity: suck }} /> : null}
      <Keeper id="k-open" t={t} perf={perf} />
      {cut.bubbles !== false && L01 && inHook ? <Bubble t={t} line={L01} x={head.x} y={head.y} side="right" fs={fs} maxW={pick(fmt, { h: 560, v: 760, s: 600 })} red /> : null}
      {cut.bubbles !== false && L02 && !inHook && t < b.raise ? <Bubble t={t} line={L02} x={head.x} y={head.y} side="right" fs={fs} maxW={pick(fmt, { h: 560, v: 700, s: 560 })} red until={b.raise - 0.05} /> : null}
      {cut.bubbles !== false && L03a && t >= L03a.start - 0.1 ? <Bubble t={t} line={L03a} x={head.x} y={head.y} side="right" fs={fs} maxW={pick(fmt, { h: 620, v: 760, s: 600 })} until={b.drop1 - 0.02} /> : null}
      {cw > 0 && cw < 1 ? <Cloak p={cw} W={W} H={H} /> : null}
    </AbsoluteFill>
  );
}

/** The cloak wipe: his robe (cloak colours + lime edge piping) sweeping across the lens. */
export function Cloak({ p, W, H }: { p: number; W: number; H: number }) {
  const x = -W * 0.3 + p * W * 1.6;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, zIndex: 60 }}>
      <path d={`M${x - W * 1.2} ${-50} L${x} ${-50} C${x + W * 0.12} ${H * 0.3} ${x - W * 0.08} ${H * 0.7} ${x + W * 0.05} ${H + 50} L${x - W * 1.2} ${H + 50} Z`} fill="#1A1A1F" />
      <path d={`M${x} ${-50} C${x + W * 0.12} ${H * 0.3} ${x - W * 0.08} ${H * 0.7} ${x + W * 0.05} ${H + 50}`} stroke="#C5F25C" strokeWidth={W * 0.006} fill="none" opacity={0.7} />
      <path d={`M${x - W * 0.25} ${-50} C${x - W * 0.15} ${H * 0.35} ${x - W * 0.32} ${H * 0.65} ${x - W * 0.2} ${H + 50}`} stroke="#27272E" strokeWidth={W * 0.05} fill="none" />
    </svg>
  );
}
