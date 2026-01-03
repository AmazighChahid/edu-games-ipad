/**
 * useHanoiIntro - Hook orchestrateur pour Tour de Hanoï
 *
 * VERSION MIGRÉE (Janvier 2026)
 * Utilise useGameIntroOrchestrator pour la logique commune.
 * Ce fichier ne contient plus que la logique spécifique au jeu.
 *
 * @see docs/GAME_ARCHITECTURE.md pour le pattern complet
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  useSharedValue,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

import { useGameIntroOrchestrator, type EmotionType } from '../../../hooks';
import type { LevelConfig } from '../../../components/common';
import { useHanoiGame } from './useHanoiGame';
import { useHanoiSound } from './useHanoiSound';
import { hanoiLevels } from '../data/levels';
import { useStore } from '../../../store/useStore';
import type { HanoiLevelConfig, TowerId, HanoiGameState } from '../types';

// Re-export EmotionType for backward compatibility
export type { EmotionType } from '../../../hooks';

// ============================================
// TYPES
// ============================================

export type GameMode = 'discovery' | 'challenge' | 'expert';

export interface UseHanoiIntroReturn {
  // Niveaux (depuis orchestrator)
  levels: LevelConfig[];
  selectedLevel: LevelConfig | null;
  handleSelectLevel: (level: LevelConfig) => void;

  // État jeu (depuis orchestrator)
  isPlaying: boolean;
  isVictory: boolean;

  // Animations (depuis orchestrator)
  selectorStyle: ReturnType<typeof useGameIntroOrchestrator>['selectorStyle'];
  progressPanelStyle: ReturnType<typeof useGameIntroOrchestrator>['progressPanelStyle'];

  // Mascot (depuis orchestrator)
  mascotMessage: string;
  mascotEmotion: EmotionType;

  // Game state (depuis useHanoiGame)
  gameState: HanoiGameState;
  moveCount: number;
  progress: number;
  level: HanoiLevelConfig;
  timeElapsed: number;
  hasMovedOnce: boolean;
  highlightedTowers: { source: TowerId; target: TowerId } | null;

  // Handlers
  handleMove: (from: TowerId, to: TowerId) => void;
  handleBack: () => void;
  handleReset: () => void;
  handleHint: () => void;
  handleStartPlaying: () => void;
  handleParentPress: () => void;
  handleHelpPress: () => void;
  handleNextLevel: () => void;
  handleReplay: () => void;

  // Hints
  hintsRemaining: number;
  maxHints: number;
  hintsUsed: number;

  // Game mode
  gameMode: GameMode;
  handleModeChange: (mode: GameMode) => void;

  // Parent drawer (depuis orchestrator)
  showParentDrawer: boolean;
  setShowParentDrawer: (show: boolean) => void;

  // Demo
  showDemo: boolean;
  setShowDemo: (show: boolean) => void;

  // Hint message toast
  hintMessage: string | null;

  // Best score for current level
  bestMoves: number | undefined;

  // Dev mode
  devMode: boolean;
  handleForceComplete: () => void;
}

// ============================================
// CONSTANTS
// ============================================

const MESSAGES = {
  welcome: 'Déplace un seul anneau à la fois ! Le plus gros reste en dessous',
  levelSelect: (diskCount: number) =>
    diskCount <= 3
      ? `${diskCount} anneaux ! Parfait pour s'échauffer`
      : diskCount <= 5
      ? `${diskCount} anneaux ! Un bon défi`
      : `${diskCount} anneaux ! Tu es prêt pour l'expert ?`,
  playing: 'Continue, tu te débrouilles bien !',
  error: 'Oups ! Un grand anneau ne peut pas aller sur un petit',
  almostThere: 'Tu y es presque ! Continue comme ça',
  victory: 'Bravo ! Tu as réussi !',
  backToSelection: 'On recommence ? Choisis un niveau !',
  hint: 'Regarde où je te montre...',
  help: 'Observe bien la règle : petit sur grand !',
};

// ============================================
// HOOK
// ============================================

export function useHanoiIntro(): UseHanoiIntroReturn {
  // ============================================
  // ORCHESTRATOR (logique commune factorisée)
  // ============================================
  const orchestrator = useGameIntroOrchestrator({
    gameId: 'hanoi',
    mascotMessages: {
      welcome: MESSAGES.welcome,
      startPlaying: MESSAGES.playing,
      backToSelection: MESSAGES.backToSelection,
      help: MESSAGES.help,
    },
  });

  // Store - tutorial et dev mode
  const recordCompletion = useStore((state) => state.recordCompletion);
  const hasSeenHanoiTutorial = useStore((state) => state.hasSeenHanoiTutorial);
  const setHasSeenHanoiTutorial = useStore((state) => state.setHasSeenHanoiTutorial);
  const devMode = useStore((state) => state.devMode);

  // ============================================
  // LOCAL STATE (spécifique à Hanoi)
  // ============================================
  const [currentLevelId, setCurrentLevelId] = useState<string>(hanoiLevels[1].id);
  const [showDemo, setShowDemo] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('discovery');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [highlightedTowers, setHighlightedTowers] = useState<{ source: TowerId; target: TowerId } | null>(null);
  const [hintMessage, setHintMessage] = useState<string | null>(null);

  // ============================================
  // SOUNDS
  // ============================================
  const { playVictory, playHint } = useHanoiSound();

  // ============================================
  // GAME HOOK
  // ============================================
  const game = useHanoiGame({
    levelId: currentLevelId,
  });

  const {
    gameState,
    level,
    moveCount,
    consecutiveInvalid,
    isVictory: gameIsVictory,
    hasMovedOnce,
    timeElapsed,
    performMove,
    reset,
    getHint,
    playHint: executeHint,
    forceVictory,
  } = game;

  // Refs
  const previousLevelIdRef = useRef(currentLevelId);
  const hintPulse = useSharedValue(1);

  // ============================================
  // COMPUTED VALUES
  // ============================================

  // Hints based on mode
  const maxHints = gameMode === 'discovery' ? 99 : gameMode === 'challenge' ? 3 : 0;
  const hintsRemaining = Math.max(0, maxHints - hintsUsed);

  // Progress calculation
  const targetDisks = level.diskCount;
  const disksOnTarget = gameState.towers[2].disks.length;
  const progress = disksOnTarget / targetDisks;

  // Best moves for current level (from saved progress)
  const bestMoves = useMemo(() => {
    const completion = orchestrator.gameProgress?.completedLevels?.[currentLevelId];
    return completion?.bestMoveCount;
  }, [orchestrator.gameProgress, currentLevelId]);

  // ============================================
  // LEVELS (spécifique - généré depuis hanoiLevels)
  // ============================================
  const levels = useMemo<LevelConfig[]>(() => {
    return hanoiLevels.slice(0, 5).map((lvl, index) => {
      const completion = orchestrator.gameProgress?.completedLevels?.[lvl.id];
      const isCompleted = completion !== undefined;

      // Calculate stars based on performance (0-3)
      let stars: number | undefined;
      if (isCompleted && completion) {
        const optimalMoves = lvl.optimalMoves ?? (Math.pow(2, lvl.diskCount) - 1);
        const efficiency = optimalMoves / completion.bestMoveCount;
        if (efficiency >= 1) stars = 3; // Perfect
        else if (efficiency >= 0.7) stars = 2; // Good
        else stars = 1; // Completed
      }

      return {
        id: lvl.id,
        number: index + 1,
        difficulty: lvl.difficulty as LevelConfig['difficulty'],
        isUnlocked: true,
        isCompleted,
        stars,
        config: { diskCount: lvl.diskCount },
      };
    });
  }, [orchestrator.gameProgress]);

  // ============================================
  // EFFECTS - Tutorial auto-show
  // ============================================
  useEffect(() => {
    if (!hasSeenHanoiTutorial) {
      const timer = setTimeout(() => {
        setShowDemo(true);
        setHasSeenHanoiTutorial();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasSeenHanoiTutorial, setHasSeenHanoiTutorial]);

  // Update game when level selection changes
  useEffect(() => {
    if (!orchestrator.isPlaying && orchestrator.selectedLevel) {
      const hanoiLevel = hanoiLevels.find((l) => l.id === orchestrator.selectedLevel?.id);
      if (hanoiLevel && hanoiLevel.id !== currentLevelId) {
        setCurrentLevelId(hanoiLevel.id);
      }
    }
  }, [orchestrator.selectedLevel, orchestrator.isPlaying, currentLevelId]);

  // Reset game when currentLevelId changes
  useEffect(() => {
    if (previousLevelIdRef.current !== currentLevelId) {
      previousLevelIdRef.current = currentLevelId;
      reset();
      setHintsUsed(0);
    }
  }, [currentLevelId, reset]);

  // ============================================
  // EFFECTS - Game state feedback & victory
  // ============================================
  useEffect(() => {
    if (gameIsVictory && !orchestrator.isVictory) {
      orchestrator.setIsVictory(true);
      orchestrator.setMascotMessage(MESSAGES.victory);
      orchestrator.setMascotEmotion('excited');
      playVictory();

      // Save progress to store
      recordCompletion({
        gameId: 'hanoi',
        levelId: currentLevelId,
        completedAt: Date.now(),
        moveCount,
        timeSeconds: timeElapsed,
        hintsUsed,
      });
    } else if (consecutiveInvalid >= 2) {
      orchestrator.setMascotMessage(MESSAGES.error);
      orchestrator.setMascotEmotion('encouraging');
    } else if (progress > 0.7 && orchestrator.isPlaying) {
      orchestrator.setMascotMessage(MESSAGES.almostThere);
      orchestrator.setMascotEmotion('happy');
    } else if (orchestrator.isPlaying && hasMovedOnce) {
      orchestrator.setMascotMessage(MESSAGES.playing);
      orchestrator.setMascotEmotion('neutral');
    }
  }, [
    gameIsVictory,
    orchestrator,
    consecutiveInvalid,
    progress,
    hasMovedOnce,
    playVictory,
    recordCompletion,
    currentLevelId,
    moveCount,
    timeElapsed,
    hintsUsed,
  ]);

  // Select default level on mount
  useEffect(() => {
    if (levels.length > 0 && !orchestrator.selectedLevel) {
      const firstIncomplete = levels.find((l) => l.isUnlocked && !l.isCompleted);
      const defaultLevel = firstIncomplete || levels[1] || levels[0];

      if (defaultLevel) {
        orchestrator.handleSelectLevel(defaultLevel);

        const hanoiLevel = hanoiLevels.find((l) => l.id === defaultLevel.id);
        if (hanoiLevel) {
          orchestrator.setMascotMessage(MESSAGES.levelSelect(hanoiLevel.diskCount));
          orchestrator.setMascotEmotion('happy');
        }
      }
    }
  }, [levels, orchestrator]);

  // ============================================
  // HANDLERS SPÉCIFIQUES
  // ============================================

  const handleSelectLevel = useCallback(
    (level: LevelConfig) => {
      orchestrator.handleSelectLevel(level);
      const hanoiLevel = hanoiLevels.find((l) => l.id === level.id);
      if (hanoiLevel) {
        orchestrator.setMascotMessage(MESSAGES.levelSelect(hanoiLevel.diskCount));
        orchestrator.setMascotEmotion('happy');
      }
    },
    [orchestrator]
  );

  const handleStartPlaying = useCallback(() => {
    if (!orchestrator.selectedLevel) return;
    orchestrator.handleStartPlaying();
    orchestrator.setMascotMessage(MESSAGES.playing);
    orchestrator.setMascotEmotion('neutral');
  }, [orchestrator]);

  const handleBack = useCallback(() => {
    if (orchestrator.isPlaying) {
      orchestrator.transitionToSelectionMode();
      reset();
      setHintsUsed(0);
      orchestrator.setMascotMessage(MESSAGES.backToSelection);
      orchestrator.setMascotEmotion('encouraging');
      orchestrator.setIsVictory(false);
    } else {
      orchestrator.router.back();
    }
  }, [orchestrator, reset]);

  const handleReset = useCallback(() => {
    reset();
    setHintsUsed(0);
    orchestrator.setIsVictory(false);
    orchestrator.setMascotMessage(MESSAGES.playing);
    orchestrator.setMascotEmotion('neutral');
  }, [reset, orchestrator]);

  const handleHint = useCallback(() => {
    if (hintsRemaining > 0 && !orchestrator.isVictory) {
      setHintsUsed((prev) => prev + 1);

      hintPulse.value = withSequence(
        withTiming(1.2, { duration: 150 }),
        withTiming(1, { duration: 150 })
      );

      const hint = getHint();
      if (hint) {
        const towerNames = ['A', 'B', 'C'];
        setHintMessage(`Déplace vers ${towerNames[hint.to]}`);
        setHighlightedTowers({ source: hint.from, target: hint.to });
        orchestrator.setMascotMessage(MESSAGES.hint);
        orchestrator.setMascotEmotion('thinking');
        playHint();

        setTimeout(() => {
          executeHint();
          setHintMessage(null);
          setHighlightedTowers(null);
        }, 1500);
      }
    }
  }, [hintsRemaining, orchestrator, getHint, executeHint, playHint, hintPulse]);

  const handleMove = useCallback(
    (from: TowerId, to: TowerId) => {
      if (orchestrator.isVictory) return;

      // Transition to play mode on first move
      if (!orchestrator.isPlaying) {
        orchestrator.transitionToPlayMode();
      }

      performMove(from, to);
    },
    [orchestrator, performMove]
  );

  const handleHelpPress = useCallback(() => {
    setShowDemo(true);
    orchestrator.setMascotMessage(MESSAGES.help);
    orchestrator.setMascotEmotion('thinking');
  }, [orchestrator]);

  const handleModeChange = useCallback(
    (mode: GameMode) => {
      setGameMode(mode);
      setHintsUsed(0);
      reset();
    },
    [reset]
  );

  const handleNextLevel = useCallback(() => {
    if (!orchestrator.selectedLevel) return;

    const currentIndex = levels.findIndex((l) => l.id === orchestrator.selectedLevel?.id);
    if (currentIndex < levels.length - 1) {
      const nextLevel = levels[currentIndex + 1];
      orchestrator.handleSelectLevel(nextLevel);
      setCurrentLevelId(nextLevel.id);
      reset();
      setHintsUsed(0);
      orchestrator.transitionToSelectionMode();
      orchestrator.setIsVictory(false);
    }
  }, [orchestrator, levels, reset]);

  const handleReplay = useCallback(() => {
    reset();
    setHintsUsed(0);
    orchestrator.transitionToSelectionMode();
    orchestrator.setIsVictory(false);
  }, [reset, orchestrator]);

  // Force complete level (DEV MODE only)
  const handleForceComplete = useCallback(() => {
    if (!devMode || orchestrator.isVictory) return;

    recordCompletion({
      gameId: 'hanoi',
      levelId: currentLevelId,
      completedAt: Date.now(),
      moveCount: moveCount || 1,
      timeSeconds: timeElapsed || 1,
      hintsUsed,
    });

    orchestrator.setMascotMessage(MESSAGES.victory);
    orchestrator.setMascotEmotion('excited');
    forceVictory();
  }, [devMode, orchestrator, recordCompletion, currentLevelId, moveCount, timeElapsed, hintsUsed, forceVictory]);

  // ============================================
  // RETURN
  // ============================================

  return {
    // Depuis orchestrator
    levels,
    selectedLevel: orchestrator.selectedLevel,
    handleSelectLevel,

    // État jeu
    isPlaying: orchestrator.isPlaying,
    isVictory: orchestrator.isVictory,

    // Animations
    selectorStyle: orchestrator.selectorStyle,
    progressPanelStyle: orchestrator.progressPanelStyle,

    // Mascot
    mascotMessage: orchestrator.mascotMessage,
    mascotEmotion: orchestrator.mascotEmotion,

    // Game state
    gameState,
    moveCount,
    progress,
    level,
    timeElapsed,
    hasMovedOnce,
    highlightedTowers,

    // Handlers
    handleMove,
    handleBack,
    handleReset,
    handleHint,
    handleStartPlaying,
    handleParentPress: orchestrator.handleParentPress,
    handleHelpPress,
    handleNextLevel,
    handleReplay,

    // Hints
    hintsRemaining,
    maxHints,
    hintsUsed,

    // Game mode
    gameMode,
    handleModeChange,

    // Parent drawer
    showParentDrawer: orchestrator.showParentDrawer,
    setShowParentDrawer: orchestrator.setShowParentDrawer,

    // Demo
    showDemo,
    setShowDemo,

    // Hint message
    hintMessage,

    // Best score
    bestMoves,

    // Dev mode
    devMode,
    handleForceComplete,
  };
}

export default useHanoiIntro;
