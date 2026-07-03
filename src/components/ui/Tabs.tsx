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
        "flex gap-1 rounded-xl border border-border bg-muted p-1",
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
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId={`beui-tabs-${variant}`}
                className={cn(
                  "absolute inset-0 rounded-lg bg-card shadow-sm",
                  variant === "underline" &&
                    "top-auto h-0.5 rounded-full bg-primary",
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
