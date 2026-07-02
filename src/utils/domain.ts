const SPECIAL_DOMAIN_MAP: Record<string, string> = {
  "accounts.google.com": "google",
  "mail.google.com": "gmail",
  "login.microsoftonline.com": "microsoft",
  "account.live.com": "microsoft",
  "github.com": "github",
  "gitlab.com": "gitlab",
  "bitbucket.org": "bitbucket",
  "dashboard.stripe.com": "stripe",
  "app.vercel.com": "vercel",
  "app.netlify.com": "netlify",
  "m.facebook.com": "facebook",
};
const COMMON_SUBDOMAINS = new Set([
  "www",
  "m",
  "mobile",
  "login",
  "account",
  "accounts",
  "auth",
  "app",
  "dashboard",
  "seller",
  "admin",
  "mail",
  "portal",
  "console",
]);
const BLOCKED = [
  "chrome://",
  "edge://",
  "about:",
  "file://",
  "chrome-extension://",
  "moz-extension://",
  "devtools://",
];
export function isSupportedPageUrl(url?: string): boolean {
  return !!url && !BLOCKED.some((p) => url.startsWith(p));
}
export function getHostnameFromUrl(url: string): string | null {
  try {
    if (!isSupportedPageUrl(url)) return null;
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}
export function normalizeDomain(hostname: string): string {
  const host = hostname.toLowerCase().replace(/^www\./, "");
  if (SPECIAL_DOMAIN_MAP[host]) return SPECIAL_DOMAIN_MAP[host];
  const parts = host.split(".").filter(Boolean);
  if (parts.length < 2) return host.replace(/[^a-z0-9-]/g, "");
  let candidate = parts[parts.length - 2];
  if (parts.length >= 3 && COMMON_SUBDOMAINS.has(parts[0]))
    candidate = parts[parts.length - 2];
  if (parts.length >= 3 && COMMON_SUBDOMAINS.has(candidate))
    candidate = parts[parts.length - 3];
  return candidate.replace(/[^a-z0-9-]/g, "");
}
