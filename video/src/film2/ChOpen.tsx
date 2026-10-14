// 0:00 Hook (lock screen, KEPT notifications landing, the Keeper leaning on the phone) → 0:05.25 drop 1:
// dive into the splash → A1 → 0:08.75 sign in (A2 → sign → A3 verified → A4 pick a look).
import React from "react";
import { Keeper } from "../keeper/Keeper";
import { handTrack, moodTrack, pointAt, talk } from "../keeper/perf";
import { ease } from "../lib/anim";
import { Phone } from "../phone/Phone";
import { Flow, Touches } from "../phone/Flow";
import { LockM1, SplashA0, WelcomeA1, ConnectA2, SignScreen, VerifiedA3, LookA4 } from "../app/screens/onboarding";
import { Headline, poseAt, focus } from "./stage";
import { T, vo } from "./timeline";
import { Bubble } from "../ui/Caption";

const NOTIF_AT = [0.25, 0.75, 1.3, 1.9, 2.55, 3.25];

export function ChOpen({ t }: { t: number }) {
  if (t >= T.oath) return null;
  const pose = poseAt(t, [
    [0, { x: 1150, y: 600, s: 0.62, rx: 16, ry: -20, rz: -4 }],
    [4.9, { x: 1150, y: 560, s: 0.86, rx: 5, ry: -9, rz: -1 }, ease.inOut],
    [5.25, { x: 1150, y: 560, s: 0.9, rx: 0, ry: 0, rz: 0 }, ease.in],
    [5.9, { ...focus(195, 360, 960, 470, 2.4), rx: 0, ry: 0 }, ease.out],
    [6.55, { ...focus(195, 360, 960, 470, 2.55) }, ease.linear],
    [7.35, { x: 1250, y: 545, s: 1.0, ry: -12, rx: 3 }, ease.inOut],
    [8.75, { x: 1270, y: 545, s: 1.0, ry: -7, rx: 2 }, ease.inOut],
    [12.0, { x: 1270, y: 540, s: 1.02, ry: -4, rx: 1 }, ease.inOut],
    [15.75, { x: 1270, y: 540, s: 1.0, ry: -8, rx: 2 }, ease.inOut],
  ]);
  const m = (at: number, x: number) => (x - at) * 1000;
  const steps = [
    { at: 0, el: <LockM1 at={NOTIF_AT.map((a) => a * 1000)} pressAt={4.75 * 1000} />, trans: "cut" as const },
    { at: 5.25, el: <SplashA0 />, trans: "fade" as const },
    { at: 7.2, el: <WelcomeA1 pressAt={m(7.2, 9.0)} />, trans: "fade" as const },
    { at: 9.2, el: <ConnectA2 pressAt={m(9.2, 10.15)} /> },
    { at: 10.35, el: <SignScreen title="Sign in to KEPT" sub="Check your wallet to approve the message." steps={[1, 3]} /> },
    { at: 11.6, el: <VerifiedA3 pressAt={m(11.6, 12.75)} /> },
    { at: 12.95, el: <LookA4 shuffles={[m(12.95, 13.55), m(12.95, 14.25)]} pressAt={m(12.95, 15.55)} /> },
  ];
  const taps = [
    { at: 4.75, x: 195, y: 298 }, { at: 9.0, x: 195, y: 723 }, { at: 10.15, x: 200, y: 239 }, { at: 12.75, x: 195, y: 783 },
    { at: 13.55, x: 195, y: 456 }, { at: 14.25, x: 195, y: 456 }, { at: 15.55, x: 195, y: 723 },
  ];
  // The Keeper: rises behind the phone's right edge, leans on it, deadpan at camera; points at the phone for V02.
  const kx = pose.x + 330 * pose.s + 120, ky = 1035;
  const perf = (tt: number) => {
    const mt = moodTrack(tt, [[0, "bored"], [2.95, "smug"], [4.55, "side"]]);
    const R = handTrack(tt, [[3.1, null], [3.45, pointAt(18, 92, -95), ease.out], [4.4, pointAt(14, 96, -100)], [4.7, null]]);
    const sp = talk([vo("V01"), vo("V02")], tt, { eyes: mt.eyes, gx: tt < 2.9 ? 0 : -4, gy: 0 });
    const rise = ease.outBack(Math.min(1, Math.max(0, (tt - 0.5) / 0.6)));
    const out = ease.in(Math.min(1, Math.max(0, (tt - 5.05) / 0.25)));
    return {
      x: kx, y: ky + (1 - rise) * 420 + out * 500, size: 330, lean: -7,
      draw: { mood: mt.mood, t: tt + 1.3, wiggle: sp.wiggle, over: { ...sp.over, ...(R ? { right: R } : {}) } },
      opacity: tt < 0.45 || tt > 5.3 ? 0 : 1,
    };
  };
  return (
    <>
      <Headline t={t} at={0.35} out={2.75} x={130} y={360} lines={["Every habit app", "lets you quit."]} red={["quit."]} size={96} />
      <Headline t={t} at={2.95} out={5.05} x={130} y={360} lines={["This one", "bills you."]} keys={["bills"]} size={96} />
      <Headline t={t} at={7.45} out={8.6} x={130} y={340} eyebrow="KEPT · ON SOLANA SEEKER" lines={["Bet your friends", "you'll do it."]} keys={["friends"]} size={88} sub="Stake SKR on a daily habit. Prove it with two photos. Miss, and your friends take your share." />
      <Headline t={t} at={8.95} out={12.6} x={130} y={340} eyebrow="01 · SIGN IN" lines={["Your Seeker", "is your login."]} keys={["login."]} size={88} sub="One signature. Free. It never moves your SKR." />
      <Headline t={t} at={12.85} out={15.6} x={130} y={340} lines={["Pick a look.", "Get judged."]} keys={["judged."]} size={88} sub="Your avatar is how friends spot you in every Oath." />
      <Phone pose={pose} over={<Touches t={t} taps={taps} />}>
        <Flow t={t} steps={steps} />
      </Phone>
      {t < 5.4 ? <Keeper id="k-hook" t={t} perf={perf} z={40} /> : null}
      {t > 5.7 && t < 7.4 ? <Bubble t={t} line={vo("V03")} x={960} y={300} side="right" fs={44} maxW={600} /> : null}
    </>
  );
}
