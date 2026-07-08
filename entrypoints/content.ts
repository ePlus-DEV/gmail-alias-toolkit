import { normalizeHostname } from "src/utils/hostnameNormalizer";
import {
  getPreviousAliasForWebsite,
  generateSuggestionsForWebsite,
  saveWebsiteAlias,
} from "src/services/websiteAliasService";
import "./content-email-helper.css";

const ICON_HTML = `
<svg class="gmail-alias-input-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
  <polyline points="22,6 12,13 2,6"/>
</svg>
`;

interface EmailInputElement extends HTMLInputElement {
  __gmailAliasIcon?: HTMLElement;
}

interface SuggestionData {
  activeEmail: string;
  previousAlias: string | null;
  suggestions: string[];
  website: string;
}

/** Fetch suggestion data for current page. */
async function fetchSuggestions(): Promise<SuggestionData | null> {
  try {
    const normalized = normalizeHostname(window.location.href);

    if (!normalized) {
      return null;
    }

    // Get active email from storage
    const accountResult = (await browser.storage.local.get([
      "email_accounts",
      "base_email",
    ])) as { email_accounts?: Array<{ isActive?: boolean; email: string }> };
    let email = "your.email@gmail.com";

    if (
      accountResult.email_accounts &&
      Array.isArray(accountResult.email_accounts)
    ) {
      const activeAccount = accountResult.email_accounts.find(
        (acc) => acc.isActive,
      );
      if (activeAccount) {
        email = activeAccount.email;
      }
    } else if (accountResult.base_email) {
      email = accountResult.base_email;
    }

    const previousAlias = await getPreviousAliasForWebsite(
      email,
      window.location.href,
    );
    const suggestions = await generateSuggestionsForWebsite(
      email,
      window.location.href,
    );

    return {
      activeEmail: email,
      previousAlias: previousAlias?.alias || null,
      suggestions,
      website: normalized,
    };
  } catch (error) {
    console.debug("Error fetching suggestions:", error);
    return null;
  }
}

/** Create popup element with suggestions. */
function createPopup(data: SuggestionData, onSelect: (alias: string) => void) {
  const popup = document.createElement("div");
  popup.className = "gmail-alias-popup";
  popup.innerHTML = `
    <div class="gmail-alias-popup-header">
      <span class="gmail-alias-popup-title">${data.website}</span>
      <button class="gmail-alias-popup-close" aria-label="Close">✕</button>
    </div>
    <div class="gmail-alias-popup-content">
      ${
        data.previousAlias
          ? `
        <div class="gmail-alias-prev-section">
          <div class="gmail-alias-prev-label">Previously used:</div>
          <button class="gmail-alias-prev-alias" data-alias="${data.previousAlias}">
            ${data.previousAlias}
          </button>
        </div>
        <div class="gmail-alias-separator"></div>
      `
          : ""
      }
      <div class="gmail-alias-suggestions">
        <div class="gmail-alias-suggestions-label">Suggestions:</div>
        <div class="gmail-alias-suggestions-list">
          ${data.suggestions
            .map(
              (alias) => `
            <button class="gmail-alias-suggestion" data-alias="${alias}">
              ${alias}
            </button>
          `,
            )
            .join("")}
        </div>
      </div>
    </div>
  `;

  // Handle close
  const closeBtn = popup.querySelector(
    ".gmail-alias-popup-close",
  ) as HTMLButtonElement;
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      popup.remove();
    });
  }

  // Handle alias selection
  popup.querySelectorAll("[data-alias]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const alias = (btn as HTMLElement).dataset.alias;
      if (alias) {
        onSelect(alias);
        popup.remove();
      }
    });
  });

  // Close on outside click
  const handleOutsideClick = (e: MouseEvent) => {
    if (!popup.contains(e.target as Node)) {
      popup.remove();
      document.removeEventListener("click", handleOutsideClick);
    }
  };

  setTimeout(() => {
    document.addEventListener("click", handleOutsideClick);
  }, 0);

  return popup;
}

/** Inject icon next to email input. */
function injectIcon(input: EmailInputElement) {
  if (input.__gmailAliasIcon) return;

  const container = document.createElement("div");
  container.className = "gmail-alias-input-wrapper";
  container.innerHTML = ICON_HTML;

  const icon = container.querySelector(".gmail-alias-input-icon") as SVGElement;

  input.parentNode?.insertBefore(container, input.nextSibling);
  container.insertBefore(input, container.firstChild);

  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.gap = "8px";

  icon.style.cursor = "pointer";
  icon.style.color = "#3b82f6";
  icon.style.opacity = "0.7";
  icon.style.transition = "opacity 0.2s";
  icon.style.flexShrink = "0";

  icon.addEventListener("mouseenter", () => {
    icon.style.opacity = "1";
  });
  icon.addEventListener("mouseleave", () => {
    icon.style.opacity = "0.7";
  });

  icon.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    document.querySelectorAll(".gmail-alias-popup").forEach((p) => p.remove());

    const data = await fetchSuggestions();
    if (!data || data.suggestions.length === 0) {
      return;
    }

    const popup = createPopup(data, async (alias) => {
      fillInput(input, alias);

      if (data.website) {
        try {
          await saveWebsiteAlias(data.activeEmail, data.website, alias);
        } catch (error) {
          console.debug("Error saving website alias:", error);
        }
      }
    });

    document.body.appendChild(popup);

    const rect = icon.getBoundingClientRect();
    popup.style.position = "fixed";
    popup.style.left = `${Math.min(rect.left, window.innerWidth - 280)}px`;
    popup.style.top = `${rect.bottom + 8}px`;
    popup.style.zIndex = "999999";
  });

  input.__gmailAliasIcon = icon;
}

/** Fill email input with alias (supports controlled inputs). */
function fillInput(input: EmailInputElement, alias: string) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )?.set;

  if (nativeInputValueSetter) {
    nativeInputValueSetter.call(input, alias);
  } else {
    input.value = alias;
  }

  ["input", "change", "blur"].forEach((eventType) => {
    input.dispatchEvent(
      new Event(eventType, { bubbles: true, composed: true }),
    );
  });

  input.focus();
}

/** Detect email inputs on page. */
function detectEmailInputs() {
  const emailInputs = document.querySelectorAll<EmailInputElement>(
    'input[type="email"], input[name*="email" i], input[placeholder*="email" i]',
  );

  emailInputs.forEach((input) => {
    if (
      input.offsetParent !== null &&
      !input.__gmailAliasIcon &&
      input.offsetWidth > 50
    ) {
      injectIcon(input);
    }
  });
}

/** Watch for dynamically added inputs. */
function observeDOM() {
  const observer = new MutationObserver(() => {
    detectEmailInputs();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["type", "name", "placeholder"],
  });

  return observer;
}

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    // Initialize email input helper
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        detectEmailInputs();
        observeDOM();
      });
    } else {
      detectEmailInputs();
      observeDOM();
    }

    window.addEventListener("load", detectEmailInputs);

    // Listen for context menu fill requests
    browser.runtime.onMessage.addListener((message) => {
      if (message.action === "fillEmail" && message.email) {
        const activeElement = document.activeElement as HTMLElement | null;

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
            fillInput(activeElement as EmailInputElement, message.email);
            activeElement.dispatchEvent(new Event("input", { bubbles: true }));
            activeElement.dispatchEvent(new Event("change", { bubbles: true }));
          } else if (activeElement.isContentEditable) {
            activeElement.textContent = message.email;
            activeElement.dispatchEvent(new Event("input", { bubbles: true }));
          }

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
