# Publication et entretien de tous les sites de Jeremy

Réorganisé le 22 nov 2026 à la demande de Jeremy : une seule source de règles pour toutes les tâches programmées.
Ce fichier est lu par 4 tâches : « Publication : sites affiliés », « Publication : autres sites », « Entretien du samedi », « Entretien du dimanche ».
Les règles détaillées de chaque site restent dans son AUTOMATION.md (ou fichier indiqué) : lis-le TOUJOURS avant de travailler sur le site.

## Règles communes (toutes les tâches)
- Français, tutoie Jeremy dans le message final, sois très concis (il lit sur mobile).
- JAMAIS de tiret long (—) ni demi-cadratin (–), ni dans les fichiers, ni dans les messages.
- Publications seulement du lundi au vendredi, UNE page par site et par jour au maximum. Samedi et dimanche : entretien seulement.
- Si une page échoue, continue avec les autres et signale-le à la fin.
- Avant d'écrire un sujet, vérifie que son slug n'existe pas déjà ; s'il existe, coche la ligne et prends la suivante.
- Aucune requête SQL destructive. Ne dépense jamais d'argent.
- Ne mets jamais « by @jeremstyke » sur AI Football Predictor.

## Planning de la semaine

| Jour | Sites affiliés | Autres sites |
|---|---|---|
| Lundi | Vieillir chez soi : 1 article ; Les oiseaux du jardin : 1 fiche ; Ma liste mariage : 1 top | CVLibre étranger : 1 article ; adresse-temporaire.fr : 1 guide ; jetboxmail.com : 1 guide |
| Mardi | Ma liste bébé : 1 article | CVLibre français : 1 page métier ; PDF Démarches : 1 guide ; jetboxmail.com : 1 guide |
| Mercredi | Vieillir chez soi : 1 top ; Les oiseaux du jardin : 1 top | CVLibre étranger : 1 article ; adresse-temporaire.fr : 1 guide ; jetboxmail.com : 1 guide |
| Jeudi | Vieillir chez soi : 1 article ; Ma liste mariage : 1 article | CVLibre français : 1 article ; PDF Démarches : 1 guide ; jetboxmail.com : 1 guide |
| Vendredi | Les oiseaux du jardin : 1 fiche ; Ma liste bébé : 1 top | CVLibre étranger : 1 article ; adresse-temporaire.fr : 1 guide ; jetboxmail.com : 1 guide |

Jour : `TZ=Europe/Paris date +%u` (1 = lundi ... 5 = vendredi).

## Écriture humaine (toutes les pages)
Écris comme un connaisseur qui parle à un proche. Réponds à la question dès les 2 premières phrases, jamais « Dans cet article, nous allons voir ». Phrases de longueurs variées, mots simples, ton chaleureux. Bannis : « il est important de noter », « en conclusion », « en résumé », « plongeons », « que vous soyez… ou… », « n'hésitez pas à », « véritable », « incontournable », « allié idéal », « un must », « crucial » ou « essentiel » à répétition, les intertitres génériques. Sois concret (exemples présentés comme des exemples, erreurs fréquentes, avis clair avec sa raison). Jamais d'expérience inventée, de « testé », de faux avis, de prix ou de chiffre inventé. Varie la structure d'une page à l'autre. Relis chaque page en entier avant de publier.

## Tops produits (tous les sites affiliés)
Produits RÉELS vendus en France, vérifiés par une recherche limitée à amazon.fr ; caractéristiques lues sur la page du fabricant ou d'un grand revendeur, « non précisé » sinon ; aucun prix, note, avis ni « testé ». Minimum 6 produits (titre adapté s'il y en a moins de 10). Structure des tops existants : intro, {CTA}, note « Comment nous avons fait cette sélection : à partir des fiches publiées par les fabricants et les revendeurs, sans test en main », tableau récapitulatif, une h2 par produit (pour qui, points forts, limites, lien {AMZ:Marque Modèle} « Voir sur Amazon » dans son propre paragraphe), « Comment choisir », FAQ 3 questions. Title avec « 2026 », 65 car. max, 1 500 à 2 500 mots, short « Top 10 ... », AUTO_META (🏆, teinte). Respecte la règle « Angle du site dans chaque top » de AUTOMATION.md.

