import type { AliasSuggestion, SiteAlias } from "../types/alias";
export interface AliasQuality {
  score: number;
  label: "Weak" | "Fair" | "Good" | "Strong";
  trackingLevel: "Low" | "Medium" | "High";
  privacyLevel: "Basic";
  warnings: string[];
}
export function calculateAliasQuality(
  alias: SiteAlias | AliasSuggestion,
): AliasQuality {
  const email = "alias" in alias ? alias.alias : "";
  const tag = email.match(/\+([^@]+)@/)?.[1] || "";
  let score = 0;
  const warnings = ["Gmail plus aliases do not hide your real Gmail address."];
  if (
    ("normalizedDomain" in alias && tag.includes(alias.normalizedDomain)) ||
    ("domainKeyword" in alias &&
      alias.domainKeyword &&
      tag.includes(alias.domainKeyword))
  )
    score += 30;
  if (
    ("category" in alias && alias.category && alias.category !== "other") ||
    /^(shopping|developer|career|social|finance|travel|education|productivity|entertainment)-/.test(
      tag,
    )
  )
    score += 20;
  if (/\d{8}|-[a-z0-9]{4}$/.test(tag)) score += 20;
  if (email.length <= 64) score += 10;
  if (!["test", "temp", "demo"].some((w) => tag === w || tag.includes(`-${w}`)))
    score += 10;
  if ("hostname" in alias) score += 10;
  const label =
    score >= 80
      ? "Strong"
      : score >= 60
        ? "Good"
        : score >= 35
          ? "Fair"
          : "Weak";
  const trackingLevel = score >= 60 ? "High" : score >= 35 ? "Medium" : "Low";
  return { score, label, trackingLevel, privacyLevel: "Basic", warnings };
}
