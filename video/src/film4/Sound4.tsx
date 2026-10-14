// v4 mix (docs/LAUNCH_FILM_V4.md §6). No voice in the film: the song (edit4.wav) carries it at full level, with ~100
// SFX tucked under. `stem` renders one layer alone for the editor: "music", "sfx", or "guide" (the scratch Kokoro
// read of the transcript, placed where his lips move — a timing reference only, never part of the film).
import React from "react";
import { Audio, Sequence, getStaticFiles, staticFile } from "remotion";
import { SONG4, T } from "./timeline";
import type { PlacedLine } from "../data/vo";
import { useScript } from "./script";
import { FAIL_CU } from "./ActDay1";

const db = (d: number) => Math.pow(10, d / 20);
const FPS = 60;
export type Stem = "mix" | "music" | "musicDucked" | "sfx" | "guide";
/** Music under the (future) VO: −7 dB while a line plays, 80 ms in, 350 ms out. Only for the "musicDucked" stem. */
function duck(lines: PlacedLine[], t: number, depth = -7) {
  let g = 0;
  for (const l of lines) {
    const a = l.start - 0.08, r = l.end + 0.35;
    if (t >= a && t <= l.end) g = Math.min(g, depth);
    else if (t > l.end && t < r) g = Math.min(g, depth * (1 - (t - l.end) / 0.35));
    else if (t > a - 0.08 && t < a) g = Math.min(g, depth * ((t - (a - 0.08)) / 0.08));
  }
  return db(g);
}

