# 🔧 SPECS TECHNIQUES : Math Blocks

## Vue d'Ensemble

| Élément | Valeur |
|---------|--------|
| **Nom technique** | `math-blocks` |
| **Route principale** | `app/(games)/11-math-blocks/` |
| **Composants** | `src/games/11-math-blocks/` |
| **Mascotte** | Numéro le Robot |
| **État** | ✅ Disponible |

---

## Architecture des Fichiers

```
src/games/11-math-blocks/
├── index.ts                    # Export principal
├── types.ts                    # Types TypeScript
├── components/
│   ├── index.ts               # Export des composants
│   ├── MathBlock.tsx          # Bloc individuel (calcul ou résultat)
│   ├── GameGrid.tsx           # Grille de jeu
│   └── ScoreDisplay.tsx       # Affichage du score
├── hooks/
│   └── useMathGame.ts         # Hook principal du jeu
├── logic/
│   ├── mathEngine.ts          # Génération des calculs/résultats
│   ├── gridEngine.ts          # Gestion de la grille (gravité, suppression)
│   └── matchValidator.ts      # Validation des paires
├── data/
│   ├── levels.ts              # Configuration des 10 niveaux
│   └── assistantScripts.ts    # Scripts de la mascotte
└── screens/
    ├── index.ts               # Export des écrans
    ├── MathIntroScreen.tsx    # Écran d'introduction
    ├── MathPlayScreen.tsx     # Écran de jeu principal
    ├── MathVictoryScreen.tsx  # Écran de victoire
    └── MathHanoiIntroScreen.tsx # Intro alternative

app/(games)/11-math-blocks/
├── _layout.tsx                # Layout Expo Router
├── index.tsx                  # Page d'accueil du jeu
├── play.tsx                   # Page de jeu
└── victory.tsx                # Page de victoire
```

---

## Types TypeScript

### types.ts

```typescript
// Opérations mathématiques supportées
type MathOperation = 'add' | 'subtract' | 'multiply' | 'divide';

// Structure d'un bloc (calcul ou résultat)
interface MathBlock {
  id: string;
  type: 'operation' | 'result';   // Calcul ou résultat
  value: number;                   // Valeur numérique
  display: string;                 // Affichage ("4+1" ou "5")
  operation?: MathOperation;       // Type d'opération si calcul
  operands?: [number, number];     // Opérandes si calcul
  row: number;                     // Position ligne
  col: number;                     // Position colonne
  isSelected: boolean;             // Sélectionné actuellement
  isMatched: boolean;              // Déjà apparié
}

// Grille 2D de blocs
type GameGrid = (MathBlock | null)[][];

// État complet du jeu
interface MathGameState {
  grid: GameGrid;
  selectedBlock: MathBlock | null;
  score: number;
  combo: number;                   // Combos consécutifs
  matchesFound: number;
  totalPairs: number;
  timeRemaining: number;           // Secondes restantes
  isPlaying: boolean;
}

// Configuration d'un niveau
interface MathLevelConfig extends LevelConfig {
  gridRows: number;                // Nombre de lignes
  gridCols: number;                // Nombre de colonnes
  operations: MathOperation[];     // Opérations autorisées
  numberRange: [number, number];   // Plage de nombres [min, max]
  timeLimit: number;               // Limite en secondes (0 = illimité)
  targetPairs: number;             // Paires à trouver pour gagner
}

// Symboles d'opération pour l'affichage
const OPERATION_SYMBOLS: Record<MathOperation, string> = {
  add: '+',
  subtract: '-',
  multiply: 'x',
  divide: '/',
};

// Valeurs de score
const SCORE_VALUES = {
  correctMatch: 100,     // Par paire correcte
  comboBonus: 50,        // Par niveau de combo
  timeBonus: 10,         // Par seconde restante
  perfectBonus: 500,     // Aucune erreur
};
```

---

## Hook Principal : useMathGame

### Signature

```typescript
interface UseMathGameOptions {
  levelId?: string;
  onVictory?: () => void;
  onGameOver?: () => void;
}

function useMathGame(options?: UseMathGameOptions): {
  // État
  gameState: MathGameState;
  level: MathLevelConfig;
  isVictory: boolean;
  isGameOver: boolean;
  wrongAttempts: number;
  isAnimating: boolean;

  // Actions
  selectBlock: (block: MathBlock) => void;
  reset: () => void;
  pause: () => void;
  resume: () => void;
}
```

### Fonctionnalités

| Fonction | Description |
|----------|-------------|
| `selectBlock` | Sélectionne un bloc et tente l'appariement |
| `reset` | Remet le jeu à zéro |
| `pause` | Met le jeu en pause (arrête le timer) |
| `resume` | Reprend le jeu |

