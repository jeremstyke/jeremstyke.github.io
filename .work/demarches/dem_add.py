# Contenus ajoutés aux pages minces de PDF Démarches (audit du 20 nov 2026).
# Idempotent : chaque bloc est entouré de <!--x1--> ... <!--/x1-->.
import re, sys, os

ROOT = sys.argv[1] if len(sys.argv) > 1 else "site"

def sec(*parts):
    return "\n".join(parts)

A = {}

A["ameli"] = sec(
"<h2>Les démarches ameli qui demandent un fichier</h2>",
"<p>Sur le compte ameli, on dépose surtout des documents pour la carte Vitale (photo d'identité et pièce d'identité), pour un remboursement de soins à l'étranger, pour une demande de complémentaire santé solidaire ou pour mettre à jour sa situation (changement d'adresse, de RIB, naissance d'un enfant). Chaque formulaire a ses propres limites, souvent affichées en petit sous le bouton d'ajout : lisez-les avant de préparer vos fichiers.</p>",
"<h2>Réussir la photo de la carte Vitale</h2>",
"<ul><li><b>Fond clair et uni</b>, visage de face, sans lunettes de soleil ni couvre-chef, comme pour une photo d'identité classique.</li><li><b>Pas de photo de photo</b> : une photo d'identité papier prise en photo avec reflets est souvent refusée. Utilisez de préférence une photo numérique avec code de photomaton agréé quand le formulaire le propose.</li><li><b>Format JPG</b> : les photos HEIC d'iPhone doivent être converties, l'outil le fait automatiquement.</li><li><b>Poids dans la fourchette</b> : ni trop lourd, ni trop léger. Une photo trop compressée perd en netteté et peut être rejetée au contrôle.</li></ul>",
"<h2>Les erreurs fréquentes sur ameli</h2>",
"<p>La première cause de blocage est le fichier trop lourd, juste après vient le document illisible. Une facture de soins photographiée de travers, avec une ombre sur la moitié de la page, sera renvoyée même si son poids est correct. Prenez la photo à plat, à la lumière du jour, en cadrant tout le document. Si vous avez plusieurs pages (une facture et sa traduction par exemple), <a href=\"../fusionner-pdf/\">réunissez-les dans un seul PDF</a> avant de le réduire.</p>",
"<p>Enfin, gardez toujours une copie des fichiers envoyés : en cas de relance de la caisse, vous pourrez les renvoyer en quelques secondes depuis <a href=\"../mes-documents/\">Mes documents</a>.</p>",
)

A["anef-titre-de-sejour"] = sec(
"<h2>Ce que demande le site de l'ANEF</h2>",
"<p>Les demandes et renouvellements de titre de séjour se font sur le portail de l'Administration numérique pour les étrangers en France (ANEF). Le dossier se compose de plusieurs pièces déposées une par une : passeport, justificatif de domicile, photo d'identité numérique, justificatifs de ressources ou de scolarité selon le motif. Chaque pièce a une taille maximale, et le site refuse le fichier dès qu'elle est dépassée.</p>",
"<h2>Préparer chaque pièce</h2>",
"<ul><li><b>Passeport</b> : les pages avec photo, état civil et visas utiles, dans un seul PDF. Utilisez <a href=\"../fusionner-pdf/\">Fusionner des PDF</a> ou l'onglet Photos en PDF.</li><li><b>Justificatif de domicile</b> : facture récente ou attestation d'hébergement. Si vous êtes hébergé, le <a href=\"../modeles/attestation-hebergement/\">modèle d'attestation d'hébergement</a> vous fait gagner du temps.</li><li><b>Ressources</b> : bulletins de salaire, avis d'imposition. Préférez la version téléchargée depuis votre espace en ligne, plus légère et plus nette qu'un scan.</li><li><b>Documents en langue étrangère</b> : joignez la traduction dans le même PDF, juste après l'original.</li></ul>",
"<h2>Avant de valider le dossier</h2>",
"<p>Ouvrez chaque fichier réduit et zoomez sur les numéros (passeport, dates, montants) : ils doivent rester parfaitement lisibles. Un document flou peut entraîner une demande de pièce complémentaire et retarder l'instruction. Ne compressez pas plus que nécessaire : si la limite est de 1 Mo, un fichier de 800 Ko est idéal, inutile de descendre à 100 Ko.</p>",
"<p>Le dépôt peut prendre du temps : préparez toutes les pièces à l'avance et gardez-les dans <a href=\"../mes-documents/\">Mes documents</a> pour ne pas tout refaire si la session expire.</p>",
)

