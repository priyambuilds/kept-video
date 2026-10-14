#!/usr/bin/env python3
"""Splits a one-take ElevenLabs read of the v5 script (all 33 lines in order) into its 62 phrases.

Whisper (faster-whisper small.en, word timestamps) hears the take; its words are matched to the script's caption
words (numbers and contractions normalised), so each phrase's first and last word are found even where the read
runs on or a word is misheard. Cuts between phrases go in the longest silence around Whisper's boundary, so each phrase keeps its own sounds.
Where a phrase opens with a sigh or a laugh, `audio` is where the sound starts and `start` where the words do
(the mouth waits for the words). Each phrase is then heard again on its own for its word onsets (syllable weighting where Whisper can't place a
word).

  ~/.cache/kept/tts/bin/python video/scripts/vo/split_take.py audio/vo_elevenlabs/keeper_one_take_v4.mp3
  → audio/vo_elevenlabs/keeper_one_take_v4.split.json   (phrases: take-relative audio/start/end and words)
"""
import difflib, json, os, re, subprocess, sys
import numpy as np, librosa

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
SR = 48000
NUM = {"one": "1", "two": "2", "three": "3", "four": "4", "seven": "7", "eight": "8", "sixteenth": "16", "16th": "16"}
SPOKEN = {"16th": 3, "4000": 3, "16": 2, "7": 2, "3": 1, "1": 1}


def norm(w):
    w = re.sub(r"[^a-z0-9]", "", w.lower().replace("’", "'").replace("'", ""))
    return NUM.get(w, w)


def syllables(word):
    k = re.sub(r"[^a-z0-9]", "", word.lower())
    if k in SPOKEN:
        return SPOKEN[k]
    w = re.sub(r"[^a-z]", "", word.lower())
    n = len(re.findall(r"[aeiouy]+", w)) if w else 1
    if w.endswith("e") and not w.endswith(("le", "ee")) and n > 1:
        n -= 1
    return max(1, n)


def script_phrases():
    """[(line, phrase index, caption)] in film order, from script5.json (v4 phrases resolved through vo4.json)."""
    spec = json.load(open(os.path.join(HERE, "script5.json")))["lines"]
    vo4 = json.load(open(os.path.join(HERE, "..", "..", "src", "data", "vo4.json")))["lines"]
    out = []
    for lid, l in spec.items():
        for k, p in enumerate(l["phrases"]):
            out.append((lid, k, vo4[p["from"]]["phrases"][p["i"]]["text"] if "from" in p else p["caption"]))
    return out


