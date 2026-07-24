import { defineConfig } from "wxt";
import { EventEmitter } from "events";
import { fileURLToPath } from "node:url";
import { resolveInlineDevMatches } from "./scripts/inline-dev-matches.mjs";

// Fix EventEmitter maxListeners warning
EventEmitter.defaultMaxListeners = 15;

const ALL_URLS = ["<all_urls>"];

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
  /** Resolves mode-specific env matches for both host permissions and injection. */
  manifest: ({ mode }) => {
    const developmentMatches = resolveInlineDevMatches(mode);

    return {
      name: "__MSG_extensionName__",
      description: "__MSG_extensionDescription__",
      default_locale: "en",
      action: {
        default_title: "__MSG_extensionName__",
      },
      permissions: ["storage", "clipboardWrite", "contextMenus"],
      host_permissions:
        mode === "development" ? developmentMatches : ALL_URLS,
      browser_specific_settings: {
        gecko: {
          id: "{c9d7bdb4-9d7e-4a25-8b4a-0a8d51f3b8b1}",
          // @ts-ignore - WXT doesn't support this field yet
          data_collection_permissions: {
            required: ["none"],
          },
        },
      },
    };
  },
  hooks: {
    "entrypoints:resolved": (wxt, entrypoints) => {
      const inlineContentScript = entrypoints.find(
        (entrypoint) =>
          entrypoint.type === "content-script" && entrypoint.name === "content",
      );

      if (inlineContentScript?.type !== "content-script") {
        throw new Error("Inline content script entrypoint was not resolved.");
      }

      inlineContentScript.options.matches =
        wxt.config.mode === "development"
          ? resolveInlineDevMatches(wxt.config.mode)
          : [...ALL_URLS];
    },
  },
  autoIcons: {
    developmentIndicator: "overlay",
  },
});
