/**
 * Logix Grid Engine
 *
 * Logique principale pour le jeu de grilles logiques
 */

import type {
  LogixPuzzle,
  LogixGameState,
  GridCell,
  CellState,
  LogixResult,
  ClueHint,
  Category,
  CategoryItem,
} from '../types';
import { DEFAULT_LOGIX_CONFIG } from '../types';

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Crée une nouvelle partie
 */
export function createGame(puzzle: LogixPuzzle): LogixGameState {
  // Créer la grille vide
  const grid = createEmptyGrid(puzzle.categories);

  return {
    phase: 'playing',
    puzzle,
    grid,
    usedClueIds: [],
    hintsUsed: 0,
    timeElapsed: 0,
    actionCount: 0,
    selectedCell: null,
    activeHint: null,
  };
}

/**
 * Crée une grille vide pour les catégories données
 */
function createEmptyGrid(categories: Category[]): GridCell[] {
  const grid: GridCell[] = [];

  // Pour chaque paire de catégories différentes
  for (let i = 0; i < categories.length; i++) {
    for (let j = i + 1; j < categories.length; j++) {
      const cat1 = categories[i];
      const cat2 = categories[j];

      // Créer une cellule pour chaque combinaison d'items
      for (const item1 of cat1.items) {
        for (const item2 of cat2.items) {
          grid.push({
            rowItemId: item1.id,
            colItemId: item2.id,
            state: 'empty',
            isPlayerMarked: false,
          });
        }
      }
    }
  }

  return grid;
}

// ============================================================================
// CELL ACTIONS
// ============================================================================

/**
 * Change l'état d'une cellule
 */
export function setCellState(
  state: LogixGameState,
  rowItemId: string,
  colItemId: string,
  cellState: CellState
): LogixGameState {
  const newGrid = state.grid.map((cell) => {
    // Chercher la cellule (dans les deux sens car la grille est symétrique)
    if (
      (cell.rowItemId === rowItemId && cell.colItemId === colItemId) ||
      (cell.rowItemId === colItemId && cell.colItemId === rowItemId)
    ) {
      return {
        ...cell,
        state: cellState,
        isPlayerMarked: true,
      };
    }
    return cell;
  });

  return {
    ...state,
    grid: newGrid,
    actionCount: state.actionCount + 1,
  };
}

/**
 * Alterne l'état d'une cellule (empty -> yes -> no -> empty)
 */
export function toggleCellState(
  state: LogixGameState,
  rowItemId: string,
  colItemId: string
): LogixGameState {
  const cell = findCell(state.grid, rowItemId, colItemId);
  if (!cell) return state;

  const nextState: Record<CellState, CellState> = {
    empty: 'yes',
    yes: 'no',
    no: 'empty',
  };

  return setCellState(state, rowItemId, colItemId, nextState[cell.state]);
}

/**
 * Trouve une cellule dans la grille
 */
function findCell(
  grid: GridCell[],
  rowItemId: string,
  colItemId: string
): GridCell | undefined {
  return grid.find(
    (cell) =>
      (cell.rowItemId === rowItemId && cell.colItemId === colItemId) ||
      (cell.rowItemId === colItemId && cell.colItemId === rowItemId)
  );
}

/**
 * Sélectionne une cellule
 */
export function selectCell(
  state: LogixGameState,
  rowItemId: string | null,
  colItemId: string | null
): LogixGameState {
  if (!rowItemId || !colItemId) {
    return { ...state, selectedCell: null };
  }
  return {
    ...state,
    selectedCell: { rowItemId, colItemId },
  };
}

// ============================================================================
// CLUE ACTIONS
// ============================================================================

/**
 * Marque un indice comme utilisé
 */
export function markClueUsed(state: LogixGameState, clueId: string): LogixGameState {
  if (state.usedClueIds.includes(clueId)) {
    return state;
  }

  return {
    ...state,
    usedClueIds: [...state.usedClueIds, clueId],
  };
}

/**
 * Demande un indice
 */
