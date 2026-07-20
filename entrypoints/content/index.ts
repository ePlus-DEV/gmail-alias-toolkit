import { normalizeHostname } from "src/utils/hostnameNormalizer";
import {
  INLINE_DISABLED_SITES_KEY,
  normalizeSiteHostname,
  parseDisabledInlineSites,
} from "src/utils/inlineSiteSettings";
import { t } from "../../lib/i18n";
import {
  getPreviousAliasForWebsite,
  generateSuggestionsForWebsite,
  saveWebsiteAlias,
} from "src/services/websiteAliasService";
import {
  generateAlias,
  generateRandomString,
  filterAliases,
  getAccountStorageKey,
  getAliasTags,
  getDotVariationCandidates,
  paginateItems,
  type RandomFormat,
} from "../popup/utils";
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
  __gmailAliasPosition?: () => void;
  __gmailAliasCleanup?: () => void;
}

let inlineDisabledForCurrentSite = false;

/** Gets the normalized hostname for the current site. */
const currentSiteHostname = () =>
  normalizeSiteHostname(window.location.hostname);

/** Removes all inline helper icons and popups from the page. */
function removeInlineHelpers() {
  document
    .querySelectorAll<EmailInputElement>("input")
    .forEach((input) => input.__gmailAliasCleanup?.());
  document
    .querySelectorAll(".gmail-alias-popup, .gmail-alias-input-icon-container")
    .forEach((element) => element.remove());
}

/** Disables the inline helper for the current website and removes all helpers. */
async function disableInlineForCurrentSite() {
  const site = currentSiteHostname();
  if (!site) return;

  const result = await browser.storage.local.get(INLINE_DISABLED_SITES_KEY);
  const disabledSites = parseDisabledInlineSites(
    result[INLINE_DISABLED_SITES_KEY],
  );
  await browser.storage.local.set({
    [INLINE_DISABLED_SITES_KEY]: Array.from(
      new Set([...disabledSites, site]),
    ).sort((a, b) => a.localeCompare(b)),
  });
  inlineDisabledForCurrentSite = true;
  removeInlineHelpers();
}

/** Escape HTML special characters to prevent XSS attacks. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface SuggestionData {
  activeEmail: string;
  previousAlias: string | null;
  suggestions: string[];
  website: string;
}

interface StoredAccountData {
  email_accounts?: Array<{ isActive?: boolean; email: string }>;
  base_email?: string;
}

/** Removes accidental text appended after a configured Gmail domain. */
function normalizeConfiguredEmail(email: string): string {
  const trimmed = email.trim();
  const gmailMatch = trimmed.match(
    /^([^@\s]+)@(gmail\.com|googlemail\.com)(?:[^@\s]+)?$/i,
  );

  return gmailMatch
    ? `${gmailMatch[1]}@${gmailMatch[2].toLowerCase()}`
    : trimmed;
}

/** Returns the configured active account with safe legacy fallbacks. */
function resolveActiveEmail(accountData: StoredAccountData): string {
  const accounts = Array.isArray(accountData.email_accounts)
    ? accountData.email_accounts
    : [];
  return normalizeConfiguredEmail(
    accounts.find((account) => account.isActive)?.email ||
      accountData.base_email ||
      accounts[0]?.email ||
      "your.email@gmail.com",
  );
}

/** Fetch suggestion data for current page. */
async function fetchSuggestions(): Promise<SuggestionData | null> {
  const normalized = normalizeHostname(window.location.href);
  if (!normalized) return null;

  let email: string | null = null;
  try {
    const accountResult = (await browser.storage.local.get([
      "email_accounts",
      "base_email",
    ])) as StoredAccountData;
    email = resolveActiveEmail(accountResult);
  } catch {
    // Storage access failed; cannot determine real account
    return null;
  }

  const [previousResult, suggestionsResult] = await Promise.allSettled([
    getPreviousAliasForWebsite(email, window.location.href),
    generateSuggestionsForWebsite(email, window.location.href),
  ]);

  return {
    activeEmail: email,
    previousAlias:
      previousResult.status === "fulfilled"
        ? previousResult.value?.alias || null
        : null,
    suggestions:
      suggestionsResult.status === "fulfilled" ? suggestionsResult.value : [],
    website: normalized,
  };
}

