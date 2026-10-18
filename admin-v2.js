// =====================================================================
// v2: منشئ الامتحان + محتوى الدرس + تقرير الامتحان + إعلانات الصفوف
// =====================================================================

// ---------- منشئ الامتحان (صفحة كاملة، بتحفظ مسودة تلقائياً) ----------
VIEWS.xbuild = ['منشئ الامتحان', vBuilder];
let XB = null, xbT = null, xbUid = 0;
const xuid = () => 'n' + (++xbUid) + Date.now().toString(36);
const LT = 'ABCDEFGH';
const RMODES = [['now', 'تظهر فوراً بعد التسليم'], ['after_grading', 'تظهر بعد ما أصحّح الأسئلة المقالية (لو مفيش مقالي بتظهر فوراً)'], ['after_close', 'تظهر بعد انتهاء وقت الامتحان (حدد وقت الإغلاق)'], ['manual', '🔒 ما تظهرش للطالب غير لما أوافق أنا (من تقرير الامتحان)'], ['manual_released', '✅ موافق — النتيجة ظاهرة للطلاب دلوقتي']];
const blankQ = (type, pts, pick, n) => ({ uid: xuid(), id: '', type, pick: pick || 1, pts: pts == null ? (type === 'mcq' ? 1 : 5) : pts, text: '', opts: type === 'mcq' ? Array.from({ length: n || 4 }, () => '') : [], ok: 0, oks: [], img: '', note: '' });
function metaFrom(q) {
  return { title: q.title || '', kind: q.kind || 'course', course_id: q.course_id || (S.courses[0] && S.courses[0].id) || '', academic_year: q.academic_year || YEARS[0], lesson_id: q.lesson_id || '',
    pass: q.pass_percent == null ? 50 : q.pass_percent, time: q.time_limit_minutes || '', tries: q.max_attempts || 1, opens: loc(q.opens_at), closes: loc(q.closes_at),
    shuffle: q.shuffle !== false, pub: !!q.is_published, notify: true, hw: !!q.is_homework, rmode: q.result_mode || 'now', rnote: q.result_note || '', instr: q.instructions || '', desc: q.description || '' };
}
function metaHTML(m) {
  const cs = S.courses.map(c => `<option value="${c.id}"${c.id === m.course_id ? ' selected' : ''}>${esc(c.title)} — ${c.academic_year}</option>`).join('');
  const ls = (S.lessons || []).filter(l => l.course_id === m.course_id).map(l => `<option value="${l.id}"${l.id === m.lesson_id ? ' selected' : ''}>${l.position}. ${esc(l.title)}</option>`).join('');
  return `<label>عنوان الامتحان</label><input name="title" value="${esc(m.title)}" placeholder="مثال: كويز المحاضرة الأولى">
  <div class="row2"><div><label>النوع</label><select name="kind">${[['lesson', '📖 كويز جوه محاضرة'], ['course', '📚 امتحان على مستوى الكورس'], ['comprehensive', '🏆 امتحان شامل للصف كله']].map(k => `<option value="${k[0]}"${k[0] === m.kind ? ' selected' : ''}>${k[1]}</option>`).join('')}</select></div>
  ${m.kind === 'comprehensive' ? `<div><label>الصف</label><select name="academic_year">${yopts(m.academic_year)}</select></div>` : `<div><label>الكورس</label><select name="course_id">${cs}</select></div>`}</div>
  ${m.kind === 'lesson' ? `<label>المحاضرة (الكويز بيظهر جوه المحاضرة دي وبيتجمّع في «نتائجي» تحتها)</label><select name="lesson_id"><option value="">— اختار المحاضرة —</option>${ls}</select><label class="chk"><input type="checkbox" name="hw"${m.hw ? ' checked' : ''}> 📚 ده واجب المحاضرة (بيظهر للطالب تحت اسم «الواجب»)</label>` : ''}
  <div class="row2"><div><label>نسبة النجاح %</label><input type="number" name="pass" min="0" max="100" value="${esc(m.pass)}"></div><div><label>الوقت بالدقائق (فاضي = مفتوح)</label><input type="number" name="time" min="1" value="${esc(m.time)}"></div></div>
  <div class="row2"><div><label>عدد المحاولات</label><input type="number" name="tries" min="1" value="${esc(m.tries)}"></div><div><label>📊 ظهور النتيجة للطالب</label><select name="rmode">${RMODES.map(r => `<option value="${r[0]}"${r[0] === m.rmode ? ' selected' : ''}>${r[1]}</option>`).join('')}</select></div></div>
  <div class="row2"><div><label>⏰ يفتح في (اختياري)</label><input type="datetime-local" name="opens" value="${esc(m.opens)}"></div><div><label>🔒 يقفل ويتسلّم تلقائي في (اختياري)</label><input type="datetime-local" name="closes" value="${esc(m.closes)}"></div></div>
  <label>ℹ️ وصف الامتحان / الواجب (اختياري — بيظهر للطالب جوه المحاضرة وقبل ما يبدأ)</label><textarea name="desc" dir="auto" style="min-height:56px">${esc(m.desc)}</textarea>
  <label>📌 تعليمات قبل البداية (اختياري، بتظهر للطالب قبل ما يبدأ)</label><textarea name="instr" dir="auto" style="min-height:56px">${esc(m.instr)}</textarea>
  <label>📝 ملاحظة تظهر مع النتيجة (اختياري)</label><textarea name="rnote" dir="auto" style="min-height:56px" placeholder="مثال: راجع المحاضرة التالتة قبل الامتحان الجاي">${esc(m.rnote)}</textarea>
  <label class="chk"><input type="checkbox" name="shuffle"${m.shuffle ? ' checked' : ''}> ترتيب عشوائي للأسئلة والاختيارات لكل طالب</label><label class="chk"><input type="checkbox" name="pub"${m.pub ? ' checked' : ''}> نشر الامتحان للطلاب</label><label class="chk"><input type="checkbox" name="notify"${m.notify ? ' checked' : ''}> 🔔 ابعت إشعار للطلاب لما الامتحان يتنشر</label>`;
}
function readMeta() {
  const f = $('#xbMeta'); if (!f) return XB.meta; const m = Object.assign({}, XB.meta);
  ['title', 'kind', 'course_id', 'academic_year', 'lesson_id', 'pass', 'time', 'tries', 'opens', 'closes', 'shuffle', 'pub', 'rmode', 'rnote', 'instr', 'desc', 'notify', 'hw'].forEach(n => { const e = f.querySelector('[name="' + n + '"]'); if (e) m[n] = e.type === 'checkbox' ? e.checked : e.value; });
  return m;
}
function qCardHTML(q, i) {
  const last = i === XB.qs.length - 1;
  let h = `<div class="card xq" data-u="${q.uid}" style="margin-bottom:12px"><div class="bar" style="margin-bottom:8px"><b>سؤال ${i + 1}</b>
    <select data-f="type" style="max-width:190px;flex:none;min-width:0"><option value="mcq"${q.type === 'mcq' && q.pick < 2 ? ' selected' : ''}>اختيار من متعدد (إجابة واحدة)</option><option value="multi"${q.type === 'mcq' && q.pick > 1 ? ' selected' : ''}>اختار أكتر من إجابة</option><option value="essay"${q.type === 'essay' ? ' selected' : ''}>مقالي</option></select>${q.type === 'mcq' && q.pick > 1 ? `<span style="color:var(--muted);font-size:12.5px;font-weight:700">عدد الإجابات الصحيحة</span><input type="number" data-f="pick" min="2" max="${Math.max(q.opts.length - 1, 2)}" value="${q.pick}" style="max-width:70px;flex:none;min-width:0">` : ''}
    <span style="color:var(--muted);font-size:12.5px;font-weight:700">الدرجة</span><input type="number" data-f="pts" min="0" step="0.5" value="${esc(q.pts)}" style="max-width:80px;flex:none;min-width:0">
    <span style="margin-right:auto;display:flex;gap:6px;flex-wrap:wrap"><button type="button" class="btn s g" data-act="xqUp" data-id="${q.uid}"${i === 0 ? ' disabled' : ''}>↑</button><button type="button" class="btn s g" data-act="xqDown" data-id="${q.uid}"${last ? ' disabled' : ''}>↓</button><button type="button" class="btn s g" data-act="xqDup" data-id="${q.uid}">نسخ</button><button type="button" class="btn s r" data-act="xqDel" data-id="${q.uid}">حذف</button></span></div>
    <textarea data-f="text" dir="auto" placeholder="اكتب نص السؤال هنا..." style="min-height:80px">${esc(q.text)}</textarea>
    <div class="bar" style="margin:8px 0 0"><label class="btn s g" style="margin:0;cursor:pointer;color:var(--ink)">🖼️ ${q.img ? 'تغيير الصورة' : 'إضافة صورة'}<input type="file" accept="image/*" data-f="img" hidden></label>${q.img ? `<img class="zi" src="${esc(q.img)}" alt="" style="height:54px;border-radius:8px;border:1px solid var(--line)"><button type="button" class="btn s r" data-act="xqImgDel" data-id="${q.uid}">إزالة الصورة</button>` : ''}<span data-st="${q.uid}" style="font-size:12.5px;font-weight:700;color:${q.imgErr ? '#f87171' : 'var(--muted)'}">${esc(q.imgErr || q.imgMsg || '')}</span></div>`;
  if (q.type === 'mcq') {
    h += '<div style="margin-top:10px">' + q.opts.map((o, k) => `<div class="bar" style="margin:0 0 6px;flex-wrap:nowrap">${q.pick > 1 ? `<input type="checkbox" data-f="okm" value="${k}"${q.oks.includes(k) ? ' checked' : ''} class="ck" title="إجابة صحيحة">` : `<input type="radio" name="ok_${q.uid}" data-f="ok" value="${k}"${q.ok === k ? ' checked' : ''} class="ck" title="الإجابة الصحيحة">`}<b style="width:18px;flex:none">${LT[k]}</b><input data-f="opt" data-k="${k}" dir="auto" value="${esc(o)}" placeholder="الاختيار ${LT[k]}">${q.opts.length > 2 ? `<button type="button" class="btn s g" data-act="xoDel" data-id="${q.uid}" data-k="${k}" title="حذف الاختيار">✕</button>` : ''}</div>`).join('')
      + (q.opts.length < 8 ? `<button type="button" class="btn s g" data-act="xoAdd" data-id="${q.uid}">+ اختيار</button>` : '') + '<small class="nt" style="display:block;margin:6px 0 0">' + (q.pick > 1 ? '☑️ علّم ' + q.pick + ' إجابات صحيحة، وكل إجابة منهم بتاخد ' + (+((+q.pts || 0) / q.pick).toFixed(2)) + ' درجة.' : '🔘 علّم الدايرة اللي جنب الإجابة الصحيحة.') + '</small></div>';
  } else h += '<small class="nt" style="display:block;margin:8px 0 0">✍️ سؤال مقالي: الطالب بيكتب إجابته وانت بتصححها من تبويب «تصحيح المقالي».</small>';
  return h + `<label>💡 ملاحظة / شرح الإجابة (بتظهر للطالب بعد التسليم)</label><textarea data-f="note" dir="auto" style="min-height:52px" placeholder="اختياري">${esc(q.note)}</textarea></div>`;
}
function drawQs() {
  const y = window.scrollY, b = $('#xbQs'); if (!b) return;
  b.innerHTML = XB.qs.map(qCardHTML).join('') || '<div class="empty">لسه مفيش أسئلة. اضغط «+ سؤال اختيار» أو «لصق أسئلة».</div>';
  const pts = XB.qs.reduce((s, q) => s + (+q.pts || 0), 0), c = $('#xbCnt'); if (c) c.textContent = XB.qs.length + ' سؤال • ' + pts + ' درجة';
  window.scrollTo(0, y);
}
function persist() {
  clearTimeout(xbT);
  xbT = setTimeout(() => { try {
    if (!XB) return; XB.meta = readMeta();
    localStorage.setItem(XB.key, JSON.stringify({ t: Date.now(), meta: XB.meta, qs: XB.qs.map(q => Object.assign({}, q, { imgErr: '', imgMsg: '' })) }));
    const s = $('#xbSt'); if (s) s.textContent = '✓ مسودة محفوظة تلقائياً ' + new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  } catch (e) {} }, 500);
}
const xq = uid => XB.qs.find(x => x.uid === uid);
async function vBuilder(arg) {
  await loadLessons();
  const id = typeof arg === 'string' ? arg : (arg && arg.id) || '', pre = (arg && arg.pre) || {};
  let q = {}, qs = [];
  if (id) {
    const r = await sb.from('quizzes').select('*').eq('id', id).single(); if (r.error) throw r.error; q = r.data;
    const rq = await sb.from('quiz_questions').select('*,quiz_answers(*)').eq('quiz_id', id).order('position'); if (rq.error) throw rq.error;
    qs = rq.data.map(x => { const ca = [].concat(x.quiz_answers || [])[0]; const pk = x.pick_n > 1 ? x.pick_n : 1; return { uid: x.id, id: x.id, type: x.qtype, pick: pk, pts: x.points, text: x.question, opts: x.qtype === 'mcq' ? (x.options || []).slice() : [], ok: ca ? ca.correct_index : -1, oks: pk > 1 && ca ? (ca.correct_set || [ca.correct_index]) : [], img: x.image_url || '', note: x.note || '' }; });
  } else q = Object.assign({ kind: 'course', pass_percent: 50, max_attempts: 1, shuffle: true, result_mode: 'now', is_published: false }, pre);
  XB = { id, key: 'xb:' + (id || 'new'), orig: qs.map(x => x.id), meta: metaFrom(q), qs, wasPub: !!q.is_published };
  let draft = null; try { draft = JSON.parse(localStorage.getItem(XB.key)); } catch (e) {}
  window.__xbDraft = draft;
  setTimeout(() => {
    $('#xbMeta').innerHTML = metaHTML(XB.meta); drawQs();
    const mt = $('#xbMeta'), box = $('#xbQs');
    mt.addEventListener('input', persist);
    mt.addEventListener('change', e => { if (['kind', 'course_id'].includes(e.target.name)) { const m = readMeta(); if (e.target.name === 'course_id') m.lesson_id = ''; XB.meta = m; mt.innerHTML = metaHTML(m); } persist(); });
    box.addEventListener('input', e => {
      const t = e.target, f = t.dataset.f, c = t.closest('.xq'); if (!c || !f) return; const q = xq(c.dataset.u); if (!q) return;
      if (f === 'text') q.text = t.value; else if (f === 'note') q.note = t.value; else if (f === 'pts') { q.pts = t.value; const n = $('#xbCnt'); if (n) n.textContent = XB.qs.length + ' سؤال • ' + XB.qs.reduce((s, x) => s + (+x.pts || 0), 0) + ' درجة'; } else if (f === 'opt') q.opts[+t.dataset.k] = t.value;
      persist();
    });
    box.addEventListener('change', e => {
      const t = e.target, f = t.dataset.f, c = t.closest('.xq'); if (!c || !f) return; const q = xq(c.dataset.u); if (!q) return;
      if (f === 'ok') { q.ok = +t.value; persist(); }
      else if (f === 'okm') { const k = +t.value, i = q.oks.indexOf(k); if (t.checked && i < 0) q.oks.push(k); else if (!t.checked && i >= 0) q.oks.splice(i, 1); persist(); }
      else if (f === 'pick') { q.pick = Math.max(2, Math.min(+t.value || 2, Math.max(q.opts.length - 1, 2))); drawQs(); persist(); }
      else if (f === 'type') { const v = t.value; if (v === 'essay') { q.type = 'essay'; q.pick = 1; } else { q.type = 'mcq'; if (q.opts.length < 2) q.opts = ['', '', '', '']; q.pick = v === 'multi' ? Math.max(q.pick, 2) : 1; if (v === 'multi' && q.opts.length < 3) while (q.opts.length < 4) q.opts.push(''); } drawQs(); persist(); }
      else if (f === 'img' && t.files[0]) xqUpload(q, t.files[0]);
    });
  });
  return `<div class="bar"><button class="btn g" data-go="exams">← الامتحانات</button><b>${id ? 'تعديل: ' + esc(q.title) : 'امتحان جديد'}</b><span id="xbSt" class="pill"></span><button class="btn" data-act="xbSave" style="margin-right:auto">💾 حفظ الكل</button></div>
  ${draft ? `<div class="card" id="xbBanner" style="border-color:#f59e0b;margin-bottom:14px"><b>📝 فيه مسودة محفوظة من ${new Date(draft.t).toLocaleString('ar-EG')}</b><p class="nt" style="margin:6px 0 10px">انت كنت بتكتب وقفلت الصفحة قبل الحفظ. تحب ترجّعها؟</p><div class="bar" style="margin:0"><button class="btn" data-act="xbRestore">استرجاع المسودة</button><button class="btn g" data-act="xbDiscard">تجاهل وحذفها</button></div></div>` : ''}
  <div class="card" style="margin-bottom:14px"><b style="font-size:16px">⚙️ إعدادات الامتحان</b><div id="xbMeta"></div></div>
  <div class="bar" style="position:sticky;top:0;z-index:5;background:var(--bg);padding:8px 0"><b>❓ الأسئلة</b><span id="xbCnt" class="pill"></span><button class="btn s" data-act="xbAdd" data-id="mcq">+ سؤال اختيار</button><button class="btn s g" data-act="xbAdd" data-id="multi">+ اختار 2</button><button class="btn s g" data-act="xbAdd" data-id="essay">+ سؤال مقالي</button><button class="btn s" data-act="xbGen">⚡ توليد عدد أسئلة</button><button class="btn s g" data-act="xbPaste">📋 لصق أسئلة</button></div>
  <div id="xbQs"></div>
  <div class="bar"><button class="btn" data-act="xbSave">💾 حفظ الكل</button><span class="nt" style="margin:0">الحفظ بيحدّث الأسئلة الموجودة من غير ما يمس نتايج الطلاب.</span></div>`;
}
async function xqUpload(q, file) {
  if (!/^image\//.test(file.type)) { q.imgErr = '❌ الملف لازم يكون صورة'; return drawQs(); }
  if (file.size > 12 * 1024 * 1024) { q.imgErr = '❌ حجم الصورة أكبر من 12MB'; return drawQs(); }
  q.imgErr = ''; q.imgMsg = '⏳ جاري الرفع...'; const st = document.querySelector('[data-st="' + q.uid + '"]'); if (st) { st.style.color = 'var(--muted)'; st.textContent = q.imgMsg; }
  try {
    if (window.UI) { const before = file.size; file = await UI.compress(file, { maxSide: 1400, maxKB: 220 }); if (file.size < before) q.imgMsg = '⏳ اتضغطت من ' + UI.fmtKB(before) + ' إلى ' + UI.fmtKB(file.size) + ' — جاري الرفع...'; }
    const ext = file.type === 'image/jpeg' ? 'jpg' : ((file.name || 'x.png').split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '')) || 'jpg', path = 'questions/' + (crypto.randomUUID ? crypto.randomUUID() : Date.now() + '' + Math.random().toString(16).slice(2)) + '.' + ext;
    const up = await sb.storage.from('course-media').upload(path, file, { contentType: file.type || 'image/jpeg', upsert: false }); if (up.error) throw up.error;
    q.img = sb.storage.from('course-media').getPublicUrl(path).data.publicUrl; q.imgMsg = '✅ تم الرفع'; persist();
  } catch (e) {
    const m = (e && e.message) || String(e); q.imgMsg = ''; q.imgErr = '❌ فشل الرفع: ' + m + (/row-level|policy|not found|bucket|permission|unauthor|403|404/i.test(m) ? ' — شغّل ملف SQL الجديد في Supabase (جزء التخزين) وجرّب تاني' : '');
  }
  drawQs();
}
function parseQs(txt) {
  const out = [], blocks = txt.replace(/\r/g, '').split(/\n\s*\n+/).map(b => b.trim()).filter(Boolean);
  const LM = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, 'أ': 0, 'ا': 0, 'ب': 1, 'ج': 2, 'د': 3, 'ه': 4, 'هـ': 4 };
  const optRe = /^[\(\[]?([A-Ha-hأابجدهـ])[\)\]\.\-:]\s*(.+)$/, ansRe = /^(?:answer|ans|correct|الإجابة|الاجابة|الحل|الجواب)\s*[:：=\-]\s*(.+)$/i;
  blocks.forEach(b => {
    const qt = [], opts = [], stars = []; let ok = -1, ansTxt = null;
    b.split('\n').map(s => s.trim()).filter(Boolean).forEach(ln => {
      const am = ln.match(ansRe); if (am) { ansTxt = am[1].trim(); return; }
      const om = ln.match(optRe);
      if (om && qt.length) { let t = om[2].trim(), star = false; if (/\*\s*$/.test(t)) { star = true; t = t.replace(/\*\s*$/, '').trim(); } if (/^[✓✔]/.test(t)) { star = true; t = t.replace(/^[✓✔]\s*/, ''); } opts.push(t); if (star) { ok = opts.length - 1; stars.push(ok); } }
      else if (opts.length) opts[opts.length - 1] += ' ' + ln; else qt.push(ln);
    });
    if (!qt.length) return;
    qt[0] = qt[0].replace(/^\d+\s*[\.\)\-]\s*/, '');
    const q = blankQ(opts.length >= 2 ? 'mcq' : 'essay'); q.text = qt.join('\n');
    if (q.type === 'mcq') {
      q.opts = opts; while (q.opts.length < 4) q.opts.push('');
      const parts = ansTxt ? ansTxt.split(/[,،&+\s]+|\bو\b|\band\b/i).map(x => x.replace(/[\)\.]/g, '').trim().toLowerCase()).filter(Boolean) : [], idxs = parts.map(x => (LM[x] != null && x.length <= 2) ? LM[x] : (/^[1-8]$/.test(x) ? +x - 1 : -1)).filter(z => z >= 0);
      if (idxs.length >= 2) { q.pick = idxs.length; q.oks = idxs; ok = -1; }
      else if (stars.length >= 2) { q.pick = stars.length; q.oks = stars; ok = -1; }
      else if (ansTxt) { const a = ansTxt.replace(/[\)\.]/g, '').trim().toLowerCase(); if (LM[a] != null && a.length <= 2) ok = LM[a]; else if (/^[1-8]$/.test(a)) ok = +a - 1; else { const k = opts.findIndex(o => o.toLowerCase() === ansTxt.toLowerCase()); if (k >= 0) ok = k; } }
      q.ok = ok;
    }
    out.push(q);
  });
  return out;
}
async function xbSave() {
  const m = readMeta(); const kind = m.kind; XB.meta = m;
  if (!m.title.trim()) throw new Error('اكتب عنوان الامتحان');
  if (kind !== 'comprehensive' && !m.course_id) throw new Error('اختار الكورس');
  if (kind === 'lesson' && !m.lesson_id) throw new Error('اختار المحاضرة اللي الكويز هيبقى جواها');
  const opens = m.opens ? new Date(m.opens).toISOString() : null, closes = m.closes ? new Date(m.closes).toISOString() : null;
  if (opens && closes && closes <= opens) throw new Error('وقت الإغلاق لازم يكون بعد وقت الفتح');
  const jobs = [];
  XB.qs.forEach((q, i) => {
    const text = q.text.trim(), empty = !text && !q.img && (q.type === 'essay' || !q.opts.some(o => o.trim())); if (empty) return;
    if (!text) throw new Error('سؤال ' + (i + 1) + ': اكتب نص السؤال');
    let options = null, correct = null, cset = null;
    if (q.type === 'mcq') {
      const filled = q.opts.map((o, k) => ({ t: o.trim(), k })).filter(x => x.t);
      if (filled.length < 2) throw new Error('سؤال ' + (i + 1) + ': اكتب اختيارين على الأقل');
      options = filled.map(x => x.t);
      if (q.pick > 1) {
        const set = q.oks.map(k => filled.findIndex(x => x.k === k)).filter(z => z >= 0).sort((a, b) => a - b);
        if (set.length !== q.pick) throw new Error('سؤال ' + (i + 1) + ': علّم ' + q.pick + ' إجابات صحيحة بالظبط (المعلّم ' + set.length + ')');
        if (filled.length <= q.pick) throw new Error('سؤال ' + (i + 1) + ': الاختيارات لازم تكون أكتر من عدد الإجابات الصحيحة');
        correct = set[0]; cset = set;
      } else { const idx = filled.findIndex(x => x.k === q.ok); if (idx < 0) throw new Error('سؤال ' + (i + 1) + ': علّم الإجابة الصحيحة على اختيار مكتوب'); correct = idx; }
    }
    jobs.push({ q, text, options, correct, cset });
  });
  if (!jobs.length) throw new Error('أضف سؤال واحد على الأقل');
  if (m.rmode === 'after_close' && !closes && !confirm('مفيش وقت إغلاق محدد، فالنتيجة هتظهر للطالب بعد ما يخلّص كل محاولاته. تكمل؟')) return;
  const keep = new Set(jobs.filter(j => j.q.id).map(j => j.q.id)), del = XB.orig.filter(x => !keep.has(x));
  if (del.length && !confirm('هيتم حذف ' + del.length + ' سؤال من الامتحان نهائياً (وإجابات الطلاب عليهم). تكمل؟')) return;
  const row = { title: m.title.trim(), kind, pass_percent: +m.pass || 0, time_limit_minutes: +m.time || null, max_attempts: +m.tries || 1, opens_at: opens, closes_at: closes, shuffle: !!m.shuffle, is_published: !!m.pub, result_mode: m.rmode, result_note: m.rnote.trim() || null, instructions: m.instr.trim() || null, description: (m.desc || '').trim() || null, is_homework: kind === 'lesson' && !!m.hw };
  if (kind === 'comprehensive') { row.academic_year = m.academic_year; row.course_id = null; row.lesson_id = null; } else { row.course_id = m.course_id; row.academic_year = null; row.lesson_id = kind === 'lesson' ? m.lesson_id : null; }
  let qid = XB.id;
  if (qid) { const { error } = await sb.from('quizzes').update(row).eq('id', qid); if (error) throw error; }
  else {
    if (kind === 'lesson' && m.lesson_id) { try { const [a1, a2] = await Promise.all([sb.from('lesson_items').select('position').eq('lesson_id', m.lesson_id).order('position', { ascending: false }).limit(1), sb.from('quizzes').select('lesson_pos').eq('lesson_id', m.lesson_id).order('lesson_pos', { ascending: false }).limit(1)]); if (!a2.error) row.lesson_pos = Math.max((a1.data && a1.data[0] && a1.data[0].position) || 0, (a2.data && a2.data[0] && a2.data[0].lesson_pos) || 0) + 1; } catch (e) {} }
    const { data, error } = await sb.from('quizzes').insert(row).select('id').single(); if (error) throw error; qid = data.id; XB.id = qid; XB.orig = []; }
  if (del.length) { const { error } = await sb.from('quiz_questions').delete().in('id', del); if (error) throw error; }
  const rows = jobs.map((j, i) => ({ quiz_id: qid, position: i + 1, question: j.text, options: j.options, qtype: j.q.type, pick_n: j.q.type === 'mcq' ? j.q.pick : 1, points: isNaN(+j.q.pts) || j.q.pts === '' ? 1 : +j.q.pts, image_url: j.q.img || null, note: (j.q.note || '').trim() || null }));
  const upd = jobs.map((j, i) => ({ j, r: rows[i] })).filter(x => x.j.q.id), ins = jobs.map((j, i) => ({ j, r: rows[i] })).filter(x => !x.j.q.id);
  for (const c of chunk(upd, 8)) { const rs = await Promise.all(c.map(x => sb.from('quiz_questions').update(x.r).eq('id', x.j.q.id))); const bad = rs.find(r => r.error); if (bad) throw bad.error; }
  const ids = {}; upd.forEach(x => ids[x.j.q.uid] = x.j.q.id);
  if (ins.length) { const { data, error } = await sb.from('quiz_questions').insert(ins.map(x => x.r)).select('id,position'); if (error) throw error; const byPos = {}; data.forEach(d => byPos[d.position] = d.id); ins.forEach(x => ids[x.j.q.uid] = byPos[x.r.position]); }
  const ans = jobs.filter(j => j.q.type === 'mcq').map(j => ({ question_id: ids[j.q.uid], correct_index: j.correct, correct_set: j.cset }));
  if (ans.length) { const { error } = await sb.from('quiz_answers').upsert(ans); if (error) throw error; }
  const es = jobs.filter(j => j.q.type === 'essay' && j.q.id).map(j => j.q.id); if (es.length) await sb.from('quiz_answers').delete().in('question_id', es);
  if (m.pub && m.notify && !XB.wasPub) { try { const yr = kind === 'comprehensive' ? m.academic_year : ((S.courses.find(c => c.id === m.course_id) || {}).academic_year); await sb.rpc('notify_students', { p_year: yr || '', p_student: null, p_kind: 'exam', p_title: 'امتحان جديد: ' + row.title, p_body: null, p_link: '/quiz.html?id=' + qid }); } catch (e) {} }
  try { localStorage.removeItem(XB.key); } catch (e) {}
  toast('تم حفظ الامتحان بـ ' + jobs.length + ' سؤال ✅'); XB = null; go('exams');
}

