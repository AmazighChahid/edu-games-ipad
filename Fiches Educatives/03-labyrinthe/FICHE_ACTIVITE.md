# 🌀 FICHE ACTIVITÉ : Labyrinthe Logique

## Informations Générales

| Champ | Valeur |
|-------|--------|
| **Nom du jeu** | Labyrinthe Logique |
| **Tranche d'âge** | 6-10 ans |
| **Durée session** | 5-20 minutes (selon complexité) |
| **Type de raisonnement** | Spatial, planification, flexibilité cognitive |
| **Mascotte** | Noisette l'Écureuil 🐿️ |

---

## Objectif Pédagogique

### Objectif Principal
Développer l'**orientation spatiale**, la **mémoire de travail** et la **flexibilité cognitive**. L'enfant apprend à planifier un chemin, mémoriser ses passages, et adapter sa stratégie face aux impasses.

### Objectifs Spécifiques par Âge

| Âge | Objectif |
|-----|----------|
| **6-7 ans** | Naviguer dans un labyrinthe simple, comprendre les concepts de chemin/impasse |
| **7-8 ans** | Planifier plusieurs étapes à l'avance, mémoriser les zones visitées |
| **8-9 ans** | Gérer des éléments interactifs (clés/portes), coordonner plusieurs objectifs |
| **9-10 ans** | Optimiser son parcours, développer des stratégies d'exploration systématique |

---

## Méthode Enseignée

> **"Explorer, mémoriser, s'adapter, persévérer"**

### Les 5 Étapes du Raisonnement Spatial

```
┌─────────────────────────────────────────────────────────────────┐
│  1. OBSERVER                                                     │
│     "À quoi ressemble ce labyrinthe ? Où est la sortie ?"       │
│     → L'enfant prend une vue d'ensemble avant de se lancer      │
├─────────────────────────────────────────────────────────────────┤
│  2. PLANIFIER                                                    │
│     "Par où vais-je commencer ? Quel chemin semble prometteur ?"│
│     → L'enfant anticipe une direction initiale                  │
├─────────────────────────────────────────────────────────────────┤
│  3. EXPLORER                                                     │
│     "J'avance et je découvre ce qu'il y a devant moi."          │
│     → L'enfant navigue activement, collecte des informations    │
├─────────────────────────────────────────────────────────────────┤
│  4. MÉMORISER                                                    │
│     "Je me souviens des chemins déjà essayés."                  │
│     → L'enfant évite de répéter les mêmes erreurs               │
├─────────────────────────────────────────────────────────────────┤
│  5. S'ADAPTER                                                    │
│     "C'est une impasse. Je reviens et j'essaie ailleurs."       │
│     → L'enfant fait preuve de flexibilité cognitive             │
└─────────────────────────────────────────────────────────────────┘
```

### Verbalisation Attendue

L'enfant doit pouvoir dire :
- **6-7 ans** : "C'est bloqué là, je retourne pour essayer l'autre chemin."
- **8-9 ans** : "J'ai déjà essayé à droite, cette fois je vais à gauche puis tout droit."
- **9-10 ans** : "Je vais d'abord chercher la clé bleue avant d'aller vers la porte."

---

## Niveaux de Difficulté

### Progression par Niveau

| Niveau | Taille | Éléments | Complexité | Âge Cible |
|--------|--------|----------|------------|-----------|
| **1-3** | 5×5 | Chemin unique, peu d'embranchements | ⭐ | 6-7 ans |
| **4-6** | 5×5 | Multiples chemins, impasses courtes | ⭐⭐ | 6-7 ans |
| **7-10** | 7×7 | Embranchements moyens | ⭐⭐ | 7-8 ans |
| **11-15** | 9×9 | Clés & portes (1 paire) | ⭐⭐⭐ | 8-9 ans |
| **16-20** | 9×9 | Multi-clés, boutons | ⭐⭐⭐⭐ | 8-9 ans |
| **21-25** | 11×11 | Gemmes optionnelles, chemins multiples | ⭐⭐⭐⭐ | 9-10 ans |
| **26-30** | 13×13 | Puzzles complexes, timer optionnel | ⭐⭐⭐⭐⭐ | 10+ ans |

### Éléments Interactifs

