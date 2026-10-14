// 0:29.75 Today (the deck: swipe through Oaths, the reset clock ticking) → 0:33.25 · 03 Prove it: photo 1
// (victory sign) → checking → fail ("Close. Two fingers…") → retry → pass → "Photo 1 is in." → photo 2 (open palm)
// → "Last look." → "Day 3 kept." The Keeper judges from beside the phone with his magnifying glass.
import React from "react";
import { Keeper } from "../keeper/Keeper";
import { moodTrack, talk } from "../keeper/perf";
import { ease, kf } from "../lib/anim";
import { Phone } from "../phone/Phone";
import { Flow, Touches } from "../phone/Flow";
import { TodayB1 } from "../app/screens/today";
import { InviteC8 } from "../app/screens/oath";
import { CameraF1, CheckF2, DayKeptF5, PhotoDoneF3 } from "../app/screens/proof";
import { Headline, focus, poseAt } from "./stage";
import { T, vo } from "./timeline";

export function ChProve({ t }: { t: number }) {
  if (t < T.today || t >= T.stakes) return null;
  const m = (at: number, x: number) => (x - at) * 1000;
  const pose = poseAt(t, [
    [29.75, { x: 1250, y: 560, s: 0.95, ry: -34, rx: 6, rz: -2 }],
    [30.6, { x: 1200, y: 545, s: 1.0, ry: -8, rx: 2, rz: 0 }, ease.out],
    [33.0, { x: 1180, y: 545, s: 1.02, ry: -5, rx: 1 }, ease.inOut],
    [33.6, { ...focus(195, 300, 1130, 500, 1.28), ry: -3, rx: 0 }, ease.inOut],
    [38.6, { ...focus(195, 300, 1130, 500, 1.3), ry: -3 }, ease.linear],
    [39.2, { x: 1180, y: 545, s: 1.0, ry: -7 }, ease.inOut],
    [40.0, { ...focus(195, 300, 1130, 500, 1.24), ry: -4 }, ease.inOut],
    [41.7, { ...focus(195, 300, 1130, 500, 1.26), ry: -4 }, ease.linear],
    [42.3, { x: 1160, y: 545, s: 1.0, ry: -6 }, ease.inOut],
    [43.75, { x: 1160, y: 540, s: 1.02, ry: -4 }, ease.linear],
  ]);
  const steps = [
    { at: 28.95, el: <InviteC8 joins={[m(28.95, 29.25), m(28.95, 29.45), m(28.95, 29.65)]} /> },
    { at: 29.75, el: <TodayB1 morning secs0={14 * 3600 + 41 * 60 + 52} swipes={[m(29.75, 30.85), m(29.75, 31.55), m(29.75, 32.25)]} pressAt={m(29.75, 33.05)} />, trans: "fade" as const },
    { at: 33.25, el: <CameraF1 gesture="peace" shutterAt={m(33.25, 34.35)} /> },
    { at: 34.5, el: <CheckF2 gesture="peace" failAt={m(34.5, 35.75)} />, trans: "cut" as const },
    { at: 37.1, el: <CameraF1 gesture="peace" shutterAt={m(37.1, 37.6)} secs0={4 * 60 + 56} />, trans: "fade" as const },
    { at: 37.75, el: <CheckF2 gesture="peace" />, trans: "cut" as const },
    { at: 38.75, el: <PhotoDoneF3 pressAt={m(38.75, 39.65)} />, trans: "fade" as const },
    { at: 39.85, el: <CameraF1 photo={2} gesture="palm" shutterAt={m(39.85, 40.6)} /> },
    { at: 40.75, el: <CheckF2 photo={2} gesture="palm" line="Last look." />, trans: "cut" as const },
    { at: 41.85, el: <DayKeptF5 />, trans: "fade" as const },
  ];
  const taps = [
    { at: 30.85, x: 320, y: 360, hold: 0.22, to: [40, 372] as [number, number] }, { at: 31.55, x: 320, y: 360, hold: 0.22, to: [40, 372] as [number, number] },
    { at: 32.25, x: 320, y: 360, hold: 0.22, to: [40, 372] as [number, number] }, { at: 33.05, x: 195, y: 456 },
    { at: 34.35, x: 195, y: 614 }, { at: 36.95, x: 195, y: 783 }, { at: 37.6, x: 195, y: 614 }, { at: 39.65, x: 195, y: 723 }, { at: 40.6, x: 195, y: 614 },
  ];
  // The Keeper with his magnifying glass, at the phone's right edge: leans in to judge, shakes his head at the
  // fail, perks up on the pass, celebrates the kept day.
  const kx = pose.x + 300 * pose.s + 190;
  const perf = (tt: number) => {
    const mt = moodTrack(tt, [[33.3, "neutral"], [35.8, "bored"], [37.0, "neutral"], [38.7, "smug"], [41.9, "happy"]]);
    const shake = tt > 35.8 && tt < 36.7 ? 7 * Math.sin((tt - 35.8) * 2 * Math.PI * 3) * Math.exp(-(tt - 35.8) * 2.5) : 0;
    const lean = kf(tt, [[33.4, -4], [34.5, -13], [35.7, -13], [36.2, -6], [37.75, -13], [38.6, -12], [39.0, -4], [40.75, -12], [41.8, -10], [42.2, -2]]);
    const sp = talk([vo("V07")], tt, { eyes: mt.eyes, gx: -5, gy: 2, tilt: shake });
    const rise = ease.outBack(Math.min(1, Math.max(0, (tt - 33.3) / 0.55)));
    return {
      x: kx, y: 1030 + (1 - rise) * 460, size: 300, lean,
      draw: { mood: mt.mood, prop: tt < 41.85 ? "lens" as const : "none" as const, anim: tt > 41.9 ? "thumbs" as const : "idle" as const, t: tt, wiggle: sp.wiggle, over: sp.over },
      opacity: tt < 33.3 ? 0 : 1,
    };
  };
  return (
    <>
      <Headline t={t} at={29.95} out={33.0} x={130} y={330} eyebrow="TODAY" lines={["Every Oath,", "every day."]} keys={["day."]} size={92} sub="Swipe through your stack. The clock resets at midnight." />
      <Headline t={t} at={33.45} out={35.95} x={110} y={330} eyebrow="03 · PROVE IT" lines={["Two photos.", "Every day."]} keys={["photos."]} size={88} sub="Your object plus a random gesture. Five minutes to take it." />
      <Headline t={t} at={36.15} out={39.55} x={110} y={330} lines={["AI checks", "every one."]} keys={["every"]} size={88} sub="Right object, right gesture, a real photo, not a screen. Then the photo is deleted." />
      <Headline t={t} at={39.75} out={43.5} x={110} y={330} lines={["Photo 2,", "before midnight."]} keys={["midnight."]} size={84} sub="A new gesture. Miss it and the day counts as missed." />
      <Phone pose={pose} over={<Touches t={t} taps={taps} />}><Flow t={t} steps={steps} /></Phone>
      <Keeper id="k-prove" t={t} perf={perf} z={40} />
    </>
  );
}
