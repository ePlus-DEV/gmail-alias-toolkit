// skipcq: JS-0415 - Each interactive demo keeps its compact presentation markup close to its local state.
import { useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  Copy,
  History,
  Mail,
  MousePointer2,
  Plus,
  Search,
  Star,
  Tags,
  Users,
} from "lucide-react";
import {
  ACCOUNTS,
  ACTIVITY,
  PRESETS,
  TEXT,
  type AccountId,
  type DemoAccount,
  type Locale,
  type TabId,
} from "./content";

interface ProductTourProps {
  locale: Locale;
}

interface AccountSwitchProps {
  locale: Locale;
  active: AccountId;
  onChange: (id: AccountId) => void;
}

const CARD_CLASS =
  "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm";
const BUTTON_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:border-blue-300 hover:text-blue-700";
const TAB_ITEMS: Array<{
  id: TabId;
  icon: typeof History;
}> = [
  { id: "history", icon: History },
  { id: "statistics", icon: BarChart3 },
  { id: "presets", icon: Tags },
  { id: "accounts", icon: Users },
  { id: "context", icon: MousePointer2 },
];

/** Renders the interactive product tour for the extension's major workflows. */
export function ProductTour({ locale }: ProductTourProps) {
  const [tab, setTab] = useState<TabId>("history");
  const [accountId, setAccountId] = useState<AccountId>("personal");
  const text = TEXT[locale];
  const account = ACCOUNTS[accountId];

  return (
    <section
      id="product-tour"
      className="border-y border-slate-200 bg-slate-50 py-20"
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-black text-blue-600">{text.eyebrow}</p>
          <h2 className="mt-3 text-4xl font-black tracking-normal text-slate-950 md:text-5xl">
            {text.title}
          </h2>
          <p className="mt-4 leading-7 text-slate-600">{text.desc}</p>
        </div>

        <TourTabs locale={locale} active={tab} onChange={setTab} />

        <motion.div
          key={`${tab}-${accountId}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-2xl shadow-blue-950/10"
        >
          <AccountSwitch
            locale={locale}
            active={accountId}
            onChange={setAccountId}
          />
          <TourPanel
            locale={locale}
            tab={tab}
            account={account}
            accountId={accountId}
            onAccountChange={setAccountId}
          />
        </motion.div>
      </div>
    </section>
  );
}

/** Renders keyboard-accessible product-tour tabs. */
function TourTabs({
  locale,
  active,
  onChange,
}: {
  locale: Locale;
  active: TabId;
  onChange: (id: TabId) => void;
}) {
  const labels = TEXT[locale].tabs;
  return (
    <div className="mt-10 grid grid-cols-5 gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      {TAB_ITEMS.map(({ id, icon: Icon }) => (
        <button
          key={id}
          type="button"
          aria-pressed={active === id}
          onClick={() => onChange(id)}
          className={`flex min-h-12 min-w-32 items-center justify-center gap-2 rounded-xl px-3 text-xs font-black transition ${active === id ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"}`}
        >
          <Icon className="h-4 w-4" /> {labels[id]}
        </button>
      ))}
    </div>
  );
}

/** Chooses the correct demo for the active tour tab. */
function TourPanel({
  locale,
  tab,
  account,
  accountId,
  onAccountChange,
}: {
  locale: Locale;
  tab: TabId;
  account: DemoAccount;
  accountId: AccountId;
  onAccountChange: (id: AccountId) => void;
}) {
  switch (tab) {
    case "statistics":
      return (
        <StatisticsDemo
          locale={locale}
          account={account}
          accountId={accountId}
        />
      );
    case "presets":
      return <PresetsDemo locale={locale} account={account} />;
    case "accounts":
      return (
        <AccountsDemo
          locale={locale}
          active={accountId}
          onChange={onAccountChange}
        />
      );
    case "context":
      return <ContextDemo locale={locale} account={account} />;
    case "history":
    default:
      return <HistoryDemo locale={locale} account={account} />;
  }
}

