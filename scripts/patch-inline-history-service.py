from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    """Replace one expected source fragment and fail when the branch has drifted."""
    file_path = Path(path)
    content = file_path.read_text(encoding="utf-8")
    count = content.count(old)
    if count != 1:
        raise RuntimeError(f"Expected exactly one match in {path}, found {count}")
    file_path.write_text(content.replace(old, new, 1), encoding="utf-8")


replace_once(
    "entrypoints/content/index.ts",
    '''import {
  getPreviousAliasForWebsite,
  generateSuggestionsForWebsite,
  saveWebsiteAlias,
} from "src/services/websiteAliasService";
''',
    '''import { loadInlineAccountHistory } from "src/services/inlineHistoryService";
import {
  getPreviousAliasForWebsite,
  generateSuggestionsForWebsite,
  saveWebsiteAlias,
} from "src/services/websiteAliasService";
''',
)

replace_once(
    "entrypoints/content/index.ts",
    '''  filterAliases,
  filterAliasesForAccount,
  getAccountStorageKey,
''',
    '''  filterAliases,
  getAccountStorageKey,
''',
)

replace_once(
    "entrypoints/content/index.ts",
    '''      // Use the same account that was used to generate this popup's aliases.
      const historyKey = getAccountStorageKey(
        data.activeEmail,
        "gmail_alias_recent",
      );
      const favoritesKey = getAccountStorageKey(data.activeEmail, "favorites");

      const storage = (await browser.storage.local.get([
        historyKey,
        favoritesKey,
        "gmail_alias_recent",
        "favorites",
      ])) as Record<string, unknown>;
      // Older installations may still have history under the global key.
      const history = (storage[historyKey] ??
        storage.gmail_alias_recent ??
        []) as Array<{
        email: string;
        timestamp: number;
      }>;
      const validHistory = history.filter(
        (item) => item && typeof item.email === "string",
      );
      currentHistory = filterAliasesForAccount(
        validHistory,
        data.activeEmail,
      )
        .slice()
        .sort((a, b) => b.timestamp - a.timestamp);
      const favorites = (storage[favoritesKey] ?? storage.favorites ?? []) as
        | Array<{ email?: string } | string>
        | undefined;
      const favoriteEntries = Array.isArray(favorites)
        ? favorites
            .map((favorite) => ({
              email:
                typeof favorite === "string" ? favorite : favorite.email || "",
            }))
            .filter((favorite) => Boolean(favorite.email))
        : [];
      currentFavorites = filterAliasesForAccount(
        favoriteEntries,
        data.activeEmail,
      ).map((favorite) => favorite.email);
''',
    '''      const accountHistory = await loadInlineAccountHistory(data.activeEmail);
      currentHistory = accountHistory.history;
      currentFavorites = accountHistory.favorites;
''',
)

content = Path("entrypoints/content/index.ts").read_text(encoding="utf-8")
if "filterAliasesForAccount" in content:
    raise RuntimeError("Stale inline account-filter import remains")
if "loadInlineAccountHistory(data.activeEmail)" not in content:
    raise RuntimeError("Inline history service was not connected")
