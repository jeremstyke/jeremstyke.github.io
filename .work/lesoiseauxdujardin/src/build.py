# -*- coding: utf-8 -*-
# Générateur du site « Les oiseaux du jardin » (https://lesoiseauxdujardin.fr).
# Lancer : python3 src/build.py (depuis .work/lesoiseauxdujardin ou depuis le dépôt dédié). Le site est généré dans docs/.
import os, sys, json, html, re, shutil, datetime
from urllib.parse import quote_plus
sys.path.insert(0, os.path.dirname(__file__))
from content import GUIDES, CATS
from auto_articles import AUTO_META

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, 'docs')
DOMAIN = 'lesoiseauxdujardin.fr'
BASE = os.environ.get('LOJ_BASE', 'https://' + DOMAIN)
SITE = 'Les oiseaux du jardin'
TAG = 'lesoiseauxdujardin-21'   # identifiant Amazon Partenaires
CONTACT = 'contact@cvlibre.com'
YEAR = 2026
TODAY = datetime.date.today().isoformat()
DISCLOSURE = "En tant que Partenaire Amazon, nous réalisons un bénéfice sur les achats remplissant les conditions requises."
A = 'rel="sponsored nofollow noopener" target="_blank"'
PILIER = 'nourrir-les-oiseaux-du-jardin/'
META = dict(AUTO_META)
TINTS = ['mousse', 'ciel', 'sable', 'rouge', 'lilas']
CAT_EMO = {'Nourrir': '🌻', 'Mangeoires': '🏠', 'Nichoirs': '🪺', 'Observer': '🔭'}
CAT_TXT = {'Nourrir': "Graines, boules de graisse, eau : quoi donner, quand et comment, sans nuire aux oiseaux.",
           'Mangeoires': "Mangeoires classiques et connectées avec caméra : bien les choisir et les entretenir.",
           'Nichoirs': "Accueillir les nichées : choisir, placer et entretenir un nichoir.",
           'Observer': "Jumelles, caméras et applis pour reconnaître les oiseaux de votre jardin."}
MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
DATES_F = os.path.join(HERE, 'dates.json')
OG_DIR = os.path.join(ROOT, 'og')
PAGES = []

def amz(q): return 'https://www.amazon.fr/s?k=' + quote_plus(q) + '&tag=' + TAG
def esc(s): return html.escape(s, quote=True)
def fr_date(iso):
    y, m, d = iso.split('-'); return '%d %s %s' % (int(d), MOIS[int(m) - 1], y)
def slugify(t):
    import unicodedata
    t = unicodedata.normalize('NFD', re.sub('<[^>]+>', '', t)).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', t).strip('-')[:60]
def add_toc(body):
    heads = []
    def h(m):
        i = slugify(m.group(1)); heads.append((i, re.sub('<[^>]+>', '', m.group(1))))
        return '<h2 id="%s">%s</h2>' % (i, m.group(1))
    body = re.sub(r'<h2>(.*?)</h2>', h, body)
    if len(heads) >= 3:
        toc = '<nav class="toc" aria-label="Sommaire"><strong>Dans ce guide</strong><ol>' + ''.join('<li><a href="#%s">%s</a></li>' % (i, esc(t)) for i, t in heads) + '</ol></nav>'
        body = body.replace('{CTA}', '{CTA}\n' + toc, 1) if '{CTA}' in body else toc + body
    return body
def read_min(h): return max(2, round(len(re.sub('<[^>]+>', ' ', h).split()) / 200))

CTA = ('<aside class="cta"><div><strong>Nourrir les oiseaux sans leur nuire</strong>'
       '<span>Quand commencer, quoi donner, où placer la mangeoire : notre guide complet pour bien faire tout l\'hiver.</span></div>'
       '<a class="btn" href="{R}' + PILIER + '">Lire le guide</a></aside>')
NAV = [(PILIER, 'Bien nourrir'), ('guides/', 'Guides'), ('a-propos/', 'À propos')]

def render(body):
    body = body.replace('{CTA}', CTA)
    return re.sub(r'\{AMZ:([^}]+)\}', lambda m: amz(m.group(1)), body)

