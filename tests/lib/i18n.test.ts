import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect, vi, afterEach } from "vitest";
import { t } from "../../lib/i18n";

describe("t", () => {
  const localesDir = join(process.cwd(), "public", "_locales");
  const readMessages = (locale: string) =>
    JSON.parse(
      readFileSync(join(localesDir, locale, "messages.json"), "utf8"),
    ) as Record<
      string,
      { message: string; placeholders?: Record<string, unknown> }
    >;

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("returns the localized message when browser i18n has one", () => {
    const getMessage = vi.fn().mockReturnValue("Hello");
    vi.stubGlobal("browser", {
      i18n: { getMessage },
    });

    expect(t("greeting")).toBe("Hello");
    expect(getMessage.mock.calls[0]).toEqual(["greeting", undefined]);
  });

  it("passes substitutions through to browser i18n", () => {
    const getMessage = vi.fn().mockReturnValue("Hello Alice");
    vi.stubGlobal("browser", {
      i18n: { getMessage },
    });

    expect(t("greeting", "Alice")).toBe("Hello Alice");
    expect(getMessage).toHaveBeenCalledWith("greeting", "Alice");
  });

  it("falls back to the message key when browser i18n returns an empty value", () => {
    vi.stubGlobal("browser", {
      i18n: { getMessage: vi.fn().mockReturnValue("") },
    });

    expect(t("missingMessage")).toBe("missingMessage");
  });

  it("falls back to the message key when browser i18n throws", () => {
    vi.stubGlobal("browser", {
      i18n: {
        getMessage: vi.fn(() => {
          throw new Error("i18n unavailable");
        }),
      },
    });

    expect(t("safeFallback")).toBe("safeFallback");
  });

  it("keeps all locale message key sets aligned with English", () => {
    const englishKeys = Object.keys(readMessages("en")).sort();

    for (const locale of readdirSync(localesDir)) {
      if (locale === "en") continue;

      const localeKeys = Object.keys(readMessages(locale)).sort();
      expect(localeKeys, `${locale} keys should match en`).toEqual(englishKeys);
    }
  });

  it("keeps translations and placeholder definitions complete", () => {
    const english = readMessages("en");

    for (const locale of readdirSync(localesDir)) {
      const messages = readMessages(locale);
      for (const [key, definition] of Object.entries(messages)) {
        expect(definition.message.trim(), `${locale}.${key} should not be empty`)
          .not.toBe("");
        expect(
          Object.keys(definition.placeholders || {}).sort(),
          `${locale}.${key} placeholders should match en`,
        ).toEqual(Object.keys(english[key].placeholders || {}).sort());
      }
    }
  });

  it("has an English message for every statically referenced translation key", () => {
    const english = readMessages("en");
    const sourceRoots = ["entrypoints", "lib", "src"];
    const sourceFiles: string[] = [];

    const collectSources = (directory: string) => {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) collectSources(path);
        else if (/\.(ts|tsx)$/.test(entry.name)) sourceFiles.push(path);
      }
    };
    sourceRoots.forEach((root) => collectSources(join(process.cwd(), root)));

    const referencedKeys = new Set<string>();
    for (const file of sourceFiles) {
      const source = readFileSync(file, "utf8");
      for (const match of source.matchAll(/\bt\(\s*["']([^"']+)["']/g)) {
        referencedKeys.add(match[1]);
      }
    }

    const missing = [...referencedKeys].filter((key) => !english[key]).sort();
    expect(missing, "static t() keys should exist in en").toEqual([]);
  });
});
