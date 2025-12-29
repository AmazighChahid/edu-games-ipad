# ⚙️ SPECS TECHNIQUES : Mots Croisés

## Architecture des Composants

### Structure des Fichiers

```
/src/games/10-mots-croises/
├── index.ts                      # Exports
├── types.ts                      # Types TypeScript
├── components/
│   ├── CrosswordGame.tsx         # Composant principal
│   ├── CrosswordGrid.tsx         # Grille de mots croisés
│   ├── GridCell.tsx              # Cellule individuelle
│   ├── CluesList.tsx             # Liste des définitions
│   ├── ClueItem.tsx              # Définition individuelle
│   ├── Keyboard.tsx              # Clavier personnalisé
│   ├── KeyboardKey.tsx           # Touche individuelle
│   ├── ColorIndicator.tsx        # Indicateur de couleur SUTOM
│   └── WordProgress.tsx          # Progression du mot en cours
├── hooks/
│   ├── useCrosswordGame.ts       # Logique de jeu principale
│   ├── useGridNavigation.ts      # Navigation dans la grille
│   ├── useLetterInput.ts         # Saisie des lettres
│   └── useSutomFeedback.ts       # Système de couleurs
├── data/
│   ├── grids.ts                  # Grilles pré-définies
│   ├── themes.ts                 # Thèmes de vocabulaire
│   └── levels.ts                 # Configuration des niveaux
├── screens/
│   ├── CrosswordIntroScreen.tsx  # Écran d'introduction
│   ├── CrosswordGameScreen.tsx   # Écran de jeu
│   └── CrosswordVictoryScreen.tsx # Écran de victoire
└── utils/
    ├── validation.ts             # Validation des mots
    └── gridGenerator.ts          # Génération de grilles
```

---

## Types TypeScript

```typescript
// types.ts

// ============================================
// GRILLE
// ============================================

export interface GridCell {
  row: number;
  col: number;
  letter: string | null;         // Lettre saisie
  correctLetter: string;         // Lettre attendue
  isBlocked: boolean;            // Case noire
  wordIds: string[];             // IDs des mots passant par cette case
  color: CellColor;              // Couleur SUTOM
}

export type CellColor = 'neutral' | 'green' | 'orange' | 'red';

export interface Grid {
  width: number;
  height: number;
  cells: GridCell[][];
}

// ============================================
// MOTS ET DÉFINITIONS
// ============================================

export interface Word {
  id: string;
  text: string;                  // Le mot correct
  clue: string;                  // La définition
  emoji?: string;                // Emoji illustratif
  startRow: number;
  startCol: number;
  direction: 'horizontal' | 'vertical';
  length: number;
  theme: ThemeType;
  difficulty: 1 | 2 | 3;
}

export type ThemeType =
  | 'animals'
  | 'fruits'
  | 'colors'
  | 'school'
  | 'house'
  | 'nature'
  | 'jobs';

// ============================================
// ÉTAT DU JEU
// ============================================

export interface GameState {
  grid: Grid;
  words: Word[];
  currentWordId: string | null;
  currentCellIndex: number;
  solvedWords: string[];
  attempts: Map<string, number>;  // Essais par mot
  status: 'playing' | 'complete';
  sutomMode: SutomMode;
}

export type SutomMode = 'off' | 'manual' | 'auto';

export interface SessionState {
  startTime: Date;
  endTime?: Date;
  wordsFound: number;
  totalAttempts: number;
  hintsUsed: number;
  stars: 1 | 2 | 3;
}

// ============================================
// CONFIGURATION
// ============================================

export interface GameConfig {
  cellSize: number;
  fontSize: number;
  maxAttempts: number;           // Pour mode SUTOM
  showEmojis: boolean;
  sutomMode: SutomMode;
}
```

---

## Composant Grille