def page(path, title, desc, body, schema=None, crumbs=None, prio='0.6', og=None, kind='website'):
    R = '../' * path.count('/')
    url = BASE + '/' + path
    ld = [{"@context": "https://schema.org", "@type": "WebSite", "name": SITE, "url": BASE + '/'}]
    if crumbs:
        items = [{"@type": "ListItem", "position": 1, "name": "Accueil", "item": BASE + '/'}]
        for i, (n, p) in enumerate(crumbs):
            items.append({"@type": "ListItem", "position": i + 2, "name": n, "item": BASE + '/' + p})
        ld.append({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": items})
    if schema: ld += schema
    nav = ''.join('<a href="%s%s"%s>%s</a>' % (R, p, ' aria-current="page"' if p == path else '', n) for p, n in NAV)
    bc = ''
    if crumbs:
        bc = '<nav class="bc" aria-label="Fil d\'Ariane"><a href="%s">Accueil</a>' % R + ''.join(
            ' / <a href="%s%s">%s</a>' % (R, p, esc(n)) for n, p in crumbs[:-1]) + ' / <span>%s</span></nav>' % esc(crumbs[-1][0])
    doc = f'''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="google-site-verification" content="27IBJnOIE9cITU2upGV9tTz35Gj59wx6mI_l6zG75Oo">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="{kind}">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{BASE}/{og or "assets/og.png"}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="{SITE}">
<meta property="og:locale" content="fr_FR">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#F5F7F2">
<link rel="icon" href="{R}assets/favicon.ico" sizes="32x32"><link rel="icon" href="{R}assets/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="{R}assets/apple-touch-icon.png">
<link rel="preload" href="{R}assets/fonts/bricolage-grotesque-latin-800-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="{R}assets/fonts/figtree-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{R}assets/style.css?v=2">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head>
<body>
<a class="skip" href="#main">Aller au contenu</a>
<header class="top"><div class="wrap top-in">
<a class="logo" href="{R}"><span class="logo-ico" aria-hidden="true">🐦</span>Les oiseaux du jardin</a>
<nav class="menu" aria-label="Menu">{nav}<button type="button" class="txt-size" id="txt-size" aria-pressed="false" title="Agrandir le texte">A+</button></nav>
</div></header>
<main id="main">
{('<div class="wrap">' + bc + '</div>') if bc else ''}
{render(body).replace('{R}', R)}
</main>
<footer class="foot"><div class="wrap foot-in">
<div><a class="logo" href="{R}"><span class="logo-ico" aria-hidden="true">🐦</span>Les oiseaux du jardin</a>
<p>Des guides simples pour nourrir, loger et observer les oiseaux de votre jardin, en les respectant.</p></div>
<nav aria-label="Pied de page"><a href="{R}{PILIER}">Bien nourrir les oiseaux</a><a href="{R}guides/">Guides</a><a href="{R}a-propos/">À propos</a><a href="{R}mentions-legales/">Mentions légales</a><a href="{R}confidentialite/">Confidentialité</a><a href="mailto:{CONTACT}">Contact</a></nav>
<nav class="sites" aria-label="Nos autres sites"><p class="sites-t">Découvrez aussi nos autres sites</p><div class="sites-g"><a href="https://malistebebe.fr/"><img src="https://malistebebe.fr/assets/favicon.svg" alt="" width="40" height="40" loading="lazy"><span><strong>Ma liste bébé</strong><small>Préparer l'arrivée de bébé</small></span></a><a href="https://malistedemariage.fr/"><img src="https://malistedemariage.fr/assets/favicon.svg" alt="" width="40" height="40" loading="lazy"><span><strong>Ma liste mariage</strong><small>La liste de mariage, simplement</small></span></a><a href="https://viellirchezsoi.fr/"><img src="https://viellirchezsoi.fr/assets/favicon.svg" alt="" width="40" height="40" loading="lazy"><span><strong>Vieillir chez soi</strong><small>Rester autonome à la maison</small></span></a></div></nav>
<p class="disc">{DISCLOSURE} Les prix et les offres peuvent changer : vérifiez-les avant d'acheter. © {YEAR} {SITE}</p>
</div></footer>
<script>try{{if(localStorage.getItem("loj_big")==="1")document.documentElement.classList.add("big")}}catch(e){{}}</script>
<script src="{R}assets/app.js?v=1" defer></script>
</body>
</html>
'''
    if chr(0x2014) in doc or chr(0x2013) in doc:
        raise SystemExit('Tiret long interdit dans ' + path)
    d = os.path.join(OUT, path)
    os.makedirs(d, exist_ok=True)
    with open(os.path.join(d, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(doc)
    PAGES.append((path, prio))

def card(gd, R='{R}'):
    emo, tint = META.get(gd['slug'], ('🐦', 'mousse'))
    return ('<a class="card t-%s" href="%s%s"><span class="card-ico" aria-hidden="true">%s</span>'
            '<span class="card-cat">%s</span><strong>%s</strong><span>%s</span></a>') % (
        tint, R, gd['slug'], emo, esc(gd['cat']), esc(gd['short']), esc(gd['desc'][:110].rsplit(' ', 1)[0] + '...'))

def faq_html(faq):
    if not faq: return '', []
    h = '<section class="faq"><h2>Questions fréquentes</h2>' + ''.join(
        '<details><summary>%s</summary><p>%s</p></details>' % (esc(q), esc(a)) for q, a in faq) + '</section>'
    sch = [{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]}]
    return h, sch

def build():
    if os.path.isdir(OUT):
        for n in os.listdir(OUT):
            p = os.path.join(OUT, n)
            shutil.rmtree(p) if os.path.isdir(p) else os.remove(p)
    shutil.copytree(os.path.join(ROOT, 'assets'), os.path.join(OUT, 'assets'))
    for n in ('style.css', 'app.js'):
        shutil.copy(os.path.join(HERE, n), os.path.join(OUT, 'assets', n))
    os.makedirs(OG_DIR, exist_ok=True)
    try:
        import og as ogm
        if not os.path.exists(os.path.join(OG_DIR, '_site.png')):
            ogm.make(os.path.join(OG_DIR, '_site.png'))
    except Exception as e:
        print('og non généré :', e)

    guides = GUIDES[:]
    try: dates = json.load(open(DATES_F))
    except Exception: dates = {}
    for x in guides: dates.setdefault(x['slug'], TODAY)
    json.dump(dates, open(DATES_F, 'w'), indent=1, ensure_ascii=False, sort_keys=True)
    def og_for(slug, title, cat):
        rel = slug.strip('/') + '.png'
        try:
            import og as ogm; ogm.make_article(os.path.join(OG_DIR, rel), title, cat)
        except Exception:
            pass
        return ('og/' + rel) if os.path.exists(os.path.join(OG_DIR, rel)) else None
    latest = sorted(guides, key=lambda x: dates.get(x['slug'], TODAY), reverse=True)
    tops = [x for x in latest if x['slug'].startswith('meilleur')]

    # Accueil
    cats = ''.join('<a class="room" href="{R}guides/#%s"><span aria-hidden="true">%s</span><b>%s</b><small>%s</small></a>' % (
        slugify(c), CAT_EMO[c], esc(c), esc(CAT_TXT[c])) for c in CATS)
    home_faq = [("Faut-il nourrir les oiseaux toute l'année ?", "Non. Les associations de protection des oiseaux conseillent de nourrir surtout pendant la période froide et d'arrêter progressivement à la fin de l'hiver. Nos guides détaillent quand commencer et quand arrêter."),
                ("Quelle mangeoire choisir pour débuter ?", "Une mangeoire simple, facile à nettoyer et placée hors de portée des chats suffit. Les mangeoires connectées ajoutent une caméra pour observer les visiteurs."),
                ("Ce site vend-il des produits ?", "Non. Nous rédigeons des guides indépendants. Certains liens mènent vers Amazon et nous rapportent une commission, sans surcoût pour vous.")]
    fh, fs = faq_html(home_faq)
    toph = ('<section><h2>Nos comparatifs</h2><div class="cards">%s</div></section>' % ''.join(card(x) for x in tops[:6])) if tops else ''
    body = f'''<section class="hero"><div class="wrap hero-in">
<p class="kicker">Mésanges, rouges-gorges, moineaux et compagnie</p>
<h1>Accueillir les oiseaux du jardin, au bon moment et de la bonne façon</h1>
<p class="lead">Mangeoires, graines, nichoirs, caméras et jumelles : des guides clairs pour aider les oiseaux sans leur nuire, et les observer de près.</p>
<div class="hero-btns"><a class="btn" href="{{R}}{PILIER}">Bien nourrir les oiseaux</a><a class="btn ghost" href="{{R}}guides/">Tous les guides</a></div>
</div></section>
<div class="wrap">
<section><h2>Par thème</h2><div class="rooms">{cats}</div></section>
{toph}
<section><h2>Derniers guides</h2><div class="cards">{''.join(card(x) for x in latest[:6])}</div>
<p class="more"><a href="{{R}}guides/">Voir tous les guides</a></p></section>
<section class="why"><h2>Pourquoi ce site ?</h2>
<p>On veut bien faire en installant une mangeoire ou un nichoir, mais beaucoup de conseils se contredisent et certains gestes nuisent aux oiseaux (pain, filets de boules de graisse, mangeoire jamais nettoyée). Nous rassemblons les recommandations des associations de protection de la nature et nous vous aidons à choisir le matériel adapté.</p></section>
{fh}
</div>'''
    page('', 'Les oiseaux du jardin : nourrir, loger et observer les oiseaux',
         "Mangeoires, graines, nichoirs, caméras et jumelles : nos guides pour nourrir, loger et observer les oiseaux du jardin sans leur nuire.", body, schema=fs, prio='1.0', og='og/_site.png' if os.path.exists(os.path.join(OG_DIR, '_site.png')) else None)

    # Guides par thème
    gb = ''
    for c in CATS:
        xs = [x for x in latest if x['cat'] == c]
        if xs:
            gb += '<section id="%s"><h2>%s %s</h2><div class="cards">%s</div></section>' % (slugify(c), CAT_EMO[c], esc(c), ''.join(card(x, '../') for x in xs))
    page('guides/', 'Tous nos guides sur les oiseaux du jardin',
         "Tous nos guides pour nourrir, loger et observer les oiseaux du jardin : mangeoires, graines, nichoirs, caméras et jumelles.",
         '<div class="wrap"><h1>Tous les guides</h1><p class="lead">%d guides pour bien accueillir les oiseaux chez vous.</p>%s</div>' % (len(guides), gb),
         crumbs=[('Guides', 'guides/')], prio='0.8')

    for x in guides:
        fh, fs = faq_html(x['faq'])
        emo, tint = META.get(x['slug'], ('🐦', 'mousse'))
        same = [o for o in latest if o['slug'] != x['slug'] and o['cat'] == x['cat']]
        others = (same + [o for o in latest if o['slug'] != x['slug'] and o not in same])[:3]
        rel = '<section class="related"><h2>À lire aussi</h2><div class="cards">%s</div></section>' % ''.join(card(o) for o in others) if others else ''
        meta = '<p class="meta">Mis à jour le %s · %d min de lecture</p>' % (fr_date(dates[x['slug']]), read_min(x['body']))
        art = [{"@context": "https://schema.org", "@type": "Article", "headline": x['h1'], "description": x['desc'], "inLanguage": "fr",
                "author": {"@type": "Organization", "name": SITE}, "publisher": {"@type": "Organization", "name": SITE},
                "mainEntityOfPage": BASE + '/' + x['slug'], "datePublished": dates[x['slug']], "dateModified": dates[x['slug']]}]
        body = ('<div class="wrap art-wrap"><article class="prose"><p class="art-cat t-%s"><span aria-hidden="true">%s</span> %s</p><h1>%s</h1>%s%s%s'
                '<p class="disc-in">Liens d\'affiliation : nous touchons une commission sur certains achats, sans surcoût pour vous.</p></article>%s</div>') % (
            tint, emo, esc(x['cat']), esc(x['h1']), meta, add_toc(x['body']), fh, rel)
        page(x['slug'], x['title'], x['desc'], body, schema=art + fs, crumbs=[('Guides', 'guides/'), (x['short'], x['slug'])],
             prio='0.9' if x['slug'] == PILIER else '0.7', kind='article', og=og_for(x['slug'], x['h1'], x['cat']))

    page('a-propos/', 'À propos des Oiseaux du jardin', "Qui sommes-nous, d'où viennent nos conseils et comment le site est financé.",
         f'''<div class="wrap art-wrap"><article class="prose"><h1>À propos</h1>
<p>Les oiseaux du jardin aide chacun à nourrir, loger et observer les oiseaux près de chez soi, en respectant leurs besoins. Le site est édité par Jérémy Dacier-Jury.</p>
<h2>Nos conseils</h2><p>Nos conseils sur le nourrissage et les nichoirs s'appuient sur les recommandations publiées par les associations de protection des oiseaux, comme la LPO. Nous ne citons pas de prix ni de caractéristiques que nous n'avons pas vérifiés, et nous n'avons pas testé les produits présentés dans nos comparatifs : ils sont choisis d'après les fiches des fabricants et des revendeurs.</p>
<h2>Comment le site est financé</h2><p>{DISCLOSURE} Quand vous achetez après avoir cliqué sur un lien vers Amazon, nous touchons une commission, sans surcoût pour vous.</p>
<h2>Contact</h2><p><a href="mailto:{CONTACT}">{CONTACT}</a></p></article></div>''', crumbs=[('À propos', 'a-propos/')], prio='0.3')
    page('mentions-legales/', 'Mentions légales', 'Mentions légales du site Les oiseaux du jardin.',
         f'''<div class="wrap art-wrap"><article class="prose"><h1>Mentions légales</h1>
<h2>Éditeur</h2><p>Jérémy Dacier-Jury, 9 passage des Tisserands, 38790 Charantonnay, France. Contact : <a href="mailto:{CONTACT}">{CONTACT}</a>.</p>
<h2>Hébergement</h2><p>GitHub Pages, GitHub Inc., 88 Colin P Kelly Jr St, San Francisco, CA 94107, États-Unis.</p>
<h2>Affiliation</h2><p>{DISCLOSURE} Les liens vers Amazon.fr sont des liens d'affiliation.</p></article></div>''', crumbs=[('Mentions légales', 'mentions-legales/')], prio='0.1')
    page('confidentialite/', 'Confidentialité', 'Données collectées par le site Les oiseaux du jardin.',
         f'''<div class="wrap art-wrap"><article class="prose"><h1>Confidentialité</h1>
<p>Le site fonctionne sans inscription.</p>
<h2>Mesure d'audience</h2><p>Nous comptons les pages vues et les clics vers Amazon de façon anonyme (page visitée, site d'origine, type d'appareil et un identifiant aléatoire stocké dans votre navigateur). Ces données ne sont ni vendues ni utilisées pour de la publicité, et sont hébergées par Supabase dans l'Union européenne.</p>
<h2>Amazon</h2><p>Quand vous cliquez sur un lien vers Amazon.fr, Amazon peut déposer des cookies pour attribuer la commission.</p>
<h2>Contact</h2><p><a href="mailto:{CONTACT}">{CONTACT}</a></p></article></div>''', crumbs=[('Confidentialité', 'confidentialite/')], prio='0.1')

    if os.path.isdir(OG_DIR):
        shutil.copytree(OG_DIR, os.path.join(OUT, 'og'))
    sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(
        '  <url><loc>%s/%s</loc><lastmod>%s</lastmod><priority>%s</priority></url>\n' % (BASE, p, TODAY, pr) for p, pr in PAGES) + '</urlset>\n'
    open(os.path.join(OUT, 'sitemap.xml'), 'w', encoding='utf-8').write(sm)
    open(os.path.join(OUT, 'robots.txt'), 'w').write('User-agent: *\nAllow: /\n\nSitemap: %s/sitemap.xml\n' % BASE)
    open(os.path.join(OUT, 'CNAME'), 'w').write(DOMAIN + '\n')
    open(os.path.join(OUT, '.nojekyll'), 'w').write('')
    open(os.path.join(OUT, 'da4540821acf4048569bad7fbedc3ee1.txt'), 'w').write('da4540821acf4048569bad7fbedc3ee1')  # cle IndexNow
    print('%d pages, %d guides' % (len(PAGES), len(guides)))

if __name__ == '__main__':
    build()
