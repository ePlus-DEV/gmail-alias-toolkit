import { normalizeHostname } from "src/utils/hostnameNormalizer";
import {
  getPreviousAliasForWebsite,
  generateSuggestionsForWebsite,
  saveWebsiteAlias,
} from "src/services/websiteAliasService";
import "./email-helper.css";

const ICON_HTML = `
<svg class="gmail-alias-input-icon" viewBox="0 0 512 512" width="24" height="24">
  <path fill="#1AD2A4" d="M480.833160,173.387238 C480.887878,182.380951 480.988007,191.374649 480.989960,200.368378 C481.003632,263.505157 481.000488,326.641968 480.994812,389.778748 C480.993195,407.717529 471.810669,416.982117 454.025543,416.994141 C435.534302,417.006653 417.043060,417.001556 398.551819,416.994263 C391.654938,416.991547 391.621796,416.978729 391.619720,410.215881 C391.606903,368.402344 391.622192,326.588776 391.597900,284.775238 C391.593170,276.662323 390.271912,274.774475 383.371887,272.921295 C382.988464,268.176239 382.974976,263.495758 382.985840,258.036621 C384.158905,256.122986 385.222595,254.883224 386.470978,253.871292 C391.666046,249.660324 392.286743,247.589142 390.443481,240.894226 C420.794769,218.262939 450.813965,195.825089 480.833160,173.387238 Z"/>
  <path fill="#80D8FF" d="M130.987366,272.512085 C124.197792,274.098846 122.435562,276.281677 122.431160,283.984253 C122.407288,325.745789 122.418533,367.507324 122.417694,409.268860 C122.417648,411.583405 122.417686,413.897919 122.417686,416.746155 C98.964455,416.746155 75.913673,416.746155 52.477318,416.171814 C51.061993,408.746429 49.163788,401.898590 49.138130,395.043732 C48.906353,333.116760 48.996483,271.188538 49.009857,209.260666 C49.011581,201.272003 49.113682,193.283386 49.446838,185.443527 C74.448181,204.083694 99.171974,222.575073 123.773499,241.438065 C121.357445,246.650757 122.820259,250.330292 126.945351,253.445587 C128.573837,254.675461 129.768768,256.479401 131.161102,258.021973 C131.106705,262.697510 131.052307,267.373016 130.987366,272.512085 Z"/>
  <path fill="#465B65" d="M130.976837,272.975647 C136.643997,273.443146 138.982910,276.190430 138.986389,282.584686 C139.003952,314.916046 138.995346,347.247437 138.995605,379.578796 C138.995728,394.077911 139.009247,408.577087 138.989120,423.076172 C138.978882,430.453705 136.488220,432.990723 129.309555,432.992737 C104.477722,432.999725 79.640175,432.668640 54.815918,433.102173 C35.945892,433.431763 16.828398,415.757477 16.889156,395.088257 C17.156145,304.261200 17.144989,213.432556 16.908455,122.605331 C16.846836,98.944221 35.539627,76.652397 57.512516,71.006310 C78.170227,65.698174 95.565262,71.681549 112.036491,84.339577 C144.482849,109.274368 177.431122,133.556625 210.203949,158.065750 C225.680832,169.640137 241.232025,181.115173 257.232880,192.994034 C266.606598,186.001755 276.251831,178.847717 285.854187,171.636627 C315.808319,149.142014 345.719147,126.589584 375.703796,104.135750 C387.724091,95.134422 399.664948,85.998863 412.045959,77.513840 C432.212463,63.693172 462.237885,67.092735 479.800232,84.186531 C491.635254,95.705833 497.134796,109.259438 497.095917,125.810379 C496.885010,215.637787 496.998566,305.465942 496.993652,395.293854 C496.992523,415.838409 479.930023,432.985107 459.484589,432.993378 C434.486115,433.003479 409.487610,433.000336 384.489136,432.992004 C377.659332,432.989716 375.016815,430.344513 375.014374,423.369476 C374.997894,376.372314 374.998444,329.375183 375.016541,282.378021 C375.018829,276.499695 377.076874,273.899872 382.988190,272.973083 C390.271912,274.774475 391.593170,276.662323 391.597900,284.775238 C391.622192,326.588776 391.606903,368.402344 391.619720,410.215881 C391.621796,416.978729 391.654938,416.991547 398.551819,416.994263 C417.043060,417.001556 435.534302,417.006653 454.025543,416.994141 C471.810669,416.982117 480.993195,407.717529 480.994812,389.778748 C481.000488,326.641968 481.003632,263.505157 480.989960,200.368378 C480.988007,191.374649 480.887878,182.380951 480.897003,172.962875 C480.970215,156.444443 481.109589,140.349136 480.954102,124.256653 C480.781830,106.430855 468.991608,91.490631 451.624329,86.973412 C437.974579,83.223602 426.459900,86.876694 415.727356,94.941719 C365.284912,132.847061 314.762451,170.646057 264.208618,208.402725 C262.015839,210.040421 259.232544,210.887375 256.398193,211.985840 C254.040649,210.780624 251.833984,209.927841 250.004944,208.567383 C231.571289,194.856064 213.218445,181.036163 194.805328,167.297134 C173.597748,151.472992 152.352249,135.699631 130.933350,119.627365 C119.458046,110.891548 108.308647,102.241074 96.814407,94.076019 C92.712837,91.162437 87.776039,89.424629 82.825073,87.010628 C58.031528,80.060265 33.122623,98.580971 33.074780,124.146751 C32.907104,213.743851 32.985107,303.341431 33.026543,392.938843 C33.032082,404.911285 40.350964,413.716705 52.492897,416.586700 C75.913673,416.746155 98.964455,416.746155 122.417686,416.746155 C122.417686,413.897919 122.417648,411.583405 122.417694,409.268860 C122.418533,367.507324 122.407288,325.745789 122.431160,283.984253 C122.435562,276.281677 124.197792,274.098846 130.976837,272.975647 Z"/>
  <path fill="#FF8A80" d="M383.976044,237.845490 C381.053131,239.310242 377.832672,240.375885 375.252014,242.299713 C337.360016,270.546936 299.517029,298.860443 261.786560,327.322784 C258.306244,329.948181 256.093933,330.220215 252.441986,327.463623 C214.455231,298.790039 176.322189,270.310028 138.171158,241.854828 C135.967422,240.211136 133.256714,239.247147 130.417709,237.436127 C130.051086,200.678070 130.025177,164.450714 130.092819,128.223526 C130.097992,125.449791 130.764236,122.677284 131.123215,119.904213 C152.352249,135.699631 173.597748,151.472992 194.805328,167.297134 C213.218445,181.036163 231.571289,194.856064 250.004944,208.567383 C251.833984,209.927841 254.040649,210.780624 256.596466,212.268524 C268.142395,221.203903 268.133392,221.191803 279.203827,212.942627 C315.242401,186.088409 351.288177,159.243851 387.336304,132.902405 C386.219604,168.221329 385.097809,203.033401 383.976044,237.845490 Z"/>
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
function createPopup(
  data: SuggestionData,
  onSelect: (alias: string) => void,
  input?: EmailInputElement,
) {
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
            .filter((alias) => alias !== data.previousAlias)
            .map(
              (alias) => `
            <div class="gmail-alias-suggestion-item" data-alias="${alias}">
              <div class="gmail-alias-suggestion-text">${alias}</div>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
      <div class="gmail-alias-info-panel">
        <div class="gmail-alias-info-title">Gmail Plus Alias Manager</div>
        <ul class="gmail-alias-info-list">
          <li>📋 Auto-detect websites</li>
          <li>💾 Save alias mappings</li>
          <li>🔄 Reuse previous aliases</li>
          <li>🔒 Local-first, no tracking</li>
        </ul>
        <div class="gmail-alias-privacy-note">
          Gmail plus aliases help with filtering and tracking, but do not hide your real email address.
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

  // Handle suggestion item hover for preview and click to select
  if (input) {
    const originalValue = input.value;

    popup.querySelectorAll(".gmail-alias-suggestion-item").forEach((item) => {
      const alias = (item as HTMLElement).dataset.alias;

      item.addEventListener("mouseenter", () => {
        if (alias) {
          // Show preview in input with visual indicator
          fillInput(input, alias);
          input.classList.add("gmail-alias-input-preview");
        }
      });

      item.addEventListener("mouseleave", () => {
        // Restore original input value
        input.value = originalValue;
        input.classList.remove("gmail-alias-input-preview");
      });

      item.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (alias) {
          onSelect(alias);
          popup.remove();
        }
      });
    });
  }

  // Handle previous alias button hover and click
  const prevAliasBtn = popup.querySelector(
    ".gmail-alias-prev-alias",
  ) as HTMLElement;
  if (prevAliasBtn && input) {
    const originalValue = input.value;

    prevAliasBtn.addEventListener("mouseenter", () => {
      const alias = prevAliasBtn.dataset.alias;
      if (alias) {
        fillInput(input, alias);
        input.classList.add("gmail-alias-input-preview");
      }
    });

    prevAliasBtn.addEventListener("mouseleave", () => {
      input.value = originalValue;
      input.classList.remove("gmail-alias-input-preview");
    });

    prevAliasBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const alias = prevAliasBtn.dataset.alias;
      if (alias) {
        onSelect(alias);
        popup.remove();
      }
    });
  }

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

  try {
    const container = document.createElement("div");
    container.className = "gmail-alias-input-wrapper";
    container.innerHTML = ICON_HTML;

    const icon = container.querySelector(
      ".gmail-alias-input-icon",
    ) as SVGElement;
    if (!icon) {
      console.error("[Gmail Alias] Failed to create icon SVG");
      return;
    }

    input.parentNode?.insertBefore(container, input.nextSibling);
    container.insertBefore(input, container.firstChild);

    console.debug("[Gmail Alias] Icon injected successfully");

    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.gap = "8px";

    icon.style.cursor = "pointer";
    icon.style.color = "#3b82f6";
    icon.style.opacity = "0.7";
    icon.style.transition = "opacity 0.2s";
    icon.style.flexShrink = "0";

    let closeTimer: NodeJS.Timeout;

    icon.addEventListener("mouseenter", async () => {
      clearTimeout(closeTimer);
      icon.style.opacity = "1";
      input.classList.add("gmail-alias-input-highlight");

      // Show popup on hover
      document
        .querySelectorAll(".gmail-alias-popup")
        .forEach((p) => p.remove());

      const data = await fetchSuggestions();
      if (!data || data.suggestions.length === 0) {
        return;
      }

      const popup = createPopup(
        data,
        async (alias) => {
          fillInput(input, alias);
          input.classList.remove("gmail-alias-input-preview");

          if (data.website) {
            try {
              await saveWebsiteAlias(data.activeEmail, data.website, alias);
            } catch (error) {
              console.debug("Error saving website alias:", error);
            }
          }
        },
        input,
      );

      document.body.appendChild(popup);

      // const iconRect = icon.getBoundingClientRect();
      // popup.style.position = "fixed";
      // Position popup to the right of the icon, below it
      // popup.style.left = `${Math.min(iconRect.right + 8, window.innerWidth - 280)}px`;
      // popup.style.top = `${iconRect.bottom + 8}px`;
      // popup.style.zIndex = "999999";

      const rect = icon.getBoundingClientRect();
      popup.style.position = "fixed";
      popup.style.left = `${Math.min(rect.left, window.innerWidth - 280)}px`;
      // Position popup slightly overlapping the input to prevent gap on hover
      popup.style.top = `${rect.top - 4}px`;
      popup.style.zIndex = "999999";

      // Keep popup open when hovering over it
      popup.addEventListener("mouseenter", () => {
        clearTimeout(closeTimer);
      });

      popup.addEventListener("mouseleave", () => {
        closeTimer = setTimeout(() => {
          popup.remove();
        }, 100);
      });
    });

    icon.addEventListener("mouseleave", () => {
      icon.style.opacity = "0.85";
      input.classList.remove("gmail-alias-input-highlight");
      // Delay close to allow mouse movement to popup (with overlap, 250ms buffer)
      closeTimer = setTimeout(() => {
        document
          .querySelectorAll(".gmail-alias-popup")
          .forEach((p) => p.remove());
      }, 250);
    });

    input.__gmailAliasIcon = icon as unknown as HTMLElement;
  } catch (error) {
    console.error("[Gmail Alias] Error injecting icon:", error);
  }
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
    'input[type="email"], input[name*="email" i], input[placeholder*="email" i], input[id*="email" i], input[aria-label*="email" i]',
  );

  console.debug(`[Gmail Alias] Found ${emailInputs.length} email inputs`);

  emailInputs.forEach((input, idx) => {
    const isVisible = input.offsetParent !== null;
    const hasIcon = !!input.__gmailAliasIcon;
    const isWideEnough = input.offsetWidth > 50;

    console.debug(
      `[Gmail Alias] Input ${idx}: visible=${isVisible}, hasIcon=${hasIcon}, width=${input.offsetWidth}px`,
    );

    if (isVisible && !hasIcon && isWideEnough) {
      console.debug(`[Gmail Alias] Injecting icon for input ${idx}`);
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
    // Setup observer immediately
    const observer = observeDOM();

    // Initial detect
    detectEmailInputs();

    // Periodic fallback scan for SPA/lazy-loaded inputs
    const scanInterval = setInterval(() => {
      detectEmailInputs();
    }, 2000);

    // Listen for DOM ready events
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", detectEmailInputs);
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

    // Cleanup on unload
    window.addEventListener("beforeunload", () => {
      clearInterval(scanInterval);
      observer.disconnect();
    });
  },
});
