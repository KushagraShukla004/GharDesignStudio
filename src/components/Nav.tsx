import { motion } from "framer-motion";

export type ViewId = "bible" | "house" | "work" | "export";

export const VIEWS: {
  id: ViewId;
  step: string;
  full: string;
  short: string;
}[] = [
  { id: "bible", step: "1", full: "Style", short: "Style" },
  { id: "house", step: "2", full: "Rooms", short: "Rooms" },
  { id: "work", step: "3", full: "Build a prompt", short: "Build" },
  { id: "export", step: "4", full: "Export file", short: "Export" },
];

export function Nav({
  current,
  onChange,
}: {
  current: ViewId;
  onChange: (v: ViewId) => void;
}) {
  return (
    <nav
      className={
        // desktop: vertical list. mobile: fixed bottom tab bar.
        "flex flex-col gap-0.5 " +
        "max-[760px]:fixed max-[760px]:left-0 max-[760px]:right-0 max-[760px]:bottom-0 max-[760px]:z-30 " +
        "max-[760px]:flex-row max-[760px]:gap-1 max-[760px]:bg-surface max-[760px]:border-t max-[760px]:border-line " +
        "max-[760px]:px-1.5 max-[760px]:pt-1.5 max-[760px]:shadow-tabbar " +
        "max-[760px]:pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))]"
      }
    >
      {VIEWS.map((v) => {
        const active = current === v.id;
        return (
          <button
            key={v.id}
            onClick={() => onChange(v.id)}
            className={
              "relative text-left border-none bg-none cursor-pointer font-sans rounded-[10px] flex items-center gap-2.5 " +
              "px-3 py-2.5 " +
              "max-[760px]:flex-1 max-[760px]:min-w-0 max-[760px]:flex-col max-[760px]:gap-[3px] max-[760px]:items-center " +
              "max-[760px]:justify-center max-[760px]:px-0.5 max-[760px]:py-[7px] max-[760px]:text-[11px] max-[760px]:text-center " +
              (active
                ? "text-ink font-medium"
                : "text-ink-soft hover:text-ink hover:bg-paper")
            }
          >
            {active && (
              <motion.span
                layoutId="nav-active"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                className="absolute inset-0 rounded-[10px] bg-sage-soft max-[760px]:rounded-[10px]"
              />
            )}
            <span
              className={
                "relative z-10 font-serif text-[13px] w-[22px] h-[22px] grid place-items-center rounded-[7px] flex-none max-[760px]:w-6 max-[760px]:h-6 " +
                (active
                  ? "bg-sage text-[#17150f]"
                  : "bg-surface-2 text-ink-soft")
              }
            >
              {v.step}
            </span>
            <span className="relative z-10 max-[760px]:hidden">{v.full}</span>
            <span className="relative z-10 hidden max-[760px]:inline leading-none">
              {v.short}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
