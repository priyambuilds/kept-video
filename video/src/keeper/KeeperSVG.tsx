// The Keeper drawn as SVG: the template of design/reference/Keeper.dc.html, in the paint order of
// frontend/src/components/keeper/KeeperSkia.tsx, fed by rig.ts › keeperFrame for one frame. Nothing is
// redrawn: every path, colour and transform below is the prototype's. Film-only extras (all optional,
// off = the app's look): props riding the hand they're held in, the scythe drawn in front while it's
// swung, a stitch wiggle for speech, a visor glint sweep, and a motion smear for fast gloves.
import React from "react";
import { K, RIGHT_HAND, inv, keeperFace, keeperFrame, mtx, mul, q, rotAbout, stitchPaths, trs } from "./rig";
import type { FrameOver, HandPose, KeeperAnimName, KeeperMood, KeeperPropName } from "./rig";

export interface KeeperDrawProps {
  id: string;
  mood: KeeperMood;
  prop?: KeeperPropName;
  anim?: KeeperAnimName;
  hand?: HandPose | null;
  /** Rig time in seconds (0 = still pose). */
  t: number;
  over?: FrameOver;
  /** Held props follow the right hand (needed whenever the hand is moved by `over`). */
  attach?: boolean;
  /** Scythe in front of the body (while swung) instead of behind it. */
  scytheFront?: boolean;
  /** Stitch control-point wiggle in rig units (speech). */
  wiggle?: number;
  /** Visor glint sweep progress 0..1 (outside = none). */
  glint?: number;
  /** Ghost copies of the right glove for a fast move: previous hand matrices, newest first. */
  smear?: number[][];
  /** Hide the floor shadow (the scene draws its own). */
  noFloor?: boolean;
  /** Head only (the app's bust: viewBox 28 4 104 104, no body, hands or props). */
  bust?: boolean;
}

const ink = 0.8, thin = 0.75;
const R = (x: number, y: number, w: number, h: number, r: number, fill: string, rot?: [number, number, number]) => (
  <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={K.ink} strokeWidth={ink} {...(rot ? { transform: `rotate(${rot[0]} ${rot[1]} ${rot[2]})` } : {})} />
);
const C = (cx: number, cy: number, r: number, fill: string) => <circle cx={cx} cy={cy} r={r} fill={fill} stroke={K.ink} strokeWidth={ink} />;
const knuckles = (four: boolean) => (
  <>
    {four ? C(-4.4, -5.6, 2.1, K.face) : null}
    {C(-1.4, -6.3, 2.1, K.face)}{C(1.7, -6.2, 2.1, K.face)}{C(4.6, -5.4, 2, K.faceShade)}
  </>
);
const palm = (
  <>
    {R(-6.8, -6.5, 13.6, 13, 5.2, K.face)}
    <path d="M3.4 -3.5 Q6 -1 5.2 4" stroke={K.bone2} strokeWidth={2.4} fill="none" strokeLinecap="round" />
  </>
);
const hi = <path d="M-5 -2.5 Q-4 -4.6 -1.8 -5" stroke={K.white} strokeWidth={1.2} fill="none" strokeLinecap="round" />;
const creases3 = <path d="M-2.9 -4.6 v3 M0.2 -4.9 v3.2 M3.2 -4.5 v3" stroke={K.ink} strokeWidth={thin} />;