### Logique d'Appariement

1. Premier clic → Sélectionne le bloc
2. Deuxième clic sur le même bloc → Désélectionne
3. Deuxième clic sur un autre bloc → Tente l'appariement
4. Si paire valide → Animation explosion + gravité
5. Si paire invalide → Reset combo + feedback haptic

---

## Composants React Native

### MathBlock.tsx

Bloc individuel avec animations.

```typescript
interface MathBlockProps {
  block: MathBlock;
  size: number;
  onPress: (block: MathBlock) => void;
  targetRow?: number;              // Pour animation de gravité
  onExplosionComplete?: () => void;
}
```

**Animations :**
- Sélection : scale 1.1 avec ombre
- Match : scale up 1.3 → disparition avec explosion de particules
- Gravité : spring animation vers le bas

**Particules d'explosion :**
- 8 particules en étoile
- Couleurs alternées (primaire/doré)
- Animation de dispersion avec fade out

### GameGrid.tsx

Grille contenant tous les blocs.

```typescript
interface GameGridProps {
  grid: GameGrid;
  onBlockPress: (block: MathBlock) => void;
  isAnimating: boolean;
}
```

**Caractéristiques :**
- Layout flexible selon dimensions du niveau
- Calcul automatique de la taille des blocs
- Gestion des espaces vides (null)

### ScoreDisplay.tsx

Affichage du score et du combo.

```typescript
interface ScoreDisplayProps {
  score: number;
  combo: number;
  timeRemaining: number;
  matchesFound: number;
  targetPairs: number;
}
```

---

## Moteurs de Logique

### mathEngine.ts

Génération des calculs et résultats.

```typescript
// Crée l'état initial du jeu
function createInitialState(level: MathLevelConfig): MathGameState;

// Génère une paire calcul-résultat
function generatePair(
  operations: MathOperation[],
  range: [number, number]
): { operation: MathBlock; result: MathBlock };

// Génère un calcul aléatoire
function generateCalculation(
  operation: MathOperation,
  range: [number, number]
): { operands: [number, number]; result: number; display: string };
```

**Règles de génération :**
- Addition : a + b où a, b dans range
- Soustraction : a - b où a ≥ b (résultat positif)
- Multiplication : a × b avec tables appropriées
- Division : a ÷ b où a % b === 0 (division exacte)

### gridEngine.ts

Manipulation de la grille.

```typescript
// Marque deux blocs comme appariés
function markBlocksAsMatched(
  grid: GameGrid,
  block1: MathBlock,
  block2: MathBlock
): GameGrid;

// Supprime tous les blocs marqués
function removeAllMatchedBlocks(grid: GameGrid): GameGrid;

// Applique la gravité (blocs tombent vers le bas)
function applyGravity(grid: GameGrid): GameGrid;

// Met à jour la sélection d'un bloc
function updateBlockSelection(
  grid: GameGrid,
  blockId: string,
  selected: boolean
): GameGrid;

// Désélectionne tous les blocs
function clearAllSelections(grid: GameGrid): GameGrid;

// Vérifie si la grille est vide
function isGridEmpty(grid: GameGrid): boolean;
```

### matchValidator.ts

Validation des paires.

```typescript
interface MatchResult {
  valid: boolean;
  reason?: string;
}

// Vérifie si deux blocs forment une paire valide
function validateMatch(block1: MathBlock, block2: MathBlock): MatchResult;
```

**Règles de validation :**
- Un bloc doit être `operation`, l'autre `result`
- Les valeurs numériques doivent être égales
- Les deux blocs ne doivent pas être déjà appariés

---

## Configuration des Niveaux

### levels.ts

| Niveau | Âge | Grille | Opérations | Nombres | Temps | Paires |
|--------|-----|--------|------------|---------|-------|--------|
| 1 | 5 | 3×4 | + | 1-5 | 60s | 6 |
| 2 | 6 | 4×4 | + | 1-10 | 90s | 8 |
| 3 | 6 | 4×4 | +, - | 1-10 | 90s | 8 |
| 4 | 7 | 4×5 | +, - | 1-20 | 120s | 10 |
| 5 | 7 | 4×4 | × | 1-5 | 120s | 8 |
| 6 | 8 | 4×5 | × | 1-10 | 150s | 10 |
| 7 | 8 | 4×4 | ÷ | 1-10 | 150s | 8 |
| 8 | 9 | 5×5 | ×, ÷ | 1-10 | 180s | 12 |
| 9 | 10 | 5×5 | +, -, ×, ÷ | 1-20 | 180s | 12 |
| 10 | 11 | 5×6 | +, -, ×, ÷ | 1-50 | 240s | 15 |

---

## Animations

### Constantes de Timing

