import { useState, useEffect } from 'react';
import './App.css';
import Settings from './components/Settings';
import Statistics from './components/Statistics';
import Favorites from './components/Favorites';

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
  const [randomFormat, setRandomFormat] = useState<'private-mail' | 'alphanumeric' | 'words' | 'timestamp'>('private-mail');

  // Load recent aliases, base email, and settings from storage
  useEffect(() => {
    browser.storage.local.get([STORAGE_KEY, 'base_email', 'app_settings']).then((result: StorageResult) => {
      if (result.gmail_alias_recent) {
        setRecentAliases(result.gmail_alias_recent);
      }
      if (result.base_email) {
        setBaseEmail(result.base_email);
      }
      if (result.app_settings) {
        setMaxRecent(result.app_settings.maxHistory || 5);
        setCustomPresets(result.app_settings.customPresets || []);
        setRandomFormat(result.app_settings.randomFormat || 'private-mail');
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

  const generateRandomString = (format: 'private-mail' | 'alphanumeric' | 'words' | 'timestamp'): string => {
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
      return Date.now().toString(36);
    }
    
    if (format === 'words') {
      const adjectives = ['happy', 'sunny', 'calm', 'bright', 'swift', 'brave', 'cool', 'smart', 'quick', 'zen'];
      const nouns = ['fox', 'bird', 'bear', 'wolf', 'deer', 'lion', 'hawk', 'eagle', 'tiger', 'panda'];
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
    const randomTag = generateRandomString(randomFormat);
    const alias = generateAlias(randomTag);
    if (alias) {
      copyToClipboard(alias);
    }
  };

  const saveBaseEmail = (email: string) => {
    browser.storage.local.set({ base_email: email });
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

  return (
    <div className="bg-gray-50 min-h-screen">
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
        {/* Statistics */}
        <Statistics />

        {/* Favorites */}
        <Favorites baseEmail={baseEmail} onCopy={copyToClipboard} />

        {/* Random Alias Generator - Main Feature */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="text-base font-bold">Private Email Generator</h2>
          </div>
          <p className="text-xs text-purple-100 mb-4">Generate random alias like Apple's Hide My Email</p>
          
          <button
            onClick={generateRandomAlias}
            className="w-full bg-white text-purple-600 px-6 py-3 rounded-lg font-bold text-sm hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Generate Random Alias
            </div>
          </button>
          
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-purple-100">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Format: {randomFormat === 'private-mail' ? 'private-mail-xxxx' : randomFormat === 'alphanumeric' ? 'Random chars' : randomFormat === 'words' ? 'Random words' : 'Timestamp'}</span>
          </div>
        </div>

        {/* Base Email Input */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Base Gmail Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={baseEmail}
              onChange={(e) => {
                setBaseEmail(e.target.value);
                saveBaseEmail(e.target.value);
              }}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your.email@gmail.com"
            />
            {baseEmail && baseEmail.includes('@') && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
          {baseEmail && !baseEmail.includes('@gmail.com') && baseEmail.includes('@') && (
            <p className="text-xs text-amber-600 mt-1">
              ⚠ This doesn't look like a Gmail address. Plus addressing works best with Gmail.
            </p>
          )}
        </div>

        {/* Generate Alias Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Generate Alias</h2>

          {/* Custom Tag Input */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Custom Tag
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter custom tag"
              />
              <button
                onClick={handleCustomGenerate}
                disabled={!customTag.trim()}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Generate
              </button>
            </div>
          </div>

          {/* Presets */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Quick Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetClick(preset.tag)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full hover:bg-blue-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Presets */}
          {customPresets.length > 0 && (
            <div className="pt-3 border-t border-gray-200">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Custom Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {customPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetClick(preset.tag)}
                    className="px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full hover:bg-purple-200 hover:text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Aliases */}
        {recentAliases.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">
                Recent Aliases
              </h2>
              {recentAliases.length > 3 && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  {searchQuery ? 'Clear' : `${recentAliases.length} total`}
                </button>
              )}
            </div>

            {recentAliases.length > 3 && (
              <div className="mb-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search aliases..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="space-y-2">
              {recentAliases
                .filter((alias) =>
                  searchQuery
                    ? alias.email.toLowerCase().includes(searchQuery.toLowerCase())
                    : true
                )
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

        {/* Success Message */}
        {copiedEmail && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-fade-in">
            ✓ Copied to clipboard!
          </div>
        )}
      </div>

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
