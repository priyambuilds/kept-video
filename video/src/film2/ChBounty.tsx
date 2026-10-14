// 0:56 · 05 Bounties: the feed (the hero cards fan out of the phone into 3D and fly back) → Northbound Run Club
// detail → Join free → "You're in" while people drop out → a finished Bounty: "27 survived. +296".
import React from "react";
import { clamp, ease, lerp } from "../lib/anim";
import { Phone } from "../phone/Phone";
import { Flow, Touches } from "../phone/Flow";
import { ClaimedJ1ok } from "../app/screens/stakes";
import { BIGGEST, CLOSING, DetailH2, EndedH5, FeedH1, JoinedH3 } from "../app/screens/bounty";
import { HeroCard } from "../app/kit/social";
import { ClockRoot } from "../app/motion";
import { Headline, poseAt, screenToStage } from "./stage";
import { T } from "./timeline";

const FAN: [number, number, number, number, number][] = [ // x, y, rotY, rotZ, z
  [420, 250, 22, -6, 60], [300, 560, 16, 4, 140], [450, 860, 24, -3, 20],
  [1500, 240, -22, 5, 80], [1630, 540, -16, -4, 160], [1480, 850, -24, 3, 30],
];

export function ChBounty({ t }: { t: number }) {
  if (t < T.bounty || t >= T.profile) return null;
  const m = (at: number, x: number) => (x - at) * 1000;
  const pose = poseAt(t, [
    [56.0, { x: 1260, y: 545, s: 1.0, ry: -14, rx: 3 }],
    [56.9, { x: 1250, y: 545, s: 1.0, ry: -8, rx: 2 }, ease.out],
    [57.4, { x: 960, y: 545, s: 0.92, ry: 0, rx: 0 }, ease.inOut],
    [59.2, { x: 960, y: 545, s: 0.92 }, ease.linear],
    [59.75, { x: 1250, y: 545, s: 1.0, ry: -8, rx: 2 }, ease.inOut],
    [64.8, { x: 1250, y: 545, s: 1.02, ry: -5 }, ease.linear],
    [65.4, { x: 1230, y: 545, s: 1.0, ry: -10, rx: 2 }, ease.inOut],
    [68.25, { x: 1240, y: 545, s: 1.0, ry: -6 }, ease.linear],
  ]);
  const steps = [
    { at: 53.8, el: <ClaimedJ1ok /> },
    { at: 56.0, el: <FeedH1 hs1={[m(56, 56.6), m(56, 57.3), 140]} coverPress={m(56, 59.55)} />, trans: "fade" as const },
    { at: 59.75, el: <DetailH2 pressAt={m(59.75, 61.55)} /> },
    { at: 61.75, el: <JoinedH3 outs={[m(61.75, 62.7), m(61.75, 63.35), m(61.75, 64.0)]} /> },
    { at: 64.95, el: <EndedH5 />, trans: "fade" as const },
  ];
  const taps = [{ at: 59.55, x: 195, y: 362 }, { at: 61.55, x: 195, y: 783 }];
  // Fan-out: six hero cards leave the scroller rows, hang around the phone in 3D, then dive back in.
  const cards = [...CLOSING.slice(0, 3), ...BIGGEST.slice(0, 3)];
  const fan = cards.map((c, i) => {
    const a0 = 57.35 + i * 0.06, a1 = a0 + 0.7, b0 = 58.95 + (5 - i) * 0.04, b1 = b0 + 0.45;
    if (t < a0 || t > b1) return null;
    const k = ease.out(clamp((t - a0) / (a1 - a0))) * (1 - ease.in(clamp((t - b0) / (b1 - b0))));
    const [sx, sy] = screenToStage(pose, 20 + 84 + (i % 3) * 178, i < 3 ? 554 : 750);
    const [fx, fy, ry, rz, z] = FAN[i];
    const bob = 10 * Math.sin((t - a0) * 2.2 + i);
    const x = lerp(sx, fx, k), y = lerp(sy, fy, k) + bob * k, s = lerp(pose.s, 1.55, k);
    return (
      <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 168, height: 148, zoom: s, transform: `translate3d(${(x - 84 * s) / s}px, ${(y - 74 * s) / s}px, ${(z * k) / s}px) rotateY(${ry * k}deg) rotateZ(${rz * k}deg)`, zIndex: 30, opacity: clamp(k * 3) }}>
        <ClockRoot ms={9000}><HeroCard c={c} /></ClockRoot>
      </div>
    );
  });
  return (
    <>
      <Headline t={t} at={56.2} out={57.25} x={130} y={330} eyebrow="05 · BOUNTIES" lines={["Bounties."]} keys={["Bounties."]} size={96} />
      <Headline t={t} at={59.85} out={61.55} x={130} y={330} lines={["Free to join.", "Miss once, you're out."]} red={["out."]} size={80} w={900} sub="Creators fund the pool. Verified Seekers with a good kept rate get in free." />
      <Headline t={t} at={61.8} out={64.8} x={130} y={330} lines={["Last ones standing", "split the pool."]} keys={["split"]} size={80} w={900} />
      <Headline t={t} at={65.1} out={68.1} x={130} y={330} lines={["Survive.", "Get paid."]} keys={["paid."]} size={92} sub="+296 SKR from a pool you never paid into." />
      <Phone pose={pose} over={<Touches t={t} taps={taps} />}><Flow t={t} steps={steps} /></Phone>
      {fan}
    </>
  );
}
