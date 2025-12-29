/**
 * Crossword Engine
 *
 * Logique principale pour le jeu de mots croisés
 */

import type {
  CrosswordLevel,
  CrosswordGameState,
  CrosswordCell,
  CrosswordWord,
  CrosswordResult,
  WordDirection,
  LetterStatus,
} from '../types';
import { DEFAULT_CROSSWORD_CONFIG } from '../types';

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Crée une nouvelle partie
 */
export function createGame(level: CrosswordLevel): CrosswordGameState {
  // Créer la grille
  const grid = createGrid(level);

  // Compter les lettres totales
  let totalLetters = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (!cell.isBlocked) {
        totalLetters++;
      }
    }
  }

  // Trouver le premier mot (numéro 1) pour sélection par défaut
  const firstWord = level.words.find(w => w.number === 1) || level.words[0];
  const initialSelectedWordId = firstWord?.id || null;
  const initialSelectedCell = firstWord
    ? { row: firstWord.row, col: firstWord.col }
    : null;
  const initialDirection = firstWord?.direction || 'horizontal';

  return {
    phase: 'playing',
    level,
    grid,
    words: level.words,
    selectedWordId: initialSelectedWordId,
    selectedCell: initialSelectedCell,
    inputDirection: initialDirection,
    hintsUsed: 0,
    timeElapsed: 0,
    correctLetters: 0,
    totalLetters,
    completedWordIds: [],
  };
}

/**
 * Crée la grille de mots croisés
 */
function createGrid(level: CrosswordLevel): CrosswordCell[][] {
  const { rows, cols } = level.gridSize;
  const grid: CrosswordCell[][] = [];

  // Initialiser toutes les cellules comme bloquées
  for (let r = 0; r < rows; r++) {
    const row: CrosswordCell[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        letter: '',
        userLetter: '',
        isBlocked: true,
        wordIds: [],
        isRevealed: false,
        letterStatus: 'neutral',
      });
    }
    grid.push(row);
  }

  // Placer les mots
  for (const word of level.words) {
    placeWord(grid, word);
  }

  return grid;
}

/**
 * Place un mot dans la grille
 */
function placeWord(grid: CrosswordCell[][], word: CrosswordWord): void {
  const { row, col, word: text, direction, number } = word;

  for (let i = 0; i < text.length; i++) {
    const r = direction === 'horizontal' ? row : row + i;
    const c = direction === 'horizontal' ? col + i : col;

    if (grid[r] && grid[r][c]) {
      const cell = grid[r][c];
      cell.letter = text[i].toUpperCase();
      cell.isBlocked = false;
      cell.wordIds.push(word.id);

      // Ajouter le numéro si c'est la première lettre
      if (i === 0) {
        cell.wordNumber = number;
      }
    }
  }
}

// ============================================================================
// SUTOM COLOR STATUS
// ============================================================================

/**
 * Calcule le statut couleur SUTOM pour une cellule
 * - 'correct': Lettre correcte ET bien placée (vert)
 * - 'misplaced': Lettre présente dans le mot mais mal placée (orange)
 * - 'absent': Lettre absente du mot (rouge)
 * - 'neutral': Pas de lettre entrée
 */
function calculateLetterStatus(
  cell: CrosswordCell,
  grid: CrosswordCell[][],
  words: CrosswordWord[]
): LetterStatus {
  // Si pas de lettre entrée, statut neutre
  if (!cell.userLetter) {
    return 'neutral';
  }

  // Si la lettre est correcte et bien placée
  if (cell.userLetter === cell.letter) {
    return 'correct';
  }

  // Vérifier si la lettre existe dans les mots qui passent par cette cellule
  const userLetter = cell.userLetter.toUpperCase();

  for (const wordId of cell.wordIds) {
    const word = words.find(w => w.id === wordId);
    if (word) {
      // Vérifier si la lettre existe quelque part dans ce mot
      if (word.word.toUpperCase().includes(userLetter)) {
        return 'misplaced';
      }
    }
  }

  // La lettre n'existe dans aucun des mots de cette cellule
  return 'absent';
}

