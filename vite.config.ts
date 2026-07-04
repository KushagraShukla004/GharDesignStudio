import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base '/' works for Vercel/Netlify (and any root deploy).
export default defineConfig({
  plugins: [react()],
  base: "/",
});
