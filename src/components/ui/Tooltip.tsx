import type { ReactNode } from "react";
export default function Tooltip({ children, label }: { children: ReactNode; label: string }) {
  return <span className="group relative inline-flex"><span>{children}</span><span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-950 px-2 py-1 text-[11px] font-medium text-white shadow-lg group-hover:block">{label}</span></span>;
}
