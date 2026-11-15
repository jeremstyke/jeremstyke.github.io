# -*- coding: utf-8 -*-
# Remplace chaque page de jeremstyke.github.io/vieillirchezsoi/ par un renvoi vers https://viellirchezsoi.fr/
import os, glob
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'vieillirchezsoi'))
NEW = 'https://viellirchezsoi.fr/'
n = 0
for f in glob.glob(os.path.join(ROOT, '**', 'index.html'), recursive=True):
    rel = os.path.relpath(os.path.dirname(f), ROOT).replace(os.sep, '/')
    url = NEW + ('' if rel == '.' else rel + '/')
    open(f, 'w', encoding='utf-8').write(
        '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Vieillir chez soi a déménagé</title>'
        '<link rel="canonical" href="%s"><meta name="robots" content="noindex,follow">'
        '<meta http-equiv="refresh" content="0; url=%s"><script>location.replace(%r+location.search+location.hash)</script></head>'
        '<body><p>Le site a déménagé : <a href="%s">%s</a></p></body></html>' % (url, url, url, url, url))
    n += 1
for x in ('sitemap.xml', 'robots.txt'):
    p = os.path.join(ROOT, x)
    if os.path.exists(p): os.remove(p)
print(n, 'pages redirigées vers', NEW)
