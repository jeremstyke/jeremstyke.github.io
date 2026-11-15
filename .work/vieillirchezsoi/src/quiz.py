# -*- coding: utf-8 -*-
# Questionnaire « Quel équipement pour mon parent ? »
# ITEMS : id -> (nom, recherche Amazon, conseil, guide lié ou '')
ITEMS = {
  'tapis': ("Tapis antidérapant (douche ou baignoire)", "tapis antiderapant douche", "Le premier achat pour la salle de bains, à l'intérieur et à la sortie de la douche ou de la baignoire.", ''),
  'siege': ("Siège ou chaise de douche", "chaise de douche accoudoirs", "Pour se laver assis, sans fatigue ni perte d'équilibre.", 'comment-choisir-siege-de-douche/'),
  'planche': ("Planche ou siège de baignoire", "planche de bain senior", "Pour continuer à utiliser la baignoire en restant assis.", 'planche-de-bain/'),
  'barres': ("Barres d'appui vissées", "barre d'appui salle de bain", "Près de la douche et des toilettes, solidement fixées.", 'barre-d-appui-salle-de-bain/'),
  'rehausseur': ("Rehausseur de WC", "rehausseur wc accoudoirs", "Pour se relever des toilettes plus facilement.", 'rehausseur-wc/'),
  'releveur': ("Fauteuil releveur", "fauteuil releveur", "Quand se lever d'un fauteuil devient difficile. À essayer si possible.", 'fauteuil-releveur/'),
  'poignee': ("Poignée d'aide au lever", "poignee aide au lever lit", "Pour s'asseoir puis se lever du lit.", ''),
  'veilleuse': ("Veilleuses à détecteur de mouvement", "veilleuse detecteur de mouvement", "Elles éclairent le trajet de nuit entre la chambre et les toilettes.", 'veilleuse-detecteur-de-mouvement/'),
  'bouton': ("Bouton d'appel d'urgence", "bouton appel urgence senior", "Pour prévenir un proche sans atteindre le téléphone.", 'detecteur-de-chute/'),
  'detecteur': ("Détecteur de chute", "montre detection de chute senior", "À comparer avec un service de téléassistance.", 'detecteur-de-chute/'),
  'telephone': ("Téléphone simple compatible 4G", "telephone portable senior 4g", "Grosses touches, sonnerie forte et touches de raccourci.", 'meilleur-telephone-portable-senior/'),
  'boitecle': ("Boîte à clés sécurisée", "boite a cle securisee", "Pour que les proches, les aides et les secours puissent entrer.", ''),
  'canne': ("Canne réglable", "canne de marche reglable", "Réglée à la bonne hauteur, avec un embout antidérapant.", 'canne-de-marche/'),
  'rollator': ("Rollator", "rollator 4 roues siege", "Pour marcher avec plus d'assurance et faire une pause grâce au siège.", 'meilleur-rollator/'),
  'deambulateur': ("Déambulateur", "deambulateur pliant", "Pour un appui très stable, surtout à l'intérieur.", 'deambulateur-ou-rollator/'),
  'mainc': ("Main courante d'escalier", "main courante escalier", "Idéalement des deux côtés de l'escalier.", ''),
  'bandes': ("Bandes antidérapantes pour escalier", "bande antiderapante escalier", "Un petit achat qui sécurise chaque marche.", ''),
  'pilulier': ("Pilulier", "pilulier semaine", "Pour s'y retrouver dans les prises, avec l'aide du pharmacien.", 'pilulier/'),
  'loupe': ("Loupe éclairante", "loupe eclairante lecture", "Pour lire le courrier, les notices et les boîtes.", ''),
  'casque': ("Casque TV sans fil", "casque tv sans fil senior", "Pour entendre la télévision sans monter le son.", ''),
  'chaussures': ("Chaussures fermées et stables", "chaussures confort senior", "Elles tiennent bien le pied, contrairement aux mules.", 'prevenir-les-chutes-a-la-maison/'),
  'pince': ("Pince de préhension", "pince de prehension", "Pour ramasser un objet sans se pencher.", ''),
}
# Questions : (id, texte, multiple, [(valeur, libellé, [ids essentiels], [ids utiles])])
QUESTIONS = [
  ('lavage', "Pour se laver, la personne utilise :", False, [
    ('douche', "Une douche", ['tapis', 'siege', 'barres'], []),
    ('baignoire', "Une baignoire", ['tapis', 'planche', 'barres'], []),
  ]),
  ('logement', "Elle vit dans :", False, [
    ('etage', "Une maison avec escalier", ['mainc'], ['bandes']),
    ('plainpied', "Un logement de plain-pied", [], []),
    ('appart', "Un appartement", [], []),
  ]),
  ('seule', "Elle vit :", False, [
    ('oui', "Seule", ['bouton', 'telephone'], ['boitecle']),
    ('non', "Avec quelqu'un", [], ['telephone']),
  ]),
  ('chute', "Est-elle déjà tombée, ou a-t-elle peur de tomber ?", False, [
    ('oui', "Oui", ['veilleuse', 'chaussures'], ['detecteur', 'bouton']),
    ('non', "Non", [], ['veilleuse']),
  ]),
  ('marche', "Pour marcher, elle :", False, [
    ('seule', "Marche seule sans difficulté", [], []),
    ('instable', "Est un peu instable", ['canne'], []),
    ('canne', "Utilise déjà une canne et fatigue vite", ['rollator'], []),
    ('appui', "A besoin d'un appui solide", ['deambulateur'], []),
  ]),
  ('gestes', "A-t-elle du mal à (plusieurs choix possibles) :", True, [
    ('wc', "Se relever des toilettes", ['rehausseur'], []),
    ('fauteuil', "Se lever d'un fauteuil", ['releveur'], []),
    ('lit', "Sortir du lit", ['poignee'], []),
    ('medic', "S'y retrouver dans ses médicaments", ['pilulier'], []),
    ('vue', "Lire de près", ['loupe'], []),
    ('audition', "Entendre la télévision", ['casque'], []),
    ('pencher', "Se pencher pour ramasser", ['pince'], []),
  ]),
]
