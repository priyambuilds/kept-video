// I · Profiles (I1 me, I2 Riya), W1 wallet, N1 inbox, W3 swap.
import React from "react";
import { View } from "../rn";
import { banner, color, MEMBER } from "../theme";
import { useMs } from "../motion";
import { Screen } from "../Screen";
import { AppHeader, NavBar, TabBar } from "../kit/chrome";
import type { TabKey } from "../kit/chrome";
import { Banner, Breakdown, Button, ButtonRow, Chip, ChipRow, Note } from "../kit/basics";
import { InboxList, ProfileCard } from "../kit/social";
import { RowList } from "../kit/rows";
import { KeptRateRing, MoneyMoment } from "../kit/status";
import { KeeperPlacement } from "../kit/keeper";
import { OathCard } from "../kit/oath";
import { OptionGrid } from "../kit/rows";

export function ProfileI1({ scroll = 0, ringAt = 300, prevTab, tabSince }: { scroll?: number; ringAt?: number; prevTab?: TabKey; tabSince?: number }) {
  return (
    <Screen scroll={scroll} bar={<AppHeader title="Profile" extra="cog-outline" />} bottomInset={104}
      blocks={[
        <ProfileCard key="p" name="sam.skr" handle="7xKp…3F9q" avatar={MEMBER.Y.avatar} bannerBg={banner(0)} verified bio="Lifting daily. Staking on myself." socials={[{ glyph: "X", text: "@samkeeps" }]} actions={[{ label: "Edit", icon: "pencil-outline" }, { label: "Share", icon: "share-variant" }]} />,
        <KeptRateRing key="r" percent={91} line="64 days · kept rate" delay={ringAt} dur={1400} />,
        <KeeperPlacement key="k" mood="wink" line={"I call you\nThe Early Bird."} prop="ledger" size={80} side="l" height={96} cycle="1/3" bubbleAt={ringAt + 900} />,
        <RowList key="s" rows={[
          { title: "Streak", sub: "Best: 21 days", value: "12", valueSub: "days", leading: { kind: "icon", icon: "fire", fg: color.orange.base } },
          { title: "Oaths", sub: "41 kept · 9 broken", value: "50", chevron: true, leading: { kind: "icon", icon: "cards-outline" } },
          { title: "Bounties", sub: "2 survived · 1 out", value: "3", chevron: true, leading: { kind: "icon", icon: "trophy-outline", fg: color.lime.base } },
        ]} />,
        <RowList key="v" rows={[{ title: "See how others see you", sub: "Oaths: Oath partners only", chevron: true, leading: { kind: "icon", icon: "eye-outline" } }]} />,
      ]}
      overlay={<TabBar active="profile" prev={prevTab} since={tabSince} />}
    />
  );
}
export function RiyaI2() {
  return (
    <Screen bar={<NavBar title="Riya" />}
      blocks={[
        <ProfileCard key="p" name="riya.skr" handle="4mQa…9Lw2" avatar={MEMBER.R.avatar} bannerBg="linear-gradient(135deg,#F472B6,#A78BFA)" bannerIcon="shoe-sneaker" verified bio="Morning runs, evening pages. Never broken an Oath." socials={[{ glyph: "X", text: "@riyaruns" }, { icon: "send-outline", text: "Telegram" }]} />,
        <KeptRateRing key="r" percent={94} line="71 days · kept rate" />,
        <RowList key="o" label="OATHS" rows={[{ title: "Dawn Run", sub: "Day 4/7 · 3 Keepers · HP 100", value: "Public", chevron: true, leading: { kind: "icon", icon: "shoe-sneaker" } }, { title: "Iron Week", sub: "With you · Day 3/7", value: "Shared", chevron: true, leading: { kind: "icon", icon: "dumbbell" } }]} />,
        <ChipRow key="c"><Chip text="3 Oaths together" icon="handshake-outline" tilt={-2} /><Chip text="Never broken" icon="shield-check-outline" tone="lime" tilt={2} /></ChipRow>,
      ]}
      pinned={[<Button key="i" label="Invite to an Oath" icon="account-plus-outline" />]}
    />
  );
}
export function WalletW1() {
  return (
    <Screen bar={<NavBar title="Wallet" />}
      blocks={[
        <KeeperPlacement key="k" mood="smug" line={"You left 1,107\non my table."} prop="sack" size={80} side="r" height={96} />,
        <MoneyMoment key="m" value="4,280" caption="SKR available · ≈ $42.80" fs={60} />,
        <ButtonRow key="b"><Button label="Add SKR" kind="l" icon="plus" width={171} /><Button label="Receive" kind="s" icon="qrcode" width={171} /></ButtonRow>,
        <OathCard key="c" variant="lime" icon="hand-coin-outline" name="1,107 SKR to claim" meta="Iron Week ended Tuesday" button={{ label: "Claim now", kind: "l", icon: "hand-coin-outline" }} />,
        <Breakdown key="r" label="BALANCES" rows={[{ label: "Available", value: "4,280 SKR" }, { label: "Locked in Oaths", value: "1,500 SKR · 2 Oaths" }, { label: "SOL for fees", value: "0.84 SOL" }]} />,
      ]}
    />
  );
}
export function InboxN1() {
  return (
    <Screen bar={<NavBar title="Inbox" mark />}
      blocks={[
        <InboxList key="n" label="NEEDS YOU · 3" items={[
          { id: "i", title: "Riya invited you to Dawn Run", sub: "7 days · 1,000 SKR each · Dev is in", time: "2h", lead: { kind: "avatar", config: MEMBER.R.avatar }, badge: { icon: "email-outline", palette: "vio" }, needsAction: true, unread: true, actions: [{ label: "Accept", kind: "l" }, { label: "Decline" }] },
          { id: "r", title: "Dev wants your vote", sub: "Iron Week · photo 2 failed 3 times · 41h left", time: "3h", lead: { kind: "avatar", config: MEMBER.D.avatar }, badge: { icon: "eye-outline", palette: "vio" }, needsAction: true, unread: true, actions: [{ label: "Review photo", kind: "p" }] },
          { id: "c", title: "1,107 SKR ready to claim", sub: "Iron Week ended Tuesday", time: "1d", lead: { kind: "keeper", mood: "smug" }, needsAction: true, unread: true, actions: [{ label: "Claim", kind: "l" }] },
        ]} />,
        <InboxList key="u" label="NEW" action="Mark all read" items={[
          { id: "n", title: "Riya nudged you", sub: "Iron Week · photo 2 is still due", time: "20m", lead: { kind: "avatar", config: MEMBER.R.avatar }, badge: { icon: "bell-ring", palette: "lime" }, unread: true },
          { id: "y", title: "Yesterday, settled", sub: "Arjun missed · +43 SKR to you", time: "00:01", lead: { kind: "keeper", mood: "side" }, unread: true },
        ]} />,
      ]}
    />
  );
}
export function SwapW3() {
  return (
    <Screen bar={<NavBar title="Swap" />}
      blocks={[
        <OptionGrid key="o" mode="chip" cols={4} items={[{ title: "0.1", sub: "SOL" }, { title: "0.25", sub: "SOL" }, { title: "0.5", sub: "SOL" }, { title: "1", sub: "SOL" }]} value={2} />,
        <MoneyMoment key="m" value="+4,950" caption="SKR you'll get" tone="lime" />,
        <Breakdown key="b" rows={[{ label: "You pay", value: "0.5 SOL" }, { label: "Rate", value: "1 SOL ≈ 9,900 SKR" }, { label: "Network fee", value: "0.000005 SOL" }]} />,
        <Note key="n" text="Swaps route through a public exchange." />,
      ]}
      pinned={[<Button key="s" label="Swap" kind="l" icon="swap-horizontal" />]}
    />
  );
}
export const _p = { View, useMs, Banner };
