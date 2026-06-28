"use strict";

/* ---------- safe storage ---------- */
const mem = {};
const store = {
  get(k) {
    try {
      return localStorage.getItem(k);
    } catch (e) {
      return mem[k] ?? null;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch (e) {
      mem[k] = v;
    }
  },
};

/* ---------- translation tables (plain choice -> design English) ---------- */
const VIBES = [
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
const COLORS = [
  { k: "cream", label: "Cream", hex: "#efe3cf", en: "cream" },
  { k: "white", label: "White", hex: "#fbfaf6", en: "warm white" },
  { k: "lgrey", label: "Light grey", hex: "#d7d3cb", en: "light grey" },
  { k: "wood", label: "Wood/brown", hex: "#6b4a2f", en: "walnut wood tones" },
  { k: "beige", label: "Beige", hex: "#d8c2a0", en: "beige" },
  { k: "blue", label: "Soft blue", hex: "#aec4d4", en: "soft muted blue" },
  { k: "green", label: "Green", hex: "#9aa886", en: "sage green" },
  { k: "wgrey", label: "Warm grey", hex: "#b3a596", en: "warm greige" },
  { k: "black", label: "Black touch", hex: "#2b2b2b", en: "black accents" },
];
const LIGHTS = [
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
const AVOIDS = [
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
const REQS = [
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
const REQ_EN = Object.fromEntries(REQS.map((r) => [r.k, r.en]));
const CAMERA =
  "Eye-level camera, 24mm lens, photorealistic interior photography, soft natural daylight, architectural visualization, ultra realistic, no fisheye, natural proportions, high-end residential, real materials, accurate shadows.";
const LOCK =
  "Lock the layout. Keep all walls, windows and room sizes identical. Only design finishes and furniture. Do not modify the architecture.";
const DESIGNER =
  "You are an expert interior designer. The notes below may be casual or written in Hinglish — read them like a professional, understand the intent, and fill any gaps with tasteful choices that fit the chosen style.";

/* ---------- defaults ---------- */
const DEFAULTS = {
  bible: {
    vibe: "hotel",
    colors: ["cream", "white", "wood", "beige", "black"],
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
    climate: "Gurgaon climate, family home",
    area: "Total area 1850 sq.ft · Carpet area 1240 sq.ft",
    plan: "",
  },
  camera: CAMERA,
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
      fixed: "Attached dress (5'4\"x8'8\"), toilet aur balcony saath mein",
      reqs: ["wardrobe", "curtains", "softlight"],
      free: "Hotel jaisa suite feel.",
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
const EXTRACT_PROMPT =
  'Read this floor plan image carefully. Find every room and its dimensions. Reply with ONLY valid JSON, no other text, in exactly this format:\n{"rooms":[{"name":"Living room","size":"12\'0\\" x 18\'5\\" (3.65 x 5.61 m)"}],"area":"Total area ... sq.ft, Carpet area ... sq.ft"}\nUse the room names exactly as printed on the plan. If a dimension is missing, leave its size as "".';

/* ---------- state ---------- */
let state = load();
function load() {
  const raw = store.get("ghar_state_v3");
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {}
  }
  return JSON.parse(JSON.stringify(DEFAULTS));
}
let saveTimer = null;
function save() {
  store.set("ghar_state_v3", JSON.stringify(state));
  const s = document.getElementById("saveStatus");
  s.textContent = "Saved.";
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    s.textContent = "Aapka kaam apne aap save hota hai is browser mein.";
  }, 1400);
}
let activeEditRoom = 0,
  activeWorkRoom = null;

/* ---------- helpers ---------- */
const $ = (s) => document.querySelector(s),
  $$ = (s) => Array.from(document.querySelectorAll(s));
const esc = (t) => (t || "").trim();
function flashToast(id) {
  const t = document.getElementById(id);
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 1600);
}
function copyText(txt, id) {
  navigator.clipboard
    .writeText(txt)
    .then(() => flashToast(id))
    .catch(() => {
      const ta = document.createElement("textarea");
      ta.value = txt;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        flashToast(id);
      } catch (e) {
        alert("Copy nahi hua — text manually select karo.");
      }
      ta.remove();
    });
}

/* ---------- custom options ---------- */
function allColors() {
  return COLORS.concat(state.bible.customColors || []);
}
function allAvoids() {
  return AVOIDS.concat(state.bible.customAvoid || []);
}
function allLights() {
  return LIGHTS.concat(state.bible.customLights || []);
}
function allReqs() {
  return REQS.concat(state.customReqs || []);
}
function reqMap() {
  return Object.fromEntries(allReqs().map((x) => [x.k, x.en]));
}
function newKey(p) {
  return (
    p + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5)
  );
}
function parseColor(v) {
  v = (v || "").trim().toLowerCase();
  if (!v) return null;
  let m = v.match(/^#?([0-9a-f]{6})$/);
  if (m) return "#" + m[1];
  m = v.match(/^#?([0-9a-f]{3})$/);
  if (m) {
    const c = m[1];
    return "#" + c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  }
  m = v.match(/(\d{1,3})\D+(\d{1,3})\D+(\d{1,3})/);
  if (m) {
    const r = +m[1],
      g = +m[2],
      b = +m[3];
    if ([r, g, b].every((n) => n <= 255)) {
      const h = (n) => n.toString(16).padStart(2, "0");
      return "#" + h(r) + h(g) + h(b);
    }
  }
  return null;
}

/* ---------- nav ---------- */
$("#nav").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  $$(".nav button").forEach((x) => x.classList.toggle("active", x === b));
  $$(".view").forEach((v) => v.classList.remove("active"));
  $("#view-" + b.dataset.view).classList.add("active");
  if (b.dataset.view === "work") renderWorkRoomPicker();
});

