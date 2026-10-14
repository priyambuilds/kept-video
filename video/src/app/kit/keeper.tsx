// The Keeper inside the app (keeper/KeeperUI.tsx): AppKeeper (the rig, clocked by the screen), the big
// KeeperPlacement (glow, floor shadow, bubble, chips, orbs), the KeeperNote that drops from the mark, KeeperMark.
import React, { useId } from "react";
import { View } from "../rn";
import { color, lin, metrics, shadow, space, tile } from "../theme";
import type { PaletteName } from "../theme";
import { Bubble, CheckK, Icon, Loop, NoteDrop, Text, useMs } from "../motion";
import { Chip } from "./basics";
import type { ChipTone } from "./basics";
import { KeeperSVG } from "../../keeper/KeeperSVG";
import type { FrameOver, KeeperAnimName, KeeperMood, KeeperPropName } from "../../keeper/rig";

/** The Keeper drawn at `size` dp wide (bust: square head). Rig time = screen ms + a per-instance phase. */
export function AppKeeper({ mood, prop = "none", anim = "idle", size, bust, phase = 0.7, over, t: tOverride }: { mood: KeeperMood; prop?: KeeperPropName; anim?: KeeperAnimName; size: number; bust?: boolean; phase?: number; over?: FrameOver; t?: number }) {
  const ms = useMs();
  const id = useId().replace(/:/g, "");
  const t = tOverride ?? Math.max(0.001, ms / 1000 + (anim === "popin" || anim === "peek" ? 0 : phase));
  const w = size, h = bust ? size : Math.round((size * 180) / 160);
  const pad = bust ? 0 : 14;
  return (
    <svg viewBox={bust ? "28 4 104 104" : `${-pad} ${-pad} ${160 + 2 * pad} ${180 + 2 * pad}`} width={bust ? w : w * (160 + 2 * pad) / 160} height={bust ? h : h * (180 + 2 * pad) / 180}
      style={{ display: "block", overflow: bust ? "hidden" : "visible", margin: bust ? 0 : -(pad * size) / 160, flexShrink: 0 }}>
      <KeeperSVG id={`ak${id}`} mood={mood} prop={prop} anim={anim} t={t} bust={bust} over={over} noFloor />
    </svg>
  );
}

function RadialGlow({ size, colour }: { size: number; colour: string }) {
  return <div style={{ width: size, height: size, borderRadius: "50%", background: `radial-gradient(closest-side, ${colour}, transparent)` }} />;
}

export interface KeeperChip { text: string; icon: string; x: number; y: number; tilt?: number; tone?: ChipTone }
export interface KeeperOrb { icon: string; x: number; y: number; size: number; palette: string; rotate: number; coin?: boolean }
const TONE: Record<string, ChipTone> = { l: "lime", r: "red", d: "dark", g: "g", o: "ora", w: "white", vio: "vio" };
export const chipTone = (c?: string): ChipTone => TONE[c ?? "g"] ?? "g";

function Orb({ o, i }: { o: KeeperOrb; i: number }) {
  const p = tile((o.palette in (color.tilePalette as object) ? o.palette : "white") as PaletteName);
  const r = o.coin ? o.size / 2 : Math.round(o.size * 0.28);
  return (
    <View pointerEvents="none" style={{ position: "absolute", left: o.x, top: o.y }}>
      <Loop kind="float" period={(5 + (i % 3)) * 1000} delay={i * 600}>
        <View style={{
          width: o.size, height: o.size, borderRadius: r, overflow: "hidden", alignItems: "center", justifyContent: "center", transform: [{ rotate: `${o.rotate}deg` }],
          backgroundImage: o.coin ? `radial-gradient(circle at 35% 30%, ${p.a}, ${p.b} 62%)` : `radial-gradient(circle at 0% 0%, ${p.a}, ${p.b} 140%)`,
          boxShadow: o.coin ? `inset 0 2px 0 ${color.extra.tileHi60}, inset 0 0 0 3px ${color.extra.tileHi18}, 0 5px 0 ${color.extra.coinDrop}, 0 16px 26px ${color.extra.orbShadow}`
            : `inset 0 2px 0 ${color.extra.tileHi60}, inset 0 -4px 0 ${color.extra.tileShade18}, 0 14px 28px ${color.extra.orbShadow}`,
        }}>
          <Icon name={o.icon} size={Math.round(o.size * 0.5)} color={p.ink} />
        </View>
      </Loop>
    </View>
  );
}

