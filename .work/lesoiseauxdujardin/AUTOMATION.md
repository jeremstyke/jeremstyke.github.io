# Les oiseaux du jardin (https://lesoiseauxdujardin.fr)

Sources : .work/lesoiseauxdujardin/ dans jeremstyke/jeremstyke.github.io. Le site est construit automatiquement (toutes les heures) dans le dépôt jeremstyke/lesoiseauxdujardin par GitHub Actions. Ne pas écrire dans ce dépôt-là.
Ici, `python3 .work/lesoiseauxdujardin/src/build.py` génère docs/ (ignoré par git) pour vérifier, met à jour src/dates.json et crée les images og/<slug>.png : commite dates.json et og/.

Chaque jour : 1 article (premier « - [ ] » de sujets.md) et 1 top 10 (premier « - [ ] » de tops.md), à ajouter à src/auto_articles.py au format g(...) avec cat= (Nourrir, Mangeoires, Nichoirs, Observer) et AUTO_META (teintes mousse, ciel, sable, rouge, lilas).
Règles : VOUVOIEMENT, jamais de tiret long, intro puis {CTA}, plusieurs <h2>, un <table>, FAQ 3 questions, lien vers le pilier {R}nourrir-les-oiseaux-du-jardin/ et 2 ou 3 autres guides. Liens Amazon uniquement <a href="{AMZ:mots clés}" """ + A + """>Voir sur Amazon</a> (tag lesoiseauxdujardin-21 ajouté par build.py).
Conseils nature : uniquement ce qui est lu sur des sources sérieuses (LPO nationale et régionales, protectiondesoiseaux.be, Natagora, Vigie-Nature, OFB) ; signaler les divergences. Tops 10 : produits réels, caractéristiques lues sur le fabricant ou un grand revendeur, aucun prix, note ni « testé », « non précisé » si une donnée manque, encadré « Comment nous avons fait cette sélection ».

Liens vers le site frère « Vieillir chez soi » (décidé par Jeremy le 16 nov 2026) : quand c'est vraiment pertinent pour le lecteur, et seulement là, ajoute dans le texte 1 lien naturel vers une page de https://vieillir-chez-soi.fr/<slug>/ (liste des pages : les g("slug/" de .work/vieillirchezsoi/src/auto_articles.py et content.py). Exemples pertinents : offrir une mangeoire ou un nichoir avec caméra à un parent âgé (lien vers cadeau-personne-agee/), observer les oiseaux quand on se déplace moins, installer une mangeoire visible depuis la fenêtre pour une personne qui sort peu, guides en gros caractères. Jamais forcé, jamais plus d'un lien par page.

Guide PDF (16 nov 2026) : .work/lesoiseauxdujardin/assets/guide-nourrir-oiseaux.pdf, proposé contre e-mail sur l accueil et le pilier (table Supabase vcs_leads, source oiseaux-accueil ou oiseaux-pilier). Généré par src/make_pdf.js à partir du pilier : à relancer seulement si le pilier change.

Rythme quotidien et réapprovisionnement (décidé par Jeremy le 17 nov 2026) : le site publie chaque jour 2 fiches espèces ou pages d'identification et 1 top. Au début de chaque publication : si especes.md a moins de 10 lignes « - [ ] », ajoute à la fin 20 nouveaux sujets d'identification ou fiches espèces d'oiseaux présents dans les jardins en France (et questions fréquentes : chants, nids, comportement, saisons), sans doublon avec les slugs publiés ou en liste ; si tops.md a moins de 4 lignes « - [ ] », ajoute 8 nouveaux tops de produits réellement vendus sur Amazon.fr (de préférence chers : nichoirs avec caméra, mangeoires connectées, jumelles, longues-vues, abris). Mise en ligne immédiate (sync.yml) OBLIGATOIRE à chaque publication, ne jamais terminer sans.

