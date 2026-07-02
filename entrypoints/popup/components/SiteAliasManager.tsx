import { useEffect, useMemo, useState } from "react";
import { getHostnameFromUrl, normalizeDomain } from "../../../src/utils/domain";
import {
  detectCategory,
  CATEGORY_MAP,
  labelForCategory,
} from "../../../src/utils/categoryDetector";
import {
  generateAliasSuggestions,
  isGmailAddress,
} from "../../../src/utils/aliasGenerator";
import {
  buildGmailFilterQuery,
  buildGmailSearchUrl,
} from "../../../src/utils/gmailFilter";
import { calculateAliasQuality } from "../../../src/utils/qualityScore";
import {
  deleteSiteAlias,
  loadAliasData,
  migrateStorageIfNeeded,
  saveSiteAlias,
  touchAlias,
  updateAliasStatus,
} from "../../../src/utils/storage";
import type {
  AliasCategory,
  AliasStatus,
  SiteAlias,
} from "../../../src/types/alias";

interface Props {
  baseEmail: string;
  gmailAccountIndex?: number;
  onAliasUsed?: (email: string) => void;
}

const statuses: AliasStatus[] = [
  "normal",
  "important",
  "spam",
  "leaked",
  "inactive",
];
const categories = Object.keys(CATEGORY_MAP) as AliasCategory[];
const nowIso = () => new Date().toISOString();
const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function SiteAliasManager({
  baseEmail,
  gmailAccountIndex = 0,
  onAliasUsed,
}: Props) {
  const [hostname, setHostname] = useState<string | null>(null);
  const [manualHost, setManualHost] = useState("");
  const [aliases, setAliases] = useState<Record<string, SiteAlias>>({});
  const [toast, setToast] = useState("");
  const [showDashboard, setShowDashboard] = useState(false);
  const [purpose, setPurpose] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AliasStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | AliasCategory>(
    "all",
  );
  const [sortBy, setSortBy] = useState<"lastUsedAt" | "createdAt" | "useCount">(
    "lastUsedAt",
  );

  const activeHost = hostname || manualHost.trim().toLowerCase() || null;
  const normalizedDomain = activeHost ? normalizeDomain(activeHost) : "";
  const category = normalizedDomain
    ? detectCategory(normalizedDomain, activeHost || "")
    : "other";
  const previous = activeHost ? aliases[activeHost] : undefined;

  const suggestions = useMemo(() => {
    try {
      return baseEmail && normalizedDomain
        ? generateAliasSuggestions({
            baseEmail,
            domainKeyword: normalizedDomain,
            category,
            purpose,
          })
        : [];
    } catch {
      return [];
    }
  }, [baseEmail, normalizedDomain, category, purpose]);

  const activeAlias = previous?.alias || suggestions[0]?.alias || "";
  const quality = activeAlias
    ? calculateAliasQuality(previous || suggestions[0])
    : null;

  useEffect(() => {
    (async () => {
      await migrateStorageIfNeeded();
      const data = await loadAliasData();
      setAliases(data.siteAliases);
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      setHostname(tab?.url ? getHostnameFromUrl(tab.url) : null);
    })();
  }, []);

  const notify = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  };

  const rememberUse = async (email: string) => {
    onAliasUsed?.(email);
    if (activeHost && aliases[activeHost]) {
      const updated = await touchAlias(activeHost);
      if (updated)
        setAliases((current) => ({ ...current, [activeHost]: updated }));
    }
  };

  const saveAlias = async (email = activeAlias) => {
    if (!activeHost || !email) return;
    const existing = aliases[activeHost];
    const siteAlias: SiteAlias = {
      id: existing?.id || newId(),
      hostname: activeHost,
      normalizedDomain,
      baseEmail,
      alias: email,
      category,
      note: existing?.note || "",
      status: existing?.status || "normal",
      createdAt: existing?.createdAt || nowIso(),
      updatedAt: nowIso(),
      lastUsedAt: existing?.lastUsedAt,
      useCount: existing?.useCount || 0,
    };
    await saveSiteAlias(siteAlias);
    setAliases((current) => ({ ...current, [activeHost]: siteAlias }));
    notify("Saved locally for this website");
  };

  const copyAlias = async (email = activeAlias) => {
    await navigator.clipboard.writeText(email);
    await rememberUse(email);
    notify("Alias copied");
  };

  const autofillAlias = async (email = activeAlias) => {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const response = tab?.id
      ? await browser.tabs
          .sendMessage(tab.id, { action: "autofillAlias", email })
          .catch(() => ({ ok: false }))
      : { ok: false };
    if (!response?.ok) {
      await navigator.clipboard.writeText(email);
      notify("No email input found; copied instead");
    } else {
      notify("Alias autofilled");
    }
    await rememberUse(email);
  };

  const setStatus = async (alias: SiteAlias, status: AliasStatus) => {
    await updateAliasStatus(alias.hostname, status);
    setAliases((current) => ({
      ...current,
      [alias.hostname]: { ...alias, status, updatedAt: nowIso() },
    }));
  };

  const editNote = async (alias: SiteAlias) => {
    const note = prompt("Alias note", alias.note || "");
    if (note === null) return;
    const updated = { ...alias, note, updatedAt: nowIso() };
    await saveSiteAlias(updated);
    setAliases((current) => ({ ...current, [alias.hostname]: updated }));
  };

  const removeAlias = async (alias: SiteAlias) => {
    if (!confirm(`Delete alias for ${alias.hostname}?`)) return;
    await deleteSiteAlias(alias.hostname);
    setAliases((current) => {
      const next = { ...current };
      delete next[alias.hostname];
      return next;
    });
  };

  const exportJson = async () => {
    const data = await loadAliasData();
    download(
      `gmail-alias-toolkit-${Date.now()}.json`,
      JSON.stringify(
        {
          version: 1,
          exportedAt: nowIso(),
          siteAliases: data.siteAliases,
          settings: data.settings,
        },
        null,
        2,
      ),
      "application/json",
    );
  };

  const exportCsv = () => {
    const header =
      "hostname,normalizedDomain,alias,baseEmail,category,status,note,createdAt,lastUsedAt,useCount";
    const lines = Object.values(aliases).map((alias) =>
      [
        alias.hostname,
        alias.normalizedDomain,
        alias.alias,
        alias.baseEmail,
        alias.category,
        alias.status,
        alias.note || "",
        alias.createdAt,
        alias.lastUsedAt || "",
        alias.useCount,
      ]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(","),
    );
    download(
      `gmail-aliases-${Date.now()}.csv`,
      [header, ...lines].join("\n"),
      "text/csv",
    );
  };

  const importJson = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const parsed = JSON.parse(await file.text());
        if (!parsed.siteAliases || typeof parsed.siteAliases !== "object")
          throw new Error("Missing siteAliases");
        const next = { ...aliases };
        for (const alias of Object.values(parsed.siteAliases) as SiteAlias[]) {
          if (!alias.hostname || !alias.alias || !alias.alias.includes("@"))
            throw new Error("Invalid alias record");
          next[alias.hostname] = alias;
        }
        await browser.storage.local.set({
          backup_before_import: await loadAliasData(),
          siteAliases: next,
        });
        setAliases(next);
        notify("Imported aliases");
      } catch (error: any) {
        notify(`Import failed: ${error.message}`);
      }
    };
    input.click();
  };

  const download = (filename: string, content: string, type: string) => {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const rows = Object.values(aliases)
    .filter(
      (alias) =>
        (statusFilter === "all" || alias.status === statusFilter) &&
        (categoryFilter === "all" || alias.category === categoryFilter) &&
        `${alias.hostname} ${alias.alias} ${alias.note || ""}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sortBy === "useCount"
        ? b.useCount - a.useCount
        : String(b[sortBy] || "").localeCompare(String(a[sortBy] || "")),
    );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-gray-900">
            Website Alias Manager
          </h2>
          <p className="text-xs text-gray-500">
            Local-first. No account. No server. No tracking.
          </p>
        </div>
        <button
          onClick={() => setShowDashboard(!showDashboard)}
          className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          {showDashboard ? "Generator" : "Dashboard"}
        </button>
      </div>

      {!showDashboard ? (
        <>
          <div className="bg-blue-50 border border-blue-100 rounded-md p-3">
            <p className="text-[11px] uppercase tracking-wide text-blue-700 font-semibold">
              Current site
            </p>
            {hostname ? (
              <p className="text-sm font-medium text-gray-900">{hostname}</p>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-gray-600">
                  Manual mode: this page URL cannot be used.
                </p>
                <input
                  value={manualHost}
                  onChange={(event) => setManualHost(event.target.value)}
                  placeholder="github.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            )}
          </div>

          {!isGmailAddress(baseEmail) && (
            <p className="text-xs text-amber-600">
              Only Gmail/Googlemail plus aliases are supported for website
              aliases.
            </p>
          )}

          {previous && (
            <div className="border border-green-200 bg-green-50 rounded-md p-3 space-y-2">
              <p className="text-xs font-semibold text-green-700">
                Previously used for this site
              </p>
              <p className="text-sm font-mono break-all text-gray-900">
                {previous.alias}
              </p>
              {["spam", "leaked"].includes(previous.status) && (
                <p className="text-xs text-amber-700">
                  This alias may have been shared or leaked. Consider creating a
                  new alias for this website.
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => autofillAlias(previous.alias)}
                  className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md"
                >
                  Autofill again
                </button>
                <button
                  onClick={() => copyAlias(previous.alias)}
                  className="px-3 py-1.5 text-xs bg-gray-100 rounded-md"
                >
                  Copy
                </button>
                {(
                  ["important", "spam", "leaked", "inactive"] as AliasStatus[]
                ).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatus(previous, status)}
                    className="px-3 py-1.5 text-xs bg-gray-100 rounded-md"
                  >
                    Mark {status}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-gray-700 mb-1">
              Suggested alias
            </p>
            <div className="font-mono text-sm break-all bg-gray-50 border border-gray-200 rounded-md p-3">
              {activeAlias ||
                "Add a Gmail account and supported website first."}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              disabled={!activeAlias}
              onClick={() => autofillAlias()}
              className="px-3 py-2 text-xs bg-blue-600 text-white rounded-md disabled:opacity-50"
            >
              Autofill
            </button>
            <button
              disabled={!activeAlias}
              onClick={() => copyAlias()}
              className="px-3 py-2 text-xs bg-gray-100 rounded-md disabled:opacity-50"
            >
              Copy
            </button>
            <button
              disabled={!activeAlias || !activeHost}
              onClick={() => saveAlias()}
              className="px-3 py-2 text-xs bg-green-600 text-white rounded-md disabled:opacity-50"
            >
              Save
            </button>
          </div>

          <input
            value={purpose}
            onChange={(event) => setPurpose(event.target.value)}
            placeholder="Optional purpose (e.g., jobs, invoices)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />

          {suggestions.length > 1 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-700">
                Other suggestions
              </p>
              {suggestions.slice(1).map((suggestion) => (
                <div
                  key={suggestion.alias}
                  className="flex items-center justify-between gap-2 bg-gray-50 border border-gray-200 rounded-md p-2"
                >
                  <span className="font-mono text-xs break-all">
                    {suggestion.alias}
                  </span>
                  <button
                    onClick={() => saveAlias(suggestion.alias)}
                    className="px-2 py-1 text-xs bg-white border border-gray-200 rounded"
                  >
                    Save
                  </button>
                </div>
              ))}
            </div>
          )}

          {quality && (
            <div className="text-xs bg-amber-50 border border-amber-100 rounded-md p-3 text-gray-700">
              <p>
                <strong>Alias quality:</strong> {quality.label} ({quality.score}
                )
              </p>
              <p>
                <strong>Tracking quality:</strong> {quality.trackingLevel}
              </p>
              <p>
                <strong>Privacy level:</strong> Basic
              </p>
              <p className="text-amber-700">
                Gmail plus aliases help with filtering and tracking, but they do
                not hide your real Gmail address.
              </p>
            </div>
          )}

          {activeAlias && (
            <div className="text-xs bg-gray-50 border border-gray-200 rounded-md p-3 space-y-2">
              <p className="font-semibold text-gray-800">
                Gmail filter suggestion
              </p>
              <p>
                To: <span className="font-mono">{activeAlias}</span>
              </p>
              <p>Apply label: {labelForCategory(category)}</p>
              <p>Optional: Skip Inbox</p>
              <div className="flex gap-2">
                <button
                  onClick={() => copyAlias(buildGmailFilterQuery(activeAlias))}
                  className="px-2 py-1 text-xs bg-white border border-gray-200 rounded"
                >
                  Copy filter query
                </button>
                <button
                  onClick={() =>
                    browser.tabs.create({
                      url: buildGmailSearchUrl(activeAlias, gmailAccountIndex),
                    })
                  }
                  className="px-2 py-1 text-xs bg-white border border-gray-200 rounded"
                >
                  Open Gmail search
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search aliases"
              className="px-3 py-2 border border-gray-300 rounded-md text-xs"
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-xs"
            >
              <option value="all">All statuses</option>
              {statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-xs"
            >
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-xs"
            >
              <option value="lastUsedAt">Sort by last used</option>
              <option value="createdAt">Sort by created date</option>
              <option value="useCount">Sort by use count</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={exportJson}
              className="px-3 py-1.5 text-xs bg-gray-100 rounded-md"
            >
              Export JSON
            </button>
            <button
              onClick={exportCsv}
              className="px-3 py-1.5 text-xs bg-gray-100 rounded-md"
            >
              Export CSV
            </button>
            <button
              onClick={importJson}
              className="px-3 py-1.5 text-xs bg-gray-100 rounded-md"
            >
              Import JSON
            </button>
          </div>
          {rows.length === 0 ? (
            <p className="text-xs text-gray-500">
              No aliases saved yet. Create your first website alias from the
              popup.
            </p>
          ) : (
            rows.map((alias) => (
              <div
                key={alias.id}
                className="border border-gray-200 rounded-md p-3 space-y-2"
              >
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {alias.hostname}
                    </p>
                    <p className="text-xs font-mono break-all text-gray-600">
                      {alias.alias}
                    </p>
                  </div>
                  <span className="text-[11px] px-2 py-1 bg-gray-100 rounded-full h-fit">
                    {alias.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {alias.category} · used {alias.useCount}x · last{" "}
                  {alias.lastUsedAt?.slice(0, 10) || "never"}
                </p>
                {alias.note && (
                  <p className="text-xs text-gray-700">Note: {alias.note}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => copyAlias(alias.alias)}
                    className="px-2 py-1 text-xs bg-gray-100 rounded"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => autofillAlias(alias.alias)}
                    className="px-2 py-1 text-xs bg-gray-100 rounded"
                  >
                    Autofill
                  </button>
                  <button
                    onClick={() => editNote(alias)}
                    className="px-2 py-1 text-xs bg-gray-100 rounded"
                  >
                    Edit note
                  </button>
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatus(alias, status)}
                      className="px-2 py-1 text-xs bg-gray-100 rounded"
                    >
                      {status}
                    </button>
                  ))}
                  <button
                    onClick={() => removeAlias(alias)}
                    className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-md p-3">
        <strong>Privacy:</strong> No account required. No server. No tracking.
        Alias data is stored locally in your browser. Gmail plus aliases help
        with filtering and tracking, but they do not hide your real Gmail
        address.
      </div>
      {toast && (
        <div className="fixed bottom-14 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-xs animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
