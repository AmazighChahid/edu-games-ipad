/**
 * useFabriqueIntro - Hook orchestrateur pour La Fabrique de Réactions
 * ====================================================================
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
  type LevelConfig as UILevelConfig,
} from '../../../components/common';
import { useFabriqueGame } from './useFabriqueGame';
import { useFabriqueSound } from './useFabriqueSound';
import { useActiveProfile, useGameProgress, useStore } from '../../../store/useStore';
import { GEDEON_MESSAGES, getRandomMessage } from '../data/assistantScripts';
import { LEVELS, getLevelByNumber } from '../data/levels';
import type { GedeonExpression, LevelConfig as GameLevelConfig, GridPosition } from '../types';

// ============================================
// TYPES
// ============================================

export interface UseFabriqueIntroReturn {
  // Niveaux UI
  levels: UILevelConfig[];
  selectedLevel: UILevelConfig | null;
  handleSelectLevel: (level: UILevelConfig) => void;

  // État jeu
  isPlaying: boolean;
  isVictory: boolean;

  // Parent drawer
  showParentDrawer: boolean;
  setShowParentDrawer: (show: boolean) => void;

  // Animations
  selectorStyle: ReturnType<typeof useAnimatedStyle>;
  progressPanelStyle: ReturnType<typeof useAnimatedStyle>;

  // Mascot
  mascotMessage: string;
  mascotEmotion: GedeonExpression;

  // Game state
  currentGameLevel: GameLevelConfig | null;
  placedElements: ReturnType<typeof useFabriqueGame>['placedElements'];
  connections: ReturnType<typeof useFabriqueGame>['connections'];
  availableElements: string[];
  selectedSlot: GridPosition | null;
  gameStatus: ReturnType<typeof useFabriqueGame>['status'];

  // Progress data
  progressData: {
    current: number;
    total: number;
    attempts: number;
    hintsUsed: number;
    stars: number;
  };

  // Handlers
  handlePlaceElement: (elementId: string, position: GridPosition) => void;
  handleRemoveElement: (placedId: string) => void;
  handleSelectSlot: (position: GridPosition | null) => void;
  handleRunSimulation: () => void;
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

  // Simulation
  isSimulating: boolean;
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

const TOTAL_LEVELS = 10;

// ============================================
// HOOK
// ============================================

export function useFabriqueIntro(): UseFabriqueIntroReturn {
  const router = useRouter();
  const params = useLocalSearchParams<{ level?: string }>();
  const profile = useActiveProfile();

  // Store - progression
  const gameProgress = useGameProgress('fabrique-reactions');
  const initGameProgress = useStore((state) => state.initGameProgress);

  // Initialiser le progress si nécessaire
  useEffect(() => {
    initGameProgress('fabrique-reactions');
  }, [initGameProgress]);

  // État local
  const [selectedLevel, setSelectedLevel] = useState<UILevelConfig | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [mascotMessage, setMascotMessage] = useState(
    getRandomMessage(GEDEON_MESSAGES.welcome)
  );
  const [mascotEmotion, setMascotEmotion] = useState<GedeonExpression>('neutral');
  const [showParentDrawer, setShowParentDrawer] = useState(false);
  const [currentGameLevel, setCurrentGameLevel] = useState<GameLevelConfig | null>(null);

  // Ref pour tracker l'initialisation
  const hasInitializedRef = useRef(false);
  const lastLevelParamRef = useRef<string | undefined>(undefined);

  // Extraire les IDs des niveaux complétés
  const completedLevelIds = useMemo(() => {
    if (!gameProgress?.completedLevels) return [];
    return Object.keys(gameProgress.completedLevels).map(
      (levelId) => `fabrique-reactions_${levelId}`
    );
  }, [gameProgress?.completedLevels]);

  // Générer les niveaux UI basés sur l'âge
  const levels = useMemo(() => {
    return generateDefaultLevels('fabrique-reactions', profile?.birthDate, completedLevelIds);
  }, [profile?.birthDate, completedLevelIds]);

  // Hook du jeu (seulement quand un niveau est chargé)
  const gameHook = useFabriqueGame({
    level: currentGameLevel || LEVELS[0],
    onLevelComplete: (result) => {
      if (result.success) {
        setIsVictory(true);
        setMascotMessage(getRandomMessage(GEDEON_MESSAGES.success));
        setMascotEmotion('excited');

        // Navigation vers victory
        router.push({
          pathname: '/(games)/14-fabrique-reactions/victory',
          params: {
            level: (selectedLevel?.number || 1).toString(),
            stars: result.stars.toString(),
            moves: result.moves.toString(),
            hintsUsed: result.hintsUsed.toString(),
            time: result.time.toString(),
          },
        });
      }
    },
  });

  // Sons
  const { playSelect, playPlace, playCorrect, playError } = useFabriqueSound();

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
  }, [selectorY, selectorOpacity, progressPanelOpacity]);

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
        let defaultLevel: UILevelConfig | undefined;

        if (params.level) {
          const levelNumber = parseInt(params.level, 10);
          defaultLevel = levels.find((l) => l.number === levelNumber && l.isUnlocked);
        }

        if (!defaultLevel) {
          const firstIncompleteLevel = levels.find(
            (level) => level.isUnlocked && !level.isCompleted
          );
          defaultLevel =
            firstIncompleteLevel || levels.filter((l) => l.isUnlocked).pop() || levels[0];
        }

        if (defaultLevel) {
          setSelectedLevel(defaultLevel);
          const gameLevel = getLevelByNumber(defaultLevel.number);
          setCurrentGameLevel(gameLevel || null);

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
      } catch (error) {
        console.warn('Erreur sélection niveau:', error);
        const level1 = levels[0];
        if (level1) {
          setSelectedLevel(level1);
          setCurrentGameLevel(getLevelByNumber(1) || null);
          setMascotMessage("Niveau 1 ! Parfait pour commencer !");
          setMascotEmotion('happy');
        }
      }
    }
  }, [levels, selectedLevel, params.level]);

  // ============================================
  // EFFECTS - Feedback jeu
  // ============================================

  useEffect(() => {
    if (gameHook.status === 'success') {
      playCorrect();
      setMascotMessage(getRandomMessage(GEDEON_MESSAGES.success));
      setMascotEmotion('excited');
    } else if (gameHook.status === 'error') {
      playError();
      setMascotMessage(getRandomMessage(GEDEON_MESSAGES.error));
      setMascotEmotion('encouraging');
    }
  }, [gameHook.status, playCorrect, playError]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleSelectLevel = useCallback(
    (level: UILevelConfig) => {
      setSelectedLevel(level);
      const gameLevel = getLevelByNumber(level.number);
      setCurrentGameLevel(gameLevel || null);
      gameHook.resetMachine();

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
    },
    [gameHook]
  );

  const handleStartPlaying = useCallback(() => {
    if (!selectedLevel) return;
    transitionToPlayMode();
    setMascotMessage(getRandomMessage(GEDEON_MESSAGES.levelStart));
    setMascotEmotion('excited');
  }, [selectedLevel, transitionToPlayMode]);

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
    setMascotMessage(getRandomMessage(GEDEON_MESSAGES.hint));
    setMascotEmotion('thinking');
  }, []);

  const handleReset = useCallback(() => {
    gameHook.resetMachine();
    setMascotMessage("On recommence ! Observe bien la machine...");
    setMascotEmotion('neutral');
  }, [gameHook]);

  const handleHint = useCallback(() => {
    gameHook.requestHint();
    const hintDialogues = currentGameLevel?.hintDialogues || GEDEON_MESSAGES.hint;
    const hintIndex = Math.min(gameHook.currentHintLevel, hintDialogues.length - 1);
    setMascotMessage(hintDialogues[hintIndex]);
    setMascotEmotion('thinking');
  }, [gameHook, currentGameLevel]);

  const handlePlaceElement = useCallback(
    (elementId: string, position: GridPosition) => {
      if (!isPlaying) {
        transitionToPlayMode();
      }

      const success = gameHook.placeElement(elementId, position);
      if (success) {
        playPlace();
        setMascotMessage(getRandomMessage(GEDEON_MESSAGES.placementOk));
        setMascotEmotion('happy');
      }
    },
    [isPlaying, transitionToPlayMode, gameHook, playPlace]
  );

  const handleRemoveElement = useCallback(
    (placedId: string) => {
      gameHook.removeElement(placedId);
    },
    [gameHook]
  );

  const handleSelectSlot = useCallback(
    (position: GridPosition | null) => {
      if (position) playSelect();
      gameHook.selectSlot(position);
    },
    [gameHook, playSelect]
  );

  const handleRunSimulation = useCallback(() => {
    setMascotMessage(getRandomMessage(GEDEON_MESSAGES.simulating));
    setMascotEmotion('excited');
    gameHook.runSimulation();
  }, [gameHook]);

  const handleForceComplete = useCallback(() => {
    setIsVictory(true);
    router.push({
      pathname: '/(games)/14-fabrique-reactions/victory',
      params: {
        level: (selectedLevel?.number || 1).toString(),
        stars: '3',
        moves: '0',
        hintsUsed: '0',
        time: '0',
      },
    });
  }, [selectedLevel, router]);

  // ============================================
  // RETURN
  // ============================================

  return {
    // Niveaux UI
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
    currentGameLevel,
    placedElements: gameHook.placedElements,
    connections: gameHook.connections,
    availableElements: gameHook.getAvailableElements(),
    selectedSlot: gameHook.selectedSlot,
    gameStatus: gameHook.status,

    // Progress data
    progressData: {
      current: selectedLevel?.number || 1,
      total: TOTAL_LEVELS,
      attempts: gameHook.attempts,
      hintsUsed: gameHook.hintsUsed,
      stars: gameHook.currentStars,
    },

    // Handlers
    handlePlaceElement,
    handleRemoveElement,
    handleSelectSlot,
    handleRunSimulation,
    handleReset,
    handleHint,
    handleBack,
    handleStartPlaying,
    handleParentPress,
    handleHelpPress,
    handleForceComplete,

    // Hints
    hintsRemaining: 3 - gameHook.currentHintLevel,
    canPlayAudio: isPlaying,

    // Simulation
    isSimulating: gameHook.isSimulating,
  };
}

export default useFabriqueIntro;
