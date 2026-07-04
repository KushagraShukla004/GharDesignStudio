import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, newKey } from "../store";
import { allReqs, buildEdit, buildFresh } from "../lib/prompt";
import type { Aspect } from "../types";
import {
  Card,
  CardTitle,
  Sub,
  Chip,
  Chips,
  Button,
  CopyButton,
  TextInput,
  TextArea,
  Field,
  ViewHeader,
  btnClass,
} from "./ui";

export function WorkView() {
  const s = useStore((st) => st.s);
  const mutate = useStore((st) => st.mutate);

  const [active, setActive] = useState<number | null>(null);
  const [useCamera, setUseCamera] = useState(true);
  const [useLock, setUseLock] = useState(true);
  const [reqText, setReqText] = useState("");
  const [editChange, setEditChange] = useState("");

  const room = active !== null ? s.rooms[active] : undefined;

  const freshPrompt = useMemo(
    () => (room ? buildFresh(s, room, { useCamera, useLock }) : ""),
    [s, room, useCamera, useLock],
  );
  const editPrompt = useMemo(() => buildEdit(editChange), [editChange]);

  return (
    <div>
      <ViewHeader
        eyebrow="Ek baar mein ek kamra"
        title="Build a prompt"
        lead="Kamra choose karo, jo chahiye woh tap karo — prompt neeche apne aap ban jayega. Copy karke Google AI Studio (Nano Banana) mein paste kar do."
      />
      <div className="text-[12.5px] text-ink-soft bg-sage-soft border border-line rounded-[10px] px-3.5 py-3 leading-normal mb-[18px]">
        <strong>Aise use karein:</strong> kamra chuno → jo chahiye woh tap karo →
        "Copy prompt" → "Open AI Studio" dabao → wahan paste karo.{" "}
        <em>
          Pehli baar model list mein se "Nano Banana" (Gemini image) chun lena.
        </em>
      </div>

      <Card>
        <CardTitle>Kaunsa kamra?</CardTitle>
        {s.rooms.length === 0 ? (
          <p className="text-ink-soft text-center py-[30px]">
            Pehle step 2 mein kamre add karo.
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {s.rooms.map((r, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.99 }}
                onClick={() => setActive(i)}
                className={
                  "flex justify-between items-center text-left font-sans cursor-pointer rounded-[10px] px-3.5 py-3 border text-ink " +
                  (i === active
                    ? "bg-sage-soft border-sage"
                    : "bg-paper border-line hover:border-sage")
                }
              >
                <span>{r.name || "Untitled"}</span>
                <span className="text-[11px] bg-surface-2 text-ink-soft rounded-full px-2.5 py-0.5">
                  {(r.reqs || []).length} chuna · {(r.log || []).length} saved
                </span>
              </motion.button>
            ))}
          </div>
        )}
      </Card>

      <AnimatePresence>
        {room && active !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden" }}
          >
            {/* requirements */}
            <Card>
              <CardTitle>Is kamre mein kya chahiye?</CardTitle>
              <Sub>Tap karke chuno (tap to add)</Sub>
              <Chips>
                {allReqs(s).map((req) => (
                  <Chip
                    key={req.k}
                    label={req.label}
                    on={(room.reqs || []).includes(req.k)}
                    custom={req.custom}
                    onClick={() =>
                      mutate((d) => {
                        const rr = d.rooms[active];
                        rr.reqs = rr.reqs || [];
                        const i = rr.reqs.indexOf(req.k);
                        if (i >= 0) rr.reqs.splice(i, 1);
                        else rr.reqs.push(req.k);
                      })
                    }
                    onDelete={req.custom ? () => delReq(req.k) : undefined}
                  />
                ))}
              </Chips>
              <div className="flex flex-wrap gap-2 items-center mt-3.5">
                <TextInput
                  value={reqText}
                  onChange={(e) => setReqText(e.target.value)}
                  placeholder="apni cheez likho, jaise: bookshelf"
                  className="flex-1 basis-[150px] min-w-[120px] !w-auto"
                />
                <Button small onClick={addReq}>
                  Add
                </Button>
              </div>
              <div className="mt-4">
                <Field label="Kuch aur, apne shabdon mein" hint="Hinglish ok">
                  <TextArea
                    value={room.free}
                    onChange={(e) =>
                      mutate((d) => (d.rooms[active].free = e.target.value))
                    }
                    placeholder="jaise: khidki ke paas baithne ki jagah, tables pe saaman kam ho"
                  />
                </Field>
              </div>
            </Card>

            {/* references */}
            <Card>
              <CardTitle>
                Reference photos{" "}
                <span className="font-normal text-ink-soft text-[13px]">
                  (optional)
                </span>
              </CardTitle>
              <Sub>
                Agar Pinterest ki photo AI Studio mein upload karoge, to bata do
                har photo se kya lena hai. Image 1 = aapka floor plan.
              </Sub>
              <div className="flex flex-col gap-2 mb-2.5">
                {(room.refs || []).map((ref, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[130px_1fr_auto] max-[760px]:grid-cols-1 gap-2.5 items-center"
                  >
                    <TextInput
                      value={ref.img}
                      placeholder="Image 2"
                      onChange={(e) =>
                        mutate((d) => (d.rooms[active].refs[i].img = e.target.value))
                      }
                      className="!m-0"
                    />
                    <TextInput
                      value={ref.use}
                      placeholder="iski TV wall lo"
                      onChange={(e) =>
                        mutate((d) => (d.rooms[active].refs[i].use = e.target.value))
                      }
                      className="!m-0"
                    />
                    <Button
                      variant="ghost"
                      onClick={() =>
                        mutate((d) => d.rooms[active].refs.splice(i, 1))
                      }
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                small
                onClick={() =>
                  mutate((d) => {
                    const rr = d.rooms[active];
                    rr.refs = rr.refs || [];
                    rr.refs.push({
                      img: "Image " + (rr.refs.length + 2),
                      use: "",
                    });
                  })
                }
              >
                Add reference
              </Button>
            </Card>

            {/* camera & quality */}
            <Card>
              <CardTitle>Camera &amp; quality</CardTitle>
              <label className="flex items-center gap-2.5 text-[13px] text-ink-soft mb-3.5">
                <input
                  type="checkbox"
                  checked={useCamera}
                  onChange={(e) => setUseCamera(e.target.checked)}
                  className="w-4 h-4 accent-sage"
                />
                Photo-quality camera settings lagao
              </label>
              <label className="flex items-center gap-2.5 text-[13px] text-ink-soft mb-3.5">
                <input
                  type="checkbox"
                  checked={useLock}
                  onChange={(e) => setUseLock(e.target.checked)}
                  className="w-4 h-4 accent-sage"
                />
                Layout lock karo (deewarein/khidkiyan na badlein)
              </label>
              <Field
                label="Photo orientation"
                hint="phone screenshot wala plan tall photo banata hai — isse wide rakho"
              >
                <select
                  value={s.aspect}
                  onChange={(e) =>
                    mutate((d) => (d.aspect = e.target.value as Aspect))
                  }
                  className="w-full font-sans text-ink bg-paper border border-line rounded-[10px] px-3 py-2.5 focus:outline focus:outline-2 focus:outline-sage max-[760px]:text-[16px]"
                >
                  <option value="landscape">Landscape — wide (recommended)</option>
                  <option value="portrait">Portrait — tall</option>
                  <option value="square">Square</option>
                </select>
              </Field>
            </Card>

            {/* fresh prompt output */}
            <Card>
              <CardTitle>Aapka prompt — naya render</CardTitle>
              <pre className="prompt-pre max-h-[420px] max-[760px]:max-h-[340px]">
                {freshPrompt}
              </pre>
              <div className="flex flex-wrap gap-2.5 items-center mt-3">
                <CopyButton
                  variant="primary"
                  text={freshPrompt}
                  label="Copy prompt"
                  toast="Copied — paste into AI Studio or ChatGPT"
                />
                <a
                  className={btnClass()}
                  href="https://aistudio.google.com/prompts/new_chat?model=gemini-2.5-flash-image"
                  target="_blank"
                  rel="noopener"
                >
                  Open AI Studio
                </a>
                <a
                  className={btnClass()}
                  href="https://chatgpt.com/"
                  target="_blank"
                  rel="noopener"
                >
                  Open ChatGPT
                </a>
                <Button small onClick={saveToRoom}>
                  Save to this room
                </Button>
              </div>
              <p className="text-[13px] text-ink-soft mt-3 mb-0">
                {s.house.plan
                  ? "Yaad rahe: AI Studio mein apna floor plan sabse pehle upload karna — woh “Image 1” ban jata hai, tabhi layout sahi aayega."
                  : "Floor plan abhi upload nahi hua. Step 2 (Rooms) mein plan upload karo, phir AI Studio mein use “Image 1” ke roop mein daalo — warna layout galat aa sakta hai."}
              </p>
            </Card>

            {/* edit prompt */}
            <Card>
              <CardTitle>
                Kuch cheezein badalni hain?{" "}
                <span className="font-normal text-ink-soft text-[13px]">
                  (achhi photo milne ke baad)
                </span>
              </CardTitle>
              <Sub>
                Jo cheezein badalni hain woh likho — har ek alag line mein. Baaki
                sab same rahega.
              </Sub>
              <TextArea
                value={editChange}
                onChange={(e) => setEditChange(e.target.value)}
                className="min-h-[96px]"
                placeholder={
                  "jaise:\nsofa ko beige teen-seater se badal do\ndeewar ka colour halka grey kar do\nek aur plant add karo"
                }
              />
              <pre className="prompt-pre mt-3.5 max-h-[420px]">{editPrompt}</pre>
              <div className="flex flex-wrap gap-2.5 items-center mt-3">
                <CopyButton
                  variant="primary"
                  text={editPrompt}
                  label="Copy change prompt"
                />
              </div>
            </Card>

            {/* saved log */}
            <Card>
              <CardTitle>Is kamre ke saved prompts</CardTitle>
              {!room.log || room.log.length === 0 ? (
                <p className="text-ink-soft text-center py-[30px]">
                  Abhi koi saved prompt nahi.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {room.log.map((item, i) => (
                    <div
                      key={i}
                      className="bg-paper border border-line rounded-[10px] px-3.5 py-3"
                    >
                      <div className="text-[11px] text-ink-soft mb-1">
                        {item.when}
                      </div>
                      <div className="text-[12.5px] text-ink-soft max-h-[60px] overflow-hidden leading-snug whitespace-pre-wrap">
                        {item.txt}
                      </div>
                      <div className="flex gap-2.5 items-center mt-2">
                        <CopyButton small text={item.txt} variant="ghost" />
                        <Button
                          variant="ghost"
                          onClick={() =>
                            mutate((d) => d.rooms[active].log.splice(i, 1))
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  function addReq() {
    if (active === null) return;
    const t = reqText.trim();
    if (!t) return;
    const k = newKey("req");
    mutate((d) => {
      d.customReqs = d.customReqs || [];
      d.customReqs.push({ k, label: t, en: t, custom: true });
      const rr = d.rooms[active];
      rr.reqs = rr.reqs || [];
      rr.reqs.push(k);
    });
    setReqText("");
  }
  function delReq(k: string) {
    mutate((d) => {
      d.customReqs = (d.customReqs || []).filter((x) => x.k !== k);
      d.rooms.forEach((r) => {
        r.reqs = (r.reqs || []).filter((x) => x !== k);
      });
    });
  }
  function saveToRoom() {
    if (active === null) return;
    mutate((d) => {
      const rr = d.rooms[active];
      rr.log = rr.log || [];
      rr.log.unshift({ when: new Date().toLocaleString(), txt: freshPrompt });
    });
  }
}