```typescript
// components/CrosswordGrid.tsx

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { GridCell } from './GridCell';
import { Grid, Word } from '../types';

interface Props {
  grid: Grid;
  currentWordId: string | null;
  currentCellIndex: number;
  words: Word[];
  onCellPress: (row: number, col: number) => void;
}

export const CrosswordGrid: React.FC<Props> = ({
  grid,
  currentWordId,
  currentCellIndex,
  words,
  onCellPress,
}) => {
  // Cellules du mot actuel
  const currentWordCells = useMemo(() => {
    if (!currentWordId) return new Set<string>();

    const word = words.find(w => w.id === currentWordId);
    if (!word) return new Set<string>();

    const cells = new Set<string>();
    for (let i = 0; i < word.length; i++) {
      const row = word.direction === 'vertical' ? word.startRow + i : word.startRow;
      const col = word.direction === 'horizontal' ? word.startCol + i : word.startCol;
      cells.add(`${row}-${col}`);
    }
    return cells;
  }, [currentWordId, words]);

  // Position de la cellule active
  const activeCell = useMemo(() => {
    if (!currentWordId) return null;

    const word = words.find(w => w.id === currentWordId);
    if (!word) return null;

    const row = word.direction === 'vertical'
      ? word.startRow + currentCellIndex
      : word.startRow;
    const col = word.direction === 'horizontal'
      ? word.startCol + currentCellIndex
      : word.startCol;

    return `${row}-${col}`;
  }, [currentWordId, currentCellIndex, words]);

  return (
    <View style={styles.container}>
      {grid.cells.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => {
            const cellKey = `${rowIndex}-${colIndex}`;
            const isInCurrentWord = currentWordCells.has(cellKey);
            const isActive = cellKey === activeCell;

            return (
              <GridCell
                key={cellKey}
                cell={cell}
                isActive={isActive}
                isInCurrentWord={isInCurrentWord}
                onPress={() => onCellPress(rowIndex, colIndex)}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
  },
});
```

---

## Composant Cellule avec Couleur SUTOM

```typescript
// components/GridCell.tsx

import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { GridCell as CellType, CellColor } from '../types';

interface Props {
  cell: CellType;
  isActive: boolean;
  isInCurrentWord: boolean;
  onPress: () => void;
}

const COLOR_MAP: Record<CellColor, string> = {
  neutral: '#FFFFFF',
  green: '#4CAF50',
  orange: '#FF9800',
  red: '#F44336',
};

export const GridCell: React.FC<Props> = ({
  cell,
  isActive,
  isInCurrentWord,
  onPress,
}) => {
  if (cell.isBlocked) {
    return <View style={[styles.cell, styles.blocked]} />;
  }

  const backgroundColor = cell.letter
    ? COLOR_MAP[cell.color]
    : '#FFFFFF';

  const textColor = cell.color !== 'neutral' ? '#FFFFFF' : '#333333';

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={cell.letter || 'Cellule vide'}
      accessibilityHint="Appuyer pour sélectionner"
    >
      <Animated.View
        style={[
          styles.cell,
          { backgroundColor },
          isActive && styles.active,
          isInCurrentWord && styles.inWord,
        ]}
      >
        {/* Numéro de début de mot */}
        {cell.wordIds.length > 0 && (
          <Text style={styles.number}>
            {/* Afficher le numéro si c'est le début d'un mot */}
          </Text>
        )}

        {/* Lettre */}
        <Text style={[styles.letter, { color: textColor }]}>
          {cell.letter?.toUpperCase() || ''}
        </Text>

        {/* Indicateur de couleur (icône pour daltonisme) */}
        {cell.color !== 'neutral' && (
          <View style={styles.colorIndicator}>
            <Text style={styles.colorIcon}>
              {cell.color === 'green' ? '✓' :
               cell.color === 'orange' ? '↔' : '✗'}
            </Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

const CELL_SIZE = 44;

const styles = StyleSheet.create({
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  blocked: {
    backgroundColor: '#333333',
  },
  active: {
    borderColor: '#5B8DEE',
    borderWidth: 3,
  },
  inWord: {
    backgroundColor: '#E3F2FD',
  },
  letter: {
    fontSize: 24,
    fontFamily: 'NunitoSans-Bold',
  },
  number: {
    position: 'absolute',
    top: 2,
    left: 2,
    fontSize: 10,
    color: '#666666',
  },
  colorIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  colorIcon: {
    fontSize: 10,
    color: '#FFFFFF',
  },
});
```

