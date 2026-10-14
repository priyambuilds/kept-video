# KEPT launch film, final cut (v4)

1:53 · 16:9 · 1080p60. Code: `video/src/film4/`, composition `Launch4-16x9`. Deliverables: `renders/final/`.

## 0 · Your v3 notes and what changed

| Note | Change |
|---|---|
| v2 was the better base; keep its flow and script up to the friends | Acts 1–3 follow v2: lock-screen hook, the "bills you" line, the drop into the splash, sign-in, pick a look, the Oath and its contract. The v2 lines are used word for word (F01–F03, F06–F08). |
| Drop the "you tapped done" intro | Gone. The film opens on v2's lock screen. |
| Keep v3's social story | v3's multi-phone acts follow the Oath: friends join on their own phones, Day 1, Arjun's night, midnight on all four phones, group review, Day 7, Bounties. |
| Text on the left fights the phone for attention | **No explanatory text in the frame.** Every headline, eyebrow, caption, time card, countdown and fee label is removed. The phone sits centre-frame (scale 0.98–1.1, with push-ins to 1.5–4.9×), and the Keeper stands beside it and does the explaining. Time of day is shown by the lock-screen clocks (6:58, 20:14, 23:59), not by cards. What's left on screen: the app's own UI, name chips over friends' phones, the money pills (+43, −143, the 4,000 pot), the subtitles, and the end card. |
| No Keeper voice; lip-sync and subtitles ready for your VO | The film is silent where he talks. His stitched mouth opens per syllable from a 26-line transcript, with the stitches stretched across the gap like threads, so he stays on-model. Subtitles are burned into one master and left off the other; SRT/VTT, a timing sheet and stems are included. |
| Final, polished, no glitches | Every act boundary checked frame by frame. Fixed: an empty phone at the onboarding→Oath handoff; blank screens on five cuts (screens now mount before the cut); clipped name tags; a subtitle over the Claim button. |
| Use the generated music | The same ACE-Step song (take B_23). Re-cut to the new bar map, not regenerated (§6). |

## 1 · The story in one line

The Keeper welcomes you in, you swear an Oath and put money on it, your friends join on their own phones, and a week plays out. Arjun misses, everyone who showed up gets paid, then a bigger table (Bounties), your public record, and the end card.

## 2 · Act map (bar = 1.95115 s, 123 BPM)

| Bar | Time | Act | Music (source bars of B_23) |
|---|---|---|---|
| 0 | 0:00.0 | **Hook.** Lock screen filling with KEPT nudges, the Keeper leaning on the phone. "Every habit app lets you quit." "This one bills you." He pokes the newest nudge. | intro 0–1, hat build 7 |
| 3 | 0:05.9 | **Drop 1.** Dive into the splash. "Welcome to KEPT." He waves. | chorus 24–25 |
| 5 | 0:09.8 | **Sign-in.** A1 → Seeker Wallet (push-in on the sheet) → sign → verified → pick a look (dutch push-in, two shuffles). "Pick a look. … Bold." | groove 8–11 |
| 9 | 0:17.6 | **The Oath.** C1 ECU → object → length → stake (dutch ECU) → review → terms. The rules card lifts out and lands back in its slot. Sign. He slams his SEALED stamp. "Sworn." | groove 12–16, build 22–23 |
| 16 | 0:31.2 | **Bring your friends.** QR full-bleed → pull back to four phones → invites land → Riya joins → whip to Arjun, who finally opens it (the Keeper peeks in: "Even Arjun.") → Dev's already in → avatars fly into your seats, the pot climbs to 4,000 → the phones settle like cards on a table. | chorus 2, 32–38 |
| 23 | 0:44.9 | **Day 1.** 6:58 lock screen → Today → camera → the cheat fails → cutaway: "Nice try." → retry → Day 1 kept → Riya / Dev / Arjun kept. He has his morning coffee. | groove 8–12 |
| 28 | 0:54.6 | **Arjun's night.** You nudge him → whip to his lock screen: nudges piling up at 23:59. The Keeper flips a coin ("3 to 1 he misses."), draws the scythe, and the camera pushes into the clock. | breakdown 17–19, build 23 (one beat of silence before midnight) |
| 32 | 1:02.4 | **Midnight (drop 2).** All four phones take the hit. The scythe cuts across Arjun's phone and a red −143 tears off and bursts into coins: +43 to you, Riya and Dev. Cutaway: shades, jumping. "Honestly? I love this part." | chorus 24–27 |
| 36 | 1:10.2 | **Review.** Dev's photo goes to the group. Riya approves on her phone, you approve on yours, while the Keeper squints through his lens out of focus in the foreground. "Day 3 counts as kept." | chorus tail 28–30 |
| 39 | 1:16.1 | **Day 7.** 1,107 counts up → Claim → whip to Arjun's phone: 857, down 143. "Arjun? He'll be back." | groove 12–15 |
| 43 | 1:23.9 | **Bounties.** Feed → Northbound Run Club → join. A crowd of 112 strangers; the Keeper mows them in two swings; 27 stay lit. +4,444. | chorus 2, 36–40 |
| 48 | 1:33.7 | **Your record.** Profile; the 91 % ring lifts out; the Keeper reads your ledger. "Your kept rate is public. Make it worth reading." | breakdown 2, 41–42 |
| 50 | 1:37.6 | **The wall.** Pull back into a drifting wall of 20 real KEPT screens. | breakdown 2, 43–44 |
| 52 | 1:41.5 | **End card.** The lockup, then the tagline word by word on his line. He presses Get on the store card and it turns into "Oct 16". "KEPT. On Seeker. October sixteenth." Then the plate, glint, point and wink. | last chorus 24–27, outro 46–47 (2-bar fade) |
| 58 | 1:53.2 | end | |

