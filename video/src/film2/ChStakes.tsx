// 0:43.75 · 04 Miss a day. D2 Iron Week: midnight (drop 2, 0:45.5) — Arjun's day 2 turns ✕, the HP panel takes
// −20, and the Keeper's scythe swings through Arjun's row. His 143 SKR bursts out of the phone as coins that rain
// into You, Riya and Dev (+43 each; the 14 SKR fee lands in the Keeper's sack). Then the recap sheet, L1 payout, claim.
import React from "react";
import { Keeper } from "../keeper/Keeper";
import { handTrack, moodTrack, talk } from "../keeper/perf";
import { BEAT, clamp, ease, kf, lerp, prog, rnd, wobble } from "../lib/anim";
import { Phone } from "../phone/Phone";
import { Flow, Touches } from "../phone/Flow";
import { ActiveD2, ClaimedJ1ok, KeptL1 } from "../app/screens/stakes";
import { DayKeptF5 } from "../app/screens/proof";
import { RecapSheet, TodayB1 } from "../app/screens/today";
import { Coin } from "../app/kit/fx";
import { Headline, poseAt, screenToStage } from "./stage";
import { T, vo } from "./timeline";
import { Bubble } from "../ui/Caption";
import { MEMBER } from "../app/theme";
import { MONO, SANS } from "../lib/theme";

const ROW_Y = { Y: 438, R: 468, A: 498, D: 528 };
const TARGETS: ("Y" | "R" | "D")[] = ["Y", "R", "D"];

