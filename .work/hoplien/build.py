# Génère le site Hoplien dans /hoplien/ (servi sur hoplien.fr par le Worker Cloudflare)
import os, json, datetime
ROOT = os.path.join(os.path.dirname(__file__), "..", "..", "hoplien")
BASE = "https://hoplien.fr"
AUJ = datetime.date.today().isoformat()
FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@500;700&family=Atkinson+Hyperlegible:wght@400;700&display=swap" rel="stylesheet">'
ICON = "<link rel=\"icon\" href=\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='16' fill='%232F4BFF'/><path d='M38 12 24 52' stroke='%23FFD23F' stroke-width='8' stroke-linecap='round'/></svg>\">"
pages = []

def esc(s): return s.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;")

def page(path, title, desc, body, robots="index,follow", schema=None, qr=False, sitemap=True):
    depth = path.strip("/").count("/") + 1 if path.strip("/") else 0
    R = "../" * depth
    sch = "".join(f'<script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>' for x in (schema or []))
    html = f'''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<meta name="robots" content="{robots}">
<link rel="canonical" href="{BASE}{path}">
<meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(desc)}"><meta property="og:url" content="{BASE}{path}"><meta property="og:type" content="website"><meta property="og:site_name" content="Hoplien"><meta property="og:locale" content="fr_FR">
{ICON}
{FONTS}
<link rel="stylesheet" href="{R}assets/hop.css?v=1">
{sch}
</head>
<body>
<header class="wrap">
<nav aria-label="Principal">
  <a class="logo" href="{R}./">hop<i>/</i>lien</a>
  <ul>
    <li><a href="{R}guides/">Guides</a></li>
    <li><a href="{R}signaler/">Signaler un lien</a></li>
    <li><a class="co" href="{R}compte/">Mon compte</a></li>
  </ul>
</nav>
</header>
<main>
{body.replace("{R}", R)}
</main>
<footer>
  <div class="wrap">
    <span><b class="logo" style="font-size:18px;color:var(--encre)">hop<i>/</i>lien</b>, raccourcisseur de liens fait en France.</span>
    <span><a href="{R}guides/">Guides</a> <a href="{R}mentions-legales/">Mentions légales</a> <a href="{R}signaler/">Signaler un abus</a></span>
  </div>
</footer>
<div class="toast" id="toast" role="status"></div>
{f'<script src="{R}assets/qrcode.js"></script>' if qr else ''}
<script src="{R}assets/hop.js?v=1"></script>
</body>
</html>
'''
    d = os.path.join(ROOT, path.strip("/"))
    os.makedirs(d, exist_ok=True)
    open(os.path.join(d, "index.html"), "w").write(html)
    if sitemap and "noindex" not in robots: pages.append(path)

OUTIL = '''<form class="outil" id="f" autocomplete="off">
    <label for="url" class="sr">Lien à raccourcir</label>
    <input id="url" type="text" inputmode="url" placeholder="Collez votre long lien ici">
    <button class="btn" type="submit">Raccourcir</button>
  </form>
  <div class="perso" id="perso">
    <label for="alias">Nom personnalisé <small>(facultatif, avec un compte)</small></label>
    <div class="perso-l"><span>hoplien.fr/</span><input id="alias" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" maxlength="40" placeholder="soldes-noel"></div>
    <p class="perso-info" id="perso-info"><a href="{R}compte/">Connectez-vous gratuitement</a> pour choisir le nom de vos liens.</p>
  </div>
  <p class="err" id="err" role="alert"></p>
  <ul class="rassure">
    <li>Gratuit et sans inscription</li>
    <li>Chaque lien vérifié contre les arnaques</li>
    <li>Aucune pub avant la redirection</li>
  </ul>
  <div class="resultat" id="res" aria-live="polite">
    <div>
      <p class="long" id="r-long"></p>
      <p class="court" id="r-court"></p>
      <p class="gain" id="r-gain"></p>
    </div>
    <div class="act">
      <button class="btn petit" id="copier" type="button">Copier</button>
      <button class="btn petit clair" id="voirqr" type="button">QR code</button>
    </div>
    <div class="qr" id="qr">
      <canvas id="cv" class="vrai" aria-label="QR code de votre lien court"></canvas>
      <div><p>Imprimez-le sur une affiche, un menu ou une carte de visite : on le scanne avec un téléphone et on arrive sur votre page.</p><button class="btn petit dl" id="dlqr" type="button">Télécharger le QR code</button></div>
    </div>
    <p class="cta-compte" id="cta-compte">Envie de choisir le nom de vos liens et de savoir combien de personnes cliquent ? <a href="{R}compte/">Créez votre compte gratuit</a>, sans mot de passe.</p>
  </div>
  <div class="mes cache" id="mes"><h2>Vos derniers liens</h2><ul id="mes-l"></ul></div>'''

