/**
 * Tests for Memory Engine
 */

import {
  createGame,
  createShuffledCards,
  flipCard,
  checkMatch,
  resetRevealedCards,
  calculateResult,
  calculateStars,
  isGameComplete,
  isTimeUp,
  tickTime,
  getRevealedCount,
  getGridDimensions,
} from '../../../src/games/memory/logic/memoryEngine';
import type { MemoryLevel, MemoryGameState } from '../../../src/games/memory/types';

describe('memoryEngine', () => {
  const testLevel: MemoryLevel = {
    id: 'test-level',
    name: 'Test Level',
    pairCount: 4,
    gridSize: { rows: 2, cols: 4 },
    timeLimit: 60,
    theme: 'animals',
    idealTime: 30,
    idealAttempts: 6,
  };

  const testSymbols = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

  describe('createGame', () => {
    it('should create game with correct number of cards', () => {
      const state = createGame(testLevel, testSymbols);
      expect(state.cards).toHaveLength(testLevel.pairCount * 2);
    });

    it('should initialize with zero matched pairs', () => {
      const state = createGame(testLevel, testSymbols);
      expect(state.matchedPairs).toBe(0);
    });

    it('should initialize in playing phase', () => {
      const state = createGame(testLevel, testSymbols);
      expect(state.phase).toBe('playing');
    });

    it('should initialize with no revealed cards', () => {
      const state = createGame(testLevel, testSymbols);
      expect(state.revealedCards).toHaveLength(0);
    });

    it('should initialize with zero attempts', () => {
      const state = createGame(testLevel, testSymbols);
      expect(state.attempts).toBe(0);
    });

    it('should set totalPairs from level', () => {
      const state = createGame(testLevel, testSymbols);
      expect(state.totalPairs).toBe(testLevel.pairCount);
    });
  });

  describe('createShuffledCards', () => {
    it('should create correct number of cards', () => {
      const cards = createShuffledCards(4, testSymbols);
      expect(cards).toHaveLength(8);
    });

    it('should create pairs (each symbol appears twice)', () => {
      const cards = createShuffledCards(4, testSymbols);
      const symbolCounts: Record<string, number> = {};

      cards.forEach((card) => {
        symbolCounts[card.symbol] = (symbolCounts[card.symbol] || 0) + 1;
      });

      Object.values(symbolCounts).forEach((count) => {
        expect(count).toBe(2);
      });
    });

    it('should initialize all cards as hidden', () => {
      const cards = createShuffledCards(4, testSymbols);
      cards.forEach((card) => {
        expect(card.state).toBe('hidden');
      });
    });

    it('should assign unique IDs to cards', () => {
      const cards = createShuffledCards(4, testSymbols);
      const ids = cards.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should shuffle cards (not in original order)', () => {
      // Run multiple times to account for rare shuffles that happen to be in order
      let shuffled = false;
      for (let i = 0; i < 10; i++) {
        const cards = createShuffledCards(4, testSymbols);
        const symbols = cards.map((c) => c.symbol);
        const firstFour = symbols.slice(0, 4);
        // If first 4 cards don't all have unique symbols, it's shuffled
        if (new Set(firstFour).size !== 4) {
          shuffled = true;
          break;
        }
      }
      expect(shuffled).toBe(true);
    });
  });

  describe('flipCard', () => {
    it('should reveal a hidden card', () => {
      const state = createGame(testLevel, testSymbols);
      const cardId = state.cards[0].id;
      const newState = flipCard(state, cardId);

      const flippedCard = newState.cards.find((c) => c.id === cardId);
      expect(flippedCard?.state).toBe('revealed');
    });

    it('should add card to revealedCards', () => {
      const state = createGame(testLevel, testSymbols);
      const cardId = state.cards[0].id;
      const newState = flipCard(state, cardId);

      expect(newState.revealedCards).toContain(cardId);
    });

    it('should not flip already revealed card', () => {
      let state = createGame(testLevel, testSymbols);
      const cardId = state.cards[0].id;
      state = flipCard(state, cardId);
      const newState = flipCard(state, cardId);

      expect(newState.revealedCards).toHaveLength(1);
    });

    it('should not flip more than 2 cards', () => {
      let state = createGame(testLevel, testSymbols);
      state = flipCard(state, state.cards[0].id);
      state = flipCard(state, state.cards[1].id);
      const newState = flipCard(state, state.cards[2].id);

      expect(newState.revealedCards).toHaveLength(2);
    });

    it('should not flip during checking phase', () => {
      let state = createGame(testLevel, testSymbols);
      state = { ...state, isChecking: true };
      const newState = flipCard(state, state.cards[0].id);

      expect(newState.revealedCards).toHaveLength(0);
    });

    it('should not flip matched cards', () => {
      let state = createGame(testLevel, testSymbols);
      const card = state.cards[0];
      state = {
        ...state,
        cards: state.cards.map((c) => (c.id === card.id ? { ...c, state: 'matched' } : c)),
      };

      const newState = flipCard(state, card.id);
      expect(newState.revealedCards).toHaveLength(0);
    });
  });

  describe('checkMatch', () => {
    it('should detect matching pair', () => {
      let state = createGame(testLevel, testSymbols);

      // Find a matching pair
      const firstCard = state.cards[0];
      const matchingCard = state.cards.find(
        (c) => c.id !== firstCard.id && c.symbolId === firstCard.symbolId
      );

      state = flipCard(state, firstCard.id);
      state = flipCard(state, matchingCard!.id);

      const result = checkMatch(state);
      expect(result.isMatch).toBe(true);
      expect(result.newState.matchedPairs).toBe(1);
    });

    it('should detect non-matching pair', () => {
      let state = createGame(testLevel, testSymbols);

      // Find two non-matching cards
      const firstCard = state.cards[0];
      const nonMatchingCard = state.cards.find(
        (c) => c.id !== firstCard.id && c.symbolId !== firstCard.symbolId
      );

      state = flipCard(state, firstCard.id);
      state = flipCard(state, nonMatchingCard!.id);

      const result = checkMatch(state);
      expect(result.isMatch).toBe(false);
      expect(result.newState.isChecking).toBe(true);
    });

    it('should increment attempts', () => {
      let state = createGame(testLevel, testSymbols);
      state = flipCard(state, state.cards[0].id);
      state = flipCard(state, state.cards[1].id);

      const result = checkMatch(state);
      expect(result.newState.attempts).toBe(1);
    });

    it('should not check with less than 2 revealed cards', () => {
      let state = createGame(testLevel, testSymbols);
      state = flipCard(state, state.cards[0].id);

      const result = checkMatch(state);
      expect(result.isMatch).toBe(false);
      expect(result.newState.attempts).toBe(0);
    });

    it('should detect victory when all pairs matched', () => {
      let state = createGame(testLevel, testSymbols);

      // Match all pairs
      const symbolGroups: Record<string, typeof state.cards> = {};
      state.cards.forEach((card) => {
        if (!symbolGroups[card.symbolId]) symbolGroups[card.symbolId] = [];
        symbolGroups[card.symbolId].push(card);
      });

      let matchCount = 0;
      for (const [, cards] of Object.entries(symbolGroups)) {
        state = flipCard(state, cards[0].id);
        state = flipCard(state, cards[1].id);
        const result = checkMatch(state);
        state = result.newState;
        matchCount++;
      }

      expect(state.phase).toBe('victory');
      expect(state.matchedPairs).toBe(testLevel.pairCount);
    });
  });

  describe('resetRevealedCards', () => {
    it('should hide revealed cards', () => {
      let state = createGame(testLevel, testSymbols);
      state = flipCard(state, state.cards[0].id);
      state = flipCard(state, state.cards[1].id);

      const newState = resetRevealedCards(state);

      const card1 = newState.cards.find((c) => c.id === state.cards[0].id);
      const card2 = newState.cards.find((c) => c.id === state.cards[1].id);

      expect(card1?.state).toBe('hidden');
      expect(card2?.state).toBe('hidden');
    });

    it('should clear revealedCards array', () => {
      let state = createGame(testLevel, testSymbols);
      state = flipCard(state, state.cards[0].id);
      state = flipCard(state, state.cards[1].id);

      const newState = resetRevealedCards(state);
      expect(newState.revealedCards).toHaveLength(0);
    });

    it('should clear isChecking flag', () => {
      let state = createGame(testLevel, testSymbols);
      state = { ...state, isChecking: true };

      const newState = resetRevealedCards(state);
      expect(newState.isChecking).toBe(false);
    });
  });

  describe('calculateStars', () => {
    it('should return 3 stars for perfect game', () => {
      const stars = calculateStars(testLevel, 20, 4); // Under ideal time, minimum attempts
      expect(stars).toBe(3);
    });

    it('should return 2 stars for good game', () => {
      const stars = calculateStars(testLevel, 40, 6); // 1.3x time, 1.5x attempts
      expect(stars).toBe(2);
    });

    it('should return 1 star for completed game', () => {
      const stars = calculateStars(testLevel, 100, 20); // Way over ideal
      expect(stars).toBe(1);
    });
  });

  describe('calculateResult', () => {
    it('should calculate victory result', () => {
      let state = createGame(testLevel, testSymbols);
      state = {
        ...state,
        matchedPairs: 4,
        totalPairs: 4,
        timeElapsed: 30,
        attempts: 5,
      };

      const result = calculateResult(state);
      expect(result.isVictory).toBe(true);
      expect(result.timeSeconds).toBe(30);
      expect(result.attempts).toBe(5);
    });

    it('should calculate accuracy', () => {
      let state = createGame(testLevel, testSymbols);
      state = {
        ...state,
        matchedPairs: 4,
        totalPairs: 4,
        timeElapsed: 30,
        attempts: 8,
      };

      const result = calculateResult(state);
      expect(result.accuracy).toBe(0.5); // 4 matches / 8 attempts
    });
  });

  describe('isGameComplete', () => {
    it('should return true when all pairs matched', () => {
      let state = createGame(testLevel, testSymbols);
      state = { ...state, matchedPairs: 4, totalPairs: 4 };

      expect(isGameComplete(state)).toBe(true);
    });

    it('should return false when not all pairs matched', () => {
      let state = createGame(testLevel, testSymbols);
      state = { ...state, matchedPairs: 3, totalPairs: 4 };

      expect(isGameComplete(state)).toBe(false);
    });
  });

  describe('isTimeUp', () => {
    it('should return true when time exceeds limit', () => {
      let state = createGame(testLevel, testSymbols);
      state = { ...state, timeElapsed: 61 };

      expect(isTimeUp(state)).toBe(true);
    });

    it('should return false when time under limit', () => {
      let state = createGame(testLevel, testSymbols);
      state = { ...state, timeElapsed: 30 };

      expect(isTimeUp(state)).toBe(false);
    });

    it('should return false when no time limit', () => {
      const levelNoLimit = { ...testLevel, timeLimit: 0 };
      let state = createGame(levelNoLimit, testSymbols);
      state = { ...state, timeElapsed: 1000 };

      expect(isTimeUp(state)).toBe(false);
    });
  });

  describe('tickTime', () => {
    it('should increment time by 1', () => {
      let state = createGame(testLevel, testSymbols);
      const newState = tickTime(state);

      expect(newState.timeElapsed).toBe(1);
    });

    it('should not increment when not playing', () => {
      let state = createGame(testLevel, testSymbols);
      state = { ...state, phase: 'victory' };
      const newState = tickTime(state);

      expect(newState.timeElapsed).toBe(0);
    });
  });

  describe('getRevealedCount', () => {
    it('should return correct count', () => {
      let state = createGame(testLevel, testSymbols);
      expect(getRevealedCount(state)).toBe(0);

      state = flipCard(state, state.cards[0].id);
      expect(getRevealedCount(state)).toBe(1);

      state = flipCard(state, state.cards[1].id);
      expect(getRevealedCount(state)).toBe(2);
    });
  });

  describe('getGridDimensions', () => {
    it('should return correct dimensions for 4 pairs', () => {
      const dims = getGridDimensions(4);
      expect(dims).toEqual({ rows: 2, cols: 4 });
    });

    it('should return correct dimensions for 6 pairs', () => {
      const dims = getGridDimensions(6);
      expect(dims).toEqual({ rows: 3, cols: 4 });
    });

    it('should return correct dimensions for 8 pairs', () => {
      const dims = getGridDimensions(8);
      expect(dims).toEqual({ rows: 4, cols: 4 });
    });

    it('should handle unsupported pair counts', () => {
      const dims = getGridDimensions(15);
      expect(dims.rows).toBeDefined();
      expect(dims.cols).toBeDefined();
    });
  });
});
