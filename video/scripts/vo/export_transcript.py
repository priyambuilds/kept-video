#!/usr/bin/env python3
"""Export the film's Keeper transcript for the edit (v4: docs/LAUNCH_FILM_V4.md §5; v5: docs/KEEPER_VOICE_GUIDE.md):

  <out>/<name>.srt / .vtt        subtitles, one cue per phrase, on the film's clock
  <out>/<name>_VO_script.md      the timing sheet: every line, its in/out, phrases, words, direction
  <out>/<name>_VO_script.csv     the same, one row per phrase (for spreadsheets / ElevenLabs batches; fit_takes.py reads it)

v4 → renders/final/KEPT_launch_final*, v5 → renders/final_v5/KEPT_launch_v5*. Times come from the same sources the
film uses: v4 from the placements in video/src/film4/timeline.ts and data/vo4.json, v5 from data/vo5.json (each line's
`at`) and scripts/vo/script5.json. Run: python3 video/scripts/vo/export_transcript.py [v4|v5]
"""
import csv, json, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
VER = sys.argv[1] if len(sys.argv) > 1 else "v4"
TL = open(os.path.join(ROOT, "video/src/film4/timeline.ts")).read()
VO = json.load(open(os.path.join(ROOT, f"video/src/data/vo{VER[1]}.json")))["lines"]
SPEC = json.load(open(os.path.join(ROOT, f"video/scripts/vo/script{VER[1]}.json")))["lines"]
SPEC4 = json.load(open(os.path.join(ROOT, "video/scripts/vo/script4.json")))["lines"]
OUT, NAME = (os.path.join(ROOT, "renders/final"), "KEPT_launch_final") if VER == "v4" else (os.path.join(ROOT, "renders/final_v5"), "KEPT_launch_v5")
FPS = 60

BAR = float(re.search(r"bar: ([\d.]+)", TL).group(1))
T = {}
for k, expr in re.findall(r"(\w+): (B\([\d.]+\)|0)", TL.split("export const T = {")[1].split("};")[0]):
    T[k] = 0.0 if expr == "0" else float(expr[2:-1]) * BAR

def at_of(expr):
    e = expr
    for k in sorted(T, key=len, reverse=True):
        e = e.replace("T." + k, repr(T[k]))
    return eval(e)

SKIP_SUBS = set(re.findall(r'"([FS]\d+)"', re.search(VER + r': \{\n\s+lines: \w+, noSubs: \[([^\]]*)\]', TL).group(1)))
if VER == "v4":
    PLACED = [(i, at_of(e)) for i, e in re.findall(r'place\(\{ id: "(F\d+)", at: ([^}]+?) \}\)', TL)]
    spoken = lambda lid, k: SPEC[lid]["phrases"][k]["text"]
else:
    PLACED = [(i, l["at"]) for i, l in VO.items()]
    def spoken(lid, k):
        p = SPEC[lid]["phrases"][k]
        return SPEC4[p["from"]]["phrases"][p["i"]]["text"] if "from" in p else p.get("say", p["caption"])

