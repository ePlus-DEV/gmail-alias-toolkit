import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  AtSign,
  BadgeCheck,
  BarChart3,
  Clipboard,
  Copy,
  Database,
  Download,
  EyeOff,
  FileJson,
  Github,
  History,
  Languages,
  Mail,
  Moon,
  QrCode,
  Search,
  Settings,
  ShieldCheck,
  Shuffle,
  Sparkles,
  Star,
  Tags,
  Zap,
} from "lucide-react";

const chromeUrl =
  "https://chromewebstore.google.com/detail/gmail-alias-toolkit/cbapjlppdfbnfbopdegobofmfijnlibl";
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
      features: "Tính năng",
      privacy: "Quyền riêng tư",
      install: "Thêm vào Chrome",
    },
    hero: {
      badge: "Tiện ích Chrome cho Gmail plus addressing",
      titlePrefix: "Quản lý Gmail alias bằng một",
      titleHighlight: "popup nhỏ gọn.",
      desc: "Tạo địa chỉ dạng david+tag@gmail.com, sao chép nhanh, tìm lại trong lịch sử, ghim mục yêu thích và xuất dữ liệu mà không rời khỏi trình duyệt.",
      install: "Cài tiện ích",
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
      format: "Định dạng",
      count: "Số lượng",
      generate: "Tạo và sao chép",
      generated: "Đã tạo",
      recent: "Alias gần đây",
      search: "tìm kiếm",
      settings: "Cài đặt",
    },
    features: {
      eyebrow: "Tính năng tiện ích",
      title: "Mỗi tính năng đều được mô phỏng như popup thật",
      desc: "Trang giới thiệu không chỉ kể tính năng, mà mô phỏng đúng cách extension tạo, sao chép, lưu và xuất alias.",
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
    },
  },
  en: {
    nav: {
      mock: "Mock",
      features: "Features",
      privacy: "Privacy",
      install: "Add to Chrome",
    },
    hero: {
      badge: "Chrome extension for Gmail plus addressing",
      titlePrefix: "Manage Gmail aliases from one",
      titleHighlight: "compact popup.",
      desc: "Create david+tag@gmail.com aliases, copy them quickly, search history, pin favorites and export data without leaving the browser.",
      install: "Install extension",
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
      format: "Format",
      count: "Count",
      generate: "Generate and copy",
      generated: "Generated",
      recent: "Recent aliases",
      search: "search",
      settings: "Settings",
    },
    features: {
      eyebrow: "Extension features",
      title: "Every feature is mocked like the real popup",
      desc: "The page does more than describe features: it simulates how the extension generates, copies, stores and exports aliases.",
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
  // skipcq: JS-0415 - Header markup is intentionally colocated for responsive navigation.
  return (
    <>
      <style>
        {"@keyframes beui-shimmer{from{background-position:200% 0}to{background-position:-200% 0}}"}
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

// skipcq: JS-0415
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
        <a href="#" className="flex min-w-0 items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-600 text-white shadow-glow">
            <Mail className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-black leading-none">
              Gmail Alias
            </p>
            <p className="text-xs font-semibold text-slate-500">Toolkit</p>
          </div>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-bold text-slate-600 lg:flex">
          <a href="#mock" className="hover:text-slate-950">
            {t.nav.mock}
          </a>
          <a href="#features" className="hover:text-slate-950">
            {t.nav.features}
          </a>
          <a href="#privacy" className="hover:text-slate-950">
            {t.nav.privacy}
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitch locale={locale} setLocale={setLocale} />
          <div className="hidden sm:block">
            <MagneticLink href={chromeUrl}>
              {t.nav.install} <ArrowRight className="h-4 w-4" />
            </MagneticLink>
          </div>
        </div>
      </div>
    </header>
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

// skipcq: JS-0415
/** Renders the first viewport with product positioning and extension mockup. */
function HeroSection({ t }: { t: (typeof translations)[Locale] }) {
  // skipcq: JS-0415 - Hero copy and mockup stay together to preserve the first-viewport composition.
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-[#fbfbfc]">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#111318,#2563eb,#93c5fd)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-14 pt-14 md:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.72fr)] md:pb-16 md:pt-16 lg:gap-12 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-extrabold text-blue-700 shadow-sm">
            <BadgeCheck className="h-4 w-4" /> {t.hero.badge}
          </div>
          <h1 className="max-w-3xl text-[clamp(2.55rem,7vw,4.75rem)] font-black leading-[0.98] tracking-normal text-slate-950">
            {t.hero.titlePrefix}{" "}
            <ShimmerText>{t.hero.titleHighlight}</ShimmerText>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
            {t.hero.desc}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <MagneticLink href={chromeUrl}>
              {t.hero.install} <ArrowRight className="h-5 w-5" />
            </MagneticLink>
            <MagneticLink href={githubUrl} variant="secondary">
              <Github className="h-5 w-5" /> {t.hero.source}
            </MagneticLink>
          </div>
          <HeroStats stats={t.hero.stats} />
        </motion.div>
        <ExtensionMockup t={t} />
      </div>
    </section>
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

// skipcq: JS-0415
/** Explains Gmail plus aliases with an interactive step-by-step animation. */
function AliasExplainerSection({ t }: { t: (typeof translations)[Locale] }) {
  const [activeStep, setActiveStep] = useState(1);
  const active = t.explainer.steps[activeStep];
  const baseName = "david";
  const domain = "@gmail.com";
  const tag = active.tag;
  const alias = `${baseName}${tag}${domain}`;

  // skipcq: JS-0415 - The paired explanation and animation share active-step state.
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-[0.86fr_1.14fr]">
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
          <div className="mt-7 space-y-2">
            {t.explainer.steps.map((step, index) => (
              <motion.button
                key={step.title}
                type="button"
                onClick={() => setActiveStep(index)}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex w-full items-start gap-3 overflow-hidden rounded-2xl border p-4 text-left transition ${
                  activeStep === index
                    ? "border-blue-300 bg-blue-50"
                    : "border-slate-200 bg-slate-50 hover:border-blue-200"
                }`}
              >
                {activeStep === index ? (
                  <motion.span
                    layoutId="alias-step-active"
                    className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-blue-600"
                    transition={{
                      type: "spring",
                      bounce: 0.28,
                      duration: 0.42,
                    }}
                  />
                ) : null}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white text-xs font-black text-blue-600 shadow-sm">
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block font-black text-slate-950">
                    {step.title}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-slate-600">
                    {step.desc}
                  </span>
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.62 }}
          className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 shadow-xl shadow-blue-950/5"
        >
          <div className="absolute inset-x-8 top-1/2 hidden h-px bg-slate-200 md:block" />
          <motion.div
            className="absolute left-[23%] top-1/2 hidden h-px bg-blue-500 md:block"
            initial={false}
            animate={{ width: activeStep > 1 ? "52%" : "18%" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
          <div className="relative grid gap-4 md:grid-cols-[1fr_auto_1fr]">
            <AliasNode
              label={
                activeStep === 0
                  ? t.explainer.baseLabel
                  : t.explainer.aliasLabel
              }
              primary={alias}
              tag={tag}
            />
            <div className="grid place-items-center">
              <motion.div
                whileHover={{ scale: 1.04 }}
                className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25"
              >
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            </div>
            <InboxNode
              label={t.explainer.inboxLabel}
              email={`${baseName}${domain}`}
            />
          </div>

          <motion.div
            key={activeStep}
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
                <p className="text-xs font-black uppercase text-slate-400">
                  {t.explainer.sourceLabel}
                </p>
                <p className="truncate font-mono text-sm font-black text-slate-950">
                  {tag || "+tag"} = newsletter
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
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
  const currentTab = t.tabs.find((tab) => tab.id === activeTab) ?? t.tabs[0];

  return (
    <motion.div
      id="mock"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.08 }}
      whileHover={{ y: -3 }}
      className="mx-auto w-full max-w-[390px] rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-2xl shadow-blue-950/10"
    >
      <div className="overflow-hidden rounded-[1.45rem] border border-slate-200 bg-white">
        <MockHeader />
        <MockTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={t.tabs}
        />
        <div className="p-3">
          <MockGeneratorPanel currentTab={currentTab} t={t} />
          <MockHistory t={t} />
          <MockFooter t={t} />
        </div>
      </div>
    </motion.div>
  );
}

/** Renders the header inside the extension popup mockup. */
function MockHeader() {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-950 px-4 py-3 text-white">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-black">Gmail Alias Toolkit</p>
          <p className="text-xs text-slate-300">david@gmail.com</p>
        </div>
      </div>
      <motion.div
        whileHover={{ rotate: 8, scale: 1.04 }}
        className="grid h-9 w-9 place-items-center rounded-xl bg-white/10"
      >
        <Sparkles className="h-4 w-4 text-amber-300" />
      </motion.div>
    </div>
  );
}

/** Renders the animated generator tabs in the popup mockup. */
function MockTabs({
  activeTab,
  setActiveTab,
  tabs,
}: {
  activeTab: (typeof translations)[Locale]["tabs"][number]["id"];
  setActiveTab: (
    tab: (typeof translations)[Locale]["tabs"][number]["id"],
  ) => void;
  tabs: (typeof translations)[Locale]["tabs"];
}) {
  return (
    <div className="grid grid-cols-3 gap-1.5 bg-slate-50 p-3">
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
}: {
  currentTab: (typeof translations)[Locale]["tabs"][number];
  t: (typeof translations)[Locale];
}) {
  return (
    <motion.div
      key={currentTab.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0.25, duration: 0.45 }}
      className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_74px] gap-2">
        <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <p className="text-[11px] font-black uppercase text-slate-400">
            {t.mock.format}
          </p>
          <p className="truncate text-sm font-black text-slate-950">
            {currentTab.title}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <p className="text-[11px] font-black uppercase text-slate-400">
            {t.mock.count}
          </p>
          <p className="text-sm font-black text-slate-950">10</p>
        </div>
      </div>
      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-extrabold text-white"
      >
        <Sparkles className="h-4 w-4" /> {t.mock.generate}
      </motion.button>
      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
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
          className="break-all font-mono text-sm font-bold text-slate-950"
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
function MockHistory({ t }: { t: (typeof translations)[Locale] }) {
  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2">
        <div className="flex items-center gap-2 text-xs font-black text-slate-700">
          <History className="h-3.5 w-3.5" /> {t.mock.recent}
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
          <Search className="h-3.5 w-3.5" /> {t.mock.search}
        </div>
      </div>
      <div>
        {historyItems.map((item, index) => (
          <motion.div
            key={item.alias}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 * index }}
            className="flex items-center gap-2 border-b border-slate-100 px-3 py-2.5 last:border-b-0"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-mono text-xs font-bold text-slate-800">
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
  );
}

/** Renders compact utility actions in the popup mockup footer. */
function MockFooter({ t }: { t: (typeof translations)[Locale] }) {
  const footerItems = [
    [Settings, t.mock.settings],
    [FileJson, "JSON"],
    [QrCode, "QR"],
  ] as const;

  return (
    <div className="mt-3 grid grid-cols-3 gap-2">
      {footerItems.map(([Icon, label]) => (
        <motion.div
          key={label}
          whileHover={{ y: -2 }}
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-black text-slate-700"
        >
          <Icon className="h-4 w-4 text-blue-600" />
          {label}
        </motion.div>
      ))}
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

// skipcq: JS-0415
/** Renders the privacy-focused product promises. */
function PrivacySection({ t }: { t: (typeof translations)[Locale] }) {
  // skipcq: JS-0415 - Localized privacy copy and icon cards are kept together.
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
          <div>
            <p className="font-black text-blue-600">{t.privacy.eyebrow}</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal text-slate-950">
              {t.privacy.title}
            </h2>
            <p className="mt-4 leading-7 text-slate-600">{t.privacy.desc}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {t.privacy.items.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.text}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <Icon className="mb-4 h-6 w-6 text-blue-600" />
                  <p className="font-black text-slate-950">{item.text}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
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
        <div className="mt-8 flex justify-center">
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
        </div>
      </motion.div>
    </section>
  );
}

/** Renders the localized GitHub Pages landing page. */
export function App() {
  const [locale, setLocale] = useState<Locale>("en");
  const copy = translations[locale];

  return (
    <main
      className="min-h-screen overflow-hidden bg-white text-slate-950"
      lang={locale}
    >
      <Header locale={locale} setLocale={setLocale} t={copy} />
      <HeroSection t={copy} />
      <AliasExplainerSection t={copy} />
      <FeaturesSection t={copy} />
      <TricksSection t={copy} />
      <PrivacySection t={copy} />
      <CtaSection t={copy} />
    </main>
  );
}
