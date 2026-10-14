// v4 (final) clock, in bars of the score (take B_23 re-cut by edit_song.py B_23 v4 → edit4.wav, 58 bars).
// docs/LAUNCH_FILM_V4.md §2. B(n) = time of bar n.
import { place } from "../data/vo";
import type { PlacedLine } from "../data/vo";
import vo5Json from "../data/vo5.json";

export const SONG4 = { file: "gen/music/song/edit4.wav", bar: 1.95115, bars: 58 };
export const BAR = SONG4.bar, BEAT = BAR / 4;
export const B = (n: number) => n * BAR;

export const T = {
  hook: 0, drop1: B(3), signin: B(5), oath: B(9), friends: B(16), day1: B(23), arjun: B(28), drop2: B(32),
  review: B(36), day7: B(39), bounty: B(43), record: B(48), wall: B(50), cta: B(52), out: B(58),
};
export const DUR4 = T.out;

/** The Keeper's lines (transcript: scripts/vo/script4.json → data/vo4.json). Silent in the film; they drive
 *  his lip-sync, his speech beats and the subtitles, and export to SRT / the timing sheet. */
export const LINES: PlacedLine[] = [
  place({ id: "F01", at: 0.5 }), place({ id: "F02", at: 3.2 }),
  place({ id: "F03", at: T.drop1 + 0.75 }), place({ id: "F04", at: T.signin + 0.3 }), place({ id: "F05", at: T.signin + 4.6 }),
  place({ id: "F06", at: T.oath + 0.15 }), place({ id: "F07", at: T.oath + 5.0 }), place({ id: "F08", at: T.oath + 7.85 }),
  place({ id: "F09", at: T.friends + 0.35 }), place({ id: "F10", at: T.friends + 3.4 }), place({ id: "F11", at: T.friends + 7.25 }), place({ id: "F12", at: T.friends + 11.15 }),
  place({ id: "F13", at: T.day1 + 0.4 }), place({ id: "F14", at: T.day1 + 5.1 }),
  place({ id: "F15", at: T.arjun + 3.2 }), place({ id: "F16", at: T.arjun + 5.5 }),
  place({ id: "F17", at: T.drop2 + 0.9 }), place({ id: "F18", at: T.drop2 + 4.75 }),
  place({ id: "F19", at: T.review + 0.4 }),
  place({ id: "F20", at: T.day7 + 0.6 }), place({ id: "F21", at: T.day7 + 4.4 }),
  place({ id: "F22", at: T.bounty + 0.3 }), place({ id: "F23", at: T.bounty + 6.6 }),
  place({ id: "F24", at: T.record + 0.35 }),
  place({ id: "F25", at: T.cta + 1.0 }), place({ id: "F26", at: T.cta + 5.2 }),
];
export const line = (id: string) => LINES.find((l) => l.id === id)!;

/** v5: the rewritten script (scripts/vo/script5.json → data/vo5.json, docs/KEEPER_VOICE_GUIDE.md). Same picture;
 *  each line sits at the film time stored in vo5.json. */
export const LINES5: PlacedLine[] = Object.entries(vo5Json.lines).map(([id, l]) => place({ id, at: l.at }));

export type Script = "v4" | "v5";
/** Which lines each on-screen Keeper speaks (his mouth, head beats), and the end-card lines the subtitles skip
 *  because the card types them itself. */
export type Role = "open" | "oath" | "friends" | "day1" | "nice" | "arjun" | "payday" | "love" | "review" | "day7" | "bounty" | "record" | "cta" | "tagline";
export const SCRIPTS: Record<Script, { lines: PlacedLine[]; cast: Record<Role, string[]>; noSubs: string[] }> = {
  v4: {
    lines: LINES, noSubs: ["F25", "F26"],
    cast: { open: ["F01", "F02", "F03", "F04", "F05"], oath: ["F06", "F07", "F08"], friends: ["F09", "F10", "F11", "F12"], day1: ["F13"], nice: ["F14"],
      arjun: ["F15", "F16"], payday: ["F17"], love: ["F18"], review: ["F19"], day7: ["F20", "F21"], bounty: ["F22", "F23"], record: ["F24"], cta: ["F25", "F26"], tagline: ["F25"] },
  },
  v5: {
    lines: LINES5, noSubs: ["S31", "S32"],
    cast: { open: ["S01", "S02", "S03", "S04", "S05"], oath: ["S06", "S07", "S08", "S09"], friends: ["S10", "S11", "S12", "S13", "S14"], day1: ["S15", "S17"], nice: ["S16"],
      arjun: ["S18", "S19", "S20"], payday: ["S21"], love: ["S22"], review: ["S23", "S24"], day7: ["S25", "S26"], bounty: ["S27", "S28"], record: ["S29", "S30"], cta: ["S31", "S32", "S33"], tagline: ["S31"] },
  },
};
