# -*- coding: utf-8 -*-
# Contenu du site Vieillir chez soi (vouvoiement pour les visiteurs)

# Checklist : (catégorie, emoji, [(article, recherche Amazon, priorité, conseil)])
# priorité : 1 = essentiel, 2 = utile, 3 = selon les besoins
CHECKLIST = [
  ("Salle de bains et toilettes", "🛁", [
    ("Tapis antidérapant de douche ou de baignoire", "tapis antiderapant douche", 1, "La salle de bains est l'endroit où l'on glisse le plus facilement : c'est le premier achat à faire."),
    ("Siège ou tabouret de douche", "siege de douche senior", 1, "Se laver assis évite la fatigue et les pertes d'équilibre."),
    ("Barres d'appui vissées", "barre d'appui salle de bain", 1, "Près de la douche et des toilettes, solidement fixées dans le mur."),
    ("Rehausseur de WC", "rehausseur wc", 2, "Utile quand se relever des toilettes devient difficile."),
    ("Cadre de toilettes avec accoudoirs", "cadre de toilette accoudoir", 2, "Une alternative aux barres quand on ne peut pas percer."),
    ("Planche ou siège de baignoire", "planche de bain senior", 2, "Pour continuer à utiliser la baignoire en restant assis."),
    ("Mitigeur thermostatique", "mitigeur thermostatique douche", 3, "Garde une température stable et limite le risque de brûlure."),
  ]),
  ("Se déplacer", "🚶", [
    ("Canne réglable", "canne de marche reglable", 1, "Réglée à la bonne hauteur, avec un embout antidérapant en bon état."),
    ("Rollator ou déambulateur", "rollator 4 roues", 2, "À choisir selon l'équilibre et les sorties : voir notre comparatif."),
    ("Chaussures fermées et stables", "chaussures confort senior", 1, "Des chaussons qui tiennent bien le pied valent mieux que des mules."),
    ("Main courante d'escalier", "main courante escalier", 2, "Idéalement des deux côtés de l'escalier."),
    ("Rampe d'accès portable", "rampe d'acces seuil", 3, "Pour une marche à l'entrée ou un seuil de porte-fenêtre."),
    ("Fauteuil roulant de transfert", "fauteuil roulant de transfert", 3, "Pour les sorties longues ou les rendez-vous médicaux."),
  ]),
  ("Sécurité et chutes", "🛡️", [
    ("Détecteur de fumée", "detecteur de fumee", 1, "Obligatoire dans chaque logement : testez-le régulièrement."),
    ("Veilleuses à détecteur de mouvement", "veilleuse detecteur de mouvement", 1, "Elles éclairent le chemin entre la chambre et les toilettes la nuit."),
    ("Bouton d'appel d'urgence", "bouton appel urgence senior", 2, "Pour pouvoir prévenir un proche même sans atteindre le téléphone."),
    ("Bandes antidérapantes pour escalier", "bande antiderapante escalier", 2, "Un petit achat qui sécurise chaque marche."),
    ("Boîte à clés sécurisée", "boite a cle securisee", 2, "Pratique pour les proches, les aides à domicile et les secours."),
    ("Montre ou pendentif avec détection de chute", "montre detection de chute senior", 3, "À comparer avec un service de téléassistance."),
  ]),
  ("Vie quotidienne", "☕", [
    ("Téléphone à grosses touches", "telephone portable senior 4g", 1, "Choisissez un modèle compatible 4G : les réseaux 2G et 3G ferment progressivement."),
    ("Pilulier", "pilulier semaine", 1, "Un pilulier de la semaine aide à ne pas oublier ni doubler une prise."),
    ("Pince de préhension", "pince de prehension", 2, "Pour ramasser un objet sans se pencher."),
    ("Couverts et vaisselle adaptés", "couverts ergonomiques", 3, "Manches épais et bols antidérapants quand la prise en main devient difficile."),
    ("Horloge calendrier", "horloge calendrier senior", 3, "Affiche le jour et le moment de la journée en grand."),
    ("Loupe éclairante", "loupe eclairante lecture", 3, "Pour lire le courrier, les notices et les boîtes de médicaments."),
    ("Casque TV sans fil", "casque tv sans fil senior", 3, "Pour entendre la télévision sans monter le son pour tout le monde."),
  ]),
  ("Chambre et repos", "🛏️", [
    ("Poignée d'aide au lever", "poignee aide au lever lit", 2, "Elle aide à s'asseoir puis à se lever du lit."),
    ("Fauteuil releveur", "fauteuil releveur", 3, "Utile quand se lever d'un fauteuil devient pénible : essayez-le si possible."),
    ("Table de lit", "table de lit roulettes", 3, "Pour manger, lire ou poser ses affaires sans se relever."),
    ("Coussin d'assise", "coussin anti escarres", 3, "En cas de risque d'escarres, demandez conseil à un professionnel de santé."),
  ]),
]

