import { describe, expect, it } from "vitest";
import {
  filterDisabledInlineSites,
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

  it("filters disabled sites with normalized partial hostnames", () => {
    const sites = ["accounts.google.com", "github.com", "mail.google.com"];

    expect(filterDisabledInlineSites(sites, " WWW.GOOGLE. ")).toEqual([
      "accounts.google.com",
      "mail.google.com",
    ]);
  });

  it("returns all disabled sites for an empty search", () => {
    const sites = ["github.com", "typeform.com"];

    expect(filterDisabledInlineSites(sites, "   ")).toBe(sites);
  });
});
