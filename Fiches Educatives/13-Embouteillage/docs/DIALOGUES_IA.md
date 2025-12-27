# DIALOGUES IA : Embouteillage 🚗

> **Mascotte** : Gus le Garagiste 🦝🔧  
> **Personnalité** : Patient, encourageant, expert en "problèmes coincés"  
> **Ton** : Chaleureux, utilise des métaphores de mécanique

---

## 🎬 Écran d'introduction

### Premier lancement (onboarding)

```
GUS : "Salut ! Moi c'est Gus, le garagiste du coin ! 🔧"

GUS : "Dans mon parking, c'est souvent la pagaille... 
       Des voitures coincées partout !"

GUS : "Tu veux m'aider à faire sortir le taxi jaune ? 🚕"

[Animation : Gus montre le taxi]

GUS : "C'est simple : déplace les voitures pour libérer le passage.
       Mais attention, elles roulent en ligne droite seulement !"

[Démo interactive : 2-3 mouvements guidés]

GUS : "Parfait ! Tu as compris le truc. 
       Maintenant, à toi de jouer !"
```

### Retour utilisateur habituel

**Matin (6h-12h)**
```
"Bonjour [Prénom] ! Le garage est déjà bien rempli ce matin !"
"Coucou ! Prêt·e à débloquer quelques voitures ?"
"Salut champion·ne ! On reprend où on s'était arrêtés ?"
```

**Après-midi (12h-18h)**
```
"Re-bonjour ! Les embouteillages n'attendent pas !"
"Ah, te revoilà ! J'ai justement un défi pour toi..."
"Super de te revoir ! Le parking est encore plus encombré !"
```

**Soir (18h-22h)**
```
"Bonsoir ! Une petite session avant le dodo ?"
"Coucou ! On démêle quelques voitures ensemble ?"
"Salut ! C'est l'heure de faire chauffer les méninges !"
```

### Sélection de catégorie

**Débutant 🌱**
```
"Les premiers niveaux pour s'échauffer ! Parfait pour commencer."
```

**Apprenti 🔧**
```
"Ça se complique un peu ! Tu es prêt·e ?"
```

**Mécanicien ⚙️**
```
"Attention, ça devient sérieux ! Tu as les outils qu'il faut ?"
```

**Expert 🏆**
```
"Wow, tu vises haut ! Ces puzzles sont costauds !"
```

**Maître 👑 (si débloqué)**
```
"Les défis ultimes ! Seuls les vrais pros y arrivent !"
```

**Catégorie verrouillée 🔒**
```
"Patience ! Termine d'abord les niveaux précédents."
"Bientôt débloqué ! Continue comme ça !"
```

---

## 🎮 Pendant le puzzle

### Début de niveau

**Niveaux faciles (1-10)**
```
"Allez, on y va doucement !"
"Un petit échauffement pour commencer."
"Observe bien avant de bouger !"
```

**Niveaux moyens (11-40)**
```
"Celui-là demande un peu de réflexion..."
"Prends ton temps, pas de panique !"
"Regarde bien qui bloque qui !"
```

**Niveaux difficiles (41-80)**
```
"Attention, c'est du sérieux !"
"Ce niveau, c'est du costaud !"
"Réfléchis bien avant chaque mouvement !"
```

### Premier mouvement

```
"C'est parti ! Voyons ce que ça donne..."
"Intéressant comme début !"
"Hmm, regardons ce que ça change..."
```

### Bons mouvements

**Mouvement efficace**
```
"Bien joué !"
"Ça avance !"
"Bonne idée !"
"Malin !"
"Tu te rapproches !"
```

**Séquence de bons mouvements**
```
"Tu gères ! Continue !"
"Quelle stratégie ! 🌟"
"Tu as trouvé le truc !"
"Impressionnant !"
```

**Proche de la solution**
```
"Tu y es presque !"
"Encore un ou deux coups !"
"Le taxi voit la sortie !"
"La victoire est proche !"
```

### Mouvements neutres

```
"Hmm, voyons ce que ça donne..."
"Continue, tu explores !"
"Intéressant..."
```

### Mouvements qui compliquent

**Après un mouvement qui éloigne de la solution**
```
"Hmm, est-ce que ça aide le taxi ?"
"Réfléchis : est-ce que le chemin s'ouvre ?"
"Regarde le taxi... son chemin est-il plus libre ?"
```

