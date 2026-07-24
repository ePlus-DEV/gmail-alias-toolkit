import json
from pathlib import Path

TRANSLATIONS = {
    "en": "User guide",
    "de": "Benutzerhandbuch",
    "es": "Guía del usuario",
    "fr": "Guide d’utilisation",
    "hi": "उपयोगकर्ता मार्गदर्शिका",
    "it": "Guida utente",
    "ja": "ユーザーガイド",
    "ko": "사용자 가이드",
    "pl": "Podręcznik użytkownika",
    "pt_BR": "Guia do usuário",
    "ru": "Руководство пользователя",
    "tr": "Kullanım kılavuzu",
    "vi": "Hướng dẫn sử dụng",
    "zh_CN": "用户指南",
}


def update_locales() -> None:
    for locale, message in TRANSLATIONS.items():
        path = Path("public/_locales") / locale / "messages.json"
        data = json.loads(path.read_text(encoding="utf-8"))
        data["userGuide"] = {"message": message}
        path.write_text(
            json.dumps(data, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )


def update_consumers() -> None:
    popup_path = Path("src/components/alias/PopupHeader.tsx")
    popup = popup_path.read_text(encoding="utf-8")
    popup = popup.replace(
        'import { getUserGuideLabel } from "src/i18n/userGuide";\n',
        "",
    )
    popup = popup.replace(
        "  const userGuideLabel = getUserGuideLabel();",
        '  const userGuideLabel = t("userGuide");',
    )
    popup_path.write_text(popup, encoding="utf-8")

    content_path = Path("entrypoints/content/index.ts")
    content = content_path.read_text(encoding="utf-8")
    content = content.replace(
        'import { getUserGuideLabel } from "src/i18n/userGuide";\n',
        "",
    )
    content = content.replace(
        "    userGuide: escapeHtml(getUserGuideLabel()),",
        '    userGuide: escapeHtml(t("userGuide")),',
    )
    content_path.write_text(content, encoding="utf-8")


def replace_tests() -> None:
    Path("src/i18n/userGuide.ts").unlink()
    Path("tests/i18n/userGuide.test.ts").unlink()
    Path("tests/i18n/userGuideLocales.test.ts").write_text(
        '''import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("WXT user guide translations", () => {
  const localesRoot = resolve(process.cwd(), "public/_locales");
  const localeDirectories = readdirSync(localesRoot, {
    withFileTypes: true,
  }).filter((entry) => entry.isDirectory());

  it("defines a non-empty userGuide message for every locale", () => {
    expect(localeDirectories.length).toBeGreaterThan(0);

    for (const locale of localeDirectories) {
      const messagesPath = resolve(
        localesRoot,
        locale.name,
        "messages.json",
      );
      const messages = JSON.parse(readFileSync(messagesPath, "utf8")) as Record<
        string,
        { message?: unknown }
      >;

      expect(messages.userGuide, locale.name).toBeDefined();
      expect(messages.userGuide.message, locale.name).toEqual(
        expect.any(String),
      );
      expect(
        (messages.userGuide.message as string).trim(),
        locale.name,
      ).not.toBe("");
    }
  });
});
''',
        encoding="utf-8",
    )


def main() -> None:
    update_locales()
    update_consumers()
    replace_tests()


if __name__ == "__main__":
    main()
