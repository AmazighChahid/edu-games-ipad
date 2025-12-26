# ⚙️ SPECS TECHNIQUES : Sudoku Montessori

## Architecture des Composants

### Structure des Fichiers

```
/src/components/activities/Sudoku/
├── SudokuGame.tsx                  # Composant principal
├── components/
│   ├── SudokuGrid.tsx              # Grille complète
│   ├── SudokuCell.tsx              # Cellule individuelle
│   ├── SudokuRegion.tsx            # Région (box) 2×2, 2×3 ou 3×3
│   ├── SymbolSelector.tsx          # Sélecteur de symboles
│   ├── AnnotationPanel.tsx         # Interface d'annotation
│   ├── ConflictHighlight.tsx       # Affichage des conflits
│   ├── GridSelector.tsx            # Choix taille/thème/difficulté
│   ├── ActionBar.tsx               # Boutons d'action (vérifier, annuler, etc.)
│   └── VictoryScreen.tsx           # Écran de victoire
├── hooks/
│   ├── useSudokuGame.ts            # Logique de jeu principale
│   ├── useSudokuGenerator.ts       # Génération de grilles
│   ├── useSudokuValidator.ts       # Validation des règles
│   ├── useSudokuSolver.ts          # Solveur pour indices
│   └── useAnnotations.ts           # Gestion des annotations
├── utils/
│   ├── gridGenerator.ts            # Algorithmes de génération
│   ├── validator.ts                # Fonctions de validation
│   ├── solver.ts                   # Solveur backtracking
│   └── difficultyScaler.ts         # Ajustement difficulté
├── data/
│   ├── themes.ts                   # Thèmes visuels
│   ├── presetGrids.ts              # Grilles pré-générées
│   └── achievements.ts             # Badges et récompenses
├── constants/
│   └── sudokuConfig.ts             # Configuration globale
└── types/
    └── index.ts                    # Types TypeScript
```

---

## Types TypeScript

### Types de Base

```typescript
// types/index.ts

// ============================================
// TAILLES DE GRILLE
// ============================================

export type GridSize = 4 | 6 | 9;

export type RegionSize = {
  rows: number;
  cols: number;
};

export const REGION_SIZES: Record<GridSize, RegionSize> = {
  4: { rows: 2, cols: 2 },  // 2×2 régions
  6: { rows: 2, cols: 3 },  // 2×3 régions
  9: { rows: 3, cols: 3 },  // 3×3 régions
};

// ============================================
// SYMBOLES ET THÈMES
// ============================================

export type ThemeType = 'fruits' | 'animals' | 'shapes' | 'colors' | 'numbers';

export type SymbolValue = string | number;

export interface Theme {
  id: ThemeType;
  name: string;
  symbols: Record<GridSize, SymbolValue[]>;
  displayType: 'emoji' | 'image' | 'text';
  ageRange: [number, number];
  unlocked: boolean;
}

// Exemples de symboles par thème et taille
export const THEME_SYMBOLS: Record<ThemeType, Record<GridSize, SymbolValue[]>> = {
  fruits: {
    4: ['🍎', '🍌', '🍇', '🍊'],
    6: ['🍎', '🍌', '🍇', '🍊', '🍓', '🥝'],
    9: ['🍎', '🍌', '🍇', '🍊', '🍓', '🥝', '🍑', '🍒', '🥭'],
  },
  animals: {
    4: ['🐶', '🐱', '🐰', '🐻'],
    6: ['🐶', '🐱', '🐰', '🐻', '🦊', '🐼'],
    9: ['🐶', '🐱', '🐰', '🐻', '🦊', '🐼', '🐨', '🦁', '🐸'],
  },
  shapes: {
    4: ['⬛', '🔵', '🔺', '⭐'],
    6: ['⬛', '🔵', '🔺', '⭐', '◆', '⬡'],
    9: ['⬛', '🔵', '🔺', '⭐', '◆', '⬡', '⬢', '○', '□'],
  },
  colors: {
    4: ['🔴', '🔵', '🟢', '🟡'],
    6: ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠'],
    9: ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠', '⚫', '⚪', '🟤'],
  },
  numbers: {
    4: [1, 2, 3, 4],
    6: [1, 2, 3, 4, 5, 6],
    9: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
};

// ============================================
// CELLULES
// ============================================

export interface CellPosition {
  row: number;
  col: number;
}

export interface SudokuCell {
  row: number;
  col: number;
  value: SymbolValue | null;
  isFixed: boolean;              // Pré-remplie (non modifiable)
  isSelected: boolean;
  isHighlighted: boolean;        // Même ligne/colonne/région
  hasConflict: boolean;
  conflictWith: CellPosition[];  // Positions des cellules en conflit
  annotations: SymbolValue[];    // Candidats notés par l'utilisateur
  region: number;                // Index de la région (0 à size-1)
}

// ============================================
// GRILLE
// ============================================

export interface SudokuGrid {
  size: GridSize;
  cells: SudokuCell[][];
  theme: ThemeType;
  symbols: SymbolValue[];
  difficulty: DifficultyLevel;
  solution: SymbolValue[][];     // Solution complète (pour validation)
}

export type DifficultyLevel = 1 | 2 | 3;  // Facile, Moyen, Difficile

export interface DifficultyConfig {
  level: DifficultyLevel;
  name: string;
  cluesRange: Record<GridSize, [number, number]>;  // [min, max] cases pré-remplies
}

export const DIFFICULTY_CONFIGS: DifficultyConfig[] = [
  {
    level: 1,
    name: 'Facile',
    cluesRange: {
      4: [10, 12],
      6: [20, 24],
      9: [40, 50],
    },
  },
  {
    level: 2,
    name: 'Moyen',
    cluesRange: {
      4: [8, 9],
      6: [16, 19],
      9: [30, 39],
    },
  },
  {
    level: 3,
    name: 'Difficile',
    cluesRange: {
      4: [6, 7],
      6: [12, 15],
      9: [25, 29],
    },
  },
];

// ============================================
// ÉTAT DU JEU
// ============================================

export interface GameState {
  grid: SudokuGrid;
  selectedCell: CellPosition | null;
  isAnnotationMode: boolean;
  history: HistoryEntry[];        // Pour Undo
  historyIndex: number;
  hintsUsed: number;
  errorsCount: number;
  startTime: Date;
  isComplete: boolean;
  isPaused: boolean;
}

export interface HistoryEntry {
  cell: CellPosition;
  previousValue: SymbolValue | null;
  newValue: SymbolValue | null;
  previousAnnotations: SymbolValue[];
  timestamp: Date;
}

export type GameStatus = 
  | 'idle'
  | 'cell_selected'
  | 'placing'
  | 'conflict'
  | 'annotating'
  | 'checking'
  | 'complete'
  | 'paused';

// ============================================
// VALIDATION
// ============================================

export type ConflictType = 'row' | 'column' | 'region';

export interface Conflict {
  type: ConflictType;
  cell1: CellPosition;
  cell2: CellPosition;
  value: SymbolValue;
}

export interface ValidationResult {
  isValid: boolean;
  conflicts: Conflict[];
}

// ============================================
// INDICES
// ============================================

export type HintLevel = 1 | 2 | 3 | 4 | 5;

export interface Hint {
  level: HintLevel;
  type: 'verbal' | 'highlight' | 'elimination' | 'reveal' | 'place';
  message: string;
  targetCell?: CellPosition;
  correctValue?: SymbolValue;
  impossibleValues?: SymbolValue[];
}

// ============================================
// PROGRESSION
// ============================================

export interface PlayerProgress {
  gridsCompleted: Record<GridSize, Record<DifficultyLevel, number>>;
  totalGrids: number;
  bestTimes: Record<string, number>;  // "4-1" -> temps en secondes
  errorsTotal: number;
  hintsTotal: number;
  unlockedSizes: GridSize[];
  unlockedThemes: ThemeType[];
  badges: Badge[];
  currentStreak: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  condition: BadgeCondition;
}

export type BadgeCondition = 
  | { type: 'grids_completed'; count: number }
  | { type: 'no_errors'; gridSize?: GridSize }
  | { type: 'no_hints'; gridSize?: GridSize }
  | { type: 'size_unlocked'; size: GridSize }
  | { type: 'streak'; count: number }
  | { type: 'time_record'; gridSize: GridSize; difficulty: DifficultyLevel };

export interface SessionStats {
  gridSize: GridSize;
  difficulty: DifficultyLevel;
  theme: ThemeType;
  completed: boolean;
  time: number;
  errors: number;
  hintsUsed: number;
  annotationsUsed: boolean;
}
```

