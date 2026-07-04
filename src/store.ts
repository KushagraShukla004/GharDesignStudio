import { create } from "zustand";
import type { State } from "./types";
import { CAMERA, DEFAULTS } from "./data/tables";

const KEY = "ghar_state_v3";
const SAVE_HINT = "Aapka kaam apne aap save hota hai is browser mein.";

/* ---------- safe storage (localStorage with in-memory fallback) ---------- */
const mem: Record<string, string> = {};
const storage = {
  get(k: string): string | null {
    try {
      return localStorage.getItem(k);
    } catch {
      return mem[k] ?? null;
    }
  },
  set(k: string, v: string) {
    try {
      localStorage.setItem(k, v);
    } catch {
      mem[k] = v;
    }
  },
};

/* ---------- non-destructive backfill (mirrors legacy initAll) ---------- */
export function normalize(raw: State): State {
  const s: State = raw;
  if (!s.camera) s.camera = CAMERA;
  if (!s.aspect) s.aspect = "landscape";
  s.house = s.house || { ...DEFAULTS.house };
  if (s.house.area === undefined) s.house.area = "";
  if (s.house.plan === undefined) s.house.plan = "";
  s.bible = s.bible || { ...DEFAULTS.bible };
  if (s.bible.wall === undefined) s.bible.wall = "";
  if (s.bible.floor === undefined) s.bible.floor = "";
  s.bible.colors = s.bible.colors || [];
  s.bible.avoid = s.bible.avoid || [];
  s.bible.customColors = s.bible.customColors || [];
  s.bible.customAvoid = s.bible.customAvoid || [];
  s.bible.customLights = s.bible.customLights || [];
  s.customReqs = s.customReqs || [];
  s.rooms = s.rooms || [];
  s.rooms.forEach((r) => {
    r.reqs = r.reqs || [];
    r.refs = r.refs || [];
    r.log = r.log || [];
  });
  return s;
}

function loadInitial(): State {
  const rawStr = storage.get(KEY);
  if (rawStr) {
    try {
      return normalize(JSON.parse(rawStr) as State);
    } catch {
      /* fall through */
    }
  }
  return normalize(structuredClone(DEFAULTS));
}

interface Store {
  s: State;
  saveStatus: string;
  /** Deep-clone the state, apply the recipe, persist, and pulse the save status. */
  mutate: (recipe: (draft: State) => void) => void;
  /** Replace the whole state (Load from file). */
  replaceState: (next: State) => void;
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;

export const useStore = create<Store>((set, get) => ({
  s: loadInitial(),
  saveStatus: SAVE_HINT,
  mutate: (recipe) => {
    const draft = structuredClone(get().s);
    recipe(draft);
    storage.set(KEY, JSON.stringify(draft));
    set({ s: draft, saveStatus: "Saved." });
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => set({ saveStatus: SAVE_HINT }), 1400);
  },
  replaceState: (next) => {
    const normalized = normalize(next);
    storage.set(KEY, JSON.stringify(normalized));
    set({ s: normalized, saveStatus: "Saved." });
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => set({ saveStatus: SAVE_HINT }), 1400);
  },
}));

/** Stable unique key generator for custom options (mirrors legacy newKey). */
let keyCounter = 0;
export function newKey(prefix: string): string {
  keyCounter += 1;
  return `${prefix}_${Date.now().toString(36)}_${keyCounter.toString(36)}`;
}
