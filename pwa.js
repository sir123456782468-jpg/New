/* تثبيت المنصة كتطبيق (PWA): تسجيل الـService Worker + زر «ثبّت التطبيق» */
(function () {
  if ('serviceWorker' in navigator && location.protocol === 'https:') addEventListener('load', () => { try { navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {}); } catch (e) {} });
  const standalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  if (standalone()) return;
  let ev = null; const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !/crios|fxios/i.test(navigator.userAgent);
  function addBtn() {
    const menu = document.querySelector('#ddUser .menu'); if (!menu || document.getElementById('pwaBtn')) return;
    const b = document.createElement('button'); b.type = 'button'; b.id = 'pwaBtn'; b.textContent = '📲 ثبّت التطبيق على موبايلك';
    b.onclick = async () => {
      document.querySelectorAll('.dd').forEach(x => x.classList.remove('open'));
      if (ev) { ev.prompt(); try { await ev.userChoice; } catch (e) {} ev = null; b.remove(); return; }
      const m = document.createElement('div'); m.style.cssText = 'position:fixed;inset:0;z-index:300;background:rgba(2,6,23,.6);display:grid;place-items:center;padding:20px';
      m.innerHTML = '<div style="background:var(--card,#fff);color:var(--ink,#0f172a);border-radius:20px;padding:22px;max-width:380px;line-height:2;font-weight:700;text-align:center"><div style="font-size:42px">📲</div><b style="font-size:17px">تثبيت التطبيق</b><p style="margin:8px 0 14px;font-size:14px">' + (ios ? 'اضغط زر المشاركة <b>⬆️</b> في Safari ثم اختار <b>«إضافة إلى الشاشة الرئيسية»</b>.' : 'من قايمة المتصفح (⋮) اختار <b>«تثبيت التطبيق»</b> أو <b>«إضافة إلى الشاشة الرئيسية»</b>.') + '</p><button type="button" style="background:linear-gradient(135deg,#ef4444,#ec4899);color:#fff;border:0;border-radius:50px;padding:10px 28px;font-weight:800;cursor:pointer">تمام</button></div>';
      m.onclick = e => { if (e.target === m || e.target.tagName === 'BUTTON') m.remove(); }; document.body.appendChild(m);
    };
    const out = menu.querySelector('.out'); menu.insertBefore(b, out || null);
  }
  addEventListener('beforeinstallprompt', e => { e.preventDefault(); ev = e; addBtn(); });
  addEventListener('appinstalled', () => { const b = document.getElementById('pwaBtn'); if (b) b.remove(); });
  if (ios) addEventListener('load', () => setTimeout(addBtn, 1500));
})();
