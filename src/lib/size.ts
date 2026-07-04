export interface Dims {
  /** width in metres */
  w: number;
  /** depth in metres */
  d: number;
  /** where the numbers came from */
  source: "metric" | "feet";
}

/**
 * Parse room dimensions from a `size` string like:
 *   `12'0" x 18'5" (3.65 x 5.61 m), long rectangular`
 * Prefers the parenthesised metric pair; falls back to the feet-inches pair.
 * Returns null when no dimensions are present (e.g. balconies with empty size).
 */
export function parseDims(size: string): Dims | null {
  const s = (size || "").trim();
  if (!s) return null;

  // metric pair inside parentheses: (3.65 x 5.61 m)
  const metric = s.match(/\(\s*([\d.]+)\s*[x×]\s*([\d.]+)\s*m\s*\)/i);
  if (metric) {
    const w = parseFloat(metric[1]);
    const d = parseFloat(metric[2]);
    if (w > 0 && d > 0) return { w, d, source: "metric" };
  }

  // feet-inches pair: 12'0" x 18'5"
  const feet = s.match(
    /(\d+)\s*'\s*(\d+)?\s*"?\s*[x×]\s*(\d+)\s*'\s*(\d+)?\s*"?/,
  );
  if (feet) {
    const toM = (ft: string, inch?: string) =>
      (parseInt(ft, 10) + (inch ? parseInt(inch, 10) : 0) / 12) * 0.3048;
    const w = toM(feet[1], feet[2]);
    const d = toM(feet[3], feet[4]);
    if (w > 0 && d > 0) return { w, d, source: "feet" };
  }

  return null;
}
