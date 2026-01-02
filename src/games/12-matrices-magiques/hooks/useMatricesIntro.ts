/**
 * useMatricesIntro - Hook orchestrateur pour Matrices Magiques
 *
 * Encapsule toute la logique métier de l'écran d'introduction :
 * - Progression store (lecture/écriture)
 * - Paramètres URL
 * - Génération des niveaux par monde
 * - Messages mascotte (Pixel)
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
import { useMatricesGame } from './useMatricesGame';
import { useMatricesSound } from './useMatricesSound';
import { useActiveProfile, useGameProgress, useStore } from '../../../store/useStore';
import { WORLDS_ARRAY, getWorldById } from '../data/worlds';
import { MATRICES_LEVELS } from '../data/levels';
import type { WorldConfig, WorldTheme } from '../types';

// ============================================
// TYPES
// ============================================

export type EmotionType = 'neutral' | 'happy' | 'thinking' | 'excited' | 'encouraging';

export interface UseMatricesIntroReturn {
  // Mondes
  worlds: WorldConfig[];
  selectedWorld: WorldConfig | null;
  handleSelectWorld: (worldId: string) => void;

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

  // Mascot (Pixel)
  pixelMessage: string;
  pixelEmotion: EmotionType;

  // Game state (depuis useMatricesGame)
  puzzle: ReturnType<typeof useMatricesGame>['puzzle'];
  gameState: ReturnType<typeof useMatricesGame>['gameState'];
  selectedChoice: ReturnType<typeof useMatricesGame>['selectedChoice'];
  hintsRemaining: ReturnType<typeof useMatricesGame>['hintsRemaining'];

  // Progress data pour ProgressPanel
  progressData: {
    current: number;
    total: number;
    streak: number;
    score: number;
  };

  // Handlers
  handleSelectChoice: (choiceIndex: number) => void;
  handleValidate: () => void;
  handleRequestHint: () => void;
  handleBack: () => void;
  handleStartPlaying: () => void;
  handleParentPress: () => void;
  handleHelpPress: () => void;
  handleNextPuzzle: () => void;
  handleRestartLevel: () => void;
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

const PIXEL_MESSAGES = {
  welcome: "Bienvenue dans les Matrices Magiques ! Choisis un monde !",
  worldSelect: [
    "Quel monde veux-tu explorer ?",
    "Chaque monde a ses mystères...",
    "Choisis ton aventure !",
  ],
  levelSelect: [
    "Prêt pour ce niveau ?",
    "Les puzzles t'attendent !",
  ],
  thinking: [
    "Observe bien les patterns...",
    "Regarde ligne par ligne...",
    "Qu'est-ce qui change ?",
  ],
  correct: [
    "Bravo ! C'est ça !",
    "Excellent ! Tu as trouvé !",
    "Super logique !",
  ],
  error: [
    "Pas tout à fait... Réessaie !",
    "Presque ! Regarde encore.",
    "Hmm, observe mieux !",
  ],
  hint: "Je te donne un indice...",
  victory: "Félicitations ! Tu as réussi !",
};

// ============================================
// HOOK
// ============================================

export function useMatricesIntro(): UseMatricesIntroReturn {
  const router = useRouter();
  const params = useLocalSearchParams<{ level?: string; world?: string }>();
  const profile = useActiveProfile();

  // Store - progression
  const gameProgress = useGameProgress('matrices-magiques');
  const initGameProgress = useStore((state) => state.initGameProgress);

  // Initialiser le progress si nécessaire
  useEffect(() => {
    initGameProgress('matrices-magiques');
  }, [initGameProgress]);

  // État local
  const [selectedWorld, setSelectedWorld] = useState<WorldConfig | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [pixelMessage, setPixelMessage] = useState(PIXEL_MESSAGES.welcome);
  const [pixelEmotion, setPixelEmotion] = useState<EmotionType>('neutral');
  const [showParentDrawer, setShowParentDrawer] = useState(false);

  // Extraire les IDs des niveaux complétés depuis le store
  const completedLevelIds = useMemo(() => {
    if (!gameProgress?.completedLevels) return [];
    return Object.keys(gameProgress.completedLevels).map(
      (levelId) => `matrices-magiques_${levelId}`
    );
  }, [gameProgress?.completedLevels]);

  // Générer les niveaux basés sur l'âge de l'enfant et les niveaux complétés
  const levels = useMemo(() => {
    return generateDefaultLevels('matrices-magiques', profile?.birthDate, completedLevelIds);
  }, [profile?.birthDate, completedLevelIds]);

  // Hook du jeu
  const gameHook = useMatricesGame();

  const {
    puzzle,
    gameState,
    selectedChoice,
    hintsRemaining,
    selectChoice,
    submitAnswer,
    requestHint,
    nextPuzzle,
    resetPuzzle,
    startGame,
    puzzleIndex,
    totalPuzzles,
    sessionScore,
  } = gameHook;

  // Sons
  const { playSelect, playCorrect, playError, playHint, playLevelUp } = useMatricesSound();

  // Ref pour tracker l'initialisation
  const hasInitializedRef = useRef(false);

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
  // EFFECTS - Sélection automatique
  // ============================================

  useEffect(() => {
    // Sélectionner le premier monde par défaut
    if (WORLDS_ARRAY.length > 0 && !selectedWorld) {
      const worldId = (params.world || 'forest') as WorldTheme;
      const world = getWorldById(worldId) || WORLDS_ARRAY[0];
      setSelectedWorld(world);
    }
  }, [selectedWorld, params.world]);

  useEffect(() => {
    if (levels.length > 0 && !selectedLevel && selectedWorld) {
      const worldLevels = levels.filter(l => {
        const matricesLevel = MATRICES_LEVELS.find(ml => ml.number === l.number);
        return matricesLevel?.worldId === selectedWorld.id;
      });

      if (worldLevels.length > 0) {
        const firstUnlocked = worldLevels.find(l => l.isUnlocked && !l.isCompleted)
          || worldLevels.find(l => l.isUnlocked)
          || worldLevels[0];
        setSelectedLevel(firstUnlocked);
      }
    }
  }, [levels, selectedLevel, selectedWorld]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleSelectWorld = useCallback((worldId: string) => {
    const world = getWorldById(worldId as WorldTheme);
    if (world) {
      setSelectedWorld(world);
      setSelectedLevel(null);
      const messages = PIXEL_MESSAGES.worldSelect;
      setPixelMessage(messages[Math.floor(Math.random() * messages.length)]);
      setPixelEmotion('happy');
    }
  }, []);

  const handleSelectLevel = useCallback((level: LevelConfig) => {
    setSelectedLevel(level);
    const messages = PIXEL_MESSAGES.levelSelect;
    setPixelMessage(messages[Math.floor(Math.random() * messages.length)]);
    setPixelEmotion('happy');
  }, []);

  const handleStartPlaying = useCallback(() => {
    if (!selectedLevel || !selectedWorld) return;
    transitionToPlayMode();
    startGame(selectedWorld.id as WorldTheme, selectedLevel.number);
    const messages = PIXEL_MESSAGES.thinking;
    setPixelMessage(messages[Math.floor(Math.random() * messages.length)]);
    setPixelEmotion('thinking');
  }, [selectedLevel, selectedWorld, transitionToPlayMode, startGame]);

  const handleBack = useCallback(() => {
    if (isPlaying) {
      transitionToSelectionMode();
      setPixelMessage(PIXEL_MESSAGES.welcome);
      setPixelEmotion('encouraging');
    } else {
      router.replace('/');
    }
  }, [isPlaying, router, transitionToSelectionMode]);

  const handleParentPress = useCallback(() => {
    setShowParentDrawer(true);
  }, []);

  const handleHelpPress = useCallback(() => {
    const messages = PIXEL_MESSAGES.thinking;
    setPixelMessage(messages[Math.floor(Math.random() * messages.length)]);
    setPixelEmotion('thinking');
  }, []);

  const handleSelectChoice = useCallback((choiceIndex: number) => {
    playSelect();
    selectChoice(choiceIndex);
  }, [selectChoice, playSelect]);

  const handleValidate = useCallback(() => {
    submitAnswer();
    // Feedback is handled by gameState changes
    if (gameState === 'correct') {
      playCorrect();
      const messages = PIXEL_MESSAGES.correct;
      setPixelMessage(messages[Math.floor(Math.random() * messages.length)]);
      setPixelEmotion('excited');
    } else if (gameState === 'incorrect') {
      playError();
      const messages = PIXEL_MESSAGES.error;
      setPixelMessage(messages[Math.floor(Math.random() * messages.length)]);
      setPixelEmotion('encouraging');
    }
  }, [submitAnswer, gameState, playCorrect, playError]);

  const handleRequestHint = useCallback(() => {
    playHint();
    requestHint();
    setPixelMessage(PIXEL_MESSAGES.hint);
    setPixelEmotion('thinking');
  }, [requestHint, playHint]);

  const handleNextPuzzle = useCallback(() => {
    nextPuzzle();
    const messages = PIXEL_MESSAGES.thinking;
    setPixelMessage(messages[Math.floor(Math.random() * messages.length)]);
    setPixelEmotion('neutral');
  }, [nextPuzzle]);

  const handleRestartLevel = useCallback(() => {
    resetPuzzle();
    setIsVictory(false);
    setPixelMessage(PIXEL_MESSAGES.welcome);
    setPixelEmotion('neutral');
  }, [resetPuzzle]);

  // ============================================
  // RETURN
  // ============================================

  return {
    // Mondes
    worlds: WORLDS_ARRAY,
    selectedWorld,
    handleSelectWorld,

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
    pixelMessage,
    pixelEmotion,

    // Game state
    puzzle,
    gameState,
    selectedChoice,
    hintsRemaining,

    // Progress data
    progressData: {
      current: puzzleIndex ?? 0,
      total: totalPuzzles ?? 0,
      streak: 0, // Not tracked in current implementation
      score: sessionScore ?? 0,
    },

    // Handlers
    handleSelectChoice,
    handleValidate,
    handleRequestHint,
    handleBack,
    handleStartPlaying,
    handleParentPress,
    handleHelpPress,
    handleNextPuzzle,
    handleRestartLevel,
  };
}

export default useMatricesIntro;
