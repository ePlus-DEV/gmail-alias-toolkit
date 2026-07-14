# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Added comprehensive JSDoc comments to all functions and components to meet documentation standards
- Fixed async/await anti-patterns by replacing `void` statements with proper `.catch()` error handlers
- Improved variable declarations to use `const` where appropriate
- Optimized JSX component nesting by extracting inline form input into a separate component
- Resolved all DeepSource code quality warnings (24 issues)

## [1.3.0] - 2026-07-13

### Added

- Added website-aware alias suggestions based on the current hostname
- Added an email input helper with inline icons, suggestion popups, live previews, and explicit Use actions
- Added previous-alias navigation and an information panel explaining supported rules and local-only storage
- Added expanded statistics metrics and Russian and Turkish translations
- Added a product landing page with automated GitHub Pages deployment

### Changed

- Enhanced the context menu with dynamic, website-specific alias suggestions
- Updated the History tab to show aliases across websites and store history per email account
- Improved popup navigation, layout, styling, and alias selection behavior
- Reorganized the content script and colocated its email helper styles

### Fixed

- Preserved email input width and flex layout when injecting the helper icon
- Improved helper popup positioning and hover behavior to prevent accidental closing
- Hid the Tags statistics tab when there is not enough data for a useful chart
- Hardened content rendering against client-side cross-site scripting
- Resolved code quality, localization, and build workflow issues

## [1.2.0] - 2026-07-03

### Added

- Added Tailwind CSS v4, shadcn, and beUI motion components
- Added beUI Action Swap, Animated Badge, Bouncy Accordion, Theme Toggle, Tooltip, and Table integrations
- Added dark mode toggle in the popup header
- Added locale key coverage tests to keep all translations aligned

### Changed

- Redesigned popup, settings, generator tabs, Gmail tricks, history table, and changelog UI with a unified beUI style
- Reworked Recent Aliases into a compact non-scrolling table with fixed action buttons and copy-on-email-click behavior
- Improved dark mode contrast, spacing, hover states, tooltips, and responsive popup layout
- Moved theme switching out of Settings and into the main popup header for faster access
- Updated all locales with the new UI strings for English, Vietnamese, French, German, Hindi, Japanese, and Simplified Chinese

### Fixed

- "Copy All" no longer undercounts statistics for generated aliases
- Settings/QR modals no longer render outside the popup bounds
- Tab key now moves focus normally instead of being hijacked for @gmail.com autocomplete
- Fixed missing imports and old component references after replacing legacy UI components
- Fixed table overflow and hidden row action buttons in the alias history
- Fixed untranslated/fallback strings in the new UI and added tests for locale key parity

## [1.1.0] - 2025-12-30

### Added

- Initial release features
- Gmail alias generation with plus addressing
- Preset management
- Keyboard shortcuts
- Statistics tracking

### Changed

- Updated dependencies

### Fixed

- Bug fixes and improvements

## [1.0.0] - 2025-12-30

### Added

- Initial release