| Élément | Icône | Fonction | Logique Requise |
|---------|-------|----------|-----------------|
| **Clé colorée** | 🔑 | Débloque une porte de même couleur | Trouver avant la porte |
| **Porte colorée** | 🚪 | Bloque le passage jusqu'à avoir la clé | Association couleur |
| **Bouton/Levier** | 🔘 | Active/désactive un pont ou mur | Cause-effet, mémoire |
| **Pont rétractable** | 🌉 | Chemin temporaire après bouton | Timing, séquençage |
| **Gemme** | 💎 | Objet bonus optionnel | Exploration, optimisation |
| **Téléporteur** | 🌀 | Transport vers une autre zone | Représentation mentale |
| **Interrupteur** | 💡 | Éclaire une zone sombre | Planification |

---

## Déroulement UX

### Flow Complet

```
┌─────────────────────────────────────────────────────────────────┐
│  ÉCRAN 0 : Carte du Monde                                        │
│                                                                  │
│     ┌──────────────────────────────────────────┐                │
│     │    🌲1   🌲2   🌲3   🔒4   🔒5          │                │
│     │      ╲     │     ╱                       │                │
│     │       ╲    │    ╱                        │                │
│     │    🏛️6 ── 🏛️7 ── 🔒8   🔒9   🔒10     │                │
│     │                                          │                │
│     │    Thème: Forêt Enchantée               │                │
│     └──────────────────────────────────────────┘                │
│                                                                  │
│     🐿️ "Choisis un labyrinthe !"                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  ÉCRAN 1 : Introduction du Niveau                                │
│                                                                  │
│          ┌─────────────────────────────┐                        │
│          │  "Ce labyrinthe a une       │                        │
│    🐿️ ── │   clé cachée. Trouve-la    │                        │
│          │   avant la porte !"         │                        │
│          └─────────────────────────────┘                        │
│                                                                  │
│     [Aperçu miniature du labyrinthe]                            │
│                                                                  │
│     [🎮 C'est parti !]                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  ÉCRAN 2 : Jeu Principal                                         │
│                                                                  │
│  [🏠]   [🗺️ Mini-carte]                 Niveau 7  🌲           │
│                                                                  │
│  ┌───────────────────────────────────────────────────┐          │
│  │  ████████████████████████████████████████████████ │          │
│  │  █           █           █                    ⭐ █ │          │
│  │  █  ██████   █   █████   ████████████████   ███ █ │          │
│  │  █       █   █       █                  █       █ │          │
│  │  █████   █   █████   ████████   █████   █   █████ │          │
│  │  █       █       █          █       █   █       █ │          │
│  │  █   █████████   ██████████████   █████████   █ █ │          │
│  │  █   █       █                █           █   █ █ │          │
│  │  █   █   █   ██████████████   █████████   █   █ █ │          │
│  │  █       █                                    █ █ │          │
│  │  █████████████████████████████████████████████ █ █ │          │
│  │  🧒                                              █ │          │
│  │  ████████████████████████████████████████████████ │          │
│  └───────────────────────────────────────────────────┘          │
│                                                                  │
│  Inventaire: [ ]  [ ]  [ ]          [💡 Indice]                 │
│                                                                  │
│  ┌────────────────────────────────────────────────────┐         │
│  │  🐿️ "Glisse ton doigt pour me déplacer !"         │         │
│  └────────────────────────────────────────────────────┘         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  IMPASSE         │  │  CLEF TROUVÉE   │  │  VICTOIRE        │
│                  │  │                  │  │                  │
│  Avatar secoue   │  │  Animation clé   │  │  🎉 Confettis    │
│  la tête         │  │  → inventaire    │  │  Avatar danse    │
│                  │  │                  │  │                  │
│  "Oups, c'est    │  │  "Super ! Cette  │  │  "Bravo ! Tu as  │
│   bloqué ici !"  │  │   clé va servir!"|  │   trouvé !"      │
└─────────────────┘  └─────────────────┘  └─────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  ÉCRAN 3 : Récapitulatif                                         │
│                                                                  │
│                      ⭐⭐⭐                                      │
│                                                                  │
│     ┌──────────────────────────────────────┐                    │
│     │  Temps : 2 min 34 s                   │                    │
│     │  Chemins explorés : 67%               │                    │
│     │  Retours en arrière : 4               │                    │
│     │  Gemmes trouvées : 2/3 💎💎⚫        │                    │
│     └──────────────────────────────────────┘                    │
│                                                                  │
│     🐿️ "Tu as bien persévéré ! Le prochain                     │
│          labyrinthe est débloqué !"                              │
│                                                                  │
│  [🏠 Carte]  [🔄 Rejouer]  [➡️ Suivant]                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### États du Jeu

| État | Description | Transitions Possibles |
|------|-------------|----------------------|
| `IDLE` | Avatar immobile, en attente | → MOVING |
| `MOVING` | Avatar en déplacement | → IDLE, BLOCKED, INTERACTING |
| `BLOCKED` | Face à un mur/impasse | → IDLE |
| `INTERACTING` | Collecte clé, bouton, etc. | → IDLE |
| `DOOR_LOCKED` | Devant porte sans clé | → IDLE |
| `DOOR_OPENING` | Porte qui s'ouvre | → IDLE |
| `VICTORY` | Arrivée à la sortie | → SUMMARY |
| `PAUSED` | Jeu en pause | → IDLE, EXIT |

---

## Modes de Contrôle

### Mode 1 : Pas à Pas (6-7 ans)

```
┌─────────────────────────────────────────────────────────────────┐
│  CONTRÔLE PAS À PAS                                              │
│                                                                  │
│  • Swipe dans une direction = déplace de 1 case                 │
│  • L'avatar s'arrête automatiquement aux intersections          │
│  • Temps de réflexion entre chaque mouvement                    │
│  • Idéal pour les débutants                                     │
│                                                                  │
│  Gestes :                                                        │
│     ↑ Swipe haut = monte                                        │
│     ↓ Swipe bas = descend                                       │
│     ← Swipe gauche = va à gauche                                │
│     → Swipe droite = va à droite                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Mode 2 : Tracé Libre (8-10 ans)

