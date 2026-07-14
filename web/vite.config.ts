import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  base: "/gmail-alias-toolkit/",
  plugins: [react()],
  resolve: {
    alias: {
      src: fileURLToPath(new URL("../src", import.meta.url)),
    },
    dedupe: ["react", "react-dom"],
  },
});