---

## Composants React Native

### Composant Principal

```typescript
// SudokuGame.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { SudokuGrid } from './components/SudokuGrid';
import { SymbolSelector } from './components/SymbolSelector';
import { ActionBar } from './components/ActionBar';
import { AnnotationPanel } from './components/AnnotationPanel';
import { VictoryScreen } from './components/VictoryScreen';
import { MascotBubble } from '@/components/mascot/MascotBubble';
import { IconButton } from '@/components/ui/IconButton';

import { useSudokuGame } from './hooks/useSudokuGame';
import { useSudokuValidator } from './hooks/useSudokuValidator';
import { useSound } from '@/hooks/useSound';
import { useHaptics } from '@/hooks/useHaptics';

import { COLORS } from '@/constants/theme';
import { 
  GridSize, 
  ThemeType, 
  DifficultyLevel, 
  CellPosition,
  SymbolValue,
  SessionStats 
} from './types';

interface Props {
  gridSize: GridSize;
  theme: ThemeType;
  difficulty: DifficultyLevel;
  onComplete: (stats: SessionStats) => void;
  onExit: () => void;
}

export const SudokuGame: React.FC<Props> = ({
  gridSize,
  theme,
  difficulty,
  onComplete,
  onExit,
}) => {
  const {
    gameState,
    selectCell,
    placeSymbol,
    removeSymbol,
    toggleAnnotation,
    undo,
    resetGrid,
    requestHint,
    checkGrid,
  } = useSudokuGame({ gridSize, theme, difficulty });

  const { validatePlacement, findConflicts } = useSudokuValidator();
  const { playSound } = useSound();
  const { triggerHaptic } = useHaptics();

  const [mascotMessage, setMascotMessage] = useState<string>('');
  const [showVictory, setShowVictory] = useState(false);
  const [isAnnotationMode, setIsAnnotationMode] = useState(false);

  // Animation pour les conflits
  const conflictShake = useSharedValue(0);

  // Initialisation
  useEffect(() => {
    setMascotMessage("Touche une case vide pour commencer !");
  }, []);

  // Gestion de la sélection de cellule
  const handleCellPress = useCallback((position: CellPosition) => {
    const cell = gameState.grid.cells[position.row][position.col];
    
    if (cell.isFixed) {
      // Cellule fixe : petit rebond
      triggerHaptic('light');
      return;
    }

    selectCell(position);
    playSound('tap');
  }, [gameState.grid, selectCell]);

  // Gestion du long press pour annotations
  const handleCellLongPress = useCallback((position: CellPosition) => {
    const cell = gameState.grid.cells[position.row][position.col];
    
    if (cell.isFixed || cell.value !== null) {
      return;
    }

    setIsAnnotationMode(true);
    selectCell(position);
    triggerHaptic('medium');
    setMascotMessage("Mode annotation : note les candidats possibles.");
  }, [gameState.grid, selectCell]);

  // Placement d'un symbole
  const handleSymbolPress = useCallback((symbol: SymbolValue) => {
    if (!gameState.selectedCell) return;

    const { row, col } = gameState.selectedCell;

    if (isAnnotationMode) {
      // Mode annotation
      toggleAnnotation(gameState.selectedCell, symbol);
      playSound('annotate');
      return;
    }

    // Mode placement normal
    const validation = validatePlacement(
      gameState.grid,
      row,
      col,
      symbol
    );

    if (validation.isValid) {
      // Placement valide
      placeSymbol(gameState.selectedCell, symbol);
      playSound('place');
      triggerHaptic('light');

      // Vérifier si grille complète
      if (isGridComplete(gameState.grid)) {
        handleVictory();
      }
    } else {
      // Conflit détecté
      playSound('conflict');
      triggerHaptic('error');
      
      // Animation shake
      conflictShake.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );

      // Message explicatif
      const conflictType = validation.conflicts[0]?.type;
      const messages = {
        row: "Regarde la ligne, ce symbole y est déjà...",
        column: "Ce symbole est déjà dans cette colonne.",
        region: "Il y en a déjà un dans ce carré.",
      };
      setMascotMessage(messages[conflictType] || "Ce symbole ne peut pas aller ici.");
    }
  }, [gameState, isAnnotationMode, validatePlacement, placeSymbol, toggleAnnotation]);

  // Victoire
  const handleVictory = useCallback(() => {
    playSound('victory');
    triggerHaptic('success');
    setShowVictory(true);

    const stats: SessionStats = {
      gridSize,
      difficulty,
      theme,
      completed: true,
      time: (Date.now() - gameState.startTime.getTime()) / 1000,
      errors: gameState.errorsCount,
      hintsUsed: gameState.hintsUsed,
      annotationsUsed: checkAnnotationsUsed(gameState.grid),
    };

    onComplete(stats);
  }, [gameState, gridSize, difficulty, theme, onComplete]);

  // Demande d'indice
  const handleHint = useCallback(() => {
    const hint = requestHint();
    if (hint) {
      playSound('hint');
      setMascotMessage(hint.message);
      // Appliquer l'effet visuel selon hint.type
    }
  }, [requestHint]);

  // Vérification globale
  const handleCheck = useCallback(() => {
    const result = checkGrid();
    
    if (result.isComplete) {
      handleVictory();
    } else if (result.hasErrors) {
      setMascotMessage("Il y a des erreurs... Vérifie bien chaque ligne et colonne.");
      playSound('check_error');
    } else {
      setMascotMessage("Tout est bon pour l'instant ! Continue.");
      playSound('check_ok');
    }
  }, [checkGrid, handleVictory]);

  // Animation de conflit
  const conflictStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: conflictShake.value }],
  }));

  if (showVictory) {
    return (
      <VictoryScreen
        stats={gameState.stats}
        onReplay={resetGrid}
        onExit={onExit}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="home" onPress={onExit} size={48} />
        <ActionBar
          onCheck={handleCheck}
          onUndo={undo}
          onHint={handleHint}
          onReset={resetGrid}
          canUndo={gameState.history.length > 0}
        />
      </View>

      {/* Mascotte */}
      <MascotBubble
        mascot="felix"
        message={mascotMessage}
        visible={!!mascotMessage}
        position="top"
      />

      {/* Grille */}
      <Animated.View style={[styles.gridContainer, conflictStyle]}>
        <SudokuGrid
          grid={gameState.grid}
          selectedCell={gameState.selectedCell}
          onCellPress={handleCellPress}
          onCellLongPress={handleCellLongPress}
        />
      </Animated.View>

      {/* Sélecteur de symboles ou panneau d'annotation */}
      {isAnnotationMode ? (
        <AnnotationPanel
          symbols={gameState.grid.symbols}
          selectedAnnotations={
            gameState.selectedCell
              ? gameState.grid.cells[gameState.selectedCell.row][gameState.selectedCell.col].annotations
              : []
          }
          onSymbolPress={handleSymbolPress}
          onClose={() => setIsAnnotationMode(false)}
        />
      ) : (
        <SymbolSelector
          symbols={gameState.grid.symbols}
          theme={theme}
          onSymbolPress={handleSymbolPress}
          disabled={!gameState.selectedCell}
        />
      )}
    </View>
  );
};

// Utilitaires
function isGridComplete(grid: SudokuGrid): boolean {
  for (const row of grid.cells) {
    for (const cell of row) {
      if (cell.value === null) return false;
    }
  }
  return true;
}

function checkAnnotationsUsed(grid: SudokuGrid): boolean {
  for (const row of grid.cells) {
    for (const cell of row) {
      if (cell.annotations.length > 0) return true;
    }
  }
  return false;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
```

