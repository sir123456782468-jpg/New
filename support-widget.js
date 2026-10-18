/* الدعم الفني — قايمة شاتات الطالب + بدء شات جديد (اسم ثلاثي + تأكيد الرقم) + دردشة بالصور.
   بيشتغل في home / course / support. الطالب المسجّل بيشوف شاتاته، وغير المسجّل بيكتب رقمه المسجّل على المنصة. */
(function () {
  if (window.__spw) return; window.__spw = 1;
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const sbc = () => window.supabaseClient;
  const KEY = 'sp_thread_v1';
  const ERR = { not_registered: 'الرقم ده مش مسجّل على المنصة. اكتب الرقم اللي سجّلت بيه.', bad_phone: 'اكتب رقم موبايل صحيح (11 رقم بيبدأ بـ 01).', bad_name: 'اكتب اسمك الثلاثي بالحروف (3 كلمات على الأقل، من غير أرقام أو رموز).', too_many: 'فتحت محادثات كتير النهاردة، كمّل في محادثتك الحالية أو حاول بكرة.', closed: 'المحادثة اتقفلت من الدعم.', rate_limited: 'رسائل كتير في وقت قصير، استنى شوية.', too_long: 'الرسالة طويلة جداً.', bad_thread: 'المحادثة دي مش متاحة، ابدأ واحدة جديدة.', no_profile: 'مش لاقيين بياناتك على المنصة.' };
  const msgOf = e => { const m = (e && e.message) || ''; for (const k in ERR) if (m.includes(k)) return ERR[k]; return /schema cache|does not exist|could not find/.test(m) ? 'خدمة الدعم لسه مش متفعّلة.' : 'حصلت مشكلة في الاتصال، حاول تاني.'; };
  const tfmt = d => { try { return new Date(d).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' }); } catch (e) { return ''; } };
  const css = document.createElement('style');
  css.textContent = '#spw-b{position:fixed;left:18px;bottom:18px;z-index:9990;width:56px;height:56px;border-radius:50%;border:0;background:var(--brand,#6366f1);color:#fff;font-size:26px;cursor:pointer;box-shadow:0 10px 26px -8px rgba(0,0,0,.5)}#spw-b i{position:absolute;top:2px;right:2px;width:14px;height:14px;border-radius:50%;background:#ef4444;border:2px solid #fff;display:none}'
    + '#spw{position:fixed;left:18px;bottom:84px;z-index:9991;width:360px;max-width:calc(100vw - 24px);height:540px;max-height:calc(100vh - 110px);background:var(--card,#fff);color:var(--ink,#111);border:1px solid var(--line,#ddd);border-radius:18px;box-shadow:0 20px 50px -16px rgba(0,0,0,.45);display:none;flex-direction:column;overflow:hidden;font-family:Cairo,sans-serif;direction:rtl}#spw.on{display:flex}'
    + '#spw .h{padding:12px 14px;background:var(--brand,#6366f1);color:#fff;font-weight:800;display:flex;justify-content:space-between;align-items:center;gap:8px}#spw .h span{flex:1}#spw .h button{background:none;border:0;color:#fff;font-size:18px;cursor:pointer;padding:0 4px}'
    + '#spw .f{flex:1;overflow:auto;padding:12px;display:flex;flex-direction:column;gap:8px;background:var(--bg,#f4f6fb)}#spw .m{max-width:82%;padding:8px 12px;border-radius:14px;line-height:1.8;font-weight:600;font-size:14px;white-space:pre-wrap;word-break:break-word}#spw .m small{display:block;font-size:11px;opacity:.7;margin-top:3px}'
    + '#spw .m.me{align-self:flex-start;background:var(--brand,#6366f1);color:#fff}#spw .m.th{align-self:flex-end;background:var(--card,#fff);border:1px solid var(--line,#ddd)}#spw .m img{max-width:100%;max-height:200px;border-radius:10px;display:block;margin-bottom:4px}#spw .m.bad{background:#dc2626}'
    + '#spw .i{display:flex;gap:6px;padding:8px;border-top:1px solid var(--line,#ddd);align-items:flex-end}#spw textarea{flex:1;resize:none;border:1px solid var(--line,#ddd);border-radius:12px;padding:8px 10px;font:600 14px Cairo,sans-serif;background:var(--card,#fff);color:var(--ink,#111);min-height:40px;max-height:90px}'
    + '#spw .i button,#spw .pn button,#spw .bt{border:0;border-radius:12px;padding:0 12px;min-height:40px;font:800 14px Cairo,sans-serif;cursor:pointer;background:var(--brand,#6366f1);color:#fff}#spw .i button.g,#spw .bt.g{background:var(--line,#e6eaf2);color:var(--ink,#111)}#spw .bt.ok{background:#16a34a}#spw .bt.no{background:#dc2626}'
    + '#spw .pn{padding:16px;display:flex;flex-direction:column;gap:10px;justify-content:center;flex:1;overflow:auto}#spw .pn input{padding:12px;border:1px solid var(--line,#ddd);border-radius:12px;font:700 15px Cairo,sans-serif;background:var(--card,#fff);color:var(--ink,#111);text-align:center}#spw .pn input.ph{direction:ltr}#spw .nt{color:var(--muted,#64748b);font-weight:600;font-size:13px;line-height:1.9;text-align:center}#spw .er{color:#dc2626;font-weight:700;font-size:13px;text-align:center;min-height:18px}'
    + '#spw .rm{background:var(--bg,#f4f6fb);border:1px solid var(--line,#ddd);border-radius:14px;padding:12px;line-height:1.95;font-weight:700;font-size:14px;white-space:pre-line}#spw .ph0{text-align:center;font:800 22px Cairo,sans-serif;direction:ltr;background:var(--bg,#f4f6fb);border:2px dashed var(--brand,#6366f1);border-radius:14px;padding:12px}'
    + '#spw .lst{flex:1;overflow:auto;padding:10px;display:flex;flex-direction:column;gap:8px;background:var(--bg,#f4f6fb)}#spw .ci{position:relative;background:var(--card,#fff);border:1px solid var(--line,#ddd);border-radius:14px;padding:10px 12px;cursor:pointer;line-height:1.7}#spw .ci b{font-size:14px}#spw .ci small{display:block;color:var(--muted,#64748b);font-weight:600}#spw .ci .tx{font-weight:600;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
    + '#spw .ci .pl{display:inline-block;padding:1px 8px;border-radius:50px;font-size:11px;font-weight:800;margin-right:6px}#spw .ci .pl.o{background:#dcfce7;color:#15803d}#spw .ci .pl.c{background:var(--line,#e6eaf2);color:var(--muted,#64748b)}#spw .ci i{position:absolute;top:12px;left:12px;width:12px;height:12px;border-radius:50%;background:#ef4444;box-shadow:0 0 0 3px rgba(239,68,68,.25)}'
    + '#spw .ft{padding:10px;border-top:1px solid var(--line,#ddd);display:flex;flex-direction:column;gap:6px}#spw .ft .bt{min-height:44px;width:100%}';
  css.textContent += '#spw.inl{position:static;display:flex;width:100%;max-width:none;height:calc(100vh - 230px);min-height:460px;max-height:none;box-shadow:none}#spw.inl .h #spw-x{display:none}'
    + '#spw .at{display:none;align-items:center;gap:8px;padding:6px 10px;border-top:1px solid var(--line,#ddd);background:var(--card,#fff)}#spw .at.on{display:flex}#spw .at img{width:44px;height:44px;object-fit:cover;border-radius:8px}#spw .at span{flex:1;font-weight:700;font-size:13px}#spw .at button{border:0;background:none;font-size:18px;cursor:pointer;color:#dc2626}'
    + '#spw .m.me small{opacity:.85}';
  document.head.appendChild(css);
  const btn = document.createElement('button'); btn.id = 'spw-b'; btn.type = 'button'; btn.setAttribute('aria-label', 'الدعم الفني'); btn.innerHTML = '💬<i></i>';
  const box = document.createElement('div'); box.id = 'spw';
  box.innerHTML = '<div class="h"><button type="button" id="spw-bk" aria-label="رجوع" hidden>→</button><span id="spw-tt">💬 الدعم الفني</span><button type="button" id="spw-x" aria-label="إغلاق">✕</button></div><div id="spw-body" style="display:flex;flex-direction:column;flex:1;min-height:0"></div>';
  document.body.appendChild(btn); document.body.appendChild(box);
  const body = $('#spw-body'); let seenAt = null, T = null, poll = null, cache = [], pending = [], closed = false, busy = false, view = '', nameDraft = '', att = null, myInfo = null;
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } };
  const save = t => { try { t ? localStorage.setItem(KEY, JSON.stringify(t)) : localStorage.removeItem(KEY); } catch (e) {} };
  const uidOf = async () => { try { const r = await sbc().auth.getSession(); return (r.data && r.data.session && r.data.session.user.id) || null; } catch (e) { return null; } };
  const dot = on => { const i = $('i', btn); if (i) i.style.display = on ? 'block' : 'none'; };
  function head(title, back) { $('#spw-tt').textContent = title; const b = $('#spw-bk'); b.hidden = !back; b.onclick = back || null; }
  const wait = t => '<div class="pn"><div class="nt">' + (t || '⏳ لحظة...') + '</div></div>';
  const errBox = (m, retry) => '<div class="pn"><div class="er">' + esc(m) + '</div>' + (retry ? '<button type="button" class="bt" id="spw-rt">حاول تاني</button>' : '') + '</div>';

  // ===== 1) قايمة محادثات الطالب =====
  async function home() {
    view = 'home'; clearInterval(poll); T = null; head('💬 الدعم الفني', null); body.innerHTML = wait();
    const { data, error } = await sbc().rpc('support_my_threads');
    if (error) { body.innerHTML = errBox(msgOf(error), true); const r = $('#spw-rt'); if (r) r.onclick = home; return; }
    const list = data || [], hasOpen = list.some(t => t.status === 'open');
    dot(list.some(t => +t.unread > 0));
    body.innerHTML = '<div class="lst">' + (list.length ? list.map((t, i) => '<div class="ci" data-i="' + i + '">' + (+t.unread > 0 ? '<i title="رد جديد"></i>' : '') + '<b>محادثة ' + tfmt(t.created_at) + '</b><span class="pl ' + (t.status === 'open' ? 'o' : 'c') + '">' + (t.status === 'open' ? 'مفتوحة' : '🔒 منتهية') + '</span><div class="tx">' + esc(t.last || 'لسه ما اتكتبتش المشكلة') + '</div><small>آخر نشاط: ' + tfmt(t.last_at) + '</small></div>').join('') : '<div class="nt" style="margin-top:30px">مفيش محادثات لسه 🤝<br>اضغط «بدء شات جديد» وابعتلنا مشكلتك.</div>') + '</div>'
      + '<div class="ft">' + (hasOpen ? '<div class="nt">عندك محادثة مفتوحة، كمّل فيها من فوق 👆</div>' : '<button type="button" class="bt" id="spw-new">➕ بدء شات جديد</button>') + '</div>';
    body.querySelectorAll('.ci').forEach(el => el.onclick = () => openThread(list[+el.dataset.i]));
    const nb = $('#spw-new'); if (nb) nb.onclick = () => step1();
  }
  function openThread(t) { T = { id: t.id, token: t.token }; cache = []; pending = []; closed = false; chatScreen(); refresh(true); startPoll(); }

  // ===== 2) بدء شات جديد: رسالة جاهزة + الاسم الثلاثي =====
  const nameOk = v => { const w = v.trim().replace(/\s+/g, ' ').split(' '); return w.length >= 3 && w.every(x => x.length >= 2) && !/[0-9<>@#$%^&*()_+=\/\\|{}\[\]~`"]/.test(v) && v.trim().length <= 80; };
  async function step1(err) {
    view = 'new'; clearInterval(poll); const li = !!(await uidOf());
    head('➕ شات جديد', li ? home : (load() ? () => { const t = load(); T = t; chatScreen(); refresh(true); startPoll(); } : null));
    body.innerHTML = '<div class="pn"><div class="rm">👋 أهلاً بك في الدعم الفني لمنصة The Leader In English\nعشان نساعدك بسرعة:\n١) اكتب اسمك الثلاثي هنا تحت\n٢) هنتأكد من رقم موبايلك المسجّل عندنا\n٣) وبعدها تكتب مشكلتك وهنرد عليك.</div>'
      + '<input id="spw-nm" placeholder="اكتب اسمك الثلاثي (مثال: أحمد محمد علي)" maxlength="80" autocomplete="name" value="' + esc(nameDraft) + '"><div class="er" id="spw-er">' + esc(err || '') + '</div><button type="button" class="bt" id="spw-go" style="min-height:44px">التالي ←</button></div>';
    const go = async () => { const v = $('#spw-nm').value.replace(/\s+/g, ' ').trim(); nameDraft = v; if (!nameOk(v)) { $('#spw-er').textContent = ERR.bad_name; return; } if (li) step2(v); else stepPhone(v); };
    $('#spw-go').onclick = go; $('#spw-nm').onkeydown = e => { if (e.key === 'Enter') go(); };
  }
  async function step2(name) {                 // مسجّل دخول: نعرض رقمه المسجّل ونسأله هو صح؟
    head('📱 تأكيد الرقم', () => step1()); body.innerHTML = wait();
    if (!myInfo) { const { data, error } = await sbc().rpc('support_my_info'); if (error || !data) { body.innerHTML = errBox(msgOf(error), true); const r = $('#spw-rt'); if (r) r.onclick = () => step2(name); return; } myInfo = data; }
    body.innerHTML = '<div class="pn"><div class="nt" style="font-size:14px">أهلاً <b>' + esc(name.split(' ')[0]) + '</b> 👋<br>الرقم المسجّل عندنا على المنصة هو:</div><div class="ph0">' + esc(myInfo.phone) + '</div><div class="nt" style="font-size:14px"><b>هل الرقم ده صحيح؟</b></div>'
      + '<div class="er" id="spw-er"></div><button type="button" class="bt ok" id="spw-y" style="min-height:44px">✅ نعم، الرقم صحيح</button><button type="button" class="bt no" id="spw-n" style="min-height:44px">❌ لا، الرقم غلط</button></div>';
    $('#spw-y').onclick = () => begin(name, true, null);
    $('#spw-n').onclick = () => {
      body.innerHTML = '<div class="pn"><div class="nt">اكتب رقم موبايلك الصحيح وهنوصّله للدعم مع رسالتك:</div><input id="spw-ph" class="ph" inputmode="tel" placeholder="01XXXXXXXXX" maxlength="15"><div class="er" id="spw-er"></div><button type="button" class="bt" id="spw-go" style="min-height:44px">فتح المحادثة</button><button type="button" class="bt g" id="spw-b2" style="min-height:40px">رجوع</button></div>';
      $('#spw-b2').onclick = () => step2(name);
      $('#spw-go').onclick = () => { const v = $('#spw-ph').value.replace(/\D/g, ''); if (!/^01[0-9]{9}$/.test(v)) { $('#spw-er').textContent = ERR.bad_phone; return; } begin(name, false, v); };
    };
  }
  function stepPhone(name) {                   // مش مسجّل دخول: يكتب رقمه المسجّل على المنصة
    head('📱 رقمك على المنصة', () => step1());
    body.innerHTML = '<div class="pn"><div class="nt">اكتب رقم موبايلك المسجّل على المنصة عشان نتأكد إنك طالب عندنا:</div><input id="spw-ph" class="ph" inputmode="tel" placeholder="01XXXXXXXXX" maxlength="15"><div class="er" id="spw-er"></div><button type="button" class="bt" id="spw-go" style="min-height:44px">فتح المحادثة</button></div>';
    const go = () => { const v = $('#spw-ph').value.replace(/\D/g, ''); if (v.length < 8) { $('#spw-er').textContent = ERR.bad_phone; return; } begin(name, true, v); };
    $('#spw-go').onclick = go; $('#spw-ph').onkeydown = e => { if (e.key === 'Enter') go(); };
  }
  async function begin(name, ok, phone) {
    body.innerHTML = wait('⏳ بنفتح المحادثة...');
    const { data, error } = await sbc().rpc('support_begin', { p_name: name, p_phone_ok: !!ok, p_phone: phone || null });
    if (error) { const m = msgOf(error); if (/bad_name/.test(error.message || '')) return step1(m); if (/not_registered|bad_phone/.test(error.message || '') && !(await uidOf())) { stepPhone(name); const e = $('#spw-er'); if (e) e.textContent = m; return; } body.innerHTML = errBox(m, false) + '<div class="ft"><button type="button" class="bt g" id="spw-bk2">رجوع</button></div>'; $('#spw-bk2').onclick = () => step1(); return; }
    if (!data || !data.thread_id) { body.innerHTML = errBox('تعذر بدء المحادثة — جرّب تاني بعد شوية', false); return; }
    const uid = await uidOf(); T = { id: data.thread_id, token: data.token, uid }; if (!uid) save(T);
    nameDraft = ''; cache = []; pending = []; closed = false; chatScreen(); await refresh(true); startPoll();
  }

  // ===== 3) المحادثة =====
  function chatScreen() {
    view = 'chat'; head('💬 الدعم الفني', async () => { clearInterval(poll); if (await uidOf()) home(); else step1(); });
    $('#spw-bk').hidden = false; if (!T || !T.uid) { uidOf().then(u => { if (!u) $('#spw-bk').hidden = true; }); }
    body.innerHTML = '<div class="f" id="spw-f"></div><div id="spw-cl" class="ft" style="display:none"></div><div class="at" id="spw-at-box"><img id="spw-at-img" alt=""><span>📷 الصورة جاهزة — اكتب تعليق (اختياري) واضغط إرسال</span><button type="button" id="spw-at-x" title="إلغاء الصورة">✕</button></div><div class="i" id="spw-in"><input type="file" id="spw-im" accept="image/*" hidden><button type="button" class="g" id="spw-at" title="صورة">📎</button><textarea id="spw-t" rows="1" placeholder="اكتب مشكلتك بالتفصيل هنا..."></textarea><button type="button" id="spw-s">إرسال</button></div>';
    $('#spw-s').onclick = () => send(); $('#spw-at').onclick = () => $('#spw-im').click();
    $('#spw-t').onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };
    $('#spw-im').onchange = e => { const f = e.target.files[0]; e.target.value = ''; if (f) setAtt(f); };
    $('#spw-at-x').onclick = () => setAtt(null);
    setAtt(att);
  }
  function setAtt(f) {
    att = f || null; const b = $('#spw-at-box'); if (!b) return;
    if (att) { $('#spw-at-img').src = URL.createObjectURL(att); b.classList.add('on'); } else { b.classList.remove('on'); $('#spw-at-img').removeAttribute('src'); }
  }
  const bub = (m, cls, st) => '<div class="m ' + cls + '">' + (m.image_url ? '<img class="zi" src="' + esc(m.image_url) + '" alt="صورة" loading="lazy">' : '') + (m.body ? '<div dir="auto">' + esc(m.body) + '</div>' : '') + '<small>' + (st || new Date(m.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })) + '</small></div>';
  function draw(server) {
    const f = $('#spw-f'); if (!f) return; const near = f.scrollHeight - f.scrollTop - f.clientHeight < 90;
    let h = server.map(m => bub(m, m.sender === 'staff' ? 'th' : 'me', m.sender === 'student' && !m.is_auto ? (seenAt && new Date(m.created_at) <= new Date(seenAt) ? '✓✓ شافها الدعم' : '✓ تم الإرسال') : null)).join('');
    pending.forEach((p, i) => { h += '<div class="m me' + (p.err ? ' bad' : '') + '">' + (p.preview ? '<img src="' + esc(p.preview) + '" alt="">' : '') + (p.body ? '<div dir="auto">' + esc(p.body) + '</div>' : '') + '<small>' + (p.err ? '⚠️ لم يُرسل' + (p.msg ? ' (' + esc(p.msg) + ')' : '') + ' — <a href="#" data-r="' + i + '" style="color:#fff;text-decoration:underline">إعادة المحاولة</a>' : '⏳ جاري الإرسال...') + '</small></div>'; });
    if (!server.length && !pending.length) h = '<div class="nt">اكتب رسالتك وهنرد عليك في أقرب وقت 🤝</div>';
    f.innerHTML = h; if (near || pending.length) f.scrollTop = f.scrollHeight;
    f.querySelectorAll('a[data-r]').forEach(a => a.onclick = ev => { ev.preventDefault(); const p = pending.splice(+a.dataset.r, 1)[0]; p.err = false; pending.push(p); draw(cache); deliver(p); });
  }
  async function refresh(scroll) {
    if (!T || busy || view !== 'chat') return; busy = true;
    try {
      const { data, error } = await sbc().rpc('support_fetch', { p_thread: T.id, p_token: T.token });
      if (error) { if ((error.message || '').includes('bad_thread')) { save(null); T = null; return open(); } return; }
      seenAt = data.admin_seen_at || null; cache = data.messages; draw(cache);
      closed = data.status !== 'open'; const cl = $('#spw-cl'), inn = $('#spw-in');
      if (cl) {
        cl.style.display = closed ? 'flex' : 'none'; inn.style.display = closed ? 'none' : 'flex';
        if (closed) { cl.innerHTML = '<div class="nt">🔒 المحادثة دي انتهت.</div><button type="button" class="bt" id="spw-new2">➕ بدء شات جديد</button>'; $('#spw-new2').onclick = () => { clearInterval(poll); step1(); }; }
      }
      dot(false);
    } finally { busy = false; }
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
  async function upImage(file) {
    const img = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('x')); i.src = r.result; }; r.onerror = rej; r.readAsDataURL(file); });
    const blob = await __cmp(img); const path = 'u/' + T.id + '-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.jpg';
    const up = await sbc().storage.from('support-files').upload(path, blob, { contentType: 'image/jpeg' }); if (up.error) throw up.error;
    return sbc().storage.from('support-files').getPublicUrl(path).data.publicUrl;
  }
  async function deliver(p) {
    try {
      if (p.file && !p.url) p.url = await upImage(p.file);
      const { error } = await sbc().rpc('support_send', { p_thread: T.id, p_token: T.token, p_body: p.body || null, p_image: p.url || null }); if (error) throw error;
      pending = pending.filter(x => x !== p); await refresh(true);
    } catch (e) { p.err = true; p.msg = msgOf(e); draw(cache); }
  }
  async function send() {
    const ta = $('#spw-t'); const text = ((ta && ta.value) || '').trim(); if ((!text && !att) || !T || closed) return;
    const p = { body: text, file: att, preview: att ? URL.createObjectURL(att) : null }; if (ta) ta.value = ''; setAtt(null);
    pending.push(p); draw(cache); await deliver(p);
  }
  function startPoll() { clearInterval(poll); poll = setInterval(() => { if (box.classList.contains('on') && !document.hidden) refresh(); }, 5000); }

  // ===== الفتح والقفل =====
  async function open() {
    box.classList.add('on'); dot(false);
    const uid = await uidOf(); myInfo = null;
    if (uid) return home();
    const t = load(); if (t) { T = t; chatScreen(); await refresh(true); startPoll(); } else step1();
  }
  function closeBox() { box.classList.remove('on'); clearInterval(poll); }
  btn.onclick = () => box.classList.contains('on') ? closeBox() : open(); $('#spw-x').onclick = closeBox;
  window.openSupport = open;
  window.spMount = async el => { if (!el) return; if (box.parentNode !== el) el.appendChild(box); box.classList.add('inl'); btn.style.display = 'none'; await open(); };
  window.spUnmount = () => { if (box.parentNode !== document.body) { document.body.appendChild(box); box.classList.remove('inl'); box.classList.remove('on'); clearInterval(poll); } btn.style.display = ''; };
  if (/[?&]support=1/.test(location.search)) setTimeout(() => { if (document.getElementById('spTab')) location.hash = '#support'; else open(); }, 800);
  // نقطة حمراء على الأيقونة لو فيه رد جديد (فحص هادي كل 45 ثانية)
  const peek = async () => {
    if (box.classList.contains('on') || document.hidden) return;
    try {
      if (await uidOf()) { const { data } = await sbc().rpc('support_unread_count'); dot(+data > 0); }
      else { const t = load(); if (t) { const { data } = await sbc().rpc('support_fetch', { p_thread: t.id, p_token: t.token, p_peek: true }); const n = data ? data.messages.filter(m => m.sender === 'staff' && !m.is_auto).length : 0; if (n > (+localStorage.getItem(KEY + '_n') || 0)) dot(true); } }
    } catch (e) {}
  };
  setInterval(peek, 45000); setTimeout(peek, 3000);
  window.addEventListener('pagehide', () => { try { const t = load(); if (t) localStorage.setItem(KEY + '_n', String(cache.filter(m => m.sender === 'staff' && !m.is_auto).length)); } catch (e) {} });
})();
