from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    """Replace one expected source fragment and fail if the branch drifted."""
    file_path = Path(path)
    content = file_path.read_text(encoding="utf-8")
    count = content.count(old)
    if count != 1:
        raise RuntimeError(f"Expected exactly one match in {path}, found {count}")
    file_path.write_text(content.replace(old, new, 1), encoding="utf-8")


replace_once(
    "entrypoints/content/index.ts",
    '''  filterAliases,
  getAccountStorageKey,
''',
    '''  filterAliases,
  filterAliasesForAccount,
  getAccountStorageKey,
''',
)

replace_once(
    "entrypoints/content/index.ts",
    '''      currentHistory = history
        .filter((item) => item && typeof item.email === "string")
        .slice()
        .sort((a, b) => b.timestamp - a.timestamp);
      const favorites = (storage[favoritesKey] ?? storage.favorites ?? []) as
        | Array<{ email?: string } | string>
        | undefined;
      currentFavorites = Array.isArray(favorites)
        ? favorites
            .map((favorite) =>
              typeof favorite === "string" ? favorite : favorite.email,
            )
            .filter((email): email is string => Boolean(email))
        : [];
''',
    '''      const validHistory = history.filter(
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
)

replace_once(
    "src/services/websiteAliasService.ts",
    "const key = getWebsiteAliasMapKey(email,);",
    "const key = getWebsiteAliasMapKey(email);",
)

replace_once(
    "tests/services/websiteAliasService.test.ts",
    '''    it("accepts both URL and hostname", async () => {
''',
    '''    it("ignores a stale website alias owned by another account", async () => {
      const workspaceEmail = "nguyen.minh.hoang@rivercrane.vn";
      mockStorageData[`${workspaceEmail}:website_alias_map`] = {
        github: {
          alias: "nguyen.minh.hoang+github@gmail.com",
          timestamp: 12345,
          generatedCount: 1,
        },
      };

      const result = await getPreviousAliasForWebsite(workspaceEmail, testUrl);
      expect(result).toBeNull();
    });

    it("accepts both URL and hostname", async () => {
''',
)

if "filterAliasesForAccount" not in Path("entrypoints/content/index.ts").read_text(
    encoding="utf-8"
):
    raise RuntimeError("Inline history account filter was not added")
