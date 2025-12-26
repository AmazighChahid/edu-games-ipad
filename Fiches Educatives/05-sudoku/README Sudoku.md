# 🧩 Sudoku Montessori - Documentation Complète

## Fiche Activité

### Informations Générales

| Champ | Valeur |
|-------|--------|
| **Nom du jeu** | Sudoku Montessori |
| **Tranche d'âge** | 6-10 ans |
| **Durée session** | 5-20 minutes |
| **Type de raisonnement** | Déductif, logique, élimination |

### Objectif Pédagogique

Développer le **raisonnement logique déductif**, la **patience** et la **concentration**. L'enfant apprend à appliquer des règles systématiquement et à procéder par élimination.

### Méthode Enseignée

> **"Un seul de chaque par ligne, colonne et région"**

1. **Observer** : Examiner ce qui est déjà placé
2. **Déduire** : Éliminer les impossibilités
3. **Vérifier** : S'assurer qu'aucune règle n'est violée
4. **Placer** : Poser l'élément certain
5. **Itérer** : Recommencer jusqu'à complétion

---

## Progression Montessori : Du Concret à l'Abstrait

### Phase 1 : Images (6-7 ans)
```
┌───┬───┬───┬───┐
│ 🍎│ 🍌│   │ 🍇│
├───┼───┼───┼───┤
│   │ 🍇│ 🍎│ 🍌│
├───┼───┼───┼───┤
│ 🍇│   │ 🍌│ 🍎│
├───┼───┼───┼───┤
│ 🍌│ 🍎│ 🍇│   │
└───┴───┴───┴───┘
  Grille 4×4 avec fruits
```

### Phase 2 : Formes Géométriques (7-8 ans)
```
┌───┬───┬───┬───┐
│ ⬛│ 🔵│   │ 🔺│
├───┼───┼───┼───┤
│   │ 🔺│ ⬛│ 🔵│
...
```

### Phase 3 : Nombres (8-10 ans)
```
┌───┬───┬───┬───┬───┬───┐
│ 1 │ 2 │   │ 4 │ 5 │ 6 │
├───┼───┼───┼───┼───┼───┤
│ 4 │   │ 6 │ 1 │ 2 │ 3 │
...
  Grille 6×6 avec chiffres
```

### Phase 4 : Sudoku Classique (9-10 ans)
Grille 9×9 avec chiffres 1-9

---

## Déroulement UX

### Flow Écran par Écran

```
┌─────────────────────────────────────────────────────────────┐
│  ÉCRAN 1 : Sélection Grille                                  │
│  • Taille : 4×4 | 6×6 | 9×9                                 │
│  • Thème : Fruits | Formes | Nombres                        │
│  • Difficulté : ★ | ★★ | ★★★                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  ÉCRAN 2 : Jeu Principal                                     │
│                                                              │
│  [🏠]                                      [💡] [✓] [🔄]    │
│                                                              │
│   ┌───┬───┬───┬───┐                                         │
│   │ 🍎│ 🍌│   │ 🍇│   ← Grille                              │
│   ├───┼───┼───┼───┤                                         │
│   │ ? │ 🍇│ 🍎│ 🍌│   ? = Case vide sélectionnée           │
│   ├───┼───┼───┼───┤                                         │
│   │ 🍇│   │ 🍌│ 🍎│                                         │
│   ├───┼───┼───┼───┤                                         │
│   │ 🍌│ 🍎│ 🍇│   │                                         │
│   └───┴───┴───┴───┘                                         │
│                                                              │
│   ┌────┬────┬────┬────┐                                     │
│   │ 🍎 │ 🍌 │ 🍇 │ 🍊 │  ← Sélecteur                       │
│   └────┴────┴────┴────┘                                     │
│                                                              │
│   🦊 "Place chaque fruit une seule fois par ligne !"       │
└─────────────────────────────────────────────────────────────┘
```

### Interactions

| Geste | Action | Feedback |
|-------|--------|----------|
| **Tap case vide** | Sélectionne la case | Case surlignée |
| **Tap symbole** | Place dans case sélectionnée | Symbole apparaît |
| **Placement valide** | Symbole reste | Petit son positif |
| **Placement invalide** | Refus | Symbole tremble, montre le conflit |
| **Double-tap case** | Ajoute annotation | Petit symbole dans le coin |
| **Tap case remplie** | Retire le symbole | Case redevient vide |

---

## Système de Validation

### Contrôle de l'Erreur (Montessori)

**Validation Immédiate** : Si l'enfant place un symbole qui viole une règle...

```
Exemple : Placer 🍎 alors qu'il y en a déjà un dans la ligne

┌───┬───┬───┬───┐
│ 🍎│ 🍌│ ❌│ 🍇│  ← Conflit affiché en rouge
├───┼───┼───┼───┤
│ ┊ │ 🍇│ 🍎│ 🍌│  ← Lien visuel montrant le doublon
└───┴───┴───┴───┘
```

