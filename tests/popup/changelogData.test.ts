import { beforeEach, describe, expect, it } from "vitest";
import { CHANGELOG } from "../../entrypoints/popup/data/changelog";
import { APP_VERSION } from "../../src/version";

let versions: string[] = [];

/** Converts a semantic version into numeric parts for descending-order checks. */
function parseVersion(version: string): number[] {
  const parts: number[] = [];
  for (const part of version.split(".")) parts.push(Number(part));
  return parts;
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

/** Restores changelog version fixtures before each assertion. */
function resetVersions(): void {
  versions = [];
  for (const entry of CHANGELOG) versions.push(entry.version);
}

/** Verifies the newest changelog entry matches the package version. */
function assertCurrentVersionIsFirst(): void {
  expect(CHANGELOG[0]?.version).toBe(APP_VERSION);
}

/** Verifies changelog versions are unique and ordered newest to oldest. */
function assertVersionsAreUniqueAndDescending(): void {
  expect(new Set(versions).size).toBe(versions.length);
  expect([...versions].sort(compareVersionsDescending)).toEqual(versions);
}

/** Exercises newer, older, and equal comparator outcomes directly. */
function assertVersionComparatorBranches(): void {
  expect(compareVersionsDescending("1.3.3", "1.3.2")).toBeLessThan(0);
  expect(compareVersionsDescending("1.3.2", "1.3.3")).toBeGreaterThan(0);
  expect(compareVersionsDescending("1.3.3", "1.3.3")).toBe(0);
}

/** Verifies every release includes a valid date and non-empty change item. */
function assertReleaseEntriesAreComplete(): void {
  for (const entry of CHANGELOG) {
    expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(entry.changes.length).toBeGreaterThan(0);

    for (const change of entry.changes) {
      expect(change.items.length).toBeGreaterThan(0);
      for (const item of change.items) expect(item).not.toBe("");
    }
  }
}

/** Registers changelog data integrity tests. */
function defineChangelogDataTests(): void {
  beforeEach(resetVersions);
  it("starts with the current package version", assertCurrentVersionIsFirst);
  it(
    "keeps versions unique and ordered from newest to oldest",
    assertVersionsAreUniqueAndDescending,
  );
  it(
    "compares newer, older, and equal versions",
    assertVersionComparatorBranches,
  );
  it(
    "provides at least one non-empty change item for every release",
    assertReleaseEntriesAreComplete,
  );
}

describe("extension changelog data", defineChangelogDataTests);
