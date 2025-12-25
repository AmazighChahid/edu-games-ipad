/**
 * Main hook for MathBlocks game
 * Orchestrates game state, selections, and scoring
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics';

import { useStore } from '@/store/useStore';
import type { MathGameState, MathBlock } from '../types';
import { SCORE_VALUES } from '../types';
import { createInitialState } from '../logic/mathEngine';
import {
  markBlocksAsMatched,
  removeAllMatchedBlocks,
  applyGravity,
  updateBlockSelection,
  clearAllSelections,
  isGridEmpty,
} from '../logic/gridEngine';
import { validateMatch } from '../logic/matchValidator';
import { getDefaultLevel, getLevel } from '../data/levels';

// Animation timing constants
const EXPLOSION_DURATION = 350; // Time for explosion animation
const GRAVITY_DELAY = 100; // Small delay before gravity

interface UseMathGameOptions {
  levelId?: string;
  onVictory?: () => void;
  onGameOver?: () => void;
}

export function useMathGame(options: UseMathGameOptions = {}) {
  const { levelId, onVictory, onGameOver } = options;

  const level = levelId ? getLevel(levelId) : getDefaultLevel();
  if (!level) throw new Error(`Level not found: ${levelId}`);

  const [gameState, setGameState] = useState<MathGameState>(() =>
    createInitialState(level)
  );
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [isVictory, setIsVictory] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingVictoryRef = useRef<{
    matchesFound: number;
    matchScore: number;
  } | null>(null);

  const {
    hapticEnabled,
    startSession,
    incrementMoves,
    setStatus,
    endSession,
    recordCompletion,
  } = useStore();

  // Start session on mount
  useEffect(() => {
    startSession('math-blocks', level.id, gameState);
  }, [level.id]);

  // Timer countdown
  useEffect(() => {
    if (gameState.isPlaying && level.timeLimit > 0 && !isVictory && !isGameOver) {
      timerRef.current = setInterval(() => {
        setGameState((prev) => {
          if (prev.timeRemaining <= 1) {
            // Time's up!
            clearInterval(timerRef.current!);
            return { ...prev, timeRemaining: 0, isPlaying: false };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.isPlaying, level.timeLimit, isVictory, isGameOver]);

  // Check for game over (time's up)
  useEffect(() => {
    if (gameState.timeRemaining === 0 && !isVictory && !isGameOver) {
      setIsGameOver(true);
      setStatus('abandoned');
      onGameOver?.();
    }
  }, [gameState.timeRemaining, isVictory, isGameOver]);

  // Select a block
  const selectBlock = useCallback(
    (block: MathBlock) => {
      if (!gameState.isPlaying || isVictory || isGameOver || isAnimating) return;

      const { selectedBlock, grid } = gameState;

      // If no block selected, select this one
      if (!selectedBlock) {
        if (hapticEnabled) {
          Haptics.selectionAsync();
        }

        setGameState((prev) => ({
          ...prev,
          grid: updateBlockSelection(prev.grid, block.id, true),
          selectedBlock: block,
        }));
        return;
      }

      // If same block clicked, deselect
      if (selectedBlock.id === block.id) {
        setGameState((prev) => ({
          ...prev,
          grid: clearAllSelections(prev.grid),
          selectedBlock: null,
        }));
        return;
      }

      // Try to match
      const matchResult = validateMatch(selectedBlock, block);

      if (matchResult.valid) {
        // Valid match!
        if (hapticEnabled) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        const newCombo = gameState.combo + 1;
        const matchScore =
          SCORE_VALUES.correctMatch + newCombo * SCORE_VALUES.comboBonus;
        const newMatchesFound = gameState.matchesFound + 1;

        // Start animation sequence
        setIsAnimating(true);

        // Step 1: Mark blocks as matched (triggers explosion animation)
        const markedGrid = markBlocksAsMatched(grid, selectedBlock, block);

        setGameState((prev) => ({
          ...prev,
          grid: markedGrid,
          selectedBlock: null,
          score: prev.score + matchScore,
          combo: newCombo,
          matchesFound: newMatchesFound,
        }));

        incrementMoves();

        // Store pending victory check
        pendingVictoryRef.current = { matchesFound: newMatchesFound, matchScore };

        // Step 2: After explosion animation, remove blocks and apply gravity
        setTimeout(() => {
          setGameState((prev) => {
            // Remove matched blocks
            let newGrid = removeAllMatchedBlocks(prev.grid);
            // Apply gravity
            newGrid = applyGravity(newGrid);

            return {
              ...prev,
              grid: newGrid,
            };
          });

          // Step 3: After gravity animation, check victory
          setTimeout(() => {
            setIsAnimating(false);

            const pending = pendingVictoryRef.current;
            if (pending) {
              pendingVictoryRef.current = null;

              // Check victory
              setGameState((prev) => {
                if (pending.matchesFound >= level.targetPairs || isGridEmpty(prev.grid)) {
                  // Victory!
                  const timeBonus = prev.timeRemaining * SCORE_VALUES.timeBonus;
                  const perfectBonus =
                    wrongAttempts === 0 ? SCORE_VALUES.perfectBonus : 0;

                  setIsVictory(true);
                  setStatus('victory');

                  if (hapticEnabled) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  }

                  const session = endSession();
                  if (session) {
                    recordCompletion(session);
                  }

                  onVictory?.();

                  return {
                    ...prev,
                    score: prev.score + timeBonus + perfectBonus,
                    isPlaying: false,
                  };
                }
                return prev;
              });
            }
          }, GRAVITY_DELAY + 300); // Wait for gravity animation
        }, EXPLOSION_DURATION);
      } else {
        // Invalid match
        if (hapticEnabled) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }

        setWrongAttempts((prev) => prev + 1);

        // Reset combo on wrong match
        setGameState((prev) => ({
          ...prev,
          grid: clearAllSelections(prev.grid),
          selectedBlock: null,
          combo: 0,
        }));
      }
    },
    [
      gameState,
      isVictory,
      isGameOver,
      isAnimating,
      level.targetPairs,
      hapticEnabled,
      wrongAttempts,
      incrementMoves,
      setStatus,
      endSession,
      recordCompletion,
      onVictory,
    ]
  );

  // Reset game
  const reset = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const newState = createInitialState(level);
    setGameState(newState);
    setWrongAttempts(0);
    setIsVictory(false);
    setIsGameOver(false);
    setIsAnimating(false);
    pendingVictoryRef.current = null;
    startSession('math-blocks', level.id, newState);
  }, [level, startSession]);

  // Pause game
  const pause = useCallback(() => {
    setGameState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  // Resume game
  const resume = useCallback(() => {
    if (!isVictory && !isGameOver) {
      setGameState((prev) => ({ ...prev, isPlaying: true }));
    }
  }, [isVictory, isGameOver]);

  return {
    gameState,
    level,
    isVictory,
    isGameOver,
    wrongAttempts,
    isAnimating,
    selectBlock,
    reset,
    pause,
    resume,
  };
}
