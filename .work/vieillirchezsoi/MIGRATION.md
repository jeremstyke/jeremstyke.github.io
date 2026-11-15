# Migration vers le dépôt dédié jeremstyke/viellirchezsoi (domaine viellirchezsoi.fr)

À faire une seule fois, dans une session qui a accès en écriture aux deux dépôts :

1. git clone https://github.com/jeremstyke/jeremstyke.github.io old && git clone https://github.com/jeremstyke/viellirchezsoi new
2. Copier dans new/ : old/.work/vieillirchezsoi/src -> new/src ; old/.work/vieillirchezsoi/{AUTOMATION.md,sujets.md,tops.md} -> new/ ;
   old/vieillirchezsoi/assets -> new/docs/assets ; old/vieillirchezsoi/og -> new/docs/og
3. cd new && python3 src/build.py  (détecte la disposition « dépôt dédié » : génère docs/ avec CNAME viellirchezsoi.fr et .nojekyll)
4. Dans new/AUTOMATION.md, remplacer les chemins .work/vieillirchezsoi/ par la racine du dépôt et vieillirchezsoi/ (site généré) par docs/.
5. rm -rf src/__pycache__ ; commit « Vieillir chez soi : installation sur viellirchezsoi.fr » ; push sur main.
6. Ensuite (dans jeremstyke.github.io) : python3 .work/vieillirchezsoi/redirect_old.py remplace les pages de l'ancien sous-dossier par des renvois vers le nouveau domaine.
