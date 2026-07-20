// skipcq: JS-0415 - Product-tour demos are colocated to keep shared state and localized copy together.
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  History,
  Mail,
  MousePointer2,
  Plus,
  Search,
  Star,
  Tags,
  Users,
} from "lucide-react";

type Locale = "vi" | "en";
type TabId = "history" | "statistics" | "presets" | "accounts" | "context";
type AccountId = "personal" | "work";

interface PhaseTwoSectionsProps {
  locale: Locale;
}

interface AliasItem {
  id: string;
  alias: string;
  tag: string;
  source: string;
}

interface DemoAccount {
  label: string;
  email: string;
  aliases: AliasItem[];
}

const ACCOUNTS: Record<AccountId, DemoAccount> = {
  personal: {
    label: "Personal",
    email: "david@gmail.com",
    aliases: [
      {
        id: "p1",
        alias: "david+shopping@gmail.com",
        tag: "shopping",
        source: "Paddy",
      },
      {
        id: "p2",
        alias: "david+travel@gmail.com",
        tag: "travel",
        source: "Booking",
      },
      {
        id: "p3",
        alias: "david+newsletter@gmail.com",
        tag: "newsletter",
        source: "Hashnode",
      },
      {
        id: "p4",
        alias: "david+finance@gmail.com",
        tag: "finance",
        source: "PayPal",
      },
    ],
  },
  work: {
    label: "Work",
    email: "dev@eplus.dev",
    aliases: [
      {
        id: "w1",
        alias: "dev+github@eplus.dev",
        tag: "github",
        source: "GitHub",
      },
      {
        id: "w2",
        alias: "dev+cloud@eplus.dev",
        tag: "cloud",
        source: "Google Cloud",
      },
      {
        id: "w3",
        alias: "dev+testing@eplus.dev",
        tag: "testing",
        source: "Staging",
      },
    ],
  },
};

