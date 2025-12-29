/**
 * useMathIntro - Hook orchestrateur pour MathBlocks
 *
 * Encapsule toute la logique métier de l'écran d'introduction :
 * - Progression store (lecture/écriture)
 * - Génération des niveaux
 * - Messages mascotte
 * - Sons
 * - Animations de transition
 * - Navigation
 *
 * @see docs/GAME_ARCHITECTURE.md pour le pattern complet
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
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
  type TrainingConfig,
  type TrainingParam,
} from '../../../components/common';
import { useMathSound } from './useMathSound';
import { useActiveProfile, useGameProgress, useStore } from '../../../store/useStore';
import { mathLevels, getLevel } from '../data/levels';
import { OPERATION_SYMBOLS, type MathLevelConfig } from '../types';
import type { CalcEmotionType } from '../components/CalcMascot';

// ============================================
// TYPES
// ============================================

export interface UseMathIntroReturn {
  // Niveaux
  levels: LevelConfig[];
  selectedLevel: LevelConfig | null;
  currentMathLevel: MathLevelConfig | null;
  handleSelectLevel: (level: LevelConfig) => void;

  // État jeu
  isPlaying: boolean;
  isVictory: boolean;
  isTrainingMode: boolean;

  // Training config
  trainingConfig: TrainingConfig;
  handleTrainingPress: () => void;

  // Animations (styles animés)
  selectorStyle: ReturnType<typeof useAnimatedStyle>;
  progressPanelStyle: ReturnType<typeof useAnimatedStyle>;

  // Mascot
  mascotMessage: string;
  mascotEmotion: CalcEmotionType;

  // Progress data
  progressData: {
    completedLevels: number;
    totalLevels: number;
    currentLevel: number;
    totalStars: number;
  };

  // Handlers
  handleBack: () => void;
  handleStartPlaying: () => void;
  handleParentPress: () => void;
  handleHelpPress: () => void;
  handleReset: () => void;
  handleHint: () => void;

  // Hints
  hintsRemaining: number;
  hintsDisabled: boolean;

  // Parent drawer
  showParentDrawer: boolean;
  setShowParentDrawer: (show: boolean) => void;
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

const CALC_MESSAGES = {
  intro: "Salut ! Je suis Calc ! Prêt pour du calcul mental ?",
  levelSelect: (level: number, ops: string) =>
    `Niveau ${level} avec ${ops} ! Tu vas y arriver !`,
  training: "Mode entraînement ! Configure comme tu veux !",
  hint: "Cherche d'abord les calculs faciles !",
  victory: "Bravo ! Tu calcules comme un pro !",
  back: "On recommence ? Choisis un niveau !",
  help: "Trouve les paires : un calcul et son résultat !",
};

const MAX_HINTS = 3;

// ============================================
// HOOK
// ============================================

export function useMathIntro(): UseMathIntroReturn {
  const router = useRouter();
  const params = useLocalSearchParams<{ level?: string }>();
  const profile = useActiveProfile();

  // Store - progression
  const gameProgress = useGameProgress('math-blocks');
  const initGameProgress = useStore((state) => state.initGameProgress);

  // Initialiser le progress si nécessaire
  useEffect(() => {
    initGameProgress('math-blocks');
  }, [initGameProgress]);

  // Sons
  const { playSelect, playHint } = useMathSound();

  // État local
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [mascotMessage, setMascotMessage] = useState(CALC_MESSAGES.intro);
  const [mascotEmotion, setMascotEmotion] = useState<CalcEmotionType>('neutral');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showParentDrawer, setShowParentDrawer] = useState(false);

  // Training values
  const [trainingValues, setTrainingValues] = useState<Record<string, string | number | boolean>>({
    operation: 'add',
    range: '10',
  });

  // Extraire les IDs des niveaux complétés depuis le store
  const completedLevelIds = useMemo(() => {
    if (!gameProgress?.completedLevels) return [];
    return Object.keys(gameProgress.completedLevels).map(
      (levelId) => `math-blocks_${levelId}`
    );
  }, [gameProgress?.completedLevels]);

  // Générer les niveaux basés sur l'âge de l'enfant
  const levels = useMemo(() => {
    return generateDefaultLevels('math-blocks', profile?.birthDate, completedLevelIds);
  }, [profile?.birthDate, completedLevelIds]);

  // Niveau MathBlocks actuel
  const currentMathLevel = useMemo((): MathLevelConfig | null => {
    if (!selectedLevel) return null;
    return getLevel(`level_${selectedLevel.number}`) || null;
  }, [selectedLevel]);

  // Configuration entraînement
  const trainingParams: TrainingParam[] = useMemo(
    () => [
      {
        id: 'operation',
        label: 'Opération',
        type: 'select',
        options: [
          { value: 'add', label: '➕ Addition' },
          { value: 'subtract', label: '➖ Soustraction' },
          { value: 'multiply', label: '✖️ Multiplication' },
          { value: 'divide', label: '➗ Division' },
          { value: 'all', label: '🎲 Toutes' },
        ],
        defaultValue: 'add',
      },
      {
        id: 'range',
        label: 'Nombres',
        type: 'select',
        options: [
          { value: '5', label: '1-5 (Facile)' },
          { value: '10', label: '1-10 (Moyen)' },
          { value: '20', label: '1-20 (Difficile)' },
          { value: '50', label: '1-50 (Expert)' },
        ],
        defaultValue: '10',
      },
    ],
    []
  );

  const trainingConfig: TrainingConfig = {
    availableParams: trainingParams,
    currentValues: trainingValues,
    onParamChange: (paramId, value) => {
      setTrainingValues((prev) => ({ ...prev, [paramId]: value }));
    },
  };

  // Progress data
  const progressData = useMemo(() => {
    const completedCount = completedLevelIds.length;
    const totalStars = Object.values(gameProgress?.completedLevels || {}).reduce(
      (sum, level) => sum + (level.stars || 0),
      0
    );

    return {
      completedLevels: completedCount,
      totalLevels: mathLevels.length,
      currentLevel: selectedLevel?.number || 0,
      totalStars,
    };
  }, [completedLevelIds, gameProgress, selectedLevel]);

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
    if (levels.length > 0 && !selectedLevel) {
      let defaultLevel: LevelConfig | undefined;

      // Si un niveau est passé en paramètre URL
      if (params.level) {
        const levelNumber = parseInt(params.level, 10);
        defaultLevel = levels.find((l) => l.number === levelNumber && l.isUnlocked);
      }

      // Sinon, premier niveau débloqué non complété
      if (!defaultLevel) {
        defaultLevel =
          levels.find((level) => level.isUnlocked && !level.isCompleted) ||
          levels.filter((l) => l.isUnlocked).pop() ||
          levels[0];
      }

      if (defaultLevel) {
        setSelectedLevel(defaultLevel);
        const mathLevel = getLevel(`level_${defaultLevel.number}`);
        if (mathLevel) {
          const ops = mathLevel.operations.map((op) => OPERATION_SYMBOLS[op]).join(' ');
          setMascotMessage(CALC_MESSAGES.levelSelect(defaultLevel.number, ops));
          setMascotEmotion('happy');
        }
      }
    }
  }, [levels, selectedLevel, params.level]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleSelectLevel = useCallback(
    (level: LevelConfig) => {
      playSelect();
      setSelectedLevel(level);
      const mathLevel = getLevel(`level_${level.number}`);
      if (mathLevel) {
        const ops = mathLevel.operations.map((op) => OPERATION_SYMBOLS[op]).join(' ');
        setMascotMessage(CALC_MESSAGES.levelSelect(level.number, ops));
        setMascotEmotion('happy');
      }
    },
    [playSelect]
  );

  const handleStartPlaying = useCallback(() => {
    if (!selectedLevel) return;
    // Naviguer vers l'écran de jeu
    router.push(`/(games)/11-math-blocks/play?levelId=level_${selectedLevel.number}`);
  }, [selectedLevel, router]);

  const handleBack = useCallback(() => {
    if (isPlaying) {
      transitionToSelectionMode();
      setMascotMessage(CALC_MESSAGES.back);
      setMascotEmotion('encouraging');
    } else {
      router.back();
    }
  }, [isPlaying, router, transitionToSelectionMode]);

  const handleParentPress = useCallback(() => {
    setShowParentDrawer(true);
  }, []);

  const handleHelpPress = useCallback(() => {
    setMascotMessage(CALC_MESSAGES.help);
    setMascotEmotion('thinking');
  }, []);

  const handleTrainingPress = useCallback(() => {
    setIsTrainingMode(!isTrainingMode);
    setMascotMessage(isTrainingMode ? CALC_MESSAGES.intro : CALC_MESSAGES.training);
    setMascotEmotion('thinking');
  }, [isTrainingMode]);

  const handleReset = useCallback(() => {
    setSelectedLevel(null);
    setHintsUsed(0);
    setMascotMessage(CALC_MESSAGES.intro);
    setMascotEmotion('neutral');
  }, []);

  const handleHint = useCallback(() => {
    if (hintsUsed >= MAX_HINTS) return;

    playHint();
    setHintsUsed((prev) => prev + 1);
    setMascotMessage(CALC_MESSAGES.hint);
    setMascotEmotion('thinking');
  }, [hintsUsed, playHint]);

  // ============================================
  // RETURN
  // ============================================

  return {
    // Niveaux
    levels,
    selectedLevel,
    currentMathLevel,
    handleSelectLevel,

    // État jeu
    isPlaying,
    isVictory,
    isTrainingMode,

    // Training
    trainingConfig,
    handleTrainingPress,

    // Animations
    selectorStyle,
    progressPanelStyle,

    // Mascot
    mascotMessage,
    mascotEmotion,

    // Progress
    progressData,

    // Handlers
    handleBack,
    handleStartPlaying,
    handleParentPress,
    handleHelpPress,
    handleReset,
    handleHint,

    // Hints
    hintsRemaining: MAX_HINTS - hintsUsed,
    hintsDisabled: hintsUsed >= MAX_HINTS,

    // Parent drawer
    showParentDrawer,
    setShowParentDrawer,
  };
}

export default useMathIntro;
