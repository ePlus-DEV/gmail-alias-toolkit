import { autofillEmail } from '../src/utils/autofill';

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    // Listen for messages from background script and popup.
    browser.runtime.onMessage.addListener((message) => {
      if ((message.action === "fillEmail" || message.action === "autofillAlias") && message.email) {
        const ok = autofillEmail(message.email);
        const activeElement = document.activeElement;

        if (ok && activeElement instanceof HTMLElement) {
          const originalBg = activeElement.style.backgroundColor;
          activeElement.style.backgroundColor = "#d1fae5";
          setTimeout(() => {
            activeElement.style.backgroundColor = originalBg;
          }, 500);
        }

        return Promise.resolve({ ok });
      }

      return undefined;
    });
  },
});
