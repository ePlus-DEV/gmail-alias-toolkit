import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getAccountStorageKey,
  getLegacyAccountStorageKey,
  generateAlias,
  generateRandomString,
  validateEmail,
  generateDotVariations,
  getDotVariationCandidates,
  filterAliases,
} from "./utils";

// ─── getAccountStorageKey ────────────────────────────────────────────────────

describe("getAccountStorageKey", () => {
  it("encodes the email so it round-trips uniquely", () => {
    expect(getAccountStorageKey("user@gmail.com", "history")).toBe(
      "history_user%40gmail.com",
    );
  });

  it("handles dots in username", () => {
    expect(getAccountStorageKey("first.last@gmail.com", "stats")).toBe(
      "stats_first.last%40gmail.com",
    );
  });

  it("handles plus signs", () => {
    expect(getAccountStorageKey("user+tag@gmail.com", "fav")).toBe(
      "fav_user%2Btag%40gmail.com",
    );
  });

  it("handles googlemail domain", () => {
    expect(getAccountStorageKey("user@googlemail.com", "history")).toBe(
      "history_user%40googlemail.com",
    );
  });

  it("preserves alphanumeric chars", () => {
    expect(getAccountStorageKey("abc123@test.com", "key")).toBe(
      "key_abc123%40test.com",
    );
  });

  it("does not collide for emails that would collide under the old sanitizer", () => {
    const dottedKey = getAccountStorageKey("user.name@gmail.com", "history");
    const underscoreKey = getAccountStorageKey(
      "user_name@gmail.com",
      "history",
    );
    expect(dottedKey).not.toBe(underscoreKey);
  });

  it("normalizes case so the same account always maps to the same key", () => {
    expect(getAccountStorageKey("User@Gmail.com", "history")).toBe(
      getAccountStorageKey("user@gmail.com", "history"),
    );
  });
});

describe("getLegacyAccountStorageKey", () => {
  it("keeps the old sanitized format for migration lookups", () => {
    expect(getLegacyAccountStorageKey("user.name@gmail.com", "history")).toBe(
      "history_user_name_gmail_com",
    );
  });

  it("does not trim or lowercase legacy keys", () => {
    expect(getLegacyAccountStorageKey(" User@Gmail.com ", "stats")).toBe(
      "stats__User_Gmail_com_",
    );
  });
});

// ─── generateAlias ───────────────────────────────────────────────────────────

