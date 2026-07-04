import { motion, AnimatePresence } from "framer-motion";
import { useState, type ReactNode } from "react";

/* ---------- clipboard (needs HTTPS; falls back to execCommand) ---------- */
export function copyText(txt: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard
      .writeText(txt)
      .then(() => true)
      .catch(() => legacyCopy(txt));
  }
  return Promise.resolve(legacyCopy(txt));
}
function legacyCopy(txt: string): boolean {
  const ta = document.createElement("textarea");
  ta.value = txt;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  ta.remove();
  return ok;
}

/* ---------- Card ---------- */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={
        "bg-surface border border-line rounded-card shadow-card p-[22px_24px] mb-[18px] max-[760px]:p-[18px_16px] " +
        className
      }
    >
      {children}
    </motion.div>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-serif font-medium text-[18px] m-0 mb-1.5">
      {children}
    </h3>
  );
}

export function Sub({ children }: { children: ReactNode }) {
  return <p className="text-[13px] text-ink-soft m-0 mb-3.5">{children}</p>;
}

/* ---------- Chip ---------- */
export function Chip({
  label,
  on,
  hex,
  custom,
  onClick,
  onDelete,
}: {
  label: string;
  on: boolean;
  hex?: string;
  custom?: boolean;
  onClick: () => void;
  onDelete?: () => void;
}) {
  const swatch = hex !== undefined;
  return (
    <motion.button
      layout
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={
        "font-sans text-[13.5px] max-[760px]:text-[14px] cursor-pointer rounded-full inline-flex items-center gap-2 border transition-colors " +
        "px-3.5 py-2 max-[760px]:py-[9px] " +
        (on
          ? "bg-sage-soft border-sage text-ink font-medium"
          : "bg-paper border-line text-ink-soft hover:border-sage") +
        (swatch && on ? " ring-2 ring-sage ring-inset" : "")
      }
    >
      {swatch && (
        <span
          className="w-[15px] h-[15px] rounded-full flex-none border border-white/20"
          style={{ background: hex }}
        />
      )}
      {!swatch && on && <span className="text-sage">✓</span>}
      <span>{label}</span>
      {custom && onDelete && (
        <span
          role="button"
          title="Remove"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-50 font-bold leading-none px-px hover:opacity-100 hover:text-clay"
        >
          ×
        </span>
      )}
    </motion.button>
  );
}

export function Chips({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

/* ---------- Button ---------- */
type BtnVariant = "default" | "primary" | "ghost";
export function Button({
  children,
  variant = "default",
  small,
  className = "",
  ...rest
}: {
  children: ReactNode;
  variant?: BtnVariant;
  small?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      className={btnClass(variant, small) + " " + className}
      {...(rest as object)}
    >
      {children}
    </motion.button>
  );
}

export function btnClass(variant: BtnVariant = "default", small?: boolean) {
  const base =
    "font-sans font-medium cursor-pointer rounded-[10px] border inline-flex items-center justify-center transition-[background,filter]";
  const pad = small
    ? "px-3 py-1.5 text-[13px] max-[760px]:px-3 max-[760px]:py-2"
    : "px-4 py-2.5 max-[760px]:py-[11px]";
  const look =
    variant === "primary"
      ? "bg-sage border-sage text-[#17150f] font-semibold hover:brightness-110"
      : variant === "ghost"
        ? "bg-transparent border-transparent text-ink-soft px-2 py-1.5 hover:text-clay"
        : "bg-surface border-line text-ink hover:bg-paper";
  return `${base} ${variant === "ghost" ? "" : pad} ${look}`;
}

/* ---------- Toast (transient inline label) ---------- */
export function InlineToast({
  show,
  children,
}: {
  show: boolean;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          className="text-[13px] text-ok"
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

/** A button that copies text and flashes a transient label. */
export function CopyButton({
  text,
  label = "Copy",
  toast = "Copied",
  variant = "default",
  small,
}: {
  text: string;
  label?: string;
  toast?: string;
  variant?: BtnVariant;
  small?: boolean;
}) {
  const [shown, setShown] = useState(false);
  return (
    <>
      <Button
        variant={variant}
        small={small}
        onClick={async () => {
          const ok = await copyText(text);
          if (ok) {
            setShown(true);
            setTimeout(() => setShown(false), 1600);
          } else {
            alert("Copy nahi hua — text manually select karo.");
          }
        }}
      >
        {label}
      </Button>
      <InlineToast show={shown}>{toast}</InlineToast>
    </>
  );
}

/* ---------- Form inputs (shared styling) ---------- */
const inputCls =
  "w-full font-sans text-ink bg-paper border border-line rounded-[10px] px-3 py-2.5 focus:outline focus:outline-2 focus:outline-sage focus:outline-offset-1 focus:border-transparent max-[760px]:text-[16px]";

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return <input type="text" {...props} className={inputCls + " " + (props.className || "")} />;
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={
        inputCls + " min-h-[64px] leading-normal resize-y " + (props.className || "")
      }
    />
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="block text-[13px] font-medium mb-1.5">
        {label}
        {hint && <span className="font-normal text-ink-soft"> {hint}</span>}
      </label>
      {children}
    </div>
  );
}

/* ---------- Page header ---------- */
export function ViewHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead: string;
}) {
  return (
    <>
      <p className="text-[12px] tracking-[0.14em] uppercase text-clay font-semibold m-0 mb-2">
        {eyebrow}
      </p>
      <h2 className="font-serif font-medium text-[30px] max-[760px]:text-[25px] m-0 mb-1.5 tracking-tight">
        {title}
      </h2>
      <p className="text-ink-soft m-0 mb-[30px] max-[760px]:mb-[22px] max-w-[62ch]">
        {lead}
      </p>
    </>
  );
}
