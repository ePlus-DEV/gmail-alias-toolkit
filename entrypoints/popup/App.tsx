import { useState, useEffect, useRef, useCallback } from "react";
import { Button, Card, Toast } from "../../src/components/ui";
import PopupHeader from "../../src/components/alias/PopupHeader";
import AccountSwitcher from "../../src/components/alias/AccountSwitcher";
import QRCode from "qrcode";
import "./App.css";
import Settings from "./components/Settings";
import Statistics from "./components/Statistics";
import WelcomeScreen from "./components/WelcomeScreen";
import GeneratorTabs from "./components/GeneratorTabs";
import HistorySection from "./components/HistorySection";
import {
  getAccountStorageKey,
  generateAlias,
  filterAliases,
  type RandomFormat,
} from "./utils";
import { t } from "../../lib/i18n";

interface Alias {
  email: string;
  timestamp: number;
}

interface EmailAccount {
  id: string;
  email: string;
  label?: string;
  isActive: boolean;
}

interface Favorite {
  email: string;
  timestamp?: number;
}

interface Preset {
  id: string;
  label: string;
  tag: string;
}

interface AppSettings {
  customPresets: Preset[];
  maxHistory: number;
  tags?: Record<string, number>;
  total?: number;
  randomFormat?: "private-mail" | "alphanumeric" | "words" | "timestamp";
  theme?: "light" | "dark" | "auto";
  showNotifications?: boolean;
}

interface StorageResult {
  gmail_alias_recent?: Alias[];
  base_email?: string;
  app_settings?: AppSettings;
  email_accounts?: EmailAccount[];
  favorites?: Favorite[];
  alias_stats?: {
    total: number;
    tags: Record<string, number>;
  };
}

