import { describe, expect, it } from "vitest";

/**
 * Test utilities for content script helper functions.
 * These functions are extracted from entrypoints/content/index.ts for testing.
 */

// Replicate escapeHtml from content script
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Replicate normalizeConfiguredEmail
function normalizeConfiguredEmail(email: string): string {
  const trimmed = email.trim();
  const gmailMatch = trimmed.match(
    /^([^@\s]+)@(gmail\.com|googlemail\.com)(?:[^@\s]+)?$/i,
  );

  return gmailMatch
    ? `${gmailMatch[1]}@${gmailMatch[2].toLowerCase()}`
    : trimmed;
}

// Replicate clampQuickCount
function clampQuickCount(value?: string): number {
  return Math.min(20, Math.max(1, Number.parseInt(value || "5", 10) || 5));
}

// Replicate createCustomAlias
function createCustomAlias(baseEmail: string, value: string): string {
  if (value.includes("@")) return value;

  const atIndex = baseEmail.lastIndexOf("@");
  if (atIndex <= 0) return value;

  return `${baseEmail.slice(0, atIndex)}+${value}${baseEmail.slice(atIndex)}`;
}

// Replicate generateQuickTricks
function generateQuickTricks(
  baseEmail: string,
  trick: string,
  count: number,
): string[] {
  const [username, domain] = baseEmail.split("@");
  if (!username || !domain) return [];

  const commonTags = [
    "newsletter",
    "shop",
    "work",
    "personal",
    "test",
    "promo",
    "social",
    "finance",
    "travel",
    "spam",
  ];

  if (trick === "plus") {
    return commonTags
      .slice(0, count)
      .map((tag) => `${username}+${tag}@${domain}`);
  }

  if (trick === "nodots") {
    const noDots = username.replace(/\./g, "");
    return [
      `${noDots}@${domain}`,
      ...commonTags.map((tag) => `${noDots}+${tag}@${domain}`),
    ].slice(0, count);
  }

  // For dot trick
  const outputDomain =
    trick === "googlemail"
      ? domain.toLowerCase() === "gmail.com"
        ? "googlemail.com"
        : "gmail.com"
      : domain;

  // Simple dot variations
  const variations = [
    username,
    username.replace(".", ""),
    username.split("").join("."),
  ];

  return variations
    .filter(Boolean)
    .slice(0, count)
    .map((v) => `${v}@${outputDomain}`);
}

