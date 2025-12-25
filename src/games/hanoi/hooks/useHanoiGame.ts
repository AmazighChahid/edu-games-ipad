/**
 * Main Tower of Hanoi game hook
 * Orchestrates game state, moves, and interactions
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics';

import { useStore } from '@/store/useStore';
import type { HanoiGameState, HanoiLevelConfig, TowerId } from '../types';
import {
  createInitialState,
  moveDisk,
  canPlaceDisk,
  getTopDisk,
  checkVictory,
} from '../logic/hanoiEngine';
import { validateMove } from '../logic/moveValidator';
import { getDefaultLevel, getLevel } from '../data/levels';
import { hanoiScripts } from '../data/assistantScripts';

interface UseHanoiGameOptions {
  levelId?: string;
  onVictory?: () => void;
}

export function useHanoiGame(options: UseHanoiGameOptions = {}) {
  const { levelId, onVictory } = options;

  const level = levelId ? getLevel(levelId) : getDefaultLevel();
  if (!level) throw new Error(`Level not found: ${levelId}`);

  const [gameState, setGameState] = useState<HanoiGameState>(() =>
    createInitialState(level)
  );
  const [moveCount, setMoveCount] = useState(0);
  const [invalidMoveCount, setInvalidMoveCount] = useState(0);
  const [consecutiveInvalid, setConsecutiveInvalid] = useState(0);
  const [isVictory, setIsVictory] = useState(false);
  const [lastInvalidReason, setLastInvalidReason] = useState<string | null>(null);

  const {
    hapticEnabled,
    showMessage,
    queueMessage,
    startSession,
    incrementMoves,
    recordInvalidMove,
    setStatus,
    endSession,
    recordCompletion,
  } = useStore();

  const hasShownWelcome = useRef(false);
  const hasShownFirstMove = useRef(false);

  useEffect(() => {
    startSession('hanoi', level.id, gameState);

    if (!hasShownWelcome.current) {
      hasShownWelcome.current = true;
      const welcomeScript = hanoiScripts.find((s) => s.id === 'hanoi_rules');
      if (welcomeScript && welcomeScript.messages[0]) {
        showMessage({
          ...welcomeScript.messages[0],
          triggerType: 'game_start',
        });
      }
    }
  }, [level.id]);

  const reset = useCallback(() => {
    setGameState(createInitialState(level));
    setMoveCount(0);
    setInvalidMoveCount(0);
    setConsecutiveInvalid(0);
    setIsVictory(false);
    setLastInvalidReason(null);
    hasShownFirstMove.current = false;
    startSession('hanoi', level.id, createInitialState(level));
  }, [level, startSession]);

  const selectTower = useCallback(
    (towerId: TowerId) => {
      if (isVictory) return;

      const { selectedDisk, sourceTower } = gameState;

      if (selectedDisk && sourceTower !== null) {
        const validation = validateMove(gameState, {
          from: sourceTower,
          to: towerId,
        });

        if (validation.valid) {
          const newState = moveDisk(gameState, sourceTower, towerId);
          setGameState(newState);
          setMoveCount((c) => c + 1);
          setConsecutiveInvalid(0);
          setLastInvalidReason(null);
          incrementMoves();

          if (hapticEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }

          if (!hasShownFirstMove.current && moveCount === 0) {
            hasShownFirstMove.current = true;
            const firstMoveScript = hanoiScripts.find(
              (s) => s.id === 'hanoi_first_move'
            );
            if (firstMoveScript && firstMoveScript.messages[0]) {
              setTimeout(() => {
                queueMessage({
                  ...firstMoveScript.messages[0],
                  triggerType: 'first_move',
                });
              }, 500);
            }
          }

          if (checkVictory(newState, level)) {
            setIsVictory(true);
            setStatus('victory');

            if (hapticEnabled) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }

            const victoryScript = hanoiScripts.find(
              (s) => s.id === 'hanoi_victory'
            );
            if (victoryScript && victoryScript.messages[0]) {
              queueMessage({
                ...victoryScript.messages[0],
                triggerType: 'victory',
              });
            }

            const session = endSession();
            if (session) {
              recordCompletion(session);
            }

            onVictory?.();
          }
        } else {
          setInvalidMoveCount((c) => c + 1);
          setConsecutiveInvalid((c) => c + 1);
          setLastInvalidReason(validation.reason || null);
          recordInvalidMove();

          if (hapticEnabled) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          }

          const invalidScript = hanoiScripts.find(
            (s) => s.id === 'hanoi_invalid_move'
          );
          if (invalidScript && invalidScript.messages[0]) {
            queueMessage({
              ...invalidScript.messages[0],
              triggerType: 'invalid_move',
            });
          }

          setGameState({ ...gameState, selectedDisk: null, sourceTower: null });
        }
      } else {
        const topDisk = getTopDisk(gameState, towerId);
        if (topDisk) {
          setGameState({
            ...gameState,
            selectedDisk: topDisk,
            sourceTower: towerId,
          });

          if (hapticEnabled) {
            Haptics.selectionAsync();
          }
        }
      }
    },
    [
      gameState,
      isVictory,
      moveCount,
      level,
      hapticEnabled,
      incrementMoves,
      recordInvalidMove,
      queueMessage,
      setStatus,
      endSession,
      recordCompletion,
      onVictory,
    ]
  );

  const canMoveTo = useCallback(
    (towerId: TowerId): boolean => {
      const { selectedDisk } = gameState;
      if (!selectedDisk) return false;
      return canPlaceDisk(gameState, selectedDisk, towerId);
    },
    [gameState]
  );

  const clearSelection = useCallback(() => {
    setGameState({
      ...gameState,
      selectedDisk: null,
      sourceTower: null,
    });
  }, [gameState]);

  // Direct move function for drag & drop
  const performMove = useCallback(
    (from: TowerId, to: TowerId) => {
      if (isVictory || from === to) return;

      const validation = validateMove(gameState, { from, to });

      if (validation.valid) {
        const newState = moveDisk(gameState, from, to);
        setGameState(newState);
        setMoveCount((c) => c + 1);
        setConsecutiveInvalid(0);
        setLastInvalidReason(null);
        incrementMoves();

        if (hapticEnabled) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }

        if (!hasShownFirstMove.current && moveCount === 0) {
          hasShownFirstMove.current = true;
          const firstMoveScript = hanoiScripts.find(
            (s) => s.id === 'hanoi_first_move'
          );
          if (firstMoveScript && firstMoveScript.messages[0]) {
            setTimeout(() => {
              queueMessage({
                ...firstMoveScript.messages[0],
                triggerType: 'first_move',
              });
            }, 500);
          }
        }

        if (checkVictory(newState, level)) {
          setIsVictory(true);
          setStatus('victory');

          if (hapticEnabled) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }

          const victoryScript = hanoiScripts.find(
            (s) => s.id === 'hanoi_victory'
          );
          if (victoryScript && victoryScript.messages[0]) {
            queueMessage({
              ...victoryScript.messages[0],
              triggerType: 'victory',
            });
          }

          const session = endSession();
          if (session) {
            recordCompletion(session);
          }

          onVictory?.();
        }
      } else {
        setInvalidMoveCount((c) => c + 1);
        setConsecutiveInvalid((c) => c + 1);
        setLastInvalidReason(validation.reason || null);
        recordInvalidMove();

        if (hapticEnabled) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }

        const invalidScript = hanoiScripts.find(
          (s) => s.id === 'hanoi_invalid_move'
        );
        if (invalidScript && invalidScript.messages[0]) {
          queueMessage({
            ...invalidScript.messages[0],
            triggerType: 'invalid_move',
          });
        }
      }
    },
    [
      gameState,
      isVictory,
      moveCount,
      level,
      hapticEnabled,
      incrementMoves,
      recordInvalidMove,
      queueMessage,
      setStatus,
      endSession,
      recordCompletion,
      onVictory,
    ]
  );

  return {
    gameState,
    level,
    moveCount,
    invalidMoveCount,
    consecutiveInvalid,
    isVictory,
    lastInvalidReason,
    selectTower,
    canMoveTo,
    clearSelection,
    performMove,
    reset,
  };
}
