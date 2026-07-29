import { normalizeHostname } from "../utils/hostnameNormalizer";
import {
  generateAlias,
  getAccountStorageKey,
  isAliasForAccount,
} from "../../entrypoints/popup/utils";

interface WebsiteAliasEntry {
  alias: string;
  timestamp: number;
  generatedCount: number;
}

type WebsiteAliasMap = Record<string, WebsiteAliasEntry>;

/**
 * Get storage key for website alias map for a given email.
 */
function getWebsiteAliasMapKey(email: string): string {
  return getAccountStorageKey(email, "website_alias_map");
}

/**
 * Retrieve the website alias map for an email account.
 */
export async function getWebsiteAliasMap(
  email: string,
): Promise<WebsiteAliasMap> {
  const key = getWebsiteAliasMapKey(email);
  const result = await browser.storage.local.get([key]);
  return (result[key] as WebsiteAliasMap) || {};
}

/**
 * Save a website-to-alias mapping.
 */
export async function saveWebsiteAlias(
  email: string,
  normalizedHostname: string,
  alias: string,
): Promise<void> {
  if (!normalizedHostname || !alias) return;

  const map = await getWebsiteAliasMap(email);
  const key = getWebsiteAliasMapKey(email);

  map[normalizedHostname] = {
    alias,
    timestamp: Date.now(),
    generatedCount: (map[normalizedHostname]?.generatedCount || 0) + 1,
  };

  await browser.storage.local.set({ [key]: map });
}

/**
 * Get the previously used alias for a website (if any).
 */
export async function getPreviousAliasForWebsite(
  email: string,
  urlOrHostname: string,
): Promise<{ alias: string; timestamp: number } | null> {
  const normalized = normalizeHostname(urlOrHostname);
  if (!normalized) return null;

  const map = await getWebsiteAliasMap(email);
  const entry = map[normalized];

  if (!entry || !isAliasForAccount(entry.alias, email)) return null;
  return { alias: entry.alias, timestamp: entry.timestamp };
}

/**
 * Generate alias suggestions for a website.
 * Returns 3–5 suggestions based on the normalized hostname and random formats.
 */
export async function generateSuggestionsForWebsite(
  baseEmail: string,
  urlOrHostname: string,
): Promise<string[]> {
  const normalized = normalizeHostname(urlOrHostname);
  if (!normalized || !generateAlias(baseEmail, normalized)) return [];

  const suggestions: string[] = [];

  /** Adds a valid plus-addressed alias while preserving the active account domain. */
  function appendSuggestion(tag: string): void {
    const alias = generateAlias(baseEmail, tag);
    if (alias) suggestions.push(alias);
  }

  // 1. Simple: base+normalized@configured-domain
  appendSuggestion(normalized);

  // 2. Counter: base+normalized001@configured-domain
  const map = await getWebsiteAliasMap(baseEmail);
  const count = map[normalized]?.generatedCount || 0;
  if (count > 0) {
    appendSuggestion(`${normalized}${String(count + 1).padStart(3, "0")}`);
  }

  // 3. Short: base+first-3-letters@configured-domain
  appendSuggestion(normalized.slice(0, 3));

  // 4. With date: base+normalized-YYYYMMDD@configured-domain
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  appendSuggestion(`${normalized}-${today}`);

  // 5. Random suffix: base+normalized-XXXX@configured-domain
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  appendSuggestion(`${normalized}-${randomSuffix}`);

  return suggestions.slice(0, 5);
}

/**
 * Clear all website alias mappings for an email (used for reset/import).
 */
export async function clearWebsiteAliasMap(email: string): Promise<void> {
  const key = getWebsiteAliasMapKey(email,);
  await browser.storage.local.remove([key]);
}
