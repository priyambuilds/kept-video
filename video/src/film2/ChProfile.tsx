// 1:08.25 · 06 Your word, on record: I1 profile, the kept-rate ring sweeps to 91 % and lifts out of the phone;
// then the camera pulls back into a drifting isometric wall of real KEPT screens (Ref B, 9.5 s).
import React from "react";
import { clamp, ease, lerp } from "../lib/anim";
import { Phone } from "../phone/Phone";
import { Flow } from "../phone/Flow";
import { ClockRoot } from "../app/motion";
import { EndedH5 } from "../app/screens/bounty";
import { ProfileI1 } from "../app/screens/profile";
import { SCREENS } from "../app/screens/registry";
import { KeptRateRing } from "../app/kit/status";
import { Headline, poseAt } from "./stage";
import { Lift } from "./Lift";
import { T } from "./timeline";

const WALL = [
  ["I2", "H1", "C6", "W1", "F5"],
  ["N1", "B1", "I1", "L1", "H3"],
  ["R1", "D2", "C8", "W3", "K2"],
  ["A4", "H5", "D0", "F1", "B5"],
];

export function ChProfile({ t }: { t: number }) {
  if (t < T.profile || t >= T.cta + 0.7) return null;
  const m = (at: number, x: number) => (x - at) * 1000;
  const wallIn = ease.inOut(clamp((t - 72.2) / 1.1));
  const pose = poseAt(t, [
    [68.25, { x: 1240, y: 545, s: 1.0, ry: -12, rx: 2 }],
    [68.9, { x: 1270, y: 545, s: 1.0, ry: -8, rx: 2 }, ease.out],
    [69.3, { x: 1380, y: 560, s: 0.92, ry: -24, rx: 3 }, ease.inOut],
    [70.9, { x: 1380, y: 560, s: 0.92, ry: -24, rx: 3 }, ease.linear],
    [71.5, { x: 1250, y: 545, s: 1.0, ry: -8, rx: 2 }, ease.inOut],
    [72.2, { x: 1250, y: 545, s: 1.0, ry: -6 }, ease.linear],
  ]);
  const steps = [
    { at: 64.95, el: <EndedH5 /> },
    { at: 68.25, el: <ProfileI1 ringAt={300} prevTab="bounties" tabSince={0} />, trans: "fade" as const },
  ];
  const lift = { a0: 69.3, a1: 70.0, b0: 70.9, b1: 71.5 };
  const dim = t > lift.a0 && t < lift.b1 ? Math.min(1, (t - lift.a0) / 0.4) * (t > lift.b0 ? 1 - (t - lift.b0) / 0.6 : 1) : 0;
  // The wall: 5 × 4 phones on a plane tilted like a table (rotateX 52°, rotateZ −34°), drifting diagonally.
  const drift = (t - 72.2) * 38;
  const wall = wallIn > 0 ? (
    <div style={{ position: "absolute", left: 960, top: 540, width: 0, height: 0, transformStyle: "preserve-3d", opacity: clamp(wallIn * 1.4) * (1 - ease.in(clamp((t - 77.0) / 0.6))),
      transform: `scale(${lerp(1.5, 1, wallIn) * (1 + 0.6 * ease.in(clamp((t - 77.0) / 0.6)))}) rotateX(${52 * wallIn}deg) rotateZ(${-34 * wallIn}deg)` }}>
      {WALL.flatMap((row, r) => row.map((id, c) => {
        const S = SCREENS[id];
        const x = (c - 2) * 470 + drift * 0.6 - (r % 2) * 120, y = (r - 1.5) * 960 - drift;
        return <Phone key={id} pose={{ x, y, s: 1 }} shadow={false} glare={0.2}><ClockRoot ms={8000}><S /></ClockRoot></Phone>;
      }))}
    </div>
  ) : null;
  return (
    <>
      {wall}
      <Headline t={t} at={68.4} out={71.3} x={110} y={120} eyebrow="06 · YOUR WORD, ON RECORD" lines={["Your kept rate", "is public."]} keys={["public."]} size={80} w={900} />
      <Headline t={t} at={71.45} out={72.6} x={130} y={330} lines={["Make it worth", "reading."]} keys={["reading."]} size={92} sub="Friends check it before they bet with you. Bounties check it before they let you in." />
      {wallIn < 1 ? (
        <>
          <Phone pose={{ ...pose, s: pose.s * (1 - 0.45 * wallIn), opacity: 1 - wallIn }} over={<div style={{ position: "absolute", inset: 0, zIndex: 92, background: `rgba(0,0,0,${0.55 * dim})` }} />}>
            <Flow t={t} steps={steps} />
          </Phone>
        </>
      ) : null}
      <Lift t={t} pose={pose} rect={[20, 394, 350, 150]} to={{ x: 600, y: 600, s: 1.9, ry: 14, rx: 3, rz: -2 }} {...lift}>
        <div style={{ width: 350 }}><KeptRateRing percent={91} line="64 days · kept rate" /></div>
      </Lift>
    </>
  );
}
export const _m = (a: number) => a;

/** Over the wall (outside the 3D stage, so no phone can cut through it): vignette + the headline. */
export function WallOverlay({ t }: { t: number }) {
  if (t < 72.2 || t > 77.6) return null;
  const k = ease.inOut(clamp((t - 72.2) / 1.1)) * (1 - ease.in(clamp((t - 77.0) / 0.6)));
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(1000px 560px at 50% 50%, rgba(14,14,14,${0.88 * k}) 0%, rgba(14,14,14,${0.6 * k}) 55%, rgba(14,14,14,0) 100%)` }} />
      <Headline t={t} at={73.0} out={76.8} x={960} y={380} align="center" w={1400} lines={["One app.", "Every promise."]} keys={["promise."]} size={110} sub="Oaths · Proof · Payouts · Bounties · Rematches · Profiles" />
    </>
  );
}
