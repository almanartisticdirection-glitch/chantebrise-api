const twilio = require('twilio');

const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_TOKEN = process.env.TWILIO_TOKEN;
const TWILIO_FROM = process.env.TWILIO_FROM;
const OWNER_PHONE = '+33662136212';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { nom, email, tel, chambre, arrivee, depart, personnes, message, montant } = req.body;

  const chambres = { duplex: 'Duplex', exotique: 'Chambre Exotique', bleue: 'Chambre Bleue' };
  const chambreNom = chambres[chambre] || chambre;

  // SMS à la propriétaire
  const smsOwner = `🏡 CHANTE-BRISE - Nouvelle réservation !
Chambre: ${chambreNom}
Client: ${nom}
Tél: ${tel}
Arrivée: ${arrivee}
Départ: ${depart}
Personnes: ${personnes}
Montant: ${montant}€
Email: ${email}`;

  // SMS de confirmation au client
  const smsClient = `Bonjour ${nom} ! Votre réservation à Chante-Brise Étretat est confirmée.
Chambre: ${chambreNom} | Arrivée: ${arrivee} | Départ: ${depart}
À bientôt ! Touria - 06 62 13 62 12`;

  try {
    if (TWILIO_SID && TWILIO_TOKEN && TWILIO_FROM) {
      const client = twilio(TWILIO_SID, TWILIO_TOKEN);
      // SMS propriétaire
      await client.messages.create({
        body: smsOwner, from: TWILIO_FROM, to: OWNER_PHONE
      });
      // SMS client si numéro fourni
      if (tel && tel.length > 8) {
        const telFormate = tel.startsWith('0') ? '+33' + tel.slice(1) : tel;
        await client.messages.create({
          body: smsClient, from: TWILIO_FROM, to: telFormate
        });
      }
    }
    res.status(200).json({ success: true, message: 'Notifications envoyées' });
  } catch (e) {
    console.error('SMS error:', e.message);
    res.status(500).json({ error: e.message });
  }
};
