// S5 FEATURE 2, PROVE IT. "Take photo" grows into the ProofCamera (F1/F2/F2a/F4). The cheat (a photo
// of a screen) is scanned by the Keeper's visor glow, fails red; dead stare, "Nice try." The real photo
// (dumbbell + ✌️) passes: three checks rise green, the HP bar fills like a fuse. He tosses the lens and
// winds the scythe up (the swing itself belongs to S6).
import React from "react";
import { AbsoluteFill } from "remotion";
import { Keeper } from "../keeper/Keeper";
import { Props } from "../keeper/KeeperSVG";
import { handTrack, moodTrack, talk } from "../keeper/perf";
import { clamp, ease, kf, prog, wobble } from "../lib/anim";
import { MONO, SANS, color } from "../lib/theme";
import { Bubble } from "../ui/Caption";
import { Void } from "../ui/Backgrounds";
import { Chip, Gesture, HPBar, Icon } from "../ui/kit";
import { line } from "../data/cuts";
import { pick } from "./common";
import type { SceneProps } from "./common";
import { swingSpot } from "./layouts";

type CamState = "idle" | "check" | "fail" | "pass";
const CORNER: Record<CamState, string> = { idle: "rgba(255,255,255,0.65)", check: color.lime.base, fail: color.red.base, pass: color.lime.base };

function Corners({ c }: { c: string }) {
  const s = 34, w = 3, i = 18, r = 14;
  const one = (rot: number, x: string, y: string) => (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ position: "absolute", [x]: i, [y]: i, transform: `rotate(${rot}deg)` } as React.CSSProperties}>
      <path d={`M${w / 2} ${s} V${r} Q${w / 2} ${w / 2} ${r} ${w / 2} H${s}`} stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" />
    </svg>
  );
  return <>{one(0, "left", "top")}{one(90, "right", "top")}{one(180, "right", "bottom")}{one(270, "left", "bottom")}</>;
}

/** The "photo of a screen": a monitor showing a dumbbell (moiré, glare, bezel). */
function ScreenPhoto() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 40%, #3A3530 0%, #15130F 80%)" }}>
      <div style={{ position: "absolute", left: 38, right: 38, top: 70, height: 200, borderRadius: 10, background: "#0B0B0D", padding: 10, boxShadow: "0 10px 30px rgba(0,0,0,0.6)" }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 4, overflow: "hidden", background: "linear-gradient(160deg, #6E8FB8, #3A5578)" }}>
          <Icon name="dumbbell" size={130} fill="rgba(20,20,30,0.85)" style={{ position: "absolute", left: 70, top: 25 }} />
          <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.10) 0 2px, rgba(0,0,0,0.12) 2px 4px)" }} />
          <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(80deg, rgba(255,0,180,0.08) 0 6px, rgba(0,255,200,0.06) 6px 12px)" }} />
          <div style={{ position: "absolute", left: -40, top: -60, width: 140, height: 360, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.35), rgba(255,255,255,0))", transform: "rotate(28deg)" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 150, top: 280, width: 50, height: 30, background: "#0B0B0D" }} />
      <div style={{ position: "absolute", left: 110, top: 306, width: 130, height: 10, borderRadius: 5, background: "#0B0B0D" }} />
    </div>
  );
}

