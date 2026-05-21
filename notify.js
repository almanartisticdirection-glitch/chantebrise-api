const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'touriafadi@yahoo.fr';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { nom, email, tel, chambre, arrivee, depart, personnes, montant } = req.body;
  const chambres = { duplex: 'Duplex', exotique: 'Chambre Exotique', bleue: 'Chambre Bleue' };
  const chambreNom = chambres[chambre] || chambre;

  try {
    await resend.emails.send({
      from: 'Chante-Brise <onboarding@resend.dev>',
      to: OWNER_EMAIL,
      subject: `🏡 Nouvelle réservation — ${chambreNom}`,
      html: `<div style="font-family:Georgia,serif;max-width:500px;margin:0 auto;padding:32px;background:#F8F3E8;border-radius:12px"><h2 style="color:#2A4A12">Nouvelle réservation — ${chambreNom}</h2><p><b>Client:</b> ${nom}</p><p><b>Email:</b> ${email}</p><p><b>Tél:</b> ${tel}</p><p><b>Arrivée:</b> ${arrivee}</p><p><b>Départ:</b> ${depart}</p><p><b>Personnes:</b> ${personnes}</p><p><b>Montant:</b> ${montant}</p></div>`
    });

    if (email) {
      await resend.emails.send({
        from: 'Chante-Brise <onboarding@resend.dev>',
        to: email,
        subject: `Votre réservation à Chante-Brise est confirmée ✓`,
        html: `<div style="font-family:Georgia,serif;max-width:500px;margin:0 auto;padding:32px;background:#F8F3E8;border-radius:12px"><h2 style="color:#2A4A12">Réservation confirmée</h2><p>Bonjour ${nom},</p><p>Votre réservation est confirmée !</p><p><b>Chambre:</b> ${chambreNom}</p><p><b>Arrivée:</b> ${arrivee} dès 15h00</p><p><b>Départ:</b> ${depart} avant 11h00</p><p>Contact: Touria — 06 62 13 62 12</p></div>`
      });
    }

    res.status(200).json({ success: true });
  } catch (e) {
    console.error('Email error:', e);
    res.status(500).json({ error: e.message });
  }
};
