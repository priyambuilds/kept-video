# MUSIC BRIEF: KEPT launch teaser

Status: **waiting for approval.** Once you approve, you source `audio/track.mp3` (licensed) using §5, and I fit it in phase 6.

> The three reference tracks are copyrighted. They were analysed in a scratch folder and never copied, rendered or mixed. Nothing from them (melody, sample, stem or vocal) may appear in the film.

---

## 1 · Analysis of the three references

**Method:**
- librosa in a scratch venv: tempo by comb-filtering the kick band over the drop section, cross-checked against beat-interval statistics.
- Key by chroma correlation on the harmonic component (Krumhansl profiles).
- Energy and spectral share per 2 s window across bands: sub < 60 Hz, low 60–250 Hz, mid 250 Hz–4 kHz, high > 4 kHz.
- Groove by folding the kick, bass, mid and hat energy over one beat and one bar.
- Loudness by ITU-R BS.1770 (pyloudnorm).

**Caveat:** all three files measure 3–10% faster than these genres' usual 122–128 BPM, and they're shorter than the releases. They may be radio or sped-up edits, so treat the BPM as "the edit you listen to". The "listening notes" are what the measurements show, labelled as such, not lyrics or melody transcriptions.

| | **Seratonin**: James Hype | **All Of Me**: MONOH, Jazmine Johnson | **Trndsttr (Lucian Remix)**: M. Maggie, Black Coast |
|---|---|---|---|
| Style (your words) | bass-heavy tech house | dark melodic house | vocal-chop drop |
| File | 1:56 | 2:15 | 3:00 |
| **BPM (measured)** | **138.0** | **132.0** | **130.0** |
| **Key / mode** | **F minor** (strong, r = .82) | **B♭ minor**, modally ambiguous with E♭ minor (r = .52/.50) | **D minor** (strong, r = .81) |
| **First drop** | **0:28**, after exactly 16 bars | **0:30**, after about 16 bars | **≈0:55** (first sustained sub); the heavier groove from **1:30** |
| What precedes the drop | 0:26–0:28 high-band riser (high share 14%) over a groove with **zero sub** for the whole intro | 0:26 riser (high share 16%), then **0:28 near-dropout (−26 dB)**: a breath before the hit | 0:46–0:53 breakdown with **sub and low removed** (filter sweep), then the drop |
| Structure | intro 0:00–0:28 (filtered groove, no sub) → drop 0:28–1:03 → breakdown 1:04–1:22 → drop 2 1:24–1:51 | intro with vocal and intermittent sub stabs → drop 0:30–0:56 → filtered section 0:58–1:09 (high band 0%) → breakdown 1:10–1:40 → silence 1:38–1:40 → drop 2 1:41 | long intro with **isolated sub hits every ~8 bars** (0:04, 0:12, 0:20, 0:26) → breakdown → drop 0:55 → groove 1:30–1:57 |
| **Low end** | sub 34% + low 43% of all energy (77%); in the drop sub ≈ 40%, low-mid ≈ 42% | sub 33% + low 40% (73%); in the drop **sub ≈ 47–54%**, the deepest of the three | sub 20% + low 47%; the mid-bass carries it; sub comes in hits |
| **Kick ↔ bass** | 4-on-the-floor. The bass is quiet on the kick and **swells through the beat, peaking just before the next kick**: a rolling, sidechained tech-house bass | 4-on-the-floor. The bass is **almost silent for the first third of each beat** (10–15% of its peak), then pumps: the heaviest sidechain of the three | **Not straight 4-on-the-floor** in the drop: kick energy is syncopated across the bar, a bass-house bounce with half-time feel |
| Drums and groove | straight; hats between kicks (offbeat); 4–5 onsets/s | straight; offbeat hats; mid stabs on syncopated 16ths (positions 4, 12 of 16) | broken; hats on syncopated 16ths; mid stabs on 16th positions 2 and 10 |
| Textures (what the measurements show) | mid-range stabs answering the bass on the "and"; very little top end | vocal-led intro; stabs on off-16ths; filtered (low-passed) passages | **the highest mid share (31%)**: the chops/lead carry the hook; **the darkest top (high 2%)** |
| Energy curve | flat, low intro → +7 dB step at the drop → breakdown dip → same plateau | similar step (+12 dB from the dropout to the drop) | wavy; energy comes in surges, not a plateau |
| Loudness | **−7.3 LUFS**, peak +0.5 dBFS (clipped master) | **−8.1 LUFS**, +2.1 dBFS | **−7.1 LUFS**, +2.3 dBFS |
| **Why it's dark but fun, not happy** | minor key + no top-end sparkle = dark; the rolling bass and the stab call-and-response = fun | minor + the deep pump; the dropout before the drop gives a "gasp" | minor + muffled top; the syncopated bounce and chops are playful and cocky |

