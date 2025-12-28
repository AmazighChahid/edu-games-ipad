/**
 * useSuitesIntro - Hook orchestrateur pour Suites Logiques
 *
 * Encapsule toute la logique métier de l'écran d'introduction :
 * - Progression store (lecture/écriture)
 * - Paramètres URL
 * - Génération des niveaux
 * - Messages mascotte
 * - Sons
 * - Animations de transition
 * - Navigation
 *
 * @see docs/GAME_ARCHITECTURE.md pour le pattern complet
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';

import {
  generateDefaultLevels,
  type LevelConfig,
} from '../../../components/common';
import { useSuitesGame } from './useSuitesGame';
import { useSuitesSound } from './useSuitesSound';
import { useActiveProfile, useGameProgress, useStore } from '../../../store/useStore';
import { PIXEL_MESSAGES } from '../constants/gameConfig';
import type { SequenceElement } from '../types';

// ============================================
// TYPES
// ============================================

export type EmotionType = 'neutral' | 'happy' | 'thinking' | 'excited' | 'encouraging';

export interface UseSuitesIntroReturn {
  // Niveaux
  levels: LevelConfig[];
  selectedLevel: LevelConfig | null;
  handleSelectLevel: (level: LevelConfig) => void;

  // État jeu
  isPlaying: boolean;
  isVictory: boolean;

  // Animations (styles animés)
  selectorStyle: ReturnType<typeof useAnimatedStyle>;
  progressPanelStyle: ReturnType<typeof useAnimatedStyle>;

  // Mascot
  mascotMessage: string;
  mascotEmotion: EmotionType;

  // Game state (depuis useSuitesGame)
  gameState: ReturnType<typeof useSuitesGame>['gameState'];
  sessionState: ReturnType<typeof useSuitesGame>['sessionState'];
  currentSequence: ReturnType<typeof useSuitesGame>['currentSequence'];

  // Progress data pour ProgressPanel
  progressData: {
    current: number;
    total: number;
    streak: number;
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
  handleForceComplete: () => void; // DEV: Force complete level

  // Hints
  hintsRemaining: number;
  canPlayAudio: boolean;
}

// ============================================
// CONSTANTS
// ============================================

const ANIMATION_CONFIG = {
  selectorSlideDuration: 400,
  selectorFadeDuration: 300,
  progressDelayDuration: 200,
  selectorSlideDistance: -150,
  springDamping: 15,
  springStiffness: 150,
};

const TOTAL_SEQUENCES = 8;

// ============================================
// HOOK
// ============================================

export function useSuitesIntro(): UseSuitesIntroReturn {
  const router = useRouter();
  const params = useLocalSearchParams<{ level?: string }>();
  const profile = useActiveProfile();

  // Store - progression
  const gameProgress = useGameProgress('suites-logiques');
  const initGameProgress = useStore((state) => state.initGameProgress);

  // Initialiser le progress si nécessaire
  useEffect(() => {
    initGameProgress('suites-logiques');
  }, [initGameProgress]);

  // État local
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [mascotMessage, setMascotMessage] = useState("Bip bop ! Choisis un niveau pour commencer !");
  const [mascotEmotion, setMascotEmotion] = useState<EmotionType>('neutral');

  // Extraire les IDs des niveaux complétés depuis le store
  const completedLevelIds = useMemo(() => {
    if (!gameProgress?.completedLevels) return [];
    return Object.keys(gameProgress.completedLevels).map(
      (levelId) => `suites-logiques_${levelId}`
    );
  }, [gameProgress?.completedLevels]);

  // Générer les niveaux basés sur l'âge de l'enfant et les niveaux complétés
  const levels = useMemo(() => {
    return generateDefaultLevels('suites-logiques', profile?.birthDate, completedLevelIds);
  }, [profile?.birthDate, completedLevelIds]);

  // Hook du jeu
  const currentLevel = selectedLevel?.number || 1;
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

  // Sons
  const { playSelect, playCorrect, playError } = useSuitesSound();

  // Ref pour tracker l'initialisation et les paramètres URL
  const hasInitializedRef = useRef(false);
  const lastLevelParamRef = useRef<string | undefined>(undefined);

  // ============================================
  // ANIMATIONS
  // ============================================

  const selectorY = useSharedValue(0);
  const selectorOpacity = useSharedValue(1);
  const progressPanelOpacity = useSharedValue(0);

  const selectorStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: selectorY.value }],
    opacity: selectorOpacity.value,
  }));

  const progressPanelStyle = useAnimatedStyle(() => ({
    opacity: progressPanelOpacity.value,
  }));

  // ============================================
  // TRANSITIONS
  // ============================================

  const transitionToPlayMode = useCallback(() => {
    if (isPlaying) return;

    // Vue 1 → Vue 2: Slide selector up and fade out
    selectorY.value = withTiming(ANIMATION_CONFIG.selectorSlideDistance, {
      duration: ANIMATION_CONFIG.selectorSlideDuration,
      easing: Easing.out(Easing.quad),
    });
    selectorOpacity.value = withTiming(0, {
      duration: ANIMATION_CONFIG.selectorFadeDuration,
    });

    // Fade in progress panel
    progressPanelOpacity.value = withDelay(
      ANIMATION_CONFIG.progressDelayDuration,
      withTiming(1, { duration: ANIMATION_CONFIG.selectorFadeDuration })
    );

    // Start playing after animation
    setTimeout(() => {
      setIsPlaying(true);
    }, 300);
  }, [isPlaying, selectorY, selectorOpacity, progressPanelOpacity]);

  const transitionToSelectionMode = useCallback(() => {
    // Vue 2 → Vue 1: Show selector with spring animation
    selectorY.value = withSpring(0, {
      damping: ANIMATION_CONFIG.springDamping,
      stiffness: ANIMATION_CONFIG.springStiffness,
    });
    selectorOpacity.value = withTiming(1, {
      duration: ANIMATION_CONFIG.selectorFadeDuration,
    });

    // Hide progress panel
    progressPanelOpacity.value = withTiming(0, { duration: 200 });

    setIsPlaying(false);
  }, [selectorY, selectorOpacity, progressPanelOpacity]);

  // ============================================
  // EFFECTS - Sélection automatique niveau
  // ============================================

  useEffect(() => {
    // Si le paramètre level a changé (depuis victory.tsx), forcer la mise à jour
    const levelParamChanged = params.level !== lastLevelParamRef.current;
    if (levelParamChanged) {
      lastLevelParamRef.current = params.level;
    }

    if (levels.length > 0 && (!selectedLevel || levelParamChanged)) {
      try {
        let defaultLevel: LevelConfig | undefined;

        // Si un niveau est passé en paramètre URL (depuis victory.tsx)
        if (params.level) {
          const levelNumber = parseInt(params.level, 10);
          defaultLevel = levels.find((l) => l.number === levelNumber && l.isUnlocked);
        }

        // Sinon, trouver le premier niveau débloqué mais non complété
        if (!defaultLevel) {
          const firstIncompleteLevel = levels.find(
            (level) => level.isUnlocked && !level.isCompleted
          );

          defaultLevel = firstIncompleteLevel ||
            levels.filter(l => l.isUnlocked).pop() ||
            levels[0];
        }

        if (defaultLevel) {
          setSelectedLevel(defaultLevel);
          setMascotMessage(
            `Niveau ${defaultLevel.number} ! ${
              defaultLevel.difficulty === 'easy'
                ? 'Parfait pour commencer !'
                : defaultLevel.difficulty === 'hard'
                ? 'Un vrai défi !'
                : 'Bonne difficulté !'
            }`
          );
          setMascotEmotion('happy');
        }
      } catch {
        // En cas d'erreur, sélectionner le niveau 1
        const level1 = levels[0];
        if (level1) {
          setSelectedLevel(level1);
          setMascotMessage("Niveau 1 ! Parfait pour commencer !");
          setMascotEmotion('happy');
        }
      }
    }
  }, [levels, selectedLevel, params.level]);

  // Générer une séquence au chargement initial
  useEffect(() => {
    if (selectedLevel && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      const timer = setTimeout(() => {
        nextSequence();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedLevel, nextSequence]);

  // ============================================
  // EFFECTS - Feedback jeu
  // ============================================

  useEffect(() => {
    if (gameState.status === 'success') {
      playCorrect();
      const messages = PIXEL_MESSAGES.success;
      setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
      setMascotEmotion('excited');

      // Passer à la suite suivante après délai
      const timer = setTimeout(() => {
        if (isSessionComplete) {
          setIsVictory(true);
          // Calculer le temps total depuis le début de la session
          const totalTimeMs = Date.now() - sessionState.startTime.getTime();
          // Navigation vers victory avec les stats
          router.push({
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
          nextSequence();
          const startMessages = PIXEL_MESSAGES.start;
          setMascotMessage(startMessages[Math.floor(Math.random() * startMessages.length)]);
          setMascotEmotion('neutral');
        }
      }, 1200);

      return () => clearTimeout(timer);
    } else if (gameState.status === 'error') {
      playError();
      const messages = PIXEL_MESSAGES.error;
      setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
      setMascotEmotion('encouraging');
    }
  }, [
    gameState.status,
    playCorrect,
    playError,
    isSessionComplete,
    nextSequence,
    router,
    sessionState,
    currentLevel,
  ]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleSelectLevel = useCallback((level: LevelConfig) => {
    setSelectedLevel(level);
    setMascotMessage(
      `Niveau ${level.number} ! ${
        level.difficulty === 'easy'
          ? 'Parfait pour commencer !'
          : level.difficulty === 'hard'
          ? 'Un vrai défi !'
          : 'Bonne difficulté !'
      }`
    );
    setMascotEmotion('happy');
    nextSequence();
  }, [nextSequence]);

  const handleStartPlaying = useCallback(() => {
    if (!selectedLevel) return;
    transitionToPlayMode();
    setMascotMessage("C'est parti ! Trouve ce qui vient après !");
    setMascotEmotion('excited');
  }, [selectedLevel, transitionToPlayMode]);

  const handleBack = useCallback(() => {
    if (isPlaying) {
      transitionToSelectionMode();
      setMascotMessage("On recommence ? Choisis un niveau !");
      setMascotEmotion('encouraging');
    } else {
      router.back();
    }
  }, [isPlaying, router, transitionToSelectionMode]);

  const handleParentPress = useCallback(() => {
    router.push('/(parent)');
  }, [router]);

  const handleHelpPress = useCallback(() => {
    setMascotMessage("Observe bien la suite ! Qu'est-ce qui se répète ?");
    setMascotEmotion('thinking');
  }, []);

  const handleReset = useCallback(() => {
    nextSequence();
    setMascotMessage("Nouvelle suite ! Observe bien...");
    setMascotEmotion('neutral');
  }, [nextSequence]);

  const handleHint = useCallback(() => {
    requestHint();
    setMascotMessage(PIXEL_MESSAGES.hint1);
    setMascotEmotion('thinking');
  }, [requestHint]);

  const handleSelectAnswer = useCallback(
    (element: SequenceElement) => {
      // Transition vers mode jeu si pas encore en train de jouer
      if (!isPlaying) {
        transitionToPlayMode();
      }
      playSelect();
      selectAnswer(element);
      setMascotMessage("Bip ! Clique sur 'Valider' !");
      setMascotEmotion('happy');
    },
    [isPlaying, transitionToPlayMode, selectAnswer, playSelect]
  );

  const handleConfirm = useCallback(() => {
    confirmAnswer();
  }, [confirmAnswer]);

  // DEV: Force complete level (for testing)
  const handleForceComplete = useCallback(() => {
    setIsVictory(true);
    const totalTimeMs = Date.now() - sessionState.startTime.getTime();
    router.push({
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
  }, [sessionState.startTime, currentLevel, router]);

  // ============================================
  // RETURN
  // ============================================

  return {
    // Niveaux
    levels,
    selectedLevel,
    handleSelectLevel,

    // État jeu
    isPlaying,
    isVictory,

    // Animations
    selectorStyle,
    progressPanelStyle,

    // Mascot
    mascotMessage,
    mascotEmotion,

    // Game state
    gameState,
    sessionState,
    currentSequence,

    // Progress data
    progressData: {
      current: sessionState.sequencesCompleted,
      total: TOTAL_SEQUENCES,
      streak: sessionState.currentStreak,
    },

    // Handlers
    handleSelectAnswer,
    handleConfirm,
    handleReset,
    handleHint,
    handleBack,
    handleStartPlaying,
    handleParentPress,
    handleHelpPress,
    handleForceComplete,

    // Hints
    hintsRemaining: 4 - gameState.currentHintLevel,
    canPlayAudio: isPlaying,
  };
}