// ---------- محتوى الدرس: فيديوهات / PDF / كويزات / روابط ----------
const IKIND = { video: ['🎬', 'فيديو'], pdf: ['📄', 'PDF'], link: ['🔗', 'رابط'] };
const itDesc = x => x.description ? '<br><small style="color:var(--muted);display:block;margin-top:3px;white-space:pre-line">ℹ️ ' + esc(String(x.description).slice(0, 110)) + (String(x.description).length > 110 ? '…' : '') + '</small>' : '';
const itUrl = u => /^bunny:/.test(u || '') ? '🔐 Bunny (فيديو محمي بتوقيع) — ' + esc(u) : esc((u || '').slice(0, 60));
async function itemsModal(lid) {
  const l = (window.__L || []).find(x => x.id === lid) || {};
  const [it, qz] = await Promise.all([sb.from('lesson_items').select('*').eq('lesson_id', lid).order('position'), sb.from('quizzes').select('*,quiz_questions(count)').eq('lesson_id', lid)]);
  if (it.error) throw it.error; const items = it.data || [], quizzes = qz.error ? [] : (qz.data || []);
  const all = items.map(x => ({ t: 'i', pos: x.position == null ? 0 : x.position, x })).concat(quizzes.map(x => ({ t: 'q', pos: x.lesson_pos == null ? 100000 : x.lesson_pos, x })))
    .map((r, k) => (r._k = k, r)).sort((a, b) => (a.pos - b.pos) || (a.t === b.t ? a._k - b._k : a.t === 'i' ? -1 : 1));
  const row = (r, i) => {
    const x = r.x, first = i === 0, last = i === all.length - 1, mv = `<button class="btn s g" data-act="itMv" data-t="${r.t}" data-id="${x.id}" data-d="-1" data-l="${lid}"${first ? ' disabled' : ''}>↑</button> <button class="btn s g" data-act="itMv" data-t="${r.t}" data-id="${x.id}" data-d="1" data-l="${lid}"${last ? ' disabled' : ''}>↓</button>`;
    const gate = `<label class="chk" style="margin-top:6px;font-size:12.5px"><input type="checkbox" data-act="itGate" data-t="${r.t}" data-id="${x.id}" data-l="${lid}"${x.gate ? ' checked' : ''}> 🔒 اللي بعده مايفتحش للطالب غير بعد ما يخلّص ده</label>`;
    if (r.t === 'i') return `<tr data-t="i" data-id="${x.id}"><td style="width:1%;white-space:nowrap">${mv}</td><td>${(IKIND[x.kind] || ['•'])[0]} <b>${esc(x.title)}</b> <span class="pill">${(IKIND[x.kind] || [0, x.kind])[1]}</span><br><small dir="ltr" style="color:var(--muted)">${itUrl(x.url)}</small>${itDesc(x)}${gate}</td><td style="white-space:nowrap"><button class="btn s g" data-act="itEdit" data-id="${x.id}" data-l="${lid}">تعديل</button> <button class="btn s r" data-act="delItem" data-id="${x.id}" data-l="${lid}">حذف</button></td></tr>`;
    const n = (((x.quiz_questions || [])[0]) || {}).count || 0;
    return `<tr data-t="q" data-id="${x.id}"><td style="width:1%;white-space:nowrap">${mv}</td><td>${x.is_homework ? '📚' : '📝'} <b>${esc(x.title)}</b> <span class="pill ${x.is_published ? 'ok' : 'no'}">${x.is_homework ? 'واجب' : 'امتحان'} • ${x.is_published ? 'منشور' : 'مخفي'}</span><br><small style="color:var(--muted)">${n} سؤال${x.time_limit_minutes ? ' • ' + x.time_limit_minutes + ' دقيقة' : ''}</small>${itDesc(x)}${gate}</td><td style="white-space:nowrap"><button class="btn s" data-act="editExam" data-id="${x.id}">✏️ المحرر</button> <button class="btn s g" data-act="results" data-id="${x.id}">📊 التقرير</button></td></tr>`;
  };
  modal('محتوى المحاضرة: ' + (l.title || ''),
    `<p class="nt" style="margin:0 0 10px;line-height:1.9">ده ترتيب ما يشوفه الطالب بالظبط (فوق ← تحت). رتّبهم بالأسهم. علّم 🔒 على أي عنصر لو عايز اللي بعده يتقفل لحد ما الطالب يخلّصه (PDF/رابط = يفتحه، فيديو = يضغط «أنهيت»، امتحان/واجب = يسلّمه).</p>`
    + `<div class="tw" style="margin-bottom:12px"><table>${all.map(row).join('') || '<tr><td class="empty">لسه مفيش محتوى — ضيف من تحت</td></tr>'}</table></div>`
    + `<div class="card"><b>➕ إضافة محتوى</b><div class="row2" style="margin-top:8px"><select id="ni_k"><option value="video">🎬 فيديو (YouTube / Drive / Vimeo / Bunny)</option><option value="pdf">📄 PDF (رابط Google Drive أو غيره)</option><option value="link">🔗 رابط</option></select><input id="ni_t" placeholder="الاسم (يظهر للطالب)"></div><input id="ni_u" dir="ltr" placeholder="https://...  (أو رابط Bunny: https://iframe.mediadelivery.net/embed/123/xxxxxxxx-...)" style="margin-top:8px"><textarea id="ni_d" dir="auto" placeholder="وصف العنصر (اختياري) — بيظهر للطالب تحت الفيديو/الملف" style="margin-top:8px;min-height:60px"></textarea><button class="btn s" style="margin-top:8px" data-act="itAdd" data-l="${lid}">+ إضافة</button>`
    + `<div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn s" data-act="itNewQuiz" data-id="${lid}">+ كويز جديد</button><button class="btn s" data-act="itNewHw" data-id="${lid}">+ 📚 واجب جديد</button></div></div>`);
  $('#modal .mbox').classList.add('wide');
}
async function itRefresh(lid) { go('lessons', window.__cid); await itemsModal(lid); }