### What the three share (ingredients to borrow, not melodies)
1. **Minor keys** (F, B♭, D minor) and **very little top end** (2–4% of energy above 4 kHz). That's the "dark".
2. **Sub-dominant mixes**: 70–77% of energy below 250 Hz.
3. **Kick/bass interlock**: the bass ducks on the kick and swells between kicks (sidechain pump). That's the "adrenaline".
4. **The drop is earned**: a riser, then a **dropout of ≤ 1 beat**, then the hit. The silence makes it hit harder.
5. **Hooks are short mid-range stabs or chops on off-16ths**, not long melodies. That leaves space for a voice.
6. Club-loud masters (−7 to −8 LUFS). Ours will be −14 LUFS, so we have **more dynamic range** to make the drops feel bigger than the verses.

---

## 2 · Target spec for our track

| | Spec |
|---|---|
| **Genre blend** | **Dark bass house / tech house**, with **one half-time hit** on the signature moment |
| **BPM** | **137 (target 137.14)**, acceptable range 136–138. At 137.14 BPM a bar is exactly 1.75 s, so **0:07 = bar 5**, **0:17.5 = bar 11** and **0:28 = the end of bar 16**. Both of your drop times and the cut length land exactly on bar lines (table in §4). A track at 124–128 BPM would need a +7–10% stretch (fine for an instrumental) or moving the drops to 0:07.03 / 0:17.81. |
| **Key** | **F minor** (or E/F♯ minor). Low enough for a menacing sub; F minor sits under a low male voice without clashing in the 100–200 Hz body. |
| **Low end** | Sub-heavy (F1 = 43.7 Hz) **plus saturated mid-bass harmonics at 90–300 Hz**, so the bass still reads on phone speakers that can't play sub. |
| **Groove** | 4-on-the-floor in the drops, rolling sidechained offbeat bass, offbeat open hats, clap on 2 and 4. Half-time (68.5 BPM feel) for bars 11–12 only. |
| **Hooks** | Short **wordless** stabs/chops on off-16ths. **No lyrics.** Chops only play *between* VO lines. |
| **Space for the VO** | Under VO windows the mid band (300 Hz–3 kHz) is kept light: no lead, no chops, chords filtered. Stems are strongly preferred (see sourcing). |
| **Top end** | Dark: hats rolled off, no bright supersaws, no festival leads. |
| **Avoid** | ukulele/whistle startup pop, corporate pulses, EDM big-room builds, future-bass sparkle, happy major-key chords, any vocal with words |

---

## 3 · Our own twists (what makes it KEPT's, not your playlist)

1. **The reaper's heartbeat.** The hook opens on a dry, filtered **double-thump heartbeat kick** (lub-dub) under the generic-app scene. At the drop the heartbeat *becomes* the 4-on-the-floor kick: tension → release in the same sound.
2. **Coin percussion.** In the drops, the shaker/16th-hat layer is **coin clinks**, with a **cash-drawer "ka-chunk"** on beat 4 of every second bar. In the signature moment the coins landing in friends' cards *are* the hats, pitched to F minor.
3. **The scythe riser.** The riser into drop 2 is a **reversed metallic blade "shing"** (steel ring + air), pitched up to the root. The downbeat is a sub drop + a metallic slice transient. The swing's sound design and the music's riser are the same gesture.
4. **The midnight clock.** A muted **clock tick** (woodblock/second-hand) on 8ths through the build (bars 3–4). It nods to "both photos before midnight", returns faintly under the proof scene, and **stops dead** at the CTA.
5. **The stitched hum.** The hook chop is a **closed-mouth, low male "mm-hm"**, formant-shifted down, gated and wordless. It's the sound a guy with a stitched mouth would make: on-character, and it never competes with words.
6. **The whole-mix vinyl stop.** On "from bed" the *entire track* brakes to a stop (tape-stop / record-scratch) and leaves one beat of silence for the joke.

---

## 4 · Cue sheet: 28 s hero cut (137.14 BPM: 1 beat = 0.4375 s, 1 bar = 1.75 s)

