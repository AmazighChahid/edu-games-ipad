# ⚙️ SPECS TECHNIQUES : Sudoku Montessori

> **Version** : 2.0 — Décembre 2024
> **Architecture** : Hook+Template (conforme à docs/GAME_ARCHITECTURE.md)

---

## Architecture des Fichiers

```
/src/games/05-sudoku/
├── index.ts                          # Exports du module
├── types/
│   └── index.ts                      # Types TypeScript (SudokuLevelConfig, TrainingConfig, etc.)
│
├── hooks/
│   ├── useSudokuGame.ts              # Logique de jeu pure (grille, placement, validation)
│   ├── useSudokuSound.ts             # Hook audio (playSelect, playCorrect, etc.)
│   └── useSudokuIntro.ts             # ORCHESTRATEUR (progression, UI, navigation)
│
├── screens/
│   └── SudokuIntroScreen.tsx         # Écran principal (~300 lignes) utilisant GameIntroTemplate
│
├── components/
│   ├── FelixMascot.tsx               # Mascotte SVG animée (Félix le Renard)
│   ├── SudokuGrid.tsx                # Grille complète avec régions
│   ├── SudokuCell.tsx                # Cellule individuelle avec animations
│   ├── SymbolSelector.tsx            # Sélecteur de symboles (fruits, animaux, etc.)
│   ├── SudokuLevelCard.tsx           # Carte de niveau (1-10)
│   ├── TrainingModeSelector.tsx      # Modal personnalisation mode entraînement
│   ├── SudokuGameArea.tsx            # Zone de jeu (grille + sélecteur)
│   ├── SudokuProgressPanel.tsx       # Panneau de progression
│   ├── SudokuBackground.tsx          # Arrière-plan thème bibliothèque
│   ├── LibraryDecoration.tsx         # Décorations (étagères, livres)
│   └── index.ts                      # Exports des composants
│
├── data/
│   ├── levels.ts                     # 10 niveaux progressifs + config entraînement
│   ├── assistantScripts.ts           # Dialogues de Félix le Renard
│   └── parentGuideData.ts            # Données pour ParentDrawer
│
└── logic/
    ├── generator.ts                  # Génération de grilles Sudoku
    └── validation.ts                 # Validation des règles
```

---

## Types TypeScript Principaux

```typescript
// types/index.ts

// Tailles de grille supportées
export type SudokuSize = 4 | 6 | 9;

// Thèmes visuels
export type SudokuTheme = 'fruits' | 'animals' | 'shapes' | 'colors' | 'numbers';

// Niveaux de difficulté
export type SudokuDifficulty = 1 | 2 | 3; // Découverte, Défi, Expert

// Configuration d'un niveau (10 niveaux prédéfinis)
export interface SudokuLevelConfig {
  id: string;
  number: number;              // 1-10
  size: SudokuSize;
  difficulty: SudokuDifficulty;
  theme: SudokuTheme;
  emptyCells: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  stars?: number;
  bestTime?: number;
}

// Configuration mode entraînement
export interface TrainingConfig {
  size: SudokuSize;
  difficulty: SudokuDifficulty;
  theme: SudokuTheme;
}

// Émotions de la mascotte Félix
export type FelixEmotionType = 'neutral' | 'happy' | 'thinking' | 'excited' | 'encouraging';

// État d'une cellule Sudoku
export interface SudokuCell {
  row: number;
  col: number;
  value: SudokuValue | null;
  isFixed: boolean;
  hasConflict: boolean;
  annotations: SudokuValue[];
  region: number;
}

// Grille Sudoku complète
export interface SudokuGrid {
  size: SudokuSize;
  cells: SudokuCell[][];
  theme: SudokuTheme;
  symbols: SudokuValue[];
  solution: SudokuValue[][];
}
```

---

## Système de Niveaux

### 10 Niveaux Progressifs

| Niveau | Taille | Difficulté | Cases vides | Thème |
|--------|--------|------------|-------------|-------|
| 1 | 4×4 | Découverte | 4 | Fruits |
| 2 | 4×4 | Découverte | 6 | Animaux |
| 3 | 4×4 | Défi | 7 | Formes |
| 4 | 4×4 | Défi | 8 | Couleurs |
| 5 | 6×6 | Découverte | 10 | Fruits |
| 6 | 6×6 | Découverte | 12 | Animaux |
| 7 | 6×6 | Défi | 14 | Nombres |
| 8 | 6×6 | Défi | 16 | Formes |
| 9 | 9×9 | Découverte | 25 | Nombres |
| 10 | 9×9 | Défi | 35 | Nombres |

### Mode Entraînement

- Accessible via bouton "Entraînement" (emoji 🎯)
- Personnalisation : taille + thème + difficulté
- Pas de sauvegarde de progression (juste pour pratiquer)
- Modal `TrainingModeSelector` avec options visuelles

---

## Composants Clés

### FelixMascot (Mascotte SVG)

