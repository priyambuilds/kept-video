// The app's motion primitives (frontend/src/components/primitives/motion.tsx), driven by a screen clock
// instead of Reanimated: every primitive reads `ms` since its screen (or an <At> block) mounted, so the
// app's own choreography (motion.md) plays deterministically, frame by frame, at 1× speed.
import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { Easing } from "remotion";
import { RNText, View, css } from "./rn";
import type { StyleProp } from "./rn";
import { tokens, color, duration, metrics, tileForIcon, tile as tileFor, type as typeStyles, shadow } from "./theme";
import type { PaletteName, TypeName } from "./theme";
import icons from "./icons.json";

// ── Clock ──
const Clock = createContext(0);
export const useMs = () => useContext(Clock);
/** Children see time relative to `at` (ms after the enclosing clock's zero): a block that appears later. */
export function At({ at, children }: { at: number; children: ReactNode }) {
  const ms = useMs();
  return <Clock.Provider value={ms - at}>{children}</Clock.Provider>;
}
export function ClockRoot({ ms, children }: { ms: number; children: ReactNode }) {
  return <Clock.Provider value={ms}>{children}</Clock.Provider>;
}

// ── Easing ──
const bz = (k: string) => {
  const v = (tokens.motion.easing as unknown as Record<string, number[]>)[k];
  return Easing.bezier(v[0], v[1], v[2], v[3]);
};
export const E = {
  spring: bz("spring"), springSoft: bz("springSoft"), springHard: bz("springHard"), enter: bz("enter"),
  burst: bz("burst"), rise: bz("rise"), draw: bz("draw"),
  ease: Easing.bezier(0.25, 0.1, 0.25, 1), inOut: Easing.bezier(0.42, 0, 0.58, 1), out: Easing.bezier(0, 0, 0.58, 1),
  cubicOut: (x: number) => 1 - Math.pow(1 - x, 3), linear: (x: number) => x,
};
export type EaseName = "spring" | "springSoft" | "springHard" | "enter";
export const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** Eased progress of `ms` through [delay, delay + dur]. */
export const ev = (ms: number, delay: number, dur: number, e: (x: number) => number = E.linear) => e(cl((ms - delay) / Math.max(1, dur)));

// ── Keyframes ──
type P = { children?: ReactNode; style?: StyleProp };

