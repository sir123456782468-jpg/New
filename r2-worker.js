/**
 * Cloudflare Worker — بوابة حماية فيديوهات R2 لمنصة The Leader In English
 *
 * بيخدم الفيديو بس لو الرابط موقّع من المنصة (بينتهي بعد 6 ساعات) والطلب جاي من موقعك.
 * الرابط: https://<worker>/v/<انتهاء>/<توقيع>/<معرّف-الفيديو>/<ملف>
 *   التوقيع = HMAC-SHA256( TOKEN_KEY , "<انتهاء>:<معرّف-الفيديو>" )
 * ملفات الفيديو لازم تتخزّن في الـBucket كده:  <معرّف-الفيديو>/video.mp4  أو  <معرّف-الفيديو>/index.m3u8 + المقاطع.
 * (التوقيع بيغطّي فولدر الفيديو كله، فمقاطع الـHLS بتشتغل من غير ما نوقّع كل مقطع).
 *
 * الإعدادات (Settings → Variables and Secrets):
 *   TOKEN_KEY       (Secret)  نفس القيمة اللي في لوحة التحكم «مفتاح توقيع Worker»
 *   ALLOWED_ORIGINS (Text)    مثال: https://new-ten-gray-40.vercel.app   (ممكن أكتر من واحد بفاصلة)
 *   BUCKET          (R2 bucket binding) اسم الـBinding لازم يكون BUCKET
 */
const enc = new TextEncoder();
const hex = buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
async function sign(key, msg) {
  const k = await crypto.subtle.importKey('raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', k, enc.encode(msg)));
}
const same = (a, b) => { if (a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; };
const TYPES = { m3u8: 'application/vnd.apple.mpegurl', ts: 'video/mp2t', m4s: 'video/iso.segment', mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime', vtt: 'text/vtt', key: 'application/octet-stream' };

export default {
  async fetch(req, env) {
    const allowed = String(env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim().replace(/\/$/, '')).filter(Boolean);
    const origin = (req.headers.get('Origin') || '').replace(/\/$/, '');
    let ref = ''; try { ref = req.headers.get('Referer') ? new URL(req.headers.get('Referer')).origin : ''; } catch (e) {}
    const cors = { 'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : (allowed[0] || 'null'), 'Vary': 'Origin', 'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS', 'Access-Control-Allow-Headers': 'Range', 'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges', 'Access-Control-Max-Age': '3000' };
    const deny = (s, m) => new Response(m, { status: s, headers: Object.assign({ 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }, cors) });
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'GET' && req.method !== 'HEAD') return deny(405, 'method');
    const url = new URL(req.url);
    const m = url.pathname.match(/^\/v\/(\d{10})\/([0-9a-f]{64})\/([A-Za-z0-9_-]{1,80})\/(.+)$/);
    if (!m) return deny(404, 'not found');
    const exp = +m[1], vid = m[3]; let rest;
    try { rest = decodeURIComponent(m[4]); } catch (e) { return deny(400, 'bad path'); }
    if (rest.includes('..') || rest.startsWith('/') || rest.length > 200) return deny(400, 'bad path');
    if (exp < Math.floor(Date.now() / 1000)) return deny(403, 'expired');
    if (!env.TOKEN_KEY || !same(await sign(env.TOKEN_KEY, exp + ':' + vid), m[2])) return deny(403, 'bad token');
    // الطلب لازم يجي من موقعك (الفيديو ما يتفتحش من رابط مباشر أو من موقع تاني)
    if (allowed.length && !(allowed.includes(origin) || allowed.includes(ref))) return deny(403, 'origin');
    const range = req.headers.get('Range');
    const obj = await env.BUCKET.get(vid + '/' + rest, range ? { range: req.headers } : undefined);
    if (!obj) return deny(404, 'not found');
    const h = new Headers(cors);
    try { obj.writeHttpMetadata(h); } catch (e) {}
    const ext = (rest.split('.').pop() || '').toLowerCase();
    if (!h.get('Content-Type') && TYPES[ext]) h.set('Content-Type', TYPES[ext]);
    if (TYPES[ext] && ext !== 'mp4' && ext !== 'webm' && ext !== 'mov') h.set('Content-Type', TYPES[ext]);
    h.set('Accept-Ranges', 'bytes'); if (obj.httpEtag) h.set('ETag', obj.httpEtag);
    h.set('Cache-Control', 'private, max-age=3600'); h.set('Content-Disposition', 'inline'); h.set('X-Content-Type-Options', 'nosniff'); h.set('Referrer-Policy', 'no-referrer');
    let status = 200;
    if (range && obj.range) {
      const r = obj.range, size = obj.size, start = r.offset != null ? r.offset : (size - r.suffix), len = r.length != null ? r.length : (size - start);
      h.set('Content-Range', 'bytes ' + start + '-' + (start + len - 1) + '/' + size); h.set('Content-Length', String(len)); status = 206;
    } else h.set('Content-Length', String(obj.size));
    return new Response(req.method === 'HEAD' ? null : obj.body, { status, headers: h });
  }
};
