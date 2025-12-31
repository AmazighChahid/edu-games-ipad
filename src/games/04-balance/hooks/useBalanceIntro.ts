/**
 * useBalanceIntro - Hook orchestrateur pour Balance Logique
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

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
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
} from '../../../components/common';
import { useBalanceGame } from './useBalanceGame';
import { useBalanceSound } from './useBalanceSound';
import { useActiveProfile, useGameProgress, useStore } from '../../../store/useStore';
import { getAllPuzzles, getPuzzleById } from '../data/puzzles';
import { balanceParentGuideData } from '../data/parentGuideData';
import { createInitialState, addObjectToPlate } from '../logic/balanceEngine';
import { createObject } from '../data/objects';
import { Icons } from '../../../constants/icons';
import type { Puzzle, Phase, MascotMood, BalanceState, WeightObject as WeightObjectType } from '../types';
import { PHASE_INFO } from '../types';

// ============================================
// TYPES
// ============================================

export type EmotionType = 'neutral' | 'happy' | 'thinking' | 'excited' | 'encouraging' | 'celebratory';

export interface UseBalanceIntroReturn {
  // Niveaux
  levels: LevelConfig[];
  selectedLevel: LevelConfig | null;
  handleSelectLevel: (level: LevelConfig) => void;

  // État jeu
  isPlaying: boolean;
  isVictory: boolean;
  currentPuzzle: Puzzle | null;

  // Parent drawer
  showParentDrawer: boolean;
  setShowParentDrawer: (show: boolean) => void;

  // Animations (styles animés)
  selectorStyle: ReturnType<typeof useAnimatedStyle>;
  progressPanelStyle: ReturnType<typeof useAnimatedStyle>;

  // Mascot
  mascotMessage: string;
  mascotEmotion: EmotionType;

  // Balance state pour preview et jeu
  balanceState: BalanceState;
  availableObjects: WeightObjectType[];
  previewBalanceState: BalanceState | null;

  // Progress data pour ProgressPanel
  progressData: {
    current: number;
    total: number;
    attempts: number;
    hintsUsed: number;
    discoveredEquivalences: number;
  };

  // Handlers
  handleBack: () => void;
  handleStartPlaying: () => void;
  handleParentPress: () => void;
  handleHelpPress: () => void;
  handleReset: () => void;
  handleHint: () => void;
  handlePlaceObject: (object: WeightObjectType, side: 'left' | 'right') => void;
  handleRemoveObject: (objectId: string, side: 'left' | 'right') => void;
  handleNextLevel: () => void;

  // Hints
  hintsRemaining: number;

  // Navigation vers modes spéciaux
  handleGoToSandbox: () => void;
  handleGoToJournal: () => void;

  // Données parent
  parentGuideData: typeof balanceParentGuideData;

  // Helper
  getPhaseInfo: (phase: Phase) => typeof PHASE_INFO[Phase];
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

const MASCOT_MESSAGES = {
  welcome: `Bienvenue dans mon laboratoire ! ${Icons.lab} Je suis Dr. Hibou !`,
  selectLevel: "Choisis un niveau pour commencer l'expérience !",
  startPlaying: "C'est parti ! Équilibre la balance !",
  hint: "Observe bien la balance... De quel côté penche-t-elle ?",
  success: `${Icons.sparkles} Eurêka ! Parfait équilibre !`,
  error: "Hmm, pas tout à fait... Essaie autre chose !",
  closeBalance: "Elle oscille ! Tu es tout près !",
  backToSelection: "On recommence ? Choisis un niveau !",
};

const MAX_HINTS = 3;

// ============================================
// HOOK
// ============================================

export function useBalanceIntro(): UseBalanceIntroReturn {
  const router = useRouter();
  const profile = useActiveProfile();

  // Store - progression
  const gameProgress = useGameProgress('balance');
  const initGameProgress = useStore((state) => state.initGameProgress);

  // Initialiser le progress si nécessaire
  useEffect(() => {
    initGameProgress('balance');
  }, [initGameProgress]);

  // État local
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [mascotMessage, setMascotMessage] = useState(MASCOT_MESSAGES.welcome);
  const [mascotEmotion, setMascotEmotion] = useState<EmotionType>('happy');
  const [showParentDrawer, setShowParentDrawer] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  // Tous les puzzles
  const allPuzzles = useMemo(() => getAllPuzzles(), []);

  // Extraire les IDs des niveaux complétés depuis le store
  const completedLevelIds = useMemo(() => {
    if (!gameProgress?.completedLevels) return [];
    return Object.keys(gameProgress.completedLevels).map(
      (levelId) => `balance_${levelId}`
    );
  }, [gameProgress?.completedLevels]);

  // Générer les niveaux basés sur l'âge de l'enfant et les niveaux complétés
  const levels = useMemo(() => {
    return generateDefaultLevels('balance', profile?.birthDate, completedLevelIds);
  }, [profile?.birthDate, completedLevelIds]);

  // Hook du jeu
  const gameHook = useBalanceGame({
    puzzle: currentPuzzle || allPuzzles[0],
    onComplete: (stats) => {
      handlePuzzleComplete(stats);
    },
  });

  const {
    balanceState,
    availableObjects,
    placeObject,
    removeObject,
    requestHint,
    currentHint,
    hintsUsed: gameHintsUsed,
    attempts,
    isVictory: gameIsVictory,
    discoveredEquivalences,
    reset: resetGame,
  } = gameHook;

  // Sons
  const { playPlace, playRemove, playBalance, playHint } = useBalanceSound();

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
    setIsVictory(false);
  }, [selectorY, selectorOpacity, progressPanelOpacity]);

  // ============================================
  // PREVIEW BALANCE STATE
  // ============================================

  const previewBalanceState = useMemo(() => {
    if (!currentPuzzle) return null;

    let state = createInitialState();

    // Ajouter les objets initiaux
    currentPuzzle.initialLeft.forEach(config => {
      for (let i = 0; i < config.count; i++) {
        const obj = createObject(config.objectId, `preview_left_${config.objectId}_${i}`);
        state = addObjectToPlate(state, obj, 'left');
      }
    });

    currentPuzzle.initialRight.forEach(config => {
      for (let i = 0; i < config.count; i++) {
        const obj = createObject(config.objectId, `preview_right_${config.objectId}_${i}`);
        state = addObjectToPlate(state, obj, 'right');
      }
    });

    return state;
  }, [currentPuzzle]);

  // ============================================
  // EFFECTS - Sélection automatique niveau
  // ============================================

  useEffect(() => {
    if (levels.length > 0 && !selectedLevel) {
      try {
        // Trouver le premier niveau débloqué mais non complété
        const firstIncompleteLevel = levels.find(
          (level) => level.isUnlocked && !level.isCompleted
        );

        const defaultLevel = firstIncompleteLevel ||
          levels.filter(l => l.isUnlocked).pop() ||
          levels[0];

        if (defaultLevel) {
          setSelectedLevel(defaultLevel);
          // Trouver le puzzle correspondant
          const puzzle = getPuzzleById(defaultLevel.id);
          if (puzzle) {
            setCurrentPuzzle(puzzle);
          }
          setMascotMessage(MASCOT_MESSAGES.selectLevel);
          setMascotEmotion('happy');
        }
      } catch {
        // En cas d'erreur, sélectionner le niveau 1
        const level1 = levels[0];
        if (level1) {
          setSelectedLevel(level1);
          const puzzle = getPuzzleById(level1.id);
          if (puzzle) {
            setCurrentPuzzle(puzzle);
          }
        }
      }
    }
  }, [levels, selectedLevel]);

  // ============================================
  // EFFECTS - Feedback jeu (victoire)
  // ============================================

  useEffect(() => {
    if (gameIsVictory && !isVictory) {
      setIsVictory(true);
      playBalance();
      setMascotMessage(MASCOT_MESSAGES.success);
      setMascotEmotion('celebratory');
    }
  }, [gameIsVictory, isVictory, playBalance]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleSelectLevel = useCallback((level: LevelConfig) => {
    setSelectedLevel(level);

    // Trouver le puzzle correspondant
    const puzzle = getPuzzleById(level.id);
    if (puzzle) {
      setCurrentPuzzle(puzzle);
      const phaseInfo = PHASE_INFO[puzzle.phase];
      setMascotMessage(`Phase ${puzzle.phase} : ${phaseInfo.name} !`);
      setMascotEmotion('happy');
    }
  }, []);

  const handleStartPlaying = useCallback(() => {
    if (!selectedLevel) return;
    transitionToPlayMode();
    setMascotMessage(MASCOT_MESSAGES.startPlaying);
    setMascotEmotion('excited');
    setHintsUsed(0);
  }, [selectedLevel, transitionToPlayMode]);

  const handleBack = useCallback(() => {
    if (isPlaying) {
      transitionToSelectionMode();
      setMascotMessage(MASCOT_MESSAGES.backToSelection);
      setMascotEmotion('encouraging');
      resetGame();
    } else {
      // Retour à l'accueil depuis la sélection des niveaux
      router.replace('/');
    }
  }, [isPlaying, router, transitionToSelectionMode, resetGame]);

  const handleParentPress = useCallback(() => {
    setShowParentDrawer(true);
  }, []);

  const handleHelpPress = useCallback(() => {
    setMascotMessage(MASCOT_MESSAGES.hint);
    setMascotEmotion('thinking');
  }, []);

  const handleReset = useCallback(() => {
    resetGame();
    setIsVictory(false);
    setMascotMessage("Nouvelle expérience ! Observe bien...");
    setMascotEmotion('neutral');
  }, [resetGame]);

  const handleHint = useCallback(() => {
    if (hintsUsed < MAX_HINTS) {
      requestHint();
      playHint();
      setHintsUsed(prev => prev + 1);
      setMascotMessage(currentHint || MASCOT_MESSAGES.hint);
      setMascotEmotion('thinking');
    }
  }, [hintsUsed, requestHint, playHint, currentHint]);

  const handlePlaceObject = useCallback((object: WeightObjectType, side: 'left' | 'right') => {
    placeObject(object, side);
    playPlace();

    // Vérifier si proche de l'équilibre
    const newAngle = Math.abs(balanceState.angle);
    if (newAngle < 5 && newAngle > 0) {
      setMascotMessage(MASCOT_MESSAGES.closeBalance);
      setMascotEmotion('excited');
    }
  }, [placeObject, playPlace, balanceState.angle]);

  const handleRemoveObject = useCallback((objectId: string, side: 'left' | 'right') => {
    removeObject(objectId, side);
    playRemove();
  }, [removeObject, playRemove]);

  const handleNextLevel = useCallback(() => {
    if (!currentPuzzle) return;

    // Trouver le prochain puzzle
    const currentIndex = allPuzzles.findIndex(p => p.id === currentPuzzle.id);
    if (currentIndex < allPuzzles.length - 1) {
      const nextPuzzle = allPuzzles[currentIndex + 1];
      setCurrentPuzzle(nextPuzzle);

      // Mettre à jour le niveau sélectionné
      const nextLevel = levels.find(l => l.id === nextPuzzle.id);
      if (nextLevel) {
        setSelectedLevel(nextLevel);
      }

      resetGame();
      setIsVictory(false);
      setHintsUsed(0);

      const phaseInfo = PHASE_INFO[nextPuzzle.phase];
      setMascotMessage(`Niveau ${nextPuzzle.level} ! ${phaseInfo.name}`);
      setMascotEmotion('happy');
    } else {
      // Tous les puzzles complétés, retour à la sélection
      transitionToSelectionMode();
      setMascotMessage("Bravo ! Tu as terminé tous les niveaux !");
      setMascotEmotion('celebratory');
    }
  }, [currentPuzzle, allPuzzles, levels, resetGame, transitionToSelectionMode]);

  const handlePuzzleComplete = useCallback((stats: {
    puzzleId: string;
    completed: boolean;
    attempts: number;
    hintsUsed: number;
    timeSpent: number;
    equivalenciesDiscovered: string[];
  }) => {
    // Le store sera mis à jour ici quand implémenté
    console.log('Puzzle completed:', stats);
  }, []);

  const handleGoToSandbox = useCallback(() => {
    router.push('/(games)/04-balance/sandbox' as const);
  }, [router]);

  const handleGoToJournal = useCallback(() => {
    router.push('/(games)/04-balance/journal' as const);
  }, [router]);

  const getPhaseInfo = useCallback((phase: Phase) => {
    return PHASE_INFO[phase];
  }, []);

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
    currentPuzzle,

    // Parent drawer
    showParentDrawer,
    setShowParentDrawer,

    // Animations
    selectorStyle,
    progressPanelStyle,

    // Mascot
    mascotMessage,
    mascotEmotion,

    // Balance
    balanceState,
    availableObjects,
    previewBalanceState,

    // Progress data
    progressData: {
      current: currentPuzzle?.level || 0,
      total: allPuzzles.length,
      attempts,
      hintsUsed: gameHintsUsed,
      discoveredEquivalences: discoveredEquivalences.length,
    },

    // Handlers
    handleBack,
    handleStartPlaying,
    handleParentPress,
    handleHelpPress,
    handleReset,
    handleHint,
    handlePlaceObject,
    handleRemoveObject,
    handleNextLevel,

    // Hints
    hintsRemaining: MAX_HINTS - hintsUsed,

    // Navigation
    handleGoToSandbox,
    handleGoToJournal,

    // Données parent
    parentGuideData: balanceParentGuideData,

    // Helper
    getPhaseInfo,
  };
}

export default useBalanceIntro;
