// The app theme for the web port: frontend/src/theme/index.ts + supplement.ts, read from the same
// design/tokens.json. Gradients are CSS strings; type tokens are RN-style objects the rn.tsx shim converts.
import tokens from "../../../design/tokens.json";
import { metrics } from "./metrics";

export { tokens, metrics };

const extra = {
  disabledFg: "#5A5A5A", toggleKnobOff: "#9A9A9A", hairline07: "rgba(255,255,255,0.07)",
  tileHi22: "rgba(255,255,255,0.22)", tileHi35: "rgba(255,255,255,0.35)", tileHi45: "rgba(255,255,255,0.45)",
  tileShade15: "rgba(0,0,0,0.15)", tileShade20: "rgba(0,0,0,0.20)", tileHi60: "rgba(255,255,255,0.60)", tileHi18: "rgba(255,255,255,0.18)",
  tileShade18: "rgba(0,0,0,0.18)", coinDrop: "rgba(60,80,10,0.90)", orbShadow: "rgba(0,0,0,0.45)",
  legendPending: "#4A4A4A", legendReview: "rgba(167,139,250,0.5)", halfRing: "rgba(197,242,92,0.5)",
  uploadRing: "#333333", uploadHatchA: "#171717", uploadHatchB: "#1A1A1A",
  camPill: "rgba(0,0,0,0.6)", camPillCheck: "rgba(0,0,0,0.65)", camPhotoPill: "rgba(255,255,255,0.12)", camCornerIdle: "rgba(255,255,255,0.65)",
  camObject: "rgba(255,255,255,0.42)", camGradient: ["#2A2A2E", "#0A0A0B"],
  onCover28: "rgba(0,0,0,0.28)", decoWhite16: "rgba(255,255,255,0.16)", decoWhite20: "rgba(255,255,255,0.20)", decor: "#1E1E1E",
  toneWash: { lime: ["rgba(197,242,92,0.14)", 0.6], red: ["rgba(248,113,113,0.17)", 0.62], ember: ["rgba(251,146,60,0.18)", 0.6], emberBase: "#151010", grey: "rgba(0,0,0,0.30)" },
  beamGlow: "rgba(255,255,255,0.55)", keeperShadow: "rgba(0,0,0,0.6)", keeperNoteTile: ["#2A2A30", "#131313"],
  swatchRing: "rgba(255,255,255,0.15)", grabber: "rgba(255,255,255,0.25)", skeleton: "#1C1C1C", transparent: "transparent",
} as const;

export const color = { ...tokens.color, text: { ...tokens.color.text, tertiary: "#808080" }, extra };
export const space = tokens.space as Record<string | number, number>;
export const radius = tokens.radius;
export const duration = tokens.motion.duration;
export const stagger = tokens.motion.stagger;

type TypeTok = { family: string; size: number; lineHeight: number; weight: number; letterSpacing?: number; tabular?: boolean; case?: string; color?: string };
const resolve = (path: string): string => path.split(".").reduce<any>((o, k) => o?.[k], color) as string;
export const type: Record<string, Record<string, unknown>> = Object.fromEntries(
  Object.entries(tokens.type).map(([k, v]) => {
    const t = v as TypeTok;
    return [k, {
      fontFamily: t.family === "mono" ? "Geist Mono" : "Geist", fontWeight: t.weight, fontSize: t.size, lineHeight: t.lineHeight,
      letterSpacing: t.letterSpacing ?? -0.2, color: t.color ? resolve(t.color) : color.text.primary,
      ...(t.tabular ? { fontVariant: ["tabular-nums"] } : {}), ...(t.case === "upper" ? { textTransform: "uppercase" } : {}),
    }];
  }),
);
export type TypeName = keyof typeof tokens.type;

export const lin = (deg: number, cols: readonly string[], locs?: readonly number[]) =>
  `linear-gradient(${deg}deg, ${cols.map((c, i) => (locs ? `${c} ${locs[i] * 100}%` : c)).join(", ")})`;
type LinTok = { angle: number; stops: readonly (readonly [string, number])[] };
export function gradient(name: "card" | "cardSheen" | "buttonPrimary" | "buttonLime" | "moneyPill" | "brandTile" | "tabFade" | "shine") {
  const g = tokens.gradient[name] as unknown as LinTok;
  return lin(g.angle, g.stops.map((s) => s[0]), g.stops.map((s) => s[1]));
}
export type PaletteName = "lime" | "vio" | "sky" | "pink" | "amber" | "orange" | "white";
export function tile(p: PaletteName) {
  const [a, b, ink] = (tokens.color.tilePalette as any)[p] as [string, string, string];
  return { gradient: lin(150, [a, b]), ink, a, b };
}
export function tileForIcon(icon: string) {
  const map = tokens.color.objectTile as Record<string, PaletteName | undefined>;
  return tile(map[icon] ?? "white");
}
export function heroCard(p: string) {
  const [a, b, fg] = (tokens.color.heroCardPalette as any)[p] as [string, string, string];
  return { gradient: lin(155, [a, b]), fg };
}
export const banner = (i: number) => lin(135, (tokens.color.banner as any)[i]);
export const shadow = (name: keyof typeof tokens.shadow) => tokens.shadow[name].css;

export function hpSegmentColor(i: number, hp: number, empty: string): string {
  const filled = hp / 5;
  if (i >= filled) return empty;
  if (hp <= 20) return tokens.color.hp.danger;
  if (hp <= 40) return tokens.color.hp.warn;
  const t = i / 19;
  return `rgb(${Math.round(94 + 103 * t)},${Math.round(234 + 8 * t)},${Math.round(212 - 120 * t)})`;
}

export const MEMBER = {
  Y: { name: "You", initial: "Y", color: tokens.color.member.you, avatar: "13050010" },
  R: { name: "Riya", initial: "R", color: tokens.color.member.riya, avatar: "26142321" },
  A: { name: "Arjun", initial: "A", color: tokens.color.member.arjun, avatar: "34323434" },
  D: { name: "Dev", initial: "D", color: tokens.color.member.dev, avatar: "45201205" },
} as const;
export type MemberKey = keyof typeof MEMBER;
export const fmt = (v: number) => Math.round(v).toLocaleString("en-US");
