// Source adapted from beUI Motion Animated Badge: https://beui.dev/components/motion/animated-badge
import { motion, useReducedMotion } from "motion/react";
import { Check, Info, AlertCircle } from "lucide-react";
import type { ReactNode } from "react";
import { SPRING_PRESS } from "../../lib/ease";
import { cn } from "../../lib/utils";
export type AnimatedBadgeStatus = "info" | "success" | "warning" | "danger";
export default function AnimatedBadge({ children, status = "info", className }: { children: ReactNode; status?: AnimatedBadgeStatus; className?: string }) {
  const reduce = useReducedMotion();
  const Icon = status === "success" ? Check : status === "danger" || status === "warning" ? AlertCircle : Info;
  const styles = { info: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300", success: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300", warning: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300", danger: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300" }[status];
  return <motion.span layout whileTap={reduce ? undefined : { scale: 0.96 }} transition={SPRING_PRESS} className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold", styles, className)}><Icon className="h-3 w-3" />{children}</motion.span>;
}
