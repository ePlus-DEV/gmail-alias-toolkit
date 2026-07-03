// Source adapted from beUI Motion Switch: https://beui.dev/components/motion/switch
import { motion, useReducedMotion } from "motion/react";
import { SPRING_PRESS } from "../../lib/ease";
import { cn } from "../../lib/utils";
export interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  description?: string;
  className?: string;
}
export default function ToggleSwitch({
  enabled,
  onChange,
  label,
  description,
  className,
}: ToggleSwitchProps) {
  const reduce = useReducedMotion();
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
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
      <motion.button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        whileTap={reduce ? undefined : { scale: 0.96 }}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          enabled
            ? "bg-primary"
            : "bg-muted",
        )}
      >
        <motion.span
          layout
          className="absolute top-1 h-4 w-4 rounded-full bg-white shadow"
          animate={{ x: enabled ? 24 : 4 }}
          transition={reduce ? { duration: 0 } : SPRING_PRESS}
        />
      </motion.button>
    </div>
  );
}
