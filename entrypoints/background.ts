export default defineBackground(() => {
  console.log("Gmail Alias Toolkit background started");

  // Create context menu on install
  browser.runtime.onInstalled.addListener(() => {
    // Parent menu
    browser.contextMenus.create({
      id: "gmail-alias-parent",
      title: "Gmail Alias Toolkit",
      contexts: ["editable"],
    });

    // Random email submenu
    browser.contextMenus.create({
      id: "fill-random-email",
      parentId: "gmail-alias-parent",
      title: "🎲 Random Email Alias",
      contexts: ["editable"],
    });

    // Custom tag submenu with common presets
    browser.contextMenus.create({
      id: "custom-tag-parent",
      parentId: "gmail-alias-parent",
      title: "📝 Custom Tags",
      contexts: ["editable"],
    });

    const commonTags = [
      "shopping",
      "work",
      "test",
      "social",
      "newsletter",
      "spam",
    ];
    commonTags.forEach((tag) => {
      browser.contextMenus.create({
        id: `tag-${tag}`,
        parentId: "custom-tag-parent",
        title: tag,
        contexts: ["editable"],
      });
    });

    // Gmail tricks submenu
    browser.contextMenus.create({
      id: "gmail-tricks-parent",
      parentId: "gmail-alias-parent",
      title: "✨ Gmail Tricks",
      contexts: ["editable"],
    });

    browser.contextMenus.create({
      id: "trick-dot",
      parentId: "gmail-tricks-parent",
      title: "Dot Variation",
      contexts: ["editable"],
    });

    browser.contextMenus.create({
      id: "trick-googlemail",
      parentId: "gmail-tricks-parent",
      title: "Googlemail Domain",
      contexts: ["editable"],
    });

    browser.contextMenus.create({
      id: "trick-nodots",
      parentId: "gmail-tricks-parent",
      title: "Remove All Dots",
      contexts: ["editable"],
    });
  });

  // Handle context menu clicks
  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (!tab?.id) return;

    // Get base email from storage
    const result = await browser.storage.local.get([
      "email_accounts",
      "base_email",
      "app_settings",
    ]);
    let baseEmail = "your.email@gmail.com";

    if (result.email_accounts && Array.isArray(result.email_accounts)) {
      const activeAccount = result.email_accounts.find(
        (acc: any) => acc.isActive
      );
      if (activeAccount) {
        baseEmail = activeAccount.email;
      }
    } else if (result.base_email) {
      baseEmail = result.base_email;
    }

    const [username, domain] = baseEmail.split("@");
    let emailToFill = "";

    if (info.menuItemId === "fill-random-email") {
      // Generate random email
      const format = result.app_settings?.randomFormat || "private-mail";
      let randomTag = "";

      switch (format) {
        case "private-mail":
          const chars = "abcdefghijklmnopqrstuvwxyz";
          randomTag = Array.from(
            { length: 8 },
            () => chars[Math.floor(Math.random() * chars.length)]
          ).join("");
          break;
        case "alphanumeric":
          const alphanum = "abcdefghijklmnopqrstuvwxyz0123456789";
          randomTag = Array.from(
            { length: 10 },
            () => alphanum[Math.floor(Math.random() * alphanum.length)]
          ).join("");
          break;
        case "words":
          const words = [
            "alpha",
            "beta",
            "gamma",
            "delta",
            "echo",
            "foxtrot",
            "golf",
            "hotel",
          ];
          const word1 = words[Math.floor(Math.random() * words.length)];
          const word2 = words[Math.floor(Math.random() * words.length)];
          const num = Math.floor(Math.random() * 100);
          randomTag = `${word1}${word2}${num}`;
          break;
        case "timestamp":
          randomTag = Date.now().toString();
          break;
      }

      emailToFill = `${username}+${randomTag}@${domain}`;
    } else if (info.menuItemId?.startsWith("tag-")) {
      // Custom tag from preset
      const tag = info.menuItemId.replace("tag-", "");
      emailToFill = `${username}+${tag}@${domain}`;
    } else if (info.menuItemId === "trick-dot") {
      // Dot variation - insert dot at random position
      const pos = Math.floor(Math.random() * (username.length - 1)) + 1;
      const dottedUsername = username.slice(0, pos) + "." + username.slice(pos);
      emailToFill = `${dottedUsername}@${domain}`;
    } else if (info.menuItemId === "trick-googlemail") {
      // Googlemail domain
      const altDomain = domain === "gmail.com" ? "googlemail.com" : "gmail.com";
      emailToFill = `${username}@${altDomain}`;
    } else if (info.menuItemId === "trick-nodots") {
      // Remove all dots
      const noDots = username.replace(/\./g, "");
      emailToFill = `${noDots}@${domain}`;
    }

    if (emailToFill) {
      // Send message to content script to fill the input
      browser.tabs.sendMessage(tab.id, {
        action: "fillEmail",
        email: emailToFill,
      });
    }
  });
});