/* ---------- 1. STYLE (bible) ---------- */
function renderChoiceChips(containerId, items, getOn, onClick, onDelete) {
  const wrap = $(containerId);
  wrap.innerHTML = "";
  items.forEach((it) => {
    const c = document.createElement("button");
    const swatch = it.hex !== undefined;
    c.className =
      "chip" +
      (swatch ? " swatch" : "") +
      (getOn(it.k) ? " on" : "") +
      (it.custom ? " custom" : "");
    if (swatch) {
      const d = document.createElement("span");
      d.className = "dot";
      d.style.background = it.hex;
      c.appendChild(d);
    }
    c.appendChild(document.createTextNode(it.label));
    c.addEventListener("click", () => onClick(it.k));
    if (it.custom && onDelete) {
      const x = document.createElement("span");
      x.className = "rmx";
      x.textContent = "×";
      x.title = "Remove";
      x.addEventListener("click", (ev) => {
        ev.stopPropagation();
        onDelete(it.k);
      });
      c.appendChild(x);
    }
    wrap.appendChild(c);
  });
}
function renderBible() {
  const b = state.bible;
  renderChoiceChips(
    "#vibeChips",
    VIBES,
    (k) => b.vibe === k,
    (k) => {
      b.vibe = k;
      save();
      renderBible();
    },
  );
  renderChoiceChips(
    "#colorChips",
    allColors(),
    (k) => b.colors.includes(k),
    (k) => {
      const i = b.colors.indexOf(k);
      if (i >= 0) b.colors.splice(i, 1);
      else b.colors.push(k);
      save();
      renderBible();
    },
    delCustomColor,
  );
  renderChoiceChips(
    "#lightChips",
    allLights(),
    (k) => b.light === k,
    (k) => {
      b.light = k;
      save();
      renderBible();
    },
    delCustomLight,
  );
  renderChoiceChips(
    "#avoidChips",
    allAvoids(),
    (k) => b.avoid.includes(k),
    (k) => {
      const i = b.avoid.indexOf(k);
      if (i >= 0) b.avoid.splice(i, 1);
      else b.avoid.push(k);
      save();
      renderBible();
    },
    delCustomAvoid,
  );
  $("#b_notes").value = b.notes || "";
  $("#biblePreview").textContent =
    bibleEnglish().join("\n") || "(kuch choose karo)";
}
function delCustomColor(k) {
  const b = state.bible;
  b.customColors = (b.customColors || []).filter((c) => c.k !== k);
  b.colors = b.colors.filter((x) => x !== k);
  save();
  renderBible();
}
function delCustomAvoid(k) {
  const b = state.bible;
  b.customAvoid = (b.customAvoid || []).filter((c) => c.k !== k);
  b.avoid = b.avoid.filter((x) => x !== k);
  save();
  renderBible();
}
function delCustomLight(k) {
  const b = state.bible;
  b.customLights = (b.customLights || []).filter((c) => c.k !== k);
  if (b.light === k) b.light = "soft";
  save();
  renderBible();
}
$("#lc_add").addEventListener("click", () => {
  const b = state.bible;
  b.customLights = b.customLights || [];
  const t = esc($("#lc_text").value);
  if (!t) return;
  const k = newKey("lt");
  b.customLights.push({ k, label: t, en: t, custom: true });
  b.light = k;
  $("#lc_text").value = "";
  save();
  renderBible();
});
$("#cc_add").addEventListener("click", () => {
  const b = state.bible;
  b.customColors = b.customColors || [];
  const name = esc($("#cc_name").value);
  const hex = parseColor($("#cc_code").value) || $("#cc_pick").value;
  if (!hex) {
    $("#cc_msg").textContent =
      "Sahi colour code daalo — jaise #0a7d7d ya 10,125,125.";
    return;
  }
  const k = newKey("col");
  b.customColors.push({
    k,
    label: name || hex,
    hex,
    en: name || "the colour " + hex,
    custom: true,
  });
  b.colors.push(k);
  $("#cc_name").value = "";
  $("#cc_code").value = "";
  $("#cc_msg").textContent = "";
  save();
  renderBible();
});
$("#av_add").addEventListener("click", () => {
  const b = state.bible;
  b.customAvoid = b.customAvoid || [];
  const t = esc($("#av_text").value);
  if (!t) return;
  const k = newKey("av");
  b.customAvoid.push({ k, label: t, en: t, custom: true });
  b.avoid.push(k);
  $("#av_text").value = "";
  save();
  renderBible();
});
$("#b_notes").addEventListener("input", () => {
  state.bible.notes = $("#b_notes").value;
  save();
  $("#biblePreview").textContent = bibleEnglish().join("\n");
});

