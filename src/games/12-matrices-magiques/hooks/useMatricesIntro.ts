/**
 * useMatricesIntro - Hook orchestrateur pour Matrices Magiques
 *
 * VERSION MIGRÉE (Janvier 2026)
 * Utilise useGameIntroOrchestrator pour la logique commune.
 * Ce fichier ne contient plus que la logique spécifique au jeu.
 *
 * @see docs/GAME_ARCHITECTURE.md pour le pattern complet
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';

import { useGameIntroOrchestrator, type EmotionType } from '../../../hooks';
import type { LevelConfig } from '../../../components/common';
import { useMatricesGame } from './useMatricesGame';
import { useMatricesSound } from './useMatricesSound';
import { WORLDS_ARRAY, getWorldById } from '../data/worlds';
import { MATRICES_LEVELS } from '../data/levels';
import type { WorldConfig, WorldTheme } from '../types';

// Re-export EmotionType for backward compatibility
export type { EmotionType } from '../../../hooks';

// ============================================
// TYPES
// ============================================

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
  selectorStyle: ReturnType<typeof useGameIntroOrchestrator>['selectorStyle'];
  progressPanelStyle: ReturnType<typeof useGameIntroOrchestrator>['progressPanelStyle'];

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

const PIXEL_MESSAGES = {
  welcome: 'Bienvenue dans les Matrices Magiques ! Choisis un monde !',
  worldSelect: ['Quel monde veux-tu explorer ?', 'Chaque monde a ses mystères...', 'Choisis ton aventure !'],
  levelSelect: ['Prêt pour ce niveau ?', "Les puzzles t'attendent !"],
  thinking: ['Observe bien les patterns...', 'Regarde ligne par ligne...', "Qu'est-ce qui change ?"],
  correct: ['Bravo ! C\'est ça !', 'Excellent ! Tu as trouvé !', 'Super logique !'],
  error: ['Pas tout à fait... Réessaie !', 'Presque ! Regarde encore.', 'Hmm, observe mieux !'],
  hint: 'Je te donne un indice...',
  victory: 'Félicitations ! Tu as réussi !',
};

// Helper pour message aléatoire
function randomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

// ============================================
// HOOK
// ============================================

export function useMatricesIntro(): UseMatricesIntroReturn {
  // ============================================
  // ORCHESTRATOR (logique commune factorisée)
  // ============================================
  const orchestrator = useGameIntroOrchestrator({
    gameId: 'matrices-magiques',
    mascotMessages: {
      welcome: PIXEL_MESSAGES.welcome,
      startPlaying: randomMessage(PIXEL_MESSAGES.thinking),
      backToSelection: PIXEL_MESSAGES.welcome,
      help: randomMessage(PIXEL_MESSAGES.thinking),
    },
  });

  // ============================================
  // LOCAL STATE (spécifique à Matrices)
  // ============================================
  const [selectedWorld, setSelectedWorld] = useState<WorldConfig | null>(null);
  const [pixelEmotion, setPixelEmotion] = useState<EmotionType>('neutral');

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

  // Ref pour tracker les paramètres URL
  const lastWorldParamRef = useRef<string | undefined>(undefined);

  // ============================================
  // EFFECTS - Sélection automatique monde
  // ============================================
  useEffect(() => {
    // Sélectionner le premier monde par défaut
    if (WORLDS_ARRAY.length > 0 && !selectedWorld) {
      const worldId = (orchestrator.params.world || 'forest') as WorldTheme;
      const world = getWorldById(worldId) || WORLDS_ARRAY[0];
      setSelectedWorld(world);
    }
  }, [selectedWorld, orchestrator.params.world]);

  // ============================================
  // EFFECTS - Sélection automatique niveau
  // ============================================
  useEffect(() => {
    if (orchestrator.levels.length > 0 && !orchestrator.selectedLevel && selectedWorld) {
      const worldLevels = orchestrator.levels.filter((l) => {
        const matricesLevel = MATRICES_LEVELS.find((ml) => ml.number === l.number);
        return matricesLevel?.worldId === selectedWorld.id;
      });

      if (worldLevels.length > 0) {
        const firstUnlocked =
          worldLevels.find((l) => l.isUnlocked && !l.isCompleted) ||
          worldLevels.find((l) => l.isUnlocked) ||
          worldLevels[0];
        orchestrator.handleSelectLevel(firstUnlocked);
      }
    }
  }, [orchestrator.levels, orchestrator.selectedLevel, selectedWorld, orchestrator]);

  // ============================================
  // EFFECTS - Feedback jeu
  // ============================================
  useEffect(() => {
    if (gameState === 'correct') {
      playCorrect();
      orchestrator.setMascotMessage(randomMessage(PIXEL_MESSAGES.correct));
      setPixelEmotion('excited');
    } else if (gameState === 'incorrect') {
      playError();
      orchestrator.setMascotMessage(randomMessage(PIXEL_MESSAGES.error));
      setPixelEmotion('encouraging');
    }
  }, [gameState, playCorrect, playError, orchestrator]);

  // ============================================
  // HANDLERS SPÉCIFIQUES
  // ============================================

  const handleSelectWorld = useCallback(
    (worldId: string) => {
      const world = getWorldById(worldId as WorldTheme);
      if (world) {
        setSelectedWorld(world);
        orchestrator.handleSelectLevel(null as unknown as LevelConfig);
        orchestrator.setMascotMessage(randomMessage(PIXEL_MESSAGES.worldSelect));
        setPixelEmotion('happy');
      }
    },
    [orchestrator]
  );

  const handleSelectLevel = useCallback(
    (level: LevelConfig) => {
      orchestrator.handleSelectLevel(level);
      orchestrator.setMascotMessage(randomMessage(PIXEL_MESSAGES.levelSelect));
      setPixelEmotion('happy');
    },
    [orchestrator]
  );

  const handleStartPlaying = useCallback(() => {
    if (!orchestrator.selectedLevel || !selectedWorld) return;
    orchestrator.handleStartPlaying();
    startGame(selectedWorld.id as WorldTheme, orchestrator.selectedLevel.number);
    orchestrator.setMascotMessage(randomMessage(PIXEL_MESSAGES.thinking));
    setPixelEmotion('thinking');
  }, [orchestrator, selectedWorld, startGame]);

  const handleBack = useCallback(() => {
    if (orchestrator.isPlaying) {
      orchestrator.transitionToSelectionMode();
      orchestrator.setMascotMessage(PIXEL_MESSAGES.welcome);
      setPixelEmotion('encouraging');
      orchestrator.setIsVictory(false);
    } else {
      orchestrator.router.replace('/');
    }
  }, [orchestrator]);

  const handleHelpPress = useCallback(() => {
    orchestrator.setMascotMessage(randomMessage(PIXEL_MESSAGES.thinking));
    setPixelEmotion('thinking');
  }, [orchestrator]);

  const handleSelectChoice = useCallback(
    (choiceIndex: number) => {
      playSelect();
      selectChoice(choiceIndex);
    },
    [selectChoice, playSelect]
  );

  const handleValidate = useCallback(() => {
    submitAnswer();
  }, [submitAnswer]);

  const handleRequestHint = useCallback(() => {
    playHint();
    requestHint();
    orchestrator.setMascotMessage(PIXEL_MESSAGES.hint);
    setPixelEmotion('thinking');
  }, [requestHint, playHint, orchestrator]);

  const handleNextPuzzle = useCallback(() => {
    nextPuzzle();
    orchestrator.setMascotMessage(randomMessage(PIXEL_MESSAGES.thinking));
    setPixelEmotion('neutral');
  }, [nextPuzzle, orchestrator]);

  const handleRestartLevel = useCallback(() => {
    resetPuzzle();
    orchestrator.setIsVictory(false);
    orchestrator.setMascotMessage(PIXEL_MESSAGES.welcome);
    setPixelEmotion('neutral');
  }, [resetPuzzle, orchestrator]);

  // ============================================
  // RETURN
  // ============================================

  return {
    // Mondes
    worlds: WORLDS_ARRAY,
    selectedWorld,
    handleSelectWorld,

    // Depuis orchestrator
    levels: orchestrator.levels,
    selectedLevel: orchestrator.selectedLevel,
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
    pixelMessage: orchestrator.mascotMessage,
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
    handleParentPress: orchestrator.handleParentPress,
    handleHelpPress,
    handleNextPuzzle,
    handleRestartLevel,
  };
}

export default useMatricesIntro;
