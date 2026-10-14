// B · Today: B1 (the card deck, D-85), B5 daily recap sheet, + menu. Sample data as the real app's screenshots.
import React from "react";
import { View } from "../rn";
import { color, metrics, MEMBER, space } from "../theme";
import { At, E, ev, useMs, cl, Text, Icon } from "../motion";
import { Screen } from "../Screen";
import { AppHeader, BottomSheet, TabBar } from "../kit/chrome";
import type { TabKey } from "../kit/chrome";
import { Banner, BodyText, Button, ButtonRow, Title } from "../kit/basics";
import { OathCard } from "../kit/oath";
import type { OathCardProps } from "../kit/oath";
import { RowList } from "../kit/rows";
import { KeeperPlacement } from "../kit/keeper";

const pad2 = (n: number) => String(Math.floor(n)).padStart(2, "0");
export const clock = (secs: number) => `${pad2(secs / 3600)}:${pad2((secs % 3600) / 60)}:${pad2(secs % 60)}`;

export const IRON_WEEK: OathCardProps = {
  icon: "dumbbell", name: "Iron Week", meta: "with Riya, Arjun and Dev · Day 3/7", line: "Lift for 20 minutes. Photo 2 any time before midnight.",
  tags: [{ text: "1,043 SKR", icon: "sack", tone: "lime" }, { text: "9h 17m left", icon: "alarm", tone: "red" }, { text: "Photo 1 done", icon: "camera", tone: "vio" }],
  hp: 90, button: { label: "Take photo 2", icon: "camera" }, float: { text: "Riya kept", initial: "R", bg: MEMBER.R.color },
};
export const IRON_MORNING: OathCardProps = {
  ...IRON_WEEK, line: "Lift for 20 minutes. Two photos before midnight.",
  tags: [{ text: "1,043 SKR", icon: "sack", tone: "lime" }, { text: "14h 41m left", icon: "alarm", tone: "red" }], button: { label: "Prove", icon: "camera" },
};
const HYDRATE: OathCardProps = {
  icon: "bottle-soda-outline", name: "Hydrate Week", meta: "Bounty by Drift · Day 3/7",
  tags: [{ text: "31 of 40 in", icon: "account-group", tone: "grey" }, { text: "Not started", icon: "circle-outline", tone: "grey" }], button: { label: "Prove", icon: "camera", kind: "s" },
};
const DEV_OATH: OathCardProps = {
  icon: "water-outline", name: "Cold Mornings", meta: "with Riya and Arjun · Day 3/7", line: "Take a cold shower before breakfast. Two photos before midnight.",
  tags: [{ text: "500 SKR", icon: "sack", tone: "lime" }, { text: "5h 59m left", icon: "alarm", tone: "red" }], hp: 100, button: { label: "Prove", icon: "camera" },
};

/** CardDeck: the top card swipes off left at `swipes[i]` (220 ms in), the card behind grows into place. */
function CardDeck({ cards, swipes = [], h = 318, pressAt }: { cards: OathCardProps[]; swipes?: number[]; h?: number; pressAt?: number }) {
  const ms = useMs();
  const n = cards.length;
  const done = swipes.filter((s) => ms >= s + 260).length;
  const cur = swipes[done];
  const drag = cur !== undefined ? ev(ms, cur, 260, E.linear) : 0;
  const W = 350;
  const in1 = metrics.card.stack1.inset, in2 = metrics.card.stack2.inset, y1 = metrics.card.stack1.top, y2 = metrics.card.stack2.top;
  const pose = (d: number) => ({ inset: d <= 0 ? 0 : d <= 1 ? in1 * d : in1 + (in2 - in1) * (d - 1), y: d <= 0 ? 0 : d <= 1 ? y1 * d : y1 + (y2 - y1) * (d - 1) });
  const slots = [2, 1, 0].map((depth) => {
    const idx = (done + depth) % n;
    const isTop = depth === 0;
    const d = Math.max(0, isTop ? 0 : depth - drag);
    const { inset, y } = pose(Math.min(2, d));
    const tx = isTop ? -W * 1.25 * E.inOut(drag) : 0;
    const scale = (W - 2 * inset) / W;
    const dim = d <= 0 ? 0 : d <= 1 ? 0.88 * d : 0.88 + 0.06 * (d - 1);
    return (
      <View key={`${idx}-${done + depth}`} style={{ position: "absolute", left: 0, right: 0, top: 0, height: h, zIndex: 3 - depth, transformOrigin: "50% 0%", transform: [{ translateX: tx }, { translateY: y }, { scale }, { rotate: `${(tx / W) * 8}deg` }], ...(isTop ? {} : { overflow: "hidden", borderRadius: metrics.card.radius }) }}>
        <OathCard {...cards[idx]} fill float={isTop && idx === 0 ? cards[idx].float : undefined} button={cards[idx].button ? { ...cards[idx].button!, press: isTop ? pressAt : undefined } : undefined} />
        {isTop ? null : <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, borderRadius: metrics.card.radius, backgroundColor: color.surface.stack1, opacity: dim }} />}
      </View>
    );
  });
  const i0 = done % n;
  return (
    <View>
      <View style={{ marginTop: 20, height: h }}>{slots}</View>
      <View style={{ marginTop: space[4], minHeight: 28, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: metrics.deck.dotGap }}>
        {Array.from({ length: n }, (_, k) => <View key={k} style={{ width: k === i0 ? metrics.deck.dotOn : metrics.deck.dot, height: metrics.deck.dot, borderRadius: 3, backgroundColor: k === i0 ? color.text.primary : color.line.strong }} />)}
      </View>
    </View>
  );
}

