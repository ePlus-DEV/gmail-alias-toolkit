import { useState, useEffect } from "react";
import { BarChart3, Check, Clock, Mail, X } from "lucide-react";
import { NumberAnimation, StatCard } from "../../../src/components/ui";
import { getAccountStorageKey } from "../utils";

interface Stats {
  totalGenerated: number;
  mostUsedTag: string;
  createdToday: number;
  createdThisWeek: number;
}

interface StoredAccount {
  email: string;
  isActive: boolean;
}

interface RecentAlias {
  timestamp: number;
}

type StorageChanges = Record<
  string,
  { newValue?: unknown; oldValue?: unknown }
>;

/** Collapsible panel showing alias usage statistics for the active account. */
export default function Statistics() {
  const [stats, setStats] = useState<Stats>({
    totalGenerated: 0,
    mostUsedTag: "-",
    createdToday: 0,
    createdThisWeek: 0,
  });
  const [isOpen, setIsOpen] = useState(false);

  /** Resolves the active account email, then loads and computes its stats. */
  const loadActiveEmailAndStats = async () => {
    // Get active account first
    const accountResult = await browser.storage.local.get([
      "email_accounts",
      "base_email",
    ]);
    let email = "your.email@gmail.com";

    if (
      accountResult.email_accounts &&
      Array.isArray(accountResult.email_accounts)
    ) {
      const activeAccount = (
        accountResult.email_accounts as StoredAccount[]
      ).find((acc) => acc.isActive);
      if (activeAccount) {
        email = activeAccount.email;
      }
    } else if (accountResult.base_email) {
      email = accountResult.base_email as string;
    }

    // Load stats for this account
    const historyKey = getAccountStorageKey(email, "gmail_alias_recent");
    const statsKey = getAccountStorageKey(email, "alias_stats");

    const result = await browser.storage.local.get([historyKey, statsKey]);
    const recent = (result[historyKey] || []) as RecentAlias[];
    const savedStats = (result[statsKey] || { total: 0, tags: {} }) as {
      total: number;
      tags: Record<string, number>;
    };

    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime();
    const weekAgo = today - 7 * 24 * 60 * 60 * 1000;

    const createdToday = recent.filter((a) => a.timestamp >= today).length;
    const createdThisWeek = recent.filter((a) => a.timestamp >= weekAgo).length;

    // Find most used tag
    const tags = savedStats.tags || {};
    const mostUsedTag =
      Object.keys(tags).length > 0
        ? Object.entries(tags).sort((a, b) => b[1] - a[1])[0][0]
        : "-";

    setStats({
      totalGenerated: savedStats.total || 0,
      mostUsedTag,
      createdToday,
      createdThisWeek,
    });
  };

  useEffect(() => {
    loadActiveEmailAndStats();

    /** Reloads stats when account or alias storage keys change. */
    const handleStorageChange = (changes: StorageChanges) => {
      // Reload if any account-specific storage key changes or if email_accounts changes
      if (changes.email_accounts) {
        loadActiveEmailAndStats();
      } else {
        // Check if any changed key starts with our prefixes
        const changedKeys = Object.keys(changes);
        const relevantChange = changedKeys.some(
          (key) =>
            key.startsWith("gmail_alias_recent_") ||
            key.startsWith("alias_stats_"),
        );
        if (relevantChange) {
          loadActiveEmailAndStats();
        }
      }
    };

    browser.storage.onChanged.addListener(handleStorageChange);
    return () => browser.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          View Statistics
        </span>
        <BarChart3 className="h-4 w-4 text-gray-400 dark:text-gray-500" />
      </button>
    );
  }

  // skipcq: JS-0415
  return (
    // skipcq: JS-0415
    <div className="p-3.5">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Statistics
        </h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <StatCard icon={<Mail className="h-4 w-4" />} value={<NumberAnimation value={stats.totalGenerated} />} label="Total Generated" />
        <StatCard icon={<Check className="h-4 w-4" />} value={<NumberAnimation value={stats.createdToday} />} label="Created Today" />
        <StatCard icon={<Clock className="h-4 w-4" />} value={<NumberAnimation value={stats.createdThisWeek} />} label="This Week" />
        <StatCard icon={<BarChart3 className="h-4 w-4" />} value={stats.mostUsedTag} label="Top Tag" />
      </div>
    </div>
  );
}