/**
 * Met à jour les statuts SUTOM pour toute la grille
 */
function updateAllLetterStatuses(
  grid: CrosswordCell[][],
  words: CrosswordWord[]
): CrosswordCell[][] {
  return grid.map((row) =>
    row.map((cell) => ({
      ...cell,
      letterStatus: cell.isBlocked ? 'neutral' : calculateLetterStatus(cell, grid, words),
    }))
  );
}

// ============================================================================
// CELL ACTIONS
// ============================================================================

/**
 * Sélectionne une cellule
 */
export function selectCell(
  state: CrosswordGameState,
  row: number,
  col: number
): CrosswordGameState {
  const cell = state.grid[row]?.[col];
  if (!cell || cell.isBlocked) {
    return state;
  }

  // Déterminer le mot à sélectionner
  let selectedWordId = state.selectedWordId;
  let inputDirection = state.inputDirection;

  if (cell.wordIds.length > 0) {
    // Si on clique sur la même cellule, changer de direction
    if (
      state.selectedCell?.row === row &&
      state.selectedCell?.col === col &&
      cell.wordIds.length > 1
    ) {
      inputDirection = inputDirection === 'horizontal' ? 'vertical' : 'horizontal';
    }

    // Trouver le mot correspondant à la direction
    const wordInDirection = state.words.find(
      (w) =>
        cell.wordIds.includes(w.id) && w.direction === inputDirection
    );

    if (wordInDirection) {
      selectedWordId = wordInDirection.id;
    } else {
      // Prendre le premier mot disponible
      selectedWordId = cell.wordIds[0];
      const word = state.words.find((w) => w.id === selectedWordId);
      if (word) {
        inputDirection = word.direction;
      }
    }
  }

  return {
    ...state,
    selectedCell: { row, col },
    selectedWordId,
    inputDirection,
  };
}

/**
 * Entre une lettre dans la cellule sélectionnée
 */
export function enterLetter(
  state: CrosswordGameState,
  letter: string
): CrosswordGameState {
  if (!state.selectedCell) return state;

  const { row, col } = state.selectedCell;
  const cell = state.grid[row]?.[col];
  if (!cell || cell.isBlocked) return state;

  // Créer une nouvelle grille avec la lettre
  let newGrid = state.grid.map((r, ri) =>
    r.map((c, ci) =>
      ri === row && ci === col
        ? { ...c, userLetter: letter.toUpperCase() }
        : c
    )
  );

  // Mettre à jour les statuts SUTOM pour toute la grille
  newGrid = updateAllLetterStatuses(newGrid, state.words);

  // Calculer les lettres correctes
  let correctLetters = 0;
  for (const gridRow of newGrid) {
    for (const gridCell of gridRow) {
      if (!gridCell.isBlocked && gridCell.userLetter === gridCell.letter) {
        correctLetters++;
      }
    }
  }

  // Vérifier les mots complétés
  const completedWordIds = findCompletedWords(newGrid, state.words);

  // Avancer à la prochaine cellule
  const nextCell = getNextCell(newGrid, row, col, state.inputDirection);

  // Vérifier si le jeu est terminé
  const isComplete = correctLetters === state.totalLetters;

  return {
    ...state,
    grid: newGrid,
    correctLetters,
    completedWordIds,
    selectedCell: nextCell,
    phase: isComplete ? 'victory' : state.phase,
  };
}

/**
 * Efface la lettre dans la cellule sélectionnée
 */
