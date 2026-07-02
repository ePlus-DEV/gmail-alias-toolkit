import type { ReactNode } from "react";
export interface SectionHeaderProps { title: string; description?: string; action?: ReactNode; }
export default function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return <div className="flex items-start justify-between gap-3"><div><h2 className="text-sm font-bold text-gray-950 dark:text-gray-50">{title}</h2>{description && <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{description}</p>}</div>{action}</div>;
}
