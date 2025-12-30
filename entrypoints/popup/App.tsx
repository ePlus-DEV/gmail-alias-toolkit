import { useState, useEffect } from 'react';
import './App.css';
import Settings from './components/Settings';
import Statistics from './components/Statistics';
import Favorites from './components/Favorites';
import GmailTricks from './components/GmailTricks';
import WelcomeScreen from './components/WelcomeScreen';

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

const PRESETS: Preset[] = [
  { id: 'shopping', label: 'Shopping', tag: 'shopping' },
  { id: 'work', label: 'Work', tag: 'work' },
  { id: 'test', label: 'Test', tag: 'test' },
  { id: 'social', label: 'Social', tag: 'social' },
  { id: 'finance', label: 'Finance', tag: 'finance' },
  { id: 'travel', label: 'Travel', tag: 'travel' },
];

const STORAGE_KEY = 'gmail_alias_recent';

function App() {
  const [baseEmail, setBaseEmail] = useState('your.email@gmail.com');
  const [customTag, setCustomTag] = useState('');
  const [recentAliases, setRecentAliases] = useState<Alias[]>([]);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [maxRecent, setMaxRecent] = useState(5);
  const [customPresets, setCustomPresets] = useState<Preset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'alphabetical'>('recent');
  const [randomFormat, setRandomFormat] = useState<'private-mail' | 'alphanumeric' | 'words' | 'timestamp'>('private-mail');
  const [lastGeneratedRandom, setLastGeneratedRandom] = useState<string>('');
  const [generatedRandomList, setGeneratedRandomList] = useState<string[]>([]);
  const [randomEmailCount, setRandomEmailCount] = useState(10);
  const [showRandomSettings, setShowRandomSettings] = useState(false);
  const [showQuickPresets, setShowQuickPresets] = useState(false);
  const [activeGeneratorTab, setActiveGeneratorTab] = useState<'random' | 'tags' | 'tricks'>('random');
  const [emailAccounts, setEmailAccounts] = useState<any[]>([]);
  const [hasEmailAccounts, setHasEmailAccounts] = useState(true);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccountEmail, setNewAccountEmail] = useState('');
  const [newAccountLabel, setNewAccountLabel] = useState('');

  // Load recent aliases, base email, and settings from storage
  useEffect(() => {
    browser.storage.local.get([STORAGE_KEY, 'base_email', 'app_settings', 'email_accounts']).then((result: StorageResult) => {
      if (result.gmail_alias_recent) {
        setRecentAliases(result.gmail_alias_recent);
      }
      
      // Load active email from email_accounts or fall back to base_email
      if (result.email_accounts && Array.isArray(result.email_accounts)) {
        const activeAccount = result.email_accounts.find((acc: any) => acc.isActive);
        if (activeAccount) {
          setBaseEmail(activeAccount.email);
        }
      } else if (result.base_email) {
        setBaseEmail(result.base_email);
      }
      
      if (result.app_settings) {
        setMaxRecent(result.app_settings.maxHistory || 5);
        setCustomPresets(result.app_settings.customPresets || []);
        setRandomFormat(result.app_settings.randomFormat || 'private-mail');
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
    const handleStorageChange = (changes: any) => {
      if (changes.app_settings) {
        const newSettings = changes.app_settings.newValue;
        if (newSettings) {
          setMaxRecent(newSettings.maxHistory || 5);
          setCustomPresets(newSettings.customPresets || []);
          setRandomFormat(newSettings.randomFormat || 'private-mail');
        }
      }
      if (changes.email_accounts) {
        const newAccounts = changes.email_accounts.newValue;
        if (newAccounts) {
          setEmailAccounts(newAccounts);
          setHasEmailAccounts(newAccounts.length > 0);
          // Update base email if active account changed
          const activeAccount = newAccounts.find((acc: any) => acc.isActive);
          if (activeAccount) {
            setBaseEmail(activeAccount.email);
          }
        }
      }
    };

    browser.storage.onChanged.addListener(handleStorageChange);
    return () => browser.storage.onChanged.removeListener(handleStorageChange);
  }, []);

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

  const saveRecentAlias = (email: string) => {
    const newAlias: Alias = {
      email,
      timestamp: Date.now(),
    };

    const updated = [newAlias, ...recentAliases.filter((a) => a.email !== email)].slice(
      0,
      maxRecent
    );

    setRecentAliases(updated);
    browser.storage.local.set({ [STORAGE_KEY]: updated });

    // Update statistics
    updateStats(email);
  };

  const updateStats = async (email: string) => {
    // Extract tag from email
    const matchResult = /\+([^@]+)@/.exec(email);
    const tag = matchResult ? matchResult[1] : 'unknown';

    const result: StorageResult = await browser.storage.local.get('alias_stats');
    const stats = result.alias_stats || { total: 0, tags: {} };

    stats.total = (stats.total || 0) + 1;
    stats.tags = stats.tags || {};
    stats.tags[tag] = (stats.tags[tag] || 0) + 1;

    await browser.storage.local.set({ alias_stats: stats });
  };

  const clearHistory = () => {
    setRecentAliases([]);
    browser.storage.local.set({ [STORAGE_KEY]: [] });
  };

  const generateRandomString = (format: 'private-mail' | 'alphanumeric' | 'words' | 'timestamp', index: number = 0): string => {
    if (format === 'private-mail') {
      // Generate format like: private-mail-q2ga
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      const length = 4;
      let randomStr = '';
      for (let i = 0; i < length; i++) {
        randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return `private-mail-${randomStr}`;
    }
    
    if (format === 'timestamp') {
      // Add index to ensure uniqueness when generating multiple
      return (Date.now() + index).toString(36);
    }
    
    if (format === 'words') {
      const adjectives = ['happy', 'sunny', 'calm', 'bright', 'swift', 'brave', 'cool', 'smart', 'quick', 'zen', 'wild', 'free', 'bold', 'wise', 'pure', 'kind', 'fair', 'true', 'rare', 'fine'];
      const nouns = ['fox', 'bird', 'bear', 'wolf', 'deer', 'lion', 'hawk', 'eagle', 'tiger', 'panda', 'seal', 'otter', 'raven', 'crane', 'swan', 'lynx', 'coral', 'pearl', 'jade', 'ruby'];
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      const num = Math.floor(Math.random() * 999);
      return `${adj}-${noun}-${num}`;
    }
    
    // alphanumeric
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const length = 8;
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateRandomAlias = () => {
    // Clear previous results first
    setGeneratedRandomList([]);
    setLastGeneratedRandom('');
    
    const aliases: string[] = [];
    const timestamp = Date.now();
    
    for (let i = 0; i < randomEmailCount; i++) {
      const randomTag = generateRandomString(randomFormat, i + timestamp);
      const alias = generateAlias(randomTag);
      if (alias) {
        aliases.push(alias);
      }
    }
    
    // Use setTimeout to ensure state update triggers re-render
    setTimeout(() => {
      if (aliases.length > 0) {
        setLastGeneratedRandom(aliases[0]);
        setGeneratedRandomList(aliases);
        // Copy first one to clipboard
        copyToClipboard(aliases[0]);
      }
    }, 0);
  };

  const saveBaseEmail = (email: string) => {
    browser.storage.local.set({ base_email: email });
    
    // Also update in email_accounts if exists
    browser.storage.local.get('email_accounts').then((result) => {
      if (result.email_accounts && Array.isArray(result.email_accounts)) {
        const updated = result.email_accounts.map((acc: any) => 
          acc.isActive ? { ...acc, email } : acc
        );
        browser.storage.local.set({ email_accounts: updated });
      }
    });
  };

  const generateAlias = (tag: string) => {
    const [username, domain] = baseEmail.split('@');
    if (!username || !domain) return null;
    return `${username}+${tag}@${domain}`;
  };

  const copyToClipboard = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      saveRecentAlias(email);
      setTimeout(() => setCopiedEmail(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handlePresetClick = (tag: string) => {
    const alias = generateAlias(tag);
    if (alias) {
      copyToClipboard(alias);
    }
  };

  const handleCustomGenerate = () => {
    if (!customTag.trim()) return;
    const alias = generateAlias(customTag.trim());
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
    if (!newAccountEmail.trim() || !newAccountEmail.includes('@')) return;
    
    const newAccount = {
      id: Date.now().toString(),
      email: newAccountEmail.trim(),
      label: newAccountLabel.trim() || 'Account ' + (emailAccounts.length + 1),
      isActive: false,
    };
    
    const updatedAccounts = [...emailAccounts, newAccount];
    await browser.storage.local.set({ email_accounts: updatedAccounts });
    
    setNewAccountEmail('');
    setNewAccountLabel('');
    setShowAddAccount(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Show Welcome Screen for first-time users */}
      {!hasEmailAccounts ? (
        <WelcomeScreen 
          onEmailAdded={(email) => {
            setBaseEmail(email);
            setHasEmailAccounts(true);
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      ) : (
        <>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold">Gmail Alias Toolkit</h1>
                <p className="text-xs text-blue-100 mt-0.5">Generate aliases with plus addressing</p>
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
      <div className="p-4 space-y-4">
        {/* Base Email Selector - Dropdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Active Gmail Address
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <select
                value={baseEmail}
                onChange={(e) => {
                  const selectedEmail = e.target.value;
                  setBaseEmail(selectedEmail);
                  saveBaseEmail(selectedEmail);
                  
                  // Update active account
                  if (emailAccounts.length > 0) {
                    const updated = emailAccounts.map(acc => ({
                      ...acc,
                      isActive: acc.email === selectedEmail
                    }));
                    browser.storage.local.set({ email_accounts: updated });
                  }
                }}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                {emailAccounts.length > 0 ? (
                  emailAccounts.map((account) => (
                    <option key={account.id} value={account.email}>
                      {account.label} - {account.email}
                    </option>
                  ))
                ) : (
                  <option value={baseEmail}>{baseEmail}</option>
                )}
              </select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => setShowAddAccount(!showAddAccount)}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center justify-center"
              title="Add new account"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          {/* Quick Add Account Form */}
          {showAddAccount && (
            <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={newAccountEmail}
                  onChange={(e) => setNewAccountEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Tab' && newAccountEmail && !newAccountEmail.includes('@')) {
                      e.preventDefault();
                      setNewAccountEmail(newAccountEmail + '@gmail.com');
                    }
                  }}
                  placeholder="your.email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                {newAccountEmail && !newAccountEmail.includes('@') && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">
                    @gmail.com
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 -mt-1">
                💡 Press <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Tab</kbd> to add @gmail.com
              </p>
              <input
                type="text"
                value={newAccountLabel}
                onChange={(e) => setNewAccountLabel(e.target.value)}
                placeholder="Label (optional, e.g., Work, Personal)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddAccount}
                  disabled={!newAccountEmail.trim() || !newAccountEmail.includes('@')}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Account
                </button>
                <button
                  onClick={() => {
                    setShowAddAccount(false);
                    setNewAccountEmail('');
                    setNewAccountLabel('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          {baseEmail && !baseEmail.includes('@gmail.com') && baseEmail.includes('@') && (
            <p className="text-xs text-amber-600 mt-2">
              ⚠ This doesn't look like a Gmail address. Plus addressing works best with Gmail.
            </p>
          )}
        </div>

        {/* Unified Email Alias Generator - RoboForm Style */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3">
            <div className="flex items-center gap-2 text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h2 className="text-sm font-bold">Email Alias Generator</h2>
            </div>
          </div>

          {/* Main Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setActiveGeneratorTab('random')}
              className={`flex-1 px-4 py-3 text-xs font-semibold transition-colors ${
                activeGeneratorTab === 'random'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Random
              </div>
            </button>
            <button
              onClick={() => setActiveGeneratorTab('tags')}
              className={`flex-1 px-4 py-3 text-xs font-semibold transition-colors ${
                activeGeneratorTab === 'tags'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Custom Tags
              </div>
            </button>
            <button
              onClick={() => setActiveGeneratorTab('tricks')}
              className={`flex-1 px-4 py-3 text-xs font-semibold transition-colors ${
                activeGeneratorTab === 'tricks'
                  ? 'text-green-600 border-b-2 border-green-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Gmail Tricks
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {/* Random Tab */}
            {activeGeneratorTab === 'random' && (
              <div>
                {/* Format Tabs */}
                <div className="flex gap-1 mb-3">
                  <button
                    onClick={() => setRandomFormat('private-mail')}
                    className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                      randomFormat === 'private-mail'
                        ? 'bg-purple-100 text-purple-700 font-semibold'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Private Mail
                  </button>
                  <button
                    onClick={() => setRandomFormat('alphanumeric')}
                    className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                      randomFormat === 'alphanumeric'
                        ? 'bg-purple-100 text-purple-700 font-semibold'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Chars
                  </button>
                  <button
                    onClick={() => setRandomFormat('words')}
                    className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                      randomFormat === 'words'
                        ? 'bg-purple-100 text-purple-700 font-semibold'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Words
                  </button>
                  <button
                    onClick={() => setRandomFormat('timestamp')}
                    className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                      randomFormat === 'timestamp'
                        ? 'bg-purple-100 text-purple-700 font-semibold'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Time
                  </button>
                </div>

                {/* Number of Emails */}
                <div className="mb-3 flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">Number of aliases</label>
                  <input
                    type="number"
                    min="1"
                    value={randomEmailCount}
                    onChange={(e) => setRandomEmailCount(Math.max(1, parseInt(e.target.value) || 10))}
                    className="w-20 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateRandomAlias}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-md mb-3"
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
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-700">Generated Aliases</span>
                        <span className="text-xs text-gray-500">{generatedRandomList.length} total</span>
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {generatedRandomList.map((email, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 last:border-b-0 hover:bg-purple-50 transition-colors"
                        >
                          <div className="flex-1 font-mono text-xs text-gray-900 truncate">
                            {email}
                          </div>
                          <button
                            onClick={() => copyToClipboard(email)}
                            className="p-1.5 text-purple-600 hover:bg-purple-100 rounded transition-colors flex-shrink-0"
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

                <div className="mt-2 text-xs text-gray-500 text-center">
                  {randomFormat === 'private-mail' ? 'Format: private-mail-xxxx' : randomFormat === 'alphanumeric' ? '8 random characters' : randomFormat === 'words' ? '2 random words' : 'Unix timestamp'}
                </div>
              </div>
            )}

            {/* Custom Tags Tab */}
            {activeGeneratorTab === 'tags' && (
              <div>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter tag (e.g., shopping, work)"
                  />
                  <button
                    onClick={handleCustomGenerate}
                    disabled={!customTag.trim()}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                  >
                    Generate
                  </button>
                </div>

                {/* Quick Presets */}
                <button
                  onClick={() => setShowQuickPresets(!showQuickPresets)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span>Quick Presets</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${showQuickPresets ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showQuickPresets && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => {
                            handlePresetClick(preset.tag);
                            setShowQuickPresets(false);
                          }}
                          className="px-3 py-1.5 bg-white text-blue-700 text-xs font-medium rounded-md border border-blue-200 hover:bg-blue-50 transition-colors"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                    {customPresets.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-300">
                        <div className="flex flex-wrap gap-2">
                          {customPresets.map((preset) => (
                            <button
                              key={preset.id}
                              onClick={() => {
                                handlePresetClick(preset.tag);
                                setShowQuickPresets(false);
                              }}
                              className="px-3 py-1.5 bg-white text-purple-700 text-xs font-medium rounded-md border border-purple-200 hover:bg-purple-50 transition-colors"
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-3 text-xs text-gray-500">
                  Example: {baseEmail.split('@')[0]}+<strong>your-tag</strong>@{baseEmail.split('@')[1]}
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

        {/* Favorites - Quick Access */}
        <Favorites baseEmail={baseEmail} onCopy={copyToClipboard} />

        {/* Recent Aliases */}
        {recentAliases.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">
                Recent Aliases
              </h2>
              <span className="text-xs text-gray-500">
                {recentAliases.length} total
              </span>
            </div>

            {/* Search and Filters */}
            <div className="mb-3 space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 Search aliases..."
                  className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                  className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Tags</option>
                  {Array.from(new Set(recentAliases.map(a => {
                    const match = a.email.match(/\+([^@]+)@/);
                    return match ? match[1] : null;
                  }).filter(Boolean))).map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'recent' | 'alphabetical')}
                  className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="recent">📅 Most Recent</option>
                  <option value="alphabetical">🔤 A-Z</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              {recentAliases
                .filter((alias) => {
                  // Filter by search query
                  if (searchQuery && !alias.email.toLowerCase().includes(searchQuery.toLowerCase())) {
                    return false;
                  }
                  
                  // Filter by tag
                  if (filterTag !== 'all') {
                    const tagMatch = alias.email.match(/\+([^@]+)@/);
                    const emailTag = tagMatch ? tagMatch[1] : null;
                    if (emailTag !== filterTag) {
                      return false;
                    }
                  }
                  
                  return true;
                })
                .sort((a, b) => {
                  if (sortBy === 'recent') {
                    return b.timestamp - a.timestamp;
                  } else {
                    return a.email.localeCompare(b.email);
                  }
                })
                .slice(0, 50)
                .map((alias) => (
                  <div
                    key={alias.email}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md group transition-colors"
                  >
                    <span className="text-sm text-gray-700 font-mono truncate flex-1">
                      {alias.email}
                    </span>
                    <button
                      onClick={() => copyToClipboard(alias.email)}
                      className="ml-2 p-1.5 text-gray-400 hover:text-blue-600 focus:outline-none focus:text-blue-600 transition-colors"
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
            </div>
          </div>
        )}

        {/* Statistics - Collapsible */}
        <Statistics />

        {/* Success Message */}
        {copiedEmail && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-fade-in">
            ✓ Copied to clipboard!
          </div>
        )}
      </div>
      </>
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
