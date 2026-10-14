# The Keeper's voice: ElevenLabs guide (v5 script)

For the v5 cut in `renders/final_v5/` (1:53, 16:9, 60 fps). The picture and pacing are the same as the original
final. The Keeper's lines are rewritten, his lip-sync and subtitles re-timed to them, and the film re-rendered.

This guide covers:
- what changed in the script and why;
- who the Keeper sounds like;
- how to build that voice in ElevenLabs;
- how to perform all 33 lines;
- how to land every phrase on the frames where his mouth moves.

**Two rules before anything else**
1. **Ignore the robot read.** `renders/final/stems/guide_vo_scratch.wav` and `audio/vo/F*.wav` are an old local
   placeholder for the *old* script. They mispronounce the brand and the names. Don't use them as a reference for
   tone, pitch or pace.
2. **The words are locked.** They're burned into the subtitled master, and the end card types the tagline word by
   word. Say exactly what's written. Numbers are spoken as words.

---

> **Status:** the one-take ElevenLabs read is in the film (`renders/final_v5_voiced/`). The film was re-timed to it,
> so the mouth and subtitles follow the recording (build: `docs/LAUNCH_FILM_V4.md` §9.1). To re-record, generate a
> new one-take read and run the same steps. The per-line timings below are the designed beats the take was laid on.

## 1 · What changed in the script, and why

The old script was a narrated feature tour: the Keeper explained screens ("Pick a habit. Put money on it.") but never
became anyone, and the gaps between lines were dead air. v5 keeps the picture and every pacing beat, and gives him:

| | What it does | Lines |
|---|---|---|
| **A name and a job** | He introduces himself mid-wave, then works the door like a bouncer: checks your ID, puts you on the list. | "I'm the Keeper." · "Seeker? … You're on the list." |
| **A bet against you (the arc)** | He reads your habit, doubts you and sets odds. That turns "Put money on it." into a dare. On Day 7 he's genuinely impressed; over the wall of screens he admits it. | "Every day? … I give it three days." → "Put money on it." → "Day one. … Not bad." → "Seven for seven." → "I gave you three days. … Don't let it go to your head." |
| **Warmth with the viewer** | He's flattered by your skull avatar, seals your oath, and ends by pointing at you. | "Hey, that's my look." · "No take-backs." · "I'll be watching." |
| **A cast of friends** | Each friend gets a trait: Riya reads the rules, Arjun is always late, Dev is in before you ask. Arjun becomes the running gag. | "Arjun. … Finally." · "Dev? Already in." · "Day two. … Eight minutes left." → "Arjun's still on the couch." |
| **His one flaw** | He loves payday, so a pass is bad news. "I love this part." gets a matching sulk. | "Approved. … Shame." |

**What I didn't touch:**
- **Locked:** the full-screen close-ups "Nice try." (0:49.98) and "Honestly? … I love this part." (1:07.19), and the
  typed tagline "Keep your word. Or pay your friends." (1:42.46). They're the same words on the same frames as before.
- **Kept word for word:** the lines that carry the product and already worked (the hook, "Bring your friends.", the
  rules, "Miss a day…", Bounties, the kept rate, the sign-off). Only their direction is new.
- **Left silent on purpose:** the dive into the app (0:05), the three ticks before midnight (1:02), and the music's
  final fade.

---

## 2 · What the film asks of the voice

