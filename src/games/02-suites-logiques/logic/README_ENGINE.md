# Moteur Pedagogique Adaptatif - Suites Logiques

## Vue d'ensemble

Ce moteur genere des puzzles de suites logiques adaptes au niveau de l'enfant. Il comprend :

- **Difficulty Controller** : Selection adaptative basee sur le profil joueur
- **Sequence Engine** : Generation de puzzles avec validation qualite
- **Error Diagnostic** : Diagnostic precis des erreurs pour hints cibles
- **Hint System** : Indices Montessori-compatible (3 niveaux)
- **Quality Gates** : Anti-ambiguite pour puzzles clairs
- **Player Model** : Tracking des competences persistant

## Utilisation rapide

```typescript
import {
  generatePuzzle,
  validateAnswer,
  getHint,
  DifficultyController,
  loadPlayerModel,
  savePlayerModel,
} from './engine';

// 1. Charger le profil joueur
const player = await loadPlayerModel('default');

// 2. Creer le controleur
const controller = new DifficultyController();

// 3. Selectionner le prochain puzzle
const selection = controller.selectNextPuzzle(player);

// 4. Generer le puzzle
const puzzle = generatePuzzle({
  targetDifficulty: selection.targetDifficulty,
  family: selection.family,
  theme: 'shapes',
});

// 5. Valider une reponse
const result = validateAnswer(puzzle, userChoice, timeMs, hintsUsed);

// 6. Obtenir un hint si erreur
if (!result.isCorrect) {
  const hint = getHint(puzzle, 1, result.errorType);
  // Afficher hint.message, highlight hint.highlightIndices
}

// 7. Mettre a jour et sauvegarder le profil
const updatedPlayer = controller.updateModel(player, result);
await savePlayerModel(updatedPlayer);
```

## Architecture

```
engine/
├── types.ts              # Types centraux (LogicFamily, ErrorType, etc.)
├── playerModel.ts        # Modele joueur + persistance AsyncStorage
├── difficultyController.ts # Selection adaptative
├── sequenceEngine.ts     # Generation + validation
├── errorDiagnostic.ts    # Diagnostic des erreurs
├── hintSystem.ts         # Generation de hints
├── qualityGates.ts       # Validation anti-ambiguite
└── index.ts              # Exports publics
```

## Familles logiques

| Famille | Patterns | Niveaux |
|---------|----------|---------|
| `alternation` | ABAB, AABB, ABC, AAB... | 1-5 |
| `numeric_linear` | +1, +2, +3, +5, +10 | 4-10 |
| `numeric_mult` | ×2, ×3 | 7-10 |
| `numeric_power` | carres, Fibonacci, premiers | 8-10 |
| `mirror` | ABA, ABCBA, ABCDCBA | 6-8 |
| `transform` | size, rotation | 3-8 |
| `nested` | patterns imbriques | 7-10 |

## Ajouter un nouveau pattern

1. Dans `data/patterns.ts`, ajouter la definition :

```typescript
{
  type: 'mon_nouveau_pattern',
  cycle: [0, 1, 2],
  transform: 'none',
  difficulty: 5
}
```

2. Dans `engine/types.ts`, ajouter le mapping vers une famille :

```typescript
PATTERN_TO_FAMILY = {
  // ...
  mon_nouveau_pattern: 'alternation', // ou autre famille
}
```

3. Si transform specifique, ajouter la logique dans `utils/patternUtils.ts`.

## Configuration

```typescript
const config: Partial<EngineConfig> = {
  rollingWindowSize: 10,           // Fenetre pour stats glissantes
  difficultyIncrement: 0.3,        // Increment si excellente perf
  difficultyDecrement: 0.5,        // Decrement si difficulte
  maxConsecutiveSameFamily: 2,     // Rotation forcee apres N
  reinforcementProbability: 0.7,   // Proba de choisir famille faible
  minQualityScore: 60,             // Score minimum pour puzzle valide
  maxGenerationRetries: 5,         // Tentatives avant fallback
};

const controller = new DifficultyController(config);
```

## Types d'erreurs diagnostiquees

| Erreur | Description | Dimension |
|--------|-------------|-----------|
| `off_by_one` | +/- 1 de la reponse | number |
| `wrong_step` | Mauvais pas | number |
| `used_previous` | Element precedent | number |
| `confusion_add_mult` | Confusion +/× | number |
| `wrong_color` | Bonne forme, mauvaise couleur | color |
| `wrong_shape` | Bonne couleur, mauvaise forme | shape |
| `wrong_size` | Mauvaise taille | size |
| `wrong_rotation` | Mauvaise rotation | rotation |
| `mirror_confusion` | Erreur de symetrie | pattern |
| `cycle_shift` | Decalage de cycle | pattern |

## Hints Montessori

3 niveaux progressifs :

1. **Question** : "Qu'est-ce qui se repete ?" (faire reflechir)
2. **Highlight** : Mettre en evidence la dimension pertinente
3. **Rule** : Montrer la transformation sur 2 elements

Les hints sont adaptes au type d'erreur detecte.

## Quality Gates

Le moteur valide chaque puzzle :

- Distance distracteurs (ni trop proches, ni trop loin)
- Unicite des valeurs
- Non-ambiguite numerique (pas 2 regles possibles)
- Nombre suffisant de distracteurs

Score < 60 → regeneration automatique avec fallback sur pattern "safe".

## Compatibilite

La fonction `puzzleToSequence()` convertit vers l'ancienne structure `Sequence` pour les composants UI existants.