/** ProofCamera (components.md › ProofCamera), 350 × 410 dp. */
function ProofCamera({ t, b, state, photo, scan }: { t: number; b: SceneProps["cut"]["b"]; state: CamState; photo: "live" | "screen" | "real"; scan: number }) {
  const shake = state === "fail" ? wobble(t, b.fail, 6, 10, 8) : 0;
  const pill = state === "check" ? { bg: "rgba(0,0,0,0.65)", fg: color.lime.base, ic: "loading", tx: "Checking…" }
    : state === "fail" ? { bg: color.red.base, fg: "#131313", ic: "close-circle-outline", tx: "That's a screen." }
      : state === "pass" ? { bg: color.lime.base, fg: "#131313", ic: "check-bold", tx: "Proof kept" }
        : { bg: "rgba(0,0,0,0.6)", fg: "#FFFFFF", ic: "target", tx: "Dumbbell + victory sign" };
  return (
    <div style={{ width: 350, height: 410, borderRadius: 30, background: "radial-gradient(circle at 50% 45%, #2A2A2E 0%, #0A0A0B 75%)", position: "relative", overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}>
      {photo === "screen" ? <ScreenPhoto /> : null}
      {photo !== "screen" ? (
        <div style={{ position: "absolute", left: 113, top: 125 }}>
          <Icon name="dumbbell" size={124} fill={photo === "real" ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.42)"} />
          {photo === "real" ? <Gesture name="victory-sign" size={62} style={{ position: "absolute", right: -30, bottom: -14, transform: "rotate(10deg)" }} /> : null}
        </div>
      ) : (
        <Gesture name="victory-sign" size={62} style={{ position: "absolute", left: 250, top: 250, transform: `rotate(10deg) translateX(${shake}px)`, opacity: 0.95 }} />
      )}
      {state === "fail" ? <div style={{ position: "absolute", inset: 0, background: "rgba(248,113,113,0.14)" }} /> : null}
      {state === "check" ? <div style={{ position: "absolute", left: 28, right: 28, top: `${14 + 70 * scan}%`, height: 2, background: color.lime.base, boxShadow: `0 0 14px ${color.lime.base}` }} /> : null}
      <Corners c={CORNER[state]} />
      <div style={{ position: "absolute", left: 14, top: 14 }}><Chip text="Photo 1 of 2" icon="camera" tone="dark" h={30} fs={12} style={{ background: "rgba(255,255,255,0.12)", boxShadow: "none" }} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 16, display: "flex", justifyContent: "center" }}>
        <div style={{ height: 36, padding: "0 14px", borderRadius: 18, background: pill.bg, color: pill.fg, display: "flex", alignItems: "center", gap: 7, fontFamily: SANS, fontWeight: 600, fontSize: 13 }}>
          <Icon name={pill.ic} size={16} fill={pill.fg} style={{ transform: state === "check" ? `rotate(${t * 330}deg)` : undefined }} />{pill.tx}
        </div>
      </div>
    </div>
  );
}