function HandShape({ pose, wig }: { pose: HandPose; wig: number }) {
  switch (pose) {
    case "open": return (
      <>
        {R(-11.4, -3.5, 3.5, 9, 1.75, K.face, [-50, -8, 1])}
        <g transform={`rotate(${wig} 0 -5)`}>
          {R(-6.3, -15, 3.2, 11, 1.6, K.face, [-11, -4.6, -4])}
          {R(-2.6, -17, 3.2, 13, 1.6, K.face, [-3, -1, -4])}
          {R(1, -16.5, 3.2, 12.5, 1.6, K.face, [5, 2.6, -4])}
          {R(4.5, -13.5, 3, 10, 1.5, K.faceShade, [14, 6, -4])}
          <path d="M-6.2 -9.6 l2.4 -.5 M-2.4 -11 l2.6 0 M1.5 -10.6 l2.6 .3 M5.2 -8.6 l2.2 .6" stroke={K.ink} strokeWidth={thin} fill="none" />
        </g>
        {palm}{hi}
      </>
    );
    case "fist": return <>{knuckles(true)}{palm}{creases3}{R(-8.6, -0.4, 9.6, 3.7, 1.85, K.face)}{hi}</>;
    case "point": return (
      <>
        {R(-6.2, -19, 3.4, 14, 1.7, K.face)}
        <path d="M-6 -12.5 l3 0" stroke={K.ink} strokeWidth={thin} />
        {knuckles(false)}{palm}
        <path d="M0.2 -4.9 v3.2 M3.2 -4.5 v3" stroke={K.ink} strokeWidth={thin} />
        {R(-8.6, -0.4, 9.6, 3.7, 1.85, K.face)}{hi}
      </>
    );
    case "thumb": return <>{R(-9.8, -17, 3.8, 13, 1.9, K.face, [-6, -8, -4])}{knuckles(true)}{palm}{creases3}{hi}</>;
  }
}

function HandG({ m, pose, wig, opacity }: { m: number[]; pose: HandPose; wig: number; opacity?: number }) {
  return (
    <g transform={mtx(m)} opacity={opacity}>
      <ellipse cx={0} cy={7.6} rx={6.4} ry={3.4} fill={K.fistShade} />
      <HandShape pose={pose} wig={wig} />
    </g>
  );
}

export const Scythe = () => (
  <g>
    <path d="M126 34 L112 176" stroke={K.steel} strokeWidth={5} strokeLinecap="round" />
    <path d="M126 34 L112 176" stroke={K.shaftHi} strokeWidth={1.2} transform="translate(1.6 0)" />
    <path d="M128 38 C104 12 70 10 40 26 C68 22 98 28 120 50 Z" fill={K.blade} />
    <path d="M40 26 C68 22 98 28 120 50" stroke={K.lime} strokeWidth={2} fill="none" />
    <path d="M58 22 C80 16 100 20 116 34" stroke={K.white} strokeWidth={1.4} fill="none" opacity={0.6} />
  </g>
);

const Body = () => (
  <g>
    <path d="M36 104 C27 128 21 150 15 172 L30 165 L40 176 L54 167 L67 177 L80 168 L93 177 L106 167 L120 176 L130 165 L145 172 C139 150 133 128 124 104 Z" fill={K.cloak} />
    <path d="M36 104 C28 128 22 150 16 171 L30 165 L36 171 C38 148 40 126 46 108 Z" fill={K.cloakHi} />
    <path d="M62 116 C60 134 58 152 55 166 M98 116 C100 134 102 152 105 166 M80 122 L80 166" stroke={K.ink2} strokeWidth={2.4} fill="none" strokeLinecap="round" />
    <path d="M124 104 C133 128 139 150 145 172" stroke={K.lime} strokeWidth={2} fill="none" opacity={0.6} />
    <path d="M68 112 L80 122 L92 112" stroke={K.seam} strokeWidth={1.6} fill="none" />
    <circle cx={80} cy={127} r={7.5} fill={K.lime} />
    <circle cx={80} cy={127} r={4.4} fill="none" stroke={K.limeDeep} strokeWidth={1.5} />
    <path d="M76 123 Q78 121 81 121" stroke={K.hilite} strokeWidth={1.3} fill="none" strokeLinecap="round" />
  </g>
);

const BRIM = "M30 43 Q80 19 130 43 Q132 49 125 50 Q80 30 35 50 Q28 49 30 43 Z";

