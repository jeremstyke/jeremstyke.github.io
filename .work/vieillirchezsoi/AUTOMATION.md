IMPORTANT : le site est en ligne sur https://vieillir-chez-soi.fr. Il est construit automatiquement (toutes les heures) dans le dépôt jeremstyke/viellirchezsoi à partir des sources de ce dossier. Le build lancé ici écrit seulement des renvois dans vieillirchezsoi/ (ancienne adresse) : c'est normal.

# Vieillir chez soi : article automatique tous les 2 jours

Sources : `.work/vieillirchezsoi/` dans le dépôt jeremstyke/jeremstyke.github.io. Le site généré est dans `vieillirchezsoi/` (publié sur https://jeremstyke.github.io/vieillirchezsoi/ en attendant un domaine).

1. Prendre le premier sujet non coché dans `.work/vieillirchezsoi/sujets.md`.
2. Écrire l'article dans `.work/vieillirchezsoi/src/auto_articles.py` avec `g(...)` (même format que `src/content.py`, avec `cat=`) et ajouter `AUTO_META[slug] = (emoji, teinte)`.
3. `python3 .work/vieillirchezsoi/src/build.py` (aucun tiret long autorisé).
4. Cocher le sujet `[x]`.
5. Commit + push sur `main` (ne toucher à rien d'autre dans le dépôt).

Règles d'écriture : VOUVOIEMENT (lecteurs seniors et leurs proches), français simple, jamais de tiret long, 900 à 1 300 mots, un tableau comparatif, FAQ de 2 ou 3 questions, `{CTA}` après l'introduction, liens internes vers 2 ou 3 guides existants (`{R}slug/`) et vers `{R}amenager-logement-personne-agee/` (guide pièce par pièce ; l ancien `{R}checklist/` est redirigé automatiquement).
Liens Amazon : uniquement `{AMZ:mots clés}` sous la forme `<a href="{AMZ:...}" """ + A + """>Voir les ...</a>` comme dans content.py, 4 à 8 par article, un par type de produit. Tracking ID : viellirchezsoi-21 (déjà dans build.py).
Aucun chiffre, prix, norme, remboursement ou aide inventé : vérifier par une recherche web (sources officielles : ameli.fr, service-public.fr, france-renov.gouv.fr, arcep.fr), sinon rester général. Ne citer une marque ou un modèle que si un fait précis est vérifié.
Santé : conseils généraux uniquement, renvoyer vers le médecin, l'ergothérapeute, le pharmacien ou le kinésithérapeute.
Ton : bienveillant, jamais infantilisant pour les seniors.

Note : build.py met à jour .work/vieillirchezsoi/src/dates.json (date de publication de chaque guide) et génère vieillirchezsoi/og/<slug>.png : ces fichiers doivent être commités avec l'article.
Le PDF vieillirchezsoi/assets/guide-amenager-logement.pdf est généré par src/make_pdf.js (à relancer seulement si le guide pilier change, pas pour un article).

Easwe : AUCUN lien ni mention d'Easwe pour l'instant (partenariat suspendu par Jeremy). Seulement des liens Amazon.

Liens vers le site frère « Les oiseaux du jardin » (décidé par Jeremy le 16 nov 2026) : quand c'est vraiment pertinent pour le lecteur, et seulement là, ajoute dans le texte 1 lien naturel vers une page de https://lesoiseauxdujardin.fr/<slug>/ (liste des pages : les g("slug/" de .work/lesoiseauxdujardin/src/auto_articles.py et content.py). Exemples pertinents : idées de cadeaux pour une personne âgée (mangeoire connectée, nichoir avec caméra, jumelles), activités et lien social à la maison, rester actif au jardin, sortir sur son balcon. Jamais forcé, jamais plus d'un lien par page, et rien dans les pages purement santé ou salle de bain.

Audible (décidé par Jeremy le 16 nov 2026, prime de 10 € par essai gratuit via le Club Partenaires) : sur les pages où c'est vraiment utile (lecture, vue qui baisse, gros caractères, loupe, casque, tablette, cadeaux, aidants, solitude, loisirs), ajoute UN lien vers l'essai gratuit : `<a href="{AUDIBLE}" """ + A + """>Essayer Audible gratuitement</a>`. Pour un livre audio précis : `{AUDIBLE:ASIN}` (ASIN à 10 caractères lu sur la page Amazon du livre audio, jamais inventé). Faits autorisés sans recherche : essai gratuit de 30 jours, un livre audio offert, résiliable à tout moment, livre conservé après résiliation. Ne cite aucun prix d'abonnement sans l'avoir vérifié sur audible.fr. Jamais plus d'un lien Audible par page, rien dans les pages salle de bain, sécurité ou santé pure.

Pages Retraite (décidé par Jeremy le 17 nov 2026, cat="Retraite") : pages d'information pour attirer du trafic. Les règles de retraite changent souvent : chaque âge, taux, montant, plafond ou date doit être lu sur une source officielle (info-retraite.fr, lassuranceretraite.fr, agirc-arrco.fr, service-public.fr, impots.gouv.fr) et la page indique « Informations vérifiées le <date> sur <source> ». Aucune prévision sur une réforme à venir, aucun conseil financier personnalisé : renvoyer vers le simulateur officiel et la caisse de retraite. Liens Amazon seulement s'ils sont utiles (rares sur ces pages) ; mettre surtout 2 ou 3 liens internes vers les guides du site (aides, logement, téléassistance).

Pages mensuelles « date de paiement de la retraite » (décidé par Jeremy le 17 nov 2026) : à partir du 15 de chaque mois, si la page date-paiement-retraite-<mois>-<année>/ du mois SUIVANT n'existe pas encore, la tâche du matin (9h13) la publie en priorité à la place de l'article du jour (même format que date-paiement-retraite-decembre-2026/), avec les dates lues sur les calendriers officiels (lassuranceretraite.fr, agirc-arrco.fr, msa.fr). Si le calendrier n'est pas encore publié, attendre le jour suivant. Relier chaque page mensuelle à la précédente et à la page générale.
Pas de techniques douteuses : pas de pages quasi identiques en série (par ville, par exemple), pas de texte caché, pas de faux avis. Seulement de vraies réponses à des questions précises.

Rubrique « Argent et patrimoine » (viager, nue-propriété, donation, protection juridique, mutuelle ; décidé le 17 nov 2026) : informations générales seulement, chaque règle ou montant lu sur une source officielle (service-public.fr, notaires.fr, justice.fr, impots.gouv.fr, ameli.fr) avec la date de vérification ; jamais de conseil personnalisé ni de recommandation d'acheter ou de vendre ; toujours renvoyer vers un notaire, un conseiller ou l'organisme concerné. Associations : ne décrire que ce qui est lu sur leur site officiel.

Réapprovisionnement automatique des listes (décidé le 17 nov 2026, pour ne jamais tomber à court) : au début de chaque publication, si sujets.md a moins de 15 lignes « - [ ] », ajoute à la fin 20 nouveaux sujets au même format (slug/ | requête visée | catégorie | angle) ; si tops.md a moins de 6 lignes « - [ ] », ajoute à la fin 10 nouveaux tops de produits réellement vendus sur Amazon.fr, de préférence chers et à forte intention d'achat. Choisis des questions précises que se posent les seniors et leurs proches, réparties sur toutes les rubriques du site (matériel, aides, retraite, argent et patrimoine, logement, associations, santé du quotidien, vie quotidienne), en évitant tout doublon avec les slugs déjà publiés ou déjà en liste. Commite ces ajouts avec la publication.

Liens internes et externes (décidé le 17 nov 2026), à chaque publication :
- Maillage interne : après avoir écrit une nouvelle page, ajoute 1 à 3 liens vers elle DEPUIS des pages existantes du même thème (dans src/auto_articles.py ou src/content.py), placés naturellement dans une phrase existante ou une courte phrase ajoutée, avec une ancre descriptive (pas « cliquez ici »). Jamais plus d'un nouveau lien ajouté par ancienne page et par publication, jamais de lien dans un titre.
- Sources : chaque page qui cite une règle, un montant, une date ou une aide se termine (avant la FAQ) par <p class="sources"><strong>Sources</strong> : <a href="URL officielle" target="_blank" rel="noopener">Nom du site, titre de la page</a>, ... (vérifié le JJ mois AAAA)</p>, avec 1 à 3 liens vers les pages officielles réellement consultées (service-public.fr, ameli.fr, info-retraite.fr, lassuranceretraite.fr, impots.gouv.fr, anah.gouv.fr, notaires.fr, justice.fr, pour-les-personnes-agees.gouv.fr, LPO...). Jamais de lien vers un concurrent commercial.

## Programmes Awin (Verisure, ManoMano, Domaliance) - règle stricte
- Candidatures envoyées le 16 nov 2026, en attente d'acceptation. Tant que Jeremy n'a pas fourni un lien de suivi Awin, n'insérer AUCUN lien Awin et ne pas citer ces marques comme partenaires.
- ManoMano et Domaliance : une fois le lien fourni par Jeremy, utilisables directement.
- Verisure : JAMAIS de publication automatique d'un contenu qui mentionne Verisure avec un lien affilié. Préparer la page ou le paragraphe en brouillon (hors sitemap, non publié), puis prévenir Jeremy pour qu'il demande la validation du contenu à Verisure via Awin. Publier seulement après son feu vert explicite.
- Verisure et Sector Alarm : SEM et achat de mots-clés de marque interdits.

## SEO renforcé (17 nov 2026)
- Auteur : les articles sont signés Jérémy Dacier-Jury (byline + schema Person, publisher Organization avec logo). Ne pas retirer.
- Relecture du dimanche : en plus du maillage, ajouter un bloc `<p class="sources">` (2 ou 3 liens officiels réellement pertinents, vérifiés en 200) à 8 anciennes pages qui n'en ont pas, les plus anciennes d'abord, jusqu'à ce que toutes en aient. Mettre à jour la date de la page dans src/dates.json seulement si le contenu a vraiment changé.
- Titres : 60 caractères maximum si possible, mot-clé principal au début, année seulement sur les comparatifs et pages d'aides. Au premier dimanche de janvier, passer les « 2026 » des titres et H1 des comparatifs à « 2027 » après avoir revérifié que les produits sont toujours vendus.
- Chaque nouvelle page : meta description unique de 140 à 160 caractères, une FAQ de 3 à 5 vraies questions, au moins 2 liens internes sortants vers des pages proches.
- Interdits : contenu dupliqué entre pages, bourrage de mots-clés, faux avis, faux tests (« nous avons testé ») quand ce n'est pas vrai.