# Guide pilier « Aménager le logement d'une personne âgée » (construit à partir de CHECKLIST)
ROOM_CAT = {"Salle de bains et toilettes": "Salle de bains", "Se déplacer": "Se déplacer", "Sécurité et chutes": "Sécurité",
            "Vie quotidienne": "Vie quotidienne", "Chambre et repos": "Chambre et repos"}

ROOM_INTRO = {
  "Salle de bains et toilettes": "C'est la pièce où l'on glisse le plus facilement : sol mouillé, rebord de baignoire à enjamber, toilettes basses. C'est donc par là qu'il faut commencer. Quelques achats simples suffisent souvent à la sécuriser, avant d'envisager des travaux comme une douche de plain-pied.",
  "Se déplacer": "Dans le logement, le danger vient surtout des obstacles : tapis qui glissent, fils qui traînent, marches mal éclairées. Dégagez d'abord les passages, puis choisissez une aide à la marche adaptée. Le bon choix entre canne, déambulateur et rollator dépend de l'équilibre de la personne : le médecin ou le kinésithérapeute peut vous guider.",
  "Sécurité et chutes": "La nuit, le trajet entre la chambre et les toilettes est un moment à risque : on est encore endormi et il fait sombre. Un bon éclairage et un moyen d'appeler à l'aide changent beaucoup de choses, surtout pour une personne qui vit seule.",
  "Vie quotidienne": "Rester autonome, c'est aussi pouvoir appeler ses proches, prendre ses médicaments sans erreur et continuer ses activités. Ces petits équipements ne coûtent pas cher et évitent bien des difficultés au quotidien.",
  "Chambre et repos": "Se lever du lit ou d'un fauteuil devient parfois difficile avec l'âge. Avant d'acheter du matériel plus important comme un fauteuil releveur ou un lit médicalisé, demandez conseil : certains équipements se louent, et l'avis d'un professionnel évite les mauvais achats.",
}

HUB_INTRO = """<p>Rester chez soi le plus longtemps possible, c'est le souhait de la plupart des personnes âgées. Pour que ce soit possible en sécurité, le logement doit parfois évoluer : un siège dans la douche, une barre d'appui près des toilettes, une veilleuse dans le couloir. Bonne nouvelle, la plupart de ces aménagements sont simples et peu coûteux.</p>
<p>Ce guide fait le tour de la maison, pièce par pièce. Pour chaque équipement, nous indiquons s'il est essentiel, utile ou à prévoir selon les besoins, avec un conseil pour bien le choisir.</p>
<h2>Par où commencer ?</h2>
<p>Commencez par observer la personne dans ses gestes de tous les jours : entrer dans la douche, se relever des toilettes, monter l'escalier, se lever la nuit. Les difficultés que vous remarquez montrent les priorités. Les équipements marqués « Essentiel » sont ceux qui limitent le plus le risque de chute, à mettre en place en premier.</p>
<p>Associez la personne aux choix : un aménagement qu'elle comprend et accepte sera vraiment utilisé. Et si la situation est complexe (chute récente, retour d'hospitalisation, maladie), demandez l'avis du médecin traitant. Il peut orienter vers un ergothérapeute, qui vient au domicile et propose des aménagements adaptés.</p>"""

HUB_OUTRO = """<h2>Petits achats ou travaux ?</h2>
<p>Les équipements de ce guide s'installent sans gros travaux. Quand ils ne suffisent plus, des travaux peuvent être envisagés : remplacer une baignoire par une douche de plain-pied, élargir une porte, installer un monte-escalier. Avant de vous lancer, renseignez-vous sur les aides possibles auprès des services de votre département, de votre caisse de retraite ou sur les sites officiels comme service-public.fr.</p>
<div class="note"><strong>Un conseil personnalisé ?</strong> Un ergothérapeute peut venir au domicile et proposer les aménagements adaptés à la personne. Parlez-en au médecin traitant.</div>"""

