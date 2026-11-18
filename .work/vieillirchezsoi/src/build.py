# -*- coding: utf-8 -*-
# Générateur du site « Vieillir chez soi ». Lancer : python3 .work/vieillirchezsoi/src/build.py
import os, sys, json, html, re, shutil, datetime
from urllib.parse import quote_plus
sys.path.insert(0, os.path.dirname(__file__))
from content import CHECKLIST, PRIO, GUIDES, ROOM_INTRO, ROOM_CAT, HUB_INTRO, HUB_OUTRO, HUB_FAQ
from auto_articles import AUTO_META
from quiz import ITEMS, QUESTIONS

HERE = os.path.dirname(os.path.abspath(__file__))
DOMAIN = 'vieillir-chez-soi.fr'
# Deux dispositions possibles :
#  - dépôt dédié (src/ à la racine) : site généré dans docs/, servi sur https://vieillir-chez-soi.fr (fichier CNAME)
#  - ancienne disposition dans jeremstyke.github.io (.work/vieillirchezsoi/src) : sous-dossier vieillirchezsoi/
STANDALONE = os.path.basename(os.path.dirname(os.path.dirname(HERE))) != '.work'
if STANDALONE:
    OUT = os.path.join(os.path.dirname(HERE), 'docs')
    BASE = os.environ.get('VCS_BASE', 'https://' + DOMAIN)
else:
    OUT = os.path.join(os.path.abspath(os.path.join(HERE, '..', '..', '..')), 'vieillirchezsoi')
    BASE = os.environ.get('VCS_BASE', 'https://jeremstyke.github.io/vieillirchezsoi')
SITE = 'Vieillir chez soi'
AUTHOR_NAME = 'Jérémy Dacier-Jury'
LLMS_INTRO = "Vieillir chez soi aide les seniors et leurs proches aidants à rester à la maison en sécurité : guides pratiques pour adapter le logement pièce par pièce, comparatifs de matériel (aides à la marche, salle de bain, fauteuils releveurs, téléassistance), explications sur les aides (APA, aides des caisses de retraite, crédit d'impôt) et sur la retraite. Les informations sur les aides et la retraite sont vérifiées sur les sites officiels (service-public.fr, info-retraite.fr, lassuranceretraite.fr). Les liens vers Amazon sont des liens d'affiliation."
TAG = 'viellirchezsoi-21'   # identifiant Amazon Partenaires (orthographe exacte du compte)
CONTACT = 'contact@vieillir-chez-soi.fr'
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
HUB = 'amenager-logement-personne-agee/'
TINTS = ['sauge', 'ciel', 'sable', 'rose', 'lilas']

def amz(q): return 'https://www.amazon.fr/s?k=' + quote_plus(q) + '&tag=' + TAG
def esc(s): return html.escape(s, quote=True)

CTA = ('<aside class="cta"><div><strong>Faites le point pièce par pièce</strong>'
       '<span>Notre guide pour aménager le logement liste l\'équipement utile pièce par pièce, du plus urgent au plus confortable.</span></div>'
       '<a class="btn" href="{R}amenager-logement-personne-agee/">Lire le guide</a></aside>')

PDF_BOX = ('<aside class="pdfbox" id="pdf"><div><strong>📄 Le guide pièce par pièce en PDF</strong>'
  '<span>À imprimer et à relire avec votre proche : tous les équipements, classés par pièce et par priorité. Gratuit, téléchargement immédiat.</span></div>'
  '<form class="pdf-form" data-src="@SRC@"><label class="sr" for="pdf-mail-@SRC@">Votre e-mail</label>'
  '<input type="email" id="pdf-mail-@SRC@" name="email" required placeholder="Votre adresse e-mail" autocomplete="email">'
  '<label class="chk"><input type="checkbox" name="news"> J\'accepte de recevoir de temps en temps des conseils par e-mail (désinscription en un clic).</label>'
  '<button class="btn" type="submit">Télécharger le PDF</button>'
  '<p class="pdf-ok" hidden>Merci ! <a href="{R}assets/guide-amenager-logement.pdf" download>Télécharger le guide (PDF)</a></p>'
  '<p class="small">Votre e-mail sert uniquement à ce que vous avez choisi. <a href="{R}confidentialite/">Confidentialité</a></p></form></aside>')
def pdf_box(src): return PDF_BOX.replace('@SRC@', src)

NAV = [('amenager-logement-personne-agee/', 'Pièce par pièce'), ('quel-equipement/', 'Questionnaire'), ('guides/', 'Guides')]
PAGES = []
MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
DATES_F = os.path.join(HERE, 'dates.json')
def fr_date(iso):
    y, m, d = iso.split('-'); return '%d %s %s' % (int(d), MOIS[int(m) - 1], y)
def slugify(t):
    import unicodedata
    t = unicodedata.normalize('NFD', re.sub('<[^>]+>', '', t)).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', t).strip('-')[:60]