def main():
    src = sys.argv[1]
    y = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                                     check=True, capture_output=True).stdout, np.float32).copy()
    os.environ.setdefault("HF_HOME", os.path.expanduser("~/.cache/kept/hf"))
    from faster_whisper import WhisperModel
    model = WhisperModel("small.en", device="cpu", compute_type="int8")
    segs, _ = model.transcribe(librosa.resample(y, orig_sr=SR, target_sr=16000), word_timestamps=True, beam_size=5, condition_on_previous_text=False)
    heard = []
    for s in segs:
        for w in s.words:
            t = w.word.strip()
            if heard and re.match(r"^[,\-]", t):          # "4" ",000" → "4,000"; "take" "-backs" → "take-backs"
                heard[-1] = (heard[-1][0] + t, heard[-1][1], w.end)
            else:
                heard.append((t, w.start, w.end))

    phrases = script_phrases()
    cap = [(i, w) for i, (_, _, text) in enumerate(phrases) for w in text.split()]
    sm = difflib.SequenceMatcher(a=[norm(w) for _, w in cap], b=[norm(h[0]) for h in heard], autojunk=False)
    st, en = [None] * len(cap), [None] * len(cap)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n):
            st[a + k], en[a + k] = heard[b + k][1], heard[b + k][2]
    matched = sum(v is not None for v in st)
    known = [k for k, v in enumerate(st) if v is not None]
    for k in range(len(cap)):                            # interpolate misheard words between matched neighbours
        if st[k] is None:
            lo = max([j for j in known if j < k], default=None); hi = min([j for j in known if j > k], default=None)
            t0 = en[lo] if lo is not None else 0.0; t1 = st[hi] if hi is not None else len(y) / SR
            gap = [j for j in range(len(cap)) if (lo is None or j > lo) and (hi is None or j < hi)]
            i = gap.index(k)
            st[k] = t0 + (t1 - t0) * i / len(gap); en[k] = t0 + (t1 - t0) * (i + 1) / len(gap)

    # Cuts between phrases go in the longest silence (45 dB under the take's peak, 10 ms frames) around Whisper's
    # boundary, so a phrase keeps everything it owns (a sigh, a laugh, a soft last consonant).
    hop = int(0.01 * SR)
    env = np.sqrt(np.convolve(y ** 2, np.ones(hop * 2) / (hop * 2), mode="same"))[::hop]
    on = 20 * np.log10(env + 1e-9) > 20 * np.log10(env.max()) - 45
    fr = lambda t: int(np.clip(round(t / 0.01), 0, len(on) - 1))
    first = lambda i: min(j for j, (pi, _) in enumerate(cap) if pi == i)
    last = lambda i: max(j for j, (pi, _) in enumerate(cap) if pi == i)
    cuts, runon = [], set()                               # (end of phrase i, start of phrase i+1), in frames
    for i in range(len(phrases) - 1):
        lo = max(fr(st[last(i)] - 0.25), fr(st[first(i)] + 0.05), cuts[-1][1] + 5 if cuts else 0)
        hi = max(fr(st[first(i + 1)] + 0.6), lo + 1)
        runs, j = [], lo
        while j < hi:
            if not on[j]:
                k = j
                while k < hi and not on[k]:
                    k += 1
                runs.append((j, k)); j = k
            else:
                j += 1
        runs = [r for r in runs if r[1] - r[0] >= 5]
        if runs:
            cuts.append(max(runs, key=lambda r: r[1] - r[0]))
        else:                                             # no silence: cut at the quietest frame and say so
            m = lo + int(np.argmin(env[lo:hi])); cuts.append((m, m)); runon.add(i)
    start0 = int(np.argmax(on)); end_last = len(on) - int(np.argmax(on[::-1]))
    sig = librosa.resample(y, orig_sr=SR, target_sr=16000)
    out = []
    for i, (lid, k, text) in enumerate(phrases):
        a0 = (cuts[i - 1][1] if i else start0) * 0.01
        b2 = (cuts[i][0] if i < len(cuts) else end_last) * 0.01
        while fr(a0) < fr(b2) and not on[fr(a0)]:
            a0 += 0.01
        # Each phrase is heard again on its own (Whisper is far more precise on a short clip): its words give the
        # word onsets, and a first word that starts well into the clip means a lead-in (a sigh, a laugh) that the
        # mouth waits through.
        ws_ = [j for j, (pi, _) in enumerate(cap) if pi == i]
        clip = sig[int(a0 * 16000):int((b2 + 0.05) * 16000)]
        cs, _ = model.transcribe(np.concatenate([np.zeros(3200, np.float32), clip]), word_timestamps=True, beam_size=5, condition_on_previous_text=False)
        cw = [(w.word.strip(), a0 + w.start - 0.2) for c in cs for w in c.words]
        m = difflib.SequenceMatcher(a=[norm(cap[j][1]) for j in ws_], b=[norm(w) for w, _ in cw], autojunk=False)
        on_ = {}
        for x, yb, n in m.get_matching_blocks():
            for q in range(n):
                on_[x + q] = cw[yb + q][1]
        lead = None
        a2 = a0
        if 0 in on_ and on_[0] - a0 > 0.2:
            a2, lead = on_[0] - 0.03, round(on_[0] - 0.03 - a0, 2)
        elif 0 not in on_:                               # first word not heard (a sigh blurs it): wait for the voice
            _, voiced, _ = librosa.pyin(clip, fmin=60, fmax=400, sr=16000, frame_length=1024, hop_length=160)
            if voiced.any() and int(np.argmax(voiced)) * 0.01 > 0.25:
                a2 = a0 + int(np.argmax(voiced)) * 0.01 - 0.08
                lead = round(a2 - a0, 2)
        wt = [syllables(cap[j][1]) for j in ws_]
        prop = [a2 + (b2 - a2) * sum(wt[:n]) / sum(wt) for n in range(len(ws_) + 1)]
        starts = []
        for n in range(len(ws_)):
            s0 = on_.get(n, -1) if n else a2
            ok = a2 <= s0 < b2 - 0.05 and (not starts or s0 - starts[-1] >= 0.07)
            starts.append(s0 if ok else max(prop[n], (starts[-1] + 0.07) if starts else a2))
        words = [{"w": cap[j][1], "start": round(starts[n], 3), "end": round(starts[n + 1] if n + 1 < len(ws_) else b2, 3)} for n, j in enumerate(ws_)]
        heard_clip = " ".join(w for w, _ in cw)
        out.append({"line": lid, "phrase": k, "text": text, "audio": round(a0, 3), "start": round(a2, 3), "end": round(b2, 3), "lead": lead,
                    "runon": i in runon, "words": words, "heard": heard_clip})
    dst = os.path.splitext(src)[0] + ".split.json"
    json.dump({"$doc": "split_take.py: phrases of a one-take read, times in seconds from the start of `file`.", "file": os.path.relpath(src, ROOT),
               "duration": round(len(y) / SR, 3), "matched": f"{matched}/{len(cap)}", "phrases": out}, open(dst, "w"), indent=1, ensure_ascii=False)
    print(f"{matched}/{len(cap)} script words matched · {len(out)} phrases → {os.path.relpath(dst, ROOT)}")


if __name__ == "__main__":
    main()
