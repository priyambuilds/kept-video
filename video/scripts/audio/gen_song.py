#!/usr/bin/env python3
"""Generate original score candidates with ACE-Step 1.5 (MIT; text prompt only, no reference audio).

Run with the ACE-Step venv, in two passes (16 GB can't hold the LM and the DiT at once):
  ~/.cache/kept/ace/.venv/bin/python video/scripts/audio/gen_song.py lm  [take ...]
  ~/.cache/kept/ace/.venv/bin/python video/scripts/audio/gen_song.py dit [take ...]
Writes video/generated/audio/music/song/<take>_<seed>.wav. Nothing from audio/music-refs is ever loaded.
"""
import os, sys, json, time
ACE = os.path.expanduser("~/.cache/kept/ace")
sys.path.insert(0, ACE)
from acestep.handler import AceStepHandler
from acestep.llm_inference import LLMHandler
from acestep.inference import GenerationParams, GenerationConfig, generate_music

OUT = os.path.join(os.path.dirname(__file__), "../../generated/audio/music/song")  # npm run sync copies it to public/gen
STRUCT = """[Intro - filtered, sparse, mysterious]

[Build - rising tension, snare roll]

[Drop - catchy synth lead hook, full groove]

[Verse - groove with space, plucked chords]

[Pre-Chorus - rising]

[Chorus - big anthemic hook, euphoric]

[Breakdown - emotional chords, no drums]

[Build - riser]

[Drop - full energy, lead hook returns]

[Outro - hook, then fade]"""
BASE = ("melodic house, dark but uplifting, cinematic launch trailer, 124 bpm, four on the floor punchy kick, "
        "rolling sidechained bassline, warm minor-key chord progression, memorable plucked synth lead melody hook, "
        "lush pads, crisp claps, big build-ups and drops, polished modern production")
TAKES = {
    "A": dict(caption=BASE + ", instrumental, no vocals", lyrics="[Instrumental]\n" + STRUCT, instrumental=True),
    "B": dict(caption=BASE + ", wordless female vocal chops as the hook, airy oohs and ahs", lyrics=STRUCT.replace(
        "[Chorus - big anthemic hook, euphoric]", "[Chorus - big anthemic hook, euphoric]\n(ooh, ooh-ooh)\n(ah, ah-ah)").replace(
        "[Drop - full energy, lead hook returns]", "[Drop - full energy, lead hook returns]\n(ooh, ooh-ooh)"), instrumental=False),
    "C": dict(caption=("dark pop electronic, confident swagger, 124 bpm, punchy drums, deep bass, catchy synth hook, "
                       "male and female gang vocal chant in the chorus, modern advert music"),
              lyrics="""[Intro]

[Verse - instrumental groove]

[Pre-Chorus - rising]

[Chorus - chant]
Keep your word
Keep your word
Or pay your friends

[Instrumental - drop]

[Breakdown]

[Chorus - chant]
Keep your word
Keep your word
Or pay your friends

[Outro]""", instrumental=False),
}

def lm_phase(takes, seeds):
    """Pass 1: the 5 Hz LM writes each take's audio codes (structure, melody plan). Saved as JSON."""
    lm = LLMHandler()
    msg, ok = lm.initialize(checkpoint_dir=os.path.join(ACE, "checkpoints"), lm_model_path="acestep-5Hz-lm-1.7B", backend="mlx", device="auto", offload_to_cpu=False, dtype=None)
    assert ok, msg
    for name in takes:
        spec = TAKES[name]
        for seed in seeds:
            out = os.path.join(OUT, f"{name}_{seed}.codes.json")
            if os.path.exists(out):
                continue
            r = lm.generate_with_stop_condition(caption=spec["caption"], lyrics=spec["lyrics"], infer_type="llm_dit", temperature=0.85, cfg_scale=2.0,
                                                negative_prompt="NO USER INPUT", top_k=None, top_p=0.9, target_duration=DUR,
                                                user_metadata={"bpm": 124, "keyscale": "F minor", "timesignature": "4", "duration": DUR},
                                                use_cot_caption=False, use_cot_language=False, use_cot_metas=False, use_constrained_decoding=True,
                                                batch_size=1, seeds=[seed])
            if not r.get("success"):
                print("FAIL-LM", name, seed, r.get("error"), flush=True); continue
            json.dump({"codes": r["audio_codes"], "metadata": r.get("metadata", {})}, open(out, "w"))
            print("CODES", out, flush=True)


def dit_phase(takes, seeds):
    """Pass 2 (separate process, no LM in memory): the DiT renders audio from the saved codes."""
    dit = AceStepHandler()
    msg, ok = dit.initialize_service(project_root=ACE, config_path="acestep-v15-turbo", device="auto", offload_to_cpu=False, use_mlx_dit=True)
    assert ok, msg
    for name in takes:
        spec = TAKES[name]
        for seed in seeds:
            src = os.path.join(OUT, f"{name}_{seed}.codes.json"); dst = os.path.join(OUT, f"{name}_{seed}.wav")
            if not os.path.exists(src) or os.path.exists(dst):
                continue
            codes = json.load(open(src))["codes"]
            t0 = time.time()
            p = GenerationParams(task_type="text2music", thinking=False, use_cot_caption=False, use_cot_language=False, use_cot_metas=False,
                                 caption=spec["caption"], lyrics=spec["lyrics"], instrumental=spec["instrumental"], audio_codes=codes,
                                 bpm=124, keyscale="F minor", timesignature="4", vocal_language="en", duration=DUR, inference_steps=8, shift=3.0, seed=seed)
            r = generate_music(dit, None, params=p, config=GenerationConfig(batch_size=1, use_random_seed=False, seeds=[seed], audio_format="wav"), save_dir=OUT)
            if not r.success:
                print("FAIL", name, seed, r.error, flush=True); continue
            os.replace(r.audios[0]["path"], dst)
            print("OK", dst, f"{time.time()-t0:.0f}s", flush=True)


DUR = 104

def main():
    phase, takes = sys.argv[1], (sys.argv[2:] or list(TAKES))
    os.makedirs(OUT, exist_ok=True)
    (lm_phase if phase == "lm" else dit_phase)(takes, (11, 23))

if __name__ == "__main__":
    main()
