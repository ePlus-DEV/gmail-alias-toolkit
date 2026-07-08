import {
  getAccountStorageKey,
  getLegacyAccountStorageKey,
} from "./popup/utils";
import { t } from "../lib/i18n";

interface EmailAccount {
  email: string;
  isActive?: boolean;
}

interface Alias {
  email: string;
  timestamp: number;
}

interface AliasStats {
  total: number;
  tags: Record<string, number>;
}

interface Preset {
  tag: string;
  label: string;
}

interface AppSettings {
  customPresets?: Preset[];
  randomFormat?: "private-mail" | "alphanumeric" | "words" | "timestamp";
  maxHistory?: number;
  badgeDisplay?: "none" | "total" | "all-time" | "today" | "week";
}

export default defineBackground(() => {
  // Create context menu on install
  browser.runtime.onInstalled.addListener(async () => {
    await migrateLegacyStorageKeys();
    await createContextMenus();
    await updateBadge();
  });

  // One-time migration from the old lossy sanitizer to the new collision-resistant key format
  async function migrateLegacyStorageKeys() {
    const { migration_legacy_keys_done, email_accounts, base_email } =
      (await browser.storage.local.get([
        "migration_legacy_keys_done",
        "email_accounts",
        "base_email",
      ])) as {
        migration_legacy_keys_done?: boolean;
        email_accounts?: EmailAccount[];
        base_email?: string;
      };
    if (migration_legacy_keys_done) return;

    const emails = new Set<string>();
    if (Array.isArray(email_accounts)) {
      (email_accounts as EmailAccount[]).forEach(
        (acc) => acc?.email && emails.add(acc.email),
      );
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
      title: t("extensionName"),
      contexts: ["editable"],
    });

    // Website-specific submenu (populated on demand)
    browser.contextMenus.create({
      id: "website-alias-parent",
      parentId: "gmail-alias-parent",
      title: t("menuForThisWebsite") || "For this website",
      contexts: ["editable"],
    });

    // Placeholder for website suggestions (will be replaced dynamically)
    browser.contextMenus.create({
      id: "website-loading",
      parentId: "website-alias-parent",
      title: t("menuLoading") || "Loading...",
      contexts: ["editable"],
      enabled: false,
    });

    // Separator
    browser.contextMenus.create({
      id: "separator-1",
      parentId: "gmail-alias-parent",
      type: "separator",
      contexts: ["editable"],
    });

    // Random email submenu
    browser.contextMenus.create({
      id: "fill-random-email",
      parentId: "gmail-alias-parent",
      title: t("menuRandomEmailAlias"),
      contexts: ["editable"],
    });

    // Custom tag submenu - sync with user's presets
    browser.contextMenus.create({
      id: "custom-tag-parent",
      parentId: "gmail-alias-parent",
      title: t("menuCustomTags"),
      contexts: ["editable"],
    });

    // Load custom presets from storage
    const result = (await browser.storage.local.get("app_settings")) as {
      app_settings?: AppSettings;
    };
    const customPresets: Preset[] = result.app_settings?.customPresets || [];

    if (customPresets.length > 0) {
      customPresets.forEach((preset) => {
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
        title: t("menuNoPresets"),
        contexts: ["editable"],
        enabled: false,
      });
    }

    // Gmail tricks submenu
    browser.contextMenus.create({
      id: "gmail-tricks-parent",
      parentId: "gmail-alias-parent",
      title: t("menuGmailTricks"),
      contexts: ["editable"],
    });

    browser.contextMenus.create({
      id: "trick-dot",
      parentId: "gmail-tricks-parent",
      title: t("menuDotVariation"),
      contexts: ["editable"],
    });

    browser.contextMenus.create({
      id: "trick-googlemail",
      parentId: "gmail-tricks-parent",
      title: t("menuGooglemailDomain"),
      contexts: ["editable"],
    });

    browser.contextMenus.create({
      id: "trick-nodots",
      parentId: "gmail-tricks-parent",
      title: t("menuRemoveAllDots"),
      contexts: ["editable"],
    });
  }
  // Handle context menu clicks
  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (!tab?.id) return;

    // Get base email from storage
    const result = (await browser.storage.local.get([
      "email_accounts",
      "base_email",
      "app_settings",
    ])) as {
      email_accounts?: EmailAccount[];
      base_email?: string;
      app_settings?: AppSettings;
    };
    let baseEmail = "your.email@gmail.com";

    if (result.email_accounts && Array.isArray(result.email_accounts)) {
      const activeAccount = result.email_accounts.find((acc) => acc.isActive);
      if (activeAccount) {
        baseEmail = activeAccount.email;
      }
    } else if (result.base_email) {
      baseEmail = result.base_email;
    }

    const [username, domain] = baseEmail.split("@");
    let emailToFill = "";

    // Handle website-specific suggestions
    if (String(info.menuItemId).startsWith("website-suggestion-")) {
      const suggestionIndex = parseInt(
        String(info.menuItemId).replace("website-suggestion-", ""),
      );
      // The suggestion will be stored in a temp cache during menu show
      const cacheResult = (await browser.storage.session?.get?.(
        "contextMenuWebsiteSuggestions",
      )) as
        | {
            contextMenuWebsiteSuggestions?: string[] | undefined;
          }
        | undefined;
      const suggestions = (cacheResult?.contextMenuWebsiteSuggestions ||
        []) as string[];
      if (suggestions[suggestionIndex]) {
        emailToFill = suggestions[suggestionIndex];
      }
    }

    if (info.menuItemId === "fill-random-email") {
      // Generate random email
      const format = result.app_settings?.randomFormat || "private-mail";
      let randomTag = "";

      switch (format) {
        case "private-mail": {
          const chars = "abcdefghijklmnopqrstuvwxyz";
          randomTag = Array.from(
            { length: 8 },
            () => chars[Math.floor(Math.random() * chars.length)],
          ).join("");
          break;
        }
        case "alphanumeric": {
          const alphanum = "abcdefghijklmnopqrstuvwxyz0123456789";
          randomTag = Array.from(
            { length: 10 },
            () => alphanum[Math.floor(Math.random() * alphanum.length)],
          ).join("");
          break;
        }
        case "words": {
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
        }
        case "timestamp":
          randomTag = Date.now().toString();
          break;
        default:
          randomTag = Date.now().toString();
          break;
      }

      emailToFill = `${username}+${randomTag}@${domain}`;
    } else if (String(info.menuItemId).startsWith("tag-")) {
      // Custom tag from preset
      const tag = String(info.menuItemId).replace("tag-", "");
      emailToFill = `${username}+${tag}@${domain}`;
    } else if (info.menuItemId === "trick-dot") {
      // Dot variation - insert dot at random position
      const pos = Math.floor(Math.random() * (username.length - 1)) + 1;
      const dottedUsername = `${username.slice(0, pos)}.${username.slice(pos)}`;
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

      // If website suggestion was used, save the mapping
      if (String(info.menuItemId).startsWith("website-suggestion-")) {
        try {
          const { normalizeHostname } =
            await import("../src/utils/hostnameNormalizer");
          const { saveWebsiteAlias } =
            await import("../src/services/websiteAliasService");
          if (tab.url) {
            const normalized = normalizeHostname(tab.url);
            if (normalized) {
              await saveWebsiteAlias(baseEmail, normalized, emailToFill);
            }
          }
        } catch (error) {
          console.debug("Error saving website alias:", error);
        }
      }

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
      const settingsResult = (await browser.storage.local.get(
        "app_settings",
      )) as { app_settings?: AppSettings };
      const badgeDisplay =
        settingsResult.app_settings?.badgeDisplay ?? "all-time";

      if (badgeDisplay === "none") {
        await browser.action.setBadgeText({ text: "" });
        return;
      }

      // Get active account
      const accountResult = (await browser.storage.local.get([
        "email_accounts",
        "base_email",
      ])) as { email_accounts?: EmailAccount[]; base_email?: string };
      let activeEmail = "your.email@gmail.com";

      if (
        accountResult.email_accounts &&
        Array.isArray(accountResult.email_accounts)
      ) {
        const activeAccount = accountResult.email_accounts.find(
          (acc) => acc.isActive,
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
      const result = (await browser.storage.local.get([
        historyKey,
        statsKey,
      ])) as Record<string, Alias[] | AliasStats | undefined>;
      const recentAliases = (result[historyKey] as Alias[]) || [];
      const aliasStats = (result[statsKey] as AliasStats) || {
        total: 0,
        tags: {},
      };

      let count = 0;
      const now = new Date();

      switch (badgeDisplay) {
        case "total":
          count = recentAliases.length;
          break;
        case "all-time":
          count = aliasStats.total || 0;
          break;
        case "today": {
          const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
          ).getTime();
          count = recentAliases.filter((a) => a.timestamp >= today).length;
          break;
        }
        case "week": {
          const weekAgo = new Date(
            now.getTime() - 7 * 24 * 60 * 60 * 1000,
          ).getTime();
          count = recentAliases.filter((a) => a.timestamp >= weekAgo).length;
          break;
        }
        default:
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
    const accountResult = (await browser.storage.local.get([
      "email_accounts",
      "base_email",
    ])) as { email_accounts?: EmailAccount[]; base_email?: string };
    let activeEmail = "your.email@gmail.com";

    if (
      accountResult.email_accounts &&
      Array.isArray(accountResult.email_accounts)
    ) {
      const activeAccount = accountResult.email_accounts.find(
        (acc) => acc.isActive,
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
    const result = (await browser.storage.local.get([
      historyKey,
      statsKey,
    ])) as Record<string, Alias[] | AliasStats | undefined>;
    const recentAliases = (result[historyKey] as Alias[]) || [];

    // Add to history (remove duplicates, add to top)
    const newAlias: Alias = {
      email,
      timestamp: Date.now(),
    };

    const updated = [
      newAlias,
      ...recentAliases.filter((a) => a.email !== email),
    ].slice(0, maxRecent);

    // Update statistics
    const stats: AliasStats = (result[statsKey] as AliasStats) || {
      total: 0,
      tags: {},
    };
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

  // Update website suggestions when context menu is shown
  browser.contextMenus.onShown?.addListener?.(async (info) => {
    try {
      if (!info.pageUrl) return;

      // Import services inline to avoid circular dependencies
      const { normalizeHostname } =
        await import("../src/utils/hostnameNormalizer");
      const { generateSuggestionsForWebsite } =
        await import("../src/services/websiteAliasService");

      const normalized = normalizeHostname(info.pageUrl);
      if (!normalized) return;

      // Get active email
      const accountResult = (await browser.storage.local.get([
        "email_accounts",
        "base_email",
      ])) as { email_accounts?: EmailAccount[]; base_email?: string };
      let activeEmail = "your.email@gmail.com";

      if (
        accountResult.email_accounts &&
        Array.isArray(accountResult.email_accounts)
      ) {
        const activeAccount = accountResult.email_accounts.find(
          (acc) => acc.isActive,
        );
        if (activeAccount) {
          activeEmail = activeAccount.email;
        }
      } else if (accountResult.base_email) {
        activeEmail = accountResult.base_email;
      }

      // Generate suggestions
      const suggestions = await generateSuggestionsForWebsite(
        activeEmail,
        info.pageUrl,
      );
      if (suggestions.length === 0) return;

      // Store suggestions in session storage for retrieval in click handler
      if (browser.storage.session) {
        await browser.storage.session.set({
          contextMenuWebsiteSuggestions: suggestions,
        });
      }

      // Remove placeholder and add suggestions
      await browser.contextMenus.remove("website-loading");

      suggestions.slice(0, 3).forEach((suggestion, index) => {
        browser.contextMenus.create({
          id: `website-suggestion-${index}`,
          parentId: "website-alias-parent",
          title: suggestion.split("@")[0],
          contexts: ["editable"],
        });
      });

      await browser.contextMenus.refresh?.();
    } catch (error) {
      console.debug("Error updating website suggestions:", error);
    }
  });

  // Handle messages from popup/content script
  browser.runtime.onMessage.addListener(
    async (message, sender, sendResponse) => {
      try {
        if (message.action === "getActiveTabUrl") {
          const tabs = await browser.tabs.query({
            active: true,
            currentWindow: true,
          });
          const tab = tabs[0];
          sendResponse({
            url: tab?.url,
            title: tab?.title,
          });
        } else if (message.action === "saveWebsiteAlias") {
          // Import service inline to avoid circular dependencies
          const { saveWebsiteAlias } =
            await import("../src/services/websiteAliasService");
          await saveWebsiteAlias(
            message.email,
            message.normalizedHostname,
            message.alias,
          );
          sendResponse({ success: true });
        }
      } catch (error) {
        console.error("Message handler error:", error);
        sendResponse({ error: String(error) });
      }
    },
  );
});