A["ants"] = sec(
"<h2>Les démarches ANTS concernées</h2>",
"<p>Le site de l'Agence nationale des titres sécurisés (ANTS) sert pour la <a href=\"carte-grise/\">carte grise</a>, le <a href=\"permis-de-conduire/\">permis de conduire</a> et les pré-demandes de carte d'identité ou de passeport. Pour les véhicules et le permis, une grande partie du dossier se dépose en ligne sous forme de pièces justificatives : pièce d'identité, justificatif de domicile, certificat de cession, avis médical, attestation de formation.</p>",
"<h2>Bien préparer ses pièces pour l'ANTS</h2>",
"<ul><li><b>Une pièce, un fichier</b> : ne regroupez pas tout dans un seul PDF, l'ANTS attend chaque justificatif dans sa case.</li><li><b>Recto et verso ensemble</b> : pour une carte d'identité ou un permis, mettez les deux faces dans le même fichier. Le guide <a href=\"../guides/recto-verso-carte-identite-pdf/\">recto verso en un PDF</a> explique comment faire.</li><li><b>Des documents récents</b> : un justificatif de domicile de plus de 6 mois est généralement refusé.</li><li><b>Des noms de fichiers simples</b> : sans accents ni espaces, l'outil s'en charge.</li></ul>",
"<h2>Si l'envoi échoue</h2>",
"<p>Le message d'erreur le plus courant concerne la taille ou le format. Vérifiez d'abord le poids du fichier, puis son extension : un fichier .heic ou .docx sera refusé même s'il est léger. Si le site plante au moment de l'envoi, changez de navigateur ou réessayez plus tard : les pics de fréquentation sont fréquents en début de semaine. Gardez vos fichiers prêts dans <a href=\"../mes-documents/\">Mes documents</a> pour ne pas avoir à les refaire.</p>",
)

A["ants/permis-de-conduire"] = sec(
"<h2>Les pièces du dossier permis</h2>",
"<p>Selon la démarche (inscription à l'examen, renouvellement, perte, vol, permis international), l'ANTS demande une partie de ces pièces : pièce d'identité, justificatif de domicile, photo et signature numériques avec leur code, avis médical pour certaines catégories, attestation de formation ou ancien permis. La photo et la signature passent par un photomaton ou un photographe agréé qui fournit un code : vous n'avez pas à envoyer de fichier pour elles.</p>",
"<h2>Conseils pratiques</h2>",
"<ul><li>Scannez ou photographiez l'ancien permis recto et verso, puis réunissez les deux faces dans un seul PDF.</li><li>Pour une déclaration de perte, la déclaration se fait directement en ligne au moment de la demande ; en cas de vol, gardez le récépissé de plainte dans un fichier séparé.</li><li>Vérifiez que les dates et numéros restent lisibles après compression, c'est ce que l'agent contrôle en premier.</li></ul>",
"<p>Si un document est refusé, vous recevez en général un message vous demandant de le déposer à nouveau : préparez la nouvelle version avec l'outil ci-dessus, en partant d'un original plus net plutôt qu'en compressant encore le fichier refusé.</p>",
)

A["association"] = sec(
"<h2>Les fichiers demandés pour une association</h2>",
"<p>La création, la modification ou la dissolution d'une association se déclare en ligne sur le site du service public. Le dossier contient en général les statuts signés, la liste des dirigeants et le procès-verbal de l'assemblée qui a pris la décision. Pour une demande de subvention, s'ajoutent souvent le budget prévisionnel, le dernier rapport d'activité, le RIB et le numéro SIRET.</p>",
"<h2>Préparer des statuts propres</h2>",
"<ul><li><b>Une version signée et complète</b> : toutes les pages, dans l'ordre. Si vous avez scanné les pages une par une, <a href=\"../fusionner-pdf/\">fusionnez-les</a> en un seul PDF.</li><li><b>Un scan en niveaux de gris</b> à 150 ou 200 dpi suffit pour des statuts : le fichier sera beaucoup plus léger qu'en couleur.</li><li><b>Pas de pages blanches</b> : retirez-les avec <a href=\"../separer-pdf/\">Séparer un PDF</a> avant de compresser.</li></ul>",
"<h2>Les erreurs à éviter</h2>",
"<p>Les statuts non signés, les procès-verbaux sans date ni signature du président ou du secrétaire, et les fichiers trop lourds sont les causes de refus les plus fréquentes. Autre piège : envoyer un document Word au lieu d'un PDF. Convertissez toujours en PDF avant le dépôt pour figer la mise en page. Gardez enfin une copie de chaque version déposée : elle vous servira pour la prochaine modification ou pour une demande de subvention.</p>",
)

