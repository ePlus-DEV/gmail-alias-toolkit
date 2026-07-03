# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
