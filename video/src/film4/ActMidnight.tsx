// v4 · Arjun's night + midnight (docs/LAUNCH_FILM_V4.md §2; v3's acts, text-free: no time card, no countdown
// overlay — the camera pushes into Arjun's lock-screen clock instead). TUE 11:52 PM: Arjun's day is still pending. You nudge him → whip to Arjun's phone: the nudges
// pile up unread while the Keeper flips a coin. 23:59:57 … 58 … 59 → MIDNIGHT (drop 2): all four phones take the hit
// at once, the scythe cuts across Arjun's phone, a red −143 SKR tears off it and bursts into coins that land in You,
// Riya and Dev (+43 each, 14 to the Keeper's sack). Smash-cut: the Keeper in shades, dancing. "I love this part."
import React from "react";
import { BEAT } from "./timeline";
import { ROW } from "./ActFriends";
import { clamp, ease, kf, lerp, prog, rnd, wobble } from "../lib/anim";
import { MONO, SANS } from "../lib/theme";
import { Phone } from "../phone/Phone";
import type { Pose } from "../phone/Phone";
import { Flow, Touches } from "../phone/Flow";
import { ActiveD2 } from "../app/screens/stakes";
import { LockM1 } from "../app/screens/onboarding";
import { Coin } from "../app/kit/fx";
import { Keeper } from "../keeper/Keeper";
import { handTrack, moodTrack, talk } from "../keeper/perf";
import { body, groove } from "../keeper/actor";
import { KeeperCU, NameTag, camAt, viaCam, whipBlur } from "../film3/common";
import type { Who } from "../film3/common";
import { FriendPill } from "../film3/ActDay1";
import { T } from "./timeline";
import { useScript } from "./script";

const ROW_Y = 560, PS = 0.62;
export const CU_PAY = () => [T.drop2 + 4.55, T.review] as const;

export function ActArjun({ t }: { t: number }) {
  const { say } = useScript();
  const a = T.arjun, d2 = T.drop2;
  if (t < a || t >= d2) return null;
  const m = (at: number, x: number) => (x - at) * 1000;
  // Your phone (world x = ROW.Y … we keep the same row layout so the drop can cut straight to the wide row).
  const cam = camAt(t, [
    [a, { x: ROW.R, y: ROW_Y, s: 1.75, rz: 0 }],
    [a + 2.75, { x: ROW.R - 20, y: ROW_Y, s: 1.8 }, ease.linear],
    [a + 3.15, { x: ROW.A, y: ROW_Y - 10, s: 1.85, rz: 9 }, ease.inOut],
    [d2 - 1.9, { x: ROW.A, y: ROW_Y - 20, s: 2.0, rz: 10 }, ease.linear],
    // the last seconds: push into the lock-screen clock (23:59), roll out of the dutch angle
    [d2 - 0.15, { x: ROW.A, y: ROW_Y + (150 - 422) * PS, s: 4.6, rz: 2 }, ease.inOut],
    [d2, { x: ROW.A, y: ROW_Y + (150 - 422) * PS, s: 4.9, rz: 0 }, ease.linear],
  ]);
  const whip = t > a + 2.75 && t < a + 3.15 ? (t - (a + 2.75)) / 0.4 : 0;
  // Your phone stands where Riya's sits in the row for this act (so the whip right lands on Arjun).
  const yours: Pose = { ...viaCam(cam, { x: ROW.R, y: ROW_Y, s: PS }), blur: whipBlur(whip), opacity: 1 - clamp((t - (a + 3.3)) / 0.5) };
  const arjun: Pose = { ...viaCam(cam, { x: ROW.A, y: ROW_Y, s: PS }), blur: whipBlur(whip) };
  const youSteps = [{ at: a - 0.8, el: <ActiveD2 today={2} day="Day 2/7" missAt={m(a - 0.8, d2 + 10)} nudgeAt={m(a - 0.8, a + 2.25)} scroll={0} />, trans: "cut" as const }];
  const arjunSteps = [{ at: a - 0.8, el: <LockM1 items={[["Iron Week: 2 hours to midnight.", "21:58"], ["Riya nudged you. Your move.", "23:41"], ["Sam nudged you. Your move.", "now"]]} at={[-1e6, -1e6, m(a - 0.8, a + 3.35)]} clock="23:59" date="Tuesday 14 October" />, trans: "cut" as const }];
  // The Keeper beside Arjun's phone, bored, flipping a coin; the scythe comes out for the last seconds.
  const perf = (tt: number) => {
    const b = body(tt, [[a + 3.0, 1420, 1100], [a + 3.5, 1410, 832, ease.outBack], [d2, 1410, 832]]);
    const mt = moodTrack(tt, [[0, "bored"], [a + 5.0, "smug"], [d2 - 1.2, "stern"]]);
    const sp = talk(say("arjun"), tt, { eyes: mt.eyes, gx: -5, sx: b.sx, sy: b.sy });
    const flip = tt < d2 - 1.15;
    return { x: b.x, y: b.y, size: 360, lean: b.lean - 4, skew: b.skew, draw: { mood: mt.mood, prop: flip ? ("flip" as const) : ("scythe" as const), anim: flip ? ("flip" as const) : ("idle" as const), t: tt, wiggle: sp.wiggle, over: sp.over } };
  };
  const kCam = (p: ReturnType<typeof perf>) => {
    const q = viaCam(cam, { x: p.x, y: p.y, s: 1 });
    return { ...p, x: q.x, y: q.y, size: p.size * cam.s / 1.8, lean: (p.lean ?? 0) + (cam.rz ?? 0) };
  };
  return (
    <>
      {yours.x > -400 && (yours.opacity ?? 1) > 0 ? <Phone pose={yours} over={<Touches t={t} taps={[{ at: a + 2.25, x: 195, y: 783 }]} />}><Flow t={t} steps={youSteps} /></Phone> : null}
      <Phone pose={arjun}><Flow t={t} steps={arjunSteps} /></Phone>
      {t > a + 2.9 && t < d2 - 0.5 ? <Keeper depth={160} id="k-arjun" t={t} perf={(tt) => kCam(perf(tt))} z={40} /> : null}
    </>
  );
}

