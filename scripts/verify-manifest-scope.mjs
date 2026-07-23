import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const OUTPUT_ROOT = ".output";
const ALL_URLS = "<all_urls>";
const DEV_SITES = ["*://*.miro.com/*", "*://selfh.st/*", "*://gumroad.com/*"];
const DEVELOPMENT_MODE = "development";
const PRODUCTION_MODE = "production";
const SUPPORTED_MODES = new Set([DEVELOPMENT_MODE, PRODUCTION_MODE]);

/** Writes one informational line to standard output. */
function writeInfo(message) {
  process.stdout.write(`${message}\n`);
}

/** Writes one error line to standard error. */
function writeError(message) {
  process.stderr.write(`ERROR: ${message}\n`);
}

/** Returns WXT output directories for one browser. */
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

/** Returns failures for the expected production URL scope. */
function validateProductionScope(
  manifestPath,
  contentScriptMatches,
  grantedHosts,
) {
  const failures = [];

  if (!contentScriptMatches.includes(ALL_URLS)) {
    failures.push(
      `${manifestPath}: production content script does not match ${ALL_URLS}. Found: ${contentScriptMatches.join(", ") || "none"}`,
    );
  }

  if (!grantedHosts.has(ALL_URLS)) {
    failures.push(
      `${manifestPath}: production host permissions do not include ${ALL_URLS}.`,
    );
  }

  return failures;
}

/** Returns failures for the expected development URL scope. */
function validateDevelopmentScope(
  manifestPath,
  contentScriptMatches,
  grantedHosts,
) {
  const failures = [];

  if (contentScriptMatches.includes(ALL_URLS)) {
    failures.push(
      `${manifestPath}: development content script unexpectedly matches ${ALL_URLS}.`,
    );
  }

  if (grantedHosts.has(ALL_URLS)) {
    failures.push(
      `${manifestPath}: development host permissions unexpectedly include ${ALL_URLS}.`,
    );
  }

  for (const site of DEV_SITES) {
    if (!contentScriptMatches.includes(site)) {
      failures.push(
        `${manifestPath}: development content script is missing ${site}.`,
      );
    }
    if (!grantedHosts.has(site)) {
      failures.push(
        `${manifestPath}: development host permissions are missing ${site}.`,
      );
    }
  }

  return failures;
}

/** Returns validation failures for one generated manifest. */
function validateManifest(manifestPath, mode) {
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

  return mode === DEVELOPMENT_MODE
    ? validateDevelopmentScope(manifestPath, contentScriptMatches, grantedHosts)
    : validateProductionScope(manifestPath, contentScriptMatches, grantedHosts);
}

/** Returns validation failures for all outputs of one browser. */
function validateBrowser(browser, mode) {
  const outputDirectories = findBrowserOutputs(browser);
  if (outputDirectories.length === 0) {
    return [`No ${mode} output directory found for ${browser}.`];
  }

  return outputDirectories.flatMap((outputDirectory) => {
    const manifestPath = join(OUTPUT_ROOT, outputDirectory, "manifest.json");
    const failures = validateManifest(manifestPath, mode);

    if (failures.length === 0) {
      writeInfo(`Verified ${mode} inline helper scope: ${manifestPath}`);
    }

    return failures;
  });
}

/** Parses the expected mode and browser arguments. */
function parseArguments() {
  const [mode = PRODUCTION_MODE, ...requestedBrowsers] = process.argv.slice(2);
  if (!SUPPORTED_MODES.has(mode)) {
    throw new Error(
      `Unsupported mode "${mode}". Use ${DEVELOPMENT_MODE} or ${PRODUCTION_MODE}.`,
    );
  }

  return {
    mode,
    browsers: requestedBrowsers.length > 0 ? requestedBrowsers : ["chrome"],
  };
}

/** Runs the generated manifest scope verification. */
function main() {
  if (!existsSync(OUTPUT_ROOT)) {
    writeError(`Missing WXT output directory: ${OUTPUT_ROOT}`);
    process.exitCode = 1;
    return;
  }

  let options;
  try {
    options = parseArguments();
  } catch (error) {
    writeError(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
    return;
  }

  const failures = options.browsers.flatMap((browser) =>
    validateBrowser(browser, options.mode),
  );

  if (failures.length === 0) return;

  failures.forEach(writeError);
  process.exitCode = 1;
}

main();
