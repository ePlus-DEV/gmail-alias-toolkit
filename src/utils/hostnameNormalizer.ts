/**
 * Normalizes a URL/hostname to a clean keyword for alias generation.
 * Examples: shopee.com.vn → "shopee", github.com → "github", api.github.com → "github"
 */

import { parse } from "tldts";

/**
 * Normalize URL/hostname to a clean keyword.
 * Returns null if unable to normalize.
 *
 * Examples:
 *   "https://github.com" → "github"
 *   "https://api.github.com" → "github"
 *   "shopee.com.vn" → "shopee"
 *   "mail.google.com" → "google"
 *   "localhost:3000" → "localhost"
 */
export function normalizeHostname(urlOrHostname: string): string | null {
  if (!urlOrHostname || typeof urlOrHostname !== "string") {
    return null;
  }

  const value = urlOrHostname.toLowerCase().trim();
  const result = parse(value, { allowPrivateDomains: true });

  if (!result.hostname) return null;
  if (result.isIp) return "local";
  if (result.hostname === "localhost") return "localhost";

  // Public Suffix List parsing handles every registered TLD, compound suffixes
  // (.com.au), private suffixes (.github.io), and punycode/IDN hostnames.
  const aliasKey =
    result.domainWithoutSuffix ||
    (!result.hostname.includes(".") ? result.hostname : null);

  return aliasKey?.replace(/[^a-z0-9]/g, "") || null;
}

/**
 * Check if hostname is valid and recognized.
 */
export function isValidHostname(urlOrHostname: string): boolean {
  return normalizeHostname(urlOrHostname) !== null;
}

/**
 * Get display name for a normalized hostname.
 * Can be used to show user-friendly website names.
 */
export function getDisplayName(normalizedHostname: string): string {
  if (!normalizedHostname) return "";
  // Capitalize first letter + add spaces before uppercase (camelCase support)
  return normalizedHostname
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}
