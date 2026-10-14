# KEPT — Launch Teaser Brief (v3: hosted by the Keeper)

A **≤ 30 s launch teaser made only of UI and motion graphics**, **hosted and narrated by the Keeper**, KEPT's mascot. He talks to the viewer, pushes the UI around, judges your excuses and collects from quitters.

The film follows a launch-film framework (pain → aha → 2–3 features → proof → one CTA), compressed into a teaser that still works **muted**.

> **How to use this file:** Claude Code reads it top to bottom, then works through the **phases in section 12**, stopping at every checkpoint for approval.

---

## 0 · What KEPT is

KEPT lets you **bet on your own habits**. You make an **Oath** (for example "gym, 7 days"), stake **SKR**, and add friends. Every day you **prove it with two photos**:

- **Photo 1:** your object plus a random gesture.
- **Do the thing.**
- **Photo 2:** the same object with a new gesture, before midnight.

AI checks that the object and gesture are there and that it's a real photo, not a screen. **Miss a day and your stake goes to the friends who kept their word.** KEPT keeps 10%. The pot is locked in a Solana program. Your public **KEPT RATE** shows how often you keep your word.

- **One-liner:** *Bet on your habits. Friends collect.*
- **Tagline:** *Keep your word. Or pay your friends.*
- **Launch:** Solana Seeker · dApp Store · **Oct 16**
- **CTA handle / URL:** `[FILL IN — e.g. kept.app or @keptapp]`

---

## 1 · Strategy brief (the GTM angle)

1. **Who it's for:** Seeker owners and Solana natives who already stake, already use Moonwalk-style apps, and have quit every habit app they've tried. They don't need habits explained. They need a reason this time will be different.
2. **The angle:** a **host, not a feature tour**. The Keeper is the reaper of broken promises, and he's *thrilled* about it. He calls out the viewer ("you tapped 'done'… from bed"), then shows how KEPT makes quitting cost money that goes to your friends. People share characters, not feature lists.
3. **The goal:** a **28 s hero cut** for the dApp Store listing and pinned post, and a **15 s cut** for X and Seeker feeds. Both work **muted** (his lines are on-screen captions) and drive one action: install on **Oct 16**.

---

## 2 · The Keeper: character bible

### Look

Use the **real Keeper** (`frontend/src/components/keeper/rig.ts` + `design/assets/keeper/`). Don't redraw him.

- hooded black robe and a skull-white face with a stitched mouth
- lime visor, sunglasses on his head, an ace of spades tucked in the hood
- floating cartoon gloves
- moods, poses and props live in the component: smug, shock, bored, happy, point, tap, scythe, ledger, magnifying glass, cup, etc.

**List every mood, prop and animation the component supports before scripting his acting.**

### Personality

He's the **bouncer of your promises**: deadpan, smug, a little theatrical, secretly on your side.

- He **roasts excuses, never people.** No jokes about bodies, weight or health.
- **Loves payday.** When someone misses, he gets *giddy*. That's the running joke.
- **Unimpressed by cheating.** "Nice try" is his catchphrase.
- **Short sentences.** Dry timing. He lets a beat of silence do the joke.
- **PG-13 at most.** Attitude, not swearing; this is a store listing.

### Voice

A **low, dry, unhurried** voice: deadpan with a smirk in it, slightly gravelly, never cartoonish or squeaky. Think a bored nightclub bouncer who secretly loves his job. Pace is about **2.5 words per second**, with pauses for the jokes.

### Acting rules (for the animator)

- **He's never idle.** He's always reacting, looking at what he's talking about, or touching the UI.
- **He drives the transitions.** He swipes screens away, pulls cards into frame, taps buttons, and swings the scythe for cuts.
- **Speaking without lip-sync:** his mouth is stitched shut, so show speech with a small head bob, a squash-and-stretch on stressed words, a stitch wiggle and glove gestures. No mouth shapes needed.
- **Scale and placement:** about 25–35% of frame height when he's hosting, as a corner cameo while UI is the hero, and centred for the hook and the CTA.
- **Brand presence:** he or the KEPT mark is on screen in **most frames**, which lifts brand recall.

---

## 3 · Rules this teaser follows

| Rule | How we apply it |
|---|---|
| **Message in the first 3 s** | His first line *is* the hook, captioned from frame 1. |
| **Start on the product and brand** | We open on the Keeper inside KEPT-style UI, with no logo intro. |
| **Muted-first** | Every VO line is also an **on-screen caption**, styled as his speech. The story must read with sound off. |
| **One promise** | Three features at most, all serving "quitting costs you, friends collect." |
| **One signature visual** | **The Keeper swings his scythe through Alex's stake; it shatters into coins that fly to the 3 keepers.** |
| **Light proof** | A 1.5 s flash: *Pot locked on Solana · AI photo proof · 426 in Discord*. |
| **One CTA, held for 3 s or more** | "Seeker dApp Store · Oct 16" plus the handle. |
| **Native formats** | 16:9, 9:16 and 1:1, each laid out natively. Never crop. |