describe("generateAlias", () => {
  it("generates alias with plus tag", () => {
    expect(generateAlias("user@gmail.com", "shopping")).toBe(
      "user+shopping@gmail.com",
    );
  });

  it("returns null for missing @ sign", () => {
    expect(generateAlias("notanemail", "tag")).toBeNull();
  });

  it("returns null for email with more than one @ sign", () => {
    expect(generateAlias("user@gmail.com@example.com", "tag")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(generateAlias("", "tag")).toBeNull();
  });

  it("trims surrounding whitespace from the base email", () => {
    expect(generateAlias(" user@gmail.com ", "tag")).toBe("user+tag@gmail.com");
  });

  it("preserves dots in username", () => {
    expect(generateAlias("first.last@gmail.com", "work")).toBe(
      "first.last+work@gmail.com",
    );
  });

  it("handles googlemail domain", () => {
    expect(generateAlias("user@googlemail.com", "test")).toBe(
      "user+test@googlemail.com",
    );
  });

  it("handles hyphenated tags", () => {
    expect(generateAlias("user@gmail.com", "private-mail-abc1")).toBe(
      "user+private-mail-abc1@gmail.com",
    );
  });
});

// ─── generateRandomString ────────────────────────────────────────────────────

describe("generateRandomString", () => {
  beforeEach(() => {
    vi.spyOn(Math, "random").mockReturnValue(0);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("private-mail format starts with private-mail- and has 4 chars", () => {
    const result = generateRandomString("private-mail");
    expect(result).toMatch(/^private-mail-[a-z0-9]{4}$/);
  });

  it("alphanumeric format has exactly 8 chars", () => {
    const result = generateRandomString("alphanumeric");
    expect(result).toMatch(/^[a-z0-9]{8}$/);
  });

  it("words format matches adj-noun-num pattern", () => {
    const result = generateRandomString("words");
    expect(result).toMatch(/^[a-z]+-[a-z]+-\d+$/);
  });

  it("timestamp format is a non-empty base36 string", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T00:00:00Z"));
    const result = generateRandomString("timestamp", 0);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
    vi.useRealTimers();
  });

  it("timestamp format uses index offset for uniqueness", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T00:00:00Z"));
    const first = generateRandomString("timestamp", 0);
    const second = generateRandomString("timestamp", 1);
    expect(first).not.toBe(second);
    vi.useRealTimers();
  });
});

// ─── validateEmail ───────────────────────────────────────────────────────────

describe("validateEmail", () => {
  it("rejects empty string", () => {
    expect(validateEmail("")).toMatchObject({
      isValid: false,
      error: "Email is required",
    });
  });

  it("rejects whitespace-only string", () => {
    expect(validateEmail("   ")).toMatchObject({
      isValid: false,
      error: "Email is required",
    });
  });

  it("rejects email without @", () => {
    expect(validateEmail("notanemail")).toMatchObject({
      isValid: false,
      error: "Please enter a valid email address",
    });
  });

  it("rejects invalid format (no domain)", () => {
    expect(validateEmail("user@")).toMatchObject({ isValid: false });
  });

  it("rejects domain without dot", () => {
    expect(validateEmail("user@localhost")).toMatchObject({ isValid: false });
  });

  it("accepts valid gmail address", () => {
    expect(validateEmail("user@gmail.com")).toMatchObject({ isValid: true });
  });

  it("accepts a one-character gmail username", () => {
    expect(validateEmail("a@gmail.com")).toMatchObject({ isValid: true });
  });

  it("trims surrounding whitespace before validation", () => {
    expect(validateEmail(" user@gmail.com ")).toMatchObject({ isValid: true });
  });

  it("rejects email with more than one @ sign", () => {
    expect(validateEmail("user@gmail.com@example.com")).toMatchObject({
      isValid: false,
    });
  });

  it("accepts googlemail domain", () => {
    expect(validateEmail("user@googlemail.com")).toMatchObject({
      isValid: true,
    });
  });

  it("accepts dotted gmail username", () => {
    expect(validateEmail("first.last@gmail.com")).toMatchObject({
      isValid: true,
    });
  });

  it("warns but allows non-gmail addresses", () => {
    const result = validateEmail("user@yahoo.com");
    expect(result.isValid).toBe(true);
    expect(result.warning).toContain("⚠️");
  });
});

// ─── generateDotVariations ───────────────────────────────────────────────────

describe("generateDotVariations", () => {
  it("returns empty array for single-char username", () => {
    expect(generateDotVariations("a")).toEqual([]);
  });

  it("generates sequential single-dot variations", () => {
    const result = generateDotVariations("abc", 10, false);
    expect(result).toContain("a.bc");
    expect(result).toContain("ab.c");
  });

  it("generates double-dot variations for 4+ char usernames", () => {
    const result = generateDotVariations("abcd", 20, false);
    const doubleDot = result.filter(
      (v: string) => (v.match(/\./g) || []).length === 2,
    );
    expect(doubleDot.length).toBeGreaterThan(0);
  });

  it("respects count limit", () => {
    const result = generateDotVariations("abcdefghij", 3, false);
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it("deduplicates results", () => {
    const result = generateDotVariations("abcd", 20, false);
    const unique = new Set(result);
    expect(unique.size).toBe(result.length);
  });

  it("all variations contain the original chars (no additions)", () => {
    const result = generateDotVariations("abc", 10, false);
    result.forEach((v: string) => {
      expect(v.replace(/\./g, "")).toBe("abc");
    });
  });

  it("random mode returns requested count", () => {
    const result = generateDotVariations("abcdefg", 5, true);
    expect(result.length).toBeLessThanOrEqual(5);
  });
});

describe("getDotVariationCandidates", () => {
  it("returns dot variations when they exist", () => {
    expect(getDotVariationCandidates("abc", 10, false)).toEqual([
      "a.bc",
      "ab.c",
    ]);
  });

  it("falls back to the original username for a one-character username", () => {
    expect(getDotVariationCandidates("a", 10, false)).toEqual(["a"]);
  });
});

// ─── filterAliases ───────────────────────────────────────────────────────────

describe("filterAliases", () => {
  const aliases = [
    { email: "user+shopping@gmail.com", timestamp: 3000 },
    { email: "user+work@gmail.com", timestamp: 2000 },
    { email: "user+spam@gmail.com", timestamp: 1000 },
  ];

  it("returns all aliases with no filters", () => {
    const result = filterAliases(aliases, {
      viewMode: "all",
      favorites: [],
      searchQuery: "",
      filterTag: "all",
      sortBy: "recent",
    });
    expect(result).toHaveLength(3);
  });

  it("filters by search query (case-insensitive)", () => {
    const result = filterAliases(aliases, {
      viewMode: "all",
      favorites: [],
      searchQuery: "SHOPPING",
      filterTag: "all",
      sortBy: "recent",
    });
    expect(result).toHaveLength(1);
    expect(result[0].email).toBe("user+shopping@gmail.com");
  });

  it("filters by tag", () => {
    const result = filterAliases(aliases, {
      viewMode: "all",
      favorites: [],
      searchQuery: "",
      filterTag: "work",
      sortBy: "recent",
    });
    expect(result).toHaveLength(1);
    expect(result[0].email).toBe("user+work@gmail.com");
  });

  it("filters favorites only", () => {
    const result = filterAliases(aliases, {
      viewMode: "favorites",
      favorites: ["user+work@gmail.com"],
      searchQuery: "",
      filterTag: "all",
      sortBy: "recent",
    });
    expect(result).toHaveLength(1);
    expect(result[0].email).toBe("user+work@gmail.com");
  });

  it("sorts by recent (descending timestamp)", () => {
    const result = filterAliases(aliases, {
      viewMode: "all",
      favorites: [],
      searchQuery: "",
      filterTag: "all",
      sortBy: "recent",
    });
    expect(result[0].email).toBe("user+shopping@gmail.com");
    expect(result[2].email).toBe("user+spam@gmail.com");
  });

  it("sorts alphabetically", () => {
    const result = filterAliases(aliases, {
      viewMode: "all",
      favorites: [],
      searchQuery: "",
      filterTag: "all",
      sortBy: "alphabetical",
    });
    expect(result[0].email).toBe("user+shopping@gmail.com");
    expect(result[1].email).toBe("user+spam@gmail.com");
    expect(result[2].email).toBe("user+work@gmail.com");
  });

  it("returns empty when search matches nothing", () => {
    const result = filterAliases(aliases, {
      viewMode: "all",
      favorites: [],
      searchQuery: "xyz-no-match",
      filterTag: "all",
      sortBy: "recent",
    });
    expect(result).toHaveLength(0);
  });
});