export function requestHint(state: LogixGameState): LogixGameState {
  if (state.hintsUsed >= state.puzzle.hintsAvailable) {
    return state;
  }

  // Trouver un indice non utilisé
  const unusedClue = state.puzzle.clues.find(
    (clue) => !state.usedClueIds.includes(clue.id)
  );

  if (!unusedClue) {
    return state;
  }

  // Créer l'indice visuel
  const hint: ClueHint = {
    clueId: unusedClue.id,
    highlightedCells: getClueRelatedCells(state, unusedClue.data),
  };

  return {
    ...state,
    hintsUsed: state.hintsUsed + 1,
    activeHint: hint,
    usedClueIds: [...state.usedClueIds, unusedClue.id],
  };
}

/**
 * Trouve les cellules liées à un indice
 */
function getClueRelatedCells(
  state: LogixGameState,
  clueData: { subject1: string; subject2?: string }
): Array<{ rowItemId: string; colItemId: string }> {
  const cells: Array<{ rowItemId: string; colItemId: string }> = [];

  if (clueData.subject1 && clueData.subject2) {
    cells.push({
      rowItemId: clueData.subject1,
      colItemId: clueData.subject2,
    });
  }

  return cells;
}

/**
 * Efface l'indice actif
 */
export function clearHint(state: LogixGameState): LogixGameState {
  return {
    ...state,
    activeHint: null,
  };
}

// ============================================================================
// TIMER
// ============================================================================

/**
 * Incrémente le temps
 */
