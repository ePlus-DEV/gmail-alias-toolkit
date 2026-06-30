import { getHostnameFromUrl, normalizeDomain } from '../src/utils/domain';
import { detectCategory } from '../src/utils/categoryDetector';
import { generateAliasSuggestions, buildPlusAlias } from '../src/utils/aliasGenerator';
import { getActiveBaseEmail, loadAliasData, touchAlias } from '../src/utils/storage';

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async () => { await createContextMenus(); await updateBadge(); });
  browser.storage.onChanged.addListener(async () => { await updateBadge(); });

  async function createContextMenus() {
    await browser.contextMenus.removeAll().catch(() => undefined);
    browser.contextMenus.create({ id:'gmail-alias-parent', title:'Gmail Alias Toolkit', contexts:['editable'] });
    browser.contextMenus.create({ id:'insert-suggested-alias', parentId:'gmail-alias-parent', title:'Insert suggested alias', contexts:['editable'] });
    browser.contextMenus.create({ id:'copy-suggested-alias', parentId:'gmail-alias-parent', title:'Copy suggested alias', contexts:['editable'] });
    browser.contextMenus.create({ id:'use-previous-alias', parentId:'gmail-alias-parent', title:'Use previous alias for this site', contexts:['editable'] });
    browser.contextMenus.create({ id:'generate-random-alias', parentId:'gmail-alias-parent', title:'Generate random alias', contexts:['editable'] });
    browser.contextMenus.create({ id:'fill-random-email', parentId:'gmail-alias-parent', title:'🎲 Random Email Alias', contexts:['editable'] });
  }

  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (!tab?.id) return;
    const email = await resolveAlias(String(info.menuItemId), tab.url);
    if (!email) return;
    if (String(info.menuItemId).startsWith('copy')) await navigator.clipboard.writeText(email).catch(() => undefined);
    const res = await browser.tabs.sendMessage(tab.id, { action:'autofillAlias', email }).catch(() => ({ ok:false }));
    await saveToLegacyHistory(email);
    const hostname = tab.url ? getHostnameFromUrl(tab.url) : null;
    if (hostname) await touchAlias(hostname);
  });

  async function resolveAlias(menuId:string, url?:string) {
    const hostname = url ? getHostnameFromUrl(url) : null;
    const data = await loadAliasData();
    if (hostname && (menuId === 'use-previous-alias' || menuId === 'copy-previous-alias') && data.siteAliases[hostname]) return data.siteAliases[hostname].alias;
    if (hostname && menuId !== 'generate-random-alias' && data.siteAliases[hostname]) return data.siteAliases[hostname].alias;
    const baseEmail = await getActiveBaseEmail(); if (!baseEmail) return '';
    const keyword = hostname ? normalizeDomain(hostname) : 'site';
    if (menuId === 'generate-random-alias' || menuId === 'fill-random-email') return buildPlusAlias(baseEmail, `${keyword}-${Math.random().toString(36).slice(2,6)}`);
    return generateAliasSuggestions({ baseEmail, domainKeyword: keyword, category: detectCategory(keyword, hostname || '') })[0]?.alias || '';
  }

  async function updateBadge() { const data=await loadAliasData().catch(()=>null); const count=data ? Object.keys(data.siteAliases).length : 0; await browser.action.setBadgeText({ text: count ? String(count) : '' }); await browser.action.setBadgeBackgroundColor({ color:'#2563eb' }); }
  async function saveToLegacyHistory(email:string) { const r:any=await browser.storage.local.get(['base_email','app_settings']); const active=String(r.base_email || ''); const key=`gmail_alias_recent_${active.replace(/[^a-zA-Z0-9]/g,'_')}`; const old:any[]=(await browser.storage.local.get(key) as any)[key] || []; await browser.storage.local.set({[key]:[{email,timestamp:Date.now()},...old.filter((a:any)=>a.email!==email)].slice(0,r.app_settings?.maxHistory || 20)}); }
});
