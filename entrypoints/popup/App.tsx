import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import './App.css';
import Settings from './components/Settings';
import Statistics from './components/Statistics';
import GmailTricks from './components/GmailTricks';
import WelcomeScreen from './components/WelcomeScreen';
import {
  getAccountStorageKey,
  generateAlias,
  generateRandomString,
  filterAliases,
  type RandomFormat,
} from './utils';

interface Alias {
  email: string;
  timestamp: number;
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
  randomFormat?: 'private-mail' | 'alphanumeric' | 'words' | 'timestamp';
  theme?: 'light' | 'dark' | 'auto';
}

interface StorageResult {
  [key: string]: any;
  gmail_alias_recent?: Alias[];
  base_email?: string;
  app_settings?: AppSettings;
  alias_stats?: {
    total: number;
    tags: Record<string, number>;
  };
}


function App() {
  const [baseEmail, setBaseEmail] = useState('your.email@gmail.com');
  const [customTag, setCustomTag] = useState('');
  const [recentAliases, setRecentAliases] = useState<Alias[]>([]);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [maxRecent, setMaxRecent] = useState(20);
  const [customPresets, setCustomPresets] = useState<Preset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'alphabetical'>('recent');
  const [viewMode, setViewMode] = useState<'all' | 'favorites'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [randomFormat, setRandomFormat] = useState<RandomFormat>('private-mail');
  const [generatedRandomList, setGeneratedRandomList] = useState<string[]>([]);
  const [randomEmailCount, setRandomEmailCount] = useState(10);
  const [activeGeneratorTab, setActiveGeneratorTab] = useState<'random' | 'tags' | 'tricks'>('random');
  const [emailAccounts, setEmailAccounts] = useState<any[]>([]);
  const [hasEmailAccounts, setHasEmailAccounts] = useState(true);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccountEmail, setNewAccountEmail] = useState('');
  const [newAccountLabel, setNewAccountLabel] = useState('');
  const [addAccountError, setAddAccountError] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  // Bulk delete
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedAliases, setSelectedAliases] = useState<Set<string>>(new Set());
  // QR code modal
  const [qrAlias, setQrAlias] = useState<string | null>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  // Theme
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');

  // Load recent aliases, base email, and settings from storage
  useEffect(() => {
    browser.storage.local.get(['base_email', 'app_settings', 'email_accounts', 'gmail_alias_recent', 'alias_stats', 'favorites']).then(async (result: StorageResult) => {
      let activeEmail = 'your.email@gmail.com';
      let needsMigration = false;
      
      // Load active email from email_accounts or fall back to base_email
      if (result.email_accounts && Array.isArray(result.email_accounts)) {
        const activeAccount = result.email_accounts.find((acc: any) => acc.isActive);
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
      if (needsMigration && (result.gmail_alias_recent || result.alias_stats || result.favorites)) {
        const historyKey = getAccountStorageKey(activeEmail, 'gmail_alias_recent');
        const statsKey = getAccountStorageKey(activeEmail, 'alias_stats');
        const favoritesKey = getAccountStorageKey(activeEmail, 'favorites');
        
        // Only migrate if account-specific data doesn't exist yet
        const accountData = await browser.storage.local.get([historyKey, statsKey, favoritesKey]);
        
        if (!accountData[historyKey] && !accountData[statsKey] && !accountData[favoritesKey]) {
          await browser.storage.local.set({
            [historyKey]: result.gmail_alias_recent || [],
            [statsKey]: result.alias_stats || { total: 0, tags: {} },
            [favoritesKey]: result.favorites || [],
          });
          console.log('Migrated old data to account-specific storage for:', activeEmail);
        }
      }
      
      // Load account-specific history
      const historyKey = getAccountStorageKey(activeEmail, 'gmail_alias_recent');
      const favoritesKey = getAccountStorageKey(activeEmail, 'favorites');
      const historyResult = await browser.storage.local.get([historyKey, favoritesKey]);
      if (historyResult[historyKey] && Array.isArray(historyResult[historyKey])) {
        setRecentAliases(historyResult[historyKey] as Alias[]);
      } else {
        setRecentAliases([]);
      }
      
      // Load favorites
      if (historyResult[favoritesKey] && Array.isArray(historyResult[favoritesKey])) {
        const favEmails = historyResult[favoritesKey].map((f: any) => f.email);
        setFavorites(favEmails);
      } else {
        setFavorites([]);
      }
      
      if (result.app_settings) {
        setMaxRecent(result.app_settings.maxHistory || 20);
        setCustomPresets(result.app_settings.customPresets || []);
        setRandomFormat(result.app_settings.randomFormat || 'private-mail');
        const savedTheme = result.app_settings.theme || 'light';
        setTheme(savedTheme);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', savedTheme === 'dark' || (savedTheme === 'auto' && prefersDark));
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
    const handleStorageChange = async (changes: any) => {
      if (changes.app_settings) {
        const newSettings = changes.app_settings.newValue;
        if (newSettings) {
          setMaxRecent(newSettings.maxHistory || 20);
          setCustomPresets(newSettings.customPresets || []);
          setRandomFormat(newSettings.randomFormat || 'private-mail');
          const t = newSettings.theme || 'light';
          setTheme(t);
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          document.documentElement.classList.toggle('dark', t === 'dark' || (t === 'auto' && prefersDark));
        }
      }
      if (changes.email_accounts) {
        const newAccounts = changes.email_accounts.newValue;
        if (newAccounts) {
          setEmailAccounts(newAccounts);
          setHasEmailAccounts(newAccounts.length > 0);
          // Update base email if active account changed
          const activeAccount = newAccounts.find((acc: any) => acc.isActive);
          if (activeAccount && activeAccount.email !== baseEmail) {
            setBaseEmail(activeAccount.email);
            // Load history for new account
            const historyKey = getAccountStorageKey(activeAccount.email, 'gmail_alias_recent');
            const historyResult = await browser.storage.local.get(historyKey);
            if (historyResult[historyKey] && Array.isArray(historyResult[historyKey])) {
              setRecentAliases(historyResult[historyKey] as Alias[]);
            } else {
              setRecentAliases([]);
            }
            // Load favorites for new account
            const favoritesKey = getAccountStorageKey(activeAccount.email, 'favorites');
            const favResult = await browser.storage.local.get(favoritesKey);
            if (favResult[favoritesKey] && Array.isArray(favResult[favoritesKey])) {
              const favEmails = favResult[favoritesKey].map((f: any) => f.email);
              setFavorites(favEmails);
            } else {
              setFavorites([]);
            }
          }
        }
      }
      
      // Listen for favorites changes
      const favoritesKey = getAccountStorageKey(baseEmail, 'favorites');
      if (changes[favoritesKey]) {
        const newFavorites = changes[favoritesKey].newValue;
        if (newFavorites && Array.isArray(newFavorites)) {
          const favEmails = newFavorites.map((f: any) => f.email);
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
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSettingsOpen(true);
      }
      // Escape to close settings
      if (e.key === 'Escape' && isSettingsOpen) {
        setIsSettingsOpen(false);
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen]);

  const saveRecentAlias = (email: string) => saveRecentAliases([email]);

  // Batched save: computes the merged list and stats totals once, avoiding the
  // stale-closure / lost-update race that happens when saveRecentAlias is called
  // N times in a tight loop (e.g. "Copy All").
  const saveRecentAliases = (emails: string[]) => {
    if (emails.length === 0) return;

    const now = Date.now();
    const newAliases: Alias[] = emails.map((email, i) => ({ email, timestamp: now - i }));
    const newEmailSet = new Set(emails);

    const updated = [...newAliases, ...recentAliases.filter((a) => !newEmailSet.has(a.email))].slice(
      0,
      maxRecent
    );

    setRecentAliases(updated);

    // Save with account-specific key
    const historyKey = getAccountStorageKey(baseEmail, 'gmail_alias_recent');
    browser.storage.local.set({ [historyKey]: updated });

    // Update statistics
    updateStats(emails);
  };

  const updateStats = async (emails: string[]) => {
    // Use account-specific stats key
    const statsKey = getAccountStorageKey(baseEmail, 'alias_stats');
    const result: StorageResult = await browser.storage.local.get(statsKey);
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

  // QR code: draw when alias changes
  useEffect(() => {
    if (qrAlias && qrCanvasRef.current) {
      QRCode.toCanvas(qrCanvasRef.current, qrAlias, { width: 200, margin: 2 });
    }
  }, [qrAlias]);

  // Export helpers
  const downloadFile = (filename: string, mimeType: string, content: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAliases = (format: 'csv' | 'json') => {
    if (recentAliases.length === 0) return;
    if (format === 'csv') {
      const rows = recentAliases.map(a =>
        `"${a.email}","${new Date(a.timestamp).toISOString()}"`
      );
      downloadFile(`aliases-${Date.now()}.csv`, 'text/csv', `Email,Created At\n${rows.join('\n')}`);
    } else {
      const data = recentAliases.map(a => ({ email: a.email, createdAt: new Date(a.timestamp).toISOString() }));
      downloadFile(`aliases-${Date.now()}.json`, 'application/json', JSON.stringify(data, null, 2));
    }
    setToastMessage(`✓ Exported ${recentAliases.length} aliases`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  // Bulk delete
  const deleteSelected = async () => {
    const count = selectedAliases.size;
    const updated = recentAliases.filter(a => !selectedAliases.has(a.email));
    setRecentAliases(updated);
    const historyKey = getAccountStorageKey(baseEmail, 'gmail_alias_recent');
    const favoritesKey = getAccountStorageKey(baseEmail, 'favorites');
    const statsKey = getAccountStorageKey(baseEmail, 'alias_stats');

    const [favResult, statsResult] = await Promise.all([
      browser.storage.local.get(favoritesKey),
      browser.storage.local.get(statsKey),
    ]);

    // Remove deleted emails from favorites
    const currentFavs = (favResult[favoritesKey] as any[]) || [];
    const updatedFavs = currentFavs.filter((f: any) => !selectedAliases.has(f.email));

    // Decrement stats: total and per-tag counts
    const stats = (statsResult[statsKey] as { total: number; tags: Record<string, number> }) || { total: 0, tags: {} };
    const tags = { ...stats.tags };
    selectedAliases.forEach(email => {
      const match = email.match(/\+([^@]+)@/);
      if (match && tags[match[1]]) {
        tags[match[1]] = Math.max(0, tags[match[1]] - 1);
        if (tags[match[1]] === 0) delete tags[match[1]];
      }
    });
    const updatedStats = { total: Math.max(0, stats.total - count), tags };

    await browser.storage.local.set({
      [historyKey]: updated,
      [favoritesKey]: updatedFavs,
      [statsKey]: updatedStats,
    });

    setFavorites(updatedFavs.map((f: any) => f.email));
    setSelectedAliases(new Set());
    setIsSelectMode(false);
    setToastMessage(`✓ Deleted ${count} aliases`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const toggleSelectAlias = (email: string) => {
    setSelectedAliases(prev => {
      const next = new Set(prev);
      next.has(email) ? next.delete(email) : next.add(email);
      return next;
    });
  };

  const clearHistory = async () => {
    setRecentAliases([]);
    setFavorites([]);
    const historyKey = getAccountStorageKey(baseEmail, 'gmail_alias_recent');
    const favoritesKey = getAccountStorageKey(baseEmail, 'favorites');
    const statsKey = getAccountStorageKey(baseEmail, 'alias_stats');
    await browser.storage.local.set({
      [historyKey]: [],
      [favoritesKey]: [],
      [statsKey]: { total: 0, tags: {} },
    });
    setToastMessage('✓ History cleared');
    setTimeout(() => setToastMessage(null), 2000);
  };

  const toggleFavorite = async (email: string) => {
    const favoritesKey = getAccountStorageKey(baseEmail, 'favorites');
    const result = await browser.storage.local.get(favoritesKey);
    const currentFavs = (result[favoritesKey] as any[]) || [];
    
    const exists = currentFavs.find((f: any) => f.email === email);
    
    let updated;
    if (exists) {
      // Remove from favorites
      updated = currentFavs.filter((f: any) => f.email !== email);
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

    const favEmails = updated.map((f: any) => f.email);
    setFavorites(favEmails);
    setToastMessage(exists ? '✓ Removed from favorites' : '✓ Added to favorites');
    setTimeout(() => setToastMessage(null), 2000);
  };


  const generateRandomAlias = () => {
    setGeneratedRandomList([]);

    const aliases: string[] = [];
    const timestamp = Date.now();

    for (let i = 0; i < randomEmailCount; i++) {
      const randomTag = generateRandomString(randomFormat, i + timestamp);
      const alias = generateAlias(baseEmail, randomTag);
      if (alias) aliases.push(alias);
    }

    setTimeout(() => {
      if (aliases.length > 0) {
        setGeneratedRandomList(aliases);
        copyToClipboard(aliases[0]);
      }
    }, 0);
  };


  const copyToClipboard = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      setToastMessage('✓ Copied to clipboard!');
      saveRecentAlias(email);
      setTimeout(() => {
        setCopiedEmail(null);
        setToastMessage(null);
      }, 2000);
    } catch (err) {
      setToastMessage('✗ Failed to copy');
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  const handlePresetClick = (tag: string) => {
    const alias = generateAlias(baseEmail, tag);
    if (alias) {
      copyToClipboard(alias);
    }
  };

  const handleCustomGenerate = () => {
    if (!customTag.trim()) return;
    const alias = generateAlias(baseEmail, customTag.trim());
    if (alias) {
      copyToClipboard(alias);
      setCustomTag('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomGenerate();
    }
  };

  const handleAddAccount = async () => {
    setAddAccountError('');
    
    if (!newAccountEmail.trim()) {
      setAddAccountError('Email is required');
      return;
    }
    
    if (!newAccountEmail.includes('@')) {
      setAddAccountError('Please enter a valid email address');
      return;
    }
    
    // Check if email already exists
    const emailExists = emailAccounts.some(acc => acc.email.toLowerCase() === newAccountEmail.trim().toLowerCase());
    if (emailExists) {
      setAddAccountError('This email address is already added!');
      return;
    }
    
    const newAccount = {
      id: Date.now().toString(),
      email: newAccountEmail.trim(),
      label: newAccountLabel.trim() || 'Account ' + (emailAccounts.length + 1),
      isActive: false, // Don't auto-switch to new account
    };
    
    const updatedAccounts = [...emailAccounts, newAccount];
    await browser.storage.local.set({ email_accounts: updatedAccounts });
    
    // Initialize empty storage for new account
    const historyKey = getAccountStorageKey(newAccount.email, 'gmail_alias_recent');
    const statsKey = getAccountStorageKey(newAccount.email, 'alias_stats');
    const favoritesKey = getAccountStorageKey(newAccount.email, 'favorites');
    
    await browser.storage.local.set({
      [historyKey]: [],
      [statsKey]: { total: 0, tags: {} },
      [favoritesKey]: [],
    });
    
    setNewAccountEmail('');
    setNewAccountLabel('');
    setAddAccountError('');
    setShowAddAccount(false);
    
    setToastMessage(`✓ ${newAccount.label} added!`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  // Compute outside IIFE so bulk-delete bar can reference it
  const filteredAliases = filterAliases(recentAliases, { viewMode, favorites, searchQuery, filterTag, sortBy });

  return (
    <div className="bg-gray-50 dark:bg-gray-900 h-screen flex flex-col relative overflow-hidden">
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
        <>
          {/* Header */}
          <div className="bg-blue-600 text-white px-5 py-3.5 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/icons/48.png" alt="" className="w-9 h-9 rounded-lg flex-shrink-0" />
                <div>
                  <h1 className="text-lg font-bold tracking-tight">Gmail Alias Toolkit</h1>
                  <p className="text-xs text-blue-100 mt-0.5">Generate aliases with plus addressing</p>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden">
        {/* Base Email Selector - Dropdown */}
        <div className="p-3.5">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Active Gmail Address
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 01-2.2 3.32v2.77h3.55c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.55-2.77c-.98.66-2.23 1.06-3.73 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0012 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 015.5 12c0-.73.13-1.43.34-2.09V7.07H2.18A11 11 0 001 12c0 1.77.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
                </svg>
              </div>
              <select
                value={baseEmail}
                onChange={async (e) => {
                  const selectedEmail = e.target.value;
                  setBaseEmail(selectedEmail);
                  setIsSelectMode(false);
                  setSelectedAliases(new Set());
                  setSearchQuery('');
                  setFilterTag('all');
                  setCurrentPage(1);

                  // Update active account and base_email
                  const updated = emailAccounts.map(acc => ({
                    ...acc,
                    isActive: acc.email === selectedEmail
                  }));

                  await browser.storage.local.set({
                    email_accounts: updated,
                    base_email: selectedEmail
                  });
                }}
                className="w-full pl-9 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white dark:bg-gray-700 dark:text-gray-100 truncate"
              >
                {emailAccounts.length > 0 ? (
                  emailAccounts.map((account) => (
                    <option key={account.id} value={account.email}>
                      {account.label ? `${account.label} - ` : ''}{account.email}
                    </option>
                  ))
                ) : (
                  <option value={baseEmail}>{baseEmail}</option>
                )}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => setShowAddAccount(!showAddAccount)}
              className="w-10 h-10 flex-shrink-0 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center justify-center"
              title="Add new account"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          {/* Quick Add Account Form */}
          {showAddAccount && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={newAccountEmail}
                  onChange={(e) => {
                    setNewAccountEmail(e.target.value);
                    setAddAccountError('');
                  }}
                  onBlur={() => {
                    if (newAccountEmail && !newAccountEmail.includes('@')) {
                      setNewAccountEmail(newAccountEmail + '@gmail.com');
                    }
                  }}
                  placeholder="your.email"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  autoFocus
                />
                {newAccountEmail && !newAccountEmail.includes('@') && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs pointer-events-none">
                    @gmail.com
                  </div>
                )}
              </div>
              {addAccountError && (
                <div className="px-3 py-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-full">
                  <p className="text-xs text-red-600 dark:text-red-400 text-center">{addAccountError}</p>
                </div>
              )}
              {newAccountEmail && !newAccountEmail.includes('@') && (
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                  💡 Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono">Tab</kbd> to add @gmail.com
                </p>
              )}
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={newAccountLabel}
                  onChange={(e) => setNewAccountLabel(e.target.value)}
                  placeholder="Label (optional, e.g., Work, Personal)"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddAccount}
                  disabled={!newAccountEmail.trim() || !newAccountEmail.includes('@')}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m3 9a9 9 0 100-18 9 9 0 000 18z" />
                  </svg>
                  Add Account
                </button>
                <button
                  onClick={() => {
                    setShowAddAccount(false);
                    setNewAccountEmail('');
                    setNewAccountLabel('');
                    setAddAccountError('');
                  }}
                  className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {baseEmail && !baseEmail.includes('@gmail.com') && baseEmail.includes('@') && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
              ⚠ This doesn't look like a Gmail address. Plus addressing works best with Gmail.
            </p>
          )}
        </div>

        {/* Unified Email Alias Generator */}
        <div>
          {/* Main Tabs */}
          <div className="flex gap-2 p-3.5 pb-0">
            <button
              onClick={() => setActiveGeneratorTab('random')}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                activeGeneratorTab === 'random'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h4l4 4m0 0l4-4h4m0 16h-4l-4-4m0 0l-4 4H4m0-8h4m8 0h4" />
              </svg>
              Random
            </button>
            <button
              onClick={() => setActiveGeneratorTab('tags')}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                activeGeneratorTab === 'tags'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Custom Tags
            </button>
            <button
              onClick={() => setActiveGeneratorTab('tricks')}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                activeGeneratorTab === 'tricks'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Gmail Tricks
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-3.5 dark:bg-gray-800">
            {/* Random Tab */}
            {activeGeneratorTab === 'random' && (
              <div>
                {/* Format Selector */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Format</label>
                  <select
                    value={randomFormat}
                    onChange={async (e) => {
                      const newFormat = e.target.value as any;
                      setRandomFormat(newFormat);
                      // Save to settings
                      const result = await browser.storage.local.get('app_settings');
                      const currentSettings = result.app_settings || {};
                      await browser.storage.local.set({
                        app_settings: { ...currentSettings, randomFormat: newFormat }
                      });
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="private-mail">📧 Private Mail (private-mail-xxxx)</option>
                    <option value="alphanumeric">🔤 Random Characters (abc123xy)</option>
                    <option value="words">📝 Random Words (happy-fox-42)</option>
                    <option value="timestamp">⏱️ Timestamp (1234567890)</option>
                  </select>
                </div>

                {/* Number of Emails */}
                <div className="mb-3 flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Number of aliases</label>
                  <input
                    type="number"
                    min="1"
                    value={randomEmailCount}
                    onChange={(e) => setRandomEmailCount(Math.max(1, parseInt(e.target.value) || 10))}
                    className="w-20 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateRandomAlias}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors mb-3"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Generate {randomEmailCount} Random Alias{randomEmailCount > 1 ? 'es' : ''}
                  </div>
                </button>

                {/* Generated Emails List */}
                {generatedRandomList.length > 0 && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-900 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Generated Aliases</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">{generatedRandomList.length} total</span>
                          <button
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(generatedRandomList.join('\n'));
                                saveRecentAliases(generatedRandomList);
                                setToastMessage(`✓ Copied ${generatedRandomList.length} aliases!`);
                              } catch {
                                setToastMessage('✗ Failed to copy');
                              }
                              setTimeout(() => setToastMessage(null), 2000);
                            }}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                            title="Copy all to clipboard"
                          >
                            Copy All
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {generatedRandomList.map((email, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex-1 font-mono text-xs text-gray-900 dark:text-gray-100 truncate">
                            {email}
                          </div>
                          <button
                            onClick={() => copyToClipboard(email)}
                            className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors flex-shrink-0"
                            title="Copy"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                  {randomFormat === 'private-mail' ? 'Format: private-mail-xxxx' : randomFormat === 'alphanumeric' ? '8 random characters' : randomFormat === 'words' ? '2 random words' : 'Unix timestamp'}
                </div>
              </div>
            )}

            {/* Custom Tags Tab */}
            {activeGeneratorTab === 'tags' && (
              <div>
                <div className="flex gap-2 mb-3">
                  <div className="relative flex-1">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Enter tag (e.g., shopping, work)"
                    />
                  </div>
                  <button
                    onClick={handleCustomGenerate}
                    disabled={!customTag.trim()}
                    className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Generate
                  </button>
                </div>

                {/* Custom Presets - Quick Access */}
                {customPresets.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Your Presets</div>
                    <div className="flex flex-wrap gap-2">
                      {customPresets.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => handlePresetClick(preset.tag)}
                          className="px-3 py-1.5 bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    Example: {baseEmail.split('@')[0]}+<strong className="text-gray-700 dark:text-gray-300">your-tag</strong>@{baseEmail.split('@')[1]}
                  </span>
                  <button
                    onClick={() => copyToClipboard(`${baseEmail.split('@')[0]}+your-tag@${baseEmail.split('@')[1]}`)}
                    className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 flex-shrink-0"
                    title="Copy example"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Gmail Tricks Tab */}
            {activeGeneratorTab === 'tricks' && (
              <div>
                <GmailTricks baseEmail={baseEmail} onCopy={copyToClipboard} />
              </div>
            )}
          </div>
        </div>

        {/* Recent Aliases */}
        {(recentAliases.length > 0 || favorites.length > 0) && (
          <div className="p-3.5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {viewMode === 'all' ? 'Recent Aliases' : 'Favorites'}
              </h2>
              <div className="flex items-center gap-1.5">
                {viewMode === 'all' && recentAliases.length > 0 && (
                  <>
                    <button
                      onClick={() => exportAliases('csv')}
                      className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 px-1.5 py-0.5 rounded hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                      title="Export as CSV"
                    >CSV</button>
                    <button
                      onClick={() => exportAliases('json')}
                      className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 px-1.5 py-0.5 rounded hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                      title="Export as JSON"
                    >JSON</button>
                    <button
                      onClick={() => {
                        setIsSelectMode(m => !m);
                        setSelectedAliases(new Set());
                      }}
                      className={`text-xs px-1.5 py-0.5 rounded transition-colors ${isSelectMode ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40'}`}
                      title="Select aliases"
                    >Select</button>
                  </>
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {viewMode === 'all' ? `${recentAliases.length} total` : `${favorites.length} starred`}
                </span>
              </div>
            </div>
            {/* Bulk delete bar */}
            {isSelectMode && (
              <div className="mb-3 flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/40 rounded-lg">
                <button
                  onClick={() => {
                    if (selectedAliases.size === filteredAliases.length) {
                      setSelectedAliases(new Set());
                    } else {
                      setSelectedAliases(new Set(filteredAliases.map(a => a.email)));
                    }
                  }}
                  className="text-xs text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-medium"
                >
                  {selectedAliases.size === filteredAliases.length ? 'Deselect All' : 'Select All'}
                </button>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex-1">{selectedAliases.size} selected</span>
                <button
                  onClick={deleteSelected}
                  disabled={selectedAliases.size === 0}
                  className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Delete {selectedAliases.size > 0 ? selectedAliases.size : ''}
                </button>
              </div>
            )}

            {/* View Mode Tabs */}
            <div className="mb-3 flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <button
                onClick={() => setViewMode('all')}
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  viewMode === 'all'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  All ({recentAliases.length})
                </div>
              </button>
              <button
                onClick={() => setViewMode('favorites')}
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  viewMode === 'favorites'
                    ? 'bg-white dark:bg-gray-800 text-yellow-600 dark:text-yellow-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill={viewMode === 'favorites' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Favorites ({favorites.length})
                </div>
              </button>
            </div>

            {/* Search and Filters */}
            <div className="mb-3 space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 Search aliases..."
                  className="w-full pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Tags</option>
                  {Array.from(new Set(recentAliases.map(a => {
                    const match = a.email.match(/\+([^@]+)@/);
                    return match ? match[1] : null;
                  }).filter((t): t is string => t !== null))).map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'recent' | 'alphabetical')}
                  className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="recent">📅 Most Recent</option>
                  <option value="alphabetical">🔤 A-Z</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              {(() => {
                // Calculate pagination
                const totalItems = filteredAliases.length;
                const totalPages = Math.ceil(totalItems / itemsPerPage);
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const paginatedAliases = filteredAliases.slice(startIndex, endIndex);

                if (filteredAliases.length === 0 && viewMode === 'favorites') {
                  return (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <p className="text-sm font-medium mb-1">No favorites yet</p>
                    <p className="text-xs">Star emails from your history to quick access them here</p>
                  </div>
                );
                }

                if (filteredAliases.length === 0 && (searchQuery || filterTag !== 'all')) {
                  return (
                    <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                      <svg className="w-10 h-10 mx-auto mb-2 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <p className="text-sm font-medium mb-1">No results found</p>
                      <p className="text-xs">Try a different search or filter</p>
                    </div>
                  );
                }

                // Render paginated list
                return (
                  <>
                    {paginatedAliases.map((alias) => (
                  <div
                    key={alias.email}
                    className="flex items-center justify-between gap-0.5 px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md group transition-colors"
                  >
                    {isSelectMode && (
                      <input
                        type="checkbox"
                        checked={selectedAliases.has(alias.email)}
                        onChange={() => toggleSelectAlias(alias.email)}
                        className="mr-1.5 w-4 h-4 accent-blue-600 flex-shrink-0"
                      />
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-200 font-mono break-all flex-1">
                      {alias.email}
                    </span>
                    {/* QR code button */}
                    <button
                      onClick={() => setQrAlias(alias.email)}
                      className="p-1.5 text-gray-300 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400 focus:outline-none transition-colors"
                      title="Show QR code"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 3.5c0 1.933-1.567 3.5-3.5 3.5S13 17.433 13 15.5 14.567 12 16.5 12s3.5 1.567 3.5 3.5zM4 4h4v4H4V4zm12 0h4v4h-4V4zM4 16h4v4H4v-4z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => toggleFavorite(alias.email)}
                      className={`p-1.5 focus:outline-none transition-colors ${
                        favorites.includes(alias.email)
                          ? 'text-yellow-500 hover:text-yellow-600'
                          : 'text-gray-300 hover:text-yellow-500'
                      }`}
                      title={favorites.includes(alias.email) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <svg
                        className="w-4 h-4"
                        fill={favorites.includes(alias.email) ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => copyToClipboard(alias.email)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 focus:outline-none focus:text-blue-600 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedEmail === alias.email ? (
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
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
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                ))}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col gap-3">
                          {/* Page info and items per page selector */}
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
                            </div>
                            <select
                              value={itemsPerPage}
                              onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                              }}
                              className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                              <option value={5}>5 / page</option>
                              <option value={10}>10 / page</option>
                              <option value={20}>20 / page</option>
                              <option value={50}>50 / page</option>
                            </select>
                          </div>
                          
                          {/* Page navigation */}
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setCurrentPage(1)}
                              disabled={currentPage === 1}
                              className="px-2 py-1 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300"
                              title="First page"
                            >
                              ⟪
                            </button>
                            <button
                              onClick={() => setCurrentPage(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="px-2 py-1 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300"
                              title="Previous page"
                            >
                              ←
                            </button>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(page => {
                                  // Show first, last, current, and pages around current
                                  if (page === 1 || page === totalPages) return true;
                                  if (Math.abs(page - currentPage) <= 1) return true;
                                  return false;
                                })
                                .map((page, index, array) => {
                                  // Add ellipsis
                                  const prevPage = array[index - 1];
                                  const showEllipsis = prevPage && page - prevPage > 1;

                                  return (
                                    <div key={page} className="flex items-center gap-1">
                                      {showEllipsis && <span className="px-1 text-gray-400 dark:text-gray-500">...</span>}
                                      <button
                                        onClick={() => setCurrentPage(page)}
                                        className={`min-w-[28px] px-2 py-1 text-xs rounded transition-colors ${
                                          currentPage === page
                                            ? 'bg-blue-600 text-white font-medium'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                        }`}
                                      >
                                        {page}
                                      </button>
                                    </div>
                                  );
                                })}
                            </div>
                            <button
                              onClick={() => setCurrentPage(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className="px-2 py-1 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300"
                              title="Next page"
                            >
                              →
                            </button>
                            <button
                              onClick={() => setCurrentPage(totalPages)}
                              disabled={currentPage === totalPages}
                              className="px-2 py-1 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300"
                              title="Last page"
                            >
                              ⟫
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* Statistics - Collapsible */}
        <Statistics />
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-fade-in z-40">
            {toastMessage}
          </div>
        )}
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
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 flex flex-col items-center gap-4"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Scan to copy alias</h3>
            <canvas ref={qrCanvasRef} className="rounded-lg" />
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono text-center max-w-[200px] break-all">{qrAlias}</p>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(qrAlias)}
                className="px-4 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
              >Copy</button>
              <button
                onClick={() => setQrAlias(null)}
                className="px-4 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >Close</button>
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
