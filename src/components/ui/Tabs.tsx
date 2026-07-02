import type { ReactNode } from "react";
import { cn } from "./utils";
export interface TabItem<T extends string> {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
}
export interface TabsProps<T extends string> {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
}
export default function Tabs<T extends string>({
  items,
  value,
  onChange,
}: TabsProps<T>) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-2xl border border-gray-200/80 bg-gray-100/80 p-1 dark:border-gray-700/80 dark:bg-gray-950/40">
      {items.map((item) => (
        <button
          type="button"
          key={item.value}
          onClick={() => onChange(item.value)}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-semibold transition-all",
            value === item.value
              ? "bg-white text-blue-700 shadow-sm dark:bg-gray-800 dark:text-blue-300"
              : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200",
          )}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}
