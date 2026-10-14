// Port of frontend/src/components/content/Oath.tsx: HPBar, HPPanel (count, damage, heal), OathCard, DayMemberGrid.
import React from "react";
import { View } from "../rn";
import { color, gradient, hpSegmentColor, metrics, shadow, space, stagger } from "../theme";
import { At, CountText, Icon, InitialTile, Loop, Pop, Surface, Text, Tile, cl, ev, useMs, E } from "../motion";
import { Button, Tag } from "./basics";
import type { ButtonProps, ChipTone } from "./basics";

export function HPBar({ hp, empty = color.line.empty, animate = true }: { hp: number; empty?: string; animate?: boolean }) {
  const filled = Math.ceil(hp / 5);
  return (
    <View style={{ flexDirection: "row", gap: metrics.hpBar.gap }}>
      {Array.from({ length: metrics.hpBar.segments }, (_, i) => {
        const seg = <View style={{ flex: 1, height: metrics.hpBar.height, borderRadius: metrics.hpBar.radius, backgroundColor: hpSegmentColor(i, hp, empty) }} />;
        return animate && i < filled ? <Pop key={i} delay={300 + i * stagger.cardSeg} ms={300} style={{ flex: 1 }}>{seg}</Pop> : <View key={i} style={{ flex: 1 }}>{seg}</View>;
      })}
    </View>
  );
}

/**
 * HPPanel. `from` + `at`: an HP change seen at `at` ms (motion.md §2–3): damage counts down and the lost
 * segments empty (200 ms) and ring red, beating; a heal pops the new segments left → right.
 */
export function HPPanel({ hp, lostToday = 0, note, warn, from, at = 0 }: { hp: number; lostToday?: number; note?: string; warn?: string; from?: number; at?: number }) {
  const ms = useMs();
  const changed = from !== undefined && from !== hp;
  const before = changed && ms < at;
  const shownHp = before ? from! : hp;
  const filled = shownHp / 5;
  const danger = shownHp <= 20;
  const damage = changed && from! > hp && !before;
  const heal = changed && from! < hp && !before;
  const fromFilled = (from ?? 0) / 5;
  return (
    <View style={{ padding: metrics.hpPanel.pad, borderRadius: metrics.hpPanel.radius, backgroundColor: color.surface[1], boxShadow: `inset 0 0 0 1px ${color.line.hairline2}` }}>
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: space[6] }}>
        <Text variant="monoLabel" color={color.text.secondary}>OATH HP</Text>
        <View style={{ flex: 1 }} />
        {changed ? <CountText text={String(hp)} from={String(from)} delay={at} variant="hpNumber" color={danger ? color.red.base : color.text.primary} />
          : <CountText text={String(hp)} variant="hpNumber" color={danger ? color.red.base : color.text.primary} />}
        <Text variant="label" color={color.text.tertiary}>/ 100</Text>
      </View>
      <View style={{ marginTop: metrics.hpPanel.mt, flexDirection: "row", gap: metrics.hpPanel.gap }}>
        {Array.from({ length: metrics.hpBar.segments }, (_, i) => {
          const lostNow = damage && i >= filled && i < fromFilled;
          const lost = lostNow || (!before && i >= filled && i < filled + lostToday / 5);
          const last = danger && i === Math.ceil(filled) - 1;
          const segStyle = { height: metrics.hpPanel.height, borderRadius: metrics.hpPanel.segRadius, backgroundColor: hpSegmentColor(i, shownHp, color.line.emptyDark), ...(lost ? { boxShadow: `inset 0 0 0 ${metrics.hpPanel.lostRing}px ${color.red.base}` } : {}) };
          const seg = <View style={segStyle} />;
          const body = lostNow ? (
            <View>
              {seg}
              <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, borderRadius: metrics.hpPanel.segRadius, backgroundColor: hpSegmentColor(i, from!, color.line.emptyDark), opacity: 1 - ev(ms, at + 200, 200, E.out) }} />
            </View>
          ) : seg;
          if (lost || last) return <At key={i} at={lost ? at + 400 : 0}><Loop kind="beat" style={{ flex: 1 }}>{body}</Loop></At>;
          if (heal) return i >= fromFilled && i < filled ? <Pop key={i} delay={at + 200 + (i - Math.floor(fromFilled)) * stagger.hpSeg} ms={300} style={{ flex: 1 }}>{seg}</Pop> : <View key={i} style={{ flex: 1 }}>{seg}</View>;
          if (changed) return <View key={i} style={{ flex: 1 }}>{seg}</View>;
          return i < filled ? <Pop key={i} delay={200 + i * stagger.hpSeg} ms={300} style={{ flex: 1 }}>{seg}</Pop> : <View key={i} style={{ flex: 1 }}>{seg}</View>;
        })}
      </View>
      {note ? <Text variant="caption" style={{ marginTop: metrics.hpPanel.mt }}>{note}</Text> : null}
      {warn ? <Warn text={warn} bg={color.red.tint14} icon="heart-broken" /> : null}
    </View>
  );
}

