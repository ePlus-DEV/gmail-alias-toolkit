# 📧 Gmail Alias Toolkit

A powerful browser extension for generating and managing Gmail aliases using plus addressing (+tag). Streamline your email workflow with random generators, custom presets, favorites, and comprehensive statistics.

## ✨ Features

### 🎯 Core Features
- **Random Alias Generator**: Generate secure random aliases with multiple format options
  - Private Mail format (e.g., `private-mail-q2ga`)
  - Alphanumeric (e.g., `abc123xy`)
  - Random Words (e.g., `happy-fox-42`)
  - Timestamp-based (e.g., `lk9x2m3n`)
- **Custom Tags**: Create aliases with your own custom tags
- **Gmail Tricks**: Quick access to Gmail filtering and management tricks
- **Built-in Presets**: Shopping, Work, Test, Social, Finance, Travel
- **Custom Presets**: Create and manage unlimited preset tags with context menu integration
- **Favorites System**: Star frequently used aliases for instant access
- **Recent Aliases**: View, search, filter, and manage alias history with pagination
- **Multi-Account Support**: Switch between multiple Gmail accounts seamlessly
- **Statistics Dashboard**: Track usage with detailed analytics and insights
- **Badge Counter**: Display alias count on extension icon (Total, Today, Week, or All-Time)

### 🎨 UI/UX Features
- **Modern Design**: Clean, gradient-based interface with card layouts
- **Tabbed Interface**: Organized main view with Random, Custom, and Gmail Tricks tabs
- **Pagination**: Navigate through large alias histories (5-50 items per page)
- **Search & Filter**: Real-time search and tag-based filtering
- **View Modes**: Switch between Recent and Favorites views
- **Responsive**: Optimized for 360px extension popup
- **Context Menu**: Right-click integration for quick alias generation on any editable field

### ⚙️ Settings & Customization

#### General Settings
- **Badge Counter**: Choose what to display on extension icon
  - None (Hidden)
  - Total in History
  - Total Generated (All Time)
  - Created Today
  - This Week
- **Random Format**: Select default format for random alias generation
- **Auto-save Limit**: Set history size (20-500 aliases)
- **Theme**: Light mode (Dark mode coming in next update)
- **Show Notifications**: Toggle copy confirmation messages

#### Account Management
- **Multi-Account**: Add, edit, delete, and switch between Gmail accounts
- **Account Labels**: Organize accounts with custom labels (Work, Personal, etc.)
- **Data Isolation**: Each account has separate history, stats, and favorites
- **Quick Add**: Add accounts directly from Settings with auto-complete
- **Email Migration**: Change account email while preserving all data

#### Custom Presets
- Add unlimited custom preset tags
- Synced with context menu automatically
- Dynamic creation and deletion
- Display with colored badges

#### Data Management
- **Export Settings**: Download all settings as JSON backup
- **Import Settings**: Restore settings from backup file
- **Clear History**: Remove all recent aliases for active account
- **Reset Settings**: Restore all defaults with confirmation

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

## � Project Structure

```
gmail-alias-toolkit/
├── entrypoints/
│   ├── background.ts          # Service worker (context menu, badge)
│   ├── content.ts             # Content script
│   └── popup/
│       ├── App.tsx            # Main popup component
│       ├── main.tsx           # React entry point
│       └── components/
│           ├── Button.tsx
│           ├── Favorites.tsx
│           ├── GmailTricks.tsx
│           ├── Input.tsx
│           ├── KeyboardShortcuts.tsx
│           ├── Settings.tsx
│           ├── Statistics.tsx
│           ├── Toggle.tsx
│           └── WelcomeScreen.tsx
├── public/
│   └── icon/                  # Extension icons
├── assets/                    # Static assets
├── package.json
├── wxt.config.ts             # WXT configuration
├── tsconfig.json             # TypeScript config
└── tailwind.config.ts        # Tailwind CSS config
```

## 🔑 Key Components

### App.tsx
- Main popup interface
- State management for accounts, history, favorites
- Pagination and filtering logic
- Account switching functionality

### background.ts
- Context menu creation and handling
- Badge counter updates
- Storage change listeners
- Dynamic menu synchronization with presets

### Settings.tsx
- Comprehensive settings interface
- Account management (add/edit/delete)
- Custom preset management
- Data import/export
- Version display from manifest

### Statistics.tsx
- Usage analytics dashboard
- Tag-based statistics (excludes 'unknown')
- Time-based counters (today, week, all-time)

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE.md](LICENSE.md) for details

## 🐛 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/gmail-alias-toolkit/issues)
- **Email**: dev@eplus.dev

## 📝 Changelog

### Version 1.1.0
- ✨ Added badge counter with 5 display options (none/total/all-time/today/week)
- 🎨 Complete Settings UI redesign with categorized card sections
- ➕ Add Account form directly in Settings tab
- 📊 Added "Total Generated (All Time)" statistics option
- 📄 Pagination system with configurable items per page (5-50)
- 🔄 Merged Favorites into Recent Aliases with tabbed interface
- 🎯 Expanded auto-save limit range (20-500)
- 💬 Email text wrapping fix (break-all for full visibility)
- 📱 Version display in Settings footer from manifest
- 🐛 Fixed duplicate state declarations bug
- 🔧 Auto-sync version from package.json to manifest

### Version 1.0.0
- 🎉 Initial release
- 🚀 Random alias generator with multiple formats
- 📌 Built-in and custom presets
- ⭐ Favorites system
- 📊 Statistics dashboard
- 🔄 Multi-account support
- 🎨 Modern UI with Tailwind CSS

---

Made with ❤️ for Gmail power users

🛠️ Built with: WXT + React 19 + TypeScript + Tailwind CSS

📦 Version: 1.1.0 | 📅 Last Updated: January 2025
