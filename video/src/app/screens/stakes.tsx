// D2 active Oath (the miss: Arjun's cell turns red, HP 100 → 80), L1 kept, J1 claim, J1·ok, R1 rematch, D0 list.
import React from "react";
import { View } from "../rn";
import { color, MEMBER } from "../theme";
import { useMs } from "../motion";
import { Screen } from "../Screen";
import { AppHeader, BrandStamp, NavBar, TabBar, Toast } from "../kit/chrome";
import { Banner, BodyText, Breakdown, Button, Chip, ChipRow, Spacer, Title } from "../kit/basics";
import { DayMemberGrid, HPPanel, OathCard } from "../kit/oath";
import { RowList, SeatSlots } from "../kit/rows";
import { MoneyMoment } from "../kit/status";
import { KeeperPlacement } from "../kit/keeper";
import { CoinBurst, FallingCoins, ValuePill } from "../kit/fx";

const GRID = [
  { key: "Y", name: "You", initial: "Y", color: MEMBER.Y.color, cells: "kkh" },
  { key: "R", name: "Riya", initial: "R", color: MEMBER.R.color, cells: "kkk" },
  { key: "A", name: "Arjun", initial: "A", color: MEMBER.A.color, cells: "kpp" },
  { key: "D", name: "Dev", initial: "D", color: MEMBER.D.color, cells: "kkr" },
];
/** D2: `missAt` = midnight settles: Arjun's day 2 turns ✕, HP 100 → 80 (damage), then the crew rows show +43. */
export function ActiveD2({ missAt, scroll = 0, day = "Day 3/7", nudgeAt, today = 3 }: { missAt?: number; scroll?: number; day?: string; nudgeAt?: number; today?: 2 | 3 }) {
  const ms = useMs();
  const grid = GRID.map((g) => ({ ...g, cells: g.cells.slice(0, today) }));
  const settled = missAt === undefined || ms >= missAt;
  return (
    <Screen ambient={settled ? "red" : null} scroll={scroll} bar={<NavBar title="Iron Week" right={day} mark />}
      blocks={[
        <HPPanel key="h" hp={settled ? 80 : 100} from={missAt !== undefined ? 100 : undefined} at={missAt ?? 0} lostToday={settled ? 20 : 0} note={settled ? "Arjun missed day 2: −20. Heals +10 tonight." : "Everyone kept so far."} />,
        <BodyText key="t" text={today === 2 ? "<m>0h 08m</m> left today · first miss −143 SKR" : "<m>9h 18m</m> left today · first miss −143 SKR"} />,
        <KeeperPlacement key="k" mood="side" line={"Arjun's still on the couch.\n3-to-1 he misses."} prop="whisper" size={92} side="r" height={106} />,
        <DayMemberGrid key="g" days={7} today={today} members={grid} changes={missAt !== undefined ? [{ row: 2, col: 1, to: "m", at: missAt }] : [{ row: 2, col: 1, to: "m", at: -1e6 }]} />,
        <ChipRow key="c"><Chip text="Riya 1-to-9" icon="cards-playing-outline" tilt={-2} /><Chip text="Arjun 3-to-1 to miss" icon="cards-playing-outline" tone="ora" tilt={2} /><Chip text="Dev in review" icon="eye-outline" tone="vio" tilt={-1} /></ChipRow>,
        <Banner key="b" tone="grey" icon="chart-line" title={settled ? "Arjun's miss paid out" : "If Arjun misses today"} sub="You +43 · Riya +43 · Dev +43 · fee 14 SKR" />,
      ]}
      pinned={[today === 3 ? <Button key="p" label="Take photo 2" icon="camera" /> : null, <Button key="n" label="Nudge Arjun" kind="s" icon="bell-ring-outline" press={nudgeAt} />].filter(Boolean) as React.ReactElement[]}
      overlay={nudgeAt !== undefined ? <Toast text="Nudged Arjun" at={nudgeAt + 150} /> : undefined}
    />
  );
}

