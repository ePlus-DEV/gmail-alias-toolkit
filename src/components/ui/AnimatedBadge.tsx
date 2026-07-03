// Source adapted from beUI Motion Animated Badge: https://beui.dev/components/motion/animated-badge
import { motion, useReducedMotion } from "motion/react";
import { Check, Info, AlertCircle, AlertTriangle, Loader } from "lucide-react";
import type { ReactNode } from "react";
import { SPRING_PRESS } from "../../lib/ease";
import { cn } from "../../lib/utils";

export type AnimatedBadgeStatus = "info" | "success" | "warning" | "danger" | "neutral" | "loading";
export type AnimatedBadgeSize = "sm" | "md";

const statusStyles = {
  info: "border-blue-200/80 bg-blue-50 text-blue-700 dark:border-blue-800/50 dark:bg-blue-950/40 dark:text-blue-300",
  success:
    "border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-300",
  warning:
    "border-amber-200/80 bg-amber-50 text-amber-700 dark:border-amber-800/50 dark:bg-amber-950/40 dark:text-amber-300",
  danger:
    "border-red-200/80 bg-red-50 text-red-700 dark:border-red-800/50 dark:bg-red-950/40 dark:text-red-300",
  neutral:
    "border-gray-200/80 bg-gray-50 text-gray-700 dark:border-gray-800/50 dark:bg-gray-950/40 dark:text-gray-300",
  loading:
    "border-blue-200/80 bg-blue-50 text-blue-700 dark:border-blue-800/50 dark:bg-blue-950/40 dark:text-blue-300",
};

const sizeStyles = {
  sm: "rounded-full border px-1.5 py-0.5 text-[10px] font-medium gap-0.5",
  md: "rounded-full border px-2 py-0.5 text-xs font-semibold gap-1",
};

const iconSizes = {
  sm: "h-3 w-3",
  md: "h-3.5 w-3.5",
};

export default function AnimatedBadge({
  children,
  status = "info",
  size = "md",
  showIcon = true,
  className,
}: {
  children: ReactNode;
  status?: AnimatedBadgeStatus;
  size?: AnimatedBadgeSize;
  showIcon?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const isLoading = status === "loading";

  const Icon =
    status === "success"
      ? Check
      : status === "danger" || status === "warning"
        ? AlertCircle
        : status === "loading"
          ? Loader
          : status === "neutral"
            ? Info
            : Info;

  return (
    <motion.span
      layout
      whileTap={reduce ? undefined : { scale: 0.96 }}
      transition={SPRING_PRESS}
      className={cn(
        "inline-flex items-center whitespace-nowrap",
        sizeStyles[size],
        statusStyles[status],
        className,
      )}
    >
      {showIcon && (
        <>
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Icon className={iconSizes[size]} />
            </motion.div>
          ) : (
            <Icon className={iconSizes[size]} />
          )}
        </>
      )}
      <span className="tabular-nums">{children}</span>
    </motion.span>
  );
}
