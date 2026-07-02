import { getHostnameFromUrl, normalizeDomain } from "../src/utils/domain";
import { detectCategory } from "../src/utils/categoryDetector";
import {
  buildPlusAlias,
  generateAliasSuggestions,
} from "../src/utils/aliasGenerator";
import { loadAliasData, touchAlias } from "../src/utils/storage";

export default defineBackground(() => {
  console.log("Gmail Alias Toolkit background started");

  // Create context menu on install
  browser.runtime.onInstalled.addListener(async () => {
    await createContextMenus();
    await updateBadge();
  });

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

    browser.contextMenus.create({
      id: "insert-suggested-alias",
      parentId: "gmail-alias-parent",
      title: "Insert suggested alias",
      contexts: ["editable"],
    });

    browser.contextMenus.create({
      id: "copy-suggested-alias",
      parentId: "gmail-alias-parent",
      title: "Copy suggested alias",
      contexts: ["editable"],
    });

    browser.contextMenus.create({
      id: "use-previous-alias",
      parentId: "gmail-alias-parent",
      title: "Use previous alias for this site",
      contexts: ["editable"],
    });

    browser.contextMenus.create({
      id: "generate-random-alias",
      parentId: "gmail-alias-parent",
      title: "Generate random alias",
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
    const siteAliasMenuIds = new Set([
      "insert-suggested-alias",
      "copy-suggested-alias",
      "use-previous-alias",
      "generate-random-alias",
    ]);

    if (siteAliasMenuIds.has(String(info.menuItemId))) {
      emailToFill = await resolveWebsiteAlias(
        String(info.menuItemId),
        tab.url,
        baseEmail,
      );
    } else if (info.menuItemId === "fill-random-email") {
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

      if (info.menuItemId === "copy-suggested-alias") {
        await navigator.clipboard.writeText(emailToFill).catch(() => undefined);
      } else {
        // Send message to content script to fill the input
        const response = await browser.tabs
          .sendMessage(tab.id, {
            action: "autofillAlias",
            email: emailToFill,
          })
          .catch(() => ({ ok: false }));
        if (!response?.ok)
          await navigator.clipboard
            .writeText(emailToFill)
            .catch(() => undefined);
      }

      const hostname = tab.url ? getHostnameFromUrl(tab.url) : null;
      if (hostname) await touchAlias(hostname);
    }
  });

  async function resolveWebsiteAlias(
    menuItemId: string,
    tabUrl: string | undefined,
    baseEmail: string,
  ): Promise<string> {
    const hostname = tabUrl ? getHostnameFromUrl(tabUrl) : null;
    const existingAliases = await loadAliasData().catch(() => null);

    if (
      hostname &&
      existingAliases?.siteAliases[hostname] &&
      menuItemId !== "generate-random-alias"
    ) {
      return existingAliases.siteAliases[hostname].alias;
    }

    if (!hostname) return "";

    const keyword = normalizeDomain(hostname);
    if (menuItemId === "generate-random-alias") {
      return buildPlusAlias(
        baseEmail,
        `${keyword}-${Math.random().toString(36).slice(2, 6)}`,
      );
    }

    return (
      generateAliasSuggestions({
        baseEmail,
        domainKeyword: keyword,
        category: detectCategory(keyword, hostname),
      })[0]?.alias || ""
    );
  }

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

  // Helper function to get account-specific storage key
  function getAccountStorageKey(email: string, suffix: string): string {
    const sanitized = email.replace(/[^a-zA-Z0-9]/g, "_");
    return `${suffix}_${sanitized}`;
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