/** B1 Today, active. `secs`: the reset countdown at ms 0 (ticks down). */
export function TodayB1({ swipes, pressAt, secs0 = 9 * 3600 + 17 * 60 + 41, still, tab = "today", prevTab, tabSince, sheet, note, morning }: { swipes?: number[]; pressAt?: number; secs0?: number; still?: boolean; tab?: TabKey; prevTab?: TabKey; tabSince?: number; sheet?: React.ReactNode; note?: React.ReactNode; morning?: boolean }) {
  const ms = useMs();
  const secs = Math.max(0, secs0 - Math.floor(Math.max(0, ms) / 1000));
  return (
    <Screen
      still={still}
      bar={<AppHeader title="Today" hasNew />}
      bottomInset={104}
      blocks={[
        <BodyText key="t" text={`${morning ? "3 of 3" : "2 of 3"} left · resets in <m>${clock(secs)}</m>`} />,
        <Banner key="b" tone="lime" icon="hand-coin-outline" title="1,054 SKR ready to claim" sub="Hydra 14 ended Friday. Tap to claim it." chevron />,
        <CardDeck key="d" cards={[morning ? IRON_MORNING : IRON_WEEK, HYDRATE, DEV_OATH]} swipes={swipes} pressAt={pressAt} h={262} />,
        <RowList key="r" rows={[{ title: "Read 20 pages", sub: "Solo · Day 9/14 · HP 100", value: "kept", valueColor: color.lime.base, chevron: true, leading: { kind: "icon", icon: "book-open-variant" } }]} />,
      ]}
      overlay={<>{note}<TabBar active={tab} prev={prevTab} since={tabSince} />{sheet}</>}
    />
  );
}

/** B5 daily recap: the sheet over Today (sheet slides at `at`). */
export function RecapSheet({ at = 0 }: { at?: number }) {
  return (
    <BottomSheet at={at}>
      <At at={at}>
        <View style={{ gap: 12 }}>
          <Text variant="monoLabel">YESTERDAY · SETTLED AT 00:00</Text>
          <Title heading={"Arjun blinked.\nYou didn't."} fs={30} pt={0} />
          <KeeperPlacement mood="side" line="Petty? Me? Never." prop="ledger" size={96} side="r" height={112} W={334} bubbleAt={450} />
          <RowList rows={[
            { title: "Iron Week", sub: "Arjun missed · HP 100 → 80 → 90", value: "+43 SKR", valueColor: color.lime.base, leading: { kind: "icon", icon: "dumbbell" } },
            { title: "Read 20 pages", sub: "You kept · HP 100", value: "safe", valueColor: color.text.secondary, leading: { kind: "icon", icon: "book-open-variant" } },
            { title: "Hydrate Week", sub: "2 knocked out · 33 of 40 in", value: "still in", valueColor: color.lime.base, leading: { kind: "icon", icon: "bottle-soda-outline" } },
          ]} />
          <ButtonRow><Button label="Open Iron Week" kind="s" width={163} /><Button label="Got it" width={163} /></ButtonRow>
        </View>
      </At>
    </BottomSheet>
  );
}
export const _x = { cl, Icon };
