import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getWebsiteAliasMap,
  saveWebsiteAlias,
  getPreviousAliasForWebsite,
  generateSuggestionsForWebsite,
  clearWebsiteAliasMap,
} from "../../src/services/websiteAliasService";

// Mock the browser storage API
const mockStorageData: Record<string, unknown> = {};

type MockBrowser = {
  storage: {
    local: {
      get: ReturnType<typeof vi.fn>;
      set: ReturnType<typeof vi.fn>;
      remove: ReturnType<typeof vi.fn>;
    };
  };
};

type ImportOriginal = <T>() => Promise<T>;

vi.stubGlobal("browser", {
  storage: {
    local: {
      get: vi.fn((keys: string[]) => {
        const result: Record<string, unknown> = {};
        keys.forEach((key) => {
          if (key in mockStorageData) {
            result[key] = mockStorageData[key];
          }
        });
        return Promise.resolve(result);
      }),
      set: vi.fn((data: Record<string, unknown>) => {
        Object.assign(mockStorageData, data);
        return Promise.resolve();
      }),
      remove: vi.fn((keys: string[]) => {
        keys.forEach((key) => {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete mockStorageData[key];
        });
        return Promise.resolve();
      }),
    },
  },
} as unknown as MockBrowser);

/** Builds deterministic account-scoped storage keys for service tests. */
function getMockAccountStorageKey(email: string, suffix: string): string {
  return `${email}:${suffix}`;
}

/** Keeps real alias utilities while replacing account storage key generation. */
async function createPopupUtilsMock(importOriginal: ImportOriginal) {
  const original = await importOriginal<
    typeof import("../../entrypoints/popup/utils")
  >();

  return {
    ...original,
    getAccountStorageKey: getMockAccountStorageKey,
  };
}

vi.mock("../../entrypoints/popup/utils", createPopupUtilsMock);

