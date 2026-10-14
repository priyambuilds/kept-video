// Port of content/Rows.tsx (RowList, Row, Toggle) and Inputs.tsx (OptionGrid, SentenceInput, SeatSlots, QRCard).
import React, { useMemo } from "react";
import type { ReactNode } from "react";
import QRCode from "qrcode";
import { View } from "../rn";
import { color, lin, metrics, shadow, space, tileForIcon } from "../theme";
import { CheckK, Icon, InitialTile, Pop, PressScale, Text, Tilt, ev, useMs, E } from "../motion";
import { Avatar } from "./Avatar";

export type RowLeading = { kind: "avatar"; config: string } | { kind: "initial"; initial: string; bg: string; fg?: string } | { kind: "icon"; icon: string; bg?: string; fg?: string } | { kind: "mark" };
export interface RowProps { title: string; sub?: string; leading?: RowLeading; value?: string; valueColor?: string; valueSub?: string; chevron?: boolean; toggle?: boolean; trailing?: ReactNode; titleColor?: string; bg?: string; minHeight?: number; press?: number }
const TILE_SHADE = `inset 0 1.5px 0 ${color.extra.tileHi22}, inset 0 -2px 0 ${color.extra.tileShade20}`;
function Leading({ l }: { l: RowLeading }) {
  const box = { width: metrics.row.tile, height: metrics.row.tile, borderRadius: metrics.row.tileRadius, overflow: "hidden", alignItems: "center", justifyContent: "center" };
  if (l.kind === "avatar") return <View style={box}><Avatar config={l.config} size={metrics.row.tile} /></View>;
  if (l.kind === "initial") return <View style={[box, { backgroundColor: l.bg }]}><Text style={{ fontSize: 15, fontWeight: 700 }} color={l.fg ?? color.text.onLime}>{l.initial}</Text></View>;
  if (l.kind === "mark") return <View style={[box, { backgroundColor: color.lime.base }]}><CheckK size={30} variant="ink" /></View>;
  const mapped = !l.bg && !l.fg ? tileForIcon(l.icon) : null;
  const known = mapped && mapped.ink !== "#131313";
  return (
    <View style={[box, { backgroundColor: l.bg ?? color.surface[4], boxShadow: TILE_SHADE, backgroundImage: known ? mapped!.gradient : undefined }]}>
      <Icon name={l.icon} size={20} color={l.fg ?? (known ? mapped!.ink : color.text.primary)} />
    </View>
  );
}
export function Row(p: RowProps) {
  return (
    <PressScale press={p.press}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: metrics.row.gap, minHeight: p.minHeight ?? metrics.row.minH, paddingVertical: metrics.row.padY, paddingLeft: metrics.row.padL, paddingRight: metrics.row.padR, borderRadius: metrics.row.radius, backgroundColor: p.bg ?? color.surface[1], boxShadow: `inset 0 0 0 1px ${color.line.hairline}` }}>
        {p.leading ? <Leading l={p.leading} /> : null}
        <View style={{ flex: 1 }}>
          <Text variant="rowTitle" color={p.titleColor ?? color.text.primary}>{p.title}</Text>
          {p.sub ? <Text variant="caption" style={{ marginTop: space[2] }}>{p.sub}</Text> : null}
        </View>
        {p.value || p.valueSub ? (
          <View style={{ alignItems: "flex-end" }}>
            {p.value ? <Text variant="rowTitle" color={p.valueColor ?? color.text.primary} style={{ fontSize: 14, fontVariant: ["tabular-nums"] }}>{p.value}</Text> : null}
            {p.valueSub ? <Text variant="micro">{p.valueSub}</Text> : null}
          </View>
        ) : null}
        {p.trailing}
        {p.chevron ? <Icon name="chevron-right" size={metrics.row.chevron} color={color.text.tertiary} /> : null}
        {p.toggle !== undefined ? <Toggle on={p.toggle} /> : null}
      </View>
    </PressScale>
  );
}
export function RowList({ rows, label }: { rows: RowProps[]; label?: string }) {
  return (
    <View style={{ gap: metrics.row.listGap }}>
      {label ? <Text variant="monoLabel" style={{ marginVertical: space[2] }}>{label}</Text> : null}
      {rows.map((r, i) => <Row key={`${r.title}-${i}`} {...r} />)}
    </View>
  );
}
export function Toggle({ on }: { on: boolean }) {
  return (
    <View style={{ width: metrics.toggle.w, height: metrics.toggle.h, borderRadius: metrics.toggle.radius, backgroundColor: on ? color.lime.base : color.line.toggleOff }}>
      <View style={{ position: "absolute", top: metrics.toggle.inset, left: metrics.toggle.inset, width: metrics.toggle.knob, height: metrics.toggle.knob, borderRadius: metrics.toggle.knob / 2, backgroundColor: on ? color.text.onLime : color.extra.toggleKnobOff, transform: [{ translateX: on ? metrics.toggle.on - metrics.toggle.inset : 0 }] }} />
    </View>
  );
}

