import { afterEach, describe, expect, it, vi } from "vitest";
import { getUserGuideLabel } from "../../src/i18n/userGuide";

describe("user guide labels", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("resolves supported base and regional locales", () => {
    expect(getUserGuideLabel("vi-VN")).toBe("Hướng dẫn sử dụng");
    expect(getUserGuideLabel("pt-BR")).toBe("Guia do usuário");
    expect(getUserGuideLabel("zh-CN")).toBe("用户指南");
    expect(getUserGuideLabel("ja-JP")).toBe("ユーザーガイド");
  });

  it("uses the browser UI locale when no locale is provided", () => {
    const getUILanguage = vi.fn().mockReturnValue("vi-VN");
    vi.stubGlobal("browser", { i18n: { getUILanguage } });

    expect(getUserGuideLabel()).toBe("Hướng dẫn sử dụng");
    expect(getUILanguage).toHaveBeenCalledOnce();
  });

  it("falls back to English when the browser locale API is unavailable", () => {
    vi.stubGlobal("browser", undefined);
    expect(getUserGuideLabel()).toBe("User guide");
  });

  it("falls back to English when browser locale detection throws", () => {
    vi.stubGlobal("browser", {
      i18n: {
        getUILanguage: vi.fn(() => {
          throw new Error("i18n unavailable");
        }),
      },
    });

    expect(getUserGuideLabel()).toBe("User guide");
  });

  it("falls back to English for unsupported locales", () => {
    expect(getUserGuideLabel("unknown")).toBe("User guide");
  });
});
