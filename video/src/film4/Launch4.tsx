// KEPT launch film v4 — final (docs/LAUNCH_FILM_V4.md): v2's flow up to the Oath, v3's friends story after it,
// no explanatory text — the phone and the Keeper carry the film. The Keeper's lines are silent here (lip-sync +
// optional subtitles); his voice goes on in the edit, timed by the transcript (renders/final/…_transcript).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Grain } from "../ui/Backgrounds";
import { Stage } from "../film2/stage";
import { ActOpen } from "./ActOpen";
import { ActOath } from "./ActOath";
import { ActFriends } from "./ActFriends";
import { ActDay1, Day1Overlay } from "./ActDay1";
import { ActArjun, ActPayday, PaydayOverlay } from "./ActMidnight";
import { ActDay7, ActReview } from "./ActLate";
import { ActBounty } from "./ActBounty";
import { ActCTA, ActRecord } from "./ActEnd";
import { Subtitles } from "./Subtitles";
import { Sound4 } from "./Sound4";
import type { Stem } from "./Sound4";
import { SCRIPTS } from "./timeline";
import type { Script } from "./timeline";
import { ScriptProvider } from "./script";

/** `script`: "v4" = the original transcript (Launch4-16x9), "v5" = the rewrite (Launch5-16x9). The end card types
 *  its own lines, so their subtitles are skipped (SCRIPTS[script].noSubs). */
export type Launch4Props = { audio?: boolean; subs?: boolean; stem?: Stem; script?: Script } & Record<string, unknown>;
export const Launch4: React.FC<Launch4Props> = ({ audio = true, subs = true, stem = "mix", script = "v4" }) => {
  const frame = useCurrentFrame();
  const t = frame / 60;
  const S = SCRIPTS[script];
  return (
    <ScriptProvider value={script}>
    <AbsoluteFill style={{ background: "#0E0E0E" }}>
      <Stage t={t}>
        <ActOpen t={t} />
        <ActOath t={t} />
        <ActFriends t={t} />
        <ActDay1 t={t} />
        <ActArjun t={t} />
        <ActPayday t={t} />
        <ActReview t={t} />
        <ActDay7 t={t} />
        <ActBounty t={t} />
        <ActRecord t={t} />
        <ActCTA t={t} />
      </Stage>
      <Day1Overlay t={t} />
      <PaydayOverlay t={t} />
      {subs ? <Subtitles t={t} lines={S.lines} skip={S.noSubs} fs={36} y={1016} /> : null}
      <Grain frame={frame} opacity={0.05} blend="overlay" />
      {audio ? <Sound4 stem={stem} /> : null}
    </AbsoluteFill>
    </ScriptProvider>
  );
};
