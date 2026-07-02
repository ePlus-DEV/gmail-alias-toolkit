export type AliasStatus =
  | "normal"
  | "important"
  | "spam"
  | "leaked"
  | "inactive";
export type AliasCategory =
  | "shopping"
  | "developer"
  | "career"
  | "social"
  | "finance"
  | "travel"
  | "education"
  | "productivity"
  | "entertainment"
  | "other";
export interface SiteAlias {
  id: string;
  hostname: string;
  normalizedDomain: string;
  baseEmail: string;
  alias: string;
  category: AliasCategory;
  note?: string;
  status: AliasStatus;
  createdAt: string;
  updatedAt: string;
  lastUsedAt?: string;
  useCount: number;
}
export interface AliasSuggestion {
  alias: string;
  label: string;
  format: string;
  category?: AliasCategory;
  domainKeyword?: string;
}
