// The launch film's clock (docs/LAUNCH_FILM_PLAN.md §3): chapter starts, the two drops, VO placements.
// 137.14 BPM → 1 bar = 1.75 s. Drop 1 = 5.25 (bar 4), drop 2 = 45.5 (bar 27).
import { place } from "../data/vo";
import type { PlacedLine } from "../data/vo";

export const T = {
  hook: 0, reveal: 5.25, signin: 8.75, oath: 15.75, today: 29.75, proof: 33.25, stakes: 43.75, drop2: 45.5,
  bounty: 56.0, profile: 68.25, wall: 72.5, cta: 77.0, end: 87.5,
};
export const DUR = T.end;

export const VO_PLACED: PlacedLine[] = [
  place({ id: "V01", at: 0.45 }), place({ id: "V02", at: 3.05 }), place({ id: "V03", at: 5.9 }),
  place({ id: "V04", at: 16.0 }), place({ id: "V05", at: 23.55 }), place({ id: "V06", at: 28.35 }),
  place({ id: "V07", at: 33.55 }), place({ id: "V08", at: 44.15 }), place({ id: "V09", at: 45.6 }), place({ id: "V10", at: 49.6, gain: -1.5 }),
  place({ id: "V11", at: 56.5 }), place({ id: "V12", at: 62.4 }), place({ id: "V13", at: 69.0 }),
  place({ id: "V14", at: 78.2 }), place({ id: "V15", at: 82.9 }),
];
export const vo = (id: string) => VO_PLACED.find((l) => l.id === id)!;
