import type { Option, Room, State } from "../types";
import {
  ASPECTS,
  AVOIDS,
  COLORS,
  DESIGNER,
  LIGHTS,
  LOCK,
  REQS,
  VIBES,
} from "../data/tables";

const esc = (t?: string) => (t || "").trim();

/* ---------- custom-option merge helpers ---------- */
export const allColors = (s: State): Option[] =>
  COLORS.concat(s.bible.customColors || []);
export const allAvoids = (s: State): Option[] =>
  AVOIDS.concat(s.bible.customAvoid || []);
export const allLights = (s: State): Option[] =>
  LIGHTS.concat(s.bible.customLights || []);
export const allReqs = (s: State): Option[] =>
  REQS.concat(s.customReqs || []);
export const reqMap = (s: State): Record<string, string> =>
  Object.fromEntries(allReqs(s).map((x) => [x.k, x.en]));

/* ---------- Bible -> English ---------- */
export function bibleEnglish(s: State): string[] {
  const b = s.bible;
  const lines: string[] = [];
  const v = VIBES.find((x) => x.k === b.vibe);
  if (v) lines.push("Style: " + v.en);
  const ac = allColors(s);
  if (b.wall) {
    const w = ac.find((x) => x.k === b.wall);
    if (w) lines.push("Wall colour: " + w.en + " on the main background walls");
  }
  if (b.floor) {
    const f = ac.find((x) => x.k === b.floor);
    if (f) lines.push("Flooring: " + f.en + " floor");
  }
  if (b.colors.length) {
    const hasBlack = b.colors.includes("black");
    const names = b.colors
      .filter((k) => k !== "black")
      .map((k) => {
        const c = ac.find((x) => x.k === k);
        return c ? c.en : null;
      })
      .filter(Boolean);
    let str = "Accent colours: " + (names.join(", ") || "neutral tones");
    if (hasBlack) str += ", with black accents only";
    lines.push(str);
  }
  const l = allLights(s).find((x) => x.k === b.light);
  if (l) lines.push("Lighting: " + l.en);
  if (b.avoid.length) {
    const aa = allAvoids(s);
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

/* ---------- house context block ---------- */
function houseBlock(s: State, r: Room): string {
  const lines: string[] = [];
  if (esc(s.house.globals)) lines.push(esc(s.house.globals));
  if (esc(s.house.climate)) lines.push(esc(s.house.climate));
  if (esc(s.house.area)) lines.push(esc(s.house.area));
  const rl: string[] = [];
  if (esc(r.size)) rl.push("approx size " + esc(r.size));
  if (esc(r.windows)) rl.push("windows: " + esc(r.windows));
  if (esc(r.sun)) rl.push("sunlight: " + esc(r.sun));
  if (esc(r.fixed)) rl.push("note: " + esc(r.fixed));
  if (rl.length) lines.push("This room — " + rl.join("; ") + ".");
  return lines.join("\n");
}

export interface FreshOpts {
  useCamera: boolean;
  useLock: boolean;
}

/* ---------- room render prompt ---------- */
export function buildFresh(s: State, r: Room, opts: FreshOpts): string {
  const parts: string[] = [DESIGNER, ""];
  parts.push("Follow my Design Bible for the whole home.\n");
  const bb = bibleEnglish(s);
  if (bb.length) parts.push("DESIGN BIBLE\n" + bb.join("\n"));
  const hb = houseBlock(s, r);
  if (hb) parts.push("\nHOUSE CONTEXT\n" + hb);
  parts.push("\nROOM: " + (r.name || "this room"));
  if (s.house.plan)
    parts.push(
      "\nFLOOR PLAN (Image 1)\n" +
        "The attached floor plan (Image 1) is the exact, authoritative layout of my home. " +
        "Locate the " +
        (r.name || "this room") +
        " in this plan and render only that room from inside. " +
        "Keep its exact shape, proportions, wall positions, door openings and window positions as drawn. " +
        "If the plan shows an attached dress area, toilet or balcony opening off this room, keep them exactly as drawn — " +
        "treat them as part of this room, do not turn them into separate rooms, and do not add, remove, merge or move any walls or spaces. " +
        "Critically, preserve the layout's orientation: do NOT flip, mirror or rotate the plan. " +
        "Each attached space (especially the dress area) must stay on the SAME wall and side as drawn, " +
        "in the same position relative to the bed, windows and door — if it opens off the left/right/far wall in the plan, " +
        "it must appear on that exact same side in the render. " +
        "Different attached spaces can sit on different — even opposite — walls: keep the dress area, toilet and balcony each on the wall the plan shows them, " +
        "do not bunch them together or assume they are next to each other. " +
        "Also reproduce each space's exact footprint/shape as drawn — if the dress area is L-shaped, render it L-shaped, not a plain rectangle. " +
        "If there is an attached dress area, angle the camera so its entrance/opening is visible in the frame, on its correct wall. " +
        "Important: this floor plan is a flat top-down layout reference only — use it for room shape, walls and openings, " +
        "but do NOT copy its 2D look, orientation or aspect ratio into the result. Produce a normal eye-level interior photograph.",
    );
  const RMAP = reqMap(s);
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
  if (opts.useLock)
    parts.push(
      "\n" +
        LOCK +
        (s.house.plan
          ? " Match the attached floor plan (Image 1) exactly."
          : ""),
    );
  if (opts.useCamera && esc(s.camera))
    parts.push("\nCAMERA & QUALITY\n" + esc(s.camera));
  parts.push("\n" + (ASPECTS[s.aspect] || ASPECTS.landscape));
  parts.push("\nGenerate a photorealistic architectural render of this room.");
  return parts.join("\n");
}

/* ---------- multi-line edit prompt ---------- */
export function buildEdit(changeText: string): string {
  const items = changeText
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const head =
    "Keep everything in the previous image exactly the same — same layout, same walls, same windows, same camera angle.\n\n";
  const tail = "\n\nDo not change anything else.";
  let mid: string;
  if (!items.length) mid = "Only change: [jo badalna hai woh likho]";
  else if (items.length === 1) mid = "Only make this change: " + items[0];
  else mid = "Only make these changes:\n- " + items.join("\n- ");
  return head + mid + tail;
}

/* ---------- Markdown design package ---------- */
export function buildExportDoc(s: State, dateStr: string): string {
  const lines: string[] = [
    "# Ghar Interior — Design File\n",
    "_Banaya: Ghar Design Studio · " + dateStr + "_\n",
    "## Style\n",
  ];
  bibleEnglish(s).forEach((l) => lines.push("- " + l));
  lines.push("\n## Ghar ke rules\n");
  if (esc(s.house.globals)) lines.push("- " + esc(s.house.globals));
  if (esc(s.house.climate)) lines.push("- " + esc(s.house.climate));
  if (esc(s.house.area)) lines.push("- " + esc(s.house.area));
  lines.push("\n## Kamre\n");
  const RMAP = reqMap(s);
  s.rooms.forEach((r) => {
    lines.push("### " + (r.name || "Untitled"));
    const m: string[] = [];
    if (esc(r.size)) m.push("Size: " + esc(r.size));
    if (esc(r.windows)) m.push("Windows: " + esc(r.windows));
    if (esc(r.sun)) m.push("Sun: " + esc(r.sun));
    if (esc(r.fixed)) m.push("Note: " + esc(r.fixed));
    if (m.length) lines.push(m.join(" · "));
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
