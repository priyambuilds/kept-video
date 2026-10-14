// The launch film's mix: music (audio/track.mp3 when it exists, else the scratch bed), the Keeper's VO, SFX on
// every tap, push, shutter, scan, coin and hit. Music ducks −10 dB under each VO line.
import React from "react";
import { Audio, Sequence, getStaticFiles, staticFile } from "remotion";
import { BEAT } from "../lib/anim";
import { T, VO_PLACED } from "./timeline";

const db = (d: number) => Math.pow(10, d / 20);
const FPS = 60;
function sfxPath(name: string): string | null {
  const files = getStaticFiles().map((f) => f.name);
  for (const ext of [".wav", ".mp3"]) if (files.includes(`sfx/${name}${ext}`)) return `sfx/${name}${ext}`;
  return files.includes(`gen/sfx/${name}.wav`) ? `gen/sfx/${name}.wav` : null;
}
function duck(t: number, depth = -10) {
  let g = 0;
  for (const l of VO_PLACED) {
    const a = l.start - 0.05, r = l.end + 0.3;
    if (t >= a && t <= l.end) g = Math.min(g, depth);
    else if (t > l.end && t < r) g = Math.min(g, depth * (1 - (t - l.end) / 0.3));
    else if (t > a - 0.05 && t < a) g = Math.min(g, depth * ((t - (a - 0.05)) / 0.05));
  }
  return db(g);
}

const TAPS = [4.75, 9.0, 10.15, 12.75, 13.55, 14.25, 15.55, 17.75, 18.55, 19.05, 19.75, 20.25, 20.95, 21.55, 22.15, 22.85, 23.2, 26.95, 28.8, 33.05, 36.95, 39.65, 53.55, 59.55, 61.55, 82.15];
const PUSH = [9.2, 10.35, 11.6, 12.95, 15.75, 17.95, 19.25, 20.45, 22.35, 23.4, 27.15, 28.95, 33.25, 39.85, 59.75, 61.75];
type Cue = [number, string, number?];
export const CUES: Cue[] = [
  ...[0.25, 0.75, 1.3, 1.9, 2.55, 3.25].map((a, i): Cue => [a, `sfx_08_reminder_pop_${"abc"[i % 3]}`, -7]),
  ...TAPS.map((a, i): Cue => [a, `sfx_14_tap_${"abcd"[i % 4]}`, -6]),
  ...PUSH.map((a, i): Cue => [a, `sfx_17_avatar_whoosh_${"abc"[i % 3]}`, -16]),
  ...Array.from({ length: 19 }, (_, i): Cue => [16.1 + i * 0.062, "sfx_38_word_tick", -8]),
  [5.6, "sfx_12_check_draw", -4], [11.62, "sfx_25_check_tick_3", -4], [13.55, "sfx_15_shuffle_tiles", -8], [14.25, "sfx_15_shuffle_tiles", -8],
  [21.55, "sfx_16_coin_roll", -6], [23.95, "sfx_17_avatar_whoosh_b", -5], [26.0, "sfx_17_avatar_whoosh_c", -8],
  [28.15, "sfx_25_check_tick_3", -3], [28.35, "sfx_26_hp_fill", -6],
  [29.25, "sfx_08_reminder_pop_a", -7], [29.45, "sfx_08_reminder_pop_b", -7], [29.65, "sfx_08_reminder_pop_c", -7],
  [30.85, "sfx_19_card_flip", -4], [31.55, "sfx_19_card_flip", -4], [32.25, "sfx_19_card_flip", -4],
  [33.3, "sfx_13_keeper_popin", -6], [34.35, "sfx_21_shutter", -2], [37.6, "sfx_21_shutter", -2], [40.6, "sfx_21_shutter", -2],
  [34.5, "sfx_22_scan_hum", -9], [35.0, "sfx_22_scan_hum", -9], [37.75, "sfx_22_scan_hum", -9], [38.2, "sfx_22_scan_hum", -9], [40.75, "sfx_22_scan_hum", -9], [41.25, "sfx_22_scan_hum", -9],
  [35.75, "sfx_23_error_buzz", -3], [35.78, "sfx_24_shake", -4], [38.65, "sfx_25_check_tick_1", -3], [38.8, "sfx_25_check_tick_2", -4],
  [41.85, "sfx_31_coin_burst", -3], [41.9, "sfx_26_hp_fill", -6],
  [43.85, "sfx_13_keeper_popin", -6], [T.drop2 - 0.5, "sfx_27_scythe_windup", -2], [T.drop2, "sfx_28_scythe_swish", 0], [T.drop2 + 0.07, "sfx_29_slice_transient", -1], [T.drop2 + 0.08, "sfx_31_coin_burst", -2],
  ...Array.from({ length: 12 }, (_, j): Cue => [T.drop2 + BEAT + Math.floor(j / 2) * (BEAT / 4), `sfx_32_coin_land_${String(j + 1).padStart(2, "0")}`, -4]),
  [T.drop2 + BEAT + 1.5 + 0.2, "sfx_34_ledger_drop", -4],
  [47.95, "sfx_17_avatar_whoosh_a", -8], [49.6, "sfx_35_giddy_shimmy", -6],
  [51.3, "sfx_31_coin_burst", -4], [51.5, "sfx_33_counter_roll", -6], [53.8, "sfx_31_coin_burst", -4],
  [57.35, "sfx_17_avatar_whoosh_b", -4], [58.95, "sfx_17_avatar_whoosh_c", -6],
  [62.7, "sfx_08_reminder_pop_a", -7], [63.35, "sfx_08_reminder_pop_b", -7], [64.0, "sfx_08_reminder_pop_c", -7],
  [64.95, "sfx_31_coin_burst", -4], [68.55, "sfx_33_counter_roll", -7], [69.3, "sfx_17_avatar_whoosh_b", -5], [72.3, "sfx_17_avatar_whoosh_a", -2],
  [77.55, "sfx_12_check_draw", -3], [83.15, "sfx_25_check_tick_3", -3], [84.2, "sfx_41_visor_glint", -6], [86.9, "sfx_42_sting_watching", -4],
];

export function Sound() {
  const files = getStaticFiles().map((f) => f.name);
  const music = files.includes("track.mp3") ? "track.mp3" : files.includes("gen/music/scratch_launch.wav") ? "gen/music/scratch_launch.wav" : null;
  return (
    <>
      {music ? <Audio src={staticFile(music)} volume={(f) => db(-6) * duck(f / FPS)} /> : null}
      {VO_PLACED.map((l) => (
        <Sequence key={l.id} from={Math.round(l.offset * FPS)} name={`VO ${l.id}`}><Audio src={staticFile(l.file)} volume={db(l.gain)} /></Sequence>
      ))}
      {CUES.map(([at, name, gain], i) => {
        const p = sfxPath(name);
        return p ? <Sequence key={i} from={Math.max(0, Math.round(at * FPS))} name={name}><Audio src={staticFile(p)} volume={db((gain ?? 0) - 4)} /></Sequence> : null;
      })}
    </>
  );
}
