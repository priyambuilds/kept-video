// v3 mix (docs/LAUNCH_FILM_V3_PLAN.md §6): the song carries the film; VO ducks it −8 dB; ~20 signature SFX sit under
// the music (no per-coin bells, no ticking beds; taps barely audible). The song edit already contains the teaser's
// record-stop gap and the drops, so the music is one file.
import React from "react";
import { Audio, Sequence, getStaticFiles, staticFile } from "remotion";
import { BAR, T, VO_PLACED } from "./timeline";
import { SONG } from "./music";
import { FAIL_CU } from "./ActDay1";

const db = (d: number) => Math.pow(10, d / 20);
const FPS = 60;
function duck(t: number, depth = -8) {
  let g = 0;
  for (const l of VO_PLACED) {
    const a = l.start - 0.08, r = l.end + 0.35;
    if (t >= a && t <= l.end) g = Math.min(g, depth);
    else if (t > l.end && t < r) g = Math.min(g, depth * (1 - (t - l.end) / 0.35));
    else if (t > a - 0.08 && t < a) g = Math.min(g, depth * ((t - (a - 0.08)) / 0.08));
  }
  return db(g);
}

type Cue = [number, string, number?];
const P = T.promise, F = T.friends, D1 = T.day1, A = T.arjun, D2 = T.drop2, R = T.review, D7 = T.day7, BN = T.bounty, E = T.end;
const cta = E + 3 * BAR;
export const CUES3: Cue[] = [
  // the teaser's opening, as it was
  [0.3, "sfx_04_cloth_lean", -8], [0.55, "sfx_02_tick_cheap", -2], [0.6, "sfx_01_ding_cheap", -2], [T.freeze - 0.03, "sfx_03_record_scratch", 0],
  [T.slap, "sfx_10_slap_collapse", 0], [T.drop1, "sfx_11_logo_boom", 0], [T.drop1 + 0.05, "sfx_12_check_draw", -5], [T.popin, "sfx_13_keeper_popin", -6],
  [T.yank, "sfx_17_avatar_whoosh_a", -4],
  // the promise
  [P + 2.0, "sfx_14_tap_a", -16], [P + 4.5, "sfx_14_tap_b", -16], [P + 5.8, "sfx_16_coin_roll", -9], [P + 8.0, "sfx_17_avatar_whoosh_b", -10], [P + 10.5, "sfx_17_avatar_whoosh_c", -12],
  [P + 11.8, "sfx_18_slam_stamp", -1],
  // friends
  [F + 2.5, "sfx_17_avatar_whoosh_a", -9], [F + 3.1, "sfx_08_reminder_pop_a", -12], [F + 3.25, "sfx_08_reminder_pop_b", -12], [F + 3.4, "sfx_08_reminder_pop_c", -12],
  [F + 6.45, "sfx_17_avatar_whoosh_b", -8], [F + 8.55, "sfx_17_avatar_whoosh_c", -8],
  [F + 10.87, "sfx_25_check_tick_1", -7], [F + 11.12, "sfx_25_check_tick_2", -7], [F + 11.37, "sfx_25_check_tick_3", -6],
  // day 1
  [D1 + 3.6, "sfx_21_shutter", -6], [D1 + 4.75, "sfx_23_error_buzz", -6], [FAIL_CU(D1)[0], "sfx_40_lean_creak", -10], [FAIL_CU(D1)[1] + 0.55, "sfx_21_shutter", -6],
  [D1 + 8.3, "sfx_31_coin_burst", -9],
  // Arjun's night and midnight
  [A + 2.25, "sfx_14_tap_c", -14], [A + 3.35, "sfx_08_reminder_pop_a", -10],
  [D2 - 3, "sfx_02_tick_cheap", -8], [D2 - 2, "sfx_02_tick_cheap", -8], [D2 - 1, "sfx_02_tick_cheap", -8],
  [D2 - 0.45, "sfx_27_scythe_windup", -3], [D2, "sfx_28_scythe_swish", 0], [D2 + 0.07, "sfx_29_slice_transient", -1], [D2 + 0.62, "sfx_31_coin_burst", -2],
  [D2 + 2.3, "sfx_34_ledger_drop", -6], [D2 + 4.55, "sfx_35_giddy_shimmy", -6],
  // review, day 7
  [R + 2.95, "sfx_14_tap_d", -14], [R + 3.2, "sfx_25_check_tick_3", -6],
  [D7 + 0.3, "sfx_31_coin_burst", -8], [D7 + 0.5, "sfx_33_counter_roll", -10], [D7 + 3.85, "sfx_17_avatar_whoosh_a", -7],
  // bounties
  [BN + 4.2, "sfx_28_scythe_swish", -4], [BN + 5.35, "sfx_28_scythe_swish", -4], [BN + 6.5, "sfx_31_coin_burst", -7],
  [T.record + 1.25, "sfx_17_avatar_whoosh_b", -8],
  // the end
  [E + 3.3, "sfx_19_card_flip", -4], [E + 3.7, "sfx_17_avatar_whoosh_c", -8],
  [cta + 0.15, "sfx_12_check_draw", -4], [cta + 4.6, "sfx_14_tap_a", -6], [cta + 6.6, "sfx_41_visor_glint", -6], [T.out - 1.3, "sfx_42_sting_watching", -4],
];

export function Sound3() {
  const files = getStaticFiles().map((f) => f.name);
  const music = files.includes("track.mp3") ? "track.mp3" : files.includes(SONG.file) ? SONG.file : null;
  return (
    <>
      {music ? <Audio src={staticFile(music)} volume={(f) => db(-3) * duck(f / FPS)} /> : null}
      {VO_PLACED.map((l) => (
        <Sequence key={l.id} from={Math.max(0, Math.round(l.offset * FPS))} name={`VO ${l.id}`}><Audio src={staticFile(l.file)} volume={db(l.gain + 1)} /></Sequence>
      ))}
      {CUES3.map(([at, name, gain], i) => (files.includes(`gen/sfx/${name}.wav`) ? (
        <Sequence key={i} from={Math.max(0, Math.round(at * FPS))} name={name}><Audio src={staticFile(`gen/sfx/${name}.wav`)} volume={db((gain ?? 0) - 5)} /></Sequence>
      ) : null))}
    </>
  );
}
