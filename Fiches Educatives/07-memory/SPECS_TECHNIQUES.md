# ⚙️ SPECS TECHNIQUES : Super Mémoire

## Architecture des Composants

### Structure des Fichiers (Actuelle)

```
/src/games/07-memory/
├── index.ts                      # Exports centralisés
├── types.ts                      # Types TypeScript
├── logic/
│   ├── index.ts                  # Exports logic
│   └── memoryEngine.ts           # Logique de jeu pure (~340 lignes)
├── hooks/
│   ├── index.ts                  # Exports hooks
│   ├── useMemoryGame.ts          # Logique de jeu (~275 lignes)
│   ├── useMemorySound.ts         # Sons (~155 lignes)
│   └── useMemoryIntro.ts         # Orchestrateur (~530 lignes)
├── components/
│   ├── index.ts                  # Exports composants
│   ├── GameBoard.tsx             # Plateau de jeu avec contrôles
│   ├── MemoryCard.tsx            # Carte avec animation flip
│   ├── MemoryGrid.tsx            # Grille adaptative
│   └── mascot/
│       ├── index.ts              # Export mascotte
│       └── MemoMascot.tsx        # Mascotte SVG animée (~420 lignes)
├── screens/
│   ├── index.ts                  # Exports screens
│   └── MemoryIntroScreen.tsx     # Écran principal (~190 lignes)
└── data/
    ├── levels.ts                 # 10 niveaux progressifs
    ├── themes.ts                 # 6 thèmes (animaux, fruits, etc.)
    ├── assistantScripts.ts       # Scripts mascotte
    └── parentGuideData.ts        # Données ParentDrawer
```

---

## Types TypeScript

```typescript
// types.ts

// ============================================
// TYPES DE BASE
// ============================================

export type CardTheme = 'animals' | 'fruits' | 'vehicles' | 'nature' | 'space' | 'emojis';
export type CardState = 'hidden' | 'revealed' | 'matched';
export type GamePhase = 'intro' | 'playing' | 'paused' | 'victory';
export type Difficulty = 'easy' | 'medium' | 'hard';

// ============================================
// CARTE
// ============================================

export interface MemoryCard {
  id: string;
  symbolId: string;        // ID de la paire
  symbol: string;          // Emoji affiché
  state: CardState;
  position: number;
}

// ============================================
// NIVEAU
// ============================================

export interface MemoryLevel {
  id: string;
  name: string;
  description: string;
  pairCount: number;       // 4, 6, 8, 10, 12
  theme: CardTheme;
  difficulty: Difficulty;
  timeLimit: number;       // 0 = pas de limite
  idealTime: number;
  idealAttempts: number;
  ageRange: string;
  locked: boolean;
}

// ============================================
// ÉTAT DU JEU
// ============================================

export interface MemoryGameState {
  cards: MemoryCard[];
  revealedCards: string[];   // Max 2
  matchedPairs: number;
  totalPairs: number;
  attempts: number;
  phase: GamePhase;
  timeElapsed: number;
  level: MemoryLevel;
  isChecking: boolean;
  isAnimating: boolean;
}

// ============================================
// RÉSULTAT
// ============================================

export interface MemoryResult {
  levelId: string;
  isVictory: boolean;
  timeSeconds: number;
  attempts: number;
  score: number;
  stars: number;           // 1-3
  accuracy: number;
  isNewRecord: boolean;
}

// ============================================
// THÈME
// ============================================

export interface ThemeConfig {
  id: CardTheme;
  name: string;
  description: string;
  symbols: string[];
  backgroundColor: string;
  accentColor: string;
}
```

---

## Hooks

### useMemoryIntro (Orchestrateur Principal)