function Head({ id, glint }: { id: string; glint?: number }) {
  return (
    <g>
      <g transform="rotate(-26 30 40)">
        <rect x={17} y={20} width={24} height={33} rx={3.5} fill={K.ink} />
        <rect x={16} y={19} width={24} height={33} rx={3.5} fill={K.paper} />
        <rect x={18.5} y={21.5} width={19} height={28} rx={2} fill="none" stroke={K.lime} strokeWidth={1.2} />
        <text x={20.5} y={30} fontFamily="Geist" fontWeight={800} fontSize={8} fill={K.ink}>A</text>
        <path d="M28 34 C24 38 23 41 26 42 C27 42.5 28 41.6 28 41 L27 45 L29 45 L28 41 C28 41.6 29 42.5 30 42 C33 41 32 38 28 34 Z" fill={K.ink} />
        <path d="M18 21 L36 21" stroke={K.white} strokeWidth={1} opacity={0.9} />
      </g>
      <path d="M80 8 C108 8 126 30 130 62 C132 84 128 104 122 118 C108 126 52 126 38 118 C32 104 28 84 30 62 C34 30 52 8 80 8 Z" fill={K.hood} />
      <path d="M90 10 C106 4 120 6 131 18 C118 13 106 15 98 19 Z" fill={K.hood} />
      <path d="M38 40 C33 56 32 74 35 92 C37 104 41 112 46 117 C40 100 38 80 40 62 C41 52 44 44 49 34 Z" fill={K.hoodHi} />
      <path d="M122 30 C130 44 133 64 131 86 C130 98 127 108 123 116" stroke={K.lime} strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.75} />
      <path d="M54 18 C64 11 84 9 100 13" stroke={K.white} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.3} />
      <path d="M80 22 C100 22 114 38 116 62 C118 86 110 104 100 111 L60 111 C50 104 42 86 44 62 C46 38 60 22 80 22 Z" fill={K.void} stroke={K.rim} strokeWidth={1.5} />
      <path d="M80 23 C103 23 115 40 115 60 C115 79 104 93 92 99 C86 102 74 102 68 99 C56 93 45 79 45 60 C45 40 57 23 80 23 Z" fill={K.face} />
      <path d="M100 31 C110 40 115 50 115 60 C115 79 104 93 92 99 C88 101 84 101.5 81 101.5 C92 96 104 84 106 66 C107 52 105 40 100 31 Z" fill={K.faceShade} />
      <path d="M58 33 C64 27 72 25 80 25" stroke={K.white} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.8} />
      <path d="M51 76 Q53 86 60 92" stroke={K.white} strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.55} />
      <path d="M46 50 Q80 31 114 50 Q80 42 46 54 Z" fill={K.brimShade} />
      <path d="M33 39 Q80 15 127 39" stroke={K.brimInk} strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d="M33 39 Q80 15 127 39" stroke={K.limeDark} strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d={BRIM} fill={K.brim} stroke={K.lime} strokeWidth={1.4} />
      <path d="M38 43 Q80 24 122 43" stroke={K.white} strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.75} />
      <path d="M36 48 Q80 28 124 48" stroke={K.limeMoss} strokeWidth={1.4} fill="none" opacity={0.7} />
      {glint !== undefined && glint > 0 && glint < 1 ? (
        <g clipPath={`url(#${id}-brim)`}>
          <rect x={20 + glint * 130} y={10} width={14} height={50} fill="#FFFFFF" opacity={0.85} transform={`rotate(-20 ${27 + glint * 130} 35)`} />
        </g>
      ) : null}
    </g>
  );
}

const Shades = () => (
  <g>
    <path d="M44 57 Q80 51 116 57 Q117 75 101 75 Q88 75 86 64 Q80 61 74 64 Q72 75 59 75 Q43 75 44 57 Z" fill={K.shades} stroke={K.shadesRim} strokeWidth={1.2} />
    <path d="M53 62 Q58 59 64 60 M89 62 Q94 59 100 60" stroke={K.lime} strokeWidth={2.6} fill="none" strokeLinecap="round" />
    <path d="M106 60 L110 66 M68 60 L71 64" stroke={K.white} strokeWidth={1.6} strokeLinecap="round" opacity={0.55} />
  </g>
);

