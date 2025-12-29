import { defineConfig } from "wxt";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "Gmail Alias Toolkit",
    description:
      "Generate and manage Gmail aliases with plus addressing and presets",
    version: "1.0.0",
    permissions: ["storage", "clipboardWrite"],
  },
});