### Composant SudokuGrid

```typescript
// components/SudokuGrid.tsx

import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { SudokuCell } from './SudokuCell';
import { SudokuRegion } from './SudokuRegion';
import { 
  SudokuGrid as GridType, 
  CellPosition,
  REGION_SIZES 
} from '../types';
import { COLORS } from '@/constants/theme';

interface Props {
  grid: GridType;
  selectedCell: CellPosition | null;
  onCellPress: (position: CellPosition) => void;
  onCellLongPress: (position: CellPosition) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_GRID_SIZE = SCREEN_WIDTH - 48;

export const SudokuGrid: React.FC<Props> = ({
  grid,
  selectedCell,
  onCellPress,
  onCellLongPress,
}) => {
  const cellSize = useMemo(() => {
    return Math.floor(MAX_GRID_SIZE / grid.size);
  }, [grid.size]);

  const regionSize = REGION_SIZES[grid.size];

  // Calculer les cellules surlignées (même ligne/colonne/région)
  const highlightedCells = useMemo(() => {
    if (!selectedCell) return new Set<string>();
    
    const highlighted = new Set<string>();
    const { row, col } = selectedCell;
    
    // Même ligne
    for (let c = 0; c < grid.size; c++) {
      highlighted.add(`${row}-${c}`);
    }
    
    // Même colonne
    for (let r = 0; r < grid.size; r++) {
      highlighted.add(`${r}-${col}`);
    }
    
    // Même région
    const regionRow = Math.floor(row / regionSize.rows) * regionSize.rows;
    const regionCol = Math.floor(col / regionSize.cols) * regionSize.cols;
    
    for (let r = regionRow; r < regionRow + regionSize.rows; r++) {
      for (let c = regionCol; c < regionCol + regionSize.cols; c++) {
        highlighted.add(`${r}-${c}`);
      }
    }
    
    return highlighted;
  }, [selectedCell, grid.size, regionSize]);

  return (
    <View style={[styles.container, { width: cellSize * grid.size }]}>
      {/* Bordures des régions */}
      {Array.from({ length: grid.size / regionSize.rows }).map((_, ri) =>
        Array.from({ length: grid.size / regionSize.cols }).map((_, ci) => (
          <SudokuRegion
            key={`region-${ri}-${ci}`}
            rowIndex={ri}
            colIndex={ci}
            regionSize={regionSize}
            cellSize={cellSize}
          />
        ))
      )}

      {/* Cellules */}
      {grid.cells.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isSelected = 
            selectedCell?.row === rowIndex && 
            selectedCell?.col === colIndex;
          const isHighlighted = highlightedCells.has(`${rowIndex}-${colIndex}`);

          return (
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              size={cellSize}
              isSelected={isSelected}
              isHighlighted={isHighlighted && !isSelected}
              theme={grid.theme}
              onPress={() => onCellPress({ row: rowIndex, col: colIndex })}
              onLongPress={() => onCellLongPress({ row: rowIndex, col: colIndex })}
            />
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
});
```

