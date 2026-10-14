// Act 11 · Who's your Arjun? (v3 §2). The four friends as big tiles; Arjun shrugs. The Keeper leans in and
// whispers to camera. "Who's your Arjun?" — Arjun's tile flips into a blank lime "?" (yours to fill) and the invite
// slides up. Then the lockup, the tagline with his last line, the store card whose Get he presses (→ "Oct 16"),
// the plate, a long hold, the watching-you point and a wink.
import React from "react";
import { clamp, ease, kf } from "../lib/anim";
import { MONO, SANS } from "../lib/theme";
import { CheckK } from "../app/motion";
import { MEMBER } from "../app/theme";
import { Avatar } from "../app/kit/Avatar";
import { Phone } from "../phone/Phone";
import { Flow, Touches } from "../phone/Flow";
import { InviteC8 } from "../app/screens/oath";
import { Keeper } from "../keeper/Keeper";
import { handTrack, moodTrack, talk } from "../keeper/perf";
import { body } from "../keeper/actor";
import { poseAt } from "../film2/stage";
import { Caption, Statement } from "./common";
import type { Who } from "./common";
import { BAR, T, vo } from "./timeline";

const ORDER: Who[] = ["Y", "R", "A", "D"];
const NAMES: Record<Who, string> = { Y: "You", R: "Riya", A: "Arjun", D: "Dev" };

