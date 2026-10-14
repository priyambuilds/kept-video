// Shared positions where one scene hands the Keeper to the next (S5 wind-up → S6 swing).
import type { Fmt } from "./common";
import { pick } from "./common";

/** The Keeper's spot for the proof → pot handoff (same in both scenes, so the swing is continuous). */
export const swingSpot = (fmt: Fmt) => pick(fmt, {
  h: { x: 1560, y: 1010, size: 360 },
  v: { x: 790, y: 1820, size: 500 },
  s: { x: 860, y: 1050, size: 340 },
});