| Finding | What it means for the voice |
|---|---|
| **33 lines, 62 phrases, 184 words in 1:53.** He speaks for about 73 s of it, at **2.5 words/s** (3.3 syllables/s). | Unhurried. The voice has to stay interesting at that pace: texture, a smile, timing. |
| **The mouth only moves inside each phrase's slot.** The pauses between phrases are where the jokes land. | Leave a clear pause wherever the script has `...`. The fit script (§5) re-spaces phrases to the exact frame, so ElevenLabs' own pause lengths don't matter, as long as the pauses are there. |
| **No room to run long:** S01, S05, S12, S15, S17, S19, S23 and S29 have 0.25–0.45 s before the next line. **"Put money on it."** has to fit in 1.01 s. | Watch these for length. |
| **Full-screen close-ups:** S16 "Nice try." and S22 "Honestly? … I love this part." show the lip-sync most. | Take extra care with these two, for timing and for performance. |
| **The music is dark bass house, F minor, 123 BPM.** Under the lines, its energy is mostly below 250 Hz and **13–17 dB lighter from 500 Hz up**. | A booming, chesty voice sits in the bass and gets buried. A **deep voice whose weight comes from resonance, not boom, with crisp consonants** cuts through, so the music can stay big. |
| **The music builds and drops:** big at 0:06 (S03), 0:31–0:45 (S10–S14), 1:02 (S21–S22), 1:24 (S27) and 1:42 (S31–S32); **near silence at 0:55–1:02 (S18–S20), 1:34–1:38 (S29) and the last 2 s (S33).** | Project a little over the drops. Get close and quiet in the breakdowns, where the voice is fully exposed. |
| **On screen he's a chibi reaper:** big round skull, stitched grin, lime visor, sunglasses on his head, ace of spades in his hood, floating cartoon gloves. He waves, winks, dances in shades, drinks coffee and flips coins. | Give him **a big, charismatic, grown-up voice**. The contrast with the small design is the joke. Funny, never scary: no trailer boom, no horror growl. |

---

## 3 · Casting: who he is

**The Keeper is a charismatic, sardonic collector of broken promises who loves his job a little too much.** It's a
character voice with **weight**: deep, resonant and grown-up. But he's the **funniest guy in the room, not the
wisest**. Think of the witty antihero of an animated comedy for adults: confident, dry and quick, with warmth
underneath.

| | |
|---|---|
| **Type** | A charismatic character performance: weight plus wit. Not a wise old sage, not a plain narrator, not a sneaky little sidekick. |
| **Age** | Sounds in his early 40s: grown-up and confident, not elderly. |
| **Pitch** | Deep and resonant: low baritone, a little gravel. |
| **Texture** | Warm and slightly gravelly, with a grin you can hear. |
| **Pace** | Unhurried but lively. He knows exactly when to pause for the punchline, and never sounds sleepy. |
| **Attitude** | Dry sarcasm, playful swagger, sudden delight when he gets to collect, warmth underneath. |
| **Never** | Old, wise or sage-like; sneaky, sing-song or giggly; a horror villain; a movie-trailer boom; a flat narrator. |

**Why this balance:**
- **Weight makes the jokes land.** "Nice try." from a deep, confident voice is funnier than from a goofy one.
- **Wit makes him likeable.** A voice that only sounds wise lectures you; a witty one is playing with you.
- **The contrast is the gag.** A small chibi skull with a big, charismatic voice is a classic comic pairing.
- **People trust it.** It's a product that holds your money, and a grown-up voice says the stakes are real.
- **It works in the mix**, as long as the weight comes from resonance rather than boom. Keep the consonants crisp
  and the low end clean (§6).

---

## 4 · Step 1: Design the voice (ElevenLabs → Voices → Voice Design)

Describe a **charismatic, funny grown-up character**.

| Avoid | Because |
|---|---|
| "studio quality" | ElevenLabs says quality words make specific character voices less accurate. |
| small, cheeky, mischievous, sing-song, giggle | They made a sneaky little sidekick. |
| ancient, wise, refined, otherworldly, 50s | They made an old sage. |

Two takes on him. Try **A** first. Generate each 2–3 times (three voices per run).

**A · The sardonic collector (recommended)**
```
A grim reaper character voice for an animated comedy: a charismatic, sardonic collector of broken promises who genuinely loves his job. Male, sounds in his early 40s, with a relaxed modern British accent.
Voice: deep and resonant, a low baritone with a little gravel and a grin you can hear. Confident and witty: dry sarcasm, playful swagger and perfect comic timing, unhurried but never sleepy, with flashes of real delight when he gets to collect. Weight in every word, but he's the funniest guy in the room, not the wisest.
A charismatic, mature character performance. Not an old wise sage, not a narrator, not sneaky or sing-song, not a horror villain, not a movie-trailer voice.
```

**B · The smooth dealer (American)**
```
A grim reaper character voice for an animated comedy: a smooth, sardonic dealer of broken promises who loves payday a little too much. Male, sounds in his early 40s, with a relaxed American accent.
Voice: deep and slightly gravelly, with a grin you can hear; confident, quick-witted and dry, playful swagger, perfect comic timing, warm underneath. Every word has weight, but he's here to have fun.
A charismatic, mature character performance. Not an old wise sage, not a narrator, not sneaky or sing-song, not a horror villain, not a movie-trailer voice.
```