**Retour à la case départ (plusieurs annulations)**
```
"Pas de souci, on recommence tranquille !"
"Parfois il faut tout reprendre, c'est normal !"
"Une nouvelle stratégie, c'est malin !"
```

### Blocage détecté

**30 secondes sans mouvement**
```
"Tu réfléchis, c'est bien ! Besoin d'un coup de pouce ?"
"Prends ton temps... ou utilise l'indice si tu veux !"
"N'hésite pas à demander de l'aide, c'est fait pour ça !"
```

**5+ mouvements sans progrès**
```
"Hmm, on tourne un peu en rond..."
"Et si tu essayais une autre approche ?"
"Parfois, il faut changer de stratégie !"
```

**10+ mouvements sans progrès**
```
"Ce niveau est coriace ! Un indice peut aider."
"Pas facile celui-là... tu veux un coup de main ?"
"Je peux te montrer le premier mouvement si tu veux !"
```

---

## 💡 Système d'indices

### Proposition d'indice

```
GUS : "Tu veux un petit indice ? 💡"
      [Oui, montre-moi] [Non, je cherche encore]
```

### Indice niveau 1 (gratuit)

```
"Regarde bien : quel véhicule bloque DIRECTEMENT le taxi ?"
"Le taxi doit aller à droite. Qu'est-ce qui l'empêche ?"
"Concentre-toi sur ce qui est juste devant le taxi."
```

### Indice niveau 2 (-1⭐)

```
"Voilà, ce véhicule doit bouger en premier !"
[Highlight du véhicule concerné]
"Tu vois celui qui clignote ? C'est par là que ça commence !"
```

### Indice niveau 3 (-2⭐)

```
"Je te montre les deux premiers mouvements..."
[Animation : flèches montrant 2 déplacements]
"Suis les flèches, puis continue tout seul !"
```

### Indice niveau 4 (-3⭐)

```
"OK, je te montre toute la solution. Regarde bien !"
[Animation complète de la solution]
"Tu as vu comment ça marche ? Essaie de refaire pareil !"
```

### Après utilisation d'indice

```
"Voilà ! Maintenant, à toi de jouer !"
"C'est plus clair maintenant ?"
"Allez, termine le travail !"
```

---

## 🏆 Victoire

### Victoire standard

```
"BRAVO ! Le taxi est libre ! 🎉"
"Super boulot ! Tu as réussi !"
"Génial ! La route est dégagée !"
"Yes ! Le taxi peut partir !"
```

### Victoire optimale (coups = optimal)

```
"PARFAIT ! Solution optimale ! Tu es un·e pro ! 🌟"
"Incroyable ! Pas un mouvement de trop !"
"Wow ! C'est la meilleure solution possible !"
"Chapeau ! Même moi j'aurais pas fait mieux !"
```

### Victoire proche de l'optimal (+1-2 coups)

```
"Excellent ! Presque parfait !"
"Très bien joué ! Juste un ou deux coups de plus que l'idéal."
"Super efficace ! Tu te rapproches de la perfection !"
```

### Victoire après difficulté (beaucoup de coups)

```
"Tu as persévéré et tu as réussi ! C'est ça l'important !"
"Bravo pour ta patience ! Tu n'as pas abandonné !"
"La victoire est là ! Peu importe le nombre de coups !"
```

### Victoire après indices

```
"Tu as réussi ! Les indices sont faits pour aider, c'est bien de les utiliser !"
"Bravo ! La prochaine fois, tu auras peut-être besoin de moins d'aide !"
"Bien joué ! Tu as su demander de l'aide quand il fallait !"
```

### Selon les étoiles obtenues

**3 étoiles ⭐⭐⭐**
```
"Trois étoiles ! Tu es un·e champion·ne !"
"Score parfait ! Quelle planification !"
"Maximum d'étoiles ! Tu gères !"
```

**2 étoiles ⭐⭐**
```
"Deux étoiles, c'est très bien !"
"Beau travail ! Tu peux revenir pour les 3 étoiles si tu veux !"
"Bien joué ! Il reste une étoile à attraper !"
```

**1 étoile ⭐**
```
"Une étoile, c'est déjà super ! Tu as réussi !"
"Le plus important, c'est d'avoir trouvé la solution !"
"Bien ! Tu peux réessayer pour améliorer ton score !"
```

---

## 📊 Commentaires sur la performance

### Analyse du temps

**Résolu rapidement**
```
"Rapide comme l'éclair ! ⚡"
"Tu as trouvé vite !"
"Pas le temps de s'ennuyer avec toi !"
```

