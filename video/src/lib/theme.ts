// KEPT's design tokens, read straight from design/tokens.json (the source of truth the app's
// frontend/src/theme/tokens.gen.ts is generated from), with the app's owner amendment applied
// (frontend/src/theme/supplement.ts › amend: tertiary text #6A6A6A → #808080). Film-only colours
// (brief §7 / SHOTLIST D3) are kept apart in `film` so UI never borrows them by accident.
import tokens from "../../../design/tokens.json";

export const T = tokens;
export const color = {
  ...tokens.color,
  text: { ...tokens.color.text, tertiary: "#808080" },
};

export const film = {
  /** The void behind floating UI (one step under bg.app so UI reads as a lifted layer). */
  void: "#0E0E0E",
  /** Aha + CTA background. */
  cream: "#F3ECE1",
  /** Red type on cream (#F87171 fails contrast on cream). */
  redOnCream: "#E5484D",
  ink: "#131313",
} as const;

export const radius = tokens.radius;
export const shadow = (k: keyof typeof tokens.shadow) => tokens.shadow[k].css;
export const easingTokens = tokens.motion.easing;

const lin = (deg: number, stops: readonly (readonly [string, number])[]) =>
  `linear-gradient(${deg}deg, ${stops.map(([c, p]) => `${c} ${p * 100}%`).join(", ")})`;
export const gradient = {
  card: lin(180, tokens.gradient.card.stops as [string, number][]),
  cardSheen: lin(115, tokens.gradient.cardSheen.stops as [string, number][]),
  buttonPrimary: lin(180, tokens.gradient.buttonPrimary.stops as [string, number][]),
  buttonLime: lin(180, tokens.gradient.buttonLime.stops as [string, number][]),
  moneyPill: lin(180, tokens.gradient.moneyPill.stops as [string, number][]),
  brandTile: lin(180, tokens.gradient.brandTile.stops as [string, number][]),
  coin: "radial-gradient(circle at 35% 30%, #F4FFD0 0%, #C5F25C 52%, #8FB52E 100%)",
  camera: "radial-gradient(circle at 50% 45%, #2A2A2E 0%, #0A0A0B 75%)",
};

export type TileName = keyof Omit<typeof tokens.color.tilePalette, "$doc">;
export const tile = (p: TileName) => {
  const [a, b, ink] = tokens.color.tilePalette[p] as [string, string, string];
  return { bg: `linear-gradient(150deg, ${a}, ${b})`, ink };
};

/** HP segment colour (DESIGN.md §2.7). */
export function hpSegment(i: number, hp: number, empty = tokens.color.hp.emptyOnCard): string {
  if (i >= hp / 5) return empty;
  if (hp <= 20) return tokens.color.hp.danger;
  if (hp <= 40) return tokens.color.hp.warn;
  const t = i / 19;
  return `rgb(${Math.round(94 + 103 * t)},${Math.round(234 + 8 * t)},${Math.round(212 - 120 * t)})`;
}

export const SANS = "Geist";
export const MONO = "Geist Mono";
