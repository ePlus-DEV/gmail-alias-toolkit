import { type Dirent, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/** Returns whether a locale directory entry is a directory. */
function isLocaleDirectory(entry: Dirent): boolean {
  return entry.isDirectory();
}

/** Verifies that every WXT locale defines a non-empty user guide label. */
function assertUserGuideMessages(): void {
  const localesRoot = resolve(process.cwd(), "public/_locales");
  const localeDirectories = readdirSync(localesRoot, {
    withFileTypes: true,
  }).filter(isLocaleDirectory);

  expect(localeDirectories.length).toBeGreaterThan(0);

  for (const locale of localeDirectories) {
    const messagesPath = resolve(
      localesRoot,
      locale.name,
      "messages.json",
    );
    const messages = JSON.parse(readFileSync(messagesPath, "utf8")) as Record<
      string,
      { message?: unknown } | undefined
    >;
    const userGuideMessage = messages.userGuide?.message;

    expect(messages.userGuide, locale.name).toBeDefined();
    expect(userGuideMessage, locale.name).toEqual(expect.any(String));
    expect(
      typeof userGuideMessage === "string" ? userGuideMessage.trim() : "",
      locale.name,
    ).not.toBe("");
  }
}

/** Registers the WXT user guide localization regression test. */
function defineUserGuideLocaleSuite(): void {
  it(
    "defines a non-empty userGuide message for every locale",
    assertUserGuideMessages,
  );
}

describe("WXT user guide translations", defineUserGuideLocaleSuite);