/** Renders account switching shared by every tour tab. */
function AccountSwitch({ locale, active, onChange }: AccountSwitchProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs font-black uppercase text-slate-500">
        {TEXT[locale].switchAccount}
      </span>
      <div className="flex gap-2">
        {(Object.keys(ACCOUNTS) as AccountId[]).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`${BUTTON_CLASS} flex-1 ${active === id ? "border-blue-300 bg-blue-50 text-blue-700" : ""}`}
          >
            <Mail className="h-4 w-4" /> {ACCOUNTS[id].label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Renders searchable history with favorite and copy actions. */
function HistoryDemo({
  locale,
  account,
}: {
  locale: Locale;
  account: DemoAccount;
}) {
  const text = TEXT[locale];
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(
    () => new Set(["p1", "w1"]),
  );
  const [copied, setCopied] = useState<string | null>(null);
  const needle = query.trim().toLowerCase();
  const rows = account.aliases.filter((item) => {
    const matchesQuery =
      !needle ||
      [item.alias, item.tag, item.source].some((value) =>
        value.toLowerCase().includes(needle),
      );
    return matchesQuery && (!favoritesOnly || favorites.has(item.id));
  });

  /** Toggles one alias in the demo favorites set. */
  const toggleFavorite = (id: string) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  /** Copies an alias and briefly displays success feedback. */
  const copyAlias = async (alias: string) => {
    try {
      await navigator.clipboard.writeText(alias);
    } catch {
      setCopied(null);
      return;
    }
    setCopied(alias);
    window.setTimeout(() => setCopied(null), 1200);
  };

  return (
    <DemoLayout
      icon={<History />}
      title={text.historyTitle}
      desc={text.historyDesc}
    >
      <label className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={text.search}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none"
        />
      </label>
      <div className="mt-3 flex gap-2">
        <FilterButton
          active={!favoritesOnly}
          onClick={() => setFavoritesOnly(false)}
        >
          {text.all}
        </FilterButton>
        <FilterButton
          active={favoritesOnly}
          onClick={() => setFavoritesOnly(true)}
        >
          <Star className="h-4 w-4" /> {text.favorites}
        </FilterButton>
      </div>
      <HistoryRows
        rows={rows}
        favorites={favorites}
        copied={copied}
        emptyLabel={text.empty}
        favoriteLabel={text.favorites}
        onFavorite={toggleFavorite}
        onCopy={copyAlias}
      />
    </DemoLayout>
  );
}

/** Renders one history filter action. */
function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${BUTTON_CLASS} ${active ? "border-blue-300 bg-blue-50 text-blue-700" : ""}`}
    >
      {children}
    </button>
  );
}

/** Renders filtered history rows and their actions. */
function HistoryRows({
  rows,
  favorites,
  copied,
  emptyLabel,
  favoriteLabel,
  onFavorite,
  onCopy,
}: {
  rows: DemoAccount["aliases"];
  favorites: Set<string>;
  copied: string | null;
  emptyLabel: string;
  favoriteLabel: string;
  onFavorite: (id: string) => void;
  onCopy: (alias: string) => void;
}) {
  if (!rows.length) {
    return (
      <div className="mt-3 rounded-xl border border-slate-200 p-10 text-center text-sm text-slate-500">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
      {rows.map((item) => {
        const isFavorite = favorites.has(item.id);
        return (
          <div
            key={item.id}
            className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 border-b border-slate-100 px-3 py-3 last:border-b-0"
          >
            <div className="min-w-0">
              <p className="truncate font-mono text-xs font-bold text-slate-800">
                {item.alias}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                {item.source} · #{item.tag}
              </p>
            </div>
            <button
              type="button"
              aria-label={`${favoriteLabel}: ${item.alias}`}
              onClick={() => onFavorite(item.id)}
              className={`grid h-8 w-8 place-items-center rounded-lg ${isFavorite ? "bg-amber-50 text-amber-500" : "text-slate-300 hover:bg-slate-50"}`}
            >
              <Star
                className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
              />
            </button>
            <button
              type="button"
              aria-label={`Copy ${item.alias}`}
              onClick={() => onCopy(item.alias)}
              className="grid h-8 w-8 place-items-center rounded-lg text-blue-600 hover:bg-blue-50"
            >
              {copied === item.alias ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}

/** Renders account-specific metrics and an activity chart. */
function StatisticsDemo({
  locale,
  account,
  accountId,
}: {
  locale: Locale;
  account: DemoAccount;
  accountId: AccountId;
}) {
  const text = TEXT[locale];
  const topTag = account.aliases[0]?.tag ?? "—";
  const metrics = [
    { label: text.total, value: account.aliases.length },
    { label: text.today, value: 2 },
    { label: text.tags, value: account.aliases.length },
    { label: text.topTag, value: `#${topTag}` },
  ];

  return (
    <DemoLayout
      icon={<BarChart3 />}
      title={text.statsTitle}
      desc={text.statsDesc}
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className={CARD_CLASS}>
            <p className="text-xs font-bold text-slate-500">{metric.label}</p>
            <p className="mt-2 text-2xl font-black text-slate-950">
              {metric.value}
            </p>
          </div>
        ))}
      </div>
      <div className={`${CARD_CLASS} mt-3`}>
        <p className="text-sm font-black text-slate-800">{text.activity}</p>
        <div className="mt-8 flex h-36 items-end gap-3 border-b border-slate-200 px-2">
          {ACTIVITY[accountId].map((item) => (
            <div
              key={item.day}
              className="relative flex-1 rounded-t-xl bg-gradient-to-t from-blue-600 to-blue-400"
              style={{ height: `${18 + item.value * 15}%` }}
            >
              <span className="absolute -top-6 inset-x-0 text-center text-[10px] font-bold text-slate-500">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DemoLayout>
  );
}

/** Renders preset selection and a live alias preview. */
function PresetsDemo({
  locale,
  account,
}: {
  locale: Locale;
  account: DemoAccount;
}) {
  const text = TEXT[locale];
  const [selected, setSelected] = useState<(typeof PRESETS)[number]>("shopping");
  const [custom, setCustom] = useState("");
  const [used, setUsed] = useState(false);
  const [name = "user", domain = "gmail.com"] = account.email.split("@");
  const tag = custom.trim().replace(/\s+/g, "-") || selected;
  const alias = `${name}+${tag}@${domain}`;

  /** Selects a built-in preset and resets the preview state. */
  const selectPreset = (preset: (typeof PRESETS)[number]) => {
    setSelected(preset);
    setCustom("");
    setUsed(false);
  };

  return (
    <DemoLayout
      icon={<Tags />}
      title={text.presetsTitle}
      desc={text.presetsDesc}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => selectPreset(preset)}
            className={`${CARD_CLASS} text-left transition hover:border-blue-300 ${selected === preset && !custom ? "border-blue-400 bg-blue-50" : ""}`}
          >
            <Tags className="h-4 w-4 text-blue-600" />
            <p className="mt-3 text-sm font-black capitalize text-slate-950">
              {preset}
            </p>
            <p className="mt-1 font-mono text-xs text-slate-500">+{preset}</p>
          </button>
        ))}
      </div>
      <label className="mt-4 block">
        <span className="text-xs font-black text-slate-600">
          {text.customTag}
        </span>
        <div className="mt-2 flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
          <Plus className="h-4 w-4 text-blue-600" />
          <input
            value={custom}
            onChange={(event) => {
              setCustom(event.target.value);
              setUsed(false);
            }}
            placeholder={text.placeholder}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </label>
      <div className="mt-4 grid gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-500">{text.preview}</p>
          <p className="mt-1 truncate font-mono text-sm font-black text-blue-800">
            {alias}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setUsed(true)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-black text-white"
        >
          {used ? (
            <Check className="h-4 w-4" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
          {used ? text.used : text.useAlias}
        </button>
      </div>
    </DemoLayout>
  );
}

