# CLAUDE.md — Ghar Design Studio

Context for Claude Code. Read this before editing.

## What this is
A web app that helps a Hindi/Hinglish-speaking family generate high-quality prompts for
**Google AI Studio (Gemini "Nano Banana" image generation)** to design their home interior,
room by room. It does NOT generate images itself — it builds the exact prompt text, which the
user copies into AI Studio (free, no API key). Output also includes a Markdown "design package"
for contractors.

- Repo: KushagraShukla004/GharDesignStudio
- Live (GitHub Pages): https://kushagrashukla004.github.io/GharDesignStudio/
- Pages serves `index.html` at repo root. If it's missing, Pages renders README.md instead.

## File layout (current)
Recently split from one file into three for cleaner structure. Still a **static, no-build** app:
- `index.html` — markup only; links `styles.css` in `<head>` and `app.js` at end of `<body>`.
- `styles.css` — all styles (design tokens in `:root`, mobile rules in the `<=760px` media query).
- `app.js` — all logic (`"use strict"`, vanilla JS, runs at end of body so the DOM exists).

No bundler, no framework, no external JS deps. Only external resource is Google Fonts (CDN).

## Current constraints (valid until the React migration below)
1. **Static, no build step.** Vanilla JS only; editable by opening the files directly.
2. **No API keys in client code** — public repo. The "auto-extract measurements" feature routes
   through AI Studio (user pastes a prompt, pastes JSON back) to avoid embedding a key.
3. **Language split:** all UI **guidance text in Hinglish** (for non-tech parents), but **every
   CTA — buttons, tabs, toasts, confirms, alerts — in clean English.** Keep this.
4. **Plain-language in, design-English out.** Parents pick simple options; the app maps them to
   proper interior-design English for the prompt. Parents never type jargon.
5. **Mobile-first.** Family mostly uses phones. Preserve the fixed bottom tab bar, big tap
   targets, and `font-size:16px` on inputs at `<=760px` (prevents iOS focus-zoom).

> NOTE: constraints 1 (and the single-/few-file shape) are **transitional**, not permanent —
> see Roadmap. Constraints 2–5 should survive the migration.

## Roadmap (planned, not built yet)
Migrate to **Vite + React + TypeScript + Tailwind + Three.js.**
Goal: build a **live 3D mock model of the house** from the measurements entered in the form,
showing **real-time changes for things chosen in the UI — wall colours and lighting (temperature
/ brightness)** — but **not** furniture/detailed objects. The 2D prompt-building workflow stays.

Migration notes for whoever does it:
- The whole `state` model, the option/translation tables, and the prompt-assembly logic port
  over cleanly. Turn `buildFresh` / `buildEdit` / `bibleEnglish` / `buildExportDoc` into **pure
  functions** (state in, string out) — they already are nearly pure.
- 3D model input is already present: each room's `size` stores **metres** alongside feet
  (e.g. `"12'0\" x 18'5\" (3.65 x 5.61 m)"`). Parse the metric pair to size room boxes.
  Rooms with empty `size` (balconies) have no dimensions — handle gracefully.
- Wall material colour <- `state.bible.colors` (COLORS/customColors carry `hex`).
  Light temperature/intensity <- `state.bible.light` (LIGHTS/customLights; presets imply ~4000K
  bright / ~3000K soft / dim cozy).
- Once on Vite, constraint 1 relaxes (build step is fine). Constraints 2–5 still hold.
  A `Path B` (API renders + gallery) could also land here behind a serverless proxy for the key.

## Audience
End users are the developer's parents: tech-comfortable but not AI/prompt-savvy, writing in
Hinglish. Every generated prompt starts with a `DESIGNER` preamble telling Gemini to interpret
casual/Hinglish notes like a professional and fill gaps tastefully.

## App structure (4 steps via top nav / mobile bottom tab bar)
1. **Style** (`#view-bible`) — Design Bible: feeling, colours, lighting, avoid-list, notes.
   Applied to every room's prompt.
2. **Rooms** (`#view-house`) — floor-plan upload + per-room facts the AI can't see
   (size, windows, sunlight, fixed constraints) + house-wide rules + area.
