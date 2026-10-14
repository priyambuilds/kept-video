# SFX LIST: KEPT launch teaser

Status: **waiting for approval.** After that, drop the files into `audio/sfx/` **using the file names below**. 48 kHz / 24-bit WAV preferred (16-bit is fine), mono unless marked stereo, trimmed tight with no leading silence.

**Character rule (brief §8b):** tight and designed, never cartoony.
- No boings, slide whistles, "wah-wah" or kazoo.
- Every sound should feel like premium UI + nightclub + heist.
- Where a sound sits on the music grid it's tagged **(beat)**. I'll nudge it to the nearest beat at 137.14 BPM (1 beat = 0.4375 s).

**Sources key:**
- **ES** Epidemic Sound SFX
- **AL** Artlist SFX
- **FS0** freesound.org with the *Creative Commons 0* licence filter **only**
- **AI** an AI SFX generator with commercial rights (e.g. ElevenLabs Sound Effects)
- **Ⓢ** I can **synthesise** it myself in code (sine/noise/FM). No licence needed; I'll do these unless you prefer a sourced one.

Timestamps are for the **28 s** cut (15 s cut in the last column). They come from the brief script plus RECON; the shot list (phase 2) will lock them.

---

## A · Hook (0:00–0:03)
| # | File name | 28 s | 15 s | What / character | Length | Source |
|---|---|---|---|---|---|---|
| 01 | `sfx_01_ding_cheap.wav` | 0:00.60 | 0:00.60 | Generic app "task done" ding: thin, slightly plasticky, mid-heavy, *deliberately cheap* (it's the competitor) | 0.4 s | ES "UI notification simple", FS0 "ding notification", Ⓢ |
| 02 | `sfx_02_tick_cheap.wav` | 0:00.55 | 0:00.55 | Flat checkbox tick under the ding | 0.1 s | Ⓢ |
| 03 | `sfx_03_record_scratch.wav` | 0:01.75 (beat) | 0:01.75 | Short, real vinyl scratch-stop (not a comedy "zip"): dry, 1 backspin and stop | 0.5 s | ES "record scratch stop", AL "vinyl stop", FS0 |
| 04 | `sfx_04_cloth_lean.wav` | 0:00.9 | 0:00.9 | The Keeper leans in from the edge: soft heavy-cloth rustle, very quiet | 0.6 s | ES "cloth movement robe", FS0 "fabric swish" |

## B · Problem (0:03–0:07)
| # | File name | 28 s | 15 s | What / character | Length | Source |
|---|---|---|---|---|---|---|
| 05 | `sfx_05_flick.wav` | 0:03.06 (beat) | — | Finger flick on the streak flame: a crisp "tk" with a short air tail | 0.2 s | FS0 "finger flick", Ⓢ |
| 06 | `sfx_06_flame_crack.wav` | 0:03.50 (beat) | — | The 🔥 12 cracks to 0: a glassy crack + small ember fizz + a low thud | 0.7 s | ES "glass crack small", FS0 "ice crack", AI |
| 07 | `sfx_07_count_down.wav` | 0:03.6–0:04.2 | — | 12 → 0 counter: fast descending soft ticks (12 ticks, pitch falling) | 0.6 s | **Ⓢ** (generated to the exact count) |
| 08 | `sfx_08_reminder_pop_a/b/c.wav` (×3) | 0:04.4, 0:04.6, 0:04.8 | — | Grey reminders piling in: dull, muted notification bumps (low-pass, "nagging") | 0.15 s each | Ⓢ, ES "notification muted" |
| 09 | `sfx_09_swat_a/b/c.wav` (×3) | 0:05.25, 0:05.69, 0:06.13 (beats) | — | Glove swats a card off-screen: tight leather slap + short air whoosh (the whoosh pitch rises across the three) | 0.35 s each | ES "punch whoosh light", AL "swipe whoosh", FS0 |
| 10 | `sfx_10_slap_collapse.wav` | 0:06.56 | 0:03.06 | Two-hand slap that collapses the clutter: palm slap + **reverse-suck** of air into a point (lands right before the dropout) | 0.5 s | AI ("hands slap table then air sucked into a point"), ES "reverse whoosh" |

## C · Aha / logo (0:07–0:10)
| # | File name | 28 s | 15 s | What / character | Length | Source |
|---|---|---|---|---|---|---|
| 11 | `sfx_11_logo_boom.wav` | **0:07.00** (beat) | 0:03.50 | **Low sub boom / impact** for the logo: 40–60 Hz body, a short transient, about 1 s decay, no cinematic "braam" | 1.2 s | ES "sub drop impact", AL "boom low", **Ⓢ** (layer a synthesized 45 Hz sine drop under the sourced one) |
| 12 | `sfx_12_check_draw.wav` | 0:07.10 | 0:03.60 | The Check-K check stroke draws: a quick bright "swip" (pen on glass) | 0.3 s | ES "UI swipe bright", FS0 "marker stroke", Ⓢ |
| 13 | `sfx_13_keeper_popin.wav` | 0:07.6 | 0:03.9 | The Keeper pops up behind the logo: soft "fwump" + cloth | 0.4 s | ES "pop soft whoosh", FS0 |

## D · Feature 1: Make an Oath (0:10–0:13.5)
| # | File name | 28 s | 15 s | What / character | Length | Source |
|---|---|---|---|---|---|---|
| 14 | `sfx_14_tap_a/b/c/d.wav` (×4) | 0:10.5, 0:11.38, 0:12.25, 0:12.69 (beats) | — | His glove taps the UI: a tight, premium glass tap (the "click" of a high-end UI), slight pitch rise per tap | 0.08 s | ES "UI tap glass", AL "UI click", **Ⓢ** |
| 15 | `sfx_15_shuffle_tiles.wav` | 0:10.6 | — | Object tiles flick through fast, then land on Dumbbell: a short card-riffle | 0.4 s | ES "cards shuffle quick", FS0 |
| 16 | `sfx_16_coin_roll.wav` | 0:11.4–0:12.1 | — | Stake rolls to 1,000 SKR: rapid coin ticks, accelerating, ending on a single ring | 0.7 s | **Ⓢ** (ticks) + ES "coin single" for the ring |
| 17 | `sfx_17_avatar_whoosh_a/b/c.wav` (×3) | 0:12.3, 0:12.4, 0:12.5 | — | Three friend avatars fly in: short airy whooshes, slightly different pitch | 0.25 s | ES "whoosh short", AL |
| 18 | `sfx_18_slam_stamp.wav` | 0:13.13 (beat) | — | He slams **Sign & stake**: heavy fist-on-button thump + **rubber-stamp** "chunk" (Sworn.) | 0.5 s | ES "stamp paper hit", AL "heavy button press", AI |
| 19 | `sfx_19_card_flip.wav` | 0:13.4 | — | Ace/Oath card flip into place: crisp single card flick | 0.3 s | FS0 "card flip", ES |

## E · Feature 2: Prove it (0:13.5–0:17.5)
| # | File name | 28 s | 15 s | What / character | Length | Source |
|---|---|---|---|---|---|---|
| 20 | `sfx_20_viewfinder_open.wav` | 0:13.6 | 0:05.3 | "Take photo" grows into the viewfinder: a mechanical iris/aperture open, short | 0.4 s | ES "camera focus", AL "mechanical open" |
| 21 | `sfx_21_shutter.wav` (×2) | 0:14.44 (cheat), 0:16.19 (real) | 0:05.69, 0:06.8 | **Camera shutter**: crisp and modern (mirrorless, not a film camera, not the iPhone sound) | 0.15 s | ES "camera shutter mirrorless", AL, FS0 |
| 22 | `sfx_22_scan_hum.wav` | 0:14.5–0:15.0, 0:16.2–0:16.7 | 0:05.7–0:06.1 | Visor-scanner sweep: soft electrical hum with a moving filter | 0.5 s | **Ⓢ** |
| 23 | `sfx_23_error_buzz.wav` | 0:15.31 (beat) | 0:06.13 | **Error buzz** on the cheat ✗: a short, low, square-ish double buzz (bouncer "nope"), not a game-show buzzer | 0.35 s | ES "UI error low", **Ⓢ** |
| 24 | `sfx_24_shake.wav` | 0:15.35 | 0:06.17 | Gesture badge shake: tiny rattle | 0.2 s | Ⓢ |
| 25 | `sfx_25_check_tick_1/2/3.wav` (×3) | 0:16.63, 0:16.84, 0:17.06 | 0:07.0, 0:07.2, 0:07.4 | **Soft, satisfying ✓ ticks, rising pitch per check** (≈ F, A♭, C in F minor) | 0.15 s | **Ⓢ** (tuned to the track's key once known) |
| 26 | `sfx_26_hp_fill.wav` | 0:16.9–0:17.3 | — | HP bar fills: rising granular shimmer into a spark ("fuse" lead-in to the scythe) | 0.4 s | Ⓢ, ES "power up short" |

## F · Signature moment (0:17.5–0:21.5): **the most polish**
Built as **layers I'll mix into one designed hit**. Please source each layer separately.

| # | File name | 28 s | 15 s | What / character | Length | Source |
|---|---|---|---|---|---|---|
| 27 | `sfx_27_scythe_windup.wav` | 0:17.0–0:17.45 | 0:08.3 | Wind-up: the blade turned in the air, a low metallic "shhhng" rising (reversed blade ring) | 0.45 s | ES "sword unsheathe", AL "blade ring", AI (+ I reverse it) |
| 28 | `sfx_28_scythe_swish.wav` | **0:17.50** (beat) | 0:08.75 | **The swing**: a fast, heavy, *airy* swish with a steel edge: short, mostly air, sharp front | 0.35 s | ES "sword swing heavy", AL "blade whoosh", FS0 "scythe swing" |
| 29 | `sfx_29_slice_transient.wav` | 0:17.52 | 0:08.77 | The cut: a clean metallic **slice** (paper + steel) where the blade passes Alex's card | 0.2 s | ES "knife slice metal", AI |
| 30 | `sfx_30_glass_shatter.wav` | 0:17.55 | 0:08.80 | The stake **shatters**: a *small*, bright glass shatter (tumbler, not a window), tight tail | 0.8 s | ES "glass shatter small", AL, FS0 |
| 31 | `sfx_31_coin_burst.wav` (stereo) | 0:17.56 | 0:08.81 | The coins burst out: a dense handful of coins spilling in the air (stereo spread) | 0.7 s | ES "coins spill burst", AL, FS0 |
| 32 | `sfx_32_coin_land_01…12.wav` (×12 or one multi-hit file) | 0:17.9–0:19.4, on **16ths** (beat) | 0:09.1–0:10.4 | **Coin clinks landing in rhythm**: single coins dropping onto a stack, lots of variants (different coins/pitches), very dry | 0.15 s each | ES "coin drop single" (pick 12), FS0 "coin drop", AI |
| 33 | `sfx_33_counter_roll.wav` | 0:18.6–0:19.5 | 0:09.6–0:10.3 | Friends' counters rolling 1,000 → 1,025: a fine, fast tick stream (slot-counter, *not* casino) | 0.9 s | **Ⓢ** |
| 34 | `sfx_34_ledger_drop.wav` | 0:19.7 | 0:10.5 | "KEPT 25" chip drops into the ledger: a muted paper thud + a single coin | 0.3 s | ES "book close soft", FS0 |
| 35 | `sfx_35_giddy_shimmy.wav` | 0:20.2–0:21.0 | 0:11.0 | The shimmy: very soft cloth rustle + a tiny jingle of coins in his robe, quiet under "I love this part." | 0.8 s | ES "cloth rustle", FS0 "keys/coins jingle" |

## G · Proof flash (0:21.5–0:23)
| # | File name | 28 s | 15 s | What / character | Length | Source |
|---|---|---|---|---|---|---|
| 36 | `sfx_36_ledger_stamp_1/2/3.wav` (×3) | 0:21.44, 0:21.88, 0:22.31 (beats) | — | Each chip snaps in as a **ledger stamp**: an ink-stamp "thock" + pen tick (doubles the music stabs) | 0.2 s | ES "rubber stamp", AL "stamp paper", FS0 |
| 37 | `sfx_37_ledger_close.wav` | 0:22.75 (beat) | — | Ledger snapped shut toward the camera → cream CTA: a big-book slam with an air push | 0.5 s | ES "book slam shut", FS0 |

## H · CTA and tag (0:23–0:28)
| # | File name | 28 s | 15 s | What / character | Length | Source |
|---|---|---|---|---|---|---|
| 38 | `sfx_38_word_tick.wav` | per word of L10 (≈0:23.1–0:25.9) | — | Tagline lands word by word: an almost subliminal soft tick per word | 0.05 s | **Ⓢ** |
| 39 | `sfx_39_logo_hit_final.wav` | **0:24.50** (beat) | 0:12.25 | Final logo hit: deeper and shorter than #11, a clean "full stop" | 0.9 s | ES "impact low cinematic short", Ⓢ layer |
| 40 | `sfx_40_lean_creak.wav` | 0:24.6 | 0:12.4 | He leans his elbow on the logo: a soft, low "settling" thud | 0.3 s | FS0, ES "body lean wood" |
| 41 | `sfx_41_visor_glint.wav` | 0:26.0 | 0:13.6 | Visor glint: a tiny high "tink" shimmer (one sparkle, not a twinkle loop) | 0.4 s | ES "glint sparkle", **Ⓢ** |
| 42 | `sfx_42_sting_watching.wav` | 0:27.4 | — (or 0:14.4) | Tiny sting under "…I'll be watching.": one low reversed piano/bell note into a soft click on the wink | 0.8 s | AL "sting dark short", AI, Ⓢ |

---

### Summary of what to source vs what I'll synthesise
- **Please source (about 25 files):** 03, 04, 06, 09, 10, 11, 13, 15, 18, 19, 20, 21, 23*, 27, 28, 29, 30, 31, 32 (12 variants), 34, 35, 36, 37, 39, 40, 42 (*optional).
- **I'll synthesise (unless you'd rather source):** 01, 02, 05, 07, 08, 12, 14, 16 (ticks), 22, 24, 25, 26, 33, 38, 41, and a sub layer under 11 and 39. Synthesised sounds are deterministic, licence-free, and tuned to the track's key/BPM once `track.mp3` arrives.
- **Priority if time is short:** the signature layers 27–33 first, then 11, 21, 23, 03, 39.

### Licence checklist
Keep the licence/receipt for every sourced file in `audio/sfx/LICENSES.txt` (file name → source URL → licence). FS0 means **CC0 only**; CC-BY or NC files can't be used in an ad.