A["assurance-retraite"] = sec(
"<h2>Quand faut-il envoyer des documents à l'Assurance retraite ?</h2>",
"<p>Sur l'espace personnel de l'Assurance retraite, on dépose des pièces lors de la demande de retraite, pour corriger son relevé de carrière, pour une demande de réversion ou d'allocation de solidarité aux personnes âgées. Les documents typiques sont les bulletins de salaire anciens, les certificats de travail, les attestations de chômage ou de service militaire, le livret de famille et l'avis d'imposition.</p>",
"<h2>Numériser de vieux documents</h2>",
"<p>Les bulletins de salaire des années 80 ou 90 sont souvent jaunis, pliés ou imprimés sur papier fin. Pour un résultat lisible et léger :</p>",
"<ul><li>Posez le document bien à plat, à la lumière du jour, sans flash.</li><li>Photographiez-le avec l'application appareil photo ou le mode scan de votre téléphone (voir le guide <a href=\"../guides/scanner-document-telephone/\">scanner un document avec son téléphone</a>).</li><li>Réunissez les bulletins d'une même année dans un seul PDF plutôt que d'envoyer douze fichiers.</li><li>Réduisez ensuite le PDF avec l'outil ci-dessus.</li></ul>",
"<h2>Corriger son relevé de carrière</h2>",
"<p>Si une période manque sur votre relevé, rassemblez toutes les preuves de cette période (bulletins, contrat, certificat de travail) dans un même fichier, en indiquant les dates dans le nom du fichier, par exemple bulletins-1992.pdf. Un dossier clair et lisible est traité plus vite qu'une série de photos dispersées.</p>",
)

A["dossier-social-etudiant"] = sec(
"<h2>Ce qu'on dépose pour le dossier social étudiant</h2>",
"<p>Le dossier social étudiant (DSE) sert à demander une bourse sur critères sociaux et un logement en résidence Crous. Il se remplit sur messervices.etudiant.gouv.fr. Selon votre situation, on peut vous demander l'avis fiscal de vos parents, un justificatif de leur situation (séparation, chômage), un certificat de scolarité ou des justificatifs de handicap ou de frères et sœurs à charge.</p>",
"<h2>Préparer les pièces sans stress</h2>",
"<ul><li><b>Avis d'imposition</b> : téléchargez le PDF depuis l'espace impots.gouv.fr des parents, c'est la version la plus légère et la plus lisible.</li><li><b>Documents en plusieurs pages</b> : un jugement de divorce ou une attestation de plusieurs pages doit être envoyé en entier, dans un seul PDF.</li><li><b>Photos de téléphone</b> : convertissez-les en PDF avec l'onglet Photos en PDF, puis réduisez le fichier.</li></ul>",
"<h2>Le calendrier à garder en tête</h2>",
"<p>Le DSE s'ouvre au printemps pour l'année universitaire suivante. Ne déposez pas vos pièces à la dernière minute : en fin de période, les serveurs sont chargés et un fichier refusé peut faire perdre plusieurs jours. Préparez tout à l'avance et gardez vos fichiers dans <a href=\"../mes-documents/\">Mes documents</a>, ils resserviront pour le logement ou pour l'inscription à l'université.</p>",
)

A["france-travail"] = sec(
"<h2>Les documents demandés par France Travail</h2>",
"<p>Lors de l'inscription puis tout au long de l'accompagnement, France Travail demande des justificatifs : pièce d'identité, attestation employeur, bulletins de salaire, justificatif de domicile, RIB, arrêts de travail, diplômes ou attestation de formation. Ils se transmettent depuis l'espace personnel, rubrique d'envoi de documents, ou depuis l'application mobile.</p>",
"<h2>Bien envoyer son attestation employeur</h2>",
"<p>L'attestation employeur est normalement transmise directement par l'entreprise. Si France Travail vous la réclame quand même, envoyez la version PDF reçue de votre employeur plutôt qu'une photo. Si vous n'avez qu'une version papier, scannez toutes les pages et <a href=\"../fusionner-pdf/\">réunissez-les dans un seul PDF</a>.</p>",
"<h2>Mettre votre CV en ligne</h2>",
"<p>Pour le CV déposé sur votre profil, un PDF de moins de 1 Mo est largement suffisant. Si vous n'avez pas encore de CV, vous pouvez en créer un gratuitement sur <a href=\"https://cvlibre.com/\">CVLibre</a>, puis le réduire ici si besoin.</p>",
"<h2>Les erreurs fréquentes</h2>",
"<ul><li>Envoyer un fichier Word ou une photo HEIC : utilisez toujours du PDF ou du JPG.</li><li>Dépasser la limite de l'envoi en joignant plusieurs gros scans : faites plusieurs envois.</li><li>Oublier une page d'un document : un bulletin incomplet sera redemandé.</li></ul>",
)

