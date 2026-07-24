import { Download, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  formatUpdatePromptCopy,
  getUpdatePromptCopy,
} from "src/i18n/updatePrompt";
import {
  applyRuntimeUpdateCheckResult,
  EXTENSION_UPDATE_STORAGE_KEY,
  type ExtensionUpdateState,
  isExtensionVersionNewer,
  markExtensionUpdateReady,
  normalizeExtensionUpdateState,
  type RuntimeUpdateCheckResult,
  shouldCheckForExtensionUpdate,
  shouldShowExtensionUpdatePrompt,
  snoozeExtensionUpdate,
} from "src/utils/extensionUpdate";

interface RuntimeUpdateApi {
  getManifest(): { version: string };
  reload(): void;
  requestUpdateCheck?: () => Promise<RuntimeUpdateCheckResult>;
  onUpdateAvailable?: {
    addListener(listener: (details: { version: string }) => void): void;
    removeListener(listener: (details: { version: string }) => void): void;
  };
}

const updateRuntime = browser.runtime as unknown as RuntimeUpdateApi;
let activeUpdateCheck: Promise<ExtensionUpdateState> | null = null;

/** Reads and validates the locally cached update prompt state. */
async function readUpdateState(): Promise<ExtensionUpdateState> {
  const result = await browser.storage.local.get(EXTENSION_UPDATE_STORAGE_KEY);
  return normalizeExtensionUpdateState(result[EXTENSION_UPDATE_STORAGE_KEY]);
}

/** Persists one update prompt state for all extension surfaces. */
async function writeUpdateState(state: ExtensionUpdateState): Promise<void> {
  await browser.storage.local.set({ [EXTENSION_UPDATE_STORAGE_KEY]: state });
}

/** Removes a cached prompt after the installed extension has caught up. */
function clearInstalledUpdate(
  state: ExtensionUpdateState,
  installedVersion: string,
): ExtensionUpdateState {
  if (
    state.availableVersion &&
    !isExtensionVersionNewer(state.availableVersion, installedVersion)
  ) {
    return { status: "idle", lastCheckedAt: state.lastCheckedAt };
  }
  return state;
}

/** Requests a Store-backed browser update check with a shared in-flight guard. */
async function checkBrowserStoreForUpdate(
  installedVersion: string,
  force = false,
): Promise<ExtensionUpdateState> {
  const existing = clearInstalledUpdate(await readUpdateState(), installedVersion);
  const now = Date.now();

  if (!shouldCheckForExtensionUpdate(existing, now, force)) return existing;
  if (!updateRuntime.requestUpdateCheck) return existing;
  if (activeUpdateCheck) return activeUpdateCheck;

  activeUpdateCheck = (async () => {
    try {
      const result = await updateRuntime.requestUpdateCheck?.();
      if (!result) return existing;

      const nextState = clearInstalledUpdate(
        applyRuntimeUpdateCheckResult(existing, result, now),
        installedVersion,
      );
      await writeUpdateState(nextState);
      return nextState;
    } catch {
      return existing;
    } finally {
      activeUpdateCheck = null;
    }
  })();

  return activeUpdateCheck;
}

/** Compact Store update prompt shown below the popup header. */
export default function ExtensionUpdateBanner() {
  const installedVersion = updateRuntime.getManifest().version;
  const copy = useMemo(() => getUpdatePromptCopy(), []);
  const [updateState, setUpdateState] = useState<ExtensionUpdateState>({
    status: "idle",
  });
  const [isChecking, setIsChecking] = useState(false);

  const syncState = useCallback(
    async (nextState: ExtensionUpdateState) => {
      const usableState = clearInstalledUpdate(nextState, installedVersion);
      setUpdateState(usableState);
      if (usableState !== nextState) await writeUpdateState(usableState);
    },
    [installedVersion],
  );

  useEffect(() => {
    let active = true;

    const initialize = async () => {
      const storedState = await readUpdateState();
      if (active) await syncState(storedState);

      const checkedState = await checkBrowserStoreForUpdate(installedVersion);
      if (active) await syncState(checkedState);
    };

    const handleUpdateAvailable = async (details: { version: string }) => {
      const currentState = await readUpdateState();
      const nextState = markExtensionUpdateReady(
        currentState,
        details.version,
        Date.now(),
      );
      await writeUpdateState(nextState);
      if (active) setUpdateState(nextState);
    };

    const handleStorageChange = (
      changes: Record<string, { newValue?: unknown }>,
      areaName: string,
    ) => {
      if (areaName !== "local" || !changes[EXTENSION_UPDATE_STORAGE_KEY]) {
        return;
      }
      const nextState = normalizeExtensionUpdateState(
        changes[EXTENSION_UPDATE_STORAGE_KEY].newValue,
      );
      if (active) setUpdateState(clearInstalledUpdate(nextState, installedVersion));
    };

    updateRuntime.onUpdateAvailable?.addListener(handleUpdateAvailable);
    browser.storage.onChanged.addListener(handleStorageChange);
    void initialize();

    return () => {
      active = false;
      updateRuntime.onUpdateAvailable?.removeListener(handleUpdateAvailable);
      browser.storage.onChanged.removeListener(handleStorageChange);
    };
  }, [installedVersion, syncState]);

  const availableVersion = updateState.availableVersion;
  const shouldShow = shouldShowExtensionUpdatePrompt(
    updateState,
    installedVersion,
    Date.now(),
  );
  if (!shouldShow || !availableVersion) return null;

  const message = formatUpdatePromptCopy(
    updateState.status === "ready" ? copy.ready : copy.available,
    { current: installedVersion, latest: availableVersion },
  );

  const handleUpdate = async () => {
    if (updateState.status === "ready") {
      updateRuntime.reload();
      return;
    }

    setIsChecking(true);
    const nextState = await checkBrowserStoreForUpdate(installedVersion, true);
    setUpdateState(nextState);
    setIsChecking(false);

    if (nextState.status === "ready") updateRuntime.reload();
  };

  const handleLater = async () => {
    const nextState = snoozeExtensionUpdate(updateState, Date.now());
    setUpdateState(nextState);
    await writeUpdateState(nextState);
  };

  return (
    <div
      className="mt-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-amber-950 shadow-sm dark:border-amber-900/70 dark:bg-amber-950/45 dark:text-amber-100"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-amber-200/70 text-amber-800 dark:bg-amber-900/70 dark:text-amber-200">
          <Download className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold">{copy.title}</p>
          <p className="mt-0.5 text-[11px] leading-4 opacity-80">{message}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void handleUpdate()}
              disabled={isChecking}
              className="inline-flex h-8 items-center gap-1.5 rounded-xl bg-amber-600 px-3 text-[11px] font-bold text-white transition hover:bg-amber-700 disabled:cursor-wait disabled:opacity-70 dark:bg-amber-500 dark:text-amber-950 dark:hover:bg-amber-400"
            >
              {isChecking ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : null}
              {isChecking
                ? copy.checking
                : updateState.status === "ready"
                  ? copy.applyNow
                  : copy.checkNow}
            </button>
            <button
              type="button"
              onClick={() => void handleLater()}
              className="h-8 rounded-xl px-2.5 text-[11px] font-semibold opacity-75 transition hover:bg-amber-200/60 hover:opacity-100 dark:hover:bg-amber-900/60"
            >
              {copy.later}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