export const Props = {
  seal: () => (
    <g><rect x={122} y={80} width={12} height={22} rx={5} fill={K.steel} stroke={K.steelHi} /><rect x={116} y={100} width={24} height={9} rx={2.5} fill={K.lime} /><rect x={116} y={106} width={24} height={3} fill={K.seal} /></g>
  ),
  ledger: () => (
    <g transform="rotate(-12 120 134)"><rect x={100} y={120} width={40} height={30} rx={3} fill={K.steel} /><rect x={102} y={118} width={36} height={28} rx={2} fill={K.face} /><path d="M120 119 L120 145" stroke={K.ledgerLine} strokeWidth={1.5} /><path d="M106 126 L116 126 M106 131 L116 131 M106 136 L114 136 M124 126 L134 126 M124 131 L132 131" stroke={K.ledgerInk} strokeWidth={1.5} /><rect x={128} y={114} width={5} height={12} fill={K.lime} /></g>
  ),
  lens: () => (
    <g><path d="M131 104 L127 116" stroke={K.steelHi} strokeWidth={5} strokeLinecap="round" /><circle cx={137} cy={90} r={13} fill={K.lensGlass} stroke={K.lens} strokeWidth={4} /><path d="M130 84 Q133 80 138 80" stroke={K.white} strokeWidth={2} fill="none" strokeLinecap="round" /></g>
  ),
  coin: () => (
    <g><circle cx={136} cy={98} r={12} fill={K.seal} /><circle cx={135} cy={96} r={12} fill={K.lime} /><circle cx={135} cy={96} r={7.5} fill="none" stroke={K.limeDeep} strokeWidth={1.8} /><path d="M129 90 Q132 87 136 87" stroke={K.hilite} strokeWidth={1.6} fill="none" strokeLinecap="round" /></g>
  ),
  sack: () => (
    <g><path d="M129 98 Q126 92 133 91 L145 91 Q151 92 147 98 Q160 108 156 124 Q153 132 138 132 Q123 132 120 124 Q116 108 129 98 Z" fill={K.lime} /><path d="M142 100 Q154 110 151 124 Q149 130 140 131 Q150 122 146 104 Z" fill={K.sackShade} /><path d="M129 98 L147 98" stroke={K.sackDeep} strokeWidth={2.4} /><path d="M133 116 L143 116 M138 110 L138 122" stroke={K.limeDark} strokeWidth={2.2} strokeLinecap="round" /></g>
  ),
  cup: () => (
    <g><rect x={112} y={110} width={20} height={24} rx={4} fill={K.face} /><rect x={126} y={110} width={6} height={24} rx={3} fill={K.cupShade} /><path d="M132 115 Q140 117 132 126" stroke={K.face} strokeWidth={3} fill="none" /><path d="M117 104 Q114 99 118 95 Q121 91 118 86 M124 104 Q121 99 125 95" stroke={K.steam} strokeWidth={1.8} fill="none" strokeLinecap="round" /></g>
  ),
};

/** Lip-sync geometry: the gap under the stitch. Corners pull in for round vowels; the lower lip drops by jaw. */
function openGeom(st: readonly [number, number, number], wiggle: number, jaw: number, round: number) {
  const [a, b0, c] = [st[0], st[1] + wiggle, st[2]];
  const inset = 5 + 7 * round * jaw;
  const xl = 60 + inset, xr = 100 - inset;
  const yl = q(inset / 40, a, b0, c), yr = q(1 - inset / 40, a, b0, c);
  const drop = (11 + 3 * (1 - round)) * jaw;
  const top = (u: number) => q(u, yl, b0 - 1.2 * jaw, yr);
  const bot = (u: number) => q(u, yl, Math.max(yl, yr) + 2 * drop, yr);
  return { xl, xr, yl, yr, drop, top, bot, d: `M${xl} ${yl} Q80 ${b0 - 1.2 * jaw} ${xr} ${yr} Q80 ${Math.max(yl, yr) + 2 * drop} ${xl} ${yl} Z` };
}
function StitchOpen(p: { st: readonly [number, number, number]; wiggle: number; jaw: number; round: number }) {
  const g = openGeom(p.st, p.wiggle, p.jaw, p.round);
  return <path d={g.d} fill={K.ink} />;
}
/** The stitches stretched across the open mouth (bone-coloured threads). */
function StitchThreads(p: { st: readonly [number, number, number]; wiggle: number; jaw: number; round: number }) {
  const g = openGeom(p.st, p.wiggle, p.jaw, p.round);
  const d = [0.18, 0.39, 0.61, 0.82].map((u) => {
    const x = 60 + 40 * u;
    if (x < g.xl + 1.5 || x > g.xr - 1.5) return "";
    const v = (x - g.xl) / (g.xr - g.xl);
    return `M${x.toFixed(1)} ${(g.top(v) + 0.8).toFixed(1)} L${x.toFixed(1)} ${(g.bot(v) - 0.8).toFixed(1)}`;
  }).join(" ");
  return <path d={d} stroke={K.face} strokeWidth={1.5} strokeLinecap="round" opacity={0.92} />;
}

