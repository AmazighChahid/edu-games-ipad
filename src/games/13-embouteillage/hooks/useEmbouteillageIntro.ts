/**
 * useEmbouteillageIntro - Hook orchestrateur pour Embouteillage
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
import { useEmbouteillageGame } from './useEmbouteillageGame';
import { useEmbouteillageSound } from './useEmbouteillageSound';
import { TRAFFIC_MESSAGES } from '../data/assistantScripts';
import type { Vehicle } from '../types';

// Re-export EmotionType for backward compatibility
export type { EmotionType } from '../../../hooks';

// ============================================
// TYPES
// ============================================

export interface UseEmbouteillageIntroReturn {
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

  // Mascot
  mascotMessage: string;
  mascotEmotion: EmotionType;

  // Game state (depuis useEmbouteillageGame)
  gameState: ReturnType<typeof useEmbouteillageGame>['gameState'];
  sessionState: ReturnType<typeof useEmbouteillageGame>['sessionState'];
  currentLevel: ReturnType<typeof useEmbouteillageGame>['currentLevel'];
  vehicles: Vehicle[];

  // Progress data pour ProgressPanel
  progressData: {
    current: number;
    total: number;
    moves: number;
    minMoves: number;
    hintsUsed: number;
  };

  // Handlers
  handleMoveVehicle: (vehicleId: string, direction: 'up' | 'down' | 'left' | 'right', distance?: number) => boolean;
  handleSelectVehicle: (vehicle: Vehicle | null) => void;
  handleUndo: () => void;
  handleReset: () => void;
  handleHint: () => void;
  handleBack: () => void;
  handleStartPlaying: () => void;
  handleParentPress: () => void;
  handleHelpPress: () => void;
  handleForceComplete: () => void;

  // Validation
  canMove: ReturnType<typeof useEmbouteillageGame>['canMove'];
  getMaxMoveDistance: ReturnType<typeof useEmbouteillageGame>['getMaxMoveDistance'];

  // Hints
  hintsRemaining: number;
  canPlayAudio: boolean;
}

// ============================================
// CONSTANTS
// ============================================

const TOTAL_PUZZLES = 8;

// ============================================
// HOOK
// ============================================

export function useEmbouteillageIntro(): UseEmbouteillageIntroReturn {
  // ============================================
  // ORCHESTRATOR (logique commune factorisée)
  // ============================================
  const orchestrator = useGameIntroOrchestrator({
    gameId: 'embouteillage',
    mascotMessages: {
      welcome: 'Salut ! Je suis Caro le Castor. Libérons la voiture rouge !',
      startPlaying: "C'est parti ! Libère la voiture rouge !",
      backToSelection: 'On recommence ? Choisis un niveau !',
      help: 'Regarde quel véhicule bloque la voiture rouge...',
    },
  });

  // ============================================
  // LOCAL STATE (spécifique à Embouteillage)
  // ============================================
  const [mascotEmotion, setMascotEmotion] = useState<EmotionType>('neutral');

  // Hook du jeu
  const currentLevelNumber = orchestrator.selectedLevel?.number || 1;
  const gameHook = useEmbouteillageGame({
    initialLevel: currentLevelNumber,
  });

  const {
    gameState,
    sessionState,
    currentLevel,
    moveVehicle,
    selectVehicle,
    undoLastMove,
    resetPuzzle,
    loadLevel,
    requestHint,
    canMove,
    getMaxMoveDistance,
    hintsRemaining,
  } = gameHook;

  // Sons
  const { playSelect, playMove, playBlocked, playVictory } = useEmbouteillageSound();

  // Ref pour tracker le changement de niveau
  const lastLevelParamRef = useRef<string | undefined>(undefined);

  // ============================================
  // EFFECTS - Sélection automatique niveau
  // ============================================
  useEffect(() => {
    const levelParamChanged = orchestrator.params.level !== lastLevelParamRef.current;
    if (levelParamChanged) {
      lastLevelParamRef.current = orchestrator.params.level;
    }

    if (orchestrator.levels.length > 0 && (!orchestrator.selectedLevel || levelParamChanged)) {
      let defaultLevel: LevelConfig | undefined;

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
        loadLevel(defaultLevel.number);
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
  }, [orchestrator.levels, orchestrator.selectedLevel, orchestrator.params.level, orchestrator, loadLevel]);

  // ============================================
  // EFFECTS - Feedback jeu
  // ============================================
  useEffect(() => {
    if (gameState.status === 'victory') {
      playVictory();
      const messages = TRAFFIC_MESSAGES.success;
      orchestrator.setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
      setMascotEmotion('excited');
      orchestrator.setIsVictory(true);

      // Navigation vers victory après délai
      const timer = setTimeout(() => {
        const totalTimeMs = gameState.startTime ? Date.now() - gameState.startTime : 0;

        orchestrator.router.push({
          pathname: '/(games)/13-embouteillage/victory',
          params: {
            moves: gameState.moveCount.toString(),
            minMoves: currentLevel?.minMoves.toString() || '0',
            hintsUsed: gameState.hintsUsed.toString(),
            totalTime: totalTimeMs.toString(),
            level: currentLevelNumber.toString(),
          },
        });
      }, 1500);

      return () => clearTimeout(timer);
    } else if (gameState.status === 'error') {
      playBlocked();
      const messages = TRAFFIC_MESSAGES.error;
      orchestrator.setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
      setMascotEmotion('encouraging');
    }
  }, [gameState.status, playVictory, playBlocked, orchestrator, currentLevelNumber, currentLevel, gameState]);

  // ============================================
  // HANDLERS SPÉCIFIQUES
  // ============================================

  const handleSelectLevel = useCallback(
    (level: LevelConfig) => {
      orchestrator.handleSelectLevel(level);
      loadLevel(level.number);
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
    [orchestrator, loadLevel]
  );

  const handleStartPlaying = useCallback(() => {
    if (!orchestrator.selectedLevel) return;
    orchestrator.handleStartPlaying();
    orchestrator.setMascotMessage("C'est parti ! Libère la voiture rouge !");
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
    orchestrator.setMascotMessage('Regarde quel véhicule bloque la voiture rouge...');
    setMascotEmotion('thinking');
  }, [orchestrator]);

  const handleReset = useCallback(() => {
    resetPuzzle();
    orchestrator.setMascotMessage('On recommence ! Observe bien le parking...');
    setMascotEmotion('neutral');
  }, [resetPuzzle, orchestrator]);

  const handleUndo = useCallback(() => {
    undoLastMove();
    orchestrator.setMascotMessage('Coup annulé !');
    setMascotEmotion('neutral');
  }, [undoLastMove, orchestrator]);

  const handleHint = useCallback(() => {
    requestHint();
    orchestrator.setMascotMessage(TRAFFIC_MESSAGES.hint1);
    setMascotEmotion('thinking');
  }, [requestHint, orchestrator]);

  const handleMoveVehicle = useCallback(
    (vehicleId: string, direction: 'up' | 'down' | 'left' | 'right', distance?: number) => {
      if (!orchestrator.isPlaying) {
        orchestrator.transitionToPlayMode();
      }
      playMove();
      const success = moveVehicle(vehicleId, direction, distance);
      if (success) {
        orchestrator.setMascotMessage('Bien joué !');
        setMascotEmotion('happy');
      }
      return success;
    },
    [orchestrator, playMove, moveVehicle]
  );

  const handleSelectVehicle = useCallback(
    (vehicle: Vehicle | null) => {
      if (vehicle) {
        playSelect();
        orchestrator.setMascotMessage(`${vehicle.isTarget ? 'Voiture rouge' : 'Véhicule'} sélectionné !`);
      }
      selectVehicle(vehicle);
    },
    [selectVehicle, playSelect, orchestrator]
  );

  const handleForceComplete = useCallback(() => {
    orchestrator.setIsVictory(true);
    const totalTimeMs = gameState.startTime ? Date.now() - gameState.startTime : 0;

    orchestrator.router.push({
      pathname: '/(games)/13-embouteillage/victory',
      params: {
        moves: '1',
        minMoves: currentLevel?.minMoves.toString() || '1',
        hintsUsed: '0',
        totalTime: totalTimeMs.toString(),
        level: currentLevelNumber.toString(),
      },
    });
  }, [orchestrator, gameState.startTime, currentLevel, currentLevelNumber]);

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
    gameState,
    sessionState,
    currentLevel,
    vehicles: gameState.vehicles,

    // Progress data
    progressData: {
      current: sessionState.puzzlesCompleted,
      total: TOTAL_PUZZLES,
      moves: gameState.moveCount,
      minMoves: currentLevel?.minMoves || 0,
      hintsUsed: gameState.hintsUsed,
    },

    // Handlers
    handleMoveVehicle,
    handleSelectVehicle,
    handleUndo,
    handleReset,
    handleHint,
    handleBack,
    handleStartPlaying,
    handleParentPress: orchestrator.handleParentPress,
    handleHelpPress,
    handleForceComplete,

    // Validation
    canMove,
    getMaxMoveDistance,

    // Hints
    hintsRemaining,
    canPlayAudio: orchestrator.isPlaying,
  };
}

export default useEmbouteillageIntro;
