// VO lines placed on a cut's timeline. vo.json (made by scripts/vo/make_vo.py or align_vo.py) holds
// each file's phrase and word times; a cut places each line either at a time or so that one anchor
// word lands on a time (e.g. "cost" on the 0:07 drop). Swap in the ElevenLabs takes and re-run
// align_vo.py: every caption, speech beat and anchor follows automatically.
import voJson from "./vo.json";
import vo2Json from "./vo2.json";
import vo3Json from "./vo3.json";
import vo4Json from "./vo4.json";
import vo5Json from "./vo5.json";

export interface Word { w: string; start: number; end: number }
export interface Phrase { text: string; start: number; end: number; key: string[]; words: Word[] }
export interface VoLine { file?: string; at?: number; duration: number; speechStart: number; speechEnd: number; phrases: Phrase[] }
export type LineId = string;

export const VO: Record<string, VoLine> = { ...(voJson as unknown as { lines: Record<LineId, VoLine> }).lines, ...(vo2Json as unknown as { lines: Record<LineId, VoLine> }).lines, ...(vo3Json as unknown as { lines: Record<LineId, VoLine> }).lines, ...(vo4Json as unknown as { lines: Record<LineId, VoLine> }).lines, ...(vo5Json as unknown as { lines: Record<LineId, VoLine> }).lines };

/** Where a line goes: `at` = speech start time, or `anchor` word lands at `at`. */
export interface Placement { id: LineId; at: number; anchor?: string; gain?: number }

export interface PlacedWord extends Word { key: boolean; phrase: number }
export interface PlacedLine { id: LineId; offset: number; start: number; end: number; words: PlacedWord[]; phrases: (Phrase & { offset: number })[]; file: string; gain: number }

const clean = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");

export function place(p: Placement): PlacedLine {
  const line = VO[p.id];
  if (!line) throw new Error(`no VO timing for ${p.id}`);
  let offset = p.at - line.speechStart;
  if (p.anchor) {
    const w = line.phrases.flatMap((ph) => ph.words).find((x) => clean(x.w) === clean(p.anchor!));
    if (!w) throw new Error(`anchor "${p.anchor}" not in ${p.id}`);
    offset = p.at - w.start;
  }
  const words: PlacedWord[] = line.phrases.flatMap((ph, i) =>
    ph.words.map((w) => ({ ...w, start: w.start + offset, end: w.end + offset, key: ph.key.some((k) => clean(k) === clean(w.w)), phrase: i })));
  return {
    id: p.id, offset, start: line.speechStart + offset, end: line.speechEnd + offset, words,
    phrases: line.phrases.map((ph) => ({ ...ph, offset })), file: line.file ?? `vo/${p.id}.wav`, gain: p.gain ?? 0,
  };
}

/**
 * Speech beats for the Keeper (brief §2: no lip-sync, the stitch stays shut). Returns, for time t:
 * `bob` a head dip on every word onset (bigger on key words), `wiggle` the stitch control-point jitter
 * while a word is voiced, `squash` a small stretch on punch words.
 */
export function speech(lines: PlacedLine[], t: number) {
  let bob = 0, wiggle = 0, squash = 0, talking = 0;
  for (const l of lines) {
    if (t < l.start - 0.1 || t > l.end + 0.5) continue;
    for (const w of l.words) {
      const d = t - w.start;
      if (d >= 0 && d < 0.45) {
        const a = w.key ? 1.6 : 1;
        bob += a * 2.2 * Math.sin(Math.min(1, d / 0.12) * Math.PI) * Math.exp(-d * 6);
        if (w.key) squash += 0.03 * Math.sin(Math.min(1, d / 0.16) * Math.PI) * Math.exp(-d * 5);
      }
      if (t >= w.start && t <= w.end) {
        talking = 1;
        wiggle += 1.4 * Math.sin((t - w.start) * 2 * Math.PI * 7.5);
      }
    }
  }
  return { bob, wiggle, squash, talking };
}

/** Spoken syllable count for a caption token (numbers are read out). Mirrors scripts/vo/make_vo.py › syllables. */
const SPOKEN: Record<string, string> = { "4000": "four thou sand", "16": "six teen", "7": "sev en", "3": "three", "1": "one", kept: "kept" };
function syllableVowels(word: string): string[] {
  const key = word.toLowerCase().replace(/[^a-z0-9]/g, "");
  const w = (SPOKEN[key] ?? key).replace(/[^a-z ]/g, "");
  const groups = w.match(/[aeiouy]+/g) ?? ["a"];
  if (w.endsWith("e") && !w.endsWith("le") && !w.endsWith("ee") && groups.length > 1) groups.pop();
  return groups;
}
const VOWEL: Record<string, [number, number]> = { a: [1, 0.1], o: [0.85, 0.75], u: [0.6, 0.9], e: [0.7, 0], i: [0.55, 0], y: [0.55, 0] };

/**
 * Lip-sync (film v4) from the transcript's word times: each word is split into its syllables; every syllable
 * opens the mouth (fast attack, softer release) by its vowel (a = wide open, o/u = round, e/i = half), and
 * words starting with m/b/p start closed. Returns jaw 0..1 and roundness 0..1 at t.
 */
export function mouth(lines: PlacedLine[], t: number): { jaw: number; round: number } {
  let jaw = 0, round = 0;
  for (const l of lines) {
    if (t < l.start - 0.1 || t > l.end + 0.2) continue;
    for (let wi = 0; wi < l.words.length; wi++) {
      const w = l.words[wi];
      if (t < w.start - 0.03 || t > w.end + 0.08) continue;
      // Kokoro's word end includes its trailing release; speech inside a word ≈ 85 % of its span.
      const span = Math.max(0.08, (w.end - w.start) * 0.85);
      const vs = syllableVowels(w.w);
      const d = span / vs.length;
      const closed = /^[mbp]/i.test(w.w.replace(/[^a-z]/gi, "")) ? 0.18 : 0;
      vs.forEach((v, i) => {
        const s0 = w.start + i * d, u = (t - s0) / d;
        if (u < -0.15 || u > 1.15) return;
        const [peak, rnd] = VOWEL[v[0]] ?? [0.7, 0];
        const lead = i === 0 ? closed : 0;
        const x = Math.max(0, Math.min(1, (u - lead) / (1 - lead)));
        const env = x < 0.3 ? Math.sin((x / 0.3) * Math.PI / 2) : Math.cos(((x - 0.3) / 0.7) * Math.PI / 2) ** 1.4;
        const amp = (w.key ? 1.1 : 0.92) * peak * (0.85 + 0.15 * Math.sin(wi * 2.3 + i * 1.7));
        const j = env * amp;
        if (j > jaw) { jaw = j; round = rnd; }
      });
    }
  }
  return { jaw: Math.min(1, jaw), round };
}