/** L1: payout moment (motion.md §7). */
export function KeptL1({ pressAt }: { pressAt?: number }) {
  return (
    <Screen tone="lime" beam ambient="lime" bar={<NavBar close />} under={<FallingCoins at={1200} />}
      blocks={[
        <KeeperPlacement key="k" mood="shades" line={"Seven for seven.\nPay the Keeper."} prop="sack" anim="jump" size={170} side="c" height={260}
          orbs={[{ icon: "sack", x: 288, y: 40, size: 46, palette: "lime", rotate: 0, coin: true }, { icon: "sack", x: 304, y: 124, size: 28, palette: "lime", rotate: 0, coin: true }, { icon: "trophy-outline", x: 12, y: 176, size: 44, palette: "amber", rotate: -12 }]} />,
        <Title key="t" heading="Iron Week, kept." align="center" fs={36} pt={0} />,
        <MoneyMoment key="m" value="1,107" caption="SKR · up 107" tone="lime" />,
        <Breakdown key="b" rows={[{ label: "Start", value: "1,000" }, { label: "Lost", value: "0" }, { label: "Won from Arjun's miss", value: "+107", color: color.lime.base }, { label: "Final", value: "1,107 SKR", color: color.lime.base, total: true }]} />,
        <BrandStamp key="s" text="IRON WEEK · 7 OF 7" />,
      ]}
      pinned={[<Button key="c" label="Claim 1,107 SKR" kind="l" icon="hand-coin-outline" press={pressAt} />]}
      overlay={<><CoinBurst at={0} y={330} /><ValuePill text="+107 SKR" icon="sack" x={34} y={500} at={600} tilt={-4} /><ValuePill text="7 of 7" icon="check-bold" x={226} y={460} at={1100} tilt={4} /></>}
    />
  );
}
export function ClaimedJ1ok() {
  return (
    <Screen tone="lime" beam ambient="lime" bar={<NavBar close />} under={<FallingCoins at={1200} />}
      blocks={[
        <Spacer key="s" h={10} />,
        <KeeperPlacement key="k" mood="shades" line={"Pleasure doing\nbusiness."} prop="sack" anim="jump" size={170} side="c" height={270} />,
        <Title key="t" heading="Claimed." sub="1,107 SKR is in your wallet." align="center" fs={40} />,
      ]}
      pinned={[<Button key="d" label="Done" />]}
      overlay={<><CoinBurst at={0} y={300} /><ValuePill text="+1,107 SKR" icon="sack" x={120} y={520} at={500} tilt={-3} /></>}
    />
  );
}
export function RematchR1() {
  return (
    <Screen tone="ember" ambient="ember" bar={<NavBar title="Rematch" close />}
      blocks={[
        <KeeperPlacement key="k" mood="smug" line="Run it back?" prop="flip" anim="flip" size={150} side="c" height={220} chips={[{ text: "+500 SKR", icon: "sack", x: 228, y: 150, tilt: 6, tone: "lime" }, { text: "6d 23h left", icon: "alarm", x: 4, y: 168, tilt: -5, tone: "dark" }]} />,
        <Title key="t" heading="Win back 500 SKR." sub="Keep every day of the Rematch, and don't let it break. You get back half of what Guitar Days cost you." fs={30} pt={0} />,
        <Breakdown key="b" rows={[{ label: "You lost", value: "−1,000 SKR", color: color.red.base }, { label: "You can win back", value: "+500 SKR", color: color.lime.base }, { label: "New stake", value: "1,000 SKR" }]} />,
        <SeatSlots key="s" seats={[{ kind: "member", name: "Riya", status: "joined", avatar: MEMBER.R.avatar, color: MEMBER.R.color }, { kind: "member", name: "Dev", status: "joined", avatar: MEMBER.D.avatar, color: MEMBER.D.color }, { kind: "member", name: "You", status: "you?", avatar: MEMBER.Y.avatar, color: MEMBER.Y.color, dim: true }, { kind: "open" }]} />,
      ]}
      pinned={[<Button key="j" label="Join Rematch" kind="l" icon="sword-cross" />]}
    />
  );
}
export function OathsD0() {
  return (
    <Screen still bar={<AppHeader title="Oaths" />} bottomInset={104}
      blocks={[
        <BodyText key="a" text="ACTIVE · 2" mono />,
        <OathCard key="i" icon="dumbbell" name="Iron Week" meta="Group · Day 3/7" tags={[{ text: "1,043 SKR", icon: "sack", tone: "lime" }, { text: "Arjun pending", icon: "timer-sand", tone: "ora" }]} hp={90} />,
        <OathCard key="r" icon="book-open-variant" name="Read 20 pages" meta="Solo · Day 9/14" tags={[{ text: "500 SKR", icon: "sack", tone: "lime" }, { text: "Kept today", icon: "check", tone: "lime" }]} hp={100} />,
        <RowList key="h" label="RECENTLY FINISHED" rows={[{ title: "Hydra 14", sub: "Ended Thu · claim ready", value: "+54", valueColor: color.lime.base, leading: { kind: "icon", icon: "trophy-outline" }, chevron: true }, { title: "All history", sub: "50 Oaths · 41 kept · 9 broken", leading: { kind: "icon", icon: "history" }, chevron: true }]} />,
      ]}
      overlay={<TabBar active="oaths" />}
    />
  );
}
export const _u = useMs;
export const _V = View;