/** Create popup element with suggestions. */
function createPopup(
  data: SuggestionData,
  onSelect: (alias: string, recordUsage?: boolean) => void,
  input?: EmailInputElement,
) {
  const popup = document.createElement("div");
  const isFirefox =
    browser.runtime.getURL("").startsWith("moz-extension://") ||
    navigator.userAgent.includes("Firefox");
  const reviewUrl = isFirefox
    ? "https://addons.mozilla.org/en-US/firefox/addon/gmail-alias-toolkit/reviews/"
    : "https://chromewebstore.google.com/detail/gmail-alias-toolkit/cbapjlppdfbnfbopdegobofmfijnlibl/reviews";
  const homepageUrl = "https://eplus-dev.github.io/gmail-alias-toolkit/";
  popup.className = "gmail-alias-popup";
  popup.style.cssText = `
    position: fixed;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
    z-index: 999999;
    min-width: 280px;
    max-width: 320px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 14px;
    color: #1f2937;
  `;
  const safeWebsite = escapeHtml(data.website);
  const safePreviousAlias = data.previousAlias
    ? escapeHtml(data.previousAlias)
    : "";
  const labels = {
    close: escapeHtml(t("close")),
    suggestions: escapeHtml(t("generatedAliases")),
    generate: escapeHtml(t("generate")),
    history: escapeHtml(t("recentAliases")),
    previous: escapeHtml(t("recentAliases")),
    random: escapeHtml(t("random")),
    tags: escapeHtml(t("tabTagsShort")),
    tricks: escapeHtml(t("tabTricksShort")),
    privateMail: escapeHtml(t("privateMailFormat")),
    alphanumeric: escapeHtml(t("randomCharactersFormat")),
    words: escapeHtml(t("randomWordsFormat")),
    timestamp: escapeHtml(t("timestampFormat")),
    numberOfAliases: escapeHtml(t("numberOfAliases")),
    tagPlaceholder: escapeHtml(t("tagPlaceholder")),
    select: escapeHtml(t("select")),
    dotTrick: escapeHtml(t("dotTrick")),
    plusTags: escapeHtml(t("plusTags")),
    googlemail: escapeHtml(t("googlemail")),
    removeDots: escapeHtml(t("removeDots")),
    generateTricks: escapeHtml(t("generateTricks")),
    searchAliases: escapeHtml(t("searchAliases")),
    favorites: escapeHtml(t("favorites")),
    allTags: escapeHtml(t("allTags")),
    mostRecent: escapeHtml(t("mostRecent")),
    az: escapeHtml(t("az")),
    previousPage: escapeHtml(t("previousPage")),
    nextPage: escapeHtml(t("nextPage")),
    disableInlineForSite: escapeHtml(t("disableInlineForSite")),
    extensionName: escapeHtml(t("extensionName")),
    reportReview: escapeHtml(t("reportReview")),
  };
  popup.innerHTML = `
    <div class="gmail-alias-popup-header" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #e5e7eb; background: #f9fafb; border-radius: 8px 8px 0 0;">
      <span class="gmail-alias-popup-title" title="${safeWebsite}" style="font-weight: 600; font-size: 13px; color: #374151;">${labels.extensionName}</span>
      <div class="gmail-alias-popup-header-actions" style="display: flex; align-items: center; gap: 6px;">
        <button class="gmail-alias-popup-disable-site" type="button" data-tooltip="${labels.disableInlineForSite}" aria-label="${labels.disableInlineForSite}">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
            <circle cx="12" cy="12" r="2.5" />
            <path d="M4 4l16 16" />
          </svg>
        </button>
        <button class="gmail-alias-popup-close" style="background: none; border: none; cursor: pointer; font-size: 20px; color: #9ca3af; padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; transition: color 0.2s ease;" aria-label="${labels.close}">✕</button>
      </div>
    </div>
    <div class="gmail-alias-popup-tabs" style="display: flex; border-bottom: 1px solid #e5e7eb; background: #f9fafb;">
      <button class="gmail-alias-popup-tab active" data-tab="suggestions" style="flex: 1; padding: 10px; border: none; background: none; border-bottom: 2px solid transparent; font-weight: 600; font-size: 12px; color: #6b7280; cursor: pointer; transition: all 0.2s ease; text-transform: capitalize;">${labels.suggestions}</button>
      <button class="gmail-alias-popup-tab" data-tab="generate" style="flex: 1; padding: 10px; border: none; background: none; border-bottom: 2px solid transparent; font-weight: 600; font-size: 12px; color: #6b7280; cursor: pointer; transition: all 0.2s ease; text-transform: capitalize;">${labels.generate}</button>
      <button class="gmail-alias-popup-tab" data-tab="history" style="flex: 1; padding: 10px; border: none; background: none; border-bottom: 2px solid transparent; font-weight: 600; font-size: 12px; color: #6b7280; cursor: pointer; transition: all 0.2s ease; text-transform: capitalize;">${labels.history}</button>
    </div>
    <div class="gmail-alias-popup-content" style="padding: 12px; max-height: 320px; overflow-y: auto;">
      <div class="gmail-alias-popup-tab-content active" data-tab-content="suggestions">
        <div class="gmail-alias-base-email-section" style="margin-bottom: 12px;">
          <div class="gmail-alias-base-label" style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #9ca3af; margin-bottom: 8px; letter-spacing: 0.5px;">Main Account:</div>
          <button class="gmail-alias-base-email" data-alias="${escapeHtml(data.activeEmail)}" style="display: block; width: 100%; padding: 8px 12px; background: #f0f9ff; border: 2px solid #3b82f6; border-radius: 6px; font-family: 'Monaco', 'Courier New', monospace; font-size: 12px; color: #1e40af; cursor: pointer; text-align: left; transition: all 0.2s ease; font-weight: 500;">
            ${escapeHtml(data.activeEmail)}
          </button>
        </div>
        ${
          data.previousAlias
            ? `
          <div class="gmail-alias-prev-section" style="margin-bottom: 12px;">
            <div class="gmail-alias-prev-label" style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #9ca3af; margin-bottom: 8px; letter-spacing: 0.5px;">${labels.previous}:</div>
            <button class="gmail-alias-prev-alias" data-alias="${safePreviousAlias}" style="display: block; width: 100%; padding: 8px 12px; background: #fef3c7; border: 1px solid #fcd34d; border-radius: 6px; font-family: 'Monaco', 'Courier New', monospace; font-size: 12px; color: #92400e; cursor: pointer; text-align: left; transition: all 0.2s ease;">
              ${safePreviousAlias}
            </button>
          </div>
          <div class="gmail-alias-separator" style="height: 1px; background: #e5e7eb; margin: 12px 0;"></div>
        `
            : ""
        }
        <div class="gmail-alias-suggestions" style="display: flex; flex-direction: column; gap: 8px;">
          <div class="gmail-alias-suggestions-label" style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #9ca3af; letter-spacing: 0.5px;">${labels.suggestions}:</div>
          <div class="gmail-alias-suggestions-list" style="display: flex; flex-direction: column; gap: 6px;">
            ${data.suggestions
              .filter((alias) => alias !== data.previousAlias)
              .map((alias) => {
                const safeAlias = escapeHtml(alias);
                return `
              <div class="gmail-alias-suggestion-item" data-alias="${safeAlias}" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: #f0f9ff; border: 1px solid #bfdbfe; border-radius: 6px; cursor: pointer; transition: all 0.2s ease;">
                <div class="gmail-alias-suggestion-text" style="flex: 1; font-family: 'Monaco', 'Courier New', monospace; font-size: 12px; color: #1e40af; text-align: left; word-break: break-all;">${safeAlias}</div>
              </div>
            `;
              })
              .join("")}
          </div>
        </div>
      </div>
      <div class="gmail-alias-popup-tab-content" data-tab-content="generate">
        <div style="display: flex; gap: 6px; margin-bottom: 10px;">
          <button class="gmail-alias-generate-mode active" data-mode="random">${labels.random}</button>
          <button class="gmail-alias-generate-mode" data-mode="tags">${labels.tags}</button>
          <button class="gmail-alias-generate-mode" data-mode="tricks">${labels.tricks}</button>
        </div>
        <div class="gmail-alias-generate-panel active" data-generate-panel="random">
          <div style="display: grid; grid-template-columns: minmax(0, 1fr) 58px; gap: 6px;">
            <select class="gmail-alias-random-format">
              <option value="private-mail">${labels.privateMail}</option>
              <option value="alphanumeric">${labels.alphanumeric}</option>
              <option value="words">${labels.words}</option>
              <option value="timestamp">${labels.timestamp}</option>
            </select>
            <input type="number" class="gmail-alias-random-count" min="1" max="20" value="5" aria-label="${labels.numberOfAliases}">
          </div>
          <button class="gmail-alias-quick-action gmail-alias-random-btn">${labels.generate}</button>
          <div class="gmail-alias-generated-list"></div>
        </div>
        <div class="gmail-alias-generate-panel" data-generate-panel="tags">
          <div style="display: flex; gap: 6px;">
            <input type="text" class="gmail-alias-generate-input" placeholder="${labels.tagPlaceholder}">
            <button class="gmail-alias-generate-btn">${labels.select}</button>
          </div>
          <div class="gmail-alias-preset-list"></div>
        </div>
        <div class="gmail-alias-generate-panel" data-generate-panel="tricks">
          <div style="display: grid; grid-template-columns: minmax(0, 1fr) 58px; gap: 6px;">
            <select class="gmail-alias-trick-type">
              <option value="dot">${labels.dotTrick}</option>
              <option value="plus">${labels.plusTags}</option>
              <option value="googlemail">${labels.googlemail}</option>
              <option value="nodots">${labels.removeDots}</option>
            </select>
            <input type="number" class="gmail-alias-trick-count" min="1" max="20" value="5" aria-label="${labels.numberOfAliases}">
          </div>
          <button class="gmail-alias-quick-action gmail-alias-trick-btn">${labels.generateTricks}</button>
          <div class="gmail-alias-trick-list"></div>
        </div>
      </div>
      <div class="gmail-alias-popup-tab-content" data-tab-content="history">
        <div class="gmail-alias-history-section">
          <input type="search" class="gmail-alias-history-search" placeholder="${labels.searchAliases}" aria-label="${labels.searchAliases}">
          <div class="gmail-alias-history-filters">
            <select class="gmail-alias-history-view" aria-label="${labels.history}">
              <option value="all">${labels.history}</option>
              <option value="favorites">${labels.favorites}</option>
            </select>
            <select class="gmail-alias-history-tag" aria-label="${labels.allTags}">
              <option value="all">${labels.allTags}</option>
            </select>
            <select class="gmail-alias-history-sort" aria-label="${labels.mostRecent}">
              <option value="recent">${labels.mostRecent}</option>
              <option value="alphabetical">${labels.az}</option>
            </select>
            <select class="gmail-alias-history-page-size" aria-label="${labels.numberOfAliases}">
              <option value="5">${escapeHtml(t("perPage", "5"))}</option>
              <option value="10">${escapeHtml(t("perPage", "10"))}</option>
              <option value="20">${escapeHtml(t("perPage", "20"))}</option>
            </select>
          </div>
          <div class="gmail-alias-history-list" style="display: flex; flex-direction: column; gap: 6px;"></div>
          <div class="gmail-alias-history-pagination">
            <button type="button" class="gmail-alias-history-prev" aria-label="${labels.previousPage}">‹</button>
            <span class="gmail-alias-history-page-info">1 / 1</span>
            <button type="button" class="gmail-alias-history-next" aria-label="${labels.nextPage}">›</button>
          </div>
        </div>
      </div>
    </div>
    <div class="gmail-alias-popup-footer">
      <a class="gmail-alias-popup-home" href="${homepageUrl}" target="_blank" rel="noopener noreferrer" aria-label="${labels.extensionName}" title="${labels.extensionName}">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="m3 10 9-7 9 7" />
          <path d="M5 9v11h14V9" />
        </svg>
      </a>
      <span class="gmail-alias-popup-footer-divider" aria-hidden="true"></span>
      <a class="gmail-alias-popup-review" href="${reviewUrl}" target="_blank" rel="noopener noreferrer">${labels.reportReview}</a>
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

  const disableSiteBtn = popup.querySelector(
    ".gmail-alias-popup-disable-site",
  ) as HTMLButtonElement | null;
  disableSiteBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    disableSiteBtn.disabled = true;
    const originalTitle = disableSiteBtn.getAttribute("data-tooltip");
    disableInlineForCurrentSite()
      .then(() => {
        popup.remove();
      })
      .catch(() => {
        disableSiteBtn.disabled = false;
        disableSiteBtn.setAttribute(
          "data-tooltip",
          "Failed to disable. Please try again.",
        );
        disableSiteBtn.style.opacity = "0.5";
      });
  });

  // Handle tab switching
  popup.querySelectorAll(".gmail-alias-popup-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabName = (tab as HTMLElement).dataset.tab;

      // Remove active from all tabs and contents
      popup.querySelectorAll(".gmail-alias-popup-tab").forEach((t) => {
        t.classList.remove("active");
      });
      popup.querySelectorAll(".gmail-alias-popup-tab-content").forEach((c) => {
        c.classList.remove("active");
      });

      // Add active to clicked tab and corresponding content
      tab.classList.add("active");
      popup
        .querySelector(`[data-tab-content="${tabName}"]`)
        ?.classList.add("active");

      if (tabName === "history") {
        loadHistory().catch(() => {
          // Silently fail
        });
      }
    });
  });

  // Switch between the compact Random, Tags, and Tricks generators.
  popup.querySelectorAll(".gmail-alias-generate-mode").forEach((button) => {
    button.addEventListener("click", () => {
      const mode = (button as HTMLElement).dataset.mode;
      popup
        .querySelectorAll(".gmail-alias-generate-mode")
        .forEach((item) => item.classList.remove("active"));
      popup
        .querySelectorAll(".gmail-alias-generate-panel")
        .forEach((panel) => panel.classList.remove("active"));
      button.classList.add("active");
      popup
        .querySelector(`[data-generate-panel="${mode}"]`)
        ?.classList.add("active");
    });
  });

  // Handle custom generate input
  const generateBtn = popup.querySelector(
    ".gmail-alias-generate-btn",
  ) as HTMLButtonElement;
  const generateInput = popup.querySelector(
    ".gmail-alias-generate-input",
  ) as HTMLInputElement;
  if (generateBtn && generateInput) {
    generateBtn.addEventListener("click", () => {
      const value = generateInput.value.trim();
      if (value) {
        onSelect(createCustomAlias(data.activeEmail, value));
        popup.remove();
      }
    });
    generateInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const value = generateInput.value.trim();
        if (value) {
          onSelect(createCustomAlias(data.activeEmail, value));
          popup.remove();
        }
      }
    });
  }

  // Load the same custom tag presets used by the main popup.
  browser.storage.local.get("app_settings").then((settingsStorage) => {
    const presetList = popup.querySelector(
      ".gmail-alias-preset-list",
    ) as HTMLElement | null;
    if (!presetList) return;

    const settings = settingsStorage.app_settings as
      | {
          customPresets?: Array<{ id?: string; label: string; tag: string }>;
          randomFormat?: RandomFormat;
        }
      | undefined;
    const formatSelect = popup.querySelector(
      ".gmail-alias-random-format",
    ) as HTMLSelectElement | null;
    if (formatSelect && settings?.randomFormat) {
      formatSelect.value = settings.randomFormat;
    }
    const presets = settings?.customPresets || [];
    presetList.innerHTML = presets.length
      ? `<div class="gmail-alias-quick-label">${escapeHtml(t("yourPresets"))}</div>${presets
          .map(
            (preset) =>
              `<button class="gmail-alias-preset-item" data-tag="${escapeHtml(preset.tag)}">${escapeHtml(preset.label)}</button>`,
          )
          .join("")}`
      : `<div class="gmail-alias-quick-empty">${escapeHtml(t("noTagsYet"))}</div>`;
    presetList
      .querySelectorAll(".gmail-alias-preset-item")
      .forEach((presetButton) => {
        presetButton.addEventListener("click", () => {
          const tag = (presetButton as HTMLElement).dataset.tag;
          if (tag) {
            onSelect(createCustomAlias(data.activeEmail, tag));
            popup.remove();
          }
        });
      });
  });

  // Generate a batch with the same formats as the main popup.
  const randomBtn = popup.querySelector(
    ".gmail-alias-random-btn",
  ) as HTMLButtonElement;
  const randomFormat = popup.querySelector(
    ".gmail-alias-random-format",
  ) as HTMLSelectElement;
  const randomCount = popup.querySelector(
    ".gmail-alias-random-count",
  ) as HTMLInputElement;
  const generatedList = popup.querySelector(
    ".gmail-alias-generated-list",
  ) as HTMLElement;
  if (randomBtn && data.activeEmail) {
    randomFormat?.addEventListener("change", async () => {
      const settingsStorage = await browser.storage.local.get("app_settings");
      await browser.storage.local.set({
        app_settings: {
          ...(settingsStorage.app_settings || {}),
          randomFormat: randomFormat.value,
        },
      });
    });
    randomBtn.addEventListener("click", () => {
      const format = (randomFormat?.value || "private-mail") as RandomFormat;
      const count = clampQuickCount(randomCount?.value);
      const aliases = Array.from({ length: count }, (_, index) =>
        generateAlias(
          data.activeEmail,
          generateRandomString(format, Date.now() + index),
        ),
      ).filter((alias): alias is string => Boolean(alias));
      if (generatedList) {
        renderQuickAliasList(generatedList, aliases, onSelect, input);
      }
    });
  }

  // Generate commonly used Gmail trick variations.
  const trickBtn = popup.querySelector(
    ".gmail-alias-trick-btn",
  ) as HTMLButtonElement;
  const trickType = popup.querySelector(
    ".gmail-alias-trick-type",
  ) as HTMLSelectElement;
  const trickCount = popup.querySelector(
    ".gmail-alias-trick-count",
  ) as HTMLInputElement;
  const trickList = popup.querySelector(
    ".gmail-alias-trick-list",
  ) as HTMLElement;
  trickBtn?.addEventListener("click", () => {
    const aliases = generateQuickTricks(
      data.activeEmail,
      trickType?.value || "dot",
      clampQuickCount(trickCount?.value),
    );
    if (trickList) {
      renderQuickAliasList(trickList, aliases, onSelect, input);
    }
  });

  let currentHistory: Array<{ email: string; timestamp: number }> = [];
  let currentFavorites: string[] = [];
  let historyPage = 1;
  const historySearch = popup.querySelector(
    ".gmail-alias-history-search",
  ) as HTMLInputElement | null;
  const historyView = popup.querySelector(
    ".gmail-alias-history-view",
  ) as HTMLSelectElement | null;
  const historyTag = popup.querySelector(
    ".gmail-alias-history-tag",
  ) as HTMLSelectElement | null;
  const historySort = popup.querySelector(
    ".gmail-alias-history-sort",
  ) as HTMLSelectElement | null;
  const historyPageSize = popup.querySelector(
    ".gmail-alias-history-page-size",
  ) as HTMLSelectElement | null;
  const historyPrev = popup.querySelector(
    ".gmail-alias-history-prev",
  ) as HTMLButtonElement | null;
  const historyNext = popup.querySelector(
    ".gmail-alias-history-next",
  ) as HTMLButtonElement | null;
  const historyPageInfo = popup.querySelector(
    ".gmail-alias-history-page-info",
  ) as HTMLElement | null;
  const historyPagination = popup.querySelector(
    ".gmail-alias-history-pagination",
  ) as HTMLElement | null;

  /** Filters, sorts, and paginates history using the popup's shared logic. */
  function renderHistory() {
    const historyList = popup.querySelector(
      ".gmail-alias-history-list",
    ) as HTMLElement | null;
    if (!historyList) return;

    const filtered = filterAliases(currentHistory, {
      viewMode: historyView?.value === "favorites" ? "favorites" : "all",
      favorites: currentFavorites,
      searchQuery: historySearch?.value || "",
      filterTag: historyTag?.value || "all",
      sortBy: historySort?.value === "alphabetical" ? "alphabetical" : "recent",
    });
    const page = paginateItems(
      filtered,
      historyPage,
      Number(historyPageSize?.value || 5),
    );
    historyPage = page.currentPage;

    if (historyPageInfo) {
      historyPageInfo.textContent = page.totalItems
        ? `${page.startIndex + 1}-${Math.min(page.endIndex, page.totalItems)} / ${page.totalItems}`
        : "0 / 0";
    }
    if (historyPrev) historyPrev.disabled = historyPage <= 1;
    if (historyNext) historyNext.disabled = historyPage >= page.totalPages;
    if (historyPagination) {
      historyPagination.hidden = page.totalPages <= 1;
    }

    if (page.items.length === 0) {
      const emptyMessage =
        currentHistory.length === 0
          ? t("noResultsFound")
          : historyView?.value === "favorites"
            ? t("noFavoritesYet")
            : t("noResultsFound");
      historyList.innerHTML = `<div class="gmail-alias-quick-empty">${emptyMessage}</div>`;
      return;
    }

    renderQuickAliasList(
      historyList,
      page.items.map((item) => item.email),
      onSelect,
      input,
      false,
    );
  }

  [
    historySearch,
    historyView,
    historyTag,
    historySort,
    historyPageSize,
  ].forEach((control) => {
    control?.addEventListener(
      control === historySearch ? "input" : "change",
      () => {
        historyPage = 1;
        renderHistory();
      },
    );
  });
  historyPrev?.addEventListener("click", () => {
    historyPage -= 1;
    renderHistory();
  });
  historyNext?.addEventListener("click", () => {
    historyPage += 1;
    renderHistory();
  });

  /** Loads the latest account history whenever the popup or History tab opens. */
  async function loadHistory() {
    const historyList = popup.querySelector(
      ".gmail-alias-history-list",
    ) as HTMLElement;
    if (!historyList) return;

    try {
      // Use the same account that was used to generate this popup's aliases.
      const historyKey = getAccountStorageKey(
        data.activeEmail,
        "gmail_alias_recent",
      );
      const favoritesKey = getAccountStorageKey(data.activeEmail, "favorites");

      const storage = (await browser.storage.local.get([
        historyKey,
        favoritesKey,
        "gmail_alias_recent",
        "favorites",
      ])) as Record<string, unknown>;
      // Older installations may still have history under the global key.
      const history = (storage[historyKey] ??
        storage.gmail_alias_recent ??
        []) as Array<{
        email: string;
        timestamp: number;
      }>;
      currentHistory = history
        .filter((item) => item && typeof item.email === "string")
        .slice()
        .sort((a, b) => b.timestamp - a.timestamp);
      const favorites = (storage[favoritesKey] ?? storage.favorites ?? []) as
        | Array<{ email?: string } | string>
        | undefined;
      currentFavorites = Array.isArray(favorites)
        ? favorites
            .map((favorite) =>
              typeof favorite === "string" ? favorite : favorite.email,
            )
            .filter((email): email is string => Boolean(email))
        : [];

      if (historyTag) {
        const selectedTag = historyTag.value;
        historyTag.innerHTML = [
          `<option value="all">${escapeHtml(t("allTags"))}</option>`,
          ...getAliasTags(currentHistory).map(
            (tag) =>
              `<option value="${escapeHtml(tag)}">${escapeHtml(tag)}</option>`,
          ),
        ].join("");
        historyTag.value = getAliasTags(currentHistory).includes(selectedTag)
          ? selectedTag
          : "all";
      }
      renderHistory();
    } catch {
      historyList.innerHTML = `<div style="padding: 12px; color: #9ca3af; font-size: 12px; text-align: center;">${escapeHtml(t("noResultsFound"))}</div>`;
    }
  }

  loadHistory().catch(() => {
    // Silently fail
  });

  // Handle suggestion item hover for preview and click to select
  if (input) {
    const originalValue = input.value;
    let suggestionCommitted = false;

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
        if (suggestionCommitted) return;
        // Restore original input value
        fillInput(input, originalValue);
        input.classList.remove("gmail-alias-input-preview");
      });

      item.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (alias) {
          suggestionCommitted = true;
          onSelect(alias);
          popup.remove();
        }
      });
    });
  }

  // Handle base email button hover and click
  const baseEmailBtn = popup.querySelector(
    ".gmail-alias-base-email",
  ) as HTMLElement;
  if (baseEmailBtn && input) {
    const originalValue = input.value;
    let baseEmailCommitted = false;

    baseEmailBtn.addEventListener("mouseenter", () => {
      const alias = baseEmailBtn.dataset.alias;
      if (alias) {
        fillInput(input, alias);
        input.classList.add("gmail-alias-input-preview");
      }
    });

    baseEmailBtn.addEventListener("mouseleave", () => {
      if (baseEmailCommitted) return;
      fillInput(input, originalValue);
      input.classList.remove("gmail-alias-input-preview");
    });

    baseEmailBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const alias = baseEmailBtn.dataset.alias;
      if (alias) {
        baseEmailCommitted = true;
        onSelect(alias);
        popup.remove();
      }
    });
  }

  // Handle previous alias button hover and click
  const prevAliasBtn = popup.querySelector(
    ".gmail-alias-prev-alias",
  ) as HTMLElement;
  if (prevAliasBtn && input) {
    const originalValue = input.value;
    let previousAliasCommitted = false;

    prevAliasBtn.addEventListener("mouseenter", () => {
      const alias = prevAliasBtn.dataset.alias;
      if (alias) {
        fillInput(input, alias);
        input.classList.add("gmail-alias-input-preview");
      }
    });

    prevAliasBtn.addEventListener("mouseleave", () => {
      if (previousAliasCommitted) return;
      fillInput(input, originalValue);
      input.classList.remove("gmail-alias-input-preview");
    });

    prevAliasBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const alias = prevAliasBtn.dataset.alias;
      if (alias) {
        previousAliasCommitted = true;
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
  if (input.__gmailAliasIcon) {
    input.__gmailAliasPosition?.();
    return;
  }

  try {
    // Create icon container (no wrapping, just for the icon)
    const iconContainer = document.createElement("div");
    iconContainer.className = "gmail-alias-input-icon-container";
    iconContainer.innerHTML = ICON_HTML;

    const icon = iconContainer.querySelector(
      ".gmail-alias-input-icon",
    ) as SVGElement;
    if (!icon) {
      return;
    }

    // Render the fixed helper at the document root so form wrappers with
    // overflow/contain/stacking contexts cannot clip or remove it.
    document.body.appendChild(iconContainer);

    // Keep the helper outside the website's input and layout. Fixed positioning
    // avoids colliding with native suffix icons or adjacent submit buttons.
    iconContainer.style.position = "fixed";
    iconContainer.style.pointerEvents = "auto";
    iconContainer.style.display = "flex";
    iconContainer.style.alignItems = "center";
    iconContainer.style.justifyContent = "center";
    iconContainer.style.width = "32px";
    iconContainer.style.height = "32px";
    iconContainer.style.border = "1px solid #e5e7eb";
    iconContainer.style.borderRadius = "9999px";
    iconContainer.style.backgroundColor = "#ffffff";
    iconContainer.style.boxShadow =
      "0 3px 10px rgba(15, 23, 42, 0.18), 0 1px 2px rgba(15, 23, 42, 0.1)";
    iconContainer.style.zIndex = "999998";

    /** Detects compact controls or floating overlays occupying a candidate. */
    const isPlacementBlocked = (
      left: number,
      top: number,
      iconSize: number,
    ) => {
      const inset = 4;
      const points = [
        [left + iconSize / 2, top + iconSize / 2],
        [left + inset, top + inset],
        [left + iconSize - inset, top + inset],
        [left + inset, top + iconSize - inset],
        [left + iconSize - inset, top + iconSize - inset],
      ];

      return points.some(([x, y]) =>
        document.elementsFromPoint(x, y).some((element) => {
          if (
            element === input ||
            element === document.body ||
            element === document.documentElement ||
            iconContainer.contains(element)
          ) {
            return false;
          }

          const rect = element.getBoundingClientRect();
          const style = window.getComputedStyle(element);
          const isInteractiveControl = element.matches(
            "button, select, textarea, a[href], [role='button'], [role='combobox'], [contenteditable='true'], input",
          );
          const isCompactControl = rect.width <= 96 && rect.height <= 96;
          const isCompactOverlay =
            (style.position === "fixed" || style.position === "absolute") &&
            rect.width <= 180 &&
            rect.height <= 180;

          return (
            style.visibility !== "hidden" &&
            style.display !== "none" &&
            (isInteractiveControl || isCompactControl || isCompactOverlay)
          );
        }),
      );
    };

    const state = {
      inputResizeObserver: undefined as ResizeObserver | undefined,
      activePopup: null as HTMLElement | null,
      iconPlacementDirection: null as
        | "left"
        | "right"
        | "above"
        | "below"
        | null,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      positionIconOutsideInput: (() => {}) as () => void,
    };

    /** Cleans up positioning event listeners, observers, and removes the icon. */
    const cleanupPositioning = () => {
      window.removeEventListener("resize", state.positionIconOutsideInput);
      window.removeEventListener(
        "scroll",
        state.positionIconOutsideInput,
        true,
      );
      state.inputResizeObserver?.disconnect();
      iconContainer.remove();
      input.__gmailAliasIcon = undefined;
      input.__gmailAliasPosition = undefined;
      input.__gmailAliasCleanup = undefined;
    };

    /** Checks if the input field is within the viewport bounds. */
    const isInputInViewport = (rect: DOMRect) =>
      rect.width > 0 &&
      rect.height > 0 &&
      rect.bottom > 0 &&
      rect.right > 0 &&
      rect.top < window.innerHeight &&
      rect.left < window.innerWidth;

    /** Updates the icon's directional pointer class to match placement. */
    const setIconPointerDirection = (
      direction: "left" | "right" | "above" | "below",
    ) => {
      iconContainer.classList.remove(
        "gmail-alias-icon-left",
        "gmail-alias-icon-right",
        "gmail-alias-icon-above",
        "gmail-alias-icon-below",
      );
      iconContainer.classList.add(`gmail-alias-icon-${direction}`);
    };

    /** Determines the best horizontal side (left/right) for the icon and popup. */
    const getPreferredHorizontalSide = (rect: DOMRect) => {
      const viewportPadding = 8;
      const inputGap = 6;
      const iconSize = 32;
      const requiredRoom = inputGap + iconSize + 8 + 240;
      const centeredTop = rect.top + (rect.height - iconSize) / 2;
      const options = [
        {
          side: "right" as const,
          room: window.innerWidth - rect.right - viewportPadding,
          iconLeft: rect.right + inputGap,
        },
        {
          side: "left" as const,
          room: rect.left - viewportPadding,
          iconLeft: rect.left - inputGap - iconSize,
        },
      ]
        .filter(
          (option) =>
            option.room >= requiredRoom &&
            option.iconLeft >= viewportPadding &&
            option.iconLeft + iconSize <= window.innerWidth - viewportPadding &&
            !isPlacementBlocked(option.iconLeft, centeredTop, iconSize),
        )
        .sort((a, b) => b.room - a.room);

      return options[0]?.side ?? null;
    };

    /** Places the icon and its popup as one group without covering the input. */
    const positionPopupNextToInput = (popup: HTMLElement) => {
      const inputRect = input.getBoundingClientRect();
      if (!isInputInViewport(inputRect)) {
        iconContainer.style.display = "none";
        popup.remove();
        state.activePopup = null;
        return;
      }

      const viewportPadding = 8;
      const inputGap = 6;
      const popupGap = 8;
      const iconSize = 32;
      const maxPopupWidth = 320;
      const leftRoom = inputRect.left - viewportPadding;
      const rightRoom = window.innerWidth - inputRect.right - viewportPadding;
      const horizontalChrome = inputGap + iconSize + popupGap;
      const preferredHorizontalSide =
        state.iconPlacementDirection === "left" ||
        state.iconPlacementDirection === "right"
          ? state.iconPlacementDirection
          : null;
      const canUseLeft = preferredHorizontalSide === "left";
      const canUseRight = preferredHorizontalSide === "right";
      const centeredIconTop = Math.min(
        window.innerHeight - iconSize - viewportPadding,
        Math.max(
          viewportPadding,
          inputRect.top + (inputRect.height - iconSize) / 2,
        ),
      );

      let availableHeight = window.innerHeight - viewportPadding * 2;
      if (canUseRight || canUseLeft) {
        const placeRight = canUseRight;
        const room = placeRight ? rightRoom : leftRoom;
        const popupWidth = Math.min(maxPopupWidth, room - horizontalChrome);
        popup.style.width = `${popupWidth}px`;
        popup.style.minWidth = `${popupWidth}px`;
        popup.style.maxWidth = `${popupWidth}px`;

        // Measure again after adapting the popup width.
        const popupRect = popup.getBoundingClientRect();
        const visiblePopupHeight = Math.min(
          popupRect.height,
          window.innerHeight - viewportPadding * 2,
        );
        const popupTop = Math.min(
          window.innerHeight - visiblePopupHeight - viewportPadding,
          Math.max(
            viewportPadding,
            centeredIconTop + iconSize / 2 - visiblePopupHeight / 2,
          ),
        );

        if (placeRight) {
          const iconLeft = inputRect.right + inputGap;
          iconContainer.style.left = `${iconLeft}px`;
          popup.style.left = `${iconLeft + iconSize + popupGap}px`;
          setIconPointerDirection("right");
        } else {
          const iconLeft = inputRect.left - inputGap - iconSize;
          iconContainer.style.left = `${iconLeft}px`;
          popup.style.left = `${iconLeft - popupGap - popupWidth}px`;
          setIconPointerDirection("left");
        }
        iconContainer.style.top = `${centeredIconTop}px`;
        popup.style.top = `${popupTop}px`;
      } else {
        const roomBelow = window.innerHeight - inputRect.bottom - inputGap;
        const roomAbove = inputRect.top - inputGap;
        const placeBelow =
          state.iconPlacementDirection === "below" ||
          (state.iconPlacementDirection !== "above" && roomBelow >= roomAbove);
        const popupWidth = Math.min(
          maxPopupWidth,
          window.innerWidth - viewportPadding * 2,
        );
        const currentIconLeft = Number.parseFloat(iconContainer.style.left);
        const centeredIconLeft =
          inputRect.left + inputRect.width / 2 - iconSize / 2;
        const iconLeft = Math.min(
          window.innerWidth - iconSize - viewportPadding,
          Math.max(
            viewportPadding,
            Number.isFinite(currentIconLeft)
              ? currentIconLeft
              : centeredIconLeft,
          ),
        );
        // For vertical layouts, the popup follows the icon rather than the
        // input center so collision-adjusted icons never look detached.
        const left = Math.min(
          window.innerWidth - popupWidth - viewportPadding,
          Math.max(viewportPadding, iconLeft + iconSize / 2 - popupWidth / 2),
        );
        popup.style.width = `${popupWidth}px`;
        popup.style.minWidth = `${popupWidth}px`;
        popup.style.maxWidth = `${popupWidth}px`;
        popup.style.left = `${left}px`;
        iconContainer.style.left = `${iconLeft}px`;

        if (placeBelow) {
          const iconTop = inputRect.bottom + inputGap;
          iconContainer.style.top = `${iconTop}px`;
          popup.style.top = `${iconTop + iconSize + popupGap}px`;
          availableHeight = Math.max(
            120,
            window.innerHeight -
              (iconTop + iconSize + popupGap) -
              viewportPadding,
          );
          setIconPointerDirection("below");
        } else {
          const iconTop = inputRect.top - inputGap - iconSize;
          const popupRect = popup.getBoundingClientRect();
          availableHeight = Math.max(120, iconTop - popupGap - viewportPadding);
          iconContainer.style.top = `${iconTop}px`;
          popup.style.top = `${Math.max(
            viewportPadding,
            iconTop - popupGap - Math.min(popupRect.height, availableHeight),
          )}px`;
          setIconPointerDirection("above");
        }
      }

      iconContainer.style.display = "flex";
      popup.style.position = "fixed";
      popup.style.maxHeight = `${availableHeight}px`;
      popup.style.overflowY = "hidden";
      popup.style.zIndex = "999999";
    };

    // Assign the positioning function (declared earlier to fix forward reference)
    state.positionIconOutsideInput = () => {
      if (!input.isConnected) {
        cleanupPositioning();
        return;
      }

      const rect = input.getBoundingClientRect();
      if (!isInputInViewport(rect)) {
        iconContainer.style.display = "none";
        if (state.activePopup?.isConnected) state.activePopup.remove();
        state.activePopup = null;
        return;
      }

      iconContainer.style.display = "flex";
      const iconSize = 32;
      const gap = 6;
      /** Clamps the left position to keep the icon within viewport bounds. */
      const clampLeft = (left: number) =>
        Math.min(window.innerWidth - iconSize - 4, Math.max(4, left));
      const centeredTop = rect.top + (rect.height - iconSize) / 2;
      const right = rect.right + gap;
      const left = rect.left - iconSize - gap;
      const rightAligned = clampLeft(rect.right - iconSize);
      const centeredIconLeft = clampLeft(
        rect.left + rect.width / 2 - iconSize / 2,
      );
      const above = rect.top - iconSize - gap;
      const below = rect.bottom + gap;
      const preferredHorizontalSide = getPreferredHorizontalSide(rect);
      const roomBelow = window.innerHeight - rect.bottom - gap;
      const roomAbove = rect.top - gap;
      const verticalCandidate =
        roomBelow >= roomAbove
          ? { left: centeredIconLeft, top: below, direction: "below" as const }
          : { left: centeredIconLeft, top: above, direction: "above" as const };
      const candidates = [
        ...(preferredHorizontalSide === "right"
          ? [{ left: right, top: centeredTop, direction: "right" as const }]
          : []),
        ...(preferredHorizontalSide === "left"
          ? [{ left, top: centeredTop, direction: "left" as const }]
          : []),
        ...(!preferredHorizontalSide ? [verticalCandidate] : []),
        { left: rightAligned, top: above, direction: "above" as const },
        { left: rightAligned, top: below, direction: "below" as const },
      ].filter(
        (candidate) =>
          candidate.left >= 4 &&
          candidate.left + iconSize <= window.innerWidth - 4 &&
          candidate.top >= 4 &&
          candidate.top + iconSize <= window.innerHeight - 4,
      );
      const placement =
        candidates.find(
          (candidate) =>
            !isPlacementBlocked(candidate.left, candidate.top, iconSize),
        ) || candidates[0];
      if (!placement) return;

      iconContainer.style.left = `${placement.left}px`;
      iconContainer.style.top = `${placement.top}px`;
      state.iconPlacementDirection = placement.direction;
      setIconPointerDirection(placement.direction);
      if (state.activePopup?.isConnected) {
        positionPopupNextToInput(state.activePopup);
      }
    };
    input.__gmailAliasPosition = state.positionIconOutsideInput;
    input.__gmailAliasCleanup = cleanupPositioning;
    state.positionIconOutsideInput();
    window.addEventListener("resize", state.positionIconOutsideInput);
    window.addEventListener("scroll", state.positionIconOutsideInput, true);
    state.inputResizeObserver = new ResizeObserver(
      state.positionIconOutsideInput,
    );
    state.inputResizeObserver.observe(input);

    icon.style.cursor = "pointer";
    icon.style.color = "#3b82f6";
    icon.style.opacity = "1";
    icon.style.pointerEvents = "auto";
    icon.style.width = "18px";
    icon.style.height = "18px";

    let closeTimer: NodeJS.Timeout;

    iconContainer.addEventListener("mouseenter", async () => {
      clearTimeout(closeTimer);
      icon.style.opacity = "1";
      input.classList.add("gmail-alias-input-highlight");

      // Show popup on hover
      document
        .querySelectorAll(".gmail-alias-popup")
        .forEach((p) => p.remove());

      const data = await fetchSuggestions();
      if (!data) {
        return;
      }

      const popup = createPopup(
        data,
        async (alias, recordUsage = true) => {
          fillInput(input, alias);
          input.classList.remove("gmail-alias-input-preview");

          try {
            const tasks: Promise<unknown>[] = [];
            if (recordUsage) {
              tasks.push(
                browser.runtime.sendMessage({
                  action: "saveAliasToHistory",
                  alias,
                  accountEmail: data.activeEmail,
                }),
              );
            }

            if (data.website) {
              tasks.push(
                saveWebsiteAlias(data.activeEmail, data.website, alias),
              );
            }

            await Promise.all(tasks);
          } catch {
            // Silently fail
          }
        },
        input,
      );

      document.body.appendChild(popup);
      state.activePopup = popup;
      positionPopupNextToInput(popup);

      // Keep popup open when hovering over it
      popup.addEventListener("mouseenter", () => {
        clearTimeout(closeTimer);
      });
      popup.addEventListener("focusin", () => {
        clearTimeout(closeTimer);
      });
      popup.addEventListener("pointerdown", () => {
        clearTimeout(closeTimer);
      });

      popup.addEventListener("mouseleave", () => {
        closeTimer = setTimeout(() => {
          // Native select menus are rendered outside the popup bounds. Their
          // control remains focused, so this is still an active popup session.
          if (popup.matches(":focus-within")) return;
          popup.remove();
        }, 100);
      });
    });

    iconContainer.addEventListener("mouseleave", () => {
      icon.style.opacity = "1";
      input.classList.remove("gmail-alias-input-highlight");
      // Delay close to allow mouse movement to popup (with overlap, 250ms buffer)
      closeTimer = setTimeout(() => {
        document
          .querySelectorAll(".gmail-alias-popup")
          .forEach((popupElement) => {
            if (!popupElement.matches(":focus-within")) {
              popupElement.remove();
            }
          });
      }, 250);
    });

    input.__gmailAliasIcon = icon as unknown as HTMLElement;
  } catch {
    // Silently fail
  }
}

/** Restricts quick generator batch sizes to keep the inline popup responsive. */
function clampQuickCount(value?: string): number {
  return Math.min(20, Math.max(1, Number.parseInt(value || "5", 10) || 5));
}

/** Renders aliases as quick-fill buttons. */
function renderQuickAliasList(
  container: HTMLElement,
  aliases: string[],
  onSelect: (alias: string, recordUsage?: boolean) => void,
  input?: EmailInputElement,
  recordUsage = true,
) {
  container.innerHTML = aliases.length
    ? aliases
        .map(
          (alias) =>
            `<button class="gmail-alias-quick-alias" data-alias="${escapeHtml(alias)}">${escapeHtml(alias)}</button>`,
        )
        .join("")
    : `<div class="gmail-alias-quick-empty">${escapeHtml(t("noResultsFound"))}</div>`;

  const originalValue = input?.value || "";
  let committed = false;

  container.querySelectorAll(".gmail-alias-quick-alias").forEach((button) => {
    button.addEventListener("mouseenter", () => {
      const alias = (button as HTMLElement).dataset.alias;
      if (!alias || !input) return;
      fillInput(input, alias);
      input.classList.add("gmail-alias-input-preview");
    });

    button.addEventListener("mouseleave", () => {
      if (!input || committed) return;
      fillInput(input, originalValue);
      input.classList.remove("gmail-alias-input-preview");
    });

    button.addEventListener("click", () => {
      const alias = (button as HTMLElement).dataset.alias;
      if (!alias) return;
      committed = true;
      onSelect(alias, recordUsage);
      button.closest(".gmail-alias-popup")?.remove();
    });
  });
}

/** Generates the most useful Gmail tricks for the compact helper. */
function generateQuickTricks(
  baseEmail: string,
  trick: string,
  count: number,
): string[] {
  const [username, domain] = baseEmail.split("@");
  if (!username || !domain) return [];

  const commonTags = [
    "newsletter",
    "shop",
    "work",
    "personal",
    "test",
    "promo",
    "social",
    "finance",
    "travel",
    "spam",
  ];
  if (trick === "plus") {
    return commonTags
      .slice(0, count)
      .map((tag) => `${username}+${tag}@${domain}`);
  }
  if (trick === "nodots") {
    const noDots = username.replace(/\./g, "");
    return [
      `${noDots}@${domain}`,
      ...commonTags.map((tag) => `${noDots}+${tag}@${domain}`),
    ].slice(0, count);
  }

  const outputDomain =
    trick === "googlemail"
      ? domain.toLowerCase() === "gmail.com"
        ? "googlemail.com"
        : "gmail.com"
      : domain;
  return getDotVariationCandidates(username, count).map(
    (variation) => `${variation}@${outputDomain}`,
  );
}

/** Converts a custom tag into an alias, while preserving a complete email. */
function createCustomAlias(baseEmail: string, value: string): string {
  if (value.includes("@")) return value;

  const atIndex = baseEmail.lastIndexOf("@");
  if (atIndex <= 0) return value;

  return `${baseEmail.slice(0, atIndex)}+${value}${baseEmail.slice(atIndex)}`;
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

  ["input", "change"].forEach((eventType) => {
    input.dispatchEvent(
      new Event(eventType, { bubbles: true, composed: true }),
    );
  });

  input.focus();
}

/** Detect email inputs on page. */
function detectEmailInputs() {
  if (inlineDisabledForCurrentSite) {
    removeInlineHelpers();
    return;
  }

  const emailInputs = document.querySelectorAll<EmailInputElement>(
    'input[type="email"], input[name*="email" i], input[placeholder*="email" i], input[id*="email" i], input[aria-label*="email" i]',
  );

  emailInputs.forEach((input) => {
    const isVisible = input.offsetParent !== null;
    const isWideEnough = input.offsetWidth > 50;

    if (isVisible && isWideEnough) {
      injectIcon(input);
    }
  });
}

/** Watch for dynamically added inputs. */
function observeDOM() {
  let debounceTimer: NodeJS.Timeout;
  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(detectEmailInputs, 100);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["type", "name", "placeholder", "id", "aria-label"],
  });

  return observer;
}

export default defineContentScript({
  matches: ["<all_urls>"],
  async main() {
    const disabledSitesResult = await browser.storage.local.get(
      INLINE_DISABLED_SITES_KEY,
    );
    inlineDisabledForCurrentSite = parseDisabledInlineSites(
      disabledSitesResult[INLINE_DISABLED_SITES_KEY],
    ).includes(currentSiteHostname());

    // Setup observer immediately
    const observer = observeDOM();

    // Initial detect
    detectEmailInputs();

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

    browser.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== "local" || !changes[INLINE_DISABLED_SITES_KEY]) return;
      inlineDisabledForCurrentSite = parseDisabledInlineSites(
        changes[INLINE_DISABLED_SITES_KEY].newValue,
      ).includes(currentSiteHostname());
      if (inlineDisabledForCurrentSite) removeInlineHelpers();
      else detectEmailInputs();
    });

    // Cleanup on unload
    window.addEventListener("beforeunload", () => {
      observer.disconnect();
    });
  },
});
