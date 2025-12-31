/**
 * useLogixGridGame Hook
 *
 * Hook principal pour gérer l'état et la logique du jeu Logix Grid
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { LogixPuzzle, LogixGameState, LogixResult, CellState } from '../types';
import {
  createGame,
  toggleCellState,
  setCellState,
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
  isPlayerStuck,
} from '../logic/logixEngine';

// ============================================================================
// TYPES
// ============================================================================

export interface UseLogixGridGameReturn {
  /** État actuel du jeu */
  gameState: LogixGameState | null;
  /** Résultat (disponible après victoire) */
  result: LogixResult | null;
  /** En cours de chargement */
  isLoading: boolean;
  /** Erreurs dans la grille */
  errors: Array<{ rowItemId: string; colItemId: string }>;
  /** Initialise le jeu sans démarrer le timer (pour afficher la grille en mode intro) */
  initGame: (puzzle: LogixPuzzle) => void;
  /** Démarre une nouvelle partie (lance le timer) */
  startGame: (puzzle: LogixPuzzle) => void;
  /** Toggle l'état d'une cellule */
  handleCellToggle: (rowItemId: string, colItemId: string) => void;
  /** Définit l'état d'une cellule */
  handleCellSet: (rowItemId: string, colItemId: string, state: CellState) => void;
  /** Sélectionne une cellule */
  handleCellSelect: (rowItemId: string | null, colItemId: string | null) => void;
  /** Marque un indice comme utilisé */
  handleClueUse: (clueId: string) => void;
  /** Demande un indice */
  handleHintRequest: () => void;
  /** Met en pause */
  pauseGame: () => void;
  /** Reprend */
  resumeGame: () => void;
  /** Recommence le niveau */
  restartLevel: () => void;
  /** Obtient l'état d'une cellule */
  getCellStateValue: (rowItemId: string, colItemId: string) => CellState;
}

// ============================================================================
// HOOK
// ============================================================================

export function useLogixGridGame(): UseLogixGridGameReturn {
  // État
  const [gameState, setGameState] = useState<LogixGameState | null>(null);
  const [result, setResult] = useState<LogixResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Array<{ rowItemId: string; colItemId: string }>>([]);

  // Refs
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentPuzzleRef = useRef<LogixPuzzle | null>(null);

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
   * Initialise le jeu sans démarrer le timer (pour afficher la grille en mode intro)
   */
  const initGame = useCallback((puzzle: LogixPuzzle) => {
    setResult(null);
    setErrors([]);
    currentPuzzleRef.current = puzzle;

    const newGameState = createGame(puzzle);
    // En mode intro, on garde la phase 'intro' pour désactiver les cellules
    setGameState({ ...newGameState, phase: 'intro' });
  }, []);

  /**
   * Démarre une nouvelle partie (passe en mode playing et lance le timer)
   */
  const startGame = useCallback((puzzle: LogixPuzzle) => {
    setIsLoading(true);
    setResult(null);
    setErrors([]);
    currentPuzzleRef.current = puzzle;

    const newGameState = createGame(puzzle);
    setGameState(newGameState);
    setIsLoading(false);

    startTimer();
  }, [startTimer]);

  /**
   * Toggle l'état d'une cellule
   */
  const handleCellToggle = useCallback((rowItemId: string, colItemId: string) => {
    setGameState((prev) => {
      if (!prev || prev.phase !== 'playing') return prev;

      let newState = toggleCellState(prev, rowItemId, colItemId);

      // Appliquer l'auto-exclusion si on a mis un "yes"
      const cell = newState.grid.find(
        (c) =>
          (c.rowItemId === rowItemId && c.colItemId === colItemId) ||
          (c.rowItemId === colItemId && c.colItemId === rowItemId)
      );
      if (cell?.state === 'yes') {
        newState = applyAutoExclusion(newState);
      }

      // Vérifier si résolu
      if (isPuzzleSolved(newState)) {
        stopTimer();
        return { ...newState, phase: 'victory' };
      }

      return newState;
    });
  }, [stopTimer]);

  /**
   * Définit l'état d'une cellule
   */
  const handleCellSet = useCallback((rowItemId: string, colItemId: string, state: CellState) => {
    setGameState((prev) => {
      if (!prev || prev.phase !== 'playing') return prev;

      let newState = setCellState(prev, rowItemId, colItemId, state);

      // Appliquer l'auto-exclusion si on a mis un "yes"
      if (state === 'yes') {
        newState = applyAutoExclusion(newState);
      }

      // Vérifier si résolu
      if (isPuzzleSolved(newState)) {
        stopTimer();
        return { ...newState, phase: 'victory' };
      }

      return newState;
    });
  }, [stopTimer]);

  /**
   * Sélectionne une cellule
   */
  const handleCellSelect = useCallback((rowItemId: string | null, colItemId: string | null) => {
    setGameState((prev) => {
      if (!prev) return prev;
      return selectCell(prev, rowItemId, colItemId);
    });
  }, []);

  /**
   * Marque un indice comme utilisé
   */
  const handleClueUse = useCallback((clueId: string) => {
    setGameState((prev) => {
      if (!prev || prev.phase !== 'playing') return prev;
      return markClueUsed(prev, clueId);
    });
  }, []);

  /**
   * Demande un indice
   */
  const handleHintRequest = useCallback(() => {
    setGameState((prev) => {
      if (!prev || prev.phase !== 'playing') return prev;
      return requestHint(prev);
    });

    // Effacer l'indice après quelques secondes
    setTimeout(() => {
      setGameState((prev) => {
        if (!prev) return prev;
        return clearHint(prev);
      });
    }, 5000);
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
    if (!currentPuzzleRef.current) return;
    stopTimer();
    startGame(currentPuzzleRef.current);
  }, [startGame, stopTimer]);

  /**
   * Obtient l'état d'une cellule
   */
  const getCellStateValue = useCallback((rowItemId: string, colItemId: string): CellState => {
    if (!gameState) return 'empty';
    return getCellState(gameState.grid, rowItemId, colItemId);
  }, [gameState]);

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

  // Vérifier les erreurs périodiquement
  useEffect(() => {
    if (gameState?.phase === 'playing') {
      const newErrors = getGridErrors(gameState);
      setErrors(newErrors);
    }
  }, [gameState]);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    gameState,
    result,
    isLoading,
    errors,
    initGame,
    startGame,
    handleCellToggle,
    handleCellSet,
    handleCellSelect,
    handleClueUse,
    handleHintRequest,
    pauseGame,
    resumeGame,
    restartLevel,
    getCellStateValue,
  };
}

export default useLogixGridGame;
