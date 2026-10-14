// KEPT UI rebuilt as web React for the film (from frontend/src/components + design/components.md).
// All sizes are app dp; a scene scales the whole block (1 dp = `u` px). Values come from lib/theme.
import React from "react";
import { Img, staticFile } from "remotion";
import { ICONS } from "./icons.gen";
import { MONO, SANS, color, film, gradient, hpSegment, radius, shadow, tile } from "../lib/theme";
import type { TileName } from "../lib/theme";
import { clamp, ease, prog } from "../lib/anim";

export function Icon({ name, size = 20, fill = "currentColor", style }: { name: string; size?: number; fill?: string; style?: React.CSSProperties }) {
  const d = ICONS[name];
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: "block", flex: "none", ...style }}>
      {d ? <path d={d} fill={fill} /> : <rect width={24} height={24} fill="red" />}
    </svg>
  );
}

/** Check-K: stem M23 24V76, check M23 44L40 60L78 24, leg M54 45L78 76 (DESIGN §10). `draw` 0..1 per stroke. */
export function CheckK({ size, variant = "dark", stroke = 15, check = 1, stem = 1, leg = 1 }: { size: number; variant?: "dark" | "ink"; stroke?: number; check?: number; stem?: number; leg?: number }) {
  const lime = variant === "ink" ? color.text.onLime : color.lime.base;
  const bone = variant === "ink" ? color.text.onLime : color.text.paper;
  const seg = (d: string, c: string, p: number) => (
    <path d={d} fill="none" stroke={c} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" pathLength={100} strokeDasharray="100 100" strokeDashoffset={100 * (1 - clamp(p))} opacity={p > 0 ? 1 : 0} />
  );
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: "block", overflow: "visible" }}>
      {seg("M54 45L78 76", bone, leg)}
      {seg("M23 44L40 60L78 24", lime, check)}
      {seg("M23 24V76", bone, stem)}
    </svg>
  );
}

/** The lime brand tile with the ink Check-K (A0 splash / app icon). */
export function BrandTile({ size, check = 1, stem = 1, leg = 1 }: { size: number; check?: number; stem?: number; leg?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.25, background: gradient.brandTile, display: "grid", placeItems: "center",
      boxShadow: `inset 0 ${size * 0.03}px 0 rgba(255,255,255,0.6), inset 0 -${size * 0.05}px 0 rgba(0,0,0,0.16), 0 ${size * 0.2}px ${size * 0.45}px rgba(197,242,92,0.3)`,
    }}>
      <CheckK size={size * 0.8} variant="ink" stroke={15} check={check} stem={stem} leg={leg} />
    </div>
  );
}

export function Wordmark({ size, colour = color.text.paper }: { size: number; colour?: string }) {
  return <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: size, letterSpacing: (-2 / 44) * size, color: colour, lineHeight: 1 }}>KEPT</div>;
}

export type ChipTone = "lime" | "red" | "vio" | "ora" | "grey" | "g" | "dark" | "white";
export function Chip({ text, icon, tone = "g", tilt = 0, h = 30, fs = 12, style }: { text: React.ReactNode; icon?: string; tone?: ChipTone; tilt?: number; h?: number; fs?: number; style?: React.CSSProperties }) {
  const c = (color.chipTone as Record<string, { bg: string; fg: string }>)[tone];
  return (
    <div style={{
      height: h, padding: `0 ${h * 0.37}px 0 ${h * 0.3}px`, borderRadius: h / 2, background: c.bg, color: c.fg, display: "inline-flex", alignItems: "center", gap: h * 0.17,
      fontFamily: SANS, fontWeight: 600, fontSize: fs, letterSpacing: -0.2, transform: `rotate(${tilt}deg)`, whiteSpace: "nowrap",
      boxShadow: tone === "white" ? "0 8px 20px rgba(0,0,0,0.40)" : tone === "dark" ? "inset 0 0 0 1px rgba(255,255,255,0.10)" : undefined, ...style,
    }}>
      {icon ? <Icon name={icon} size={h * 0.47} fill={c.fg} /> : null}{text}
    </div>
  );
}

export function IconTile({ icon, palette, size = 40, tilt = -4, iconSize }: { icon: string; palette: TileName; size?: number; tilt?: number; iconSize?: number }) {
  const p = tile(palette);
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.3, background: p.bg, display: "grid", placeItems: "center", transform: `rotate(${tilt}deg)`, boxShadow: shadow("tile3d"), flex: "none" }}>
      <Icon name={icon} size={iconSize ?? size * 0.55} fill={p.ink} />
    </div>
  );
}

/** Member initial tile (DayMemberGrid row chip / seat), member colours from tokens. */
export const MEMBERS = {
  you: { name: "You", c: color.member.you },
  sam: { name: "Sam", c: color.member.riya },
  jo: { name: "Jo", c: color.member.arjun },
  alex: { name: "Alex", c: color.member.dev },
} as const;
export type MemberKey = keyof typeof MEMBERS;
export function MemberTile({ m, size = 44, tilt = 0, dim = false }: { m: MemberKey; size?: number; tilt?: number; dim?: boolean }) {
  const M = MEMBERS[m];
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.32, background: M.c, display: "grid", placeItems: "center", transform: `rotate(${tilt}deg)`,
      boxShadow: shadow("tile3d"), fontFamily: SANS, fontWeight: 700, fontSize: size * 0.42, color: color.text.onLime, opacity: dim ? 0.4 : 1, flex: "none",
    }}>{M.name[0]}</div>
  );
}

