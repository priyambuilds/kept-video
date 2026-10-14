// node scripts/render.mjs <compositionId> <output.mp4> [height=native] [crf=18]
// A smaller height renders natively, then downscales with ffmpeg (Remotion needs integer scaled sizes).
// Bundles once, renders H.264 + AAC 320k. Refuses to run if any reference track sits in public/.
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { existsSync, mkdirSync, readdirSync, renameSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const VIDEO = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [id, out, height = "0", crf = "18", props = "{}"] = process.argv.slice(2);
const inputProps = JSON.parse(props);
const audioOnly = out.endsWith(".wav");
const refs = existsSync(join(VIDEO, "../audio/music-refs")) ? readdirSync(join(VIDEO, "../audio/music-refs")).filter((f) => f.endsWith(".mp3")) : [];
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [e.name]));
if (walk(join(VIDEO, "public")).some((f) => refs.includes(f))) throw new Error("reference music found in public/ — refusing to render");
mkdirSync(dirname(resolve(out)), { recursive: true });
const serveUrl = await bundle({ entryPoint: join(VIDEO, "src/index.ts"), publicDir: join(VIDEO, "public") });
const composition = await selectComposition({ serveUrl, id, inputProps });
let last = -1;
await renderMedia({
  composition, serveUrl, inputProps, outputLocation: resolve(out) + (audioOnly ? "" : ".full.mp4"),
  ...(audioOnly ? { codec: "wav" } : { codec: "h264", crf: Number(crf), audioCodec: "aac", audioBitrate: "320k", imageFormat: "jpeg", jpegQuality: 92 }),
  onProgress: ({ progress }) => { const p = Math.floor(progress * 10); if (p !== last) { last = p; console.log(`${id}: ${p * 10}%`); } },
});
if (audioOnly) { console.log("wrote", out); process.exit(0); }
if (Number(height) && Number(height) !== composition.height) {
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", resolve(out) + ".full.mp4", "-vf", `scale=-2:${height}:flags=lanczos`, "-c:v", "libx264", "-crf", crf, "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "copy", resolve(out)]);
  execFileSync("rm", [resolve(out) + ".full.mp4"]);
} else renameSync(resolve(out) + ".full.mp4", resolve(out));
console.log("wrote", out);
