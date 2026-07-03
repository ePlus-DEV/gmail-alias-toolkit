import GmailTricks from "./GmailTricks";
import Button from "./Button";
import Input from "./Input";
import {
  AtSign,
  Check,
  Copy,
  LoaderCircle,
  Shuffle,
  Tag,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/motion/select";
import { ActionSwapButton } from "src/components/motion/action-swap";
import { Tooltip } from "src/components/motion/tooltip";
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
  const [randomActionState, setRandomActionState] = useState<
    "idle" | "generating" | "done"
  >("idle");

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
      <div className="grid grid-cols-3 gap-1.5 p-3 pb-0">
        <Tooltip content={t("random")} side="bottom" wrapperClassName="min-w-0">
          <Button
            onClick={() => setActiveTab("random")}
            variant="ghost"
            size="sm"
            className={`h-10 w-full min-w-0 rounded-xl border px-2 text-xs transition-colors ${
              activeTab === "random"
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground hover:bg-muted/70"
            }`}
          >
            <Shuffle className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{t("random")}</span>
          </Button>
        </Tooltip>
        <Tooltip
          content={t("customTags")}
          side="bottom"
          wrapperClassName="min-w-0"
        >
          <Button
            onClick={() => setActiveTab("tags")}
            variant="ghost"
            size="sm"
            className={`h-10 w-full min-w-0 rounded-xl border px-2 text-xs transition-colors ${
              activeTab === "tags"
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground hover:bg-muted/70"
            }`}
          >
            <Tag className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{t("tabTagsShort")}</span>
          </Button>
        </Tooltip>
        <Tooltip
          content={t("gmailTricks")}
          side="bottom"
          wrapperClassName="min-w-0"
        >
          <Button
            onClick={() => setActiveTab("tricks")}
            variant="ghost"
            size="sm"
            className={`h-10 w-full min-w-0 rounded-xl border px-2 text-xs transition-colors ${
              activeTab === "tricks"
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground hover:bg-muted/70"
            }`}
          >
            <Zap className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{t("tabTricksShort")}</span>
          </Button>
        </Tooltip>
      </div>

      {/* Tab Content */}
      <div className="p-3">
        {/* Random Tab */}
        {activeTab === "random" && (
          <div>
            <div className="mb-3 grid grid-cols-[minmax(0,1fr)_82px] gap-2">
              <div className="min-w-0">
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  {t("format")}
                </label>
                <Select
                  value={randomFormat}
                  onValueChange={(value) =>
                    handleFormatChange(value as RandomFormat)
                  }
                >
                  <SelectTrigger className="min-h-10 rounded-xl bg-background shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private-mail">
                      {t("privateMailFormat")}
                    </SelectItem>
                    <SelectItem value="alphanumeric">
                      {t("randomCharactersFormat")}
                    </SelectItem>
                    <SelectItem value="words">
                      {t("randomWordsFormat")}
                    </SelectItem>
                    <SelectItem value="timestamp">
                      {t("timestampFormat")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block truncate text-xs font-semibold text-foreground">
                  {t("numberOfAliases")}
                </label>
                <Input
                  type="number"
                  min="1"
                  value={String(randomEmailCount)}
                  onChange={(value) =>
                    setRandomEmailCount(Math.max(1, parseInt(value) || 10))
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* Generate Button */}
            <ActionSwapButton
              onClick={() => {
                setRandomActionState("generating");
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
                    setRandomActionState("done");
                    setTimeout(() => setRandomActionState("idle"), 1400);
                  } else {
                    setRandomActionState("idle");
                  }
                }, 0);
              }}
              disabled={randomActionState === "generating"}
              items={[
                {
                  id: "idle",
                  icon: <Shuffle className="h-4 w-4" />,
                  label: t("generateRandomAliases", [
                    String(randomEmailCount),
                    randomEmailCount > 1 ? "es" : "",
                  ]),
                },
                {
                  id: "generating",
                  icon: <LoaderCircle className="h-4 w-4 animate-spin" />,
                  label: t("generating"),
                },
                {
                  id: "done",
                  icon: <Check className="h-4 w-4" />,
                  label: t("copied"),
                },
              ]}
              value={randomActionState}
              cycle={false}
              variant="primary"
              size="md"
              animation="roll"
              className="mb-2.5 h-10 w-full rounded-xl px-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
            />

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
                      <Tooltip content={t("copyToClipboard")} side="top">
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
                          aria-label={t("copyToClipboard")}
                        >
                          {t("copyAll")}
                        </Button>
                      </Tooltip>
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
                      <Tooltip content={t("copy")}>
                        <Button
                          onClick={() => copyToClipboard(email)}
                          variant="ghost"
                          size="icon"
                          className="p-1.5 text-primary hover:bg-primary/15 rounded transition-colors flex-shrink-0"
                          aria-label={t("copy")}
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
                      </Tooltip>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-1 text-center text-[11px] text-muted-foreground">
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
          <div className="space-y-3">
            <div className="rounded-2xl border border-border bg-background p-2.5 shadow-sm">
              <div className="grid grid-cols-[minmax(0,1fr)_92px] gap-2">
                <Input
                  type="text"
                  value={customTag}
                  onChange={setCustomTag}
                  onKeyDown={handleKeyPress}
                  className="w-full"
                  placeholder={t("tagPlaceholder")}
                  leftIcon={<AtSign className="h-4 w-4" />}
                />
                <Button
                  onClick={handleCustomGenerate}
                  disabled={!customTag.trim()}
                  ripple
                  className="h-10 rounded-xl px-3 text-sm font-semibold"
                >
                  {t("generate")}
                </Button>
              </div>
            </div>

            {/* Custom Presets - Quick Access */}
            {customPresets.length > 0 && (
              <div className="rounded-2xl border border-border bg-background p-2.5 shadow-sm">
                <div className="mb-2 text-xs font-semibold text-foreground">
                  {t("yourPresets")}
                </div>
                <div className="flex flex-wrap gap-2">
                  {customPresets.map((preset) => (
                    <Button
                      key={preset.id}
                      onClick={() => handlePresetClick(preset.tag)}
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-full border-border bg-muted px-3 text-xs font-medium text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 rounded-2xl border border-border bg-muted/55 px-3 py-2 text-xs text-muted-foreground">
              <span className="min-w-0 flex-1 truncate">
                {t("example")}{" "}
                <span className="font-mono text-foreground">
                  {baseEmail.split("@")[0]}+your-tag@{baseEmail.split("@")[1]}
                </span>
              </span>
              <Tooltip content={t("copyExample")}>
                <Button
                  onClick={() =>
                    copyToClipboard(
                      `${baseEmail.split("@")[0]}+your-tag@${baseEmail.split("@")[1]}`,
                    )
                  }
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 flex-shrink-0 rounded-lg text-muted-foreground hover:bg-background hover:text-primary"
                  aria-label={t("copyExample")}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </Tooltip>
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