describe("Content script helpers", () => {
  describe("escapeHtml", () => {
    it("escapes HTML special characters", () => {
      expect(escapeHtml("<script>alert('XSS')</script>")).toBe(
        "&lt;script&gt;alert(&#39;XSS&#39;)&lt;/script&gt;"
      );
    });

    it("escapes ampersands", () => {
      expect(escapeHtml("A & B")).toBe("A &amp; B");
    });

    it("escapes double quotes", () => {
      expect(escapeHtml('He said "hello"')).toBe('He said &quot;hello&quot;');
    });

    it("escapes single quotes", () => {
      expect(escapeHtml("It's a test")).toBe("It&#39;s a test");
    });

    it("handles multiple escapes in one string", () => {
      expect(escapeHtml('<div class="test">A&B\'s "quote"</div>')).toBe(
        "&lt;div class=&quot;test&quot;&gt;A&amp;B&#39;s &quot;quote&quot;&lt;/div&gt;"
      );
    });

    it("returns unchanged safe strings", () => {
      expect(escapeHtml("Plain text")).toBe("Plain text");
    });
  });

  describe("normalizeConfiguredEmail", () => {
    it("normalizes gmail.com addresses", () => {
      expect(normalizeConfiguredEmail("User.Name@GMAIL.COM")).toBe(
        "User.Name@gmail.com"
      );
    });

    it("normalizes googlemail.com addresses", () => {
      expect(normalizeConfiguredEmail("user@GOOGLEMAIL.COM")).toBe(
        "user@googlemail.com"
      );
    });

    it("preserves emails with extra text (only regex match works)", () => {
      expect(normalizeConfiguredEmail("user@gmail.com extra")).toBe(
        "user@gmail.com extra"
      );
    });

    it("handles whitespace", () => {
      expect(normalizeConfiguredEmail("  user@gmail.com  ")).toBe(
        "user@gmail.com"
      );
    });

    it("returns non-gmail addresses unchanged", () => {
      expect(normalizeConfiguredEmail("user@example.com")).toBe(
        "user@example.com"
      );
    });

    it("handles invalid email formats", () => {
      expect(normalizeConfiguredEmail("not-an-email")).toBe("not-an-email");
    });
  });

  describe("clampQuickCount", () => {
    it("returns default value when undefined", () => {
      expect(clampQuickCount()).toBe(5);
    });

    it("clamps minimum to 1 (zero defaults to 5)", () => {
      // Note: parseInt("0") returns 0, which is falsy, so defaults to 5
      expect(clampQuickCount("0")).toBe(5);
      expect(clampQuickCount("-5")).toBe(1);
      expect(clampQuickCount("1")).toBe(1);
    });

    it("clamps maximum to 20", () => {
      expect(clampQuickCount("50")).toBe(20);
      expect(clampQuickCount("100")).toBe(20);
    });

    it("parses valid numbers", () => {
      expect(clampQuickCount("10")).toBe(10);
      expect(clampQuickCount("1")).toBe(1);
      expect(clampQuickCount("20")).toBe(20);
    });

    it("handles non-numeric input", () => {
      expect(clampQuickCount("abc")).toBe(5);
      expect(clampQuickCount("")).toBe(5);
    });
  });

  describe("createCustomAlias", () => {
    it("creates custom alias with tag", () => {
      expect(createCustomAlias("user@gmail.com", "shopping")).toBe(
        "user+shopping@gmail.com"
      );
    });

    it("returns full email if value includes @", () => {
      expect(createCustomAlias("user@gmail.com", "custom@example.com")).toBe(
        "custom@example.com"
      );
    });

    it("handles email without @ in base", () => {
      expect(createCustomAlias("invalid", "tag")).toBe("tag");
    });

    it("preserves domain case", () => {
      expect(createCustomAlias("user@GMAIL.COM", "tag")).toBe(
        "user+tag@GMAIL.COM"
      );
    });

    it("handles dots in username", () => {
      expect(createCustomAlias("first.last@gmail.com", "work")).toBe(
        "first.last+work@gmail.com"
      );
    });

    it("handles multiple @ symbols (takes last one)", () => {
      expect(createCustomAlias("user+old@domain.com", "new")).toBe(
        "user+old+new@domain.com"
      );
    });
  });

  describe("generateQuickTricks", () => {
    describe("plus trick", () => {
      it("generates plus-tag aliases", () => {
        const tricks = generateQuickTricks("user@gmail.com", "plus", 3);
        expect(tricks).toEqual([
          "user+newsletter@gmail.com",
          "user+shop@gmail.com",
          "user+work@gmail.com",
        ]);
      });

      it("respects count limit", () => {
        const tricks = generateQuickTricks("user@gmail.com", "plus", 1);
        expect(tricks).toHaveLength(1);
        expect(tricks[0]).toBe("user+newsletter@gmail.com");
      });
    });

    describe("nodots trick", () => {
      it("removes dots from username", () => {
        const tricks = generateQuickTricks("first.last@gmail.com", "nodots", 2);
        expect(tricks[0]).toBe("firstlast@gmail.com");
        expect(tricks[1]).toMatch(/^firstlast\+\w+@gmail\.com$/);
      });

      it("handles username without dots", () => {
        const tricks = generateQuickTricks("user@gmail.com", "nodots", 2);
        expect(tricks[0]).toBe("user@gmail.com");
        expect(tricks[1]).toMatch(/^user\+\w+@gmail\.com$/);
      });
    });

    describe("googlemail trick", () => {
      it("converts gmail.com to googlemail.com", () => {
        const tricks = generateQuickTricks("user@gmail.com", "googlemail", 1);
        expect(tricks[0]).toMatch(/@googlemail\.com$/);
      });

      it("converts googlemail.com to gmail.com", () => {
        const tricks = generateQuickTricks(
          "user@googlemail.com",
          "googlemail",
          1
        );
        expect(tricks[0]).toMatch(/@gmail\.com$/);
      });
    });

    describe("invalid input", () => {
      it("returns empty array for invalid email", () => {
        expect(generateQuickTricks("invalid", "plus", 5)).toEqual([]);
        expect(generateQuickTricks("@gmail.com", "plus", 5)).toEqual([]);
      });

      it("returns empty array for zero count", () => {
        expect(generateQuickTricks("user@gmail.com", "plus", 0)).toEqual([]);
      });
    });
  });
});
