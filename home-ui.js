/* =====================================================================
   home-ui.js — بيطبّق إعدادات «الصفحة الرئيسية للطالب» (من لوحة التحكم) على home.html.
   - بيشتغل فوراً من الكاش (localStorage) عشان مفيش وميض، وبعد تسجيل الدخول بيجيب النسخة الجديدة من السيرفر.
   - كل النصوص بتتعرض كنص عادي (textContent / esc) — مفيش HTML من الإعدادات أبداً.
   - لو أي حاجة فشلت: الصفحة بتفضل بشكلها الأصلي.
   يحتاج: home-schema.js قبله.
   ===================================================================== */
(function () {
'use strict';
const SC = window.HM_SCHEMA || { groups: [], by: {} };
const BY = SC.by, CK = 'hm_cfg_v1';
let CFG = {}, REV = -1, STYLE = null;
const own = (o, k) => o && typeof o === 'object' && Object.prototype.hasOwnProperty.call(o, k);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sub = (s, vars) => vars ? String(s).replace(/\{([a-z0-9_]+)\}/gi, (m, k) => own(vars, k) && vars[k] != null ? String(vars[k]) : m) : String(s);
const clamp = (v, f) => { v = +v; if (!isFinite(v)) return f.d; if (f.min != null) v = Math.max(f.min, v); if (f.max != null) v = Math.min(f.max, v); return v; };

const HM = window.HM = {
  get cfg() { return CFG; },
  t(k, vars) { const f = BY[k]; const v = own(CFG.t, k) && typeof CFG.t[k] === 'string' ? CFG.t[k] : (f && f.d != null ? f.d : ''); return sub(v, vars); },
  e(k, vars) { return esc(HM.t(k, vars)); },
  b(k, vars) { return esc(HM.t(k, vars)).replace(/\|\|/g, '<br>'); },
  on(k) { if (own(CFG.s, k) && typeof CFG.s[k] === 'boolean') return CFG.s[k]; const f = BY[k]; return f ? f.d !== false : true; },
  n(k) { const f = BY[k] || {}; return own(CFG.n, k) ? clamp(CFG.n[k], f) : f.d; },
  x(k) { const f = BY[k] || {}; const v = own(CFG.x, k) ? CFG.x[k] : f.d; return f.o && !f.o.some(o => o[0] === v) ? f.d : v; },
  l(k) { const f = BY[k] || {}; const v = own(CFG.l, k) && Array.isArray(CFG.l[k]) && CFG.l[k].length ? CFG.l[k] : f.d; return (v || []).map(String); },
  o(k) {
    const f = BY[k] || {}, base = (f.d || []).slice(), cur = own(CFG.o, k) && Array.isArray(CFG.o[k]) ? CFG.o[k] : [];
    const out = cur.filter((id, i) => base.indexOf(id) >= 0 && cur.indexOf(id) === i);
    base.forEach(id => { if (out.indexOf(id) < 0) out.push(id); });
    return out;
  },
  /* ---- تطبيق ---- */
  apply(cfg) {
    CFG = cfg && typeof cfg === 'object' ? cfg : {};
    ['t', 's', 'c', 'cd', 'n', 'x', 'l', 'o'].forEach(k => { if (!CFG[k] || typeof CFG[k] !== 'object') CFG[k] = {}; });
    try { buildStyle(); } catch (e) {}
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => HM.dom(), { once: true }); else HM.dom();
  },
  dom(root) {
    root = root || document;
    try { applyDom(root); } catch (e) { try { console.warn('hm dom', e); } catch (x) {} }
    try { document.dispatchEvent(new CustomEvent('hm-applied')); } catch (e) {}
  },
  /* ---- تحميل من السيرفر ---- */
  async fetch(client) {
    try {
      const r = await client.rpc('home_ui_get');
      if (r.error || !r.data || typeof r.data !== 'object') return false;
      const rev = +r.data.rev || 0;
      if (rev === REV) return false;
      REV = rev;
      try { localStorage.setItem(CK, JSON.stringify({ rev, cfg: r.data.cfg || {} })); } catch (e) {}
      HM.apply(r.data.cfg || {});
      try { document.dispatchEvent(new CustomEvent('hm-changed')); } catch (e) {}
      return true;
    } catch (e) { return false; }
  }
};

function buildStyle() {
  let css = '', light = '', dark = '';
  SC.groups.forEach(g => g.f.forEach(f => {
    if (!f.v) return;
    if (f.t === 'col') {
      if (own(CFG.c, f.k) && /^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(CFG.c[f.k])) light += f.v + ':' + CFG.c[f.k] + ';';
      if (own(CFG.cd, f.k) && /^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(CFG.cd[f.k])) dark += f.v + ':' + CFG.cd[f.k] + ';';
    } else if (f.t === 'num' && own(CFG.n, f.k)) light += f.v + ':' + clamp(CFG.n[f.k], f) + (f.vu || '') + ';';
  }));
  const mw = HM.n('main_w'); if (mw > 0) light += '--main-w:' + mw + 'px;';
  if (!HM.on('sh_shadow')) { light += '--sh:none;'; dark += '--sh:none;'; }
  const al = HM.x('greet_align'); if (al === 'start' || al === 'end') light += '--greet-al:' + al + ';';
  if (light) css += 'html:root{' + light + '}';
  if (dark) css += 'body[data-theme="dark"]{' + dark + '}';
  if (!STYLE) { STYLE = document.createElement('style'); STYLE.id = 'hm-style'; (document.head || document.documentElement).appendChild(STYLE); }
  STYLE.textContent = css;
  const h = document.documentElement;
  if (HM.x('anim') === 'off') h.setAttribute('data-hm-noanim', ''); else h.removeAttribute('data-hm-noanim');
  const tm = HM.x('theme_mode');
  if (tm === 'light' || tm === 'dark') h.setAttribute('data-hm-theme', tm); else h.removeAttribute('data-hm-theme');
}

function setText(el, key) {
  if (el.__hmo === undefined) el.__hmo = el.textContent;
  const v = own(CFG.t, key) && typeof CFG.t[key] === 'string' ? CFG.t[key] : el.__hmo;
  if (el.textContent !== v) el.textContent = v;
}

function visKids(g) { return Array.prototype.filter.call(g.children, c => !c.hasAttribute('data-hm-off')).length; }

function applyDom(root) {
  root.querySelectorAll('[data-hk]').forEach(el => setText(el, el.getAttribute('data-hk')));
  root.querySelectorAll('[data-hp]').forEach(el => {
    if (el.__hmp === undefined) el.__hmp = el.getAttribute('placeholder') || '';
    const k = el.getAttribute('data-hp'), v = own(CFG.t, k) && typeof CFG.t[k] === 'string' ? CFG.t[k] : el.__hmp;
    el.setAttribute('placeholder', v);
  });
  root.querySelectorAll('[data-hs]').forEach(el => {
    const off = el.getAttribute('data-hs').split(/\s+/).filter(Boolean).some(k => !HM.on(k));
    if (off) el.setAttribute('data-hm-off', ''); else el.removeAttribute('data-hm-off');
  });
  root.querySelectorAll('[data-nid]').forEach(el => {
    const id = el.getAttribute('data-nid'), bottom = !!el.closest('.bottom');
    const lb = el.querySelector('.lbl,.bl'), ic = el.querySelector('.ic,.bi');
    if (lb) setText(lb, (bottom ? 'bn_' : 'nav_') + id + '_l');
    if (ic) setText(ic, 'nav_' + id + '_i');
  });
  root.querySelectorAll('[data-ho]').forEach(el => {
    const p = el.getAttribute('data-ho').split(':'), i = HM.o(p[0]).indexOf(p[1]);
    el.style.order = i < 0 ? 99 : i;
  });
  // شبكات الكروت: لو كارت واحد بس ظاهر ياخد العرض كله، ولو مفيش ولا كارت الصف كله بيتخفى
  document.querySelectorAll('.g2,.g3').forEach(g => {
    const n = visKids(g);
    if (n === 1) g.setAttribute('data-solo', ''); else g.removeAttribute('data-solo');
    if (n === 0) g.setAttribute('data-hm-off', ''); else g.removeAttribute('data-hm-off');
  });
  document.querySelectorAll('.stats').forEach(g => { const n = visKids(g); g.style.setProperty('--stcols', Math.max(1, Math.min(4, n))); g.style.setProperty('--stc2', Math.max(1, Math.min(2, n))); });
  // ترتيب الأقسام: لو مختلف عن الأصلي بنفعّل وضع الترتيب (flex) في الرئيسية
  const hv = document.getElementById('v-home');
  if (hv) { const f = BY.home_blocks; hv.classList.toggle('hm-ord', !!f && HM.o('home_blocks').join() !== f.d.join()); }
  const tm = HM.x('theme_mode');
  if (tm === 'light' || tm === 'dark') { if (document.body) document.body.setAttribute('data-theme', tm); }
  else if (document.documentElement.__hmForced && document.body) { let t = 'light'; try { t = localStorage.getItem('platform_theme') || 'light'; } catch (e) {} document.body.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light'); }
  document.documentElement.__hmForced = tm === 'light' || tm === 'dark';
  document.title = HM.t('page_title');
}

/* الكاش: بيتطبّق قبل ما الصفحة تتبني */
try { const j = JSON.parse(localStorage.getItem(CK) || 'null'); if (j && j.cfg && typeof j.cfg === 'object') { REV = +j.rev || 0; HM.apply(j.cfg); } else HM.apply({}); } catch (e) { HM.apply({}); }

/* معاينة لوحة التحكم (iframe): الإعدادات بتيجي بالرسايل ومفيش اتصال بالسيرفر */
if (/[?&]hmpreview=1/.test(location.search) && window.parent !== window) {
  window.HM_PREVIEW = true;
  addEventListener('message', e => {
    if (e.origin !== location.origin || !e.data || e.data.type !== 'hm-preview') return;
    const m = e.data;
    if (m.cfg && typeof m.cfg === 'object') HM.apply(m.cfg);
    if (m.theme === 'light' || m.theme === 'dark') { const tm = HM.x('theme_mode'); if (tm === 'user' && document.body) document.body.setAttribute('data-theme', m.theme); }
    if (m.view && /^[a-z]+$/.test(m.view) && location.hash !== '#' + m.view) location.hash = '#' + m.view;
    try { if (window.hmRerender) window.hmRerender(); } catch (x) {}
    if (m.scroll && /^[a-z0-9_]+$/.test(m.scroll)) setTimeout(() => { const el = document.querySelector('[data-blk="' + m.scroll + '"]'); if (el && !el.hasAttribute('data-hm-off')) el.scrollIntoView({ block: 'start', behavior: 'smooth' }); }, 60);
  });
  window.hmReady = () => { try { parent.postMessage({ type: 'hm-ready' }, location.origin); } catch (e) {} };
}
})();
