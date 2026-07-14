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
    expect(normalizeHostname("example.anyfuturetld")).toBe("example");
  });

  it("handles compound and private public suffixes", () => {
    expect(normalizeHostname("https://shop.example.co.uk/account")).toBe(
      "example",
    );
    expect(normalizeHostname("https://shop.example.com.au/account")).toBe(
      "example",
    );
    expect(normalizeHostname("https://alice.github.io/project")).toBe("alice");
  });

  it("accepts raw hostnames, localhost, IPs, and IDN punycode", () => {
    expect(normalizeHostname("example.dev")).toBe("example");
    expect(normalizeHostname("localhost:3000")).toBe("localhost");
    expect(normalizeHostname("https://127.0.0.1:3000")).toBe("local");
    expect(normalizeHostname("https://xn--mnchen-3ya.de")).toBe(
      "xnmnchen3ya",
    );
  });

  it("rejects invalid input", () => {
    expect(normalizeHostname("not a valid.host")).toBeNull();
  });
});
