// Port of content/Status.tsx (SignStatus, KeptRateRing, DayStrip, BarChart) and Inputs.tsx › MoneyMoment.
import React from "react";
import { View } from "../rn";
import { color, duration, gradient, metrics, shadow, space, type as typeStyles } from "../theme";
import { At, CountText, Icon, Loop, Pop, Surface, Text, E, ev, useMs, cl } from "../motion";
import { Chip } from "./basics";

export type SignState = "pending" | "success" | "fail" | "warn";
const SIGN: Record<SignState, { ring: string; icon: string; fg: string; chipIcon: string }> = {
  pending: { ring: color.surface[4], icon: "wallet-outline", fg: color.text.primary, chipIcon: "wallet-outline" },
  success: { ring: color.lime.base, icon: "check-bold", fg: color.lime.base, chipIcon: "check-decagram" },
  fail: { ring: color.red.base, icon: "alert-outline", fg: color.red.base, chipIcon: "alert-circle-outline" },
  warn: { ring: color.orange.base, icon: "cellphone-off", fg: color.orange.base, chipIcon: "information-outline" },
};
function arcPath(size: number, frac: number) {
  const r = size / 2, a = frac * 2 * Math.PI;
  const x = r + r * Math.sin(a), y = r - r * Math.cos(a);
  return `M${r} ${r} L${r} 0 A${r} ${r} 0 ${frac > 0.5 ? 1 : 0} 1 ${x} ${y} Z`;
}
function Ping({ delay }: { delay: number }) {
  return (
    <Loop kind="ping" delay={delay} style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }}>
      <View style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, borderRadius: metrics.sign.size / 2, boxShadow: `0 0 0 3px ${color.lime.base}` }} />
    </Loop>
  );
}
/** SignStatus. `successAt`: a pending ring that turns to success at that ms (the wallet approved). */
export function SignStatus({ state, chip, successAt, successChip }: { state: SignState; chip: string; successAt?: number; successChip?: string }) {
  const ms = useMs();
  const st: SignState = successAt !== undefined && ms >= successAt ? "success" : state;
  const t0 = successAt ?? 0;
  const s = SIGN[st];
  const size = metrics.sign.size;
  const label = st === "success" && successChip ? successChip : chip;
  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ width: size, height: size }}>
        {st === "pending" ? (
          <Loop kind="spin" style={{ position: "absolute", left: 0, top: 0 }}>
            <svg width={size} height={size} style={{ display: "block" }}><circle cx={size / 2} cy={size / 2} r={size / 2} fill={color.surface[4]} /><path d={arcPath(size, metrics.sign.arc)} fill={color.lime.base} /></svg>
          </Loop>
        ) : (
          <View style={{ position: "absolute", left: 0, top: 0, width: size, height: size, borderRadius: size / 2, backgroundColor: s.ring }} />
        )}
        {st === "success" ? <At at={t0}><Ping delay={0} /><Ping delay={600} /></At> : null}
        <View style={{ position: "absolute", left: metrics.sign.inset, top: metrics.sign.inset, right: metrics.sign.inset, bottom: metrics.sign.inset, borderRadius: size, backgroundColor: color.surface[1], alignItems: "center", justifyContent: "center" }}>
          {st === "success" ? <At at={t0}><Pop delay={150} ms={duration.money} ease="springHard"><Icon name={s.icon} size={metrics.sign.icon} color={s.fg} /></Pop></At> : <Icon name={s.icon} size={metrics.sign.icon} color={s.fg} />}
        </View>
        <View style={{ position: "absolute", left: metrics.sign.chipX, top: metrics.sign.chipY }}>
          <Chip text={label} icon={s.chipIcon} tone="white" tilt={metrics.sign.chipTilt} />
        </View>
      </View>
    </View>
  );
}

/** KeptRateRing: 118 ring rotated −8°; the arc sweeps with the count-up (900 ms cubic). */
export function KeptRateRing({ percent, line, note = "Recent days count more. Shows \"New\" under 10 days.", delay = 0, dur = 900 }: { percent: number; line: string; note?: string; delay?: number; dur?: number }) {
  const ms = useMs();
  const size = metrics.ring.size;
  const p = (percent / 100) * E.cubicOut(cl((ms - delay) / dur));
  const r = (size - metrics.ring.stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: metrics.ring.gap, padding: metrics.ring.pad, borderRadius: metrics.ring.radius, backgroundColor: color.surface[1] }}>
      <View style={{ width: size, height: size, transform: [{ rotate: `${metrics.ring.tilt}deg` }], borderRadius: size / 2, boxShadow: `0 0 34px ${color.lime.tint20}` }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)", display: "block" }}>
          <circle cx={size / 2} cy={size / 2} r={r} stroke={color.surface[4]} strokeWidth={metrics.ring.stroke} fill={color.surface[1]} />
          <circle cx={size / 2} cy={size / 2} r={r} stroke={color.lime.base} strokeWidth={metrics.ring.stroke} fill="none" strokeDasharray={`${c * p} ${c}`} />
        </svg>
        <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, alignItems: "center", justifyContent: "center", transform: [{ rotate: `${-metrics.ring.tilt}deg` }] }}>
          <CountText text={`${percent}%`} delay={delay} dur={dur} variant="ringValue" />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ ...typeStyles.monoValue, letterSpacing: 1.2, color: color.text.secondary }}>KEPT RATE</Text>
        <Text variant="cardName" style={{ marginTop: space[4], fontSize: 16, lineHeight: 21 }}>{line}</Text>
        <Text variant="note" color={color.text.secondary} style={{ marginTop: space[6] }}>{note}</Text>
      </View>
    </View>
  );
}

