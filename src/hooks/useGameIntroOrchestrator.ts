/**
 * useGameIntroOrchestrator - Hook générique pour les écrans d'introduction des jeux
 *
 * Factorise 60-70% du code commun des hooks useXxxIntro :
 * - Gestion des niveaux (sélection, génération, progression)
 * - États de jeu (isPlaying, isVictory)
 * - Animations de transition (selector slide, progress fade)
 * - Mascotte (message, emotion)
 * - Parent drawer
 * - Navigation (handleBack)
 * - Store Zustand (gameProgress)
 *
 * @example
 * ```typescript
 * const orchestrator = useGameIntroOrchestrator({
 *   gameId: 'suites-logiques',
 *   mascotMessages: { welcome: "Bip bop !" },
 * });
 *
 * // Le jeu peut ensuite étendre avec sa logique spécifique
 * const game = useSuitesGame({ level: orchestrator.selectedLevel?.number });
 * ```
 *
 * @see docs/GAME_ARCHITECTURE.md
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';

import {
  generateDefaultLevels,
  type LevelConfig,
} from '../components/common';
import { useActiveProfile, useGameProgress, useStore } from '../store/useStore';

// ============================================
// TYPES
// ============================================

export type EmotionType = 'neutral' | 'happy' | 'thinking' | 'excited' | 'encouraging' | 'curious' | 'proud';

/**
 * Configuration for the orchestrator
 */
export interface GameIntroOrchestratorConfig {
  /** Game identifier for the store (e.g., 'suites-logiques') */
  gameId: string;
  /** Number of levels. Default: 10 */
  levelCount?: number;
  /** Default mascot messages */
  mascotMessages?: {
    welcome?: string;
    levelSelect?: (level: LevelConfig) => string;
    startPlaying?: string;
    hint?: string;
    backToSelection?: string;
    help?: string;
  };
  /** Animation configuration override */
  animationConfig?: Partial<AnimationConfig>;
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  selectorSlideDuration: number;
  selectorFadeDuration: number;
  progressDelayDuration: number;
  selectorSlideDistance: number;
  springDamping: number;
  springStiffness: number;
}

/**
 * Return type of the orchestrator hook
 */
export interface GameIntroOrchestratorReturn {
  // === LEVELS ===
  levels: LevelConfig[];
  selectedLevel: LevelConfig | null;
  handleSelectLevel: (level: LevelConfig) => void;

  // === GAME STATE ===
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  isVictory: boolean;
  setIsVictory: (value: boolean) => void;

  // === TRANSITIONS ===
  handleStartPlaying: () => void;
  handleBack: () => void;
  transitionToPlayMode: () => void;
  transitionToSelectionMode: () => void;

  // === ANIMATIONS ===
  selectorStyle: ReturnType<typeof useAnimatedStyle>;
  progressPanelStyle: ReturnType<typeof useAnimatedStyle>;
  cardSlideProgress: SharedValue<number>;
  selectorY: SharedValue<number>;
  selectorOpacity: SharedValue<number>;
  progressPanelOpacity: SharedValue<number>;

  // === MASCOT ===
  mascotMessage: string;
  setMascotMessage: (message: string) => void;
  mascotEmotion: EmotionType;
  setMascotEmotion: (emotion: EmotionType) => void;

  // === PARENT DRAWER ===
  showParentDrawer: boolean;
  setShowParentDrawer: (show: boolean) => void;
  handleParentPress: () => void;
  handleHelpPress: () => void;

  // === STORE ===
  gameProgress: ReturnType<typeof useGameProgress>;
  completedLevelIds: string[];
  profile: ReturnType<typeof useActiveProfile>;

  // === NAVIGATION ===
  router: ReturnType<typeof useRouter>;
  params: ReturnType<typeof useLocalSearchParams>;
}

// ============================================
// CONSTANTS
// ============================================

const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  selectorSlideDuration: 400,
  selectorFadeDuration: 300,
  progressDelayDuration: 200,
  selectorSlideDistance: -150,
  springDamping: 15,
  springStiffness: 150,
};

