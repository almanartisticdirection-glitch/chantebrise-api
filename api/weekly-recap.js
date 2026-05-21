const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'touriafadi@yahoo.fr';

module.exports = async (req, res) => {
  if (req.headers.authorization !== 'Bearer ' + process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  try {
    await resend.emails.send({
      from: 'Chante-Brise <onboarding@resend.dev>',
      to: OWNER_EMAIL,
      subject: 'Recap semaine du ' + fmt(monday) + ' - Chante-Brise',
      html: '<div style="font-family:Georgia,serif;max-width:500px;padding:32px;background:#F8F3E8;border-radius:12px"><h2 style="color:#2A4A12">Recap de la semaine</h2><p style="color:#7A9A5A">Du ' + fmt(monday) + ' au ' + fmt(sunday) + '</p><p>Bonjour ! Consultez votre calendrier pour les arrivees et departs de la semaine.</p><p style="color:#2A4A12;font-weight:bold">Bonne semaine !</p><p style="font-size:12px;color:#7A9A5A">Chante-Brise - Avenue Damilaville - 76790 Etretat - 06 62 13 62 12</p></div>'
    });
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