**Résolu après réflexion**
```
"Tu as bien pris le temps de réfléchir, ça a payé !"
"La patience, c'est la clé !"
"Bien observé avant d'agir !"
```

### Analyse des mouvements

**Peu de mouvements inutiles**
```
"Quelle efficacité ! Presque aucun mouvement perdu !"
"Tu ne fais pas de gestes inutiles, c'est pro !"
```

**Beaucoup d'exploration**
```
"Tu as exploré plein de possibilités, c'est comme ça qu'on apprend !"
"Chaque essai t'a appris quelque chose !"
```

---

## 🎁 Badges et récompenses

### Déblocage de badge

**Premier Démarrage 🔑**
```
"Ton premier niveau ! Voici le badge du débutant !"
```

**Planificateur 📋**
```
"5 niveaux en solution optimale ! Tu mérites le badge Planificateur !"
```

**Patience 🐢**
```
"Tu n'as pas abandonné malgré 50 coups ! Badge Patience débloqué !"
```

**Éclair ⚡**
```
"Moins de 30 secondes ! Tu as le badge Éclair !"
```

**Sans Aide 💪**
```
"10 niveaux sans indice ! Badge Sans Aide pour toi !"
```

**Stratège 🧠**
```
"Tous les niveaux Apprenti terminés ! Tu es un vrai Stratège !"
```

**Mécanicien Pro 🔧**
```
"Section Mécanicien complète ! Badge Mécanicien Pro !"
```

**Maître du Parking 👑**
```
"NIVEAU 80 TERMINÉ ! Tu es le MAÎTRE DU PARKING ! 👑"
```

### Carte à collectionner débloquée

```
"Oh ! Tu as débloqué une nouvelle carte !"
"Regarde ce que tu as gagné ! 🃏"
"Une carte de plus pour ta collection !"
```

---

## ⚠️ Messages d'erreur et edge cases

### Mouvement impossible

```
"Oups ! Cette voiture ne peut pas aller par là."
"Bloqué ! Un autre véhicule est sur le chemin."
"Cette direction est occupée !"
```

### Tentative de mouvement diagonal

```
"Les voitures roulent tout droit, pas en diagonale !"
"Horizontal ou vertical seulement !"
```

### Tap sur le taxi (pas encore libéré)

```
"Le taxi veut sortir, mais le chemin est bloqué !"
"Il faut d'abord dégager la route pour le taxi !"
"Le taxi attend que tu libères le passage !"
```

### Pause / interruption

```
"À tout à l'heure ! Ta partie est sauvegardée."
"Pas de souci, on reprendra plus tard !"
"Le parking t'attend quand tu reviendras !"
```

---

## 🌙 Messages contextuels

### Fin de session longue (15+ min)

```
"Wow, quelle session ! Tu as bien travaillé. Une pause ?"
"Tu joues depuis un moment ! C'est bien de faire une pause."
```

### Série de victoires

```
"3 niveaux d'affilée ! Tu es en forme !"
"5 victoires ! Rien ne t'arrête !"
```

### Série de difficultés

```
"Ce niveau est vraiment dur. Tu veux en essayer un autre ?"
"Pas facile celui-là ! Peut-être revenir plus tard ?"
"N'hésite pas à utiliser un indice, c'est fait pour ça !"
```

### Retour après absence

**Après 1+ jours**
```
"Content de te revoir ! Le garage t'attendait !"
"Re-bonjour ! Prêt·e à reprendre ?"
```

**Après 1+ semaines**
```
"Ça faisait longtemps ! Bienvenue au garage !"
"Tu m'avais manqué ! On s'y remet ?"
```

---

## 📝 Notes de style

### Vocabulaire adapté 6-10 ans
- "Voiture" plutôt que "véhicule"
- "Coincé" plutôt que "bloqué"
- "Chemin" plutôt que "passage"
- "Bouger" plutôt que "déplacer"

### Métaphores mécaniques de Gus
- "Ça roule !" (ça va bien)
- "On démarre !" (on commence)
- "C'est du solide !" (c'est bien)
- "Plein gaz !" (encouragement)
- "Moteur !" (c'est parti)

### Éviter
- Termes négatifs ("mauvais", "échec", "raté")
- Pression temporelle ("dépêche-toi")
- Comparaisons ("les autres y arrivent")

---

*Dialogues IA v1.0 — Embouteillage 🚗*
*App Éducative iPad — Décembre 2024*
