import { useStore } from "../store";
import { allColors, allLights } from "../lib/prompt";
import { RoomPreview } from "../three/RoomPreview";
import { Card, CardTitle } from "./ui";

const NEUTRAL_WALL = "#e7ded0";
const NEUTRAL_FLOOR = "#e7ded0"; // when no floor chosen, matches the neutral wall tone
// A generic, pleasantly-proportioned room — this preview is about colour &
// light, not any specific room's measurements.
const DIMS = { w: 4.2, d: 3.4, source: "metric" as const };

export function StylePreview() {
  const s = useStore((st) => st.s);

  const wallOpt = allColors(s).find((c) => c.k === s.bible.wall);
  const wallColor = wallOpt?.hex || NEUTRAL_WALL;
  const floorOpt = allColors(s).find((c) => c.k === s.bible.floor);
  const floorColor = floorOpt?.hex || NEUTRAL_FLOOR;
  const lightOpt = allLights(s).find((l) => l.k === s.bible.light);
  const accents = s.bible.colors
    .map((k) => allColors(s).find((c) => c.k === k))
    .filter((c): c is NonNullable<typeof c> => !!c && c.hex !== undefined);

  return (
    <Card className="!mb-0 overflow-hidden !p-0">
      <div className="h-[340px] w-full">
        <RoomPreview
          dims={DIMS}
          wallColor={wallColor}
          floorColor={floorColor}
          lightKey={s.bible.light}
        />
      </div>
      <div className="p-4 border-t border-line">
        <CardTitle>Live preview</CardTitle>
        <p className="text-[12px] text-ink-soft mt-0.5 mb-3">
          Rang aur roshni yahan turant dikhte hain · drag karke ghumao
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-3">
          <div>
            <div className="text-[10.5px] uppercase tracking-wide text-ink-soft mb-1.5">
              Wall
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full border border-white/15"
                style={{ background: wallColor }}
              />
              <span className="text-[12.5px]">
                {wallOpt?.label || "Neutral"}
              </span>
            </div>
          </div>
          <div>
            <div className="text-[10.5px] uppercase tracking-wide text-ink-soft mb-1.5">
              Floor
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full border border-white/15"
                style={{ background: floorColor }}
              />
              <span className="text-[12.5px]">
                {floorOpt?.label || "Neutral"}
              </span>
            </div>
          </div>
          <div>
            <div className="text-[10.5px] uppercase tracking-wide text-ink-soft mb-1.5">
              Light
            </div>
            <span className="text-[12.5px]">
              {lightOpt?.label || "Soft & warm"}
            </span>
          </div>
          {accents.length > 0 && (
            <div>
              <div className="text-[10.5px] uppercase tracking-wide text-ink-soft mb-1.5">
                Accents
              </div>
              <div className="flex items-center gap-1.5">
                {accents.map((a) => (
                  <span
                    key={a.k}
                    title={a.label}
                    className="w-4 h-4 rounded-full border border-white/15"
                    style={{ background: a.hex }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
