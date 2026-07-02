/** Recent aliases list with search, filter, pagination, and bulk selection. */

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

  return (
    <div className="p-3.5">
      {/* Header with title and action buttons */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {viewMode === "all" ? "Recent Aliases" : "Favorites"}
        </h2>
        <div className="flex items-center gap-1.5">
          {viewMode === "all" && recentAliases.length > 0 && (
            <>
              <button
                onClick={() => exportAliases("csv")}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 px-1.5 py-0.5 rounded hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                title="Export as CSV"
              >
                CSV
              </button>
              <button
                onClick={() => exportAliases("json")}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 px-1.5 py-0.5 rounded hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                title="Export as JSON"
              >
                JSON
              </button>
              <button
                onClick={() => {
                  setIsSelectMode(!isSelectMode);
                  setSelectedAliases(new Set());
                }}
                className={`text-xs px-1.5 py-0.5 rounded transition-colors ${
                  isSelectMode
                    ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                    : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                }`}
                title="Select aliases"
              >
                Select
              </button>
            </>
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {viewMode === "all"
              ? `${recentAliases.length} total`
              : `${favorites.length} starred`}
          </span>
        </div>
      </div>

      {/* Bulk delete bar */}
      {isSelectMode && (
        <div className="mb-3 flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/40 rounded-lg">
          <button
            onClick={() => {
              if (selectedAliases.size === filteredAliases.length) {
                setSelectedAliases(new Set());
              } else {
                setSelectedAliases(
                  new Set(filteredAliases.map((a) => a.email)),
                );
              }
            }}
            className="text-xs text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-medium"
          >
            {selectedAliases.size === filteredAliases.length
              ? "Deselect All"
              : "Select All"}
          </button>
          <span className="text-xs text-gray-500 dark:text-gray-400 flex-1">
            {selectedAliases.size} selected
          </span>
          <button
            onClick={deleteSelected}
            disabled={selectedAliases.size === 0}
            className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Delete {selectedAliases.size > 0 ? selectedAliases.size : ""}
          </button>
        </div>
      )}

      {/* View mode tabs */}
      <div className="mb-3 flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <button
          onClick={() => setViewMode("all")}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            viewMode === "all"
              ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
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
            All ({recentAliases.length})
          </div>
        </button>
        <button
          onClick={() => setViewMode("favorites")}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            viewMode === "favorites"
              ? "bg-white dark:bg-gray-800 text-yellow-600 dark:text-yellow-400 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
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
            Favorites ({favorites.length})
          </div>
        </button>
      </div>

      {/* Search and filters */}
      <div className="mb-3 space-y-2">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search aliases..."
            className="w-full pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
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
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Tags</option>
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
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "recent" | "alphabetical")
            }
            className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="recent">📅 Most Recent</option>
            <option value="alphabetical">🔤 A-Z</option>
          </select>
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
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <svg
          className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600"
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
        <p className="text-sm font-medium mb-1">No favorites yet</p>
        <p className="text-xs">
          Star emails from your history to quick access them here
        </p>
      </div>
    );
  }

  if (filteredAliases.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
        <svg
          className="w-10 h-10 mx-auto mb-2 text-gray-300 dark:text-gray-600"
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
        <p className="text-sm font-medium mb-1">No results found</p>
        <p className="text-xs">Try a different search or filter</p>
      </div>
    );
  }

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
    <div className="flex items-center justify-between gap-0.5 px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md group transition-colors">
      {isSelectMode && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="mr-1.5 w-4 h-4 accent-blue-600 flex-shrink-0"
        />
      )}
      <span className="text-sm text-gray-700 dark:text-gray-200 font-mono break-all flex-1">
        {alias.email}
      </span>
      <button
        onClick={onShowQR}
        className="p-1.5 text-gray-300 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400 focus:outline-none transition-colors"
        title="Show QR code"
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
      </button>
      <button
        onClick={onToggleFavorite}
        className={`p-1.5 focus:outline-none transition-colors ${
          isFavorited
            ? "text-yellow-500 hover:text-yellow-600"
            : "text-gray-300 hover:text-yellow-500"
        }`}
        title={isFavorited ? "Remove from favorites" : "Add to favorites"}
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
      </button>
      <button
        onClick={onCopy}
        className="p-1.5 text-gray-400 hover:text-blue-600 focus:outline-none focus:text-blue-600 transition-colors"
        title="Copy to clipboard"
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
      </button>
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
  return (
    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
      <div className="flex flex-col gap-3">
        {/* Page info */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
            {totalItems}
          </div>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-2 py-1 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300"
            title="First page"
          >
            ⟪
          </button>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300"
            title="Previous page"
          >
            ←
          </button>
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
                      <span className="px-1 text-gray-400 dark:text-gray-500">
                        ...
                      </span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[28px] px-2 py-1 text-xs rounded transition-colors ${
                        currentPage === page
                          ? "bg-blue-600 text-white font-medium"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                );
              })}
          </div>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300"
            title="Next page"
          >
            →
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300"
            title="Last page"
          >
            ⟫
          </button>
        </div>
      </div>
    </div>
  );
}
