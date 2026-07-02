export type ClassValue = string | number | bigint | boolean | null | undefined;

/** Lightweight class name joiner kept local to avoid popup bundle bloat. */
export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}
