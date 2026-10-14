// 1:17 CTA: the KEPT lockup, the tagline landing word by word with V14, a dApp-Store card whose "Get" the Keeper
// presses (Ref B, 37.5 s) — it spins and turns into "Oct 16" — then the plate holds still while he watches you. Wink.
import React from "react";
import { Keeper } from "../keeper/Keeper";
import { handTrack, moodTrack, talk } from "../keeper/perf";
import { clamp, ease, kf } from "../lib/anim";
import { MONO, SANS } from "../lib/theme";
import { CheckK } from "../app/motion";
import { T, vo } from "./timeline";

const TAG = ["Keep", "your", "word.", "Or", "pay", "your", "friends."];

export function ChCTA({ t }: { t: number }) {
  if (t < T.cta) return null;
  const a = (x: number, d = 0.45, e = ease.springHard) => e(clamp((t - x) / d));
  const lock = a(77.4, 0.6, ease.spring);
  const L14 = vo("V14");
  const wordAt = (i: number) => L14.words[i]?.start ?? 78.2 + i * 0.3;
  const card = a(80.7, 0.6, ease.spring);
  const press = 82.15;
  const spin = t > press + 0.12 && t < press + 1.0;
  const done = t >= press + 1.0;
  const plate = a(83.4, 0.5);
  // Keeper beside the card: watches the tagline, reaches out and presses Get, then points at you; wink at the end.
  const kx = 1415, ky = 1030, size = 360;
  const perf = (tt: number) => {
    const mt = moodTrack(tt, [[0, "smug"], [press + 0.3, "shades"], [84.6, "smug"], [T.end - 0.35, "wink"]]);
    const Lh = handTrack(tt, [
      [press - 0.55, null], [press - 0.08, [-34, 52, -90, "point"], ease.out], [press + 0.1, [-40, 55, -90, "point"], ease.in], [press + 0.4, [-32, 52, -90, "point"]], [press + 0.75, null],
    ]);
    const Rh = handTrack(tt, [[85.3, null], [85.6, [112, 46, -20, "point"], ease.inOut], [85.85, [112, 46, -20, "point"]], [86.15, [134, 104, 10, "point"], ease.out]]);
    const sp = talk([L14, vo("V15")], tt, { eyes: mt.eyes, gx: tt > 85.6 ? 0 : tt < 80.6 ? -6 : -4, gy: tt < 80.6 ? -3 : 2 });
    const rise = ease.outBack(clamp((tt - 77.6) / 0.6));
    return { x: kx, y: ky + (1 - rise) * 600, size, lean: kf(tt, [[77, -6], [press - 0.1, -12], [press + 0.6, -5]]), draw: { mood: mt.mood, t: tt + 2.2, wiggle: sp.wiggle, glint: (tt - 84.2) / 0.35, over: { ...sp.over, ...(Lh ? { left: Lh } : {}), ...(Rh ? { right: Rh } : {}) } } };
  };
  return (
    <>
      {/* lockup */}
      <div style={{ position: "absolute", left: 960, top: 215, transform: `translate(-50%,-50%) scale(${0.8 + 0.2 * lock})`, opacity: clamp(lock * 2), display: "flex", alignItems: "center", gap: 30 }}>
        <div style={{ width: 128, height: 128, borderRadius: 34, background: "linear-gradient(180deg,#DAFF80,#B4E53F)", display: "grid", placeItems: "center", boxShadow: "inset 0 2px 0 rgba(255,255,255,0.6), inset 0 -7px 0 rgba(0,0,0,0.14), 0 30px 70px rgba(197,242,92,0.22)" }}>
          <CheckK size={104} variant="ink" draw={ease.draw(clamp((t - 77.55) / 0.32))} stem={clamp((t - 77.8) / 0.25)} leg={clamp((t - 77.95) / 0.25)} />
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
    </>
  );
}
