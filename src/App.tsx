import { useRef, useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Nav, type ViewId } from "./components/Nav";
import { StyleView } from "./components/StyleView";
import { RoomsView } from "./components/RoomsView";
import { WorkView } from "./components/WorkView";
import { ExportView } from "./components/ExportView";
import { useStore } from "./store";
import type { State } from "./types";
import { Button } from "./components/ui";
import { ErrorBoundary } from "./components/ErrorBoundary";

const VIEW_COMPONENTS: Record<ViewId, ComponentType> = {
  bible: StyleView,
  house: RoomsView,
  work: WorkView,
  export: ExportView,
};

export default function App() {
  const [view, setView] = useState<ViewId>("bible");
  const s = useStore((st) => st.s);
  const saveStatus = useStore((st) => st.saveStatus);
  const replaceState = useStore((st) => st.replaceState);
  const fileInput = useRef<HTMLInputElement>(null);

  const Current = VIEW_COMPONENTS[view];

  function saveFile() {
    const blob = new Blob([JSON.stringify(s, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "mera-ghar-project.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function loadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const next = JSON.parse(rd.result as string) as State;
        replaceState(next);
        alert("Project loaded.");
      } catch {
        alert("Couldn't read that file.");
      }
    };
    rd.readAsText(f);
    e.target.value = "";
  }

  return (
    <div className="grid grid-cols-[248px_1fr] max-[760px]:grid-cols-1 min-h-screen">
      {/* sidebar (top bar on mobile) */}
      <aside
        className={
          "bg-surface border-r border-line p-[26px_18px] flex flex-col gap-1.5 sticky top-0 h-screen overflow-auto " +
          "max-[760px]:static max-[760px]:h-auto max-[760px]:sticky max-[760px]:top-0 max-[760px]:z-20 " +
          "max-[760px]:flex-row max-[760px]:flex-wrap max-[760px]:items-center max-[760px]:justify-between " +
          "max-[760px]:gap-2.5 max-[760px]:p-[12px_16px] max-[760px]:border-r-0 max-[760px]:border-b"
        }
      >
        <div className="mx-1.5 mb-[22px] max-[760px]:m-0 max-[760px]:flex-1">
          <h1 className="font-serif font-medium text-[22px] max-[760px]:text-[17px] leading-tight m-0 tracking-tight">
            Ghar Design
            <br className="max-[760px]:hidden" /> Studio
          </h1>
          <span className="text-[12px] text-ink-soft block mt-1 max-[760px]:hidden">
            Apni pasand chuno · prompt apne aap ban jayega
          </span>
        </div>

        <Nav current={view} onChange={setView} />

        <div
          className={
            "mt-auto pt-[18px] border-t border-line flex flex-col gap-2 " +
            "max-[760px]:m-0 max-[760px]:p-0 max-[760px]:border-0 max-[760px]:flex-row max-[760px]:gap-2 max-[760px]:flex-none"
          }
        >
          <Button small onClick={saveFile} className="max-[760px]:!px-2.5">
            Save to file
          </Button>
          <Button
            small
            onClick={() => fileInput.current?.click()}
            className="max-[760px]:!px-2.5"
          >
            Load from file
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={loadFile}
          />
          <AnimatePresence mode="wait">
            <motion.p
              key={saveStatus}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[11px] text-ink-soft leading-snug max-[760px]:hidden"
            >
              {saveStatus}
            </motion.p>
          </AnimatePresence>
        </div>
      </aside>

      {/* main content */}
      <main className="p-[40px_48px_80px] max-w-content max-[760px]:p-[18px_16px_100px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <ErrorBoundary
              fallback={
                <div className="text-center py-[60px] px-4">
                  <p className="text-ink font-medium mb-1">
                    Kuch gadbad ho gayi.
                  </p>
                  <p className="text-ink-soft text-[14px]">
                    Page reload karo — aapka kaam save hai.
                  </p>
                </div>
              }
            >
              <Current />
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
