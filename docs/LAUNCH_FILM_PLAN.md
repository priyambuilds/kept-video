# KEPT launch film, v2 plan

**Status:** this replaces the 28 s / 15 s teaser plan in `SHOTLIST.md`, following owner feedback on 11 Oct. The Keeper rig, the beat grid, the VO pipeline and the audio mix carry over. The story, the UI treatment and the length are new.

## 0 · What was wrong with v1

| Feedback | Cause | Fix in v2 |
|---|---|---|
| "Doesn't tell much about the product" | It covered three features (oath, proof, payout) at gag speed, inside a 28 s cap. | About 86 s across **seven chapters**, covering every major surface of the app. |
| "No bounties, no profile, nothing" | The brief limited it to three features. | Bounties, Profile and kept rate, Wallet and Inbox, Rematch and onboarding are all in. |
| "Doesn't show the UI on a real mobile" | The UI was cut into floating abstract layers. | Every app moment plays **inside a phone**, at its real 390 × 844 layout, with real screen-to-screen navigation and touches. |
| "Sped up intentionally" | Gags were packed onto 16th notes to fit 28 s. | Each screen holds long enough to read (about 1.5–3 s). The app's own motion timings from `motion.md` play at **1× speed**. |
| "No inspiration from the references" | Only principles were borrowed, not staging. | Staging is borrowed directly: phone push-ins and dives, widgets lifting out of the phone in 3D, the tilted phone wall, the tap-dot cursor, the headline beside the phone, the App-Store "Get" end card. See §2. |

## 1 · Product inventory (from `design/screens.md`, `rules.md` and 134 screenshots)

| Area | What the user does | Screens | Hero moment for the film |
|---|---|---|---|
| **Onboarding** | Connects the Seeker Wallet (signs a message, no password), gets Genesis-token verified, and builds an avatar | A0–A4, I9 | The verified ring, then avatar shuffles with Keeper quips ("A fox. Sly. I respect it.") |
| **Oaths** (create) | Sets the goal, object, length (3 / 7 / 14), solo or group and stake (500 / 1,000 / 2,500), review mode, then reads the terms and signs | C1–C8 | Typing the goal, option taps, the stake row, the "Read it like a contract." card, the sign ring, "Sworn. 1,000 SKR on the table.", the invite QR |
| **Join** | Uses an invite code or QR, previews the Oath with the members' kept rates, then signs | E1–E3 | QR scan of IRON-7K2Q, seats filling with Riya, Arjun and Dev |
| **Today** | Swipes a card deck of today's Oaths, with countdown, HP bars and friend floats ("Riya kept") | B1–B5, + | The deck swipe, the ticking reset clock, the "Riya kept" float popping in |
| **Daily proof** | Takes two photos a day: the object plus a random gesture, checked by AI. Fails can go to group review | F1–F5, G1–G3 | The challenge pill ("Dumbbell + open palm") and countdown, shutter, "Hold still. I'm judging." scan, then a fail followed by a pass, ending on "Day 3 kept." |
| **Stakes and HP** | The shared HP bar: −20 per miss and +10 heal. A miss costs stake/days × 1.5ᵏ, paid to whoever kept. At 0 HP the Oath breaks | D2, D3, B5 | Arjun's grid cell turns red, HP 100 → 80, then "Arjun blinked. You didn't." with +43 SKR |
| **Payouts** | Results screens and claim to wallet | L1–L6, J1 | "Iron Week, kept." with 1,107 counting up, then Claim and "Claimed." |
| **Rematch** | A broken Oath can be run back to win back 50% | R1–R4 | "Run it back?" with "Rematch · win back 716" |
| **Bounties** | Free public challenges funded by a creator. Miss a day and you're out; survivors split the pool. Users can browse, join or create and fund one | H1–H7, K1–K5 | The feed (Northbound Run Club, 120,000 SKR, free), the detail page, the elimination list ("Nine down already.") and "27 survived. +296" |
| **Profile** | Public **kept rate** ring, streak, avatar and socials, plus privacy controls | I1–I8 | The 91% ring sweeping, the stat rows, and "I call you The Early Bird." |
| **Wallet and Inbox** | SKR balance, claim, SOL → SKR swap, notifications | W1–W4, N1, M1 | The lock-screen notification stack (the hook) and "+4,950 SKR" on the swap |

