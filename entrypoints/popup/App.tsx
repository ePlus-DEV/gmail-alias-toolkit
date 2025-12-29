import { useState, useEffect } from 'react';
import './App.css';

interface Alias {
  email: string;
  timestamp: number;
}

interface Preset {
  id: string;
  label: string;
  tag: string;
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
const MAX_RECENT = 5;

function App() {
  const [baseEmail, setBaseEmail] = useState('your.email@gmail.com');
  const [customTag, setCustomTag] = useState('');
  const [recentAliases, setRecentAliases] = useState<Alias[]>([]);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Load recent aliases and base email from storage
  useEffect(() => {
    browser.storage.local.get([STORAGE_KEY, 'base_email']).then((result) => {
      if (result[STORAGE_KEY]) {
        setRecentAliases(result[STORAGE_KEY]);
      }
      if (result.base_email) {
        setBaseEmail(result.base_email);
      }
    });
  }, []);

  const saveRecentAlias = (email: string) => {
    const newAlias: Alias = {
      email,
      timestamp: Date.now(),
    };

    const updated = [newAlias, ...recentAliases.filter((a) => a.email !== email)].slice(
      0,
      MAX_RECENT
    );

    setRecentAliases(updated);
    browser.storage.local.set({ [STORAGE_KEY]: updated });
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
        <h1 className="text-lg font-bold">Gmail Alias Toolkit</h1>
        <p className="text-xs text-blue-100 mt-0.5">Generate aliases with plus addressing</p>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Base Email Input */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Base Gmail Address
          </label>
          <input
            type="email"
            value={baseEmail}
            onChange={(e) => {
              setBaseEmail(e.target.value);
              saveBaseEmail(e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your.email@gmail.com"
          />
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
                onKeyPress={handleKeyPress}
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
        </div>

        {/* Recent Aliases */}
        {recentAliases.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              Recent Aliases
            </h2>
            <div className="space-y-2">
              {recentAliases.map((alias) => (
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
    </div>
  );
}

export default App;
