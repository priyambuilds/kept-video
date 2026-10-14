# KEPT launch film, v3 plan: "Who's your Arjun?"

**Status:** this replaces v2 (`LAUNCH_FILM_PLAN.md`) after owner feedback on 11 Oct. The rebuilt app UI (`video/src/app`), the phone and the Keeper rig carry over. The story, the camera, the Keeper's acting, the captions, the script and the music are new.

---

## 0 · Feedback → diagnosis → fix

| # | Feedback | Root cause | Fix in v3 |
|---|---|---|---|
| 1 | "The 15 s teaser intro was good" | – | **v3 opens on the teaser's intro**: "You tapped *done*… from bed." → record stop → slap → drop → logo, "So I made it **cost** something." We reuse the same scene code, re-timed to the new song. |
| 2 | 0:26: the rules card goes back to the phone, vanishes before it lands, and the screen behind it is empty | `Lift` unmounted at `b1`, but `TermsC6` hid the rules until the screen ended, so the card vanished early and left a hole | The card flies back **all the way into its slot** (it ends exactly over its own rect). The on-screen rules are hidden **only while the card is out**, so the hand-off is pixel-identical. Added a QA still at the hand-off frame. |
| 3 | 0:47: show "−SKR from Arjun" next to the + pills | Only gains were shown | A red **A −143 SKR** pill comes off Arjun's phone first, then the coins, then **+43 ×3** arrive at the other phones, then the 14 SKR fee. The loss is shown where it happens. |
| 4 | 0:52: the Keeper's line sits behind the phone | A speech bubble placed in 3D space | **No more speech bubbles outside the phone.** Every spoken line becomes a subtitle (row 6). |
| 5 | 0:07: the Keeper's bubble is cut off | Same as 4 | Same as 4. |
| 6 | "Animate his sentences as subtitles at the bottom" | – | **Keeper subtitles**: bottom-centre, one line, Geist 600 on a soft dark plate, with a small Keeper bust as the speaker tag. Words appear in time with the voice; key words go lime, money lost goes red. Subtitles always sit **above every 3D layer**, so nothing can cover them. The app's own in-phone KeeperNotes stay, because they're real UI. |
| 7 | "Bring witnesses" is too short; rename to "Bring your friends" | 1.4 s inside a feature run | It becomes a **14 s act of its own**, "Bring your friends", and it's the heart of the film (§2, act 3). |
| 8 | The social side doesn't land | Friends only appeared as rows and seat avatars on *your* phone | **Friends get their own phones.** Riya, Arjun and Dev each have a phone with a name tag. We watch them get the invite, read it, join and stake. Their avatars fly into your seats, the pot grows 1,000 → 4,000, they keep their days, they nudge Arjun, vote on Dev's photo, and get paid by Arjun's miss. Every social mechanic is shown happening **between** phones. |
| 9 | "A list of features, not a journey"; "too much info" | Seven chaptered features, headline plus sub on every screen, mono eyebrows "01 · …" | **One story, one week, four friends.** Acts are marked only by in-world time cards ("MON · 6:58 AM · DAY 1"). Headlines drop from 25 to about 6 short ones, with **no sub-lines**. At most one text element outside the phone at a time. |
| 10 | "Tell and show little" → show, don't tell | VO and headlines explained the rules | The voiceover is the Keeper's **commentary**, never instructions. Mechanics are understood by watching: coins leave Arjun's phone and land in the others'; a photo fails and the retry passes; votes come in from friends' phones. |
| 11 | Camera: more zoom, angles, positions and transitions | v2 kept the phone at the right third, 0.9–1.1× | **A shot list with 9 shot types** (§3): extreme close-ups of single UI elements (2.4–3.2×), low and high angles, a top-down "table", a dutch angle on the miss, a four-phone dolly, whip-pans between friends' phones, push-through match cuts, frameless full-bleed UI, and over-the-shoulder Keeper shots with depth of field. |
| 12 | The mascot should move more, with body animation, wit and humour | Mostly a static stand plus a hand track | **A Keeper acting layer** (§4): he glides and hops along arcs with squash and stretch, his robe sways with velocity, he anticipates and follows through, and he looks where things happen. **Reaction close-ups** cut to his face for the jokes, sitcom style. New gags use only on-model props and anims: coffee at 6:58 AM, the seal stamp on signing, the magnifying lens and a dead stare on the cheat, a coin flip while waiting on Arjun, the shades and jump payday dance, a mowing scythe on the Bounty crowd, and a whisper to camera for the CTA. |
| 13 | The ending doesn't compel or connect | The ending was product information plus a store card | The ending turns the story onto the viewer: **"So. Who's your Arjun?"** Everyone has that friend, and inviting them is the call to action. Then the tagline, the store card and the Get press, with a wink. |
| 14 | The script and VO need to change | – | **A new 18-line Keeper script** (§5). Lines are short, dry and in character (deadpan, loves payday, roasts excuses), and reuse his real in-app lines where they exist. Placeholder TTS until ElevenLabs. |
| 15 | The music should be a song, not a beat with bells | The scratch bed was synthesised drums plus coin and clock "bell" textures, with SFX stacked on top | **An original song generated with ACE-Step 1.5** (MIT licence, text prompt only, no reference audio loaded). It has a melodic hook, chord changes, builds and drops, and the picture is cut to its sections. **The bell textures are gone.** SFX are cut to about 15 signature moments and sit under the music (§6). |

