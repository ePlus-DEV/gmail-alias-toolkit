export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    // Listen for messages from background script
    browser.runtime.onMessage.addListener((message) => {
      if (message.action === "fillEmail" && message.email) {
        // Get the active element (the input field that was right-clicked)
        const activeElement = document.activeElement;

        if (
          activeElement &&
          (activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA" ||
            activeElement.isContentEditable)
        ) {
          if (
            activeElement instanceof HTMLInputElement ||
            activeElement instanceof HTMLTextAreaElement
          ) {
            // Fill input or textarea
            activeElement.value = message.email;

            // Trigger input event for frameworks like React/Vue
            activeElement.dispatchEvent(new Event("input", { bubbles: true }));
            activeElement.dispatchEvent(new Event("change", { bubbles: true }));
          } else if (activeElement.isContentEditable) {
            // Fill contentEditable element
            activeElement.textContent = message.email;

            // Trigger input event
            activeElement.dispatchEvent(new Event("input", { bubbles: true }));
          }

          // Flash effect to show it was filled
          const originalBg = (activeElement as HTMLElement).style
            .backgroundColor;
          (activeElement as HTMLElement).style.backgroundColor = "#d1fae5";
          setTimeout(() => {
            (activeElement as HTMLElement).style.backgroundColor = originalBg;
          }, 500);
        }
      }
    });
  },
});
