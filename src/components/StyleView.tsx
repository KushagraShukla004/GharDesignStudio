import { lazy, Suspense, useState } from "react";
import { useStore, newKey } from "../store";
import { VIBES } from "../data/tables";
import { allColors, allAvoids, allLights, bibleEnglish } from "../lib/prompt";
import { parseColor } from "../lib/color";
import { ErrorBoundary } from "./ErrorBoundary";
import {
  Card,
  CardTitle,
  Sub,
  Chip,
  Chips,
  Button,
  TextInput,
  TextArea,
  ViewHeader,
} from "./ui";

// Three.js is heavy — keep it out of the initial bundle even though this is the
// default view; the rest of Style stays interactive while it streams in.
const StylePreview = lazy(() =>
  import("./StylePreview").then((m) => ({ default: m.StylePreview })),
);

function PreviewFrame({ children }: { children: React.ReactNode }) {
  // right column on desktop (sticky), on top on mobile
  return (
    <div className="min-[900px]:order-2 order-1 min-[900px]:sticky min-[900px]:top-6">
      <ErrorBoundary
        fallback={
          <Card className="!mb-0 text-center py-10 px-4">
            <p className="text-ink-soft text-[13px]">
              3D preview ke liye WebGL zaroori hai — updated Chrome ya Safari try
              karo.
            </p>
          </Card>
        }
      >
        <Suspense
          fallback={
            <div className="h-[340px] rounded-card border border-line bg-surface-2 grid place-items-center text-ink-soft text-[13px]">
              Loading preview…
            </div>
          }
        >
          {children}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export function StyleView() {
  const s = useStore((st) => st.s);
  const mutate = useStore((st) => st.mutate);
  const b = s.bible;

  // custom-add form state
  const [ccName, setCcName] = useState("");
  const [ccCode, setCcCode] = useState("");
  const [ccPick, setCcPick] = useState("#88a0b8");
  const [ccMsg, setCcMsg] = useState("");
  const [lcText, setLcText] = useState("");
  const [avText, setAvText] = useState("");

  const preview = bibleEnglish(s);

  return (
    <div>
      <ViewHeader
        eyebrow="Ek baar set karo · har kamre mein lagega"
        title="Ghar ka style"
        lead="Bas tap karke apni pasand batao. Design ki English aati ho ya nahi — koi baat nahi. Tool isko sahi design language mein khud badal deta hai."
      />

      <div className="grid grid-cols-1 min-[900px]:grid-cols-[minmax(0,1fr)_500px] gap-[18px] items-start">
        <PreviewFrame>
          <StylePreview />
        </PreviewFrame>

        <div className="min-[900px]:order-1 order-2 min-w-0">
      <Card>
        <CardTitle>Kaisa feel chahiye?</CardTitle>
        <Sub>Ek choose karo (What overall feeling?)</Sub>
        <Chips>
          {VIBES.map((v) => (
            <Chip
              key={v.k}
              label={v.label}
              on={b.vibe === v.k}
              onClick={() => mutate((d) => (d.bible.vibe = v.k))}
            />
          ))}
        </Chips>
      </Card>

      <Card>
        <CardTitle>Deewaron ka rang?</CardTitle>
        <Sub>
          Background wall colour — ek tap karo (ya khaali chhod do, designer khud
          decide karega). (Tap one wall colour, optional)
        </Sub>
        <Chips>
          {allColors(s).map((c) => (
            <Chip
              key={c.k}
              label={c.label}
              hex={c.hex}
              on={b.wall === c.k}
              custom={c.custom}
              onClick={() =>
                mutate((d) => (d.bible.wall = d.bible.wall === c.k ? "" : c.k))
              }
              onDelete={c.custom ? () => delColor(c.k) : undefined}
            />
          ))}
        </Chips>
      </Card>

      <Card>
        <CardTitle>Farsh (floor) ka rang?</CardTitle>
        <Sub>
          Floor / flooring colour — ek tap karo (ya khaali chhod do, neutral rahega).
          (Tap one floor colour, optional)
        </Sub>
        <Chips>
          {allColors(s).map((c) => (
            <Chip
              key={c.k}
              label={c.label}
              hex={c.hex}
              on={b.floor === c.k}
              custom={c.custom}
              onClick={() =>
                mutate((d) => (d.bible.floor = d.bible.floor === c.k ? "" : c.k))
              }
              onDelete={c.custom ? () => delColor(c.k) : undefined}
            />
          ))}
        </Chips>
      </Card>

      <Card>
        <CardTitle>
          Aur kaunse colours?{" "}
          <span className="font-normal text-ink-soft text-[13px]">
            (accents &amp; aesthetics)
          </span>
        </CardTitle>
        <Sub>
          Furniture, decor aur accents ke liye 2–3 tap karo. (Tap accent colours
          you like)
        </Sub>
        <Chips>
          {allColors(s).map((c) => (
            <Chip
              key={c.k}
              label={c.label}
              hex={c.hex}
              on={b.colors.includes(c.k)}
              custom={c.custom}
              onClick={() =>
                mutate((d) => {
                  const i = d.bible.colors.indexOf(c.k);
                  if (i >= 0) d.bible.colors.splice(i, 1);
                  else d.bible.colors.push(c.k);
                })
              }
              onDelete={c.custom ? () => delColor(c.k) : undefined}
            />
          ))}
        </Chips>
        <div className="flex flex-wrap gap-2 items-center mt-3.5">
          <input
            type="color"
            value={ccPick}
            title="Colour chuno"
            onChange={(e) => setCcPick(e.target.value)}
            className="flex-none w-11 h-10 p-0.5 border border-line rounded-[9px] bg-paper cursor-pointer"
          />
          <TextInput
            placeholder="naam (optional), jaise: teal"
            value={ccName}
            onChange={(e) => setCcName(e.target.value)}
            className="flex-1 basis-[150px] min-w-[120px] !w-auto"
          />
          <TextInput
            placeholder="code daalo: #0a7d7d ya 10,125,125"
            value={ccCode}
            onChange={(e) => setCcCode(e.target.value)}
            className="flex-1 basis-[150px] min-w-[120px] !w-auto"
          />
          <Button small onClick={addColor}>
            Add colour
          </Button>
          {ccMsg && (
            <span className="basis-full text-[12px] text-clay">{ccMsg}</span>
          )}
        </div>
        <Sub>Apna colour add karoge to woh dono jagah (wall + accents) dikhega.</Sub>
      </Card>

      <Card>
        <CardTitle>Roshni kaisi ho?</CardTitle>
        <Sub>Lighting (ek choose karo)</Sub>
        <Chips>
          {allLights(s).map((l) => (
            <Chip
              key={l.k}
              label={l.label}
              on={b.light === l.k}
              custom={l.custom}
              onClick={() => mutate((d) => (d.bible.light = l.k))}
              onDelete={l.custom ? () => delLight(l.k) : undefined}
            />
          ))}
        </Chips>
        <div className="flex flex-wrap gap-2 items-center mt-3.5">
          <TextInput
            placeholder="apni lighting likho, jaise: warm golden glow"
            value={lcText}
            onChange={(e) => setLcText(e.target.value)}
            className="flex-1 basis-[150px] min-w-[120px] !w-auto"
          />
          <Button small onClick={addLight}>
            Add
          </Button>
        </div>
      </Card>

      <Card>
        <CardTitle>Kya bilkul NAHI chahiye?</CardTitle>
        <Sub>Jo pasand nahi (tap all that apply)</Sub>
        <Chips>
          {allAvoids(s).map((a) => (
            <Chip
              key={a.k}
              label={a.label}
              on={b.avoid.includes(a.k)}
              custom={a.custom}
              onClick={() =>
                mutate((d) => {
                  const i = d.bible.avoid.indexOf(a.k);
                  if (i >= 0) d.bible.avoid.splice(i, 1);
                  else d.bible.avoid.push(a.k);
                })
              }
              onDelete={a.custom ? () => delAvoid(a.k) : undefined}
            />
          ))}
        </Chips>
        <div className="flex flex-wrap gap-2 items-center mt-3.5">
          <TextInput
            placeholder="apni cheez likho, jaise: zyada metallic"
            value={avText}
            onChange={(e) => setAvText(e.target.value)}
            className="flex-1 basis-[150px] min-w-[120px] !w-auto"
          />
          <Button small onClick={addAvoid}>
            Add
          </Button>
        </div>
      </Card>

      <Card>
        <CardTitle>Aur kuch apne shabdon mein?</CardTitle>
        <Sub>Hinglish bilkul chalega. (Anything else, in your own words)</Sub>
        <TextArea
          value={b.notes}
          onChange={(e) => mutate((d) => (d.bible.notes = e.target.value))}
          placeholder="jaise: halka aur khula khula lage, zyada bhara hua na ho, ek-do plant achhe lagte hain"
        />
      </Card>

      <Card>
        <details>
          <summary className="cursor-pointer text-[13px] text-ink-soft">
            Yeh design rules ban jaate hain (for the tech person)
          </summary>
          <div className="mt-3 text-[13px] leading-relaxed text-ink-soft bg-paper border border-dashed border-line rounded-[10px] px-4 py-3.5 whitespace-pre-wrap">
            {preview.length ? preview.join("\n") : "(kuch choose karo)"}
          </div>
        </details>
      </Card>
        </div>
      </div>
    </div>
  );

  /* ---- custom option handlers ---- */
  function delColor(k: string) {
    mutate((d) => {
      d.bible.customColors = (d.bible.customColors || []).filter(
        (c) => c.k !== k,
      );
      d.bible.colors = d.bible.colors.filter((x) => x !== k);
      if (d.bible.wall === k) d.bible.wall = "";
      if (d.bible.floor === k) d.bible.floor = "";
    });
  }
  function addColor() {
    const name = ccName.trim();
    const hex = parseColor(ccCode) || ccPick;
    if (!hex) {
      setCcMsg("Sahi colour code daalo — jaise #0a7d7d ya 10,125,125.");
      return;
    }
    const k = newKey("col");
    mutate((d) => {
      d.bible.customColors = d.bible.customColors || [];
      d.bible.customColors.push({
        k,
        label: name || hex,
        hex,
        en: name || "the colour " + hex,
        custom: true,
      });
      d.bible.colors.push(k);
    });
    setCcName("");
    setCcCode("");
    setCcMsg("");
  }
  function addLight() {
    const t = lcText.trim();
    if (!t) return;
    const k = newKey("lt");
    mutate((d) => {
      d.bible.customLights = d.bible.customLights || [];
      d.bible.customLights.push({ k, label: t, en: t, custom: true });
      d.bible.light = k;
    });
    setLcText("");
  }
  function delLight(k: string) {
    mutate((d) => {
      d.bible.customLights = (d.bible.customLights || []).filter(
        (c) => c.k !== k,
      );
      if (d.bible.light === k) d.bible.light = "soft";
    });
  }
  function addAvoid() {
    const t = avText.trim();
    if (!t) return;
    const k = newKey("av");
    mutate((d) => {
      d.bible.customAvoid = d.bible.customAvoid || [];
      d.bible.customAvoid.push({ k, label: t, en: t, custom: true });
      d.bible.avoid.push(k);
    });
    setAvText("");
  }
  function delAvoid(k: string) {
    mutate((d) => {
      d.bible.customAvoid = (d.bible.customAvoid || []).filter(
        (c) => c.k !== k,
      );
      d.bible.avoid = d.bible.avoid.filter((x) => x !== k);
    });
  }
}