/** Renders multi-account data isolation. */
function AccountsDemo({
  locale,
  active,
  onChange,
}: {
  locale: Locale;
  active: AccountId;
  onChange: (id: AccountId) => void;
}) {
  const text = TEXT[locale];
  return (
    <DemoLayout
      icon={<Users />}
      title={text.accountsTitle}
      desc={text.accountsDesc}
    >
      <div className="space-y-3">
        {(Object.keys(ACCOUNTS) as AccountId[]).map((id) => {
          const account = ACCOUNTS[id];
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border p-4 text-left transition ${isActive ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-200"}`}
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 font-black text-white">
                {account.label.charAt(0)}
              </span>
              <span className="min-w-0">
                <strong className="block text-sm text-slate-950">
                  {account.label}
                </strong>
                <small className="mt-1 block truncate text-xs text-slate-500">
                  {account.email} · {account.aliases.length} {text.saved}
                </small>
              </span>
              {isActive ? (
                <b className="rounded-full bg-blue-100 px-2 py-1 text-[10px] text-blue-700">
                  {text.active}
                </b>
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-400" />
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-dashed border-blue-300 bg-blue-50 p-3 text-xs font-black text-blue-700">
        <Check className="h-4 w-4" /> {text.isolated}
      </div>
    </DemoLayout>
  );
}

/** Renders a simulated website form and extension context menu. */
function ContextDemo({
  locale,
  account,
}: {
  locale: Locale;
  account: DemoAccount;
}) {
  const text = TEXT[locale];
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState("");
  const suggestions = [account.aliases[0]?.alias ?? account.email, account.email];

  /** Fills the simulated form with a selected alias. */
  const selectAlias = (alias: string) => {
    setValue(alias);
    setOpen(false);
  };

  return (
    <DemoLayout
      icon={<MousePointer2 />}
      title={text.contextTitle}
      desc={text.contextDesc}
    >
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        <BrowserBar />
        <div className="relative min-h-[340px] p-6 text-slate-950">
          <h4 className="text-xl font-black">{text.formTitle}</h4>
          <label className="mt-5 block max-w-md">
            <span className="mb-2 block text-xs font-black text-slate-700">
              {text.email}
            </span>
            <input
              value={value}
              readOnly
              placeholder={account.email}
              onContextMenu={(event) => {
                event.preventDefault();
                setOpen(true);
              }}
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm"
            />
          </label>
          <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <MousePointer2 className="h-4 w-4" /> {text.rightClick}
          </p>
          {open ? (
            <ContextMenu suggestions={suggestions} onSelect={selectAlias} />
          ) : (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-4 inline-flex max-w-full items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs font-black text-green-700"
            >
              <Check className="h-4 w-4" />
              <span className="truncate">
                {text.filled}: {value}
              </span>
            </button>
          )}
        </div>
      </div>
    </DemoLayout>
  );
}

/** Renders a decorative browser bar for the context-menu demo. */
function BrowserBar() {
  return (
    <div className="flex h-11 items-center gap-2 bg-slate-950 px-3">
      <i className="h-2 w-2 rounded-full bg-red-400" />
      <i className="h-2 w-2 rounded-full bg-amber-400" />
      <i className="h-2 w-2 rounded-full bg-green-400" />
      <span className="ml-2 text-[10px] font-bold text-slate-400">
        newsletter.example.com
      </span>
    </div>
  );
}

/** Renders the simulated extension context menu. */
function ContextMenu({
  suggestions,
  onSelect,
}: {
  suggestions: string[];
  onSelect: (alias: string) => void;
}) {
  return (
    <div className="absolute left-8 top-40 w-[min(310px,calc(100%-4rem))] overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xl">
      <p className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black">
        Gmail Alias Toolkit
      </p>
      {suggestions.map((alias) => (
        <button
          key={alias}
          type="button"
          onClick={() => onSelect(alias)}
          className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 border-b border-slate-100 px-3 py-3 text-left text-xs hover:bg-blue-50"
        >
          <Mail className="h-4 w-4 text-blue-600" />
          <span className="truncate font-mono">{alias}</span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </button>
      ))}
    </div>
  );
}

/** Provides the shared two-column layout for product-tour demos. */
function DemoLayout({
  icon,
  title,
  desc,
  children,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-[500px] lg:grid-cols-[minmax(260px,0.72fr)_minmax(0,1.28fr)]">
      <div className="border-b border-slate-200 bg-slate-50 p-8 lg:border-b-0 lg:border-r">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 [&>svg]:h-5 [&>svg]:w-5">
          {icon}
        </span>
        <h3 className="mt-6 text-3xl font-black tracking-tight text-slate-950">
          {title}
        </h3>
        <p className="mt-4 leading-7 text-slate-600">{desc}</p>
      </div>
      <div className="p-4 sm:p-6 lg:p-8">{children}</div>
    </div>
  );
}