export function KeeperSVG(p: KeeperDrawProps) {
  const prop = p.prop ?? "none", anim = p.anim ?? "idle";
  const face = keeperFace(p.mood, prop, false);
  const fr = keeperFrame(p.mood, prop, anim, p.hand ?? null, face.tilt, face.gx, face.gyBase, p.t, p.over ?? {});
  const st = face.stitch ? stitchPaths(face.stitch, p.wiggle ?? 0) : null;
  const jaw = Math.max(0, Math.min(1, p.over?.jaw ?? 0));
  // A held prop rides the hand: (hand now) · (hand where the prop was drawn)⁻¹.
  const home = RIGHT_HAND[prop] ?? RIGHT_HAND.none;
  const ride = p.attach ? mtx(mul(fr.right.m, inv(trs(home[0], home[1], home[2], 1.75, 1.75)))) : undefined;
  const coinOn = anim === "flip" || prop === "flip";
  const held = (["seal", "ledger", "lens", "coin", "sack", "cup"] as const).filter((k) => face.props[k]);
  const scythe = face.props.scythe;
  const scytheG = scythe ? <g transform={ride}><Scythe /></g> : null;
  return (
    <g>
      <defs>
        <clipPath id={`${p.id}-mouth`}><path d={face.mouth ?? "M0 0"} /></clipPath>
        <clipPath id={`${p.id}-brim`}><path d={BRIM} /></clipPath>
      </defs>
      <g transform={mtx(fr.root)}>
        {p.noFloor || p.bust ? null : <ellipse cx={80} cy={176} rx={54} ry={4} fill={K.floor} />}
        {scythe && !p.scytheFront && !p.bust ? scytheG : null}
        {p.bust ? null : <>
        <Body />
        <path d={fr.sl} stroke={K.sleeve} strokeWidth={16} strokeLinecap="round" fill="none" />
        <path d={fr.sr} stroke={K.sleeve} strokeWidth={16} strokeLinecap="round" fill="none" />
        <path d={fr.sr} stroke={K.sleeveHi} strokeWidth={1.2} fill="none" transform="translate(5 -2)" />
        </>}
        <g transform={mtx(fr.tilt)}>
          <Head id={p.id} glint={p.glint} />
          <g transform={mtx(fr.blink)}>
            {face.bean ? <path d={face.eL} fill={K.ink} /> : null}
            {face.beanR ? <path d={face.eR} fill={K.ink} /> : null}
            {face.glL ? <circle cx={69 + fr.gx} cy={fr.gy} r={face.gr} fill="#fff" /> : null}
            {face.glR ? <circle cx={97 + fr.gx} cy={fr.gy} r={face.gr} fill="#fff" /> : null}
            {face.glL ? <circle cx={63 + fr.gx} cy={fr.gy + 4} r={1.2} fill="#fff" /> : null}
            {face.glR ? <circle cx={91 + fr.gx} cy={fr.gy + 4} r={1.2} fill="#fff" /> : null}
            {face.arcL ? <path d="M56 66 Q66 50 76 66" stroke={K.ink} strokeWidth={6.5} fill="none" strokeLinecap="round" /> : null}
            {face.arcR ? <path d="M84 66 Q94 50 104 66" stroke={K.ink} strokeWidth={6.5} fill="none" strokeLinecap="round" /> : null}
          </g>
          <path d="M80 77.5 C78.4 75.6 75.8 76.6 76.4 79 C77 80.8 78.6 82 80 83 C81.4 82 83 80.8 83.6 79 C84.2 76.6 81.6 75.6 80 77.5 Z" fill={K.ink} />
          {st && jaw > 0.02 ? <StitchOpen st={face.stitch!} wiggle={p.wiggle ?? 0} jaw={jaw} round={p.over?.round ?? 0} /> : null}
          {st ? <path d={st.stitch} stroke={K.ink} strokeWidth={3.2} fill="none" strokeLinecap="round" /> : null}
          {st ? <path d={st.ticks} stroke={K.ink} strokeWidth={2.4} fill="none" strokeLinecap="round" /> : null}
          {st && jaw > 0.02 ? <StitchThreads st={face.stitch!} wiggle={p.wiggle ?? 0} jaw={jaw} round={p.over?.round ?? 0} /> : null}
          <g transform={face.mouth && jaw > 0.02 ? `translate(0 84) scale(${1 - 0.12 * (p.over?.round ?? 0) * jaw} ${1 + 0.5 * jaw}) translate(0 -84)` : undefined}>
            {face.mouth ? <path d={face.mouth} fill={K.ink} /> : null}
            {face.teeth ? <g clipPath={`url(#${p.id}-mouth)`}><path d={face.teeth} fill={K.face} /></g> : null}
          </g>
          <g transform={face.shadesSmall ? "translate(80 12) scale(0.62 0.46) translate(-80 -60)" : undefined}><Shades /></g>
          {face.vein ? <path d="M104 62 Q108 64 106 68 M112 62 Q108 64 110 68 M103 67 Q107 64 111 67" stroke={K.face} strokeWidth={1.8} fill="none" strokeLinecap="round" /> : null}
        </g>
        {face.spark && !p.bust ? <path d="M128 30 L130.5 37.5 L138 40 L130.5 42.5 L128 50 L125.5 42.5 L118 40 L125.5 37.5 Z" fill={K.lime} /> : null}
        {face.lines && !p.bust ? <path d="M62 2 L66 10 M80 -2 L80 7 M98 2 L94 10" stroke={K.face} strokeWidth={2.4} strokeLinecap="round" /> : null}
        {coinOn && !p.bust ? (
          <g>
            {fr.coin.trail ? <path d={`M140 110 Q144 ${fr.coin.ty} 136 ${fr.coin.ty2}`} stroke={K.lime} strokeWidth={1.6} fill="none" strokeLinecap="round" strokeDasharray="2 5" opacity={0.55} /> : null}
            <g transform={`translate(0 ${fr.coin.y})`}>
              <ellipse cx={133} cy={106} rx={10} ry={fr.coin.ry} fill={K.limeDeep} />
              <ellipse cx={133} cy={105} rx={10} ry={fr.coin.ry} fill={fr.coin.fill} stroke={K.ink} strokeWidth={1} />
              {fr.coin.face ? <ellipse cx={133} cy={105} rx={5.5} ry={fr.coin.ry2} fill="none" stroke={K.limeDark} strokeWidth={1.6} /> : null}
              {fr.coin.face ? <path d="M127 101 Q130 99 134 99" stroke={K.coinLight} strokeWidth={1.8} fill="none" strokeLinecap="round" /> : null}
            </g>
          </g>
        ) : null}
        {p.bust ? null : <>
        {held.map((k) => { const P = Props[k]; return <g key={k} transform={ride}><P /></g>; })}
        {scythe && p.scytheFront ? scytheG : null}
        <HandG m={fr.left.m} pose={fr.left.pose} wig={fr.left.wig} />
        {(p.smear ?? []).map((m, i) => <HandG key={i} m={m} pose={fr.right.pose} wig={0} opacity={0.28 / (i + 1)} />)}
        <HandG m={fr.right.m} pose={fr.right.pose} wig={fr.right.wig} />
        </>}
      </g>
    </g>
  );
}

/** The right hand's matrix for a frame (for smears): same inputs as KeeperSVG. */
export function rightHandMatrix(p: KeeperDrawProps): number[] {
  const prop = p.prop ?? "none";
  const face = keeperFace(p.mood, prop, false);
  return keeperFrame(p.mood, prop, p.anim ?? "idle", p.hand ?? null, face.tilt, face.gx, face.gyBase, p.t, p.over ?? {}).right.m;
}
export { rotAbout };
