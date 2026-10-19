/* =====================================================================
   ui.js — أدوات واجهة مشتركة: زر الوضع الليلي المتحرك، عارض الصور داخل المنصة،
   ضغط الصور قبل الرفع، ولافتات/إشعارات إضافية (شكل + ألوان + مؤقت + إغلاق + لكل صف).
   بيتحمّل بـ <script src="/ui.js" defer></script> — وأي صفحة بتشتغل حتى لو الملف ده مش موجود.
   ===================================================================== */
(function () {
  if (window.UI) return;
  const UI = window.UI = {};
  const $ = (s, r) => (r || document).querySelector(s);
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = { get(k, s) { try { return (s ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } }, set(k, v, s) { try { (s ? sessionStorage : localStorage).setItem(k, v); } catch (e) {} } };

  /* ---------------------------------------------------------------- CSS */
  const CSS = `
.uit{--w:62px;--h:32px;position:relative;flex:none;width:var(--w);height:var(--h);border-radius:99px;border:1px solid rgba(100,116,139,.35);padding:0;cursor:pointer;overflow:hidden;
  background:linear-gradient(135deg,#bae6fd,#fde68a);transition:background .55s ease,border-color .55s ease,box-shadow .3s;-webkit-tap-highlight-color:transparent;outline:none;appearance:none;-webkit-appearance:none;font-size:0}
.uit:focus-visible{box-shadow:0 0 0 3px rgba(239,68,68,.45)}
.uit::before{content:"";position:absolute;inset:0;background:linear-gradient(135deg,#0b1224,#1e293b);opacity:0;transition:opacity .55s ease}
.uit .st{position:absolute;inset:0;opacity:0;transition:opacity .5s ease;background:radial-gradient(1.5px 1.5px at 12px 9px,#fff 98%,transparent),radial-gradient(1px 1px at 22px 21px,#fff 98%,transparent),radial-gradient(1.2px 1.2px at 32px 8px,#fff 98%,transparent),radial-gradient(1px 1px at 40px 22px,#fff 98%,transparent)}
.uit .k{position:absolute;top:3px;inset-inline-start:3px;width:calc(var(--h) - 8px);height:calc(var(--h) - 8px);border-radius:50%;background:#fbbf24;box-shadow:0 2px 6px rgba(0,0,0,.35);
  transition:transform .55s cubic-bezier(.68,-.35,.27,1.35),background .5s ease;display:grid;place-items:center}
.uit .k svg{position:absolute;width:62%;height:62%;transition:opacity .35s ease,transform .55s ease}
.uit .k .sun{opacity:1;transform:rotate(0)}.uit .k .moon{opacity:0;transform:rotate(-90deg) scale(.6)}
[dir=rtl] .uit[aria-pressed=true] .k{transform:translateX(calc(var(--w) * -1 + var(--h) - 2px))}
[dir=ltr] .uit[aria-pressed=true] .k,:root:not([dir]) .uit[aria-pressed=true] .k{transform:translateX(calc(var(--w) - var(--h) + 2px))}
.uit[aria-pressed=true]{border-color:#334155}.uit[aria-pressed=true]::before,.uit[aria-pressed=true] .st{opacity:1}
.uit[aria-pressed=true] .k{background:#e2e8f0}.uit[aria-pressed=true] .k .sun{opacity:0;transform:rotate(90deg) scale(.6)}.uit[aria-pressed=true] .k .moon{opacity:1;transform:rotate(0)}
.uit:active .k{width:calc(var(--h) - 2px)}
html.ui-anim *,html.ui-anim *::before,html.ui-anim *::after{transition:background-color .5s ease,color .4s ease,border-color .5s ease,fill .5s ease,box-shadow .5s ease!important}

/* ---------- عارض الصور ---------- */
.ulb{position:fixed;inset:0;z-index:100000;background:rgba(2,6,23,.92);display:flex;align-items:center;justify-content:center;overflow:hidden;touch-action:none;animation:ulbIn .2s ease;-webkit-tap-highlight-color:transparent}
@keyframes ulbIn{from{opacity:0}to{opacity:1}}
.ulb img{max-width:94vw;max-height:88vh;object-fit:contain;transform-origin:center;user-select:none;-webkit-user-drag:none;cursor:grab;will-change:transform;border-radius:6px;box-shadow:0 20px 60px rgba(0,0,0,.6)}
.ulb img.mv{cursor:grabbing}
.ulb .tb{position:absolute;top:12px;inset-inline:0;display:flex;justify-content:center;gap:8px;z-index:2;pointer-events:none}
.ulb .tb button{pointer-events:auto;width:42px;height:42px;border-radius:12px;border:0;background:rgba(255,255,255,.14);color:#fff;font-size:20px;font-weight:800;cursor:pointer;backdrop-filter:blur(6px);font-family:inherit}
.ulb .tb button:hover{background:rgba(255,255,255,.26)}
.ulb .ld{position:absolute;color:#cbd5e1;font:700 14px Cairo,sans-serif}
img.zi,.zoomable img,img[data-zoom]{cursor:zoom-in}

/* ---------- اللافتات ---------- */
#ubn-bars:empty,#ubn-cards:empty{display:none}
.ubn{position:relative;box-sizing:border-box;font-family:'Cairo',sans-serif;direction:rtl;line-height:1.7;--a:#fff}
.ubn *{box-sizing:border-box;font-family:inherit}
.ubn .ic{flex:none;font-size:1.5em;line-height:1}
.ubn .bd{flex:1;min-width:0}
.ubn .tx{font-weight:800;white-space:pre-line;word-break:break-word}
.ubn .cd{display:inline-flex;gap:6px;direction:ltr;vertical-align:middle;margin-inline-start:8px}
.ubn .cd span{display:inline-flex;flex-direction:column;align-items:center;min-width:46px;padding:3px 6px;border-radius:10px;background:rgba(0,0,0,.22);line-height:1.15}
.ubn .cd b{font-size:1.15em;font-variant-numeric:tabular-nums}.ubn .cd small{font-size:.62em;font-weight:700;opacity:.85}
.ubn .cdl{display:block;font-weight:700;opacity:.92;margin-bottom:2px;font-size:.9em}
.ubn .go{flex:none;display:inline-block;padding:7px 16px;border-radius:99px;border:0;background:var(--a);color:#111;font-weight:900;text-decoration:none;cursor:pointer;font-size:.9em;white-space:nowrap}
.ubn .x{flex:none;width:28px;height:28px;border-radius:50%;border:0;background:rgba(0,0,0,.25);color:inherit;font-size:16px;cursor:pointer;line-height:1;display:grid;place-items:center;padding:0}
.ubn .x:hover{background:rgba(0,0,0,.45)}
.ubn-s-s{font-size:12.5px}.ubn-s-m{font-size:15px}.ubn-s-l{font-size:18px}
.ubn-bar{display:flex;align-items:center;gap:12px;padding:10px 18px;flex-wrap:wrap}
.ubn-card{display:flex;align-items:center;gap:14px;padding:16px 18px;margin:0 0 16px;flex-wrap:wrap}
.ubn-popup-ov{position:fixed;inset:0;z-index:99990;background:rgba(2,6,23,.6);display:flex;align-items:center;justify-content:center;padding:18px;animation:ulbIn .25s ease}
.ubn-popup{display:flex;flex-direction:column;align-items:center;text-align:center;gap:12px;padding:28px 24px 22px;width:min(440px,100%);max-height:88vh;overflow:auto}
.ubn-popup .ic{font-size:2.6em}.ubn-popup .x{position:absolute;top:10px;inset-inline-end:10px}
.ubn-corner{position:fixed;z-index:99980;width:min(360px,calc(100vw - 24px));display:flex;align-items:flex-start;gap:12px;padding:14px 16px;margin:12px}
.ubn-corner.p-br{bottom:0;inset-inline-start:0}.ubn-corner.p-bl{bottom:0;inset-inline-end:0}.ubn-corner.p-tr{top:70px;inset-inline-start:0}.ubn-corner.p-tl{top:70px;inset-inline-end:0}
.ubn-sh{box-shadow:0 14px 34px -12px rgba(0,0,0,.55)}
.ubn-a-slide.ubn-bar,.ubn-a-slide.ubn-card{animation:ubnDown .55s cubic-bezier(.2,.9,.3,1.2) both}
.ubn-a-slide.ubn-corner{animation:ubnUp .55s cubic-bezier(.2,.9,.3,1.2) both}
.ubn-a-slide.ubn-popup{animation:ubnPop .5s cubic-bezier(.2,.9,.3,1.3) both}
.ubn-a-fade{animation:ulbIn .7s ease both}
.ubn-a-pulse{animation:ubnPulse 2.2s ease-in-out infinite}
.ubn.out{animation:ubnOut .3s ease forwards!important}
@keyframes ubnDown{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:none}}
@keyframes ubnUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes ubnPop{from{opacity:0;transform:scale(.88)}to{opacity:1;transform:none}}
@keyframes ubnPulse{0%,100%{filter:brightness(1)}50%{filter:brightness(1.14)}}
@keyframes ubnOut{to{opacity:0;transform:scale(.96);max-height:0;margin:0;padding-top:0;padding-bottom:0}}
@media(max-width:560px){.ubn-bar{padding:10px 12px}.ubn .cd span{min-width:40px}}
@media(prefers-reduced-motion:reduce){.ubn,.uit .k,.uit{animation:none!important;transition:none!important}}
`;
  const st = el('style'); st.id = 'ui-css'; st.textContent = CSS; (document.head || document.documentElement).appendChild(st);

  /* ---------------------------------------------------------------- الوضع الليلي */
  const SUN = '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2" fill="#fff7ed"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3 7 7M17 17l1.7 1.7M5.3 18.7 7 17M17 7l1.7-1.7"/></svg>';
  const MOON = '<svg class="moon" viewBox="0 0 24 24"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" fill="#475569"/></svg>';
  UI.theme = () => (document.body && document.body.getAttribute('data-theme')) || store.get('platform_theme') || 'light';
  UI.setTheme = function (t, animate) {
    t = t === 'dark' ? 'dark' : 'light';
    const root = document.documentElement;
    if (animate) { root.classList.add('ui-anim'); clearTimeout(UI._ta); UI._ta = setTimeout(() => root.classList.remove('ui-anim'), 650); }
    if (document.body) document.body.setAttribute('data-theme', t);
    store.set('platform_theme', t);
    document.querySelectorAll('.uit').forEach(b => { b.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false'); b.title = t === 'dark' ? 'الوضع الليلي (اضغط للنهاري)' : 'الوضع النهاري (اضغط لليلي)'; });
    if (typeof window.onThemeChange === 'function') { try { window.onThemeChange(t); } catch (e) {} }
  };
  UI.initTheme = function () {
    document.querySelectorAll('.uit').forEach(b => {
      if (b.dataset.ready) return; b.dataset.ready = '1';
      b.type = 'button'; b.setAttribute('role', 'switch'); b.setAttribute('aria-label', 'تغيير الوضع'); b.innerHTML = '<span class="st"></span><span class="k">' + SUN + MOON + '</span>';
      b.addEventListener('click', () => UI.setTheme(UI.theme() === 'dark' ? 'light' : 'dark', true));
    });
    UI.setTheme(store.get('platform_theme') || UI.theme(), false);
  };
  UI.themeToggleHTML = '<button class="uit" type="button"></button>';

  /* ---------------------------------------------------------------- عارض الصور */
  UI.zoom = function (src, alt) {
    if (!src || document.querySelector('.ulb')) return;
    const ov = el('div', 'ulb'), img = new Image(), ld = el('div', 'ld', 'جاري التحميل...'), tb = el('div', 'tb');
    ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'عرض الصورة');
    img.alt = alt || ''; img.draggable = false; img.style.opacity = '0';
    const mk = (t, f, ttl) => { const b = el('button', null, t); b.type = 'button'; b.title = ttl; b.addEventListener('click', e => { e.stopPropagation(); f(); }); return b; };
    let sc = 1, tx = 0, ty = 0;
    const apply = () => { img.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + sc + ')'; };
    const clamp = () => { if (sc <= 1) { tx = 0; ty = 0; } };
    const zoomTo = (n, cx, cy) => { n = Math.max(1, Math.min(6, n)); if (cx != null) { const r = img.getBoundingClientRect(), ox = cx - (r.left + r.width / 2), oy = cy - (r.top + r.height / 2), k = n / sc; tx -= ox * (k - 1); ty -= oy * (k - 1); } sc = n; clamp(); apply(); };
    const close = () => { ov.remove(); document.removeEventListener('keydown', onKey, true); document.body.style.overflow = UI._ov || ''; };
    const onKey = e => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); } else if (e.key === '+' || e.key === '=') zoomTo(sc * 1.3); else if (e.key === '-') zoomTo(sc / 1.3); else if (e.key === '0') { sc = 1; clamp(); apply(); } };
    tb.append(mk('＋', () => zoomTo(sc * 1.4), 'تكبير'), mk('－', () => zoomTo(sc / 1.4), 'تصغير'), mk('⟲', () => { sc = 1; tx = ty = 0; apply(); }, 'الحجم الأصلي'), mk('✕', close, 'إغلاق'));
    ov.append(ld, img, tb); document.body.appendChild(ov); UI._ov = document.body.style.overflow; document.body.style.overflow = 'hidden';
    img.onload = () => { ld.remove(); img.style.opacity = '1'; }; img.onerror = () => { ld.textContent = 'تعذر تحميل الصورة'; };
    img.src = src;
    ov.addEventListener('click', e => { if (e.target === ov) close(); });
    ov.addEventListener('wheel', e => { e.preventDefault(); zoomTo(sc * (e.deltaY < 0 ? 1.18 : 1 / 1.18), e.clientX, e.clientY); }, { passive: false });
    img.addEventListener('dblclick', e => { e.preventDefault(); if (sc > 1) { sc = 1; tx = ty = 0; apply(); } else zoomTo(2.5, e.clientX, e.clientY); });
    const ptr = new Map(); let d0 = 0, s0 = 1, lastTap = 0;
    img.addEventListener('pointerdown', e => { img.setPointerCapture(e.pointerId); ptr.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (ptr.size === 2) { const [a, b] = [...ptr.values()]; d0 = Math.hypot(a.x - b.x, a.y - b.y); s0 = sc; } img.classList.add('mv');
      if (e.pointerType === 'touch' && ptr.size === 1) { const n = Date.now(); if (n - lastTap < 300) { if (sc > 1) { sc = 1; tx = ty = 0; apply(); } else zoomTo(2.5, e.clientX, e.clientY); } lastTap = n; } });
    img.addEventListener('pointermove', e => { const p = ptr.get(e.pointerId); if (!p) return;
      if (ptr.size === 2) { ptr.set(e.pointerId, { x: e.clientX, y: e.clientY }); const [a, b] = [...ptr.values()]; zoomTo(s0 * Math.hypot(a.x - b.x, a.y - b.y) / (d0 || 1)); }
      else if (sc > 1) { tx += e.clientX - p.x; ty += e.clientY - p.y; ptr.set(e.pointerId, { x: e.clientX, y: e.clientY }); apply(); } });
    const up = e => { ptr.delete(e.pointerId); if (!ptr.size) img.classList.remove('mv'); };
    img.addEventListener('pointerup', up); img.addEventListener('pointercancel', up);
    document.addEventListener('keydown', onKey, true);
  };
  // أي صورة معلّمة (img.zi أو [data-zoom] أو جوه .zoomable) بتتفتح هنا بدل ما تفتح رابط التخزين
  document.addEventListener('click', function (e) {
    const t = e.target; if (!t || t.tagName !== 'IMG') return;
    if (!(t.matches('img.zi, img[data-zoom], img.qi') || t.closest('.zoomable'))) return;
    if (t.closest('.ulb') || t.closest('.ubn')) return;
    e.preventDefault(); e.stopPropagation(); UI.zoom(t.currentSrc || t.src, t.alt);
  }, true);

  /* ---------------------------------------------------------------- ضغط الصور */
  // UI.compress(file, {maxSide, maxKB}) → Promise<Blob>  (JPEG). الـGIF/SVG بيرجعوا زي ما هم.
  UI.compress = async function (file, o) {
    o = Object.assign({ maxSide: 1400, maxKB: 300, minSide: 600 }, o || {});
    if (!file || !/^image\//.test(file.type) || /gif|svg/.test(file.type)) return file;
    const bmp = await new Promise((res, rej) => { const u = URL.createObjectURL(file), i = new Image(); i.onload = () => { URL.revokeObjectURL(u); res(i); }; i.onerror = () => { URL.revokeObjectURL(u); rej(new Error('الملف مش صورة صالحة')); }; i.src = u; });
    let side = o.maxSide, q = .86, blob = null;
    for (let i = 0; i < 8; i++) {
      const k = Math.min(1, side / Math.max(bmp.width, bmp.height)), c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(bmp.width * k)); c.height = Math.max(1, Math.round(bmp.height * k));
      const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.imageSmoothingQuality = 'high'; x.drawImage(bmp, 0, 0, c.width, c.height);
      blob = await new Promise(r => c.toBlob(r, 'image/jpeg', q));
      if (!blob || blob.size <= o.maxKB * 1024) break;
      if (i % 2 === 0) q = Math.max(.5, q - .1); else side = Math.max(o.minSide, Math.round(side * .85));
    }
    return blob && blob.size < file.size ? blob : (blob && file.size > o.maxKB * 1024 ? blob : file);
  };
  UI.fmtKB = n => n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.round(n / 1024) + ' KB';

  /* ---------------------------------------------------------------- اللافتات */
  const B = UI.banners = { items: [], timers: [], skew: 0, client: null, page: 'home', course: null, paused: false, mount: {} };
  const pad = n => String(n).padStart(2, '0');
  const dismissedLocal = b => {
    const k = 'ubn_' + b.id + '_' + b.version;
    if (b.dismiss_mode === 'session') return store.get(k, true) === '1';
    const v = store.get('d_' + k);
    if (b.dismiss_mode === 'daily') return v === new Date().toDateString();
    return v === '1';
  };
  const markDismissed = b => {
    const k = 'ubn_' + b.id + '_' + b.version;
    if (b.dismiss_mode === 'session') store.set(k, '1', true);
    else if (b.dismiss_mode === 'daily') store.set('d_' + k, new Date().toDateString());
    else { store.set('d_' + k, '1'); try { if (B.client) B.client.rpc('dismiss_banner', { p_id: b.id }); } catch (e) {} }
  };
  // بيبني عنصر لافتة. opts.preview = معاينة في لوحة التحكم (من غير تخزين/إغلاق حقيقي)
  UI.bannerEl = function (b, opts) {
    opts = opts || {}; const L = b.layout || 'bar';
    const safe = !!b.dismissible || !!b.auto_close || !!b.countdown_to || L === 'bar' || L === 'card' || L === 'corner';     // النافذة المنبثقة لازم يبقى ليها مخرج
    const dismissible = !!b.dismissible || (!safe && L === 'popup');
    const root = el('div', 'ubn ubn-' + L + ' ubn-s-' + (b.size || 'm') + (b.animation && b.animation !== 'none' ? ' ubn-a-' + b.animation : '') + (b.shadow ? ' ubn-sh' : '') + (L === 'corner' ? ' p-' + (b.position || 'br') : ''));
    root.style.background = b.bg2 ? 'linear-gradient(135deg,' + b.bg + ',' + b.bg2 + ')' : (b.bg || '#ef4444');
    root.style.color = b.fg || '#fff'; root.style.setProperty('--a', b.accent || '#fff');
    root.style.borderRadius = (L === 'bar' && !opts.preview ? Math.min(+b.radius || 0, 0) : (+b.radius || 0)) + 'px';
    if (L === 'bar' && opts.preview) root.style.borderRadius = (+b.radius || 0) + 'px';
    if (opts.preview) { root.style.position = 'relative'; root.style.inset = 'auto'; root.style.margin = '0 auto'; if (L === 'corner') { root.style.width = 'min(360px,100%)'; } }
    let h = '';
    if (b.icon) h += '<span class="ic">' + esc(b.icon) + '</span>';
    h += '<div class="bd">' + (b.countdown_to && b.countdown_label ? '<span class="cdl">' + esc(b.countdown_label) + '</span>' : '') + (b.body ? '<span class="tx">' + esc(b.body) + '</span>' : '') + (b.countdown_to ? '<span class="cd"></span>' : '') + '</div>';
    if (b.btn_text && b.btn_url) h += '<a class="go" href="' + esc(b.btn_url) + '"' + (/^https:/.test(b.btn_url) ? ' target="_blank" rel="noopener"' : '') + '>' + esc(b.btn_text) + '</a>';
    if (dismissible) h += '<button class="x" type="button" aria-label="إغلاق">✕</button>';
    root.innerHTML = h;
    const cd = $('.cd', root), tickers = [];
    const done = () => {
      if (!cd) return;
      if (b.after_zero === 'text') { const bd = $('.bd', root); bd.innerHTML = '<span class="tx">' + esc(b.countdown_done || '') + '</span>'; }
      else if (!opts.preview) B.remove(b, root, false);
    };
    if (cd) {
      const end = new Date(b.countdown_to).getTime();
      const draw = () => {
        let s = Math.floor((end - (Date.now() + (opts.skew != null ? opts.skew : B.skew))) / 1000);
        if (s <= 0) { done(); return false; }
        const d = Math.floor(s / 86400), hh = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), ss = s % 60;
        cd.innerHTML = (d > 0 ? '<span><b>' + d + '</b><small>يوم</small></span>' : '') + '<span><b>' + pad(hh) + '</b><small>ساعة</small></span><span><b>' + pad(m) + '</b><small>دقيقة</small></span><span><b>' + pad(ss) + '</b><small>ثانية</small></span>';
        return true;
      };
      if (draw()) { const t = setInterval(() => { if (!root.isConnected || !draw()) clearInterval(t); }, 1000); tickers.push(t); root._t = tickers; }
    }
    const x = $('.x', root); if (x) x.addEventListener('click', () => { if (opts.preview) return; B.remove(b, root, true); });
    root._dismissible = dismissible; return root;
  };
  B.remove = function (b, node, user) {
    if (user) markDismissed(b);
    const ov = node.closest('.ubn-popup-ov') || node;
    ov.classList.add('out'); node.classList.add('out'); setTimeout(() => ov.remove(), 320);
    (node._t || []).forEach(clearInterval);
  };
  B.hideAll = function () { B.paused = true; document.querySelectorAll('.ubn, .ubn-popup-ov').forEach(n => n.remove()); };
  B.show = function (b) {
    if (dismissedLocal(b)) return;
    let L = b.layout;
    if (B.page === 'quiz' && (L === 'popup' || L === 'card')) L = 'bar';          // ما نقطعش على الطالب وهو بيمتحن
    b = Object.assign({}, b, { layout: L });
    const n = UI.bannerEl(b);
    if (L === 'bar') { let c = $('#ubn-bars'); if (!c) { c = el('div'); c.id = 'ubn-bars'; const h = $(B.mount.bar || 'header.hdr, .hdr, header'); if (h && h.parentNode) h.parentNode.insertBefore(c, h.nextSibling); else document.body.insertBefore(c, document.body.firstChild); } c.appendChild(n); }
    else if (L === 'card') { let c = $('#ubn-cards'); if (!c) { c = el('div'); c.id = 'ubn-cards'; const host = $(B.mount.card || '.main'); if (host) host.insertBefore(c, host.firstChild); else { const m = $('main, #root'); if (m && m.parentNode) m.parentNode.insertBefore(c, m); else document.body.appendChild(c); } } c.appendChild(n); }
    else if (L === 'popup') { const ov = el('div', 'ubn-popup-ov'); ov.appendChild(n); document.body.appendChild(ov); if (n._dismissible) { ov.addEventListener('click', e => { if (e.target === ov) B.remove(b, n, true); }); } }
    else document.body.appendChild(n);
    if (b.auto_close) setTimeout(() => { if (n.isConnected) B.remove(b, n, false); }, b.auto_close * 1000);
  };
  // UI.banners.init(supabaseClient, 'home' | 'course' | 'quiz', courseId?, {bar:'selector', card:'selector'})
  B.init = async function (client, page, course, mount) {
    B.client = client; B.page = page; B.course = course || null; B.mount = mount || {};
    if (!client) return;
    try {
      // لازم نستنى الجلسة تتحمّل — لو اتنادى قبلها السيرفر بيرجّع قايمة فاضية (وده كان بيخلّي اللافتات "تختفي")
      let uid = null;
      try { const s = await client.auth.getSession(); uid = s && s.data && s.data.session && s.data.session.user && s.data.session.user.id; } catch (e) {}
      if (!uid) return;
      const ck = 'ubn_cache_' + uid + '_' + page + '_' + (course || ''), c = store.get(ck, true); let data = null, skew = 0;
      if (c) { try { const j = JSON.parse(c); if (Date.now() - j.t < 15000 && j.d && (j.d.items || []).length) { data = j.d; skew = j.s || 0; } } catch (e) {} }
      if (!data) {
        const r = await client.rpc('my_banners', { p_page: page, p_course: course || null });
        if (r.error || !r.data) return; data = r.data; skew = data.now ? new Date(data.now).getTime() - Date.now() : 0;
        if ((data.items || []).length) store.set(ck, JSON.stringify({ t: Date.now(), d: data, s: skew }), true);   // القايمة الفاضية ما بتتخزنش أبداً
      }
      B.skew = skew;
      B.items = data.items || [];
      if (!B.paused) B.items.forEach(B.show);
    } catch (e) { /* اللافتات اختيارية — أي خطأ ما يوقفش الصفحة */ }
  };

  document.addEventListener('DOMContentLoaded', () => UI.initTheme());
  if (document.readyState !== 'loading') UI.initTheme();
})();
