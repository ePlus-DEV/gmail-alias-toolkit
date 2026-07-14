import type React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import extensionIconUrl from "../../assets/icon.png?url";
import { ThemeToggle } from "src/components/motion/theme-toggle";
import {
  ArrowRight,
  AtSign,
  BadgeCheck,
  BarChart3,
  Clipboard,
  ChevronDown,
  Copy,
  Database,
  Download,
  EyeOff,
  Github,
  History,
  Home,
  Languages,
  Mail,
  Moon,
  Plus,
  QrCode,
  Search,
  Settings,
  ShieldCheck,
  Shuffle,
  Sparkles,
  Star,
  Tags,
  X,
  Zap,
} from "lucide-react";

const chromeUrl =
  "https://chromewebstore.google.com/detail/gmail-alias-toolkit/cbapjlppdfbnfbopdegobofmfijnlibl";
const firefoxUrl =
  "https://addons.mozilla.org/en-US/firefox/addon/gmail-alias-toolkit/";
const githubUrl = "https://github.com/ePlus-DEV/gmail-alias-toolkit";

type Locale = "vi" | "en";

const localeLabels: Record<Locale, string> = {
  vi: "Tiếng Việt",
  en: "English",
};

const translations = {
  vi: {
    nav: {
      mock: "Bản mô phỏng",
      inline: "Inline Popup",
      features: "Tính năng",
      privacy: "Quyền riêng tư",
      install: "Thêm vào Chrome",
      installFirefox: "Thêm vào Firefox",
    },
    hero: {
      badge: "Tiện ích Chrome cho Gmail plus addressing",
      titlePrefix: "Quản lý Gmail alias bằng một",
      titleHighlight: "popup nhỏ gọn.",
      desc: "Tạo địa chỉ dạng david+tag@gmail.com trong popup chính hoặc thao tác ngay cạnh ô email bằng Inline Popup, với gợi ý theo website, lịch sử, yêu thích và xuất dữ liệu.",
      install: "Cài tiện ích",
      installFirefox: "Cài cho Firefox",
      source: "Xem mã nguồn",
      stats: [
        ["4", "định dạng random"],
        ["6", "Gmail tricks"],
        ["0", "theo dõi"],
      ],
    },
    explainer: {
      eyebrow: "Gmail alias là gì?",
      title: "Một inbox, nhiều địa chỉ dễ nhận diện.",
      desc: "Gmail bỏ qua phần sau dấu cộng khi nhận email. Vì vậy david+shop@gmail.com vẫn về david@gmail.com, nhưng bạn biết email đó đến từ shop.",
      baseLabel: "Email gốc",
      aliasLabel: "Alias dùng để đăng ký",
      inboxLabel: "Vẫn về cùng inbox",
      sourceLabel: "Tag cho biết nguồn",
      steps: [
        {
          title: "Bắt đầu từ email gốc",
          desc: "Bạn giữ nguyên tài khoản Gmail chính, không cần tạo hộp thư mới.",
          tag: "",
        },
        {
          title: "Thêm +tag khi đăng ký",
          desc: "Dùng tag như +shop, +newsletter hoặc +github cho từng dịch vụ.",
          tag: "+newsletter",
        },
        {
          title: "Nhận về cùng inbox",
          desc: "Gmail vẫn chuyển thư vào inbox chính của bạn.",
          tag: "+newsletter",
        },
        {
          title: "Truy vết nguồn email",
          desc: "Nếu alias nhận spam, bạn biết dịch vụ nào đã làm lộ địa chỉ.",
          tag: "+newsletter",
        },
      ],
    },
    tabs: [
      {
        id: "random",
        label: "Ngẫu nhiên",
        icon: Shuffle,
        title: "Sinh alias ngẫu nhiên",
        desc: "Tạo hàng loạt địa chỉ theo private-mail, chữ số, từ ngẫu nhiên hoặc timestamp.",
        alias: "david+private-mail-q2ga@gmail.com",
      },
      {
        id: "tags",
        label: "Tags",
        icon: Tags,
        title: "Preset tag riêng",
        desc: "Lưu tag quen dùng cho mua sắm, newsletter, dev, test và từng dự án.",
        alias: "david+github-test@gmail.com",
      },
      {
        id: "tricks",
        label: "Tricks",
        icon: Zap,
        title: "Gmail tricks",
        desc: "Dot variations, googlemail, bỏ dấu chấm, plus tags và combo trong một panel.",
        alias: "da.vid+newsletter@gmail.com",
      },
    ],
    mock: {
      subtitle: "Tạo & quản lý Gmail alias",
      activeEmail: "Địa chỉ Gmail đang dùng",
      format: "Định dạng",
      count: "Số lượng",
      generate: "Tạo và sao chép",
      generated: "Đã tạo",
      recent: "Alias gần đây",
      search: "tìm kiếm",
      settings: "Cài đặt",
      viewStatistics: "Xem thống kê",
    },
    inlineHelper: {
      eyebrow: "Inline Popup",
      title: "Thao tác ngay tại ô email, không cần mở popup chính.",
      desc: "Extension phát hiện trường email trên mọi domain, đặt icon ngoài input và mở một popup thu gọn có đầy đủ gợi ý, generator và lịch sử.",
      steps: [
        "Phát hiện input email và tránh các icon của website hoặc password manager.",
        "Hover icon để mở popup; vị trí trên, dưới, trái hoặc phải được giữ ổn định.",
        "Hover alias để xem trước trong input, bấm để điền và ghi đúng một mục lịch sử.",
        "Tắt Inline Helper theo từng website và bật lại bất kỳ lúc nào trong Settings.",
      ],
      demoTitle: "Tạo tài khoản",
      email: "Địa chỉ email",
      suggestions: "Alias gợi ý",
      generate: "Tạo alias",
      history: "Alias gần đây",
      generatedLabel: "Alias đã tạo:",
      generateAction: "Tạo 5 alias",
      search: "Tìm lịch sử...",
      allAliases: "Tất cả alias",
      mostRecent: "Mới nhất",
      previewHint: "Hover một alias để xem trước trực tiếp trong input",
    },
    features: {
      eyebrow: "Tính năng tiện ích",
      title: "Đầy đủ từ popup chính đến trợ lý ngay trong form",
      desc: "Extension tạo, xem trước, điền và quản lý alias ngay tại ô email; đồng thời giữ đầy đủ generator, history, favorites và công cụ dữ liệu trong popup chính.",
      items: [
        {
          title: "Tạo alias ngẫu nhiên",
          desc: "Chọn định dạng, nhập số lượng và tự động sao chép alias đầu tiên ngay khi tạo xong.",
          icon: Shuffle,
          sample: "10 alias",
        },
        {
          title: "Preset tùy chỉnh",
          desc: "Tạo preset để dùng lại các tag như work, shop, social hoặc finance.",
          icon: Tags,
          sample: "shop / dev / promo",
        },
        {
          title: "Gmail tricks",
          desc: "Tạo biến thể dấu chấm, googlemail, plus tag, dot plus và all combos.",
          icon: Zap,
          sample: "dot + plus",
        },
        {
          title: "Tìm lịch sử",
          desc: "Tìm nhanh alias đã tạo theo tag, nội dung hoặc tài khoản Gmail.",
          icon: History,
          sample: "24 mục đã lưu",
        },
        {
          title: "Yêu thích",
          desc: "Ghim những alias dùng lại thường xuyên để sao chép nhanh hơn.",
          icon: Star,
          sample: "3 mục đã ghim",
        },
        {
          title: "Xuất dữ liệu",
          desc: "Tải lịch sử alias thành CSV hoặc JSON để sao lưu và di chuyển.",
          icon: Download,
          sample: "CSV / JSON",
        },
        {
          title: "Chia sẻ QR",
          desc: "Biến alias thành mã QR cho các luồng chia sẻ nhanh.",
          icon: QrCode,
          sample: "QR sẵn sàng",
        },
        {
          title: "Riêng tư cục bộ",
          desc: "Dữ liệu nằm trong browser storage, không analytics, không tracking.",
          icon: ShieldCheck,
          sample: "local-first",
        },
        {
          title: "Inline Popup thao tác nhanh",
          desc: "Tạo alias, dùng preset, Gmail tricks và tìm lịch sử ngay cạnh ô email mà không cần mở popup chính.",
          icon: Zap,
          sample: "Generate + History",
        },
        {
          title: "Gợi ý theo website",
          desc: "Tự nhận diện domain, đề xuất alias phù hợp và xem trước trực tiếp trong input khi hover.",
          icon: Sparkles,
          sample: "hover để xem trước",
        },
        {
          title: "Điều khiển theo từng site",
          desc: "Ẩn Inline Helper trên website bất kỳ và bật lại từ danh sách quản lý trong Settings.",
          icon: EyeOff,
          sample: "tắt / bật theo domain",
        },
        {
          title: "14 ngôn ngữ",
          desc: "Popup chính, Inline Popup và cài đặt được đồng bộ nội dung trên toàn bộ locale hỗ trợ.",
          icon: Languages,
          sample: "14 locales",
        },
      ],
    },
    tricks: {
      eyebrow: "Gmail tricks",
      title: "Dấu chấm, plus tag và googlemail trong một luồng.",
      desc: "Extension gom các mẹo Gmail thành một UI rõ ràng: chọn trick, chọn số lượng, randomize dots và sao chép kết quả đầu tiên.",
      buttons: [
        "Dot trick",
        "Plus tags",
        "Googlemail",
        "Bỏ dấu chấm",
        "Dot plus",
        "Tất cả combo",
      ],
      copied: "Đã sao chép vào clipboard",
    },
    privacy: {
      eyebrow: "Quyền riêng tư từ thiết kế",
      title: "Dữ liệu alias nằm trong trình duyệt của bạn.",
      desc: "Bản mô phỏng trên trang giới thiệu bám sát extension: lưu trữ cục bộ, không analytics, không tracking và có giao diện sáng/tối.",
      items: [
        { icon: EyeOff, text: "Không analytics" },
        { icon: ShieldCheck, text: "Không tracking" },
        { icon: Database, text: "Browser storage" },
        { icon: Moon, text: "Sáng / Tối" },
      ],
    },
    cta: {
      badge: "Tạo / Sao chép / Theo dõi / Xuất dữ liệu",
      title: "Sẵn sàng biến Gmail alias thành workflow gọn gàng?",
      desc: "Cài Gmail Alias Toolkit để tạo alias traceable cho đăng ký tài khoản, newsletter, testing và bảo vệ inbox mỗi ngày.",
      install: "Thêm vào Chrome",
      installFirefox: "Thêm vào Firefox",
    },
  },
  en: {
    nav: {
      mock: "Mock",
      inline: "Inline Popup",
      features: "Features",
      privacy: "Privacy",
      install: "Add to Chrome",
      installFirefox: "Add to Firefox",
    },
    hero: {
      badge: "Chrome extension for Gmail plus addressing",
      titlePrefix: "Manage Gmail aliases from one",
      titleHighlight: "compact popup.",
      desc: "Create david+tag@gmail.com aliases in the main popup or work beside any email field with website-aware inline suggestions, history, favorites and export tools.",
      install: "Install extension",
      installFirefox: "Install for Firefox",
      source: "View source",
      stats: [
        ["4", "random formats"],
        ["6", "Gmail tricks"],
        ["0", "tracking"],
      ],
    },
    explainer: {
      eyebrow: "What is a Gmail alias?",
      title: "One inbox, many traceable addresses.",
      desc: "Gmail ignores the part after the plus sign when receiving mail. So david+shop@gmail.com still lands in david@gmail.com, while the tag tells you where it came from.",
      baseLabel: "Base email",
      aliasLabel: "Alias used for signup",
      inboxLabel: "Same inbox",
      sourceLabel: "Source tag",
      steps: [
        {
          title: "Start with your base email",
          desc: "Keep your main Gmail account. No new mailbox is needed.",
          tag: "",
        },
        {
          title: "Add a +tag when signing up",
          desc: "Use tags like +shop, +newsletter or +github for each service.",
          tag: "+newsletter",
        },
        {
          title: "Receive it in the same inbox",
          desc: "Gmail still delivers the message to your main inbox.",
          tag: "+newsletter",
        },
        {
          title: "Trace where mail came from",
          desc: "If an alias gets spam, you know which service exposed it.",
          tag: "+newsletter",
        },
      ],
    },
    tabs: [
      {
        id: "random",
        label: "Random",
        icon: Shuffle,
        title: "Random alias generator",
        desc: "Create batches with private-mail, alphanumeric, random words or timestamp formats.",
        alias: "david+private-mail-q2ga@gmail.com",
      },
      {
        id: "tags",
        label: "Tags",
        icon: Tags,
        title: "Custom tag presets",
        desc: "Save common tags for shopping, newsletters, dev, testing and project-specific signups.",
        alias: "david+github-test@gmail.com",
      },
      {
        id: "tricks",
        label: "Tricks",
        icon: Zap,
        title: "Gmail tricks",
        desc: "Dot variations, googlemail, remove dots, plus tags and combos in one panel.",
        alias: "da.vid+newsletter@gmail.com",
      },
    ],
    mock: {
      subtitle: "Generate & manage Gmail aliases",
      activeEmail: "Active Gmail Address",
      format: "Format",
      count: "Count",
      generate: "Generate and copy",
      generated: "Generated",
      recent: "Recent aliases",
      search: "search",
      settings: "Settings",
      viewStatistics: "View Statistics",
    },
    inlineHelper: {
      eyebrow: "Inline Popup",
      title: "Work beside an email field without opening the main popup.",
      desc: "The extension detects email fields on every domain, keeps its icon outside the input and opens a compact helper with suggestions, generation and history.",
      steps: [
        "Detect email inputs while avoiding site controls and password-manager icons.",
        "Hover the icon to open a popup whose top, bottom, left or right anchor stays stable.",
        "Hover an alias for a live input preview, then click to fill it and record one history item.",
        "Disable the inline helper per website and re-enable it later from Settings.",
      ],
      demoTitle: "Create your account",
      email: "Email address",
      suggestions: "Suggested aliases",
      generate: "Generate",
      history: "Recent aliases",
      generatedLabel: "Generated aliases:",
      generateAction: "Generate 5 aliases",
      search: "Search history...",
      allAliases: "All aliases",
      mostRecent: "Most recent",
      previewHint: "Hover an alias to preview it directly in the input",
    },
    features: {
      eyebrow: "Extension features",
      title: "From the main popup to an assistant inside every form",
      desc: "Generate, preview, fill and manage aliases beside an email field while keeping the complete generator, history, favorites and data tools in the main popup.",
      items: [
        {
          title: "Random generator",
          desc: "Choose a format, enter a count and copy the first alias as soon as it is generated.",
          icon: Shuffle,
          sample: "10 aliases",
        },
        {
          title: "Custom presets",
          desc: "Create reusable presets for tags like work, shop, social or finance.",
          icon: Tags,
          sample: "shop / dev / promo",
        },
        {
          title: "Gmail tricks",
          desc: "Generate dot variations, googlemail, plus tags, dot plus and all combos.",
          icon: Zap,
          sample: "dot + plus",
        },
        {
          title: "History search",
          desc: "Quickly find generated aliases by tag, content or Gmail account.",
          icon: History,
          sample: "24 saved",
        },
        {
          title: "Favorites",
          desc: "Pin aliases you reuse often so copying them is faster.",
          icon: Star,
          sample: "3 pinned",
        },
        {
          title: "Export data",
          desc: "Download alias history as CSV or JSON for backup and migration.",
          icon: Download,
          sample: "CSV / JSON",
        },
        {
          title: "QR sharing",
          desc: "Turn an alias into a QR code for fast sharing flows.",
          icon: QrCode,
          sample: "QR ready",
        },
        {
          title: "Local privacy",
          desc: "Data stays in browser storage, with no analytics and no tracking.",
          icon: ShieldCheck,
          sample: "local-first",
        },
        {
          title: "Inline quick popup",
          desc: "Generate aliases, use presets and Gmail tricks, or search history beside an email field without opening the main popup.",
          icon: Zap,
          sample: "Generate + History",
        },
        {
          title: "Website-aware suggestions",
          desc: "Detect the current domain, suggest relevant aliases and preview a selection directly in the input on hover.",
          icon: Sparkles,
          sample: "hover to preview",
        },
        {
          title: "Per-site controls",
          desc: "Hide the inline helper on any website and re-enable it later from the managed list in Settings.",
          icon: EyeOff,
          sample: "disable by domain",
        },
        {
          title: "14 languages",
          desc: "The main popup, inline helper and settings stay localized across every supported locale.",
          icon: Languages,
          sample: "14 locales",
        },
      ],
    },
    tricks: {
      eyebrow: "Gmail tricks",
      title: "Dots, plus tags and googlemail in one flow.",
      desc: "The extension gathers Gmail tricks into a clear UI: choose a trick, choose a count, randomize dots and copy the first result.",
      buttons: [
        "Dot trick",
        "Plus tags",
        "Googlemail",
        "Remove dots",
        "Dot plus",
        "All combos",
      ],
      copied: "Copied to clipboard",
    },
    privacy: {
      eyebrow: "Privacy by design",
      title: "Alias data stays in your browser.",
      desc: "The landing-page mock follows the extension: local storage, no analytics, no tracking and light/dark mode.",
      items: [
        { icon: EyeOff, text: "No analytics" },
        { icon: ShieldCheck, text: "No tracking" },
        { icon: Database, text: "Browser storage" },
        { icon: Moon, text: "Light / Dark mode" },
      ],
    },
    cta: {
      badge: "Generate / Copy / Track / Export",
      title: "Ready to turn Gmail aliases into a tidy workflow?",
      desc: "Install Gmail Alias Toolkit to create traceable aliases for signups, newsletters, testing and everyday inbox protection.",
      install: "Add to Chrome",
      installFirefox: "Add to Firefox",
    },
  },
} as const;

