# ⚙️ SPECS TECHNIQUES : Logix Grid

## Architecture des Composants

### Structure des Fichiers

```
/src/games/09-logix-grid/
├── index.ts                      # Exports
├── types.ts                      # Types TypeScript
├── components/
│   ├── LogixGame.tsx             # Composant principal
│   ├── LogixGrid.tsx             # Grille de déduction
│   ├── GridCell.tsx              # Cellule (✓/✗/vide)
│   ├── CluesList.tsx             # Liste des indices
│   ├── ClueCard.tsx              # Carte d'indice individuelle
│   ├── CategoryHeader.tsx        # En-têtes de catégorie
│   ├── CategoryItem.tsx          # Élément de catégorie
│   └── SolutionSummary.tsx       # Résumé de la solution
├── hooks/
│   ├── useLogixGame.ts           # Logique de jeu principale
│   ├── useGridState.ts           # État de la grille
│   ├── useClueAnalysis.ts        # Analyse des indices
│   └── useAutoExclusion.ts       # Exclusion automatique
├── data/
│   ├── puzzles.ts                # Catalogue des puzzles
│   ├── categories.ts             # Catégories disponibles
│   └── levels.ts                 # Configuration des niveaux
├── screens/
│   ├── LogixIntroScreen.tsx      # Écran d'introduction
│   ├── LogixGameScreen.tsx       # Écran de jeu
│   └── LogixVictoryScreen.tsx    # Écran de victoire
└── utils/
    ├── validation.ts             # Validation de solution
    └── clueParser.ts             # Parsing des indices
```

---

## Types TypeScript

```typescript
// types.ts

// ============================================
// CATÉGORIES
// ============================================

export interface Category {
  id: string;
  name: string;
  icon: string;
  items: CategoryItem[];
}

export interface CategoryItem {
  id: string;
  name: string;
  emoji: string;
  categoryId: string;
}

// ============================================
// GRILLE
// ============================================

export type CellValue = 'empty' | 'yes' | 'no';

export interface GridCell {
  rowItem: CategoryItem;
  colItem: CategoryItem;
  value: CellValue;
  isLocked: boolean;        // Verrouillé (indice direct)
  isUserSet: boolean;       // Défini par l'utilisateur
}

export interface Grid {
  cells: Map<string, GridCell>;  // Key: `${rowId}-${colId}`
  categories: Category[];
  size: number;                   // Nombre d'éléments par catégorie
}

// ============================================
// INDICES
// ============================================

export type ClueType =
  | 'positive'         // "Marie a le chat"
  | 'negative'         // "Tom n'a pas le chien"
  | 'exclusion'        // "Le chat n'est pas dans la maison rouge"
  | 'conditional'      // "Si Marie a le chat, alors..."
  | 'comparative';     // "Marie a plus de... que Tom"

export interface Clue {
  id: string;
  text: string;
  type: ClueType;
  items: CategoryItem[];  // Items concernés
  isRead: boolean;
  isUsed: boolean;        // L'utilisateur a exploité cet indice
}

// ============================================
// PUZZLE
// ============================================

export interface Puzzle {
  id: string;
  name: string;
  difficulty: 1 | 2 | 3;
  categories: Category[];
  clues: Clue[];
  solution: Solution;
}

export interface Solution {
  associations: Association[];
}

export interface Association {
  items: CategoryItem[];  // Items associés (ex: Marie + Chat + Bleu)
}

// ============================================
// ÉTAT DU JEU
// ============================================

export interface GameState {
  puzzle: Puzzle;
  grid: Grid;
  currentClueId: string | null;
  cellsMarked: number;
  errors: number;
  status: 'playing' | 'checking' | 'complete' | 'error';
  autoExclusionEnabled: boolean;
}

export interface SessionState {
  startTime: Date;
  endTime?: Date;
  cluesRead: number;
  hintsUsed: number;
  stars: 1 | 2 | 3;
}

// ============================================
// CONFIGURATION
// ============================================

export interface GameConfig {
  cellSize: number;
  showClueHighlight: boolean;
  autoExclusion: boolean;
  vibrationOnError: boolean;
}
```

---

## Composant Grille

