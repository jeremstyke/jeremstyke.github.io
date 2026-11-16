IMPORTANT : le site est en ligne sur https://viellirchezsoi.fr. Il est construit automatiquement (toutes les heures) dans le dépôt jeremstyke/viellirchezsoi à partir des sources de ce dossier. Le build lancé ici écrit seulement des renvois dans vieillirchezsoi/ (ancienne adresse) : c'est normal.

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