### Composant SudokuCell

```typescript
// components/SudokuCell.tsx

import React, { memo } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { SudokuCell as CellType, ThemeType, SymbolValue } from '../types';
import { COLORS } from '@/constants/theme';

interface Props {
  cell: CellType;
  size: number;
  isSelected: boolean;
  isHighlighted: boolean;
  theme: ThemeType;
  onPress: () => void;
  onLongPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const SudokuCell: React.FC<Props> = memo(({
  cell,
  size,
  isSelected,
  isHighlighted,
  theme,
  onPress,
  onLongPress,
}) => {
  const scale = useSharedValue(1);
  const conflictOpacity = useSharedValue(0);

  // Animation au tap
  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  // Style animé
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Style de conflit
  const conflictStyle = useAnimatedStyle(() => ({
    opacity: conflictOpacity.value,
  }));

  // Déclencher animation de conflit
  React.useEffect(() => {
    if (cell.hasConflict) {
      conflictOpacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(0.5, { duration: 200 }),
        withTiming(1, { duration: 200 }),
        withTiming(0.5, { duration: 200 })
      );
    } else {
      conflictOpacity.value = withTiming(0);
    }
  }, [cell.hasConflict]);

  // Calculer les styles de fond
  const backgroundColor = (() => {
    if (isSelected) return `${COLORS.primary}30`;
    if (isHighlighted) return `${COLORS.primary}10`;
    if (cell.isFixed) return '#F5F5F5';
    return COLORS.surface;
  })();

  // Affichage du symbole
  const renderSymbol = () => {
    if (cell.value !== null) {
      const isEmoji = typeof cell.value === 'string' && cell.value.length <= 2;
      const fontSize = isEmoji ? size * 0.5 : size * 0.45;
      
      return (
        <Text style={[
          styles.symbol,
          { fontSize },
          cell.isFixed && styles.fixedSymbol,
          cell.hasConflict && styles.conflictSymbol,
        ]}>
          {cell.value}
        </Text>
      );
    }

    // Afficher les annotations
    if (cell.annotations.length > 0) {
      return (
        <View style={styles.annotationsContainer}>
          {cell.annotations.map((annotation, index) => (
            <Text 
              key={index} 
              style={[styles.annotation, { fontSize: size * 0.2 }]}
            >
              {annotation}
            </Text>
          ))}
        </View>
      );
    }

    return null;
  };

  return (
    <AnimatedPressable
      style={[
        styles.container,
        {
          width: size,
          height: size,
          left: cell.col * size,
          top: cell.row * size,
          backgroundColor,
        },
        animatedStyle,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      delayLongPress={500}
    >
      {renderSymbol()}
      
      {/* Overlay de conflit */}
      {cell.hasConflict && (
        <Animated.View style={[styles.conflictOverlay, conflictStyle]} />
      )}

      {/* Bordures */}
      <View style={styles.border} />
    </AnimatedPressable>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  symbol: {
    fontFamily: 'Nunito-Bold',
    color: COLORS.text,
  },
  fixedSymbol: {
    color: COLORS.textSecondary,
  },
  conflictSymbol: {
    color: COLORS.error,
  },
  annotationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  annotation: {
    fontFamily: 'Nunito',
    color: COLORS.textMuted,
    margin: 1,
  },
  border: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
  },
  conflictOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(229, 62, 62, 0.2)',
    borderWidth: 2,
    borderColor: COLORS.error,
  },
});
```