```typescript
// components/LogixGrid.tsx

import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { GridCell } from './GridCell';
import { CategoryHeader } from './CategoryHeader';
import { Category, Grid, CellValue } from '../types';

interface Props {
  grid: Grid;
  onCellPress: (rowId: string, colId: string) => void;
  highlightedCells?: string[];  // Cellules liées à l'indice actif
  disabled: boolean;
}

export const LogixGrid: React.FC<Props> = ({
  grid,
  onCellPress,
  highlightedCells = [],
  disabled,
}) => {
  const { categories, size } = grid;

  // Pour une grille 2 catégories: simple grille
  // Pour 3+ catégories: grilles multiples (à gérer)

  // Rendu pour 2 catégories (grille simple)
  if (categories.length === 2) {
    return (
      <View style={styles.container}>
        {/* Header des colonnes */}
        <View style={styles.headerRow}>
          <View style={styles.cornerCell} />
          {categories[1].items.map(item => (
            <CategoryHeader
              key={item.id}
              item={item}
              orientation="column"
            />
          ))}
        </View>

        {/* Lignes */}
        {categories[0].items.map(rowItem => (
          <View key={rowItem.id} style={styles.row}>
            <CategoryHeader
              item={rowItem}
              orientation="row"
            />
            {categories[1].items.map(colItem => {
              const cellKey = `${rowItem.id}-${colItem.id}`;
              const cell = grid.cells.get(cellKey)!;
              const isHighlighted = highlightedCells.includes(cellKey);

              return (
                <GridCell
                  key={cellKey}
                  value={cell.value}
                  isLocked={cell.isLocked}
                  isHighlighted={isHighlighted}
                  onPress={() => onCellPress(rowItem.id, colItem.id)}
                  disabled={disabled || cell.isLocked}
                />
              );
            })}
          </View>
        ))}
      </View>
    );
  }

  // Pour 3 catégories: disposition en L
  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.multiGridContainer}>
        {/* Grille 1: Cat1 vs Cat2 */}
        {renderSubGrid(grid, categories[0], categories[1], onCellPress, highlightedCells, disabled)}

        {/* Grille 2: Cat1 vs Cat3 */}
        {renderSubGrid(grid, categories[0], categories[2], onCellPress, highlightedCells, disabled)}

        {/* Grille 3: Cat2 vs Cat3 */}
        {renderSubGrid(grid, categories[1], categories[2], onCellPress, highlightedCells, disabled)}
      </View>
    </ScrollView>
  );
};

function renderSubGrid(
  grid: Grid,
  rowCategory: Category,
  colCategory: Category,
  onCellPress: (rowId: string, colId: string) => void,
  highlightedCells: string[],
  disabled: boolean
) {
  return (
    <View style={styles.subGrid}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.cornerCell} />
        {colCategory.items.map(item => (
          <CategoryHeader key={item.id} item={item} orientation="column" />
        ))}
      </View>

      {/* Rows */}
      {rowCategory.items.map(rowItem => (
        <View key={rowItem.id} style={styles.row}>
          <CategoryHeader item={rowItem} orientation="row" />
          {colCategory.items.map(colItem => {
            const cellKey = `${rowItem.id}-${colItem.id}`;
            const cell = grid.cells.get(cellKey);
            if (!cell) return null;

            return (
              <GridCell
                key={cellKey}
                value={cell.value}
                isLocked={cell.isLocked}
                isHighlighted={highlightedCells.includes(cellKey)}
                onPress={() => onCellPress(rowItem.id, colItem.id)}
                disabled={disabled || cell.isLocked}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollContainer: {
    flex: 1,
  },
  multiGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    padding: 16,
  },
  subGrid: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
  },
  headerRow: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
  },
  cornerCell: {
    width: 60,
    height: 60,
  },
});
```

---

## Composant Cellule

```typescript
// components/GridCell.tsx

import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { CellValue } from '../types';

interface Props {
  value: CellValue;
  isLocked: boolean;
  isHighlighted: boolean;
  onPress: () => void;
  disabled: boolean;
}

export const GridCell: React.FC<Props> = ({
  value,
  isLocked,
  isHighlighted,
  onPress,
  disabled,
}) => {
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.9),
      withSpring(1)
    );
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getCellContent = () => {
    switch (value) {
      case 'yes':
        return <Text style={styles.yes}>✓</Text>;
      case 'no':
        return <Text style={styles.no}>✗</Text>;
      default:
        return null;
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityLabel={`Cellule ${value === 'yes' ? 'oui' : value === 'no' ? 'non' : 'vide'}`}
      accessibilityHint="Appuyer pour changer la valeur"
    >
      <Animated.View
        style={[
          styles.cell,
          value === 'yes' && styles.yesCell,
          value === 'no' && styles.noCell,
          isLocked && styles.locked,
          isHighlighted && styles.highlighted,
          animatedStyle,
        ]}
      >
        {getCellContent()}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  yesCell: {
    backgroundColor: '#E8F5E9',
  },
  noCell: {
    backgroundColor: '#FFEBEE',
  },
  locked: {
    backgroundColor: '#F5F5F5',
  },
  highlighted: {
    borderColor: '#5B8DEE',
    borderWidth: 2,
  },
  yes: {
    fontSize: 24,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  no: {
    fontSize: 24,
    color: '#F44336',
    fontWeight: 'bold',
  },
});
```

