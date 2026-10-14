import React from "react";
import { Composition } from "remotion";
import { Film } from "./Film";
import type { FilmProps } from "./Film";
import { CUTS } from "./data/cuts";
import { KeeperQA } from "./compositions/KeeperQA";
import { ScreenQA } from "./compositions/ScreenQA";
import { Launch } from "./film2/Launch";
import { DUR } from "./film2/timeline";
import type { QAProps } from "./compositions/ScreenQA";
import { Launch3 } from "./film3/Launch3";
import { Launch4 } from "./film4/Launch4";
import { DUR4 } from "./film4/timeline";
import { DUR as DUR3 } from "./film3/timeline";
import { loadFonts } from "./lib/fonts";
import { SIZES } from "./scenes/common";
import type { Fmt } from "./scenes/common";

loadFonts();

const FMTS: Fmt[] = ["16x9", "9x16", "1x1"];

export const RemotionRoot: React.FC = () => (
  <>
    {(["28", "15"] as const).flatMap((cut) => FMTS.map((fmt) => (
      <Composition key={`${cut}-${fmt}`} id={`KEPT-${cut}s-${fmt}`} component={Film} durationInFrames={CUTS[cut].dur * 60} fps={60}
        width={SIZES[fmt][0]} height={SIZES[fmt][1]} defaultProps={{ cut, fmt, scratch: true, label: false } as FilmProps} />
    )))}
    <Composition id="Animatic-28s" component={Film} durationInFrames={28 * 60} fps={60} width={1920} height={1080} defaultProps={{ cut: "28", fmt: "16x9", scratch: true, label: true } as FilmProps} />
    <Composition id="Animatic-15s" component={Film} durationInFrames={15 * 60} fps={60} width={1920} height={1080} defaultProps={{ cut: "15", fmt: "16x9", scratch: true, label: true } as FilmProps} />
    <Composition id="Launch-16x9" component={Launch} durationInFrames={Math.round(DUR * 60)} fps={60} width={1920} height={1080} defaultProps={{ audio: true }} />
    <Composition id="Launch4-16x9" component={Launch4} durationInFrames={Math.round(DUR4 * 60)} fps={60} width={1920} height={1080} defaultProps={{ audio: true, subs: true, stem: "mix" }} />
    <Composition id="Launch5-16x9" component={Launch4} durationInFrames={Math.round(DUR4 * 60)} fps={60} width={1920} height={1080} defaultProps={{ audio: true, subs: true, stem: "mix", script: "v5" }} />
    <Composition id="Launch3-16x9" component={Launch3} durationInFrames={Math.round(DUR3 * 60)} fps={60} width={1920} height={1080} defaultProps={{ audio: true }} />
    <Composition id="ScreenQA" component={ScreenQA} durationInFrames={60} fps={60} width={2400} height={876} defaultProps={{ pairs: [["B1", "deck-2"], ["B5", "B5"]], ms: 6000 } as QAProps} />
    <Composition id="KeeperQA" component={KeeperQA} durationInFrames={240} fps={60} width={1940} height={680} />
  </>
);
