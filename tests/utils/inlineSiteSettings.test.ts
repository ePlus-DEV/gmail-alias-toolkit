import { describe, expect, it } from "vitest";
import {
  normalizeSiteHostname,
  parseDisabledInlineSites,
} from "../../src/utils/inlineSiteSettings";

describe("inline site settings", () => {
  it("normalizes hostnames used as per-site keys", () => {
    expect(normalizeSiteHostname(" WWW.VoidZero.DEV. ")).toBe("voidzero.dev");
  });

  it("sanitizes, deduplicates, and sorts stored sites", () => {
    expect(
      parseDisabledInlineSites([
        "www.typeform.com",
        null,
        "VOIDZERO.DEV",
        "typeform.com",
        "",
      ]),
    ).toEqual(["typeform.com", "voidzero.dev"]);
  });

  it("handles invalid legacy storage values", () => {
    expect(parseDisabledInlineSites({ site: "voidzero.dev" })).toEqual([]);
  });
});