A["impots"] = sec(
"<h2>Quand faut-il joindre un fichier aux impôts ?</h2>",
"<p>Sur impots.gouv.fr, les pièces jointes servent surtout dans la messagerie sécurisée de l'espace particulier : réclamation, justificatif de frais réels, attestation de dons, facture de travaux pour un crédit d'impôt, jugement de divorce pour une pension alimentaire. Chaque message accepte un nombre limité de pièces jointes, avec une taille maximale par fichier.</p>",
"<h2>Regrouper intelligemment</h2>",
"<ul><li><b>Un fichier par sujet</b> : par exemple toutes les factures d'emploi à domicile de l'année dans un PDF, toutes les attestations de dons dans un autre.</li><li><b>Dans l'ordre</b> : classez les pages par date, l'agent les lira plus vite.</li><li><b>Un nom clair</b> : factures-garde-enfant-2025.pdf plutôt que scan001.pdf.</li></ul>",
"<h2>Pour les frais réels</h2>",
"<p>Vous n'avez pas à envoyer vos justificatifs de frais réels avec la déclaration, mais l'administration peut les demander ensuite. Conservez-les numérisés et classés, en PDF léger, pendant au moins trois ans. L'outil vous permet de les réduire une bonne fois pour toutes et de les garder dans <a href=\"../mes-documents/\">Mes documents</a> sur votre appareil.</p>",
"<h2>Vérifier avant d'envoyer</h2>",
"<p>Ouvrez le fichier réduit et contrôlez que les montants, dates et numéros fiscaux restent bien lisibles. Si ce n'est pas le cas, repartez du fichier d'origine avec une taille cible un peu plus élevée.</p>",
)

A["inscription-universite"] = sec(
"<h2>Les pièces demandées à l'inscription</h2>",
"<p>Après Parcoursup ou Mon Master, l'inscription administrative se fait sur le site de chaque université. On y dépose en général une pièce d'identité, une photo d'identité, l'attestation de la Contribution vie étudiante et de campus (CVEC), le relevé de notes du baccalauréat ou du diplôme précédent, et parfois une attestation de responsabilité civile ou de sécurité sociale.</p>",
"<h2>La photo d'identité</h2>",
"<p>La photo sert souvent pour la carte étudiante : visage de face, fond clair, format JPG. Si vous prenez la photo avec un iPhone, elle sera en HEIC : l'outil la convertit en JPG et la ramène au poids demandé. Recadrez-la autour du visage avant de l'envoyer, une photo en pied sera refusée.</p>",
"<h2>Les relevés de notes et diplômes</h2>",
"<ul><li>Téléchargez si possible la version numérique officielle, plus légère qu'un scan.</li><li>Pour un diplôme étranger, joignez la traduction dans le même PDF.</li><li>Pour plusieurs relevés (L1, L2, L3), <a href=\"../fusionner-pdf/\">fusionnez-les</a> dans l'ordre chronologique.</li></ul>",
"<h2>Ne pas oublier la CVEC</h2>",
"<p>L'attestation CVEC est obligatoire pour s'inscrire. Téléchargez-la en PDF sur le site dédié après paiement ou exonération : elle est déjà légère et n'a pas besoin d'être réduite. Gardez-la avec vos autres pièces dans <a href=\"../mes-documents/\">Mes documents</a>.</p>",
)

A["logement-social"] = sec(
"<h2>Les pièces d'une demande de logement social</h2>",
"<p>La demande de logement social se fait en ligne sur le portail national. Une fois la demande enregistrée, vous pouvez y ajouter les pièces justificatives : pièce d'identité de chaque adulte, avis d'imposition des deux dernières années, justificatifs de ressources (bulletins de salaire, attestations CAF ou France Travail), justificatif de situation familiale et justificatif de domicile actuel.</p>",
"<h2>Un dossier complet est traité plus vite</h2>",
"<p>Les commissions d'attribution examinent des dossiers complets. Un justificatif manquant ou illisible peut retarder l'examen de votre demande. Prenez le temps de préparer chaque pièce correctement :</p>",
"<ul><li>Les avis d'imposition en PDF téléchargé depuis impots.gouv.fr.</li><li>Les trois derniers bulletins de salaire réunis dans un seul PDF.</li><li>Les pièces d'identité recto et verso dans le même fichier (voir le <a href=\"../guides/recto-verso-carte-identite-pdf/\">guide recto verso</a>).</li><li>Si vous êtes hébergé, une <a href=\"../modeles/attestation-hebergement/\">attestation d'hébergement</a> avec la pièce d'identité de l'hébergeant.</li></ul>",
"<h2>Penser au renouvellement</h2>",
"<p>Une demande de logement social doit être renouvelée chaque année, sinon elle est radiée. Gardez vos fichiers prêts dans <a href=\"../mes-documents/\">Mes documents</a> : il suffira de mettre à jour les avis d'imposition et les bulletins de salaire.</p>",
)