FAQ = [
 ("Comment raccourcir un lien gratuitement ?", "Collez votre lien dans la case en haut de la page et cliquez sur Raccourcir. Votre lien court apparaît tout de suite, prêt à copier. Pas besoin de compte."),
 ("Faut-il créer un compte ?", "Non, pas pour raccourcir un lien. Le compte, gratuit et sans mot de passe, sert à choisir un nom personnalisé (hoplien.fr/soldes-noel), à retrouver tous vos liens et à voir combien de personnes ont cliqué, jour par jour."),
 ("Comment choisir le nom de mon lien ?", "Connectez-vous à votre compte gratuit, puis remplissez la case Nom personnalisé sous le lien à raccourcir. Lettres, chiffres et tirets, de 3 à 40 caractères. Si le nom est déjà pris, essayez une variante."),
 ("Mes liens courts expirent-ils ?", "Non. Un lien créé reste actif, sauf s'il mène vers un site dangereux ou s'il est signalé comme une arnaque."),
 ("Est-ce que vous mettez de la pub avant la redirection ?", "Jamais. Vos visiteurs arrivent directement sur votre page, sans écran d'attente."),
 ("Je peux créer un QR code avec mon lien ?", "Oui, en un clic après avoir raccourci votre lien, puis vous le téléchargez en image pour l'imprimer."),
 ("Que deviennent les données de mes visiteurs ?", "Nous comptons seulement le nombre de clics par jour. Nous n'enregistrons ni l'adresse IP de vos visiteurs ni leur identité."),
]
faq_html = "".join(f"<details><summary>{q}</summary><p>{a}</p></details>" for q, a in FAQ)
faq_schema = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQ]}