HUB_FAQ = [
  ("Par quelle pièce commencer pour aménager le logement d'une personne âgée ?", "Par la salle de bains et les toilettes, où le risque de chute est le plus élevé, puis par le trajet de nuit entre la chambre et les toilettes."),
  ("Qui peut aider à adapter le logement ?", "Le médecin traitant peut orienter vers un ergothérapeute, qui vient au domicile et propose des aménagements adaptés. Le pharmacien conseille aussi sur le matériel."),
  ("Faut-il faire des travaux ?", "Pas forcément. Beaucoup d'équipements s'installent sans travaux. Des travaux comme une douche de plain-pied deviennent utiles quand ces équipements ne suffisent plus."),
]

PRIO = {1: "Essentiel", 2: "Utile", 3: "Selon les besoins"}

GUIDES = []

def g(slug, title, h1, desc, body, faq=None, short=None, cat='Conseils'):
    GUIDES.append(dict(slug=slug, title=title, h1=h1, desc=desc, body=body, faq=faq or [], short=short or h1, cat=cat))

A = 'rel="sponsored nofollow noopener" target="_blank"'

g("comment-choisir-siege-de-douche/",
  "Siège de douche pour personne âgée : comment bien le choisir",
  "Comment choisir un siège de douche pour une personne âgée",
  "Tabouret, siège mural rabattable ou chaise de douche : les critères pour choisir un siège de douche stable et adapté à la salle de bains d'un proche âgé.",
  """
<p>Rester debout sous la douche demande de l'équilibre et de l'énergie. Quand les jambes fatiguent ou que la tête tourne un peu, se laver assis devient beaucoup plus sûr. Encore faut-il choisir un siège adapté à la personne et à la salle de bains.</p>
{CTA}
<h2>Les trois grands types de sièges de douche</h2>
<table><thead><tr><th>Type</th><th>Pour qui ?</th><th>Points forts</th><th>Limites</th></tr></thead><tbody>
<tr><td>Tabouret de douche</td><td>Personne assez autonome</td><td>Petit, léger, se range facilement</td><td>Pas de dossier ni d'accoudoirs</td></tr>
<tr><td>Chaise de douche</td><td>Besoin de stabilité</td><td>Dossier et souvent accoudoirs pour se relever</td><td>Prend plus de place</td></tr>
<tr><td>Siège mural rabattable</td><td>Douche à l'italienne, petit espace</td><td>Se replie contre le mur, très stable une fois posé</td><td>Fixation solide obligatoire, demande des travaux</td></tr>
</tbody></table>
<p>Un <strong>tabouret</strong> suffit pour une personne qui garde un bon équilibre et veut simplement se reposer. <a href="{AMZ:tabouret de douche senior}" """ + A + """>Voir les tabourets de douche</a>.</p>
<p>Une <strong>chaise avec dossier et accoudoirs</strong> rassure davantage : on s'appuie sur les accoudoirs pour s'asseoir et se relever. <a href="{AMZ:chaise de douche accoudoirs}" """ + A + """>Voir les chaises de douche</a>.</p>
<p>Le <strong>siège mural rabattable</strong> est idéal dans une douche de plain-pied : il ne gêne pas les autres occupants et reste stable. Il doit être fixé dans un mur capable de supporter le poids d'une personne, de préférence par un professionnel. <a href="{AMZ:siege de douche mural rabattable}" """ + A + """>Voir les sièges muraux</a>.</p>
<h2>Les critères qui comptent vraiment</h2>
<ul>
<li><strong>La charge maximale</strong> : elle est indiquée par le fabricant. Choisissez un modèle prévu pour un poids nettement supérieur à celui de la personne.</li>
<li><strong>Les pieds réglables et antidérapants</strong> : ils permettent d'ajuster la hauteur et de rattraper un sol en pente. Vérifiez que les embouts en caoutchouc sont bien en place.</li>
<li><strong>La bonne hauteur</strong> : assis, les pieds doivent toucher le sol à plat, avec les genoux à peu près à angle droit. Trop bas, on a du mal à se relever.</li>
<li><strong>L'assise</strong> : percée ou à trous, elle laisse l'eau s'écouler et facilite la toilette.</li>
<li><strong>Les dimensions</strong> : mesurez le bac de douche ou la baignoire avant d'acheter, en gardant de la place pour les pieds.</li>
<li><strong>Les matériaux</strong> : un cadre en aluminium ne rouille pas et reste léger.</li>
</ul>
<p>Notre conseil : en cas de doute entre tabouret et chaise, prenez la chaise avec accoudoirs. Le tabouret est plus compact, mais c'est au moment de se relever que l'on glisse ou que l'on perd l'équilibre, et c'est là que les accoudoirs servent.</p>
<h2>Comment mesurer avant d'acheter ?</h2>
<p>La plupart des retours viennent d'un siège trop large pour le receveur ou trop haut pour la personne. Cinq minutes avec un mètre ruban évitent ce problème.</p>
<ol>
<li><strong>Le receveur ou la baignoire</strong> : mesurez la largeur et la profondeur utiles, à l'intérieur des rebords. Comparez avec l'encombrement total du siège indiqué sur la fiche (pieds écartés compris), pas seulement avec la largeur de l'assise.</li>
<li><strong>La place pour les jambes</strong> : une fois assise, la personne doit pouvoir poser les deux pieds devant elle sans toucher la paroi.</li>
<li><strong>La hauteur sous le genou</strong> : la personne assise sur une chaise, pieds nus et à plat, mesurez du sol jusqu'au creux du genou. La hauteur d'assise du siège doit pouvoir se régler autour de cette valeur.</li>
<li><strong>Le passage</strong> : vérifiez que le siège passe la porte de douche ou la paroi, surtout pour une chaise avec accoudoirs.</li>
<li><strong>Le mur, pour un siège rabattable</strong> : une cloison en plaque de plâtre ne suffit pas sans renfort. Faites vérifier le support avant l'achat.</li>
</ol>
<h2>Les erreurs qui rendent un siège dangereux</h2>
<p>Un bon siège mal installé peut basculer. Voici ce que l'on voit le plus souvent :</p>
<ul>
<li><strong>Un pied posé sur la bonde ou à cheval sur un joint</strong> : le siège devient bancal. Les quatre embouts doivent reposer à plat sur une surface continue.</li>
<li><strong>Des pieds réglés à des hauteurs différentes</strong> sans raison : vérifiez que chaque réglage est bien verrouillé (le bouton ou la goupille doit ressortir dans son trou) avant la première utilisation.</li>
<li><strong>Un tabouret pour une personne qui se relève difficilement</strong> : sans appui, elle se retient au rideau ou au porte-serviettes, qui ne sont pas faits pour ça.</li>
<li><strong>Un siège de douche posé dans le fond d'une baignoire</strong> : le fond est arrondi et glissant, la stabilité n'est pas garantie.</li>
<li><strong>Un siège prêté ou ancien jamais contrôlé</strong> : embouts durcis, vis desserrées, cadre fissuré. Jetez un œil à tout cela avant de l'utiliser.</li>
</ul>
<h2>Comment l'entretenir pour qu'il reste sûr ?</h2>
<p>Après la douche, rincez le siège pour enlever le savon, qui rend l'assise glissante, puis laissez-le sécher. Une fois par mois, retournez-le : regardez l'usure des embouts en caoutchouc, resserrez les vis et vérifiez qu'aucun réglage n'a bougé. Des embouts usés ou fendus se remplacent souvent facilement ; la notice du fabricant indique les pièces compatibles. Si le cadre est fissuré ou plié, ne réparez pas : remplacez le siège.</p>
<h2>Douche ou baignoire ?</h2>
<p>Dans une baignoire, un siège de douche classique est souvent instable. Mieux vaut une <strong>planche de bain</strong> posée sur les rebords, ou un siège de baignoire prévu pour cet usage. Enjamber le rebord reste toutefois le moment le plus risqué : si cela devient difficile, il est peut-être temps de penser à remplacer la baignoire par une douche de plain-pied. <a href="{AMZ:planche de bain senior}" """ + A + """>Voir les planches de bain</a>.</p>
<h2>Les compléments indispensables</h2>
<p>Un siège seul ne suffit pas à sécuriser la douche. Ajoutez :</p>
<ul>
<li>un <a href="{AMZ:tapis antiderapant douche}" """ + A + """>tapis antidérapant</a> dans la douche et un autre à la sortie ;</li>
<li>une <a href="{R}barre-d-appui-salle-de-bain/">barre d'appui</a> vissée à portée de main pour s'asseoir et se relever ;</li>
<li>un pommeau de douche sur support réglable, pour se laver sans se tenir debout ;</li>
<li>des affaires de toilette posées à hauteur, pour ne pas se pencher.</li>
</ul>
<p>Pour faire le tour de la maison, suivez notre <a href="{R}checklist/">checklist du maintien à domicile</a>.</p>
<h2>Demander conseil</h2>
<p>Si la personne a du mal à se lever, a déjà chuté ou sort d'une hospitalisation, demandez conseil à son médecin, à un ergothérapeute ou au pharmacien. Ils peuvent recommander le bon équipement et vérifier l'installation. Certaines aides techniques peuvent aussi être financées en partie : renseignez-vous auprès de la mutuelle et des services sociaux.</p>
<p>Pour comparer des modèles précis, consultez notre <a href="{R}meilleur-siege-de-douche/">sélection des meilleurs sièges de douche</a>.</p>
""",
  faq=[("Quelle hauteur pour un siège de douche ?", "Assis, la personne doit avoir les pieds à plat sur le sol et les genoux à peu près à angle droit. Les pieds réglables permettent d'ajuster la hauteur."),
       ("Tabouret ou chaise de douche ?", "Le tabouret suffit si l'équilibre est bon. Une chaise avec dossier et accoudoirs est plus sûre quand on a besoin d'appui pour s'asseoir et se relever."),
       ("Peut-on utiliser un siège de douche dans une baignoire ?", "Ce n'est pas l'idéal. Préférez une planche de bain ou un siège de baignoire prévu pour cet usage."),
       ("Comment savoir si un siège de douche est trop large ?", "Mesurez l'intérieur du receveur et comparez avec l'encombrement total du siège, pieds compris. Il doit rester de la place devant pour poser les deux pieds.")],
  short="Choisir un siège de douche", cat="Salle de bains")