### Composant SymbolSelector

```typescript
// components/SymbolSelector.tsx

import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { SymbolValue, ThemeType } from '../types';
import { COLORS } from '@/constants/theme';

interface Props {
  symbols: SymbolValue[];
  theme: ThemeType;
  onSymbolPress: (symbol: SymbolValue) => void;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const SymbolSelector: React.FC<Props> = ({
  symbols,
  theme,
  onSymbolPress,
  disabled,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.symbolsRow}>
        {symbols.map((symbol, index) => (
          <SymbolButton
            key={index}
            symbol={symbol}
            onPress={() => onSymbolPress(symbol)}
            disabled={disabled}
          />
        ))}
      </View>
    </View>
  );
};

interface SymbolButtonProps {
  symbol: SymbolValue;
  onPress: () => void;
  disabled?: boolean;
}

const SymbolButton: React.FC<SymbolButtonProps> = ({
  symbol,
  onPress,
  disabled,
}) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.9);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.5 : 1,
  }));

  const isEmoji = typeof symbol === 'string' && symbol.length <= 2;

  return (
    <AnimatedPressable
      style={[styles.symbolButton, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Text style={[
        styles.symbolText,
        { fontSize: isEmoji ? 32 : 28 },
      ]}>
        {symbol}
      </Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  symbolsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  symbolButton: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary + '30',
  },
  symbolText: {
    fontFamily: 'Nunito-Bold',
  },
});
```

---

## Hooks Personnalisés

### useSudokuGame