Liens internes et sources (décidé le 17 nov 2026), à chaque publication :
- Maillage interne : après avoir écrit une nouvelle page, ajoute 1 à 3 liens vers elle DEPUIS des pages existantes proches (espèces qu'on confond, même famille, même mangeoire ou nichoir, top lié), dans une phrase naturelle avec une ancre descriptive. Jamais plus d'un nouveau lien par ancienne page et par publication.
- Sources : chaque fiche espèce ou page d'identification se termine (avant la FAQ) par <p class="sources"><strong>Sources</strong> : <a href="URL" target="_blank" rel="noopener">LPO, oiseaux.net ou INPN : titre de la page</a> (vérifié le JJ mois AAAA)</p>, avec 1 à 3 pages réellement consultées.

## SEO renforcé (17 nov 2026)
- Auteur : les articles sont signés Jérémy Dacier-Jury (byline + schema Person, publisher Organization avec logo). Ne pas retirer.
- Relecture du dimanche : en plus du maillage, ajouter un bloc `<p class="sources">` (2 ou 3 liens officiels réellement pertinents, vérifiés en 200) à 8 anciennes pages qui n'en ont pas, les plus anciennes d'abord, jusqu'à ce que toutes en aient. Mettre à jour la date de la page dans src/dates.json seulement si le contenu a vraiment changé.
- Titres : 60 caractères maximum si possible, mot-clé principal au début, année seulement sur les comparatifs et pages d'aides. Au premier dimanche de janvier, passer les « 2026 » des titres et H1 des comparatifs à « 2027 » après avoir revérifié que les produits sont toujours vendus.
- Chaque nouvelle page : meta description unique de 140 à 160 caractères, une FAQ de 3 à 5 vraies questions, au moins 2 liens internes sortants vers des pages proches.
- Interdits : contenu dupliqué entre pages, bourrage de mots-clés, faux avis, faux tests (« nous avons testé ») quand ce n'est pas vrai.

## Liens entre les 4 sites (17 nov 2026)
- Les 4 sites (Vieillir chez soi, Les oiseaux du jardin, Ma liste bébé, Ma liste mariage) se citent dans le pied de page.
- Dans le texte : au maximum 1 lien vers un site frère par page, seulement quand c'est vraiment utile au lecteur (ex. mangeoire de fenêtre -> cadeau personne âgée ; cadeau personne âgée -> cadeau passionné d'oiseaux ; mariage avec bébé en route -> liste de naissance). Jamais de lien forcé, jamais d'ancre bourrée de mots-clés.

## Rythme renforcé jusqu'à Noël (17 nov 2026)
- Du 18 novembre au 31 décembre 2026 : une 2e publication à 10h37 (1 guide de sujets.md + 1 top), en plus de celle de 15h47. Retour à 3 pages par jour à partir du 1er janvier 2027.
- En novembre et décembre, priorité aux pages d'hiver et de Noël (cadeaux, nourrissage d'hiver, mangeoires, caméras, jumelles).

## Qui publie (17 nov 2026)
- Toutes les publications de ce site sont faites UNIQUEMENT par les tâches programmées créées depuis la conversation de Jeremy dédiée aux 4 sites affiliés (Vieillir chez soi, Les oiseaux du jardin, Ma liste bébé, Ma liste mariage). Toute autre session ou conversation ne doit ni publier de page, ni créer, modifier ou dupliquer une tâche de publication pour ce site : elle signale le besoin à Jeremy et s'arrête.

## Exploiter les failles des concurrents (règle du 18 nov 2026, obligatoire pour chaque nouvelle page)
Avant d'écrire une page, cherche sa requête principale sur le web et ouvre les 3 premiers résultats (hors Amazon et marchands). Note ce qui leur manque, puis fais-le mieux :
- page datée (ancienne année dans le titre, produits plus vendus) : produits actuels et année en cours ;
- page mince ou trop courte : réponds à toutes les vraies questions du lecteur (FAQ, cas particuliers, erreurs fréquentes) ;
- pas de tableau comparatif : mets-en un dès le haut de la page ;
- peu de produits ou un seul budget : couvre petit budget, milieu de gamme et haut de gamme ;
- critères vagues : critères de choix concrets et vérifiés (dimensions, matériaux, entretien, sécurité) ;
- liens d'achat tardifs : premier lien utile dès l'introduction, après {CTA} ;
- angle oublié (situation précise, saison, petit logement, aide financière, entretien) : traite-le dans une section dédiée.
Ne copie jamais leurs phrases ni leur structure. N'invente rien pour paraître plus complet : chaque ajout reste vérifié comme le reste de la page.