describe("websiteAliasService", () => {
  const testEmail = "user@gmail.com";
  const testUrl = "https://github.com/user/repo";
  const testAlias = "user+github@gmail.com";

  beforeEach(() => {
    // Clear mock storage before each test
    Object.keys(mockStorageData).forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete mockStorageData[key];
    });
    vi.clearAllMocks();
  });

  describe("getWebsiteAliasMap", () => {
    it("returns empty object for new email", async () => {
      const map = await getWebsiteAliasMap(testEmail);
      expect(map).toEqual({});
    });

    it("retrieves stored website alias map", async () => {
      const storedMap = {
        github: { alias: testAlias, timestamp: 12345, generatedCount: 1 },
      };
      mockStorageData[`${testEmail}:website_alias_map`] = storedMap;

      const map = await getWebsiteAliasMap(testEmail);
      expect(map).toEqual(storedMap);
    });
  });

  describe("saveWebsiteAlias", () => {
    it("saves a website alias with metadata", async () => {
      const beforeTime = Date.now();
      await saveWebsiteAlias(testEmail, "github", testAlias);
      const afterTime = Date.now();

      const map = await getWebsiteAliasMap(testEmail);
      const entry = map.github;

      expect(entry).toBeDefined();
      expect(entry.alias).toBe(testAlias);
      expect(entry.generatedCount).toBe(1);
      expect(entry.timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(entry.timestamp).toBeLessThanOrEqual(afterTime);
    });

    it("increments generatedCount on repeated saves", async () => {
      await saveWebsiteAlias(testEmail, "github", "alias1@gmail.com");
      await saveWebsiteAlias(testEmail, "github", "alias2@gmail.com");
      await saveWebsiteAlias(testEmail, "github", "alias3@gmail.com");

      const map = await getWebsiteAliasMap(testEmail);
      expect(map.github.generatedCount).toBe(3);
      expect(map.github.alias).toBe("alias3@gmail.com"); // Latest alias
    });

    it("ignores empty hostname or alias", async () => {
      await saveWebsiteAlias(testEmail, "", testAlias);
      await saveWebsiteAlias(testEmail, "github", "");

      const map = await getWebsiteAliasMap(testEmail);
      expect(Object.keys(map)).toHaveLength(0);
    });

    it("handles multiple websites independently", async () => {
      await saveWebsiteAlias(testEmail, "github", "user+github@gmail.com");
      await saveWebsiteAlias(testEmail, "twitter", "user+twitter@gmail.com");
      await saveWebsiteAlias(testEmail, "linkedin", "user+linkedin@gmail.com");

      const map = await getWebsiteAliasMap(testEmail);
      expect(Object.keys(map)).toHaveLength(3);
      expect(map.github.alias).toBe("user+github@gmail.com");
      expect(map.twitter.alias).toBe("user+twitter@gmail.com");
      expect(map.linkedin.alias).toBe("user+linkedin@gmail.com");
    });
  });

  describe("getPreviousAliasForWebsite", () => {
    /** Verifies that a stored Gmail alias cannot leak into a Workspace account. */
    async function assertCrossAccountAliasIsIgnored(): Promise<void> {
      const workspaceEmail = "nguyen.minh.hoang@rivercrane.vn";
      mockStorageData[`${workspaceEmail}:website_alias_map`] = {
        github: {
          alias: "nguyen.minh.hoang+github@gmail.com",
          timestamp: 12345,
          generatedCount: 1,
        },
      };

      const result = await getPreviousAliasForWebsite(workspaceEmail, testUrl);
      expect(result).toBeNull();
    }

    it("returns null for unmapped website", async () => {
      const result = await getPreviousAliasForWebsite(testEmail, "unknown.com");
      expect(result).toBeNull();
    });

    it("returns previous alias and timestamp", async () => {
      const timestamp = 12345;
      mockStorageData[`${testEmail}:website_alias_map`] = {
        github: { alias: testAlias, timestamp, generatedCount: 1 },
      };

      const result = await getPreviousAliasForWebsite(testEmail, testUrl);
      expect(result).toEqual({ alias: testAlias, timestamp });
    });

    it(
      "ignores a stale website alias owned by another account",
      assertCrossAccountAliasIsIgnored,
    );

    it("accepts both URL and hostname", async () => {
      // Save alias with normalized key "github"
      await saveWebsiteAlias(testEmail, "github", testAlias);

      // Test with full URL that normalizes to "github"
      const resultUrl = await getPreviousAliasForWebsite(
        testEmail,
        "https://github.com/user",
      );
      expect(resultUrl?.alias).toBe(testAlias);

      // Test with raw hostname
      const resultHostname = await getPreviousAliasForWebsite(
        testEmail,
        "github",
      );
      expect(resultHostname?.alias).toBe(testAlias);
    });

    it("returns null for invalid hostname", async () => {
      const result = await getPreviousAliasForWebsite(
        testEmail,
        "not a valid host",
      );
      expect(result).toBeNull();
    });
  });

  describe("generateSuggestionsForWebsite", () => {
    /** Verifies that malformed base emails never produce inline suggestions. */
    async function assertMalformedBaseEmailsAreRejected(): Promise<void> {
      const invalidEmails = [
        "invalid-email",
        "user@localhost",
        "user @gmail.com",
      ];

      for (const invalidEmail of invalidEmails) {
        const suggestions = await generateSuggestionsForWebsite(
          invalidEmail,
          "https://github.com",
        );
        expect(suggestions, invalidEmail).toEqual([]);
      }
    }

    /** Verifies that all generated suggestions retain the Workspace domain. */
    async function assertWorkspaceDomainIsPreserved(): Promise<void> {
      const workspaceEmail = "nguyen.minh.hoang@rivercrane.vn";
      const suggestions = await generateSuggestionsForWebsite(
        workspaceEmail,
        "https://github.com",
      );

      expect(suggestions).toContain(
        "nguyen.minh.hoang+github@rivercrane.vn",
      );
      for (const suggestion of suggestions) {
        expect(suggestion).toMatch(/@rivercrane\.vn$/);
      }
    }

    it("returns empty array for invalid hostname", async () => {
      const suggestions = await generateSuggestionsForWebsite(
        testEmail,
        "not a valid host",
      );
      expect(suggestions).toEqual([]);
    });

    it(
      "returns empty array for malformed base email",
      assertMalformedBaseEmailsAreRejected,
    );

    it("generates up to 5 suggestions for new website", async () => {
      const suggestions = await generateSuggestionsForWebsite(
        testEmail,
        "https://github.com",
      );

      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.length).toBeLessThanOrEqual(5);
      expect(suggestions[0]).toContain("user+github@gmail.com");
      suggestions.forEach((s) => expect(s).toMatch(/@gmail\.com$/));
    });

    it("includes counter-based suggestion only for repeat visits", async () => {
      // First visit: no counter suggestion
      let suggestions = await generateSuggestionsForWebsite(
        testEmail,
        "https://github.com",
      );
      expect(suggestions[1]).not.toMatch(/github001/);

      // Save an alias to mark it as visited
      await saveWebsiteAlias(testEmail, "github", "user+github@gmail.com");

      // Second visit: includes counter suggestion
      suggestions = await generateSuggestionsForWebsite(
        testEmail,
        "https://github.com",
      );
      expect(suggestions).toContainEqual(expect.stringMatching(/github002/));
    });

    it("includes date-based suggestion with YYYYMMDD format", async () => {
      const suggestions = await generateSuggestionsForWebsite(
        testEmail,
        "https://github.com",
      );

      const dateRegex = /github-\d{8}@gmail\.com/;
      expect(suggestions.some((s) => dateRegex.test(s))).toBe(true);
    });

    it("includes short code based on hostname", async () => {
      const suggestions = await generateSuggestionsForWebsite(
        testEmail,
        "https://github.com",
      );

      // Short code uses first 3 letters of normalized hostname (github -> git, or ghi)
      expect(
        suggestions.some((s) => s.includes("+git@") || s.includes("+ghi@")),
      ).toBe(true);
    });

    it("generates random suffix suggestions", async () => {
      const suggestions = await generateSuggestionsForWebsite(
        testEmail,
        "https://github.com",
      );

      const randomSuffixRegex = /github-[a-z0-9]{4}@gmail\.com/;
      const randomSuggestions = suggestions.filter((s) =>
        randomSuffixRegex.test(s),
      );
      expect(randomSuggestions.length).toBeGreaterThan(0);
    });

    it("limits suggestions to 5", async () => {
      const suggestions = await generateSuggestionsForWebsite(
        testEmail,
        "https://github.com",
      );

      expect(suggestions.length).toBeLessThanOrEqual(5);
    });

    it(
      "preserves the selected Google Workspace domain",
      assertWorkspaceDomainIsPreserved,
    );
  });

  describe("clearWebsiteAliasMap", () => {
    it("removes all website alias mappings for email", async () => {
      await saveWebsiteAlias(testEmail, "github", testAlias);
      await saveWebsiteAlias(testEmail, "twitter", "user+twitter@gmail.com");

      await clearWebsiteAliasMap(testEmail);

      const map = await getWebsiteAliasMap(testEmail);
      expect(map).toEqual({});
    });

    it("does not affect other emails", async () => {
      const email1 = "user1@gmail.com";
      const email2 = "user2@gmail.com";

      await saveWebsiteAlias(email1, "github", "alias1@gmail.com");
      await saveWebsiteAlias(email2, "github", "alias2@gmail.com");

      await clearWebsiteAliasMap(email1);

      const map1 = await getWebsiteAliasMap(email1);
      const map2 = await getWebsiteAliasMap(email2);

      expect(map1).toEqual({});
      expect(map2.github.alias).toBe("alias2@gmail.com");
    });
  });
});
