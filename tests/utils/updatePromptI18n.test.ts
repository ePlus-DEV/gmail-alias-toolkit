import { describe, expect, it } from "vitest";
import {
  formatUpdatePromptCopy,
  getUpdatePromptCopy,
} from "../../src/i18n/updatePrompt";

describe("update prompt localization", () => {
  it("resolves supported regional locales and falls back to English", () => {
    expect(getUpdatePromptCopy("vi-VN").title).toBe("Có bản cập nhật");
    expect(getUpdatePromptCopy("pt-BR").title).toBe("Atualização disponível");
    expect(getUpdatePromptCopy("zh-CN").title).toBe("有可用更新");
    expect(getUpdatePromptCopy("unknown").title).toBe("Update available");
  });

  it("formats installed and Store versions", () => {
    expect(
      formatUpdatePromptCopy("v{current} -> v{latest}", {
        current: "1.3.1",
        latest: "1.3.2",
      }),
    ).toBe("v1.3.1 -> v1.3.2");
  });
});
