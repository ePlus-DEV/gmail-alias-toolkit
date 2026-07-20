type Locale = "vi" | "en";
type Theme = "light" | "dark";
type BrowserId = "chrome" | "firefox" | "edge" | "opera";

const STORAGE_KEYS = {
  locale: "gat-site-locale",
  theme: "gat-site-theme",
} as const;

const URLS = {
  chrome:
    "https://chromewebstore.google.com/detail/gmail-alias-toolkit/cbapjlppdfbnfbopdegobofmfijnlibl",
  firefox:
    "https://addons.mozilla.org/en-US/firefox/addon/gmail-alias-toolkit/",
  releases: "https://github.com/ePlus-DEV/gmail-alias-toolkit/releases/latest",
  install:
    "https://github.com/ePlus-DEV/gmail-alias-toolkit/blob/main/INSTALL.md",
  github: "https://github.com/ePlus-DEV/gmail-alias-toolkit",
  issues: "https://github.com/ePlus-DEV/gmail-alias-toolkit/issues",
  discussions: "https://github.com/ePlus-DEV/gmail-alias-toolkit/discussions",
  license:
    "https://github.com/ePlus-DEV/gmail-alias-toolkit/blob/main/LICENSE.md",
  support: "mailto:dev@eplus.dev",
} as const;

const copy = {
  vi: {
    installEyebrow: "Hỗ trợ đa trình duyệt",
    installTitle: "Chọn trình duyệt bạn đang sử dụng",
    installDesc:
      "Cài trực tiếp từ cửa hàng chính thức hoặc tải package tương ứng từ GitHub Releases cho Edge, Opera và các trình duyệt Chromium khác.",
    recommended: "Phù hợp với trình duyệt này",
    officialStore: "Cửa hàng chính thức",
    githubPackage: "Package GitHub Release",
    installAction: "Cài đặt",
    downloadAction: "Tải package",
    guideAction: "Xem hướng dẫn cài đặt thủ công",
    browserDescriptions: {
      chrome: "Tự động cập nhật qua Chrome Web Store.",
      firefox: "Bản ký chính thức trên Firefox Add-ons.",
      edge: "Package Chromium được đóng gói riêng cho Microsoft Edge.",
      opera: "Package Chromium được đóng gói riêng cho Opera.",
    },
    nav: {
      title: "Khám phá Gmail Alias Toolkit",
      mock: "Bản mô phỏng",
      inline: "Inline Popup",
      features: "Tính năng",
      privacy: "Quyền riêng tư",
      browsers: "Trình duyệt",
      install: "Cài tiện ích",
      menu: "Menu",
      close: "Đóng menu",
    },
    themeLight: "Chuyển sang giao diện sáng",
    themeDark: "Chuyển sang giao diện tối",
    footerTagline:
      "Tạo và quản lý Gmail alias ngay trong trình duyệt, không analytics và không gửi dữ liệu ra máy chủ.",
    footer: {
      product: "Sản phẩm",
      resources: "Tài nguyên",
      support: "Hỗ trợ",
      source: "Mã nguồn GitHub",
      releases: "Bản phát hành",
      install: "Hướng dẫn cài đặt",
      issues: "Báo lỗi / đề xuất",
      discussions: "Thảo luận",
      license: "Giấy phép MIT",
      email: "Email hỗ trợ",
      copyright: "Mã nguồn mở bởi ePlus.DEV",
    },
  },
  en: {
    installEyebrow: "Multi-browser support",
    installTitle: "Choose the browser you use",
    installDesc:
      "Install from an official store or download the matching GitHub Release package for Edge, Opera and other Chromium browsers.",
    recommended: "Recommended for this browser",
    officialStore: "Official store",
    githubPackage: "GitHub Release package",
    installAction: "Install",
    downloadAction: "Download package",
    guideAction: "View manual installation guide",
    browserDescriptions: {
      chrome: "Automatic updates through the Chrome Web Store.",
      firefox: "Official signed listing on Firefox Add-ons.",
      edge: "A Chromium package prepared specifically for Microsoft Edge.",
      opera: "A Chromium package prepared specifically for Opera.",
    },
    nav: {
      title: "Explore Gmail Alias Toolkit",
      mock: "Popup mock",
      inline: "Inline Popup",
      features: "Features",
      privacy: "Privacy",
      browsers: "Browsers",
      install: "Install extension",
      menu: "Menu",
      close: "Close menu",
    },
    themeLight: "Switch to light mode",
    themeDark: "Switch to dark mode",
    footerTagline:
      "Generate and manage Gmail aliases in your browser without analytics or remote data collection.",
    footer: {
      product: "Product",
      resources: "Resources",
      support: "Support",
      source: "GitHub source",
      releases: "Releases",
      install: "Installation guide",
      issues: "Issues and requests",
      discussions: "Discussions",
      license: "MIT license",
      email: "Support email",
      copyright: "Open source by ePlus.DEV",
    },
  },
} as const;

