// Port of content/Social.tsx: BountyCover, HScroller, InboxList, ProfileCard, AvatarBuilder.
import React from "react";
import { View } from "../rn";
import { banner, color, heroCard, lin, metrics, space } from "../theme";
import { Icon, Pop, PressScale, Surface, Text } from "../motion";
import { RowButton, Segmented, Shine } from "./basics";
import type { ButtonKind } from "./basics";
import { Avatar } from "./Avatar";
import { AVATAR_TABS, parseAvatar } from "./avatarPalette";
import { AppKeeper } from "./keeper";
import type { KeeperMood } from "../../keeper/rig";

export function BountyCover({ brand, logo, colors, icon, message, tags = [], height = metrics.cover.height, press }: { brand: string; logo: string; colors: readonly [string, string]; icon: string; message: string; tags?: { text: string; icon: string }[]; height?: number; press?: number }) {
  const c = metrics.cover;
  return (
    <PressScale press={press}>
      <Surface radius={c.radius} gradient={lin(135, colors)} shadow="0 20px 40px rgba(0,0,0,0.40)" clip style={{ height }}>
        <View style={{ position: "absolute", right: -24, bottom: -46, transform: [{ rotate: "-12deg" }] }}><Icon name={icon} size={c.bigIcon} color={color.extra.decoWhite16} /></View>
        <View style={{ position: "absolute", left: c.inset, right: c.inset, top: c.inset, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space[5] }}>
          <View style={{ flexShrink: 1, minWidth: 0, height: c.pill, paddingLeft: 4, paddingRight: 11, borderRadius: c.pill / 2, backgroundColor: color.extra.onCover28, flexDirection: "row", alignItems: "center", gap: 7 }}>
            <View style={{ width: c.logo, height: c.logo, borderRadius: c.logoRadius, backgroundColor: color.text.primary, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontWeight: 800, fontSize: 12, color: color.text.onLime }}>{logo}</Text>
            </View>
            <Text variant="chipMd" numberOfLines={1} style={{ flexShrink: 1 }}>{brand}</Text>
            <Icon name="check-decagram" size={14} color={color.lime.base} />
          </View>
          <View style={{ flexDirection: "row", gap: space[5], flexShrink: 0 }}>
            {tags.map((tg) => (
              <View key={tg.text} style={{ height: c.tagH, paddingLeft: 7, paddingRight: 9, borderRadius: c.tagH / 2, backgroundColor: color.extra.onCover28, flexDirection: "row", alignItems: "center", gap: space[4] }}>
                <Icon name={tg.icon} size={13} />
                <Text variant="chip" style={{ fontSize: 11 }}>{tg.text}</Text>
              </View>
            ))}
          </View>
        </View>
        <Text variant="coverMsg" style={{ position: "absolute", left: 16, right: 16, bottom: 16 }}>{message}</Text>
        <Shine w={350} period={5000} delay={1200} widthPct={0.35} />
      </Surface>
    </PressScale>
  );
}