GUIDES = [
 ("raccourcir-un-lien-amazon", "Raccourcir un lien Amazon : la méthode simple", "Un lien Amazon fait souvent 300 caractères. Voici comment le raccourcir en 2 secondes, et ce qu'il faut savoir si vous êtes partenaire Amazon.",
  '''<p class="chapo">Un lien de produit Amazon traîne souvent des centaines de caractères inutiles : identifiants de recherche, mots-clés, numéros de session. Pour l'envoyer par message ou le mettre dans une story, mieux vaut le raccourcir.</p>
<h2>Étape 1 : nettoyer le lien</h2>
<p>Tout ce qui compte dans un lien Amazon, c'est le code produit qui suit <b>/dp/</b> (10 caractères, par exemple B0CXYZ1234). Le lien <b>amazon.fr/dp/B0CXYZ1234</b> mène exactement au même produit que la version de 300 caractères.</p>
<h2>Étape 2 : le raccourcir avec Hoplien</h2>
<p>Collez le lien (nettoyé ou non) dans la case en haut de <a href="{R}">la page d'accueil</a> et cliquez sur Raccourcir. Vous obtenez un lien du type hoplien.fr/ab3k9, facile à copier et à dicter.</p>
<h2>Vous êtes partenaire Amazon ?</h2>
<p>Attention : le programme Partenaires d'Amazon demande que les liens affiliés restent clairement identifiables comme des liens Amazon. Pour vos liens affiliés, utilisez le raccourcisseur officiel d'Amazon (amzn.to), disponible dans la barre SiteStripe quand vous êtes connecté à votre compte Partenaires. Hoplien convient pour les liens Amazon classiques, sans code affilié.</p>
<h2>Pour aller plus loin</h2>
<p>Avec un <a href="{R}compte/">compte Hoplien gratuit</a>, vous voyez combien de personnes ont cliqué sur chaque lien, jour par jour.</p>'''),
 ("creer-un-qr-code-gratuit", "Créer un QR code gratuit qui ne s'arrête jamais", "Comment créer un QR code gratuit pour une affiche, un menu ou une carte de visite, sans abonnement caché ni QR code qui expire.",
  '''<p class="chapo">Beaucoup de sites proposent des QR codes « gratuits » qui cessent de fonctionner au bout de 14 jours, sauf à payer un abonnement. Avec Hoplien, le QR code mène à votre lien court, qui ne s'arrête pas.</p>
<h2>Créer le QR code en 3 clics</h2>
<ul><li>Collez votre lien dans la case de <a href="{R}">la page d'accueil</a> et cliquez sur Raccourcir.</li><li>Cliquez sur QR code.</li><li>Cliquez sur Télécharger : vous obtenez une image prête à imprimer.</li></ul>
<h2>Bien l'imprimer</h2>
<p>Gardez au moins 2 cm de côté sur un flyer, 3 cm sur une affiche vue de près, et laissez une marge blanche tout autour. Testez-le toujours avec votre téléphone avant l'impression.</p>
<h2>Savoir si on le scanne</h2>
<p>Chaque scan compte comme un clic sur votre lien court. Avec un <a href="{R}compte/">compte gratuit</a>, vous suivez le nombre de scans jour par jour : pratique pour savoir si une affiche marche.</p>'''),
 ("alternative-francaise-a-bitly", "Une alternative française et gratuite à Bitly", "Bitly limite fortement son offre gratuite. Hoplien est un raccourcisseur français, gratuit, sans pub avant la redirection.",
  '''<p class="chapo">Bitly est le raccourcisseur le plus connu, mais son offre gratuite est devenue très limitée et tout se passe en anglais. Si vous cherchez une solution simple, en français, voici ce que propose Hoplien.</p>
<h2>Ce qui est pareil</h2>
<p>Un lien court en un clic, un QR code, et le nombre de clics sur chaque lien si vous créez un compte.</p>
<h2>Ce qui change</h2>
<ul><li>Pas besoin de compte pour raccourcir un lien.</li><li>Aucune pub ni page d'attente avant la redirection.</li><li>Un site et une aide en français.</li><li>Chaque lien est vérifié pour éviter les arnaques, et tout le monde peut <a href="{R}signaler/">signaler un lien</a>.</li></ul>
<h2>Ce que Hoplien ne fait pas encore</h2>
<p>Les liens personnalisés (hoplien.fr/mon-mot) sont gratuits avec un <a href="{R}compte/">compte</a>. Les noms de domaine à votre marque ne sont pas encore disponibles. Pour la plupart des usages du quotidien, réseaux sociaux, messages, affiches, le lien court classique suffit.</p>
<p><a class="btn" href="{R}" style="display:inline-block;text-decoration:none">Raccourcir un lien maintenant</a></p>'''),
]

# Accueil
page("/", "Raccourcir un lien gratuitement : Hoplien, raccourcisseur d'URL français", "Raccourcissez un lien en 1 clic, gratuitement et sans inscription. QR code offert, aucune pub avant la redirection, liens vérifiés contre les arnaques.", f'''
<div class="wrap hero">
  <h1>Un lien trop long ? Hop<span class="slash">/</span> il est court.</h1>
  <p class="chapo">Collez votre lien, il devient court, propre et facile à partager. Gratuit, sans compte, fait en France.</p>
  {OUTIL}
</div>
<section class="blanc">
  <div class="wrap">
    <h2>Simple, propre, sans mauvaise surprise.</h2>
    <p class="sous">Un raccourcisseur qui fait une seule chose, et la fait bien.</p>
    <div class="trois">
      <div><h3>Pas de pub sur vos liens</h3><p>Vos visiteurs arrivent directement sur votre page. Pas d'écran d'attente, pas de compte à rebours.</p></div>
      <div><h3>Un QR code offert</h3><p>Chaque lien court a son QR code, à télécharger et imprimer sur une affiche, un menu ou une carte.</p></div>
      <div><h3>Un compte gratuit</h3><p>Sans mot de passe : choisissez le nom de vos liens (hoplien.fr/soldes-noel) et voyez combien de personnes cliquent, jour par jour.</p></div>
    </div>
  </div>
</section>
<section class="anti">
  <div class="wrap">
    <h2>Pas d'arnaque derrière nos liens<span class="slash">.</span></h2>
    <p class="sous">Les raccourcisseurs servent parfois à cacher des liens dangereux. Chez nous, chaque lien est contrôlé.</p>
    <div class="etapes">
      <div><h3>Avant</h3><p>Le lien est vérifié avant d'être créé. Les sites dangereux, les traceurs d'adresse IP et les liens déjà raccourcis sont refusés.</p></div>
      <div><h3>Ensuite</h3><p>Un lien qui devient dangereux est bloqué : vos visiteurs voient un avertissement au lieu d'arriver sur le site.</p></div>
      <div><h3>Grâce à vous</h3><p>Tout le monde peut <a href="signaler/" style="color:var(--soleil)">signaler un lien</a>. Nous l'examinons rapidement.</p></div>
    </div>
  </div>
</section>
<section class="blanc" id="faq">
  <div class="wrap">
    <h2>Questions fréquentes</h2>
    {faq_html}
    <div class="guides" aria-label="Guides">{"".join(f'<a href="guides/{s}/">{t.split(":")[0]}</a>' for s, t, d, b in GUIDES)}</div>
  </div>
</section>''', schema=[faq_schema, {"@context": "https://schema.org", "@type": "WebApplication", "name": "Hoplien", "url": BASE + "/", "applicationCategory": "UtilitiesApplication", "operatingSystem": "Tous", "inLanguage": "fr", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "EUR"}}], qr=True)

