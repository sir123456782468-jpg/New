// =====================================================================
// v4: تصحيح المقالي (بالسؤال لكل الطلاب | بالطالب) + "نتائج الطلاب" (شبكة الرصد: ترتيب بالمجموع الكلي
//     وملف كامل لكل طالب) + أداة إعادة تصحيح امتحان.
// بيتحمّل بعد admin-v3.js (ومحتاج db_21 → db_25)
// =====================================================================
(function () {
  const rpc = async (n, a) => { const r = await sb.rpc(n, a || {}); if (r.error) throw r.error; return r.data; };
  const AR = '٠١٢٣٤٥٦٧٨٩';
  const toNum = v => { const s = String(v == null ? '' : v).trim().replace(/[٠-٩]/g, d => AR.indexOf(d)).replace(/[,،٫]/g, '.'); if (s === '' || !/^\d+(\.\d+)?$/.test(s)) return NaN; return +s; };
  const fmt = n => { n = +n; if (!isFinite(n)) return '0'; return Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100); };
  const cut = (s, n) => { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n) + '…' : s; };
  const waNum = p => { p = String(p || '').replace(/\D/g, ''); return p.startsWith('0') ? '2' + p : p; };
  const secs = s => s == null ? '—' : Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  const today = () => new Date().toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' });

  // ---------- تنسيق ----------
  const st = document.createElement('style');
  st.textContent = [
    '.sub4{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 14px}.sub4 .yt b{font-weight:900}',
    '.eq-quiz{margin-bottom:16px}.eq-quiz>h4{margin:0 0 8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}',
    '.eq-row{display:flex;gap:12px;align-items:center;flex-wrap:wrap;padding:12px 14px;border:1px solid var(--line);border-radius:14px;background:var(--card);margin-bottom:8px}',
    '.eq-row .qt{flex:1;min-width:200px;font-weight:700;font-size:13.5px;line-height:1.8}.eq-row small{color:var(--muted);font-weight:600}',
    '.pbar{height:7px;border-radius:50px;background:var(--line);overflow:hidden;min-width:110px;flex:0 0 120px}.pbar i{display:block;height:100%;background:linear-gradient(90deg,#22c55e,#16a34a);border-radius:50px;transition:width .3s}',
    '.eqh{position:sticky;top:0;z-index:5;background:var(--bg);padding:10px 0 12px;margin-bottom:6px;border-bottom:1px solid var(--line)}',
    '.qbox{padding:14px 16px;border:1px solid var(--line);border-radius:14px;background:var(--card);line-height:2;font-weight:700;white-space:pre-wrap}',
    '.ec{position:relative;border:1px solid var(--line);border-radius:16px;background:var(--card);padding:14px 16px;margin-bottom:12px}',
    '.ec[data-done="1"]{border-color:rgba(34,197,94,.55)}.ec .ech{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px}.ec .ech b{font-size:14px}',
    '.eans{background:var(--bg);border:1px dashed var(--line);border-radius:12px;padding:12px 14px;white-space:pre-wrap;line-height:2;font-size:14px;min-height:42px}.eans.emp{color:var(--muted)}',
    '.eimg{max-width:100%;max-height:420px;border-radius:12px;margin-top:8px;border:1px solid var(--line);cursor:zoom-in;display:block;background:#fff}',
    '.egr{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:10px}.egr .esc{width:120px;text-align:center;font-weight:900;font-size:16px}.egr .efb{flex:1;min-width:180px}',
    '.egr .qk{padding:6px 10px;font-size:12px}',
    '.ec[data-done="1"]:not([data-edit="1"]) .eedit{display:none}.ec[data-done="0"] .eview,.ec[data-edit="1"] .eview{display:none}',
    '.eview{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px}.eview .sc{font-weight:900;font-size:16px;color:var(--ok)}.eview .fb{flex:1;min-width:160px;color:var(--muted);font-size:13px;font-weight:600}',
    '.ecs[data-f="pending"] .ec[data-done="1"]{display:none}.ecs[data-f="done"] .ec[data-done="0"]{display:none}',
    '.mn-med{display:inline-block;min-width:30px;height:30px;line-height:30px;border-radius:50%;text-align:center;font-weight:900;background:var(--line);color:var(--ink)}',
    '.mn-med.m1{background:#f59e0b;color:#fff}.mn-med.m2{background:#94a3b8;color:#fff}.mn-med.m3{background:#b45309;color:#fff}',
    '.mn-tbl tr.mnr{cursor:pointer}.mn-tbl tr.mnr:hover td{background:rgba(148,163,184,.1)}',
    '.mbar{height:8px;border-radius:50px;background:var(--line);overflow:hidden;min-width:90px}.mbar i{display:block;height:100%;border-radius:50px}',
    '.ovh{display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-bottom:12px}.ovh .av{width:54px;height:54px;border-radius:50%;background:var(--grad);color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900}',
    '.ovh h3{margin:0;font-size:18px}.ovh .rk{margin-right:auto;text-align:center;padding:8px 16px;border-radius:14px;background:var(--bg);border:1px solid var(--line)}.ovh .rk b{display:block;font-size:24px;color:var(--brand)}',
    '.ovi{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px;margin-bottom:12px}.ovi>div{padding:9px 12px;border-radius:12px;background:var(--bg);border:1px solid var(--line);font-size:13px;font-weight:700;overflow-wrap:anywhere}.ovi small{display:block;color:var(--muted);font-weight:600;font-size:11.5px}',
    '.ovi a{color:var(--brand);text-decoration:none;font-weight:800;margin-inline-start:8px;font-size:12px}',
    '.ovs{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px;margin-bottom:12px}.ovs>div{text-align:center;padding:10px 6px;border-radius:12px;border:1px solid var(--line);background:var(--card)}.ovs b{display:block;font-size:19px}.ovs span{font-size:11.5px;color:var(--muted);font-weight:700}',
    '.ovt{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}.ovsec{display:none}.ovsec.on{display:block}',
    '.wq{padding:10px 12px;border:1px solid var(--line);border-radius:12px;margin-bottom:8px;background:var(--card);font-size:13px;line-height:1.9}.wq .x{color:#ef4444;font-weight:800}.wq .v{color:var(--ok);font-weight:800}',
    '.pill.warn{background:rgba(245,158,11,.2);color:#f59e0b}.pill.gray{background:var(--line);color:var(--muted)}',
    '.tools4{margin-top:18px;padding:14px 16px;border:1px dashed var(--line);border-radius:14px;background:var(--card)}'
  ].join('');
  document.head.appendChild(st);

  // ---------- صلاحيات + قايمة ----------
  S.em = S.em || { mode: 'q', f: 'all', only: true };
  S.mn = S.mn || { hw: true, q: '', rows: [], sort: 'rank' };
  VPERM.monitor = ['results.view'];
  Object.assign(ACTPERM, {
    emSave: ['results.grade'], emEdit: ['results.grade'], emCancel: ['results.grade'], emClear: ['results.grade'], emQuick: ['results.grade'],
    emOpenQ: ['results.grade'], emOpenS: ['results.grade'], emMode: ['results.grade'], emFilter: ['results.grade'], emOnly: ['results.grade'], emNext: ['results.grade'],
    mnOpen: ['results.view'], mnHw: ['results.view'], mnCsv: ['results.view'], mnTab: ['results.view'], mnRef: ['results.view'], mnRegrade: ['content.edit', 'results.grade'], mnDoRegrade: ['content.edit', 'results.grade']
  });
  (function () {
    const i = NAV.findIndex(n => n[0] === 'sres');
    if (i >= 0) NAV[i] = ['sres', '📈', 'تحليل الامتحانات والأخطاء'];
    if (!NAV.some(n => n[0] === 'monitor')) NAV.splice(i >= 0 ? i : NAV.length, 0, ['monitor', '🏆', 'نتائج الطلاب (الرصد)']);
    if (window.__allow) window.__allow.add('monitor');
  })();

  const signImgs = root => (root || document).querySelectorAll('img[data-eimg]').forEach(async im => {
    try { const sg = await sb.storage.from('essay-files').createSignedUrl(im.dataset.eimg, 3600); if (sg.data) { im.src = sg.data.signedUrl; im.onclick = () => window.open(sg.data.signedUrl, '_blank'); } else im.alt = 'تعذر تحميل الصورة'; } catch (e) { im.alt = 'تعذر تحميل الصورة'; }
  });

  // =====================================================================
  //  تصحيح المقالي
  // =====================================================================
  const eTabs = () => '<div class="sub4"><button class="yt' + (S.em.mode === 'q' ? ' on' : '') + '" data-act="emMode" data-id="q">📋 بالسؤال — سؤال واحد لكل الطلاب</button>'
    + '<button class="yt' + (S.em.mode === 's' ? ' on' : '') + '" data-act="emMode" data-id="s">👤 بالطالب — المقالي بس</button>'
    + '<button class="btn s g" data-go="essay" style="margin-right:auto">🔄 تحديث</button></div>';

  async function vEssay4(arg) {
    if (!S.y) S.y = YEARS[0];
    if (arg && arg.indexOf('q:') === 0) return essayQuestion(arg.slice(2));
    if (arg && arg.indexOf('s:') === 0) return essayAttempt(arg.slice(2));
    const head = '<p class="nt">التصحيح هنا للمقالي فقط، وكل صف لوحده. <b>بالسؤال</b>: تفتح سؤال واحد وتصحّحه لكل طلاب الصف مرة واحدة (أسرع وأدق)، وبعدين السؤال اللي بعده. <b>بالطالب</b>: تفتح طالب وتصحّح أسئلة المقالي بتاعته بس. أي درجة بتتحفظ فوراً وتقدر تعدّلها في أي وقت من زرار "تعديل".</p>' + yearTabs('essay') + eTabs();
    return head + (S.em.mode === 's' ? await essayStudentsList() : await essayQuestionsList());
  }

  async function essayQuestionsList() {
    const rows = await rpc('essay_overview', { p_year: S.y });
    const only = S.em.only, shown = rows.filter(r => !only || r.pending > 0);
    const pendTotal = rows.reduce((t, r) => t + (+r.pending), 0);
    const by = {}; shown.forEach(r => { (by[r.quiz_id] = by[r.quiz_id] || { t: r.quiz_title, rows: [] }).rows.push(r); });
    const bar = '<div class="bar"><span class="pill ' + (pendTotal ? 'no' : 'ok') + '">' + (pendTotal ? pendTotal + ' إجابة مقالية مستنية التصحيح في ' + esc(S.y) : 'مفيش حاجة معلّقة في الصف ده ✅') + '</span>'
      + '<label class="chk" style="margin:0 auto 0 0;cursor:pointer"><input type="checkbox" class="ck" data-act="emOnly"' + (only ? ' checked' : '') + '> إخفاء الأسئلة المصحّحة بالكامل</label></div>';
    const html = Object.keys(by).map(k => {
      const g = by[k];
      return '<div class="eq-quiz"><h4>📝 ' + esc(g.t) + '</h4>' + g.rows.map(r => {
        const tot = +r.total, gr = +r.graded, p = tot ? Math.round(gr / tot * 100) : 0;
        return '<div class="eq-row"><div class="qt">سؤال ' + esc(r.position) + ': ' + esc(cut(r.question, 110)) + '<br><small>الدرجة العظمى ' + fmt(r.points) + ' • ' + tot + ' إجابة</small></div>'
          + '<div><div class="pbar"><i style="width:' + p + '%"></i></div><small>' + gr + '/' + tot + ' مصحّح</small></div>'
          + '<span class="pill ' + (r.pending > 0 ? 'no' : 'ok') + '">' + (r.pending > 0 ? r.pending + ' متبقي' : '✅ تم') + '</span>'
          + '<button class="btn s" data-act="emOpenQ" data-id="' + r.question_id + '">' + (r.pending > 0 ? (gr ? '✍️ كمّل التصحيح' : '✍️ ابدأ التصحيح') : '✏️ مراجعة / تعديل') + '</button></div>';
      }).join('') + '</div>';
    }).join('');
    return bar + (html || '<div class="empty">' + (rows.length ? 'كل الأسئلة المقالية اتصحّحت ✅ — شيل علامة الإخفاء لو عايز تراجعها.' : 'مفيش إجابات مقالية للصف ده لسه.') + '</div>');
  }

  async function essayStudentsList() {
    const rows = await rpc('essay_students', { p_year: S.y });
    S.esFlat = [];
    rows.forEach(r => (r.attempts || []).forEach(a => S.esFlat.push({ aid: a.attempt_id, name: r.name, quiz: a.quiz_title, pending: +r.pending })));
    const pend = rows.filter(r => r.pending > 0).length;
    window.__esRows = rows;
    setTimeout(() => { const q = $('#esq'); if (q) { q.addEventListener('input', drawEs); drawEs(); } });
    return '<div class="bar"><input id="esq" placeholder="🔍 بحث بالاسم أو الهاتف"><label class="chk" style="margin:0;cursor:pointer"><input type="checkbox" class="ck" id="esp" checked> اللي عنده متبقي بس</label><span class="pill ' + (pend ? 'no' : 'ok') + '">' + pend + ' طالب مستني تصحيح</span></div>'
      + '<div class="tw"><table class="mn-tbl"><tr><th>الطالب</th><th>الحالة</th><th>الامتحانات (اضغط للتصحيح)</th></tr><tbody id="esb"></tbody></table></div>';
  }
  function drawEs() {
    const q = ($('#esq').value || '').trim().toLowerCase(), only = $('#esp').checked;
    $('#esp').onchange = drawEs;
    const rows = (window.__esRows || []).filter(r => (!only || r.pending > 0) && (!q || (r.name + ' ' + r.phone).toLowerCase().includes(q)));
    $('#esb').innerHTML = rows.map(r => '<tr><td>' + esc(r.name) + '<br><small style="color:var(--muted)" dir="ltr">' + esc(r.phone) + '</small></td>'
      + '<td><span class="pill ' + (r.pending > 0 ? 'no' : 'ok') + '">' + (r.pending > 0 ? r.pending + ' متبقي' : '✅ تم') + '</span> <small style="color:var(--muted)">' + r.graded + ' مصحّح</small></td>'
      + '<td>' + (r.attempts || []).map(a => '<button class="btn s g" style="margin:2px" data-act="emOpenS" data-id="' + a.attempt_id + '">✍️ ' + esc(a.quiz_title) + '</button>').join('') + '</td></tr>').join('')
      || '<tr><td colspan="3" class="empty">لا يوجد</td></tr>';
    applyActGate($('#esb'));
  }

  // بطاقة تصحيح (بتتستخدم في الوضعين)
  function eCard(it, qid, pts, label) {
    const done = it.score != null, aid = it.attempt_id, has = it.text && String(it.text).trim();
    return '<div class="ec" id="ec_' + aid + '_' + qid + '" data-a="' + aid + '" data-q="' + qid + '" data-pts="' + pts + '" data-done="' + (done ? 1 : 0) + '">'
      + '<div class="ech"><b>' + label + '</b><span class="pill ' + (done ? 'ok' : 'no') + ' st">' + (done ? '✅ محفوظة' : '⏳ لم تُصحَّح') + '</span></div>'
      + '<div class="eans' + (has ? '' : ' emp') + '" dir="auto">' + (has ? esc(it.text) : '(لا يوجد نص — الإجابة صورة)') + '</div>'
      + (it.image ? '<img class="eimg" data-eimg="' + esc(it.image) + '" alt="جاري تحميل الصورة…">' : '')
      + '<div class="egr eedit"><input class="esc" type="text" inputmode="decimal" placeholder="من ' + fmt(pts) + '" value="' + (done ? fmt(it.score) : '') + '" aria-label="الدرجة">'
      + '<button class="btn s g qk" data-act="emQuick" data-id="0">0</button><button class="btn s g qk" data-act="emQuick" data-id="h">½</button><button class="btn s g qk" data-act="emQuick" data-id="f">كامل ' + fmt(pts) + '</button>'
      + '<input class="efb" type="text" placeholder="تعليق للطالب (اختياري)" value="' + esc(it.feedback || '') + '" maxlength="500">'
      + '<button class="btn s" data-act="emSave">💾 حفظ</button>' + (done ? '<button class="btn s g" data-act="emCancel">إلغاء</button><button class="btn s r" data-act="emClear" title="يرجّعها لحالة (لم تُصحَّح)">🗑️</button>' : '') + '</div>'
      + '<div class="eview"><span class="sc">' + (done ? fmt(it.score) : '') + ' / ' + fmt(pts) + '</span><span class="fb">' + (it.feedback ? '💬 ' + esc(it.feedback) : '') + '</span><button class="btn s g" data-act="emEdit">✏️ تعديل</button></div>'
      + '</div>';
  }

  async function essayQuestion(qid) {
    const d = await rpc('essay_question_answers', { p_question: qid, p_year: S.y }), q = d.question, items = d.items || [];
    S.eq = { qid, quiz: q.quiz_id, pts: +q.points };
    setTimeout(() => signImgs($('#view')));
    return '<div class="eqh"><div class="bar" style="margin:0 0 8px"><button class="btn s g" data-go="essay">⬅️ رجوع للقايمة</button><b>📝 ' + esc(q.quiz_title) + '</b><span class="pill gray">' + esc(S.y) + '</span><span id="eqp" style="margin-right:auto;font-weight:800"></span></div>'
      + '<div class="pbar" style="flex:1;width:100%"><i id="eqbar" style="width:0"></i></div>'
      + '<div class="bar" style="margin:10px 0 0"><span style="font-weight:800;font-size:13px">عرض:</span>'
      + '<button class="yt on" data-act="emFilter" data-id="all">الكل</button><button class="yt" data-act="emFilter" data-id="pending">⏳ المتبقي</button><button class="yt" data-act="emFilter" data-id="done">✅ المصحّح</button>'
      + '<button class="btn s" data-act="emNext" style="margin-right:auto">السؤال التالي ⬅️</button></div></div>'
      + '<div class="qbox">' + esc(q.question) + (q.image_url ? '<br><img class="eimg" src="' + esc(q.image_url) + '" alt="" style="max-height:260px">' : '') + '<div style="margin-top:8px;color:var(--muted);font-size:12.5px;font-weight:700">الدرجة العظمى: ' + fmt(q.points) + (q.note ? ' • ملاحظة: ' + esc(q.note) : '') + '</div></div>'
      + '<div class="ecs" data-f="all" id="ecs" style="margin-top:14px">' + (items.length ? items.map((it, i) => eCard(it, qid, +q.points, (i + 1) + '. ' + esc(it.name))).join('') : '<div class="empty">مفيش طلاب جاوبوا على السؤال ده في ' + esc(S.y) + ' لسه.</div>') + '</div>'
      ;
  }

  async function essayAttempt(aid) {
    const d = await rpc('essay_attempt', { p_attempt: aid }), items = d.items || [];
    S.ea = { aid, total: +d.total };
    const idx = (S.esFlat || []).findIndex(x => x.aid === aid);
    setTimeout(() => signImgs($('#view')));
    return '<div class="eqh"><div class="bar" style="margin:0 0 8px"><button class="btn s g" data-go="essay">⬅️ رجوع للقايمة</button><b>👤 ' + esc(d.student) + '</b><span class="pill gray">' + esc(d.year || '') + '</span><span class="pill gray">📝 ' + esc(d.quiz_title) + '</span>'
      + '<span style="margin-right:auto;font-weight:800">الدرجة الحالية: <span id="eaScore">' + fmt(d.score) + ' / ' + fmt(d.total) + '</span></span></div>'
      + '<div class="pbar" style="flex:1;width:100%"><i id="eqbar" style="width:0"></i></div>'
      + '<div class="bar" style="margin:10px 0 0"><span id="eqp" style="font-weight:800"></span><button class="btn s" data-act="emNext" data-id="' + (idx >= 0 ? idx : -1) + '" style="margin-right:auto">الطالب التالي ⬅️</button></div></div>'
      + '<div class="ecs" data-f="all" id="ecs" style="margin-top:14px">' + (items.length ? items.map((it, i) => '<div class="qbox" style="margin-bottom:6px;font-weight:700">سؤال ' + (i + 1) + ': ' + esc(it.question) + '</div>' + eCard(Object.assign({ attempt_id: aid }, it), it.question_id, +it.points, 'إجابة الطالب')).join('') : '<div class="empty">مفيش أسئلة مقالية في المحاولة دي.</div>') + '</div>';
  }

  function eqRefresh() {
    const cards = [...document.querySelectorAll('#ecs .ec')], n = cards.length, d = cards.filter(c => c.dataset.done === '1').length;
    const bar = $('#eqbar'), p = $('#eqp'); if (bar) bar.style.width = (n ? Math.round(d / n * 100) : 0) + '%';
    if (p) p.textContent = d + ' / ' + n + ' اتصحّح' + (n && d === n ? ' ✅' : '');
  }
  const cardOf = el => el.closest('.ec');
  const focusNext = card => {
    const n = [...document.querySelectorAll('#ecs .ec')].find(c => c.dataset.done === '0' && c !== card && (c.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_PRECEDING));
    const t = n || [...document.querySelectorAll('#ecs .ec')].find(c => c.dataset.done === '0' && c !== card);
    if (t) { t.scrollIntoView({ behavior: 'smooth', block: 'center' }); const i = t.querySelector('.esc'); if (i) setTimeout(() => i.focus(), 250); }
  };
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.classList && (e.target.classList.contains('esc') || e.target.classList.contains('efb'))) { e.preventDefault(); const b = cardOf(e.target).querySelector('[data-act="emSave"]'); if (b) b.click(); }
  });

  Object.assign(ACT, {
    emMode: id => { S.em.mode = id; go('essay'); },
    emOnly: (id, el) => { S.em.only = !!el.checked; go('essay'); },
    emOpenQ: id => go('essay', 'q:' + id),
    emOpenS: id => go('essay', 's:' + id),
    emFilter: (id, el) => { const box = $('#ecs'); if (!box) return; box.dataset.f = id; el.parentNode.querySelectorAll('.yt').forEach(b => b.classList.toggle('on', b === el)); },
    emQuick: (id, el) => { const c = cardOf(el), pts = +c.dataset.pts, i = c.querySelector('.esc'); i.value = id === '0' ? '0' : id === 'h' ? fmt(pts / 2) : fmt(pts); i.focus(); },
    emEdit: (id, el) => { const c = cardOf(el); c.dataset.edit = '1'; const i = c.querySelector('.esc'); i.focus(); i.select(); },
    emCancel: (id, el) => { const c = cardOf(el); delete c.dataset.edit; },
    emSave: async (id, el) => {
      const c = cardOf(el), pts = +c.dataset.pts, v = toNum(c.querySelector('.esc').value), fb = c.querySelector('.efb').value.trim();
      if (isNaN(v)) { c.querySelector('.esc').focus(); return toast('اكتب الدرجة كرقم (مثال: 3 أو 2.5)', true); }
      if (v < 0 || v > pts) { c.querySelector('.esc').focus(); return toast('الدرجة لازم تكون من 0 إلى ' + fmt(pts), true); }
      el.disabled = true;
      try {
        const r = await rpc('save_essay_grade', { p_attempt: c.dataset.a, p_question: c.dataset.q, p_score: v, p_feedback: fb || null });
        c.dataset.done = '1'; delete c.dataset.edit; c.querySelector('.esc').value = fmt(v);
        const sc = c.querySelector('.eview .sc'); sc.textContent = fmt(v) + ' / ' + fmt(pts); c.querySelector('.eview .fb').textContent = fb ? '💬 ' + fb : '';
        const pl = c.querySelector('.st'); pl.className = 'pill ok st'; pl.textContent = '✅ محفوظة';
        if (!c.querySelector('[data-act="emClear"]')) { const g = c.querySelector('.eedit'); g.insertAdjacentHTML('beforeend', '<button class="btn s g" data-act="emCancel">إلغاء</button><button class="btn s r" data-act="emClear" title="يرجّعها لحالة (لم تُصحَّح)">🗑️</button>'); }
        const es = $('#eaScore'); if (es && r) es.textContent = fmt(r.score) + ' / ' + fmt(r.total);
        S.atc = null; eqRefresh(); toast('تم الحفظ ✅'); focusNext(c);
      } finally { el.disabled = false; }
    },
    emClear: async (id, el) => {
      const c = cardOf(el); if (!confirm('إلغاء تصحيح الإجابة دي؟ هترجع "لم تُصحَّح" وتخصم درجتها.')) return;
      const r = await rpc('save_essay_grade', { p_attempt: c.dataset.a, p_question: c.dataset.q, p_score: null, p_feedback: null });
      c.dataset.done = '0'; delete c.dataset.edit; c.querySelector('.esc').value = ''; c.querySelector('.efb').value = '';
      const pl = c.querySelector('.st'); pl.className = 'pill no st'; pl.textContent = '⏳ لم تُصحَّح';
      c.querySelectorAll('[data-act="emCancel"],[data-act="emClear"]').forEach(b => b.remove());
      const es = $('#eaScore'); if (es && r) es.textContent = fmt(r.score) + ' / ' + fmt(r.total);
      S.atc = null; eqRefresh();
    },
    emNext: async (id) => {
      if (S.ea) {   // الطالب التالي (اللي عنده متبقي)
        const list = S.esFlat || [], cur = list.findIndex(x => x.aid === S.ea.aid);
        const nx = list.slice(cur + 1).find(x => x.pending > 0) || list.find(x => x.pending > 0 && x.aid !== S.ea.aid);
        if (nx) return go('essay', 's:' + nx.aid); toast('مفيش طالب تاني متبقي ✅'); return go('essay');
      }
      const rows = await rpc('essay_overview', { p_year: S.y }), cur = rows.findIndex(r => r.question_id === (S.eq && S.eq.qid));
      const nx = rows.slice(cur + 1).find(r => r.pending > 0) || rows.find(r => r.pending > 0 && r.question_id !== (S.eq && S.eq.qid));
      if (nx) return go('essay', 'q:' + nx.question_id); toast('مفيش سؤال تاني متبقي ✅'); go('essay');
    }
  });
  // بنصفّر حالة الوضع لما نرجع للقايمة
  VIEWS.essay = ['تصحيح المقالي', async arg => { if (!arg) { S.ea = null; S.eq = null; } else if (arg.indexOf('q:') === 0) S.ea = null; else if (arg.indexOf('s:') === 0) S.eq = null; const h = await vEssay4(arg); setTimeout(eqRefresh, 50); return h; }];

  // =====================================================================
  //  نتائج الطلاب (شبكة الرصد)
  // =====================================================================
  const col = p => p >= 85 ? '#22c55e' : p >= 65 ? '#84cc16' : p >= 50 ? '#f59e0b' : '#ef4444';

  async function vMonitor() {
    if (!S.y) S.y = YEARS[0];
    const d = await rpc('grade_leaderboard', { p_year: S.y, p_homework: S.mn.hw });
    S.mn.rows = d.rows || []; S.mn.at = d.generated_at;
    const rows = S.mn.rows, n = rows.length, att = rows.filter(r => r.attended > 0).length;
    const avg = n ? Math.round(rows.reduce((t, r) => t + (+r.pct), 0) / n) : 0, miss = rows.reduce((t, r) => t + r.missed, 0), pend = rows.reduce((t, r) => t + r.pending, 0);
    setTimeout(() => { const q = $('#mnq'); if (q) { q.value = S.mn.q || ''; q.addEventListener('input', () => { S.mn.q = q.value; drawMn(); }); const s = $('#mns'); s.value = S.mn.sort; s.addEventListener('change', () => { S.mn.sort = s.value; drawMn(); }); drawMn(); } });
    return '<p class="nt">الترتيب بـ<b>المجموع الكلي للدرجات</b> في كل امتحانات الصف (مش بعدد الامتحانات). اللي ما دخلش امتحان اتقفل بياخد صفر وبيتسجّل "لم يحضر". اضغط على أي طالب لفتح ملفه الكامل: بياناته وأرقامه ودرجاته وأخطاؤه.</p>'
      + yearTabs('monitor')
      + '<div class="grid sm" style="margin-bottom:14px">' + [[n, 'طلاب الصف'], [att, 'دخلوا امتحان'], [avg + '%', 'متوسط النسب'], [miss, 'حالات "لم يحضر"'], [pend, 'مقالي معلّق']].map(x => '<div class="card stat"><b>' + x[0] + '</b><span>' + x[1] + '</span></div>').join('') + '</div>'
      + '<div class="bar"><input id="mnq" placeholder="🔍 بحث بالاسم أو رقم الطالب أو ولي الأمر"><select id="mns"><option value="rank">ترتيب: الأعلى مجموعاً</option><option value="name">ترتيب: بالاسم</option><option value="miss">الأكتر غياباً</option><option value="pct">الأعلى نسبة</option></select>'
      + '<label class="chk" style="margin:0;cursor:pointer"><input type="checkbox" class="ck" data-act="mnHw"' + (S.mn.hw ? ' checked' : '') + '> يشمل الواجبات</label>'
      + '<button class="btn s g" data-act="mnRef">🔄 تحديث</button><button class="btn s g" data-act="mnCsv">⬇️ تصدير Excel</button></div>'
      + '<div class="tw"><table class="mn-tbl"><tr><th>#</th><th>الطالب</th><th>ولي الأمر</th><th>المجموع</th><th>النسبة</th><th>حضر</th><th>فاته</th><th>مقالي</th><th></th></tr><tbody id="mnb"></tbody></table></div>'
      + '<div class="tools4"><b>🔄 أدوات</b><p class="nt" style="margin:6px 0 10px">لما تعدّل الإجابة الصحيحة لسؤال (أو درجته) بيتعدّل عند كل الطلاب أوتوماتيك. لو عدّلت قبل تركيب التحديث ده وعايز تتأكد، اختار الامتحان وأعد التصحيح لكل الطلاب.</p><button class="btn s" data-act="mnRegrade">🧮 إعادة تصحيح امتحان لكل الطلاب</button></div>'
      + '<p class="nt" style="margin-top:10px">آخر تحديث: ' + today() + '</p>';
  }
  VIEWS.monitor = ['نتائج الطلاب (الرصد)', vMonitor];

  function drawMn() {
    const q = (S.mn.q || '').trim().toLowerCase();
    let rows = S.mn.rows.filter(r => !q || (r.name + ' ' + r.phone + ' ' + r.parent_phone).toLowerCase().includes(q));
    const so = S.mn.sort;
    if (so === 'name') rows = rows.slice().sort((a, b) => a.name.localeCompare(b.name, 'ar'));
    else if (so === 'miss') rows = rows.slice().sort((a, b) => b.missed - a.missed || a.rank - b.rank);
    else if (so === 'pct') rows = rows.slice().sort((a, b) => b.pct - a.pct || a.rank - b.rank);
    $('#mnb').innerHTML = rows.map(r => {
      const p = +r.pct;
      return '<tr class="mnr" data-act="mnOpen" data-id="' + r.student_id + '"><td><span class="mn-med' + (r.rank <= 3 && r.due ? ' m' + r.rank : '') + '">' + r.rank + '</span></td>'
        + '<td><b>' + esc(r.name) + '</b>' + (r.blocked ? ' <span class="pill no">موقوف</span>' : '') + '<br><small style="color:var(--muted)" dir="ltr">' + esc(r.phone) + '</small></td>'
        + '<td dir="ltr" style="text-align:right">' + esc(r.parent_phone) + '</td>'
        + '<td><b>' + fmt(r.score) + '</b><small style="color:var(--muted)"> / ' + fmt(r.possible) + '</small></td>'
        + '<td>' + (r.due ? '<div class="mbar"><i style="width:' + Math.min(100, p) + '%;background:' + col(p) + '"></i></div><small style="font-weight:800">' + fmt(p) + '%</small>' : '<small style="color:var(--muted)">—</small>') + '</td>'
        + '<td>' + r.attended + '<small style="color:var(--muted)"> / ' + r.due + '</small></td>'
        + '<td>' + (r.missed ? '<span class="pill no">لم يحضر ' + r.missed + '</span>' : '<span style="color:var(--muted)">—</span>') + '</td>'
        + '<td>' + (r.pending ? '<span class="pill warn">⏳ ' + r.pending + '</span>' : '<span style="color:var(--muted)">—</span>') + '</td>'
        + '<td style="color:var(--muted)">›</td></tr>';
    }).join('') || '<tr><td colspan="9" class="empty">' + (S.mn.rows.length ? 'لا توجد نتائج مطابقة' : 'مفيش طلاب مسجّلين في ' + esc(S.y) + ' لسه.') + '</td></tr>';
  }

  const stPill = e => e.state === 'attended' ? '<span class="pill ok">✅ حضر</span>' : e.state === 'pending' ? '<span class="pill warn">⏳ مقالي بانتظار التصحيح</span>' : e.state === 'missed' ? '<span class="pill no">❌ لم يحضر</span>' : '<span class="pill gray">🕒 لم يُغلق بعد</span>';

  async function openStudent(id) {
    const o = await rpc('student_overview', { p_student: id, p_homework: S.mn.hw }), s = o.student, m = o.summary;
    window.__ov = o;
    const info = '<div class="ovi">'
      + '<div><small>📱 رقم الطالب</small><span dir="ltr">' + esc(s.phone) + '</span><a href="tel:' + esc(s.phone) + '">اتصال</a><a target="_blank" rel="noopener" href="https://wa.me/' + waNum(s.phone) + '">واتساب</a></div>'
      + '<div><small>👨‍👩‍👦 رقم ولي الأمر</small><span dir="ltr">' + esc(s.parent_phone) + '</span><a href="tel:' + esc(s.parent_phone) + '">اتصال</a><a target="_blank" rel="noopener" href="https://wa.me/' + waNum(s.parent_phone) + '">واتساب</a></div>'
      + '<div><small>✉️ الإيميل</small><span dir="ltr">' + esc(s.email || '—') + '</span></div>'
      + '<div><small>🎓 الصف</small>' + esc(s.year) + '</div>'
      + '<div><small>📍 المحافظة</small>' + esc(s.governorate || '—') + '</div>'
      + '<div><small>🗓️ تاريخ التسجيل</small>' + fdate(s.created_at) + '</div>'
      + '<div style="grid-column:1/-1"><small>📚 الكورسات المشترك فيها</small>' + ((o.courses || []).length ? o.courses.map(c => '<span class="pill gray" style="margin:2px">' + esc(c) + '</span>').join('') : '<span style="color:var(--muted)">لا يوجد اشتراك</span>') + '</div></div>';
    const sum = '<div class="ovs">' + [[fmt(m.score) + '<small style="font-size:12px;color:var(--muted)"> / ' + fmt(m.possible) + '</small>', 'المجموع الكلي'], [fmt(m.pct) + '%', 'النسبة'], [m.attended, 'امتحانات حضرها'], [m.missed, 'لم يحضر'], [m.upcoming, 'لسه مفتوحة'], [m.pending, 'مقالي معلّق']].map(x => '<div><b>' + x[0] + '</b><span>' + x[1] + '</span></div>').join('') + '</div>';
    const ex = (o.exams || []).map(e => '<tr><td>' + esc(e.title) + (e.homework ? ' <span class="pill gray">واجب</span>' : '') + '<br><small style="color:var(--muted)">' + esc(e.course || (e.kind === 'comprehensive' ? 'امتحان شامل' : '')) + '</small></td>'
      + '<td>' + stPill(e) + '</td><td>' + (e.attempt_id ? '<b>' + fmt(e.score) + '</b> / ' + fmt(e.total) + ' <small style="color:var(--muted)">(' + (e.total ? Math.round(e.score / e.total * 100) : 0) + '%)</small>' : (e.state === 'missed' ? '<b style="color:#ef4444">0</b> / ' + fmt(e.possible) : '—')) + '</td>'
      + '<td>' + (e.attempt_id ? (e.violations ? '<span class="pill warn">⚠️ ' + e.violations + '</span> ' : '') + '<small style="color:var(--muted)">⏱ ' + secs(e.seconds) + ' • محاولات ' + e.attempts + '</small>' : '') + '</td>'
      + '<td>' + (e.attempt_id ? '<button class="btn s g" data-act="attempt" data-id="' + e.attempt_id + '">👁️ إجاباته</button>' : '') + '</td></tr>').join('') || '<tr><td colspan="5" class="empty">لا توجد امتحانات تخصه</td></tr>';
    const byQ = {}; (o.wrong || []).forEach(w => { (byQ[w.quiz] = byQ[w.quiz] || []).push(w); });
    const wr = Object.keys(byQ).map(k => '<h4 style="margin:12px 0 6px">📝 ' + esc(k) + ' <span class="pill no">' + byQ[k].length + ' خطأ</span></h4>' + byQ[k].map(w => '<div class="wq" dir="auto">' + esc(cut(w.question, 220)) + '<br><span class="x">إجابته: ' + esc(w.chosen || 'لم يُجب') + '</span> &nbsp;•&nbsp; <span class="v">الصح: ' + esc(w.correct || '—') + '</span></div>').join('')).join('') || '<div class="empty">مفيش أخطاء مسجّلة 🎉</div>';
    const es = (o.essays || []).map(e => '<div class="wq" dir="auto"><b>' + esc(e.quiz) + '</b> — ' + esc(cut(e.question, 160)) + '<br>' + (e.graded ? '<span class="v">' + fmt(e.score) + ' / ' + fmt(e.points) + '</span>' : '<span class="pill warn">⏳ لم تُصحَّح</span>') + (e.feedback ? ' &nbsp;💬 ' + esc(e.feedback) : '') + '</div>').join('') || '<div class="empty">لا توجد إجابات مقالية</div>';
    const html = '<div class="ovh"><div class="av">' + esc((s.name || '؟').charAt(0)) + '</div><div><h3>' + esc(s.name) + (s.blocked ? ' <span class="pill no">موقوف</span>' : '') + '</h3><small style="color:var(--muted)">' + esc(s.year) + '</small></div><div class="rk"><b>#' + m.rank + '</b><small>من ' + m.of + ' طالب</small></div></div>'
      + info + sum
      + '<div class="ovt"><button class="yt on" data-act="mnTab" data-id="ex">📝 الامتحانات (' + (o.exams || []).length + ')</button><button class="yt" data-act="mnTab" data-id="wr">🧠 الأخطاء (' + (o.wrong || []).length + ')</button><button class="yt" data-act="mnTab" data-id="es">✍️ المقالي (' + (o.essays || []).length + ')</button></div>'
      + '<div class="ovsec on" id="ov_ex"><div class="tw"><table><tr><th>الامتحان</th><th>الحالة</th><th>الدرجة</th><th>تفاصيل</th><th></th></tr>' + ex + '</table></div></div>'
      + '<div class="ovsec" id="ov_wr">' + wr + '</div><div class="ovsec" id="ov_es">' + es + '</div>';
    modal('🔎 ' + s.name, html); const mb = $('#modal .mbox'); if (mb) mb.classList.add('wide');
  }

  Object.assign(ACT, {
    mnOpen: id => openStudent(id),
    mnTab: (id, el) => { document.querySelectorAll('.ovsec').forEach(x => x.classList.toggle('on', x.id === 'ov_' + id)); el.parentNode.querySelectorAll('.yt').forEach(b => b.classList.toggle('on', b === el)); },
    mnHw: (id, el) => { S.mn.hw = !!el.checked; go('monitor'); },
    mnRef: () => go('monitor'),
    mnCsv: () => {
      const rows = S.mn.rows; if (!rows.length) return toast('مفيش بيانات للتصدير', true);
      const q = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
      const csv = '﻿' + [['الترتيب', 'الاسم', 'رقم الطالب', 'رقم ولي الأمر', 'المجموع', 'من', 'النسبة %', 'حضر', 'لم يحضر', 'مقالي معلّق']].concat(rows.map(r => [r.rank, r.name, r.phone, r.parent_phone, r.score, r.possible, r.pct, r.attended, r.missed, r.pending])).map(r => r.map(q).join(',')).join('\r\n');
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = 'ترتيب-' + S.y + '.csv'; document.body.appendChild(a); a.click(); a.remove();
    },
    mnRegrade: async () => {
      const { data, error } = await sb.from('quizzes').select('id,title,academic_year,created_at').order('created_at', { ascending: false }).limit(300); if (error) throw error;
      modal('🧮 إعادة تصحيح امتحان', '<p class="nt">بيعيد حساب كل إجابات الاختيار من متعدد لكل الطلاب حسب الإجابة الصحيحة الحالية، وبيحدّث الدرجات (صح ↔ غلط). المقالي ما بيتأثرش.</p><label>الامتحان</label><select id="rgq">' + data.map(q => '<option value="' + q.id + '">' + esc(q.title) + (q.academic_year ? ' — ' + esc(q.academic_year) : '') + '</option>').join('') + '</select><div style="margin-top:14px"><button class="btn" data-act="mnDoRegrade">🧮 ابدأ</button></div>');
    },
    mnDoRegrade: async (id, el) => { el.disabled = true; try { const n = await rpc('regrade_quiz', { p_quiz: $('#rgq').value }); closeModal(); toast(n ? 'اتعدّلت ' + n + ' إجابة وتحدّثت الدرجات ✅' : 'كل الدرجات مطابقة للإجابات الحالية — مفيش حاجة اتغيّرت ✅'); S.atc = null; } finally { el.disabled = false; } }
  });
})();