## Mise en ligne et IndexNow (commun)
- IndexNow, via le connecteur Supabase (projet txvrlvcxfnylnrpdrxtt, execute_sql). D'abord vérifier que la page répond 200 : `select (extensions.http_get('<url>?v=1')).status`. Puis :
  `select extensions.http_set_curlopt('CURLOPT_TIMEOUT','30'); select (extensions.http(('POST','https://api.indexnow.org/indexnow',array[]::extensions.http_header[],'application/json','{"host":"<domaine>","key":"<clé>","keyLocation":"https://<domaine>/<clé>.txt","urlList":["<url>","https://<domaine>/sitemap.xml"]}')::extensions.http_request)).status` (200 ou 202 attendu).
- Clés : da4540821acf4048569bad7fbedc3ee1 pour vieillir-chez-soi.fr, lesoiseauxdujardin.fr, malistebebe.fr, malistedemariage.fr, demarches.cvlibre.com ; 4bb608c76fc94e1fc06e70aa81302ec0 pour cvlibre.com ; 1bd8c8377a47ff093f479d26ad3a5b4d pour jetboxmail.com.
- Dépôts : attache chaque dépôt avec add_repo (owner jeremstyke, access push) avant de cloner. git pull --rebase avant chaque push.

## Procédures par site

### Vieillir chez soi (https://vieillir-chez-soi.fr), vouvoiement
Sources : dépôt jeremstyke/jeremstyke.github.io, dossier .work/vieillirchezsoi/ (AUTOMATION.md, sujets.md, tops.md, src/auto_articles.py, src/content.py). Ne modifie jamais jeremstyke/viellirchezsoi. Identifiant Amazon viellirchezsoi-21.
- Article : premier « - [ ] » de sujets.md (règle des pages mensuelles « date de paiement de la retraite » de AUTOMATION.md : le lundi, elle remplace l'article si elle s'applique). 2 à 4 recherches sur sources officielles. g(slug, title, h1, desc, body, faq, short, cat) : 900 à 1 300 mots, intro puis {CTA}, plusieurs h2, un tableau, FAQ, 2 ou 3 liens internes et {R}amenager-logement-personne-agee/, liens Amazon <a href="{AMZ:mots clés}" """ + A + """> (4 à 8 pour un article produit, 0 à 3 pour une page aides ou retraite). Santé : renvoi vers un professionnel. Aucune mention d'Easwe.
- Top : premier « - [ ] » de tops.md (voir « Tops produits »).
- Build : `python3 .work/vieillirchezsoi/src/build.py`, supprime src/__pycache__, commite aussi src/dates.json et vieillirchezsoi/og/. Commit « Vieillir chez soi : <titre> », push.
- Mise en ligne : `gh api -X POST repos/jeremstyke/viellirchezsoi/actions/workflows/sync.yml/dispatches -f ref=main`, attends 2 minutes, vérifie `gh api "repos/jeremstyke/viellirchezsoi/actions/runs?per_page=2"` (completed success), relance une fois sinon. Puis IndexNow.

### Les oiseaux du jardin (https://lesoiseauxdujardin.fr), vouvoiement
Sources : jeremstyke/jeremstyke.github.io, dossier .work/lesoiseauxdujardin/ (AUTOMATION.md, especes.md, sujets.md, tops.md, src/). Ne modifie jamais jeremstyke/lesoiseauxdujardin.
- Fiche : premier « - [ ] » de especes.md (sinon sujets.md). Faits uniquement depuis LPO, oiseaux.net, INPN/MNHN, Vigie-Nature, OFB. Page d'identification ou fiche espèce selon la ligne (voir pages existantes), cat="Observer", 800 à 1 300 mots, {CTA}, tableau, FAQ 3, liens vers {R}nourrir-les-oiseaux-du-jardin/ ou {R}installer-un-nichoir/ et 2 ou 3 pages existantes, 3 à 6 liens Amazon utiles pour cette espèce et vers les tops existants.
- Top : premier « - [ ] » de tops.md ; quand il reste 3 lignes, ajoute 5 tops de produits réellement vendus et plutôt chers.
- Build : `python3 .work/lesoiseauxdujardin/src/build.py`, supprime src/__pycache__, commite src/, les listes, src/dates.json et og/. Commit, push.
- Mise en ligne : même méthode avec le dépôt jeremstyke/lesoiseauxdujardin, puis IndexNow.

