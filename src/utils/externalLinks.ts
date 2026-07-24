export const USER_GUIDE_URL =
  "https://ext.eplus.dev/gmail-alias-toolkit/introduction?utm_source=gmail-alias-toolkit&utm_medium=extension&utm_campaign=user-guide";

/** Opens the guide through a regular window when the tabs API is unavailable. */
function openUserGuideWindow(): boolean {
  try {
    const openedWindow = globalThis.open?.(
      USER_GUIDE_URL,
      "_blank",
      "noopener,noreferrer",
    );
    if (openedWindow) openedWindow.opener = null;
    return Boolean(openedWindow);
  } catch {
    return false;
  }
}

/** Opens the public Gmail Alias Toolkit guide with a safe browser fallback. */
export async function openUserGuide(): Promise<boolean> {
  try {
    await browser.tabs.create({ url: USER_GUIDE_URL });
    return true;
  } catch {
    return openUserGuideWindow();
  }
}
