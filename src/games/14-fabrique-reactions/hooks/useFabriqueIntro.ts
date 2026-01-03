/**
 * useFabriqueIntro - Hook orchestrateur pour La Fabrique de Réactions
 *
 * VERSION MIGRÉE (Janvier 2026)
 * Utilise useGameIntroOrchestrator pour la logique commune.
 * Ce fichier ne contient plus que la logique spécifique au jeu.
 *
 * @see docs/GAME_ARCHITECTURE.md pour le pattern complet
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';

import { useGameIntroOrchestrator } from '../../../hooks';
import type { LevelConfig as UILevelConfig } from '../../../components/common';
import { useFabriqueGame } from './useFabriqueGame';
import { useFabriqueSound } from './useFabriqueSound';
import { GEDEON_MESSAGES, getRandomMessage } from '../data/assistantScripts';
import { LEVELS, getLevelByNumber } from '../data/levels';
import type { GedeonExpression, LevelConfig as GameLevelConfig, GridPosition } from '../types';

// ============================================
// TYPES
// ============================================

export interface UseFabriqueIntroReturn {
  // Niveaux UI
  levels: UILevelConfig[];
  selectedLevel: UILevelConfig | null;
  handleSelectLevel: (level: UILevelConfig) => void;

  // État jeu
  isPlaying: boolean;
  isVictory: boolean;

  // Parent drawer
  showParentDrawer: boolean;
  setShowParentDrawer: (show: boolean) => void;

  // Animations
  selectorStyle: ReturnType<typeof useGameIntroOrchestrator>['selectorStyle'];
  progressPanelStyle: ReturnType<typeof useGameIntroOrchestrator>['progressPanelStyle'];

  // Mascot
  mascotMessage: string;
  mascotEmotion: GedeonExpression;

  // Game state
  currentGameLevel: GameLevelConfig | null;
  placedElements: ReturnType<typeof useFabriqueGame>['placedElements'];
  connections: ReturnType<typeof useFabriqueGame>['connections'];
  availableElements: string[];
  selectedSlot: GridPosition | null;
  gameStatus: ReturnType<typeof useFabriqueGame>['status'];

  // Progress data
  progressData: {
    current: number;
    total: number;
    attempts: number;
    hintsUsed: number;
    stars: number;
  };

  // Handlers
  handlePlaceElement: (elementId: string, position: GridPosition) => void;
  handleRemoveElement: (placedId: string) => void;
  handleSelectSlot: (position: GridPosition | null) => void;
  handleRunSimulation: () => void;
  handleReset: () => void;
  handleHint: () => void;
  handleBack: () => void;
  handleStartPlaying: () => void;
  handleParentPress: () => void;
  handleHelpPress: () => void;
  handleForceComplete: () => void;

  // Hints
  hintsRemaining: number;
  canPlayAudio: boolean;

  // Simulation
  isSimulating: boolean;
}

// ============================================
// CONSTANTS
// ============================================

const TOTAL_LEVELS = 10;

// ============================================
// HOOK
// ============================================

export function useFabriqueIntro(): UseFabriqueIntroReturn {
  // ============================================
  // ORCHESTRATOR (logique commune factorisée)
  // ============================================
  const orchestrator = useGameIntroOrchestrator({
    gameId: 'fabrique-reactions',
    mascotMessages: {
      welcome: getRandomMessage(GEDEON_MESSAGES.welcome),
      startPlaying: getRandomMessage(GEDEON_MESSAGES.levelStart),
      backToSelection: 'On recommence ? Choisis un niveau !',
      help: getRandomMessage(GEDEON_MESSAGES.hint),
    },
  });

  // ============================================
  // LOCAL STATE (spécifique à Fabrique)
  // ============================================
  const [mascotEmotion, setMascotEmotion] = useState<GedeonExpression>('neutral');
  const [currentGameLevel, setCurrentGameLevel] = useState<GameLevelConfig | null>(null);

  // Ref pour tracker l'initialisation
  const lastLevelParamRef = useRef<string | undefined>(undefined);

  // Hook du jeu (seulement quand un niveau est chargé)
  const gameHook = useFabriqueGame({
    level: currentGameLevel || LEVELS[0],
    onLevelComplete: (result) => {
      if (result.success) {
        orchestrator.setIsVictory(true);
        orchestrator.setMascotMessage(getRandomMessage(GEDEON_MESSAGES.success));
        setMascotEmotion('excited');

        // Navigation vers victory
        orchestrator.router.push({
          pathname: '/(games)/14-fabrique-reactions/victory',
          params: {
            level: (orchestrator.selectedLevel?.number || 1).toString(),
            stars: result.stars.toString(),
            moves: result.moves.toString(),
            hintsUsed: result.hintsUsed.toString(),
            time: result.time.toString(),
          },
        });
      }
    },
  });

  // Sons
  const { playSelect, playPlace, playCorrect, playError } = useFabriqueSound();

  // ============================================
  // EFFECTS - Sélection automatique niveau
  // ============================================
  useEffect(() => {
    const levelParamChanged = orchestrator.params.level !== lastLevelParamRef.current;
    if (levelParamChanged) {
      lastLevelParamRef.current = orchestrator.params.level;
    }

    if (orchestrator.levels.length > 0 && (!orchestrator.selectedLevel || levelParamChanged)) {
      let defaultLevel: UILevelConfig | undefined;

      if (orchestrator.params.level) {
        const levelNumber = parseInt(orchestrator.params.level, 10);
        defaultLevel = orchestrator.levels.find((l) => l.number === levelNumber && l.isUnlocked);
      }

      if (!defaultLevel) {
        const firstIncompleteLevel = orchestrator.levels.find(
          (level) => level.isUnlocked && !level.isCompleted
        );
        defaultLevel =
          firstIncompleteLevel ||
          orchestrator.levels.filter((l) => l.isUnlocked).pop() ||
          orchestrator.levels[0];
      }

      if (defaultLevel) {
        orchestrator.handleSelectLevel(defaultLevel);
        const gameLevel = getLevelByNumber(defaultLevel.number);
        setCurrentGameLevel(gameLevel || null);

        orchestrator.setMascotMessage(
          `Niveau ${defaultLevel.number} ! ${
            defaultLevel.difficulty === 'easy'
              ? 'Parfait pour commencer !'
              : defaultLevel.difficulty === 'hard'
                ? 'Un vrai défi !'
                : 'Bonne difficulté !'
          }`
        );
        setMascotEmotion('happy');
      }
    }
  }, [orchestrator.levels, orchestrator.selectedLevel, orchestrator.params.level, orchestrator]);

  // ============================================
  // EFFECTS - Feedback jeu
  // ============================================
  useEffect(() => {
    if (gameHook.status === 'success') {
      playCorrect();
      orchestrator.setMascotMessage(getRandomMessage(GEDEON_MESSAGES.success));
      setMascotEmotion('excited');
    } else if (gameHook.status === 'error') {
      playError();
      orchestrator.setMascotMessage(getRandomMessage(GEDEON_MESSAGES.error));
      setMascotEmotion('encouraging');
    }
  }, [gameHook.status, playCorrect, playError, orchestrator]);

  // ============================================
  // HANDLERS SPÉCIFIQUES
  // ============================================

  const handleSelectLevel = useCallback(
    (level: UILevelConfig) => {
      orchestrator.handleSelectLevel(level);
      const gameLevel = getLevelByNumber(level.number);
      setCurrentGameLevel(gameLevel || null);
      gameHook.resetMachine();

      orchestrator.setMascotMessage(
        `Niveau ${level.number} ! ${
          level.difficulty === 'easy'
            ? 'Parfait pour commencer !'
            : level.difficulty === 'hard'
              ? 'Un vrai défi !'
              : 'Bonne difficulté !'
        }`
      );
      setMascotEmotion('happy');
    },
    [orchestrator, gameHook]
  );

  const handleStartPlaying = useCallback(() => {
    if (!orchestrator.selectedLevel) return;
    orchestrator.handleStartPlaying();
    orchestrator.setMascotMessage(getRandomMessage(GEDEON_MESSAGES.levelStart));
    setMascotEmotion('excited');
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
    orchestrator.setMascotMessage(getRandomMessage(GEDEON_MESSAGES.hint));
    setMascotEmotion('thinking');
  }, [orchestrator]);

  const handleReset = useCallback(() => {
    gameHook.resetMachine();
    orchestrator.setMascotMessage('On recommence ! Observe bien la machine...');
    setMascotEmotion('neutral');
  }, [gameHook, orchestrator]);

  const handleHint = useCallback(() => {
    gameHook.requestHint();
    const hintDialogues = currentGameLevel?.hintDialogues || GEDEON_MESSAGES.hint;
    const hintIndex = Math.min(gameHook.currentHintLevel, hintDialogues.length - 1);
    orchestrator.setMascotMessage(hintDialogues[hintIndex]);
    setMascotEmotion('thinking');
  }, [gameHook, currentGameLevel, orchestrator]);

  const handlePlaceElement = useCallback(
    (elementId: string, position: GridPosition) => {
      if (!orchestrator.isPlaying) {
        orchestrator.transitionToPlayMode();
      }

      const success = gameHook.placeElement(elementId, position);
      if (success) {
        playPlace();
        orchestrator.setMascotMessage(getRandomMessage(GEDEON_MESSAGES.placementOk));
        setMascotEmotion('happy');
      }
    },
    [orchestrator, gameHook, playPlace]
  );

  const handleRemoveElement = useCallback(
    (placedId: string) => {
      gameHook.removeElement(placedId);
    },
    [gameHook]
  );

  const handleSelectSlot = useCallback(
    (position: GridPosition | null) => {
      if (position) playSelect();
      gameHook.selectSlot(position);
    },
    [gameHook, playSelect]
  );

  const handleRunSimulation = useCallback(() => {
    orchestrator.setMascotMessage(getRandomMessage(GEDEON_MESSAGES.simulating));
    setMascotEmotion('excited');
    gameHook.runSimulation();
  }, [gameHook, orchestrator]);

  const handleForceComplete = useCallback(() => {
    orchestrator.setIsVictory(true);
    orchestrator.router.push({
      pathname: '/(games)/14-fabrique-reactions/victory',
      params: {
        level: (orchestrator.selectedLevel?.number || 1).toString(),
        stars: '3',
        moves: '0',
        hintsUsed: '0',
        time: '0',
      },
    });
  }, [orchestrator]);

  // ============================================
  // RETURN
  // ============================================

  return {
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
    mascotMessage: orchestrator.mascotMessage,
    mascotEmotion,

    // Game state
    currentGameLevel,
    placedElements: gameHook.placedElements,
    connections: gameHook.connections,
    availableElements: gameHook.getAvailableElements(),
    selectedSlot: gameHook.selectedSlot,
    gameStatus: gameHook.status,

    // Progress data
    progressData: {
      current: orchestrator.selectedLevel?.number || 1,
      total: TOTAL_LEVELS,
      attempts: gameHook.attempts,
      hintsUsed: gameHook.hintsUsed,
      stars: gameHook.currentStars,
    },

    // Handlers
    handlePlaceElement,
    handleRemoveElement,
    handleSelectSlot,
    handleRunSimulation,
    handleReset,
    handleHint,
    handleBack,
    handleStartPlaying,
    handleParentPress: orchestrator.handleParentPress,
    handleHelpPress,
    handleForceComplete,

    // Hints
    hintsRemaining: 3 - gameHook.currentHintLevel,
    canPlayAudio: orchestrator.isPlaying,

    // Simulation
    isSimulating: gameHook.isSimulating,
  };
}

export default useFabriqueIntro;
