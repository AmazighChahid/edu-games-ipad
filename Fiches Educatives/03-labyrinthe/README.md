# 🌀 Labyrinthe Logique - Documentation Complète

## Fiche Activité

### Informations Générales

| Champ | Valeur |
|-------|--------|
| **Nom du jeu** | Labyrinthe Logique |
| **Tranche d'âge** | 6-10 ans |
| **Durée session** | 5-20 minutes |
| **Type de raisonnement** | Spatial, planification, flexibilité |

### Objectif Pédagogique

Développer l'**orientation spatiale**, la **mémoire de travail** et la **flexibilité cognitive**. L'enfant apprend à planifier un chemin, mémoriser ses passages, et changer de stratégie quand bloqué.

### Méthode Enseignée

> **"Explorer, mémoriser, s'adapter, persévérer"**

1. **Observer** : Examiner la structure globale du labyrinthe
2. **Planifier** : Anticiper un chemin possible
3. **Mémoriser** : Se souvenir des chemins déjà essayés
4. **S'adapter** : Changer de direction face à une impasse
5. **Persévérer** : Continuer malgré les erreurs

---

## Déroulement UX

### Flow Écran par Écran

```
┌─────────────────────────────────────────────────────────────┐
│  ÉCRAN 1 : Sélection Labyrinthe                             │
│  • Carte avec niveaux débloqués                             │
│  • Thèmes : Forêt, Temple, Espace...                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  ÉCRAN 2 : Jeu Principal                                     │
│  ┌─────────────────────────────────────┐                    │
│  │  ███████████████████████████████   │  [🏠] [💡] [🗺️]  │
│  │  █     █     █               █ ⭐  │                    │
│  │  █  █  █  █  █  █████████  █  ███  │                    │
│  │  █  █     █     █        █     █   │                    │
│  │  █  ███████  █████  ██████████ █   │                    │
│  │  █        █        █           █   │                    │
│  │  ██████████████████████████  ███   │                    │
│  │  🧒                            █   │ ← Avatar enfant    │
│  │  ███████████████████████████████   │                    │
│  └─────────────────────────────────────┘                    │
│                                                              │
│  🐿️ "Trouve la sortie ! Évite les impasses."               │
└─────────────────────────────────────────────────────────────┘
```

### Modes de Contrôle

| Mode | Description | Âge Recommandé |
|------|-------------|----------------|
| **Pas à pas** | Swipe directionnel, 1 case à la fois | 6-7 ans |
| **Tracé libre** | Dessiner le chemin au doigt | 8-10 ans |
| **Flèches** | Boutons directionnels à l'écran | Tous âges |

### Interactions

| Geste | Action | Feedback |
|-------|--------|----------|
| **Swipe** | Déplace l'avatar d'une case | Animation fluide |
| **Arrivée impasse** | Avatar s'arrête | Petit "oups" visuel |
| **Trace le chemin** | Avatar suit le doigt | Fil d'Ariane derrière |
| **Touche la sortie** | Victoire ! | Animation célébration |

---

## Niveaux de Difficulté

| Niveau | Taille | Éléments | Âge Cible |
|--------|--------|----------|-----------|
| 1-5 | 5×5 | Chemin simple | 6-7 ans |
| 6-10 | 7×7 | Quelques embranchements | 7-8 ans |
| 11-15 | 9×9 | Clés & portes | 8-9 ans |
| 16-20 | 11×11 | Multi-objectifs | 9-10 ans |
| 21+ | 13×13+ | Timer optionnel | 10+ ans |

### Éléments Interactifs

| Élément | Fonction | Logique Requise |
|---------|----------|-----------------|
| 🔑 Clé colorée | Débloque une porte | Trouver avant la porte |
| 🚪 Porte colorée | Bloque le passage | Avoir la clé correspondante |
| 🔘 Bouton | Active un pont | Cause-effet |
| 💎 Gemme | Objet bonus à collecter | Exploration optionnelle |

---

## Système de Feedback

### Progression
- ✅ **Fil d'Ariane** : Trace colorée montrant le chemin parcouru
- ✅ **Mini-carte** (optionnelle) : Révèle progressivement les zones visitées

### Impasse
- ⚠️ Avatar secoue la tête doucement
- ⚠️ Mascotte : "Hmm, c'est fermé ici. Essayons ailleurs !"
- ⚠️ Pas de pénalité, retour libre

### Victoire
- 🎉 Animation de sortie triomphale
- 🎉 Récapitulatif : "Tu as exploré X% du labyrinthe"
- 🎉 Message valorisant la persévérance

---

## Fiche Parent

### Compétences Développées

| Compétence | Description | Application Réelle |
|------------|-------------|-------------------|
| **Orientation spatiale** | Se repérer dans l'espace | Lire une carte, s'orienter |
| **Mémoire de travail** | Retenir le chemin | Suivre des instructions |
| **Flexibilité cognitive** | Changer de stratégie | Résolution de problèmes |
| **Inhibition** | Ne pas retourner inutilement | Patience, réflexion |
| **Planification** | Anticiper le chemin | Organiser ses actions |

### Conseils d'Accompagnement

✅ **À faire** :
- "Par où veux-tu essayer d'abord ?"
- "Tu te souviens être passé par là ?"
- "Si c'est bloqué, que peux-tu essayer ?"

❌ **À éviter** :
- Pointer le bon chemin
- S'impatienter quand il tourne en rond
- Prendre la tablette pour "montrer"

### Transfert Vie Quotidienne

