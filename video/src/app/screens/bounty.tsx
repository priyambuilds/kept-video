// H · Bounties: H1 feed (Discover) → H2 detail → H3 joined → H5 ended; K2 fund the pool.
import React from "react";
import { View } from "../rn";
import { color, MEMBER } from "../theme";
import { At, E, Pop, cl, ev, useMs } from "../motion";
import { Screen } from "../Screen";
import { AppHeader, NavBar, TabBar } from "../kit/chrome";
import type { TabKey } from "../kit/chrome";
import { Banner, Breakdown, Button, ButtonRow, Chip, ChipRow, SearchBar, Segmented, Title } from "../kit/basics";
import { BountyCover, HScroller } from "../kit/social";
import type { HeroItem } from "../kit/social";
import { OathCard } from "../kit/oath";
import { OptionGrid, Row, RowList, SeatSlots } from "../kit/rows";
import { Text } from "../motion";
import { MoneyMoment } from "../kit/status";
import { KeeperPlacement } from "../kit/keeper";
import { CoinBurst, FallingCoins } from "../kit/fx";

const NORTH = { brand: "Northbound", logo: "N", colors: ["#3B82F6", "#1E3A8A"] as const, icon: "shoe-sneaker" };
export const CLOSING: HeroItem[] = [
  { title: "Rope 1k", icon: "jump-rope", value: "15,000 SKR", sub: "SkipLab · closes in 3h", palette: "lime" },
  { title: "Sol Strings", icon: "guitar-acoustic", value: "8,000 SKR", sub: "@riffs · closes in 9h", palette: "vio" },
  { title: "Green Thumb", icon: "sprout", value: "12,000 SKR", sub: "Sprout Co · closes in 12h", palette: "sky" },
  { title: "Hydrate Week", icon: "bottle-soda-outline", value: "50,000 SKR", sub: "Drift · closes in 5h", palette: "amber" },
];
export const BIGGEST: HeroItem[] = [
  { title: "Northbound Run Club", icon: "shoe-sneaker", value: "120,000 SKR", sub: "Northbound · 2d left", palette: "sky" },
  { title: "Iron October", icon: "dumbbell", value: "75,000 SKR", sub: "Forge Gym · 3d left", palette: "pink" },
  { title: "Hydrate Week", icon: "bottle-soda-outline", value: "50,000 SKR", sub: "Drift · closes in 5h", palette: "orange" },
  { title: "Mat Month", icon: "yoga", value: "30,000 SKR", sub: "Lotus · 1d left", palette: "vio" },
];
/** H1 feed. `scroll1`/`scroll2`: the two scrollers' offsets over time (px); `vscroll` the page. */
export function FeedH1({ coverPress, hs1 = [0, 0, 0], hs2 = [0, 0, 0], vscroll = [0, 0, 0], prevTab, tabSince }: { coverPress?: number; hs1?: [number, number, number]; hs2?: [number, number, number]; vscroll?: [number, number, number]; prevTab?: TabKey; tabSince?: number }) {
  const ms = useMs();
  const mv = ([a, b, d]: [number, number, number]) => d * E.inOut(cl((ms - a) / Math.max(1, b - a)));
  return (
    <Screen still={prevTab === undefined} scroll={mv(vscroll)} bar={<AppHeader title="Bounties" />} bottomInset={104}
      blocks={[
        <Segmented key="s" items={["Discover", "Joined", "Created"]} value={0} />,
        <SearchBar key="q" placeholder="Search 1,240 Bounties" filter />,
        <HScroller key="c" chips={["All", "Fitness", "Reading", "Hydration", "Music", "Mind"]} chipValue={0} />,
        <BountyCover key="h" {...NORTH} message={"Northbound Run Club\n120,000 SKR · 7 days · free"} height={160} tags={[{ text: "Featured", icon: "star-four-points" }, { text: "closes in 2d", icon: "alarm" }]} press={coverPress} />,
        <HScroller key="a" label="CLOSING SOON" seeAll cards={CLOSING} scroll={mv(hs1)} />,
        <HScroller key="b" label="BIGGEST POOLS" seeAll cards={BIGGEST} scroll={mv(hs2)} />,
      ]}
      overlay={<TabBar active="bounties" prev={prevTab} since={tabSince} />}
    />
  );
}
export function DetailH2({ pressAt }: { pressAt?: number }) {
  return (
    <Screen ambient="sky" bar={<NavBar title="Bounty" />}
      blocks={[
        <BountyCover key="c" {...NORTH} message={"Run 5k every day\nfor 7 days."} height={160} />,
        <RowList key="r" rows={[{ title: "Northbound", sub: "Verified · hosted 6 · paid out 310,400 SKR", chevron: true, leading: { kind: "initial", initial: "N", bg: "#3B82F6", fg: "#fff" } }]} />,
        <Breakdown key="b" rows={[{ label: "Pool", value: "120,000 SKR", color: color.lime.base }, { label: "Object", value: "Running shoe" }, { label: "Length", value: "7 days" }, { label: "Joins close", value: "in 1d 23h", color: color.red.base }, { label: "Entrants", value: "212" }, { label: "Rule", value: "Miss a day and you're out" }]} />,
        <ChipRow key="x"><Chip text="Verified Seeker" icon="check" tone="lime" tilt={-2} /><Chip text="80%+ kept rate · you 91%" icon="check" tone="lime" tilt={1} /></ChipRow>,
        <Banner key="e" tone="lime" icon="check-decagram" title="You're eligible" sub="Free to join. Survivors split the pool." />,
      ]}
      pinned={[<Button key="j" label="Join free" kind="l" icon="trophy-outline" press={pressAt} />]}
    />
  );
}
const NEW_OUT = [["Priya", "missed day 2", "now"], ["Omar", "missed day 2", "now"], ["Zoe", "missed day 2", "now"]];
const OUT = [["Marco", "missed day 2", "2h ago"], ["Lena", "missed day 2", "2h ago"], ["Kai", "missed day 1", "yesterday"]];
/** H3 joined: the "recently out" list grows as people drop (`outs` ms), the per-head share counts up. */
export function JoinedH3({ outs = [] }: { outs?: number[] }) {
  const ms = useMs();
  const gone = outs.filter((o) => ms >= o).length;
  const left = 212 - 8 - gone;
  return (
    <Screen ambient="sky" bar={<NavBar title="Northbound Run Club" right="Day 2/7" />}
      blocks={[
        <Title key="t" heading={`You're in.\n${left} of 212 still running.`} fs={30} pt={0} />,
        <OathCard key="c" icon="shoe-sneaker" name="Today's proof" meta="Running shoe · 2 photos" tags={[{ text: "0 of 2", icon: "camera", tone: "grey" }, { text: "14h left", icon: "alarm", tone: "red" }]} button={{ label: "Prove", icon: "camera" }} chevron={false} />,
        <KeeperPlacement key="k" mood="side" line={"Nine down already.\nMarco went first."} prop="whisper" size={92} side="r" height={106} />,
        <View key="o" style={{ gap: 6 }}>
          <Text variant="monoLabel" style={{ marginVertical: 2 }}>RECENTLY OUT</Text>
          {[...NEW_OUT.slice(0, gone).map((r, i) => ({ r, at: outs[i] })).reverse(), ...OUT.map((r) => ({ r, at: undefined as number | undefined }))].slice(0, 3).map(({ r: [n, s, tm], at }) => (
            <Pop key={n} delay={at ?? -1000} ms={450} ease="springHard"><Row title={n} sub={s} value={tm} valueColor={color.red.base} leading={{ kind: "initial", initial: n[0], bg: "#3A3A3A", fg: "#fff" }} /></Pop>
          ))}
        </View>,
        <MoneyMoment key="m" value={`≈ ${Math.round(120000 / left).toLocaleString("en-US")}`} caption={`SKR each if ${left} finish`} fs={40} tone="lime" />,
      ]}
    />
  );
}
export function EndedH5({ title = "Sol Strings", value = "+296", caption = "SKR, your share of 8,000" }: { title?: string; value?: string; caption?: string } = {}) {
  return (
    <Screen tone="lime" ambient="lime" bar={<NavBar title={title} close />} under={<FallingCoins at={1200} />}
      blocks={[
        <Title key="t" heading={"27 survived.\nYou're one of them."} fs={30} pt={6} />,
        <MoneyMoment key="m" value={value} caption={caption} tone="lime" />,
        <SeatSlots key="s" seats={[{ kind: "member", name: "You", status: value, avatar: MEMBER.Y.avatar, color: MEMBER.Y.color }, { kind: "member", name: "Riya", status: value, avatar: MEMBER.R.avatar, color: MEMBER.R.color }, { kind: "member", name: "Dev", status: value, avatar: MEMBER.D.avatar, color: MEMBER.D.color }, { kind: "overflow", count: 24 }]} />,
        <ButtonRow key="b"><Button label="Share card" kind="s" icon="share-variant" width={171} /><Button label="Follow @riffs" kind="s" icon="account-plus-outline" width={171} /></ButtonRow>,
      ]}
      pinned={[<Button key="c" label={`Claim ${value.replace("+", "")} SKR`} kind="l" icon="hand-coin-outline" />]}
      overlay={<CoinBurst at={0} y={260} />}
    />
  );
}
export function FundK2({ pickAt }: { pickAt?: number }) {
  return (
    <Screen ambient="vio" bar={<NavBar steps={[2, 5]} />}
      blocks={[
        <Title key="t" heading="Fund the pool." sub="Survivors split it equally at the end." pt={6} />,
        <MoneyMoment key="m" value="50,000" caption="SKR in the pool" tone="lime" />,
        <OptionGrid key="o" mode="chip" cols={4} items={[{ title: "10k" }, { title: "25k" }, { title: "50k" }, { title: "100k" }]} value={2} since={pickAt} />,
        <Breakdown key="b" rows={[{ label: "Pool", value: "50,000 SKR" }, { label: "KEPT fee (10%)", value: "5,000 SKR" }, { label: "You pay", value: "55,000 SKR", total: true }]} />,
      ]}
      pinned={[<Button key="n" label="Next" />]}
    />
  );
}
export const _b = { At, Pop, ev, View };
