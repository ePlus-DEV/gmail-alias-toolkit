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
 *   "https://api.github.com" → "api.github"
 *   "shopee.com.vn" → "shopee"
 *   "mail.google.com" → "mail.google"
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

  // Preserve subdomains by removing only the public suffix
  // Examples: api.github.com → api.github, mail.google.com → mail.google
  let aliasKey: string | null = null;

  // If we have a domain without suffix (like github when visiting github.com),
  // use it directly. Otherwise, extract hostname minus the public suffix.
  if (result.domainWithoutSuffix) {
    // We have a proper domain (e.g., github.com → github)
    aliasKey = result.domainWithoutSuffix.replace(/[^a-z0-9]/g, "");
    // If there's a subdomain, prepend it (e.g., api.github.com → api.github)
    // Multiple subdomains are preserved as one unit (e.g., api.v2.example.com → api.v2.example)
    if (result.subdomain) {
      const cleanSubdomain = result.subdomain.replace(/[^a-z0-9.]/g, "");
      aliasKey = `${cleanSubdomain}.${aliasKey}`;
    }
  } else if (!result.hostname.includes(".")) {
    // Single-label hostname (e.g., "localhost", "github")
    aliasKey = result.hostname;
  }

  return aliasKey && aliasKey.length > 0 ? aliasKey : null;
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
