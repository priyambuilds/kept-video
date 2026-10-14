// On-model QA (RECON §5): our port at t = 0.6 s next to the design's own exported pose SVGs
// (design/assets/keeper/svg, rendered from Keeper.dc.html at t = 0.6 s), plus every mood still.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { KeeperSVG } from "../keeper/KeeperSVG";
import type { KeeperAnimName, KeeperMood, KeeperPropName } from "../keeper/rig";

const ROWS: { ref: string; mood: KeeperMood; prop?: KeeperPropName; anim: KeeperAnimName }[] = [
  { ref: "keeper-pose-wave", mood: "smug", anim: "wave" },
  { ref: "keeper-pose-point", mood: "stern", anim: "point" },
  { ref: "keeper-pose-tap", mood: "stern", anim: "tap" },
  { ref: "keeper-pose-thumbs", mood: "happy", anim: "thumbs" },
  { ref: "keeper-pose-shrug", mood: "soft", anim: "shrug" },
  { ref: "keeper-pose-jump", mood: "shades", anim: "jump" },
  { ref: "keeper-pose-flip", mood: "smug", prop: "flip", anim: "flip" },
  { ref: "keeper-stern-scythe", mood: "stern", prop: "scythe", anim: "none" },
  { ref: "keeper-neutral-lens", mood: "neutral", prop: "lens", anim: "none" },
  { ref: "keeper-side-ledger", mood: "side", prop: "ledger", anim: "none" },
  { ref: "keeper-bored", mood: "bored", anim: "none" },
  { ref: "keeper-wink", mood: "wink", anim: "none" },
];

export function KeeperQA() {
  const frame = useCurrentFrame();
  const t = frame === 0 ? 0.6 : frame / 60;
  return (
    <AbsoluteFill style={{ background: "#1a1a1a", flexDirection: "row", flexWrap: "wrap", padding: 20, gap: 10 }}>
      {ROWS.map((r, i) => (
        <div key={i} style={{ width: 300, height: 200, display: "flex", gap: 4, background: "#222", position: "relative" }}>
          <Img src={staticFile(`assets/keeper-ref/${r.ref}.svg`)} style={{ width: 148, height: 196 }} />
          <svg viewBox="-16 -16 192 212" width={148} height={196} style={{ overflow: "visible" }}>
            <KeeperSVG id={`qa${i}`} mood={r.mood} prop={r.prop} anim={r.anim} t={r.anim === "none" ? 0 : t} />
          </svg>
          <div style={{ position: "absolute", bottom: 2, left: 4, color: "#999", fontSize: 11, fontFamily: "sans-serif" }}>{r.ref} · ref | port</div>
        </div>
      ))}
    </AbsoluteFill>
  );
}
