/**
 * Tests for Feedback Pédagogique
 */

import {
  getFeedbackMessage,
  getAnimationConfig,
  SUCCESS_MESSAGES,
  VICTORY_MESSAGES,
  ERROR_MESSAGES,
  ENCOURAGEMENT_MESSAGES,
  HINT_MESSAGES,
  STREAK_MESSAGES,
  FEEDBACK_ANIMATIONS,
  HANOI_MESSAGES,
  SUDOKU_MESSAGES,
  BALANCE_MESSAGES,
  SUITES_MESSAGES,
} from '../../../src/core/pedagogy/feedback';
import type { FeedbackContext } from '../../../src/core/types/core.types';

describe('feedback', () => {
  describe('getFeedbackMessage', () => {
    it('should return success message for success type', () => {
      const context: FeedbackContext = { type: 'success', gameId: 'hanoi' };
      const message = getFeedbackMessage(context);

      expect(SUCCESS_MESSAGES).toContainEqual(message);
    });

    it('should return victory message for victory type', () => {
      const context: FeedbackContext = { type: 'victory', gameId: 'hanoi' };
      const message = getFeedbackMessage(context);

      expect(VICTORY_MESSAGES).toContainEqual(message);
    });

    it('should return error message for error type', () => {
      const context: FeedbackContext = { type: 'error', gameId: 'hanoi', errorCount: 1 };
      const message = getFeedbackMessage(context);

      expect(ERROR_MESSAGES).toContainEqual(message);
    });

    it('should return encouragement message for encouragement type', () => {
      const context: FeedbackContext = { type: 'encouragement', gameId: 'hanoi' };
      const message = getFeedbackMessage(context);

      expect(ENCOURAGEMENT_MESSAGES).toContainEqual(message);
    });

    it('should return hint message for hint type', () => {
      const context: FeedbackContext = { type: 'hint', gameId: 'hanoi' };
      const message = getFeedbackMessage(context);

      expect(HINT_MESSAGES).toContainEqual(message);
    });

    it('should return encouraging error message after many errors', () => {
      const context: FeedbackContext = { type: 'error', gameId: 'hanoi', errorCount: 5 };
      const message = getFeedbackMessage(context);

      // Should be one of the encouraging messages
      expect(message.mood).toMatch(/encouraging|thinking/);
    });

    it('should return streak message for appropriate streak count', () => {
      const context3: FeedbackContext = { type: 'streak', gameId: 'hanoi', streakCount: 3 };
      const message3 = getFeedbackMessage(context3);
      expect(message3.id).toBe('streak_3');

      const context5: FeedbackContext = { type: 'streak', gameId: 'hanoi', streakCount: 5 };
      const message5 = getFeedbackMessage(context5);
      expect(message5.id).toBe('streak_5');

      const context10: FeedbackContext = { type: 'streak', gameId: 'hanoi', streakCount: 10 };
      const message10 = getFeedbackMessage(context10);
      expect(message10.id).toBe('streak_10');
    });

    it('should return special victory message for first attempt', () => {
      const context: FeedbackContext = { type: 'victory', gameId: 'hanoi', isFirstAttempt: true };
      const message = getFeedbackMessage(context);

      expect(message.text).toContain('Incroyable');
    });

    it('should return special victory message for quick completion', () => {
      const context: FeedbackContext = { type: 'victory', gameId: 'hanoi', moveCount: 5 };
      const message = getFeedbackMessage(context);

      expect(message.text).toContain('Magnifique');
    });
  });

  describe('message pools', () => {
    it('should have non-empty success messages', () => {
      expect(SUCCESS_MESSAGES.length).toBeGreaterThan(0);
    });

    it('should have non-empty victory messages', () => {
      expect(VICTORY_MESSAGES.length).toBeGreaterThan(0);
    });

    it('should have non-empty error messages', () => {
      expect(ERROR_MESSAGES.length).toBeGreaterThan(0);
    });

    it('should have non-empty encouragement messages', () => {
      expect(ENCOURAGEMENT_MESSAGES.length).toBeGreaterThan(0);
    });

    it('should have non-empty hint messages', () => {
      expect(HINT_MESSAGES.length).toBeGreaterThan(0);
    });

    it('should have non-empty streak messages', () => {
      expect(STREAK_MESSAGES.length).toBeGreaterThan(0);
    });
  });

  describe('message properties', () => {
    it('all success messages should have happy mood', () => {
      SUCCESS_MESSAGES.forEach((msg) => {
        expect(msg.mood).toBe('happy');
      });
    });

    it('all victory messages should have confetti animation', () => {
      VICTORY_MESSAGES.forEach((msg) => {
        expect(msg.animation).toBe('confetti');
      });
    });

    it('all error messages should be non-punitive (encouraging or thinking)', () => {
      ERROR_MESSAGES.forEach((msg) => {
        expect(['encouraging', 'thinking']).toContain(msg.mood);
      });
    });

    it('all messages should have unique IDs', () => {
      const allMessages = [
        ...SUCCESS_MESSAGES,
        ...VICTORY_MESSAGES,
        ...ERROR_MESSAGES,
        ...ENCOURAGEMENT_MESSAGES,
        ...HINT_MESSAGES,
        ...STREAK_MESSAGES,
      ];

      const ids = allMessages.map((m) => m.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('all messages should have valid durations', () => {
      const allMessages = [
        ...SUCCESS_MESSAGES,
        ...VICTORY_MESSAGES,
        ...ERROR_MESSAGES,
        ...ENCOURAGEMENT_MESSAGES,
        ...HINT_MESSAGES,
        ...STREAK_MESSAGES,
      ];

      allMessages.forEach((msg) => {
        expect(msg.duration).toBeGreaterThan(0);
        expect(msg.duration).toBeLessThanOrEqual(5000);
      });
    });
  });

  describe('getAnimationConfig', () => {
    it('should return config for confetti', () => {
      const config = getAnimationConfig('confetti');

      expect(config).not.toBeNull();
      expect(config?.type).toBe('confetti');
      expect(config?.duration).toBeGreaterThan(0);
    });

    it('should return config for stars', () => {
      const config = getAnimationConfig('stars');

      expect(config).not.toBeNull();
      expect(config?.type).toBe('stars');
    });

    it('should return config for shake', () => {
      const config = getAnimationConfig('shake');

      expect(config).not.toBeNull();
      expect(config?.type).toBe('shake');
    });

    it('should return null for none', () => {
      const config = getAnimationConfig('none');
      expect(config).toBeNull();
    });

    it('should return null for undefined', () => {
      const config = getAnimationConfig(undefined);
      expect(config).toBeNull();
    });
  });

  describe('animation configurations', () => {
    it('should have all expected animation types', () => {
      expect(FEEDBACK_ANIMATIONS.confetti).toBeDefined();
      expect(FEEDBACK_ANIMATIONS.stars).toBeDefined();
      expect(FEEDBACK_ANIMATIONS.shake).toBeDefined();
      expect(FEEDBACK_ANIMATIONS.pulse).toBeDefined();
      expect(FEEDBACK_ANIMATIONS.glow).toBeDefined();
      expect(FEEDBACK_ANIMATIONS.bounce).toBeDefined();
    });

    it('all animations should have valid duration', () => {
      Object.values(FEEDBACK_ANIMATIONS).forEach((config) => {
        expect(config.duration).toBeGreaterThan(0);
      });
    });

    it('all animations should have intensity', () => {
      Object.values(FEEDBACK_ANIMATIONS).forEach((config) => {
        expect(['light', 'medium', 'heavy']).toContain(config.intensity);
      });
    });
  });

  describe('game-specific messages', () => {
    describe('Hanoi messages', () => {
      it('should have invalid move messages', () => {
        expect(HANOI_MESSAGES.invalid_big_on_small).toBeDefined();
        expect(HANOI_MESSAGES.invalid_tower).toBeDefined();
      });

      it('should have hint messages', () => {
        expect(HANOI_MESSAGES.hint_free_big).toBeDefined();
      });

      it('should have victory messages', () => {
        expect(HANOI_MESSAGES.method_learned).toBeDefined();
      });

      it('all Hanoi messages should be non-punitive', () => {
        Object.values(HANOI_MESSAGES).forEach((msg) => {
          expect(['thinking', 'encouraging', 'excited']).toContain(msg.mood);
        });
      });
    });

    describe('Sudoku messages', () => {
      it('should have conflict messages', () => {
        expect(SUDOKU_MESSAGES.conflict_row).toBeDefined();
        expect(SUDOKU_MESSAGES.conflict_column).toBeDefined();
        expect(SUDOKU_MESSAGES.conflict_region).toBeDefined();
      });

      it('should have hint messages', () => {
        expect(SUDOKU_MESSAGES.hint_elimination).toBeDefined();
      });
    });

    describe('Balance messages', () => {
      it('should have weight messages', () => {
        expect(BALANCE_MESSAGES.too_heavy_left).toBeDefined();
        expect(BALANCE_MESSAGES.too_heavy_right).toBeDefined();
      });

      it('should have discovery message', () => {
        expect(BALANCE_MESSAGES.discovery).toBeDefined();
        expect(BALANCE_MESSAGES.discovery.mood).toBe('excited');
      });
    });

    describe('Suites messages', () => {
      it('should have pattern messages', () => {
        expect(SUITES_MESSAGES.wrong_pattern).toBeDefined();
        expect(SUITES_MESSAGES.pattern_found).toBeDefined();
      });

      it('should have hint messages', () => {
        expect(SUITES_MESSAGES.hint_observe).toBeDefined();
      });
    });
  });
});
