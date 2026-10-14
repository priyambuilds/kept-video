// Copies the repo's inputs into video/public (Remotion serves only that folder):
// fonts, the design assets the film uses, the VO, the licensed track and SFX, and the synthesised
// scratch/placeholder audio. audio/music-refs/ is copyrighted reference material: it is never copied,
// and any public/ file that came from it fails the sync.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const VIDEO = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ROOT = resolve(VIDEO, "..");
const PUB = join(VIDEO, "public");

const copies = [
  ["frontend/assets/fonts", "fonts"],
  ["design/assets/money", "assets/money"],
  ["design/assets/objects", "assets/objects"],
  ["design/assets/gestures", "assets/gestures"],
  ["design/assets/brand", "assets/brand"],
  ["design/assets/icons", "assets/icons"],
  ["design/assets/keeper/svg", "assets/keeper-ref"], // on-model QA only, never in a scene
  ["audio/vo", "vo"],
  ["audio/sfx", "sfx"],
  ["video/generated/audio", "gen"],
];

const FORBIDDEN = /music-refs/i;
for (const [from, to] of copies) {
  const src = join(ROOT, from);
  if (FORBIDDEN.test(src)) throw new Error(`refusing to copy ${src}: reference music is analysis-only`);
  if (!existsSync(src)) { console.log(`skip ${from} (missing)`); continue; }
  const dst = join(PUB, to);
  rmSync(dst, { recursive: true, force: true });
  mkdirSync(dirname(dst), { recursive: true });
  cpSync(src, dst, { recursive: true, filter: (p) => !p.endsWith(".gitkeep") && !p.endsWith(".md") });
  console.log(`synced ${from} → public/${to}`);
}
const track = join(ROOT, "audio/track.mp3");
if (existsSync(track)) { mkdirSync(join(PUB, "music"), { recursive: true }); cpSync(track, join(PUB, "music/track.mp3")); console.log("synced audio/track.mp3"); }

// Belt and braces: nothing under public/ may be a reference track.
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const refs = existsSync(join(ROOT, "audio/music-refs")) ? readdirSync(join(ROOT, "audio/music-refs")).filter((f) => f.endsWith(".mp3")) : [];
for (const f of walk(PUB)) {
  if (FORBIDDEN.test(f) || refs.some((r) => f.endsWith(r))) throw new Error(`reference audio found in public/: ${f}`);
}
console.log("ok: no reference audio in public/");
