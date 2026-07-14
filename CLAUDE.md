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

### Automated Code Quality Checks

Code is checked by DeepSource for:

- Documentation completeness (JS-D1001) — All functions and components require JSDoc
- Unused imports/variables (JS-0356)
- Array index keys (JS-0437)
- Anti-patterns: void statements, improper variable declarations
- Other code quality issues

All issues must be resolved before merging to `main`.

### Unit Testing with Vitest

The project uses **Vitest** for unit testing. Tests are located in the `tests/` directory mirroring the source structure.

**Test File Locations:**

- `tests/services/` — Tests for service layer (websiteAliasService, etc.)
- `tests/utils/` — Tests for utility functions (hostnameNormalizer, inlineSiteSettings, etc.)
- `tests/popup/` — Tests for popup components and utilities
- `tests/content/` — Tests for content script helper functions

**Running Tests:**

```bash
npm test                    # Run all tests
npm test -- [file]         # Run specific test file
npm test -- --ui           # Run with UI dashboard
npm test -- --coverage     # Generate coverage report
```

**Test Standards:**

1. **Coverage Requirements:**
   - Utility functions: 100% line coverage
   - Service layer: 90%+ line coverage
   - Components: 80%+ line coverage

2. **Test Organization:**
   - One test file per module
   - Use `describe()` blocks to group related tests
   - Test both success and error paths
   - Mock external dependencies (browser APIs, storage)

3. **Best Practices:**
   - Use descriptive test names that explain what is being tested
   - Test edge cases and boundary conditions
   - Mock browser storage and extension APIs
   - Arrange → Act → Assert pattern for test structure
   - Use `beforeEach()` to reset state between tests

**Example Test Structure:**

```typescript
import { describe, expect, it, beforeEach, vi } from "vitest";

describe("functionName", () => {
  beforeEach(() => {
    // Reset state before each test
    vi.clearAllMocks();
  });

  it("should do something specific", () => {
    // Arrange: Set up test data
    const input = "test";

    // Act: Call the function
    const result = functionName(input);

    // Assert: Verify the result
    expect(result).toBe("expected");
  });
});
```

### Test Coverage

**Current Coverage Areas:**

- ✅ Hostname normalization and URL parsing
- ✅ Website alias storage and retrieval
- ✅ Alias suggestion generation
- ✅ Email address normalization
- ✅ HTML escaping (XSS prevention)
- ✅ Inline site settings management
- ✅ Gmail tricks generation (dot tricks, plus tags, etc.)
- ✅ Custom alias creation
- ✅ Popup components (Button, Input, Toggle, etc.)

**Add Tests For:**

- New utility functions (100% line coverage)
- Service layer changes (test both happy path and error cases)
- Complex component logic (interaction testing)
- Browser API integrations (with proper mocking)

### Continuous Integration

Pull requests to `main` require:

1. ✅ All tests passing
2. ✅ Code coverage maintained
3. ✅ DeepSource checks passing (zero issues)
4. ✅ TypeScript type checking strict mode
5. ✅ Prettier formatting compliance

See [CONTRIBUTING.md](CONTRIBUTING.md#publishing-to-extension-stores) for publishing and store submission procedures.
