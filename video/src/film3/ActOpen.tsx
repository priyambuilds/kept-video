// Act 0 + 1 (v3 §2). The 15 s teaser's opening, unchanged in spirit (bed-tap, record stop, slap, drop, logo,
// "So I made it cost something.") with bubbles off (subtitles carry the words); then the Keeper yanks the phone
// up over the cream and we sign in: A1 → Seeker Wallet → sign → "Seeker verified."
import React from "react";
import { AbsoluteFill } from "remotion";
import { S1Opening } from "../scenes/S1Opening";
import { S3Aha } from "../scenes/S3Aha";
import type { Beats, Cut } from "../data/cuts";
import { clamp, ease, kf } from "../lib/anim";
import { Phone } from "../phone/Phone";
import { Flow, Touches } from "../phone/Flow";
import { ConnectA2, SignScreen, VerifiedA3, WelcomeA1 } from "../app/screens/onboarding";
import { Keeper } from "../keeper/Keeper";
import { moodTrack } from "../keeper/perf";
import { body } from "../keeper/actor";
import { focus, poseAt } from "../film2/stage";
import { Caption } from "./common";
import { T, VO_PLACED } from "./timeline";

const Z = { cam: 0, cheat: 0, fail: 0, real: 0, checks: [0, 0, 0] as [number, number, number], windup: 0, drop2: 0, counters: 0, kept25: 0, happy: 0, ledger: 0, plate: 0, glint: 0, watch: 0 };
const beats: Beats = { end: T.out, hookTap: 0.55, freeze: T.freeze, cloak: T.freeze + 0.85, raise: T.slap - 0.31, slap: T.slap, drop1: T.drop1, popin: T.popin, yank: T.yank, ...Z };
export const OPEN_CUT: Cut = { id: "15", dur: T.out, b: beats, vo: VO_PLACED.filter((l) => l.id === "L01" || l.id === "L03a"), music: "", sfx: [], bubbles: false };

/** Acts 0–1, drawn outside the 3D stage (the teaser scenes are flat full-frame). */
export function ActTeaser({ t, frame }: { t: number; frame: number }) {
  if (t >= T.yank + 0.5) return null;
  const p = { t, frame, cut: OPEN_CUT, fmt: "16x9" as const, W: 1920, H: 1080 };
  // The yank: the dark world (the stage beneath) rises from the bottom edge with a lime lip, eating the cream.
  const up = ease.enter(clamp((t - T.yank) / 0.5));
  return (
    <>
      <AbsoluteFill style={{ clipPath: up > 0 ? `inset(0 0 ${up * 100}% 0)` : undefined }}>
        {t < T.drop1 ? <S1Opening {...p} /> : <S3Aha {...p} />}
      </AbsoluteFill>
      {up > 0 && up < 1 ? <div style={{ position: "absolute", left: 0, right: 0, top: 1080 * (1 - up) - 6, height: 6, background: "#C5F25C", boxShadow: "0 0 30px rgba(197,242,92,0.6)" }} /> : null}
    </>
  );
}

/** Act 1 on the stage: the dark panel + phone yanked up over the cream, then sign-in. */
export function ActWelcome({ t }: { t: number }) {
  const a = T.yank;
  if (t < a - 0.05 || t >= T.promise + 0.6) return null;
  const m = (at: number, x: number) => (x - at) * 1000;
  const pose = poseAt(t, [
    [a, { x: 1180, y: 545 + 1100, s: 1.3, rx: -18, ry: -10, rz: 4 }],
    [a + 0.55, { x: 1180, y: 600, s: 1.22, rx: -16, ry: -8, rz: 2 }, ease.out],
    [a + 1.6, { x: 1170, y: 560, s: 1.05, rx: -7, ry: -10, rz: 0 }, ease.inOut],
    [a + 2.05, { ...focus(200, 250, 1240, 520, 1.9), rx: 0, ry: -4, rz: -2 }, ease.inOut],
    [a + 2.75, { ...focus(200, 250, 1240, 520, 1.95), ry: -4, rz: -2 }, ease.linear],
    [a + 3.2, { x: 1170, y: 545, s: 1.04, rx: 2, ry: -14, rz: 0 }, ease.inOut],
    [T.promise - 0.2, { x: 1150, y: 545, s: 1.06, rx: 0, ry: -8 }, ease.inOut],
    [T.promise + 0.3, { ...focus(195, 250, 960, 470, 2.2), rx: 0, ry: 0, rz: -3 }, ease.inOut],
  ]);
  const steps = [
    { at: a - 0.3, el: <WelcomeA1 pressAt={m(a - 0.3, a + 1.55)} />, trans: "cut" as const },
    { at: a + 1.75, el: <ConnectA2 pressAt={m(a + 1.75, a + 2.45)} /> },
    { at: a + 2.65, el: <SignScreen title="Sign in to KEPT" sub="Check your wallet to approve the message." steps={[1, 3]} successAt={850} successChip="Signed" /> },
    { at: a + 3.75, el: <VerifiedA3 pressAt={m(a + 3.75, T.promise - 0.35)} />, trans: "fade" as const },
  ];
  const taps = [{ at: a + 1.55, x: 195, y: 723 }, { at: a + 2.45, x: 200, y: 239 }, { at: T.promise - 0.35, x: 195, y: 783 }];
  // The Keeper: pops up at the phone's right edge as it lands, waves (welcome), watches the sign-in, ducks out.
  const kx = 1580, ky = 1070;
  const perf = (tt: number) => {
    const b = body(tt, [[a + 0.35, kx + 40, ky + 520], [a + 0.85, kx, ky, ease.outBack], [T.promise - 0.5, kx - 20, ky, ease.inOut], [T.promise + 0.1, kx + 60, ky + 600, ease.in]]);
    const mt = moodTrack(tt, [[0, "smug"], [a + 2.2, "side"], [a + 3.9, "neutral"]]);
    const wave = tt > a + 0.9 && tt < a + 1.9;
    return {
      x: b.x, y: b.y, size: 300, lean: b.lean - 6, skew: b.skew,
      draw: { mood: mt.mood, anim: wave ? ("wave" as const) : ("idle" as const), t: tt, over: { eyes: mt.eyes, sx: b.sx, sy: b.sy, gx: tt > a + 2 ? -5 : 0 } },
    };
  };
  return (
    <>
      <Phone pose={pose} over={<Touches t={t} taps={taps} />}><Flow t={t} steps={steps} /></Phone>
      {t < T.promise + 0.1 ? <Keeper depth={160} id="k-welcome" t={t} perf={perf} z={40} /> : null}
      <Caption t={t} at={a + 3.2} out={T.promise - 0.4} x={130} y={470} text="No passwords. Your Seeker is your login." size={40} />
    </>
  );
}
export const _k = kf;
