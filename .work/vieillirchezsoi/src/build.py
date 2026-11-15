# -*- coding: utf-8 -*-
# Générateur du site « Vieillir chez soi ». Lancer : python3 .work/vieillirchezsoi/src/build.py
import os, sys, json, html, re, shutil, datetime
from urllib.parse import quote_plus
sys.path.insert(0, os.path.dirname(__file__))
from content import CHECKLIST, PRIO, GUIDES
from auto_articles import AUTO_META

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
OUT = os.path.join(REPO, 'vieillirchezsoi')
# Sans domaine : sous-dossier de jeremstyke.github.io. Avec domaine : VCS_BASE=https://mondomaine.fr
BASE = os.environ.get('VCS_BASE', 'https://jeremstyke.github.io/vieillirchezsoi')
SITE = 'Vieillir chez soi'
TAG = 'viellirchezsoi-21'   # identifiant Amazon Partenaires (orthographe exacte du compte)
CONTACT = 'contact@cvlibre.com'
YEAR = 2026
TODAY = datetime.date.today().isoformat()
DISCLOSURE = "En tant que Partenaire Amazon, nous réalisons un bénéfice sur les achats remplissant les conditions requises."
A = 'rel="sponsored nofollow noopener" target="_blank"'

META = {
  'comment-choisir-siege-de-douche/': ('🚿', 'sauge'),
  'deambulateur-ou-rollator/': ('🚶', 'ciel'),
  'barre-d-appui-salle-de-bain/': ('🛁', 'sable'),
  'telephone-portable-senior/': ('📞', 'rose'),
}
META.update(AUTO_META)
TINTS = ['sauge', 'ciel', 'sable', 'rose', 'lilas']

def amz(q): return 'https://www.amazon.fr/s?k=' + quote_plus(q) + '&tag=' + TAG
def esc(s): return html.escape(s, quote=True)

CTA = ('<aside class="cta"><div><strong>Faites le point pièce par pièce</strong>'
       '<span>Notre checklist gratuite liste l\'équipement utile pour rester chez soi en sécurité, du plus urgent au plus confortable.</span></div>'
       '<a class="btn" href="{R}checklist/">Ouvrir la checklist</a></aside>')

NAV = [('checklist/', 'Checklist'), ('guides/', 'Guides'), ('a-propos/', 'À propos')]
PAGES = []

def render(body):
    body = body.replace('{CTA}', CTA)
    return re.sub(r'\{AMZ:([^}]+)\}', lambda m: amz(m.group(1)), body)

