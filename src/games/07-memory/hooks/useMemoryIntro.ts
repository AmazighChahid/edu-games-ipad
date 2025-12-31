/**
 * useMemoryIntro - Hook orchestrateur pour le jeu Memory
 *
 * Encapsule toute la logique métier de l'écran d'introduction :
 * - Progression store (lecture/écriture)
 * - Génération des niveaux
 * - Messages mascotte
 * - Sons
 * - Animations de transition
 * - Navigation
 *
 * @see docs/GAME_ARCHITECTURE.md pour le pattern complet
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import {
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
  type TrainingConfig,
  type TrainingParam,
} from '../../../components/common';
import { useMemoryGame } from './useMemoryGame';
import { useMemorySound } from './useMemorySound';
import { useActiveProfile, useGameProgress, useStore } from '../../../store/useStore';
import { getAllLevels, getLevelByNumber, createTrainingLevel, getTrainingLevel } from '../data/levels';
import { Icons } from '../../../constants/icons';
import type { MemoryLevel, CardTheme } from '../types';
import type { MemoEmotionType } from '../components/mascot';

// ============================================================================
// TYPES
// ============================================================================

export interface UseMemoryIntroReturn {
  // Niveaux
  levels: LevelConfig[];
  selectedLevel: LevelConfig | null;
  currentMemoryLevel: MemoryLevel | null;
  handleSelectLevel: (level: LevelConfig) => void;

  // État jeu
  isPlaying: boolean;
  isTrainingMode: boolean;

  // Animations (styles animés)
  selectorStyle: ReturnType<typeof useAnimatedStyle>;
  progressPanelStyle: ReturnType<typeof useAnimatedStyle>;

  // Mascot
  mascotMessage: string;
  mascotEmotion: MemoEmotionType;

  // Game state (depuis useMemoryGame)
  gameState: ReturnType<typeof useMemoryGame>['gameState'];
  result: ReturnType<typeof useMemoryGame>['result'];
  isLoading: boolean;

  // Training
  trainingConfig: TrainingConfig;
  selectedTheme: CardTheme;

  // Progress data
  progressData: {
    totalLevels: number;
    completedLevels: number;
    currentLevel: number;
    totalStars: number;
  };

  // Handlers
  handleCardFlip: (cardId: string) => void;
  handleReset: () => void;
  handleHint: () => void;
  handleBack: () => void;
  handleStartPlaying: () => void;
  handleParentPress: () => void;
  handleHelpPress: () => void;
  handleTrainingPress: () => void;
  handlePause: () => void;
  handleResume: () => void;

  // Hints
  hintsRemaining: number;

  // Parent drawer
  showParentDrawer: boolean;
  setShowParentDrawer: (show: boolean) => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const ANIMATION_CONFIG = {
  selectorSlideDuration: 400,
  selectorFadeDuration: 300,
  progressDelayDuration: 200,
  selectorSlideDistance: -150,
  springDamping: 15,
  springStiffness: 150,
};

// Messages de la mascotte Mémo
const MEMO_MESSAGES = {
  intro: `Salut ! Je suis Mémo l'Éléphant ! ${Icons.elephant} J'ai une mémoire d'éléphant... et toi ?`,
  levelSelect: (pairs: number) => `${pairs} paires à trouver ! Tu peux le faire ! ${Icons.muscle}`,
  training: `Mode entraînement ! Choisis ton thème préféré ! ${Icons.colors}`,
  hint: `Regarde bien les cartes avant de retourner ! ${Icons.eyes}`,
  victory: `Incroyable ! Tu as une super mémoire ! ${Icons.brain}`,
  start: `C'est parti ! Trouve les paires ! ${Icons.memoryPairs}`,
  back: `On recommence ? Choisis un niveau ! ${Icons.muscle}`,
  thinking: `Hmm... Souviens-toi bien où sont les cartes ! ${Icons.thinking}`,
};

// Options de thèmes pour l'entraînement
const THEME_OPTIONS: { id: CardTheme; name: string; icon: string }[] = [
  { id: 'animals', name: 'Animaux', icon: Icons.dog },
  { id: 'fruits', name: 'Fruits', icon: Icons.apple },
  { id: 'vehicles', name: 'Véhicules', icon: Icons.car },
  { id: 'nature', name: 'Nature', icon: Icons.flowerCherry },
  { id: 'space', name: 'Espace', icon: Icons.rocket },
  { id: 'emojis', name: 'Émojis', icon: Icons.celebration },
];

// ============================================================================
// HOOK
// ============================================================================

export function useMemoryIntro(): UseMemoryIntroReturn {
  const router = useRouter();
  const profile = useActiveProfile();

  // Store - progression
  const gameProgress = useGameProgress('memory');
  const initGameProgress = useStore((state) => state.initGameProgress);

  // Initialiser le progress si nécessaire
  useEffect(() => {
    initGameProgress('memory');
  }, [initGameProgress]);

  // État local
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>('animals');
  const [mascotMessage, setMascotMessage] = useState(MEMO_MESSAGES.intro);
  const [mascotEmotion, setMascotEmotion] = useState<MemoEmotionType>('neutral');
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [showParentDrawer, setShowParentDrawer] = useState(false);

  // Training values
  const [trainingValues, setTrainingValues] = useState<Record<string, string | number | boolean>>({
    theme: 'animals',
    pairs: '4',
  });

  // Extraire les IDs des niveaux complétés depuis le store
  const completedLevelIds = useMemo(() => {
    if (!gameProgress?.completedLevels) return [];
    return Object.keys(gameProgress.completedLevels).map(
      (levelId) => `memory_${levelId}`
    );
  }, [gameProgress?.completedLevels]);

  // Générer les niveaux basés sur l'âge de l'enfant
  const levels = useMemo(() => {
    return generateDefaultLevels('memory', profile?.birthDate, completedLevelIds);
  }, [profile?.birthDate, completedLevelIds]);

  // Niveau Memory actuel
  const currentMemoryLevel = useMemo((): MemoryLevel | null => {
    if (!selectedLevel) return null;
    return getLevelByNumber(selectedLevel.number) || null;
  }, [selectedLevel]);

  // Hook du jeu Memory
  const {
    gameState,
    result,
    isLoading,
    startGame,
    handleCardFlip: flipCard,
    pauseGame,
    resumeGame,
    restartLevel,
    requestHint,
  } = useMemoryGame();

  // Sons
  const { playFlip, playMatch, playMismatch, playVictory, playSelect, playStart } = useMemorySound();

  // Ref pour tracker l'initialisation
  const hasInitializedRef = useRef(false);

  // ============================================================================
  // ANIMATIONS
  // ============================================================================

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

  // ============================================================================
  // TRANSITIONS
  // ============================================================================

  const transitionToPlayMode = useCallback(() => {
    if (isPlaying) return;

    selectorY.value = withTiming(ANIMATION_CONFIG.selectorSlideDistance, {
      duration: ANIMATION_CONFIG.selectorSlideDuration,
      easing: Easing.out(Easing.quad),
    });
    selectorOpacity.value = withTiming(0, {
      duration: ANIMATION_CONFIG.selectorFadeDuration,
    });

    progressPanelOpacity.value = withDelay(
      ANIMATION_CONFIG.progressDelayDuration,
      withTiming(1, { duration: ANIMATION_CONFIG.selectorFadeDuration })
    );

    setTimeout(() => {
      setIsPlaying(true);
    }, 300);
  }, [isPlaying, selectorY, selectorOpacity, progressPanelOpacity]);

  const transitionToSelectionMode = useCallback(() => {
    selectorY.value = withSpring(0, {
      damping: ANIMATION_CONFIG.springDamping,
      stiffness: ANIMATION_CONFIG.springStiffness,
    });
    selectorOpacity.value = withTiming(1, {
      duration: ANIMATION_CONFIG.selectorFadeDuration,
    });

    progressPanelOpacity.value = withTiming(0, { duration: 200 });

    setIsPlaying(false);
  }, [selectorY, selectorOpacity, progressPanelOpacity]);

  // ============================================================================
  // EFFECTS - Sélection automatique niveau
  // ============================================================================

  useEffect(() => {
    if (levels.length > 0 && !selectedLevel && !hasInitializedRef.current) {
      hasInitializedRef.current = true;

      // Trouver le premier niveau débloqué non complété
      const firstIncompleteLevel = levels.find(
        (level) => level.isUnlocked && !level.isCompleted
      );

      const defaultLevel = firstIncompleteLevel ||
        levels.filter(l => l.isUnlocked).pop() ||
        levels[0];

      if (defaultLevel) {
        setSelectedLevel(defaultLevel);
        const memoryLevel = getLevelByNumber(defaultLevel.number);
        if (memoryLevel) {
          setMascotMessage(MEMO_MESSAGES.levelSelect(memoryLevel.pairCount));
          setMascotEmotion('happy');
        }
      }
    }
  }, [levels, selectedLevel]);

  // ============================================================================
  // EFFECTS - Feedback jeu
  // ============================================================================

  useEffect(() => {
    if (gameState?.phase === 'victory' && result) {
      playVictory();
      setMascotMessage(MEMO_MESSAGES.victory);
      setMascotEmotion('excited');

      // Navigation vers victoire après délai
      // TODO: Créer la page victory pour Memory
      const timer = setTimeout(() => {
        // Pour l'instant, retourner à la sélection de niveau
        transitionToSelectionMode();
        setMascotMessage(MEMO_MESSAGES.victory);
        setMascotEmotion('excited');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [gameState?.phase, result, playVictory, transitionToSelectionMode]);

  // ============================================================================
  // TRAINING CONFIG
  // ============================================================================

  const trainingParams: TrainingParam[] = useMemo(() => [
    {
      id: 'theme',
      label: 'Thème',
      type: 'select',
      options: THEME_OPTIONS.map(t => ({ value: t.id, label: `${t.icon} ${t.name}` })),
      defaultValue: 'animals',
    },
    {
      id: 'pairs',
      label: 'Paires',
      type: 'select',
      options: [
        { value: '4', label: '4 paires (Facile)' },
        { value: '6', label: '6 paires (Moyen)' },
        { value: '8', label: '8 paires (Difficile)' },
      ],
      defaultValue: '4',
    },
  ], []);

  const trainingConfig: TrainingConfig = useMemo(() => ({
    availableParams: trainingParams,
    currentValues: trainingValues,
    onParamChange: (paramId: string, value: string | number | boolean) => {
      setTrainingValues(prev => ({ ...prev, [paramId]: value }));
      if (paramId === 'theme') {
        setSelectedTheme(value as CardTheme);
      }
    },
  }), [trainingParams, trainingValues]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSelectLevel = useCallback((level: LevelConfig) => {
    playSelect();
    setSelectedLevel(level);
    const memoryLevel = getLevelByNumber(level.number);
    if (memoryLevel) {
      setMascotMessage(MEMO_MESSAGES.levelSelect(memoryLevel.pairCount));
      setMascotEmotion('happy');
    }
  }, [playSelect]);

  const handleStartPlaying = useCallback(() => {
    if (!selectedLevel) return;

    // En mode entraînement (niveau 0), créer un niveau personnalisé
    let levelToPlay: MemoryLevel | null = null;

    if (isTrainingMode || selectedLevel.number === 0) {
      const pairCount = parseInt(trainingValues.pairs as string, 10) || 4;
      levelToPlay = createTrainingLevel(selectedTheme, pairCount);
    } else {
      levelToPlay = currentMemoryLevel;
    }

    if (!levelToPlay) return;

    playStart();
    startGame(levelToPlay);
    transitionToPlayMode();
    setMascotMessage(MEMO_MESSAGES.start);
    setMascotEmotion('excited');
    setHintsRemaining(3);
  }, [selectedLevel, currentMemoryLevel, isTrainingMode, trainingValues, selectedTheme, startGame, transitionToPlayMode, playStart]);

  const handleBack = useCallback(() => {
    if (isPlaying) {
      if (gameState?.phase === 'playing') {
        Alert.alert(
          'Quitter le jeu ?',
          'Ta progression sera perdue.',
          [
            { text: 'Annuler', style: 'cancel' },
            {
              text: 'Quitter',
              style: 'destructive',
              onPress: () => {
                transitionToSelectionMode();
                setMascotMessage(MEMO_MESSAGES.back);
                setMascotEmotion('encouraging');
              },
            },
          ]
        );
      } else {
        transitionToSelectionMode();
        setMascotMessage(MEMO_MESSAGES.back);
        setMascotEmotion('encouraging');
      }
    } else {
      router.back();
    }
  }, [isPlaying, gameState, router, transitionToSelectionMode]);

  const handleParentPress = useCallback(() => {
    setShowParentDrawer(true);
  }, []);

  const handleHelpPress = useCallback(() => {
    setMascotMessage(MEMO_MESSAGES.hint);
    setMascotEmotion('thinking');
  }, []);

  const handleTrainingPress = useCallback(() => {
    setIsTrainingMode(!isTrainingMode);
    setMascotMessage(isTrainingMode ? MEMO_MESSAGES.intro : MEMO_MESSAGES.training);
    setMascotEmotion('thinking');
  }, [isTrainingMode]);

  const handleReset = useCallback(() => {
    setSelectedLevel(null);
    setMascotMessage(MEMO_MESSAGES.intro);
    setMascotEmotion('neutral');
  }, []);

  const handleHint = useCallback(() => {
    if (hintsRemaining > 0) {
      requestHint();
      setHintsRemaining(prev => prev - 1);
      setMascotMessage(MEMO_MESSAGES.thinking);
      setMascotEmotion('thinking');
    }
  }, [hintsRemaining, requestHint]);

  const handleCardFlip = useCallback((cardId: string) => {
    playFlip();
    flipCard(cardId);
  }, [playFlip, flipCard]);

  const handlePause = useCallback(() => {
    pauseGame();
  }, [pauseGame]);

  const handleResume = useCallback(() => {
    resumeGame();
  }, [resumeGame]);

  // ============================================================================
  // PROGRESS DATA
  // ============================================================================

  const progressData = useMemo(() => {
    const allLevels = getAllLevels();
    return {
      totalLevels: allLevels.length,
      completedLevels: completedLevelIds.length,
      currentLevel: selectedLevel?.number || 0,
      totalStars: 0, // TODO: calculer depuis le store
    };
  }, [completedLevelIds, selectedLevel]);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Niveaux
    levels,
    selectedLevel,
    currentMemoryLevel,
    handleSelectLevel,

    // État jeu
    isPlaying,
    isTrainingMode,

    // Animations
    selectorStyle,
    progressPanelStyle,

    // Mascot
    mascotMessage,
    mascotEmotion,

    // Game state
    gameState,
    result,
    isLoading,

    // Training
    trainingConfig,
    selectedTheme,

    // Progress data
    progressData,

    // Handlers
    handleCardFlip,
    handleReset,
    handleHint,
    handleBack,
    handleStartPlaying,
    handleParentPress,
    handleHelpPress,
    handleTrainingPress,
    handlePause,
    handleResume,

    // Hints
    hintsRemaining,

    // Parent drawer
    showParentDrawer,
    setShowParentDrawer,
  };
}

export default useMemoryIntro;
