/* qr.js — مولّد وقارئ QR مكتوب خصيصاً للمنصة (من غير أي مكتبة خارجية)
   - encode/svg/draw: بيرسم QR (مستوى تصحيح M، نسخ 1–6، وضع Byte) للكود المطبوع على الكارت.
   - decode: بيقرأ QR من صورة (ImageData) — احتياطي للمتصفحات اللي ما فيهاش BarcodeDetector (زي آيفون).
   - scan: نافذة الكاميرا. وظيفتها الوحيدة تملا خانة الكود بحروف وأرقام بس — مفيش فتح روابط ولا تنفيذ أي حاجة.
   الاستخدام: window.QRX */
(function () {
  'use strict';
  // ---------- حقل جالوا GF(256) ----------
  const EXP = new Uint8Array(512), LOG = new Uint8Array(256);
  (function () { let x = 1; for (let i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 256) x ^= 0x11d; } for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255]; })();
  const mul = (a, b) => (a && b) ? EXP[LOG[a] + LOG[b]] : 0;
  const inv = a => EXP[255 - LOG[a]];

  // نسخ 1..6 — مستوى M: [إجمالي الكلمات, كلمات التصحيح لكل بلوك, عدد البلوكات]
  const VER = { 1: [26, 10, 1], 2: [44, 16, 1], 3: [70, 26, 1], 4: [100, 18, 2], 5: [134, 24, 2], 6: [172, 16, 4] };
  const ALIGN = { 2: 18, 3: 22, 4: 26, 5: 30, 6: 34 };
  const dataWords = v => VER[v][0] - VER[v][1] * VER[v][2];
  const byteCap = v => dataWords(v) - 2;   // 4 بت مود + 8 بت طول = 12 بت، + أطول ختام → سعة بايت = كلمات − 2 تقريباً (v1: 14)

  function rsGen(n) { let g = [1]; for (let i = 0; i < n; i++) { const r = new Array(g.length + 1).fill(0); for (let j = 0; j < g.length; j++) { r[j] ^= g[j]; r[j + 1] ^= mul(g[j], EXP[i]); } g = r; } return g; }
  function rsEnc(data, n) {
    const g = rsGen(n), res = new Array(n).fill(0);
    for (const d of data) { const f = d ^ res[0]; res.shift(); res.push(0); if (f) for (let i = 0; i < n; i++) res[i] ^= mul(g[i + 1], f); }
    return res;
  }
  const utf8 = s => Array.from(new TextEncoder().encode(String(s)));

  // ---------- خريطة الوحدات الوظيفية (مشتركة بين المولّد والقارئ) ----------
  function funcMap(v) {
    const n = 17 + 4 * v, F = Array.from({ length: n }, () => new Uint8Array(n));
    const fill = (r0, c0, h, w) => { for (let r = r0; r < r0 + h; r++) for (let c = c0; c < c0 + w; c++) if (r >= 0 && c >= 0 && r < n && c < n) F[r][c] = 1; };
    fill(0, 0, 9, 9); fill(0, n - 8, 9, 8); fill(n - 8, 0, 8, 9);       // الفايندر + الفواصل + معلومات الصيغة
    for (let i = 0; i < n; i++) { F[6][i] = 1; F[i][6] = 1; }          // التايمينج
    if (v >= 2) fill(ALIGN[v] - 2, ALIGN[v] - 2, 5, 5);
    return F;
  }
  const MASKS = [(x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, (x, y) => x % 3 === 0, (x, y) => (x + y) % 3 === 0,
    (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, (x, y) => (x * y) % 2 + (x * y) % 3 === 0,
    (x, y) => ((x * y) % 2 + (x * y) % 3) % 2 === 0, (x, y) => (((x + y) % 2) + (x * y) % 3) % 2 === 0];
  const fmtBits = (ecBits, mask) => { const d = (ecBits << 3) | mask; let r = d; for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537); return ((d << 10) | r) ^ 0x5412; };

  // ---------- المولّد ----------
  function encode(text) {
    const bytes = utf8(text); let v = 0;
    for (let k = 1; k <= 6; k++) if (bytes.length <= byteCap(k)) { v = k; break; }
    if (!v) throw new Error('qr_too_long');
    const n = 17 + 4 * v, total = dataWords(v) * 8, bits = [];
    const put = (val, len) => { for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
    put(4, 4); put(bytes.length, 8); bytes.forEach(b => put(b, 8));
    for (let i = 0; i < 4 && bits.length < total; i++) bits.push(0);
    while (bits.length % 8) bits.push(0);
    for (let p = 0xEC; bits.length < total; p ^= 0xEC ^ 0x11) put(p, 8);
    const cw = []; for (let i = 0; i < bits.length; i += 8) { let b = 0; for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j]; cw.push(b); }
    const nb = VER[v][2], ecn = VER[v][1], per = dataWords(v) / nb, blocks = [], ecs = [];
    for (let b = 0; b < nb; b++) { const d = cw.slice(b * per, (b + 1) * per); blocks.push(d); ecs.push(rsEnc(d, ecn)); }
    const out = []; for (let i = 0; i < per; i++) blocks.forEach(b => out.push(b[i])); for (let i = 0; i < ecn; i++) ecs.forEach(e => out.push(e[i]));
    const F = funcMap(v), base = Array.from({ length: n }, () => new Uint8Array(n));
    const finder = (r0, c0) => { for (let r = -1; r <= 7; r++) for (let c = -1; c <= 7; c++) { const rr = r0 + r, cc = c0 + c; if (rr < 0 || cc < 0 || rr >= n || cc >= n) continue; const d = Math.max(Math.abs(r - 3), Math.abs(c - 3)); base[rr][cc] = (r >= 0 && r <= 6 && c >= 0 && c <= 6 && d !== 2) ? 1 : 0; } };
    finder(0, 0); finder(0, n - 7); finder(n - 7, 0);
    for (let i = 8; i < n - 8; i++) { base[6][i] = i % 2 === 0 ? 1 : 0; base[i][6] = i % 2 === 0 ? 1 : 0; }
    if (v >= 2) { const a = ALIGN[v]; for (let r = -2; r <= 2; r++) for (let c = -2; c <= 2; c++) base[a + r][a + c] = Math.max(Math.abs(r), Math.abs(c)) !== 1 ? 1 : 0; }
    base[n - 8][8] = 1;
    let i = 0; const data = Array.from({ length: n }, () => new Uint8Array(n));
    for (let right = n - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let vert = 0; vert < n; vert++) for (let j = 0; j < 2; j++) {
        const x = right - j, up = ((right + 1) & 2) === 0, y = up ? n - 1 - vert : vert;
        if (!F[y][x] && i < out.length * 8) { data[y][x] = (out[i >> 3] >>> (7 - (i & 7))) & 1; i++; }
      }
    }
    let best = null, bestP = 1e9;
    for (let m = 0; m < 8; m++) {
      const M = base.map(r => Uint8Array.from(r));
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!F[y][x]) M[y][x] = data[y][x] ^ (MASKS[m](x, y) ? 1 : 0);
      const fb = fmtBits(0, m), set = (x, y, b) => { M[y][x] = b; }, g = k => (fb >>> k) & 1;
      for (let k = 0; k <= 5; k++) set(8, k, g(k)); set(8, 7, g(6)); set(8, 8, g(7)); set(7, 8, g(8)); for (let k = 9; k < 15; k++) set(14 - k, 8, g(k));
      for (let k = 0; k < 8; k++) set(n - 1 - k, 8, g(k)); for (let k = 8; k < 15; k++) set(8, n - 15 + k, g(k)); set(8, n - 8, 1);
      const p = penalty(M, n); if (p < bestP) { bestP = p; best = M; }
    }
    return { size: n, version: v, get: (r, c) => best[r][c] === 1, rows: best };
  }
  function penalty(M, n) {
    let p = 0;
    for (let pass = 0; pass < 2; pass++) for (let a = 0; a < n; a++) {
      let run = 1, hist = [];
      for (let b = 1; b <= n; b++) {
        const cur = b < n ? (pass ? M[b][a] : M[a][b]) : -1, prev = pass ? M[b - 1][a] : M[a][b - 1];
        if (cur === prev) run++; else { if (run >= 5) p += 3 + (run - 5); hist.push(run); run = 1; }
      }
      const line = []; for (let b = 0; b < n; b++) line.push(pass ? M[b][a] : M[a][b]);
      const s = line.join('');
      for (const pat of ['10111010000', '00001011101']) { let k = -1; while ((k = s.indexOf(pat, k + 1)) >= 0) p += 40; }
    }
    for (let r = 0; r < n - 1; r++) for (let c = 0; c < n - 1; c++) { const v = M[r][c]; if (v === M[r][c + 1] && v === M[r + 1][c] && v === M[r + 1][c + 1]) p += 3; }
    let dark = 0; for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) dark += M[r][c];
    p += Math.floor(Math.abs(dark * 20 - n * n * 10) / (n * n)) * 10;
    return p;
  }
  // SVG (مع هامش هادي 4 وحدات). color = لون الوحدات، bg = الخلفية
  function svg(text, o) {
    o = o || {}; const q = encode(text), n = q.size, m = 4, col = /^#[0-9a-fA-F]{6}$/.test(o.color || '') ? o.color : '#000000', bg = /^#[0-9a-fA-F]{6}$/.test(o.bg || '') ? o.bg : '#ffffff';
    let d = ''; for (let r = 0; r < n; r++) { let c = 0; while (c < n) { if (q.rows[r][c]) { let e = c; while (e < n && q.rows[r][e]) e++; d += 'M' + (c + m) + ' ' + (r + m) + 'h' + (e - c) + 'v1h-' + (e - c) + 'z'; c = e; } else c++; } }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + (n + 2 * m) + ' ' + (n + 2 * m) + '" shape-rendering="crispEdges" width="100%" height="100%"><rect width="100%" height="100%" fill="' + bg + '"/><path fill="' + col + '" d="' + d + '"/></svg>';
  }
  function draw(ctx, text, x, y, size, o) {
    o = o || {}; const q = encode(text), n = q.size, m = 4, u = size / (n + 2 * m);
    ctx.save(); ctx.fillStyle = o.bg || '#ffffff'; ctx.fillRect(x, y, size, size); ctx.fillStyle = o.color || '#000000';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.rows[r][c]) ctx.fillRect(Math.floor(x + (c + m) * u), Math.floor(y + (r + m) * u), Math.ceil(u), Math.ceil(u));
    ctx.restore();
  }

  // ---------- القارئ ----------
  // تصحيح أخطاء Reed–Solomon (Berlekamp–Massey) لبلوك واحد؛ بيرجّع كلمات البلوك المصحّحة أو null
  function rsDecode(msg, ecn) {
    const N = msg.length, S = new Array(ecn).fill(0); let bad = false;
    for (let i = 0; i < ecn; i++) { let s = 0; for (let j = 0; j < N; j++) s = mul(s, EXP[i]) ^ msg[j]; S[i] = s; if (s) bad = true; }
    if (!bad) return msg.slice();
    let C = [1], B = [1], L = 0, mm = 1, b = 1;
    for (let n = 0; n < ecn; n++) {
      let d = S[n]; for (let i = 1; i <= L; i++) d ^= mul(C[i] || 0, S[n - i]);
      if (d === 0) { mm++; continue; }
      const T = C.slice(), coef = mul(d, inv(b));
      while (C.length < B.length + mm) C.push(0);
      for (let i = 0; i < B.length; i++) C[i + mm] ^= mul(coef, B[i]);
      if (2 * L <= n) { L = n + 1 - L; B = T; b = d; mm = 1; } else mm++;
    }
    if (L * 2 > ecn) return null;
    const pos = []; for (let i = 0; i < N; i++) { let s = 0; const x = EXP[(255 - ((N - 1 - i) % 255)) % 255]; for (let k = 0; k < C.length; k++) s ^= mul(C[k], k === 0 ? 1 : EXP[(LOG[x] * k) % 255]); if (s === 0) pos.push(i); }
    if (pos.length !== L) return null;
    // Forney
    const om = new Array(ecn).fill(0); for (let i = 0; i < ecn; i++) for (let j = 0; j <= i && j < C.length; j++) om[i] ^= mul(C[j], S[i - j]);
    const out = msg.slice();
    for (const p of pos) {
      const xi = EXP[(N - 1 - p) % 255], xinv = inv(xi); let num = 0, den = 0;
      for (let i = 0; i < ecn; i++) num ^= mul(om[i], EXP[(LOG[xinv] * i) % 255]);
      for (let i = 1; i < C.length; i += 2) den ^= mul(C[i], EXP[(LOG[xinv] * (i - 1)) % 255]);
      if (!den) return null; out[p] ^= mul(xi, mul(num, inv(den)));
    }
    for (let i = 0; i < ecn; i++) { let s = 0; for (let j = 0; j < N; j++) s = mul(s, EXP[i]) ^ out[j]; if (s) return null; }
    return out;
  }
  const hamm = x => { let c = 0; while (x) { c += x & 1; x >>>= 1; } return c; };
  function readFormat(M, n) {
    const get = (x, y) => M[y][x] ? 1 : 0; let a = 0, b = 0;
    for (let k = 0; k <= 5; k++) a |= get(8, k) << k; a |= get(8, 7) << 6; a |= get(8, 8) << 7; a |= get(7, 8) << 8; for (let k = 9; k < 15; k++) a |= get(14 - k, 8) << k;
    for (let k = 0; k < 8; k++) b |= get(n - 1 - k, 8) << k; for (let k = 8; k < 15; k++) b |= get(8, n - 15 + k) << k;
    let best = null, bd = 99;
    for (let ec = 0; ec < 4; ec++) for (let m = 0; m < 8; m++) { const f = fmtBits(ec, m), d = Math.min(hamm(f ^ a), hamm(f ^ b)); if (d < bd) { bd = d; best = { ec, mask: m }; } }
    return bd <= 3 ? best : null;
  }
  // مصفوفة وحدات (M[y][x] = true للغامق) ← نص أو null
  function decodeMatrix(M, n) {
    if ((n - 17) % 4 || n < 21) return null; const v = (n - 17) / 4; if (!VER[v]) return null;
    const f = readFormat(M, n); if (!f || f.ec !== 0) return null;            // مستوى M بس (اللي بنطبعه)
    const F = funcMap(v), bits = [];
    for (let right = n - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let vert = 0; vert < n; vert++) for (let j = 0; j < 2; j++) {
        const x = right - j, up = ((right + 1) & 2) === 0, y = up ? n - 1 - vert : vert;
        if (!F[y][x]) bits.push((M[y][x] ? 1 : 0) ^ (MASKS[f.mask](x, y) ? 1 : 0));
      }
    }
    const cw = []; for (let i = 0; i + 8 <= bits.length; i += 8) { let b = 0; for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j]; cw.push(b); }
    const nb = VER[v][2], ecn = VER[v][1], per = dataWords(v) / nb, blocks = Array.from({ length: nb }, () => []);
    let p = 0; for (let i = 0; i < per; i++) for (let b = 0; b < nb; b++) blocks[b].push(cw[p++]);
    const ecb = Array.from({ length: nb }, () => []); for (let i = 0; i < ecn; i++) for (let b = 0; b < nb; b++) ecb[b].push(cw[p++]);
    const data = []; for (let b = 0; b < nb; b++) { const r = rsDecode(blocks[b].concat(ecb[b]), ecn); if (!r) return null; for (let i = 0; i < per; i++) data.push(r[i]); }
    const bs = []; data.forEach(d => { for (let i = 7; i >= 0; i--) bs.push((d >> i) & 1); });
    let q = 0; const rd = len => { let x = 0; for (let i = 0; i < len; i++) x = (x << 1) | (bs[q++] || 0); return x; }, out = [];
    const AN = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:';
    while (q + 4 <= bs.length) {
      const mode = rd(4); if (mode === 0) break;
      if (mode === 4) { const c = rd(8); for (let i = 0; i < c; i++) out.push(rd(8)); }
      else if (mode === 2) { let c = rd(9), s = ''; while (c >= 2) { const x = rd(11); s += AN[Math.floor(x / 45)] + AN[x % 45]; c -= 2; } if (c) s += AN[rd(6)]; Array.prototype.push.apply(out, utf8(s)); }
      else if (mode === 1) { let c = rd(10), s = ''; while (c >= 3) { s += String(rd(10)).padStart(3, '0'); c -= 3; } if (c === 2) s += String(rd(7)).padStart(2, '0'); else if (c === 1) s += String(rd(4)); Array.prototype.push.apply(out, utf8(s)); }
      else return null;
    }
    try { return new TextDecoder('utf-8', { fatal: true }).decode(new Uint8Array(out)); } catch (e) { return null; }
  }
  // تحويل الصورة لأبيض/أسود بعتبة محلية (آمنة مع الإضاءة غير المتساوية)
  function binarize(img) {
    const w = img.width, h = img.height, d = img.data, g = new Uint8Array(w * h), I = new Float64Array((w + 1) * (h + 1));
    for (let y = 0; y < h; y++) { let row = 0; for (let x = 0; x < w; x++) { const i = (y * w + x) * 4, l = (d[i] * 299 + d[i + 1] * 587 + d[i + 2] * 114) / 1000; g[y * w + x] = l; row += l; I[(y + 1) * (w + 1) + x + 1] = I[y * (w + 1) + x + 1] + row; } }
    const r = Math.max(8, Math.floor(Math.min(w, h) / 10)), B = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) { const y0 = Math.max(0, y - r), y1 = Math.min(h, y + r + 1); for (let x = 0; x < w; x++) { const x0 = Math.max(0, x - r), x1 = Math.min(w, x + r + 1), s = I[y1 * (w + 1) + x1] - I[y0 * (w + 1) + x1] - I[y1 * (w + 1) + x0] + I[y0 * (w + 1) + x0], m = s / ((x1 - x0) * (y1 - y0)); B[y * w + x] = g[y * w + x] < m * 0.9 - 2 ? 1 : 0; } }
    return { w, h, B };
  }
  function ratioOK(runs, mod) { const t = mod / 2; return Math.abs(runs[0] - mod) < t && Math.abs(runs[1] - mod) < t && Math.abs(runs[2] - 3 * mod) < 3 * t && Math.abs(runs[3] - mod) < t && Math.abs(runs[4] - mod) < t; }
  function crossCheck(B, w, h, cx, cy, vertical, maxLen) {
    const at = (a) => vertical ? B[a * w + cx] : B[cy * w + a], len = vertical ? h : w, c = vertical ? cy : cx;
    if (c < 0 || c >= len || !at(c)) return null; const runs = [0, 0, 0, 0, 0]; let i = c;
    while (i >= 0 && at(i)) { runs[2]++; i--; } const b2 = runs[2]; while (i >= 0 && !at(i)) { runs[1]++; i--; } while (i >= 0 && at(i)) { runs[0]++; i--; }
    i = c + 1; while (i < len && at(i)) { runs[2]++; i++; } while (i < len && !at(i)) { runs[3]++; i++; } while (i < len && at(i)) { runs[4]++; i++; }
    const tot = runs[0] + runs[1] + runs[2] + runs[3] + runs[4]; if (tot > maxLen * 2 + 8) return null;
    const mod = tot / 7; if (!ratioOK(runs, mod)) return null;
    return { size: tot, center: c - b2 + 1 + (runs[2] - 1) / 2 };
  }
  function findFinders(bin) {
    const { w, h, B } = bin, cand = [];
    for (let y = 0; y < h; y += 1) {
      let x = 0; const runs = []; let prev = B[y * w], len = 0, start = 0; const list = [];
      for (x = 0; x <= w; x++) { const cur = x < w ? B[y * w + x] : -1; if (cur === prev) len++; else { list.push([prev, start, len]); prev = cur; start = x; len = 1; } }
      for (let k = 0; k + 4 < list.length; k++) {
        if (list[k][0] !== 1) continue;
        const rr = [list[k][2], list[k + 1][2], list[k + 2][2], list[k + 3][2], list[k + 4][2]], tot = rr[0] + rr[1] + rr[2] + rr[3] + rr[4], mod = tot / 7;
        if (mod < 1.5 || !ratioOK(rr, mod)) continue;
        const cx0 = Math.round(list[k][1] + tot / 2 - 0.5);
        const v = crossCheck(B, w, h, cx0, y, true, tot); if (!v) continue;
        const cy = v.center, hz = crossCheck(B, w, h, cx0, Math.round(cy), false, tot); if (!hz) continue;
        const px = hz.center, sz = (tot + v.size + hz.size) / 3;
        let hit = cand.find(c => Math.abs(c.x - px) < sz * 0.6 && Math.abs(c.y - cy) < sz * 0.6);
        if (hit) { hit.x = (hit.x * hit.n + px) / (hit.n + 1); hit.y = (hit.y * hit.n + cy) / (hit.n + 1); hit.s = (hit.s * hit.n + sz) / (hit.n + 1); hit.n++; }
        else cand.push({ x: px, y: cy, s: sz, n: 1 });
      }
    }
    return cand.filter(c => c.n >= 2).sort((a, b) => b.n - a.n).slice(0, 9);
  }
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  function tryTriple(bin, a, b, c) {
    // الرأس المقابل لأطول ضلع = أعلى يسار
    const d = [[dist(b, c), a, b, c], [dist(a, c), b, a, c], [dist(a, b), c, a, b]].sort((p, q) => q[0] - p[0])[0];
    let TL = d[1], X = d[2], Y = d[3];
    const cr = (X.x - TL.x) * (Y.y - TL.y) - (X.y - TL.y) * (Y.x - TL.x);
    let TR = cr > 0 ? X : Y, BL = cr > 0 ? Y : X;
    const ms = (TL.s + TR.s + BL.s) / 21, dd = (dist(TL, TR) + dist(TL, BL)) / 2 / ms + 7;
    const res = [];
    const base = Math.round((dd - 17) / 4) * 4 + 17;
    for (const n of [base, base - 4, base + 4]) {
      if (n < 21 || n > 41) continue;
      const M = Array.from({ length: n }, () => new Uint8Array(n)), k = n - 7;
      for (let r = 0; r < n; r++) for (let q = 0; q < n; q++) {
        const u = (q + 0.5 - 3.5) / k, v = (r + 0.5 - 3.5) / k, x = TL.x + u * (TR.x - TL.x) + v * (BL.x - TL.x), y = TL.y + u * (TR.y - TL.y) + v * (BL.y - TL.y);
        const xi = Math.round(x), yi = Math.round(y);
        if (xi < 0 || yi < 0 || xi >= bin.w || yi >= bin.h) { M[r][q] = 0; continue; }
        // تصويت 3×3 حوالين النقطة (يقلّل أثر الضوضاء)
        let s = 0, t = 0; for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) { const xx = xi + ox, yy = yi + oy; if (xx >= 0 && yy >= 0 && xx < bin.w && yy < bin.h) { s += bin.B[yy * bin.w + xx]; t++; } }
        M[r][q] = (ms >= 3 ? s * 2 > t : bin.B[yi * bin.w + xi]) ? 1 : 0;
      }
      const t = decodeMatrix(M, n); if (t != null) return t;
    }
    return null;
  }
  function decode(img) {
    const bin = binarize(img), c = findFinders(bin); if (c.length < 3) return null;
    for (let i = 0; i < c.length; i++) for (let j = i + 1; j < c.length; j++) for (let k = j + 1; k < c.length; k++) {
      const a = c[i], b = c[j], d = c[k], mx = Math.max(a.s, b.s, d.s), mn = Math.min(a.s, b.s, d.s);
      if (mx / mn > 1.5) continue;
      const t = tryTriple(bin, a, b, d); if (t != null) return t;
    }
    return null;
  }

  // ---------- نافذة الكاميرا ----------
  // onCode(text) بتتنادى مرة واحدة بنص الـQR الخام؛ المنادي هو اللي يفلتره. الكاميرا بتتقفل بعدها.
  function scan(onCode, onError) {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(2,6,23,.92);display:flex;align-items:center;justify-content:center;padding:16px;direction:rtl;font-family:inherit';
    wrap.innerHTML = '<div style="width:100%;max-width:420px;background:#0f172a;border:1px solid #334155;border-radius:18px;padding:14px;color:#fff;text-align:center"><div style="font-weight:800;margin-bottom:8px">📷 وجّه الكاميرا ناحية الباركود (QR) على الكارت</div>'
      + '<div style="position:relative;border-radius:14px;overflow:hidden;background:#000;aspect-ratio:1/1"><video playsinline muted autoplay style="width:100%;height:100%;object-fit:cover"></video><div style="position:absolute;inset:18%;border:3px solid #ef4444;border-radius:14px;box-shadow:0 0 0 999px rgba(0,0,0,.35)"></div></div>'
      + '<div class="qrmsg" style="font-size:13px;color:#cbd5e1;margin:10px 0;min-height:20px;line-height:1.7">بيتم قراءة الكود وكتابته في الخانة بس — بعدها إنت اللي بتدوس «تفعيل».</div>'
      + '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><label style="cursor:pointer;background:#1e293b;border:1px solid #475569;border-radius:12px;padding:10px 14px;font-weight:700;font-size:14px">🖼 صورة من المعرض<input type="file" accept="image/*" style="display:none"></label><button type="button" class="qrx" style="background:#ef4444;border:0;color:#fff;border-radius:12px;padding:10px 18px;font-weight:800;font-size:14px;cursor:pointer;font-family:inherit">إغلاق</button></div></div>';
    document.body.appendChild(wrap);
    const video = wrap.querySelector('video'), msg = wrap.querySelector('.qrmsg'), cv = document.createElement('canvas'), cx = cv.getContext('2d', { willReadFrequently: true });
    let stream = null, stop = false, det = null, busy = false;
    const close = () => { stop = true; try { stream && stream.getTracks().forEach(t => t.stop()); } catch (e) {} try { video.srcObject = null; } catch (e) {} wrap.remove(); document.removeEventListener('keydown', onKey); };
    const onKey = e => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    wrap.querySelector('.qrx').onclick = close;
    const found = t => { if (stop) return; close(); try { onCode(String(t)); } catch (e) {} };
    wrap.querySelector('input[type=file]').onchange = async e => {
      const f = e.target.files && e.target.files[0]; if (!f) return; msg.textContent = 'بقرأ الصورة…';
      try {
        const bmp = await createImageBitmap(f), s = Math.min(1, 1100 / Math.max(bmp.width, bmp.height)); cv.width = Math.round(bmp.width * s); cv.height = Math.round(bmp.height * s); cx.drawImage(bmp, 0, 0, cv.width, cv.height);
        let t = null; if (det) { const r = await det.detect(cv); if (r && r[0]) t = r[0].rawValue; } if (t == null) t = decode(cx.getImageData(0, 0, cv.width, cv.height));
        if (t != null) found(t); else msg.textContent = 'ما لقيتش باركود في الصورة دي، جرّب صورة أوضح.';
      } catch (x) { msg.textContent = 'تعذّر قراءة الصورة.'; }
    };
    (async () => {
      try { if ('BarcodeDetector' in window) det = new BarcodeDetector({ formats: ['qr_code'] }); } catch (e) { det = null; }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { msg.textContent = 'المتصفح ده مش بيسمح بالكاميرا. استخدم «صورة من المعرض» أو اكتب الكود بإيدك.'; return; }
      try { stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false }); }
      catch (e) { msg.textContent = 'محتاج تسمح للمتصفح بالكاميرا. أو استخدم «صورة من المعرض» أو اكتب الكود بإيدك.'; if (onError) onError(e); return; }
      if (stop) { stream.getTracks().forEach(t => t.stop()); return; }
      video.srcObject = stream; try { await video.play(); } catch (e) {}
      const tick = async () => {
        if (stop) return;
        if (!busy && video.videoWidth) {
          busy = true;
          try {
            let t = null;
            if (det) { const r = await det.detect(video); if (r && r[0] && r[0].rawValue) t = r[0].rawValue; }
            else { const s = Math.min(1, 1280 / Math.max(video.videoWidth, video.videoHeight)); cv.width = Math.round(video.videoWidth * s); cv.height = Math.round(video.videoHeight * s); cx.drawImage(video, 0, 0, cv.width, cv.height); t = decode(cx.getImageData(0, 0, cv.width, cv.height)); }
            if (t != null) { found(t); return; }
          } catch (e) {}
          busy = false;
        }
        setTimeout(tick, det ? 120 : 160);
      };
      tick();
    })();
    return close;
  }
  // تنضيف نص الباركود لكود اشتراك: حروف وأرقام إنجليزي بس، 12 خانة بالظبط، وبيرجّع بصيغة XXXX-XXXX-XXXX أو null
  function toCode(raw) { const s = String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); return /^[A-Z0-9]{12}$/.test(s) ? s.slice(0, 4) + '-' + s.slice(4, 8) + '-' + s.slice(8) : null; }
  window.QRX = { encode, svg, draw, decode, decodeMatrix, scan, toCode, _rsDecode: rsDecode };
})();
