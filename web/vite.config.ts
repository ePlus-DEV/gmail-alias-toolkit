import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

const basePath = process.env.VITE_BASE_PATH ?? "/gmail-alias-toolkit/";

export default defineConfig({
  base: basePath,
  plugins: [react()],
  resolve: {
    alias: {
      src: fileURLToPath(new URL("../src", import.meta.url)),
    },
    dedupe: ["react", "react-dom"],
  },
});
