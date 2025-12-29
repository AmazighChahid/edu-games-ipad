/**
 * useSudokuIntro - Hook orchestrateur pour Sudoku
 *
 * Encapsule toute la logique métier de l'écran d'introduction :
 * - Gestion des 10 niveaux progressifs
 * - Mode entraînement (personnalisation thème/taille/difficulté)
 * - Progression store (lecture/écriture)
 * - Messages mascotte Félix
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

import { useSudokuGame } from './useSudokuGame';
import { useSudokuSound } from './useSudokuSound';
import { useActiveProfile, useGameProgress, useStore } from '@/store';
import {
  SUDOKU_LEVELS,
  DEFAULT_TRAINING_CONFIG,
  LEVEL_MESSAGES,
  getLevelByNumber,
  getLevelDescription,
  isLevelUnlocked,
  calculateStars,
  getIdealDuration,
} from '../data/levels';
import type {
  SudokuLevelConfig,
  TrainingConfig,
  SudokuConfig,
  SudokuSize,
  SudokuTheme,
  SudokuDifficulty,
  FelixEmotionType,
  GameStats,
} from '../types';

// ============================================
// TYPES
// ============================================

export type EmotionType = FelixEmotionType;

export interface UseSudokuIntroReturn {
  // Niveaux (système 1-10)
  levels: SudokuLevelConfig[];
  selectedLevel: SudokuLevelConfig | null;
  handleSelectLevel: (level: SudokuLevelConfig) => void;

  // Mode entraînement
  isTrainingMode: boolean;
  showTrainingSelector: boolean;
  trainingConfig: TrainingConfig;
  handleTrainingModeToggle: () => void;
  handleTrainingConfigChange: (config: Partial<TrainingConfig>) => void;
  handleStartTraining: () => void;
  setShowTrainingSelector: (show: boolean) => void;

  // État jeu
  isPlaying: boolean;
  isVictory: boolean;
  gameConfig: SudokuConfig | null;

  // Game state (depuis useSudokuGame)
  gameState: ReturnType<typeof useSudokuGame>['gameState'];
  selectedSymbol: ReturnType<typeof useSudokuGame>['selectedSymbol'];
  errorCount: ReturnType<typeof useSudokuGame>['errorCount'];

  // Game handlers (depuis useSudokuGame)
  handleCellPress: ReturnType<typeof useSudokuGame>['handleCellPress'];
  handleSymbolSelect: ReturnType<typeof useSudokuGame>['handleSymbolSelect'];
  handleClearCell: ReturnType<typeof useSudokuGame>['handleClearCell'];
  handleUndo: ReturnType<typeof useSudokuGame>['handleUndo'];

  // Mascot
  mascotMessage: string;
  mascotEmotion: EmotionType;

  // Animations (styles animés)
  selectorStyle: ReturnType<typeof useAnimatedStyle>;
  progressPanelStyle: ReturnType<typeof useAnimatedStyle>;

  // Progress data
  progressData: {
    emptyCellsRemaining: number;
    totalEmptyCells: number;
    hintsUsed: number;
    errorsCount: number;
    progress: number; // 0-100
  };

  // Handlers
  handleStartPlaying: () => void;
  handleBack: () => void;
  handleReset: () => void;
  handleHint: () => ReturnType<ReturnType<typeof useSudokuGame>['handleHint']>;
  handleParentPress: () => void;
  handleHelpPress: () => void;

  // Parent drawer
  showParentDrawer: boolean;
  setShowParentDrawer: (show: boolean) => void;

  // Hints
  hintsRemaining: number;
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

const MAX_HINTS = 3;

// ============================================
// HOOK
// ============================================

export function useSudokuIntro(): UseSudokuIntroReturn {
  const router = useRouter();
  const params = useLocalSearchParams<{ level?: string }>();
  const profile = useActiveProfile();

  // Store - progression
  const gameProgress = useGameProgress('sudoku');
  const initGameProgress = useStore((state) => state.initGameProgress);
  const saveGameProgress = useStore((state) => state.saveGameProgress);

  // Initialiser le progress si nécessaire
  useEffect(() => {
    initGameProgress('sudoku');
  }, [initGameProgress]);

  // ============================================
  // STATE - Niveaux
  // ============================================

  const [selectedLevel, setSelectedLevel] = useState<SudokuLevelConfig | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVictory, setIsVictory] = useState(false);

  // ============================================
  // STATE - Mode Entraînement
  // ============================================

  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [showTrainingSelector, setShowTrainingSelector] = useState(false);
  const [trainingConfig, setTrainingConfig] = useState<TrainingConfig>(DEFAULT_TRAINING_CONFIG);

  // ============================================
  // STATE - Mascotte
  // ============================================

  const [mascotMessage, setMascotMessage] = useState("Salut ! Je suis Félix ! Choisis un niveau !");
  const [mascotEmotion, setMascotEmotion] = useState<EmotionType>('neutral');

  // ============================================
  // STATE - UI
  // ============================================

  const [showParentDrawer, setShowParentDrawer] = useState(false);

  // ============================================
  // DERIVED STATE - Niveaux avec progression
  // ============================================

  const levels = useMemo(() => {
    const completedLevelIds = gameProgress?.completedLevels
      ? Object.keys(gameProgress.completedLevels)
      : [];

    return SUDOKU_LEVELS.map((level) => ({
      ...level,
      isUnlocked: isLevelUnlocked(level.number, completedLevelIds),
      isCompleted: completedLevelIds.includes(level.id),
      stars: gameProgress?.completedLevels?.[level.id]?.stars,
      bestTime: gameProgress?.completedLevels?.[level.id]?.bestTime,
    }));
  }, [gameProgress?.completedLevels]);

  // ============================================
  // DERIVED STATE - Config de jeu
  // ============================================

  const gameConfig = useMemo<SudokuConfig | null>(() => {
    if (isTrainingMode) {
      return {
        size: trainingConfig.size,
        difficulty: trainingConfig.difficulty,
        theme: trainingConfig.theme,
        showConflicts: true,
        allowAnnotations: trainingConfig.difficulty >= 2,
      };
    }

    if (selectedLevel) {
      return {
        size: selectedLevel.size,
        difficulty: selectedLevel.difficulty,
        theme: selectedLevel.theme,
        showConflicts: true,
        allowAnnotations: selectedLevel.difficulty >= 2,
      };
    }

    return null;
  }, [isTrainingMode, trainingConfig, selectedLevel]);

  // ============================================
  // GAME HOOK
  // ============================================

  const gameHook = useSudokuGame({
    config: gameConfig || {
      size: 4,
      difficulty: 1,
      theme: 'fruits',
      showConflicts: true,
      allowAnnotations: false,
    },
    onComplete: handleGameComplete,
  });

  const {
    gameState,
    selectedSymbol,
    errorCount,
    handleCellPress,
    handleSymbolSelect,
    handleClearCell,
    handleUndo,
    handleHint: gameHandleHint,
    handleReset: gameHandleReset,
  } = gameHook;

  // ============================================
  // SOUNDS
  // ============================================

  const { playSelect, playCorrect, playError, playVictory, playHint } = useSudokuSound();

  // ============================================
  // REFS
  // ============================================

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
    setIsVictory(false);
  }, [selectorY, selectorOpacity, progressPanelOpacity]);

  // ============================================
  // GAME COMPLETION HANDLER
  // ============================================

  function handleGameComplete(stats: GameStats) {
    playVictory();
    setIsVictory(true);
    setMascotMessage(
      LEVEL_MESSAGES.victory[Math.floor(Math.random() * LEVEL_MESSAGES.victory.length)]
    );
    setMascotEmotion('excited');

    // Ne pas sauvegarder la progression en mode entraînement
    if (isTrainingMode || !selectedLevel) return;

    const idealDuration = getIdealDuration(selectedLevel);
    const stars = calculateStars(
      stats.errorsCount,
      stats.hintsUsed,
      stats.duration,
      idealDuration
    );

    // Sauvegarder la progression
    saveGameProgress('sudoku', {
      levelId: selectedLevel.id,
      stars,
      completed: true,
      hintsUsed: stats.hintsUsed,
      errors: stats.errorsCount,
      duration: stats.duration,
    });

    // Navigation vers victory
    router.push({
      pathname: '/(games)/05-sudoku/victory',
      params: {
        level: selectedLevel.number.toString(),
        stars: stars.toString(),
        duration: stats.duration.toString(),
        hintsUsed: stats.hintsUsed.toString(),
        errorsCount: stats.errorsCount.toString(),
      },
    });
  }

  // ============================================
  // EFFECTS - Sélection automatique niveau
  // ============================================

  useEffect(() => {
    const levelParamChanged = params.level !== lastLevelParamRef.current;
    if (levelParamChanged) {
      lastLevelParamRef.current = params.level;
    }

    if (levels.length > 0 && (!selectedLevel || levelParamChanged)) {
      let defaultLevel: SudokuLevelConfig | undefined;

      // Si un niveau est passé en paramètre URL
      if (params.level) {
        const levelNumber = parseInt(params.level, 10);
        defaultLevel = levels.find((l) => l.number === levelNumber && l.isUnlocked);
      }

      // Sinon, trouver le premier niveau débloqué mais non complété
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
        setMascotMessage(
          `Niveau ${defaultLevel.number} ! ${getLevelDescription(defaultLevel)}`
        );
        setMascotEmotion('happy');
      }
    }
  }, [levels, selectedLevel, params.level]);

  // ============================================
  // EFFECTS - Feedback jeu
  // ============================================

  useEffect(() => {
    // Mise à jour du message mascotte selon l'état du jeu
    if (gameState.isComplete) {
      // Géré par handleGameComplete
      return;
    }

    // Vérifier les conflits pour feedback
    const hasConflicts = gameState.grid.cells.some((row) =>
      row.some((cell) => cell.hasConflict)
    );

    if (hasConflicts) {
      const errorMessages = LEVEL_MESSAGES.error;
      setMascotMessage(errorMessages[Math.floor(Math.random() * errorMessages.length)]);
      setMascotEmotion('encouraging');
    }
  }, [gameState.isComplete, gameState.grid.cells]);

  // ============================================
  // PROGRESS DATA
  // ============================================

  const progressData = useMemo(() => {
    if (!gameState.grid) {
      return {
        emptyCellsRemaining: 0,
        totalEmptyCells: 0,
        hintsUsed: 0,
        errorsCount: 0,
        progress: 0,
      };
    }

    const totalCells = gameState.grid.size * gameState.grid.size;
    const filledCells = gameState.grid.cells.flat().filter(
      (cell) => cell.value !== null
    ).length;
    const fixedCells = gameState.grid.cells.flat().filter((cell) => cell.isFixed).length;
    const totalEmptyCells = totalCells - fixedCells;
    const userFilledCells = filledCells - fixedCells;
    const emptyCellsRemaining = totalEmptyCells - userFilledCells;

    return {
      emptyCellsRemaining,
      totalEmptyCells,
      hintsUsed: gameState.hintsUsed,
      errorsCount: errorCount,
      progress: totalEmptyCells > 0 ? Math.round((userFilledCells / totalEmptyCells) * 100) : 0,
    };
  }, [gameState.grid, gameState.hintsUsed, errorCount]);

  // ============================================
  // HANDLERS - Niveaux
  // ============================================

  const handleSelectLevel = useCallback((level: SudokuLevelConfig) => {
    if (!level.isUnlocked) {
      setMascotMessage("Ce niveau n'est pas encore débloqué ! Finis le précédent d'abord !");
      setMascotEmotion('thinking');
      return;
    }

    setSelectedLevel(level);
    setIsTrainingMode(false);
    setMascotMessage(`Niveau ${level.number} ! ${getLevelDescription(level)}`);
    setMascotEmotion('happy');
  }, []);

  const handleStartPlaying = useCallback(() => {
    if (!gameConfig) return;

    transitionToPlayMode();
    const startMessages = LEVEL_MESSAGES.start;
    setMascotMessage(startMessages[Math.floor(Math.random() * startMessages.length)]);
    setMascotEmotion('excited');
  }, [gameConfig, transitionToPlayMode]);

  // ============================================
  // HANDLERS - Mode Entraînement
  // ============================================

  const handleTrainingModeToggle = useCallback(() => {
    setShowTrainingSelector(true);
  }, []);

  const handleTrainingConfigChange = useCallback((config: Partial<TrainingConfig>) => {
    setTrainingConfig((prev) => ({ ...prev, ...config }));
  }, []);

  const handleStartTraining = useCallback(() => {
    setIsTrainingMode(true);
    setShowTrainingSelector(false);
    setSelectedLevel(null);
    setMascotMessage("Mode entraînement ! Amuse-toi bien !");
    setMascotEmotion('happy');
    transitionToPlayMode();
  }, [transitionToPlayMode]);

  // ============================================
  // HANDLERS - Navigation
  // ============================================

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
    setMascotMessage(
      "Chaque ligne, colonne et zone doit contenir tous les symboles une seule fois !"
    );
    setMascotEmotion('thinking');
  }, []);

  // ============================================
  // HANDLERS - Jeu
  // ============================================

  const handleReset = useCallback(() => {
    gameHandleReset();
    setMascotMessage("Nouvelle grille ! Bonne chance !");
    setMascotEmotion('neutral');
  }, [gameHandleReset]);

  const handleHint = useCallback(() => {
    if (gameState.hintsUsed >= MAX_HINTS) {
      setMascotMessage("Tu as utilisé tous tes indices ! Essaie par toi-même !");
      setMascotEmotion('encouraging');
      return null;
    }

    playHint();
    const result = gameHandleHint();

    if (result) {
      const hintMessages = LEVEL_MESSAGES.hint;
      setMascotMessage(hintMessages[Math.floor(Math.random() * hintMessages.length)]);
      setMascotEmotion('thinking');
    }

    return result;
  }, [gameState.hintsUsed, playHint, gameHandleHint]);

  // ============================================
  // RETURN
  // ============================================

  return {
    // Niveaux
    levels,
    selectedLevel,
    handleSelectLevel,

    // Mode entraînement
    isTrainingMode,
    showTrainingSelector,
    trainingConfig,
    handleTrainingModeToggle,
    handleTrainingConfigChange,
    handleStartTraining,
    setShowTrainingSelector,

    // État jeu
    isPlaying,
    isVictory,
    gameConfig,

    // Game state
    gameState,
    selectedSymbol,
    errorCount,

    // Game handlers
    handleCellPress,
    handleSymbolSelect,
    handleClearCell,
    handleUndo,

    // Mascot
    mascotMessage,
    mascotEmotion,

    // Animations
    selectorStyle,
    progressPanelStyle,

    // Progress data
    progressData,

    // Handlers
    handleStartPlaying,
    handleBack,
    handleReset,
    handleHint,
    handleParentPress,
    handleHelpPress,

    // Parent drawer
    showParentDrawer,
    setShowParentDrawer,

    // Hints
    hintsRemaining: MAX_HINTS - gameState.hintsUsed,
  };
}

export default useSudokuIntro;