The **Keeper is already in the app**. He appears in KeeperNotes, inline placements and results screens. The film uses his real in-app lines from `copy.json › keeper`, and adds him outside the phone as the host.

## 2 · Reference breakdown (frame by frame, 2 fps contact sheets)

### Ref A: iOS 14 film (`introducing-iOS-14…mp4`, 50 s, 30 fps)

| t | What happens | Principle we take |
|---|---|---|
| 0.0–1.0 | A small phone sits centred on a soft grey stage, about 20% of the frame height, perfectly still. | **Open on the device, small and calm**, then go big. |
| 1.0–3.0 | A hard cut and a **push into one app icon** (Clock) until it fills the frame. The neighbouring icons blur because the camera is "inside" the screen. | **Dive into the UI element that matters**, with depth-of-field blur on its neighbours. |
| 3.0–5.0 | The Clock icon **morphs into a widget**, then the camera pulls back to the whole phone. | **Morph one UI element into the next state** instead of cutting. |
| 5.5–9.5 | Widgets **lift out of the screen in 3D**, tilted about 30°, then stack and fan. | **Lift a card out of the phone into 3D space** to give it focus. |
| 10–12.5 | Coloured gradient stage; hard cuts land on the beat. | Cut on the beat; each cut changes the scale. |
| 12.5–14.5 | A full-bleed screen close-up at a slight angle, with a picture-in-picture video sliding in. | Close-ups of real UI, never mock blocks. |
| 18–20 | Widgets shown over a full-bleed photo, then the phone pulls back. | Zoom in, then out (a breathing rhythm). |
| 22–24 | Several home-screen pages shown as **floating panels in an isometric fan**. | Fan out several screens in space to show breadth. |
| 24–27 | A slow pan across one widget as it expands from small to medium to large. | One element in focus, the rest out of frame. |
| 30–35 | A row of phones, each a different screen, cutting on the beat. | Variety with a stable frame. |
| 35–37 | "iOS 14" end title: thin type centred on a gradient. | End on short type and a long hold. |

### Ref B: banking motion film (`Best-Motion-Graphics…mp4`, 44 s, 25 fps)

| t | What happens | Principle we take |
|---|---|---|
| 0–4 | A **wall of blurred UI cards** with a centred headline ("Banking has always looked the same") revealed left to right. | Headline over a blurred wall of the app's own UI. |
| 4.5–6.5 | The app icon pops in, then the wordmark types in letter by letter in two colours. | **The icon as a character.** Type that reveals rather than fades. |
| 6.5–9.5 | A **frameless phone screen** at the right third, with a headline at left typing in ("Armenia's first truly customizable banking app"). | **Phone on one third, headline on the other.** The headline types in, about 40 cps, with a coloured last word. |
| 9.5–13.5 | An **isometric wall of a dozen phones** in light and dark, drifting diagonally; the camera then pushes in on one. | **The phone wall**, as proof of breadth, followed by a push-in to a hero screen. |
| 14–18 | A **tap dot** (a black circle) presses "Configure Home Page", then items are dragged and reordered while a lifted row casts a shadow. | **Show the touch.** A dot or fingertip presses, then the UI reacts with real states. |
| 18.5–23 | A dark phone at a 3D angle (about 35° yaw) over glossy abstract light. | Dramatic 3D tilt for the dark-mode moment. |
| 23–27 | Floating UI fragments (avatars, chat bubbles, cards) orbit around the headline "Because you and your comfort come first". | **UI fragments as a frame around the copy.** |
| 26–27 | A light/dark toggle, after which the whole screen changes theme. | One control changes everything (we use this for the oath signing). |
| 27.5–30 | A tilted card screen reveals its numbers in a sweep. | Money reads best large, tilted, with a counter. |
| 30–32 | A frameless screen and a single word at right ("Sleek", "Intuitive", "Enjoyable"), swapped on each beat. | **Single-word beat captions.** |
| 32.5–37.5 | The brand line types in, then a 3 × 3 grid of screens with people's avatars popping in. | Community proof: faces on the UI. |
| 37.5–40 | An App Store "Get" card; the **tap dot presses Get**, the button turns into a progress ring, then the logo builds. | **End on the install action itself.** |

