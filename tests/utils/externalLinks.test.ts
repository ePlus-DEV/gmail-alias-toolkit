import { afterEach, describe, expect, it, vi } from "vitest";
import {
  openUserGuide,
  USER_GUIDE_URL,
} from "../../src/utils/externalLinks";

describe("external links", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("opens the tracked user guide URL in a browser tab", async () => {
    const create = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("browser", { tabs: { create } });

    await openUserGuide();

    expect(create).toHaveBeenCalledWith({ url: USER_GUIDE_URL });
    expect(USER_GUIDE_URL).toContain(
      "https://ext.eplus.dev/gmail-alias-toolkit/introduction",
    );
    expect(USER_GUIDE_URL).toContain("utm_medium=extension");
  });
});
