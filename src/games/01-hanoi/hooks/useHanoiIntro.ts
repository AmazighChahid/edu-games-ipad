/**
 * useHanoiIntro - Hook orchestrateur pour Tour de Hanoï
 *
 * Encapsule toute la logique métier de l'écran d'introduction :
 * - Progression store (lecture/écriture)
 * - Gestion des niveaux
 * - Messages mascotte
 * - Sons (via useHanoiSound)
 * - Animations de transition (Reanimated)
 * - Navigation
 * - Mode de jeu (discovery, challenge, expert)
 *
 * @see docs/GAME_ARCHITECTURE.md pour le pattern complet
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withSequence,
  Easing,
} from 'react-native-reanimated';

import { useHanoiGame } from './useHanoiGame';
import { useHanoiSound } from './useHanoiSound';
import { hanoiLevels } from '../data/levels';
import { useStore, useActiveProfile, useGameProgress } from '../../../store/useStore';
import type { LevelConfig } from '../../../components/common/GameIntroTemplate.types';
import type { HanoiLevelConfig, TowerId, HanoiGameState } from '../types';

// ============================================
// TYPES
// ============================================

export type EmotionType = 'neutral' | 'happy' | 'thinking' | 'excited' | 'encouraging';
export type GameMode = 'discovery' | 'challenge' | 'expert';

export interface UseHanoiIntroReturn {
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

  // Parent drawer
  showParentDrawer: boolean;
  setShowParentDrawer: (show: boolean) => void;

  // Demo
  showDemo: boolean;
  setShowDemo: (show: boolean) => void;

  // Hint message toast
  hintMessage: string | null;

  // Best score for current level
  bestMoves: number | undefined;
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
  const router = useRouter();
  const profile = useActiveProfile();

  // Store - progression et tutorial
  const gameProgress = useGameProgress('hanoi');
  const recordCompletion = useStore((state) => state.recordCompletion);
  const hasSeenHanoiTutorial = useStore((state) => state.hasSeenHanoiTutorial);
  const setHasSeenHanoiTutorial = useStore((state) => state.setHasSeenHanoiTutorial);

  // État local
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [currentLevelId, setCurrentLevelId] = useState<string>(hanoiLevels[1].id); // Default 3 disks
  const [isPlaying, setIsPlaying] = useState(false);
  const [mascotMessage, setMascotMessage] = useState(MESSAGES.welcome);
  const [mascotEmotion, setMascotEmotion] = useState<EmotionType>('neutral');
  const [showParentDrawer, setShowParentDrawer] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('discovery');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [highlightedTowers, setHighlightedTowers] = useState<{ source: TowerId; target: TowerId } | null>(null);
  const [hintMessage, setHintMessage] = useState<string | null>(null);

  // Sounds
  const { playDiskPlace, playDiskError, playVictory, playHint } = useHanoiSound();

  // Game hook
  const game = useHanoiGame({
    levelId: currentLevelId,
  });

  const {
    gameState,
    level,
    moveCount,
    consecutiveInvalid,
    isVictory,
    hasMovedOnce,
    timeElapsed,
    performMove,
    reset,
    getHint,
    playHint: executeHint,
  } = game;

  // Refs
  const previousLevelIdRef = useRef(currentLevelId);

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
    const completion = gameProgress?.completedLevels?.[currentLevelId];
    return completion?.bestMoveCount;
  }, [gameProgress, currentLevelId]);

  // Generate levels for GameIntroTemplate format (only first 5 levels: 2-6 disks)
  const levels = useMemo<LevelConfig[]>(() => {
    return hanoiLevels.slice(0, 5).map((lvl, index) => {
      const completion = gameProgress?.completedLevels?.[lvl.id];
      const isCompleted = completion !== undefined;

      // Calculate stars based on performance (0-3)
      let stars: number | undefined;
      if (isCompleted && completion) {
        const optimalMoves = lvl.optimalMoves ?? (Math.pow(2, lvl.diskCount) - 1);
        const efficiency = optimalMoves / completion.bestMoveCount;
        if (efficiency >= 1) stars = 3;        // Perfect
        else if (efficiency >= 0.7) stars = 2; // Good
        else stars = 1;                         // Completed
      }

      return {
        id: lvl.id,
        number: index + 1,
        difficulty: lvl.difficulty as LevelConfig['difficulty'],
        isUnlocked: true, // All levels unlocked
        isCompleted,
        stars,
        config: { diskCount: lvl.diskCount },
      };
    });
  }, [gameProgress]);

  // ============================================
  // ANIMATIONS
  // ============================================

  const selectorY = useSharedValue(0);
  const selectorOpacity = useSharedValue(1);
  const progressPanelOpacity = useSharedValue(0);
  const hintPulse = useSharedValue(1);

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
  // EFFECTS
  // ============================================

  // Auto-show demo on first launch
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
    if (!isPlaying && selectedLevel) {
      const hanoiLevel = hanoiLevels.find((l) => l.id === selectedLevel.id);
      if (hanoiLevel && hanoiLevel.id !== currentLevelId) {
        setCurrentLevelId(hanoiLevel.id);
      }
    }
  }, [selectedLevel, isPlaying, currentLevelId]);

  // Reset game when currentLevelId changes
  useEffect(() => {
    if (previousLevelIdRef.current !== currentLevelId) {
      previousLevelIdRef.current = currentLevelId;
      reset();
      setHintsUsed(0);
    }
  }, [currentLevelId, reset]);

  // Update mascot message based on game state + save progress on victory
  useEffect(() => {
    if (isVictory) {
      setMascotMessage(MESSAGES.victory);
      setMascotEmotion('excited');
      playVictory();

      // Save progress to store
      recordCompletion({
        gameId: 'hanoi',
        levelId: currentLevelId,
        profileId: profile?.id || 'default',
        completedAt: Date.now(),
        moveCount,
        timeSeconds: timeElapsed,
        hintsUsed,
        wasSuccessful: true,
      });
    } else if (consecutiveInvalid >= 2) {
      setMascotMessage(MESSAGES.error);
      setMascotEmotion('encouraging');
    } else if (progress > 0.7 && isPlaying) {
      setMascotMessage(MESSAGES.almostThere);
      setMascotEmotion('happy');
    } else if (isPlaying && hasMovedOnce) {
      setMascotMessage(MESSAGES.playing);
      setMascotEmotion('neutral');
    }
  }, [isVictory, consecutiveInvalid, progress, isPlaying, hasMovedOnce, playVictory, recordCompletion, currentLevelId, profile, moveCount, timeElapsed, hintsUsed]);

  // Select default level on mount
  useEffect(() => {
    if (levels.length > 0 && !selectedLevel) {
      // Find first incomplete level or default to level 2 (3 disks)
      const firstIncomplete = levels.find((l) => l.isUnlocked && !l.isCompleted);
      const defaultLevel = firstIncomplete || levels[1] || levels[0];
      setSelectedLevel(defaultLevel);

      const hanoiLevel = hanoiLevels.find((l) => l.id === defaultLevel.id);
      if (hanoiLevel) {
        setMascotMessage(MESSAGES.levelSelect(hanoiLevel.diskCount));
        setMascotEmotion('happy');
      }
    }
  }, [levels, selectedLevel]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleSelectLevel = useCallback((level: LevelConfig) => {
    setSelectedLevel(level);
    const hanoiLevel = hanoiLevels.find((l) => l.id === level.id);
    if (hanoiLevel) {
      setMascotMessage(MESSAGES.levelSelect(hanoiLevel.diskCount));
      setMascotEmotion('happy');
    }
  }, []);

  const handleStartPlaying = useCallback(() => {
    if (!selectedLevel) return;
    transitionToPlayMode();
    setMascotMessage(MESSAGES.playing);
    setMascotEmotion('neutral');
  }, [selectedLevel, transitionToPlayMode]);

  const handleBack = useCallback(() => {
    if (isPlaying) {
      transitionToSelectionMode();
      reset();
      setHintsUsed(0);
      setMascotMessage(MESSAGES.backToSelection);
      setMascotEmotion('encouraging');
    } else {
      router.back();
    }
  }, [isPlaying, router, transitionToSelectionMode, reset]);

  const handleReset = useCallback(() => {
    reset();
    setHintsUsed(0);
    setMascotMessage(MESSAGES.playing);
    setMascotEmotion('neutral');
  }, [reset]);

  const handleHint = useCallback(() => {
    if (hintsRemaining > 0 && !isVictory) {
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
        setMascotMessage(MESSAGES.hint);
        setMascotEmotion('thinking');
        playHint();

        setTimeout(() => {
          executeHint();
          setHintMessage(null);
          setHighlightedTowers(null);
        }, 1500);
      }
    }
  }, [hintsRemaining, isVictory, getHint, executeHint, playHint, hintPulse]);

  const handleMove = useCallback((from: TowerId, to: TowerId) => {
    if (isVictory) return;

    // Transition to play mode on first move
    if (!isPlaying) {
      transitionToPlayMode();
    }

    performMove(from, to);
  }, [isVictory, isPlaying, transitionToPlayMode, performMove]);

  const handleParentPress = useCallback(() => {
    setShowParentDrawer(true);
  }, []);

  const handleHelpPress = useCallback(() => {
    setShowDemo(true);
    setMascotMessage(MESSAGES.help);
    setMascotEmotion('thinking');
  }, []);

  const handleModeChange = useCallback((mode: GameMode) => {
    setGameMode(mode);
    setHintsUsed(0);
    reset();
  }, [reset]);

  const handleNextLevel = useCallback(() => {
    if (!selectedLevel) return;

    const currentIndex = levels.findIndex((l) => l.id === selectedLevel.id);
    if (currentIndex < levels.length - 1) {
      const nextLevel = levels[currentIndex + 1];
      setSelectedLevel(nextLevel);
      setCurrentLevelId(nextLevel.id);
      reset();
      setHintsUsed(0);
      transitionToSelectionMode();
    }
  }, [selectedLevel, levels, reset, transitionToSelectionMode]);

  const handleReplay = useCallback(() => {
    reset();
    setHintsUsed(0);
    transitionToSelectionMode();
  }, [reset, transitionToSelectionMode]);

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
    handleParentPress,
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
    showParentDrawer,
    setShowParentDrawer,

    // Demo
    showDemo,
    setShowDemo,

    // Hint message
    hintMessage,

    // Best score
    bestMoves,
  };
}

export default useHanoiIntro;