A["maprimerenov"] = sec(
"<h2>Les documents d'un dossier MaPrimeRénov'</h2>",
"<p>Le dossier se monte en ligne sur le site officiel, avant le début des travaux. On y dépose notamment l'avis d'imposition du foyer, les devis signés des artisans, et parfois un audit énergétique. Après les travaux, il faut envoyer les factures pour obtenir le versement de la prime. Les devis et factures sont souvent des PDF de plusieurs pages, lourds quand ils contiennent des logos ou des photos.</p>",
"<h2>Préparer devis et factures</h2>",
"<ul><li><b>Demandez la version PDF</b> à l'artisan plutôt que de scanner la version papier.</li><li><b>Un fichier par devis</b>, avec toutes ses pages, dans l'ordre.</li><li><b>Signature lisible</b> : si vous signez le devis sur papier puis le scannez, vérifiez que la date et la mention « bon pour accord » restent nettes après compression.</li><li><b>Vérifiez la mention RGE</b> de l'entreprise sur le devis : c'est une condition de la prime.</li></ul>",
"<h2>En cas de refus d'un fichier</h2>",
"<p>Si le site refuse le fichier, regardez d'abord son poids, puis son format. Un devis exporté depuis un logiciel peut contenir des images en très haute définition : l'outil les réduit sans toucher au texte. Si la plateforme signale un document illisible, repartez du fichier d'origine plutôt que de compresser encore une version déjà compressée.</p>",
)

A["mdph"] = sec(
"<h2>Ce qu'on joint à une demande MDPH</h2>",
"<p>Une demande à la MDPH (AAH, PCH, carte mobilité inclusion, RQTH, AEEH) se compose du formulaire de demande, du certificat médical récent, d'une pièce d'identité, d'un justificatif de domicile et, si besoin, de bilans ou comptes rendus médicaux. Beaucoup de MDPH acceptent maintenant le dépôt en ligne, avec des limites de taille détaillées dans notre guide <a href=\"../guides/taille-max-fichier-mdph/\">taille maximale des fichiers MDPH</a>.</p>",
"<h2>Le certificat médical</h2>",
"<p>C'est la pièce la plus importante du dossier. Il doit être complet, signé et daté de moins d'un an. Si votre médecin vous le remet sur papier, scannez toutes les pages, réunissez-les dans un seul PDF et vérifiez la lisibilité de l'écriture manuscrite avant de réduire le fichier. Une compression trop forte rend illisibles les annotations à la main.</p>",
"<h2>Les comptes rendus et bilans</h2>",
"<ul><li>Classez-les par date, du plus récent au plus ancien.</li><li>Ne gardez que les documents utiles à la demande : un dossier plus court est lu plus attentivement.</li><li>Nommez les fichiers clairement, par exemple bilan-orthophonie-2026.pdf.</li></ul>",
"<p>Le projet de vie, à rédiger par vous, peut être tapé sur ordinateur puis exporté en PDF : il sera léger et parfaitement lisible.</p>",
)

A["msa"] = sec(
"<h2>Les démarches MSA en ligne</h2>",
"<p>La Mutualité sociale agricole gère la protection sociale des exploitants et salariés agricoles : santé, famille, retraite, prime d'activité. Depuis l'espace privé MSA, on peut envoyer des justificatifs en ligne : bulletins de salaire, attestations, factures de soins, justificatifs de domicile, déclarations de ressources.</p>",
"<h2>Préparer ses justificatifs</h2>",
"<ul><li><b>Un document par fichier</b>, en PDF ou JPG.</li><li><b>Plusieurs pages ?</b> Réunissez-les dans un seul PDF avec <a href=\"../fusionner-pdf/\">Fusionner des PDF</a>.</li><li><b>Photos d'iPhone</b> : elles sont en HEIC, l'outil les convertit en JPG ou en PDF.</li><li><b>Poids</b> : visez moins de 1 Mo par fichier, c'est lisible et accepté partout.</li></ul>",
"<h2>Les exploitants agricoles</h2>",
"<p>Pour les déclarations liées à l'exploitation (revenus professionnels, cotisations), les documents comptables sont souvent volumineux. Demandez à votre comptable une version PDF numérique plutôt qu'un scan, et séparez les annexes inutiles avec <a href=\"../separer-pdf/\">Séparer un PDF</a> pour n'envoyer que les pages demandées.</p>",
"<p>Comme pour toute démarche, gardez une copie des fichiers envoyés et la date d'envoi : en cas de relance, vous pourrez prouver que le document a bien été transmis.</p>",
)

