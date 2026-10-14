// Port of frontend/src/components/content/Basics.tsx + actions/Button.tsx + actions/Shine.tsx.
import React from "react";
import type { ReactNode } from "react";
import { View } from "../rn";
import { color, duration, gradient, metrics, shadow, space, type as typeStyles } from "../theme";
import { E, Icon, Loop, PressScale, RichText, Surface, Text, cl, useMs } from "../motion";

export function Title({ heading, sub, fs = 30, align = "left", pt = space[8], color: hc = color.text.primary }: { heading: string; sub?: string; fs?: number; align?: "left" | "center"; pt?: number; color?: string }) {
  return (
    <View style={{ paddingTop: pt }}>
      <Text style={{ ...typeStyles.title, fontSize: fs, lineHeight: Math.round(fs * 1.1), letterSpacing: fs >= 40 ? -1.8 : -1.1, color: hc, textAlign: align }}>{heading}</Text>
      {sub ? <Text variant="body" align={align} style={{ marginTop: space[8] }}>{sub}</Text> : null}
    </View>
  );
}
export function BodyText({ text, mono }: { text: string; mono?: boolean }) {
  if (mono) return <Text variant="monoLabel" style={{ marginTop: space[4] }}>{text}</Text>;
  return <RichText text={text} variant="body" style={{ lineHeight: 21 }} />;
}
export function Note({ text, icon = "information-outline" }: { text: string; icon?: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "flex-start", gap: space[6], paddingHorizontal: metrics.note.padX }}>
      <Icon name={icon} size={metrics.note.icon} color={color.text.tertiary} />
      <Text variant="note" align="center" style={{ flexShrink: 1 }}>{text}</Text>
    </View>
  );
}
export function Banner({ tone, icon, title, sub, chevron }: { tone: "lime" | "red" | "vio" | "ora" | "grey"; icon: string; title: string; sub?: string; chevron?: boolean }) {
  const [bg, tile] = (color.bannerTone as unknown as Record<string, string[]>)[tone];
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: metrics.banner.gap, padding: metrics.banner.pad, borderRadius: metrics.banner.radius, backgroundColor: bg }}>
      <View style={{ width: metrics.banner.tile, height: metrics.banner.tile, borderRadius: metrics.banner.tileRadius, backgroundColor: tile, alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={metrics.banner.icon} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="rowTitle">{title}</Text>
        {sub ? <Text style={{ ...typeStyles.label, fontSize: 13, lineHeight: 18, color: color.text.muted, marginTop: space[2] }}>{sub}</Text> : null}
      </View>
      {chevron ? <Icon name="chevron-right" size={metrics.row.chevron} /> : null}
    </View>
  );
}
export type ChipTone = "lime" | "red" | "vio" | "ora" | "grey" | "g" | "dark" | "white";
export function Chip({ text, icon, tone = "g", tilt = 0, small }: { text: string; icon?: string; tone?: ChipTone; tilt?: number; small?: boolean }) {
  const t = (color.chipTone as Record<string, { bg: string; fg: string; ring?: string; shadow?: string }>)[tone];
  const h = small ? metrics.card.tagH : metrics.chip.h;
  const ring = t.ring ? t.ring.replace(/^inset (\d+(?:\.\d+)?) /, "inset 0 0 0 $1px ") : undefined;
  const sh = t.shadow ? t.shadow.replace(/(\d+) (\d+) (\d+) /, "$1px $2px $3px ") : undefined;
  return (
    <View style={{
      height: h, paddingLeft: small ? metrics.card.tagPadL : metrics.chip.padL, paddingRight: small ? metrics.card.tagPadR : metrics.chip.padR,
      borderRadius: h / 2, backgroundColor: t.bg, flexDirection: "row", alignItems: "center", gap: small ? metrics.card.tagGap : metrics.chip.gap,
      transform: [{ rotate: `${tilt}deg` }], boxShadow: sh ?? ring,
    }}>
      {icon ? <Icon name={icon} size={small ? metrics.card.tagIcon : metrics.chip.icon} color={t.fg} /> : null}
      <Text variant="chip" color={t.fg} numberOfLines={1}>{text}</Text>
    </View>
  );
}
export const Tag = (p: { text: string; icon?: string; tone?: ChipTone }) => <Chip {...p} small />;
export function ChipRow({ children, justify = "flex-start" }: { children: ReactNode; justify?: "flex-start" | "center" }) {
  return <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[6], justifyContent: justify }}>{children}</View>;
}
export interface BreakdownRow { label: string; value: ReactNode; color?: string; total?: boolean }
export function Breakdown({ rows, label }: { rows: BreakdownRow[]; label?: string }) {
  return (
    <View>
      {label ? <Text variant="monoLabel" style={{ marginBottom: space[8] }}>{label}</Text> : null}
      <View style={{ paddingHorizontal: metrics.breakdown.padX, paddingVertical: metrics.breakdown.padY, borderRadius: metrics.breakdown.radius, backgroundColor: color.surface[1], boxShadow: `inset 0 0 0 1px ${color.line.hairline}` }}>
        {rows.map((r, i) => (
          <View key={i} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space[12], minHeight: r.total ? metrics.breakdown.totalH : metrics.breakdown.rowH, ...(i ? { borderTopWidth: 1, borderTopColor: color.line.hairline2 } : {}) }}>
            <Text variant="label" color={color.text.secondary}>{r.label}</Text>
            <Text style={{ fontWeight: r.total ? 700 : 600, fontSize: r.total ? 18 : 14, color: r.color ?? color.text.primary, fontVariant: ["tabular-nums"], textAlign: "right", flexShrink: 1 }}>{r.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
export function Segmented({ items, value }: { items: string[]; value: number }) {
  return (
    <View style={{ flexDirection: "row", padding: metrics.segmented.pad, borderRadius: metrics.segmented.radius, backgroundColor: color.surface[1], gap: metrics.segmented.gap }}>
      {items.map((t, i) => {
        const on = i === value;
        return (
          <View key={t} style={{ flex: 1, height: metrics.segmented.item, alignItems: "center", justifyContent: "center" }}>
            {on ? <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, borderRadius: metrics.segmented.itemRadius, backgroundColor: color.text.primary }} /> : null}
            <Text variant="chipMd" color={on ? color.text.onLime : color.text.secondary} numberOfLines={1}>{t}</Text>
          </View>
        );
      })}
    </View>
  );
}
export function SearchBar({ placeholder, filter }: { placeholder: string; filter?: boolean }) {
  return (
    <View style={{ height: metrics.search.h, borderRadius: metrics.search.radius, backgroundColor: color.surface[1], boxShadow: `inset 0 0 0 1px ${color.extra.hairline07}`, flexDirection: "row", alignItems: "center", gap: space[10], paddingHorizontal: metrics.search.padX }}>
      <Icon name="magnify" size={metrics.search.icon} color={color.text.secondary} />
      <Text variant="label" color={color.text.secondary} style={{ flex: 1, fontSize: 15 }}>{placeholder}</Text>
      {filter ? <Icon name="tune-variant" size={19} color={color.text.secondary} /> : null}
    </View>
  );
}
export const Spacer = ({ h }: { h: number }) => <View style={{ height: h }} />;

/** The shine sweep: a 40 % white strip, −120 % → 320 % by 55 % of the cycle, then rest. `w` = surface width. */
export function Shine({ w, period = duration.shine, delay = 1000, widthPct = 0.4 }: { w: number; period?: number; delay?: number; widthPct?: number }) {
  const ms = useMs() - delay;
  if (ms < 0) return null;
  const ph = (ms % period) / period;
  const p = ph < 0.55 ? E.inOut(ph / 0.55) : 1;
  const strip = w * widthPct;
  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, overflow: "hidden", borderRadius: "inherit" }}>
      <View style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: strip, backgroundImage: gradient("shine"), transform: [{ translateX: -1.2 * strip + p * 4.4 * strip }] }} />
    </View>
  );
}

