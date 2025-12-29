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
  /** Demande un indice - révèle brièvement une paire non trouvée */
  requestHint: () => void;
  /** Carte actuellement mise en évidence par l'indice */
  hintCardId: string | null;
}

// ============================================================================
// HOOK
// ============================================================================

export function useMemoryGame(): UseMemoryGameReturn {
  // État
  const [gameState, setGameState] = useState<MemoryGameState | null>(null);
  const [result, setResult] = useState<MemoryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hintCardId, setHintCardId] = useState<string | null>(null);

  // Refs
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const checkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
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
   * Demande un indice - révèle brièvement une paire non trouvée
   * L'indice montre une carte cachée pendant 1.5 secondes
   */
  const requestHint = useCallback(() => {
    if (!gameState) return;
    if (gameState.phase !== 'playing') return;
    if (gameState.isChecking || gameState.isAnimating) return;
    if (hintCardId) return; // Indice déjà en cours

    // Trouver une carte cachée (non révélée, non matchée)
    const hiddenCards = gameState.cards.filter(
      (card) => card.state === 'hidden' && !gameState.revealedCards.includes(card.id)
    );

    if (hiddenCards.length === 0) return;

    // Choisir une carte au hasard parmi les cachées
    const randomCard = hiddenCards[Math.floor(Math.random() * hiddenCards.length)];

    // Révéler temporairement la carte
    setHintCardId(randomCard.id);
    setGameState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        cards: prev.cards.map((c) =>
          c.id === randomCard.id ? { ...c, state: 'revealed' as const } : c
        ),
      };
    });

    // Cacher la carte après 1.5 secondes
    hintTimeoutRef.current = setTimeout(() => {
      setHintCardId(null);
      setGameState((prev) => {
        if (!prev) return prev;
        // Ne cacher que si la carte n'a pas été matchée entre temps
        const card = prev.cards.find((c) => c.id === randomCard.id);
        if (card && card.state === 'revealed' && !prev.revealedCards.includes(randomCard.id)) {
          return {
            ...prev,
            cards: prev.cards.map((c) =>
              c.id === randomCard.id ? { ...c, state: 'hidden' as const } : c
            ),
          };
        }
        return prev;
      });
    }, 1500);
  }, [gameState, hintCardId]);

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
    hintCardId,
  };
}

export default useMemoryGame;
