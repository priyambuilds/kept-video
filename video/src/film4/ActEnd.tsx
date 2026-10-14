// v4 · Your record + the wall + the end card (docs/LAUNCH_FILM_V4.md §2; v2's chapters, text-free until the end card).
// Profile: the kept-rate ring sweeps to 91 % and lifts out of the phone while the Keeper reads your record from his
// ledger → the camera pulls back into a drifting wall of real KEPT screens → the lockup, the tagline landing word
// by word on his line, the store card whose Get he presses (→ "Oct 16"), the plate, the point, the wink.
import React from "react";
import { clamp, ease, kf, lerp } from "../lib/anim";
import { MONO, SANS } from "../lib/theme";
import { Phone } from "../phone/Phone";
import { Flow } from "../phone/Flow";
import { ClockRoot, CheckK } from "../app/motion";
import { ProfileI1 } from "../app/screens/profile";
import { SCREENS } from "../app/screens/registry";
import { KeptRateRing } from "../app/kit/status";
import { Keeper } from "../keeper/Keeper";
import { handTrack, moodTrack, talk } from "../keeper/perf";
import { body } from "../keeper/actor";
import { poseAt } from "../film2/stage";
import { Lift } from "../film2/Lift";
import { T } from "./timeline";
import { useScript } from "./script";

const WALL = [
  ["I2", "H1", "C6", "W1", "F5"],
  ["N1", "B1", "I1", "L1", "H3"],
  ["R1", "D2", "C8", "W3", "K2"],
  ["A4", "H5", "D0", "F1", "B5"],
];

export function ActRecord({ t }: { t: number }) {
  const { say } = useScript();
  const a = T.record;
  if (t < a || t >= T.cta + 0.7) return null;
  const m = (at: number, x: number) => (x - at) * 1000;
  const wallIn = ease.inOut(clamp((t - (T.wall - 0.2)) / 1.1));
  const pose = poseAt(t, [
    [a, { x: 1230, y: 545, s: 1.06, ry: -5, rx: 0 }],
    [a + 0.6, { x: 1120, y: 545, s: 1.02, ry: -8, rx: 2 }, ease.out],
    [a + 1.05, { x: 1250, y: 560, s: 0.92, ry: -24, rx: 3 }, ease.inOut],
    [a + 2.6, { x: 1250, y: 560, s: 0.92, ry: -24, rx: 3 }, ease.linear],
    [a + 3.2, { x: 1000, y: 545, s: 1.0, ry: -8, rx: 2 }, ease.inOut],
    [T.wall, { x: 980, y: 545, s: 1.0, ry: -6 }, ease.linear],
  ]);
  const steps = [
    { at: a - 0.8, el: <ProfileI1 ringAt={1100} prevTab="bounties" tabSince={0} />, trans: "fade" as const },
  ];
  const lift = { a0: a + 1.05, a1: a + 1.75, b0: a + 2.6, b1: a + 3.2 };
  const dim = t > lift.a0 && t < lift.b1 ? Math.min(1, (t - lift.a0) / 0.4) * (t > lift.b0 ? 1 - (t - lift.b0) / 0.6 : 1) : 0;
  // The wall: 5 × 4 phones on a plane tilted like a table (rotateX 52°, rotateZ −34°), drifting diagonally.
  const drift = (t - (T.wall - 0.2)) * 38;
  const wall = wallIn > 0 ? (
    <div style={{ position: "absolute", left: 960, top: 540, width: 0, height: 0, transformStyle: "preserve-3d", opacity: clamp(wallIn * 1.4) * (1 - ease.in(clamp((t - T.cta) / 0.6))),
      transform: `scale(${lerp(1.5, 1, wallIn) * (1 + 0.6 * ease.in(clamp((t - T.cta) / 0.6)))}) rotateX(${52 * wallIn}deg) rotateZ(${-34 * wallIn}deg)` }}>
      {WALL.flatMap((row, r) => row.map((id, c) => {
        const S = SCREENS[id];
        const x = (c - 2) * 470 + drift * 0.6 - (r % 2) * 120, y = (r - 1.5) * 960 - drift;
        return <Phone key={id} pose={{ x, y, s: 1 }} shadow={false} glare={0.2}><ClockRoot ms={8000}><S /></ClockRoot></Phone>;
      }))}
    </div>
  ) : null;
  // The Keeper reads your record from his ledger, glances at the lifted ring, and hops out as the wall arrives.
  const perf = (tt: number) => {
    const b = body(tt, [[a, 1700, 1600], [a + 0.5, 1640, 1080, ease.outBack], [T.wall - 0.4, 1640, 1080], [T.wall + 0.3, 1760, 1640, ease.in, 40]]);
    const mt = moodTrack(tt, [[0, "side"], [a + 2.2, "smug"]]);
    const sp = talk(say("record"), tt, { eyes: mt.eyes, gx: tt > a + 1.2 && tt < a + 2.6 ? -6 : -2, gy: tt < a + 1.2 ? 3 : 0, sx: b.sx, sy: b.sy });
    return { x: b.x, y: b.y, size: 380, lean: b.lean - 4, skew: b.skew, draw: { mood: mt.mood, prop: "ledger" as const, t: tt, wiggle: sp.wiggle, over: sp.over } };
  };
  return (
    <>
      {wall}
      {t < T.wall + 0.3 ? <Keeper depth={160} id="k-record" t={t} perf={perf} z={40} /> : null}
      {wallIn < 1 ? (
        <>
          <Phone pose={{ ...pose, s: pose.s * (1 - 0.45 * wallIn), opacity: 1 - wallIn }} over={<div style={{ position: "absolute", inset: 0, zIndex: 92, background: `rgba(0,0,0,${0.55 * dim})` }} />}>
            <Flow t={t} steps={steps} />
          </Phone>
        </>
      ) : null}
      <Lift t={t} pose={pose} rect={[20, 394, 350, 150]} to={{ x: 560, y: 560, s: 1.9, ry: 14, rx: 3, rz: -2 }} {...lift}>
        <div style={{ width: 350 }}><KeptRateRing percent={91} line="64 days · kept rate" /></div>
      </Lift>
    </>
  );
}

