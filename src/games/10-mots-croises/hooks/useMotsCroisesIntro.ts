/**
 * useMotsCroisesIntro - Hook orchestrateur pour Mots Croisés
 *
 * Encapsule toute la logique métier de l'écran d'introduction :
 * - Progression store (lecture/écriture)
 * - Paramètres URL
 * - Génération des niveaux
 * - Messages mascotte (Lexie le Perroquet)
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
import { useMotsCroisesGame } from './useMotsCroisesGame';
import { useMotsCroisesSound } from './useMotsCroisesSound';
import { useActiveProfile, useGameProgress, useStore } from '../../../store/useStore';
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
  selectorStyle: ReturnType<typeof useAnimatedStyle>;
  progressPanelStyle: ReturnType<typeof useAnimatedStyle>;

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

const ANIMATION_CONFIG = {
  selectorSlideDuration: 400,
  selectorFadeDuration: 300,
  progressDelayDuration: 200,
  selectorSlideDistance: -150,
  springDamping: 15,
  springStiffness: 150,
};

// Messages de Lexie - style éloquent et littéraire
const LEXIE_MESSAGES = {
  welcome: [
    "Bienvenue, cher ami des mots ! Lexie est enchantée de te rencontrer !",
    "Ah, un amateur de vocabulaire ! Choisis ton niveau, je t'en prie !",
    "Les mots sont des trésors ! Lequel veux-tu découvrir aujourd'hui ?",
  ],
  levelSelect: {
    easy: "Excellent choix ! Les mots simples sont la base de toute belle prose !",
    medium: "Quelle audace ! Ces mots demandent réflexion et perspicacité !",
    hard: "Bravo ! Tu as l'étoffe d'un véritable lettré !",
  },
  start: [
    "À la découverte des mots ! Que l'aventure commence !",
    "Lis bien les définitions, cher ami, elles sont pleines d'indices !",
    "Chaque lettre est un pas vers la victoire !",
  ],
  hint: "Un petit coup de pouce ? Lexie te révèle une lettre !",
  wordFound: [
    "Magnifique ! Tu as trouvé un mot !",
    "Bravo ! Quelle éloquence !",
    "Splendide ! Continue ainsi !",
  ],
  error: [
    "Hmm, ce n'est pas tout à fait ça... Réessaie !",
    "Pas d'inquiétude, les erreurs nous font grandir !",
    "Presque ! Réfléchis encore un peu...",
  ],
  victory: "Extraordinaire ! Tu as complété cette grille avec brio !",
};

// ============================================
// HOOK
// ============================================

export function useMotsCroisesIntro(): UseMotsCroisesIntroReturn {
  const router = useRouter();
  const params = useLocalSearchParams<{ level?: string }>();
  const profile = useActiveProfile();

  // Store - progression
  const gameProgress = useGameProgress('mots-croises');
  const initGameProgress = useStore((state) => state.initGameProgress);

  // Initialiser le progress si nécessaire
  useEffect(() => {
    initGameProgress('mots-croises');
  }, [initGameProgress]);

  // État local
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [mascotMessage, setMascotMessage] = useState(
    LEXIE_MESSAGES.welcome[Math.floor(Math.random() * LEXIE_MESSAGES.welcome.length)]
  );
  const [mascotEmotion, setMascotEmotion] = useState<LexieEmotionType>('neutral');
  const [showParentDrawer, setShowParentDrawer] = useState(false);

  // Extraire les IDs des niveaux complétés depuis le store
  const completedLevelIds = useMemo(() => {
    if (!gameProgress?.completedLevels) return [];
    return Object.keys(gameProgress.completedLevels).map(
      (levelId) => `mots-croises_${levelId}`
    );
  }, [gameProgress?.completedLevels]);

  // Générer les niveaux basés sur l'âge de l'enfant et les niveaux complétés
  const levels = useMemo(() => {
    return generateDefaultLevels('mots-croises', profile?.birthDate, completedLevelIds);
  }, [profile?.birthDate, completedLevelIds]);

  // Hook du jeu
  const gameHook = useMotsCroisesGame();
  const { gameState, completionPercent, result, startGame, handleRevealLetter, restartLevel } = gameHook;

  // Sons
  const { playSelect, playCorrect, playError, playHint, playVictory } = useMotsCroisesSound();

  // Ref pour tracker l'initialisation
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

          defaultLevel =
            firstIncompleteLevel ||
            levels.filter((l) => l.isUnlocked).pop() ||
            levels[0];
        }

        if (defaultLevel) {
          setSelectedLevel(defaultLevel);
          const diffMsg =
            defaultLevel.difficulty === 'easy'
              ? LEXIE_MESSAGES.levelSelect.easy
              : defaultLevel.difficulty === 'hard'
              ? LEXIE_MESSAGES.levelSelect.hard
              : LEXIE_MESSAGES.levelSelect.medium;
          setMascotMessage(diffMsg);
          setMascotEmotion('happy');
        }
      } catch {
        // En cas d'erreur, sélectionner le niveau 1
        const level1 = levels[0];
        if (level1) {
          setSelectedLevel(level1);
          setMascotMessage(LEXIE_MESSAGES.levelSelect.easy);
          setMascotEmotion('happy');
        }
      }
    }
  }, [levels, selectedLevel, params.level]);

  // ============================================
  // EFFECTS - Démarrer le jeu quand un niveau est sélectionné
  // ============================================

  useEffect(() => {
    if (selectedLevel && !gameState && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      // Obtenir la grille depuis les données de niveau
      const levelData = getLevel(`level_${selectedLevel.number}`);
      if (levelData) {
        startGame(levelData.grid);
      }
    }
  }, [selectedLevel, gameState, startGame]);

  // ============================================
  // EFFECTS - Détection victoire
  // ============================================

  useEffect(() => {
    if (gameState?.phase === 'victory' && !isVictory) {
      setIsVictory(true);
      playVictory();
      setMascotMessage(LEXIE_MESSAGES.victory);
      setMascotEmotion('excited');
      // La victoire est gérée par GameIntroTemplate via isVictory prop
    }
  }, [gameState, isVictory, playVictory]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleSelectLevel = useCallback(
    (level: LevelConfig) => {
      setSelectedLevel(level);
      hasInitializedRef.current = false;
      playSelect();

      const diffMsg =
        level.difficulty === 'easy'
          ? LEXIE_MESSAGES.levelSelect.easy
          : level.difficulty === 'hard'
          ? LEXIE_MESSAGES.levelSelect.hard
          : LEXIE_MESSAGES.levelSelect.medium;
      setMascotMessage(diffMsg);
      setMascotEmotion('happy');

      // Démarrer le jeu avec la nouvelle grille
      const levelData = getLevel(`level_${level.number}`);
      if (levelData) {
        startGame(levelData.grid);
      }
    },
    [playSelect, startGame]
  );

  const handleStartPlaying = useCallback(() => {
    if (!selectedLevel) return;
    transitionToPlayMode();
    const startMsg =
      LEXIE_MESSAGES.start[Math.floor(Math.random() * LEXIE_MESSAGES.start.length)];
    setMascotMessage(startMsg);
    setMascotEmotion('excited');
  }, [selectedLevel, transitionToPlayMode]);

  const handleBack = useCallback(() => {
    if (isPlaying) {
      transitionToSelectionMode();
      setMascotMessage(
        LEXIE_MESSAGES.welcome[Math.floor(Math.random() * LEXIE_MESSAGES.welcome.length)]
      );
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
    setMascotMessage("Lis attentivement les définitions, elles cachent des indices précieux !");
    setMascotEmotion('thinking');
  }, []);

  const handleReset = useCallback(() => {
    restartLevel();
    const startMsg =
      LEXIE_MESSAGES.start[Math.floor(Math.random() * LEXIE_MESSAGES.start.length)];
    setMascotMessage(startMsg);
    setMascotEmotion('neutral');
  }, [restartLevel]);

  const handleHint = useCallback(() => {
    handleRevealLetter();
    playHint();
    setMascotMessage(LEXIE_MESSAGES.hint);
    setMascotEmotion('thinking');
  }, [handleRevealLetter, playHint]);

  // DEV: Force complete level (for testing)
  const handleForceComplete = useCallback(() => {
    setIsVictory(true);
    playVictory();
    setMascotMessage(LEXIE_MESSAGES.victory);
    setMascotEmotion('excited');
    // La victoire est gérée par GameIntroTemplate via isVictory prop
  }, [playVictory]);

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const hintsRemaining = gameState
    ? (selectedLevel?.number ? motsCroisesLevels[selectedLevel.number - 1]?.hintsAvailable || 4 : 4) -
      gameState.hintsUsed
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
    gameHook,

    // Progress data
    progressData,

    // Handlers
    handleBack,
    handleStartPlaying,
    handleParentPress,
    handleHelpPress,
    handleReset,
    handleHint,
    handleForceComplete,

    // Hints
    hintsRemaining,
    canPlayAudio: isPlaying,
  };
}

export default useMotsCroisesIntro;