/** kPop: scale .4 → 1.08 (65 %) → 1, opacity 0 → 1 (65 %). */
export function popValue(ms: number, delay = 0, dur: number = duration.pop, ease: EaseName = "spring") {
  const t = ms - delay, e = E[ease];
  if (t <= 0) return 0;
  const a = dur * 0.65;
  return t < a ? 0.65 * e(t / a) : 0.65 + 0.35 * e(cl((t - a) / (dur * 0.35)));
}
export function Pop({ children, delay = 0, ms: dur = duration.pop, ease = "spring", style }: P & { delay?: number; ms?: number; ease?: EaseName }) {
  const v = popValue(useMs(), delay, dur, ease);
  const scale = v <= 0.65 ? 0.4 + (0.68 * v) / 0.65 : 1.08 - (0.08 * (v - 0.65)) / 0.35;
  return <View style={[style, { opacity: Math.min(1, v / 0.65), transform: [{ scale }] }]}>{children}</View>;
}
export const enterDelay = (i: number) => 40 + 65 * i;
/** kInA: opacity 0 → 1, translateY 16 → 0, scale .98 → 1 over 500 ms `enter`. */
export function Enter({ children, index = 0, delay, style }: P & { index?: number; delay?: number }) {
  const p = ev(useMs(), delay ?? enterDelay(index), duration.enter, E.enter);
  return <View style={[style, { opacity: cl(p), transform: [{ translateY: 16 * (1 - p) }, { scale: 0.98 + 0.02 * p }] }]}>{children}</View>;
}
export function FadeIn({ children, delay = 0, ms: dur = 300, rise = 10, style }: P & { delay?: number; ms?: number; rise?: number }) {
  const p = ev(useMs(), delay, dur, E.out);
  return <View style={[style, { opacity: p, transform: [{ translateY: rise * (1 - p) }] }]}>{children}</View>;
}
export function FadeOut({ children, delay = 0, ms: dur = 200, style }: P & { delay?: number; ms?: number }) {
  const p = ev(useMs(), delay, dur, E.out);
  return <View style={[style, { opacity: 1 - p }]}>{children}</View>;
}
/** kBub / kBubR (springHard). */
export function Bubble({ children, delay = 0, ms: dur = duration.bubble, tilted, style }: P & { delay?: number; ms?: number; tilted?: boolean }) {
  const v = ev(useMs(), delay, dur, E.springHard);
  const tr = tilted ? [{ scale: 0.6 + 0.4 * v }, { rotate: `${-6 + 10 * v}deg` }] : [{ translateY: 8 * (1 - v) }, { scale: 0.6 + 0.4 * v }];
  return <View style={[style, { opacity: cl(v), transform: tr }]}>{children}</View>;
}
export function NoteDrop({ children, origin, delay = 0, style }: P & { origin: string; delay?: number }) {
  const v = ev(useMs(), delay, duration.note, E.springSoft);
  return <View style={[{ transformOrigin: origin }, style, { opacity: cl(v), transform: [{ translateY: -16 * (1 - v) }, { scale: 0.72 + 0.28 * v }] }]}>{children}</View>;
}
/** Proof fail shake at `at` ms: 0 → −6 → 6 → −3 → 0 over 300 ms. */
export function Shake({ at, children, style }: P & { at?: number }) {
  const ms = useMs();
  let x = 0;
  if (at !== undefined && ms >= at && ms < at + 300) {
    const k = (ms - at) / 75, keys = [0, -6, 6, -3, 0], i = Math.floor(k);
    x = keys[i] + (keys[i + 1] - keys[i]) * (k - i);
  }
  return <View style={[style, { transform: [{ translateX: x }] }]}>{children}</View>;
}
type LoopKind = "beat" | "breath" | "float" | "spin" | "ping" | "glow";
export function loopValue(kind: LoopKind, ms: number, period?: number, delay = 0) {
  const per = period ?? { beat: duration.beat, breath: duration.breath, float: duration.float, spin: duration.spin, ping: duration.ping, glow: duration.glow }[kind];
  const t = ms - delay;
  if (t < 0) return 0;
  const ph = (t % per) / per;
  if (kind === "spin") return ph;
  if (kind === "ping") return E.out(ph);
  return E.inOut(ph < 0.5 ? ph * 2 : 2 - ph * 2);
}
export function Loop({ kind, period, delay = 0, children, style }: P & { kind: LoopKind; period?: number; delay?: number }) {
  const v = loopValue(kind, useMs(), period, delay);
  const a = kind === "beat" ? { opacity: 1 - 0.6 * v } : kind === "breath" ? { transform: [{ translateY: -4 * v }] } : kind === "float" ? { transform: [{ translateY: -9 * v }] }
    : kind === "spin" ? { transform: [{ rotate: `${360 * v}deg` }] } : kind === "ping" ? { opacity: 0.7 * (1 - v), transform: [{ scale: 1 + 0.7 * v }] }
    : { opacity: 0.14 * (1 - Math.abs(2 * v - 1)), transform: [{ scale: 1 + 0.28 * v }] };
  return <View style={[style, a]}>{children}</View>;
}
/** Option select: rotate to `deg` over 250 ms `spring`, from `since` ms. */
export function Tilt({ deg, since = -1e6, children, style }: P & { deg: number; since?: number }) {
  const p = ev(useMs(), since, duration.optionTilt, E.spring);
  return <View style={[style, { transform: [{ rotate: `${deg * p}deg` }] }]}>{children}</View>;
}
/** Pressable look: scale down while pressed. `press`: start ms of each press. */
export function pressScale(ms: number, press: number | number[] | undefined, scale: number = metrics.button.pressScale) {
  if (press === undefined) return 1;
  let s = 1;
  for (const p of Array.isArray(press) ? press : [press]) {
    const t = ms - p;
    if (t < 0 || t > 300) continue;
    s = Math.min(s, t < 90 ? 1 - (1 - scale) * (t / 90) : t < 160 ? scale : scale + (1 - scale) * cl((t - 160) / 140));
  }
  return s;
}
export function PressScale({ children, press, scale, style }: P & { press?: number | number[]; scale?: number }) {
  const s = pressScale(useMs(), press, scale);
  return <View style={[style, s !== 1 ? { transform: [{ scale: s }] } : null]}>{children}</View>;
}

// ── Count-up (900 ms ease-out cubic), keeping prefix/suffix ──
export const COUNT_UP_MS = 900;
export function countText(text: string, ms: number, from?: string, delay = 0, dur = COUNT_UP_MS) {
  const m = text.match(/^([^\d]*)([\d,]+)(.*)$/);
  if (!m || /:/.test(text)) return text;
  const target = parseInt(m[2].replace(/,/g, ""), 10);
  const start = from ? parseInt(from.replace(/[^\d]/g, "") || "0", 10) : 0;
  const p = E.cubicOut(cl((ms - delay) / dur));
  return m[1] + Math.round(start + (target - start) * p).toLocaleString("en-US") + m[3];
}
export function CountText({ text, from, delay = 0, dur, ...rest }: { text: string; from?: string; delay?: number; dur?: number } & Omit<TextProps, "children">) {
  const shown = countText(text, useMs(), from, delay, dur);
  return <Text {...rest} style={[{ fontVariant: ["tabular-nums"] }, ...(Array.isArray(rest.style) ? rest.style : [rest.style])]}>{shown}</Text>;
}

