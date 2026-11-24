import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const repo = path.resolve(__dirname, "../..");

// Construit la version autonome de l'Académie AMF (sans auth ni Supabase) pour la publier en artefact.
export default defineConfig({
  root: __dirname,
  base: "./",
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@/context/AuthContext", replacement: path.resolve(__dirname, "stubs/AuthContext.tsx") },
      { find: "@/components/layout/AppLayout", replacement: path.resolve(__dirname, "stubs/AppLayout.tsx") },
      { find: "@", replacement: path.resolve(repo, "src") },
    ],
  },
  css: { postcss: path.resolve(repo, "postcss.config.js") },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