def add_toc(body):
    """Ajoute un id à chaque <h2> et place un sommaire juste après le {CTA}."""
    heads = []
    def h(m):
        i = slugify(m.group(1)); heads.append((i, re.sub('<[^>]+>', '', m.group(1))))
        return '<h2 id="%s">%s</h2>' % (i, m.group(1))
    body = re.sub(r'<h2>(.*?)</h2>', h, body)
    if len(heads) >= 3:
        toc = '<nav class="toc" aria-label="Sommaire"><strong>Dans ce guide</strong><ol>' + ''.join('<li><a href="#%s">%s</a></li>' % (i, esc(t)) for i, t in heads) + '</ol></nav>'
        body = body.replace('{CTA}', '{CTA}\n' + toc, 1) if '{CTA}' in body else toc + body
    return body
def read_min(html_):
    return max(2, round(len(re.sub('<[^>]+>', ' ', html_).split()) / 200))

REL = 'rel="sponsored nofollow noopener" target="_blank"'
def top_pick(body):
    """Produit n°1 d'un top : (nom, raison, ancre, requête Amazon) ou None.
    Premier intertitre (« 1. » en priorité) suivi, avant l'intertitre suivant, d'un lien « Voir ... Amazon »."""
    if not re.search(r'Comment (?:nous avons|on a) fait cette sélection', body): return None
    heads = list(re.finditer(r'<h([23])(?: id="([^"]*)")?>\s*(.+?)</h\1>', body))
    order = [h for h in heads if re.match(r'1\.\s', h.group(3))] + heads
    for k, h in enumerate(order):
        nxt = next((x.start() for x in heads if x.start() > h.start()), len(body))
        a = re.search(r'href="\{AMZ:([^}]+)\}"[^>]*>\s*Voir[^<]*Amazon', body[h.end():nxt])
        if not a: continue
        title = re.sub(r'^1\.\s*', '', re.sub('<[^>]+>', '', h.group(3)))
        name, _, why = title.partition(' : ')
        why = re.sub(r'\s*\((?:notre|mon) choix[^)]*\)\s*$', '', why.strip(), flags=re.I)
        return name.strip(), (why[:1].upper() + why[1:]) if why else '', h.group(2), a.group(1)
    return None

def pick_box(body):
    """Encadré « Notre choix » juste après l'intro : produit n°1 des tops, ou n°1 du comparatif lié pour les guides."""
    if '{CTA}' not in body or 'class="pick"' in body: return body
    p = top_pick(body)
    if p:
        name, why, anchor, q = p
        more = ('<a class="pick-more" href="#%s">Pourquoi ce choix</a>' % anchor) if anchor else ''
        box = ('<aside class="pick"><div><span class="pick-tag">⭐ Notre choix n°1</span><strong>%s</strong><span>%s</span>%s</div>'
               '<a class="btn" href="{AMZ:%s}" %s>Voir sur Amazon</a></aside>') % (esc(name), esc(why or 'Notre recommandation n°1 dans ce comparatif.'), more, q, REL)
        return body.replace('{CTA}', box + '\n{CTA}', 1)
    return body

def pick_box_guide(body, slug):
    """Pour un guide : n°1 du comparatif lié qui parle du même produit (mots communs dans l'adresse)."""
    if '{CTA}' not in body or 'class="pick"' in body or slug.startswith('meilleur'): return body
    stop = {'a', 'd', 'l', 'au', 'aux', 'des', 'en', 'et', 'un', 'une', 'par', 'sa', 'son', 'ses', 'ma', 'mon', 'mes', 'ta', 'ton', 'tes', 'noces', 'annee', 'ans', 'livre', 'livres', 'meilleur', 'meilleure', 'meilleurs', 'comment', 'choisir', 'senior', 'personne', 'agee', 'de', 'du', 'la', 'le', 'les', 'pour', 'bien', 'quel', 'quelle'}
    if re.search(r'aide|rembours|prix|retraite', slug): return body
    words = [w for w in slug.strip('/').split('-') if w not in stop]
    if not words: return body
    mine = set(words)
    best, score = None, 0
    cands = list(dict.fromkeys(re.findall(r'href="\{R\}(meilleur[a-z0-9-]*/)"', body))) + [gd['slug'] for gd in GUIDES if gd['slug'].startswith('meilleur')]
    for cand in cands:
        cw = set(cand.strip('/').split('-')) - stop
        sc = len(mine & cw) if words[0] in cw else 0
        if sc > score: best, score = cand, sc
    if not best or score < min(2, len(mine)): return body
    top = next((gd for gd in GUIDES if gd['slug'] == best), None)
    p = top_pick(top['body']) if top else None
    if not p: return body
    name, why, anchor, q = p
    box = ('<aside class="pick"><div><span class="pick-tag">⭐ Pressé ? Notre n°1</span><strong>%s</strong><span>%s</span>'
           '<a class="pick-more" href="{R}%s">Voir tout le comparatif</a></div>'
           '<a class="btn" href="{AMZ:%s}" %s>Voir sur Amazon</a></aside>') % (esc(name), esc(why or ('Extrait de notre comparatif « %s ».' % top['short'])), best, q, REL)
    return body.replace('{CTA}', box + '\n{CTA}', 1)

