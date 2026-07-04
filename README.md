# Ghar Design Studio

A web app that helps a Hindi/Hinglish-speaking family generate high-quality prompts
for **Google AI Studio (Gemini "Nano Banana" image generation)** to design their home
interior, room by room — plus a **live 3D preview** of each room that reacts to the
chosen wall colour and lighting.

It does **not** generate images itself — it builds the exact prompt text, which the
user copies into AI Studio (free, no API key). It also exports a Markdown "design
package" for contractors.

## Stack

Migrated from a static vanilla-JS app to:

- **Vite + React + TypeScript**
- **Tailwind CSS** (design tokens in `tailwind.config.js`)
- **Framer Motion** — view transitions, chip/tab springs, toasts
- **Three.js** via **@react-three/fiber** + **@react-three/drei** — the 3D preview
- **Zustand** — state, persisted to `localStorage` (key `ghar_state_v3`)

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc + vite build -> dist/
npm run preview    # serve the production build
npm run typecheck  # tsc, no emit
```

## Deploy (Vercel / Netlify)

The app builds to static files in `dist/` with `base: '/'`. Config for both hosts is
included:

- **Vercel** — `vercel.json` (build command, output dir, SPA rewrite). Import the repo
  in Vercel; defaults are picked up automatically.
- **Netlify** — `netlify.toml` (build command, publish dir, SPA redirect).

## Structure

```
src/
  main.tsx, App.tsx        app shell + nav + view transitions + save/load
  types.ts                 State / Room / Bible types
  data/tables.ts           VIBES, COLORS, LIGHTS, AVOIDS, REQS, DEFAULTS, constants
  lib/prompt.ts            PURE prompt-assembly (bibleEnglish / buildFresh / buildEdit / buildExportDoc)
  lib/color.ts             parseColor
  lib/size.ts              parse metric/feet dimensions from a room's `size` string
  store.ts                 Zustand store, localStorage persistence + backfill
  components/              StyleView, RoomsView, WorkView, ExportView, Preview3DView, ui, Nav, ErrorBoundary
  three/RoomPreview.tsx    R3F canvas — room box, live walls + lighting
legacy/                    original app.js / index.html / styles.css (reference)
```

## The 3D preview

Per-room box built from the parsed metric dimensions in each room's `size`. Walls are
painted from `bible.wall` (neutral if unset); lighting intensity + colour temperature
come from `bible.light` (~4000K bright / ~3000K soft / dim cozy). No furniture — it's a
mock model to judge colour and light. Rooms with no size (balconies) fall back to a
default box with a note. The 3D chunk is lazy-loaded (Three.js stays out of the initial
bundle) and wrapped in an error boundary so devices without WebGL degrade gracefully.

## Constraints (kept from the original)

1. **No API keys in client code** — the "auto-extract measurements" feature routes
   through AI Studio (paste a prompt, paste JSON back).
2. **Language split** — all UI guidance text in **Hinglish**; every CTA in clean English.
3. **Plain-language in, design-English out** — parents pick simple options; the
   translation tables map them to interior-design English.
4. **Mobile-first** — fixed bottom tab bar, big tap targets, 16px inputs (no iOS
   focus-zoom).
