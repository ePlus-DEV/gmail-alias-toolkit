import { beforeEach, describe, expect, it, vi } from "vitest";
import { getAccountStorageKey } from "../../entrypoints/popup/utils";
import { loadInlineAccountHistory } from "../../src/services/inlineHistoryService";

const mockStorageData: Record<string, unknown> = {};

/** Returns the requested keys from the in-memory browser storage fixture. */
function mockStorageGet(keys: string[]): Promise<Record<string, unknown>> {
  const result: Record<string, unknown> = {};
  for (const key of keys) {
    if (key in mockStorageData) result[key] = mockStorageData[key];
  }
  return Promise.resolve(result);
}

const mockStorageGetFunction = vi.fn(mockStorageGet);

vi.stubGlobal("browser", {
  storage: {
    local: {
      get: mockStorageGetFunction,
    },
  },
});

/** Clears browser storage fixtures before each service test. */
function resetMockStorage(): void {
  for (const key of Object.keys(mockStorageData)) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete mockStorageData[key];
  }
  vi.clearAllMocks();
}

/** Verifies mixed account-scoped entries render only for the active Workspace account. */
async function assertScopedWorkspaceHistoryIsIsolated(): Promise<void> {
  const activeEmail = "nguyen.minh.hoang@rivercrane.vn";
  const historyKey = getAccountStorageKey(activeEmail, "gmail_alias_recent");
  const favoritesKey = getAccountStorageKey(activeEmail, "favorites");
  mockStorageData[historyKey] = [
    {
      email: "nguyen.minh.hoang+older@rivercrane.vn",
      timestamp: 10,
    },
    { email: "nguyen.minh.hoang+gmail@gmail.com", timestamp: 30 },
    {
      email: "nguyen.minh.hoang+newer@rivercrane.vn",
      timestamp: 20,
    },
  ];
  mockStorageData[favoritesKey] = [
    "nguyen.minh.hoang+newer@rivercrane.vn",
    { email: "nguyen.minh.hoang+gmail@gmail.com" },
  ];

  const result = await loadInlineAccountHistory(activeEmail);

  expect(result.history).toEqual([
    {
      email: "nguyen.minh.hoang+newer@rivercrane.vn",
      timestamp: 20,
    },
    {
      email: "nguyen.minh.hoang+older@rivercrane.vn",
      timestamp: 10,
    },
  ]);
  expect(result.favorites).toEqual([
    "nguyen.minh.hoang+newer@rivercrane.vn",
  ]);
}

/** Verifies mixed legacy storage is filtered before the inline popup consumes it. */
async function assertLegacyWorkspaceHistoryIsIsolated(): Promise<void> {
  const activeEmail = "nguyen.minh.hoang@rivercrane.vn";
  mockStorageData.gmail_alias_recent = [
    { email: "nguyen.minh.hoang+webike@rivercrane.vn", timestamp: 2 },
    { email: "nguyen.minh.hoang+webike@gmail.com", timestamp: 3 },
    { email: "not-an-email", timestamp: 4 },
  ];
  mockStorageData.favorites = [
    { email: "nguyen.minh.hoang+webike@rivercrane.vn" },
    "nguyen.minh.hoang+webike@gmail.com",
    null,
  ];

  const result = await loadInlineAccountHistory(activeEmail);

  expect(result.history).toEqual([
    { email: "nguyen.minh.hoang+webike@rivercrane.vn", timestamp: 2 },
  ]);
  expect(result.favorites).toEqual([
    "nguyen.minh.hoang+webike@rivercrane.vn",
  ]);
}

/** Verifies account-scoped values take precedence over obsolete global values. */
async function assertScopedStorageTakesPrecedence(): Promise<void> {
  const activeEmail = "nguyen.minh.hoang@rivercrane.vn";
  const historyKey = getAccountStorageKey(activeEmail, "gmail_alias_recent");
  const favoritesKey = getAccountStorageKey(activeEmail, "favorites");
  mockStorageData[historyKey] = [];
  mockStorageData[favoritesKey] = [];
  mockStorageData.gmail_alias_recent = [
    { email: "nguyen.minh.hoang+legacy@rivercrane.vn", timestamp: 1 },
  ];
  mockStorageData.favorites = [
    "nguyen.minh.hoang+legacy@rivercrane.vn",
  ];

  const result = await loadInlineAccountHistory(activeEmail);

  expect(result).toEqual({ history: [], favorites: [] });
}

