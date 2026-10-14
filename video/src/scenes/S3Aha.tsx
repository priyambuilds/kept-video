// S3 AHA: drop 1. Hard cut to cream; the ember point draws the Check-K's check, the lime tile pops,
// stem and leg snap in, KEPT slams (motion.md §1 splash, compressed to the beat). "cost" lands on the
// drop as big kinetic type; the Keeper pops up beside the logo (rig `popin`), smug: "Welcome to KEPT."
import React from "react";
import { AbsoluteFill } from "remotion";
import { Keeper } from "../keeper/Keeper";
import { handTrack, moodTrack, talk } from "../keeper/perf";
import { clamp, ease, prog, wobble } from "../lib/anim";
import { SANS, color, film } from "../lib/theme";
import { Bubble } from "../ui/Caption";
import { Cream, Grain } from "../ui/Backgrounds";
import { BrandTile, Wordmark } from "../ui/kit";
import { line } from "../data/cuts";
import { pick } from "./common";
import type { SceneProps } from "./common";

/** The logo build used by S3 (and reprised by the CTA). `t0` = the hit. */
export function LogoBuild({ t, t0, tileSize, word, ink = film.ink }: { t: number; t0: number; tileSize: number; word: number; ink?: string }) {
  const tileP = prog(t, t0, 0.42, ease.spring);
  const check = prog(t, t0, 0.14, ease.draw), stem = prog(t, t0 + 0.1, 0.1, ease.out), leg = prog(t, t0 + 0.17, 0.1, ease.out);
  const wordP = prog(t, t0 + 0.2, 0.3, ease.springHard);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: tileSize * 0.16 }}>
      <div style={{ transform: `scale(${0.4 + 0.6 * tileP})`, opacity: clamp(tileP * 3) }}><BrandTile size={tileSize} check={check} stem={stem} leg={leg} /></div>
      <div style={{ transform: `scale(${1.35 - 0.35 * wordP})`, opacity: clamp(wordP * 2) }}><Wordmark size={word} colour={ink} /></div>
    </div>
  );
}

export function S3Aha({ t, frame, cut, fmt, W, H }: SceneProps) {
  const b = cut.b;
  const L = pick(fmt, {
    h: { logo: { x: 820, y: 430 }, tile: 230, word: 120, text: { y: 820, fs: 68 }, k: { x: 1560, y: 1010, size: 360 } },
    v: { logo: { x: 540, y: 640 }, tile: 300, word: 150, text: { y: 1080, fs: 84 }, k: { x: 720, y: 1740, size: 560 } },
    s: { logo: { x: 400, y: 380 }, tile: 220, word: 110, text: { y: 740, fs: 66 }, k: { x: 830, y: 1040, size: 360 } },
  });
  const shake = wobble(t, b.drop1, 14, 18, 14);
  const L03a = line(cut, "L03a"), L03b = line(cut, "L03b");
  const lines = cut.vo.filter((l) => l.id === "L03b");
  const k = L.k.size / 160;
  const perf = (tt: number) => {
    const mt = moodTrack(tt, [[0, "smug"]]);
    // Ta-da: the left glove opens toward the logo after the pop-in settles; then the reach down for the yank.
    const Lh = handTrack(tt, [[b.popin + 0.55, null], [b.popin + 0.8, [8, 96, -70, "open"], ease.out], [b.yank - 0.35, [10, 100, -70, "open"]], [b.yank - 0.1, null]]);
    const Rh = handTrack(tt, [[b.yank - 0.3, null], [b.yank - 0.05, [150, 200, 120, "fist"], ease.out], [b.yank + 0.4, [150, 200, 120, "fist"]]]);
    const sp = talk(lines, tt, { eyes: mt.eyes, gx: tt > 8.25 ? -4 : 2 });
    return {
      x: L.k.x, y: L.k.y, size: L.k.size,
      draw: { mood: mt.mood, anim: "popin" as const, t: Math.max(0.001, tt - b.popin), wiggle: sp.wiggle, over: { ...sp.over, ...(Lh ? { left: Lh } : {}), ...(Rh ? { right: Rh } : {}) } },
      opacity: tt >= b.popin ? 1 : 0,
    };
  };
  // "…cost something." as kinetic type on the drop (the bubble was cut off by the hard cut).
  const words = L03a ? L03a.words : [];
  const textOut = L03a ? prog(t, L03a.end + 0.35, 0.2) : 1;
  return (
    <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.6}px)` }}>
      <Cream />
      <Grain frame={frame} opacity={0.07} />
      <div style={{ position: "absolute", left: L.logo.x, top: L.logo.y, transform: "translate(-50%,-50%)" }}>
        <LogoBuild t={t} t0={b.drop1} tileSize={L.tile} word={L.word} />
      </div>
      {textOut < 1 ? (
        <div style={{ position: "absolute", left: L.logo.x, top: L.text.y, transform: "translateX(-50%)", whiteSpace: "nowrap", textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: L.text.fs, letterSpacing: -0.03 * L.text.fs, color: film.ink, opacity: 1 - textOut }}>
          {words.filter((w) => t >= w.start - 0.05).map((w, i) => (
            <span key={i} style={{
              marginRight: L.text.fs * 0.25, display: "inline-block",
              backgroundImage: w.key ? `linear-gradient(${color.lime.base}, ${color.lime.base})` : undefined, backgroundSize: "100% 45%", backgroundPosition: "0 85%", backgroundRepeat: "no-repeat",
              transform: w.key ? `scale(${1 + 0.25 * (1 - prog(t, w.start, 0.25, ease.springHard))})` : undefined,
            }}>{w.w}</span>
          ))}
        </div>
      ) : null}
      <Keeper id="k-aha" t={t} perf={perf} />
      {L03b && cut.bubbles !== false ? <Bubble t={t} line={L03b} x={L.k.x - 30 * k} y={L.k.y - 152 * k} side="left" fs={pick(fmt, { h: 46, v: 58, s: 44 })} maxW={600} until={b.yank - 0.1} /> : null}
    </AbsoluteFill>
  );
}