| Time | Bar.beat | Music cue | Picture / VO |
|---|---|---|---|
| **0:00.00** | 1.1 | **Instant start**: hard dark stab + filtered groove (LPF ~400 Hz), heartbeat kick. No fade-in. | Generic checklist; cursor taps "Gym ✓ Done" (cheap ding SFX) |
| 0:01.75 | 2.1 | **Whole-mix vinyl stop / record scratch** → silence for about 2 beats | "…from bed." lands in the silence |
| 0:02.63 | 2.3 | Re-entry: reversed cymbal into bar 3 | Keeper flicks the flame |
| 0:03.50–0:06.56 | 3.1–4.4 | **Tense build**: filter opening, clock-tick 8ths, snare 8ths → 16ths in bar 4, noise riser | L02; streak cracks; swats |
| 0:06.56–0:07.00 | 4.4 | **Dropout: 1 beat of silence** (the breath) | the slap |
| **0:07.00** | **5.1** | **DROP 1**: sub boom + full groove + coin hats | KEPT logo explodes; "Welcome to KEPT" |
| 0:07–0:10.5 | 5–6 | Drop groove, hum chop answers in VO gaps | Logo → Oath creation |
| 0:10.5–0:17.06 | 7.1–10.4 | **Driving groove under the features**: mid band carved; taps on 8ths; coin tick on the stake roll | L04 taps · L05 camera · L06 "Nice try" (the error buzz sits on a beat) |
| 0:17.06–0:17.50 | 10.4 | Dropout + **reversed scythe riser** | Wind-up |
| **0:17.50** | **11.1** | **DROP 2 / HALF-TIME HIT** (the biggest moment): sub drop + metallic slice + coin clinks landing on 16ths | Scythe through Alex's stake → coins to friends |
| 0:17.5–0:21.0 | 11–12 | Half-time groove, heavy and bouncy | L07, then L08 "I love this part" (music dips 2 dB for the giddy whisper) |
| 0:21.44 / 0:21.88 / 0:22.31 | 13.2 / 13.3 / 13.4 | **Three tight stabs** | Three proof chips snap in, ledger ticks |
| 0:22.75 | 14.1 | **Strip back**: sub + hum only, clock tick stops | Ledger snaps shut → cream CTA |
| 0:23–0:26.25 | 14–15 | Sparse: kick and sub pulse under the tagline | L10 word by word, L11 |
| **0:24.50** | **15.1** | **Final logo hit** (sub boom + stab), then the bed thins out | CTA lock-up lands; **held ≥ 3 s until 0:28** |
| 0:26.25–0:28.00 | 16 | **Clean tail**: sub decays, near silence | "…I'll be watching." in near-silence + tiny sting; wink on the last frame |

## 4b · Cue sheet: 15 s cut (same tempo)

| Time | Bar.beat | Music cue | Picture / VO |
|---|---|---|---|
| 0:00.00 | 1.1 | Instant stab + filtered heartbeat groove | Hook, L01 |
| 0:01.75 | 2.1 | Vinyl stop, silence | "from bed." |
| 0:02.63–0:03.06 | 2.3–2.4 | Short riser, 1-beat dropout at 3.06 | Slap |
| **0:03.50** | **3.1** | **DROP 1** | Logo + "So I made it cost something." |
| 0:05.25–0:08.31 | 4.1–5.4 | Driving groove, carved for VO | Proof + "Nice try." |
| 0:08.31 | 5.4 | Dropout + scythe riser | Wind-up |
| **0:08.75** | **6.1** | **DROP 2, half-time** | Signature moment, L07 + L08 |
| **0:11.81** | 7.4 | Strip back + final hit at 0:12.25 (bar 8) | CTA lands; **held from 0:11.8 to 0:15.0 (3.2 s)** |
| 0:14.00–0:15.00 | 9 | Tail | |

The 15 s cut is an **edit of the same track** (bars 1–2, a jump to the bar-4 dropout, bars 5–6, a jump to bar 10.4, bars 11–12, then the ending). That's why stems or a track with clear 1-bar sections matter.

---

## 5 · Sourcing kit

