// =====================================================================
// v3: صلاحيات دقيقة + فريق العمل + سجل العمليات + إعدادات المنصة (صورة المدرس)
//     + تقرير متابعة الطالب (PDF) + اللافتات
// بيتحمّل بعد admin-v2.js (ومحتاج supabase_update_v9.sql)
// =====================================================================

// ---------- سجل الصلاحيات: أي قسم/إجراء جديد يتضاف هنا بس ----------
// [القسم, أيقونة, الاسم, [[الإجراء, الوصف], ...]]
const CAPS = [
  ['content', '📚', 'المحتوى (كورسات / دروس / امتحانات)', [['view', 'عرض'], ['edit', 'إضافة وتعديل'], ['delete', 'حذف']]],
  ['results', '🎓', 'النتائج وتصحيح المقالي', [['view', 'عرض النتائج والتقارير'], ['grade', 'تصحيح المقالي وتعليق على الإجابات'], ['release', 'إظهار / إخفاء النتائج للطلاب']]],
  ['students', '👥', 'الطلاب', [['view', 'عرض الطلاب'], ['enroll', 'تفعيل / إلغاء كورس'], ['block', 'إيقاف الحساب'], ['kick', 'طرد من الجهاز'], ['attempts', 'فتح محاولة جديدة / إعادة كورس'], ['locks', 'قفل وفتح كورس / درس / امتحان']]],
  ['codes', '🎟️', 'أكواد التفعيل', [['view', 'عرض'], ['generate', 'توليد وطباعة'], ['delete', 'حذف']]],
  ['ann', '📢', 'الإعلانات والإشعارات', [['edit', 'نشر وإدارة']]],
  ['support', '💬', 'الدعم الفني', [['view', 'عرض المحادثات'], ['reply', 'الرد'], ['close', 'إنهاء / إعادة فتح'], ['delete', 'مسح']]],
  ['devices', '💻', 'أجهزة الدخول', [['view', 'عرض']]],
  ['reports', '🧾', 'تقارير الطلاب', [['student', 'إنشاء تقرير طالب'], ['settings', 'إعدادات التقرير (صورة المدرس …)']]],
  ['banners', '🎨', 'اللافتات', [['view', 'عرض'], ['edit', 'إنشاء وتعديل'], ['delete', 'حذف']]],
  ['audit', '🕵️', 'سجل العمليات', [['view', 'عرض']]]
];
Object.assign(VPERM, { report: ['reports.student'], settings: ['g:reports'], banners: ['g:banners'], audit: ['audit.view'] });
Object.assign(ACTPERM, {
  stReport: ['reports.student'], rpGen: ['reports.student'], rpPdf: ['reports.student'], rpPrint: ['reports.student'], rpPick: ['reports.student'],
  stSetPhoto: ['reports.settings'], stPhotoSave: ['reports.settings'], stPhotoDel: ['reports.settings'], stTexts: ['reports.settings'],
  bnNew: ['banners.edit'], bnEdit: ['banners.view'], bnSave: ['banners.edit'], bnDup: ['banners.edit'], bnTog: ['banners.edit'], bnReshow: ['banners.edit'], bnDel: ['banners.delete']
});
const capName = k => {
  const [g, a] = String(k).split('.'), G = CAPS.find(c => c[0] === g);
  if (!G) return k;
  if (!a || a === '*') return G[1] + ' ' + G[2] + ' (كل الإجراءات)';
  const A = G[3].find(x => x[0] === a); return G[1] + ' ' + G[2] + ' ← ' + (A ? A[1] : a);
};

// ---------- فريق العمل (صلاحيات لكل إجراء) ----------
function permsPicker(sel) {
  sel = sel || [];
  return CAPS.map(([g, ic, title, acts]) => {
    const all = sel.includes(g) || sel.includes(g + '.*');
    return '<div class="card pcard3" style="margin-top:8px;padding:10px 12px"><label class="chk" style="margin:0"><input type="checkbox" class="pg ck" data-g="' + g + '"' + (all ? ' checked' : '') + '> <b>' + ic + ' ' + title + '</b> <small style="color:var(--muted)">(كل الإجراءات)</small></label>'
      + '<div style="display:flex;gap:4px 18px;flex-wrap:wrap;padding-right:30px;margin-top:6px">' + acts.map(a => '<label class="chk" style="margin:0;font-size:12.5px"><input type="checkbox" class="pa ck" data-p="' + g + '.' + a[0] + '"' + (all || sel.includes(g + '.' + a[0]) ? ' checked' : '') + (all ? ' disabled' : '') + '> ' + a[1] + '</label>').join('') + '</div></div>';
  }).join('');
}
document.addEventListener('change', e => {
  const h = e.target.closest && e.target.closest('.pg'); if (!h) return;
  h.closest('.pcard3').querySelectorAll('.pa').forEach(c => { c.checked = h.checked; c.disabled = h.checked; });
});
function readPerms(root) {
  const out = []; root.querySelectorAll('.pg').forEach(h => { if (h.checked) out.push(h.dataset.g); else h.closest('.pcard3').querySelectorAll('.pa:checked').forEach(c => out.push(c.dataset.p)); });
  return out;
}
async function vStaff3() {
  const { data, error } = await sb.rpc('staff_list');
  if (error) { if ((error.message || '').includes('forbidden')) return '<div class="empty">🔒 هذا القسم للمالك فقط.</div>'; throw new Error((error.message || '').includes('does not exist') || (error.message || '').includes('schema cache') ? 'شغّل ملف supabase_update_v9.sql في Supabase الأول' : error.message); }
  S.staff = data || [];
  return '<div class="card" style="margin-bottom:16px" id="stfBox"><b>➕ إضافة عضو فريق</b><p class="nt" style="margin:6px 0 10px;line-height:1.9">اكتب إيميل الحساب أو رقم الهاتف المسجّل بيه في المنصة. العضو بيدخل من صفحة <b>/admin</b> بنفس حسابه، ومش هيشوف ولا يقدر يعمل غير اللي تعلّمه هنا. علّم «كل الإجراءات» للقسم كله، أو اختار إجراءات بعينها.</p><input id="sf_w" dir="ltr" placeholder="الإيميل أو رقم الهاتف">' + permsPicker(['support.view', 'support.reply']) + '<button class="btn" data-act="stfAdd" style="margin-top:12px">إضافة</button></div>'
    + '<div class="tw"><table><tr><th>العضو</th><th>الصلاحيات</th><th></th></tr>' + (S.staff.map(m => '<tr><td>' + esc(m.label || '—') + '<br><small dir="ltr" style="color:var(--muted)">' + esc(m.email || '') + '</small></td><td>' + ((m.perms || []).map(p => '<span class="pill ok" style="margin:2px">' + esc(capName(p)) + '</span>').join(' ') || '<span class="pill no">بدون صلاحيات</span>') + '</td><td style="white-space:nowrap"><button class="btn s g" data-act="stfEdit" data-id="' + m.user_id + '">✏️ الصلاحيات</button> <button class="btn s r" data-act="stfDel" data-id="' + m.user_id + '">إزالة</button></td></tr>').join('') || '<tr><td colspan="3" class="empty">لا يوجد أعضاء بعد</td></tr>') + '</table></div>'
    + '<p class="nt" style="margin-top:10px;line-height:1.9">ملاحظة: صلاحية «مسؤول» الكاملة بتتدار من قسم «المسؤولون». أعضاء الفريق صلاحياتهم محدودة بالمكتوب هنا، والسيرفر بيرفض أي حاجة برّه كده حتى لو حاولوا يتحايلوا على الواجهة.</p>';
}
VIEWS.staff = ['فريق العمل', vStaff3];
Object.assign(ACT, {
  stfAdd: async () => {
    const w = $('#sf_w').value.trim(), perms = readPerms($('#stfBox')); if (!w) throw new Error('اكتب الإيميل أو الهاتف'); if (!perms.length) throw new Error('اختار صلاحية واحدة على الأقل');
    const { error } = await sb.rpc('staff_add', { p_who: w, p_perms: perms }); if (error) throw new Error((error.message || '').includes('user_not_found') ? 'مفيش حساب بالإيميل/الرقم ده' : error.message);
    toast('تمت الإضافة ✅'); go('staff');
  },
  stfEdit: id => {
    const m = (S.staff || []).find(x => x.user_id === id); if (!m) return; closeModal();
    modal('صلاحيات: ' + (m.label || m.email || ''), '<div id="stfEd">' + permsPicker(m.perms || []) + '<button class="btn" data-act="stfSave" data-id="' + id + '" style="margin-top:14px;width:100%">💾 حفظ الصلاحيات</button></div>', null);
    $('#modal .mbox').classList.add('wide');
  },
  stfSave: async id => {
    const m = (S.staff || []).find(x => x.user_id === id); if (!m) return; const perms = readPerms($('#stfEd')); if (!perms.length) throw new Error('اختار صلاحية واحدة على الأقل (أو اضغط «إزالة» لو عايز تشيله)');
    const who = m.email || m.label; const { error } = await sb.rpc('staff_add', { p_who: who, p_perms: perms }); if (error) throw error;
    toast('تم تحديث الصلاحيات ✅'); closeModal(); go('staff');
  }
});

