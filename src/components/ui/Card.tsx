import type { HTMLAttributes } from "react";
import { cn } from "./utils";
export default function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/70 bg-white/80 shadow-soft backdrop-blur dark:border-gray-700/70 dark:bg-gray-900/70",
        className,
      )}
      {...props}
    />
  );
}
