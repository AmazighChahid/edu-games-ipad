/**
 * useLogixGridIntro - Hook orchestrateur pour Logix Grid
 *
 * VERSION MIGRÉE (Janvier 2026)
 * Utilise useGameIntroOrchestrator pour la logique commune.
 * Ce fichier ne contient plus que la logique spécifique au jeu.
 *
 * @see docs/GAME_ARCHITECTURE.md pour le pattern complet
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';

import { useGameIntroOrchestrator } from '../../../hooks';
import type { LevelConfig } from '../../../components/common';
import { useLogixGridGame } from './useLogixGridGame';
import { useLogixGridSound } from './useLogixGridSound';
import {
  logixLevels,
  type LogixLevelConfig,
  getLevelsForAge,
  calculateAgeFromBirthDate,
} from '../data/levels';
import type { AdaEmotionType } from '../components/AdaMascot';

// ============================================
// TYPES
// ============================================

export interface UseLogixGridIntroReturn {
  // Niveaux (depuis orchestrator)
  levels: LevelConfig[];
  selectedLevel: LevelConfig | null;
  selectedLogixLevel: LogixLevelConfig | null;
  handleSelectLevel: (level: LevelConfig) => void;

  // État jeu (depuis orchestrator)
  isPlaying: boolean;
  isVictory: boolean;

  // Parent drawer (depuis orchestrator)
  showParentDrawer: boolean;
  setShowParentDrawer: (show: boolean) => void;

  // Animations (depuis orchestrator)
  selectorStyle: ReturnType<typeof useGameIntroOrchestrator>['selectorStyle'];
  progressPanelStyle: ReturnType<typeof useGameIntroOrchestrator>['progressPanelStyle'];

  // Mascot
  mascotMessage: string;
  mascotEmotion: AdaEmotionType;

  // Game state (depuis useLogixGridGame)
  gameState: ReturnType<typeof useLogixGridGame>['gameState'];
  result: ReturnType<typeof useLogixGridGame>['result'];
  errors: ReturnType<typeof useLogixGridGame>['errors'];

  // Progress data pour ProgressPanel
  progressData: {
    cluesUsed: number;
    totalClues: number;
    hintsUsed: number;
    hintsAvailable: number;
    timeElapsed: number;
  };

  // Handlers
  handleCellToggle: (rowItemId: string, colItemId: string) => void;
  handleCellSelect: (rowItemId: string | null, colItemId: string | null) => void;
  handleClueUse: (clueId: string) => void;
  handleHintRequest: () => void;
  handleReset: () => void;
  handleBack: () => void;
  handleStartPlaying: () => void;
  handlePause: () => void;
  handleResume: () => void;
  handleParentPress: () => void;
  handleHelpPress: () => void;
  getCellStateValue: ReturnType<typeof useLogixGridGame>['getCellStateValue'];

  // Hints
  hintsRemaining: number;
}

// ============================================
// CONSTANTS
// ============================================

// Messages Ada la Fourmi
const ADA_MESSAGES = {
  welcome: [
    "Bonjour détective ! Je suis Ada, prête à résoudre des énigmes ?",
    "Bzz bzz ! Une nouvelle enquête nous attend !",
    "Salut ! Tu veux m'aider à trouver les bonnes réponses ?",
  ],
  levelSelect: {
    easy: "Un bon début pour s'échauffer les antennes !",
    medium: "Ce niveau demande un peu de réflexion...",
    hard: "Un vrai défi pour détective confirmé !",
  },
  start: [
    "C'est parti ! Lis bien les indices...",
    "Observe chaque indice attentivement !",
    "À toi de jouer, détective !",
  ],
  hint: [
    "Hmm, laisse-moi réfléchir... 🔍",
    "Regarde bien cette zone de la grille...",
    "Un indice ? Voilà ce que j'ai trouvé !",
  ],
  success: [
    "Bravo ! Tu as trouvé !",
    "Excellent travail, détective !",
    "C'est ça ! Continue comme ça !",
  ],
  error: [
    "Hmm, vérifie les indices...",
    "Pas tout à fait, réessaie !",
    "Attention, relis bien les indices !",
  ],
  victory: [
    "Enquête résolue ! Tu es un super détective !",
    "Parfait ! La fourmi est fière de toi !",
    "Mission accomplie ! 🏆",
  ],
  back: [
    "On change de niveau ?",
    "Prêt pour une nouvelle enquête ?",
  ],
};

// Helper pour message aléatoire
function randomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

// ============================================
// HOOK
// ============================================

export function useLogixGridIntro(): UseLogixGridIntroReturn {
  // ============================================
  // ORCHESTRATOR (logique commune factorisée)
  // ============================================
  const orchestrator = useGameIntroOrchestrator({
    gameId: 'logix-grid',
    mascotMessages: {
      welcome: randomMessage(ADA_MESSAGES.welcome),
      startPlaying: randomMessage(ADA_MESSAGES.start),
      backToSelection: randomMessage(ADA_MESSAGES.back),
      help: "Lis bien chaque indice ! Qu'est-ce qui est impossible ?",
    },
  });

  // ============================================
  // LOCAL STATE (spécifique à Logix Grid)
  // ============================================
  const [selectedLogixLevel, setSelectedLogixLevel] = useState<LogixLevelConfig | null>(null);
  const [mascotEmotion, setMascotEmotion] = useState<AdaEmotionType>('happy');

  // Calculer l'âge de l'enfant
  const childAge = useMemo(() => {
    return calculateAgeFromBirthDate(orchestrator.profile?.birthDate);
  }, [orchestrator.profile?.birthDate]);

  // ============================================
  // LEVELS (spécifique - généré depuis logixLevels)
  // ============================================
  const levels = useMemo(() => {
    const ageLevels = getLevelsForAge(childAge);

    return ageLevels.map((logixLevel) => {
      const isCompleted = orchestrator.completedLevelIds.includes(logixLevel.id);
      return {
        id: logixLevel.id,
        number: logixLevel.displayOrder,
        label: `${logixLevel.displayOrder}`,
        difficulty: logixLevel.difficulty as 'easy' | 'medium' | 'hard' | 'expert',
        isUnlocked: true,
        isCompleted,
        stars: isCompleted ? 3 : undefined,
      } as LevelConfig;
    });
  }, [childAge, orchestrator.completedLevelIds]);

  // ============================================
  // GAME HOOK
  // ============================================
  const gameHook = useLogixGridGame();
  const {
    gameState,
    result,
    errors,
    startGame,
    initGame,
    handleCellToggle: cellToggle,
    handleCellSelect: cellSelect,
    handleClueUse: clueUse,
    handleHintRequest: hintRequest,
    pauseGame,
    resumeGame,
    restartLevel,
    getCellStateValue,
  } = gameHook;

  // ============================================
  // SOUNDS
  // ============================================
  const { playSelect, playError, playHint, playVictory, playClue } = useLogixGridSound();

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

    if (levels.length > 0 && (!orchestrator.selectedLevel || levelParamChanged)) {
      let defaultLevel: LevelConfig | undefined;

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
        orchestrator.handleSelectLevel(defaultLevel);
        const logixLevel = logixLevels.find((l) => l.displayOrder === defaultLevel!.number);
        setSelectedLogixLevel(logixLevel || null);

        const diffKey = defaultLevel.difficulty as keyof typeof ADA_MESSAGES.levelSelect;
        orchestrator.setMascotMessage(
          `Niveau ${defaultLevel.number} ! ${ADA_MESSAGES.levelSelect[diffKey] || ''}`
        );
        setMascotEmotion('happy');
      }
    }
  }, [levels, orchestrator]);

  // ============================================
  // EFFECTS - Initialiser le jeu quand niveau sélectionné
  // ============================================
  useEffect(() => {
    if (selectedLogixLevel && !orchestrator.isPlaying) {
      initGame(selectedLogixLevel.puzzle);
    }
  }, [selectedLogixLevel, orchestrator.isPlaying, initGame]);

  // ============================================
  // EFFECTS - Feedback jeu
  // ============================================
  useEffect(() => {
    if (gameState?.phase === 'victory' && !orchestrator.isVictory) {
      orchestrator.setIsVictory(true);
      playVictory();
      orchestrator.setMascotMessage(randomMessage(ADA_MESSAGES.victory));
      setMascotEmotion('excited');
    }
  }, [gameState?.phase, orchestrator, playVictory]);

  useEffect(() => {
    if (errors.length > 0) {
      playError();
      orchestrator.setMascotMessage(randomMessage(ADA_MESSAGES.error));
      setMascotEmotion('encouraging');
    }
  }, [errors.length, playError, orchestrator]);

  // ============================================
  // HANDLERS SPÉCIFIQUES
  // ============================================

  const handleSelectLevel = useCallback(
    (level: LevelConfig) => {
      orchestrator.handleSelectLevel(level);
      const logixLevel = logixLevels.find((l) => l.displayOrder === level.number);
      setSelectedLogixLevel(logixLevel || null);

      playSelect();

      const diffKey = level.difficulty as keyof typeof ADA_MESSAGES.levelSelect;
      orchestrator.setMascotMessage(
        `Niveau ${level.number} ! ${ADA_MESSAGES.levelSelect[diffKey] || ''}`
      );
      setMascotEmotion('happy');
    },
    [orchestrator, playSelect]
  );

  const handleStartPlaying = useCallback(() => {
    if (!selectedLogixLevel) return;

    const puzzle = selectedLogixLevel.puzzle;
    if (!puzzle?.solution || Object.keys(puzzle.solution).length === 0) {
      orchestrator.setMascotMessage("Oups ! Ce niveau n'est pas encore prêt.");
      setMascotEmotion('encouraging');
      return;
    }

    orchestrator.handleStartPlaying();
    startGame(selectedLogixLevel.puzzle);
    orchestrator.setMascotMessage(randomMessage(ADA_MESSAGES.start));
    setMascotEmotion('excited');
  }, [selectedLogixLevel, orchestrator, startGame]);

  const handleBack = useCallback(() => {
    if (orchestrator.isPlaying) {
      orchestrator.transitionToSelectionMode();
      orchestrator.setMascotMessage(randomMessage(ADA_MESSAGES.back));
      setMascotEmotion('neutral');
      orchestrator.setIsVictory(false);
    } else {
      orchestrator.router.replace('/');
    }
  }, [orchestrator]);

  const handleReset = useCallback(() => {
    if (selectedLogixLevel) {
      restartLevel();
      orchestrator.setIsVictory(false);
      orchestrator.setMascotMessage(randomMessage(ADA_MESSAGES.start));
      setMascotEmotion('neutral');
    }
  }, [selectedLogixLevel, restartLevel, orchestrator]);

  const handleCellToggle = useCallback(
    (rowItemId: string, colItemId: string) => {
      playSelect();
      cellToggle(rowItemId, colItemId);
    },
    [playSelect, cellToggle]
  );

  const handleCellSelect = useCallback(
    (rowItemId: string | null, colItemId: string | null) => {
      cellSelect(rowItemId, colItemId);
    },
    [cellSelect]
  );

  const handleClueUse = useCallback(
    (clueId: string) => {
      playClue();
      clueUse(clueId);
      orchestrator.setMascotMessage('Bon indice ! Réfléchis bien...');
      setMascotEmotion('thinking');
    },
    [playClue, clueUse, orchestrator]
  );

  const handleHintRequest = useCallback(() => {
    playHint();
    hintRequest();
    orchestrator.setMascotMessage(randomMessage(ADA_MESSAGES.hint));
    setMascotEmotion('thinking');
  }, [playHint, hintRequest, orchestrator]);

  const handlePause = useCallback(() => {
    pauseGame();
    orchestrator.setMascotMessage('Pause ! Prends ton temps pour réfléchir...');
    setMascotEmotion('neutral');
  }, [pauseGame, orchestrator]);

  const handleResume = useCallback(() => {
    resumeGame();
    orchestrator.setMascotMessage("C'est reparti !");
    setMascotEmotion('happy');
  }, [resumeGame, orchestrator]);

  const handleHelpPress = useCallback(() => {
    orchestrator.setMascotMessage("Lis bien chaque indice ! Qu'est-ce qui est impossible ?");
    setMascotEmotion('thinking');
  }, [orchestrator]);

  // ============================================
  // RETURN
  // ============================================

  return {
    // Depuis orchestrator
    levels,
    selectedLevel: orchestrator.selectedLevel,
    selectedLogixLevel,
    handleSelectLevel,

    // État jeu
    isPlaying: orchestrator.isPlaying,
    isVictory: orchestrator.isVictory,

    // Parent drawer
    showParentDrawer: orchestrator.showParentDrawer,
    setShowParentDrawer: orchestrator.setShowParentDrawer,

    // Animations
    selectorStyle: orchestrator.selectorStyle,
    progressPanelStyle: orchestrator.progressPanelStyle,

    // Mascot
    mascotMessage: orchestrator.mascotMessage,
    mascotEmotion,

    // Game state
    gameState,
    result,
    errors,

    // Progress data
    progressData: {
      cluesUsed: gameState?.usedClueIds.length ?? 0,
      totalClues: gameState?.puzzle.clues.length ?? 0,
      hintsUsed: gameState?.hintsUsed ?? 0,
      hintsAvailable: gameState?.puzzle.hintsAvailable ?? 3,
      timeElapsed: gameState?.timeElapsed ?? 0,
    },

    // Handlers
    handleCellToggle,
    handleCellSelect,
    handleClueUse,
    handleHintRequest,
    handleReset,
    handleBack,
    handleStartPlaying,
    handlePause,
    handleResume,
    handleParentPress: orchestrator.handleParentPress,
    handleHelpPress,
    getCellStateValue,

    // Hints
    hintsRemaining: (gameState?.puzzle.hintsAvailable ?? 3) - (gameState?.hintsUsed ?? 0),
  };
}

export default useLogixGridIntro;
