# How to Install Gmail Alias Toolkit

## Choose a package

Download the package for your browser from the current GitHub release:

- `gmail-alias-toolkit-{version}-chrome.zip` — Google Chrome and Chromium browsers
- `gmail-alias-toolkit-{version}-firefox.zip` — Mozilla Firefox
- `gmail-alias-toolkit-{version}-edge.zip` — Microsoft Edge
- `gmail-alias-toolkit-{version}-opera.zip` — Opera

## Chrome, Edge, Opera, and other Chromium browsers

1. Download the ZIP file for your browser and extract it.
2. Rename the extracted directory to `gmail-alias-toolkit`.
3. Open your browser's extensions page:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
   - Opera: `opera://extensions`
4. Enable **Developer mode**.
5. Choose **Load unpacked**.
6. Select the extracted `gmail-alias-toolkit` directory.

### Manual updates

To preserve extension settings when updating manually:

1. Keep using the same `gmail-alias-toolkit` folder path.
2. Replace the contents of that folder with the contents from the new ZIP file.
3. Return to the extensions page and click **Reload**.

## Firefox

1. Download and extract `gmail-alias-toolkit-{version}-firefox.zip`.
2. Open `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on**.
4. Select `manifest.json` from the extracted folder.

Temporary Firefox installations are removed when Firefox restarts. For normal use, install the signed version from Firefox Add-ons.

## Official stores

- [Chrome Web Store](https://chromewebstore.google.com/detail/cbapjlppdfbnfbopdegobofmfijnlibl?utm_source=github)
- [Firefox Add-ons](https://addons.mozilla.org/addon/gmail-alias-toolkit)
- [Microsoft Edge package](https://github.com/ePlus-DEV/gmail-alias-toolkit/releases/latest)
- [Opera package](https://github.com/ePlus-DEV/gmail-alias-toolkit/releases/latest)

## Notes

- Manual installations do not update automatically.
- Keep the extracted folder after installation; deleting or moving it can disable the unpacked extension.
- The Edge and Opera packages are Chromium builds prepared specifically for their browser targets.
