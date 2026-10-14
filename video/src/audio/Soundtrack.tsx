// The mix (brief §8: VO > signature SFX > music). VO lines play where the cut places them; the music
// ducks under every line (−10 dB, fast attack, ~300 ms release, as volume automation); SFX use the
// sourced file in audio/sfx/ when it exists, else the synthesised stand-in from scripts/audio.
// Reference music (audio/music-refs) can't reach here: sync-assets never copies it.
import React from "react";
import { Audio, Sequence, getStaticFiles, staticFile } from "remotion";
import { FPS } from "../lib/anim";
import type { Cut } from "../data/cuts";

const db = (d: number) => Math.pow(10, d / 20);

function sfxPath(name: string): string | null {
  const files = getStaticFiles().map((f) => f.name);
  for (const ext of [".wav", ".mp3"]) if (files.includes(`sfx/${name}${ext}`)) return `sfx/${name}${ext}`;
  if (files.includes(`gen/sfx/${name}.wav`)) return `gen/sfx/${name}.wav`;
  return null;
}

/** Music gain at time t: ducked under VO (attack 30 ms, release 300 ms). */
export function duck(cut: Cut, t: number, depth = -10) {
  let g = 0;
  for (const l of cut.vo) {
    const a = l.start - 0.03, r = l.end + 0.3;
    if (t >= a && t <= l.end) g = Math.min(g, depth);
    else if (t > l.end && t < r) g = Math.min(g, depth * (1 - (t - l.end) / 0.3));
    else if (t > a - 0.03 && t < a) g = Math.min(g, depth * ((t - (a - 0.03)) / 0.03));
  }
  return db(g);
}

export function Soundtrack({ cut, music, musicGain = -6 }: { cut: Cut; music: string | null; musicGain?: number }) {
  return (
    <>
      {music ? <Audio src={staticFile(music)} volume={(f) => db(musicGain) * duck(cut, f / FPS)} /> : null}
      {cut.vo.map((l) => (
        <Sequence key={l.id} from={Math.round(l.offset * FPS)} name={`VO ${l.id}`}>
          <Audio src={staticFile(l.file)} volume={db(l.gain)} />
        </Sequence>
      ))}
      {cut.sfx.map(([at, name, gain], i) => {
        const p = sfxPath(name);
        return p ? (
          <Sequence key={i} from={Math.max(0, Math.round(at * FPS))} name={name}>
            <Audio src={staticFile(p)} volume={db((gain ?? 0) - 4)} />
          </Sequence>
        ) : null;
      })}
    </>
  );
}
