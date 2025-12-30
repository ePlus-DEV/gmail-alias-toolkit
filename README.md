# 📧 Gmail Alias Toolkit

A powerful browser extension for generating and managing Gmail aliases using plus addressing (+tag). Streamline your email workflow with smart presets, favorites, context menus, and Gmail tricks.

## ✨ Features

### 🎯 Core Features
- **Quick Alias Generation**: Generate Gmail aliases with custom tags instantly
- **Built-in Presets**: Shopping, Work, Test, Social, Finance, Travel
- **Custom Presets**: Create and manage unlimited custom preset tags
- **Favorites**: Save frequently used aliases with custom labels for quick access
- **Recent History**: View, search, and manage recent generated aliases
- **Multi-Account Support**: Switch between multiple Gmail accounts seamlessly
- **Statistics Dashboard**: Track usage with detailed analytics and insights

### Settings & Customization

#### General Settings
- **History Limit**: Choose how many recent aliases to keep (3-50)
- **Theme**: Light mode (Dark mode coming soon)
- **Auto-save**: Automatically save generated aliases to history
- **Show Notifications**: Toggle copy confirmation messages

#### Custom Presets
- Add unlimited custom preset buttons
- Each preset has a label and tag
- Appears separately from default presets with purple styling
- Easy add/remove functionality

#### Favorites
- Save your most-used aliases with custom labels
- Quick one-click copy access
- Star icon for easy identification
- Manage directly from the main popup

#### Statistics
- **Total Generated**: Track all aliases created
- **Created Today**: Daily usage counter
- **Created This Week**: Weekly tracking
- **Most Used Tag**: See your most popular tag

#### Advanced Features
- **Export Settings**: Download all settings as JSON
- **Import Settings**: Restore settings from backup
- **Reset Settings**: Restore all defaults
- **Clear History**: Remove all recent aliases
- **Search & Filter**: Search through recent aliases

### Keyboard Shortcuts
- `Enter`: Generate alias (when in custom tag input)
- `Ctrl/Cmd + K`: Open settings
- `Esc`: Close settings

## 🛠 Tech Stack

- **WXT**: Modern web extension framework
- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling (CSP-safe, no CDN)
- **Manifest V3**: Latest Chrome extension standard

## 📦 Installation

### Development
```bash
# Install dependencies
pnpm install
# or
yarn install

# Start development server
pnpm dev
# or
yarn dev
```

### Build for Production
```bash
# Build extension
pnpm build
# or
yarn build

# Create distributable zip
pnpm zip
# or
yarn zip
```

### Load in Chrome
1. Run `pnpm dev` or `yarn dev`
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `.output/chrome-mv3` folder

## 📖 How to Use

### Generate an Alias

1. **Set Your Base Email**
   - Enter your Gmail address (e.g., `yourname@gmail.com`)
   - The extension validates it's a Gmail address

2. **Use Quick Presets**
   - Click any preset button (Shopping, Work, etc.)
   - Alias is automatically generated and copied

3. **Create Custom Alias**
   - Type a custom tag in the input field
   - Click "Generate" or press Enter
   - Alias is copied to clipboard

### Manage Custom Presets

1. Click the ⚙️ Settings icon
2. Go to "Presets" tab
3. Enter preset label and tag
4. Click "Add Preset"
5. Your preset appears in the main view (purple style)

### Add to Favorites

1. In the Favorites section, click "+ Add"
2. Enter a label (e.g., "Amazon")
3. Enter the tag (e.g., "amazon")
4. Click "Add"
5. Access with one click anytime

### View Statistics

1. Click "View Statistics" in the main popup
2. See:
   - Total aliases generated
   - Daily and weekly counts
   - Most used tag
3. Click the X to collapse

### Export/Import Settings

#### Export
1. Open Settings → Advanced tab
2. Click "Export Settings"
3. JSON file downloads automatically
4. Save for backup

#### Import
1. Open Settings → Advanced tab
2. Click "Import Settings"
3. Select your JSON backup file
4. All settings restore instantly

### Search Recent Aliases

1. When you have 4+ recent aliases
2. Search box appears automatically
3. Type to filter aliases in real-time
4. Click any alias to copy

## 🎨 UI/UX Design

- **Clean & Modern**: Professional SaaS-style design
- **Card-Based Layout**: Organized information hierarchy
- **Responsive**: Works perfectly at 360px max width
- **Intuitive Icons**: Clear visual indicators
- **Color-Coded**: Different colors for different sections
  - Blue: Primary actions and default presets
  - Purple: Custom presets
  - Yellow: Favorites
  - Green: Success states
  - Red: Danger zone actions

## 🔐 Privacy & Security

- **Local Storage Only**: All data stored locally in your browser
- **No Analytics**: No tracking or data collection
- **No External Calls**: Works completely offline
- **No Permissions Abuse**: Only requests necessary permissions:
  - `storage`: Save settings and history
  - `clipboardWrite`: Copy aliases to clipboard

## 📂 Project Structure

```
gmail-alias-toolkit/
├── entrypoints/
│   ├── background.ts          # Background service worker
│   ├── content.ts             # Content script
│   └── popup/
│       ├── App.tsx            # Main app component
│       ├── main.tsx           # React entry point
│       ├── index.html         # Popup HTML
│       └── components/
│           ├── Settings.tsx    # Settings modal
│           ├── Statistics.tsx  # Usage statistics
│           ├── Favorites.tsx   # Favorites management
│           ├── Button.tsx      # Reusable button
│           ├── Input.tsx       # Reusable input
│           ├── Toggle.tsx      # Toggle switch
│           └── KeyboardShortcuts.tsx
├── public/
│   └── icon/                  # Extension icons
├── package.json
├── wxt.config.ts             # WXT configuration
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly**: `yarn dev` and test in browser
5. **Commit**: `git commit -m 'Add amazing feature'`
6. **Push**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines
- Follow existing code style (TypeScript + React hooks)
- Use Tailwind for styling (no custom CSS unless necessary)
- Add comments for complex logic
- Test on Chrome and Firefox if possible
- Update README if adding new features

## ⭐ Show Your Support

If you find this extension useful:
- ⭐ Star the repository
- 🐦 Share on social media
- 🔗 Link from your blog/website
- 💬 Leave a review (when published on Chrome Web Store)

## 📝 License

MIT License © 2025

Permission is hereby granted, free of charge, to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of this software.

See [LICENSE.md](LICENSE.md) for full details.

## 📧 Support & Contact

- 🐛 **Bug Reports**: Create an issue on GitHub
- 💡 **Feature Requests**: Open a discussion or issue
- ❓ **Questions**: Check this README first, then open an issue
- 📧 **Email**: dev@eplus.dev
- 🌐 **Website**: https://eplus.dev

---

**Built with ❤️ by developers, for developers**

🛠️ Stack: WXT + React 19 + TypeScript + Tailwind CSS

📦 Version: 1.0.0 | 📅 Last Updated: December 2025
