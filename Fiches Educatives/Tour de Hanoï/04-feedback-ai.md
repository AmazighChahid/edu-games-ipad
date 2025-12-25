# 04 — Feedback & IA (guidance douce)

## 4.1 Principes
- Pas de punition, pas de “Perdu”
- Encouragement orienté effort : “Tu as essayé.”
- Aide progressive : Question → Indice 1 coup → Micro-démo 2 coups

## 4.2 Feedback actions
### Coup valide
- Son “clic” doux
- Micro “sparkle” discret

### Coup invalide (grand sur petit / disque non-top)
- Refus d’action (auto-correction)
- Animation rebond + shake léger
- Message court (1 ligne)
  - “Grand sur petit : interdit.”
  - “On prend le disque du haut.”

## 4.3 Détection blocage (heuristiques simples)
Déclencher “Pause stratégie” si :
- 3 coups invalides en < 20 s
OU
- 25 s sans déplacement
OU
- 6 coups qui alternent A↔B sans réduire la pile

## 4.4 Pause stratégie (overlay)
### Objectif
Reformuler un sous-objectif clair.

### Contenu
- “Ton mini-but : libérer le grand disque.”
- Boutons :
  - “Un indice”
  - “Montre-moi 2 coups” (micro-démo)
  - “Je continue”

## 4.5 Indices (1 coup)
L’indice doit :
- montrer **1 action** (disque + tour)
- ne pas révéler la suite
- être accompagné d’une question courte
Ex :
- “Où peux-tu poser le petit disque ?”

## 4.6 Micro-démo (2 coups max)
- L’IA joue 2 coups
- Puis stop : “À toi.”

## 4.7 Scripts enfant (courts)
- Intro :
  - “But : mettre la pile sur C.”
  - “Un disque à la fois.”
  - “Grand sur petit : interdit.”
- Encouragement :
  - “Tu réfléchis bien.”
  - “Continue, tu y es presque.”
  - “Essaie une autre tour.”
- Fin :
  - “Bravo ! Tu as réussi.”
  - “On passe au niveau suivant ?”
