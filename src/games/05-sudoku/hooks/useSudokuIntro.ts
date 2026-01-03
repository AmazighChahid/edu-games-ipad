/**
 * useSudokuIntro - Hook orchestrateur pour Sudoku
 *
 * VERSION MIGRÉE (Janvier 2026)
 * Utilise useGameIntroOrchestrator pour la logique commune.
 * Ce fichier ne contient plus que la logique spécifique au jeu.
 *
 * @see docs/GAME_ARCHITECTURE.md pour le pattern complet
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';

import { useGameIntroOrchestrator } from '../../../hooks';
import { useSudokuGame } from './useSudokuGame';
import { useSudokuSound } from './useSudokuSound';
import { useStore } from '@/store';
import {
  SUDOKU_LEVELS,
  DEFAULT_TRAINING_CONFIG,
  LEVEL_MESSAGES,
  getLevelDescription,
  isLevelUnlocked,
  calculateStars,
  getIdealDuration,
} from '../data/levels';
import type {
  SudokuLevelConfig,
  TrainingConfig,
  SudokuConfig,
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

  // État jeu (depuis orchestrator)
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
  handleDrop: ReturnType<typeof useSudokuGame>['handleDrop'];

  // Mascot
  mascotMessage: string;
  mascotEmotion: EmotionType;

  // Animations (depuis orchestrator)
  selectorStyle: ReturnType<typeof useGameIntroOrchestrator>['selectorStyle'];
  progressPanelStyle: ReturnType<typeof useGameIntroOrchestrator>['progressPanelStyle'];

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

  // Parent drawer (depuis orchestrator)
  showParentDrawer: boolean;
  setShowParentDrawer: (show: boolean) => void;

  // Hints
  hintsRemaining: number;
}

// ============================================
// CONSTANTS
// ============================================

const MAX_HINTS = 3;

// ============================================
// HOOK
// ============================================

export function useSudokuIntro(): UseSudokuIntroReturn {
  // ============================================
  // ORCHESTRATOR (logique commune factorisée)
  // ============================================
  const orchestrator = useGameIntroOrchestrator({
    gameId: 'sudoku',
    mascotMessages: {
      welcome: "Salut ! Je suis Félix ! Choisis un niveau !",
      startPlaying: LEVEL_MESSAGES.start[0],
      backToSelection: "On recommence ? Choisis un niveau !",
      help: "Chaque ligne, colonne et zone doit contenir tous les symboles une seule fois !",
    },
  });

  // Store - save progress
  const saveGameProgress = useStore((state) => state.saveGameProgress);

  // ============================================
  // LOCAL STATE - Niveaux (spécifique Sudoku)
  // ============================================
  const [selectedLevel, setSelectedLevel] = useState<SudokuLevelConfig | null>(null);
  const [mascotEmotion, setMascotEmotion] = useState<FelixEmotionType>('neutral');

  // ============================================
  // LOCAL STATE - Mode Entraînement
  // ============================================
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [showTrainingSelector, setShowTrainingSelector] = useState(false);
  const [trainingConfig, setTrainingConfig] = useState<TrainingConfig>(DEFAULT_TRAINING_CONFIG);

  // ============================================
  // LEVELS - avec progression (spécifique Sudoku)
  // ============================================
  const levels = useMemo(() => {
    const completedLevelIds = orchestrator.gameProgress?.completedLevels
      ? Object.keys(orchestrator.gameProgress.completedLevels)
      : [];

    return SUDOKU_LEVELS.map((level) => ({
      ...level,
      isUnlocked: isLevelUnlocked(level.number, completedLevelIds),
      isCompleted: completedLevelIds.includes(level.id),
      stars: orchestrator.gameProgress?.completedLevels?.[level.id]?.stars,
      bestTime: orchestrator.gameProgress?.completedLevels?.[level.id]?.bestTime,
    }));
  }, [orchestrator.gameProgress?.completedLevels]);

  // ============================================
  // GAME CONFIG
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
  // GAME COMPLETION HANDLER
  // ============================================
  const handleGameComplete = useCallback(
    (stats: GameStats) => {
      orchestrator.setIsVictory(true);
      orchestrator.setMascotMessage(
        LEVEL_MESSAGES.victory[Math.floor(Math.random() * LEVEL_MESSAGES.victory.length)]
      );
      setMascotEmotion('excited');

      // Ne pas sauvegarder en mode entraînement
      if (isTrainingMode || !selectedLevel) return;

      const idealDuration = getIdealDuration(selectedLevel);
      const stars = calculateStars(
        stats.errorsCount,
        stats.hintsUsed,
        stats.duration,
        idealDuration
      );

      saveGameProgress('sudoku', {
        levelId: selectedLevel.id,
        stars,
        completed: true,
        hintsUsed: stats.hintsUsed,
        errors: stats.errorsCount,
        duration: stats.duration,
      });

      orchestrator.router.push({
        pathname: '/(games)/05-sudoku/victory',
        params: {
          level: selectedLevel.number.toString(),
          stars: stars.toString(),
          duration: stats.duration.toString(),
          hintsUsed: stats.hintsUsed.toString(),
          errorsCount: stats.errorsCount.toString(),
        },
      });
    },
    [isTrainingMode, selectedLevel, saveGameProgress, orchestrator]
  );

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
    handleDrop,
  } = gameHook;

  // ============================================
  // SOUNDS
  // ============================================
  const { playVictory, playHint } = useSudokuSound();

  // Ref pour tracker les paramètres URL
  const lastLevelParamRef = useRef<string | undefined>(undefined);

  // ============================================
  // EFFECTS - Sélection automatique niveau
  // ============================================
  useEffect(() => {
    const levelParamChanged = orchestrator.params.level !== lastLevelParamRef.current;
    if (levelParamChanged) {
      lastLevelParamRef.current = orchestrator.params.level;
    }

    if (levels.length > 0 && (!selectedLevel || levelParamChanged)) {
      let defaultLevel: SudokuLevelConfig | undefined;

      if (orchestrator.params.level) {
        const levelNumber = parseInt(orchestrator.params.level, 10);
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
        orchestrator.setMascotMessage(
          `Niveau ${defaultLevel.number} ! ${getLevelDescription(defaultLevel)}`
        );
        setMascotEmotion('happy');
      }
    }
  }, [levels, selectedLevel, orchestrator]);

  // ============================================
  // EFFECTS - Feedback jeu
  // ============================================
  useEffect(() => {
    if (gameState.isComplete) return;

    const hasConflicts = gameState.grid.cells.some((row) =>
      row.some((cell) => cell.hasConflict)
    );

    if (hasConflicts) {
      const errorMessages = LEVEL_MESSAGES.error;
      orchestrator.setMascotMessage(
        errorMessages[Math.floor(Math.random() * errorMessages.length)]
      );
      setMascotEmotion('encouraging');
    }
  }, [gameState.isComplete, gameState.grid.cells, orchestrator]);

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
    const filledCells = gameState.grid.cells
      .flat()
      .filter((cell) => cell.value !== null).length;
    const fixedCells = gameState.grid.cells.flat().filter((cell) => cell.isFixed).length;
    const totalEmptyCells = totalCells - fixedCells;
    const userFilledCells = filledCells - fixedCells;
    const emptyCellsRemaining = totalEmptyCells - userFilledCells;

    return {
      emptyCellsRemaining,
      totalEmptyCells,
      hintsUsed: gameState.hintsUsed,
      errorsCount: errorCount,
      progress:
        totalEmptyCells > 0 ? Math.round((userFilledCells / totalEmptyCells) * 100) : 0,
    };
  }, [gameState.grid, gameState.hintsUsed, errorCount]);

  // ============================================
  // HANDLERS SPÉCIFIQUES
  // ============================================

  const handleSelectLevel = useCallback(
    (level: SudokuLevelConfig) => {
      if (!level.isUnlocked) {
        orchestrator.setMascotMessage(
          "Ce niveau n'est pas encore débloqué ! Finis le précédent d'abord !"
        );
        setMascotEmotion('thinking');
        return;
      }

      setSelectedLevel(level);
      setIsTrainingMode(false);
      orchestrator.setMascotMessage(`Niveau ${level.number} ! ${getLevelDescription(level)}`);
      setMascotEmotion('happy');
    },
    [orchestrator]
  );

  const handleStartPlaying = useCallback(() => {
    if (!gameConfig) return;

    orchestrator.handleStartPlaying();
    const startMessages = LEVEL_MESSAGES.start;
    orchestrator.setMascotMessage(
      startMessages[Math.floor(Math.random() * startMessages.length)]
    );
    setMascotEmotion('excited');
  }, [gameConfig, orchestrator]);

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
    orchestrator.setMascotMessage('Mode entraînement ! Amuse-toi bien !');
    setMascotEmotion('happy');
    orchestrator.transitionToPlayMode();
  }, [orchestrator]);

  const handleBack = useCallback(() => {
    if (orchestrator.isPlaying) {
      orchestrator.transitionToSelectionMode();
      orchestrator.setMascotMessage('On recommence ? Choisis un niveau !');
      setMascotEmotion('encouraging');
      orchestrator.setIsVictory(false);
    } else {
      orchestrator.router.replace('/');
    }
  }, [orchestrator]);

  const handleHelpPress = useCallback(() => {
    orchestrator.setMascotMessage(
      'Chaque ligne, colonne et zone doit contenir tous les symboles une seule fois !'
    );
    setMascotEmotion('thinking');
  }, [orchestrator]);

  const handleReset = useCallback(() => {
    gameHandleReset();
    orchestrator.setMascotMessage('Nouvelle grille ! Bonne chance !');
    setMascotEmotion('neutral');
  }, [gameHandleReset, orchestrator]);

  const handleHint = useCallback(() => {
    if (gameState.hintsUsed >= MAX_HINTS) {
      orchestrator.setMascotMessage('Tu as utilisé tous tes indices ! Essaie par toi-même !');
      setMascotEmotion('encouraging');
      return null;
    }

    playHint();
    const result = gameHandleHint();

    if (result) {
      const hintMessages = LEVEL_MESSAGES.hint;
      orchestrator.setMascotMessage(
        hintMessages[Math.floor(Math.random() * hintMessages.length)]
      );
      setMascotEmotion('thinking');
    }

    return result;
  }, [gameState.hintsUsed, playHint, gameHandleHint, orchestrator]);

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
    isPlaying: orchestrator.isPlaying,
    isVictory: orchestrator.isVictory,
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
    handleDrop,

    // Mascot
    mascotMessage: orchestrator.mascotMessage,
    mascotEmotion,

    // Animations
    selectorStyle: orchestrator.selectorStyle,
    progressPanelStyle: orchestrator.progressPanelStyle,

    // Progress data
    progressData,

    // Handlers
    handleStartPlaying,
    handleBack,
    handleReset,
    handleHint,
    handleParentPress: orchestrator.handleParentPress,
    handleHelpPress,

    // Parent drawer
    showParentDrawer: orchestrator.showParentDrawer,
    setShowParentDrawer: orchestrator.setShowParentDrawer,

    // Hints
    hintsRemaining: MAX_HINTS - gameState.hintsUsed,
  };
}

export default useSudokuIntro;
