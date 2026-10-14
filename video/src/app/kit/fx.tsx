// FX (motion.md §5/§7): the coin burst (14 coins from 183,430, angles −90° ± 13°·k, 260–440 dp, `burst` 1.3 s,
// 25 ms stagger), falling coins, value pills (kUp) and the screen flash of the shutter.
import React from "react";
import { View } from "../rn";
import { color, gradient } from "../theme";
import { E, Icon, Text, cl, useMs } from "../motion";

const rnd = (i: number, s: number) => { const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x); };
export function Coin({ size = 24 }: { size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundImage: "radial-gradient(circle at 35% 30%, #F4FFD0 0%, #C5F25C 52%, #8FB52E 100%)", boxShadow: "inset 0 0 0 3px rgba(255,255,255,0.25), 0 3px 0 #5E7A14", alignItems: "center", justifyContent: "center" }}>
      <View style={{ width: size * 0.56, height: size * 0.56, borderRadius: size, boxShadow: "inset 0 0 0 2px #8FB52E" }} />
    </View>
  );
}
export function CoinBurst({ at = 0, x = 183, y = 430, n = 14 }: { at?: number; x?: number; y?: number; n?: number }) {
  const ms = useMs();
  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, zIndex: 50 }}>
      {Array.from({ length: n }, (_, k) => {
        const t = (ms - at - k * 25) / 1300;
        if (t < 0 || t > 1) return null;
        const a = ((-90 + 13 * (k - n / 2) + (rnd(k, 1) - 0.5) * 8) * Math.PI) / 180;
        const d = 260 + rnd(k, 2) * 180;
        const p = E.burst(t);
        const op = t < 0.12 ? t / 0.12 : t < 0.75 ? 1 : 1 - (t - 0.75) / 0.25;
        return (
          <View key={k} style={{ position: "absolute", left: x - 12, top: y - 12, opacity: op, transform: [{ translateX: Math.cos(a) * d * p }, { translateY: Math.sin(a) * d * p + 160 * t * t }, { rotate: `${(rnd(k, 3) - 0.5) * 540 * p}deg` }, { scale: 0.3 + 0.7 * p }] }}>
            <Coin />
          </View>
        );
      })}
    </View>
  );
}
export function FallingCoins({ at = 1200, n = 12 }: { at?: number; n?: number }) {
  const ms = useMs();
  if (ms < at) return null;
  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, overflow: "hidden" }}>
      {Array.from({ length: n }, (_, k) => {
        const per = 2800 + rnd(k, 4) * 1800, t = ((ms - at + rnd(k, 5) * per) % per) / per;
        return <View key={k} style={{ position: "absolute", left: rnd(k, 6) * 370, top: -80 + 1000 * t, opacity: 0.55, transform: [{ rotate: `${540 * t}deg` }, { scale: 0.6 + rnd(k, 7) * 0.5 }] }}><Coin /></View>;
      })}
    </View>
  );
}
/** Value pill floating up (kUp, 2.8 s `rise`). */
export function ValuePill({ text, icon, x, y, at, tilt = 0 }: { text: string; icon: string; x: number; y: number; at: number; tilt?: number }) {
  const ms = useMs();
  const t = (ms - at) / 2800;
  if (t < 0 || t > 1) return null;
  const k = E.rise(t);
  const s = t < 0.18 ? 0.5 + 0.56 * (t / 0.18) : t < 0.3 ? 1.06 - 0.06 * ((t - 0.18) / 0.12) : 1;
  const op = t < 0.18 ? t / 0.18 : t < 0.8 ? 1 : 1 - (t - 0.8) / 0.2;
  return (
    <View pointerEvents="none" style={{ position: "absolute", left: x, top: y, zIndex: 55, opacity: op, transform: [{ translateY: 30 - 270 * k }, { scale: s }, { rotate: `${tilt}deg` }] }}>
      <View style={{ height: 36, paddingLeft: 10, paddingRight: 14, borderRadius: 18, backgroundImage: gradient("moneyPill"), flexDirection: "row", alignItems: "center", gap: 6, boxShadow: "0 12px 26px rgba(197,242,92,0.28)" }}>
        <Icon name={icon} size={16} color={color.text.onLimeDeep} />
        <Text variant="chipMd" color={color.text.onLimeDeep} style={{ fontSize: 14, fontWeight: 700 }}>{text}</Text>
      </View>
    </View>
  );
}
export function Flash({ at, dur = 220 }: { at?: number; dur?: number }) {
  const ms = useMs();
  if (at === undefined || ms < at || ms > at + dur) return null;
  return <View pointerEvents="none" style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, zIndex: 80, backgroundColor: "#fff", opacity: 0.85 * (1 - cl((ms - at) / dur)) }} />;
}
