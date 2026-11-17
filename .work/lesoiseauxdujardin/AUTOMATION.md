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