export function S5Proof({ t, cut, fmt, W, H }: SceneProps) {
  const b = cut.b;
  const cam = pick(fmt, { h: { x: 800, y: 520, u: 1.85 }, v: { x: 540, y: 760, u: 2.3 }, s: { x: 420, y: 520, u: 1.45 } });
  const spot = swingSpot(fmt);
  const size = spot.size, k = size / 160;
  // Entry: grows out of the Oath card's "Take photo" button (28) or rides the yanked panel up (15).
  const fromCard = !!b.oath;
  const grow = fromCard ? prog(t, b.cam, 0.36, ease.enter) : 1;
  const inP = fromCard ? 1 : prog(t, b.yank, 0.38, ease.enter);
  // Camera state.
  const state: "idle" | "check" | "fail" | "pass" = t < b.cheat + 0.1 ? "idle" : t < b.fail ? "check" : t < b.real ? "fail" : t < b.real + 0.12 ? "check" : "pass";
  const photo = t < b.cheat ? "live" : t < b.real ? "screen" : "real";
  const scan = (Math.sin(((t - b.cheat) / 0.75) * Math.PI - Math.PI / 2) + 1) / 2;
  const flash = Math.max(prog(t, b.cheat, 0.12) * (1 - prog(t, b.cheat + 0.04, 0.14)), prog(t, b.real, 0.1) * (1 - prog(t, b.real + 0.04, 0.14)));
  // Keeper: floats in from the card side, lens up; leans in to scan; dead stare; slow blink; toss; wind-up.
  const lines = cut.vo.filter((l) => l.id === "L05" || l.id === "L06");
  const startX = fromCard ? cam.x - 300 : spot.x;
  const blinkAt = b.fail + 0.14;
  const perf = (tt: number) => {
    const lean = kf(tt, [[b.cheat, 0], [b.cheat + 0.25, -9, ease.inOut], [b.fail - 0.05, -9], [b.fail + 0.15, 0, ease.out], [b.windup, 0], [b.drop2 - 0.05, 7, ease.inOut]]);
    const x = kf(tt, [[b.cam, startX], [b.cam + 0.5, spot.x, ease.inOut], [b.cheat, spot.x], [b.cheat + 0.25, spot.x - 80, ease.inOut], [b.fail, spot.x - 80], [b.fail + 0.3, spot.x, ease.inOut]]);
    const moods: [number, "neutral" | "bored" | "stern"][] = [[0, "neutral"], [blinkAt + 0.08, "bored"], [b.windup - 0.02, "stern"]];
    const mt = moodTrack(tt, moods);
    // The slow blink after the ✗: closed 10 frames, opening over 6 (RECON G11).
    const slow = tt > blinkAt && tt < blinkAt + 0.4 ? kf(tt, [[blinkAt, 1], [blinkAt + 0.07, 0.12, ease.in], [blinkAt + 0.24, 0.12], [blinkAt + 0.34, 1, ease.out]]) : 1;
    const holdingLens = tt < b.real + 0.1;
    const scythe = tt >= b.windup - 0.08;
    const Rh = handTrack(tt, [
      [b.cam, null], [b.cheat - 0.2, [140, 92, -15, "fist"], ease.inOut], [b.cheat + 0.25, [112, 70, -35, "fist"], ease.inOut], [b.fail, [112, 72, -35, "fist"]], [b.fail + 0.25, [132, 118, 10, "fist"], ease.inOut],
      [b.real, [132, 118, 10, "fist"]], [b.real + 0.08, [150, 60, -60, "open"], ease.out], [b.real + 0.3, null],
      [b.windup - 0.08, [118, 122, 0, "fist"]], [b.drop2 - 0.04, [150, 34, -75, "fist"], ease.out],
    ]);
    const shake = tt > (lines.find((l) => l.id === "L06")?.start ?? 99) ? 3 * Math.sin((tt - (lines.find((l) => l.id === "L06")!.start)) * 9) * Math.exp(-Math.max(0, tt - lines.find((l) => l.id === "L06")!.start) * 1.5) : 0;
    const wind = prog(tt, b.windup, b.drop2 - b.windup, ease.inOut);
    const sp = talk(lines, tt, { eyes: Math.min(mt.eyes, slow), gx: tt > b.fail ? -1 : -5, tilt: shake, sy: 1 - 0.05 * wind, sx: 1 + 0.03 * wind });
    return {
      x, y: spot.y + (1 - inP) * H, size, lean,
      draw: { mood: mt.mood, prop: (scythe ? "scythe" : holdingLens ? "lens" : "none") as "scythe" | "lens" | "none", attach: true, scytheFront: true, t: tt + 3.3, wiggle: sp.wiggle, over: { ...sp.over, ...(Rh ? { right: Rh } : {}) } },
    };
  };
  const kNow = perf(t);
  // Visor glow → scan beam from his visor to the photo while checking the cheat.
  const beam = t > b.cheat + 0.15 && t < b.fail ? clamp(prog(t, b.cheat + 0.15, 0.15) * (1 - prog(t, b.fail - 0.08, 0.08))) : 0;
  const visor = { x: kNow.x + (80 - 80) * k - 10 * k, y: kNow.y - (178 - 36) * k };
  const camR = { x0: cam.x - 175 * cam.u, x1: cam.x + 175 * cam.u, y0: cam.y - 205 * cam.u, y1: cam.y + 205 * cam.u };
  const scanY = camR.y0 + (0.14 + 0.7 * scan) * (camR.y1 - camR.y0);
  // Checks + HP fuse.
  const chips: [string, string][] = [["Dumbbell", "dumbbell"], ["Victory sign", "hand-peace"], ["Real photo", "shield-check-outline"]];
  const hpFill = prog(t, b.checks[2], 0.35, ease.out);
  const L05 = line(cut, "L05"), L06 = line(cut, "L06");
  const head = { x: kNow.x - 40 * k, y: kNow.y - 150 * k };
  const lensFly = prog(t, b.real + 0.08, 0.6, ease.linear);
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inP) * H}px)`, borderRadius: inP < 1 ? 60 : 0, overflow: "hidden" }}>
      <Void t={t} W={W} H={H} tone={state === "fail" ? "red" : "lime"} />
      <div style={{ position: "absolute", left: cam.x, top: cam.y, transform: `translate(-50%,-50%) scale(${cam.u * (0.25 + 0.75 * grow)}) translateY(${(1 - grow) * 300}px)`, borderRadius: 30, opacity: clamp(grow * 3) }}>
        <ProofCamera t={t} b={b} state={state} photo={photo} scan={scan} />
        {t >= b.checks[0] ? (
          <div style={{ position: "absolute", left: 16, top: 52, display: "flex", flexDirection: "column", gap: 6 }}>
            {chips.map(([tx, ic], i) => { const p = prog(t, b.checks[i], 0.3, ease.springHard); return (
              <div key={tx} style={{ transform: `translateY(${(1 - p) * 20}px) scale(${0.6 + 0.4 * p})`, transformOrigin: "0 50%", opacity: clamp(p * 2) }}><Chip text={`${tx} ✓`} icon={ic} tone="lime" h={30} fs={13} style={{ background: "rgba(19,19,19,0.85)" }} /></div>
            ); })}
          </div>
        ) : null}
        {t >= b.checks[2] - 0.05 ? (
          <div style={{ position: "absolute", left: 16, right: 16, bottom: -42 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 11, fontWeight: 600, letterSpacing: 1.2, color: color.text.secondary, marginBottom: 5 }}><span>OATH HP</span><span style={{ color: "#fff" }}>{Math.round(100 * hpFill)} / 100</span></div>
            <HPBar hp={100} shown={Math.round(20 * hpFill)} />
            {hpFill > 0 && hpFill < 1.01 && t < b.drop2 ? <div style={{ position: "absolute", left: `${hpFill * 100}%`, bottom: -4, width: 14, height: 14, borderRadius: 7, background: color.lime.hi, boxShadow: `0 0 18px 6px ${color.lime.base}`, transform: `translateX(${prog(t, b.checks[2] + 0.35, 0.15) * 400}px)` }} /> : null}
          </div>
        ) : null}
      </div>
      {flash > 0 ? <div style={{ position: "absolute", left: camR.x0, top: camR.y0, width: camR.x1 - camR.x0, height: camR.y1 - camR.y0, borderRadius: 30 * cam.u, background: "#fff", opacity: flash }} /> : null}
      {beam > 0 ? (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <defs><linearGradient id="beam" x1="1" x2="0"><stop offset="0" stopColor={color.lime.base} stopOpacity={0.55} /><stop offset="1" stopColor={color.lime.base} stopOpacity={0.05} /></linearGradient></defs>
          <polygon points={`${visor.x},${visor.y - 8 * k} ${visor.x},${visor.y + 8 * k} ${camR.x1 - 30},${scanY + 30} ${camR.x0 + 40},${scanY + 6} ${camR.x0 + 40},${scanY - 6} ${camR.x1 - 30},${scanY - 30}`} fill="url(#beam)" opacity={beam} />
        </svg>
      ) : null}
      {t < cut.b.windup ? <Keeper id="k-proof" t={t} perf={perf} z={5} /> : null}
      {lensFly > 0 && lensFly < 1 ? (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <g transform={`translate(${kNow.x + (lensFly * 260 - 30) * (k / 2.2)} ${kNow.y - 300 * k / 2.2 - 500 * lensFly + 900 * lensFly * lensFly}) rotate(${lensFly * 540}) scale(${k}) translate(-137 -95)`}><Props.lens /></g>
        </svg>
      ) : null}
      {L05 ? <Bubble t={t} line={L05} x={head.x} y={head.y} side="left" fs={pick(fmt, { h: 44, v: 56, s: 40 })} maxW={pick(fmt, { h: 560, v: 720, s: 460 })} until={(L06?.start ?? 99) - 0.15} /> : null}
      {L06 ? <Bubble t={t} line={L06} x={head.x} y={head.y} side="left" fs={pick(fmt, { h: 52, v: 64, s: 46 })} maxW={600} red until={b.real + 0.2} /> : null}
    </AbsoluteFill>
  );
}
