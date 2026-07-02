import {
  getAccountStorageKey,
  getLegacyAccountStorageKey,
} from "./popup/utils";

export default defineBackground(() => {
  console.log("Gmail Alias Toolkit background started");

  // Create context menu on install
  browser.runtime.onInstalled.addListener(async () => {
    await migrateLegacyStorageKeys();
    await createContextMenus();
    await updateBadge();
  });

  // One-time migration from the old lossy sanitizer to the new collision-resistant key format
  async function migrateLegacyStorageKeys() {
    const { migration_legacy_keys_done, email_accounts, base_email } =
      await browser.storage.local.get([
        "migration_legacy_keys_done",
        "email_accounts",
        "base_email",
      ]);
    if (migration_legacy_keys_done) return;

    const emails = new Set<string>();
    if (Array.isArray(email_accounts)) {
      email_accounts.forEach((acc: any) => acc?.email && emails.add(acc.email));
    }
    if (base_email) emails.add(base_email);

    const suffixes = ["gmail_alias_recent", "alias_stats", "favorites"];
    const toSet: Record<string, unknown> = {};
    const toRemove: string[] = [];

    for (const email of emails) {
      for (const suffix of suffixes) {
        const legacyKey = getLegacyAccountStorageKey(email, suffix);
        const newKey = getAccountStorageKey(email, suffix);
        if (legacyKey === newKey) continue;

        const legacyResult = await browser.storage.local.get(legacyKey);
        if (legacyResult[legacyKey] === undefined) continue;

        const newResult = await browser.storage.local.get(newKey);
        if (newResult[newKey] === undefined) {
          toSet[newKey] = legacyResult[legacyKey];
        }
        toRemove.push(legacyKey);
      }
    }

    if (Object.keys(toSet).length > 0) await browser.storage.local.set(toSet);
    if (toRemove.length > 0) await browser.storage.local.remove(toRemove);
    await browser.storage.local.set({ migration_legacy_keys_done: true });
  }

  // Recreate context menus when settings change
  browser.storage.onChanged.addListener(async (changes) => {
    if (changes.app_settings) {
      await browser.contextMenus.removeAll();
      await createContextMenus();
      // Update badge when app_settings changes (includes showBadge toggle)
      await updateBadge();
    }

    // Update badge when history or accounts change
    const changedKeys = Object.keys(changes);
    const shouldUpdateBadge = changedKeys.some(
      (key) =>
        key.startsWith("gmail_alias_recent_") ||
        key.startsWith("alias_stats_") ||
        key === "email_accounts",
    );
    if (shouldUpdateBadge) {
      await updateBadge();
    }
  });

  // Function to create context menus
  async function createContextMenus() {
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

    // Custom tag submenu - sync with user's presets
    browser.contextMenus.create({
      id: "custom-tag-parent",
      parentId: "gmail-alias-parent",
      title: "📝 Custom Tags",
      contexts: ["editable"],
    });

    // Load custom presets from storage
    const result = await browser.storage.local.get("app_settings");
    const customPresets = result.app_settings?.customPresets || [];

    if (customPresets.length > 0) {
      customPresets.forEach((preset: any) => {
        browser.contextMenus.create({
          id: `tag-${preset.tag}`,
          parentId: "custom-tag-parent",
          title: `${preset.label} (+${preset.tag})`,
          contexts: ["editable"],
        });
      });
    } else {
      // Show message if no presets
      browser.contextMenus.create({
        id: "no-presets",
        parentId: "custom-tag-parent",
        title: "No presets - Add in Settings",
        contexts: ["editable"],
        enabled: false,
      });
    }

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
  }

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
        (acc: any) => acc.isActive,
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
            () => chars[Math.floor(Math.random() * chars.length)],
          ).join("");
          break;
        case "alphanumeric":
          const alphanum = "abcdefghijklmnopqrstuvwxyz0123456789";
          randomTag = Array.from(
            { length: 10 },
            () => alphanum[Math.floor(Math.random() * alphanum.length)],
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
      // Save to history and statistics
      await saveToHistory(emailToFill, result.app_settings?.maxHistory || 20);

      // Send message to content script to fill the input
      browser.tabs.sendMessage(tab.id, {
        action: "fillEmail",
        email: emailToFill,
      });
    }
  });

  // Helper function to update badge
  async function updateBadge() {
    try {
      // Check badge display setting
      const settingsResult = await browser.storage.local.get("app_settings");
      const badgeDisplay =
        settingsResult.app_settings?.badgeDisplay ?? "all-time";

      if (badgeDisplay === "none") {
        await browser.action.setBadgeText({ text: "" });
        return;
      }

      // Get active account
      const accountResult = await browser.storage.local.get([
        "email_accounts",
        "base_email",
      ]);
      let activeEmail = "your.email@gmail.com";

      if (
        accountResult.email_accounts &&
        Array.isArray(accountResult.email_accounts)
      ) {
        const activeAccount = accountResult.email_accounts.find(
          (acc: any) => acc.isActive,
        );
        if (activeAccount) {
          activeEmail = activeAccount.email;
        }
      } else if (accountResult.base_email) {
        activeEmail = accountResult.base_email;
      }

      // Get history for active account
      const historyKey = getAccountStorageKey(
        activeEmail,
        "gmail_alias_recent",
      );
      const statsKey = getAccountStorageKey(activeEmail, "alias_stats");
      const result = await browser.storage.local.get([historyKey, statsKey]);
      const recentAliases = result[historyKey] || [];
      const aliasStats = result[statsKey] || { total: 0, tags: {} };

      let count = 0;
      const now = new Date();

      switch (badgeDisplay) {
        case "total":
          count = recentAliases.length;
          break;
        case "all-time":
          count = aliasStats.total || 0;
          break;
        case "today":
          const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
          ).getTime();
          count = recentAliases.filter((a: any) => a.timestamp >= today).length;
          break;
        case "week":
          const weekAgo = new Date(
            now.getTime() - 7 * 24 * 60 * 60 * 1000,
          ).getTime();
          count = recentAliases.filter(
            (a: any) => a.timestamp >= weekAgo,
          ).length;
          break;
      }

      // Update badge
      if (count > 0) {
        await browser.action.setBadgeText({ text: count.toString() });
        await browser.action.setBadgeBackgroundColor({ color: "#3B82F6" }); // Blue
        await browser.action.setBadgeTextColor({ color: "#FFFFFF" }); // White text
      } else {
        await browser.action.setBadgeText({ text: "" });
      }
    } catch (error) {
      console.error("Error updating badge:", error);
    }
  }

  // Helper function to save email to history and stats
  async function saveToHistory(email: string, maxRecent: number) {
    // Get active account
    const accountResult = await browser.storage.local.get([
      "email_accounts",
      "base_email",
    ]);
    let activeEmail = "your.email@gmail.com";

    if (
      accountResult.email_accounts &&
      Array.isArray(accountResult.email_accounts)
    ) {
      const activeAccount = accountResult.email_accounts.find(
        (acc: any) => acc.isActive,
      );
      if (activeAccount) {
        activeEmail = activeAccount.email;
      }
    } else if (accountResult.base_email) {
      activeEmail = accountResult.base_email;
    }

    // Use account-specific storage keys
    const historyKey = getAccountStorageKey(activeEmail, "gmail_alias_recent");
    const statsKey = getAccountStorageKey(activeEmail, "alias_stats");

    // Get current history
    const result = await browser.storage.local.get([historyKey, statsKey]);
    const recentAliases = result[historyKey] || [];

    // Add to history (remove duplicates, add to top)
    const newAlias = {
      email,
      timestamp: Date.now(),
    };

    const updated = [
      newAlias,
      ...recentAliases.filter((a: any) => a.email !== email),
    ].slice(0, maxRecent);

    // Update statistics
    let stats = result[statsKey] || { total: 0, tags: {} };
    stats.total = (stats.total || 0) + 1;

    // Extract tag from email (if it has + addressing)
    const tagMatch = email.match(/\+([^@]+)@/);
    if (tagMatch) {
      const tag = tagMatch[1];
      stats.tags = stats.tags || {};
      stats.tags[tag] = (stats.tags[tag] || 0) + 1;
    }

    // Save to storage with account-specific keys
    await browser.storage.local.set({
      [historyKey]: updated,
      [statsKey]: stats,
    });

    // Update badge
    await updateBadge();
  }
});
