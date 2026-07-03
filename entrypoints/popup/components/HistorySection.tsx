/** Recent aliases list with search, filter, pagination, and bulk selection. */
import Button from "./Button";
import Input from "./Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/motion/select";
import { Checkbox } from "src/components/motion/checkbox";
import { t } from "../../../lib/i18n";

interface Alias {
  email: string;
  timestamp: number;
}

interface HistorySectionProps {
  recentAliases: Alias[];
  favorites: string[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterTag: string;
  setFilterTag: (tag: string) => void;
  sortBy: "recent" | "alphabetical";
  setSortBy: (sort: "recent" | "alphabetical") => void;
  viewMode: "all" | "favorites";
  setViewMode: (mode: "all" | "favorites") => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (count: number) => void;
  isSelectMode: boolean;
  setIsSelectMode: (on: boolean) => void;
  selectedAliases: Set<string>;
  setSelectedAliases: (set: Set<string>) => void;
  copiedEmail: string | null;
  filteredAliases: Alias[];
  exportAliases: (format: "csv" | "json") => void;
  deleteSelected: () => void;
  toggleSelectAlias: (email: string) => void;
  toggleFavorite: (email: string) => void;
  copyToClipboard: (email: string) => Promise<void>;
  setQrAlias: (email: string | null) => void;
}

/** Recent aliases list with search, filter, pagination, and bulk selection. */
export default function HistorySection({
  recentAliases,
  favorites,
  searchQuery,
  setSearchQuery,
  filterTag,
  setFilterTag,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  isSelectMode,
  setIsSelectMode,
  selectedAliases,
  setSelectedAliases,
  copiedEmail,
  filteredAliases,
  exportAliases,
  deleteSelected,
  toggleSelectAlias,
  toggleFavorite,
  copyToClipboard,
  setQrAlias,
}: HistorySectionProps) {
  if (recentAliases.length === 0 && favorites.length === 0) return null;

  // skipcq: JS-0415
  return (
    // skipcq: JS-0415
    <div className="p-3.5">
      {/* Header with title and action buttons */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground">
          {viewMode === "all" ? t("recentAliases") : t("favorites")}
        </h2>
        <div className="flex items-center gap-1.5">
          {viewMode === "all" && recentAliases.length > 0 && (
            <>
              <Button
                onClick={() => exportAliases("csv")}
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-primary px-1.5 py-0.5 rounded hover:bg-primary/10 transition-colors"
                title={t("exportAsCsv")}
              >
                CSV
              </Button>
              <Button
                onClick={() => exportAliases("json")}
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-primary px-1.5 py-0.5 rounded hover:bg-primary/10 transition-colors"
                title={t("exportAsJson")}
              >
                JSON
              </Button>
              <Button
                onClick={() => {
                  setIsSelectMode(!isSelectMode);
                  setSelectedAliases(new Set());
                }}
                variant={isSelectMode ? "primary" : "ghost"}
                size="sm"
                className={`text-xs px-1.5 py-0.5 rounded transition-colors ${
                  isSelectMode
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                }`}
                title={t("selectAliases")}
              >
                {t("select")}
              </Button>
            </>
          )}
          <span className="text-xs text-muted-foreground">
            {viewMode === "all"
              ? t("totalCount", String(recentAliases.length))
              : t("starredCount", String(favorites.length))}
          </span>
        </div>
      </div>

      {/* Bulk delete bar */}
      {isSelectMode && (
        <div className="mb-3 flex items-center gap-2 p-2 bg-primary/10 rounded-lg">
          <Button
            onClick={() => {
              if (selectedAliases.size === filteredAliases.length) {
                setSelectedAliases(new Set());
              } else {
                setSelectedAliases(
                  new Set(filteredAliases.map((a) => a.email)),
                );
              }
            }}
            variant="ghost"
            size="sm"
            className="text-xs font-medium text-primary hover:text-foreground"
          >
            {selectedAliases.size === filteredAliases.length
              ? t("deselectAll")
              : t("selectAll")}
          </Button>
          <span className="text-xs text-muted-foreground flex-1">
            {t("selectedCount", String(selectedAliases.size))}
          </span>
          <Button
            onClick={deleteSelected}
            disabled={selectedAliases.size === 0}
            variant="danger"
            size="sm"
            className="rounded bg-destructive px-2 py-1 text-xs text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t(
              "deleteCount",
              selectedAliases.size > 0 ? String(selectedAliases.size) : "",
            )}
          </Button>
        </div>
      )}

      {/* View mode tabs */}
      <div className="mb-3 flex gap-1 p-1 bg-muted rounded-lg">
        <Button
          onClick={() => setViewMode("all")}
          variant="ghost"
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            viewMode === "all"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground dark:hover:text-foreground"
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {t("allCount", String(recentAliases.length))}
          </div>
        </Button>
        <Button
          onClick={() => setViewMode("favorites")}
          variant="ghost"
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            viewMode === "favorites"
              ? "bg-card text-yellow-600 dark:text-yellow-400 shadow-sm"
              : "text-muted-foreground hover:text-foreground dark:hover:text-foreground"
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <svg
              className="w-3.5 h-3.5"
              fill={viewMode === "favorites" ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            {t("favoritesCount", String(favorites.length))}
          </div>
        </Button>
      </div>

      {/* Search and filters */}
      <div className="mb-3 space-y-2">
        <div className="relative">
          <Input
            type="text"
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t("searchAliases")}
            className="w-full"
          />
          {searchQuery && (
            <Button
              onClick={() => setSearchQuery("")}
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground dark:hover:text-muted-foreground"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Select
            value={filterTag}
            onValueChange={setFilterTag}
            className="flex-1"
          >
            <SelectTrigger className="py-1.5 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allTags")}</SelectItem>
            {Array.from(
              new Set(
                recentAliases
                  .map((a) => {
                    const match = a.email.match(/\+([^@]+)@/);
                    return match ? match[1] : null;
                  })
                  .filter((t): t is string => t !== null),
              ),
            ).map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(value) =>
              setSortBy(value as "recent" | "alphabetical")
            }
            className="flex-1"
          >
            <SelectTrigger className="py-1.5 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">{t("mostRecent")}</SelectItem>
              <SelectItem value="alphabetical">{t("az")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Aliases list with pagination */}
      <HistoryList
        filteredAliases={filteredAliases}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        isSelectMode={isSelectMode}
        selectedAliases={selectedAliases}
        toggleSelectAlias={toggleSelectAlias}
        copiedEmail={copiedEmail}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        copyToClipboard={copyToClipboard}
        setQrAlias={setQrAlias}
        viewMode={viewMode}
      />
    </div>
  );
}

