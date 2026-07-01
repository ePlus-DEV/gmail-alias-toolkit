import { useState, useEffect } from 'react';
import { getAccountStorageKey } from '../utils';

interface Stats {
  totalGenerated: number;
  mostUsedTag: string;
  createdToday: number;
  createdThisWeek: number;
}

export default function Statistics() {
  const [stats, setStats] = useState<Stats>({
    totalGenerated: 0,
    mostUsedTag: '-',
    createdToday: 0,
    createdThisWeek: 0,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [activeEmail, setActiveEmail] = useState('your.email@gmail.com');

  useEffect(() => {
    loadActiveEmailAndStats();
    
    // Listen for storage changes
    const handleStorageChange = (changes: any) => {
      // Reload if any account-specific storage key changes or if email_accounts changes
      if (changes.email_accounts) {
        loadActiveEmailAndStats();
      } else {
        // Check if any changed key starts with our prefixes
        const changedKeys = Object.keys(changes);
        const relevantChange = changedKeys.some(key => 
          key.startsWith('gmail_alias_recent_') || 
          key.startsWith('alias_stats_')
        );
        if (relevantChange) {
          loadActiveEmailAndStats();
        }
      }
    };

    browser.storage.onChanged.addListener(handleStorageChange);
    return () => browser.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  const loadActiveEmailAndStats = async () => {
    // Get active account first
    const accountResult = await browser.storage.local.get(['email_accounts', 'base_email']);
    let email = 'your.email@gmail.com';
    
    if (accountResult.email_accounts && Array.isArray(accountResult.email_accounts)) {
      const activeAccount = accountResult.email_accounts.find((acc: any) => acc.isActive);
      if (activeAccount) {
        email = activeAccount.email;
      }
    } else if (accountResult.base_email) {
      email = accountResult.base_email as string;
    }
    
    setActiveEmail(email);
    
    // Load stats for this account
    const historyKey = getAccountStorageKey(email, 'gmail_alias_recent');
    const statsKey = getAccountStorageKey(email, 'alias_stats');
    
    const result = await browser.storage.local.get([historyKey, statsKey]);
    const recent = (result[historyKey] || []) as any[];
    const savedStats = (result[statsKey] || { total: 0, tags: {} }) as { total: number; tags: Record<string, number> };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekAgo = today - 7 * 24 * 60 * 60 * 1000;

    const createdToday = recent.filter((a: any) => a.timestamp >= today).length;
    const createdThisWeek = recent.filter((a: any) => a.timestamp >= weekAgo).length;

    // Find most used tag
    const tags = savedStats.tags || {};
    const mostUsedTag = Object.keys(tags).length > 0
      ? Object.entries(tags).sort((a: any, b: any) => b[1] - a[1])[0][0]
      : '-';

    setStats({
      totalGenerated: savedStats.total || 0,
      mostUsedTag,
      createdToday,
      createdThisWeek,
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2.5 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View Statistics</span>
          <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
      </button>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3.5">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Statistics</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-blue-50 dark:bg-blue-950/40 rounded-lg p-2.5">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalGenerated}</div>
          <div className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">Total Generated</div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950/40 rounded-lg p-2.5">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.createdToday}</div>
          <div className="text-xs text-purple-700 dark:text-purple-300 mt-0.5">Created Today</div>
        </div>

        <div className="bg-green-50 dark:bg-green-950/40 rounded-lg p-2.5">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.createdThisWeek}</div>
          <div className="text-xs text-green-700 dark:text-green-300 mt-0.5">This Week</div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-950/40 rounded-lg p-2.5">
          <div className="text-sm font-bold text-orange-600 dark:text-orange-400 truncate">{stats.mostUsedTag}</div>
          <div className="text-xs text-orange-700 dark:text-orange-300 mt-0.5">Most Used Tag</div>
        </div>
      </div>
    </div>
  );
}