DIRECTION = {
    "F01": "Bored, flat, matter-of-fact. He has seen every excuse.",
    "F02": "\"This one\": a beat. \"bills you.\": smug, a little relish on \"bills\".",
    "F03": "Mock-hospitable. A bouncer saying welcome.",
    "F04": "Dry, informative, no sell.",
    "F05": "\"Pick a look.\" Then a long, judging pause. \"Bold.\": unimpressed, one word.",
    "F06": "Crisp instruction.",
    "F07": "Lean on \"money\". He likes this part.",
    "F08": "Slow and lawyerly on \"Like a contract.\"",
    "F09": "\"Now.\" A beat. Then conspiratorial: this is the good bit.",
    "F10": "Even, reading the rules off a card.",
    "F11": "A faint, tired surprise. Roast the lateness, not Arjun.",
    "F12": "Low, savouring the number.",
    "F13": "Brisk, list cadence. \"I check every one.\": quiet menace.",
    "F14": "Dead stare. Slow, flat. The catchphrase.",
    "F15": "Gossip, out of the side of the mouth.",
    "F16": "A bookie quoting odds. Sly.",
    "F17": "Slow \"Miss a day…\", then the payoff, quicker.",
    "F18": "\"Honestly?\" A beat. Then the mask slips: genuine delight.",
    "F19": "Dry. A shrug in the voice.",
    "F20": "Approving. \"Collect.\": clipped, one word.",
    "F21": "\"Arjun?\" A beat. Fake sympathy on \"He'll be back.\"",
    "F22": "Hustler's pitch, gaining speed. \"Miss once, you're out.\": a flat warning.",
    "F23": "Even, matter-of-fact.",
    "F24": "Deadpan, with a hint of a threat on \"worth reading\".",
    "F25": "The tagline. Slow and weighty, a gap before \"Or pay your friends.\"",
    "F26": "Sign-off. \"KEPT.\" A beat. \"On Seeker. October sixteenth.\"",
}

if VER == "v5":
    DIRECTION = {lid: l["direction"] for lid, l in SPEC.items()}
ELEVEN = {lid: l.get("eleven", "") for lid, l in SPEC.items()}

def tc(t):  # SMPTE at 60 fps
    f = round(t * FPS); return f"{f // (3600 * FPS):02d}:{f // (60 * FPS) % 60:02d}:{f // FPS % 60:02d}:{f % FPS:02d}"
def srt_t(t):
    ms = round(t * 1000); return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"

rows, cues = [], []
for lid, at in PLACED:
    line = VO[lid]
    off = at - line["speechStart"]
    for k, ph in enumerate(line["phrases"]):
        prev = line["phrases"][k - 1]["end"] if k else ph["start"]
        rows.append({"id": lid, "phrase": k + 1, "in": ph["start"] + off, "out": ph["end"] + off, "text": ph["text"], "spoken": spoken(lid, k),
                     "words": [(w["w"], w["start"] + off) for w in ph["words"]], "gap": round(ph["start"] - prev, 2)})
        cues.append((ph["start"] + off, ph["end"] + off, ph["text"], lid))

# Subtitle cues: show 0.12 s early, hold until the next cue (max 0.9 s after the phrase), never overlap.
os.makedirs(OUT, exist_ok=True)
cues.sort()
srt, vtt = [], ["WEBVTT", ""]
for i, (a, b, text, lid) in enumerate(cues):
    nxt = cues[i + 1][0] - 0.12 if i + 1 < len(cues) else b + 0.9
    s, e = max(0, a - 0.12), min(b + 0.9, nxt - 0.02)
    srt += [str(i + 1), f"{srt_t(s)} --> {srt_t(e)}", text, ""]
    vtt += [f"{srt_t(s).replace(',', '.')} --> {srt_t(e).replace(',', '.')}", text, ""]
open(os.path.join(OUT, NAME + ".srt"), "w").write("\n".join(srt))
open(os.path.join(OUT, NAME + ".vtt"), "w").write("\n".join(vtt))

