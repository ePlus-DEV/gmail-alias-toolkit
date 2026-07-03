// Source adapted from beUI Motion Tabs: https://beui.dev/components/motion/tabs
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { SPRING_LAYOUT } from "../../lib/ease";
import { cn } from "../../lib/utils";

export interface TabItem<T extends string> {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
}
export interface TabsProps<T extends string> {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  variant?: "pill" | "segment" | "underline";
  className?: string;
}

export default function Tabs<T extends string>({
  items,
  value,
  onChange,
  variant = "segment",
  className,
}: TabsProps<T>) {
  const reduce = useReducedMotion();
  return (
    <div
      className={cn(
        "flex gap-1 rounded-xl border border-gray-200/80 bg-gray-100/80 p-1 dark:border-gray-700/80 dark:bg-gray-950/40",
        variant === "underline" && "border-0 bg-transparent p-0",
        className,
      )}
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            type="button"
            key={item.value}
            onClick={() => onChange(item.value)}
            className={cn(
              "relative flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors",
              active
                ? "text-blue-700 dark:text-blue-300"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
            )}
          >
            {active && (
              <motion.span
                layoutId={`beui-tabs-${variant}`}
                className={cn(
                  "absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-gray-800",
                  variant === "underline" &&
                    "top-auto h-0.5 rounded-full bg-blue-600 dark:bg-blue-400",
                )}
                transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              {item.icon}
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