---

## 1 · The idea

> **Four friends make a promise with money on it. One of them is Arjun.**

The viewer lives one week inside an Oath. In that week they see every core mechanic happen to people:

1. You make the Oath and sign it (stake, terms, Solana).
2. You bring your friends, and they join with their own stake.
3. Every day you prove it: photo plus random gesture, AI-checked, and cheating fails.
4. Someone misses (Arjun), and **his stake is split between everyone who kept**.
5. Friends judge borderline proof (group review).
6. Day 7: the keepers collect. The loser asks for a rematch.
7. When friends aren't enough, there are Bounties: strangers, a big free pool, last ones standing split it.
8. Your kept rate is public.

Then the ending asks the viewer to cast their own Arjun.

The Keeper is the host and bookie. He is deadpan and smug, secretly on your side, and **loves payday**. He comments; he never explains.

---

## 2 · Story, act by act (about 100 s; final times snap to the song's bars)

`B` = bar of the chosen song. Times are estimates at about 124 BPM (1 bar ≈ 1.94 s) and will be re-snapped once the take is locked (§6).

| Act | ~Time | What we see (show) | Keeper (subtitle / VO) | Camera |
|---|---|---|---|---|
| **0 · Cold open** (teaser intro) | 0:00–0:05.5 | The bland generic habit app; a cursor taps "Gym ✓ Done" from bed → freeze, record stop → he slaps the clutter into a lime point → **drop** → the check draws, KEPT slams. | "You tapped *done*… **from bed.**" / "So I made it **cost** something." | As in the teaser |
| **1 · Welcome** | 0:05.5–0:10 | The logo shrinks **into the app icon on a phone**, which pulls back. A1 "Bet your friends you'll do it." → tap **Seeker Wallet** → A3 "Seeker verified." | — (a tiny caption, "No passwords. Your Seeker is your login.") | Push through the logo into the phone (match cut), low-angle hero tilt |
| **2 · The promise** | 0:10–0:22 | C1: the goal types out (**ECU** on the text field); C2 Dumbbell; C3 7 days; C4 1,000 SKR (ECU on the stake row, money counter); C6 "Read it like a contract." The rules card **lifts out and back**. **Sign & stake** → the Keeper **stamps his seal** on the screen → "Sworn. 1,000 SKR on the table." | "Pick a habit. Put money on it." / "Sign here. I keep the receipts." | ECU slides between fields, a dutch tilt on the stake, an over-the-shoulder shot of the Keeper on the stamp |
| **3 · Bring your friends** | 0:22–0:36 | C8 invite QR, full-bleed. **Camera pulls back: three more phones slide in** (Riya, Arjun, Dev, each with a name tag). Each lights up: "Sam invited you to Iron Week." → **E2 "SAM INVITED YOU"** → tap **Join & stake 1,000 SKR** (staggered fingertips) → each friend's **avatar flies from their phone into your seat slots**. A pot counter rises 1,000 → **4,000 SKR**. The four phones line up. | "Now bring your friends." / "Same stake. Same rules." / (on Arjun) "…even Arjun." | Four-phone dolly; whip-pan phone to phone; top-down "table" at the end |
| **4 · Day 1** | 0:36–0:47 | Card: **MON · 6:58 AM · DAY 1**. Your lock screen, then the Today deck, then Take photo. F1 "Dumbbell + open palm" → the shutter fires on a fist → **fail**, shake → retry → F3 → F5 "Day 1 kept." **Friend floats pop**: "Riya kept", "Dev kept". On the phone row, three phones flip to ✓. **Arjun's phone stays dark.** | (sipping coffee) "Every day, you prove it." / (fail, close-up) "**Nice try.**" | Push into the viewfinder, a reaction cut to his face, pull back to the row |
| **5 · Arjun** | 0:47–0:53 | Card: **TUE · 11:52 PM · DAY 2**. D2: Arjun's day-2 cell is still pending; chips "Arjun 3-to-1 to miss". You tap **Nudge Arjun** → **cut to Arjun's phone**: "Sam nudged you. Your move." stacks over "Riya nudged you." and "2 hours to midnight." He never opens it. The Keeper **flips a coin**, waiting. Clock 23:59:57 … 58 … 59. | "Arjun's still on the couch." / "Three-to-one he misses." | Slow push on Arjun's lock screen, a dutch angle, the clock ECU |
| **6 · Midnight** (drop 2) | 0:53–1:03 | **00:00 → DROP.** Arjun's ✕, HP 100 → 80. **The scythe swings across Arjun's phone**; a red **−143 SKR** pill tears off it and **bursts into coins** that arc into the You, Riya and Dev phones. Each lands **+43 SKR**; the fee coin drops into the Keeper's sack (**FEE 14**). Then **smash-cut** to the Keeper close-up in **shades**, dancing (jump anim). | "Arjun pays." / "Everyone who showed up gets paid." / (giddy) "Honestly? I love this part." | A whip-down to the four phones flat on a table (top-down), shake on the hit, then a fast push-in to the shades close-up |
| **7 · Your friends are the judges** | 1:03–1:09 | Card: **WED · DAY 3**. Dev's photo failed the AI three times. Your phone: G1 "Dev wants your vote." The Keeper squints through his lens at the photo ("Looks like a palm to me. Mostly." in-app). You tap **Approve**; Riya's phone also taps Approve; G3 "**Approved 2–1.** Day 3 counts as kept." | "Blurry photo? Your friends decide." | Over-the-shoulder (the lens in the foreground, out of focus), then rack focus to the phone |
| **8 · Day 7** | 1:09–1:17 | Card: **SUN · DAY 7**. The day strip fills to 7 ✓ → L1 "Iron Week, kept." **1,107** counts up → Claim → "Claimed." Then **Arjun's phone**: R1 "Run it back?" He taps **Rematch**. The Keeper's eyebrow (smug). | "Seven for seven. Collect." / "Arjun wants a rematch." / "…of course he does." | ECU on the counter, a low-angle hero on L1, a whip to Arjun |
| **9 · Bigger table: Bounties** | 1:17–1:27 | The phone pulls back and the **frame fills with avatars: a crowd of 120**. H1 hero card "Northbound Run Club · 120,000 SKR · free". Tap Join. Days tick: **the Keeper mows across the crowd with his scythe** and avatars grey out ("Nine down already."). H5 "**27 survived.** You're one of them." +296. | "Want a bigger table?" / "Bounties. Free to join. Miss once… you're out." / "Last ones standing split the pool." | The crowd wall in isometric (Ref B), a push through the survivors to the phone |
| **10 · On record** | 1:27–1:31 | I1 profile: the kept-rate ring sweeps to **91%** and lifts out of the phone. | "Your kept rate is public. Make it worth reading." | The ring lift (Ref A) |
| **11 · Who's your Arjun?** | 1:31–1:43 | Back to the four friend avatars. Arjun's avatar shrugs. Huge type: **"Who's your Arjun?"** → the C8 invite card slides up ("Send the invite"). Then the lockup: KEPT, "Keep your word. Or pay your friends." The store card; **the Keeper presses Get**, which becomes "Oct 16". Plate: *Seeker dApp Store · October 16 · kept.app*. He leans in, whisper pose: watching-you point, then a **wink**. Held for 4 s or more. | (whisper) "So… who's your Arjun?" / "KEPT. Keep your word… or pay your friends." / "On Seeker. October sixteenth." | A slow push, then a static hold on the CTA |