```typescript
// hooks/useSudokuGame.ts

import { useState, useCallback, useMemo } from 'react';
import { useSudokuGenerator } from './useSudokuGenerator';
import { useSudokuValidator } from './useSudokuValidator';
import { useSudokuSolver } from './useSudokuSolver';
import { saveProgress } from '@/services/storage';

import {
  GameState,
  SudokuGrid,
  CellPosition,
  SymbolValue,
  HistoryEntry,
  Hint,
  GridSize,
  ThemeType,
  DifficultyLevel,
} from '../types';

interface UseSudokuGameProps {
  gridSize: GridSize;
  theme: ThemeType;
  difficulty: DifficultyLevel;
}

export function useSudokuGame({ gridSize, theme, difficulty }: UseSudokuGameProps) {
  const { generateGrid } = useSudokuGenerator();
  const { validateGrid, findConflicts } = useSudokuValidator();
  const { getHint, solve } = useSudokuSolver();

  // État initial
  const [gameState, setGameState] = useState<GameState>(() => {
    const grid = generateGrid({ gridSize, theme, difficulty });
    return {
      grid,
      selectedCell: null,
      isAnnotationMode: false,
      history: [],
      historyIndex: -1,
      hintsUsed: 0,
      errorsCount: 0,
      startTime: new Date(),
      isComplete: false,
      isPaused: false,
    };
  });

  // Sélectionner une cellule
  const selectCell = useCallback((position: CellPosition | null) => {
    setGameState(prev => ({
      ...prev,
      selectedCell: position,
    }));
  }, []);

  // Placer un symbole
  const placeSymbol = useCallback((position: CellPosition, symbol: SymbolValue) => {
    setGameState(prev => {
      const cell = prev.grid.cells[position.row][position.col];
      
      // Créer entrée d'historique
      const historyEntry: HistoryEntry = {
        cell: position,
        previousValue: cell.value,
        newValue: symbol,
        previousAnnotations: [...cell.annotations],
        timestamp: new Date(),
      };

      // Mettre à jour la grille
      const newCells = prev.grid.cells.map((row, r) =>
        row.map((c, col) => {
          if (r === position.row && col === position.col) {
            return {
              ...c,
              value: symbol,
              annotations: [], // Effacer annotations
              hasConflict: false,
            };
          }
          return c;
        })
      );

      return {
        ...prev,
        grid: { ...prev.grid, cells: newCells },
        history: [...prev.history.slice(0, prev.historyIndex + 1), historyEntry],
        historyIndex: prev.historyIndex + 1,
        selectedCell: null,
      };
    });
  }, []);

  // Retirer un symbole
  const removeSymbol = useCallback((position: CellPosition) => {
    setGameState(prev => {
      const cell = prev.grid.cells[position.row][position.col];
      
      if (cell.isFixed || cell.value === null) return prev;

      const historyEntry: HistoryEntry = {
        cell: position,
        previousValue: cell.value,
        newValue: null,
        previousAnnotations: cell.annotations,
        timestamp: new Date(),
      };

      const newCells = prev.grid.cells.map((row, r) =>
        row.map((c, col) => {
          if (r === position.row && col === position.col) {
            return { ...c, value: null, hasConflict: false };
          }
          return c;
        })
      );

      return {
        ...prev,
        grid: { ...prev.grid, cells: newCells },
        history: [...prev.history.slice(0, prev.historyIndex + 1), historyEntry],
        historyIndex: prev.historyIndex + 1,
      };
    });
  }, []);

  // Toggle annotation
  const toggleAnnotation = useCallback((position: CellPosition, symbol: SymbolValue) => {
    setGameState(prev => {
      const cell = prev.grid.cells[position.row][position.col];
      
      if (cell.isFixed || cell.value !== null) return prev;

      const newAnnotations = cell.annotations.includes(symbol)
        ? cell.annotations.filter(a => a !== symbol)
        : [...cell.annotations, symbol];

      const newCells = prev.grid.cells.map((row, r) =>
        row.map((c, col) => {
          if (r === position.row && col === position.col) {
            return { ...c, annotations: newAnnotations };
          }
          return c;
        })
      );

      return {
        ...prev,
        grid: { ...prev.grid, cells: newCells },
      };
    });
  }, []);

  // Annuler (Undo)
  const undo = useCallback(() => {
    setGameState(prev => {
      if (prev.historyIndex < 0) return prev;

      const entry = prev.history[prev.historyIndex];
      
      const newCells = prev.grid.cells.map((row, r) =>
        row.map((c, col) => {
          if (r === entry.cell.row && col === entry.cell.col) {
            return {
              ...c,
              value: entry.previousValue,
              annotations: entry.previousAnnotations,
              hasConflict: false,
            };
          }
          return c;
        })
      );

      return {
        ...prev,
        grid: { ...prev.grid, cells: newCells },
        historyIndex: prev.historyIndex - 1,
      };
    });
  }, []);

  // Réinitialiser
  const resetGrid = useCallback(() => {
    const grid = generateGrid({ gridSize, theme, difficulty });
    setGameState({
      grid,
      selectedCell: null,
      isAnnotationMode: false,
      history: [],
      historyIndex: -1,
      hintsUsed: 0,
      errorsCount: 0,
      startTime: new Date(),
      isComplete: false,
      isPaused: false,
    });
  }, [gridSize, theme, difficulty, generateGrid]);

  // Demander un indice
  const requestHint = useCallback((): Hint | null => {
    const hintLevel = (gameState.hintsUsed + 1) as 1 | 2 | 3 | 4 | 5;
    
    if (hintLevel > 5) return null;

    const hint = getHint(gameState.grid, hintLevel);

    setGameState(prev => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
    }));

    return hint;
  }, [gameState.grid, gameState.hintsUsed, getHint]);

  // Vérifier la grille
  const checkGrid = useCallback(() => {
    const validation = validateGrid(gameState.grid);
    const emptyCells = countEmptyCells(gameState.grid);

    if (emptyCells === 0 && validation.isValid) {
      setGameState(prev => ({ ...prev, isComplete: true }));
      return { isComplete: true, hasErrors: false };
    }

    if (!validation.isValid) {
      // Marquer les cellules en conflit
      setGameState(prev => {
        const newCells = prev.grid.cells.map(row =>
          row.map(cell => ({ ...cell, hasConflict: false }))
        );

        for (const conflict of validation.conflicts) {
          newCells[conflict.cell1.row][conflict.cell1.col].hasConflict = true;
          newCells[conflict.cell2.row][conflict.cell2.col].hasConflict = true;
        }

        return {
          ...prev,
          grid: { ...prev.grid, cells: newCells },
          errorsCount: prev.errorsCount + 1,
        };
      });

      return { isComplete: false, hasErrors: true };
    }

    return { isComplete: false, hasErrors: false };
  }, [gameState.grid, validateGrid]);

  // Statistiques de session
  const stats = useMemo(() => ({
    gridSize,
    difficulty,
    theme,
    completed: gameState.isComplete,
    time: gameState.isComplete 
      ? (new Date().getTime() - gameState.startTime.getTime()) / 1000 
      : 0,
    errors: gameState.errorsCount,
    hintsUsed: gameState.hintsUsed,
    annotationsUsed: checkAnnotationsUsed(gameState.grid),
  }), [gameState, gridSize, difficulty, theme]);

  return {
    gameState: { ...gameState, stats },
    selectCell,
    placeSymbol,
    removeSymbol,
    toggleAnnotation,
    undo,
    resetGrid,
    requestHint,
    checkGrid,
  };
}

// Utilitaires
function countEmptyCells(grid: SudokuGrid): number {
  let count = 0;
  for (const row of grid.cells) {
    for (const cell of row) {
      if (cell.value === null) count++;
    }
  }
  return count;
}

function checkAnnotationsUsed(grid: SudokuGrid): boolean {
  for (const row of grid.cells) {
    for (const cell of row) {
      if (cell.annotations.length > 0) return true;
    }
  }
  return false;
}
```

### useSudokuGenerator

