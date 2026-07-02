import type { SelectHTMLAttributes } from "react";
import { cn } from "./utils";
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> { label?: string; }
export default function Select({ label, className, id, children, ...props }: SelectProps) {
  return <div className="space-y-1.5">{label && <label htmlFor={id} className="block text-xs font-semibold text-gray-700 dark:text-gray-300">{label}</label>}<select id={id} className={cn("w-full appearance-none rounded-xl border border-gray-200/90 bg-white/80 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700/80 dark:bg-gray-800/80 dark:text-gray-100", className)} {...props}>{children}</select></div>;
}
