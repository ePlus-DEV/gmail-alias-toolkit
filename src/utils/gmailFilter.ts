import type { AliasCategory } from '../types/alias'; import { labelForCategory } from './categoryDetector';
export function buildGmailFilterQuery(alias:string): string { return `to:${alias}`; }
export function buildGmailSearchUrl(alias:string, accountIndex=0): string { const query=encodeURIComponent(buildGmailFilterQuery(alias)); return `https://mail.google.com/mail/u/${accountIndex}/#search/${query}`; }
export function suggestedGmailLabel(category: AliasCategory): string { return labelForCategory(category); }