```typescript
// hooks/useSudokuGenerator.ts

import { useCallback } from 'react';
import {
  SudokuGrid,
  SudokuCell,
  GridSize,
  ThemeType,
  DifficultyLevel,
  SymbolValue,
  REGION_SIZES,
  THEME_SYMBOLS,
  DIFFICULTY_CONFIGS,
} from '../types';
import { generateId, shuffle } from '@/utils/helpers';

interface GenerateGridProps {
  gridSize: GridSize;
  theme: ThemeType;
  difficulty: DifficultyLevel;
}

export function useSudokuGenerator() {
  
  const generateGrid = useCallback(({
    gridSize,
    theme,
    difficulty,
  }: GenerateGridProps): SudokuGrid => {
    const symbols = THEME_SYMBOLS[theme][gridSize];
    
    // 1. Générer une grille complète valide
    const solution = generateCompleteSolution(gridSize, symbols);
    
    // 2. Créer le puzzle en retirant des cases
    const diffConfig = DIFFICULTY_CONFIGS.find(d => d.level === difficulty)!;
    const [minClues, maxClues] = diffConfig.cluesRange[gridSize];
    const numClues = Math.floor(Math.random() * (maxClues - minClues + 1)) + minClues;
    
    const cells = createPuzzle(solution, numClues, gridSize);
    
    return {
      size: gridSize,
      cells,
      theme,
      symbols,
      difficulty,
      solution,
    };
  }, []);

  return { generateGrid };
}

// Générer une solution complète avec backtracking
function generateCompleteSolution(
  size: GridSize,
  symbols: SymbolValue[]
): SymbolValue[][] {
  const grid: (SymbolValue | null)[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));
  
  fillGrid(grid, symbols, size);
  
  return grid as SymbolValue[][];
}

function fillGrid(
  grid: (SymbolValue | null)[][],
  symbols: SymbolValue[],
  size: GridSize
): boolean {
  const emptyCell = findEmptyCell(grid, size);
  
  if (!emptyCell) {
    return true; // Grille complète
  }
  
  const [row, col] = emptyCell;
  const shuffledSymbols = shuffle([...symbols]);
  
  for (const symbol of shuffledSymbols) {
    if (isValidPlacement(grid, row, col, symbol, size)) {
      grid[row][col] = symbol;
      
      if (fillGrid(grid, symbols, size)) {
        return true;
      }
      
      grid[row][col] = null; // Backtrack
    }
  }
  
  return false;
}

function findEmptyCell(
  grid: (SymbolValue | null)[][],
  size: number
): [number, number] | null {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === null) {
        return [row, col];
      }
    }
  }
  return null;
}

function isValidPlacement(
  grid: (SymbolValue | null)[][],
  row: number,
  col: number,
  symbol: SymbolValue,
  size: GridSize
): boolean {
  // Vérifier la ligne
  for (let c = 0; c < size; c++) {
    if (grid[row][c] === symbol) return false;
  }
  
  // Vérifier la colonne
  for (let r = 0; r < size; r++) {
    if (grid[r][col] === symbol) return false;
  }
  
  // Vérifier la région
  const regionSize = REGION_SIZES[size];
  const regionRow = Math.floor(row / regionSize.rows) * regionSize.rows;
  const regionCol = Math.floor(col / regionSize.cols) * regionSize.cols;
  
  for (let r = regionRow; r < regionRow + regionSize.rows; r++) {
    for (let c = regionCol; c < regionCol + regionSize.cols; c++) {
      if (grid[r][c] === symbol) return false;
    }
  }
  
  return true;
}

// Créer le puzzle en retirant des cases
function createPuzzle(
  solution: SymbolValue[][],
  numClues: number,
  size: GridSize
): SudokuCell[][] {
  const totalCells = size * size;
  const cellsToRemove = totalCells - numClues;
  
  // Créer les indices des cellules et mélanger
  const allPositions: [number, number][] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      allPositions.push([r, c]);
    }
  }
  
  const shuffledPositions = shuffle(allPositions);
  const cellsToHide = new Set<string>();
  
  // Sélectionner les cellules à cacher
  for (let i = 0; i < cellsToRemove && i < shuffledPositions.length; i++) {
    const [r, c] = shuffledPositions[i];
    cellsToHide.add(`${r}-${c}`);
  }
  
  // Créer la grille de cellules
  const regionSize = REGION_SIZES[size];
  
  return solution.map((row, rowIndex) =>
    row.map((value, colIndex) => {
      const isHidden = cellsToHide.has(`${rowIndex}-${colIndex}`);
      const regionRow = Math.floor(rowIndex / regionSize.rows);
      const regionCol = Math.floor(colIndex / regionSize.cols);
      const region = regionRow * (size / regionSize.cols) + regionCol;
      
      return {
        row: rowIndex,
        col: colIndex,
        value: isHidden ? null : value,
        isFixed: !isHidden,
        isSelected: false,
        isHighlighted: false,
        hasConflict: false,
        conflictWith: [],
        annotations: [],
        region,
      };
    })
  );
}
```

---

## Animations

```typescript
// utils/animations.ts

import {
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  SharedValue,
} from 'react-native-reanimated';

export const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
};

// Animation de placement de symbole
export function animatePlace(scale: SharedValue<number>) {
  'worklet';
  scale.value = withSequence(
    withTiming(0.8, { duration: 0 }),
    withSpring(1, SPRING_CONFIG)
  );
}

// Animation de conflit (shake)
export function animateConflict(translateX: SharedValue<number>) {
  'worklet';
  translateX.value = withSequence(
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(0, { duration: 50 })
  );
}

// Animation de sélection
export function animateSelect(scale: SharedValue<number>) {
  'worklet';
  scale.value = withSequence(
    withTiming(1.05, { duration: 100 }),
    withSpring(1, SPRING_CONFIG)
  );
}

// Animation de victoire (cascade)
export function animateVictoryCascade(
  cells: SharedValue<number>[],
  delay: number = 30
) {
  'worklet';
  cells.forEach((cell, index) => {
    cell.value = withDelay(
      index * delay,
      withSequence(
        withTiming(1.2, { duration: 150 }),
        withSpring(1, SPRING_CONFIG)
      )
    );
  });
}

// Pulsation pour indice
export function animatePulse(scale: SharedValue<number>) {
  'worklet';
  scale.value = withSequence(
    withTiming(1.1, { duration: 300 }),
    withTiming(1, { duration: 300 }),
    withTiming(1.1, { duration: 300 }),
    withTiming(1, { duration: 300 })
  );
}
```

