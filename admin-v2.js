// =====================================================================
// v2: منشئ الامتحان + محتوى الدرس + تقرير الامتحان + إعلانات الصفوف
// =====================================================================

// ---------- منشئ الامتحان (صفحة كاملة، بتحفظ مسودة تلقائياً) ----------
VIEWS.xbuild = ['منشئ الامتحان', vBuilder];
let XB = null, xbT = null, xbUid = 0;
const xuid = () => 'n' + (++xbUid) + Date.now().toString(36);
const LT = 'ABCDEFGH';
const RMODES = [['now', 'تظهر فوراً بعد التسليم'], ['after_grading', 'تظهر بعد ما أصحّح الأسئلة المقالية (لو مفيش مقالي بتظهر فوراً)'], ['after_close', 'تظهر بعد انتهاء وقت الامتحان (حدد وقت الإغلاق)']];
const blankQ = (type, pts) => ({ uid: xuid(), id: '', type, pts: pts == null ? (type === 'mcq' ? 1 : 5) : pts, text: '', opts: type === 'mcq' ? ['', '', '', ''] : [], ok: 0, img: '', note: '' });
function metaFrom(q) {
  return { title: q.title || '', kind: q.kind || 'course', course_id: q.course_id || (S.courses[0] && S.courses[0].id) || '', academic_year: q.academic_year || YEARS[0], lesson_id: q.lesson_id || '',
    pass: q.pass_percent == null ? 50 : q.pass_percent, time: q.time_limit_minutes || '', tries: q.max_attempts || 1, opens: loc(q.opens_at), closes: loc(q.closes_at),
    shuffle: q.shuffle !== false, pub: !!q.is_published, rmode: q.result_mode || 'now', rnote: q.result_note || '', instr: q.instructions || '' };
}
function metaHTML(m) {
  const cs = S.courses.map(c => `<option value="${c.id}"${c.id === m.course_id ? ' selected' : ''}>${esc(c.title)} — ${c.academic_year}</option>`).join('');
  const ls = (S.lessons || []).filter(l => l.course_id === m.course_id).map(l => `<option value="${l.id}"${l.id === m.lesson_id ? ' selected' : ''}>${l.position}. ${esc(l.title)}</option>`).join('');
  return `<label>عنوان الامتحان</label><input name="title" value="${esc(m.title)}" placeholder="مثال: كويز المحاضرة الأولى">
  <div class="row2"><div><label>النوع</label><select name="kind">${[['lesson', '📖 كويز جوه محاضرة'], ['course', '📚 امتحان على مستوى الكورس'], ['comprehensive', '🏆 امتحان شامل للصف كله']].map(k => `<option value="${k[0]}"${k[0] === m.kind ? ' selected' : ''}>${k[1]}</option>`).join('')}</select></div>
  ${m.kind === 'comprehensive' ? `<div><label>الصف</label><select name="academic_year">${yopts(m.academic_year)}</select></div>` : `<div><label>الكورس</label><select name="course_id">${cs}</select></div>`}</div>
  ${m.kind === 'lesson' ? `<label>المحاضرة (الكويز بيظهر جوه المحاضرة دي وبيتجمّع في «نتائجي» تحتها)</label><select name="lesson_id"><option value="">— اختار المحاضرة —</option>${ls}</select>` : ''}
  <div class="row2"><div><label>نسبة النجاح %</label><input type="number" name="pass" min="0" max="100" value="${esc(m.pass)}"></div><div><label>الوقت بالدقائق (فاضي = مفتوح)</label><input type="number" name="time" min="1" value="${esc(m.time)}"></div></div>
  <div class="row2"><div><label>عدد المحاولات</label><input type="number" name="tries" min="1" value="${esc(m.tries)}"></div><div><label>📊 ظهور النتيجة للطالب</label><select name="rmode">${RMODES.map(r => `<option value="${r[0]}"${r[0] === m.rmode ? ' selected' : ''}>${r[1]}</option>`).join('')}</select></div></div>
  <div class="row2"><div><label>⏰ يفتح في (اختياري)</label><input type="datetime-local" name="opens" value="${esc(m.opens)}"></div><div><label>🔒 يقفل ويتسلّم تلقائي في (اختياري)</label><input type="datetime-local" name="closes" value="${esc(m.closes)}"></div></div>
  <label>📌 تعليمات قبل البداية (اختياري، بتظهر للطالب قبل ما يبدأ)</label><textarea name="instr" dir="auto" style="min-height:56px">${esc(m.instr)}</textarea>
  <label>📝 ملاحظة تظهر مع النتيجة (اختياري)</label><textarea name="rnote" dir="auto" style="min-height:56px" placeholder="مثال: راجع المحاضرة التالتة قبل الامتحان الجاي">${esc(m.rnote)}</textarea>
  <label class="chk"><input type="checkbox" name="shuffle"${m.shuffle ? ' checked' : ''}> ترتيب عشوائي للأسئلة والاختيارات لكل طالب</label><label class="chk"><input type="checkbox" name="pub"${m.pub ? ' checked' : ''}> نشر الامتحان للطلاب</label>`;
}
function readMeta() {
  const f = $('#xbMeta'); if (!f) return XB.meta; const m = Object.assign({}, XB.meta);
  ['title', 'kind', 'course_id', 'academic_year', 'lesson_id', 'pass', 'time', 'tries', 'opens', 'closes', 'shuffle', 'pub', 'rmode', 'rnote', 'instr'].forEach(n => { const e = f.querySelector('[name="' + n + '"]'); if (e) m[n] = e.type === 'checkbox' ? e.checked : e.value; });
  return m;
}
function qCardHTML(q, i) {
  const last = i === XB.qs.length - 1;
  let h = `<div class="card xq" data-u="${q.uid}" style="margin-bottom:12px"><div class="bar" style="margin-bottom:8px"><b>سؤال ${i + 1}</b>
    <select data-f="type" style="max-width:150px;flex:none;min-width:0"><option value="mcq"${q.type === 'mcq' ? ' selected' : ''}>اختيار من متعدد</option><option value="essay"${q.type === 'essay' ? ' selected' : ''}>مقالي</option></select>
    <span style="color:var(--muted);font-size:12.5px;font-weight:700">الدرجة</span><input type="number" data-f="pts" min="0" step="0.5" value="${esc(q.pts)}" style="max-width:80px;flex:none;min-width:0">
    <span style="margin-right:auto;display:flex;gap:6px;flex-wrap:wrap"><button type="button" class="btn s g" data-act="xqUp" data-id="${q.uid}"${i === 0 ? ' disabled' : ''}>↑</button><button type="button" class="btn s g" data-act="xqDown" data-id="${q.uid}"${last ? ' disabled' : ''}>↓</button><button type="button" class="btn s g" data-act="xqDup" data-id="${q.uid}">نسخ</button><button type="button" class="btn s r" data-act="xqDel" data-id="${q.uid}">حذف</button></span></div>
    <textarea data-f="text" dir="auto" placeholder="اكتب نص السؤال هنا..." style="min-height:80px">${esc(q.text)}</textarea>
    <div class="bar" style="margin:8px 0 0"><label class="btn s g" style="margin:0;cursor:pointer;color:var(--ink)">🖼️ ${q.img ? 'تغيير الصورة' : 'إضافة صورة'}<input type="file" accept="image/*" data-f="img" hidden></label>${q.img ? `<img src="${esc(q.img)}" alt="" style="height:54px;border-radius:8px;border:1px solid var(--line)"><button type="button" class="btn s r" data-act="xqImgDel" data-id="${q.uid}">إزالة الصورة</button>` : ''}<span data-st="${q.uid}" style="font-size:12.5px;font-weight:700;color:${q.imgErr ? '#f87171' : 'var(--muted)'}">${esc(q.imgErr || q.imgMsg || '')}</span></div>`;
  if (q.type === 'mcq') {
    h += '<div style="margin-top:10px">' + q.opts.map((o, k) => `<div class="bar" style="margin:0 0 6px;flex-wrap:nowrap"><input type="radio" name="ok_${q.uid}" data-f="ok" value="${k}"${q.ok === k ? ' checked' : ''} style="width:auto;min-width:0;flex:none" title="الإجابة الصحيحة"><b style="width:18px;flex:none">${LT[k]}</b><input data-f="opt" data-k="${k}" dir="auto" value="${esc(o)}" placeholder="الاختيار ${LT[k]}">${q.opts.length > 2 ? `<button type="button" class="btn s g" data-act="xoDel" data-id="${q.uid}" data-k="${k}" title="حذف الاختيار">✕</button>` : ''}</div>`).join('')
      + (q.opts.length < 8 ? `<button type="button" class="btn s g" data-act="xoAdd" data-id="${q.uid}">+ اختيار</button>` : '') + '<small class="nt" style="display:block;margin:6px 0 0">🔘 علّم الدايرة اللي جنب الإجابة الصحيحة.</small></div>';
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
    const rq = await sb.from('quiz_questions').select('*,quiz_answers(correct_index)').eq('quiz_id', id).order('position'); if (rq.error) throw rq.error;
    qs = rq.data.map(x => { const ca = [].concat(x.quiz_answers || [])[0]; return { uid: x.id, id: x.id, type: x.qtype, pts: x.points, text: x.question, opts: x.qtype === 'mcq' ? (x.options || []).slice() : [], ok: ca ? ca.correct_index : -1, img: x.image_url || '', note: x.note || '' }; });
  } else q = Object.assign({ kind: 'course', pass_percent: 50, max_attempts: 1, shuffle: true, result_mode: 'now', is_published: false }, pre);
  XB = { id, key: 'xb:' + (id || 'new'), orig: qs.map(x => x.id), meta: metaFrom(q), qs };
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
      else if (f === 'type') { q.type = t.value; if (q.type === 'mcq' && q.opts.length < 2) { q.opts = ['', '', '', '']; q.ok = 0; } drawQs(); persist(); }
      else if (f === 'img' && t.files[0]) xqUpload(q, t.files[0]);
    });
  });
  return `<div class="bar"><button class="btn g" data-go="exams">← الامتحانات</button><b>${id ? 'تعديل: ' + esc(q.title) : 'امتحان جديد'}</b><span id="xbSt" class="pill"></span><button class="btn" data-act="xbSave" style="margin-right:auto">💾 حفظ الكل</button></div>
  ${draft ? `<div class="card" id="xbBanner" style="border-color:#f59e0b;margin-bottom:14px"><b>📝 فيه مسودة محفوظة من ${new Date(draft.t).toLocaleString('ar-EG')}</b><p class="nt" style="margin:6px 0 10px">انت كنت بتكتب وقفلت الصفحة قبل الحفظ. تحب ترجّعها؟</p><div class="bar" style="margin:0"><button class="btn" data-act="xbRestore">استرجاع المسودة</button><button class="btn g" data-act="xbDiscard">تجاهل وحذفها</button></div></div>` : ''}
  <div class="card" style="margin-bottom:14px"><b style="font-size:16px">⚙️ إعدادات الامتحان</b><div id="xbMeta"></div></div>
  <div class="bar" style="position:sticky;top:0;z-index:5;background:var(--bg);padding:8px 0"><b>❓ الأسئلة</b><span id="xbCnt" class="pill"></span><button class="btn s" data-act="xbAdd" data-id="mcq">+ سؤال اختيار</button><button class="btn s g" data-act="xbAdd" data-id="essay">+ سؤال مقالي</button><button class="btn s g" data-act="xbAdd5">+ 5 أسئلة اختيار</button><button class="btn s g" data-act="xbPaste">📋 لصق أسئلة</button></div>
  <div id="xbQs"></div>
  <div class="bar"><button class="btn" data-act="xbSave">💾 حفظ الكل</button><span class="nt" style="margin:0">الحفظ بيحدّث الأسئلة الموجودة من غير ما يمس نتايج الطلاب.</span></div>`;
}
async function xqUpload(q, file) {
  if (!/^image\//.test(file.type)) { q.imgErr = '❌ الملف لازم يكون صورة'; return drawQs(); }
  if (file.size > 8 * 1024 * 1024) { q.imgErr = '❌ حجم الصورة أكبر من 8MB'; return drawQs(); }
  q.imgErr = ''; q.imgMsg = '⏳ جاري الرفع...'; const st = document.querySelector('[data-st="' + q.uid + '"]'); if (st) { st.style.color = 'var(--muted)'; st.textContent = q.imgMsg; }
  try {
    const ext = ((file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')) || 'jpg', path = 'questions/' + (crypto.randomUUID ? crypto.randomUUID() : Date.now() + '' + Math.random().toString(16).slice(2)) + '.' + ext;
    const up = await sb.storage.from('course-media').upload(path, file, { contentType: file.type, upsert: false }); if (up.error) throw up.error;
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
    const qt = [], opts = []; let ok = -1, ansTxt = null;
    b.split('\n').map(s => s.trim()).filter(Boolean).forEach(ln => {
      const am = ln.match(ansRe); if (am) { ansTxt = am[1].trim(); return; }
      const om = ln.match(optRe);
      if (om && qt.length) { let t = om[2].trim(), star = false; if (/\*\s*$/.test(t)) { star = true; t = t.replace(/\*\s*$/, '').trim(); } if (/^[✓✔]/.test(t)) { star = true; t = t.replace(/^[✓✔]\s*/, ''); } opts.push(t); if (star) ok = opts.length - 1; }
      else if (opts.length) opts[opts.length - 1] += ' ' + ln; else qt.push(ln);
    });
    if (!qt.length) return;
    qt[0] = qt[0].replace(/^\d+\s*[\.\)\-]\s*/, '');
    const q = blankQ(opts.length >= 2 ? 'mcq' : 'essay'); q.text = qt.join('\n');
    if (q.type === 'mcq') {
      q.opts = opts; while (q.opts.length < 4) q.opts.push('');
      if (ansTxt) { const a = ansTxt.replace(/[\)\.]/g, '').trim().toLowerCase(); if (LM[a] != null && a.length <= 2) ok = LM[a]; else if (/^[1-8]$/.test(a)) ok = +a - 1; else { const k = opts.findIndex(o => o.toLowerCase() === ansTxt.toLowerCase()); if (k >= 0) ok = k; } }
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
    let options = null, correct = null;
    if (q.type === 'mcq') {
      const filled = q.opts.map((o, k) => ({ t: o.trim(), k })).filter(x => x.t);
      if (filled.length < 2) throw new Error('سؤال ' + (i + 1) + ': اكتب اختيارين على الأقل');
      const idx = filled.findIndex(x => x.k === q.ok); if (idx < 0) throw new Error('سؤال ' + (i + 1) + ': علّم الإجابة الصحيحة على اختيار مكتوب');
      options = filled.map(x => x.t); correct = idx;
    }
    jobs.push({ q, text, options, correct });
  });
  if (!jobs.length) throw new Error('أضف سؤال واحد على الأقل');
  if (m.rmode === 'after_close' && !closes && !confirm('مفيش وقت إغلاق محدد، فالنتيجة هتظهر للطالب بعد ما يخلّص كل محاولاته. تكمل؟')) return;
  const keep = new Set(jobs.filter(j => j.q.id).map(j => j.q.id)), del = XB.orig.filter(x => !keep.has(x));
  if (del.length && !confirm('هيتم حذف ' + del.length + ' سؤال من الامتحان نهائياً (وإجابات الطلاب عليهم). تكمل؟')) return;
  const row = { title: m.title.trim(), kind, pass_percent: +m.pass || 0, time_limit_minutes: +m.time || null, max_attempts: +m.tries || 1, opens_at: opens, closes_at: closes, shuffle: !!m.shuffle, is_published: !!m.pub, result_mode: m.rmode, result_note: m.rnote.trim() || null, instructions: m.instr.trim() || null };
  if (kind === 'comprehensive') { row.academic_year = m.academic_year; row.course_id = null; row.lesson_id = null; } else { row.course_id = m.course_id; row.academic_year = null; row.lesson_id = kind === 'lesson' ? m.lesson_id : null; }
  let qid = XB.id;
  if (qid) { const { error } = await sb.from('quizzes').update(row).eq('id', qid); if (error) throw error; }
  else { const { data, error } = await sb.from('quizzes').insert(row).select('id').single(); if (error) throw error; qid = data.id; XB.id = qid; XB.orig = []; }
  if (del.length) { const { error } = await sb.from('quiz_questions').delete().in('id', del); if (error) throw error; }
  const rows = jobs.map((j, i) => ({ quiz_id: qid, position: i + 1, question: j.text, options: j.options, qtype: j.q.type, points: isNaN(+j.q.pts) || j.q.pts === '' ? 1 : +j.q.pts, image_url: j.q.img || null, note: (j.q.note || '').trim() || null }));
  const upd = jobs.map((j, i) => ({ j, r: rows[i] })).filter(x => x.j.q.id), ins = jobs.map((j, i) => ({ j, r: rows[i] })).filter(x => !x.j.q.id);
  for (const c of chunk(upd, 8)) { const rs = await Promise.all(c.map(x => sb.from('quiz_questions').update(x.r).eq('id', x.j.q.id))); const bad = rs.find(r => r.error); if (bad) throw bad.error; }
  const ids = {}; upd.forEach(x => ids[x.j.q.uid] = x.j.q.id);
  if (ins.length) { const { data, error } = await sb.from('quiz_questions').insert(ins.map(x => x.r)).select('id,position'); if (error) throw error; const byPos = {}; data.forEach(d => byPos[d.position] = d.id); ins.forEach(x => ids[x.j.q.uid] = byPos[x.r.position]); }
  const ans = jobs.filter(j => j.q.type === 'mcq').map(j => ({ question_id: ids[j.q.uid], correct_index: j.correct }));
  if (ans.length) { const { error } = await sb.from('quiz_answers').upsert(ans); if (error) throw error; }
  const es = jobs.filter(j => j.q.type === 'essay' && j.q.id).map(j => j.q.id); if (es.length) await sb.from('quiz_answers').delete().in('question_id', es);
  try { localStorage.removeItem(XB.key); } catch (e) {}
  toast('تم حفظ الامتحان بـ ' + jobs.length + ' سؤال ✅'); XB = null; go('exams');
}

// ---------- محتوى الدرس: فيديوهات / PDF / كويزات / روابط ----------
const ISEC = { video: ['🎬', 'الفيديوهات', 'فيديو الشرح، فيديو الحل... (YouTube / Drive / Vimeo)'], pdf: ['📄', 'ملفات PDF', 'رابط Google Drive (بيتفتح جوه المنصة)'], link: ['🔗', 'روابط خارجية', 'أي رابط https'] };
async function itemsModal(lid) {
  const l = (window.__L || []).find(x => x.id === lid) || {};
  const [it, qz] = await Promise.all([sb.from('lesson_items').select('*').eq('lesson_id', lid).order('position'), sb.from('quizzes').select('id,title,is_published,time_limit_minutes,quiz_questions(count)').eq('lesson_id', lid)]);
  if (it.error) throw it.error; const items = it.data || [], quizzes = qz.error ? [] : (qz.data || []);
  const sec = k => {
    const L = items.filter(x => x.kind === k), s = ISEC[k];
    return `<div class="card" style="margin-bottom:12px"><b>${s[0]} ${s[1]} (${L.length})</b><p class="nt" style="margin:4px 0 8px">${s[2]}</p>`
      + (L.length ? '<div class="tw" style="margin-bottom:10px"><table>' + L.map((x, i) => `<tr><td style="width:1%;white-space:nowrap"><button class="btn s g" data-act="itMove" data-id="${x.id}" data-d="-1" data-l="${lid}"${i === 0 ? ' disabled' : ''}>↑</button> <button class="btn s g" data-act="itMove" data-id="${x.id}" data-d="1" data-l="${lid}"${i === L.length - 1 ? ' disabled' : ''}>↓</button></td><td>${esc(x.title)}<br><small dir="ltr" style="color:var(--muted)">${esc((x.url || '').slice(0, 60))}</small>${k === 'pdf' ? `<label class="chk" style="margin-top:6px;font-size:12.5px"><input type="checkbox" data-act="itAllow" data-id="${x.id}" data-l="${lid}"${x.allow_open ? ' checked' : ''}> مسموح يفتحه الطالب خارج المنصة</label>` : ''}</td><td style="white-space:nowrap"><button class="btn s g" data-act="itEdit" data-id="${x.id}" data-l="${lid}">تعديل</button> <button class="btn s r" data-act="delItem" data-id="${x.id}" data-l="${lid}">حذف</button></td></tr>`).join('') + '</table></div>' : '')
      + `<div class="row2"><input id="ni_${k}_t" placeholder="الاسم (يظهر للطالب)"><input id="ni_${k}_u" dir="ltr" placeholder="https://..."></div>${k === 'pdf' ? '<label class="chk" style="margin-top:8px"><input type="checkbox" id="ni_pdf_a"> السماح بفتحه خارج المنصة</label>' : ''}<button class="btn s" style="margin-top:8px" data-act="itAdd" data-k="${k}" data-l="${lid}">+ إضافة</button></div>`;
  };
  const qs = `<div class="card" style="margin-bottom:12px"><b>📝 الكويزات والامتحانات (${quizzes.length})</b><p class="nt" style="margin:4px 0 8px">بتظهر للطالب جوه المحاضرة نفسها وهو بيتنقل بينها بحرية.</p>`
    + (quizzes.length ? '<div class="tw" style="margin-bottom:10px"><table>' + quizzes.map(q => `<tr><td>${esc(q.title)}<br><small style="color:var(--muted)">${(((q.quiz_questions || [])[0]) || {}).count || 0} سؤال${q.time_limit_minutes ? ' • ' + q.time_limit_minutes + ' دقيقة' : ''}</small></td><td><span class="pill ${q.is_published ? 'ok' : 'no'}">${q.is_published ? 'منشور' : 'مخفي'}</span></td><td style="white-space:nowrap"><button class="btn s" data-act="editExam" data-id="${q.id}">✏️ المحرر</button> <button class="btn s g" data-act="results" data-id="${q.id}">📊 التقرير</button></td></tr>`).join('') + '</table></div>' : '')
    + `<button class="btn s" data-act="itNewQuiz" data-id="${lid}">+ كويز جديد للمحاضرة دي</button></div>`;
  modal('محتوى المحاضرة: ' + (l.title || ''), sec('video') + sec('pdf') + qs + sec('link'));
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
  const tookRows = took.map(x => { const a = x.o.b, p = pcent(a), pd = a.status === 'pending'; return '<tr><td>' + esc(fname(x.s)) + '<br><small style="color:var(--muted)" dir="ltr">' + esc(x.s.phone_number) + '</small></td><td><b>' + a.score + '/' + a.total + '</b></td><td><b>' + p + '%</b></td><td><span class="pill ' + (pd ? 'no' : p >= ps ? 'ok' : 'no') + '">' + (pd ? 'تصحيح معلّق' : p >= ps ? 'ناجح' : 'راسب') + '</span></td><td>' + x.o.n + '</td><td style="color:' + (a.violations ? '#f87171' : 'inherit') + '">' + (a.violations || 0) + '</td><td>' + (a.seconds_spent != null ? Math.floor(a.seconds_spent / 60) + ':' + String(a.seconds_spent % 60).padStart(2, '0') : '—') + '</td><td>' + fdate(a.created_at) + '</td><td><button class="btn s" data-act="attempt" data-id="' + a.id + '">تفاصيل</button></td></tr>'; }).join('');
  const notRows = not.map(s => '<tr><td>' + esc(fname(s)) + '</td><td dir="ltr">' + esc(s.phone_number) + '</td><td dir="ltr">' + esc(s.parent_phone || '—') + '</td><td>' + esc(s.academic_year) + '</td></tr>').join('');
  const misRows = mis.map(x => { const tot = x.ok + x.w + x.u, pr = Math.round((x.w + x.u) / tot * 100); return '<tr><td>' + x.q.position + '</td><td dir="auto">' + esc(x.q.question.slice(0, 140)) + '</td><td><b>' + x.w + '</b></td><td>' + x.u + '</td><td><span class="pill ' + (pr >= 50 ? 'no' : '') + '">' + pr + '%</span></td></tr>'; }).join('');
  const tab = (k, l, on) => '<button class="yt' + (on ? ' on' : '') + '" data-act="rsub" data-id="' + k + '">' + l + '</button>';
  return '<div class="bar"><button class="btn g" data-go="exams">← الامتحانات</button><b>' + esc(qz.title) + '</b><span class="pill">' + esc(year || '') + '</span><button class="btn s" data-act="editExam" data-id="' + id + '">✏️ المحرر</button><button class="btn s g" data-act="rexport" style="margin-right:auto">⬇️ تصدير Excel/CSV</button></div>'
    + '<div class="grid" style="margin-bottom:16px">' + [[exp.length, 'المفروض يمتحنوا'], [took.length, 'امتحنوا'], [not.length, 'لم يمتحنوا'], [avg + '%', 'متوسط الدرجات'], [pass + '%', 'نسبة النجاح'], [pend, 'تصحيح معلّق']].map(x => '<div class="card stat"><b>' + x[0] + '</b><span>' + x[1] + '</span></div>').join('') + '</div>'
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
  const sel = 'question_id,chosen_index,is_correct,essay_text,essay_score,';
  let r = await sb.from('quiz_attempt_answers').select(sel + 'feedback,quiz_questions(question,options,qtype,points,position,note)').eq('attempt_id', aid);
  if (r.error) r = await sb.from('quiz_attempt_answers').select(sel + 'quiz_questions(question,options,qtype,points,position)').eq('attempt_id', aid);
  if (r.error) throw r.error; const data = r.data;
  const { data: ca } = await sb.from('quiz_answers').select('question_id,correct_index').in('question_id', data.map(x => x.question_id));
  const cm = {}; (ca || []).forEach(x => cm[x.question_id] = x.correct_index);
  data.sort((a, b) => (a.quiz_questions.position || 0) - (b.quiz_questions.position || 0));
  const fb = (x, i) => '<div class="bar" style="margin:8px 0 0"><input id="fb' + i + '" dir="auto" placeholder="💬 تعليقك للطالب على إجابته (يظهر له بعد التسليم)" value="' + esc(x.feedback || '') + '"><button class="btn s g" data-act="saveFb" data-id="' + aid + '" data-q="' + x.question_id + '" data-i="' + i + '">حفظ التعليق</button></div>';
  modal('تفاصيل المحاولة', data.map((x, i) => { const q = x.quiz_questions;
    if (q.qtype === 'mcq') return '<div class="card" style="margin-bottom:8px"><b dir="auto">' + (i + 1) + '. ' + esc(q.question) + '</b>' + (q.options || []).map((o, k) => '<div dir="auto" style="padding:6px 10px;margin-top:4px;border-radius:8px;border:1px solid var(--line);' + (k === cm[x.question_id] ? 'background:rgba(34,197,94,.18);' : k === x.chosen_index ? 'background:rgba(220,38,38,.22);' : '') + '">' + esc(o) + (k === x.chosen_index ? ' ← إجابة الطالب' : '') + '</div>').join('') + (q.note ? '<p class="nt" style="margin:8px 0 0">💡 ملاحظة السؤال: ' + esc(q.note) + '</p>' : '') + fb(x, i) + '</div>';
    return '<div class="card" style="margin-bottom:8px"><b dir="auto">' + (i + 1) + '. ' + esc(q.question) + '</b><div dir="auto" style="white-space:pre-wrap;margin:8px 0;background:var(--bg);padding:10px;border-radius:10px">' + esc(x.essay_text || '(لا توجد إجابة)') + '</div><div class="bar" style="margin:0"><input type="number" id="es' + i + '" min="0" max="' + q.points + '" value="' + (x.essay_score == null ? '' : x.essay_score) + '" placeholder="من ' + q.points + '" style="max-width:110px"><button class="btn s" data-act="gradeEssay" data-id="' + aid + '" data-q="' + x.question_id + '" data-i="' + i + '">حفظ الدرجة</button></div>' + fb(x, i) + '</div>'; }).join('') || '<div class="empty">لا توجد تفاصيل</div>');
}

// ---------- العمليات الجديدة ----------
Object.assign(ACT, {
  newExam: () => go('xbuild', ''), editExam: id => go('xbuild', id),
  newCourseExam: id => go('xbuild', { pre: { kind: 'course', course_id: id } }),
  itNewQuiz: id => { const l = (window.__L || []).find(x => x.id === id) || {}; closeModal(); go('xbuild', { pre: { kind: 'lesson', course_id: l.course_id || window.__cid, lesson_id: id } }); },
  xbSave: async () => { const bs = Array.from(document.querySelectorAll('[data-act="xbSave"]')); bs.forEach(b => b.disabled = true); try { await xbSave(); } finally { bs.forEach(b => b.disabled = false); } },
  xbAdd: id => { XB.qs.push(blankQ(id)); drawQs(); persist(); const c = document.querySelectorAll('.xq'); const l = c[c.length - 1]; if (l) { l.scrollIntoView({ block: 'center' }); const t = l.querySelector('textarea'); if (t) t.focus(); } },
  xbAdd5: () => { for (let i = 0; i < 5; i++) XB.qs.push(blankQ('mcq')); drawQs(); persist(); },
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
  xoDel: (id, el) => { const q = xq(id), k = +el.dataset.k; if (q.opts.length <= 2) return; q.opts.splice(k, 1); if (q.ok === k) q.ok = -1; else if (q.ok > k) q.ok--; drawQs(); persist(); },
  itAdd: async (id, el) => {
    const k = el.dataset.k, lid = el.dataset.l, t = $('#ni_' + k + '_t').value.trim(), u = normUrl($('#ni_' + k + '_u').value);
    if (!t) throw new Error('اكتب اسم العنصر'); if (!u) throw new Error('الرابط لازم يبدأ بـ https://');
    const { data: last } = await sb.from('lesson_items').select('position').eq('lesson_id', lid).order('position', { ascending: false }).limit(1);
    const row = { lesson_id: lid, kind: k, title: t, url: u, position: last && last[0] ? last[0].position + 1 : 1 }; if (k === 'pdf') row.allow_open = !!$('#ni_pdf_a').checked;
    const { error } = await sb.from('lesson_items').insert(row); if (error) throw new Error((error.message || '').includes('allow_open') ? 'شغّل ملف SQL الجديد في Supabase الأول' : error.message);
    toast('تمت الإضافة ✅'); itRefresh(lid);
  },
  itEdit: async (id, el) => {
    const { data } = await sb.from('lesson_items').select('title,url').eq('id', id).single(); if (!data) return;
    const t = prompt('الاسم:', data.title); if (t == null) return; const u = prompt('الرابط:', data.url); if (u == null) return; const nu = normUrl(u); if (!t.trim() || !nu) throw new Error('الاسم والرابط (https) مطلوبين');
    const { error } = await sb.from('lesson_items').update({ title: t.trim(), url: nu }).eq('id', id); if (error) throw error; toast('تم التعديل ✅'); itRefresh(el.dataset.l);
  },
  itAllow: async (id, el) => { const { error } = await sb.from('lesson_items').update({ allow_open: el.checked }).eq('id', id); if (error) { el.checked = !el.checked; throw new Error((error.message || '').includes('allow_open') ? 'شغّل ملف SQL الجديد في Supabase الأول' : error.message); } toast(el.checked ? 'الطالب يقدر يفتحه خارج المنصة ✅' : 'اتقفل فتحه خارج المنصة 🔒'); },
  itMove: async (id, el) => {
    const lid = el.dataset.l, d = +el.dataset.d, { data } = await sb.from('lesson_items').select('id,kind,position').eq('lesson_id', lid).order('position'); const me = data.find(x => x.id === id), same = data.filter(x => x.kind === me.kind), i = same.findIndex(x => x.id === id), o = same[i + d]; if (!o) return;
    const a = await sb.from('lesson_items').update({ position: o.position }).eq('id', me.id), b = await sb.from('lesson_items').update({ position: me.position }).eq('id', o.id); if (a.error || b.error) throw a.error || b.error; itRefresh(lid);
  },
  delItem: async (id, el) => { if (!confirm('حذف العنصر؟')) return; const { error } = await sb.from('lesson_items').delete().eq('id', id); if (error) throw error; itRefresh(el.dataset.l); },
  rsub: (id, el) => { ['took', 'not', 'mis'].forEach(k => { const d = $('#rp_' + k); if (d) d.hidden = k !== id; }); document.querySelectorAll('#rpTabs .yt').forEach(b => b.classList.toggle('on', b === el)); },
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