**Text to preview** (use it with both; it has the weight and the jokes):
```
[dry] Oh, you're starting the gym on Monday? [beat] Bold. [amused] Everybody starts on Monday. [confident] Here's how it works. You swear an oath, you put money on it, and if you miss a day... [with a grin] your friends get paid. [a low, delighted laugh] Honestly? I love that part. [completely deadpan] Nice try.
```

**Settings:** Guidance scale **about 40–45 %**. To nudge the result, edit the prompt:

| If it sounds… | Change |
|---|---|
| Too old or wise | Make the age "late 30s", and move "funniest guy in the room" earlier. |
| Too goofy or light | Make the age "mid 40s", and add "commanding" next to "confident". |
| Like a plain human narrator | Raise guidance toward 55 %. |
| Crunchy or glitchy | Lower guidance. |

**Keep a voice only if:**
- [ ] It has weight: deep, resonant, grown-up and confident.
- [ ] It's funny. "Bold." and "Everybody starts on Monday." get a smile, and "I love that part." has real delight.
- [ ] "Nice try." is bone-dry.
- [ ] It's neither an old sage nor a sneaky sidekick: a charismatic adult character.
- [ ] It's clear on a **phone speaker** over `renders/final_v5/stems/music_ducked_for_vo.wav` at about 1:03.

Save it as **"The Keeper (KEPT)"**.

**Faster alternative:** ElevenLabs' **Voice Library** has thousands of community voices. Search "sarcastic",
"charismatic villain", "smooth gravelly", "witty narrator" or "deep British". Paste the preview text above to audition
each one. Check the voice's usage terms before you rely on it.

---

## 5 · Step 2: Generate the lines (ElevenLabs → Text to Speech)

**Recommended: generate the whole script in one take.** Separate generations drift in delivery, so the lines sound
recorded on different days. One take keeps one continuous performance.

1. Paste all of `renders/final_v5/KEPT_launch_v5_ElevenLabs_one_take.txt` (2,003 characters, the 33 lines in film
   order, a blank line between them) into Text to Speech.
2. Generate 2–3 full takes.
3. Download them as WAV and send them over.

Each take gets split into its 62 phrases by matching the words (Whisper word timings, so even tight pauses cut
cleanly). The best take, or the best lines across takes, is laid into the film, and the film is re-rendered so the
Keeper's mouth and subtitles follow the real recording.

The per-line method below still works if you only need to redo a line or two.


**Model:** **Eleven v4**. It handles emotion and audio tags best, but it has no Speed slider. If one line keeps
landing too long or short, regenerate just that line in **Eleven v3** and use its Speed slider (0.9–1.1).

**Settings:**
- **Stability:** about 40 %: controlled enough to keep the weight, loose enough for the jokes. Go lower on the big moments (S21, S22) if they sound flat.
- **Similarity:** high (about 75–85 %), to keep the designed voice.
- Keep the same settings for all 33 lines, so he sounds like one person.

**How to work**
- **One generation per line** (S01 … S33), using the text block under each line in §7. All 33 are also in the
  `elevenlabs_text` column of `renders/final_v5/KEPT_launch_v5_VO_script.csv`. Make 3–4 takes of each and pick the
  **performance** first; the fit script handles timing within ±10 %.
- **Tags** (`[deadpan]`, `[dry, knowing]` …) are direction, not words. If a take reads a tag aloud, or adds a laugh or
  sigh that eats time, delete that tag and regenerate. Prefer tags that colour the words; avoid ones that add sounds.
- **`...` marks a pause between phrases.** Any clear beat works, because the script re-spaces phrases to the frame.
  Don't let phrases run together.
- **Very short lines** (S07, S09, S13, S16, S33) can come out abrupt or inconsistent. Generate 5–6 takes of these.
- **Download** WAV/PCM if your plan allows (MP3 at 192 kbps is fine otherwise). Name the files exactly `S01.mp3` …
  `S33.mp3` (or `.wav`) and put them in **`audio/vo_elevenlabs/`**. If you generate a line's phrases separately,
  name them `S05_1`, `S05_2` and so on.

