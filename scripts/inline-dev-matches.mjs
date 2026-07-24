import { loadEnv } from "vite";

export const DEFAULT_INLINE_DEV_MATCHES = [
  "*://*.miro.com/*",
  "*://selfh.st/*",
  "*://gumroad.com/*",
];

/** Adds comma- or whitespace-separated development match patterns. */
export function parseInlineDevMatches(value) {
  const extraMatches = (value ?? "")
    .split(/[\s,]+/)
    .map((match) => match.trim())
    .filter(Boolean);

  return [...new Set([...DEFAULT_INLINE_DEV_MATCHES, ...extraMatches])];
}

/** Loads inline-helper development matches from WXT's mode-specific env files. */
export function resolveInlineDevMatches(mode, envDir = process.cwd()) {
  const env = loadEnv(mode, envDir, "WXT_");
  return parseInlineDevMatches(env.WXT_INLINE_DEV_MATCHES);
}