```typescript
interface FelixMascotProps {
  message: string;
  emotion?: FelixEmotionType;
  visible?: boolean;
  onMessageComplete?: () => void;
  size?: 'small' | 'medium' | 'large';
}
```

**Caractéristiques** :
- SVG animé (react-native-svg)
- 5 émotions avec expressions faciales différentes
- Animation de flottement (bobbing) idle
- Intégration MascotBubble pour les dialogues avec effet typewriter

### useSudokuIntro (Hook Orchestrateur)

**Responsabilités** :
- Gestion des 10 niveaux + mode entraînement
- Transitions animées (Reanimated v3)
- Messages mascotte selon contexte
- Persistance progression (Zustand)
- Navigation (expo-router)

**Interface exportée** :
```typescript
interface UseSudokuIntroReturn {
  // Niveaux
  levels: SudokuLevelConfig[];
  selectedLevel: SudokuLevelConfig | null;
  handleSelectLevel: (level: SudokuLevelConfig) => void;

  // Mode entraînement
  isTrainingMode: boolean;
  showTrainingSelector: boolean;
  trainingConfig: TrainingConfig;
  handleTrainingModeToggle: () => void;
  handleStartTraining: () => void;

  // État jeu
  isPlaying: boolean;
  isVictory: boolean;
  gameState: GameState;
  errorCount: number;

  // Mascotte
  mascotMessage: string;
  mascotEmotion: FelixEmotionType;

  // Animations
  selectorStyle: AnimatedStyle;
  progressPanelStyle: AnimatedStyle;

  // Handlers
  handleStartPlaying: () => void;
  handleBack: () => void;
  handleReset: () => void;
  handleHint: () => void;
  handleParentPress: () => void;
}
```

### SudokuIntroScreen

**Template utilisé** : `GameIntroTemplate` (composant commun)

**Props principales** :
- `emoji` : `Icons.puzzle` (depuis @/constants/icons)
- `showTrainingMode` : true
- `onTrainingPress` : ouvre le modal TrainingModeSelector
- `mascotComponent` : `<FelixMascot />`
- `renderGame` : `<SudokuGameArea />`
- `renderProgress` : `<SudokuProgressPanel />`

---

## Animations

### Reanimated v3

| Animation | Trigger | Config |
|-----------|---------|--------|
| Bobbing mascotte | Idle | `withRepeat`, ±4px, 1200ms |
| Sélection niveau | Tap | `withSpring`, scale 0.95 → 1 |
| Transition jeu | Start | `withTiming`, translateY -150px |
| Conflit cellule | Erreur | `withSequence`, shake ±10px |
| Victoire | Complete | `withSpring`, scale 1 → 1.05 → 1 |

---

## Thèmes Visuels

### Symboles par Thème

| Thème | 4×4 | 6×6 | 9×9 |
|-------|-----|-----|-----|
| Fruits | 🍎🍌🍇🍊 | +🍓🍉 | +🍑🍋🥝 |
| Animaux | 🐶🐱🐰🐻 | +🐼🦊 | +🦁🐯🐨 |
| Formes | ⬛🔵🔺⭐ | +💚🔶 | +🔷🟣🔸 |
| Couleurs | 🔴🔵🟢🟡 | +🟣🟠 | +🟤⚪⚫ |
| Nombres | 1234 | 123456 | 123456789 |

---

## Imports Standards

```typescript
// Theme et composants
import { colors, spacing, borderRadius, shadows, fontFamily, touchTargets } from '@/theme';
import { Icons } from '@/constants/icons';
import { GameIntroTemplate, PageContainer, VictoryCard, MascotBubble } from '@/components/common';
import { ParentDrawer } from '@/components/parent/ParentDrawer';

// Store
import { useStore, useGameProgress } from '@/store';

// Hooks locaux
import { useSudokuIntro } from '../hooks/useSudokuIntro';
import { useSudokuGame } from '../hooks/useSudokuGame';
import { useSudokuSound } from '../hooks/useSudokuSound';
```

---

## Règles UX Enfant

| Règle | Valeur |
|-------|--------|
| Touch targets | ≥ 64dp (via `touchTargets.minimum`) |
| Texte courant | ≥ 18pt |
| Texte secondaire | ≥ 14pt |
| Polices | Fredoka (titres) + Nunito (corps) |
| Animations | Spring (pas de linear) |
| Feedback erreur | Encourageant, jamais punitif |

---

## Fichiers Connexes

| Fichier | Description |
|---------|-------------|
| `data/levels.ts` | Définition des 10 niveaux + TRAINING_OPTIONS |
| `data/assistantScripts.ts` | Dialogues de Félix par contexte |
| `data/parentGuideData.ts` | Données pédagogiques ParentDrawer |
| `logic/generator.ts` | Algorithme backtracking génération grilles |
| `logic/validation.ts` | Validation placement + détection conflits |

---

*Spécifications Techniques Sudoku v2.0 | Architecture Hook+Template | Décembre 2024*
