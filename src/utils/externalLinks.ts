export const USER_GUIDE_URL =
  "https://ext.eplus.dev/gmail-alias-toolkit/introduction?utm_source=gmail-alias-toolkit&utm_medium=extension&utm_campaign=user-guide";

/** Opens the public Gmail Alias Toolkit guide in a new browser tab. */
export async function openUserGuide(): Promise<void> {
  await browser.tabs.create({ url: USER_GUIDE_URL });
}
