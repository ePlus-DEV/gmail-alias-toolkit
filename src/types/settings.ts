import type { SiteAlias } from "./alias";
export interface AliasSettings {
  baseEmails: string[];
  defaultBaseEmail?: string;
  defaultAliasFormat:
    | "domain"
    | "category-domain"
    | "domain-date"
    | "domain-random"
    | "domain-purpose";
  theme: "system" | "light" | "dark";
  autoDetectCategory: boolean;
  autofillFocusedInputFirst: boolean;
  fallbackToCopyWhenNoInput: boolean;
  gmailAccountIndex: number;
}
export interface AliasStorageSchema {
  siteAliases: Record<string, SiteAlias>;
  settings: AliasSettings;
  recentAliases: SiteAlias[];
  favoriteAliases: SiteAlias[];
}
