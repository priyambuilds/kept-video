// v3 clock (docs/LAUNCH_FILM_V3_PLAN.md §2). Everything is placed in bars of the chosen song, so a tempo change
// re-snaps the whole film. B(n) = time of bar n (0-based, fractional bars allowed).
import { place } from "../data/vo";
import type { PlacedLine } from "../data/vo";
import { SONG } from "./music";

export const BAR = SONG.bar, BEAT = BAR / 4;
export const B = (n: number) => SONG.offset + n * BAR;

export const T = {
  hook: 0, freeze: B(1), slap: B(2) - BEAT, drop1: B(2), popin: B(2) + 0.45, yank: B(3.5),
  welcome: B(3.5), promise: B(6), friends: B(13), day1: B(20), arjun: B(25), drop2: B(29),
  review: B(33), day7: B(36), bounty: B(40), record: B(45), end: B(47), out: B(54),
};
export const DUR = T.out;

export const VO_PLACED: PlacedLine[] = [
  place({ id: "L01", at: B(1) + 0.02, anchor: "from" }), place({ id: "L03a", at: T.drop1, anchor: "cost" }),
  place({ id: "K03", at: T.promise + 2.9 }), place({ id: "K04", at: T.promise + 10.35 }),
  place({ id: "K05", at: T.friends + 0.5 }), place({ id: "K06", at: T.friends + 4.9 }), place({ id: "K07", at: T.friends + 6.95 }),
  place({ id: "K08", at: T.day1 + 0.7 }), place({ id: "K09", at: T.day1 + 5.25 }),
  place({ id: "K10", at: T.arjun + 3.3 }), place({ id: "K11", at: T.drop2 + 0.95 }), place({ id: "K12", at: T.drop2 + 4.75, gain: -1 }),
  place({ id: "K13", at: T.review + 0.5 }), place({ id: "K14", at: T.day7 + 0.9 }), place({ id: "K15", at: T.day7 + 4.0 }),
  place({ id: "K16", at: T.bounty + 0.3 }), place({ id: "K17", at: T.bounty + 6.7 }), place({ id: "K18", at: T.record + 0.2 }),
  place({ id: "K19", at: T.end + 0.4 }), place({ id: "K20", at: T.end + 3 * BAR + 0.15 }),
];
export const vo = (id: string) => VO_PLACED.find((l) => l.id === id)!;
