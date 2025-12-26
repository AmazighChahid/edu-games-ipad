# SPECS TECHNIQUES : Matrices Magiques 🔮

> **Stack** : React Native + Expo SDK 52+ • TypeScript • Reanimated 3  
> **Plateforme** : iPad (principal) • iPhone (secondaire)

---

## 📁 Architecture des Fichiers

```
src/games/matrices-magiques/
├── index.ts                    # Exports publics
├── types.ts                    # Types TypeScript
│
├── components/
│   ├── index.ts
│   ├── MatrixGrid.tsx          # Grille de matrice (2x2 ou 3x3)
│   ├── MatrixCell.tsx          # Cellule individuelle
│   ├── ChoicePanel.tsx         # Panel des choix de réponse
│   ├── ChoiceButton.tsx        # Bouton de choix individuel
│   ├── PixelMascot.tsx         # Mascotte Pixel le Renard
│   ├── SpeechBubble.tsx        # Bulle de dialogue
│   ├── HintButton.tsx          # Bouton d'indice avec compteur
│   ├── WorldSelector.tsx       # Sélecteur de monde/thème
│   ├── WorldCard.tsx           # Carte d'un monde
│   ├── ProgressStars.tsx       # Indicateur d'étoiles
│   ├── PuzzleBackground.tsx    # Fond thématique
│   │
│   ├── shapes/                 # Formes SVG par thème
│   │   ├── index.ts
│   │   ├── ForestShapes.tsx    # 🌲 Animaux, plantes
│   │   ├── SpaceShapes.tsx     # 🚀 Formes géométriques
│   │   ├── CastleShapes.tsx    # 🏰 Symboles fantastiques
│   │   └── ArtShapes.tsx       # 🎨 Formes abstraites
│   │
│   └── feedback/
│       ├── index.ts
│       ├── CorrectAnimation.tsx    # Animation bonne réponse
│       ├── IncorrectAnimation.tsx  # Animation erreur (shake doux)
│       ├── RevealAnimation.tsx     # Animation révélation solution
│       └── VictoryPopup.tsx        # Popup de victoire
│
├── hooks/
│   ├── useMatricesGame.ts      # Hook principal du jeu
│   ├── usePuzzleGenerator.ts   # Génération des puzzles
│   ├── useHintSystem.ts        # Gestion des indices
│   └── useWorldProgress.ts     # Progression par monde
│
├── logic/
│   ├── puzzleEngine.ts         # Moteur de génération
│   ├── transformations.ts      # Règles de transformation
│   ├── validator.ts            # Validation des réponses
│   └── difficultyScaler.ts     # Ajustement difficulté
│
├── data/
│   ├── worlds.ts               # Configuration des 5 mondes
│   ├── puzzleTemplates.ts      # Templates de puzzles par niveau
│   ├── shapes.ts               # Définition des formes
│   └── pixelDialogues.ts       # Scripts de Pixel
│
└── screens/
    ├── index.ts
    ├── MatricesIntroScreen.tsx     # Sélection monde
    ├── MatricesPuzzleScreen.tsx    # Écran de jeu principal
    └── MatricesVictoryScreen.tsx   # Célébration
```

---

## 🔷 Types TypeScript

