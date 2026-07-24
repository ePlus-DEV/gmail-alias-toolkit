export const INLINE_DISABLED_SITES_KEY = "inline_disabled_sites";

/** Returns a stable, human-readable key for per-site inline-helper settings. */
export function normalizeSiteHostname(hostname: string): string {
  return hostname
    .trim()
    .toLowerCase()
    .replace(/^www\./, "")
    .replace(/\.$/, "");
}

/** Sanitizes storage values written by current or older extension versions. */
export function parseDisabledInlineSites(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return Array.from(
    new Set(
      value
        .filter((site): site is string => typeof site === "string")
        .map(normalizeSiteHostname)
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b));
}

/** Filters disabled-site hostnames using the same normalization as stored values. */
export function filterDisabledInlineSites(
  sites: string[],
  query: string,
): string[] {
  const normalizedQuery = normalizeSiteHostname(query);
  if (!normalizedQuery) return sites;

  return sites.filter((site) => site.includes(normalizedQuery));
}
