// Source adapted from beUI Motion Select: https://beui.dev/components/motion/select
import { motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import type { ReactNode, SelectHTMLAttributes } from "react";
import { SPRING_PANEL } from "../../lib/ease";
import { cn } from "../../lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  leftIcon?: ReactNode;
  containerClassName?: string;
  error?: string;
}

export default function Select({
  label,
  leftIcon,
  className,
  containerClassName,
  id,
  children,
  error,
  ...props
}: SelectProps) {
  const reduce = useReducedMotion();

  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <motion.div
        whileTap={reduce ? undefined : { scale: 0.99 }}
        transition={SPRING_PANEL}
        className="relative"
      >
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </span>
        )}
        <select
          id={id}
          className={cn(
            "w-full appearance-none rounded-lg border bg-white/85 px-3 py-2.5 pr-10 text-sm text-gray-900 shadow-sm outline-none transition-all dark:bg-gray-800/85 dark:text-gray-100",
            "border-gray-200/90 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700/80",
            error && "border-red-400 ring-2 ring-red-500/10 focus:border-red-400 focus:ring-red-500/20",
            leftIcon && "pl-10",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <motion.div
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          animate={error ? { rotate: 15 } : { rotate: 0 }}
          transition={SPRING_PANEL}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
      {error && (
        <p className="text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
