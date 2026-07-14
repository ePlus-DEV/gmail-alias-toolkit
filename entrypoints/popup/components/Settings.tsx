// skipcq: JS-0415 - Settings sections keep related controls inline for readability in a constrained popup.
import { useState, useEffect, useCallback } from "react";
import Toggle from "./Toggle";
import Button from "./Button";
import Input from "./Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/motion/select";
import { RadioGroup, RadioGroupItem } from "src/components/motion/radio";
import { Tooltip } from "src/components/motion/tooltip";
import { BouncyAccordion } from "src/components/motion/bouncy-accordion";
import { AnimatedBadge } from "src/components/motion/animated-badge";
import { getAccountStorageKey, validateEmail } from "../utils";
import { t } from "../../../lib/i18n";
import {
  INLINE_DISABLED_SITES_KEY,
  parseDisabledInlineSites,
} from "src/utils/inlineSiteSettings";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onClearHistory: () => void;
}

interface CustomPreset {
  id: string;
  label: string;
  tag: string;
}

interface EmailAccount {
  id: string;
  email: string;
  label: string;
  isActive: boolean;
}

interface AppSettings {
  customPresets: CustomPreset[];
  maxHistory: number;
  theme: "light" | "dark" | "auto";
  showNotifications: boolean;
  badgeDisplay: "none" | "total" | "today" | "week" | "all-time";
  randomFormat: "private-mail" | "alphanumeric" | "words" | "timestamp";
}

interface ConfirmationRequest {
  title: string;
  message: string;
  confirmLabel: string;
  variant?: "primary" | "danger";
  resolve: (confirmed: boolean) => void;
}

interface ChangelogChange {
  type: "Added" | "Changed" | "Fixed";
  items: string[];
}

interface ChangelogEntry {
  version: string;
  date: string;
  changes: ChangelogChange[];
}

const DEFAULT_SETTINGS: AppSettings = {
  customPresets: [],
  maxHistory: 20,
  theme: "light",
  showNotifications: true,
  badgeDisplay: "all-time",
  randomFormat: "private-mail",
};

const CHANGELOG: ChangelogEntry[] = [
  {
    version: "1.3.0",
    date: "2026-07-13",
    changes: [
      {
        type: "Added",
        items: [
          "Added website-aware alias suggestions based on the current hostname",
          "Added an email input helper with inline icons, suggestion popups, live previews, and explicit Use actions",
          "Added previous-alias navigation and an information panel explaining supported rules and local-only storage",
          "Added expanded statistics metrics and Russian and Turkish translations",
          "Added a product landing page with automated GitHub Pages deployment",
        ],
      },
      {
        type: "Changed",
        items: [
          "Enhanced the context menu with dynamic, website-specific alias suggestions",
          "Updated the History tab to show aliases across websites and store history per email account",
          "Improved popup navigation, layout, styling, and alias selection behavior",
          "Reorganized the content script and colocated its email helper styles",
        ],
      },
      {
        type: "Fixed",
        items: [
          "Preserved email input width and flex layout when injecting the helper icon",
          "Improved helper popup positioning and hover behavior to prevent accidental closing",
          "Hid the Tags statistics tab when there is not enough data for a useful chart",
          "Hardened content rendering against client-side cross-site scripting",
          "Resolved code quality, localization, and build workflow issues",
        ],
      },
    ],
  },
  {
    version: "1.2.0",
    date: "2026-07-03",
    changes: [
      {
        type: "Added",
        items: [
          "Added Tailwind CSS v4, shadcn, and beUI motion components",
          "Added Action Swap, Animated Badge, Bouncy Accordion, Theme Toggle, Tooltip, and Table integrations",
          "Added dark mode toggle in the popup header",
          "Added locale key coverage tests for all supported languages",
        ],
      },
      {
        type: "Changed",
        items: [
          "Redesigned popup, settings, generator tabs, Gmail tricks, history table, and changelog UI with a unified beUI style",
          "Reworked Recent Aliases into a compact non-scrolling table with fixed action buttons",
          "Improved dark mode contrast, spacing, hover states, tooltips, and responsive popup layout",
          "Moved theme switching out of Settings and into the main popup header",
          "Updated all supported locales with the new UI strings",
        ],
      },
      {
        type: "Fixed",
        items: [
          '"Copy All" no longer undercounts statistics for generated aliases',
          "Settings/QR modals no longer render outside the popup bounds",
          "Tab key now moves focus normally instead of being hijacked for @gmail.com autocomplete",
          "Fixed missing imports and old component references after replacing legacy UI components",
          "Fixed table overflow and hidden row action buttons in alias history",
          "Fixed untranslated/fallback strings in the new UI",
        ],
      },
    ],
  },
  {
    version: "1.1.0",
    date: "2025-12-30",
    changes: [
      {
        type: "Added",
        items: [
          "Gmail alias generation with plus addressing",
          "Preset management",
          "Keyboard shortcuts",
          "Statistics tracking",
        ],
      },
      { type: "Changed", items: ["Updated dependencies"] },
      { type: "Fixed", items: ["Bug fixes and improvements"] },
    ],
  },
  {
    version: "1.0.0",
    date: "2025-12-30",
    changes: [{ type: "Added", items: ["Initial release"] }],
  },
];