### What we dropped to make room (and why)
- **Avatar builder, Inbox, Wallet, Swap, the phone wall.** They're nice to have but not part of the promise loop. The wall was the most "feature list" moment. Avatars still show up everywhere through the friends.
- **Chapter eyebrows** ("01 · SWEAR AN OATH"). They told the viewer they were watching a feature list. In-world time cards replace them.

---

## 3 · Camera language

The rules are taken from both references and pushed further.

| Shot | Use | Spec |
|---|---|---|
| **ECU** (extreme close-up) | Typing, stake, counter, HP, the clock | 2.4–3.2× on one element; the phone edge out of frame; a 2–4° drift |
| **Hero low angle** | Reveals (A1, L1, the CTA) | rx −14…−20°, slight rz, a push of 4% |
| **Top-down "table"** | The four phones, the coin split | rx 48–55°, rz −20…−30°, phones laid like cards |
| **Dutch** | Arjun at night, the miss | rz 8–12°, red stage glow |
| **Dolly** | Along the phone row | The stage translates 0.6–1.2 phone widths over 2–3 s |
| **Whip-pan** | Phone to phone (social cuts) | 0.18 s, a directional blur of 40–80 px, landing on the beat |
| **Push-through** | Logo → app icon, QR → friends | Scale through 6–10× with the next shot behind (Ref A dive) |
| **Full-bleed** | QR, the camera viewfinder | The screen fills the frame; no bezel visible |
| **Over-the-shoulder** | The Keeper stamping, judging | The Keeper at 2–3× size in the foreground, blurred 6–10 px, the phone sharp |
| **Reaction close-up** | The jokes | A Keeper bust filling 60% of the frame, a hard cut in and a hard cut out |