---

## 4 · Inputs you will receive

| Input | Path | Use it for |
|---|---|---|
| KEPT app source (React Native / Expo) | `./frontend/` | How each piece really looks and moves: `src/theme/` (exact values; `supplement.ts › amend` overrides tertiary text to `#808080`), `src/components/` (OathCard, Today's `Deck.tsx`, HP bar, camera frame, Button, Shine), `src/copy/`, fonts in `assets/fonts/` (Geist, Geist Mono, `kept-icons.ttf`). **It's React Native, so rebuild the pieces as web React for Remotion; don't import them.** |
| **The Keeper rig** | `./frontend/src/components/keeper/rig.ts` (+ `KeeperSkia.tsx`, `Keeper.tsx`) | His poses and animations as a pure function of time. **Port it to SVG and drive it with `useCurrentFrame()`.** Art lives in `./design/assets/keeper/` (svg, png, anim). |
| Design system | `./design/` | `tokens.json`, `DESIGN.md`, `components.md`, `screens.md`, `flows.md`, **`motion.md` (real timings and easings)**, `copy.json`, `rules.md`, plus `assets/` (brand, objects, gestures, SKR coin, icons). |
| Web prototype | `./design/reference/` | `kept-kit.js`, `kept-screens-*.js`, `Keeper.dc.html`, `KEPT Logo.dc.html`: already web code, the closest thing to Remotion-ready UI. |
| Real app screenshots | `./screenshots/` | The ground truth for how screens look (1080×2400). `today-stack/` and `join/` are the newest; `all-screens-oct10/` has everything else. |
| Keeper voiceover | `audio/vo/L01.wav … L12.wav` | One file per line ID from section 5. **If missing, use silent placeholder timings at 2.5 words/s and tell me.** Never generate a voice yourself. |
| Music taste references | `audio/music-refs/*.mp3` | **Analysis only, never used in the film.** *All Of Me* (MONOH, Jazmine Johnson), *Seratonin* (James Hype), *Trndsttr, Lucian Remix* (M. Maggie, Black Coast). See section 8a. |
| Final music | `audio/track.mp3` | A **licensed** track I'll source using your `MUSIC_BRIEF.md`. Until it arrives, use a scratch track for timing only. |
| SFX | `audio/sfx/` | Licensed or CC0 sound effects. Write the list I need to source (section 8b). |
| Reference 1: Apple iOS launch film | `references/01-apple-ios.mp4` | **Craft only.** Animation quality, composition, pacing, typography, how UI is staged in space. See section 4a. |
| Reference 2: banking app launch film | `references/02-banking-app.mp4` | **Craft only.** How a finance app shows money, numbers and UI states cleanly. See section 4a. |
| Logo | `./design/assets/brand/` (`kept-wordmark-dark.svg`, `kept-mark-*.svg`) | The brand card |

### Folder map

See `START_HERE.md` at the repo root for where every input lives and what's still missing. The Remotion project goes in **`./video/`**, renders in **`./renders/`**, and your written outputs (`RECON.md`, `MUSIC_BRIEF.md`, `SHOTLIST.md`) in **`./docs/`**.

### 4a · How to use the references (read carefully)

These two films are **craft references, not templates.** Neither has a mascot host, comedy or a story like ours, so **don't copy their structure, scenes or tone.** Our film is character-led, funny and cocky; theirs are calm and polished.

**Do this:**

1. **Watch both frame by frame**, then write a short breakdown of each with timestamps:
   - **Motion:** easing curves, speed, how elements enter and exit, stagger timing, the camera moves around UI (push-ins, parallax, depth), how transitions connect scenes.
   - **Composition:** where the UI sits in frame, how much empty space there is, how they focus attention on one element, how type and UI share the frame.
   - **Typography:** size, weight, line length, how long text stays on screen, how it animates.
   - **Polish details:** shadows, depth, blur use, colour grading, how crisp everything stays.
   - **From the banking film:** how numbers, balances and money movements are animated (counters, transfers, state changes). This directly helps our stake, coin and payout moments.
2. **Extract principles, not shots.** Turn each observation into a rule we can reuse, for example "UI elements ease out in about 300 ms with a slight overshoot", or "only one element is in focus at a time; everything else drops to 40% opacity."
3. **Then rely mostly on your own creativity.** Use those principles to raise the *quality bar*, but invent KEPT's scenes, transitions and gags yourself from the script, the Keeper's character and the KEPT UI. Aim for about **80% original ideas, 20% borrowed craft.**
4. **Pitch your own ideas.** In recon, propose **at least 3 original transition or staging ideas** that neither reference does and that only work for KEPT, for example the Keeper using his scythe as a wipe, or a card flipping into the camera viewfinder.

**Don't:**

- recreate any reference shot one-to-one
- copy their music, colours, logos or fonts
- let their calm, corporate tone soften the Keeper's attitude

---

## 5 · The script: 28 s hero cut

"VO" is the Keeper speaking; the caption shows the same words. Line IDs match the audio files. Timings are a guide; snap them to the beat.

| Time | ID | Visual direction (motion / UI) | Keeper VO = caption | SFX / music |
|---|---|---|---|---|
| **0:00–0:03 · Hook** | L01 | Dark KEPT-style UI with a grey generic habit checklist. A cursor taps **"Gym ✓ Done"** and it ticks with a cheap pop. The Keeper leans in from the edge and slowly looks at the camera, unimpressed. | **"You tapped 'done'…"** *(beat)* **"from bed."** | Cheap "ding", then a record scratch. Music starts on beat 1. |
| **0:03–0:07 · Problem** | L02 | The Keeper flicks a streak flame **🔥 12**. It cracks to **0** in red. Grey reminders pile up and he swats them off-screen. | **"Twelve-day streak. Gone."** **"Cost you? Nothing."** | Swat whooshes. Drop builds. |
| **0:07–0:10 · Aha** | L03 | He slaps the clutter, which collapses into one lime point. That explodes into the **KEPT** logo, with the Keeper popping up behind it, smug. | **"So I made it cost something."** → **"Welcome to KEPT."** | Big hit on the logo. Beat drops. |
| **0:10–0:13.5 · Feature 1: Make an Oath** | L04 | Real Oath UI. He taps each step as it animates: **Gym** → **7 days** → stake rolls to **1,000 SKR** → three friend avatars fly in → he slams **Swear**, and it morphs into the Oath card. | **"Pick a habit. Put money on it. Bring witnesses."** | Taps on the beat. Coin tick on the stake. |
| **0:13.5–0:17.5 · Feature 2: Prove it** | L05, L06 | The card's **Take photo** grows into a camera viewfinder. The Keeper inspects it with his **magnifying glass**. **First, a cheat:** a photo of a screen, flagged red ✗, and he deadpans. **Then the real one:** dumbbell + ✌️, and checks rise staggered and turn green: *Dumbbell ✓ · Victory sign ✓ · Real photo ✓*. The Oath HP bar fills. | L05: **"Two photos. Random gesture. I check everything."** · L06 *(at the ✗)*: **"Nice try."** | Shutter. Error buzz on the ✗. Ticks on the ✓s. |
| **0:17.5–0:21.5 · Feature 3: SIGNATURE MOMENT** | L07, L08 | Four friend cards: **YOU ✓ · SAM ✓ · JO ✓ · ALEX ✗**. The Keeper swings his **scythe** through Alex's card, and the 1,000 SKR shatters into coins that arc into the other three. Counters roll to **1,200**. A tiny "KEPT 10%" chip drops into his ledger. He does a little happy shimmy. | L07: **"Miss a day? Your friends take your money."** · L08 *(giddy, quieter)*: **"I love this part."** | Scythe swish, coin clinks on each arc. Biggest musical moment. |
| **0:21.5–0:23 · Proof flash** | L09 | Three chips snap in on the beat while he ticks them off his ledger. | **"Locked on Solana. Checked by AI."** *(caption chips: Pot locked on Solana · AI photo proof · 426 in Discord)* | Three tight hits. |
| **0:23–0:28 · CTA** | L10, L11 | Cream background. The Keeper is centred and leans on the KEPT logo. The tagline lands word by word, then the CTA **holds still for at least 3 s** while he points at it and the visor glints. | L10: **"Keep your word. Or pay your friends."** · L11: **"KEPT. On Seeker. October 16th."** | Music resolves, with a final hit on the logo. |
| *(tag, optional)* | L12 | After the CTA, the Keeper leans back into frame. | **"…I'll be watching."** | A tiny sting. |

**VO total:** about 60 words, roughly 24 s of speech, with room for beats.

### 15 s cutdown (X and ads)

| Time | Scene | Lines |
|---|---|---|
| 0–3 s | Hook | L01 |
| 3–5 s | Aha | short version: **"So I made it cost something."** + logo |
| 5–8.5 s | Prove it | L05 + L06 |
| 8.5–12 s | Signature moment | L07 + L08 |
| 12–15 s | CTA | L11 + end card |

---

## 6 · Captions (critical for muted viewing)

- Every VO line appears as a **caption tied to the Keeper**: either a **speech bubble** near him (black bubble, white Geist, lime highlight on the key word) or bold kinetic text when he's off-screen.
- **Words appear in sync with the VO**, a word or a short phrase at a time.
- Highlight the punch word in red or lime: "**from bed**", "**Nothing**", "**cost**", "**take your money**", "**Nice try**".
- Keep captions inside the safe areas, especially in 9:16.

## 7 · Overall direction

- **Lengths:** a 28 s hero cut and a 15 s cutdown.
- **Formats:** 16:9 (1920×1080), 9:16 (1080×1920) and 1:1 (1080×1080), all at 60 fps, each laid out natively.
- **100% native to KEPT.** Reuse the real:
  - colours: black `#0E0E0E`, lime `#C5F25C`, red `#E5484D`, cream `#F3ECE1`, white
  - type: Geist, heavy and tight
  - Oath cards, buttons, pills, the Oath HP bar, icons, radii and shadows
  - the Keeper component
- **UI abstraction, not a screen recording.** Rebuild screens as crisp layers and isolate what matters. The Keeper physically points at, grabs or pushes the important element.

## 8 · Music, VO & sound

**The sound is half the film.** It must grab attention in the first second, feel **dark, bassy, fun and adrenaline-pumping**, and keep people watching to the end.

- **Avoid:** happy-ukulele startup music, generic "corporate tech" pulses, EDM festival cheese.
- **Priority order when mixing:** VO > signature SFX > music. Duck the music under every line. Lock the animation to the VO first, then to the beat.

### 8a · Music analysis → `MUSIC_BRIEF.md` (do this in recon)

The three tracks in `audio/music-refs/` show **my taste**: dark melodic house, bass-heavy tech house, and a vocal-chop drop. They're **copyrighted and must never appear in the film.** Use them only to understand the vibe, then design something that fits *our* film. My taste is a starting point, not the answer: if a different flavour serves the video better, propose it and explain why.

1. **Analyze each reference** (with librosa or similar, plus listening notes):
   - BPM and key/mode
   - structure: intro, build, drop, breakdown, and *when* the first drop hits
   - low-end character: sub bass vs. mid bass, how the kick and bass interact
   - drums and groove: four-on-the-floor vs. half-time, swing, percussion
   - textures: vocal chops, risers, filters, FX
   - energy curve and loudness
   - **what makes each one feel dark-but-fun rather than happy**
2. **Write `docs/MUSIC_BRIEF.md`** containing:
   - **What the three share**, and what to borrow as ingredients, not melodies.
   - **Target spec for our track:** genre blend (e.g. dark bass house / tech house with a half-time hit on the signature moment), BPM range, minor key, sub-heavy low end, vocal-chop or stab hooks, and no lyrics, or only chopped wordless vocal so it doesn't fight the Keeper's VO.
   - **Your own creative twist:** at least 2 ideas that make it *ours*, not a copy of my playlist. For example, a dry, low "reaper" texture or a scythe-swish riser, a cash-register or coin percussion layer in the drop, a heartbeat kick in the hook, or a ticking-clock motif tied to the "before midnight" proof.
   - **A cue sheet mapped to the 28 s script:**

     | Time | Music cue |
     |---|---|
     | 0:00 | Instant attention. No slow fade-in; open on a filtered bass groove or a hard stab. |
     | 0:01–0:02 | Record-scratch stop on "from bed." |
     | 0:03–0:07 | Tense build. Filtered, rising. |
     | **0:07** | **Drop 1** on the KEPT logo. |
     | 0:10–0:17 | Driving groove under the features, with room left for the VO. |
     | **0:17.5** | **Biggest moment:** half-time hit or second drop on the scythe swing. |
     | 0:21.5–0:23 | Three stabs for the proof chips. |
     | 0:23–0:28 | Strip back for the tagline, final hit on the logo, a clean tail. "…I'll be watching" lands in near-silence. |

     Plus the 15 s cut version.
   - **Sourcing kit for me:**
     - search keywords and filters for stock libraries (Artlist, Epidemic Sound, Musicbed)
     - **an AI-music prompt** (for a commercial-licence plan such as Suno Pro or Udio) that describes genre, BPM, key, instruments, energy and structure **without naming any artist or song**
     - a one-paragraph brief I could hand a freelance producer
   - **Stop for approval.**

### 8b · Sound effects

List every SFX with its timestamp, character and source suggestion (CC0 sites, stock-library SFX, or an AI SFX generator). Every one must be **tight and designed, never cartoony**:

- 0:00: cheap app "ding", then a record scratch on "from bed"
- swats and whooshes for the Keeper's swipes and match cuts
- a low sub "boom" or impact on the KEPT logo
- camera shutter (crisp, modern)
- an error buzz on the cheat photo and "Nice try"
- soft, satisfying ticks on each ✓ (rising pitch per check)
- **scythe swish, then a glass-and-coin shatter, then coin clinks landing in rhythm with the beat** (the signature moment's sound must be as good as its visuals)
- ledger "stamp" and stabs for the proof chips
- final logo hit and a small sting on "…I'll be watching"

### 8c · Fitting the track to the film

Once I provide `audio/track.mp3`:

- Detect its BPM and beats, then **edit it to fit** using ffmpeg/sox or the Remotion audio tools: trim, loop sections, crossfade on bar lines, and move the drops so they land on **0:07** and **0:17.5** (and the matching points in the 15 s cut).
- Adjust the cut points of the animation to the real beat grid.
- **Mix:** duck the music −8 to −12 dB under each VO line with fast attack and smooth release. SFX sit just under the VO.
- **Master:** about −14 LUFS integrated, true peak −1 dBTP (social-platform standard). Export AAC 320 kbps with the video.
- **No scratch music in the final.** If I haven't supplied a licensed track, the scratch track is for the animatic only, and you must tell me.

## 9 · Backgrounds

- **UI scenes:** KEPT dark `#0E0E0E` with a very subtle lime glow that drifts slowly and never leaves the edges.
- **Hook, aha and CTA:** cream `#F3ECE1`, or dark where the scene says so. Add light grain. No neon or space backgrounds.

## 10 · Animation style

Use:

- fast, smooth UI motion with intentional easing
- match cuts **driven by the Keeper or by product logic**: he swipes, a button becomes the next screen
- staggered entrances, clean masks, small depth shifts
- motion blur only on fast moves
- text and UI always crisp
- varied text entrances

## 11 · Avoid

- opening on a logo
- feature dumps, more than 3 features, or two CTAs
- a static, idle or floating Keeper; he must act every second he's on screen
- redrawing the Keeper off-model
- inventing mouth shapes or lip-sync (his mouth is stitched)
- a squeaky or cartoon voice, or swearing in the VO
- generic crypto visuals, casino vibes, neon, slow fades, lazy zooms
- corny AI lines ("It's not X, it's Y")
- UI that doesn't exist in the codebase (except the camera viewfinder and the generic habit app in the hook)

---

## 12 · How to work (phases and checkpoints)

1. **Recon (no code).**
   - List the tokens, components and screens you'll reuse.
   - **List every Keeper mood, prop and animation the component supports**, plus any gaps the script needs (scythe swing, shimmy, magnifying glass, lean, swat) and how you'll build them.
   - Write the **reference breakdown** from section 4a: motion, composition, type and polish for each film, with timestamps, turned into reusable **principles**.
   - Pitch **at least 3 original KEPT-only transition or staging ideas** that aren't in either reference.
   - Report the VO file durations.
   - **Music:** analyze the three references and write `docs/MUSIC_BRIEF.md` (section 8a), plus the SFX list (section 8b).
   - **Stop for approval.** I'll then source the licensed track and SFX.
2. **Shot list lock.**
   - Build a beat-by-beat shot list for the 28 s cut: scene, start and end time, **VO line**, **the Keeper's acting**, UI motion, and transitions in and out.
   - Derive the 15 s cut from it.
   - **Stop for approval.**
3. **Animatic.**
   - Make a quick, rough 720p timing pass with the VO and music, using placeholder motion. It checks only timing and comedy beats.
   - **Stop for approval.**
4. **Build.**
   - Use Remotion: one shared scene library, with compositions for 3 formats × 2 lengths.
5. **Stills check.**
   - Render one key frame per scene (16:9 and 9:16) as a contact sheet.
   - **Mute test:** does the story read from the captions alone?
   - **Stop for approval.**
6. **Draft.**
   - Render a 720p draft of the 28 s 16:9 cut.
   - **Stop for feedback.** I'll reply with screenshots and timestamps.
7. **Final.**
   - Render all 6 versions at 1080p60.
   - Write a `README.md` covering: re-render steps, which components were reused, the Keeper acting rig, the beat and VO timing map, and scene → file map.