const DEFAULT_MASCOT_MESSAGES = {
  welcome: 'Choisis un niveau pour commencer !',
  levelSelect: (level: LevelConfig) =>
    `Niveau ${level.number} ! ${
      level.difficulty === 'easy'
        ? 'Parfait pour commencer !'
        : level.difficulty === 'hard' || level.difficulty === 'expert'
        ? 'Un vrai défi !'
        : 'Bonne difficulté !'
    }`,
  startPlaying: "C'est parti !",
  hint: 'Observe bien...',
  backToSelection: 'On recommence ? Choisis un niveau !',
  help: 'Besoin d\'aide ? Regarde bien les indices !',
};

// ============================================
// HOOK
// ============================================

export function useGameIntroOrchestrator(
  config: GameIntroOrchestratorConfig
): GameIntroOrchestratorReturn {
  const {
    gameId,
    levelCount = 10,
    mascotMessages = {},
    animationConfig = {},
  } = config;

  // Merge configs
  const animConfig = { ...DEFAULT_ANIMATION_CONFIG, ...animationConfig };
  const messages = { ...DEFAULT_MASCOT_MESSAGES, ...mascotMessages };

  // Navigation
  const router = useRouter();
  const params = useLocalSearchParams<{ level?: string }>();

  // Profile & Store
  const profile = useActiveProfile();
  const gameProgress = useGameProgress(gameId);
  const initGameProgress = useStore((state) => state.initGameProgress);

  // Initialize game progress if needed
  useEffect(() => {
    initGameProgress(gameId);
  }, [initGameProgress, gameId]);

  // ============================================
  // LOCAL STATE
  // ============================================

  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [mascotMessage, setMascotMessage] = useState(messages.welcome);
  const [mascotEmotion, setMascotEmotion] = useState<EmotionType>('neutral');
  const [showParentDrawer, setShowParentDrawer] = useState(false);

  // Refs for tracking
  const hasInitializedRef = useRef(false);
  const lastLevelParamRef = useRef<string | undefined>(undefined);

  // ============================================
  // LEVELS
  // ============================================

  // Extract completed level IDs from store
  const completedLevelIds = useMemo(() => {
    if (!gameProgress?.completedLevels) return [];
    return Object.keys(gameProgress.completedLevels).map(
      (levelId) => `${gameId}_${levelId}`
    );
  }, [gameProgress?.completedLevels, gameId]);

  // Generate levels based on child's age and completed levels
  const levels = useMemo(() => {
    return generateDefaultLevels(gameId, profile?.birthDate, completedLevelIds);
  }, [gameId, profile?.birthDate, completedLevelIds]);

  // ============================================
  // ANIMATIONS
  // ============================================

  const selectorY = useSharedValue(0);
  const selectorOpacity = useSharedValue(1);
  const progressPanelOpacity = useSharedValue(0);
  const cardSlideProgress = useSharedValue(0);

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

    // Slide selector up and fade out
    selectorY.value = withTiming(animConfig.selectorSlideDistance, {
      duration: animConfig.selectorSlideDuration,
      easing: Easing.out(Easing.quad),
    });
    selectorOpacity.value = withTiming(0, {
      duration: animConfig.selectorFadeDuration,
    });

    // Animate card slide progress for GameIntroTemplate
    cardSlideProgress.value = withTiming(1, {
      duration: animConfig.selectorSlideDuration,
      easing: Easing.out(Easing.quad),
    });

    // Fade in progress panel
    progressPanelOpacity.value = withDelay(
      animConfig.progressDelayDuration,
      withTiming(1, { duration: animConfig.selectorFadeDuration })
    );

    // Set playing state after animation
    setTimeout(() => {
      setIsPlaying(true);
    }, 300);
  }, [
    isPlaying,
    selectorY,
    selectorOpacity,
    progressPanelOpacity,
    cardSlideProgress,
    animConfig,
  ]);

  const transitionToSelectionMode = useCallback(() => {
    // Show selector with spring animation
    selectorY.value = withSpring(0, {
      damping: animConfig.springDamping,
      stiffness: animConfig.springStiffness,
    });
    selectorOpacity.value = withTiming(1, {
      duration: animConfig.selectorFadeDuration,
    });

    // Animate card slide progress back
    cardSlideProgress.value = withSpring(0, {
      damping: animConfig.springDamping,
      stiffness: animConfig.springStiffness,
    });

    // Hide progress panel
    progressPanelOpacity.value = withTiming(0, { duration: 200 });

    setIsPlaying(false);
  }, [
    selectorY,
    selectorOpacity,
    progressPanelOpacity,
    cardSlideProgress,
    animConfig,
  ]);

  // ============================================
  // AUTOMATIC LEVEL SELECTION
  // ============================================

  useEffect(() => {
    // Check if URL param changed (e.g., from victory screen)
    const levelParamChanged = params.level !== lastLevelParamRef.current;
    if (levelParamChanged) {
      lastLevelParamRef.current = params.level;
    }

    if (levels.length > 0 && (!selectedLevel || levelParamChanged)) {
      let defaultLevel: LevelConfig | undefined;

      // If level passed via URL params
      if (params.level) {
        const levelNumber = parseInt(params.level, 10);
        defaultLevel = levels.find((l) => l.number === levelNumber && l.isUnlocked);
      }

      // Otherwise, find first unlocked but incomplete level
      if (!defaultLevel) {
        const firstIncompleteLevel = levels.find(
          (level) => level.isUnlocked && !level.isCompleted
        );

        defaultLevel =
          firstIncompleteLevel ||
          levels.filter((l) => l.isUnlocked).pop() ||
          levels[0];
      }

      if (defaultLevel) {
        setSelectedLevel(defaultLevel);
        setMascotMessage(messages.levelSelect(defaultLevel));
        setMascotEmotion('happy');
        hasInitializedRef.current = true;
      }
    }
  }, [levels, selectedLevel, params.level, messages]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleSelectLevel = useCallback(
    (level: LevelConfig) => {
      setSelectedLevel(level);
      setMascotMessage(messages.levelSelect(level));
      setMascotEmotion('happy');
    },
    [messages]
  );

  const handleStartPlaying = useCallback(() => {
    if (!selectedLevel) return;
    transitionToPlayMode();
    setMascotMessage(messages.startPlaying);
    setMascotEmotion('excited');
  }, [selectedLevel, transitionToPlayMode, messages]);

  const handleBack = useCallback(() => {
    if (isPlaying) {
      transitionToSelectionMode();
      setMascotMessage(messages.backToSelection);
      setMascotEmotion('encouraging');
    } else {
      // Return to home from level selection
      router.replace('/');
    }
  }, [isPlaying, router, transitionToSelectionMode, messages]);

  const handleParentPress = useCallback(() => {
    setShowParentDrawer(true);
  }, []);

  const handleHelpPress = useCallback(() => {
    setMascotMessage(messages.help);
    setMascotEmotion('thinking');
  }, [messages]);

  // ============================================
  // RETURN
  // ============================================

  return {
    // Levels
    levels,
    selectedLevel,
    handleSelectLevel,

    // Game state
    isPlaying,
    setIsPlaying,
    isVictory,
    setIsVictory,

    // Transitions
    handleStartPlaying,
    handleBack,
    transitionToPlayMode,
    transitionToSelectionMode,

    // Animations
    selectorStyle,
    progressPanelStyle,
    cardSlideProgress,
    selectorY,
    selectorOpacity,
    progressPanelOpacity,

    // Mascot
    mascotMessage,
    setMascotMessage,
    mascotEmotion,
    setMascotEmotion,

    // Parent drawer
    showParentDrawer,
    setShowParentDrawer,
    handleParentPress,
    handleHelpPress,

    // Store
    gameProgress,
    completedLevelIds,
    profile,

    // Navigation
    router,
    params,
  };
}