Pacing: big moves land on bar lines; every shot moves (at least 2% drift); no two consecutive shots share a scale and an angle.

---

## 4 · Keeper acting layer (on-model only)

All of these drive the existing rig (`rig.ts` / `KeeperSVG`). There are no new drawings.

- **Locomotion:** `glide(path)` moves him along a bezier with ease, a body lean of up to ±10° from velocity, and a robe skew of up to ±6° that lags the move (follow-through). `hop(a→b)` adds anticipation squash (0.88), stretch in the air (1.08), a landing squash and a settle.
- **Weight:** the idle breath is doubled; weight shifts every 2–3 s; a head bob on the beat during the music's drops.
- **Gaze:** his eyes track the active point of interest (a tap, a coin, a phone).
- **Reaction close-ups:** `bust` framing at 60% of frame height, with a mood switch inside a blink.
- **Gags:** the coffee *cup* at 6:58 AM; the **seal** stamp with squash on the hit; the **lens** sweep on the cheat; the coin **flip** anim while waiting on Arjun; the **scythe** swing and the crowd mow; **shades** plus the **jump** anim on payday; the **sack** catching the fee coin; **whisper** for "who's your Arjun?"; **point** and **wink** at the end.
- **Personality checks:** he roasts excuses ("from bed", "nice try", "on the couch"), never people. He gets giddy only on payday. Short lines, and silence for the beat after a joke.

