import { defineConfig } from "wxt";
import { EventEmitter } from "events";

// Fix EventEmitter maxListeners warning
EventEmitter.defaultMaxListeners = 15;

export default defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
  manifest: {
    name: "Gmail Alias Toolkit",
    description:
      "Local-first Gmail plus alias manager. No account. No server. No tracking.",
    permissions: ["storage", "tabs", "activeTab", "clipboardWrite", "contextMenus"],
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
  } as any,
  autoIcons: {
    developmentIndicator: "overlay",
  },
});
