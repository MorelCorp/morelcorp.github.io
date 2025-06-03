---
layout: post
title: "La Méthode du Ratio de Confiance"
subtitle: "Une Nouvelle (?) Approche pour les Estimations Logicielles"
teaser: "Une Nouvelle (?) Approche pour les Estimations Logicielles"
author: "@morelcorpjeff"
date: 2025-06-03
lang: fr
show_meta: true
comments: true
permalink: post/methode-ratio-confiance/
---

<figure>
  <img src="/images/posts/planning.jpg" alt="Photo par Jason Goodman sur Unsplash" style="width:100%;max-width:700px;display:block;margin:0 auto;">
  <figcaption style="text-align:center;font-size:0.95em;">Photo par <a href="https://unsplash.com/fr/@jasongoodman_youxventures" target="_blank" rel="noopener ugc nofollow">Jason Goodman</a> sur <a href="https://unsplash.com/" target="_blank" rel="noopener ugc nofollow">Unsplash</a></figcaption>
</figure>

Parlons d'estimations. Ce sujet a déclenché plus de débats dans les équipes de développement logiciel que vi vs emacs (bon, peut-être pas tout à fait, mais presque...).

Les story points semblaient être la solution parfaite : abstraits, relatifs, immunisés contre la microgestion basée sur les heures redoutées. Et honnêtement ? J'adore encore les story points. Mais ils sont incroyablement difficiles à maîtriser, et la plupart des organisations tombent dans le même piège : les utiliser comme métriques pour juger la performance d'équipe. "Pourquoi vous n'avez livré que 23 points ce sprint quand vous vous étiez engagés à 30 ?"

Ensuite, il y a l'approche Kanban (abandonner complètement l'estimation, utiliser l'historique des tâches et les simulations Monte Carlo). C'est mathématiquement solide mais ça demande une foi aveugle de la part des parties prenantes. Essaie d'expliquer à un gestionnaire de projet que tu ne peux pas lui donner un échéancier parce que "les chiffres vont émerger des données."

Le mouvement #NoEstimates ? Je suis plutôt fan. Laisse une petite équipe autonome faire son meilleur travail, et tu obtiendras des merveilles...

MAIS il y a de vrais avantages aux grandes organisations : stabilité, ressources, capacité de s'attaquer à de plus gros problèmes. Et voici la vérité inconfortable : tu ne peux seulement être aussi Agile que ton environnement te le permet. La plupart des managers pensent en termes d'heures. Pas parce qu'ils sont des dinosaures, mais parce que c'est le langage de la planification d'affaires.

> tu ne peux seulement être aussi Agile que ton environnement te le permet

Et si on pouvait combler ce fossé ?

## La Méthode du Ratio de Confiance

J'ai réfléchi à ce que j'appelle l'approche du "ratio de confiance", une solution qui combine le meilleur des deux mondes. Les gestionnaires traditionnels obtiennent leurs heures, les agilistes peuvent exprimer l'incertitude de manière quantifiable.

Voici comment ça fonctionne :

**Étape 1 : Fais ton Estimation Originale**
Commence avec une estimation de temps en heures. La meilleure supposition de ton équipe (pas un engagement, juste ton évaluation la plus honnête).

**Étape 2 : Ajoute ton Pourcentage de Confiance**
Exprime à quel point tu es confiant dans cette estimation (1-100%) :

- 90% : "Assez sûr de ça, à moins de surprises énormes"
- 50% : "Ça peut aller dans les deux sens, beaucoup d'inconnues"
- 20% : "Coup de dé total"

**Étape 3 : Calcule ta Fourchette**

- **Estimation optimiste** = Originale × % de Confiance
- **Estimation pessimiste** = Originale ÷ % de Confiance

Exemple : tâche de 10 heures avec 50% de confiance = fourchette de 5 à 20 heures.

**Étape 4 : Planifie avec des Fourchettes**
Au lieu de t'engager à exactement X heures, tu t'engages à une fourchette. La planification de sprint devient : "Avec notre capacité de 80 heures, on est 70% confiant qu'on peut compléter cette portée." Ce sera à chaque équipe et chaque manager de définir leurs niveaux de confort par rapport à la confiance (risque) selon l'état actuel des choses.

## Pourquoi Ça Devrait Fonctionner

**Pour les Gestionnaires :** Heures concrètes et fourchettes réalistes. Plus de révélations surprises que l'histoire "3 points" a pris trois semaines.

**Pour les Équipes :** Exprimer l'incertitude sans paraître non professionnel. Cette sensation persistante à propos de la complexité inconnue ? Maintenant c'est quantifié.

**Pour la Planification :** Prendre des décisions éclairées. Tu veux plus de confiance ? Réduis la portée. Échéance serrée ? Accepte une confiance plus faible et le risque qui vient avec ou mieux encore, réduis la portée.

**Pour la Communication :** Les parties prenantes comprennent mieux "15-40 heures" que "histoire 5 points."

## Essayer Ça Manuellement

Voici comment tu pourrais expérimenter avec ça dans ta prochaine session de planification :

1. Pour chaque tâche, demande : "Combien d'heures ?" et "À quel point tu es confiant ?"
2. Calcule les fourchettes avec les formules ci-dessus
3. Additionne les totaux optimistes et pessimistes
4. Compare avec la capacité d'équipe
5. Ajuste la portée selon ton confort avec le niveau de confiance
6. Calcule le ratio de confiance total de l'itération selon le temps disponible.

Un beau side-effect, c'est que ça force des conversations honnêtes. Cette tâche de 4 heures avec 30% de confiance ? Il est temps de parler de ce qui crée l'incertitude. De ça vont probablement émerger des tâches de raffinement qui vont se concentrer sur hausser le niveau de confiance de l'estimation à des niveaux acceptables.

## Expérimentons

Confession : je n'ai pas encore essayé ça avec une équipe... mais je suis convaincu que ça devrait marcher. Les maths sont simples, mais assez robustes pour la planification complexe. Tu pourrais même faire des simulations Monte Carlo sur les fourchettes si tu veux devenir fancy.

Le défi c'est de faire tous ces calculs manuellement. Les spreadsheets fonctionnent, mais c'est maladroit pour visualiser les fourchettes, comparer la capacité, et rendre ça intuitif pour tout le monde.

J'aimerais voir des équipes expérimenter avec cette approche. Peut-être que ça évolue vers quelque chose de complètement différent. Peut-être que ça échoue spectaculairement. Mais je pense qu'il y a quelque chose ici qui vaut la peine d'être exploré.

Si seulement quelqu'un pouvait créer une app qui pourrait gérer toutes ces maths automatiquement et s'intégrer avec les outils de gestion de projet existants... (À Suivre)

Merci d'avoir lu,
JF

Passe une excellente semaine !
