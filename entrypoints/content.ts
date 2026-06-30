import { autofillEmail } from '../src/utils/autofill';

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    browser.runtime.onMessage.addListener((message) => {
      if ((message.action === 'fillEmail' || message.action === 'autofillAlias') && message.email) {
        const ok = autofillEmail(message.email);
        return Promise.resolve({ ok });
      }
      return undefined;
    });
  },
});