**Pronunciation**

| Word | Say | If it's wrong |
|---|---|---|
| Kept | like the word *kept* /kɛpt/. Always type **Kept**, never "KEPT", or it may be spelled out letter by letter. | — |
| Keeper | KEE-per | — |
| Seeker | SEE-ker (the Solana phone) | — |
| Arjun | AR-jun (Hindi अर्जुन), short and natural | Respell as `Arr-jun` or `Urjun`, or add an alias rule in a pronunciation dictionary. |
| Riya · Dev | REE-ya · DAYV (as in "Dev Patel") | Dev is never said "dev" as in developer. |
| 4,000 · 3 to 1 · 7 for 7 · October 16 | four thousand · three to one · seven for seven · October sixteenth | Already written out in the text blocks. |

---

## 6 · Step 3: Land it on the picture

The **In** time is the frame his mouth starts moving; the length is how long it moves. You don't need to hit either
by hand:

```bash
~/.cache/kept/tts/bin/python video/scripts/vo/fit_takes.py --preview
```

For each take, the script:
- splits it into its phrases at its pauses (it ignores breaths);
- puts each phrase's first sound on its In frame;
- time-stretches any phrase that's within **±10 %** of its slot, keeping the pitch.

It writes these files to `renders/final_v5/elevenlabs/`:

| File | What |
|---|---|
| `fit_report.md` | Every phrase: take length vs slot, and what it did. **REDO** marks anything more than 10 % off, a missing take, or a take with no pause between phrases. |
| `keeper_vo_placed.wav` | The VO alone, full film length, 48 kHz, at −18 LUFS. Drop it into your editor at 00:00:00:00. |
| `KEPT_launch_v5_16x9_1080p60_subtitled_VO.mp4` | The subtitled v5 master with the VO mixed in: music ducked for VO + SFX + VO, +2.8 dB into a −1 dBTP limiter. |

Regenerate whatever it flags and run it again.
- **Too long:** remove slowing tags like `[slow and clear]`, or regenerate. In v3, use Speed 1.05–1.1.
- **Too short:** add a slowing tag or `...` inside the phrase. In v3, use Speed 0.9–0.95.

**If you'd rather do it in your editor:** place each phrase's first consonant on its In timecode (§7, or
`renders/final_v5/KEPT_launch_v5_VO_script.csv` for every phrase), then stretch it to its length. Mix with
`renders/final_v5/stems/music_ducked_for_vo.wav` (already −7 dB under every v5 line) and `stems/sfx.wav`.

**Mix notes**
- High-pass at about 80 Hz, and keep 200–300 Hz clean (the bass lives there).
- A gentle lift at 2–4 kHz. The music is light in that range, so that's where he cuts through.
- Light compression, a de-esser, **no reverb**. He's in your ear, not in a room.

**Exact, word-level lip-sync (optional).** The new phrases' mouth movements were timed by syllable count, and the fit
script matches each phrase's start and end. If you want his mouth to follow your takes word by word:
1. Back up `audio/vo/`, then copy your takes there as `S01…S33`.
2. Run `VO_SCRIPT=script5.json VO_MAP=vo5.json ~/.cache/kept/tts/bin/python video/scripts/vo/align_vo.py`.
3. In `video/`, run `npm run sync`, then
   `node scripts/render.mjs Launch5-16x9 ../renders/final_v5/raw/subs.mp4 0 16 '{"subs":true,"script":"v5"}'`.

Each line keeps its place in the film; only the mouth movement inside it follows your take.

---

## 7 · The 33 lines

The energy level (▮ = 1 to ▮▮▮▮▮ = 5) is the arc to follow. Each line is tagged by where it came from:
- **NEW:** written for v5;
- **v4 words:** same words and frames as before, new direction;
- **LOCKED:** a close-up or the typed tagline; don't change anything.

Times are `m:ss.ss` from the first frame, with the 60 fps timecode in brackets.

### Act 1 · The hook, the welcome, sign-up (0:00–0:17): he opens the door

**S01 · v4 words · In 0:00.50 (00:00:00:30) · "Every habit app lets you quit." 2.28 s · ▮▮ · tight: 0.42 s before the next line**
- **On screen:** A 9:41 lock screen filling up with KEPT nudges. He rises behind the phone and leans on it, bored. The music is a quiet, filtered intro.
- **Play it:** The first thing anyone hears. Relaxed authority, as if he's been waiting for you; a flick of disdain on "quit". Not sleepy.
```
[deadpan] Every habit app lets you quit.
```

