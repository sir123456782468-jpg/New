// =====================================================================
// v5: الدعم (فني + علمي) • تصميم الأسئلة • الاستهلاك والصيانة • النشاط المباشر • نظرة عامة • بحث شامل (Ctrl+K)
// =====================================================================
(function () {
'use strict';
const V5 = window.V5 = window.V5 || {};
const fmtB = n => { n = +n || 0; return n >= 1073741824 ? (n / 1073741824).toFixed(2) + ' GB' : n >= 1048576 ? (n / 1048576).toFixed(1) + ' MB' : n >= 1024 ? Math.round(n / 1024) + ' KB' : n + ' B'; };
const nf = n => (+n || 0).toLocaleString('en-US');
const tf = d => { try { return new Date(d).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' }); } catch (e) { return ''; } };
const errMsg = e => { const m = (e && e.message) || String(e); return /schema cache|does not exist|could not find/i.test(m) ? 'شغّل ملف SQL الجديد (db_26 … db_29) في Supabase الأول' : /forbidden/.test(m) ? 'مفيش عندك صلاحية للعملية دي (للمالك فقط)' : m; };
const css = document.createElement('style');
css.textContent = `
.v5k{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin-bottom:16px}
.v5k .kk{position:relative;cursor:default;padding:16px;border-radius:18px;background:var(--card);border:1px solid var(--line)}
.v5k .kk[data-go]{cursor:pointer}.v5k .kk[data-go]:hover{border-color:var(--brand);transform:translateY(-2px)}
.v5k .kk b{display:block;font-size:28px;line-height:1.2}.v5k .kk span{color:var(--muted);font-size:12.5px;font-weight:700}.v5k .kk i{position:absolute;top:12px;left:14px;font-style:normal;font-size:20px;opacity:.85}
.v5k .kk.hot{border-color:#dc2626;box-shadow:0 0 0 3px rgba(220,38,38,.15)}.v5k .kk.hot b{color:#f87171}
.v5g{height:12px;border-radius:12px;background:var(--bg);border:1px solid var(--line);overflow:hidden;margin:8px 0 4px}.v5g i{display:block;height:100%;border-radius:12px;background:linear-gradient(90deg,#22c55e,#84cc16);transition:width .6s}
.v5g.w i{background:linear-gradient(90deg,#f59e0b,#fbbf24)}.v5g.d i{background:linear-gradient(90deg,#dc2626,#f87171)}
.v5s{display:flex;justify-content:space-between;gap:8px;color:var(--muted);font-size:12.5px;font-weight:700;flex-wrap:wrap}
.v5row{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px dashed var(--line);flex-wrap:wrap}.v5row:last-child{border-bottom:0}
.v5row .nm{flex:1;min-width:140px;font-weight:700;overflow-wrap:anywhere}.v5row small{color:var(--muted);font-weight:600}
.v5grid2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px}@media(max-width:900px){.v5grid2{grid-template-columns:minmax(0,1fr)}}
.v5h{margin:20px 0 10px;font-size:17px;font-weight:900}
.v5tg{display:flex;align-items:center;gap:8px;padding:8px 12px;border:1px solid var(--line);border-radius:12px;background:var(--bg);cursor:pointer;font-weight:700;font-size:13.5px;margin:0}
.v5tg input{width:auto;accent-color:var(--brand)}
.v5col{display:flex;align-items:center;gap:8px}.v5col input[type=color]{width:46px;height:38px;padding:2px;border-radius:10px;flex:none}
.v5pal{display:flex;gap:8px;flex-wrap:wrap;margin:6px 0}.v5pal button{border:2px solid var(--line);border-radius:12px;padding:0;width:74px;height:34px;cursor:pointer;overflow:hidden;display:flex}.v5pal button i{flex:1}
.v5pv{position:sticky;top:10px;display:flex;flex-direction:column;gap:14px;--card:#fff;--ink:#0f172a;--muted:#64748b;--line:#e6eaf2;--soft:#f1f4f9;color:var(--ink)}
.v5pv .xf{font-family:Cairo,sans-serif}
.v5cmd{position:fixed;inset:0;z-index:300;background:rgba(2,6,23,.7);backdrop-filter:blur(4px);display:flex;align-items:flex-start;justify-content:center;padding:10vh 14px 14px}
.v5cmd>div{width:100%;max-width:620px;background:var(--card);border:1px solid var(--line);border-radius:20px;box-shadow:0 30px 80px -20px rgba(0,0,0,.7);overflow:hidden}
.v5cmd input{border:0;border-bottom:1px solid var(--line);border-radius:0;padding:18px 20px;font-size:17px;background:transparent}
.v5cmd ul{list-style:none;max-height:52vh;overflow:auto;padding:6px}
.v5cmd li{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:12px;cursor:pointer;font-weight:700;font-size:14px}
.v5cmd li small{color:var(--muted);font-weight:600;margin-right:auto}.v5cmd li.on{background:var(--grad);color:#fff}.v5cmd li.on small{color:#ffe4e6}
.v5cmd .hn{padding:8px 16px;color:var(--muted);font-size:12px;font-weight:700;border-top:1px solid var(--line)}
.v5cmd .sec{padding:8px 14px 2px;color:var(--muted);font-size:11.5px;font-weight:800;pointer-events:none}
.nbd5{margin-right:auto;min-width:20px;height:20px;padding:0 6px;border-radius:50px;background:#dc2626;color:#fff;font-size:11px;line-height:20px;text-align:center;font-weight:800;box-shadow:0 0 0 2px var(--card);animation:nbp 1.6s infinite}
#cmdBtn{border:1px solid var(--line);background:var(--card);color:var(--muted);border-radius:50px;padding:5px 14px;cursor:pointer;font:700 12.5px Cairo,sans-serif}
.sprow,#spBox,.sprow *{min-width:0}.sprow{overflow:hidden;overflow-wrap:anywhere}.sprow .lastm{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--muted)}
#spBox{overflow:hidden}.spm,.spinfo b,.spinfo small{overflow-wrap:anywhere;word-break:break-word}
.spk{display:inline-block;padding:1px 9px;border-radius:50px;font-size:11px;font-weight:800;margin-inline-start:4px}.spk.t{background:rgba(14,165,233,.2);color:#38bdf8}.spk.a{background:rgba(139,92,246,.25);color:#c4b5fd}.spk.s{background:rgba(34,197,94,.2);color:#4ade80}
.spctx{margin:0 0 10px;padding:10px 12px;border-radius:12px;background:rgba(139,92,246,.12);border:1px solid rgba(139,92,246,.4);font-weight:700;font-size:13.5px;line-height:1.9;overflow-wrap:anywhere}
.spcan{display:flex;gap:8px;margin-top:10px;align-items:center;flex-wrap:wrap}.spcan select{flex:1;min-width:160px}
.spl{max-height:70vh;overflow:auto;padding-left:4px}
.spgrid{display:grid;grid-template-columns:minmax(240px,340px) minmax(0,1fr);gap:14px;align-items:start}@media(max-width:860px){.spgrid{grid-template-columns:minmax(0,1fr)}}
`;
document.head.appendChild(css);

// ---------------------------------------------------------------- الدعم (فني + علمي)
const SP = { kind: 'all', status: 'open', id: null, timer: null, q: '', img: null, can: null, list: [], seen: null };
const KB = { tech: ['🔧', 'فني', 't'], academic: ['📘', 'علمي', 'a'] };
async function loadCan() { if (SP.can) return SP.can; const r = await sb.from('support_canned').select('*').order('position').order('created_at'); SP.can = r.error ? [] : (r.data || []); return SP.can; }
const listHTML = d => (d || []).map(t => {
  const k = KB[t.kind] || KB.tech, cx = t.context || {};
  return '<div class="card sprow' + (t.unread ? ' unr' : '') + (SP.id === t.id ? ' sel' : '') + '" data-act="s5Open" data-id="' + t.id + '" style="margin-bottom:8px;cursor:pointer;' + (t.unread ? 'border-color:#dc2626;' : SP.id === t.id ? 'border-color:var(--brand);' : '') + '">' + (t.unread ? '<span class="rdot" title="محتاج رد"></span>' : '')
    + '<b>' + esc(t.name || 'طالب') + '</b><span class="spk ' + k[2] + '">' + k[0] + ' ' + k[1] + '</span>' + (t.solved ? '<span class="spk s">✅ تم الحل</span>' : '')
    + (t.verified === false ? ' <span class="pill no" title="كتب رقمه من غير تسجيل دخول">⚠️ غير موثّق</span>' : '') + (t.phone_ok === false ? ' <span class="pill no" title="الطالب قال إن رقمه المسجّل غلط">📵 الرقم غلط</span>' : '')
    + (t.unread ? ' <span class="pill no">' + t.unread + ' جديد</span>' : '') + (t.status === 'closed' ? ' <span class="pill">منتهية</span>' : '')
    + '<br><small dir="ltr" style="color:var(--muted)">' + esc(t.phone) + ' • ' + tf(t.last_at) + '</small>'
    + (cx.course || cx.topic ? '<small style="display:block;color:#c4b5fd;font-weight:700">📚 ' + esc([cx.course, cx.topic].filter(Boolean).join(' • ')) + '</small>' : '')
    + '<small class="lastm" dir="auto">' + esc((t.last || '').slice(0, 90)) + '</small></div>';
}).join('') || '<div class="empty">لا توجد محادثات</div>';
const filt = d => { const q = SP.q.trim().toLowerCase(); return !q ? d : d.filter(t => [t.name, t.phone, t.last, t.context && t.context.course, t.context && t.context.topic].join(' ').toLowerCase().includes(q)); };
async function fetchList() { const { data, error } = await sb.rpc('support_admin_list', { p_status: SP.status, p_kind: SP.kind === 'all' ? null : SP.kind }); if (error) throw error; SP.list = data || []; return SP.list; }
async function refreshList() { try { await fetchList(); const el = document.querySelector('#spList'); if (el) el.innerHTML = listHTML(filt(SP.list)); paintCounts(); } catch (e) {} }
async function vSup(force) {
  clearInterval(SP.timer); SP.id = null; SP.img = null; SP.kind = force === 'academic' ? 'academic' : 'tech'; SP.keep = false;
  const [, cnt] = await Promise.all([fetchList().catch(e => { throw new Error(errMsg(e)); }), sb.rpc('support_admin_counts').then(r => r.data || {}, () => ({}))]);
  SP.timer = setInterval(() => { if (!/^support/.test(window.__cur || '')) return clearInterval(SP.timer); if (SP.id) thread(SP.id, true); else refreshList(); }, 6000);
  const sb2 = (k, l) => '<button class="yt' + (SP.status === k ? ' on' : '') + '" data-act="s5Status" data-id="' + k + '">' + l + '</button>';
  return '<div class="bar"><b style="font-size:16px">' + (SP.kind === 'academic' ? '📘 الدعم العلمي — أسئلة الطلاب في المادة' : '🔧 الدعم الفني — مشاكل الطلاب في المنصة') + '</b><span style="width:12px"></span>' + sb2('open', 'مفتوحة') + sb2('closed', 'منتهية') + sb2('all', 'الكل')
    + '<input id="spQ" placeholder="🔎 بحث بالاسم / الرقم / الرسالة" value="' + esc(SP.q) + '" style="max-width:260px"><button class="btn s g" data-act="s5Canned">🗂 الردود الجاهزة</button></div>'
    + (SP.kind === 'academic' && cnt.unsolved_academic != null ? '<p class="nt">📘 أسئلة علمية مفتوحة لسه ما اتحلتش: <b>' + (+cnt.unsolved_academic || 0) + '</b></p>' : '')
    + '<div class="spgrid"><div id="spList" class="spl">' + listHTML(filt(SP.list)) + '</div><div id="spBox" class="card" style="min-height:360px"><div class="empty">اختار محادثة من القايمة</div></div></div>';
}
const infoHTML = d => '<div class="spinfo"><div><small>👤 الاسم (كتبه الطالب)</small><b>' + esc(d.name || '—') + '</b>' + (d.profile_name && d.profile_name !== d.name ? '<small>الاسم المسجّل: ' + esc(d.profile_name) + '</small>' : '') + '</div>'
  + '<div><small>📱 رقم الطالب المسجّل</small><b dir="ltr">' + esc(d.phone || '—') + '</b>' + (d.phone_ok === true ? '<small style="color:#16a34a">✅ الطالب أكّد إنه صحيح</small>' : d.phone_ok === false ? '<small style="color:#dc2626">⚠️ قال إنه غلط — الصحيح: <span dir="ltr">' + esc(d.alt_phone || '—') + '</span></small>' : '') + '</div>'
  + (d.student ? '<div><small>🎓 الصف</small><b>' + esc(d.student.academic_year || '—') + '</b></div><div><small>👨‍👩‍👦 رقم ولي الأمر</small><b dir="ltr">' + esc(d.student.parent_phone || '—') + '</b></div>' : '') + '</div>';
const msgHTML = m => '<div class="spm ' + (m.sender === 'staff' ? 'me' : 'th') + '">' + (m.image_url ? '<img class="zi" src="' + esc(m.image_url) + '" alt="صورة" loading="lazy">' : '') + (m.body ? '<div dir="auto">' + esc(m.body) + '</div>' : '')
  + '<small>' + tf(m.created_at) + (m.sender === 'staff' ? (SP.seen && new Date(m.created_at) <= new Date(SP.seen) ? ' • <span style="color:#16a34a">👁 شافها الطالب</span>' : ' • ✓ اتبعتت') : '') + '</small></div>';
async function thread(id, quiet) {
  SP.id = id; const { data, error } = await sb.rpc('support_admin_thread', { p_thread: id }); if (error) throw error;
  SP.seen = data.student_seen_at || null;
  const box = document.querySelector('#spBox'); if (!box) return;
  const feed = box.querySelector('#spFeed'), near = feed ? feed.scrollHeight - feed.scrollTop - feed.clientHeight < 80 : true;
  if (quiet && feed && feed.dataset.s === data.status + data.solved) {
    // التحديث الهادي (كل 6 ثواني) ما بيلمسش خانة الكتابة أبداً — ده اللي كان بيعلّق الكيبورد ويقفله
    if (feed.dataset.n === String(data.messages.length) && feed.dataset.v === String(data.student_seen_at || '')) return;
    feed.innerHTML = data.messages.map(msgHTML).join(''); feed.dataset.n = String(data.messages.length); feed.dataset.v = String(data.student_seen_at || '');
    if (near) feed.scrollTop = feed.scrollHeight; if (window.__pollAlerts) setTimeout(window.__pollAlerts, 400); return;
  }
  const ae = document.activeElement, hadFocus = !!(ae && ae.id === 'spTxt' && box.contains(ae)), selS = hadFocus ? ae.selectionStart : 0, selE = hadFocus ? ae.selectionEnd : 0;
  const draft = box.querySelector('#spTxt') ? box.querySelector('#spTxt').value : '', cans = (await loadCan()).filter(c => c.kind === 'all' || c.kind === data.kind), k = KB[data.kind] || KB.tech, cx = data.context || {};
  box.innerHTML = '<div class="bar" style="margin-bottom:8px"><b>' + esc(data.name || 'طالب') + '</b><span class="spk ' + k[2] + '">' + k[0] + ' ' + k[1] + '</span><span dir="ltr" style="color:var(--muted)">' + esc(data.phone) + '</span>'
    + (data.verified === false ? '<span class="pill no" title="الطالب كتب الرقم من غير تسجيل دخول، اتأكد من هويته قبل ما تشاركه أي بيانات">⚠️ غير موثّق</span>' : '')
    + '<span class="pill ' + (data.status === 'open' ? 'ok' : 'no') + '">' + (data.status === 'open' ? 'مفتوحة' : 'منتهية') + '</span>'
    + '<span style="margin-right:auto;display:flex;gap:6px;flex-wrap:wrap">' + (data.kind === 'academic' ? '<button class="btn s ' + (data.solved ? 'g' : '') + '" data-act="s5Solve" data-id="' + id + '" data-v="' + (data.solved ? 0 : 1) + '">' + (data.solved ? '↩️ لسه محتاج متابعة' : '✅ تم الحل') + '</button>' : '')
    + (data.student_id ? '<button class="btn s" data-act="stEdit" data-id="' + data.student_id + '" data-t="' + id + '" title="تعديل الاسم/الإيميل/الرقم… بطلب الطالب">✏️ تعديل بيانات الطالب</button><button class="btn s g" data-act="stTrack" data-id="' + data.student_id + '">🌍 تتبّع الدخول</button>' : '') + '<button class="btn s ' + (data.status === 'open' ? 'r' : 'g') + '" data-act="s5Close" data-id="' + id + '" data-c="' + (data.status === 'open' ? 1 : 0) + '">' + (data.status === 'open' ? '⛔ إنهاء' : '↩️ إعادة فتحها') + '</button><button class="btn s r" data-act="s5Del" data-id="' + id + '" title="مسح المحادثة نهائياً">🗑</button></span></div>'
    + (data.kind === 'academic' && (cx.course || cx.topic || cx.lesson) ? '<div class="spctx">📘 سؤال علمي' + (cx.course ? '<br>📚 الكورس: ' + esc(cx.course) : '') + (cx.lesson ? '<br>🎬 الدرس: ' + esc(cx.lesson) : '') + (cx.topic ? '<br>❓ الموضوع: ' + esc(cx.topic) : '') + '</div>' : '')
    + infoHTML(data)
    + '<div id="spFeed" data-n="' + data.messages.length + '" data-s="' + data.status + data.solved + '" data-v="' + (data.student_seen_at || '') + '">' + data.messages.map(msgHTML).join('') + '</div>'
    + (data.status === 'open' ? (cans.length ? '<div class="spcan"><select id="s5Can" data-n="' + esc((data.name || '').split(' ')[0]) + '"><option value="">🗂 رد جاهز…</option>' + cans.map(c => '<option value="' + c.id + '">' + esc(c.title) + '</option>').join('') + '</select></div>' : '')
      + '<div class="spin"><textarea id="spTxt" dir="auto" placeholder="اكتب ردك..." rows="2">' + esc(draft) + '</textarea><input type="file" id="spImg" accept="image/*" hidden><button class="btn s g" data-act="s5Pick" title="إرفاق صورة">📎</button><button class="btn" data-act="s5Send" data-id="' + id + '">إرسال</button></div><small id="spInfo" style="color:var(--muted)"></small>'
      : '<p class="nt" style="margin-top:10px">المحادثة منتهية — الطالب لو راسل تاني هيبدأ محادثة جديدة، وده السجل محفوظ هنا.</p>');
  const f2 = box.querySelector('#spFeed'); if (f2 && (near || !quiet)) f2.scrollTop = f2.scrollHeight;
  if (hadFocus) { const t2 = box.querySelector('#spTxt'); if (t2) { try { t2.focus({ preventScroll: true }); t2.setSelectionRange(selS, selE); } catch (e) {} } }
  if (!quiet) refreshList();
  if (window.__pollAlerts) setTimeout(window.__pollAlerts, 400);
}
document.addEventListener('change', e => { const t = e.target; if (t && t.id === 's5Can' && t.value) { const c = (SP.can || []).find(x => x.id === t.value), ta = document.querySelector('#spTxt'); if (c && ta) { const txt = c.body.replace(/\{name\}/g, t.dataset.n || ''); ta.value = (ta.value ? ta.value + '\n' : '') + txt; ta.focus(); } t.value = ''; } });
document.addEventListener('input', e => { const t = e.target; if (t && t.id === 'spQ') { SP.q = t.value; const el = document.querySelector('#spList'); if (el) el.innerHTML = listHTML(filt(SP.list)); } });
function canModal() {
  const list = (SP.can || []).map(c => '<div class="v5row"><div class="nm"><b>' + esc(c.title) + '</b> <span class="spk ' + (c.kind === 'academic' ? 'a' : c.kind === 'tech' ? 't' : 's') + '">' + ({ all: 'الكل', tech: '🔧 فني', academic: '📘 علمي' }[c.kind]) + '</span><br><small dir="auto">' + esc(c.body.slice(0, 140)) + '</small></div><button class="btn s r" data-act="s5CanDel" data-id="' + c.id + '">حذف</button></div>').join('') || '<div class="empty">لسه مفيش ردود جاهزة</div>';
  modal('🗂 الردود الجاهزة', '<p class="nt">اكتب {name} في الرد وهيتبدّل باسم الطالب الأول.</p>' + list + '<form id="canF" style="margin-top:14px;border-top:1px solid var(--line);padding-top:12px"><label>العنوان</label><input name="t" required maxlength="60" placeholder="مثال: شكراً على سؤالك"><label>النوع</label><select name="k"><option value="all">الكل</option><option value="tech">🔧 فني</option><option value="academic">📘 علمي</option></select><label>نص الرد</label><textarea name="b" required maxlength="1500" dir="auto" placeholder="أهلاً {name}، ..."></textarea><button class="btn" style="width:100%;margin-top:14px">➕ إضافة الرد</button></form>',
    async f => { const row = { title: f.get('t').trim(), kind: f.get('k'), body: f.get('b').trim() }; const { error } = await sb.from('support_canned').insert(row); if (error) throw new Error(errMsg(error)); SP.can = null; toast('تمت الإضافة ✅'); go(window.__cur || 'support'); });
}
async function paintCounts() {
  try {
    const { data } = await sb.rpc('support_admin_counts'); if (!data) return;
    document.querySelectorAll('#nav .nbd5').forEach(b => b.remove());
    const put = (v, n) => { if (!n) return; const a = document.querySelector('#nav a[data-go="' + v + '"]'); if (!a) return; const b = document.createElement('b'); b.className = 'nbd5'; b.textContent = n > 99 ? '99+' : n; a.appendChild(b); };
    put('support', +data.tech || 0); put('support_ac', +data.academic || 0);
  } catch (e) {}
}
Object.assign(ACT, {
  s5Kind: id => { SP.kind = id; SP.keep = true; go(window.__cur === 'support_ac' ? 'support_ac' : 'support'); },
  s5Status: id => { SP.status = id; SP.keep = true; go(window.__cur === 'support_ac' ? 'support_ac' : 'support'); },
  s5Open: id => thread(id),
  s5Pick: () => { const f = $('#spImg'); f.onchange = async () => { const file = f.files[0]; if (!file) return; const info = $('#spInfo'); info.textContent = '⏳ جاري رفع الصورة...'; try { SP.img = await spUpload(file); info.textContent = '✅ الصورة جاهزة — اضغط إرسال'; } catch (e) { SP.img = null; info.textContent = '⚠️ تعذر رفع الصورة'; } }; f.click(); },
  s5Send: async (id, el) => {
    const t = $('#spTxt').value.trim(); if (!t && !SP.img) return; el.disabled = true;
    const { error } = await sb.rpc('support_admin_reply', { p_thread: id, p_body: t || null, p_image: SP.img || null }); el.disabled = false; if (error) throw error;
    SP.img = null; $('#spTxt').value = ''; await thread(id);
  },
  s5Solve: async (id, el) => { const { error } = await sb.rpc('support_admin_solved', { p_thread: id, p_solved: el.dataset.v === '1' }); if (error) throw new Error(errMsg(error)); toast(el.dataset.v === '1' ? 'اتعلّمت «تم الحل» ✅' : 'رجعت للمتابعة'); await thread(id); },
  s5Del: async id => { if (!confirm('مسح المحادثة نهائياً بكل رسائلها وصورها؟ مش هتقدر ترجعها.')) return; await spPurgeImages(id); const { error } = await sb.rpc('support_admin_delete', { p_thread: id }); if (error) throw error; SP.id = null; go(window.__cur || 'support'); },
  s5Close: async (id, el) => { if (el.dataset.c === '1' && !confirm('إنهاء المحادثة؟ السجل هيفضل محفوظ.')) return; const { error } = await sb.rpc('support_admin_close', { p_thread: id, p_close: el.dataset.c === '1' }); if (error) throw error; await thread(id); },
  s5Canned: async () => { await loadCan(); canModal(); },
  s5CanDel: async id => { if (!confirm('حذف الرد الجاهز؟')) return; const { error } = await sb.from('support_canned').delete().eq('id', id); if (error) throw error; SP.can = null; await loadCan(); canModal(); }
});
VIEWS.support = ['الدعم الفني', () => vSup('tech')];
VIEWS.support_ac = ['الدعم العلمي', () => vSup('academic')];
V5.paintCounts = paintCounts; setInterval(() => { if (!document.hidden) paintCounts(); }, 25000); setTimeout(paintCounts, 2500);
V5.fmtB = fmtB; V5.nf = nf; V5.tf = tf; V5.errMsg = errMsg;

// ---------------------------------------------------------------- تصميم الأسئلة (إطار الامتحان لكل صف)
const ED = { D: null, y: '', cur: null, dirty: false };
const TOGGLES = [['show_header', '🎩 الهيدر (الشعار + اسم المنصة)'], ['show_logo', '🔰 شعار المنصة'], ['show_chips', '🏷️ شارات النوع والدرجة'], ['show_grade', '🎓 الصف (الهيدر + الفوتر)'], ['show_footer', '🦶 الفوتر'], ['show_photo', '🧑‍🏫 صورة المدرس'], ['show_site', '🌐 رابط الموقع'], ['show_social', '📣 فيسبوك / واتساب']];
const TEXTS = [['brand_title', 'اسم المنصة (السطر الأول)'], ['brand_sub', 'السطر التاني تحت الاسم'], ['header_pill', 'نص ثابت في الهيدر (فاضي = اسم الامتحان)'], ['teacher_name', 'اسم المدرس'], ['teacher_sub', 'سطر تحت اسم المدرس'], ['site_url', 'رابط الموقع (فاضي = دومين المنصة)'], ['facebook', 'فيسبوك (مثال: facebook.com/yourpage)'], ['whatsapp', 'واتساب (رقم)'], ['grade_label', 'المرحلة في شارة الصف (فاضي = تلقائي)'], ['grade_num', 'رقم الصف (فاضي = تلقائي)']];
const PALS = [['بنفسجي (الأصلي)', ['#6b2d5c', '#7d3a6c', '#ef4444', '#ec4899']], ['أزرق', ['#1e3a8a', '#2563eb', '#0ea5e9', '#6366f1']], ['أخضر', ['#14532d', '#16a34a', '#f59e0b', '#84cc16']], ['أحمر داكن', ['#7f1d1d', '#b91c1c', '#f97316', '#ef4444']], ['رمادي', ['#1f2937', '#374151', '#6366f1', '#8b5cf6']]];
const edBase = () => Object.assign({}, ED.D.defaults, ED.D.saved.default || {});
const edEff = y => Object.assign({}, edBase(), y ? ((ED.D.saved.years || {})[y] || {}) : {});
function edFrame() {
  const F = Object.assign({}, ED.cur), yr = ED.y || 'ثالثة ثانوي', g = (window.XF && XF.GRADES[yr]) || ['', ''], S0 = ED.D.settings || {};
  F.year = yr; if (!F.teacher_name) F.teacher_name = S0.teacher_name || 'Mr. Sherif Khafagy'; if (!F.grade_num) F.grade_num = g[0]; if (!F.grade_label) F.grade_label = g[1];
  if (F.show_photo && S0.teacher_photo) F.photo = S0.teacher_photo; return F;
}
function edPreview() { const b = $('#edPv'); if (!b || !window.XF) return; const F = edFrame(); b.innerHTML = XF.sample(F, 'mcq') + XF.sample(F, 'essay'); }
function edForm() {
  const c = ED.cur, ys = ED.D.saved.years || {};
  const tabs = '<div class="ytabs"><button class="yt' + (ED.y === '' ? ' on' : '') + '" data-act="edY" data-id="">🌐 كل الصفوف</button>' + YEARS.map(y => '<button class="yt' + (ED.y === y ? ' on' : '') + '" data-act="edY" data-id="' + esc(y) + '">' + esc(y) + (Object.keys(ys[y] || {}).length ? ' ●' : '') + '</button>').join('') + '</div>';
  const photo = (ED.D.settings || {}).teacher_photo;
  return tabs + '<p class="nt">' + (ED.y === '' ? 'ده الإعداد الأساسي لكل الصفوف. تقدر بعدين تدخل على صف معيّن وتغيّر فيه بس (اللي بتغيّره بيفضل خاص بالصف ده).' : '🎯 بتعدّل إعدادات <b>' + esc(ED.y) + '</b> بس — أي حاجة ما غيّرتهاش بتفضل زي إعداد «كل الصفوف».') + '</p>'
    + '<div class="v5grid2"><div id="edF"><div class="card"><b>👁️ إيه اللي يظهر</b><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:8px;margin-top:10px">' + TOGGLES.map(t => '<label class="v5tg"><input type="checkbox" data-ef="' + t[0] + '"' + (c[t[0]] ? ' checked' : '') + '>' + t[1] + '</label>').join('') + '</div></div>'
    + '<div class="card" style="margin-top:12px"><b>✏️ النصوص</b>' + TEXTS.map(t => '<label>' + t[1] + '</label><input data-et="' + t[0] + '" dir="auto" maxlength="80" value="' + esc(c[t[0]] || '') + '">').join('') + '</div>'
    + '<div class="card" style="margin-top:12px"><b>🎨 الألوان</b><div class="v5pal">' + PALS.map((p, i) => '<button type="button" data-act="edPal" data-id="' + i + '" title="' + esc(p[0]) + '">' + p[1].map(x => '<i style="background:' + x + '"></i>').join('') + '</button>').join('') + '</div>'
    + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px">' + [['c1', 'لون الهيدر والفوتر (1)'], ['c2', 'لون الهيدر والفوتر (2)'], ['a1', 'لون التمييز (1)'], ['a2', 'لون التمييز (2)']].map(k => '<div><label>' + k[1] + '</label><div class="v5col"><input type="color" data-ec="' + k[0] + '" value="' + esc(c[k[0]]) + '"><input data-ecx="' + k[0] + '" value="' + esc(c[k[0]]) + '" dir="ltr" maxlength="7"></div></div>').join('') + '</div></div>'
    + '<div class="card" style="margin-top:12px"><b>🧑‍🏫 صورة المدرس</b><div class="bar" style="margin:10px 0 0">' + (photo ? '<img src="' + esc(photo) + '" alt="" style="width:64px;height:64px;border-radius:50%;object-fit:cover;border:2px solid var(--brand)">' : '<span class="nt" style="margin:0">لسه ما فيش صورة.</span>') + '<button class="btn s g" data-go="settings">تغيير الصورة من «إعدادات المنصة»</button></div></div>'
    + '<div class="bar" style="margin-top:14px;position:sticky;bottom:0;background:var(--bg);padding:10px 0"><button class="btn" data-act="edSave">💾 حفظ</button>' + (ED.y ? '<button class="btn g" data-act="edReset">↩️ رجّع ' + esc(ED.y) + ' لإعداد الكل</button>' : '') + '<span id="edSt" class="nt" style="margin:0"></span></div></div>'
    + '<div><b style="display:block;margin-bottom:8px">👀 معاينة حية (اختياري + مقالي) — القطعة بتظهر فوق السؤال</b><div class="v5pv" id="edPv"></div><p class="nt" style="margin-top:10px">الإجابة النموذجية بتفضل في لوحة التحكم ومش بتظهر للطالب أبداً. الإطار بيتحمّل مرة واحدة والباقي نصوص — مفيش صور بتتخزّن.</p></div></div>';
}
async function vDesign() {
  if (!window.XF) throw new Error('ملف exam-frame.js ناقص — ارفعه في جذر الموقع وحدّث الصفحة');
  const { data, error } = await sb.rpc('exam_frame_admin'); if (error) throw new Error(errMsg(error));
  ED.D = data || {}; ED.D.saved = ED.D.saved || {}; ED.cur = edEff(ED.y); ED.dirty = false; setTimeout(edPreview, 0); return edForm();
}
const edDiff = (cur, base) => { const o = {}; Object.keys(cur).forEach(k => { if (cur[k] !== base[k]) o[k] = cur[k]; }); return o; };
function edSet(k, v) { ED.cur[k] = v; ED.dirty = true; const s = $('#edSt'); if (s) s.textContent = '● فيه تعديلات لسه ما اتحفظتش'; edPreview(); }
document.addEventListener('input', e => {
  const t = e.target; if (!t || !t.dataset || !ED.cur || !$('#edF')) return;
  if (t.dataset.et) edSet(t.dataset.et, t.value);
  else if (t.dataset.ec) { edSet(t.dataset.ec, t.value); const x = document.querySelector('[data-ecx="' + t.dataset.ec + '"]'); if (x) x.value = t.value; }
  else if (t.dataset.ecx && /^#[0-9a-fA-F]{6}$/.test(t.value)) { edSet(t.dataset.ecx, t.value.toLowerCase()); const x = document.querySelector('[data-ec="' + t.dataset.ecx + '"]'); if (x) x.value = t.value.toLowerCase(); }
});
document.addEventListener('change', e => { const t = e.target; if (t && t.dataset && t.dataset.ef && ED.cur && $('#edF')) edSet(t.dataset.ef, t.checked); });
async function edSave(reset) {
  const sv = ED.D.saved, out = { default: sv.default || {}, years: Object.assign({}, sv.years || {}) };
  if (ED.y === '') out.default = edDiff(ED.cur, ED.D.defaults);
  else if (reset) delete out.years[ED.y];
  else { const d = edDiff(ED.cur, edBase()); if (Object.keys(d).length) out.years[ED.y] = d; else delete out.years[ED.y]; }
  const { error } = await sb.rpc('exam_frame_save', { p_frame: out }); if (error) throw new Error(errMsg(error));
  ED.D.saved = out; ED.cur = edEff(ED.y); ED.dirty = false; toast('تم حفظ التصميم ✅ — بيظهر للطلاب في الامتحان الجاي'); go('xdesign');
}
Object.assign(ACT, {
  edY: id => { if (ED.dirty && !confirm('فيه تعديلات ما اتحفظتش، هتتمسح لو غيّرت الصف. تكمل؟')) return; ED.y = id || ''; ED.cur = edEff(ED.y); ED.dirty = false; $('#view').innerHTML = edForm(); applyActGate($('#view')); edPreview(); },
  edPal: id => { const p = PALS[+id]; if (!p) return; ['c1', 'c2', 'a1', 'a2'].forEach((k, i) => { ED.cur[k] = p[1][i]; }); ED.dirty = true; $('#view').innerHTML = edForm(); applyActGate($('#view')); edPreview(); const s = $('#edSt'); if (s) s.textContent = '● فيه تعديلات لسه ما اتحفظتش'; },
  edSave: () => edSave(false),
  edReset: () => { if (!confirm('هترجّع ' + ED.y + ' لإعداد «كل الصفوف»؟')) return; return edSave(true); }
});
VIEWS.xdesign = ['تصميم الأسئلة', vDesign];

// ---------------------------------------------------------------- الاستهلاك والصيانة
const PLANS = { free: { n: 'Free (المجاني)', db: 500 * 1048576, st: 1073741824 }, pro: { n: 'Pro', db: 8 * 1073741824, st: 100 * 1073741824 } };
const planNow = () => { let p = 'free'; try { p = localStorage.getItem('adm_plan') || 'free'; } catch (e) {} return PLANS[p] ? p : 'free'; };
const gauge = (used, lim) => { const p = Math.min(100, used / lim * 100); return '<div class="v5g' + (p > 85 ? ' d' : p > 65 ? ' w' : '') + '"><i style="width:' + p.toFixed(1) + '%"></i></div><div class="v5s"><span>' + fmtB(used) + ' من ' + fmtB(lim) + '</span><b>' + p.toFixed(1) + '%</b></div>'; };
const gaugeN = (used, lim) => { const p = Math.min(100, used / lim * 100); return '<div class="v5g' + (p > 85 ? ' d' : p > 65 ? ' w' : '') + '"><i style="width:' + p.toFixed(1) + '%"></i></div><div class="v5s"><span>' + nf(used) + ' من ' + nf(lim) + '</span><b>' + p.toFixed(2) + '%</b></div>'; };
const CK = [
  ['essay_images', '🖼️', 'صور إجابات المقالي (المصحّحة)', 'img', 'الدرجة بتفضل محفوظة، بس صورة إجابة الطالب بتتشال من التخزين. (بتتحذف اللي اتصححت بس).', 90],
  ['support_images', '📎', 'صور الدعم الفني (احذفها بعد يوم أو يومين براحتك)', 'img', 'بتتشال الصور من التخزين وبيفضل نص الرسالة. اختار «1 يوم» أو «2 يوم» لو عايز تحذف أول بأول.', 2],
  ['support_orphans', '🧹', 'ملفات صور يتيمة في التخزين', 'img', 'صور فضلت في التخزين ومفيش رسالة بتستخدمها (مثلاً من محادثات اتمسحت قبل التحديث). آمنة تماماً.', 1],
  ['support_closed', '💬', 'محادثات الدعم المنتهية', 'row', 'بتتمسح المحادثات المنتهية بالكامل بما فيها رسايلها وصورها.', 90],
  ['login_events', '🔑', 'سجل تسجيلات الدخول', 'row', '', 90],
  ['audit', '🕵️', 'سجل العمليات (Audit)', 'row', '', 180],
  ['archive', '🗄️', 'أرشيف المحاولات القديمة (بعد فتح محاولة جديدة)', 'row', '', 180],
  ['drafts', '📝', 'مسودات الامتحانات المنتهية', 'row', 'المسودات اللي الطالب سلّم بعدها.', 30],
  ['notifications', '🔔', 'الإشعارات القديمة', 'row', '', 60]
];
const COUNT_L = { students: 'الطلاب', courses: 'الكورسات', lessons: 'المحاضرات', quizzes: 'الامتحانات', questions: 'الأسئلة', attempts: 'المحاولات', answers: 'إجابات الطلاب', support_threads: 'محادثات الدعم', support_messages: 'رسائل الدعم', login_events: 'سجل الدخول', audit: 'سجل العمليات', archive: 'الأرشيف', notifications: 'الإشعارات', drafts: 'المسودات' };
const TBL_L = { quiz_attempt_answers: 'إجابات الطلاب', quiz_attempts: 'المحاولات', login_events: 'سجل الدخول', admin_audit: 'سجل العمليات', notifications: 'الإشعارات', support_messages: 'رسائل الدعم', profiles: 'الطلاب', quiz_questions: 'الأسئلة', quiz_attempt_archive: 'الأرشيف', quiz_live_drafts: 'المسودات', lesson_progress: 'تقدم المحاضرات', item_progress: 'تقدم العناصر', item_views: 'مشاهدات العناصر', quiz_answers: 'الإجابات الصحيحة', enrollments: 'الاشتراكات', notif_reads: 'قراءة الإشعارات', site_settings: 'الإعدادات', quiz_passages: 'القطع' };
async function vMaint() {
  const { data: U, error } = await sb.rpc('usage_stats'); if (error) throw new Error(errMsg(error));
  const pk = planNow(), P = PLANS[pk], st = (U.storage || []).reduce((s, x) => s + (+x.bytes || 0), 0), dbp = U.db_bytes / P.db * 100;
  const tmax = Math.max(...(U.tables || []).map(t => +t.bytes), 1), g = U.growth_per_day == null ? null : +U.growth_per_day;
  const lim85 = P.db * 0.85, left85 = lim85 - U.db_bytes, days85 = g != null && g > 0 ? Math.max(0, Math.floor(left85 / g)) : null, days100 = g != null && g > 0 ? Math.max(0, Math.floor((P.db - U.db_bytes) / g)) : null;
  const fcast = g == null ? 'بجمع بيانات النمو الفعلي — افتح الصفحة (أو لوحة التحكم) كل يوم، ومحتاج يومين على الأقل عشان أحسب معدل نمو حقيقي. (' + nf(U.snap_days || 0) + ' يوم متسجّل لحد دلوقتي)'
    : g <= 0 ? '📉 القاعدة مستقرة أو بتقل (آخر 30 يوم) — مفيش خطر قريب.'
    : 'بتزيد فعلياً حوالي <b>' + fmtB(g) + ' كل يوم</b> (محسوب من لقطات يومية حقيقية). ' + (left85 <= 0 ? '🔴 عدّيت 85% من الخطة.' : 'هتوصل 85% بعد حوالي <b>' + nf(days85) + ' يوم</b> وتمتلي بعد حوالي <b>' + nf(days100) + ' يوم</b> لو الاستخدام زي ما هو.');
  const sch = U.schemas || {}, other = Math.max(0, U.db_bytes - (U.public_bytes || 0)), SL = { auth: 'حسابات الدخول (auth)', storage: 'بيانات التخزين (storage)', realtime: 'realtime', vault: 'vault', extensions: 'extensions', other: 'نظام Postgres وغيره' };
  const spark = (() => { const t = U.trend || []; if (t.length < 2) return ''; const mx = Math.max(...t.map(x => +x.db)), mn = Math.min(...t.map(x => +x.db)), w = 260, h = 46, rg = Math.max(mx - mn, 1); return '<svg viewBox="0 0 ' + w + ' ' + h + '" style="width:100%;max-width:300px;height:46px;display:block;margin-top:8px"><polyline fill="none" stroke="#ef4444" stroke-width="2" points="' + t.map((x, i) => (i / (t.length - 1) * (w - 4) + 2).toFixed(1) + ',' + (h - 4 - (+x.db - mn) / rg * (h - 10)).toFixed(1)).join(' ') + '"/></svg><small style="color:var(--muted)">آخر ' + t.length + ' لقطة يومية (من ' + fmtB(mn) + ' إلى ' + fmtB(mx) + ')</small>'; })();
  const mauP = (U.mau || 0) / 50000 * 100;
  const verdict = dbp > 85 ? ['d', '🔴 قاعدة البيانات قربت تتملي — نضّف أو ارفع الخطة'] : (dbp > 65 || (days85 != null && days85 < 45)) ? ['w', '🟠 راقب الاستهلاك' + (days85 != null && days85 < 45 ? ' — النمو سريع' : '')] : ['ok', '🟢 وضعك كويس'];
  return '<div class="bar"><b>الخطة الحالية على Supabase:</b><select id="plSel" style="max-width:220px">' + Object.keys(PLANS).map(k => '<option value="' + k + '"' + (k === pk ? ' selected' : '') + '>' + PLANS[k].n + '</option>').join('') + '</select><span class="pill ' + (verdict[0] === 'd' ? 'no' : 'ok') + '">' + verdict[1] + '</span><button class="btn s g" data-go="maint" style="margin-right:auto">🔄 تحديث</button></div>'
    + '<div class="v5grid2"><div class="card"><b>🗃️ قاعدة البيانات</b>' + gauge(U.db_bytes, P.db) + '<p class="nt" style="margin:8px 0 0">الرقم ده هو <b>نفس الرقم اللي Supabase بيحاسبك عليه</b> (حجم القاعدة الفعلي). منه بياناتك: <b>' + fmtB(U.public_bytes || 0) + '</b>، والباقي (<b>' + fmtB(other) + '</b>) نظام Supabase: ' + Object.keys(sch).filter(k => k !== 'public' && +sch[k] > 0).map(k => (SL[k] || k) + ' ' + fmtB(+sch[k])).join(' • ') + '.</p><p class="nt" style="margin:8px 0 0">📈 ' + fcast + '</p>' + spark + '</div>'
    + '<div class="card"><b>🖼️ تخزين الملفات (صور + ملفات)</b>' + gauge(+U.storage_bytes || st, P.st) + '<p class="nt" style="margin:8px 0 0">' + (U.storage || []).map(b => esc(b.bucket) + ': ' + nf(b.files) + ' ملف (' + fmtB(b.bytes) + ')').join(' • ') + '</p><p class="nt" style="margin:8px 0 0">الفيديوهات والملفات اللي على Bunny / Cloudflare R2 / يوتيوب مش بتتحسب هنا (ليها حساب منفصل).</p></div></div>'
    + '<div class="v5grid2" style="margin-top:14px"><div class="card"><b>👥 المستخدمين النشطين (MAU)</b>' + gaugeN(U.mau || 0, 50000) + '<p class="nt" style="margin:8px 0 0">اللي سجّلوا دخول آخر 30 يوم: <b>' + nf(U.mau || 0) + '</b> من إجمالي <b>' + nf(U.auth_users || 0) + '</b> حساب. حد Supabase المجاني 50,000 مستخدم نشط في الشهر.</p></div>'
    + '<div class="card"><b>🌐 حاجات مش بتتقاس من هنا</b><p class="nt" style="margin:6px 0 0">استهلاك <b>الإنترنت (Egress — 5 جيجا/شهر مجاناً)</b> بيتشاف من Supabase ← Reports ← Egress. الموقع متظبط يقلّل الطلبات (تجميع + كاش)، لكن الرقم الفعلي مصدره Supabase بس. أرقام النظام فوق (حجم القاعدة، التخزين، عدد الصفوف، النشطين) <b>فعلية مش تقديرية</b> — اتقاست الساعة ' + new Date(U.at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) + '.</p></div></div>'
    + '<div class="v5k" style="margin-top:14px">' + Object.keys(COUNT_L).map(k => '<div class="kk"><b>' + nf(U.counts[k]) + '</b><span>' + COUNT_L[k] + '</span></div>').join('') + '<div class="kk"><b>' + nf(U.auth_users) + '</b><span>إجمالي حسابات الدخول</span></div></div>'
    + '<h3 class="v5h">📊 أكبر الجداول حجماً</h3><div class="card">' + (U.tables || []).map(t => '<div class="v5row"><span class="nm">' + esc(TBL_L[t.name] || t.name) + ' <small dir="ltr">' + esc(t.name) + '</small></span><small>' + nf(t.rows) + ' صف' + (+t.dead > 0 ? ' (' + nf(t.dead) + ' محذوف مستني تنضيف)' : '') + '</small><div style="flex:1 1 160px;min-width:120px"><div class="v5g" style="margin:0"><i style="width:' + Math.max(2, t.bytes / tmax * 100) + '%"></i></div></div><b style="min-width:70px;text-align:left">' + fmtB(t.bytes) + '</b></div>').join('') + '</div>'
    + '<h3 class="v5h">🧹 تنظيف آمن (للمالك فقط) — بيوريك العدد قبل ما يحذف</h3><div class="v5grid2">' + CK.map(c => '<div class="card" data-ck="' + c[0] + '"><b>' + c[1] + ' ' + c[2] + '</b><p class="nt" style="margin:4px 0 8px">' + esc(c[4]) + '</p><div class="bar" style="margin:0"><span class="nt" style="margin:0">أقدم من</span><select data-ckd style="max-width:120px;min-width:0;flex:none">' + [1, 2, 3, 7, 14, 30, 60, 90, 180, 365].map(d => '<option value="' + d + '"' + (d === c[5] ? ' selected' : '') + '>' + d + ' يوم</option>').join('') + '</select><button class="btn s g" data-act="mtPrev" data-id="' + c[0] + '">👁 معاينة</button></div><div class="mtOut" style="margin-top:8px;font-weight:700"></div></div>').join('') + '</div>'
    + '<h3 class="v5h">💾 نسخة احتياطية (الخطة المجانية مفيهاش نسخ تلقائي!)</h3><div class="card"><p class="nt">نزّل نسخة على جهازك كل أسبوع تقريباً. الملفات دي بتتولّد في المتصفح وما بتتخزّنش في أي مكان.</p><div class="bar" style="margin:0"><button class="btn s" data-act="bkStudents">👥 الطلاب (CSV)</button><button class="btn s" data-act="bkResults">📊 النتائج (CSV)</button><button class="btn s g" data-act="bkAll">📦 نسخة كاملة (JSON)</button></div><div id="bkSt" class="nt" style="margin:10px 0 0"></div></div>';
}
document.addEventListener('change', e => { const t = e.target; if (t && t.id === 'plSel') { try { localStorage.setItem('adm_plan', t.value); } catch (x) {} go('maint'); } });
const ckOf = id => CK.find(c => c[0] === id);
async function mtRemove(kind, days, out) {
  const bucket = kind === 'essay_images' ? 'essay-files' : 'support-files'; let done = 0, rows = 0, guard = 0, last = '';
  for (;;) {
    if (++guard > 80) break;
    const { data: paths, error } = await sb.rpc('cleanup_list', { p_kind: kind, p_days: days, p_limit: 100 }); if (error) throw new Error(errMsg(error));
    if (!paths || !paths.length) break;
    out.textContent = '⏳ جاري حذف الملفات… (' + done + ')';
    const rm = await sb.storage.from(bucket).remove(paths); if (rm.error) throw new Error('تعذر حذف الملفات من التخزين: ' + rm.error.message + ' — شغّل db_26 تاني وتأكد إنك مالك');
    const { data: n, error: e2 } = await sb.rpc('cleanup_mark', { p_kind: kind, p_paths: paths }); if (e2) throw new Error(errMsg(e2));
    const sig = paths.join('|'); if (sig === last) break; last = sig;
    done += paths.length; rows += +n || 0; if (!(+n > 0)) break;
  }
  return { files: done, rows };
}
async function fetchAll(table, cols, onP) {
  const out = []; for (let from = 0; ; from += 1000) { const r = await sb.from(table).select(cols || '*').range(from, from + 999); if (r.error) throw r.error; out.push(...(r.data || [])); if (onP) onP(out.length); if (!r.data || r.data.length < 1000) break; }
  return out;
}
const csvq = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
function dl(name, text, type) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: type || 'text/plain;charset=utf-8' })); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
const stamp = () => new Date().toISOString().slice(0, 10);
Object.assign(ACT, {
  mtPrev: async (id, el) => {
    const card = el.closest('[data-ck]'), days = +card.querySelector('[data-ckd]').value, out = card.querySelector('.mtOut'), c = ckOf(id); out.textContent = '⏳...';
    const { data, error } = await sb.rpc('cleanup_preview', { p_kind: id, p_days: days }); if (error) { out.textContent = ''; throw new Error(errMsg(error)); }
    if (!data.count) { out.innerHTML = '<span style="color:var(--ok)">✅ مفيش حاجة تتحذف.</span>'; return; }
    out.innerHTML = '<span style="color:#fbbf24">هيتحذف <b>' + nf(data.count) + '</b> ' + (c[3] === 'img' ? 'صورة' : 'عنصر') + (data.bytes ? ' (حوالي ' + fmtB(data.bytes) + ')' : '') + '</span> <button class="btn s r" data-act="mtRun" data-id="' + id + '">🗑 تأكيد الحذف</button>';
  },
  mtRun: async (id, el) => {
    const card = el.closest('[data-ck]'), days = +card.querySelector('[data-ckd]').value, out = card.querySelector('.mtOut'), c = ckOf(id);
    if (!confirm('تأكيد: ' + c[2] + ' الأقدم من ' + days + ' يوم هيتحذف نهائياً ومش هتقدر ترجّعه. تكمل؟')) return;
    el.disabled = true;
    try {
      if (id === 'support_closed') { await mtRemove('support_closed_files', days, out); }
      if (c[3] === 'img') { const r = await mtRemove(id, days, out); toast('تم حذف ' + r.files + ' ملف ✅'); }
      else { const { data, error } = await sb.rpc('cleanup_run', { p_kind: id, p_days: days }); if (error) throw new Error(errMsg(error)); toast('تم حذف ' + data + ' عنصر ✅'); }
      go('maint');
    } finally { el.disabled = false; }
  },
  bkStudents: async () => {
    const st = $('#bkSt'); st.textContent = '⏳ بنجهّز الملف…'; const rows = await fetchAll('profiles', '*', n => st.textContent = '⏳ ' + n + ' طالب…');
    const cols = ['first_name', 'middle_name', 'last_name', 'phone_number', 'parent_phone', 'academic_year', 'created_at', 'is_blocked'];
    dl('students-' + stamp() + '.csv', '﻿' + [cols.join(',')].concat(rows.map(r => cols.map(c => csvq(r[c])).join(','))).join('\n'), 'text/csv;charset=utf-8'); st.textContent = '✅ تم تنزيل ' + rows.length + ' طالب';
  },
  bkResults: async () => {
    const st = $('#bkSt'); st.textContent = '⏳ بنجهّز الملف…';
    const [a, p, q] = await Promise.all([fetchAll('quiz_attempts', 'id,quiz_id,student_id,score,total,status,violations,seconds_spent,created_at', n => st.textContent = '⏳ ' + n + ' محاولة…'), fetchAll('profiles', 'id,first_name,last_name,phone_number,academic_year'), fetchAll('quizzes', 'id,title')]);
    const pm = {}, qm = {}; p.forEach(x => pm[x.id] = x); q.forEach(x => qm[x.id] = x);
    const head = ['الطالب', 'الهاتف', 'الصف', 'الامتحان', 'الدرجة', 'من', 'النسبة', 'الحالة', 'مرات الخروج', 'الوقت (ثانية)', 'التاريخ'];
    const lines = a.map(r => { const s = pm[r.student_id] || {}, z = qm[r.quiz_id] || {}; return [[s.first_name, s.last_name].filter(Boolean).join(' '), s.phone_number, s.academic_year, z.title, r.score, r.total, r.total ? Math.round(r.score * 100 / r.total) + '%' : '', r.status, r.violations, r.seconds_spent, r.created_at].map(csvq).join(','); });
    dl('results-' + stamp() + '.csv', '﻿' + [head.map(csvq).join(',')].concat(lines).join('\n'), 'text/csv;charset=utf-8'); st.textContent = '✅ تم تنزيل ' + a.length + ' محاولة';
  },
  bkAll: async () => {
    const st = $('#bkSt'), T = ['profiles', 'courses', 'lessons', 'lesson_items', 'enrollments', 'quizzes', 'quiz_passages', 'quiz_questions', 'quiz_answers', 'quiz_attempts', 'quiz_attempt_answers', 'announcements', 'site_banners', 'support_threads', 'support_messages'], out = { exported_at: new Date().toISOString(), tables: {} };
    for (const t of T) { st.textContent = '⏳ ' + t + '…'; try { out.tables[t] = await fetchAll(t); } catch (e) { out.tables[t] = { error: e.message }; } }
    dl('backup-' + stamp() + '.json', JSON.stringify(out), 'application/json'); st.textContent = '✅ تم تنزيل النسخة الكاملة (' + T.length + ' جدول). احتفظ بيها في مكان آمن.';
  }
});
VIEWS.maint = ['الاستهلاك والصيانة', vMaint];

// لقطة يومية لحجم القاعدة (مرة في اليوم لكل متصفح أدمن) عشان معدل النمو يتحسب من أرقام حقيقية
setTimeout(() => { try { const d = new Date().toISOString().slice(0, 10); if (localStorage.getItem('usage_snap') === d || typeof sb === 'undefined') return; sb.rpc('usage_stats').then(r => { if (r && !r.error) localStorage.setItem('usage_snap', d); }, () => {}); } catch (e) {} }, 9000);

// ---------------------------------------------------------------- مفاتيح الفيديو (للمالك فقط): Bunny (أكتر من مكتبة/حساب) + Cloudflare R2 (أكتر من حساب)
const R2D = [['account', 'Account ID (32 حرف)', 'text'], ['key_id', 'Access Key ID', 'text'], ['secret', 'Secret Access Key', 'password'], ['bucket', 'اسم الـBucket (حروف صغيرة وأرقام وشرطة)', 'text']];
const R2W = [['worker_base', 'رابط الـWorker (مثال: https://video.yoursite.com)', 'text'], ['token_key', 'مفتاح توقيع Worker (سر طويل)', 'password']];
const r2pre = al => al ? 'r2a_' + al + '_' : 'r2_';
function r2Sec(st, al, kind, fields, title, hint) {
  const pre = r2pre(al), id = (al || '_') + '-' + kind;
  return '<div style="margin-top:12px;padding-top:10px;border-top:1px dashed var(--line)" data-r2="' + esc(al) + '|' + kind + '"><b>' + title + '</b><p class="nt" style="margin:4px 0 8px;line-height:1.8">' + hint + '</p>'
    + fields.map(f => '<label>' + f[1] + ' ' + (st[pre + f[0]] ? '<span class="pill ok">✅ محفوظ</span>' : '<span class="pill no">ناقص</span>') + '</label><input data-k="' + pre + f[0] + '" type="' + f[2] + '" dir="ltr" autocomplete="off" placeholder="' + (st[pre + f[0]] ? '(سيبه فاضي لو مش عايز تغيّره)' : '') + '">').join('')
    + '<div class="bar" style="margin:10px 0 0"><button class="btn s" data-act="r2Save" data-id="' + esc(al) + '|' + kind + '">💾 حفظ</button>' + (kind === 'w' ? '<button class="btn s g" data-act="r2Gen" data-id="' + esc(al) + '">🎲 ولّد مفتاح عشوائي</button>' : '') + '<button class="btn s r" data-act="r2Del" data-id="' + esc(al) + '|' + kind + '">حذف</button></div></div>';
}
function r2Acc(st, al) {
  const pf = al ? 'r2:' + al + ':' : 'r2:', wf = al ? 'r2w:' + al + ':' : 'r2w:';
  return '<div class="card" style="margin-top:12px"><b>' + (al ? '🔸 حساب R2 «' + esc(al) + '»' : '🔹 حساب R2 الأساسي') + '</b>'
    + (al ? '<button class="btn s r" style="float:left" data-act="r2DelAcc" data-id="' + esc(al) + '">حذف الحساب كله</button>' : '')
    + '<p class="nt" style="margin:6px 0 0;line-height:1.9">في «محتوى الدرس» اكتب الفيديو بالشكل: <b dir="ltr">' + pf + 'folder/video.mp4</b> (رابط موقّع 6 ساعات) أو <b dir="ltr">' + wf + 'videoId/index.m3u8</b> (عن طريق Worker — حماية أقوى ويدعم HLS).</p>'
    + r2Sec(st, al, 'd', R2D, '1) الرابط الموقّع المباشر (الأبسط)', 'من Cloudflare: R2 ← Manage API Tokens ← Create API token (صلاحية Object Read) ← هتاخد Access Key ID و Secret Access Key. والـAccount ID من أول صفحة R2.')
    + r2Sec(st, al, 'w', R2W, '2) Worker محمي (للـHLS وحماية أعلى)', 'انشر ملف r2-worker.js كـWorker واربطه بالـBucket (Binding اسمه BUCKET) وحط نفس «مفتاح التوقيع» فيه كـSecret باسم TOKEN_KEY.') + '</div>';
}
function bnCard(st) {
  const libs = Object.keys(st).map(k => (k.match(/^bunny_key_(\d+)$/) || [])[1]).filter(Boolean);
  return '<div class="card" style="margin-top:16px"><b>🐰 Bunny — مكتبات / حسابات متعددة (للمالك فقط)</b><p class="nt" style="margin:6px 0 8px;line-height:1.9">كل مكتبة Bunny ليها «Token Authentication Key» خاص بيها (Stream ← المكتبة ← Security). لو عندك فيديوهات على أكتر من مكتبة أو حساب، سجّل مفتاح كل مكتبة هنا، والفيديو بيشتغل تلقائي حسب رقم المكتبة اللي في الرابط <b dir="ltr">bunny:رقم_المكتبة/معرّف_الفيديو</b>. المفتاح العام (فوق) بيتستخدم لأي مكتبة مالهاش مفتاح هنا.</p>'
    + (libs.length ? libs.map(l => '<div class="bar" style="margin:6px 0"><span class="pill ok">مكتبة <b dir="ltr">' + l + '</b> ✅ مفتاحها محفوظ</span><button class="btn s r" data-act="bnLibDel" data-id="' + l + '">حذف</button></div>').join('') : '<small style="color:var(--muted)">مفيش مكتبات مخصصة لسه — المفتاح العام بيشتغل للكل.</small>')
    + '<div class="bar" style="margin-top:10px"><input id="bnLibId" dir="ltr" inputmode="numeric" placeholder="رقم المكتبة (Library ID)" style="max-width:200px"><input id="bnLibKey" type="password" dir="ltr" autocomplete="off" placeholder="Token Authentication Key" style="flex:1;min-width:200px"><button class="btn s" data-act="bnLibAdd">➕ إضافة / تحديث</button></div></div>';
}
function r2Card(st) {
  const als = [...new Set(Object.keys(st).map(k => (k.match(/^r2a_([a-z0-9]{1,12})_/) || [])[1]).filter(Boolean))];
  return bnCard(st) + '<div class="card" style="margin-top:16px"><b>☁️ Cloudflare R2 — تخزين الفيديو (للمالك فقط)</b><p class="nt" style="margin:6px 0 0;line-height:1.9">المفاتيح بتتخزّن في قاعدة البيانات وماترجعش للمتصفح أبداً. تقدر تضيف أكتر من حساب R2 (باسم قصير إنجليزي) لو فيديوهاتك على حسابات مختلفة.</p></div>'
    + r2Acc(st, '') + als.map(a => r2Acc(st, a)).join('')
    + '<div class="card" style="margin-top:12px"><b>➕ إضافة حساب R2 تاني</b><div class="bar" style="margin-top:8px"><input id="r2NewAl" dir="ltr" maxlength="12" placeholder="اسم قصير: حروف إنجليزي صغيرة وأرقام (مثال: acc2)" style="max-width:320px"><button class="btn s" data-act="r2AddAcc">إضافة</button></div></div>';
}
const oldSettings = VIEWS.settings && VIEWS.settings[1];
VIEWS.settings = ['إعدادات المنصة', async () => { let h = oldSettings ? await oldSettings() : ''; if (!window.__perms) { try { const r = await sb.rpc('secret_status'); if (!r.error) h += r2Card(r.data || {}); } catch (e) {} } return h; }];
const secErr = e => { const m = (e && e.message) || ''; return /bad_value/.test(m) ? 'قيمة غير صحيحة — راجع الحقول' : /bad_key/.test(m) ? 'اسم غير صالح' : /forbidden/.test(m) ? 'للمالك فقط' : /does not exist|schema cache/.test(m) ? 'شغّل ملف db_32 في Supabase الأول' : m; };
Object.assign(ACT, {
  r2Save: async id => {
    const [al, kind] = id.split('|'), box = document.querySelector('[data-r2="' + al + '|' + kind + '"]'); let n = 0;
    for (const i of box.querySelectorAll('input[data-k]')) { const v = i.value.trim(); if (!v) continue; const { error } = await sb.rpc('set_secret', { p_key: i.dataset.k, p_value: v }); if (error) throw new Error(secErr(error)); n++; }
    if (!n) throw new Error('اكتب قيمة واحدة على الأقل'); toast('تم الحفظ ✅'); go('settings');
  },
  r2Gen: al => { const i = document.querySelector('[data-r2="' + al + '|w"] input[data-k$="token_key"]'); const a = new Uint8Array(24); crypto.getRandomValues(a); i.type = 'text'; i.value = Array.from(a).map(b => b.toString(16).padStart(2, '0')).join(''); toast('انسخ المفتاح ده وحطه في الـWorker كـ TOKEN_KEY ثم اضغط حفظ'); },
  r2Del: async id => {
    const [al, kind] = id.split('|'); if (!confirm('حذف الإعدادات دي؟ الفيديوهات اللي بتعتمد عليها هتقف لحد ما تحطها تاني.')) return;
    for (const k of (kind === 'w' ? R2W : R2D).map(f => r2pre(al) + f[0])) { const { error } = await sb.rpc('set_secret', { p_key: k, p_value: null }); if (error) throw new Error(secErr(error)); }
    toast('تم الحذف'); go('settings');
  },
  r2DelAcc: async al => {
    if (!confirm('حذف حساب R2 «' + al + '» بكل مفاتيحه؟')) return;
    for (const k of R2D.concat(R2W).map(f => r2pre(al) + f[0])) { const { error } = await sb.rpc('set_secret', { p_key: k, p_value: null }); if (error) throw new Error(secErr(error)); }
    toast('تم حذف الحساب'); go('settings');
  },
  r2AddAcc: async () => {
    const al = ($('#r2NewAl').value || '').trim().toLowerCase(); if (!/^[a-z0-9]{1,12}$/.test(al)) throw new Error('الاسم حروف إنجليزي صغيرة وأرقام فقط (لحد 12)');
    toast('اكتب بيانات الحساب واضغط حفظ'); const h = document.createElement('div'); h.innerHTML = r2Acc({}, al); $('#r2NewAl').closest('.card').before(h.firstChild); $('#r2NewAl').value = '';
  },
  bnLibAdd: async () => {
    const id = ($('#bnLibId').value || '').trim(), k = ($('#bnLibKey').value || '').trim(); if (!/^\d{1,10}$/.test(id)) throw new Error('رقم المكتبة أرقام فقط'); if (k.length < 8) throw new Error('اكتب مفتاح التوثيق (Token Authentication Key)');
    const { error } = await sb.rpc('set_secret', { p_key: 'bunny_key_' + id, p_value: k }); if (error) throw new Error(secErr(error)); toast('تم حفظ مفتاح المكتبة ✅'); go('settings');
  },
  bnLibDel: async id => { if (!confirm('حذف مفتاح المكتبة ' + id + '؟ (هترجع تستخدم المفتاح العام)')) return; const { error } = await sb.rpc('set_secret', { p_key: 'bunny_key_' + id, p_value: null }); if (error) throw new Error(secErr(error)); toast('تم الحذف'); go('settings'); }
});
Object.assign(ACTPERM, { r2Save: ['@admin'], r2Gen: ['@admin'], r2Del: ['@admin'], r2DelAcc: ['@admin'], r2AddAcc: ['@admin'], bnLibAdd: ['@admin'], bnLibDel: ['@admin'] });

// ---------------------------------------------------------------- تليجرام (فيديو مجاني) — للمالك فقط. Bunny و R2 زي ما هم من غير أي تغيير.
async function tgClip(t, inp) {
  try { await navigator.clipboard.writeText(t); return true; } catch (e) {}
  try { const x = inp || document.createElement('textarea'); if (!inp) { x.value = t; x.style.position = 'fixed'; x.style.opacity = '0'; document.body.appendChild(x); } x.focus(); x.select(); try { x.setSelectionRange(0, 9999); } catch (z) {} const ok = document.execCommand('copy'); if (!inp) x.remove(); return !!ok; } catch (e) { return false; }
}
const tgKeyOk = v => /^[A-Za-z0-9_-]{24,200}$/.test(v || '');
function tgStatusPill(ok) { return ok ? '<span class="pill ok">✅ محفوظ</span>' : '<span class="pill no">ناقص</span>'; }
function tgCard(st, list, listErr) {
  const rows = (list || []).map(v => '<tr><td dir="ltr"><b>tg:' + esc(v.id) + '</b></td><td>' + esc(v.title || '—') + '</td><td>' + Math.round((+v.duration || 0) / 60) + ' د</td><td>' + (+v.segments || 0) + '</td><td>' + esc(String(v.created_at || '').slice(0, 10)) + '</td>'
    + '<td style="white-space:nowrap"><button class="btn s" data-act="tgCopy" data-id="' + esc(v.id) + '">📋 نسخ الرابط</button> <button class="btn s r" data-act="tgDel" data-id="' + esc(v.id) + '">حذف</button></td></tr>').join('');
  return '<div class="card" style="margin-top:16px" id="tgBox"><b>✈️ تليجرام — فيديو مجاني ومحمي (للمالك فقط)</b>'
    + '<p class="nt" style="margin:6px 0 0;line-height:1.9">الفيديوهات بتتخزّن في قناتك الخاصة على تليجرام، وبتتشغّل عن طريق بوابتك على Cloudflare بمشغّل المنصة نفسه. الرابط بيتجدّد لكل طالب وبينتهي لوحده ومربوط بحسابه. في «محتوى الدرس» اكتب الفيديو بالشكل: <b dir="ltr">tg:معرّف-الفيديو</b> (الأداة بتطبعه لك بعد الرفع). Bunny و R2 ويوتيوب شغّالين جنبه عادي.</p>'
    + '<label>رابط البوابة (Worker) ' + tgStatusPill(st.tg_worker_base) + '</label><input data-tg="tg_worker_base" dir="ltr" autocomplete="off" placeholder="' + (st.tg_worker_base ? '(سيبه فاضي لو مش عايز تغيّره)' : 'https://leader-video.xxxx.workers.dev') + '">'
    + '<label>مفتاح التوقيع TOKEN_KEY ' + tgStatusPill(st.tg_token_key) + '</label><input data-tg="tg_token_key" type="password" dir="ltr" autocomplete="off" placeholder="' + (st.tg_token_key ? '(سيبه فاضي لو مش عايز تغيّره)' : 'ولّد مفتاح ثم انسخه للـWorker') + '">'
    + '<div class="bar" style="margin:10px 0 0"><button class="btn s" data-act="tgSave">💾 حفظ</button><button class="btn s g" data-act="tgGen">🎲 ولّد مفتاح عشوائي</button><button class="btn s g" data-act="tgCopyKey">📋 نسخ المفتاح</button><button class="btn s r" data-act="tgReset">حذف الإعدادات</button></div>'
    + '<p class="nt" style="margin:8px 0 0;line-height:1.9">⚠️ «مفتاح التوقيع» لازم يكون <b>نفس القيمة بالظبط</b> اللي هتحطها في إعدادات الـWorker باسم <b dir="ltr">TOKEN_KEY</b>. لو غيّرته هنا غيّره هناك كمان. المفتاح بعد الحفظ مابيتعرضش تاني (أمان) — فانسخه قبل ما تدوس حفظ.</p>'
    + '<div style="margin-top:12px;padding-top:10px;border-top:1px dashed var(--line)"><b>🔑 مفتاح الرفع ADMIN_KEY</b><p class="nt" style="margin:4px 0 8px;line-height:1.9">ده مفتاح تاني بيحطّه الـWorker وأداة الرفع (مش بيتخزّن في المنصة). اضغط ولّد، وانسخه في مكانين بس: إعدادات الـWorker باسم <b dir="ltr">ADMIN_KEY</b>، وأداة الرفع لما تسألك عنه.</p><div class="bar" style="margin:0"><input id="tgAdm" readonly dir="ltr" placeholder="اضغط ولّد" style="flex:1;min-width:220px"><button class="btn s g" data-act="tgGenAdmin">🎲 ولّد وانسخ</button></div></div>'
    + '<div style="margin-top:12px;padding-top:10px;border-top:1px dashed var(--line)"><b>🎞️ فيديوهات تليجرام المسجّلة (' + (list || []).length + ')</b>'
    + (listErr ? '<p class="nt" style="color:var(--danger,#ef4444)">' + esc(listErr) + '</p>' : '')
    + ((list || []).length ? '<div class="tw" style="margin-top:8px"><table><tr><th>الرابط</th><th>العنوان</th><th>المدة</th><th>القطع</th><th>التاريخ</th><th></th></tr>' + rows + '</table></div>'
      : '<p class="nt" style="margin-top:6px">لسه مفيش فيديوهات. ارفع أول فيديو بأداة الرفع وهيظهر هنا.</p>')
    + '<p class="nt" style="margin:8px 0 0;line-height:1.9">«حذف» هنا بيمنع الفيديو من التشغيل في المنصة فقط، والقطع المشفّرة بتفضل في قناتك على تليجرام.</p></div></div>';
}
const oldSettings2 = VIEWS.settings && VIEWS.settings[1];
VIEWS.settings = ['إعدادات المنصة', async () => {
  let h = oldSettings2 ? await oldSettings2() : '';
  if (!window.__perms) {
    try {
      const r = await sb.rpc('secret_status'); let list = [], le = '';
      if (!r.error) { const l = await sb.rpc('tg_list'); if (l.error) le = /does not exist|schema cache|Could not find/.test(l.error.message || '') ? 'شغّل ملف db_48_tg_video.sql في Supabase الأول' : (l.error.message || ''); else list = l.data || []; h += tgCard(r.data || {}, list, le); }
    } catch (e) {}
  }
  return h;
}];
Object.assign(ACT, {
  tgSave: async () => {
    const box = $('#tgBox'); let n = 0;
    for (const i of box.querySelectorAll('input[data-tg]')) {
      const v = i.value.trim(); if (!v) continue;
      if (i.dataset.tg === 'tg_worker_base' && !/^https:\/\/[A-Za-z0-9.-]+(:[0-9]+)?$/.test(v.replace(/\/$/, ''))) throw new Error('رابط البوابة لازم يبدأ بـ https:// ومن غير / في الآخر');
      if (i.dataset.tg === 'tg_token_key' && !tgKeyOk(v)) throw new Error('مفتاح التوقيع: حروف إنجليزي وأرقام و - _ فقط، من 24 حرف لـ 200');
      const { error } = await sb.rpc('set_secret', { p_key: i.dataset.tg, p_value: i.dataset.tg === 'tg_worker_base' ? v.replace(/\/$/, '') : v }); if (error) throw new Error(secErr(error)); n++;
    }
    if (!n) throw new Error('اكتب قيمة واحدة على الأقل'); toast('تم الحفظ ✅'); go('settings');
  },
  tgGen: async () => { const i = document.querySelector('#tgBox input[data-tg="tg_token_key"]'); const a = new Uint8Array(24); crypto.getRandomValues(a); i.type = 'text'; i.value = Array.from(a).map(b => b.toString(16).padStart(2, '0')).join(''); const ok = await tgClip(i.value, i); toast(ok ? 'اتولّد واتنسخ ✅ — الصقه في الـWorker باسم TOKEN_KEY، وبعدين اضغط حفظ' : 'اتولّد — دوس مطوّل على المفتاح وانسخه، أو دوس «📋 نسخ المفتاح»'); },
  tgCopyKey: async () => { const i = document.querySelector('#tgBox input[data-tg="tg_token_key"]'); if (!i || !i.value.trim()) { toast('ولّد مفتاح الأول'); return; } i.type = 'text'; const ok = await tgClip(i.value, i); toast(ok ? 'اتنسخ ✅' : 'دوس مطوّل على المفتاح وانسخه'); },
  tgGenAdmin: async () => { const i = $('#tgAdm'); const a = new Uint8Array(24); crypto.getRandomValues(a); i.value = Array.from(a).map(b => b.toString(16).padStart(2, '0')).join(''); const ok = await tgClip(i.value, i); toast(ok ? 'اتولّد واتنسخ ✅ — الصقه في Worker باسم ADMIN_KEY' : 'اتولّد — دوس مطوّل على المفتاح وانسخه'); },
  tgReset: async () => {
    if (!confirm('حذف إعدادات تليجرام؟ فيديوهات تليجرام هتقف لحد ما تحطها تاني.')) return;
    for (const k of ['tg_worker_base', 'tg_token_key']) { const { error } = await sb.rpc('set_secret', { p_key: k, p_value: null }); if (error) throw new Error(secErr(error)); }
    toast('تم الحذف'); go('settings');
  },
  tgCopy: async id => { const t = 'tg:' + id; try { await navigator.clipboard.writeText(t); toast('اتنسخ ✅ ' + t); } catch (e) { prompt('انسخ الرابط:', t); } },
  tgDel: async id => {
    if (!confirm('حذف الفيديو tg:' + id + ' من المنصة؟ أي درس بيستخدمه هيقف.')) return;
    const { error } = await sb.rpc('tg_delete', { p_id: id }); if (error) throw new Error(secErr(error)); toast('تم الحذف'); go('settings');
  }
});
Object.assign(ACTPERM, { tgSave: ['@admin'], tgGen: ['@admin'], tgGenAdmin: ['@admin'], tgCopyKey: ['@admin'], tgReset: ['@admin'], tgCopy: ['@admin'], tgDel: ['@admin'] });

// ---------------------------------------------------------------- حالات حساب الطالب: إيقاف مؤقت / إيقاف نهائي / حظر / حذف
const ST_L = { active: ['ok', 'نشط'], suspended: ['warn', 'موقوف مؤقتاً'], stopped: ['no', 'موقوف'], banned: ['no', 'محظور'] };
const stOf = s => s.account_status || (s.is_blocked ? 'stopped' : 'active');
window.stPill = s => { const st = stOf(s), l = ST_L[st] || ST_L.active; return '<span class="pill ' + l[0] + '" title="' + esc(s.status_reason || '') + '">' + l[1] + (st === 'suspended' && s.suspended_until ? ' حتى ' + fdate(s.suspended_until) : '') + '</span>'; };
const stErr = e => { const m = (e && e.message) || ''; return /cannot_staff/.test(m) ? 'مينفعش تطبّق ده على مسؤول/عضو فريق' : /cannot_self/.test(m) ? 'مينفعش على حسابك' : /forbidden/.test(m) ? 'مفيش عندك صلاحية' : /bad_until/.test(m) ? 'حدد مدة صحيحة' : /does not exist|schema cache|could not find/i.test(m) ? 'شغّل ملف db_32 في Supabase الأول' : m; };
window.stBtns = (s, id) => {
  const st = stOf(s), b = (a, c, t) => '<button class="btn s ' + c + '" data-act="' + a + '" data-id="' + id + '">' + t + '</button>';
  return (st === 'active' ? b('stSusp', '', '⏸ إيقاف مؤقت') + b('stStop', 'r', '⛔ إيقاف نهائي') + b('stBan', 'r', '🚫 حظر') : b('stActive', '', '✅ تفعيل الحساب') + (st === 'suspended' ? b('stStop', 'r', '⛔ حوّله لإيقاف نهائي') : '') + (st !== 'banned' ? b('stBan', 'r', '🚫 حظر') : ''))
    + b('kick', 'g', 'طرد من الجهاز الحالي') + b('stReport', '', '🧾 تقرير متابعة PDF') + b('grStudent', 'g', '📊 متابعته (سمع كام)') + b('stDelete', 'r', '🗑 حذف الحساب');
};
async function stSet(id, status, until, reason, msg) {
  const { error } = await sb.rpc('set_account_status', { p_student: id, p_status: status, p_until: until || null, p_reason: reason || null }); if (error) throw new Error(stErr(error));
  const s = S.students.find(x => x.id === id); if (s) { s.account_status = status; s.is_blocked = status !== 'active'; s.suspended_until = status === 'suspended' ? until : null; s.status_reason = status === 'active' ? null : (reason || null); }
  toast(msg); if (s) studentModal(id); if ($('#st')) drawStudents();
}
Object.assign(ACT, {
  stSusp: id => {
    const s = S.students.find(x => x.id === id);
    modal('⏸ إيقاف مؤقت — ' + fname(s), '<form><p class="nt" style="line-height:1.9">الحساب هيتقفل ويتطرد من أي جهاز، ويتفتح لوحده بعد المدة. (لما الطالب يحاول يدخل بعد انتهاء المدة بيدخل عادي).</p><label>مدة الإيقاف</label><select name="d"><option value="0.0417">ساعة</option><option value="0.25">6 ساعات</option><option value="1" selected>يوم</option><option value="3">3 أيام</option><option value="7">أسبوع</option><option value="14">أسبوعين</option><option value="30">شهر</option></select><label>السبب (اختياري — بيظهر للإدارة بس)</label><input name="r" maxlength="300"><div class="bar" style="margin-top:12px"><button class="btn">⏸ إيقاف</button></div></form>',
      async fd => { const until = new Date(Date.now() + (+fd.get('d')) * 86400000).toISOString(); await stSet(id, 'suspended', until, fd.get('r'), 'تم الإيقاف المؤقت ✅'); });
  },
  stStop: id => { const s = S.students.find(x => x.id === id); const r = prompt('إيقاف نهائي لحساب ' + fname(s) + ' (بيتفتح لما إنت تفعّله)\nالسبب (اختياري):', ''); if (r === null) return; return stSet(id, 'stopped', null, r, 'تم الإيقاف ✅'); },
  stBan: id => { const s = S.students.find(x => x.id === id); const r = prompt('🚫 حظر ' + fname(s) + '\nالحظر بيوقف الحساب ويمنع نفس الإيميل ورقم الموبايل من التسجيل تاني.\nالسبب (اختياري):', ''); if (r === null) return; return stSet(id, 'banned', null, r, 'تم الحظر ✅'); },
  stActive: id => stSet(id, 'active', null, null, 'تم تفعيل الحساب ✅'),
  block: id => { const s = S.students.find(x => x.id === id); return stOf(s) === 'active' ? ACT.stStop(id) : ACT.stActive(id); },
  stDelete: id => {
    const s = S.students.find(x => x.id === id);
    modal('🗑 حذف حساب — ' + fname(s), '<form><p class="nt" style="line-height:1.9">هيتمسح الحساب وكل بياناته نهائياً (التقدم، النتايج، الملاحظات، الاشتراكات) ومش هتقدر ترجعه.<br><b>الطالب يقدر يعمل حساب جديد بنفس الإيميل والرقم عادي</b> (إلا لو اخترت الحظر تحت).</p><label style="display:flex;gap:8px;align-items:center"><input type="checkbox" name="ban" style="width:auto"> احظر الإيميل والرقم بعد الحذف (ما يعرفش يسجّل تاني)</label><label>السبب (اختياري)</label><input name="r" maxlength="300"><div class="bar" style="margin-top:12px"><button class="btn r">🗑 احذف نهائياً</button></div></form>',
      async fd => {
        if (!confirm('تأكيد أخير: حذف ' + fname(s) + ' نهائياً؟')) return;
        const { error } = await sb.rpc('admin_delete_student', { p_student: id, p_ban: !!fd.get('ban'), p_reason: fd.get('r') || null }); if (error) throw new Error(stErr(error));
        S.students = S.students.filter(x => x.id !== id); S.enr = (S.enr || []).filter(e => e.student_id !== id); closeModal(); toast('تم حذف الحساب ✅'); if ($('#st')) drawStudents(); if ($('#grBody')) grLoad(true);
      });
  },
  bnList: async () => {
    const { data, error } = await sb.rpc('banned_list'); if (error) throw new Error(stErr(error));
    modal('🚫 الإيميلات والأرقام المحظورة', (data || []).length ? '<table><tr><th>الاسم</th><th>الإيميل</th><th>الرقم</th><th>السبب</th><th></th></tr>' + data.map(b => '<tr><td>' + esc(b.name || '—') + '</td><td dir="ltr">' + esc(b.email || '') + '</td><td dir="ltr">' + esc(b.phone || '') + '</td><td>' + esc(b.reason || '') + '</td><td><button class="btn s g" data-act="bnRm" data-id="' + b.id + '">فك الحظر</button></td></tr>').join('') + '</table>' : '<div class="empty">مفيش حد محظور</div>');
  },
  bnRm: async id => { const { error } = await sb.rpc('banned_remove', { p_id: id }); if (error) throw new Error(stErr(error)); toast('تم فك الحظر'); ACT.bnList(); }
});
Object.assign(ACTPERM, { stSusp: ['students.block'], stStop: ['students.block'], stBan: ['students.block'], stActive: ['students.block'], stDelete: ['students.delete'], bnList: ['students.block'], bnRm: ['students.block'], grStudent: ['students.view'] });

// ---------------------------------------------------------------- «الصفوف»: صف ← طلاب ← كورسات ← دروس ← سمع كام من كام
const GR = { y: '', q: '', sort: 'name', st: '', data: null, open: {}, det: {}, lim: 60 };
(function () {
  const st = document.createElement('style');
  st.textContent = '.grs{padding:0;margin-bottom:10px;overflow:hidden}.grh{display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;padding:12px 16px;cursor:pointer}.grh:hover{background:rgba(239,68,68,.04)}.grh .nm{font-weight:900;min-width:0;overflow-wrap:anywhere}.grh .nm small{display:block;color:var(--muted);font-weight:600}.grm{display:flex;gap:14px;flex-wrap:wrap;align-items:center;font-size:12.5px;font-weight:800}.grm span{display:inline-flex;flex-direction:column;gap:3px;min-width:84px}.grm em{font-style:normal;color:var(--muted);font-weight:600;font-size:11px}'
    + '.grb{border-top:1px solid var(--line);padding:12px 16px;background:rgba(100,116,139,.05)}.grc{border:1px solid var(--line);background:var(--card);border-radius:14px;margin-bottom:10px}.grc>.grh{padding:10px 14px}'
    + '.gbar{height:8px;border-radius:8px;background:rgba(100,116,139,.2);overflow:hidden;position:relative;min-width:84px}.gbar i{position:absolute;top:0;bottom:0;right:0;background:linear-gradient(135deg,#ef4444,#ec4899);border-radius:8px}.gbar.ok i{background:linear-gradient(90deg,#22c55e,#16a34a)}.gbar.cv i{border-radius:2px}'
    + '.gli{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:8px 0;border-bottom:1px dashed var(--line);font-size:13px}.gli:last-child{border:0}.gli .t{min-width:0;overflow-wrap:anywhere;flex:1 1 220px;font-weight:700}.gli .r{display:flex;gap:10px;align-items:center;flex:0 1 300px;min-width:200px;justify-content:flex-end;font-weight:800}.gli .r .gbar{flex:1}'
    + '.gll{font-weight:900;margin:10px 0 4px}';
  document.head.appendChild(st);
})();
const grT = s => { s = Math.max(0, Math.floor(+s || 0)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), c = s % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(c).padStart(2, '0'); };
const grP = (a, b) => b > 0 ? Math.min(100, Math.round(a * 100 / b)) : 0;
const grBar = (p, cls) => '<div class="gbar ' + (cls || '') + (p >= 90 ? ' ok' : '') + '"><i style="width:' + p + '%"></i></div>';
function grSum(s) {
  const c = s.courses || [], t = k => c.reduce((a, x) => a + (+x[k] || 0), 0), last = c.map(x => x.last_at).filter(Boolean).sort().pop() || null;
  return { courses: c.length, lessons: t('lessons'), ldone: t('lessons_done'), videos: t('videos'), heard: t('heard'), cov: t('cov_sec'), dur: t('dur_sec'), last };
}
async function grLoad(force) {
  const box = $('#grBody'); if (!box) return;
  if (!GR.data || GR.data.y !== GR.y || force) {
    box.innerHTML = '<div class="empty">⏳ جاري تحميل طلاب ' + esc(GR.y) + '...</div>';
    try { sb.rpc('account_gate', { p_all: true }); } catch (e) {}
    const { data, error } = await sb.rpc('grade_overview', { p_year: GR.y });
    if (error) { box.innerHTML = '<div class="empty">⚠️ ' + esc(/does not exist|schema cache|could not find/i.test(error.message || '') ? 'شغّل ملف db_32 في Supabase الأول' : /forbidden/.test(error.message || '') ? 'مفيش عندك صلاحية' : error.message) + '</div>'; return; }
    GR.data = { y: GR.y, list: data || [] }; GR.det = {};
  }
  grDraw();
}
function grDraw() {
  const box = $('#grBody'); if (!box || !GR.data) return;
  const all = GR.data.list.map(s => Object.assign({ _s: grSum(s) }, s)), q = GR.q.trim().toLowerCase();
  let l = all.filter(s => (!GR.st || (s.status || 'active') === GR.st) && (!q || (s.name + ' ' + s.phone + ' ' + s.parent_phone + ' ' + s.email).toLowerCase().includes(q)));
  const key = { name: (a, b) => (a.name || '').localeCompare(b.name || '', 'ar'), prog: (a, b) => grP(b._s.heard, b._s.videos) - grP(a._s.heard, a._s.videos), low: (a, b) => grP(a._s.heard, a._s.videos) - grP(b._s.heard, b._s.videos), last: (a, b) => String(b._s.last || '').localeCompare(String(a._s.last || '')), idle: (a, b) => String(a._s.last || '').localeCompare(String(b._s.last || '')) }[GR.sort] || null;
  if (key) l.sort(key);
  const T = all.reduce((a, s) => { a.v += s._s.videos; a.h += s._s.heard; a.c += s._s.cov; return a; }, { v: 0, h: 0, c: 0 }), act = all.filter(s => s._s.last && Date.now() - new Date(s._s.last) < 7 * 86400000).length;
  const card = (n, t) => '<div class="card" style="text-align:center;padding:12px"><b style="font-size:22px;display:block">' + n + '</b><small style="color:var(--muted);font-weight:700">' + t + '</small></div>';
  box.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-bottom:14px">' + card(all.length, 'طالب في الصف') + card(act, 'نشط آخر 7 أيام') + card(grP(T.h, T.v) + '%', 'فيديوهات اتسمعت (إجمالي)') + card(Math.round(T.c / 3600 * 10) / 10 + ' س', 'ساعات سماع فعلية') + '</div>'
    + '<div class="bar" style="margin-bottom:12px"><input id="grq" placeholder="🔍 اسم / هاتف / إيميل" value="' + esc(GR.q) + '" style="flex:1;min-width:180px"><select id="grsort"><option value="name">ترتيب: بالاسم</option><option value="prog">الأكتر سماعاً</option><option value="low">الأقل سماعاً</option><option value="last">آخر نشاط</option><option value="idle">الأقدم نشاطاً (الغايبين)</option></select><select id="grst"><option value="">كل الحالات</option><option value="active">نشط</option><option value="suspended">موقوف مؤقتاً</option><option value="stopped">موقوف</option><option value="banned">محظور</option></select><button class="btn s g" data-act="grCsv">⬇️ Excel/CSV</button><button class="btn s g" data-act="bnList">🚫 المحظورين</button><span style="color:var(--muted);font-weight:700">' + l.length + ' طالب</span></div>'
    + (l.slice(0, GR.lim).map(s => grRow(s)).join('') || '<div class="empty">لا يوجد طلاب</div>') + (l.length > GR.lim ? '<div style="text-align:center"><button class="btn s" data-act="grMore">عرض ' + Math.min(60, l.length - GR.lim) + ' كمان (باقي ' + (l.length - GR.lim) + ')</button></div>' : '');
  $('#grsort').value = GR.sort; $('#grst').value = GR.st;
  $('#grq').oninput = e => { GR.q = e.target.value; GR.lim = 60; clearTimeout(GR.t); GR.t = setTimeout(() => { grDraw(); const i = $('#grq'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }, 250); };
  $('#grsort').onchange = e => { GR.sort = e.target.value; grDraw(); }; $('#grst').onchange = e => { GR.st = e.target.value; GR.lim = 60; grDraw(); };
}
function grRow(s) {
  const m = s._s, p = grP(m.heard, m.videos), open = GR.open[s.id];
  return '<div class="card grs"><div class="grh" data-act="grS" data-id="' + s.id + '"><div class="nm">' + (open ? '▾ ' : '▸ ') + esc(s.name) + '<small dir="ltr" style="text-align:right">' + esc(s.phone) + ' • ' + esc(s.parent_phone || '') + '</small></div>'
    + '<div class="grm"><span>🎬 سمع ' + m.heard + ' من ' + m.videos + grBar(p) + '</span><span>📚 دروس ' + m.ldone + '/' + m.lessons + '</span><span>⏱ ' + (m.cov ? grT(m.cov) : '—') + '<em>مدة سماع فعلية</em></span><span>' + (m.last ? fdate(m.last) : 'لم يدخل') + '<em>آخر نشاط</em></span>' + window.stPill({ account_status: s.status, suspended_until: s.until }) + '</div></div>'
    + (open ? '<div class="grb">' + grBody(s) + '</div>' : '') + '</div>';
}
function grBody(s) {
  const cs = s.courses || [];
  return '<div class="bar" style="margin-bottom:10px"><button class="btn s" data-act="student" data-id="' + s.id + '">إدارة الحساب</button><button class="btn s g" data-act="stReport" data-id="' + s.id + '">🧾 تقرير PDF</button></div>'
    + (cs.length ? cs.map(c => {
      const k = s.id + '|' + c.id, o = GR.open[k], p = grP(c.heard, c.videos);
      return '<div class="grc"><div class="grh" data-act="grC" data-id="' + k + '"><div class="nm">' + (o ? '▾ ' : '▸ ') + '📚 ' + esc(c.title) + '</div><div class="grm"><span>🎬 سمع ' + c.heard + ' من ' + c.videos + grBar(p) + '</span><span>دروس ' + c.lessons_done + '/' + c.lessons + '</span><span>⏱ ' + (c.cov_sec ? grT(c.cov_sec) + ' من ' + grT(c.dur_sec) : '—') + '</span></div></div>' + (o ? '<div class="grb" id="grd-' + s.id + '-' + c.id + '">' + grLessons(s.id, c.id) + '</div>' : '') + '</div>';
    }).join('') : '<div class="empty">الطالب مش مشترك في أي كورس</div>');
}
function grLessons(sid, cid) {
  const d = GR.det[sid]; if (!d) return '<div class="empty">⏳ جاري التحميل...</div>';
  const c = (d.courses || []).find(x => x.id === cid); if (!c) return '<div class="empty">لا توجد بيانات</div>';
  const need = d.need_pct || 90;
  return (c.lessons || []).map(l => '<div class="gll">' + (l.done ? '✅' : '◻️') + ' ' + esc(l.title) + '</div>' + ((l.items || []).map(i => {
    if (i.kind === 'video') {
      const hasD = i.duration > 0, p = hasD ? grP(i.covered || 0, i.duration) : 0, heard = hasD ? p >= need : i.done;
      const rg = hasD && Array.isArray(i.ranges) ? i.ranges.map(r => '<i style="right:' + (r[0] * 100 / i.duration).toFixed(2) + '%;width:' + Math.max(0.5, (r[1] - r[0]) * 100 / i.duration).toFixed(2) + '%"></i>').join('') : '';
      return '<div class="gli"><span class="t">🎬 ' + esc(i.title) + '</span><span class="r">' + (hasD ? '<span>سمع ' + grT(i.covered || 0) + ' من ' + grT(i.duration) + ' (' + p + '%)</span><div class="gbar cv' + (heard ? ' ok' : '') + '">' + rg + '</div>' : (i.done ? '<span>✅ اتعلّم مكتمل (بدون تتبّع مدة)</span>' : i.opens ? '<span>◐ فتحه فقط</span>' : '<span style="color:var(--muted)">لم يشاهد</span>')) + '<span>' + (heard ? '✅' : '❌') + '</span></span></div>';
    }
    return '<div class="gli"><span class="t">' + (i.kind === 'pdf' ? '📄 ' : '🔗 ') + esc(i.title) + '</span><span class="r"><span>' + (i.done ? '✅ تم' : '—') + '</span></span></div>';
  }).join('')) + ((l.quizzes || []).map(q => { const b = q.best; return '<div class="gli"><span class="t">' + (q.hw ? '📚 ' : '📝 ') + esc(q.title) + '</span><span class="r"><span>' + (b ? b.score + ' / ' + b.total + (b.status === 'pending' ? ' (بانتظار التصحيح)' : '') : 'لم يُحل') + '</span></span></div>'; }).join(''))).join('') || '<div class="empty">لا توجد دروس</div>';
}
async function grDet(sid) {
  if (GR.det[sid]) return;
  const { data, error } = await sb.rpc('grade_student_detail', { p_student: sid }); if (error) throw new Error(stErr(error)); GR.det[sid] = data || { courses: [] };
}
function grRefresh() { grDraw(); }
Object.assign(ACT, {
  grY: id => { GR.y = id; GR.q = ''; GR.lim = 60; GR.open = {}; document.querySelectorAll('.yt').forEach(b => b.classList.toggle('on', b.dataset.id === id)); grLoad(); },
  grS: id => { GR.open[id] = !GR.open[id]; grDraw(); },
  grC: async id => { const [sid] = id.split('|'); GR.open[id] = !GR.open[id]; grDraw(); if (GR.open[id] && !GR.det[sid]) { await grDet(sid); grDraw(); } },
  grMore: () => { GR.lim += 60; grDraw(); },
  grCsv: () => {
    if (!GR.data) return; const rows = [['الصف', 'الطالب', 'هاتف الطالب', 'هاتف ولي الأمر', 'الحالة', 'الكورس', 'دروس مكتملة', 'إجمالي الدروس', 'فيديوهات اتسمعت', 'إجمالي الفيديوهات', 'مدة السماع (دقيقة)', 'مدة الفيديوهات المتتبعة (دقيقة)', 'آخر نشاط']];
    GR.data.list.forEach(s => { const cs = s.courses || []; if (!cs.length) rows.push([GR.y, s.name, s.phone, s.parent_phone, s.status, '', '', '', '', '', '', '', '']); cs.forEach(c => rows.push([GR.y, s.name, s.phone, s.parent_phone, s.status, c.title, c.lessons_done, c.lessons, c.heard, c.videos, Math.round((c.cov_sec || 0) / 60), Math.round((c.dur_sec || 0) / 60), c.last_at ? String(c.last_at).slice(0, 10) : ''])); });
    dl('class-' + GR.y + '-' + stamp() + '.csv', '﻿' + rows.map(r => r.map(csvq).join(',')).join('\n'), 'text/csv;charset=utf-8');
  },
  grStudent: async id => {
    const s = S.students.find(x => x.id === id); closeModal();
    GR.y = s ? s.academic_year : GR.y; GR.open[id] = true; GR.q = s ? fname(s) : ''; GR.data = null; await go('grades');
  }
});
Object.assign(ACTPERM, { grY: ['students.view'], grS: ['students.view'], grC: ['students.view'], grMore: ['students.view'], grCsv: ['students.view'], grRefresh: ['students.view'] });
VIEWS.grades = ['الصفوف', async () => {
  GR.y = GR.y || YEARS[0]; try { await loadStudents(); } catch (e) {} setTimeout(() => grLoad(true));
  return '<div class="note" style="margin:0 0 14px">🏫 اختار الصف ← هتلاقي طلابه ← افتح الطالب ← كورساته ← افتح الكورس ← دروسه وكل فيديو سمع منه قد إيه (مدة السماع الفعلية، حتى لو شغّل بسرعة x2).</div>'
    + '<div class="bar" style="margin-bottom:12px;flex-wrap:wrap">' + YEARS.map(y => '<button class="yt' + (y === GR.y ? ' on' : '') + '" data-act="grY" data-id="' + y + '">' + y + '</button>').join('') + '</div><div id="grBody"></div>';
}];
VPERM.grades = ['students.view'];

// ---------------------------------------------------------------- النشاط المباشر
const LV = { timer: null };
const mmss = s => { s = Math.max(0, Math.round(s)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
function liveHTML(L) {
  const ex = L.in_exam || [], on = L.online || [], now = new Date(L.now).getTime();
  return '<div class="v5k"><div class="kk"><i>🟢</i><b>' + nf(L.online_count) + '</b><span>أونلاين دلوقتي (آخر 3 دقايق)</span></div><div class="kk' + (ex.length ? ' hot' : '') + '"><i>📝</i><b>' + nf(ex.length) + '</b><span>جوه امتحان دلوقتي</span></div><div class="kk"><i>✅</i><b>' + nf(L.today.attempts) + '</b><span>محاولات اتسلّمت النهاردة</span></div><div class="kk"><i>🆕</i><b>' + nf(L.today.signups) + '</b><span>تسجيلات جديدة النهاردة</span></div></div>'
    + '<h3 class="v5h">📝 جوه امتحان دلوقتي</h3><div class="card">' + (ex.map(x => { const p = x.total ? Math.round(x.answered / x.total * 100) : 0, left = x.ends_at ? (new Date(x.ends_at).getTime() - now) / 1000 : null;
      return '<div class="v5row"><span class="nm">' + esc(x.name) + ' <small>' + esc(x.year || '') + '</small><br><small>' + esc(x.quiz) + '</small></span><div style="flex:1 1 150px;min-width:120px"><div class="v5g" style="margin:0"><i style="width:' + p + '%"></i></div><small>' + x.answered + ' / ' + x.total + ' سؤال</small></div>'
        + (left != null ? '<span class="pill' + (left < 120 ? ' no' : '') + '" dir="ltr">⏱ ' + mmss(left) + '</span>' : '<span class="pill">بدون وقت</span>') + (x.violations ? '<span class="pill no">⚠️ ' + x.violations + ' مخالفة</span>' : '') + '</div>'; }).join('') || '<div class="empty" style="padding:18px">مفيش حد بيمتحن دلوقتي</div>') + '</div>'
    + '<h3 class="v5h">🟢 الطلاب الأونلاين</h3><div class="card">' + (on.map(x => '<div class="v5row"><span class="nm">' + esc(x.name) + ' <small>' + esc(x.year || '') + '</small></span><small dir="ltr">' + esc(x.phone || '') + '</small><small>من ' + Math.max(0, Math.round((now - new Date(x.seen_at).getTime()) / 1000)) + ' ثانية</small></div>').join('') || '<div class="empty" style="padding:18px">مفيش حد أونلاين</div>') + '</div><p class="nt" style="margin-top:10px">بتتحدّث تلقائياً كل 10 ثواني.</p>';
}
async function vLive() {
  clearInterval(LV.timer);
  const { data, error } = await sb.rpc('live_activity'); if (error) throw new Error(errMsg(error));
  LV.timer = setInterval(async () => { if (window.__cur !== 'live') return clearInterval(LV.timer); if (document.hidden) return; try { const r = await sb.rpc('live_activity'); const b = $('#liveBox'); if (b && r.data) b.innerHTML = liveHTML(r.data); } catch (e) {} }, 10000);
  return '<div id="liveBox">' + liveHTML(data) + '</div>';
}
VIEWS.live = ['النشاط المباشر', vLive];

// ---------------------------------------------------------------- نظرة عامة محسّنة
const oldOverview = VIEWS.overview && VIEWS.overview[1];
async function vOverview5() {
  let st, pc;
  try { [st, pc] = await Promise.all([sb.rpc('overview_stats'), sb.rpc('admin_pending_counts').then(r => r.data || {}, () => ({}))]); if (st.error || !st.data) throw (st.error || new Error('no_data')); st = st.data; }
  catch (e) { return oldOverview ? oldOverview() : '<div class="empty">تعذر التحميل</div>'; }
  const kk = (ic, n, l, go, hot) => '<div class="kk' + (hot ? ' hot' : '') + '"' + (go ? ' data-go="' + go + '"' : '') + '><i>' + ic + '</i><b>' + n + '</b><span>' + l + '</span></div>';
  const pub = (S.courses || []).filter(c => c.is_published).length;
  const att = [[pc.support, '💬', 'محادثة دعم محتاجة رد', 'support'], [st.open_academic, '📘', 'سؤال علمي لسه ما اتحلش', 'support_ac'], [pc.essay, '✍️', 'إجابة مقالية مستنية تصحيحك', 'essay'], [pc.release, '🎓', 'امتحان نتيجته محتاجة اعتماد', 'sres']].filter(x => +x[0] > 0);
  const by = st.by_year || {}, mx = Math.max(1, ...YEARS.map(y => +by[y] || 0));
  const qa = [['newExam', '➕ امتحان جديد'], ['newCourse', '➕ كورس جديد'], ['newAnn', '📢 إعلان جديد']].filter(a => actAllowed(a[0])).map(a => '<button class="btn s" data-act="' + a[0] + '">' + a[1] + '</button>').join('')
    + [['banners', '🎨 اللافتات'], ['xdesign', '🧩 تصميم الأسئلة'], ['live', '📡 النشاط المباشر'], ['maint', '💾 الاستهلاك والصيانة'], ['settings', '⚙️ الإعدادات']].map(a => '<button class="btn s g" data-go="' + a[0] + '">' + a[1] + '</button>').join('');
  return '<div class="v5k">' + kk('👥', nf(st.students), 'إجمالي الطلاب (+' + nf(st.new_7d) + ' آخر 7 أيام)', 'students') + kk('🟢', nf(st.online_now), 'أونلاين دلوقتي (' + nf(st.active_24h) + ' آخر 24 ساعة)', 'live') + kk('📝', nf(st.attempts_7d), 'محاولات آخر 7 أيام' + (st.avg_pct_7d != null ? ' • متوسط ' + st.avg_pct_7d + '%' : ''), 'sres') + kk('📚', (S.courses || []).length + ' (' + pub + ' منشور)', 'الكورسات', 'courses') + kk('🗓️', nf(st.quizzes_open), 'امتحانات مفتوحة دلوقتي', 'exams') + '</div>'
    + '<div class="v5grid2"><div class="card"><b>🚨 محتاج انتباهك</b>' + (att.map(a => '<div class="v5row"><span style="font-size:20px">' + a[1] + '</span><span class="nm"><b>' + nf(a[0]) + '</b> ' + a[2] + '</span><button class="btn s" data-go="' + a[3] + '">افتح</button></div>').join('') || '<div class="empty" style="padding:18px">🎉 مفيش حاجة معلّقة</div>') + '</div>'
    + '<div class="card"><b>⚡ اختصارات سريعة</b><div class="bar" style="margin:10px 0 0">' + qa + '</div><p class="nt" style="margin:12px 0 0">💡 اضغط <b>Ctrl + K</b> في أي صفحة عشان تدوّر على أي طالب أو امتحان أو تبويب فوراً.</p></div></div>'
    + '<h3 class="v5h">الطلاب حسب الصف</h3><div class="card">' + YEARS.map(y => '<div class="v5row"><span class="nm">' + esc(y) + '</span><div style="flex:1 1 200px"><div class="v5g" style="margin:0"><i style="width:' + ((+by[y] || 0) / mx * 100) + '%"></i></div></div><b style="min-width:44px;text-align:left">' + nf(by[y] || 0) + '</b></div>').join('') + '</div>';
}
VIEWS.overview = ['نظرة عامة', vOverview5];

// ---------------------------------------------------------------- بحث شامل + قائمة أوامر (Ctrl+K)
const norm = s => String(s == null ? '' : s).toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه');
const PAL = { open: false, sel: 0, list: [], students: null, exams: null, q: '' };
async function palData() {
  if (!PAL.students) { PAL.students = []; try { await loadStudents(); PAL.students = (S.students || []).map(s => ({ id: s.id, t: fname(s), p: s.phone_number || '', y: s.academic_year || '', k: norm([fname(s), s.phone_number, s.parent_phone, s.email].join(' ')) })); } catch (e) {} }
  if (!PAL.exams) { PAL.exams = []; try { const r = await sb.from('quizzes').select('id,title,kind').order('created_at', { ascending: false }).limit(500); PAL.exams = (r.data || []).map(x => ({ id: x.id, t: x.title, k: norm(x.title) })); } catch (e) {} }
}
function palItems(q) {
  const n = norm(q.trim()), out = [];
  const tabs = (typeof NAV !== 'undefined' ? NAV : []).filter(x => !x[0].startsWith('x') || x[0] === 'xdesign').map(x => ({ g: 'تبويبات', t: x[1] + ' ' + x[2], s: 'فتح التبويب', k: norm(x[2]), run: () => go(x[0]) }));
  const acts = [['newExam', '➕ امتحان جديد', () => ACT.newExam()], ['newCourse', '➕ كورس جديد', () => ACT.newCourse()], ['newAnn', '📢 إعلان جديد', () => ACT.newAnn()]].filter(a => ACT[a[0]] && actAllowed(a[0])).map(a => ({ g: 'أوامر', t: a[1], s: 'تنفيذ', k: norm(a[1]), run: a[2] }));
  const all = acts.concat(tabs);
  if (!n) return all.slice(0, 12);
  all.filter(x => x.k.includes(n)).slice(0, 6).forEach(x => out.push(x));
  if (n.length >= 2) {
    (PAL.students || []).filter(s => s.k.includes(n)).slice(0, 7).forEach(s => out.push({ g: 'طلاب', t: '👤 ' + s.t, s: s.p + ' • ' + s.y, run: () => { if (typeof studentModal === 'function') studentModal(s.id); } }));
    (PAL.exams || []).filter(x => x.k.includes(n)).slice(0, 6).forEach(x => out.push({ g: 'امتحانات', t: '📝 ' + x.t, s: 'تعديل الامتحان', run: () => ACT.editExam(x.id) }));
  }
  return out;
}
function palDraw() {
  const ul = $('#cmdUl'); if (!ul) return; let last = '';
  ul.innerHTML = PAL.list.map((it, i) => (it.g !== last ? '<div class="sec">' + (last = it.g) + '</div>' : '') + '<li data-i="' + i + '" class="' + (i === PAL.sel ? 'on' : '') + '">' + esc(it.t) + '<small>' + esc(it.s || '') + '</small></li>').join('') || '<li style="pointer-events:none;color:var(--muted)">مفيش نتايج</li>';
  const on = ul.querySelector('li.on'); if (on) on.scrollIntoView({ block: 'nearest' });
}
function palClose() { const o = $('#cmdO'); if (o) o.remove(); PAL.open = false; }
function palRun(i) { const it = PAL.list[i]; if (!it) return; palClose(); try { const r = it.run(); if (r && r.catch) r.catch(fail); } catch (e) { fail(e); } }
async function palOpen() {
  if (PAL.open || !$('#app') || $('#app').hidden) return; PAL.open = true; PAL.sel = 0;
  const o = document.createElement('div'); o.className = 'v5cmd'; o.id = 'cmdO';
  o.innerHTML = '<div><input id="cmdIn" placeholder="🔎 دوّر على طالب (اسم / رقم) أو امتحان أو تبويب…" autocomplete="off"><ul id="cmdUl"></ul><div class="hn">↑ ↓ للتنقل • Enter للفتح • Esc للإغلاق</div></div>';
  document.body.appendChild(o); const inp = $('#cmdIn'); inp.focus();
  o.addEventListener('mousedown', e => { if (e.target === o) palClose(); const li = e.target.closest('li[data-i]'); if (li) { e.preventDefault(); palRun(+li.dataset.i); } });
  const upd = () => { PAL.q = inp.value; PAL.list = palItems(inp.value); PAL.sel = 0; palDraw(); };
  inp.addEventListener('input', upd);
  inp.addEventListener('keydown', e => { if (e.key === 'ArrowDown') { e.preventDefault(); PAL.sel = Math.min(PAL.sel + 1, PAL.list.length - 1); palDraw(); } else if (e.key === 'ArrowUp') { e.preventDefault(); PAL.sel = Math.max(PAL.sel - 1, 0); palDraw(); } else if (e.key === 'Enter') { e.preventDefault(); palRun(PAL.sel); } else if (e.key === 'Escape') { e.preventDefault(); palClose(); } });
  upd(); await palData(); if (PAL.open) upd();
}
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase(), typing = /^(input|textarea|select)$/i.test((e.target && e.target.tagName) || '') || (e.target && e.target.isContentEditable);
  if ((e.ctrlKey || e.metaKey) && k === 'k') { e.preventDefault(); PAL.open ? palClose() : palOpen(); }
  else if (k === '/' && !typing && !e.ctrlKey && !e.metaKey) { e.preventDefault(); palOpen(); }
  else if (k === 'escape' && PAL.open) palClose();
});
(function btnLoop() { const t = setInterval(() => { const w = $('#who'); if (!w || $('#cmdBtn') || ($('#app') && $('#app').hidden)) return; const b = document.createElement('button'); b.id = 'cmdBtn'; b.type = 'button'; b.textContent = '🔎 بحث (Ctrl+K)'; b.onclick = palOpen; w.parentNode.insertBefore(b, w.nextSibling); clearInterval(t); }, 800); })();

// ---------------------------------------------------------------- الصلاحيات + القايمة الجانبية
Object.assign(VPERM, { live: ['students.view', 'results.view'], xdesign: ['g:content'], support_ac: ['support.view'], maint: ['@admin'] });
Object.assign(ACTPERM, {
  s5Send: ['support.reply'], s5Pick: ['support.reply'], s5Solve: ['support.reply'], s5Close: ['support.close'], s5Del: ['support.delete'], s5Canned: ['support.reply'], s5CanDel: ['support.reply'],
  edSave: ['content.edit'], edReset: ['content.edit'], edPal: ['content.edit'],
  xpAdd: ['content.edit'], xpDel: ['content.edit'], xpLink: ['content.edit'],
  mtPrev: ['@admin'], mtRun: ['@admin'], bkStudents: ['@admin'], bkResults: ['@admin'], bkAll: ['@admin']
});
(function () {
  [['grades', '🏫', 'الصفوف'], ['live', '📡', 'النشاط المباشر'], ['xdesign', '🧩', 'تصميم الأسئلة'], ['support_ac', '📘', 'الدعم العلمي'], ['maint', '💾', 'الاستهلاك والصيانة']].forEach(a => { if (!NAV.some(n => n[0] === a[0])) NAV.push(a); });
  const sp = NAV.find(n => n[0] === 'support'); if (sp) { sp[1] = '🔧'; sp[2] = 'الدعم الفني'; }
  const ORDER = ['overview', 'live', 'courses', 'students', 'grades', 'access', 'codes', 'exams', 'xdesign', 'essay', 'sres', 'report', 'ann', 'banners', 'support', 'support_ac', 'devices', 'maint', 'audit', 'settings', 'admins', 'staff'];
  NAV.sort((a, b) => { const x = ORDER.indexOf(a[0]), y = ORDER.indexOf(b[0]); return (x < 0 ? 99 : x) - (y < 0 ? 99 : y); });
})();
})();

// ---------------------------------------------------------------- المحاولات والقفل (نسخة الصفوف)
// الصف ← كورس أو شامل ← الهدف (الكورس كله / درس / امتحان) ← كل طلاب الصف + إجراءات جماعية.
const AG = { y: '', mode: 'course', cid: '', tgt: '', targets: null, grid: null, q: '', f: 'all', sel: new Set(), busy: false };
const agKey = () => AG.tgt ? AG.tgt.split(':') : [null, null];
const agErr = e => { const m = (e && e.message) || ''; return /does not exist|schema cache|could not find/i.test(m) ? 'شغّل ملف db_34 في Supabase الأول' : /forbidden/.test(m) ? 'مفيش عندك صلاحية للإجراء ده' : m || 'حصل خطأ'; };
const agCourses = () => (S.courses || []).filter(c => c.academic_year === AG.y);

VIEWS.access = ['المحاولات والقفل', async () => {
  if (!S.courses) await loadCourses();
  AG.y = AG.y || YEARS[0];
  setTimeout(agRefresh);
  return '<div class="note" style="margin:0 0 14px">🔁 اختار الصف ← كورس أو امتحان شامل ← الهدف (الكورس كله / درس / امتحان) ← هتلاقي <b>كل طلاب الصف</b> وتقدر تفتح محاولة جديدة أو تقفل/تفتح لواحد أو مجموعة أو للكل.</div>'
    + '<div id="agTop"></div><div id="agBody"></div>';
}];
VPERM.access = ['g:students'];

function agTopDraw() {
  const top = $('#agTop'); if (!top) return;
  const cs = agCourses(), T = AG.targets;
  let opts = '';
  if (T) {
    const q = (k, a) => a.map(z => '<option value="quiz:' + z.id + '"' + (AG.tgt === 'quiz:' + z.id ? ' selected' : '') + '>' + esc(z.title) + (z.hw ? ' (واجب)' : '') + (z.published === false ? ' — غير منشور' : '') + (z.all ? ' 🌐🔒' : '') + '</option>').join('');
    if (AG.mode === 'course' && T.course) {
      opts += '<option value="course:' + T.course.id + '"' + (AG.tgt === 'course:' + T.course.id ? ' selected' : '') + '>📚 الكورس كله' + (T.course.all ? ' 🌐🔒' : '') + '</option>';
      const secs = {}; (T.lessons || []).forEach(l => (secs[l.section || 'الدروس'] = secs[l.section || 'الدروس'] || []).push(l));
      Object.keys(secs).forEach(k => opts += '<optgroup label="📖 ' + esc(k) + '">' + secs[k].map(l => '<option value="lesson:' + l.id + '"' + (AG.tgt === 'lesson:' + l.id ? ' selected' : '') + '>' + esc(l.title) + (l.all ? ' 🌐🔒' : '') + '</option>').join('') + '</optgroup>');
      if ((T.quizzes || []).length) opts += '<optgroup label="📝 امتحانات وواجبات الكورس">' + q('q', T.quizzes) + '</optgroup>';
    } else if (AG.mode === 'comp') {
      opts += (T.quizzes || []).length ? '<optgroup label="🎓 الامتحانات الشاملة">' + q('q', T.quizzes) + '</optgroup>' : '';
    }
  }
  top.innerHTML = '<div class="card" style="margin-bottom:14px">'
    + '<div class="bar" style="flex-wrap:wrap;margin-bottom:10px">' + YEARS.map(y => '<button class="yt' + (y === AG.y ? ' on' : '') + '" data-act="agY" data-id="' + y + '">' + y + '</button>').join('') + '</div>'
    + '<div class="bar" style="flex-wrap:wrap;margin-bottom:6px"><button class="yt' + (AG.mode === 'course' ? ' on' : '') + '" data-act="agMode" data-id="course">📚 كورس</button><button class="yt' + (AG.mode === 'comp' ? ' on' : '') + '" data-act="agMode" data-id="comp">🎓 امتحان شامل</button></div>'
    + '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px">'
    + (AG.mode === 'course' ? '<div><label>الكورس</label><select id="agCourse">' + (cs.length ? cs.map(c => '<option value="' + c.id + '"' + (c.id === AG.cid ? ' selected' : '') + '>' + esc(c.title) + '</option>').join('') : '<option value="">— مفيش كورسات للصف ده —</option>') + '</select></div>' : '')
    + '<div><label>' + (AG.mode === 'course' ? 'الهدف (كورس / درس / امتحان)' : 'الامتحان الشامل') + '</label><select id="agTgt">' + (opts || '<option value="">— مفيش —</option>') + '</select></div></div></div>';
}

async function agRefresh() {
  if (!$('#agBody')) return;
  const cs = agCourses();
  if (AG.mode === 'course' && !cs.some(c => c.id === AG.cid)) AG.cid = cs[0] ? cs[0].id : '';
  AG.targets = null; AG.grid = null; AG.sel.clear(); AG.tgt = '';
  agTopDraw();
  const body = $('#agBody');
  if (AG.mode === 'course' && !AG.cid) { body.innerHTML = '<div class="empty">مفيش كورسات للصف ' + esc(AG.y) + '</div>'; applyActGate($('#view')); return; }
  body.innerHTML = '<div class="empty">⏳ جاري التحميل...</div>';
  const { data, error } = await sb.rpc('access_targets', { p_course: AG.mode === 'course' ? AG.cid : null, p_year: AG.y });
  if (error) { body.innerHTML = '<div class="empty">⚠️ ' + esc(agErr(error)) + '</div>'; return; }
  AG.targets = data;
  AG.tgt = AG.mode === 'course' ? (data.course ? 'course:' + data.course.id : '') : ((data.quizzes || [])[0] ? 'quiz:' + data.quizzes[0].id : '');
  agTopDraw();
  if (!AG.tgt) { body.innerHTML = '<div class="empty">' + (AG.mode === 'comp' ? 'مفيش امتحانات شاملة للصف ' + esc(AG.y) : 'مفيش حاجة للعرض') + '</div>'; return; }
  await agGridLoad();
}

async function agGridLoad() {
  const body = $('#agBody'); if (!body) return;
  const [k, id] = agKey(); if (!k) return;
  AG.sel.clear();
  body.innerHTML = '<div class="empty">⏳ جاري تحميل طلاب ' + esc(AG.y) + '...</div>';
  const { data, error } = await sb.rpc('access_grid', { p_year: AG.y, p_kind: k, p_ref: id, p_course: AG.mode === 'course' ? AG.cid : null });
  if (error) { body.innerHTML = '<div class="empty">⚠️ ' + esc(agErr(error)) + '</div>'; return; }
  AG.grid = data || [];
  agDraw();
}

function agItem() {
  const T = AG.targets, [k, id] = agKey(); if (!T) return null;
  if (k === 'course') return { k, id, title: T.course.title, all: T.course.all };
  if (k === 'lesson') { const l = (T.lessons || []).find(x => x.id === id); return l && { k, id, title: l.title, all: l.all }; }
  const z = (T.quizzes || []).find(x => x.id === id); return z && { k, id, title: z.title, all: z.all, max: z.max };
}
const agRows = () => {
  const q = AG.q.trim().toLowerCase();
  return (AG.grid || []).filter(r => (AG.f === 'all' || (AG.f === 'enr' ? r.enrolled : AG.f === 'not' ? !r.enrolled : AG.f === 'lock' ? r.me : AG.f === 'pend' ? r.pending : AG.f === 'none' ? !r.used : true)) && (!q || ((r.name || '') + ' ' + (r.phone || '')).toLowerCase().includes(q)));
};
function agCount() {
  const el = $('#agCnt'); if (!el) return;
  el.textContent = AG.sel.size ? 'تم اختيار ' + AG.sel.size + ' طالب' : 'لسه ما اخترتش حد';
  const rows = agRows(), all = $('#agAll'); if (all) all.checked = rows.length > 0 && rows.every(r => AG.sel.has(r.id));
  document.querySelectorAll('.agBulk').forEach(b => b.disabled = !AG.sel.size);
}
function agDraw() {
  const body = $('#agBody'), it = agItem(); if (!body || !it || !AG.grid) return;
  const G = AG.grid, rows = agRows(), isQ = it.k === 'quiz', isL = it.k === 'lesson', isC = it.k === 'course';
  const enr = G.filter(r => r.enrolled).length, locked = G.filter(r => r.me).length, tried = G.filter(r => r.used > 0).length, pend = G.filter(r => r.pending).length;
  const head = '<div class="card" style="margin-bottom:14px"><div class="bar" style="justify-content:space-between;flex-wrap:wrap"><div><b style="font-size:16px">' + (isC ? '📚' : isL ? '📖' : '📝') + ' ' + esc(it.title) + '</b> <span class="pill">' + esc(AG.y) + '</span>' + (isQ && it.max ? ' <span class="pill">أقصى محاولات: ' + it.max + '</span>' : '') + (it.all ? ' <span class="pill no">🌐 مقفول لكل الطلاب</span>' : '') + '</div>'
    + '<div class="bar"><button class="btn s ' + (it.all ? 'g' : 'r') + '" data-act="agLockAll" data-id="' + (it.all ? 0 : 1) + '">' + (it.all ? '🔓 فتح للكل' : '🌐 قفل للكل') + '</button></div></div>'
    + '<div class="chips"><span>👥 طلاب الصف <b>' + G.length + '</b></span>' + (AG.mode === 'course' ? '<span>✅ مشتركين <b>' + enr + '</b></span>' : '') + (isQ ? '<span>📝 دخلوا الامتحان <b>' + tried + '</b></span><span>⏳ تصحيح معلّق <b>' + pend + '</b></span>' : '') + '<span>🔒 مقفول لهم <b>' + locked + '</b></span></div></div>';
  const fOpts = [['all', 'كل الطلاب'], ...(AG.mode === 'course' ? [['enr', 'المشتركين بس'], ['not', 'غير المشتركين']] : []), ['lock', 'المقفول لهم'], ...(isQ ? [['none', 'ما دخلوش'], ['pend', 'تصحيح معلّق']] : [])];
  const tool = '<div class="card" style="margin-bottom:14px"><div class="bar" style="flex-wrap:wrap;gap:8px"><input id="agQ" placeholder="🔍 ابحث بالاسم أو الرقم" value="' + esc(AG.q) + '" style="max-width:260px"><select id="agF" style="max-width:200px">'
    + fOpts.map(o => '<option value="' + o[0] + '"' + (AG.f === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select><button class="btn s g" data-act="agCsv">⬇️ Excel/CSV</button></div>'
    + '<div class="bar" style="flex-wrap:wrap;margin-top:10px;gap:8px"><b id="agCnt" style="min-width:130px"></b>'
    + '<button class="btn s g" data-act="agSelAll" data-id="1">✔ اختيار اللي ظاهر</button><button class="btn s g" data-act="agSelAll" data-id="0">✖ مسح الاختيار</button>'
    + (isQ ? '<button class="btn s agBulk" data-act="agNew" disabled>🔁 محاولة جديدة للمختارين</button>' : '')
    + '<button class="btn s r agBulk" data-act="agLock" data-id="1" disabled>🔒 قفل للمختارين</button><button class="btn s g agBulk" data-act="agLock" data-id="0" disabled>🔓 فتح للمختارين</button>'
    + (isC ? '<button class="btn s g agBulk" data-act="agReset" disabled>♻️ إعادة الكورس من البداية</button>' : '') + '</div></div>';
  const th = '<th style="width:34px"><input type="checkbox" id="agAll" data-act="agAllBox" style="width:auto"></th><th>الطالب</th><th>الرقم</th><th>الحساب</th>' + (AG.mode === 'course' ? '<th>الاشتراك</th>' : '')
    + (isQ ? '<th>المحاولات</th><th>أعلى نسبة</th><th>آخر محاولة</th>' : isL ? '<th>الإنجاز</th>' : '<th>الدروس المنجزة</th>') + '<th>القفل</th><th></th>';
  const tr = rows.slice(0, 400).map(r => {
    const mx = it.max || 1, left = isQ ? Math.max(0, mx - (r.used || 0)) : 0;
    return '<tr' + (r.enrolled ? '' : ' style="opacity:.6"') + '><td><input type="checkbox" class="agCk" data-act="agPick" data-id="' + r.id + '" style="width:auto"' + (AG.sel.has(r.id) ? ' checked' : '') + '></td>'
      + '<td><b>' + esc(r.name || '—') + '</b></td><td dir="ltr" style="color:var(--muted)">' + esc(r.phone || '') + '</td><td>' + window.stPill({ account_status: r.status || 'active' }) + '</td>'
      + (AG.mode === 'course' ? '<td>' + (r.enrolled ? '<span class="pill ok">مشترك</span>' : '<span class="pill">غير مشترك</span>') + '</td>' : '')
      + (isQ ? '<td><span class="pill' + (left === 0 && r.used ? ' no' : r.used ? ' ok' : '') + '">' + (r.used || 0) + ' / ' + mx + '</span>' + (r.pending ? ' <span class="pill warn">⏳ معلّق</span>' : '') + (r.archived ? ' <small style="color:var(--muted)">+' + r.archived + ' قديمة</small>' : '') + '</td><td>' + (r.best == null ? '—' : r.best + '%') + '</td><td>' + (r.last_at ? tfmt(r.last_at) : '—') + '</td>'
        : isL ? '<td>' + (r.done ? '<span class="pill ok">✓ خلّص</span>' : '<span class="pill">—</span>') + '</td>'
        : '<td>' + (r.lessons ? (r.lessons_done || 0) + ' / ' + r.lessons : '—') + '</td>')
      + '<td>' + (r.me ? '<span class="pill no">🔒 مقفول</span>' : '<span class="pill ok">مفتوح</span>') + '</td>'
      + '<td style="white-space:nowrap"><button class="btn s ' + (r.me ? 'g' : 'r') + '" data-act="agLockOne" data-id="' + r.id + '" data-l="' + (r.me ? 0 : 1) + '">' + (r.me ? '🔓 فتح' : '🔒 قفل') + '</button>'
      + (isQ ? ' <button class="btn s" data-act="agNewOne" data-id="' + r.id + '">🔁 محاولة</button> <button class="btn s g" data-act="agHist" data-id="' + r.id + '">📜</button>' : '')
      + (isC ? ' <button class="btn s g" data-act="grStudent" data-id="' + r.id + '">📊</button>' : '') + '</td></tr>';
  }).join('');
  body.innerHTML = head + tool + '<div class="card" style="padding:6px;overflow:auto"><table><tr>' + th + '</tr>' + (tr || '<tr><td colspan="12" class="empty">مفيش طلاب بالشكل ده</td></tr>') + '</table>'
    + (rows.length > 400 ? '<div class="empty">ظاهر أول 400 من ' + rows.length + ' — استخدم البحث</div>' : '') + '</div>';
  agCount(); applyActGate($('#view'));
}

async function agBulk(rpc, extra, ids) {
  const out = []; let n = 0;
  for (let i = 0; i < ids.length; i += 400) {
    const { data, error } = await sb.rpc(rpc, Object.assign({ p_students: ids.slice(i, i + 400) }, extra)); if (error) throw new Error(agErr(error)); n += +data || 0;
  }
  return n;
}
const agSelIds = () => [...AG.sel];
const agAfter = async msg => { toast(msg); const t = $('#agBody') ? $('#agBody').scrollTop : 0; await agGridLoadKeep(); };
async function agGridLoadKeep() {
  const [k, id] = agKey(); if (!k) return; const y = window.scrollY;
  const { data, error } = await sb.rpc('access_grid', { p_year: AG.y, p_kind: k, p_ref: id, p_course: AG.mode === 'course' ? AG.cid : null });
  if (error) throw new Error(agErr(error));
  AG.grid = data || []; const keep = new Set(AG.grid.map(r => r.id)); AG.sel = new Set([...AG.sel].filter(x => keep.has(x)));
  const tg = await sb.rpc('access_targets', { p_course: AG.mode === 'course' ? AG.cid : null, p_year: AG.y }); if (!tg.error) AG.targets = tg.data;
  agDraw(); window.scrollTo(0, y);
}

document.addEventListener('change', e => {
  const t = e.target; if (!t || !t.id) return;
  if (t.id === 'agCourse') { AG.cid = t.value; agRefresh(); }
  else if (t.id === 'agTgt') { AG.tgt = t.value; agGridLoad(); }
  else if (t.id === 'agF') { AG.f = t.value; agDraw(); }
});
document.addEventListener('input', e => {
  const t = e.target; if (!t || t.id !== 'agQ') return;
  AG.q = t.value; clearTimeout(AG._t); AG._t = setTimeout(() => { agDraw(); const q = $('#agQ'); if (q) { q.focus(); q.setSelectionRange(q.value.length, q.value.length); } }, 250);
});

Object.assign(ACT, {
  agY: id => { AG.y = id; AG.q = ''; AG.f = 'all'; agRefresh(); },
  agMode: id => { AG.mode = id; AG.f = 'all'; AG.q = ''; agRefresh(); },
  agPick: (id, el) => { if (el.checked) AG.sel.add(id); else AG.sel.delete(id); agCount(); },
  agAllBox: (id, el) => { agRows().forEach(r => el.checked ? AG.sel.add(r.id) : AG.sel.delete(r.id)); document.querySelectorAll('.agCk').forEach(c => c.checked = AG.sel.has(c.dataset.id)); agCount(); },
  agSelAll: id => { agRows().forEach(r => id === '1' ? AG.sel.add(r.id) : AG.sel.delete(r.id)); if (id !== '1') AG.sel.clear(); document.querySelectorAll('.agCk').forEach(c => c.checked = AG.sel.has(c.dataset.id)); agCount(); },
  agLockAll: async id => {
    const it = agItem(), lock = id === '1'; if (!it) return;
    if (lock && !confirm('هتقفل «' + it.title + '» على كل الطلاب. تكمل؟')) return;
    const { error } = await sb.rpc('set_lock', { p_kind: it.k, p_ref: it.id, p_student: null, p_locked: lock }); if (error) throw new Error(agErr(error));
    await agAfter(lock ? 'تم القفل للكل 🔒' : 'تم الفتح للكل 🔓');
  },
  agLock: async id => {
    const it = agItem(), lock = id === '1', ids = agSelIds(); if (!it || !ids.length) return toast('اختار طلاب الأول', true);
    if (!confirm((lock ? 'قفل' : 'فتح') + ' «' + it.title + '» لـ ' + ids.length + ' طالب؟')) return;
    const n = await agBulk('set_lock_bulk', { p_kind: it.k, p_ref: it.id, p_locked: lock }, ids); await agAfter((lock ? 'تم القفل 🔒 لـ ' : 'تم الفتح 🔓 لـ ') + n + ' طالب');
  },
  agLockOne: async (id, el) => {
    const it = agItem(), lock = el.dataset.l === '1'; if (!it) return;
    await agBulk('set_lock_bulk', { p_kind: it.k, p_ref: it.id, p_locked: lock }, [id]); await agAfter(lock ? 'تم القفل 🔒' : 'تم الفتح 🔓');
  },
  agNew: async () => {
    const it = agItem(), ids = agSelIds(); if (!it || it.k !== 'quiz' || !ids.length) return toast('اختار طلاب الأول', true);
    if (!confirm('فتح محاولة جديدة في «' + it.title + '» لـ ' + ids.length + ' طالب؟\nمحاولاتهم القديمة بتتحفظ في السجل وهيوصلهم إشعار.')) return;
    const n = await agBulk('grant_new_attempt_bulk', { p_quiz: it.id }, ids); await agAfter('تم فتح محاولة جديدة ✅ لـ ' + n + ' طالب');
  },
  agNewOne: async id => {
    const it = agItem(), r = (AG.grid || []).find(x => x.id === id); if (!it || it.k !== 'quiz') return;
    if (!confirm('فتح محاولة جديدة لـ ' + (r ? r.name : 'الطالب') + ' في «' + it.title + '»؟\nمحاولاته القديمة بتتحفظ في السجل وهيوصله إشعار.')) return;
    await agBulk('grant_new_attempt_bulk', { p_quiz: it.id }, [id]); await agAfter('تم فتح محاولة جديدة ✅');
  },
  agReset: async () => {
    const it = agItem(), ids = agSelIds(); if (!it || it.k !== 'course' || !ids.length) return toast('اختار طلاب الأول', true);
    if (!confirm('هتتمسح علامات إنجاز ' + ids.length + ' طالب في «' + it.title + '» وهيبدأوا من الأول. تكمل؟')) return;
    const n = await agBulk('reset_course_progress_bulk', { p_course: it.id }, ids); await agAfter('تمت إعادة فتح الكورس ✅ لـ ' + n + ' طالب');
  },
  agHist: async id => {
    const it = agItem(); if (!it || it.k !== 'quiz') return;
    const r = (AG.grid || []).find(x => x.id === id) || {};
    const { data, error } = await sb.rpc('attempt_history', { p_student: id, p_quiz: it.id }); if (error) throw new Error(agErr(error));
    const row = (a, t) => '<tr><td>' + t + '</td><td>' + (a.score == null ? '—' : a.score + ' / ' + a.total) + '</td><td>' + (a.at ? tfmt(a.at) : '') + '</td></tr>';
    modal('📜 سجل محاولات ' + (r.name || ''), '<table><tr><th>الحالة</th><th>الدرجة</th><th>التاريخ</th></tr>' + (data.current || []).map(a => row(a, a.status === 'pending' ? 'حالية (تصحيح معلّق)' : 'حالية')).join('') + (data.archived || []).map(a => row(a, 'قديمة (مؤرشفة)')).join('') + '</table>' + (!(data.current || []).length && !(data.archived || []).length ? '<div class="empty">مفيش محاولات</div>' : ''));
  },
  agCsv: () => {
    const it = agItem(); if (!it || !AG.grid) return;
    const isQ = it.k === 'quiz', q = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
    const head = ['الاسم', 'الرقم', 'الاشتراك', 'القفل'].concat(isQ ? ['المحاولات', 'أعلى نسبة', 'تصحيح معلق', 'آخر محاولة'] : it.k === 'lesson' ? ['خلّص'] : ['دروس منجزة', 'إجمالي الدروس']);
    const lines = agRows().map(r => [r.name, r.phone, r.enrolled ? 'مشترك' : 'غير مشترك', r.me ? 'مقفول' : 'مفتوح'].concat(isQ ? [(r.used || 0) + '/' + (it.max || 1), r.best == null ? '' : r.best, r.pending ? 'نعم' : '', r.last_at ? tfmt(r.last_at) : ''] : it.k === 'lesson' ? [r.done ? 'نعم' : 'لا'] : [r.lessons_done || 0, r.lessons || 0]).map(q).join(','));
    const blob = new Blob(['﻿' + [head.map(q).join(',')].concat(lines).join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'access-' + AG.y + '.csv'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
});
Object.assign(ACTPERM, { agLockAll: ['students.locks'], agLock: ['students.locks'], agLockOne: ['students.locks'], agNew: ['students.attempts'], agNewOne: ['students.attempts'], agReset: ['students.attempts'] });

// ---------------------------------------------------------------- تتبّع الدخول بالـIP + تعديل بيانات الطالب (حماية قصوى)
(function () {
'use strict';
const flag = c => c && /^[A-Z]{2}$/.test(c) ? String.fromCodePoint(...[...c].map(x => 127397 + x.charCodeAt(0))) : '🌐';
let _dn = null; const cname = c => { try { _dn = _dn || new Intl.DisplayNames(['ar'], { type: 'region' }); return c ? _dn.of(c) : ''; } catch (e) { return c || ''; } };
const tm = d => { try { return new Date(d).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' }); } catch (e) { return ''; } };
const dErr = e => { const m = (e && e.message) || String(e || ''); return /does not exist|schema cache|could not find/i.test(m) ? 'شغّل ملف db_36 في Supabase الأول' : /forbidden_edit/.test(m) ? 'التعديل ده للمالك فقط أو لعضو فريق معيّن له صلاحية «تعديل بيانات الطالب» بالاسم' : /forbidden/.test(m) ? 'مفيش عندك صلاحية' : m; };
const eErr = e => { const m = (e && e.message) || ''; const T = [
  ['forbidden_edit', 'التعديل ده للمالك فقط أو لعضو فريق معيّن له صلاحية «تعديل بيانات الطالب» بالاسم'], ['cannot_staff', 'مينفعش تعدّل حساب مسؤول/عضو فريق'], ['cannot_self', 'مينفعش تعدّل حسابك من هنا'],
  ['reason_required', 'اكتب سبب التعديل (5 حروف على الأقل)'], ['confirm_mismatch', 'رقم التأكيد مش مطابق لرقم الطالب الحالي'], ['bad_name', 'الاسم غير صالح (حرفين على الأقل، بدون أرقام أو رموز)'],
  ['bad_phone', 'رقم الموبايل لازم يكون 11 رقم يبدأ بـ01'], ['same_phones', 'رقم الطالب ورقم ولي الأمر لازم يكونوا مختلفين'], ['bad_year', 'الصف غير صحيح'], ['bad_email', 'الإيميل غير صالح'],
  ['phone_taken', 'الرقم ده مسجّل لطالب تاني'], ['email_taken', 'الإيميل ده مسجّل لحساب تاني'], ['banned_identity', 'الإيميل أو الرقم ده محظور'], ['no_change', 'ماغيّرتش أي حاجة'],
  ['rate_limited', 'عملت تعديلات كتير في ساعة — استنى شوية'], ['too_many_sensitive', 'التعديل الحساس (رقم/إيميل/صف) اتعمل مرتين النهارده لنفس الطالب — حاول بكرة'], ['bad_field', 'حقل غير مسموح'], ['not_found', 'الطالب غير موجود'], ['bad_gov', 'المحافظة طويلة']];
  const t = T.find(x => m.includes(x[0])); return t ? t[1] : dErr(e); };

// صلاحية «تعديل بيانات الطالب» في قايمة صلاحيات الفريق
try { const G = (typeof CAPS !== 'undefined') && CAPS.find(c => c[0] === 'students'); if (G && !G[3].some(a => a[0] === 'edit')) G[3].push(['edit', '✏️ تعديل بيانات الطالب (حساس — بتتحدد بالاسم)']); } catch (e) {}
Object.assign(ACTPERM, { stEdit: ['students.edit'], stTrack: ['students.view', 'devices.view'], stChanges: ['students.view'] });

// أزرار جديدة في بطاقة الطالب
const _sb = window.stBtns;
window.stBtns = (s, id) => '<button class="btn s" data-act="stEdit" data-id="' + id + '">✏️ تعديل بياناته</button><button class="btn s g" data-act="stTrack" data-id="' + id + '">🌍 تتبّع الدخول</button>' + (_sb ? _sb(s, id) : '');

// ---------------------------------------------------------------- تتبّع الدخول لطالب
async function trackModal(id) {
  const { data, error } = await sb.rpc('device_report', { p_student: id, p_days: 60 }); if (error) throw new Error(dErr(error));
  const s = (S.students || []).find(x => x.id === id) || {}, sm = data.summary || {}, ev = data.events || [];
  const chip = (t, v, bad) => '<span' + (bad ? ' style="background:rgba(220,38,38,.18);color:#f87171"' : '') + '>' + t + ' <b>' + v + '</b></span>';
  const rows = ev.map(e => '<tr' + (e.kind === 'kicked' ? ' style="opacity:.75"' : '') + '><td>' + tm(e.at) + '</td><td>' + (e.kind === 'kicked' ? '<span class="pill no">محاولة بعد الطرد</span>' : '<span class="pill ok">دخول</span>') + '</td>'
    + '<td dir="ltr" style="white-space:nowrap"><b>' + esc(e.ip || '—') + '</b>' + (+e.others > 0 ? ' <span class="pill no" title="طلاب تانيين دخلوا من نفس العنوان آخر 30 يوم">👥 ' + e.others + '</span>' : '') + '</td>'
    + '<td>' + flag(e.country) + ' ' + esc(cname(e.country)) + (e.city ? ' — ' + esc(e.city) : '') + '</td><td>' + esc(devName(e.ua)) + '</td></tr>').join('');
  const sh = (data.shared || []).map(x => '<div class="v5row"><b dir="ltr">' + esc(x.ip) + '</b><span class="nm">' + (x.names || []).map(esc).join('، ') + '</span><small>' + x.n + ' حسابات</small></div>').join('');
  modal('🌍 تتبّع الدخول — ' + fname(s), '<div class="chips">' + chip('تسجيلات دخول', sm.logins || 0) + chip('عناوين IP', sm.ips || 0, (sm.ips || 0) >= 4) + chip('أجهزة', sm.devices || 0, (sm.devices || 0) >= 3) + chip('دول', sm.countries || 0, (sm.countries || 0) >= 2)
    + chip('محاولات بعد الطرد', sm.kicked || 0, (sm.kicked || 0) >= 3) + (sm.multi_ip_1h ? '<span style="background:rgba(220,38,38,.18);color:#f87171">⚠️ دخل من مكانين مختلفين خلال ساعة</span>' : '') + '</div>'
    + (sh ? '<h4 style="margin:12px 0 6px">👥 عناوين مشتركة مع طلاب تانيين (آخر 30 يوم)</h4>' + sh : '')
    + '<div class="tw" style="max-height:50vh;overflow:auto;margin-top:10px"><table><tr><th>الوقت</th><th>النوع</th><th>العنوان IP</th><th>المكان</th><th>الجهاز</th></tr>' + (rows || '<tr><td colspan="5" class="empty">مفيش تسجيلات دخول لسه</td></tr>') + '</table></div>'
    + '<p class="nt" style="margin-top:10px;line-height:1.9">📌 العنوان بيتسجّل من السيرفر نفسه (مينفعش الطالب يزوّره). عناوين الموبايل (4G/5G) بتتغيّر كتير وبتتشارك بين ناس كتير، فاعتبر المؤشرات «تنبيه» مش «إثبات». المكان تقريبي، والـVPN بيخليه غلط.</p>');
}

// ---------------------------------------------------------------- تبويب أجهزة الدخول (نسخة IP)
const DV = { y: '', days: 30, q: '', f: 'all', data: null, busy: false };
VIEWS.devices = ['أجهزة الدخول', async () => { setTimeout(dvLoad, 0); return '<div class="note" style="margin:0 0 14px">🌍 كل تسجيل دخول بيتسجّل بالعنوان (IP) والدولة والجهاز. الطلاب المحتمل إنهم بيشاركوا الحساب بيظهروا فوق بالأحمر.</div>'
  + '<div class="bar" style="flex-wrap:wrap;gap:8px;margin-bottom:10px"><button class="yt' + (!DV.y ? ' on' : '') + '" data-act="dvY" data-id="">كل الصفوف</button>' + YEARS.map(y => '<button class="yt' + (y === DV.y ? ' on' : '') + '" data-act="dvY" data-id="' + y + '">' + y + '</button>').join('') + '</div>'
  + '<div class="bar" style="flex-wrap:wrap;gap:8px;margin-bottom:12px"><input id="dvQ" placeholder="🔍 اسم أو رقم" value="' + esc(DV.q) + '" style="max-width:240px"><select id="dvD" style="max-width:150px">' + [7, 30, 90].map(d => '<option value="' + d + '"' + (d === DV.days ? ' selected' : '') + '>آخر ' + d + ' يوم</option>').join('') + '</select>'
  + '<select id="dvF" style="max-width:210px">' + [['all', 'كل الطلاب'], ['risk', 'المشتبه فيهم بس'], ['multi', 'دخلوا من مكانين في ساعة'], ['shared', 'بيشاركوا IP مع غيرهم'], ['dev3', '3 أجهزة أو أكتر']].map(o => '<option value="' + o[0] + '"' + (DV.f === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select></div><div id="dvBody"></div>'; }];
VPERM.devices = ['devices.view'];
async function dvLoad() {
  const box = $('#dvBody'); if (!box) return; box.innerHTML = '<div class="empty">⏳ جاري التحميل...</div>';
  const { data, error } = await sb.rpc('devices_overview', { p_year: DV.y || null, p_days: DV.days });
  if (error) { box.innerHTML = '<div class="empty">⚠️ ' + esc(dErr(error)) + '</div>'; return; }
  DV.data = data || []; dvDraw();
}
function dvDraw() {
  const box = $('#dvBody'); if (!box || !DV.data) return; const q = DV.q.trim().toLowerCase();
  const risk = r => r.multi_ip_1h || r.shared_ip || r.devices >= 3 || r.ips >= 4 || r.kicked >= 3;
  const rows = DV.data.filter(r => (!q || ((r.name || '') + ' ' + (r.phone || '')).toLowerCase().includes(q)) && (DV.f === 'all' || (DV.f === 'risk' ? risk(r) : DV.f === 'multi' ? r.multi_ip_1h : DV.f === 'shared' ? r.shared_ip : r.devices >= 3)));
  box.innerHTML = '<div class="tw"><table><tr><th>الطالب</th><th>آخر دخول</th><th>آخر IP / مكان</th><th>IP</th><th>أجهزة</th><th>دول</th><th>تنبيهات</th><th></th></tr>' + (rows.slice(0, 300).map(r =>
    '<tr><td><b>' + esc(r.name) + '</b><br><small style="color:var(--muted)">' + esc(r.year || '') + ' • <span dir="ltr">' + esc(r.phone || '') + '</span></small></td><td>' + tm(r.last_at) + '<br><small style="color:var(--muted)">' + esc(devName(r.last_ua)) + '</small></td>'
    + '<td dir="ltr" style="text-align:right"><b>' + esc(r.last_ip || '—') + '</b><br><small>' + flag(r.last_country) + ' ' + esc(cname(r.last_country)) + (r.last_city ? ' — ' + esc(r.last_city) : '') + '</small></td>'
    + '<td>' + r.ips + '</td><td><span class="pill' + (r.devices >= 3 ? ' no' : '') + '">' + r.devices + '</span></td><td>' + (r.countries || 0) + '</td><td>'
    + (r.multi_ip_1h ? '<span class="pill no">مكانين/ساعة</span> ' : '') + (r.shared_ip ? '<span class="pill warn">IP مشترك</span> ' : '') + (r.kicked >= 3 ? '<span class="pill no">محاولات بعد الطرد ' + r.kicked + '</span> ' : '') + (!risk(r) ? '<span class="pill ok">عادي</span>' : '') + '</td>'
    + '<td><button class="btn s g" data-act="stTrack" data-id="' + r.id + '">🌍 تفاصيل</button></td></tr>').join('') || '<tr><td colspan="8" class="empty">مفيش نتايج</td></tr>') + '</table></div>'
    + (rows.length > 300 ? '<div class="empty">ظاهر أول 300 من ' + rows.length + ' — استخدم البحث</div>' : '');
  applyActGate($('#view'));
}
document.addEventListener('change', e => { const t = e.target; if (!t || !t.id) return; if (t.id === 'dvD') { DV.days = +t.value; dvLoad(); } else if (t.id === 'dvF') { DV.f = t.value; dvDraw(); } });
document.addEventListener('input', e => { const t = e.target; if (t && t.id === 'dvQ') { DV.q = t.value; clearTimeout(DV._t); DV._t = setTimeout(() => { dvDraw(); const q = $('#dvQ'); if (q) { q.focus(); q.setSelectionRange(q.value.length, q.value.length); } }, 250); } });

// ---------------------------------------------------------------- تعديل بيانات الطالب
async function freshStudent(id) {
  const { data } = await sb.from('profiles').select('*').eq('id', id).maybeSingle(); if (!data) return null;
  const i = (S.students || []).findIndex(x => x.id === id); if (i >= 0) S.students[i] = Object.assign(S.students[i], data); return data;
}
Object.assign(ACT, {
  stTrack: id => trackModal(id),
  stEdit: async (id, el) => {
    let s = (S.students || []).find(x => x.id === id) || await freshStudent(id); if (!s) return toast('الطالب غير موجود', true);
    const th = el && el.dataset ? (el.dataset.t || '') : '', f = (n, l, v, extra) => '<div><label>' + l + '</label><input name="' + n + '" value="' + esc(v || '') + '" ' + (extra || '') + '></div>';
    modal('✏️ تعديل بيانات — ' + fname(s), '<form><div class="note" style="margin:0 0 12px;line-height:1.9">🔒 عملية حساسة: بتتسجّل باسمك وبالسبب وبالقيمة القديمة والجديدة، ولو غيّرت الرقم أو الإيميل أو الصف الطالب هيتسجّل خروجه ويدخل من جديد. مفيش باسورد بيتغيّر من هنا.</div>'
      + '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px">'
      + f('first_name', 'الاسم الأول', s.first_name, 'maxlength="40"') + f('middle_name', 'الاسم الأوسط', s.middle_name, 'maxlength="60"') + f('last_name', 'اسم العيلة', s.last_name, 'maxlength="40"')
      + f('phone_number', '📱 رقم الطالب', s.phone_number, 'dir="ltr" inputmode="numeric" maxlength="11"') + f('parent_phone', '📞 رقم ولي الأمر', s.parent_phone, 'dir="ltr" inputmode="numeric" maxlength="11"')
      + f('email', '✉️ الإيميل', s.email, 'dir="ltr" type="email" maxlength="120"')
      + '<div><label>الصف</label><select name="academic_year">' + yopts(s.academic_year) + '</select></div>' + f('governorate', 'المحافظة', s.governorate, 'maxlength="40"') + '</div>'
      + '<label>سبب التعديل (إجباري — بيتسجّل)</label><textarea name="reason" required minlength="5" maxlength="300" placeholder="مثال: الطالب كتب اسمه غلط وطلب تصحيحه من الدعم"></textarea>'
      + '<label>للتأكيد اكتب رقم الطالب الحالي: <b dir="ltr">' + esc(s.phone_number) + '</b></label><input name="confirm" required dir="ltr" inputmode="numeric" maxlength="11" autocomplete="off" placeholder="رقم الطالب الحالي">'
      + (th ? '<p class="nt">📎 هيتبعت للطالب رد تلقائي في محادثة الدعم إن بياناته اتعدّلت.</p>' : '')
      + '<div class="bar" style="margin-top:12px"><button class="btn">💾 حفظ التعديل</button><button type="button" class="btn g" data-act="stChanges" data-id="' + id + '">📜 سجل التعديلات</button></div></form>',
      async fd => {
        const ch = {}; ['first_name', 'middle_name', 'last_name', 'phone_number', 'parent_phone', 'email', 'academic_year', 'governorate'].forEach(k => { const v = String(fd.get(k) || '').trim(); if (v !== String(s[k] || '')) ch[k] = v; });
        if (!Object.keys(ch).length) throw new Error('ماغيّرتش أي حاجة');
        const sens = ['phone_number', 'parent_phone', 'email', 'academic_year'].some(k => k in ch);
        if (!confirm('تأكيد تعديل: ' + Object.keys(ch).map(k => ({ first_name: 'الاسم الأول', middle_name: 'الأوسط', last_name: 'اسم العيلة', phone_number: 'رقم الطالب', parent_phone: 'رقم ولي الأمر', email: 'الإيميل', academic_year: 'الصف', governorate: 'المحافظة' }[k])).join('، ') + (sens ? '\nالطالب هيتسجّل خروجه.' : '') + '\nتكمل؟')) throw new Error('اتلغى');
        const { data, error } = await sb.rpc('admin_update_student', { p_student: id, p_changes: ch, p_reason: String(fd.get('reason') || ''), p_confirm: String(fd.get('confirm') || ''), p_thread: th || null });
        if (error) throw new Error(eErr(error));
        await freshStudent(id); toast('تم تعديل البيانات ✅' + (data && data.sensitive ? ' (الطالب هيدخل من جديد)' : '')); if ($('#st')) drawStudents();
      });
  },
  stChanges: async id => {
    const { data, error } = await sb.rpc('student_changes', { p_student: id }); if (error) throw new Error(dErr(error));
    const L = { first_name: 'الاسم الأول', middle_name: 'الأوسط', last_name: 'اسم العيلة', phone_number: 'رقم الطالب', parent_phone: 'رقم ولي الأمر', email: 'الإيميل', academic_year: 'الصف', governorate: 'المحافظة' };
    modal('📜 سجل تعديلات الطالب', (data || []).map(r => '<div class="card" style="margin-bottom:8px"><div class="bar"><b>' + esc(r.by || '—') + '</b><small style="color:var(--muted)">' + tm(r.at) + '</small></div>'
      + Object.keys(r.new || {}).map(k => '<div class="v5row"><b style="min-width:110px">' + (L[k] || k) + '</b><span dir="auto" style="color:#f87171;text-decoration:line-through">' + esc(String((r.old || {})[k] == null ? '—' : r.old[k])) + '</span><span>←</span><span dir="auto" style="color:#4ade80">' + esc(String(r.new[k])) + '</span></div>').join('')
      + '<p class="nt" style="margin-top:6px">السبب: ' + esc(r.reason || '') + '</p></div>').join('') || '<div class="empty">مفيش تعديلات اتعملت</div>');
  }
});
})();

// ---------------------------------------------------------------- تحكم الامتحان: نسبة النجاح / تعدية / محاولة / توجيه لامتحان تاني
(function () {
'use strict';
const XC = { y: '', mode: 'course', cid: '', qid: '', T: null, D: null, q: '', f: 'all', sel: new Set() };
const xErr = e => { const m = (e && e.message) || String(e || ''); const T = [['does not exist', 'شغّل ملف db_37 في Supabase الأول'], ['schema cache', 'شغّل ملف db_37 في Supabase الأول'], ['forbidden', 'مفيش عندك صلاحية للإجراء ده'], ['bad_pass', 'نسبة النجاح لازم من 0 لـ100'], ['bad_attempts', 'عدد المحاولات من 0 لـ50'], ['bad_time', 'الوقت من 1 لـ600 دقيقة'], ['bad_mode', 'وضع إظهار النتيجة غير صحيح'], ['bad_note', 'الرسالة طويلة (300 حرف بالكتير)'], ['not_published', 'الامتحان اللي هتوجّه له لازم يكون منشور'], ['too_many', 'عدد الطلاب كبير (500 بالكتير)'], ['violates check', 'تاريخ الإغلاق لازم يكون بعد الفتح']];
  const t = T.find(x => m.includes(x[0])); return t ? t[1] : m; };
const xcCourses = () => (S.courses || []).filter(c => c.academic_year === XC.y);
const xcQz = () => XC.D && XC.D.quiz;
const loc = d => { if (!d) return ''; const x = new Date(d); if (isNaN(x)) return ''; x.setMinutes(x.getMinutes() - x.getTimezoneOffset()); return x.toISOString().slice(0, 16); };
const stOfRow = (r, q) => r.override ? ['ok', 'تعدية ✅'] : r.pending ? ['warn', 'تصحيح معلّق'] : !r.used ? ['', 'لم يدخل'] : (r.best != null && r.best >= q.pass) ? ['ok', 'ناجح'] : ['no', 'راسب'];

VIEWS.xctl = ['تحكم الامتحان', async () => {
  if (!S.courses) await loadCourses(); XC.y = XC.y || YEARS[0]; setTimeout(xcRefresh);
  return '<div class="note" style="margin:0 0 14px">🎛️ اختار الصف ← الكورس (أو الامتحان الشامل) ← الامتحان. من هنا تظبط <b>نسبة النجاح</b> والمحاولات والوقت، وتشوف كل الطلاب، وتقدر <b>تعدّي</b> اللي رسب، أو تفتحله <b>محاولة جديدة</b>، أو <b>توجّهه لامتحان تاني</b>.</div><div id="xcTop"></div><div id="xcBody"></div>'; }];
VPERM.xctl = ['g:students', 'g:content'];

function xcTop() {
  const top = $('#xcTop'); if (!top) return; const T = XC.T, cs = xcCourses();
  const qs = (T && T.quizzes) || [];
  top.innerHTML = '<div class="card" style="margin-bottom:14px"><div class="bar" style="flex-wrap:wrap;margin-bottom:8px">' + YEARS.map(y => '<button class="yt' + (y === XC.y ? ' on' : '') + '" data-act="xcY" data-id="' + y + '">' + y + '</button>').join('') + '</div>'
    + '<div class="bar" style="flex-wrap:wrap;margin-bottom:6px"><button class="yt' + (XC.mode === 'course' ? ' on' : '') + '" data-act="xcMode" data-id="course">📚 امتحانات كورس</button><button class="yt' + (XC.mode === 'comp' ? ' on' : '') + '" data-act="xcMode" data-id="comp">🎓 شامل</button></div>'
    + '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px">'
    + (XC.mode === 'course' ? '<div><label>الكورس</label><select id="xcCourse">' + (cs.length ? cs.map(c => '<option value="' + c.id + '"' + (c.id === XC.cid ? ' selected' : '') + '>' + esc(c.title) + '</option>').join('') : '<option value="">— مفيش كورسات —</option>') + '</select></div>' : '')
    + '<div><label>الامتحان</label><select id="xcQuiz">' + (qs.length ? qs.map(z => '<option value="' + z.id + '"' + (z.id === XC.qid ? ' selected' : '') + '>' + (z.hw ? '📘 ' : '📝 ') + esc(z.title) + (z.published === false ? ' — غير منشور' : '') + '</option>').join('') : '<option value="">— مفيش امتحانات —</option>') + '</select></div></div></div>';
}
async function xcRefresh() {
  if (!$('#xcBody')) return; const cs = xcCourses();
  if (XC.mode === 'course' && !cs.some(c => c.id === XC.cid)) XC.cid = cs[0] ? cs[0].id : '';
  XC.T = null; XC.D = null; XC.qid = ''; XC.sel.clear(); xcTop(); const body = $('#xcBody');
  if (XC.mode === 'course' && !XC.cid) { body.innerHTML = '<div class="empty">مفيش كورسات للصف ' + esc(XC.y) + '</div>'; return; }
  body.innerHTML = '<div class="empty">⏳ جاري التحميل...</div>';
  const { data, error } = await sb.rpc('access_targets', { p_course: XC.mode === 'course' ? XC.cid : null, p_year: XC.y });
  if (error) { body.innerHTML = '<div class="empty">⚠️ ' + esc(xErr(error)) + '</div>'; return; }
  XC.T = data; const first = (data.quizzes || [])[0]; XC.qid = first ? first.id : ''; xcTop();
  if (!XC.qid) { body.innerHTML = '<div class="empty">مفيش امتحانات هنا لسه</div>'; return; }
  await xcLoad();
}
async function xcLoad(keep) {
  const body = $('#xcBody'); if (!body || !XC.qid) return; if (!keep) { XC.sel.clear(); body.innerHTML = '<div class="empty">⏳ جاري تحميل الامتحان والطلاب...</div>'; }
  const { data, error } = await sb.rpc('quiz_control_get', { p_quiz: XC.qid });
  if (error) { body.innerHTML = '<div class="empty">⚠️ ' + esc(xErr(error)) + '</div>'; return; }
  XC.D = data; const keepSet = new Set(data.students.map(s => s.id)); XC.sel = new Set([...XC.sel].filter(x => keepSet.has(x))); xcDraw();
}
const xcSelIds = () => [...XC.sel];
function xcRows() {
  const D = XC.D, q = D.quiz, s = XC.q.trim().toLowerCase();
  return D.students.filter(r => {
    const st = stOfRow(r, q)[1];
    const fok = XC.f === 'all' || (XC.f === 'fail' ? st === 'راسب' : XC.f === 'pass' ? (st === 'ناجح' || st === 'تعدية ✅') : XC.f === 'none' ? !r.used : XC.f === 'pend' ? r.pending : XC.f === 'ov' ? r.override : XC.f === 'asg' ? r.assigned : XC.f === 'enr' ? r.enrolled : true);
    return fok && (!s || ((r.name || '') + ' ' + (r.phone || '')).toLowerCase().includes(s));
  });
}
function xcCount() {
  const el = $('#xcCnt'); if (!el) return; el.textContent = XC.sel.size ? 'تم اختيار ' + XC.sel.size + ' طالب' : 'لسه ما اخترتش حد';
  const all = $('#xcAll'); if (all) { const rows = xcRows(); all.checked = rows.length > 0 && rows.every(r => XC.sel.has(r.id)); }
  document.querySelectorAll('.xcBulk').forEach(b => b.disabled = !XC.sel.size);
}
function xcDraw() {
  const body = $('#xcBody'); if (!body || !XC.D) return; const D = XC.D, q = D.quiz, rows = xcRows(), S2 = D.students;
  const cnt = k => S2.filter(r => stOfRow(r, q)[1] === k).length, tried = S2.filter(r => r.used).length;
  const F = (n, l, v, type, ex) => '<div><label>' + l + '</label>' + (type === 'sel' ? '<select name="' + n + '">' + ex + '</select>' : type === 'chk' ? '<label class="chk" style="margin:6px 0 0"><input type="checkbox" class="ck" name="' + n + '"' + (v ? ' checked' : '') + '> ' + ex + '</label>' : '<input name="' + n + '" type="' + (type || 'text') + '" value="' + esc(v == null ? '' : v) + '" ' + (ex || '') + '>') + '</div>';
  const RM = [['now', 'بعد التسليم مباشرة'], ['after_grading', 'بعد التصحيح'], ['after_close', 'بعد إغلاق الامتحان'], ['manual', 'يدوي (لما أعتمدها)'], ['manual_released', 'يدوي — اتعرضت']];
  body.innerHTML = '<div class="card" style="margin-bottom:14px"><div class="bar" style="justify-content:space-between;flex-wrap:wrap"><div><b style="font-size:17px">' + (q.hw ? '📘' : '📝') + ' ' + esc(q.title) + '</b> <span class="pill">' + esc(q.year || '') + '</span>' + (q.course ? ' <span class="pill">' + esc(q.course) + '</span>' : '') + (q.lesson ? ' <span class="pill">درس: ' + esc(q.lesson) + '</span>' : '') + (q.assigned_only ? ' <span class="pill warn">🧭 موجّه</span>' : '') + (q.published ? ' <span class="pill ok">منشور</span>' : ' <span class="pill no">غير منشور</span>') + '</div>'
    + '<div class="bar"><button class="btn s g" data-act="xcEditQ" data-id="' + q.id + '">✏️ تعديل الأسئلة</button><button class="btn s g" data-act="xcDesign">🎨 الألوان والتصميم</button></div></div>'
    + '<div class="chips"><span>❓ أسئلة <b>' + q.questions + '</b></span><span>🎯 مجموع الدرجات <b>' + q.points + '</b></span><span>👥 الطلاب <b>' + S2.length + '</b></span><span>📝 دخلوا <b>' + tried + '</b></span><span>✅ ناجح <b>' + (cnt('ناجح') + cnt('تعدية ✅')) + '</b></span><span>❌ راسب <b>' + cnt('راسب') + '</b></span><span>⏳ معلّق <b>' + cnt('تصحيح معلّق') + '</b></span><span>🚪 لم يدخل <b>' + cnt('لم يدخل') + '</b></span></div></div>'
    + '<form id="xcForm" class="card" style="margin-bottom:14px"><b>⚙️ إعدادات الامتحان</b><div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin-top:6px">'
    + F('pass_percent', '🎯 نسبة النجاح %', q.pass, 'number', 'min="0" max="100"') + F('max_attempts', '🔁 عدد المحاولات', q.max, 'number', 'min="0" max="50"') + F('time_limit_minutes', '⏱ الوقت بالدقايق (فاضي = مفتوح)', q.time, 'number', 'min="1" max="600"')
    + F('result_mode', '👁 إظهار النتيجة', null, 'sel', RM.map(m => '<option value="' + m[0] + '"' + (m[0] === q.result_mode ? ' selected' : '') + '>' + m[1] + '</option>').join('')) + F('opens_at', '🕒 يفتح', loc(q.opens), 'datetime-local') + F('closes_at', '🔚 يقفل', loc(q.closes), 'datetime-local')
    + '</div><label>رسالة تظهر للطالب مع نتيجته (اختياري)</label><input name="result_note" maxlength="300" value="' + esc(q.result_note || '') + '">'
    + '<div class="bar" style="gap:8px;margin-top:8px">' + [['shuffle', q.shuffle, '🔀 ترتيب عشوائي'], ['is_published', q.published, '📢 منشور'], ['is_homework', q.hw, '📘 واجب'], ['assigned_only', q.assigned_only, '🧭 امتحان موجّه (يظهر للطلاب اللي أوجّههم له بس)']].map(c => '<label class="chk" style="margin:0"><input type="checkbox" class="ck" name="' + c[0] + '"' + (c[1] ? ' checked' : '') + '> ' + c[2] + '</label>').join('') + '</div>'
    + '<div class="bar" style="margin-top:10px"><button class="btn" data-act="xcSave" type="button">💾 حفظ الإعدادات</button><span class="nt" style="margin:0">تغيير نسبة النجاح بيتحسب فوراً على كل نتايج الامتحان.</span></div></form>'
    + '<div class="card" style="margin-bottom:14px"><div class="bar" style="flex-wrap:wrap;gap:8px"><input id="xcQ" placeholder="🔍 ابحث بالاسم أو الرقم" value="' + esc(XC.q) + '" style="max-width:240px"><select id="xcF" style="max-width:220px">'
    + [['all', 'كل الطلاب'], ['fail', '❌ الراسبين'], ['pass', '✅ الناجحين'], ['none', '🚪 ما دخلوش'], ['pend', '⏳ تصحيح معلّق'], ['ov', '✅ المتعدّين بقرار'], ['asg', '🧭 الموجّهين'], ...(q.kind !== 'comprehensive' ? [['enr', 'المشتركين بس']] : [])].map(o => '<option value="' + o[0] + '"' + (XC.f === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select></div>'
    + '<div class="bar" style="flex-wrap:wrap;margin-top:10px;gap:8px"><b id="xcCnt" style="min-width:130px"></b><button class="btn s g" data-act="xcSelAll" data-id="1">✔ اختيار اللي ظاهر</button><button class="btn s g" data-act="xcSelAll" data-id="0">✖ مسح</button>'
    + '<button class="btn s xcBulk" data-act="xcPass" data-id="1" disabled>✅ تعدية المختارين (الراسبين بس)</button><button class="btn s g xcBulk" data-act="xcPass" data-id="0" disabled>↩️ إلغاء التعدية</button><button class="btn s xcBulk" data-act="xcNew" disabled>🔁 محاولة جديدة</button><button class="btn s xcBulk" data-act="xcAssign" disabled>🧭 توجيه لامتحان تاني</button></div></div>'
    + '<div class="card" style="padding:6px;overflow:auto"><table><tr><th style="width:34px"><input type="checkbox" id="xcAll" data-act="xcAllBox" style="width:auto"></th><th>الطالب</th><th>الحالة</th><th>المحاولات</th><th>أعلى نسبة</th><th>آخر محاولة</th><th></th></tr>'
    + (rows.slice(0, 400).map(r => { const st = stOfRow(r, q), left = Math.max(0, (q.max || 1) - (r.used || 0));
      return '<tr' + (r.enrolled ? '' : ' style="opacity:.6"') + '><td><input type="checkbox" class="xcCk" data-act="xcPick" data-id="' + r.id + '" style="width:auto"' + (XC.sel.has(r.id) ? ' checked' : '') + '></td>'
        + '<td><b>' + esc(r.name) + '</b><br><small dir="ltr" style="color:var(--muted)">' + esc(r.phone || '') + '</small>' + (r.enrolled ? '' : ' <span class="pill">غير مشترك</span>') + (r.assigned ? ' <span class="pill warn">🧭 موجّه</span>' : '') + (r.me ? ' <span class="pill no">🔒</span>' : '') + '</td>'
        + '<td><span class="pill ' + st[0] + '">' + st[1] + '</span></td><td><span class="pill' + (left === 0 && r.used ? ' no' : r.used ? ' ok' : '') + '">' + (r.used || 0) + ' / ' + (q.max || 1) + '</span>' + (r.archived ? ' <small style="color:var(--muted)">+' + r.archived + ' قديمة</small>' : '') + '</td>'
        + '<td>' + (r.best == null ? '—' : r.best + '%') + '</td><td>' + (r.last_at ? tfmt(r.last_at) : '—') + '</td><td style="white-space:nowrap">'
        + (r.override || st[1] === 'راسب' ? '<button class="btn s ' + (r.override ? 'g' : '') + '" data-act="xcPassOne" data-id="' + r.id + '" data-on="' + (r.override ? 0 : 1) + '">' + (r.override ? '↩️ إلغاء التعدية' : '✅ تعدية (راسب)') + '</button> ' : '') + '<button class="btn s" data-act="xcNewOne" data-id="' + r.id + '">🔁 محاولة</button> <button class="btn s g" data-act="xcAssignOne" data-id="' + r.id + '">🧭 توجيه</button> <button class="btn s g" data-act="xcHist" data-id="' + r.id + '">📜</button></td></tr>'; }).join('') || '<tr><td colspan="7" class="empty">مفيش طلاب بالشكل ده</td></tr>') + '</table></div>';
  xcCount(); applyActGate($('#view'));
}
async function xcBulk(rpc, extra, ids) {
  let n = 0; for (let i = 0; i < ids.length; i += 400) { const { data, error } = await sb.rpc(rpc, Object.assign({ p_students: ids.slice(i, i + 400) }, extra)); if (error) throw new Error(xErr(error)); n += +data || 0; } return n;
}
const xcDone = async m => { toast(m); await xcLoad(true); };
async function xcAssignModal(ids) {
  const q = xcQz(); const { data, error } = await sb.rpc('quiz_pick_list', { p_quiz: q.id }); if (error) throw new Error(xErr(error));
  const list = (data || []).filter(z => z.published);
  modal('🧭 توجيه ' + ids.length + ' طالب لامتحان تاني', '<form><p class="nt" style="line-height:1.9">الطلاب المختارين هيوصلهم إشعار، والامتحان هيظهرلهم في «اختبارات». لو الامتحان «موجّه» (فعّلته من إعداداته) هيظهر لهم هم بس.</p>'
    + '<label>الامتحان (لازم يكون منشور)</label><select name="quiz" required><option value="">— اختار —</option>' + list.map(z => '<option value="' + z.id + '">' + (z.hw ? '📘 ' : '📝 ') + esc(z.title) + (z.course ? ' — ' + esc(z.course) : ' — شامل') + (z.assigned_only ? ' 🧭' : '') + '</option>').join('') + '</select>'
    + (list.length ? '' : '<p class="nt wn">مفيش امتحانات منشورة في الصف ده. انشر امتحان بديل الأول (ويفضّل تفعّل عليه «امتحان موجّه»).</p>')
    + '<label>رسالة للطالب (اختياري)</label><input name="note" maxlength="300" placeholder="مثال: امتحان تعويضي — ركّز في القواعد"><div class="bar" style="margin-top:12px"><button class="btn">🧭 توجيه</button></div></form>',
    async fd => { const t = fd.get('quiz'); if (!t) throw new Error('اختار الامتحان'); const n = await xcBulk('quiz_assign', { p_quiz: t, p_on: true, p_note: String(fd.get('note') || '') || null, p_from: q.id }, ids); await xcDone('تم توجيه ' + n + ' طالب ✅'); });
}
document.addEventListener('change', e => { const t = e.target; if (!t || !t.id) return;
  if (t.id === 'xcCourse') { XC.cid = t.value; xcRefresh(); } else if (t.id === 'xcQuiz') { XC.qid = t.value; xcLoad(); } else if (t.id === 'xcF') { XC.f = t.value; xcDraw(); } });
document.addEventListener('input', e => { const t = e.target; if (!t || t.id !== 'xcQ') return; XC.q = t.value; clearTimeout(XC._t); XC._t = setTimeout(() => { xcDraw(); const q = $('#xcQ'); if (q) { q.focus(); q.setSelectionRange(q.value.length, q.value.length); } }, 250); });
Object.assign(ACT, {
  xcY: id => { XC.y = id; XC.q = ''; XC.f = 'all'; xcRefresh(); }, xcMode: id => { XC.mode = id; XC.q = ''; XC.f = 'all'; xcRefresh(); },
  xcEditQ: id => go('xbuild', id), xcDesign: () => go('xdesign'),
  xcPick: (id, el) => { if (el.checked) XC.sel.add(id); else XC.sel.delete(id); xcCount(); },
  xcAllBox: (id, el) => { xcRows().forEach(r => el.checked ? XC.sel.add(r.id) : XC.sel.delete(r.id)); document.querySelectorAll('.xcCk').forEach(c => c.checked = XC.sel.has(c.dataset.id)); xcCount(); },
  xcSelAll: id => { if (id === '1') xcRows().forEach(r => XC.sel.add(r.id)); else XC.sel.clear(); document.querySelectorAll('.xcCk').forEach(c => c.checked = XC.sel.has(c.dataset.id)); xcCount(); },
  xcSave: async () => {
    const f = $('#xcForm'), fd = new FormData(f), q = xcQz(), set = {}, num = k => { const v = String(fd.get(k) || '').trim(); return v === '' ? null : +v; };
    const chk = k => !!f.querySelector('[name=' + k + ']').checked, iso = k => { const v = fd.get(k); return v ? new Date(v).toISOString() : null; };
    const cand = { pass_percent: num('pass_percent'), max_attempts: num('max_attempts'), time_limit_minutes: num('time_limit_minutes'), result_mode: fd.get('result_mode'), result_note: String(fd.get('result_note') || '').trim(), shuffle: chk('shuffle'), is_published: chk('is_published'), is_homework: chk('is_homework'), assigned_only: chk('assigned_only'), opens_at: iso('opens_at'), closes_at: iso('closes_at') };
    if (cand.pass_percent == null || cand.max_attempts == null) return toast('اكتب نسبة النجاح وعدد المحاولات', true);
    const cur = { pass_percent: q.pass, max_attempts: q.max, time_limit_minutes: q.time || null, result_mode: q.result_mode, result_note: q.result_note || '', shuffle: q.shuffle, is_published: q.published, is_homework: q.hw, assigned_only: q.assigned_only, opens_at: q.opens ? new Date(q.opens).toISOString() : null, closes_at: q.closes ? new Date(q.closes).toISOString() : null };
    Object.keys(cand).forEach(k => { if (JSON.stringify(cand[k]) !== JSON.stringify(cur[k])) set[k] = cand[k]; });
    if (!Object.keys(set).length) return toast('ماغيّرتش أي حاجة');
    if ('pass_percent' in set && !confirm('تغيير نسبة النجاح من ' + q.pass + '% إلى ' + set.pass_percent + '% هيتطبق فوراً على كل نتايج الامتحان. تكمل؟')) return;
    const { error } = await sb.rpc('quiz_control_save', { p_quiz: q.id, p_set: set }); if (error) throw new Error(xErr(error));
    (S.exams = null); await xcDone('تم حفظ الإعدادات ✅'); const z = ((XC.T && XC.T.quizzes) || []).find(x => x.id === q.id); if (z && 'is_published' in set) z.published = set.is_published; xcTop();
  },
  xcPass: async id => {
    const ids = xcSelIds(); if (!ids.length) return toast('اختار طلاب الأول', true); const on = id === '1'; let note = null;
    if (on) { note = prompt('تعدية ' + ids.length + ' طالب في «' + xcQz().title + '»\nسبب/ملاحظة (اختياري، بتظهر للطالب):', ''); if (note === null) return; } else if (!confirm('إلغاء تعدية ' + ids.length + ' طالب؟')) return;
    const n = await xcBulk('pass_override_set', { p_quiz: xcQz().id, p_on: on, p_note: note || null }, ids); await xcDone(on ? (n ? 'تمت التعدية ✅ لـ ' + n + ' طالب (اللي جابوا نسبة النجاح بيعدّوا لوحدهم)' : 'مفيش حد منهم راسب — اللي جاب نسبة النجاح بيعدّي لوحده') : 'اتلغت التعدية لـ ' + n + ' طالب');
  },
  xcPassOne: async (id, el) => {
    const on = el.dataset.on === '1', r = XC.D.students.find(x => x.id === id); let note = null;
    if (on) { note = prompt('تعدية ' + (r ? r.name : 'الطالب') + ' في «' + xcQz().title + '»\nسبب/ملاحظة (اختياري، بتظهر للطالب):', ''); if (note === null) return; }
    await xcBulk('pass_override_set', { p_quiz: xcQz().id, p_on: on, p_note: note || null }, [id]); await xcDone(on ? 'تمت التعدية ✅' : 'اتلغت التعدية');
  },
  xcNew: async () => {
    const ids = xcSelIds(); if (!ids.length) return toast('اختار طلاب الأول', true);
    if (!confirm('فتح محاولة جديدة لـ ' + ids.length + ' طالب في «' + xcQz().title + '»؟\nمحاولاتهم القديمة بتتحفظ في السجل وهيوصلهم إشعار.')) return;
    const n = await xcBulk('grant_new_attempt_bulk', { p_quiz: xcQz().id }, ids); await xcDone('تم فتح محاولة جديدة ✅ لـ ' + n + ' طالب');
  },
  xcNewOne: async id => {
    const r = XC.D.students.find(x => x.id === id); if (!confirm('فتح محاولة جديدة لـ ' + (r ? r.name : 'الطالب') + '؟\nمحاولاته القديمة بتتحفظ في السجل وهيوصله إشعار.')) return;
    await xcBulk('grant_new_attempt_bulk', { p_quiz: xcQz().id }, [id]); await xcDone('تم فتح محاولة جديدة ✅');
  },
  xcAssign: async () => { const ids = xcSelIds(); if (!ids.length) return toast('اختار طلاب الأول', true); await xcAssignModal(ids); },
  xcAssignOne: async id => xcAssignModal([id]),
  xcHist: async id => {
    const r = XC.D.students.find(x => x.id === id) || {}; const { data, error } = await sb.rpc('attempt_history', { p_student: id, p_quiz: xcQz().id }); if (error) throw new Error(xErr(error));
    const row = (a, t) => '<tr><td>' + t + '</td><td>' + (a.score == null ? '—' : a.score + ' / ' + a.total) + '</td><td>' + (a.at ? tfmt(a.at) : '') + '</td></tr>';
    modal('📜 سجل محاولات ' + (r.name || ''), '<table><tr><th>الحالة</th><th>الدرجة</th><th>التاريخ</th></tr>' + (data.current || []).map(a => row(a, a.status === 'pending' ? 'حالية (تصحيح معلّق)' : 'حالية')).join('') + (data.archived || []).map(a => row(a, 'قديمة (مؤرشفة)')).join('') + '</table>' + (!(data.current || []).length && !(data.archived || []).length ? '<div class="empty">مفيش محاولات</div>' : ''));
  }
});
Object.assign(ACTPERM, { xcSave: ['content.edit'], xcPass: ['students.attempts'], xcPassOne: ['students.attempts'], xcNew: ['students.attempts'], xcNewOne: ['students.attempts'], xcAssign: ['students.attempts'], xcAssignOne: ['students.attempts'] });
// تبويب في القايمة (بعد الامتحانات)
(function () { if (!NAV.some(n => n[0] === 'xctl')) { const i = NAV.findIndex(n => n[0] === 'exams'); NAV.splice(i >= 0 ? i + 1 : NAV.length, 0, ['xctl', '🎛️', 'تحكم الامتحان']); } })();
})();

// ---------------------------------------------------------------- تصميم كارت الكود (ألوان / نصوص / باركود QR)
// بيعتمد على دوال الكارت في admin-v2.js: cdLoad / cdEff / cardCss / cardHTML / oneHTML / printHTML / CD_DEF
const CE = { y: '', cur: null, dirty: false, size: '10', t: 0 };
const CE_TOG = [['show_brand', '🎩 الهيدر (اسم المنصة والمدرس)'], ['show_bar', '▮ الشريط الملوّن'], ['show_course', '📚 اسم الكورس'], ['show_name', '👤 سطر اسم الطالب'], ['show_grade', '🎓 سطر الصف'], ['show_exp', '⏳ جملة الصلاحية'], ['show_qr', '🔳 باركود QR للكود'], ['show_gradient', '🌈 خلفية متدرّجة']];
const CE_TXT = [['brand_title', 'اسم المنصة'], ['brand_sub', 'اسم المدرس / السطر التاني'], ['label_name', 'عنوان سطر الاسم'], ['label_grade', 'عنوان سطر الصف'], ['label_code', 'عنوان خانة الكود'], ['exp_text', 'جملة الصلاحية'], ['footer_text', 'سطر إضافي أسفل الكارت (اختياري)'], ['qr_hint', 'كلمة تحت الباركود (اختياري)']];
const CE_COL = [['c1', 'لون العناوين والإطار'], ['c2', 'لون التمييز'], ['bg1', 'لون الخلفية (1)'], ['bg2', 'لون الخلفية (2)'], ['box_bg', 'خلفية اسم الكورس'], ['ink', 'لون الكتابة'], ['line', 'لون إطار الكارت']];
const CE_PAL = [['الأصلي', ['#0f172a', '#ef4444', '#ffffff', '#fef2f2', '#fee2e2']], ['أزرق', ['#1e3a8a', '#2563eb', '#ffffff', '#eff6ff', '#dbeafe']], ['أخضر', ['#14532d', '#16a34a', '#ffffff', '#f0fdf4', '#dcfce7']], ['بنفسجي', ['#4c1d95', '#7c3aed', '#ffffff', '#f5f3ff', '#ede9fe']], ['ذهبي', ['#422006', '#d97706', '#fffbeb', '#fef3c7', '#fde68a']], ['أبيض وأسود', ['#111827', '#374151', '#ffffff', '#f3f4f6', '#e5e7eb']]];
const ceBase = () => Object.assign({}, CD_DEF, CDX.D.defaults, CDX.D.saved.default || {});
const ceEff = y => Object.assign({}, ceBase(), y ? ((CDX.D.saved.years || {})[y] || {}) : {});
const ceSample = () => ({ course: 'Unit One — Grammar', name: 'محمد أحمد علي', grade: CE.y || 'أولى ثانوي', code: 'XXXX-XXXX-XXXX', exp: expTxt() });
function cePreview() {
  const f = $('#cdPv'); if (!f || !CE.cur) return; const D = cdSafe(CE.cur), o = ceSample();
  const body = CE.size === 'one' ? oneHTML(o, D) : '<div class="p' + CE.size + '" style="width:92mm">' + cardHTML(o, D) + '</div>';
  f.style.height = CE.size === 'one' ? '560px' : CE.size === '8' ? '320px' : '280px';
  f.srcdoc = '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>' + cardCss(D) + 'body{padding:6mm;background:#eef2f7}</style></head><body class="' + (D.show_qr ? 'hasqr' : '') + '">' + body + '</body></html>';
}
const ceSched = () => { clearTimeout(CE.t); CE.t = setTimeout(cePreview, 120); };
function ceForm() {
  const c = CE.cur, ys = (CDX.D.saved.years || {});
  const tabs = '<div class="ytabs"><button class="yt' + (CE.y === '' ? ' on' : '') + '" data-act="cdY" data-id="">🌐 كل الصفوف</button>' + YEARS.map(y => '<button class="yt' + (CE.y === y ? ' on' : '') + '" data-act="cdY" data-id="' + esc(y) + '">' + esc(y) + (ys[y] ? ' •' : '') + '</button>').join('') + '</div>';
  const colF = ([k, l]) => '<div><label>' + l + '</label><div class="v5col"><input type="color" data-cdc="' + k + '" value="' + esc(cdHex(c[k], CD_DEF[k])) + '"><input data-cdx="' + k + '" dir="ltr" maxlength="7" value="' + esc(c[k]) + '"></div></div>';
  return tabs + (CDX.D.missing ? '<div class="card" style="border-color:#f59e0b;margin-bottom:12px"><b>⚠️ ملف db_38 لسه ما اتشغّلش في Supabase</b><p class="nt">تقدر تعدّل وتشوف المعاينة، لكن الحفظ مش هيشتغل لحد ما تشغّل db_38_cards_preview.sql.</p></div>' : '')
    + '<p class="nt">' + (CE.y === '' ? 'ده الشكل الأساسي لكل الصفوف. تقدر تدخل على صف معيّن وتغيّر فيه بس (علامة • معناها إن الصف ليه تصميم خاص).' : '🎯 بتعدّل تصميم كروت <b>' + esc(CE.y) + '</b> بس.') + ' <span id="cdSt" style="color:#f59e0b;font-weight:800"></span></p>'
    + '<div class="v5grid2"><div id="cdF"><div class="card"><b>👁️ إيه اللي يظهر</b><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:8px;margin-top:10px">' + CE_TOG.map(t => '<label class="v5tg"><input type="checkbox" data-cdf="' + t[0] + '"' + (c[t[0]] ? ' checked' : '') + '> ' + t[1] + '</label>').join('') + '</div></div>'
    + '<div class="card" style="margin-top:12px"><b>🔳 الباركود (QR)</b><p class="nt">الباركود بيحتوي على الكود بس. الطالب بيدوس 📷 في صفحة الاشتراك، الكاميرا بتكتب الكود في الخانة، وبعدين هو اللي بيدوس «تفعيل».</p>'
    + '<div class="bar" style="gap:12px;flex-wrap:wrap"><div><label>مكانه</label><select data-cd="qr_pos"><option value="left"' + (c.qr_pos === 'left' ? ' selected' : '') + '>شمال الكارت</option><option value="right"' + (c.qr_pos === 'right' ? ' selected' : '') + '>يمين الكارت</option></select></div>'
    + '<div><label>الحجم: <b id="cdQv">' + esc(c.qr_mm) + '</b> مم</label><input type="range" data-cd="qr_mm" min="12" max="26" step="1" value="' + esc(c.qr_mm) + '"></div></div></div>'
    + '<div class="card" style="margin-top:12px"><b>✏️ النصوص</b>' + CE_TXT.map(t => '<label>' + t[1] + '</label><input data-cd="' + t[0] + '" dir="auto" maxlength="80" value="' + esc(c[t[0]] || '') + '">').join('') + '</div>'
    + '<div class="card" style="margin-top:12px"><b>🎨 الألوان</b><div class="v5pal">' + CE_PAL.map((p, i) => '<button type="button" data-act="cdPal" data-id="' + i + '" title="' + esc(p[0]) + '">' + p[1].map(x => '<i style="background:' + x + '"></i>').join('') + '</button>').join('') + '</div>'
    + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px">' + CE_COL.map(colF).join('') + '</div>'
    + '<div class="bar" style="gap:12px;flex-wrap:wrap;margin-top:10px"><div><label>شكل الإطار</label><select data-cd="border"><option value="solid"' + (c.border === 'solid' ? ' selected' : '') + '>خط عادي</option><option value="dashed"' + (c.border === 'dashed' ? ' selected' : '') + '>منقّط</option><option value="none"' + (c.border === 'none' ? ' selected' : '') + '>بدون</option></select></div>'
    + '<div><label>تدوير الأطراف: <b id="cdRv">' + esc(c.radius_mm) + '</b> مم</label><input type="range" data-cd="radius_mm" min="0" max="8" step="1" value="' + esc(c.radius_mm) + '"></div></div></div>'
    + '<div class="bar" style="margin-top:14px;position:sticky;bottom:0;background:var(--bg);padding:10px 0"><button class="btn" data-act="cdSave">💾 حفظ</button>' + (CE.y ? '<button class="btn g" data-act="cdReset">↩️ رجّع ' + esc(CE.y) + ' للأساسي</button>' : '') + '<button class="btn s g" data-act="cdTest">🖨 اطبع كارت تجريبي</button></div></div>'
    + '<div><b style="display:block;margin-bottom:8px">👀 معاينة حية</b><div class="bar" style="margin:0 0 8px;gap:6px">' + [['10', '10 كروت في الورقة'], ['8', '8 كروت'], ['one', 'كارت واحد']].map(z => '<button class="yt' + (CE.size === z[0] ? ' on' : '') + '" data-act="cdSize" data-id="' + z[0] + '">' + z[1] + '</button>').join('') + '</div>'
    + '<div class="v5pv"><iframe id="cdPv" title="معاينة الكارت" style="width:100%;border:1px solid var(--line);border-radius:14px;background:#eef2f7"></iframe></div><p class="nt" style="margin-top:10px">كود المعاينة شكلي (XXXX-XXXX-XXXX) والباركود اللي فيه مش هيفعّل أي حاجة. المعاينة بتستخدم نفس الكود اللي بيطبع الكروت الحقيقية.</p></div></div>';
}
async function vCard() {
  if (typeof cdLoad !== 'function' || !window.QRX) throw new Error('ملف admin-v2.js أو qr.js ناقص أو قديم — ارفعهم كاملين في جذر الموقع وحدّث الصفحة');
  await cdLoad(true); CE.cur = ceEff(CE.y); CE.dirty = false; setTimeout(cePreview, 0); return ceForm();
}
const ceDiff = (cur, base) => { const o = {}; Object.keys(cur).forEach(k => { if (cur[k] !== base[k]) o[k] = cur[k]; }); return o; };
function ceSet(k, v) { CE.cur[k] = v; CE.dirty = true; const s = $('#cdSt'); if (s) s.textContent = '● فيه تعديلات لسه ما اتحفظتش'; ceSched(); }
document.addEventListener('input', e => {
  const t = e.target; if (!t || !t.dataset || !CE.cur || !$('#cdF')) return;
  if (t.dataset.cd) { let v = t.value; if (t.type === 'range') { v = +v; const o = $(t.dataset.cd === 'qr_mm' ? '#cdQv' : '#cdRv'); if (o) o.textContent = v; } ceSet(t.dataset.cd, v); }
  else if (t.dataset.cdc) { ceSet(t.dataset.cdc, t.value); const x = document.querySelector('[data-cdx="' + t.dataset.cdc + '"]'); if (x) x.value = t.value; }
  else if (t.dataset.cdx && /^#[0-9a-fA-F]{6}$/.test(t.value)) { ceSet(t.dataset.cdx, t.value.toLowerCase()); const x = document.querySelector('[data-cdc="' + t.dataset.cdx + '"]'); if (x) x.value = t.value.toLowerCase(); }
});
document.addEventListener('change', e => { const t = e.target; if (!t || !t.dataset || !CE.cur || !$('#cdF')) return; if (t.dataset.cdf) ceSet(t.dataset.cdf, t.checked); else if (t.dataset.cd && t.tagName === 'SELECT') ceSet(t.dataset.cd, t.value); });
async function ceSave(reset) {
  const sv = CDX.D.saved, out = { default: sv.default || {}, years: Object.assign({}, sv.years || {}) };
  if (CE.y === '') out.default = ceDiff(CE.cur, Object.assign({}, CD_DEF, CDX.D.defaults));
  else if (reset) delete out.years[CE.y];
  else { const d = ceDiff(CE.cur, ceBase()); if (Object.keys(d).length) out.years[CE.y] = d; else delete out.years[CE.y]; }
  const { error } = await sb.rpc('card_design_save', { p_design: out }); if (error) throw new Error((error.message || '').includes('function') ? 'شغّل ملف db_38_cards_preview.sql في Supabase الأول' : (error.message || '').includes('forbidden') ? 'مفيش صلاحية' : error.message);
  CDX.D.saved = out; CDX.D.missing = false; CE.cur = ceEff(CE.y); CE.dirty = false; toast('تم حفظ تصميم الكارت ✅ — بيظهر في الطباعة الجاية'); $('#view').innerHTML = ceForm(); applyActGate($('#view')); cePreview();
}
Object.assign(ACT, {
  cdY: id => { if (CE.dirty && !confirm('فيه تعديلات ما اتحفظتش، هتتمسح لو غيّرت الصف. تكمل؟')) return; CE.y = id || ''; CE.cur = ceEff(CE.y); CE.dirty = false; $('#view').innerHTML = ceForm(); applyActGate($('#view')); cePreview(); },
  cdPal: id => { const p = CE_PAL[+id]; if (!p) return; ['c1', 'c2', 'bg1', 'bg2', 'box_bg'].forEach((k, i) => { CE.cur[k] = p[1][i]; }); CE.cur.ink = p[1][0]; CE.dirty = true; $('#view').innerHTML = ceForm(); applyActGate($('#view')); cePreview(); const s = $('#cdSt'); if (s) s.textContent = '● فيه تعديلات لسه ما اتحفظتش'; },
  cdSize: id => { CE.size = id; document.querySelectorAll('[data-act="cdSize"]').forEach(b => b.classList.toggle('on', b.dataset.id === id)); cePreview(); },
  cdSave: () => ceSave(false),
  cdReset: () => { if (!confirm('هترجّع ' + CE.y + ' لتصميم «كل الصفوف»؟')) return; return ceSave(true); },
  cdTest: async () => { const D = cdSafe(CE.cur), o = ceSample(); printHTML(oneHTML(o, D), '', 'كارت تجريبي', D); }
});
Object.assign(ACTPERM, { cdSave: ['codes.generate'], cdReset: ['codes.generate'], cdPal: ['codes.generate'] });
VIEWS.xcard = ['تصميم الكارت', vCard];
if (typeof VPERM !== 'undefined') VPERM.xcard = ['codes.view'];
if (typeof NAV !== 'undefined' && !NAV.some(n => n[0] === 'xcard')) { const i = NAV.findIndex(n => n[0] === 'codes'); NAV.splice(i < 0 ? NAV.length : i + 1, 0, ['xcard', '🎴', 'تصميم الكارت']); }
// زرار في صفحة الأكواد يوصل لتصميم الكارت
const _vCodes5 = VIEWS.codes && VIEWS.codes[1];
if (_vCodes5) VIEWS.codes = [VIEWS.codes[0], async () => '<div class="bar" style="margin-bottom:12px"><button class="btn s g" data-act="cdOpen">🎴 تصميم شكل الكارت والباركود</button></div>' + await _vCodes5()];
Object.assign(ACT, { cdOpen: () => go('xcard') });

// ---------------------------------------------------------------- أدوات PDF (كلها في المتصفح — من غير قاعدة بيانات ولا رفع ملفات)
// 1) ورقة حل: كل سؤال في ورقة A4 + سطور للحل + هيدر (المدرس / الطالب / الصف / الكتاب).  2) استخراج أسئلة كنص جاهز للصق في منشئ الامتحان.
// المكتبات (pdf.js + pdf-lib) مرفوعة على موقعك نفسه في فولدر vendor — مفيش أي اتصال بمواقع خارجية.
const PT_KEY = 'pdf_tool_v1';
const PT = { tab: 'sheet', kind: 'pdf', imgs: [], doc: null, name: '', n: 0, lib: null, busy: false, cancel: false, pages: {}, out: null, cfg: null };
const PT_DEF = { teacher: 'Mr. Sherif Khafagy', student: '', grade: '', book: '', extra: '', pages: '', mode: 'whole', gap: 1.6, equal: 3, trim: true, ans: 50, style: 'grid', sp: 6, size: 'a5l', quality: 'normal', numq: true, ex_pages: '' };
const ptStore = () => { try { return JSON.parse(localStorage.getItem(PT_KEY) || '{}') || {}; } catch (e) { return {}; } };
const ptKeep = () => { try { const o = Object.assign({}, PT.cfg); delete o.pages; delete o.ex_pages; localStorage.setItem(PT_KEY, JSON.stringify(o)); } catch (e) {} };
const ptC = () => PT.cfg || (PT.cfg = Object.assign({}, PT_DEF, ptStore()));
const ptAr = s => String(s || '').replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
function ptCss() {
  if (document.getElementById('ptCss')) return; const s = document.createElement('style'); s.id = 'ptCss';
  s.textContent = `.ptdrop{display:flex;align-items:center;gap:12px;flex-wrap:wrap;border:2px dashed var(--line);border-radius:16px;padding:16px;background:var(--bg)}.ptdrop input[type=file]{flex:1;min-width:200px}
.ptg{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}.ptprog{height:10px;border-radius:99px;background:var(--line);overflow:hidden;margin:10px 0}.ptprog i{display:block;height:100%;width:0;background:var(--grad,var(--brand));transition:width .2s}
.ptth{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px;margin-top:12px}.ptp{border:1px solid var(--line);border-radius:14px;padding:8px;background:var(--card)}
.ptw{position:relative;line-height:0;cursor:crosshair;border-radius:8px;overflow:hidden;background:#fff;border:1px solid var(--line)}.ptw img{width:100%;display:block}
.ptc{position:absolute;left:0;right:0;height:0;border-top:2px dashed #ef4444;pointer-events:none}.ptc:after{content:'✂';position:absolute;right:2px;top:-11px;font-size:12px;color:#ef4444;line-height:1}
.ptn{position:absolute;left:4px;min-width:22px;height:22px;border-radius:99px;background:#0ea5e9;color:#fff;font:800 12px/22px system-ui;text-align:center;cursor:pointer;padding:0 5px;box-shadow:0 1px 4px rgba(0,0,0,.35)}.ptn.off{background:#94a3b8;text-decoration:line-through}
.ptm{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-top:6px;font-size:12.5px;font-weight:700;flex-wrap:wrap}.ptm button{padding:3px 9px;font-size:11.5px}
textarea.ptx{min-height:340px;width:100%;direction:auto;font-family:inherit;line-height:1.8}`;
  document.head.appendChild(s);
}
function ptScript(src) { return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('ملف ' + src + ' مش موجود — ارفع فولدر vendor كامل في جذر الموقع')); document.head.appendChild(s); }); }
async function ptLib() {
  if (PT.lib) return PT.lib;
  try { const m = await import('/vendor/pdfjs/pdf.min.mjs'); m.GlobalWorkerOptions.workerSrc = '/vendor/pdfjs/pdf.worker.min.mjs'; PT.lib = m; return m; }
  catch (e) { throw new Error('مكتبة قراءة الـPDF مش موجودة — ارفع فولدر vendor كامل في جذر الموقع'); }
}
async function ptLibLib() { if (!window.PDFLib) await ptScript('/vendor/pdf-lib.min.js'); return window.PDFLib; }
const ptStatus = (t, pct) => { document.querySelectorAll('.ptst').forEach(e => { e.textContent = t || ''; }); if (pct != null) document.querySelectorAll('.ptprog i').forEach(b => { b.style.width = pct + '%'; }); };
const ptYield = () => new Promise(r => setTimeout(r, 0));

function ptRange(txt, n) {
  const set = new Set(); const t = ptAr(txt).trim();
  if (!t) { for (let i = 1; i <= n; i++) set.add(i); }
  else t.split(/[,،\s]+/).filter(Boolean).forEach(p => { const m = p.match(/^(\d+)(?:-(\d+))?$/); if (!m) throw new Error('صيغة الصفحات غلط: «' + p + '» — اكتبها زي 1-5,8,10-12'); let a = +m[1], b = m[2] ? +m[2] : a; if (a > b) [a, b] = [b, a]; for (let i = Math.max(1, a); i <= Math.min(n, b); i++) set.add(i); });
  const l = [...set].sort((x, y) => x - y); if (!l.length) throw new Error('الصفحات اللي كتبتها مش موجودة في الملف (الملف فيه ' + n + ' صفحة)'); return l;
}
async function ptRender(no, width) {
  if (PT.kind === 'img') {
    const bmp = await createImageBitmap(PT.imgs[no - 1]), w = Math.min(width, bmp.width), h = Math.round(bmp.height * w / bmp.width), c = document.createElement('canvas'); c.width = w; c.height = Math.min(h, 12000);
    const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, c.height); ctx.drawImage(bmp, 0, 0, w, c.height); try { bmp.close(); } catch (e) {} return c;
  }
  const page = await PT.doc.getPage(no), v1 = page.getViewport({ scale: 1 });
  let scale = width / v1.width; const px = v1.width * v1.height * scale * scale; if (px > 26e6) scale *= Math.sqrt(26e6 / px);
  const vp = page.getViewport({ scale }), c = document.createElement('canvas'); c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height);
  const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
  await page.render({ canvasContext: ctx, canvas: c, viewport: vp }).promise; try { page.cleanup(); } catch (e) {} return c;
}
// صفوف فيها حبر (لتحديد الفراغات بين الأسئلة)
function ptFlags(c) {
  const w = c.width, h = c.height, d = c.getContext('2d').getImageData(0, 0, w, h).data, f = new Uint8Array(h), thr = Math.max(2, Math.floor(w * 0.004));
  for (let y = 0; y < h; y++) { let n = 0; const o = y * w * 4; for (let x = 0; x < w; x++) { const i = o + x * 4; if ((d[i] * 299 + d[i + 1] * 587 + d[i + 2] * 114) / 1000 < 215) n++; } f[y] = n > thr ? 1 : 0; }
  return f;
}
function ptAutoCuts(f, gapPct) {
  const h = f.length, min = Math.max(4, Math.round(h * gapPct / 100)); let first = -1, last = -1; for (let i = 0; i < h; i++) if (f[i]) { if (first < 0) first = i; last = i; }
  const cuts = []; if (first < 0) return cuts; let i = first;
  while (i <= last) { if (!f[i]) { let j = i; while (j <= last && !f[j]) j++; if (j - i >= min) cuts.push(((i + j) / 2) / h); i = j; } else i++; }
  return cuts;
}
// الأسئلة (القطع) في صفحة: [{y0,y1}] مقصوصة على الحبر الفعلي، والفاضي بيتشال
function ptPieces(no) {
  const P = PT.pages[no]; if (!P) return [{ y0: 0, y1: 1 }]; const h = P.flags.length, b = [0].concat(P.cuts.slice().sort((x, y) => x - y), [1]), out = [], pad = Math.round(h * 0.008);
  for (let k = 0; k + 1 < b.length; k++) {
    let a = Math.round(b[k] * h), z = Math.round(b[k + 1] * h), fa = -1, fz = -1; for (let y = a; y < z; y++) if (P.flags[y]) { if (fa < 0) fa = y; fz = y; }
    if (fa < 0) continue; if (ptC().trim) { a = Math.max(a, fa - pad); z = Math.min(z, fz + pad + 1); }
    out.push({ y0: a / h, y1: z / h, k: out.length });
  }
  return out;
}
async function ptPrepare(list) {
  const cfg = ptC(); let i = 0;
  for (const no of list) {
    if (PT.cancel) break; ptStatus('بجهّز صفحة ' + no + ' (' + (++i) + '/' + list.length + ')…', Math.round(i / list.length * 100));
    if (!PT.pages[no]) { const c = await ptRender(no, 700), flags = ptFlags(c); const t = document.createElement('canvas'); t.width = 420; t.height = Math.round(c.height * 420 / c.width); t.getContext('2d').drawImage(c, 0, 0, t.width, t.height);
      PT.pages[no] = { flags, thumb: t.toDataURL('image/jpeg', .7), cuts: cfg.mode === 'auto' ? ptAutoCuts(flags, +cfg.gap || 1.6) : [], skip: {} }; c.width = c.height = 1; }
    await ptYield();
  }
}
function ptThumb(no) {
  const P = PT.pages[no]; if (!P) return ''; const ps = ptPieces(no), skip = P.skip || {};
  return '<div class="ptp" data-p="' + no + '"><div class="ptw" data-p="' + no + '"><img src="' + P.thumb + '" alt="">' + P.cuts.map(c => '<i class="ptc" style="top:' + (c * 100).toFixed(2) + '%"></i>').join('')
    + ps.map(x => '<b class="ptn' + (skip[x.k] ? ' off' : '') + '" data-p="' + no + '" data-k="' + x.k + '" style="top:calc(' + (x.y0 * 100).toFixed(2) + '% + 4px)" title="دوس لاستبعاد/إرجاع السؤال ده">' + (x.k + 1) + '</b>').join('') + '</div>'
    + '<div class="ptm"><span>ص ' + no + ' • ' + ps.filter(x => !skip[x.k]).length + ' سؤال</span><span><button class="btn s g" data-act="ptAuto" data-id="' + no + '">تلقائي</button> <button class="btn s g" data-act="ptClear" data-id="' + no + '">مسح</button></span></div></div>';
}
function ptCount() {
  let n = 0; try { const list = ptRange(ptC().pages, PT.n); list.forEach(no => { if (ptC().mode === 'whole' || !PT.pages[no]) n += 1; else { const P = PT.pages[no]; n += ptPieces(no).filter(x => !(P.skip || {})[x.k]).length; } }); } catch (e) { return null; } return n;
}
function ptRefreshCount() { const e = $('#ptCnt'); if (!e) return; const n = ptCount(); e.textContent = n == null ? '' : '📄 هيطلع ' + n + ' ورقة'; }

// ------- هيدر الورقة (بيترسم Canvas عشان الشكل العربي يطلع سليم) -------
async function ptHeader(o, wPt, hPt) {
  const k = 4, c = document.createElement('canvas'); c.width = Math.round(wPt * k); c.height = Math.round(hPt * k); const x = c.getContext('2d'), sc = hPt / 56; x.scale(sc, sc); const W = c.width / sc;
  x.textBaseline = 'alphabetic'; const ink = '#0f172a', mut = '#475569', F = 'Cairo, Tahoma, Arial, sans-serif';
  const R = W - 6, L = 6;
  x.direction = 'ltr'; x.textAlign = 'left'; x.fillStyle = ink; x.font = '700 ' + 15 * k + 'px Poppins, Cairo, Arial'; x.fillText(o.teacher || '', L, 17 * k, W * .45);
  x.direction = 'rtl'; x.textAlign = 'right'; x.font = '800 ' + 14.5 * k + 'px ' + F; x.fillText(o.book ? 'الكتاب: ' + o.book : '', R, 17 * k, W * .52);
  const y2 = 37 * k; x.font = '800 ' + 12 * k + 'px ' + F; x.fillStyle = ink;
  const lbl = 'اسم الطالب: ', lw = x.measureText(lbl).width; x.fillText(lbl, R, y2); const sx = R - lw - 6, sw = W * .45;
  if (o.student) { x.font = '700 ' + 12 * k + 'px ' + F; x.fillText(o.student, sx, y2, sw - lw); } else { x.strokeStyle = '#64748b'; x.lineWidth = k * .6; x.setLineDash([k * 1.2, k * 2]); x.beginPath(); x.moveTo(sx, y2 + 2 * k); x.lineTo(sx - (sw - lw), y2 + 2 * k); x.stroke(); x.setLineDash([]); }
  x.textAlign = 'center'; x.font = '800 ' + 12 * k + 'px ' + F; x.fillText(o.grade ? 'الصف: ' + o.grade : '', W * .38, y2, W * .26);
  x.direction = 'ltr'; x.textAlign = 'left'; x.fillStyle = mut; x.font = '700 ' + 10.5 * k + 'px ' + F; x.fillText(o.tag || '', L, y2, W * .26);
  x.fillStyle = '#ef4444'; x.fillRect(0, 56 * k - 2 * k, W, 1.2 * k);
  return new Promise(r => c.toBlob(async b => r(new Uint8Array(await b.arrayBuffer())), 'image/png'));
}
const ptJpg = (c, q) => new Promise(r => c.toBlob(async b => r(new Uint8Array(await b.arrayBuffer())), 'image/jpeg', q));

async function ptMake() {
  if (!PT.doc) throw new Error('اختار ملف PDF الأول'); if (PT.busy) return; const cfg = ptC(); ptKeep();
  const list = ptRange(cfg.pages, PT.n); if (list.length > 400) throw new Error('الحد الأقصى 400 صفحة في المرة');
  PT.busy = true; PT.cancel = false; PT.out = null; $('#ptRes').innerHTML = '<div class="ptprog"><i></i></div><div class="nt ptst"></div><button class="btn s g" data-act="ptCancel">إلغاء</button>';
  try {
    const PL = await ptLibLib();
    if (cfg.mode !== 'whole') await ptPrepare(list.filter(no => !PT.pages[no]));
    const pdf = await PL.PDFDocument.create(), SZ = { a5l: [595.28, 419.53], a4p: [595.28, 841.89], a4l: [841.89, 595.28] }[cfg.size] || [595.28, 419.53], pw = SZ[0], ph = SZ[1], half = ph < 500, mg = half ? 20 : 28, hh = half ? 40 : 56, cw = pw - 2 * mg, W = cfg.quality === 'high' ? 2100 : cfg.quality === 'low' ? 1100 : 1500, q = cfg.quality === 'high' ? .92 : cfg.quality === 'low' ? .75 : .85;
    const sp = Math.max(5, Math.min(14, +cfg.sp || 8)) * 2.835, ansMin = Math.max(15, Math.min(80, +cfg.ans || 40)) / 100, rgb = PL.rgb;
    try { await document.fonts.load('800 40px Cairo'); await document.fonts.load('700 40px Poppins'); } catch (e) {}
    let made = 0; const total = ptCount() || list.length, hdrCache = {};
    for (const no of list) {
      if (PT.cancel) break; const P = PT.pages[no], pieces = cfg.mode === 'whole' || !P ? [{ y0: 0, y1: 1, k: 0 }] : ptPieces(no).filter(x => !(P.skip || {})[x.k]); if (!pieces.length) continue;
      ptStatus('بعمل صفحة ' + no + '…', Math.round(made / Math.max(1, total) * 100)); const src = await ptRender(no, W);
      for (const pc of pieces) {
        if (PT.cancel) break; const sy = Math.round(pc.y0 * src.height), sh = Math.max(8, Math.round((pc.y1 - pc.y0) * src.height)), cr = document.createElement('canvas'); cr.width = src.width; cr.height = sh;
        const cx = cr.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, cr.width, sh); cx.drawImage(src, 0, sy, src.width, sh, 0, 0, src.width, sh);
        made++; const page = pdf.addPage([pw, ph]);
        const hb = await ptHeader({ teacher: cfg.teacher, student: cfg.student, grade: cfg.grade, book: cfg.book || PT.name, tag: (cfg.numq ? 'سؤال ' + made + ' • ' : '') + (PT.kind === 'img' ? 'صورة ' : 'ص ') + no }, cw, hh);
        page.drawImage(await pdf.embedPng(hb), { x: mg, y: ph - mg - hh, width: cw, height: hh });
        const top = ph - mg - hh - 10, maxH = (top - mg) * (1 - ansMin); let dw = cw, dh = dw * sh / cr.width; if (dh > maxH) { dh = maxH; dw = dh * cr.width / sh; }
        const img = await pdf.embedJpg(await ptJpg(cr, q)); const ix = mg + (cw - dw) / 2; page.drawImage(img, { x: ix, y: top - dh, width: dw, height: dh });
        page.drawRectangle({ x: ix, y: top - dh, width: dw, height: dh, borderColor: rgb(.85, .87, .9), borderWidth: .6 });
        const y0 = top - dh - 14, yEnd = mg + 6, col = rgb(.62, .66, .72);
        if (cfg.style !== 'blank') {
          if (cfg.style === 'grid') { const nx = Math.max(1, Math.round(cw / sp)), sx = cw / nx, ny = Math.max(0, Math.floor((y0 - yEnd) / sp)), yb = y0 - ny * sp; for (let i = 0; i <= ny; i++) { const y = y0 - i * sp; page.drawLine({ start: { x: mg, y }, end: { x: pw - mg, y }, thickness: .4, color: col }); } for (let i = 0; i <= nx; i++) { const x = mg + i * sx; page.drawLine({ start: { x, y: y0 }, end: { x, y: yb }, thickness: .4, color: col }); } }
          else for (let y = y0; y >= yEnd; y -= sp) page.drawLine({ start: { x: mg, y }, end: { x: pw - mg, y }, thickness: .6, color: col, dashArray: cfg.style === 'dots' ? [1.2, 2.6] : undefined });
        }
        cr.width = cr.height = 1; await ptYield();
      }
      src.width = src.height = 1;
    }
    if (PT.cancel) { $('#ptRes').innerHTML = '<p class="nt">اتلغت العملية.</p>'; PT.busy = false; return; }
    ptStatus('بجهّز الملف…', 100); const bytes = await pdf.save(), blob = new Blob([bytes], { type: 'application/pdf' }); PT.out = { blob, name: 'ورقة حل - ' + (cfg.book || PT.name) + '.pdf', n: made };
    $('#ptRes').innerHTML = '<div class="card" style="border-color:var(--ok,#22c55e)"><b>✅ جاهز: ' + made + ' ورقة (' + (blob.size / 1048576).toFixed(1) + ' ميجا)</b><div class="bar" style="margin-top:10px"><button class="btn" data-act="ptDl">⬇️ تنزيل PDF</button><button class="btn s g" data-act="ptView">👁 فتح للمعاينة</button></div><p class="nt">الملف اتعمل في جهازك بس. اطبعه أو صوّره للطلاب.</p></div>';
  } catch (e) { $('#ptRes').innerHTML = ''; throw e; } finally { PT.busy = false; }
}

// ------- استخراج الأسئلة كنص -------
async function ptExtract() {
  if (!PT.doc) throw new Error('اختار ملف PDF الأول'); if (PT.kind === 'img') throw new Error('الصور مفيهاش نص — استخدم تبويب «ورقة حل»، أو اكتب الأسئلة من الصور'); const list = ptRange(ptC().ex_pages, PT.n); if (list.length > 400) throw new Error('الحد الأقصى 400 صفحة'); PT.busy = true; PT.cancel = false;
  $('#ptXRes').innerHTML = '<div class="ptprog"><i></i></div><div class="nt ptst"></div>'; const lines = []; let items = 0;
  try {
    for (let i = 0; i < list.length; i++) {
      ptStatus('بقرا صفحة ' + list[i] + '…', Math.round((i + 1) / list.length * 100)); const pg = await PT.doc.getPage(list[i]), tc = await pg.getTextContent(); let cur = '', lastY = null;
      for (const it of tc.items) { if (!('str' in it)) continue; items += it.str.trim() ? 1 : 0; const y = it.transform ? it.transform[5] : 0; if (lastY !== null && Math.abs(y - lastY) > 3 && cur.trim()) { lines.push(cur); cur = ''; } cur += it.str; lastY = y; if (it.hasEOL) { if (cur.trim()) lines.push(cur); cur = ''; lastY = null; } }
      if (cur.trim()) lines.push(cur); lines.push('\u0000PAGE'); try { pg.cleanup(); } catch (e) {} await ptYield();
    }
    if (!items) { $('#ptXRes').innerHTML = '<div class="card" style="border-color:#f59e0b"><b>⚠️ الصفحات دي صور (سكانر) مفيهاش نص</b><p class="nt">استخراج النص مش هيشتغل مع الكتب المصوّرة. استخدم تبويب «ورقة حل» عشان تطلع كل سؤال في ورقة، أو اكتب الأسئلة من الصور.</p></div>'; return; }
    const text = ptSplitQs(lines), cnt = (text.match(/(^|\n\n)\s*\d+\./g) || []).length;
    $('#ptXRes').innerHTML = '<div class="card"><b>📝 ' + cnt + ' سؤال اتعرّف</b><p class="nt">راجع النص وعدّل اللي محتاج تعديل، وبعدين انسخه والصقه في «لصق أسئلة» جوه منشئ الامتحان. (الاختيارات بتبدأ بـ A) والإجابة الصحيحة بتتحدد في المنشئ أو بسطر Answer: B).</p><textarea class="ptx" id="ptTxt" dir="auto"></textarea><div class="bar" style="margin-top:10px"><button class="btn" data-act="ptCopy">📋 نسخ النص</button><button class="btn s g" data-act="ptTxtDl">⬇️ تنزيل .txt</button><button class="btn s g" data-act="ptOpenB">📘 فتح منشئ الامتحان</button></div></div>';
    $('#ptTxt').value = text;
  } catch (e) { $('#ptXRes').innerHTML = ''; throw e; } finally { PT.busy = false; }
}
function ptSplitQs(lines) {
  const qs = []; let cur = null, brk = false; const qRe = /^\s*(?:(?:Q(?:uestion)?|السؤال|س)\s*)?\(?(\d{1,3})\s*[.)\-:–]\s*(\S.*)$/i, oRe = /^\s*\(?([A-Da-d]|[أ-د])\s*[.)]\s*(\S.*)$/, ansRe = /^\s*(Answer|Ans|الإجابة|الاجابة)\s*[:：]/i;
  const AR = { 'أ': 'A', 'ب': 'B', 'ج': 'C', 'د': 'D' };
  for (const raw of lines) {
    if (raw === '\u0000PAGE') { brk = true; continue; } const l = ptAr(raw).replace(/\s+/g, ' ').trim(); if (!l || /^\d{1,3}$/.test(l)) continue;
    const q = l.match(qRe), o = l.match(oRe);
    if (q) { brk = false; if (cur) qs.push(cur); cur = { n: q[1], t: q[2], opts: [], extra: [] }; }
    else if (o && cur) { brk = false; cur.opts.push((AR[o[1]] || o[1].toUpperCase()) + ') ' + o[2]); }
    else if (cur && ansRe.test(l)) { brk = false; cur.extra.push(l); }
    else if (cur && brk) continue;   // عنوان/ترقيم أعلى الصفحة الجديدة
    else if (cur) { if (cur.extra.length) cur.extra[cur.extra.length - 1] += ' ' + l; else if (cur.opts.length) cur.opts[cur.opts.length - 1] += ' ' + l; else cur.t += ' ' + l; }
  }
  if (cur) qs.push(cur); return qs.map(q => q.n + '. ' + q.t + (q.opts.length ? '\n' + q.opts.join('\n') : '') + (q.extra.length ? '\n' + q.extra.join('\n') : '')).join('\n\n');
}

// ------- الواجهة -------
function ptInfo() { const e = $('#ptInfo'); if (!e) return; e.innerHTML = PT.doc ? '<span class="pill ok">📄 ' + esc(PT.name) + ' — ' + PT.n + (PT.kind === 'img' ? ' صورة' : ' صفحة') + '</span>' : ''; }
function ptBody() {
  const c = ptC(), b = $('#ptBody'); if (!b) return; if (!PT.doc) { b.innerHTML = '<div class="empty" style="padding:26px">اختار ملف PDF من فوق عشان تبدأ</div>'; return; }
  const F = (k, l, ex, type) => '<div><label>' + l + '</label><input data-pt="' + k + '" ' + (type === 'number' ? 'type="number" ' : '') + 'value="' + esc(c[k] == null ? '' : c[k]) + '" ' + (ex || '') + '></div>';
  const S = (k, l, opts) => '<div><label>' + l + '</label><select data-pt="' + k + '">' + opts.map(o => '<option value="' + o[0] + '"' + (String(c[k]) === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select></div>';
  if (PT.tab === 'text') {
    b.innerHTML = '<div class="card"><b>📝 استخراج الأسئلة كنص</b><p class="nt">بيقرا النص اللي جوه الـPDF (للكتب اللي نصها ينفع يتحدد بالماوس) ويقسمه لأسئلة واختيارات. مفيش حاجة بتتبعت لأي سيرفر.</p><div class="ptg">' + F('ex_pages', '📄 الصفحات (فاضي = كلها)', 'placeholder="مثال: 3-7,10" dir="ltr"') + '</div><div class="bar" style="margin-top:12px"><button class="btn" data-act="ptExtract">🔍 استخراج الأسئلة</button></div></div><div id="ptXRes" style="margin-top:12px"></div>'; return;
  }
  b.innerHTML = '<div class="card"><b>⚙️ إعدادات الورقة</b><div class="ptg" style="margin-top:8px">'
    + F('pages', '📄 الصفحات (فاضي = كلها)', 'placeholder="مثال: 3-7,10" dir="ltr"') + S('mode', '✂️ تقسيم الصفحة', [['whole', 'كل صفحة = ورقة واحدة'], ['auto', 'تلقائي (أقسم على الفراغات)'], ['manual', 'يدوي (أنا بحدد الخطوط)']])
    + F('teacher', '👨‍🏫 اسم المدرس', 'maxlength="60"') + F('student', '👤 اسم الطالب (فاضي = سطر فاضي يكتب عليه)', 'maxlength="60"') + '<div><label>🎓 الصف</label><input data-pt="grade" list="ptYears" maxlength="40" value="' + esc(c.grade) + '"><datalist id="ptYears">' + YEARS.map(y => '<option value="' + esc(y) + '">').join('') + '</datalist></div>'
    + F('book', '📚 اسم الكتاب (فاضي = اسم الملف)', 'maxlength="80"') + '</div></div>'
    + '<div class="card" style="margin-top:12px"><b>✍️ مكان الحل</b><div class="ptg" style="margin-top:8px">' + S('size', '📐 حجم الورقة', [['a5l', 'نص ورقة A4 أفقي (للتصوير)'], ['a4p', 'A4 عمودي'], ['a4l', 'A4 أفقي']]) + S('style', 'شكل الخطوط', [['lines', 'سطور'], ['dots', 'سطور منقّطة'], ['grid', 'مربعات'], ['blank', 'فاضي']]) + F('sp', 'المسافة بين السطور (مم)', 'min="5" max="14"', 'number') + F('ans', 'أقل مساحة للحل % من الورقة', 'min="15" max="80"', 'number')
    + S('quality', 'جودة صورة السؤال', [['low', 'خفيفة (ملف صغير)'], ['normal', 'عادية'], ['high', 'عالية']]) + '<div><label>&nbsp;</label><label class="chk" style="margin:6px 0 0"><input type="checkbox" class="ck" data-ptc="numq"' + (c.numq ? ' checked' : '') + '> رقم السؤال على الهيدر</label></div></div></div>'
    + '<div id="ptCutBox" style="margin-top:12px"></div><div class="bar" style="margin-top:12px;align-items:center"><button class="btn" data-act="ptMake">🧾 اعمل ملف الـPDF</button><span id="ptCnt" class="pill"></span></div><div id="ptRes" style="margin-top:12px"></div>';
  ptCutBox(); ptRefreshCount();
}
function ptCutBox() {
  const box = $('#ptCutBox'); if (!box) return; const c = ptC(); if (c.mode === 'whole') { box.innerHTML = ''; return; }
  const list = (() => { try { return ptRange(c.pages, PT.n); } catch (e) { return []; } })();
  box.innerHTML = '<div class="card"><b>✂️ تقسيم الأسئلة</b><p class="nt">' + (c.mode === 'auto' ? 'اتحددت الفراغات بين الأسئلة تلقائي.' : 'دوس على الصورة في المكان اللي عايز تقص فيه.') + ' دوس على خط ✂ عشان تمسحه، ودوس على الرقم الأزرق عشان تستبعد القطعة (زي العناوين).</p>'
    + '<div class="ptg"><div><label>حساسية الفراغ (%) <small>أقل = قص أكتر</small></label><input type="number" data-pt="gap" min="0.5" max="8" step="0.1" value="' + esc(c.gap) + '"></div><div><label>تقسيم متساوي لعدد</label><input type="number" data-pt="equal" min="2" max="12" value="' + esc(c.equal) + '"></div><div><label>&nbsp;</label><label class="chk" style="margin:6px 0 0"><input type="checkbox" class="ck" data-ptc="trim"' + (c.trim ? ' checked' : '') + '> قص الفراغ الزيادة</label></div></div>'
    + '<div class="bar" style="margin-top:10px"><button class="btn s" data-act="ptPrep">🖼 تجهيز / تحديث المعاينة</button><button class="btn s g" data-act="ptAutoAll">✂️ تقسيم تلقائي للكل</button><button class="btn s g" data-act="ptEqAll">➗ تقسيم متساوي للكل</button><button class="btn s g" data-act="ptClearAll">🧹 مسح كل الخطوط</button></div>'
    + '<div class="nt ptst"></div><div class="ptprog" id="ptProgC" style="display:none"><i></i></div><div class="ptth" id="ptThumbs">' + list.filter(no => PT.pages[no]).slice(0, 150).map(ptThumb).join('') + '</div></div>';
}
function ptRedraw(no) { const e = document.querySelector('.ptp[data-p="' + no + '"]'); if (e) e.outerHTML = ptThumb(no); ptRefreshCount(); }
async function vPdf() { ptCss(); PT.cfg = null; ptC(); setTimeout(() => { ptInfo(); ptBody(); }, 0); return '<div class="card"><b>📄 أدوات PDF</b><p class="nt">كل الشغل بيحصل في متصفحك — الملف <b>ما بيترفعش</b> لأي سيرفر ومفيش أي حمل على قاعدة البيانات. أقصى حجم 80 ميجا.</p>'
  + '<div class="ytabs"><button class="yt' + (PT.tab === 'sheet' ? ' on' : '') + '" data-act="ptTab" data-id="sheet">🧾 ورقة حل لكل سؤال</button><button class="yt' + (PT.tab === 'text' ? ' on' : '') + '" data-act="ptTab" data-id="text">📝 استخراج الأسئلة كنص</button></div>'
  + '<div class="ptdrop"><input type="file" id="ptFile" accept="application/pdf,.pdf,image/png,image/jpeg,image/webp" multiple><small style="color:var(--muted)">PDF واحد، أو صورة / كذا صورة (PNG, JPG)</small><span id="ptInfo"></span></div></div><div id="ptBody" style="margin-top:12px"></div>'; }
document.addEventListener('change', async e => {
  const t = e.target; if (!t || !$('#ptBody')) return;
  if (t.id === 'ptFile') { const f = t.files && t.files.length ? [...t.files] : null; if (!f) return; try { await ptOpenFile(f); } catch (x) { toast(x.message || 'تعذّر فتح الملف', true); } return; }
  if (t.dataset.ptc) { PT.cfg[t.dataset.ptc] = t.checked; ptKeep(); if (t.dataset.ptc === 'trim') ptCutBox(); ptRefreshCount(); }
  else if (t.dataset.pt) { const k = t.dataset.pt; PT.cfg[k] = t.type === 'number' ? +t.value : t.value; ptKeep(); if (k === 'mode') { ptCutBox(); } ptRefreshCount(); }
});
document.addEventListener('input', e => { const t = e.target; if (!t || !t.dataset || !t.dataset.pt || !$('#ptBody') || t.tagName === 'SELECT') return; PT.cfg[t.dataset.pt] = t.type === 'number' ? +t.value : t.value; if (t.dataset.pt === 'pages') ptRefreshCount(); });
async function ptOpenFile(files) {
  const arr = Array.isArray(files) ? files : [files], isImg = f => /^image\/(png|jpe?g|webp)$/.test(f.type) || /\.(png|jpe?g|webp)$/i.test(f.name), isPdf = f => f.type === 'application/pdf' || /\.pdf$/i.test(f.name);
  if (PT.doc && PT.kind === 'pdf') { try { PT.doc.destroy(); } catch (e) {} } PT.doc = null; PT.imgs = [];
  if (arr.every(isImg)) {
    if (arr.length > 200) throw new Error('الحد الأقصى 200 صورة'); if (arr.reduce((t, f) => t + f.size, 0) > 150 * 1048576) throw new Error('حجم الصور أكبر من 150 ميجا');
    const imgs = arr.slice().sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })); try { const t = await createImageBitmap(imgs[0]); t.close(); } catch (e) { throw new Error('الصورة دي مش سليمة'); }
    PT.kind = 'img'; PT.imgs = imgs; PT.doc = { img: true }; PT.n = imgs.length; PT.name = imgs.length === 1 ? imgs[0].name.replace(/\.[^.]+$/, '') : 'صور'; PT.pages = {}; PT.out = null; PT.cfg.pages = ''; PT.cfg.ex_pages = ''; ptInfo(); ptBody(); return;
  }
  const file = arr[0]; if (arr.length !== 1 || !isPdf(file)) throw new Error('اختار ملف PDF واحد، أو صور (PNG / JPG) بس'); if (file.size > 80 * 1048576) throw new Error('الملف أكبر من 80 ميجا');
  const lib = await ptLib(); toast('بفتح الملف…'); const buf = new Uint8Array(await file.arrayBuffer());
  let doc; try { doc = await lib.getDocument({ data: buf, isEvalSupported: false, enableXfa: false, standardFontDataUrl: '/vendor/pdfjs/standard_fonts/', useSystemFonts: true }).promise; }
  catch (e) { throw new Error(e && e.name === 'PasswordException' ? 'الملف محمي بباسورد — شيل الحماية الأول' : 'الملف ده مش PDF سليم'); }
  PT.kind = 'pdf'; PT.doc = doc; PT.n = doc.numPages; PT.name = file.name.replace(/\.pdf$/i, ''); PT.pages = {}; PT.out = null; PT.cfg.pages = ''; PT.cfg.ex_pages = ''; ptInfo(); ptBody();
}
document.addEventListener('click', e => {
  const n = e.target.closest && e.target.closest('.ptn'); const w = e.target.closest && e.target.closest('.ptw');
  if (n && $('#ptThumbs')) { e.stopPropagation(); const no = +n.dataset.p, k = +n.dataset.k, P = PT.pages[no]; if (P) { P.skip = P.skip || {}; P.skip[k] = !P.skip[k]; ptRedraw(no); } return; }
  if (w && $('#ptThumbs')) { const no = +w.dataset.p, P = PT.pages[no]; if (!P) return; const r = w.getBoundingClientRect(), y = (e.clientY - r.top) / r.height; if (y < 0 || y > 1) return;
    const near = P.cuts.findIndex(c => Math.abs(c - y) * r.height < 9); if (near >= 0) P.cuts.splice(near, 1); else { P.cuts.push(y); P.cuts.sort((a, b) => a - b); } P.skip = {}; ptRedraw(no); }
});
Object.assign(ACT, {
  ptTab: id => { PT.tab = id === 'text' ? 'text' : 'sheet'; document.querySelectorAll('[data-act="ptTab"]').forEach(b => b.classList.toggle('on', b.dataset.id === PT.tab)); ptBody(); },
  ptMake: () => ptMake(), ptExtract: () => ptExtract(), ptCancel: () => { PT.cancel = true; },
  ptDl: () => { if (!PT.out) return; const a = document.createElement('a'); a.href = URL.createObjectURL(PT.out.blob); a.download = PT.out.name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 20000); },
  ptView: () => { if (!PT.out) return; const u = URL.createObjectURL(PT.out.blob); window.open(u, '_blank'); setTimeout(() => URL.revokeObjectURL(u), 120000); },
  ptPrep: async () => { if (PT.busy) return; const list = ptRange(ptC().pages, PT.n); if (list.length > 150) throw new Error('المعاينة لحد 150 صفحة — حدّد صفحات أقل'); PT.busy = true; PT.cancel = false; const pr = $('#ptProgC'); if (pr) pr.style.display = ''; try { await ptPrepare(list); } finally { PT.busy = false; } if (pr) pr.style.display = 'none'; ptStatus(''); ptCutBox(); ptRefreshCount(); },
  ptAuto: id => { const P = PT.pages[+id]; if (!P) return; P.cuts = ptAutoCuts(P.flags, +ptC().gap || 1.6); P.skip = {}; ptRedraw(+id); },
  ptClear: id => { const P = PT.pages[+id]; if (!P) return; P.cuts = []; P.skip = {}; ptRedraw(+id); },
  ptAutoAll: () => { Object.keys(PT.pages).forEach(no => { const P = PT.pages[no]; P.cuts = ptAutoCuts(P.flags, +ptC().gap || 1.6); P.skip = {}; }); ptCutBox(); ptRefreshCount(); },
  ptEqAll: () => { const n = Math.max(2, Math.min(12, +ptC().equal || 3)); Object.keys(PT.pages).forEach(no => { const P = PT.pages[no]; P.cuts = []; for (let i = 1; i < n; i++) P.cuts.push(i / n); P.skip = {}; }); ptCutBox(); ptRefreshCount(); },
  ptClearAll: () => { Object.keys(PT.pages).forEach(no => { PT.pages[no].cuts = []; PT.pages[no].skip = {}; }); ptCutBox(); ptRefreshCount(); },
  ptCopy: async () => { const t = $('#ptTxt'); if (!t) return; try { await navigator.clipboard.writeText(t.value); toast('اتنسخ ✅ — الصقه في «لصق أسئلة»'); } catch (e) { t.select(); document.execCommand('copy'); toast('اتنسخ ✅'); } },
  ptTxtDl: () => { const t = $('#ptTxt'); if (!t) return; const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([t.value], { type: 'text/plain;charset=utf-8' })); a.download = 'أسئلة - ' + PT.name + '.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 5000); },
  ptOpenB: () => go('exams')
});
VIEWS.xpdf = ['أدوات PDF', vPdf];
if (typeof VPERM !== 'undefined') VPERM.xpdf = ['g:content'];
if (typeof NAV !== 'undefined' && !NAV.some(n => n[0] === 'xpdf')) { const i = NAV.findIndex(n => n[0] === 'xbuild' || n[0] === 'bulk' || n[0] === 'exams'); NAV.splice(i < 0 ? NAV.length : i + 1, 0, ['xpdf', '📄', 'أدوات PDF']); }
// ---------------------------------------------------------------- فتح كورس لطلاب بدون كود
(function () {
'use strict';
const OC = { y: '', cid: '', all: false, notify: true, D: null, q: '', f: 'all', sel: new Set(), busy: false };
const oErr = e => { const m = (e && e.message) || String(e || ''); const T = [['does not exist', 'شغّل ملف db_41 في Supabase الأول'], ['schema cache', 'شغّل ملف db_41 في Supabase الأول'], ['forbidden', 'مفيش عندك صلاحية للإجراء ده'], ['too_many', 'الحد الأقصى 500 طالب في المرة'], ['not_found', 'الكورس مش موجود']]; const t = T.find(x => m.includes(x[0])); return t ? t[1] : m; };
const ocCourses = () => (S.courses || []).filter(c => !OC.y || c.academic_year === OC.y || !c.academic_year);

VIEWS.xopen = ['فتح كورس بدون كود', async () => {
  if (!S.courses) await loadCourses(); OC.y = OC.y || YEARS[0]; setTimeout(ocRefresh);
  return '<div class="note" style="margin:0 0 14px">🔓 اختار الصف ← الكورس ← الطلاب، وادوس <b>فتح</b>. الكورس بيتفتح للطالب من غير كود، وبيلاقيه في «كورساتي» ويدخله عادي. تقدر <b>تسحبه</b> بنفس الطريقة.</div><div id="ocTop"></div><div id="ocBody"></div>';
}];
VPERM.xopen = ['g:students'];

function ocTop() {
  const top = $('#ocTop'); if (!top) return; const cs = ocCourses();
  top.innerHTML = '<div class="card" style="margin-bottom:14px"><div class="bar" style="flex-wrap:wrap;margin-bottom:8px">' + YEARS.map(y => '<button class="yt' + (y === OC.y ? ' on' : '') + '" data-act="ocY" data-id="' + y + '">' + y + '</button>').join('') + '</div>'
    + '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px"><div><label>الكورس</label><select id="ocCourse">' + (cs.length ? cs.map(c => '<option value="' + c.id + '"' + (c.id === OC.cid ? ' selected' : '') + '>' + esc(c.title) + (c.is_published === false ? ' — غير منشور' : '') + '</option>').join('') : '<option value="">— مفيش كورسات للصف ده —</option>') + '</select></div>'
    + '<div style="display:flex;flex-direction:column;gap:6px;justify-content:flex-end"><label style="display:flex;gap:8px;align-items:center;margin:0"><input type="checkbox" id="ocAll" style="width:auto"' + (OC.all ? ' checked' : '') + '> اعرض طلاب كل الصفوف</label><label style="display:flex;gap:8px;align-items:center;margin:0"><input type="checkbox" id="ocNotify" style="width:auto"' + (OC.notify ? ' checked' : '') + '> ابعت إشعار للطالب</label></div></div></div>';
}
async function ocRefresh() {
  if (!$('#ocBody')) return; const cs = ocCourses();
  if (!cs.some(c => c.id === OC.cid)) OC.cid = cs[0] ? cs[0].id : '';
  OC.D = null; OC.sel.clear(); ocTop(); const body = $('#ocBody');
  if (!OC.cid) { body.innerHTML = '<div class="empty">مفيش كورسات للصف ' + esc(OC.y) + '</div>'; return; }
  await ocLoad();
}
async function ocLoad(keep) {
  const body = $('#ocBody'); if (!body || !OC.cid) return; if (!keep) { OC.sel.clear(); body.innerHTML = '<div class="empty">⏳ جاري تحميل الطلاب...</div>'; }
  const { data, error } = await sb.rpc('course_open_list', { p_course: OC.cid, p_all_years: OC.all });
  if (error) { body.innerHTML = '<div class="empty">⚠️ ' + esc(oErr(error)) + '</div>'; return; }
  OC.D = data; ocDraw();
}
const ocRows = () => ((OC.D && OC.D.students) || []).filter(r => (OC.f === 'all' || (OC.f === 'enr' ? r.enrolled : !r.enrolled)) && (!OC.q || (r.name + ' ' + (r.phone || '')).toLowerCase().includes(OC.q.toLowerCase())));
function ocDraw() {
  const body = $('#ocBody'); if (!body || !OC.D) return; const all = OC.D.students || [], rows = ocRows(), c = OC.D.course, enr = all.filter(r => r.enrolled).length;
  body.innerHTML = '<div class="card"><div class="bar" style="flex-wrap:wrap;gap:8px;margin-bottom:10px"><b>' + esc(c.title) + '</b>' + (c.price > 0 ? '<span class="pill">كورس مدفوع</span>' : '<span class="pill ok">مجاني</span>') + (c.published ? '' : '<span class="pill warn">غير منشور</span>') + '<span class="pill ok">مشترك: ' + enr + '</span><span class="pill">غير مشترك: ' + (all.length - enr) + '</span></div>'
    + '<div class="bar" style="flex-wrap:wrap;gap:8px;margin-bottom:10px"><input id="ocQ" placeholder="🔎 ابحث بالاسم أو الهاتف" value="' + esc(OC.q) + '" style="flex:1 1 200px"><select id="ocF" style="width:auto"><option value="all"' + (OC.f === 'all' ? ' selected' : '') + '>الكل</option><option value="not"' + (OC.f === 'not' ? ' selected' : '') + '>غير المشتركين</option><option value="enr"' + (OC.f === 'enr' ? ' selected' : '') + '>المشتركين</option></select></div>'
    + '<div class="bar" style="flex-wrap:wrap;gap:8px;margin-bottom:10px"><button class="btn s" data-act="ocSelAll" data-id="1">تحديد الكل</button><button class="btn s g" data-act="ocSelAll" data-id="0">إلغاء التحديد</button><span id="ocCnt" style="color:var(--muted);font-weight:700"></span><span style="flex:1"></span><button class="btn s" data-act="ocSet" data-id="1">🔓 فتح للمختارين</button><button class="btn s r" data-act="ocSet" data-id="0">سحب الاشتراك من المختارين</button></div>'
    + (rows.length ? '<div style="overflow-x:auto"><table><tr><th style="width:36px"><input type="checkbox" data-act="ocAllBox" style="width:auto"></th><th>الطالب</th><th>الصف</th><th>الحالة</th><th></th></tr>' + rows.map(r => '<tr' + (r.enrolled ? '' : ' style="opacity:.8"') + '><td><input type="checkbox" class="ocCk" data-act="ocPick" data-id="' + r.id + '" style="width:auto"' + (OC.sel.has(r.id) ? ' checked' : '') + '></td><td><b>' + esc(r.name) + '</b><br><small dir="ltr" style="color:var(--muted)">' + esc(r.phone || '') + '</small></td><td>' + esc(r.year || '') + '</td><td>' + (r.enrolled ? '<span class="pill ok">مشترك</span>' : '<span class="pill">غير مشترك</span>') + '</td><td>' + (r.enrolled ? '<button class="btn s r" data-act="ocOne" data-id="' + r.id + '" data-on="0">سحب</button>' : '<button class="btn s" data-act="ocOne" data-id="' + r.id + '" data-on="1">🔓 فتح</button>') + '</td></tr>').join('') + '</table></div>' : '<div class="empty">مفيش طلاب مطابقين</div>') + '</div>';
  ocCount();
}
function ocCount() { const e = $('#ocCnt'); if (e) e.textContent = 'المختار: ' + OC.sel.size; }
async function ocApply(ids, on) {
  if (OC.busy) return; OC.busy = true;
  try { let n = 0; for (let i = 0; i < ids.length; i += 500) { const { data, error } = await sb.rpc('course_open_set', { p_course: OC.cid, p_students: ids.slice(i, i + 500), p_on: on, p_notify: OC.notify }); if (error) throw new Error(oErr(error)); n += +data || 0; }
    S.enr = null; OC.sel.clear(); await ocLoad(true); toast(on ? (n ? '🔓 اتفتح الكورس لـ ' + n + ' طالب' : 'كلهم كانوا مشتركين من قبل') : (n ? 'اتسحب الاشتراك من ' + n + ' طالب' : 'محدش كان مشترك')); }
  finally { OC.busy = false; }
}
document.addEventListener('change', e => { const t = e.target; if (!t) return;
  if (t.id === 'ocCourse') { OC.cid = t.value; ocLoad(); } else if (t.id === 'ocF') { OC.f = t.value; ocDraw(); } else if (t.id === 'ocAll') { OC.all = t.checked; ocLoad(); } else if (t.id === 'ocNotify') OC.notify = t.checked; });
document.addEventListener('input', e => { const t = e.target; if (!t || t.id !== 'ocQ') return; OC.q = t.value; clearTimeout(OC._t); OC._t = setTimeout(() => { ocDraw(); const q = $('#ocQ'); if (q) { q.focus(); q.setSelectionRange(q.value.length, q.value.length); } }, 250); });
Object.assign(ACT, {
  ocY: id => { OC.y = id; OC.q = ''; OC.f = 'all'; ocRefresh(); },
  ocPick: (id, el) => { if (el.checked) OC.sel.add(id); else OC.sel.delete(id); ocCount(); },
  ocAllBox: (id, el) => { ocRows().forEach(r => el.checked ? OC.sel.add(r.id) : OC.sel.delete(r.id)); document.querySelectorAll('.ocCk').forEach(c => c.checked = OC.sel.has(c.dataset.id)); ocCount(); },
  ocSelAll: id => { if (id === '1') ocRows().forEach(r => OC.sel.add(r.id)); else OC.sel.clear(); document.querySelectorAll('.ocCk').forEach(c => c.checked = OC.sel.has(c.dataset.id)); ocCount(); },
  ocSet: async id => {
    const ids = [...OC.sel]; if (!ids.length) return toast('اختار طلاب الأول', true); const on = id === '1', t = OC.D.course.title;
    if (!confirm((on ? 'فتح «' + t + '» لـ ' + ids.length + ' طالب بدون كود؟' : 'سحب اشتراك ' + ids.length + ' طالب من «' + t + '»؟\nمش هيقدروا يدخلوا الكورس تاني إلا بكود أو فتح جديد.'))) return;
    await ocApply(ids, on);
  },
  ocOne: async (id, el) => {
    const on = el.dataset.on === '1', r = (OC.D.students || []).find(x => x.id === id);
    if (!on && !confirm('سحب اشتراك ' + (r ? r.name : 'الطالب') + ' من الكورس؟')) return;
    await ocApply([id], on);
  }
});
Object.assign(ACTPERM, { ocSet: ['students.enroll'], ocOne: ['students.enroll'] });
(function () { if (!NAV.some(n => n[0] === 'xopen')) { const i = NAV.findIndex(n => n[0] === 'students'); NAV.splice(i >= 0 ? i + 1 : NAV.length, 0, ['xopen', '🔓', 'فتح كورس بدون كود']); } })();
})();
// ---------------------------------------------------------------- تبويب «الصفحة الرئيسية»: تحكم كامل في index + معاينة حيّة
(function () {
'use strict';
const L = { cfg: {}, saved: '{}', photo: null, savedPhoto: null, photoDirty: false, photoSent: false, tn: '', pn: '', savedTn: '', savedPn: '', dev: 'desktop', page: 'index', ready: false, loaded: false, timer: null };
const DEF = () => window.LP_DEFAULTS || {}, MG = () => window.LP_merge(L.cfg);
const lErr = e => { const m = (e && e.message) || String(e || ''); const T = [['does not exist', 'شغّل ملف db_44_landing.sql في Supabase الأول'], ['schema cache', 'شغّل ملف db_44_landing.sql في Supabase الأول'], ['forbidden', 'الصفحة دي للمالك/المسؤول فقط'], ['too_big', 'الحجم كبير — قلّل النصوص أو الصورة'], ['bad_image', 'صيغة الصورة غير مدعومة']]; for (const [k, v] of T) if (m.includes(k)) return v; return m; };
const YEARS6 = ['أولى إعدادي', 'ثانية إعدادي', 'ثالثة إعدادي', 'أولى ثانوي', 'ثانية ثانوي', 'ثالثة ثانوي'];
const SEC = { courses: ['📚', 'الكورسات', 'show_courses', 'courses'], mock: ['📱', 'شكل المنصة من جوه', 'show_mock', 'inside'], cards: ['🧩', 'كروت المميزات', 'show_cards', 'cards'], grades: ['🎓', 'الصفوف', 'show_grades', 'grades'], cta: ['🚀', 'الدعوة للتسجيل', 'show_cta', 'cta'] };
const PRESETS = [
  ['🌹 الأصلي (كحلي + وردي)', null],
  ['🌙 ليلي داكن', { bg: '#0a1020', ink: '#f1f5f9', card: '#121b30', mut: '#94a3b8', line: '#22304d' }],
  ['🌊 أزرق هادي', { hero_a: '#06142e', hero_b: '#0b2a6b', hero_c: '#1d4ed8', brand_a: '#2563eb', brand_b: '#06b6d4', btn_ink: '#0b2a6b', blob_a: '#2563eb', blob_b: '#06b6d4', final_a: '#06142e', final_b: '#0ea5e9' }],
  ['🌿 أخضر', { hero_a: '#04201a', hero_b: '#065f46', hero_c: '#059669', brand_a: '#10b981', brand_b: '#84cc16', btn_ink: '#065f46', blob_a: '#10b981', blob_b: '#84cc16', final_a: '#04201a', final_b: '#16a34a' }],
  ['🔥 برتقالي دافي', { hero_a: '#1c0a05', hero_b: '#7c2d12', hero_c: '#c2410c', brand_a: '#f97316', brand_b: '#ef4444', btn_ink: '#7c2d12', blob_a: '#f97316', blob_b: '#ef4444', final_a: '#1c0a05', final_b: '#ea580c' }]
];
const COLORKEYS = ['hero_a', 'hero_b', 'hero_c', 'hero_ink', 'brand_a', 'brand_b', 'btn_ink', 'bg', 'card', 'ink', 'mut', 'line', 'blob_a', 'blob_b', 'final_a', 'final_b'];
// ——— تعريف الحقول: t = نوع الحقل
const T = (k, l, ex) => Object.assign({ k, t: 'txt', l }, ex || {}), B = (k, l) => ({ k, t: 'bool', l }), CL = (k, l) => ({ k, t: 'col', l }), R = (k, l, min, max, u) => ({ k, t: 'rng', l, min, max, u: u || '' }), SL = (k, l, o) => ({ k, t: 'sel', l, o }), AR = (k, l, ex) => T(k, l, Object.assign({ area: true }, ex || {}));
const GROUPS = [
  { id: 'photo', ico: '🖼️', t: 'صورة المستر', sec: 'top', f: [{ t: 'photo' }, B('show_photo', 'إظهار صورة المستر في أول الصفحة'), SL('photo_mode', 'طريقة العرض', [['cutout', 'صورة مفرّغة (خلفية شفافة) فوق الشكل'], ['framed', 'داخل إطار بالشكل المختار']]), SL('photo_shape', 'شكل الخلفية الملوّنة', [['blob', 'بقعة'], ['circle', 'دايرة'], ['arch', 'قوس'], ['rounded', 'مربّع بحواف'], ['none', 'بدون خلفية']]), R('photo_zoom', 'تكبير الصورة', 50, 200, '%'), R('photo_x', 'إزاحة أفقية', -60, 60, '%'), R('photo_y', 'إزاحة رأسية', -60, 60, '%'), CL('blob_a', 'لون خلفية الصورة (١)'), CL('blob_b', 'لون خلفية الصورة (٢)'), B('show_name_card', 'إظهار كارت اسم المدرس'), T('name_title', 'السطر الصغير فوق الاسم'), { t: 'site', k: 'tn', l: 'اسم المدرس (بيتغيّر في التقارير والامتحانات كمان)' }] },
  { id: 'colors', ico: '🎨', t: 'الألوان والشكل العام', sec: 'top', f: [{ t: 'presets' }, CL('hero_a', 'خلفية أول الصفحة (البداية)'), CL('hero_b', 'خلفية أول الصفحة (الوسط)'), CL('hero_c', 'خلفية أول الصفحة (النهاية)'), R('hero_angle', 'زاوية التدرّج', 90, 200, '°'), R('hero_curve', 'انحناء حافة الهيرو', 0, 160, 'px'), B('hero_pattern', 'خطوط زخرفية خفيفة'), CL('hero_ink', 'لون النص فوق الخلفية'), CL('brand_a', 'لون الأزرار والتمييز (١)'), CL('brand_b', 'لون الأزرار والتمييز (٢)'), CL('btn_ink', 'لون كتابة الزر الأبيض'), CL('bg', 'خلفية باقي الصفحة'), CL('card', 'خلفية الكروت'), CL('ink', 'لون النص الأساسي'), CL('mut', 'لون النص الفرعي'), CL('line', 'لون الحدود'), R('radius', 'استدارة الحواف', 6, 40, 'px'), CL('final_a', 'مربّع التسجيل: اللون الأول'), CL('final_b', 'مربّع التسجيل: اللون الأخير')] },
  { id: 'hero', ico: '✍️', t: 'العنوان والنصوص الرئيسية', sec: 'top', f: [T('pill', 'الشارة الصغيرة (فاضي = تتخفّى)'), T('h1_a', 'العنوان — السطر الأول'), T('h1_b', 'العنوان — السطر الإنجليزي (فاضي = يتخفّى)'), AR('lead', 'الفقرة تحت العنوان'), T('btn1_text', 'الزر الأول — النص'), T('btn1_url', 'الزر الأول — الرابط', { url: 1 }), T('btn2_text', 'الزر التاني — النص (فاضي = يتخفّى)'), T('btn2_url', 'الزر التاني — الرابط', { url: 1 }), T('btn_in_text', 'نص الزر للطالب المسجّل دخوله'), SL('hero_align', 'مكان الصورة', [['photo_left', 'الصورة على الشمال'], ['photo_right', 'الصورة على اليمين']])] },
  { id: 'nav', ico: '🔝', t: 'القايمة العلوية', sec: 'top', f: [B('show_nav', 'إظهار روابط القايمة'), T('brand_sub', 'السطر تحت اسم المنصة'), { t: 'list', k: 'nav' }, B('nav_login', 'زر الدخول'), T('nav_login_text', 'نص زر الدخول'), B('nav_signup', 'زر إنشاء حساب'), T('nav_signup_text', 'نص زر إنشاء الحساب')] },
  { id: 'strip', ico: '⚡', t: 'شريط المميزات (تحت الهيرو)', sec: 'top', f: [B('show_strip', 'إظهار الشريط'), { t: 'list', k: 'strip' }] },
  { id: 'courses', ico: '📚', t: 'الكورسات', sec: 'courses', f: [B('show_courses', 'إظهار قسم الكورسات'), T('courses_title', 'العنوان'), T('courses_sub', 'الوصف'), SL('courses_mode', 'الكورسات المعروضة', [['all', 'كل الكورسات المنشورة'], ['selected', 'كورسات أختارها بنفسي']]), { t: 'courses' }, R('courses_limit', 'أقصى عدد كورسات', 3, 24, ''), B('tabs_on', 'تبويبات الصفوف'), B('show_search', 'خانة البحث'), SL('card_style', 'شكل الكارت', [['cover', 'بصورة غلاف'], ['minimal', 'بسيط (بدون صورة)']]), B('show_price', 'إظهار السعر'), B('show_lessons', 'إظهار عدد الدروس والمدة'), B('show_teacher_row', 'إظهار اسم المدرس على الكارت'), T('courses_btn', 'نص زر الكارت'), T('courses_all', 'نص تبويب «الكل»'), T('courses_empty', 'رسالة لو مفيش كورسات')] },
  { id: 'mock', ico: '📱', t: 'شكل المنصة من جوه', sec: 'inside', f: [B('show_mock', 'إظهار القسم'), T('mock_title', 'عنوان (فاضي = من غير عنوان)'), T('mock_sub', 'وصف (فاضي = من غير وصف)'), T('mock_video_title', 'اسم الفيديو في الشاشة'), T('mock_q', 'نص السؤال في الموبايل')] },
  { id: 'cards', ico: '🧩', t: 'كروت المميزات', sec: 'cards', f: [B('show_cards', 'إظهار القسم'), T('cards_title', 'عنوان (فاضي = من غير عنوان)'), T('cards_sub', 'وصف'), { t: 'list', k: 'cards' }] },
  { id: 'grades', ico: '🎓', t: 'الصفوف', sec: 'grades', f: [B('show_grades', 'إظهار القسم'), T('grades_title', 'العنوان'), T('grades_sub', 'الوصف'), { t: 'list', k: 'grades' }] },
  { id: 'cta', ico: '🚀', t: 'الدعوة للتسجيل (آخر الصفحة)', sec: 'cta', f: [B('show_cta', 'إظهار القسم'), T('cta_title', 'العنوان'), T('cta_sub', 'الوصف'), T('cta_btn', 'نص الزر'), T('cta_url', 'رابط الزر', { url: 1 })] },
  { id: 'foot', ico: '📞', t: 'الفوتر والتواصل والدعم', sec: 'bottom', f: [{ t: 'site', k: 'pn', l: 'اسم المنصة (بيظهر في الفوتر والتقارير)' }, T('footer_text', 'سطر إضافي في الفوتر'), T('copyright', 'حقوق النشر'), T('dev_sign', 'التوقيع أسفل الصفحة (فاضي = يتخفّى)'), B('show_foot_pages', 'إظهار عمود «الصفحات» في الفوتر'), T('foot_pages_title', 'عنوان عمود الصفحات'), T('foot_contact_title', 'عنوان عمود التواصل'), B('show_social', 'إظهار روابط التواصل (كل رابط تضيفه بيظهر باسمه وأيقونته)'), T('whatsapp', 'واتساب (رقم 01xxxxxxxxx أو رابط)'), T('facebook', 'فيسبوك (رابط https)', { url: 1 }), T('instagram', 'إنستجرام (رابط https)', { url: 1 }), T('youtube', 'يوتيوب (رابط https)', { url: 1 }), T('tiktok', 'تيك توك (رابط https)', { url: 1 }), T('telegram', 'تيليجرام (رابط https)', { url: 1 }), B('show_support', 'فقاعة الدعم الفني (برّه المنصة: فني بس)')] },
  { id: 'auth', ico: '🔐', t: 'صفحات الدخول والتسجيل والتحقق', sec: 'top', f: [{ t: 'authlinks' }, SL('auth_design', 'التصميم المعروض للطلاب', [['1', '١ — نظيف وهادي (كارت أبيض)'], ['2', '٢ — شاشة منقسمة (صورة المستر + المميزات)'], ['3', '٣ — بوستر زجاجي (خلفية بتدرّج المنصة)']]), B('auth_show_help', 'إظهار «محتاج مساعدة؟ كلّم الدعم الفني»'), B('auth_show_points', '(تصميم ٢) إظهار نقاط المميزات'), T('auth_signin_title', 'الدخول — العنوان'), T('auth_signin_sub', 'الدخول — الوصف'), T('auth_signin_btn', 'الدخول — نص الزر'), T('auth_signin_alt_p', 'الدخول — جملة «معندكش حساب»'), T('auth_signin_alt_btn', 'الدخول — زر الانتقال للتسجيل'), T('auth_signup_title', 'التسجيل — العنوان'), T('auth_signup_sub', 'التسجيل — الوصف'), T('auth_signup_btn', 'التسجيل — نص الزر'), T('auth_signup_alt_p', 'التسجيل — جملة «عندك حساب»'), T('auth_signup_alt_btn', 'التسجيل — زر الانتقال للدخول'), T('auth_verify_title', 'تأكيد البريد — العنوان'), T('auth_recover_title', 'استعادة الحساب — العنوان'), T('auth_help_text', 'جملة المساعدة'), T('auth_help_btn', 'زر الدعم الفني'), T('auth_side_title', '(تصميم ٢) العنوان الكبير'), AR('auth_side_text', '(تصميم ٢) الفقرة'), T('auth_p1', '(تصميم ٢) ميزة ١'), T('auth_p2', '(تصميم ٢) ميزة ٢'), T('auth_p3', '(تصميم ٢) ميزة ٣')] },
  { id: 'order', ico: '🔀', t: 'ترتيب الأقسام وإظهارها', sec: 'courses', f: [{ t: 'order' }] },
  { id: 'seo', ico: '🔎', t: 'محركات البحث (جوجل)', sec: 'top', f: [T('seo_title', 'عنوان الصفحة'), AR('seo_desc', 'وصف الصفحة')] }
];
const LISTS = {
  nav: { max: 6, add: { label: 'رابط جديد', href: '#courses' }, cols: [['label', 'النص', 'w1'], ['href', 'الرابط (#courses أو /signup.html أو https://…)', 'w2']] },
  strip: { max: 4, add: { icon: '⭐', title: 'ميزة', sub: 'وصف قصير' }, cols: [['icon', 'أيقونة', 'ic'], ['title', 'العنوان', 'w1'], ['sub', 'الوصف', 'w2']] },
  cards: { max: 6, add: { icon: '⭐', title: 'ميزة جديدة', text: 'وصف الميزة.', tint: '#ffe4ef' }, cols: [['icon', 'أيقونة', 'ic'], ['title', 'العنوان', 'w1'], ['text', 'الوصف', 'w2'], ['tint', 'اللون', 'cl']] },
  grades: { max: 6, fixed: true, cols: [['name', 'الصف', 'ro'], ['en', 'بالإنجليزي', 'w1'], ['desc', 'سطر وصف (اختياري)', 'w2'], ['on', 'ظاهر', 'ck']] }
};
// ——— أدوات
const val = k => MG()[k];
const dirty = () => JSON.stringify(L.cfg) !== L.saved || L.photoDirty || L.tn !== L.savedTn || L.pn !== L.savedPn;
function mark() { const b = $('#lpDirty'); if (b) { const d = dirty(); b.textContent = d ? '● فيه تعديلات لسه ما اتحفظتش' : '✓ كل التعديلات محفوظة ومنشورة'; b.style.color = d ? '#d97706' : '#16a34a'; } }
function push(scrollTo) {
  clearTimeout(L.timer); L.timer = setTimeout(() => {
    const f = $('#lpFrame'); if (!f || !f.contentWindow || !L.ready) return;
    const m = { type: 'lp-preview', cfg: L.cfg, teacher_name: L.tn || undefined, platform_name: L.pn || undefined, scrollTo };
    if (!L.photoSent) { m.photo = L.photo; L.photoSent = true; }
    f.contentWindow.postMessage(m, location.origin);
  }, 90); mark();
}
function fit() {
  const box = $('#lpBox'), f = $('#lpFrame'); if (!box || !f) return;
  const w = L.dev === 'mobile' ? 390 : 1280, av = box.clientWidth, sc = Math.min(1, av / w);
  f.style.width = w + 'px'; f.style.transform = 'scale(' + sc + ')'; f.style.transformOrigin = 'top right';
  const h = Math.max(520, Math.round(innerHeight * 0.78)); box.style.height = h + 'px'; f.style.height = Math.round(h / sc) + 'px';
}
window.addEventListener('resize', () => { try { fit(); } catch (e) {} });
window.addEventListener('message', e => { if (e.origin === location.origin && e.data && e.data.type === 'lp-ready') { L.ready = true; L.photoSent = false; push(); } });
// ——— رسم الحقول
const lbl = (l, k) => '<label>' + esc(l) + (k ? ' <button type="button" class="lpRs" data-act="lpRs" data-id="' + k + '" title="رجوع للقيمة الافتراضية">↺</button>' : '') + '</label>';
function field(f) {
  const k = f.k, v = val(k);
  switch (f.t) {
    case 'txt': return '<div class="lf">' + lbl(f.l, k) + (f.area ? '<textarea data-k="' + k + '" rows="3">' + esc(v) + '</textarea>' : '<input data-k="' + k + '" value="' + esc(v) + '"' + (f.url ? ' dir="ltr" placeholder="/… أو https://…"' : '') + '>') + '</div>';
    case 'bool': return '<label class="lf lck"><input type="checkbox" data-k="' + k + '"' + (v ? ' checked' : '') + '> <span>' + esc(f.l) + '</span> <button type="button" class="lpRs" data-act="lpRs" data-id="' + k + '" title="رجوع للافتراضي">↺</button></label>';
    case 'col': return '<div class="lf lcol">' + lbl(f.l, k) + '<div class="lcr"><input type="color" data-k="' + k + '" data-c="1" value="' + esc(v) + '"><input data-k="' + k + '" data-ch="1" value="' + esc(v) + '" dir="ltr" maxlength="7"></div></div>';
    case 'rng': return '<div class="lf">' + lbl(f.l + ': ', k).replace('</label>', ' <b class="lrv" data-rv="' + k + '">' + esc(v) + f.u + '</b></label>') + '<input type="range" data-k="' + k + '" data-u="' + f.u + '" min="' + f.min + '" max="' + f.max + '" value="' + esc(v) + '"></div>';
    case 'sel': return '<div class="lf">' + lbl(f.l, k) + '<select data-k="' + k + '">' + f.o.map(o => '<option value="' + o[0] + '"' + (v === o[0] ? ' selected' : '') + '>' + esc(o[1]) + '</option>').join('') + '</select></div>';
    case 'site': return '<div class="lf">' + lbl(f.l) + '<input data-site="' + f.k + '" value="' + esc(L[f.k]) + '"></div>';
    case 'presets': return '<div class="lf"><label>ألوان جاهزة (بتغيّر الألوان بس وتقدر تعدّلها بعدها)</label><div class="lpre">' + PRESETS.map((p, i) => '<button type="button" class="btn s g" data-act="lpPre" data-id="' + i + '">' + esc(p[0]) + '</button>').join('') + '</div></div>';
    case 'photo': return '<div class="lf"><label>صورة المستر</label><div class="lph"><div class="lpv">' + (L.photo ? '<img src="' + esc(L.photo) + '" alt="">' : '<span>👤</span>') + '</div><div style="display:flex;flex-direction:column;gap:8px;flex:1;min-width:180px"><label class="btn s" style="cursor:pointer;margin:0;color:#fff;text-align:center">📷 ' + (L.photo ? 'تغيير الصورة' : 'رفع صورة') + '<input type="file" id="lpFile" accept="image/png,image/jpeg,image/webp" hidden></label>' + (L.photo ? '<button type="button" class="btn s r" data-act="lpPhotoDel">🗑 إزالة الصورة</button>' : '') + '</div></div><p class="nt" style="margin:8px 0 0;line-height:1.9">الأفضل <b>صورة PNG بخلفية شفافة</b> (المستر من غير خلفية) وجودة عالية، وبيتضغط تلقائياً. لو صورتك بخلفية عادية اختار «داخل إطار» من طريقة العرض. لو ما فيش صورة بيظهر لوجو المنصة مكانها.</p></div>';
    case 'authlinks': return '<div class="lf"><p class="nt" style="margin:0 0 8px">الألوان بتتاخد من «الألوان والشكل العام» (نفس ألوان الصفحة الرئيسية)، وصورة المستر في التصميم ٢ هي نفس صورة الصفحة الرئيسية. التعديل بيظهر بعد «حفظ ونشر». المعاينة الحيّة على اليمين/فوق بتبيّن الصفحة الحقيقية وبتتغيّر لحظياً مع أي تعديل — بدّل بين الصفحات من القايمة اللي فوق المعاينة. (لو عايز تشوف الإعدادات المنشورة فعلاً:)</p><div class="lpre">' + [1, 2, 3].map(n => '<a class="btn s g" target="_blank" rel="noopener" href="/signin.html?d=' + n + '">تصميم ' + n + ' — دخول</a><a class="btn s g" target="_blank" rel="noopener" href="/signup.html?d=' + n + '">تصميم ' + n + ' — تسجيل</a>').join('') + '</div></div>';
    case 'courses': return coursesField();
    case 'order': return orderField();
    case 'list': return listField(f.k);
  }
  return '';
}
function coursesField() {
  const cs = (S.courses || []), sel = val('courses_ids') || [], m = val('courses_mode'); if (m !== 'selected') return '<p class="nt" style="margin:0 0 6px">هيتعرض كل الكورسات «المنشورة» بترتيبها في لوحة الكورسات. (الكورس المخفي ما بيظهرش للزوّار أبداً.)</p>';
  const by = id => cs.find(c => c.id === id), picked = sel.map(by).filter(Boolean), rest = cs.filter(c => !sel.includes(c.id));
  const row = (c, i, on) => '<div class="lcc"><input type="checkbox" data-cid="' + c.id + '"' + (on ? ' checked' : '') + '><span class="lcn">' + esc(c.title) + ' <small>' + esc(c.academic_year || '') + (c.is_published === false ? ' • مخفي (مش هيظهر)' : '') + '</small></span>' + (on ? '<button type="button" class="btn s g" data-act="lpCMv" data-id="' + i + '|-1">▲</button><button type="button" class="btn s g" data-act="lpCMv" data-id="' + i + '|1">▼</button>' : '') + '</div>';
  return '<div class="lf"><label>اختار الكورسات (الترتيب اللي تحدده هو اللي بيظهر)</label><div class="lcl">' + (picked.map((c, i) => row(c, i, true)).join('') + rest.map(c => row(c, -1, false)).join('') || '<div class="empty">مفيش كورسات</div>') + '</div></div>';
}
function orderField() {
  const o = val('order'); return '<div class="lcl">' + o.map((s, i) => { const d = SEC[s]; if (!d) return ''; return '<div class="lcc"><input type="checkbox" data-k="' + d[2] + '"' + (val(d[2]) ? ' checked' : '') + '><span class="lcn">' + d[0] + ' ' + d[1] + '</span><button type="button" class="btn s g" data-act="lpOMv" data-id="' + i + '|-1">▲</button><button type="button" class="btn s g" data-act="lpOMv" data-id="' + i + '|1">▼</button></div>'; }).join('') + '</div><p class="nt" style="margin:8px 0 0">الهيرو (أول الصفحة) وشريط المميزات والفوتر ثابتين في أماكنهم.</p>';
}
function listField(name) {
  const cf = LISTS[name], arr = val(name) || [];
  const rows = arr.map((it, i) => '<div class="lli">' + cf.cols.map(c => {
    const v = it[c[0]], k = 'data-li="' + name + '" data-i="' + i + '" data-f="' + c[0] + '"';
    if (c[2] === 'ck') return '<label class="lck" style="margin:0"><input type="checkbox" ' + k + (v !== false ? ' checked' : '') + '> ' + c[1] + '</label>';
    if (c[2] === 'cl') return '<input type="color" ' + k + ' value="' + esc(/^#[0-9a-f]{6}$/i.test(v) ? v : '#ffe4ef') + '" title="' + c[1] + '">';
    if (c[2] === 'ro') return '<b class="lro">' + esc(v) + '</b>';
    return '<input class="' + c[2] + '" ' + k + ' value="' + esc(v) + '" placeholder="' + esc(c[1]) + '"' + (c[0] === 'href' ? ' dir="ltr"' : '') + '>';
  }).join('') + (cf.fixed ? '' : '<span class="lla"><button type="button" class="btn s g" data-act="lpLMv" data-id="' + name + '|' + i + '|-1">▲</button><button type="button" class="btn s g" data-act="lpLMv" data-id="' + name + '|' + i + '|1">▼</button><button type="button" class="btn s r" data-act="lpLDel" data-id="' + name + '|' + i + '">✕</button></span>') + '</div>').join('');
  return '<div class="lf">' + (cf.fixed ? '' : '') + rows + (cf.fixed || arr.length >= cf.max ? '' : '<button type="button" class="btn s" data-act="lpLAdd" data-id="' + name + '">+ إضافة</button>') + '</div>';
}
const CSS = '<style>.lpw{display:grid;grid-template-columns:minmax(330px,440px) 1fr;gap:16px;align-items:start}@media(max-width:1000px){.lpw{grid-template-columns:1fr}.lpprev{order:-1;position:static!important}}'
  + '.lpside{display:flex;flex-direction:column;gap:10px}.lg{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden}.lg>summary{cursor:pointer;padding:13px 16px;font-weight:800;list-style:none;display:flex;gap:10px;align-items:center}.lg>summary::-webkit-details-marker{display:none}.lg>summary:after{content:"▾";margin-inline-start:auto;transition:.2s;color:var(--muted)}.lg[open]>summary:after{transform:rotate(180deg)}.lg[open]>summary{border-bottom:1px solid var(--line);background:var(--bg)}.lgb{padding:14px 16px;display:flex;flex-direction:column;gap:12px}'
  + '.lf label{display:block;font-weight:700;font-size:13.5px;margin-bottom:5px}.lf input:not([type=checkbox]):not([type=range]):not([type=color]),.lf textarea,.lf select{width:100%}.lck{display:flex!important;gap:9px;align-items:center;cursor:pointer;margin:0}.lck input{width:auto!important}.lpRs{border:0;background:none;color:var(--muted);cursor:pointer;font-size:14px;padding:0 4px}.lpRs:hover{color:#ef4444}'
  + '.lcr{display:flex;gap:8px}.lcr input[type=color]{width:46px;height:40px;padding:2px;border-radius:10px;border:1px solid var(--line);background:var(--card);flex:none}.lrv{color:var(--brand,#ef4444)}.lpre{display:flex;gap:6px;flex-wrap:wrap}'
  + '.lph{display:flex;gap:12px;align-items:center;flex-wrap:wrap}.lpv{width:96px;height:120px;border-radius:16px;overflow:hidden;background:var(--bg);border:1px solid var(--line);display:grid;place-items:center;font-size:38px;flex:none}.lpv img{width:100%;height:100%;object-fit:contain;background:repeating-conic-gradient(#e5e7eb 0 25%,#fff 0 50%) 0 0/14px 14px}'
  + '.lli{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:8px;border:1px solid var(--line);border-radius:12px;margin-bottom:8px;background:var(--bg)}.lli input[type=text],.lli input:not([type]){min-width:0}.lli .ic{width:58px;text-align:center}.lli .w1{flex:1 1 120px}.lli .w2{flex:2 1 160px}.lli input[type=color]{width:38px;height:36px;padding:1px;border-radius:8px;border:1px solid var(--line)}.lro{flex:1 1 120px}.lla{display:flex;gap:4px;margin-inline-start:auto}'
  + '.lcl{display:flex;flex-direction:column;gap:6px;max-height:340px;overflow:auto}.lcc{display:flex;gap:8px;align-items:center;padding:7px 10px;border:1px solid var(--line);border-radius:10px;background:var(--bg)}.lcc input{width:auto}.lcn{flex:1;font-weight:700;font-size:14px}.lcn small{color:var(--muted);font-weight:600}'
  + '.lpprev{position:sticky;top:76px}.lpbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px}#lpBox{position:relative;border:1px solid var(--line);border-radius:16px;overflow:hidden;background:#e5e7eb}#lpFrame{border:0;background:#fff;position:absolute;top:0;right:0;display:block}'
  + '.lpdev.on{background:var(--brand,#ef4444)!important;color:#fff!important}</style>';
function formHtml() {
  return GROUPS.map(g => '<details class="lg" data-g="' + g.id + '"' + (L.open === g.id ? ' open' : '') + '><summary>' + g.ico + ' ' + esc(g.t) + '</summary><div class="lgb" data-gb="' + g.id + '">' + g.f.map(field).join('') + '</div></details>').join('');
}
function redrawGroup(id) { const g = GROUPS.find(x => x.id === id), b = document.querySelector('[data-gb="' + id + '"]'); if (g && b) b.innerHTML = g.f.map(field).join(''); }
const gOf = el => { const b = el.closest('[data-gb]'); return b ? b.dataset.gb : null; };

VIEWS.xlanding = ['الصفحة الرئيسية', async () => {
  const r = await sb.rpc('landing_admin'); if (r.error) throw new Error(lErr(r.error));
  if (!S.courses) await loadCourses();
  const st = await sb.rpc('get_site_settings'); const ss = (st && st.data) || {};
  L.cfg = r.data.cfg || {}; L.saved = JSON.stringify(L.cfg); L.photo = r.data.photo || null; L.savedPhoto = L.photo; L.photoDirty = false; L.photoSent = false; L.ready = false;
  L.tn = L.savedTn = ss.teacher_name || 'Mr. Sherif Khafagy'; L.pn = L.savedPn = ss.platform_name || 'The Leader In English'; L.open = L.open || 'photo';
  L.page = L.open === 'auth' ? (L.page === 'index' ? 'signin' : L.page) : 'index';
  setTimeout(() => { fit(); mark(); const sl = $('#lpPg'); if (sl) sl.value = L.page; }, 30);
  return CSS + '<div class="note" style="margin:0 0 12px">🏠 هنا بتتحكم في <b>صفحة الموقع الرئيسية</b> (اللي بتظهر للزوّار قبل تسجيل الدخول): الألوان، كل نص، صورة المستر، الكورسات اللي تظهر، ترتيب الأقسام، وروابط التواصل. أي تعديل بتشوفه فوراً في المعاينة، وما بيظهر للزوّار غير لما تدوس <b>💾 حفظ ونشر</b>.</div>'
    + '<div class="card" style="margin-bottom:12px"><div class="bar" style="flex-wrap:wrap;gap:8px;margin:0"><button class="btn" data-act="lpSave">💾 حفظ ونشر</button><button class="btn s g" data-act="lpOpen">↗ فتح الصفحة الحقيقية</button><button class="btn s r" data-act="lpReset">↩ رجوع كل حاجة للافتراضي</button><span id="lpDirty" style="font-weight:800;font-size:13.5px"></span></div></div>'
    + '<div class="lpw"><div class="lpside" id="lpForm">' + formHtml() + '</div><div class="lpprev"><div class="lpbar"><b>👁 معاينة حيّة</b><select id="lpPg" data-pg="1" title="الصفحة اللي بتتعاين"><option value="index">🏠 الرئيسية</option><option value="signin">🔑 تسجيل الدخول</option><option value="signup">📝 إنشاء حساب</option><option value="verify-code">📧 تأكيد البريد</option><option value="verify-recovery">🔁 كود الاستعادة</option><option value="password">🔐 تعيين كلمة المرور</option><option value="password_recovery">🔑 نسيت كلمة المرور</option><option value="Reset_password">♻️ كلمة مرور جديدة</option></select><button class="btn s g lpdev on" data-act="lpDev" data-id="desktop">💻 كمبيوتر</button><button class="btn s g lpdev" data-act="lpDev" data-id="mobile">📱 موبايل</button></div><div id="lpBox"><iframe id="lpFrame" src="/' + L.page + '.html?preview=1" title="معاينة"></iframe></div></div></div>';
}];
VPERM.xlanding = ['@admin'];

// ——— تحرير القيم
function setKey(k, v, opts) {
  const d = DEF()[k];
  if (JSON.stringify(v) === JSON.stringify(d)) delete L.cfg[k]; else L.cfg[k] = v;
}
document.addEventListener('input', e => {
  const t = e.target; if (!t.closest || !t.closest('#lpForm')) return;
  if (t.dataset.site) { L[t.dataset.site] = t.value; return push(); }
  if (t.dataset.li) { const name = t.dataset.li, i = +t.dataset.i, f = t.dataset.f; const arr = JSON.parse(JSON.stringify(val(name))); arr[i][f] = t.type === 'checkbox' ? t.checked : t.value; L.cfg[name] = arr; return push(); }
  if (t.dataset.cid) return;
  const k = t.dataset.k; if (!k) return;
  let v;
  if (t.type === 'checkbox') v = t.checked; else if (t.type === 'range') { v = +t.value; const rv = document.querySelector('[data-rv="' + k + '"]'); if (rv) rv.textContent = v + (t.dataset.u || ''); }
  else if (t.dataset.c) { v = t.value; const h = t.parentElement.querySelector('[data-ch]'); if (h) h.value = v; }
  else if (t.dataset.ch) { if (!/^#[0-9a-fA-F]{6}$/.test(t.value)) return; v = t.value.toLowerCase(); const c = t.parentElement.querySelector('[data-c]'); if (c) c.value = v; }
  else v = t.value;
  setKey(k, v); if (t.type === 'checkbox') document.querySelectorAll('[data-k="' + k + '"]').forEach(x => { if (x !== t && x.type === 'checkbox') x.checked = v; });
  push();
});
document.addEventListener('change', e => {
  const t = e.target; if (!t.closest) return;
  if (t.dataset && t.dataset.pg) return ACT.lpPage(t.value);
  if (t.id === 'lpFile' && t.files[0]) return lpPhotoPick(t.files[0]);
  if (!t.closest('#lpForm')) return;
  if (t.dataset.cid) { const ids = (val('courses_ids') || []).slice(); const i = ids.indexOf(t.dataset.cid); if (t.checked && i < 0) ids.push(t.dataset.cid); if (!t.checked && i >= 0) ids.splice(i, 1); setKey('courses_ids', ids); redrawGroup('courses'); return push('courses'); }
  if (t.dataset.k === 'courses_mode') { redrawGroup('courses'); return push('courses'); }
  if (t.dataset.k && /^show_/.test(t.dataset.k) && t.closest('[data-gb="order"]')) return;
});
document.addEventListener('toggle', e => {
  const d = e.target; if (!d.classList || !d.classList.contains('lg') || !d.open) return;
  document.querySelectorAll('#lpForm details.lg[open]').forEach(x => { if (x !== d) x.open = false; });
  L.open = d.dataset.g; const g = GROUPS.find(x => x.id === L.open);
  if (L.open === 'auth' && L.page === 'index') ACT.lpPage('signin'); else if (L.open !== 'auth' && L.page !== 'index') ACT.lpPage('index');
  push(g && g.sec);
}, true);

// ——— الصورة: ضغط في المتصفح (بيحافظ على الشفافية) قبل الحفظ
function lpPhotoPick(file) {
  const url = URL.createObjectURL(file), img = new Image();
  img.onerror = () => { URL.revokeObjectURL(url); toast('الملف مش صورة صالحة', true); };
  img.onload = () => {
    URL.revokeObjectURL(url);
    let sc = Math.min(1, 1100 / Math.max(img.width, img.height)), out = null;
    for (let tries = 0; tries < 8 && !out; tries++) {
      const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(img.width * sc)); c.height = Math.max(1, Math.round(img.height * sc));
      const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(img, 0, 0, c.width, c.height);
      for (const q of [0.9, 0.82, 0.72, 0.6]) { let d = c.toDataURL('image/webp', q); if (!/^data:image\/webp/.test(d)) d = c.toDataURL('image/png'); if (d.length <= 380000) { out = d; break; } if (!/^data:image\/webp/.test(d)) break; }
      sc *= 0.82;
    }
    if (!out) return toast('الصورة كبيرة قوي، جرّب صورة أصغر', true);
    L.photo = out; L.photoDirty = true; L.photoSent = false; redrawGroup('photo'); push('top'); toast('الصورة جاهزة — دوس «حفظ ونشر» عشان تظهر للزوّار');
  };
  img.src = url;
}
Object.assign(ACT, {
  lpSave: async () => {
    const r = await sb.rpc('landing_save', { p_cfg: L.cfg }); if (r.error) throw new Error(lErr(r.error));
    if (L.photoDirty) { const p = await sb.rpc('landing_photo_set', { p_data: L.photo }); if (p.error) throw new Error(lErr(p.error)); L.savedPhoto = L.photo; L.photoDirty = false; }
    if (L.tn !== L.savedTn) { const e = await sb.rpc('set_site_setting', { p_key: 'teacher_name', p_value: L.tn.trim() }); if (e.error) throw e.error; L.savedTn = L.tn; }
    if (L.pn !== L.savedPn) { const e = await sb.rpc('set_site_setting', { p_key: 'platform_name', p_value: L.pn.trim() }); if (e.error) throw e.error; L.savedPn = L.pn; }
    L.cfg = r.data || L.cfg; L.saved = JSON.stringify(L.cfg); try { localStorage.removeItem('lp_cache_v1'); } catch (e) {} mark(); toast('✅ تم الحفظ والنشر — الصفحة الرئيسية اتحدّثت');
  },
  lpOpen: () => { window.open(L.page === 'index' ? '/index.html' : '/' + L.page + '.html', '_blank', 'noopener'); },
  lpPage: id => {
    if (!/^(index|signin|signup|verify-code|verify-recovery|password|password_recovery|Reset_password)$/.test(id)) return; L.page = id; L.ready = false; L.photoSent = false;
    const sel = $('#lpPg'); if (sel) sel.value = id; const f = $('#lpFrame'); if (f) f.src = '/' + id + '.html?preview=1';
  },
  lpReset: async () => {
    if (!confirm('ترجّع كل إعدادات الصفحة الرئيسية للشكل الافتراضي؟ (صورة المستر هتفضل زي ما هي)')) return;
    const r = await sb.rpc('landing_reset'); if (r.error) throw new Error(lErr(r.error)); L.cfg = {}; L.saved = '{}'; toast('اتعمل رجوع للافتراضي'); go('xlanding');
  },
  lpDev: id => { L.dev = id; document.querySelectorAll('.lpdev').forEach(b => b.classList.toggle('on', b.dataset.id === id)); fit(); },
  lpRs: id => { delete L.cfg[id]; const g = gOf(document.querySelector('[data-id="' + id + '"][data-act="lpRs"]') || document.body); if (g) redrawGroup(g); else GROUPS.forEach(x => redrawGroup(x.id)); push(); },
  lpPre: id => { const p = PRESETS[+id]; COLORKEYS.forEach(k => delete L.cfg[k]); if (p[1]) Object.assign(L.cfg, p[1]); ['colors', 'photo'].forEach(redrawGroup); push(); },
  lpPhotoDel: () => { L.photo = null; L.photoDirty = L.savedPhoto !== null; L.photoSent = false; redrawGroup('photo'); push('top'); },
  lpLAdd: id => { const cf = LISTS[id], arr = JSON.parse(JSON.stringify(val(id))); if (arr.length >= cf.max) return; arr.push(Object.assign({}, cf.add)); L.cfg[id] = arr; redrawGroup(gId(id)); push(); },
  lpLDel: id => { const [n, i] = id.split('|'), arr = JSON.parse(JSON.stringify(val(n))); arr.splice(+i, 1); L.cfg[n] = arr; redrawGroup(gId(n)); push(); },
  lpLMv: id => { const [n, i, d] = id.split('|'), arr = JSON.parse(JSON.stringify(val(n))), a = +i, b = a + +d; if (b < 0 || b >= arr.length) return; [arr[a], arr[b]] = [arr[b], arr[a]]; L.cfg[n] = arr; redrawGroup(gId(n)); push(); },
  lpCMv: id => { const [i, d] = id.split('|').map(Number), ids = (val('courses_ids') || []).slice(), j = i + d; if (j < 0 || j >= ids.length) return; [ids[i], ids[j]] = [ids[j], ids[i]]; setKey('courses_ids', ids); redrawGroup('courses'); push('courses'); },
  lpOMv: id => { const [i, d] = id.split('|').map(Number), o = (val('order') || []).slice(), j = i + d; if (j < 0 || j >= o.length) return; [o[i], o[j]] = [o[j], o[i]]; setKey('order', o); redrawGroup('order'); push(SEC[o[j]] && SEC[o[j]][3]); }
});
const gId = n => ({ nav: 'nav', strip: 'strip', cards: 'cards', grades: 'grades' }[n]);
Object.assign(ACTPERM, { lpSave: ['@admin'], lpOpen: ['@admin'], lpPage: ['@admin'], lpReset: ['@admin'], lpDev: ['@admin'], lpRs: ['@admin'], lpPre: ['@admin'], lpPhotoDel: ['@admin'], lpLAdd: ['@admin'], lpLDel: ['@admin'], lpLMv: ['@admin'], lpCMv: ['@admin'], lpOMv: ['@admin'] });
(function () { if (!NAV.some(n => n[0] === 'xlanding')) { const i = NAV.findIndex(n => n[0] === 'overview'); NAV.splice(i >= 0 ? i + 1 : 0, 0, ['xlanding', '🏠', 'الصفحة الرئيسية']); } })();
})();
// ---------------------------------------------------------------- تبويب «شكل المحاضرات»: اختيار شكل صفحة الكورس والمحاضرة + معاينة حيّة
(function () {
'use strict';
const U = { cfg: {}, saved: '{}', page: 'course', dev: 'desktop', mode: (() => { try { return localStorage.getItem('platform_theme') === 'dark' ? 'dark' : 'light'; } catch (e) { return 'light'; } })(), ready: false, timer: null };
const KEYS_COLOR = [['c1', 'اللون الأساسي (الأزرار والتمييز)'], ['c2', 'اللون الثاني (التدرّج)'], ['c3', 'لون التقدّم والإبراز'], ['bg', 'خلفية الصفحة'], ['ink', 'لون النص']];
const FLAGS = [['desc_top', 'وصف المحاضرة فوق الفيديو (لو مقفول بيظهر تحته)'], ['item_desc', 'وصف كل فيديو/ملف تحت اسمه في القايمة'], ['stats', 'إحصائيات الفيديو: مدة الفيديو • عدد المشاهدات • إجمالي وقت المشاهدة'], ['progress', 'خط التقدّم الأحمر/الملوّن تحت كل عنصر'], ['numbers', 'ترقيم العناصر بدل الأيقونات'], ['sticky_player', 'تثبيت الفيديو فوق في الموبايل أثناء النزول'], ['confetti', '🎉 احتفال (قصاصات ملوّنة) لما الطالب يخلّص المحاضرة']];
const LABELS = [['lbl_watch', 'زر الفيديو'], ['lbl_file', 'زر الملف / الرابط'], ['lbl_quiz', 'زر الامتحان'], ['lbl_hw', 'زر الواجب'], ['lbl_side', 'عنوان القايمة الجانبية'], ['lbl_desc', 'عنوان وصف المحاضرة']];
const SKINS = [
  ['classic', '🌹', 'الشكل القديم', 'زي ما هو دلوقتي بالظبط — قايمة جنبية بسيطة وفيديو.'],
  ['sakr', '📚', 'شكل القوائم الجانبية', 'صفحة كورس بأسابيع قابلة للطيّ + كارت «ابدأ الكورس» وفي المحاضرة قايمة جانبية بعدّاد n/N وخط تقدّم.'],
  ['gohary', '🧾', 'شكل الصفوف التفصيلية', 'كل عنصر في صف بوصفه ومدة الفيديو وعدد المشاهدات وإجمالي وقت المشاهدة وزرار أخضر.'],
  ['nova', '🚀', 'نوفا — داكن زجاجي', 'داكن زجاجي بتوهّج، خريطة رحلة بخط زمني، حلقة تقدّم، فيديو سينمائي واحتفال عند الإنجاز.'],
  ['cinema', '🎬', 'سينما', 'غلاف كبير وصفوف أفقية من كروت المحاضرات (بوسترات)، وفي المحاضرة الفيديو بعرض الشاشة وتحته شريط الحلقات.'],
  ['paper', '📓', 'الكراسة', 'ورق دفتر دافي: فهرس كتاب بنقط وأرقام صفحات، ملاحظة لاصقة للوصف، وحدود خطّ اليد.'],
  ['quest', '🏆', 'التحدّي', 'ألعاب تعليمية: مستويات ونقاط XP، مسار متعرّج بدوائر ونجوم، وأزرار «ملموسة» وتصفيق عند الإنجاز.'],
  ['bento', '🧩', 'بنتو (ألوان المنصة)', 'مربعات بنتو عصرية: كارت كبير بتدرّج المنصة + حلقة تقدّم وإحصائيات، ومحاضرات كبطاقات بأرقام متدرّجة، وفي المحاضرة الفيديو فوق وتحته بطاقات العناصر.'],
  ['mag', '📰', 'مجلة (ألوان المنصة)', 'تصميم مجلة أنيق: عناوين ضخمة وأرقام مفرّغة وخطوط رفيعة، وفي المحاضرة عمود قراءة في النص والوصف كاقتباس والفيديو بظل أحمر.']
];
const E = window.esc || (s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])));
const eff = () => window.LSK ? LSK.clean(U.cfg, false) : {};
const dirty = () => JSON.stringify(U.cfg) !== U.saved;
const uErr = e => { const m = (e && e.message) || String(e || ''); if (/does not exist|schema cache/.test(m)) return 'شغّل ملف db_47_lesson_skin.sql في Supabase الأول'; return m; };
function mark() { const b = document.getElementById('luDirty'); if (b) { const d = dirty(); b.textContent = d ? '● فيه تعديلات لسه ما اتحفظتش' : '✓ كل التعديلات محفوظة ومنشورة'; b.style.color = d ? '#d97706' : '#16a34a'; } }
function push() {
  clearTimeout(U.timer); U.timer = setTimeout(() => { const f = document.getElementById('luFrame'); if (f && f.contentWindow && U.ready) f.contentWindow.postMessage({ type: 'lk-preview', cfg: U.cfg, page: U.page, theme: U.mode }, location.origin); }, 70); mark();
}
function fit() {
  const box = document.getElementById('luBox'), f = document.getElementById('luFrame'); if (!box || !f) return;
  const w = U.dev === 'mobile' ? 390 : 1280, sc = Math.min(1, box.clientWidth / w);
  f.style.width = w + 'px'; f.style.transform = 'scale(' + sc + ')'; f.style.transformOrigin = 'top right';
  const h = Math.max(540, Math.round(innerHeight * 0.8)); box.style.height = h + 'px'; f.style.height = Math.round(h / sc) + 'px';
}
window.addEventListener('resize', () => { try { fit(); } catch (e) {} });
window.addEventListener('message', e => { if (e.origin === location.origin && e.data && e.data.type === 'lk-ready') { U.ready = true; push(); } });

const CSS = '<style>.luw{display:grid;grid-template-columns:minmax(330px,440px) 1fr;gap:16px;align-items:start}@media(max-width:1000px){.luw{grid-template-columns:1fr}.luprev{order:-1;position:static!important}}'
  + '.luside{display:flex;flex-direction:column;gap:10px}.lub{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px 16px}.lub>b{display:block;margin-bottom:10px;font-size:15px}'
  + '.luskins{display:grid;grid-template-columns:1fr 1fr;gap:10px}.lusk{border:2px solid var(--line);border-radius:14px;padding:11px;cursor:pointer;background:var(--bg);text-align:start;font:inherit;color:inherit}.lusk.on{border-color:var(--brand,#ef4444);background:rgba(239,68,68,.08)}.lusk b{display:block;font-size:14px}.lusk small{display:block;color:var(--muted);font-weight:600;line-height:1.7;margin-top:3px;font-size:12px}'
  + '.lcr2{display:flex;gap:8px;align-items:center;margin-bottom:8px}.lcr2 label{flex:1;font-weight:700;font-size:13.5px}.lcr2 input[type=color]{width:46px;height:38px;padding:2px;border-radius:10px;border:1px solid var(--line);background:var(--card);flex:none}.lcr2 input[data-ch]{width:92px;direction:ltr}'
  + '.luck{display:flex;gap:9px;align-items:flex-start;margin-bottom:9px;font-weight:700;font-size:13.5px;cursor:pointer;line-height:1.7}.luck input{width:auto;margin-top:5px}.lulb{display:grid;grid-template-columns:1fr 1fr;gap:8px}.lulb label{font-weight:700;font-size:12.5px;display:block;margin-bottom:3px}.lulb input{width:100%}'
  + '.luprev{position:sticky;top:76px}.lubar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px}#luBox{position:relative;border:1px solid var(--line);border-radius:16px;overflow:hidden;background:#e5e7eb}#luFrame{border:0;background:#fff;position:absolute;top:0;right:0;display:block}.lubt.on{background:var(--brand,#ef4444)!important;color:#fff!important}</style>';

function formHtml() {
  const c = eff(), sk = c.skin, classic = sk === 'classic';
  const skins = '<div class="lub"><b>🎨 اختار الشكل</b><div class="luskins">' + SKINS.map(s => '<button type="button" class="lusk' + (sk === s[0] ? ' on' : '') + '" data-act="luSkin" data-id="' + s[0] + '"><b>' + s[1] + ' ' + s[2] + '</b><small>' + s[3] + '</small></button>').join('') + '</div></div>';
  if (classic) return skins + '<div class="lub"><p class="nt" style="margin:0">الشكل القديم مالوش إعدادات إضافية — هو نفس الصفحة اللي الطلاب بيشوفوها دلوقتي. اختار شكل تاني عشان تتحكم في الألوان والتفاصيل.</p></div>' + labelsBox(c);
  const cols = '<div class="lub"><b>🌈 الألوان</b>' + KEYS_COLOR.map(k => '<div class="lcr2"><label>' + k[1] + '</label><input type="color" data-uk="' + k[0] + '" value="' + E(c[k[0]]) + '"><input data-uk="' + k[0] + '" data-ch="1" value="' + E(c[k[0]]) + '" maxlength="7"></div>').join('')
    + '<button type="button" class="btn s g" data-act="luColorsRs">↺ ألوان الشكل الأصلية</button></div>';
  const fl = '<div class="lub"><b>⚙️ التفاصيل</b>' + FLAGS.map(f => '<label class="luck"><input type="checkbox" data-uf="' + f[0] + '"' + (c[f[0]] ? ' checked' : '') + '><span>' + f[1] + '</span></label>').join('')
    + '<label style="font-weight:700;font-size:13.5px;display:block;margin-top:6px">استدارة الأركان: <b class="lrv" id="luRv">' + c.radius + 'px</b></label><input type="range" data-ur="1" min="4" max="34" value="' + c.radius + '" style="width:100%"></div>';
  return skins + cols + fl + labelsBox(c);
}
function labelsBox(c) {
  return '<div class="lub"><b>✍️ النصوص (سيبها زي ما هي أو غيّرها)</b><div class="lulb">' + LABELS.map(l => '<div><label>' + l[1] + '</label><input data-ul="' + l[0] + '" maxlength="40" value="' + E(c[l[0]]) + '"></div>').join('') + '</div></div>';
}
function redraw() { const f = document.getElementById('luForm'); if (f) f.innerHTML = formHtml(); }

VIEWS.xlessonui = ['شكل المحاضرات', async () => {
  if (!window.LSK) throw new Error('ملف lesson-skins.js مش متحمّل — ارفعه مع باقي الملفات');
  const r = await sb.rpc('lesson_ui_get'); if (r.error) throw new Error(uErr(r.error));
  U.cfg = r.data && typeof r.data === 'object' ? r.data : {}; U.saved = JSON.stringify(U.cfg); U.ready = false; U.page = 'course';
  setTimeout(() => { fit(); mark(); }, 30);
  return CSS + '<div class="note" style="margin:0 0 12px">🎬 هنا بتتحكم في <b>شكل صفحة الكورس وصفحة المحاضرة</b> عند الطلاب: اختار شكل من الأربعة، عدّل الألوان والتفاصيل وشوف النتيجة قدامك لحظياً في المعاينة (بيانات تجريبية). التعديل بيظهر للطلاب بعد «حفظ ونشر».</div>'
    + '<div class="card" style="margin-bottom:12px"><div class="bar" style="flex-wrap:wrap;gap:8px;margin:0"><button class="btn" data-act="luSave">💾 حفظ ونشر</button><button class="btn s r" data-act="luReset">↩ رجوع للشكل القديم</button><span id="luDirty" style="font-weight:800;font-size:13.5px"></span></div></div>'
    + '<div class="luw"><div class="luside" id="luForm">' + formHtml() + '</div><div class="luprev"><div class="lubar"><b>👁 معاينة حيّة</b><button class="btn s g lubt on" data-act="luPage" data-id="course">📚 صفحة الكورس</button><button class="btn s g lubt" data-act="luPage" data-id="lecture">🎬 صفحة المحاضرة</button><span style="width:10px"></span><button class="btn s g lubt on" data-act="luDev" data-id="desktop">💻</button><button class="btn s g lubt" data-act="luDev" data-id="mobile">📱</button><span style="width:10px"></span><button class="btn s g lubt' + (U.mode === 'light' ? ' on' : '') + '" data-act="luMode" data-id="light" title="معاينة بالوضع النهاري">☀️ نهاري</button><button class="btn s g lubt' + (U.mode === 'dark' ? ' on' : '') + '" data-act="luMode" data-id="dark" title="معاينة بالوضع الليلي">🌙 ليلي</button></div><div id="luBox"><iframe id="luFrame" src="/lesson-preview.html" title="معاينة"></iframe></div></div></div>';
}];
VPERM.xlessonui = ['@admin'];

const ok6 = v => /^#[0-9a-fA-F]{6}$/.test(v);
function setVal(k, v) { const d = LSK.clean({ skin: U.cfg.skin }, false)[k]; if (v === d) delete U.cfg[k]; else U.cfg[k] = v; }
document.addEventListener('input', e => {
  const t = e.target; if (!t.closest || !t.closest('#luForm')) return;
  if (t.dataset.uk) { let v = t.value; if (!ok6(v)) return; v = v.toLowerCase(); setVal(t.dataset.uk, v); document.querySelectorAll('[data-uk="' + t.dataset.uk + '"]').forEach(x => { if (x !== t) x.value = v; }); return push(); }
  if (t.dataset.ur) { setVal('radius', +t.value); const rv = document.getElementById('luRv'); if (rv) rv.textContent = t.value + 'px'; return push(); }
  if (t.dataset.ul) { const v = t.value.trim(); if (!v || v === LSK.LBL[t.dataset.ul]) delete U.cfg[t.dataset.ul]; else U.cfg[t.dataset.ul] = v.slice(0, 40); return push(); }
});
document.addEventListener('change', e => {
  const t = e.target; if (!t.closest || !t.closest('#luForm')) return;
  if (t.dataset.uf) { setVal(t.dataset.uf, t.checked); push(); }
});
Object.assign(ACT, {
  luSkin: id => {
    if (!LSK.SKINS[id]) return; const lb = {}; Object.keys(U.cfg).forEach(k => { if (/^lbl_/.test(k)) lb[k] = U.cfg[k]; });
    U.cfg = Object.assign({ skin: id }, lb); if (id === 'classic') delete U.cfg.skin; redraw(); push();
  },
  luColorsRs: () => { ['c1', 'c2', 'c3', 'bg', 'ink'].forEach(k => delete U.cfg[k]); redraw(); push(); },
  luPage: id => { U.page = id; document.querySelectorAll('.lubt[data-act=luPage]').forEach(b => b.classList.toggle('on', b.dataset.id === id)); push(); },
  luMode: id => { U.mode = id; document.querySelectorAll('.lubt[data-act=luMode]').forEach(b => b.classList.toggle('on', b.dataset.id === id)); push(); },
  luDev: id => { U.dev = id; document.querySelectorAll('.lubt[data-act=luDev]').forEach(b => b.classList.toggle('on', b.dataset.id === id)); fit(); },
  luSave: async () => {
    const r = await sb.rpc('lesson_ui_save', { p_cfg: U.cfg }); if (r.error) throw new Error(uErr(r.error));
    U.cfg = r.data && typeof r.data === 'object' ? r.data : U.cfg; U.saved = JSON.stringify(U.cfg); mark(); toast('✅ تم الحفظ — الشكل الجديد ظهر للطلاب');
  },
  luReset: async () => {
    if (!confirm('ترجّع صفحات الكورس والمحاضرة للشكل القديم؟')) return;
    const r = await sb.rpc('lesson_ui_save', { p_cfg: {} }); if (r.error) throw new Error(uErr(r.error));
    U.cfg = {}; U.saved = '{}'; redraw(); push(); toast('اتعمل رجوع للشكل القديم');
  }
});
Object.assign(ACTPERM, { luSkin: ['@admin'], luColorsRs: ['@admin'], luPage: ['@admin'], luDev: ['@admin'], luMode: ['@admin'], luSave: ['@admin'], luReset: ['@admin'] });
(function () { if (!NAV.some(n => n[0] === 'xlessonui')) { const i = NAV.findIndex(n => n[0] === 'xlanding'); NAV.splice(i >= 0 ? i + 1 : 0, 0, ['xlessonui', '🎬', 'شكل المحاضرات']); } })();
})();
