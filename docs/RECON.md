# RECON: KEPT launch teaser (phase 1)

Status: **waiting for approval.** No code has been written. Companion docs: [`MUSIC_BRIEF.md`](MUSIC_BRIEF.md) and [`SFX_LIST.md`](SFX_LIST.md).

Contents:
0. Input check (what's missing or different from the brief)
1. Decisions needed before the shot list
2. What I'll reuse: tokens, components, screens, assets
3. The Keeper: full rig inventory
4. The Keeper: personality lock (acting bible for this film)
5. The Keeper: gaps the script needs, and how I'll build each one
6. Reference breakdown (film 1: Apple iOS 14; film 2: Converse banking app)
7. Principles extracted (the 20% we borrow)
8. Original KEPT-only transition and staging ideas (the 80% that's ours)
9. VO: file durations and placeholder timing
10. Formats and safe areas
11. Build approach (for phase 4, summary only)

---

## 0 · Input check

| Input | Status | Note |
|---|---|---|
| `KEPT_TRAILER_BRIEF.md`, `START_HERE.md`, `README.md`, `design/README.md` | ✅ read in full | |
| `frontend/` (theme, components, Keeper rig, fonts) | ✅ | Geist 400–900, Geist Mono 500/600 and `kept-icons.ttf` are all present |
| `design/` (tokens, DESIGN, components, motion, screens, flows, copy, rules, assets, reference) | ✅ | |
| `screenshots/` (`today-stack/`, `join/`, `all-screens-oct10/`) | ✅ | |
| `references/01-apple-ios.mp4` | ⚠️ **different name** | Present as `references/introducing-iOS-14-SnapYT.App.mp4` (1920×1080, 30 fps, 50 s). The last 4 s (46–50 s) are a Filmora watermark outro, not part of the film; ignored. |
| `references/02-banking-app.mp4` | ⚠️ **different name** | Present as `references/Best-Motion-Graphics-SnapYT.App.mp4` (1920×1080, 25 fps, 44 s). It's the *Converse Mobile / Converse Bank* film. |
| `audio/music-refs/*.mp3` | ✅ 3 files | `James_Hype_-_Seratonin_(mp3.pm).mp3` (1:56), `MONOH-Jazmine-Johnson-SnapYT.App.mp3` (2:15), `trndttr.mp3` (3:00). Git-ignored, analysis only. All three are shorter than the releases and measure faster than typical house tempos, so they may be radio or sped edits (see MUSIC_BRIEF). |
| `audio/vo/L01–L12.wav` | ❌ **missing** | Silent placeholders at 2.5 words/s will be used (timing in §9). **This creates a timing problem; see decision D2.** |
| `audio/track.mp3`, `audio/sfx/` | ⏳ expected after this phase | |
| CTA handle / URL | ❌ `[FILL IN]` in the brief | Needed before the CTA is built (D5). |
| Tools | ✅ ffmpeg/ffprobe, Node 26, Python + librosa (in a scratch venv) | `sox` isn't installed; ffmpeg covers it. |

---

## 1 · Decisions needed before the shot list

These change what's on screen, so I won't guess. My recommendation comes first in each.

### D1 · The money in the signature moment: the brief disagrees with the app

Three sources give three different rules:

| Source | What a miss costs | Where it goes | What the brief's scene would show |
|---|---|---|---|
| **Brief §5** | Alex's whole 1,000 SKR shatters | 3 friends; counters roll to **1,200**; "KEPT 10%" chip | Doesn't add up even on its own terms: 1,000 − 10% = 900 ÷ 3 = 300 each, so **1,300**, not 1,200 |
| `design/rules.md` §3 | 1,000 ÷ 7 days = **143**, then 214, then 321 | 90% to keepers, **10% fee** | Alex −143 · 129 to friends (+43 each) · KEPT 14 |
| **App copy amendments** (`frontend/src/copy/amendments.json`, owner decision **D-93**, which overrides design copy) | **10% of the stake, every time** = **100** | "Shared with whoever kept, **and KEPT**"; "KEPT takes **one equal share**" | Alex −100 · You/Sam/Jo +25 each → **1,025** · KEPT 25 (one share, not 10%) |

Also: under every version of the rules, you only lose your *whole* stake when the Oath breaks (HP 0), and then **the pot burns and nobody gets it** (the L3 copy reads "The pot burns. Nobody eats."). So "the 1,000 shatters into coins that fly to friends" would show something the product doesn't do. That's risky in a store listing.

**Recommendation:** follow the live app (D-93). Alex's card shows **−100 SKR**. The scythe slices a 100-coin chunk off his stake, the coins arc into **You · Sam · Jo** (+25 each, rolling **1,000 → 1,025**), and the 4th share, **"KEPT 25"**, drops into the Keeper's ledger. The visual can stay as big as planned: 100 coins is plenty for a shatter. The number is honest.
*If you'd rather have a bigger payoff, an honest option is a 7-day recap where Alex missed 3 days (−300, friends +75 each → 1,075). It's more to read in 4 s, though.*
**Also confirm:** is "KEPT keeps 10%" (brief §0) still the public line, or is it "one equal share"?

### D2 · The script doesn't fit 28 s at 2.5 words/s

The script has **71 words** (the brief estimated about 60), which is **28.4 s of pure speech** at 2.5 words/s, and about **31 s** with the written beats. The 15 s cut needs about 16.9 s. The overrun by beat is in §9. **Recommendation** (pick one before VO is recorded):

- **A (recommended): trim, and make L09 caption-only.**
  - L04 becomes "Pick a habit. **Stake it.** Bring witnesses." (7 words)
  - L07 becomes "Miss a day? **Friends** take your money." (7 words)
  - L09 becomes **chips only, no VO** (the chips already say it)
  - L12 sits inside the final CTA hold, after L11

  The 28 s cut then fits with small air pockets around the two drops. The 15 s cut uses L01 · L03a · L06 · L07 · L08 · L11 (13.2 s), with L05's information carried by the ✓ chips on screen.
- **B: keep every word and make the hero cut 30 s** (still within the brief's 30 s limit). The drops stay at 0:07 / 0:17.5; the extra 2 s go to the signature moment and the CTA.
- C: keep every word at 28 s and direct the voice actor to read the information lines at about 3 words/s. This works against "low, dry, unhurried", so I don't recommend it.

### D3 · Colours: the brief vs the app tokens

The brief (§7) lists black `#0E0E0E`, red `#E5484D` and cream `#F3ECE1`. None of these are tokens. The app uses bg `#131313`, red `#F87171` and paper `#F2F0EA`. **Recommendation:**
- All rebuilt UI uses the **app tokens exactly**, so it matches the screenshots.
- `#0E0E0E` is the film's "void" *behind* the floating UI layers. It's one step darker than `bg.app`, which helps the UI read as a lifted layer.
- `#F3ECE1` is the cream background for the CTA and paper moments.
- Red: `#F87171` on dark. `#E5484D` only for red type on cream, because `#F87171` on cream fails contrast (about 2.3:1).

### D4 · Labels the brief names that the app doesn't have

Brief §11 forbids UI that isn't in the codebase.
- **"Swear" button:** the real commit button is **"Sign & stake"** (C6, lime) and the result is **"Sworn. 1,000 SKR on the table."** (C7·ok). **Recommendation:** he slams **Sign & stake**, and the SignStatus stamp **"Sworn."** morphs into the Oath card.
- **"Gym":** the app's goal is a sentence plus an object. **Recommendation:** the goal chip reads **"lift for 20 minutes"**, the object tile is **Dumbbell**, and the Oath is named **"Iron Week"**, as in the app's sample data.
- **Friends:** the brief uses **YOU · SAM · JO · ALEX**; the app's sample data uses Riya / Arjun / Dev. I'll use the brief's names with generated avatars (from the Avatar system). One flag: the app's own profile sample is `sam.skr`, so "Sam" as a friend may look odd to anyone who knows the app. Say if you want other names.
- **Coin bursts** were removed from the *app* (D-78). In the film they're motion graphics, not UI, so I'm treating them as allowed, the same way the brief allows the viewfinder.

### D5 · Facts I need from you
1. The **CTA handle / URL** (brief: `[FILL IN]`).
2. Is **"426 in Discord"** accurate and approved for a store listing? It will date quickly. An alternative chip is "Live on Seeker".
3. The **"AI photo proof"** chip and "not a screen" check: the app copy says photos are "checked by AI on our server, then deleted". OK to say "Checked by AI" publicly?

---

## 2 · What I'll reuse

All of it is rebuilt as web React/SVG for Remotion. Nothing from React Native is imported. Values come from `frontend/src/theme/` (`tokens.gen.ts` + `supplement.ts`), with **`supplement.amend` applied: `text.tertiary = #808080`**.

### 2.1 Tokens
| Group | Values used in the film |
|---|---|
| Colour | `bg.app #131313`, `bg.outer #0B0B0C`, `surface.1–4 #1C1C1C/#222/#262626/#2A2A2A`, card gradient `#272727→#1D1D1D`, stack backs `#1D1D1D/#1A1A1A`; lime family `#C5F25C` (hi `#DAFF80`, lo `#B4E53F`, deep `#8FB52E`, shadow `#5E7A14`, edge `#7FA02A`); red `#F87171`; violet `#A78BFA` (review); paper `#F2F0EA`; text primary/muted `#BDBDBD`/secondary `#8A8A8A`/**tertiary `#808080`**; `onLime #131313`, `onLimeDeep #1A2600`; hairlines white .05–.10; HP gradient teal `#5EEAD4` → lime (DESIGN §2.7); member colours |
| Type | Geist + Geist Mono, sans tracking −0.2. `display 56/700/−2.5` (money), `titleXl 40/600/−1.8`, `title 30/600/−1.1`, `wordmark 44/900/−2`, `cardName 17/600`, `button 16/600`, `keeperLine 14/600` (bubble), `monoLabel 11/600/+1.4 caps`, `monoMicro 10/600`. Tabular numbers on every counter. **Scaled up for the film** (UI is 390 dp wide in-app; see §10). |
| Radii | card 26, cam 30, chip 15, pill, tile 12, sheet 38, button = h/2 |
| Shadows / materials | `card` (hairline + `0 24 40 rgba(0,0,0,.45)` + 115° sheen), `tile3d` (1.5 top highlight, 3 bottom shade, −4°), `buttonLime`, `moneyPill` (lime gradient, −3°, lime glow), `coin` (radial `#F4FFD0→#C5F25C→#8FB52E`, 3 px drop `#5E7A14`). In video I *keep* the black blurred drops that the app strips on Android for performance (D-84); they give depth. |
| Motion | Easings `spring (.3,1.5,.5,1)`, `springHard (.3,1.6,.5,1)`, `springSoft`, `enter (.2,.8,.2,1)`, `burst (.15,.7,.3,1)`, `rise`, `draw (.5,0,.3,1)`; keyframes `pop`, `enter`, `bubble/bubbleR`, `draw`, `burst`, `countUp` (900 ms ease-out cubic), `segPop` (300 ms + 22 ms·i), `scan` (1.5 s alt), `shake` (300 ms: 0/−6/6/−3/0), `ping`, `shine` |

### 2.2 Components to rebuild (source → film use)
| Component | Source | Used in |
|---|---|---|
| **Keeper** (full rig) | `keeper/rig.ts` + SVG template from `design/reference/Keeper.dc.html` | every scene |
| Speech bubble | `KeeperUI.tsx › KeeperPlacement` (white, radius 17/17/17/4, −3°/+2°, `bubble` 500 ms springHard) | **all captions** (scaled; lime/red key word) |
| CheckK + wordmark + splash timeline | `primitives/CheckK.tsx`, `brand/Brand.tsx`, motion.md §1 (tile pop → check `draw` → stem → leg → KEPT → tagline) | Aha (0:07) and CTA |
| OathCard + HPBar + stack backs | `content/Oath.tsx`, `content/Deck.tsx` (stack peeks, dots) | Feature 1 result, Feature 2 HP fill |
| Button (`p` white, `l` lime) + Shine | `actions/Button.tsx`, `Shine.tsx` | "Sign & stake", "Take photo" |
| OptionGrid (tile/big/chip modes) | components.md › OptionGrid; C2/C3/C4 | Dumbbell tile, **7** days, **1,000** stake |
| StepBar | components.md › NavBar | progress ticks while he taps through creation |
| SeatSlots + Avatar | `content/Social.tsx`/components.md › SeatSlots; `avatar/Avatar.tsx` | friends flying in (F1); the 4 friend cards (signature) |
| SignStatus ("Sworn.") | `content/Status.tsx` | slam → Oath card morph |
| **ProofCamera** (corners, scan line, state pill, gesture badge) + Shutter | `content/Camera.tsx`, F1/F2/F2a/F4 | Feature 2 (checking → fail red → pass lime) |
| Chip / Tag | `content/Basics.tsx` | ✓ checks, proof-flash chips, "KEPT 25" |
| MoneyMoment + CountText | components.md › MoneyMoment; `primitives/motion.tsx` | counters 1,000 → 1,025, Alex −100 |
| DayStrip / grid cell styles | `content/Status.tsx`, D2 | ✓/✗ status on friend cards |
| Ambient (orbs, tone wash, beam) | `chrome/Ambient.tsx` | the "subtle lime glow" backgrounds (brief §9) |
| FX coins | components.md › FX layer (14-coin burst, `burst` easing) + `assets/money/coin-skr.svg` | signature coin arcs |

### 2.3 Screens referenced (ground truth)
`B1`/`today-stack/deck-2.png` (Today card), `C1–C4`, `C6` (Sign & stake), `C7·ok` (Sworn), `C8` (seats), `F1`, `F2` (checking), `F2a` (fail), `F4`, `F5` (day kept, HP chip), `D2`/`D3` (grid, balances), `L1` (payout, shades + sack), `A0` (splash). The generic hook app is the only invented UI. It will be deliberately bland: grey, system-ish, light-weight type, no KEPT tokens.

### 2.4 Assets
`design/assets/money/coin-skr.svg`, `objects/object-dumbbell.svg`, `gestures/gesture-victory-sign.svg`, icons (`fire`, `check-bold`, `close-circle-outline`, `camera`, `lock`, `robot-outline`, `shield-check-outline`, `sack`, `account-group`), `brand/kept-mark-dark.svg`, `kept-mark-ink.svg` (for cream), `kept-wordmark-dark.svg` ("EPT" set live in Geist 900, which we load). Keeper SVG/PNGs and the strips are used **only as on-model QA references**, never in the film.

---

## 3 · The Keeper: what `rig.ts` supports

Coordinates are in his 160 × 180 drawing space (bust: viewBox `28 4 104 104`). Everything is a pure function of `t` seconds (t = 0 is the still pose), so frame-driving is direct: `t = frame / fps (+ phase)`.

### 3.1 Moods (10). Face shape per mood, from `MOODS`.
| Mood | Eyes | Mouth | Head tilt | Extras | App use ("alias") |
|---|---|---|---|---|---|
| `neutral` | bean eyes, glints | stitch, slight smile | −3° | shades worn full on the hood | resting face; **judge** (+lens) |
| `smug` | L half-lid, R raised | stitch smirk | −6° | small shades on hood | idle default (strip "idle") |
| `happy` | arc eyes ^ ^ | **open grin with teeth** | −5° | lime **spark** | **cheer**, popin |
| `wink` | L open, R arc | stitch grin | −9° | | L2 "Still walked out up" |
| `stern` | narrowed, angled | stitch frown | 0° | **anger vein** (no glints) | **burn** (+scythe) |
| `soft` | big round, big glints | stitch soft | +8° | | comfort, shrug |
| `bored` | flat lids, no glints | flat stitch | +5° | | +cup |
| `side` | glance right (gx +5) | stitch | +10° | | **gossip** (+whisper), ledger |
| `shocked` | big round, small glints | **open O** | 0° | shock lines above head; left hand up | |
| `shades` | (sunglasses on) | open grin | −7° | left hand open | **payout** (+sack) |

### 3.2 Props (9 + none)
`seal` (lime stamp), `ledger` (open book, lime bookmark), `lens` (magnifying glass), `coin` (static lime coin), `sack` (lime money sack), `cup` (steaming cup), `whisper` (open hand by mouth), **`scythe`** (drawn *behind* the body, static, gripped at 118,122), `flip` (animated coin toss). Each prop sets the right hand's pose (`RIGHT_HAND` table).

### 3.3 Animations (11), all looping unless noted
| Anim | What it does (from the code) | Period |
|---|---|---|
| `idle` | body bob ±1.4 (sin 2.4t), hands bob out of phase, glance right (+4) for 1.3 s every 6.5 s | — |
| *(always on)* | **blink**: eyes scale to .12 for 0.13 s every 3.7 s (not in `jump`); open-hand finger wiggle ±3° | 3.7 s |
| `none` | still | — |
| `peek` | rises from 120 below with back-ease (0.55 s, squash .85→1), waves to 1.9 s, sinks at 3.7–4.1 s | 4.4 s |
| `popin` | the same rise and wave, **one-shot**, no sink | one-shot (3 s) |
| `flip` | wind-up, flick, coin arcs 60 up with 5 half-turns, lime/back colour swap, dashed trail, head follows the coin | 1.7 s |
| `wave` | open right hand at (136,90), ±18° at 9 rad/s, tilt +5 | — |
| `point` | right **point** hand, scale pulse +16% (sin 5t), tilt −4 | — |
| `tap` | left fist across body, right index taps at (70,108), 10 rad/s, tilt +4 | — |
| `thumbs` | thumbs-up bob, scale pulse +8% | — |
| `jump` | squash 0.15 → 18-unit hop with both hands up → landing squash .88 | 1.8 s |
| `shrug` | both hands open, rising and falling, tilt up to +7, body −2 | sin 2.2t |

Hand poses: `open`, `fist`, `point`, `thumb` (plus a `hand` override for the right hand). Sleeves are quadratic curves from the shoulders to wherever the hands are, so **hands can be moved anywhere and the sleeves follow on-model.**

### 3.4 What the rig *doesn't* have (gaps; build plan in §5)
Body lean/rotation, sideways travel, gaze aimed at a target, mood transitions, speech beats, props that move *with* the hand (lens and scythe are drawn at fixed coordinates, not attached to the hand), a scythe swing, swat/flick/slap/slam, shimmy, ledger tick, visor glint.

---

## 4 · The Keeper: personality lock

You asked for special care here, so these are the rules every shot must pass. They come from brief §2, the app's own Keeper lines (`copy.json › keeper`), and what the rig's moods are used for in the app.

**Who he is:** the bouncer of your promises. Deadpan, smug, a bit theatrical, secretly on your side. He loves payday. "Nice try" is his catchphrase. The app's own lines set the register: *"Hold still. I'm judging."* · *"The pot burns. Nobody eats."* · *"Seven for seven. Pay the Keeper."* · *"Clean. Your 1,000 sleeps safe tonight."*

**Rhythm rule: slow face, fast hands.**
- His head and eyes move lazily: 12–20 frames per look, ease-in-out, and he never whips his head. That's the deadpan.
- His gloves and props are snappy: 4–8 frames per strike, overshoot, settle. That's the theatre.
- The contrast between the two is the comedy.

**Stillness is a performance, not idling.** Before every punchline he holds for 8–14 frames (still breathing and blinking) while looking at the camera, then delivers. The brief's "never idle" means he's never *doing nothing*: a held stare at the viewer counts as acting; floating around on loop does not.

**Mood map for this film.** No moods outside this table, and every change is motivated:

| Beat | Mood | Why |
|---|---|---|
| L01 hook, watching the cursor | `side` → `bored` (on "from bed") | He's sizing you up, then unimpressed |
| L02 streak breaks | `bored` → `smug` on "Gone." · `shrug` + `bored` on "Cost you? Nothing." | Dry. The shrug is sarcasm, not comfort |
| L03 slap | `stern` (the vein shows he means it) → popin `smug` behind the logo | He's the one who fixed it |
| L04 taps | `neutral` (working) → `stern` on the slam | A bouncer stamping you in |
| L05 inspection | `neutral` + lens (the app's "judge" pose) | — |
| L06 "Nice try." | **`bored`**, slow blink (eyes closed 10 frames), tiny head shake | Unimpressed, never angry |
| L07 scythe | `stern` + scythe (the app's "burn" pose) | Business |
| L08 "I love this part." | **`happy`** (spark), shimmy, quieter | The one moment the mask slips. Payday |
| L09 proof | `side` + ledger | Bookie doing his books |
| L10–L11 CTA | `smug`, leaning on the logo, `point` at the CTA | Owns the room |
| L12 tag | `side`, then a **`wink`** on the final frame | "Secretly on your side": his only warm beat |

**Don'ts:**
- `shocked` and `soft` are never used. He's never surprised by a cheat and never sorry for you.
- No mocking bodies, weight or health. He roasts the *excuse* (the bed tap, the screen photo), never the person.
- No fast head bobbing to fake talking.
- He doesn't wave hello (`wave`/`popin`'s wave beat is trimmed, except the logo pop-up, where it reads as a smug "ta-da").
- He never looks lost. His eyes always target the thing being discussed, then the viewer on the punch.

**Mood switches happen inside a blink.** The eye paths are different shapes per mood, so a straight cut would pop. Every mood change is timed to a blink frame (eyes at 12% height) or hidden behind a head turn or a hand crossing the face. Eye shape parameters (`ht`, `hb`, `yi`, `yo`, `w`) and the stitch curve are numbers, so neighbouring moods (neutral ↔ smug ↔ bored ↔ stern ↔ side) can also be tweened over 3–4 frames. Grin and open-mouth moods (`happy`, `shades`) only switch inside a blink.

**Speech without lip-sync** (brief §2):
- a head bob (2–3 units, spring) on every stressed syllable
- a squash and stretch of the root (sy 1.03 / sx 0.98) on punch words
- a **stitch wiggle**: the stitch control point ±1.5 and the four tick marks jitter ±0.5 while a word is voiced
- glove gestures on the important nouns

All of this is driven from the VO's word-timing map (and its loudness curve once the WAVs exist). There are no mouth shapes. The stitch stays shut.

---

## 5 · Gaps the script needs, and how I'll build them

Everything is layered *on top of* the untouched rig output, so the base stays on-model. In code it's a "performance" track of keyframes per shot. I'll check on-model accuracy by rendering my port at t = 0.6 s for each animation and pixel-diffing it against `design/assets/keeper/svg/keeper-pose-*.svg`.

| # | Need (script beat) | Build |
|---|---|---|
| G1 | **Root transform**: lean in from the frame edge (L01), lean on the logo (CTA), lean back in (L12) | Translate + rotate the whole body around his floor point (80,178), with squash/stretch from the rig's own `sx/sy` |
| G2 | **Gaze target**: look at the cursor, then the camera | Animate the glint offset `gx` (−4…+5) and the head tilt; eye travel 12–20 frames ease-in-out (the slow face rule) |
| G3 | **Mood transitions** | Blink-gated swaps plus numeric tweens of the eye and stitch parameters (§4) |
| G4 | **Speech beats** | Per-word impulses → spring on head bob, root squash and stitch wiggle (§4) |
| G5 | **Free hand tracks**: flick, swat, slap, tap-on-target, slam | Keyframed right/left hand `[x, y, rot, pose]` overriding the anim (sleeves follow automatically). A 2-frame **smear** (stretched glove ghost at 30% opacity) on any move faster than 40 units per frame |
| G6 | **Props attached to the hand** (lens, scythe, ledger) | Re-parent each prop into the hand's transform using its default offset from the `RIGHT_HAND` table, so the prop moves exactly where it was drawn |
| G7 | **Scythe swing** (signature) | Pivot at the grip: wind-up −35° (8 frames, squash + lean back) → swing +140° in **4 frames** → follow-through overshoot +15° → settle (12 frames). The blade leaves a lime and white **arc smear** (a swept crescent of the blade path) for 3 frames. Body rotates with it ±8°. Detailed in the shot list |
| G8 | **Shimmy** (L08) | Root x ±6 and alternating tilt ±5° at 8th notes (0.219 s at 137 BPM), hands open and swaying in counter-phase, spark pulse. Quiet and small, not a dance |
| G9 | **Ledger tick** (L09) | The `ledger` prop in the left hand; the right `point` hand taps 3 times on the stabs; a lime ✓ draws (`draw` 320 ms) per tap |
| G10 | **Visor glint** (CTA) | A white band clipped to the brim path (`M30 43 Q80 19 130 43…`), sweeping left to right in 18 frames, once only |
| G11 | **Slow blink / deadpan** (L06) | Override the blink: closed for 10 frames, opening over 6 |
| G12 | **Logo pop-up** (L03) | The existing `popin` (back-ease rise), trimmed to rise + one smug settle |
| G13 | **Bust / cameo framing** | Bust viewBox for corner cameos, so he stays readable when small |

---

## 6 · Reference breakdown

Method: frames pulled at 2 fps (contact sheets), 10 fps strips around each transition, and a frame-difference **motion-energy profile** that measures how long each move lasts and *where its peak speed falls*. A peak early in the move means ease-out; a peak in the middle means ease-in-out.

### 6.1 Film 1: Apple "Introducing iOS 14" (`introducing-iOS-14-SnapYT.App.mp4`)
| Time | What happens | Craft notes |
|---|---|---|
| 0:00–0:01 | Small device centred on light grey, push in | Quiet start, product first |
| 0:01–0:03.4 | Continuous **push into one icon** (Clock) until the dial fills the frame (macro at 0:03.0) | Neighbouring icons go out of focus; the hero stays razor-sharp at 30× scale (vector) |
| 0:03.6 | **Snap back out** to the full phone: the largest motion spike in the first half, landing on a beat | A cut hidden inside fast motion |
| 0:04–0:07 | Widget gallery: one widget lifts out and is focused, the rest stay in place | One hero at a time |
| 0:08.2–0:09.6 | Widgets **tilted about 30° in 3D**, stacked, sliding over each other with parallax | Depth from real layering and soft shadows, used once |
| 0:09.6–0:10.2 | The stack **collapses into the phone** | Match cut: the element becomes the screen |
| 0:11.0 | "Apple Arcade" headline, large, left-aligned, plain weight | Type is quiet; the UI is loud |
| 0:12.5–0:14.4 | Messages UI cropped huge; PiP video **slides in from the edge** (0:13.8) | Elements enter from the frame edge with purpose |
| 0:17.4–0:18.3 | Whip from one photo to another, then the **photo shrinks into a widget** | Content → UI match |
| 0:23.0–0:24.2 | Tilted grid of pages → rotates flat → pushes in to the Battery widget | 3D-to-flat as a focus device |
| 0:35–0:37 | "iOS 14", thin weight, centred, about 2 s on a gradient | — |
| 0:37–0:46 | Logo on black under a spotlight, held still for about 9 s | The end card is still |

**Measured:** UI moves last **0.3–0.8 s**. Camera moves peak at 40–60% (S-curve); element entrances peak at 10–30% (ease-out). Average **one move every about 1.6 s**, with **0.5–1.5 s of hold** between moves. Big motion spikes (0:03.6, 0:05.8, 0:17.6) sit on cuts.
**Type:** sparse, large, light; no kinetic tricks; on for about 2 s; one idea at a time.
**Polish:** depth-of-field blur only on non-hero layers; soft contact shadows under lifted UI; UI is perfectly crisp even in macro; saturated gradient backgrounds.

### 6.2 Film 2: Converse Mobile banking app (`Best-Motion-Graphics-SnapYT.App.mp4`)
| Time | What happens | Craft notes |
|---|---|---|
| 0:00–0:04 | Frosted grid of banking tiles; headline "Banking has always looked the same" revealed with **blur-to-sharp per word** | Problem stated in type over blurred UI |
| 0:04.6–0:05.0 | Navy tile pops at centre; the logo **draws on** in arcs; the wordmark fades in tracked out | Logo built in about 0.4 s |
| 0:05–0:06 | The tile's white backing **grows into a phone frame** | The logo container becomes the device: a match |
| 0:06.5–0:09 | Three-line headline on the left, phone on the right; word-by-word blur reveal | About 24 characters per line |
| 0:09.3–0:11 | Hard cut to a **mosaic of phones** (light and dark) drifting diagonally | Scale and variety in one image |
| 0:11.5–0:13.5 | Push-in on one phone; **profile name and avatar swap every 0.5 s** in a fixed frame | Rapid content swap shows "it's yours" |
| 0:14–0:18 | Cursor taps "Configure Home Page"; list items **lift (scale + shadow) and reorder** | The control demonstrates the feature |
| 0:18.5 | Hard cut light → **dark 3D phone with blue light streaks**, slow orbit | Mood shift by cut |
| 0:23.5–0:25.5 | Avatars and chips float at different depths (z-blur); headline word by word | Depth via blur |
| 0:26–0:27 | **A light/dark toggle flips the whole UI** | A state change *is* the transition |
| 0:30–0:31.5 | One-word captions "Sleek / Intuitive / Enjoyable", each synced to a UI action: amount chips tapped, **Transfer** pressed, the button fills | Caption timed to the action |
| 0:32–0:33.5 | "Converse Bank breaks the standards": **one accent word in orange** | One accent per line |
| 0:37.5–0:39.5 | App Store card; **Get** is pressed → spinner | The CTA shows the action |
| 0:40–0:44 | Logo builds from arcs, tagline, about 3 s hold | — |

**Measured:** moves are slow, **1–2.8 s**, with the peak at **0–30%** (strong ease-out, expo-like) and long settles. It's calmer than we want. We keep the shape and compress the duration by about half.
**Money/numbers:** honestly, there's **very little animated money**. Balances are static, rates have ▲/▼ glyphs, and a transfer is shown as *amount chips → button press → button fill*. The takeaway is "show money moving through the control that moves it" plus "one accent colour on the key number". For counters and coins we use KEPT's own motion spec (900 ms ease-out cubic count-up, `burst` coins), which is already stronger than either film.
**Polish:** frosted depth, generous white space, one accent colour, cursor-as-actor.

---

## 7 · Principles we borrow (the 20%)

| # | Principle | Source | KEPT version (60 fps) |
|---|---|---|---|
| P1 | **One hero at a time.** Everything else drops to ≤ 40% opacity or gets depth-blurred | iOS 0:01–0:07, bank 0:23 | The hero pair is the Keeper's glove plus the element it touches. All other UI recedes to 35% opacity with a 6 px blur |
| P2 | **Elements ease out; the camera eases in and out** | both (measured) | UI entrances 18–30 frames with motion.md `enter`/`spring` (overshoot about 8%). Camera pushes 30–48 frames, `cubic-bezier(.65,0,.35,1)` |
| P3 | **Hold after every move** so the eye can read it | iOS (0.5–1.5 s) | Faster for comedy: one move about every 0.8 s, but every punch holds **≥ 0.5 s (30 frames)** |
| P4 | **Hide cuts inside fast motion, on the beat** | iOS 0:03.6, 0:17.6 | Every hard cut sits on a beat *and* inside a Keeper action (swat, slap, swing) |
| P5 | **Content becomes UI** (match by shape) | iOS 0:09.6, 0:18; bank 0:05 | Sign & stake → Sworn → Oath card; Take photo → viewfinder; stake → coins (§8) |
| P6 | **A state change is the transition** | bank 0:26 | Proof camera idle → check → fail (red) → pass (lime) changes the whole frame's tone wash |
| P7 | **Show the action through its control** | bank 0:30, 0:38 | The Keeper's glove is our cursor: he taps, slams and presses, and the UI reacts (press scale .98, 100 ms) |
| P8 | **Type: one idea, ≤ 3 lines, ≤ 28 characters per line, one accent word** | bank 0:32 | Captions follow this; the punch word is lime or red (brief §6) |
| P9 | **Depth from layers**, used sparingly | iOS 0:08 | Three planes: background glow (parallax ×0.3), UI (×1), Keeper/foreground (×1.15). One tilted-stack moment at most |
| P10 | **The end card is still** | iOS 0:37, bank 0:41 | CTA is fully still for ≥ 3 s; only his breathing, a blink and one visor glint |
| P11 | **Crisp always.** Blur only for depth and fast motion | both | All UI and Keeper are vector at final resolution; motion blur only on moves > 40 px/frame (Remotion `CameraMotionBlur`, 4–6 samples, short shutter) |
| P12 | **Rapid content swap in a fixed frame** | bank 0:11.5 | "Pick a habit": object tiles flick through in 0.1 s steps, then land on Dumbbell |

---

## 8 · Original KEPT-only transitions and staging (the 80%)

None of these are in either reference. Each one only works because of the Keeper, his props or KEPT's UI. The ⭐ ones are what I'd build first.

1. ⭐ **Scythe-arc matte (signature, 0:17.5).** The blade's swept arc *is* the transition matte. Behind the blade's trailing edge the frame is already the payout state: Alex's card is split, coins are in flight, the tone wash goes red to lime. One 4-frame swing changes the story's state. Used once, so it stays special.
2. ⭐ **The ace of spades flip (Feature 1 → Feature 2 handoff, and the bet theme).** He plucks the ace from his hood (it's in the rig, rotated −26° in the head group), flicks it at the camera, and it spins in 3D. The *back* of the card is the Oath card he just swore. Gambler's card → your commitment, and it's the only card-shaped prop that lands as a UI card.
3. ⭐ **Visor-as-scanner (Feature 2).** He leans into the viewfinder and the lime glow of his visor brim becomes the ProofCamera's scan line (`scan`: 2 px lime + glow). The scan literally comes from his face. The AI check *is* him judging, which echoes the app's "Hold still. I'm judging."
4. ⭐ **Streak ember → brand check (Problem → Aha, 0:07).** The 🔥 12 he flicks cracks to 0. One lime ember falls, and when he slaps the clutter flat it becomes the lime point that draws the **Check-K's check stroke** (`draw` 320 ms) from that exact spot, then the splash sequence fires on the drop. The failure ignites the brand.
5. **Cloak wipe (Hook → Problem, and the 9:16 cutdown).** He swishes his robe across the lens; for 3–4 frames the frame is his black cloak (its lime edge piping visible), and we come out the other side in the next scene. It's an on-model black wipe and plays on the reaper silhouette.
6. **Swat-carry (Problem).** He doesn't just swat the grey reminders away: the last swatted reminder's motion path carries the next element in, like a pool shot. The exit vector of one is the entry vector of the next.
7. **Ledger page → cream CTA (Proof → CTA).** The proof chips are ticked in his ledger. On the last stab he snaps the ledger shut toward the camera, and the cream paper of its page fills the frame and *becomes* the cream CTA background (`#F3ECE1`). Paper → paper.
8. **HP bar as a fuse (Feature 2 → 3).** When proof passes, the HP bar fills left to right; a lime spark runs off its end like a fuse and leads the eye across the frame to the four friend cards.

---

## 9 · VO durations and placeholder timing

**No WAV files exist yet**, so these are placeholders at **2.5 words/s**, with the scripted pauses added (0.5 s for "(beat)", 0.2–0.3 s between sentences).

| ID | Line | Words | Speech | + beats | Script slot | Fits? |
|---|---|---|---|---|---|---|
| L01 | You tapped "done"… *(beat)* from bed. | 5 | 2.0 s | **2.5 s** | 0:00–0:03 (3.0) | ✅ |
| L02 | Twelve-day streak. Gone. *(beat)* Cost you? Nothing. | 6 | 2.4 | **2.9** | 0:03–0:07 (4.0) | ✅ |
| L03 | So I made it cost something. *(beat)* Welcome to KEPT. | 9 | 3.6 | **4.1** | 0:07–0:10 (3.0) | ⚠️ must start about 1 s early, inside the Problem slot (zero air from 0:03 to 0:10) |
| L04 | Pick a habit. Put money on it. Bring witnesses. | 9 | 3.6 | **3.9** | 0:10–0:13.5 (3.5) | ❌ +0.4 |
| L05 | Two photos. Random gesture. I check everything. | 7 | 2.8 | **3.1** | 0:13.5–0:17.5 (4.0) together with L06 | ❌ +0.1 combined |
| L06 | Nice try. | 2 | 0.8 | **1.0** | (inside the same slot) | |
| L07 | Miss a day? Your friends take your money. | 8 | 3.2 | **3.5** | 0:17.5–0:21.5 (4.0) together with L08 | ❌ +1.1 combined, with no room for the scythe hit |
| L08 | I love this part. | 4 | 1.6 | **1.6** | (inside the same slot) | |
| L09 | Locked on Solana. Checked by AI. | 6 | 2.4 | **2.4** | 0:21.5–0:23 (1.5) | ❌ +0.9 |
| L10 | Keep your word. Or pay your friends. | 7 | 2.8 | **3.1** | 0:23–0:28 (5.0) together with L11 | ❌ +0.4 combined |
| L11 | KEPT. On Seeker. October 16th. | 5 | 2.0 | **2.4** | (inside the same slot) | |
| L12 | …I'll be watching. | 3 | 1.2 | **1.2** | tag, after 0:28 | ❌ no slot in 28 s |
| | **Total** | **71** | **28.4 s** | **≈ 31.7 s** | 28.0 s | |

**15 s cut as briefed:** L01 2.5 + L03a 2.6 + L05/L06 4.1 + L07/L08 5.1 + L11 2.4 = **16.7 s** in 15 s. Recommended 15 s line set (decision D2): **L01 · L03a · L06 · L07' · L08 · L11 = 13.2 s**.
When the real WAVs arrive I'll measure each file (trimming the 0.2 s pads), rebuild the word-timing map, and lock the animation to the VO first, then to the beat (brief §8).

---

## 10 · Formats and safe areas (each laid out natively, never cropped)

| | 16:9 · 1920×1080 | 9:16 · 1080×1920 | 1:1 · 1080×1080 |
|---|---|---|---|
| UI hero | right or centre, phone-column UI at about 2.2× app scale (a 390-dp column ≈ 860 px tall view) | top-centre, UI at about 2.4× | centre, UI at about 2.0× |
| Keeper hosting | left third, 25–35% of height (270–380 px) | lower third, about 30% of height (≈ 560 px), overlapping the UI's bottom edge | bottom-left or bottom-right corner, about 32% |
| Keeper cameo | corner bust, about 18% | corner bust, about 14% | corner bust, about 18% |
| Captions | bubble beside his head; kinetic text in the clear half | **kept inside y 250–1450 and x 80–1000** (clears TikTok/Reels/X chrome and the right-side action rail) | bubble above him |
| Hook / CTA | Keeper centred | Keeper centred, CTA in the middle band (y ≈ 900–1400) | Keeper centred |

Each format gets its own layout per scene (a `layout[format]` table in the scene library). The *animation* is shared; positions, scales and caption boxes are per format.

---

## 11 · Build approach (summary for phase 4; no code yet)

- **Remotion 4**, React + TypeScript, everything driven from `useCurrentFrame()` at 60 fps. Deterministic: no `Math.random`, no wall clock.
- **`<Keeper/>`**: `keeperFace` / `keeperFrame` ported as pure TS (the "worklet" markers removed), the SVG template from `Keeper.dc.html`, and a **performance layer** (§5) on top. `t = frame/60 + phase`.
- Fonts loaded locally from `frontend/assets/fonts` (`@remotion/fonts`); icons as inline SVG from `design/assets/icons`.
- The VO **word-timing map** (`vo.json`) drives the captions and the speech beats. Its loudness envelope (via `@remotion/media-utils`) adds the micro head-bob once the WAVs exist.
- One scene library, 6 compositions (3 formats × 2 lengths) composed from the same scenes with per-format layouts.
- **A guard against copyrighted audio:** the render script refuses to run if any audio input path is under `audio/music-refs/`, and the final mix only reads `audio/track.mp3`, `audio/sfx/`, `audio/vo/`.
