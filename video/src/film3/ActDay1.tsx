// Act 4 · Day 1 (v3 §2). MON 6:58 AM. Your lock screen → Today → Prove → camera ("Dumbbell + victory sign") →
// the first shot fails → hard cut to the Keeper's dead stare: "Nice try." → retry passes → photo 1 in → "Day 1 kept."
// Your friends' days land beside the phone (Riya kept · Dev kept · Arjun kept). The Keeper has his morning coffee.
import React from "react";
import { clamp, ease, kf } from "../lib/anim";
import { SANS } from "../lib/theme";
import { Phone } from "../phone/Phone";
import { Flow, Touches } from "../phone/Flow";
import { LockM1 } from "../app/screens/onboarding";
import { TodayB1 } from "../app/screens/today";
import { CameraF1, CheckF2, DayKeptF5, PhotoDoneF3 } from "../app/screens/proof";
import { MEMBER } from "../app/theme";
import { Avatar } from "../app/kit/Avatar";
import { Keeper } from "../keeper/Keeper";
import { handTrack, moodTrack, talk } from "../keeper/perf";
import { body } from "../keeper/actor";
import { focus, poseAt } from "../film2/stage";
import { KeeperCU, TimeCard } from "./common";
import { T, vo } from "./timeline";

export const FAIL_CU = (a: number) => [a + 4.95, a + 6.05] as const;

