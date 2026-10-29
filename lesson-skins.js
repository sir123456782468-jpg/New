/* =====================================================================
   lesson-skins.js — أشكال صفحة الكورس وصفحة المحاضرة
   (classic = الشكل القديم، sakr = على طريقة منصات الكورسات ذات القوائم الجانبية،
    gohary = صفوف تفصيلية بوصف وإحصائيات، nova = تصميم خاص بالمنصة)
   بيستخدمه course.html (بيانات حقيقية) و lesson-preview.html (بيانات تجريبية للمعاينة الحيّة)
   فالمعاينة هي نفس الكود بالظبط.
   ===================================================================== */
(function () {
  'use strict';
  var L = window.LSK = {};
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var HEX = /^#[0-9a-fA-F]{6}$/;

  /* ---------- الإعدادات الافتراضية لكل شكل ---------- */
  var FLAGS = ['desc_top', 'item_desc', 'stats', 'progress', 'numbers', 'sticky_player', 'confetti'];
  var SK = {
    classic: { n: 'الشكل القديم', alt: { bg: '#0a1020', ink: '#f1f5f9' }, c1: '#ef4444', c2: '#ec4899', c3: '#ef4444', bg: '#f4f6fb', ink: '#0f172a', r: 16, f: {} },
    sakr: { n: 'شكل القوائم الجانبية', alt: { bg: '#0d1712', ink: '#e6f2ea' }, c1: '#1f9d55', c2: '#15803d', c3: '#ef4444', bg: '#f1f3f6', ink: '#1f2937', r: 12, f: { desc_top: false, item_desc: false, stats: false, progress: true, numbers: false, sticky_player: false, confetti: false } },
    gohary: { n: 'شكل الصفوف التفصيلية', alt: { bg: '#10151c', ink: '#e5e7eb' }, c1: '#2e9e5b', c2: '#1f7a45', c3: '#f59e0b', bg: '#f5f6f8', ink: '#111827', r: 10, f: { desc_top: true, item_desc: true, stats: true, progress: false, numbers: false, sticky_player: false, confetti: false } },
    cinema: { n: 'سينما', alt: { bg: '#f7f3ea', ink: '#17171f' }, c1: '#f5b301', c2: '#ff7a00', c3: '#e11d48', bg: '#0b0b10', ink: '#f5f5f7', r: 10, own: 1, f: { desc_top: false, item_desc: true, stats: true, progress: true, numbers: true, sticky_player: true, confetti: false } },
    paper: { n: 'الكراسة', alt: { bg: '#1c1710', ink: '#efe3c8' }, c1: '#b4452c', c2: '#d98e04', c3: '#2f6f5e', bg: '#f5eedc', ink: '#3b2f20', r: 6, cm: 0.55, f: { desc_top: true, item_desc: true, stats: false, progress: false, numbers: true, sticky_player: false, confetti: false } },
    quest: { n: 'التحدّي', alt: { bg: '#0e1640', ink: '#e6ecff' }, c1: '#3b82f6', c2: '#8b5cf6', c3: '#f59e0b', bg: '#eaf3ff', ink: '#1b2559', r: 20, f: { desc_top: false, item_desc: true, stats: false, progress: true, numbers: false, sticky_player: false, confetti: true } },
    bento: { n: 'بنتو', alt: { bg: '#eef1f8', ink: '#0f172a' }, c1: '#ef4444', c2: '#ec4899', c3: '#38bdf8', bg: '#0a1020', ink: '#f1f5f9', r: 22, own: 1, f: { desc_top: true, item_desc: true, stats: true, progress: true, numbers: true, sticky_player: true, confetti: true } },
    mag: { n: 'مجلة', alt: { bg: '#0c0d12', ink: '#f4f4f8' }, c1: '#ef4444', c2: '#ec4899', c3: '#0f2a6b', bg: '#fbfbfd', ink: '#0f172a', r: 4, f: { desc_top: true, item_desc: true, stats: false, progress: false, numbers: true, sticky_player: false, confetti: false } },
    nova: { n: 'نوفا (تصميم المنصة)', alt: { bg: '#f3f4fb', ink: '#14172e' }, c1: '#8b5cf6', c2: '#ec4899', c3: '#22d3ee', bg: '#070b18', ink: '#f1f5f9', r: 22, f: { desc_top: true, item_desc: true, stats: true, progress: true, numbers: true, sticky_player: true, confetti: true } }
  };
  L.SKINS = SK; L.FLAGS = FLAGS;
  var LBL = { lbl_watch: 'مشاهدة', lbl_file: 'فتح الملف', lbl_quiz: 'ابدأ الامتحان', lbl_hw: 'حل الواجب', lbl_side: 'محتوى الكورس', lbl_desc: 'وصف المحاضرة' };
  L.LBL = LBL;

  /* cfg الخام (من السيرفر: المفاتيح الموجودة بس) → إعدادات فعلية كاملة */
  L.clean = function (raw, dark) {
    raw = raw || {}; var sk = SK[raw.skin] ? raw.skin : 'classic', d = SK[sk], c = { skin: sk };
    ['c1', 'c2', 'c3'].forEach(function (k) { c[k] = HEX.test(raw[k] || '') ? raw[k].toLowerCase() : d[k]; });
    var natDark = lum(d.bg) < 0.42, want = !!dark, same = natDark === want, base = same ? d : (d.alt || d);
    var userBg = HEX.test(raw.bg || '') && (lum(raw.bg) < 0.42) === want, userInk = HEX.test(raw.ink || '') && (lum(raw.ink) < 0.5) !== want;
    c.bg = userBg ? raw.bg.toLowerCase() : base.bg;
    c.ink = userInk ? raw.ink.toLowerCase() : base.ink;
    c.dark = want;
    FLAGS.forEach(function (k) { c[k] = typeof raw[k] === 'boolean' ? raw[k] : !!d.f[k]; });
    var r = +raw.radius; c.radius = isFinite(r) && raw.radius !== undefined && raw.radius !== null ? Math.max(4, Math.min(34, r)) : d.r;
    Object.keys(LBL).forEach(function (k) { var v = typeof raw[k] === 'string' ? raw[k].trim() : ''; c[k] = v ? v.slice(0, 40) : LBL[k]; });
    return c;
  };

  /* ---------- ألوان ---------- */
  function rgb(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  function lum(h) { var a = rgb(h); return (0.299 * a[0] + 0.587 * a[1] + 0.114 * a[2]) / 255; }
  function mix(a, b, t) { var x = rgb(a), y = rgb(b), o = x.map(function (v, i) { return Math.round(v + (y[i] - v) * t); }); return '#' + o.map(function (v) { return ('0' + v.toString(16)).slice(-2); }).join(''); }
  function lin(v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
  function lum2(h) { var a = rgb(h); return 0.2126 * lin(a[0]) + 0.7152 * lin(a[1]) + 0.0722 * lin(a[2]); }
  function cr(a, b) { var x = lum2(a), y = lum2(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  /* لون نص مقروء من لون العلامة على الخلفية (بيقرّبه للون النص لحد ما التباين يبقى كويس) */
  function readable(col, bg, ink) { var t = 0, o = col; while (t <= 1 && cr(o, bg) < 4.5) { t += 0.1; o = mix(col, ink, t); } return o; }
  function tokens(c) {
    var dk = c.dark != null ? !!c.dark : lum(c.bg) < 0.42, nova = c.skin === 'nova', cm = (SK[c.skin] || {}).cm;
    return {
      '--k1': c.c1, '--k2': c.c2, '--k3': c.c3, '--kb': c.bg, '--ki': c.ink, '--kr': c.radius + 'px',
      '--kc': dk ? mix(c.bg, '#ffffff', nova ? 0.07 : 0.06) : (cm ? mix(c.bg, '#ffffff', cm) : '#ffffff'),
      '--kl': dk ? mix(c.bg, '#ffffff', 0.14) : mix(c.bg, c.ink, 0.1),
      '--km': mix(c.ink, c.bg, 0.42),
      '--kt': lum(c.c1) > 0.66 ? '#0f172a' : '#ffffff',
      '--kg': 'linear-gradient(135deg,' + c.c1 + ',' + c.c2 + ')',
      '--kh': readable(c.c3, c.bg, c.ink),
      '--kp': readable(c.c1, c.bg, c.ink),
      '--kd': dk ? '1' : '0'
    };
  }

  /* ---------- CSS ---------- */
  var CSS = '' +
    'body[data-skin]{--bg:var(--kb);--card:var(--kc);--ink:var(--ki);--line:var(--kl);--muted:var(--km);--brand:var(--k1);--grad:var(--kg);background:var(--kb);color:var(--ki)}' +
    'body[data-skin] .btn{border-radius:calc(var(--kr)*.7);color:var(--kt)}body[data-skin] .btn.g{background:transparent;color:var(--kp);border-color:var(--k1)}' +
    'body[data-skin] .idesc small,body[data-skin] .sec,body[data-skin] .brand small{color:var(--kp)}body[data-skin] .btn.g{color:var(--kp)}' +
    'body[data-skin] .card{border-radius:var(--kr)}body[data-skin] .vwrap{border-radius:var(--kr)}' +
    '.lk{max-width:1180px;margin:0 auto;position:relative}.lk *{box-sizing:border-box}.lk a{color:inherit;text-decoration:none}' +
    '.lk h1{font-size:26px;font-weight:900;line-height:1.5}.lk-sub{color:var(--km);font-weight:700;font-size:13.5px}' +
    '.lk-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;border:2px solid var(--k1);cursor:pointer;font:800 13.5px Cairo,sans-serif;padding:9px 22px;border-radius:calc(var(--kr)*.7);background:var(--k1);color:var(--kt);white-space:nowrap;transition:.18s}.lk-btn:hover{filter:brightness(1.07);transform:translateY(-1px)}' +
    '.lk-btn.o{background:transparent;color:var(--kp)}.lk-btn.lg{padding:13px 26px;font-size:15.5px;width:100%}' +
    '.lk-bar{height:9px;border-radius:9px;background:var(--kl);overflow:hidden}.lk-bar i{display:block;height:100%;background:var(--kg);border-radius:9px;transition:width .8s}' +
    '.lk-ring{--p:0;width:104px;height:104px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--k1) calc(var(--p)*1%),var(--kl) 0);position:relative;flex:none}.lk-ring:before{content:"";position:absolute;inset:9px;border-radius:50%;background:var(--kc)}.lk-ring b{position:relative;font-size:21px;font-weight:900}' +
    '.lk-chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.lk-chips span{font-weight:800;font-size:12.5px;padding:5px 12px;border-radius:50px;background:var(--kc);border:1px solid var(--kl)}' +
    '.lk-gh{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;border:0;background:none;color:inherit;font:800 15px Cairo,sans-serif;cursor:pointer;padding:14px 16px;text-align:start}.lk-gh i{font-style:normal;transition:.2s;flex:none}.lk-grp.open>.lk-gh i{transform:rotate(180deg)}.lk-gc{margin-inline-start:auto;font-size:12.5px;font-weight:800;color:var(--km);flex:none}' +
    '.lk-gb{display:none}.lk-grp.open>.lk-gb{display:block}' +
    '.lk-r{position:relative;display:flex;align-items:center;gap:12px;padding:12px 14px;cursor:pointer;font-weight:700;overflow:hidden;transition:.18s}.lk-ri{flex:none;width:34px;height:34px;border-radius:calc(var(--kr)*.6);display:grid;place-items:center;background:var(--kl);font-size:15px;font-weight:900}.lk-r.seen .lk-ri{background:var(--k1);color:var(--kt)}' +
    '.lk-rt{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.lk-rt b{font-size:14.5px;line-height:1.7}.lk-rt small{color:var(--km);font-weight:700;font-size:12px}.lk-rd{font-style:normal;color:var(--km);font-weight:600;font-size:13px;line-height:1.8;white-space:pre-line}' +
    '.lk-rs{display:flex;gap:6px 14px;flex-wrap:wrap;font-size:12px;font-weight:700;color:var(--km)}.lk-rs s{text-decoration:none;white-space:nowrap}' +
    '.lk-ra{flex:none}.lk-b{display:inline-block;padding:7px 18px;border-radius:calc(var(--kr)*.6);background:var(--k1);color:var(--kt);font-weight:800;font-size:13px}.lk-r.lk .lk-b{background:var(--kl);color:var(--km)}' +
    '.lk-pr{position:absolute;bottom:0;right:0;height:3px;background:var(--k3);border-radius:3px;transition:width .6s}' +
    '.lk-desc{padding:15px 18px;border-radius:var(--kr);background:var(--kc);border:1px solid var(--kl);line-height:2;font-weight:600;white-space:pre-line;margin:0 0 14px}.lk-desc small{display:block;font-weight:900;color:var(--kp);margin-bottom:3px;font-size:12.5px}' +
    '.lk-top{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:16px}.lk-top small{display:block;color:var(--km);font-weight:800;font-size:13px}' +
    '.lk-body{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:18px;align-items:start}.lk-side{background:var(--kc);border:1px solid var(--kl);border-radius:var(--kr);overflow:hidden}.lk-sh{padding:14px 16px;font-weight:900;font-size:16px;border-bottom:1px solid var(--kl)}' +
    '.lk-pn{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:16px}' +
    '.lk-demo-pl{aspect-ratio:16/9;border-radius:var(--kr);background:linear-gradient(135deg,#0f172a,#1e293b);display:grid;place-items:center;color:#fff;font-weight:800;text-align:center;line-height:2}.lk-demo-pl i{display:grid;place-items:center;width:68px;height:68px;border-radius:50%;background:var(--k1);color:var(--kt);font-style:normal;font-size:26px;margin:0 auto 6px}' +
    '@media(max-width:900px){.lk-body{grid-template-columns:1fr}.lk-side{order:2}.lk h1{font-size:21px}.lk-cgrid{grid-template-columns:1fr!important}.lk-cover{order:-1;position:static!important}body[data-sticky="1"] #player .vwrap{position:sticky;top:60px;z-index:8}}' +
    /* ---------- sakr ---------- */
    'body[data-skin=sakr] .lk-cgrid{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:20px;align-items:start}' +
    'body[data-skin=sakr] .lk-cover{position:sticky;top:78px}body[data-skin=sakr] .lk-cv{background:var(--kc);border:1px solid var(--kl);border-radius:var(--kr);overflow:hidden;box-shadow:0 8px 24px -14px rgba(0,0,0,.3)}' +
    'body[data-skin=sakr] .lk-img{height:150px;background:linear-gradient(135deg,var(--k2),var(--k1));display:grid;place-items:center;font-size:54px}body[data-skin=sakr] .lk-cvb{padding:16px;display:flex;flex-direction:column;gap:12px}body[data-skin=sakr] .lk-cvb h3{font-size:17px;line-height:1.6}' +
    'body[data-skin=sakr] .lk-cvb ul{list-style:none;display:grid;gap:8px;font-weight:700;font-size:13.5px;color:var(--km)}body[data-skin=sakr] .lk-cvb ul b{color:var(--ki)}' +
    'body[data-skin=sakr] .lk-grp{background:var(--kc);border:1px solid var(--kl);border-radius:var(--kr);margin-bottom:12px;overflow:hidden}body[data-skin=sakr] .lk-grp>.lk-gh{background:color-mix(in srgb,var(--k1) 7%,var(--kc))}' +
    'body[data-skin=sakr] .lk-r{border-top:1px solid var(--kl)}body[data-skin=sakr] .lk-r:hover{background:color-mix(in srgb,var(--k1) 6%,var(--kc))}body[data-skin=sakr] .lk-r.on{background:color-mix(in srgb,var(--k1) 11%,var(--kc));box-shadow:inset -4px 0 0 var(--k1)}' +
    'body[data-skin=sakr] .lk-ri{border-radius:50%}body[data-skin=sakr] .lk-side .lk-gh{font-size:14.5px;border-top:1px solid var(--kl)}body[data-skin=sakr] .lk-side .lk-grp:first-child>.lk-gh{border-top:0}' +
    /* ---------- gohary ---------- */
    'body[data-skin=gohary] .lk-hd{background:var(--kc);border:1px solid var(--kl);border-radius:var(--kr);padding:18px 20px;margin-bottom:16px;border-inline-start:6px solid var(--k1)}' +
    'body[data-skin=gohary] .lk-gl{background:var(--kc);border:1px solid var(--kl);border-radius:var(--kr);margin-bottom:16px;overflow:hidden}body[data-skin=gohary] .lk-glh{display:flex;align-items:center;gap:14px;padding:16px 18px;border-bottom:1px solid var(--kl);flex-wrap:wrap}' +
    'body[data-skin=gohary] .lk-gn{flex:none;width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:var(--k1);color:var(--kt);font-weight:900}body[data-skin=gohary] .lk-glh h3{font-size:17px;line-height:1.6}body[data-skin=gohary] .lk-gd{color:var(--km);font-weight:600;font-size:13.5px;line-height:1.9}' +
    'body[data-skin=gohary] .lk-glh>div{flex:1;min-width:200px}body[data-skin=gohary] .lk-r{border-bottom:1px solid var(--kl);padding:15px 18px;align-items:flex-start}body[data-skin=gohary] .lk-r:last-child{border-bottom:0}body[data-skin=gohary] .lk-r.on{background:color-mix(in srgb,var(--k1) 8%,var(--kc))}body[data-skin=gohary] .lk-ra{align-self:center}' +
    'body[data-skin=gohary] .lk-ri{border-radius:10px;background:color-mix(in srgb,var(--k1) 14%,var(--kc))}body[data-skin=gohary] .lk-rs{margin-top:4px}body[data-skin=gohary] .lk-rs s{background:var(--kl);padding:2px 10px;border-radius:50px}' +
    'body[data-skin=gohary] .lk-body{grid-template-columns:1fr}body[data-skin=gohary] .lk-side{margin-top:6px}body[data-skin=gohary] .lk-sh{background:color-mix(in srgb,var(--k1) 8%,var(--kc))}body[data-skin=gohary] .lk-grp:not(.cur){display:none}body[data-skin=gohary] .lk-grp.cur>.lk-gh{display:none}body[data-skin=gohary] .lk-grp.cur>.lk-gb{display:block}' +
    /* ---------- nova ---------- */
    'body[data-skin=nova]{overflow-x:hidden}body[data-skin=nova]:before,body[data-skin=nova]:after{content:"";position:fixed;z-index:0;width:60vmax;height:60vmax;border-radius:50%;filter:blur(90px);opacity:calc(.13 + var(--kd,1)*.21);pointer-events:none;animation:lkf 22s ease-in-out infinite alternate}' +
    'body[data-skin=nova]:before{top:-20vmax;right:-14vmax;background:var(--k1)}body[data-skin=nova]:after{bottom:-24vmax;left:-16vmax;background:var(--k2);animation-delay:-9s}@keyframes lkf{to{transform:translate(6vmax,5vmax) scale(1.12)}}' +
    'body[data-skin=nova] .wrap,body[data-skin=nova] .hdr{position:relative;z-index:1}body[data-skin=nova] .hdr{background:color-mix(in srgb,var(--kb) 70%,transparent);backdrop-filter:blur(14px);position:sticky}' +
    'body[data-skin=nova] .lk h1{background:linear-gradient(90deg,var(--ki),var(--kh));-webkit-background-clip:text;background-clip:text;color:transparent}' +
    'body[data-skin=nova] .lk-hero{display:flex;align-items:center;gap:22px;flex-wrap:wrap;padding:26px;border-radius:calc(var(--kr)*1.3);background:linear-gradient(135deg,color-mix(in srgb,var(--k1) 22%,transparent),color-mix(in srgb,var(--k2) 14%,transparent));border:1px solid color-mix(in srgb,var(--k1) 45%,transparent);box-shadow:0 20px 60px -24px var(--k1);backdrop-filter:blur(10px);margin-bottom:24px}' +
    'body[data-skin=nova] .lk-hero>div:first-child{flex:1;min-width:230px}body[data-skin=nova] .lk-ring{width:132px;height:132px;background:conic-gradient(var(--k3) calc(var(--p)*1%),color-mix(in srgb,var(--ki) 12%,transparent) 0);box-shadow:0 0 34px -6px var(--k3)}body[data-skin=nova] .lk-ring:before{inset:11px;background:var(--kb)}body[data-skin=nova] .lk-ring b{font-size:26px}' +
    'body[data-skin=nova] .lk-btn{background:var(--kg);border:0;box-shadow:0 10px 26px -10px var(--k1);position:relative;overflow:hidden}body[data-skin=nova] .lk-btn:after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 35%,rgba(255,255,255,.35) 50%,transparent 65%);transform:translateX(120%);transition:.6s}body[data-skin=nova] .lk-btn:hover:after{transform:translateX(-120%)}' +
    'body[data-skin=nova] .lk-btn.o{background:transparent;border:1.5px solid var(--k1);box-shadow:none}' +
    'body[data-skin=nova] .lk-chips span{background:color-mix(in srgb,var(--ki) 7%,transparent);backdrop-filter:blur(6px)}' +
    'body[data-skin=nova] .lk-path{position:relative;padding-inline-start:46px}body[data-skin=nova] .lk-path:before{content:"";position:absolute;inset-inline-start:17px;top:6px;bottom:6px;width:3px;border-radius:3px;background:linear-gradient(var(--k1),var(--k2),var(--k3));opacity:.55}' +
    'body[data-skin=nova] .lk-chap{font-weight:900;font-size:13px;letter-spacing:.3px;color:var(--kh);margin:6px 0 12px;position:relative}' +
    'body[data-skin=nova] .lk-nd{position:relative;margin-bottom:16px;padding:16px 18px;border-radius:var(--kr);background:color-mix(in srgb,var(--ki) 5%,transparent);border:1px solid color-mix(in srgb,var(--ki) 12%,transparent);backdrop-filter:blur(12px);cursor:pointer;transition:.25s;display:flex;gap:14px;align-items:center;flex-wrap:wrap}' +
    'body[data-skin=nova] .lk-nd:hover{transform:translateX(-4px);border-color:var(--k1);box-shadow:0 14px 40px -18px var(--k1)}body[data-skin=nova] .lk-nd:before{content:attr(data-n);position:absolute;inset-inline-start:-46px;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:50%;display:grid;place-items:center;font-weight:900;background:var(--kb);border:2px solid var(--k1);color:var(--kp);box-shadow:0 0 18px -2px var(--k1)}' +
    'body[data-skin=nova] .lk-nd.dn:before{content:"✓";background:var(--k3);border-color:var(--k3);color:#04101a;box-shadow:0 0 18px -2px var(--k3)}body[data-skin=nova] .lk-nd.cur{border-color:var(--k3);box-shadow:0 0 0 1px var(--k3),0 16px 44px -16px var(--k3)}body[data-skin=nova] .lk-nd.cur:before{animation:lkp 1.8s infinite}@keyframes lkp{50%{box-shadow:0 0 0 9px transparent,0 0 22px 2px var(--k1)}}' +
    'body[data-skin=nova] .lk-nd.lk{opacity:.55;cursor:default}body[data-skin=nova] .lk-nd.lk:hover{transform:none;border-color:color-mix(in srgb,var(--ki) 12%,transparent);box-shadow:none}body[data-skin=nova] .lk-nt{flex:1;min-width:200px}body[data-skin=nova] .lk-nt b{font-size:16px;display:block;line-height:1.6}body[data-skin=nova] .lk-nt small{color:var(--km);font-weight:700}' +
    'body[data-skin=nova] .lk-dots{display:flex;gap:5px;margin-top:8px;flex-wrap:wrap}body[data-skin=nova] .lk-dots i{width:9px;height:9px;border-radius:50%;background:color-mix(in srgb,var(--ki) 18%,transparent)}body[data-skin=nova] .lk-dots i.d{background:var(--k3);box-shadow:0 0 8px var(--k3)}' +
    'body[data-skin=nova] .lk-desc,body[data-skin=nova] .lk-side{background:color-mix(in srgb,var(--ki) 5%,transparent);border:1px solid color-mix(in srgb,var(--ki) 12%,transparent);backdrop-filter:blur(12px)}body[data-skin=nova] .lk-desc small{color:var(--kh)}' +
    'body[data-skin=nova] .lk-sh{border-color:color-mix(in srgb,var(--ki) 12%,transparent);background:linear-gradient(90deg,color-mix(in srgb,var(--k1) 22%,transparent),transparent)}body[data-skin=nova] .lk-grp>.lk-gh{border-top:1px solid color-mix(in srgb,var(--ki) 10%,transparent)}' +
    'body[data-skin=nova] .lk-r{border-top:1px solid color-mix(in srgb,var(--ki) 8%,transparent)}body[data-skin=nova] .lk-r:hover{background:color-mix(in srgb,var(--k1) 12%,transparent)}body[data-skin=nova] .lk-r.on{background:linear-gradient(90deg,color-mix(in srgb,var(--k1) 26%,transparent),transparent);box-shadow:inset -3px 0 0 var(--k3)}' +
    'body[data-skin=nova] .lk-ri{border-radius:12px;background:color-mix(in srgb,var(--ki) 10%,transparent)}body[data-skin=nova] .lk-r.seen .lk-ri{background:var(--k3);color:#04101a;box-shadow:0 0 14px -2px var(--k3)}body[data-skin=nova] .lk-b{background:var(--kg);box-shadow:0 8px 18px -8px var(--k1)}body[data-skin=nova] .lk-r.lk .lk-b{background:color-mix(in srgb,var(--ki) 10%,transparent);box-shadow:none}' +
    'body[data-skin=nova] #player .vwrap,body[data-skin=nova] .lk-demo-pl{box-shadow:0 30px 80px -30px var(--k1),0 0 0 1px color-mix(in srgb,var(--k1) 40%,transparent)}' +
    'body[data-skin=nova] .lk-ex,body[data-skin=sakr] .lk-ex,body[data-skin=gohary] .lk-ex{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:14px 16px;border:1px solid var(--kl);background:var(--kc);border-radius:var(--kr);margin-bottom:10px;font-weight:800;cursor:pointer}' +
    'body[data-skin=nova] .lk-ex{background:color-mix(in srgb,var(--ki) 5%,transparent);backdrop-filter:blur(10px)}' +
    'body[data-skin=nova] .lk-secttl{font-weight:900;color:var(--kh);margin:22px 0 10px}body[data-skin] .lk-secttl{font-weight:900;color:var(--kp);margin:20px 0 10px}' +
    'body[data-skin=nova] .lk-side .lk-rd,body[data-skin=sakr] .lk-side .lk-rd{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:12px;line-height:1.6}body[data-skin=nova] .lk-side .lk-rs,body[data-skin=sakr] .lk-side .lk-rs{font-size:11px;gap:2px 10px}' +
    '@media(prefers-reduced-motion:reduce){body[data-skin=nova]:before,body[data-skin=nova]:after{animation:none}body[data-skin=nova] .lk-nd.cur:before{animation:none}}' +
    '#lkConf{position:fixed;inset:0;z-index:200;pointer-events:none}';

  /* ---------- cinema / paper / quest ---------- */
  var CSS3 = '' +
    /* cinema */
    'body[data-skin=cinema] .hdr{background:color-mix(in srgb,var(--kb) 92%,transparent)}' +
    'body[data-skin=cinema] .lk-chero{position:relative;display:flex;gap:24px;align-items:center;justify-content:space-between;padding:34px;border-radius:var(--kr);background:radial-gradient(120% 140% at 85% 0%,color-mix(in srgb,var(--k1) 36%,transparent),transparent 55%),linear-gradient(135deg,color-mix(in srgb,var(--kc) 88%,var(--ki)),var(--kb));border:1px solid var(--kl);overflow:hidden;margin-bottom:26px;min-height:230px}' +
    'body[data-skin=cinema] .lk-chero h1{font-size:34px}body[data-skin=cinema] .lk-hart{font-size:110px;opacity:.92;filter:drop-shadow(0 10px 30px var(--k1))}body[data-skin=cinema] .lk-btn{background:var(--k1);border-color:var(--k1);color:var(--kt);box-shadow:0 10px 30px -12px var(--k1)}body[data-skin=cinema] .lk-btn.o{background:transparent;color:var(--ki);border-color:var(--kl);box-shadow:none}' +
    'body[data-skin=cinema] .lk-rail{margin-bottom:26px}body[data-skin=cinema] .lk-rail h3{font-size:17px;margin-bottom:12px;font-weight:900}body[data-skin=cinema] .lk-rr{display:flex;gap:14px;overflow-x:auto;padding:6px 4px 16px;scroll-snap-type:x proximity}' +
    'body[data-skin=cinema] .lk-tile{flex:none;width:230px;aspect-ratio:16/10;border-radius:var(--kr);position:relative;overflow:hidden;scroll-snap-align:start;display:flex;flex-direction:column;justify-content:flex-end;padding:14px;background:linear-gradient(160deg,color-mix(in srgb,var(--k1) 26%,var(--kc)),var(--kc) 72%);border:1px solid var(--kl);transition:.2s;cursor:pointer}' +
    'body[data-skin=cinema] .lk-tile:hover{transform:translateY(-5px) scale(1.02);border-color:var(--k1);box-shadow:0 18px 40px -18px var(--k1)}body[data-skin=cinema] .lk-tn{position:absolute;top:0;inset-inline-start:12px;font-size:70px;font-weight:900;line-height:1.1;color:color-mix(in srgb,var(--ki) 16%,transparent)}' +
    'body[data-skin=cinema] .lk-tt b{display:block;font-size:14.5px;line-height:1.6}body[data-skin=cinema] .lk-tt small{color:var(--km);font-weight:700;font-size:12px}body[data-skin=cinema] .lk-tile.dn:after{content:"✓";position:absolute;top:10px;inset-inline-end:10px;width:26px;height:26px;border-radius:50%;background:var(--k1);color:var(--kt);display:grid;place-items:center;font-weight:900}' +
    'body[data-skin=cinema] .lk-tile.lk{opacity:.5;cursor:default}body[data-skin=cinema] .lk-tile.lk:hover{transform:none;box-shadow:none;border-color:var(--kl)}' +
    'body[data-skin=cinema] .lk-body{display:flex;flex-direction:column;align-items:stretch;gap:16px}body[data-skin=cinema] .lk-main{display:contents}body[data-skin=cinema] #player{order:1}body[data-skin=cinema] .lk-side{order:2;background:transparent;border:0;overflow:visible}body[data-skin=cinema] .lk-desc{order:3}body[data-skin=cinema] .lk-pn{order:4}' +
    'body[data-skin=cinema] .lk-sh{border:0;padding:2px 2px 10px}body[data-skin=cinema] .lk-grp:not(.cur){display:none}body[data-skin=cinema] .lk-grp.cur>.lk-gh{display:none}body[data-skin=cinema] .lk-grp.cur>.lk-gb{display:block}body[data-skin=cinema] #itemList{display:flex;gap:12px;overflow-x:auto;padding:4px 2px 12px}' +
    'body[data-skin=cinema] .lk-r{flex:none;width:270px;flex-direction:column;align-items:flex-start;border:1px solid var(--kl);border-radius:var(--kr);background:var(--kc);padding:14px}body[data-skin=cinema] .lk-r.on{border-color:var(--k1);box-shadow:0 0 0 1px var(--k1),0 14px 34px -16px var(--k1)}body[data-skin=cinema] .lk-ra{align-self:stretch}body[data-skin=cinema] .lk-ra .lk-b{display:block;text-align:center}' +
    'body[data-skin=cinema] .lk-ri{border-radius:8px}body[data-skin=cinema] #player .vwrap{box-shadow:0 40px 90px -40px var(--k1)}' +
    /* paper */
    'body[data-skin=paper] .lk h1{color:var(--kp)}body[data-skin=paper] .lk-btn{border-radius:4px;box-shadow:3px 3px 0 var(--ki);border-color:var(--ki)}body[data-skin=paper] .lk-btn.o{background:var(--kc);color:var(--ki)}' +
    'body[data-skin=paper] .lk-book{background:var(--kc);border:1px solid var(--kl);border-radius:var(--kr);box-shadow:6px 6px 0 color-mix(in srgb,var(--ki) 12%,transparent);padding:26px 28px;margin-bottom:24px;position:relative}body[data-skin=paper] .lk-book:before{content:"";position:absolute;top:-11px;inset-inline-start:34px;width:92px;height:22px;background:color-mix(in srgb,var(--k2) 50%,transparent);transform:rotate(-3deg);border-radius:2px}' +
    'body[data-skin=paper] .lk-toc{background:var(--kc);border:1px solid var(--kl);border-radius:var(--kr);padding:22px 28px;box-shadow:6px 6px 0 color-mix(in srgb,var(--ki) 10%,transparent);background-image:repeating-linear-gradient(transparent 0 35px,color-mix(in srgb,var(--k3) 9%,transparent) 35px 36px);border-inline-end:3px solid color-mix(in srgb,var(--k1) 55%,transparent)}' +
    'body[data-skin=paper] .lk-tch{font-size:21px;font-weight:900;text-align:center;border-bottom:3px double var(--ki);padding-bottom:10px;margin-bottom:10px}body[data-skin=paper] .lk-tsec{display:inline-block;font-weight:900;color:var(--kh);margin:16px 0 2px;font-size:14px;border-bottom:2px solid var(--k3)}' +
    'body[data-skin=paper] .lk-tr{display:flex;align-items:baseline;gap:8px;padding:8px 2px 2px;cursor:pointer}body[data-skin=paper] .lk-tnum{font-weight:900;color:var(--kp);min-width:30px}body[data-skin=paper] .lk-ttl{font-weight:800}body[data-skin=paper] .lk-dots2{flex:1;border-bottom:2px dotted color-mix(in srgb,var(--ki) 38%,transparent);transform:translateY(-4px)}body[data-skin=paper] .lk-tpg{font-weight:800;color:var(--km);white-space:nowrap}' +
    'body[data-skin=paper] .lk-tr:hover .lk-ttl{color:var(--kp)}body[data-skin=paper] .lk-tr.dn .lk-tpg{color:var(--kh)}body[data-skin=paper] .lk-tr.lk{opacity:.5;cursor:default}body[data-skin=paper] .lk-trb .lk-rd{display:block;padding-inline-start:38px;font-size:12.5px}' +
    'body[data-skin=paper] .lk-side{background:var(--kc);border:1px solid var(--kl);box-shadow:5px 5px 0 color-mix(in srgb,var(--ki) 10%,transparent);border-radius:var(--kr)}body[data-skin=paper] .lk-sh{border-bottom:3px double var(--ki)}body[data-skin=paper] .lk-r{border-top:1px dashed color-mix(in srgb,var(--ki) 28%,transparent)}body[data-skin=paper] .lk-r:hover{background:color-mix(in srgb,var(--k2) 12%,var(--kc))}body[data-skin=paper] .lk-r.on{background:color-mix(in srgb,var(--k2) 20%,var(--kc))}' +
    'body[data-skin=paper] .lk-ri{border-radius:50%;background:transparent;border:2px solid var(--k1);color:var(--kp)}body[data-skin=paper] .lk-r.seen .lk-ri{background:var(--k3);border-color:var(--k3);color:#fff}body[data-skin=paper] .lk-b{background:transparent;color:var(--kp);border:2px solid var(--k1);border-radius:4px}body[data-skin=paper] .lk-r.lk .lk-b{border-color:var(--kl);color:var(--km)}' +
    'body[data-skin=paper] .lk-desc{background:color-mix(in srgb,var(--k2) 22%,var(--kc));border:1px solid color-mix(in srgb,var(--k2) 50%,transparent);transform:rotate(-.5deg);box-shadow:4px 4px 0 rgba(0,0,0,.08)}body[data-skin=paper] .lk-grp>.lk-gh{border-top:1px solid var(--kl)}body[data-skin=paper] .lk-ex{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;border:2px dashed var(--kl);margin-top:10px;font-weight:800;cursor:pointer;border-radius:var(--kr);background:var(--kc)}' +
    /* quest */
    'body[data-skin=quest] .lk-qhead{display:flex;align-items:center;gap:16px;flex-wrap:wrap;background:var(--kc);border:2px solid var(--kl);border-bottom-width:5px;border-radius:var(--kr);padding:18px 20px;margin-bottom:22px}body[data-skin=quest] .lk-lvl{width:74px;height:74px;border-radius:50%;background:linear-gradient(135deg,var(--k3),color-mix(in srgb,var(--k3) 55%,#fff));display:grid;place-content:center;text-align:center;color:#3b2500;box-shadow:0 5px 0 color-mix(in srgb,var(--k3) 65%,#000);flex:none}' +
    'body[data-skin=quest] .lk-lvl b{font-size:28px;line-height:1;display:block}body[data-skin=quest] .lk-lvl small{font-size:10px;font-weight:900;display:block}body[data-skin=quest] .lk-qt{flex:1;min-width:200px}body[data-skin=quest] .lk-qt h1{font-size:22px}body[data-skin=quest] .lk-xp{position:relative;height:20px;border-radius:12px;background:var(--kl);overflow:hidden;margin-top:8px}' +
    'body[data-skin=quest] .lk-xp i{display:block;height:100%;background:linear-gradient(90deg,var(--k1),var(--k2));border-radius:12px;transition:width .8s}body[data-skin=quest] .lk-xp span{position:absolute;inset:0;display:grid;place-items:center;font-size:11px;font-weight:900;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.45)}' +
    'body[data-skin=quest] .lk-btn{border:0;border-bottom:5px solid color-mix(in srgb,var(--k1) 62%,#000);border-radius:16px;font-weight:900}body[data-skin=quest] .lk-btn:active{transform:translateY(3px);border-bottom-width:2px}body[data-skin=quest] .lk-btn.o{background:var(--kc);color:var(--kp);border:2px solid var(--kl);border-bottom-width:5px}' +
    'body[data-skin=quest] .lk-qpath{display:flex;flex-direction:column;align-items:center;gap:16px;padding:6px 0 20px}body[data-skin=quest] .lk-qban{align-self:stretch;background:linear-gradient(90deg,var(--k2),var(--k1));color:#fff;border-radius:16px;padding:12px 18px;font-weight:900;border-bottom:5px solid color-mix(in srgb,var(--k2) 62%,#000);margin:8px 0 2px}' +
    'body[data-skin=quest] .lk-qn{display:flex;align-items:center;gap:14px;transform:translateX(var(--o,0px));cursor:pointer;max-width:94%}body[data-skin=quest] .lk-qc{flex:none;width:70px;height:70px;border-radius:50%;display:grid;place-items:center;font-size:26px;font-weight:900;background:var(--k1);color:#fff;border-bottom:6px solid color-mix(in srgb,var(--k1) 60%,#000);transition:.15s}body[data-skin=quest] .lk-qn:hover .lk-qc{transform:translateY(-3px)}' +
    'body[data-skin=quest] .lk-qn.dn .lk-qc{background:var(--k3);border-bottom-color:color-mix(in srgb,var(--k3) 62%,#000);color:#3b2500}body[data-skin=quest] .lk-qn.lk{cursor:default}body[data-skin=quest] .lk-qn.lk .lk-qc{background:var(--kl);border-bottom-color:color-mix(in srgb,var(--kl) 70%,#000);color:var(--km)}body[data-skin=quest] .lk-qn.cur .lk-qc{animation:lkq 1.4s infinite}@keyframes lkq{50%{box-shadow:0 0 0 12px color-mix(in srgb,var(--k1) 22%,transparent)}}' +
    'body[data-skin=quest] .lk-qtx{background:var(--kc);border:2px solid var(--kl);border-bottom-width:4px;border-radius:16px;padding:8px 14px;min-width:150px}body[data-skin=quest] .lk-qtx b{display:block;font-size:14px;line-height:1.6}body[data-skin=quest] .lk-qtx small{color:var(--km);font-weight:700;font-size:12px}' +
    'body[data-skin=quest] .lk-grp{background:var(--kc);border:2px solid var(--kl);border-bottom-width:5px;border-radius:var(--kr);margin-bottom:12px;overflow:hidden}body[data-skin=quest] .lk-side{background:transparent;border:0;overflow:visible}body[data-skin=quest] .lk-sh{border:0;padding:0 2px 10px}body[data-skin=quest] .lk-r{border-top:2px solid var(--kl)}body[data-skin=quest] .lk-r:hover{background:color-mix(in srgb,var(--k1) 7%,var(--kc))}body[data-skin=quest] .lk-r.on{background:color-mix(in srgb,var(--k1) 12%,var(--kc));box-shadow:inset -5px 0 0 var(--k1)}' +
    'body[data-skin=quest] .lk-ri{border-radius:50%}body[data-skin=quest] .lk-r.seen .lk-ri{background:var(--k3);color:#3b2500}body[data-skin=quest] .lk-b{border-radius:12px;border-bottom:4px solid color-mix(in srgb,var(--k1) 62%,#000)}body[data-skin=quest] .lk-r.lk .lk-b{border-bottom-color:var(--kl)}body[data-skin=quest] .lk-desc{border:2px solid var(--kl);border-bottom-width:5px}' +
    'body[data-skin=quest] .lk-ex,body[data-skin=paper] .lk-ex,body[data-skin=cinema] .lk-ex{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:14px 16px;border:2px solid var(--kl);border-bottom-width:5px;border-radius:var(--kr);background:var(--kc);margin-bottom:10px;font-weight:800;cursor:pointer}' +
    '@media(max-width:700px){body[data-skin=quest] .lk-qn{transform:translateX(calc(var(--o,0px)*.35))}body[data-skin=cinema] .lk-chero{padding:22px}body[data-skin=cinema] .lk-hart{display:none}body[data-skin=cinema] .lk-tile{width:200px}}';
  CSS += CSS3;

  /* ---------- bento / mag (ألوان المنصة: كحلي + أحمر + وردي) ---------- */
  var CSS4 = '' +
    /* bento */
    'body[data-skin=bento]:before{content:"";position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(60vmax 40vmax at 100% 0%,color-mix(in srgb,var(--k1) 22%,transparent),transparent 60%),radial-gradient(50vmax 40vmax at 0% 100%,color-mix(in srgb,var(--k2) 18%,transparent),transparent 60%)}body[data-skin=bento] .wrap,body[data-skin=bento] .hdr{position:relative;z-index:1}' +
    'body[data-skin=bento] .lk-bento{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:minmax(118px,auto);gap:14px;margin-bottom:26px}body[data-skin=bento] .lk-bc{background:var(--kc);border:1px solid var(--kl);border-radius:var(--kr);padding:18px;position:relative;overflow:hidden}' +
    'body[data-skin=bento] .lk-bc-hero{grid-column:span 2;grid-row:span 2;display:flex;flex-direction:column;justify-content:space-between;gap:12px;background:linear-gradient(135deg,var(--k1),var(--k2));border:0;color:#fff;box-shadow:0 24px 60px -26px var(--k1)}body[data-skin=bento] .lk-bc-hero h1{font-size:28px;color:#fff;-webkit-text-fill-color:#fff}body[data-skin=bento] .lk-bc-hero .lk-sub{color:rgba(255,255,255,.82)}' +
    'body[data-skin=bento] .lk-bc-hero .lk-btn{background:#fff;color:var(--kp);border-color:#fff;align-self:flex-start}body[data-skin=bento] .lk-bc-hero:after{content:"";position:absolute;width:240px;height:240px;border-radius:50%;inset-inline-start:-70px;bottom:-90px;background:rgba(255,255,255,.14)}' +
    'body[data-skin=bento] .lk-bc-ring{display:grid;place-items:center}body[data-skin=bento] .lk-bc-ring .lk-ring{width:96px;height:96px;background:conic-gradient(var(--k3) calc(var(--p)*1%),var(--kl) 0)}body[data-skin=bento] .lk-bc-ring .lk-ring:before{inset:9px;background:var(--kc)}' +
    'body[data-skin=bento] .lk-bc-st b{display:block;font-size:36px;font-weight:900;line-height:1.1;background:linear-gradient(90deg,var(--k1),var(--k2));-webkit-background-clip:text;background-clip:text;color:transparent}body[data-skin=bento] .lk-bc-st small{color:var(--km);font-weight:800}body[data-skin=bento] .lk-bc-st{display:flex;flex-direction:column;justify-content:center;gap:4px}' +
    'body[data-skin=bento] .lk-bc-next{border-color:color-mix(in srgb,var(--k3) 55%,transparent);background:linear-gradient(160deg,color-mix(in srgb,var(--k3) 14%,var(--kc)),var(--kc));display:flex;flex-direction:column;gap:6px;justify-content:center}body[data-skin=bento] .lk-bc-next small{color:var(--kh);font-weight:900}body[data-skin=bento] .lk-bc-next b{font-size:14px;line-height:1.6}' +
    'body[data-skin=bento] .lk-bgt{font-weight:900;font-size:15px;margin:22px 2px 12px;color:var(--kh)}body[data-skin=bento] .lk-bgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}' +
    'body[data-skin=bento] .lk-bl{position:relative;background:var(--kc);border:1px solid var(--kl);border-radius:var(--kr);padding:16px 18px 18px;min-height:168px;display:flex;flex-direction:column;gap:6px;cursor:pointer;transition:.22s;overflow:hidden}body[data-skin=bento] .lk-bl:hover{transform:translateY(-5px);border-color:var(--k1);box-shadow:0 20px 44px -22px var(--k1)}' +
    'body[data-skin=bento] .lk-bn{font-size:52px;font-weight:900;line-height:1;background:linear-gradient(135deg,var(--k1),var(--k2));-webkit-background-clip:text;background-clip:text;color:transparent;opacity:.95}body[data-skin=bento] .lk-bl b{font-size:14.5px;line-height:1.7}body[data-skin=bento] .lk-bl small{color:var(--km);font-weight:700;font-size:12px;margin-top:auto}' +
    'body[data-skin=bento] .lk-bl.dn{border-color:color-mix(in srgb,var(--k3) 60%,transparent)}body[data-skin=bento] .lk-bl.dn:after{content:"✓";position:absolute;top:12px;inset-inline-end:12px;width:26px;height:26px;border-radius:50%;background:var(--k3);color:#04101a;display:grid;place-items:center;font-weight:900}body[data-skin=bento] .lk-bl.lk{opacity:.5;cursor:default}body[data-skin=bento] .lk-bl.lk:hover{transform:none;box-shadow:none;border-color:var(--kl)}' +
    'body[data-skin=bento] .lk-bl .lk-pr{height:4px;background:linear-gradient(90deg,var(--k1),var(--k2))}body[data-skin=bento] .lk-btn{background:var(--kg);border:0;box-shadow:0 10px 26px -12px var(--k1)}body[data-skin=bento] .lk-btn.o{background:transparent;border:1.5px solid var(--kl);color:var(--ki);box-shadow:none}' +
    'body[data-skin=bento] .lk h1{font-size:26px}body[data-skin=bento] .lk-body{display:flex;flex-direction:column;align-items:stretch;gap:16px}body[data-skin=bento] .lk-main{display:contents}body[data-skin=bento] #player{order:1}body[data-skin=bento] .lk-side{order:2;background:transparent;border:0;overflow:visible}body[data-skin=bento] .lk-desc{order:3}body[data-skin=bento] .lk-pn{order:4}' +
    'body[data-skin=bento] #player .vwrap,body[data-skin=bento] .lk-demo-pl{border-radius:calc(var(--kr)*1.2);box-shadow:0 30px 80px -34px var(--k1),0 0 0 1px color-mix(in srgb,var(--k1) 38%,transparent)}body[data-skin=bento] .lk-sh{border:0;padding:0 2px 10px}body[data-skin=bento] .lk-grp:not(.cur){display:none}body[data-skin=bento] .lk-grp.cur>.lk-gh{display:none}body[data-skin=bento] .lk-grp.cur>.lk-gb{display:block}' +
    'body[data-skin=bento] #itemList{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}body[data-skin=bento] .lk-r{background:var(--kc);border:1px solid var(--kl);border-radius:var(--kr);padding:16px;flex-wrap:wrap;align-items:flex-start}body[data-skin=bento] .lk-r:hover{border-color:var(--k1)}body[data-skin=bento] .lk-r.on{border-color:var(--k1);box-shadow:0 0 0 1px var(--k1),0 16px 40px -20px var(--k1)}' +
    'body[data-skin=bento] .lk-ri{border-radius:12px;background:linear-gradient(135deg,var(--k1),var(--k2));color:#fff}body[data-skin=bento] .lk-r.seen .lk-ri{background:var(--k3);color:#04101a}body[data-skin=bento] .lk-ra{width:100%}body[data-skin=bento] .lk-ra .lk-b{display:block;text-align:center;background:var(--kg)}body[data-skin=bento] .lk-r.lk .lk-b{background:var(--kl)}' +
    'body[data-skin=bento] .lk-desc{border-radius:var(--kr)}body[data-skin=bento] .lk-ex{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:14px 16px;border:1px solid var(--kl);background:var(--kc);border-radius:var(--kr);margin-bottom:10px;font-weight:800;cursor:pointer}' +
    /* mag */
    'body[data-skin=mag] .lk-mh{padding:10px 0 26px;border-bottom:3px solid var(--ki);margin-bottom:6px}body[data-skin=mag] .lk-kick{display:inline-block;font-weight:900;font-size:12.5px;letter-spacing:.5px;color:var(--kp);border-bottom:3px solid var(--k1);padding-bottom:2px;margin-bottom:12px}' +
    'body[data-skin=mag] .lk-mt{font-size:46px;font-weight:900;line-height:1.25;letter-spacing:-.5px}body[data-skin=mag] .lk-mh p{max-width:680px;color:var(--km);font-weight:600;line-height:2;margin-top:8px;font-size:15.5px;white-space:pre-line}body[data-skin=mag] .lk-mm{display:flex;gap:18px;flex-wrap:wrap;align-items:center;margin-top:16px;font-weight:800;font-size:13.5px}body[data-skin=mag] .lk-mm span{padding-inline-end:18px;border-inline-end:1px solid var(--kl)}body[data-skin=mag] .lk-mm span:last-of-type{border:0}' +
    'body[data-skin=mag] .lk-btn{border-radius:2px;background:var(--ki);border-color:var(--ki);color:var(--kb)}body[data-skin=mag] .lk-btn:hover{background:var(--k1);border-color:var(--k1);color:#fff}body[data-skin=mag] .lk-btn.o{background:transparent;color:var(--ki)}' +
    'body[data-skin=mag] .lk-msec{font-weight:900;font-size:13px;letter-spacing:.4px;color:var(--kp);margin:26px 0 4px;display:flex;align-items:center;gap:10px}body[data-skin=mag] .lk-msec:after{content:"";flex:1;height:1px;background:var(--kl)}' +
    'body[data-skin=mag] .lk-mrow{display:flex;align-items:center;gap:22px;padding:18px 4px;border-bottom:1px solid var(--kl);cursor:pointer;transition:.2s}body[data-skin=mag] .lk-mrow:hover{padding-inline-start:16px;background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--k1) 6%,transparent))}' +
    'body[data-skin=mag] .lk-mno{flex:none;font-size:54px;font-weight:900;line-height:1;min-width:84px;color:transparent;-webkit-text-stroke:1.6px color-mix(in srgb,var(--ki) 38%,transparent);transition:.2s}body[data-skin=mag] .lk-mrow:hover .lk-mno{-webkit-text-stroke-color:var(--k1)}body[data-skin=mag] .lk-mrow.dn .lk-mno{color:var(--kp);-webkit-text-stroke:0}' +
    'body[data-skin=mag] .lk-mbody{flex:1;min-width:0}body[data-skin=mag] .lk-mbody b{display:block;font-size:19px;font-weight:900;line-height:1.6}body[data-skin=mag] .lk-mbody em{display:block;font-style:normal;color:var(--km);font-weight:600;font-size:13.5px;line-height:1.9;margin-top:2px}body[data-skin=mag] .lk-mm2{flex:none;text-align:end;font-weight:800;font-size:12.5px;color:var(--km)}body[data-skin=mag] .lk-mm2 i{display:block;font-style:normal;color:var(--kp);font-size:13px;margin-top:2px}' +
    'body[data-skin=mag] .lk-mrow.lk{opacity:.45;cursor:default}body[data-skin=mag] .lk-mrow.lk:hover{padding-inline-start:4px;background:none}' +
    'body[data-skin=mag] .lk-body{display:flex;flex-direction:column;align-items:stretch;gap:20px;max-width:980px;margin:0 auto}body[data-skin=mag] .lk-main{display:contents}body[data-skin=mag] #player{order:1;margin-bottom:12px}body[data-skin=mag] .lk-desc{order:2}body[data-skin=mag] .lk-side{order:3}body[data-skin=mag] .lk-pn{order:4}body[data-skin=mag] .lk-top,body[data-skin=mag] .lk>.lk-desc{max-width:980px;margin-inline:auto}' +
    'body[data-skin=mag] .lk-top{border-bottom:3px solid var(--ki);padding-bottom:14px}body[data-skin=mag] .lk-top h1{font-size:34px}body[data-skin=mag] .lk-desc{background:transparent;border:0;border-inline-start:5px solid var(--k1);border-radius:0;padding:4px 20px;font-size:17px;font-weight:700;line-height:2.1}body[data-skin=mag] .lk-desc small{letter-spacing:.4px}' +
    'body[data-skin=mag] #player .vwrap,body[data-skin=mag] .lk-demo-pl{border-radius:2px;box-shadow:12px 12px 0 color-mix(in srgb,var(--k1) 85%,transparent)}body[data-skin=mag] .lk-side{background:transparent;border:0;overflow:visible}body[data-skin=mag] .lk-sh{border:0;border-bottom:1px solid var(--ki);padding:0 0 8px;font-size:15px;color:var(--kp)}' +
    'body[data-skin=mag] .lk-grp:not(.cur){display:none}body[data-skin=mag] .lk-grp.cur>.lk-gh{display:none}body[data-skin=mag] .lk-grp.cur>.lk-gb{display:block}body[data-skin=mag] .lk-r{padding:16px 4px;border-bottom:1px solid var(--kl);gap:18px}body[data-skin=mag] .lk-r:hover{background:color-mix(in srgb,var(--k1) 5%,transparent)}body[data-skin=mag] .lk-r.on{box-shadow:inset 5px 0 0 var(--k1);background:color-mix(in srgb,var(--k1) 7%,transparent)}' +
    'body[data-skin=mag] .lk-ri{width:auto;height:auto;background:none;font-size:34px;font-weight:900;color:transparent;-webkit-text-stroke:1.4px color-mix(in srgb,var(--ki) 40%,transparent);min-width:54px}body[data-skin=mag] .lk-r.seen .lk-ri{background:none;color:var(--kp);-webkit-text-stroke:0}body[data-skin=mag] .lk-rt b{font-size:16.5px}body[data-skin=mag] .lk-b{background:none;color:var(--kp);padding:0;border-bottom:2px solid var(--k1);border-radius:0}body[data-skin=mag] .lk-r.lk .lk-b{color:var(--km);border-color:transparent}' +
    'body[data-skin=mag] .lk-ex{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:16px 4px;border-bottom:1px solid var(--kl);font-weight:800;cursor:pointer}body[data-skin=mag] .lk-secttl{border-bottom:3px solid var(--ki);padding-bottom:8px}' +
    '@media(max-width:800px){body[data-skin=bento] .lk-bento{grid-template-columns:repeat(2,1fr)}body[data-skin=bento] .lk-bc-hero{grid-column:span 2;grid-row:auto}body[data-skin=mag] .lk-mt{font-size:30px}body[data-skin=mag] .lk-mno{font-size:38px;min-width:58px}body[data-skin=mag] .lk-mrow{gap:12px}}';
  CSS += CSS4;

  /* ---------- تفعيل الشكل على الصفحة ---------- */
  L.apply = function (c) {
    var b = document.body; if (!b) return;
    if (!c || c.skin === 'classic') { b.removeAttribute('data-skin'); b.removeAttribute('data-sticky'); var o = document.getElementById('lsk-css'); if (o) o.remove(); var t0 = tokens({ skin: 'classic', c1: '#000000', c2: '#000000', c3: '#000000', bg: '#ffffff', ink: '#000000', radius: 16 }); Object.keys(t0).forEach(function (k) { b.style.removeProperty(k); }); return; }
    var st = document.getElementById('lsk-css'); if (!st) { st = document.createElement('style'); st.id = 'lsk-css'; st.textContent = CSS; document.head.appendChild(st); }
    var t = tokens(c); Object.keys(t).forEach(function (k) { b.style.setProperty(k, t[k]); });
    b.setAttribute('data-skin', c.skin); b.setAttribute('data-sticky', c.sticky_player ? '1' : '0');
  };

  /* ---------- أدوات النصوص ---------- */
  var fmtMin = function (m) { m = +m || 0; if (!m) return ''; if (m < 60) return m + ' دقيقة'; var h = Math.floor(m / 60), r = m % 60; return h + ' ساعة' + (r ? ' و' + r + ' دقيقة' : ''); };
  var fmtSec = function (s) { s = Math.max(0, Math.round(+s || 0)); var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60, p = function (n) { return ('0' + n).slice(-2); }; return p(h) + ':' + p(m) + ':' + p(x); };
  var fmtDur = function (min) { min = +min || 0; return fmtSec(min * 60); };
  L.fmtMin = fmtMin; L.fmtSec = fmtSec;
  var ico = function (x) { return x.t === 'quiz' ? (x.homework ? '📚' : '📝') : x.kind === 'video' ? '🎬' : (x.kind === 'pdf' || x.kind === 'file') ? '📄' : '🔗'; };

  /* ---------- صف عنصر (فيديو / ملف / امتحان) ---------- */
  L.row = function (c, x, o) {
    o = o || {}; var lk = !!x.locked, dn = !!x.done, label = x.t === 'quiz' ? (x.homework ? c.lbl_hw : c.lbl_quiz) : (x.kind === 'video' ? c.lbl_watch : c.lbl_file);
    var st = x.state === 'o' ? 'لسه ما فتحش' : x.state === 'c' ? 'انتهى الوقت' : '';
    var pct = dn ? 100 : (x.duration && x.seconds ? Math.min(99, Math.round(x.seconds / (x.duration * 60) * 100)) : 0);
    var head = c.numbers ? (dn ? '✓' : (o.n != null ? o.n : (o.i || 0) + 1)) : (dn ? '✓' : (lk ? '🔒' : ico(x)));
    var desc = c.item_desc && x.desc ? '<em class="lk-rd">الوصف: ' + esc(x.desc) + '</em>' : '';
    var stats = '';
    if (c.stats && x.t !== 'quiz' && x.kind === 'video') {
      var a = [];
      if (x.duration) a.push('<s>⏱ مدة الفيديو: ' + fmtDur(x.duration) + '</s>');
      if (x.views != null) a.push('<s>👁 عدد المشاهدات: ' + (+x.views || 0) + '</s>');
      if (x.seconds != null) a.push('<s>⏳ إجمالي وقت المشاهدة: ' + fmtSec(x.seconds) + '</s>');
      if (a.length) stats = '<span class="lk-rs">' + a.join('') + '</span>';
    }
    var sub = lk ? '<small>🔒 خلّص اللي قبله الأول</small>' : st ? '<small>' + st + '</small>' : (x.t === 'quiz' && !c.item_desc ? '<small>' + (x.homework ? 'واجب' : 'امتحان') + '</small>' : '');
    var attrs = (o.i != null ? ' data-i="' + o.i + '"' : '') + (x.id != null ? ' data-lk-it="' + esc(x.id) + '"' : '') + (o.l ? ' data-l="' + esc(o.l) + '"' : '') + (x.t === 'quiz' ? ' data-lk-qz="1"' : '');
    var cls = 'lk-r' + (dn ? ' seen' : '') + (lk ? ' lk' : '') + (o.on ? ' on' : '');
    var tag = o.href && !lk ? 'a' : 'div';
    return '<' + tag + ' class="' + cls + '"' + attrs + (tag === 'a' ? ' href="' + esc(o.href) + '"' : '') + '><span class="lk-ri">' + head + '</span><span class="lk-rt"><b>' + esc(x.title) + '</b>' + desc + stats + sub + '</span><span class="lk-ra"><span class="lk-b">' + (lk ? '🔒' : esc(label)) + '</span></span>' + (c.progress && !lk ? '<i class="lk-pr" style="width:' + pct + '%"></i>' : '') + '</' + tag + '>';
  };

  /* ---------- صفحة الكورس ----------
     m = { title, desc, year, pct, lessons:[{id,n,title,section,done,open,free,minutes,desc,count,nDone,entries:[…]}], exams:[…], top:'html', joinHtml, minutes, cur }  */
  function secGroups(m) { var g = [], last = null; m.lessons.forEach(function (l) { var s = l.section || ''; if (!g.length || s !== last) { g.push({ t: s, ls: [] }); last = s; } g[g.length - 1].ls.push(l); }); return g; }
  function exams(m) { return m.exams && m.exams.length ? '<div class="lk-secttl">📝 امتحانات الكورس</div>' + m.exams.map(function (x) { return '<div class="lk-ex" data-lk-q="' + esc(x.id) + '" data-s="' + (x.state || '') + '"><span>' + (x.tried ? '✅ ' : '📝 ') + esc(x.title) + '</span><span class="lk-b" style="font-size:12.5px;padding:5px 14px;border-radius:50px">' + (x.state === 'o' ? 'لسه ما فتحش' : x.state === 'c' ? 'انتهى' : x.tried ? 'اتحل' : 'ابدأ') + '</span></div>'; }).join('') : ''; }
  function lessonNote(l) { return l.count ? l.nDone + '/' + l.count : ''; }
  function courseSakr(c, m) {
    var gs = secGroups(m), hasSec = gs.some(function (g) { return g.t; }), tot = m.lessons.length, openIdx = Math.max(0, gs.findIndex(function (g) { return g.ls.some(function (l) { return l.id === m.cur; }); }));
    var groups = gs.map(function (g, gi) {
      var dn = g.ls.filter(function (l) { return l.done; }).length;
      var rows = g.ls.map(function (l) {
        var pc = l.done ? 100 : (l.count ? Math.round(l.nDone / l.count * 100) : 0);
        return '<' + (l.open ? 'a href="' + esc(l.href || '#') + '"' : 'div') + ' class="lk-r' + (l.done ? ' seen' : '') + (l.open ? '' : ' lk') + '" data-lk-l="' + esc(l.id) + '"><span class="lk-ri">' + (l.done ? '✓' : l.n) + '</span><span class="lk-rt"><b>' + esc(l.title) + '</b><small>' + [fmtMin(l.minutes), l.count ? lessonNote(l) + ' عنصر' : '', l.free && !m.on ? 'مجاني' : '', l.hw ? '📚 واجب' : ''].filter(Boolean).join(' • ') + '</small></span><span class="lk-ra"><span class="lk-b">' + (l.open ? (l.done ? 'مراجعة' : 'فتح') : '🔒') + '</span></span>' + (c.progress && l.open ? '<i class="lk-pr" style="width:' + pc + '%"></i>' : '') + '</' + (l.open ? 'a' : 'div') + '>';
      }).join('');
      return '<div class="lk-grp' + (gi === openIdx || !hasSec ? ' open' : '') + '"><button type="button" class="lk-gh" data-lk-tg><span>' + esc(g.t || 'المحاضرات') + '</span><span class="lk-gc">' + dn + '/' + g.ls.length + '</span><i>⌄</i></button><div class="lk-gb">' + rows + '</div></div>';
    }).join('');
    var next = m.lessons.find(function (l) { return l.open && !l.done; });
    var cover = '<aside class="lk-cover"><div class="lk-cv"><div class="lk-img">🎓</div><div class="lk-cvb"><h3>' + esc(m.title) + '</h3><div><div class="lk-bar"><i style="width:' + m.pct + '%"></i></div><div class="lk-sub" style="margin-top:6px">' + m.pct + '% مكتمل</div></div>'
      + (m.on || m.lessons.some(function (l) { return l.open; }) ? '<button type="button" class="lk-btn lg" data-lk-start>' + (m.pct > 0 ? 'كمّل الكورس' : 'ابدأ الكورس') + '</button>' : '')
      + '<ul><li>📚 <b>' + tot + '</b> محاضرة</li>' + (m.minutes ? '<li>⏱ <b>' + fmtMin(m.minutes) + '</b></li>' : '') + (m.year ? '<li>🎓 ' + esc(m.year) + '</li>' : '') + '</ul></div></div></aside>';
    return '<div class="lk"><div class="lk-top"><div><small>' + esc(m.year || '') + '</small><h1>' + esc(m.title) + '</h1>' + (m.desc ? '<div class="lk-sub" style="white-space:pre-line;margin-top:6px">' + esc(m.desc) + '</div>' : '') + '</div></div>'
      + '<div class="lk-cgrid"><div class="lk-main">' + (m.top || '') + groups + exams(m) + '</div>' + cover + '</div></div>';
  }
  function courseGohary(c, m) {
    var cards = m.lessons.map(function (l) {
      var rows = l.open && l.entries && l.entries.length ? l.entries.map(function (x, i) { return L.row(c, x, { i: i, n: i + 1, l: l.id, href: x.href }); }).join('') : (l.open ? '' : '<div class="lk-r lk"><span class="lk-ri">🔒</span><span class="lk-rt"><b>المحاضرة دي مقفولة</b><small>' + (l.count ? l.count + ' عنصر جواها' : 'اشترك في الكورس عشان تفتحها') + '</small></span></div>');
      return '<section class="lk-gl' + (l.open ? '' : ' lk') + '"><header class="lk-glh"><span class="lk-gn">' + (l.done ? '✓' : l.n) + '</span><div><h3>' + esc(l.title) + '</h3>' + (c.desc_top && l.desc ? '<p class="lk-gd">الوصف: ' + esc(l.desc) + '</p>' : '') + '<small class="lk-sub">' + [l.section, fmtMin(l.minutes), l.count ? l.count + ' عنصر' : ''].filter(Boolean).join(' • ') + '</small></div>' + (l.open ? '<a class="lk-btn" href="' + esc(l.href || '#') + '" data-lk-l="' + esc(l.id) + '">فتح المحاضرة</a>' : '') + '</header>' + (rows ? '<div class="lk-gi">' + rows + '</div>' : '') + '</section>';
    }).join('');
    return '<div class="lk"><div class="lk-hd"><div class="lk-top" style="margin:0"><div><small>' + esc(m.year || '') + '</small><h1>' + esc(m.title) + '</h1>' + (m.desc ? '<div class="lk-sub" style="white-space:pre-line;margin-top:6px">' + esc(m.desc) + '</div>' : '') + '</div><div style="min-width:220px"><b>' + m.pct + '% مكتمل</b><div class="lk-bar" style="margin-top:6px"><i style="width:' + m.pct + '%"></i></div></div></div></div>' + (m.top || '') + cards + exams(m) + '</div>';
  }
  function courseNova(c, m) {
    var gs = secGroups(m), n = 0, cur = m.cur || (m.lessons.find(function (l) { return l.open && !l.done; }) || {}).id;
    var path = gs.map(function (g) {
      return (g.t ? '<div class="lk-chap">◆ ' + esc(g.t) + '</div>' : '') + g.ls.map(function (l) {
        n++;
        var dots = (l.entries || []).map(function (x) { return '<i class="' + (x.done ? 'd' : '') + '" title="' + esc(x.title) + '"></i>'; }).join('');
        return '<div class="lk-nd' + (l.done ? ' dn' : '') + (l.open ? '' : ' lk') + (l.id === cur ? ' cur' : '') + '" data-n="' + l.n + '" data-lk-l="' + esc(l.id) + '"><div class="lk-nt"><b>' + esc(l.title) + '</b><small>' + [fmtMin(l.minutes), l.count ? l.nDone + '/' + l.count + ' عنصر' : '', l.free && !m.on ? 'مجاني' : '', !l.open ? '🔒 مقفولة' : ''].filter(Boolean).join(' • ') + '</small>' + (l.desc && c.desc_top ? '<div class="lk-rd" style="margin-top:4px">' + esc(l.desc) + '</div>' : '') + (dots ? '<div class="lk-dots">' + dots + '</div>' : '') + '</div>' + (l.open ? '<a class="lk-btn" href="' + esc(l.href || '#') + '">' + (l.done ? 'مراجعة' : l.id === cur ? 'كمّل ▶' : 'ادخل') + '</a>' : '') + '</div>';
      }).join('');
    }).join('');
    var hero = '<div class="lk-hero"><div><small class="lk-sub">' + esc(m.year || '') + '</small><h1>' + esc(m.title) + '</h1>' + (m.desc ? '<div class="lk-sub" style="white-space:pre-line;margin-top:6px">' + esc(m.desc) + '</div>' : '') + '<div class="lk-chips"><span>📚 ' + m.lessons.length + ' محاضرة</span>' + (m.minutes ? '<span>⏱ ' + fmtMin(m.minutes) + '</span>' : '') + '<span>🔥 ' + m.pct + '% مكتمل</span></div>'
      + (m.on || m.lessons.some(function (l) { return l.open; }) ? '<div style="margin-top:16px"><button type="button" class="lk-btn" data-lk-start>' + (m.pct > 0 ? '▶ كمّل رحلتك' : '🚀 ابدأ الرحلة') + '</button></div>' : '') + '</div><div class="lk-ring" style="--p:' + m.pct + '"><b>' + m.pct + '%</b></div></div>';
    return '<div class="lk">' + hero + (m.top || '') + '<div class="lk-path">' + path + '</div>' + exams(m) + '</div>';
  }

  function courseCinema(c, m) {
    var gs = secGroups(m), nxt = m.lessons.find(function (l) { return l.open && !l.done; }) || {};
    var rails = gs.map(function (g) {
      return '<section class="lk-rail">' + (g.t ? '<h3>' + esc(g.t) + '</h3>' : '') + '<div class="lk-rr">' + g.ls.map(function (l) {
        var pc = l.done ? 100 : (l.count ? Math.round(l.nDone / l.count * 100) : 0);
        return '<' + (l.open ? 'a href="' + esc(l.href || '#') + '"' : 'div') + ' class="lk-tile' + (l.done ? ' dn' : '') + (l.open ? '' : ' lk') + '" data-lk-l="' + esc(l.id) + '"><span class="lk-tn">' + l.n + '</span><span class="lk-tt"><b>' + (l.open ? '' : '🔒 ') + esc(l.title) + '</b><small>' + [fmtMin(l.minutes), l.count ? lessonNote(l) + ' عنصر' : ''].filter(Boolean).join(' • ') + '</small></span>' + (c.progress && l.open ? '<i class="lk-pr" style="width:' + pc + '%"></i>' : '') + '</' + (l.open ? 'a' : 'div') + '>';
      }).join('') + '</div></section>';
    }).join('');
    var hero = '<div class="lk-chero"><div><small class="lk-sub">' + esc(m.year || '') + '</small><h1>' + esc(m.title) + '</h1>' + (m.desc ? '<div class="lk-sub" style="white-space:pre-line;margin-top:8px;max-width:620px">' + esc(m.desc) + '</div>' : '') + '<div class="lk-chips"><span>🎞 ' + m.lessons.length + ' محاضرة</span>' + (m.minutes ? '<span>⏱ ' + fmtMin(m.minutes) + '</span>' : '') + '<span>✅ ' + m.pct + '%</span></div>'
      + (m.on || nxt.id ? '<div style="margin-top:18px"><button type="button" class="lk-btn" data-lk-start>▶ ' + (m.pct > 0 ? 'كمّل المشاهدة' : 'ابدأ المشاهدة') + '</button></div>' : '') + '</div><div class="lk-hart" aria-hidden="true">🎬</div></div>';
    return '<div class="lk">' + hero + (m.top || '') + rails + exams(m) + '</div>';
  }
  function coursePaper(c, m) {
    var gs = secGroups(m), toc = gs.map(function (g) {
      return (g.t ? '<div class="lk-tsec">' + esc(g.t) + '</div>' : '') + g.ls.map(function (l) {
        return '<div class="lk-trb"><' + (l.open ? 'a href="' + esc(l.href || '#') + '"' : 'div') + ' class="lk-tr' + (l.done ? ' dn' : '') + (l.open ? '' : ' lk') + '" data-lk-l="' + esc(l.id) + '"><span class="lk-tnum">' + l.n + '.</span><span class="lk-ttl">' + esc(l.title) + '</span><span class="lk-dots2"></span><span class="lk-tpg">' + (l.done ? '✓ تمّ' : l.open ? (fmtMin(l.minutes) || 'افتح') : '🔒') + '</span></' + (l.open ? 'a' : 'div') + '>' + (c.item_desc && l.desc ? '<em class="lk-rd">' + esc(l.desc) + '</em>' : '') + '</div>';
      }).join('');
    }).join('');
    return '<div class="lk"><div class="lk-book"><small class="lk-sub">' + esc(m.year || '') + '</small><h1>' + esc(m.title) + '</h1>' + (m.desc ? '<div class="lk-sub" style="white-space:pre-line;margin-top:6px">' + esc(m.desc) + '</div>' : '') + '<div style="margin-top:14px;display:flex;gap:14px;align-items:center;flex-wrap:wrap"><div style="flex:1;min-width:200px"><b style="font-size:13px">' + m.pct + '% من الكتاب خلّصته</b><div class="lk-bar" style="margin-top:6px"><i style="width:' + m.pct + '%"></i></div></div>'
      + (m.on || m.lessons.some(function (l) { return l.open; }) ? '<button type="button" class="lk-btn" data-lk-start>' + (m.pct > 0 ? '✏️ كمّل المذاكرة' : '✏️ ابدأ المذاكرة') + '</button>' : '') + '</div></div>' + (m.top || '')
      + '<div class="lk-toc"><div class="lk-tch">فهرس المحتويات</div>' + toc + '</div>' + exams(m) + '</div>';
  }
  function courseQuest(c, m) {
    var xp = 0; m.lessons.forEach(function (l) { xp += (l.nDone || 0) * 10 + (l.done ? 40 : 0); });
    var lvl = Math.floor(xp / 100) + 1, gs = secGroups(m), k = 0, off = [0, 56, 96, 56, 0, -56, -96, -56], cur = m.cur || (m.lessons.find(function (l) { return l.open && !l.done; }) || {}).id;
    var path = gs.map(function (g) {
      return (g.t ? '<div class="lk-qban">' + esc(g.t) + '</div>' : '') + g.ls.map(function (l) {
        var o = off[k++ % off.length];
        return '<' + (l.open ? 'a href="' + esc(l.href || '#') + '"' : 'div') + ' class="lk-qn' + (l.done ? ' dn' : '') + (l.open ? '' : ' lk') + (l.id === cur ? ' cur' : '') + '" style="--o:' + o + 'px" data-lk-l="' + esc(l.id) + '"><span class="lk-qc">' + (l.done ? '⭐' : l.open ? l.n : '🔒') + '</span><span class="lk-qtx"><b>' + esc(l.title) + '</b><small>' + [fmtMin(l.minutes), l.count ? lessonNote(l) + ' مهمة' : ''].filter(Boolean).join(' • ') + '</small></span></' + (l.open ? 'a' : 'div') + '>';
      }).join('');
    }).join('');
    var head = '<div class="lk-qhead"><div class="lk-lvl"><span><b>' + lvl + '</b><small>مستوى</small></span></div><div class="lk-qt"><h1>' + esc(m.title) + '</h1><div class="lk-xp"><i style="width:' + m.pct + '%"></i><span><bdi>' + xp + ' XP</bdi> • <bdi>' + m.pct + '%</bdi></span></div></div>'
      + (m.on || m.lessons.some(function (l) { return l.open; }) ? '<button type="button" class="lk-btn" data-lk-start>' + (m.pct > 0 ? '▶ كمّل التحدّي' : '🚀 يلا نبدأ') + '</button>' : '') + '</div>';
    return '<div class="lk">' + head + (m.desc ? '<div class="lk-sub" style="white-space:pre-line;margin:-8px 4px 16px">' + esc(m.desc) + '</div>' : '') + (m.top || '') + '<div class="lk-qpath">' + path + '</div>' + exams(m) + '</div>';
  }
  function courseBento(c, m) {
    var gs = secGroups(m), nxt = m.lessons.find(function (l) { return l.open && !l.done; }) || null;
    var grids = gs.map(function (g) {
      return (g.t ? '<div class="lk-bgt">◆ ' + esc(g.t) + '</div>' : '') + '<div class="lk-bgrid">' + g.ls.map(function (l) {
        var pc = l.done ? 100 : (l.count ? Math.round(l.nDone / l.count * 100) : 0);
        return '<' + (l.open ? 'a href="' + esc(l.href || '#') + '"' : 'div') + ' class="lk-bl' + (l.done ? ' dn' : '') + (l.open ? '' : ' lk') + '" data-lk-l="' + esc(l.id) + '"><span class="lk-bn">' + ('0' + l.n).slice(-2) + '</span><b>' + (l.open ? '' : '🔒 ') + esc(l.title) + '</b>' + (c.item_desc && l.desc ? '<span class="lk-rd">' + esc(l.desc.slice(0, 90)) + '</span>' : '') + '<small>' + [fmtMin(l.minutes), l.count ? lessonNote(l) + ' عنصر' : ''].filter(Boolean).join(' • ') + '</small>' + (c.progress && l.open ? '<i class="lk-pr" style="width:' + pc + '%"></i>' : '') + '</' + (l.open ? 'a' : 'div') + '>';
      }).join('') + '</div>';
    }).join('');
    var hero = '<div class="lk-bc lk-bc-hero"><div><small class="lk-sub" style="color:rgba(255,255,255,.8)">' + esc(m.year || '') + '</small><h1>' + esc(m.title) + '</h1>' + (m.desc ? '<div class="lk-sub" style="white-space:pre-line;margin-top:6px">' + esc(m.desc) + '</div>' : '') + '</div>' + (m.on || nxt ? '<button type="button" class="lk-btn" data-lk-start>' + (m.pct > 0 ? '▶ كمّل من مكانك' : '🚀 ابدأ الكورس') + '</button>' : '') + '</div>';
    var cells = '<div class="lk-bc lk-bc-ring"><div class="lk-ring" style="--p:' + m.pct + '"><b>' + m.pct + '%</b></div></div><div class="lk-bc lk-bc-st"><b>' + m.lessons.length + '</b><small>📚 محاضرة</small></div><div class="lk-bc lk-bc-st"><b>' + (m.minutes ? (m.minutes >= 60 ? Math.round(m.minutes / 6) / 10 : m.minutes) : '—') + '</b><small>⏱ ' + (m.minutes >= 60 ? 'ساعة' : 'دقيقة') + '</small></div><div class="lk-bc lk-bc-next"><small>الجاي عليك</small><b>' + (nxt ? esc(nxt.title) : 'خلّصت كل حاجة 🎉') + '</b></div>';
    return '<div class="lk"><div class="lk-bento">' + hero + cells + '</div>' + (m.top || '') + grids + exams(m) + '</div>';
  }
  function courseMag(c, m) {
    var gs = secGroups(m), rows = gs.map(function (g) {
      return (g.t ? '<div class="lk-msec">' + esc(g.t) + '</div>' : '') + g.ls.map(function (l) {
        return '<' + (l.open ? 'a href="' + esc(l.href || '#') + '"' : 'div') + ' class="lk-mrow' + (l.done ? ' dn' : '') + (l.open ? '' : ' lk') + '" data-lk-l="' + esc(l.id) + '"><span class="lk-mno">' + ('0' + l.n).slice(-2) + '</span><span class="lk-mbody"><b>' + esc(l.title) + '</b>' + (c.item_desc && l.desc ? '<em>' + esc(l.desc) + '</em>' : '') + '</span><span class="lk-mm2">' + (fmtMin(l.minutes) || '') + '<i>' + (l.done ? '✓ تمّ' : l.open ? (l.count ? lessonNote(l) + ' عنصر' : 'اقرأ ←') : '🔒 مقفولة') + '</i></span></' + (l.open ? 'a' : 'div') + '>';
      }).join('');
    }).join('');
    return '<div class="lk"><header class="lk-mh"><span class="lk-kick">' + esc(m.year || 'كورس') + '</span><h1 class="lk-mt">' + esc(m.title) + '</h1>' + (m.desc ? '<p>' + esc(m.desc) + '</p>' : '') + '<div class="lk-mm"><span>' + m.lessons.length + ' محاضرة</span>' + (m.minutes ? '<span>' + fmtMin(m.minutes) + '</span>' : '') + '<span>' + m.pct + '% مكتمل</span>'
      + (m.on || m.lessons.some(function (l) { return l.open; }) ? '<button type="button" class="lk-btn" data-lk-start>' + (m.pct > 0 ? 'كمّل القراءة ←' : 'ابدأ الكورس ←') + '</button>' : '') + '</div></header>' + (m.top || '') + rows + exams(m) + '</div>';
  }
  L.course = function (c, m) { return ({ sakr: courseSakr, gohary: courseGohary, cinema: courseCinema, paper: coursePaper, quest: courseQuest, bento: courseBento, mag: courseMag }[c.skin] || courseNova)(c, m); };


  /* ---------- صفحة المحاضرة ----------
     m = { course, courseHref, title, desc, pct, nDone, nTotal, groups:[{id,title,cur,open,nDone,nTotal,html}], prev:{href}, next:{href}, playerHtml } */
  L.side = function (c, m) {
    return (m.groups || []).map(function (g) {
      return '<div class="lk-grp' + (g.cur ? ' cur open' : '') + '"><button type="button" class="lk-gh" data-lk-tg><span>' + esc(g.title) + '</span><span class="lk-gc"' + (g.cur ? ' id="lkCnt"' : '') + '>' + (g.nTotal ? g.nDone + '/' + g.nTotal : '') + '</span><i>⌄</i></button><div class="lk-gb">' + (g.cur ? '<div id="itemList">' + (g.html || '') + '</div>' : (g.html || '')) + '</div></div>';
    }).join('');
  };
  L.lecture = function (c, m) {
    var descBlock = m.desc ? '<div class="lk-desc"><small>📝 ' + esc(c.lbl_desc) + '</small>' + esc(m.desc) + '</div>' : '';
    var ring = c.skin === 'nova' ? '<div class="lk-ring" style="--p:' + (m.pct || 0) + ';width:78px;height:78px"><b style="font-size:16px"><span data-lk-pct>' + (m.pct || 0) + '</span>%</b></div>' : '<div style="min-width:170px"><b style="font-size:13px"><span data-lk-pct>' + (m.pct || 0) + '</span>% من المحاضرة</b><div class="lk-bar" style="margin-top:5px"><i style="width:' + (m.pct || 0) + '%"></i></div></div>';
    return '<div class="lk"><div class="lk-top"><div><small>' + esc(m.course) + '</small><h1>' + esc(m.title) + '</h1></div><div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">' + ring + '<a class="lk-btn o" href="' + esc(m.courseHref || '#') + '">← كل المحاضرات</a></div></div>'
      + (c.desc_top ? descBlock : '') + '<div class="lk-body"><section class="lk-main"><div id="player">' + (m.playerHtml || '') + '</div>' + (c.desc_top ? '' : descBlock)
      + '<div class="lk-pn">' + (m.prev ? '<a class="lk-btn o" href="' + esc(m.prev.href) + '">→ المحاضرة السابقة</a>' : '<span></span>') + (m.next ? '<a class="lk-btn o" href="' + esc(m.next.href) + '">المحاضرة التالية ←</a>' : '') + '</div></section>'
      + '<aside class="lk-side"><div class="lk-sh">' + esc(c.lbl_side) + '</div><div id="lkSide">' + L.side(c, m) + '</div></aside></div></div>';
  };

  /* فتح/قفل المجموعات (أكورديون) — بيشتغل بالـ delegation على أي عنصر */
  L.wire = function (root) {
    if (!root || root.__lkw) return; root.__lkw = 1;
    root.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-lk-tg]'); if (!b) return; e.preventDefault(); var g = b.closest('.lk-grp'); if (g) g.classList.toggle('open'); });
  };

  /* احتفال بسيط (كونفيتي) */
  L.confetti = function (c) {
    try {
      if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      var cv = document.getElementById('lkConf'); if (cv) cv.remove(); cv = document.createElement('canvas'); cv.id = 'lkConf'; cv.width = innerWidth; cv.height = innerHeight; document.body.appendChild(cv);
      var x = cv.getContext('2d'), cols = [c.c1, c.c2, c.c3, '#fbbf24', '#ffffff'], ps = [], i;
      for (i = 0; i < 140; i++) ps.push({ x: innerWidth / 2 + (Math.random() - .5) * 120, y: innerHeight * .62, vx: (Math.random() - .5) * 15, vy: -Math.random() * 16 - 5, s: 5 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: cols[i % cols.length] });
      var t0 = performance.now();
      (function f(t) {
        var dt = t - t0; x.clearRect(0, 0, cv.width, cv.height);
        ps.forEach(function (p) { p.vy += .42; p.x += p.vx; p.y += p.vy; p.r += p.vr; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.globalAlpha = Math.max(0, 1 - dt / 2600); x.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * .6); x.restore(); });
        if (dt < 2600) requestAnimationFrame(f); else cv.remove();
      })(t0);
    } catch (e) {}
  };
})();