interface BrowserOption {
  id: BrowserId;
  name: string;
  mark: string;
  href: string;
  official: boolean;
}

const browsers: BrowserOption[] = [
  {
    id: "chrome",
    name: "Google Chrome",
    mark: "C",
    href: URLS.chrome,
    official: true,
  },
  {
    id: "firefox",
    name: "Mozilla Firefox",
    mark: "F",
    href: URLS.firefox,
    official: true,
  },
  {
    id: "edge",
    name: "Microsoft Edge",
    mark: "E",
    href: URLS.releases,
    official: false,
  },
  {
    id: "opera",
    name: "Opera",
    mark: "O",
    href: URLS.releases,
    official: false,
  },
];

function safeStorageGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable in strict privacy modes.
  }
}

function detectBrowser(): BrowserId {
  const userAgent = navigator.userAgent;
  if (/Edg\//i.test(userAgent)) return "edge";
  if (/OPR\//i.test(userAgent)) return "opera";
  if (/Firefox\//i.test(userAgent)) return "firefox";
  return "chrome";
}

function detectLocale(): Locale {
  const stored = safeStorageGet(STORAGE_KEYS.locale);
  if (stored === "vi" || stored === "en") return stored;
  return navigator.language.toLowerCase().startsWith("vi") ? "vi" : "en";
}

function detectTheme(): Theme {
  const stored = safeStorageGet(STORAGE_KEYS.theme);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

let locale: Locale = detectLocale();
let theme: Theme = detectTheme();
let menuOpen = false;

function browserCard(option: BrowserOption, recommended: BrowserId): string {
  const text = copy[locale];
  const isRecommended = option.id === recommended;
  const description = text.browserDescriptions[option.id];
  const badge = option.official ? text.officialStore : text.githubPackage;
  const action = option.official ? text.installAction : text.downloadAction;

  return `
    <article class="site-browser-card${isRecommended ? " is-recommended" : ""}">
      <div class="site-browser-card__top">
        <span class="site-browser-mark site-browser-mark--${option.id}" aria-hidden="true">${option.mark}</span>
        <div>
          <h3>${option.name}</h3>
          <p class="site-browser-kind">${badge}</p>
        </div>
      </div>
      ${
        isRecommended
          ? `<p class="site-recommended-badge">${text.recommended}</p>`
          : ""
      }
      <p class="site-browser-description">${description}</p>
      <a class="site-browser-action" href="${option.href}" target="_blank" rel="noreferrer">
        ${action}<span aria-hidden="true">↗</span>
      </a>
    </article>`;
}

function renderEnhancements(): void {
  const host = document.querySelector<HTMLElement>("#site-enhancements");
  if (!host) return;

  const text = copy[locale];
  const recommended = detectBrowser();

  host.innerHTML = `
    <section id="browser-install" class="site-install-section" aria-labelledby="browser-install-title">
      <div class="site-shell">
        <div class="site-section-heading">
          <p>${text.installEyebrow}</p>
          <h2 id="browser-install-title">${text.installTitle}</h2>
          <span>${text.installDesc}</span>
        </div>
        <div class="site-browser-grid">
          ${browsers.map((option) => browserCard(option, recommended)).join("")}
        </div>
        <a class="site-guide-link" href="${URLS.install}" target="_blank" rel="noreferrer">
          <span aria-hidden="true">⌘</span>${text.guideAction}<span aria-hidden="true">→</span>
        </a>
      </div>
    </section>

    <footer class="site-footer">
      <div class="site-shell site-footer__grid">
        <div class="site-footer__brand">
          <strong>Gmail Alias Toolkit</strong>
          <p>${text.footerTagline}</p>
          <span>${text.footer.copyright}</span>
        </div>
        <div>
          <h2>${text.footer.product}</h2>
          <a href="${URLS.github}" target="_blank" rel="noreferrer">${text.footer.source}</a>
          <a href="${URLS.releases}" target="_blank" rel="noreferrer">${text.footer.releases}</a>
          <a href="${URLS.install}" target="_blank" rel="noreferrer">${text.footer.install}</a>
        </div>
        <div>
          <h2>${text.footer.resources}</h2>
          <a href="${URLS.issues}" target="_blank" rel="noreferrer">${text.footer.issues}</a>
          <a href="${URLS.discussions}" target="_blank" rel="noreferrer">${text.footer.discussions}</a>
          <a href="${URLS.license}" target="_blank" rel="noreferrer">${text.footer.license}</a>
        </div>
        <div>
          <h2>${text.footer.support}</h2>
          <a href="${URLS.support}">${text.footer.email}</a>
          <div class="site-footer__browsers" aria-label="Chrome, Firefox, Edge, Opera">
            ${browsers.map((browser) => `<span>${browser.mark}</span>`).join("")}
          </div>
        </div>
      </div>
    </footer>

    <div class="site-desktop-tools" aria-label="Display controls">
      <button type="button" data-action="theme" class="site-icon-button"></button>
    </div>

    <nav class="site-mobile-dock" aria-label="Mobile actions">
      <a href="#browser-install" data-action="install" class="site-mobile-install">${text.nav.install}</a>
      <button type="button" data-action="theme" class="site-icon-button"></button>
      <button type="button" data-action="menu" class="site-icon-button site-menu-button" aria-expanded="${menuOpen}">
        <span aria-hidden="true">☰</span><span class="sr-only">${text.nav.menu}</span>
      </button>
    </nav>

    <div class="site-drawer${menuOpen ? " is-open" : ""}" aria-hidden="${!menuOpen}">
      <button type="button" data-action="close-menu" class="site-drawer__backdrop" aria-label="${text.nav.close}"></button>
      <aside class="site-drawer__panel" role="dialog" aria-modal="true" aria-labelledby="site-menu-title">
        <div class="site-drawer__header">
          <h2 id="site-menu-title">${text.nav.title}</h2>
          <button type="button" data-action="close-menu" class="site-icon-button" aria-label="${text.nav.close}">×</button>
        </div>
        <div class="site-drawer__links">
          <button type="button" data-scroll="#mock">${text.nav.mock}</button>
          <button type="button" data-scroll="#inline-popup">${text.nav.inline}</button>
          <button type="button" data-scroll="#features">${text.nav.features}</button>
          <button type="button" data-scroll="#privacy">${text.nav.privacy}</button>
          <button type="button" data-scroll="#browser-install">${text.nav.browsers}</button>
        </div>
        <div class="site-drawer__locale" aria-label="Language">
          <button type="button" data-locale="vi" class="${locale === "vi" ? "is-active" : ""}">VI</button>
          <button type="button" data-locale="en" class="${locale === "en" ? "is-active" : ""}">EN</button>
        </div>
        <a class="site-drawer__install" href="${browsers.find((item) => item.id === recommended)?.href ?? URLS.chrome}" target="_blank" rel="noreferrer">
          ${text.nav.install}<span aria-hidden="true">↗</span>
        </a>
      </aside>
    </div>`;

  updateThemeButtons();
  document.documentElement.lang = locale;
}

function applyTheme(nextTheme: Theme, persist = true): void {
  theme = nextTheme;
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  const themeColor = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]',
  );
  if (themeColor) themeColor.content = theme === "dark" ? "#020617" : "#2563eb";
  if (persist) safeStorageSet(STORAGE_KEYS.theme, theme);
  updateThemeButtons();
}

function updateThemeButtons(): void {
  const text = copy[locale];
  const label = theme === "dark" ? text.themeLight : text.themeDark;
  const icon = theme === "dark" ? "☀" : "☾";
  document
    .querySelectorAll<HTMLButtonElement>('[data-action="theme"]')
    .forEach((button) => {
      button.textContent = icon;
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
    });
}

function toggleMenu(open: boolean): void {
  menuOpen = open;
  document.body.classList.toggle("site-menu-open", menuOpen);
  renderEnhancements();
  if (menuOpen) {
    window.setTimeout(() => {
      document
        .querySelector<HTMLButtonElement>(".site-drawer__panel [data-scroll]")
        ?.focus();
    }, 0);
  }
}

function switchLandingLocale(nextLocale: Locale): void {
  locale = nextLocale;
  safeStorageSet(STORAGE_KEYS.locale, locale);
  document.documentElement.lang = locale;

  const ariaLabel = locale === "vi" ? "Tiếng Việt" : "English";
  const languageButton = document.querySelector<HTMLButtonElement>(
    `button[aria-label="${ariaLabel}"]`,
  );
  languageButton?.click();
  renderEnhancements();
}

function syncLocaleFromApp(): void {
  const appLocale = document.querySelector<HTMLElement>("#root main")?.lang;
  if (appLocale === "vi" || appLocale === "en") {
    if (locale !== appLocale) {
      locale = appLocale;
      safeStorageSet(STORAGE_KEYS.locale, locale);
      renderEnhancements();
    }
    document.documentElement.lang = appLocale;
  }
}

function applyPreferredLocale(attempt = 0): void {
  const main = document.querySelector<HTMLElement>("#root main");
  if (!main) {
    if (attempt < 30)
      window.setTimeout(() => applyPreferredLocale(attempt + 1), 50);
    return;
  }

  if (main.lang !== locale) {
    const ariaLabel = locale === "vi" ? "Tiếng Việt" : "English";
    document
      .querySelector<HTMLButtonElement>(`button[aria-label="${ariaLabel}"]`)
      ?.click();
  }
  syncLocaleFromApp();
}

function handleClick(event: MouseEvent): void {
  if (!(event.target instanceof Element)) return;

  const actionTarget = event.target.closest<HTMLElement>("[data-action]");
  const action = actionTarget?.dataset.action;
  if (action === "theme") {
    applyTheme(theme === "dark" ? "light" : "dark");
    return;
  }
  if (action === "menu") {
    toggleMenu(true);
    return;
  }
  if (action === "close-menu") {
    toggleMenu(false);
    return;
  }

  const scrollTarget = event.target.closest<HTMLElement>("[data-scroll]");
  const selector = scrollTarget?.dataset.scroll;
  if (selector) {
    document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" });
    toggleMenu(false);
    return;
  }

  const localeTarget = event.target.closest<HTMLElement>("[data-locale]");
  const nextLocale = localeTarget?.dataset.locale;
  if (nextLocale === "vi" || nextLocale === "en") {
    switchLandingLocale(nextLocale);
    toggleMenu(false);
    return;
  }

  const languageButton = event.target.closest<HTMLButtonElement>(
    'button[aria-label="Tiếng Việt"], button[aria-label="English"]',
  );
  if (languageButton) {
    locale =
      languageButton.getAttribute("aria-label") === "Tiếng Việt" ? "vi" : "en";
    safeStorageSet(STORAGE_KEYS.locale, locale);
    window.setTimeout(syncLocaleFromApp, 0);
  }
}

function initialize(): void {
  applyTheme(theme, false);
  renderEnhancements();
  applyPreferredLocale();
  document.addEventListener("click", handleClick);

  const root = document.querySelector("#root");
  if (root) {
    new MutationObserver(syncLocaleFromApp).observe(root, {
      subtree: true,
      attributes: true,
      attributeFilter: ["lang"],
    });
  }

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      if (!safeStorageGet(STORAGE_KEYS.theme)) {
        applyTheme(event.matches ? "dark" : "light", false);
      }
    });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuOpen) toggleMenu(false);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize, { once: true });
} else {
  initialize();
}
