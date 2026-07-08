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

## Testing & CI

Code is checked by DeepSource for:

- Documentation completeness (JS-D1001)
- Unused imports/variables (JS-0356)
- Array index keys (JS-0437)
- Other code quality issues

All issues must be resolved before merging to `main`.
