import packageMetadata from "../package.json";

export const LATEST_RELEASE_API_URL =
  "https://api.github.com/repos/ePlus-DEV/gmail-alias-toolkit/releases/latest";
export const RELEASE_FETCH_TIMEOUT_MS = 5_000;

const SEMVER_PATTERN =
  /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

/** Converts a GitHub release tag such as v1.3.2 into an application version. */
export function normalizeReleaseVersion(tagName: unknown): string | null {
  if (typeof tagName !== "string") return null;

  const version = tagName.trim().replace(/^v/i, "");
  return SEMVER_PATTERN.test(version) ? version : null;
}

/** Resolves the latest published GitHub release, falling back to package metadata. */
export async function resolveLatestReleaseVersion(
  fetcher: typeof fetch = fetch,
): Promise<string> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    const token = process.env.GITHUB_TOKEN?.trim();
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetcher(LATEST_RELEASE_API_URL, {
      headers,
      signal: AbortSignal.timeout(RELEASE_FETCH_TIMEOUT_MS),
    });
    if (!response.ok) return packageMetadata.version;

    const payload = (await response.json()) as { tag_name?: unknown };
    return normalizeReleaseVersion(payload.tag_name) ?? packageMetadata.version;
  } catch {
    return packageMetadata.version;
  }
}
