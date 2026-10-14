// One film = one cut × one format. Scenes are drawn by time window (they overlap for transitions);
// each scene lays itself out natively per format (scenes/common.ts › pick).
import React from "react";
import { AbsoluteFill, getStaticFiles, useCurrentFrame, useVideoConfig } from "remotion";
import { CUTS } from "./data/cuts";
import type { CutId } from "./data/cuts";
import { FPS } from "./lib/anim";
import { Soundtrack } from "./audio/Soundtrack";
import { S1Opening } from "./scenes/S1Opening";
import { S3Aha } from "./scenes/S3Aha";
import { S4Oath } from "./scenes/S4Oath";
import { S5Proof } from "./scenes/S5Proof";
import { S6Pot } from "./scenes/S6Pot";
import { S8CTA } from "./scenes/S8CTA";
import type { Fmt, SceneProps } from "./scenes/common";
import { Grain } from "./ui/Backgrounds";

export interface FilmProps { cut: CutId; fmt: Fmt; scratch?: boolean; label?: boolean; [k: string]: unknown }

export function Film({ cut: id, fmt, scratch = true, label = false }: FilmProps) {
  const frame = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const cut = CUTS[id];
  const b = cut.b;
  const t = frame / FPS;
  const p: SceneProps = { t, frame, cut, fmt, W, H };
  const on = (a: number, z: number) => t >= a && t < z;
  const hasTrack = getStaticFiles().some((f) => f.name === "music/track.mp3");
  const music = hasTrack ? "music/track.mp3" : scratch ? cut.music : null;
  return (
    <AbsoluteFill style={{ background: "#0E0E0E", overflow: "hidden" }}>
      {on(0, b.drop1) ? <S1Opening {...p} /> : null}
      {on(b.drop1, b.yank + 0.45) ? <S3Aha {...p} /> : null}
      {b.oath && on(b.yank, b.cam + 0.4) ? <S4Oath {...p} /> : null}
      {on(b.oath ? b.cam : b.yank, b.drop2 + 0.2) ? <S5Proof {...p} /> : null}
      {on(b.windup, b.ledger + 0.06) ? <S6Pot {...p} /> : null}
      {on(b.ledger + 0.04, cut.dur + 1) ? <S8CTA {...p} /> : null}
      <Grain frame={frame} opacity={0.05} blend="overlay" />
      {label ? <div style={{ position: "absolute", left: 16, bottom: 12, color: "#fff", font: "600 22px Geist Mono", opacity: 0.7, zIndex: 99 }}>{`ANIMATIC · ${id}s ${fmt} · ${t.toFixed(2)}s`}</div> : null}
      <Soundtrack cut={cut} music={music} />
    </AbsoluteFill>
  );
}
