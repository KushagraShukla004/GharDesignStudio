/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark, modern, royal-luxury interior palette:
        // deep warm near-black + brass/gold accents.
        paper: "#131210", // page background (deep warm charcoal)
        surface: "#1c1a15", // cards / sidebar
        "surface-2": "#2a271f", // chips, pills, step badges
        ink: "#efe9dc", // primary text (warm ivory)
        "ink-soft": "#a49a86", // secondary text
        line: "#37322a", // borders / dividers
        sage: "#c8a24c", // PRIMARY accent — brass/gold
        "sage-soft": "#2f2818", // active/hover highlight (warm dark gold)
        clay: "#d99a5c", // eyebrows / secondary accent (copper)
        ok: "#6cc0a0", // success (soft emerald)
      },
      fontFamily: {
        serif: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.4), 0 10px 30px rgba(0,0,0,0.45)",
        tabbar: "0 -2px 18px rgba(0,0,0,0.5)",
      },
      maxWidth: {
        content: "1180px",
      },
    },
  },
  plugins: [],
};
