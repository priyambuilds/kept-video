// Act 3 · Bring your friends (v3 §2): the heart of the film. Your invite QR, full-bleed → pull back: three more
// phones (Riya, Arjun, Dev) slide in and get the invite → Riya reads it and joins → whip to Arjun, who hasn't even
// opened it ("Even Arjun.") → he joins → whip to Dev, already in → wide: each friend's avatar flies from their phone
// into your seats, the pot climbs to 4,000 SKR → the four phones settle like cards on a table.
import React from "react";
import { clamp, ease, lerp } from "../lib/anim";
import { MONO, SANS } from "../lib/theme";
import { Phone } from "../phone/Phone";
import type { Pose } from "../phone/Phone";
import { Flow, Touches } from "../phone/Flow";
import { InviteC8, SwornC7ok } from "../app/screens/oath";
import { LockM1 } from "../app/screens/onboarding";
import { InviteE2, JoinE2s } from "../app/screens/social";
import { MEMBER } from "../app/theme";
import { Avatar } from "../app/kit/Avatar";
import { Keeper } from "../keeper/Keeper";
import { moodTrack, talk } from "../keeper/perf";
import { body } from "../keeper/actor";
import { NameTag, Statement, camAt, viaCam, whipBlur } from "./common";
import type { Cam, Who } from "./common";
import { T, vo } from "./timeline";

export const ROW: Record<Who, number> = { Y: 330, R: 750, A: 1170, D: 1590 };
const ROW_Y = 560, PS = 0.62;
const SEAT_X: Record<"R" | "A" | "D", number> = { R: 150, A: 240, D: 329 };
const SEAT_Y = 514;
const worldOf = (who: Who, sx: number, sy: number): [number, number] => [ROW[who] + (sx - 195) * PS, ROW_Y + (sy - 422) * PS];