// ---------- امتحانات الكورس داخل صفحة الدروس ----------
const _vLessons0 = vLessons;
VIEWS.lessons = ['دروس الكورس', async cid => {
  const html = await _vLessons0(cid);
  const { data } = await sb.from('quizzes').select('id,title,kind,lesson_id,is_published,quiz_questions(count)').eq('course_id', cid).order('created_at');
  const L = window.__L || [], qz = data || [], row = q => `<tr><td>${esc(q.title)}<br><small style="color:var(--muted)">${q.lesson_id ? '📖 ' + esc((L.find(l => l.id === q.lesson_id) || {}).title || '') : '📚 على مستوى الكورس'} • ${(((q.quiz_questions || [])[0]) || {}).count || 0} سؤال</small></td><td><span class="pill ${q.is_published ? 'ok' : 'no'}">${q.is_published ? 'منشور' : 'مخفي'}</span></td><td style="white-space:nowrap"><button class="btn s" data-act="editExam" data-id="${q.id}">✏️ المحرر</button> <button class="btn s g" data-act="results" data-id="${q.id}">📊 التقرير</button></td></tr>`;
  const cl = qz.filter(q => !q.lesson_id), ll = qz.filter(q => q.lesson_id);
  return html + `<h3 style="margin:22px 0 10px">📝 امتحانات الكورس (على مستوى الكورس كله)</h3><div class="bar"><button class="btn s" data-act="newCourseExam" data-id="${cid}">+ امتحان للكورس</button></div><div class="tw"><table>${cl.map(row).join('') || '<tr><td class="empty">لا توجد امتحانات على مستوى الكورس</td></tr>'}</table></div>`
    + `<h3 style="margin:22px 0 10px">📖 كويزات المحاضرات</h3><p class="nt">بتتضاف من زرار «المحتوى» جنب كل محاضرة.</p><div class="tw"><table>${ll.map(row).join('') || '<tr><td class="empty">لا توجد كويزات للمحاضرات</td></tr>'}</table></div>`;
}];

// ---------- تقرير الامتحان: مين امتحن / مين لا / أكتر الأخطاء ----------
VIEWS.results = ['تقرير الامتحان', vReport];
async function vReport(id) {
  await loadStudents();
  const { data: qz, error } = await sb.from('quizzes').select('*,courses(title,academic_year)').eq('id', id).single(); if (error) throw error;
  const year = qz.kind === 'comprehensive' ? qz.academic_year : (qz.courses && qz.courses.academic_year);
  let exp; if (qz.kind === 'comprehensive') exp = S.students.filter(s => s.academic_year === qz.academic_year); else { const ids = new Set((S.enr || []).filter(e => e.course_id === qz.course_id).map(e => e.student_id)); exp = S.students.filter(s => ids.has(s.id)); }
  const { data: at, error: e2 } = await sb.from('quiz_attempts').select('*').eq('quiz_id', id).order('created_at', { ascending: false }).limit(3000); if (e2) throw e2;
  const sm = stuMap(), best = {};
  at.forEach(a => { const o = best[a.student_id] = best[a.student_id] || { n: 0, b: a, last: a }; o.n++; if (pcent(a) > pcent(o.b)) o.b = a; });
  const ps = qz.pass_percent == null ? 50 : qz.pass_percent, took = Object.keys(best).map(k => ({ s: sm[k], o: best[k] })).filter(x => x.s).sort((a, b) => pcent(b.o.b) - pcent(a.o.b));
  const tookIds = new Set(Object.keys(best)), not = exp.filter(s => !tookIds.has(s.id));
  const done = took.filter(x => x.o.b.status !== 'pending'), avg = done.length ? Math.round(done.reduce((t, x) => t + pcent(x.o.b), 0) / done.length) : 0, pass = done.length ? Math.round(done.filter(x => pcent(x.o.b) >= ps).length / done.length * 100) : 0, pend = took.filter(x => x.o.b.status === 'pending').length;
  const { data: qq } = await sb.from('quiz_questions').select('id,position,question,qtype').eq('quiz_id', id).order('position');
  let ans = []; for (const c of chunk(at.map(a => a.id), 60)) { const r = await sb.from('quiz_attempt_answers').select('attempt_id,question_id,chosen_index,is_correct').in('attempt_id', c); if (r.error) throw r.error; ans = ans.concat(r.data || []); }
  const st = {}; (qq || []).forEach(q => st[q.id] = { q, w: 0, u: 0, ok: 0 });
  ans.forEach(a => { const o = st[a.question_id]; if (!o || o.q.qtype !== 'mcq') return; if (a.chosen_index == null) o.u++; else if (a.is_correct) o.ok++; else o.w++; });
  const mis = Object.values(st).filter(x => x.q.qtype === 'mcq' && (x.w + x.u)).sort((a, b) => (b.w + b.u) - (a.w + a.u));
  window.__rep = { qz, took, not, ps };
  const T = (cells, i) => '<td>' + cells.join('</td><td>') + '</td>';
  const tookRows = took.map(x => { const a = x.o.b, p = pcent(a), pd = a.status === 'pending'; return '<tr><td>' + esc(fname(x.s)) + '<br><small style="color:var(--muted)" dir="ltr">' + esc(x.s.phone_number) + '</small></td><td><b>' + a.score + '/' + a.total + '</b></td><td><b>' + p + '%</b></td><td><span class="pill ' + (pd ? 'no' : p >= ps ? 'ok' : 'no') + '">' + (pd ? 'تصحيح معلّق' : p >= ps ? 'ناجح' : 'راسب') + '</span></td><td>' + x.o.n + '</td><td style="color:' + (a.violations ? '#f87171' : 'inherit') + '">' + (a.violations || 0) + '</td><td>' + (a.seconds_spent != null ? Math.floor(a.seconds_spent / 60) + ':' + String(a.seconds_spent % 60).padStart(2, '0') : '—') + '</td><td>' + fdate(a.created_at) + '</td><td><button class="btn s" data-act="attempt" data-id="' + a.id + '">تفاصيل</button> <button class="btn s g" data-act="newTry" data-id="' + qz.id + '" data-s="' + x.s.id + '" title="فتح محاولة جديدة لهذا الطالب">🔁 محاولة جديدة</button></td></tr>'; }).join('');
  const notRows = not.map(s => '<tr><td>' + esc(fname(s)) + '</td><td dir="ltr">' + esc(s.phone_number) + '</td><td dir="ltr">' + esc(s.parent_phone || '—') + '</td><td>' + esc(s.academic_year) + '</td></tr>').join('');
  const misRows = mis.map(x => { const tot = x.ok + x.w + x.u, pr = Math.round((x.w + x.u) / tot * 100); return '<tr><td>' + x.q.position + '</td><td dir="auto">' + esc(x.q.question.slice(0, 140)) + '</td><td><b>' + x.w + '</b></td><td>' + x.u + '</td><td><span class="pill ' + (pr >= 50 ? 'no' : '') + '">' + pr + '%</span></td></tr>'; }).join('');
  const tab = (k, l, on) => '<button class="yt' + (on ? ' on' : '') + '" data-act="rsub" data-id="' + k + '">' + l + '</button>';
  return '<div class="bar"><button class="btn g" data-go="exams">← الامتحانات</button><b>' + esc(qz.title) + '</b><span class="pill">' + esc(year || '') + '</span>' + (['manual', 'manual_released'].includes(qz.result_mode) ? '<button class="btn s ' + (qz.result_mode === 'manual' ? '' : 'r') + '" data-act="relRes" data-id="' + id + '" data-r="' + (qz.result_mode === 'manual' ? '1' : '0') + '">' + (qz.result_mode === 'manual' ? '📢 إظهار النتائج للطلاب' : '🔒 إخفاء النتائج') + '</button>' : '') + '<button class="btn s" data-act="editExam" data-id="' + id + '">✏️ المحرر</button><button class="btn s" data-act="rpdf" style="margin-right:auto">📄 تصدير PDF</button><button class="btn s g" data-act="rexport">⬇️ Excel/CSV</button></div>'
    + '<div class="grid sm" style="margin-bottom:16px">' + [[exp.length, 'المفروض يمتحنوا'], [took.length, 'امتحنوا'], [not.length, 'لم يمتحنوا'], [avg + '%', 'متوسط الدرجات'], [pass + '%', 'نسبة النجاح'], [pend, 'تصحيح معلّق']].map(x => '<div class="card stat"><b>' + x[0] + '</b><span>' + x[1] + '</span></div>').join('') + '</div>'
    + '<div class="ytabs" id="rpTabs">' + tab('took', '✅ اللي امتحنوا (' + took.length + ')', 1) + tab('not', '❌ اللي لم يمتحنوا (' + not.length + ')') + tab('mis', '🧠 أكتر الأسئلة غلطاً') + '</div>'
    + '<div id="rp_took"><div class="tw"><table><tr><th>الطالب</th><th>الدرجة</th><th>النسبة</th><th>الحالة</th><th>محاولات</th><th>مخالفات</th><th>الوقت</th><th>التاريخ</th><th></th></tr>' + (tookRows || '<tr><td colspan="9" class="empty">لا توجد محاولات بعد</td></tr>') + '</table></div><p class="nt" style="margin-top:8px">بنعرض أعلى درجة لكل طالب.</p></div>'
    + '<div id="rp_not" hidden><div class="tw"><table><tr><th>الطالب</th><th>الهاتف</th><th>هاتف ولي الأمر</th><th>الصف</th></tr>' + (notRows || '<tr><td colspan="4" class="empty">الكل امتحن 🎉</td></tr>') + '</table></div></div>'
    + '<div id="rp_mis" hidden><div class="tw"><table><tr><th>#</th><th>السؤال</th><th>غلط</th><th>بدون إجابة</th><th>نسبة الغلط</th></tr>' + (misRows || '<tr><td colspan="5" class="empty">مفيش أخطاء مسجّلة</td></tr>') + '</table></div></div>';
}