// ── Text ──
export interface TextProps { variant?: TypeName | string; color?: string; align?: string; style?: StyleProp; children?: ReactNode; numberOfLines?: number }
export function Text({ variant = "label", color: c, align, style, children, numberOfLines }: TextProps) {
  return <RNText numberOfLines={numberOfLines} style={[typeStyles[variant as string], c ? { color: c } : null, align ? { textAlign: align } : null, style]}>{children}</RNText>;
}
/** Body text with inline <m> mono spans (and <m class="r"> red). */
export function RichText({ text, variant = "body", baseColor, style }: { text: string; variant?: TypeName | string; baseColor?: string; style?: StyleProp }) {
  const parts = text.split(/(<m(?: class="r")?>.*?<\/m>)/).filter(Boolean);
  return (
    <Text variant={variant} {...(baseColor ? { color: baseColor } : {})} style={style}>
      {parts.map((p, i) => {
        const m = p.match(/^<m( class="r")?>(.*)<\/m>$/);
        if (!m) return <React.Fragment key={i}>{p}</React.Fragment>;
        return <RNText key={i} style={{ fontFamily: "Geist Mono", fontWeight: 600, color: m[1] ? color.red.base : color.text.primary }}>{m[2]}</RNText>;
      })}
    </Text>
  );
}

// ── Icon: the app's own icon font (kept-icons.ttf, MDI glyphs) ──
const GLYPHS = icons as Record<string, number>;
export function Icon({ name, size, color: c = color.text.primary }: { name: string; size: number; color?: string }) {
  const cp = GLYPHS[name];
  return (
    <span style={{ display: "block", position: "relative", width: size, height: size, flexShrink: 0, fontFamily: "kept-icons", fontSize: size, lineHeight: `${size}px`, color: cp ? c : "red", textAlign: "center", fontWeight: 400, letterSpacing: 0 }}>
      {cp ? String.fromCodePoint(cp) : "?"}
    </span>
  );
}

// ── Surfaces ──
/** A rounded surface: fill or gradient, outer + inset shadow, optional overlay (card sheen), clip. */
export function Surface({ radius, bg, gradient, shadow: sh, overlay, style, children, clip }: { radius: number; bg?: string; gradient?: string; shadow?: string; overlay?: string; style?: StyleProp; children?: ReactNode; clip?: boolean }) {
  const layers = [overlay, gradient].filter(Boolean).join(", ");
  return (
    <View style={[{ borderRadius: radius, backgroundColor: gradient ? undefined : bg, backgroundImage: layers || undefined, boxShadow: sh, overflow: clip ? "hidden" : undefined }, style]}>
      {children}
    </View>
  );
}
export function Tile({ icon, size = metrics.card.tile, iconSize = metrics.card.tileIcon, radius = metrics.card.tileRadius, palette, tilt = metrics.card.tileTilt }: { icon: string; size?: number; iconSize?: number; radius?: number; palette?: PaletteName; tilt?: number }) {
  const p = palette ? tileFor(palette) : tileForIcon(icon);
  return (
    <View style={{ transform: [{ rotate: `${tilt}deg` }] }}>
      <Surface radius={radius} gradient={p.gradient} shadow={shadow("tile3d")} style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={iconSize} color={p.ink} />
      </Surface>
    </View>
  );
}
export function InitialTile({ initial, bg, size, radius, textSize }: { initial: string; bg: string; size: number; radius: number; textSize: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: radius, backgroundColor: bg, alignItems: "center", justifyContent: "center" }}>
      <Text color={color.text.onLime} style={{ fontSize: textSize, lineHeight: textSize + 2, fontWeight: 700 }}>{initial}</Text>
    </View>
  );
}
/** The Check-K mark. `draw` (0..1) trims the check stroke; `stem`/`leg` fade (splash reveal). */
export function CheckK({ size, variant = "dark", stroke, draw = 1, stem = 1, leg = 1 }: { size: number; variant?: "dark" | "ink"; stroke?: number; draw?: number; stem?: number; leg?: number }) {
  const sw = stroke ?? (size <= 32 ? 16 : 15);
  const side = variant === "ink" ? color.text.onLime : color.text.paper;
  const check = variant === "ink" ? color.text.onLime : color.lime.base;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: "block", flexShrink: 0 }}>
      <path d="M54 45L78 76" fill="none" stroke={side} strokeWidth={sw} strokeLinecap="round" opacity={leg} />
      {draw > 0 ? <path d="M23 44L40 60L78 24" fill="none" stroke={check} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" pathLength={100} strokeDasharray={`${draw * 100} 200`} /> : null}
      <path d="M23 24V76" fill="none" stroke={side} strokeWidth={sw} strokeLinecap="round" opacity={stem} />
    </svg>
  );
}
export const absFill = { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 } as const;
export { css };