**S02 · v4 words · In 0:03.20 (00:00:03:12) · "This one" 0.76 s · "bills you." 1.02 s · ▮▮**
- **On screen:** He pokes the newest nudge, and drop 1 dives into the app.
- **Play it:** "This one" turns toward you, unhurried. Beat. "bills you." lands with quiet satisfaction, savouring "bills". Underplay it.
```
This one... [dry, quietly pleased] bills you.
```

**S03 · NEW · In 0:06.60 (00:00:06:36) · "Welcome to Kept." 1.45 s · "I'm the Keeper." 1.00 s · ▮▮▮▮**
- **On screen:** Drop 1: the KEPT splash. He pops up beside the phone and is waving through "I'm the Keeper."
- **Play it:** A grand welcome over the drop, and he's clearly enjoying himself. Then he introduces himself mid-wave, proud of the title.
```
[grandly, enjoying himself] Welcome to Kept. ... [proudly] I'm the Keeper.
```

**S04 · NEW · In 0:10.06 (00:00:10:03) · "No passwords." 1.26 s · "Seeker?" 0.55 s · "You're on the list." 1.08 s · ▮▮**
- **On screen:** Connect your wallet → sign → "Seeker verified." He points at the wallet, then puts his shades on.
- **Play it:** A bouncer at the door. "No passwords." casual. "Seeker?" checking your ID. "You're on the list." waving you through, a small nod.
```
[casual] No passwords. ... [checking your ID] Seeker? ... [waving you in] You're on the list.
```

**S05 · NEW · In 0:14.36 (00:00:14:21) · "Pick a look." 0.85 s · "Hey, that's my look." 1.15 s · ▮▮▮ · tight: 0.36 s before the next line**
- **On screen:** The avatar shuffles and lands on a skull. The app's own Keeper note on screen reads "Skull? Hey, that's my look."
- **Play it:** "Pick a look." is a light invitation. You land on a skull: he's dryly amused, a little flattered.
```
Pick a look. ... ... [dryly amused] Hey, that's my look.
```

### Act 2 · The Oath (0:17–0:31): the bet against you

**S06 · NEW · In 0:17.71 (00:00:17:43) · "Pick a habit." 1.00 s · "Every day?" 0.95 s · "I give it three days." 1.40 s · ▮▮▮**
- **On screen:** You type "Every day I will lift for 20 minutes" and he pops up beside the phone. "I give it three days." lands on the How long? screen (3 · 7 · 14), just before you pick 7.
- **Play it:** "Pick a habit." crisp. He reads what you typed: "Every day?" one eyebrow up. "I give it three days." is a seasoned bookie setting odds against you: dry, friendly, completely sure of himself. (The "3 days" option is on screen as he says it; you pick 7.)
```
Pick a habit. ... [skeptical] Every day? ... [dry, knowing] I give it three days.
```

**S07 · v4 words · In 0:22.56 (00:00:22:34) · "Put money on it." 1.01 s · ▮▮▮**
- **On screen:** The stake chips (500 · 1,000 · 2,500), with a dutch-angle push-in. Coming straight after his bet, it plays as a dare.
- **Play it:** Now it's a dare, straight after his bet: quick and delighted, leaning on "money".
```
[daring you] Put money on it.
```

**S08 · v4 words · In 0:25.41 (00:00:25:25) · "Then sign it." 1.00 s · "Like a contract." 1.26 s · ▮▮**
- **On screen:** The rules card lifts out of the phone and lands back in its slot.
- **Play it:** "Then sign it." matter-of-fact. "Like a contract." mock-solemn and lawyerly, every syllable placed.
```
Then sign it. ... [mock-solemn] Like a contract.
```

**S09 · NEW · In 0:29.62 (00:00:29:37) · "No take-backs." 0.95 s · ▮▮▮**
- **On screen:** His SEALED stamp slams onto the phone: "Sworn. 1,000 SKR on the table."
- **Play it:** Right after his seal slams down: satisfied and final, playground-smug.
```
[satisfied] No take-backs.
```

