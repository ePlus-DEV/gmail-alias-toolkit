import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("WXT user guide translations", () => {
  const localesRoot = resolve(process.cwd(), "public/_locales");
  const localeDirectories = readdirSync(localesRoot, {
    withFileTypes: true,
  }).filter((entry) => entry.isDirectory());

  it("defines a non-empty userGuide message for every locale", () => {
    expect(localeDirectories.length).toBeGreaterThan(0);

    for (const locale of localeDirectories) {
      const messagesPath = resolve(
        localesRoot,
        locale.name,
        "messages.json",
      );
      const messages = JSON.parse(readFileSync(messagesPath, "utf8")) as Record<
        string,
        { message?: unknown }
      >;

      expect(messages.userGuide, locale.name).toBeDefined();
      expect(messages.userGuide.message, locale.name).toEqual(
        expect.any(String),
      );
      expect(
        (messages.userGuide.message as string).trim(),
        locale.name,
      ).not.toBe("");
    }
  });
});
