/**
 * Sudoku Engine
 *
 * Logique centrale du jeu Sudoku
 * Coordonne la generation, validation et scoring
 */

import type {
  SudokuGrid,
  SudokuConfig,
  SudokuValue,
  SudokuSize,
  SudokuDifficulty,
} from '../types';
import { generateSudoku } from './generator';
import {
  validatePlacement,
  isGridComplete,
  checkAgainstSolution,
  getPossibleValues,
  findEasiestEmptyCell,
  markConflicts,
} from './validation';

// ============================================================================
// CREATION DU JEU
// ============================================================================

/**
 * Cree un nouveau jeu de Sudoku
 */
export function createGame(config: SudokuConfig): SudokuGrid {
  return generateSudoku(config);
}

/**
 * Place une valeur dans une cellule
 */
export function placeValue(
  grid: SudokuGrid,
  row: number,
  col: number,
  value: SudokuValue
): SudokuGrid {
  const cell = grid.cells[row][col];

  // Ne pas modifier les cellules fixes
  if (cell.isFixed) {
    return grid;
  }

  // Creer une nouvelle grille avec la valeur placee
  const newCells = grid.cells.map((rowCells, r) =>
    rowCells.map((c, colIdx) => {
      if (r === row && colIdx === col) {
        return { ...c, value, hasConflict: false };
      }
      return { ...c };
    })
  );

  const newGrid: SudokuGrid = {
    ...grid,
    cells: newCells,
  };

  // Marquer les conflits
  return markConflicts(newGrid);
}

/**
 * Efface une valeur d'une cellule
 */
export function clearValue(
  grid: SudokuGrid,
  row: number,
  col: number
): SudokuGrid {
  return placeValue(grid, row, col, null);
}

// ============================================================================
// VERIFICATION
// ============================================================================

/**
 * Verifie si le placement est correct par rapport a la solution
 */
export function isCorrectPlacement(
  grid: SudokuGrid,
  row: number,
  col: number,
  value: SudokuValue
): boolean {
  if (!value) return true;
  return grid.solution[row][col] === value;
}

/**
 * Verifie si le jeu est termine et correct
 */
export function isVictory(grid: SudokuGrid): boolean {
  return isGridComplete(grid) && checkAgainstSolution(grid);
}

/**
 * Compte le nombre de cellules remplies correctement
 */
export function countCorrectCells(grid: SudokuGrid): number {
  let count = 0;
  for (let row = 0; row < grid.size; row++) {
    for (let col = 0; col < grid.size; col++) {
      const cell = grid.cells[row][col];
      if (cell.value && cell.value === grid.solution[row][col]) {
        count++;
      }
    }
  }
  return count;
}

/**
 * Compte le nombre de cellules restantes a remplir
 */
export function countEmptyCells(grid: SudokuGrid): number {
  let count = 0;
  for (let row = 0; row < grid.size; row++) {
    for (let col = 0; col < grid.size; col++) {
      if (!grid.cells[row][col].value) {
        count++;
      }
    }
  }
  return count;
}

// ============================================================================
// INDICES
// ============================================================================

/**
 * Obtient un indice pour la cellule la plus facile
 */
export function getHint(grid: SudokuGrid): {
  row: number;
  col: number;
  value: SudokuValue;
} | null {
  const easiest = findEasiestEmptyCell(grid);
  if (!easiest) return null;

  return {
    row: easiest.row,
    col: easiest.col,
    value: grid.solution[easiest.row][easiest.col],
  };
}

/**
 * Revele une cellule avec la bonne valeur
 */
export function revealCell(
  grid: SudokuGrid,
  row: number,
  col: number
): SudokuGrid {
  const correctValue = grid.solution[row][col];
  return placeValue(grid, row, col, correctValue);
}

// ============================================================================
// SCORE ET RESULTATS
// ============================================================================

export interface SudokuResult {
  isVictory: boolean;
  timeSeconds: number;
  hintsUsed: number;
  errorsCount: number;
  score: number;
  stars: 0 | 1 | 2 | 3;
}

/**
 * Calcule le resultat final
 */
export function calculateResult(
  grid: SudokuGrid,
  timeSeconds: number,
  hintsUsed: number,
  errorsCount: number,
  difficulty: SudokuDifficulty
): SudokuResult {
  const victory = isVictory(grid);

  // Score de base
  let score = victory ? 100 : 0;

  // Penalites
  score -= hintsUsed * 5;
  score -= errorsCount * 2;

  // Bonus temps (selon difficulte)
  const timeBonus = calculateTimeBonus(timeSeconds, difficulty);
  score += timeBonus;

  score = Math.max(0, Math.min(100, score));

  // Etoiles
  const stars = calculateStars(victory, timeSeconds, hintsUsed, errorsCount, difficulty);

  return {
    isVictory: victory,
    timeSeconds,
    hintsUsed,
    errorsCount,
    score,
    stars,
  };
}

/**
 * Calcule le bonus de temps
 */
function calculateTimeBonus(timeSeconds: number, difficulty: SudokuDifficulty): number {
  const idealTimes: Record<SudokuDifficulty, number> = {
    beginner: 180,
    easy: 300,
    medium: 480,
    hard: 600,
  };

  const idealTime = idealTimes[difficulty];
  if (timeSeconds <= idealTime * 0.5) return 20;
  if (timeSeconds <= idealTime * 0.75) return 10;
  if (timeSeconds <= idealTime) return 5;
  return 0;
}

/**
 * Calcule le nombre d'etoiles
 */
export function calculateStars(
  victory: boolean,
  timeSeconds: number,
  hintsUsed: number,
  errorsCount: number,
  difficulty: SudokuDifficulty
): 0 | 1 | 2 | 3 {
  if (!victory) return 0;

  const idealTimes: Record<SudokuDifficulty, number> = {
    beginner: 180,
    easy: 300,
    medium: 480,
    hard: 600,
  };

  const idealTime = idealTimes[difficulty];

  // 3 etoiles: pas d'indices, pas d'erreurs, temps < ideal
  if (hintsUsed === 0 && errorsCount === 0 && timeSeconds <= idealTime) {
    return 3;
  }

  // 2 etoiles: peu d'indices (<=2), peu d'erreurs (<=3)
  if (hintsUsed <= 2 && errorsCount <= 3) {
    return 2;
  }

  // 1 etoile: termine
  return 1;
}

// ============================================================================
// RE-EXPORTS
// ============================================================================

export {
  validatePlacement,
  isGridComplete,
  checkAgainstSolution,
  getPossibleValues,
  findEasiestEmptyCell,
  markConflicts,
} from './validation';

export { generateSudoku } from './generator';
