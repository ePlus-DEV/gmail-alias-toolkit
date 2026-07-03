import GmailTricks from "./GmailTricks";
import Button from "./Button";
import Input from "./Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/motion/select";
import {
  generateAlias,
  generateRandomString,
  type RandomFormat,
} from "../utils";
import { t } from "../../../lib/i18n";

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
        <Button
          onClick={() => setActiveTab("random")}
          variant="outline"
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
            activeTab === "random"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:border-border dark:hover:border-border"
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
          {t("random")}
        </Button>
        <Button
          onClick={() => setActiveTab("tags")}
          variant="outline"
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
            activeTab === "tags"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:border-border dark:hover:border-border"
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
          {t("customTags")}
        </Button>
        <Button
          onClick={() => setActiveTab("tricks")}
          variant="outline"
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
            activeTab === "tricks"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:border-border dark:hover:border-border"
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
          {t("gmailTricks")}
        </Button>
      </div>

      {/* Tab Content */}
      <div className="p-3.5">
        {/* Random Tab */}
        {activeTab === "random" && (
          <div>
            {/* Format Selector */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-foreground mb-2">
                {t("format")}
              </label>
              <Select
                value={randomFormat}
                onValueChange={(value) =>
                  handleFormatChange(value as RandomFormat)
                }
              >
                <SelectTrigger className="rounded-full bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private-mail">
                    {t("privateMailFormat")}
                  </SelectItem>
                  <SelectItem value="alphanumeric">
                    {t("randomCharactersFormat")}
                  </SelectItem>
                  <SelectItem value="words">{t("randomWordsFormat")}</SelectItem>
                  <SelectItem value="timestamp">
                    {t("timestampFormat")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Number of Emails */}
            <div className="mb-3 flex items-center gap-3">
              <label className="text-sm font-medium text-foreground">
                {t("numberOfAliases")}
              </label>
              <Input
                type="number"
                min="1"
                value={String(randomEmailCount)}
                onChange={(value) =>
                  setRandomEmailCount(
                    Math.max(1, parseInt(value) || 10),
                  )
                }
                className="w-20"
              />
            </div>

            {/* Generate Button */}
            <Button
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
              ripple
              className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold text-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring transition-colors mb-3"
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
                {t("generateRandomAliases", [
                  String(randomEmailCount),
                  randomEmailCount > 1 ? "es" : "",
                ])}
              </div>
            </Button>

            {/* Generated Emails List */}
            {generatedRandomList.length > 0 && (
              // skipcq: JS-0415
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="bg-muted/40 px-3 py-2 border-b border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      {t("generatedAliases")}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {t("totalCount", String(generatedRandomList.length))}
                      </span>
                      <Button
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(
                              generatedRandomList.join("\n"),
                            );
                            saveRecentAliases(generatedRandomList);
                            if (showNotifications) {
                              setToastMessage(
                                t(
                                  "copiedAliases",
                                  String(generatedRandomList.length),
                                ),
                              );
                            }
                          } catch {
                            if (showNotifications) {
                              setToastMessage(t("failedToCopy"));
                            }
                          }
                          setTimeout(
                            () => setToastMessage(null),
                            showNotifications ? 2000 : 0,
                          );
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-xs text-primary hover:text-primary font-medium"
                        title={t("copyToClipboard")}
                      >
                        {t("copyAll")}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {generatedRandomList.map((email) => (
                    <div
                      key={email}
                      className="flex items-center gap-2 px-3 py-2.5 border-b border-border dark:border-border last:border-b-0 hover:bg-muted/40 dark:hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 font-mono text-xs text-foreground truncate">
                        {email}
                      </div>
                      <Button
                        onClick={() => copyToClipboard(email)}
                        variant="ghost"
                        size="icon"
                        className="p-1.5 text-primary hover:bg-primary/15 rounded transition-colors flex-shrink-0"
                        title={t("copy")}
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
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-2 text-xs text-muted-foreground text-center">
              {randomFormat === "private-mail"
                ? t("formatPrivateMail")
                : randomFormat === "alphanumeric"
                  ? t("formatAlphanumeric")
                  : randomFormat === "words"
                    ? t("formatWords")
                    : t("formatTimestamp")}
            </div>
          </div>
        )}

        {/* Custom Tags Tab */}
        {activeTab === "tags" && (
          // skipcq: JS-0415
          <div>
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
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
                <Input
                  type="text"
                  value={customTag}
                  onChange={setCustomTag}
                  onKeyDown={handleKeyPress}
                  className="w-full"
                  placeholder={t("tagPlaceholder")}
                />
              </div>
              <Button
                onClick={handleCustomGenerate}
                disabled={!customTag.trim()}
                ripple
                className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t("generate")}
              </Button>
            </div>

            {/* Custom Presets - Quick Access */}
            {customPresets.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-medium text-foreground mb-2">
                  {t("yourPresets")}
                </div>
                <div className="flex flex-wrap gap-2">
                  {customPresets.map((preset) => (
                    <Button
                      key={preset.id}
                      onClick={() => handlePresetClick(preset.tag)}
                      variant="outline"
                      size="sm"
                      className="px-3 py-1.5 bg-card text-primary text-xs font-medium rounded-full border border-primary/30 hover:bg-primary/10 transition-colors"
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>
                {t("example")} {baseEmail.split("@")[0]}+
                <strong className="text-foreground">
                  your-tag
                </strong>
                @{baseEmail.split("@")[1]}
              </span>
              <Button
                onClick={() =>
                  copyToClipboard(
                    `${baseEmail.split("@")[0]}+your-tag@${baseEmail.split("@")[1]}`,
                  )
                }
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary flex-shrink-0"
                title={t("copyExample")}
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
              </Button>
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



