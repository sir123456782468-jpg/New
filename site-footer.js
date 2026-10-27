/* فوتر موحّد: الصفحة الرئيسية + صفحات الدخول والتسجيل + المنصة.
   (1) أعمدة: عن المنصة | الصفحات | تواصل معنا (كل رابط باسمه وأيقونته) — والتوقيع في آخر سطر.
   (2) البيانات من إعدادات الصفحة الرئيسية في لوحة التحكم (واتساب/فيسبوك/...)، فأي رابط تضيفه يظهر هنا لوحده.
   الاستخدام: SiteFooter.html(cfg, opts) أو SiteFooter.mount(element, opts)
   opts: { name, logo, pages:[{label,href}], onIndex } */
(function () {
  'use strict';
  if (window.SiteFooter) return;
  var SB = 'https://cxtmvsoxgfsormhcklfx.supabase.co';
  var KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4dG12c294Z2Zzb3JtaGNrbGZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNzI4MjQsImV4cCI6MjEwNTg0ODgyNH0.9zsPxYkMvHuRoe1R-XW8xOEUsE3IvoPP_r-iYXU_5s8';
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var safe = function (u) { u = String(u || '').trim(); return /^(\/|#|https:\/\/)/.test(u) && !/^\/\//.test(u) ? u : '#'; };
  var waLink = function (v) { v = String(v || '').trim(); if (!v) return ''; if (/^https:\/\//.test(v)) return v; var d = v.replace(/\D/g, ''); if (/^01\d{9}$/.test(d)) d = '2' + d; return d.length >= 8 ? 'https://wa.me/' + d : ''; };
  var S = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  var NET = [
    ['whatsapp', 'واتساب', '#25D366', '<svg viewBox="0 0 24 24" ' + S + '><path d="M3 21l1.65-4.87A9 9 0 1 1 8 19.35L3 21z"/><path d="M9.2 8.8c.2 2.4 2.7 4.9 5.2 5.4l1.2-1.3-1.9-1.1-.9.7a4 4 0 0 1-1.9-1.9l.7-.9-1.1-1.9-1.3 1z" fill="currentColor" stroke="none"/></svg>'],
    ['facebook', 'فيسبوك', '#1877F2', '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M15 3h-2.4A3.6 3.6 0 0 0 9 6.6V9H6.5v3.6H9V21h3.6v-8.4H15l.6-3.6h-3V6.9c0-.5.3-.9.9-.9H15.6V3z"/></svg>'],
    ['instagram', 'إنستجرام', 'linear-gradient(45deg,#f9a825,#e1306c 55%,#8e24aa)', '<svg viewBox="0 0 24 24" ' + S + '><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>'],
    ['youtube', 'يوتيوب', '#FF0000', '<svg viewBox="0 0 24 24"><rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 9.4v5.2l4.6-2.6z" fill="currentColor"/></svg>'],
    ['tiktok', 'تيك توك', '#0f0f10', '<svg viewBox="0 0 24 24" ' + S + '><path d="M14 3v11.3a3.8 3.8 0 1 1-3.8-3.8"/><path d="M14 3c.4 2.5 2 4 4.6 4.2"/></svg>'],
    ['telegram', 'تيليجرام', '#229ED9', '<svg viewBox="0 0 24 24" ' + S + '><path d="M21 3L3 10.4l6 2.4 2.4 6L21 3z"/><path d="M9 12.8L21 3"/></svg>']
  ];
  var DEF = { copyright: '© 2026 The Leader In English', dev_sign: 'Developer / Mohamed Sherif Khafagy', footer_text: '', show_social: true, foot_pages_title: 'الصفحات', foot_contact_title: 'تواصل معنا', foot_about_title: '', show_foot_pages: true, nav: [] };
  function merge(cfg) { var o = {}, k; for (k in DEF) o[k] = DEF[k]; cfg = cfg || {}; for (k in cfg) if (cfg[k] !== undefined && cfg[k] !== null) o[k] = cfg[k]; return o; }

  function css() {
    if (document.getElementById('sf-css')) return;
    var v = function (n, f) { return 'var(--sf-' + n + ',' + f + ')'; };
    var ink = v('ink', 'var(--ink,#0f172a)'), mut = v('mut', 'var(--mut,var(--muted,#64748b))'), line = v('line', 'var(--line,rgba(120,130,150,.28))'), brand = v('brand', 'var(--brand,var(--ba,#ef4444))'),
      grad = v('grad', 'var(--grad,linear-gradient(135deg,#ef4444,#ec2f7d))');
    var st = document.createElement('style'); st.id = 'sf-css';
    st.textContent = '.sf{margin-top:56px;border-top:1px solid ' + line + ';padding-top:34px;color:' + mut + ';font-family:inherit;text-align:right}.sf *{box-sizing:border-box}'
      + '.sf-in{max-width:1120px;margin:0 auto;padding:0 20px;display:grid;grid-template-columns:1.5fr 1fr 1.2fr;gap:30px}.sf-in.n2{grid-template-columns:1.5fr 1.2fr}.sf-in.n1{grid-template-columns:1fr}'
      + '.sf-b{display:flex;gap:12px;align-items:flex-start}.sf-b img{width:48px;height:48px;border-radius:14px;object-fit:cover;flex:0 0 48px;background:#fff}.sf-b b{display:block;color:' + ink + ';font-size:16px;font-weight:900;line-height:1.5}.sf-b p{margin:6px 0 0;font-size:13.5px;line-height:1.9;font-weight:600}'
      + '.sf h4{margin:0 0 14px;color:' + ink + ';font-size:14.5px;font-weight:900;position:relative;padding-bottom:9px}.sf h4::after{content:"";position:absolute;right:0;bottom:0;width:28px;height:3px;border-radius:3px;background:' + grad + '}'
      + '.sf-l{display:flex;flex-direction:column;gap:10px}.sf-l a{color:inherit;text-decoration:none;font-weight:700;font-size:14px;display:flex;align-items:center;gap:10px;transition:color .2s,transform .2s;width:max-content;max-width:100%}.sf-l a:hover{color:' + brand + ';transform:translateX(-3px)}'
      + '.sf-l a.pg::before{content:"";width:6px;height:6px;border-radius:50%;background:' + grad + ';flex:0 0 6px}'
      + '.sf-ic{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;color:#fff;flex:0 0 34px;box-shadow:0 6px 14px -8px rgba(0,0,0,.5)}.sf-ic svg{width:18px;height:18px;display:block}'
      + '.sf-soon{font-size:13.5px;font-weight:700;opacity:.8}'
      + '.sf-cp{margin-top:28px;border-top:1px solid ' + line + ';padding:15px 20px 6px;text-align:center;font-size:12.5px;font-weight:700}'
      + '.sf-dev{text-align:center;direction:ltr;padding:2px 20px 30px;font-family:"Lora","Cairo",serif;font-style:italic;font-weight:700;font-size:15px;letter-spacing:.4px;background:' + grad + ';-webkit-background-clip:text;background-clip:text;color:transparent}'
      + '@media(max-width:780px){.sf-in,.sf-in.n2{grid-template-columns:1fr;gap:26px}.sf{margin-top:40px}}';
    document.head.appendChild(st);
  }

  function pagesOf(c, o) {
    var onIdx = !!o.onIndex, out = [], pg = o.pages;
    if (!pg) {
      pg = (c.nav || []).map(function (n) { return { label: n.label, href: n.href }; });
      if (!o.loggedIn) { pg.push({ label: 'تسجيل الدخول', href: '/signin.html' }); pg.push({ label: 'إنشاء حساب', href: '/signup.html' }); }
      else pg.push({ label: 'ادخل المنصة', href: '/home.html' });
    }
    pg.forEach(function (p) { if (!p || !p.label) return; var h = safe(p.href); if (!onIdx && /^#/.test(h) && !o.pages) h = '/' + h; out.push({ label: p.label, href: h }); });
    return out;
  }
  function html(cfg, o) {
    o = o || {}; css();
    var c = merge(cfg), name = o.name || 'The Leader In English', logo = o.logo || '/logo.png';
    var soc = c.show_social === false ? [] : NET.map(function (n) { var u = n[0] === 'whatsapp' ? waLink(c.whatsapp) : String(c[n[0]] || '').trim(); return u && (n[0] === 'whatsapp' || /^https:\/\//.test(u)) ? { k: n[0], n: n[1], bg: n[2], ic: n[3], u: u } : null; }).filter(Boolean);
    var pg = c.show_foot_pages === false ? [] : pagesOf(c, o);
    var cols = 1 + (pg.length ? 1 : 0) + 1, cls = cols === 3 ? '' : cols === 2 ? ' n2' : ' n1';
    var h = '<div class="sf-in' + cls + '"><div><div class="sf-b"><img src="' + esc(logo) + '" alt="" onerror="this.style.display=\'none\'"><div><b>' + esc(name) + '</b>' + ((c.footer_text || o.teacher) ? '<p>' + esc(c.footer_text || ('منصة تعلّم اللغة الإنجليزية مع ' + o.teacher)) + '</p>' : '') + '</div></div></div>';
    if (pg.length) h += '<div><h4>' + esc(c.foot_pages_title || 'الصفحات') + '</h4><div class="sf-l">' + pg.map(function (p) { return '<a class="pg" href="' + esc(p.href) + '">' + esc(p.label) + '</a>'; }).join('') + '</div></div>';
    h += '<div><h4>' + esc(c.foot_contact_title || 'تواصل معنا') + '</h4>' + (soc.length ? '<div class="sf-l">' + soc.map(function (s) { return '<a href="' + esc(safe(s.u)) + '" target="_blank" rel="noopener noreferrer"><span class="sf-ic" style="background:' + s.bg + '">' + s.ic + '</span>' + esc(s.n) + '</a>'; }).join('') + '</div>' : '<div class="sf-soon">قريباً 🔗</div>') + '</div></div>';
    h += '<div class="sf-cp"><span dir="auto" style="unicode-bidi:plaintext">' + esc(c.copyright) + '</span></div>' + (c.dev_sign ? '<div class="sf-dev">' + esc(c.dev_sign) + '</div>' : '');
    return '<footer class="sf">' + h + '</footer>';
  }

  function cached() { try { return JSON.parse(localStorage.getItem('lp_cache_v1') || 'null'); } catch (e) { return null; } }
  function fresh() {
    return fetch(SB + '/rest/v1/rpc/landing_get', { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: '{}' })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (d) { if (d && d.cfg) { try { localStorage.setItem('lp_cache_v1', JSON.stringify(d)); } catch (e) {} } return d; });
  }
  function mount(el, o) {
    o = o || {}; if (!el) return;
    var draw = function (d) { var nm = o.name || (d && d.platform_name) || 'The Leader In English'; var oo = {}; for (var k in o) oo[k] = o[k]; oo.name = nm; oo.teacher = o.teacher || (d && d.teacher_name) || ''; el.innerHTML = html(d && d.cfg, oo); };
    var c0 = cached(); draw(c0);
    fresh().then(function (d) { if (d && JSON.stringify(d.cfg || {}) !== JSON.stringify((c0 && c0.cfg) || {})) draw(d); }).catch(function () {});
  }
  window.SiteFooter = { html: html, mount: mount, merge: merge };
})();
