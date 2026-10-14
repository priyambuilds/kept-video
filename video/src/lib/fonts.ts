// Geist 400–900 and Geist Mono 500/600 from frontend/assets/fonts (synced to public/fonts).
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

const SANS: [number, string][] = [[400, "Regular"], [500, "Medium"], [600, "SemiBold"], [700, "Bold"], [800, "ExtraBold"], [900, "Black"]];
const MONO: [number, string][] = [[500, "Medium"], [600, "SemiBold"]];

let started: Promise<unknown> | null = null;
export function loadFonts() {
  if (started) return started;
  started = Promise.all([
    ...SANS.map(([w, n]) => loadFont({ family: "Geist", url: staticFile(`fonts/Geist_${w}${n}.ttf`), weight: String(w) })),
    ...MONO.map(([w, n]) => loadFont({ family: "Geist Mono", url: staticFile(`fonts/GeistMono_${w}${n}.ttf`), weight: String(w) })),
    loadFont({ family: "kept-icons", url: staticFile("fonts/kept-icons.ttf") }),
  ]);
  return started;
}