---

## Clavier Personnalisé

```typescript
// components/Keyboard.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { KeyboardKey } from './KeyboardKey';
import { CellColor } from '../types';

interface Props {
  onKeyPress: (letter: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  letterColors: Map<string, CellColor>;  // Couleurs des lettres utilisées
  disabled: boolean;
}

const ROWS = [
  ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
  ['⌫', 'W', 'X', 'C', 'V', 'B', 'N', '✓'],
];

export const Keyboard: React.FC<Props> = ({
  onKeyPress,
  onBackspace,
  onSubmit,
  letterColors,
  disabled,
}) => {
  const handlePress = (key: string) => {
    if (key === '⌫') {
      onBackspace();
    } else if (key === '✓') {
      onSubmit();
    } else {
      onKeyPress(key);
    }
  };

  return (
    <View style={styles.container}>
      {ROWS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map(key => (
            <KeyboardKey
              key={key}
              letter={key}
              color={letterColors.get(key) || 'neutral'}
              onPress={() => handlePress(key)}
              disabled={disabled}
              isAction={key === '⌫' || key === '✓'}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
});
```

---

## Hook Principal

```typescript
// hooks/useCrosswordGame.ts

import { useState, useCallback, useMemo } from 'react';
import {
  GameState,
  SessionState,
  Grid,
  Word,
  CellColor,
} from '../types';
import { validateWord, applyLetterColors } from '../utils/validation';

interface UseCrosswordGameProps {
  grid: Grid;
  words: Word[];
  sutomMode: 'off' | 'manual' | 'auto';
}

export function useCrosswordGame({
  grid: initialGrid,
  words,
  sutomMode,
}: UseCrosswordGameProps) {
  // État du jeu
  const [gameState, setGameState] = useState<GameState>({
    grid: initialGrid,
    words,
    currentWordId: null,
    currentCellIndex: 0,
    solvedWords: [],
    attempts: new Map(),
    status: 'playing',
    sutomMode,
  });

  // État de la session
  const [sessionState, setSessionState] = useState<SessionState>({
    startTime: new Date(),
    wordsFound: 0,
    totalAttempts: 0,
    hintsUsed: 0,
    stars: 3,
  });

  // Couleurs des touches du clavier
  const letterColors = useMemo(() => {
    const colors = new Map<string, CellColor>();
    // Collecter les couleurs de toutes les cellules
    gameState.grid.cells.flat().forEach(cell => {
      if (cell.letter && cell.color !== 'neutral') {
        const existing = colors.get(cell.letter);
        // Priorité: vert > orange > rouge
        if (!existing ||
            cell.color === 'green' ||
            (cell.color === 'orange' && existing !== 'green')) {
          colors.set(cell.letter, cell.color);
        }
      }
    });
    return colors;
  }, [gameState.grid]);

  // Sélectionner un mot
  const selectWord = useCallback((wordId: string) => {
    setGameState(prev => ({
      ...prev,
      currentWordId: wordId,
      currentCellIndex: 0,
    }));
  }, []);

  // Sélectionner une cellule
  const selectCell = useCallback((row: number, col: number) => {
    const cell = gameState.grid.cells[row][col];
    if (cell.isBlocked) return;

    // Trouver le mot associé
    if (cell.wordIds.length > 0) {
      const wordId = cell.wordIds[0];
      const word = gameState.words.find(w => w.id === wordId);

      if (word) {
        const cellIndex = word.direction === 'horizontal'
          ? col - word.startCol
          : row - word.startRow;

        setGameState(prev => ({
          ...prev,
          currentWordId: wordId,
          currentCellIndex: cellIndex,
        }));
      }
    }
  }, [gameState.grid, gameState.words]);

  // Taper une lettre
  const inputLetter = useCallback((letter: string) => {
    setGameState(prev => {
      if (!prev.currentWordId) return prev;

      const word = prev.words.find(w => w.id === prev.currentWordId);
      if (!word) return prev;

      // Calculer la position dans la grille
      const row = word.direction === 'vertical'
        ? word.startRow + prev.currentCellIndex
        : word.startRow;
      const col = word.direction === 'horizontal'
        ? word.startCol + prev.currentCellIndex
        : word.startCol;

      // Mettre à jour la grille
      const newGrid = { ...prev.grid };
      newGrid.cells = prev.grid.cells.map((r, ri) =>
        r.map((c, ci) => {
          if (ri === row && ci === col) {
            return { ...c, letter: letter.toUpperCase() };
          }
          return c;
        })
      );

      // Avancer au caractère suivant
      const nextIndex = Math.min(prev.currentCellIndex + 1, word.length - 1);

      return {
        ...prev,
        grid: newGrid,
        currentCellIndex: nextIndex,
      };
    });
  }, []);

  // Effacer une lettre
  const backspace = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentWordId) return prev;

      const word = prev.words.find(w => w.id === prev.currentWordId);
      if (!word) return prev;

      // Position à effacer (actuelle ou précédente)
      const indexToDelete = prev.currentCellIndex > 0 &&
        !getCellLetter(prev.grid, word, prev.currentCellIndex)
          ? prev.currentCellIndex - 1
          : prev.currentCellIndex;

      const row = word.direction === 'vertical'
        ? word.startRow + indexToDelete
        : word.startRow;
      const col = word.direction === 'horizontal'
        ? word.startCol + indexToDelete
        : word.startCol;

      // Effacer la lettre
      const newGrid = { ...prev.grid };
      newGrid.cells = prev.grid.cells.map((r, ri) =>
        r.map((c, ci) => {
          if (ri === row && ci === col) {
            return { ...c, letter: null, color: 'neutral' };
          }
          return c;
        })
      );

      return {
        ...prev,
        grid: newGrid,
        currentCellIndex: Math.max(0, indexToDelete),
      };
    });
  }, []);

  // Soumettre le mot
  const submitWord = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentWordId) return prev;

      const word = prev.words.find(w => w.id === prev.currentWordId);
      if (!word) return prev;

      // Récupérer le mot saisi
      const enteredWord = getEnteredWord(prev.grid, word);

      // Vérifier si correct
      const isCorrect = enteredWord.toUpperCase() === word.text.toUpperCase();

      if (isCorrect) {
        // Marquer toutes les cellules en vert
        const newGrid = applyLetterColors(prev.grid, word, 'all_green');

        const newSolvedWords = [...prev.solvedWords, prev.currentWordId];

        return {
          ...prev,
          grid: newGrid,
          solvedWords: newSolvedWords,
          status: newSolvedWords.length === prev.words.length ? 'complete' : 'playing',
        };
      } else {
        // Mode SUTOM: appliquer les couleurs
        if (prev.sutomMode !== 'off') {
          const newGrid = applyLetterColors(prev.grid, word, 'sutom');
          return {
            ...prev,
            grid: newGrid,
            attempts: new Map(prev.attempts).set(
              prev.currentWordId,
              (prev.attempts.get(prev.currentWordId) || 0) + 1
            ),
          };
        }

        return prev;
      }
    });

    setSessionState(prev => ({
      ...prev,
      totalAttempts: prev.totalAttempts + 1,
    }));
  }, []);

  // Toggle couleur manuelle
  const toggleCellColor = useCallback((row: number, col: number) => {
    if (gameState.sutomMode !== 'manual') return;

    setGameState(prev => {
      const cell = prev.grid.cells[row][col];
      if (!cell.letter) return prev;

      // Cycle: neutral → green → orange → red → neutral
      const colors: CellColor[] = ['neutral', 'green', 'orange', 'red'];
      const currentIndex = colors.indexOf(cell.color);
      const nextColor = colors[(currentIndex + 1) % colors.length];

      const newGrid = { ...prev.grid };
      newGrid.cells = prev.grid.cells.map((r, ri) =>
        r.map((c, ci) => {
          if (ri === row && ci === col) {
            return { ...c, color: nextColor };
          }
          return c;
        })
      );

      return { ...prev, grid: newGrid };
    });
  }, [gameState.sutomMode]);

  return {
    gameState,
    sessionState,
    letterColors,
    selectWord,
    selectCell,
    inputLetter,
    backspace,
    submitWord,
    toggleCellColor,
    isComplete: gameState.status === 'complete',
  };
}

// Helpers
function getCellLetter(grid: Grid, word: Word, index: number): string | null {
  const row = word.direction === 'vertical' ? word.startRow + index : word.startRow;
  const col = word.direction === 'horizontal' ? word.startCol + index : word.startCol;
  return grid.cells[row][col].letter;
}

function getEnteredWord(grid: Grid, word: Word): string {
  let result = '';
  for (let i = 0; i < word.length; i++) {
    const row = word.direction === 'vertical' ? word.startRow + i : word.startRow;
    const col = word.direction === 'horizontal' ? word.startCol + i : word.startCol;
    result += grid.cells[row][col].letter || '';
  }
  return result;
}
```

