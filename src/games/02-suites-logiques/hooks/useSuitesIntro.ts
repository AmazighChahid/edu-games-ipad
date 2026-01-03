/**
 * useSuitesIntro - Hook orchestrateur pour Suites Logiques
 *
 * VERSION MIGRÉE (Janvier 2026)
 * Utilise useGameIntroOrchestrator pour la logique commune.
 * Ce fichier ne contient plus que la logique spécifique au jeu.
 *
 * @see docs/GAME_ARCHITECTURE.md pour le pattern complet
 */

import { useCallback, useEffect, useRef } from 'react';

import { useGameIntroOrchestrator, type EmotionType } from '../../../hooks';
import type { LevelConfig } from '../../../components/common';
import { useSuitesGame } from './useSuitesGame';
import { useSuitesSound } from './useSuitesSound';
import { PIXEL_MESSAGES } from '../data/gameConfig';
import type { SequenceElement } from '../types';

// Re-export EmotionType for backward compatibility
export type { EmotionType } from '../../../hooks';

// ============================================
// TYPES
// ============================================

export interface UseSuitesIntroReturn {
  // Niveaux (depuis orchestrator)
  levels: LevelConfig[];
  selectedLevel: LevelConfig | null;
  handleSelectLevel: (level: LevelConfig) => void;

  // État jeu (depuis orchestrator)
  isPlaying: boolean;
  isVictory: boolean;

  // Parent drawer (depuis orchestrator)
  showParentDrawer: boolean;
  setShowParentDrawer: (show: boolean) => void;

  // Mascot (depuis orchestrator)
  mascotMessage: string;
  mascotEmotion: EmotionType;

  // Game state (spécifique)
  gameState: ReturnType<typeof useSuitesGame>['gameState'];
  sessionState: ReturnType<typeof useSuitesGame>['sessionState'];
  currentSequence: ReturnType<typeof useSuitesGame>['currentSequence'];

  // Progress data pour ProgressPanel
  progressData: {
    current: number;
    total: number;
    streak: number;
    maxStreak: number;
    totalAttempts: number;
    correctFirstTry: number;
    failedAttempts: number;
  };

  // Handlers
  handleSelectAnswer: (element: SequenceElement) => void;
  handleConfirm: () => void;
  handleReset: () => void;
  handleHint: () => void;
  handleBack: () => void;
  handleStartPlaying: () => void;
  handleParentPress: () => void;
  handleHelpPress: () => void;
  handleForceComplete: () => void;

  // Hints
  hintsRemaining: number;
  canPlayAudio: boolean;
}

// ============================================
// CONSTANTS
// ============================================

const TOTAL_SEQUENCES = 8;

// ============================================
// HOOK
// ============================================