## Mots clés longue traîne (règle du 18 nov 2026, obligatoire pour chaque nouvelle page)
Le site est jeune : il gagne d'abord sur des requêtes précises de 4 mots et plus, peu disputées par les gros sites.
- Choisis pour chaque page une requête principale longue traîne (ex. « siège de douche pliable petite douche » plutôt que « siège de douche »), mets-la dans le title, le h1, le premier paragraphe et le slug d'une nouvelle page.
- Repère 5 à 10 variantes et questions voisines (suggestions de recherche, « Autres questions posées », forums) et traite-les dans les intertitres et la FAQ, formulées comme les gens les tapent.
- Une page par intention : n'écris pas deux pages qui visent la même requête ; complète plutôt la page existante.
- Quand une liste de sujets ou de tops se réapprovisionne, privilégie les requêtes longue traîne à intention d'achat (meilleur, pour qui, pour quel usage, comparatif, avis, petit budget).

## Angle du site dans chaque top (règle du 19 nov 2026, obligatoire pour chaque top)
- Un top de Les oiseaux du jardin ne vise jamais la requête générique seule (« meilleur X ») face aux grands comparateurs : il vise la requête liée au sujet du site, les oiseaux du jardin (les nourrir, les loger, les observer). Exemples : « meilleur abreuvoir pour oiseaux du jardin ».
- Le title, le h1, la description et la première phrase annoncent cet angle.
- Juste après l'encadré « Comment nous avons fait cette sélection », une section <h2> du type « Pourquoi cet abreuvoir convient aux oiseaux du jardin ? » explique en quoi le produit sert vraiment les oiseaux du jardin et quelles espèces il attire ou aide (avec liens vers leurs fiches). 2 paragraphes concrets, un avis clair (« Notre conseil : ... »), aucun fait inventé.
- La FAQ contient une question sur cet angle, par exemple « Quels oiseaux viennent à un abreuvoir ? ».
- Chaque fiche produit dit aussi, en une phrase, pour quel lecteur ce produit est le bon choix.
- Avant de prendre une ligne de tops.md : si sa requête est générique, réécris-la avec l'angle du site (slug compris si la page n'existe pas encore) ; si le produit n'a vraiment aucun lien avec le sujet du site, coche-la « abandonné, hors sujet » et prends la suivante.

## Bouton « Voir le prix sur Amazon » (demande de Jeremy du 22 nov 2026)
- Dans chaque top (page avec l'encadré « Comment nous avons fait cette sélection »), build.py ajoute automatiquement, juste sous l'intertitre de chaque produit numéroté (« N. Modèle »), un bouton « Voir le prix sur Amazon » qui reprend le lien {AMZ:...} de la fiche.
- Ne l'écris jamais à la main. Il faut seulement que chaque fiche produit ait un h2 « N. Modèle » et, avant l'intertitre suivant, le lien habituel <a href="{AMZ:Marque Modèle}" """ + A + """>Voir sur Amazon</a>.
- Le site n'affiche toujours aucun prix : le bouton renvoie vers Amazon.

Audible (décidé par Jeremy le 23 nov 2026, prime de 10 € par essai gratuit via le Club Partenaires) : seulement sur les pages où c'est vraiment utile (livres sur les oiseaux et la nature, activités avec enfants, cadeaux pour amoureux des oiseaux, chants d'oiseaux), ajoute UN lien vers l'essai gratuit : `<a href="{AUDIBLE}" rel="sponsored nofollow noopener" target="_blank">Essayer Audible gratuitement</a>` (le tag du site est ajouté par build.py). Pour un livre audio précis : `{AUDIBLE:ASIN}` (ASIN à 10 caractères lu sur la page Amazon du livre audio, jamais inventé). Faits autorisés sans recherche : essai gratuit, un livre audio offert, résiliable à tout moment, livre conservé après résiliation. Ne cite ni durée d'essai ni prix d'abonnement sans l'avoir vérifié sur audible.fr le jour même (les offres changent). Jamais plus d'un lien Audible par page, jamais forcé.
