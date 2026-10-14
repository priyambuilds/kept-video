// 0:15.75 · 02 Swear an Oath: C1 typing → C2 Dumbbell → C3 7 days → C4 group + 1,000 → C5 review → C6 terms
// (the rules card lifts out of the phone) → sign → "Sworn." → C8 invite, seats fill with Riya, Arjun, Dev.
import React from "react";
import { ease } from "../lib/anim";
import { Phone } from "../phone/Phone";
import { Flow, Touches } from "../phone/Flow";
import { GoalC1, InviteC8, LengthC3, ObjectC2, ReviewC5, StakeC4, SwornC7ok, TermsC6, C6_RULES } from "../app/screens/oath";
import { SignScreen } from "../app/screens/onboarding";
import { LookA4 } from "../app/screens/onboarding";
import { RowList } from "../app/kit/rows";
import { Headline, focus, poseAt } from "./stage";
import { Lift } from "./Lift";
import { T } from "./timeline";

export function ChOath({ t }: { t: number }) {
  if (t < T.oath || t >= T.today) return null;
  const m = (at: number, x: number) => (x - at) * 1000;
  const lift = { a0: 23.95, a1: 24.75, b0: 26.0, b1: 26.6 };
  const dimK = t > lift.a0 && t < lift.b1 ? Math.min(1, (t - lift.a0) / 0.5) * (t > lift.b0 ? 1 - (t - lift.b0) / 0.6 : 1) : 0;
  const pose = poseAt(t, [
    [15.75, { x: 1270, y: 540, s: 1.0, ry: -8, rx: 2 }],
    [16.3, { ...focus(195, 230, 1180, 470, 1.45), ry: -3, rx: 0 }, ease.inOut],
    [17.6, { ...focus(195, 260, 1180, 480, 1.45), ry: -3 }, ease.linear],
    [18.2, { x: 1270, y: 545, s: 1.0, ry: -9, rx: 2 }, ease.inOut],
    [20.3, { x: 1280, y: 545, s: 1.02, ry: -5 }, ease.inOut],
    [22.3, { x: 1270, y: 540, s: 1.0, ry: -8 }, ease.inOut],
    [23.9, { x: 1300, y: 545, s: 0.98, ry: -6 }, ease.inOut],
    [24.8, { x: 1420, y: 560, s: 0.9, ry: -24, rx: 3 }, ease.inOut],
    [26.0, { x: 1420, y: 560, s: 0.9, ry: -24, rx: 3 }, ease.linear],
    [26.7, { x: 1270, y: 545, s: 1.0, ry: -8, rx: 2 }, ease.inOut],
    [28.1, { ...focus(195, 470, 1250, 545, 1.06), ry: -5 }, ease.inOut],
    [29.75, { ...focus(195, 470, 1250, 545, 1.08), ry: -5 }, ease.linear],
  ]);
  pose.dim = dimK;
  const steps = [
    { at: 12.95, el: <LookA4 shuffles={[m(12.95, 13.55), m(12.95, 14.25)]} pressAt={m(12.95, 15.55)} /> },
    { at: 15.75, el: <GoalC1 typeAt={350} pressAt={m(15.75, 17.75)} stepSince={0} /> },
    { at: 17.95, el: <ObjectC2 pickAt={m(17.95, 18.55)} pressAt={m(17.95, 19.05)} /> },
    { at: 19.25, el: <LengthC3 pickAt={m(19.25, 19.75)} pressAt={m(19.25, 20.25)} /> },
    { at: 20.45, el: <StakeC4 groupAt={m(20.45, 20.95)} stakeAt={m(20.45, 21.55)} pressAt={m(20.45, 22.15)} /> },
    { at: 22.35, el: <ReviewC5 pickAt={m(22.35, 22.85)} pressAt={m(22.35, 23.2)} /> },
    { at: 23.4, el: <TermsC6 pressAt={m(23.4, 26.95)} hideRules={m(23.4, lift.a0)} /> },
    { at: 27.15, el: <SignScreen title="Confirm in your wallet" sub="Staking 1,000 SKR into Iron Week." successAt={1000} successChip="Signed" /> },
    { at: 28.35, el: <SwornC7ok pressAt={m(28.35, 28.8)} />, trans: "fade" as const },
  ];
  // C8 replaces C7·ok late in the chapter: invite + seats.
  steps.push({ at: 28.95, el: <InviteC8 joins={[m(28.95, 29.25), m(28.95, 29.45), m(28.95, 29.65)]} /> } as never);
  const taps = [
    { at: 17.75, x: 195, y: 783 }, { at: 18.55, x: 61, y: 247 }, { at: 19.05, x: 195, y: 783 }, { at: 19.75, x: 195, y: 268 }, { at: 20.25, x: 195, y: 783 },
    { at: 20.95, x: 284, y: 250 }, { at: 21.55, x: 195, y: 388 }, { at: 22.15, x: 195, y: 783 }, { at: 22.85, x: 195, y: 330 }, { at: 23.2, x: 195, y: 783 },
    { at: 26.95, x: 195, y: 783 }, { at: 28.8, x: 195, y: 723 },
  ];
  // The rules card: lifted into the frame's left half beside the tilted phone (the phone dims).
  const rulesH = 262;
  return (
    <>
      <Headline t={t} at={16.0} out={19.05} x={130} y={330} eyebrow="02 · SWEAR AN OATH" lines={["Pick a habit."]} keys={["habit."]} size={92} sub="Small, daily, specific. You'll prove it every single day." />
      <Headline t={t} at={19.25} out={23.3} x={130} y={330} lines={["Put SKR", "on it."]} keys={["SKR"]} size={92} sub="500, 1,000 or 2,500 SKR. Every miss costs 1.5× the last one." />
      <Headline t={t} at={23.55} out={26.6} x={110} y={140} lines={["Sign it like", "a contract."]} keys={["contract."]} size={80} />
      <Headline t={t} at={26.75} out={28.7} x={130} y={330} lines={["Locked in", "on Solana."]} keys={["Solana."]} size={92} sub="Your stake sits in the Oath's program. Nobody can touch it. Not even us." />
      <Headline t={t} at={28.85} x={130} y={330} out={29.6} lines={["Bring your", "witnesses."]} keys={["witnesses."]} size={92} />
      <Phone pose={pose} over={<><Touches t={t} taps={taps} /><div style={{ position: "absolute", inset: 0, zIndex: 92, background: `rgba(0,0,0,${0.55 * dimK})` }} /></>}>
        <Flow t={t} steps={steps} />
      </Phone>
      <Lift t={t} pose={pose} rect={[20, 428, 350, rulesH]} to={{ x: 560, y: 640, s: 1.55, ry: 14, rx: 4, rz: -2 }} {...lift}>
        <div style={{ width: 350, padding: 0 }}><RowList label="THE RULES" rows={C6_RULES} /></div>
      </Lift>
    </>
  );
}
