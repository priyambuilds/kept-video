// Act 2 · The promise (v3 §2). C1 typing (ECU) → C2 Dumbbell → C3 7 days → C4 group + 1,000 (dutch ECU on the
// stake) → C5 → C6 "Read it like a contract." (the rules card lifts out, then lands back *into its own slot*:
// the on-screen rules are hidden only while the card is out) → Sign & stake → the Keeper slams his seal → "Sworn."
import React from "react";
import { clamp, ease, kf, wobble } from "../lib/anim";
import { Phone } from "../phone/Phone";
import { Flow, Touches } from "../phone/Flow";
import { C6_RULES, GoalC1, LengthC3, ObjectC2, ReviewC5, StakeC4, SwornC7ok, TermsC6 } from "../app/screens/oath";
import { SignScreen } from "../app/screens/onboarding";
import { RowList } from "../app/kit/rows";
import { Keeper } from "../keeper/Keeper";
import { handTrack, moodTrack, talk, toRig } from "../keeper/perf";
import { body } from "../keeper/actor";
import { focus, poseAt } from "../film2/stage";
import { Lift } from "../film2/Lift";
import { T, vo } from "./timeline";

export const RULES_RECT: [number, number, number, number] = [20, 428, 350, 280];

export function ActPromise({ t }: { t: number }) {
  const a = T.promise;
  if (t < a - 0.6 || t >= T.friends + 0.7) return null;
  const m = (at: number, x: number) => (x - at) * 1000;
  const lift = { a0: a + 8.0, a1: a + 8.75, b0: a + 9.85, b1: a + 10.5 };
  const stamp = a + 11.8;
  const shake = wobble(t, stamp, 10, 16, 10);
  const base = poseAt(t, [
    [a - 0.6, { x: 1150, y: 545, s: 1.06, rx: 0, ry: -8 }],
    [a + 0.3, { ...focus(195, 250, 960, 470, 2.2), rx: 0, ry: 0, rz: -3 }, ease.inOut],
    [a + 1.8, { ...focus(195, 262, 950, 480, 2.32), rz: -2 }, ease.linear],
    [a + 2.4, { x: 1180, y: 545, s: 1.0, ry: -14, rx: 3, rz: 0 }, ease.inOut],
    [a + 4.6, { x: 1160, y: 545, s: 1.04, ry: -6, rx: 1 }, ease.inOut],
    [a + 5.45, { ...focus(195, 388, 980, 560, 2.05), rx: 0, ry: 6, rz: 7 }, ease.inOut],
    [a + 6.25, { ...focus(195, 388, 990, 560, 2.12), ry: 6, rz: 6 }, ease.linear],
    [a + 6.8, { x: 1170, y: 545, s: 1.0, ry: -10, rx: 2, rz: 0 }, ease.inOut],
    [lift.a0, { x: 1210, y: 545, s: 0.98, ry: -8 }, ease.inOut],
    [lift.a1, { x: 1430, y: 560, s: 0.9, ry: -26, rx: 3 }, ease.inOut],
    [lift.b0, { x: 1430, y: 560, s: 0.9, ry: -26, rx: 3 }, ease.linear],
    [lift.b1, { x: 1200, y: 545, s: 1.0, ry: 0, rx: 0 }, ease.inOut],
    [a + 11.2, { x: 1120, y: 560, s: 1.02, ry: 4, rx: 4 }, ease.inOut],
    [stamp + 0.6, { x: 1110, y: 555, s: 1.06, ry: 2, rx: 2 }, ease.inOut],
    [T.friends - 0.25, { x: 1060, y: 545, s: 1.1, ry: 0, rx: 0 }, ease.inOut],
  ]);
  const dimK = t > lift.a0 && t < lift.b1 ? Math.min(1, (t - lift.a0) / 0.5) * (t > lift.b0 ? 1 - (t - lift.b0) / 0.65 : 1) : 0;
  const pose = { ...base, x: base.x + shake, y: base.y + Math.abs(shake) * 0.6, dim: dimK };
  const steps = [
    { at: a - 0.3, el: <GoalC1 typeAt={350} pressAt={m(a - 0.3, a + 2.0)} stepSince={0} /> },
    { at: a + 2.2, el: <ObjectC2 pickAt={m(a + 2.2, a + 2.8)} pressAt={m(a + 2.2, a + 3.3)} /> },
    { at: a + 3.5, el: <LengthC3 pickAt={m(a + 3.5, a + 4.0)} pressAt={m(a + 3.5, a + 4.5)} /> },
    { at: a + 4.7, el: <StakeC4 groupAt={m(a + 4.7, a + 5.2)} stakeAt={m(a + 4.7, a + 5.8)} pressAt={m(a + 4.7, a + 6.45)} /> },
    { at: a + 6.65, el: <ReviewC5 pickAt={m(a + 6.65, a + 7.05)} pressAt={m(a + 6.65, a + 7.35)} /> },
    { at: a + 7.55, el: <TermsC6 pressAt={m(a + 7.55, a + 10.75)} hideRules={m(a + 7.55, lift.a0)} showRules={m(a + 7.55, lift.b1)} /> },
    { at: a + 10.95, el: <SignScreen title="Confirm in your wallet" sub="Staking 1,000 SKR into Iron Week." successAt={m(a + 10.95, stamp)} successChip="Signed" /> },
    { at: stamp + 0.35, el: <SwornC7ok pressAt={m(stamp + 0.35, T.friends - 0.3)} />, trans: "fade" as const },
  ];
  const taps = [
    { at: a + 2.0, x: 195, y: 783 }, { at: a + 2.8, x: 61, y: 247 }, { at: a + 3.3, x: 195, y: 783 }, { at: a + 4.0, x: 195, y: 268 }, { at: a + 4.5, x: 195, y: 783 },
    { at: a + 5.2, x: 284, y: 250 }, { at: a + 5.8, x: 195, y: 388 }, { at: a + 6.45, x: 195, y: 783 }, { at: a + 7.05, x: 195, y: 330 }, { at: a + 7.35, x: 195, y: 783 },
    { at: a + 10.75, x: 195, y: 783 }, { at: T.friends - 0.3, x: 195, y: 723 },
  ];
  // ── the Keeper: watches from the right edge, steps back for the lifted card, then comes in close and slams his seal ──
  const K03 = vo("K03"), K04 = vo("K04");
  const size = 440;
  const perf = (tt: number) => {
    const b = body(tt, [
      [a - 0.6, 1660, 1190], [a + 1.9, 1660, 1190], [a + 2.5, 1580, 1080, ease.outBack, 60],
      [lift.a0, 1590, 1080], [lift.a0 + 0.45, 1790, 1100, ease.inOut, 40], [lift.b1, 1780, 1100], [a + 11.0, 1420, 1085, ease.inOut, 70],
      [T.friends - 0.5, 1430, 1085], [T.friends + 0.2, 1760, 1220, ease.in],
    ]);
    const mt = moodTrack(tt, [[0, "neutral"], [a + 5.5, "smug"], [lift.a0, "side"], [a + 11.0, "stern"], [stamp + 0.3, "smug"]]);
    // seal hand: raise, slam onto the lower half of the phone, hold, lift
    const tgt = toRig(1110, 650, b.x, b.y, size);
    const R = handTrack(tt, [
      [a + 10.9, null], [stamp - 0.45, [tgt[0] + 30, tgt[1] - 70, -40, "fist"], ease.out], [stamp - 0.05, [tgt[0] + 26, tgt[1] - 80, -45, "fist"]],
      [stamp, [tgt[0], tgt[1], -20, "fist"], ease.in], [stamp + 0.35, [tgt[0], tgt[1] + 2, -20, "fist"]], [stamp + 0.7, [tgt[0] + 40, tgt[1] - 40, -30, "fist"], ease.out], [stamp + 1.1, null],
    ]);
    const slam = tt > stamp ? 1 - 0.1 * Math.sin(clamp((tt - stamp) / 0.2) * Math.PI) : 1;
    const look = kf(tt, [[a, -3], [a + 3, -5], [lift.a0 + 0.3, -6], [a + 11, -5]]);
    const sp = talk([K03, K04], tt, { eyes: mt.eyes, gx: look, sx: b.sx * (2 - slam), sy: b.sy * slam });
    return {
      x: b.x, y: b.y, size, lean: b.lean + (tt > a + 11 && tt < stamp + 0.6 ? -8 : -3), skew: b.skew,
      draw: { mood: mt.mood, prop: tt > a + 10.5 && tt < stamp + 1.2 ? ("seal" as const) : ("none" as const), attach: true, t: tt + 2, wiggle: sp.wiggle, over: { ...sp.over, ...(R ? { right: R } : {}) } },
    };
  };
  const stampMark = t > stamp && t < stamp + 0.9 ? (
    <div style={{ position: "absolute", left: 195 - 120, top: 560 - 60, width: 240, height: 120, zIndex: 93, border: "6px solid #C5F25C", borderRadius: 20, display: "grid", placeItems: "center", transform: `rotate(-8deg) scale(${1.3 - 0.3 * ease.out(clamp((t - stamp) / 0.12))})`, opacity: 1 - clamp((t - stamp - 0.5) / 0.4), fontFamily: "Geist Mono", fontWeight: 700, fontSize: 34, letterSpacing: 6, color: "#C5F25C", background: "rgba(197,242,92,0.08)" }}>SEALED</div>
  ) : null;
  return (
    <>
      <Phone pose={pose} over={<><Touches t={t} taps={taps} />{stampMark}<div style={{ position: "absolute", inset: 0, zIndex: 92, background: `rgba(0,0,0,${0.55 * dimK})` }} /></>}>
        <Flow t={t} steps={steps} />
      </Phone>
      <Lift t={t} pose={pose} rect={RULES_RECT} to={{ x: 560, y: 600, s: 1.55, ry: 14, rx: 4, rz: -2 }} {...lift}>
        <div style={{ width: 350 }}><RowList label="THE RULES" rows={C6_RULES} /></div>
      </Lift>
      <Keeper depth={160} id="k-promise" t={t} perf={perf} z={40} />
    </>
  );
}
