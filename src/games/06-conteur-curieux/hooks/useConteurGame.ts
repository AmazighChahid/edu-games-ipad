/**
 * useConteurGame Hook
 *
 * Hook principal pour gérer l'état et la logique du jeu Conteur Curieux
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { ConteurLevel, ConteurGameState, ConteurResult } from '../types';
import {
  createGame,
  startReading,
  nextParagraph,
  previousParagraph,
  finishReading,
  selectOption,
  validateAnswer,
  requestHint,
  hideHint,
  tickReadingTime,
  tickQuestionsTime,
  calculateResult,
  getCurrentQuestion,
  getCurrentParagraph,
  getReadingProgress,
  getQuestionsProgress,
} from '../logic/conteurEngine';

// ============================================================================
// TYPES
// ============================================================================

export interface UseConteurGameReturn {
  /** État actuel du jeu */
  gameState: ConteurGameState | null;
  /** Résultat (disponible après les questions) */
  result: ConteurResult | null;
  /** En cours de chargement */
  isLoading: boolean;
  /** Question actuelle */
  currentQuestion: ReturnType<typeof getCurrentQuestion> | null;
  /** Paragraphe actuel */
  currentParagraphText: string;
  /** Progression lecture */
  readingProgress: number;
  /** Progression questions */
  questionsProgress: number;
  /** Démarre une nouvelle partie */
  startGame: (level: ConteurLevel) => void;
  /** Commence la lecture */
  handleStartReading: () => void;
  /** Passe au paragraphe suivant */
  handleNextParagraph: () => void;
  /** Retourne au paragraphe précédent */
  handlePreviousParagraph: () => void;
  /** Termine la lecture */
  handleFinishReading: () => void;
  /** Sélectionne une option */
  handleSelectOption: (optionId: string) => void;
  /** Valide la réponse */
  handleValidateAnswer: () => void;
  /** Demande un indice */
  handleRequestHint: () => void;
  /** Cache l'indice */
  handleHideHint: () => void;
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

export function useConteurGame(): UseConteurGameReturn {
  // État
  const [gameState, setGameState] = useState<ConteurGameState | null>(null);
  const [result, setResult] = useState<ConteurResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Refs
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentLevelRef = useRef<ConteurLevel | null>(null);

  // ============================================================================
  // TIMER
  // ============================================================================

  const startTimer = useCallback(() => {
    if (timerRef.current) return;

    timerRef.current = setInterval(() => {
      setGameState((prev) => {
        if (!prev || prev.phase === 'paused' || prev.phase === 'intro' || prev.phase === 'results') {
          return prev;
        }

        if (prev.phase === 'reading') {
          return tickReadingTime(prev);
        } else if (prev.phase === 'questions') {
          return tickQuestionsTime(prev);
        }

        return prev;
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

  const startGame = useCallback((level: ConteurLevel) => {
    setIsLoading(true);
    setResult(null);
    currentLevelRef.current = level;

    const newGameState = createGame(level);
    setGameState(newGameState);
    setIsLoading(false);
  }, []);

  const handleStartReading = useCallback(() => {
    setGameState((prev) => {
      if (!prev) return prev;
      return startReading(prev);
    });
    startTimer();
  }, [startTimer]);

  const handleNextParagraph = useCallback(() => {
    setGameState((prev) => {
      if (!prev || prev.phase !== 'reading') return prev;
      return nextParagraph(prev);
    });
  }, []);

  const handlePreviousParagraph = useCallback(() => {
    setGameState((prev) => {
      if (!prev || prev.phase !== 'reading') return prev;
      return previousParagraph(prev);
    });
  }, []);

  const handleFinishReading = useCallback(() => {
    setGameState((prev) => {
      if (!prev) return prev;
      return finishReading(prev);
    });
  }, []);

  const handleSelectOption = useCallback((optionId: string) => {
    setGameState((prev) => {
      if (!prev || prev.phase !== 'questions') return prev;
      return selectOption(prev, optionId);
    });
  }, []);

  const handleValidateAnswer = useCallback(() => {
    setGameState((prev) => {
      if (!prev || prev.phase !== 'questions') return prev;

      const newState = validateAnswer(prev);

      if (newState.phase === 'results') {
        stopTimer();
      }

      return newState;
    });
  }, [stopTimer]);

  const handleRequestHint = useCallback(() => {
    setGameState((prev) => {
      if (!prev || prev.phase !== 'questions') return prev;
      return requestHint(prev);
    });
  }, []);

  const handleHideHint = useCallback(() => {
    setGameState((prev) => {
      if (!prev) return prev;
      return hideHint(prev);
    });
  }, []);

  const pauseGame = useCallback(() => {
    stopTimer();
    setGameState((prev) => {
      if (!prev) return prev;
      return { ...prev, phase: 'paused' };
    });
  }, [stopTimer]);

  const resumeGame = useCallback(() => {
    setGameState((prev) => {
      if (!prev) return prev;
      // Retourner à la phase précédente (reading ou questions)
      const previousPhase = prev.playerAnswers.length > 0 ? 'questions' : 'reading';
      return { ...prev, phase: previousPhase };
    });
    startTimer();
  }, [startTimer]);

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
    if (gameState?.phase === 'results' && !result) {
      const gameResult = calculateResult(gameState);
      setResult(gameResult);
    }
  }, [gameState, result]);

  // Calculer les valeurs dérivées
  const currentQuestion = gameState
    ? getCurrentQuestion(gameState)
    : null;

  const currentParagraphText = gameState
    ? getCurrentParagraph(gameState)
    : '';

  const readingProgress = gameState
    ? getReadingProgress(gameState)
    : 0;

  const questionsProgress = gameState
    ? getQuestionsProgress(gameState)
    : 0;

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    gameState,
    result,
    isLoading,
    currentQuestion,
    currentParagraphText,
    readingProgress,
    questionsProgress,
    startGame,
    handleStartReading,
    handleNextParagraph,
    handlePreviousParagraph,
    handleFinishReading,
    handleSelectOption,
    handleValidateAnswer,
    handleRequestHint,
    handleHideHint,
    pauseGame,
    resumeGame,
    restartLevel,
  };
}

export default useConteurGame;
