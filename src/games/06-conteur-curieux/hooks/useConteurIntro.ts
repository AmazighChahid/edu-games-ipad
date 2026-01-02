/**
 * useConteurIntro - Hook orchestrateur pour Conteur Curieux
 *
 * Encapsule toute la logique métier de l'écran d'introduction :
 * - Progression store (lecture/écriture)
 * - Paramètres URL
 * - Génération des niveaux
 * - Messages mascotte
 * - Sons
 * - Animations de transition
 * - Navigation
 *
 * @see docs/GAME_ARCHITECTURE.md pour le pattern complet
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
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
import { useConteurGame } from './useConteurGame';
import { useConteurSound } from './useConteurSound';
import { useActiveProfile, useGameProgress, useStore } from '../../../store/useStore';
import { CONTEUR_LEVELS } from '../data/levels';

// ============================================
// TYPES
// ============================================

export type EmotionType = 'neutral' | 'happy' | 'thinking' | 'excited' | 'encouraging';

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
  selectorStyle: ReturnType<typeof useAnimatedStyle>;
  progressPanelStyle: ReturnType<typeof useAnimatedStyle>;

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

const ANIMATION_CONFIG = {
  selectorSlideDuration: 400,
  selectorFadeDuration: 300,
  progressDelayDuration: 200,
  selectorSlideDistance: -150,
  springDamping: 15,
  springStiffness: 150,
};

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

// ============================================
// HOOK
// ============================================

export function useConteurIntro(): UseConteurIntroReturn {
  const router = useRouter();
  const params = useLocalSearchParams<{ level?: string }>();
  const profile = useActiveProfile();

  // Store - progression
  const gameProgress = useGameProgress('conteur-curieux');
  const initGameProgress = useStore((state) => state.initGameProgress);

  // Initialiser le progress si nécessaire
  useEffect(() => {
    initGameProgress('conteur-curieux');
  }, [initGameProgress]);

  // État local
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [mascotMessage, setMascotMessage] = useState(MASCOT_MESSAGES.welcome);
  const [mascotEmotion, setMascotEmotion] = useState<EmotionType>('neutral');
  const [showParentDrawer, setShowParentDrawer] = useState(false);

  // Extraire les IDs des niveaux complétés depuis le store
  const completedLevelIds = useMemo(() => {
    if (!gameProgress?.completedLevels) return [];
    return Object.keys(gameProgress.completedLevels).map(
      (levelId) => `conteur-curieux_${levelId}`
    );
  }, [gameProgress?.completedLevels]);

  // Générer les niveaux basés sur l'âge de l'enfant et les niveaux complétés
  const levels = useMemo(() => {
    return generateDefaultLevels('conteur-curieux', profile?.birthDate, completedLevelIds);
  }, [profile?.birthDate, completedLevelIds]);

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
  const { playSelect, playCorrect, playError, playPageFlip, playComplete, playHint } = useConteurSound();

  // Ref pour tracker l'initialisation et les paramètres URL
  const hasInitializedRef = useRef(false);
  const lastLevelParamRef = useRef<string | undefined>(undefined);

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
  }, [selectorY, selectorOpacity, progressPanelOpacity]);

  // ============================================
  // EFFECTS - Sélection automatique niveau
  // ============================================

  useEffect(() => {
    // Si le paramètre level a changé (depuis victory.tsx), forcer la mise à jour
    const levelParamChanged = params.level !== lastLevelParamRef.current;
    if (levelParamChanged) {
      lastLevelParamRef.current = params.level;
    }

    if (levels.length > 0 && (!selectedLevel || levelParamChanged)) {
      try {
        let defaultLevel: LevelConfig | undefined;

        // Si un niveau est passé en paramètre URL (depuis victory.tsx)
        if (params.level) {
          const levelNumber = parseInt(params.level, 10);
          defaultLevel = levels.find((l) => l.number === levelNumber && l.isUnlocked);
        }

        // Sinon, trouver le premier niveau débloqué mais non complété
        if (!defaultLevel) {
          const firstIncompleteLevel = levels.find(
            (level) => level.isUnlocked && !level.isCompleted
          );

          defaultLevel = firstIncompleteLevel ||
            levels.filter(l => l.isUnlocked).pop() ||
            levels[0];
        }

        if (defaultLevel) {
          setSelectedLevel(defaultLevel);
          const messages = MASCOT_MESSAGES.levelSelect;
          setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
          setMascotEmotion('happy');
        }
      } catch {
        // En cas d'erreur, sélectionner le niveau 1
        const level1 = levels[0];
        if (level1) {
          setSelectedLevel(level1);
          setMascotMessage(MASCOT_MESSAGES.welcome);
          setMascotEmotion('happy');
        }
      }
    }
  }, [levels, selectedLevel, params.level]);

  // Démarrer le jeu quand le niveau est sélectionné (première fois)
  useEffect(() => {
    if (selectedLevel && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      // Trouver le niveau Conteur correspondant
      const conteurLevel = CONTEUR_LEVELS.find(l => l.id === `level-${selectedLevel.number}`);
      if (conteurLevel) {
        startGame(conteurLevel);
      }
    }
  }, [selectedLevel, startGame]);

  // ============================================
  // EFFECTS - Feedback jeu
  // ============================================

  useEffect(() => {
    if (gameState?.phase === 'results' && result) {
      playComplete();
      setMascotMessage(MASCOT_MESSAGES.complete);
      setMascotEmotion('excited');
      setIsVictory(true);

      // Navigation vers victory
      const timer = setTimeout(() => {
        router.push({
          pathname: '/(games)/06-conteur-curieux/victory',
          params: {
            level: selectedLevel?.number.toString() || '1',
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
  }, [gameState?.phase, result, playComplete, router, selectedLevel]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleSelectLevel = useCallback((level: LevelConfig) => {
    setSelectedLevel(level);
    const messages = MASCOT_MESSAGES.levelSelect;
    setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
    setMascotEmotion('happy');

    // Démarrer le jeu avec le nouveau niveau
    const conteurLevel = CONTEUR_LEVELS.find(l => l.id === `level-${level.number}`);
    if (conteurLevel) {
      startGame(conteurLevel);
    }
  }, [startGame]);

  const handleStartPlaying = useCallback(() => {
    if (!selectedLevel) return;
    transitionToPlayMode();
    const messages = MASCOT_MESSAGES.reading;
    setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
    setMascotEmotion('excited');
  }, [selectedLevel, transitionToPlayMode]);

  const handleBack = useCallback(() => {
    if (isPlaying) {
      transitionToSelectionMode();
      setMascotMessage(MASCOT_MESSAGES.welcome);
      setMascotEmotion('encouraging');
    } else {
      // Retour à l'accueil depuis la sélection des niveaux
      router.replace('/');
    }
  }, [isPlaying, router, transitionToSelectionMode]);

  const handleParentPress = useCallback(() => {
    setShowParentDrawer(true);
  }, []);

  const handleHelpPress = useCallback(() => {
    setMascotMessage("Prends ton temps et lis bien chaque phrase !");
    setMascotEmotion('thinking');
  }, []);

  const handleStartReading = useCallback(() => {
    gameStartReading();
    const messages = MASCOT_MESSAGES.reading;
    setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
    setMascotEmotion('thinking');
  }, [gameStartReading]);

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
    const messages = MASCOT_MESSAGES.questions;
    setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
    setMascotEmotion('neutral');
  }, [gameFinishReading]);

  const handleSelectOption = useCallback((optionId: string) => {
    playSelect();
    gameSelectOption(optionId);
  }, [gameSelectOption, playSelect]);

  const handleValidateAnswer = useCallback(() => {
    gameValidateAnswer();
    // Le feedback sonore sera géré après la validation
    // basé sur gameState.lastAnswerCorrect
  }, [gameValidateAnswer]);

  const handleRequestHint = useCallback(() => {
    playHint();
    gameRequestHint();
    setMascotMessage(MASCOT_MESSAGES.hint);
    setMascotEmotion('thinking');
  }, [gameRequestHint, playHint]);

  const handleRestartLevel = useCallback(() => {
    restartLevel();
    setIsVictory(false);
    setMascotMessage(MASCOT_MESSAGES.welcome);
    setMascotEmotion('neutral');
  }, [restartLevel]);

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

    // Parent drawer
    showParentDrawer,
    setShowParentDrawer,

    // Animations
    selectorStyle,
    progressPanelStyle,

    // Mascot
    mascotMessage,
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
      correctAnswers: gameState?.playerAnswers.filter(a => a.isCorrect).length ?? 0,
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
    handleParentPress,
    handleHelpPress,
    handleRestartLevel,
  };
}

export default useConteurIntro;