/** Paginated list of aliases with copy, favorite, and QR actions. */
function HistoryList({
  filteredAliases,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  isSelectMode,
  selectedAliases,
  toggleSelectAlias,
  copiedEmail,
  favorites,
  toggleFavorite,
  copyToClipboard,
  setQrAlias,
  viewMode,
}: {
  filteredAliases: Alias[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (count: number) => void;
  isSelectMode: boolean;
  selectedAliases: Set<string>;
  toggleSelectAlias: (email: string) => void;
  copiedEmail: string | null;
  favorites: string[];
  toggleFavorite: (email: string) => void;
  copyToClipboard: (email: string) => Promise<void>;
  setQrAlias: (email: string | null) => void;
  viewMode: "all" | "favorites";
}) {
  const totalItems = filteredAliases.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAliases = filteredAliases.slice(startIndex, endIndex);

  if (filteredAliases.length === 0 && viewMode === "favorites") {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <svg
          className="w-12 h-12 mx-auto mb-3 text-muted-foreground dark:text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
        <p className="text-sm font-medium mb-1">{t("noFavoritesYet")}</p>
        <p className="text-xs">{t("starEmailsHint")}</p>
      </div>
    );
  }

  if (filteredAliases.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <svg
          className="w-10 h-10 mx-auto mb-2 text-muted-foreground dark:text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <p className="text-sm font-medium mb-1">{t("noResultsFound")}</p>
        <p className="text-xs">{t("differentSearchHint")}</p>
      </div>
    );
  }

  // skipcq: JS-0415
  return (
    <div className="space-y-2">
      {paginatedAliases.map((alias) => (
        <AliasRow
          key={alias.email}
          alias={alias}
          isSelectMode={isSelectMode}
          isSelected={selectedAliases.has(alias.email)}
          onToggleSelect={() => toggleSelectAlias(alias.email)}
          isCopied={copiedEmail === alias.email}
          isFavorited={favorites.includes(alias.email)}
          onToggleFavorite={() => toggleFavorite(alias.email)}
          onCopy={() => copyToClipboard(alias.email)}
          onShowQR={() => setQrAlias(alias.email)}
        />
      ))}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
        />
      )}
    </div>
  );
}

