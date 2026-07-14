import { describe, expect, it } from "vitest";
import { normalizeHostname } from "../../src/utils/hostnameNormalizer";

describe("normalizeHostname", () => {
  it("normalizes a regular domain", () => {
    expect(normalizeHostname("https://www.github.com/path")).toBe("github");
  });

  it("supports modern TLDs that are not in the legacy allowlist", () => {
    expect(
      normalizeHostname(
        "https://voidzero.dev/posts/whats-new-jun-2026?ref=dailydev",
      ),
    ).toBe("voidzero");
    expect(normalizeHostname("https://example.app/signup")).toBe("example");
  });

  it("keeps compound TLD handling", () => {
    expect(normalizeHostname("https://shop.example.co.uk/account")).toBe(
      "example",
    );
  });

  it("rejects invalid input", () => {
    expect(normalizeHostname("not a valid.host")).toBeNull();
  });
});