function bibleEnglish() {
  const b = state.bible,
    lines = [];
  const v = VIBES.find((x) => x.k === b.vibe);
  if (v) lines.push("Style: " + v.en);
  if (b.colors.length) {
    const hasBlack = b.colors.includes("black");
    const ac = allColors();
    const names = b.colors
      .filter((k) => k !== "black")
      .map((k) => {
        const c = ac.find((x) => x.k === k);
        return c ? c.en : null;
      })
      .filter(Boolean);
    let s = "Colours: " + (names.join(", ") || "neutral tones");
    if (hasBlack) s += ", with black accents only";
    lines.push(s);
  }
  const l = allLights().find((x) => x.k === b.light);
  if (l) lines.push("Lighting: " + l.en);
  if (b.avoid.length) {
    const aa = allAvoids();
    const av = b.avoid
      .map((k) => {
        const a = aa.find((x) => x.k === k);
        return a ? a.en : null;
      })
      .filter(Boolean);
    if (av.length) lines.push("Avoid: " + av.join("; "));
  }
  if (esc(b.notes))
    lines.push("Owner's wish (interpret professionally): " + esc(b.notes));
  return lines;
}

/* ---------- 2. ROOMS ---------- */
function fillHouse() {
  $("#h_globals").value = state.house.globals || "";
  $("#h_climate").value = state.house.climate || "";
  $("#h_area").value = state.house.area || "";
  renderPlan();
}
$("#h_globals").addEventListener("input", () => {
  state.house.globals = $("#h_globals").value;
  save();
});
$("#h_climate").addEventListener("input", () => {
  state.house.climate = $("#h_climate").value;
  save();
});
$("#h_area").addEventListener("input", () => {
  state.house.area = $("#h_area").value;
  save();
});