// ---------- تبويب «الامتحانات» داخل نتائج الطلاب (لكل صف) ----------
async function examsByYear(at, yStu) {
  const { data, error } = await sb.from('quizzes').select('id,title,kind,course_id,academic_year,is_published,courses(title,academic_year)').order('created_at', { ascending: false }); if (error) throw error;
  const ex = data.filter(q => (q.kind === 'comprehensive' ? q.academic_year : (q.courses && q.courses.academic_year)) === S.y), enrBy = {};
  (S.enr || []).forEach(e => (enrBy[e.course_id] = enrBy[e.course_id] || new Set()).add(e.student_id));
  const rows = ex.map(q => {
    const exp = q.kind === 'comprehensive' ? yStu : yStu.filter(s => enrBy[q.course_id] && enrBy[q.course_id].has(s.id)), aa = at.filter(a => a.quiz_id === q.id), took = new Set(aa.map(a => a.student_id));
    const done = aa.filter(a => a.status !== 'pending'), avg = done.length ? Math.round(done.reduce((t, a) => t + pcent(a), 0) / done.length) : null, nt = exp.filter(s => !took.has(s.id)).length;
    return '<tr><td>' + esc(q.title) + '<br><small style="color:var(--muted)">' + KIND[q.kind] + (q.courses ? ' • ' + esc(q.courses.title) : '') + (q.is_published ? '' : ' • مخفي') + '</small></td><td>' + exp.length + '</td><td>' + took.size + '</td><td><span class="pill ' + (nt ? 'no' : 'ok') + '">' + nt + '</span></td><td>' + (avg == null ? '—' : avg + '%') + '</td><td><button class="btn s" data-act="results" data-id="' + q.id + '">📊 التقرير</button></td></tr>';
  }).join('');
  return '<p class="nt">كل امتحان في الصف ده: كام طالب مفروض يمتحن، كام امتحن، كام لسه، والمتوسط. افتح «التقرير» لتفاصيل كل طالب وأكتر الأسئلة غلطاً.</p><div class="tw"><table><tr><th>الامتحان</th><th>المفروض</th><th>امتحنوا</th><th>لم يمتحنوا</th><th>المتوسط</th><th></th></tr>' + (rows || '<tr><td colspan="6" class="empty">لا توجد امتحانات للصف ده</td></tr>') + '</table></div>';
}

// ---------- الإعلانات لكل صف ----------
S.ay = 'all';
async function vAnn() {
  const { data, error } = await sb.from('announcements').select('*').order('created_at', { ascending: false }); if (error) throw error;
  const cnt = { all: data.length, gen: data.filter(a => !a.academic_year).length }; YEARS.forEach(y => cnt[y] = data.filter(a => a.academic_year === y).length);
  const list = data.filter(a => S.ay === 'all' || (S.ay === 'gen' ? !a.academic_year : a.academic_year === S.ay));
  const tab = (k, l) => '<button class="yt' + (S.ay === k ? ' on' : '') + '" data-act="setAy" data-id="' + k + '">' + l + ' <small>(' + (cnt[k] || 0) + ')</small></button>';
  return '<p class="nt">كل إعلان بيظهر للصف اللي تختاره بس. «كل الصفوف» بيظهر لكل الطلاب.</p><div class="ytabs">' + tab('all', 'الكل') + tab('gen', '🌐 كل الصفوف') + YEARS.map(y => tab(y, y)).join('') + '</div>'
    + '<div class="bar"><button class="btn" data-act="newAnn">+ إعلان جديد</button></div><div class="tw"><table><tr><th>الإعلان</th><th>الصف</th><th>الحالة</th><th></th></tr>' + (list.map(a => '<tr><td>' + esc(a.title) + '<br><small style="color:var(--muted)">' + esc(a.body || '') + '</small></td><td><span class="pill ' + (a.academic_year ? '' : 'ok') + '">' + esc(a.academic_year || 'كل الصفوف') + '</span></td><td><span class="pill ' + (a.is_active ? 'ok' : 'no') + '">' + (a.is_active ? 'ظاهر' : 'مخفي') + '</span></td><td style="display:flex;gap:6px"><button class="btn s g" data-act="togAnn" data-id="' + a.id + '" data-p="' + a.is_active + '">' + (a.is_active ? 'إخفاء' : 'إظهار') + '</button><button class="btn s r" data-act="delAnn" data-id="' + a.id + '">حذف</button></td></tr>').join('') || '<tr><td colspan="4" class="empty">لا توجد إعلانات هنا</td></tr>') + '</table></div>';
}
VIEWS.ann = ['الإعلانات', vAnn];

// ---------- تفاصيل المحاولة + تعليق المدرس على كل إجابة ----------
async function attemptModal(aid) {
  const sel = 'question_id,chosen_index,is_correct,essay_text,essay_image,essay_score,';
  let r = await sb.from('quiz_attempt_answers').select(sel + 'feedback,quiz_questions(question,options,qtype,points,position,note)').eq('attempt_id', aid);
  if (r.error) r = await sb.from('quiz_attempt_answers').select(sel + 'quiz_questions(question,options,qtype,points,position)').eq('attempt_id', aid);
  if (r.error) throw r.error; const data = r.data;
  const { data: ca } = await sb.from('quiz_answers').select('question_id,correct_index').in('question_id', data.map(x => x.question_id));
  const cm = {}; (ca || []).forEach(x => cm[x.question_id] = x.correct_index);
  data.sort((a, b) => (a.quiz_questions.position || 0) - (b.quiz_questions.position || 0));
  const fb = (x, i) => '<div class="bar" style="margin:8px 0 0"><input id="fb' + i + '" dir="auto" placeholder="💬 تعليقك للطالب على إجابته (يظهر له بعد التسليم)" value="' + esc(x.feedback || '') + '"><button class="btn s g" data-act="saveFb" data-id="' + aid + '" data-q="' + x.question_id + '" data-i="' + i + '">حفظ التعليق</button></div>';
  modal('تفاصيل المحاولة', data.map((x, i) => { const q = x.quiz_questions;
    if (q.qtype === 'mcq') return '<div class="card" style="margin-bottom:8px"><b dir="auto">' + (i + 1) + '. ' + esc(q.question) + '</b>' + (q.options || []).map((o, k) => '<div dir="auto" style="padding:6px 10px;margin-top:4px;border-radius:8px;border:1px solid var(--line);' + (k === cm[x.question_id] ? 'background:rgba(34,197,94,.18);' : k === x.chosen_index ? 'background:rgba(220,38,38,.22);' : '') + '">' + esc(o) + (k === x.chosen_index ? ' ← إجابة الطالب' : '') + '</div>').join('') + (q.note ? '<p class="nt" style="margin:8px 0 0">💡 ملاحظة السؤال: ' + esc(q.note) + '</p>' : '') + fb(x, i) + '</div>';
    return '<div class="card" style="margin-bottom:8px"><b dir="auto">' + (i + 1) + '. ' + esc(q.question) + '</b><div dir="auto" style="white-space:pre-wrap;margin:8px 0;background:var(--bg);padding:10px;border-radius:10px">' + esc(x.essay_text || (x.essay_image ? '(إجابة بصورة 👇)' : '(لا توجد إجابة)')) + '</div>' + (x.essay_image ? '<div style="margin:8px 0"><img data-eimg="' + esc(x.essay_image) + '" alt="صورة إجابة الطالب" style="max-width:100%;max-height:520px;border-radius:12px;border:1px solid var(--line);cursor:zoom-in;display:block"><small style="color:var(--muted)">اضغط على الصورة لفتحها بحجم كامل</small></div>' : '') + '<div class="bar" style="margin:0"><input type="number" id="es' + i + '" min="0" max="' + q.points + '" value="' + (x.essay_score == null ? '' : x.essay_score) + '" placeholder="من ' + q.points + '" style="max-width:110px"><button class="btn s" data-act="gradeEssay" data-id="' + aid + '" data-q="' + x.question_id + '" data-i="' + i + '">حفظ الدرجة</button></div>' + fb(x, i) + '</div>'; }).join('') || '<div class="empty">لا توجد تفاصيل</div>');
  document.querySelectorAll('#mb img[data-eimg]').forEach(async im => { try { const sg = await sb.storage.from('essay-files').createSignedUrl(im.dataset.eimg, 3600); if (sg.data) { im.src = sg.data.signedUrl; im.onclick = () => window.open(sg.data.signedUrl, '_blank', 'noopener'); } else im.alt = 'تعذر تحميل الصورة'; } catch (e) { im.alt = 'تعذر تحميل الصورة'; } });
}

