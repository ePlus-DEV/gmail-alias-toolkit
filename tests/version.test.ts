import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { APP_VERSION } from "../src/version";

const readSource = (relativePath: string) =>
  readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

describe("application version", () => {
  it("uses the root package version as the single source of truth", () => {
    const packageMetadata = JSON.parse(readSource("package.json")) as {
      version: string;
    };

    expect(APP_VERSION).toBe(packageMetadata.version);
  });

  it("does not hardcode the current version in the landing page", () => {
    const source = readSource("web/src/App.tsx");

    expect(source).toContain("APP_VERSION");
    expect(source).not.toMatch(/\bv\d+\.\d+\.\d+\b/);
  });

  it("does not use a hardcoded settings fallback version", () => {
    const source = readSource("entrypoints/popup/components/Settings.tsx");

    expect(source).toContain("APP_VERSION");
    expect(source).not.toMatch(/useState\("\d+\.\d+\.\d+"\)/);
  });
});