export function tickTime(state: LogixGameState): LogixGameState {
  return {
    ...state,
    timeElapsed: state.timeElapsed + 1,
  };
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Vérifie si le puzzle est résolu correctement
 */
export function isPuzzleSolved(state: LogixGameState): boolean {
  const { grid, puzzle } = state;

  // Vérifier chaque association dans la solution
  for (const [catId, associations] of Object.entries(puzzle.solution)) {
    for (const [itemId, associatedItems] of Object.entries(associations)) {
      for (const associatedId of associatedItems) {
        // Trouver la cellule correspondante
        const cell = findCell(grid, itemId, associatedId);
        if (!cell || cell.state !== 'yes') {
          return false;
        }
      }
    }
  }

  // Vérifier qu'il n'y a pas de "oui" en trop
  const yesCells = grid.filter((cell) => cell.state === 'yes');

  // Compter le nombre attendu de "oui"
  let expectedYesCount = 0;
  for (const associations of Object.values(puzzle.solution)) {
    for (const associatedItems of Object.values(associations)) {
      expectedYesCount += associatedItems.length;
    }
  }

  return yesCells.length === expectedYesCount;
}

/**
 * Obtient les erreurs dans la grille actuelle
 */
export function getGridErrors(
  state: LogixGameState
): Array<{ rowItemId: string; colItemId: string }> {
  const errors: Array<{ rowItemId: string; colItemId: string }> = [];
  const { grid, puzzle } = state;

  for (const cell of grid) {
    if (cell.state === 'yes') {
      // Vérifier si c'est une association correcte
      const isCorrect = isCorrectAssociation(
        puzzle.solution,
        cell.rowItemId,
        cell.colItemId
      );
      if (!isCorrect) {
        errors.push({ rowItemId: cell.rowItemId, colItemId: cell.colItemId });
      }
    }
  }

  return errors;
}

/**
 * Vérifie si une association est correcte
 */
function isCorrectAssociation(
  solution: Record<string, Record<string, string[]>>,
  itemId1: string,
  itemId2: string
): boolean {
  for (const associations of Object.values(solution)) {
    // Vérifier dans un sens
    if (associations[itemId1]?.includes(itemId2)) {
      return true;
    }
    // Vérifier dans l'autre sens
    if (associations[itemId2]?.includes(itemId1)) {
      return true;
    }
  }
  return false;
}

// ============================================================================
// AUTO-COMPLETION
// ============================================================================

/**
 * Applique la logique d'exclusion automatique
 * Quand une ligne a un "oui", marque les autres cellules de cette ligne comme "non"
 */
export function applyAutoExclusion(state: LogixGameState): LogixGameState {
  let newGrid = [...state.grid];
  let changed = true;

  // Répéter jusqu'à ce qu'il n'y ait plus de changements
  while (changed) {
    changed = false;

    // Grouper les cellules par item
    const itemGroups = groupCellsByItem(newGrid, state.puzzle.categories);

    for (const [itemId, cells] of Object.entries(itemGroups)) {
      // Si un item a un "oui" dans un groupe de catégorie
      const yesCells = cells.filter((c) => c.state === 'yes');

      if (yesCells.length === 1) {
        // Marquer les autres cellules du même groupe comme "non"
        const yesCell = yesCells[0];
        const sameCategoryItems = getSameCategoryItems(
          yesCell.colItemId,
          state.puzzle.categories
        );

        for (const otherItemId of sameCategoryItems) {
          if (otherItemId !== yesCell.colItemId) {
            const cellIndex = newGrid.findIndex(
              (c) =>
                (c.rowItemId === itemId && c.colItemId === otherItemId) ||
                (c.rowItemId === otherItemId && c.colItemId === itemId)
            );
            if (cellIndex !== -1 && newGrid[cellIndex].state === 'empty') {
              newGrid[cellIndex] = { ...newGrid[cellIndex], state: 'no' };
              changed = true;
            }
          }
        }
      }
    }
  }

  return {
    ...state,
    grid: newGrid,
  };
}

/**
 * Groupe les cellules par item
 */
function groupCellsByItem(
  grid: GridCell[],
  categories: Category[]
): Record<string, GridCell[]> {
  const groups: Record<string, GridCell[]> = {};

  for (const category of categories) {
    for (const item of category.items) {
      groups[item.id] = grid.filter(
        (cell) => cell.rowItemId === item.id || cell.colItemId === item.id
      );
    }
  }

  return groups;
}

/**
 * Obtient les items de la même catégorie
 */
function getSameCategoryItems(itemId: string, categories: Category[]): string[] {
  for (const category of categories) {
    const found = category.items.find((item) => item.id === itemId);
    if (found) {
      return category.items.map((item) => item.id);
    }
  }
  return [];
}

// ============================================================================
// RESULT
// ============================================================================

/**
 * Calcule le résultat de la partie
 */
export function calculateResult(state: LogixGameState): LogixResult {
  const { puzzle, timeElapsed, actionCount, hintsUsed } = state;

  // Calculer les étoiles basées sur le temps
  const timeRatio = timeElapsed / puzzle.idealTime;
  let stars: 1 | 2 | 3;
  if (timeRatio <= DEFAULT_LOGIX_CONFIG.timeBonus[3]) {
    stars = 3;
  } else if (timeRatio <= DEFAULT_LOGIX_CONFIG.timeBonus[2]) {
    stars = 2;
  } else {
    stars = 1;
  }

  // Calculer le score
  const baseScore = stars * DEFAULT_LOGIX_CONFIG.scorePerStar;
  const hintPenalty = hintsUsed * DEFAULT_LOGIX_CONFIG.hintPenalty;
  const score = Math.max(0, baseScore - hintPenalty);

  // Vérifier si parfait
  const isPerfect = hintsUsed === 0 && stars === 3;

  return {
    puzzleId: puzzle.id,
    timeSeconds: timeElapsed,
    actionCount,
    hintsUsed,
    stars,
    score,
    isPerfect,
  };
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Obtient l'état d'une cellule
 */
export function getCellState(
  grid: GridCell[],
  rowItemId: string,
  colItemId: string
): CellState {
  const cell = findCell(grid, rowItemId, colItemId);
  return cell?.state ?? 'empty';
}

/**
 * Compte les cellules d'un certain état
 */
export function countCellsByState(grid: GridCell[], cellState: CellState): number {
  return grid.filter((cell) => cell.state === cellState).length;
}

/**
 * Vérifie si le joueur est bloqué (pas d'action depuis longtemps)
 */
export function isPlayerStuck(state: LogixGameState, stuckThreshold: number = 60): boolean {
  // Simple heuristique: si le temps écoulé est élevé par rapport aux actions
  if (state.actionCount === 0 && state.timeElapsed > stuckThreshold) {
    return true;
  }
  return state.timeElapsed > state.actionCount * 30 + stuckThreshold;
}