```typescript
// types.ts

// ============ FORMES & VISUELS ============

export type ShapeType = 
  | 'circle' | 'square' | 'triangle' | 'star' | 'heart' | 'diamond'
  | 'hexagon' | 'pentagon' | 'cross' | 'arrow';

export type ThemeShapeType =
  // Forêt
  | 'fox' | 'rabbit' | 'owl' | 'mushroom' | 'flower' | 'leaf' | 'tree' | 'butterfly'
  // Espace
  | 'planet' | 'rocket' | 'moon' | 'comet' | 'satellite' | 'alien'
  // Château
  | 'crown' | 'key' | 'shield' | 'sword' | 'potion' | 'gem' | 'scroll'
  // Art
  | 'brush' | 'palette' | 'easel' | 'frame';

export type ShapeColor = 
  | 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'pink' | 'cyan';

export type ShapeSize = 'small' | 'medium' | 'large';

export type RotationAngle = 0 | 45 | 90 | 135 | 180 | 225 | 270 | 315;

export interface ShapeConfig {
  type: ShapeType | ThemeShapeType;
  color: ShapeColor;
  size: ShapeSize;
  rotation: RotationAngle;
  count: number;          // Pour addition/soustraction
  filled: boolean;        // Plein ou contour
  pattern?: 'solid' | 'striped' | 'dotted';  // Pour accessibilité
}

// ============ TRANSFORMATIONS ============

export type TransformationType =
  | 'identity'           // Pas de changement
  | 'color_change'       // Changement de couleur
  | 'size_change'        // Changement de taille
  | 'rotation'           // Rotation
  | 'addition'           // Ajout d'élément
  | 'subtraction'        // Retrait d'élément
  | 'count_change'       // Changement de quantité
  | 'fill_toggle'        // Plein ↔ Contour
  | 'reflection'         // Symétrie
  | 'superposition';     // Superposition de formes

export interface Transformation {
  type: TransformationType;
  params: Record<string, any>;  // Paramètres spécifiques
  direction: 'horizontal' | 'vertical' | 'both';
}

// ============ PUZZLE ============

export type GridSize = '2x2' | '3x3';

export interface MatrixCell {
  row: number;
  col: number;
  shape: ShapeConfig | null;  // null = case vide (?)
  isTarget: boolean;          // C'est la case à trouver
}

export interface PuzzleConfig {
  id: string;
  gridSize: GridSize;
  cells: MatrixCell[][];
  targetPosition: { row: number; col: number };
  transformations: Transformation[];
  choices: ShapeConfig[];
  correctChoiceIndex: number;
  difficulty: DifficultyLevel;
  theme: WorldTheme;
}

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

// ============ MONDES ============

export type WorldTheme = 
  | 'forest'    // 🌲 Forêt Enchantée
  | 'space'     // 🚀 Station Spatiale
  | 'castle'    // 🏰 Château Magique
  | 'art'       // 🎨 Atelier d'Artiste
  | 'mystery';  // 🌀 Dimension Mystère

export interface WorldConfig {
  id: WorldTheme;
  name: string;
  emoji: string;
  description: string;
  gridSizes: GridSize[];
  transformationTypes: TransformationType[];
  choicesCount: number;
  puzzlesRequired: number;
  unlockCondition: UnlockCondition;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
}

export interface UnlockCondition {
  previousWorld?: WorldTheme;
  puzzlesSolved: number;
  maxHintsUsed?: number;
}

// ============ INDICES ============

export type HintLevel = 1 | 2 | 3 | 4;

export interface HintConfig {
  level: HintLevel;
  cost: number;          // En étoiles
  type: 'general' | 'directional' | 'rule' | 'elimination';
  getMessage: (puzzle: PuzzleConfig) => string;
}

export interface HintState {
  available: HintLevel[];
  used: HintLevel[];
  starsSpent: number;
}

// ============ SESSION & PROGRESSION ============

export interface PuzzleAttempt {
  puzzleId: string;
  attempts: number;
  hintsUsed: HintLevel[];
  timeSpent: number;  // en secondes
  solved: boolean;
  timestamp: number;
}

export interface SessionState {
  currentWorld: WorldTheme;
  currentPuzzleIndex: number;
  puzzlesInSession: PuzzleConfig[];
  attempts: PuzzleAttempt[];
  totalStars: number;
  hintsRemaining: number;
}

export interface WorldProgress {
  world: WorldTheme;
  puzzlesSolved: number;
  totalPuzzles: number;
  bestTime: number;
  hintsUsed: number;
  unlocked: boolean;
  completed: boolean;
  stars: number;  // 0-3 selon performance
}

export interface PlayerProgress {
  worlds: Record<WorldTheme, WorldProgress>;
  totalPuzzlesSolved: number;
  currentLevel: DifficultyLevel;
  badges: BadgeType[];
  cardsUnlocked: string[];
}

// ============ BADGES ============

export type BadgeType =
  | 'lynx_eye'           // 🎯 Œil de Lynx - couleurs
  | 'rotation_master'    // 🔄 Maître Rotation
  | 'smart_counter'      // ➕ Compteur Malin
  | 'pattern_detective'  // 🧩 Détective Patterns
  | 'no_hints'           // 💡 Sans Filet - monde sans indice
  | 'speed_demon'        // ⚡ Éclair - temps record
  | 'persistent'         // 💪 Persévérant - après échecs
  | 'all_worlds';        // 🌟 Maître des Matrices

export interface Badge {
  type: BadgeType;
  name: string;
  description: string;
  emoji: string;
  condition: (progress: PlayerProgress) => boolean;
}

// ============ MASCOTTE ============

export type PixelMood = 
  | 'neutral' 
  | 'thinking' 
  | 'happy' 
  | 'excited' 
  | 'encouraging' 
  | 'celebrating';

export interface PixelState {
  mood: PixelMood;
  message: string;
  isAnimating: boolean;
}

// ============ COMPOSANTS PROPS ============

export interface MatrixGridProps {
  puzzle: PuzzleConfig;
  selectedChoice: number | null;
  onCellPress?: (cell: MatrixCell) => void;
  showSolution?: boolean;
  animationState: 'idle' | 'checking' | 'correct' | 'incorrect' | 'revealing';
}

export interface ChoicePanelProps {
  choices: ShapeConfig[];
  selectedIndex: number | null;
  correctIndex?: number;  // Pour révélation
  onSelect: (index: number) => void;
  disabled: boolean;
  state: 'idle' | 'selected' | 'correct' | 'incorrect' | 'revealed';
}

export interface PixelMascotProps {
  mood: PixelMood;
  message?: string;
  size?: 'small' | 'medium' | 'large';
  onMessageComplete?: () => void;
}

export interface HintButtonProps {
  hintsAvailable: number;
  currentLevel: HintLevel;
  cost: number;
  onPress: () => void;
  disabled: boolean;
}
```

