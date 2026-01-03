/**
 * useChasseurIntro - Hook orchestrateur pour Chasseur de Papillons
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
import { useChasseurGame } from './useChasseurGame';
import { useChasseurSound } from './useChasseurSound';
import type { FluttyEmotion, Butterfly, GameRule } from '../types';

// ============================================
// TYPES
// ============================================

export interface UseChasseurIntroReturn {
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
  mascotEmotion: FluttyEmotion;

  // Game state
  gameState: ReturnType<typeof useChasseurGame>['gameState'];
  sessionState: ReturnType<typeof useChasseurGame>['sessionState'];
  currentRule: GameRule | null;
  butterflies: Butterfly[];

  // Progress data pour ProgressPanel
  progressData: {
    currentWave: number;
    totalWaves: number;
    targetsCaught: number;
    wrongCatches: number;
    streak: number;
    bestStreak: number;
    score: number;
    timeRemaining: number;
    accuracy: number;
  };

  // Handlers
  handleCatchButterfly: (butterflyId: string) => void;
  handleReset: () => void;
  handleHint: () => void;
  handleBack: () => void;
  handleStartPlaying: () => void;
  handleNextWave: () => void;
  handleParentPress: () => void;
  handleHelpPress: () => void;
  handleForceComplete: () => void;

  // Hints
  hintsRemaining: number;
  canPlayAudio: boolean;
}

// ============================================
// MESSAGES MASCOTTE
// ============================================

const FLUTTY_MESSAGES = {
  welcome: [
    'Coucou ! Prêt à chasser des papillons ? 🦋',
    'Les papillons volent ! Attrape les bons !',
    "Observe bien les couleurs avant d'attraper !",
  ],
  start: [
    "C'est parti ! Attrape les bons papillons !",
    'Regarde bien la consigne et chasse !',
    'Les papillons arrivent ! Concentre-toi !',
  ],
  success: [
    'Bravo ! Tu as attrapé le bon ! 🎉',
    'Super ! Continue comme ça ! ⭐',
    'Bien joué ! Tes yeux sont rapides ! 👁️',
  ],
  error: [
    "Oups ! Ce n'était pas le bon. Relis la consigne !",
    'Pas grave ! Observe mieux les couleurs.',
    "Ce n'était pas celui-là. Prends ton temps !",
  ],
  streak: ['Waouh ! Quelle série ! 🔥', 'Tu es en feu ! Continue ! ⚡', 'Incroyable concentration ! 🌟'],
  waveComplete: [
    'Vague terminée ! Prêt pour la suite ?',
    'Bien joué ! Nouvelle règle dans 3... 2... 1...',
    'Super ! Une autre vague arrive !',
  ],
  hint: 'Je te montre lesquels attraper ! ✨',
};

// Helper pour message aléatoire
function randomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

// ============================================
// HOOK
// ============================================

export function useChasseurIntro(): UseChasseurIntroReturn {
  // ============================================
  // ORCHESTRATOR (logique commune factorisée)
  // ============================================
  const orchestrator = useGameIntroOrchestrator({
    gameId: 'chasseur-papillons',
    mascotMessages: {
      welcome: FLUTTY_MESSAGES.welcome[0],
      startPlaying: randomMessage(FLUTTY_MESSAGES.start),
      backToSelection: 'On recommence ? Choisis un niveau !',
      help: "Lis bien la consigne en haut de l'écran !",
    },
  });

  // ============================================
  // LOCAL STATE (spécifique à Chasseur)
  // ============================================
  const [mascotEmotion, setMascotEmotion] = useState<FluttyEmotion>('neutral');

  // Hook du jeu
  const currentLevel = orchestrator.selectedLevel?.number || 1;
  const gameHook = useChasseurGame({
    initialLevel: currentLevel,
  });

  const {
    gameState,
    sessionState,
    accuracy,
    isWaveComplete,
    isLevelComplete,
    initLevel,
    startWave,
    catchButterfly,
    nextWave,
    requestHint,
    resetGame,
    hintsRemaining,
  } = gameHook;

  // Sons
  const { playCatch, playWrong, playMiss, playStreak, playWaveComplete, playVictory, startAmbient, stopAmbient } =
    useChasseurSound();

  // Ref pour tracker l'initialisation
  const hasInitializedRef = useRef(false);
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
        orchestrator.setMascotMessage(
          `Niveau ${defaultLevel.number} ! ${
            defaultLevel.difficulty === 'easy'
              ? "Parfait pour s'entraîner !"
              : defaultLevel.difficulty === 'hard'
                ? 'Un vrai défi de concentration !'
                : 'Bonne difficulté !'
          }`
        );
        setMascotEmotion('happy');
      }
    }
  }, [orchestrator.levels, orchestrator.selectedLevel, orchestrator.params.level, orchestrator]);

  // Initialiser le niveau au chargement
  useEffect(() => {
    if (orchestrator.selectedLevel && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      initLevel(orchestrator.selectedLevel.number);
    }
  }, [orchestrator.selectedLevel, initLevel]);

  // ============================================
  // EFFECTS - Feedback jeu
  // ============================================

  // Gestion des captures
  const lastTargetsCaughtRef = useRef(0);
  const lastWrongCatchesRef = useRef(0);
  const lastStreakRef = useRef(0);

  useEffect(() => {
    // Bonne capture
    if (gameState.targetsCaught > lastTargetsCaughtRef.current) {
      playCatch();
      orchestrator.setMascotMessage(randomMessage(FLUTTY_MESSAGES.success));
      setMascotEmotion('happy');

      // Streak bonus
      if (gameState.streak > 0 && gameState.streak % 3 === 0) {
        playStreak();
        orchestrator.setMascotMessage(randomMessage(FLUTTY_MESSAGES.streak));
        setMascotEmotion('excited');
      }
    }
    lastTargetsCaughtRef.current = gameState.targetsCaught;

    // Mauvaise capture
    if (gameState.wrongCatches > lastWrongCatchesRef.current) {
      playWrong();
      orchestrator.setMascotMessage(randomMessage(FLUTTY_MESSAGES.error));
      setMascotEmotion('encouraging');
    }
    lastWrongCatchesRef.current = gameState.wrongCatches;

    lastStreakRef.current = gameState.streak;
  }, [gameState.targetsCaught, gameState.wrongCatches, gameState.streak, playCatch, playWrong, playStreak, orchestrator]);

  // Fin de vague
  useEffect(() => {
    if (gameState.status === 'wave_complete') {
      playWaveComplete();
      orchestrator.setMascotMessage(randomMessage(FLUTTY_MESSAGES.waveComplete));
      setMascotEmotion('happy');
    }
  }, [gameState.status, playWaveComplete, orchestrator]);

  // Victoire
  useEffect(() => {
    if (gameState.status === 'victory') {
      playVictory();
      orchestrator.setIsVictory(true);
      stopAmbient();

      const totalTimeMs = Date.now() - sessionState.startTime.getTime();
      orchestrator.router.push({
        pathname: '/(games)/15-chasseur-papillons/victory',
        params: {
          score: gameState.score.toString(),
          targetsCaught: gameState.targetsCaught.toString(),
          wrongCatches: gameState.wrongCatches.toString(),
          bestStreak: gameState.bestStreak.toString(),
          accuracy: Math.round(accuracy * 100).toString(),
          totalTime: totalTimeMs.toString(),
          level: currentLevel.toString(),
          hintsUsed: gameState.hintsUsed.toString(),
        },
      });
    }
  }, [gameState.status, playVictory, stopAmbient, orchestrator, gameState, sessionState, accuracy, currentLevel]);

  // ============================================
  // HANDLERS SPÉCIFIQUES
  // ============================================

  const handleSelectLevel = useCallback(
    (level: LevelConfig) => {
      orchestrator.handleSelectLevel(level);
      orchestrator.setMascotMessage(
        `Niveau ${level.number} ! ${
          level.difficulty === 'easy'
            ? "Parfait pour s'entraîner !"
            : level.difficulty === 'hard'
              ? 'Un vrai défi de concentration !'
              : 'Bonne difficulté !'
        }`
      );
      setMascotEmotion('happy');
      initLevel(level.number);
    },
    [orchestrator, initLevel]
  );

  const handleStartPlaying = useCallback(() => {
    if (!orchestrator.selectedLevel) return;
    orchestrator.handleStartPlaying();
    startAmbient();
    startWave();
    orchestrator.setMascotMessage(randomMessage(FLUTTY_MESSAGES.start));
    setMascotEmotion('excited');
  }, [orchestrator, startAmbient, startWave]);

  const handleCatchButterfly = useCallback(
    (butterflyId: string) => {
      // Transition vers mode jeu si pas encore en train de jouer
      if (!orchestrator.isPlaying) {
        orchestrator.transitionToPlayMode();
        startAmbient();
        startWave();
      }
      catchButterfly(butterflyId);
    },
    [orchestrator, startAmbient, startWave, catchButterfly]
  );

  const handleNextWave = useCallback(() => {
    nextWave();
    startWave();
    orchestrator.setMascotMessage('Nouvelle vague ! Concentre-toi sur la nouvelle règle !');
    setMascotEmotion('neutral');
  }, [nextWave, startWave, orchestrator]);

  const handleBack = useCallback(() => {
    if (orchestrator.isPlaying) {
      orchestrator.transitionToSelectionMode();
      stopAmbient();
      orchestrator.setMascotMessage('On recommence ? Choisis un niveau !');
      setMascotEmotion('encouraging');
      orchestrator.setIsVictory(false);
    } else {
      orchestrator.router.replace('/');
    }
  }, [orchestrator, stopAmbient]);

  const handleHelpPress = useCallback(() => {
    orchestrator.setMascotMessage("Lis bien la consigne en haut de l'écran !");
    setMascotEmotion('thinking');
  }, [orchestrator]);

  const handleReset = useCallback(() => {
    resetGame();
    orchestrator.setMascotMessage('On recommence ! Prêt ?');
    setMascotEmotion('neutral');
  }, [resetGame, orchestrator]);

  const handleHint = useCallback(() => {
    requestHint();
    orchestrator.setMascotMessage(FLUTTY_MESSAGES.hint);
    setMascotEmotion('thinking');
  }, [requestHint, orchestrator]);

  const handleForceComplete = useCallback(() => {
    orchestrator.setIsVictory(true);
    stopAmbient();
    const totalTimeMs = Date.now() - sessionState.startTime.getTime();
    orchestrator.router.push({
      pathname: '/(games)/15-chasseur-papillons/victory',
      params: {
        score: '1000',
        targetsCaught: '30',
        wrongCatches: '0',
        bestStreak: '10',
        accuracy: '100',
        totalTime: totalTimeMs.toString(),
        level: currentLevel.toString(),
        hintsUsed: '0',
      },
    });
  }, [orchestrator, stopAmbient, sessionState.startTime, currentLevel]);

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
    currentRule: gameState.currentRule,
    butterflies: gameState.butterflies,

    // Progress data
    progressData: {
      currentWave: gameState.currentWave,
      totalWaves: gameState.level?.totalWaves || 0,
      targetsCaught: gameState.targetsCaught,
      wrongCatches: gameState.wrongCatches,
      streak: gameState.streak,
      bestStreak: gameState.bestStreak,
      score: gameState.score,
      timeRemaining: gameState.timeRemaining,
      accuracy,
    },

    // Handlers
    handleCatchButterfly,
    handleReset,
    handleHint,
    handleBack,
    handleStartPlaying,
    handleNextWave,
    handleParentPress: orchestrator.handleParentPress,
    handleHelpPress,
    handleForceComplete,

    // Hints
    hintsRemaining,
    canPlayAudio: orchestrator.isPlaying,
  };
}

export default useChasseurIntro;
