/**
 * Content script: runs on every webpage.
 * Injects email input helpers and handles fill requests.
 */

import "./email-input-helper.css";
import "./email-input-helper";

/** Handle fill email request from background script. */
browser.runtime.onMessage.addListener((message) => {
  if (message.action === "fillEmail" && message.email) {
    const activeElement = document.activeElement as HTMLInputElement;

    if (
      activeElement &&
      activeElement.tagName === "INPUT" &&
      activeElement.type === "text" ||
      activeElement.type === "email"
    ) {
      // Use the same fill logic as email-input-helper
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )?.set;

      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(activeElement, message.email);
      } else {
        activeElement.value = message.email;
      }

      // Trigger events
      ["input", "change", "blur"].forEach((eventType) => {
        activeElement.dispatchEvent(
          new Event(eventType, { bubbles: true, composed: true }),
        );
      });

      activeElement.focus();
    }
  }
});