### What we deliberately don't take

Their calm corporate tone, pastel gradients, thin type and stock faces. KEPT stays dark (#0E0E0E or #131313), lime, heavy Geist, with the Keeper's attitude.

## 3 · The film: "Keep your word." (about 86 s, 137.14 BPM, 1 bar = 1.75 s)

Each chapter opens with a mono eyebrow ("01 · SWEAR AN OATH") and a heavy headline set beside the phone. The Keeper hosts from outside the phone: he leans on it, pokes it and judges it. Inside the phone he talks through the app's own KeeperNotes. Taps are shown as a soft white touch dot, Android style.

| # | Time | Bars | Chapter | In the phone (real screens, real motion) | Outside the phone (camera, type, Keeper) |
|---|---|---|---|---|---|
| 1 | 0:00–0:05.25 | 0–3 | **Hook** | Lock screen (M1). KEPT notifications drop in one by one: "Iron Week: 2 hours to midnight." · "Riya nudged you. Your move." · "Dev wants your vote on a photo." | A small phone on a black stage, then a slow push. The Keeper rises behind the phone and leans on its top edge. Headline: *Every habit app lets you quit.* then *This one doesn't.* |
| 2 | 0:05.25–0:08.75 | 3–5 | **Reveal** (drop 1) | A tap on the notification dives into the splash (A0: tile pop, check draw, "KEPT") and then A1 "Bet your friends you'll do it." | A dive into the screen (Ref A, 1–3 s), then pull back. The Keeper in A1's spotlight. |
| 3 | 0:08.75–0:14 | 5–8 | **Sign in** | A2 Connect wallet: tap Seeker Wallet, then the sign ring (A2·s), then "Seeker verified." with the Genesis chip (A3), then A4/I9 avatar builder with shuffle ×3 and quips | Phone on the right third, headline at left: *Your Seeker is your login.* |
| 4 | 0:14–0:28 | 8–16 | **01 · Swear an Oath** | C1 typing "lift for 20 minutes", then C2 Dumbbell, C3 "7 days", C4 Group with 1,000 stake and "First miss costs 143 SKR", C6 contract, Sign & stake, the C7 ring, C7·ok "Sworn.", then C8 invite with the QR and seats filling (Riya, Arjun, Dev) | The C6 rules card **lifts out of the phone in 3D** (Ref A, 5.5 s). Headlines: *Pick a habit.* · *Put SKR on it.* · *Bring your people.* |
| 5 | 0:28–0:31.5 | 16–18 | **02 · Every day counts** | B1 Today deck: the reset clock ticks, the deck swipes, the "Riya kept" float pops in, the HP bar fills, then a tap on "Take photo" | Phone at a 3D yaw, turning toward camera. |
| 6 | 0:31.5–0:42 | 18–24 | **03 · Prove it** | F1 camera, challenge "Dumbbell + open palm", shutter, then F2 "Hold still. I'm judging." The first try fails (F2a, "Couldn't see an open palm" with a shake, Keeper: "Close. Two fingers, like you mean it."). The retry passes, then F3 "Photo 1 is in.", then photo 2 with a new gesture, then F5 "Day 3 kept." (coin burst, day strip) | Push-in on the camera frame. Headline: *Two photos a day. A random gesture. AI checks every one.* The Keeper holds the magnifying glass. |
| 7 | 0:42–0:54.25 | 24–31 | **04 · Miss a day, pay your friends** (drop 2 at 0:45.5) | D2 Iron Week: Arjun's day-3 cell goes ✕ red, HP 100 → 80 (the real damage animation). Then B5 recap "Arjun blinked. You didn't." with +43 SKR, then L1 "Iron Week, kept." with 1,107 counting up, then J1 claim and "Claimed." | **Signature moment:** the Keeper swings his scythe across Arjun's row. The SKR **bursts out of the phone** as coins that arc back into the You, Riya and Dev rows. Headline: *Miss a day? Your friends split it.* |
| 8 | 0:54.25–1:06.5 | 31–38 | **05 · Bounties** | H1 feed: the hero card "Northbound Run Club · 120,000 SKR · 7 days · free", then the hscroller scrolls. Then H2 detail and "Join free", H3 "Nine down already." with the elimination list, and H5 "27 survived. You're one of them." with +296 | The bounty cards **fan out of the phone** (Ref A, 22 s). Headline: *Bounties. Free to join. Miss once, you're out. Survivors split the pool.* |
| 9 | 1:06.5–1:15.25 | 38–43 | **06 · Your word, on the record** | I1 profile: the kept-rate ring sweeps to 91%, streak 12, the Keeper's "I call you The Early Bird." | The ring **lifts out of the phone**. Then the **phone wall** (Ref B, 9.5 s): about 15 real screens (I2 Riya 94%, W1 wallet, N1 inbox, R1 rematch, D5 history, K2 fund pool, W3 swap, and others) drifting at an isometric angle. Headline: *Your kept rate is public.* |
| 10 | 1:15.25–1:25.75 | 43–49 | **CTA** | — | Black stage. The Keeper centred and leaning on the KEPT lockup. *Keep your word. Or pay your friends.* lands word by word. A dApp-Store-style card (KEPT icon, "Bet on your habits. Friends collect.") whose **"Get" the Keeper's glove presses** (Ref B, 37.5 s), then the plate "Seeker dApp Store · Oct 16 · kept.app". It holds still for 4 s; he gives a watching-you gesture and a wink. |

### VO (the Keeper; placeholder TTS until ElevenLabs)

The VO is sparse, so the UI can breathe. Every line is also on screen, as a headline or a bubble.

| ID | At | Line |
|---|---|---|
| V01 | 0:00.4 | "Every habit app lets you quit." |
| V02 | 0:03.0 | "This one bills you." |
| V03 | 0:06.0 | "Welcome to KEPT." |
| V04 | 0:15.0 | "Pick a habit. Put money on it." |
| V05 | 0:22.0 | "Then sign it. Like a contract." |
| V06 | 0:25.6 | "And bring witnesses." |
| V07 | 0:33.0 | "Two photos a day. Random gesture. I check every one." |
| V08 | 0:44.0 | "Miss a day…" |
| V09 | 0:46.2 | "…and your friends split your stake." |
| V10 | 0:50.6 | "Honestly? I love this part." |
| V11 | 0:55.5 | "Bounties. Free to join. Miss once, you're out." |
| V12 | 1:02.0 | "Last ones standing split the pool." |
| V13 | 1:08.0 | "Your kept rate is public. Make it worth reading." |
| V14 | 1:16.5 | "Keep your word. Or pay your friends." |
| V15 | 1:20.5 | "KEPT. On Seeker. October sixteenth." |

## 4 · Craft rules (from the references, applied to KEPT)

1. **Real UI at real speed.** Screens are rebuilt from `frontend/src/components` and `metrics.ts` at 390 × 844 dp, and play the app's own choreography: blocks enter at 40 + 65·i ms; pop, count-up and HP damage follow `motion.md`. Nothing is sped up.
2. **One focus at a time.** When a card lifts out of the phone, the phone dims to about 45% and blurs slightly.
3. **The camera always moves, slowly.** A constant 2–4% drift or push. Big moves (dives, pull-backs, tilts) are eased in and out over 0.6–0.9 s and land on bar lines.
4. **Show the touch.** A soft white dot with a 90 ms press scale (`metrics.press`) and a ripple; the UI responds on the same frame.
5. **Phone on a third, type on the other.** Headlines are Geist 800, −3.5% tracking, 64–92 px, with a lime-marked key word, revealed word by word. Eyebrows are Geist Mono 600, uppercase.
6. **Dark stage.** #0E0E0E with lime edge glow and grain. Cream only on the reveal.
7. **The Keeper is never idle**, and is placed at the phone's edge so he never covers the UI being shown.

## 5 · Build approach

- `video/src/app/`: a web port of the frontend's component library (theme tokens, metrics, Surface, Tile, Chip, Button, OathCard, HPPanel, DayMemberGrid, Breakdown, Rows, SeatSlots, ProofCamera, SignStatus, MoneyMoment, KeeperNote, Header, NavBar, TabBar, Ambient, BountyCover, ProfileCard, KeptRateRing), keeping the RN style values. Motion is driven by a **screen clock** (ms since the screen mounted), so the app's animations are deterministic per frame.
- `video/src/app/screens/`: each film screen is a pure function of `(ms, state)`, built from those components and checked against the screenshot of the same ID.
- `video/src/phone/`: the phone body (a Seeker-style Android: thin bezel, punch-hole, side keys), status bar, gesture bar, the touch dot, the screen navigator (push, replace and sheet transitions) and a 3D stage (CSS perspective) for tilts, lifts and the phone wall.
- `video/src/film2/`: chapters, camera, headlines and Keeper performance.
- Formats: the **16:9 master** first. 9:16 (phone fills the frame, headlines above) and 1:1 follow from the same chapters once this cut is approved.
- Audio: Kokoro placeholder VO (to be replaced by ElevenLabs, re-timed with `align_vo.py`); the scratch bed extended to 49 bars (drops at 0:05.25 and 0:45.5); SFX for taps, shutter, scan, sign, coins and the Get press.

## 6 · Where things live and how to re-render

| What | Where |
|---|---|
| App UI port (RN → web, frame-clocked motion) | `video/src/app/` (`rn.tsx` shim, `motion.tsx` primitives, `kit/*` components, `Screen.tsx` frame) |
| The ~40 film screens | `video/src/app/screens/` (`registry.tsx` lists them by design ID) |
| Fidelity check against the real app | `ScreenQA` composition: our screen beside `screenshots/` at the same size |
| Phone, navigation, touch dot | `video/src/phone/` |
| Chapters, camera, headlines, the Keeper's acting | `video/src/film2/` (`timeline.ts` holds chapter times and VO placements) |
| VO script (placeholder TTS) | `video/scripts/vo/script2.json` → `audio/vo/V01…V15.wav` + `video/src/data/vo2.json` |
| Scratch music | `video/scripts/audio/make_scratch.py › bed_launch` (drops 0:05.25 and 0:45.5) |

- **Swap in ElevenLabs:** put `V01.wav … V15.wav` (or .mp3) in `audio/vo/`, run `VO_SCRIPT=script2.json VO_MAP=vo2.json ~/.cache/kept/tts/bin/python video/scripts/vo/align_vo.py`, then `npm run sync`. Bubbles and the Keeper's speech beats re-time automatically.
- **Swap in licensed music:** drop `audio/track.mp3`, then run `npm run sync`. `Sound.tsx` prefers it over the scratch bed. Its drops need to land at 0:05.25 and 0:45.5, or the times need shifting in `timeline.ts`.
- **Render:** `node scripts/render.mjs Launch-16x9 ../renders/draft/KEPT_launch_v2_16x9_1080p60.mp4`
