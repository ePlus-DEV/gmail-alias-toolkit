import { Switch } from "../../../src/components/motion/switch";

export interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
  description?: string;
}

/** Labeled switch row used by popup settings. */
export default function Toggle({
  enabled,
  onChange,
  label,
  description,
}: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <Switch checked={enabled} onCheckedChange={onChange} />
    </div>
  );
}
