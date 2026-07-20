import { defineConfig } from "wxt";
import { EventEmitter } from "events";
import { fileURLToPath } from "node:url";

// Fix EventEmitter maxListeners warning
EventEmitter.defaultMaxListeners = 15;

// Dev-only sites to limit reload spam during development
const DEV_SITES = [
  "*:///miro.com/*",
  "*://mail.google.com/*",
  "*://github.com/*",
  "*://selfh.st/*",
  "*://localhost/*",
  "*://127.0.0.1/*",
];

// WXT runs 'wxt' for dev and 'wxt build' for production
const isBuild = process.argv.includes("build");
const hostPermissions = isBuild ? ["<all_urls>"] : DEV_SITES;

export default defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
  vite: () => ({
    define: {
      "process.emit": "(() => {})",
      "process.env": "{}",
      __DEV_MODE__: JSON.stringify(!isBuild),
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