const TEXT = {
  vi: {
    eyebrow: "Khám phá sản phẩm",
    title: "Không chỉ tạo alias — quản lý toàn bộ vòng đời.",
    desc: "Thử trực tiếp lịch sử, thống kê, preset, nhiều tài khoản và context menu ngay trên landing page.",
    tabs: ["Lịch sử", "Thống kê", "Preset", "Tài khoản", "Context menu"],
    switchAccount: "Chuyển tài khoản",
    historyTitle: "Tìm và dùng lại alias trong vài giây",
    historyDesc:
      "Tìm theo alias, website hoặc tag; đánh dấu yêu thích và sao chép lại ngay.",
    search: "Tìm alias, tag hoặc website...",
    all: "Tất cả",
    favorites: "Yêu thích",
    empty: "Không tìm thấy alias phù hợp.",
    statsTitle: "Số liệu được tách riêng cho từng account",
    statsDesc:
      "Theo dõi tổng alias, tag phổ biến và hoạt động mà không gửi dữ liệu ra ngoài.",
    total: "Tổng alias",
    today: "Hôm nay",
    tags: "Số tag",
    topTag: "Tag phổ biến",
    activity: "Hoạt động 7 ngày",
    presetsTitle: "Tạo alias nhất quán bằng preset",
    presetsDesc: "Chọn preset có sẵn hoặc nhập tag riêng để xem trước địa chỉ.",
    customTag: "Tag tùy chỉnh",
    placeholder: "Ví dụ: project-alpha",
    preview: "Alias xem trước",
    useAlias: "Dùng alias này",
    used: "Đã chọn alias",
    accountsTitle: "Personal và Work không trộn dữ liệu",
    accountsDesc:
      "Mỗi account có history, favorite, statistics và preset riêng.",
    active: "Đang dùng",
    saved: "alias đã lưu",
    isolated: "Dữ liệu được cô lập theo account",
    contextTitle: "Tạo alias ngay tại ô email",
    contextDesc:
      "Chuột phải vào ô email để dùng gợi ý theo website mà không cần mở popup chính.",
    formTitle: "Đăng ký nhận bản tin",
    email: "Địa chỉ email",
    rightClick: "Nhấp chuột phải vào ô email",
    filled: "Đã điền alias",
    installEyebrow: "Cài đặt thủ công",
    installTitle: "Dùng ngay cả khi trình duyệt chưa có store chính thức.",
    installDesc:
      "Tải package từ GitHub Releases và giữ nguyên thư mục để cập nhật không mất settings.",
    chromium: "Chrome / Edge / Opera",
    firefox: "Firefox",
    chromiumSteps: [
      "Tải và giải nén package đúng với trình duyệt.",
      "Mở trang Extensions và bật Developer mode.",
      "Chọn Load unpacked rồi mở thư mục vừa giải nén.",
      "Khi cập nhật, thay file trong cùng thư mục và nhấn Reload.",
    ],
    firefoxSteps: [
      "Tải và giải nén package Firefox.",
      "Mở about:debugging#/runtime/this-firefox.",
      "Chọn Load Temporary Add-on và mở manifest.json.",
      "Để cài ổn định, ưu tiên bản trên Firefox Add-ons.",
    ],
    release: "Mở GitHub Releases",
    guide: "Xem hướng dẫn đầy đủ",
    warning: "Cài thủ công không tự động cập nhật.",
  },
  en: {
    eyebrow: "Product tour",
    title: "More than generation — manage the full alias lifecycle.",
    desc: "Try history, statistics, presets, multiple accounts and the context menu directly on the landing page.",
    tabs: ["History", "Statistics", "Presets", "Accounts", "Context menu"],
    switchAccount: "Switch account",
    historyTitle: "Find and reuse an alias in seconds",
    historyDesc:
      "Search by alias, website or tag; favorite and copy it immediately.",
    search: "Search alias, tag or website...",
    all: "All",
    favorites: "Favorites",
    empty: "No matching aliases found.",
    statsTitle: "Statistics stay isolated per account",
    statsDesc:
      "Track totals, top tags and recent activity without sending data anywhere.",
    total: "Total aliases",
    today: "Created today",
    tags: "Unique tags",
    topTag: "Top tag",
    activity: "7-day activity",
    presetsTitle: "Create consistent aliases with presets",
    presetsDesc: "Choose a preset or type a custom tag and preview the result.",
    customTag: "Custom tag",
    placeholder: "Example: project-alpha",
    preview: "Alias preview",
    useAlias: "Use this alias",
    used: "Alias selected",
    accountsTitle: "Personal and Work never mix data",
    accountsDesc:
      "Each account owns separate history, favorites, statistics and presets.",
    active: "Active",
    saved: "saved aliases",
    isolated: "Account-isolated local data",
    contextTitle: "Generate directly beside an email field",
    contextDesc:
      "Right-click an email input to use website-aware suggestions without opening the popup.",
    formTitle: "Newsletter registration",
    email: "Email address",
    rightClick: "Right-click the email field",
    filled: "Alias filled",
    installEyebrow: "Manual installation",
    installTitle:
      "Use the toolkit before your browser has an official listing.",
    installDesc:
      "Download a GitHub Release package and keep the same folder to preserve settings during updates.",
    chromium: "Chrome / Edge / Opera",
    firefox: "Firefox",
    chromiumSteps: [
      "Download and extract the package for your browser.",
      "Open Extensions and enable Developer mode.",
      "Choose Load unpacked and select the extracted folder.",
      "For updates, replace files in the same folder and click Reload.",
    ],
    firefoxSteps: [
      "Download and extract the Firefox package.",
      "Open about:debugging#/runtime/this-firefox.",
      "Choose Load Temporary Add-on and select manifest.json.",
      "For a persistent install, use the Firefox Add-ons version.",
    ],
    release: "Open GitHub Releases",
    guide: "Read the full guide",
    warning: "Manual installations do not update automatically.",
  },
} as const;

const TABS: Array<{ id: TabId; icon: typeof History }> = [
  { id: "history", icon: History },
  { id: "statistics", icon: BarChart3 },
  { id: "presets", icon: Tags },
  { id: "accounts", icon: Users },
  { id: "context", icon: MousePointer2 },
];

const cardClass = "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm";
const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:border-blue-300 hover:text-blue-700";

/** Renders the phase-two interactive product tour and manual installation guide. */
export function PhaseTwoSections({ locale }: PhaseTwoSectionsProps) {
  const [tab, setTab] = useState<TabId>("history");
  const [accountId, setAccountId] = useState<AccountId>("personal");
  const text = TEXT[locale];
  const account = ACCOUNTS[accountId];

  return (
    <>
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

          <div className="mt-10 grid grid-cols-5 gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            {TABS.map(({ id, icon: Icon }, index) => (
              <button
                key={id}
                type="button"
                aria-pressed={tab === id}
                onClick={() => setTab(id)}
                className={`flex min-h-12 min-w-32 items-center justify-center gap-2 rounded-xl px-3 text-xs font-black transition ${tab === id ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"}`}
              >
                <Icon className="h-4 w-4" /> {text.tabs[index]}
              </button>
            ))}
          </div>

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
            {tab === "history" ? (
              <HistoryDemo locale={locale} account={account} />
            ) : null}
            {tab === "statistics" ? (
              <StatisticsDemo
                locale={locale}
                account={account}
                accountId={accountId}
              />
            ) : null}
            {tab === "presets" ? (
              <PresetsDemo locale={locale} account={account} />
            ) : null}
            {tab === "accounts" ? (
              <AccountsDemo
                locale={locale}
                active={accountId}
                onChange={setAccountId}
              />
            ) : null}
            {tab === "context" ? (
              <ContextDemo locale={locale} account={account} />
            ) : null}
          </motion.div>
        </div>
      </section>
      <ManualInstall locale={locale} />
    </>
  );
}

