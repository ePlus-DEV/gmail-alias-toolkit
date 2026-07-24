const USER_GUIDE_LABELS: Record<string, string> = {
  en: "User guide",
  de: "Benutzerhandbuch",
  es: "Guía del usuario",
  fr: "Guide d’utilisation",
  hi: "उपयोगकर्ता मार्गदर्शिका",
  it: "Guida utente",
  ja: "ユーザーガイド",
  ko: "사용자 가이드",
  pl: "Podręcznik użytkownika",
  pt_br: "Guia do usuário",
  ru: "Руководство пользователя",
  tr: "Kullanım kılavuzu",
  vi: "Hướng dẫn sử dụng",
  zh_cn: "用户指南",
};

/** Safely reads the browser UI locale outside and inside extension contexts. */
function resolveBrowserLocale(): string {
  try {
    return typeof browser !== "undefined"
      ? browser.i18n?.getUILanguage?.() || "en"
      : "en";
  } catch {
    return "en";
  }
}

/** Resolves the user-guide label for a browser UI locale. */
export function getUserGuideLabel(locale?: string): string {
  const browserLocale = locale ?? resolveBrowserLocale();
  const normalizedLocale = browserLocale.toLowerCase().replaceAll("-", "_");
  const baseLocale = normalizedLocale.split("_")[0];

  return (
    USER_GUIDE_LABELS[normalizedLocale] ??
    USER_GUIDE_LABELS[baseLocale] ??
    USER_GUIDE_LABELS.en
  );
}
