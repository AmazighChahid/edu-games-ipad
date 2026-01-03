/**
 * useConteurIntro - Hook orchestrateur pour Conteur Curieux
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
import { useConteurGame } from './useConteurGame';
import { useConteurSound } from './useConteurSound';
import { CONTEUR_LEVELS } from '../data/levels';

// Re-export EmotionType for backward compatibility
export type { EmotionType } from '../../../hooks';

// ============================================
// TYPES
// ============================================

export interface UseConteurIntroReturn {
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

  // Game state (depuis useConteurGame)
  gameState: ReturnType<typeof useConteurGame>['gameState'];
  result: ReturnType<typeof useConteurGame>['result'];
  currentQuestion: ReturnType<typeof useConteurGame>['currentQuestion'];
  currentParagraphText: ReturnType<typeof useConteurGame>['currentParagraphText'];
  readingProgress: ReturnType<typeof useConteurGame>['readingProgress'];
  questionsProgress: ReturnType<typeof useConteurGame>['questionsProgress'];

  // Progress data pour ProgressPanel
  progressData: {
    current: number;
    total: number;
    questionsAnswered: number;
    questionsTotal: number;
    correctAnswers: number;
  };

  // Handlers
  handleStartReading: () => void;
  handleNextParagraph: () => void;
  handlePreviousParagraph: () => void;
  handleFinishReading: () => void;
  handleSelectOption: (optionId: string) => void;
  handleValidateAnswer: () => void;
  handleRequestHint: () => void;
  handleBack: () => void;
  handleStartPlaying: () => void;
  handleParentPress: () => void;
  handleHelpPress: () => void;
  handleRestartLevel: () => void;
}

// ============================================
// CONSTANTS
// ============================================

const MASCOT_MESSAGES = {
  welcome: "Bienvenue dans mon monde d'histoires ! Choisis une aventure !",
  levelSelect: [
    "Quelle histoire te ferait plaisir ?",
    "Prêt pour une nouvelle aventure ?",
    "Choisis une histoire qui te plaît !",
  ],
  reading: [
    "Prends ton temps pour bien lire...",
    "Chaque détail compte !",
    "Concentre-toi sur l'histoire...",
  ],
  questions: [
    "Maintenant, voyons ce que tu as retenu !",
    "Réfléchis bien avant de répondre...",
    "Tu te souviens de ce passage ?",
  ],
  correct: [
    "Bravo ! Tu as bien compris !",
    "Excellent ! Continue comme ça !",
    "Super ! Tu es un vrai conteur !",
  ],
  error: [
    "Pas tout à fait... Relis bien l'histoire !",
    "Hmm, réfléchis encore un peu...",
    "Ce n'est pas grave, essaie encore !",
  ],
  hint: "Voici un petit indice pour t'aider...",
  complete: "Félicitations ! Tu as terminé cette histoire !",
};

// Helper pour message aléatoire
function randomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

// ============================================
// HOOK
// ============================================

export function useConteurIntro(): UseConteurIntroReturn {
  // ============================================
  // ORCHESTRATOR (logique commune factorisée)
  // ============================================
  const orchestrator = useGameIntroOrchestrator({
    gameId: 'conteur-curieux',
    mascotMessages: {
      welcome: MASCOT_MESSAGES.welcome,
      startPlaying: randomMessage(MASCOT_MESSAGES.reading),
      backToSelection: MASCOT_MESSAGES.welcome,
      help: "Prends ton temps et lis bien chaque phrase !",
    },
  });

  // ============================================
  // LOCAL STATE (spécifique à Conteur Curieux)
  // ============================================
  const [mascotEmotion, setMascotEmotion] = useState<EmotionType>('neutral');

  // Hook du jeu
  const gameHook = useConteurGame();

  const {
    gameState,
    result,
    currentQuestion,
    currentParagraphText,
    readingProgress,
    questionsProgress,
    startGame,
    handleStartReading: gameStartReading,
    handleNextParagraph: gameNextParagraph,
    handlePreviousParagraph: gamePreviousParagraph,
    handleFinishReading: gameFinishReading,
    handleSelectOption: gameSelectOption,
    handleValidateAnswer: gameValidateAnswer,
    handleRequestHint: gameRequestHint,
    restartLevel,
  } = gameHook;

  // Sons
  const { playSelect, playCorrect, playError, playPageFlip, playComplete, playHint } =
    useConteurSound();

  // Ref pour tracker l'initialisation et les paramètres URL
  const hasInitializedRef = useRef(false);
  const lastLevelParamRef = useRef<string | undefined>(undefined);

  // ============================================
  // EFFECTS - Sélection automatique niveau
  // ============================================
  useEffect(() => {
    // Si le paramètre level a changé (depuis victory.tsx), forcer la mise à jour
    const levelParamChanged = orchestrator.params.level !== lastLevelParamRef.current;
    if (levelParamChanged) {
      lastLevelParamRef.current = orchestrator.params.level;
    }

    if (orchestrator.levels.length > 0 && (!orchestrator.selectedLevel || levelParamChanged)) {
      let defaultLevel: LevelConfig | undefined;

      // Si un niveau est passé en paramètre URL (depuis victory.tsx)
      if (orchestrator.params.level) {
        const levelNumber = parseInt(orchestrator.params.level, 10);
        defaultLevel = orchestrator.levels.find((l) => l.number === levelNumber && l.isUnlocked);
      }

      // Sinon, trouver le premier niveau débloqué mais non complété
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
        orchestrator.setMascotMessage(randomMessage(MASCOT_MESSAGES.levelSelect));
        setMascotEmotion('happy');
      }
    }
  }, [orchestrator.levels, orchestrator.selectedLevel, orchestrator.params.level, orchestrator]);

  // Démarrer le jeu quand le niveau est sélectionné (première fois)
  useEffect(() => {
    if (orchestrator.selectedLevel && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      // Trouver le niveau Conteur correspondant
      const conteurLevel = CONTEUR_LEVELS.find(
        (l) => l.id === `level-${orchestrator.selectedLevel!.number}`
      );
      if (conteurLevel) {
        startGame(conteurLevel);
      }
    }
  }, [orchestrator.selectedLevel, startGame]);

  // ============================================
  // EFFECTS - Feedback jeu
  // ============================================
  useEffect(() => {
    if (gameState?.phase === 'results' && result) {
      playComplete();
      orchestrator.setMascotMessage(MASCOT_MESSAGES.complete);
      setMascotEmotion('excited');
      orchestrator.setIsVictory(true);

      // Navigation vers victory
      const timer = setTimeout(() => {
        orchestrator.router.push({
          pathname: '/(games)/06-conteur-curieux/victory',
          params: {
            level: orchestrator.selectedLevel?.number.toString() || '1',
            score: result.scorePercent.toString(),
            correctAnswers: result.correctAnswers.toString(),
            totalQuestions: result.totalQuestions.toString(),
            readingTime: result.readingTimeSeconds.toString(),
            questionsTime: result.questionsTimeSeconds.toString(),
          },
        });
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [gameState?.phase, result, playComplete, orchestrator]);

  // ============================================
  // HANDLERS SPÉCIFIQUES
  // ============================================

  const handleSelectLevel = useCallback(
    (level: LevelConfig) => {
      orchestrator.handleSelectLevel(level);
      orchestrator.setMascotMessage(randomMessage(MASCOT_MESSAGES.levelSelect));
      setMascotEmotion('happy');

      // Démarrer le jeu avec le nouveau niveau
      const conteurLevel = CONTEUR_LEVELS.find((l) => l.id === `level-${level.number}`);
      if (conteurLevel) {
        startGame(conteurLevel);
      }
    },
    [orchestrator, startGame]
  );

  const handleStartPlaying = useCallback(() => {
    if (!orchestrator.selectedLevel) return;
    orchestrator.handleStartPlaying();
    orchestrator.setMascotMessage(randomMessage(MASCOT_MESSAGES.reading));
    setMascotEmotion('excited');
  }, [orchestrator]);

  const handleBack = useCallback(() => {
    if (orchestrator.isPlaying) {
      orchestrator.transitionToSelectionMode();
      orchestrator.setMascotMessage(MASCOT_MESSAGES.welcome);
      setMascotEmotion('encouraging');
      orchestrator.setIsVictory(false);
    } else {
      orchestrator.router.replace('/');
    }
  }, [orchestrator]);

  const handleHelpPress = useCallback(() => {
    orchestrator.setMascotMessage("Prends ton temps et lis bien chaque phrase !");
    setMascotEmotion('thinking');
  }, [orchestrator]);

  const handleStartReading = useCallback(() => {
    gameStartReading();
    orchestrator.setMascotMessage(randomMessage(MASCOT_MESSAGES.reading));
    setMascotEmotion('thinking');
  }, [gameStartReading, orchestrator]);

  const handleNextParagraph = useCallback(() => {
    playPageFlip();
    gameNextParagraph();
  }, [gameNextParagraph, playPageFlip]);

  const handlePreviousParagraph = useCallback(() => {
    playPageFlip();
    gamePreviousParagraph();
  }, [gamePreviousParagraph, playPageFlip]);

  const handleFinishReading = useCallback(() => {
    gameFinishReading();
    orchestrator.setMascotMessage(randomMessage(MASCOT_MESSAGES.questions));
    setMascotEmotion('neutral');
  }, [gameFinishReading, orchestrator]);

  const handleSelectOption = useCallback(
    (optionId: string) => {
      playSelect();
      gameSelectOption(optionId);
    },
    [gameSelectOption, playSelect]
  );

  const handleValidateAnswer = useCallback(() => {
    gameValidateAnswer();
    // Le feedback sonore sera géré après la validation
    // basé sur gameState.lastAnswerCorrect
  }, [gameValidateAnswer]);

  const handleRequestHint = useCallback(() => {
    playHint();
    gameRequestHint();
    orchestrator.setMascotMessage(MASCOT_MESSAGES.hint);
    setMascotEmotion('thinking');
  }, [gameRequestHint, playHint, orchestrator]);

  const handleRestartLevel = useCallback(() => {
    restartLevel();
    orchestrator.setIsVictory(false);
    orchestrator.setMascotMessage(MASCOT_MESSAGES.welcome);
    setMascotEmotion('neutral');
  }, [restartLevel, orchestrator]);

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
    result,
    currentQuestion,
    currentParagraphText,
    readingProgress,
    questionsProgress,

    // Progress data
    progressData: {
      current: gameState?.currentParagraph ?? 0,
      total: gameState?.level?.story?.paragraphs.length ?? 0,
      questionsAnswered: gameState?.playerAnswers.length ?? 0,
      questionsTotal: gameState?.level?.story?.questions.length ?? 0,
      correctAnswers: gameState?.playerAnswers.filter((a) => a.isCorrect).length ?? 0,
    },

    // Handlers
    handleStartReading,
    handleNextParagraph,
    handlePreviousParagraph,
    handleFinishReading,
    handleSelectOption,
    handleValidateAnswer,
    handleRequestHint,
    handleBack,
    handleStartPlaying,
    handleParentPress: orchestrator.handleParentPress,
    handleHelpPress,
    handleRestartLevel,
  };
}

export default useConteurIntro;
