/**
 * useMotsCroisesGame Hook
 *
 * Hook principal pour gérer l'état et la logique du jeu Mots Croisés
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { CrosswordLevel, CrosswordGameState, CrosswordResult, WordDirection } from '../types';
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
  getCompletionPercentage,
} from '../logic/crosswordEngine';

// ============================================================================
// TYPES
// ============================================================================

export interface UseMotsCroisesGameReturn {
  /** État actuel du jeu */
  gameState: CrosswordGameState | null;
  /** Résultat (disponible après victoire) */
  result: CrosswordResult | null;
  /** En cours de chargement */
  isLoading: boolean;
  /** Pourcentage de complétion */
  completionPercent: number;
  /** Démarre une nouvelle partie */
  startGame: (level: CrosswordLevel) => void;
  /** Sélectionne une cellule */
  handleCellSelect: (row: number, col: number) => void;
  /** Entre une lettre */
  handleLetterInput: (letter: string) => void;
  /** Efface une lettre */
  handleDelete: () => void;
  /** Sélectionne un mot */
  handleWordSelect: (wordId: string) => void;
  /** Révèle une lettre */
  handleRevealLetter: () => void;
  /** Révèle un mot */
  handleRevealWord: () => void;
  /** Met en pause */
  pauseGame: () => void;
  /** Reprend */
  resumeGame: () => void;
  /** Recommence le niveau */
  restartLevel: () => void;
}

// ============================================================================
// HOOK
// ============================================================================

export function useMotsCroisesGame(): UseMotsCroisesGameReturn {
  // État
  const [gameState, setGameState] = useState<CrosswordGameState | null>(null);
  const [result, setResult] = useState<CrosswordResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Refs
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentLevelRef = useRef<CrosswordLevel | null>(null);

  // ============================================================================
  // TIMER
  // ============================================================================

  const startTimer = useCallback(() => {
    if (timerRef.current) return;

    timerRef.current = setInterval(() => {
      setGameState((prev) => {
        if (!prev || prev.phase !== 'playing') return prev;
        return tickTime(prev);
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  // ============================================================================
  // ACTIONS
  // ============================================================================

  /**
   * Démarre une nouvelle partie
   */
  const startGame = useCallback((level: CrosswordLevel) => {
    setIsLoading(true);
    setResult(null);
    currentLevelRef.current = level;

    const newGameState = createGame(level);
    setGameState(newGameState);
    setIsLoading(false);

    startTimer();
  }, [startTimer]);

  /**
   * Sélectionne une cellule
   */
  const handleCellSelect = useCallback((row: number, col: number) => {
    setGameState((prev) => {
      if (!prev || prev.phase !== 'playing') return prev;
      return selectCell(prev, row, col);
    });
  }, []);

  /**
   * Entre une lettre
   */
  const handleLetterInput = useCallback((letter: string) => {
    setGameState((prev) => {
      if (!prev || prev.phase !== 'playing') return prev;

      const newState = enterLetter(prev, letter);

      // Vérifier la victoire
      if (newState.phase === 'victory') {
        stopTimer();
      }

      return newState;
    });
  }, [stopTimer]);

  /**
   * Efface une lettre
   */
  const handleDelete = useCallback(() => {
    setGameState((prev) => {
      if (!prev || prev.phase !== 'playing') return prev;
      return deleteLetter(prev);
    });
  }, []);

  /**
   * Sélectionne un mot
   */
  const handleWordSelect = useCallback((wordId: string) => {
    setGameState((prev) => {
      if (!prev || prev.phase !== 'playing') return prev;
      return selectWord(prev, wordId);
    });
  }, []);

  /**
   * Révèle une lettre
   */
  const handleRevealLetter = useCallback(() => {
    setGameState((prev) => {
      if (!prev || prev.phase !== 'playing') return prev;

      const newState = revealLetter(prev);

      if (newState.phase === 'victory') {
        stopTimer();
      }

      return newState;
    });
  }, [stopTimer]);

  /**
   * Révèle un mot
   */
  const handleRevealWord = useCallback(() => {
    setGameState((prev) => {
      if (!prev || prev.phase !== 'playing') return prev;

      const newState = revealWord(prev);

      if (newState.phase === 'victory') {
        stopTimer();
      }

      return newState;
    });
  }, [stopTimer]);

  /**
   * Met en pause
   */
  const pauseGame = useCallback(() => {
    stopTimer();
    setGameState((prev) => {
      if (!prev) return prev;
      return { ...prev, phase: 'paused' };
    });
  }, [stopTimer]);

  /**
   * Reprend
   */
  const resumeGame = useCallback(() => {
    setGameState((prev) => {
      if (!prev) return prev;
      return { ...prev, phase: 'playing' };
    });
    startTimer();
  }, [startTimer]);

  /**
   * Recommence le niveau
   */
  const restartLevel = useCallback(() => {
    if (!currentLevelRef.current) return;
    stopTimer();
    startGame(currentLevelRef.current);
  }, [startGame, stopTimer]);

  // ============================================================================
  // EFFETS
  // ============================================================================

  // Calculer le résultat quand le jeu est terminé
  useEffect(() => {
    if (gameState?.phase === 'victory' && !result) {
      const gameResult = calculateResult(gameState);
      setResult(gameResult);
    }
  }, [gameState, result]);

  // Calculer le pourcentage de complétion
  const completionPercent = gameState
    ? getCompletionPercentage(gameState)
    : 0;

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    gameState,
    result,
    isLoading,
    completionPercent,
    startGame,
    handleCellSelect,
    handleLetterInput,
    handleDelete,
    handleWordSelect,
    handleRevealLetter,
    handleRevealWord,
    pauseGame,
    resumeGame,
    restartLevel,
  };
}

export default useMotsCroisesGame;