def page(path, title, desc, body, schema=None, crumbs=None, prio='0.6'):
    depth = path.count('/')
    R = '../' * depth
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
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{BASE}/assets/og.png">
<meta property="og:site_name" content="{SITE}">
<meta property="og:locale" content="fr_FR">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#F6F3EC">
<link rel="icon" href="{R}assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="{R}assets/fonts/bricolage-grotesque-latin-800-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="{R}assets/fonts/figtree-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{R}assets/style.css?v=1">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head>
<body>
<a class="skip" href="#main">Aller au contenu</a>
<header class="top"><div class="wrap top-in">
<a class="logo" href="{R}"><span class="logo-ico" aria-hidden="true">🏡</span>Vieillir chez soi</a>
<nav class="menu" aria-label="Menu">{nav}</nav>
</div></header>
<main id="main">
{('<div class="wrap">' + bc + '</div>') if bc else ''}
{render(body).replace('{R}', R)}
</main>
<footer class="foot"><div class="wrap foot-in">
<div><a class="logo" href="{R}"><span class="logo-ico" aria-hidden="true">🏡</span>Vieillir chez soi</a>
<p>Des guides simples pour équiper la maison et rester chez soi en sécurité, le plus longtemps possible.</p></div>
<nav aria-label="Pied de page"><a href="{R}checklist/">Checklist</a><a href="{R}guides/">Guides</a><a href="{R}a-propos/">À propos</a><a href="{R}mentions-legales/">Mentions légales</a><a href="{R}confidentialite/">Confidentialité</a><a href="mailto:{CONTACT}">Contact</a></nav>
<p class="disc">{DISCLOSURE} Les informations de ce site sont générales et ne remplacent pas l'avis d'un médecin, d'un ergothérapeute ou d'un pharmacien. Les prix et les offres peuvent changer : vérifiez-les avant d'acheter. © {YEAR} {SITE}</p>
</div></footer>
<script src="{R}assets/app.js?v=1" defer></script>
</body>
</html>
'''
    if chr(0x2014) in doc:
        raise SystemExit('Tiret long interdit dans ' + path)
    d = os.path.join(OUT, path)
    os.makedirs(d, exist_ok=True)
    with open(os.path.join(d, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(doc)
    PAGES.append((path, prio))

def card(gd, R='{R}'):
    emo, tint = META.get(gd['slug'], ('📘', 'sauge'))
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
            if n != 'assets':
                p = os.path.join(OUT, n)
                shutil.rmtree(p) if os.path.isdir(p) else os.remove(p)
    os.makedirs(os.path.join(OUT, 'assets'), exist_ok=True)
    for n in ('style.css', 'app.js', 'favicon.svg'):
        shutil.copy(os.path.join(HERE, n), os.path.join(OUT, 'assets', n))
    if not os.path.exists(os.path.join(OUT, 'assets', 'og.png')):
        try:
            import og; og.make(os.path.join(OUT, 'assets', 'og.png'))
        except Exception as e:
            print('og.png non généré :', e)

    guides = GUIDES[:]
    latest = list(reversed(guides))

    # Accueil
    cats = ''.join('<a class="room" href="{R}checklist/#c%d"><span aria-hidden="true">%s</span>%s</a>' % (i, emo, esc(name))
                   for i, (name, emo, _) in enumerate(CHECKLIST))
    home_faq = [("Par où commencer pour adapter la maison d'un parent âgé ?", "Commencez par la salle de bains et les trajets de nuit : tapis antidérapants, siège de douche, barres d'appui et veilleuses. Notre checklist classe tout par priorité."),
                ("Qui peut conseiller sur le bon équipement ?", "Le médecin traitant, le pharmacien et l'ergothérapeute. L'ergothérapeute peut venir au domicile pour proposer des aménagements adaptés."),
                ("Ce site vend-il du matériel ?", "Non. Nous rédigeons des guides indépendants. Certains liens mènent vers Amazon et nous rapportent une commission, sans surcoût pour vous.")]
    fh, fs = faq_html(home_faq)
    body = f'''<section class="hero"><div class="wrap hero-in">
<p class="kicker">Guides pratiques pour les seniors et leurs proches</p>
<h1>Rester chez soi, en sécurité et en confiance</h1>
<p class="lead">Siège de douche, barres d'appui, rollator, téléphone simple : des conseils clairs pour choisir le bon équipement et adapter la maison, pièce par pièce.</p>
<div class="hero-btns"><a class="btn" href="{{R}}checklist/">Voir la checklist</a><a class="btn ghost" href="{{R}}guides/">Lire les guides</a></div>
</div></section>
<div class="wrap">
<section><h2>Par pièce et par besoin</h2><div class="rooms">{cats}</div></section>
<section><h2>Nos derniers guides</h2><div class="cards">{''.join(card(x) for x in latest[:6])}</div>
<p class="more"><a href="{{R}}guides/">Tous les guides</a></p></section>
<section class="why"><h2>Pourquoi ce site ?</h2>
<p>Quand un parent commence à perdre en autonomie, on doit souvent s'équiper vite, sans savoir quoi acheter. Les fiches produits des magasins listent des caractéristiques, mais expliquent rarement comment choisir. Ici, on vous dit ce qui compte vraiment, pour qui, et à quoi faire attention.</p>
<p>Nos conseils sont généraux. Pour une situation précise, demandez l'avis du médecin, d'un ergothérapeute ou du pharmacien.</p></section>
{fh}
</div>'''
    page('', 'Vieillir chez soi : guides pour adapter la maison des seniors',
         "Siège de douche, barres d'appui, rollator, téléphone senior : guides et checklist pour adapter la maison et rester chez soi en sécurité.", body, schema=fs, prio='1.0')

    # Checklist
    total = sum(len(it) for _, _, it in CHECKLIST)
    secs = ''
    for i, (name, emo, items) in enumerate(CHECKLIST):
        rows = ''.join(
            '<li class="item p%d"><label><input type="checkbox" data-id="%s"><span class="it-name">%s</span></label>'
            '<span class="prio">%s</span><p>%s</p><a class="amz" href="%s" %s>Voir les modèles</a></li>' % (
                p, esc(re.sub(r'[^a-z0-9]+', '-', q)), esc(n), PRIO[p], esc(c), amz(q), A)
            for n, q, p, c in items)
        secs += '<section class="cl-sec t-%s" id="c%d"><h2><span aria-hidden="true">%s</span> %s</h2><ul class="cl">%s</ul></section>' % (
            TINTS[i % len(TINTS)], i, emo, esc(name), rows)
    body = f'''<div class="wrap art-wrap">
