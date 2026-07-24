import { describe, expect, it } from "vitest";
import { getUserGuideLabel } from "../../src/i18n/userGuide";

describe("user guide labels", () => {
  it("resolves supported base and regional locales", () => {
    expect(getUserGuideLabel("vi-VN")).toBe("Hướng dẫn sử dụng");
    expect(getUserGuideLabel("pt-BR")).toBe("Guia do usuário");
    expect(getUserGuideLabel("zh-CN")).toBe("用户指南");
    expect(getUserGuideLabel("ja-JP")).toBe("ユーザーガイド");
  });

  it("falls back to English for unsupported locales", () => {
    expect(getUserGuideLabel("unknown")).toBe("User guide");
  });
});