const historyItems = [
  { alias: "david+amazon-order@gmail.com", tag: "shopping", favorite: true },
  { alias: "david+github-test@gmail.com", tag: "dev", favorite: false },
  { alias: "david+newsletter@gmail.com", tag: "mailing", favorite: true },
  { alias: "david+finance-alert@gmail.com", tag: "finance", favorite: false },
] as const;

const trickIds = [
  "dot",
  "plus",
  "googlemail",
  "nodots",
  "dotplus",
  "combo",
] as const;

type TrickId = (typeof trickIds)[number];

const gmailTrickAliases: Record<TrickId, string[]> = {
  dot: [
    "d.avid@gmail.com",
    "da.vid@gmail.com",
    "dav.id@gmail.com",
    "d.a.vid@gmail.com",
    "da.v.id@gmail.com",
  ],
  plus: [
    "david+shop@gmail.com",
    "david+work@gmail.com",
    "david+newsletter@gmail.com",
    "david+finance@gmail.com",
    "david+promo@gmail.com",
  ],
  googlemail: [
    "david@googlemail.com",
    "d.avid@googlemail.com",
    "da.vid@googlemail.com",
    "david+shop@googlemail.com",
    "david+promo@googlemail.com",
  ],
  nodots: [
    "david@gmail.com",
    "david@googlemail.com",
    "david+work@gmail.com",
    "david+shop@gmail.com",
    "david+alerts@gmail.com",
  ],
  dotplus: [
    "d.avid+shop@gmail.com",
    "da.vid+work@gmail.com",
    "dav.id+test@gmail.com",
    "d.a.vid+promo@gmail.com",
    "da.v.id+finance@gmail.com",
  ],
  combo: [
    "d.avid+shop@gmail.com",
    "da.vid@googlemail.com",
    "david+newsletter@gmail.com",
    "dav.id+promo@googlemail.com",
    "d.a.vid+finance@gmail.com",
  ],
};

