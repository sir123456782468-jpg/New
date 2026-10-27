/* مشترك بين صفحات الدخول والتسجيل والتحقق: الوضع الداكن + التصميم + الألوان والنصوص من لوحة التحكم + الفوتر + الدعم الفني */
(function () {
  'use strict';
  if (window.AuthUI) return;
  var SB = 'https://cxtmvsoxgfsormhcklfx.supabase.co';
  var KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4dG12c294Z2Zzb3JtaGNrbGZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNzI4MjQsImV4cCI6MjEwNTg0ODgyNH0.9zsPxYkMvHuRoe1R-XW8xOEUsE3IvoPP_r-iYXU_5s8';
  var DEFAULT_DESIGN = '1';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var root = document.documentElement;
  var A = window.AuthUI = { cfg: {}, data: null };

  /* —— الوضع الفاتح/الداكن (نفس مفتاح المنصة) */
  function theme() { var t = 'light'; try { t = localStorage.getItem('platform_theme') || 'light'; } catch (e) {} return t === 'dark' ? 'dark' : 'light'; }
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    var i = $('#themeIcon'), x = $('#themeText'); if (i) i.textContent = t === 'dark' ? '☀️' : '🌙'; if (x) x.textContent = t === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن';
  }
  A.toggleTheme = function () { var t = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; try { localStorage.setItem('platform_theme', t); } catch (e) {} setTheme(t); };
  setTheme(theme());

  /* —— إعدادات الصفحة الرئيسية (من الكاش فوراً ثم من السيرفر) */
  function merged(c) { return typeof window.LP_merge === 'function' ? window.LP_merge(c || {}) : (c || {}); }
  function cached() { try { return JSON.parse(localStorage.getItem('lp_cache_v1') || 'null'); } catch (e) { return null; } }
  function fetchFresh() {
    return fetch(SB + '/rest/v1/rpc/landing_get', { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: '{}' })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) { if (d && d.cfg) { try { localStorage.setItem('lp_cache_v1', JSON.stringify(d)); } catch (e) {} } return d; });
  }
  function hex(v) { return /^#[0-9a-fA-F]{6}$/.test(v || '') ? v : null; }
  function apply(d) {
    A.data = d || A.data || {}; var raw = (A.data && A.data.cfg) || {}, c = merged(raw); A.cfg = c; A.raw = raw;
    var qd = new URLSearchParams(location.search).get('d');
    var des = (qd && /^[123]$/.test(qd)) ? qd : (/^[123]$/.test(String(raw.auth_design || '')) ? String(raw.auth_design) : DEFAULT_DESIGN);
    root.setAttribute('data-d', des);
    var m = { '--ha': c.hero_a, '--hb': c.hero_b, '--hc': c.hero_c, '--ba': c.brand_a, '--bb': c.brand_b };
    for (var k in m) if (hex(m[k])) root.style.setProperty(k, m[k]);
    var tc = document.querySelector('meta[name=theme-color]'); if (tc && hex(c.hero_a)) tc.setAttribute('content', c.hero_a);
    /* النصوص: أي عنصر data-t="x" بيتغيّر بالقيمة auth_x لو اتكتبت من لوحة التحكم، وإلا بيفضل النص الأصلي */
    document.querySelectorAll('[data-t]').forEach(function (el) {
      if (el.__d0 === undefined) el.__d0 = el.textContent;
      var v = raw['auth_' + el.getAttribute('data-t')]; el.textContent = (typeof v === 'string' && v.trim()) ? v : el.__d0;
    });
    var nm = (A.data && A.data.platform_name) || 'The Leader In English', tn = (A.data && A.data.teacher_name) || 'Mr. Sherif Khafagy';
    document.querySelectorAll('[data-pn]').forEach(function (e) { e.textContent = nm; });
    document.querySelectorAll('[data-tn]').forEach(function (e) { e.textContent = tn; });
    var hs = $('#helpBox'); if (hs) hs.style.display = (raw.auth_show_help === false || c.show_support === false) ? 'none' : '';
    var sf = $('#sf'); if (sf && window.SiteFooter) sf.innerHTML = SiteFooter.html(c, { name: nm, teacher: tn, loggedIn: false });
    var vl = $('#vlist'); if (vl) vl.style.display = raw.auth_show_points === false ? 'none' : '';
    return c;
  }

  /* —— صورة المدرس (التصميم 2 بس) */
  function photo() {
    var box = $('#vph'); if (!box) return;
    var put = function (src) { box.innerHTML = src ? '<img alt="" src="' + src.replace(/"/g, '') + '">' : '<img class="lg" alt="" src="/logo.png">'; };
    var want = (A.cfg.show_photo !== false) && A.data && A.data.photo_v;
    if (!want) return put(null);
    var c = null; try { c = JSON.parse(localStorage.getItem('lp_photo_v1') || 'null'); } catch (e) {}
    if (c && c.v === A.data.photo_v && /^data:image\//.test(c.d || '')) return put(c.d);
    put(null);
    fetch(SB + '/rest/v1/rpc/landing_photo', { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: '{}' })
      .then(function (r) { return r.ok ? r.json() : null; }).then(function (d) { if (typeof d === 'string' && /^data:image\/(png|jpeg|webp);base64,/.test(d)) { put(d); try { localStorage.setItem('lp_photo_v1', JSON.stringify({ v: A.data.photo_v, d: d })); } catch (e) {} } }).catch(function () {});
  }

  /* —— الدعم الفني (بيتحمّل لما يتطلب، أو بعد ثانيتين) */
  A.support = function (open) {
    var go = function () { var b = document.getElementById('spw-b'); if (b && open) b.click(); };
    if (window.__spw) return go();
    if (A.cfg && A.cfg.show_support === false) return;
    if (A._sl) { if (open) setTimeout(go, 700); return; }
    A._sl = 1; var s = document.createElement('script'); s.src = '/support-widget.js'; s.onload = function () { if (open) setTimeout(go, 200); }; document.body.appendChild(s);
  };

  A.boot = function () {
    var c0 = cached(); apply(c0); photo();
    fetchFresh().then(function (d) { var before = JSON.stringify((c0 && c0.cfg) || {}) + ((c0 && c0.photo_v) || ''); if (JSON.stringify(d.cfg || {}) + (d.photo_v || '') !== before) { apply(d); photo(); } else { A.data = d; } }).catch(function () {});
    var h = $('#helpBtn'); if (h) h.addEventListener('click', function () { A.support(true); });
    setTimeout(function () { A.support(false); }, 2200);
  };

  /* أدوات صغيرة للصفحات */
  A.msg = function (html, ok, asText) { var b = $('#formMsg'); if (!b) return; if (asText) b.textContent = html; else b.innerHTML = html; b.className = 'msg' + (ok ? ' ok' : ''); b.style.display = 'block'; };
  A.eye = function (id, btn) { var i = document.getElementById(id); i.type = i.type === 'password' ? 'text' : 'password'; btn.textContent = i.type === 'password' ? '👁️' : '🙈'; };
  A.digits = function (el) { el.addEventListener('input', function () { var v = el.value.replace(/[٠-٩]/g, function (d) { return d.charCodeAt(0) - 1632; }).replace(/\D/g, ''); if (v !== el.value) el.value = v; }); };

  document.addEventListener('DOMContentLoaded', function () { var t = $('#themeBtn'); if (t) t.addEventListener('click', A.toggleTheme); setTheme(theme()); });
})();