export function Warn({ text, bg, icon = "alert-outline" }: { text: string; bg: string; icon?: string }) {
  return (
    <View style={{ marginTop: metrics.card.sectionGap, paddingHorizontal: metrics.card.warnPadX, paddingVertical: metrics.card.warnPadY, borderRadius: metrics.card.warnRadius, backgroundColor: bg, flexDirection: "row", alignItems: "center", gap: space[6] }}>
      <Icon name={icon} size={metrics.card.warnIcon} color={color.red.base} />
      <Text variant="chipMd" color={color.red.base} style={{ flexShrink: 1 }}>{text}</Text>
    </View>
  );
}

export interface OathCardProps {
  icon: string; name: string; meta: string; chevron?: boolean; line?: string;
  tags?: { text: string; icon?: string; tone?: ChipTone }[]; hp?: number; warn?: string; button?: Omit<ButtonProps, "size">;
  float?: { text: string; initial: string; bg: string; delay?: number }; tilt?: number; variant?: "default" | "sm" | "lime"; dim?: boolean; fill?: boolean;
}
export function OathCard(p: OathCardProps) {
  const v = p.variant ?? "default";
  const bg = v === "lime" ? { bg: color.lime.tint07 } : v === "sm" ? { bg: color.surface[1] } : { gradient: gradient("card") };
  const sh = v === "lime" ? `inset 0 0 0 1.5px ${color.lime.ring45}` : v === "sm" ? `inset 0 0 0 1px ${color.line.hairline2}` : shadow("card");
  const card = (
    <Surface radius={metrics.card.radius} {...bg} shadow={sh} {...(v === "default" ? { overlay: gradient("cardSheen") } : {})} style={[{ padding: metrics.card.pad }, p.fill ? { flex: 1 } : null]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: metrics.card.gap }}>
        <Tile icon={p.icon} />
        <View style={{ flex: 1 }}>
          <Text variant="cardName">{p.name}</Text>
          <Text variant="caption">{p.meta}</Text>
        </View>
        {p.chevron !== false ? <Icon name="chevron-right" size={metrics.card.chevron} color={color.text.tertiary} /> : null}
      </View>
      {p.line ? <Text variant="cardLine" style={{ marginTop: metrics.card.sectionGap }}>{p.line}</Text> : null}
      {p.tags?.length ? (
        <View style={{ marginTop: p.line ? space[10] : space[12], flexDirection: "row", flexWrap: "wrap", gap: space[6] }}>
          {p.tags.map((tg) => <Tag key={tg.text} {...tg} />)}
        </View>
      ) : null}
      {p.hp !== undefined ? (
        <View style={{ marginTop: metrics.card.sectionGap }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: space[6] }}>
            <Text variant="caption">Oath HP</Text>
            <Text variant="monoValue" color={p.hp <= 20 ? color.red.base : color.text.primary}>{`${p.hp} / 100`}</Text>
          </View>
          <HPBar hp={p.hp} />
        </View>
      ) : null}
      {p.warn ? <Warn text={p.warn} bg={color.red.tint12} /> : null}
      {p.fill && p.button ? <View style={{ flexGrow: 1 }} /> : null}
      {p.button ? <View style={{ marginTop: metrics.card.sectionGap }}><Button {...p.button} size="card" width={318} /></View> : null}
    </Surface>
  );
  return (
    <View style={[{ opacity: p.dim ? metrics.card.dimOpacity : 1, transform: [{ rotate: `${p.tilt ?? 0}deg` }] }, p.fill ? { flex: 1 } : null]}>
      {v === "default" ? <Loop kind="breath" style={p.fill ? { flex: 1 } : undefined}>{card}</Loop> : card}
      {p.float ? (
        <Pop delay={p.float.delay ?? 600} ms={550} style={{ position: "absolute", right: metrics.card.float.right, top: metrics.card.float.top }}>
          <View style={{ height: metrics.card.float.h, paddingLeft: metrics.card.float.padL, paddingRight: metrics.card.float.padR, borderRadius: metrics.card.float.radius, backgroundColor: color.text.primary, flexDirection: "row", alignItems: "center", gap: space[6], transform: [{ rotate: `${metrics.card.float.tilt}deg` }], boxShadow: shadow("float") }}>
            <InitialTile initial={p.float.initial} bg={p.float.bg} size={metrics.card.float.avatar} radius={metrics.card.float.avatarRadius} textSize={11} />
            <Text variant="chipMd" color={color.text.onLime}>{p.float.text}</Text>
          </View>
        </Pop>
      ) : null}
    </View>
  );
}

