/**
 * useLogixGridIntro - Hook orchestrateur pour Logix Grid
 *
 * Encapsule toute la logique métier de l'écran d'introduction :
 * - Progression store (lecture/écriture)
 * - Paramètres URL
 * - Génération des niveaux
 * - Messages mascotte Ada
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

import { generateDefaultLevels, type LevelConfig } from '../../../components/common';
import { useLogixGridGame } from './useLogixGridGame';
import { useLogixGridSound } from './useLogixGridSound';
import { useActiveProfile, useGameProgress, useStore } from '../../../store/useStore';
import { logixLevels, type LogixLevelConfig } from '../data/levels';
import type { AdaEmotionType } from '../components/AdaMascot';

// ============================================
// TYPES
// ============================================

export interface UseLogixGridIntroReturn {
  // Niveaux
  levels: LevelConfig[];
  selectedLevel: LevelConfig | null;
  selectedLogixLevel: LogixLevelConfig | null;
  handleSelectLevel: (level: LevelConfig) => void;

  // État jeu
  isPlaying: boolean;
  isVictory: boolean;

  // Animations (styles animés)
  selectorStyle: ReturnType<typeof useAnimatedStyle>;
  progressPanelStyle: ReturnType<typeof useAnimatedStyle>;

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
  getCellStateValue: ReturnType<typeof useLogixGridGame>['getCellStateValue'];

  // Hints
  hintsRemaining: number;
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
  const router = useRouter();
  const params = useLocalSearchParams<{ level?: string }>();
  const profile = useActiveProfile();

  // Store - progression
  const gameProgress = useGameProgress('logix-grid');
  const initGameProgress = useStore((state) => state.initGameProgress);

  // Initialiser le progress si nécessaire
  useEffect(() => {
    initGameProgress('logix-grid');
  }, [initGameProgress]);

  // État local
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [selectedLogixLevel, setSelectedLogixLevel] = useState<LogixLevelConfig | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [mascotMessage, setMascotMessage] = useState(randomMessage(ADA_MESSAGES.welcome));
  const [mascotEmotion, setMascotEmotion] = useState<AdaEmotionType>('happy');

  // Extraire les IDs des niveaux complétés depuis le store
  const completedLevelIds = useMemo(() => {
    if (!gameProgress?.completedLevels) return [];
    return Object.keys(gameProgress.completedLevels).map(
      (levelId) => `logix-grid_${levelId}`
    );
  }, [gameProgress?.completedLevels]);

  // Générer les niveaux basés sur l'âge de l'enfant et les niveaux complétés
  const levels = useMemo(() => {
    return generateDefaultLevels('logix-grid', profile?.birthDate, completedLevelIds);
  }, [profile?.birthDate, completedLevelIds]);

  // Hook du jeu
  const gameHook = useLogixGridGame();
  const {
    gameState,
    result,
    errors,
    isLoading,
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

  // Sons
  const { playSelect, playCorrect, playError, playHint, playVictory, playClue } = useLogixGridSound();

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

        // Si un niveau est passé en paramètre URL
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
          const logixLevel = logixLevels[defaultLevel.number - 1];
          setSelectedLogixLevel(logixLevel || null);

          const diffKey = defaultLevel.difficulty as keyof typeof ADA_MESSAGES.levelSelect;
          setMascotMessage(
            `Niveau ${defaultLevel.number} ! ${ADA_MESSAGES.levelSelect[diffKey] || ''}`
          );
          setMascotEmotion('happy');
        }
      } catch {
        // En cas d'erreur, sélectionner le niveau 1
        const level1 = levels[0];
        if (level1) {
          setSelectedLevel(level1);
          const logixLevel = logixLevels[0];
          setSelectedLogixLevel(logixLevel || null);
          setMascotMessage("Niveau 1 ! Parfait pour commencer !");
          setMascotEmotion('happy');
        }
      }
    }
  }, [levels, selectedLevel, params.level]);

  // ============================================
  // EFFECTS - Initialiser le jeu quand un niveau est sélectionné
  // ============================================

  useEffect(() => {
    if (selectedLogixLevel && !isPlaying) {
      // Initialiser le jeu pour afficher la grille en mode intro (sans timer)
      initGame(selectedLogixLevel.puzzle);
    }
  }, [selectedLogixLevel, isPlaying, initGame]);

  // ============================================
  // EFFECTS - Feedback jeu
  // ============================================

  // Détecter la victoire
  useEffect(() => {
    if (gameState?.phase === 'victory' && !isVictory) {
      setIsVictory(true);
      playVictory();
      setMascotMessage(randomMessage(ADA_MESSAGES.victory));
      setMascotEmotion('excited');
    }
  }, [gameState?.phase, isVictory, playVictory]);

  // Détecter les erreurs
  useEffect(() => {
    if (errors.length > 0) {
      playError();
      setMascotMessage(randomMessage(ADA_MESSAGES.error));
      setMascotEmotion('encouraging');
    }
  }, [errors.length, playError]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleSelectLevel = useCallback((level: LevelConfig) => {
    setSelectedLevel(level);
    const logixLevel = logixLevels[level.number - 1];
    setSelectedLogixLevel(logixLevel || null);

    playSelect();

    const diffKey = level.difficulty as keyof typeof ADA_MESSAGES.levelSelect;
    setMascotMessage(
      `Niveau ${level.number} ! ${ADA_MESSAGES.levelSelect[diffKey] || ''}`
    );
    setMascotEmotion('happy');
  }, [playSelect]);

  const handleStartPlaying = useCallback(() => {
    if (!selectedLogixLevel) return;

    transitionToPlayMode();
    startGame(selectedLogixLevel.puzzle);
    setMascotMessage(randomMessage(ADA_MESSAGES.start));
    setMascotEmotion('excited');
  }, [selectedLogixLevel, transitionToPlayMode, startGame]);

  const handleBack = useCallback(() => {
    if (isPlaying) {
      transitionToSelectionMode();
      setMascotMessage(randomMessage(ADA_MESSAGES.back));
      setMascotEmotion('neutral');
      setIsVictory(false);
    } else {
      // Retour à l'accueil depuis la sélection des niveaux
      router.replace('/');
    }
  }, [isPlaying, router, transitionToSelectionMode]);

  const handleReset = useCallback(() => {
    if (selectedLogixLevel) {
      restartLevel();
      setIsVictory(false);
      setMascotMessage(randomMessage(ADA_MESSAGES.start));
      setMascotEmotion('neutral');
    }
  }, [selectedLogixLevel, restartLevel]);

  const handleCellToggle = useCallback((rowItemId: string, colItemId: string) => {
    playSelect();
    cellToggle(rowItemId, colItemId);
  }, [playSelect, cellToggle]);

  const handleCellSelect = useCallback((rowItemId: string | null, colItemId: string | null) => {
    cellSelect(rowItemId, colItemId);
  }, [cellSelect]);

  const handleClueUse = useCallback((clueId: string) => {
    playClue();
    clueUse(clueId);
    setMascotMessage("Bon indice ! Réfléchis bien...");
    setMascotEmotion('thinking');
  }, [playClue, clueUse]);

  const handleHintRequest = useCallback(() => {
    playHint();
    hintRequest();
    setMascotMessage(randomMessage(ADA_MESSAGES.hint));
    setMascotEmotion('thinking');
  }, [playHint, hintRequest]);

  const handlePause = useCallback(() => {
    pauseGame();
    setMascotMessage("Pause ! Prends ton temps pour réfléchir...");
    setMascotEmotion('neutral');
  }, [pauseGame]);

  const handleResume = useCallback(() => {
    resumeGame();
    setMascotMessage("C'est reparti !");
    setMascotEmotion('happy');
  }, [resumeGame]);

  // ============================================
  // RETURN
  // ============================================

  return {
    // Niveaux
    levels,
    selectedLevel,
    selectedLogixLevel,
    handleSelectLevel,

    // État jeu
    isPlaying,
    isVictory,

    // Animations
    selectorStyle,
    progressPanelStyle,

    // Mascot
    mascotMessage,
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
    getCellStateValue,

    // Hints
    hintsRemaining: (gameState?.puzzle.hintsAvailable ?? 3) - (gameState?.hintsUsed ?? 0),
  };
}

export default useLogixGridIntro;
