// S8 CTA. Cream (the ledger page became the background). KEPT lockup, the Keeper leaning on it, smug.
// The tagline lands word by word with L10 (it *is* the caption); on the final hit the CTA plate drops and
// then nothing moves for ≥ 3 s except his breathing, a blink, one visor glint and, at the very end, the
// silent "I'm watching you" and a wink (L12 cut, SHOTLIST D2).
import React from "react";
import { AbsoluteFill } from "remotion";
import { Keeper } from "../keeper/Keeper";
import { handTrack, moodTrack, pointAt, talk } from "../keeper/perf";
import { clamp, ease, kf, prog } from "../lib/anim";
import { MONO, SANS, color, film } from "../lib/theme";
import { Bubble } from "../ui/Caption";
import { Cream, Grain } from "../ui/Backgrounds";
import { BrandTile, Icon, Wordmark } from "../ui/kit";
import { line } from "../data/cuts";
import { pick } from "./common";
import type { SceneProps } from "./common";

const TAGLINE = ["Keep", "your", "word.", "Or", "pay", "your", "friends."];
const RED = new Set([4, 5, 6]);

export function S8CTA({ t, frame, cut, fmt }: SceneProps) {
  const b = cut.b;
  const L = pick(fmt, {
    h: { lock: { x: 760, y: 330, tile: 170, word: 150 }, tag: { y: 600, fs: 76 }, plate: { y: 800, fs: 40 }, k: { x: 1360, y: 560, size: 300, lean: -9 }, bub: "right" as const },
    v: { lock: { x: 540, y: 520, tile: 200, word: 170 }, tag: { y: 760, fs: 84 }, plate: { y: 1130, fs: 44 }, k: { x: 560, y: 1780, size: 520, lean: 0 }, bub: "right" as const },
    s: { lock: { x: 400, y: 250, tile: 140, word: 124 }, tag: { y: 470, fs: 58 }, plate: { y: 640, fs: 34 }, k: { x: 820, y: 400, size: 250, lean: -8 }, bub: "left" as const },
  });
  const size = L.k.size, k = size / 160;
  const in0 = b.ledger;
  const L10 = line(cut, "L10"), L11 = line(cut, "L11");
  const lines = cut.vo.filter((l) => l.id === "L10" || l.id === "L11");
  const plateP = prog(t, b.plate, 0.35, ease.springHard);
  const lockP = prog(t, in0, 0.4, ease.spring);
  // Tagline words: timed to L10 when it's voiced (28 s); in the 15 s cut it's text that lands with the plate.
  const wordAt = (i: number) => (L10 ? L10.words[i]?.start ?? L10.start + i * 0.3 : b.plate - 0.5 + i * 0.07);
  const winkAt = cut.dur - 0.16;
  const perf = (tt: number) => {
    const mt = moodTrack(tt, [[0, "smug"], [winkAt, "wink"]]);
    // Leaning on the lockup with the left glove; point at the plate on L11; "watching you" at the end.
    const Lh = handTrack(tt, [[in0, [16, 92, -40, "fist"]]]);
    const visorPt = pointAt(102, 40, -30), you = [128, 104, 0, "point"] as [number, number, number, "point"];
    const Rh = handTrack(tt, [
      [b.plate + 0.3, null], [b.plate + 0.6, pointAt(170, 150, 120), ease.out], [b.watch - 0.05, pointAt(170, 150, 120)],
      [b.watch + 0.18, visorPt, ease.inOut], [b.watch + 0.3, visorPt], [b.watch + 0.45, you, ease.out],
    ]);
    const sp = talk(lines, tt, { eyes: mt.eyes, gx: tt > b.watch ? 0 : tt > b.plate + 0.3 && tt < b.watch ? 3 : -2, gy: tt > b.plate + 0.3 && tt < b.watch ? 2 : 0 });
    const rise = prog(tt, in0, 0.45, ease.outBack);
    return {
      x: L.k.x, y: L.k.y + (1 - rise) * 240, size, lean: L.k.lean,
      draw: { mood: mt.mood, t: tt + 5.2, wiggle: sp.wiggle, glint: (tt - b.glint) / 0.3, over: { ...sp.over, ...(Lh ? { left: Lh } : {}), ...(Rh ? { right: { ...Rh, scale: tt > b.watch + 0.3 ? 1 + 0.25 * prog(tt, b.watch + 0.3, 0.15, ease.out) : 1 } } : {}) } },
    };
  };
  return (
    <AbsoluteFill>
      <Cream />
      <Grain frame={frame} opacity={0.07} />
      <div style={{ position: "absolute", left: L.lock.x, top: L.lock.y, transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * lockP})`, opacity: clamp(lockP * 2), display: "flex", alignItems: "center", gap: L.lock.tile * 0.18 }}>
        <BrandTile size={L.lock.tile} />
        <Wordmark size={L.lock.word} colour={film.ink} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: L.tag.y, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: L.tag.fs, letterSpacing: -0.035 * L.tag.fs, color: film.ink, padding: "0 70px", lineHeight: 1.1 }}>
        {TAGLINE.map((w, i) => {
          const p = prog(t, wordAt(i) - 0.04, 0.22, ease.springHard);
          return <span key={i} style={{ display: "inline-block", marginRight: L.tag.fs * 0.24, opacity: clamp(p * 2), transform: `translateY(${(1 - p) * 30}px)`, color: RED.has(i) ? film.redOnCream : undefined }}>{w}</span>;
        })}
      </div>
      {plateP > 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: L.plate.y, display: "flex", justifyContent: "center", transform: `translateY(${(1 - plateP) * -60}px) scale(${1.15 - 0.15 * plateP})`, opacity: clamp(plateP * 2) }}>
          <div style={{ display: "flex", alignItems: "center", gap: L.plate.fs * 0.5, background: film.ink, color: "#fff", borderRadius: 999, padding: `${L.plate.fs * 0.42}px ${L.plate.fs * 0.8}px ${L.plate.fs * 0.42}px ${L.plate.fs * 0.5}px`, fontFamily: SANS, fontWeight: 700, fontSize: L.plate.fs, letterSpacing: -0.02 * L.plate.fs, boxShadow: "0 18px 40px rgba(0,0,0,0.25)" }}>
            <div style={{ width: L.plate.fs * 1.35, height: L.plate.fs * 1.35, borderRadius: L.plate.fs * 0.36, background: color.lime.base, display: "grid", placeItems: "center" }}><Icon name="cellphone-check" size={L.plate.fs * 0.85} fill={film.ink} /></div>
            <span>Seeker dApp Store</span><span style={{ color: color.lime.base }}>·</span><span style={{ color: color.lime.base }}>Oct 16</span>
            <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: L.plate.fs * 0.7, color: "#BDBDBD", marginLeft: L.plate.fs * 0.2 }}>kept.app</span>
          </div>
        </div>
      ) : null}
      <Keeper id="k-cta" t={t} perf={perf} />
      {L11 ? <Bubble t={t} line={L11} x={L.k.x + (L.bub === "left" ? -36 : 36) * k} y={L.k.y - 150 * k} side={L.bub} fs={pick(fmt, { h: 40, v: 52, s: 36 })} maxW={pick(fmt, { h: 520, v: 640, s: 440 })} until={b.watch - 0.05} /> : null}
    </AbsoluteFill>
  );
}
