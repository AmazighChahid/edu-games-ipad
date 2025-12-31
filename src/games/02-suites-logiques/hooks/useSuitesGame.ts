import { useState, useCallback, useMemo } from 'react';
import {
  GameState,
  SessionState,
  Sequence,
  SequenceElement,
  ThemeType,
} from '../types';
import { GAME_CONFIG } from '../data/gameConfig';
import { useSequenceGenerator } from './useSequenceGenerator';
import { useStreakTracker } from './useStreakTracker';
import { suitesLogiquesLevels, getLevelByOrder, SuitesLogiquesLevel } from '../data/levels';

// ============================================
// HOOK PRINCIPAL DU JEU
// ============================================

interface UseSuitesGameProps {
  theme: ThemeType;
  initialLevel?: number;
}

export function useSuitesGame({
  theme,
  initialLevel = 1,
}: UseSuitesGameProps) {
  // État du jeu
  const [gameState, setGameState] = useState<GameState>({
    currentSequence: null,
    selectedAnswer: null,
    attempts: 0,
    hintsUsed: 0,
    currentHintLevel: 0,
    isComplete: false,
    status: 'idle',
  });

  // État de la session
  const [sessionState, setSessionState] = useState<SessionState>({
    sequencesCompleted: 0,
    sequencesCorrectFirstTry: 0,
    totalAttempts: 0,
    totalHints: 0,
    currentStreak: 0,
    maxStreak: 0,
    currentLevel: initialLevel,
    startTime: new Date(),
    theme,
  });

  // Récupérer les informations du niveau actuel depuis levels.ts
  const currentLevelInfo: SuitesLogiquesLevel | undefined = useMemo(() => {
    return getLevelByOrder(sessionState.currentLevel);
  }, [sessionState.currentLevel]);

  // Nombre d'indices disponibles pour ce niveau (depuis levels.ts)
  const maxHintsForLevel = currentLevelInfo?.hintsAvailable ?? 3;

  // Générateur de séquences
  const { generateSequence } = useSequenceGenerator(theme);

  // Tracker de séries
  const { streak, incrementStreak, resetStreak } = useStreakTracker();

  // Séquence courante
  const currentSequence = gameState.currentSequence;

  // Session complète ?
  const isSessionComplete =
    sessionState.sequencesCompleted >= GAME_CONFIG.sequencesPerSession;

  // Sélectionner une réponse
  const selectAnswer = useCallback(
    (element: SequenceElement) => {
      if (gameState.status === 'checking' || gameState.status === 'success')
        return;

      setGameState(prev => ({
        ...prev,
        selectedAnswer: element,
        status: 'selected',
      }));
    },
    [gameState.status]
  );

  // Confirmer la réponse
  const confirmAnswer = useCallback(() => {
    const { selectedAnswer, currentSequence } = gameState;
    if (!selectedAnswer || !currentSequence) return;

    setGameState(prev => ({ ...prev, status: 'checking' }));

    // Vérifier si la réponse est correcte
    const isCorrect = selectedAnswer.id === currentSequence.correctAnswer.id;

    setTimeout(() => {
      if (isCorrect) {
        // Succès !
        const wasFirstTry = gameState.attempts === 0;
        incrementStreak();

        setGameState(prev => ({
          ...prev,
          status: 'success',
          isComplete: true,
        }));

        setSessionState(prev => {
          const newState = {
            ...prev,
            sequencesCompleted: prev.sequencesCompleted + 1,
            sequencesCorrectFirstTry:
              prev.sequencesCorrectFirstTry + (wasFirstTry ? 1 : 0),
            totalAttempts: prev.totalAttempts + gameState.attempts + 1,
            currentStreak: streak + 1,
            maxStreak: Math.max(prev.maxStreak, streak + 1),
          };

          // Vérifier si on peut monter de niveau
          const { sequences, successRate, maxHintRate } = GAME_CONFIG.levelUpThreshold;
          const currentSuccessRate = newState.sequencesCorrectFirstTry / newState.sequencesCompleted || 0;
          const currentHintRate = newState.totalHints / newState.sequencesCompleted || 0;

          if (
            newState.sequencesCompleted >= sequences &&
            currentSuccessRate >= successRate &&
            currentHintRate <= maxHintRate &&
            newState.currentLevel < suitesLogiquesLevels.length
          ) {
            newState.currentLevel = prev.currentLevel + 1;
          }

          return newState;
        });
      } else {
        // Erreur
        const newAttempts = gameState.attempts + 1;

        // Vérifier si on doit afficher un indice automatique
        const shouldShowHint = GAME_CONFIG.hintThresholds.includes(newAttempts);
        const newHintLevel = shouldShowHint
          ? (Math.min(gameState.currentHintLevel + 1, 4) as 0 | 1 | 2 | 3 | 4)
          : gameState.currentHintLevel;

        // Si on atteint le max d'essais, révéler la réponse
        const hasReachedMaxAttempts = newAttempts >= GAME_CONFIG.maxAttempts;

        setGameState(prev => ({
          ...prev,
          attempts: newAttempts,
          selectedAnswer: null,
          status: hasReachedMaxAttempts ? 'success' : 'error',
          currentHintLevel: hasReachedMaxAttempts ? 4 : newHintLevel,
          isComplete: hasReachedMaxAttempts,
        }));

        if (hasReachedMaxAttempts) {
          // Compter comme échec
          resetStreak();
          setSessionState(prev => ({
            ...prev,
            sequencesCompleted: prev.sequencesCompleted + 1,
            totalAttempts: prev.totalAttempts + newAttempts,
            currentStreak: 0,
          }));
        }
      }
    }, 300); // Délai pour l'animation
  }, [gameState, incrementStreak, resetStreak, streak]);

  // Demander un indice manuellement
  // Limite basée sur hintsAvailable du niveau (depuis levels.ts)
  const requestHint = useCallback(() => {
    // Vérifier si on a atteint la limite d'indices pour ce niveau
    if (gameState.hintsUsed >= maxHintsForLevel) return;
    if (gameState.currentHintLevel >= 4) return;

    setGameState(prev => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
      currentHintLevel: Math.min(prev.currentHintLevel + 1, 4) as
        | 0
        | 1
        | 2
        | 3
        | 4,
      status: 'hint',
    }));

    setSessionState(prev => ({
      ...prev,
      totalHints: prev.totalHints + 1,
    }));

    // Retour à idle après l'animation d'indice
    setTimeout(() => {
      setGameState(prev => ({ ...prev, status: 'idle' }));
    }, GAME_CONFIG.animationDurations.hint);
  }, [gameState.currentHintLevel, gameState.hintsUsed, maxHintsForLevel]);

  // Passer à la séquence suivante
  // levelOverride permet de forcer un niveau (utile au premier appel)
  const nextSequence = useCallback((levelOverride?: number) => {
    const levelToUse = levelOverride ?? sessionState.currentLevel;
    console.log('[nextSequence] levelOverride:', levelOverride, 'sessionState.currentLevel:', sessionState.currentLevel, '→ levelToUse:', levelToUse);
    const newSequence = generateSequence(levelToUse);
    console.log('[nextSequence] Generated sequence with difficulty:', newSequence.difficulty, 'pattern:', newSequence.patternDef?.type);

    setGameState({
      currentSequence: newSequence,
      selectedAnswer: null,
      attempts: 0,
      hintsUsed: 0,
      currentHintLevel: 0,
      isComplete: false,
      status: 'idle',
    });
  }, [generateSequence, sessionState.currentLevel]);

  // Vérifier si on peut monter de niveau
  const checkLevelUp = useCallback(() => {
    const { sequences, successRate, maxHintRate } =
      GAME_CONFIG.levelUpThreshold;

    const currentLevelSequences = sessionState.sequencesCompleted;
    const currentSuccessRate =
      sessionState.sequencesCorrectFirstTry / sessionState.sequencesCompleted ||
      0;
    const currentHintRate =
      sessionState.totalHints / sessionState.sequencesCompleted || 0;

    if (
      currentLevelSequences >= sequences &&
      currentSuccessRate >= successRate &&
      currentHintRate <= maxHintRate &&
      sessionState.currentLevel < suitesLogiquesLevels.length
    ) {
      setSessionState(prev => ({
        ...prev,
        currentLevel: prev.currentLevel + 1,
      }));
      return true;
    }
    return false;
  }, [sessionState]);

  return {
    gameState,
    sessionState,
    currentSequence,
    selectAnswer,
    confirmAnswer,
    requestHint,
    nextSequence,
    isSessionComplete,
    checkLevelUp,
    // Nouvelles données depuis levels.ts
    currentLevelInfo,
    maxHintsForLevel,
    hintsRemaining: maxHintsForLevel - gameState.hintsUsed,
  };
}
