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

## Testing & CI

Code is checked by DeepSource for:
- Documentation completeness (JS-D1001)
- Unused imports/variables (JS-0356)
- Array index keys (JS-0437)
- Other code quality issues

All issues must be resolved before merging to `main`.