export function deleteLetter(state: CrosswordGameState): CrosswordGameState {
  if (!state.selectedCell) return state;

  const { row, col } = state.selectedCell;
  const cell = state.grid[row]?.[col];
  if (!cell || cell.isBlocked || cell.isRevealed) return state;

  // Si la cellule actuelle est vide, reculer
  if (!cell.userLetter) {
    const prevCell = getPreviousCell(
      state.grid,
      row,
      col,
      state.inputDirection
    );
    if (prevCell) {
      return {
        ...state,
        selectedCell: prevCell,
      };
    }
    return state;
  }

  // Effacer la lettre et réinitialiser le statut
  let newGrid = state.grid.map((r, ri) =>
    r.map((c, ci) =>
      ri === row && ci === col ? { ...c, userLetter: '', letterStatus: 'neutral' as LetterStatus } : c
    )
  );

  // Mettre à jour les statuts SUTOM pour toute la grille
  newGrid = updateAllLetterStatuses(newGrid, state.words);

  // Recalculer les lettres correctes
  let correctLetters = 0;
  for (const gridRow of newGrid) {
    for (const gridCell of gridRow) {
      if (!gridCell.isBlocked && gridCell.userLetter === gridCell.letter) {
        correctLetters++;
      }
    }
  }

  const completedWordIds = findCompletedWords(newGrid, state.words);

  return {
    ...state,
    grid: newGrid,
    correctLetters,
    completedWordIds,
  };
}

/**
 * Sélectionne un mot par son ID
 */