type OptionMode = "tile" | "big" | "chip" | "row2" | "row";
const MODE = {
  tile: { cols: 4, minH: 84, icon: 28, fs: 11, ls: 0, dir: "column", align: "center", justify: "center", padV: 10, padH: 4, gap: 6 },
  big: { cols: 3, minH: 124, icon: 0, fs: 46, ls: -2, dir: "column", align: "flex-start", justify: "flex-end", padV: 14, padH: 14, gap: 0 },
  chip: { cols: 0, minH: 64, icon: 0, fs: 20, ls: -0.6, dir: "column", align: "center", justify: "center", padV: 10, padH: 10, gap: 0 },
  row2: { cols: 2, minH: 128, icon: 28, fs: 18, ls: -0.4, dir: "column", align: "flex-start", justify: "space-between", padV: 16, padH: 16, gap: 10 },
  row: { cols: 1, minH: 80, icon: 26, fs: 17, ls: -0.3, dir: "row", align: "center", justify: "flex-start", padV: 14, padH: 16, gap: 14 },
} as const;
/** OptionGrid. `value` is selected from `since` ms (tilts in); before that `prev` (or none) is shown. */
export function OptionGrid({ items, value, since = -1e6, prev = -1, mode, cols, press }: { items: { title: string; sub?: string; icon?: string }[]; value: number; since?: number; prev?: number; mode: OptionMode; cols?: number; press?: number }) {
  const ms = useMs();
  const m = MODE[mode];
  const n = cols ?? (m.cols || items.length);
  const sel = ms >= since ? value : prev;
  const rows: { title: string; sub?: string; icon?: string }[][] = [];
  for (let i = 0; i < items.length; i += n) rows.push(items.slice(i, i + n));
  return (
    <View style={{ gap: metrics.option.gap }}>
      {rows.map((row, r) => (
        <View key={r} style={{ flexDirection: "row", gap: metrics.option.gap }}>
          {row.map((it, c) => {
            const i = r * n + c;
            const on = i === sel;
            const fg = on ? color.text.onLime : color.text.primary;
            return (
              <PressScale key={i} press={i === value ? press : undefined} style={{ flex: 1 }}>
                <Tilt deg={on ? (i % 2 ? metrics.option.tilt : -metrics.option.tilt) : 0} since={on && i === value ? since : -1e6} style={{
                  minHeight: m.minH, borderRadius: metrics.option.radius, paddingVertical: m.padV, paddingHorizontal: m.padH, flexGrow: 1,
                  flexDirection: m.dir, alignItems: m.align, justifyContent: m.justify, gap: m.gap,
                  backgroundColor: on ? color.text.primary : color.surface[1], boxShadow: on ? shadow("optionOn") : `inset 0 0 0 1px ${color.extra.hairline07}`,
                }}>
                  {it.icon && m.icon ? <Icon name={it.icon} size={m.icon} color={fg} /> : null}
                  <View style={{ flex: mode === "row" ? 1 : 0, minWidth: 0 }}>
                    <Text color={fg} align={m.align === "center" && mode !== "row" ? "center" : "left"} style={{ fontWeight: 600, fontSize: m.fs, lineHeight: Math.round(m.fs * 1.1), letterSpacing: m.ls }}>{it.title}</Text>
                    {it.sub ? <Text variant="caption" color={fg} style={{ opacity: 0.65, marginTop: 3 }}>{it.sub}</Text> : null}
                  </View>
                  {mode === "row" ? <Icon name={on ? "check-circle" : "circle-outline"} size={20} color={fg} /> : null}
                </Tilt>
              </PressScale>
            );
          })}
          {row.length < n ? Array.from({ length: n - row.length }, (_, k) => <View key={`pad${k}`} style={{ flex: 1 }} />) : null}
        </View>
      ))}
    </View>
  );
}

