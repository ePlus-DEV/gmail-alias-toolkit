import GmailTricks from "./GmailTricks";
import {
  generateAlias,
  generateRandomString,
  type RandomFormat,
} from "../utils";

interface Preset {
  id: string;
  label: string;
  tag: string;
}

interface GeneratorTabsProps {
  baseEmail: string;
  activeTab: "random" | "tags" | "tricks";
  setActiveTab: (tab: "random" | "tags" | "tricks") => void;
  randomFormat: RandomFormat;
  setRandomFormat: (format: RandomFormat) => void;
  customTag: string;
  setCustomTag: (tag: string) => void;
  generatedRandomList: string[];
  setGeneratedRandomList: (list: string[]) => void;
  randomEmailCount: number;
  setRandomEmailCount: (count: number) => void;
  customPresets: Preset[];
  showNotifications: boolean;
  copyToClipboard: (email: string) => Promise<void>;
  handleCustomGenerate: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handlePresetClick: (tag: string) => void;
  saveRecentAliases: (emails: string[]) => void;
  setToastMessage: (msg: string | null) => void;
}

/** Renders three alias generator tabs: random (formatted strings), custom tags, and Gmail tricks. */
export default function GeneratorTabs({
  baseEmail,
  activeTab,
  setActiveTab,
  randomFormat,
  setRandomFormat,
  customTag,
  setCustomTag,
  generatedRandomList,
  setGeneratedRandomList,
  randomEmailCount,
  setRandomEmailCount,
  customPresets,
  showNotifications,
  copyToClipboard,
  handleCustomGenerate,
  handleKeyPress,
  handlePresetClick,
  saveRecentAliases,
  setToastMessage,
}: GeneratorTabsProps) {
  /** Updates random format setting and persists to storage. */
  const handleFormatChange = async (newFormat: RandomFormat) => {
    setRandomFormat(newFormat);
    const result = await browser.storage.local.get("app_settings");
    const currentSettings = result.app_settings || {};
    await browser.storage.local.set({
      app_settings: {
        ...currentSettings,
        randomFormat: newFormat,
      },
    });
  };

  return (
    <div>
      {/* Main Tabs */}
      <div className="flex gap-2 p-3.5 pb-0">
        <button
          onClick={() => setActiveTab("random")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
            activeTab === "random"
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
              : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
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
              d="M4 4h4l4 4m0 0l4-4h4m0 16h-4l-4-4m0 0l-4 4H4m0-8h4m8 0h4"
            />
          </svg>
          Random
        </button>
        <button
          onClick={() => setActiveTab("tags")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
            activeTab === "tags"
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
              : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
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
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          Custom Tags
        </button>
        <button
          onClick={() => setActiveTab("tricks")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
            activeTab === "tricks"
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
              : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
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
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Gmail Tricks
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-3.5 dark:bg-gray-800">
        {/* Random Tab */}
        {activeTab === "random" && (
          <div>
            {/* Format Selector */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Format
              </label>
              <select
                value={randomFormat}
                onChange={(e) =>
                  handleFormatChange(e.target.value as RandomFormat)
                }
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="private-mail">
                  📧 Private Mail (private-mail-xxxx)
                </option>
                <option value="alphanumeric">
                  🔤 Random Characters (abc123xy)
                </option>
                <option value="words">📝 Random Words (happy-fox-42)</option>
                <option value="timestamp">⏱️ Timestamp (1234567890)</option>
              </select>
            </div>

            {/* Number of Emails */}
            <div className="mb-3 flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Number of aliases
              </label>
              <input
                type="number"
                min="1"
                value={randomEmailCount}
                onChange={(e) =>
                  setRandomEmailCount(
                    Math.max(1, parseInt(e.target.value) || 10),
                  )
                }
                className="w-20 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={() => {
                setGeneratedRandomList([]);
                const aliases: string[] = [];
                const timestamp = Date.now();

                for (let i = 0; i < randomEmailCount; i++) {
                  const randomTag = generateRandomString(
                    randomFormat,
                    i + timestamp,
                  );
                  const alias = generateAlias(baseEmail, randomTag);
                  if (alias) aliases.push(alias);
                }

                setTimeout(() => {
                  if (aliases.length > 0) {
                    setGeneratedRandomList(aliases);
                    copyToClipboard(aliases[0]);
                  }
                }, 0);
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold text-sm hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors mb-3"
            >
              <div className="flex items-center justify-center gap-2">
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Generate {randomEmailCount} Random Alias
                {randomEmailCount > 1 ? "es" : ""}
              </div>
            </button>

            {/* Generated Emails List */}
            {/* skipcq: JS-0415 */}
            {generatedRandomList.length > 0 && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-900 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Generated Aliases
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {generatedRandomList.length} total
                      </span>
                      <button
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(
                              generatedRandomList.join("\n"),
                            );
                            saveRecentAliases(generatedRandomList);
                            if (showNotifications) {
                              setToastMessage(
                                `✓ Copied ${generatedRandomList.length} aliases!`,
                              );
                            }
                          } catch {
                            if (showNotifications) {
                              setToastMessage("✗ Failed to copy");
                            }
                          }
                          setTimeout(
                            () => setToastMessage(null),
                            showNotifications ? 2000 : 0,
                          );
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
                  {generatedRandomList.map((email) => (
                    <div
                      key={email}
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
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              {randomFormat === "private-mail"
                ? "Format: private-mail-xxxx"
                : randomFormat === "alphanumeric"
                  ? "8 random characters"
                  : randomFormat === "words"
                    ? "2 random words"
                    : "Unix timestamp"}
            </div>
          </div>
        )}

        {/* Custom Tags Tab */}
        {/* skipcq: JS-0415 */}
        {activeTab === "tags" && (
          <div>
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500">
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
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
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
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Generate
              </button>
            </div>

            {/* Custom Presets - Quick Access */}
            {customPresets.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Presets
                </div>
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
                Example: {baseEmail.split("@")[0]}+
                <strong className="text-gray-700 dark:text-gray-300">
                  your-tag
                </strong>
                @{baseEmail.split("@")[1]}
              </span>
              <button
                onClick={() =>
                  copyToClipboard(
                    `${baseEmail.split("@")[0]}+your-tag@${baseEmail.split("@")[1]}`,
                  )
                }
                className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 flex-shrink-0"
                title="Copy example"
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
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Gmail Tricks Tab */}
        {activeTab === "tricks" && (
          <div>
            <GmailTricks baseEmail={baseEmail} onCopy={copyToClipboard} />
          </div>
        )}
      </div>
    </div>
  );
}
