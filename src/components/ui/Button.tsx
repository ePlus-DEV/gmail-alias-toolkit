import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "./utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg" | "icon";
  fullWidth?: boolean;
  icon?: ReactNode;
}

export default function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  type = "button",
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-soft hover:from-blue-700 hover:to-violet-700 focus-visible:ring-blue-500",
    secondary:
      "border border-gray-200/80 bg-white/80 text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700/80 dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-700/80 focus-visible:ring-gray-400",
    ghost:
      "text-gray-600 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:bg-gray-800/80 focus-visible:ring-gray-400",
    danger:
      "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/50 focus-visible:ring-red-500",
    success:
      "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/50 focus-visible:ring-emerald-500",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base",
    icon: "h-10 w-10 p-0",
  };

  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-gray-950",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        props.disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