// ---------- سجل العمليات ----------
const AUD = {
  'course.create': 'إضافة كورس', 'course.update': 'تعديل كورس', 'course.delete': 'حذف كورس', 'course.reset_progress': 'إعادة فتح كورس لطالب',
  'lesson.delete': 'حذف درس', 'item.delete': 'حذف عنصر محتوى', 'quiz.create': 'إنشاء امتحان', 'quiz.update': 'تعديل امتحان', 'quiz.delete': 'حذف امتحان',
  'enroll.create': 'تفعيل كورس لطالب', 'enroll.delete': 'إلغاء اشتراك', 'student.update': 'تعديل بيانات/حالة طالب', 'student.kick': 'طرد طالب من جهازه',
  'ann.create': 'نشر إعلان', 'ann.update': 'تعديل إعلان', 'ann.delete': 'حذف إعلان', 'banner.create': 'إنشاء لافتة', 'banner.update': 'تعديل لافتة', 'banner.delete': 'حذف لافتة', 'banner.reshow': 'إعادة إظهار لافتة للكل',
  'staff.create': 'إضافة عضو فريق', 'staff.update': 'تعديل صلاحيات عضو', 'staff.delete': 'إزالة عضو فريق', 'admin.create': 'إضافة مسؤول', 'admin.delete': 'إزالة مسؤول',
  'codes.generate': 'توليد أكواد', 'codes.delete': 'حذف أكواد', 'attempt.grant': 'فتح محاولة جديدة', 'report.student': 'إنشاء تقرير طالب', 'support.delete': 'مسح محادثة دعم',
  'settings.teacher_photo': 'تغيير صورة المدرس', 'settings.teacher_name': 'تغيير اسم المدرس', 'settings.report_footer': 'تغيير تذييل التقرير', 'settings.platform_name': 'تغيير اسم المنصة', 'settings.secret_bunny_key': 'تغيير مفتاح Bunny'
};
const audName = a => AUD[a] || String(a || '').replace(/^ui\./, '');
async function vAudit() {
  const { data, error } = await sb.from('admin_audit').select('id,at,actor_label,action,target,details').order('at', { ascending: false }).limit(500);
  if (error) throw new Error((error.message || '').includes('does not exist') ? 'شغّل ملف supabase_update_v9.sql في Supabase الأول' : error.message);
  window.__aud = data || [];
  setTimeout(() => { const q = $('#aq'), w = $('#aw'); if (!q) return; const draw = () => { const t = q.value.trim().toLowerCase(), a = w.value; const l = window.__aud.filter(r => (!a || r.actor_label === a) && (!t || (audName(r.action) + ' ' + (r.target || '') + ' ' + (r.actor_label || '') + ' ' + JSON.stringify(r.details || '')).toLowerCase().includes(t))); $('#at').innerHTML = '<tr><th>الوقت</th><th>مين</th><th>إيه اللي حصل</th><th>على إيه</th><th>تفاصيل</th></tr>' + (l.map(r => '<tr><td style="white-space:nowrap">' + new Date(r.at).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' }) + '</td><td>' + esc(r.actor_label || '—') + '</td><td><b>' + esc(audName(r.action)) + '</b></td><td>' + esc(r.target || '') + '</td><td><small style="color:var(--muted)">' + esc(r.details ? JSON.stringify(r.details).slice(0, 120) : '') + '</small></td></tr>').join('') || '<tr><td colspan="5" class="empty">لا توجد عمليات</td></tr>'); $('#ac').textContent = l.length + ' عملية'; }; q.addEventListener('input', draw); w.addEventListener('change', draw); draw(); });
  const who = Array.from(new Set((data || []).map(r => r.actor_label).filter(Boolean)));
  return '<p class="nt">كل عملية مهمة اتعملت في اللوحة (مين عملها وإمتى). بتتمسح تلقائياً بعد 180 يوم عشان ما تاكلش مساحة.</p><div class="bar"><input id="aq" placeholder="🔍 بحث في السجل"><select id="aw"><option value="">كل الأعضاء</option>' + who.map(x => '<option>' + esc(x) + '</option>').join('') + '</select><span id="ac" style="color:var(--muted);font-weight:700"></span></div><div class="tw"><table id="at"></table></div>';
}
VIEWS.audit = ['سجل العمليات', vAudit];

// ---------- إعدادات المنصة: صورة المدرس + نصوص التقرير + مفتاح Bunny ----------
const V3 = { set: null };
async function loadSettings(force) {
  if (V3.set && !force) return V3.set;
  const r = await sb.rpc('get_site_settings');
  if (r.error) { if ((r.error.message || '').includes('does not exist')) throw new Error('شغّل ملف supabase_update_v9.sql في Supabase الأول'); throw r.error; }
  return (V3.set = r.data || {});
}
function photoBox(src, size) {
  return '<div style="width:' + size + 'px;height:' + size + 'px;border-radius:22px;overflow:hidden;background:var(--bg);border:1px solid var(--line);display:grid;place-items:center;flex:none">' + (src ? '<img src="' + esc(src) + '" alt="" style="width:100%;height:100%;object-fit:cover">' : '<span style="font-size:40px;opacity:.5">👤</span>') + '</div>';
}
async function vSettings() {
  const st = await loadSettings(true); let own = false, bun = null;
  if (!window.__perms) { try { const r = await sb.rpc('secret_status'); if (!r.error) { own = true; bun = r.data && r.data.bunny_key; } } catch (e) {} }
  return '<div class="card" style="margin-bottom:16px"><b>👤 صورة المدرس (بتظهر في تقرير الطالب)</b><p class="nt" style="margin:6px 0 12px">ارفع صورة، اضبط القص (تكبير + تحريك) وهتتحفظ مضغوطة صغيرة. بتتحط في مكانها المظبوط أعلى التقرير.</p><div class="bar" style="margin:0;align-items:center">' + photoBox(st.teacher_photo, 96)
    + '<div style="display:flex;gap:8px;flex-wrap:wrap"><label class="btn s" style="cursor:pointer;margin:0;color:#fff">📷 ' + (st.teacher_photo ? 'تغيير الصورة' : 'رفع صورة') + '<input type="file" id="tpf" accept="image/*" hidden></label>' + (st.teacher_photo ? '<button class="btn s r" data-act="stPhotoDel">إزالة الصورة</button>' : '') + '</div></div></div>'
    + '<div class="card" style="margin-bottom:16px"><b>📝 نصوص التقرير</b><div class="row2"><div><label>اسم المدرس</label><input id="stn" value="' + esc(st.teacher_name || 'Mr. Sherif Khafagy') + '"></div><div><label>اسم المنصة</label><input id="stp" value="' + esc(st.platform_name || 'The Leader In English') + '"></div></div><label>سطر أسفل كل صفحة (اختياري)</label><input id="stf" value="' + esc(st.report_footer || '') + '" placeholder="مثال: للتواصل: 01xxxxxxxxx"><button class="btn s" style="margin-top:12px" data-act="stTexts">💾 حفظ النصوص</button></div>'
    + (own ? '<div class="card"><b>🔐 فيديو محمي (Bunny Stream) — للمالك فقط</b><p class="nt" style="margin:6px 0 10px;line-height:1.9">Bunny Stream بيخلّي الفيديو مايتفتحش غير من الموقع بتاعك (روابط موقّعة بتنتهي بعد 6 ساعات). من لوحة Bunny: Library ← Security ← فعّل <b>Embed View Token Authentication</b> وحدّد الدومين، وانسخ <b>Token Authentication Key</b> وحطه هنا. بعدها في «محتوى الدرس» الصق رابط الـEmbed بتاع Bunny عادي والمنصة بتحوّله لوحدها.<br>الحالة: ' + (bun ? '<span class="pill ok">✅ المفتاح محفوظ</span>' : '<span class="pill no">لسه مفيش مفتاح</span>') + '</p><div class="bar" style="margin:0"><input id="bnk" type="password" dir="ltr" placeholder="Token Authentication Key" autocomplete="off"><button class="btn s" data-act="stBunny">💾 حفظ المفتاح</button>' + (bun ? '<button class="btn s r" data-act="stBunnyDel">حذف المفتاح</button>' : '') + '</div><p class="nt" style="margin-top:8px">المفتاح بيتخزّن في قاعدة البيانات ومابيرجعش للمتصفح أبداً.</p></div>' : '');
}
VIEWS.settings = ['إعدادات المنصة', vSettings];
document.addEventListener('change', e => { if (e.target && e.target.id === 'tpf' && e.target.files[0]) photoEditor(e.target.files[0]); });
function photoEditor(file) {
  const url = URL.createObjectURL(file), img = new Image();
  img.onerror = () => toast('الملف مش صورة صالحة', true);
  img.onload = () => {
    const S0 = 400, base = Math.max(S0 / img.width, S0 / img.height); let zoom = 1, ox = 0, oy = 0;
    modal('قص صورة المدرس', '<div style="display:grid;place-items:center"><canvas id="pc" width="' + S0 + '" height="' + S0 + '" style="width:280px;height:280px;border-radius:22px;border:1px solid var(--line);touch-action:none;cursor:grab;background:#fff"></canvas></div>'
      + '<p class="nt" style="text-align:center;margin:8px 0">اسحب الصورة بإصبعك/الماوس لتحريكها</p><label>التكبير</label><input type="range" id="pz" min="1" max="3" step="0.01" value="1"><label>إزاحة أفقية</label><input type="range" id="px" min="-100" max="100" value="0"><label>إزاحة رأسية</label><input type="range" id="py" min="-100" max="100" value="0">'
      + '<div class="bar" style="margin-top:14px"><button class="btn" data-act="stPhotoSave">💾 حفظ الصورة</button><span id="pinfo" class="nt" style="margin:0"></span></div>', null);
    const c = $('#pc'), x = c.getContext('2d');
    const draw = () => {
      const w = img.width * base * zoom, h = img.height * base * zoom, mx = Math.max(0, (w - S0) / 2), my = Math.max(0, (h - S0) / 2);
      ox = Math.max(-100, Math.min(100, ox)); oy = Math.max(-100, Math.min(100, oy));
      x.fillStyle = '#fff'; x.fillRect(0, 0, S0, S0); x.imageSmoothingQuality = 'high';
      x.drawImage(img, S0 / 2 - w / 2 - ox / 100 * mx, S0 / 2 - h / 2 - oy / 100 * my, w, h);
      $('#px').value = ox; $('#py').value = oy;
    };
    $('#pz').oninput = e => { zoom = +e.target.value; draw(); }; $('#px').oninput = e => { ox = +e.target.value; draw(); }; $('#py').oninput = e => { oy = +e.target.value; draw(); };
    let drag = null;
    c.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, ox, oy }; c.setPointerCapture(e.pointerId); c.style.cursor = 'grabbing'; });
    c.addEventListener('pointermove', e => { if (!drag) return; const w = img.width * base * zoom, h = img.height * base * zoom, mx = Math.max(1, (w - S0) / 2), my = Math.max(1, (h - S0) / 2), k = S0 / 280; ox = drag.ox - (e.clientX - drag.x) * k / mx * 100; oy = drag.oy - (e.clientY - drag.y) * k / my * 100; draw(); });
    const up = () => { drag = null; c.style.cursor = 'grab'; }; c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
    window.__photo = { get: () => { draw(); return c.toDataURL('image/jpeg', 0.86); } };
    draw();
  };
  img.src = url;
}
Object.assign(ACT, {
  stPhotoSave: async el => {
    const d = window.__photo.get(); const info = $('#pinfo'); if (info) info.textContent = '⏳ جاري الحفظ...';
    const { error } = await sb.rpc('set_site_setting', { p_key: 'teacher_photo', p_value: d }); if (error) throw new Error((error.message || '').includes('too_big') ? 'الصورة كبيرة، جرّب صورة أبسط' : error.message);
    V3.set = null; toast('تم حفظ صورة المدرس ✅'); closeModal(); go('settings');
  },
  stPhotoDel: async () => { if (!confirm('إزالة صورة المدرس؟')) return; const { error } = await sb.rpc('set_site_setting', { p_key: 'teacher_photo', p_value: null }); if (error) throw error; V3.set = null; toast('تمت الإزالة'); go('settings'); },
  stTexts: async () => {
    for (const [k, id] of [['teacher_name', 'stn'], ['platform_name', 'stp'], ['report_footer', 'stf']]) { const { error } = await sb.rpc('set_site_setting', { p_key: k, p_value: $('#' + id).value.trim() }); if (error) throw error; }
    V3.set = null; toast('تم حفظ النصوص ✅');
  },
  stBunny: async () => { const v = $('#bnk').value.trim(); if (v.length < 8) throw new Error('اكتب المفتاح كامل'); const { error } = await sb.rpc('set_secret', { p_key: 'bunny_key', p_value: v }); if (error) throw error; toast('تم حفظ مفتاح Bunny ✅'); go('settings'); },
  stBunnyDel: async () => { if (!confirm('حذف المفتاح؟ فيديوهات Bunny هتقف لحد ما تحط مفتاح جديد.')) return; const { error } = await sb.rpc('set_secret', { p_key: 'bunny_key', p_value: null }); if (error) throw error; toast('تم الحذف'); go('settings'); }
});
Object.assign(ACTPERM, { stBunny: ['@admin'], stBunnyDel: ['@admin'] });

// ---------- تعديل عنصر محتوى (اسم + رابط + وصف) ----------
Object.assign(ACT, {
  itEdit: async (id, el) => {
    const { data, error } = await sb.from('lesson_items').select('title,url,kind,description').eq('id', id).single(); if (error || !data) throw error || new Error('مش لاقي العنصر');
    const lid = el.dataset.l; closeModal();
    modal('تعديل: ' + data.title, '<form><label>الاسم (بيظهر للطالب)</label><input name="t" required value="' + esc(data.title) + '"><label>الرابط</label><input name="u" dir="ltr" required value="' + esc(data.url) + '"><label>الوصف (اختياري — بيظهر للطالب تحت العنصر)</label><textarea name="d" dir="auto" style="min-height:90px">' + esc(data.description) + '</textarea><button class="btn" style="width:100%;margin-top:14px">حفظ</button></form>',
      async f => { const nu = normUrl(f.get('u')); if (!f.get('t').trim() || !nu) throw new Error('الاسم والرابط (https) مطلوبين'); const { error: e2 } = await sb.from('lesson_items').update({ title: f.get('t').trim(), url: nu, description: f.get('d').trim() || null }).eq('id', id); if (e2) throw e2; toast('تم التعديل ✅'); setTimeout(() => itRefresh(lid), 50); });
  }
});

// =====================================================================
// تقرير متابعة الطالب (PDF) — بيتحسب لحظة الطلب ومابيتخزّنش في قاعدة البيانات
// =====================================================================
S.rp = { sid: '', cid: '', q: '', note: null, inc: { vid: true, ex: true } };
const RP_CSS = `
.rpg,.rpg *{box-sizing:border-box;margin:0;padding:0;font-family:'Cairo',Tahoma,Arial,sans-serif}
.rpg{width:794px;height:1123px;position:relative;background:#fff;color:#0f172a;direction:rtl;display:flex;flex-direction:column;overflow:hidden;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.rpg .rtop{flex:none;height:12px;background:linear-gradient(90deg,#ef4444,#ec4899)}
.rpg .rpb{flex:1;min-height:0;padding:0 34px 6px;overflow:hidden}
.rpg .rpf{flex:none;height:46px;margin:0 34px;display:flex;align-items:center;justify-content:space-between;border-top:2px solid #f3c1cf;font-size:11px;color:#64748b;font-weight:700}
.rpg .rh{display:flex;gap:18px;align-items:center;padding:22px 0 12px}
.rpg .rhi{flex:1;min-width:0}
.rpg .rbrand{font-size:11px;font-weight:800;letter-spacing:2.2px;color:#ef4444;direction:ltr;text-align:right}
.rpg h1{font-size:29px;font-weight:900;margin:2px 0 10px;color:#0f172a;line-height:1.35}
.rpg .pills{display:flex;gap:8px;flex-wrap:wrap}
.rpg .pills span{background:#fef2f2;border:1px solid #fecaca;border-radius:50px;padding:4px 13px;font-size:12px;font-weight:800;color:#991b1b;line-height:1.6}
.rpg .ph{width:118px;height:118px;border-radius:28px;overflow:hidden;border:4px solid #ef4444;flex:none;background:#fef2f2;display:flex;align-items:center;justify-content:center;font-size:46px}
.rpg .ph img{width:100%;height:100%;object-fit:cover;display:block}
.rpg .slim{display:flex;justify-content:space-between;align-items:center;padding:14px 0 10px;font-weight:800;font-size:13px;color:#475569;border-bottom:1px dashed #cbd5e1;margin-bottom:12px}
.rpg .slim b{color:#0f172a}
.rpg .stc{border:1px solid #e2e8f0;border-radius:18px;padding:14px 18px;margin:8px 0 12px;background:linear-gradient(135deg,#fff,#fff7f7)}
.rpg .stn{font-size:19px;font-weight:900;margin-bottom:10px}
.rpg .stg{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.rpg .stg div{background:#fff;border:1px solid #f1f5f9;border-radius:12px;padding:8px 10px}
.rpg .stg small{display:block;color:#64748b;font-size:10.5px;font-weight:800}
.rpg .stg b{font-size:13px;font-weight:800;word-break:break-all}
.rpg .cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}
.rpg .sc{border-radius:18px;padding:14px 10px;text-align:center;color:#fff;background:linear-gradient(135deg,#ef4444,#ec4899)}
.rpg .sc:nth-child(2){background:linear-gradient(135deg,#0f172a,#334155)}
.rpg .sc:nth-child(3){background:linear-gradient(135deg,#ec4899,#a855f7)}
.rpg .sc b{display:block;font-size:30px;font-weight:900;line-height:1.3}
.rpg .sc span{font-size:12px;font-weight:800;opacity:.95}
.rpg .rtw{margin:0 0 14px}
.rpg h3{font-size:15px;font-weight:900;margin:4px 0 8px;color:#0f172a;display:flex;align-items:center;gap:6px}
.rpg h3 small{color:#94a3b8;font-weight:700;font-size:11px}
.rpg table{width:100%;border-collapse:collapse;font-size:12px}
.rpg th{background:linear-gradient(135deg,#ef4444,#ec4899);color:#fff;font-weight:800;padding:8px 9px;text-align:right;font-size:11.5px}
.rpg th:first-child{border-radius:0 10px 0 0}.rpg th:last-child{border-radius:10px 0 0 0}
.rpg td{padding:7px 9px;border-bottom:1px solid #e2e8f0;vertical-align:middle;line-height:1.7}
.rpg tbody tr:nth-child(even) td{background:#f8fafc}
.rpg td.c,.rpg th.c{text-align:center}
.rpg .sp{display:inline-block;padding:1px 11px;border-radius:50px;font-size:11px;font-weight:800;white-space:nowrap}
.rpg .sp.g{background:#dcfce7;color:#166534}.rpg .sp.r{background:#fee2e2;color:#991b1b}.rpg .sp.a{background:#fef3c7;color:#92400e}.rpg .sp.n{background:#e2e8f0;color:#475569}
.rpg .tg{display:inline-block;margin-right:6px;padding:0 8px;border-radius:6px;background:#ede9fe;color:#5b21b6;font-size:10px;font-weight:800}
.rpg .nb{border:2px solid #ef4444;border-radius:18px;overflow:hidden;margin:6px 0 12px}
.rpg .nb .t{background:linear-gradient(135deg,#ef4444,#ec4899);color:#fff;font-weight:900;font-size:14px;padding:8px 16px}
.rpg .nb .x{padding:12px 18px;white-space:pre-line;line-height:2;font-size:13px;background:#fff7f7}
.rpg .emp{padding:14px;text-align:center;color:#64748b;font-weight:700;border:1px dashed #cbd5e1;border-radius:12px}
`;
const fmtDur = s => { s = Math.round(+s || 0); if (s < 60) return s ? s + ' ث' : '—'; const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return (h ? h + ' س ' : '') + (m || !h ? m + ' د' : ''); };
const pctOf = b => b && b.total ? Math.round(b.score / b.total * 100) : 0;
function vidState(i) {
  const sec = +i.seconds || 0, op = +i.opens || 0;
  if (sec >= 60) return 'w';
  if (i.opens == null && i.done) return 'w';           // قبل ما نبدأ نتتبّع المشاهدة: لو اتعلّم منتهي نحسبه
  if (op > 0 || i.done) return 'o';
  return 'n';
}
function rpAnalyze(d) {
  const vids = [], exams = [];
  (d.lessons || []).forEach(l => {
    (l.items || []).filter(i => i.kind === 'video').forEach(i => vids.push(Object.assign({ lesson: l.title }, i, { st: vidState(i) })));
    (l.quizzes || []).forEach(q => exams.push(Object.assign({ lesson: l.title }, q)));
  });
  (d.course_quizzes || []).forEach(q => exams.push(Object.assign({ lesson: null }, q)));
  const solved = exams.filter(q => q.best), graded = solved.filter(q => q.best.status !== 'pending');
  const avg = graded.length ? Math.round(graded.reduce((t, q) => t + pctOf(q.best), 0) / graded.length) : null;
  return { vids, exams, solved: solved.length, avg, vw: vids.filter(v => v.st === 'w').length, secs: vids.reduce((t, v) => t + (+v.seconds || 0), 0), pend: solved.length - graded.length };
}
function autoNote(d, a, set) {
  const first = d.student.first_name || 'الطالب', t = (set && set.teacher_name) || 'Mr. Sherif Khafagy';
  let lvl = a.avg == null ? 'لم يبدأ بعد في حل الامتحانات' : a.avg >= 85 ? 'ممتاز' : a.avg >= 70 ? 'جيد جداً' : a.avg >= 50 ? 'مقبول ويحتاج لمزيد من الاهتمام' : 'ضعيف ويحتاج لمتابعة جادة';
  const bits = [];
  if (a.vids.length && a.vw / a.vids.length < 0.6) bits.push('ننصح بالمواظبة على مشاهدة فيديوهات الشرح أولاً بأول.');
  if (a.exams.length > a.solved) bits.push('يوجد ' + (a.exams.length - a.solved) + ' امتحان/واجب لم يتم حله بعد، برجاء المتابعة.');
  if (!bits.length) bits.push('نتمنى له دوام التفوق والنجاح.');
  return 'ولي الأمر الكريم،\nنفيدكم بأن مستوى الطالب/ة ' + first + ' في كورس «' + d.course.title + '» ' + lvl + (a.avg != null ? '، بمتوسط درجات ' + a.avg + '% في ' + a.solved + ' من ' + a.exams.length + ' امتحان/واجب' : '') + (a.vids.length ? '، وشاهد ' + a.vw + ' من ' + a.vids.length + ' فيديو' : '') + '.\n' + bits.join(' ') + '\nمع خالص التحية والتقدير،\n' + t;
}
function rpUnits(d, set, note, inc) {
  const st = d.student, a = rpAnalyze(d), name = [st.first_name, st.middle_name, st.last_name].filter(Boolean).join(' '), U = [];
  const tn = (set && set.teacher_name) || 'Mr. Sherif Khafagy', pn = (set && set.platform_name) || 'The Leader In English';
  const date = new Date(d.generated_at || Date.now()).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  U.push({ html: '<div class="rh"><div class="rhi"><div class="rbrand">' + esc(pn.toUpperCase()) + '</div><h1>تقرير متابعة الطالب</h1><div class="pills"><span>📚 الكورس: ' + esc(d.course.title) + '</span><span>👨‍🏫 المدرس: ' + esc(tn) + '</span><span>📅 التاريخ: ' + esc(date) + '</span></div></div><div class="ph">' + (set && set.teacher_photo ? '<img src="' + esc(set.teacher_photo) + '" alt="">' : '👤') + '</div></div>' });
  const info = [['الصف الدراسي', st.year || '—'], ['هاتف الطالب', st.phone || '—', 1], ['هاتف ولي الأمر', st.parent_phone || '—', 1], ['المحافظة', st.governorate || '—']];
  U.push({ html: '<div class="stc"><div class="stn">👤 ' + esc(name) + '</div><div class="stg">' + info.map(x => '<div><small>' + x[0] + '</small><b' + (x[2] ? ' dir="ltr" style="display:block;text-align:right"' : '') + '>' + esc(x[1]) + '</b></div>').join('') + '</div></div>' });
  U.push({ html: '<div class="cards"><div class="sc"><b>' + (a.avg == null ? '—' : a.avg + '%') + '</b><span>متوسط الدرجات</span></div><div class="sc"><b>' + a.solved + ' / ' + a.exams.length + '</b><span>امتحانات تم حلها</span></div><div class="sc"><b>' + a.vw + ' / ' + a.vids.length + '</b><span>فيديوهات تمت مشاهدتها</span></div></div>' });
  if (inc.vid) {
    const stl = { w: '<span class="sp g">✅ شاهده</span>', o: '<span class="sp a">◐ فتحه فقط</span>', n: '<span class="sp r">❌ لم يشاهد</span>' };
    U.push({ title: '🎬 متابعة الفيديوهات', head: ['المحاضرة', 'الفيديو', 'مرات الفتح', 'مدة المشاهدة', 'هل شاهده؟'], cls: ['', '', 'c', 'c', 'c'], empty: 'لا توجد فيديوهات في هذا الكورس',
      rows: a.vids.map(v => [esc(v.lesson), esc(v.title), v.opens == null ? '—' : v.opens, fmtDur(v.seconds), stl[v.st]]) });
  }
  if (inc.ex) {
    const row = q => {
      const b = q.best; let state = '<span class="sp n">لم يُحل</span>';
      if (b) state = b.status === 'pending' ? '<span class="sp a">تصحيح معلّق</span>' : (pctOf(b) >= (q.pass == null ? 50 : q.pass) ? '<span class="sp g">ناجح</span>' : '<span class="sp r">راسب</span>');
      return [esc(q.title) + (q.hw ? '<span class="tg">واجب</span>' : ''), b ? (+b.score + ' / ' + +b.total) : '—', b ? pctOf(b) + '%' : '—', q.tries || 0, state];
    };
    const head = ['الامتحان / الواجب', 'أفضل درجة', 'النسبة', 'المحاولات', 'الحالة'], cls = ['', 'c', 'c', 'c', 'c'];
    let any = false;
    (d.lessons || []).forEach(l => { if ((l.quizzes || []).length) { any = true; U.push({ title: '📝 ' + l.title, head, cls, rows: l.quizzes.map(row) }); } });
    if ((d.course_quizzes || []).length) { any = true; U.push({ title: '🏆 امتحانات الكورس والامتحانات الشاملة', head, cls, rows: d.course_quizzes.map(row) }); }
    if (!any) U.push({ html: '<div class="emp">لا توجد امتحانات منشورة لهذا الكورس بعد</div>' });
  }
  if (note && note.trim()) U.push({ html: '<div class="nb"><div class="t">💬 كلمة لولي الأمر</div><div class="x">' + esc(note.trim()) + '</div></div>' });
  return { units: U, a, name, course: d.course.title, pn };
}
function rpPaginate(U, meta) {
  const hold = $('#rpHold'); hold.innerHTML = ''; const pages = [];
  const slim = '<div class="slim"><span>📄 تقرير متابعة الطالب</span><b>' + esc(meta.name) + '</b></div>';
  const newPage = () => { const pg = document.createElement('div'); pg.className = 'rpg'; pg.innerHTML = '<div class="rtop"></div><div class="rpb">' + (pages.length ? slim : '') + '</div><div class="rpf"></div>'; hold.appendChild(pg); pages.push(pg); return pg.querySelector('.rpb'); };
  let body = newPage(); const over = () => body.scrollHeight > body.clientHeight + 1;
  U.forEach(u => {
    if (u.html) { const w = document.createElement('div'); w.innerHTML = u.html; const el = w.firstElementChild; body.appendChild(el); if (over() && body.children.length > (pages.length > 1 ? 2 : 1)) { body.removeChild(el); body = newPage(); body.appendChild(el); } return; }
    const mk = cont => { const w = document.createElement('div'); w.className = 'rtw'; w.innerHTML = '<h3>' + esc(u.title) + (cont ? ' <small>(تابع)</small>' : '') + '</h3><table><thead><tr>' + u.head.map((h, i) => '<th' + (u.cls[i] ? ' class="c"' : '') + '>' + h + '</th>').join('') + '</tr></thead><tbody></tbody></table>'; return w; };
    const rowEl = r => { const tr = document.createElement('tr'); tr.innerHTML = r.map((c, i) => '<td' + (u.cls[i] ? ' class="c"' : '') + '>' + c + '</td>').join(''); return tr; };
    let w = mk(false); body.appendChild(w); let tb = w.querySelector('tbody');
    if (over() && body.children.length > (pages.length > 1 ? 2 : 1)) { body.removeChild(w); body = newPage(); w = mk(false); body.appendChild(w); tb = w.querySelector('tbody'); }
    if (!u.rows.length) { tb.innerHTML = '<tr><td colspan="' + u.head.length + '" class="c" style="color:#64748b;font-weight:700">' + esc(u.empty || 'لا توجد بيانات') + '</td></tr>'; return; }
    u.rows.forEach(r => {
      const tr = rowEl(r); tb.appendChild(tr);
      if (over()) {
        tb.removeChild(tr);
        if (!tb.children.length) { body.removeChild(w); body = newPage(); w = mk(false); }       // العنوان لوحده في آخر الصفحة: ننقله كله
        else { body = newPage(); w = mk(true); }
        body.appendChild(w); tb = w.querySelector('tbody'); tb.appendChild(tr);
      }
    });
  });
  pages.forEach((p, i) => { p.querySelector('.rpf').innerHTML = '<span>' + esc(meta.name) + ' · ' + esc(meta.course) + '</span><span>' + esc(meta.pn) + ' · صفحة ' + (i + 1) + ' من ' + pages.length + '</span>'; });
  return pages;
}
async function rpBuild() {
  const R = V3.rp; if (!R) return; const ta = $('#rpNote'); if (ta) S.rp.note = ta.value;
  const note = S.rp.note == null ? autoNote(R.d, rpAnalyze(R.d), R.set) : S.rp.note; if (ta && S.rp.note == null) ta.value = note;
  try { await document.fonts.ready; } catch (e) {}
  const m = rpUnits(R.d, R.set, note, S.rp.inc); R.pages = rpPaginate(m.units, m); R.meta = m;
  const box = $('#rpPrev'); if (!box) return; box.innerHTML = '';
  const avail = Math.max(280, Math.min(794, (box.clientWidth || 794) - 4)), sc = avail / 794;
  R.pages.forEach(p => { const w = document.createElement('div'); w.style.cssText = 'position:relative;overflow:hidden;margin:0 auto 14px;border-radius:6px;box-shadow:0 6px 24px rgba(0,0,0,.35);width:' + Math.round(794 * sc) + 'px;height:' + Math.round(1123 * sc) + 'px;background:#fff'; const c = p.cloneNode(true); c.style.cssText = 'position:absolute;left:0;top:0;transform-origin:top left;transform:scale(' + sc + ')'; w.appendChild(c); box.appendChild(w); });
  const pc = $('#rpPc'); if (pc) pc.textContent = R.pages.length + ' صفحة';
}
const rpFile = () => { const R = V3.rp, n = (R.meta ? R.meta.name : 'student') + ' - ' + R.d.course.title; return 'تقرير متابعة - ' + n.replace(/[\\/:*?"<>|]+/g, ' ').trim() + '.pdf'; };
// كاتب PDF بسيط (صورة JPEG لكل صفحة A4) — من غير مكتبات خارجية
function buildPdf(imgs) {
  const enc = new TextEncoder(), parts = [], offs = []; let len = 0;
  const push = x => { const b = typeof x === 'string' ? enc.encode(x) : x; parts.push(b); len += b.length; };
  const obj = (n, body) => { offs[n] = len; push(n + ' 0 obj\n' + body + '\nendobj\n'); };
  const n = imgs.length; push('%PDF-1.4\n%\u00e2\u00e3\u00cf\u00d3\n');
  obj(1, '<< /Type /Catalog /Pages 2 0 R >>'); obj(2, '<< /Type /Pages /Kids [' + imgs.map((_, i) => (3 + i * 3) + ' 0 R').join(' ') + '] /Count ' + n + ' >>');
  imgs.forEach((im, i) => {
    const p = 3 + i * 3, ix = p + 1, cx = p + 2, c = 'q 595.28 0 0 841.89 0 0 cm /Im0 Do Q';
    obj(p, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 ' + ix + ' 0 R >> /ProcSet [/PDF /ImageC] >> /Contents ' + cx + ' 0 R >>');
    offs[ix] = len; push(ix + ' 0 obj\n<< /Type /XObject /Subtype /Image /Width ' + im.w + ' /Height ' + im.h + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + im.bytes.length + ' >>\nstream\n'); push(im.bytes); push('\nendstream\nendobj\n');
    obj(cx, '<< /Length ' + c.length + ' >>\nstream\n' + c + '\nendstream');
  });
  const xr = len, total = 3 * n + 3; push('xref\n0 ' + total + '\n0000000000 65535 f \n');
  for (let i = 1; i < total; i++) push(String(offs[i]).padStart(10, '0') + ' 00000 n \n');
  push('trailer\n<< /Size ' + total + ' /Root 1 0 R >>\nstartxref\n' + xr + '\n%%EOF');
  return new Blob(parts, { type: 'application/pdf' });
}
function loadScript(src) { return new Promise((res, rej) => { if (document.querySelector('script[src="' + src + '"]')) return res(); const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('تعذر تحميل مكتبة الـPDF — اتأكد من الإنترنت وجرّب تاني (أو استخدم زرار الطباعة ← حفظ كـ PDF)')); document.head.appendChild(s); }); }
function rpPhone(p) { let n = String(p || '').replace(/\D/g, ''); if (!n) return ''; if (n.startsWith('00')) n = n.slice(2); else if (n.startsWith('0')) n = '20' + n.slice(1); return n; }
async function vReportTab(arg) {
  await loadStudents(); if (!S.courses || !S.courses.length) { try { await loadCourses(); } catch (e) {} }
  if (arg && typeof arg === 'object' && arg.sid) { S.rp.sid = arg.sid; S.rp.cid = ''; V3.rp = null; }
  let st = S.rp.sid ? S.students.find(s => s.id === S.rp.sid) : null; if (st) S.y = st.academic_year; if (!S.y) S.y = YEARS[0];
  const enr = st ? new Set((S.enr || []).filter(e => e.student_id === st.id).map(e => e.course_id)) : new Set();
  const cs = S.courses.filter(c => c.academic_year === S.y || enr.has(c.id)).sort((a, b) => (enr.has(b.id) - enr.has(a.id)));
  if (!cs.find(c => c.id === S.rp.cid)) S.rp.cid = cs[0] ? cs[0].id : '';
  setTimeout(() => { const q = $('#rpq'); if (q) { q.addEventListener('input', e => { S.rp.q = e.target.value; rpList(); }); rpList(); } if (V3.rp && V3.rp.d && V3.rp.sid === S.rp.sid) rpBuild(); });
  return '<p class="nt">اختار الصف، بعدين اضغط على اسم الطالب، واختار الكورس. التقرير بيتكوّن في اللحظة دي بس وبيطلع PDF — <b>مابيتخزّنش في المنصة</b> عشان مانستهلكش مساحة.</p>' + yearTabs('report')
    + '<div class="card" style="margin-bottom:14px"><div class="bar" style="margin:0"><input id="rpq" placeholder="🔍 بحث بالاسم أو الهاتف" value="' + esc(S.rp.q) + '"><span id="rpn" style="color:var(--muted);font-weight:700"></span></div><div id="rpl" style="max-height:220px;overflow:auto;margin-top:8px"></div></div>'
    + (st ? '<div class="card" style="margin-bottom:14px"><div class="bar" style="margin:0;align-items:center"><span class="pill ok" style="font-size:13px;padding:6px 14px">👤 ' + esc(fname(st)) + '</span><div style="flex:1;min-width:200px"><label style="margin:0 0 4px">الكورس</label><select id="rpc">' + cs.map(c => '<option value="' + c.id + '"' + (c.id === S.rp.cid ? ' selected' : '') + '>' + esc(c.title) + (enr.has(c.id) ? ' ✓ مشترك' : '') + '</option>').join('') + '</select></div><label class="chk" style="margin:0"><input type="checkbox" id="rpiv"' + (S.rp.inc.vid ? ' checked' : '') + '> الفيديوهات</label><label class="chk" style="margin:0"><input type="checkbox" id="rpie"' + (S.rp.inc.ex ? ' checked' : '') + '> الامتحانات</label><button class="btn" data-act="rpGen">🧾 إنشاء التقرير</button></div></div>' : '<div class="empty" style="padding:22px">اضغط على اسم طالب من القايمة فوق</div>')
    + '<div id="rpOut"></div><div id="rpHold" style="position:fixed;left:-12000px;top:0;width:794px;pointer-events:none"></div><style>' + RP_CSS + '</style>';
}
function rpList() {
  const box = $('#rpl'); if (!box) return; const q = S.rp.q.trim().toLowerCase();
  const l = S.students.filter(s => s.academic_year === S.y && (!q || (fname(s) + ' ' + (s.phone_number || '') + ' ' + (s.email || '')).toLowerCase().includes(q))).sort((a, b) => fname(a).localeCompare(fname(b), 'ar'));
  $('#rpn').textContent = l.length + ' طالب';
  box.innerHTML = l.slice(0, 80).map(s => '<div class="bar" data-act="rpPick" data-id="' + s.id + '" style="margin:0;padding:8px 10px;border-bottom:1px solid var(--line);cursor:pointer;' + (s.id === S.rp.sid ? 'background:rgba(239,68,68,.15);' : '') + '"><b>' + esc(fname(s)) + '</b><small dir="ltr" style="color:var(--muted);margin-right:auto">' + esc(s.phone_number || '') + '</small></div>').join('') || '<div class="empty" style="padding:16px">لا يوجد طلاب</div>';
}
Object.assign(ACT, {
  stReport: id => { closeModal(); S.rp.sid = id; S.rp.cid = ''; S.rp.note = null; V3.rp = null; go('report', { sid: id }); },
  rpPick: id => { S.rp.sid = id; S.rp.cid = ''; S.rp.note = null; V3.rp = null; go('report', { sid: id }); },
  rpGen: async (id, el) => {
    const sid = S.rp.sid, cid = ($('#rpc') || {}).value || S.rp.cid; if (!sid || !cid) throw new Error('اختار الطالب والكورس');
    S.rp.cid = cid; S.rp.inc = { vid: $('#rpiv').checked, ex: $('#rpie').checked }; S.rp.note = null;
    el.disabled = true; $('#rpOut').innerHTML = '<div class="empty">⏳ جاري تجهيز التقرير...</div>';
    try {
      const [r, set] = await Promise.all([sb.rpc('student_report', { p_student: sid, p_course: cid }), loadSettings(true).catch(() => ({}))]);
      if (r.error) throw new Error((r.error.message || '').includes('does not exist') ? 'شغّل ملف supabase_update_v9.sql في Supabase الأول' : (r.error.message || '').includes('forbidden') ? 'مفيش عندك صلاحية لتقرير الطالب' : r.error.message);
      V3.rp = { d: r.data, set, sid };
    } finally { el.disabled = false; }
    const a = rpAnalyze(V3.rp.d), wa = rpPhone(V3.rp.d.student.parent_phone);
    $('#rpOut').innerHTML = '<div class="card" style="margin-bottom:14px"><b>✏️ كلمة لولي الأمر / ملاحظات المدرس</b><p class="nt" style="margin:4px 0 8px">اتكتبت تلقائي من نتايج الطالب — عدّل فيها زي ما تحب وأضف أي ملاحظات، وبعدين اضغط «تحديث».</p><textarea id="rpNote" dir="auto" style="min-height:150px"></textarea>'
      + '<div class="bar" style="margin:12px 0 0"><button class="btn s g" data-act="rpRefresh">🔄 تحديث التقرير</button><button class="btn" data-act="rpPdf">⬇️ تنزيل PDF</button><button class="btn s g" data-act="rpPrint">🖨 طباعة</button>' + (wa ? '<a class="btn s g" id="rpwa" target="_blank" rel="noopener" style="text-decoration:none;color:var(--ink)">💬 واتساب ولي الأمر</a>' : '') + '<span id="rpPc" class="pill"></span><span id="rpSt" class="nt" style="margin:0"></span></div></div><div id="rpPrev"></div>';
    if (wa) $('#rpwa').href = 'https://wa.me/' + wa + '?text=' + encodeURIComponent('السلام عليكم ورحمة الله،\nتقرير متابعة الطالب/ة ' + (V3.rp.d.student.first_name || '') + ' في كورس «' + V3.rp.d.course.title + '» (ملف PDF مرفق).');
    $('#rpNote').value = autoNote(V3.rp.d, a, V3.rp.set);
    await rpBuild();
  },
  rpRefresh: () => rpBuild(),
  rpPdf: async (id, el) => {
    const R = V3.rp; if (!R) return; await rpBuild(); el.disabled = true; const stt = $('#rpSt'), old = el.textContent;
    try {
      if (stt) stt.textContent = '⏳ تحميل مكتبة الـPDF...';
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
      const imgs = [];
      for (let i = 0; i < R.pages.length; i++) {
        if (stt) stt.textContent = '⏳ تجهيز صفحة ' + (i + 1) + ' من ' + R.pages.length + '...';
        const cv = await html2canvas(R.pages[i], { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false, width: 794, height: 1123, windowWidth: 1200, onclone: doc => { const h = doc.getElementById('rpHold'); if (h) h.style.cssText = 'position:absolute;left:0;top:0;width:794px'; } });
        const b64 = cv.toDataURL('image/jpeg', 0.92).split(',')[1], bin = atob(b64), bytes = new Uint8Array(bin.length); for (let k = 0; k < bin.length; k++) bytes[k] = bin.charCodeAt(k);
        imgs.push({ bytes, w: cv.width, h: cv.height });
      }
      const blob = buildPdf(imgs), a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = rpFile(); document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 20000);
      if (stt) stt.textContent = '✅ تم التنزيل'; toast('تم تنزيل التقرير PDF ✅');
      try { sb.rpc('audit_log', { p_action: 'report_pdf', p_target: R.meta.name, p_details: { course: R.d.course.title } }); } catch (e) {}
    } finally { el.disabled = false; el.textContent = old; }
  },
  rpPrint: async () => {
    const R = V3.rp; if (!R) return; await rpBuild();
    const html = '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>' + esc(rpFile().replace(/\.pdf$/, '')) + '</title><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet"><style>@page{size:A4;margin:0}html,body{margin:0;background:#fff}' + RP_CSS + '.rpg{page-break-after:always;break-after:page}.rpg:last-child{page-break-after:auto;break-after:auto}</style></head><body>' + R.pages.map(p => p.outerHTML).join('') + '</body></html>';
    const f = document.createElement('iframe'); f.style.cssText = 'position:fixed;left:-9999px;width:900px;height:700px'; document.body.appendChild(f);
    f.contentDocument.open(); f.contentDocument.write(html); f.contentDocument.close();
    const go = () => { try { f.contentWindow.focus(); f.contentWindow.print(); } catch (x) { toast('تعذر فتح الطباعة', true); } setTimeout(() => f.remove(), 90000); };
    setTimeout(() => { try { f.contentDocument.fonts.ready.then(() => setTimeout(go, 400)); } catch (e) { go(); } }, 600);
    toast('اختار «حفظ كـ PDF» من نافذة الطباعة');
  }
});
VIEWS.report = ['تقرير متابعة الطالب', vReportTab];

// =====================================================================
// اللافتات: نظام إشعارات إضافي (شكل + ألوان + مؤقت/عداد + إغلاق + لكل صف) — بيظهر للطلاب في الرئيسية/الكورس/الامتحان
// =====================================================================
S.bny = 'all';
const BN_LAYOUT = { bar: '📏 شريط أعلى الصفحة', card: '🗂 بطاقة داخل الصفحة', popup: '🪟 نافذة منبثقة في النص', corner: '🔔 إشعار في ركن الشاشة' };
const BN_DISMISS = { session: 'يرجع يظهر في الزيارة الجاية (الجلسة)', daily: 'مرة كل يوم', forever: 'مرة واحدة وخلاص (يفضل مقفول)' };
const BN_PAL = [['منصة', '#ef4444', '#ec4899', '#ffffff', '#ffffff'], ['كحلي', '#0f172a', '#334155', '#ffffff', '#fbbf24'], ['أخضر', '#16a34a', '#22c55e', '#ffffff', '#ffffff'], ['ذهبي', '#f59e0b', '#fbbf24', '#111827', '#111827'], ['بنفسجي', '#7c3aed', '#a855f7', '#ffffff', '#ffffff'], ['أبيض', '#ffffff', '', '#0f172a', '#ef4444']];
const BN_NEW = { name: '', body: '', icon: '📢', layout: 'bar', position: 'br', size: 'm', bg: '#ef4444', bg2: '#ec4899', fg: '#ffffff', accent: '#ffffff', radius: 14, shadow: true, animation: 'slide', btn_text: '', btn_url: '', countdown_to: null, countdown_label: '', countdown_done: '', after_zero: 'hide', starts_at: null, ends_at: null, auto_close: null, dismissible: true, dismiss_mode: 'session', academic_year: null, course_id: null, pages: ['home', 'course'], priority: 0, is_active: true };
function bnStatus(b) {
  const n = Date.now(); if (!b.is_active) return ['no', 'موقوفة']; if (b.starts_at && new Date(b.starts_at) > n) return ['', 'مجدولة']; if (b.ends_at && new Date(b.ends_at) <= n) return ['no', 'انتهت']; return ['ok', 'شغّالة'];
}
async function vBanners() {
  const { data, error } = await sb.from('site_banners').select('*').order('priority', { ascending: false }).order('created_at', { ascending: false });
  if (error) throw new Error((error.message || '').includes('does not exist') || (error.message || '').includes('schema cache') ? 'شغّل ملف supabase_update_v9.sql في Supabase الأول' : error.message);
  S.bns = data || []; if (!S.courses || !S.courses.length) { try { await loadCourses(); } catch (e) {} }
  const cnt = { all: S.bns.length, gen: S.bns.filter(b => !b.academic_year).length }; YEARS.forEach(y => cnt[y] = S.bns.filter(b => b.academic_year === y).length);
  const list = S.bns.filter(b => S.bny === 'all' || (S.bny === 'gen' ? !b.academic_year : b.academic_year === S.bny));
  const tab = (k, l) => '<button class="yt' + (S.bny === k ? ' on' : '') + '" data-act="bnY" data-id="' + k + '">' + l + ' <small>(' + (cnt[k] || 0) + ')</small></button>';
  const mini = b => '<div style="display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:' + Math.min(+b.radius || 0, 14) + 'px;font-size:12px;font-weight:800;max-width:260px;background:' + (b.bg2 ? 'linear-gradient(135deg,' + esc(b.bg) + ',' + esc(b.bg2) + ')' : esc(b.bg)) + ';color:' + esc(b.fg) + '">' + esc(b.icon || '') + ' <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc((b.body || b.name || '').slice(0, 40)) + '</span></div>';
  const rows = list.map(b => { const s = bnStatus(b), crs = b.course_id ? ((S.courses.find(c => c.id === b.course_id) || {}).title || 'كورس') : '';
    return '<tr><td>' + mini(b) + '<br><small style="color:var(--muted)">' + esc(b.name || '') + '</small></td><td>' + (BN_LAYOUT[b.layout] || b.layout) + '<br><small style="color:var(--muted)">' + (b.countdown_to ? '⏳ عداد • ' : '') + (b.auto_close ? 'يختفي بعد ' + b.auto_close + 'ث • ' : '') + (b.dismissible ? 'قابلة للإغلاق' : 'بدون إغلاق') + '</small></td><td><span class="pill ' + (b.academic_year ? '' : 'ok') + '">' + esc(b.academic_year || 'كل الصفوف') + '</span>' + (crs ? '<br><small style="color:var(--muted)">' + esc(crs) + '</small>' : '') + '</td><td><small>' + (b.pages || []).map(p => ({ home: 'الرئيسية', course: 'الكورس', quiz: 'الامتحان' }[p] || p)).join('، ') + '</small></td><td><span class="pill ' + s[0] + '">' + s[1] + '</span>' + (b.starts_at || b.ends_at ? '<br><small style="color:var(--muted)">' + (b.starts_at ? 'من ' + fdt(b.starts_at) : '') + (b.ends_at ? ' إلى ' + fdt(b.ends_at) : '') + '</small>' : '') + '</td><td style="white-space:nowrap"><button class="btn s" data-act="bnEdit" data-id="' + b.id + '">✏️ تعديل</button> <button class="btn s g" data-act="bnDup" data-id="' + b.id + '">نسخ</button> <button class="btn s g" data-act="bnTog" data-id="' + b.id + '">' + (b.is_active ? 'إيقاف' : 'تشغيل') + '</button> <button class="btn s g" data-act="bnReshow" data-id="' + b.id + '" title="تظهر تاني لكل اللي قفلوها">🔁</button> <button class="btn s r" data-act="bnDel" data-id="' + b.id + '">حذف</button></td></tr>'; }).join('');
  return '<p class="nt">لافتات بتظهر للطلاب فوق الإعلانات والإشعارات العادية: انت بتتحكم في الشكل والألوان والعداد التنازلي ومدة الظهور وإمكانية الإغلاق — ولكل صف دراسي لوحده. «🔁» بتخلّيها تظهر تاني لكل اللي قفلوها.</p><div class="ytabs">' + tab('all', 'الكل') + tab('gen', '🌐 كل الصفوف') + YEARS.map(y => tab(y, y)).join('') + '</div>'
    + '<div class="bar"><button class="btn" data-act="bnNew">+ لافتة جديدة</button></div><div class="tw"><table><tr><th>اللافتة</th><th>الشكل</th><th>الصف</th><th>الصفحات</th><th>الحالة</th><th></th></tr>' + (rows || '<tr><td colspan="6" class="empty">لا توجد لافتات هنا</td></tr>') + '</table></div>';
}
VIEWS.banners = ['اللافتات', vBanners];
const bnLoc = d => d ? loc(d) : '';
function bnForm(b, isNew) {
  b = Object.assign({}, BN_NEW, b || {}); const ro = !can('banners.edit');
  const yo = '<option value="">🌐 كل الصفوف</option>' + yopts(b.academic_year || ''), opt = (o, v) => Object.keys(o).map(k => '<option value="' + k + '"' + (k === v ? ' selected' : '') + '>' + o[k] + '</option>').join('');
  const crs = yr => '<option value="">كل الكورسات</option>' + S.courses.filter(c => !yr || c.academic_year === yr).map(c => '<option value="' + c.id + '"' + (c.id === b.course_id ? ' selected' : '') + '>' + esc(c.title) + '</option>').join('');
  const ck = (n, l, v) => '<label class="chk" style="margin:6px 14px 0 0"><input type="checkbox" name="' + n + '"' + (v ? ' checked' : '') + '> ' + l + '</label>';
  modal(isNew ? 'لافتة جديدة' : 'تعديل لافتة', '<div id="bnPvBox" style="background:linear-gradient(135deg,#1e293b,#0f172a);border:1px solid var(--line);border-radius:16px;padding:18px 12px;min-height:110px;margin-bottom:12px;display:grid;place-items:center"><div id="bnPv" style="width:100%"></div></div><p class="nt" style="margin:-4px 0 8px;text-align:center">المعاينة حيّة — بتتغيّر وانت بتعدّل</p>'
    + '<form id="bnF"><fieldset ' + (ro ? 'disabled' : '') + ' style="border:0">'
    + '<div class="row2"><div><label>الاسم (للإدارة بس)</label><input name="name" value="' + esc(b.name) + '" placeholder="مثال: خصم نهاية الشهر"></div><div><label>أيقونة (إيموجي)</label><input name="icon" maxlength="4" value="' + esc(b.icon) + '"></div></div>'
    + '<label>نص الرسالة</label><textarea name="body" dir="auto" style="min-height:70px">' + esc(b.body) + '</textarea>'
    + '<div class="row2"><div><label>شكل العرض</label><select name="layout">' + opt(BN_LAYOUT, b.layout) + '</select></div><div><label>الحجم</label><select name="size">' + opt({ s: 'صغير', m: 'متوسط', l: 'كبير' }, b.size) + '</select></div></div>'
    + '<div id="bnPosW" ' + (b.layout === 'corner' ? '' : 'hidden') + '><label>مكان الإشعار في الشاشة</label><select name="position">' + opt({ br: 'أسفل يمين', bl: 'أسفل شمال', tr: 'أعلى يمين', tl: 'أعلى شمال' }, b.position) + '</select></div>'
    + '<label>الألوان</label><div class="bar" style="margin:0 0 6px">' + BN_PAL.map((p, i) => '<button type="button" class="yt" data-act="bnPal" data-id="' + i + '" style="background:' + (p[2] ? 'linear-gradient(135deg,' + p[1] + ',' + p[2] + ')' : p[1]) + ';color:' + p[3] + ';border:1px solid var(--line)">' + p[0] + '</button>').join('') + '</div>'
    + '<div class="row2"><div><label>لون الخلفية</label><input type="color" name="bg" value="' + esc(b.bg) + '" style="height:42px;padding:3px"></div><div><label>لون الخلفية الثاني (تدرج)</label><div class="bar" style="margin:0;flex-wrap:nowrap"><input type="color" name="bg2" value="' + esc(b.bg2 || '#ec4899') + '" style="height:42px;padding:3px"><label class="chk" style="margin:0;white-space:nowrap"><input type="checkbox" name="grad"' + (b.bg2 ? ' checked' : '') + '> تدرج</label></div></div></div>'
    + '<div class="row2"><div><label>لون النص</label><input type="color" name="fg" value="' + esc(b.fg) + '" style="height:42px;padding:3px"></div><div><label>لون التمييز (الزرار والعداد)</label><input type="color" name="accent" value="' + esc(b.accent) + '" style="height:42px;padding:3px"></div></div>'
    + '<div class="row2"><div><label>استدارة الحواف: <b id="bnRv">' + (+b.radius) + '</b></label><input type="range" name="radius" min="0" max="40" value="' + (+b.radius) + '"></div><div><label>حركة الظهور</label><select name="animation">' + opt({ slide: 'انزلاق', fade: 'تلاشي', pulse: 'نبض', none: 'بدون' }, b.animation) + '</select></div></div>' + ck('shadow', 'ظل', b.shadow)
    + '<h4 style="margin:16px 0 4px">🔘 زرار (اختياري)</h4><div class="row2"><div><label>نص الزرار</label><input name="btn_text" value="' + esc(b.btn_text) + '" placeholder="اشترك الآن"></div><div><label>الرابط (/course.html أو https://…)</label><input name="btn_url" dir="ltr" value="' + esc(b.btn_url) + '" placeholder="/home"></div></div>'
    + '<h4 style="margin:16px 0 4px">⏳ عداد تنازلي (اختياري)</h4><div class="row2"><div><label>ينتهي في</label><input type="datetime-local" name="countdown_to" value="' + bnLoc(b.countdown_to) + '"></div><div><label>كلمة قبل العداد</label><input name="countdown_label" value="' + esc(b.countdown_label) + '" placeholder="العرض ينتهي بعد"></div></div><div class="row2"><div><label>لما العداد يوصل صفر</label><select name="after_zero">' + opt({ hide: 'اللافتة تختفي', text: 'تفضل ويتغيّر النص' }, b.after_zero) + '</select></div><div><label>النص بعد الصفر</label><input name="countdown_done" value="' + esc(b.countdown_done) + '" placeholder="انتهى العرض"></div></div>'
    + '<h4 style="margin:16px 0 4px">🕒 الجدولة والإغلاق</h4><div class="row2"><div><label>تبدأ في (اختياري)</label><input type="datetime-local" name="starts_at" value="' + bnLoc(b.starts_at) + '"></div><div><label>تنتهي في (اختياري)</label><input type="datetime-local" name="ends_at" value="' + bnLoc(b.ends_at) + '"></div></div>'
    + '<div class="row2"><div><label>تختفي لوحدها بعد (ثانية — فاضي = تفضل)</label><input type="number" name="auto_close" min="1" max="3600" value="' + esc(b.auto_close || '') + '"></div><div><label>لو الطالب قفلها</label><select name="dismiss_mode">' + opt(BN_DISMISS, b.dismiss_mode) + '</select></div></div>' + ck('dismissible', 'الطالب يقدر يقفلها (زرار ✕)', b.dismissible)
    + '<h4 style="margin:16px 0 4px">🎯 لمين وفين</h4><div class="row2"><div><label>الصف الدراسي</label><select name="academic_year">' + yo + '</select></div><div><label>كورس معيّن (اختياري)</label><select name="course_id">' + crs(b.academic_year) + '</select></div></div>'
    + '<label>تظهر في</label><div>' + [['home', 'الصفحة الرئيسية'], ['course', 'صفحة الكورس'], ['quiz', 'صفحة الامتحان (شريط بس)']].map(p => ck('pg_' + p[0], p[1], (b.pages || []).includes(p[0]))).join('') + '</div>'
    + '<div class="row2"><div><label>الأولوية (الأعلى يظهر الأول)</label><input type="number" name="priority" value="' + (+b.priority || 0) + '"></div><div></div></div>' + ck('is_active', 'شغّالة', b.is_active)
    + '</fieldset>' + (ro ? '<p class="nt">🔒 صلاحيتك للعرض بس.</p>' : '<button class="btn" style="width:100%;margin-top:16px">💾 حفظ اللافتة</button>') + '</form>',
    async () => { await bnSave(b, isNew); });
  $('#modal .mbox').classList.add('wide');
  const f = $('#bnF'), upd = () => { const v = bnRead(f); $('#bnRv').textContent = v.radius; $('#bnPosW').hidden = v.layout !== 'corner'; clearBnPv(); if (window.UI) { const el = UI.bannerEl(Object.assign({ id: 'pv', version: 1, dismiss_mode: 'session' }, v), { preview: true, skew: 0 }); el.style.maxWidth = '100%'; $('#bnPv').appendChild(el); } else $('#bnPv').textContent = 'المعاينة محتاجة ui.js'; };
  f.addEventListener('input', upd); f.addEventListener('change', e => { if (e.target.name === 'academic_year') { const cur = f.course_id.value; f.course_id.innerHTML = crs(e.target.value).replace(' selected', ''); f.course_id.value = S.courses.find(c => c.id === cur && (!e.target.value || c.academic_year === e.target.value)) ? cur : ''; } upd(); });
  upd();
}
function clearBnPv() { const p = $('#bnPv'); if (!p) return; Array.from(p.children).forEach(c => (c._t || []).forEach(clearInterval)); p.innerHTML = ''; }
function bnRead(f) {
  const g = n => f.elements[n], v = n => g(n) ? g(n).value : '', c = n => !!(g(n) && g(n).checked), iso = n => v(n) ? new Date(v(n)).toISOString() : null;
  return { name: v('name').trim(), icon: v('icon').trim() || null, body: v('body').trim() || null, layout: v('layout'), size: v('size'), position: v('position') || 'br', bg: v('bg'), bg2: c('grad') ? v('bg2') : null, fg: v('fg'), accent: v('accent'), radius: +v('radius') || 0, shadow: c('shadow'), animation: v('animation'),
    btn_text: v('btn_text').trim() || null, btn_url: v('btn_url').trim() || null, countdown_to: iso('countdown_to'), countdown_label: v('countdown_label').trim() || null, countdown_done: v('countdown_done').trim() || null, after_zero: v('after_zero'),
    starts_at: iso('starts_at'), ends_at: iso('ends_at'), auto_close: v('auto_close') ? Math.round(+v('auto_close')) : null, dismissible: c('dismissible'), dismiss_mode: v('dismiss_mode'), academic_year: v('academic_year') || null, course_id: v('course_id') || null,
    pages: ['home', 'course', 'quiz'].filter(p => c('pg_' + p)), priority: Math.round(+v('priority') || 0), is_active: c('is_active') };
}
async function bnSave(old, isNew) {
  const row = bnRead($('#bnF'));
  if (!row.body && !row.name && !row.countdown_to) throw new Error('اكتب نص الرسالة');
  if (!row.pages.length) throw new Error('اختار صفحة واحدة على الأقل تظهر فيها');
  if (row.countdown_to && isNaN(new Date(row.countdown_to))) throw new Error('وقت العداد غير صالح');
  if (row.starts_at && row.ends_at && row.ends_at <= row.starts_at) throw new Error('وقت الانتهاء لازم يكون بعد وقت البداية');
  if (row.btn_text && !row.btn_url) throw new Error('اكتب رابط الزرار'); if (row.btn_url && !/^(\/|https:\/\/)/.test(row.btn_url)) throw new Error('رابط الزرار لازم يبدأ بـ / أو https://');
  if (row.layout === 'popup' && !row.dismissible && !row.auto_close && !row.countdown_to) throw new Error('النافذة المنبثقة لازم يكون ليها مخرج: خلّيها قابلة للإغلاق، أو حدّد وقت اختفاء، أو حط عداد');
  if (row.auto_close && (row.auto_close < 1 || row.auto_close > 3600)) throw new Error('مدة الاختفاء من 1 لـ 3600 ثانية');
  row.name = row.name || (row.body || row.countdown_label || 'لافتة').slice(0, 40);
  let r; if (isNew) r = await sb.from('site_banners').insert(row); else r = await sb.from('site_banners').update(row).eq('id', old.id);
  if (r.error) throw r.error; toast('تم حفظ اللافتة ✅ — بتظهر للطلاب خلال دقيقة'); go('banners');
}
Object.assign(ACT, {
  bnY: id => { S.bny = id; go('banners'); },
  bnNew: () => bnForm(Object.assign({}, BN_NEW, YEARS.includes(S.bny) ? { academic_year: S.bny } : {}), true),
  bnEdit: id => { const b = (S.bns || []).find(x => x.id === id); if (b) bnForm(b, false); },
  bnPal: id => { const f = $('#bnF'), p = BN_PAL[+id]; if (!f || !p) return; f.bg.value = p[1]; if (p[2]) { f.bg2.value = p[2]; f.grad.checked = true; } else f.grad.checked = false; f.fg.value = p[3]; f.accent.value = p[4]; f.dispatchEvent(new Event('input', { bubbles: true })); },
  bnDup: async id => { const b = (S.bns || []).find(x => x.id === id); if (!b) return; const c = Object.assign({}, b); ['id', 'created_at', 'updated_at', 'created_by', 'version'].forEach(k => delete c[k]); c.name = (b.name || 'لافتة') + ' (نسخة)'; c.is_active = false; const { error } = await sb.from('site_banners').insert(c); if (error) throw error; toast('تم النسخ (موقوفة لحد ما تشغّلها) ✅'); go('banners'); },
  bnTog: async id => { const b = (S.bns || []).find(x => x.id === id); if (!b) return; const { error } = await sb.from('site_banners').update({ is_active: !b.is_active }).eq('id', id); if (error) throw error; go('banners'); },
  bnReshow: async id => { if (!confirm('اللافتة دي هتظهر تاني لكل الطلاب حتى اللي قفلوها. تكمل؟')) return; const { error } = await sb.rpc('bump_banner', { p_id: id }); if (error) throw error; toast('تمت إعادة الإظهار ✅'); },
  bnDel: async id => { if (!confirm('حذف اللافتة نهائياً؟')) return; const { error } = await sb.from('site_banners').delete().eq('id', id); if (error) throw error; toast('تم الحذف'); go('banners'); }
});

// ---------- ترتيب القايمة الجانبية ----------
(function () {
  const ADD = [['report', '🧾', 'تقرير الطالب PDF'], ['banners', '🎨', 'اللافتات'], ['audit', '🕵️', 'سجل العمليات'], ['settings', '⚙️', 'إعدادات المنصة']];
  // لو admin-v2.js اتحمّل ناقص أو قديم، نضمن إن التبويبات اللي بتعتمد عليه تفضل ظاهرة، ونعرّفك لو الملف نفسه ناقص
  [['support', '💬', 'الدعم الفني', 'vSupport'], ['staff', '👷', 'فريق العمل', 'vStaff'], ['access', '🔁', 'المحاولات والقفل', 'vAccess']].forEach(a => {
    let fn = null; try { fn = (0, eval)('typeof ' + a[3] + " === 'function' ? " + a[3] + ' : null'); } catch (e) {}
    if (fn) { if (!VIEWS[a[0]]) VIEWS[a[0]] = [a[2], fn]; ADD.push(a.slice(0, 3)); }
    else setTimeout(() => { try { toast('⚠️ ملف admin-v2.js ناقص أو قديم — تبويب «' + a[2] + '» مش محمّل. ارفع الملف كامل وحدّث الصفحة.', true); } catch (e) {} }, 4000);
  });
  ADD.forEach(a => { if (!NAV.some(n => n[0] === a[0])) NAV.push(a); });
  const ORDER = ['overview', 'courses', 'students', 'access', 'codes', 'exams', 'essay', 'sres', 'report', 'ann', 'banners', 'support', 'devices', 'audit', 'settings', 'admins', 'staff'];
  NAV.sort((a, b) => { const x = ORDER.indexOf(a[0]), y = ORDER.indexOf(b[0]); return (x < 0 ? 99 : x) - (y < 0 ? 99 : y); });
})();

// ---------- النقط الحمراء + تنبيهات الشغل المعلّق ----------
(function () {
  const st = document.createElement('style');
  st.textContent = '.nbd{margin-right:auto;min-width:20px;height:20px;padding:0 6px;border-radius:50px;background:#dc2626;color:#fff;font-size:11px;line-height:20px;text-align:center;font-weight:800;box-shadow:0 0 0 2px var(--card);animation:nbp 1.6s infinite}.nbd.dot{min-width:10px;width:10px;height:10px;padding:0;margin-top:5px}.side a.on .nbd{box-shadow:0 0 0 2px #fff}'
    + '@keyframes nbp{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}'
    + '.rdot{position:absolute;top:10px;left:10px;width:11px;height:11px;border-radius:50%;background:#dc2626;box-shadow:0 0 0 3px rgba(220,38,38,.25)}.sprow{position:relative}'
    + '.spinfo{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin:0 0 10px;padding:10px;border-radius:12px;background:var(--bg);border:1px solid var(--line)}.spinfo>div{display:flex;flex-direction:column;gap:2px}.spinfo small{color:var(--muted);font-weight:600;font-size:12px}.spinfo b{font-size:14px}'
    + '#alBtn{border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:50px;padding:4px 10px;cursor:pointer;font:700 12px Cairo,sans-serif;margin-right:8px}';
  document.head.appendChild(st);
  const VIEW_OF = { support: 'support', essay: 'essay', release: 'sres' };
  const LABEL = { support: '💬 الدعم الفني', essay: '✍️ تصحيح المقالي', release: '🎓 نتائج محتاجة اعتماد' };
  let prev = null, baseTitle = document.title, snd = null;
  function beep() { try { snd = snd || new (window.AudioContext || window.webkitAudioContext)(); const o = snd.createOscillator(), g = snd.createGain(); o.connect(g); g.connect(snd.destination); o.type = 'sine'; o.frequency.value = 880; g.gain.setValueAtTime(.0001, snd.currentTime); g.gain.exponentialRampToValueAtTime(.25, snd.currentTime + .02); g.gain.exponentialRampToValueAtTime(.0001, snd.currentTime + .5); o.start(); o.stop(snd.currentTime + .55); } catch (e) {} }
  function paint(c) {
    document.querySelectorAll('#nav a[data-go] .nbd').forEach(b => b.remove());
    Object.keys(VIEW_OF).forEach(k => {
      const n = +c[k] || 0; if (!n) return;
      const a = document.querySelector('#nav a[data-go="' + VIEW_OF[k] + '"]'); if (!a) return;
      const b = document.createElement('b'); b.className = 'nbd' + (k === 'release' ? ' dot' : ''); b.title = LABEL[k] + ': ' + n; if (k !== 'release') b.textContent = n > 99 ? '99+' : n; a.appendChild(b);
    });
    const tot = (+c.support || 0) + (+c.essay || 0); document.title = (tot ? '(' + tot + ') ' : '') + baseTitle;
  }
  function alertNew(c) {
    if (!prev) return;
    const out = [];
    if ((+c.support_msgs || 0) > (+prev.support_msgs || 0)) out.push(['💬 رسالة جديدة من طالب في الدعم الفني', 'support']);
    if ((+c.essay || 0) > (+prev.essay || 0)) out.push(['✍️ فيه إجابات مقالية جديدة مستنية تصحيحك', 'essay']);
    out.forEach(o => {
      toast(o[0]); beep();
      try { if (window.Notification && Notification.permission === 'granted' && document.hidden) { const n = new Notification('لوحة التحكم', { body: o[0], tag: o[1] }); n.onclick = () => { window.focus(); go(o[1]); n.close(); }; } } catch (e) {}
    });
  }
  async function poll() {
    if (document.hidden && prev) return;
    const app = document.querySelector('#app'); if (!app || app.hidden || !document.querySelector('#nav a[data-go]')) return;
    try { const { data, error } = await sb.rpc('admin_pending_counts'); if (error || !data) return; paint(data); alertNew(data); prev = data; } catch (e) {}
    const bar = document.querySelector('#who'); if (bar && !document.querySelector('#alBtn') && window.Notification && Notification.permission === 'default') {
      const b = document.createElement('button'); b.id = 'alBtn'; b.type = 'button'; b.textContent = '🔔 فعّل تنبيهات المتصفح'; b.onclick = async () => { try { await Notification.requestPermission(); } catch (e) {} b.remove(); beep(); };
      bar.parentNode.insertBefore(b, bar.nextSibling);
    }
  }
  window.__pollAlerts = poll; setInterval(poll, 20000); setTimeout(poll, 1500);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) poll(); });
  const g0 = window.go; if (typeof g0 === 'function') window.go = async function () { const r = await g0.apply(this, arguments); setTimeout(poll, 600); return r; };
})();
