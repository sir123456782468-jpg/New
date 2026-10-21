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
  if (quiet && feed && feed.dataset.n === String(data.messages.length) && feed.dataset.s === data.status + data.solved && feed.dataset.v === String(data.student_seen_at || '')) return;
  const draft = box.querySelector('#spTxt') ? box.querySelector('#spTxt').value : '', cans = (await loadCan()).filter(c => c.kind === 'all' || c.kind === data.kind), k = KB[data.kind] || KB.tech, cx = data.context || {};
  box.innerHTML = '<div class="bar" style="margin-bottom:8px"><b>' + esc(data.name || 'طالب') + '</b><span class="spk ' + k[2] + '">' + k[0] + ' ' + k[1] + '</span><span dir="ltr" style="color:var(--muted)">' + esc(data.phone) + '</span>'
    + (data.verified === false ? '<span class="pill no" title="الطالب كتب الرقم من غير تسجيل دخول، اتأكد من هويته قبل ما تشاركه أي بيانات">⚠️ غير موثّق</span>' : '')
    + '<span class="pill ' + (data.status === 'open' ? 'ok' : 'no') + '">' + (data.status === 'open' ? 'مفتوحة' : 'منتهية') + '</span>'
    + '<span style="margin-right:auto;display:flex;gap:6px;flex-wrap:wrap">' + (data.kind === 'academic' ? '<button class="btn s ' + (data.solved ? 'g' : '') + '" data-act="s5Solve" data-id="' + id + '" data-v="' + (data.solved ? 0 : 1) + '">' + (data.solved ? '↩️ لسه محتاج متابعة' : '✅ تم الحل') + '</button>' : '')
    + '<button class="btn s ' + (data.status === 'open' ? 'r' : 'g') + '" data-act="s5Close" data-id="' + id + '" data-c="' + (data.status === 'open' ? 1 : 0) + '">' + (data.status === 'open' ? '⛔ إنهاء' : '↩️ إعادة فتحها') + '</button><button class="btn s r" data-act="s5Del" data-id="' + id + '" title="مسح المحادثة نهائياً">🗑</button></span></div>'
    + (data.kind === 'academic' && (cx.course || cx.topic || cx.lesson) ? '<div class="spctx">📘 سؤال علمي' + (cx.course ? '<br>📚 الكورس: ' + esc(cx.course) : '') + (cx.lesson ? '<br>🎬 الدرس: ' + esc(cx.lesson) : '') + (cx.topic ? '<br>❓ الموضوع: ' + esc(cx.topic) : '') + '</div>' : '')
    + infoHTML(data)
    + '<div id="spFeed" data-n="' + data.messages.length + '" data-s="' + data.status + data.solved + '" data-v="' + (data.student_seen_at || '') + '">' + data.messages.map(msgHTML).join('') + '</div>'
    + (data.status === 'open' ? (cans.length ? '<div class="spcan"><select id="s5Can" data-n="' + esc((data.name || '').split(' ')[0]) + '"><option value="">🗂 رد جاهز…</option>' + cans.map(c => '<option value="' + c.id + '">' + esc(c.title) + '</option>').join('') + '</select></div>' : '')
      + '<div class="spin"><textarea id="spTxt" dir="auto" placeholder="اكتب ردك..." rows="2">' + esc(draft) + '</textarea><input type="file" id="spImg" accept="image/*" hidden><button class="btn s g" data-act="s5Pick" title="إرفاق صورة">📎</button><button class="btn" data-act="s5Send" data-id="' + id + '">إرسال</button></div><small id="spInfo" style="color:var(--muted)"></small>'
      : '<p class="nt" style="margin-top:10px">المحادثة منتهية — الطالب لو راسل تاني هيبدأ محادثة جديدة، وده السجل محفوظ هنا.</p>');
  const f2 = box.querySelector('#spFeed'); if (f2 && (near || !quiet)) f2.scrollTop = f2.scrollHeight;
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
  s5Del: async id => { if (!confirm('مسح المحادثة نهائياً بكل رسائلها؟ مش هتقدر ترجعها.')) return; const { error } = await sb.rpc('support_admin_delete', { p_thread: id }); if (error) throw error; SP.id = null; go(window.__cur || 'support'); },
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
const CK = [
  ['essay_images', '🖼️', 'صور إجابات المقالي (المصحّحة)', 'img', 'الدرجة بتفضل محفوظة، بس صورة إجابة الطالب بتتشال من التخزين. (بتتحذف اللي اتصححت بس).', 90],
  ['support_images', '📎', 'صور الدعم الفني', 'img', 'بتتشال الصور من المحادثات القديمة وبيفضل نص الرسالة.', 60],
  ['support_closed', '💬', 'محادثات الدعم المنتهية', 'row', 'بتتمسح المحادثات المنتهية بالكامل بما فيها رسايلها.', 90],
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
  const free = Math.max(P.db * 0.85 - U.db_bytes, 0), cap = U.per_attempt > 0 ? Math.floor(free / U.per_attempt) : null;
  const tmax = Math.max(...(U.tables || []).map(t => +t.bytes), 1);
  const verdict = dbp > 85 ? ['d', '🔴 قاعدة البيانات قربت تتملي — نضّف أو ارفع الخطة'] : dbp > 65 ? ['w', '🟠 استهلاك متوسط — راقبه'] : ['ok', '🟢 وضعك كويس'];
  return '<div class="bar"><b>الخطة الحالية على Supabase:</b><select id="plSel" style="max-width:220px">' + Object.keys(PLANS).map(k => '<option value="' + k + '"' + (k === pk ? ' selected' : '') + '>' + PLANS[k].n + '</option>').join('') + '</select><span class="pill ' + (verdict[0] === 'd' ? 'no' : 'ok') + '">' + verdict[1] + '</span><button class="btn s g" data-go="maint" style="margin-right:auto">🔄 تحديث</button></div>'
    + '<div class="v5grid2"><div class="card"><b>🗃️ قاعدة البيانات</b>' + gauge(U.db_bytes, P.db) + '<p class="nt" style="margin:8px 0 0">' + (cap != null ? 'بالمعدل الحالي (' + fmtB(U.per_attempt) + ' للمحاولة الواحدة) تقدر تستوعب حوالي <b>' + nf(cap) + '</b> محاولة امتحان كمان قبل ما توصل لـ85%.' : 'لسه مفيش محاولات كفاية للتقدير.') + '</p></div>'
    + '<div class="card"><b>🖼️ تخزين الملفات (صور + ملفات)</b>' + gauge(st, P.st) + '<p class="nt" style="margin:8px 0 0">' + (U.storage || []).map(b => esc(b.bucket) + ': ' + nf(b.files) + ' ملف (' + fmtB(b.bytes) + ')').join(' • ') + '</p></div></div>'
    + '<div class="v5k" style="margin-top:14px">' + Object.keys(COUNT_L).map(k => '<div class="kk"><b>' + nf(U.counts[k]) + '</b><span>' + COUNT_L[k] + '</span></div>').join('') + '<div class="kk"><b>' + nf(U.auth_users) + '</b><span>حسابات الدخول (حد Supabase المجاني 50,000 نشط)</span></div></div>'
    + '<h3 class="v5h">📊 أكبر الجداول حجماً</h3><div class="card">' + (U.tables || []).map(t => '<div class="v5row"><span class="nm">' + esc(TBL_L[t.name] || t.name) + ' <small dir="ltr">' + esc(t.name) + '</small></span><small>' + nf(t.rows) + ' صف</small><div style="flex:1 1 160px;min-width:120px"><div class="v5g" style="margin:0"><i style="width:' + Math.max(2, t.bytes / tmax * 100) + '%"></i></div></div><b style="min-width:70px;text-align:left">' + fmtB(t.bytes) + '</b></div>').join('') + '</div>'
    + '<h3 class="v5h">🧹 تنظيف آمن (للمالك فقط) — بيوريك العدد قبل ما يحذف</h3><div class="v5grid2">' + CK.map(c => '<div class="card" data-ck="' + c[0] + '"><b>' + c[1] + ' ' + c[2] + '</b><p class="nt" style="margin:4px 0 8px">' + esc(c[4]) + '</p><div class="bar" style="margin:0"><span class="nt" style="margin:0">أقدم من</span><select data-ckd style="max-width:120px;min-width:0;flex:none">' + [7, 14, 30, 60, 90, 180, 365].map(d => '<option value="' + d + '"' + (d === c[5] ? ' selected' : '') + '>' + d + ' يوم</option>').join('') + '</select><button class="btn s g" data-act="mtPrev" data-id="' + c[0] + '">👁 معاينة</button></div><div class="mtOut" style="margin-top:8px;font-weight:700"></div></div>').join('') + '</div>'
    + '<h3 class="v5h">💾 نسخة احتياطية (الخطة المجانية مفيهاش نسخ تلقائي!)</h3><div class="card"><p class="nt">نزّل نسخة على جهازك كل أسبوع تقريباً. الملفات دي بتتولّد في المتصفح وما بتتخزّنش في أي مكان.</p><div class="bar" style="margin:0"><button class="btn s" data-act="bkStudents">👥 الطلاب (CSV)</button><button class="btn s" data-act="bkResults">📊 النتائج (CSV)</button><button class="btn s g" data-act="bkAll">📦 نسخة كاملة (JSON)</button></div><div id="bkSt" class="nt" style="margin:10px 0 0"></div></div>';
}
document.addEventListener('change', e => { const t = e.target; if (t && t.id === 'plSel') { try { localStorage.setItem('adm_plan', t.value); } catch (x) {} go('maint'); } });
const ckOf = id => CK.find(c => c[0] === id);
async function mtRemove(kind, days, out) {
  const bucket = kind === 'essay_images' ? 'essay-files' : 'support-files'; let done = 0, rows = 0, guard = 0;
  for (;;) {
    if (++guard > 80) break;
    const { data: paths, error } = await sb.rpc('cleanup_list', { p_kind: kind, p_days: days, p_limit: 100 }); if (error) throw new Error(errMsg(error));
    if (!paths || !paths.length) break;
    out.textContent = '⏳ جاري حذف الملفات… (' + done + ')';
    const rm = await sb.storage.from(bucket).remove(paths); if (rm.error) throw new Error('تعذر حذف الملفات من التخزين: ' + rm.error.message + ' — شغّل db_26 تاني وتأكد إنك مالك');
    const { data: n, error: e2 } = await sb.rpc('cleanup_mark', { p_kind: kind, p_paths: paths }); if (e2) throw new Error(errMsg(e2));
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
  GR.y = GR.y || YEARS[0]; setTimeout(() => grLoad(true));
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
