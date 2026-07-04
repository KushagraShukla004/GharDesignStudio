/**
 * Accepts `#aabbcc` / `aabbcc` / `#abc` / `r,g,b` / `rgb(r,g,b)` / spaced;
 * returns `#rrggbb` or null. (Ported verbatim from legacy app.js parseColor.)
 */
export function parseColor(v: string): string | null {
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
      const h = (n: number) => n.toString(16).padStart(2, "0");
      return "#" + h(r) + h(g) + h(b);
    }
  }
  return null;
}
