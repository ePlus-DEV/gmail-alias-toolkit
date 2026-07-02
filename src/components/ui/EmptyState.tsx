import type { ReactNode } from "react";
export default function EmptyState({
  icon,
  title,
  description,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 px-4 py-6 text-center dark:border-gray-700 dark:bg-gray-900/50">
      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-gray-400 shadow-sm dark:bg-gray-800">
        {icon}
      </div>
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
        {title}
      </p>
      {description && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
}