<h1>Checklist du maintien à domicile</h1>
<p class="lead">{total} équipements pour sécuriser la maison d'un senior, classés par pièce et par priorité. Cochez ce qui est déjà en place : votre progression reste enregistrée sur cet appareil.</p>
<div class="progress" aria-live="polite"><div class="bar"><span id="bar"></span></div><p id="ptxt">0 sur {total}</p>
<button class="btn ghost small" type="button" onclick="window.print()">Imprimer</button></div>
<p class="legend"><span class="prio p1">Essentiel</span> <span class="prio p2">Utile</span> <span class="prio p3">Selon les besoins</span></p>
{secs}
<div class="note"><strong>Un conseil personnalisé ?</strong> Un ergothérapeute peut venir au domicile et proposer les aménagements adaptés à la personne. Parlez-en au médecin traitant.</div>
<p>Pour choisir chaque équipement, lisez nos guides : <a href="{{R}}comment-choisir-siege-de-douche/">siège de douche</a>, <a href="{{R}}barre-d-appui-salle-de-bain/">barres d'appui</a>, <a href="{{R}}deambulateur-ou-rollator/">déambulateur ou rollator</a>.</p>
</div>'''
    page('checklist/', 'Checklist maintien à domicile : équiper la maison d\'un senior',
         f"La checklist gratuite du maintien à domicile : {total} équipements classés par pièce et par priorité pour sécuriser la maison d'une personne âgée.",
         body, crumbs=[('Checklist', 'checklist/')], prio='0.9')

    # Guides
    groups = {}
    for x in guides: groups.setdefault(x['cat'], []).append(x)
    gb = ''.join('<section><h2>%s</h2><div class="cards">%s</div></section>' % (esc(c), ''.join(card(x, '../') for x in xs))
                 for c, xs in groups.items())
    page('guides/', 'Guides pour adapter la maison des seniors',
         "Tous nos guides pour choisir l'équipement du maintien à domicile : salle de bains, déplacements, sécurité, vie quotidienne et repos.",
         '<div class="wrap"><h1>Tous les guides</h1><p class="lead">Des conseils pour choisir le bon équipement, sans jargon.</p>' + gb.replace('{R}', '../') + '</div>',
         crumbs=[('Guides', 'guides/')], prio='0.8')

    for x in guides:
        fh, fs = faq_html(x['faq'])
        emo, tint = META.get(x['slug'], ('📘', 'sauge'))
        others = [o for o in latest if o['slug'] != x['slug']][:3]
        rel = '<section class="related"><h2>À lire aussi</h2><div class="cards">%s</div></section>' % ''.join(card(o) for o in others) if others else ''
        art = [{"@context": "https://schema.org", "@type": "Article", "headline": x['h1'], "description": x['desc'],
                "inLanguage": "fr", "author": {"@type": "Organization", "name": SITE}, "publisher": {"@type": "Organization", "name": SITE},
                "mainEntityOfPage": BASE + '/' + x['slug']}]
        body = ('<div class="wrap art-wrap"><article class="prose"><p class="art-cat t-%s"><span aria-hidden="true">%s</span> %s</p><h1>%s</h1>%s%s'
                '<p class="disc-in">Ces conseils sont généraux et ne remplacent pas l\'avis d\'un professionnel de santé. Liens d\'affiliation : nous touchons une commission sur certains achats, sans surcoût pour vous.</p></article>%s</div>') % (
            tint, emo, esc(x['cat']), esc(x['h1']), x['body'], fh, rel)
        page(x['slug'], x['title'], x['desc'], body, schema=art + fs, crumbs=[('Guides', 'guides/'), (x['short'], x['slug'])], prio='0.7')

    # Pages légales
    page('a-propos/', 'À propos de Vieillir chez soi', "Qui sommes-nous, comment nous choisissons nos conseils et comment le site est financé.",
         f'''<div class="wrap art-wrap"><article class="prose"><h1>À propos</h1>
