/** Recent aliases list with search, filter, pagination, and bulk selection. */
import { useMemo } from "react";
import Button from "./Button";
import Input from "./Input";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  QrCode,
  Star,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/motion/select";
import { Checkbox } from "src/components/motion/checkbox";
import { Tooltip } from "src/components/motion/tooltip";
import { Table, type TableColumn } from "src/components/motion/table";
import { t } from "../../../lib/i18n";

interface Alias {
  email: string;
  timestamp: number;
}

function shortenEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!local || !domain || email.length <= 30) return email;
  const visibleLocal =
    local.length > 20 ? `${local.slice(0, 14)}...${local.slice(-4)}` : local;
  return `${visibleLocal}@${domain}`;
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
    <div className="p-3">
      {/* Header with title and action buttons */}
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-foreground">
            {viewMode === "all" ? t("recentAliases") : t("favorites")}
          </h2>
          <p className="text-[11px] text-muted-foreground">
            {viewMode === "all"
              ? t("totalCount", String(recentAliases.length))
              : t("starredCount", String(favorites.length))}
          </p>
        </div>
        {viewMode === "all" && recentAliases.length > 0 && (
          <div className="flex shrink-0 items-center gap-1 rounded-xl border border-border bg-background p-1 shadow-sm">
            <Tooltip content={t("exportAsCsv")}>
              <Button
                onClick={() => exportAliases("csv")}
                variant="ghost"
                size="sm"
                className="h-7 rounded-lg px-2 text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label={t("exportAsCsv")}
              >
                CSV
              </Button>
            </Tooltip>
            <Tooltip content={t("exportAsJson")}>
              <Button
                onClick={() => exportAliases("json")}
                variant="ghost"
                size="sm"
                className="h-7 rounded-lg px-2 text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label={t("exportAsJson")}
              >
                JSON
              </Button>
            </Tooltip>
            <Tooltip content={t("selectAliases")}>
              <Button
                onClick={() => {
                  setIsSelectMode(!isSelectMode);
                  setSelectedAliases(new Set());
                }}
                variant={isSelectMode ? "primary" : "ghost"}
                size="sm"
                className={`h-7 rounded-lg px-2 text-[11px] transition-colors ${
                  isSelectMode
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                aria-label={t("selectAliases")}
              >
                {t("select")}
              </Button>
            </Tooltip>
          </div>
        )}
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
      <div className="mb-2.5 grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
        <Button
          onClick={() => setViewMode("all")}
          variant="ghost"
          className={`h-9 rounded-lg px-3 text-xs font-medium transition-all ${
            viewMode === "all"
              ? "bg-background text-foreground shadow-sm"
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
          className={`h-9 rounded-lg px-3 text-xs font-medium transition-all ${
            viewMode === "favorites"
              ? "bg-background text-accent shadow-sm"
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

        <div className="grid grid-cols-2 gap-2">
          <Select
            value={filterTag}
            onValueChange={setFilterTag}
            className="flex-1"
          >
            <SelectTrigger className="min-h-9 rounded-xl bg-background py-1.5 text-xs shadow-sm">
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
            <SelectTrigger className="min-h-9 rounded-xl bg-background py-1.5 text-xs shadow-sm">
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
  const columns = useMemo<TableColumn<Alias>[]>(
    () => [
      ...(isSelectMode
        ? [
            {
              key: "select",
              header: "",
              width: "36px",
              align: "center" as const,
              cell: (alias: Alias) => (
                <Checkbox
                  checked={selectedAliases.has(alias.email)}
                  onCheckedChange={() => toggleSelectAlias(alias.email)}
                  aria-label={alias.email}
                />
              ),
            },
          ]
        : []),
      {
        key: "email",
        header: "Alias",
        width: isSelectMode ? "142px" : "180px",
        cell: (alias) => (
          <Tooltip content={`${alias.email} - click to copy`} side="top">
            <button
              type="button"
              onClick={() => copyToClipboard(alias.email)}
              className="block max-w-full cursor-pointer truncate rounded px-1 py-0.5 text-left font-mono text-[12px] text-foreground transition-colors hover:bg-muted"
              aria-label={t("copyToClipboard")}
            >
              {shortenEmail(alias.email)}
            </button>
          </Tooltip>
        ),
        sortValue: (alias) => alias.email,
      },
      {
        key: "actions",
        header: "",
        width: "58px",
        align: "left",
        cell: (alias) => {
          const isFavorited = favorites.includes(alias.email);

          return (
            <div className="flex w-max items-center gap-1 rounded-md border border-border bg-background p-0.5 shadow-sm">
              <Tooltip content={t("showQrCode")}>
                <Button
                  onClick={() => setQrAlias(alias.email)}
                  variant="ghost"
                  size="icon"
                  className="h-[22px] w-[22px] rounded p-0 text-muted-foreground transition-colors hover:bg-background hover:text-primary focus:outline-none"
                  aria-label={t("showQrCode")}
                >
                  <QrCode className="h-3.5 w-3.5" />
                </Button>
              </Tooltip>
              <Tooltip
                content={
                  isFavorited ? t("removeFromFavorites") : t("addToFavorites")
                }
              >
                <Button
                  onClick={() => toggleFavorite(alias.email)}
                  variant="ghost"
                  size="icon"
                  className={`h-[22px] w-[22px] rounded p-0 transition-colors hover:bg-background focus:outline-none ${
                    isFavorited
                      ? "text-accent hover:text-accent"
                      : "text-muted-foreground hover:text-accent"
                  }`}
                  aria-label={
                    isFavorited
                      ? t("removeFromFavorites")
                      : t("addToFavorites")
                  }
                >
                  <Star
                    className="h-3.5 w-3.5"
                    fill={isFavorited ? "currentColor" : "none"}
                  />
                </Button>
              </Tooltip>
            </div>
          );
        },
      },
    ],
    [
      copyToClipboard,
      favorites,
      isSelectMode,
      selectedAliases,
      setQrAlias,
      toggleFavorite,
      toggleSelectAlias,
    ],
  );

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
    <div className="space-y-1.5">
      <Table
        data={paginatedAliases}
        columns={columns}
        getRowId={(alias) => alias.email}
        rowHeight={44}
        height="auto"
        defaultSort={null}
        emptyState={t("noResultsFound")}
        className="rounded-xl bg-card shadow-sm [&>div]:overflow-x-hidden [&_td]:min-w-0 [&_td]:px-2 [&_th]:bg-muted/80 [&_th]:px-2 [&_th]:text-foreground"
      />

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
    <div
      className={`group flex items-center gap-2 rounded-xl border px-2.5 py-2 transition-colors ${
        isSelected
          ? "border-primary/30 bg-primary/5"
          : "border-border bg-background hover:bg-muted/45"
      }`}
    >
      {isSelectMode && (
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelect}
          className="shrink-0"
          aria-label={alias.email}
        />
      )}
      <div className="min-w-0 flex-1">
        <div
          className="truncate font-mono text-[12px] leading-5 text-foreground"
          aria-label={alias.email}
        >
          {alias.email}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-0.5 rounded-lg bg-muted/60 p-0.5">
        <Tooltip content={t("showQrCode")}>
          <Button
            onClick={onShowQR}
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md p-0 text-muted-foreground transition-colors hover:bg-background hover:text-primary focus:outline-none"
            aria-label={t("showQrCode")}
          >
            <QrCode className="h-3.5 w-3.5" />
          </Button>
        </Tooltip>
        <Tooltip
          content={isFavorited ? t("removeFromFavorites") : t("addToFavorites")}
        >
          <Button
            onClick={onToggleFavorite}
            variant="ghost"
            size="icon"
            className={`h-7 w-7 rounded-md p-0 transition-colors hover:bg-background focus:outline-none ${
              isFavorited
                ? "text-accent hover:text-accent"
                : "text-muted-foreground hover:text-accent"
            }`}
            aria-label={
              isFavorited ? t("removeFromFavorites") : t("addToFavorites")
            }
          >
            <Star
              className="h-3.5 w-3.5"
              fill={isFavorited ? "currentColor" : "none"}
            />
          </Button>
        </Tooltip>
        <Tooltip content={t("copyToClipboard")}>
          <Button
            onClick={onCopy}
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md p-0 text-muted-foreground transition-colors hover:bg-background hover:text-primary focus:text-primary focus:outline-none"
            aria-label={t("copyToClipboard")}
          >
            {isCopied ? (
              <Check className="h-3.5 w-3.5 text-primary" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </Tooltip>
      </div>
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
    <div className="mt-3 rounded-xl border border-border bg-background p-2.5">
      <div className="flex flex-col gap-2.5">
        {/* Page info */}
        <div className="flex items-center justify-between gap-2">
          <div className="text-[11px] font-medium text-muted-foreground">
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
            <SelectTrigger className="min-h-8 rounded-lg bg-muted/50 px-2 py-1 text-xs">
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
            size="icon"
            className="h-8 w-8 rounded-lg p-0 text-[0] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
            aria-label={t("firstPage")}
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
            ⟪
          </Button>
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg p-0 text-[0] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
            aria-label={t("previousPage")}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
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
                      size="icon"
                      className={`h-8 w-8 rounded-lg p-0 text-xs transition-colors ${
                        currentPage === page
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-foreground hover:bg-muted"
                      }`}
                      aria-label={`Page ${page}`}
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
            size="icon"
            className="h-8 w-8 rounded-lg p-0 text-[0] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
            aria-label={t("nextPage")}
          >
            <ChevronRight className="h-3.5 w-3.5" />
            →
          </Button>
          <Button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg p-0 text-[0] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
            aria-label={t("lastPage")}
          >
            <ChevronsRight className="h-3.5 w-3.5" />
            ⟫
          </Button>
        </div>
      </div>
    </div>
  );
}