A["urssaf"] = sec(
"<h2>Les pièces demandées par l'Urssaf</h2>",
"<p>Que vous soyez micro-entrepreneur, employeur ou particulier employeur, l'Urssaf peut vous demander des justificatifs depuis votre espace en ligne : pièce d'identité, justificatif de domicile, Kbis ou attestation d'immatriculation, RIB, échéanciers, preuves de paiement ou documents pour une demande de délai. La messagerie de l'espace permet de joindre des fichiers à chaque message.</p>",
"<h2>Les micro-entrepreneurs</h2>",
"<p>À la création, on vous demande surtout une pièce d'identité et un justificatif de domicile. Plus tard, pour une demande de remboursement ou une contestation, joignez des preuves claires : relevé bancaire avec les lignes concernées surlignées, facture, attestation. Masquez les informations qui n'ont rien à voir avec la demande avant de numériser le relevé.</p>",
"<h2>Bonnes pratiques</h2>",
"<ul><li>Exportez directement en PDF depuis votre logiciel de facturation ou votre banque.</li><li>Réunissez les pièces d'une même demande dans un seul PDF, dans l'ordre logique.</li><li>Nommez le fichier avec l'objet et la période, par exemple justificatifs-delai-2026.pdf.</li><li>Gardez une copie de chaque message envoyé et de ses pièces jointes.</li></ul>",
"<p>Si l'envoi est refusé, vérifiez la taille du fichier puis son format : un fichier Excel ou Word doit être converti en PDF avant d'être joint.</p>",
)

A["compresser-pdf-1-mo"] = sec(
"<h2>Et pour une autre taille ?</h2>",
"<p>Le même outil fonctionne pour toutes les tailles : il suffit de changer la taille cible avant de lancer la compression. Voici les cas les plus courants :</p>",
"<ul><li><b>100 à 300 Ko</b> : certains formulaires très stricts (pièces jointes de concours, anciens portails). Réservez ces tailles aux documents d'une ou deux pages, en noir et blanc.</li><li><b>500 Ko</b> : quelques formulaires ameli et plateformes de recrutement.</li><li><b>1 Mo</b> : la taille la plus sûre pour la majorité des démarches (CAF, MSA, inscriptions, CV).</li><li><b>2 Mo</b> : ANTS, ANEF et de nombreux portails récents, pour des documents de plusieurs pages.</li><li><b>5 Mo</b> : limite fréquente des pièces jointes par e-mail ou du total d'un envoi.</li></ul>",
"<h2>Pourquoi ne pas toujours viser le plus petit ?</h2>",
"<p>Plus la taille cible est basse, plus les images du PDF sont réduites. Un document de 10 pages compressé à 100 Ko devient souvent flou. La bonne règle : viser juste en dessous de la limite demandée, pas beaucoup plus bas. Si le résultat est illisible, repartez d'un original de meilleure qualité, ou <a href=\"../separer-pdf/\">séparez le PDF</a> pour envoyer les pages en plusieurs fichiers.</p>",
)

A["heic-en-jpg"] = sec(
"<h2>Pourquoi les photos d'iPhone posent problème</h2>",
"<p>Depuis plusieurs années, les iPhone enregistrent les photos au format HEIC. Ce format est plus léger que le JPG à qualité égale, mais la plupart des sites administratifs (CAF, ameli, ANTS, universités) ne le reconnaissent pas : la photo est refusée avec un message de format non accepté, ou elle s'affiche comme un fichier vide.</p>",
"<h2>Ce que fait l'outil</h2>",
"<ul><li>Il lit vos photos HEIC directement dans votre navigateur, sans les envoyer sur Internet.</li><li>Il les convertit en JPG, le format accepté partout.</li><li>Il les réduit à la taille maximale choisie, en gardant le meilleur niveau de qualité possible.</li><li>Il nettoie le nom du fichier (sans accents ni espaces).</li></ul>",
"<h2>Éviter le HEIC à l'avenir</h2>",
"<p>Sur iPhone, dans Réglages, puis Appareil photo, puis Formats, choisissez « Le plus compatible » : les nouvelles photos seront directement en JPG. Elles prendront un peu plus de place sur le téléphone, mais vous n'aurez plus à les convertir. Pour envoyer un document de plusieurs pages, préférez <a href=\"../heic-en-pdf/\">HEIC en PDF</a>, qui réunit toutes les photos dans un seul fichier.</p>",
"<p>Si votre photo est refusée malgré la conversion, lisez le guide <a href=\"../guides/photo-iphone-refusee/\">photo d'iPhone refusée</a> : le problème vient alors souvent du poids minimum ou du cadrage.</p>",
)