3. **Build a prompt** (`#view-work`) — pick a room, tap requirements, get the assembled prompt;
   a multi-line "make these changes" edit-prompt builder; reference-image instructions;
   per-room saved-prompt log.
4. **Export file** (`#view-export`) — compiles Bible + rooms + saved prompts into one Markdown doc.

## State & persistence
- Single `state` object persisted to `localStorage` key **`ghar_state_v3`**, with in-memory
  fallback (`store.get/set`) so it never throws in sandboxes.
- `Save to file` / `Load from file` export/import the whole `state` as JSON.
- **Adding fields:** backfill in `initAll()` (`state.x = state.x || []`) — non-destructive.
  **Only bump the storage key** (`_v3` -> `_v4`) to intentionally wipe saved state and reload
  `DEFAULTS`.

### state shape
```js
state = {
  bible: {
    vibe: "hotel",                 // single key into VIBES
    colors: ["cream","white",...], // keys into COLORS + customColors
    light: "soft",                 // single key into LIGHTS + customLights
    avoid: ["gloss",...],          // keys into AVOIDS + customAvoid
    notes: "",
    customColors: [{k,label,hex,en,custom:true}],
    customAvoid:  [{k,label,en,custom:true}],
    customLights: [{k,label,en,custom:true}]
  },
  house: { globals, climate, area, plan /* base64 jpeg */ },
  camera: "<camera/quality string>",
  customReqs: [{k,label,en,custom:true}],  // global, shared across rooms
  rooms: [{
    name, size, windows, sun, fixed,
    reqs: ["sofa",...],            // keys into REQS + customReqs
    free: "",                      // free Hinglish text
    refs: [{img,use}],
    log:  [{when,txt}]
  }]
}
```
`rooms` is **prefilled with the developer's actual flat** (Gurgaon, 1850 sq.ft): exact
measurements in feet + metres, 3 bedrooms, 3 toilets, 3 balconies, foyer. Keep accurate to plan.

## Option tables (the translation layer)
`VIBES, COLORS (with hex), LIGHTS, AVOIDS, REQS` = arrays of `{k,label,en}`. `label` = Hinglish
chip text; `en` = design-English injected into prompts. Add a preset by adding an entry.
Custom options live separately and are merged via `allColors()/allAvoids()/allLights()/allReqs()`
and `reqMap()` (key->en). **Use these merge helpers for output, not the base arrays.**

## Key functions (app.js)
- `renderChoiceChips(id, items, getOn, onClick, onDelete)` — generic chip renderer. Custom items
  get a `×` delete. **Labels use `createTextNode`, never innerHTML** (user input -> XSS). Keep it.
- `renderBible()` / `bibleEnglish()` — Style UI / Bible-to-English.
- `buildFresh()` — room render prompt: DESIGNER + Bible + house context + reqs + refs + LOCK + CAMERA.
- `buildEdit()` — multi-line edit prompt (each line -> one bullet), locks everything else.
- `parseColor(v)` — accepts `#aabbcc`/`aabbcc`/`#abc`/`r,g,b`/`rgb(r,g,b)`/spaced; returns `#rrggbb`
  or null. Custom-colour hex only comes from here or the native picker.
- `importJson` handler — parses AI Studio JSON (`EXTRACT_PROMPT` schema) to fill room sizes/area.
- `delCustomColor/Avoid/Light/Req(k)` — remove a custom option + clean references.
- `buildExportDoc()` — the Markdown design package. `initAll()` — boot + field backfills.

Constants: `CAMERA`, `LOCK`, `DESIGNER`, `EXTRACT_PROMPT`, `DEFAULTS`. `REQ_EN` is legacy — use `reqMap()`.

## Conventions
- After ANY JS edit, syntax-check (`node --check app.js`).
- Helpers: `$ / $$`, `esc()` trims. `renderX()` reads `state`, rebuilds DOM, calls `save()`.
- Custom requirements are global so one addition is tappable on every room.
- Clipboard copy needs HTTPS (works on Pages, not on plain `file://`).

## Deploy
Commit `index.html` + `styles.css` + `app.js` to repo root. Pages rebuilds in ~1 min.
Optional empty `.nojekyll` at root if Jekyll ever interferes.