---

## 🎣 Hooks Principaux

### useMatricesGame

```typescript
// hooks/useMatricesGame.ts

interface UseMatricesGameReturn {
  // État
  puzzle: PuzzleConfig | null;
  selectedChoice: number | null;
  attempts: number;
  gameState: 'playing' | 'checking' | 'correct' | 'incorrect' | 'revealing' | 'complete';
  
  // Pixel
  pixelMood: PixelMood;
  pixelMessage: string;
  
  // Actions
  selectChoice: (index: number) => void;
  submitAnswer: () => void;
  requestHint: () => HintConfig | null;
  nextPuzzle: () => void;
  resetPuzzle: () => void;
  
  // Progression
  puzzleIndex: number;
  totalPuzzles: number;
  sessionScore: number;
}

export function useMatricesGame(world: WorldTheme): UseMatricesGameReturn {
  const [puzzle, setPuzzle] = useState<PuzzleConfig | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [gameState, setGameState] = useState<GameState>('playing');
  
  const { generatePuzzle } = usePuzzleGenerator(world);
  const { getHint, hintsUsed } = useHintSystem();
  const { updateProgress } = useWorldProgress(world);
  
  // Logique de sélection
  const selectChoice = useCallback((index: number) => {
    if (gameState !== 'playing') return;
    setSelectedChoice(index);
  }, [gameState]);
  
  // Soumission de réponse
  const submitAnswer = useCallback(() => {
    if (selectedChoice === null || !puzzle) return;
    
    setGameState('checking');
    
    const isCorrect = selectedChoice === puzzle.correctChoiceIndex;
    
    setTimeout(() => {
      if (isCorrect) {
        setGameState('correct');
        updateProgress({ solved: true, attempts, hintsUsed });
      } else {
        setAttempts(prev => prev + 1);
        
        if (attempts >= 2) {
          // 3ème erreur : révéler
          setGameState('revealing');
        } else {
          setGameState('incorrect');
          setTimeout(() => setGameState('playing'), 1000);
        }
      }
    }, 500);
  }, [selectedChoice, puzzle, attempts]);
  
  // ... autres implémentations
  
  return {
    puzzle,
    selectedChoice,
    attempts,
    gameState,
    pixelMood,
    pixelMessage,
    selectChoice,
    submitAnswer,
    requestHint,
    nextPuzzle,
    resetPuzzle,
    puzzleIndex,
    totalPuzzles,
    sessionScore,
  };
}
```

