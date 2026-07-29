import { describe, expect, it } from "vitest";
import { CHANGELOG } from "../../entrypoints/popup/data/changelog";
import { APP_VERSION } from "../../src/version";

/** Converts a semantic version into numeric parts for descending-order checks. */
function parseVersion(version: string): number[] {
  return version.split(".").map(Number);
}

/** Compares two semantic versions from newest to oldest. */
function compareVersionsDescending(first: string, second: string): number {
  const firstParts = parseVersion(first);
  const secondParts = parseVersion(second);

  for (let index = 0; index < 3; index += 1) {
    const difference = (secondParts[index] ?? 0) - (firstParts[index] ?? 0);
    if (difference !== 0) return difference;
  }

  return 0;
}

describe("extension changelog data", () => {
  it("starts with the current package version", () => {
    expect(CHANGELOG[0]?.version).toBe(APP_VERSION);
  });

  it("keeps versions unique and ordered from newest to oldest", () => {
    const versions = CHANGELOG.map((entry) => entry.version);

    expect(new Set(versions).size).toBe(versions.length);
    expect([...versions].sort(compareVersionsDescending)).toEqual(versions);
  });

  it("provides at least one non-empty change item for every release", () => {
    for (const entry of CHANGELOG) {
      expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(entry.changes.length).toBeGreaterThan(0);
      expect(entry.changes.flatMap((change) => change.items)).not.toContain("");
    }
  });
});
