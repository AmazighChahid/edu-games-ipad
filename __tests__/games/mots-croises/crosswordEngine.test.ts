/**
 * Tests for Crossword Engine
 */

import {
  createGame,
  selectCell,
  enterLetter,
  deleteLetter,
  selectWord,
  revealLetter,
  revealWord,
  tickTime,
  calculateResult,
  isLetterCorrect,
  getCompletionPercentage,
} from '../../../src/games/mots-croises/logic/crosswordEngine';
import type { CrosswordLevel, CrosswordWord } from '../../../src/games/mots-croises/types';

describe('crosswordEngine', () => {
  const word1: CrosswordWord = {
    id: 'word-1',
    word: 'CHAT',
    clue: 'Animal qui miaule',
    emoji: '🐱',
    row: 0,
    col: 0,
    direction: 'horizontal',
    number: 1,
  };

  const word2: CrosswordWord = {
    id: 'word-2',
    word: 'CHIEN',
    clue: 'Animal qui aboie',
    emoji: '🐶',
    row: 0,
    col: 0,
    direction: 'vertical',
    number: 1,
  };

  const testLevel: CrosswordLevel = {
    id: 'test-level',
    name: 'Test Level',
    description: 'A test level for unit tests',
    theme: 'animaux',
    themeEmoji: '🐾',
    gridSize: { rows: 5, cols: 5 },
    words: [word1, word2],
    hintsAvailable: 3,
    idealTime: 120,
    difficulty: 1,
  };

  describe('createGame', () => {
    it('should create game with correct grid size', () => {
      const state = createGame(testLevel);

      expect(state.grid.length).toBe(5);
      expect(state.grid[0].length).toBe(5);
    });

    it('should initialize in playing phase', () => {
      const state = createGame(testLevel);
      expect(state.phase).toBe('playing');
    });

    it('should have no selected cell initially', () => {
      const state = createGame(testLevel);
      expect(state.selectedCell).toBeNull();
    });

    it('should place words correctly', () => {
      const state = createGame(testLevel);

      // Check horizontal word CHAT
      expect(state.grid[0][0].letter).toBe('C');
      expect(state.grid[0][1].letter).toBe('H');
      expect(state.grid[0][2].letter).toBe('A');
      expect(state.grid[0][3].letter).toBe('T');

      // Check vertical word CHIEN (shares C with CHAT)
      expect(state.grid[0][0].letter).toBe('C');
      expect(state.grid[1][0].letter).toBe('H');
      expect(state.grid[2][0].letter).toBe('I');
      expect(state.grid[3][0].letter).toBe('E');
      expect(state.grid[4][0].letter).toBe('N');
    });

    it('should mark word cells as non-blocked', () => {
      const state = createGame(testLevel);

      expect(state.grid[0][0].isBlocked).toBe(false);
      expect(state.grid[0][1].isBlocked).toBe(false);
    });

    it('should mark empty cells as blocked', () => {
      const state = createGame(testLevel);

      // Cell at (1,1) should be blocked (not part of any word)
      expect(state.grid[1][1].isBlocked).toBe(true);
    });

    it('should calculate total letters correctly', () => {
      const state = createGame(testLevel);
      // CHAT (4) + CHIEN (5) - shared C (1) = 8 unique letter cells
      expect(state.totalLetters).toBe(8);
    });

    it('should assign word numbers', () => {
      const state = createGame(testLevel);

      expect(state.grid[0][0].wordNumber).toBe(1);
    });
  });

  describe('selectCell', () => {
    it('should select a non-blocked cell', () => {
      let state = createGame(testLevel);
      state = selectCell(state, 0, 0);

      expect(state.selectedCell).toEqual({ row: 0, col: 0 });
    });

    it('should not select a blocked cell', () => {
      let state = createGame(testLevel);
      state = selectCell(state, 1, 1); // Blocked cell

      expect(state.selectedCell).toBeNull();
    });

    it('should toggle direction when clicking same cell', () => {
      let state = createGame(testLevel);

      // Cell (0,0) is shared between horizontal and vertical words
      state = selectCell(state, 0, 0);
      const firstDirection = state.inputDirection;

      state = selectCell(state, 0, 0);
      expect(state.inputDirection).not.toBe(firstDirection);
    });

    it('should select corresponding word', () => {
      let state = createGame(testLevel);
      state = selectCell(state, 0, 0);

      expect(state.selectedWordId).toBeDefined();
    });
  });

  describe('enterLetter', () => {
    it('should enter letter in selected cell', () => {
      let state = createGame(testLevel);
      state = selectCell(state, 0, 0);
      state = enterLetter(state, 'C');

      expect(state.grid[0][0].userLetter).toBe('C');
    });

    it('should convert to uppercase', () => {
      let state = createGame(testLevel);
      state = selectCell(state, 0, 0);
      state = enterLetter(state, 'c');

      expect(state.grid[0][0].userLetter).toBe('C');
    });

    it('should increment correct letters for correct entry', () => {
      let state = createGame(testLevel);
      state = selectCell(state, 0, 0);
      state = enterLetter(state, 'C');

      expect(state.correctLetters).toBe(1);
    });

    it('should not increment for wrong letter', () => {
      let state = createGame(testLevel);
      state = selectCell(state, 0, 0);
      state = enterLetter(state, 'X');

      expect(state.correctLetters).toBe(0);
    });

    it('should move to next cell after entering', () => {
      let state = createGame(testLevel);
      state = selectCell(state, 0, 0);
      state = { ...state, inputDirection: 'horizontal' };
      state = enterLetter(state, 'C');

      expect(state.selectedCell).toEqual({ row: 0, col: 1 });
    });

    it('should detect completed words', () => {
      let state = createGame(testLevel);
      state = selectCell(state, 0, 0);
      state = { ...state, inputDirection: 'horizontal' };

      // Enter CHAT
      state = enterLetter(state, 'C');
      state = enterLetter(state, 'H');
      state = enterLetter(state, 'A');
      state = enterLetter(state, 'T');

      expect(state.completedWordIds).toContain('word-1');
    });

    it('should not affect blocked cells', () => {
      let state = createGame(testLevel);
      state = { ...state, selectedCell: { row: 1, col: 1 } }; // Force select blocked
      state = enterLetter(state, 'X');

      expect(state.grid[1][1].userLetter).toBe('');
    });

    it('should detect victory when all letters correct', () => {
      let state = createGame(testLevel);

      // Manually fill all correct letters
      const newGrid = state.grid.map((row) =>
        row.map((cell) => ({
          ...cell,
          userLetter: cell.letter,
        }))
      );

      state = {
        ...state,
        grid: newGrid,
        correctLetters: state.totalLetters - 1,
        selectedCell: { row: 0, col: 0 },
      };

      // Enter last letter to trigger victory check
      state = enterLetter(state, 'C');
      expect(state.phase).toBe('victory');
    });
  });

  describe('deleteLetter', () => {
    it('should delete letter from current cell', () => {
      let state = createGame(testLevel);
      state = selectCell(state, 0, 0);
      state = enterLetter(state, 'C');
      state = selectCell(state, 0, 0); // Re-select
      state = deleteLetter(state);

      expect(state.grid[0][0].userLetter).toBe('');
    });

    it('should move to previous cell if current is empty', () => {
      let state = createGame(testLevel);
      state = selectCell(state, 0, 1);
      state = { ...state, inputDirection: 'horizontal' };
      state = deleteLetter(state);

      expect(state.selectedCell).toEqual({ row: 0, col: 0 });
    });

    it('should not delete revealed letters', () => {
      let state = createGame(testLevel);
      state = selectCell(state, 0, 0);
      state = revealLetter(state);
      state = deleteLetter(state);

      expect(state.grid[0][0].userLetter).toBe('C'); // Still there
    });

    it('should update correct letters count', () => {
      let state = createGame(testLevel);
      state = selectCell(state, 0, 0);
      state = enterLetter(state, 'C');
      expect(state.correctLetters).toBe(1);

      state = selectCell(state, 0, 0);
      state = deleteLetter(state);
      expect(state.correctLetters).toBe(0);
    });
  });

  describe('selectWord', () => {
    it('should select word and position cursor', () => {
      let state = createGame(testLevel);
      state = selectWord(state, 'word-1');

      expect(state.selectedWordId).toBe('word-1');
      expect(state.selectedCell).toEqual({ row: 0, col: 0 });
      expect(state.inputDirection).toBe('horizontal');
    });

    it('should set correct direction for vertical word', () => {
      let state = createGame(testLevel);
      state = selectWord(state, 'word-2');

      expect(state.inputDirection).toBe('vertical');
    });

    it('should not change state for invalid word ID', () => {
      let state = createGame(testLevel);
      const originalState = state;
      state = selectWord(state, 'nonexistent');

      expect(state.selectedWordId).toBe(originalState.selectedWordId);
    });
  });

  describe('revealLetter', () => {
    it('should reveal current cell letter', () => {
      let state = createGame(testLevel);
      state = selectCell(state, 0, 0);
      state = revealLetter(state);

      expect(state.grid[0][0].userLetter).toBe('C');
      expect(state.grid[0][0].isRevealed).toBe(true);
    });

    it('should increment hints used', () => {
      let state = createGame(testLevel);
      state = selectCell(state, 0, 0);
      state = revealLetter(state);

      expect(state.hintsUsed).toBe(1);
    });

    it('should not exceed hints available', () => {
      let state = createGame(testLevel);
      state = { ...state, hintsUsed: 3, selectedCell: { row: 0, col: 0 } };
      state = revealLetter(state);

      expect(state.hintsUsed).toBe(3);
    });

    it('should not reveal already correct letter', () => {
      let state = createGame(testLevel);
      state = selectCell(state, 0, 0);
      state = enterLetter(state, 'C');
      const hintsBeforeReveal = state.hintsUsed;

      state = selectCell(state, 0, 0);
      state = revealLetter(state);

      expect(state.hintsUsed).toBe(hintsBeforeReveal);
    });
  });

  describe('revealWord', () => {
    it('should reveal all letters in selected word', () => {
      let state = createGame(testLevel);
      state = selectWord(state, 'word-1');
      state = revealWord(state);

      expect(state.grid[0][0].userLetter).toBe('C');
      expect(state.grid[0][1].userLetter).toBe('H');
      expect(state.grid[0][2].userLetter).toBe('A');
      expect(state.grid[0][3].userLetter).toBe('T');
    });

    it('should mark all word letters as revealed', () => {
      let state = createGame(testLevel);
      state = selectWord(state, 'word-1');
      state = revealWord(state);

      expect(state.grid[0][0].isRevealed).toBe(true);
      expect(state.grid[0][1].isRevealed).toBe(true);
    });

    it('should increment hints used', () => {
      let state = createGame(testLevel);
      state = selectWord(state, 'word-1');
      state = revealWord(state);

      expect(state.hintsUsed).toBe(1);
    });
  });

  describe('tickTime', () => {
    it('should increment time by 1', () => {
      let state = createGame(testLevel);
      state = tickTime(state);

      expect(state.timeElapsed).toBe(1);
    });
  });

  describe('calculateResult', () => {
    it('should calculate 3 stars for fast completion', () => {
      let state = createGame(testLevel);
      state = { ...state, timeElapsed: 60, completedWordIds: ['word-1', 'word-2'], hintsUsed: 0 };

      const result = calculateResult(state);
      expect(result.stars).toBe(3);
    });

    it('should count completed words', () => {
      let state = createGame(testLevel);
      state = { ...state, completedWordIds: ['word-1'] };

      const result = calculateResult(state);
      expect(result.wordsFound).toBe(1);
      expect(result.totalWords).toBe(2);
    });

    it('should apply hint penalty', () => {
      let state = createGame(testLevel);
      state = { ...state, timeElapsed: 60, completedWordIds: ['word-1', 'word-2'], hintsUsed: 0 };
      const resultNoHints = calculateResult(state);

      state = { ...state, hintsUsed: 2 };
      const resultWithHints = calculateResult(state);

      expect(resultWithHints.score).toBeLessThan(resultNoHints.score);
    });

    it('should mark as perfect for 3 stars and no hints', () => {
      let state = createGame(testLevel);
      state = { ...state, timeElapsed: 60, hintsUsed: 0 };

      const result = calculateResult(state);
      expect(result.isPerfect).toBe(true);
    });
  });

  describe('isLetterCorrect', () => {
    it('should return true for correct letter', () => {
      let state = createGame(testLevel);
      state = selectCell(state, 0, 0);
      state = enterLetter(state, 'C');

      expect(isLetterCorrect(state.grid, 0, 0)).toBe(true);
    });

    it('should return false for wrong letter', () => {
      let state = createGame(testLevel);
      state = selectCell(state, 0, 0);
      state = enterLetter(state, 'X');

      expect(isLetterCorrect(state.grid, 0, 0)).toBe(false);
    });

    it('should return false for empty cell', () => {
      const state = createGame(testLevel);
      expect(isLetterCorrect(state.grid, 0, 0)).toBe(false);
    });
  });

  describe('getCompletionPercentage', () => {
    it('should return 0 for empty grid', () => {
      const state = createGame(testLevel);
      expect(getCompletionPercentage(state)).toBe(0);
    });

    it('should return correct percentage', () => {
      let state = createGame(testLevel);
      state = { ...state, correctLetters: 4, totalLetters: 8 };

      expect(getCompletionPercentage(state)).toBe(50);
    });

    it('should return 100 for complete grid', () => {
      let state = createGame(testLevel);
      state = { ...state, correctLetters: 8, totalLetters: 8 };

      expect(getCompletionPercentage(state)).toBe(100);
    });
  });
});
