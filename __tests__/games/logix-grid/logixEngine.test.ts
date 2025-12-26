/**
 * Tests for Logix Grid Engine
 */

import {
  createGame,
  setCellState,
  toggleCellState,
  selectCell,
  markClueUsed,
  requestHint,
  clearHint,
  tickTime,
  isPuzzleSolved,
  getGridErrors,
  applyAutoExclusion,
  calculateResult,
  getCellState,
  countCellsByState,
  isPlayerStuck,
} from '../../../src/games/logix-grid/logic/logixEngine';
import type { LogixPuzzle, Category, Clue } from '../../../src/games/logix-grid/types';

describe('logixEngine', () => {
  const category1: Category = {
    id: 'animals',
    name: 'Animaux',
    items: [
      { id: 'cat', name: 'Chat', emoji: '🐱' },
      { id: 'dog', name: 'Chien', emoji: '🐶' },
    ],
  };

  const category2: Category = {
    id: 'colors',
    name: 'Couleurs',
    items: [
      { id: 'red', name: 'Rouge', emoji: '🔴' },
      { id: 'blue', name: 'Bleu', emoji: '🔵' },
    ],
  };

  const clue1: Clue = {
    id: 'clue-1',
    text: 'Le chat est rouge',
    type: 'positive',
    isUsed: false,
    data: {
      subject1: 'cat',
      category1: 'animals',
      subject2: 'red',
      category2: 'colors',
    },
  };

  const testPuzzle: LogixPuzzle = {
    id: 'test-puzzle',
    name: 'Test Puzzle',
    description: 'A test puzzle for unit tests',
    difficulty: 1,
    categories: [category1, category2],
    clues: [clue1],
    solution: {
      animals: {
        cat: ['red'],
        dog: ['blue'],
      },
    },
    hintsAvailable: 3,
    idealTime: 120,
  };

  describe('createGame', () => {
    it('should create game with empty grid', () => {
      const state = createGame(testPuzzle);

      expect(state.phase).toBe('playing');
      expect(state.grid.length).toBeGreaterThan(0);
      expect(state.hintsUsed).toBe(0);
      expect(state.timeElapsed).toBe(0);
    });

    it('should initialize all cells as empty', () => {
      const state = createGame(testPuzzle);

      for (const cell of state.grid) {
        expect(cell.state).toBe('empty');
      }
    });

    it('should create correct number of cells', () => {
      const state = createGame(testPuzzle);
      // 2 animals x 2 colors = 4 cells (for one category pair)
      expect(state.grid.length).toBe(4);
    });

    it('should have no used clues', () => {
      const state = createGame(testPuzzle);
      expect(state.usedClueIds).toHaveLength(0);
    });
  });

  describe('setCellState', () => {
    it('should set cell to yes', () => {
      let state = createGame(testPuzzle);
      state = setCellState(state, 'cat', 'red', 'yes');

      const cellState = getCellState(state.grid, 'cat', 'red');
      expect(cellState).toBe('yes');
    });

    it('should set cell to no', () => {
      let state = createGame(testPuzzle);
      state = setCellState(state, 'cat', 'red', 'no');

      const cellState = getCellState(state.grid, 'cat', 'red');
      expect(cellState).toBe('no');
    });

    it('should increment action count', () => {
      let state = createGame(testPuzzle);
      expect(state.actionCount).toBe(0);

      state = setCellState(state, 'cat', 'red', 'yes');
      expect(state.actionCount).toBe(1);
    });

    it('should find cell regardless of order', () => {
      let state = createGame(testPuzzle);
      state = setCellState(state, 'red', 'cat', 'yes');

      const cellState = getCellState(state.grid, 'cat', 'red');
      expect(cellState).toBe('yes');
    });
  });

  describe('toggleCellState', () => {
    it('should toggle from empty to yes', () => {
      let state = createGame(testPuzzle);
      state = toggleCellState(state, 'cat', 'red');

      const cellState = getCellState(state.grid, 'cat', 'red');
      expect(cellState).toBe('yes');
    });

    it('should toggle from yes to no', () => {
      let state = createGame(testPuzzle);
      state = setCellState(state, 'cat', 'red', 'yes');
      state = toggleCellState(state, 'cat', 'red');

      const cellState = getCellState(state.grid, 'cat', 'red');
      expect(cellState).toBe('no');
    });

    it('should toggle from no to empty', () => {
      let state = createGame(testPuzzle);
      state = setCellState(state, 'cat', 'red', 'no');
      state = toggleCellState(state, 'cat', 'red');

      const cellState = getCellState(state.grid, 'cat', 'red');
      expect(cellState).toBe('empty');
    });
  });

  describe('selectCell', () => {
    it('should select cell', () => {
      let state = createGame(testPuzzle);
      state = selectCell(state, 'cat', 'red');

      expect(state.selectedCell).toEqual({ rowItemId: 'cat', colItemId: 'red' });
    });

    it('should clear selection with null values', () => {
      let state = createGame(testPuzzle);
      state = selectCell(state, 'cat', 'red');
      state = selectCell(state, null, null);

      expect(state.selectedCell).toBeNull();
    });
  });

  describe('markClueUsed', () => {
    it('should mark clue as used', () => {
      let state = createGame(testPuzzle);
      state = markClueUsed(state, 'clue-1');

      expect(state.usedClueIds).toContain('clue-1');
    });

    it('should not duplicate used clue', () => {
      let state = createGame(testPuzzle);
      state = markClueUsed(state, 'clue-1');
      state = markClueUsed(state, 'clue-1');

      expect(state.usedClueIds.filter((id) => id === 'clue-1')).toHaveLength(1);
    });
  });

  describe('requestHint', () => {
    it('should increment hints used', () => {
      let state = createGame(testPuzzle);
      state = requestHint(state);

      expect(state.hintsUsed).toBe(1);
    });

    it('should set active hint', () => {
      let state = createGame(testPuzzle);
      state = requestHint(state);

      expect(state.activeHint).not.toBeNull();
    });

    it('should not exceed hints available', () => {
      let state = createGame(testPuzzle);
      state = { ...state, hintsUsed: 3 }; // Max hints

      state = requestHint(state);
      expect(state.hintsUsed).toBe(3);
    });
  });

  describe('clearHint', () => {
    it('should clear active hint', () => {
      let state = createGame(testPuzzle);
      state = requestHint(state);
      state = clearHint(state);

      expect(state.activeHint).toBeNull();
    });
  });

  describe('tickTime', () => {
    it('should increment time by 1', () => {
      let state = createGame(testPuzzle);
      state = tickTime(state);

      expect(state.timeElapsed).toBe(1);
    });
  });

  describe('isPuzzleSolved', () => {
    it('should return false for empty grid', () => {
      const state = createGame(testPuzzle);
      expect(isPuzzleSolved(state)).toBe(false);
    });

    it('should return true for correct solution', () => {
      let state = createGame(testPuzzle);

      // Mark correct associations
      state = setCellState(state, 'cat', 'red', 'yes');
      state = setCellState(state, 'dog', 'blue', 'yes');
      // Mark incorrect associations
      state = setCellState(state, 'cat', 'blue', 'no');
      state = setCellState(state, 'dog', 'red', 'no');

      expect(isPuzzleSolved(state)).toBe(true);
    });

    it('should return false for incorrect solution', () => {
      let state = createGame(testPuzzle);

      // Mark wrong associations
      state = setCellState(state, 'cat', 'blue', 'yes');
      state = setCellState(state, 'dog', 'red', 'yes');

      expect(isPuzzleSolved(state)).toBe(false);
    });

    it('should return false for incomplete solution', () => {
      let state = createGame(testPuzzle);

      // Only mark one association
      state = setCellState(state, 'cat', 'red', 'yes');

      expect(isPuzzleSolved(state)).toBe(false);
    });
  });

  describe('getGridErrors', () => {
    it('should return empty array for correct grid', () => {
      let state = createGame(testPuzzle);
      state = setCellState(state, 'cat', 'red', 'yes');
      state = setCellState(state, 'dog', 'blue', 'yes');

      const errors = getGridErrors(state);
      expect(errors).toHaveLength(0);
    });

    it('should return errors for incorrect yes cells', () => {
      let state = createGame(testPuzzle);
      state = setCellState(state, 'cat', 'blue', 'yes'); // Wrong!

      const errors = getGridErrors(state);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should not report no cells as errors', () => {
      let state = createGame(testPuzzle);
      state = setCellState(state, 'cat', 'blue', 'no'); // Correct exclusion

      const errors = getGridErrors(state);
      expect(errors).toHaveLength(0);
    });
  });

  describe('applyAutoExclusion', () => {
    it('should mark other cells as no when one yes exists in row', () => {
      let state = createGame(testPuzzle);
      state = setCellState(state, 'cat', 'red', 'yes');

      state = applyAutoExclusion(state);

      // cat-blue should now be 'no'
      const catBlueState = getCellState(state.grid, 'cat', 'blue');
      expect(catBlueState).toBe('no');
    });
  });

  describe('calculateResult', () => {
    it('should calculate 3 stars for fast completion', () => {
      let state = createGame(testPuzzle);
      state = { ...state, timeElapsed: 60, hintsUsed: 0 }; // 50% of ideal time

      const result = calculateResult(state);
      expect(result.stars).toBe(3);
    });

    it('should calculate lower stars for slow completion', () => {
      let state = createGame(testPuzzle);
      state = { ...state, timeElapsed: 300, hintsUsed: 0 }; // Way over ideal time

      const result = calculateResult(state);
      expect(result.stars).toBe(1);
    });

    it('should apply hint penalty', () => {
      let state = createGame(testPuzzle);
      state = { ...state, timeElapsed: 60, hintsUsed: 0 };
      const resultNoHints = calculateResult(state);

      state = { ...state, hintsUsed: 2 };
      const resultWithHints = calculateResult(state);

      expect(resultWithHints.score).toBeLessThan(resultNoHints.score);
    });

    it('should mark as perfect for 3 stars and no hints', () => {
      let state = createGame(testPuzzle);
      state = { ...state, timeElapsed: 60, hintsUsed: 0 };

      const result = calculateResult(state);
      expect(result.isPerfect).toBe(true);
    });
  });

  describe('countCellsByState', () => {
    it('should count empty cells', () => {
      const state = createGame(testPuzzle);
      const count = countCellsByState(state.grid, 'empty');

      expect(count).toBe(4);
    });

    it('should count yes cells', () => {
      let state = createGame(testPuzzle);
      state = setCellState(state, 'cat', 'red', 'yes');
      state = setCellState(state, 'dog', 'blue', 'yes');

      const count = countCellsByState(state.grid, 'yes');
      expect(count).toBe(2);
    });
  });

  describe('isPlayerStuck', () => {
    it('should return true if no actions for long time', () => {
      let state = createGame(testPuzzle);
      state = { ...state, timeElapsed: 120, actionCount: 0 };

      expect(isPlayerStuck(state)).toBe(true);
    });

    it('should return false for active player', () => {
      let state = createGame(testPuzzle);
      state = { ...state, timeElapsed: 60, actionCount: 10 };

      expect(isPlayerStuck(state)).toBe(false);
    });
  });
});
