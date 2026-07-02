import { cn } from "./utils";
export interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  description?: string;
}
export default function ToggleSwitch({
  enabled,
  onChange,
  label,
  description,
}: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        {label && (
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {label}
          </p>
        )}
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          enabled
            ? "bg-blue-600 bg-gradient-to-r from-blue-600 to-violet-600"
            : "bg-gray-300 dark:bg-gray-700",
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform",
            enabled ? "translate-x-6" : "translate-x-1",
          )}
        />
      </button>
    </div>
  );
}
