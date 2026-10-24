// يرجّع عنوان الـIP الحقيقي للزائر (بيحطه Vercel ومينفعش الزائر يزوّره). بنستعمله كاحتياطي لو Supabase ما رجّعش العنوان.
module.exports = (req, res) => {
  const h = req.headers || {};
  const raw = String(h['x-real-ip'] || h['x-vercel-forwarded-for'] || h['x-forwarded-for'] || '').split(',')[0].trim();
  const ip = /^[0-9a-fA-F:.]{3,45}$/.test(raw) ? raw.toLowerCase() : null;
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).send(JSON.stringify({ ip }));
};
