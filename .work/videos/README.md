# Vidéos YouTube de la chaîne Jeremstyke (CVLibre et Hoplien)

Règles fixées par Jeremy (28 nov 2026) :
- Chaîne YouTube « Jeremstyke » (Tech), publiée via le connecteur **Buffer** (organisation « My organization », chaîne YouTube « Jeremstyke », id 6b0a93758541f09ecbd081b6).
- Seulement **CVLibre et Hoplien** sur cette chaîne. Qui offre à qui garde SA chaîne, via Metricool : ne jamais publier Qui offre à qui ici.
- **3 vidéos par semaine maximum** (limite Buffer gratuite selon Jeremy) : lundi, mercredi, vendredi à 12h30 (Europe/Paris). Alterner CVLibre et Hoplien.
- Shorts verticaux 1080x1920, 15 à 25 s, en « vous », sans tiret long ni demi-cadratin.
- Les liens ne sont pas cliquables dans les Shorts : écrire « Lien dans la bio de la chaîne » + hoplien.fr/cvlibre (CVLibre) ou hoplien.fr (Hoplien).
- Ne jamais inventer une fonction : ne montrer que ce que le site fait vraiment (capturé en local).

## Fabrication (environ 5 minutes par vidéo)

1. Cloner si besoin : jeremstyke/hoplien (site Hoplien), jeremstyke/cvlibre-site (ou le dépôt CVLibre), jeremstyke/jeremstyke.github.io.
2. Servir les sites en local : `python3 srv.py <dossier_site> <port>` (8766 Hoplien, 8777 CVLibre). srv.py renvoie 404.html pour les chemins inconnus (redirections Hoplien).
3. `capture.py` : captures Playwright en 390x693, échelle 1080/390 (donc 1080x1919). Les appels réseau sont simulés (route) pour ne créer aucun vrai lien. CVLibre : poser `localStorage['cvlibre.cvpass']={u: Date.now()+1e10}` pour masquer le bandeau cookies. Adapter les scènes au sujet de la semaine.
4. `compose.py` : cartes de titre et de fin (Inter Display), légende en haut de chaque capture, recadrage possible (crop) pour zoomer sur une zone.
5. `render.sh` : un fichier par scène (zoom lent, fondu 4 images), concat en `-c copy`, piste audio muette.
6. Vérifier 2 ou 3 images extraites de la vidéo finale avant de publier.
7. Héberger le MP4 dans `videos/` de jeremstyke.github.io (push), attendre 1 minute, vérifier HTTP 200.
8. Buffer `create_post` : type short, categoryId 26, mode customScheduled, dueAt à 12:30:00+01:00 (ou +02:00 en heure d'été), titre avec #shorts, texte + hashtags.
9. Noter la vidéo dans `journal.md`.

## Idées de sujets (cocher dans journal.md une fois faites)
CVLibre : lettre de motivation gratuite, CV adapté à une offre avec l'IA, modèles de CV, CV sans expérience, CV étudiant, CV en anglais (versions UK/US), télécharger son CV en PDF, mail de candidature, lettre de démission, relance après entretien.
Hoplien : QR code gratuit qui n'expire pas, QR code de menu restaurant, QR code avis Google, lien WhatsApp direct, lien en bio Instagram/TikTok, nom personnalisé pour un lien, suivre les clics, vérifier un lien avant de cliquer, Hoplien dans ChatGPT/Claude (connecteur IA), installer l'appli Hoplien.
