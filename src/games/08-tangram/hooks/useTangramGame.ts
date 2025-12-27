/**
 * useTangramGame Hook
 *
 * Hook principal pour gérer l'état et la logique du jeu Tangram
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { TangramGameState, TangramLevel, TangramResult } from '../types';
import { DEFAULT_TANGRAM_CONFIG } from '../types';
import {
  createGame,
  movePiece,
  rotatePiece,
  flipPiece,
  selectPiece,
  trySnapPiece,
  tickTime,
  calculateResult,
  isPuzzleComplete,
  getHint,
} from '../logic/tangramEngine';

// ============================================================================
// TYPES
// ============================================================================

export interface UseTangramGameReturn {
  /** État actuel du jeu */
  gameState: TangramGameState | null;
  /** Résultat (disponible après victoire) */
  result: TangramResult | null;
  /** En cours de chargement */
  isLoading: boolean;
  /** Démarre une nouvelle partie */
  startGame: (level: TangramLevel) => void;
  /** Déplace une pièce */
  handleMove: (pieceId: string, deltaX: number, deltaY: number) => void;
  /** Termine le déplacement (tente le snap) */
  handleMoveEnd: (pieceId: string) => void;
  /** Tourne une pièce */
  handleRotate: (pieceId: string, clockwise?: boolean) => void;
  /** Retourne une pièce */
  handleFlip: (pieceId: string) => void;
  /** Sélectionne une pièce */
  handleSelect: (pieceId: string | null) => void;
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

export function useTangramGame(): UseTangramGameReturn {
  // État
  const [gameState, setGameState] = useState<TangramGameState | null>(null);
  const [result, setResult] = useState<TangramResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Refs
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentLevelRef = useRef<TangramLevel | null>(null);

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
  const startGame = useCallback((level: TangramLevel) => {
    setIsLoading(true);
    setResult(null);
    currentLevelRef.current = level;

    const newGameState = createGame(level);
    setGameState(newGameState);
    setIsLoading(false);

    startTimer();
  }, [startTimer]);

  /**
   * Déplace une pièce
   */
  const handleMove = useCallback((pieceId: string, deltaX: number, deltaY: number) => {
    setGameState((prev) => {
      if (!prev || prev.phase !== 'playing') return prev;
      return movePiece(prev, pieceId, deltaX, deltaY);
    });
  }, []);

  /**
   * Termine le déplacement et tente le snap
   */
  const handleMoveEnd = useCallback((pieceId: string) => {
    setGameState((prev) => {
      if (!prev || prev.phase !== 'playing') return prev;

      const newState = trySnapPiece(prev, pieceId, DEFAULT_TANGRAM_CONFIG);

      // Vérifier la victoire
      if (isPuzzleComplete(newState)) {
        stopTimer();
      }

      return newState;
    });
  }, [stopTimer]);

  /**
   * Tourne une pièce
   */
  const handleRotate = useCallback((pieceId: string, clockwise: boolean = true) => {
    setGameState((prev) => {
      if (!prev || prev.phase !== 'playing') return prev;
      const degrees = clockwise ? DEFAULT_TANGRAM_CONFIG.rotationStep : -DEFAULT_TANGRAM_CONFIG.rotationStep;
      return rotatePiece(prev, pieceId, degrees);
    });
  }, []);

  /**
   * Retourne une pièce
   */
  const handleFlip = useCallback((pieceId: string) => {
    setGameState((prev) => {
      if (!prev || prev.phase !== 'playing') return prev;
      return flipPiece(prev, pieceId);
    });
  }, []);

  /**
   * Sélectionne une pièce
   */
  const handleSelect = useCallback((pieceId: string | null) => {
    setGameState((prev) => {
      if (!prev) return prev;
      return selectPiece(prev, pieceId);
    });
  }, []);

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
   * Demande un indice
   */
  const requestHint = useCallback(() => {
    setGameState((prev) => {
      if (!prev || prev.phase !== 'playing') return prev;
      if (prev.hintsUsed >= prev.level.hintsAvailable) return prev;
      return getHint(prev);
    });
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
    handleMove,
    handleMoveEnd,
    handleRotate,
    handleFlip,
    handleSelect,
    pauseGame,
    resumeGame,
    restartLevel,
    requestHint,
  };
}

export default useTangramGame;