g("deambulateur-ou-rollator/",
  "Déambulateur ou rollator : lequel choisir pour un senior ?",
  "Déambulateur ou rollator : lequel choisir ?",
  "Déambulateur fixe, à 2 roues ou rollator à 3 ou 4 roues : les différences, pour qui, comment régler la hauteur et à quoi faire attention avant d'acheter.",
  """
<p>Quand la canne ne suffit plus, on hésite souvent entre un déambulateur et un rollator. Les deux aident à marcher, mais ils ne conviennent pas aux mêmes personnes. Voici comment s'y retrouver.</p>
{CTA}
<h2>Les différences en un coup d'œil</h2>
<table><thead><tr><th>Modèle</th><th>Comment il s'utilise</th><th>Pour qui ?</th><th>Où ?</th></tr></thead><tbody>
<tr><td>Déambulateur fixe</td><td>On le soulève et on le pose à chaque pas</td><td>Besoin d'un appui très stable</td><td>Intérieur</td></tr>
<tr><td>Déambulateur à 2 roues</td><td>On le pousse, les pieds arrière freinent</td><td>Appui stable avec moins d'effort</td><td>Intérieur</td></tr>
<tr><td>Rollator 3 roues</td><td>On le pousse, freins aux poignées</td><td>Bonne marche, logement étroit</td><td>Intérieur et extérieur</td></tr>
<tr><td>Rollator 4 roues</td><td>On le pousse, freins et siège</td><td>Sorties, besoin de pauses</td><td>Surtout extérieur</td></tr>
</tbody></table>
<h2>Le déambulateur : le plus stable</h2>
<p>Le déambulateur est un cadre que l'on tient à deux mains. Le modèle fixe se soulève à chaque pas : il offre l'appui le plus stable, mais demande de la force dans les bras. Le modèle à deux roues avant se pousse plus facilement. Les déambulateurs pliants se rangent dans un coffre de voiture. <a href="{AMZ:deambulateur pliant}" """ + A + """>Voir les déambulateurs</a>.</p>
<p>Il convient bien à une personne qui a besoin de s'appuyer franchement, qui marche lentement, surtout à l'intérieur.</p>
<h2>Le rollator : plus de liberté</h2>
<p>Le rollator roule sur trois ou quatre roues et se dirige avec des poignées équipées de freins. Il demande de savoir freiner et de garder un minimum d'équilibre, car il avance tout seul si l'on ne le retient pas.</p>
<ul>
<li><strong>Le rollator 4 roues</strong> a souvent un siège et un panier : parfait pour faire ses courses et s'arrêter quand on est fatigué. <a href="{AMZ:rollator 4 roues siege}" """ + A + """>Voir les rollators 4 roues</a>.</li>
<li><strong>Le rollator 3 roues</strong> est plus maniable dans un logement étroit, mais un peu moins stable et sans siège. <a href="{AMZ:rollator 3 roues}" """ + A + """>Voir les rollators 3 roues</a>.</li>
</ul>
<h2>Bien régler la hauteur</h2>
<p>Un appareil mal réglé fatigue le dos et les épaules. Le repère le plus courant : debout, bras le long du corps, les poignées doivent arriver à peu près au niveau du pli du poignet. En tenant les poignées, les coudes restent légèrement fléchis. Suivez toujours la notice du fabricant et faites vérifier le réglage par un professionnel au moindre doute.</p>
<h2>Les points à vérifier avant d'acheter</h2>
<ul>
<li><strong>La largeur</strong> : mesurez les portes et les couloirs du logement.</li>
<li><strong>Le poids</strong> : un modèle léger se soulève plus facilement pour monter en voiture.</li>
<li><strong>Le pliage</strong> : vérifiez qu'il se plie simplement, sans force.</li>
<li><strong>Les freins</strong> (rollator) : faciles à serrer, avec une position de blocage pour s'asseoir.</li>
<li><strong>Les roues</strong> : de grandes roues passent mieux les trottoirs et les chemins.</li>
<li><strong>La charge maximale</strong> indiquée par le fabricant.</li>
</ul>
<h2>Prise en charge et conseils</h2>
<p>Les déambulateurs et les rollators peuvent être pris en charge en partie par l'Assurance maladie sur prescription médicale, la mutuelle pouvant compléter. Les conditions varient selon le modèle : demandez au médecin et au pharmacien avant d'acheter. Le médecin, le kinésithérapeute ou l'ergothérapeute peut aussi vous dire quel type d'aide convient le mieux.</p>
<p>Une aide à la marche ne fait pas tout : pensez aussi à dégager les passages et à poser des <a href="{AMZ:veilleuse detecteur de mouvement}" """ + A + """>veilleuses à détecteur</a>. Toutes les étapes sont dans notre <a href="{R}checklist/">checklist du maintien à domicile</a>, et notre guide sur les <a href="{R}barre-d-appui-salle-de-bain/">barres d'appui</a> complète l'équipement.</p>
<p>Pour comparer des modèles précis, consultez notre <a href="{R}meilleur-deambulateur/">sélection des meilleurs déambulateurs</a>.</p>
""",
  faq=[("Quelle est la différence entre un déambulateur et un rollator ?", "Le déambulateur se soulève ou se pousse lentement et offre un appui très stable. Le rollator roule, a des freins et souvent un siège : il convient mieux pour sortir."),
       ("À quelle hauteur régler un rollator ?", "Repère courant : debout, bras le long du corps, les poignées arrivent à peu près au pli du poignet. Suivez la notice et faites vérifier en cas de doute."),
       ("Un rollator est-il remboursé ?", "Il peut être pris en charge en partie sur prescription médicale, selon le modèle. Renseignez-vous auprès du médecin, du pharmacien et de la mutuelle.")],
  short="Déambulateur ou rollator", cat="Se déplacer")

