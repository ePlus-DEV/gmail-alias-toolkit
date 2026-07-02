import { defineConfig } from "wxt";
import { EventEmitter } from "events";

// Fix EventEmitter maxListeners warning
EventEmitter.defaultMaxListeners = 15;

export default defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
  vite: () => ({
    define: {
      "process.emit": "(() => {})",
      "process.env": "{}",
    },
  }),
  manifest: {
    name: "Gmail Alias Toolkit",
    description:
      "Generate and manage Gmail aliases with plus addressing and presets",
    permissions: ["storage", "clipboardWrite", "contextMenus"],
    host_permissions: ["<all_urls>"],
    browser_specific_settings: {
      gecko: {
        id: "{c9d7bdb4-9d7e-4a25-8b4a-0a8d51f3b8b1}",
        // @ts-ignore - WXT doesn't support this field yet
        data_collection_permissions: {
          required: ["none"],
        },
      },
    },
  },
  autoIcons: {
    developmentIndicator: "overlay",
  },
});
