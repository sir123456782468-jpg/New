/* The Leader In English — Service Worker
   الهدف: التطبيق يتثبّت على الموبايل، وأي تحديث تنزّله على الموقع يظهر فوراً (الشبكة أولاً).
   مابيخزّنش أي بيانات طلاب ولا طلبات Supabase (دي خارج الدومين وبتعدّي مباشرة). */
const V = 'tl-v2';
const ICONS = /^\/(icons\/|logo\.(svg|png)|favicon\.ico)/;
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil((async () => { for (const k of await caches.keys()) if (k !== V) await caches.delete(k); await self.clients.claim(); })());
});
const OFFLINE = '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>لا يوجد اتصال</title><style>body{font-family:system-ui,sans-serif;background:#0b1120;color:#fff;display:grid;place-items:center;min-height:100vh;margin:0;text-align:center;padding:24px}h1{font-size:22px}p{color:#94a3b8;line-height:1.9}button{background:linear-gradient(135deg,#ef4444,#ec4899);color:#fff;border:0;border-radius:50px;padding:12px 28px;font-weight:800;font-size:15px;cursor:pointer}</style></head><body><div><div style="font-size:54px">📡</div><h1>مفيش اتصال بالإنترنت</h1><p>اتأكد من الإنترنت وحاول تاني.</p><button onclick="location.reload()">إعادة المحاولة</button></div></body></html>';
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;                         // Supabase / YouTube / Bunny / الخطوط: مش بتاعتنا
  if (/^\/(admin|api)/.test(u.pathname) || r.headers.has('range')) return;
  if (ICONS.test(u.pathname)) {                                      // الأيقونات: من الكاش لو موجودة
    e.respondWith(caches.open(V).then(async c => (await c.match(r)) || fetch(r).then(x => { if (x.ok) c.put(r, x.clone()); return x; })));
    return;
  }
  e.respondWith((async () => {                                       // الباقي: الشبكة أولاً، ولو مفيش نت نرجّع آخر نسخة
    try {
      const x = await fetch(r);
      if (x.ok && (r.mode === 'navigate' || /\.(js|css|json|webmanifest)$/.test(u.pathname))) { const c = await caches.open(V); c.put(r, x.clone()); }
      return x;
    } catch (err) {
      const c = await caches.open(V), m = await c.match(r);
      if (m) return m;
      if (r.mode === 'navigate') return new Response(OFFLINE, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      throw err;
    }
  })());
});