### Act 3 · Bring your friends (0:31–0:45): the cast, chorus

**S10 · v4 words · In 0:31.57 (00:00:31:34) · "Now." 0.66 s · "Bring your friends." 1.25 s · ▮▮▮▮**
- **On screen:** Your invite QR fills the frame as the chorus kicks in. He's off screen.
- **Play it:** "Now." leans in, lower and closer. "Bring your friends." opens up warmly: this is the good part.
```
[leaning in] Now. ... [warmly] Bring your friends.
```

**S11 · v4 words · In 0:34.62 (00:00:34:37) · "Same stake." 1.01 s · "Same rules." 1.02 s · ▮▮▮**
- **On screen:** Four phones in a row: You, Riya, Arjun, Dev. Riya reads the rules and joins.
- **Play it:** Two equal beats, like dealing cards. The second a touch lower.
```
Same stake. ... Same rules.
```

**S12 · NEW · In 0:38.45 (00:00:38:27) · "Arjun." 0.55 s · "Finally." 0.78 s · ▮▮ · tight: 0.25 s before the next line**
- **On screen:** A whip to Arjun's phone: he hasn't even opened the invite. The Keeper peeks in from the corner, eyebrow up, as Arjun finally joins.
- **Play it:** Fond exasperation as Arjun finally opens the invite. "Arjun." has a sigh in it. "Finally." is dry: he's been waiting all evening. Teasing, never mean.
```
[fondly exasperated] Arjun. ... [dry] Finally.
```

**S13 · NEW · In 0:40.25 (00:00:40:15) · "Dev? Already in." 1.20 s · ▮▮▮**
- **On screen:** A whip to Dev's phone: already in.
- **Play it:** Quick, impressed aside: Dev was in before anyone asked.
```
[impressed] Dev? Already in.
```

**S14 · v4 words · In 0:42.37 (00:00:42:22) · "Four thousand on the table." 1.95 s · ▮▮▮**
- **On screen:** Avatars fly into your seats, the pot climbs to 4,000 SKR, and the phones settle like cards on a table.
- **Play it:** Low and slow, savouring the pot.
```
[low, savouring it] Four thousand on the table.
```

### Act 4 · Day 1 (0:45–0:55): the rules, the catchphrase, a grudging nod

**S15 · v4 words · In 0:45.28 (00:00:45:17) · "Two photos a day." 1.36 s · "Random gesture." 1.27 s · "I check every one." 1.33 s · ▮▮▮ · tight: 0.40 s before the next line**
- **On screen:** Monday's 6:58 lock screen → Today → camera: a dumbbell and a peace sign. He's sipping his coffee. The first photo is about to fail.
- **Play it:** A brisk list in three beats. Then "I check every one." quieter and closer: a smiling threat.
```
Two photos a day. ... Random gesture. ... [quietly, a smiling threat] I check every one.
```

**S16 · LOCKED · In 0:49.98 (00:00:49:59) · "Nice try." 1.16 s · ▮ · ⚠ FULL-SCREEN CLOSE-UP**
- **On screen:** His face fills the frame: dead stare, magnifying glass, one slow blink.
- **Play it:** LOCKED close-up. The catchphrase, flat as a table: two words a hair apart, falling. No smile.
```
[completely deadpan] Nice try.
```

**S17 · NEW · In 0:53.25 (00:00:53:15) · "Day one." 0.62 s · "Not bad." 0.60 s · ▮▮ · tight: 0.43 s before the next line**
- **On screen:** The retry passes: "Day 1 kept." Riya's, Dev's and Arjun's days land beside the phone. He gives a thumbs up.
- **Play it:** Thumbs up, but grudging: he didn't expect this. "Not bad." is the most praise you'll get from him.
```
[grudgingly] Day one. ... Not bad.
```

### Act 5 · Arjun's night (0:55–1:02): the music drops out; get intimate

**S18 · NEW · In 0:55.05 (00:00:55:03) · "Day two." 0.62 s · "Eight minutes left." 1.15 s · ▮**
- **On screen:** Tuesday night. Your phone reads Day 2/7, 0h 08m left: everyone has kept except Arjun (pending). You nudge him. The music drops out.
- **Play it:** The music drops out. Quiet and close, building suspense, like a late-night radio host. (Your phone reads 0h 08m left.)
```
[quietly] Day two. ... [hushed, suspenseful] Eight minutes left.
```

