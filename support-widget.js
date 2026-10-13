/* الدعم الفني — دردشة مع صور. بيشتغل في home / course / support
   لو الطالب مسجّل دخوله بيبدأ على طول، وغير كده بيكتب رقمه المسجّل في المنصة. */
(function () {
  if (window.__spw) return; window.__spw = 1;
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const sbc = () => window.supabaseClient;
  const KEY = 'sp_thread_v1';
  const ERR = { not_registered: 'الرقم ده مش مسجّل على المنصة. اكتب الرقم اللي سجّلت بيه.', bad_phone: 'اكتب رقم هاتف صحيح.', too_many: 'فتحت محادثات كتير النهاردة، كمّل في محادثتك الحالية أو حاول بكرة.', closed: 'المحادثة اتقفلت من الدعم.', rate_limited: 'رسائل كتير في وقت قصير، استنى شوية.', too_long: 'الرسالة طويلة جداً.', bad_thread: 'المحادثة دي مش متاحة، ابدأ واحدة جديدة.' };
  const msgOf = e => { const m = (e && e.message) || ''; for (const k in ERR) if (m.includes(k)) return ERR[k]; return /schema cache|does not exist/.test(m) ? 'خدمة الدعم لسه مش متفعّلة.' : 'حصلت مشكلة في الاتصال، حاول تاني.'; };
  const css = document.createElement('style');
  css.textContent = '#spw-b{position:fixed;left:18px;bottom:18px;z-index:9990;width:56px;height:56px;border-radius:50%;border:0;background:var(--brand,#6366f1);color:#fff;font-size:26px;cursor:pointer;box-shadow:0 10px 26px -8px rgba(0,0,0,.5)}#spw-b i{position:absolute;top:2px;right:2px;width:14px;height:14px;border-radius:50%;background:#ef4444;border:2px solid #fff;display:none}'
    + '#spw{position:fixed;left:18px;bottom:84px;z-index:9991;width:360px;max-width:calc(100vw - 24px);height:520px;max-height:calc(100vh - 110px);background:var(--card,#fff);color:var(--ink,#111);border:1px solid var(--line,#ddd);border-radius:18px;box-shadow:0 20px 50px -16px rgba(0,0,0,.45);display:none;flex-direction:column;overflow:hidden;font-family:Cairo,sans-serif;direction:rtl}#spw.on{display:flex}'
    + '#spw .h{padding:12px 14px;background:var(--brand,#6366f1);color:#fff;font-weight:800;display:flex;justify-content:space-between;align-items:center}#spw .h button{background:none;border:0;color:#fff;font-size:18px;cursor:pointer}'
    + '#spw .f{flex:1;overflow:auto;padding:12px;display:flex;flex-direction:column;gap:8px;background:var(--bg,#f4f6fb)}#spw .m{max-width:82%;padding:8px 12px;border-radius:14px;line-height:1.8;font-weight:600;font-size:14px;white-space:pre-wrap;word-break:break-word}#spw .m small{display:block;font-size:11px;opacity:.7;margin-top:3px}'
    + '#spw .m.me{align-self:flex-start;background:var(--brand,#6366f1);color:#fff}#spw .m.th{align-self:flex-end;background:var(--card,#fff);border:1px solid var(--line,#ddd)}#spw .m img{max-width:100%;max-height:200px;border-radius:10px;display:block;margin-bottom:4px}#spw .m.bad{background:#dc2626}'
    + '#spw .i{display:flex;gap:6px;padding:8px;border-top:1px solid var(--line,#ddd);align-items:flex-end}#spw textarea{flex:1;resize:none;border:1px solid var(--line,#ddd);border-radius:12px;padding:8px 10px;font:600 14px Cairo,sans-serif;background:var(--card,#fff);color:var(--ink,#111);min-height:40px;max-height:90px}'
    + '#spw .i button,#spw .pn button{border:0;border-radius:12px;padding:0 12px;min-height:40px;font:800 14px Cairo,sans-serif;cursor:pointer;background:var(--brand,#6366f1);color:#fff}#spw .i button.g{background:var(--line,#e6eaf2);color:var(--ink,#111)}'
    + '#spw .pn{padding:18px;display:flex;flex-direction:column;gap:10px;justify-content:center;flex:1}#spw .pn input{padding:12px;border:1px solid var(--line,#ddd);border-radius:12px;font:700 15px Cairo,sans-serif;direction:ltr;text-align:center;background:var(--card,#fff);color:var(--ink,#111)}#spw .nt{color:var(--muted,#64748b);font-weight:600;font-size:13px;line-height:1.9;text-align:center}#spw .er{color:#dc2626;font-weight:700;font-size:13px;text-align:center}';
  css.textContent += '#spw.inl{position:static;display:flex;width:100%;max-width:none;height:calc(100vh - 230px);min-height:420px;max-height:none;box-shadow:none}#spw.inl .h button{display:none}'
    + '#spw .at{display:none;align-items:center;gap:8px;padding:6px 10px;border-top:1px solid var(--line,#ddd);background:var(--card,#fff)}#spw .at.on{display:flex}#spw .at img{width:44px;height:44px;object-fit:cover;border-radius:8px}#spw .at span{flex:1;font-weight:700;font-size:13px}#spw .at button{border:0;background:none;font-size:18px;cursor:pointer;color:#dc2626}'
    + '#spw .m.me small{opacity:.85}';
  document.head.appendChild(css);
  const btn = document.createElement('button'); btn.id = 'spw-b'; btn.type = 'button'; btn.setAttribute('aria-label', 'الدعم الفني'); btn.innerHTML = '💬<i></i>';
  const box = document.createElement('div'); box.id = 'spw';
  box.innerHTML = '<div class="h"><span>💬 الدعم الفني</span><button type="button" id="spw-x" aria-label="إغلاق">✕</button></div><div id="spw-body" style="display:flex;flex-direction:column;flex:1;min-height:0"></div>';
  document.body.appendChild(btn); document.body.appendChild(box);
  const body = $('#spw-body'); let seenAt = null, T = null, poll = null, cache = [], pending = [], lastCount = 0, closed = false, busy = false;
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } };
  const save = t => { try { t ? localStorage.setItem(KEY, JSON.stringify(t)) : localStorage.removeItem(KEY); } catch (e) {} };
  const uidOf = async () => { try { const r = await sbc().auth.getSession(); return (r.data && r.data.session && r.data.session.user.id) || null; } catch (e) { return null; } };
  const loggedIn = async () => !!(await uidOf());

  function phoneScreen(err) {
    body.innerHTML = '<div class="pn"><div class="nt">اكتب رقم هاتفك المسجّل على المنصة عشان نكمّل معاك.</div><input id="spw-ph" inputmode="tel" placeholder="01XXXXXXXXX" maxlength="15"><div class="er" id="spw-er">' + esc(err || '') + '</div><button type="button" id="spw-go" style="min-height:44px">متابعة</button></div>';
    $('#spw-go').onclick = async () => { const v = $('#spw-ph').value.trim(); $('#spw-er').textContent = ''; if (v.replace(/\D/g, '').length < 8) { $('#spw-er').textContent = ERR.bad_phone; return; } await start(v, false); };
    $('#spw-ph').onkeydown = e => { if (e.key === 'Enter') $('#spw-go').click(); };
  }
  async function start(phone, fresh) {
    body.innerHTML = '<div class="pn"><div class="nt">⏳ لحظة...</div></div>';
    const { data, error } = await sbc().rpc('support_start', { p_phone: phone || null, p_new: !!fresh });
    if (error) { if (!(await loggedIn())) return phoneScreen(msgOf(error)); body.innerHTML = '<div class="pn"><div class="er">' + esc(msgOf(error)) + '</div></div>'; return; }
    T = { id: data.thread_id, token: data.token, phone: phone || null, uid: await uidOf() }; save(T); cache = []; pending = []; closed = false; chatScreen(); await refresh(true);
  }
  function chatScreen() {
    body.innerHTML = '<div class="f" id="spw-f"></div><div id="spw-cl" class="nt" style="display:none;padding:10px"></div><div class="at" id="spw-at-box"><img id="spw-at-img" alt=""><span>📷 الصورة جاهزة — اكتب تعليق (اختياري) واضغط إرسال</span><button type="button" id="spw-at-x" title="إلغاء الصورة">✕</button></div><div class="i" id="spw-in"><input type="file" id="spw-im" accept="image/*" hidden><button type="button" class="g" id="spw-at" title="صورة">📎</button><textarea id="spw-t" rows="1" placeholder="اكتب مشكلتك أو استفسارك..."></textarea><button type="button" id="spw-s">إرسال</button></div>';
    $('#spw-s').onclick = () => send(); $('#spw-at').onclick = () => $('#spw-im').click();
    $('#spw-t').onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };
    $('#spw-im').onchange = e => { const f = e.target.files[0]; e.target.value = ''; if (f) setAtt(f); };
    $('#spw-at-x').onclick = () => setAtt(null);
    setAtt(att);
  }
  let att = null;
  function setAtt(f) {
    att = f || null; const b = $('#spw-at-box'); if (!b) return;
    if (att) { $('#spw-at-img').src = URL.createObjectURL(att); b.classList.add('on'); } else { b.classList.remove('on'); $('#spw-at-img').removeAttribute('src'); }
  }
  const bub = (m, cls, st) => '<div class="m ' + cls + '">' + (m.image_url ? '<a href="' + esc(m.image_url) + '" target="_blank" rel="noopener"><img src="' + esc(m.image_url) + '" alt="صورة"></a>' : '') + (m.body ? '<div dir="auto">' + esc(m.body) + '</div>' : '') + '<small>' + (st || new Date(m.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })) + '</small></div>';
  function draw(server) {
    const f = $('#spw-f'); if (!f) return; const near = f.scrollHeight - f.scrollTop - f.clientHeight < 90;
    let h = server.map(m => bub(m, m.sender === 'staff' ? 'th' : 'me', m.sender === 'student' ? (seenAt && new Date(m.created_at) <= new Date(seenAt) ? '✓✓ شافها الدعم' : '✓ تم الإرسال') : null)).join('');
    pending.forEach((p, i) => { h += '<div class="m me' + (p.err ? ' bad' : '') + '">' + (p.preview ? '<img src="' + esc(p.preview) + '" alt="">' : '') + (p.body ? '<div dir="auto">' + esc(p.body) + '</div>' : '') + '<small>' + (p.err ? '⚠️ لم يُرسل' + (p.msg ? ' (' + esc(p.msg) + ')' : '') + ' — <a href="#" data-r="' + i + '" style="color:#fff;text-decoration:underline">إعادة المحاولة</a>' : '⏳ جاري الإرسال...') + '</small></div>'; });
    if (!server.length && !pending.length) h = '<div class="nt">اكتب رسالتك وهنرد عليك في أقرب وقت 🤝</div>';
    f.innerHTML = h; if (near || pending.length) f.scrollTop = f.scrollHeight;
    f.querySelectorAll('a[data-r]').forEach(a => a.onclick = ev => { ev.preventDefault(); const p = pending.splice(+a.dataset.r, 1)[0]; p.err = false; pending.push(p); draw(cache); deliver(p); });
  }
  async function refresh(scroll) {
    if (!T || busy) return; busy = true;
    try {
      const { data, error } = await sbc().rpc('support_fetch', { p_thread: T.id, p_token: T.token });
      if (error) { if ((error.message || '').includes('bad_thread')) { save(null); T = null; return open(); } return; }
      const staffN = data.messages.filter(m => m.sender === 'staff').length;
      if (!box.classList.contains('on') && staffN > (+localStorage.getItem(KEY + '_n') || 0)) $('i', btn).style.display = 'block';
      seenAt = data.admin_seen_at || null; cache = data.messages; draw(cache); lastCount = data.messages.length;
      closed = data.status !== 'open'; const cl = $('#spw-cl'), inn = $('#spw-in');
      if (cl) { cl.style.display = closed ? 'block' : 'none'; inn.style.display = closed ? 'none' : 'flex'; if (closed) { cl.innerHTML = '🔒 المحادثة دي اتقفلت من الدعم.<br><button type="button" id="spw-new" style="margin-top:8px;border:0;border-radius:12px;padding:10px 16px;background:var(--brand,#6366f1);color:#fff;font:800 14px Cairo,sans-serif;cursor:pointer">ابدأ محادثة جديدة</button>'; $('#spw-new').onclick = () => start(T.phone, true); } }
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
  // رسالة واحدة: نص و/أو صورة
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
  async function open() {
    box.classList.add('on'); $('i', btn).style.display = 'none';
    const uid = await uidOf(), li = !!uid; T = load();
    if (T && uid && T.uid !== uid) { save(null); T = null; }
    if (T) { chatScreen(); await refresh(true); }
    else if (li) await start(null, false);
    else phoneScreen();
    clearInterval(poll); poll = setInterval(() => { if (box.classList.contains('on') && !document.hidden) refresh(); }, 5000);
  }
  function closeBox() { box.classList.remove('on'); clearInterval(poll); try { localStorage.setItem(KEY + '_n', String(cache.filter(m => m.sender === 'staff').length)); } catch (e) {} }
  btn.onclick = () => box.classList.contains('on') ? closeBox() : open(); $('#spw-x').onclick = closeBox;
  window.openSupport = open;
  window.spMount = async el => { if (!el) return; if (box.parentNode !== el) el.appendChild(box); box.classList.add('inl'); btn.style.display = 'none'; await open(); };
  window.spUnmount = () => { if (box.parentNode !== document.body) { document.body.appendChild(box); box.classList.remove('inl'); box.classList.remove('on'); clearInterval(poll); } btn.style.display = ''; };
  if (/[?&]support=1/.test(location.search)) setTimeout(() => { if (document.getElementById('spTab')) location.hash = '#support'; else open(); }, 800);
  // نقطة حمراء لو فيه رد جديد (فحص هادي كل 40 ثانية لو فيه محادثة)
  setInterval(async () => { const t = load(); if (!t || box.classList.contains('on') || document.hidden) return; try { const { data } = await sbc().rpc('support_fetch', { p_thread: t.id, p_token: t.token, p_peek: true }); if (data && data.messages.filter(m => m.sender === 'staff').length > (+localStorage.getItem(KEY + '_n') || 0)) $('i', btn).style.display = 'block'; } catch (e) {} }, 40000);
})();