/* floor plan image: downscale then store as base64 */
function renderPlan() {
  const img = $("#planPreview"),
    rm = $("#planRemove");
  if (state.house.plan) {
    img.src = state.house.plan;
    img.style.display = "block";
    rm.style.display = "inline-block";
  } else {
    img.style.display = "none";
    rm.style.display = "none";
  }
}
$("#planUpload").addEventListener("click", () => $("#planInput").click());
$("#planRemove").addEventListener("click", () => {
  state.house.plan = "";
  save();
  renderPlan();
});
$("#planInput").addEventListener("change", (e) => {
  const f = e.target.files[0];
  if (!f) return;
  const rd = new FileReader();
  rd.onload = () => {
    const im = new Image();
    im.onload = () => {
      const max = 1100,
        scale = Math.min(1, max / Math.max(im.width, im.height));
      const c = document.createElement("canvas");
      c.width = im.width * scale;
      c.height = im.height * scale;
      c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
      try {
        state.house.plan = c.toDataURL("image/jpeg", 0.82);
      } catch (err) {
        state.house.plan = rd.result;
      }
      save();
      renderPlan();
    };
    im.src = rd.result;
  };
  rd.readAsDataURL(f);
  e.target.value = "";
});

/* extraction helper */
$("#copyExtract").addEventListener("click", () =>
  copyText(EXTRACT_PROMPT, "extractToast"),
);
$("#importJson").addEventListener("click", () => {
  const msg = $("#importMsg");
  let raw = $("#importBox").value.trim();
  if (!raw) {
    msg.textContent = "Paste the JSON first.";
    return;
  }
  raw = raw
    .replace(/^```(json)?/i, "")
    .replace(/```$/, "")
    .trim();
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    msg.textContent = "That JSON isn't valid — copy it again from AI Studio.";
    return;
  }
  const incoming = Array.isArray(data) ? data : data.rooms || [];
  if (!incoming.length) {
    msg.textContent = "No rooms found in the JSON.";
    return;
  }
  let updated = 0,
    added = 0;
  incoming.forEach((it) => {
    const nm = esc(it.name);
    if (!nm) return;
    const sz = esc(it.size || it.dimensions || "");
    const match = state.rooms.find(
      (r) =>
        (r.name || "").toLowerCase().trim() === nm.toLowerCase().trim() ||
        (r.name || "").toLowerCase().includes(nm.toLowerCase()),
    );
    if (match) {
      if (sz) match.size = sz;
      updated++;
    } else {
      state.rooms.push({
        name: nm,
        size: sz,
        windows: "",
        sun: "",
        fixed: "",
        reqs: [],
        free: "",
        refs: [],
        log: [],
      });
      added++;
    }
  });
  if (data.area) state.house.area = esc(data.area);
  save();
  fillHouse();
  renderRoomEditList();
  renderRoomEditPanel();
  msg.textContent = `Done — ${updated} updated, ${added} added.${data.area ? " Area filled too." : ""}`;
  $("#importBox").value = "";
});