export type ButtonKind = "p" | "l" | "s" | "t" | "d";
const KIND = {
  p: { gradient: gradient("buttonPrimary"), fg: color.text.onLime, shadow: shadow("buttonPrimary") },
  l: { gradient: gradient("buttonLime"), fg: color.text.onLime, shadow: shadow("buttonLime") },
  s: { bg: color.surface[2], fg: color.text.primary, shadow: `inset 0 0 0 1px ${color.line.hairline3}` },
  t: { bg: "transparent", fg: color.text.secondary },
  d: { bg: color.red.tint14, fg: color.red.base },
} as Record<ButtonKind, { gradient?: string; bg?: string; fg: string; shadow?: string }>;
export interface ButtonProps { label: string; kind?: ButtonKind; icon?: string; size?: "pinned" | "card" | "row"; disabled?: boolean; loading?: boolean; press?: number | number[]; width?: number }
export function Button({ label, kind = "p", icon, size = "pinned", disabled, loading, press, width = 350 }: ButtonProps) {
  const h = kind === "t" ? metrics.button.heightText : size === "card" ? metrics.button.heightCard : metrics.button.height;
  const k = KIND[kind];
  const fg = disabled ? color.extra.disabledFg : k.fg;
  return (
    <PressScale press={press}>
      <Surface radius={h / 2} {...(disabled ? { bg: color.surface[2] } : k.gradient ? { gradient: k.gradient } : { bg: k.bg })} {...(!disabled && k.shadow ? { shadow: k.shadow } : {})} clip style={{ height: h }}>
        <View style={{ height: h, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: metrics.button.gap, paddingHorizontal: metrics.button.gap * 2 }}>
          {loading ? <Loop kind="spin"><Icon name="loading" size={metrics.button.icon} color={fg} /></Loop> : (
            <>
              {icon ? <Icon name={icon} size={size === "row" ? metrics.button.rowIcon : metrics.button.icon} color={fg} /> : null}
              <Text style={[size === "row" ? typeStyles.buttonSm : typeStyles.button, { color: fg }]} numberOfLines={1}>{label}</Text>
            </>
          )}
        </View>
        {kind === "l" && !disabled && !loading ? <Shine w={width} /> : null}
      </Surface>
    </PressScale>
  );
}
export function RowButton({ label, kind = "s", press }: { label: string; kind?: ButtonKind; press?: number }) {
  const k = KIND[kind];
  return (
    <PressScale press={press}>
      <Surface radius={metrics.rowButton.radius} {...(k.gradient ? { gradient: k.gradient } : { bg: k.bg })} {...(k.shadow ? { shadow: k.shadow } : {})} style={{ height: metrics.rowButton.height, paddingHorizontal: metrics.rowButton.padX, justifyContent: "center" }}>
        <Text variant="chipMd" color={k.fg} numberOfLines={1}>{label}</Text>
      </Surface>
    </PressScale>
  );
}
export function ButtonRow({ children, direction = "row" }: { children: ReactNode; direction?: "row" | "column" }) {
  return (
    <View style={{ flexDirection: direction, gap: metrics.option.gap }}>
      {React.Children.map(children, (c) => (direction === "row" ? <View style={{ flex: 1 }}>{c}</View> : c))}
    </View>
  );
}
export const fadeIn = (ms: number, at: number, dur = 200) => cl((ms - at) / dur);
