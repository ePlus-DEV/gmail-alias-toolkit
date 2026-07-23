import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import { resolveLatestReleaseVersion } from "./release-version";

const basePath = process.env.VITE_BASE_PATH ?? "/gmail-alias-toolkit/";

export default defineConfig(async () => {
  const releaseVersion = await resolveLatestReleaseVersion();

  return {
    base: basePath,
    plugins: [react()],
    define: {
      "import.meta.env.VITE_APP_VERSION": JSON.stringify(releaseVersion),
    },
    resolve: {
      alias: {
        src: fileURLToPath(new URL("../src", import.meta.url)),
      },
      dedupe: ["react", "react-dom"],
    },
  };
});