function renderRoomEditList() {
  const wrap = $("#roomEditList");
  wrap.innerHTML = "";
  state.rooms.forEach((r, i) => {
    const b = document.createElement("button");
    b.className = i === activeEditRoom ? "active" : "";
    b.innerHTML = `<span>${r.name || "Untitled"}</span><span class="meta">${r.size ? r.size : "size nahi"}</span>`;
    b.addEventListener("click", () => {
      activeEditRoom = i;
      renderRoomEditList();
      renderRoomEditPanel();
    });
    wrap.appendChild(b);
  });
}
function renderRoomEditPanel() {
  const r = state.rooms[activeEditRoom],
    p = $("#roomEditPanel");
  if (!r) {
    p.innerHTML = '<p class="empty">Ek kamra choose karo.</p>';
    return;
  }
  p.innerHTML = `
    <div class="field"><label>Kamre ka naam</label><input type="text" id="re_name"></div>
    <div class="grid2">
      <div class="field"><label>Approx size <span class="hint">jaise 16 x 14 ft — optional</span></label><input type="text" id="re_size"></div>
      <div class="field"><label>Khidkiyan <span class="hint">kahan/kitni</span></label><input type="text" id="re_windows"></div>
    </div>
    <div class="grid2">
      <div class="field"><label>Dhoop kis taraf <span class="hint">jaise subah ki dhoop east se</span></label><input type="text" id="re_sun"></div>
      <div class="field"><label>Fix cheezein <span class="hint">jo na badle</span></label><input type="text" id="re_fixed"></div>
    </div>
    <div class="row"><button class="btn ghost" id="re_delete">Delete this room</button></div>`;
  $("#re_name").value = r.name || "";
  $("#re_size").value = r.size || "";
  $("#re_windows").value = r.windows || "";
  $("#re_sun").value = r.sun || "";
  $("#re_fixed").value = r.fixed || "";
  const bind = (id, key, relist) => {
    $(id).addEventListener("input", () => {
      r[key] = $(id).value;
      save();
      if (relist) renderRoomEditList();
    });
  };
  bind("#re_name", "name", true);
  bind("#re_size", "size", true);
  bind("#re_windows", "windows");
  bind("#re_sun", "sun");
  bind("#re_fixed", "fixed");
  $("#re_delete").addEventListener("click", () => {
    if (
      confirm(
        'Delete "' +
          (r.name || "this room") +
          '"? Its saved prompts will be lost too.',
      )
    ) {
      state.rooms.splice(activeEditRoom, 1);
      activeEditRoom = Math.max(0, activeEditRoom - 1);
      save();
      renderRoomEditList();
      renderRoomEditPanel();
    }
  });
}
$("#addRoom").addEventListener("click", () => {
  const name = esc($("#newRoomName").value) || "Naya kamra";
  state.rooms.push({
    name,
    size: "",
    windows: "",
    sun: "",
    fixed: "",
    reqs: [],
    free: "",
    refs: [],
    log: [],
  });
  $("#newRoomName").value = "";
  activeEditRoom = state.rooms.length - 1;
  save();
  renderRoomEditList();
  renderRoomEditPanel();
});