---

## Tests

```typescript
// __tests__/useSudokuGenerator.test.ts

import { renderHook } from '@testing-library/react-hooks';
import { useSudokuGenerator } from '../hooks/useSudokuGenerator';

describe('useSudokuGenerator', () => {
  it('génère une grille 4×4 valide', () => {
    const { result } = renderHook(() => useSudokuGenerator());
    const grid = result.current.generateGrid({
      gridSize: 4,
      theme: 'fruits',
      difficulty: 1,
    });

    expect(grid.size).toBe(4);
    expect(grid.cells.length).toBe(4);
    expect(grid.cells[0].length).toBe(4);
    expect(grid.symbols.length).toBe(4);
  });

  it('respecte le nombre de cases pré-remplies', () => {
    const { result } = renderHook(() => useSudokuGenerator());
    const grid = result.current.generateGrid({
      gridSize: 4,
      theme: 'fruits',
      difficulty: 1,  // Facile: 10-12 clues
    });

    let fixedCount = 0;
    for (const row of grid.cells) {
      for (const cell of row) {
        if (cell.isFixed) fixedCount++;
      }
    }

    expect(fixedCount).toBeGreaterThanOrEqual(10);
    expect(fixedCount).toBeLessThanOrEqual(12);
  });

  it('génère une solution complète valide', () => {
    const { result } = renderHook(() => useSudokuGenerator());
    const grid = result.current.generateGrid({
      gridSize: 4,
      theme: 'numbers',
      difficulty: 2,
    });

    // Vérifier que la solution est complète
    for (const row of grid.solution) {
      for (const cell of row) {
        expect(cell).not.toBeNull();
      }
    }

    // Vérifier l'unicité par ligne
    for (const row of grid.solution) {
      const unique = new Set(row);
      expect(unique.size).toBe(4);
    }
  });

  it('génère une grille 9×9 pour le thème numbers', () => {
    const { result } = renderHook(() => useSudokuGenerator());
    const grid = result.current.generateGrid({
      gridSize: 9,
      theme: 'numbers',
      difficulty: 1,
    });

    expect(grid.size).toBe(9);
    expect(grid.symbols).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});

// __tests__/useSudokuValidator.test.ts

import { renderHook } from '@testing-library/react-hooks';
import { useSudokuValidator } from '../hooks/useSudokuValidator';

describe('useSudokuValidator', () => {
  it('détecte un conflit de ligne', () => {
    const { result } = renderHook(() => useSudokuValidator());
    
    // Créer une grille avec conflit
    const mockGrid = createMockGrid(4);
    mockGrid.cells[0][0].value = '🍎';
    mockGrid.cells[0][2].value = '🍎';  // Conflit!

    const validation = result.current.validateGrid(mockGrid);
    
    expect(validation.isValid).toBe(false);
    expect(validation.conflicts.length).toBeGreaterThan(0);
    expect(validation.conflicts[0].type).toBe('row');
  });

  it('détecte un conflit de colonne', () => {
    const { result } = renderHook(() => useSudokuValidator());
    
    const mockGrid = createMockGrid(4);
    mockGrid.cells[0][0].value = '🍎';
    mockGrid.cells[2][0].value = '🍎';  // Conflit!

    const validation = result.current.validateGrid(mockGrid);
    
    expect(validation.isValid).toBe(false);
    expect(validation.conflicts.some(c => c.type === 'column')).toBe(true);
  });

  it('valide une grille correcte', () => {
    const { result } = renderHook(() => useSudokuValidator());
    
    const mockGrid = createMockGrid(4);
    // Placer des valeurs valides
    mockGrid.cells[0][0].value = '🍎';
    mockGrid.cells[0][1].value = '🍌';
    mockGrid.cells[1][0].value = '🍇';
    mockGrid.cells[1][1].value = '🍊';

    const validation = result.current.validateGrid(mockGrid);
    
    expect(validation.isValid).toBe(true);
    expect(validation.conflicts.length).toBe(0);
  });
});

// Helper
function createMockGrid(size: number) {
  return {
    size,
    cells: Array(size).fill(null).map((_, row) =>
      Array(size).fill(null).map((_, col) => ({
        row,
        col,
        value: null,
        isFixed: false,
        isSelected: false,
        isHighlighted: false,
        hasConflict: false,
        conflictWith: [],
        annotations: [],
        region: 0,
      }))
    ),
    theme: 'fruits',
    symbols: ['🍎', '🍌', '🍇', '🍊'],
    difficulty: 1,
    solution: [],
  };
}
```

---

## Configuration

```typescript
// constants/sudokuConfig.ts

export const SUDOKU_CONFIG = {
  // Tailles de cellules
  cellSizes: {
    4: 72,  // Grille 4×4
    6: 56,  // Grille 6×6
    9: 40,  // Grille 9×9
  },
  
  // Durées d'animation
  animations: {
    place: 200,
    conflict: 300,
    select: 100,
    victory: 1500,
  },
  
  // Limites d'indices
  maxHints: 5,
  
  // Temps avant suggestion d'indice (ms)
  hintSuggestionDelay: 180000, // 3 minutes
  
  // Déblocage progressif
  unlockRequirements: {
    '6x6': { gridsCompleted: 5, minSize: 4 },
    '9x9': { gridsCompleted: 5, minSize: 6, minAge: 9 },
  },
};
```

---

*Spécifications Techniques Sudoku Montessori | Application Éducative Montessori iPad*
