/**
 * useBalanceIntro - Hook orchestrateur pour Balance Logique
 *
 * VERSION MIGRÉE (Janvier 2026)
 * Utilise useGameIntroOrchestrator pour la logique commune.
 * Ce fichier ne contient plus que la logique spécifique au jeu.
 *
 * @see docs/GAME_ARCHITECTURE.md pour le pattern complet
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'expo-router';

import { useGameIntroOrchestrator, type EmotionType } from '../../../hooks';
import type { LevelConfig } from '../../../components/common';
import { useBalanceGame } from './useBalanceGame';
import { useBalanceSound } from './useBalanceSound';
import { getAllPuzzles, getPuzzleById, getPuzzlesByPhase } from '../data/puzzles';
import { balanceParentGuideData } from '../data/parentGuideData';
import { createInitialState, addObjectToPlate } from '../logic/balanceEngine';
import { createObject } from '../data/objects';
import { Icons } from '../../../constants/icons';
import type { Puzzle, Phase, BalanceState, WeightObject as WeightObjectType } from '../types';
import { PHASE_INFO } from '../types';

// Re-export EmotionType for backward compatibility
export type { EmotionType } from '../../../hooks';

// ============================================
// TYPES
// ============================================

export interface UseBalanceIntroReturn {
  // Phase / Tranche d'âge
  selectedPhase: Phase;
  handlePhaseChange: (phase: Phase) => void;

  // Niveaux (depuis orchestrator)
  levels: LevelConfig[];
  selectedLevel: LevelConfig | null;
  handleSelectLevel: (level: LevelConfig) => void;
  handleSelectFreeMode: () => void;

  // État jeu (depuis orchestrator)
  isPlaying: boolean;
  isVictory: boolean;
  currentPuzzle: Puzzle | null;

  // Parent drawer (depuis orchestrator)
  showParentDrawer: boolean;
  setShowParentDrawer: (show: boolean) => void;

  // Animations (depuis orchestrator)
  selectorStyle: ReturnType<typeof useGameIntroOrchestrator>['selectorStyle'];
  progressPanelStyle: ReturnType<typeof useGameIntroOrchestrator>['progressPanelStyle'];

  // Mascot (depuis orchestrator)
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

const MAX_HINTS = 3;

const MASCOT_MESSAGES = {
  welcome: `Bienvenue dans mon laboratoire ! ${Icons.lab} Je suis Dr. Hibou !`,
  selectLevel: "Choisis un niveau pour commencer l'expérience !",
  startPlaying: "C'est parti ! Équilibre la balance !",
  hint: 'Observe bien la balance... De quel côté penche-t-elle ?',
  success: `${Icons.sparkles} Eurêka ! Parfait équilibre !`,
  error: 'Hmm, pas tout à fait... Essaie autre chose !',
  closeBalance: 'Elle oscille ! Tu es tout près !',
  backToSelection: 'On recommence ? Choisis un niveau !',
};

// ============================================
// HOOK
// ============================================

export function useBalanceIntro(): UseBalanceIntroReturn {
  const router = useRouter();

  // ============================================
  // ORCHESTRATOR (logique commune factorisée)
  // ============================================
  const orchestrator = useGameIntroOrchestrator({
    gameId: 'balance',
    mascotMessages: {
      welcome: MASCOT_MESSAGES.welcome,
      startPlaying: MASCOT_MESSAGES.startPlaying,
      backToSelection: MASCOT_MESSAGES.backToSelection,
      help: MASCOT_MESSAGES.hint,
    },
  });

  // ============================================
  // PHASE / AGE SELECTION (spécifique à Balance)
  // ============================================

  // Calculer la phase initiale basée sur l'âge du profil
  const initialPhase = useMemo((): Phase => {
    if (!orchestrator.profile?.birthDate) return 1;
    const ageInYears =
      (Date.now() - orchestrator.profile.birthDate) / (1000 * 60 * 60 * 24 * 365);
    if (ageInYears < 7) return 1; // 6-7 ans
    if (ageInYears < 8) return 2; // 7-8 ans
    if (ageInYears < 9) return 3; // 8-9 ans
    return 4; // 9-10 ans
  }, [orchestrator.profile?.birthDate]);

  const [selectedPhase, setSelectedPhase] = useState<Phase>(initialPhase);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);

  // ============================================
  // PUZZLES DATA
  // ============================================

  const allPuzzles = useMemo(() => getAllPuzzles(), []);

  const phasePuzzles = useMemo(() => {
    return getPuzzlesByPhase(selectedPhase);
  }, [selectedPhase]);

  // ============================================
  // LEVELS (spécifique - généré depuis puzzles)
  // ============================================

  const levels = useMemo((): LevelConfig[] => {
    const difficultyMap: Record<number, LevelConfig['difficulty']> = {
      1: 'easy',
      2: 'medium',
      3: 'hard',
      4: 'expert',
      5: 'expert',
    };

    // Niveau 0 : Mode Libre
    const freeModeLevel: LevelConfig = {
      id: 'balance_free',
      number: 0,
      label: 'Libre',
      difficulty: 'easy',
      isUnlocked: true,
      isCompleted: false,
      config: { isFreeMode: true },
    };

    // Niveaux de la phase (numérotés 1 à N)
    const phaseLevels: LevelConfig[] = phasePuzzles.map(
      (puzzle, index): LevelConfig => {
        const isCompleted = orchestrator.completedLevelIds.includes(puzzle.id);
        return {
          id: puzzle.id,
          number: index + 1,
          difficulty: difficultyMap[puzzle.difficulty] || 'medium',
          isUnlocked: true,
          isCompleted,
          stars: isCompleted ? 3 : undefined,
          config: { phase: puzzle.phase, puzzleLevel: puzzle.level },
        };
      }
    );

    return [freeModeLevel, ...phaseLevels];
  }, [phasePuzzles, orchestrator.completedLevelIds]);

  // ============================================
  // GAME HOOK (spécifique à Balance)
  // ============================================

  const gameHook = useBalanceGame({
    puzzle: currentPuzzle || allPuzzles[0],
    onComplete: (_stats) => {
      // Le store sera mis à jour ici quand implémenté
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

  // ============================================
  // SONS
  // ============================================
  const { playPlace, playRemove, playBalance, playHint } = useBalanceSound();

  // ============================================
  // PREVIEW BALANCE STATE
  // ============================================

  const previewBalanceState = useMemo(() => {
    if (!currentPuzzle) return null;

    let state = createInitialState();

    // Ajouter les objets initiaux
    currentPuzzle.initialLeft.forEach((config) => {
      for (let i = 0; i < config.count; i++) {
        const obj = createObject(config.objectId, `preview_left_${config.objectId}_${i}`);
        state = addObjectToPlate(state, obj, 'left');
      }
    });

    currentPuzzle.initialRight.forEach((config) => {
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
    if (levels.length > 0 && !orchestrator.selectedLevel) {
      const firstIncompleteLevel = levels.find(
        (level) => level.isUnlocked && !level.isCompleted
      );

      const defaultLevel =
        firstIncompleteLevel || levels.filter((l) => l.isUnlocked).pop() || levels[0];

      if (defaultLevel) {
        orchestrator.handleSelectLevel(defaultLevel);
        const puzzle = getPuzzleById(defaultLevel.id);
        if (puzzle) {
          setCurrentPuzzle(puzzle);
        }
        orchestrator.setMascotMessage(MASCOT_MESSAGES.selectLevel);
        orchestrator.setMascotEmotion('happy');
      }
    }
  }, [levels, orchestrator]);

  // ============================================
  // EFFECTS - Feedback jeu (victoire)
  // ============================================

  useEffect(() => {
    if (gameIsVictory && !orchestrator.isVictory) {
      orchestrator.setIsVictory(true);
      playBalance();
      orchestrator.setMascotMessage(MASCOT_MESSAGES.success);
      orchestrator.setMascotEmotion('excited');
    }
  }, [gameIsVictory, orchestrator, playBalance]);

  // ============================================
  // HANDLERS SPÉCIFIQUES
  // ============================================

  const handlePhaseChange = useCallback(
    (phase: Phase) => {
      setSelectedPhase(phase);
      setCurrentPuzzle(null);
      const phaseInfo = PHASE_INFO[phase];
      orchestrator.setMascotMessage(`${phaseInfo.name} (${phaseInfo.ageGroup} ans) !`);
      orchestrator.setMascotEmotion('happy');
    },
    [orchestrator]
  );

  const handleSelectFreeMode = useCallback(() => {
    router.push('/(games)/04-balance/sandbox' as const);
  }, [router]);

  const handleSelectLevel = useCallback(
    (level: LevelConfig) => {
      // Cas spécial : niveau 0 = Mode Libre
      if (level.number === 0 || level.config?.isFreeMode) {
        handleSelectFreeMode();
        return;
      }

      orchestrator.handleSelectLevel(level);

      // Trouver le puzzle correspondant
      const puzzle = getPuzzleById(level.id);
      if (puzzle) {
        setCurrentPuzzle(puzzle);
        orchestrator.setMascotMessage(`Niveau ${level.number} : ${puzzle.name}`);
        orchestrator.setMascotEmotion('happy');
      }
    },
    [orchestrator, handleSelectFreeMode]
  );

  const handleStartPlaying = useCallback(() => {
    if (!orchestrator.selectedLevel) return;
    orchestrator.handleStartPlaying();
    setHintsUsed(0);
  }, [orchestrator]);

  const handleBack = useCallback(() => {
    if (orchestrator.isPlaying) {
      orchestrator.transitionToSelectionMode();
      orchestrator.setMascotMessage(MASCOT_MESSAGES.backToSelection);
      orchestrator.setMascotEmotion('encouraging');
      resetGame();
      orchestrator.setIsVictory(false);
    } else {
      router.replace('/');
    }
  }, [orchestrator, router, resetGame]);

  const handleReset = useCallback(() => {
    resetGame();
    orchestrator.setIsVictory(false);
    orchestrator.setMascotMessage('Nouvelle expérience ! Observe bien...');
    orchestrator.setMascotEmotion('neutral');
  }, [resetGame, orchestrator]);

  const handleHint = useCallback(() => {
    if (hintsUsed < MAX_HINTS) {
      requestHint();
      playHint();
      setHintsUsed((prev) => prev + 1);
      orchestrator.setMascotMessage(currentHint || MASCOT_MESSAGES.hint);
      orchestrator.setMascotEmotion('thinking');
    }
  }, [hintsUsed, requestHint, playHint, currentHint, orchestrator]);

  const handlePlaceObject = useCallback(
    (object: WeightObjectType, side: 'left' | 'right') => {
      placeObject(object, side);
      playPlace();

      // Vérifier si proche de l'équilibre
      const newAngle = Math.abs(balanceState.angle);
      if (newAngle < 5 && newAngle > 0) {
        orchestrator.setMascotMessage(MASCOT_MESSAGES.closeBalance);
        orchestrator.setMascotEmotion('excited');
      }
    },
    [placeObject, playPlace, balanceState.angle, orchestrator]
  );

  const handleRemoveObject = useCallback(
    (objectId: string, side: 'left' | 'right') => {
      removeObject(objectId, side);
      playRemove();
    },
    [removeObject, playRemove]
  );

  const handleNextLevel = useCallback(() => {
    if (!currentPuzzle) return;

    const currentIndex = allPuzzles.findIndex((p) => p.id === currentPuzzle.id);
    if (currentIndex < allPuzzles.length - 1) {
      const nextPuzzle = allPuzzles[currentIndex + 1];
      setCurrentPuzzle(nextPuzzle);

      const nextLevel = levels.find((l) => l.id === nextPuzzle.id);
      if (nextLevel) {
        orchestrator.handleSelectLevel(nextLevel);
      }

      resetGame();
      orchestrator.setIsVictory(false);
      setHintsUsed(0);

      const phaseInfo = PHASE_INFO[nextPuzzle.phase];
      orchestrator.setMascotMessage(`Niveau ${nextPuzzle.level} ! ${phaseInfo.name}`);
      orchestrator.setMascotEmotion('happy');
    } else {
      orchestrator.transitionToSelectionMode();
      orchestrator.setMascotMessage('Bravo ! Tu as terminé tous les niveaux !');
      orchestrator.setMascotEmotion('excited');
    }
  }, [currentPuzzle, allPuzzles, levels, resetGame, orchestrator]);

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
    // Phase / Tranche d'âge
    selectedPhase,
    handlePhaseChange,

    // Depuis orchestrator
    levels,
    selectedLevel: orchestrator.selectedLevel,
    handleSelectLevel,
    handleSelectFreeMode,

    // État jeu
    isPlaying: orchestrator.isPlaying,
    isVictory: orchestrator.isVictory,
    currentPuzzle,

    // Parent drawer
    showParentDrawer: orchestrator.showParentDrawer,
    setShowParentDrawer: orchestrator.setShowParentDrawer,

    // Animations
    selectorStyle: orchestrator.selectorStyle,
    progressPanelStyle: orchestrator.progressPanelStyle,

    // Mascot
    mascotMessage: orchestrator.mascotMessage,
    mascotEmotion: orchestrator.mascotEmotion,

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
    handleParentPress: orchestrator.handleParentPress,
    handleHelpPress: orchestrator.handleHelpPress,
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
