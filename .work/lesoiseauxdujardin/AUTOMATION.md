# Les oiseaux du jardin (https://lesoiseauxdujardin.fr)

Sources : .work/lesoiseauxdujardin/ dans jeremstyke/jeremstyke.github.io. Le site est construit automatiquement (toutes les heures) dans le dépôt jeremstyke/lesoiseauxdujardin par GitHub Actions. Ne pas écrire dans ce dépôt-là.
Ici, `python3 .work/lesoiseauxdujardin/src/build.py` génère docs/ (ignoré par git) pour vérifier, met à jour src/dates.json et crée les images og/<slug>.png : commite dates.json et og/.

Chaque jour : 1 article (premier « - [ ] » de sujets.md) et 1 top 10 (premier « - [ ] » de tops.md), à ajouter à src/auto_articles.py au format g(...) avec cat= (Nourrir, Mangeoires, Nichoirs, Observer) et AUTO_META (teintes mousse, ciel, sable, rouge, lilas).
Règles : VOUVOIEMENT, jamais de tiret long, intro puis {CTA}, plusieurs <h2>, un <table>, FAQ 3 questions, lien vers le pilier {R}nourrir-les-oiseaux-du-jardin/ et 2 ou 3 autres guides. Liens Amazon uniquement <a href="{AMZ:mots clés}" """ + A + """>Voir sur Amazon</a> (tag lesoiseauxdujardin-21 ajouté par build.py).
Conseils nature : uniquement ce qui est lu sur des sources sérieuses (LPO nationale et régionales, protectiondesoiseaux.be, Natagora, Vigie-Nature, OFB) ; signaler les divergences. Tops 10 : produits réels, caractéristiques lues sur le fabricant ou un grand revendeur, aucun prix, note ni « testé », « non précisé » si une donnée manque, encadré « Comment nous avons fait cette sélection ».
