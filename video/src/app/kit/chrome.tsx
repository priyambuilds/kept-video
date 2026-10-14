// Port of chrome/Header.tsx, TabBar.tsx, Overlays.tsx, Ambient.tsx and brand/Brand.tsx, plus the Android
// status bar the real app keeps (screenshots: time left, signal/wifi/battery right). No DEVNET/DEMO badges:
// this is the launch build.
import React from "react";
import type { ReactNode } from "react";
import { View } from "../rn";
import { color, duration, gradient, metrics, shadow, space } from "../theme";
import { CheckK, CountText, E, FadeIn, Icon, Pop, PressScale, Surface, Text, cl, ev, loopValue, useMs } from "../motion";
import { KeeperMark } from "./keeper";

export function StatusBar({ time = "9:41", dark = true }: { time?: string; dark?: boolean }) {
  const fg = dark ? color.text.primary : color.text.onLime;
  return (
    <View style={{ height: 40, paddingHorizontal: 26, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      <Text style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2, color: fg }}>{time}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <svg width={16} height={16} viewBox="0 0 16 16" style={{ display: "block" }}><path d="M15 2 L15 14 L3 14 Z" fill={fg} opacity={0.35} /><path d="M11 6 L11 14 L3 14 Z" fill={fg} /></svg>
        <svg width={17} height={16} viewBox="0 0 24 24" style={{ display: "block" }}><path d="M12 21 L23.6 6.5 C20.4 4 16.4 2.5 12 2.5 C7.6 2.5 3.6 4 0.4 6.5 Z" fill={fg} /></svg>
        <svg width={10} height={17} viewBox="0 0 10 17" style={{ display: "block" }}><rect x={3} y={0} width={4} height={2} rx={0.6} fill={fg} /><rect x={0.6} y={1.6} width={8.8} height={14.8} rx={1.6} fill="none" stroke={fg} strokeWidth={1.2} opacity={0.5} /><rect x={1.8} y={4.6} width={6.4} height={10.6} rx={0.8} fill={fg} /></svg>
      </View>
    </View>
  );
}

