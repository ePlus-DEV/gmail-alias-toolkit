import packageMetadata from "../package.json";
import { describe, expect, it, vi } from "vitest";
import {
  LATEST_RELEASE_API_URL,
  normalizeReleaseVersion,
  resolveLatestReleaseVersion,
} from "../web/release-version";

/** Creates a minimal fetch implementation for release-version tests. */
function createFetchResponse(payload: unknown, ok = true): typeof fetch {
  return vi.fn(async () =>
    ({
      ok,
      json: async () => payload,
    }) as Response,
  ) as unknown as typeof fetch;
}

describe("GitHub release version", () => {
  it("normalizes a release tag with a leading v", () => {
    expect(normalizeReleaseVersion("v1.3.2")).toBe("1.3.2");
  });

  it("accepts semantic versions with prerelease metadata", () => {
    expect(normalizeReleaseVersion("1.4.0-beta.1")).toBe("1.4.0-beta.1");
  });

  it("rejects invalid release tags", () => {
    expect(normalizeReleaseVersion("latest")).toBeNull();
    expect(normalizeReleaseVersion(null)).toBeNull();
  });

  it("uses the latest published GitHub release tag", async () => {
    const fetcher = createFetchResponse({ tag_name: "v1.4.0" });

    await expect(resolveLatestReleaseVersion(fetcher)).resolves.toBe("1.4.0");
    expect(fetcher).toHaveBeenCalledWith(
      LATEST_RELEASE_API_URL,
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/vnd.github+json",
        }),
      }),
    );
  });

  it("falls back to package metadata when GitHub has no usable release", async () => {
    const invalidTagFetcher = createFetchResponse({ tag_name: "latest" });
    const failedResponseFetcher = createFetchResponse({}, false);
    const rejectedFetcher = vi
      .fn(async () => {
        throw new Error("offline");
      })
      .mockName("rejectedFetch") as unknown as typeof fetch;

    await expect(resolveLatestReleaseVersion(invalidTagFetcher)).resolves.toBe(
      packageMetadata.version,
    );
    await expect(resolveLatestReleaseVersion(failedResponseFetcher)).resolves.toBe(
      packageMetadata.version,
    );
    await expect(resolveLatestReleaseVersion(rejectedFetcher)).resolves.toBe(
      packageMetadata.version,
    );
  });
});