```
┌─────────────────────────────────────────────────────────────────┐
│  CONTRÔLE TRACÉ LIBRE                                            │
│                                                                  │
│  • Le doigt dessine le chemin sur l'écran                       │
│  • L'avatar suit le tracé en temps réel                         │
│  • Plus fluide et rapide                                        │
│  • Nécessite une bonne anticipation                             │
│                                                                  │
│  Gestes :                                                        │
│     👆 Appuyer sur l'avatar                                      │
│     ✋ Glisser sans lever le doigt                               │
│     🎯 Le chemin se trace derrière                              │
│     ✋ Lever le doigt = arrêt                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Mode 3 : Boutons Directionnels (Option accessibilité)

```
┌─────────────────────────────────────────────────────────────────┐
│  CONTRÔLE PAR BOUTONS                                            │
│                                                                  │
│                    ┌───┐                                        │
│                    │ ↑ │                                        │
│                    └───┘                                        │
│              ┌───┐ ┌───┐ ┌───┐                                  │
│              │ ← │ │ ○ │ │ → │                                  │
│              └───┘ └───┘ └───┘                                  │
│                    ┌───┐                                        │
│                    │ ↓ │                                        │
│                    └───┘                                        │
│                                                                  │
│  • Boutons de 80×80 dp minimum                                  │
│  • Maintenir = déplacement continu                              │
│  • Tap = déplacement d'une case                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Éléments UI Clés

### Grille du Labyrinthe

```
┌─────────────────────────────────────────────────────────────────┐
│  MAZE GRID                                                       │
│                                                                  │
│  • Cellules : 60-80 dp selon taille de grille                   │
│  • Murs : Épais (8-12 dp), couleur sombre avec texture          │
│  • Chemins : Couleur claire, légèrement texturés                │
│  • Contraste mur/chemin : ratio 4:1 minimum                     │
│  • Bordures arrondies pour aspect doux                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Avatar

```
┌─────────────────────────────────────────────────────────────────┐
│  AVATAR                                                          │
│                                                                  │
│  • Taille : 48-64 dp (visible mais ne bloque pas la vue)        │
│  • Animation idle : Léger balancement                           │
│  • Animation marche : Cycle de marche fluide                    │
│  • Animation impasse : Secoue la tête                           │
│  • Animation victoire : Saut de joie                            │
│  • Personnalisable : Couleur, accessoires                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Fil d'Ariane (Path Trail)