### usePuzzleGenerator

```typescript
// hooks/usePuzzleGenerator.ts

interface UsePuzzleGeneratorReturn {
  generatePuzzle: (difficulty: DifficultyLevel) => PuzzleConfig;
  generateSession: (count: number) => PuzzleConfig[];
}

export function usePuzzleGenerator(world: WorldTheme): UsePuzzleGeneratorReturn {
  const worldConfig = WORLDS[world];
  
  const generatePuzzle = useCallback((difficulty: DifficultyLevel): PuzzleConfig => {
    // 1. Sélectionner la taille de grille
    const gridSize = selectGridSize(worldConfig, difficulty);
    
    // 2. Choisir les transformations
    const transformations = selectTransformations(worldConfig, difficulty);
    
    // 3. Générer la grille avec la règle
    const { cells, targetPosition } = generateGrid(gridSize, transformations, worldConfig);
    
    // 4. Générer les choix (1 correct + distracteurs)
    const { choices, correctIndex } = generateChoices(
      cells, 
      targetPosition, 
      worldConfig.choicesCount
    );
    
    return {
      id: generateId(),
      gridSize,
      cells,
      targetPosition,
      transformations,
      choices,
      correctChoiceIndex: correctIndex,
      difficulty,
      theme: world,
    };
  }, [world, worldConfig]);
  
  // ...
}
```

---

## ⚙️ Moteur de Puzzle

### Transformations

```typescript
// logic/transformations.ts

export const TRANSFORMATIONS: Record<TransformationType, TransformationHandler> = {
  color_change: {
    apply: (shape, params) => ({
      ...shape,
      color: getNextColor(shape.color, params.sequence),
    }),
    generateSequence: (length) => {
      const colors: ShapeColor[] = ['red', 'blue', 'green', 'yellow'];
      return colors.slice(0, length);
    },
  },
  
  rotation: {
    apply: (shape, params) => ({
      ...shape,
      rotation: ((shape.rotation + params.angle) % 360) as RotationAngle,
    }),
    generateSequence: (length) => {
      const angle = 360 / length;
      return Array.from({ length }, (_, i) => i * angle);
    },
  },
  
  size_change: {
    apply: (shape, params) => ({
      ...shape,
      size: getNextSize(shape.size, params.direction),
    }),
    generateSequence: () => ['small', 'medium', 'large'],
  },
  
  addition: {
    apply: (shape, params) => ({
      ...shape,
      count: shape.count + params.increment,
    }),
    generateSequence: (length) => 
      Array.from({ length }, (_, i) => i + 1),
  },
  
  // ... autres transformations
};

// Appliquer une transformation à une forme
export function applyTransformation(
  shape: ShapeConfig,
  transformation: Transformation,
  step: number
): ShapeConfig {
  const handler = TRANSFORMATIONS[transformation.type];
  const params = {
    ...transformation.params,
    step,
  };
  return handler.apply(shape, params);
}
```

### Génération de Grille