# Compte
page("/compte/", "Mon compte Hoplien : mes liens courts et leurs clics", "Retrouvez tous vos liens courts Hoplien et le nombre de clics, jour par jour. Compte gratuit, sans mot de passe.", '''
<div class="wrap hero" id="compte">
  <div id="v-co">
    <h1>Suivez vos liens<span class="slash">/</span></h1>
    <p class="chapo">Un compte gratuit, sans mot de passe : entrez votre e-mail, vous recevez un lien de connexion. Vous pourrez choisir le nom de vos liens (hoplien.fr/soldes-noel) et suivre leurs clics, jour par jour.</p>
    <form class="outil" id="co-f">
      <label for="co-email" class="sr">Votre e-mail</label>
      <input id="co-email" type="email" inputmode="email" autocomplete="email" placeholder="vous@exemple.fr">
      <button class="btn" type="submit">Recevoir mon lien</button>
    </form>
    <p class="err" id="co-msg" role="status" style="color:var(--encre)"></p>
    <ul class="rassure"><li>Gratuit, sans mot de passe</li><li>Les liens créés sur cet appareil s'ajoutent tout seuls</li><li>Aucune pub par e-mail</li></ul>
  </div>
  <div id="v-moi" class="cache">
    <h1>Mes liens</h1>
    <p class="chapo"><span id="moi-email"></span>. <span id="moi-tot"></span>.</p>
    <p><a class="btn" href="{R}" style="display:inline-block;text-decoration:none">Raccourcir un nouveau lien</a> <button class="btn clair" id="deco" type="button">Se déconnecter</button></p>
    <ul class="tableau" id="moi-l"></ul>
  </div>
</div>''', robots="noindex,follow")

# Signaler
page("/signaler/", "Signaler un lien Hoplien dangereux ou frauduleux", "Un lien hoplien.fr mène vers une arnaque, un virus ou un contenu illégal ? Signalez-le, nous l'examinons rapidement.", '''
<div class="wrap hero">
  <h1>Signaler un lien</h1>
  <p class="chapo">Un lien hoplien.fr vous semble mener vers une arnaque, un faux site, un virus ou un contenu illégal ? Dites-le nous. Un lien signalé plusieurs fois est bloqué automatiquement en attendant notre vérification.</p>
  <form class="signal-f" id="sig">
    <label for="s-code">Le lien Hoplien</label>
    <input id="s-code" type="text" placeholder="hoplien.fr/ab3k9" required>
    <label for="s-motif">Ce qui ne va pas (facultatif)</label>
    <select id="s-motif" name="motif"><option>Arnaque ou faux site</option><option>Virus ou téléchargement dangereux</option><option>Contenu illégal</option><option>Spam</option><option>Autre</option></select>
    <button class="btn" type="submit">Signaler ce lien</button>
    <p class="err" id="sig-msg" role="status" style="color:var(--encre)"></p>
  </form>
</div>''')

