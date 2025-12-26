# 🗼 Tour de Hanoï

## Fiche Activité

### Informations Générales

| Champ | Valeur |
|-------|--------|
| **Nom du jeu** | Tour de Hanoï |
| **Tranche d'âge** | 6-10 ans (adaptable) |
| **Durée session** | 5-15 minutes |
| **Type de raisonnement** | Séquentiel, récursif, planification |

### Objectif Pédagogique

Développer la **planification stratégique** et la **pensée récursive**. L'enfant apprend à anticiper plusieurs coups à l'avance et à décomposer un problème complexe en sous-problèmes simples.

### Méthode Enseignée

> **"Pour déplacer N disques, je dois d'abord libérer le plus grand"**

Le processus de réflexion explicité :
1. **Observer** : Identifier le plus grand disque à déplacer
2. **Planifier** : Comprendre qu'il faut d'abord dégager les petits
3. **Exécuter** : Déplacer un disque à la fois
4. **Vérifier** : S'assurer que la règle "petit sur grand" est respectée
5. **Itérer** : Répéter le processus pour le disque suivant

### Règles du Jeu

1. On ne peut déplacer qu'**un seul disque à la fois**
2. Un disque ne peut être posé que sur un **disque plus grand** ou sur un piquet vide
3. Objectif : Déplacer toute la pile du piquet de départ vers le piquet d'arrivée

---

## Déroulement UX

### Flow Écran par Écran

```
┌─────────────────────────────────────────────────────────────┐
│  ÉCRAN 1 : Introduction                                      │
│  ─────────────────────                                       │
│  • Animation mascotte présentant le défi                     │
│  • Démonstration visuelle des 2 règles                       │
│  • Bouton "C'est parti !" pour commencer                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  ÉCRAN 2 : Jeu Principal                                     │
│  ───────────────────────                                     │
│  • 3 piquets avec pile de disques à gauche                   │
│  • Zone de jeu centrale                                      │
│  • Boutons : [🏠 Accueil] [💡 Indice] [🔄 Reset]             │
│  • Compteur de mouvements (optionnel, non stressant)         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  ÉCRAN 3 : Réussite                                          │
│  ──────────────────                                          │
│  • Animation de célébration                                  │
│  • Message : "Bravo ! Tu as bien réfléchi !"                │
│  • Boutons : [🔄 Rejouer] [⬆️ Niveau suivant]                │
└─────────────────────────────────────────────────────────────┘
```

### Interactions Tactiles

| Geste | Action | Feedback |
|-------|--------|----------|
| **Tap sur disque** | Sélectionne le disque du dessus | Disque surélevé + halo |
| **Drag & Drop** | Déplace le disque vers un piquet | Ombre portée, zone cible illuminée |
| **Drop valide** | Disque se pose | Son "pop" satisfaisant |
| **Drop invalide** | Disque retourne | Tremblement léger, son doux |

---

## Éléments UI Clés

### Composants Visuels

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    [🏠]                                    [💡]  [🔄]      │
│                                                             │
│         ┌───┐                                               │
│         │   │                                               │
│       ┌─┴───┴─┐                                             │
│     ┌─┴───────┴─┐                                           │
│   ┌─┴───────────┴─┐                                         │
│   ════════════════   ════════════════   ════════════════   │
│      Piquet A           Piquet B           Piquet C        │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  🐵 "Déplace tous les disques vers la droite !"    │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Palette Spécifique

| Élément | Couleur | Code |
|---------|---------|------|
| Disque 1 (petit) | Rouge | `#E74C3C` |
| Disque 2 | Orange | `#F39C12` |
| Disque 3 | Jaune | `#F1C40F` |
| Disque 4 | Vert | `#2ECC71` |
| Disque 5 | Bleu | `#3498DB` |
| Disque 6 | Violet | `#9B59B6` |
| Piquets | Bois | `#8B4513` |
| Fond | Crème | `#FFF9F0` |

---

## Système de Feedback

### Réussite (Disque bien placé)
- ✅ Son : petit "pop" satisfaisant (< 0.5s)
- ✅ Visuel : disque s'emboîte doucement avec légère particule
- ✅ Mascotte : sourire discret

### Réussite Finale (Puzzle terminé)
- ✅ Son : mélodie joyeuse type glockenspiel (2-3s)
- ✅ Visuel : confettis modérés, mascotte qui applaudit
- ✅ Message : "Bravo, tu as réussi ! Tu as bien travaillé et réfléchi !"

### Mouvement Invalide
- ⚠️ Son : note douce (pas de buzzer agressif)
- ⚠️ Visuel : disque tremble 3x et retourne en place
- ⚠️ Pas de message d'erreur textuel

### Indice (après blocage)
- 💡 Niveau 1 : "Regarde le plus gros disque, comment le libérer ?"
- 💡 Niveau 2 : Halo sur le disque à déplacer
- 💡 Niveau 3 : Flèche montrant la destination suggérée

---

## Niveaux de Difficulté

| Niveau | Disques | Âge Cible | Mouvements Optimaux |
|--------|---------|-----------|---------------------|
| Tutoriel | 2 | 6 ans | 3 |
| Facile | 3 | 6-7 ans | 7 |
| Moyen | 4 | 7-8 ans | 15 |
| Difficile | 5 | 8-9 ans | 31 |
| Expert | 6-7 | 9-10 ans | 63-127 |

### Critères de Passage au Niveau Suivant
- Réussite du puzzle actuel
- Pas de limite de tentatives
- Proposition automatique mais optionnelle

---

## Compétences Cognitives Ciblées

| Compétence | Description | Indicateur de Progression |
|------------|-------------|---------------------------|
| **Planification** | Anticiper plusieurs coups | Moins de mouvements inutiles |
| **Mémoire de travail** | Retenir la stratégie en cours | Moins d'hésitations |
| **Inhibition** | Résister à l'impulsivité | Moins de tentatives invalides |
| **Flexibilité** | Changer de stratégie si bloqué | Utilisation des indices réduite |
| **Raisonnement récursif** | Décomposer en sous-problèmes | Résolution plus fluide |

---

## Accessibilité

- ✅ Zones tactiles : 80×80 dp pour les disques
- ✅ Contraste WCAG AA respecté
- ✅ Feedback sonore + visuel (pas de couleur seule)
- ✅ Fonctionne sans son (feedback visuel suffisant)
- ✅ Pas de timer ni pression temporelle