/** Popup root: alias generators, history, favorites, accounts, and settings. */
function App() {
  /** Focuses an input once when it mounts (replaces autoFocus). */
  const focusOnMount = useCallback((el: HTMLInputElement | null) => {
    el?.focus();
  }, []);

  const [baseEmail, setBaseEmail] = useState("your.email@gmail.com");
  const [customTag, setCustomTag] = useState("");
  const [recentAliases, setRecentAliases] = useState<Alias[]>([]);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [maxRecent, setMaxRecent] = useState(20);
  const [customPresets, setCustomPresets] = useState<Preset[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recent" | "alphabetical">("recent");
  const [viewMode, setViewMode] = useState<"all" | "favorites">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [randomFormat, setRandomFormat] =
    useState<RandomFormat>("private-mail");
  const [generatedRandomList, setGeneratedRandomList] = useState<string[]>([]);
  const [randomEmailCount, setRandomEmailCount] = useState(10);
  const [activeGeneratorTab, setActiveGeneratorTab] = useState<
    "random" | "tags" | "tricks"
  >("random");
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [hasEmailAccounts, setHasEmailAccounts] = useState(true);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccountEmail, setNewAccountEmail] = useState("");
  const [newAccountLabel, setNewAccountLabel] = useState("");
  const [addAccountError, setAddAccountError] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  // Bulk delete
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedAliases, setSelectedAliases] = useState<Set<string>>(
    new Set(),
  );
  // QR code modal
  const [qrAlias, setQrAlias] = useState<string | null>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  // Theme
  const [, setTheme] = useState<"light" | "dark" | "auto">("light");

  // Load recent aliases, base email, and settings from storage
  useEffect(() => {
    browser.storage.local
      .get([
        "base_email",
        "app_settings",
        "email_accounts",
        "gmail_alias_recent",
        "alias_stats",
        "favorites",
      ])
      // skipcq: JS-R1005
      .then(async (result: StorageResult) => {
        let activeEmail = "your.email@gmail.com";
        let needsMigration = false;

        // Load active email from email_accounts or fall back to base_email
        if (result.email_accounts && Array.isArray(result.email_accounts)) {
          const activeAccount = result.email_accounts.find(
            (acc) => acc.isActive,
          );
          if (activeAccount) {
            activeEmail = activeAccount.email;
            setBaseEmail(activeEmail);
          }
        } else if (result.base_email) {
          activeEmail = result.base_email;
          setBaseEmail(activeEmail);
          // Check if we need to migrate from old format
          needsMigration = true;
        }

        // Migrate old data format to new account-specific format if needed
        if (
          needsMigration &&
          (result.gmail_alias_recent || result.alias_stats || result.favorites)
        ) {
          const historyKey = getAccountStorageKey(
            activeEmail,
            "gmail_alias_recent",
          );
          const statsKey = getAccountStorageKey(activeEmail, "alias_stats");
          const favoritesKey = getAccountStorageKey(activeEmail, "favorites");

          // Only migrate if account-specific data doesn't exist yet
          const accountData = await browser.storage.local.get([
            historyKey,
            statsKey,
            favoritesKey,
          ]);

          if (
            !accountData[historyKey] &&
            !accountData[statsKey] &&
            !accountData[favoritesKey]
          ) {
            await browser.storage.local.set({
              [historyKey]: result.gmail_alias_recent || [],
              [statsKey]: result.alias_stats || { total: 0, tags: {} },
              [favoritesKey]: result.favorites || [],
            });
          }
        }

        // Load account-specific history
        const historyKey = getAccountStorageKey(
          activeEmail,
          "gmail_alias_recent",
        );
        const favoritesKey = getAccountStorageKey(activeEmail, "favorites");
        const historyResult = await browser.storage.local.get([
          historyKey,
          favoritesKey,
        ]);
        if (
          historyResult[historyKey] &&
          Array.isArray(historyResult[historyKey])
        ) {
          setRecentAliases(historyResult[historyKey] as Alias[]);
        } else {
          setRecentAliases([]);
        }

        // Load favorites
        if (
          historyResult[favoritesKey] &&
          Array.isArray(historyResult[favoritesKey])
        ) {
          const favEmails = historyResult[favoritesKey].map(
            (f: Favorite) => f.email,
          );
          setFavorites(favEmails);
        } else {
          setFavorites([]);
        }

        if (result.app_settings) {
          setMaxRecent(result.app_settings.maxHistory || 20);
          setCustomPresets(result.app_settings.customPresets || []);
          setRandomFormat(result.app_settings.randomFormat || "private-mail");
          setShowNotifications(result.app_settings.showNotifications ?? true);
          const savedTheme = result.app_settings.theme || "light";
          setTheme(savedTheme);
          const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
          ).matches;
          document.documentElement.classList.toggle(
            "dark",
            savedTheme === "dark" || (savedTheme === "auto" && prefersDark),
          );
        }

        // Load email accounts list
        if (result.email_accounts && Array.isArray(result.email_accounts)) {
          setEmailAccounts(result.email_accounts);
          setHasEmailAccounts(result.email_accounts.length > 0);
        } else if (result.base_email) {
          // Legacy: has base_email but no email_accounts
          setHasEmailAccounts(true);
        } else {
          // First time user
          setHasEmailAccounts(false);
        }
      });
  }, []);

  // Listen for settings changes
  useEffect(() => {
    /** Syncs settings, accounts, and favorites state when extension storage changes. */
    const handleStorageChange = async (
      changes: Record<string, { newValue?: unknown; oldValue?: unknown }>,
    ) => {
      if (changes.app_settings) {
        const newSettings = changes.app_settings.newValue as
          | AppSettings
          | undefined;
        if (newSettings) {
          setMaxRecent(newSettings.maxHistory || 20);
          setCustomPresets(newSettings.customPresets || []);
          setRandomFormat(newSettings.randomFormat || "private-mail");
          setShowNotifications(newSettings.showNotifications ?? true);
          const newTheme = newSettings.theme || "light";
          setTheme(newTheme);
          const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
          ).matches;
          document.documentElement.classList.toggle(
            "dark",
            newTheme === "dark" || (newTheme === "auto" && prefersDark),
          );
        }
      }
      if (changes.email_accounts) {
        const newAccounts = changes.email_accounts.newValue as
          | EmailAccount[]
          | undefined;
        if (newAccounts) {
          setEmailAccounts(newAccounts);
          setHasEmailAccounts(newAccounts.length > 0);
          // Update base email if active account changed
          const activeAccount = newAccounts.find((acc) => acc.isActive);
          if (activeAccount && activeAccount.email !== baseEmail) {
            setBaseEmail(activeAccount.email);
            // Load history for new account
            const historyKey = getAccountStorageKey(
              activeAccount.email,
              "gmail_alias_recent",
            );
            const historyResult = await browser.storage.local.get(historyKey);
            if (
              historyResult[historyKey] &&
              Array.isArray(historyResult[historyKey])
            ) {
              setRecentAliases(historyResult[historyKey] as Alias[]);
            } else {
              setRecentAliases([]);
            }
            // Load favorites for new account
            const favoritesKey = getAccountStorageKey(
              activeAccount.email,
              "favorites",
            );
            const favResult = await browser.storage.local.get(favoritesKey);
            if (
              favResult[favoritesKey] &&
              Array.isArray(favResult[favoritesKey])
            ) {
              const favEmails = favResult[favoritesKey].map(
                (f: Favorite) => f.email,
              );
              setFavorites(favEmails);
            } else {
              setFavorites([]);
            }
          }
        }
      }

      // Listen for favorites changes
      const favoritesKey = getAccountStorageKey(baseEmail, "favorites");
      if (changes[favoritesKey]) {
        const newFavorites = changes[favoritesKey].newValue as
          | Favorite[]
          | undefined;
        if (newFavorites && Array.isArray(newFavorites)) {
          const favEmails = newFavorites.map((f: Favorite) => f.email);
          setFavorites(favEmails);
        } else {
          setFavorites([]);
        }
      }
    };

    browser.storage.onChanged.addListener(handleStorageChange);
    return () => browser.storage.onChanged.removeListener(handleStorageChange);
  }, [baseEmail]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterTag, viewMode, sortBy]);

  // Modals are absolutely positioned against the document (popups have no stable viewport),
  // so scroll to top when one opens or it can render off-screen below the fold.
  useEffect(() => {
    if (isSettingsOpen || qrAlias) {
      window.scrollTo(0, 0);
    }
  }, [isSettingsOpen, qrAlias]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to open settings
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSettingsOpen(true);
      }
      // Escape to close settings
      if (e.key === "Escape" && isSettingsOpen) {
        setIsSettingsOpen(false);
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, [isSettingsOpen]);

  /** Increments the total and per-tag counters for the given generated emails. */
  const updateStats = async (emails: string[]) => {
    // Use account-specific stats key
    const statsKey = getAccountStorageKey(baseEmail, "alias_stats");
    const result = (await browser.storage.local.get(statsKey)) as Record<
      string,
      { total: number; tags: Record<string, number> } | undefined
    >;
    const stats = result[statsKey] || { total: 0, tags: {} };

    stats.total = (stats.total || 0) + emails.length;
    stats.tags = stats.tags || {};

    emails.forEach((email) => {
      // Extract tag from email (only if it has + addressing)
      const tagMatch = email.match(/\+([^@]+)@/);
      if (tagMatch) {
        const tag = tagMatch[1];
        stats.tags[tag] = (stats.tags[tag] || 0) + 1;
      }
    });

    await browser.storage.local.set({ [statsKey]: stats });
  };

  // Batched save: computes the merged list and stats totals once, avoiding the
  // stale-closure / lost-update race that happens when saveRecentAlias is called
  // N times in a tight loop (e.g. "Copy All").
  const saveRecentAliases = (emails: string[]) => {
    if (emails.length === 0) return;

    const now = Date.now();
    const newAliases: Alias[] = emails.map((email, i) => ({
      email,
      timestamp: now - i,
    }));
    const newEmailSet = new Set(emails);

    const updated = [
      ...newAliases,
      ...recentAliases.filter((a) => !newEmailSet.has(a.email)),
    ].slice(0, maxRecent);

    setRecentAliases(updated);

    // Save with account-specific key
    const historyKey = getAccountStorageKey(baseEmail, "gmail_alias_recent");
    browser.storage.local.set({ [historyKey]: updated });

    // Update statistics
    updateStats(emails);
  };

  /** Saves a single alias to recent history. */
  const saveRecentAlias = (email: string) => saveRecentAliases([email]);

  // QR code: draw when alias changes
  useEffect(() => {
    if (qrAlias && qrCanvasRef.current) {
      (async () => {
        try {
          await QRCode.toCanvas(qrCanvasRef.current, qrAlias, {
            width: 200,
            margin: 2,
          });
        } catch {
          if (showNotifications) {
            setToastMessage(t("toastQrFailed"));
            setTimeout(() => setToastMessage(null), 2000);
          }
        }
      })();
    }
  }, [qrAlias, showNotifications]);

  /** Triggers a browser download for the given file content. */
  const downloadFile = (
    filename: string,
    mimeType: string,
    content: string,
  ) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  /** Exports recent aliases as a CSV or JSON download. */
  const exportAliases = (format: "csv" | "json") => {
    if (recentAliases.length === 0) return;
    if (format === "csv") {
      const rows = recentAliases.map(
        (a) => `"${a.email}","${new Date(a.timestamp).toISOString()}"`,
      );
      downloadFile(
        `aliases-${Date.now()}.csv`,
        "text/csv",
        `Email,Created At\n${rows.join("\n")}`,
      );
    } else {
      const data = recentAliases.map((a) => ({
        email: a.email,
        createdAt: new Date(a.timestamp).toISOString(),
      }));
      downloadFile(
        `aliases-${Date.now()}.json`,
        "application/json",
        JSON.stringify(data, null, 2),
      );
    }
    if (showNotifications) {
      setToastMessage(t("toastExportedAliases", String(recentAliases.length)));
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  /** Deletes the selected aliases from history, favorites, and stats. */
  const deleteSelected = async () => {
    const count = selectedAliases.size;
    const updated = recentAliases.filter((a) => !selectedAliases.has(a.email));
    setRecentAliases(updated);
    const historyKey = getAccountStorageKey(baseEmail, "gmail_alias_recent");
    const favoritesKey = getAccountStorageKey(baseEmail, "favorites");
    const statsKey = getAccountStorageKey(baseEmail, "alias_stats");

    const [favResult, statsResult] = await Promise.all([
      browser.storage.local.get(favoritesKey),
      browser.storage.local.get(statsKey),
    ]);

    // Remove deleted emails from favorites
    const currentFavs = (favResult[favoritesKey] as Favorite[]) || [];
    const updatedFavs = currentFavs.filter(
      (f: Favorite) => !selectedAliases.has(f.email),
    );

    // Decrement stats: total and per-tag counts
    const stats = (statsResult[statsKey] as {
      total: number;
      tags: Record<string, number>;
    }) || { total: 0, tags: {} };
    const tags = { ...stats.tags };
    selectedAliases.forEach((email) => {
      const match = email.match(/\+([^@]+)@/);
      if (match && tags[match[1]]) {
        tags[match[1]] = Math.max(0, tags[match[1]] - 1);
      }
    });
    // Drop tags whose count reached zero
    const remainingTags = Object.fromEntries(
      Object.entries(tags).filter(([, tagCount]) => tagCount > 0),
    );
    const updatedStats = {
      total: Math.max(0, stats.total - count),
      tags: remainingTags,
    };

    await browser.storage.local.set({
      [historyKey]: updated,
      [favoritesKey]: updatedFavs,
      [statsKey]: updatedStats,
    });

    setFavorites(updatedFavs.map((f: Favorite) => f.email));
    setSelectedAliases(new Set());
    setIsSelectMode(false);
    if (showNotifications) {
      setToastMessage(t("toastDeletedAliases", String(count)));
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  /** Toggles an alias in the bulk-delete selection set. */
  const toggleSelectAlias = (email: string) => {
    setSelectedAliases((prev) => {
      const next = new Set(prev);
      if (next.has(email)) {
        next.delete(email);
      } else {
        next.add(email);
      }
      return next;
    });
  };

  /** Clears all history, favorites, and stats for the active account. */
  const clearHistory = async () => {
    setRecentAliases([]);
    setFavorites([]);
    const historyKey = getAccountStorageKey(baseEmail, "gmail_alias_recent");
    const favoritesKey = getAccountStorageKey(baseEmail, "favorites");
    const statsKey = getAccountStorageKey(baseEmail, "alias_stats");
    await browser.storage.local.set({
      [historyKey]: [],
      [favoritesKey]: [],
      [statsKey]: { total: 0, tags: {} },
    });
    if (showNotifications) {
      setToastMessage(t("toastHistoryCleared"));
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  /** Adds or removes an alias from the account's favorites. */
  const toggleFavorite = async (email: string) => {
    const favoritesKey = getAccountStorageKey(baseEmail, "favorites");
    const result = await browser.storage.local.get(favoritesKey);
    const currentFavs = (result[favoritesKey] as Favorite[]) || [];

    const exists = currentFavs.find((f: Favorite) => f.email === email);

    let updated;
    if (exists) {
      // Remove from favorites
      updated = currentFavs.filter((f: Favorite) => f.email !== email);
    } else {
      // Add to favorites
      const newFav = {
        id: Date.now().toString(),
        email,
        addedAt: Date.now(),
      };
      updated = [...currentFavs, newFav];
    }

    await browser.storage.local.set({ [favoritesKey]: updated });

    const favEmails = updated.map((f: Favorite) => f.email);
    setFavorites(favEmails);
    if (showNotifications) {
      setToastMessage(
        exists ? t("toastFavoriteRemoved") : t("toastFavoriteAdded"),
      );
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  /** Copies an alias to the clipboard and records it in recent history. */
  const copyToClipboard = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      if (showNotifications) {
        setToastMessage(t("toastCopiedEmail", email));
      }
      saveRecentAlias(email);
      setTimeout(() => {
        setCopiedEmail(null);
        setToastMessage(null);
      }, 2000);
    } catch {
      if (showNotifications) {
        setToastMessage(t("toastCopyFailed"));
        setTimeout(() => setToastMessage(null), 2000);
      }
    }
  };

  /** Generates and copies an alias for the clicked preset tag. */
  const handlePresetClick = (tag: string) => {
    const alias = generateAlias(baseEmail, tag);
    if (alias) {
      copyToClipboard(alias);
    }
  };

  /** Generates and copies an alias from the custom tag input. */
  const handleCustomGenerate = () => {
    if (!customTag.trim()) return;
    const alias = generateAlias(baseEmail, customTag.trim());
    if (alias) {
      copyToClipboard(alias);
      setCustomTag("");
    }
  };

  /** Generates the custom alias when Enter is pressed. */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCustomGenerate();
    }
  };

  /** Validates and adds a new email account without switching to it. */
  const handleAddAccount = async () => {
    setAddAccountError("");

    if (!newAccountEmail.trim()) {
      setAddAccountError(t("errorEnterEmail"));
      return;
    }

    if (!newAccountEmail.includes("@")) {
      setAddAccountError(t("errorInvalidEmail"));
      return;
    }

    // Check if email already exists
    const emailExists = emailAccounts.some(
      (acc) => acc.email.toLowerCase() === newAccountEmail.trim().toLowerCase(),
    );
    if (emailExists) {
      setAddAccountError(t("errorAccountExists"));
      return;
    }

    const newAccount = {
      id: Date.now().toString(),
      email: newAccountEmail.trim(),
      label: newAccountLabel.trim() || `Account ${emailAccounts.length + 1}`,
      isActive: false, // Don't auto-switch to new account
    };

    const updatedAccounts = [...emailAccounts, newAccount];
    await browser.storage.local.set({ email_accounts: updatedAccounts });

    // Initialize empty storage for new account
    const historyKey = getAccountStorageKey(
      newAccount.email,
      "gmail_alias_recent",
    );
    const statsKey = getAccountStorageKey(newAccount.email, "alias_stats");
    const favoritesKey = getAccountStorageKey(newAccount.email, "favorites");

    await browser.storage.local.set({
      [historyKey]: [],
      [statsKey]: { total: 0, tags: {} },
      [favoritesKey]: [],
    });

    setNewAccountEmail("");
    setNewAccountLabel("");
    setAddAccountError("");
    setShowAddAccount(false);

    if (showNotifications) {
      setToastMessage(t("toastAccountAdded", newAccount.label));
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  // Compute outside IIFE so bulk-delete bar can reference it
  const filteredAliases = filterAliases(recentAliases, {
    viewMode,
    favorites,
    searchQuery,
    filterTag,
    sortBy,
  });

  // skipcq: JS-0415
  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_34%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.25),_transparent_34%),linear-gradient(180deg,#020617_0%,#111827_100%)]">
      {/* Show Welcome Screen for first-time users */}
      {!hasEmailAccounts ? (
        <div className="flex-1 overflow-y-auto">
          <WelcomeScreen
            onEmailAdded={(email) => {
              setBaseEmail(email);
              setHasEmailAccounts(true);
            }}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        </div>
      ) : (
        // skipcq: JS-0415
        <>
          <PopupHeader onOpenSettings={() => setIsSettingsOpen(true)} />

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
            <Card className="divide-y divide-gray-200/70 overflow-hidden dark:divide-gray-700/70">
              <AccountSwitcher
                baseEmail={baseEmail}
                emailAccounts={emailAccounts}
                showAddAccount={showAddAccount}
                newAccountEmail={newAccountEmail}
                newAccountLabel={newAccountLabel}
                addAccountError={addAccountError}
                focusOnMount={focusOnMount}
                onToggleAddAccount={() => setShowAddAccount(!showAddAccount)}
                onSelectAccount={async (selectedEmail) => {
                  setBaseEmail(selectedEmail);
                  setIsSelectMode(false);
                  setSelectedAliases(new Set());
                  setSearchQuery("");
                  setFilterTag("all");
                  setCurrentPage(1);

                  const updated = emailAccounts.map((acc) => ({
                    ...acc,
                    isActive: acc.email === selectedEmail,
                  }));

                  await browser.storage.local.set({
                    email_accounts: updated,
                    base_email: selectedEmail,
                  });
                }}
                onNewAccountEmailChange={(value) => {
                  setNewAccountEmail(value);
                  setAddAccountError("");
                }}
                onNewAccountLabelChange={setNewAccountLabel}
                onNewAccountBlur={() => {
                  if (newAccountEmail && !newAccountEmail.includes("@")) {
                    setNewAccountEmail(`${newAccountEmail}@gmail.com`);
                  }
                }}
                onAddAccount={handleAddAccount}
                onCancelAddAccount={() => {
                  setShowAddAccount(false);
                  setNewAccountEmail("");
                  setNewAccountLabel("");
                  setAddAccountError("");
                }}
              />

              {/* Unified Email Alias Generator */}
              <GeneratorTabs
                baseEmail={baseEmail}
                activeTab={activeGeneratorTab}
                setActiveTab={setActiveGeneratorTab}
                randomFormat={randomFormat}
                setRandomFormat={setRandomFormat}
                customTag={customTag}
                setCustomTag={setCustomTag}
                generatedRandomList={generatedRandomList}
                setGeneratedRandomList={setGeneratedRandomList}
                randomEmailCount={randomEmailCount}
                setRandomEmailCount={setRandomEmailCount}
                customPresets={customPresets}
                showNotifications={showNotifications}
                copyToClipboard={copyToClipboard}
                handleCustomGenerate={handleCustomGenerate}
                handleKeyPress={handleKeyPress}
                handlePresetClick={handlePresetClick}
                saveRecentAliases={saveRecentAliases}
                setToastMessage={setToastMessage}
              />

              <HistorySection
                recentAliases={recentAliases}
                favorites={favorites}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterTag={filterTag}
                setFilterTag={setFilterTag}
                sortBy={sortBy}
                setSortBy={setSortBy}
                viewMode={viewMode}
                setViewMode={setViewMode}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                isSelectMode={isSelectMode}
                setIsSelectMode={setIsSelectMode}
                selectedAliases={selectedAliases}
                setSelectedAliases={setSelectedAliases}
                copiedEmail={copiedEmail}
                filteredAliases={filteredAliases}
                exportAliases={exportAliases}
                deleteSelected={deleteSelected}
                toggleSelectAlias={toggleSelectAlias}
                toggleFavorite={toggleFavorite}
                copyToClipboard={copyToClipboard}
                setQrAlias={setQrAlias}
              />

              {/* Statistics - Collapsible */}
              <Statistics />
            </Card>

            {/* Toast Notification */}
            {toastMessage && <Toast message={toastMessage} />}
          </div>
        </>
      )}

      {/* QR Code Modal */}
      {qrAlias && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          onClick={() => setQrAlias(null)}
        >
          <div
            className="flex flex-col items-center gap-4 rounded-3xl border border-white/70 bg-white/90 p-6 shadow-2xl backdrop-blur dark:border-gray-700/70 dark:bg-gray-900/90"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {t("scanToCopyAlias")}
            </h3>
            <canvas ref={qrCanvasRef} className="rounded-lg" />
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono text-center max-w-[200px] break-all">
              {qrAlias}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(qrAlias)}
                className="rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
              >
                {t("copy")}
              </button>
              <button
                onClick={() => setQrAlias(null)}
                className="rounded-xl bg-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onClearHistory={clearHistory}
      />
    </div>
  );
}

export default App;