g("barre-d-appui-salle-de-bain/",
  "Barre d'appui salle de bain : comment la choisir et la placer",
  "Barre d'appui pour la salle de bains : bien la choisir",
  "Droite, coudée, relevable ou à ventouses : quelle barre d'appui choisir pour la douche et les toilettes, où la placer et comment la fixer solidement.",
  """
<p>Une barre d'appui coûte peu et change beaucoup de choses : on s'y tient pour entrer dans la douche, s'asseoir, se relever des toilettes. À condition de choisir le bon modèle et de bien la fixer.</p>
{CTA}
<h2>Les différents modèles</h2>
<table><thead><tr><th>Modèle</th><th>Usage idéal</th><th>À savoir</th></tr></thead><tbody>
<tr><td>Barre droite</td><td>Entrée de douche, à côté des toilettes</td><td>Le modèle le plus simple et le plus courant</td></tr>
<tr><td>Barre coudée ou en L</td><td>Douche, baignoire</td><td>Permet de se tenir assis comme debout</td></tr>
<tr><td>Barre relevable</td><td>À côté des toilettes</td><td>Se relève contre le mur pour libérer le passage</td></tr>
<tr><td>Barre à ventouses</td><td>Logement en location, appoint</td><td>Aide à l'équilibre, pas à supporter tout le poids</td></tr>
</tbody></table>
<p>La <strong>barre droite</strong> suffit dans la plupart des cas. <a href="{AMZ:barre d'appui droite inox}" """ + A + """>Voir les barres droites</a>. La <strong>barre coudée</strong> est pratique dans la douche, car elle offre une prise à plusieurs hauteurs. <a href="{AMZ:barre d'appui coudee douche}" """ + A + """>Voir les barres coudées</a>. La <strong>barre relevable</strong> se place à côté des toilettes quand il n'y a pas de mur proche. <a href="{AMZ:barre d'appui relevable wc}" """ + A + """>Voir les barres relevables</a>.</p>
<h2>Les barres à ventouses : avec prudence</h2>
<p>Les barres à ventouses s'installent sans percer, ce qui séduit en location. Elles peuvent se décoller, surtout sur un carrelage avec des joints ou un mur humide. Utilisez-les pour garder l'équilibre, jamais pour vous relever en tirant de tout votre poids, et vérifiez-les avant chaque utilisation comme l'indique la notice. Pour un vrai appui, une barre vissée reste la solution.</p>
<h2>Où placer les barres ?</h2>
<ul>
<li><strong>À l'entrée de la douche</strong> : une barre verticale pour se tenir en enjambant ou en entrant.</li>
<li><strong>Dans la douche</strong> : près du siège de douche, pour s'asseoir et se relever.</li>
<li><strong>Près de la baignoire</strong> : là où l'on enjambe le rebord.</li>
<li><strong>À côté des toilettes</strong> : du côté où la personne se relève naturellement.</li>
</ul>
<p>La bonne hauteur dépend de la taille de la personne et de son usage. Le plus simple : faites mimer le geste (s'asseoir, se relever, entrer dans la douche) et repérez où la main se pose naturellement. Un ergothérapeute peut aider à trouver les bons emplacements.</p>
<h2>Une fixation solide avant tout</h2>
<p>Une barre d'appui doit supporter le poids d'une personne qui glisse. Tout se joue dans la fixation :</p>
<ul>
<li>utilisez des chevilles adaptées au mur (béton, brique, plaque de plâtre) ;</li>
<li>dans une cloison en plaque de plâtre, une fixation simple ne suffit pas toujours : un renfort ou une fixation dans l'ossature peut être nécessaire ;</li>
<li>suivez la notice et la charge indiquée par le fabricant ;</li>
<li>au moindre doute, faites appel à un artisan.</li>
</ul>
<h2>Les critères de choix</h2>
<ul>
<li><strong>Une surface qui ne glisse pas</strong>, même mouillée (finition striée ou antidérapante).</li>
<li><strong>Un diamètre confortable</strong>, que la main peut entourer.</li>
<li><strong>Une couleur contrastée</strong> avec le mur, plus facile à repérer quand la vue baisse.</li>
<li><strong>Un matériau qui ne rouille pas</strong> : inox ou aluminium.</li>
</ul>
<p>Pour aller plus loin, lisez notre guide pour <a href="{R}comment-choisir-siege-de-douche/">choisir un siège de douche</a> et parcourez la <a href="{R}checklist/">checklist du maintien à domicile</a>. Un <a href="{AMZ:rehausseur wc}" """ + A + """>rehausseur de WC</a> complète souvent les barres près des toilettes.</p>
<p>Pour voir des modèles précis, avec leur charge et leur fixation, parcourez notre <a href="{R}meilleure-barre-d-appui/">comparatif des barres d'appui</a>.</p>
""",
  faq=[("Les barres d'appui à ventouses sont-elles fiables ?", "Elles aident à garder l'équilibre mais peuvent se décoller. Elles ne remplacent pas une barre vissée pour se relever en prenant appui."),
       ("Où mettre une barre d'appui près des toilettes ?", "Du côté où la personne se relève naturellement. Sans mur proche, une barre relevable ou un cadre de toilettes est une bonne solution."),
       ("Peut-on fixer une barre d'appui sur du placo ?", "Oui, avec des fixations adaptées, mais une cloison en plaque de plâtre demande souvent un renfort. En cas de doute, faites appel à un artisan.")],
  short="Barres d'appui", cat="Salle de bains")