## 3 · Frame rules

- One subject at a time: the phone (centre, big) or a Keeper close-up. The Keeper stands beside the phone, about 380–440 px tall, and only overlaps the phone's edge to point or stamp.
- Every shot moves. Push-ins land on what's being tapped, with dutch angles on money moments and whip-pans between friends' phones.
- Subtitles sit in a single plate at the bottom centre, below the phone's tap targets. The end card skips them because it types its own words.
- Anything that must never be cut by a tilted phone is drawn outside the 3D stage: the close-ups and the subtitles.

## 4 · The Keeper

- **Body.** Hops with anticipation, squash and stretch; leans from his velocity; robe follow-through (`keeper/actor.ts`).
- **Props and gags.** Waves; pokes a notification; judges your avatar ("Bold."); slams the SEALED stamp; peeks in on Arjun; coffee; the "Nice try." stare; coin flip; scythe; shades dance; lens; ledger; Get press; wink.
- **Lip-sync** (new; `data/vo.ts › mouth`, drawn in `keeper/KeeperSVG.tsx`):
  - Each word is split into syllables.
  - Each syllable opens the mouth by its vowel: a = wide, o/u = round, e/i = half.
  - m/b/p onsets start closed.
  - The stitch stays drawn and the opening appears beneath it, with the four stitches stretched across the gap as bone-white threads.
  - Grin moods (shades, happy) open the grin instead.
  - The subtitle speaker-tag bust lip-syncs too.
  - **Note:** the brief said "no lip-sync (his mouth is stitched)". Your request for lip-sync overrides it; this is the on-model compromise.

## 5 · Transcript

26 lines, F01–F26 (`video/scripts/vo/script4.json`). The full sheet with timecodes, pauses, word onsets and direction is `renders/final/KEPT_launch_final_VO_script.md` (and `.csv`). Word timings come from a scratch Kokoro read, which is used only for timing; its audio is not in the film.

## 6 · Music and mix

- **Song:** the v3 song, take B_23, re-cut with `edit_song.py B_23 v4` → `edit4.wav` (58 bars).
  - The joins are 10 ms crossfades on the beat grid.
  - There is a reversed swell into drop 1 and one beat of silence before midnight.
  - The last two bars fade out.
- **Mix:** music at −2 dB with about 100 quiet SFX (taps, whooshes, shutter, scythe, coins, stamp) and no bells. Mastered to −14 LUFS integrated.
- **Stems** (raw mix levels; the master adds +2.8 dB into a −1 dBTP limiter):
  - `music.wav`
  - `music_ducked_for_vo.wav`: −7 dB under every line, so you can drop the VO straight on.
  - `sfx.wav`
  - `guide_vo_scratch.wav`: a timing reference only.

## 7 · Deliverables (`renders/final/`)

| File | What |
|---|---|
| `KEPT_launch_final_16x9_1080p60_subtitled.mp4` | The post-ready master: music + SFX, burned-in Keeper subtitles. |
| `KEPT_launch_final_16x9_1080p60_clean.mp4` | Same, no subtitles (for adding your VO and your own captions). |
| `KEPT_launch_final_16x9_720p60_subtitled.mp4` | Light preview copy. |
| `KEPT_launch_final.srt` / `.vtt` | Subtitle sidecars on the film's clock. |
| `KEPT_launch_final_VO_script.md` / `.csv` | VO script + timing sheet + direction. |
| `stems/` | music, music ducked for VO, SFX, scratch guide VO. |

## 8 · Re-render / swap in your VO

```
cd video
npm run sync
node scripts/render.mjs Launch4-16x9 ../renders/final/raw/subs.mp4 0 16 '{"subs":true}'
node scripts/render.mjs Launch4-16x9 ../renders/final/raw/clean.mp4 0 16 '{"subs":false}'
node scripts/render.mjs Launch4-16x9 ../renders/final/raw/stem_music.wav 0 16 '{"stem":"music"}'   # also musicDucked, sfx, guide
python3 scripts/vo/export_transcript.py
```

**For exact lip-sync to your ElevenLabs takes:**
1. Name the takes `F01…F26` (.wav or .mp3) and put them in `audio/vo/`.
2. Run `VO_SCRIPT=script4.json VO_MAP=vo4.json ~/.cache/kept/tts/bin/python video/scripts/vo/align_vo.py`.
3. Re-run the commands above. The mouth, subtitles, SRT and guide stem all follow the new takes.

