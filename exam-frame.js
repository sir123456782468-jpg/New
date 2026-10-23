/* إطار الأسئلة الموحّد (هيدر + شريط السؤال + القطعة + فوتر) — بيتحمّل مرة واحدة والباقي نصوص.
   بيستخدمه quiz.html (الامتحان الحقيقي) و admin.html (تبويب «تصميم الأسئلة» والمعاينة الحية). */
(function () {
  if (window.XF) return;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const XF = window.XF = {};
  XF.DEFAULTS = { show_header: true, show_footer: true, show_chips: true, show_logo: true, show_photo: true, show_social: true, show_grade: true, show_site: true,
    brand_title: 'The Leader', brand_sub: 'IN ENGLISH', header_pill: '', teacher_name: 'Mr. Sherif Khafagy', teacher_sub: 'The Leader In English', site_url: '', facebook: '', whatsapp: '',
    grade_label: '', grade_num: '', c1: '#6b2d5c', c2: '#7d3a6c', a1: '#ef4444', a2: '#ec4899' };
  XF.merge = o => Object.assign({}, XF.DEFAULTS, o || {});
  XF.GRADES = { 'أولى إعدادي': ['1', 'الإعدادي'], 'ثانية إعدادي': ['2', 'الإعدادي'], 'ثالثة إعدادي': ['3', 'الإعدادي'], 'أولى ثانوي': ['1', 'الثانوي'], 'ثانية ثانوي': ['2', 'الثانوي'], 'ثالثة ثانوي': ['3', 'الثانوي'] };
  const css = document.createElement('style');
  css.textContent = `
.xf{background:var(--card);border:1px solid var(--line);border-radius:24px;overflow:hidden;box-shadow:0 14px 40px -20px rgba(107,45,92,.45);--xc1:#6b2d5c;--xc2:#7d3a6c;--xa1:#ef4444;--xa2:#ec4899;--xg:linear-gradient(135deg,var(--xa1),var(--xa2))}
.xf-h{background:linear-gradient(120deg,var(--xc1),var(--xc2));color:#fff;padding:12px 18px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;border-bottom:4px solid transparent;border-image:var(--xg) 1}
.xf-brand{display:flex;align-items:center;gap:10px;flex:1;min-width:170px}
.xf-logo{width:44px;height:44px;border-radius:13px;background:var(--xg);display:grid;place-items:center;font:800 25px Georgia,serif;color:#fff;flex:none;overflow:hidden;box-shadow:0 4px 14px rgba(236,72,153,.4)}
.xf-logo img{width:100%;height:100%;object-fit:cover;display:block}
.xf-wm{font-family:Georgia,'Times New Roman',serif;letter-spacing:.5px;line-height:1.1;direction:ltr;text-align:left}
.xf-wm b{font-size:17px;display:block;text-transform:uppercase}.xf-wm i{font:700 10px Arial,sans-serif;letter-spacing:2.5px;color:#ffb3cf;font-style:normal}
.xf-pill{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.22);border-radius:999px;padding:5px 14px;font-size:13px;font-weight:700;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.xf-pill.hl{background:var(--xg);border-color:transparent}
.xf-m{padding:14px 18px 0;display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.xf-qn{display:flex;align-items:center;gap:10px;flex:1;min-width:150px}
.xf-qn .n{width:52px;height:52px;border-radius:17px;background:var(--xg);color:#fff;font-weight:800;font-size:23px;display:grid;place-items:center;box-shadow:0 6px 16px rgba(239,68,68,.33)}
.xf-qn small{display:block;color:var(--muted);font-size:12px;font-weight:700}.xf-qn b{font-size:17px;font-weight:900;direction:ltr;display:block;text-align:right}
.xf-ch{border-radius:12px;padding:6px 13px;font-weight:800;font-size:13px}.xf-c1{background:rgba(99,102,241,.14);color:#6366f1}.xf-c2{background:rgba(245,158,11,.16);color:#d97706}
.xf-bk{width:42px;height:42px;border-radius:12px;border:1px solid var(--line);background:var(--soft);color:var(--muted);cursor:pointer;display:grid;place-items:center}.xf-bk.on{color:#f59e0b;background:rgba(245,158,11,.14);border-color:#f59e0b}
.xf-pw{margin:14px 18px 0}
.xf-pl{display:flex;align-items:center;gap:8px;background:var(--xg);color:#fff;font-weight:800;font-size:12px;padding:4px 14px;border-radius:12px 12px 0 0;width:max-content;max-width:100%;cursor:pointer;user-select:none;border:0;font-family:inherit}
.xf-pl small{font-weight:600;opacity:.9}
.xf-ps{padding:14px 12px 14px 16px;border:2px solid var(--line);border-radius:0 18px 18px 18px;background:var(--card);line-height:1.9;max-height:min(44vh,380px);overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-gutter:stable;scrollbar-color:var(--xa2,#ec4899) transparent}.xf-ps::-webkit-scrollbar{width:9px}.xf-ps::-webkit-scrollbar-track{background:rgba(100,116,139,.15);border-radius:9px;margin:10px 0}.xf-ps::-webkit-scrollbar-thumb{background:var(--xg,#ec4899);border-radius:9px;border:2px solid transparent;background-clip:padding-box}.xf-ps canvas{display:block;max-width:100%}
.xf-ps.off{display:none}
.xf-qt{margin:14px 18px 6px;padding:14px 16px;border-radius:18px;background:var(--soft);border-inline-start:5px solid var(--xa2);min-height:54px}
.xf-qt canvas{margin:0!important}
.xf-b{padding:6px 18px 16px}
.xf-f{background:linear-gradient(120deg,var(--xc1),var(--xc2));color:#fff;display:flex;align-items:center;gap:14px;padding:12px 18px;flex-wrap:wrap;border-top:4px solid transparent;border-image:var(--xg) 1}
.xf-ph{width:62px;height:62px;border-radius:50%;flex:none;overflow:hidden;border:3px solid var(--xa2);background:rgba(255,255,255,.1)}.xf-ph img{width:100%;height:100%;object-fit:cover;display:block}
.xf-ft{flex:1;min-width:150px;line-height:1.5;direction:ltr;text-align:left}.xf-ft b{font-size:16px;display:block}.xf-ft span{font-size:12px;opacity:.85;display:block;overflow-wrap:anywhere}
.xf-soc{display:flex;flex-direction:column;gap:6px;border-inline:1px solid rgba(255,255,255,.28);padding:0 14px;direction:ltr;font-size:13px}
.xf-soc .s{display:flex;align-items:center;gap:8px;overflow-wrap:anywhere}
.xf-ic{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font:800 13px Arial;font-style:normal;color:#fff;flex:none}.xf-ic.fb{background:#1877f2}.xf-ic.wa{background:#25d366}
.xf-g{background:var(--xg);border-radius:14px;padding:7px 15px;font-weight:800;text-align:center;font-size:12px;line-height:1.3}.xf-g b{font-size:25px;display:block}
.xf-lab{display:inline-block;background:var(--xg);color:#fff;font-weight:800;font-size:12px;padding:4px 14px;border-radius:12px 12px 0 0}.xf-lab small{font-weight:600;opacity:.9}
.xf-lines{width:100%;display:block;border:2px solid var(--line);border-radius:0 18px 18px 18px;background-color:var(--card);color:var(--ink);font:17px/36px Cairo,Arial,sans-serif;padding:6px 18px;resize:vertical;min-height:210px;background-image:repeating-linear-gradient(transparent,transparent 35px,var(--line) 35px,var(--line) 36px);background-attachment:local;outline:none}
.xf-lines:focus{border-color:var(--xa2)}
.xf-wc{margin:6px 4px 0;font-size:12px;color:var(--muted);font-weight:700}
.xf-opt{display:flex;align-items:center;gap:12px;border:2px solid var(--line);border-radius:18px;padding:8px 12px;background:var(--card);margin-bottom:10px;font-weight:700;font-size:16px;direction:ltr;text-align:left}
.xf-opt .l{width:38px;height:38px;border-radius:12px;background:var(--soft);color:var(--xa2);font-weight:800;font-size:16px;display:grid;place-items:center;flex:none;border:1.5px solid rgba(236,72,153,.28)}
.xf-opt.ok{border-color:#10b981;background:rgba(16,185,129,.1)}.xf-opt.ok .l{background:#10b981;color:#fff;border-color:#10b981}
@media(max-width:600px){.xf{border-radius:18px}.xf-h{padding:8px 12px;gap:8px}.xf-logo{width:36px;height:36px;font-size:20px;border-radius:11px}.xf-wm b{font-size:14px}.xf-pill{font-size:12px;padding:4px 10px;max-width:150px}
.xf-m,.xf-pw{padding-inline:12px;margin-inline:0}.xf-pw{margin-inline:12px;padding:0}.xf-m{padding-top:10px}.xf-qn .n{width:44px;height:44px;font-size:19px;border-radius:14px}.xf-qt{margin-inline:12px}.xf-b{padding-inline:12px}
.xf-f{padding:8px 12px;gap:10px}.xf-ph{width:44px;height:44px;border-width:2px}.xf-ft b{font-size:14px}.xf-soc{display:none}.xf-g{padding:5px 11px}.xf-g b{font-size:19px}}`;
  document.head.appendChild(css);

  XF.vars = F => '--xc1:' + F.c1 + ';--xc2:' + F.c2 + ';--xa1:' + F.a1 + ';--xa2:' + F.a2;
  XF.gradeText = F => { const g = XF.GRADES[F.year]; return g ? 'الصف ' + { '1': 'الأول', '2': 'الثاني', '3': 'الثالث' }[g[0]] + ' ' + g[1] : ''; };
  XF.head = (F, pill) => {
    if (!F.show_header) return '';
    const logo = F.show_logo ? '<div class="xf-logo"><img src="data:image/png;base64,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" alt="" draggable="false" onerror="this.replaceWith(document.createTextNode(\'L\'))"></div>' : '';
    const gt = XF.gradeText(F);
    return '<div class="xf-h"><div class="xf-brand">' + logo + '<div class="xf-wm"><b>' + esc(F.brand_title) + '</b><i>' + esc(F.brand_sub) + '</i></div></div>'
      + (F.header_pill || pill ? '<div class="xf-pill">' + esc(F.header_pill || pill) + '</div>' : '') + (F.show_grade && gt ? '<div class="xf-pill hl">' + esc(gt) + '</div>' : '') + '</div>';
  };
  XF.foot = F => {
    if (!F.show_footer) return '';
    const site = F.show_site ? (F.site_url || location.host) : '';
    const soc = F.show_social && (F.facebook || F.whatsapp) ? '<div class="xf-soc">' + (F.facebook ? '<div class="s"><i class="xf-ic fb">f</i><span>' + esc(F.facebook) + '</span></div>' : '') + (F.whatsapp ? '<div class="s"><i class="xf-ic wa">&#9990;</i><span>' + esc(F.whatsapp) + '</span></div>' : '') + '</div>' : '';
    const gb = F.show_grade && F.grade_num ? '<div class="xf-g">الصف<b>' + esc(F.grade_num) + '</b>' + esc(F.grade_label) + '</div>' : '';
    return '<div class="xf-f">' + (F.show_photo && F.photo ? '<div class="xf-ph"><img src="' + esc(F.photo) + '" alt="" draggable="false"></div>' : '')
      + '<div class="xf-ft"><b>' + esc(F.teacher_name) + '</b>' + (F.teacher_sub ? '<span>' + esc(F.teacher_sub) + '</span>' : '') + (site ? '<span>' + esc(site) + '</span>' : '') + '</div>' + soc + gb + '</div>';
  };
  XF.meta = (F, o) => '<div class="xf-m"><div class="xf-qn"><div class="n">' + esc(o.n) + '</div><div><small>السؤال رقم</small><b>Question ' + esc(o.n) + '</b></div></div>'
    + (F.show_chips ? '<span class="xf-ch xf-c1">' + esc(o.type) + '</span><span class="xf-ch xf-c2">الدرجة: (' + esc(o.pts) + ')</span>' : '') + (o.bm || '') + '</div>';
  // القطعة: عنوان قابل للطي + محتوى (inner = HTML جاهز، في الامتحان الحقيقي canvas)
  XF.passage = (o) => '<div class="xf-pw"><button type="button" class="xf-pl" data-pid="' + esc(o.id || '') + '">📖 Passage' + (o.title ? ' — ' + esc(o.title) : '') + ' <small>' + (o.collapsed ? '(اضغط للإظهار ▾)' : '(اضغط للإخفاء ▴)') + '</small></button><div class="xf-ps' + (o.collapsed ? ' off' : '') + '">' + (o.inner || '') + '</div></div>';
  XF.card = (F, o) => '<div class="xf" style="' + XF.vars(F) + '">' + XF.head(F, o.pill) + XF.meta(F, o) + (o.passage || '') + '<div class="xf-qt">' + (o.q || '') + '</div><div class="xf-b">' + (o.body || '') + '</div>' + (o.nav || '') + XF.foot(F) + '</div>';

  // معاينة بنص تجريبي (لوحة التحكم)
  XF.sample = (F, type) => {
    const pass = 'Many students find it difficult to learn a new language because they do not practise every day. Experts say that reading short texts and speaking with friends can make learning faster and more enjoyable.';
    const ps = XF.passage({ title: 'Reading', inner: '<div dir="ltr" style="text-align:left;font-size:16px">' + esc(pass) + '</div>' });
    if (type === 'essay') return XF.card(F, { pill: 'Unit 1 – Reading', n: 2, type: 'مقالي (Essay)', pts: 5, passage: ps, q: '<div dir="ltr" style="text-align:left;font-weight:700;font-size:18px;line-height:1.8">Write a short paragraph (4–5 sentences) about how you practise English every day.</div>',
      body: '<span class="xf-lab">Your answer <small>(مساحة إجابة الطالب)</small></span><textarea class="xf-lines" rows="6" dir="ltr" placeholder="Write your answer here..." readonly></textarea><div class="xf-wc">Words: 0</div>' });
    return XF.card(F, { pill: 'Unit 1 – Reading', n: 1, type: 'اختيار من متعدد', pts: 1, passage: ps, q: '<div dir="ltr" style="text-align:left;font-weight:700;font-size:18px;line-height:1.8">According to the passage, what can make learning faster?</div>',
      body: ['Reading short texts', 'Skipping lessons', 'Using only one book', 'Sleeping more'].map((t, i) => '<div class="xf-opt' + (i === 0 ? ' ok' : '') + '"><div class="l">' + 'ABCD'[i] + '</div><span>' + t + '</span></div>').join('') });
  };
  // تحميل الإطار الخاص بصف الطالب (مع تخزين محلي + نسخة عشان ما نحمّلش الصورة كل مرة)
  XF.load = async function (client, year) {
    const KEY = 'xf_cache_v1'; let c = null; try { c = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    try {
      const r = await client.rpc('exam_frame', { p_year: year || null, p_v: c && c.f && c.f.year === year ? c.f.v : null });
      if (r.error || !r.data) return XF.merge(c && c.f);
      if (r.data.unchanged && c && c.f) return XF.merge(c.f);
      const f = XF.merge(r.data); try { localStorage.setItem(KEY, JSON.stringify({ f })); } catch (e) {} return f;
    } catch (e) { return XF.merge(c && c.f); }
  };
})();
