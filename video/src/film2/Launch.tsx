// KEPT launch film v2 (docs/LAUNCH_FILM_PLAN.md): the real app on a phone, hosted by the Keeper.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Grain } from "../ui/Backgrounds";
import { Stage } from "./stage";
import { ChOpen } from "./ChOpen";
import { ChOath } from "./ChOath";
import { ChProve } from "./ChProve";
import { ChStakes } from "./ChStakes";
import { ChBounty } from "./ChBounty";
import { ChProfile, WallOverlay } from "./ChProfile";
import { ChCTA } from "./ChCTA";
import { Sound } from "./Sound";

export type LaunchProps = { audio?: boolean } & Record<string, unknown>;
export const Launch: React.FC<LaunchProps> = ({ audio = true }) => {
  const frame = useCurrentFrame();
  const t = frame / 60;
  return (
    <AbsoluteFill>
      <Stage t={t}>
        <ChOpen t={t} />
        <ChOath t={t} />
        <ChProve t={t} />
        <ChStakes t={t} />
        <ChBounty t={t} />
        <ChProfile t={t} />
        <ChCTA t={t} />
      </Stage>
      <WallOverlay t={t} />
      <Grain frame={frame} opacity={0.05} blend="overlay" />
      {audio ? <Sound /> : null}
    </AbsoluteFill>
  );
};