A["guides/nom-de-fichier-refuse"] = sec(
"<h2>Les caractères qui posent problème</h2>",
"<ul><li><b>Les accents</b> : é, è, à, ç sont mal interprétés par certains serveurs anciens.</li><li><b>Les espaces</b> : ils sont parfois transformés en %20 ou coupent le nom.</li><li><b>Les caractères spéciaux</b> : apostrophe, guillemets, slash, deux-points, dièse, esperluette.</li><li><b>Les noms trop longs</b> : au-delà d'une cinquantaine de caractères, certains sites tronquent ou refusent le fichier.</li><li><b>Les doubles extensions</b> : facture.pdf.pdf ou photo.jpg.heic trompent la vérification du format.</li></ul>",
"<h2>Renommer un fichier sur téléphone</h2>",
"<p>Sur iPhone, ouvrez l'application Fichiers, appuyez longuement sur le fichier puis sur Renommer. Sur Android, ouvrez l'application Fichiers ou Mes fichiers, appuyez longuement sur le document puis choisissez Renommer. Sur ordinateur, un clic droit puis Renommer suffit.</p>",
"<h2>Une convention simple qui marche partout</h2>",
"<p>Utilisez uniquement des lettres minuscules sans accents, des chiffres et des tirets courts, par exemple justificatif-domicile-2026.pdf ou carte-identite-recto-verso.pdf. Les noms sont clairs pour l'agent qui les reçoit et acceptés par tous les sites. Les fichiers produits par nos outils sont déjà nommés de cette façon.</p>",
)

A["guides/pdf-trop-lourd"] = sec(
"<h2>5. Vérifier ce qui alourdit le fichier</h2>",
"<p>Un PDF de texte pur pèse quelques dizaines de Ko. S'il fait plusieurs Mo, c'est qu'il contient des images : photos, scans, logos en très haute définition, ou polices complètes intégrées. Les images sont presque toujours en cause, et ce sont elles que l'outil réduit. Un PDF exporté depuis Word avec des photos collées en taille originale peut ainsi passer de 15 Mo à moins de 1 Mo sans perte visible.</p>",
"<h2>6. Ne pas compresser deux fois</h2>",
"<p>Compresser un fichier déjà compressé dégrade la qualité à chaque passage. Si le résultat est trop flou, repartez toujours du fichier d'origine avec une taille cible un peu plus élevée.</p>",
"<h2>Les limites les plus courantes</h2>",
"<ul><li>CAF : 10 Mo au total par envoi (voir <a href=\"../taille-max-fichier-caf/\">taille maximale CAF</a>).</li><li>MDPH : variable selon les départements (voir <a href=\"../taille-max-fichier-mdph/\">taille maximale MDPH</a>).</li><li>Pièce jointe d'e-mail : souvent 10 à 25 Mo au total selon la messagerie, mais certains destinataires bloquent au-delà de 5 Mo.</li></ul>",
"<p>En cas de doute, 1 Mo par fichier est une valeur sûre pour presque toutes les démarches.</p>",
)

A["guides/photo-iphone-refusee"] = sec(
"<h2>Les trois causes d'un refus</h2>",
"<ul><li><b>Le format HEIC</b> : la photo est enregistrée dans un format que le site ne lit pas. Solution : <a href=\"../../heic-en-jpg/\">la convertir en JPG</a>.</li><li><b>Le poids</b> : une photo d'iPhone récent pèse souvent 3 à 6 Mo, au-dessus de la plupart des limites. À l'inverse, certains sites comme ameli refusent aussi les photos trop légères.</li><li><b>Le cadrage ou la qualité</b> : photo floue, sombre, prise de biais ou avec un reflet.</li></ul>",
"<h2>Prendre une bonne photo de document</h2>",
"<p>Posez le document à plat sur une surface sombre et unie, près d'une fenêtre. Tenez le téléphone bien parallèle au document, sans flash pour éviter les reflets. Cadrez tout le document, sans couper les bords, puis recadrez si besoin dans l'application Photos. Pour un document de plusieurs pages, utilisez plutôt le scanner intégré de l'application Notes ou Fichiers, ou notre outil <a href=\"../../heic-en-pdf/\">HEIC en PDF</a>.</p>",
"<h2>Changer le réglage de l'iPhone</h2>",
"<p>Dans Réglages, puis Appareil photo, puis Formats, choisissez « Le plus compatible ». Vos prochaines photos seront en JPG, directement acceptées par les sites administratifs. Il restera seulement à les réduire si elles dépassent la taille maximale.</p>",
)