/** Renders account switching shared by all tour tabs. */
function AccountSwitch({
  locale,
  active,
  onChange,
}: {
  locale: Locale;
  active: AccountId;
  onChange: (id: AccountId) => void;
}) {
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
            className={`${buttonClass} flex-1 ${active === id ? "border-blue-300 bg-blue-50 text-blue-700" : ""}`}
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
    new Set(["p1", "w1"]),
  );
  const [copied, setCopied] = useState<string | null>(null);
  const rows = useMemo(
    () =>
      account.aliases.filter((item) => {
        const needle = query.trim().toLowerCase();
        const matches =
          !needle ||
          [item.alias, item.tag, item.source].some((value) =>
            value.toLowerCase().includes(needle),
          );
        return matches && (!favoritesOnly || favorites.has(item.id));
      }),
    [account, favorites, favoritesOnly, query],
  );

  /** Toggles an alias favorite in the local demo state. */
  const toggleFavorite = (id: string) =>
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  /** Copies an alias and displays temporary feedback. */
  const copyAlias = async (alias: string) => {
    try {
      await navigator.clipboard.writeText(alias);
    } catch {
      /* Preview environments may block clipboard access. */
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
        <button
          type="button"
          onClick={() => setFavoritesOnly(false)}
          className={`${buttonClass} ${!favoritesOnly ? "border-blue-300 bg-blue-50 text-blue-700" : ""}`}
        >
          {text.all}
        </button>
        <button
          type="button"
          onClick={() => setFavoritesOnly(true)}
          className={`${buttonClass} ${favoritesOnly ? "border-blue-300 bg-blue-50 text-blue-700" : ""}`}
        >
          <Star className="h-4 w-4" /> {text.favorites}
        </button>
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
        {rows.length ? (
          rows.map((item) => (
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
                aria-label={`${text.favorites}: ${item.alias}`}
                onClick={() => toggleFavorite(item.id)}
                className={`grid h-8 w-8 place-items-center rounded-lg ${favorites.has(item.id) ? "bg-amber-50 text-amber-500" : "text-slate-300 hover:bg-slate-50"}`}
              >
                <Star
                  className={`h-4 w-4 ${favorites.has(item.id) ? "fill-current" : ""}`}
                />
              </button>
              <button
                type="button"
                aria-label={`Copy ${item.alias}`}
                onClick={() => copyAlias(item.alias)}
                className="grid h-8 w-8 place-items-center rounded-lg text-blue-600 hover:bg-blue-50"
              >
                {copied === item.alias ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          ))
        ) : (
          <p className="p-10 text-center text-sm text-slate-500">
            {text.empty}
          </p>
        )}
      </div>
    </DemoLayout>
  );
}

/** Renders account-specific metrics and a compact activity chart. */
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
  const activity =
    accountId === "personal" ? [1, 2, 1, 4, 3, 5, 4] : [0, 1, 3, 2, 4, 2, 3];
  const topTag = account.aliases[0]?.tag ?? "—";
  return (
    <DemoLayout
      icon={<BarChart3 />}
      title={text.statsTitle}
      desc={text.statsDesc}
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          [text.total, account.aliases.length],
          [text.today, 2],
          [text.tags, account.aliases.length],
          [text.topTag, `#${topTag}`],
        ].map(([label, value]) => (
          <div key={String(label)} className={cardClass}>
            <p className="text-xs font-bold text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
          </div>
        ))}
      </div>
      <div className={`${cardClass} mt-3`}>
        <p className="text-sm font-black text-slate-800">{text.activity}</p>
        <div className="mt-8 flex h-36 items-end gap-3 border-b border-slate-200 px-2">
          {activity.map((value, index) => (
            <div
              key={`${value}-${index}`}
              className="relative flex-1 rounded-t-xl bg-gradient-to-t from-blue-600 to-blue-400"
              style={{ height: `${18 + value * 15}%` }}
            >
              <span className="absolute -top-6 inset-x-0 text-center text-[10px] font-bold text-slate-500">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DemoLayout>
  );
}

/** Renders preset selection and live alias preview. */
function PresetsDemo({
  locale,
  account,
}: {
  locale: Locale;
  account: DemoAccount;
}) {
  const text = TEXT[locale];
  const presets = ["shopping", "work", "testing", "travel"];
  const [selected, setSelected] = useState("shopping");
  const [custom, setCustom] = useState("");
  const [used, setUsed] = useState(false);
  const [name, domain] = account.email.split("@");
  const tag = custom.trim().replace(/\s+/g, "-") || selected;
  const alias = `${name}+${tag}@${domain}`;
  return (
    <DemoLayout
      icon={<Tags />}
      title={text.presetsTitle}
      desc={text.presetsDesc}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => {
              setSelected(preset);
              setCustom("");
              setUsed(false);
            }}
            className={`${cardClass} text-left transition hover:border-blue-300 ${selected === preset && !custom ? "border-blue-400 bg-blue-50" : ""}`}
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
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border p-4 text-left transition ${active === id ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-200"}`}
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 font-black text-white">
                {account.label[0]}
              </span>
              <span className="min-w-0">
                <strong className="block text-sm text-slate-950">
                  {account.label}
                </strong>
                <small className="mt-1 block truncate text-xs text-slate-500">
                  {account.email} · {account.aliases.length} {text.saved}
                </small>
              </span>
              {active === id ? (
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
  const suggestions = [
    account.aliases[0]?.alias ?? account.email,
    account.email,
  ];
  return (
    <DemoLayout
      icon={<MousePointer2 />}
      title={text.contextTitle}
      desc={text.contextDesc}
      noPadding
    >
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        <div className="flex h-11 items-center gap-2 bg-slate-950 px-3">
          <i className="h-2 w-2 rounded-full bg-red-400" />
          <i className="h-2 w-2 rounded-full bg-amber-400" />
          <i className="h-2 w-2 rounded-full bg-green-400" />
          <span className="ml-2 text-[10px] font-bold text-slate-400">
            newsletter.example.com
          </span>
        </div>
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
            <div className="absolute left-8 top-40 w-[min(310px,calc(100%-4rem))] overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xl">
              <p className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black">
                Gmail Alias Toolkit
              </p>
              {suggestions.map((alias) => (
                <button
                  key={alias}
                  type="button"
                  onClick={() => {
                    setValue(alias);
                    setOpen(false);
                  }}
                  className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 border-b border-slate-100 px-3 py-3 text-left text-xs hover:bg-blue-50"
                >
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="truncate font-mono">{alias}</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              ))}
            </div>
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

/** Provides the shared two-column layout for a product-tour demo. */
function DemoLayout({
  icon,
  title,
  desc,
  children,
  noPadding = false,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  children: ReactNode;
  noPadding?: boolean;
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
      <div className={noPadding ? "p-4 sm:p-6" : "p-4 sm:p-6 lg:p-8"}>
        {children}
      </div>
    </div>
  );
}

/** Renders tabbed manual-install instructions. */
function ManualInstall({ locale }: { locale: Locale }) {
  const text = TEXT[locale];
  const [platform, setPlatform] = useState<"chromium" | "firefox">("chromium");
  const steps =
    platform === "chromium" ? text.chromiumSteps : text.firefoxSteps;
  return (
    <section
      id="manual-install"
      className="border-b border-slate-200 bg-white py-20"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="font-black text-blue-600">{text.installEyebrow}</p>
          <h2 className="mt-3 text-4xl font-black tracking-normal text-slate-950 md:text-5xl">
            {text.installTitle}
          </h2>
          <p className="mt-4 leading-7 text-slate-600">{text.installDesc}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="https://github.com/ePlus-DEV/gmail-alias-toolkit/releases/latest"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-black text-white"
            >
              <Download className="h-4 w-4" /> {text.release}
            </a>
            <a
              href="https://github.com/ePlus-DEV/gmail-alias-toolkit/blob/main/INSTALL.md"
              target="_blank"
              rel="noreferrer"
              className={`${buttonClass} h-12 text-sm`}
            >
              <ExternalLink className="h-4 w-4" /> {text.guide}
            </a>
          </div>
          <p className="mt-4 text-xs font-bold text-slate-500">
            {text.warning}
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
          <div className="grid grid-cols-2 gap-2 border-b border-slate-200 bg-slate-50 p-2">
            <button
              type="button"
              onClick={() => setPlatform("chromium")}
              className={`h-11 rounded-xl text-xs font-black ${platform === "chromium" ? "bg-white text-blue-700 shadow" : "text-slate-500"}`}
            >
              {text.chromium}
            </button>
            <button
              type="button"
              onClick={() => setPlatform("firefox")}
              className={`h-11 rounded-xl text-xs font-black ${platform === "firefox" ? "bg-white text-blue-700 shadow" : "text-slate-500"}`}
            >
              {text.firefox}
            </button>
          </div>
          <motion.ol
            key={platform}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-1 p-5"
          >
            {steps.map((step, index) => (
              <li
                key={step}
                className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-xl p-3 hover:bg-slate-50"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-100 text-xs font-black text-blue-700">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm leading-6 text-slate-600">{step}</p>
              </li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
