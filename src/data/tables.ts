import type { Option, State } from "../types";

/* ---------- translation tables (plain choice -> design English) ---------- */
export const VIBES: Option[] = [
  {
    k: "simple",
    label: "Simple & saaf",
    en: "clean minimal interiors, uncluttered and calm",
  },
  {
    k: "hotel",
    label: "Hotel jaisa (premium)",
    en: "modern luxury hotel-like interiors, premium and timeless",
  },
  {
    k: "cozy",
    label: "Cozy & warm",
    en: "cozy, warm and inviting interiors with soft textures",
  },
  {
    k: "modern",
    label: "Modern",
    en: "sleek modern contemporary interiors with clean lines",
  },
  {
    k: "royal",
    label: "Royal / rich",
    en: "rich, elegant classic-luxury interiors with statement pieces",
  },
  {
    k: "trad",
    label: "Traditional Indian",
    en: "warm traditional Indian interiors with modern comfort",
  },
];

export const COLORS: Option[] = [
  { k: "cream", label: "Cream", hex: "#efe3cf", en: "cream" },
  { k: "white", label: "White", hex: "#fbfaf6", en: "warm white" },
  { k: "lgrey", label: "Light grey", hex: "#d7d3cb", en: "light grey" },
  { k: "wood", label: "Wood/brown", hex: "#6b4a2f", en: "walnut wood tones" },
  { k: "beige", label: "Beige", hex: "#d8c2a0", en: "beige" },
  { k: "blue", label: "Soft blue", hex: "#aec4d4", en: "soft muted blue" },
  { k: "green", label: "Green", hex: "#9aa886", en: "sage green" },
  { k: "wgrey", label: "Warm grey", hex: "#b3a596", en: "warm greige" },
  { k: "charcoal", label: "Charcoal", hex: "#3a3a3c", en: "charcoal grey" },
  { k: "taupe", label: "Taupe", hex: "#9c8d7d", en: "taupe" },
  { k: "terracotta", label: "Terracotta", hex: "#c06a4a", en: "terracotta" },
  { k: "mustard", label: "Mustard", hex: "#c89b3c", en: "muted mustard yellow" },
  { k: "olive", label: "Olive", hex: "#6f6f4a", en: "olive green" },
  { k: "navy", label: "Navy", hex: "#2f3e57", en: "deep navy blue" },
  { k: "teal", label: "Teal", hex: "#2f6f6a", en: "deep teal" },
  { k: "blush", label: "Blush pink", hex: "#e0b9b4", en: "dusty blush pink" },
  { k: "black", label: "Black touch", hex: "#2b2b2b", en: "black accents" },
];

export const LIGHTS: Option[] = [
  {
    k: "bright",
    label: "Bright & khula",
    en: "bright, airy, neutral white daylight (around 4000K)",
  },
  {
    k: "soft",
    label: "Soft & warm",
    en: "warm white lighting (around 3000K), soft and indirect",
  },
  { k: "cozy", label: "Cozy & dim", en: "warm, dim, layered cozy lighting" },
];

export const AVOIDS: Option[] = [
  { k: "gloss", label: "Zyada shine/gloss", en: "no glossy or shiny finishes" },
  { k: "colours", label: "Bahut colours", en: "no loud or clashing colours" },
  {
    k: "clutter",
    label: "Bhara-bhara look",
    en: "no clutter; keep surfaces clean",
  },
  { k: "dark", label: "Dark/dull kamra", en: "avoid dark, gloomy spaces" },
  {
    k: "decor",
    label: "Zyada decoration",
    en: "no heavy or unnecessary decoration",
  },
  {
    k: "pop",
    label: "Bhari false ceiling",
    en: "keep the false ceiling simple, no POP overload",
  },
];

export const REQS: Option[] = [
  { k: "sofa", label: "Sofa (baithak)", en: "a comfortable seating sofa" },
  { k: "coffee", label: "Center table", en: "a coffee / center table" },
  { k: "rug", label: "Carpet / rug", en: "a large rug" },
  { k: "storage", label: "Chhupa storage", en: "hidden storage" },
  { k: "plant", label: "Plants", en: "indoor plants" },
  { k: "softlight", label: "Soft lighting", en: "warm, soft lighting" },
  { k: "tv", label: "Simple TV area", en: "a simple TV unit, not oversized" },
  { k: "study", label: "Study corner", en: "a small study / work corner" },
  {
    k: "wardrobe",
    label: "Almari (wardrobe)",
    en: "a built-in wardrobe with hidden storage",
  },
  { k: "curtains", label: "Lambe parde", en: "floor-to-ceiling curtains" },
  { k: "dining", label: "Dining table", en: "a dining table with seating" },
  { k: "mirror", label: "Bada sheesha", en: "a large mirror" },
  { k: "pooja", label: "Pooja space", en: "a small, clean pooja space" },
];

export const CAMERA =
  "Eye-level camera, 24mm lens, photorealistic interior photography, soft natural daylight, architectural visualization, ultra realistic, no fisheye, natural proportions, high-end residential, real materials, accurate shadows.";

export const LOCK =
  "Lock the layout. Keep all walls, windows and room sizes identical. Only design finishes and furniture. Do not modify the architecture.";

export const DESIGNER =
  "You are an expert interior designer. The notes below may be casual or written in Hinglish — read them like a professional, understand the intent, and fill any gaps with tasteful choices that fit the chosen style.";