A["guides/recto-verso-carte-identite-pdf"] = sec(
"<h2>Pourquoi un seul fichier ?</h2>",
"<p>La plupart des administrations (CAF, ANTS, France Travail, préfectures) considèrent la carte d'identité comme un seul document. Si vous envoyez le recto et le verso dans deux fichiers séparés, il arrive que seul le premier soit pris en compte, et le dossier est déclaré incomplet. Avec les deux faces dans un même PDF, l'agent voit tout d'un coup.</p>",
"<h2>Réussir les photos des deux faces</h2>",
"<ul><li>Posez la carte sur une feuille de couleur unie, de préférence foncée, pour bien voir les bords.</li><li>Photographiez chaque face de face, sans flash : l'hologramme de la carte reflète beaucoup la lumière.</li><li>Recadrez autour de la carte pour ne garder que le document.</li><li>Vérifiez que le numéro de la carte, les dates et la bande en bas du verso sont nets.</li></ul>",
"<h2>Ensuite</h2>",
"<p>Ajoutez les deux photos dans l'outil, dans l'ordre recto puis verso, et téléchargez le PDF. Il est déjà réduit et nommé proprement. Le même principe vaut pour le permis de conduire, la carte Vitale ou un titre de séjour. Gardez le fichier dans <a href=\"../../mes-documents/\">Mes documents</a> : on vous le redemandera souvent.</p>",
)

A["guides/scanner-document-telephone"] = sec(
"<h2>Le scanner intégré de votre téléphone</h2>",
"<p><b>Sur iPhone</b> : ouvrez l'application Notes, créez une note, touchez l'icône appareil photo puis Scanner des documents. Le téléphone détecte les bords, redresse la page et enchaîne plusieurs pages. Partagez ensuite la note en PDF. L'application Fichiers propose aussi Scanner des documents via le menu en haut de l'écran.</p>",
"<p><b>Sur Android</b> : l'application Google Drive propose un bouton Scanner (icône appareil photo dans le bouton d'ajout). Certains téléphones ont aussi un mode Document dans l'application appareil photo.</p>",
"<h2>Les réglages qui font la différence</h2>",
"<ul><li><b>Lumière naturelle</b>, sans flash, pour éviter les reflets et les ombres.</li><li><b>Mode noir et blanc ou niveaux de gris</b> pour un document de texte : le fichier est beaucoup plus léger.</li><li><b>Une page, une prise</b> : prenez le temps de bien cadrer chaque page.</li></ul>",
"<h2>Après le scan</h2>",
"<p>Un scan de téléphone pèse souvent 1 à 3 Mo par page. Passez-le dans l'outil ci-dessus pour le ramener à la taille demandée, et <a href=\"../../fusionner-pdf/\">fusionnez</a> si vous avez scanné les pages séparément.</p>",
)

A["modeles"] = sec(
"<h2>Comment fonctionnent ces modèles</h2>",
"<p>Chaque modèle se présente sous forme de formulaire : vous saisissez vos informations, vous vérifiez l'aperçu, puis vous téléchargez un PDF prêt à imprimer ou à signer. Rien n'est envoyé sur Internet, le document est créé directement dans votre navigateur.</p>",
"<h2>Quel modèle pour quelle situation ?</h2>",
"<ul><li><b>Attestation d'hébergement</b> : vous logez un proche qui n'a pas de justificatif de domicile à son nom. Il la joindra avec votre pièce d'identité et votre propre justificatif.</li><li><b>Attestation sur l'honneur</b> : quand une administration demande une déclaration écrite sur un fait que vous ne pouvez pas prouver autrement (absence de revenus, situation familiale).</li><li><b>Procuration</b> : pour qu'une autre personne retire un colis, un recommandé ou fasse une démarche à votre place.</li><li><b>Recours CAF</b> : pour contester une décision de la CAF par un recours amiable, avant toute autre voie.</li></ul>",
"<h2>Signer le document</h2>",
"<p>Imprimez le PDF, signez-le à la main, puis scannez-le avec votre téléphone (voir le guide <a href=\"../guides/scanner-document-telephone/\">scanner un document</a>). Réduisez enfin le fichier avec l'outil adapté à votre démarche avant de l'envoyer.</p>",
)

MARK = re.compile(r'\n?<!--x1-->.*?<!--/x1-->\n?', re.S)

done = 0
for path, html in A.items():
    f = os.path.join(ROOT, path, "index.html")
    s = open(f, encoding="utf-8").read()
    s = MARK.sub("\n", s)
    block = "\n<!--x1-->\n" + html + "\n<!--/x1-->\n"
    for anchor in ["<h2>Questions fréquentes</h2>", "<h2>Voir aussi</h2>", "</main>"]:
        i = s.find(anchor, s.find("<main"))
        if i > 0:
            s = s[:i] + block + s[i:]
            break
    else:
        raise SystemExit("ancre introuvable " + f)
    open(f, "w", encoding="utf-8").write(s)
    done += 1
print("pages enrichies :", done)
