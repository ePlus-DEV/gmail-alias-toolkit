# Gmail Alias Toolkit

Generate, copy, and manage Gmail aliases from a small browser extension popup.
The extension helps you create plus-addressed aliases such as
`name+shopping@gmail.com`, Gmail dot-trick variations, custom presets, and
recent alias history without sending your data anywhere.

## Features

- Random alias generator with private-mail, alphanumeric, words, and timestamp formats.
- Custom tag generator with user-defined presets.
- Gmail tricks for dot variations, plus tags, googlemail aliases, and combinations.
- Recent aliases table with search, tag filtering, sorting, favorites, QR codes, and CSV/JSON export.
- Multi-account support with isolated history, statistics, and favorites per account.
- Settings for badge counter, random format, auto-save limit, notifications, presets, accounts, and data import/export.
- Popup header theme toggle with light and dark mode.
- Localized UI with locale key parity tests.

## Privacy

- Data is stored locally in the browser extension storage.
- No analytics or tracking.
- No remote API is required for alias generation.
- Permissions are limited to storage, clipboard writes, context menus, and page access required by the extension context menu.

## Tech Stack

- WXT and Manifest V3
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn and beUI motion components
- Vitest and Testing Library

## Requirements

- Node.js 24 or newer
- Yarn 4.14.1

## Development

Install dependencies:

```bash
yarn install
```

Prepare WXT types:

```bash
yarn exec wxt prepare
```

Run the Chrome development build:

```bash
yarn dev
```

Run the Firefox development build:

```bash
yarn dev:firefox
```

## Build

Build for Chrome:

```bash
yarn build
```

Build for Firefox:

```bash
yarn build:firefox
```

Create distributable archives:

```bash
yarn zip
yarn zip:firefox
```

## Load Locally

1. Run `yarn dev` or `yarn build`.
2. Open `chrome://extensions/`.
3. Enable Developer mode.
4. Click Load unpacked.
5. Select `.output/chrome-mv3`.

For Firefox, use the WXT Firefox output from `yarn dev:firefox` or
`yarn build:firefox`.

## Quality Checks

Run TypeScript checks:

```bash
yarn compile
```

Run tests:

```bash
yarn test
```

Run tests in watch mode:

```bash
yarn test:watch
```

## Project Structure

```text
gmail-alias-toolkit/
  entrypoints/
    background.ts
    content.ts
    popup/
      App.tsx
      main.tsx
      components/
      utils.ts
  src/
    components/
      alias/
      motion/
    lib/
  public/
    _locales/
  tests/
    setup.ts
    lib/
    popup/
  wxt.config.ts
  vitest.config.ts
  tsconfig.json
```

## Tests

All test files live in `tests/`:

- `tests/lib` covers shared library behavior such as i18n.
- `tests/popup` covers popup utilities and UI components.
- `tests/setup.ts` configures Testing Library, `browser`, and clipboard mocks.

## Internationalization

The extension uses browser i18n messages from `public/_locales`.
Current locale coverage includes English, Vietnamese, French, German, Hindi,
Japanese, and Simplified Chinese. The test suite checks that every non-English
locale has the same message keys as English.

## GitHub Automation

The repository includes GitHub Actions for:

- CI builds on pull requests and pushes to `main`.
- PR welcome comments and automatic labels.
- PR assignment and bot review requests.
- CI-based approval comments.
- Release and Dependabot workflows.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Run `yarn compile` and `yarn test`.
4. Open a pull request with screenshots or recordings for UI changes.

## License

MIT. See `LICENSE.md`.

## Support

- Issues: https://github.com/ePlus-DEV/gmail-alias-toolkit/issues
- Discussions: https://github.com/ePlus-DEV/gmail-alias-toolkit/discussions
- Email: dev@eplus.dev

## Version

Current version: `1.2.0`

See `CHANGELOG.md` for release notes.
