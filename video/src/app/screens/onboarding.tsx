// A · Onboarding (A0, A1, A2, sign, A3, A4) and M1, the lock screen with KEPT notifications.
import React from "react";
import { View } from "../rn";
import { color, metrics, space } from "../theme";
import { At, CheckK, E, Text, cl, ev, useMs } from "../motion";
import { Screen } from "../Screen";
import { BrandSplash, BrandWord, NavBar } from "../kit/chrome";
import { Breakdown, Button, Chip, ChipRow, Note, Spacer, Title } from "../kit/basics";
import { RowList } from "../kit/rows";
import { SignStatus } from "../kit/status";
import { KeeperNote, KeeperPlacement } from "../kit/keeper";
import { Avatar } from "../kit/Avatar";
import { Pop } from "../motion";
import { Surface, Icon, PressScale } from "../motion";

export const NOTIFS: [string, string][] = [
  ["Hydrate Week starts tomorrow.", "Thu"], ["1,054 SKR ready to claim.", "Fri"], ["Daily recap ready: +43 SKR.", "00:01"],
  ["Dev wants your vote on a photo.", "18:10"], ["Iron Week: 2 hours to midnight.", "19:58"], ["Riya nudged you. Your move.", "now"],
];
/** M1: lock screen. Notifications land one by one at `at[i]` (newest on top, the stack slides down). */
export function LockM1({ at = [], pressAt, items = NOTIFS, clock = "9:41", date = "Tuesday 14 October" }: { at?: number[]; pressAt?: number; items?: [string, string][]; clock?: string; date?: string }) {
  const ms = useMs();
  const NOTIFS_ = items;
  const n = NOTIFS_.length;
  const appear = NOTIFS_.map((_, i) => at[i] ?? -1e6);
  const H = 62;
  return (
    <Screen tone="lock" blocks={[]} overlay={
      <View style={{ position: "absolute", left: 0, right: 0, top: 40, bottom: 0 }}>
        <View style={{ alignItems: "center", marginTop: 34 }}>
          <Icon name="lock-outline" size={20} color="rgba(255,255,255,0.8)" />
          <Text variant="lockClock" style={{ marginTop: 6 }}>{clock}</Text>
          <Text variant="label" color={color.text.soft} style={{ fontSize: 16, fontWeight: 500 }}>{date}</Text>
        </View>
        <View style={{ position: "absolute", left: 14, right: 14, top: 230 }}>
          {NOTIFS_.map(([t, r], i) => {
            if (ms < appear[i]) return null;
            let pos = 0;
            for (let j = i + 1; j < n; j++) pos += ev(ms, appear[j], 420, E.enter);
            const p = ev(ms, appear[i], 520, E.springSoft);
            const pr = i === n - 1 && pressAt !== undefined ? 1 - 0.03 * Math.sin(cl((ms - pressAt) / 260) * Math.PI) : 1;
            return (
              <View key={i} style={{ position: "absolute", left: 0, right: 0, top: H * pos, opacity: cl(p * 1.6) * (pos > 4.2 ? Math.max(0, 5.2 - pos) : 1), transform: [{ translateY: -24 * (1 - p) }, { scale: (0.94 + 0.06 * p) * pr }] }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 11, minHeight: 56, paddingLeft: 8, paddingRight: 14, borderRadius: 18, backgroundColor: "rgba(40,40,46,0.92)", boxShadow: "0 10px 26px rgba(0,0,0,0.35)" }}>
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: color.lime.base, alignItems: "center", justifyContent: "center" }}><CheckK size={30} variant="ink" /></View>
                  <View style={{ flex: 1 }}>
                    <Text variant="monoMicro" color={color.text.secondary}>KEPT</Text>
                    <Text variant="rowTitle" style={{ marginTop: 1 }}>{t}</Text>
                  </View>
                  <Text variant="micro" color={color.text.secondary}>{r}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    } />
  );
}

export function SplashA0() {
  return <Screen blocks={[]} overlay={<View style={{ position: "absolute", left: 0, right: 0, top: 290 }}><BrandSplash /></View>} />;
}

export function WelcomeA1({ pressAt }: { pressAt?: number }) {
  return (
    <Screen beam ambient="lime"
      blocks={[
        <KeeperPlacement key="k" mood="smug" line={"Step up.\nPlace your word."} prop="coin" anim="wave" size={196} side="c" height={300}
          chips={[{ text: "1,000 SKR pot", icon: "sack", x: 10, y: 236, tilt: -6, tone: "lime" }, { text: "3-to-1 on you", icon: "cards-playing-outline", x: 226, y: 252, tilt: 5, tone: "dark" }]}
          orbs={[{ icon: "dumbbell", x: 26, y: 0, size: 50, palette: "lime", rotate: -14 }, { icon: "book-open-variant", x: 272, y: 18, size: 46, palette: "vio", rotate: 12 }, { icon: "sack", x: 290, y: 150, size: 40, palette: "lime", rotate: 0, coin: true }, { icon: "bottle-soda-outline", x: 8, y: 150, size: 40, palette: "sky", rotate: 10 }]} />,
        <Title key="t" heading={"Bet your friends\nyou'll do it."} sub="Stake SKR on a daily habit. Prove it with two photos. Miss, and the people who kept take your share." fs={32} pt={8} />,
      ]}
      pinned={[<Button key="a" label="Get started" press={pressAt} />, <Button key="b" label="I have an invite" kind="t" />]}
    />
  );
}

export function ConnectA2({ pressAt }: { pressAt?: number }) {
  return (
    <Screen ambient="lime" bar={<NavBar steps={[1, 3]} />}
      blocks={[
        <Title key="t" heading="Connect your wallet." sub="You'll sign a short message. It's free and moves nothing." pt={10} />,
        <RowList key="r" rows={[
          { title: "Seeker Wallet", sub: "Built into your Seeker", value: "Recommended", valueColor: color.lime.base, chevron: true, leading: { kind: "icon", icon: "cellphone-key", bg: color.lime.base, fg: color.text.onLime }, press: pressAt },
          { title: "Phantom", sub: "Mobile wallet adapter", chevron: true, leading: { kind: "icon", icon: "ghost-outline" } },
          { title: "Solflare", sub: "Mobile wallet adapter", chevron: true, leading: { kind: "icon", icon: "white-balance-sunny" } },
        ]} />,
        <Breakdown key="b" label="WHAT YOU'LL SIGN" rows={[{ label: "Message", value: "Sign in to KEPT" }, { label: "Nonce", value: "8f3a…c21e" }, { label: "Cost", value: "Free", color: color.lime.base }]} />,
        <Note key="n" text="Signing in never moves SKR or SOL." icon="shield-check-outline" />,
      ]}
    />
  );
}

/** The signing screen (sigScreen): pending ring, title, "Waiting for your signature…"; `successAt` flips it. */
export function SignScreen({ title, sub, chip = "Seeker Wallet", successAt, successChip, steps }: { title: string; sub: string; chip?: string; successAt?: number; successChip?: string; steps?: [number, number] }) {
  return (
    <Screen ambient="lime" bar={<NavBar close={!steps} steps={steps} />}
      blocks={[<Spacer key="s" h={60} />, <SignStatus key="g" state="pending" chip={chip} successAt={successAt} successChip={successChip} />, <Title key="t" heading={title} sub={sub} align="center" pt={26} />, <Note key="n" text="Waiting for your signature…" icon="timer-sand" />]}
    />
  );
}

export function VerifiedA3({ pressAt }: { pressAt?: number }) {
  return (
    <Screen beam ambient="lime" bar={<NavBar steps={[2, 3]} stepSince={0} />}
      blocks={[
        <Spacer key="s" h={50} />, <SignStatus key="g" state="success" chip="Genesis token" successAt={0} />,
        <Title key="t" heading="Seeker verified." sub="Your Genesis token checks out. Group Oaths and Bounties are open to you." align="center" pt={26} />,
        <ChipRow key="c" justify="center"><Chip text="Solo Oaths" icon="check" tone="lime" /><Chip text="Group Oaths" icon="check" tone="lime" tilt={-3} /><Chip text="Bounties" icon="check" tone="lime" tilt={2} /></ChipRow>,
      ]}
      pinned={[<Button key="a" label="Continue" press={pressAt} />]}
    />
  );
}

export const LOOKS: [string, string][] = [["33121443", "Frog. Very online of you."], ["63240102", "Skull? Hey, that's my look."], ["13050010", "A fox. Sly. I respect it."]];
/** A4 Pick a look: Shuffle at `shuffles[i]` swaps the avatar (pop) and the Keeper's quip drops again. */
export function LookA4({ shuffles = [], pressAt }: { shuffles?: number[]; pressAt?: number }) {
  const ms = useMs();
  const k = shuffles.filter((s) => ms >= s + 120).length;
  const [config, quip] = k === 0 ? ["26142321", "Bear. Patient. Good for 14 days."] : LOOKS[Math.min(k, LOOKS.length) - 1];
  const popAt = k === 0 ? 0 : shuffles[k - 1] + 120;
  const a = metrics.avatarBuilder;
  return (
    <Screen ambient="lime" bar={<NavBar steps={[3, 3]} />}
      blocks={[
        <Title key="t" heading="Pick a look." sub="No face needed. It's how friends spot you in an Oath." pt={6} />,
        <View key="a" style={{ alignItems: "center", gap: space[16], marginTop: 8 }}>
          <Pop ms={500} delay={popAt}>
            <View style={{ width: a.preview, height: a.preview, borderRadius: a.preview / 2, overflow: "hidden", transform: [{ rotate: "-2deg" }], boxShadow: "0 20px 44px rgba(0,0,0,0.5)" }}><Avatar config={config} size={a.preview} /></View>
          </Pop>
          <View style={{ width: a.preview }}>
            <PressScale press={shuffles}>
              <Surface radius={27} bg={color.surface[2]} shadow={`inset 0 0 0 1px ${color.line.hairline3}`} style={{ height: 54, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Icon name="shuffle-variant" size={18} /><Text variant="buttonSm">Shuffle</Text>
              </Surface>
            </PressScale>
          </View>
        </View>,
        <Note key="n" text="You can change it any time from your Profile." />,
      ]}
      pinned={[<Button key="a" label="Looks like me" press={pressAt} />, <Button key="b" label="Customize it" kind="t" />]}
      overlay={<At at={popAt + 100}><KeeperNote key={k} mood={k === 2 ? "shocked" : k === 1 ? "smug" : "side"} line={quip} anim="point" top={96} /></At>}
    />
  );
}
