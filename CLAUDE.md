# Gmail Alias Toolkit Development Guide

## Code Standards

### JSDoc Comments (Required)

All functions, arrow functions, and exported components must have a JSDoc comment. This prevents DeepSource (`JS-D1001`) documentation warnings.

**Rule:** Every function declaration, arrow function, and exported component needs at minimum a one-line JSDoc comment describing its purpose.

**Format:**

```typescript
/** Brief description of what this function does. */
function myFunction() {
  // ...
}
```

**Examples:**

- `/** Renders a bar chart comparing alias creation counts for today, week, and month. */`
- `/** Loads active email account and fetches associated statistics from storage. */`
- `/** Handles storage changes and reloads stats if relevant keys change. */`

**Why:** DeepSource flags missing documentation as `JS-D1001` errors. Adding JSDoc prevents build/review failures and maintains code clarity.

---

## Project Structure

- `entrypoints/` - Browser extension entry points
- `src/` - Shared components and utilities
- `lib/` - Core libraries (i18n, etc.)

---

## Phase 1: Website Detection & Auto-suggestions

**Implemented:**

- Auto-detect active tab website (hostname normalization)
- Generate 5 alias suggestions per site
- Save website → alias mapping (local storage)
- Show "Previously used" alias in Statistics tab
- Display suggestions in Statistics tab with one-click copy
- Integrated into right-click context menu (3 suggestions)
- Auto-save mapping when suggestion is used

**Key Files:**

- `src/utils/hostnameNormalizer.ts` — URL → clean keyword (shopee, github, etc.)
- `src/services/websiteAliasService.ts` — Storage, retrieval, suggestion generation
- `entrypoints/background.ts` — Messaging + dynamic context menu population
- `entrypoints/popup/components/Statistics.tsx` — Website detection UI

**Privacy Note:**

Local-first: All mappings stored in browser.storage.local. No server or analytics.

---

## Phase 2: Email Input Helper UI

**Implemented:**

- Detect email inputs on any webpage
- Inject blue icon next to each input (like Roboform)
- Popup on icon click showing:
  - Previous alias for current website (highlighted in yellow)
  - 5 suggestion buttons
- One-click fill + auto-save mapping
- Supports controlled inputs (React, Vue, Angular)
- Watch for dynamically added inputs (SPA support)
- Dark mode styling

**Key Files:**

- `entrypoints/content/index.ts` — Content script entry point
- `entrypoints/content/email-input-helper.ts` — Icon injection + popup logic
- `entrypoints/content/email-input-helper.css` — UI styling

**Detection Logic:**

- Looks for: `input[type="email"]`, `input[name*="email"]`, `input[placeholder*="email"]`
- Uses MutationObserver to catch dynamically added inputs
- Skips hidden inputs (offsetParent === null)

---

## Testing & CI

Code is checked by DeepSource for:

- Documentation completeness (JS-D1001)
- Unused imports/variables (JS-0356)
- Array index keys (JS-0437)
- Other code quality issues

All issues must be resolved before merging to `main`.
