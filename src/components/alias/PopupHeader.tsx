// skipcq: JS-0415 - Header markup is a compact visual composition with no nested business logic.
import { Settings, Sparkles } from "lucide-react";
import { Button } from "src/components/motion/button/base";
import { Tooltip } from "src/components/motion/tooltip";
import { ThemeToggle } from "src/components/motion/theme-toggle";
import { t } from "../../../lib/i18n";

export interface PopupHeaderProps {
  onOpenSettings: () => void;
  theme: "light" | "dark" | "auto";
  onThemeChange: (theme: "light" | "dark") => void;
}

/** beUI Motion header for the extension popup; business logic stays in App. */
export default function PopupHeader({
  onOpenSettings,
  theme,
  onThemeChange,
}: PopupHeaderProps) {
  const isDark =
    theme === "dark" ||
    (theme === "auto" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // skipcq: JS-0415 - Header visual composition is intentionally compact and has no nested logic.
  return (
    <div className="flex-shrink-0 px-4 pb-3 pt-4">
      <div className="rounded-3xl border border-primary-foreground/30 bg-primary p-4 text-primary-foreground shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/15 ring-1 ring-primary-foreground/20 backdrop-blur">
              <img src="/icons/48.png" alt="" className="h-8 w-8 rounded-xl" />
              <Sparkles className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-primary-foreground/20 p-0.5 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold tracking-tight">
                {t("extensionName")}
              </h1>
              <p className="mt-0.5 text-xs text-primary-foreground/75">
                {t("headerSubtitle")}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <Tooltip
              content={isDark ? t("switchToLightMode") : t("switchToDarkMode")}
              side="bottom"
            >
              <ThemeToggle
                checked={isDark}
                onCheckedChange={(checked) =>
                  onThemeChange(checked ? "dark" : "light")
                }
                aria-label={
                  isDark ? t("switchToLightMode") : t("switchToDarkMode")
                }
                variant="circle-blur"
                start="top-right"
                className="h-9 w-9 rounded-2xl text-primary-foreground transition-colors hover:bg-primary-foreground/15 focus-visible:ring-primary-foreground/60"
                iconClassName="h-4 w-4"
              />
            </Tooltip>
            <Tooltip content={t("settings")} side="bottom">
              <Button
                onClick={onOpenSettings}
                variant="ghost"
                size="icon"
                className="shrink-0 rounded-2xl text-primary-foreground hover:bg-primary-foreground/15 focus-visible:ring-primary-foreground/60"
                aria-label={t("settings")}
              >
                <Settings className="h-5 w-5" aria-hidden="true" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
