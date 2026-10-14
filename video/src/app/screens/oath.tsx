// C · Create an Oath: C1 goal → C2 object → C3 length → C4 group + stake → C5 review → C6 terms → C7 sign → C7·ok → C8 invite.
import React from "react";
import { View } from "../rn";
import { color, MEMBER } from "../theme";
import { useMs } from "../motion";
import { Screen } from "../Screen";
import { NavBar } from "../kit/chrome";
import { Banner, BodyText, Breakdown, Button, ButtonRow, Note, Spacer, Title } from "../kit/basics";
import { OptionGrid, QRCard, RowList, SeatSlots, SentenceInput } from "../kit/rows";
import type { Seat } from "../kit/rows";
import { SignStatus } from "../kit/status";
import { KeeperPlacement } from "../kit/keeper";

const GOAL = "lift for 20 minutes";
/** C1: types the goal from `typeAt` (≈ 16 chars/s, the app's own input). */
export function GoalC1({ typeAt = 300, pressAt, stepSince }: { typeAt?: number; pressAt?: number; stepSince?: number }) {
  const ms = useMs();
  const typed = Math.max(0, Math.min(GOAL.length, Math.floor((ms - typeAt) / 62)));
  return (
    <Screen ambient="vio" bar={<NavBar steps={[1, 6]} close stepSince={stepSince} />}
      blocks={[
        <Title key="t" heading={"What will you do\nevery day?"} sub="Keep it small and specific. You'll prove it daily." pt={6} />,
        <SentenceInput key="i" label="Your Oath" prefix="Every day I will" value={GOAL} typed={typed} max={60} suggestions={["lift for 20 minutes", "read 20 pages", "drink 2 litres of water", "practise guitar for 30 min"]} />,
        <KeeperPlacement key="k" mood="soft" line={"Make it something\nyou'll actually do."} size={76} side="r" height={92} bubbleAt={900} cycle="1/3" />,
      ]}
      pinned={[<Button key="n" label="Next" press={pressAt} disabled={typed === 0} />]}
    />
  );
}
export const OBJ = [["Dumbbell", "dumbbell"], ["Book", "book-open-variant"], ["Water bottle", "bottle-soda-outline"], ["Guitar", "guitar-acoustic"], ["Running shoe", "shoe-sneaker"], ["Plant", "sprout"], ["Skipping rope", "jump-rope"], ["Yoga mat", "yoga"]];
export function ObjectC2({ pickAt, pressAt }: { pickAt?: number; pressAt?: number }) {
  return (
    <Screen ambient="vio" bar={<NavBar steps={[2, 6]} stepSince={0} />}
      blocks={[
        <Title key="t" heading="What's in the photo?" sub="Both daily photos must show it, plus a hand gesture." pt={6} />,
        <OptionGrid key="o" mode="tile" cols={4} items={OBJ.map(([title, icon]) => ({ title, icon }))} value={0} since={pickAt} press={pickAt !== undefined ? pickAt - 90 : undefined} />,
        <Note key="n" text="Checked by AI on our server, then deleted. Only a fingerprint is kept." icon="fingerprint" />,
      ]}
      pinned={[<Button key="n" label="Next" press={pressAt} />]}
    />
  );
}
export function LengthC3({ pickAt, pressAt }: { pickAt?: number; pressAt?: number }) {
  return (
    <Screen ambient="vio" bar={<NavBar steps={[3, 6]} stepSince={0} />}
      blocks={[
        <Title key="t" heading="How long?" sub="Longer Oaths cost less per miss, but there are more days to keep." pt={6} />,
        <OptionGrid key="o" mode="big" cols={3} items={[{ title: "3", sub: "days · sprint" }, { title: "7", sub: "days · a week" }, { title: "14", sub: "days · the real test" }]} value={1} since={pickAt} press={pickAt !== undefined ? pickAt - 90 : undefined} />,
        <Banner key="b" tone="grey" icon="calendar-check" title="Ends Tue 21 Oct" sub="Day 1 starts when the creator presses Start." />,
      ]}
      pinned={[<Button key="n" label="Next" press={pressAt} />]}
    />
  );
}
export function StakeC4({ groupAt, stakeAt, pressAt }: { groupAt?: number; stakeAt?: number; pressAt?: number }) {
  const ms = useMs();
  const showCost = stakeAt === undefined || ms >= stakeAt;
  return (
    <Screen ambient="vio" bar={<NavBar steps={[4, 6]} stepSince={0} />}
      blocks={[
        <Title key="t" heading={"Who's in, and\nwhat's on it?"} pt={6} />,
        <OptionGrid key="m" mode="row2" cols={2} items={[{ title: "Solo", sub: "Just you. Misses hit harder.", icon: "account" }, { title: "Group", sub: "Friends join by link. Needs a Seeker.", icon: "account-group" }]} value={1} since={groupAt} press={groupAt !== undefined ? groupAt - 90 : undefined} />,
        <BodyText key="l" text="STAKE PER PERSON" mono />,
        <OptionGrid key="s" mode="chip" cols={3} items={[{ title: "500", sub: "≈ $5" }, { title: "1,000", sub: "≈ $10" }, { title: "2,500", sub: "≈ $25" }]} value={1} since={stakeAt} press={stakeAt !== undefined ? stakeAt - 90 : undefined} />,
        <View key="c" style={{ opacity: showCost ? 1 : 0.0 }}><Banner tone="lime" icon="sack" title="First miss costs 143 SKR" sub="Then 214, then 321. Each miss costs 1.5× the last." /></View>,
      ]}
      pinned={[<Button key="n" label="Next" press={pressAt} />]}
    />
  );
}
export function ReviewC5({ pickAt, pressAt }: { pickAt?: number; pressAt?: number }) {
  return (
    <Screen ambient="vio" bar={<NavBar steps={[5, 6]} stepSince={0} />}
      blocks={[
        <Title key="t" heading="If the AI says no?" sub="You choose once. Everyone who joins plays by it." pt={6} />,
        <OptionGrid key="o" mode="row" cols={1} items={[{ title: "AI only", sub: "A failed check is final. Simple and strict.", icon: "robot-outline" }, { title: "AI + group review", sub: "After 3 failed photo-2 checks, the group votes. Majority approves; a tie rejects.", icon: "account-group-outline" }]} value={1} since={pickAt} press={pickAt !== undefined ? pickAt - 90 : undefined} />,
      ]}
      pinned={[<Button key="n" label="Next" press={pressAt} />]}
    />
  );
}
export const C6_RULES = [
  { title: "HP starts at 100", sub: "−20 for each member who misses, then +10 heal.", leading: { kind: "icon" as const, icon: "heart-pulse" }, minHeight: 56 },
  { title: "At 0 HP it breaks", sub: "Everyone loses the whole pot.", leading: { kind: "icon" as const, icon: "fire", fg: color.red.base }, minHeight: 56 },
  { title: "One miss costs 143 SKR", sub: "Then 214, 321… paid to whoever kept.", leading: { kind: "icon" as const, icon: "sack", fg: color.lime.base }, minHeight: 56 },
  { title: "10% fee", sub: "KEPT keeps 10% of lost SKR. Kept SKR is never charged.", leading: { kind: "icon" as const, icon: "percent-outline" }, minHeight: 56 },
];
export const C6_TERMS = [{ label: "Goal", value: "Every day I will lift for 20 minutes" }, { label: "Object", value: "Dumbbell" }, { label: "Length", value: "7 days" }, { label: "Stake", value: "1,000 SKR each", color: color.lime.base }, { label: "Review", value: "AI + group review" }];
export function TermsC6({ pressAt, scroll = 0, hideRules, showRules }: { pressAt?: number; scroll?: number; hideRules?: number; showRules?: number }) {
  const ms = useMs();
  return (
    <Screen ambient="vio" scroll={scroll} bar={<NavBar steps={[6, 6]} stepSince={0} />}
      blocks={[
        <Title key="t" heading={"Read it like\na contract."} pt={6} />,
        <Breakdown key="b" rows={C6_TERMS} />,
        <View key="r" style={{ opacity: hideRules !== undefined && ms >= hideRules && (showRules === undefined || ms < showRules) ? 0.0 : 1 }}><RowList label="THE RULES" rows={C6_RULES} /></View>,
      ]}
      pinned={[<Button key="s" label="Sign & stake" kind="l" icon="draw-pen" press={pressAt} />]}
    />
  );
}
export function SwornC7ok({ pressAt }: { pressAt?: number }) {
  return (
    <Screen beam ambient="lime"
      blocks={[<Spacer key="s" h={70} />, <SignStatus key="g" state="success" chip="1,000 SKR staked" successAt={0} />, <Title key="t" heading={"Sworn.\n1,000 SKR on the table."} sub="Iron Week is ready. Bring your people, then press Start." align="center" pt={26} />]}
      pinned={[<Button key="a" label="Invite your crew" icon="account-multiple-plus" press={pressAt} />, <Button key="b" label="Solo? Go to the Oath" kind="t" />]}
    />
  );
}
/** C8 invite: seats fill as friends join at `joins` ms (Riya, Arjun, Dev). */
export function InviteC8({ joins = [], pressAt }: { joins?: number[]; pressAt?: number }) {
  const ms = useMs();
  const n = 1 + joins.filter((j) => ms >= j).length;
  const seat = (k: "R" | "A" | "D", at?: number): Seat => ({ kind: "member", name: MEMBER[k].name, status: "joined", avatar: MEMBER[k].avatar, color: MEMBER[k].color, at });
  return (
    <Screen ambient="lime" bar={<NavBar title="Invite" close />}
      blocks={[
        <Title key="t" heading="Bring your people." sub="Everyone stakes 1,000 SKR. It starts when you press Start." pt={4} />,
        <QRCard key="q" code="IRON-7K2Q" link="kept.app/o/IRON-7K2Q" />,
        <ButtonRow key="b"><Button label="Copy link" kind="s" icon="content-copy" width={171} /><Button label="Share" kind="s" icon="share-variant" width={171} /></ButtonRow>,
        <BodyText key="l" text={`JOINED SO FAR · ${n}`} mono />,
        <SeatSlots key="s" seats={[{ kind: "member", name: "You", status: "joined", avatar: MEMBER.Y.avatar, color: MEMBER.Y.color }, seat("R", joins[0] ?? 0), seat("A", joins[1] ?? 0), seat("D", joins[2] ?? 0)]} />,
      ]}
      pinned={[<Button key="o" label="Open the Oath" press={pressAt} />]}
    />
  );
}