Keep each take within about 10 % of its slot length, or nudge its `at` in `film4/timeline.ts`.

## 9 · v5: the rewritten Keeper script (same picture)

The v4 lines narrated the screens but never made the Keeper a character, and left dead air in the gaps. v5 keeps
every frame and beat of v4 and rewrites what he says: a name ("I'm the Keeper."), a bet against you that pays off
("I give it three days." → "Seven for seven." → "I gave you three days. Don't let it go to your head."), a cast of
friends with Arjun as the running gag, and a sign-off ("I'll be watching."). The full-screen close-ups ("Nice try.",
"Honestly? I love this part.") and the typed tagline are locked to their v4 frames. Rationale, casting and the 33
lines with direction: `docs/KEEPER_VOICE_GUIDE.md`.

- **Script:** `video/scripts/vo/script5.json` (lines S01–S33). A phrase either reuses a v4 phrase (same frames, same
  lip-sync) or is new, with its start and length designed against the picture.
- **Timing map:** `python3 video/scripts/vo/design_vo.py` → `video/src/data/vo5.json`. New phrases split by syllable
  weight, like `make_vo.py`. No audio is generated.
- **Film:** composition `Launch5-16x9` is `Launch4` with `script: "v5"`. `film4/script.tsx` gives every act the lines
  its Keeper speaks (`SCRIPTS` in `timeline.ts`), so the mouth, subtitles and music ducking all follow the script.
  `Launch4-16x9` still renders v4 unchanged.
- **Deliverables:** `renders/final_v5/`.

```
cd video && npm run sync
node scripts/render.mjs Launch5-16x9 ../renders/final_v5/raw/subs.mp4 0 16 '{"subs":true,"script":"v5"}'
node scripts/render.mjs Launch5-16x9 ../renders/final_v5/raw/clean.mp4 0 16 '{"subs":false,"script":"v5"}'
# the mix (music + SFX) doesn't depend on the script: take the mastered audio from the v4 finals
ffmpeg -i ../renders/final_v5/raw/subs.mp4 -i ../renders/final/KEPT_launch_final_16x9_1080p60_subtitled.mp4 -map 0:v -map 1:a -c copy ../renders/final_v5/KEPT_launch_v5_16x9_1080p60_subtitled.mp4
ffmpeg -i ../renders/final_v5/raw/clean.mp4 -i ../renders/final/KEPT_launch_final_16x9_1080p60_clean.mp4 -map 0:v -map 1:a -c copy ../renders/final_v5/KEPT_launch_v5_16x9_1080p60_clean.mp4
cd .. && python3 video/scripts/vo/export_transcript.py v5                  # SRT, VTT, VO sheet (md + csv with ElevenLabs text)
~/.cache/kept/tts/bin/python video/scripts/audio/duck_stem.py v5            # stems/music_ducked_for_vo.wav for v5's lines
```

### 9.1 · The voiced v5 (ElevenLabs one-take read)

The Keeper was recorded in one ElevenLabs take (Eleven v4, all 33 lines in order; casting and prompts in
`docs/KEEPER_VOICE_GUIDE.md`). The take is laid onto the film, and the film is re-timed to it: his mouth and the
subtitles follow the real recording. Deliverables: `renders/final_v5_voiced/`.

```
~/.cache/kept/tts/bin/python video/scripts/vo/split_take.py audio/vo_elevenlabs/keeper_one_take_v4.mp3
#   → 62 phrases: Whisper words matched to the script, cuts in the real silences, each phrase re-heard alone
#     for word onsets; sighs and laughs kept as lead-ins (the mouth waits for the word)
~/.cache/kept/tts/bin/python video/scripts/vo/place_take.py audio/vo_elevenlabs/keeper_one_take_v4.split.json
#   → data/vo5.json (the film's timing), audio/vo5/S01…S33.wav, renders/final_v5/stems/keeper_vo.wav.
#     Lines start on the designed beats of data/vo5_design.json and keep the take's own pauses; a few are pinned
#     to the picture (ANCHOR, NOT_BEFORE, WINDOW in the script). Phrase levels keep 30 % of their spread.
python3 video/scripts/vo/export_transcript.py v5                         # SRT, VTT, timing sheet on the new timing
~/.cache/kept/tts/bin/python video/scripts/audio/duck_stem.py v5         # music ducked −7 dB, for editors
~/.cache/kept/tts/bin/python video/scripts/audio/mix_vo.py               # voiced master: music −10 dB under him, −14 LUFS
cd video && node scripts/render.mjs Launch5-16x9 ../renders/final_v5/raw/subs_voiced.mp4 0 16 '{"subs":true,"script":"v5"}'
node scripts/render.mjs Launch5-16x9 ../renders/final_v5/raw/clean_voiced.mp4 0 16 '{"subs":false,"script":"v5"}'
# then mux renders/final_v5/stems/master_with_vo.wav onto both (ffmpeg -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k)
```

`design_vo.py` now writes the designed beats to `data/vo5_design.json`; `data/vo5.json` is the recorded timing.