function RoundButton({ icon, size, iconSize, press }: { icon: string; size: number; iconSize: number; press?: number }) {
  return (
    <PressScale press={press} scale={0.94}>
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color.surface[2], boxShadow: `inset 0 0 0 1px ${color.line.hairline2}`, alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={iconSize} />
      </View>
    </PressScale>
  );
}
/** BalanceChip; `from` + `at`: the balance counts from the old value and the chip bumps. */
export function BalanceChip({ amount, from, at = 0 }: { amount: string; from?: string; at?: number }) {
  const ms = useMs();
  const h = metrics.header;
  const t = ms - at;
  const bump = from && t > 0 && t < 300 ? 1 + 0.08 * Math.sin((t / 300) * Math.PI) : 1;
  return (
    <View style={{ transform: [{ scale: bump }], height: h.chipH, paddingLeft: h.chipPadL, paddingRight: h.chipPadR, borderRadius: h.chipH / 2, backgroundColor: color.surface[2], boxShadow: `inset 0 0 0 1px ${color.line.hairline2}`, flexDirection: "row", alignItems: "center", gap: space[6] }}>
      <Icon name="sack" size={h.chipIcon} color={color.lime.base} />
      {from ? <CountText text={amount} from={from} delay={at} variant="chipMd" style={{ fontSize: 14 }} /> : <Text variant="chipMd" style={{ fontSize: 14 }}>{amount}</Text>}
      <Icon name="plus-circle" size={h.chipPlus} color={color.text.tertiary} />
    </View>
  );
}
export function Bell({ count }: { count: number }) {
  const h = metrics.header;
  return (
    <View>
      <RoundButton icon="bell-outline" size={h.bell} iconSize={h.bellIcon} />
      {count > 0 ? (
        <View style={{ position: "absolute", top: h.badgeOffset, right: h.badgeOffset }}>
          <Pop ms={duration.pop} ease="springHard">
            <View style={{ minWidth: h.badgeMin, height: h.badgeMin, paddingHorizontal: space[4], borderRadius: h.badgeRadius, backgroundColor: color.lime.base, boxShadow: `0 0 0 ${h.dotRing}px ${color.bg.app}`, alignItems: "center", justifyContent: "center" }}>
              <Text variant="micro" color={color.text.onLime} style={{ fontSize: 11 }}>{String(count)}</Text>
            </View>
          </Pop>
        </View>
      ) : null}
    </View>
  );
}
export function AppHeader({ title, balance = "4,280", balanceFrom, balanceAt, unread = 3, extra, hasNew }: { title: string; balance?: string; balanceFrom?: string; balanceAt?: number; unread?: number; extra?: string; hasNew?: boolean }) {
  const h = metrics.header;
  return (
    <View style={{ height: h.height, flexDirection: "row", alignItems: "center", gap: h.gap }}>
      <KeeperMark hasNew={hasNew} />
      <Text variant="headerTitle" numberOfLines={1} style={{ marginLeft: h.titleMargin, flex: 1 }}>{title}</Text>
      <BalanceChip amount={balance} from={balanceFrom} at={balanceAt} />
      <Bell count={unread} />
      {extra ? <RoundButton icon={extra} size={h.extra} iconSize={h.extraIcon} /> : null}
    </View>
  );
}
export function StepBar({ current, total, since = -1e6 }: { current: number; total: number; since?: number }) {
  const ms = useMs();
  const k = ev(ms, since, duration.note - 20, E.out);
  return (
    <View style={{ flex: 1, flexDirection: "row", gap: metrics.nav.step.gap }}>
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        const lvl = n < current ? 2 : n === current ? 1 : 0;
        const prevLvl = n < current - 1 ? 2 : n === current - 1 ? 1 : 0;
        const q = prevLvl + (lvl - prevLvl) * k;
        return (
          <View key={i} style={{ flex: 1, height: metrics.nav.step.h, borderRadius: metrics.nav.step.radius, backgroundColor: color.line.empty, boxShadow: lvl === 1 ? `0 0 12px ${color.lime.ring45}` : undefined }}>
            <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, borderRadius: 3, backgroundColor: color.lime.base, opacity: cl(q) }} />
            <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, borderRadius: 3, backgroundColor: color.text.primary, opacity: cl(q - 1) }} />
          </View>
        );
      })}
    </View>
  );
}
export function NavBar({ title, steps, right, close, mark, stepSince, backPress }: { title?: string; steps?: [number, number]; right?: string; close?: boolean; mark?: boolean | "new"; stepSince?: number; backPress?: number }) {
  const n = metrics.nav;
  const label = right ?? (steps ? `${steps[0]}/${steps[1]}` : undefined);
  return (
    <View style={{ height: n.height, flexDirection: "row", alignItems: "center", gap: n.gap }}>
      <RoundButton icon={close ? "close" : "chevron-left"} size={n.back} iconSize={n.backIcon} press={backPress} />
      {steps ? <StepBar current={steps[0]} total={steps[1]} since={stepSince} /> : <Text variant="chipMd" color={color.text.muted} numberOfLines={1} align="center" style={{ flex: 1, fontSize: 14 }}>{title ?? ""}</Text>}
      <View style={{ minWidth: n.rightMin, alignItems: "flex-end" }}>{label ? <Text variant="monoLabel" color={color.text.secondary}>{label}</Text> : null}</View>
      {mark ? <KeeperMark hasNew={mark === "new"} /> : null}
    </View>
  );
}

export type TabKey = "today" | "oaths" | "bounties" | "profile";
const TABS: { key: TabKey; icon: string; label: string }[] = [
  { key: "today", icon: "white-balance-sunny", label: "Today" }, { key: "oaths", icon: "cards-outline", label: "Oaths" },
  { key: "bounties", icon: "trophy-outline", label: "Bounties" }, { key: "profile", icon: "account-circle-outline", label: "Profile" },
];
/** TabBar + PlusButton + fade. `prev`/`since`: animates the active pill from the previous tab. */
export function TabBar({ active, prev, since = -1e6, plusPress, tabPress }: { active: TabKey; prev?: TabKey; since?: number; plusPress?: number; tabPress?: number }) {
  const ms = useMs();
  const m = metrics.tabBar;
  const k = prev ? ev(ms, since, duration.flex, E.ease) : 1;
  const g = loopValue("glow", ms);
  return (
    <>
      <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: m.fade, backgroundImage: gradient("tabFade"), zIndex: 18 }} />
      <View style={{ position: "absolute", left: m.left, right: m.right, bottom: m.bottom, height: m.height, borderRadius: m.radius, backgroundColor: color.surface[1], padding: m.pad, gap: m.gap, flexDirection: "row", zIndex: 20, boxShadow: shadow("tabBar") }}>
        {TABS.map((tab) => {
          const p = tab.key === active ? k : tab.key === prev ? 1 - k : 0;
          const on = p > 0.5;
          const fg = on ? color.text.onLime : color.text.secondary;
          return (
            <PressScale key={tab.key} press={tab.key === active ? tabPress : undefined} style={{ flex: `${1 + (m.activeFlex - 1) * p} 1 0%` }}>
              <View style={{ height: m.item, borderRadius: m.itemRadius, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: m.labelGap, overflow: "hidden" }}>
                <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, borderRadius: m.itemRadius, backgroundColor: color.text.primary, opacity: p }} />
                <Icon name={tab.icon} size={m.icon} color={fg} />
                {tab.key === active ? <View style={{ opacity: p }}><Text variant="tab" color={fg} numberOfLines={1}>{tab.label}</Text></View> : null}
              </View>
            </PressScale>
          );
        })}
      </View>
      <View style={{ position: "absolute", right: m.left, bottom: m.bottom, zIndex: 20 }}>
        <PressScale press={plusPress} scale={0.95}>
          <View style={{ position: "absolute", width: m.plus, height: m.plus, borderRadius: m.plus / 2, backgroundColor: color.lime.base, opacity: 0.14 * (1 - Math.abs(2 * g - 1)), transform: [{ scale: 1 + (18 * (1 - Math.abs(2 * g - 1))) / m.plus }] }} />
          <View style={{ width: m.plus, height: m.plus, borderRadius: m.plus / 2, backgroundColor: color.lime.base, alignItems: "center", justifyContent: "center", boxShadow: shadow("plus") }}>
            <Icon name="plus" size={m.plusIcon} color={color.text.onLime} />
          </View>
        </PressScale>
      </View>
    </>
  );
}

