// The social screens v3 is built on: E2 invite preview (a friend's phone: "SAM INVITED YOU"), E2·s joining,
// G1 review a friend's photo, G3 approved. Copy from design/screens.md; the inviter is You (sam.skr), since
// in the film it's your Oath the friends join.
import React from "react";
import { View } from "../rn";
import { color, MEMBER } from "../theme";
import { useMs } from "../motion";
import { Screen } from "../Screen";
import { NavBar } from "../kit/chrome";
import { BodyText, Breakdown, Button, Chip, ChipRow, Spacer, Title, Note } from "../kit/basics";
import { OathCard } from "../kit/oath";
import { RowList } from "../kit/rows";
import { ProofCamera } from "../kit/camera";
import { MoneyMoment, SignStatus } from "../kit/status";
import { KeeperPlacement } from "../kit/keeper";

type Who = "R" | "A" | "D";
const RATE: Record<"Y" | Who, [string, string]> = { Y: ["91%", "64 days"], R: ["94%", "71 days"], A: ["78%", "40 days"], D: ["88%", "52 days"] };

/** E2 on friend `who`'s phone: the invite from Sam, the keepers so far, the rules, Join & stake. */
export function InviteE2({ who, pressAt, joined = [] }: { who: Who; pressAt?: number; joined?: Who[] }) {
  const rows = [
    { title: "Sam", sub: "Creator", value: RATE.Y[0], valueSub: RATE.Y[1], leading: { kind: "avatar" as const, config: MEMBER.Y.avatar } },
    ...joined.filter((k) => k !== who).map((k) => ({ title: MEMBER[k].name, sub: "Joined", value: RATE[k][0], valueSub: RATE[k][1], leading: { kind: "avatar" as const, config: MEMBER[k].avatar } })),
  ];
  return (
    <Screen ambient="lime" bar={<NavBar title="Invite" />}
      blocks={[
        <BodyText key="m" text="SAM INVITED YOU" mono />,
        <OathCard key="o" icon="dumbbell" name="Iron Week" meta="by Sam · 7 days · AI + group review" line="Every day I will lift for 20 minutes."
          tags={[{ text: "1,000 SKR each", icon: "sack", tone: "lime" }, { text: "Starts when Sam says", icon: "flag-checkered", tone: "grey" }]}
          float={{ text: "91% kept rate", initial: "S", bg: MEMBER.Y.color }} />,
        <RowList key="k" label="KEEPERS · KEPT RATE" rows={rows} />,
        <Breakdown key="r" label="THE RULES" rows={[{ label: "HP", value: "100 · −20 per miss · +10 a day" }, { label: "First miss", value: "−143 SKR, then 1.5×" }, { label: "At 0 HP", value: "Everyone loses the pot" }, { label: "Fee", value: "10% of lost SKR" }]} />,
      ]}
      pinned={[<Button key="j" label="Join & stake 1,000 SKR" kind="l" icon="draw-pen" press={pressAt} />]}
    />
  );
}

/** E2·s: joining (sign) → success at `successAt`. */
export function JoinE2s({ who, successAt }: { who: Who; successAt?: number }) {
  const others = (["Sam", "Riya", "Arjun", "Dev"] as const).filter((n) => n !== MEMBER[who].name);
  return (
    <Screen ambient="lime" bar={<NavBar close />}
      blocks={[<Spacer key="s" h={60} />, <SignStatus key="g" state="pending" chip="Seeker Wallet" successAt={successAt} successChip="Joined" />,
        <Title key="t" heading="Join Iron Week" sub={`Staking 1,000 SKR alongside ${others.slice(0, -1).join(", ")} and ${others[others.length - 1]}.`} align="center" pt={26} />,
        <Note key="n" text="Waiting for your signature…" icon="timer-sand" />]}
    />
  );
}

/** G1: Dev's photo needs your vote. `approveAt` presses Approve; `riyaAt` flips the tally chip. */
export function ReviewG1({ approveAt, riyaAt = 0 }: { approveAt?: number; riyaAt?: number }) {
  const ms = useMs();
  const riya = ms >= riyaAt;
  return (
    <Screen ambient="vio" bar={<NavBar title="Review" close />}
      blocks={[
        <Title key="t" heading="Dev wants your vote." sub="Iron Week · day 3 · photo 2 needs a dumbbell and an open palm." pt={4} />,
        <ProofCamera key="c" object="dumbbell" gesture="palm" state="review" label="Dev's photo · AI failed 3 times" height={300} />,
        <ChipRow key="x"><Chip text={riya ? "1 of 3 votes" : "0 of 3 votes"} icon="account-group" tilt={-2} /><Chip text={riya ? "Riya approved" : "Riya voting…"} icon="check" tone={riya ? "lime" : "g"} tilt={2} /><Chip text="41h left" icon="timer-outline" tilt={-1} /></ChipRow>,
        <KeeperPlacement key="k" mood="side" line={"Looks like a palm to me.\nMostly."} prop="lens" size={92} side="r" height={106} />,
      ]}
      pinned={[<Button key="a" label="Approve" kind="l" icon="check-bold" press={approveAt} />, <Button key="r" label="Reject" kind="s" />]}
    />
  );
}

/** G3: approved 2–1. */
export function ApprovedG3() {
  return (
    <Screen beam ambient="lime" bar={<NavBar close />}
      blocks={[<Spacer key="s" h={70} />, <SignStatus key="g" state="success" chip="Approved 2–1" successAt={0} />,
        <Title key="t" heading="Day 3 counts as kept." sub="Riya and Sam backed Dev. His 1,043 SKR is safe tonight." align="center" pt={26} />]}
      pinned={[<Button key="b" label="Back to Iron Week" />]}
    />
  );
}
/** L2 on Arjun's phone: Iron Week is over, one miss. */
export function ArjunL2() {
  return (
    <Screen ambient="red" bar={<NavBar close />}
      blocks={[
        <KeeperPlacement key="k" mood="soft" line="Tough week." prop="ledger" size={130} side="c" height={190} />,
        <Title key="t" heading="Iron Week is over." sub="You missed day 2." align="center" pt={0} />,
        <MoneyMoment key="m" value="857" caption="SKR · down 143" tone="red" />,
        <Breakdown key="b" rows={[{ label: "Start", value: "1,000" }, { label: "Lost (1 miss)", value: "−143", color: color.red.base }, { label: "Won from others", value: "0" }, { label: "Final", value: "857 SKR", total: true }]} />,
      ]}
      pinned={[<Button key="c" label="Claim 857 SKR" />]}
    />
  );
}
export const _s = View;
