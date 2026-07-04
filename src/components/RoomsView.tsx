import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store";
import { EXTRACT_PROMPT } from "../data/tables";
import {
  Card,
  CardTitle,
  Sub,
  Button,
  CopyButton,
  TextInput,
  TextArea,
  Field,
  ViewHeader,
} from "./ui";
import type { Room } from "../types";

const esc = (t: string) => (t || "").trim();

export function RoomsView() {
  const s = useStore((st) => st.s);
  const mutate = useStore((st) => st.mutate);

  const [active, setActive] = useState(0);
  const [newRoom, setNewRoom] = useState("");
  const [importBox, setImportBox] = useState("");
  const [importMsg, setImportMsg] = useState("");
  const planInput = useRef<HTMLInputElement>(null);

  const room = s.rooms[Math.min(active, s.rooms.length - 1)];

  return (
    <div>
      <ViewHeader
        eyebrow="Jo AI khud nahi dekh sakta"
        title="Rooms"
        lead="AI ko aapke kamre ka size, khidkiyan ya dhoop nahi pata. Jo pata ho woh yahan ek baar likh do — baaki khaali chhod sakte ho."
      />

      {/* floor plan */}
      <Card>
        <CardTitle>Floor plan upload karo</CardTitle>
        <Sub>
          Apne ghar ki layout ki photo daalo. Yahi photo AI Studio mein bhi
          upload karna (woh "Image 1" hai).
        </Sub>
        <div className="flex flex-wrap gap-2.5 items-center mb-3">
          <Button small onClick={() => planInput.current?.click()}>
            Choose photo
          </Button>
          {s.house.plan && (
            <Button variant="ghost" onClick={() => mutate((d) => (d.house.plan = ""))}>
              Remove
            </Button>
          )}
          <input
            ref={planInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPlanFile}
          />
        </div>
        {s.house.plan && (
          <img
            src={s.house.plan}
            alt="floor plan"
            className="max-w-full border border-line rounded-[10px]"
          />
        )}
        <div className="mt-3.5">
          <Field label="Total / carpet area" hint="plan pe likha hota hai">
            <TextInput
              value={s.house.area}
              onChange={(e) => mutate((d) => (d.house.area = e.target.value))}
            />
          </Field>
        </div>

        <details className="mt-1.5">
          <summary className="cursor-pointer text-[13px] text-ink-soft">
            Measurements khud bharne ke bajaye, AI Studio se nikaalo
          </summary>
          <div className="mt-3">
            <Sub>
              1) Yeh prompt copy karo. 2) AI Studio mein plan ki photo ke saath
              paste karo. 3) Jo JSON aaye usko copy karke neeche paste karke
              "Import" dabao — kamre apne aap bhar jayenge.
            </Sub>
            <div className="flex flex-wrap gap-2.5 items-center mb-2.5">
              <CopyButton
                small
                text={EXTRACT_PROMPT}
                label="Copy extraction prompt"
              />
            </div>
            <TextArea
              value={importBox}
              onChange={(e) => setImportBox(e.target.value)}
              placeholder={
                'Yahan JSON paste karo, jaise: {"rooms":[{"name":"Living","size":"12 x 18 ft"}]}'
              }
              className="min-h-[90px]"
            />
            <div className="flex flex-wrap gap-2.5 items-center mt-2.5">
              <Button variant="primary" small onClick={doImport}>
                Import
              </Button>
              <span className="text-[13px] text-ink-soft">{importMsg}</span>
            </div>
          </div>
        </details>
      </Card>

      {/* house-wide rules */}
      <Card>
        <CardTitle>Poore ghar ke rules</CardTitle>
        <Field label="Kya fix rakhna hai" hint="deewarein, kitchen, bathroom">
          <TextArea
            value={s.house.globals}
            onChange={(e) => mutate((d) => (d.house.globals = e.target.value))}
          />
        </Field>
        <Field label="Mausam / ghar" hint="optional">
          <TextInput
            value={s.house.climate}
            onChange={(e) => mutate((d) => (d.house.climate = e.target.value))}
          />
        </Field>
      </Card>

      {/* room list + editor */}
      <Card>
        <CardTitle>Kamron ki list</CardTitle>
        <div className="flex flex-col gap-1.5 mb-3.5">
          {s.rooms.map((r, i) => (
            <RoomListButton
              key={i}
              room={r}
              active={i === active}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2.5 items-center">
          <TextInput
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
            placeholder="Naya kamra, jaise: Study"
            className="flex-1 min-w-[160px] !w-auto"
          />
          <Button small onClick={addRoom}>
            Add
          </Button>
        </div>
        <div className="h-px bg-line my-[22px]" />
        {room ? (
          <RoomEditor
            key={active}
            index={Math.min(active, s.rooms.length - 1)}
            onDeleted={() => setActive((a) => Math.max(0, a - 1))}
          />
        ) : (
          <p className="text-ink-soft text-center py-[30px]">
            Upar se ek kamra choose karo.
          </p>
        )}
      </Card>
    </div>
  );

  function onPlanFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const rd = new FileReader();
    rd.onload = () => {
      const im = new Image();
      im.onload = () => {
        const max = 1100;
        const scale = Math.min(1, max / Math.max(im.width, im.height));
        const c = document.createElement("canvas");
        c.width = im.width * scale;
        c.height = im.height * scale;
        c.getContext("2d")!.drawImage(im, 0, 0, c.width, c.height);
        let data: string;
        try {
          data = c.toDataURL("image/jpeg", 0.82);
        } catch {
          data = rd.result as string;
        }
        mutate((d) => (d.house.plan = data));
      };
      im.src = rd.result as string;
    };
    rd.readAsDataURL(f);
    e.target.value = "";
  }

  function addRoom() {
    const name = newRoom.trim() || "Naya kamra";
    mutate((d) =>
      d.rooms.push({
        name,
        size: "",
        windows: "",
        sun: "",
        fixed: "",
        reqs: [],
        free: "",
        refs: [],
        log: [],
      }),
    );
    setNewRoom("");
    setActive(s.rooms.length); // new last index
  }

  function doImport() {
    let raw = importBox.trim();
    if (!raw) {
      setImportMsg("Paste the JSON first.");
      return;
    }
    raw = raw
      .replace(/^```(json)?/i, "")
      .replace(/```$/, "")
      .trim();
    let data: { rooms?: { name?: string; size?: string; dimensions?: string }[]; area?: string } | { name?: string; size?: string }[];
    try {
      data = JSON.parse(raw);
    } catch {
      setImportMsg("That JSON isn't valid — copy it again from AI Studio.");
      return;
    }
    const incoming = Array.isArray(data) ? data : data.rooms || [];
    if (!incoming.length) {
      setImportMsg("No rooms found in the JSON.");
      return;
    }
    let updated = 0;
    let added = 0;
    const area = !Array.isArray(data) ? data.area : undefined;
    mutate((d) => {
      incoming.forEach((it) => {
        const nm = esc(it.name || "");
        if (!nm) return;
        const sz = esc((it as { size?: string; dimensions?: string }).size || (it as { dimensions?: string }).dimensions || "");
        const match = d.rooms.find(
          (r) =>
            (r.name || "").toLowerCase().trim() === nm.toLowerCase().trim() ||
            (r.name || "").toLowerCase().includes(nm.toLowerCase()),
        );
        if (match) {
          if (sz) match.size = sz;
          updated++;
        } else {
          d.rooms.push({
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
      if (area) d.house.area = esc(area);
    });
    setImportMsg(
      `Done — ${updated} updated, ${added} added.${area ? " Area filled too." : ""}`,
    );
    setImportBox("");
  }
}

function RoomListButton({
  room,
  active,
  onClick,
}: {
  room: Room;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={
        "flex justify-between items-center text-left font-sans cursor-pointer rounded-[10px] px-3.5 py-3 border text-ink " +
        (active ? "bg-sage-soft border-sage" : "bg-paper border-line hover:border-sage")
      }
    >
      <span>{room.name || "Untitled"}</span>
      <span className="text-[12px] text-ink-soft">
        {room.size ? room.size : "size nahi"}
      </span>
    </motion.button>
  );
}

function RoomEditor({
  index,
  onDeleted,
}: {
  index: number;
  onDeleted: () => void;
}) {
  const s = useStore((st) => st.s);
  const mutate = useStore((st) => st.mutate);
  const r = s.rooms[index];
  if (!r) return null;

  const set = (key: keyof Room, value: string) =>
    mutate((d) => {
      // @ts-expect-error narrow string keys only
      d.rooms[index][key] = value;
    });

  return (
    <div>
      <Field label="Kamre ka naam">
        <TextInput value={r.name} onChange={(e) => set("name", e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 max-[760px]:grid-cols-1 gap-4">
        <Field label="Approx size" hint="jaise 16 x 14 ft — optional">
          <TextInput value={r.size} onChange={(e) => set("size", e.target.value)} />
        </Field>
        <Field label="Khidkiyan" hint="kahan/kitni">
          <TextInput
            value={r.windows}
            onChange={(e) => set("windows", e.target.value)}
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 max-[760px]:grid-cols-1 gap-4">
        <Field label="Dhoop kis taraf" hint="jaise subah ki dhoop east se">
          <TextInput value={r.sun} onChange={(e) => set("sun", e.target.value)} />
        </Field>
        <Field label="Fix cheezein" hint="jo na badle">
          <TextInput
            value={r.fixed}
            onChange={(e) => set("fixed", e.target.value)}
          />
        </Field>
      </div>
      <div className="flex flex-wrap gap-2.5 items-center">
        <Button
          variant="ghost"
          onClick={() => {
            if (
              confirm(
                'Delete "' +
                  (r.name || "this room") +
                  '"? Its saved prompts will be lost too.',
              )
            ) {
              mutate((d) => d.rooms.splice(index, 1));
              onDeleted();
            }
          }}
        >
          Delete this room
        </Button>
      </div>
    </div>
  );
}
