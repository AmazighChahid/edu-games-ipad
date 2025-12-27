/**
 * useMemoryGame Hook
 *
 * Hook principal pour gérer l'état et la logique du jeu Memory
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { MemoryGameState, MemoryLevel, MemoryResult } from '../types';
import {
  createGame,
  flipCard,
  checkMatch,
  resetRevealedCards,
  tickTime,
  calculateResult,
  isGameComplete,
} from '../logic/memoryEngine';
import { getThemeSymbols } from '../data/themes';
import { DEFAULT_MEMORY_CONFIG } from '../types';

// ============================================================================
// TYPES
// ============================================================================

export interface UseMemoryGameReturn {
  /** État actuel du jeu */
  gameState: MemoryGameState | null;
  /** Résultat (disponible après victoire) */
  result: MemoryResult | null;
  /** En cours de chargement */
  isLoading: boolean;
  /** Démarre une nouvelle partie */
  startGame: (level: MemoryLevel) => void;
  /** Retourne une carte */
  handleCardFlip: (cardId: string) => void;
  /** Met en pause */
  pauseGame: () => void;
  /** Reprend */
  resumeGame: () => void;
  /** Recommence le niveau */
  restartLevel: () => void;
  /** Demande un indice */
  requestHint: () => void;
}

// ============================================================================
// HOOK
// ============================================================================

export function useMemoryGame(): UseMemoryGameReturn {
  // État
  const [gameState, setGameState] = useState<MemoryGameState | null>(null);
  const [result, setResult] = useState<MemoryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Refs
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const checkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentLevelRef = useRef<MemoryLevel | null>(null);

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
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, [stopTimer]);

  // ============================================================================
  // ACTIONS
  // ============================================================================

  /**
   * Démarre une nouvelle partie
   */
  const startGame = useCallback((level: MemoryLevel) => {
    setIsLoading(true);
    setResult(null);
    currentLevelRef.current = level;

    // Obtenir les symboles du thème
    const symbols = getThemeSymbols(level.theme);

    // Créer le jeu
    const newGameState = createGame(level, symbols);
    setGameState(newGameState);
    setIsLoading(false);

    // Démarrer le timer
    startTimer();
  }, [startTimer]);

  /**
   * Retourne une carte
   */
  const handleCardFlip = useCallback((cardId: string) => {
    setGameState((prev) => {
      if (!prev) return prev;
      if (prev.isChecking || prev.isAnimating) return prev;
      if (prev.phase !== 'playing') return prev;

      // Retourner la carte
      let newState = flipCard(prev, cardId);

      // Si deux cartes sont révélées, vérifier le match
      if (newState.revealedCards.length === 2) {
        const { isMatch, newState: stateAfterCheck } = checkMatch(newState);

        if (!isMatch) {
          // Programmer le retournement des cartes après délai
          checkTimeoutRef.current = setTimeout(() => {
            setGameState((current) => {
              if (!current) return current;
              return resetRevealedCards(current);
            });
          }, DEFAULT_MEMORY_CONFIG.mismatchDelay);
        }

        newState = stateAfterCheck;

        // Vérifier la victoire
        if (isGameComplete(newState)) {
          stopTimer();
        }
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

  /**
   * Demande un indice (TODO: implémenter logique d'indice)
   */
  const requestHint = useCallback(() => {
    // Pour l'instant, juste log
    console.log('Hint requested');
  }, []);

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

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    gameState,
    result,
    isLoading,
    startGame,
    handleCardFlip,
    pauseGame,
    resumeGame,
    restartLevel,
    requestHint,
  };
}

export default useMemoryGame;
