/**
 * useMotsCroisesIntro - Hook orchestrateur pour Mots Croisés
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
import { useMotsCroisesGame } from './useMotsCroisesGame';
import { useMotsCroisesSound } from './useMotsCroisesSound';
import { motsCroisesLevels, getLevel } from '../data/levels';
import type { LexieEmotionType } from '../components/LexieMascot';

// ============================================
// TYPES
// ============================================

export interface UseMotsCroisesIntroReturn {
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
  mascotEmotion: LexieEmotionType;

  // Game state (depuis useMotsCroisesGame)
  gameHook: ReturnType<typeof useMotsCroisesGame>;

  // Progress data pour ProgressPanel
  progressData: {
    wordsFound: number;
    totalWords: number;
    hintsUsed: number;
    timeElapsed: number;
    completionPercent: number;
  };

  // Handlers
  handleBack: () => void;
  handleStartPlaying: () => void;
  handleParentPress: () => void;
  handleHelpPress: () => void;
  handleReset: () => void;
  handleHint: () => void;
  handleForceComplete: () => void;

  // Hints
  hintsRemaining: number;
  canPlayAudio: boolean;
}

// ============================================
// CONSTANTS
// ============================================

// Messages de Lexie - style éloquent et littéraire
const LEXIE_MESSAGES = {
  welcome: [
    'Bienvenue, cher ami des mots ! Lexie est enchantée de te rencontrer !',
    'Ah, un amateur de vocabulaire ! Choisis ton niveau, je t\'en prie !',
    "Les mots sont des trésors ! Lequel veux-tu découvrir aujourd'hui ?",
  ],
  levelSelect: {
    easy: 'Excellent choix ! Les mots simples sont la base de toute belle prose !',
    medium: 'Quelle audace ! Ces mots demandent réflexion et perspicacité !',
    hard: "Bravo ! Tu as l'étoffe d'un véritable lettré !",
  },
  start: [
    "À la découverte des mots ! Que l'aventure commence !",
    "Lis bien les définitions, cher ami, elles sont pleines d'indices !",
    'Chaque lettre est un pas vers la victoire !',
  ],
  hint: 'Un petit coup de pouce ? Lexie te révèle une lettre !',
  wordFound: ['Magnifique ! Tu as trouvé un mot !', 'Bravo ! Quelle éloquence !', 'Splendide ! Continue ainsi !'],
  error: [
    "Hmm, ce n'est pas tout à fait ça... Réessaie !",
    "Pas d'inquiétude, les erreurs nous font grandir !",
    'Presque ! Réfléchis encore un peu...',
  ],
  victory: 'Extraordinaire ! Tu as complété cette grille avec brio !',
};

// Helper pour message aléatoire
function randomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

// ============================================
// HOOK
// ============================================

export function useMotsCroisesIntro(): UseMotsCroisesIntroReturn {
  // ============================================
  // ORCHESTRATOR (logique commune factorisée)
  // ============================================
  const orchestrator = useGameIntroOrchestrator({
    gameId: 'mots-croises',
    mascotMessages: {
      welcome: randomMessage(LEXIE_MESSAGES.welcome),
      startPlaying: randomMessage(LEXIE_MESSAGES.start),
      backToSelection: randomMessage(LEXIE_MESSAGES.welcome),
      help: 'Lis attentivement les définitions, elles cachent des indices précieux !',
    },
  });

  // ============================================
  // LOCAL STATE (spécifique à Mots Croisés)
  // ============================================
  const [mascotEmotion, setMascotEmotion] = useState<LexieEmotionType>('neutral');

  // Hook du jeu
  const gameHook = useMotsCroisesGame();
  const { gameState, completionPercent, result, startGame, handleRevealLetter, restartLevel } = gameHook;

  // Sons
  const { playSelect, playCorrect, playError, playHint, playVictory } = useMotsCroisesSound();

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
        const diffMsg =
          defaultLevel.difficulty === 'easy'
            ? LEXIE_MESSAGES.levelSelect.easy
            : defaultLevel.difficulty === 'hard'
              ? LEXIE_MESSAGES.levelSelect.hard
              : LEXIE_MESSAGES.levelSelect.medium;
        orchestrator.setMascotMessage(diffMsg);
        setMascotEmotion('happy');
      }
    }
  }, [orchestrator.levels, orchestrator.selectedLevel, orchestrator.params.level, orchestrator]);

  // ============================================
  // EFFECTS - Démarrer le jeu quand un niveau est sélectionné
  // ============================================
  useEffect(() => {
    if (orchestrator.selectedLevel && !gameState && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      // Obtenir la grille depuis les données de niveau
      const levelData = getLevel(`level_${orchestrator.selectedLevel.number}`);
      if (levelData) {
        startGame(levelData.grid);
      }
    }
  }, [orchestrator.selectedLevel, gameState, startGame]);

  // ============================================
  // EFFECTS - Détection victoire
  // ============================================
  useEffect(() => {
    if (gameState?.phase === 'victory' && !orchestrator.isVictory) {
      orchestrator.setIsVictory(true);
      playVictory();
      orchestrator.setMascotMessage(LEXIE_MESSAGES.victory);
      setMascotEmotion('excited');
    }
  }, [gameState, orchestrator, playVictory]);

  // ============================================
  // HANDLERS SPÉCIFIQUES
  // ============================================

  const handleSelectLevel = useCallback(
    (level: LevelConfig) => {
      orchestrator.handleSelectLevel(level);
      hasInitializedRef.current = false;
      playSelect();

      const diffMsg =
        level.difficulty === 'easy'
          ? LEXIE_MESSAGES.levelSelect.easy
          : level.difficulty === 'hard'
            ? LEXIE_MESSAGES.levelSelect.hard
            : LEXIE_MESSAGES.levelSelect.medium;
      orchestrator.setMascotMessage(diffMsg);
      setMascotEmotion('happy');

      // Démarrer le jeu avec la nouvelle grille
      const levelData = getLevel(`level_${level.number}`);
      if (levelData) {
        startGame(levelData.grid);
      }
    },
    [orchestrator, playSelect, startGame]
  );

  const handleStartPlaying = useCallback(() => {
    if (!orchestrator.selectedLevel) return;
    orchestrator.handleStartPlaying();
    orchestrator.setMascotMessage(randomMessage(LEXIE_MESSAGES.start));
    setMascotEmotion('excited');
  }, [orchestrator]);

  const handleBack = useCallback(() => {
    if (orchestrator.isPlaying) {
      orchestrator.transitionToSelectionMode();
      orchestrator.setMascotMessage(randomMessage(LEXIE_MESSAGES.welcome));
      setMascotEmotion('encouraging');
      orchestrator.setIsVictory(false);
    } else {
      orchestrator.router.replace('/');
    }
  }, [orchestrator]);

  const handleHelpPress = useCallback(() => {
    orchestrator.setMascotMessage('Lis attentivement les définitions, elles cachent des indices précieux !');
    setMascotEmotion('thinking');
  }, [orchestrator]);

  const handleReset = useCallback(() => {
    restartLevel();
    orchestrator.setMascotMessage(randomMessage(LEXIE_MESSAGES.start));
    setMascotEmotion('neutral');
  }, [restartLevel, orchestrator]);

  const handleHint = useCallback(() => {
    handleRevealLetter();
    playHint();
    orchestrator.setMascotMessage(LEXIE_MESSAGES.hint);
    setMascotEmotion('thinking');
  }, [handleRevealLetter, playHint, orchestrator]);

  // DEV: Force complete level (for testing)
  const handleForceComplete = useCallback(() => {
    orchestrator.setIsVictory(true);
    playVictory();
    orchestrator.setMascotMessage(LEXIE_MESSAGES.victory);
    setMascotEmotion('excited');
  }, [orchestrator, playVictory]);

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const hintsRemaining = gameState
    ? (orchestrator.selectedLevel?.number
        ? motsCroisesLevels[orchestrator.selectedLevel.number - 1]?.hintsAvailable || 4
        : 4) - gameState.hintsUsed
    : 4;

  const progressData = useMemo(
    () => ({
      wordsFound: gameState?.completedWordIds.length || 0,
      totalWords: gameState?.words.length || 0,
      hintsUsed: gameState?.hintsUsed || 0,
      timeElapsed: gameState?.timeElapsed || 0,
      completionPercent,
    }),
    [gameState, completionPercent]
  );

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
    gameHook,

    // Progress data
    progressData,

    // Handlers
    handleBack,
    handleStartPlaying,
    handleParentPress: orchestrator.handleParentPress,
    handleHelpPress,
    handleReset,
    handleHint,
    handleForceComplete,

    // Hints
    hintsRemaining,
    canPlayAudio: orchestrator.isPlaying,
  };
}

export default useMotsCroisesIntro;
