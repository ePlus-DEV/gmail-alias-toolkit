import { describe, expect, it } from "vitest";
import { filterAliases, validateEmail } from "../../entrypoints/popup/utils";

describe("PR review regressions", () => {
  it("accepts plus-addressed Gmail usernames", () => {
    expect(validateEmail("user+shopping@gmail.com")).toMatchObject({
      isValid: true,
    });
  });

  it("trims and normalizes a search query before filtering", () => {
    const aliases = [
      { email: "user+shopping@gmail.com", timestamp: 3000 },
      { email: "user+work@gmail.com", timestamp: 2000 },
    ];

    const result = filterAliases(aliases, {
      viewMode: "all",
      favorites: [],
      searchQuery: "  WORK  ",
      filterTag: "all",
      sortBy: "recent",
    });

    expect(result).toEqual([{ email: "user+work@gmail.com", timestamp: 2000 }]);
  });
});