### Ma liste bébé (https://malistebebe.fr), TUTOIEMENT
Dépôt jeremstyke/listedenaissance (AUTOMATION.md, src/sujets.md, src/tops.md, src/auto_articles.py). Liens Amazon <a href="{AMZ:mots clés}" rel="sponsored nofollow noopener" target="_blank">.
- Article : premier « - [ ] » de src/sujets.md, 900 à 1 300 mots, {CTA}, tableau, FAQ, liens internes et {R}checklist/. Santé : renvoi médecin, sage-femme ou pédiatre.
- Top : premier « - [ ] » de src/tops.md, avec aussi {R}checklist/ et {R}liste-de-naissance-amazon/.
- Build : `python3 src/build.py` (vers docs/), vérifie la nouvelle URL dans docs/sitemap.xml, supprime src/__pycache__. Commit, push (GitHub Pages publie tout seul). Attends 2 minutes, puis IndexNow.

### Ma liste mariage (https://malistedemariage.fr), vouvoiement
Dépôt jeremstyke/malistemariage, même fonctionnement que Ma liste bébé (src/sujets.md, src/tops.md, build python3 src/build.py qui refuse les tirets longs). Ne promets jamais de réduction Amazon sur la liste de mariage. Lien {R}checklist/. Top de livres : titre, auteur et éditeur vérifiés.

### CVLibre (https://cvlibre.com), vouvoiement
Dépôt jeremstyke/cvlibre-site. Lis tools/i18n/BLOG.md, tools/i18n/MOTS-CLES.md, et tools/i18n/AMAZON.md (format des liens seulement, identifiant cvlibre-21, aucun top Amazon). Aucun lien vers /pdf/ ou /pdf-demarches-france/. L'encart NordVPN est ajouté par assets/partner.js : ne l'écris pas.
- Français mardi : page CV par métier (slug cv-<metier>, première ligne cv- de MOTS-CLES.md ; modèle blog/cv-aide-soignant/ et blog/cv-cariste/ ; titre et accroches types, compétences, exemple d'expérience, diplômes vérifiés sur onisep.fr, francetravail.fr ou service-public.fr, erreurs, lien vers /creer-un-cv/). S'il reste moins de 10 métiers, ajoute-en 30.
- Français jeudi : première ligne de MOTS-CLES.md qui n'est pas une page métier. Groupe « résiliation » : faits lus sur le site officiel du service seulement.
- Étranger lundi, mercredi, vendredi : 1 article sur la version (en, us, ca, au, nz, de) dont le dernier article est le plus ancien (tools/i18n/ROTATION-ETRANGER.md, à tenir à jour). Sur la semaine, au moins 2 des 3 sont des pages métier du pays (vocabulaire et sources officielles du pays). Jamais de traduction d'une autre version.
- 900 à 1 400 mots, tableau ou liste, FAQ 3, lien vers l'outil CVLibre utile, 2 ou 3 liens internes + 1 lien ajouté depuis un article existant. Suis BLOG.md (page, carte d'index, sitemap, hreflang). Build `sh tools/i18n/build_all.sh` (« RESTE » ne doit apparaître pour aucune page). Commit, push, attends 2 minutes, IndexNow (host cvlibre.com).

### PDF Démarches France (https://demarches.cvlibre.com), vouvoiement
Sources : jeremstyke/jeremstyke.github.io, dossier .work/demarches/site/ (pages HTML écrites à la main). Ne modifie jamais jeremstyke/demarches.
- Guide : premier « - [ ] » de .work/demarches/guides-sujets.md (règles en tête). Copie la structure d'un guide existant (ex. guides/pdf-trop-lourd/), infos lues sur le site officiel de l'organisme ou service-public.fr avec « Vérifié le <date> » et les liens, 800 à 1 200 mots, FAQ 3, liens vers la page de l'organisme et l'outil utile du site. Carte en tête de guides/index.html, ligne dans sitemap.xml, lien depuis une page proche. L'encart NordVPN est ajouté par assets/track.js : ne l'écris pas.
- Commit, push, mise en ligne via `gh api -X POST repos/jeremstyke/demarches/actions/workflows/sync.yml/dispatches -f ref=main` (vérifie le run), puis IndexNow.

