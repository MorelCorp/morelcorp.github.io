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
permalink: post/confidence-ratio-method/
cover_image:
  src: /images/posts/planning.jpg
  alt: "Photo par Jason Goodman sur Unsplash"
  author: "Jason Goodman"
  author_url: "https://unsplash.com/fr/@jasongoodman_youxventures"
  source: "Unsplash"
  source_url: "https://unsplash.com/"
categories: [agile, planification, estimation]
tags: [planification-sprint, ratio-confiance, planification-capacite]
---

Parlons d'estimations. Ce sujet a déclenché plus de débats dans les équipes de développement logiciel que vi vs emacs (bon, peut-être pas tout à fait, mais presque...).

Les story points semblaient être la solution parfaite : abstraits, relatifs, immunisés contre la microgestion basée sur les heures redoutées. Et honnêtement ? J'adore encore les story points. Mais ils sont incroyablement difficiles à maîtriser, et la plupart des organisations tombent dans le même piège : les utiliser comme métriques pour juger la performance d'équipe. "Pourquoi vous n'avez livré que 23 points ce sprint quand vous vous étiez engagés à 30 ?"

Ensuite, il y a l'approche Kanban (abandonner complètement l'estimation, utiliser l'historique des tâches et les simulations Monte Carlo). C'est mathématiquement solide mais ça demande une foi aveugle de la part des parties prenantes. Essaie d'expliquer à un gestionnaire de projet que tu ne peux pas lui donner un échéancier parce que "les chiffres vont émerger des données."

Le mouvement #NoEstimates ? Je suis plutôt fan. Laisse une petite équipe autonome faire son meilleur travail, et tu obtiendras des merveilles...

MAIS il y a de vrais avantages aux grandes organisations : stabilité, ressources, capacité de s'attaquer à de plus gros problèmes. Et voici la vérité inconfortable : tu ne peux pas être plus Agile que ton environnement ne te le permet. La plupart des managers pensent en termes d'heures. Pas parce qu'ils sont des dinosaures, mais parce que c'est le langage de la planification d'affaires.

> tu ne peux pas être plus Agile que ton environnement ne te le permet

Et si on pouvait combler ce fossé ?

## La Méthode du Ratio de Confiance

La plupart des méthodes d'estimation en développement logiciel ignorent l'incertitude ou la cachent derrière des chiffres abstraits. La méthode du ratio de confiance met l'incertitude au premier plan, et permet de planifier un sprint avec une vision claire et chiffrée du risque.

## Les Bases

Pour chaque tâche :

1. **Estime le travail en heures** (ex : 10h)
2. **Assigne un pourcentage de confiance** (ex : 80% si tu es assez sûr, 50% s'il y a des inconnues, etc.)

Avec ça, tu obtiens :

- **Estimation optimiste** = Estimation originale × % de confiance
- **Estimation pessimiste** = Estimation originale ÷ % de confiance

Mais comment calculer le **ratio de confiance pour tout le sprint** en tenant compte de la capacité de l'équipe ?

## La Formule du Ratio de Confiance

Le ratio de confiance du sprint prend en compte la capacité réelle de l'équipe pour te donner une mesure précise de la probabilité de succès.

**Formule :**

**Si capacité ≥ total pessimiste :** Confiance = 100%  
**Si capacité ≤ total optimiste :** Confiance = 0%  
**Si capacité est entre optimiste et pessimiste :** Confiance = (capacité - optimiste) ÷ (pessimiste - optimiste) × 100%

Ce chiffre te dit, pour l'ensemble des tâches, quelle est la probabilité réelle de succès compte tenu de ta capacité.

---

## Exemple pas à pas

Prenons un exemple simple avec 3 tâches et une capacité d'équipe de 32 heures.

| Tâche | Estimation originale (h) | Confiance (%) | Optimiste (h) | Pessimiste (h) |
| ----- | ------------------------ | ------------- | ------------- | -------------- |
| A     | 8                        | 80            | 6,4           | 10             |
| B     | 12                       | 60            | 7,2           | 20             |
| C     | 6                        | 90            | 5,4           | 6,7            |

**Capacité de l'équipe :** 32 heures

**1. Calcule l'optimiste et le pessimiste pour chaque tâche**

- A : 8h × 0,8 = 6,4h (optimiste), 8h ÷ 0,8 = 10h (pessimiste)
- B : 12h × 0,6 = 7,2h (optimiste), 12h ÷ 0,6 = 20h (pessimiste)
- C : 6h × 0,9 = 5,4h (optimiste), 6h ÷ 0,9 = 6,7h (pessimiste)

**2. Additionne les totaux**

- Total optimiste : 6,4 + 7,2 + 5,4 = **19h**
- Total pessimiste : 10 + 20 + 6,7 = **36,7h**

**3. Compare à la capacité de l'équipe**

- Capacité (32h) est entre optimiste (19h) et pessimiste (36,7h)
- Donc on utilise la formule d'interpolation : (32 - 19) ÷ (36,7 - 19) × 100%
- Ratio de confiance du sprint = 13 ÷ 17,7 × 100% ≈ **73,4%**

**4. Qu'est-ce que ça veut dire ?**

- Tu as **73,4% de confiance** que l'équipe pourra compléter les trois tâches dans le sprint, avec une capacité de 32h.
- Cette méthode te donne une mesure précise de la probabilité de succès !

---

## À retenir

- Le ratio de confiance du sprint te donne une mesure précise de la probabilité de succès
- Cette méthode rend le risque visible et actionnable
- Tu peux ajuster le scope ou raffiner les tâches pour atteindre le niveau de confiance désiré

---

**Essaie dans ton prochain sprint !**  
Et si tu veux voir ces calculs faits automatiquement, découvre [PlanPrism](/planprism/), notre app qui met cette méthode en pratique.

Merci d'avoir lu,
JF

Passe une excellente semaine !