# Lien bloqué et lien introuvable (servis par le Worker)
page("/bloque/", "Lien bloqué par Hoplien", "Ce lien court a été bloqué.", '''
<div class="wrap hero">
  <h1>Ce lien a été bloqué<span class="slash">.</span></h1>
  <p class="chapo">Ce lien court menait vers un site signalé comme dangereux ou frauduleux. Pour votre sécurité, nous ne vous y envoyons pas.</p>
  <p><a class="btn" href="{R}" style="display:inline-block;text-decoration:none">Aller sur Hoplien</a></p>
</div>''', robots="noindex,nofollow", sitemap=False)
page("/introuvable/", "Lien introuvable : Hoplien", "Ce lien court n'existe pas.", '''
<div class="wrap hero">
  <h1>Ce lien n'existe pas<span class="slash">.</span></h1>
  <p class="chapo">Le lien court que vous avez ouvert n'existe pas ou a été supprimé par son créateur. Vérifiez qu'il n'y a pas d'erreur de frappe.</p>
  <p><a class="btn" href="{R}" style="display:inline-block;text-decoration:none">Raccourcir un lien</a></p>
</div>''', robots="noindex,nofollow", sitemap=False)

# Mentions légales
page("/mentions-legales/", "Mentions légales et confidentialité : Hoplien", "Mentions légales, données personnelles et conditions d'utilisation de Hoplien.", '''
<div class="wrap hero"><article>
<h1>Mentions légales</h1>
<h2>Éditeur</h2><p>Hoplien est édité par Jérémy Dacier-Jury, 9 passage des Tisserands, 38790 Charantonnay. Contact : contact@cvlibre.com.</p>
<h2>Hébergement</h2><p>Site servi par Cloudflare, Inc. (101 Townsend St, San Francisco, CA 94107, États-Unis) et GitHub, Inc. Base de données hébergée dans l'Union européenne par Supabase.</p>
<h2>Utilisation du service</h2><p>Hoplien permet de raccourcir des liens. Il est interdit de l'utiliser pour des arnaques, de l'hameçonnage, des logiciels malveillants, du spam, des contenus illégaux ou pour masquer la destination d'un lien de façon trompeuse. Tout lien de ce type est bloqué ou supprimé, sans préavis. Vous pouvez <a href="{R}signaler/">signaler un lien</a> à tout moment.</p>
<h2>Données personnelles</h2><p>Quand vous créez un lien, nous enregistrons le lien d'origine, la date et une empreinte chiffrée de votre adresse IP (qui ne permet pas de la retrouver), pour limiter les abus. Si vous créez un compte, nous gardons votre adresse e-mail pour vous envoyer vos liens de connexion, et rien d'autre. Pour les clics, nous comptons seulement leur nombre par jour : nous n'enregistrons pas l'adresse IP ni l'identité des personnes qui cliquent. Vous pouvez supprimer vos liens depuis votre compte, et demander la suppression de votre compte en écrivant à contact@cvlibre.com.</p>
<h2>Mesure d'audience</h2><p>Nous mesurons l'audience du site de façon anonyme (pages vues), sans cookie publicitaire.</p>
</article></div>''')

# Guides
for slug, titre, desc, corps in GUIDES:
    page(f"/guides/{slug}/", titre, desc, f'''<div class="wrap hero"><article>
<p class="fil"><a href="{{R}}">Hoplien</a> / <a href="{{R}}guides/">Guides</a></p>
<h1>{titre}</h1>
{corps}
<div class="encart"><p><b>Raccourcir un lien maintenant</b>, gratuitement et sans compte :</p><a class="btn" href="{{R}}" style="display:inline-block;text-decoration:none">Ouvrir Hoplien</a></div>
</article></div>''', schema=[{"@context": "https://schema.org", "@type": "Article", "headline": titre, "description": desc, "inLanguage": "fr", "datePublished": "2026-11-27", "author": {"@type": "Organization", "name": "Hoplien"}}])
page("/guides/", "Guides Hoplien : liens courts et QR codes", "Nos guides pour raccourcir un lien, créer un QR code et partager vos liens plus simplement.", '''<div class="wrap hero"><article>
<h1>Guides</h1><p class="chapo">Tout pour partager vos liens plus simplement.</p>
''' + "".join(f'<h2><a href="{s}/">{t}</a></h2><p>{d}</p>' for s, t, d, b in GUIDES) + "</article></div>")

open(os.path.join(ROOT, "sitemap.xml"), "w").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(f"<url><loc>{BASE}{p}</loc><lastmod>{AUJ}</lastmod></url>\n" for p in pages) + "</urlset>\n")
open(os.path.join(ROOT, "robots.txt"), "w").write(f"User-agent: *\nAllow: /\nDisallow: /compte/\nSitemap: {BASE}/sitemap.xml\n")
print("ok", len(pages), "pages")
