// The common screen frame (layout/Screen.tsx): status bar, NavBar/AppHeader, a 350-wide column (x 20, gap 14)
// whose blocks enter top → bottom at 40 + 65·i ms, pinned actions 34 from the bottom entering at 200 + 65·i,
// the ambient light, and slots for the tab bar, sheets, toasts and the KeeperNote. 390 × 844 dp.
import React from "react";
import type { ReactNode } from "react";
import { View } from "./rn";
import { color, metrics } from "./theme";
import { Enter } from "./motion";
import { Ambient, StatusBar } from "./kit/chrome";
import type { Tone } from "./kit/chrome";

export const SCREEN_W = 390, SCREEN_H = 844;
export const STATUS_H = 40;

export interface ScreenProps {
  bar?: ReactNode;
  blocks?: ReactNode[];
  pinned?: ReactNode[];
  tone?: Tone | null;
  ambient?: "lime" | "red" | "ember" | "vio" | "sky" | null;
  beam?: boolean;
  /** Vertical scroll of the column, px. */
  scroll?: number;
  /** Over everything: tab bar, sheet, toast, note, fx. */
  overlay?: ReactNode;
  /** Under the column, over the light (e.g. falling coins). */
  under?: ReactNode;
  /** Skip the block entrance (a tab already on screen). */
  still?: boolean;
  bottomInset?: number;
  gap?: number;
}

export function Screen({ bar, blocks = [], pinned = [], tone, ambient, beam, scroll = 0, overlay, under, still, bottomInset = 0, gap = metrics.screen.gap }: ScreenProps) {
  const pinH = pinned.length ? metrics.pinned.bottom + pinned.length * 54 + (pinned.length - 1) * metrics.pinned.gap + metrics.screen.gap : 0;
  return (
    <View style={{ width: SCREEN_W, height: SCREEN_H, backgroundColor: color.bg.app, overflow: "hidden" }}>
      <Ambient tone={tone} ambient={ambient} beam={beam} />
      {under}
      <StatusBar />
      {bar ? <View style={{ paddingHorizontal: metrics.screen.padX, marginTop: metrics.screen.barGap }}>{bar}</View> : null}
      <View style={{ flex: 1, overflow: "hidden", marginBottom: pinH }}>
        <View style={{ paddingHorizontal: metrics.screen.padX, paddingTop: metrics.screen.contentTop, gap, paddingBottom: 28 + bottomInset, transform: [{ translateY: -scroll }] }}>
          {blocks.filter(Boolean).map((b, i) => (still ? <View key={i} style={{ gap }}>{b}</View> : <Enter key={i} index={i} style={{ gap }}>{b}</Enter>))}
        </View>
      </View>
      {pinned.length ? (
        <View style={{ position: "absolute", left: metrics.pinned.x, right: metrics.pinned.x, bottom: metrics.pinned.bottom, gap: metrics.pinned.gap, zIndex: 20 }}>
          {pinned.map((p, i) => (still ? <View key={i}>{p}</View> : <Enter key={i} delay={200 + 65 * i}>{p}</Enter>))}
        </View>
      ) : null}
      {overlay}
      <View pointerEvents="none" style={{ position: "absolute", bottom: 8, left: 195 - 54, width: 108, height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.55)", zIndex: 70 }} />
    </View>
  );
}