/** Renders subdued animated gradient text for the hero headline. */
function ShimmerText({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      <style>
        {
          "@keyframes beui-shimmer{from{background-position:200% 0}to{background-position:-200% 0}}"
        }
      </style>
      <span
        className={`inline-block bg-[linear-gradient(110deg,#64748b_28%,#2563eb_48%,#020617_68%)] bg-[length:200%_100%] bg-clip-text text-transparent ${className}`}
        style={{ animation: "beui-shimmer 9s linear infinite" }}
      >
        {children}
      </span>
    </>
  );
}

/** Renders a springy external link used for primary landing-page actions. */
function MagneticLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const classes =
    variant === "primary"
      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700"
      : "border border-slate-200 bg-white text-slate-950 hover:border-blue-300 hover:bg-blue-50";

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      whileHover={{ y: -3, scale: 1.025 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-extrabold transition ${classes}`}
    >
      {children}
    </motion.a>
  );
}

/** Renders the sticky site header with navigation, language control, and CTA. */
function Header({
  locale,
  setLocale,
  t,
}: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof translations)[Locale];
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-4">
        <HeaderBrand />
        <HeaderNav t={t} />
        <HeaderActions locale={locale} setLocale={setLocale} t={t} />
      </div>
    </header>
  );
}

/** Renders the product mark in the site header. */
function HeaderBrand() {
  return (
    <a href="#" className="flex min-w-0 items-center gap-3">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-glow">
        <img
          src={extensionIconUrl}
          alt=""
          className="h-full w-full rounded-xl object-contain"
        />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-black leading-none">Gmail Alias</p>
        <p className="text-xs font-semibold text-slate-500">Toolkit</p>
      </div>
    </a>
  );
}

/** Renders desktop navigation links in the site header. */
function HeaderNav({ t }: { t: (typeof translations)[Locale] }) {
  return (
    <nav className="hidden items-center gap-7 text-sm font-bold text-slate-600 lg:flex">
      <a href="#mock" className="hover:text-slate-950">
        {t.nav.mock}
      </a>
      <a href="#inline-popup" className="hover:text-slate-950">
        {t.nav.inline}
      </a>
      <a href="#features" className="hover:text-slate-950">
        {t.nav.features}
      </a>
      <a href="#privacy" className="hover:text-slate-950">
        {t.nav.privacy}
      </a>
    </nav>
  );
}

/** Renders header language and install actions. */
function HeaderActions({
  locale,
  setLocale,
  t,
}: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof translations)[Locale];
}) {
  return (
    <div className="flex items-center gap-2">
      <LanguageSwitch locale={locale} setLocale={setLocale} />
      <div className="hidden sm:block">
        <MagneticLink href={chromeUrl}>
          {t.nav.install} <ArrowRight className="h-4 w-4" />
        </MagneticLink>
      </div>
      <div className="hidden xl:block">
        <MagneticLink href={firefoxUrl} variant="secondary">
          {t.nav.installFirefox} <Download className="h-4 w-4" />
        </MagneticLink>
      </div>
    </div>
  );
}

/** Renders the animated language segmented control. */
function LanguageSwitch({
  locale,
  setLocale,
}: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}) {
  return (
    <div className="flex h-12 items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
      <Languages className="ml-2 hidden h-4 w-4 text-slate-500 sm:block" />
      {(["vi", "en"] as const).map((item) => (
        <motion.button
          key={item}
          type="button"
          onClick={() => setLocale(item)}
          whileTap={{ scale: 0.95 }}
          aria-label={localeLabels[item]}
          className={`relative h-9 min-w-10 rounded-xl px-3 text-xs font-black transition ${
            locale === item
              ? "text-white"
              : "text-slate-600 hover:text-slate-950"
          }`}
        >
          {locale === item ? (
            <motion.span
              layoutId="language-pill"
              className="absolute inset-0 rounded-xl bg-blue-600"
              transition={{ type: "spring", bounce: 0.28, duration: 0.42 }}
            />
          ) : null}
          <span className="relative uppercase">{item}</span>
        </motion.button>
      ))}
    </div>
  );
}

/** Renders the first viewport with product positioning and extension mockup. */
function HeroSection({ t }: { t: (typeof translations)[Locale] }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-[#fbfbfc]">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#111318,#2563eb,#93c5fd)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-14 pt-14 md:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.72fr)] md:pb-16 md:pt-16 lg:gap-12 lg:py-20">
        <HeroCopy t={t} />
        <ExtensionMockup t={t} />
      </div>
    </section>
  );
}

/** Renders hero copy, calls to action, and proof stats. */
function HeroCopy({ t }: { t: (typeof translations)[Locale] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
    >
      <HeroBadge label={t.hero.badge} />
      <h1 className="max-w-3xl text-[clamp(2.55rem,7vw,4.75rem)] font-black leading-[0.98] tracking-normal text-slate-950">
        {t.hero.titlePrefix} <ShimmerText>{t.hero.titleHighlight}</ShimmerText>
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
        {t.hero.desc}
      </p>
      <HeroActions t={t} />
      <HeroStats stats={t.hero.stats} />
    </motion.div>
  );
}

/** Renders the hero badge. */
function HeroBadge({ label }: { label: string }) {
  return (
    <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-extrabold text-blue-700 shadow-sm">
      <BadgeCheck className="h-4 w-4" /> {label}
    </div>
  );
}

/** Renders hero call-to-action links. */
function HeroActions({ t }: { t: (typeof translations)[Locale] }) {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <MagneticLink href={chromeUrl}>
        {t.hero.install} <ArrowRight className="h-5 w-5" />
      </MagneticLink>
      <MagneticLink href={firefoxUrl} variant="secondary">
        <Download className="h-5 w-5" /> {t.hero.installFirefox}
      </MagneticLink>
      <MagneticLink href={githubUrl} variant="secondary">
        <Github className="h-5 w-5" /> {t.hero.source}
      </MagneticLink>
    </div>
  );
}

/** Renders compact animated proof points below the hero actions. */
function HeroStats({
  stats,
}: {
  stats: readonly (readonly [string, string])[];
}) {
  return (
    <div className="mt-8 grid max-w-xl grid-cols-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {stats.map(([value, label], index) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            bounce: 0.28,
            duration: 0.48,
            delay: 0.08 * index,
          }}
          whileHover={{ backgroundColor: "#f8fafc" }}
          className="border-r border-slate-200 p-4 last:border-r-0"
        >
          <p className="text-2xl font-black text-slate-950">{value}</p>
          <p className="mt-1 text-xs font-bold uppercase text-slate-500">
            {label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

/** Explains Gmail plus aliases with an interactive step-by-step animation. */
function AliasExplainerSection({ t }: { t: (typeof translations)[Locale] }) {
  const [activeStep, setActiveStep] = useState(1);
  const active = t.explainer.steps[activeStep];
  const baseName = "david";
  const domain = "@gmail.com";
  const tag = active.tag;
  const alias = `${baseName}${tag}${domain}`;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-[0.86fr_1.14fr]">
        <AliasExplainerCopy
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          t={t}
        />
        <AliasFlowDiagram
          activeStep={activeStep}
          alias={alias}
          baseEmail={`${baseName}${domain}`}
          tag={tag}
          t={t}
        />
      </div>
    </section>
  );
}

/** Renders the explanatory copy and step controls for Gmail aliases. */
function AliasExplainerCopy({
  activeStep,
  setActiveStep,
  t,
}: {
  activeStep: number;
  setActiveStep: (step: number) => void;
  t: (typeof translations)[Locale];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", bounce: 0.22, duration: 0.58 }}
    >
      <p className="font-black text-blue-600">{t.explainer.eyebrow}</p>
      <h2 className="mt-3 text-4xl font-black tracking-normal text-slate-950 md:text-5xl">
        {t.explainer.title}
      </h2>
      <p className="mt-4 max-w-2xl leading-7 text-slate-600">
        {t.explainer.desc}
      </p>
      <AliasStepList
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        steps={t.explainer.steps}
      />
    </motion.div>
  );
}

/** Renders the list of selectable alias explanation steps. */
function AliasStepList({
  activeStep,
  setActiveStep,
  steps,
}: {
  activeStep: number;
  setActiveStep: (step: number) => void;
  steps: (typeof translations)[Locale]["explainer"]["steps"];
}) {
  return (
    <div className="mt-7 space-y-2">
      {steps.map((step, index) => (
        <AliasStepButton
          key={step.title}
          active={activeStep === index}
          index={index}
          onSelect={() => setActiveStep(index)}
          step={step}
        />
      ))}
    </div>
  );
}

/** Renders one selectable step in the alias explainer. */
function AliasStepButton({
  active,
  index,
  onSelect,
  step,
}: {
  active: boolean;
  index: number;
  onSelect: () => void;
  step: (typeof translations)[Locale]["explainer"]["steps"][number];
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      className={`relative flex w-full items-start gap-3 overflow-hidden rounded-2xl border p-4 text-left transition ${
        active
          ? "border-blue-300 bg-blue-50"
          : "border-slate-200 bg-slate-50 hover:border-blue-200"
      }`}
    >
      {active ? <AliasStepActiveBar /> : null}
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white text-xs font-black text-blue-600 shadow-sm">
        {index + 1}
      </span>
      <span className="min-w-0">
        <span className="block font-black text-slate-950">{step.title}</span>
        <span className="mt-1 block text-sm leading-6 text-slate-600">
          {step.desc}
        </span>
      </span>
    </motion.button>
  );
}

/** Renders the animated active marker for an explainer step. */
function AliasStepActiveBar() {
  return (
    <motion.span
      layoutId="alias-step-active"
      className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-blue-600"
      transition={{ type: "spring", bounce: 0.28, duration: 0.42 }}
    />
  );
}

/** Renders the animated alias-to-inbox diagram. */
function AliasFlowDiagram({
  activeStep,
  alias,
  baseEmail,
  tag,
  t,
}: {
  activeStep: number;
  alias: string;
  baseEmail: string;
  tag: string;
  t: (typeof translations)[Locale];
}) {
  const sourceLabel =
    activeStep === 0 ? t.explainer.baseLabel : t.explainer.aliasLabel;

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", bounce: 0.2, duration: 0.62 }}
      className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 shadow-xl shadow-blue-950/5"
    >
      <AliasFlowLine activeStep={activeStep} />
      <div className="relative grid gap-4 md:grid-cols-[1fr_auto_1fr]">
        <AliasNode label={sourceLabel} primary={alias} tag={tag} />
        <AliasFlowArrow />
        <InboxNode label={t.explainer.inboxLabel} email={baseEmail} />
      </div>
      <AliasSourceTagPanel
        label={t.explainer.sourceLabel}
        tag={tag || "+tag"}
      />
    </motion.div>
  );
}

/** Renders the progress line between alias and inbox nodes. */
function AliasFlowLine({ activeStep }: { activeStep: number }) {
  return (
    <>
      <div className="absolute inset-x-8 top-1/2 hidden h-px bg-slate-200 md:block" />
      <motion.div
        className="absolute left-[23%] top-1/2 hidden h-px bg-blue-500 md:block"
        initial={false}
        animate={{ width: activeStep > 1 ? "52%" : "18%" }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />
    </>
  );
}

/** Renders the directional arrow in the alias flow diagram. */
function AliasFlowArrow() {
  return (
    <div className="grid place-items-center">
      <motion.div
        whileHover={{ scale: 1.04 }}
        className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25"
      >
        <ArrowRight className="h-5 w-5" />
      </motion.div>
    </div>
  );
}

/** Renders the source tag hint below the alias flow diagram. */
function AliasSourceTagPanel({ label, tag }: { label: string; tag: string }) {
  return (
    <motion.div
      key={tag}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className="mt-4 rounded-2xl border border-blue-200 bg-white p-4"
    >
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
          <Tags className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase text-slate-400">{label}</p>
          <p className="truncate font-mono text-sm font-black text-slate-950">
            {tag} = newsletter
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/** Renders the source email or alias node in the explainer diagram. */
function AliasNode({
  label,
  primary,
  tag,
}: {
  label: string;
  primary: string;
  tag: string;
}) {
  const [name, rest] = primary.split(tag || "@");
  const suffix = tag ? rest : `@${rest}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-xs font-black uppercase text-slate-400">
        <AtSign className="h-4 w-4 text-blue-600" /> {label}
      </div>
      <motion.div
        layout
        className="break-all rounded-xl bg-slate-50 p-4 font-mono text-lg font-black text-slate-950"
      >
        <span>{name}</span>
        {tag ? (
          <motion.span
            layoutId="alias-plus-tag"
            className="rounded-lg bg-blue-100 px-1.5 py-0.5 text-blue-700"
          >
            {tag}
          </motion.span>
        ) : null}
        <span>{suffix}</span>
      </motion.div>
    </div>
  );
}