- Le symbole refuse de se poser
- Le symbole en conflit pulse en rouge
- Ligne/colonne concernée brièvement surlignée
- Aucun message "Erreur" — l'enfant voit par lui-même

### Bouton Vérifier [✓]

Vérifie l'état global de la grille :
- ✅ "Tout est cohérent pour l'instant !" (si pas d'erreur)
- ⚠️ "Regarde la ligne 3..." (si erreur, sans donner la solution)

---

## Système d'Annotations

### Pour les Niveaux Avancés (8-10 ans)

L'enfant peut noter plusieurs candidats dans une case :

```
┌─────────┐
│ ₁ ₂    │  ← Candidats notés en petit
│    ₅   │
└─────────┘
```

**Geste** : Long press sur case + tap sur symboles candidats

**Bénéfice** : Structurer sa réflexion, éviter de tout retenir en tête

---

## Niveaux de Difficulté

### Grille 4×4

| Niveau | Cases pré-remplies | Âge | Techniques Requises |
|--------|-------------------|-----|---------------------|
| ★ | 10-12 / 16 | 6-7 ans | Observation simple |
| ★★ | 8-9 / 16 | 7-8 ans | Élimination basique |
| ★★★ | 6-7 / 16 | 7-8 ans | Déduction en 2 étapes |

### Grille 6×6

| Niveau | Cases pré-remplies | Âge | Techniques Requises |
|--------|-------------------|-----|---------------------|
| ★ | 20-24 / 36 | 8 ans | Observation méthodique |
| ★★ | 16-19 / 36 | 8-9 ans | Élimination systématique |
| ★★★ | 12-15 / 36 | 9 ans | Paires cachées |

### Grille 9×9

| Niveau | Cases pré-remplies | Âge | Techniques Requises |
|--------|-------------------|-----|---------------------|
| ★ | 40-50 / 81 | 9-10 ans | Toutes techniques de base |
| ★★ | 30-39 / 81 | 10 ans | Techniques intermédiaires |
| ★★★ | 25-29 / 81 | 10+ ans | Techniques avancées |

---

## Thèmes Visuels

| Thème | Symboles | Attractivité |
|-------|----------|--------------|
| **Fruits** | 🍎🍌🍇🍊 | 6-7 ans |
| **Animaux** | 🐶🐱🐰🐻 | 6-7 ans |
| **Formes** | ⬛🔵🔺⭐ | 7-8 ans |
| **Couleurs** | 🔴🔵🟢🟡 | Tous |
| **Nombres** | 1 2 3 4 | 8+ ans |

---

## Fiche Parent

### Compétences Développées

| Compétence | Description | Application |
|------------|-------------|-------------|
| **Logique déductive** | Éliminer les impossibilités | Résolution de problèmes |
| **Concentration** | Maintenir l'attention prolongée | Travail scolaire |
| **Patience** | Procéder méthodiquement | Persévérance |
| **Mémoire de travail** | Retenir les contraintes | Calcul mental |
| **Systématisme** | Appliquer des règles | Méthode de travail |

### Base Scientifique

> "Le Sudoku améliore les capacités de raisonnement logique et la durée d'attention chez les enfants."
> — Études en sciences cognitives

### Conseils d'Accompagnement

✅ **À faire** :
- "Qu'est-ce qui manque dans cette ligne ?"
- "Peux-tu éliminer des possibilités ?"
- "Prends ton temps, réfléchis bien"
- Encourager les annotations (écrire les candidats)

❌ **À éviter** :
- Donner les réponses
- Montrer où placer
- Mettre la pression du temps
- Comparer avec d'autres enfants

### Transfert Vie Quotidienne

- Puzzles et jeux de logique
- Jeux de déduction (Mastermind, Qui est-ce?)
- Raisonnement par élimination dans la vie courante

---

## Spécifications Techniques

### Structure Composants

```
/src/components/activities/Sudoku/
├── SudokuGame.tsx
├── components/
│   ├── SudokuGrid.tsx         # Grille principale
│   ├── SudokuCell.tsx         # Cellule individuelle
│   ├── SymbolSelector.tsx     # Sélecteur de symboles
│   ├── AnnotationLayer.tsx    # Couche annotations
│   └── ConflictHighlight.tsx  # Affichage conflits
├── hooks/
│   ├── useSudokuGame.ts       # Logique de jeu
│   ├── useSudokuGenerator.ts  # Génération de grilles
│   └── useSudokuSolver.ts     # Solveur pour indices
└── data/
    └── grids/                 # Grilles pré-générées
```

### Types Principaux

```typescript
interface SudokuCell {
  row: number;
  col: number;
  value: string | number | null;
  isFixed: boolean;           // Pré-remplie
  annotations: (string | number)[];
  hasConflict: boolean;
}

interface SudokuGrid {
  size: 4 | 6 | 9;
  cells: SudokuCell[][];
  theme: 'fruits' | 'shapes' | 'numbers' | 'animals';
  symbols: (string | number)[];
}

interface SudokuState {
  grid: SudokuGrid;
  selectedCell: { row: number; col: number } | null;
  history: SudokuGrid[];      // Pour Undo
  hintsUsed: number;
  startTime: Date;
  isComplete: boolean;
}

interface SudokuConfig {
  size: 4 | 6 | 9;
  difficulty: 1 | 2 | 3;
  theme: string;
  showConflicts: boolean;     // Validation immédiate
  allowAnnotations: boolean;
}
```

### Validation des Règles

```typescript
function validatePlacement(
  grid: SudokuGrid,
  row: number,
  col: number,
  value: string | number
): ValidationResult {
  const conflicts: Conflict[] = [];
  
  // Vérifier la ligne
  for (let c = 0; c < grid.size; c++) {
    if (c !== col && grid.cells[row][c].value === value) {
      conflicts.push({ type: 'row', row, col: c });
    }
  }
  
  // Vérifier la colonne
  for (let r = 0; r < grid.size; r++) {
    if (r !== row && grid.cells[r][col].value === value) {
      conflicts.push({ type: 'column', row: r, col });
    }
  }
  
  // Vérifier la région (box)
  const boxSize = Math.sqrt(grid.size);
  const boxRow = Math.floor(row / boxSize) * boxSize;
  const boxCol = Math.floor(col / boxSize) * boxSize;
  
  for (let r = boxRow; r < boxRow + boxSize; r++) {
    for (let c = boxCol; c < boxCol + boxSize; c++) {
      if ((r !== row || c !== col) && grid.cells[r][c].value === value) {
        conflicts.push({ type: 'box', row: r, col: c });
      }
    }
  }
  
  return {
    valid: conflicts.length === 0,
    conflicts,
  };
}
```

### Générateur de Grilles

```typescript
function generateSudoku(config: SudokuConfig): SudokuGrid {
  // 1. Générer une grille complète valide
  const fullGrid = generateFullGrid(config.size);
  
  // 2. Retirer des cases selon la difficulté
  const cellsToRemove = getCellsToRemove(config.size, config.difficulty);
  const puzzle = removeClues(fullGrid, cellsToRemove);
  
  // 3. Vérifier l'unicité de la solution
  if (!hasUniqueSolution(puzzle)) {
    return generateSudoku(config); // Regénérer
  }
  
  // 4. Appliquer le thème
  return applyTheme(puzzle, config.theme);
}
```

---

## Dialogues IA (Mascotte : Renard Sage 🦊)

### Introduction
> "Bonjour ! Je suis Félix le renard. 🦊
> Voici une grille magique !
> Chaque symbole doit apparaître une seule fois
> dans chaque ligne, chaque colonne, et chaque carré."

### Premier Placement
> "Touche une case vide, puis choisis un symbole.
> Je te dirai si tu peux le mettre là !"

### Placement Réussi
> "Parfait ! Ce symbole va bien ici. 👍"

### Conflit Détecté
> "Attends... Regarde, il y a déjà ce symbole dans la ligne !
> Essaie autre chose."

### Indice Niveau 1
> "Cherche une case où il ne manque qu'un seul symbole...
> C'est souvent le plus facile pour commencer."

### Indice Niveau 2
*[Une case "évidente" pulse doucement]*
> "Regarde cette case qui brille.
> Qu'est-ce qui pourrait aller là ?"

### Indice Niveau 3
*[Le symbole correct apparaît brièvement]*
> "Voici un petit coup de pouce.
> [Symbole] va dans cette case !"

### Grille Complétée
> "🎉 Fantastique ! Tu as tout rempli correctement !
> Tu as été très patient et très logique.
> Un vrai champion du Sudoku !"

---

## Accessibilité

- ✅ **Taille des cases** : 64dp minimum pour tap facile
- ✅ **Contraste** : Symboles bien visibles sur fond
- ✅ **Daltonisme** : Symboles différenciables par forme
- ✅ **Lecture** : Option voix pour annoncer les symboles
- ✅ **Dyslexie** : Option police OpenDyslexic pour les nombres

---

## Métriques de Succès

| Métrique | Objectif | Interprétation |
|----------|----------|----------------|
| Taux complétion | > 80% | Difficulté adaptée |
| Tentatives invalides | Décroissant | Apprentissage des règles |
| Temps par grille 4×4 | 3-8 min | Engagement sans frustration |
| Usage annotations | Croissant avec âge | Adoption de stratégies |
| Passage à grille supérieure | > 60% | Confiance croissante |

---

## Exemples de Grilles Prêtes à l'Emploi

### Grille 4×4 Facile (Tutoriel)
```
🍎 🍌 _  🍇
_  🍇 🍎 🍌
🍇 _  🍌 🍎
🍌 🍎 🍇 _

Solution:
🍎 🍌 🍊 🍇
🍊 🍇 🍎 🍌
🍇 🍊 🍌 🍎
🍌 🍎 🍇 🍊
```

---

*Sudoku Montessori | Application Éducative Montessori iPad*
