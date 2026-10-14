// S4 FEATURE 1, MAKE AN OATH (28 s only). The creation flow condensed into one column of real
// components (C2 object tiles, C3 length, C4 stake, C8 seats, C6 "Sign & stake"). The Keeper floats
// over and taps each choice (his glove is the cursor), slams Sign & stake, the stack flips like a
// playing card (his ace) and lands as the Oath card; he taps "Take photo" (→ S5's viewfinder).
import React from "react";
import { AbsoluteFill } from "remotion";
import { Keeper } from "../keeper/Keeper";
import { handTrack, moodTrack, pointAt, talk, toRig } from "../keeper/perf";
import type { HandKey } from "../keeper/perf";
import { clamp, ease, kf, lerp, prog } from "../lib/anim";
import { MONO, SANS, color } from "../lib/theme";
import type { TileName } from "../lib/theme";
import { Bubble } from "../ui/Caption";
import { Void } from "../ui/Backgrounds";
import { Button, Chip, Icon, IconTile, MemberTile, OathCard, Option, count, fmt as nfmt } from "../ui/kit";
import type { MemberKey } from "../ui/kit";
import { line } from "../data/cuts";
import { pick } from "./common";
import type { SceneProps } from "./common";

const OBJECTS: [string, string, TileName][] = [
  ["dumbbell", "Dumbbell", "lime"], ["book-open-variant", "Book", "vio"], ["bottle-soda-outline", "Water bottle", "sky"], ["guitar-acoustic", "Guitar", "amber"],
  ["shoe-sneaker", "Running shoe", "pink"], ["sprout", "Plant", "lime"], ["jump-rope", "Skipping rope", "pink"], ["yoga", "Yoga mat", "vio"],
];
// dp layout of the column (350 wide): y of each section's top.
const Y = { title: 0, grid: 64, goal: 214, len: 256, stake: 334, seats: 412, button: 508, h: 562 };

/** Entrance (motion.md `enter`): opacity, 16 dp rise, .98 → 1. */
const enter = (t: number, t0: number) => { const p = prog(t, t0, 0.5, ease.enter); return { opacity: p, transform: `translateY(${(1 - p) * 16}px) scale(${0.98 + 0.02 * p})` }; };