/** Renders the destination inbox node in the alias explainer diagram. */
function InboxNode({ label, email }: { label: string; email: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-xs font-black uppercase text-slate-400">
        <Mail className="h-4 w-4 text-blue-600" /> {label}
      </div>
      <div className="rounded-xl bg-slate-950 p-4 text-white">
        <p className="font-mono text-lg font-black">{email}</p>
        <div className="mt-3 space-y-2">
          {[0, 1, 2].map((item) => (
            <motion.div
              key={item}
              initial={{ width: "38%", opacity: 0.5 }}
              whileInView={{ width: `${72 - item * 14}%`, opacity: 0.72 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: item * 0.2,
              }}
              className="h-2 rounded-full bg-white/20"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Renders the interactive Chrome extension popup mockup. */
function ExtensionMockup({ t }: { t: (typeof translations)[Locale] }) {
  const [activeTab, setActiveTab] =
    useState<(typeof t.tabs)[number]["id"]>("random");
  const [isDark, setIsDark] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [activeEmail, setActiveEmail] = useState("david@gmail.com");
  const currentTab = t.tabs.find((tab) => tab.id === activeTab) ?? t.tabs[0];

  return (
    <motion.div
      id="mock"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.08 }}
      whileHover={{ y: -3 }}
      className={`relative mx-auto w-full max-w-[390px] rounded-[1.75rem] border p-3 shadow-2xl shadow-blue-950/10 transition-colors ${
        isDark
          ? "border-slate-700 bg-slate-950 text-white"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <MockHeader
        t={t}
        isDark={isDark}
        onToggleDark={() => setIsDark((value) => !value)}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <div className="px-1 pb-1 pt-3">
        <div
          className={`divide-y overflow-visible rounded-2xl border shadow-sm ${
            isDark
              ? "divide-slate-700 border-slate-700 bg-slate-900"
              : "divide-slate-200 border-slate-200 bg-white"
          }`}
        >
          <MockAccountSwitcher
            t={t}
            isDark={isDark}
            activeEmail={activeEmail}
            isOpen={accountOpen}
            onToggle={() => setAccountOpen((value) => !value)}
            onSelect={(email) => {
              setActiveEmail(email);
              setAccountOpen(false);
            }}
          />
          <div className="p-3">
            <MockTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabs={t.tabs}
              isDark={isDark}
            />
            <MockGeneratorPanel currentTab={currentTab} t={t} isDark={isDark} />
          </div>
          <MockHistory t={t} isDark={isDark} />
          <MockFooter t={t} isDark={isDark} />
        </div>
      </div>
      {settingsOpen ? (
        <MockSettingsPanel
          t={t}
          isDark={isDark}
          activeEmail={activeEmail}
          onClose={() => setSettingsOpen(false)}
        />
      ) : null}
    </motion.div>
  );
}

/** Interactive landing-page version of the extension's Settings screen. */
/** Settings panel header with back button and version. */
function MockSettingsPanelHeader({
  isDark,
  muted,
  t,
  onClose,
}: {
  isDark: boolean;
  muted: string;
  t: (typeof translations)[Locale];
  onClose: () => void;
}) {
  return (
    <div
      className={`flex items-center justify-between border-b px-3 py-3 ${isDark ? "border-slate-700" : "border-slate-200"}`}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onClose}
          className={`grid h-9 w-9 place-items-center rounded-xl ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
          aria-label="Back"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
        </button>
        <h3 className="text-sm font-black">{t.mock.settings}</h3>
      </div>
      <span
        className={`rounded-full px-2 py-1 text-[10px] font-bold text-slate-500 ${muted}`}
      >
        v1.3.0
      </span>
    </div>
  );
}

/** Settings panel tab navigation. */
function MockSettingsPanelTabs({
  isDark,
  labels,
  tab,
  setTab,
}: {
  isDark: boolean;
  labels: Record<string, string>;
  tab: "general" | "accounts" | "changelog";
  setTab: (tab: "general" | "accounts" | "changelog") => void;
}) {
  return (
    <div
      className={`border-b p-2.5 ${isDark ? "border-slate-700" : "border-slate-200"}`}
    >
      <div
        className={`grid grid-cols-3 gap-1 rounded-xl border p-1 ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-100"}`}
      >
        {(["general", "accounts", "changelog"] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`h-9 rounded-lg px-1 text-[11px] font-bold transition ${tab === id ? (isDark ? "bg-slate-950 text-blue-300 shadow" : "bg-white text-blue-700 shadow") : "text-slate-500"}`}
          >
            {labels[id]}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Settings panel with tabs for general, accounts, and changelog. */
function MockSettingsPanel({
  t,
  isDark,
  activeEmail,
  onClose,
}: {
  t: (typeof translations)[Locale];
  isDark: boolean;
  activeEmail: string;
  onClose: () => void;
}) {
  const english = t.mock.settings === "Settings";
  const labels = english
    ? {
        general: "General",
        accounts: "Accounts",
        changelog: "Changelog",
        appearance: "Appearance & display",
        inline: "Inline helper disabled sites",
        generation: "Alias generation",
        presets: "Custom presets",
        data: "Data management",
        badge: "Badge counter",
        notifications: "Copy notifications",
        format: "Random alias format",
        limit: "Auto-save limit",
        enable: "Enable",
        export: "Export",
        import: "Import",
        clear: "Clear",
        add: "Add account",
        current: "Active",
      }
    : {
        general: "Chung",
        accounts: "Tài khoản",
        changelog: "Thay đổi",
        appearance: "Giao diện & hiển thị",
        inline: "Website đã tắt Inline Helper",
        generation: "Tạo alias",
        presets: "Preset tùy chỉnh",
        data: "Quản lý dữ liệu",
        badge: "Bộ đếm trên badge",
        notifications: "Thông báo khi sao chép",
        format: "Định dạng alias ngẫu nhiên",
        limit: "Giới hạn tự lưu",
        enable: "Bật lại",
        export: "Xuất",
        import: "Nhập",
        clear: "Xóa",
        add: "Thêm tài khoản",
        current: "Đang dùng",
      };
  const [tab, setTab] = useState<"general" | "accounts" | "changelog">(
    "general",
  );
  const [section, setSection] = useState("appearance");
  const [notifications, setNotifications] = useState(true);
  const [disabledSites, setDisabledSites] = useState(["voidzero.dev"]);
  const panel = isDark
    ? "border-slate-700 bg-slate-900"
    : "border-slate-200 bg-white";
  const muted = isDark ? "bg-slate-950/70" : "bg-slate-50";
  const sections = [
    ["appearance", labels.appearance],
    ["inline", labels.inline],
    ["generation", labels.generation],
    ["presets", labels.presets],
    ["data", labels.data],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      className={`absolute inset-3 z-30 flex overflow-hidden rounded-3xl border shadow-2xl ${panel}`}
    >
      <div className="flex min-h-0 w-full flex-col">
        <MockSettingsPanelHeader
          isDark={isDark}
          muted={muted}
          t={t}
          onClose={onClose}
        />
        <MockSettingsPanelTabs
          isDark={isDark}
          labels={labels}
          tab={tab}
          setTab={setTab}
        />
        <div className={`min-h-0 flex-1 overflow-y-auto p-3 ${muted}`}>
          {tab === "general" ? (
            <div
              className={`divide-y overflow-hidden rounded-2xl border ${panel}`}
            >
              {sections.map(([id, label]) => (
                <div key={id}>
                  <button
                    type="button"
                    onClick={() => setSection(section === id ? "" : id)}
                    className={`flex h-12 w-full items-center justify-between px-3 text-left text-xs font-black ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-50 text-blue-600">
                        <Settings className="h-3.5 w-3.5" />
                      </span>
                      {label}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition ${section === id ? "rotate-180" : ""}`}
                    />
                  </button>
                  {section === id ? (
                    <div
                      className={`border-t p-3 text-xs ${isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}
                    >
                      {id === "appearance" ? (
                        <div className="space-y-3">
                          <MockSettingSelect
                            label={labels.badge}
                            options={[
                              "Total generated (all time)",
                              "Created today",
                              "This week",
                              "None (hidden)",
                            ]}
                            isDark={isDark}
                          />
                          <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                            <span className="font-bold">
                              {labels.notifications}
                            </span>
                            <MockSwitch
                              enabled={notifications}
                              onChange={setNotifications}
                            />
                          </div>
                        </div>
                      ) : null}
                      {id === "inline" ? (
                        disabledSites.length ? (
                          disabledSites.map((site) => (
                            <div
                              key={site}
                              className={`flex items-center justify-between rounded-xl border px-3 py-2 ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-50"}`}
                            >
                              <span className="font-mono">{site}</span>
                              <button
                                type="button"
                                onClick={() => setDisabledSites([])}
                                className="font-bold text-blue-600"
                              >
                                {labels.enable}
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="rounded-xl border border-dashed p-3 text-center text-slate-500">
                            No disabled sites
                          </p>
                        )
                      ) : null}
                      {id === "generation" ? (
                        <div className="space-y-3">
                          <MockSettingSelect
                            label={labels.format}
                            options={[
                              "Private Mail",
                              "Random Characters",
                              "Random Words",
                              "Timestamp",
                            ]}
                            isDark={isDark}
                          />
                          <MockSettingSelect
                            label={labels.limit}
                            options={[
                              "20 aliases",
                              "50 aliases",
                              "100 aliases",
                              "200 aliases",
                            ]}
                            isDark={isDark}
                          />
                        </div>
                      ) : null}
                      {id === "presets" ? (
                        <div className="space-y-2">
                          {["Shopping +shopping", "Development +dev"].map(
                            (item) => (
                              <div
                                key={item}
                                className={`rounded-xl border px-3 py-2 font-mono ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-50"}`}
                              >
                                {item}
                              </div>
                            ),
                          )}
                        </div>
                      ) : null}
                      {id === "data" ? (
                        <div className="grid grid-cols-3 gap-2">
                          {[labels.export, labels.import, labels.clear].map(
                            (item) => (
                              <button
                                type="button"
                                key={item}
                                className={`rounded-xl border px-2 py-2 font-bold ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"}`}
                              >
                                {item}
                              </button>
                            ),
                          )}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
          {tab === "accounts" ? (
            <div className="space-y-2">
              <button
                type="button"
                className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-black text-white"
              >
                + {labels.add}
              </button>
              {[activeEmail, "work@gmail.com"].map((email, index) => (
                <div
                  key={email}
                  className={`flex items-center gap-2 rounded-xl border p-3 ${panel}`}
                >
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="min-w-0 flex-1 truncate text-xs font-bold">
                    {email}
                  </span>
                  {index === 0 ? (
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-600">
                      {labels.current}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
          {tab === "changelog" ? (
            <div className={`rounded-2xl border p-4 ${panel}`}>
              <p className="text-sm font-black">Version 1.3.0</p>
              <p className="mt-1 text-[11px] text-slate-500">2026-07-13</p>
              <ul className="mt-3 space-y-2 text-xs text-slate-500">
                <li>• Inline helper on every domain</li>
                <li>• Interactive Generate and History</li>
                <li>• Unified BeUI styling and dark mode</li>
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

/** Renders a mock settings dropdown select for the extension settings demo. */
function MockSettingSelect({
  label,
  options,
  isDark,
}: {
  label: string;
  options: string[];
  isDark: boolean;
}) {
  return (
    <label className="block font-bold">
      <span className="mb-1.5 block">{label}</span>
      <select
        className={`h-10 w-full rounded-xl border px-3 text-xs ${isDark ? "border-slate-700 bg-slate-800 text-white" : "border-slate-200 bg-white text-slate-800"}`}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

/** Renders a mock toggle switch for the extension settings demo. */
function MockSwitch({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative h-6 w-11 rounded-full transition ${enabled ? "bg-blue-600" : "bg-slate-300"}`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${enabled ? "left-6" : "left-1"}`}
      />
    </button>
  );
}

/** Renders the header inside the extension popup mockup. */
function MockHeader({
  t,
  isDark,
  onToggleDark,
  onOpenSettings,
}: {
  t: (typeof translations)[Locale];
  isDark: boolean;
  onToggleDark: () => void;
  onOpenSettings: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-3xl border border-blue-400 bg-blue-600 p-4 text-white shadow-lg shadow-blue-600/15">
      <div className="flex items-center gap-3">
        <div className="relative grid h-11 w-11 place-items-center rounded-2xl bg-white p-1.5 ring-1 ring-white/30">
          <img
            src={extensionIconUrl}
            alt=""
            className="h-full w-full rounded-xl object-contain"
          />
          <Sparkles className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-white/20 p-0.5" />
        </div>
        <div>
          <p className="text-base font-black">Gmail Alias Toolkit</p>
          <p className="text-xs text-blue-100">{t.mock.subtitle}</p>
        </div>
      </div>
      <div className="flex gap-1">
        <ThemeToggle
          checked={isDark}
          onCheckedChange={() => onToggleDark()}
          variant="circle"
          start="center"
          className="h-9 w-9 rounded-2xl text-blue-50 hover:bg-white/15"
          iconClassName="h-4 w-4"
        />
        <button
          type="button"
          aria-label={t.mock.settings}
          onClick={onOpenSettings}
          className="grid h-9 w-9 place-items-center rounded-2xl text-blue-50 hover:bg-white/15"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/** Mirrors the active-account selector used by the current popup. */
function MockAccountSwitcher({
  t,
  isDark,
  activeEmail,
  isOpen,
  onToggle,
  onSelect,
}: {
  t: (typeof translations)[Locale];
  isDark: boolean;
  activeEmail: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (email: string) => void;
}) {
  const accounts = [
    "david@gmail.com",
    "work@gmail.com",
    "alias.team@gmail.com",
  ];
  return (
    <div className="relative p-3">
      <p
        className={`mb-1.5 text-xs font-bold ${isDark ? "text-slate-200" : "text-slate-700"}`}
      >
        {t.mock.activeEmail}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={onToggle}
          className={`flex h-10 min-w-0 flex-1 items-center gap-2 rounded-2xl border px-3 text-xs font-bold ${isDark ? "border-slate-700 bg-slate-800 text-white" : "border-slate-200 bg-white text-slate-800"}`}
        >
          <Mail className="h-4 w-4 shrink-0 text-slate-500" />
          <span className="min-w-0 flex-1 truncate text-left">
            {activeEmail}
          </span>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>
        <button
          type="button"
          aria-label="Add Gmail account"
          onClick={() => onSelect("new.account@gmail.com")}
          className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {isOpen ? (
        <div
          className={`absolute inset-x-3 top-[76px] z-20 overflow-hidden rounded-2xl border p-1 shadow-xl ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}
        >
          {accounts.map((email) => (
            <button
              key={email}
              type="button"
              onClick={() => onSelect(email)}
              className={`block w-full rounded-xl px-3 py-2 text-left text-xs font-bold ${email === activeEmail ? "bg-blue-50 text-blue-700" : isDark ? "text-slate-200 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-50"}`}
            >
              {email}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** Renders the animated generator tabs in the popup mockup. */
function MockTabs({
  activeTab,
  setActiveTab,
  tabs,
  isDark,
}: {
  activeTab: (typeof translations)[Locale]["tabs"][number]["id"];
  setActiveTab: (
    tab: (typeof translations)[Locale]["tabs"][number]["id"],
  ) => void;
  tabs: (typeof translations)[Locale]["tabs"];
  isDark: boolean;
}) {
  return (
    <div className="mb-3 grid grid-cols-3 gap-1.5">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;

        return (
          <motion.button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            whileTap={{ scale: 0.96 }}
            className={`relative flex h-10 items-center justify-center gap-2 rounded-xl border px-2 text-xs font-extrabold transition ${
              active
                ? "border-blue-300 text-blue-700"
                : isDark
                  ? "border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
                  : "border-slate-200 bg-white text-slate-500 hover:text-slate-950"
            }`}
          >
            {active ? (
              <motion.span
                layoutId="mock-tab"
                className="absolute inset-0 rounded-xl bg-blue-50"
                transition={{ type: "spring", bounce: 0.28, duration: 0.48 }}
              />
            ) : null}
            <Icon className="relative h-3.5 w-3.5" />
            <span className="relative truncate">{tab.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

/** Renders the active generated-alias panel in the popup mockup. */
function MockGeneratorPanel({
  currentTab,
  t,
  isDark,
}: {
  currentTab: (typeof translations)[Locale]["tabs"][number];
  t: (typeof translations)[Locale];
  isDark: boolean;
}) {
  return (
    <motion.div
      key={currentTab.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0.25, duration: 0.45 }}
      className={`rounded-2xl border p-3 shadow-sm ${isDark ? "border-slate-700 bg-slate-800/70" : "border-slate-200 bg-slate-50/60"}`}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_74px] gap-2">
        <div
          className={`min-w-0 rounded-xl border px-3 py-2 ${isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"}`}
        >
          <p className="text-[11px] font-black uppercase text-slate-400">
            {t.mock.format}
          </p>
          <p
            className={`truncate text-sm font-black ${isDark ? "text-white" : "text-slate-950"}`}
          >
            {currentTab.title}
          </p>
        </div>
        <div
          className={`rounded-xl border px-3 py-2 ${isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"}`}
        >
          <p className="text-[11px] font-black uppercase text-slate-400">
            {t.mock.count}
          </p>
          <p
            className={`text-sm font-black ${isDark ? "text-white" : "text-slate-950"}`}
          >
            10
          </p>
        </div>
      </div>
      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-extrabold text-white"
      >
        <Sparkles className="h-4 w-4" /> {t.mock.generate}
      </motion.button>
      <div
        className={`mt-3 rounded-xl border p-3 ${isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"}`}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-black text-slate-500">
            {t.mock.generated}
          </span>
          <Copy className="h-4 w-4 text-blue-600" />
        </div>
        <motion.p
          initial={{ opacity: 0.74 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className={`break-all font-mono text-sm font-bold ${isDark ? "text-blue-300" : "text-slate-950"}`}
        >
          {currentTab.alias}
        </motion.p>
      </div>
      <p className="mt-2 text-center text-[11px] leading-4 text-slate-500">
        {currentTab.desc}
      </p>
    </motion.div>
  );
}

/** Renders recent alias rows in the popup mockup. */
function MockHistory({
  t,
  isDark,
}: {
  t: (typeof translations)[Locale];
  isDark: boolean;
}) {
  return (
    <div
      className={`overflow-hidden p-3 ${isDark ? "bg-slate-900" : "bg-white"}`}
    >
      <div
        className={`overflow-hidden rounded-xl border ${isDark ? "border-slate-700" : "border-slate-200"}`}
      >
        <div
          className={`flex items-center justify-between border-b px-3 py-2 ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-50"}`}
        >
          <div
            className={`flex items-center gap-2 text-xs font-black ${isDark ? "text-slate-200" : "text-slate-700"}`}
          >
            <History className="h-3.5 w-3.5" /> {t.mock.recent}
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
            <Search className="h-3.5 w-3.5" /> {t.mock.search}
          </div>
        </div>
        <div>
          {historyItems.slice(0, 2).map((item, index) => (
            <motion.div
              key={item.alias}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * index }}
              className={`flex items-center gap-2 border-b px-3 py-2.5 last:border-b-0 ${isDark ? "border-slate-800" : "border-slate-100"}`}
            >
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate font-mono text-xs font-bold ${isDark ? "text-blue-300" : "text-slate-800"}`}
                >
                  {item.alias}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
                  {item.tag}
                </p>
              </div>
              <Star
                className={`h-4 w-4 ${
                  item.favorite
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300"
                }`}
              />
              <Clipboard className="h-4 w-4 text-blue-600" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Renders compact utility actions in the popup mockup footer. */
function MockFooter({
  t,
  isDark,
}: {
  t: (typeof translations)[Locale];
  isDark: boolean;
}) {
  return (
    <div
      className={`flex h-11 items-center justify-between px-3 text-xs font-black ${isDark ? "bg-slate-800 text-slate-200" : "bg-slate-50 text-slate-700"}`}
    >
      <span>{t.mock.viewStatistics}</span>
      <BarChart3 className="h-4 w-4 text-slate-500" />
    </div>
  );
}

/** Renders the input form for the inline popup demo. */
function InlineFormInput({
  inputValue,
  t,
}: {
  inputValue: string;
  t: (typeof translations)[Locale];
}) {
  return (
    <>
      <label className="mb-2 block text-sm font-black text-slate-800">
        {t.inlineHelper.email}
      </label>
      <div className="flex items-stretch gap-2">
        <div
          className={`flex h-12 min-w-0 flex-1 items-center rounded-xl border bg-white px-4 transition ${
            inputValue
              ? "border-emerald-400 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-400"
              : "border-slate-300 text-slate-400"
          }`}
        >
          <span className="min-w-0 truncate font-mono text-sm">
            {inputValue || t.inlineHelper.email}
          </span>
        </div>
        <button
          type="button"
          className="h-12 shrink-0 rounded-xl bg-slate-950 px-4 text-xs font-black text-white"
        >
          Submit
        </button>
      </div>
    </>
  );
}

/** Demo form container for inline helper popup. */
function InlineDemoContainer({
  t,
  inputValue,
  hoveredAlias,
  activeTab,
  setActiveTab,
  setHoveredAlias,
  setSelectedAlias,
  aliases,
}: {
  t: (typeof translations)[Locale];
  inputValue: string;
  hoveredAlias: string;
  activeTab: "suggestions" | "generate" | "history";
  setActiveTab: (tab: "suggestions" | "generate" | "history") => void;
  setHoveredAlias: (alias: string) => void;
  setSelectedAlias: (alias: string) => void;
  aliases: string[];
}) {
  return (
    <div className="relative min-h-[610px] bg-[linear-gradient(180deg,#fff,#f8fafc)] p-5 md:p-8">
      <InlineFormInput inputValue={inputValue} t={t} />

      <motion.div
        animate={{ y: hoveredAlias ? -2 : 0 }}
        className="absolute right-7 top-[126px] z-10 grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-blue-600 shadow-lg md:right-10 md:top-[138px]"
      >
        <img
          src={extensionIconUrl}
          alt=""
          className="h-5 w-5 rounded object-contain"
        />
        <span className="absolute -top-1 h-0 w-0 border-x-[5px] border-b-[6px] border-x-transparent border-b-slate-300" />
      </motion.div>

      <div className="absolute right-4 top-[176px] w-[min(320px,calc(100%-32px))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl md:right-8 md:top-[188px]">
        <InlineDemoHeader />
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50">
          {(
            [
              ["suggestions", t.inlineHelper.suggestions],
              ["generate", t.inlineHelper.generate],
              ["history", t.inlineHelper.history],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`relative min-h-12 px-2 text-[11px] font-black transition ${
                activeTab === id
                  ? "text-blue-700"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {label}
              {activeTab === id ? (
                <motion.span
                  layoutId="inline-demo-tab"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600"
                />
              ) : null}
            </button>
          ))}
        </div>
        <div className="h-[252px] overflow-y-auto p-3">
          {activeTab === "suggestions" ? (
            <InlineSuggestions
              aliases={aliases}
              label={t.inlineHelper.generatedLabel}
              onHover={setHoveredAlias}
              onSelect={setSelectedAlias}
            />
          ) : null}
          {activeTab === "generate" ? (
            <InlineGenerateDemo t={t} aliases={aliases} />
          ) : null}
          {activeTab === "history" ? (
            <InlineHistoryDemo t={t} aliases={aliases.slice(1)} />
          ) : null}
        </div>
        <div className="flex h-9 items-center gap-2 border-t border-slate-200 bg-slate-50 px-3">
          <Home className="h-4 w-4 text-slate-500" />
          <span className="h-5 w-px bg-slate-300" />
          <span className="flex-1 text-center text-[11px] font-bold text-slate-500 underline">
            Report / Review
          </span>
        </div>
      </div>
    </div>
  );
}

/** Content grid with workflow steps and demo for inline popup. */
function InlinePopupGrid({
  t,
  activeTab,
  setActiveTab,
  hoveredAlias,
  setHoveredAlias,
  setSelectedAlias,
  aliases,
  inputValue,
}: {
  t: (typeof translations)[Locale];
  activeTab: "suggestions" | "generate" | "history";
  setActiveTab: (tab: "suggestions" | "generate" | "history") => void;
  hoveredAlias: string;
  setHoveredAlias: (alias: string) => void;
  setSelectedAlias: (alias: string) => void;
  aliases: string[];
  inputValue: string;
}) {
  return (
    <div className="mt-12 grid items-start gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(520px,1.28fr)]">
      <InlineWorkflowSteps steps={t.inlineHelper.steps} />
      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
        <div className="border-b border-slate-200 bg-slate-950 px-5 py-4 text-white">
          <p className="text-sm font-black">{t.inlineHelper.demoTitle}</p>
          <p className="mt-1 text-xs text-slate-400">
            {t.inlineHelper.previewHint}
          </p>
        </div>
        <InlineDemoContainer
          t={t}
          inputValue={inputValue}
          hoveredAlias={hoveredAlias}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setHoveredAlias={setHoveredAlias}
          setSelectedAlias={setSelectedAlias}
          aliases={aliases}
        />
      </div>
    </div>
  );
}

/** Demonstrates the complete inline-helper workflow beside a website form. */
function InlinePopupSection({ t }: { t: (typeof translations)[Locale] }) {
  const [activeTab, setActiveTab] = useState<
    "suggestions" | "generate" | "history"
  >("suggestions");
  const [hoveredAlias, setHoveredAlias] = useState("");
  const [selectedAlias, setSelectedAlias] = useState("");
  const aliases = [
    "david+website@gmail.com",
    "david+website007@gmail.com",
    "david+web@gmail.com",
    "david+website-20260714@gmail.com",
  ];
  const inputValue = hoveredAlias || selectedAlias;

  return (
    <section
      id="inline-popup"
      className="border-y border-slate-200 bg-slate-50 py-20"
    >
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeading
          eyebrow={t.inlineHelper.eyebrow}
          title={t.inlineHelper.title}
          desc={t.inlineHelper.desc}
        />
        <InlinePopupGrid
          t={t}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hoveredAlias={hoveredAlias}
          setHoveredAlias={setHoveredAlias}
          setSelectedAlias={setSelectedAlias}
          aliases={aliases}
          inputValue={inputValue}
        />
      </div>
    </section>
  );
}

/** Renders numbered workflow steps for the inline popup demo section. */
function InlineWorkflowSteps({ steps }: { steps: readonly string[] }) {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <motion.div
          key={step}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.08 }}
          className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-600 text-sm font-black text-white">
            {index + 1}
          </span>
          <p className="pt-1 text-sm font-bold leading-6 text-slate-700">
            {step}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

/** Renders the header for the inline popup demo with controls. */
function InlineDemoHeader() {
  return (
    <div className="flex h-12 items-center justify-between border-b border-slate-200 bg-slate-50 px-3">
      <span className="text-xs font-black text-slate-700">
        Gmail Alias Toolkit
      </span>
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg border border-red-200 bg-red-50 text-red-600">
          <EyeOff className="h-3.5 w-3.5" />
        </span>
        <span className="h-5 w-px bg-slate-300" />
        <X className="h-4 w-4 text-slate-400" />
      </div>
    </div>
  );
}

/** Renders the suggested aliases panel for the inline popup demo. */
function InlineSuggestions({
  aliases,
  label,
  onHover,
  onSelect,
}: {
  aliases: string[];
  label: string;
  onHover: (alias: string) => void;
  onSelect: (alias: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <div className="space-y-1.5">
        {aliases.map((alias) => (
          <button
            key={alias}
            type="button"
            onMouseEnter={() => onHover(alias)}
            onMouseLeave={() => onHover("")}
            onFocus={() => onHover(alias)}
            onBlur={() => onHover("")}
            onClick={() => onSelect(alias)}
            className="w-full rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-left font-mono text-[11px] font-bold text-blue-700 transition hover:border-blue-400 hover:bg-blue-100"
          >
            {alias}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Renders the generate tab demo for the inline popup section. */
function InlineGenerateDemo({
  t,
  aliases,
}: {
  t: (typeof translations)[Locale];
  aliases: string[];
}) {
  return (
    <div>
      <div className="mb-2 grid grid-cols-3 gap-1.5">
        {["Random", "Tags", "Tricks"].map((label, index) => (
          <span
            key={label}
            className={`rounded-lg border px-2 py-2 text-center text-[10px] font-black ${
              index === 0
                ? "border-blue-300 bg-blue-50 text-blue-700"
                : "border-slate-200 text-slate-500"
            }`}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_52px] gap-2">
        <span className="rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-bold text-slate-700">
          Private Mail
        </span>
        <span className="rounded-lg border border-slate-200 px-3 py-2 text-center text-[11px] font-bold text-slate-700">
          5
        </span>
      </div>
      <button className="mt-2 w-full rounded-lg bg-blue-600 py-2 text-[11px] font-black text-white">
        {t.inlineHelper.generateAction}
      </button>
      <div className="mt-2 space-y-1.5">
        {aliases.slice(0, 2).map((alias) => (
          <div
            key={alias}
            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 font-mono text-[10px] font-bold text-blue-700"
          >
            {alias}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Renders the history tab demo for the inline popup section. */
function InlineHistoryDemo({
  t,
  aliases,
}: {
  t: (typeof translations)[Locale];
  aliases: string[];
}) {
  return (
    <div>
      <div className="rounded-lg border border-blue-200 px-3 py-2 text-[11px] text-slate-400">
        {t.inlineHelper.search}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <span className="rounded-lg border border-slate-200 px-2 py-2 text-[10px] font-bold text-slate-600">
          {t.inlineHelper.allAliases}
        </span>
        <span className="rounded-lg border border-slate-200 px-2 py-2 text-[10px] font-bold text-slate-600">
          {t.inlineHelper.mostRecent}
        </span>
      </div>
      <div className="mt-2 space-y-1.5">
        {aliases.map((alias) => (
          <div
            key={alias}
            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 font-mono text-[10px] font-bold text-blue-700"
          >
            {alias}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Renders the feature grid with active preview and sample rail. */
function FeaturesSection({ t }: { t: (typeof translations)[Locale] }) {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const activeFeature = t.features.items[activeFeatureIndex];

  return (
    <section id="features" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeading
          eyebrow={t.features.eyebrow}
          title={t.features.title}
          desc={t.features.desc}
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {t.features.items.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index}
              active={activeFeatureIndex === index}
              onSelect={() => setActiveFeatureIndex(index)}
            />
          ))}
        </div>
        <FeaturePreview feature={activeFeature} />
        <FeatureMarquee features={t.features.items} />
      </div>
    </section>
  );
}

/** Renders a reusable centered section heading. */
function SectionHeading({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="font-black text-blue-600">{eyebrow}</p>
      <h2 className="mt-3 text-4xl font-black tracking-normal text-slate-950 md:text-5xl">
        {title}
      </h2>
      <p className="mt-4 leading-7 text-slate-600">{desc}</p>
    </div>
  );
}

/** Renders one selectable feature card. */
function FeatureCard({
  feature,
  index,
  active,
  onSelect,
}: {
  feature: (typeof translations)[Locale]["features"]["items"][number];
  index: number;
  active: boolean;
  onSelect: () => void;
}) {
  const Icon = feature.icon;
  const tones = [
    "bg-blue-50 text-blue-600",
    "bg-slate-100 text-slate-700",
    "bg-indigo-50 text-indigo-600",
    "bg-sky-50 text-sky-700",
  ];

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden rounded-2xl border p-5 text-left shadow-sm outline-none transition ${
        active
          ? "border-blue-300 bg-blue-50/70 shadow-blue-950/10"
          : "border-slate-200 bg-slate-50 hover:border-blue-200"
      }`}
    >
      {active ? (
        <motion.span
          layoutId="feature-active-glow"
          className="absolute inset-x-4 top-0 h-1 rounded-b-full bg-blue-600"
          transition={{ type: "spring", bounce: 0.28, duration: 0.5 }}
        />
      ) : null}
      <div
        className={`mb-5 grid h-11 w-11 place-items-center rounded-xl ${
          tones[index % tones.length]
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-black text-slate-950">{feature.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{feature.desc}</p>
      <div className="mt-5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700">
        {feature.sample}
      </div>
    </motion.button>
  );
}

/** Renders detail preview for the currently selected feature. */
function FeaturePreview({
  feature,
}: {
  feature: (typeof translations)[Locale]["features"]["items"][number];
}) {
  const Icon = feature.icon;

  return (
    <motion.div
      key={feature.title}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0.22, duration: 0.48 }}
      className="mt-6 grid gap-4 rounded-2xl border border-blue-200 bg-blue-50/55 p-4 md:grid-cols-[auto_minmax(0,1fr)_auto]"
    >
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-white text-blue-600 shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-black text-slate-950">{feature.title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">{feature.desc}</p>
      </div>
      <div className="flex items-center rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-black text-blue-700">
        {feature.sample}
      </div>
    </motion.div>
  );
}

/** Renders a compact rail of feature samples. */
function FeatureMarquee({
  features,
}: {
  features: (typeof translations)[Locale]["features"]["items"];
}) {
  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-wrap gap-2">
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            whileHover={{ y: -2, backgroundColor: "#ffffff" }}
            transition={{ duration: 0.18 }}
            className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-black text-slate-600 shadow-sm"
          >
            {feature.sample}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** Renders the interactive Gmail tricks demo. */
function TricksSection({ t }: { t: (typeof translations)[Locale] }) {
  const [activeTrick, setActiveTrick] = useState<TrickId>("dot");
  const [copiedAlias, setCopiedAlias] = useState<string | null>(null);
  const activeAliases = gmailTrickAliases[activeTrick];

  /** Copies a trick alias and briefly displays localized feedback. */
  const copyAlias = async (alias: string) => {
    try {
      await navigator.clipboard.writeText(alias);
      setCopiedAlias(alias);
      window.setTimeout(() => setCopiedAlias(null), 1400);
    } catch {
      setCopiedAlias(null);
    }
  };

  return (
    <section className="border-y border-slate-200 bg-slate-50 py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="font-black text-blue-600">{t.tricks.eyebrow}</p>
          <h2 className="mt-3 text-4xl font-black tracking-normal text-slate-950">
            {t.tricks.title}
          </h2>
          <p className="mt-4 leading-7 text-slate-600">{t.tricks.desc}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-3 gap-2">
            {t.tricks.buttons.map((label, index) => {
              const trickId = trickIds[index];
              const active = activeTrick === trickId;

              return (
                <motion.button
                  key={trickId}
                  type="button"
                  onClick={() => setActiveTrick(trickId)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  aria-pressed={active}
                  className={`relative flex h-10 items-center justify-center overflow-hidden rounded-xl border px-2 text-center text-xs font-black ${
                    active
                      ? "border-blue-300 text-blue-700"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-200 hover:text-blue-700"
                  }`}
                >
                  {active ? (
                    <motion.span
                      layoutId="trick-active-bg"
                      className="absolute inset-0 rounded-xl bg-blue-50"
                      transition={{
                        type: "spring",
                        bounce: 0.28,
                        duration: 0.42,
                      }}
                    />
                  ) : null}
                  <span className="relative">{label}</span>
                </motion.button>
              );
            })}
          </div>
          <motion.div
            key={activeTrick}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="mt-4 space-y-2"
          >
            {activeAliases.map((alias, index) => (
              <motion.div
                key={alias}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3"
              >
                <motion.span
                  animate={{ scale: copiedAlias === alias ? [1, 1.08, 1] : 1 }}
                  transition={{ duration: 0.28 }}
                  className="grid h-5 w-5 shrink-0 place-items-center text-blue-600"
                >
                  <AtSign className="h-4 w-4" />
                </motion.span>
                <span className="min-w-0 flex-1 truncate font-mono text-sm font-bold text-slate-800">
                  {alias}
                </span>
                <motion.button
                  type="button"
                  onClick={() => copyAlias(alias)}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Copy ${alias}`}
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-blue-600 transition ${
                    copiedAlias === alias ? "bg-blue-100" : "hover:bg-blue-100"
                  }`}
                >
                  <Copy className="h-4 w-4" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-3 h-5 text-center text-xs font-bold text-blue-600">
            {copiedAlias ? t.tricks.copied : ""}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Renders the privacy-focused product promises. */
function PrivacySection({ t }: { t: (typeof translations)[Locale] }) {
  return (
    <section id="privacy" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", bounce: 0.22, duration: 0.58 }}
          className="grid gap-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-10 lg:grid-cols-[1fr_1fr]"
        >
          <PrivacyIntro t={t} />
          <PrivacyCards items={t.privacy.items} />
        </motion.div>
      </div>
    </section>
  );
}

/** Renders privacy section copy. */
function PrivacyIntro({ t }: { t: (typeof translations)[Locale] }) {
  return (
    <div>
      <p className="font-black text-blue-600">{t.privacy.eyebrow}</p>
      <h2 className="mt-3 text-4xl font-black tracking-normal text-slate-950">
        {t.privacy.title}
      </h2>
      <p className="mt-4 leading-7 text-slate-600">{t.privacy.desc}</p>
    </div>
  );
}

/** Renders privacy promise cards. */
function PrivacyCards({
  items,
}: {
  items: (typeof translations)[Locale]["privacy"]["items"];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <PrivacyCard key={item.text} item={item} />
      ))}
    </div>
  );
}

/** Renders a single privacy promise card. */
function PrivacyCard({
  item,
}: {
  item: (typeof translations)[Locale]["privacy"]["items"][number];
}) {
  const Icon = item.icon;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="rounded-2xl border border-slate-200 bg-white p-5"
    >
      <Icon className="mb-4 h-6 w-6 text-blue-600" />
      <p className="font-black text-slate-950">{item.text}</p>
    </motion.div>
  );
}

/** Renders the final install call to action. */
function CtaSection({ t }: { t: (typeof translations)[Locale] }) {
  return (
    <section className="bg-slate-950 py-20 text-white">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.58 }}
        className="mx-auto max-w-4xl px-5 text-center"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-blue-200">
          <BarChart3 className="h-4 w-4" /> {t.cta.badge}
        </div>
        <h2 className="text-4xl font-black tracking-normal md:text-5xl">
          {t.cta.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">
          {t.cta.desc}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <motion.a
            href={chromeUrl}
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -3, scale: 1.025 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-slate-950"
          >
            {t.cta.install} <ArrowRight className="h-5 w-5" />
          </motion.a>
          <motion.a
            href={firefoxUrl}
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -3, scale: 1.025 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 text-sm font-black text-white"
          >
            <Download className="h-5 w-5" /> {t.cta.installFirefox}
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}

/** Renders the localized GitHub Pages landing page. */
export function App() {
  const [locale, setLocale] = useState<Locale>("en");
  const copy = translations[locale];

  useEffect(() => {
    let favicon = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }
    favicon.href = extensionIconUrl;
  }, []);

  return (
    <main
      className="min-h-screen overflow-hidden bg-white text-slate-950"
      lang={locale}
    >
      <Header locale={locale} setLocale={setLocale} t={copy} />
      <HeroSection t={copy} />
      <AliasExplainerSection t={copy} />
      <InlinePopupSection t={copy} />
      <FeaturesSection t={copy} />
      <TricksSection t={copy} />
      <PrivacySection t={copy} />
      <CtaSection t={copy} />
    </main>
  );
}