```typescript
const EXPLOSION_DURATION = 350;  // Animation d'explosion
const GRAVITY_DELAY = 100;       // Délai avant gravité
```

### Séquence d'Animation (Match Réussi)

1. **T+0ms** : Blocs marqués `isMatched: true`
2. **T+0-350ms** : Animation explosion (scale up → particules)
3. **T+350ms** : Suppression des blocs de la grille
4. **T+450ms** : Gravité appliquée (spring animation)
5. **T+750ms** : Animation terminée, prêt pour interaction

### Reanimated 3 Hooks Utilisés

- `useSharedValue` : Valeurs animées
- `useAnimatedStyle` : Styles réactifs
- `withSpring` : Animation élastique (gravité, sélection)
- `withTiming` : Animation linéaire (explosion, fade)
- `withSequence` : Séquence d'animations
- `withDelay` : Délai avant animation

---

## Gestion du Score

### Calcul du Score

```typescript
// Lors d'un match réussi
const matchScore = SCORE_VALUES.correctMatch +
                   (combo * SCORE_VALUES.comboBonus);

// À la victoire
const timeBonus = timeRemaining * SCORE_VALUES.timeBonus;
const perfectBonus = wrongAttempts === 0 ? SCORE_VALUES.perfectBonus : 0;
const finalScore = score + timeBonus + perfectBonus;
```

### Système de Combo

- Combo +1 à chaque paire correcte consécutive
- Combo reset à 0 sur erreur
- Bonus = combo × 50 points

---

## Intégration Store Zustand

### Actions Utilisées

```typescript
const {
  hapticEnabled,        // Préférence vibration
  startSession,         // Démarre une session de jeu
  incrementMoves,       // Compte les interactions
  setStatus,            // 'playing' | 'victory' | 'abandoned'
  endSession,           // Termine la session
  recordCompletion,     // Enregistre la victoire
} = useStore();
```

### Cycle de Vie Session

1. **Mount** : `startSession('math-blocks', levelId, initialState)`
2. **Match** : `incrementMoves()`
3. **Victoire** : `setStatus('victory')` → `endSession()` → `recordCompletion()`
4. **Game Over** : `setStatus('abandoned')`

---

## Feedback Haptic

### Événements

| Événement | Type Haptic |
|-----------|-------------|
| Sélection bloc | `selectionAsync()` |
| Match réussi | `notificationAsync(Success)` |
| Match échoué | `notificationAsync(Warning)` |
| Victoire | `notificationAsync(Success)` |

---

## Accessibilité

### Implémentations

- ✅ Blocs de couleurs distinctes (primaire/secondaire)
- ✅ Texte grand et lisible
- ✅ Feedback haptic optionnel
- ✅ Pas de dépendance stricte au temps (niveau 1)
- ✅ `adjustsFontSizeToFit` pour les calculs longs

### Considérations Visuelles

- Contraste texte blanc sur fond coloré
- Taille minimum des blocs calculée dynamiquement
- Animation de sélection visible (scale + ombre)

---

## Tests Recommandés

### Tests Unitaires

```typescript
// matchValidator.test.ts
describe('validateMatch', () => {
  it('should validate operation-result pair with matching values');
  it('should reject two operations');
  it('should reject two results');
  it('should reject mismatched values');
});

// mathEngine.test.ts
describe('generateCalculation', () => {
  it('should generate valid additions');
  it('should generate subtractions with positive results');
  it('should generate multiplications within range');
  it('should generate exact divisions only');
});

// gridEngine.test.ts
describe('applyGravity', () => {
  it('should move blocks down to fill empty spaces');
  it('should preserve column order');
});
```

### Tests E2E

1. Sélectionner deux blocs correspondants → disparition
2. Sélectionner deux blocs non-correspondants → reset sélection
3. Vider la grille → écran victoire
4. Timer à 0 → game over

---

## Dépendances

| Package | Utilisation |
|---------|-------------|
| `react-native-reanimated` | Animations fluides |
| `expo-haptics` | Feedback tactile |
| `zustand` | State management |
| `expo-router` | Navigation |

---

## Points d'Extension

### Nouveaux Types d'Opérations

1. Ajouter le type dans `MathOperation`
2. Ajouter le symbole dans `OPERATION_SYMBOLS`
3. Implémenter la génération dans `mathEngine.ts`

### Nouveaux Modes de Jeu

- **Mode Survie** : Grille infinie, game over sur erreur
- **Mode Duel** : 2 joueurs en split-screen
- **Mode Défi** : Atteindre un score cible

### Personnalisation Visuelle

- Thèmes de couleurs configurables
- Formes de blocs alternatives
- Effets de particules personnalisés

---

*Specs Techniques Math Blocks v1.0 | Application Éducative Montessori iPad*
