// F · Daily proof: F1 camera → F2 checking → F2a failed → F3 photo 1 done → F4 photo 2 → F4·chk → F5 day kept.
import React from "react";
import { View } from "../rn";
import { color, MEMBER } from "../theme";
import { useMs } from "../motion";
import { Screen } from "../Screen";
import { NavBar } from "../kit/chrome";
import { Button, Chip, ChipRow, Note, Spacer, Title } from "../kit/basics";
import { ProofCamera, Shutter } from "../kit/camera";
import { DayStrip, SignStatus } from "../kit/status";
import { KeeperNote, KeeperPlacement } from "../kit/keeper";
import { RowList } from "../kit/rows";
import { CoinBurst, FallingCoins, Flash, ValuePill } from "../kit/fx";
import { BrandStamp } from "../kit/chrome";

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
/** F1 / F4: the camera with today's random challenge; the expiry chip ticks. `shutterAt` flashes. */
export function CameraF1({ photo = 1, gesture = "palm", shutterAt, secs0 = 4 * 60 + 59 }: { photo?: 1 | 2; gesture?: "palm" | "peace" | "thumb"; shutterAt?: number; secs0?: number }) {
  const ms = useMs();
  const label = { palm: "Dumbbell + open palm", peace: "Dumbbell + victory sign", thumb: "Dumbbell + thumbs up" }[gesture];
  return (
    <Screen ambient={null} bar={<NavBar title={`Iron Week · photo ${photo} of 2`} close />}
      blocks={[
        <ProofCamera key="c" photo={photo} object="dumbbell" gesture={gesture} state="idle" label={label} />,
        <ChipRow key="x" justify="center">{photo === 1 ? <Chip text={`Challenge expires ${mmss(Math.max(0, secs0 - Math.floor(Math.max(0, ms) / 1000)))}`} icon="timer-outline" /> : <Chip text="Different gesture this time" icon="hand-back-right" />}</ChipRow>,
        <Shutter key="s" press={shutterAt !== undefined ? shutterAt - 120 : undefined} />,
      ]}
      overlay={<Flash at={shutterAt} />}
    />
  );
}
/** F2 checking (scan) → optional fail at `failAt` (F2a: red corners, shake, Keeper's note). */
export function CheckF2({ photo = 1, gesture = "palm", failAt, line = "Hold still.\nI'm judging." }: { photo?: 1 | 2; gesture?: "palm" | "peace" | "thumb"; failAt?: number; line?: string }) {
  const ms = useMs();
  const failed = failAt !== undefined && ms >= failAt;
  return (
    <Screen bar={<NavBar title={`Iron Week · photo ${photo} of 2`} close={failed} mark="new" />}
      blocks={[
        <ProofCamera key="c" photo={photo} object="dumbbell" gesture={gesture} state={failed ? "fail" : "check"} label={failed ? `Couldn't see ${gesture === "peace" ? "a victory sign" : gesture === "palm" ? "an open palm" : "a thumbs up"}` : "Checking…"} failAt={failAt} />,
      ]}
      pinned={failed ? [<Button key="r" label="Try again" icon="camera-retake-outline" />] : []}
      overlay={failed ? <KeeperNote key="f" mood="soft" line={"Close. Two fingers,\nlike you mean it."} anim="shrug" at={failAt! + 250} top={102} /> : <KeeperNote key="j" mood="neutral" line={line} at={250} top={102} />}
    />
  );
}
export function PhotoDoneF3({ pressAt }: { pressAt?: number }) {
  return (
    <Screen beam ambient="lime" bar={<NavBar title="Iron Week" close />}
      blocks={[
        <Spacer key="s" h={30} />, <SignStatus key="g" state="success" chip="Photo 1 passed" successAt={0} />,
        <Title key="t" heading="Photo 1 is in." sub="Do your 20 minutes, then come back for photo 2. No timer. Any time before midnight." align="center" pt={26} />,
        <DayStrip key="d" n={2} done={1} today={2} labels={["Photo 1", "Photo 2"]} />,
        <Note key="n" text={'Today shows "In progress" until photo 2.'} />,
      ]}
      pinned={[<Button key="a" label="Take photo 2" icon="camera" press={pressAt} />, <Button key="b" label="Back to Today" kind="t" />]}
    />
  );
}
/** F5 Day kept: lime tone + beam, coin burst at 0, Keeper happy (thumbs), day strip, value pills. */
export function DayKeptF5({ day = 3, pending = true }: { day?: number; pending?: boolean } = {}) {
  return (
    <Screen tone="lime" beam ambient="lime" bar={<NavBar close />}
      under={<FallingCoins at={1200} />}
      blocks={[
        <KeeperPlacement key="k" mood="happy" line={"Clean. Your 1,000\nsleeps safe tonight."} anim="thumbs" size={150} side="c" height={236} />,
        <Title key="t" heading={`Day ${day} kept.`} align="center" fs={40} pt={0} />,
        <DayStrip key="d" n={7} done={day} today={day} labels={["01", "02", "03", "04", "05", "06", "07"]} />,
        <ChipRow key="c" justify="center"><Chip text="HP 90" icon="heart-pulse" tone="lime" tilt={-2} /><Chip text="1,043 SKR safe" icon="sack" tone="lime" tilt={2} /><Chip text="Streak 13" icon="fire" tone="ora" tilt={-1} /></ChipRow>,
        pending ? <RowList key="r" label="STILL PENDING" rows={[{ title: "Arjun", sub: "Hasn't proved today", value: "Nudge", valueColor: color.lime.base, leading: { kind: "avatar", config: MEMBER.A.avatar } }]} /> : null,
        <BrandStamp key="b" text={`VERIFIED · DAY ${day} · ${day === 1 ? "07:06" : "21:04"}`} />,
      ]}
      pinned={[<Button key="a" label="Done" />]}
      overlay={<><CoinBurst at={0} /><ValuePill text="Kept" icon="check-bold" x={34} y={500} at={600} tilt={-4} /><ValuePill text="Streak 13" icon="fire" x={206} y={450} at={1100} tilt={4} /></>}
    />
  );
}
export const _v = View;
