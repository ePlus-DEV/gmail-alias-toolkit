import { describe, expect, it } from "vitest";
import {
  applyRuntimeUpdateCheckResult,
  compareExtensionVersions,
  isExtensionVersionNewer,
  markExtensionUpdateReady,
  normalizeExtensionUpdateState,
  shouldCheckForExtensionUpdate,
  shouldShowExtensionUpdatePrompt,
  snoozeExtensionUpdate,
  UPDATE_CHECK_INTERVAL_MS,
  UPDATE_SNOOZE_MS,
  type ExtensionUpdateState,
} from "../../src/utils/extensionUpdate";

describe("extension update versions", () => {
  it("compares browser extension versions", () => {
    expect(compareExtensionVersions("1.3.2", "1.3.1")).toBeGreaterThan(0);
    expect(compareExtensionVersions("v1.3.2", "1.3.2")).toBe(0);
    expect(compareExtensionVersions("1.3.2", "1.3.2-beta.1")).toBeGreaterThan(
      0,
    );
    expect(compareExtensionVersions("1.3.2-beta.2", "1.3.2-beta.10")).toBeLessThan(
      0,
    );
    expect(isExtensionVersionNewer("1.4.0", "1.3.2")).toBe(true);
    expect(isExtensionVersionNewer("1.3.2", "1.3.2")).toBe(false);
  });

  it("normalizes untrusted persisted state", () => {
    expect(
      normalizeExtensionUpdateState({
        status: "ready",
        availableVersion: "v1.4.0",
        lastCheckedAt: 123,
        dismissedUntil: 456,
      }),
    ).toEqual({
      status: "ready",
      availableVersion: "1.4.0",
      lastCheckedAt: 123,
      dismissedVersion: undefined,
      dismissedUntil: 456,
    });
    expect(normalizeExtensionUpdateState({ status: "unexpected" })).toEqual({
      status: "idle",
      lastCheckedAt: undefined,
      availableVersion: undefined,
      dismissedVersion: undefined,
      dismissedUntil: undefined,
    });
  });
});

describe("extension update checks", () => {
  const now = 1_000_000;

  it("limits automatic checks to once per day but permits a user retry", () => {
    expect(shouldCheckForExtensionUpdate({ status: "idle" }, now)).toBe(true);
    expect(
      shouldCheckForExtensionUpdate(
        { status: "idle", lastCheckedAt: now - UPDATE_CHECK_INTERVAL_MS + 1 },
        now,
      ),
    ).toBe(false);
    expect(
      shouldCheckForExtensionUpdate(
        { status: "idle", lastCheckedAt: now - UPDATE_CHECK_INTERVAL_MS },
        now,
      ),
    ).toBe(true);
    expect(
      shouldCheckForExtensionUpdate(
        { status: "idle", lastCheckedAt: now },
        now,
        true,
      ),
    ).toBe(true);
  });

  it("stores available, ready, throttled, and no-update results", () => {
    const initial: ExtensionUpdateState = { status: "idle" };
    const available = applyRuntimeUpdateCheckResult(
      initial,
      { status: "update_available", version: "1.4.0" },
      now,
    );
    expect(available).toMatchObject({
      status: "available",
      availableVersion: "1.4.0",
      lastCheckedAt: now,
    });

    expect(markExtensionUpdateReady(available, "1.4.0", now + 10)).toMatchObject({
      status: "ready",
      availableVersion: "1.4.0",
      lastCheckedAt: now + 10,
    });

    expect(
      applyRuntimeUpdateCheckResult(
        available,
        { status: "throttled" },
        now + 20,
      ),
    ).toMatchObject({
      status: "available",
      availableVersion: "1.4.0",
      lastCheckedAt: now + 20,
    });

    expect(
      applyRuntimeUpdateCheckResult(
        available,
        { status: "no_update" },
        now + 30,
      ),
    ).toEqual({ status: "idle", lastCheckedAt: now + 30 });
  });
});

describe("extension update prompt visibility", () => {
  const now = 5_000_000;
  const available: ExtensionUpdateState = {
    status: "available",
    availableVersion: "1.4.0",
    lastCheckedAt: now,
  };

  it("shows only for a newer Store version", () => {
    expect(shouldShowExtensionUpdatePrompt(available, "1.3.2", now)).toBe(true);
    expect(shouldShowExtensionUpdatePrompt(available, "1.4.0", now)).toBe(false);
    expect(
      shouldShowExtensionUpdatePrompt(
        { status: "idle", availableVersion: "1.4.0" },
        "1.3.2",
        now,
      ),
    ).toBe(false);
  });

  it("snoozes one version for seven days and shows a newer version immediately", () => {
    const snoozed = snoozeExtensionUpdate(available, now);
    expect(snoozed.dismissedUntil).toBe(now + UPDATE_SNOOZE_MS);
    expect(shouldShowExtensionUpdatePrompt(snoozed, "1.3.2", now + 1)).toBe(
      false,
    );
    expect(
      shouldShowExtensionUpdatePrompt(
        { ...snoozed, availableVersion: "1.5.0" },
        "1.3.2",
        now + 1,
      ),
    ).toBe(true);
    expect(
      shouldShowExtensionUpdatePrompt(
        snoozed,
        "1.3.2",
        now + UPDATE_SNOOZE_MS,
      ),
    ).toBe(true);
  });
});
