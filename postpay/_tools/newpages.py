# 14 nov 2026 (Jeremy): builds the extra SEO guide pages (EN + FR) from the "buy ads" page used as a template.
import os, re, json
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
B = "https://jeremstyke.github.io/postpay/"
PAGES = {
 "promote": {
  "en": {"slug": "promote-telegram-channel", "title": "How to Promote a Telegram Channel: 7 Ways to Get Real Subscribers",
   "desc": "How to promote a Telegram channel and get real subscribers: ads in channels on the same topic, cross-promotion, shareable content and what to avoid.",
   "crumb": "Promote a Telegram channel", "h1": "How to promote a Telegram channel",
   "lead": "Real subscribers come from people who already read channels like yours. Here are the methods that work, from free to paid, and the ones to avoid.",
   "cta": "📢 Find channels to advertise in", "src": "src_seo_promote_en_ad",
   "body": """<h2>1. Buy a post in channels on the same topic</h2>
<p>It is the fastest way to reach readers who are already interested in your subject. A crypto channel grows with posts in other crypto channels, a recipe channel with posts in food channels. On PostPay you pick a channel, send your ad with a button to your channel, and it is posted for 24 hours. At the end you see how many people clicked.</p>
<h2>2. Swap posts with channels of the same size</h2>
<p>Cross-promotion is free: two owners publish a short post about each other's channel. It works best between channels of similar size and close topics, so both sides gain.</p>
<h2>3. Publish content people forward</h2>
<p>Every forwarded post shows your channel name with a link. Short guides, useful lists, exclusive news and good visuals are forwarded the most. Keep a regular rhythm so new readers see a living channel.</p>
<h2>4. Share your link where you already have an audience</h2>
<ul><li>Your website, newsletter and email signature</li><li>Your other social networks: bio, stories, pinned posts</li><li>Your app or bot, with a "Join our channel" button</li><li>Groups where self-promotion is allowed, without spamming</li></ul>
<h2>5. Use shareable folders</h2>
<p>Telegram lets you share a folder of channels with a single link. Build a folder with channels on your topic, with their owners' agreement, and share it together: each channel brings readers to the others.</p>
<h2>6. Make the first visit count</h2>
<p>A new visitor decides in seconds. Use a clear name and photo, a description that says what they will get and how often, and pin a post that presents your best content.</p>
<h2>7. Measure and buy again where it works</h2>
<p>Compare the cost per click of each channel where you advertised. Buy again where readers clicked the most, and drop the others. Small channels on the exact topic often beat big general ones.</p>
<h2>What to avoid</h2>
<ul><li><b>Fake subscribers and bots.</b> They do not read, they lower your view rate and can get your channel restricted.</li><li><b>Spam in groups and private messages.</b> It gets you blocked and reported.</li><li><b>Giveaways that ask to join many channels.</b> Most of those subscribers leave right after.</li></ul>
<p>Want to know the budget? See <a href="https://jeremstyke.github.io/postpay/telegram-ad-prices/">how much Telegram ads cost</a> and <a href="https://jeremstyke.github.io/postpay/how-to-write-telegram-ad/">how to write an ad that gets clicks</a>.</p>"""},
  "fr": {"slug": "promouvoir-chaine-telegram", "title": "Comment promouvoir une chaîne Telegram : 7 méthodes pour de vrais abonnés",
   "desc": "Comment promouvoir une chaîne Telegram et gagner de vrais abonnés : pub dans des chaînes du même thème, échanges de posts, contenu partagé et pièges à éviter.",
   "crumb": "Promouvoir une chaîne Telegram", "h1": "Comment promouvoir une chaîne Telegram",
   "lead": "Les vrais abonnés viennent de lecteurs qui suivent déjà des chaînes comme la vôtre. Voici les méthodes qui marchent, gratuites ou payantes, et celles à éviter.",
   "cta": "📢 Trouver des chaînes où faire ma pub", "src": "src_seo_promote_fr_ad",
   "body": """<h2>1. Acheter un post dans des chaînes du même thème</h2>
<p>C'est le moyen le plus rapide de toucher des lecteurs déjà intéressés par votre sujet. Une chaîne crypto grandit avec des posts dans d'autres chaînes crypto, une chaîne de recettes dans des chaînes de cuisine. Sur PostPay, vous choisissez une chaîne, envoyez votre pub avec un bouton vers votre chaîne, et elle est publiée 24 heures. À la fin, vous voyez combien de personnes ont cliqué.</p>
<h2>2. Échanger des posts avec des chaînes de même taille</h2>
<p>L'échange de posts est gratuit : deux propriétaires publient un court message sur la chaîne de l'autre. Il marche mieux entre chaînes de taille proche et de thèmes voisins, pour que chacun y gagne.</p>
<h2>3. Publier du contenu que l'on transfère</h2>
<p>Chaque post transféré affiche le nom de votre chaîne avec un lien. Les petits guides, les listes utiles, les infos exclusives et les beaux visuels sont les plus transférés. Gardez un rythme régulier pour que les nouveaux lecteurs voient une chaîne vivante.</p>
<h2>4. Partager votre lien là où vous avez déjà un public</h2>
<ul><li>Votre site, votre newsletter et votre signature d'e-mail</li><li>Vos autres réseaux : bio, stories, posts épinglés</li><li>Votre appli ou votre bot, avec un bouton « Rejoindre la chaîne »</li><li>Les groupes où l'autopromotion est permise, sans spammer</li></ul>
<h2>5. Utiliser les dossiers partageables</h2>
<p>Telegram permet de partager un dossier de chaînes avec un seul lien. Créez un dossier avec des chaînes de votre thème, avec l'accord de leurs propriétaires, et partagez-le ensemble : chaque chaîne amène des lecteurs aux autres.</p>
<h2>6. Soigner la première visite</h2>
<p>Un nouveau visiteur décide en quelques secondes. Un nom et une photo clairs, une description qui dit ce qu'il va trouver et à quel rythme, et un post épinglé qui présente votre meilleur contenu.</p>
<h2>7. Mesurer et racheter là où ça marche</h2>
<p>Comparez le coût par clic de chaque chaîne où vous avez fait de la pub. Rachetez là où les lecteurs ont le plus cliqué et laissez tomber les autres. Les petites chaînes pile dans votre thème battent souvent les grosses chaînes généralistes.</p>
<h2>À éviter</h2>
<ul><li><b>Les faux abonnés et les bots.</b> Ils ne lisent pas, font baisser votre taux de vues et peuvent faire restreindre votre chaîne.</li><li><b>Le spam dans les groupes et en message privé.</b> Il vous fait bloquer et signaler.</li><li><b>Les concours qui obligent à rejoindre plein de chaînes.</b> La plupart de ces abonnés repartent juste après.</li></ul>
<p>Quel budget prévoir ? Voyez <a href="https://jeremstyke.github.io/postpay/fr/prix-pub-telegram/">combien coûte une pub Telegram</a> et <a href="https://jeremstyke.github.io/postpay/fr/rediger-pub-telegram/">comment écrire une pub qui fait cliquer</a>.</p>"""}},
 "write": {
  "en": {"slug": "how-to-write-telegram-ad", "title": "How to Write a Telegram Ad That Gets Clicks (with Examples)",
   "desc": "How to write a Telegram ad that gets clicks: structure, text length, button, image, examples, and what gets refused. Simple rules for your first sponsored post.",
   "crumb": "Write a Telegram ad", "h1": "How to write a Telegram ad that gets clicks",
   "lead": "A sponsored post is read in a few seconds, between other posts. One clear promise, one image and one button do most of the work.",
   "cta": "📢 Write my ad now", "src": "src_seo_write_en_ad",
   "body": """<h2>The structure that works</h2>
<ol><li><b>A hook</b> in the first line: a question, a number or a promise that speaks to the channel's readers.</li><li><b>What they get</b>: one benefit, said simply.</li><li><b>A proof</b>: a figure, a result, a short quote.</li><li><b>One button</b> that says exactly what happens when they tap it.</li></ol>
<h2>Keep it short</h2>
<p>Three to six short lines are enough. On PostPay, an ad with a photo is limited to 1024 characters and an ad with text only to 3500 characters. Use line breaks and one or two emojis to make it easy to scan.</p>
<h2>The button</h2>
<ul><li>1 to 40 characters, starting with a verb: "Join the channel", "Try the bot", "Get the guide"</li><li>A link to your channel (t.me/yourchannel), your bot or your website</li><li>One button only: a single choice gets more clicks</li></ul>
<h2>The image</h2>
<p>A clear image or short video stops the scroll. Show the result or the product, with little text on the image. Avoid images that look like a scam or a fake giveaway.</p>
<h2>Example</h2>
<div class="ex"><p><b>Before:</b> "Hello everyone, we have a new channel about crypto with lots of interesting content, please subscribe, thanks!"</p><p><b>After:</b> "📉 Most traders lose money on their first 10 trades. Our channel posts one simple setup a day, with the entry and the stop. 4,000 readers already follow it." Button: "Join the channel"</p></div>
<h2>Adapt it to each channel</h2>
<p>Write as the channel writes: its readers are used to its tone. A short version for a news channel, a more detailed one for a guide channel. Test two versions on two small channels and keep the one with the best cost per click.</p>
<h2>What gets refused</h2>
<p>Scams, fake giveaways, adult content and requests for seed phrases are refused automatically. The channel owner can also refuse an ad that does not fit their channel.</p>
<p>Next step: <a href="https://jeremstyke.github.io/postpay/buy-telegram-ads/">how to buy a Telegram ad</a> and <a href="https://jeremstyke.github.io/postpay/promote-telegram-channel/">how to promote your channel</a>.</p>"""},
  "fr": {"slug": "rediger-pub-telegram", "title": "Comment écrire une pub Telegram qui fait cliquer (avec exemples)",
   "desc": "Comment écrire une pub Telegram qui fait cliquer : structure, longueur du texte, bouton, image, exemples et contenus refusés. Des règles simples pour votre premier post sponsorisé.",
   "crumb": "Écrire une pub Telegram", "h1": "Comment écrire une pub Telegram qui fait cliquer",
   "lead": "Un post sponsorisé se lit en quelques secondes, entre deux autres posts. Une promesse claire, une image et un bouton font l'essentiel du travail.",
   "cta": "📢 Écrire ma pub maintenant", "src": "src_seo_write_fr_ad",
   "body": """<h2>La structure qui marche</h2>
<ol><li><b>Une accroche</b> dès la première ligne : une question, un chiffre ou une promesse qui parle aux lecteurs de la chaîne.</li><li><b>Ce qu'ils y gagnent</b> : un seul avantage, dit simplement.</li><li><b>Une preuve</b> : un chiffre, un résultat, une courte citation.</li><li><b>Un seul bouton</b> qui dit exactement ce qui se passe quand on appuie.</li></ol>
<h2>Faites court</h2>
<p>Trois à six lignes courtes suffisent. Sur PostPay, une pub avec photo est limitée à 1024 caractères et une pub texte seul à 3500 caractères. Aérez avec des retours à la ligne et un ou deux emojis pour qu'elle se lise d'un coup d'œil.</p>
<h2>Le bouton</h2>
<ul><li>1 à 40 caractères, en commençant par un verbe : « Rejoindre la chaîne », « Essayer le bot », « Recevoir le guide »</li><li>Un lien vers votre chaîne (t.me/votrechaine), votre bot ou votre site</li><li>Un seul bouton : un choix unique fait plus cliquer</li></ul>
<h2>L'image</h2>
<p>Une image nette ou une courte vidéo arrête le défilement. Montrez le résultat ou le produit, avec peu de texte sur l'image. Évitez les images qui ressemblent à une arnaque ou à un faux concours.</p>
<h2>Exemple</h2>
<div class="ex"><p><b>Avant :</b> « Bonjour à tous, nous avons une nouvelle chaîne sur la crypto avec plein de contenu intéressant, abonnez-vous, merci ! »</p><p><b>Après :</b> « 📉 La plupart des traders perdent de l'argent sur leurs 10 premiers trades. Notre chaîne publie une configuration simple par jour, avec l'entrée et le stop. 4 000 lecteurs la suivent déjà. » Bouton : « Rejoindre la chaîne »</p></div>
<h2>Adaptez-la à chaque chaîne</h2>
<p>Écrivez comme la chaîne écrit : ses lecteurs sont habitués à son ton. Une version courte pour une chaîne d'actu, une plus détaillée pour une chaîne de guides. Testez deux versions sur deux petites chaînes et gardez celle qui a le meilleur coût par clic.</p>
<h2>Ce qui est refusé</h2>
<p>Les arnaques, faux concours, contenus pour adultes et demandes de phrase secrète (seed phrase) sont refusés automatiquement. Le propriétaire de la chaîne peut aussi refuser une pub qui ne colle pas à sa chaîne.</p>
<p>Étape suivante : <a href="https://jeremstyke.github.io/postpay/fr/acheter-pub-telegram/">comment acheter une pub Telegram</a> et <a href="https://jeremstyke.github.io/postpay/fr/promouvoir-chaine-telegram/">comment promouvoir votre chaîne</a>.</p>"""}}}
TPL = {"en": ("buy-telegram-ads", B), "fr": ("fr/acheter-pub-telegram", B + "fr/")}
def esc(t): return t.replace("&", "&amp;").replace('"', "&quot;")
for key, langs in PAGES.items():
    for lg, p in langs.items():
        src, home = TPL[lg]
        s = open(os.path.join(ROOT, src, "index.html"), encoding="utf-8").read()
        old_url = B + src + "/"
        url = home + p["slug"] + "/"
        s = re.sub(r"<title>.*?</title>", "<title>" + esc(p["title"]) + "</title>", s, 1)
        s = re.sub(r'(<meta name="description" content=")[^"]*', lambda m: m.group(1) + esc(p["desc"]), s, 1)
        s = re.sub(r'(<meta property="og:title" content=")[^"]*', lambda m: m.group(1) + esc(p["title"]), s, 1)
        s = re.sub(r'(<meta property="og:description" content=")[^"]*', lambda m: m.group(1) + esc(p["desc"]), s, 1)
        s = s.replace('<link rel="canonical" href="' + old_url + '">', '<link rel="canonical" href="' + url + '">')
        s = s.replace('<meta property="og:url" content="' + old_url + '">', '<meta property="og:url" content="' + url + '">')
        # breadcrumb JSON-LD: last item
        def bc(m):
            d = json.loads(m.group(1)); d["itemListElement"][-1]["name"] = p["crumb"]; d["itemListElement"][-1]["item"] = url
            return '<script type="application/ld+json">' + json.dumps(d, ensure_ascii=False) + "</script>"
        s = re.sub(r'<script type="application/ld\+json">(\{[^<]*"BreadcrumbList"[^<]*\})</script>', bc, s, 1)
        s = re.sub(r'(<div class="crumb"><a href="[^"]*">PostPay</a> › )[^<]*', lambda m: m.group(1) + p["crumb"], s, 1)
        art = '<section class="art">\n<h1>' + p["h1"] + '</h1>\n<p class="lead">' + p["lead"] + '</p>\n<div class="ctas"><a class="btn" href="https://t.me/Postpayadsbot?start=' + p["src"] + '">' + p["cta"] + '</a></div>\n' + p["body"] + '\n</section>'
        s = re.sub(r'<section class="art">.*?</section>', lambda m: art, s, 1, flags=re.S)
        if ".ex{" not in s:
            s = s.replace("</style>", ".ex{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:6px 18px;margin:12px 0}\n</style>", 1)
        d = os.path.join(ROOT, url[len(B):]); os.makedirs(d, exist_ok=True)
        open(os.path.join(d, "index.html"), "w", encoding="utf-8").write(s)
        print("wrote", url)