// ---------- العمليات الجديدة ----------
Object.assign(ACT, {
  newExam: () => go('xbuild', ''), editExam: id => go('xbuild', id),
  itNewHw: id => { const l = (window.__L || []).find(x => x.id === id) || {}; closeModal(); go('xbuild', { pre: { kind: 'lesson', is_homework: true, title: 'واجب: ' + (l.title || ''), course_id: l.course_id || window.__cid, lesson_id: id } }); },
  newCourseExam: id => go('xbuild', { pre: { kind: 'course', course_id: id } }),
  itNewQuiz: id => { const l = (window.__L || []).find(x => x.id === id) || {}; closeModal(); go('xbuild', { pre: { kind: 'lesson', course_id: l.course_id || window.__cid, lesson_id: id } }); },
  xbSave: async () => { const bs = Array.from(document.querySelectorAll('[data-act="xbSave"]')); bs.forEach(b => b.disabled = true); try { await xbSave(); } catch (e) { if (/pick_n|correct_set|result_mode|instructions|result_note/.test(e.message || '')) throw new Error('شغّل ملفات الـSQL الجديدة (supabase_update.sql ثم supabase_update_v3.sql) في Supabase الأول'); throw e; } finally { bs.forEach(b => b.disabled = false); } },
  xbAdd: id => { XB.qs.push(id === 'multi' ? blankQ('mcq', 2, 2) : blankQ(id)); drawQs(); persist(); const c = document.querySelectorAll('.xq'); const l = c[c.length - 1]; if (l) { l.scrollIntoView({ block: 'center' }); const t = l.querySelector('textarea'); if (t) t.focus(); } },
  xbGen: () => modal('⚡ توليد أسئلة فاضية بالعدد', '<form><p class="nt">اختار عدد كل نوع وهنجهّز لك الكروت فاضية تكتب فيها. تقدر تستخدمها مع الإضافة واحد واحد.</p><div class="row2"><div><label>أسئلة اختيار (إجابة واحدة)</label><input type="number" name="nm" value="10" min="0" max="200"></div><div><label>درجة كل سؤال</label><input type="number" name="pm" value="1" min="0" step="0.5"></div></div><div class="row2"><div><label>أسئلة «اختار أكتر من إجابة»</label><input type="number" name="nx" value="0" min="0" max="200"></div><div><label>عدد الإجابات الصحيحة</label><input type="number" name="px" value="2" min="2" max="6"></div></div><div class="row2"><div><label>درجة كل سؤال اختار-N</label><input type="number" name="ptx" value="2" min="0" step="0.5"></div><div><label>عدد الاختيارات لكل سؤال</label><input type="number" name="no" value="4" min="2" max="8"></div></div><div class="row2"><div><label>أسئلة مقالية</label><input type="number" name="ne" value="0" min="0" max="200"></div><div><label>درجة كل سؤال مقالي</label><input type="number" name="pe" value="5" min="0" step="0.5"></div></div><button class="btn" style="width:100%;margin-top:16px">توليد</button></form>',
    async f => {
      const nm = +f.get('nm') || 0, nx = +f.get('nx') || 0, ne = +f.get('ne') || 0, no = Math.max(2, Math.min(+f.get('no') || 4, 8)), px = Math.max(2, +f.get('px') || 2);
      if (nm + nx + ne < 1) throw new Error('اكتب عدد الأسئلة'); if (nm + nx + ne > 300) throw new Error('الحد الأقصى 300 سؤال في المرة');
      if (nx && no <= px) throw new Error('عدد الاختيارات لازم يكون أكتر من عدد الإجابات الصحيحة');
      for (let i = 0; i < nm; i++) XB.qs.push(blankQ('mcq', +f.get('pm'), 1, no));
      for (let i = 0; i < nx; i++) XB.qs.push(blankQ('mcq', +f.get('ptx'), px, no));
      for (let i = 0; i < ne; i++) XB.qs.push(blankQ('essay', +f.get('pe')));
      drawQs(); persist(); toast('تم توليد ' + (nm + nx + ne) + ' سؤال ✅');
    }),
  xbPaste: () => modal('لصق أسئلة', '<form><p class="nt">الصق الأسئلة وسيب سطر فاضي بين كل سؤال والتاني. الاختيارات بتبدأ بـ A) أو A. أو أ) والإجابة الصحيحة بتتحدد بسطر <b>Answer: B</b> أو بنجمة <b>*</b> في آخر الاختيار. السؤال من غير اختيارات بيتحول مقالي.</p><textarea name="t" dir="auto" style="min-height:260px" placeholder="1. She ____ to school every day.\nA) go\nB) goes\nC) going\nAnswer: B\n\nWrite a paragraph about your hobbies."></textarea><button class="btn" style="width:100%;margin-top:14px">إضافة الأسئلة</button></form>',
    async f => { const qs = parseQs(f.get('t') || ''); if (!qs.length) throw new Error('مفيش أسئلة اتعرّفت في النص'); XB.qs = XB.qs.concat(qs); drawQs(); persist(); toast('تمت إضافة ' + qs.length + ' سؤال ✅' + (qs.some(q => q.type === 'mcq' && q.ok < 0) ? ' — علّم الإجابة الصحيحة للأسئلة اللي ناقصة' : '')); }),
  xbRestore: () => { const d = window.__xbDraft; if (!d) return; XB.meta = d.meta; XB.qs = d.qs; $('#xbMeta').innerHTML = metaHTML(XB.meta); drawQs(); const b = $('#xbBanner'); if (b) b.remove(); toast('تم استرجاع المسودة ✅'); },
  xbDiscard: () => { try { localStorage.removeItem(XB.key); } catch (e) {} const b = $('#xbBanner'); if (b) b.remove(); },
  xqUp: id => { const i = XB.qs.findIndex(x => x.uid === id); if (i > 0) { [XB.qs[i - 1], XB.qs[i]] = [XB.qs[i], XB.qs[i - 1]]; drawQs(); persist(); } },
  xqDown: id => { const i = XB.qs.findIndex(x => x.uid === id); if (i >= 0 && i < XB.qs.length - 1) { [XB.qs[i + 1], XB.qs[i]] = [XB.qs[i], XB.qs[i + 1]]; drawQs(); persist(); } },
  xqDup: id => { const i = XB.qs.findIndex(x => x.uid === id), c = JSON.parse(JSON.stringify(XB.qs[i])); c.uid = xuid(); c.id = ''; XB.qs.splice(i + 1, 0, c); drawQs(); persist(); },
  xqDel: id => { const q = xq(id); if ((q.text || '').trim() && !confirm('حذف السؤال؟')) return; XB.qs = XB.qs.filter(x => x.uid !== id); drawQs(); persist(); },
  xqImgDel: id => { const q = xq(id); q.img = ''; q.imgMsg = ''; q.imgErr = ''; drawQs(); persist(); },
  xoAdd: id => { const q = xq(id); if (q.opts.length < 8) { q.opts.push(''); drawQs(); persist(); const i = document.querySelectorAll('.xq[data-u="' + id + '"] [data-f="opt"]'); if (i.length) i[i.length - 1].focus(); } },
  xoDel: (id, el) => { const q = xq(id), k = +el.dataset.k; if (q.opts.length <= 2) return; q.opts.splice(k, 1); if (q.ok === k) q.ok = -1; else if (q.ok > k) q.ok--; q.oks = q.oks.filter(x => x !== k).map(x => x > k ? x - 1 : x); drawQs(); persist(); },
  itAdd: async (id, el) => {
    const k = $('#ni_k').value, lid = el.dataset.l, t = $('#ni_t').value.trim(), u = normUrl($('#ni_u').value);
    if (!t) throw new Error('اكتب اسم العنصر'); if (!u) throw new Error('الرابط لازم يبدأ بـ https://');
    const [a1, a2] = await Promise.all([sb.from('lesson_items').select('position').eq('lesson_id', lid).order('position', { ascending: false }).limit(1), sb.from('quizzes').select('lesson_pos').eq('lesson_id', lid).order('lesson_pos', { ascending: false }).limit(1)]);
    const mx = Math.max((a1.data && a1.data[0] && a1.data[0].position) || 0, (a2.data && a2.data[0] && a2.data[0].lesson_pos) || 0, 0);
    const dsc = ($('#ni_d') ? $('#ni_d').value.trim() : '') || null;
    const { error } = await sb.from('lesson_items').insert({ lesson_id: lid, kind: k, title: t, url: u, description: dsc, position: mx + 1 }); if (error) throw error;
    toast('تمت الإضافة ✅'); itRefresh(lid);
  },
  itMv: async (id, el) => {
    const lid = el.dataset.l, d = +el.dataset.d, rows = Array.from(document.querySelectorAll('#modal tr[data-t]')).map(r => ({ t: r.dataset.t, id: r.dataset.id })), i = rows.findIndex(r => r.id === id), j = i + d;
    if (i < 0 || j < 0 || j >= rows.length) return; const tmp = rows[i]; rows[i] = rows[j]; rows[j] = tmp;
    const { error } = await sb.rpc('reorder_lesson', { p_lesson: lid, p_order: rows }); if (error) throw new Error((error.message || '').includes('schema cache') || (error.message || '').includes('does not exist') ? 'شغّل ملف supabase_update_v6.sql في Supabase الأول' : error.message);
    itRefresh(lid);
  },
  itGate: async (id, el) => {
    const { error } = await sb.from(el.dataset.t === 'q' ? 'quizzes' : 'lesson_items').update({ gate: el.checked }).eq('id', id);
    if (error) { el.checked = !el.checked; throw new Error((error.message || '').includes('gate') ? 'شغّل ملف supabase_update_v6.sql في Supabase الأول' : error.message); }
    toast(el.checked ? '🔒 اتقفل اللي بعده لحد ما الطالب يخلّص ده' : 'اتفتح اللي بعده');
  },
  itEdit: async (id, el) => {
    const { data } = await sb.from('lesson_items').select('title,url').eq('id', id).single(); if (!data) return;
    const t = prompt('الاسم:', data.title); if (t == null) return; const u = prompt('الرابط:', data.url); if (u == null) return; const nu = normUrl(u); if (!t.trim() || !nu) throw new Error('الاسم والرابط (https) مطلوبين');
    const { error } = await sb.from('lesson_items').update({ title: t.trim(), url: nu }).eq('id', id); if (error) throw error; toast('تم التعديل ✅'); itRefresh(el.dataset.l);
  },
  itAllow: async (id, el) => { const { error } = await sb.from('lesson_items').update({ allow_open: el.checked }).eq('id', id); if (error) { el.checked = !el.checked; throw new Error((error.message || '').includes('allow_open') ? 'شغّل ملف SQL الجديد في Supabase الأول' : error.message); } toast(el.checked ? 'الطالب يقدر يفتحه خارج المنصة ✅' : 'اتقفل فتحه خارج المنصة 🔒'); },
  delItem: async (id, el) => { if (!confirm('حذف العنصر؟')) return; const { error } = await sb.from('lesson_items').delete().eq('id', id); if (error) throw error; itRefresh(el.dataset.l); },
  rsub: (id, el) => { ['took', 'not', 'mis'].forEach(k => { const d = $('#rp_' + k); if (d) d.hidden = k !== id; }); document.querySelectorAll('#rpTabs .yt').forEach(b => b.classList.toggle('on', b === el)); },
  relRes: async (id, el) => {
    const rel = el.dataset.r === '1';
    if (!confirm(rel ? 'هتظهر النتيجة لكل الطلاب اللي امتحنوا، وهيوصلهم إشعار. تكمل؟' : 'هتتخبّى النتيجة عن الطلاب تاني. تكمل؟')) return;
    const { data, error } = await sb.rpc('set_results_released', { p_quiz: id, p_release: rel });
    if (error) throw new Error((error.message || '').includes('does not exist') || (error.message || '').includes('schema cache') ? 'شغّل ملف supabase_update_v5.sql في Supabase الأول' : error.message);
    toast(rel ? 'تم إظهار النتائج ✅ (إشعار لـ ' + (data || 0) + ' طالب)' : 'تم إخفاء النتائج 🔒'); go('results', id);
  },
  newTry: async (id, el) => {
    const st = (S.students || []).find(x => x.id === el.dataset.s) || {};
    if (!confirm('هتفتح محاولة جديدة للطالب ' + (st.first_name || '') + '؟\nمحاولاته القديمة في الامتحان ده هتتشال من قايمته (وبتتحفظ نسخة منها عندك) وهيوصله إشعار.')) return;
    const { data, error } = await sb.rpc('grant_new_attempt', { p_quiz: id, p_student: el.dataset.s }); if (error) throw new Error((error.message || '').includes('schema cache') || (error.message || '').includes('does not exist') ? 'شغّل ملف supabase_update_v6.sql في Supabase الأول' : error.message);
    toast('تم فتح محاولة جديدة ✅ (اتشال ' + (data || 0) + ' محاولة قديمة)'); go('results', id);
  },
  stNewTry: async (id, el) => {
    const q = $('#rq').value; if (!q) throw new Error('اختار الامتحان'); el.dataset.s = id; await ACT.newTry(q, el); closeModal();
  },
  stResetCourse: async (id, el) => {
    const c = $('#rc').value; if (!c) throw new Error('اختار الكورس');
    if (!confirm('هتتمسح كل علامات الإنجاز للطالب في الكورس ده وهيبدأ من الأول. تكمل؟')) return;
    const { error } = await sb.rpc('reset_course_progress', { p_course: c, p_student: id }); if (error) throw new Error((error.message || '').includes('does not exist') || (error.message || '').includes('schema cache') ? 'شغّل ملف supabase_update_v6.sql في Supabase الأول' : error.message);
    toast('تمت إعادة فتح الكورس للطالب ✅'); closeModal();
  },
  rpdf: () => {
    const R = window.__rep, e = esc, d = new Date().toLocaleDateString('ar-EG');
    const st = a => { const p = pcent(a); return a.status === 'pending' ? 'تصحيح معلّق' : p >= R.ps ? 'ناجح' : 'راسب'; };
    const t1 = R.took.map((x, i) => { const a = x.o.b; return '<tr><td>' + (i + 1) + '</td><td>' + e(fname(x.s)) + '</td><td dir="ltr">' + e(x.s.phone_number) + '</td><td>' + a.score + ' / ' + a.total + '</td><td>' + pcent(a) + '%</td><td>' + st(a) + '</td></tr>'; }).join('');
    const t2 = R.not.map((s, i) => '<tr><td>' + (i + 1) + '</td><td>' + e(fname(s)) + '</td><td dir="ltr">' + e(s.phone_number) + '</td><td dir="ltr">' + e(s.parent_phone || '—') + '</td></tr>').join('');
    const html = '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>' + e(R.qz.title) + '</title><style>@page{size:A4;margin:14mm}body{font-family:Cairo,Tahoma,Arial,sans-serif;color:#111;font-size:13px}h1{font-size:20px;margin:0 0 4px}h2{font-size:15px;margin:22px 0 8px}small{color:#555}table{width:100%;border-collapse:collapse}th,td{border:1px solid #bbb;padding:6px 8px;text-align:right}th{background:#eee}tr{page-break-inside:avoid}.h{display:flex;justify-content:space-between;border-bottom:2px solid #333;padding-bottom:8px;margin-bottom:10px}</style></head><body>'
      + '<div class="h"><div><h1>تقرير: ' + e(R.qz.title) + '</h1><small>The Leader In English — Mr. Sherif Khafagy</small></div><small>' + d + '</small></div>'
      + '<p>امتحنوا: <b>' + R.took.length + '</b> • لم يمتحنوا: <b>' + R.not.length + '</b> • نسبة النجاح: <b>' + R.ps + '%</b></p>'
      + '<h2>الطلاب اللي امتحنوا</h2><table><tr><th>#</th><th>الاسم</th><th>الهاتف</th><th>الدرجة</th><th>النسبة</th><th>النتيجة</th></tr>' + (t1 || '<tr><td colspan="6">لا أحد</td></tr>') + '</table>'
      + '<h2>الطلاب اللي لم يمتحنوا</h2><table><tr><th>#</th><th>الاسم</th><th>الهاتف</th><th>هاتف ولي الأمر</th></tr>' + (t2 || '<tr><td colspan="4">الكل امتحن ✅</td></tr>') + '</table></body></html>';
    const f = document.createElement('iframe'); f.style.cssText = 'position:fixed;left:-9999px;width:800px;height:600px'; document.body.appendChild(f);
    f.contentDocument.open(); f.contentDocument.write(html); f.contentDocument.close();
    setTimeout(() => { try { f.contentWindow.focus(); f.contentWindow.print(); } catch (x) { toast('تعذر فتح الطباعة'); } setTimeout(() => f.remove(), 60000); }, 400);
    toast('اختار «حفظ كـ PDF» من نافذة الطباعة');
  },
  rexport: () => {
    const R = window.__rep, q = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"', rows = [['الحالة', 'الاسم', 'الهاتف', 'هاتف ولي الأمر', 'الصف', 'الدرجة', 'من', 'النسبة', 'النتيجة']];
    R.took.forEach(x => { const a = x.o.b, p = pcent(a); rows.push(['امتحن', fname(x.s), x.s.phone_number, x.s.parent_phone || '', x.s.academic_year, a.score, a.total, p + '%', a.status === 'pending' ? 'تصحيح معلّق' : p >= R.ps ? 'ناجح' : 'راسب']); });
    R.not.forEach(s => rows.push(['لم يمتحن', fname(s), s.phone_number, s.parent_phone || '', s.academic_year, '', '', '', '']));
    const blob = new Blob(['﻿' + rows.map(r => r.map(q).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' }), a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = (R.qz.title || 'report') + '.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  },
  setAy: id => { S.ay = id; go('ann'); },
  newAnn: () => modal('إعلان جديد', '<form><label>الصف</label><select name="y"><option value="">🌐 كل الصفوف</option>' + yopts(YEARS.includes(S.ay) ? S.ay : '') + '</select><label>العنوان</label><input name="t" required><label>التفاصيل (اختياري)</label><textarea name="b"></textarea><button class="btn" style="width:100%;margin-top:16px">نشر الإعلان</button></form>',
    async f => { const row = { title: f.get('t').trim(), body: f.get('b').trim() || null, academic_year: f.get('y') || null }; const { error } = await sb.from('announcements').insert(row); if (error) throw new Error((error.message || '').includes('academic_year') ? 'شغّل ملف SQL الجديد في Supabase الأول' : error.message); toast('تم نشر الإعلان ✅'); go('ann'); }),
  saveFb: async (id, el) => { const { error } = await sb.rpc('set_feedback', { p_attempt: id, p_question: el.dataset.q, p_text: $('#fb' + el.dataset.i).value }); if (error) throw error; toast('تم حفظ التعليق ✅'); }
});


// ---------- إدارة الطالب: إعادة فتح امتحان / كورس ----------
const _studentModal0 = studentModal;
studentModal = function (id) {
  _studentModal0(id);
  (async () => {
    const [q, e] = await Promise.all([sb.from('quizzes').select('id,title,kind,courses(title),academic_year').order('created_at', { ascending: false }).limit(300), sb.from('enrollments').select('course_id').eq('student_id', id)]);
    const qo = (q.data || []).map(x => `<option value="${x.id}">${esc(x.title)} — ${esc(x.kind === 'comprehensive' ? 'شامل ' + (x.academic_year || '') : ((x.courses && x.courses.title) || ''))}</option>`).join('');
    const ids = new Set((e.data || []).map(x => x.course_id)), co = S.courses.filter(c => ids.has(c.id)).map(c => `<option value="${c.id}">${esc(c.title)}</option>`).join('');
    const box = document.createElement('div'); box.className = 'card'; box.style.marginTop = '14px';
    box.innerHTML = `<b>🔁 إعادة فتح</b><label>فتح محاولة جديدة في امتحان</label><div class="bar"><select id="rq"><option value="">— اختار الامتحان —</option>${qo}</select><button class="btn s" data-act="stNewTry" data-id="${id}">فتح محاولة</button></div>`
      + (co ? `<label>إعادة فتح كورس من البداية (يمسح علامات الإنجاز)</label><div class="bar"><select id="rc">${co}</select><button class="btn s" data-act="stResetCourse" data-id="${id}">إعادة فتح</button></div>` : '');
    const mb = document.querySelector('#mb'); if (mb) mb.appendChild(box);
  })();
};

// ---------- الدعم الفني ----------
const sp = { id: null, timer: null, status: 'open', img: null };
const tfmt = d => new Date(d).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' });
async function vSupport() {
  clearInterval(sp.timer); sp.id = null;
  const st = window.__spStatus || 'open';
  const { data, error } = await sb.rpc('support_admin_list', { p_status: st }); if (error) throw new Error((error.message || '').includes('does not exist') || (error.message || '').includes('schema cache') ? 'شغّل ملف supabase_update_v6.sql في Supabase الأول' : error.message);
  setTimeout(() => { if (document.querySelector('#spList')) sp.timer = setInterval(() => { if (window.__cur !== 'support') return clearInterval(sp.timer); if (sp.id) spThread(sp.id, true); else spRefreshList(); }, 6000); });
  return '<div class="bar"><button class="yt' + (st === 'open' ? ' on' : '') + '" data-act="spTab" data-id="open">مفتوحة</button><button class="yt' + (st === 'closed' ? ' on' : '') + '" data-act="spTab" data-id="closed">منتهية</button><button class="yt' + (st === 'all' ? ' on' : '') + '" data-act="spTab" data-id="all">الكل</button></div>'
    + '<div class="grid2" style="display:grid;grid-template-columns:minmax(260px,340px) 1fr;gap:14px"><div id="spList">' + spListHTML(data) + '</div><div id="spBox" class="card" style="min-height:360px"><div class="empty">اختار محادثة من القايمة</div></div></div>';
}
const spListHTML = d => (d || []).map(t => '<div class="card sprow' + (t.unread ? ' unr' : '') + '" data-act="spOpen" data-id="' + t.id + '" style="margin-bottom:8px;cursor:pointer;' + (t.unread ? 'border-color:#dc2626;' : '') + '">' + (t.unread ? '<span class="rdot" title="محتاج رد"></span>' : '') + '<b>' + esc(t.name || 'طالب') + '</b>' + (t.verified === false ? ' <span class="pill no" title="كتب رقمه من غير تسجيل دخول">⚠️ غير موثّق</span>' : '') + (t.phone_ok === false ? ' <span class="pill no" title="الطالب قال إن رقمه المسجّل غلط">📵 الرقم غلط</span>' : '') + (t.unread ? ' <span class="pill no">' + t.unread + ' جديد</span>' : '') + (t.status === 'closed' ? ' <span class="pill">منتهية</span>' : '') + '<br><small dir="ltr" style="color:var(--muted)">' + esc(t.phone) + ' • ' + tfmt(t.last_at) + '</small><br><small>' + esc((t.last || '').slice(0, 70)) + '</small></div>').join('') || '<div class="empty">لا توجد محادثات</div>';
async function spRefreshList() { const { data } = await sb.rpc('support_admin_list', { p_status: window.__spStatus || 'open' }); const el = document.querySelector('#spList'); if (el && data) el.innerHTML = spListHTML(data); }
let spSeen = null;
const spInfoHTML = d => '<div class="spinfo"><div><small>👤 الاسم (كتبه الطالب)</small><b>' + esc(d.name || '—') + '</b>' + (d.profile_name && d.profile_name !== d.name ? '<small>الاسم المسجّل: ' + esc(d.profile_name) + '</small>' : '') + '</div>'
  + '<div><small>📱 رقم الطالب المسجّل</small><b dir="ltr">' + esc(d.phone || '—') + '</b>' + (d.phone_ok === true ? '<small style="color:#16a34a">✅ الطالب أكّد إنه صحيح</small>' : d.phone_ok === false ? '<small style="color:#dc2626">⚠️ قال إنه غلط — الصحيح: <span dir="ltr">' + esc(d.alt_phone || '—') + '</span></small>' : '') + '</div>'
  + (d.student ? '<div><small>🎓 الصف</small><b>' + esc(d.student.academic_year || '—') + '</b></div><div><small>👨‍👩‍👦 رقم ولي الأمر</small><b dir="ltr">' + esc(d.student.parent_phone || '—') + '</b></div>' : '') + '</div>';
function spMsgHTML(m) { return '<div class="spm ' + (m.sender === 'staff' ? 'me' : 'th') + '">' + (m.image_url ? '<img class="zi" src="' + esc(m.image_url) + '" alt="صورة" loading="lazy">' : '') + (m.body ? '<div dir="auto">' + esc(m.body) + '</div>' : '') + '<small>' + tfmt(m.created_at) + (m.sender === 'staff' ? (spSeen && new Date(m.created_at) <= new Date(spSeen) ? ' • <span style="color:#16a34a">👁 شافها الطالب</span>' : ' • ✓ اتبعتت') : '') + '</small></div>'; }
async function spThread(id, quiet) {
  sp.id = id; const { data, error } = await sb.rpc('support_admin_thread', { p_thread: id }); if (error) throw error;
  spSeen = data.student_seen_at || null;
  const box = document.querySelector('#spBox'); if (!box) return;
  const feed = box.querySelector('#spFeed'), near = feed ? feed.scrollHeight - feed.scrollTop - feed.clientHeight < 80 : true;
  if (quiet && feed && feed.dataset.n === String(data.messages.length) && feed.dataset.s === data.status && feed.dataset.v === String(data.student_seen_at || '')) return;
  const draft = box.querySelector('#spTxt') ? box.querySelector('#spTxt').value : '';
  box.innerHTML = '<div class="bar" style="margin-bottom:8px"><b>' + esc(data.name || 'طالب') + '</b><span dir="ltr" style="color:var(--muted)">' + esc(data.phone) + '</span>' + (data.verified === false ? '<span class="pill no" title="الطالب كتب الرقم من غير تسجيل دخول، اتأكد من هويته قبل ما تشاركه أي بيانات">⚠️ غير موثّق</span>' : '') + '<span class="pill ' + (data.status === 'open' ? 'ok' : 'no') + '">' + (data.status === 'open' ? 'مفتوحة' : 'منتهية') + '</span><button class="btn s ' + (data.status === 'open' ? 'r' : 'g') + '" data-act="spClose" data-id="' + id + '" data-c="' + (data.status === 'open' ? 1 : 0) + '" style="margin-right:auto">' + (data.status === 'open' ? '⛔ إنهاء المحادثة' : '↩️ إعادة فتحها') + '</button><button class="btn s r" data-act="spDel" data-id="' + id + '" title="مسح المحادثة نهائياً">🗑 مسح</button></div>'
    + spInfoHTML(data)
    + '<div id="spFeed" data-n="' + data.messages.length + '" data-s="' + data.status + '" data-v="' + (data.student_seen_at || '') + '">' + data.messages.map(spMsgHTML).join('') + '</div>'
    + (data.status === 'open' ? '<div class="spin"><textarea id="spTxt" dir="auto" placeholder="اكتب ردك..." rows="2">' + esc(draft) + '</textarea><input type="file" id="spImg" accept="image/*" hidden><button class="btn s g" data-act="spPick" title="إرفاق صورة">📎</button><button class="btn" data-act="spSend" data-id="' + id + '">إرسال</button></div><small id="spInfo" style="color:var(--muted)"></small>' : '<p class="nt" style="margin-top:10px">المحادثة منتهية — الطالب لو راسل تاني هيبدأ محادثة جديدة، وده السجل محفوظ هنا.</p>');
  const f2 = box.querySelector('#spFeed'); if (f2 && (near || !quiet)) f2.scrollTop = f2.scrollHeight;
  if (!quiet) spRefreshList();
  if (window.__pollAlerts) setTimeout(window.__pollAlerts, 400);
}
async function __cmp(img) {
  let side = 1024, q = .72, blob;
  for (let i = 0; i < 6; i++) {
    const k = Math.min(1, side / Math.max(img.width, img.height)), c = document.createElement('canvas'); c.width = Math.max(1, Math.round(img.width * k)); c.height = Math.max(1, Math.round(img.height * k));
    const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
    blob = await new Promise(r => c.toBlob(r, 'image/jpeg', q));
    if (blob.size <= 150 * 1024) break;
    if (i % 2 === 0) q = Math.max(.45, q - .12); else side = Math.max(640, side - 160);
  }
  return blob;
}
async function spUpload(file) {
  const img = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('الملف مش صورة')); i.src = r.result; }; r.onerror = rej; r.readAsDataURL(file); });
  const blob = await __cmp(img); const path = 'u/s-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.jpg';
  const { error } = await sb.storage.from('support-files').upload(path, blob, { contentType: 'image/jpeg' }); if (error) throw error;
  return sb.storage.from('support-files').getPublicUrl(path).data.publicUrl;
}
Object.assign(ACT, {
  spTab: id => { window.__spStatus = id; go('support'); },
  spOpen: id => spThread(id),
  spPick: () => { const f = $('#spImg'); f.onchange = async () => { const file = f.files[0]; if (!file) return; const info = $('#spInfo'); info.textContent = '⏳ جاري رفع الصورة...'; try { sp.img = await spUpload(file); info.textContent = '✅ الصورة جاهزة — اضغط إرسال'; } catch (e) { sp.img = null; info.textContent = '⚠️ تعذر رفع الصورة'; } }; f.click(); },
  spSend: async (id, el) => {
    const t = $('#spTxt').value.trim(); if (!t && !sp.img) return; el.disabled = true;
    const { error } = await sb.rpc('support_admin_reply', { p_thread: id, p_body: t || null, p_image: sp.img || null }); el.disabled = false; if (error) throw error;
    sp.img = null; $('#spTxt').value = ''; await spThread(id);
  },
  spDel: async id => { if (!confirm('مسح المحادثة نهائياً بكل رسائلها؟ مش هتقدر ترجعها.')) return; const { error } = await sb.rpc('support_admin_delete', { p_thread: id }); if (error) throw error; sp.id = null; go('support'); },
  spClose: async (id, el) => { if (el.dataset.c === '1' && !confirm('إنهاء المحادثة؟ السجل هيفضل محفوظ.')) return; const { error } = await sb.rpc('support_admin_close', { p_thread: id, p_close: el.dataset.c === '1' }); if (error) throw error; await spThread(id); }
});
VIEWS.support = ['الدعم الفني', vSupport];