---

## Hook Principal

```typescript
// hooks/useLogixGame.ts

import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  GameState,
  SessionState,
  Puzzle,
  Grid,
  CellValue,
  CategoryItem,
} from '../types';
import { validateSolution, isCellValid } from '../utils/validation';
import { createInitialGrid } from '../utils/gridUtils';

interface UseLogixGameProps {
  puzzle: Puzzle;
  autoExclusion?: boolean;
}

export function useLogixGame({ puzzle, autoExclusion = false }: UseLogixGameProps) {
  // État du jeu
  const [gameState, setGameState] = useState<GameState>(() => ({
    puzzle,
    grid: createInitialGrid(puzzle.categories),
    currentClueId: null,
    cellsMarked: 0,
    errors: 0,
    status: 'playing',
    autoExclusionEnabled: autoExclusion,
  }));

  // État de la session
  const [sessionState, setSessionState] = useState<SessionState>({
    startTime: new Date(),
    cluesRead: 0,
    hintsUsed: 0,
    stars: 3,
  });

  // Toggle une cellule (vide → oui → non → vide)
  const toggleCell = useCallback((rowId: string, colId: string) => {
    setGameState(prev => {
      const cellKey = `${rowId}-${colId}`;
      const cell = prev.grid.cells.get(cellKey);
      if (!cell || cell.isLocked) return prev;

      // Cycle: empty → yes → no → empty
      const nextValue: CellValue =
        cell.value === 'empty' ? 'yes' :
        cell.value === 'yes' ? 'no' : 'empty';

      const newCells = new Map(prev.grid.cells);
      newCells.set(cellKey, {
        ...cell,
        value: nextValue,
        isUserSet: true,
      });

      // Auto-exclusion si activée et valeur = yes
      if (prev.autoExclusionEnabled && nextValue === 'yes') {
        applyAutoExclusion(newCells, rowId, colId, prev.puzzle.categories);
      }

      return {
        ...prev,
        grid: { ...prev.grid, cells: newCells },
        cellsMarked: prev.cellsMarked + 1,
      };
    });
  }, []);

  // Définir directement une valeur
  const setCellValue = useCallback((rowId: string, colId: string, value: CellValue) => {
    setGameState(prev => {
      const cellKey = `${rowId}-${colId}`;
      const cell = prev.grid.cells.get(cellKey);
      if (!cell || cell.isLocked) return prev;

      const newCells = new Map(prev.grid.cells);
      newCells.set(cellKey, {
        ...cell,
        value,
        isUserSet: true,
      });

      // Auto-exclusion
      if (prev.autoExclusionEnabled && value === 'yes') {
        applyAutoExclusion(newCells, rowId, colId, prev.puzzle.categories);
      }

      return {
        ...prev,
        grid: { ...prev.grid, cells: newCells },
        cellsMarked: prev.cellsMarked + 1,
      };
    });
  }, []);

  // Sélectionner un indice
  const selectClue = useCallback((clueId: string) => {
    setGameState(prev => ({
      ...prev,
      currentClueId: clueId,
    }));

    // Marquer comme lu
    setSessionState(prev => ({
      ...prev,
      cluesRead: prev.cluesRead + 1,
    }));
  }, []);

  // Vérifier la solution
  const checkSolution = useCallback(() => {
    setGameState(prev => {
      const isValid = validateSolution(prev.grid, prev.puzzle.solution);

      if (isValid) {
        return {
          ...prev,
          status: 'complete',
        };
      } else {
        return {
          ...prev,
          errors: prev.errors + 1,
          status: 'error',
        };
      }
    });
  }, []);

  // Demander un indice
  const requestHint = useCallback(() => {
    setGameState(prev => {
      // Trouver une cellule qui devrait être ✓ mais ne l'est pas
      for (const association of prev.puzzle.solution.associations) {
        const [item1, item2] = association.items;
        const cellKey = `${item1.id}-${item2.id}`;
        const cell = prev.grid.cells.get(cellKey);

        if (cell && cell.value !== 'yes') {
          const newCells = new Map(prev.grid.cells);
          newCells.set(cellKey, {
            ...cell,
            value: 'yes',
            isLocked: true,
          });

          // Appliquer exclusion
          if (prev.autoExclusionEnabled) {
            applyAutoExclusion(newCells, item1.id, item2.id, prev.puzzle.categories);
          }

          return {
            ...prev,
            grid: { ...prev.grid, cells: newCells },
          };
        }
      }

      return prev;
    });

    setSessionState(prev => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
      stars: Math.max(1, prev.stars - 1) as 1 | 2 | 3,
    }));
  }, []);

  // Reset
  const resetPuzzle = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      grid: createInitialGrid(prev.puzzle.categories),
      currentClueId: null,
      cellsMarked: 0,
      errors: 0,
      status: 'playing',
    }));
  }, []);

  return {
    gameState,
    sessionState,
    toggleCell,
    setCellValue,
    selectClue,
    checkSolution,
    requestHint,
    resetPuzzle,
    isComplete: gameState.status === 'complete',
  };
}

// Auto-exclusion: quand on met ✓, mettre ✗ sur le reste de la ligne/colonne
function applyAutoExclusion(
  cells: Map<string, any>,
  yesRowId: string,
  yesColId: string,
  categories: any[]
) {
  // Marquer ✗ sur toute la ligne (même rowId, autres colId)
  // et toute la colonne (même colId, autres rowId)

  cells.forEach((cell, key) => {
    const [rowId, colId] = key.split('-');

    // Même ligne, autre colonne
    if (rowId === yesRowId && colId !== yesColId && cell.value === 'empty') {
      cells.set(key, { ...cell, value: 'no' });
    }

    // Même colonne, autre ligne
    if (colId === yesColId && rowId !== yesRowId && cell.value === 'empty') {
      cells.set(key, { ...cell, value: 'no' });
    }
  });
}
```