/** Single alias row with action buttons. */
function AliasRow({
  alias,
  isSelectMode,
  isSelected,
  onToggleSelect,
  isCopied,
  isFavorited,
  onToggleFavorite,
  onCopy,
  onShowQR,
}: {
  alias: Alias;
  isSelectMode: boolean;
  isSelected: boolean;
  onToggleSelect: () => void;
  isCopied: boolean;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onCopy: () => void;
  onShowQR: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-0.5 px-2 py-1.5 hover:bg-muted/40 dark:hover:bg-muted rounded-md group transition-colors">
      {isSelectMode && (
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelect}
          className="mr-1.5 flex-shrink-0"
          aria-label={alias.email}
        />
      )}
      <span className="text-sm text-foreground dark:text-foreground font-mono break-all flex-1">
        {alias.email}
      </span>
      <Button
        onClick={onShowQR}
        variant="ghost"
        size="icon"
        className="p-1.5 text-muted-foreground hover:text-primary focus:outline-none transition-colors"
        title={t("showQrCode")}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 3.5c0 1.933-1.567 3.5-3.5 3.5S13 17.433 13 15.5 14.567 12 16.5 12s3.5 1.567 3.5 3.5zM4 4h4v4H4V4zm12 0h4v4h-4V4zM4 16h4v4H4v-4z"
          />
        </svg>
      </Button>
      <Button
        onClick={onToggleFavorite}
        variant="ghost"
        size="icon"
        className={`p-1.5 focus:outline-none transition-colors ${
          isFavorited
            ? "text-yellow-500 hover:text-yellow-600"
            : "text-muted-foreground hover:text-yellow-500"
        }`}
        title={isFavorited ? t("removeFromFavorites") : t("addToFavorites")}
      >
        <svg
          className="w-4 h-4"
          fill={isFavorited ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      </Button>
      <Button
        onClick={onCopy}
        variant="ghost"
        size="icon"
        className="p-1.5 text-muted-foreground hover:text-primary focus:outline-none focus:text-primary transition-colors"
        title={t("copyToClipboard")}
      >
        {isCopied ? (
          <svg
            className="w-4 h-4 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        )}
      </Button>
    </div>
  );
}

/** Pagination controls. */
function Pagination({
  currentPage,
  setCurrentPage,
  totalPages,
  itemsPerPage,
  setItemsPerPage,
  startIndex,
  endIndex,
  totalItems,
}: {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  itemsPerPage: number;
  setItemsPerPage: (count: number) => void;
  startIndex: number;
  endIndex: number;
  totalItems: number;
}) {
  // skipcq: JS-0415
  return (
    // skipcq: JS-0415
    <div className="mt-4 pt-3 border-t border-border">
      <div className="flex flex-col gap-3">
        {/* Page info */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {t("showingRange", [
              String(startIndex + 1),
              String(Math.min(endIndex, totalItems)),
              String(totalItems),
            ])}
          </div>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
            className="w-24"
          >
            <SelectTrigger className="px-2 py-1 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">{t("perPage", "5")}</SelectItem>
              <SelectItem value="10">{t("perPage", "10")}</SelectItem>
              <SelectItem value="20">{t("perPage", "20")}</SelectItem>
              <SelectItem value="50">{t("perPage", "50")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-center gap-1">
          <Button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            variant="ghost"
            size="sm"
            className="px-2 py-1 text-xs rounded hover:bg-muted dark:hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-foreground"
            title={t("firstPage")}
          >
            ⟪
          </Button>
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            variant="ghost"
            size="sm"
            className="px-2 py-1 text-xs rounded hover:bg-muted dark:hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-foreground"
            title={t("previousPage")}
          >
            ←
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1,
              )
              .map((page, index, array) => {
                const prevPage = array[index - 1];
                const showEllipsis = prevPage && page - prevPage > 1;

                return (
                  <div key={page} className="flex items-center gap-1">
                    {showEllipsis && (
                      <span className="px-1 text-muted-foreground">
                        ...
                      </span>
                    )}
                    <Button
                      onClick={() => setCurrentPage(page)}
                      variant={currentPage === page ? "primary" : "ghost"}
                      size="sm"
                      className={`min-w-[28px] px-2 py-1 text-xs rounded transition-colors ${
                        currentPage === page
                          ? "bg-primary text-primary-foreground font-medium"
                          : "hover:bg-muted dark:hover:bg-muted text-foreground"
                      }`}
                    >
                      {page}
                    </Button>
                  </div>
                );
              })}
          </div>
          <Button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="ghost"
            size="sm"
            className="px-2 py-1 text-xs rounded hover:bg-muted dark:hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-foreground"
            title={t("nextPage")}
          >
            →
          </Button>
          <Button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            variant="ghost"
            size="sm"
            className="px-2 py-1 text-xs rounded hover:bg-muted dark:hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-foreground"
            title={t("lastPage")}
          >
            ⟫
          </Button>
        </div>
      </div>
    </div>
  );
}



