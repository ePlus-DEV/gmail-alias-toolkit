// Source adapted from beUI Motion Select: https://beui.dev/components/motion/select
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { ChevronDown } from "lucide-react";
import type { ReactNode, SelectHTMLAttributes } from "react";
import { SPRING_PANEL } from "../../lib/ease";
import { cn } from "../../lib/utils";
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> { label?: string; leftIcon?: ReactNode; containerClassName?: string; }
export default function Select({ label, leftIcon, className, containerClassName, id, children, ...props }: SelectProps) {
  const reduce = useReducedMotion();
  return <div className={cn("space-y-1.5", containerClassName)}>{label && <label htmlFor={id} className="block text-xs font-semibold text-gray-700 dark:text-gray-300">{label}</label>}<motion.div whileTap={reduce ? undefined : { scale: 0.99 }} transition={SPRING_PANEL} className="relative">{leftIcon && <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-400">{leftIcon}</span>}<select id={id} className={cn("w-full appearance-none rounded-xl border border-gray-200/90 bg-white/85 px-3 py-2.5 pr-10 text-sm text-gray-900 shadow-sm outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700/80 dark:bg-gray-800/85 dark:text-gray-100", leftIcon && "pl-10", className)} {...props}>{children}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /></motion.div></div>;
}