```typescript
// logic/puzzleEngine.ts

export function generateGrid(
  size: GridSize,
  transformations: Transformation[],
  worldConfig: WorldConfig
): { cells: MatrixCell[][]; targetPosition: Position } {
  const [rows, cols] = size === '2x2' ? [2, 2] : [3, 3];
  
  // Choisir la position cible (généralement coin inférieur droit)
  const targetPosition = { row: rows - 1, col: cols - 1 };
  
  // Générer la forme de base
  const baseShape = generateBaseShape(worldConfig);
  
  // Créer la grille
  const cells: MatrixCell[][] = [];
  
  for (let row = 0; row < rows; row++) {
    cells[row] = [];
    for (let col = 0; col < cols; col++) {
      const isTarget = row === targetPosition.row && col === targetPosition.col;
      
      if (isTarget) {
        cells[row][col] = {
          row,
          col,
          shape: null,  // La case à trouver
          isTarget: true,
        };
      } else {
        // Appliquer les transformations selon position
        const shape = applyTransformationsForPosition(
          baseShape,
          transformations,
          { row, col },
          { rows, cols }
        );
        
        cells[row][col] = {
          row,
          col,
          shape,
          isTarget: false,
        };
      }
    }
  }
  
  return { cells, targetPosition };
}

// Générer les choix de réponse
export function generateChoices(
  cells: MatrixCell[][],
  targetPosition: Position,
  count: number
): { choices: ShapeConfig[]; correctIndex: number } {
  // 1. Calculer la bonne réponse
  const correctShape = calculateCorrectAnswer(cells, targetPosition);
  
  // 2. Générer des distracteurs plausibles
  const distractors = generateDistractors(correctShape, count - 1, cells);
  
  // 3. Mélanger
  const choices = [correctShape, ...distractors];
  const shuffled = shuffleArray(choices);
  const correctIndex = shuffled.indexOf(correctShape);
  
  return { choices: shuffled, correctIndex };
}
```

---

## 🎨 Couleurs par Thème

```typescript
// data/worlds.ts

export const WORLD_COLORS: Record<WorldTheme, WorldColors> = {
  forest: {
    primary: '#4A9D5A',      // Vert forêt
    secondary: '#8B4513',    // Brun bois
    background: '#E8F5E9',   // Vert très clair
    accent: '#FF9800',       // Orange (Pixel)
    surface: '#FFFFFF',
    gradient: ['#81C784', '#4CAF50'],
  },
  
  space: {
    primary: '#5B8DEE',      // Bleu spatial
    secondary: '#9C27B0',    // Violet
    background: '#1A1A2E',   // Bleu nuit
    accent: '#FFD700',       // Doré étoiles
    surface: '#2D2D44',
    gradient: ['#667eea', '#764ba2'],
  },
  
  castle: {
    primary: '#9B59B6',      // Violet royal
    secondary: '#F1C40F',    // Or
    background: '#F5E6FF',   // Lavande clair
    accent: '#E74C3C',       // Rouge rubis
    surface: '#FFFFFF',
    gradient: ['#a18cd1', '#fbc2eb'],
  },
  
  art: {
    primary: '#E91E63',      // Rose vif
    secondary: '#00BCD4',    // Cyan
    background: '#FFF9F0',   // Crème
    accent: '#FF5722',       // Orange vif
    surface: '#FFFFFF',
    gradient: ['#f093fb', '#f5576c'],
  },
  
  mystery: {
    primary: '#6C5CE7',      // Violet mystère
    secondary: '#00CEC9',    // Turquoise
    background: '#2D3436',   // Gris foncé
    accent: '#FDCB6E',       // Or ancien
    surface: '#636E72',
    gradient: ['#a55eea', '#8854d0'],
  },
};
```

---

## 🎬 Animations Clés

### Animation Correct

```typescript
// components/feedback/CorrectAnimation.tsx

const correctAnimation = useAnimatedStyle(() => {
  return {
    transform: [
      {
        scale: withSequence(
          withTiming(1.15, { duration: 150 }),
          withSpring(1, { damping: 8, stiffness: 200 })
        ),
      },
    ],
    opacity: withTiming(1, { duration: 200 }),
  };
});

// Pièce qui vole vers la case cible
const flyToTarget = useAnimatedStyle(() => {
  return {
    transform: [
      { translateX: withTiming(targetX.value, { duration: 400 }) },
      { translateY: withTiming(targetY.value, { duration: 400 }) },
      { scale: withTiming(0.8, { duration: 400 }) },
    ],
  };
});
```