/** KeeperPlacement (`kp`) in a 350-wide column. `bubbleAt`: when the line pops (default 450 ms). */
export function KeeperPlacement({ mood, line, prop = "none", anim = "idle", size = 120, side = "l", height, chips = [], orbs = [], bubbleAt = metrics.keeperPlacement.bubbleDelay, W = 350, over, cycle }: {
  mood: KeeperMood; line?: string; prop?: KeeperPropName; anim?: KeeperAnimName; size?: number; side?: "l" | "r" | "c"; height?: number; chips?: KeeperChip[]; orbs?: KeeperOrb[]; bubbleAt?: number; W?: number; over?: FrameOver; cycle?: string;
}) {
  const kh = Math.round(size * 1.14);
  const h = height ?? kh + 12;
  const ky = h - kh - 2;
  const kx = side === "l" ? 0 : side === "r" ? W - size : Math.round((W - size) / 2);
  const gs = Math.round(size * 1.55);
  const glow = (color.keeperGlow as Record<string, string>)[mood];
  const tailRight = side !== "l";
  const kp = metrics.keeperPlacement;
  return (
    <View style={{ height: h, position: "relative" }}>
      <View pointerEvents="none" style={{ position: "absolute", left: Math.round(kx + size / 2 - gs / 2), top: Math.round(ky + size * 0.55 - gs / 2) }}><RadialGlow size={gs} colour={glow} /></View>
      {orbs.map((o, k) => <Orb key={k} o={o} i={k} />)}
      <View pointerEvents="none" style={{ position: "absolute", left: Math.round(kx + size * 0.15) - 9, top: h - kp.shadowH - 9, width: Math.round(size * 0.7) + 18, height: kp.shadowH + 18, borderRadius: "50%", backgroundImage: `radial-gradient(closest-side, ${color.extra.keeperShadow} 35%, transparent)` }} />
      <View style={{ position: "absolute", left: kx, top: ky }}><AppKeeper mood={mood} prop={prop} anim={anim} size={size} over={over} /></View>
      {chips.map((c, k) => (
        <View key={`${c.text}${k}`} pointerEvents="none" style={{ position: "absolute", left: c.x, top: c.y, zIndex: 4 }}>
          <Loop kind="float" period={kp.chipFloatMs} delay={k * 700}><Chip text={c.text} icon={c.icon} tone={c.tone} tilt={c.tilt ?? 0} /></Loop>
        </View>
      ))}
      {line ? (
        <View pointerEvents="none" style={{
          position: "absolute", zIndex: 5, maxWidth: side === "c" ? kp.centreBubbleMax : W - size - 2,
          top: side === "c" ? Math.max(0, ky - 4) : Math.max(0, ky + Math.round(size * 0.1)),
          ...(side === "l" ? { left: size - 6 } : side === "r" ? { right: size - 6 } : { left: 0 }),
        }}>
          <Bubble delay={bubbleAt} style={{ transformOrigin: tailRight ? "100% 100%" : "0% 100%" }}>
            <View style={{
              paddingHorizontal: kp.bubblePadX, paddingVertical: kp.bubblePadY,
              borderTopLeftRadius: kp.bubbleRadius, borderTopRightRadius: kp.bubbleRadius,
              borderBottomRightRadius: tailRight ? kp.bubbleTail : kp.bubbleRadius, borderBottomLeftRadius: tailRight ? kp.bubbleRadius : kp.bubbleTail,
              backgroundColor: color.text.primary, transform: [{ rotate: `${tailRight ? 2 : -3}deg` }], boxShadow: shadow("float"),
            }}>
              <Text variant="keeperLine" color={color.text.onLime}>
                {line}
                {cycle ? <span style={{ fontFamily: "Geist Mono", fontSize: 10, color: color.text.secondary }}>{`  ${cycle} ›`}</span> : null}
              </Text>
            </View>
          </Bubble>
        </View>
      ) : null}
    </View>
  );
}

export function KeeperMark({ hasNew }: { hasNew?: boolean }) {
  const h = metrics.header;
  return (
    <View style={{ width: h.markSize, height: h.markSize, borderRadius: h.markRadius, backgroundColor: color.surface[2], boxShadow: `inset 0 0 0 1px ${color.line.hairline2}`, alignItems: "center", justifyContent: "center" }}>
      <CheckK size={h.markIcon} stroke={16} />
      {hasNew ? <View style={{ position: "absolute", right: -3, top: -3, width: h.dot, height: h.dot, borderRadius: h.dot / 2, backgroundColor: color.lime.base, boxShadow: `0 0 0 ${h.dotRing}px ${color.bg.app}` }} /> : null}
    </View>
  );
}

/** KeeperNote: the paper card dropping from the mark (`note` 420 ms springSoft) at `at` ms. */
export function KeeperNote({ mood, line, anim = "idle", origin = "right", at = 0, top = 106 }: { mood: KeeperMood; line: string; anim?: KeeperAnimName; origin?: "left" | "right"; at?: number; top?: number }) {
  const k = metrics.keeperNote;
  const ms = useMs();
  if (ms < at) return null;
  return (
    <View style={{ position: "absolute", left: k.inset, right: k.inset, top, zIndex: 45 }}>
      <NoteDrop delay={at} origin={origin === "left" ? `${k.originX}px 0px` : `${390 - 2 * k.inset - k.originX}px 0px`}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: k.gap, paddingVertical: k.padY, paddingLeft: k.padL, paddingRight: k.padR, borderRadius: k.radius, backgroundColor: color.text.paper, boxShadow: shadow("note") }}>
          <View style={{ width: k.tile, height: k.tile, borderRadius: k.tileRadius, overflow: "hidden", alignItems: "center", justifyContent: "flex-end", backgroundImage: `radial-gradient(circle at 30% 20%, ${color.extra.keeperNoteTile[0]}, ${color.extra.keeperNoteTile[1]} 75%)` }}>
            <AppKeeper mood={mood} anim={anim} bust size={k.tile} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space[5] }}>
              <CheckK size={k.eyebrowMark} variant="ink" stroke={18} />
              <Text variant="monoMicro" color={color.text.tertiary} style={{ letterSpacing: 1.2 }}>THE KEEPER</Text>
            </View>
            <Text variant="keeperNote" color={color.text.onLime} style={{ marginTop: 3 }}>{line}</Text>
          </View>
        </View>
      </NoteDrop>
    </View>
  );
}
export const _l = lin;
