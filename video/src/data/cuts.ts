// The two cuts (docs/SHOTLIST.md): every scene reads its moments from `b` (named times in seconds), so
// the 15 s cut re-uses the 28 s scenes with re-timed beats. VO lines are placed by start time or by an
// anchor word; SFX cues name files from docs/SFX_LIST.md.
import { place } from "./vo";
import type { Placement, PlacedLine } from "./vo";

export type CutId = "28" | "15";

export interface Beats {
  end: number;
  hookTap: number; freeze: number; cloak: number;
  /** S2 problem (28 only; 15 has a straight slap). */
  streak?: { flick: number; crack: number; nag: number[]; shrug: number; swat: number[] };
  raise: number; slap: number; drop1: number; popin: number; yank: number;
  /** S4 make an Oath (28 only). */
  oath?: { start: number; pick: number; len: number; stake: number; seats: number; fist: number; slam: number };
  cam: number; cheat: number; fail: number; real: number; checks: [number, number, number]; windup: number;
  drop2: number; counters: number; kept25: number; happy: number;
  proof?: [number, number, number];
  ledger: number; plate: number; glint: number; watch: number;
}

export interface Cut { id: CutId; dur: number; b: Beats; vo: PlacedLine[]; music: string; sfx: [number, string, number?][]; bubbles?: boolean }

const c28: Beats = {
  end: 28, hookTap: 0.55, freeze: 1.75, cloak: 2.6,
  streak: { flick: 3.06, crack: 3.5, nag: [4.4, 4.6, 4.8], shrug: 4.95, swat: [5.25, 5.69, 6.13] },
  raise: 6.2, slap: 6.5625, drop1: 7.0, popin: 7.55, yank: 9.5,
  oath: { start: 9.8, pick: 10.5, len: 11.375, stake: 11.8125, seats: 12.25, fist: 12.75, slam: 13.125 },
  cam: 13.4, cheat: 14.0, fail: 15.3125, real: 16.625, checks: [16.84, 16.95, 17.06], windup: 17.06,
  drop2: 17.5, counters: 19.15, kept25: 19.7, happy: 20.0,
  proof: [21.4375, 21.875, 22.3125],
  ledger: 22.75, plate: 24.5, glint: 26.0, watch: 27.5,
};

const c15: Beats = {
  end: 15, hookTap: 0.55, freeze: 1.75, cloak: 2.6,
  raise: 2.75, slap: 3.0625, drop1: 3.5, popin: 3.95, yank: 5.0,
  cam: 5.25, cheat: 5.5, fail: 6.125, real: 7.4375, checks: [7.66, 7.77, 7.88], windup: 8.3,
  drop2: 8.75, counters: 10.35, kept25: 10.85, happy: 11.05,
  ledger: 11.6, plate: 11.8125, glint: 13.4, watch: 14.45,
};

const vo28: Placement[] = [
  { id: "L01", at: 0.2 }, { id: "L02", at: 2.75 }, { id: "L03a", at: 7.0, anchor: "cost" }, { id: "L03b", at: 8.3 },
  { id: "L04", at: 9.95 }, { id: "L05", at: 13.3 }, { id: "L06", at: 15.62 }, { id: "L07", at: 17.8 }, { id: "L08", at: 20.1, gain: -2 },
  { id: "L10", at: 22.9 }, { id: "L11", at: 25.15 },
];
const vo15: Placement[] = [
  { id: "L01", at: 0.1 }, { id: "L03a", at: 3.5, anchor: "cost" }, { id: "L06", at: 6.35 }, { id: "L07", at: 9.0 }, { id: "L11", at: 12.05 },
];

