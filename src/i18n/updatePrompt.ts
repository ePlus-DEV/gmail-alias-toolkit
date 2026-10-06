export interface UpdatePromptCopy {
  title: string;
  available: string;
  ready: string;
  checkNow: string;
  applyNow: string;
  later: string;
  checking: string;
}

const UPDATE_PROMPT_COPY: Record<string, UpdatePromptCopy> = {
  en: {
    title: "Update available",
    available:
      "You are using v{current}. Version v{latest} is available from your browser store.",
    ready: "Version v{latest} is downloaded and ready to apply.",
    checkNow: "Check & update",
    applyNow: "Apply update",
    later: "Later",
    checking: "Checking...",
  },
  vi: {
    title: "Có bản cập nhật",
    available:
      "Bạn đang dùng v{current}. Phiên bản v{latest} đã có trên cửa hàng tiện ích.",
    ready: "Phiên bản v{latest} đã tải xong và sẵn sàng áp dụng.",
    checkNow: "Kiểm tra và cập nhật",
    applyNow: "Áp dụng cập nhật",
    later: "Để sau",
    checking: "Đang kiểm tra...",
  },
  de: {
    title: "Update verfügbar",
    available:
      "Du verwendest v{current}. Version v{latest} ist im Browser-Store verfügbar.",
    ready: "Version v{latest} wurde heruntergeladen und kann angewendet werden.",
    checkNow: "Prüfen und aktualisieren",
    applyNow: "Update anwenden",
    later: "Später",
    checking: "Wird geprüft...",
  },
  es: {
    title: "Actualización disponible",
    available:
      "Estás usando v{current}. La versión v{latest} está disponible en la tienda del navegador.",
    ready: "La versión v{latest} se descargó y está lista para aplicarse.",
    checkNow: "Comprobar y actualizar",
    applyNow: "Aplicar actualización",
    later: "Más tarde",
    checking: "Comprobando...",
  },
  fr: {
    title: "Mise à jour disponible",
    available:
      "Vous utilisez la v{current}. La version v{latest} est disponible dans la boutique du navigateur.",
    ready: "La version v{latest} est téléchargée et prête à être appliquée.",
    checkNow: "Vérifier et mettre à jour",
    applyNow: "Appliquer la mise à jour",
    later: "Plus tard",
    checking: "Vérification...",
  },
  hi: {
    title: "अपडेट उपलब्ध है",
    available:
      "आप v{current} का उपयोग कर रहे हैं। v{latest} ब्राउज़र स्टोर पर उपलब्ध है।",
    ready: "v{latest} डाउनलोड हो गया है और लागू करने के लिए तैयार है।",
    checkNow: "जाँचें और अपडेट करें",
    applyNow: "अपडेट लागू करें",
    later: "बाद में",
    checking: "जाँच हो रही है...",
  },
  it: {
    title: "Aggiornamento disponibile",
    available:
      "Stai usando la v{current}. La versione v{latest} è disponibile nello store del browser.",
    ready: "La versione v{latest} è stata scaricata ed è pronta da applicare.",
    checkNow: "Controlla e aggiorna",
    applyNow: "Applica aggiornamento",
    later: "Più tardi",
    checking: "Controllo...",
  },
  ja: {
    title: "アップデートがあります",
    available:
      "現在 v{current} を使用しています。ブラウザストアで v{latest} を利用できます。",
    ready: "v{latest} のダウンロードが完了し、適用できます。",
    checkNow: "確認して更新",
    applyNow: "更新を適用",
    later: "後で",
    checking: "確認中...",
  },
  ko: {
    title: "업데이트 사용 가능",
    available:
      "현재 v{current}을 사용 중입니다. 브라우저 스토어에서 v{latest}을 사용할 수 있습니다.",
    ready: "v{latest} 다운로드가 완료되어 적용할 수 있습니다.",
    checkNow: "확인 및 업데이트",
    applyNow: "업데이트 적용",
    later: "나중에",
    checking: "확인 중...",
  },
  pl: {
    title: "Dostępna aktualizacja",
    available:
      "Używasz wersji v{current}. W sklepie przeglądarki jest dostępna wersja v{latest}.",
    ready: "Wersja v{latest} została pobrana i jest gotowa do zastosowania.",
    checkNow: "Sprawdź i zaktualizuj",
    applyNow: "Zastosuj aktualizację",
    later: "Później",
    checking: "Sprawdzanie...",
  },
  pt_br: {
    title: "Atualização disponível",
    available:
      "Você está usando a v{current}. A versão v{latest} está disponível na loja do navegador.",
    ready: "A versão v{latest} foi baixada e está pronta para ser aplicada.",
    checkNow: "Verificar e atualizar",
    applyNow: "Aplicar atualização",
    later: "Mais tarde",
    checking: "Verificando...",
  },
  ru: {
    title: "Доступно обновление",
    available:
      "У вас установлена v{current}. Версия v{latest} доступна в магазине браузера.",
    ready: "Версия v{latest} загружена и готова к применению.",
    checkNow: "Проверить и обновить",
    applyNow: "Применить обновление",
    later: "Позже",
    checking: "Проверка...",
  },
  tr: {
    title: "Güncelleme mevcut",
    available:
      "v{current} kullanıyorsunuz. v{latest} tarayıcı mağazasında mevcut.",
    ready: "v{latest} indirildi ve uygulanmaya hazır.",
    checkNow: "Kontrol et ve güncelle",
    applyNow: "Güncellemeyi uygula",
    later: "Daha sonra",
    checking: "Kontrol ediliyor...",
  },
  zh_cn: {
    title: "有可用更新",
    available:
      "你正在使用 v{current}。浏览器扩展商店已提供 v{latest}。",
    ready: "v{latest} 已下载完成，可以立即应用。",
    checkNow: "检查并更新",
    applyNow: "应用更新",
    later: "稍后",
    checking: "正在检查...",
  },
};

/** Resolves update copy for the active browser UI locale. */
export function getUpdatePromptCopy(locale?: string): UpdatePromptCopy {
  const resolvedLocale = (
    locale ?? browser.i18n.getUILanguage?.() ?? "en"
  )
    .toLowerCase()
    .replace("-", "_");
  const baseLocale = resolvedLocale.split("_")[0];
  return (
    UPDATE_PROMPT_COPY[resolvedLocale] ??
    UPDATE_PROMPT_COPY[baseLocale] ??
    UPDATE_PROMPT_COPY.en
  );
}

/** Replaces the small set of named placeholders used by update messages. */
export function formatUpdatePromptCopy(
  template: string,
  values: Record<"current" | "latest", string>,
): string {
  return template
    .replaceAll("{current}", values.current)
    .replaceAll("{latest}", values.latest);
}
