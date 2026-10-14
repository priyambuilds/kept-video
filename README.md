# KEPT UI for the launch video

KEPT is a React Native app (Expo, Android). Remotion renders React for the web, so these files are the
source for **rebuilding the UI as web components**, not code to import as is.

## What's here

| Folder | Use it for |
|---|---|
| `design/reference/` | The HTML prototype (`kept-kit.js`, `kept-screens-*.js`, `Keeper.dc.html`, `KEPT Logo.dc.html`). Already web code: the closest thing to Remotion-ready UI. |
| `design/tokens.json`, `DESIGN.md`, `components.md` | Colours, type, spacing, radii, shadows, gradients; every component and its states. |
| `design/screens.md`, `flows.md` | Every screen (A0–W4) and how they connect: for the story. |
| `design/motion.md` | Real timings and easings (splash, pops, count-ups, the Keeper). |
| `design/copy.json`, `frontend/src/copy/` | All the text (`additions.json` holds what the app added). |
| `design/assets/` | Brand, Keeper, gesture, object and money art. |
| `frontend/src/theme/` | Exact values as the app uses them. `supplement.ts › amend`: tertiary text is `#808080`, not the token's `#6A6A6A`. |
| `frontend/src/components/` | How each piece really looks and moves in the app: `primitives/` (Text, Icon, Surface, CheckK, motion), `content/` (OathCard, Today's card stack `Deck.tsx`, HP bar, rows, camera frame), `chrome/` (header, tab bar), `actions/` (Button, Shine). |
| `frontend/src/components/keeper/rig.ts` | The Keeper mascot's poses and animations as a pure function of time. Port it to SVG and drive it with `useCurrentFrame()`. `KeeperSkia.tsx` shows how the app draws it. |
| `frontend/assets/fonts/` | Geist (400–900), Geist Mono (500, 600), and the app's icon font `kept-icons.ttf` (glyph codes in `frontend/src/components/primitives/icons.gen.json`, MaterialCommunityIcons names). |
| `frontend/assets/brand/` | App icon. |
| `screenshots/` | The real app on an Android emulator (1080 × 2400). `all-screens-oct10/`: every screen from 10 Oct; Today's card stack and the Join screen have changed since. `today-stack/`: Today's stack as it is now (dots only, every card the same height; 2, 5 and 8 cards, 1.3× font, 360 dp wide). `join/`: Join as it is now (choose Scan or Enter code first). |

## Not included on purpose

Backend, on-chain program, API and wallet code, money logic, Android build files, `node_modules`, and
any secrets (`.env`, keystores).