export type HeroItem = { title: string; icon: string; value: string; sub: string; palette: string };
export function HeroCard({ c }: { c: HeroItem }) {
  const h = metrics.hscroller;
  const p = heroCard(c.palette);
  return (
    <Surface radius={h.radius} gradient={p.gradient} shadow={`inset 0 1.5px 0 ${color.extra.tileHi35}, 0 14px 28px rgba(0,0,0,0.4)`} clip style={{ width: h.cardW, height: h.cardH }}>
      <View style={{ flex: 1, padding: h.pad, justifyContent: "space-between" }}>
        <View style={{ position: "absolute", right: -16, bottom: -24, transform: [{ rotate: "-12deg" }] }}><Icon name={c.icon} size={h.bigIcon} color={color.extra.decoWhite20} /></View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[6] }}>
          <Icon name={c.icon} size={16} color={p.fg} />
          <Text variant="chipMd" color={p.fg} numberOfLines={1}>{c.title}</Text>
        </View>
        <View>
          <Text variant="heroCardValue" color={p.fg}>{c.value}</Text>
          <Text variant="micro" color={p.fg} style={{ opacity: 0.85, marginTop: space[2] }} numberOfLines={1}>{c.sub}</Text>
        </View>
      </View>
    </Surface>
  );
}
/** HScroller: hero cards or chips bleeding to the screen edges; `scroll` = horizontal offset in px. */
export function HScroller({ label, seeAll, cards, chips, chipValue, scroll = 0 }: { label?: string; seeAll?: boolean; cards?: HeroItem[]; chips?: string[]; chipValue?: number; scroll?: number }) {
  const h = metrics.hscroller;
  return (
    <View style={{ gap: space[10] }}>
      {label ? (
        <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" }}>
          <Text variant="monoLabel">{label}</Text>
          {seeAll ? <Text variant="chipMd" color={color.lime.base}>See all</Text> : null}
        </View>
      ) : null}
      <View style={{ marginHorizontal: -20, overflow: "hidden" }}>
        <View style={{ flexDirection: "row", paddingHorizontal: 20, paddingTop: 2, paddingBottom: 8, gap: chips ? space[6] : space[10], transform: [{ translateX: -scroll }] }}>
          {cards?.map((c) => <HeroCard key={c.title} c={c} />)}
          {chips?.map((l, i) => {
            const on = chipValue === i;
            return (
              <View key={l} style={{ height: h.chipH, paddingHorizontal: h.chipPadX, borderRadius: h.chipH / 2, justifyContent: "center", backgroundColor: on ? color.text.primary : color.surface[1], boxShadow: `inset 0 0 0 1px ${color.line.hairline3}` }}>
                <Text variant="chipMd" color={on ? color.text.onLime : color.text.soft}>{l}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export type InboxLead = { kind: "avatar"; config: string } | { kind: "keeper"; mood: KeeperMood } | { kind: "icon"; icon: string; palette: string };
export interface InboxItemView { id: string; title: string; sub?: string; time: string; lead: InboxLead; badge?: { icon: string; palette: string }; needsAction?: boolean; unread?: boolean; actions?: { label: string; kind?: ButtonKind }[] }
export function InboxList({ label, action, items }: { label?: string; action?: string; items: InboxItemView[] }) {
  const m = metrics.inbox;
  return (
    <View style={{ gap: space[8] }}>
      {label ? (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: space[2] }}>
          <Text variant="monoLabel">{label}</Text>
          {action ? <Text variant="chipMd" color={color.lime.base}>{action}</Text> : null}
        </View>
      ) : null}
      {items.map((it) => {
        const tp = it.lead.kind === "icon" ? ((color.tilePalette as any)[it.lead.palette] as string[]) : null;
        return (
          <View key={it.id} style={{ padding: m.pad, borderRadius: m.radius, backgroundColor: color.surface[1], boxShadow: `inset 0 0 0 1px ${it.needsAction ? color.lime.glow22 : color.line.hairline}`, flexDirection: "row", gap: m.gap }}>
            <View style={{ width: m.tile, height: m.tile }}>
              <View style={{ width: m.tile, height: m.tile, borderRadius: m.tileRadius, overflow: "hidden", alignItems: "center", justifyContent: "center", backgroundColor: it.lead.kind === "keeper" ? color.surface[4] : "transparent", backgroundImage: tp ? lin(150, [tp[0], tp[1]]) : undefined, boxShadow: `inset 0 1.5px 0 ${color.extra.tileHi35}, inset 0 -2px 0 ${color.extra.tileShade20}` }}>
                {it.lead.kind === "avatar" ? <Avatar config={it.lead.config} size={m.tile} /> : null}
                {it.lead.kind === "keeper" ? <AppKeeper mood={it.lead.mood} bust size={m.tile} /> : null}
                {it.lead.kind === "icon" && tp ? <Icon name={it.lead.icon} size={22} color={tp[2]} /> : null}
              </View>
              {it.badge ? (
                <View style={{ position: "absolute", right: -5, bottom: -5, width: m.badge, height: m.badge, borderRadius: m.badge / 2, backgroundColor: ((color.tilePalette as any)[it.badge.palette] as string[])[1], boxShadow: `0 0 0 ${m.badgeRing}px ${color.surface[1]}`, alignItems: "center", justifyContent: "center" }}>
                  <Icon name={it.badge.icon} size={13} color={color.text.onLime} />
                </View>
              ) : null}
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <View style={{ flexDirection: "row", gap: space[8], alignItems: "center" }}>
                <Text variant="rowTitle" style={{ flex: 1 }}>{it.title}</Text>
                {it.unread ? <View style={{ width: m.dot, height: m.dot, borderRadius: m.dot / 2, backgroundColor: color.lime.base }} /> : null}
                <Text variant="micro">{it.time}</Text>
              </View>
              {it.sub ? <Text variant="label" color={color.text.secondary} style={{ fontSize: 13, lineHeight: 18, marginTop: space[2] }}>{it.sub}</Text> : null}
              {it.actions?.length ? <View style={{ flexDirection: "row", gap: space[6], marginTop: space[10] }}>{it.actions.map((a) => <RowButton key={a.label} label={a.label} kind={a.kind} />)}</View> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

export function ProfileCard({ name, handle, avatar, bannerBg, bannerIcon = "cards-playing-outline", bio, verified, socials = [], actions = [] }: { name: string; handle: string; avatar: string; bannerBg?: string; bannerIcon?: string; bio?: string; verified?: boolean; socials?: { glyph?: string; icon?: string; text: string }[]; actions?: { label: string; icon: string }[] }) {
  const p = metrics.profile;
  return (
    <View style={{ borderRadius: p.radius, overflow: "hidden", backgroundColor: color.surface[1], boxShadow: `inset 0 0 0 1px ${color.line.hairline2}` }}>
      <View style={{ height: p.banner, overflow: "hidden", backgroundImage: bannerBg ?? banner(0) }}>
        <View style={{ position: "absolute", right: -10, top: -24, transform: [{ rotate: "-12deg" }] }}><Icon name={bannerIcon} size={p.bannerIcon} color={color.extra.decoWhite20} /></View>
      </View>
      <View style={{ position: "absolute", left: 16, top: p.avatarTop, width: p.avatar, height: p.avatar, borderRadius: p.avatarRadius, overflow: "hidden", boxShadow: `0 0 0 4px ${color.surface[1]}, 0 12px 24px rgba(0,0,0,0.4)`, transform: [{ rotate: "-3deg" }] }}>
        <Avatar config={avatar} size={p.avatar} />
      </View>
      {actions.length ? (
        <View style={{ position: "absolute", right: 14, top: p.actionsTop, flexDirection: "row", gap: space[6] }}>
          {actions.map((a) => (
            <View key={a.label} style={{ height: p.chipH, paddingHorizontal: 13, borderRadius: p.chipH / 2, backgroundColor: color.surface[3], boxShadow: `inset 0 0 0 1px ${color.line.strong}`, flexDirection: "row", alignItems: "center", gap: space[6] }}>
              <Icon name={a.icon} size={15} />
              <Text variant="chipMd">{a.label}</Text>
            </View>
          ))}
        </View>
      ) : null}
      <View style={{ paddingTop: p.bodyTop, paddingHorizontal: 16, paddingBottom: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[6] }}>
          <Text variant="profileName">{name}</Text>
          {verified ? <Icon name="check-decagram" size={18} color={color.lime.base} /> : null}
        </View>
        <Text variant="monoValue" color={color.text.secondary} style={{ marginTop: space[2] }}>{handle}</Text>
        {bio ? <Text variant="label" color={color.text.soft} style={{ marginTop: space[10] }}>{bio}</Text> : null}
        {socials.length ? (
          <View style={{ marginTop: space[12], flexDirection: "row", flexWrap: "wrap", gap: space[6] }}>
            {socials.map((s) => (
              <View key={s.text} style={{ height: p.socialH, paddingLeft: 10, paddingRight: 12, borderRadius: p.socialH / 2, backgroundColor: color.surface[3], boxShadow: `inset 0 0 0 1px ${color.line.hairline3}`, flexDirection: "row", alignItems: "center", gap: space[6] }}>
                {s.glyph ? <Text style={{ fontWeight: 800, fontSize: 14, color: color.text.primary }}>{s.glyph}</Text> : null}
                {s.icon ? <Icon name={s.icon} size={16} /> : null}
                <Text variant="chipMd">{s.text}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const OPT_LABELS = [["Human", "Fox", "Cat", "Frog", "Bear", "Bot", "Skull", "Alien"]];
/** AvatarBuilder (full): preview (re-pops on each change via `popAt`), Shuffle, tabs, swatches, option tiles. */
export function AvatarBuilder({ config, tab = 0, popAt = 0, shufflePress }: { config: string; tab?: number; popAt?: number; shufflePress?: number[] }) {
  const a = metrics.avatarBuilder;
  const d = parseAvatar(config);
  const T = AVATAR_TABS[tab] ?? AVATAR_TABS[0];
  return (
    <View style={{ gap: space[14] }}>
      <View style={{ alignItems: "center", gap: space[16] }}>
        <Pop ms={500} delay={popAt}>
          <View style={{ width: a.preview, height: a.preview, borderRadius: a.preview / 2, overflow: "hidden", transform: [{ rotate: "-2deg" }], boxShadow: "0 20px 44px rgba(0,0,0,0.5)" }}>
            <Avatar config={config} size={a.preview} />
          </View>
        </Pop>
        <View style={{ width: a.preview }}>
          <PressScale press={shufflePress}>
            <Surface radius={27} bg={color.surface[2]} shadow={`inset 0 0 0 1px ${color.line.hairline3}`} style={{ height: 54, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Icon name="shuffle-variant" size={18} />
              <Text variant="buttonSm">Shuffle</Text>
            </Surface>
          </PressScale>
        </View>
      </View>
      <Segmented items={["Base", "Eyes", "Hat", "Fit", "Extra", "Back"]} value={tab} />
      {"swatches" in T ? (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {T.swatches.map((c, i) => (
            <View key={c} style={{ width: a.swatch, height: a.swatch, borderRadius: a.swatch / 2, backgroundColor: c, boxShadow: d[T.swatchDigit] === i ? `0 0 0 3px ${color.bg.app}, 0 0 0 5px ${color.text.primary}` : `inset 0 0 0 1px ${color.extra.swatchRing}` }} />
          ))}
        </View>
      ) : null}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[8] }}>
        {Array.from({ length: Math.min(6, T.count) }, (_, i) => {
          const nd = d.slice(); nd[T.digit] = i;
          const on = d[T.digit] === i;
          return (
            <View key={i} style={{ width: "31.5%", height: a.optionH, borderRadius: 22, backgroundColor: on ? color.surface[3] : color.surface[1], boxShadow: on ? `inset 0 0 0 2.5px ${color.text.primary}` : `inset 0 0 0 1px ${color.extra.hairline07}`, alignItems: "center", justifyContent: "center", gap: space[6] }}>
              <View style={{ width: a.optionAvatar, height: a.optionAvatar, borderRadius: a.optionAvatar / 2, overflow: "hidden" }}><Avatar config={nd.join("")} size={a.optionAvatar} /></View>
              <Text variant="chip" color={color.text.muted}>{OPT_LABELS[0][i] ?? ""}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