<p>Vieillir chez soi aide les seniors et leurs proches à choisir l'équipement utile pour rester à la maison en sécurité. Le site est édité par Jérémy Dacier-Jury.</p>
<h2>Nos conseils</h2><p>Nous expliquons les critères de choix de chaque équipement. Nous ne citons pas de prix ni de caractéristiques que nous n'avons pas vérifiés. Nos articles sont des conseils généraux : pour une situation précise, l'avis du médecin, d'un ergothérapeute ou du pharmacien prime toujours.</p>
<h2>Comment le site est financé</h2><p>{DISCLOSURE} Quand vous achetez après avoir cliqué sur un lien vers Amazon, nous touchons une commission, sans surcoût pour vous. Cela ne change pas nos conseils.</p>
<h2>Contact</h2><p><a href="mailto:{CONTACT}">{CONTACT}</a></p></article></div>''', crumbs=[('À propos', 'a-propos/')], prio='0.3')
    page('mentions-legales/', 'Mentions légales', 'Mentions légales du site Vieillir chez soi.',
         f'''<div class="wrap art-wrap"><article class="prose"><h1>Mentions légales</h1>
<h2>Éditeur</h2><p>Jérémy Dacier-Jury, 9 passage des Tisserands, 38790 Charantonnay, France. Contact : <a href="mailto:{CONTACT}">{CONTACT}</a>.</p>
<h2>Hébergement</h2><p>GitHub Pages, GitHub Inc., 88 Colin P Kelly Jr St, San Francisco, CA 94107, États-Unis.</p>
<h2>Affiliation</h2><p>{DISCLOSURE} Les liens vers Amazon.fr sont des liens d'affiliation : si vous achetez après avoir cliqué, nous touchons une commission, sans surcoût pour vous.</p>
<h2>Responsabilité</h2><p>Les informations de ce site sont données à titre indicatif. Elles ne remplacent pas l'avis d'un professionnel de santé. Suivez toujours la notice des fabricants pour l'installation et l'utilisation du matériel.</p></article></div>''',
         crumbs=[('Mentions légales', 'mentions-legales/')], prio='0.1')
    page('confidentialite/', 'Confidentialité', 'Données collectées par le site Vieillir chez soi.',
         f'''<div class="wrap art-wrap"><article class="prose"><h1>Confidentialité</h1>
<p>Le site fonctionne sans inscription.</p>
<h2>Checklist</h2><p>Les équipements que vous cochez sont enregistrés uniquement dans votre navigateur. Rien n'est envoyé sur un serveur.</p>
<h2>Mesure d'audience</h2><p>Nous comptons les pages vues et les clics vers Amazon de façon anonyme (page visitée, site d'origine, type d'appareil et un identifiant aléatoire stocké dans votre navigateur). Aucune donnée n'est vendue ni utilisée pour de la publicité. Ces données sont hébergées par Supabase dans l'Union européenne.</p>
<h2>Amazon</h2><p>Quand vous cliquez sur un lien vers Amazon.fr, Amazon peut déposer des cookies pour attribuer la commission. Consultez la politique de confidentialité d'Amazon pour en savoir plus.</p>
<h2>Contact</h2><p><a href="mailto:{CONTACT}">{CONTACT}</a></p></article></div>''',
         crumbs=[('Confidentialité', 'confidentialite/')], prio='0.1')

    sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(
        '  <url><loc>%s/%s</loc><lastmod>%s</lastmod><priority>%s</priority></url>\n' % (BASE, p, TODAY, pr) for p, pr in PAGES) + '</urlset>\n'
    open(os.path.join(OUT, 'sitemap.xml'), 'w', encoding='utf-8').write(sm)
    open(os.path.join(OUT, 'robots.txt'), 'w').write('User-agent: *\nAllow: /\n\nSitemap: %s/sitemap.xml\n' % BASE)
    print('%d pages, %d guides' % (len(PAGES), len(guides)))

if __name__ == '__main__':
    build()