### adresse-temporaire.fr (français), vouvoiement
Dépôt jeremstyke/adresse-temporaire. articles.py (liste ARTICLES, règle de longueur en tête) ; n'écris pas dans extra.py ; l'encart NordVPN est ajouté par build.py.
- 1 guide : une vraie recherche autour du mail jetable ou de la vie privée en ligne, jamais en doublon (Ubersuggest, fr, locId 2250, si quota). Sujets INTERDITS : contourner un bannissement, faux comptes en masse, « indétectable », plateformes précises, piratage, envoi anonyme. 900 à 1 200 mots, FAQ en h2 avec 2 ou 3 h3, 2 liens internes /blog/<slug>/ et un lien vers /. Offres exactes : sans compte messages 1 h ; compte gratuit 1 adresse réservée, messages 24 h ; Premium 2,99 €/mois : 100 adresses privées, transfert ou alerte (30 par jour), pièces jointes 10 Mo, messages 30 jours.
- `python3 build.py`, supprime __pycache__, commit « Blog : <titre> », `git -c push.negotiate=true push`. Vérifie la page au bout de 2 minutes.

### jetboxmail.com (anglais)
Même dépôt jeremstyke/adresse-temporaire. Prends la première ligne « - [ ] » de KEYWORDS-EN.md, écris le guide dans guides_en.py en suivant exactement les règles et faits de son en-tête (900 à 1 300 mots, anglais américain, h2 en vraies questions, FAQ 3 en h3, 1 ou 2 liens internes + 1 lien ajouté depuis un guide existant). Coche la ligne, `python3 build.py` (doit afficher ok), commit « Guide anglais : <titre> », push. Vérifie https://jetboxmail.com/guides/<slug>/ puis IndexNow (host jetboxmail.com). S'il reste moins de 3 sujets, ajoutes-en 10 (Ubersuggest, locId 2840, en).
Les jours où adresse-temporaire.fr et jetboxmail.com publient tous les deux, fais-les l'un après l'autre avec un seul build et un seul push.

## Entretien du samedi
1. Listes de sujets des 4 sites affiliés (sujets.md, tops.md, especes.md) : s'il reste moins de 12 lignes « - [ ] », ajoute 15 vraies requêtes dans l'angle du site (Search Console via le connecteur Windsor.ai, connecteur searchconsole, 28 jours ; Ubersuggest), sans doublon, priorité aux requêtes de saison.
2. Maillage interne des 6 sites (4 affiliés, CVLibre français, PDF Démarches) : 3 à 5 liens internes utiles par site vers les pages orphelines et les tops, 2 au maximum par page, ancres descriptives ; répare les liens internes cassés.
3. Relecture des pages publiées cette semaine sur Ma liste bébé et Ma liste mariage : faits vérifiés, produits toujours vendus, angle des tops, phrases creuses réécrites, SEO (title 65 car., desc 150 à 160).
Puis build de chaque site touché, commit, push, mise en ligne (sync.yml pour Vieillir, Oiseaux, Démarches), IndexNow des pages modifiées. Message : une ligne par site.

## Entretien du dimanche
1. Relecture des pages publiées cette semaine sur Vieillir chez soi et Les oiseaux du jardin (5 pages au hasard par site) : faits sur les sources officielles (ou LPO pour les oiseaux), 3 produits vérifiés par top, bloc Sources, phrases creuses réécrites ; journal dans relecture.md du dossier.
2. Remise à niveau des anciennes pages des 4 sites affiliés : 3 pages par site au maximum, publiées il y a plus de 3 semaines, en commençant par les tops et celles qui ont des impressions sans clics (Search Console via Windsor.ai) ; produits arrêtés remplacés, faits revérifiés, angle du site ajouté aux tops ; trace dans REFRESH.md du dossier (une page n'est pas reprise avant 3 mois). Aucune nouvelle page.
Puis build, commit, push, mise en ligne, IndexNow. Message : une ligne par site.
