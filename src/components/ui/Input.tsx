import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "./utils";

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  label?: string;
  leftIcon?: ReactNode;
  onChange?: (value: string) => void;
}

export default function Input({
  label,
  leftIcon,
  className,
  onChange,
  id,
  ...props
}: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </span>
        )}
        <input
          id={id}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(
            "w-full rounded-xl border border-gray-200/90 bg-white/80 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition-all placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700/80 dark:bg-gray-800/80 dark:text-gray-100 dark:focus:border-blue-500",
            leftIcon && "pl-10",
            className,
          )}
          {...props}
        />
      </div>
    </div>
  );
}