// ---------- فريق العمل (صلاحيات محدودة) ----------
const PERMS = [['support', '💬 الدعم الفني (الرد على الطلاب)'], ['ann', '📢 الإعلانات والإشعارات'], ['results', '🎓 النتائج والتقارير وتصحيح المقالي'], ['students', '👥 الطلاب (عرض + فتح محاولة جديدة / إعادة كورس)'], ['content', '📚 المحتوى: الكورسات والدروس والامتحانات']];
async function vStaff() {
  const { data, error } = await sb.rpc('staff_list'); if (error) { if ((error.message || '').includes('forbidden')) return '<div class="empty">🔒 هذا القسم للمالك فقط.</div>'; throw new Error((error.message || '').includes('does not exist') || (error.message || '').includes('schema cache') ? 'شغّل ملف supabase_update_v6.sql في Supabase الأول' : error.message); }
  const pb = (sel) => PERMS.map(p => '<label class="chk"><input type="checkbox" class="pm" value="' + p[0] + '"' + (sel.includes(p[0]) ? ' checked' : '') + '> ' + p[1] + '</label>').join('');
  return '<div class="card" style="margin-bottom:16px"><b>➕ إضافة عضو فريق</b><p class="nt" style="margin:6px 0 10px;line-height:1.9">اكتب إيميل الحساب أو رقم الهاتف المسجّل بيه في المنصة. العضو هيدخل من صفحة <b>/admin</b> بنفس حسابه، ومش هيشوف غير الأقسام اللي تديله صلاحيتها.</p><input id="sf_w" dir="ltr" placeholder="الإيميل أو رقم الهاتف">' + pb(['support']) + '<button class="btn" data-act="stfAdd" style="margin-top:10px">إضافة</button></div>'
    + '<div class="tw"><table><tr><th>العضو</th><th>الصلاحيات</th><th></th></tr>' + (data.map(m => '<tr><td>' + esc(m.label || '—') + '<br><small dir="ltr" style="color:var(--muted)">' + esc(m.email || '') + '</small></td><td>' + (m.perms || []).map(p => '<span class="pill ok">' + esc((PERMS.find(x => x[0] === p) || [p, p])[1]) + '</span>').join(' ') + '</td><td><button class="btn s r" data-act="stfDel" data-id="' + m.user_id + '">إزالة</button></td></tr>').join('') || '<tr><td colspan="3" class="empty">لا يوجد أعضاء بعد</td></tr>') + '</table></div>'
    + '<p class="nt" style="margin-top:10px;line-height:1.9">ملاحظة: صلاحية «مسؤول» الكاملة بتتدار من قسم «المسؤولون». أعضاء الفريق هنا صلاحياتهم محدودة بالأقسام المذكورة بس.</p>';
}
Object.assign(ACT, {
  stfAdd: async () => { const w = $('#sf_w').value.trim(), perms = Array.from(document.querySelectorAll('.pm:checked')).map(x => x.value); if (!w) throw new Error('اكتب الإيميل أو الهاتف'); if (!perms.length) throw new Error('اختار صلاحية واحدة على الأقل'); const { error } = await sb.rpc('staff_add', { p_who: w, p_perms: perms }); if (error) throw new Error((error.message || '').includes('user_not_found') ? 'مفيش حساب بالإيميل/الرقم ده' : error.message); toast('تمت الإضافة ✅'); go('staff'); },
  stfDel: async id => { if (!confirm('إزالة العضو من الفريق؟')) return; const { error } = await sb.rpc('staff_remove', { p_user: id }); if (error) throw error; toast('تمت الإزالة'); go('staff'); }
});
VIEWS.staff = ['فريق العمل', vStaff];
if (typeof NAV !== 'undefined' && !NAV.some(n => n[0] === 'support')) { NAV.splice(NAV.length - 1, 0, ['support', '💬', 'الدعم الفني']); NAV.push(['staff', '👷', 'فريق العمل']); }

// CSS
(function () { const st = document.createElement('style'); st.textContent = '#spFeed{max-height:52vh;overflow:auto;display:flex;flex-direction:column;gap:8px;padding:6px 2px}.spm{max-width:78%;padding:9px 12px;border-radius:14px;line-height:1.8;font-weight:600;white-space:pre-wrap;word-break:break-word}.spm small{display:block;font-size:11px;opacity:.65;margin-top:3px}.spm img{max-width:240px;max-height:240px;border-radius:10px;display:block;margin-bottom:4px}.spm.th{align-self:flex-start;background:var(--bg);border:1px solid var(--line)}.spm.me{align-self:flex-end;background:rgba(99,102,241,.18)}.spin{display:flex;gap:8px;align-items:flex-end;margin-top:10px}.spin textarea{min-height:48px}.sprow:hover{border-color:var(--brand)}@media(max-width:760px){.grid2{grid-template-columns:1fr!important}}'; document.head.appendChild(st); })();

// ---------- المحاولات والقفل (تبويب كامل) ----------
const AC = { sid: null, cid: null };
async function vAccess() {
  await loadStudents(); if (!S.courses) await loadCourses();
  const co = S.courses.map(c => `<option value="${c.id}" ${c.id === AC.cid ? 'selected' : ''}>${esc(c.title)}${c.academic_year ? ' — ' + esc(c.academic_year) : ''}</option>`).join('');
  const st = AC.sid ? S.students.find(x => x.id === AC.sid) : null;
  return `<div class="card"><b>🔁 المحاولات والقفل</b><p class="nt">افتح محاولة جديدة لأي طالب، أو اقفل/افتح كورس أو درس أو امتحان — لطالب واحد أو لكل الطلاب. محاولاته القديمة بتتحفظ في السجل.</p>
  <label>ابحث عن الطالب (اسم أو رقم)</label><div class="bar"><input id="acq" placeholder="اكتب الاسم أو الرقم" value="${esc(st ? fname(st) : '')}"><button class="btn s" data-act="acFind">بحث</button></div><div id="acr"></div>
  <label>الكورس</label><div class="bar"><select id="acc">${co}</select><button class="btn s" data-act="acShow">عرض</button></div></div><div id="acb">${AC.sid && AC.cid ? '' : '<div class="empty">اختار طالب وكورس</div>'}</div>`;
}
const _ac = (k, id, all, me, who) => (all ? '<span class="pill no">🌐 مقفول للكل</span> ' : '') + (me ? '<span class="pill no">🔒 مقفول للطالب</span> ' : '')
  + `<button class="btn s ${me ? 'g' : 'r'}" data-act="acLock" data-id="${id}" data-k="${k}" data-w="s" data-l="${me ? 0 : 1}">${me ? '🔓 فتح له' : '🔒 قفل له'}</button> `
  + `<button class="btn s ${all ? 'g' : ''}" data-act="acLock" data-id="${id}" data-k="${k}" data-w="a" data-l="${all ? 0 : 1}">${all ? '🔓 فتح للكل' : '🌐 قفل للكل'}</button>`;