type CellState = "k" | "m" | "p" | "h" | "r" | "x" | "f";
const gc = color.gridCell as Record<string, { bg: string; fg: string }>;
const CELL: Record<CellState, { bg: string; fg: string; icon: string | null; ring?: string; beat?: number }> = {
  k: { bg: gc.kept.bg, fg: gc.kept.fg, icon: "check-bold" },
  m: { bg: gc.missed.bg, fg: gc.missed.fg, icon: "close-thick", ring: color.red.base },
  p: { bg: "transparent", fg: gc.pending.fg, icon: "timer-sand", ring: color.line.toggleOff, beat: 1800 },
  h: { bg: gc.half.bg, fg: gc.half.fg, icon: "circle-half-full", ring: color.extra.halfRing },
  r: { bg: gc.review.bg, fg: gc.review.fg, icon: "eye-outline", beat: 1800 },
  x: { bg: gc.broke.bg, fg: gc.broke.fg, icon: "fire", beat: 900 },
  f: { bg: gc.future.bg, fg: "transparent", icon: null },
};
export interface GridMember { key: string; name: string; initial: string; color: string; cells: string; highlight?: number }
/** `changes`: a cell that flips state at `at` ms (pops in with the new state). */
export function DayMemberGrid({ days, today, members, changes = [] }: { days: number; today: number; members: GridMember[]; changes?: { row: number; col: number; to: CellState; at: number }[] }) {
  const ms = useMs();
  const big = days > 7;
  const g = metrics.grid;
  const gap = big ? g.gapBig : g.gap;
  const cellH = big ? g.cellBig : g.cell;
  return (
    <View style={{ padding: g.pad, borderRadius: g.radius, backgroundColor: color.surface[1], boxShadow: `inset 0 0 0 1px ${color.line.hairline2}` }}>
      <View style={{ flexDirection: "row", gap, alignItems: "center" }}>
        <View style={{ width: big ? g.nameColBig : g.nameCol }} />
        {Array.from({ length: days }, (_, i) => (
          <Text key={i} variant="monoMicro" align="center" style={{ flex: 1, letterSpacing: 0 }} color={i + 1 === today ? color.text.primary : color.text.tertiary}>{String(i + 1)}</Text>
        ))}
      </View>
      {members.map((m, ri) => (
        <View key={m.key} style={{ flexDirection: "row", gap, alignItems: "center", marginTop: gap }}>
          <View style={{ width: big ? g.nameColBig : g.nameCol, flexDirection: "row", alignItems: "center", gap: space[6] }}>
            <InitialTile initial={m.initial} bg={m.color} size={g.chip} radius={g.chipRadius} textSize={10} />
            {big ? null : <Text variant="chip" numberOfLines={1} style={{ flex: 1 }}>{m.name}</Text>}
          </View>
          {Array.from({ length: days }, (_, i) => {
            const ch = changes.find((c) => c.row === ri && c.col === i && ms >= c.at);
            const st = (ch ? ch.to : (m.cells[i] ?? "f")) as CellState;
            const c = CELL[st] ?? CELL.f;
            const cell = (
              <View style={{ height: cellH, borderRadius: big ? g.cellRadiusBig : g.cellRadius, backgroundColor: c.bg, alignItems: "center", justifyContent: "center", ...(c.ring ? { boxShadow: `inset 0 0 0 ${g.ring}px ${c.ring}` } : {}) }}>
                {c.icon ? <Icon name={c.icon} size={big ? g.iconBig : g.icon} color={c.fg} /> : null}
              </View>
            );
            if (ch) return <Pop key={i} delay={ch.at} ms={350} style={{ flex: 1 }}>{cell}</Pop>;
            if (st === "k" || st === "m") return <Pop key={i} delay={250 + ri * stagger.gridRow + i * stagger.gridCol} ms={350} style={{ flex: 1 }}>{cell}</Pop>;
            if (c.beat) return <Loop key={i} kind="beat" period={c.beat} style={{ flex: 1 }}>{cell}</Loop>;
            return <View key={i} style={{ flex: 1 }}>{cell}</View>;
          })}
        </View>
      ))}
      <View style={{ marginTop: space[12], flexDirection: "row", flexWrap: "wrap", gap: g.legendGap }}>
        {([["kept", { backgroundColor: color.lime.base }], ["missed", { boxShadow: `inset 0 0 0 1.5px ${color.red.base}` }], ["pending", { boxShadow: `inset 0 0 0 1.5px ${color.extra.legendPending}` }], ["in review", { backgroundColor: color.extra.legendReview }]] as const).map(([k, sw]) => (
          <View key={k} style={{ flexDirection: "row", alignItems: "center", gap: space[5] }}>
            <View style={{ width: g.legendSwatch, height: g.legendSwatch, borderRadius: g.legendRadius, ...sw }} />
            <Text variant="micro" color={color.text.secondary}>{k}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
export const _cl = cl;
