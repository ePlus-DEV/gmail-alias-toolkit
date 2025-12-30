import { defineConfig } from "wxt";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
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
    icons: {
      16: "/icon/16.png",
      32: "/icon/32.png",
      48: "/icon/48.png",
      96: "/icon/96.png",
      128: "/icon/128.png",
    },
    action: {
      default_icon: {
        16: "/icon/16.png",
        32: "/icon/32.png",
        48: "/icon/48.png",
        96: "/icon/96.png",
        128: "/icon/128.png",
      },
      default_title: "Gmail Alias Toolkit",
    },
  },
});
