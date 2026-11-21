# V0.1 verification

Verified on 2026-11-21 using the local Vite preview and the browser UI.

- Production build: strict TypeScript and Vite passed, no build warnings.
- Automated tests: 5 passed (quest transitions, academic-unit completeness, invalid saves, persistence round-trip/corruption, traversable map objectives).
- Browser: created a character; changed ICT and Ramathibodi faculty cards; confirmed class, accent, starting item and quest updates; changed hairstyle and outfit; rotated and animated preview; checked empty nickname disables start.
- Playthrough: walked from entrance to Ploy, accepted quest, collected garden package, returned to Ploy, received level 2 and 100 coins. Walking into pond was blocked. Pond draw depth was then lowered so nearby characters remain visible.
- Persistence: reloaded the page, selected Continue, and confirmed level 2, 100 coins and completed quest restored.
- Pause and audio: pause menu opened; music slider updated from 25% to 0%.
- Responsive layout: checked desktop at 1440px and mobile at 390px. Mobile creator puts preview above forms, with no horizontal overflow. Keyboard is required for exploration.
- Screenshot: `docs/character-creator.jpg`.

The preview browser retains the completed test journey in localStorage. New Game can replace it using the explicit replace-save button; it does not affect other browsers. This is a first playable slice, with procedural placeholder art and identity-only signature skills.
