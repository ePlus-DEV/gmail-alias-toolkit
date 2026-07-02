import type { AliasCategory, AliasSuggestion } from "../types/alias";
import { formatYYYYMMDD } from "./date";
import { randomString } from "./random";
export interface GenerateAliasInput {
  baseEmail: string;
  domainKeyword: string;
  category?: AliasCategory;
  purpose?: string;
  date?: Date;
}
export function splitEmail(
  email: string,
): { local: string; domain: string } | null {
  const trimmed = email.trim().toLowerCase();
  const match = trimmed.match(/^([^@\s]+)@([^@\s]+\.[^@\s]+)$/);
  return match ? { local: match[1], domain: match[2] } : null;
}
export function isGmailAddress(email: string): boolean {
  const p = splitEmail(email);
  return !!p && ["gmail.com", "googlemail.com"].includes(p.domain);
}
export function sanitizeAliasTag(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
export function buildPlusAlias(baseEmail: string, tag: string): string {
  const p = splitEmail(baseEmail);
  if (!p) throw new Error("Invalid email");
  if (!["gmail.com", "googlemail.com"].includes(p.domain))
    throw new Error("Only Gmail/Googlemail plus aliases are supported");
  const clean = sanitizeAliasTag(tag);
  if (!clean) throw new Error("Alias tag is empty");
  return `${p.local}+${clean}@${p.domain}`;
}
export function generateAliasSuggestions(
  input: GenerateAliasInput,
): AliasSuggestion[] {
  const domain = sanitizeAliasTag(input.domainKeyword);
  const category = input.category || "other";
  const date = formatYYYYMMDD(input.date || new Date());
  const tags = [
    { tag: domain, label: "Domain alias", format: "domain" },
    {
      tag: `${category}-${domain}`,
      label: "Category + domain",
      format: "category-domain",
    },
    { tag: `${domain}-${date}`, label: "Domain + date", format: "domain-date" },
    {
      tag: `${domain}-${randomString(4)}`,
      label: "Domain + random",
      format: "domain-random",
    },
  ];
  if (input.purpose)
    tags.push({
      tag: `${domain}-${input.purpose}`,
      label: "Domain + purpose",
      format: "domain-purpose",
    });
  return tags.map((t) => ({
    alias: buildPlusAlias(input.baseEmail, t.tag),
    label: t.label,
    format: t.format,
    category,
    domainKeyword: domain,
  }));
}