export function ActPayday({ t }: { t: number }) {
  const { say } = useScript();
  const d2 = T.drop2, hit = d2 + 4 / 60;
  if (t < d2 || t >= T.review) return null;
  const [cu0] = CU_PAY();
  const m = (at: number, x: number) => (x - at) * 1000;
  const shake = wobble(t, hit, 14, 16, 8);
  const cam = camAt(t, [[d2, { x: 960, y: 520, s: 1.04 }], [cu0, { x: 960, y: 530, s: 1.1 }, ease.linear]]);
  const poseOf = (w: Who): Pose => {
    const p = viaCam(cam, { x: ROW[w], y: ROW_Y, s: PS, rx: 18 });
    return { ...p, x: p.x + shake, y: p.y + shake * 0.4, rz: (p.rz ?? 0) + shake * 0.05 };
  };
  const scr = (w: Who, sx: number, sy: number): [number, number] => { const p = poseOf(w); return [p.x + (sx - 195) * p.s, p.y + (sy - 422) * p.s * 0.95]; };
  // ── the −143 pill tears off Arjun's phone, hovers, bursts into coins ──
  const burst = d2 + 0.62;
  const [ax, ay] = scr("A", 195, 60);
  const up = ease.out(clamp((t - (hit + 0.05)) / 0.45));
  const loss = t < burst + 0.05 ? (
    <div style={{ position: "absolute", left: ax, top: lerp(ay, 150, up), zIndex: 72, transform: `translate(-50%,-50%) scale(${(0.5 + 0.5 * up) * (t > burst - 0.08 ? 1.25 : 1)}) rotate(${-4 + 8 * Math.sin(t * 30) * (t > burst - 0.15 ? 1 : 0)}deg)`, opacity: clamp(up * 3) }}>
      <FriendPillStatic who="A" text="−143 SKR" />
    </div>
  ) : null;
  const targets: ("Y" | "R" | "D")[] = ["Y", "R", "D"];
  const coins = Array.from({ length: 13 }, (_, j) => ({ j, fee: j === 12, to: targets[j % 3], t0: burst, land: d2 + 2 * BEAT + Math.floor(j / 2) * (BEAT / 4) + (j === 12 ? 0.25 : 0) }));
  const kx = 1440, ky = 1110, ksize = 480;
  const sack: [number, number] = [kx + 70, ky - 330];
  const coinEls = coins.map((c) => {
    if (t < c.t0 || t > c.land + 0.04) return null;
    const p = clamp((t - c.t0) / (c.land - c.t0));
    const dst: [number, number] = c.fee ? sack : scr(c.to, 195, 40);
    const src: [number, number] = [ax, 150];
    const peak: [number, number] = [lerp(src[0], dst[0], 0.5) + (rnd(c.j) - 0.5) * 300, Math.min(src[1], dst[1]) - 120 - rnd(c.j + 9) * 140];
    const x = (1 - p) ** 2 * src[0] + 2 * (1 - p) * p * peak[0] + p * p * dst[0];
    const y = (1 - p) ** 2 * src[1] + 2 * (1 - p) * p * peak[1] + p * p * dst[1];
    return <div key={c.j} style={{ position: "absolute", left: x - 16, top: y - 16, zIndex: 74, transform: `scale(${1.3 + Math.sin(p * Math.PI)}) rotate(${p * 600 * (rnd(c.j + 3) - 0.5)}deg)` }}><Coin size={32} /></div>;
  });
  const lastLand = (k: "Y" | "R" | "D") => Math.max(...coins.filter((c) => !c.fee && c.to === k).map((c) => c.land));
  const out = cu0 - 0.1;
  const pills = targets.map((k, i) => {
    const [x, y] = scr(k, 195, 40);
    return <FriendPill key={k} t={t} at={lastLand(k)} out={out} who={k} text="+43 SKR" x={x} y={y - 60 - 8 * i} tilt={(i - 1) * 3} />;
  });
  const feeAt = coins[12].land;
  // ── the Keeper: scythe raised, strike across Arjun's phone on the hit, then the sack catches the fee ──
  const perf = (tt: number) => {
    const R = handTrack(tt, [
      [d2 - 0.3, [150, 34, -75, "fist"]], [hit, [-40, 120, 95, "fist"], ease.out], [d2 + 0.25, [-50, 135, 112, "fist"], ease.out], [d2 + 0.7, [60, 140, 40, "fist"], ease.inOut], [d2 + 0.95, null],
    ]);
    const mt = moodTrack(tt, [[0, "stern"], [d2 + 0.8, "smug"], [feeAt, "happy"]]);
    const lean = kf(tt, [[d2 - 0.3, 6], [hit, -16, ease.out], [d2 + 0.7, -4, ease.inOut]]);
    const squash = tt > hit ? 1 - 0.07 * Math.sin(clamp((tt - hit) / 0.15) * Math.PI) : 1;
    const sp = talk(say("payday"), tt, { eyes: mt.eyes, gx: -5, ty: groove(tt, d2 + 1, cu0, BEAT, 2.5), sy: squash, sx: 2 - squash });
    return { x: kx + shake, y: ky, size: ksize, lean, draw: { mood: mt.mood, prop: tt < d2 + 0.9 ? ("scythe" as const) : ("sack" as const), attach: tt < d2 + 0.9, scytheFront: true, t: tt + 4.1, wiggle: sp.wiggle, over: { ...sp.over, ...(R ? { right: R } : {}) } } };
  };
  const smear = t >= d2 && t < d2 + 0.16 ? 1 - prog(t, hit, 0.1) : 0;
  const [gx, gy] = [kx - 80, ky - 380];
  return (
    <>
      {(["Y", "R", "A", "D"] as Who[]).map((w) => (
        <Phone key={w} pose={poseOf(w)}><Flow t={t} steps={[{ at: d2 - 0.6, el: <ActiveD2 missAt={m(d2 - 0.6, hit)} />, trans: "cut" as const }]} /></Phone>
      ))}
      {(["Y", "R", "A", "D"] as Who[]).map((w) => <NameTag key={w} who={w} pose={poseOf(w)} t={t} accent={w === "A" ? "#F87171" : undefined} />)}
      {loss}{coinEls}{pills}
      <Keeper depth={160} id="k-pay" t={t} perf={perf} z={60} />
      {smear > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, zIndex: 61 }}>
          <defs><linearGradient id="arc3" x1="1" x2="0"><stop offset="0" stopColor="#C5F25C" stopOpacity={0} /><stop offset="1" stopColor="#FFFFFF" /></linearGradient></defs>
          {(() => {
            const ang = kf(t, [[d2, -40], [hit, -175, ease.out], [d2 + 0.16, -200]]);
            const r1 = 470, r2 = 640, from = ang, to = Math.min(-10, ang + 150);
            const pt = (r: number, q: number) => `${gx + r * Math.cos((q * Math.PI) / 180)} ${gy + r * Math.sin((q * Math.PI) / 180)}`;
            return <path d={`M${pt(r2, from)} A${r2} ${r2} 0 0 1 ${pt(r2, to)} L${pt(r1, to)} A${r1} ${r1} 0 0 0 ${pt(r1, from)} Z`} fill="url(#arc3)" opacity={smear * 0.85} />;
          })()}
        </svg>
      ) : null}
      {t > hit && t < hit + 0.12 ? <div style={{ position: "absolute", inset: 0, zIndex: 65, background: "#FFFFFF", opacity: 0.35 * (1 - (t - hit) / 0.12) }} /> : null}
    </>
  );
}

/** Outside the 3D stage: the payday close-up (shades, jump). */
export function PaydayOverlay({ t }: { t: number }) {
  const { say } = useScript();
  const [cu0] = CU_PAY();
  if (t < cu0 || t >= T.review) return null;
  // ── the reaction close-up: shades, jump, giddy ──
  const cuPerf = (tt: number) => {
    const sp = talk(say("love"), tt, { gx: 0 });
    return { x: 960, y: 1500, size: 1320, lean: 6 * Math.sin((tt - cu0) / BEAT * Math.PI), draw: { mood: "shades" as const, anim: "jump" as const, prop: "sack" as const, t: tt - cu0 + 0.05, wiggle: sp.wiggle, over: sp.over } };
  };
  return <KeeperCU t={t} at={cu0} out={T.review} perf={cuPerf} id="k-cu-pay" tone="gold" />;
}

/** The pill without timing (used by the loss pill that we animate ourselves). */
function FriendPillStatic({ who, text }: { who: Who; text: string }) {
  return <div style={{ position: "relative" }}><FriendPill t={1} at={0} out={99} who={who} text={text} x={0} y={0} tone="red" /></div>;
}
export const _s = SANS;
