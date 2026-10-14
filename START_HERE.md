# KEPT launch teaser — START HERE

## Folder map

| Path | What | Who |
|---|---|---|
| `KEPT_TRAILER_BRIEF.md` | The full brief: the Keeper bible, script, music, phases | ✅ done |
| `frontend/` | React Native app source: theme, components, **Keeper rig** (`src/components/keeper/rig.ts`), fonts | ✅ done |
| `design/` | Tokens, `DESIGN.md`, `components.md`, `motion.md`, `screens.md`, `copy.json`, assets (brand, Keeper, objects, gestures, SKR coin, icons), web prototype in `reference/` | ✅ done |
| `screenshots/` | The real app on Android | ✅ done |
| `references/` | `01-apple-ios.mp4`, `02-banking-app.mp4` | ☐ **you** |
| `audio/music-refs/` | Your 3 taste MP3s (analysis only) | ☐ **you** |
| `audio/vo/` | The Keeper VO, `L01.wav`–`L12.wav` (lines in `audio/vo/README.md`) | ☐ **you** (can come later) |
| `audio/track.mp3` | The licensed final music | ☐ **you**, after recon |
| `audio/sfx/` | Sound effects | ☐ **you**, after recon |
| `docs/` | `RECON.md`, `MUSIC_BRIEF.md`, `SFX_LIST.md`, `SHOTLIST.md` | 🤖 Claude Code |
| `video/` | The Remotion project | 🤖 Claude Code |
| `renders/` | Stills, animatic, drafts, finals | 🤖 Claude Code |

 
## Prompt for Claude Code

```text
Read START_HERE.md and KEPT_TRAILER_BRIEF.md fully before doing anything. Also read README.md and design/README.md. Together they're the brief for KEPT's launch teaser: UI and motion graphics only, HOSTED AND NARRATED BY THE KEEPER, our mascot. It must work muted.

Where things are (this repo):
- App source (React Native/Expo): ./frontend. Rebuild the pieces as web React for Remotion; don't import RN. Exact values are in frontend/src/theme (note supplement.ts › amend). Fonts are in frontend/assets/fonts.
- The Keeper: port frontend/src/components/keeper/rig.ts to SVG and drive it with useCurrentFrame(). Art is in design/assets/keeper. Never redraw him off-model.
- Design system: ./design (tokens.json, DESIGN.md, components.md, motion.md for real timings and easings, screens.md, flows.md, copy.json, rules.md, assets/). The web prototype in design/reference is the closest to Remotion-ready UI.
- Ground truth: ./screenshots (today-stack/ and join/ are the newest).
- References: ./references/01-apple-ios.mp4 and 02-banking-app.mp4. CRAFT ONLY (brief §4a): borrow principles, then about 80% your own ideas.
- Music taste: ./audio/music-refs/*.mp3. ANALYSIS ONLY; these are copyrighted and must never be in a render.
- VO: ./audio/vo/L01–L12.wav (if missing, use silent placeholders at 2.5 words/s and tell me).
- Final music: ./audio/track.mp3 and SFX in ./audio/sfx/ (I add these after your music brief).

Write your docs to ./docs, the Remotion project to ./video, and every render to ./renders.

Work through the phases in brief §12 and STOP for my approval after each one:
1. Recon → docs/RECON.md, docs/MUSIC_BRIEF.md, docs/SFX_LIST.md: what you'll reuse from the frontend and design; every Keeper pose and animation in rig.ts, plus the gaps the script needs; the reference breakdown turned into principles, plus at least 3 original KEPT-only transition ideas; the music analysis, target spec, your own twists, a cue sheet, stock keywords, an AI-music prompt with no artist names, and a producer brief; the SFX list.
2. Shot list → docs/SHOTLIST.md: beat-by-beat for the 28s cut, then the 15s cut.
3. Animatic: rough 720p in renders/, to check timing and comedy only.
4. Build in ./video (Remotion): one scene library, 3 formats (16:9, 9:16, 1:1) × 2 lengths, each laid out natively.
5. Stills plus a mute test (contact sheet in renders/).
6. Fit the music once I add track.mp3: drops at 0:07 and 0:17.5, duck under the VO, add SFX, master to about -14 LUFS / -1 dBTP. Render a 720p draft and wait for feedback.
7. Final: all 6 versions at 1080p60 in renders/final/, plus video/README.md.

Non-negotiables: the Keeper is never idle and drives the transitions; no lip-sync; the message lands in the first 3s; one promise and one CTA held for at least 3s; the signature moment (scythe through Alex's stake, coins to friends) gets the most polish in visuals and sound; dark, bassy, adrenaline music, never generic; no copyrighted reference audio in any render; ask instead of guessing.
```
