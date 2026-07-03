# Contributing

Thanks for helping improve Gmail Alias Toolkit. This guide keeps development
details out of the README while documenting the commands and project layout.

## Requirements

- Node.js 24 or newer
- Yarn 4.14.1

## Tech Stack

- WXT and Manifest V3
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn and beUI motion components
- Vitest and Testing Library

## Setup

Install dependencies:

```bash
yarn install
```

Prepare WXT types:

```bash
yarn exec wxt prepare
```

## Development

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
When adding or changing user-facing text, update every locale. The test suite
checks that every non-English locale has the same message keys as English.

## GitHub Automation

The repository includes GitHub Actions for:

- CI builds on pull requests and pushes to `main`.
- PR welcome comments and automatic labels.
- PR assignment and bot review requests.
- CI-based approval comments.
- Release and Dependabot workflows.

## Pull Requests

1. Fork the repository.
2. Create a feature branch.
3. Keep changes scoped to the requested behavior.
4. Run `yarn compile` and `yarn test`.
5. Add screenshots or recordings for UI changes.
6. Open a pull request using the provided template.
