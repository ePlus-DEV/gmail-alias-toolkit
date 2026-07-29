import {
  filterAliasesForAccount,
  getAccountStorageKey,
} from "../../entrypoints/popup/utils";

export interface InlineHistoryAlias {
  email: string;
  timestamp: number;
}

export interface InlineAccountHistory {
  history: InlineHistoryAlias[];
  favorites: string[];
}

interface FavoriteAlias {
  email: string;
}

/** Returns whether a stored value is a usable inline history entry. */
function isInlineHistoryAlias(value: unknown): value is InlineHistoryAlias {
  if (!value || typeof value !== "object") return false;
  const candidate = value as { email?: unknown; timestamp?: unknown };
  return (
    typeof candidate.email === "string" &&
    typeof candidate.timestamp === "number" &&
    Number.isFinite(candidate.timestamp)
  );
}

/** Normalizes legacy string and object favorite values into one shape. */
function normalizeFavoriteAlias(value: unknown): FavoriteAlias | null {
  if (typeof value === "string" && value) return { email: value };
  if (!value || typeof value !== "object") return null;

  const email = (value as { email?: unknown }).email;
  return typeof email === "string" && email ? { email } : null;
}

/** Sorts history entries from newest to oldest. */
function sortHistoryNewestFirst(
  first: InlineHistoryAlias,
  second: InlineHistoryAlias,
): number {
  return second.timestamp - first.timestamp;
}

/** Extracts valid history entries from account-scoped or legacy storage. */
function parseHistory(value: unknown): InlineHistoryAlias[] {
  if (!Array.isArray(value)) return [];

  const history: InlineHistoryAlias[] = [];
  for (const entry of value) {
    if (isInlineHistoryAlias(entry)) history.push(entry);
  }
  return history;
}

/** Extracts valid favorite aliases from legacy string and object formats. */
function parseFavorites(value: unknown): FavoriteAlias[] {
  if (!Array.isArray(value)) return [];

  const favorites: FavoriteAlias[] = [];
  for (const entry of value) {
    const favorite = normalizeFavoriteAlias(entry);
    if (favorite) favorites.push(favorite);
  }
  return favorites;
}

/** Uses scoped storage whenever its key exists, otherwise falls back to legacy data. */
function selectStoredValue(
  storage: Record<string, unknown>,
  accountKey: string,
  legacyKey: string,
): unknown {
  return Object.prototype.hasOwnProperty.call(storage, accountKey)
    ? storage[accountKey]
    : (storage[legacyKey] ?? []);
}

/** Loads account-isolated history and favorites for the inline helper popup. */
export async function loadInlineAccountHistory(
  activeEmail: string,
): Promise<InlineAccountHistory> {
  const historyKey = getAccountStorageKey(activeEmail, "gmail_alias_recent");
  const favoritesKey = getAccountStorageKey(activeEmail, "favorites");
  const storage = (await browser.storage.local.get([
    historyKey,
    favoritesKey,
    "gmail_alias_recent",
    "favorites",
  ])) as Record<string, unknown>;

  const history = filterAliasesForAccount(
    parseHistory(selectStoredValue(storage, historyKey, "gmail_alias_recent")),
    activeEmail,
  ).sort(sortHistoryNewestFirst);
  const favoriteAliases = filterAliasesForAccount(
    parseFavorites(selectStoredValue(storage, favoritesKey, "favorites")),
    activeEmail,
  );
  const favorites: string[] = [];
  for (const favorite of favoriteAliases) favorites.push(favorite.email);

  return { history, favorites };
}
