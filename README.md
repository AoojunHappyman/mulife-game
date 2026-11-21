# MAHIDOL LIFE · V0.1

A playable, desktop-first university-life RPG. All sprites and campus art are original procedural pixel art; no assets from reference games are used. The campus is fictionalized, not a geographic reconstruction or official university product.

## Run locally

Requires Node.js 22.18+ (tested with Node 24).

```sh
npm install
npm run dev
```

Open the localhost URL printed by Vite. `npm run build` performs strict TypeScript checks and creates `dist/`. `npm run preview` serves that production build. `npm test` runs the quest, persistence, academic-unit and map-reachability tests.

## Play

Create a student, select one of six academic units, customize appearance and begin. Move north from the entrance to meet Ploy at the central plaza. Press **E** to receive your faculty quest, find the package west of the plaza beside the garden pond, and return to Ploy. Completion grants 100 coins and level 2 exactly once. Meet two other students near the café.

- **WASD / arrow keys:** walk
- **Shift:** run
- **E:** interact / dismiss dialogue
- **Esc:** pause / close dialogue
- Save icon: save immediately; automatic saves occur every 15 seconds, on quest progress and when leaving the page.

The main menu has New Game, Continue, audio settings and credits. New-game confirmation protects an existing save. Saves are local to the same browser and origin (including port). Invalid saves are ignored safely. Audio starts after a user gesture. Appearance layout is responsive; campus play requires a keyboard in V0.1.

## Architecture / replacement points

- `src/data.ts`: official academic-unit data separate from fictional faculty RPG metadata; character schema and quest state machine.
- `src/store.ts`: Zustand application state, game lifecycle and rewards.
- `src/persistence.ts`: `PersistenceService` boundary with validated localStorage adapter. Implement this interface to introduce a remote provider later; no Supabase backend is included.
- `src/game/sprites.ts`: eight independent sprite layers. Each layer uses 32×48 frames, four directions (down, left, right, up), nine frames per direction: idle 0, walk 1–4, run 5–8. Common foot anchor, timing and frame index keep layers synchronized. Textures are cached per relevant layer properties, never per full-character combination. Replace `makeLayer` with asset loading to integrate production sprite sheets.
- `src/game/map.ts`: standard orthogonal Tiled JSON builder, 48×36 tiles of 32px, Ground and Collisions layers. Replace `tiledMap()` with an exported Tiled map using the same tileset/layer names. CampusScene currently draws decoration from the companion object data.
- `src/game/CampusScene.ts`: Phaser 3 Arcade Physics, feet colliders, camera following, depth ordering, proximity interactions and NPCs.
- `src/game/GameCanvas.tsx`: isolated Phaser lifecycles for world and live character preview.
- `src/audio.ts`: original synthesized ambient notes and interaction chimes.
- `src/main.tsx`, `src/styles.css`: React UI, Tailwind integration and responsive visual design.

## Scope

The supplied brief ends at “W — Move”. Standard WASD/arrows, running, NPC dialogue, one three-step introductory quest per faculty, a backpack summary and local progression were added to make a complete first-session loop. Skills are identity metadata for future gameplay; there is no combat, course schedule, backend, login or full faculty storyline. Body/skin/hair/color/eye/outfit options are 2/6/5/6/3/3. Map art and sprite layers are replaceable V0.1 assets.

Official academic-unit naming reference: [Mahidol University International Relations — Quick Facts](https://op.mahidol.ac.th/ir/). Siriraj and Ramathibodi remain separate units. RPG identities, outfit labels and quests are fictional.

Fonts use Google Fonts (DM Sans, Outfit, Noto Sans Thai) with local system fallbacks; the game itself does not depend on a network connection after loading.