async function acDraw() {
  const box = $('#acb'); if (!box || !AC.sid || !AC.cid) return;
  box.innerHTML = '<div class="empty">جاري التحميل...</div>';
  const { data, error } = await sb.rpc('access_state', { p_student: AC.sid, p_course: AC.cid });
  if (error) { box.innerHTML = '<div class="empty">' + esc((error.message || '').includes('does not exist') || (error.message || '').includes('schema cache') ? 'شغّل ملف supabase_update_v8.sql في Supabase الأول' : error.message) + '</div>'; return; }
  const st = S.students.find(x => x.id === AC.sid) || {};
  box.innerHTML = `<div class="card"><div class="bar"><b>👤 ${esc(fname(st))}</b><span dir="ltr" style="color:var(--muted)">${esc(st.phone_number || '')}</span></div>
    <h4 style="margin:12px 0 6px">📚 الكورس كله</h4><div class="bar">${_ac('course', AC.cid, data.course_locked_all, data.course_locked)}<button class="btn s" data-act="acReset">♻️ إعادة فتح الكورس من البداية</button></div>
    <h4 style="margin:16px 0 6px">📖 الدروس</h4>${(data.lessons || []).map(l => `<div class="bar" style="padding:6px 0;border-bottom:1px solid var(--line,#eee)"><b style="min-width:160px">${esc(l.title)}</b>${_ac('lesson', l.id, l.all, l.me)}</div>`).join('') || '<div class="empty">لا دروس</div>'}
    <h4 style="margin:16px 0 6px">📝 الامتحانات</h4>${(data.quizzes || []).map(z => `<div class="bar" style="padding:6px 0;border-bottom:1px solid var(--line,#eee)"><b style="min-width:160px">${esc(z.title)}${z.kind === 'comprehensive' ? ' <small>(شامل)</small>' : ''}</b><span class="pill">${z.used}/${z.max || 1} محاولة</span>${z.archived ? `<span class="pill">📜 ${z.archived} قديمة</span>` : ''}<button class="btn s" data-act="acNew" data-id="${z.id}">🔁 محاولة جديدة</button><button class="btn s g" data-act="acHist" data-id="${z.id}">📜 السجل</button>${_ac('quiz', z.id, z.all, z.me)}</div>`).join('') || '<div class="empty">لا امتحانات</div>'}</div>`;
}
Object.assign(ACT, {
  acFind: () => {
    const q = ($('#acq').value || '').trim().toLowerCase(); if (!q) return;
    const r = S.students.filter(s => (fname(s) + ' ' + (s.phone_number || '')).toLowerCase().includes(q)).slice(0, 12);
    $('#acr').innerHTML = r.map(s => `<button class="btn s g" data-act="acStu" data-id="${s.id}" style="margin:4px">${esc(fname(s))} • ${esc(s.phone_number || '')}</button>`).join('') || '<div class="empty">لا نتائج</div>';
  },
  acStu: id => { AC.sid = id; const s = S.students.find(x => x.id === id); $('#acq').value = fname(s); $('#acr').innerHTML = '<span class="pill ok">✓ تم اختيار ' + esc(fname(s)) + '</span>'; AC.cid = $('#acc').value; acDraw(); },
  acShow: () => { AC.cid = $('#acc').value; if (!AC.sid) return toast('اختار الطالب الأول', true); acDraw(); },
  acLock: async (id, el) => {
    const all = el.dataset.w === 'a', lock = el.dataset.l === '1';
    if (all && lock && !confirm('هتقفل ده لكل الطلاب. تكمل؟')) return;
    const { error } = await sb.rpc('set_lock', { p_kind: el.dataset.k, p_ref: id, p_student: all ? null : AC.sid, p_locked: lock }); if (error) throw error;
    toast(lock ? 'تم القفل 🔒' : 'تم الفتح 🔓'); acDraw();
  },
  acNew: async id => {
    const st = S.students.find(x => x.id === AC.sid) || {};
    if (!confirm('فتح محاولة جديدة للطالب ' + (st.first_name || '') + '؟\nمحاولاته القديمة بتتحفظ في «السجل» وهيوصله إشعار.')) return;
    const { data, error } = await sb.rpc('grant_new_attempt', { p_quiz: id, p_student: AC.sid }); if (error) throw error;
    toast('تم فتح محاولة جديدة ✅ (' + (data || 0) + ' محاولة اتحفظت في السجل)'); acDraw();
  },
  acHist: async id => {
    const { data, error } = await sb.rpc('attempt_history', { p_student: AC.sid, p_quiz: id }); if (error) throw error;
    const row = (a, t) => `<tr><td>${t}</td><td>${a.score == null ? '—' : a.score + ' / ' + a.total}</td><td>${a.at ? tfmt(a.at) : ''}</td></tr>`;
    modal('📜 سجل المحاولات', `<table class="tb"><tr><th>الحالة</th><th>الدرجة</th><th>التاريخ</th></tr>${(data.current || []).map(a => row(a, a.status === 'pending' ? 'حالية (تصحيح معلّق)' : 'حالية')).join('')}${(data.archived || []).map(a => row(a, 'قديمة (مؤرشفة)')).join('') || ''}</table>${(data.current || []).length + (data.archived || []).length ? '' : '<div class="empty">لا محاولات</div>'}`, null);
  },
  acReset: async () => {
    if (!confirm('هتتمسح علامات الإنجاز للطالب في الكورس ده وهيبدأ من الأول. تكمل؟')) return;
    const { error } = await sb.rpc('reset_course_progress', { p_course: AC.cid, p_student: AC.sid }); if (error) throw error; toast('تمت إعادة فتح الكورس ✅');
  }
});
VIEWS.access = ['المحاولات والقفل', vAccess];
if (typeof NAV !== 'undefined' && !NAV.some(n => n[0] === 'access')) NAV.splice(NAV.findIndex(n => n[0] === 'students') + 1, 0, ['access', '🔁', 'المحاولات والقفل']);