export function DayStrip({ n, done, today, labels }: { n: number; done: number; today: number; labels: string[] }) {
  return (
    <View style={{ flexDirection: "row", gap: metrics.dayStrip.gap }}>
      {Array.from({ length: n }, (_, i) => {
        const kept = i < done, isToday = i === today - 1;
        return (
          <View key={i} style={{ flex: 1, alignItems: "stretch", gap: space[5] }}>
            <View style={{
              height: metrics.dayStrip.h, borderRadius: metrics.dayStrip.radius, alignItems: "center", justifyContent: "center",
              backgroundColor: kept ? color.lime.base : color.surface[1],
              boxShadow: isToday ? `0 0 0 2px ${color.bg.app}, 0 0 0 4px ${color.text.primary}` : kept ? undefined : `inset 0 0 0 1px ${color.line.empty}`,
              transform: [{ rotate: `${isToday ? metrics.dayStrip.todayTilt : kept ? (i % 2 ? 2 : -2) : 0}deg` }],
            }}>
              {kept ? <Pop delay={250 + i * 70}><Icon name="check-bold" size={metrics.dayStrip.icon} color={color.text.onLime} /></Pop> : null}
            </View>
            <Text variant="monoMicro" align="center" color={isToday ? color.text.primary : color.text.tertiary}>{labels[i]}</Text>
          </View>
        );
      })}
    </View>
  );
}

export function BarChart({ label, bars, grow = 0 }: { label: string; bars: { label: string; value: number }[]; grow?: number }) {
  const ms = useMs();
  const max = Math.max(1, ...bars.map((b) => b.value));
  return (
    <View style={{ padding: metrics.bars.pad, borderRadius: metrics.bars.radius, backgroundColor: color.surface[1] }}>
      <Text variant="label" color={color.text.secondary} style={{ fontSize: 13 }}>{label}</Text>
      <View style={{ marginTop: space[12], flexDirection: "row", alignItems: "flex-end", gap: metrics.bars.gap, height: metrics.bars.height }}>
        {bars.map((b, i) => {
          const k = ev(ms, grow + i * 70, 500, E.enter);
          return (
            <View key={i} style={{ flex: 1, height: "100%", alignItems: "center", justifyContent: "flex-end", gap: space[4] }}>
              <Text variant="monoMicro" color={color.text.muted}>{b.value ? String(b.value) : ""}</Text>
              <View style={{ width: "100%", height: b.value ? Math.max(metrics.bars.minH, Math.round(k * (b.value / max) * (metrics.bars.height - metrics.bars.labelSpace))) : metrics.bars.minH, borderRadius: metrics.bars.barRadius, backgroundColor: b.value ? color.lime.base : color.surface[4] }} />
              <Text variant="monoMicro" color={color.text.tertiary}>{b.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

/** MoneyMoment (`big`): lime "+…" values become the tilted money pill; numbers count up. */
export function MoneyMoment({ value, caption, fs = metrics.money.fs, tone = "white", from }: { value: string; caption?: string; fs?: number; tone?: "white" | "lime" | "red"; from?: string }) {
  const pill = tone === "lime" && value.startsWith("+");
  const size = pill ? Math.min(fs, metrics.money.pillMax) : fs;
  const fg = pill ? color.text.onLimeDeep : tone === "lime" ? color.lime.base : tone === "red" ? color.red.base : color.text.primary;
  const glow = !pill && tone !== "white" ? { textShadow: `0 0 40px ${tone === "lime" ? color.lime.tint20 : color.red.tint22}` } : {};
  const text = <CountText text={value} from={from} delay={200} variant="display" color={fg} style={{ fontSize: size, lineHeight: size, ...glow }} />;
  return (
    <View style={{ alignItems: "center", paddingVertical: space[6] }}>
      <Pop delay={200} ms={600}>
        {pill ? (
          <View style={{ transform: [{ rotate: `${metrics.money.pillTilt}deg` }] }}>
            <Surface radius={999} gradient={gradient("moneyPill")} shadow={shadow("moneyPill")} style={{ flexDirection: "row", alignItems: "center", gap: space[8], paddingLeft: metrics.money.pillPadL, paddingRight: metrics.money.pillPadR, paddingVertical: metrics.money.pillPadY }}>
              <Icon name="sack" size={Math.round(size * metrics.money.iconRatio)} color={fg} />
              {text}
            </Surface>
          </View>
        ) : text}
      </Pop>
      {caption ? <Text variant="label" color={color.text.secondary} style={{ marginTop: space[8] }}>{caption}</Text> : null}
    </View>
  );
}