interface SettingsPanelProps {
  settings: AppSettings;
  saveSettings: (settings: AppSettings) => Promise<void>;
}

/** Appearance and display settings shown inside the general accordion. */
function AppearanceSettingsPanel({
  settings,
  saveSettings,
}: SettingsPanelProps) {
  return (
    <div className="space-y-3">
      <BadgeCounterField settings={settings} saveSettings={saveSettings} />
      <CopyNotificationsField settings={settings} saveSettings={saveSettings} />
    </div>
  );
}

/** Badge counter setting field. */
function BadgeCounterField({ settings, saveSettings }: SettingsPanelProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-foreground">
        {t("badgeCounter")}
      </label>
      <Select
        value={settings.badgeDisplay}
        onValueChange={(value) =>
          saveSettings({
            ...settings,
            badgeDisplay: value as AppSettings["badgeDisplay"],
          })
        }
      >
        <SelectTrigger className="rounded-xl bg-background shadow-sm">
          <SelectValue />
        </SelectTrigger>
        <BadgeCounterOptions />
      </Select>
    </div>
  );
}

/** Badge counter select options. */
function BadgeCounterOptions() {
  return (
    <SelectContent>
      <SelectItem value="none">None (Hidden)</SelectItem>
      <SelectItem value="total">Total in History</SelectItem>
      <SelectItem value="all-time">Total Generated (All Time)</SelectItem>
      <SelectItem value="today">Created Today</SelectItem>
      <SelectItem value="week">This Week</SelectItem>
    </SelectContent>
  );
}

/** Copy notification toggle field. */
function CopyNotificationsField({
  settings,
  saveSettings,
}: SettingsPanelProps) {
  return (
    <div className="flex items-center justify-between border-t border-border pt-3">
      <label className="text-xs font-semibold text-foreground">
        {t("copyNotifications")}
      </label>
      <Toggle
        enabled={settings.showNotifications}
        onChange={(enabled) =>
          saveSettings({ ...settings, showNotifications: enabled })
        }
        label=""
      />
    </div>
  );
}

/** Alias generation defaults shown inside the general accordion. */
function AliasGenerationSettingsPanel({
  settings,
  saveSettings,
}: SettingsPanelProps) {
  return (
    <div className="space-y-3">
      <RandomAliasFormatField settings={settings} saveSettings={saveSettings} />
      <AutoSaveLimitField settings={settings} saveSettings={saveSettings} />
    </div>
  );
}

/** Random alias format setting field. */
function RandomAliasFormatField({
  settings,
  saveSettings,
}: SettingsPanelProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-foreground">
        {t("randomAliasFormat")}
      </label>
      <Select
        value={settings.randomFormat}
        onValueChange={(value) =>
          saveSettings({
            ...settings,
            randomFormat: value as AppSettings["randomFormat"],
          })
        }
      >
        <SelectTrigger className="rounded-xl bg-background shadow-sm">
          <SelectValue />
        </SelectTrigger>
        <RandomAliasFormatOptions />
      </Select>
    </div>
  );
}

/** Random alias format select options. */
function RandomAliasFormatOptions() {
  return (
    <SelectContent>
      <SelectItem value="private-mail">
        Private Mail (e.g., private-mail-q2ga)
      </SelectItem>
      <SelectItem value="alphanumeric">
        Random Characters (e.g., abc123xy)
      </SelectItem>
      <SelectItem value="words">Random Words (e.g., happy-fox-42)</SelectItem>
      <SelectItem value="timestamp">Timestamp (e.g., lk9x2m3n)</SelectItem>
    </SelectContent>
  );
}

/** Auto-save limit setting field. */
function AutoSaveLimitField({ settings, saveSettings }: SettingsPanelProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-foreground">
        {t("autoSaveLimit")}
      </label>
      <Select
        value={String(settings.maxHistory)}
        onValueChange={(value) =>
          saveSettings({ ...settings, maxHistory: Number(value) })
        }
      >
        <SelectTrigger className="rounded-xl bg-background shadow-sm">
          <SelectValue />
        </SelectTrigger>
        <AutoSaveLimitOptions />
      </Select>
    </div>
  );
}

/** Auto-save limit select options. */
function AutoSaveLimitOptions() {
  return (
    <SelectContent>
      <SelectItem value="20">20 aliases</SelectItem>
      <SelectItem value="50">50 aliases</SelectItem>
      <SelectItem value="100">100 aliases</SelectItem>
      <SelectItem value="200">200 aliases</SelectItem>
      <SelectItem value="500">500 aliases</SelectItem>
    </SelectContent>
  );
}

interface AddAccountCardProps {
  showAddAccount: boolean;
  newAccountEmail: string;
  newAccountLabel: string;
  addAccountError: string;
  focusOnMount: (el: HTMLInputElement | null) => void;
  setShowAddAccount: (show: boolean) => void;
  setNewAccountEmail: (value: string) => void;
  setNewAccountLabel: (value: string) => void;
  setAddAccountError: (value: string) => void;
  handleAddAccount: () => void;
}