// ---------- طباعة كروت الأكواد (A4: 8 أو 10 في الورقة) + كود واحد ----------
// كل الكتابة على الكارت بالعربي (ما عدا اسم المنصة والمدرس)، والصف يتحدد من الأول ثم الكورس ثم الطلاب.
const CARD_CSS = `@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@600;800&family=Poppins:wght@500;700&display=swap');
@page{size:A4;margin:0}*{box-sizing:border-box;margin:0}:root{--navy:#0f172a;--red:#ef4444;--mut:#64748b}
html,body{direction:rtl}
body{font-family:'Cairo','DejaVu Sans',sans-serif;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:210mm;height:297mm;padding:10mm 13mm;display:grid;grid-template-columns:repeat(2,92mm);justify-content:center;column-gap:0;page-break-after:always;overflow:hidden;direction:ltr}
.page:last-child{page-break-after:auto}
.card{position:relative;width:92mm;direction:rtl;border:.3mm solid #94a3b8;padding:3.5mm 5.5mm 3mm 5.5mm;background:linear-gradient(135deg,#fff 60%,#fef2f2);overflow:hidden;display:flex;flex-direction:column;justify-content:space-between}
.bar{position:absolute;left:0;top:0;bottom:0;width:2.4mm;background:linear-gradient(var(--navy),var(--red))}
.hd{direction:ltr;display:flex;align-items:baseline;justify-content:space-between;gap:2mm;border-bottom:.45mm solid var(--red);padding:0 0 1.3mm 2.2mm;unicode-bidi:isolate}
.t{font:700 13pt 'Poppins','DejaVu Sans',sans-serif;color:var(--navy);white-space:nowrap}.s{font:500 8.5pt 'Poppins','DejaVu Sans',sans-serif;color:var(--red);white-space:nowrap}
.cn{font:800 12.5pt 'Cairo','DejaVu Sans',sans-serif;color:var(--navy);direction:rtl;text-align:center;background:#fee2e2;border-radius:1.5mm;padding:.6mm 2mm;line-height:1.3;overflow:hidden;display:flex;align-items:center;justify-content:center;min-height:8mm}
.row{direction:rtl;display:flex;align-items:flex-end;gap:2.5mm;padding-left:2.2mm;min-height:8mm}
.ar{flex:none;font:800 10pt 'Cairo','DejaVu Sans',sans-serif;color:var(--navy);white-space:nowrap;padding-bottom:.2mm}
.ln{flex:1;border-bottom:.25mm dotted var(--mut);min-height:6mm;font:800 10.5pt 'Cairo',sans-serif;text-align:center;color:#111;line-height:1.5;overflow:hidden;white-space:nowrap}
.code{align-items:center;min-height:11mm}
.ln.box{border:.4mm solid var(--navy);border-radius:1.4mm;background:#fff;min-height:9.5mm;display:flex;align-items:center;justify-content:center;font:700 13pt 'Poppins','DejaVu Sans',monospace;letter-spacing:.5mm;direction:ltr;padding-left:.5mm;white-space:nowrap;overflow:hidden}
.exp{font:600 7pt Cairo,sans-serif;color:var(--red);text-align:center;direction:rtl}.p8 .card{height:69mm}.p10 .card{height:55mm}.p10 .t{font-size:12pt}.p10 .cn{font-size:11.5pt}.p10 .row{min-height:6.8mm}.p10 .ln.box{min-height:8.5mm;font-size:12.5pt}
.one{width:150mm;margin:12mm auto}.one .card{width:150mm;height:112mm;padding:6mm 9mm;gap:2mm}.one .t{font-size:19pt}.one .s{font-size:11pt}.one .cn{font-size:17pt;padding:1.2mm 3mm}
.one .row{min-height:11mm}.one .ar{font-size:13pt}.one .ln{font-size:14pt}.one .ln.box{min-height:14mm;font-size:22pt;letter-spacing:1.2mm}.one .bar{width:3.4mm}
.one .notes{border:.3mm dashed #94a3b8;border-radius:1.5mm;flex:1;min-height:14mm;padding:1.5mm 3mm;direction:rtl;font:800 10pt Cairo,sans-serif;color:var(--mut)}`;
const cZoom = o => (o.course || '').length > 34 ? '.75' : (o.course || '').length > 24 ? '.88' : '1';
const cardHTML = (o) => `<div class="card"><div class="bar"></div><div class="hd"><div class="t">The Leader In English</div><div class="s">Mr Sherif Khafagy</div></div>
<div class="cn" style="zoom:${cZoom(o)}">${esc(o.course || '')}</div>
<div class="row"><span class="ar">اسم الطالب :</span><span class="ln">${esc(o.name || '')}</span></div>
<div class="row"><span class="ar">الصف الدراسي :</span><span class="ln">${esc(o.grade || '')}</span></div>
<div class="row code"><span class="ar">الكود :</span><span class="ln box">${esc(o.code)}</span></div><div class="exp">⏳ الكود صالح 72 ساعة ويُستخدم مرة واحدة فقط${o.exp ? ' — ينتهي ' + esc(o.exp) : ''}</div></div>`;
const oneHTML = (o) => `<div class="one"><div class="card"><div class="bar"></div><div class="hd"><div class="t">The Leader In English</div><div class="s">Mr Sherif Khafagy</div></div>
<div class="cn" style="zoom:${cZoom(o)}">${esc(o.course || '')}</div>
<div class="row"><span class="ar">اسم الطالب :</span><span class="ln">${esc(o.name || '')}</span></div>
<div class="row"><span class="ar">الصف الدراسي :</span><span class="ln">${esc(o.grade || '')}</span></div>
<div class="row code"><span class="ar">الكود :</span><span class="ln box">${esc(o.code)}</span></div>
<div class="exp">⏳ الكود صالح 72 ساعة ويُستخدم مرة واحدة فقط${o.exp ? ' — ينتهي ' + esc(o.exp) : ''}</div><div class="notes">${esc(o.note || 'ملاحظات :')}</div></div></div>`;
function printHTML(body, cls, title) {
  const html = '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>' + esc(title) + '</title><style>' + CARD_CSS + '</style></head><body class="' + cls + '">' + body + '</body></html>';
  const f = document.createElement('iframe'); f.style.cssText = 'position:fixed;left:-9999px;width:900px;height:700px'; document.body.appendChild(f);
  f.contentDocument.open(); f.contentDocument.write(html); f.contentDocument.close();
  const go = () => { try { f.contentWindow.focus(); f.contentWindow.print(); } catch (x) { toast('تعذر فتح الطباعة', true); } setTimeout(() => f.remove(), 90000); };
  setTimeout(() => { try { f.contentDocument.fonts.ready.then(() => setTimeout(go, 300)); } catch (e) { go(); } }, 700);
  toast('اختار «حفظ كـ PDF» أو الطابعة — مقاس A4 بدون هوامش');
}
const expTxt = () => new Date(Date.now() + 72 * 36e5).toLocaleString('ar-EG', { day: 'numeric', month: 'numeric', hour: 'numeric', minute: '2-digit' });
function printSheet(list, per, course, grade) {
  const n = per === 8 ? 8 : 10, pages = []; for (let i = 0; i < list.length; i += n) pages.push(list.slice(i, i + n));
  printHTML(pages.map(pg => '<div class="page p' + n + '">' + pg.map(o => cardHTML(Object.assign({ course, grade, exp: expTxt() }, o))).join('') + '</div>').join(''), '', 'أكواد ' + course);
}
// كود واحد كصورة (Canvas)
async function cardPNG(o) {
  try { await document.fonts.load('800 40px Cairo'); await document.fonts.load('700 40px Poppins'); } catch (e) {}
  const W = 1500, H = 920, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(.6, '#fff'); g.addColorStop(1, '#fef2f2'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.strokeStyle = '#94a3b8'; x.lineWidth = 3; x.strokeRect(1.5, 1.5, W - 3, H - 3);
  const bg = x.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0f172a'); bg.addColorStop(1, '#ef4444'); x.fillStyle = bg; x.fillRect(0, 0, 34, H);
  x.textBaseline = 'alphabetic'; x.direction = 'ltr'; x.textAlign = 'left'; x.fillStyle = '#0f172a'; x.font = '700 70px Poppins, Arial'; x.fillText('The Leader In English', 90, 120);
  x.textAlign = 'right'; x.fillStyle = '#ef4444'; x.font = '500 42px Poppins, Arial'; x.fillText('Mr Sherif Khafagy', W - 70, 120);
  x.fillStyle = '#ef4444'; x.fillRect(90, 148, W - 160, 5);
  x.fillStyle = '#fee2e2'; const bx = 90, bw = W - 160; x.beginPath(); x.roundRect ? x.roundRect(bx, 185, bw, 110, 18) : x.rect(bx, 185, bw, 110); x.fill();
  x.direction = 'rtl'; x.textAlign = 'center'; x.fillStyle = '#0f172a'; x.font = '800 66px Cairo, Tahoma, Arial'; x.fillText(o.course || '', W / 2, 265, bw - 40);
  const row = (y, label, val, box) => {
    x.direction = 'rtl'; x.textAlign = 'right'; x.fillStyle = '#0f172a'; x.font = '800 54px Cairo, Tahoma, Arial'; x.fillText(label, W - 70, y);
    const l = 90, r = W - 70 - x.measureText(label).width - 30;
    if (box) { x.strokeStyle = '#0f172a'; x.lineWidth = 4; x.fillStyle = '#fff'; x.beginPath(); x.roundRect ? x.roundRect(l, y - 78, r - l, 104, 16) : x.rect(l, y - 78, r - l, 104); x.fill(); x.stroke(); x.direction = 'ltr'; x.textAlign = 'center'; x.fillStyle = '#0f172a'; const txt = String(val).split('').join('\u2009'); let fs = 78; for (; fs > 30; fs -= 2) { x.font = '700 ' + fs + 'px Poppins, monospace'; if (x.measureText(txt).width <= (r - l) - 60) break; } x.fillText(txt, (l + r) / 2, y + 2 - Math.round((78 - fs) / 4)); }
    else { x.strokeStyle = '#64748b'; x.setLineDash([3, 9]); x.lineWidth = 4; x.beginPath(); x.moveTo(l, y + 8); x.lineTo(r, y + 8); x.stroke(); x.setLineDash([]); if (val) { x.direction = 'rtl'; x.textAlign = 'center'; x.font = '800 52px Cairo, Tahoma, Arial'; x.fillText(val, (l + r) / 2, y - 6, r - l - 20); } }
  };
  row(400, 'اسم الطالب :', o.name || ''); row(510, 'الصف الدراسي :', o.grade || ''); row(650, 'الكود :', o.code, true);
  x.direction = 'rtl'; x.textAlign = 'center'; x.fillStyle = '#ef4444'; x.font = '800 34px Cairo, Tahoma, Arial'; x.fillText('⏳ الكود صالح 72 ساعة ويُستخدم مرة واحدة فقط' + (o.exp ? ' — ينتهي ' + o.exp : ''), W / 2, 716);
  x.setLineDash([14, 10]); x.strokeStyle = '#94a3b8'; x.lineWidth = 3; x.strokeRect(90, 735, W - 160, 150); x.setLineDash([]);
  x.direction = 'rtl'; x.textAlign = 'right'; x.fillStyle = '#64748b'; x.font = '800 40px Cairo, Tahoma, Arial'; x.fillText(o.note || 'ملاحظات :', W - 110, 790);
  return new Promise(r => c.toBlob(r, 'image/png'));
}

// ---- لوحة الطباعة: الصف ← الكورس ← الطلاب ← كروت إضافية فاضية ----
const PR = { sel: new Set(), q: '' };
const _vCodes0 = VIEWS.codes[1];
VIEWS.codes = ['الأكواد', async () => {
  const html = await _vCodes0();
  await (S.courses && S.courses.length ? 0 : loadCourses());
  try { await loadStudents(); } catch (e) {}
  PR.sel = new Set(); PR.q = '';
  setTimeout(pInit);
  const panel = `<div class="card" style="margin-bottom:16px"><b>🖨 طباعة كروت الأكواد (A4)</b>
  <p class="nt">اختار الصف، بعدين الكورس، بعدين علّم الطلاب اللي عايز كروتهم (الاسم بيتكتب على الكارت). تقدر كمان تضيف كروت إضافية فاضية (من غير اسم) والطالب يكتب اسمه بإيده. كل كود يشتغل مرة واحدة بس وصالح 72 ساعة.</p>
  <div class="bar"><div><label>١) الصف الدراسي</label><select id="pgr"><option value="">— اختار الصف —</option>${yopts('')}</select></div><div><label>٢) الكورس</label><select id="pcs"><option value="">— اختار الصف الأول —</option></select></div></div>
  <label>٣) الطلاب <span id="pcnt" class="pill ok" style="margin-right:8px">المحدد: 0 طالب</span></label>
  <div class="bar" style="margin:6px 0"><input id="pq" placeholder="🔍 بحث بالاسم أو الرقم"><button type="button" class="btn s g" data-act="pAll">تحديد الكل</button><button type="button" class="btn s g" data-act="pNone">إلغاء التحديد</button><button type="button" class="btn s g" data-act="pNew" title="الطلاب اللي مش مشتركين في الكورس المختار">غير المشتركين فقط</button></div>
  <div id="pstu" class="tw" style="max-height:260px;overflow:auto;padding:6px 10px"><div class="empty" style="padding:18px">اختار الصف عشان تظهر أسماء الطلاب</div></div>
  <div class="bar" style="margin-top:12px"><div><label>٤) كروت إضافية فاضية (من غير اسم)</label><input type="number" id="pex" min="0" max="200" value="0" style="max-width:130px"></div><div><label>٥) عدد الكروت في الورقة</label><select id="pl"><option value="10">10 كروت</option><option value="8">8 كروت (أكبر)</option></select></div><div><label>الإجمالي</label><span id="ptot" class="pill" style="font-size:14px;padding:8px 16px">0 كارت</span></div></div>
  <div class="bar" style="margin-top:12px"><button class="btn" data-act="pgen">🖨 توليد وطباعة PDF</button><button class="btn s" data-act="pagain">🖨 إعادة طباعة آخر دفعة</button><button class="btn s g" data-act="pone">🎫 كود واحد (صورة / PDF)</button></div></div>`;
  return panel + html;
}];
function pCourses() { const y = $('#pgr') ? $('#pgr').value : ''; return S.courses.filter(c => !y || c.academic_year === y); }
function pEnrolled(cid) { return new Set((S.enr || []).filter(e => e.course_id === cid).map(e => e.student_id)); }
function pCount() {
  const x = Math.max(0, Math.min(200, +($('#pex') && $('#pex').value) || 0)), n = PR.sel.size;
  const c = $('#pcnt'); if (c) c.textContent = 'المحدد: ' + n + ' طالب'; const t = $('#ptot'); if (t) { t.textContent = (n + x) + ' كارت'; t.className = 'pill ' + (n + x > 200 ? 'no' : n + x ? 'ok' : ''); }
}
function pDrawStu() {
  const box = $('#pstu'); if (!box) return; const y = $('#pgr').value, q = PR.q.trim().toLowerCase(), cid = $('#pcs').value, en = cid ? pEnrolled(cid) : new Set();
  if (!y) { box.innerHTML = '<div class="empty" style="padding:18px">اختار الصف عشان تظهر أسماء الطلاب</div>'; return pCount(); }
  const l = (S.students || []).filter(s => s.academic_year === y && (!q || (fname(s) + ' ' + (s.phone_number || '')).toLowerCase().includes(q))).sort((a, b) => fname(a).localeCompare(fname(b), 'ar'));
  box.innerHTML = l.map(s => '<label class="chk" style="margin:0;padding:6px 0;border-bottom:1px solid var(--line)"><input type="checkbox" class="ck pst" value="' + s.id + '"' + (PR.sel.has(s.id) ? ' checked' : '') + '> <span>' + esc(fname(s)) + '</span><small dir="ltr" style="color:var(--muted);margin-right:auto">' + esc(s.phone_number || '') + '</small>' + (en.has(s.id) ? '<span class="pill ok">مشترك</span>' : '') + '</label>').join('') || '<div class="empty" style="padding:18px">لا يوجد طلاب في الصف ده</div>';
  pCount();
}
function pInit() {
  const g = $('#pgr'); if (!g) return;
  const fillC = () => { const cur = $('#pcs').value, cs = pCourses(); $('#pcs').innerHTML = '<option value="">' + (g.value ? '— اختار الكورس —' : '— اختار الصف الأول —') + '</option>' + cs.map(c => '<option value="' + c.id + '"' + (c.id === cur ? ' selected' : '') + '>' + esc(c.title) + '</option>').join(''); };
  g.addEventListener('change', () => { PR.sel.clear(); fillC(); pDrawStu(); });
  $('#pcs').addEventListener('change', pDrawStu);
  $('#pq').addEventListener('input', e => { PR.q = e.target.value; pDrawStu(); });
  $('#pex').addEventListener('input', pCount);
  $('#pstu').addEventListener('change', e => { const c = e.target.closest('.pst'); if (!c) return; c.checked ? PR.sel.add(c.value) : PR.sel.delete(c.value); pCount(); });
  pCount();
}
async function pMake(cid, n, names, grade) {
  const { data, error } = await sb.rpc('generate_codes', { p_course: cid, p_count: n, p_names: names.some(x => x) ? names : null, p_grade: grade || null });
  if (error) throw new Error((error.message || '').includes('function') ? 'شغّل ملف supabase_update_v9.sql في Supabase الأول' : error.message);
  const course = (S.courses.find(c => c.id === cid) || {}).title || '';
  return { codes: data, course, list: data.map((c, i) => ({ code: c, name: names[i] || '' })), grade };
}
Object.assign(ACT, {
  pAll: () => { document.querySelectorAll('#pstu .pst').forEach(c => { c.checked = true; PR.sel.add(c.value); }); pCount(); },
  pNone: () => { PR.sel.clear(); document.querySelectorAll('#pstu .pst').forEach(c => c.checked = false); pCount(); },
  pNew: () => { const cid = $('#pcs').value; if (!cid) return toast('اختار الكورس الأول', true); const en = pEnrolled(cid); PR.sel.clear(); document.querySelectorAll('#pstu .pst').forEach(c => { c.checked = !en.has(c.value); if (c.checked) PR.sel.add(c.value); }); pCount(); },
  pgen: async () => {
    const grade = $('#pgr').value, cid = $('#pcs').value; if (!grade) throw new Error('اختار الصف'); if (!cid) throw new Error('اختار الكورس');
    const names = (S.students || []).filter(s => PR.sel.has(s.id)).sort((a, b) => fname(a).localeCompare(fname(b), 'ar')).map(fname), extra = Math.max(0, Math.min(200, +$('#pex').value || 0)), n = names.length + extra;
    if (n < 1) throw new Error('علّم طالب واحد على الأقل أو اكتب عدد الكروت الإضافية'); if (n > 200) throw new Error('الحد الأقصى 200 كارت في المرة (حالياً ' + n + ')');
    if (!confirm('هيتولّد ' + n + ' كود (' + names.length + ' باسم الطالب + ' + extra + ' فاضي) للكورس المختار. تكمل؟')) return;
    const all = names.concat(Array(extra).fill('')), r = await pMake(cid, n, all, grade); window.__lastCodes = { list: r.list, course: r.course, grade, per: +$('#pl').value };
    drawCodes(); printSheet(r.list, +$('#pl').value, r.course, grade);
  },
  pagain: () => { const L = window.__lastCodes; if (!L) return toast('مفيش دفعة اتولّدت في الجلسة دي', true); printSheet(L.list, +$('#pl').value, L.course, L.grade); },
  pone: async () => {
    const cid = $('#pcs').value || ($('#cc') && $('#cc').value); if (!cid) throw new Error('اختار الكورس'); const grade = $('#pgr').value, one = (S.students || []).filter(s => PR.sel.has(s.id)).map(fname)[0] || '';
    const r = await pMake(cid, 1, [one], grade), o = { code: r.codes[0], course: r.course, name: one, grade, exp: expTxt() }; window.__one = o; drawCodes();
    modal('🎫 كود واحد', `<div style="direction:ltr;text-align:center;font:700 22px monospace;letter-spacing:3px;margin:10px 0">${esc(o.code)}</div><div class="bar"><button class="btn" data-act="pOnePng">🖼 تنزيل صورة PNG</button><button class="btn s" data-act="pOnePdf">🖨 طباعة / PDF</button></div><p class="nt">الكارت بالعربي ومعاه مساحة للملاحظات.</p>`, null);
  },
  pOnePng: async () => { const o = window.__one; const b = await cardPNG(o), a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'code-' + o.code + '.png'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 3000); },
  pOnePdf: () => { const o = window.__one; printHTML(oneHTML(o), '', 'كود ' + o.code); }
});

// ---- قايمة الأكواد + حذف ----
drawCodes = async function () {
  const sel = $('#cc'); if (!sel) return; const cid = sel.value; if (!cid) { $('#cl').innerHTML = '<div class="empty">أضف كورساً أولاً</div>'; return; }
  try { await loadStudents(); } catch (e) {}
  try { await sb.rpc('purge_expired_codes'); } catch (e) {}   // مسح المنتهي غير المستخدم
  let r0 = null;
  for (const c of ['code,student_name,grade,used_by,used_at,created_at,expires_at', 'code,used_by,used_at,created_at,expires_at', 'code,used_by,used_at,created_at']) { r0 = await sb.from('activation_codes').select(c).eq('course_id', cid).order('created_at', { ascending: false }).limit(600); if (!r0.error) break; }
  if (r0.error) return fail(r0.error);
  const data = r0.data || [], used = data.filter(x => x.used_by).length, free = data.length - used;
  window.__codesList = data;
  const canDel = can('codes.delete');
  $('#cl').innerHTML = '<div class="bar"><b>المستخدم: ' + used + ' • المتاح: ' + free + '</b>' + (canDel && free ? '<button class="btn s r" data-act="cdDelSel" style="margin-right:auto">🗑 حذف المحدد (<span id="cdn">0</span>)</button><button class="btn s g" data-act="cdDelUnused">🗑 حذف كل غير المستخدم (' + free + ')</button>' : '') + '</div>'
    + '<div class="tw"><table><tr>' + (canDel ? '<th style="width:1%"><input type="checkbox" class="ck" id="cdAll" title="تحديد كل غير المستخدم"></th>' : '') + '<th>الكود</th><th>الاسم</th><th>الحالة</th><th>ينتهي</th><th>استخدمه</th></tr>'
    + data.map(x => { const s = (S.students || []).find(t => t.id === x.used_by); return '<tr>' + (canDel ? '<td>' + (x.used_by ? '' : '<input type="checkbox" class="ck cdk" value="' + esc(x.code) + '">') + '</td>' : '') + '<td dir="ltr" style="font-weight:800;letter-spacing:1px">' + esc(x.code) + '</td><td>' + esc(x.student_name || '—') + '</td><td><span class="pill ' + (x.used_by ? 'no' : 'ok') + '">' + (x.used_by ? 'مستخدم' : 'متاح') + '</span></td><td>' + (x.used_by ? '—' : x.expires_at ? fdate(x.expires_at) : 'بدون') + '</td><td>' + (s ? esc(fname(s)) + ' • ' + fdate(x.used_at) : '—') + '</td></tr>'; }).join('') + '</table></div>';
  const upd = () => { const n = document.querySelectorAll('#cl .cdk:checked').length, e = $('#cdn'); if (e) e.textContent = n; };
  const all = $('#cdAll'); if (all) all.onchange = () => { document.querySelectorAll('#cl .cdk').forEach(c => c.checked = all.checked); upd(); };
  $('#cl').onchange = e => { if (e.target.classList.contains('cdk')) upd(); };
  applyActGate($('#cl'));
};
async function delCodes(codes) {
  let n = 0; for (let i = 0; i < codes.length; i += 100) { const { data, error } = await sb.rpc('delete_codes', { p_codes: codes.slice(i, i + 100) }); if (error) throw error; n += data || 0; }
  toast('تم حذف ' + n + ' كود ✅'); drawCodes();
}
Object.assign(ACT, {
  cdDelSel: async () => { const c = Array.from(document.querySelectorAll('#cl .cdk:checked')).map(x => x.value); if (!c.length) return toast('علّم الأكواد اللي عايز تحذفها الأول', true); if (!confirm('حذف ' + c.length + ' كود غير مستخدم نهائياً؟')) return; await delCodes(c); },
  cdDelUnused: async () => { const c = (window.__codesList || []).filter(x => !x.used_by).map(x => x.code); if (!c.length) return; if (!confirm('هيتحذف كل الأكواد غير المستخدمة (' + c.length + ') للكورس ده. الأكواد المستخدمة بتفضل للسجل. تكمل؟')) return; await delCodes(c); }
});