---

## 5 · Script (the Keeper; placeholder TTS until ElevenLabs)

| ID | Act | Line |
|---|---|---|
| K01 | 0 | "You tapped 'done'… from bed." *(teaser L01)* |
| K02 | 0 | "So I made it cost something." *(teaser L03a; "cost" lands on the drop)* |
| K03 | 2 | "Pick a habit. Put money on it." |
| K04 | 2 | "Sign here. I keep the receipts." |
| K05 | 3 | "Now bring your friends." |
| K06 | 3 | "Same stake. Same rules." |
| K07 | 3 | "…even Arjun." |
| K08 | 4 | "Every day, you prove it." |
| K09 | 4 | "Nice try." |
| K10 | 5 | "Arjun's still on the couch. Three-to-one he misses." *(in-app line)* |
| K11 | 6 | "Arjun pays. Everyone who showed up gets paid." |
| K12 | 6 | "Honestly? I love this part." |
| K13 | 7 | "Blurry photo? Your friends decide." |
| K14 | 8 | "Seven for seven. Collect." |
| K15 | 8 | "Arjun wants a rematch. Of course he does." |
| K16 | 9 | "Want a bigger table? Bounties. Free to join. Miss once, you're out." |
| K17 | 9 | "Last ones standing split the pool." |
| K18 | 10 | "Your kept rate is public. Make it worth reading." |
| K19 | 11 | "So… who's your Arjun?" |
| K20 | 11 | "KEPT. Keep your word. Or pay your friends. On Seeker, October sixteenth." |

On-screen text outside the phone, all of it:
- the time cards
- "No passwords. Your Seeker is your login."
- "Bring your friends."
- "Who's your Arjun?"
- the tagline and the plate

---

## 6 · Music and sound