/* ---------- 3. WORKSPACE ---------- */
function renderWorkRoomPicker() {
  const wrap = $("#roomPickList");
  wrap.innerHTML = "";
  if (!state.rooms.length) {
    wrap.innerHTML = '<p class="empty">Pehle step 2 mein kamre add karo.</p>';
    return;
  }
  state.rooms.forEach((r, i) => {
    const b = document.createElement("button");
    b.className = i === activeWorkRoom ? "active" : "";
    b.innerHTML = `<span>${r.name || "Untitled"}</span><span class="pill">${(r.reqs || []).length} chuna · ${(r.log || []).length} saved</span>`;
    b.addEventListener("click", () => {
      activeWorkRoom = i;
      renderWorkRoomPicker();
      openWorkRoom();
    });
    wrap.appendChild(b);
  });
}
function openWorkRoom() {
  const r = state.rooms[activeWorkRoom];
  if (!r) {
    $("#workPanel").style.display = "none";
    return;
  }
  $("#workPanel").style.display = "block";
  const chips = $("#reqChips");
  chips.innerHTML = "";
  allReqs().forEach((req) => {
    const c = document.createElement("button");
    c.className =
      "chip" +
      ((r.reqs || []).includes(req.k) ? " on" : "") +
      (req.custom ? " custom" : "");
    c.appendChild(document.createTextNode(req.label));
    c.addEventListener("click", () => {
      r.reqs = r.reqs || [];
      const i = r.reqs.indexOf(req.k);
      if (i >= 0) r.reqs.splice(i, 1);
      else r.reqs.push(req.k);
      save();
      c.classList.toggle("on");
      buildFresh();
      renderWorkRoomPicker();
    });
    if (req.custom) {
      const x = document.createElement("span");
      x.className = "rmx";
      x.textContent = "×";
      x.title = "Remove";
      x.addEventListener("click", (ev) => {
        ev.stopPropagation();
        delCustomReq(req.k);
      });
      c.appendChild(x);
    }
    chips.appendChild(c);
  });
  $("#w_free").value = r.free || "";
  renderRefs();
  renderRoomLog();
  buildFresh();
  buildEdit();
}
function delCustomReq(k) {
  state.customReqs = (state.customReqs || []).filter((x) => x.k !== k);
  state.rooms.forEach((r) => {
    r.reqs = (r.reqs || []).filter((x) => x !== k);
  });
  save();
  openWorkRoom();
  renderWorkRoomPicker();
}
$("#rq_add").addEventListener("click", () => {
  const r = state.rooms[activeWorkRoom];
  if (!r) return;
  const t = esc($("#rq_text").value);
  if (!t) return;
  state.customReqs = state.customReqs || [];
  const k = newKey("req");
  state.customReqs.push({ k, label: t, en: t, custom: true });
  r.reqs = r.reqs || [];
  r.reqs.push(k);
  $("#rq_text").value = "";
  save();
  openWorkRoom();
  renderWorkRoomPicker();
});
$("#w_free").addEventListener("input", () => {
  const r = state.rooms[activeWorkRoom];
  if (r) {
    r.free = $("#w_free").value;
    save();
    buildFresh();
  }
});
$("#useCamera").addEventListener("change", buildFresh);
$("#useLock").addEventListener("change", buildFresh);
function renderRefs() {
  const r = state.rooms[activeWorkRoom],
    wrap = $("#refList");
  wrap.innerHTML = "";
  (r.refs || []).forEach((ref, i) => {
    const row = document.createElement("div");
    row.className = "refrow";
    row.innerHTML = `<input type="text" value="${ref.img || ""}" placeholder="Image 2"><input type="text" value="${ref.use || ""}" placeholder="iski TV wall lo"><button class="btn ghost">Remove</button>`;
    const [imgIn, useIn, del] = row.children;
    imgIn.addEventListener("input", () => {
      ref.img = imgIn.value;
      save();
      buildFresh();
    });
    useIn.addEventListener("input", () => {
      ref.use = useIn.value;
      save();
      buildFresh();
    });
    del.addEventListener("click", () => {
      r.refs.splice(i, 1);
      save();
      renderRefs();
      buildFresh();
    });
    wrap.appendChild(row);
  });
}
$("#addRef").addEventListener("click", () => {
  const r = state.rooms[activeWorkRoom];
  r.refs = r.refs || [];
  r.refs.push({ img: "Image " + (r.refs.length + 2), use: "" });
  save();
  renderRefs();
});