/** BottomSheet: slides up over the scrim (enter, 300 ms) from `at`; closes from `closeAt`. */
export function BottomSheet({ at = 0, closeAt, children }: { at?: number; closeAt?: number; children: ReactNode }) {
  const ms = useMs();
  const dur = duration.note - 120;
  const p = ev(ms, at, dur, E.enter) * (closeAt !== undefined ? 1 - ev(ms, closeAt, dur, E.enter) : 1);
  if (p <= 0) return null;
  const s = metrics.sheet;
  return (
    <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, zIndex: 24 }}>
      <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: color.scrim, opacity: p }} />
      <View style={{ position: "absolute", left: s.inset, right: s.inset, bottom: s.inset, borderRadius: s.radius, backgroundColor: color.surface.sheet, opacity: cl(p * 1.4), transform: [{ translateY: (1 - p) * 844 * 0.4 }] }}>
        <View style={{ paddingTop: s.padTop, paddingBottom: space[8], alignItems: "center" }}>
          <View style={{ width: s.grabber[0], height: s.grabber[1], borderRadius: s.grabberRadius, backgroundColor: color.extra.grabber }} />
        </View>
        <View style={{ paddingHorizontal: s.padX, paddingBottom: s.padBottom, gap: space[12] }}>{children}</View>
      </View>
    </View>
  );
}
/** Toast: white pill popping in at the top at `at`, hiding after 1.9 s. */
export function Toast({ text, at }: { text: string; at: number }) {
  const ms = useMs();
  if (ms < at || ms > at + duration.toastHold + 200) return null;
  const out = 1 - ev(ms, at + duration.toastHold, 200);
  const m = metrics.toast;
  return (
    <View style={{ position: "absolute", top: m.top, left: 0, right: 0, alignItems: "center", zIndex: 60, opacity: out }}>
      <Pop delay={at} ms={duration.pop} ease="springHard">
        <View style={{ height: m.height, paddingLeft: m.padL, paddingRight: m.padR, borderRadius: m.radius, backgroundColor: color.text.primary, flexDirection: "row", alignItems: "center", gap: m.gap, boxShadow: shadow("toast") }}>
          <View style={{ width: m.disc, height: m.disc, borderRadius: m.disc / 2, backgroundColor: color.text.onLime, alignItems: "center", justifyContent: "center" }}><Icon name="check-bold" size={m.icon} color={color.lime.base} /></View>
          <Text variant="chipMd" color={color.text.onLime} style={{ fontSize: 14 }}>{text}</Text>
        </View>
      </Pop>
    </View>
  );
}

