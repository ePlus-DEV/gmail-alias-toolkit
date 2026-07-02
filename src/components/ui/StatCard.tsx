import type { ReactNode } from "react";
export default function StatCard({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: ReactNode;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white/70 p-3 shadow-sm dark:border-gray-700/80 dark:bg-gray-800/60">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-violet-50 text-blue-600 dark:from-blue-950/60 dark:to-violet-950/60 dark:text-blue-300">
        {icon}
      </div>
      <div className="text-xl font-bold text-gray-950 dark:text-gray-50">
        {value}
      </div>
      <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
        {label}
      </div>
    </div>
  );
}
