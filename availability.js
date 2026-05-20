const ical = require('node-ical');

const ICAL_LINKS = {
  duplex: [
    'https://ical.booking.com/v1/export?t=b41c71ac-a607-49a6-b9b8-f0802eea4afc',
    'https://www.airbnb.fr/calendar/ical/1577704383573676820.ics?t=60d72ccc3899473a9e2e467ec5c5aa44'
  ],
  exotique: [
    'https://ical.booking.com/v1/export?t=bfc24e42-f847-4096-b3eb-0ce05eea132d',
    'https://www.airbnb.fr/calendar/ical/1577682619862019920.ics?t=7907dfe5c22544ec93fa1538de8cea98'
  ],
  bleue: [
    'https://ical.booking.com/v1/export?t=c2f06313-dd42-4fea-9116-8ea5120fc61e',
    'https://www.airbnb.fr/calendar/ical/1564825358361348976.ics?t=44fbdc9d67c94b069cc598a64a6688b9'
  ]
};

async function getBlockedDates(room) {
  const links = ICAL_LINKS[room] || [];
  const blocked = new Set();
  for (const url of links) {
    try {
      const events = await ical.async.fromURL(url);
      for (const key in events) {
        const ev = events[key];
        if (ev.type !== 'VEVENT') continue;
        const start = new Date(ev.start);
        const end = new Date(ev.end);
        const cur = new Date(start);
        while (cur < end) {
          blocked.add(cur.toISOString().split('T')[0]);
          cur.setDate(cur.getDate() + 1);
        }
      }
    } catch (e) {
      console.error('iCal error:', e.message);
    }
  }
  return Array.from(blocked).sort();
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const room = req.query.room || 'duplex';
  try {
    const blocked = await getBlockedDates(room);
    res.status(200).json({ room, blocked, updated: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
