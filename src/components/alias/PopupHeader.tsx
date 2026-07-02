import { Settings, Sparkles } from "lucide-react";
import { Button } from "../ui";
import { t } from "../../../lib/i18n";

export interface PopupHeaderProps {
  onOpenSettings: () => void;
}

/** beUI Motion header for the extension popup; business logic stays in App. */
export default function PopupHeader({ onOpenSettings }: PopupHeaderProps) {
  return (
    <div className="flex-shrink-0 px-4 pb-3 pt-4">
      <div className="rounded-3xl border border-white/30 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-4 text-white shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur">
              <img src="/icons/48.png" alt="" className="h-8 w-8 rounded-xl" />
              <Sparkles className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-white/20 p-0.5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold tracking-tight">
                {t("extensionName")}
              </h1>
              <p className="mt-0.5 text-xs text-blue-100">
                {t("headerSubtitle")}
              </p>
            </div>
          </div>
          <Button
            onClick={onOpenSettings}
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-2xl text-white hover:bg-white/15 focus-visible:ring-white/60"
            title={t("settings")}
          >
            <Settings className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
