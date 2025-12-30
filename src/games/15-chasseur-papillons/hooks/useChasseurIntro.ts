/**
 * useChasseurIntro - Hook orchestrateur pour Chasseur de Papillons
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
import { useChasseurGame } from './useChasseurGame';
import { useChasseurSound } from './useChasseurSound';
import { useActiveProfile, useGameProgress, useStore } from '../../../store/useStore';
import type { FluttyEmotion, Butterfly, GameRule } from '../types';

// ============================================
// TYPES
// ============================================

export interface UseChasseurIntroReturn {
  // Niveaux
  levels: LevelConfig[];
  selectedLevel: LevelConfig | null;
  handleSelectLevel: (level: LevelConfig) => void;

  // État jeu
  isPlaying: boolean;
  isVictory: boolean;

  // Parent drawer
  showParentDrawer: boolean;
  setShowParentDrawer: (show: boolean) => void;

  // Animations (styles animés)
  selectorStyle: ReturnType<typeof useAnimatedStyle>;
  progressPanelStyle: ReturnType<typeof useAnimatedStyle>;

  // Mascot
  mascotMessage: string;
  mascotEmotion: FluttyEmotion;

  // Game state
  gameState: ReturnType<typeof useChasseurGame>['gameState'];
  sessionState: ReturnType<typeof useChasseurGame>['sessionState'];
  currentRule: GameRule | null;
  butterflies: Butterfly[];

  // Progress data pour ProgressPanel
  progressData: {
    currentWave: number;
    totalWaves: number;
    targetsCaught: number;
    wrongCatches: number;
    streak: number;
    bestStreak: number;
    score: number;
    timeRemaining: number;
    accuracy: number;
  };

  // Handlers
  handleCatchButterfly: (butterflyId: string) => void;
  handleReset: () => void;
  handleHint: () => void;
  handleBack: () => void;
  handleStartPlaying: () => void;
  handleNextWave: () => void;
  handleParentPress: () => void;
  handleHelpPress: () => void;
  handleForceComplete: () => void;

  // Hints
  hintsRemaining: number;
  canPlayAudio: boolean;
}

// ============================================
// MESSAGES MASCOTTE
// ============================================

const FLUTTY_MESSAGES = {
  welcome: [
    "Coucou ! Prêt à chasser des papillons ? 🦋",
    "Les papillons volent ! Attrape les bons !",
    "Observe bien les couleurs avant d'attraper !",
  ],
  start: [
    "C'est parti ! Attrape les bons papillons !",
    "Regarde bien la consigne et chasse !",
    "Les papillons arrivent ! Concentre-toi !",
  ],
  success: [
    "Bravo ! Tu as attrapé le bon ! 🎉",
    "Super ! Continue comme ça ! ⭐",
    "Bien joué ! Tes yeux sont rapides ! 👁️",
  ],
  error: [
    "Oups ! Ce n'était pas le bon. Relis la consigne !",
    "Pas grave ! Observe mieux les couleurs.",
    "Ce n'était pas celui-là. Prends ton temps !",
  ],
  streak: [
    "Waouh ! Quelle série ! 🔥",
    "Tu es en feu ! Continue ! ⚡",
    "Incroyable concentration ! 🌟",
  ],
  waveComplete: [
    "Vague terminée ! Prêt pour la suite ?",
    "Bien joué ! Nouvelle règle dans 3... 2... 1...",
    "Super ! Une autre vague arrive !",
  ],
  hint: "Je te montre lesquels attraper ! ✨",
};

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

// ============================================
// HOOK
// ============================================

export function useChasseurIntro(): UseChasseurIntroReturn {
  const router = useRouter();
  const params = useLocalSearchParams<{ level?: string }>();
  const profile = useActiveProfile();

  // Store - progression
  const gameProgress = useGameProgress('chasseur-papillons');
  const initGameProgress = useStore((state) => state.initGameProgress);

  // Initialiser le progress si nécessaire
  useEffect(() => {
    initGameProgress('chasseur-papillons');
  }, [initGameProgress]);

  // État local
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [mascotMessage, setMascotMessage] = useState(FLUTTY_MESSAGES.welcome[0]);
  const [mascotEmotion, setMascotEmotion] = useState<FluttyEmotion>('neutral');
  const [showParentDrawer, setShowParentDrawer] = useState(false);

  // Extraire les IDs des niveaux complétés depuis le store
  const completedLevelIds = useMemo(() => {
    if (!gameProgress?.completedLevels) return [];
    return Object.keys(gameProgress.completedLevels).map(
      (levelId) => `chasseur-papillons_${levelId}`
    );
  }, [gameProgress?.completedLevels]);

  // Générer les niveaux basés sur l'âge de l'enfant et les niveaux complétés
  const levels = useMemo(() => {
    return generateDefaultLevels('chasseur-papillons', profile?.birthDate, completedLevelIds);
  }, [profile?.birthDate, completedLevelIds]);

  // Hook du jeu
  const currentLevel = selectedLevel?.number || 1;
  const gameHook = useChasseurGame({
    initialLevel: currentLevel,
  });

  const {
    gameState,
    sessionState,
    accuracy,
    isWaveComplete,
    isLevelComplete,
    initLevel,
    startWave,
    catchButterfly,
    nextWave,
    requestHint,
    resetGame,
    hintsRemaining,
  } = gameHook;

  // Sons
  const {
    playCatch,
    playWrong,
    playMiss,
    playStreak,
    playWaveComplete,
    playVictory,
    startAmbient,
    stopAmbient,
  } = useChasseurSound();

  // Ref pour tracker l'initialisation
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

    selectorY.value = withTiming(ANIMATION_CONFIG.selectorSlideDistance, {
      duration: ANIMATION_CONFIG.selectorSlideDuration,
      easing: Easing.out(Easing.quad),
    });
    selectorOpacity.value = withTiming(0, {
      duration: ANIMATION_CONFIG.selectorFadeDuration,
    });

    progressPanelOpacity.value = withDelay(
      ANIMATION_CONFIG.progressDelayDuration,
      withTiming(1, { duration: ANIMATION_CONFIG.selectorFadeDuration })
    );

    setTimeout(() => {
      setIsPlaying(true);
    }, 300);
  }, [isPlaying, selectorY, selectorOpacity, progressPanelOpacity]);

  const transitionToSelectionMode = useCallback(() => {
    selectorY.value = withSpring(0, {
      damping: ANIMATION_CONFIG.springDamping,
      stiffness: ANIMATION_CONFIG.springStiffness,
    });
    selectorOpacity.value = withTiming(1, {
      duration: ANIMATION_CONFIG.selectorFadeDuration,
    });

    progressPanelOpacity.value = withTiming(0, { duration: 200 });

    setIsPlaying(false);
    stopAmbient();
  }, [selectorY, selectorOpacity, progressPanelOpacity, stopAmbient]);

  // ============================================
  // EFFECTS - Sélection automatique niveau
  // ============================================

  useEffect(() => {
    const levelParamChanged = params.level !== lastLevelParamRef.current;
    if (levelParamChanged) {
      lastLevelParamRef.current = params.level;
    }

    if (levels.length > 0 && (!selectedLevel || levelParamChanged)) {
      try {
        let defaultLevel: LevelConfig | undefined;

        if (params.level) {
          const levelNumber = parseInt(params.level, 10);
          defaultLevel = levels.find((l) => l.number === levelNumber && l.isUnlocked);
        }

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
                ? 'Parfait pour s\'entraîner !'
                : defaultLevel.difficulty === 'hard'
                ? 'Un vrai défi de concentration !'
                : 'Bonne difficulté !'
            }`
          );
          setMascotEmotion('happy');
        }
      } catch {
        const level1 = levels[0];
        if (level1) {
          setSelectedLevel(level1);
          setMascotMessage(FLUTTY_MESSAGES.welcome[0]);
          setMascotEmotion('neutral');
        }
      }
    }
  }, [levels, selectedLevel, params.level]);

  // Initialiser le niveau au chargement
  useEffect(() => {
    if (selectedLevel && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      initLevel(selectedLevel.number);
    }
  }, [selectedLevel, initLevel]);

  // ============================================
  // EFFECTS - Feedback jeu
  // ============================================

  // Gestion des captures
  const lastTargetsCaughtRef = useRef(0);
  const lastWrongCatchesRef = useRef(0);
  const lastStreakRef = useRef(0);

  useEffect(() => {
    // Bonne capture
    if (gameState.targetsCaught > lastTargetsCaughtRef.current) {
      playCatch();
      const messages = FLUTTY_MESSAGES.success;
      setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
      setMascotEmotion('happy');

      // Streak bonus
      if (gameState.streak > 0 && gameState.streak % 3 === 0) {
        playStreak();
        const streakMessages = FLUTTY_MESSAGES.streak;
        setMascotMessage(streakMessages[Math.floor(Math.random() * streakMessages.length)]);
        setMascotEmotion('excited');
      }
    }
    lastTargetsCaughtRef.current = gameState.targetsCaught;

    // Mauvaise capture
    if (gameState.wrongCatches > lastWrongCatchesRef.current) {
      playWrong();
      const messages = FLUTTY_MESSAGES.error;
      setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
      setMascotEmotion('encouraging');
    }
    lastWrongCatchesRef.current = gameState.wrongCatches;

    lastStreakRef.current = gameState.streak;
  }, [gameState.targetsCaught, gameState.wrongCatches, gameState.streak, playCatch, playWrong, playStreak]);

  // Fin de vague
  useEffect(() => {
    if (gameState.status === 'wave_complete') {
      playWaveComplete();
      const messages = FLUTTY_MESSAGES.waveComplete;
      setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
      setMascotEmotion('happy');
    }
  }, [gameState.status, playWaveComplete]);

  // Victoire
  useEffect(() => {
    if (gameState.status === 'victory') {
      playVictory();
      setIsVictory(true);
      stopAmbient();

      const totalTimeMs = Date.now() - sessionState.startTime.getTime();
      router.push({
        pathname: '/(games)/15-chasseur-papillons/victory',
        params: {
          score: gameState.score.toString(),
          targetsCaught: gameState.targetsCaught.toString(),
          wrongCatches: gameState.wrongCatches.toString(),
          bestStreak: gameState.bestStreak.toString(),
          accuracy: Math.round(accuracy * 100).toString(),
          totalTime: totalTimeMs.toString(),
          level: currentLevel.toString(),
          hintsUsed: gameState.hintsUsed.toString(),
        },
      });
    }
  }, [gameState.status, playVictory, stopAmbient, router, gameState, sessionState, accuracy, currentLevel]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleSelectLevel = useCallback((level: LevelConfig) => {
    setSelectedLevel(level);
    setMascotMessage(
      `Niveau ${level.number} ! ${
        level.difficulty === 'easy'
          ? 'Parfait pour s\'entraîner !'
          : level.difficulty === 'hard'
          ? 'Un vrai défi de concentration !'
          : 'Bonne difficulté !'
      }`
    );
    setMascotEmotion('happy');
    initLevel(level.number);
  }, [initLevel]);

  const handleStartPlaying = useCallback(() => {
    if (!selectedLevel) return;
    transitionToPlayMode();
    startAmbient();
    startWave();
    const messages = FLUTTY_MESSAGES.start;
    setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
    setMascotEmotion('excited');
  }, [selectedLevel, transitionToPlayMode, startAmbient, startWave]);

  const handleCatchButterfly = useCallback((butterflyId: string) => {
    // Transition vers mode jeu si pas encore en train de jouer
    if (!isPlaying) {
      transitionToPlayMode();
      startAmbient();
      startWave();
    }
    catchButterfly(butterflyId);
  }, [isPlaying, transitionToPlayMode, startAmbient, startWave, catchButterfly]);

  const handleNextWave = useCallback(() => {
    nextWave();
    startWave();
    setMascotMessage("Nouvelle vague ! Concentre-toi sur la nouvelle règle !");
    setMascotEmotion('neutral');
  }, [nextWave, startWave]);

  const handleBack = useCallback(() => {
    if (isPlaying) {
      transitionToSelectionMode();
      setMascotMessage("On recommence ? Choisis un niveau !");
      setMascotEmotion('encouraging');
    } else {
      router.replace('/');
    }
  }, [isPlaying, router, transitionToSelectionMode]);

  const handleParentPress = useCallback(() => {
    setShowParentDrawer(true);
  }, []);

  const handleHelpPress = useCallback(() => {
    setMascotMessage("Lis bien la consigne en haut de l'écran !");
    setMascotEmotion('thinking');
  }, []);

  const handleReset = useCallback(() => {
    resetGame();
    setMascotMessage("On recommence ! Prêt ?");
    setMascotEmotion('neutral');
  }, [resetGame]);

  const handleHint = useCallback(() => {
    requestHint();
    setMascotMessage(FLUTTY_MESSAGES.hint);
    setMascotEmotion('thinking');
  }, [requestHint]);

  const handleForceComplete = useCallback(() => {
    setIsVictory(true);
    stopAmbient();
    const totalTimeMs = Date.now() - sessionState.startTime.getTime();
    router.push({
      pathname: '/(games)/15-chasseur-papillons/victory',
      params: {
        score: '1000',
        targetsCaught: '30',
        wrongCatches: '0',
        bestStreak: '10',
        accuracy: '100',
        totalTime: totalTimeMs.toString(),
        level: currentLevel.toString(),
        hintsUsed: '0',
      },
    });
  }, [stopAmbient, sessionState.startTime, currentLevel, router]);

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

    // Parent drawer
    showParentDrawer,
    setShowParentDrawer,

    // Animations
    selectorStyle,
    progressPanelStyle,

    // Mascot
    mascotMessage,
    mascotEmotion,

    // Game state
    gameState,
    sessionState,
    currentRule: gameState.currentRule,
    butterflies: gameState.butterflies,

    // Progress data
    progressData: {
      currentWave: gameState.currentWave,
      totalWaves: gameState.level?.totalWaves || 0,
      targetsCaught: gameState.targetsCaught,
      wrongCatches: gameState.wrongCatches,
      streak: gameState.streak,
      bestStreak: gameState.bestStreak,
      score: gameState.score,
      timeRemaining: gameState.timeRemaining,
      accuracy,
    },

    // Handlers
    handleCatchButterfly,
    handleReset,
    handleHint,
    handleBack,
    handleStartPlaying,
    handleNextWave,
    handleParentPress,
    handleHelpPress,
    handleForceComplete,

    // Hints
    hintsRemaining,
    canPlayAudio: isPlaying,
  };
}

export default useChasseurIntro;