const sfx28: [number, string, number?][] = [
  [0.55, "sfx_02_tick_cheap"], [0.6, "sfx_01_ding_cheap"], [0.3, "sfx_04_cloth_lean", -6], [1.72, "sfx_03_record_scratch"],
  [3.06, "sfx_05_flick"], [3.5, "sfx_06_flame_crack"], [3.6, "sfx_07_count_down", -4],
  [4.4, "sfx_08_reminder_pop_a", -4], [4.6, "sfx_08_reminder_pop_b", -4], [4.8, "sfx_08_reminder_pop_c", -4],
  [5.25, "sfx_09_swat_a"], [5.69, "sfx_09_swat_b"], [6.13, "sfx_09_swat_c"], [6.5625, "sfx_10_slap_collapse"],
  [7.0, "sfx_11_logo_boom"], [7.05, "sfx_12_check_draw", -4], [7.55, "sfx_13_keeper_popin", -4], [9.5, "sfx_09_swat_b", -6],
  [10.0, "sfx_15_shuffle_tiles", -6], [10.5, "sfx_14_tap_a"], [11.375, "sfx_14_tap_b"], [11.8125, "sfx_14_tap_c"], [11.85, "sfx_16_coin_roll", -3],
  [12.25, "sfx_17_avatar_whoosh_a", -5], [12.36, "sfx_17_avatar_whoosh_b", -5], [12.47, "sfx_17_avatar_whoosh_c", -5],
  [13.125, "sfx_18_slam_stamp"], [13.2, "sfx_19_card_flip", -3], [13.4, "sfx_14_tap_d"], [13.5, "sfx_20_viewfinder_open", -3],
  [14.0, "sfx_21_shutter"], [14.15, "sfx_22_scan_hum", -6], [15.3125, "sfx_23_error_buzz"], [15.33, "sfx_24_shake", -4],
  [16.625, "sfx_21_shutter"], [16.84, "sfx_25_check_tick_1"], [16.95, "sfx_25_check_tick_2"], [17.06, "sfx_25_check_tick_3"], [17.06, "sfx_26_hp_fill", -4],
  [17.06, "sfx_27_scythe_windup"], [17.5, "sfx_28_scythe_swish"], [17.52, "sfx_29_slice_transient"], [17.55, "sfx_30_glass_shatter"], [17.56, "sfx_31_coin_burst"],
  ...Array.from({ length: 12 }, (_, i) => [17.9375 + i * 0.109375, `sfx_32_coin_land_${String(i + 1).padStart(2, "0")}`, -5] as [number, string, number]),
  [19.15, "sfx_33_counter_roll", -4], [19.7, "sfx_34_ledger_drop"], [20.1, "sfx_35_giddy_shimmy", -6],
  [21.4375, "sfx_36_ledger_stamp_1"], [21.875, "sfx_36_ledger_stamp_2"], [22.3125, "sfx_36_ledger_stamp_3"], [22.75, "sfx_37_ledger_close"],
  [24.5, "sfx_39_logo_hit_final"], [24.55, "sfx_40_lean_creak", -6], [26.0, "sfx_41_visor_glint", -4], [27.75, "sfx_42_sting_watching"],
];
const sfx15: [number, string, number?][] = [
  [0.55, "sfx_02_tick_cheap"], [0.6, "sfx_01_ding_cheap"], [0.3, "sfx_04_cloth_lean", -6], [1.72, "sfx_03_record_scratch"],
  [3.0625, "sfx_10_slap_collapse"], [3.5, "sfx_11_logo_boom"], [3.55, "sfx_12_check_draw", -4], [3.95, "sfx_13_keeper_popin", -4], [5.0, "sfx_09_swat_b", -6],
  [5.3, "sfx_20_viewfinder_open", -3], [5.5, "sfx_21_shutter"], [5.6, "sfx_22_scan_hum", -6], [6.125, "sfx_23_error_buzz"], [6.15, "sfx_24_shake", -4],
  [7.4375, "sfx_21_shutter"], [7.66, "sfx_25_check_tick_1"], [7.77, "sfx_25_check_tick_2"], [7.88, "sfx_25_check_tick_3"],
  [8.3, "sfx_27_scythe_windup"], [8.75, "sfx_28_scythe_swish"], [8.77, "sfx_29_slice_transient"], [8.8, "sfx_30_glass_shatter"], [8.81, "sfx_31_coin_burst"],
  ...Array.from({ length: 10 }, (_, i) => [9.1 + i * 0.125, `sfx_32_coin_land_${String(i + 1).padStart(2, "0")}`, -5] as [number, string, number]),
  [10.35, "sfx_33_counter_roll", -4], [10.85, "sfx_34_ledger_drop"], [11.05, "sfx_35_giddy_shimmy", -6], [11.6, "sfx_37_ledger_close"],
  [12.25, "sfx_39_logo_hit_final"], [13.4, "sfx_41_visor_glint", -4], [14.6, "sfx_42_sting_watching"],
];

export const CUTS: Record<CutId, Cut> = {
  "28": { id: "28", dur: 28, b: c28, vo: vo28.map(place), music: "gen/music/scratch_28.wav", sfx: sfx28 },
  "15": { id: "15", dur: 15, b: c15, vo: vo15.map(place), music: "gen/music/scratch_15.wav", sfx: sfx15 },
};
export const line = (cut: Cut, id: PlacedLine["id"]) => cut.vo.find((l) => l.id === id);
