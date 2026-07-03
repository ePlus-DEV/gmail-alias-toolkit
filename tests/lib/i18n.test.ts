import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect, vi, afterEach } from "vitest";
import { t } from "../../lib/i18n";

describe("t", () => {
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
    const localesDir = join(process.cwd(), "public", "_locales");
    const readMessages = (locale: string) =>
      JSON.parse(
        readFileSync(join(localesDir, locale, "messages.json"), "utf8"),
      ) as Record<string, unknown>;
    const englishKeys = Object.keys(readMessages("en")).sort();

    for (const locale of readdirSync(localesDir)) {
      if (locale === "en") continue;

      const localeKeys = Object.keys(readMessages(locale)).sort();
      expect(localeKeys, `${locale} keys should match en`).toEqual(englishKeys);
    }
  });
});