export function useSuitesIntro(): UseSuitesIntroReturn {
  // ============================================
  // ORCHESTRATOR (logique commune factorisée)
  // ============================================
  const orchestrator = useGameIntroOrchestrator({
    gameId: 'suites-logiques',
    mascotMessages: {
      welcome: 'Bip bop ! Choisis un niveau pour commencer !',
      startPlaying: "C'est parti ! Trouve ce qui vient après !",
      backToSelection: 'On recommence ? Choisis un niveau !',
      help: "Observe bien la suite ! Qu'est-ce qui se répète ?",
    },
  });

  // ============================================
  // GAME HOOK (spécifique à Suites Logiques)
  // ============================================
  const currentLevel = orchestrator.selectedLevel?.number || 1;
  const gameHook = useSuitesGame({
    theme: 'shapes',
    initialLevel: currentLevel,
  });

  const {
    gameState,
    sessionState,
    currentSequence,
    selectAnswer,
    confirmAnswer,
    requestHint,
    nextSequence,
    isSessionComplete,
  } = gameHook;

  // ============================================
  // SONS
  // ============================================
  const { playSelect, playCorrect, playError } = useSuitesSound();

  // ============================================
  // REFS
  // ============================================
  const hasInitializedRef = useRef(false);

  // ============================================
  // EFFECTS - Initialisation séquence
  // ============================================
  useEffect(() => {
    if (orchestrator.selectedLevel && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      const timer = setTimeout(() => {
        nextSequence(orchestrator.selectedLevel?.number);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [orchestrator.selectedLevel, nextSequence]);

  // ============================================
  // EFFECTS - Feedback jeu (success/error)
  // ============================================
  useEffect(() => {
    if (gameState.status === 'success') {
      playCorrect();
      const messages = PIXEL_MESSAGES.success;
      orchestrator.setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
      orchestrator.setMascotEmotion('excited');

      const timer = setTimeout(() => {
        if (isSessionComplete) {
          orchestrator.setIsVictory(true);
          const totalTimeMs = Date.now() - sessionState.startTime.getTime();
          orchestrator.router.push({
            pathname: '/(games)/02-suites-logiques/victory',
            params: {
              completed: sessionState.sequencesCompleted.toString(),
              correctFirstTry: sessionState.sequencesCorrectFirstTry.toString(),
              maxStreak: sessionState.maxStreak.toString(),
              totalTime: totalTimeMs.toString(),
              level: currentLevel.toString(),
              hintsUsed: sessionState.totalHints.toString(),
            },
          });
        } else {
          nextSequence(orchestrator.selectedLevel?.number);
          const startMessages = PIXEL_MESSAGES.start;
          orchestrator.setMascotMessage(startMessages[Math.floor(Math.random() * startMessages.length)]);
          orchestrator.setMascotEmotion('neutral');
        }
      }, 1200);

      return () => clearTimeout(timer);
    } else if (gameState.status === 'error') {
      playError();
      const messages = PIXEL_MESSAGES.error;
      orchestrator.setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
      orchestrator.setMascotEmotion('encouraging');
    }
  }, [
    gameState.status,
    playCorrect,
    playError,
    isSessionComplete,
    nextSequence,
    sessionState,
    currentLevel,
    orchestrator,
  ]);

  // ============================================
  // HANDLERS SPÉCIFIQUES
  // ============================================

  const handleSelectLevel = useCallback(
    (level: LevelConfig) => {
      orchestrator.handleSelectLevel(level);
      nextSequence(level.number);
    },
    [orchestrator, nextSequence]
  );

  const handleReset = useCallback(() => {
    nextSequence(orchestrator.selectedLevel?.number);
    orchestrator.setMascotMessage('Nouvelle suite ! Observe bien...');
    orchestrator.setMascotEmotion('neutral');
  }, [nextSequence, orchestrator]);

  const handleHint = useCallback(() => {
    requestHint();
    orchestrator.setMascotMessage(PIXEL_MESSAGES.hint1);
    orchestrator.setMascotEmotion('thinking');
  }, [requestHint, orchestrator]);

  const handleSelectAnswer = useCallback(
    (element: SequenceElement) => {
      if (!orchestrator.isPlaying) {
        orchestrator.transitionToPlayMode();
      }
      playSelect();
      selectAnswer(element);
      orchestrator.setMascotMessage("Bip ! Clique sur 'Valider' !");
      orchestrator.setMascotEmotion('happy');
    },
    [orchestrator, selectAnswer, playSelect]
  );

  const handleConfirm = useCallback(() => {
    confirmAnswer();
  }, [confirmAnswer]);

  const handleForceComplete = useCallback(() => {
    orchestrator.setIsVictory(true);
    const totalTimeMs = Date.now() - sessionState.startTime.getTime();
    orchestrator.router.push({
      pathname: '/(games)/02-suites-logiques/victory',
      params: {
        completed: TOTAL_SEQUENCES.toString(),
        correctFirstTry: TOTAL_SEQUENCES.toString(),
        maxStreak: TOTAL_SEQUENCES.toString(),
        totalTime: totalTimeMs.toString(),
        level: currentLevel.toString(),
        hintsUsed: '0',
      },
    });
  }, [sessionState.startTime, currentLevel, orchestrator]);

  // ============================================
  // RETURN
  // ============================================

  return {
    // Depuis orchestrator
    levels: orchestrator.levels,
    selectedLevel: orchestrator.selectedLevel,
    handleSelectLevel,
    isPlaying: orchestrator.isPlaying,
    isVictory: orchestrator.isVictory,
    showParentDrawer: orchestrator.showParentDrawer,
    setShowParentDrawer: orchestrator.setShowParentDrawer,
    mascotMessage: orchestrator.mascotMessage,
    mascotEmotion: orchestrator.mascotEmotion,

    // Spécifique au jeu
    gameState,
    sessionState,
    currentSequence,

    // Progress data
    progressData: {
      current: sessionState.sequencesCompleted,
      total: TOTAL_SEQUENCES,
      streak: sessionState.currentStreak,
      maxStreak: sessionState.maxStreak,
      totalAttempts: sessionState.totalAttempts,
      correctFirstTry: sessionState.sequencesCorrectFirstTry,
      failedAttempts: sessionState.totalAttempts - sessionState.sequencesCompleted,
    },

    // Handlers
    handleSelectAnswer,
    handleConfirm,
    handleReset,
    handleHint,
    handleBack: orchestrator.handleBack,
    handleStartPlaying: orchestrator.handleStartPlaying,
    handleParentPress: orchestrator.handleParentPress,
    handleHelpPress: orchestrator.handleHelpPress,
    handleForceComplete,

    // Hints
    hintsRemaining: 4 - gameState.currentHintLevel,
    canPlayAudio: orchestrator.isPlaying,
  };
}
