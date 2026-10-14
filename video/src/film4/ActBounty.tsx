// v4 · Bounties (docs/LAUNCH_FILM_V4.md §2; v3's act). A bigger table: Bounties. The phone pulls back into a crowd of ~110 strangers (avatars on a
// tilted plane); you join Northbound Run Club; the Keeper mows the crowd with his scythe in two swings; 27 stay lit —
// "27 survived. You're one of them." Then your profile: the 91 % kept-rate ring lifts out of the phone.
import React from "react";
import { clamp, ease, kf, rnd } from "../lib/anim";
import { Phone } from "../phone/Phone";
import { Flow, Touches } from "../phone/Flow";
import { DetailH2, EndedH5, FeedH1, JoinedH3 } from "../app/screens/bounty";
import { ProfileI1 } from "../app/screens/profile";
import { KeptRateRing } from "../app/kit/status";
import { Avatar } from "../app/kit/Avatar";
import { avatarFor } from "../app/kit/avatarPalette";
import { MEMBER } from "../app/theme";
import { Keeper } from "../keeper/Keeper";
import { handTrack, moodTrack, talk } from "../keeper/perf";
import { body } from "../keeper/actor";
import { poseAt } from "../film2/stage";
import { Lift } from "../film2/Lift";
import { T } from "./timeline";
import { useScript } from "./script";

const COLS = 14, ROWS = 8, TILE = 92, GAP = 18;
const CROWD = Array.from({ length: COLS * ROWS }, (_, i) => {
  const c = i % COLS, r = Math.floor(i / COLS);
  const you = c === 6 && r === 4, friend = (c === 8 && r === 3) || (c === 5 && r === 2);
  const keep = you || friend || rnd(i * 3.1 + 7) < 0.2;
  return { i, c, r, you, friend, keep, cfg: you ? MEMBER.Y.avatar : c === 8 && r === 3 ? MEMBER.R.avatar : c === 5 && r === 2 ? MEMBER.D.avatar : avatarFor(`crowd-${i}`) };
});