// ── Ambient light (DESIGN.md §2.8): tone wash, two drifting orbs, beam ──
export type Tone = "lime" | "red" | "ember" | "grey" | "lock";
export function Ambient({ tone, ambient, beam }: { tone?: Tone | null; ambient?: "lime" | "red" | "ember" | "vio" | "sky" | null; beam?: boolean }) {
  const ms = useMs();
  const A = metrics.ambient;
  const orbs = ambient ? (color.ambient as unknown as Record<string, string[]>)[ambient] : null;
  const low = ambient === "ember";
  const d1 = E.inOut(cl(ms / (duration.drift / 2))), d2 = 1 - E.inOut(cl((ms - 1500) / (A.orbB.ms / 2)));
  const wash = color.extra.toneWash as unknown as Record<string, [string, number]>;
  const beamO = 0.85 + 0.15 * Math.cos((ms / duration.beam) * Math.PI * 2);
  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, overflow: "hidden" }}>
      {tone === "grey" ? <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.30)" }} /> : null}
      {tone === "lock" ? <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundImage: `linear-gradient(180deg, ${color.bg.lock[0]}, ${color.bg.lock[1]})` }} /> : null}
      {tone && tone !== "grey" && tone !== "lock" ? (
        <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: tone === "ember" ? "#151010" : undefined, backgroundImage: `radial-gradient(farthest-corner at 50% ${tone === "ember" ? "100%" : "0%"}, ${wash[tone][0]}, transparent ${wash[tone][1] * 100}%)` }} />
      ) : null}
      {orbs ? <>
        <View style={{ position: "absolute", width: A.orbA.size, height: A.orbA.size, left: A.orbA.left, top: low ? A.orbA.topLow : A.orbA.top, borderRadius: "50%", backgroundImage: `radial-gradient(closest-side, ${orbs[0]}, transparent)`, transform: [{ translateX: A.drift.dx * d1 }, { translateY: A.drift.dy * d1 }, { scale: 1 + 0.18 * d1 }] }} />
        <View style={{ position: "absolute", width: A.orbB.size, height: A.orbB.size, right: A.orbB.right, top: low ? A.orbB.topLow : A.orbB.top, borderRadius: "50%", backgroundImage: `radial-gradient(closest-side, ${orbs[1]}, transparent)`, transform: [{ translateX: A.drift.dx * d2 }, { translateY: A.drift.dy * d2 }, { scale: 1 + 0.18 * d2 }] }} />
      </> : null}
      {beam ? <>
        <View style={{ position: "absolute", left: 195 - 160, top: -20, width: 320, height: 580, opacity: beamO, filter: "blur(7px)", clipPath: "polygon(43% 0, 57% 0, 100% 100%, 0 100%)", backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.05) 55%, rgba(255,255,255,0))" }} />
        <View style={{ position: "absolute", left: 195 - 65 - 33, top: -2 - 33, width: 130 + 66, height: 4 + 66, borderRadius: "50%", backgroundImage: `radial-gradient(closest-side, ${color.extra.beamGlow} 30%, transparent)` }} />
        <View style={{ position: "absolute", left: 195 - 65, top: -2, width: 130, height: 4, borderRadius: 2, backgroundColor: "#FFFFFF" }} />
      </> : null}
    </View>
  );
}

/** Splash (A0) per motion.md §1: tile pop 550, check draw at 350 (320 ms), stem 600, leg 750, KEPT 900, tagline 1050. */
export function BrandSplash() {
  const ms = useMs();
  const b = metrics.brand;
  const draw = ev(ms, 350, duration.drawCheck, E.enter), stem = ev(ms, 600, 250, E.enter), leg = ev(ms, 750, 250, E.enter);
  return (
    <View style={{ alignItems: "center", gap: space[18] }}>
      <Pop ms={duration.splashTile}>
        <Surface radius={b.splashRadius} gradient={gradient("brandTile")} shadow={`inset 0 1.5px 0 rgba(255,255,255,0.6), inset 0 -6px 0 rgba(0,0,0,0.14), 0 24px 60px ${color.lime.glow22}`} style={{ width: b.splashTile, height: b.splashTile, alignItems: "center", justifyContent: "center" }}>
          <CheckK size={b.splashMark} variant="ink" draw={draw} stem={stem} leg={leg} />
        </Surface>
      </Pop>
      <FadeIn delay={900} ms={400}><Text variant="wordmark">KEPT</Text></FadeIn>
      <FadeIn delay={1050} ms={400}><Text variant="label" color={color.text.secondary} style={{ fontSize: 15 }}>Keep your word.</Text></FadeIn>
    </View>
  );
}
export function BrandWord() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View style={{ marginLeft: -5, marginRight: -3 }}><CheckK size={metrics.brand.word} /></View>
      <Text variant="wordmarkSm">EPT</Text>
    </View>
  );
}
export function BrandStamp({ text }: { text: string }) {
  const b = metrics.brand;
  return (
    <View style={{ alignSelf: "center", flexDirection: "row", alignItems: "center", gap: space[8], paddingVertical: 7, paddingLeft: 7, paddingRight: 12, borderRadius: 15, backgroundColor: color.surface[1], boxShadow: `inset 0 0 0 1px ${color.line.hairline2}` }}>
      <View style={{ width: b.stampTile, height: b.stampTile, borderRadius: 7, backgroundColor: color.lime.base, alignItems: "center", justifyContent: "center" }}><CheckK size={b.stampMark} variant="ink" stroke={17} /></View>
      <Text variant="chipMd" style={{ fontWeight: 900, letterSpacing: -0.3 }}>KEPT</Text>
      <Text variant="monoMicro" color={color.text.secondary}>{text}</Text>
    </View>
  );
}
