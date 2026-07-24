import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const OUTPUT_ROOT = ".output";
export const ALL_URLS = "<all_urls>";
export const INLINE_CONTENT_SCRIPT = "content-scripts/content.js";
export const DEV_SITES = [
  "*://*.miro.com/*",
  "*://selfh.st/*",
  "*://gumroad.com/*",
];
const DEVELOPMENT_MODE = "development";
const PRODUCTION_MODE = "production";
const DEVELOPMENT_OUTPUT_SUFFIX = "-dev";
const DEVELOPMENT_RUNTIME_HOSTS = new Set(["http://localhost/*"]);
const SUPPORTED_MODES = new Set([DEVELOPMENT_MODE, PRODUCTION_MODE]);

/** Writes one informational line to standard output. */
function writeInfo(message) {
  process.stdout.write(`${message}\n`);
}

/** Writes one error line to standard error. */
function writeError(message) {
  process.stderr.write(`ERROR: ${message}\n`);
}

/** Returns whether a generated output directory belongs to the expected mode. */
function matchesMode(outputDirectory, mode) {
  const isDevelopmentOutput = outputDirectory.endsWith(
    DEVELOPMENT_OUTPUT_SUFFIX,
  );

  return mode === DEVELOPMENT_MODE ? isDevelopmentOutput : !isDevelopmentOutput;
}

/** Returns WXT output directories for one browser and mode. */
function findBrowserOutputs(browser, mode) {
  return readdirSync(OUTPUT_ROOT, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        entry.name.startsWith(`${browser}-mv`) &&
        matchesMode(entry.name, mode),
    )
    .map((entry) => entry.name);
}

/** Reads and parses a generated extension manifest. */
function readManifest(manifestPath) {
  return JSON.parse(readFileSync(manifestPath, "utf8"));
}

/** Returns whether a permission value is a URL pattern. */
function isUrlPattern(value) {
  return (
    value === ALL_URLS || value.includes("://") || value.startsWith("about:")
  );
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

  if (contentScriptMatches?.includes(ALL_URLS)) {
    failures.push(
      `${manifestPath}: development content script unexpectedly matches ${ALL_URLS}.`,
    );
  }

  if (grantedHosts.has(ALL_URLS)) {
    failures.push(
      `${manifestPath}: development host permissions unexpectedly include ${ALL_URLS}.`,
    );
  }

  const unexpectedMatches = (contentScriptMatches ?? []).filter(
    (match) => match !== ALL_URLS && !DEV_SITES.includes(match),
  );
  if (unexpectedMatches.length > 0) {
    failures.push(
      `${manifestPath}: development content script includes unexpected matches: ${unexpectedMatches.join(", ")}.`,
    );
  }

  const unexpectedHosts = [...grantedHosts].filter(
    (host) =>
      host !== ALL_URLS &&
      isUrlPattern(host) &&
      !DEVELOPMENT_RUNTIME_HOSTS.has(host) &&
      !DEV_SITES.includes(host),
  );
  if (unexpectedHosts.length > 0) {
    failures.push(
      `${manifestPath}: development host permissions include unexpected patterns: ${unexpectedHosts.join(", ")}.`,
    );
  }

  for (const site of DEV_SITES) {
    if (contentScriptMatches && !contentScriptMatches.includes(site)) {
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
export function validateManifest(manifestPath, mode) {
  if (!existsSync(manifestPath)) {
    return [`Missing manifest: ${manifestPath}`];
  }

  const manifest = readManifest(manifestPath);
  const inlineContentScript = (manifest.content_scripts ?? []).find(
    (contentScript) =>
      contentScript.js?.some((file) => file.endsWith(INLINE_CONTENT_SCRIPT)),
  );
  if (!inlineContentScript && mode === PRODUCTION_MODE) {
    return [`${manifestPath}: inline content script is missing.`];
  }

  const contentScriptMatches = inlineContentScript?.matches;
  const grantedHosts = new Set([
    ...(manifest.host_permissions ?? []),
    ...(manifest.permissions ?? []),
  ]);

  return mode === DEVELOPMENT_MODE
    ? validateDevelopmentScope(manifestPath, contentScriptMatches, grantedHosts)
    : validateProductionScope(manifestPath, contentScriptMatches, grantedHosts);
}

/** Returns validation failures for all outputs of one browser and mode. */
function validateBrowser(browser, mode) {
  const outputDirectories = findBrowserOutputs(browser, mode);
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

/** Parses arguments and reports invalid input without leaving partial state. */
function parseArgumentsSafely() {
  try {
    return parseArguments();
  } catch (error) {
    writeError(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
    return null;
  }
}

/** Runs the generated manifest scope verification. */
function main() {
  if (!existsSync(OUTPUT_ROOT)) {
    writeError(`Missing WXT output directory: ${OUTPUT_ROOT}`);
    process.exitCode = 1;
    return;
  }

  const options = parseArgumentsSafely();
  if (!options) return;

  const failures = options.browsers.flatMap((browser) =>
    validateBrowser(browser, options.mode),
  );

  if (failures.length === 0) return;

  failures.forEach(writeError);
  process.exitCode = 1;
}

/** Returns whether this module was launched as the Node.js entrypoint. */
function isDirectExecution() {
  const entrypoint = process.argv[1];
  return Boolean(
    entrypoint && import.meta.url === pathToFileURL(entrypoint).href,
  );
}

if (isDirectExecution()) main();
