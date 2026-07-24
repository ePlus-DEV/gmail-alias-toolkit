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

    await expect(openUserGuide()).resolves.toBe(true);

    expect(create).toHaveBeenCalledWith({ url: USER_GUIDE_URL });
    expect(USER_GUIDE_URL).toContain(
      "https://ext.eplus.dev/gmail-alias-toolkit/introduction",
    );
    expect(USER_GUIDE_URL).toContain("utm_medium=extension");
  });

  it("falls back to a regular window when the tabs API rejects", async () => {
    const create = vi.fn().mockRejectedValue(new Error("tabs unavailable"));
    const openedWindow = { opener: {} };
    const open = vi.fn().mockReturnValue(openedWindow);
    vi.stubGlobal("browser", { tabs: { create } });
    vi.stubGlobal("open", open);

    await expect(openUserGuide()).resolves.toBe(true);

    expect(open).toHaveBeenCalledWith(
      USER_GUIDE_URL,
      "_blank",
      "noopener,noreferrer",
    );
    expect(openedWindow.opener).toBeNull();
  });

  it("returns false when neither navigation method is available", async () => {
    const create = vi.fn().mockRejectedValue(new Error("tabs unavailable"));
    vi.stubGlobal("browser", { tabs: { create } });
    vi.stubGlobal("open", vi.fn().mockReturnValue(null));

    await expect(openUserGuide()).resolves.toBe(false);
  });
});