### Animation Incorrect (Shake doux)

```typescript
// components/feedback/IncorrectAnimation.tsx

const shakeAnimation = useAnimatedStyle(() => {
  return {
    transform: [
      {
        translateX: withSequence(
          withTiming(-8, { duration: 50 }),
          withTiming(8, { duration: 50 }),
          withTiming(-8, { duration: 50 }),
          withTiming(8, { duration: 50 }),
          withTiming(0, { duration: 50 })
        ),
      },
    ],
  };
});

// Retour à la position initiale
const returnToPlace = useAnimatedStyle(() => {
  return {
    transform: [
      { translateX: withTiming(0, { duration: 300 }) },
      { translateY: withTiming(0, { duration: 300 }) },
      { scale: withSpring(1, { damping: 12 }) },
    ],
    opacity: withTiming(0.7, { duration: 200 }),
  };
});
```

### Animation Révélation

```typescript
// components/feedback/RevealAnimation.tsx

const revealSequence = () => {
  'worklet';
  
  // 1. Pulse sur la bonne réponse
  correctChoiceScale.value = withSequence(
    withTiming(1.2, { duration: 300 }),
    withSpring(1.05, { damping: 10 })
  );
  
  // 2. Highlight/glow
  correctChoiceGlow.value = withTiming(1, { duration: 400 });
  
  // 3. Vol vers la case cible
  runOnJS(setTimeout)(() => {
    flyToTargetProgress.value = withTiming(1, { duration: 500 });
  }, 600);
  
  // 4. Insertion dans la grille
  runOnJS(setTimeout)(() => {
    targetCellScale.value = withSequence(
      withTiming(1.1, { duration: 200 }),
      withSpring(1, { damping: 12 })
    );
  }, 1100);
};
```

---

## 📱 Layout Responsive

### iPad (Principal)

```typescript
const iPadLayout = {
  screenPadding: 32,
  gridContainer: {
    width: 450,
    height: 450,
  },
  cellSize: {
    '2x2': 180,
    '3x3': 130,
  },
  choiceSize: 100,
  choiceGap: 20,
  mascotSize: {
    width: 160,
    height: 180,
  },
  mascotPosition: 'right',  // À droite de la grille
};
```

### iPhone (Secondaire)

```typescript
const iPhoneLayout = {
  screenPadding: 20,
  gridContainer: {
    width: 300,
    height: 300,
  },
  cellSize: {
    '2x2': 120,
    '3x3': 85,
  },
  choiceSize: 70,
  choiceGap: 12,
  mascotSize: {
    width: 100,
    height: 110,
  },
  mascotPosition: 'bottom',  // En bas, plus petit
};
```

---

## ✅ Checklist Implémentation

### Phase 1 — MVP
- [ ] Types TypeScript complets
- [ ] Composant MatrixGrid (2x2)
- [ ] Composant ChoicePanel
- [ ] Hook useMatricesGame (basique)
- [ ] 1 transformation simple (couleur)
- [ ] Feedback correct/incorrect basique
- [ ] 1 monde jouable (Forêt)

### Phase 2 — Core
- [ ] Toutes transformations simples
- [ ] Grille 3x3
- [ ] Système d'indices (4 niveaux)
- [ ] Mascotte Pixel avec dialogues
- [ ] 3 mondes jouables
- [ ] Animations complètes

### Phase 3 — Polish
- [ ] Transformations combinées
- [ ] 5 mondes complets
- [ ] Système de badges
- [ ] Cartes à collectionner
- [ ] Persistance progression
- [ ] Sons et musique

---

*Specs Techniques v1.0 — Matrices Magiques*
*React Native + Expo SDK 52+*