def render(body):
    body = pick_box(body)
    body = body.replace('{CTA}', CTA).replace('{R}checklist/', '{R}' + HUB)
    body = re.sub(r'\{AUDIBLE:([A-Z0-9]{10})\}', lambda m: 'https://www.amazon.fr/hz/audible/mlp/mfpdp/' + m.group(1) + '?actionCode=AMSTM1450129210001&tag=' + TAG, body)
    body = body.replace('{AUDIBLE}', 'https://www.amazon.fr/hz/audible/mlp?actionCode=AMSTM1450129210001&tag=' + TAG)
    return re.sub(r'\{AMZ:([^}]+)\}', lambda m: amz(m.group(1)), body)

AUTHOR_LD = {"@type": "Person", "name": AUTHOR_NAME, "url": BASE + '/a-propos/'}
PUBLISHER_LD = {"@type": "Organization", "name": SITE, "url": BASE + '/', "logo": {"@type": "ImageObject", "url": BASE + '/assets/icon-192.png'}}
BYLINE = ' · par <a href="/a-propos/" rel="author">' + AUTHOR_NAME.split()[0] + '</a>'


def page(path, title, desc, body, schema=None, crumbs=None, prio='0.6', og=None, kind='website'):
    depth = path.count('/')
    R = '../' * depth
    url = BASE + '/' + path
    ld = [{"@context": "https://schema.org", "@type": "WebSite", "name": SITE, "url": BASE + '/', "inLanguage": "fr", "publisher": PUBLISHER_LD}]
    if path == '': ld.append(dict({"@context": "https://schema.org"}, **PUBLISHER_LD))
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
<meta name="theme-color" content="#F6F3EC">
<meta name="google-site-verification" content="4oaKmmaPhRk9e79dCF6veG1lJ3OI7VipcwnyIDy7JQE" />
<meta name="google-site-verification" content="TPAoXw0fr14IP03Q62OAIrSQKWMAkdApydsercYPudY" />
<link rel="icon" href="{R}assets/favicon.ico" sizes="32x32"><link rel="icon" href="{R}assets/favicon.svg" type="image/svg+xml"><link rel="icon" href="{R}assets/icon-192.png" type="image/png" sizes="192x192"><link rel="apple-touch-icon" href="{R}assets/apple-touch-icon.png">
<link rel="preload" href="{R}assets/fonts/bricolage-grotesque-latin-800-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="{R}assets/fonts/figtree-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{R}assets/style.css?v=7">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8638687738606649" crossorigin="anonymous"></script>
</head>
<body>
<a class="skip" href="#main">Aller au contenu</a>
<header class="top"><div class="wrap top-in">
<a class="logo" href="{R}"><span class="logo-ico" aria-hidden="true">🏡</span>Vieillir chez soi</a>
<nav class="menu" aria-label="Menu">{nav}<button type="button" class="txt-size" id="txt-size" aria-pressed="false" title="Agrandir le texte">A+</button></nav>
</div></header>
<main id="main">
{('<div class="wrap">' + bc + '</div>') if bc else ''}
{render(body).replace('{R}', R)}
</main>
<footer class="foot"><div class="wrap foot-in">
<div><a class="logo" href="{R}"><span class="logo-ico" aria-hidden="true">🏡</span>Vieillir chez soi</a>
<p>Des guides simples pour équiper la maison et rester chez soi en sécurité, le plus longtemps possible.</p></div>
<nav aria-label="Pied de page"><a href="{R}amenager-logement-personne-agee/">Aménager le logement</a><a href="{R}quel-equipement/">Questionnaire</a><a href="{R}guides/">Guides</a><a href="{R}a-propos/">À propos</a><a href="{R}mentions-legales/">Mentions légales</a><a href="{R}confidentialite/">Confidentialité</a><a href="{R}contact/">Contact</a><a href="{R}publicite-partenariats/">Publicité et partenariats</a></nav>
<nav class="sites" aria-label="Nos autres sites"><p class="sites-t">Découvrez aussi nos autres sites</p><div class="sites-g"><a href="https://lesoiseauxdujardin.fr/"><img src="https://lesoiseauxdujardin.fr/assets/favicon.svg" alt="" width="40" height="40" loading="lazy"><span><strong>Les oiseaux du jardin</strong><small>Nourrir et observer les oiseaux</small></span></a><a href="https://malistebebe.fr/"><img src="https://malistebebe.fr/assets/favicon.svg" alt="" width="40" height="40" loading="lazy"><span><strong>Ma liste bébé</strong><small>Préparer l'arrivée de bébé</small></span></a><a href="https://malistedemariage.fr/"><img src="https://malistedemariage.fr/assets/favicon.svg" alt="" width="40" height="40" loading="lazy"><span><strong>Ma liste mariage</strong><small>La liste de mariage simple</small></span></a></div></nav>
<p class="disc">{DISCLOSURE} Les informations de ce site sont générales et ne remplacent pas l'avis d'un médecin, d'un ergothérapeute ou d'un pharmacien. Les prix et les offres peuvent changer : vérifiez-les avant d'acheter. © {YEAR} {SITE}</p>
</div></footer>
<script>try{{if(localStorage.getItem("vcs_big")==="1")document.documentElement.classList.add("big")}}catch(e){{}}</script>
<script src="{R}assets/app.js?v=3" defer></script>
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
            if n not in ('assets', 'CNAME', '.nojekyll'):
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
    try: dates = json.load(open(DATES_F))
    except Exception: dates = {}
    for x in guides + [dict(slug=HUB)]:
        dates.setdefault(x['slug'], TODAY)
    json.dump(dates, open(DATES_F, 'w'), indent=1, ensure_ascii=False, sort_keys=True)
    os.makedirs(os.path.join(OUT, 'og'), exist_ok=True)
    def og_for(slug, title, emo_cat):
        rel = 'og/' + slug.strip('/') + '.png'
        try:
            import og as ogm; ogm.make_article(os.path.join(OUT, rel), title, emo_cat)
            return rel
        except Exception as e:
            print('og non généré', slug, e); return None
    latest = list(reversed(guides))

    # Accueil
    cats = ''.join('<a class="room" href="{R}amenager-logement-personne-agee/#c%d"><span aria-hidden="true">%s</span>%s</a>' % (i, emo, esc(name))
                   for i, (name, emo, _) in enumerate(CHECKLIST))
    home_faq = [("Par où commencer pour adapter la maison d'un parent âgé ?", "Commencez par la salle de bains et les trajets de nuit : tapis antidérapants, siège de douche, barres d'appui et veilleuses. Notre guide pièce par pièce classe tout par priorité."),
                ("Qui peut conseiller sur le bon équipement ?", "Le médecin traitant, le pharmacien et l'ergothérapeute. L'ergothérapeute peut venir au domicile pour proposer des aménagements adaptés."),
                ("Ce site vend-il du matériel ?", "Non. Nous rédigeons des guides indépendants. Certains liens mènent vers Amazon et nous rapportent une commission, sans surcoût pour vous.")]
    fh, fs = faq_html(home_faq)
    _g = {}
    for x in guides: _g.setdefault(x['cat'], []).append(x)
    themes = ''.join('<div class="theme"><h3>%s</h3><ul>%s</ul></div>' % (esc(c), ''.join('<li><a href="{R}%s">%s</a></li>' % (x['slug'], esc(x['short'])) for x in xs)) for c, xs in _g.items())
    body = f'''<section class="hero"><div class="wrap hero-in">
<p class="kicker">Guides pratiques pour les seniors et leurs proches</p>
<h1>Rester chez soi, en sécurité et en confiance</h1>
<p class="lead">Siège de douche, barres d'appui, rollator, téléphone simple : des conseils clairs pour choisir le bon équipement et adapter la maison, pièce par pièce.</p>
<div class="hero-btns"><a class="btn" href="{{R}}amenager-logement-personne-agee/">Le guide pièce par pièce</a><a class="btn ghost" href="{{R}}guides/">Lire les guides</a></div>
</div></section>
<div class="wrap">
<aside class="quizcta"><div><strong>🧭 Quel équipement pour votre proche ?</strong><span>Répondez à 6 questions et obtenez une liste adaptée à sa situation, en 1 minute.</span></div><a class="btn" href="{{R}}quel-equipement/">Faire le questionnaire</a></aside>
<section><h2>Par pièce et par besoin</h2><div class="rooms">{cats}</div></section>
<section><h2>Nos derniers guides</h2><div class="cards">{''.join(card(x) for x in latest[:6])}</div></section>
<section><h2>Tous les guides par thème</h2><div class="themes">{themes}</div>
<p class="more"><a href="{{R}}guides/">Voir tous les guides</a></p></section>
<section class="why"><h2>Pourquoi ce site ?</h2>
<p>Quand un parent commence à perdre en autonomie, on doit souvent s'équiper vite, sans savoir quoi acheter. Les fiches produits des magasins listent des caractéristiques, mais expliquent rarement comment choisir. Ici, on vous dit ce qui compte vraiment, pour qui, et à quoi faire attention.</p>
<p>Nos conseils sont généraux. Pour une situation précise, demandez l'avis du médecin, d'un ergothérapeute ou du pharmacien.</p></section>
{pdf_box('accueil')}
{fh}
</div>'''
    page('', 'Vieillir chez soi : guides pour adapter la maison des seniors',
         "Siège de douche, barres d'appui, rollator, téléphone senior : guides pour adapter la maison et rester chez soi en sécurité.", body, schema=fs, prio='1.0')

    # Guide pilier : aménager le logement pièce par pièce (ancienne checklist)
    total = sum(len(it) for _, _, it in CHECKLIST)
    toc = ''.join('<li><a href="#c%d">%s</a></li>' % (i, esc(n)) for i, (n, _, _) in enumerate(CHECKLIST))
    secs = ''
    for i, (name, emo, items) in enumerate(CHECKLIST):
        rows = ''.join(
            '<li class="item p%d"><span class="it-name">%s</span><span class="prio">%s</span><p>%s</p>'
            '<a class="amz" href="%s" %s>Voir les modèles</a></li>' % (p, esc(n), PRIO[p], esc(c), amz(q), A)
            for n, q, p, c in items)
        rel = [x for x in guides if x['cat'] == ROOM_CAT.get(name)]
        more = ('<p class="room-more">Nos guides : ' + ', '.join('<a href="{R}%s">%s</a>' % (x['slug'], esc(x['short'])) for x in rel) + '.</p>') if rel else ''
        secs += ('<section class="cl-sec t-%s" id="c%d"><h2><span aria-hidden="true">%s</span> %s</h2><p class="room-intro">%s</p>'
                 '<ul class="cl">%s</ul>%s</section>') % (TINTS[i % len(TINTS)], i, emo, esc(name), ROOM_INTRO.get(name, ''), rows, more)
    fh, fs = faq_html(HUB_FAQ)
    art = [{"@context": "https://schema.org", "@type": "Article", "headline": "Aménager le logement d'une personne âgée : le guide pièce par pièce",
            "inLanguage": "fr", "author": AUTHOR_LD, "publisher": PUBLISHER_LD,
            "mainEntityOfPage": BASE + '/' + HUB, "datePublished": dates[HUB], "dateModified": TODAY}]
    body = f'''<div class="wrap art-wrap"><article class="prose">
<p class="art-cat t-sable"><span aria-hidden="true">🏡</span> Guide complet</p>
<h1>Aménager le logement d'une personne âgée : le guide pièce par pièce</h1>
<p class="meta">Mis à jour le {fr_date(TODAY)}</p>
{HUB_INTRO}
<nav class="toc" aria-label="Sommaire"><strong>Sommaire</strong><ol>{toc}</ol></nav>
<p class="legend">Pour chaque équipement, un niveau de priorité : <span class="prio p1">Essentiel</span> <span class="prio p2">Utile</span> <span class="prio p3">Selon les besoins</span></p>
{secs}
{HUB_OUTRO}
{pdf_box('pilier')}
{fh}
<p class="disc-in">Ces conseils sont généraux et ne remplacent pas l'avis d'un professionnel de santé. Liens d'affiliation : nous touchons une commission sur certains achats, sans surcoût pour vous.</p>
</article></div>'''
    page(HUB, "Aménager le logement d'une personne âgée : guide pièce par pièce",
         f"Salle de bains, déplacements, sécurité, chambre : comment aménager le logement d'une personne âgée, avec {total} équipements classés par priorité.",
         body, schema=art + fs, crumbs=[('Aménager le logement', HUB)], prio='0.9', kind='article', og=og_for(HUB, "Aménager le logement d'une personne âgée", '🏡 Guide pièce par pièce'))
    # Ancienne adresse /checklist/ : redirection
    d = os.path.join(OUT, 'checklist'); os.makedirs(d, exist_ok=True)
    open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(
        '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Page déplacée</title>'
        '<link rel="canonical" href="%s/%s"><meta name="robots" content="noindex">'
        '<meta http-equiv="refresh" content="0; url=../%s"></head><body><p><a href="../%s">Aménager le logement d\'une personne âgée</a></p></body></html>' % (BASE, HUB, HUB, HUB))

    # Questionnaire
    qdata = {k: {"n": n, "u": amz(q), "c": c, "g": g} for k, (n, q, c, g) in ITEMS.items()}
    qhtml = ''
    for qi, (qid, txt, multi, opts) in enumerate(QUESTIONS):
        typ = 'checkbox' if multi else 'radio'
        qhtml += '<fieldset class="q"><legend><span>%d</span> %s</legend>%s</fieldset>' % (qi + 1, esc(txt), ''.join(
            '<label class="opt"><input type="%s" name="%s" value="%s" data-e="%s" data-u="%s"%s> %s</label>' % (
                typ, qid, v, ' '.join(e), ' '.join(u), ' required' if not multi and oi == 0 else '', esc(lab)) for oi, (v, lab, e, u) in enumerate(opts)))
    qfaq = [("Ce questionnaire remplace-t-il l'avis d'un professionnel ?", "Non. Il donne des pistes générales. Le médecin traitant, l'ergothérapeute ou le pharmacien peuvent conseiller l'équipement adapté à la situation précise de la personne."),
            ("Mes réponses sont-elles enregistrées ?", "Non. Les réponses restent dans votre navigateur. Seul le lien de partage contient vos choix, si vous décidez de l'envoyer.")]
    fh, fs = faq_html(qfaq)
    body = f'''<div class="wrap art-wrap"><article class="prose">
<p class="art-cat t-ciel"><span aria-hidden="true">🧭</span> Questionnaire gratuit</p>
<h1>Quel équipement pour mon parent âgé ?</h1>
<p class="lead">Répondez à 6 questions sur la situation de votre proche. Vous obtenez une liste d'équipements classés par priorité, avec nos guides pour bien les choisir.</p>
<form id="quiz" class="quiz">{qhtml}<button class="btn" type="submit">Voir les équipements conseillés</button></form>
<section id="quiz-res" class="quiz-res" hidden aria-live="polite"></section>
<script type="application/json" id="quiz-data">{json.dumps(qdata, ensure_ascii=False)}</script>
<div class="note"><strong>Un conseil personnalisé ?</strong> Ce questionnaire donne des pistes générales. Pour une situation précise, demandez l\'avis du médecin traitant, d\'un ergothérapeute ou du pharmacien.</div>
{{fh}}
</article></div>'''.replace('{fh}', fh)
    page('quel-equipement/', "Quel équipement pour une personne âgée ? Questionnaire gratuit",
         "Questionnaire gratuit en 6 questions : découvrez quel équipement installer pour aider un parent âgé à rester chez lui en sécurité, classé par priorité.",
         body, schema=fs, crumbs=[('Questionnaire', 'quel-equipement/')], prio='0.9')

    # Guides
    groups = {}
    for x in guides: groups.setdefault(x['cat'], []).append(x)
    gb = ''.join('<section><h2>%s</h2><div class="cards">%s</div></section>' % (esc(c), ''.join(card(x, '../') for x in xs))
                 for c, xs in groups.items())
    page('guides/', 'Guides pour adapter la maison des seniors',
         "Tous nos guides pour choisir l'équipement du maintien à domicile : salle de bains, déplacements, sécurité, vie quotidienne et repos.",
         '<div class="wrap"><h1>Tous les guides</h1><p class="lead">' + str(len(guides)) + ' guides pour choisir le bon équipement, sans jargon.</p>' + gb.replace('{R}', '../') + '</div>',
         crumbs=[('Guides', 'guides/')], prio='0.8')

    for x in guides:
        fh, fs = faq_html(x['faq'])
        emo, tint = META.get(x['slug'], ('📘', 'sauge'))
        same = [o for o in latest if o['slug'] != x['slug'] and o['cat'] == x['cat']]
        others = (same + [o for o in latest if o['slug'] != x['slug'] and o not in same])[:3]
        gbody = pick_box_guide(add_toc(x['body']), x['slug'])
        meta = ('<p class="meta">Mis à jour le %s' + BYLINE + ' · %d min de lecture</p>') % (fr_date(dates[x['slug']]), read_min(x['body']))
        rel = '<section class="related"><h2>À lire aussi</h2><div class="cards">%s</div></section>' % ''.join(card(o) for o in others) if others else ''
        art = [{"@context": "https://schema.org", "@type": "Article", "headline": x['h1'], "description": x['desc'],
                "inLanguage": "fr", "author": AUTHOR_LD, "publisher": PUBLISHER_LD,
                "mainEntityOfPage": BASE + '/' + x['slug'], "datePublished": dates[x['slug']], "dateModified": dates[x['slug']]}]
        body = ('<div class="wrap art-wrap"><article class="prose"><p class="art-cat t-%s"><span aria-hidden="true">%s</span> %s</p><h1>%s</h1>%s%s%s'
                '<p class="disc-in">Ces conseils sont généraux et ne remplacent pas l\'avis d\'un professionnel de santé. Liens d\'affiliation : nous touchons une commission sur certains achats, sans surcoût pour vous.</p></article>%s</div>') % (
            tint, emo, esc(x['cat']), esc(x['h1']), meta, gbody, fh, rel)
        page(x['slug'], x['title'], x['desc'], body, schema=art + fs, crumbs=[('Guides', 'guides/'), (x['short'], x['slug'])], prio='0.7', kind='article', og=og_for(x['slug'], x['h1'], emo + ' ' + x['cat']))

    # Pages légales
    page('a-propos/', 'À propos de Vieillir chez soi', "Qui sommes-nous, comment nous choisissons nos conseils et comment le site est financé.",
         f'''<div class="wrap art-wrap"><article class="prose"><h1>À propos</h1>
<p>Vieillir chez soi aide les seniors et leurs proches à choisir l'équipement utile pour rester à la maison en sécurité. Le site est édité par Jérémy Dacier-Jury.</p>
<h2>Qui écrit</h2><p>Les articles sont rédigés et relus par Jérémy Dacier-Jury, éditeur du site, avec l'aide d'outils de rédaction. Chaque page indique sa date de mise à jour.</p>
<h2>Notre méthode</h2><ul><li><strong>Des sources officielles</strong> pour les aides, les droits et les démarches : service-public.fr, pour-les-personnes-agees.gouv.fr, l'Anah, l'Assurance retraite, l'Assurance maladie. Les liens figurent en bas des articles.</li>
<li><strong>Des critères de choix expliqués</strong> pour chaque équipement : sécurité, normes, facilité d'usage, entretien. Nous ne testons pas nous-mêmes tous les produits : les comparatifs s'appuient sur les fiches des fabricants, les normes et les retours d'utilisateurs.</li>
<li><strong>Aucun prix ni caractéristique non vérifiés.</strong> Les montants des aides sont datés et revérifiés lors des mises à jour.</li>
<li><strong>Des corrections rapides</strong> : une erreur ou une information dépassée ? <a href="/contact/">Signalez-la</a>, nous la corrigeons.</li></ul>
<p>Nos articles sont des conseils généraux : pour une situation précise, l'avis du médecin, d'un ergothérapeute ou du pharmacien prime toujours.</p>
<h2>Comment le site est financé</h2><p>{DISCLOSURE} Quand vous achetez après avoir cliqué sur un lien vers Amazon, nous touchons une commission, sans surcoût pour vous. Cela ne change pas nos conseils.</p>
<h2>Contact</h2><p><a href="mailto:{CONTACT}">{CONTACT}</a></p></article></div>''', crumbs=[('À propos', 'a-propos/')], prio='0.3')
    page('contact/', 'Contact : écrire à Vieillir chez soi', "Une question, une erreur à signaler ou une proposition de partenariat ? Écrivez à l'équipe de Vieillir chez soi : voici comment nous joindre.",
         f'''<div class="wrap art-wrap"><article class="prose"><h1>Nous contacter</h1>
<p>Le plus simple est de nous écrire à <a href="mailto:{CONTACT}"><strong>{CONTACT}</strong></a>. Nous lisons tous les messages et répondons en général sous quelques jours.</p>
<h2>Pour quoi nous écrire ?</h2>
<ul><li><strong>Une erreur ou une information dépassée</strong> sur une page : dites-nous laquelle, nous la corrigeons.</li>
<li><strong>Une suggestion de sujet</strong> : un équipement ou une démarche que vous aimeriez voir expliqué.</li>
<li><strong>Une proposition de partenariat ou de publicité</strong> : consultez d'abord notre page <a href="{{R}}publicite-partenariats/">Publicité et partenariats</a>.</li></ul>
<h2>Ce que nous ne pouvons pas faire</h2>
<p>Nous ne vendons rien nous-mêmes : pour une commande, une livraison ou un retour, adressez-vous au vendeur chez qui vous avez acheté. Nous ne pouvons pas non plus donner d'avis médical personnalisé. Pour une situation précise, le médecin traitant, un ergothérapeute ou le pharmacien sont les bons interlocuteurs.</p>
<p>En cas d'urgence, appelez le 15 (Samu) ou le 112.</p></article></div>''', crumbs=[('Contact', 'contact/')], prio='0.3')
    page('publicite-partenariats/', 'Publicité et partenariats sur Vieillir chez soi', "Marques, fabricants, services d'aide à domicile : découvrez comment travailler avec Vieillir chez soi, site de conseils sur le maintien à domicile des seniors.",
         f'''<div class="wrap art-wrap"><article class="prose"><h1>Publicité et partenariats</h1>
<p>Vieillir chez soi publie des guides pratiques et des comparatifs pour aider les seniors et leurs proches à rester à la maison en sécurité : salle de bain, chambre, escaliers, aides à la marche, téléassistance, sécurité du logement. Si votre entreprise propose des produits ou des services utiles à ce public, nous serons heureux d'en discuter.</p>
<h2>Notre public</h2>
<p>Deux types de lecteurs viennent sur le site : des seniors qui veulent garder leur autonomie, et surtout leurs proches aidants (enfants adultes, conjoints) qui cherchent une solution concrète, souvent après une chute, une sortie d'hôpital ou une perte d'autonomie. Ce sont des lecteurs qui comparent avant d'acheter.</p>
<h2>Ce que nous proposons</h2>
<ul><li><strong>Partenariat d'affiliation</strong> : votre produit ou service est présenté dans les guides où il est vraiment utile, avec un lien suivi.</li>
<li><strong>Article sponsorisé</strong> : un contenu consacré à votre solution, rédigé par nos soins et clairement signalé comme « partenariat ».</li>
<li><strong>Présentation de service</strong> : téléassistance, aide à domicile, adaptation du logement, monte-escalier, livraison de repas.</li></ul>
<h2>Nos règles</h2>
<ul><li>Tout contenu payé est signalé comme tel, et les liens sont marqués « sponsorisés ».</li>
<li>Nos comparatifs restent indépendants : aucune place dans un classement ne s'achète.</li>
<li>Nous n'acceptons que des produits et services liés au bien-vieillir à domicile, et rien qui promette un effet médical non prouvé.</li>
<li>Nous nous réservons le droit de refuser une proposition qui ne servirait pas nos lecteurs.</li></ul>
<h2>Nous écrire</h2>
<p>Envoyez-nous un message à <a href="mailto:{CONTACT}?subject=Partenariat"><strong>{CONTACT}</strong></a> en présentant votre entreprise, votre produit ou service et le type de collaboration envisagé. Nous vous répondrons avec nos conditions.</p></article></div>''', crumbs=[('Publicité et partenariats', 'publicite-partenariats/')], prio='0.3')
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
<h2>Guide PDF et e-mails</h2><p>Si vous demandez le guide PDF, nous enregistrons votre adresse e-mail et, seulement si vous avez coché la case, votre accord pour recevoir des conseils par e-mail. Vous pouvez demander la suppression de votre adresse à tout moment en écrivant à <a href="mailto:{CONTACT}">{CONTACT}</a>. Chaque e-mail contiendra un lien de désinscription.</p>
<h2>Mesure d'audience</h2><p>Nous comptons les pages vues et les clics vers Amazon de façon anonyme (page visitée, site d'origine, type d'appareil et un identifiant aléatoire stocké dans votre navigateur). Aucune donnée n'est vendue ni utilisée pour de la publicité. Ces données sont hébergées par Supabase dans l'Union européenne.</p>
<h2>Amazon</h2><p>Quand vous cliquez sur un lien vers Amazon.fr, Amazon peut déposer des cookies pour attribuer la commission. Consultez la politique de confidentialité d'Amazon pour en savoir plus.</p><h2>Publicité</h2><p>Le site affiche des annonces Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser et mesurer ces annonces, selon vos choix de consentement. Plus d'informations : <a href="https://policies.google.com/technologies/ads?hl=fr" rel="noopener" target="_blank">règles de Google sur la publicité</a>.</p>
<h2>Contact</h2><p><a href="mailto:{CONTACT}">{CONTACT}</a></p></article></div>''',
         crumbs=[('Confidentialité', 'confidentialite/')], prio='0.1')

    sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(
        '  <url><loc>%s/%s</loc><lastmod>%s</lastmod><priority>%s</priority></url>\n' % (BASE, p, TODAY, pr) for p, pr in PAGES) + '</urlset>\n'
    open(os.path.join(OUT, 'sitemap.xml'), 'w', encoding='utf-8').write(sm)
    if STANDALONE:
        open(os.path.join(OUT, 'CNAME'), 'w').write(DOMAIN + '\n')
        open(os.path.join(OUT, '.nojekyll'), 'w').write('')
        try: shutil.copy(os.path.join(OUT, 'assets', 'favicon.ico'), os.path.join(OUT, 'favicon.ico'))
        except Exception: pass
        open(os.path.join(OUT, 'da4540821acf4048569bad7fbedc3ee1.txt'), 'w').write('da4540821acf4048569bad7fbedc3ee1')  # cle IndexNow
    open(os.path.join(OUT, 'ads.txt'), 'w').write('google.com, pub-8638687738606649, DIRECT, f08c47fec0942fa0\n')
    open(os.path.join(OUT, 'robots.txt'), 'w').write('User-agent: *\nAllow: /\n\nSitemap: %s/sitemap.xml\n' % BASE)
    # llms.txt : résumé du site pour les IA (généré à chaque build)
    try:
        import html as _h
        _out = ['# ' + SITE, '', '> ' + LLMS_INTRO, '', 'Site : ' + BASE + '/', 'Langue : français', '', '## Pages']
        for _loc in re.findall(r'<loc>([^<]+)</loc>', sm):
            _rel = _loc[len(BASE):].strip('/')
            _f = os.path.join(OUT, _rel, 'index.html') if _rel else os.path.join(OUT, 'index.html')
            if not os.path.exists(_f): continue
            _t = open(_f, encoding='utf-8').read()
            _ti = re.search(r'<title>(.*?)</title>', _t, re.S)
            _de = re.search(r'<meta name="description" content="([^"]*)"', _t)
            if not _ti or 'http-equiv="refresh"' in _t: continue
            _out.append('- [%s](%s)%s' % (_h.unescape(_ti.group(1)).strip(), _loc, (': ' + _h.unescape(_de.group(1)).strip()) if _de else ''))
        open(os.path.join(OUT, 'llms.txt'), 'w', encoding='utf-8').write('\n'.join(_out) + '\n')
    except Exception as _e:
        print('llms.txt non généré :', _e)
    if not STANDALONE:
        # L'ancienne adresse (jeremstyke.github.io/vieillirchezsoi/) ne sert plus que des renvois vers le domaine.
        # Le vrai site est construit dans le dépôt jeremstyke/viellirchezsoi (synchronisation automatique toutes les heures).
        import runpy
        runpy.run_path(os.path.join(os.path.dirname(HERE), 'redirect_old.py'))
    print('%d pages, %d guides' % (len(PAGES), len(guides)))

if __name__ == '__main__':
    build()