**Score:** an original song from **ACE-Step 1.5** (MIT licence; runs locally on the M5; the text prompt is written from the Music Brief's *ingredients*; no reference file is ever loaded).
- Prompt: melodic house, dark but uplifting, about 124 BPM, F minor, a plucked lead hook, warm chord progression, rolling sidechained bass, builds and drops.
- Three directions: **A** instrumental, **B** wordless vocal-chop hook, **C** a gang chant "keep your word" in the chorus. Two seeds each.
- I pick by analysis: tempo stability, clear section changes, energy curve against the story, and vocals that don't fight the voiceover. The alternates go to `renders/draft/music_options/` so you can overrule.

**Edit to picture:**
- Beat-track the take, then cut and loop **whole bars** with 10 ms crossfades so that:
  - the intro's record stop lands at "from bed"
  - drop 1 lands on "cost"
  - the breakdown sits under Arjun's night
  - drop 2 lands on midnight
  - the outro rings under the CTA hold
- The whole-mix tape stop and the 1-beat dropout from the teaser are kept.

**SFX:**
- About 15 cues, all sitting under the music: the cheap ding, the record stop, the slap, the logo hit, the seal stamp, the shutter, the fail buzz, the clock tick only for the last 3 s before midnight, the scythe, **one** coin burst (no per-coin bells), the Get press and the wink sting.
- Taps are almost inaudible (−22 dB). Whooshes go only on whip-pans.

**Mix:**
- VO is ducked −8 dB under each line (not −10), so the song stays present.
- Master to −14 LUFS, −1 dBTP.

---

## 7 · Build plan

| Step | Work | Output |
|---|---|---|
| 1 | Generate song takes, analyse them, pick one; bar map → `film3/timeline.ts` | `public/gen/music/song/*`, `music_options/` |
| 2 | New VO script (`script3.json`) → Kokoro TTS → `vo3.json` | `audio/vo/K01…K20.wav` |
| 3 | **Subtitles** component (word-synced, speaker tag); bubbles removed | `film3/Subtitles.tsx` |
| 4 | **Keeper actor layer** (glide, hop, sway, gaze, reaction close-up) | `keeper/actor.ts`, `film3/KeeperCU.tsx` |
| 5 | New screens: E2 invite preview, E2·s, G1 review, G3 approved, an Arjun lock screen, a Today with friend floats, a bounty crowd wall | `app/screens/social.tsx` |
| 6 | **Multi-phone rig**: name tags, row layouts, whip-pan, top-down table | `film3/Friends.tsx` |
| 7 | Acts 0–11 as `film3/Act*.tsx`; the teaser intro reused with re-timed beats and no bubbles | `film3/*` |
| 8 | Fixes: the rules hand-off (2), the −143 pill (3) | in the acts |
| 9 | QA stills on every act and every fix frame; a full render; loudness check | `renders/draft/KEPT_launch_v3_16x9_1080p60.mp4` |

**Swaps later:**
- **ElevenLabs:** drop `K01…K20` in `audio/vo/` and run `VO_SCRIPT=script3.json VO_MAP=vo3.json …/align_vo.py`.
- **Music:** pick another take in `film3/music.ts`.

---

## 8 · As built (11 Oct)

**Length:** 54 bars at 123.0 BPM, which is 105.4 s.

**Act times:**

| Act | Bar | Time |
|---|---|---|
| Teaser intro | 0 | 0:00 |
| Drop 1 | 2 | 0:03.9 |
| Welcome | 3.5 | 0:06.8 |
| Promise | 6 | 0:11.7 |
| Friends | 13 | 0:25.4 |
| Day 1 | 20 | 0:39.0 |
| Arjun | 25 | 0:48.8 |
| **Midnight, drop 2** | 29 | 0:56.6 |
| Review | 33 | 1:04.4 |
| Day 7 | 36 | 1:10.2 |
| Bounties | 40 | 1:18.0 |
| Kept rate | 45 | 1:27.8 |
| Who's your Arjun? | 47 | 1:31.7 |
| CTA | 50 | 1:37.6 |

**Music:**
- **Take B_23** (wordless vocal-hook direction) was cut to the bar map by `video/scripts/audio/edit_song.py`.
- The edit uses the take's own intro, groove, breakdown (Arjun's night) and drop (midnight).
- It adds three gestures: a tape-stop on "from bed", a reversed swell into drop 1, and a one-beat dropout before midnight.
- Every take, plus the edit, is in `renders/draft/music_options/` so you can choose by ear.
- Each take has its own recipe in `edit_song.py`. To switch take, add or adjust its recipe, re-run the script, and set `SONG` in `video/src/film3/music.ts`.

**Code:**

| What | Where |
|---|---|
| The film | `video/src/film3/` (`Launch3.tsx`, `Act*.tsx`, `Subtitles.tsx`, `Sound3.tsx`, `timeline.ts`) |
| New app screens | `video/src/app/screens/social.tsx` (E2, E2·s, G1, G3, Arjun's L2) |
| Keeper body acting | `video/src/keeper/actor.ts` |

**Render:** `node scripts/render.mjs Launch3-16x9 ../renders/draft/KEPT_launch_v3_16x9_1080p60.mp4`

**Swapping in ElevenLabs:**
1. Name the files `K03…K20`. `L01` and `L03a` stay the teaser's lines.
2. Run `VO_SCRIPT=script3.json VO_MAP=vo3.json ~/.cache/kept/tts/bin/python video/scripts/vo/align_vo.py`.
3. Subtitles and the Keeper's speech beats follow automatically.