---

## Validation

```typescript
// utils/validation.ts

import { Grid, Solution, CellValue } from '../types';

/**
 * Vérifier si la grille correspond à la solution
 */
export function validateSolution(grid: Grid, solution: Solution): boolean {
  for (const association of solution.associations) {
    for (let i = 0; i < association.items.length - 1; i++) {
      for (let j = i + 1; j < association.items.length; j++) {
        const item1 = association.items[i];
        const item2 = association.items[j];

        const cellKey = `${item1.id}-${item2.id}`;
        const cell = grid.cells.get(cellKey);

        // La cellule doit être marquée "yes"
        if (!cell || cell.value !== 'yes') {
          return false;
        }
      }
    }
  }

  // Vérifier qu'il n'y a pas de ✓ supplémentaires incorrects
  // (chaque ligne/colonne doit avoir exactement 1 ✓)
  const categories = grid.categories;

  for (const cat1 of categories) {
    for (const cat2 of categories) {
      if (cat1.id >= cat2.id) continue;

      for (const item1 of cat1.items) {
        let yesCount = 0;
        for (const item2 of cat2.items) {
          const cellKey = `${item1.id}-${item2.id}`;
          const cell = grid.cells.get(cellKey);
          if (cell?.value === 'yes') yesCount++;
        }
        if (yesCount !== 1) return false;
      }
    }
  }

  return true;
}

/**
 * Vérifier si une cellule est valide (pas de conflit)
 */
export function isCellValid(
  grid: Grid,
  rowId: string,
  colId: string,
  value: CellValue
): boolean {
  if (value !== 'yes') return true;

  // Vérifier qu'il n'y a pas déjà un ✓ sur la même ligne ou colonne
  let hasYesInRow = false;
  let hasYesInCol = false;

  grid.cells.forEach((cell, key) => {
    const [r, c] = key.split('-');
    if (r === rowId && c !== colId && cell.value === 'yes') {
      hasYesInRow = true;
    }
    if (c === colId && r !== rowId && cell.value === 'yes') {
      hasYesInCol = true;
    }
  });

  return !hasYesInRow && !hasYesInCol;
}
```

---

## Accessibilité

```typescript
// utils/accessibility.ts

export function getCellAccessibilityLabel(
  rowName: string,
  colName: string,
  value: CellValue
): string {
  const valueText =
    value === 'yes' ? 'oui' :
    value === 'no' ? 'non' : 'vide';

  return `${rowName} et ${colName}: ${valueText}`;
}

export function getClueAccessibilityLabel(clue: Clue): string {
  return `Indice: ${clue.text}${clue.isUsed ? ', déjà utilisé' : ''}`;
}

export function announceAutoExclusion(count: number): string {
  return `${count} cases automatiquement marquées non`;
}
```

---

*Spécifications Techniques Logix Grid | Application Éducative Montessori iPad*