/** Verifies present null scoped values block fallback to obsolete global data. */
async function assertNullScopedStorageBlocksLegacyFallback(): Promise<void> {
  const activeEmail = "nguyen.minh.hoang@rivercrane.vn";
  const historyKey = getAccountStorageKey(activeEmail, "gmail_alias_recent");
  const favoritesKey = getAccountStorageKey(activeEmail, "favorites");
  mockStorageData[historyKey] = null;
  mockStorageData[favoritesKey] = null;
  mockStorageData.gmail_alias_recent = [
    { email: "nguyen.minh.hoang+legacy@rivercrane.vn", timestamp: 1 },
  ];
  mockStorageData.favorites = [
    "nguyen.minh.hoang+legacy@rivercrane.vn",
  ];

  const result = await loadInlineAccountHistory(activeEmail);

  expect(result).toEqual({ history: [], favorites: [] });
}

/** Verifies non-array account storage is treated as empty data. */
async function assertNonArrayStorageIsIgnored(): Promise<void> {
  const activeEmail = "nguyen.minh.hoang@rivercrane.vn";
  const historyKey = getAccountStorageKey(activeEmail, "gmail_alias_recent");
  const favoritesKey = getAccountStorageKey(activeEmail, "favorites");
  mockStorageData[historyKey] = { email: "not-an-array" };
  mockStorageData[favoritesKey] = "not-an-array";

  const result = await loadInlineAccountHistory(activeEmail);

  expect(result).toEqual({ history: [], favorites: [] });
}

/** Verifies malformed entries are skipped while valid Workspace entries remain. */
async function assertMalformedEntriesAreIgnored(): Promise<void> {
  const activeEmail = "nguyen.minh.hoang@rivercrane.vn";
  const historyKey = getAccountStorageKey(activeEmail, "gmail_alias_recent");
  const favoritesKey = getAccountStorageKey(activeEmail, "favorites");
  mockStorageData[historyKey] = [
    null,
    { email: "nguyen.minh.hoang+missing-time@rivercrane.vn" },
    {
      email: "nguyen.minh.hoang+bad-time@rivercrane.vn",
      timestamp: "10",
    },
    {
      email: "nguyen.minh.hoang+nan@rivercrane.vn",
      timestamp: Number.NaN,
    },
    {
      email: "nguyen.minh.hoang+infinity@rivercrane.vn",
      timestamp: Number.POSITIVE_INFINITY,
    },
    {
      email: "nguyen.minh.hoang+negative-infinity@rivercrane.vn",
      timestamp: Number.NEGATIVE_INFINITY,
    },
    { email: 123, timestamp: 9 },
    { email: "nguyen.minh.hoang+valid@rivercrane.vn", timestamp: 8 },
  ];
  mockStorageData[favoritesKey] = [
    null,
    "",
    {},
    { email: "" },
    { email: 123 },
    { email: "nguyen.minh.hoang+valid@rivercrane.vn" },
  ];

  const result = await loadInlineAccountHistory(activeEmail);

  expect(result.history).toEqual([
    { email: "nguyen.minh.hoang+valid@rivercrane.vn", timestamp: 8 },
  ]);
  expect(result.favorites).toEqual([
    "nguyen.minh.hoang+valid@rivercrane.vn",
  ]);
}

/** Verifies browser storage failures propagate to the inline popup caller. */
async function assertStorageFailurePropagates(): Promise<void> {
  mockStorageGetFunction.mockRejectedValueOnce(
    new Error("Inline history storage unavailable"),
  );

  await expect(
    loadInlineAccountHistory("nguyen.minh.hoang@rivercrane.vn"),
  ).rejects.toThrow("Inline history storage unavailable");
}

/** Registers browser-storage integration coverage for inline account history. */
function defineInlineHistoryServiceTests(): void {
  beforeEach(resetMockStorage);
  it(
    "filters account-scoped history and favorites by active Workspace account",
    assertScopedWorkspaceHistoryIsIsolated,
  );
  it(
    "filters legacy history and favorites by active Workspace account",
    assertLegacyWorkspaceHistoryIsIsolated,
  );
  it(
    "prefers account-scoped storage over legacy global storage",
    assertScopedStorageTakesPrecedence,
  );
  it(
    "does not fall back when scoped storage exists as null",
    assertNullScopedStorageBlocksLegacyFallback,
  );
  it("treats non-array storage as empty", assertNonArrayStorageIsIgnored);
  it(
    "ignores malformed history and favorite entries",
    assertMalformedEntriesAreIgnored,
  );
  it("propagates browser storage failures", assertStorageFailurePropagates);
}

describe("loadInlineAccountHistory", defineInlineHistoryServiceTests);