### 5.1 Stock libraries: search terms and filters
**Must-haves:** **stems available** (Epidemic and Artlist both offer them; they're needed for VO ducking and the 15 s edit), instrumental, an early or editable drop, a minor key.

| Library | Search phrases | Filters |
|---|---|---|
| **Epidemic Sound** | "dark bass house", "tech house dark", "sneaky bass house", "villain house", "heist electronic", "bass house half time", "minimal bass drop", "dark groove house instrumental" | Genre: House / Tech House / Bass House · Mood: Dark, Mysterious, Sneaking, Dramatic · BPM 124–140 · Vocals: none · **Stems ✓** · Energy: high |
| **Artlist** | "dark tech house", "bass house", "underground house", "menacing electronic groove", "dark club" | Genre: Electronic › House · Mood: Dark, Tense, Confident · Instrumental · BPM 125–140 · "Stems" tab |
| **Musicbed** | "dark driving electronic", "bass house", "swagger electronic", "dark minimal" | Mood: Dark, Driving, Confident · Instrumental · Tempo: Fast · Genre: Electronic/House |

**Reject if:** major-key chords, bright supersaw leads, ukulele/whistles/claps-and-snaps "startup" vibe, big-room snare rolls, lyrics, first drop later than 0:30 (unless stems let us cut to it).

### 5.2 AI-music prompt (for a commercial-licence plan such as Suno Pro/Premier or Udio paid; no artist names)

> Dark bass house / tech house instrumental, 137 BPM, F minor, 4/4, 32 seconds plus an extended 60-second version.
> Sound: punchy dry kick, sub-heavy bass with saturated mid-bass growl that cuts through phone speakers, rolling sidechain-pumped offbeat bassline, offbeat closed hats, tight clap on 2 and 4, muffled dark top end. Hook: short wordless closed-mouth low male "mm-hm" vocal chops, gated and pitched, plus one dark minor stab. Percussion layer of metallic coin clinks and a cash-register drawer hit. Ticking clock percussion in the build.
> Structure: starts instantly with a filtered groove and a heartbeat-style double kick (bars 1–2); a whole-track tape stop and one beat of silence near the start of bar 2; tense rising build with clock ticks and a noise riser (bars 3–4) ending in one beat of total silence; DROP at bar 5 with the full groove (bars 5–10), sparse in the midrange to leave room for a voiceover; one beat of silence and a reversed metallic blade swish riser; a heavier HALF-TIME DROP at bar 11 (bars 11–12) with massive sub and slicing metallic hits; three hard stabs in bar 13; stripped back to sub and hum (bar 14); final impact at bar 15 and a short clean tail.
> Mood: menacing but playful, cocky, sly, adrenaline, nightclub-after-hours. No lyrics, no singing, no bright leads, no uplifting chords, no orchestral hits, no festival build-ups.

*AI generators won't hit a bar map exactly. Generate 6–10 takes, pick the best drop and groove, and I'll edit it to the grid. Check that the plan's licence covers commercial advertising.*

### 5.3 Producer brief (one paragraph to hand a freelancer)

> We need a ~30-second instrumental for a 28 s (and 15 s) app launch teaser hosted by a deadpan grim-reaper mascot who collects money from people who break their habits. The sound is **dark bass house / tech house at 137 BPM in F minor**: sub-heavy, with a saturated mid-bass that reads on phones, a sidechain-pumped rolling bass, offbeat hats, muffled tops, and no lyrics. The structure is fixed to picture at exactly 1.75 s per bar: instant start (no fade); a whole-mix tape-stop with one beat of silence at bar 2 for a joke; a clock-ticking build (bars 3–4) ending in one beat of silence; **drop 1 at bar 5 (0:07)**; a driving groove with an empty midrange for voiceover (bars 5–10); a reversed metallic scythe-swish riser into a **half-time drop 2 at bar 11 (0:17.5)**, the biggest moment; three stabs in bar 13; strip back at bar 14; final hit at bar 15; clean tail to 0:28. Signature textures we'd love: a heartbeat kick that becomes the 4-on-the-floor kick, coin-clink percussion with a cash-drawer hit, and a low closed-mouth wordless "mm-hm" chop as the hook. Please deliver the 28 s cue, a 15 s edit (cue sheet attached), a 60 s extended version, and **stems** (kick, bass/sub, drums/perc, chops, FX/risers, music bed) as 48 kHz/24-bit WAV, with a commercial licence (buyout or perpetual, worldwide, online ads and app stores).

---

## 6 · Mix and master targets (phase 6)
- VO > signature SFX > music. Duck the music **−8 to −12 dB** under every line (attack 10 ms, release 250–400 ms, from a sidechain on the VO).
- SFX sit 2–4 dB under the VO.
- Master: **−14 LUFS integrated, −1 dBTP**, AAC 320 kbps.
- **No scratch music in any final.** Until `track.mp3` arrives, the animatic uses a click/metronome bed at 137.14 BPM made by me (synthesised, not derived from any reference).