```typescript
// hooks/useMemoryIntro.ts

export interface UseMemoryIntroReturn {
  // Niveaux
  levels: LevelConfig[];
  selectedLevel: LevelConfig | null;
  currentMemoryLevel: MemoryLevel | null;
  handleSelectLevel: (level: LevelConfig) => void;

  // État jeu
  isPlaying: boolean;
  isTrainingMode: boolean;

  // Animations
  selectorStyle: AnimatedStyle;
  progressPanelStyle: AnimatedStyle;

  // Mascot
  mascotMessage: string;
  mascotEmotion: MemoEmotionType;

  // Game state
  gameState: MemoryGameState | null;
  result: MemoryResult | null;
  isLoading: boolean;

  // Training
  trainingConfig: TrainingConfig;
  selectedTheme: CardTheme;

  // Progress
  progressData: { totalLevels, completedLevels, currentLevel, totalStars };

  // Handlers
  handleCardFlip: (cardId: string) => void;
  handleReset: () => void;
  handleHint: () => void;
  handleBack: () => void;
  handleStartPlaying: () => void;
  handleParentPress: () => void;
  handleHelpPress: () => void;
  handleTrainingPress: () => void;
  handlePause: () => void;
  handleResume: () => void;

  // Hints
  hintsRemaining: number;

  // Parent drawer
  showParentDrawer: boolean;
  setShowParentDrawer: (show: boolean) => void;
}
```

### useMemoryGame (Logique de Jeu)

```typescript
// hooks/useMemoryGame.ts

export interface UseMemoryGameReturn {
  gameState: MemoryGameState | null;
  result: MemoryResult | null;
  isLoading: boolean;
  startGame: (level: MemoryLevel) => void;
  handleCardFlip: (cardId: string) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartLevel: () => void;
  requestHint: () => void;
  hintCardId: string | null;
}
```

### useMemorySound (Sons)

```typescript
// hooks/useMemorySound.ts

export type MemorySoundName =
  | 'card_flip'      // disk_move.mp3
  | 'card_match'     // robot_correct.mp3
  | 'card_mismatch'  // robot_error.mp3
  | 'victory'        // victory.mp3
  | 'hint'           // hint.mp3
  | 'select'         // robot_select.mp3
  | 'start';         // disk_place.mp3

export interface UseMemorySoundReturn {
  playSound: (name: MemorySoundName) => void;
  playFlip: () => void;
  playMatch: () => void;
  playMismatch: () => void;
  playVictory: () => void;
  playHint: () => void;
  playSelect: () => void;
  playStart: () => void;
}
```

---

## Composant Principal

### MemoryIntroScreen

```typescript
// screens/MemoryIntroScreen.tsx (~190 lignes)

import { GameIntroTemplate, Button } from '../../../components/common';
import { ParentDrawer } from '../../../components/parent/ParentDrawer';
import { GameBoard } from '../components/GameBoard';
import { MemoMascot } from '../components/mascot';
import { useMemoryIntro } from '../hooks/useMemoryIntro';

function MemoryIntroScreen() {
  const intro = useMemoryIntro();

  // renderLevelCard - Affiche les cartes de niveau
  // renderGame - Affiche le plateau ou l'aperçu
  // renderProgress - Affiche la progression

  return (
    <>
      <GameIntroTemplate
        title="Super Mémoire"
        emoji={Icons.elephant}
        levels={intro.levels}
        selectedLevel={intro.selectedLevel}
        onSelectLevel={intro.handleSelectLevel}
        renderLevelCard={renderLevelCard}
        renderGame={renderGame}
        renderProgress={renderProgress}
        mascotComponent={<MemoMascot ... />}
        // ... autres props
      />
      <ParentDrawer
        isVisible={intro.showParentDrawer}
        onClose={() => intro.setShowParentDrawer(false)}
        {...memoryParentGuideData}
      />
    </>
  );
}
```

---

## Mascotte

### MemoMascot (Éléphant SVG)

```typescript
// components/mascot/MemoMascot.tsx (~420 lignes)

export type MemoEmotionType =
  | 'neutral'      // Repos
  | 'happy'        // Content
  | 'thinking'     // Réfléchit
  | 'excited'      // Très content
  | 'encouraging'; // Encourage

interface MemoMascotProps {
  message?: string;
  emotion?: MemoEmotionType;
  size?: number;
  showBubble?: boolean;
  onMessageComplete?: () => void;
}

// Animations intégrées :
// - Floating (corps qui flotte)
// - Ear wiggle (oreilles qui bougent)
// - Trunk swing (trompe qui balance)
// - Blink (clignement)
// - Tail wag (queue qui remue)
```

---

## Données

### Niveaux (10 niveaux progressifs)