/** A friend's result pill (avatar + text), popping in beside a phone. */
export function FriendPill({ t, at, out, who, text, x, y, tilt = 0, tone = "lime" }: { t: number; at: number; out: number; who: "Y" | "R" | "A" | "D"; text: string; x: number; y: number; tilt?: number; tone?: "lime" | "red" }) {
  const p = ease.springHard(clamp((t - at) / 0.4)), o = clamp((t - out) / 0.3);
  if (p <= 0 || o >= 1) return null;
  const bg = tone === "lime" ? "linear-gradient(180deg,#DAFF80,#B0E03C)" : "linear-gradient(180deg,#FF8A8A,#E5484D)";
  const ink = tone === "lime" ? "#1A2600" : "#2A0000";
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 70, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * p}) rotate(${tilt}deg)`, opacity: clamp(p * 2) * (1 - o), display: "flex", alignItems: "center", gap: 12, height: 64, padding: "0 24px 0 10px", borderRadius: 32, background: bg, boxShadow: "inset 0 2px 0 rgba(255,255,255,0.55), 0 16px 34px rgba(0,0,0,0.4)", whiteSpace: "nowrap" }}>
      <div style={{ width: 46, height: 46, borderRadius: 14, overflow: "hidden", background: MEMBER[who].color }}><Avatar config={MEMBER[who].avatar} size={46} /></div>
      <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: ink, letterSpacing: -1 }}>{text}</span>
    </div>
  );
}

export function ActDay1({ t }: { t: number }) {
  const a = T.day1;
  if (t < a || t >= T.arjun) return null;
  const m = (at: number, x: number) => (x - at) * 1000;
  const [cu0, cu1] = FAIL_CU(a);
  const pose = poseAt(t, [
    [a, { x: 1180, y: 560, s: 1.14, rx: -10, ry: -16, rz: 2 }],
    [a + 1.4, { x: 1160, y: 550, s: 1.06, rx: -4, ry: -10, rz: 0 }, ease.out],
    [a + 2.4, { x: 1150, y: 545, s: 1.04, rx: 0, ry: -6 }, ease.inOut],
    [a + 2.95, { ...focus(195, 300, 1060, 520, 1.62), rx: 0, ry: 0, rz: 0 }, ease.inOut],
    [a + 4.9, { ...focus(195, 300, 1060, 520, 1.7) }, ease.linear],
    [cu1, { ...focus(195, 300, 1060, 520, 1.62), rz: -2 }, ease.linear],
    [a + 7.5, { ...focus(195, 300, 1060, 520, 1.66), rz: -1 }, ease.linear],
    [a + 8.2, { x: 1180, y: 545, s: 0.98, ry: -10, rx: 2, rz: 0 }, ease.inOut],
    [T.arjun, { x: 1200, y: 545, s: 1.0, ry: -8, rx: 2 }, ease.linear],
  ]);
  const steps = [
    { at: a, el: <LockM1 items={[["Iron Week: Day 1 is today. Two photos before midnight.", "06:58"]]} at={[m(a, a + 0.5)]} pressAt={m(a, a + 1.35)} clock="6:58" date="Monday 13 October" />, trans: "cut" as const },
    { at: a + 1.5, el: <TodayB1 morning secs0={17 * 3600 + 1 * 60 + 12} pressAt={m(a + 1.5, a + 2.5)} />, trans: "fade" as const },
    { at: a + 2.7, el: <CameraF1 gesture="peace" shutterAt={m(a + 2.7, a + 3.6)} /> },
    { at: a + 3.75, el: <CheckF2 gesture="peace" failAt={m(a + 3.75, a + 4.75)} />, trans: "cut" as const },
    { at: cu1 + 0.05, el: <CameraF1 gesture="peace" shutterAt={m(cu1 + 0.05, cu1 + 0.55)} secs0={4 * 60 + 51} />, trans: "cut" as const },
    { at: cu1 + 0.7, el: <CheckF2 gesture="peace" />, trans: "cut" as const },
    { at: a + 7.55, el: <PhotoDoneF3 />, trans: "fade" as const },
    { at: a + 8.3, el: <DayKeptF5 day={1} pending={false} />, trans: "fade" as const },
  ];
  const taps = [{ at: a + 1.35, x: 195, y: 298 }, { at: a + 2.5, x: 195, y: 456 }, { at: a + 3.6, x: 195, y: 614 }, { at: a + 4.95, x: 195, y: 783 }, { at: cu1 + 0.55, x: 195, y: 614 }];
  // The Keeper beside the phone, sipping his coffee; leans in for the photo.
  const kx = 1600, ky = 1075;
  const perf = (tt: number) => {
    const b = body(tt, [[a + 0.2, kx + 60, ky + 560], [a + 0.75, kx, ky, ease.outBack], [a + 2.9, kx, ky], [a + 3.3, kx - 70, ky, ease.inOut, 30], [a + 8.0, kx - 70, ky], [a + 8.5, kx, ky, ease.inOut, 30]]);
    const mt = moodTrack(tt, [[0, "bored"], [a + 3.4, "neutral"], [cu1, "smug"], [a + 8.35, "happy"]]);
    const sip = (s0: number) => [[s0, null], [s0 + 0.3, [100, 92, -40, "fist"], ease.inOut], [s0 + 0.9, [100, 92, -40, "fist"]], [s0 + 1.2, null]] as const;
    const R = handTrack(tt, [...sip(a + 0.9), ...sip(a + 6.3).slice(0)] as never);
    const sp = talk([vo("K08")], tt, { eyes: mt.eyes, gx: tt > a + 2.6 ? -5 : 1, gy: tt > a + 2.6 ? 1 : -1, sx: b.sx, sy: b.sy });
    return {
      x: b.x, y: b.y, size: 330, lean: b.lean + kf(tt, [[a + 2.9, -2], [a + 3.4, -11], [a + 8.0, -11], [a + 8.4, -3]]), skew: b.skew,
      draw: { mood: mt.mood, prop: tt < a + 8.2 ? ("cup" as const) : ("none" as const), anim: tt > a + 8.4 ? ("thumbs" as const) : ("idle" as const), attach: true, t: tt, wiggle: sp.wiggle, over: { ...sp.over, ...(R ? { right: R } : {}) } },
    };
  };
  const out = T.arjun - 0.2;
  return (
    <>
      <TimeCard t={t} at={a + 0.1} out={a + 2.4} when="MON · 6:58 AM" day="Day 1" />
      <Phone pose={pose} over={<Touches t={t} taps={taps} />}><Flow t={t} steps={steps} /></Phone>
      <Keeper depth={160} id="k-day1" t={t} perf={perf} z={40} />
      <FriendPill t={t} at={a + 8.75} out={out} who="R" text="Riya kept" x={560} y={400} tilt={-3} />
      <FriendPill t={t} at={a + 9.0} out={out} who="D" text="Dev kept" x={600} y={490} tilt={2} />
      <FriendPill t={t} at={a + 9.25} out={out} who="A" text="Arjun kept" x={570} y={580} tilt={-1} />
    </>
  );
}

/** Outside the 3D stage: the "Nice try." reaction close-up. */
export function Day1Overlay({ t }: { t: number }) {
  const [cu0, cu1] = FAIL_CU(T.day1);
  if (t < cu0 || t >= cu1) return null;
  // The reaction close-up: dead stare, one slow blink, "Nice try."
  const cuPerf = (tt: number) => {
    const blink = tt > cu0 + 0.25 && tt < cu0 + 0.45 ? 0.15 : 1;
    const sp = talk([vo("K09")], tt, { eyes: blink, gx: 0, gy: 0 });
    return { x: 960, y: 1560 + 30 * (tt - cu0), size: 1480, lean: 0, draw: { mood: "bored" as const, prop: "lens" as const, t: tt, wiggle: sp.wiggle, over: sp.over } };
  };
  return <KeeperCU t={t} at={cu0} out={cu1} perf={cuPerf} id="k-cu-nice" />;
}
