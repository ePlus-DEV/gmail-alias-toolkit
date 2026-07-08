/**
 * Normalizes a URL/hostname to a clean keyword for alias generation.
 * Examples: shopee.com.vn → "shopee", github.com → "github", api.github.com → "github"
 */

const COMMON_SUBDOMAINS = new Set([
  "www",
  "mail",
  "api",
  "staging",
  "dev",
  "test",
  "prod",
  "app",
  "m",
  "mobile",
  "admin",
  "server",
]);

const TLDS = new Set([
  "com",
  "vn",
  "co.uk",
  "co.jp",
  "fr",
  "de",
  "it",
  "es",
  "ru",
  "cn",
  "in",
  "io",
  "net",
  "org",
  "gov",
  "edu",
  "co",
  "au",
  "ca",
  "nz",
]);

/**
 * Extract hostname from URL string.
 */
function extractHostname(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
}

/**
 * Check if a string is an IP address.
 */
function isIpAddress(hostname: string): boolean {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname === "localhost";
}

/**
 * Get TLD from hostname. Handles compound TLDs like co.uk.
 */
function getTLD(hostname: string): string | null {
  const parts = hostname.split(".").reverse();
  if (parts.length < 2) return null;

  if (TLDS.has(`${parts[1]}.${parts[0]}`) && parts.length >= 3) {
    return `${parts[1]}.${parts[0]}`;
  }

  return TLDS.has(parts[0]) ? parts[0] : null;
}

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

  let hostname = urlOrHostname.toLowerCase().trim();

  // Try to extract hostname from URL
  if (hostname.includes("://") || hostname.includes(".")) {
    const extracted = extractHostname(hostname);
    if (!extracted) return null;
    hostname = extracted;
  }

  // Remove port
  hostname = hostname.split(":")[0];

  // Handle IP or localhost
  if (isIpAddress(hostname)) {
    return hostname === "localhost" ? "localhost" : "local";
  }

  const parts = hostname.split(".").filter(Boolean);
  if (parts.length === 0) return null;

  // Get TLD
  const tld = getTLD(hostname);
  if (!tld) {
    // No recognized TLD, return the full hostname if it's short enough
    return parts.length === 1 ? parts[0] : null;
  }

  // Remove TLD and get domain parts
  const domainParts = parts.slice(0, -tld.split(".").length);
  if (domainParts.length === 0) return null;

  // Remove common subdomains from the end
  while (
    domainParts.length > 0 &&
    COMMON_SUBDOMAINS.has(domainParts[domainParts.length - 1])
  ) {
    domainParts.pop();
  }

  // Get the main domain (rightmost label)
  const mainDomain = domainParts[domainParts.length - 1];
  if (!mainDomain) return null;

  // Clean: lowercase + alphanumeric only
  return mainDomain.replace(/[^a-z0-9]/g, "") || null;
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