export function ChStakes({ t }: { t: number }) {
  if (t < T.stakes || t >= T.bounty) return null;
  const d2 = T.drop2, hit = d2 + 4 / 60;
  const m = (at: number, x: number) => (x - at) * 1000;
  const shake = wobble(t, hit, 9, 18, 9);
  const base = poseAt(t, [
    [43.75, { x: 1000, y: 560, s: 0.96, ry: 14, rx: 4, rz: 1 }],
    [44.6, { x: 960, y: 545, s: 1.06, ry: 6, rx: 1, rz: 0 }, ease.out],
    [45.4, { x: 960, y: 545, s: 1.08, ry: 4 }, ease.linear],
    [47.6, { x: 960, y: 540, s: 1.08, ry: 3 }, ease.linear],
    [48.2, { x: 1120, y: 545, s: 1.0, ry: -8, rx: 2 }, ease.inOut],
    [51.2, { x: 1140, y: 545, s: 1.0, ry: -6 }, ease.linear],
    [51.9, { x: 1250, y: 545, s: 1.02, ry: -10, rx: 2 }, ease.inOut],
    [56.0, { x: 1260, y: 545, s: 1.0, ry: -6 }, ease.linear],
  ]);
  const pose = { ...base, x: base.x + shake, y: base.y + shake * 0.5, rz: (base.rz ?? 0) + shake * 0.08 };
  const steps = [
    { at: 41.85, el: <DayKeptF5 /> },
    { at: 43.75, el: <ActiveD2 missAt={m(43.75, hit)} />, trans: "fade" as const },
    { at: 47.95, el: <TodayB1 still secs0={23 * 3600 + 58 * 60} sheet={<RecapSheet at={0} />} />, trans: "fade" as const },
    { at: 51.3, el: <KeptL1 pressAt={m(51.3, 53.55)} />, trans: "fade" as const },
    { at: 53.8, el: <ClaimedJ1ok />, trans: "fade" as const },
  ];
  const taps = [{ at: 53.55, x: 195, y: 783 }];
  // ── coins: 12 out of Arjun's row (3 × 4, one per 16th from the beat after the hit), + 1 fee coin to the sack ──
  const src = screenToStage(pose, 155, ROW_Y.A);
  const coins = Array.from({ length: 13 }, (_, j) => {
    const fee = j === 12;
    const to = fee ? null : TARGETS[j % 3];
    const t0 = hit + 0.02 + j * 0.018, land = d2 + BEAT + Math.floor(j / 2) * (BEAT / 4) + (fee ? 0.2 : 0);
    return { j, fee, to, t0, land };
  });
  const kx = 1560, ky = 1045, ksize = 400;
  const sack: [number, number] = [kx - 70, ky - 300];
  const coinEls = coins.map((c) => {
    if (t < c.t0 || t > c.land + 0.05) return null;
    const p = clamp((t - c.t0) / (c.land - c.t0));
    const dst: [number, number] = c.fee ? sack : screenToStage(pose, 70, ROW_Y[c.to!]);
    const peak: [number, number] = [lerp(src[0], dst[0], 0.5) + (rnd(c.j) - 0.5) * 520, Math.min(src[1], dst[1]) - 300 - rnd(c.j + 9) * 260];
    const e = ease.cubicOut(p), q = p;
    const x = (1 - q) * (1 - q) * src[0] + 2 * (1 - q) * q * peak[0] + q * q * dst[0];
    const y = (1 - q) * (1 - q) * src[1] + 2 * (1 - q) * q * peak[1] + q * q * dst[1];
    const s = 1 + 1.3 * Math.sin(p * Math.PI) ;
    return <div key={c.j} style={{ position: "absolute", left: x - 12, top: y - 12, transform: `scale(${s * 1.4}) rotate(${e * 720 * (rnd(c.j + 3) - 0.5)}deg)`, zIndex: 50 }}><Coin size={24} /></div>;
  });
  // "+43" pops left of the phone, one per keeper, when their last coin lands.
  const pills = TARGETS.map((k, i) => {
    const last = Math.max(...coins.filter((c) => c.to === k).map((c) => c.land));
    const p = ease.springHard(clamp((t - last) / 0.35));
    const out = clamp((t - 47.8) / 0.3);
    if (p <= 0 || out >= 1) return null;
    const y = screenToStage(pose, 70, ROW_Y.R)[1] + (i - 1) * 78;
    return (
      <div key={k} style={{ position: "absolute", left: pose.x - 215 * pose.s - 250, top: y - 30, transform: `scale(${0.6 + 0.4 * p}) rotate(${(i - 1) * 3}deg)`, opacity: clamp(p * 2) * (1 - out), zIndex: 45, display: "flex", alignItems: "center", gap: 12, height: 60, padding: "0 22px 0 10px", borderRadius: 30, background: "linear-gradient(180deg,#DAFF80,#B0E03C)", boxShadow: "inset 0 2px 0 rgba(255,255,255,0.6), 0 14px 30px rgba(197,242,92,0.25)" }}>
        <div style={{ width: 42, height: 42, borderRadius: 13, background: MEMBER[k].color, display: "grid", placeItems: "center", fontFamily: SANS, fontWeight: 800, fontSize: 20, color: "#131313" }}>{MEMBER[k].initial}</div>
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#1A2600", letterSpacing: -1 }}>+43 SKR</span>
      </div>
    );
  });
  const fee = (() => {
    const c = coins[12];
    const p = ease.springHard(clamp((t - c.land) / 0.35)), out = clamp((t - 47.8) / 0.3);
    if (p <= 0 || out >= 1) return null;
    return <div style={{ position: "absolute", left: sack[0] - 210, top: sack[1] - 80, fontFamily: MONO, fontWeight: 600, fontSize: 22, letterSpacing: 2, color: "#BDBDBD", opacity: p * (1 - out), zIndex: 45 }}>FEE · 14 SKR</div>;
  })();
  // ── the Keeper: scythe ready (stern), wind-up, the strike through Arjun's row, giddy shimmy, exit ──
  const perf = (tt: number) => {
    const swingR = handTrack(tt, [
      [d2 - 0.55, [118, 122, 0, "fist"]], [d2 - 0.04, [150, 34, -75, "fist"], ease.out],
      [hit, [26, 150, 95, "fist"], ease.out], [d2 + 0.2, [16, 160, 112, "fist"], ease.out], [d2 + 0.6, [48, 140, 70, "fist"], ease.inOut],
      [47.6, [80, 150, 40, "fist"]], [47.9, null],
    ]);
    const mt = moodTrack(tt, [[0, "stern"], [d2 + 0.7, "smug"], [49.5, "happy"]]);
    const lean = kf(tt, [[d2 - 0.55, 0], [d2 - 0.04, 7], [hit, -12, ease.out], [d2 + 0.6, -3, ease.inOut], [48.0, -4]]);
    const sh = tt > 49.6 && tt < 51.0 ? Math.sin(((tt - 49.6) / (BEAT / 2)) * Math.PI) * clamp((51.0 - tt) * 3) : 0;
    const squash = tt > hit ? 1 - 0.06 * Math.sin(clamp((tt - hit) / 0.15) * Math.PI) : 1;
    const Lh = handTrack(tt, [[49.6, null], [49.8, [44, 112, -30, "open"], ease.out], [50.9, [44, 112, -30, "open"]], [51.1, null]]);
    const sp = talk([vo("V08"), vo("V09"), vo("V10")], tt, { eyes: mt.eyes, gx: tt < 47.9 ? -5 : -2, tilt: 5 * sh, sy: squash, sx: 2 - squash });
    const rise = ease.outBack(clamp((tt - 43.85) / 0.6));
    const exit = ease.in(clamp((tt - 51.15) / 0.45));
    return {
      x: kx + 8 * sh, y: ky + (1 - rise) * 560 + exit * 620, size: ksize, lean,
      draw: { mood: mt.mood, prop: (tt < 47.9 ? "scythe" : "sack") as "scythe" | "sack", attach: tt < 47.9, scytheFront: true, t: tt + 4.1, wiggle: sp.wiggle, over: { ...sp.over, ...(swingR ? { right: swingR } : {}), ...(Lh ? { left: Lh } : {}) } },
      opacity: tt > 51.7 ? 0 : 1,
    };
  };
  // The swing's arc smear (lime → white crescent) for a few frames after the hit.
  const smear = t >= d2 && t < d2 + 0.14 ? 1 - prog(t, d2 + 4 / 60, 0.07) : 0;
  const k = ksize / 160, grip = { x: kx + (60 - 80) * k, y: ky - (178 - 100) * k };
  return (
    <>
      <Headline t={t} at={43.95} out={45.35} x={110} y={360} eyebrow="04 · MISS A DAY" lines={["Miss a day?"]} red={["Miss"]} size={96} w={640} />
      <Headline t={t} at={45.55} out={47.75} x={110} y={150} lines={["Your friends", "split your stake."]} keys={["split"]} size={74} w={760} />
      <Headline t={t} at={48.05} out={51.1} x={110} y={330} lines={["Every miss pays", "the ones who kept."]} keys={["kept."]} size={74} w={900} sub="−20 HP for the group. The miss costs 143 SKR, split between everyone who kept. KEPT takes 10%." />
      <Headline t={t} at={51.5} out={55.8} x={130} y={340} lines={["Keep every day.", "Collect."]} keys={["Collect."]} size={92} sub="When the Oath ends, claim straight to your wallet." />
      <Phone pose={pose} over={<Touches t={t} taps={taps} />}><Flow t={t} steps={steps} /></Phone>
      {pills}{fee}{coinEls}
      <Keeper id="k-stakes" t={t} perf={perf} z={40} />
      {smear > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, zIndex: 41 }}>
          <defs><linearGradient id="arc2" x1="1" x2="0"><stop offset="0" stopColor="#C5F25C" stopOpacity={0} /><stop offset="1" stopColor="#FFFFFF" /></linearGradient></defs>
          {(() => {
            const a = kf(t, [[d2, -60], [d2 + 4 / 60, -200, ease.out], [d2 + 0.14, -230]]);
            const r1 = 150 * k * 0.5, r2 = 520, from = a, to = Math.min(-20, a + 140);
            const p = (r: number, ang: number) => `${grip.x + r * Math.cos((ang * Math.PI) / 180)} ${grip.y - 160 + r * Math.sin((ang * Math.PI) / 180)}`;
            return <path d={`M${p(r2, from)} A${r2} ${r2} 0 0 1 ${p(r2, to)} L${p(r1, to)} A${r1} ${r1} 0 0 0 ${p(r1, from)} Z`} fill="url(#arc2)" opacity={smear * 0.85} />;
          })()}
        </svg>
      ) : null}
      <Bubble t={t} line={vo("V10")} x={kx + 170} y={ky - ksize * 1.12} side="left" fs={36} maxW={390} />
    </>
  );
}
