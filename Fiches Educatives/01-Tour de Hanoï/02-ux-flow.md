# 02 — UX Flow (écran par écran)

## 2.1 Écran A — Entrée activité (Start)
**But** : lancer vite, sans friction.

### UI / éléments
- Titre : “Tour de Hanoï”
- Choix disques : 3 / 4 / 5 (plus via “+” adulte ou progression)
- Bouton primaire : “Commencer”
- Bouton secondaire : “Démo (20 s)”
- Pictos règles : (1 disque) + (interdit grand sur petit)

### Copie enfant (voix + micro-texte)
- “On déplace la pile de A vers C.”
- “Un disque à la fois.”
- “Grand sur petit = interdit.”

## 2.2 Écran B — Démo guidée (option)
**But** : montrer l’interaction + une stratégie simple.

### Comportement
- Montrer 2–3 coups (lent)
- Stop + prompt : “À toi.”

### Copie
- “D’abord, on bouge les petits.”
- “On libère le grand disque.”

## 2.3 Écran C — Jeu (core)
**But** : jeu libre, tactile, auto-correction.

### Interaction (recommandé)
- **Tap-to-pick + tap-to-drop** (robuste enfant)
  - Tap disque top => “sélectionné”
  - Tours valides surlignées
  - Tap tour => drop
- Option avancée : drag-and-drop (si fiable)

### HUD minimal
- Bouton : “Indice”
- Bouton : “Annuler” (1 step)
- Indicateur : “Coups” (optionnel enfant, utile parent)
- Bouton : “Règles” (ouvre mini overlay)

### États & contraintes
- Coup invalide :
  - action refusée (auto-correction)
  - micro animation “rebond”
  - rappel court règle (max 1 phrase)
- Blocage :
  - si 20–30 s sans progrès OU 3 essais invalides rapprochés
  - proposer “Pause stratégie” (voir 04)

### Micro-objectifs (affichage léger)
- “Libérer le grand disque”
- “Construire une pile provisoire”
- “Recomposer la pile finale”

## 2.4 Écran D — Fin de niveau
**But** : valoriser effort + proposer suite.

### Contenu
- “Bravo !”
- “Tu as réussi.”
- Boutons : “Rejouer” / “Niveau suivant”
- Option enfant : sticker/badge non-compétitif

### Option métrique (plutôt parent)
- coups réalisés
- indices utilisés
- durée

## 2.5 Adaptation difficulté (règles simples)
- Si frustration (abandon / 2 resets / beaucoup d’indices) :
  - proposer -1 disque ou “Mode calme” (indices plus tôt)
- Si réussite fluide (peu d’indices, peu d’invalides) :
  - proposer +1 disque
