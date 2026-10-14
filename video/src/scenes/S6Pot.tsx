// S6 SIGNATURE + S7 PROOF FLASH. The swing IS the transition: the blade's swept arc is a matte, and
// behind it the frame is already the Pot (YOU ✓ · SAM ✓ · JO ✓ · ALEX ✗). The blade splits Alex's card,
// his −100 SKR shatters into coins that arc to the three keepers on 16ths; counters roll 1,000 → 1,025;
// the fourth share, KEPT 25, drops into the ledger (live app rule D-93). He gets giddy ("I love this
// part."). Then the proof chips snap in and he slams the ledger shut toward the lens → cream (S8).
import React from "react";
import { AbsoluteFill } from "remotion";
import { Keeper } from "../keeper/Keeper";
import { handTrack, moodTrack, talk } from "../keeper/perf";
import { BEAT, clamp, ease, kf, prog, rnd, wobble } from "../lib/anim";
import { MONO, SANS, color, film } from "../lib/theme";
import { Bubble } from "../ui/Caption";
import { Void } from "../ui/Backgrounds";
import { Chip, Coin, Icon, MEMBERS, MemberTile, cardStyle, fmt as nfmt } from "../ui/kit";
import type { MemberKey } from "../ui/kit";
import { line } from "../data/cuts";
import { pick } from "./common";
import type { SceneProps } from "./common";
import { swingSpot } from "./layouts";

const ORDER: MemberKey[] = ["you", "sam", "jo", "alex"];
const COINS_PER = 8;

function FriendCard({ m, bal, kept, glow, pop }: { m: MemberKey; bal: number; kept: boolean; glow: number; pop: number }) {
  return (
    <div style={{ ...cardStyle(26), width: 168, padding: "18px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, transform: `scale(${1 + 0.06 * pop})` }}>
      <MemberTile m={m} size={56} tilt={-4} />
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: -0.7, color: color.text.primary }}>{MEMBERS[m].name}</div>
      <Chip text={kept ? "kept" : "missed"} icon={kept ? "check-bold" : "close-thick"} tone={kept ? "lime" : "red"} h={26} fs={12} />
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, letterSpacing: -1.4, fontVariantNumeric: "tabular-nums", color: kept ? (glow > 0 ? color.lime.base : color.text.primary) : color.red.base, textShadow: glow > 0 ? `0 0 ${30 * glow}px rgba(197,242,92,0.5)` : undefined }}>{nfmt(bal)}</div>
      <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, letterSpacing: 1.2, color: color.text.tertiary, marginTop: -6 }}>SKR</div>
    </div>
  );
}