/** Account creation card used by the settings accounts tab. */
function AddAccountCard({
  showAddAccount,
  newAccountEmail,
  newAccountLabel,
  addAccountError,
  focusOnMount,
  setShowAddAccount,
  setNewAccountEmail,
  setNewAccountLabel,
  setAddAccountError,
  handleAddAccount,
}: AddAccountCardProps) {
  /** Resets and hides the add-account form. */
  const closeForm = () => {
    setShowAddAccount(false);
    setNewAccountEmail("");
    setNewAccountLabel("");
    setAddAccountError("");
  };

  return (
    <div className="rounded-2xl border border-border bg-background p-3 shadow-soft">
      {!showAddAccount ? (
        <OpenAddAccountButton onClick={() => setShowAddAccount(true)} />
      ) : (
        <div className="space-y-3">
          <AddAccountFormHeader onClose={closeForm} />
          <AccountEmailInput
            value={newAccountEmail}
            setValue={setNewAccountEmail}
            setError={setAddAccountError}
            onEnter={handleAddAccount}
            focusOnMount={focusOnMount}
          />
          {addAccountError && <AccountErrorMessage message={addAccountError} />}
          {newAccountEmail && !newAccountEmail.includes("@") && <GmailHint />}
          <Input
            type="text"
            value={newAccountLabel}
            onChange={setNewAccountLabel}
            placeholder={t("accountLabelPlaceholder")}
          />
          <Button
            variant="ghost"
            onClick={handleAddAccount}
            disabled={!newAccountEmail.trim()}
            className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("addAccount")}
          </Button>
        </div>
      )}
    </div>
  );
}

/** Button that opens the add-account form. */
function OpenAddAccountButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
    >
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      {t("addNewAccount")}
    </Button>
  );
}

/** Header row for the add-account form. */
function AddAccountFormHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <h4 className="text-sm font-bold text-foreground">
        {t("addNewAccountTitle")}
      </h4>
      <Tooltip content="Close" side="left">
        <Button
          variant="ghost"
          onClick={onClose}
          className="text-muted-foreground hover:text-muted-foreground dark:hover:text-muted-foreground"
          aria-label="Close"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </Tooltip>
    </div>
  );
}

interface AccountEmailInputProps {
  value: string;
  setValue: (value: string) => void;
  setError: (value: string) => void;
  onEnter: () => void;
  focusOnMount: (el: HTMLInputElement | null) => void;
}

/** Email input with Gmail suffix preview for username-only entries. */
function AccountEmailInput({
  value,
  setValue,
  setError,
  onEnter,
  focusOnMount,
}: AccountEmailInputProps) {
  return (
    <div className="relative">
      <Input
        type="email"
        value={value}
        onChange={(nextValue) => {
          setValue(nextValue);
          setError("");
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") onEnter();
        }}
        onBlur={() => {
          if (value && !value.includes("@")) setValue(`${value}@gmail.com`);
        }}
        placeholder={t("emailPlaceholder")}
        ref={focusOnMount}
      />
      {value && !value.includes("@") && (
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          @gmail.com
        </div>
      )}
    </div>
  );
}

/** Validation message for the add-account card. */
function AccountErrorMessage({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
      <p className="text-xs text-destructive">{message}</p>
    </div>
  );
}

/** Hint shown when a bare Gmail username is entered. */
function GmailHint() {
  return (
    <p className="text-xs text-muted-foreground">
      Press{" "}
      <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-xs">
        Tab
      </kbd>{" "}
      to add @gmail.com
    </p>
  );
}

/** Changelog tab content rendered from static release data. */
function ChangelogPanel() {
  return (
    <div className="space-y-3">
      {CHANGELOG.map((entry) => (
        <ChangelogCard key={entry.version} entry={entry} />
      ))}
    </div>
  );
}

/** Single changelog release card. */
function ChangelogCard({ entry }: { entry: ChangelogEntry }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-background shadow-soft">
      <ChangelogCardHeader entry={entry} />
      <div className="space-y-2.5 p-3">
        {entry.changes.map((change) => (
          <ChangelogChangeGroup
            key={change.type}
            change={change}
            version={entry.version}
          />
        ))}
      </div>
    </div>
  );
}

/** Header for one changelog release card. */
function ChangelogCardHeader({ entry }: { entry: ChangelogEntry }) {
  return (
    <div className="flex items-center justify-between border-b border-border bg-muted/45 px-3.5 py-3">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3M4 11h16M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
            />
          </svg>
        </span>
        <span className="text-sm font-bold text-foreground">
          v{entry.version}
        </span>
      </div>
      <AnimatedBadge
        status="neutral"
        size="sm"
        showIcon={false}
        contentKey={entry.date}
        className="bg-background"
      >
        {entry.date}
      </AnimatedBadge>
    </div>
  );
}

interface ChangelogChangeGroupProps {
  change: ChangelogChange;
  version: string;
}