export function ActEnd({ t }: { t: number }) {
  const a = T.end;
  if (t < a) return null;
  const flip = a + 3.3, invite = a + 3.7, cta = a + 3 * BAR;
  const tilesOut = ease.in(clamp((t - (cta - 0.4)) / 0.45));
  const tiles = t < cta + 0.1 ? ORDER.map((w, i) => {
    const p = ease.outBack(clamp((t - (a + 0.15 + i * 0.12)) / 0.5));
    const x = 960 + (i - 1.5) * 300, y = 470 - (t > invite ? 170 * ease.inOut(clamp((t - invite) / 0.6)) : 0);
    const isA = w === "A";
    const shrug = isA && t > a + 0.9 && t < flip ? Math.sin((t - a - 0.9) * 9) * 7 : 0;
    const f = isA ? clamp((t - flip) / 0.35) : 0;
    const ry = f * 180, back = f > 0.5;
    const s = (isA ? 1 + 0.08 * Math.max(0, Math.sin((t - a - 0.9) * 3)) : 0.92) * (0.6 + 0.4 * p);
    return (
      <div key={w} style={{ position: "absolute", left: x - 110, top: y - 110, width: 220, opacity: clamp(p * 2) * (1 - tilesOut) * (isA || t < flip ? 1 : 0.55), transform: `scale(${s}) rotate(${shrug}deg)`, textAlign: "center", zIndex: 30 }}>
        <div style={{ width: 220, height: 220, borderRadius: 56, overflow: "hidden", transform: `perspective(800px) rotateY(${ry}deg)`, boxShadow: isA ? `0 0 0 5px ${back ? "#C5F25C" : "#F87171"}, 0 30px 60px rgba(0,0,0,0.5)` : "0 30px 60px rgba(0,0,0,0.5)", background: back ? "linear-gradient(180deg,#DAFF80,#B4E53F)" : MEMBER[w].color, display: "grid", placeItems: "center" }}>
          {back ? <div style={{ transform: "scaleX(-1)", fontFamily: SANS, fontWeight: 900, fontSize: 150, color: "#131313", lineHeight: 1 }}>?</div> : <Avatar config={MEMBER[w].avatar} size={220} />}
        </div>
        <div style={{ marginTop: 18, fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: -1, color: isA ? (back ? "#C5F25C" : "#F87171") : "#FFFFFF" }}>{isA && back ? "Your Arjun" : NAMES[w]}</div>
      </div>
    );
  }) : null;
  // The invite slides up under the tiles.
  const phone = poseAt(t, [[invite, { x: 960, y: 1500, s: 0.72, rx: -10 }], [invite + 0.6, { x: 960, y: 965, s: 0.72, rx: -6 }, ease.out], [cta - 0.4, { x: 960, y: 955, s: 0.72, rx: -6 }, ease.linear], [cta, { x: 960, y: 1700, s: 0.72, rx: -6 }, ease.in]]);
  // ── CTA (after the v2 end card, re-timed to K20) ──
  const K20 = vo("K20");
  const tag = K20.words.filter((w) => w.phrase === 1 || w.phrase === 2);
  const wordAt = (i: number) => tag[i]?.start ?? cta + 1 + i * 0.3;
  const A = (x: number, d = 0.45, e = ease.springHard) => e(clamp((t - x) / d));
  const lock = A(cta + 0.1, 0.6, ease.spring);
  const card = A(cta + 3.3, 0.6, ease.spring);
  const press = cta + 4.6, spin = t > press + 0.12 && t < press + 1.0, done = t >= press + 1.0;
  const plate = A(cta + 5.5, 0.5);
  const showCTA = t >= cta;
  // ── the Keeper ──
  const kx = 1640, ky = 1060;
  const perf = (tt: number) => {
    const b = body(tt, [[a + 0.2, 1700, 1500], [a + 0.7, kx, ky, ease.outBack], [invite, kx, ky], [cta + 0.2, 1415, 1030, ease.inOut, 60], [T.out, 1415, 1030]]);
    const mt = moodTrack(tt, [[0, "smug"], [a + 1.0, "side"], [flip, "smug"], [press + 0.3, "shades"], [cta + 6.8, "smug"], [T.out - 0.4, "wink"]]);
    const whisper = tt > a + 0.5 && tt < flip;
    const Lh = handTrack(tt, [[press - 0.55, null], [press - 0.08, [-34, 52, -90, "point"], ease.out], [press + 0.1, [-40, 55, -90, "point"], ease.in], [press + 0.4, [-32, 52, -90, "point"]], [press + 0.75, null]]);
    const Rh = handTrack(tt, [[T.out - 2.2, null], [T.out - 1.9, [112, 46, -20, "point"], ease.inOut], [T.out - 1.6, [112, 46, -20, "point"]], [T.out - 1.3, [134, 104, 10, "point"], ease.out]]);
    const sp = talk([vo("K19"), K20], tt, { eyes: mt.eyes, gx: whisper ? 2 : tt > cta + 3.2 && tt < press + 0.5 ? -6 : 0, gy: 0, sx: b.sx, sy: b.sy });
    return {
      x: b.x, y: b.y, size: tt < cta ? 380 : 360, lean: b.lean + (whisper ? -9 : kf(tt, [[press - 0.6, -6], [press - 0.1, -12], [press + 0.6, -5]])), skew: b.skew,
      draw: { mood: mt.mood, prop: whisper ? ("whisper" as const) : ("none" as const), t: tt + 2.2, wiggle: sp.wiggle, glint: (tt - (cta + 6.6)) / 0.35, over: { ...sp.over, ...(Lh ? { left: Lh } : {}), ...(Rh ? { right: Rh } : {}) } },
    };
  };
  return (
    <>
      {tiles}
      <Statement t={t} at={vo("K19").words.find((w) => w.w.startsWith("Who"))?.start ?? a + 1.2} out={invite - 0.25} x={960} y={720} lines={["Who's your Arjun?"]} keys={["Arjun?"]} size={110} align="center" w={1600} />
      {t > invite - 0.1 && t < cta + 0.1 ? (
        <Phone pose={phone} over={<Touches t={t} taps={[{ at: invite + 1.1, x: 266, y: 352 }]} />}>
          <Flow t={t} steps={[{ at: invite - 1.0, el: <InviteC8 joins={[0, 0, 0]} />, trans: "cut" as const }]} />
        </Phone>
      ) : null}
      <Caption t={t} at={invite + 0.6} out={cta - 0.5} x={960} y={530} text="Send them the invite." align="center" size={44} />
      {showCTA ? (
        <>
          <div style={{ position: "absolute", left: 960, top: 215, transform: `translate(-50%,-50%) scale(${0.8 + 0.2 * lock})`, opacity: clamp(lock * 2), display: "flex", alignItems: "center", gap: 30 }}>
            <div style={{ width: 128, height: 128, borderRadius: 34, background: "linear-gradient(180deg,#DAFF80,#B4E53F)", display: "grid", placeItems: "center", boxShadow: "inset 0 2px 0 rgba(255,255,255,0.6), inset 0 -7px 0 rgba(0,0,0,0.14), 0 30px 70px rgba(197,242,92,0.22)" }}>
              <CheckK size={104} variant="ink" draw={ease.draw(clamp((t - (cta + 0.15)) / 0.32))} stem={clamp((t - (cta + 0.4)) / 0.25)} leg={clamp((t - (cta + 0.55)) / 0.25)} />
            </div>
            <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 132, letterSpacing: -6, color: "#fff", lineHeight: 1 }}>KEPT</div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 84, letterSpacing: -3.6, lineHeight: 1.05 }}>
            {["Keep", "your", "word.", "Or", "pay", "your", "friends."].map((w, i) => {
              const p = ease.springHard(clamp((t - wordAt(i) + 0.04) / 0.3));
              return <span key={i} style={{ display: "inline-block", marginRight: 22, opacity: clamp(p * 2), transform: `translateY(${(1 - p) * 34}px)`, color: i >= 4 ? "#F87171" : "#fff" }}>{w}</span>;
            })}
          </div>
          <div style={{ position: "absolute", left: 960 - 470, top: 650, width: 760, height: 168, borderRadius: 40, background: "linear-gradient(180deg,#232323,#1A1A1A)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08), 0 40px 80px rgba(0,0,0,0.55)", display: "flex", alignItems: "center", gap: 28, padding: "0 30px", opacity: clamp(card * 2), transform: `translateY(${(1 - card) * 60}px) scale(${0.94 + 0.06 * card})` }}>
            <div style={{ width: 112, height: 112, borderRadius: 28, background: "linear-gradient(180deg,#DAFF80,#B4E53F)", display: "grid", placeItems: "center", flex: "none" }}><CheckK size={88} variant="ink" /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, color: "#fff", letterSpacing: -1.5 }}>KEPT</div>
              <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 25, color: "#9A9A9A", marginTop: 4 }}>Bet your friends you'll do it.</div>
            </div>
            <div style={{ height: 72, minWidth: 150, borderRadius: 36, background: done ? "#C5F25C" : "#FFFFFF", display: "grid", placeItems: "center", transform: `scale(${t > press && t < press + 0.25 ? 0.94 : 1})`, padding: "0 26px" }}>
              {spin ? (
                <svg width={40} height={40} viewBox="0 0 40 40" style={{ transform: `rotate(${(t - press) * 720}deg)` }}><circle cx={20} cy={20} r={15} fill="none" stroke="#DADADA" strokeWidth={5} /><path d="M20 5 A15 15 0 0 1 35 20" fill="none" stroke="#131313" strokeWidth={5} strokeLinecap="round" /></svg>
              ) : <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 32, color: "#131313", letterSpacing: -0.8 }}>{done ? "Oct 16" : "Get"}</span>}
            </div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 512, display: "flex", justifyContent: "center", opacity: clamp(plate * 2), transform: `translateY(${(1 - plate) * -30}px)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: SANS, fontWeight: 700, fontSize: 38, color: "#fff", letterSpacing: -0.8 }}>
              <span>Seeker dApp Store</span><span style={{ color: "#C5F25C" }}>·</span><span style={{ color: "#C5F25C" }}>October 16</span><span style={{ color: "#C5F25C" }}>·</span>
              <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 32, color: "#BDBDBD" }}>kept.app</span>
            </div>
          </div>
        </>
      ) : null}
      <Keeper depth={160} id="k-end" t={t} perf={perf} z={40} />
    </>
  );
}