export function selectWord(
  state: CrosswordGameState,
  wordId: string
): CrosswordGameState {
  const word = state.words.find((w) => w.id === wordId);
  if (!word) return state;

  return {
    ...state,
    selectedWordId: wordId,
    selectedCell: { row: word.row, col: word.col },
    inputDirection: word.direction,
  };
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Trouve les mots complétés
 */
function findCompletedWords(
  grid: CrosswordCell[][],
  words: CrosswordWord[]
): string[] {
  const completed: string[] = [];

  for (const word of words) {
    let isComplete = true;

    for (let i = 0; i < word.word.length; i++) {
      const r = word.direction === 'horizontal' ? word.row : word.row + i;
      const c = word.direction === 'horizontal' ? word.col + i : word.col;

      const cell = grid[r]?.[c];
      if (!cell || cell.userLetter !== word.word[i].toUpperCase()) {
        isComplete = false;
        break;
      }
    }

    if (isComplete) {
      completed.push(word.id);
    }
  }

  return completed;
}

/**
 * Obtient la cellule suivante
 */
function getNextCell(
  grid: CrosswordCell[][],
  row: number,
  col: number,
  direction: WordDirection
): { row: number; col: number } | null {
  const nextRow = direction === 'horizontal' ? row : row + 1;
  const nextCol = direction === 'horizontal' ? col + 1 : col;

  const nextCell = grid[nextRow]?.[nextCol];
  if (nextCell && !nextCell.isBlocked) {
    return { row: nextRow, col: nextCol };
  }

  return { row, col };
}

/**
 * Obtient la cellule précédente
 */
function getPreviousCell(
  grid: CrosswordCell[][],
  row: number,
  col: number,
  direction: WordDirection
): { row: number; col: number } | null {
  const prevRow = direction === 'horizontal' ? row : row - 1;
  const prevCol = direction === 'horizontal' ? col - 1 : col;

  const prevCell = grid[prevRow]?.[prevCol];
  if (prevCell && !prevCell.isBlocked) {
    return { row: prevRow, col: prevCol };
  }

  return null;
}

// ============================================================================
// HINTS
// ============================================================================

/**
 * Révèle une lettre
 */
export function revealLetter(state: CrosswordGameState): CrosswordGameState {
  if (!state.selectedCell) return state;
  if (state.hintsUsed >= state.level.hintsAvailable) return state;

  const { row, col } = state.selectedCell;
  const cell = state.grid[row]?.[col];
  if (!cell || cell.isBlocked || cell.userLetter === cell.letter) {
    return state;
  }

  let newGrid = state.grid.map((r, ri) =>
    r.map((c, ci) =>
      ri === row && ci === col
        ? { ...c, userLetter: c.letter, isRevealed: true, letterStatus: 'correct' as LetterStatus }
        : c
    )
  );

  // Mettre à jour les statuts SUTOM pour toute la grille
  newGrid = updateAllLetterStatuses(newGrid, state.words);

  // Recalculer
  let correctLetters = 0;
  for (const gridRow of newGrid) {
    for (const gridCell of gridRow) {
      if (!gridCell.isBlocked && gridCell.userLetter === gridCell.letter) {
        correctLetters++;
      }
    }
  }

  const completedWordIds = findCompletedWords(newGrid, state.words);
  const isComplete = correctLetters === state.totalLetters;

  return {
    ...state,
    grid: newGrid,
    hintsUsed: state.hintsUsed + 1,
    correctLetters,
    completedWordIds,
    phase: isComplete ? 'victory' : state.phase,
  };
}

/**
 * Révèle un mot entier
 */
export function revealWord(state: CrosswordGameState): CrosswordGameState {
  if (!state.selectedWordId) return state;
  if (state.hintsUsed >= state.level.hintsAvailable) return state;

  const word = state.words.find((w) => w.id === state.selectedWordId);
  if (!word) return state;

  let newGrid = state.grid.map((r) => r.map((c) => ({ ...c })));

  for (let i = 0; i < word.word.length; i++) {
    const r = word.direction === 'horizontal' ? word.row : word.row + i;
    const c = word.direction === 'horizontal' ? word.col + i : word.col;

    if (newGrid[r]?.[c]) {
      newGrid[r][c].userLetter = word.word[i].toUpperCase();
      newGrid[r][c].isRevealed = true;
      newGrid[r][c].letterStatus = 'correct';
    }
  }

  // Mettre à jour les statuts SUTOM pour toute la grille
  newGrid = updateAllLetterStatuses(newGrid, state.words);

  // Recalculer
  let correctLetters = 0;
  for (const gridRow of newGrid) {
    for (const gridCell of gridRow) {
      if (!gridCell.isBlocked && gridCell.userLetter === gridCell.letter) {
        correctLetters++;
      }
    }
  }

  const completedWordIds = findCompletedWords(newGrid, state.words);
  const isComplete = correctLetters === state.totalLetters;

  return {
    ...state,
    grid: newGrid,
    hintsUsed: state.hintsUsed + 1,
    correctLetters,
    completedWordIds,
    phase: isComplete ? 'victory' : state.phase,
  };
}

// ============================================================================
// TIMER
// ============================================================================

/**
 * Incrémente le temps
 */
export function tickTime(state: CrosswordGameState): CrosswordGameState {
  return {
    ...state,
    timeElapsed: state.timeElapsed + 1,
  };
}

// ============================================================================
// RESULT
// ============================================================================

/**
 * Calcule le résultat de la partie
 */
export function calculateResult(state: CrosswordGameState): CrosswordResult {
  const { level, timeElapsed, completedWordIds, hintsUsed } = state;

  // Calculer les étoiles basées sur le temps
  const timeRatio = timeElapsed / level.idealTime;
  let stars: 1 | 2 | 3;
  if (timeRatio <= DEFAULT_CROSSWORD_CONFIG.timeBonus[3]) {
    stars = 3;
  } else if (timeRatio <= DEFAULT_CROSSWORD_CONFIG.timeBonus[2]) {
    stars = 2;
  } else {
    stars = 1;
  }

  // Calculer le score
  const wordScore = completedWordIds.length * DEFAULT_CROSSWORD_CONFIG.scorePerWord;
  const starBonus = stars * DEFAULT_CROSSWORD_CONFIG.scorePerStar;
  const hintPenalty = hintsUsed * DEFAULT_CROSSWORD_CONFIG.hintPenalty;
  const score = Math.max(0, wordScore + starBonus - hintPenalty);

  // Vérifier si parfait
  const isPerfect = hintsUsed === 0 && stars === 3;

  return {
    levelId: level.id,
    timeSeconds: timeElapsed,
    wordsFound: completedWordIds.length,
    totalWords: level.words.length,
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
 * Vérifie si une lettre est correcte
 */
export function isLetterCorrect(
  grid: CrosswordCell[][],
  row: number,
  col: number
): boolean {
  const cell = grid[row]?.[col];
  return cell ? cell.userLetter === cell.letter : false;
}

/**
 * Obtient le pourcentage de complétion
 */
export function getCompletionPercentage(state: CrosswordGameState): number {
  if (state.totalLetters === 0) return 0;
  return (state.correctLetters / state.totalLetters) * 100;
}
