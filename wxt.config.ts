import { defineConfig } from "wxt";
import { EventEmitter } from "events";

// Fix EventEmitter maxListeners warning
EventEmitter.defaultMaxListeners = 15;

export default defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
  manifest: {
    name: "Gmail Alias Toolkit",
    description:
      "Generate and manage Gmail aliases with plus addressing and presets",
    version: "1.0.0",
    permissions: ["storage", "clipboardWrite", "contextMenus", "activeTab"],
    browser_specific_settings: {
      gecko: {
        id: "{71243e5a-8ec2-41a5-8ef5-f2861ebd8fed}",
      },
    },
  },
  autoIcons: {
    developmentIndicator: "overlay",
  },
});
