// v4 · Review + Day 7 (docs/LAUNCH_FILM_V4.md §2; v3's acts, text-free). WED: Dev's photo failed the AI three times, so his friends decide — the Keeper squints through
// his lens (foreground, out of focus), Riya approves on her phone, you approve on yours: "Approved 2–1."
// SUN · Day 7: "Iron Week, kept." 1,107 counts up → Claim → "Claimed." Whip to Arjun's phone: down 143.
import React from "react";
import { clamp, ease, kf } from "../lib/anim";
import { Phone } from "../phone/Phone";
import { Flow, Touches } from "../phone/Flow";
import { ApprovedG3, ArjunL2, ReviewG1 } from "../app/screens/social";
import { ClaimedJ1ok, KeptL1 } from "../app/screens/stakes";
import { Keeper } from "../keeper/Keeper";
import { handTrack, moodTrack, talk } from "../keeper/perf";
import { body } from "../keeper/actor";
import { focus, poseAt } from "../film2/stage";
import { NameTag, whipBlur } from "../film3/common";
import { T } from "./timeline";
import { useScript } from "./script";

export function ActReview({ t }: { t: number }) {
  const { say } = useScript();
  const a = T.review;
  if (t < a || t >= T.day7) return null;
  const m = (at: number, x: number) => (x - at) * 1000;
  const pose = poseAt(t, [
    [a, { x: 1120, y: 560, s: 1.08, rx: 4, ry: 14, rz: -2 }],
    [a + 1.2, { x: 1100, y: 550, s: 1.12, rx: 2, ry: 8, rz: -1 }, ease.out],
    [a + 2.6, { ...focus(195, 300, 1080, 470, 1.5), rx: 0, ry: 4, rz: 0 }, ease.inOut],
    [a + 3.0, { ...focus(195, 400, 1080, 560, 1.32), ry: 2 }, ease.inOut],
    [a + 3.4, { x: 1100, y: 545, s: 1.1, rx: 0, ry: 0 }, ease.inOut],
    [T.day7, { x: 1090, y: 545, s: 1.14, ry: -4 }, ease.linear],
  ]);
  const riya = poseAt(t, [[a + 0.2, { x: 1880, y: 640, s: 0.5, ry: -22, rx: 6, rz: 3, opacity: 0 }], [a + 0.8, { x: 1700, y: 600, s: 0.52, ry: -22, rx: 6, rz: 3, opacity: 1 }, ease.out], [a + 2.6, { x: 1690, y: 600, s: 0.53, ry: -22 }, ease.linear], [a + 3.1, { x: 1900, y: 640, s: 0.5, opacity: 0 }, ease.in]]);
  const steps = [{ at: a - 0.8, el: <ReviewG1 riyaAt={m(a - 0.8, a + 1.95)} approveAt={m(a - 0.8, a + 2.95)} />, trans: "cut" as const }, { at: a + 3.15, el: <ApprovedG3 />, trans: "fade" as const }];
  const rSteps = [{ at: a - 0.8, el: <ReviewG1 approveAt={m(a - 0.8, a + 1.75)} riyaAt={1e9} />, trans: "cut" as const }];
  // The Keeper in the foreground, huge and out of focus, lens up at the photo; sharpens and nods on the verdict.
  const perf = (tt: number) => {
    const b = body(tt, [[a, 420, 1720], [a + 0.6, 470, 1640, ease.out], [a + 3.2, 470, 1640], [a + 3.6, 520, 1600, ease.out, 20]]);
    const mt = moodTrack(tt, [[0, "side"], [a + 3.3, "smug"]]);
    const R = handTrack(tt, [[a + 0.4, null], [a + 0.9, [150, 60, 20, "fist"], ease.out], [a + 3.0, [148, 64, 18, "fist"]], [a + 3.4, null]]);
    const sp = talk(say("review"), tt, { eyes: mt.eyes, gx: 5, gy: -1, sx: b.sx, sy: b.sy });
    const focusK = clamp((tt - (a + 3.15)) / 0.35);
    return { x: b.x, y: b.y, size: 1050, lean: b.lean + 8, skew: b.skew, filter: `blur(${(1 - focusK) * 7}px)`, draw: { mood: mt.mood, prop: tt < a + 3.3 ? ("lens" as const) : ("none" as const), anim: tt > a + 3.5 ? ("thumbs" as const) : ("idle" as const), attach: true, t: tt, wiggle: sp.wiggle, over: { ...sp.over, ...(R ? { right: R } : {}) } } };
  };
  return (
    <>
      <Phone pose={riya} over={<Touches t={t} taps={[{ at: a + 1.75, x: 195, y: 723 }]} />}><Flow t={t} steps={rSteps} /></Phone>
      <NameTag who="R" pose={riya} t={t} at={a + 0.7} />
      <Phone pose={pose} over={<Touches t={t} taps={[{ at: a + 2.95, x: 195, y: 723 }]} />}><Flow t={t} steps={steps} /></Phone>
      <Keeper depth={160} id="k-review" t={t} perf={perf} z={60} />
    </>
  );
}

