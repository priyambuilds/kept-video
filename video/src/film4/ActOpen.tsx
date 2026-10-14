// v4 · 0:00 Hook → 0:05.9 drop 1 → onboarding (docs/LAUNCH_FILM_V4.md §2). The v2 opening, re-staged for a
// text-free frame: the phone is the hero in the middle, the Keeper leans on it and does the talking.
// Lock screen fills with KEPT nudges → he pokes the last one → drop: dive into the splash → A1 → Seeker Wallet →
// sign → verified → pick a look (two shuffles, "Bold.").
import React from "react";
import { clamp, ease, kf } from "../lib/anim";
import { Phone } from "../phone/Phone";
import { Flow, Touches } from "../phone/Flow";
import { ConnectA2, LockM1, LookA4, SignScreen, SplashA0, VerifiedA3, WelcomeA1 } from "../app/screens/onboarding";
import { Keeper } from "../keeper/Keeper";
import { handTrack, moodTrack, pointAt, talk, toRig } from "../keeper/perf";
import { body } from "../keeper/actor";
import { focus, poseAt, screenToStage } from "../film2/stage";
import { T } from "./timeline";
import { useScript } from "./script";

const NOTIF_AT = [0.3, 0.85, 1.45, 2.1, 2.8, 3.55];

export function ActOpen({ t }: { t: number }) {
  const { say } = useScript();
  if (t >= T.oath + 0.4) return null;
  const phoneOn = t < T.oath - 0.6; // ActOath takes the phone over (same pose) from here
  const d1 = T.drop1, s = T.signin;
  const press = d1 - 0.5;
  const m = (at: number, x: number) => (x - at) * 1000;
  const pose = poseAt(t, [
    [0, { x: 880, y: 590, s: 0.8, rx: 14, ry: -20, rz: -4 }],
    [press - 0.3, { x: 880, y: 560, s: 0.9, rx: 5, ry: -10, rz: -1 }, ease.inOut],
    [press, { x: 885, y: 555, s: 0.92, rx: 2, ry: -6, rz: 0 }, ease.out],
    [d1, { x: 960, y: 545, s: 0.98, rx: 0, ry: 0, rz: 0 }, ease.in],
    [d1 + 0.65, { ...focus(195, 360, 960, 470, 2.5), rx: 0, ry: 0 }, ease.out],
    [d1 + 1.35, { ...focus(195, 360, 960, 470, 2.62) }, ease.linear],
    [d1 + 2.1, { x: 900, y: 540, s: 1.0, ry: -10, rx: 3 }, ease.inOut],
    [s - 0.2, { x: 880, y: 540, s: 1.0, ry: -6, rx: 2 }, ease.inOut],
    // Seeker Wallet + signature: push in on the wallet sheet
    [s + 1.0, { ...focus(195, 300, 900, 500, 1.55), ry: -2, rx: 0 }, ease.inOut],
    [s + 2.2, { ...focus(195, 300, 900, 500, 1.6), ry: -2 }, ease.linear],
    [s + 2.8, { x: 900, y: 540, s: 1.02, ry: 8, rx: 2, rz: 0 }, ease.inOut],
    [s + 3.6, { x: 920, y: 540, s: 1.0, ry: 6, rx: 1 }, ease.linear],
    // pick a look: dutch push on the avatar
    [s + 4.3, { ...focus(195, 330, 960, 470, 1.7), ry: 0, rx: 0, rz: -4 }, ease.inOut],
    [s + 6.5, { ...focus(195, 330, 960, 470, 1.78), rz: -3 }, ease.linear],
    [T.oath - 0.6, { x: 1000, y: 545, s: 1.06, rx: 0, ry: -6, rz: 0 }, ease.inOut],
    [T.oath + 0.3, { ...focus(195, 250, 960, 470, 2.2), rx: 0, ry: 0, rz: -3 }, ease.inOut],
  ]);
  const steps = [
    { at: 0, el: <LockM1 at={NOTIF_AT.map((a) => a * 1000)} pressAt={press * 1000} />, trans: "cut" as const },
    { at: d1, el: <SplashA0 />, trans: "fade" as const },
    { at: d1 + 1.95, el: <WelcomeA1 pressAt={m(d1 + 1.95, s - 0.15)} />, trans: "fade" as const },
    { at: s + 0.05, el: <ConnectA2 pressAt={m(s + 0.05, s + 0.85)} /> },
    { at: s + 1.05, el: <SignScreen title="Sign in to KEPT" sub="Check your wallet to approve the message." steps={[1, 3]} successAt={900} successChip="Signed" /> },
    { at: s + 2.3, el: <VerifiedA3 pressAt={m(s + 2.3, s + 3.55)} />, trans: "fade" as const },
    { at: s + 3.75, el: <LookA4 shuffles={[m(s + 3.75, s + 4.75), m(s + 3.75, s + 5.55)]} pressAt={m(s + 3.75, T.oath - 0.45)} /> },
  ];
  const taps = [
    { at: s - 0.15, x: 195, y: 723 }, { at: s + 0.85, x: 200, y: 239 }, { at: s + 3.55, x: 195, y: 783 },
    { at: s + 4.75, x: 195, y: 456 }, { at: s + 5.55, x: 195, y: 456 }, { at: T.oath - 0.45, x: 195, y: 723 },
  ];
  // ── the Keeper ──
  // Hook: rises behind the phone's right edge, leans on it, deadpan; "This one bills you." → pokes the newest nudge.
  // Drop: ducks out; pops back up right of the phone, waves on "Welcome", gestures at the wallet, judges the look.
  const size = 400;
  const notif = screenToStage(pose, 195, 298);
  const perf = (tt: number) => {
    const b = body(tt, [
      [0.45, 1330, 1560], [1.05, 1260, 1075, ease.outBack], [press - 0.9, 1250, 1075], [press - 0.45, 1190, 1070, ease.inOut, 26],
      [d1 - 0.1, 1190, 1070], [d1 + 0.25, 1260, 1600, ease.in],
      [d1 + 1.2, 1500, 1600], [d1 + 1.7, 1440, 1080, ease.outBack, 0], [s + 3.4, 1440, 1080], [s + 3.9, 1380, 1075, ease.inOut, 50],
      [T.oath - 0.7, 1380, 1075], [T.oath + 0.15, 1560, 1640, ease.in],
    ]);
    const mt = moodTrack(tt, [[0, "bored"], [3.1, "smug"], [press, "side"], [d1 + 1.2, "smug"], [s + 0.9, "neutral"], [s + 4.4, "side"], [s + 6.3, "smug"]]);
    const [px, py] = toRig(notif[0] + 30, notif[1], b.x, b.y, size);
    const R = handTrack(tt, [
      [3.6, null], [4.0, pointAt(22, 92, -95), ease.out], [press - 0.35, pointAt(px + 8, py - 6, -88), ease.inOut], [press, pointAt(px, py, -92), ease.in], [press + 0.25, pointAt(px + 10, py - 8, -88), ease.out], [d1, null],
      [d1 + 2.9, null], [s + 0.7, pointAt(16, 70, -110), ease.out], [s + 2.1, pointAt(18, 74, -105)], [s + 2.5, null],
    ]);
    const wave = tt > d1 + 1.75 && tt < d1 + 2.8;
    const sp = talk(say("open"), tt, { eyes: mt.eyes, gx: tt < 3 ? 1 : -5, gy: tt > s + 4 && tt < s + 6.2 ? 2 : 0, sx: b.sx, sy: b.sy });
    return {
      x: b.x, y: b.y, size, lean: b.lean + kf(tt, [[1, -7], [press - 0.4, -12], [d1, -6], [d1 + 1.6, -4], [s + 4.4, -9], [s + 6.3, -3]]), skew: b.skew,
      draw: { mood: mt.mood, anim: wave ? ("wave" as const) : ("idle" as const), t: tt + 1.3, wiggle: sp.wiggle, over: { ...sp.over, ...(R ? { right: R } : {}) } },
      opacity: tt < 0.45 ? 0 : 1,
    };
  };
  return (
    <>
      {phoneOn ? <Phone pose={pose} over={<Touches t={t} taps={taps} />}><Flow t={t} steps={steps} /></Phone> : null}
      <Keeper depth={160} id="k-open" t={t} perf={perf} z={40} />
    </>
  );
}
export const _c = clamp;