**S19 · v4 words · In 0:57.83 (00:00:57:50) · "Arjun's still on the couch." 1.90 s · ▮▮ · tight: 0.40 s before the next line**
- **On screen:** A whip to Arjun's lock screen at 23:59, nudges piling up. The Keeper is beside it, bored.
- **Play it:** Gossip out of the side of his mouth. Voiced, not whispered.
```
[gossiping, under his breath] Arjun's still on the couch.
```

**S20 · v4 words · In 1:00.13 (00:01:00:08) · "Three to one he misses." 1.67 s · ▮▮**
- **On screen:** He flips a coin; the scythe comes out. Then three ticks of silence to midnight. Leave them empty.
- **Play it:** A veteran bookie quoting odds: dry and certain. Then leave the silence for the countdown.
```
[dry, like a bookie] Three to one he misses.
```

### Act 6 · Midnight (1:02–1:10): drop 2, payday

**S21 · v4 words · In 1:03.34 (00:01:03:20) · "Miss a day," 1.03 s · "and your friends split your stake." 1.89 s · ▮▮▮▮**
- **On screen:** Midnight, drop 2: all four phones take the hit. The scythe cuts across Arjun's phone, and a red −143 bursts into coins: +43 each.
- **Play it:** "Miss a day..." slow and ominous, then the payoff quicker and satisfied. Project over the drop.
```
[ominous] Miss a day... [satisfied] and your friends split your stake.
```

**S22 · LOCKED · In 1:07.19 (00:01:07:11) · "Honestly?" 0.92 s · "I love this part." 1.48 s · ▮▮▮▮▮ · ⚠ FULL-SCREEN CLOSE-UP**
- **On screen:** A smash-cut to him full-screen: shades on, gloves up, dancing with his money sack.
- **Play it:** LOCKED close-up. The mask slips: "Honestly?" a low confession. Then "I love this part." is deep, genuine delight, a low laugh riding on the words. Big, but never squeaky.
```
[lowering his voice] Honestly? ... [a low, delighted laugh in his voice] I love this part.
```

### Act 7 · Review and Day 7 (1:10–1:24): the sulk and the payoff

**S23 · v4 words · In 1:10.64 (00:01:10:38) · "Blurry photo?" 1.18 s · "Your friends decide." 1.54 s · ▮▮▮ · tight: 0.44 s before the next line**
- **On screen:** "Dev wants your vote": a blurry photo. The Keeper is huge and out of focus in the foreground, holding his lens.
- **Play it:** "Blurry photo?" mock-curious. "Your friends decide." a shrug, hands off.
```
[mock-curious] Blurry photo? ... [shrugging] Your friends decide.
```

**S24 · NEW · In 1:14.05 (00:01:14:03) · "Approved." 0.80 s · "Shame." 0.60 s · ▮▮**
- **On screen:** "Day 3 counts as kept." He snaps into focus: smug, then a thumbs up.
- **Play it:** He reads the verdict, then can't hide it: no payday this time. "Shame." is a tiny, dry sulk with a smile in it.
```
[reading the verdict] Approved. ... [dry, mock-disappointed] Shame.
```

**S25 · v4 words · In 1:16.69 (00:01:16:42) · "Seven for seven." 1.47 s · "Collect." 0.88 s · ▮▮▮**
- **On screen:** Sunday, Day 7: "Iron Week, kept." 1,107 counts up, and you press Claim right on "Collect."
- **Play it:** The payoff of his bet: genuinely impressed, a little surprised. Then "Collect." cool and clipped.
```
[genuinely impressed] Seven for seven. ... [cool] Collect.
```

**S26 · v4 words · In 1:20.50 (00:01:20:30) · "Arjun?" 0.85 s · "He'll be back." 1.05 s · ▮▮**
- **On screen:** A whip to Arjun's phone: "Iron Week is over." 857, in red.
- **Play it:** "Arjun?" a glance. "He'll be back." knowing and teasing: he's sure Arjun returns (and pays again).
```
Arjun? ... [knowing smile] He'll be back.
```

### Act 8 · Bounties and your record (1:24–1:38)