const TAG = ["Keep", "your", "word.", "Or", "pay", "your", "friends."];

export function ActCTA({ t }: { t: number }) {
  const { say } = useScript();
  const c0 = T.cta;
  if (t < c0) return null;
  const a = (x: number, d = 0.45, e = ease.springHard) => e(clamp((t - x) / d));
  const lock = a(c0 + 0.35, 0.6, ease.spring);
  const L14 = say("tagline")[0];
  const wordAt = (i: number) => L14.words[i]?.start ?? c0 + 1 + i * 0.3;
  const card = a(c0 + 3.9, 0.6, ease.spring);
  const press = c0 + 4.85;
  const spin = t > press + 0.12 && t < press + 1.0;
  const done = t >= press + 1.0;
  const plate = a(c0 + 7.1, 0.5);
  // Keeper beside the card: watches the tagline, reaches out and presses Get, then points at you; wink at the end.
  const kx = 1415, ky = 1030, size = 360;
  const perf = (tt: number) => {
    const mt = moodTrack(tt, [[0, "smug"], [press + 0.3, "shades"], [c0 + 8.3, "smug"], [T.out - 0.9, "wink"]]);
    const Lh = handTrack(tt, [
      [press - 0.55, null], [press - 0.08, [-34, 52, -90, "point"], ease.out], [press + 0.1, [-40, 55, -90, "point"], ease.in], [press + 0.4, [-32, 52, -90, "point"]], [press + 0.75, null],
    ]);
    const Rh = handTrack(tt, [[c0 + 9.3, null], [c0 + 9.6, [112, 46, -20, "point"], ease.inOut], [c0 + 9.85, [112, 46, -20, "point"]], [c0 + 10.15, [134, 104, 10, "point"], ease.out]]);
    const sp = talk(say("cta"), tt, { eyes: mt.eyes, gx: tt > c0 + 9.6 ? 0 : tt < c0 + 3.8 ? -6 : -4, gy: tt < c0 + 3.8 ? -3 : 2 });
    const rise = ease.outBack(clamp((tt - (c0 + 0.55)) / 0.6));
    return { x: kx, y: ky + (1 - rise) * 600, size, lean: kf(tt, [[c0, -6], [press - 0.1, -12], [press + 0.6, -5]]), draw: { mood: mt.mood, t: tt + 2.2, wiggle: sp.wiggle, glint: (tt - (c0 + 8.8)) / 0.35, over: { ...sp.over, ...(Lh ? { left: Lh } : {}), ...(Rh ? { right: Rh } : {}) } } };
  };
  return (
    <div style={{ position: "absolute", inset: 0, transform: "translateY(64px)" }}>
      {/* lockup */}
      <div style={{ position: "absolute", left: 960, top: 215, transform: `translate(-50%,-50%) scale(${0.8 + 0.2 * lock})`, opacity: clamp(lock * 2), display: "flex", alignItems: "center", gap: 30 }}>
        <div style={{ width: 128, height: 128, borderRadius: 34, background: "linear-gradient(180deg,#DAFF80,#B4E53F)", display: "grid", placeItems: "center", boxShadow: "inset 0 2px 0 rgba(255,255,255,0.6), inset 0 -7px 0 rgba(0,0,0,0.14), 0 30px 70px rgba(197,242,92,0.22)" }}>
          <CheckK size={104} variant="ink" draw={ease.draw(clamp((t - (c0 + 0.5)) / 0.32))} stem={clamp((t - (c0 + 0.75)) / 0.25)} leg={clamp((t - (c0 + 0.9)) / 0.25)} />
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 132, letterSpacing: -6, color: "#fff", lineHeight: 1 }}>KEPT</div>
      </div>
      {/* tagline */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 84, letterSpacing: -3.6, lineHeight: 1.05 }}>
        {TAG.map((w, i) => {
          const p = ease.springHard(clamp((t - wordAt(i) + 0.04) / 0.3));
          return <span key={i} style={{ display: "inline-block", marginRight: 22, opacity: clamp(p * 2), transform: `translateY(${(1 - p) * 34}px)`, color: i >= 4 ? "#F87171" : "#fff" }}>{w}</span>;
        })}
      </div>
      {/* the store card */}
      <div style={{ position: "absolute", left: 960 - 470, top: 650, width: 760, height: 168, borderRadius: 40, background: "linear-gradient(180deg,#232323,#1A1A1A)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08), 0 40px 80px rgba(0,0,0,0.55)", display: "flex", alignItems: "center", gap: 28, padding: "0 30px", opacity: clamp(card * 2), transform: `translateY(${(1 - card) * 60}px) scale(${0.94 + 0.06 * card})` }}>
        <div style={{ width: 112, height: 112, borderRadius: 28, background: "linear-gradient(180deg,#DAFF80,#B4E53F)", display: "grid", placeItems: "center", flex: "none" }}><CheckK size={88} variant="ink" /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, color: "#fff", letterSpacing: -1.5 }}>KEPT</div>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 25, color: "#9A9A9A", marginTop: 4 }}>Bet on your habits. Friends collect.</div>
        </div>
        <div style={{ height: 72, minWidth: 150, borderRadius: 36, background: done ? "#C5F25C" : "#FFFFFF", display: "grid", placeItems: "center", transform: `scale(${t > press && t < press + 0.25 ? 0.94 : 1})`, boxShadow: done ? "0 10px 30px rgba(197,242,92,0.3)" : "0 10px 24px rgba(0,0,0,0.3)", padding: "0 26px" }}>
          {spin ? (
            <svg width={40} height={40} viewBox="0 0 40 40" style={{ transform: `rotate(${(t - press) * 720}deg)` }}><circle cx={20} cy={20} r={15} fill="none" stroke="#DADADA" strokeWidth={5} /><path d="M20 5 A15 15 0 0 1 35 20" fill="none" stroke="#131313" strokeWidth={5} strokeLinecap="round" /></svg>
          ) : <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 32, color: "#131313", letterSpacing: -0.8 }}>{done ? "Oct 16" : "Get"}</span>}
        </div>
      </div>
      {/* plate */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 512, display: "flex", justifyContent: "center", opacity: clamp(plate * 2), transform: `translateY(${(1 - plate) * -30}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: SANS, fontWeight: 700, fontSize: 38, color: "#fff", letterSpacing: -0.8 }}>
          <span>Seeker dApp Store</span><span style={{ color: "#C5F25C" }}>·</span><span style={{ color: "#C5F25C" }}>October 16</span><span style={{ color: "#C5F25C" }}>·</span>
          <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 32, color: "#BDBDBD" }}>kept.app</span>
        </div>
      </div>
      <Keeper id="k-cta" t={t} perf={perf} z={40} />
    </div>
  );
}