| # | Nom | Paires | Thème | Difficulté | Chrono |
|---|-----|--------|-------|------------|--------|
| 1 | Premier Match | 4 | animals | easy | ❌ |
| 2 | Fruits Jumeaux | 4 | fruits | easy | ❌ |
| 3 | Plus de Cartes | 6 | animals | easy | ❌ |
| 4 | Véhicules Express | 6 | vehicles | easy | ❌ |
| 5 | Nature Secrète | 6 | nature | easy | ❌ |
| 6 | Grand Défi | 8 | animals | medium | ❌ |
| 7 | Émojis Fous | 8 | emojis | medium | ❌ |
| 8 | Voyage Spatial | 10 | space | hard | ❌ |
| 9 | Méga Mémoire | 12 | emojis | hard | ❌ |
| 10 | Maître Mémoire | 12 | space | hard | ✅ 3min |

### Thèmes (6 thèmes)

| Thème | Symboles | Background | Accent |
|-------|----------|------------|--------|
| animals | 16 emojis | successLight | success |
| fruits | 16 emojis | memory bg | memory |
| vehicles | 16 emojis | logic bg | logic |
| nature | 16 emojis | numbers bg | numbers |
| space | 16 emojis | spatial bg | spatial |
| emojis | 16 emojis | warningLight | warning |

---

## Logique de Jeu

### memoryEngine.ts

```typescript
// logic/memoryEngine.ts

// Création
export function createGame(level: MemoryLevel, symbols: string[]): MemoryGameState;
export function createShuffledCards(pairCount: number, symbols: string[]): MemoryCard[];

// Actions
export function flipCard(state: MemoryGameState, cardId: string): MemoryGameState;
export function checkMatch(state: MemoryGameState): { isMatch: boolean; newState: MemoryGameState };
export function resetRevealedCards(state: MemoryGameState): MemoryGameState;

// Score
export function calculateResult(state: MemoryGameState): MemoryResult;
export function calculateStars(level: MemoryLevel, time: number, attempts: number): number;

// Utilitaires
export function isGameComplete(state: MemoryGameState): boolean;
export function isTimeUp(state: MemoryGameState): boolean;
export function tickTime(state: MemoryGameState): MemoryGameState;
export function getGridDimensions(pairCount: number): { rows: number; cols: number };
```

### Calcul des étoiles

```typescript
// 3 étoiles : temps <= idéal ET essais <= 1.2× paires
// 2 étoiles : temps <= 1.5× idéal ET essais <= 1.5× paires
// 1 étoile : jeu terminé
```

---

## Animations (Reanimated 3)

```typescript
// Animation de flip (MemoryCard)
const flipAnimation = useAnimatedStyle(() => ({
  transform: [{ rotateY: `${rotation.value}deg` }],
}));

// Animation de match (scale bounce)
scale.value = withSequence(
  withSpring(1.15, SPRING_CONFIG),
  withSpring(1.0, SPRING_CONFIG)
);

// Animation de no-match (shake)
translateX.value = withSequence(
  withTiming(-8, { duration: 50 }),
  withTiming(8, { duration: 50 }),
  withTiming(0, { duration: 50 })
);

// Transition play mode
selectorY.value = withTiming(-150, { duration: 400 });
selectorOpacity.value = withTiming(0, { duration: 300 });
```

---

## Accessibilité

| Critère | Implémentation |
|---------|----------------|
| Touch targets | ≥ 64dp |
| Font size | ≥ 18pt (sauf badges) |
| Contraste | Suffisant pour daltonisme |
| VoiceOver | Labels sur toutes les cartes |
| ReduceMotion | Animations simplifiées |

---

## Sons

| Son | Fichier | Volume | Utilisation |
|-----|---------|--------|-------------|
| card_flip | disk_move.mp3 | 0.5 | Retournement carte |
| card_match | robot_correct.mp3 | 0.8 | Paire trouvée |
| card_mismatch | robot_error.mp3 | 0.6 | Pas de paire |
| victory | victory.mp3 | 0.9 | Victoire |
| hint | hint.mp3 | 0.7 | Indice |
| select | robot_select.mp3 | 0.5 | Sélection niveau |
| start | disk_place.mp3 | 0.6 | Début partie |

---

## Configuration

```typescript
export const DEFAULT_MEMORY_CONFIG: MemoryConfig = {
  mismatchDelay: 1000,         // Délai avant retournement
  flipDuration: 300,           // Durée animation flip
  matchAnimationDuration: 500, // Durée animation match
  minMoveCooldown: 200,        // Délai entre coups
};
```

---

*Spécifications Techniques Super Mémoire | Dernière mise à jour : Décembre 2024*
