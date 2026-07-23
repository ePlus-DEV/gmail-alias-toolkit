// @vitest-environment node

import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateManifest } from "../../scripts/verify-manifest-scope.mjs";

const ALL_URLS = "<all_urls>";
const DEV_SITES = ["*://*.miro.com/*", "*://selfh.st/*", "*://gumroad.com/*"];
const INLINE_CONTENT_SCRIPT = "content-scripts/content.js";
const temporaryDirectories = [];

/** Writes one manifest fixture and returns its path. */
function writeManifest(manifest) {
  const directory = mkdtempSync(join(tmpdir(), "manifest-scope-"));
  temporaryDirectories.push(directory);

  const manifestPath = join(directory, "manifest.json");
  writeFileSync(manifestPath, JSON.stringify(manifest), "utf8");
  return manifestPath;
}

/** Returns a generated inline-helper content-script entry. */
function inlineHelper(matches) {
  return {
    matches,
    js: [INLINE_CONTENT_SCRIPT],
  };
}

afterEach(() => {
  temporaryDirectories.splice(0).forEach((directory) => {
    rmSync(directory, { recursive: true, force: true });
  });
});

describe("manifest scope validator", () => {
  it("accepts the exact development allowlist", () => {
    const manifestPath = writeManifest({
      content_scripts: [inlineHelper(DEV_SITES)],
      host_permissions: DEV_SITES,
      permissions: ["storage", "clipboardWrite"],
    });

    expect(validateManifest(manifestPath, "development")).toEqual([]);
  });

  it("accepts Firefox-style development hosts stored in permissions", () => {
    const manifestPath = writeManifest({
      content_scripts: [inlineHelper(DEV_SITES)],
      permissions: ["storage", ...DEV_SITES],
    });

    expect(validateManifest(manifestPath, "development")).toEqual([]);
  });

  it("rejects broad development content-script matches", () => {
    const manifestPath = writeManifest({
      content_scripts: [inlineHelper([...DEV_SITES, "*://*/*"])],
      host_permissions: DEV_SITES,
    });

    expect(validateManifest(manifestPath, "development")).toContain(
      `${manifestPath}: development content script includes unexpected matches: *://*/*.`,
    );
  });

  it("rejects broad development host permissions", () => {
    const manifestPath = writeManifest({
      content_scripts: [inlineHelper(DEV_SITES)],
      host_permissions: [...DEV_SITES, "*://*/*"],
      permissions: ["storage"],
    });

    expect(validateManifest(manifestPath, "development")).toContain(
      `${manifestPath}: development host permissions include unexpected patterns: *://*/*.`,
    );
  });

  it("preserves literal all-URLs development failures", () => {
    const manifestPath = writeManifest({
      content_scripts: [inlineHelper([...DEV_SITES, ALL_URLS])],
      host_permissions: [...DEV_SITES, ALL_URLS],
    });

    const failures = validateManifest(manifestPath, "development");

    expect(failures).toContain(
      `${manifestPath}: development content script unexpectedly matches ${ALL_URLS}.`,
    );
    expect(failures).toContain(
      `${manifestPath}: development host permissions unexpectedly include ${ALL_URLS}.`,
    );
  });

  it("reports development allowlist entries that are missing", () => {
    const [firstSite, ...remainingSites] = DEV_SITES;
    const manifestPath = writeManifest({
      content_scripts: [inlineHelper(remainingSites)],
      host_permissions: remainingSites,
    });

    const failures = validateManifest(manifestPath, "development");

    expect(failures).toContain(
      `${manifestPath}: development content script is missing ${firstSite}.`,
    );
    expect(failures).toContain(
      `${manifestPath}: development host permissions are missing ${firstSite}.`,
    );
  });

  it("validates only the inline helper in production", () => {
    const manifestPath = writeManifest({
      content_scripts: [
        {
          matches: [ALL_URLS],
          js: ["content-scripts/unrelated.js"],
        },
        inlineHelper(DEV_SITES),
      ],
      host_permissions: [ALL_URLS],
    });

    expect(validateManifest(manifestPath, "production")).toContain(
      `${manifestPath}: production content script does not match ${ALL_URLS}. Found: ${DEV_SITES.join(", ")}`,
    );
  });

  it("reports a missing generated inline helper", () => {
    const manifestPath = writeManifest({
      content_scripts: [
        {
          matches: [ALL_URLS],
          js: ["content-scripts/unrelated.js"],
        },
      ],
      host_permissions: [ALL_URLS],
    });

    expect(validateManifest(manifestPath, "production")).toEqual([
      `${manifestPath}: inline content script is missing.`,
    ]);
  });

  it("requires production host permission coverage", () => {
    const manifestPath = writeManifest({
      content_scripts: [inlineHelper([ALL_URLS])],
      permissions: ["storage"],
    });

    expect(validateManifest(manifestPath, "production")).toContain(
      `${manifestPath}: production host permissions do not include ${ALL_URLS}.`,
    );
  });
});