```
┌─────────────────────────────────────────────────────────────────┐
│  PATH TRAIL                                                      │
│                                                                  │
│  • Trace les cases visitées                                     │
│  • Couleur : Primary (#5B8DEE) avec opacité 30%                 │
│  • S'estompe progressivement (dernières 20 cases plus vives)    │
│  • Option : Afficher/masquer via toggle                         │
│  • Aide à ne pas refaire les mêmes erreurs                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Mini-carte

```
┌─────────────────────────────────────────────────────────────────┐
│  MINI-MAP                                                        │
│                                                                  │
│  • Position : Coin supérieur droit                              │
│  • Taille : 100×100 dp                                          │
│  • Affiche : Zones visitées seulement (fog of war)              │
│  • Avatar : Point clignotant                                    │
│  • Sortie : Étoile dorée                                        │
│  • Toggle : Peut être masquée                                   │
│  • Disponibilité : Niveaux 7+ (optionnel avant)                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Inventaire

```
┌─────────────────────────────────────────────────────────────────┐
│  INVENTAIRE                                                      │
│                                                                  │
│  ┌────┐  ┌────┐  ┌────┐                                        │
│  │ 🔑 │  │ 💎 │  │    │   ← 3 emplacements visibles            │
│  │bleu│  │    │  │    │                                        │
│  └────┘  └────┘  └────┘                                        │
│                                                                  │
│  • Position : Bas de l'écran                                    │
│  • Animation d'ajout : L'objet "vole" vers l'inventaire         │
│  • Animation d'utilisation : L'objet sort vers la porte         │
│  • Taille slots : 64×64 dp                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Système de Feedback

### Navigation Normale

| Action | Feedback Visuel | Feedback Sonore | Feedback Haptique |
|--------|-----------------|-----------------|-------------------|
| Déplacement | Avatar glisse fluidement | Pas légers | Aucun |
| Changement direction | Rotation de l'avatar | Aucun | Aucun |
| Case visitée | Trace légère au sol | Aucun | Aucun |

### Impasse

1. **Immédiat (0-100ms)**
   - L'avatar s'arrête net
   - Léger rebond contre le mur
   - Haptic : notification douce

2. **Feedback (100-500ms)**
   - L'avatar secoue la tête
   - Expression triste/étonnée
   - Son : petit "bump" doux

3. **Encouragement**
   - Message de Noisette : "Oups ! Essaie un autre chemin."
   - Le chemin bloqué s'assombrit légèrement

### Collecte d'Objet

| Objet | Animation | Son | Message |
|-------|-----------|-----|---------|
| **Clé** | Tourne et vole vers inventaire | "Cling" cristallin | "Une clé [couleur] !" |
| **Gemme** | Scintille, zoom vers inventaire | "Bling" magique | "💎 Bonus !" |
| **Bouton activé** | Enfoncé, onde visuelle | "Click" mécanique | "Quelque chose s'est ouvert..." |

### Ouverture de Porte

1. **Sans clé**
   - Porte vibre/tremble
   - Son : "locked" métallique
   - Message : "Il faut une clé [couleur]..."

2. **Avec clé**
   - Clé sort de l'inventaire
   - Animation d'insertion/rotation
   - Porte s'ouvre avec éclat de lumière
   - Son : "unlock" satisfaisant

### Victoire

1. **Arrivée (0-500ms)**
   - Avatar traverse le seuil
   - Flash de lumière dorée
   - Haptic : succès

2. **Célébration (500-2000ms)**
   - Confettis
   - Avatar fait un saut de joie
   - Noisette apparaît et applaudit
   - Fanfare joyeuse

3. **Récapitulatif**
   - Statistiques animées
   - Étoiles gagnées
   - Niveau suivant débloqué

---

## Indices Progressifs

| Niveau | Déclencheur | Indice | Implémentation |
|--------|-------------|--------|----------------|
| 1 | 3 min ou 10 retours | **Verbal** | "Tu tournes en rond... Essaie un chemin pas encore visité." |
| 2 | +2 min ou demande | **Dézoom** | La vue s'élargit pour montrer plus du labyrinthe |
| 3 | +2 min ou demande | **Direction** | Flèche subtile indiquant la direction générale |
| 4 | +2 min ou demande | **Chemin partiel** | Les 3 prochaines cases du bon chemin brillent |
| 5 | Demande seulement | **Solution complète** | Tout le chemin s'illumine brièvement |

---

## Thèmes Visuels

### Thème 1 : Forêt Enchantée 🌲

| Élément | Style |
|---------|-------|
| **Murs** | Haies touffues, arbres |
| **Chemin** | Terre battue, feuilles mortes |
| **Ambiance** | Lumière tamisée, particules de pollen |
| **Sons** | Oiseaux, bruissement de feuilles |
| **Départ** | Clairière avec champignons |
| **Arrivée** | Cascade lumineuse |

### Thème 2 : Temple Ancien 🏛️

| Élément | Style |
|---------|-------|
| **Murs** | Pierres anciennes, lierre |
| **Chemin** | Dalles usées |
| **Ambiance** | Torches vacillantes, poussière |
| **Sons** | Échos, craquements |
| **Départ** | Entrée du temple |
| **Arrivée** | Chambre au trésor |

### Thème 3 : Station Spatiale 🚀

| Élément | Style |
|---------|-------|
| **Murs** | Panneaux métalliques, néons |
| **Chemin** | Sol lumineux high-tech |
| **Ambiance** | Éclairage bleuté, hologrammes |
| **Sons** | Bips électroniques, portes coulissantes |
| **Départ** | Sas d'entrée |
| **Arrivée** | Pont de commandement |

### Thème 4 : Château de Glace ❄️

| Élément | Style |
|---------|-------|
| **Murs** | Murs de glace transparents |
| **Chemin** | Neige scintillante |
| **Ambiance** | Reflets arc-en-ciel, flocons |
| **Sons** | Cristaux, vent doux |
| **Départ** | Grotte de glace |
| **Arrivée** | Salle du trône |

### Thème 5 : Jardin Secret 🌸

| Élément | Style |
|---------|-------|
| **Murs** | Haies fleuries, treillis |
| **Chemin** | Allée de graviers |
| **Ambiance** | Papillons, abeilles |
| **Sons** | Fontaines, gazouillis |
| **Départ** | Petit portail |
| **Arrivée** | Kiosque romantique |

---

## Critères de Progression

### Passage au Niveau Supérieur

| Condition | Seuil |
|-----------|-------|
| Niveau actuel complété | Oui |
| Temps (optionnel) | < Temps max pour bonus étoile |
| Gemmes (optionnel) | 2/3 pour bonus |

### Étoiles par Niveau

| Étoiles | Critères |
|---------|----------|
| ⭐ | Niveau complété |
| ⭐⭐ | Complété + < 2× temps optimal |
| ⭐⭐⭐ | Complété + < 1.5× temps optimal + toutes gemmes |

### Déblocage des Thèmes

| Thème | Condition de Déblocage |
|-------|------------------------|
| Forêt Enchantée | Disponible dès le départ |
| Temple Ancien | Niveau 10 atteint |
| Station Spatiale | Niveau 15 atteint |
| Château de Glace | Niveau 20 atteint |
| Jardin Secret | 50 étoiles cumulées |

---

## Accessibilité

### Adaptations Visuelles

- **Daltonisme** : Clés/portes avec icônes distinctives (🔑⬛, 🔑⬜, 🔑⬢)
- **Contraste** : Mode haut contraste (murs noirs, chemins blancs)
- **Taille** : Zoom disponible (jusqu'à 150%)
- **Repères** : Flèches directionnelles optionnelles

### Adaptations Motrices

- **Boutons** : Mode boutons directionnels (pas de swipe)
- **Vitesse** : Vitesse de déplacement ajustable
- **Pause** : Pause facile d'accès

### Adaptations Cognitives

- **Mini-carte** : Toujours visible (option)
- **Fil d'Ariane** : Permanent et épais
- **Timer** : Désactivé par défaut
- **Indices** : Plus fréquents sur demande

---

## Métriques Collectées

### Pour l'Espace Parent

| Métrique | Description | Visualisation |
|----------|-------------|---------------|
| **Taux de complétion** | % de labyrinthes finis | Pourcentage |
| **Temps moyen** | Par niveau de difficulté | Graphique courbe |
| **Exploration** | % du labyrinthe visité | Heatmap |
| **Retours arrière** | Nombre de demi-tours | Tendance (↓ = progrès) |
| **Usage indices** | Fréquence | Tendance (↓ = progrès) |
| **Niveau max** | Plus haut niveau atteint | Nombre |

### Interprétation

| Pattern | Signification | Recommandation |
|---------|---------------|----------------|
| Complétion élevée + temps long | Persévérant mais hésitant | Encourager la planification |
| Beaucoup de retours | Mémorisation en cours | Normal au début, surveiller |
| Faible exploration | Va droit au but | Proposer des défis bonus |
| Indices fréquents | Manque de confiance | Valoriser les réussites |

---

*Fiche Activité Labyrinthe Logique | Application Éducative Montessori iPad*
