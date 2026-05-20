# Chante-Brise API

## Variables d'environnement à configurer sur Vercel

- TWILIO_SID : ton Account SID Twilio
- TWILIO_TOKEN : ton Auth Token Twilio  
- TWILIO_FROM : ton numéro Twilio (ex: +33xxxxxxxxx)
- CRON_SECRET : un mot de passe que tu inventes

## Endpoints

- GET /api/availability?room=duplex → dates bloquées du Duplex
- GET /api/availability?room=exotique → dates bloquées Chambre Exotique
- GET /api/availability?room=bleue → dates bloquées Chambre Bleue
- POST /api/notify → envoie SMS propriétaire + client
- GET /api/weekly-recap → récap dimanche (appelé automatiquement)

## Déploiement

1. Crée un repo GitHub "chantebrise-api"
2. Push ces fichiers
3. Connecte sur vercel.com
4. Ajoute les variables d'environnement
5. Deploy !
