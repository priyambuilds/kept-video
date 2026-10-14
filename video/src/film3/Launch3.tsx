// KEPT launch film v3 (docs/LAUNCH_FILM_V3_PLAN.md): "Who's your Arjun?"
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Grain } from "../ui/Backgrounds";
import { Stage } from "../film2/stage";
import { ActTeaser, ActWelcome } from "./ActOpen";
import { ActPromise } from "./ActPromise";
import { ActFriends } from "./ActFriends";
import { ActDay1, Day1Overlay } from "./ActDay1";
import { ActArjun, ActPayday, PaydayOverlay } from "./ActMidnight";
import { ActDay7, ActReview } from "./ActLate";
import { ActBounty, ActRecord } from "./ActBig";
import { ActEnd } from "./ActEnd";
import { Subtitles } from "./Subtitles";
import { Sound3 } from "./Sound3";
import { T, VO_PLACED } from "./timeline";

export type Launch3Props = { audio?: boolean } & Record<string, unknown>;
export const Launch3: React.FC<Launch3Props> = ({ audio = true }) => {
  const frame = useCurrentFrame();
  const t = frame / 60;
  return (
    <AbsoluteFill style={{ background: "#0E0E0E" }}>
      {t >= T.yank ? (
        <Stage t={t}>
          <ActWelcome t={t} />
          <ActPromise t={t} />
          <ActFriends t={t} />
          <ActDay1 t={t} />
          <ActArjun t={t} />
          <ActPayday t={t} />
          <ActReview t={t} />
          <ActDay7 t={t} />
          <ActBounty t={t} />
          <ActRecord t={t} />
          <ActEnd t={t} />
        </Stage>
      ) : null}
      <ActTeaser t={t} frame={frame} />
      <Day1Overlay t={t} />
      <PaydayOverlay t={t} />
      <Subtitles t={t} lines={VO_PLACED} skip={["L03a", "K05", "K19", "K20"]} />
      <Grain frame={frame} opacity={0.05} blend="overlay" />
      {audio ? <Sound3 /> : null}
    </AbsoluteFill>
  );
};
