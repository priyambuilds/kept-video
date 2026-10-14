// v4 · Swear an Oath (docs/LAUNCH_FILM_V4.md §2; the v2 flow with v3's camera and fixes, re-centred for a
// text-free frame). C1 typing (ECU) → C2 Dumbbell → C3 7 days → C4 group + 1,000 (dutch ECU on the
// stake) → C5 → C6 "Read it like a contract." (the rules card lifts out, then lands back *into its own slot*:
// the on-screen rules are hidden only while the card is out) → Sign & stake → the Keeper slams his seal → "Sworn."
import React from "react";
import { clamp, ease, kf, wobble } from "../lib/anim";
import { Phone } from "../phone/Phone";
import { Flow, Touches } from "../phone/Flow";
import { C6_RULES, GoalC1, LengthC3, ObjectC2, ReviewC5, StakeC4, SwornC7ok, TermsC6 } from "../app/screens/oath";
import { LookA4, SignScreen } from "../app/screens/onboarding";
import { RowList } from "../app/kit/rows";
import { Keeper } from "../keeper/Keeper";
import { handTrack, moodTrack, talk, toRig } from "../keeper/perf";
import { body } from "../keeper/actor";
import { focus, poseAt } from "../film2/stage";
import { Lift } from "../film2/Lift";
import { T } from "./timeline";
import { useScript } from "./script";

const RULES_RECT: [number, number, number, number] = [20, 428, 350, 280];

export function ActOath({ t }: { t: number }) {
  const { say } = useScript();
  const a = T.oath;
  if (t < a - 0.6 || t >= T.friends + 0.7) return null;
  const m = (at: number, x: number) => (x - at) * 1000;
  const lift = { a0: a + 8.0, a1: a + 8.75, b0: a + 9.85, b1: a + 10.5 };
  const stamp = a + 11.8;
  const shake = wobble(t, stamp, 10, 16, 10);
  const base = poseAt(t, [
    [a - 0.6, { x: 1000, y: 545, s: 1.06, rx: 0, ry: -6 }],
    [a + 0.3, { ...focus(195, 250, 960, 470, 2.2), rx: 0, ry: 0, rz: -3 }, ease.inOut],
    [a + 1.8, { ...focus(195, 262, 950, 480, 2.32), rz: -2 }, ease.linear],
    [a + 2.4, { x: 940, y: 545, s: 1.02, ry: -14, rx: 3, rz: 0 }, ease.inOut],
    [a + 4.6, { x: 930, y: 545, s: 1.04, ry: -6, rx: 1 }, ease.inOut],
    [a + 5.45, { ...focus(195, 388, 980, 560, 2.05), rx: 0, ry: 6, rz: 7 }, ease.inOut],
    [a + 6.25, { ...focus(195, 388, 990, 560, 2.12), ry: 6, rz: 6 }, ease.linear],
    [a + 6.8, { x: 950, y: 545, s: 1.0, ry: 10, rx: 2, rz: 0 }, ease.inOut],
    [lift.a0, { x: 990, y: 545, s: 0.98, ry: -6 }, ease.inOut],
    [lift.a1, { x: 1270, y: 560, s: 0.9, ry: -26, rx: 3 }, ease.inOut],
    [lift.b0, { x: 1270, y: 560, s: 0.9, ry: -26, rx: 3 }, ease.linear],
    [lift.b1, { x: 1000, y: 545, s: 1.0, ry: 0, rx: 0 }, ease.inOut],
    [a + 11.2, { x: 900, y: 560, s: 1.02, ry: 4, rx: 4 }, ease.inOut],
    [stamp + 0.6, { x: 900, y: 555, s: 1.06, ry: 2, rx: 2 }, ease.inOut],
    [T.friends - 0.25, { x: 960, y: 545, s: 1.1, ry: 0, rx: 0 }, ease.inOut],
  ]);
  const dimK = t > lift.a0 && t < lift.b1 ? Math.min(1, (t - lift.a0) / 0.5) * (t > lift.b0 ? 1 - (t - lift.b0) / 0.65 : 1) : 0;
  const pose = { ...base, x: base.x + shake, y: base.y + Math.abs(shake) * 0.6, dim: dimK };
  const steps = [
    { at: T.signin + 3.75, el: <LookA4 shuffles={[m(T.signin + 3.75, T.signin + 4.75), m(T.signin + 3.75, T.signin + 5.55)]} pressAt={m(T.signin + 3.75, a - 0.45)} /> },
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
  const LN = say("oath");
  const size = 440;
  const perf = (tt: number) => {
    const b = body(tt, [
      [a - 0.6, 1560, 1640], [a + 1.9, 1560, 1640], [a + 2.5, 1390, 1080, ease.outBack, 0], [a + 4.4, 1390, 1080], [a + 4.9, 1330, 1080, ease.inOut, 40],
      [lift.a0, 1330, 1080], [lift.a0 + 0.45, 1640, 1100, ease.inOut, 40], [lift.b1, 1640, 1100], [a + 11.0, 1230, 1085, ease.inOut, 70],
      [T.friends - 0.5, 1240, 1085], [T.friends + 0.2, 1560, 1640, ease.in],
    ]);
    const mt = moodTrack(tt, [[0, "neutral"], [a + 5.5, "smug"], [lift.a0, "side"], [a + 11.0, "stern"], [stamp + 0.3, "smug"]]);
    // seal hand: raise, slam onto the lower half of the phone, hold, lift
    const tgt = toRig(900, 650, b.x, b.y, size);
    const R = handTrack(tt, [
      [a + 10.9, null], [stamp - 0.45, [tgt[0] + 30, tgt[1] - 70, -40, "fist"], ease.out], [stamp - 0.05, [tgt[0] + 26, tgt[1] - 80, -45, "fist"]],
      [stamp, [tgt[0], tgt[1], -20, "fist"], ease.in], [stamp + 0.35, [tgt[0], tgt[1] + 2, -20, "fist"]], [stamp + 0.7, [tgt[0] + 40, tgt[1] - 40, -30, "fist"], ease.out], [stamp + 1.1, null],
    ]);
    const slam = tt > stamp ? 1 - 0.1 * Math.sin(clamp((tt - stamp) / 0.2) * Math.PI) : 1;
    const look = kf(tt, [[a, -3], [a + 3, -5], [lift.a0 + 0.3, -6], [a + 11, -5]]);
    const sp = talk(LN, tt, { eyes: mt.eyes, gx: look, sx: b.sx * (2 - slam), sy: b.sy * slam });
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
      {t < T.friends ? <Phone pose={pose} over={<><Touches t={t} taps={[{ at: a - 0.45, x: 195, y: 723 }, ...taps]} />{stampMark}<div style={{ position: "absolute", inset: 0, zIndex: 92, background: `rgba(0,0,0,${0.55 * dimK})` }} /></>}>
        <Flow t={t} steps={steps} />
      </Phone> : null}
      <Lift t={t} pose={pose} rect={RULES_RECT} to={{ x: 520, y: 590, s: 1.55, ry: 14, rx: 4, rz: -2 }} {...lift}>
        <div style={{ width: 350 }}><RowList label="THE RULES" rows={C6_RULES} /></div>
      </Lift>
      <Keeper depth={160} id="k-promise" t={t} perf={perf} z={40} />
    </>
  );
}