g("telephone-portable-senior/",
  "Téléphone portable senior : comment bien le choisir",
  "Comment choisir un téléphone portable pour senior",
  "Grosses touches, clapet ou smartphone simplifié, bouton d'urgence, compatibilité 4G et appareils auditifs : les critères pour choisir un portable senior.",
  """
<p>Un bon téléphone, c'est celui que la personne utilise vraiment : elle l'entend sonner, voit qui appelle et sait rappeler sans aide. Avant de regarder les modèles, posez-vous une question simple : que va-t-elle faire avec ?</p>
{CTA}
<h2>Les trois familles de téléphones</h2>
<table><thead><tr><th>Type</th><th>Pour qui ?</th><th>Points forts</th><th>Limites</th></tr></thead><tbody>
<tr><td>Téléphone à grosses touches</td><td>Appels et SMS seulement</td><td>Très simple, grande autonomie</td><td>Pas d'appels vidéo ni d'applis</td></tr>
<tr><td>Téléphone à clapet</td><td>Même usage, en plus compact</td><td>Écran protégé, on décroche en l'ouvrant</td><td>Touches parfois plus petites</td></tr>
<tr><td>Smartphone simplifié</td><td>Envie de photos et d'appels vidéo</td><td>Voir ses petits-enfants, messageries</td><td>Plus complexe, à recharger souvent</td></tr>
</tbody></table>
<p>Le <strong>téléphone à grosses touches</strong> convient à la plupart des personnes qui veulent seulement appeler. <a href="{AMZ:telephone portable senior grosses touches 4g}" """ + A + """>Voir les téléphones à grosses touches</a>. Le <strong>modèle à clapet</strong> plaît à ceux qui aiment décrocher en ouvrant le téléphone. <a href="{AMZ:telephone clapet senior 4g}" """ + A + """>Voir les téléphones à clapet</a>. Le <strong>smartphone simplifié</strong> ouvre aux appels vidéo et aux photos de famille. <a href="{AMZ:smartphone senior}" """ + A + """>Voir les smartphones seniors</a>.</p>
<h2>Le point à ne pas rater : la 4G</h2>
<p>En France, les réseaux 2G et 3G sont progressivement arrêtés par les opérateurs, avec des dates qui varient selon les régions. Un ancien téléphone qui ne fonctionne qu'en 2G ou 3G risque de ne plus pouvoir appeler. Choisissez un modèle compatible 4G, y compris pour les appels (on parle de VoLTE), et vérifiez la compatibilité avec l'opérateur. Le calendrier est publié par l'Arcep.</p>
<h2>Les critères qui font la différence</h2>
<ul>
<li><strong>Des touches et des chiffres bien lisibles</strong>, espacés, avec un bon contraste.</li>
<li><strong>Une sonnerie forte</strong> et, si possible, un vibreur puissant ou un flash lumineux.</li>
<li><strong>La compatibilité avec les appareils auditifs</strong> si la personne en porte : regardez la fiche technique.</li>
<li><strong>Un socle de charge</strong> : on pose le téléphone, il se recharge, sans chercher la prise.</li>
<li><strong>Un bouton d'urgence</strong> au dos, qui appelle ou prévient plusieurs proches.</li>
<li><strong>Des touches de raccourci</strong> pour appeler les proches en un geste.</li>
<li><strong>Une bonne autonomie</strong>, pour ne pas tomber en panne au mauvais moment.</li>
</ul>
<h2>Le bouton d'urgence suffit-il ?</h2>
<p>Le bouton d'urgence d'un téléphone est utile, mais il faut avoir le téléphone sur soi. Pour une personne qui vit seule et risque de tomber, un <a href="{AMZ:bouton appel urgence senior}" """ + A + """>bouton d'appel</a> porté en pendentif ou un service de téléassistance est souvent plus sûr. Parlez-en avec la personne et son médecin.</p>
<h2>Et à la maison ?</h2>
<p>Un <a href="{AMZ:telephone fixe grosses touches}" """ + A + """>téléphone fixe à grosses touches</a> reste rassurant pour beaucoup de seniors : il est toujours au même endroit et se trouve facilement. Les modèles amplifiés aident en cas de baisse d'audition.</p>
<h2>Bien préparer le téléphone</h2>
<p>Avant de l'offrir, enregistrez les numéros importants, réglez la taille du texte et le volume, et faites quelques essais ensemble. C'est souvent ce qui fait la différence entre un téléphone utilisé et un téléphone qui reste dans un tiroir.</p>
<p>Le téléphone fait partie de notre <a href="{R}checklist/">checklist du maintien à domicile</a>. Pour la mobilité, lisez aussi <a href="{R}deambulateur-ou-rollator/">déambulateur ou rollator</a>.</p>
<p>Pour comparer des modèles précis, consultez notre <a href="{R}meilleur-telephone-portable-senior/">sélection des meilleurs téléphones portables pour seniors</a>.</p>
""",
  faq=[("Quel téléphone pour une personne âgée qui veut seulement appeler ?", "Un téléphone à grosses touches ou à clapet, compatible 4G, avec une sonnerie forte et un socle de charge, suffit dans la plupart des cas."),
       ("Pourquoi choisir un téléphone 4G ?", "Les réseaux 2G et 3G ferment progressivement en France. Un téléphone qui ne fonctionne qu'en 2G ou 3G risque de ne plus pouvoir appeler."),
       ("Un smartphone est-il adapté à un senior ?", "Oui si la personne veut faire des appels vidéo ou voir des photos. Un smartphone simplifié, bien paramétré, facilite la prise en main.")],
  short="Téléphone senior", cat="Vie quotidienne")
