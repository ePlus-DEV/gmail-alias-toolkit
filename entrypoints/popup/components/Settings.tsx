import { useState, useEffect, useCallback } from 'react';
import Toggle from './Toggle';
import Button from './Button';
import Input from './Input';
import { getAccountStorageKey } from '../utils';

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
  theme: 'light' | 'dark' | 'auto';
  showNotifications: boolean;
  badgeDisplay: 'none' | 'total' | 'today' | 'week' | 'all-time';
  randomFormat: 'private-mail' | 'alphanumeric' | 'words' | 'timestamp';
}

const DEFAULT_SETTINGS: AppSettings = {
  customPresets: [],
  maxHistory: 20,
  theme: 'light',
  showNotifications: true,
  badgeDisplay: 'all-time',
  randomFormat: 'private-mail',
};

export default function Settings({ isOpen, onClose, onClearHistory }: SettingsProps) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [newPresetLabel, setNewPresetLabel] = useState('');
  const [newPresetTag, setNewPresetTag] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'accounts' | 'presets' | 'advanced'>('general');
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState('');
  const [editingEmail, setEditingEmail] = useState('');
  const [version, setVersion] = useState('1.1.0');
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccountEmail, setNewAccountEmail] = useState('');
  const [newAccountLabel, setNewAccountLabel] = useState('');
  const [addAccountError, setAddAccountError] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  useEffect(() => {
    try {
      const manifest = browser.runtime.getManifest();
      if (manifest && manifest.version) {
        setVersion(manifest.version);
      }
    } catch (error) {
      console.log('Could not get manifest version:', error);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
      loadAccounts();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    const result = await browser.storage.local.get('app_settings');
    if (result.app_settings) {
      setSettings({ ...DEFAULT_SETTINGS, ...result.app_settings });
    }
  };

  const loadAccounts = async () => {
    const result = await browser.storage.local.get('email_accounts');
    if (result.email_accounts && Array.isArray(result.email_accounts)) {
      setEmailAccounts(result.email_accounts);
    }
  };

  const saveSettings = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    await browser.storage.local.set({ app_settings: newSettings });
  };

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
    setNewPresetLabel('');
    setNewPresetTag('');
    showToast('✓ Preset added');
  };

  const handleRemovePreset = (id: string) => {
    const updatedSettings = {
      ...settings,
      customPresets: settings.customPresets.filter((p) => p.id !== id),
    };
    saveSettings(updatedSettings);
    showToast('✓ Preset removed');
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gmail-alias-settings-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('✓ Settings exported');
  };

  const handleImportSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const imported = JSON.parse(text);
        saveSettings({ ...DEFAULT_SETTINGS, ...imported });
        showToast('✓ Settings imported');
      } catch (err) {
        showToast('✗ Import failed – invalid file');
      }
    };
    input.click();
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      saveSettings(DEFAULT_SETTINGS);
      showToast('✓ Settings reset to default');
    }
  };

  const handleSwitchAccount = async (accountId: string) => {
    const updated = emailAccounts.map(acc => ({
      ...acc,
      isActive: acc.id === accountId,
    }));
    await browser.storage.local.set({ email_accounts: updated });
    const activeAccount = updated.find(acc => acc.id === accountId);
    if (activeAccount) {
      await browser.storage.local.set({ base_email: activeAccount.email });
    }
    setEmailAccounts(updated);
    showToast('✓ Account switched');
  };

  const handleDeleteAccount = async (account: EmailAccount) => {
    if (emailAccounts.length === 1) {
      alert('Cannot delete the last account. You must have at least one account.');
      return;
    }

    const confirmMsg = `Delete "${account.label}" (${account.email})?\n\nThis will permanently delete:\n• All history for this account\n• All statistics\n• All favorites\n\nThis action cannot be undone.`;
    
    if (!confirm(confirmMsg)) return;

    // Delete account-specific data
    const historyKey = getAccountStorageKey(account.email, 'gmail_alias_recent');
    const statsKey = getAccountStorageKey(account.email, 'alias_stats');
    const favoritesKey = getAccountStorageKey(account.email, 'favorites');

    await browser.storage.local.remove([historyKey, statsKey, favoritesKey]);

    // Remove from accounts list
    let updated = emailAccounts.filter(acc => acc.id !== account.id);

    // If we deleted the active account, make the first one active
    if (account.isActive && updated.length > 0) {
      updated = updated.map((acc, index) => ({
        ...acc,
        isActive: index === 0,
      }));
      await browser.storage.local.set({ base_email: updated[0].email });
    }

    await browser.storage.local.set({ email_accounts: updated });
    setEmailAccounts(updated);
    showToast('✓ Account deleted');
  };

  const handleStartEdit = (account: EmailAccount) => {
    setEditingAccountId(account.id);
    setEditingLabel(account.label);
    setEditingEmail(account.email);
  };

  const handleCancelEdit = () => {
    setEditingAccountId(null);
    setEditingLabel('');
    setEditingEmail('');
  };

  const handleSaveEdit = async (accountId: string) => {
    if (!editingLabel.trim()) {
      alert('Label cannot be empty');
      return;
    }

    if (!editingEmail.trim() || !editingEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    const account = emailAccounts.find(acc => acc.id === accountId);
    if (!account) return;

    const oldEmail = account.email;
    const newEmail = editingEmail.trim();

    // Check if email changed
    if (oldEmail !== newEmail) {
      // Check if new email already exists in another account
      const emailExists = emailAccounts.some(acc => acc.id !== accountId && acc.email.toLowerCase() === newEmail.toLowerCase());
      if (emailExists) {
        alert('This email address is already used by another account!');
        return;
      }

      const confirmMsg = `Change email from\n${oldEmail}\nto\n${newEmail}?\n\nThis will:\n• Migrate all history, statistics, and favorites to the new email\n• Update the account email\n• Delete data associated with the old email\n\nContinue?`;
      
      if (!confirm(confirmMsg)) return;

      // Migrate data from old email to new email
      const oldHistoryKey = getAccountStorageKey(oldEmail, 'gmail_alias_recent');
      const oldStatsKey = getAccountStorageKey(oldEmail, 'alias_stats');
      const oldFavoritesKey = getAccountStorageKey(oldEmail, 'favorites');

      const newHistoryKey = getAccountStorageKey(newEmail, 'gmail_alias_recent');
      const newStatsKey = getAccountStorageKey(newEmail, 'alias_stats');
      const newFavoritesKey = getAccountStorageKey(newEmail, 'favorites');

      // Get old data
      const oldData = await browser.storage.local.get([oldHistoryKey, oldStatsKey, oldFavoritesKey]);

      // Save to new keys
      await browser.storage.local.set({
        [newHistoryKey]: oldData[oldHistoryKey] || [],
        [newStatsKey]: oldData[oldStatsKey] || { total: 0, tags: {} },
        [newFavoritesKey]: oldData[oldFavoritesKey] || [],
      });

      // Delete old keys
      await browser.storage.local.remove([oldHistoryKey, oldStatsKey, oldFavoritesKey]);

      // Update base_email if this is the active account
      if (account.isActive) {
        await browser.storage.local.set({ base_email: newEmail });
      }
    }

    // Update account in list
    const updated = emailAccounts.map(acc => 
      acc.id === accountId ? { ...acc, label: editingLabel.trim(), email: editingEmail.trim() } : acc
    );
    
    await browser.storage.local.set({ email_accounts: updated });
    setEmailAccounts(updated);
    setEditingAccountId(null);
    setEditingLabel('');
    setEditingEmail('');
    showToast('✓ Account updated');
  };

  const handleAddAccount = async () => {
    let email = newAccountEmail.trim();
    
    if (!email) {
      setAddAccountError('Please enter an email address');
      return;
    }

    // Auto-add @gmail.com if only username provided
    if (!email.includes('@')) {
      email += '@gmail.com';
    }

    // Validate email format
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setAddAccountError('Please enter a valid email address');
      return;
    }

    // Check if account already exists
    const exists = emailAccounts.some(acc => acc.email === email);
    if (exists) {
      setAddAccountError('This account already exists');
      return;
    }

    // Create new account — only auto-activate if it's the first account
    const isFirst = emailAccounts.length === 0;
    const newAccount: EmailAccount = {
      id: Date.now().toString(),
      email,
      label: newAccountLabel.trim() || email.split('@')[0],
      isActive: isFirst,
    };

    const updated = isFirst
      ? [newAccount]
      : [...emailAccounts, newAccount];

    await browser.storage.local.set({
      email_accounts: updated,
      ...(isFirst ? { base_email: newAccount.email } : {}),
    });

    setEmailAccounts(updated);
    setShowAddAccount(false);
    setNewAccountEmail('');
    setNewAccountLabel('');
    setAddAccountError('');
    showToast(`✓ ${newAccount.label} added`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h2 className="text-xl font-bold">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
              activeTab === 'general'
                ? 'border-b-3 border-blue-600 text-blue-700 dark:text-blue-400 bg-white dark:bg-gray-800 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span>General</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
              activeTab === 'accounts'
                ? 'border-b-3 border-blue-600 text-blue-700 dark:text-blue-400 bg-white dark:bg-gray-800 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Accounts</span>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Appearance Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Appearance & Display
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Theme
                    </label>
                    <select
                      value={settings.theme}
                      onChange={(e) => {
                        const t = e.target.value as 'light' | 'dark' | 'auto';
                        saveSettings({ ...settings, theme: t });
                        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                        document.documentElement.classList.toggle('dark', t === 'dark' || (t === 'auto' && prefersDark));
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                    >
                      <option value="light">☀️ Light</option>
                      <option value="dark">🌙 Dark</option>
                      <option value="auto">🖥️ System (Auto)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Badge Counter
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Display count on extension icon</p>
                    <select
                      value={settings.badgeDisplay}
                      onChange={(e) => saveSettings({ ...settings, badgeDisplay: e.target.value as any })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                    >
                      <option value="none">🚫 None (Hidden)</option>
                      <option value="total">📊 Total in History</option>
                      <option value="all-time">🏆 Total Generated (All Time)</option>
                      <option value="today">📅 Created Today</option>
                      <option value="week">📆 This Week</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Show Notifications</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Copy confirmation messages</p>
                    </div>
                    <Toggle
                      enabled={settings.showNotifications}
                      onChange={(enabled) => saveSettings({ ...settings, showNotifications: enabled })}
                      label=""
                    />
                  </div>
                </div>
              </div>

              {/* Alias Generation Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Alias Generation
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Random Alias Format
                    </label>
                    <select
                      value={settings.randomFormat}
                      onChange={(e) => saveSettings({ ...settings, randomFormat: e.target.value as any })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                    >
                      <option value="private-mail">🎯 Private Mail (e.g., private-mail-q2ga) ⭐</option>
                      <option value="alphanumeric">🔤 Random Characters (e.g., abc123xy)</option>
                      <option value="words">💬 Random Words (e.g., happy-fox-42)</option>
                      <option value="timestamp">⏱️ Timestamp (e.g., lk9x2m3n)</option>
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Choose the format for random alias generation</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Auto-save Limit
                    </label>
                    <select
                      value={settings.maxHistory}
                      onChange={(e) => saveSettings({ ...settings, maxHistory: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                    >
                      <option value={20}>20 aliases</option>
                      <option value={50}>50 aliases</option>
                      <option value={100}>100 aliases</option>
                      <option value={200}>200 aliases</option>
                      <option value={500}>500 aliases</option>
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Maximum number of aliases to auto-save to history</p>
                  </div>
                </div>
              </div>

              {/* Custom Presets Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Custom Presets
                </h3>
                <div className="space-y-3">
                  <Input
                    value={newPresetLabel}
                    onChange={setNewPresetLabel}
                    placeholder="Label (e.g., Newsletter)"
                    label="Preset Label"
                  />
                  <Input
                    value={newPresetTag}
                    onChange={setNewPresetTag}
                    placeholder="Tag (e.g., newsletter)"
                    label="Tag Name"
                  />
                  <Button
                    onClick={handleAddPreset}
                    disabled={!newPresetLabel.trim() || !newPresetTag.trim()}
                    fullWidth
                  >
                    + Add Preset
                  </Button>
                </div>

                {settings.customPresets.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">Your Presets ({settings.customPresets.length})</div>
                    <div className="space-y-2">
                      {settings.customPresets.map((preset) => (
                        <div
                          key={preset.id}
                          className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-sm transition-shadow"
                        >
                          <div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{preset.label}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-0.5">+{preset.tag}</div>
                          </div>
                          <button
                            onClick={() => handleRemovePreset(preset.id)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Data Management Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                  Data Management
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={handleExportSettings}
                      variant="secondary"
                      fullWidth
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      }
                    >
                      Export
                    </Button>
                    <Button
                      onClick={handleImportSettings}
                      variant="secondary"
                      fullWidth
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      }
                    >
                      Import
                    </Button>
                  </div>
                  <Button
                    onClick={() => {
                      if (confirm('Clear all recent aliases?')) {
                        onClearHistory();
                      }
                    }}
                    variant="danger"
                    fullWidth
                  >
                    Clear History
                  </Button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/40 dark:to-orange-950/40 rounded-lg shadow-sm border-2 border-red-200 dark:border-red-900/60 p-5">
                <h3 className="text-base font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Danger Zone
                </h3>
                <p className="text-xs text-red-600 dark:text-red-400 mb-3">This action cannot be undone</p>
                <Button
                  onClick={handleResetSettings}
                  variant="danger"
                  fullWidth
                >
                  Reset All Settings to Default
                </Button>
              </div>
            </div>
          )}

          {/* Accounts Tab */}
          {activeTab === 'accounts' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Email Accounts</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Manage your Gmail accounts. Each account has its own history, statistics, and favorites.
                </p>
              </div>

              {emailAccounts.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                  No accounts found. Please add an account from the main screen.
                </div>
              ) : (
                <div className="space-y-2">
                  {emailAccounts.map((account) => (
                    <div
                      key={account.id}
                      className={`rounded-lg border-2 transition-all ${
                        account.isActive
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      {editingAccountId === account.id ? (
                        // Edit mode
                        <div className="p-3 space-y-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Label</label>
                            <input
                              type="text"
                              value={editingLabel}
                              onChange={(e) => setEditingLabel(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              placeholder="Account label"
                              autoFocus
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                            <input
                              type="email"
                              value={editingEmail}
                              onChange={(e) => setEditingEmail(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              placeholder="your.email@gmail.com"
                            />
                            {editingEmail !== account.email && (
                              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                ⚠️ Changing email will migrate all data to the new email address
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => handleSaveEdit(account.id)}
                              className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
                            >
                              Save Changes
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="flex-1 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-medium rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View mode
                        <div className="flex items-center gap-2 p-3">
                          {/* Radio button to select active account */}
                          <label className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">
                            <input
                              type="radio"
                              name="activeAccount"
                              checked={account.isActive}
                              onChange={() => handleSwitchAccount(account.id)}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                  {account.label}
                                </span>
                                {account.isActive && (
                                  <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded flex-shrink-0">
                                    Active
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400 truncate font-mono">
                                {account.email}
                              </div>
                            </div>
                          </label>

                          {/* Action buttons */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartEdit(account);
                              }}
                              className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                              title="Edit account"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAccount(account);
                              }}
                              className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                              title={emailAccounts.length === 1 ? "Cannot delete the last account" : "Delete this account"}
                              disabled={emailAccounts.length === 1}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add Account Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-lg shadow-sm border-2 border-blue-200 dark:border-blue-900/60 p-4">
                {!showAddAccount ? (
                  <button
                    onClick={() => setShowAddAccount(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Account
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">Add New Account</h4>
                      <button
                        onClick={() => {
                          setShowAddAccount(false);
                          setNewAccountEmail('');
                          setNewAccountLabel('');
                          setAddAccountError('');
                        }}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type="email"
                        value={newAccountEmail}
                        onChange={(e) => {
                          setNewAccountEmail(e.target.value);
                          setAddAccountError('');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Tab' && newAccountEmail && !newAccountEmail.includes('@')) {
                            e.preventDefault();
                            setNewAccountEmail(newAccountEmail + '@gmail.com');
                          }
                          if (e.key === 'Enter') {
                            handleAddAccount();
                          }
                        }}
                        placeholder="your.email"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        autoFocus
                      />
                      {newAccountEmail && !newAccountEmail.includes('@') && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs pointer-events-none">
                          @gmail.com
                        </div>
                      )}
                    </div>

                    {addAccountError && (
                      <div className="px-3 py-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-md">
                        <p className="text-xs text-red-600 dark:text-red-400">{addAccountError}</p>
                      </div>
                    )}

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      💡 Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono">Tab</kbd> to add @gmail.com
                    </p>

                    <input
                      type="text"
                      value={newAccountLabel}
                      onChange={(e) => setNewAccountLabel(e.target.value)}
                      placeholder="Label (optional, e.g., Work, Personal)"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    
                    <button
                      onClick={handleAddAccount}
                      disabled={!newAccountEmail.trim()}
                      className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Add Account
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 px-6 py-3 border-t border-gray-300 dark:border-gray-700">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Gmail Alias Toolkit</span>
            <span className="text-gray-400 dark:text-gray-600">•</span>
            <span className="text-gray-500 dark:text-gray-500">v{version}</span>
          </div>
        </div>
      </div>

      {/* Settings Toast - inside modal so it shows above the overlay */}
      {toast && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap z-10">
          {toast}
        </div>
      )}
    </div>
  );
}