function houseBlock(r) {
  const lines = [];
  if (esc(state.house.globals)) lines.push(esc(state.house.globals));
  if (esc(state.house.climate)) lines.push(esc(state.house.climate));
  if (esc(state.house.area)) lines.push(esc(state.house.area));
  const rl = [];
  if (esc(r.size)) rl.push("approx size " + esc(r.size));
  if (esc(r.windows)) rl.push("windows: " + esc(r.windows));
  if (esc(r.sun)) rl.push("sunlight: " + esc(r.sun));
  if (esc(r.fixed)) rl.push("note: " + esc(r.fixed));
  if (rl.length) lines.push("This room — " + rl.join("; ") + ".");
  return lines.join("\n");
}
function buildFresh() {
  const r = state.rooms[activeWorkRoom];
  if (!r) return;
  const parts = [DESIGNER, ""];
  parts.push("Follow my Design Bible for the whole home.\n");
  const bb = bibleEnglish();
  if (bb.length) parts.push("DESIGN BIBLE\n" + bb.join("\n"));
  const hb = houseBlock(r);
  if (hb) parts.push("\nHOUSE CONTEXT\n" + hb);
  parts.push("\nROOM: " + (r.name || "this room"));
  const RMAP = reqMap();
  const reqs = (r.reqs || []).map((k) => RMAP[k]).filter(Boolean);
  if (reqs.length) parts.push("Should include:\n- " + reqs.join("\n- "));
  if (esc(r.free))
    parts.push("Owner's words (interpret professionally): " + esc(r.free));
  const refs = (r.refs || []).filter((x) => esc(x.use));
  if (refs.length)
    parts.push(
      "\nREFERENCE IMAGES\n" +
        refs
          .map((x) => `${esc(x.img) || "Reference"}: ${esc(x.use)}.`)
          .join("\n") +
        "\nFit these into my layout (Image 1 is my floor plan). Adjust to my room — do not copy their dimensions.",
    );
  if ($("#useLock").checked) parts.push("\n" + LOCK);
  if ($("#useCamera").checked && esc(state.camera))
    parts.push("\nCAMERA & QUALITY\n" + esc(state.camera));
  parts.push("\nGenerate a photorealistic architectural render of this room.");
  $("#freshOut").textContent = parts.join("\n");
}
function buildEdit() {
  const items = $("#editChange")
    .value.split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const head =
    "Keep everything in the previous image exactly the same — same layout, same walls, same windows, same camera angle.\n\n";
  const tail = "\n\nDo not change anything else.";
  let mid;
  if (!items.length) mid = "Only change: [jo badalna hai woh likho]";
  else if (items.length === 1) mid = "Only make this change: " + items[0];
  else mid = "Only make these changes:\n- " + items.join("\n- ");
  $("#editOut").textContent = head + mid + tail;
}
$("#editChange").addEventListener("input", buildEdit);
$("#copyFresh").addEventListener("click", () =>
  copyText($("#freshOut").textContent, "freshToast"),
);
$("#copyEdit").addEventListener("click", () =>
  copyText($("#editOut").textContent, "editToast"),
);
$("#logFresh").addEventListener("click", () => {
  const r = state.rooms[activeWorkRoom];
  if (!r) return;
  r.log = r.log || [];
  r.log.unshift({
    when: new Date().toLocaleString(),
    txt: $("#freshOut").textContent,
  });
  save();
  renderRoomLog();
  renderWorkRoomPicker();
  flashToast("freshToast");
});
function renderRoomLog() {
  const r = state.rooms[activeWorkRoom],
    wrap = $("#roomLog");
  wrap.innerHTML = "";
  if (!r.log || !r.log.length) {
    wrap.innerHTML = '<p class="empty">Abhi koi saved prompt nahi.</p>';
    return;
  }
  r.log.forEach((item, i) => {
    const d = document.createElement("div");
    d.className = "logitem";
    d.innerHTML = `<div class="when">${item.when}</div><div class="txt">${item.txt.replace(/</g, "&lt;")}</div><div class="copybar"><button class="btn ghost">Copy</button><button class="btn ghost">Delete</button><span class="toast">Copied</span></div>`;
    const [copy, del, toast] = d.querySelector(".copybar").children;
    copy.addEventListener("click", () => {
      navigator.clipboard.writeText(item.txt);
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 1500);
    });
    del.addEventListener("click", () => {
      r.log.splice(i, 1);
      save();
      renderRoomLog();
      renderWorkRoomPicker();
    });
    wrap.appendChild(d);
  });
}

