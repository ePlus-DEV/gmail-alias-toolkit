import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const OUTPUT_ROOT = ".output";
const ALL_URLS = "<all_urls>";

/** Returns WXT production output directories for one browser. */
function findBrowserOutputs(browser) {
  return readdirSync(OUTPUT_ROOT, { withFileTypes: true })
    .filter(
      (entry) => entry.isDirectory() && entry.name.startsWith(`${browser}-mv`),
    )
    .map((entry) => entry.name);
}

/** Reads and parses a generated extension manifest. */
function readManifest(manifestPath) {
  return JSON.parse(readFileSync(manifestPath, "utf8"));
}

/** Returns validation failures for one generated production manifest. */
function validateManifest(manifestPath) {
  if (!existsSync(manifestPath)) {
    return [`Missing manifest: ${manifestPath}`];
  }

  const manifest = readManifest(manifestPath);
  const contentScriptMatches = (manifest.content_scripts ?? []).flatMap(
    (contentScript) => contentScript.matches ?? [],
  );
  const grantedHosts = new Set([
    ...(manifest.host_permissions ?? []),
    ...(manifest.permissions ?? []),
  ]);
  const failures = [];

  if (!contentScriptMatches.includes(ALL_URLS)) {
    failures.push(
      `${manifestPath}: content script does not match ${ALL_URLS}. Found: ${contentScriptMatches.join(", ") || "none"}`,
    );
  }

  if (!grantedHosts.has(ALL_URLS)) {
    failures.push(
      `${manifestPath}: production host permissions do not include ${ALL_URLS}.`,
    );
  }

  return failures;
}

/** Returns validation failures for all production outputs of one browser. */
function validateBrowser(browser) {
  const outputDirectories = findBrowserOutputs(browser);
  if (outputDirectories.length === 0) {
    return [`No production output directory found for ${browser}.`];
  }

  return outputDirectories.flatMap((outputDirectory) => {
    const manifestPath = join(OUTPUT_ROOT, outputDirectory, "manifest.json");
    const failures = validateManifest(manifestPath);

    if (failures.length === 0) {
      console.log(`Verified production inline helper scope: ${manifestPath}`);
    }

    return failures;
  });
}

/** Runs the production manifest verification command. */
function main() {
  if (!existsSync(OUTPUT_ROOT)) {
    console.error(`ERROR: Missing WXT output directory: ${OUTPUT_ROOT}`);
    process.exitCode = 1;
    return;
  }

  const requestedBrowsers = process.argv.slice(2);
  const browsers = requestedBrowsers.length > 0 ? requestedBrowsers : ["chrome"];
  const failures = browsers.flatMap(validateBrowser);

  if (failures.length === 0) return;

  failures.forEach((failure) => console.error(`ERROR: ${failure}`));
  process.exitCode = 1;
}

main();
