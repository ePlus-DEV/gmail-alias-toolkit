import { useState, useEffect } from 'react';
import Toggle from './Toggle';
import Button from './Button';
import Input from './Input';

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

interface AppSettings {
  customPresets: CustomPreset[];
  maxHistory: number;
  theme: 'light' | 'dark' | 'auto';
  autoSave: boolean;
  showNotifications: boolean;
  randomFormat: 'private-mail' | 'alphanumeric' | 'words' | 'timestamp';
}

const DEFAULT_SETTINGS: AppSettings = {
  customPresets: [],
  maxHistory: 5,
  theme: 'light',
  autoSave: true,
  showNotifications: true,
  randomFormat: 'private-mail',
};

export default function Settings({ isOpen, onClose, onClearHistory }: SettingsProps) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [newPresetLabel, setNewPresetLabel] = useState('');
  const [newPresetTag, setNewPresetTag] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'presets' | 'advanced'>('general');

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    const result = await browser.storage.local.get('app_settings');
    if (result.app_settings) {
      setSettings({ ...DEFAULT_SETTINGS, ...result.app_settings });
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
  };

  const handleRemovePreset = (id: string) => {
    const updatedSettings = {
      ...settings,
      customPresets: settings.customPresets.filter((p) => p.id !== id),
    };
    saveSettings(updatedSettings);
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
      } catch (err) {
        alert('Failed to import settings. Please check the file format.');
      }
    };
    input.click();
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      saveSettings(DEFAULT_SETTINGS);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'general'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'presets'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Presets
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'advanced'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Advanced
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  History Limit
                </label>
                <select
                  value={settings.maxHistory}
                  onChange={(e) => saveSettings({ ...settings, maxHistory: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={3}>3 aliases</option>
                  <option value={5}>5 aliases</option>
                  <option value={10}>10 aliases</option>
                  <option value={20}>20 aliases</option>
                  <option value={50}>50 aliases</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Random Alias Format
                </label>
                <select
                  value={settings.randomFormat}
                  onChange={(e) => saveSettings({ ...settings, randomFormat: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="private-mail">Private Mail (e.g., private-mail-q2ga) ⭐</option>
                  <option value="alphanumeric">Random Characters (e.g., abc123xy)</option>
                  <option value="words">Random Words (e.g., happy-fox-42)</option>
                  <option value="timestamp">Timestamp (e.g., lk9x2m3n)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Choose the format for random alias generation</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => saveSettings({ ...settings, theme: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark (Coming Soon)</option>
                  <option value="auto">Auto (Coming Soon)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Auto-save aliases</label>
                  <p className="text-xs text-gray-500">Automatically save to history</p>
                </div>
                <Toggle
                  enabled={settings.autoSave}
                  onChange={(enabled) => saveSettings({ ...settings, autoSave: enabled })}
                  label=""
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Show notifications</label>
                  <p className="text-xs text-gray-500">Copy confirmation messages</p>
                </div>
                <Toggle
                  enabled={settings.showNotifications}
                  onChange={(enabled) => saveSettings({ ...settings, showNotifications: enabled })}
                  label=""
                />
              </div>

              <div className="pt-3 border-t border-gray-200">
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
          )}

          {/* Presets Tab */}
          {activeTab === 'presets' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Add Custom Preset</h3>
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
                    Add Preset
                  </Button>
                </div>
              </div>

              {settings.customPresets.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Custom Presets</h3>
                  <div className="space-y-2">
                    {settings.customPresets.map((preset) => (
                      <div
                        key={preset.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                      >
                        <div>
                          <div className="text-sm font-medium text-gray-900">{preset.label}</div>
                          <div className="text-xs text-gray-500 font-mono">+{preset.tag}</div>
                        </div>
                        <button
                          onClick={() => handleRemovePreset(preset.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
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
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Backup & Restore</h3>
                <div className="space-y-2">
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
                    Export Settings
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
                    Import Settings
                  </Button>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Danger Zone</h3>
                <Button
                  onClick={handleResetSettings}
                  variant="danger"
                  fullWidth
                >
                  Reset All Settings
                </Button>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">About</h3>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Gmail Alias Toolkit v1.0.0</p>
                  <p>Built with WXT + React + TypeScript</p>
                  <p className="text-gray-500 mt-2">
                    Generate Gmail aliases using plus addressing (+tag)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