export function ActBounty({ t }: { t: number }) {
  const { say } = useScript();
  const a = T.bounty;
  if (t < a || t >= T.record) return null;
  const m = (at: number, x: number) => (x - at) * 1000;
  const sw1 = a + 4.2, sw2 = a + 5.35;
  const pose = poseAt(t, [
    [a, { x: 1260, y: 545, s: 1.04, ry: -8, rx: 2 }],
    [a + 1.2, { x: 1300, y: 560, s: 0.86, ry: -14, rx: 4 }, ease.inOut],
    [a + 3.4, { x: 1310, y: 560, s: 0.84, ry: -12, rx: 4 }, ease.linear],
    [a + 6.3, { x: 1320, y: 560, s: 0.84, ry: -10, rx: 3 }, ease.linear],
    [a + 6.9, { x: 1220, y: 545, s: 1.04, ry: -6, rx: 1 }, ease.inOut],
    [T.record, { x: 1230, y: 545, s: 1.06, ry: -5 }, ease.linear],
  ]);
  const steps = [
    { at: a - 0.8, el: <FeedH1 coverPress={m(a - 0.8, a + 1.7)} prevTab="today" tabSince={0} />, trans: "cut" as const },
    { at: a + 1.9, el: <DetailH2 pressAt={m(a + 1.9, a + 3.0)} /> },
    { at: a + 3.2, el: <JoinedH3 outs={[m(a + 3.2, sw1 + 0.2), m(a + 3.2, sw1 + 0.5), m(a + 3.2, sw2 + 0.2)]} /> },
    { at: a + 6.5, el: <EndedH5 title="Northbound Run Club" value="+4,444" caption="SKR, your share of 120,000" />, trans: "fade" as const },
  ];
  const taps = [{ at: a + 1.7, x: 195, y: 330 }, { at: a + 3.0, x: 195, y: 783 }];
  // ── the crowd ──
  const crowdIn = ease.out(clamp((t - (a + 0.6)) / 1.0)) * (1 - ease.in(clamp((t - (T.record - 0.5)) / 0.5)));
  const drift = (t - a) * 14;
  const outAt = (k: (typeof CROWD)[number]) => {
    if (k.keep) return Infinity;
    const wave = rnd(k.i * 1.7) < 0.55 ? sw1 : sw2;
    return wave + 0.05 + (k.c / COLS) * 0.35 + rnd(k.i) * 0.08;
  };
  const crowd = crowdIn > 0 ? (
    <div style={{ position: "absolute", left: 700, top: 540, width: 0, height: 0, transformStyle: "preserve-3d", opacity: crowdIn, transform: `translateZ(-600px) rotateX(48deg) rotateZ(-22deg) translate(${drift}px, ${-drift * 0.4}px)` }}>
      {CROWD.map((k) => {
        const o = clamp((t - outAt(k)) / 0.25);
        const win = k.keep && t > a + 6.5 ? ease.outBack(clamp((t - (a + 6.5 + rnd(k.i) * 0.3)) / 0.4)) : 0;
        const x = (k.c - COLS / 2) * (TILE + GAP), y = (k.r - ROWS / 2) * (TILE + GAP);
        return (
          <div key={k.i} style={{ position: "absolute", left: x, top: y, width: TILE, height: TILE, borderRadius: 26, overflow: "hidden", background: "#222", filter: o > 0 ? `grayscale(${o}) brightness(${1 - 0.6 * o})` : undefined, opacity: 1 - 0.55 * o, transform: `translateY(${o * 18}px) scale(${1 + 0.12 * win})`, boxShadow: win > 0 ? `0 0 0 ${4 * win}px #C5F25C, 0 0 30px rgba(197,242,92,${0.5 * win})` : k.you ? "0 0 0 4px #FFFFFF" : undefined }}>
            <Avatar config={k.cfg} size={TILE} />
            {o > 0 ? <svg width={TILE} height={TILE} style={{ position: "absolute", inset: 0 }}><path d={`M24 24 L${24 + 44 * o} ${24 + 44 * o} M68 24 L${68 - 44 * o} ${24 + 44 * o}`} stroke="#F87171" strokeWidth={7} strokeLinecap="round" /></svg> : null}
          </div>
        );
      })}
    </div>
  ) : null;
  // ── the Keeper mows: two flat swings across the crowd ──
  const perf = (tt: number) => {
    const b = body(tt, [[a + 3.4, 260, 1500], [a + 3.9, 380, 1140, ease.outBack], [sw2 + 0.2, 420, 1140], [a + 6.8, 300, 1180, ease.inOut, 50], [T.record, 260, 1500, ease.in]]);
    const swing = (s0: number, dir: 1 | -1) => [
      [s0 - 0.35, dir > 0 ? [10, 60, -60, "fist"] : [150, 60, 60, "fist"], ease.out], [s0, dir > 0 ? [170, 120, 80, "fist"] : [-10, 120, -80, "fist"], ease.out], [s0 + 0.3, dir > 0 ? [160, 130, 70, "fist"] : [0, 130, -70, "fist"]],
    ] as const;
    const R = handTrack(tt, [[a + 3.6, null], ...swing(sw1, 1), ...swing(sw2, -1), [sw2 + 0.7, null]] as never);
    const mt = moodTrack(tt, [[0, "stern"], [sw2 + 0.5, "smug"]]);
    const sp = talk(say("bounty"), tt, { eyes: mt.eyes, gx: 5, sx: b.sx, sy: b.sy });
    const lean = kf(tt, [[sw1 - 0.3, -6], [sw1, 12, ease.out], [sw2 - 0.3, 10], [sw2, -12, ease.out], [sw2 + 0.6, 0]]);
    return { x: b.x, y: b.y, size: 520, lean: b.lean + lean, skew: b.skew, draw: { mood: mt.mood, prop: "scythe" as const, attach: true, scytheFront: true, t: tt, wiggle: sp.wiggle, over: { ...sp.over, ...(R ? { right: R } : {}) } } };
  };
  return (
    <>
      {crowd}
      <Phone pose={pose} over={<Touches t={t} taps={taps} />}><Flow t={t} steps={steps} /></Phone>
      {t > a + 3.3 ? <Keeper depth={160} id="k-bounty" t={t} perf={perf} z={60} /> : null}
    </>
  );
}