/** One grouped change type inside a changelog card. */
function ChangelogChangeGroup({ change, version }: ChangelogChangeGroupProps) {
  return (
    <div className="rounded-xl border border-border bg-card/70 p-2.5">
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`inline-flex h-2 w-2 rounded-full ${changeDotClass(change.type)}`}
        />
        <AnimatedBadge
          status={changeBadgeStatus(change.type)}
          size="sm"
          showIcon={false}
          contentKey={`${version}-${change.type}`}
          className="text-[10px] uppercase tracking-wide"
        >
          {change.type}
        </AnimatedBadge>
      </div>
      <ul className="space-y-1.5 text-xs leading-5 text-muted-foreground">
        {change.items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground/60" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Dot color for changelog change type. */
function changeDotClass(type: ChangelogChange["type"]) {
  if (type === "Added") return "bg-emerald-500";
  if (type === "Fixed") return "bg-rose-500";
  return "bg-primary";
}

/** Animated badge status for changelog change type. */
function changeBadgeStatus(type: ChangelogChange["type"]) {
  if (type === "Added") return "success";
  if (type === "Fixed") return "danger";
  return "info";
}

/** Settings modal with general, accounts, presets, advanced, and changelog tabs. */
export default function Settings({
  isOpen,
  onClose,
  onClearHistory,
}: SettingsProps) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [newPresetLabel, setNewPresetLabel] = useState("");
  const [newPresetTag, setNewPresetTag] = useState("");
  const [activeTab, setActiveTab] = useState<
    "general" | "accounts" | "presets" | "advanced" | "changelog"
  >("general");
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [disabledInlineSites, setDisabledInlineSites] = useState<string[]>([]);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState("");
  const [editingEmail, setEditingEmail] = useState("");
  const [version, setVersion] = useState("1.1.0");
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccountEmail, setNewAccountEmail] = useState("");
  const [newAccountLabel, setNewAccountLabel] = useState("");
  const [addAccountError, setAddAccountError] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationRequest | null>(
    null,
  );

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const askForConfirmation = useCallback(
    (request: Omit<ConfirmationRequest, "resolve">) =>
      new Promise<boolean>((resolve) => {
        setConfirmation({ ...request, resolve });
      }),
    [],
  );

  const closeConfirmation = useCallback((confirmed: boolean) => {
    setConfirmation((current) => {
      current?.resolve(confirmed);
      return null;
    });
  }, []);

  useEffect(() => {
    try {
      const manifest = browser.runtime.getManifest();
      if (manifest?.version) {
        setVersion(manifest.version);
      }
    } catch (error) {
      console.log("Could not get manifest version:", error);
    }
  }, []);

  /** Loads saved app settings from extension storage, merged over defaults. */
  const loadSettings = async () => {
    const result = await browser.storage.local.get([
      "app_settings",
      INLINE_DISABLED_SITES_KEY,
    ]);
    if (result.app_settings) {
      setSettings({ ...DEFAULT_SETTINGS, ...result.app_settings });
    }
    setDisabledInlineSites(
      parseDisabledInlineSites(result[INLINE_DISABLED_SITES_KEY]),
    );
  };

  /** Re-enables the inline helper for one previously disabled website. */
  const enableInlineForSite = async (site: string) => {
    const nextSites = disabledInlineSites.filter((item) => item !== site);
    setDisabledInlineSites(nextSites);
    await browser.storage.local.set({
      [INLINE_DISABLED_SITES_KEY]: nextSites,
    });
  };

  /** Loads the email accounts list from extension storage. */
  const loadAccounts = async () => {
    const result = await browser.storage.local.get("email_accounts");
    if (result.email_accounts && Array.isArray(result.email_accounts)) {
      setEmailAccounts(result.email_accounts);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadSettings();
      loadAccounts();
    }
  }, [isOpen]);

  /** Persists settings to extension storage and updates local state. */
  const saveSettings = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    await browser.storage.local.set({ app_settings: newSettings });
  };

  /** Adds a new custom preset from the label/tag form fields. */
  const handleAddPreset = () => {
    if (!newPresetLabel.trim() || !newPresetTag.trim()) return;

    const newPreset: CustomPreset = {
      id: Date.now().toString(),
      label: newPresetLabel.trim(),
      tag: newPresetTag.trim(),
    };

    const updatedSettings = {
      ...settings,
      customPresets: [...settings.customPresets, newPreset],
    };

    saveSettings(updatedSettings);
    setNewPresetLabel("");
    setNewPresetTag("");
    showToast(t("toastPresetAdded"));
  };

  /** Removes a custom preset by id. */
  const handleRemovePreset = (id: string) => {
    const updatedSettings = {
      ...settings,
      customPresets: settings.customPresets.filter((p) => p.id !== id),
    };
    saveSettings(updatedSettings);
    showToast(t("toastPresetRemoved"));
  };

  /** Downloads the current settings as a JSON file. */
  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `gmail-alias-settings-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(t("toastSettingsExported"));
  };

  /** Imports settings from a user-selected JSON file. */
  const handleImportSettings = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const imported = JSON.parse(text);
        saveSettings({ ...DEFAULT_SETTINGS, ...imported });
        showToast(t("toastSettingsImported"));
      } catch {
        showToast(t("toastImportFailed"));
      }
    };
    input.click();
  };

  /** Focuses an input once when it mounts (replaces autoFocus). */
  const focusOnMount = useCallback((el: HTMLInputElement | null) => {
    el?.focus();
  }, []);

  /** Resets all settings to defaults after user confirmation. */
  const handleResetSettings = async () => {
    const confirmed = await askForConfirmation({
      title: t("resetSettingsTitle"),
      message: t("resetSettingsMessage"),
      confirmLabel: t("reset"),
      variant: "danger",
    });

    if (!confirmed) return;

    saveSettings(DEFAULT_SETTINGS);
    showToast(t("toastSettingsReset"));
  };

  /** Clears recent aliases after user confirmation. */
  const handleClearHistory = async () => {
    const confirmed = await askForConfirmation({
      title: t("clearHistoryTitle"),
      message: t("clearHistoryMessage"),
      confirmLabel: t("clear"),
      variant: "danger",
    });

    if (confirmed) {
      onClearHistory();
    }
  };

  /** Marks the given account as active and updates the base email. */
  const handleSwitchAccount = async (accountId: string) => {
    const updated = emailAccounts.map((acc) => ({
      ...acc,
      isActive: acc.id === accountId,
    }));
    await browser.storage.local.set({ email_accounts: updated });
    const activeAccount = updated.find((acc) => acc.id === accountId);
    if (activeAccount) {
      await browser.storage.local.set({ base_email: activeAccount.email });
    }
    setEmailAccounts(updated);
    showToast(t("toastAccountSwitched"));
  };

  /** Deletes an account and all of its stored data after confirmation. */
  const handleDeleteAccount = async (account: EmailAccount) => {
    const confirmMsg = t("deleteAccountMessage", [
      account.label,
      account.email,
    ]);

    const confirmed = await askForConfirmation({
      title: t("deleteAccountTitle"),
      message: confirmMsg,
      confirmLabel: t("delete"),
      variant: "danger",
    });

    if (!confirmed) return;

    // Delete account-specific data
    const historyKey = getAccountStorageKey(
      account.email,
      "gmail_alias_recent",
    );
    const statsKey = getAccountStorageKey(account.email, "alias_stats");
    const favoritesKey = getAccountStorageKey(account.email, "favorites");
    const websiteAliasesKey = getAccountStorageKey(
      account.email,
      "website_alias_map",
    );

    // Remove from accounts list
    let updated = emailAccounts.filter((acc) => acc.id !== account.id);

    // If we deleted the active account, make the first one active
    if (account.isActive && updated.length > 0) {
      updated = updated.map((acc, index) => ({
        ...acc,
        isActive: index === 0,
      }));
      await browser.storage.local.set({ base_email: updated[0].email });
    }

    await browser.storage.local.remove([
      historyKey,
      statsKey,
      favoritesKey,
      websiteAliasesKey,
      ...(updated.length === 0
        ? ["base_email", "gmail_alias_recent", "alias_stats", "favorites"]
        : []),
    ]);
    await browser.storage.local.set({ email_accounts: updated });
    setEmailAccounts(updated);
    showToast(t("toastAccountDeleted"));

    if (updated.length === 0) {
      onClose();
    }
  };

  /** Enters edit mode for the given account. */
  const handleStartEdit = (account: EmailAccount) => {
    setEditingAccountId(account.id);
    setEditingLabel(account.label);
    setEditingEmail(account.email);
  };

  /** Exits edit mode without saving. */
  const handleCancelEdit = () => {
    setEditingAccountId(null);
    setEditingLabel("");
    setEditingEmail("");
  };

  /** Saves account edits, migrating stored data if the email changed. */
  const handleSaveEdit = async (accountId: string) => {
    if (!editingLabel.trim()) {
      showToast(t("errorLabelRequired"));
      return;
    }

    let newEmail = editingEmail.trim();
    if (newEmail && !newEmail.includes("@")) {
      newEmail += "@gmail.com";
    }

    if (!validateEmail(newEmail).isValid) {
      showToast(t("errorInvalidEmail"));
      return;
    }

    const account = emailAccounts.find((acc) => acc.id === accountId);
    if (!account) return;

    const oldEmail = account.email;

    // Check if email changed
    if (oldEmail !== newEmail) {
      // Check if new email already exists in another account
      const emailExists = emailAccounts.some(
        (acc) =>
          acc.id !== accountId &&
          acc.email.toLowerCase() === newEmail.toLowerCase(),
      );
      if (emailExists) {
        showToast(t("errorDuplicateEmail"));
        return;
      }

      const confirmMsg = t("changeAccountEmailMessage", [oldEmail, newEmail]);

      const confirmed = await askForConfirmation({
        title: t("changeAccountEmailTitle"),
        message: confirmMsg,
        confirmLabel: t("changeEmail"),
      });

      if (!confirmed) return;

      // Migrate data from old email to new email
      const oldHistoryKey = getAccountStorageKey(
        oldEmail,
        "gmail_alias_recent",
      );
      const oldStatsKey = getAccountStorageKey(oldEmail, "alias_stats");
      const oldFavoritesKey = getAccountStorageKey(oldEmail, "favorites");
      const oldWebsiteAliasesKey = getAccountStorageKey(
        oldEmail,
        "website_alias_map",
      );

      const newHistoryKey = getAccountStorageKey(
        newEmail,
        "gmail_alias_recent",
      );
      const newStatsKey = getAccountStorageKey(newEmail, "alias_stats");
      const newFavoritesKey = getAccountStorageKey(newEmail, "favorites");
      const newWebsiteAliasesKey = getAccountStorageKey(
        newEmail,
        "website_alias_map",
      );

      // Get old data
      const oldData = await browser.storage.local.get([
        oldHistoryKey,
        oldStatsKey,
        oldFavoritesKey,
        oldWebsiteAliasesKey,
      ]);

      // Save to new keys
      await browser.storage.local.set({
        [newHistoryKey]: oldData[oldHistoryKey] || [],
        [newStatsKey]: oldData[oldStatsKey] || { total: 0, tags: {} },
        [newFavoritesKey]: oldData[oldFavoritesKey] || [],
        [newWebsiteAliasesKey]: oldData[oldWebsiteAliasesKey] || {},
      });

      // Delete old keys
      await browser.storage.local.remove([
        oldHistoryKey,
        oldStatsKey,
        oldFavoritesKey,
        oldWebsiteAliasesKey,
      ]);

      // Update base_email if this is the active account
      if (account.isActive) {
        await browser.storage.local.set({ base_email: newEmail });
      }
    }

    // Update account in list
    const updated = emailAccounts.map((acc) =>
      acc.id === accountId
        ? { ...acc, label: editingLabel.trim(), email: newEmail }
        : acc,
    );

    await browser.storage.local.set({ email_accounts: updated });
    setEmailAccounts(updated);
    setEditingAccountId(null);
    setEditingLabel("");
    setEditingEmail("");
    showToast(t("toastAccountUpdated"));
  };

  /** Validates and adds a new email account. */
  const handleAddAccount = async () => {
    let email = newAccountEmail.trim();

    if (!email) {
      setAddAccountError(t("errorEnterEmail"));
      return;
    }

    // Auto-add @gmail.com if only username provided
    if (!email.includes("@")) {
      email += "@gmail.com";
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setAddAccountError(t("errorInvalidEmail"));
      return;
    }

    // Check if account already exists
    const exists = emailAccounts.some((acc) => acc.email === email);
    if (exists) {
      setAddAccountError(t("errorAccountExists"));
      return;
    }

    // Create new account — only auto-activate if it's the first account
    const isFirst = emailAccounts.length === 0;
    const newAccount: EmailAccount = {
      id: Date.now().toString(),
      email,
      label: newAccountLabel.trim() || email.split("@")[0],
      isActive: isFirst,
    };

    const updated = isFirst ? [newAccount] : [...emailAccounts, newAccount];

    await browser.storage.local.set({
      email_accounts: updated,
      ...(isFirst ? { base_email: newAccount.email } : {}),
    });

    setEmailAccounts(updated);
    setShowAddAccount(false);
    setNewAccountEmail("");
    setNewAccountLabel("");
    setAddAccountError("");
    showToast(t("toastAccountAdded", newAccount.label));
  };

  if (!isOpen) return null;

  // skipcq: JS-0415
  return (
    // skipcq: JS-0415
    <div className="absolute inset-0 z-50 flex bg-muted">
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-muted">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-background px-3 py-3 text-foreground">
          <div className="flex items-center gap-2">
            <Tooltip content="Back" side="bottom">
              <Button
                variant="ghost"
                onClick={onClose}
                className="h-9 w-9 rounded-xl p-0 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Back"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </Button>
            </Tooltip>
            <h2 className="text-base font-semibold">{t("settings")}</h2>
          </div>
          <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
            v{version}
          </span>
        </div>

        {/* Tabs */}
        <div className="border-b border-border bg-background px-3 py-2.5">
          <div className="grid grid-cols-3 gap-1 rounded-xl border border-border bg-muted/70 p-1">
            <Button
              variant="ghost"
              onClick={() => setActiveTab("general")}
              className={`h-9 min-w-0 rounded-lg px-2 text-xs font-medium transition-colors ${
                activeTab === "general"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              {t("general")}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab("accounts")}
              className={`h-9 min-w-0 rounded-lg px-2 text-xs font-medium transition-colors ${
                activeTab === "accounts"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {t("accounts")}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab("changelog")}
              className={`h-9 min-w-0 rounded-lg px-2 text-xs font-medium transition-colors ${
                activeTab === "changelog"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6M9 8h1m4 13H5a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {t("changelog")}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-muted p-3">
          {/* General Tab */}
          {activeTab === "general" && (
            // skipcq: JS-0415
            <BouncyAccordion
              defaultValue="appearance"
              className="overflow-hidden rounded-2xl border border-border bg-background shadow-soft divide-y divide-border/70"
              classNames={{
                item: "bg-background data-[state=open]:bg-background",
                trigger: "min-h-12 gap-3 px-3 hover:bg-muted/45",
                icon: "h-7 w-7 rounded-lg",
                title: "text-sm font-bold",
                chevron: "text-muted-foreground",
                content: "border-t border-border/70 bg-background",
                description: "px-3 py-3 text-foreground",
              }}
              items={[
                {
                  id: "appearance",
                  title: t("appearanceDisplay"),
                  icon: (
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                        />
                      </svg>
                    </span>
                  ),
                  description: (
                    <AppearanceSettingsPanel
                      settings={settings}
                      saveSettings={saveSettings}
                    />
                  ),
                },
                {
                  id: "inline-helper-sites",
                  title: t("inlineDisabledSites"),
                  icon: (
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 2v10m6.36-6.36a9 9 0 11-12.72 0"
                        />
                      </svg>
                    </span>
                  ),
                  description: (
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground">
                        {t("inlineDisabledSitesDescription")}
                      </p>
                      {disabledInlineSites.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-border px-3 py-3 text-center text-xs text-muted-foreground">
                          {t("noDisabledSites")}
                        </p>
                      ) : (
                        <div className="max-h-36 space-y-1.5 overflow-y-auto">
                          {disabledInlineSites.map((site) => (
                            <div
                              key={site}
                              className="flex items-center justify-between gap-2 rounded-xl border border-border bg-muted/45 px-3 py-2"
                            >
                              <span className="min-w-0 truncate font-mono text-xs text-foreground">
                                {site}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="shrink-0 rounded-lg px-2 text-xs text-primary hover:bg-primary/10"
                                onClick={() => enableInlineForSite(site)}
                                aria-label={`${t("enableInlineForSite")}: ${site}`}
                              >
                                {t("enableInlineForSite")}
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ),
                },
                {
                  id: "alias-generation",
                  title: t("aliasGeneration"),
                  icon: (
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/15">
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </span>
                  ),
                  description: (
                    <AliasGenerationSettingsPanel
                      settings={settings}
                      saveSettings={saveSettings}
                    />
                  ),
                },
                {
                  id: "custom-presets",
                  title: t("customPresets"),
                  icon: (
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/15">
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                    </span>
                  ),
                  description: (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          value={newPresetLabel}
                          onChange={setNewPresetLabel}
                          placeholder={t("label")}
                          className="min-w-0"
                        />
                        <Input
                          value={newPresetTag}
                          onChange={setNewPresetTag}
                          placeholder={t("tag")}
                          className="min-w-0"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        onClick={handleAddPreset}
                        disabled={
                          !newPresetLabel.trim() || !newPresetTag.trim()
                        }
                        size="sm"
                        fullWidth
                        className="rounded-xl bg-primary/10 text-primary hover:bg-primary/15 disabled:bg-muted disabled:text-muted-foreground"
                      >
                        {t("addPreset")}
                      </Button>
                      {settings.customPresets.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border space-y-1.5 max-h-28 overflow-y-auto">
                          {settings.customPresets.map((preset) => (
                            <div
                              key={preset.id}
                              className="flex items-center justify-between px-3 py-2 bg-muted/45 dark:bg-muted rounded-xl border border-border dark:border-border"
                            >
                              <div className="text-xs text-foreground">
                                <span className="font-semibold">
                                  {preset.label}
                                </span>
                                <span className="text-muted-foreground font-mono ml-1.5">
                                  +{preset.tag}
                                </span>
                              </div>
                              <Tooltip content="Remove preset" side="left">
                                <Button
                                  variant="ghost"
                                  onClick={() => handleRemovePreset(preset.id)}
                                  className="p-1 text-destructive hover:bg-destructive/10 rounded-full transition-colors flex-shrink-0"
                                  aria-label="Remove preset"
                                >
                                  <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </Button>
                              </Tooltip>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ),
                },
                {
                  id: "data-management",
                  title: t("dataManagement"),
                  icon: (
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                        />
                      </svg>
                    </span>
                  ),
                  description: (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <Tooltip
                          content={t("export")}
                          side="top"
                          wrapperClassName="w-full"
                        >
                          <Button
                            onClick={handleExportSettings}
                            variant="secondary"
                            size="sm"
                            fullWidth
                            className="border-border bg-background text-foreground shadow-sm hover:bg-muted/70"
                            aria-label={t("export")}
                          >
                            {t("export")}
                          </Button>
                        </Tooltip>
                        <Tooltip
                          content={t("import")}
                          side="top"
                          wrapperClassName="w-full"
                        >
                          <Button
                            onClick={handleImportSettings}
                            variant="secondary"
                            size="sm"
                            fullWidth
                            className="border-border bg-background text-foreground shadow-sm hover:bg-muted/70"
                            aria-label={t("import")}
                          >
                            {t("import")}
                          </Button>
                        </Tooltip>
                        <Tooltip
                          content={t("clear")}
                          side="top"
                          wrapperClassName="w-full"
                        >
                          <Button
                            onClick={handleClearHistory}
                            variant="danger"
                            size="sm"
                            fullWidth
                            className="bg-destructive/10 text-destructive hover:bg-destructive/15"
                            aria-label={t("clear")}
                          >
                            {t("clear")}
                          </Button>
                        </Tooltip>
                      </div>
                      <Tooltip
                        content={t("resetSettings")}
                        side="bottom"
                        wrapperClassName="w-full"
                      >
                        <Button
                          variant="ghost"
                          onClick={handleResetSettings}
                          className="w-full rounded-xl text-xs text-destructive hover:bg-destructive/10 hover:text-destructive font-medium py-1"
                          aria-label={t("resetSettings")}
                        >
                          {t("resetSettings")}
                        </Button>
                      </Tooltip>
                    </div>
                  ),
                },
              ]}
            />
          )}

          {/* Accounts Tab */}
          {activeTab === "accounts" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  {t("emailAccounts")}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {t("manageAccountsDescription")}
                </p>
              </div>

              {emailAccounts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  {t("noAccountsFound")}
                </div>
              ) : (
                <div className="space-y-2">
                  {emailAccounts.map((account) => (
                    <div
                      key={account.id}
                      className={`rounded-2xl border transition-all ${
                        account.isActive
                          ? "border-primary/40 bg-primary/10"
                          : "border-border bg-background hover:border-border dark:hover:border-border"
                      }`}
                    >
                      {editingAccountId === account.id ? (
                        // Edit mode
                        <div className="p-3 space-y-2">
                          <div>
                            <label className="block text-xs font-medium text-foreground mb-1">
                              {t("label")}
                            </label>
                            <Input
                              type="text"
                              value={editingLabel}
                              onChange={setEditingLabel}
                              placeholder={t("accountLabel")}
                              ref={focusOnMount}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-foreground mb-1">
                              {t("emailAddress")}
                            </label>
                            <Input
                              type="email"
                              value={editingEmail}
                              onChange={setEditingEmail}
                              placeholder={t("emailAddressPlaceholder")}
                            />
                            {editingEmail !== account.email && (
                              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                {t("emailChangeWarning")}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 pt-1">
                            <Button
                              variant="ghost"
                              onClick={() => handleSaveEdit(account.id)}
                              className="flex-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                              {t("saveChanges")}
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={handleCancelEdit}
                              className="flex-1 px-3 py-1.5 bg-muted dark:bg-muted text-foreground dark:text-foreground text-xs font-medium rounded-xl hover:bg-muted dark:hover:bg-muted transition-colors"
                            >
                              {t("cancel")}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // View mode
                        // skipcq: JS-0415
                        <div className="flex items-center gap-2 p-3">
                          {/* Radio button to select active account */}
                          <label className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">
                            <RadioGroup
                              value={account.isActive ? account.id : ""}
                              onValueChange={() =>
                                handleSwitchAccount(account.id)
                              }
                            >
                              <RadioGroupItem value={account.id} />
                            </RadioGroup>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-foreground truncate">
                                  {account.label}
                                </span>
                                {account.isActive && (
                                  <span className="flex-shrink-0 rounded bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                                    {t("active")}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground truncate font-mono">
                                {account.email}
                              </div>
                            </div>
                          </label>

                          {/* Action buttons */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Tooltip content={t("editAccount")} side="left">
                              <Button
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartEdit(account);
                                }}
                                className="p-1.5 text-muted-foreground hover:bg-muted dark:hover:bg-muted rounded transition-colors"
                                aria-label={t("editAccount")}
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </Button>
                            </Tooltip>
                            <Tooltip
                              content={t("deleteThisAccount")}
                              side="left"
                            >
                              <Button
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAccount(account);
                                }}
                                className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors"
                                aria-label={t("deleteThisAccount")}
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </Button>
                            </Tooltip>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <AddAccountCard
                showAddAccount={showAddAccount}
                newAccountEmail={newAccountEmail}
                newAccountLabel={newAccountLabel}
                addAccountError={addAccountError}
                focusOnMount={focusOnMount}
                setShowAddAccount={setShowAddAccount}
                setNewAccountEmail={setNewAccountEmail}
                setNewAccountLabel={setNewAccountLabel}
                setAddAccountError={setAddAccountError}
                handleAddAccount={handleAddAccount}
              />
            </div>
          )}
          {/* Changelog Tab */}
          {activeTab === "changelog" && <ChangelogPanel />}
        </div>

        <div className="hidden">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <img
              src="/icons/32.png"
              alt=""
              className="w-6 h-6 rounded-md flex-shrink-0"
            />
            <span className="font-medium">{t("extensionName")}</span>
            <span className="text-muted-foreground dark:text-muted-foreground">
              •
            </span>
            <span className="text-muted-foreground dark:text-muted-foreground">
              v{version}
            </span>
          </div>
        </div>
      </div>

      {/* Settings Toast - inside modal so it shows above the overlay */}
      {toast && (
        <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg">
          {toast}
        </div>
      )}

      {confirmation && (
        <ConfirmationDialog
          request={confirmation}
          onCancel={() => closeConfirmation(false)}
          onConfirm={() => closeConfirmation(true)}
        />
      )}
    </div>
  );
}

interface ConfirmationDialogProps {
  request: ConfirmationRequest;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Renders the blocking confirmation prompt used by destructive settings actions. */
function ConfirmationDialog({
  request,
  onCancel,
  onConfirm,
}: ConfirmationDialogProps) {
  const confirmClass =
    request.variant === "danger"
      ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-ring"
      : "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring";

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="w-full max-w-sm rounded-lg bg-card p-4 shadow-xl">
        <h3 className="text-sm font-bold text-foreground">{request.title}</h3>
        <p className="mt-2 whitespace-pre-line text-xs leading-5 text-muted-foreground dark:text-muted-foreground">
          {request.message}
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="ghost"
            type="button"
            onClick={onCancel}
            className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring dark:bg-muted dark:text-foreground dark:hover:bg-muted"
          >
            Cancel
          </Button>
          <Button
            variant="ghost"
            type="button"
            onClick={onConfirm}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 ${confirmClass}`}
          >
            {request.confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