- Jeux de parcours réels (chasse au trésor)
- Lecture de plans simples
- Orientation dans un bâtiment nouveau
- Labyrinthes papier

---

## Spécifications Techniques

### Structure Composants

```
/src/components/activities/Labyrinthe/
├── LabyrintheGame.tsx
├── components/
│   ├── MazeGrid.tsx           # Grille du labyrinthe
│   ├── Avatar.tsx             # Personnage animé
│   ├── MazeCell.tsx           # Cellule (mur/chemin)
│   ├── InteractiveElement.tsx # Clé, porte, bouton
│   ├── MiniMap.tsx            # Mini-carte optionnelle
│   └── PathTrail.tsx          # Fil d'Ariane
├── hooks/
│   ├── useMazeGame.ts         # Logique de jeu
│   ├── useMazeGeneration.ts   # Génération procédurale
│   └── usePathfinding.ts      # Validation chemin
└── data/
    └── mazeThemes.ts          # Assets par thème
```

### Types Principaux

```typescript
interface MazeCell {
  x: number;
  y: number;
  type: 'wall' | 'path' | 'start' | 'end';
  visited: boolean;
  interactive?: InteractiveElement;
}

interface InteractiveElement {
  type: 'key' | 'door' | 'button' | 'gem';
  color?: string;
  linkedTo?: { x: number; y: number };
  collected?: boolean;
}

interface MazeState {
  grid: MazeCell[][];
  avatarPosition: { x: number; y: number };
  inventory: InteractiveElement[];
  pathHistory: { x: number; y: number }[];
  startTime: Date;
  hintsUsed: number;
  isComplete: boolean;
}

interface MazeConfig {
  width: number;
  height: number;
  difficulty: number;
  hasKeys: boolean;
  hasButtons: boolean;
  hasGems: boolean;
  showMiniMap: boolean;
}
```

### Génération Procédurale

```typescript
function generateMaze(config: MazeConfig): MazeCell[][] {
  // Algorithme de génération (Recursive Backtracking)
  const grid = initializeGrid(config.width, config.height);
  
  // Creuser les chemins
  recursiveBacktrack(grid, 0, 0);
  
  // Définir départ et arrivée
  grid[0][0].type = 'start';
  grid[config.height - 1][config.width - 1].type = 'end';
  
  // Ajouter éléments interactifs selon difficulté
  if (config.hasKeys) {
    addKeysAndDoors(grid, config.difficulty);
  }
  
  // Valider qu'un chemin existe
  if (!pathExists(grid)) {
    return generateMaze(config); // Regénérer
  }
  
  return grid;
}

function recursiveBacktrack(grid: MazeCell[][], x: number, y: number): void {
  grid[y][x].visited = true;
  
  const directions = shuffle(['up', 'down', 'left', 'right']);
  
  for (const dir of directions) {
    const [nx, ny] = getNeighbor(x, y, dir);
    
    if (isValid(nx, ny, grid) && !grid[ny][nx].visited) {
      removeWall(grid, x, y, nx, ny);
      recursiveBacktrack(grid, nx, ny);
    }
  }
}
```

---

## Dialogues IA (Mascotte : Noisette l'Écureuil 🐿️)

### Introduction
> "Coucou ! Je suis Noisette ! 🐿️
> J'ai perdu mes noisettes dans ce labyrinthe.
> Tu m'aides à trouver la sortie ?"

### Exploration
> "Allons-y ! Glisse ton doigt pour avancer."

### Impasse
> "Oh, c'est bloqué ici ! 
> Retournons sur nos pas et essayons un autre chemin."

### Clé Trouvée
> "Super, une clé ! 🔑 
> Elle ouvrira sûrement une porte quelque part..."

### Indice Niveau 1
> "Tu tournes un peu en rond...
> Regarde les chemins que tu n'as pas encore essayés."

### Indice Niveau 2
*[Dézoom révélant plus du labyrinthe]*
> "Voilà une vue plus large !
> La sortie est par là-bas ⭐"

### Victoire
> "Hourra ! On est sortis ! 🎉
> Tu as été persévérant, bravo !"

---

## Accessibilité

- ✅ **Zones tactiles larges** : Chemins de 80dp minimum
- ✅ **Contraste élevé** : Murs/chemins bien distincts
- ✅ **Audio** : Indices sonores directionnels optionnels
- ✅ **Daltonisme** : Clés/portes avec icônes distinctives (pas juste couleur)
- ✅ **Pas de timer** : Par défaut, temps illimité

---

## Métriques de Succès

| Métrique | Objectif | Interprétation |
|----------|----------|----------------|
| Taux complétion | > 85% | Difficulté bien dosée |
| Temps moyen (niveau 5×5) | 2-4 min | Engagement sans frustration |
| % chemin exploré | 50-70% | Efficacité vs exploration |
| Retours en arrière | Décroissant | Apprentissage spatial |
| Usage mini-carte | Décroissant | Gain en confiance |

---

## Thèmes Visuels

| Thème | Ambiance | Éléments |
|-------|----------|----------|
| **Forêt Enchantée** | Calme, naturel | Arbres, champignons, ruisseau |
| **Temple Ancien** | Mystère | Pierres, torches, statues |
| **Station Spatiale** | Moderne | Portes coulissantes, écrans |
| **Château de Glace** | Féerique | Cristaux, neige, lumières |
| **Jardin Secret** | Apaisant | Haies, fleurs, fontaine |

---

*Labyrinthe Logique | Application Éducative Montessori iPad*