---

## Validation et Couleurs SUTOM

```typescript
// utils/validation.ts

import { Grid, Word, CellColor } from '../types';

/**
 * Appliquer les couleurs SUTOM à un mot
 */
export function applyLetterColors(
  grid: Grid,
  word: Word,
  mode: 'sutom' | 'all_green'
): Grid {
  const correctWord = word.text.toUpperCase();
  const newGrid = { ...grid, cells: grid.cells.map(r => [...r]) };

  for (let i = 0; i < word.length; i++) {
    const row = word.direction === 'vertical' ? word.startRow + i : word.startRow;
    const col = word.direction === 'horizontal' ? word.startCol + i : word.startCol;
    const cell = newGrid.cells[row][col];

    if (!cell.letter) continue;

    if (mode === 'all_green') {
      newGrid.cells[row][col] = { ...cell, color: 'green' };
    } else {
      // Mode SUTOM
      const enteredLetter = cell.letter.toUpperCase();
      const correctLetter = correctWord[i];

      if (enteredLetter === correctLetter) {
        // Bonne lettre, bonne position
        newGrid.cells[row][col] = { ...cell, color: 'green' };
      } else if (correctWord.includes(enteredLetter)) {
        // Lettre présente mais mal placée
        newGrid.cells[row][col] = { ...cell, color: 'orange' };
      } else {
        // Lettre absente
        newGrid.cells[row][col] = { ...cell, color: 'red' };
      }
    }
  }

  return newGrid;
}

/**
 * Vérifier si un mot est complet et correct
 */
export function validateWord(grid: Grid, word: Word): boolean {
  for (let i = 0; i < word.length; i++) {
    const row = word.direction === 'vertical' ? word.startRow + i : word.startRow;
    const col = word.direction === 'horizontal' ? word.startCol + i : word.startCol;
    const cell = grid.cells[row][col];

    if (!cell.letter) return false;
    if (cell.letter.toUpperCase() !== word.text[i].toUpperCase()) return false;
  }

  return true;
}
```

---

## Accessibilité

```typescript
// utils/accessibility.ts

export function getCellAccessibilityLabel(
  letter: string | null,
  color: CellColor,
  position: { row: number; col: number }
): string {
  const letterText = letter || 'vide';
  const colorText =
    color === 'green' ? ', correct' :
    color === 'orange' ? ', mal placé' :
    color === 'red' ? ', absent' : '';

  return `Ligne ${position.row + 1}, colonne ${position.col + 1}: ${letterText}${colorText}`;
}

export function getClueAccessibilityLabel(
  clue: string,
  isSolved: boolean,
  wordLength: number
): string {
  const status = isSolved ? 'Résolu' : `${wordLength} lettres`;
  return `${clue}. ${status}`;
}

export function announceColor(color: CellColor): string {
  switch (color) {
    case 'green': return 'Lettre correcte et bien placée';
    case 'orange': return 'Lettre présente mais mal placée';
    case 'red': return 'Lettre absente du mot';
    default: return '';
  }
}
```

---

*Spécifications Techniques Mots Croisés | Application Éducative Montessori iPad*
