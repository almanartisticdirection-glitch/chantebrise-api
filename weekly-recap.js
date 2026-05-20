// Appelé chaque dimanche via Vercel Cron
const twilio = require('twilio');

const OWNER_PHONE = '+33662136212';

module.exports = async (req, res) => {
  // Vérification sécurité cron
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Ici on lirait les réservations de la semaine depuis la BDD
  // Pour l'instant on envoie un rappel simple
  const recap = `📅 RÉCAP SEMAINE - Chante-Brise
Dimanche ${new Date().toLocaleDateString('fr-FR')}

Consultez votre calendrier pour les arrivées de la semaine.
Pensez à préparer les chambres reservées !

Bonne semaine Touria 🌸`;

  try {
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    await client.messages.create({
      body: recap,
      from: process.env.TWILIO_FROM,
      to: OWNER_PHONE
    });
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
