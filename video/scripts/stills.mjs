// Render stills at given times: node scripts/stills.mjs <compositionId> <outDir> <t1,t2,...> [scale]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const VIDEO = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [id, out, times, scale = "0.5", props = "{}"] = process.argv.slice(2);
const inputProps = JSON.parse(props);
mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: join(VIDEO, "src/index.ts"), publicDir: join(VIDEO, "public") });
const composition = await selectComposition({ serveUrl, id, inputProps });
for (const t of times.split(",").map(Number)) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(t * composition.fps));
  const output = join(out, `${id}_${t.toFixed(2).padStart(6, "0")}.jpg`);
  await renderStill({ composition, serveUrl, frame, output, inputProps, imageFormat: "jpeg", jpegQuality: 85, scale: Number(scale) });
  console.log(output);
}
