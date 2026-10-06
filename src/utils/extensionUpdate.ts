export const EXTENSION_UPDATE_STORAGE_KEY = "extension_update_prompt";
export const UPDATE_CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;
export const UPDATE_SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;

export type ExtensionUpdateStatus = "idle" | "available" | "ready";
export type RuntimeUpdateCheckStatus =
  | "throttled"
  | "no_update"
  | "update_available";

export interface RuntimeUpdateCheckResult {
  status: RuntimeUpdateCheckStatus;
  version?: string;
}

export interface ExtensionUpdateState {
  status: ExtensionUpdateStatus;
  lastCheckedAt?: number;
  availableVersion?: string;
  dismissedVersion?: string;
  dismissedUntil?: number;
}

interface ParsedVersion {
  core: number[];
  prerelease: string[] | null;
  normalized: string;
}

/** Parses browser-store versions without depending on a runtime semver package. */
function parseVersion(value: unknown): ParsedVersion | null {
  if (typeof value !== "string") return null;

  const normalized = value.trim().replace(/^v/i, "");
  const match = normalized.match(
    /^(\d+(?:\.\d+){0,3})(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/,
  );
  if (!match) return null;

  const core = match[1].split(".").map(Number);
  while (core.length < 4) core.push(0);

  return {
    core,
    prerelease: match[2]?.split(".") ?? null,
    normalized,
  };
}

/** Compares two extension versions. Positive means left is newer. */
export function compareExtensionVersions(left: string, right: string): number {
  const parsedLeft = parseVersion(left);
  const parsedRight = parseVersion(right);
  if (!parsedLeft || !parsedRight) return 0;

  for (let index = 0; index < parsedLeft.core.length; index += 1) {
    const difference = parsedLeft.core[index] - parsedRight.core[index];
    if (difference !== 0) return difference;
  }

  if (!parsedLeft.prerelease && !parsedRight.prerelease) return 0;
  if (!parsedLeft.prerelease) return 1;
  if (!parsedRight.prerelease) return -1;

  const length = Math.max(
    parsedLeft.prerelease.length,
    parsedRight.prerelease.length,
  );
  for (let index = 0; index < length; index += 1) {
    const leftPart = parsedLeft.prerelease[index];
    const rightPart = parsedRight.prerelease[index];
    if (leftPart === undefined) return -1;
    if (rightPart === undefined) return 1;
    if (leftPart === rightPart) continue;

    const leftNumber = /^\d+$/.test(leftPart) ? Number(leftPart) : null;
    const rightNumber = /^\d+$/.test(rightPart) ? Number(rightPart) : null;
    if (leftNumber !== null && rightNumber !== null) {
      return leftNumber - rightNumber;
    }
    if (leftNumber !== null) return -1;
    if (rightNumber !== null) return 1;
    return leftPart.localeCompare(rightPart);
  }

  return 0;
}

/** Returns true only when the store version is newer than the installed version. */
export function isExtensionVersionNewer(
  storeVersion: string,
  installedVersion: string,
): boolean {
  return compareExtensionVersions(storeVersion, installedVersion) > 0;
}

/** Validates persisted update state before it is consumed by the popup. */
export function normalizeExtensionUpdateState(
  value: unknown,
): ExtensionUpdateState {
  if (!value || typeof value !== "object") return { status: "idle" };

  const candidate = value as Partial<ExtensionUpdateState>;
  const status: ExtensionUpdateStatus = ["idle", "available", "ready"].includes(
    candidate.status ?? "",
  )
    ? (candidate.status as ExtensionUpdateStatus)
    : "idle";

  return {
    status,
    lastCheckedAt:
      typeof candidate.lastCheckedAt === "number"
        ? candidate.lastCheckedAt
        : undefined,
    availableVersion:
      parseVersion(candidate.availableVersion)?.normalized ?? undefined,
    dismissedVersion:
      parseVersion(candidate.dismissedVersion)?.normalized ?? undefined,
    dismissedUntil:
      typeof candidate.dismissedUntil === "number"
        ? candidate.dismissedUntil
        : undefined,
  };
}

/** Limits automatic Store checks while still allowing an explicit user retry. */
export function shouldCheckForExtensionUpdate(
  state: ExtensionUpdateState,
  now: number,
  force = false,
): boolean {
  if (force) return true;
  return (
    state.lastCheckedAt === undefined ||
    now - state.lastCheckedAt >= UPDATE_CHECK_INTERVAL_MS
  );
}

/** Reduces a browser runtime update-check result into persisted popup state. */
export function applyRuntimeUpdateCheckResult(
  state: ExtensionUpdateState,
  result: RuntimeUpdateCheckResult,
  checkedAt: number,
): ExtensionUpdateState {
  if (result.status === "no_update") {
    return { status: "idle", lastCheckedAt: checkedAt };
  }

  if (result.status === "throttled") {
    return { ...state, lastCheckedAt: checkedAt };
  }

  const availableVersion =
    parseVersion(result.version)?.normalized ?? state.availableVersion;
  return {
    ...state,
    status: availableVersion ? "available" : state.status,
    availableVersion,
    lastCheckedAt: checkedAt,
  };
}

/** Marks an update downloaded by the browser and ready to apply. */
export function markExtensionUpdateReady(
  state: ExtensionUpdateState,
  version: string,
  checkedAt: number,
): ExtensionUpdateState {
  const availableVersion = parseVersion(version)?.normalized;
  if (!availableVersion) return state;

  return {
    ...state,
    status: "ready",
    availableVersion,
    lastCheckedAt: checkedAt,
  };
}

/** Hides stale or snoozed prompts but lets a newer release bypass an old snooze. */
export function shouldShowExtensionUpdatePrompt(
  state: ExtensionUpdateState,
  installedVersion: string,
  now: number,
): boolean {
  const availableVersion = state.availableVersion;
  if (
    state.status === "idle" ||
    !availableVersion ||
    !isExtensionVersionNewer(availableVersion, installedVersion)
  ) {
    return false;
  }

  return !(
    state.dismissedVersion === availableVersion &&
    typeof state.dismissedUntil === "number" &&
    state.dismissedUntil > now
  );
}

/** Creates a seven-day snooze tied to one specific available version. */
export function snoozeExtensionUpdate(
  state: ExtensionUpdateState,
  now: number,
): ExtensionUpdateState {
  if (!state.availableVersion) return state;

  return {
    ...state,
    dismissedVersion: state.availableVersion,
    dismissedUntil: now + UPDATE_SNOOZE_MS,
  };
}
