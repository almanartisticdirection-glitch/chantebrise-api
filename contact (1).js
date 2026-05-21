const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'touriafadi@yahoo.fr';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { nom, email, sujet, message } = req.body;

  try {
    // Email à Touria
    await resend.emails.send({
      from: 'Chante-Brise <onboarding@resend.dev>',
      to: OWNER_EMAIL,
      subject: `💬 Message de ${nom} — ${sujet}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:500px;margin:0 auto;padding:32px;background:#F8F3E8;border-radius:12px">
          <h2 style="color:#2A4A12;font-weight:400;margin-bottom:4px">Nouveau message</h2>
          <p style="color:#7A9A5A;font-size:13px;margin-bottom:24px">Chante-Brise · Étretat</p>
          <table style="width:100%;border-collapse:collapse">
            <tr style="border-bottom:1px solid #EDE4D2"><td style="padding:10px 0;color:#9A7830;font-size:11px;letter-spacing:1px;text-transform:uppercase;width:120px">De</td><td style="padding:10px 0;color:#1A1208">${nom}</td></tr>
            <tr style="border-bottom:1px solid #EDE4D2"><td style="padding:10px 0;color:#9A7830;font-size:11px;letter-spacing:1px;text-transform:uppercase">Email</td><td style="padding:10px 0"><a href="mailto:${email}" style="color:#2A4A12">${email}</a></td></tr>
            <tr style="border-bottom:1px solid #EDE4D2"><td style="padding:10px 0;color:#9A7830;font-size:11px;letter-spacing:1px;text-transform:uppercase">Sujet</td><td style="padding:10px 0;color:#1A1208">${sujet}</td></tr>
          </table>
          <div style="margin-top:20px;padding:16px;background:#fff;border-radius:8px;border:1px solid #EDE4D2">
            <p style="color:#4A4830;font-size:13px;line-height:1.8;white-space:pre-wrap">${message}</p>
          </div>
          <p style="margin-top:16px;font-size:11px;color:#7A9A5A">Répondre directement à : <a href="mailto:${email}" style="color:#2A4A12">${email}</a></p>
          <p style="margin-top:24px;font-size:12px;color:#7A9A5A;text-align:center">Chante-Brise · Avenue Damilaville · 76790 Étretat</p>
        </div>
      `
    });

    // Email de confirmation à l'expéditeur
    await resend.emails.send({
      from: 'Chante-Brise <onboarding@resend.dev>',
      to: email,
      subject: `Votre message à Chante-Brise a bien été reçu`,
      html: `
        <div style="font-family:Georgia,serif;max-width:500px;margin:0 auto;padding:32px;background:#F8F3E8;border-radius:12px">
          <h2 style="color:#2A4A12;font-weight:400;margin-bottom:4px">Message bien reçu</h2>
          <p style="color:#7A9A5A;font-size:13px;margin-bottom:20px">Chante-Brise · Étretat · Normandie</p>
          <p style="color:#1A1208;font-size:14px">Bonjour ${nom},</p>
          <p style="color:#4A4830;font-size:13px;line-height:1.8;margin:12px 0">Merci pour votre message. Touria vous répondra personnellement dans les 24 heures.</p>
          <p style="color:#4A4830;font-size:13px;line-height:1.8">En cas d'urgence, vous pouvez appeler directement au <strong>06 62 13 62 12</strong>.</p>
          <p style="margin-top:24px;font-size:12px;color:#7A9A5A;text-align:center">Chante-Brise · Avenue Damilaville · 76790 Étretat</p>
        </div>
      `
    });

    res.status(200).json({ success: true });
  } catch (e) {
    console.error('Contact email error:', e);
    res.status(500).json({ error: e.message });
  }
};