export function ActDay7({ t }: { t: number }) {
  const { say } = useScript();
  const a = T.day7;
  if (t < a || t >= T.bounty) return null;
  const m = (at: number, x: number) => (x - at) * 1000;
  const sw = a + 3.85; // whip to Arjun
  const whip = t > sw && t < sw + 0.4 ? (t - sw) / 0.4 : 0;
  const yours = poseAt(t, [
    [a, { x: 1060, y: 600, s: 1.14, rx: -14, ry: -10, rz: 2 }],
    [a + 1.0, { x: 1040, y: 580, s: 1.1, rx: -10, ry: -8 }, ease.out],
    [a + 1.5, { ...focus(195, 470, 960, 520, 2.2), rx: -4, ry: 0, rz: -2 }, ease.inOut],
    [a + 2.6, { ...focus(195, 470, 960, 520, 2.3), rx: -4, rz: -1 }, ease.linear],
    [a + 3.1, { x: 1040, y: 515, s: 1.0, rx: -4, ry: -6, rz: 0 }, ease.inOut],
    [sw, { x: 1000, y: 520, s: 1.02, ry: -4 }, ease.linear],
    [sw + 0.4, { x: -300, y: 545, s: 1.06, ry: 10 }, ease.in],
  ]);
  const arjun = poseAt(t, [
    [sw, { x: 2400, y: 560, s: 1.02, ry: -10, rz: 6 }],
    [sw + 0.4, { x: 1080, y: 560, s: 1.02, ry: -6, rz: 4 }, ease.out],
    [T.bounty, { x: 1060, y: 560, s: 1.08, ry: -4, rz: 3 }, ease.linear],
  ]);
  const ySteps = [{ at: a - 0.3, el: <KeptL1 pressAt={m(a - 0.3, a + 3.25)} />, trans: "cut" as const }, { at: a + 3.45, el: <ClaimedJ1ok />, trans: "fade" as const }];
  const aSteps = [{ at: sw - 0.2, el: <ArjunL2 />, trans: "cut" as const }];
  const perf = (tt: number) => {
    const b = body(tt, [[sw + 0.2, 1700, 1400], [sw + 0.7, 1560, 1080, ease.outBack], [T.bounty, 1560, 1080]]);
    const mt = moodTrack(tt, [[0, "smug"], [sw + 2.8, "wink"], [sw + 3.0, "smug"]]);
    const sp = talk(say("day7"), tt, { eyes: mt.eyes, gx: -5, sx: b.sx, sy: b.sy });
    return { x: b.x, y: b.y, size: 330, lean: b.lean - 6, skew: b.skew, draw: { mood: mt.mood, prop: "ledger" as const, t: tt, wiggle: sp.wiggle, over: sp.over } };
  };
  return (
    <>
      {t < sw + 0.45 ? <Phone pose={{ ...yours, blur: whipBlur(whip) }} over={<Touches t={t} taps={[{ at: a + 3.25, x: 195, y: 783 }]} />}><Flow t={t} steps={ySteps} /></Phone> : null}
      {t > sw ? <Phone pose={{ ...arjun, blur: whipBlur(whip) }}><Flow t={t} steps={aSteps} /></Phone> : null}
      {t > sw + 0.3 ? <NameTag who="A" pose={arjun} t={t} at={sw + 0.35} accent="#F87171" /> : <NameTag who="Y" pose={yours} t={t} at={a + 0.4} label="You" accent="#C5F25C" />}
      {t > sw ? <Keeper depth={160} id="k-day7" t={t} perf={perf} z={40} /> : null}
    </>
  );
}
export const _k = kf;