type Cue = [number, string, number?];
const d1 = T.drop1, s = T.signin, O = T.oath, F = T.friends, D1 = T.day1, A = T.arjun, D2 = T.drop2, R = T.review, D7 = T.day7, BN = T.bounty, RC = T.record, C = T.cta;
const tap = (at: number, i: number, g = -14): Cue => [at, `sfx_14_tap_${"abcd"[i % 4]}`, g];
export const CUES4: Cue[] = [
  // hook + onboarding
  ...[0.3, 0.85, 1.45, 2.1, 2.8, 3.55].map((a, i): Cue => [a, `sfx_08_reminder_pop_${"abc"[i % 3]}`, -10]),
  [0.5, "sfx_04_cloth_lean", -12], tap(d1 - 0.5, 0, -8), [d1, "sfx_11_logo_boom", -3], [d1 + 0.05, "sfx_12_check_draw", -7], [d1 + 1.25, "sfx_13_keeper_popin", -9],
  ...[s - 0.15, s + 0.85, s + 3.55, O - 0.45].map((a, i) => tap(a, i + 1)), [s + 2.3, "sfx_25_check_tick_3", -8],
  [s + 4.75, "sfx_15_shuffle_tiles", -10], [s + 5.55, "sfx_15_shuffle_tiles", -10],
  // oath
  ...Array.from({ length: 16 }, (_, i): Cue => [O + 0.08 + i * 0.062, "sfx_38_word_tick", -14]),
  ...[2.0, 2.8, 3.3, 4.0, 4.5, 5.2, 5.8, 6.45, 7.05, 7.35, 10.75].map((x, i) => tap(O + x, i, -16)),
  [O + 5.8, "sfx_16_coin_roll", -9], [O + 8.0, "sfx_17_avatar_whoosh_b", -10], [O + 10.5, "sfx_17_avatar_whoosh_c", -12], [O + 11.8, "sfx_18_slam_stamp", -2],
  // friends
  [F + 0.55, "sfx_17_avatar_whoosh_a", -12], [F + 2.5, "sfx_17_avatar_whoosh_a", -9], [F + 3.1, "sfx_08_reminder_pop_a", -12], [F + 3.25, "sfx_08_reminder_pop_b", -12], [F + 3.4, "sfx_08_reminder_pop_c", -12],
  tap(F + 4.4, 0, -16), tap(F + 5.75, 1, -14), [F + 6.0, "sfx_25_check_tick_1", -10], [F + 6.45, "sfx_17_avatar_whoosh_b", -8], tap(F + 7.55, 2, -16), tap(F + 8.2, 3, -14), [F + 8.4, "sfx_25_check_tick_2", -10], [F + 8.55, "sfx_17_avatar_whoosh_c", -8],
  [F + 10.0, "sfx_17_avatar_whoosh_a", -12], [F + 10.62, "sfx_25_check_tick_1", -7], [F + 10.82, "sfx_25_check_tick_2", -7], [F + 11.02, "sfx_25_check_tick_3", -6], [F + 11.05, "sfx_16_coin_roll", -10],
  // day 1
  tap(D1 + 1.35, 0, -16), tap(D1 + 2.5, 1, -16), [D1 + 3.6, "sfx_21_shutter", -6], [D1 + 3.75, "sfx_22_scan_hum", -14], [D1 + 4.75, "sfx_23_error_buzz", -6],
  [FAIL_CU(D1)[0], "sfx_40_lean_creak", -10], [FAIL_CU(D1)[1] + 0.5, "sfx_21_shutter", -6], [FAIL_CU(D1)[1] + 0.65, "sfx_22_scan_hum", -14], [D1 + 7.7, "sfx_25_check_tick_3", -6],
  [D1 + 8.25, "sfx_31_coin_burst", -9], [D1 + 8.55, "sfx_08_reminder_pop_a", -14], [D1 + 8.75, "sfx_08_reminder_pop_b", -14], [D1 + 8.95, "sfx_08_reminder_pop_c", -14],
  // Arjun's night and midnight
  [A + 2.25, "sfx_14_tap_c", -14], [A + 2.75, "sfx_17_avatar_whoosh_b", -10], [A + 3.35, "sfx_08_reminder_pop_a", -10],
  [D2 - 3, "sfx_02_tick_cheap", -8], [D2 - 2, "sfx_02_tick_cheap", -8], [D2 - 1, "sfx_02_tick_cheap", -7],
  [D2 - 0.45, "sfx_27_scythe_windup", -3], [D2, "sfx_28_scythe_swish", 0], [D2 + 0.07, "sfx_29_slice_transient", -1], [D2 + 0.62, "sfx_31_coin_burst", -2],
  [D2 + 2.3, "sfx_34_ledger_drop", -6], [D2 + 4.55, "sfx_35_giddy_shimmy", -6],
  // review, day 7
  tap(R + 1.75, 0, -16), tap(R + 2.95, 3, -14), [R + 3.2, "sfx_25_check_tick_3", -6],
  [D7 + 0.3, "sfx_31_coin_burst", -8], [D7 + 0.5, "sfx_33_counter_roll", -10], tap(D7 + 3.25, 1, -14), [D7 + 3.45, "sfx_31_coin_burst", -9], [D7 + 3.85, "sfx_17_avatar_whoosh_a", -7],
  // bounties
  tap(BN + 1.7, 2, -16), tap(BN + 3.0, 0, -14), [BN + 4.2, "sfx_28_scythe_swish", -4], [BN + 5.35, "sfx_28_scythe_swish", -4], [BN + 6.5, "sfx_31_coin_burst", -7],
  // record, wall, end card
  [RC + 0.3, "sfx_33_counter_roll", -11], [RC + 1.05, "sfx_17_avatar_whoosh_b", -8], [RC + 2.6, "sfx_17_avatar_whoosh_c", -12], [T.wall - 0.2, "sfx_17_avatar_whoosh_a", -5],
  [C + 0.5, "sfx_12_check_draw", -4], [C + 3.9, "sfx_17_avatar_whoosh_c", -12], [C + 4.85, "sfx_14_tap_a", -6], [C + 5.85, "sfx_25_check_tick_3", -6], [C + 8.8, "sfx_41_visor_glint", -6], [T.out - 1.6, "sfx_42_sting_watching", -5],
];

export function Sound4({ stem = "mix" }: { stem?: Stem }) {
  const { lines } = useScript();
  const files = getStaticFiles().map((f) => f.name);
  const music = files.includes(SONG4.file) ? SONG4.file : null;
  return (
    <>
      {music && (stem === "mix" || stem === "music") ? <Audio src={staticFile(music)} volume={db(-2)} /> : null}
      {music && stem === "musicDucked" ? <Audio src={staticFile(music)} volume={(f) => db(-2) * duck(lines, f / FPS)} /> : null}
      {stem === "guide" ? lines.map((l) => (
        <Sequence key={l.id} from={Math.max(0, Math.round(l.offset * FPS))} name={`guide ${l.id}`}><Audio src={staticFile(l.file)} /></Sequence>
      )) : null}
      {stem === "mix" || stem === "sfx" ? CUES4.map(([at, name, gain], i) => (files.includes(`gen/sfx/${name}.wav`) ? (
        <Sequence key={i} from={Math.max(0, Math.round(at * FPS))} name={name}><Audio src={staticFile(`gen/sfx/${name}.wav`)} volume={db((gain ?? 0) - 5)} /></Sequence>
      ) : null)) : null}
    </>
  );
}