**S27 · v4 words · In 1:24.20 (00:01:24:12) · "Want a bigger table?" 1.44 s · "Bounties." 0.90 s · "Free to join." 1.18 s · "Miss once, you're out." 1.34 s · ▮▮▮▮**
- **On screen:** The Bounties feed → Northbound Run Club → a crowd of strangers. He mows them down with his scythe.
- **Play it:** A hustler's pitch picking up speed: tempting question, proud reveal, light throwaway, then a door shutting.
```
[tempting] Want a bigger table? ... [proud] Bounties. ... [quick, light] Free to join. ... [flat] Miss once, you're out.
```

**S28 · v4 words · In 1:30.50 (00:01:30:30) · "Last ones standing split the pool." 2.19 s · ▮▮▮**
- **On screen:** "27 survived. You're one of them." +4,444.
- **Play it:** Even and satisfied, a croupier pushing the chips across.
```
[matter-of-fact] Last ones standing split the pool.
```

**S29 · v4 words · In 1:34.00 (00:01:34:00) · "Your kept rate is public." 1.64 s · "Make it worth reading." 1.61 s · ▮▮ · tight: 0.39 s before the next line**
- **On screen:** Your profile: the 91 % kept-rate ring lifts out of the phone, and he reads from his ledger. The music drops.
- **Play it:** Closer and quieter (the music drops). Plain fact, then a dare with a smile: he wants you to win.
```
[plainly] Your kept rate is public. ... [a friendly dare] Make it worth reading.
```

### Act 9 · The wall and the end card (1:38–1:53): the admission, the tagline, the sign-off

**S30 · NEW · In 1:37.90 (00:01:37:54) · "I gave you three days." 1.55 s · "Don't let it go to your head." 1.75 s · ▮▮**
- **On screen:** The camera pulls back into a drifting wall of real KEPT screens. He's off screen.
- **Play it:** His arc closes over the wall of screens. Softer and closer: he admits he was wrong about you. Then the grin comes straight back for the punchline.
```
[softly, admitting it] I gave you three days. ... [the grin comes back] Don't let it go to your head.
```

**S31 · LOCKED · In 1:42.46 (00:01:42:28) · "Keep your word." 1.08 s · "Or pay your friends." 1.39 s · ▮▮▮ · typed on screen as he speaks**
- **On screen:** The end card: the lockup, then the tagline typed word by word on his voice.
- **Play it:** LOCKED: the end card types the tagline word by word on his voice. Slow, clean, weighty; the dry edge comes back on "Or pay your friends."
```
[slow and clear] Keep your word. ... [dry, with weight] Or pay your friends.
```

**S32 · v4 words · In 1:46.66 (00:01:46:40) · "Kept." 0.61 s · "On Seeker." 1.00 s · "October sixteenth." 1.49 s · ▮▮▮▮**
- **On screen:** He presses Get on the store card and it turns into "Oct 16". The plate reads Seeker dApp Store · October 16 · kept.app.
- **Play it:** A confident, warm sign-off. "Kept." short and crisp. "On Seeker." light. "October sixteenth." with a smile. Finish down.
```
[confident] Kept. ... On Seeker. ... [warm, with a smile] October sixteenth.
```

**S33 · NEW · In 1:50.85 (00:01:50:51) · "I'll be watching." 1.10 s · ▮▮**
- **On screen:** He points at you, the sting hits on "watching", then the wink. The music fades out.
- **Play it:** The last word, low and close as he points at you: half threat, half joke, all grin. The wink follows.
```
[low, with a grin] I'll be watching.
```

---

## 8 · Final check before you call it done

- [ ] `fit_report.md` has no **REDO** lines.
- [ ] Watch the preview MP4 at full screen through S16 (0:49.98) and S22 (1:07.19). Voice and mouth should open and close together.
- [ ] The tagline (1:42.46) types each word as he says it.
- [ ] Listen to S18–S20, S29 and S33 on headphones. The music is nearly silent there, so any artifact is exposed.
- [ ] Listen once on a **phone speaker**. Every word should be clear over drop 2 (1:02–1:10).
- [ ] *Kept*, *Keeper*, *Seeker*, *Arjun* and *Dev* are said the same way every time.
- [ ] The arc lands: doubtful at S06, grudging at S17, impressed at S25, and the admission at S30.