export function HPBar({ hp, shown = 20, h = 8, gap = 2, empty = color.hp.emptyOnCard, pop = 1 }: { hp: number; shown?: number; h?: number; gap?: number; empty?: string; pop?: number }) {
  return (
    <div style={{ display: "flex", gap }}>
      {Array.from({ length: 20 }, (_, i) => {
        const on = i < shown;
        return <div key={i} style={{ flex: 1, height: h, borderRadius: radius.xs, background: on ? hpSegment(i, hp, empty) : empty, transform: `scaleY(${on ? 1 : 1})`, opacity: i < shown || pop >= 1 ? 1 : 1 }} />;
      })}
    </div>
  );
}

export function Button({ label, kind = "p", icon, h = 54, press = 0, shine, style }: { label: string; kind?: "p" | "l" | "s"; icon?: string; h?: number; press?: number; shine?: number; style?: React.CSSProperties }) {
  const bg = kind === "l" ? gradient.buttonLime : kind === "p" ? gradient.buttonPrimary : color.surface[2];
  const fg = kind === "s" ? color.text.primary : color.text.onLime;
  return (
    <div style={{
      height: h, borderRadius: h / 2, background: bg, color: fg, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, position: "relative", overflow: "hidden",
      fontFamily: SANS, fontWeight: 600, fontSize: 16, letterSpacing: -0.2, boxShadow: kind === "l" ? shadow("buttonLime") : kind === "p" ? shadow("buttonPrimary") : "inset 0 0 0 1px rgba(255,255,255,0.08)",
      transform: `scale(${1 - 0.04 * press})`, ...style,
    }}>
      {icon ? <Icon name={icon} size={19} fill={fg} /> : null}{label}
      {shine !== undefined ? <div style={{ position: "absolute", top: 0, bottom: 0, width: "40%", left: `${-40 + shine * 160}%`, background: "linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0))" }} /> : null}
    </div>
  );
}

/** The card material (gradient + hairline + sheen + drop). */
export const cardStyle = (r = radius.card): React.CSSProperties => ({
  borderRadius: r, background: `${gradient.cardSheen}, ${gradient.card}`, boxShadow: shadow("card"), position: "relative",
});

/** OathCard (B1 / C7): tile, name, meta, line, tags, HP, button. */
export function OathCard({ w = 350, hp = 100, hpShown = 20, btn, btnPress = 0, line = true, stack = true, children }: { w?: number; hp?: number; hpShown?: number; btn?: string; btnPress?: number; line?: boolean; stack?: boolean; children?: React.ReactNode }) {
  return (
    <div style={{ width: w, position: "relative" }}>
      {stack ? <>
        <div style={{ position: "absolute", left: 22, right: 22, top: -20, height: 60, borderRadius: 24, background: color.surface.stack2, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", left: 11, right: 11, top: -10, height: 60, borderRadius: 25, background: color.surface.stack1, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)" }} />
      </> : null}
      <div style={{ ...cardStyle(), padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <IconTile icon="dumbbell" palette="lime" />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 17, color: color.text.primary, letterSpacing: -0.2 }}>Iron Week</div>
            <div style={{ fontFamily: SANS, fontSize: 12, color: color.text.secondary }}>with Sam, Jo and Alex · Day 1/7</div>
          </div>
          <Icon name="chevron-right" size={22} fill={color.text.tertiary} />
        </div>
        {line ? <div style={{ marginTop: 12, fontFamily: SANS, fontWeight: 500, fontSize: 16, lineHeight: "22px", color: color.text.primary, letterSpacing: -0.2 }}>Lift for 20 minutes. Two photos before midnight.</div> : null}
        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          <Chip text="1,000 SKR" icon="sack" tone="lime" h={24} fs={12} />
          <Chip text="7 days" icon="calendar-blank" tone="g" h={24} fs={12} />
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontFamily: SANS, fontSize: 12, color: color.text.secondary }}>
            <span>Oath HP</span><span style={{ fontFamily: MONO, fontWeight: 600, color: color.text.primary }}>{hp} / 100</span>
          </div>
          <HPBar hp={hp} shown={hpShown} />
        </div>
        {btn ? <div style={{ marginTop: 12 }}><Button label={btn} icon="camera" h={50} press={btnPress} /></div> : null}
        {children}
      </div>
    </div>
  );
}

/** One OptionGrid tile (C2 object tiles / C3 length / C4 stake). */
export function Option({ on, w, h, children, i = 0 }: { on: boolean; w: number; h: number; children: React.ReactNode; i?: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: 20, background: on ? "#FFFFFF" : color.surface[1], color: on ? color.text.onLime : color.text.primary,
      boxShadow: on ? shadow("optionOn") : "inset 0 0 0 1px rgba(255,255,255,0.07)", transform: `rotate(${on ? (i % 2 ? 2 : -2) : 0}deg) scale(${on ? 1.03 : 1})`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: SANS, flex: "none",
    }}>{children}</div>
  );
}

export function Coin({ size = 24, style }: { size?: number; style?: React.CSSProperties }) {
  return <Img src={staticFile("assets/money/coin-skr.svg")} style={{ width: size, height: size * 54 / 48, display: "block", ...style }} />;
}

export function Gesture({ name, size = 62, style }: { name: "victory-sign" | "open-palm" | "thumbs-up"; size?: number; style?: React.CSSProperties }) {
  return <Img src={staticFile(`assets/gestures/gesture-${name}.svg`)} style={{ width: size, height: size, display: "block", ...style }} />;
}

/** Count-up text (motion.md countUp: 900 ms ease-out cubic), tabular. */
export function count(t: number, t0: number, from: number, to: number, d = 0.9) {
  return Math.round(from + (to - from) * prog(t, t0, d, ease.cubicOut));
}
export const fmt = (n: number) => n.toLocaleString("en-US");
export { film };