export function S6Pot({ t, cut, fmt, W, H }: SceneProps) {
  const b = cut.b;
  const spot = swingSpot(fmt);
  const size = spot.size, k = size / 160;
  const L = pick(fmt, {
    h: { cards: ORDER.map((_, i) => ({ x: 330 + i * 310, y: 470 })), u: 1.55 },
    v: { cards: ORDER.map((_, i) => ({ x: 290 + (i % 2) * 500, y: 470 + Math.floor(i / 2) * 560 })), u: 2.0 },
    s: { cards: ORDER.map((_, i) => ({ x: 190 + (i % 2) * 330, y: 280 + Math.floor(i / 2) * 400 })), u: 1.3 },
  });
  const C = Object.fromEntries(ORDER.map((m, i) => [m, L.cards[i]])) as Record<MemberKey, { x: number; y: number }>;
  const d2 = b.drop2;
  // ── the swing matte: sector centred on his grip, sweeping 4 frames, then filling ──
  const grip = { x: spot.x + (150 - 80) * k, y: spot.y - (178 - 34) * k };
  const a0 = -70, aSwing = kf(t, [[d2, a0], [d2 + 4 / 60, -200, ease.out], [d2 + 0.25, -300, ease.inOut]]);
  const R = Math.hypot(W, H) * 1.5;
  const sector = (from: number, to: number) => {
    const pts = [`${grip.x}px ${grip.y}px`];
    for (let a = from; a <= to; a += 6) pts.push(`${grip.x + R * Math.cos((a * Math.PI) / 180)}px ${grip.y + R * Math.sin((a * Math.PI) / 180)}px`);
    pts.push(`${grip.x + R * Math.cos((to * Math.PI) / 180)}px ${grip.y + R * Math.sin((to * Math.PI) / 180)}px`);
    return `polygon(${pts.join(",")})`;
  };
  const revealed = t >= d2 + 0.25;
  const clip = t < d2 ? "polygon(0 0,0 0,0 0)" : revealed ? undefined : sector(aSwing, a0);
  // ── money ──
  const cut0 = d2 + 0.03;
  const landT = (j: number) => d2 + BEAT + Math.floor(j / 2) * (BEAT / 4); // two coins per 16th
  const coins = Array.from({ length: COINS_PER * 3 }, (_, j) => ({ to: ORDER[j % 3], land: landT(j), j }));
  const landed = (m: MemberKey) => coins.filter((c) => c.to === m && t >= c.land).length;
  const counterT = b.counters;
  const bal = (m: MemberKey) => m === "alex" ? (t < cut0 ? 1000 : 900) : 1000 + Math.round(25 * Math.min(1, landed(m) / COINS_PER) * (t >= counterT ? 1 : 0.6));
  // ── Keeper: swing → follow-through → settle → ledger → giddy shimmy → proof ticks → slam the ledger ──
  const lines = cut.vo.filter((l) => l.id === "L07" || l.id === "L08");
  const ledgerAt = b.kept25 - 0.45;
  const perf = (tt: number) => {
    const swingR = handTrack(tt, [
      [b.windup - 0.08, [118, 122, 0, "fist"]], [d2 - 0.04, [150, 34, -75, "fist"], ease.out],
      [d2 + 4 / 60, [26, 150, 95, "fist"], ease.out], [d2 + 0.2, [16, 160, 112, "fist"], ease.out], [d2 + 0.55, [48, 140, 70, "fist"], ease.inOut],
      [ledgerAt - 0.2, [80, 150, 40, "fist"]], [ledgerAt, null],
    ]);
    const moods: [number, "stern" | "smug" | "happy" | "side"][] = [[0, "stern"], [d2 + 0.6, "smug"], [b.happy, "happy"], ...(b.proof ? [[b.proof[0] - 0.25, "side"]] as [number, "side"][] : [])];
    const mt = moodTrack(tt, moods);
    const swingLean = kf(tt, [[b.windup, 0], [d2 - 0.04, 7], [d2 + 4 / 60, -9, ease.out], [d2 + 0.6, 0, ease.inOut]]);
    // Shimmy on 8ths, small (RECON G8).
    const sh = tt > b.happy && tt < b.happy + 1.3 ? Math.sin(((tt - b.happy) / (BEAT / 2)) * Math.PI) * clamp((b.happy + 1.3 - tt) * 3) : 0;
    const hit = d2 + 4 / 60;
    const squash = tt > hit ? 1 - 0.06 * Math.sin(clamp((tt - hit) / 0.15) * Math.PI) : 1;
    const gaze = tt > d2 + 0.3 && tt < b.counters + 0.6 ? kf(tt, [[d2 + 0.3, -5], [b.counters, -5], [b.counters + 0.4, 0]]) : -2;
    const Lh = handTrack(tt, [
      [b.happy - 0.05, null], [b.happy + 0.15, [44, 112, -30, "open"], ease.out], [b.happy + 1.2, [44, 112, -30, "open"]], [b.happy + 1.4, null],
      ...(b.proof ? b.proof.flatMap((p) => [[p - 0.12, [96, 112, -60, "point"]], [p, [104, 126, -70, "point"], ease.in], [p + 0.12, [98, 116, -60, "point"]]] as [number, [number, number, number, "point"]][]) : []),
      [b.ledger - 0.2, null],
    ]);
    const slam = handTrack(tt, [[b.ledger - 0.18, null], [b.ledger - 0.02, [120, 90, -10, "fist"], ease.in], [b.ledger + 0.2, [118, 96, -10, "fist"]]]);
    const sp = talk(lines, tt, { eyes: mt.eyes, gx: gaze, tilt: 5 * sh, sy: squash, sx: 2 - squash });
    const prop = tt < ledgerAt ? "scythe" : "ledger";
    return {
      x: spot.x + 6 * k * sh, y: spot.y, size, lean: swingLean,
      draw: { mood: mt.mood, prop: prop as "scythe" | "ledger", attach: true, scytheFront: true, t: tt + 4.1, wiggle: sp.wiggle, over: { ...sp.over, ...(swingR ? { right: swingR } : slam ? { right: slam } : {}), ...(Lh ? { left: Lh } : {}) } },
    };
  };
  const kp = perf(t);
  // Arc smear (lime → white crescent) for 3 frames after the swing.
  const smear = t >= d2 && t < d2 + 0.12 ? 1 - prog(t, d2 + 4 / 60, 0.06) : 0;
  const camShake = wobble(t, d2 + 4 / 60, 10, 20, 12);
  const pushIn = 1 + 0.05 * prog(t, d2, 3.4, ease.inOut);
  // Alex's card split along the blade line.
  const split = prog(t, cut0, 0.18, ease.out);
  const dim = b.proof ? prog(t, b.proof[0] - 0.15, 0.2) : 0;
  const ledgerShut = prog(t, b.ledger - 0.1, 0.12);
  const ledgerScreen = { x: kp.x + (118 - 80) * k, y: kp.y - (178 - 128) * k };
  const L07 = line(cut, "L07"), L08 = line(cut, "L08");
  const head = { x: kp.x - 40 * k, y: kp.y - 152 * k };
  const kept25 = prog(t, b.kept25 - 0.35, 0.35, ease.inOut);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: clip, transform: `translate(${camShake}px, ${camShake * 0.5}px)` }}>
        <Void t={t} W={W} H={H} />
        <AbsoluteFill style={{ transform: `scale(${pushIn})`, filter: dim ? `blur(${4 * dim}px)` : undefined, opacity: 1 - 0.65 * dim }}>
          {ORDER.map((m) => {
            const c = C[m];
            const lastLand = coins.filter((x) => x.to === m && t >= x.land).pop();
            const pop = lastLand ? Math.max(0, 1 - (t - lastLand.land) * 8) : 0;
            const card = <FriendCard m={m} bal={bal(m)} kept={m !== "alex"} glow={m !== "alex" ? prog(t, b.counters, 0.4) : 0} pop={pop} />;
            if (m !== "alex") return <div key={m} style={{ position: "absolute", left: c.x, top: c.y, transform: `translate(-50%,-50%) scale(${L.u})` }}>{card}</div>;
            return (
              <div key={m} style={{ position: "absolute", left: c.x, top: c.y, transform: `translate(-50%,-50%) scale(${L.u})` }}>
                <div style={{ clipPath: "polygon(0 0, 100% 0, 100% 38%, 0 72%)", transform: `translate(${-8 * split}px, ${-10 * split}px) rotate(${-4 * split}deg)` }}>{card}</div>
                <div style={{ position: "absolute", inset: 0, clipPath: "polygon(0 72%, 100% 38%, 100% 100%, 0 100%)", transform: `translate(${8 * split}px, ${12 * split}px) rotate(${3 * split}deg)` }}>{card}</div>
                {t > cut0 ? <div style={{ position: "absolute", right: -24, top: -18, transform: `rotate(8deg) scale(${prog(t, cut0, 0.3, ease.springHard)})` }}><Chip text="−100 SKR" icon="fire" tone="red" h={32} fs={14} style={{ background: "#2A1414" }} /></div> : null}
              </div>
            );
          })}
          {/* coins: burst from the cut, arc to the keepers, land on 16ths */}
          {coins.map((c) => {
            const from = C.alex, to = C[c.to];
            const t0 = cut0 + 0.02 * (c.j % 6);
            if (t < t0 || t > c.land + 0.05) return null;
            const p = clamp((t - t0) / (c.land - t0));
            const e = ease.burst(p);
            const lift = 260 + 120 * rnd(c.j);
            const x = from.x + (to.x - from.x) * e + (rnd(c.j + 9) - 0.5) * 60 * Math.sin(p * Math.PI);
            const y = from.y + (to.y - from.y) * e - lift * Math.sin(p * Math.PI) - 60;
            return <div key={c.j} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${p * 720 * (rnd(c.j + 3) - 0.5)}deg) scale(${0.6 + 0.6 * Math.sin(p * Math.PI)})` }}><Coin size={40} /></div>;
          })}
          {/* shatter shards */}
          {t > cut0 && t < cut0 + 0.6 ? Array.from({ length: 16 }, (_, i) => {
            const p = prog(t, cut0, 0.6, ease.out), a = rnd(i) * Math.PI * 2, d = (120 + 200 * rnd(i + 5)) * p;
            return <div key={i} style={{ position: "absolute", left: C.alex.x + Math.cos(a) * d, top: C.alex.y - 60 + Math.sin(a) * d + 300 * p * p, width: 14, height: 8, background: i % 3 ? color.red.base : "#FFE3E3", opacity: 1 - p, transform: `rotate(${p * 600 * (rnd(i + 2) - 0.5)}deg)`, clipPath: "polygon(0 0,100% 30%,60% 100%)" }} />;
          }) : null}
          {/* KEPT's share → the ledger */}
          {kept25 > 0 && kept25 < 1 ? <div style={{ position: "absolute", left: C.alex.x + (ledgerScreen.x - C.alex.x) * kept25, top: C.alex.y - 200 * Math.sin(kept25 * Math.PI) + (ledgerScreen.y - C.alex.y) * kept25, transform: `translate(-50%,-50%) scale(${1.4 - 0.6 * kept25}) rotate(${-6 + 12 * kept25}deg)` }}><Chip text="KEPT 25" icon="sack" tone="white" h={40} fs={17} /></div> : null}
        </AbsoluteFill>
        {/* S7 proof flash: chips stamp in on the three stabs */}
        {b.proof ? (
          <div style={{ position: "absolute", left: pick(fmt, { h: 330, v: 90, s: 70 }), top: pick(fmt, { h: 300, v: 560, s: 330 }), display: "flex", flexDirection: "column", gap: pick(fmt, { h: 26, v: 34, s: 22 }) }}>
            {([["Pot locked on Solana", "lock"], ["AI photo proof", "robot-outline"], ["426 in Discord", "account-group"]] as [string, string][]).map(([tx, ic], i) => {
              const p = prog(t, b.proof![i], 0.22, ease.springHard);
              const s = pick(fmt, { h: 1.0, v: 1.25, s: 0.85 });
              return p > 0 ? <div key={tx} style={{ transform: `scale(${s * (1.6 - 0.6 * p)}) rotate(${(i - 1) * 2}deg)`, transformOrigin: "0 50%", opacity: clamp(p * 2) }}>
                <Chip text={tx} icon={ic} tone="white" h={72} fs={30} />
              </div> : null;
            })}
          </div>
        ) : null}
      </AbsoluteFill>
      {smear > 0 ? (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <defs><linearGradient id="arc" x1="0" x2="1"><stop offset="0" stopColor={color.lime.base} stopOpacity={0} /><stop offset="1" stopColor="#FFFFFF" /></linearGradient></defs>
          {(() => {
            const r1 = 70 * k, r2 = 170 * k, from = Math.max(-200, aSwing), to = Math.min(a0, aSwing + 110);
            const p = (r: number, a: number) => `${grip.x + r * Math.cos((a * Math.PI) / 180)} ${grip.y + r * Math.sin((a * Math.PI) / 180)}`;
            return <path d={`M${p(r2, from)} A${r2} ${r2} 0 0 1 ${p(r2, to)} L${p(r1, to)} A${r1} ${r1} 0 0 0 ${p(r1, from)} Z`} fill="url(#arc)" opacity={smear * 0.9} />;
          })()}
        </svg>
      ) : null}
      {t >= b.windup ? <Keeper id="k-pot" t={t} perf={perf} z={10} /> : null}
      {L07 ? <Bubble t={t} line={L07} x={head.x} y={head.y} side="left" fs={pick(fmt, { h: 46, v: 58, s: 42 })} maxW={pick(fmt, { h: 640, v: 760, s: 520 })} red until={(L08?.start ?? b.ledger) - 0.2} /> : null}
      {L08 ? <Bubble t={t} line={L08} x={head.x} y={head.y} side="left" fs={pick(fmt, { h: 38, v: 50, s: 36 })} maxW={520} until={b.proof ? b.proof[0] - 0.1 : b.ledger} /> : null}
      {ledgerShut > 0 ? <div style={{ position: "absolute", left: ledgerScreen.x, top: ledgerScreen.y, width: 1, height: 1 }}><div style={{ position: "absolute", left: -40 * k, top: -30 * k, width: 80 * k, height: 60 * k, background: film.cream, borderRadius: 8, transform: `scale(${1 + 40 * ledgerShut * ledgerShut})`, opacity: clamp(ledgerShut * 4) }} /></div> : null}
    </AbsoluteFill>
  );
}
export { Icon };