function Column({ t, o }: { t: number; o: NonNullable<SceneProps["cut"]["b"]["oath"]> }) {
  const flickIdx = t >= 10.0 && t < o.pick ? Math.floor((t - 10.0) / 0.06) % 8 : -1;
  const objOn = (i: number) => (t >= o.pick ? i === 0 : i === flickIdx);
  const lenOn = t >= o.len, stakeOn = t >= o.stake;
  const stakeN = stakeOn ? count(t, o.stake, 0, 1000, 0.6) : 1000;
  const seat = (m: MemberKey, i: number) => {
    const at = m === "you" ? 0 : o.seats + (i - 1) * 0.11;
    const p = m === "you" ? 1 : prog(t, at, 0.45, ease.spring);
    return (
      <div key={m} style={{ flex: 1, height: 84, borderRadius: 20, background: p > 0 ? color.surface[1] : color.surface.sunken, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5, transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` }}>
        {p > 0 ? <div style={{ transform: `scale(${p}) translateY(${(1 - p) * -60}px)` }}><MemberTile m={m} size={40} /></div> : <Icon name="plus" size={22} fill={color.text.tertiary} />}
        <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 600, color: p > 0 ? color.lime.base : color.text.tertiary }}>{p > 0 ? (m === "you" ? "YOU" : m.toUpperCase()) : "OPEN"}</div>
      </div>
    );
  };
  return (
    <div style={{ width: 350, height: Y.h, position: "relative", fontFamily: SANS }}>
      <div style={{ position: "absolute", top: Y.title, ...enter(t, o.start) }}>
        <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, letterSpacing: 1.4, color: color.text.tertiary }}>NEW OATH · IRON WEEK</div>
        <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: -1.1, color: color.text.primary, marginTop: 6 }}>Make an Oath</div>
      </div>
      <div style={{ position: "absolute", top: Y.grid, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, width: 350, ...enter(t, o.start + 0.1) }}>
        {OBJECTS.map(([ic, name, pal], i) => (
          <Option key={ic} on={objOn(i)} w={81.5} h={66} i={i}>
            {objOn(i) ? <IconTile icon={ic} palette={pal} size={28} tilt={0} /> : <Icon name={ic} size={22} fill={color.text.primary} />}
            <div style={{ fontSize: 10.5, fontWeight: 600 }}>{name}</div>
          </Option>
        ))}
      </div>
      {t >= o.pick ? <div style={{ position: "absolute", top: Y.goal, transform: `scale(${prog(t, o.pick, 0.4, ease.spring)})`, transformOrigin: "0 50%" }}>
        <Chip text={<span><span style={{ color: color.text.tertiary }}>Every day I will </span>lift for 20 minutes</span>} tone="dark" h={30} fs={13} />
      </div> : null}
      <div style={{ position: "absolute", top: Y.len, display: "flex", gap: 8, ...enter(t, o.len - 0.45) }}>
        {[3, 7, 14].map((n, i) => (
          <Option key={n} on={lenOn && n === 7} w={111.3} h={66} i={i}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}><span style={{ fontSize: 26, fontWeight: 600, letterSpacing: -1 }}>{n}</span><span style={{ fontSize: 12, opacity: 0.65 }}>days</span></div>
          </Option>
        ))}
      </div>
      <div style={{ position: "absolute", top: Y.stake, display: "flex", gap: 8, ...enter(t, o.stake - 0.4) }}>
        {[500, 1000, 2500].map((n, i) => {
          const on = stakeOn && n === 1000;
          return (
            <Option key={n} on={on} w={111.3} h={66} i={i}>
              <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: -0.8, fontVariantNumeric: "tabular-nums" }}>{nfmt(on ? stakeN : n)}</div>
              <div style={{ fontSize: 12, opacity: 0.65 }}>{n === 500 ? "≈ $5" : n === 1000 ? "≈ $10" : "≈ $25"}</div>
            </Option>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: Y.seats, width: 350, display: "flex", gap: 8, ...enter(t, o.seats - 0.35) }}>
        {(["you", "sam", "jo", "alex"] as MemberKey[]).map(seat)}
      </div>
      <div style={{ position: "absolute", top: Y.button, width: 350, ...enter(t, o.fist - 0.45) }}>
        <Button label="Sign & stake" kind="l" icon="draw-pen" press={t > o.slam - 0.02 && t < o.slam + 0.12 ? 1 : 0} shine={prog(t, o.fist - 0.3, 0.7)} />
      </div>
      {t >= o.slam ? <Sworn t={t} t0={o.slam} /> : null}
    </div>
  );
}

/** SignStatus success, compact: lime ring fills, check pops, "Sworn." stamp. */
function Sworn({ t, t0 }: { t: number; t0: number }) {
  const ring = prog(t, t0, 0.12, ease.out), chk = prog(t, t0 + 0.04, 0.3, ease.springHard), ping = prog(t, t0, 0.5, ease.out);
  return (
    <div style={{ position: "absolute", left: 175, top: Y.button + 27, transform: "translate(-50%,-50%)" }}>
      <div style={{ position: "absolute", left: -60, top: -60, width: 120, height: 120, borderRadius: 60, border: `3px solid ${color.lime.base}`, transform: `scale(${1 + 0.7 * ping})`, opacity: 1 - ping }} />
      <div style={{ width: 120, height: 120, borderRadius: 60, background: `conic-gradient(${color.lime.base} ${ring * 360}deg, #2A2A2A 0)`, display: "grid", placeItems: "center", transform: `scale(${0.6 + 0.4 * chk})` }}>
        <div style={{ width: 100, height: 100, borderRadius: 50, background: color.surface[1], display: "grid", placeItems: "center" }}><Icon name="check-bold" size={56 * chk} fill={color.lime.base} /></div>
      </div>
      <div style={{ position: "absolute", left: 70, top: -40, transform: `rotate(7deg) scale(${chk})` }}><Chip text="Sworn." icon="check-decagram" tone="white" h={34} fs={15} /></div>
    </div>
  );
}

/** The back of the card: his ace of spades (the hood card, as drawn in the rig). */
function AceBack({ w, h }: { w: number; h: number }) {
  return (
    <div style={{ width: w, height: h, borderRadius: 26, background: "#FAF8F2", boxShadow: "0 24px 40px rgba(0,0,0,0.45)", display: "grid", placeItems: "center", position: "relative" }}>
      <div style={{ position: "absolute", inset: 14, borderRadius: 16, border: `5px solid ${color.lime.base}` }} />
      <div style={{ position: "absolute", left: 34, top: 26, fontFamily: SANS, fontWeight: 800, fontSize: 56, color: "#0A0A0B" }}>A</div>
      <svg viewBox="22 32 12 14" width={w * 0.38} height={w * 0.44}><path d="M28 34 C24 38 23 41 26 42 C27 42.5 28 41.6 28 41 L27 45 L29 45 L28 41 C28 41.6 29 42.5 30 42 C33 41 32 38 28 34 Z" fill="#0A0A0B" /></svg>
    </div>
  );
}

export function S4Oath({ t, cut, fmt, W, H }: SceneProps) {
  const b = cut.b, o = b.oath!;
  const L = pick(fmt, {
    h: { cx: 1230, cy: 540, u: 1.62, home: { x: 560, y: 1010, size: 330 } },
    v: { cx: 540, cy: 700, u: 2.25, home: { x: 300, y: 1830, size: 480 } },
    s: { cx: 700, cy: 540, u: 1.48, home: { x: 210, y: 1050, size: 330 } },
  });
  const { u } = L;
  const bx = L.cx - 175 * u, by = L.cy - (Y.h / 2) * u;
  const sx = (dx: number) => bx + dx * u, sy = (dy: number) => by + dy * u;
  // Panel yank-in (S3 → S4): the whole dark scene rides up from the bottom.
  const inP = prog(t, b.yank, 0.38, ease.enter);
  // Where his body floats for each tap (screen px) and the glove targets.
  const size = L.home.size, k = size / 160;
  const tgt = {
    pick: [sx(41), sy(Y.grid + 33)], len: [sx(175), sy(Y.len + 33)], stake: [sx(175), sy(Y.stake + 33)],
    seats: [sx(230), sy(Y.seats + 42)], slam: [sx(175), sy(Y.button + 27)], photo: [L.cx, L.cy + 150 * u],
  } as Record<string, [number, number]>;
  const near = (p: [number, number]) => [Math.min(p[0] - 112 * k, L.cx - 60 * u), Math.max(p[1] + 78 * k, by + 140 * k)] as [number, number];
  const body = (tt: number): [number, number] => {
    const keys: [number, [number, number]][] = [[o.start, [L.home.x, L.home.y]], [o.pick - 0.3, near(tgt.pick)], [o.len - 0.35, near(tgt.len)], [o.stake - 0.3, near(tgt.stake)], [o.seats - 0.1, near(tgt.seats)], [o.fist - 0.15, near(tgt.slam)], [b.cam - 0.15, near(tgt.photo)]];
    return [kf(tt, keys.map(([a, p]) => [a, p[0]])), kf(tt, keys.map(([a, p]) => [a, p[1]]))];
  };
  const lines = cut.vo.filter((l) => l.id === "L04");
  const perf = (tt: number) => {
    const [x, y] = body(tt);
    const rig = (p: [number, number]) => toRig(p[0], p[1], x, y, size);
    const tap = (at: number, p: [number, number], rot: number): HandKey[] => {
      const [rx, ry] = rig(p);
      return [[at - 0.16, pointAt(rx - 10, ry - 14, rot)], [at, pointAt(rx, ry, rot), ease.in], [at + 0.12, pointAt(rx - 6, ry - 10, rot), ease.out]];
    };
    const [slx, sly] = rig(tgt.slam);
    const R: HandKey[] = [
      [o.start + 0.2, null], ...tap(o.pick, tgt.pick, 20), ...tap(o.len, tgt.len, 35), ...tap(o.stake, tgt.stake, 35),
      [o.seats - 0.1, [rig(tgt.seats)[0] - 30, rig(tgt.seats)[1] - 30, -20, "open"]], [o.seats + 0.35, [rig(tgt.seats)[0] - 40, rig(tgt.seats)[1] - 50, 10, "open"]],
      [o.fist - 0.05, [slx - 6, sly - 70, -10, "fist"], ease.out], [o.slam - 0.06, [slx - 4, sly - 82, -14, "fist"]], [o.slam, [slx, sly, 0, "fist"], ease.in], [o.slam + 0.2, [slx - 2, sly - 8, 0, "fist"]],
      ...tap(b.cam, tgt.photo, 25),
    ];
    const mt = moodTrack(tt, [[0, "neutral"], [o.fist - 0.1, "stern"], [o.slam + 0.3, "neutral"]]);
    const squash = tt >= o.slam ? 1 - 0.08 * Math.sin(clamp((tt - o.slam) / 0.16) * Math.PI) : 1;
    const sp = talk(lines, tt, { eyes: mt.eyes, gx: 4, sy: squash, sx: 2 - squash });
    const Rh = handTrack(tt, R);
    return { x, y: y + (1 - inP) * H, size, draw: { mood: mt.mood, t: tt + 2.1, wiggle: sp.wiggle, over: { ...sp.over, ...(Rh ? { right: Rh } : {}) } } };
  };
  // The flip: 0 → 180° (ace) → 360° (Oath card).
  const flip = kf(t, [[o.slam + 0.06, 0], [o.slam + 0.3, 360, ease.inOut]]);
  const showBack = flip > 90 && flip < 270;
  const L04 = line(cut, "L04");
  const kx = perf(t);
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inP) * H}px)`, borderRadius: inP < 1 ? 60 : 0, overflow: "hidden" }}>
      <Void t={t} W={W} H={H} />
      <div style={{ position: "absolute", left: L.cx, top: L.cy, transform: `translate(-50%,-50%) perspective(2200px) rotateY(${flip}deg)` }}>
        {flip < 90 ? <div style={{ transform: `scale(${u})` }}><Column t={t} o={o} /></div>
          : showBack ? <div style={{ transform: "rotateY(180deg)" }}><AceBack w={350 * u * 0.8} h={Y.h * u * 0.7} /></div>
            : <div style={{ transform: `scale(${u * 1.15})` }}><OathCard btn="Take photo" btnPress={t > b.cam - 0.02 && t < b.cam + 0.1 ? 1 : 0} hpShown={Math.round(20 * prog(t, o.slam + 0.3, 0.45))} /></div>}
      </div>
      <Keeper id="k-oath" t={t} perf={perf} />
      {L04 ? <Bubble t={t} line={L04} x={kx.x - 34 * k} y={kx.y - 150 * k} side="left" fs={pick(fmt, { h: 42, v: 54, s: 40 })} maxW={pick(fmt, { h: 520, v: 700, s: 480 })} until={o.slam - 0.1} /> : null}
    </AbsoluteFill>
  );
}
