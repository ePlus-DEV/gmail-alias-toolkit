export type ChangelogChangeType = "Added" | "Changed" | "Fixed";

export interface ChangelogChange {
  readonly type: ChangelogChangeType;
  readonly items: readonly string[];
}

export interface ChangelogEntry {
  readonly version: string;
  readonly date: string;
  readonly changes: readonly ChangelogChange[];
}

export const CHANGELOG: readonly ChangelogEntry[] = [
  {
    version: "1.3.3",
    date: "2026-07-29",
    changes: [
      {
        type: "Fixed",
        items: [
          "Preserved the selected Google Workspace domain when generating website-aware aliases instead of forcing @gmail.com",
          "Filtered previous aliases, recent history, and favorites by the active account to prevent Gmail data from appearing under a Workspace account",
          "Rejected malformed base email addresses before generating inline alias suggestions",
        ],
      },
    ],
  },
  {
    version: "1.3.2",
    date: "2026-07-24",
    changes: [
      {
        type: "Added",
        items: [
          "Added generated-manifest scope verification with regression coverage for Chrome and Firefox-style permissions",
        ],
      },
      {
        type: "Changed",
        items: [
          "Aligned WXT development and production URL-scope handling",
          "Restricted development builds to the configured site allowlist while preserving all-site production support",
        ],
      },
      {
        type: "Fixed",
        items: [
          "Restored inline popup availability in production builds",
          "Prevented unrelated content scripts and broad development URL patterns from passing manifest validation",
        ],
      },
    ],
  },
  {
    version: "1.3.1",
    date: "2026-07-20",
    changes: [
      {
        type: "Added",
        items: [
          "Added Edge and Opera release packages with multi-browser installation guidance",
          "Added an interactive product tour and richer landing-page previews",
        ],
      },
      {
        type: "Changed",
        items: [
          "Improved active email handling across the popup, inline helper, and context menus",
          "Optimized inline popup behavior and displayed the active base email",
        ],
      },
      {
        type: "Fixed",
        items: [
          "Improved user feedback when disabling the inline helper or saving aliases",
          "Fixed context-menu caching, history loading, injected icon cleanup, and development-site configuration",
        ],
      },
    ],
  },
  {
    version: "1.3.0",
    date: "2026-07-13",
    changes: [
      {
        type: "Added",
        items: [
          "Added website-aware alias suggestions based on the current hostname",
          "Added an email input helper with inline icons, suggestion popups, live previews, and explicit Use actions",
          "Added previous-alias navigation and an information panel explaining supported rules and local-only storage",
          "Added expanded statistics metrics and Russian and Turkish translations",
          "Added a product landing page with automated GitHub Pages deployment",
        ],
      },
      {
        type: "Changed",
        items: [
          "Enhanced the context menu with dynamic, website-specific alias suggestions",
          "Updated the History tab to show aliases across websites and store history per email account",
          "Improved popup navigation, layout, styling, and alias selection behavior",
          "Reorganized the content script and colocated its email helper styles",
        ],
      },
      {
        type: "Fixed",
        items: [
          "Preserved email input width and flex layout when injecting the helper icon",
          "Improved helper popup positioning and hover behavior to prevent accidental closing",
          "Hid the Tags statistics tab when there is not enough data for a useful chart",
          "Hardened content rendering against client-side cross-site scripting",
          "Resolved code quality, localization, and build workflow issues",
        ],
      },
    ],
  },
  {
    version: "1.2.0",
    date: "2026-07-03",
    changes: [
      {
        type: "Added",
        items: [
          "Added Tailwind CSS v4, shadcn, and beUI motion components",
          "Added Action Swap, Animated Badge, Bouncy Accordion, Theme Toggle, Tooltip, and Table integrations",
          "Added dark mode toggle in the popup header",
          "Added locale key coverage tests for all supported languages",
        ],
      },
      {
        type: "Changed",
        items: [
          "Redesigned popup, settings, generator tabs, Gmail tricks, history table, and changelog UI with a unified beUI style",
          "Reworked Recent Aliases into a compact non-scrolling table with fixed action buttons",
          "Improved dark mode contrast, spacing, hover states, tooltips, and responsive popup layout",
          "Moved theme switching out of Settings and into the main popup header",
          "Updated all supported locales with the new UI strings",
        ],
      },
      {
        type: "Fixed",
        items: [
          "\"Copy All\" no longer undercounts statistics for generated aliases",
          "Settings/QR modals no longer render outside the popup bounds",
          "Tab key now moves focus normally instead of being hijacked for @gmail.com autocomplete",
          "Fixed missing imports and old component references after replacing legacy UI components",
          "Fixed table overflow and hidden row action buttons in alias history",
          "Fixed untranslated/fallback strings in the new UI",
        ],
      },
    ],
  },
  {
    version: "1.1.0",
    date: "2025-12-30",
    changes: [
      {
        type: "Added",
        items: [
          "Gmail alias generation with plus addressing",
          "Preset management",
          "Keyboard shortcuts",
          "Statistics tracking",
        ],
      },
      { type: "Changed", items: ["Updated dependencies"] },
      { type: "Fixed", items: ["Bug fixes and improvements"] },
    ],
  },
  {
    version: "1.0.0",
    date: "2025-12-30",
    changes: [{ type: "Added", items: ["Initial release"] }],
  },
];