/** SentenceInput: prefix + typed value (`typed` chars shown) + lime caret, counter, suggestion chips. */
export function SentenceInput({ label, prefix, value, typed, max, suggestions = [], mono, focused = true, pick }: { label: string; prefix?: string; value: string; typed?: number; max?: number; suggestions?: string[]; mono?: boolean; focused?: boolean; pick?: { index: number; at: number } }) {
  const ms = useMs();
  const shown = value.slice(0, typed ?? value.length);
  const fs = prefix ? 22 : 20;
  const ring = focused ? color.lime.base : color.extra.hairline07;
  const caretOn = focused && Math.floor(ms / 530) % 2 === 0;
  const valueStyle = { fontFamily: mono ? "Geist Mono" : "Geist", fontWeight: 600, fontSize: fs, lineHeight: Math.round(fs * 1.25), letterSpacing: -0.6, color: color.text.primary };
  return (
    <View style={{ gap: space[10] }}>
      <View style={{ paddingHorizontal: metrics.input.padX, paddingVertical: metrics.input.padY, borderRadius: metrics.input.radius, backgroundColor: color.surface[1], boxShadow: `inset 0 0 0 ${metrics.input.ring}px ${ring}` }}>
        <Text variant="caption">{label}</Text>
        <View style={{ marginTop: space[6], display: "block" }}>
          <Text style={valueStyle}>
            {prefix ? <span style={{ color: color.text.tertiary }}>{prefix} </span> : null}
            {shown}
            <span style={{ display: "inline-block", width: 2, height: fs * 1.05, marginLeft: 1, verticalAlign: "-3px", backgroundColor: color.lime.base, opacity: caretOn ? 1 : 0 }} />
          </Text>
        </View>
        {max ? <Text variant="monoMicro" align="right" style={{ marginTop: space[6], fontSize: 11 }}>{`${shown.length} / ${max}`}</Text> : null}
      </View>
      {suggestions.length > 1 ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[6] }}>
          {suggestions.map((s, i) => {
            const on = s === shown;
            return (
              <PressScale key={s} press={pick?.index === i ? pick.at : undefined}>
                <View style={{ height: metrics.input.sugH, paddingHorizontal: metrics.input.sugPadX, borderRadius: metrics.input.sugRadius, justifyContent: "center", backgroundColor: on ? color.text.primary : color.surface[1], boxShadow: `inset 0 0 0 1px ${color.line.hairline3}` }}>
                  <Text variant="chipMd" color={on ? color.text.onLime : color.text.soft}>{s}</Text>
                </View>
              </PressScale>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

export type Seat = { kind: "member"; name: string; status?: string; avatar?: string; initial?: string; color: string; dim?: boolean; red?: boolean; at?: number } | { kind: "open" } | { kind: "overflow"; count: number };
/** SeatSlots: a member seat with `at` fills an open seat at that ms (avatar pops in). */
export function SeatSlots({ seats }: { seats: Seat[] }) {
  const ms = useMs();
  const s = metrics.seat;
  return (
    <View style={{ flexDirection: "row", gap: s.gap }}>
      {seats.map((seat0, i) => {
        const seat: Seat = seat0.kind === "member" && seat0.at !== undefined && ms < seat0.at ? { kind: "open" } : seat0;
        const tilt = seat.kind === "open" ? 0 : i % 2 ? s.tilt : -s.tilt;
        const box = { width: s.avatar, height: s.avatar, borderRadius: s.avatarRadius, overflow: "hidden", alignItems: "center", justifyContent: "center" };
        let tile, name, status;
        let nameColor: string = color.text.primary, statusColor: string = color.lime.base;
        if (seat.kind === "open") { tile = <View style={[box, { backgroundColor: color.surface[2] }]}><Icon name="plus" size={20} color={color.text.tertiary} /></View>; name = "Open seat"; nameColor = color.text.tertiary; }
        else if (seat.kind === "overflow") { tile = <View style={[box, { backgroundColor: color.surface[4] }]}><Text variant="cardName" style={{ fontWeight: 700 }}>{`+${seat.count}`}</Text></View>; name = "others"; nameColor = color.text.muted; }
        else {
          tile = (
            <View style={[box, { backgroundColor: seat.color, opacity: seat.dim ? 0.4 : 1, boxShadow: `inset 0 1.5px 0 ${color.extra.tileHi45}, inset 0 -3px 0 ${color.extra.tileShade15}` }]}>
              {seat.avatar ? <Avatar config={seat.avatar} size={s.avatar} /> : <InitialTile initial={seat.initial ?? ""} bg={seat.color} size={s.avatar} radius={s.avatarRadius} textSize={17} />}
            </View>
          );
          name = seat.name; status = seat.status;
          statusColor = seat.red ? color.red.base : seat.dim ? color.text.secondary : color.lime.base;
        }
        const delay = seat0.kind === "member" && seat0.at !== undefined ? seat0.at : 150 + i * 90;
        return (
          <View key={i} style={{ flex: 1, alignItems: "center", gap: space[6], paddingVertical: s.padY, paddingHorizontal: s.padX, borderRadius: s.radius, backgroundColor: seat.kind === "open" ? color.surface.sunken : color.surface[1], boxShadow: seat.kind === "open" ? `inset 0 0 0 ${s.ring}px ${color.line.emptyDark}` : `inset 0 0 0 1px ${color.line.hairline2}`, transform: [{ rotate: `${tilt}deg` }] }}>
            {seat.kind === "member" ? <Pop delay={delay} ms={450}>{tile}</Pop> : tile}
            <Text variant="chip" color={nameColor} numberOfLines={1}>{name}</Text>
            <Text variant="monoMicro" color={statusColor} numberOfLines={1} style={{ letterSpacing: 0 }}>{status ?? " "}</Text>
          </View>
        );
      })}
    </View>
  );
}

function qrPath(value: string) {
  const q = QRCode.create(value, { errorCorrectionLevel: "M" });
  const size = q.modules.size, data = q.modules.data;
  let d = "";
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    if (!data[y * size + x]) continue;
    let w = 1;
    while (x + w < size && data[y * size + x + w]) w++;
    d += `M${x} ${y}h${w}v1h${-w}z`;
    x += w - 1;
  }
  return { size, d };
}
export function QRCard({ code, link }: { code: string; link: string }) {
  const q = metrics.qr;
  const qr = useMemo(() => qrPath(link), [link]);
  const side = q.size - q.inner * 2;
  return (
    <View style={{ flexDirection: "row", gap: q.gap, alignItems: "center", padding: q.pad, borderRadius: q.radius, backgroundColor: color.surface[1] }}>
      <View style={{ width: q.size, height: q.size, padding: q.inner, borderRadius: q.codeRadius, backgroundColor: color.text.primary, transform: [{ rotate: `${q.tilt}deg` }], boxShadow: "0 10px 24px rgba(0,0,0,0.4)" }}>
        <svg width={side} height={side} viewBox={`0 0 ${qr.size} ${qr.size}`} style={{ display: "block" }}><path d={qr.d} fill={color.text.onLime} /></svg>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text variant="caption">Code</Text>
        <Text variant="monoCode" style={{ marginTop: space[2] }}>{code}</Text>
        <Text variant="caption" style={{ marginTop: space[12] }}>Link</Text>
        <Text variant="monoValue" numberOfLines={1} style={{ marginTop: space[2] }}>{link}</Text>
      </View>
    </View>
  );
}
export const _u = { lin, ev, E };