/* ---------- 4. EXPORT ---------- */
function buildExportDoc() {
  const lines = [
    "# Ghar Interior — Design File\n",
    "_Banaya: Ghar Design Studio · " + new Date().toLocaleDateString() + "_\n",
    "## Style\n",
  ];
  bibleEnglish().forEach((l) => lines.push("- " + l));
  lines.push("\n## Ghar ke rules\n");
  if (esc(state.house.globals)) lines.push("- " + esc(state.house.globals));
  if (esc(state.house.climate)) lines.push("- " + esc(state.house.climate));
  if (esc(state.house.area)) lines.push("- " + esc(state.house.area));
  lines.push("\n## Kamre\n");
  state.rooms.forEach((r) => {
    lines.push("### " + (r.name || "Untitled"));
    const m = [];
    if (esc(r.size)) m.push("Size: " + esc(r.size));
    if (esc(r.windows)) m.push("Windows: " + esc(r.windows));
    if (esc(r.sun)) m.push("Sun: " + esc(r.sun));
    if (esc(r.fixed)) m.push("Note: " + esc(r.fixed));
    if (m.length) lines.push(m.join(" · "));
    const RMAP = reqMap();
    const reqs = (r.reqs || []).map((k) => RMAP[k]).filter(Boolean);
    if (reqs.length) lines.push("\n**Chahiye:** " + reqs.join(", "));
    if (esc(r.free)) lines.push("\n**Owner's words:** " + esc(r.free));
    if (r.log && r.log.length) {
      lines.push("\n**Saved prompts:**");
      r.log.forEach((it) =>
        lines.push(
          "\n> _" +
            it.when +
            "_\n>\n" +
            it.txt
              .split("\n")
              .map((l) => "> " + l)
              .join("\n"),
        ),
      );
    }
    lines.push("");
  });
  return lines.join("\n");
}
$("#buildExport").addEventListener("click", () => {
  $("#exportOut").textContent = buildExportDoc();
});
$("#copyExport").addEventListener("click", () =>
  copyText($("#exportOut").textContent, "exportToast"),
);
$("#downloadExport").addEventListener("click", () => {
  const blob = new Blob([buildExportDoc()], { type: "text/markdown" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "ghar-design-file.md";
  a.click();
  URL.revokeObjectURL(a.href);
});

/* ---------- save / load ---------- */
$("#saveFile").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "mera-ghar-project.json";
  a.click();
  URL.revokeObjectURL(a.href);
});
$("#loadFile").addEventListener("click", () => $("#fileInput").click());
$("#fileInput").addEventListener("change", (e) => {
  const f = e.target.files[0];
  if (!f) return;
  const rd = new FileReader();
  rd.onload = () => {
    try {
      state = JSON.parse(rd.result);
      if (!state.camera) state.camera = CAMERA;
      save();
      initAll();
      alert("Project loaded.");
    } catch (err) {
      alert("Couldn't read that file.");
    }
  };
  rd.readAsText(f);
  e.target.value = "";
});

/* ---------- boot ---------- */
function initAll() {
  if (!state.camera) state.camera = CAMERA;
  if (state.house.area === undefined) state.house.area = "";
  if (state.house.plan === undefined) state.house.plan = "";
  state.bible.customColors = state.bible.customColors || [];
  state.bible.customAvoid = state.bible.customAvoid || [];
  state.bible.customLights = state.bible.customLights || [];
  state.customReqs = state.customReqs || [];
  renderBible();
  fillHouse();
  activeEditRoom = Math.min(
    activeEditRoom,
    Math.max(0, state.rooms.length - 1),
  );
  renderRoomEditList();
  renderRoomEditPanel();
  activeWorkRoom = null;
  $("#workPanel").style.display = "none";
  renderWorkRoomPicker();
}
initAll();
