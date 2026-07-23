import { useEffect, useState } from "react";
import { t } from "../../../lib/i18n";
import { filterDisabledInlineSites } from "src/utils/inlineSiteSettings";
import Button from "./Button";
import Input from "./Input";

const INLINE_SITES_PAGE_SIZE = 5;

interface DisabledInlineSitesPanelProps {
  sites: string[];
  onEnable: (site: string) => Promise<void>;
}

/** Renders searchable, paginated controls for websites with the inline helper disabled. */
export default function DisabledInlineSitesPanel({
  sites,
  onEnable,
}: DisabledInlineSitesPanelProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const filteredSites = filterDisabledInlineSites(sites, query);
  const pageCount = Math.max(
    1,
    Math.ceil(filteredSites.length / INLINE_SITES_PAGE_SIZE),
  );
  const currentPage = Math.min(page, pageCount);
  const startIndex = (currentPage - 1) * INLINE_SITES_PAGE_SIZE;
  const visibleSites = filteredSites.slice(
    startIndex,
    startIndex + INLINE_SITES_PAGE_SIZE,
  );

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  /** Updates the search query and returns to the first page. */
  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  /** Shows the previous disabled-sites page. */
  const showPreviousPage = () => setPage((current) => Math.max(1, current - 1));

  /** Shows the next disabled-sites page. */
  const showNextPage = () =>
    setPage((current) => Math.min(pageCount, current + 1));

  if (sites.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-3 py-3 text-center text-xs text-muted-foreground">
        {t("noDisabledSites")}
      </p>
    );
  }

  return (
    <div className="space-y-2.5">
      {sites.length > INLINE_SITES_PAGE_SIZE && (
        <Input
          type="search"
          value={query}
          onChange={handleQueryChange}
          placeholder={t("search")}
          className="w-full"
        />
      )}

      {visibleSites.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-3 py-3 text-center text-xs text-muted-foreground">
          {t("noDisabledSites")}
        </p>
      ) : (
        <div className="space-y-1.5">
          {visibleSites.map((site) => (
            <div
              key={site}
              className="flex items-center justify-between gap-2 rounded-xl border border-border bg-muted/45 px-3 py-2"
            >
              <span
                className="min-w-0 truncate font-mono text-xs text-foreground"
                title={site}
              >
                {site}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 rounded-lg px-2 text-xs text-primary hover:bg-primary/10"
                onClick={() => void onEnable(site)}
                aria-label={`${t("enableInlineForSite")}: ${site}`}
              >
                {t("enableInlineForSite")}
              </Button>
            </div>
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex items-center justify-between border-t border-border/70 pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-lg p-0"
            onClick={showPreviousPage}
            disabled={currentPage === 1}
            aria-label={t("pageLabel", String(Math.max(1, currentPage - 1)))}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Button>
          <span
            className="text-xs font-medium text-muted-foreground"
            aria-live="polite"
          >
            {currentPage} / {pageCount}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-lg p-0"
            onClick={showNextPage}
            disabled={currentPage === pageCount}
            aria-label={t(
              "pageLabel",
              String(Math.min(pageCount, currentPage + 1)),
            )}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        </div>
      )}
    </div>
  );
}
