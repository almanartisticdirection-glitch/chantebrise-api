const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'touriafadi@yahoo.fr';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { nom, email, message } = req.body;
  try {
    await resend.emails.send({
      from: 'Chante-Brise <onboarding@resend.dev>',
      to: OWNER_EMAIL,
      subject: 'Message de ' + nom + ' - Chante-Brise',
      html: '<div style="font-family:Georgia,serif;max-width:500px;padding:32px;background:#F8F3E8;border-radius:12px"><h2 style="color:#2A4A12">Nouveau message</h2><p><b>De:</b> ' + nom + '</p><p><b>Email:</b> <a href="mailto:' + email + '">' + email + '</a></p><p><b>Message:</b></p><p style="background:#fff;padding:16px;border-radius:8px">' + message + '</p></div>'
    });
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