export function ActFriends({ t }: { t: number }) {
  const a = T.friends;
  if (t < a || t >= T.day1) return null;
  const m = (at: number, x: number) => (x - at) * 1000;
  // ── camera ──
  const toward = (who: Who, s = 1.6): Cam => ({ x: ROW[who], y: ROW_Y - 10, s });
  const cam = camAt(t, [
    [a, { x: 273.6, y: 557.2, s: 1.774 }],
    [a + 0.55, { x: 193.5, y: 473.8, s: 3.71, rz: -2 }, ease.inOut],
    [a + 2.4, { x: 200, y: 476, s: 3.62, rz: -1 }, ease.linear],
    [a + 3.3, { x: 960, y: 560, s: 1.0, rz: 0 }, ease.inOut],
    [a + 3.7, { x: 960, y: 560, s: 1.02 }, ease.linear],
    [a + 4.25, toward("R"), ease.inOut],
    [a + 6.45, { ...toward("R"), s: 1.66 }, ease.linear],
    [a + 6.8, toward("A"), ease.inOut],
    [a + 8.55, { ...toward("A"), s: 1.7 }, ease.linear],
    [a + 8.9, toward("D"), ease.inOut],
    [a + 9.5, { ...toward("D"), s: 1.64 }, ease.linear],
    [a + 10.15, { x: 960, y: 540, s: 1.0 }, ease.inOut],
    [a + 11.5, { x: 960, y: 540, s: 1.04 }, ease.linear],
    [a + 12.4, { x: 960, y: 560, s: 1.18, rz: -10 }, ease.inOut],
    [T.day1, { x: 960, y: 560, s: 1.26, rz: -13 }, ease.linear],
  ]);
  const whip = Math.max(clamp((t - (a + 6.45)) / 0.35) * (t < a + 6.8 ? 1 : 0), clamp((t - (a + 8.55)) / 0.35) * (t < a + 8.9 ? 1 : 0));
  const blur = whipBlur(whip);
  const table = ease.inOut(clamp((t - (a + 11.5)) / 0.9));
  // ── phones (world poses) ──
  const slide = (k: number) => (1 - ease.out(clamp((t - (a + 2.65 + 0.15 * k)) / 0.55))) * 900;
  const world: Record<Who, Pose> = {
    Y: { x: ROW.Y, y: ROW_Y, s: PS, rx: 48 * table },
    R: { x: ROW.R, y: ROW_Y + slide(0), s: PS, rx: 48 * table },
    A: { x: ROW.A, y: ROW_Y + slide(1), s: PS, rx: 48 * table },
    D: { x: ROW.D, y: ROW_Y + slide(2), s: PS, rx: 48 * table },
  };
  const pose = (w: Who) => {
    const p = viaCam(cam, world[w]);
    return { ...p, blur, opacity: t < a + 2.5 && w !== "Y" ? 0 : 1 };
  };
  // ── what each phone shows ──
  const notif = (text: string): [string, string][] => [[text, "now"]];
  const inv = "Sam invited you to Iron Week. 1,000 SKR each.";
  const flights = { R: a + 10.25, A: a + 10.5, D: a + 10.75 } as const;
  const FLY = 0.62;
  const flows: Record<Who, { steps: { at: number; el: React.ReactNode; trans?: "push" | "fade" | "cut" | "up" | "back" }[]; taps: { at: number; x: number; y: number }[] }> = {
    Y: {
      steps: [{ at: T.promise + 12.15, el: <SwornC7ok /> }, { at: a, el: <InviteC8 joins={[m(a, flights.R + FLY), m(a, flights.A + FLY), m(a, flights.D + FLY)]} /> }],
      taps: [],
    },
    R: {
      steps: [{ at: a + 2.4, el: <LockM1 items={notif(inv)} at={[m(a + 2.4, a + 3.1)]} pressAt={m(a + 2.4, a + 4.4)} clock="20:14" date="Sunday 12 October" />, trans: "cut" },
        { at: a + 4.55, el: <InviteE2 who="R" pressAt={m(a + 4.55, a + 5.75)} />, trans: "fade" }, { at: a + 5.95, el: <JoinE2s who="R" successAt={700} /> }],
      taps: [{ at: a + 4.4, x: 195, y: 298 }, { at: a + 5.75, x: 195, y: 783 }],
    },
    A: {
      steps: [{ at: a + 2.4, el: <LockM1 items={notif(inv)} at={[m(a + 2.4, a + 3.25)]} pressAt={m(a + 2.4, a + 7.55)} clock="20:14" date="Sunday 12 October" />, trans: "cut" },
        { at: a + 7.7, el: <InviteE2 who="A" joined={["R"]} pressAt={m(a + 7.7, a + 8.2)} />, trans: "fade" }, { at: a + 8.35, el: <JoinE2s who="A" successAt={650} /> }],
      taps: [{ at: a + 7.55, x: 195, y: 298 }, { at: a + 8.2, x: 195, y: 783 }],
    },
    D: {
      steps: [{ at: a + 2.4, el: <LockM1 items={notif(inv)} at={[m(a + 2.4, a + 3.4)]} pressAt={m(a + 2.4, a + 3.9)} clock="20:14" date="Sunday 12 October" />, trans: "cut" },
        { at: a + 4.05, el: <InviteE2 who="D" pressAt={m(a + 4.05, a + 4.6)} />, trans: "fade" }, { at: a + 4.75, el: <JoinE2s who="D" successAt={650} /> }],
      taps: [{ at: a + 3.9, x: 195, y: 298 }, { at: a + 4.6, x: 195, y: 783 }],
    },
  };
  // ── avatar flights (world space → camera) and the pot ──
  const flightEls = (["R", "A", "D"] as const).map((k) => {
    const t0 = flights[k], p = clamp((t - t0) / FLY);
    if (t < t0 || p >= 1) return null;
    const [x0, y0] = worldOf(k, 195, 300), [x1, y1] = worldOf("Y", SEAT_X[k], SEAT_Y);
    const e = ease.inOut(p);
    const wx = lerp(x0, x1, e), wy = lerp(y0, y1, e) - 260 * Math.sin(p * Math.PI);
    const sp = viaCam(cam, { x: wx, y: wy, s: 1 });
    const size = 74 * cam.s * (1 + 0.5 * Math.sin(p * Math.PI));
    return (
      <div key={k} style={{ position: "absolute", left: sp.x - size / 2, top: sp.y - size / 2, width: size, height: size, borderRadius: size * 0.28, overflow: "hidden", zIndex: 70, background: MEMBER[k].color, boxShadow: `0 ${18 * p}px 40px rgba(0,0,0,0.5), 0 0 0 3px #C5F25C`, transform: `rotate(${(1 - p) * 30 - 15}deg)` }}>
        <Avatar config={MEMBER[k].avatar} size={size} />
      </div>
    );
  });
  const landed = (["R", "A", "D"] as const).filter((k) => t >= flights[k] + FLY).length;
  const lastLand = landed ? flights[(["R", "A", "D"] as const)[landed - 1]] + FLY : 0;
  const potIn = ease.outBack(clamp((t - (a + 10.1)) / 0.4));
  const potBump = landed ? 1 + 0.12 * Math.max(0, 1 - (t - lastLand) / 0.25) : 1;
  const pot = (
    <div style={{ position: "absolute", left: 960, top: 150 + 30 * table, zIndex: 80, transform: `translate(-50%,-50%) scale(${potIn * potBump})`, opacity: clamp(potIn * 2), display: "flex", alignItems: "baseline", gap: 18, padding: "14px 34px", borderRadius: 40, background: "linear-gradient(180deg,#DAFF80,#B0E03C)", boxShadow: "inset 0 2px 0 rgba(255,255,255,0.6), 0 20px 50px rgba(197,242,92,0.25)" }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: "#2A3A00" }}>ON THE TABLE</span>
      <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 58, letterSpacing: -2, color: "#131313", fontVariantNumeric: "tabular-nums" }}>{(1000 * (1 + landed)).toLocaleString("en-US")} SKR</span>
    </div>
  );
  // ── the Keeper: at the end of the row in the wide shots; hops to the front of the table at the end ──
  const perf = (tt: number) => {
    const b = body(tt, [[a + 2.6, 1990, 1320], [a + 3.2, 1830, 1060, ease.outBack, 0], [a + 10.6, 1830, 1060], [a + 11.6, 1420, 1080, ease.inOut, 90], [T.day1, 1400, 1080]]);
    const mt = moodTrack(tt, [[0, "side"], [a + 7.2, "bored"], [a + 9.2, "smug"]]);
    const sp = talk([vo("K05"), vo("K06"), vo("K07")], tt, { eyes: mt.eyes, gx: -5, sx: b.sx, sy: b.sy });
    return { x: b.x, y: b.y, size: 270, lean: b.lean - 4, skew: b.skew, draw: { mood: mt.mood, t: tt, wiggle: sp.wiggle, over: sp.over } };
  };
  const wide = cam.s < 1.25;
  return (
    <>
      {(["Y", "R", "A", "D"] as Who[]).map((w) => {
        const p = pose(w);
        if (p.x < -400 || p.x > 2320) return null;
        return <Phone key={w} pose={p} over={<Touches t={t} taps={flows[w].taps} />}><Flow t={t} steps={flows[w].steps} /></Phone>;
      })}
      {table < 0.2 && (["Y", "R", "A", "D"] as Who[]).map((w) => <NameTag key={w} who={w} label={w === "Y" ? "You" : undefined} pose={pose(w)} t={t} at={w === "Y" ? a + 2.9 : a + 3.0 + 0.15 * "RAD".indexOf(w)} accent={w === "Y" ? "#C5F25C" : undefined} />)}
      {flightEls}
      {pot}
      {wide ? <Keeper depth={160} id="k-friends" t={t} perf={perf} z={60} /> : null}
      <Statement t={t} at={a + 0.5} out={a + 2.45} x={110} y={360} lines={["Bring your", "friends."]} keys={["friends."]} size={120} />
    </>
  );
}
