import type { Cut } from "../data/cuts";

export type Fmt = "16x9" | "9x16" | "1x1";
export const SIZES: Record<Fmt, [number, number]> = { "16x9": [1920, 1080], "9x16": [1080, 1920], "1x1": [1080, 1080] };
export interface SceneProps { t: number; frame: number; cut: Cut; fmt: Fmt; W: number; H: number }
/** Per-format value. */
export const pick = <T,>(fmt: Fmt, v: { h: T; v: T; s: T }): T => (fmt === "16x9" ? v.h : fmt === "9x16" ? v.v : v.s);