with open(os.path.join(OUT, NAME + "_VO_script.csv"), "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["line", "phrase", "in_tc_60fps", "out_tc_60fps", "in_s", "out_s", "length_s", "subtitle_text", "say_it_as", "direction"] + (["elevenlabs_text"] if VER == "v5" else []))
    for r in rows:
        first = r["phrase"] == 1
        w.writerow([r["id"], r["phrase"], tc(r["in"]), tc(r["out"]), f"{r['in']:.3f}", f"{r['out']:.3f}", f"{r['out'] - r['in']:.2f}", r["text"], r["spoken"], DIRECTION[r["id"]] if first else ""]
                   + ([ELEVEN[r["id"]] if first else ""] if VER == "v5" else []))

md = ["# KEPT launch film (final): the Keeper's VO script and timing sheet", ""] if VER == "v4" else [
      "# KEPT launch film (v5 script): the Keeper's VO script and timing sheet", "",
      "The film has **no voice in it**. The Keeper's mouth, head beats and the subtitles are animated to the timings below. Timecodes",
      "are at 60 fps from the first frame (00:00:00:00). Total length 00:01:53:10. How to cast, generate and fit the voice:",
      "`docs/KEEPER_VOICE_GUIDE.md`. Name the ElevenLabs takes `S01 … S33`, put them in `audio/vo_elevenlabs/` and run",
      "`~/.cache/kept/tts/bin/python video/scripts/vo/fit_takes.py --preview`: each phrase lands on its In frame.", "",
      "| Line | In | Out | Length | Line (as subtitled) | Direction |", "|---|---|---|---|---|---|"]
if VER == "v4": md += [
      "The film has **no voice in it**. The Keeper's mouth, head beats and the subtitles are animated to the timings below, so a",
      "take that starts on **In** and roughly fills **Length** will look lip-synced. Timecodes are at 60 fps from the first frame",
      "(00:00:00:00). Total length 00:01:53:10.", "",
      "**Voice:** the Keeper. Deadpan, dry, smug, low. He roasts excuses, never people. He loves payday. Short lines, no shouting.",
      "Phrases inside one line are separated by the pauses listed (in seconds); keep them, because the lip-sync pauses there too.", "",
      "**Two ways to lay it in:**",
      "1. **In your editor:** place each take at its **In** timecode (a waveform's first consonant on the In frame). Time-stretch a",
      "   take by up to ±8 % to land its end near **Out**. `stems/guide_vo_scratch.wav` is a robotic read placed exactly where the",
      "   lips move; line takes up against it, then mute it.",
      "2. **Re-time the film to your takes** (exact lip-sync): name the takes `F01.wav … F26.wav`, put them in `audio/vo/`, run",
      "   `VO_SCRIPT=script4.json VO_MAP=vo4.json ~/.cache/kept/tts/bin/python video/scripts/vo/align_vo.py`, then",
      "   `npm run sync` and re-render (docs/LAUNCH_FILM_V4.md §8). The mouth, subtitles and SRT follow the new takes.", "",
      "| Line | In | Out | Length | Line (as subtitled) | Direction |", "|---|---|---|---|---|---|"]
for lid, at in PLACED:
    rs = [r for r in rows if r["id"] == lid]
    text = " / ".join(r["text"] for r in rs)
    md.append(f"| {lid} | {tc(rs[0]['in'])} | {tc(rs[-1]['out'])} | {rs[-1]['out'] - rs[0]['in']:.2f} s | {text} | {DIRECTION[lid]} |")
md += ["", "## Phrase and word timings", "", "Word onsets drive the mouth" + (" (new v5 phrases: estimated by syllable; your takes are fitted per phrase)" if VER == "v5" else "") + ". Numbers are said as words (\"4,000\" = \"four thousand\", \"3 to 1\" = \"three to one\", \"7 for 7\" = \"seven for seven\", \"October 16\" = \"October sixteenth\").", ""]
for lid, at in PLACED:
    rs = [r for r in rows if r["id"] == lid]
    md.append(f"**{lid}**" + (" (not subtitled: the end card types it)" if lid in SKIP_SUBS else "") + (f" · ElevenLabs: `{ELEVEN[lid]}`" if VER == "v5" else ""))
    for r in rs:
        gap = f" (pause {r['gap']:.2f} s before)" if r["phrase"] > 1 and r["gap"] else ""
        words = ", ".join(f"{w} @{t:.2f}" for w, t in r["words"])
        md.append(f"- {tc(r['in'])} → {tc(r['out'])}{gap}: \"{r['spoken']}\"  \n  words: {words}")
    md.append("")
open(os.path.join(OUT, NAME + "_VO_script.md"), "w").write("\n".join(md))
print(f"{len(PLACED)} lines, {len(rows)} phrases → {OUT}")