export const EXTRACT_PROMPT =
  'Read this floor plan image carefully. Find every room and its dimensions. Reply with ONLY valid JSON, no other text, in exactly this format:\n{"rooms":[{"name":"Living room","size":"12\'0\\" x 18\'5\\" (3.65 x 5.61 m)"}],"area":"Total area ... sq.ft, Carpet area ... sq.ft"}\nUse the room names exactly as printed on the plan. If a dimension is missing, leave its size as "".';

export const ASPECTS: Record<string, string> = {
  landscape:
    "OUTPUT IMAGE\nProduce a wide 16:9 widescreen landscape photograph, horizontal orientation (do not output a tall/portrait image).",
  portrait:
    "OUTPUT IMAGE\nProduce a vertical portrait photograph, 2:3 aspect ratio.",
  square: "OUTPUT IMAGE\nProduce a square photograph, 1:1 aspect ratio.",
};

/* ---------- defaults ---------- */
export const DEFAULTS: State = {
  bible: {
    vibe: "modern",
    wall: "white",
    floor: "",
    colors: ["cream", "wood", "beige", "black"],
    light: "soft",
    avoid: ["gloss", "clutter", "decor", "pop"],
    notes: "",
    customColors: [],
    customAvoid: [],
    customLights: [],
  },
  house: {
    globals:
      "Keep all structural walls unchanged. Never move the bathrooms or the kitchen. Keep all room sizes and window positions realistic. Always leave enough walking space.",
    climate: "Greater Noida climate, family home",
    area: "Total area 1850 sq.ft · Carpet area 1240 sq.ft",
    plan: "",
  },
  camera: CAMERA,
  aspect: "landscape",
  customReqs: [],
  rooms: [
    {
      name: "Living room",
      size: "12'0\" x 18'5\" (3.65 x 5.61 m), long rectangular",
      windows: "",
      sun: "",
      fixed: "Balcony saath mein khulti hai",
      reqs: ["sofa", "coffee", "rug", "storage", "plant", "softlight", "tv"],
      free: "",
      refs: [],
      log: [],
    },
    {
      name: "Dining",
      size: "13'1\" x 10'7\" (4.00 x 3.24 m)",
      windows: "",
      sun: "",
      fixed: "Kitchen aur living ke beech",
      reqs: ["dining", "softlight"],
      free: "",
      refs: [],
      log: [],
    },
    {
      name: "Kitchen",
      size: "7'10\" x 11'4\" (2.40 x 3.45 m)",
      windows: "",
      sun: "",
      fixed: "Dining ke saath khulti hai",
      reqs: ["storage"],
      free: "Dining jaisa wood tone.",
      refs: [],
      log: [],
    },
    {
      name: "Entrance foyer",
      size: "7'10\" x 4'3\" (2.40 x 1.29 m)",
      windows: "",
      sun: "",
      fixed: "Ghar ka entry point",
      reqs: ["mirror", "storage"],
      free: "",
      refs: [],
      log: [],
    },
    {
      name: "Master bedroom",
      size: "11'4\" x 15'4\" (3.45 x 4.67 m)",
      windows: "",
      sun: "",
      fixed:
        "Attached L-shaped dress area (5'4\"x8'8\") ek wall par; balcony bilkul opposite wall par (dress aur balcony alag-alag, opposite deewaron par hain); toilet bhi saath mein. Sab plan ke hisaab se hi rakhna",
      reqs: ["wardrobe", "curtains", "softlight"],
      free: "Modern Ghar jesa feel",
      refs: [],
      log: [],
    },
    {
      name: "Bedroom 2",
      size: "11'0\" x 13'9\" (3.35 x 4.20 m)",
      windows: "",
      sun: "",
      fixed: "Chhota dress area (6'1\"x4'11\")",
      reqs: ["wardrobe", "storage"],
      free: "",
      refs: [],
      log: [],
    },
    {
      name: "Bedroom 3 / study",
      size: "10'10\" x 13'9\" (3.30 x 4.20 m)",
      windows: "",
      sun: "",
      fixed: "Attached dress (4'7\"x3'11\") + toilet saath mein",
      reqs: ["study", "wardrobe", "storage"],
      free: "",
      refs: [],
      log: [],
    },
    {
      name: "Master toilet",
      size: "8'2\" x 5'11\" (2.50 x 1.80 m)",
      windows: "",
      sun: "",
      fixed: "Master bedroom ke saath",
      reqs: [],
      free: "",
      refs: [],
      log: [],
    },
    {
      name: "Common toilet",
      size: "5'9\" x 8'2\" (1.75 x 2.50 m)",
      windows: "",
      sun: "",
      fixed: "",
      reqs: [],
      free: "",
      refs: [],
      log: [],
    },
    {
      name: "Bedroom 3 toilet",
      size: "5'5\" x 7'10\" (1.65 x 2.40 m)",
      windows: "",
      sun: "",
      fixed: "Bedroom 3 ke saath",
      reqs: [],
      free: "",
      refs: [],
      log: [],
    },
    {
      name: "Balcony 1 — living (green corner)",
      size: "",
      windows: "",
      sun: "",
      fixed: "Living ke saamne",
      reqs: ["plant"],
      free: "Baithne ki jagah, kaafi plants.",
      refs: [],
      log: [],
    },
    {
      name: "Balcony 2 — dining side",
      size: "",
      windows: "",
      sun: "",
      fixed: "Kitchen / dining ki taraf",
      reqs: [],
      free: "",
      refs: [],
      log: [],
    },
    {
      name: "Balcony 3 — master bedroom",
      size: "",
      windows: "",
      sun: "",
      fixed: "Master bedroom ke saath",
      reqs: ["plant"],
      free: "",
      refs: [],
      log: [],
    },
  ],
};
