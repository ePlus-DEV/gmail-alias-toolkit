import { defineConfig } from "wxt";
import { EventEmitter } from "events";
import { fileURLToPath } from "node:url";

// Fix EventEmitter maxListeners warning
EventEmitter.defaultMaxListeners = 15;

// Dev-only sites to limit reload spam during development
const DEV_SITES = [
  "*://gmail.com/*",
  "*://mail.google.com/*",
  "*://github.com/*",
  "*://example.com/*",
  "*://localhost/*",
  "*://127.0.0.1/*",
];

const isProduction = process.env.NODE_ENV === "production";
const hostPermissions = isProduction ? ["<all_urls>"] : DEV_SITES;

export default defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
  vite: () => ({
    define: {
      "process.emit": "(() => {})",
      "process.env": "{}",
    },
    resolve: {
      alias: {
        src: fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  }),
  manifest: {
    name: "__MSG_extensionName__",
    description: "__MSG_extensionDescription__",
    default_locale: "en",
    action: {
      default_title: "__MSG_extensionName__",
    },
    permissions: ["storage", "clipboardWrite", "contextMenus"],
    host_permissions: hostPermissions,
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
