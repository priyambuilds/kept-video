// QA: our rebuilt screen (left) beside the real app's screenshot (right), at the same height.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { ClockRoot } from "../app/motion";
import { SCREENS } from "../app/screens/registry";

export type QAProps = { pairs: [string, string][]; ms: number } & Record<string, unknown>;
export const ScreenQA: React.FC<QAProps> = ({ pairs, ms }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#555", flexDirection: "row", gap: 16, padding: 16 }}>
      {pairs.map(([id, shot]) => {
        const S = SCREENS[id];
        return (
          <div key={id} style={{ display: "flex", gap: 6 }}>
            <div style={{ width: 390, height: 844, position: "relative" }}>
              <ClockRoot ms={ms + (frame * 1000) / 60}>{S ? <S /> : <div style={{ color: "red" }}>{id}?</div>}</ClockRoot>
            </div>
            <Img src={staticFile(`qa/${shot}.png`)} style={{ height: 844, width: 380 }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
