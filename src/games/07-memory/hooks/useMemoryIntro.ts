/**
 * useMemoryIntro - Hook orchestrateur pour le jeu Memory
 *
 * VERSION MIGRÉE (Janvier 2026)
 * Utilise useGameIntroOrchestrator pour la logique commune.
 * Ce fichier ne contient plus que la logique spécifique au jeu.
 *
 * @see docs/GAME_ARCHITECTURE.md pour le pattern complet
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Alert } from 'react-native';

import { useGameIntroOrchestrator } from '../../../hooks';
import type { LevelConfig, TrainingConfig, TrainingParam } from '../../../components/common';
import { useMemoryGame } from './useMemoryGame';
import { useMemorySound } from './useMemorySound';
import { getAllLevels, getLevelByNumber, createTrainingLevel } from '../data/levels';
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
  selectorStyle: ReturnType<typeof useGameIntroOrchestrator>['selectorStyle'];
  progressPanelStyle: ReturnType<typeof useGameIntroOrchestrator>['progressPanelStyle'];

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
  // ============================================================================
  // ORCHESTRATOR (logique commune factorisée)
  // ============================================================================
  const orchestrator = useGameIntroOrchestrator({
    gameId: 'memory',
    mascotMessages: {
      welcome: MEMO_MESSAGES.intro,
      startPlaying: MEMO_MESSAGES.start,
      backToSelection: MEMO_MESSAGES.back,
      help: MEMO_MESSAGES.hint,
    },
  });

  // ============================================================================
  // LOCAL STATE (spécifique à Memory)
  // ============================================================================
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>('animals');
  const [mascotEmotion, setMascotEmotion] = useState<MemoEmotionType>('neutral');
  const [hintsRemaining, setHintsRemaining] = useState(3);

  // Training values
  const [trainingValues, setTrainingValues] = useState<Record<string, string | number | boolean>>({
    theme: 'animals',
    pairs: '4',
  });

  // Niveau Memory actuel
  const currentMemoryLevel = useMemo((): MemoryLevel | null => {
    if (!orchestrator.selectedLevel) return null;
    return getLevelByNumber(orchestrator.selectedLevel.number) || null;
  }, [orchestrator.selectedLevel]);

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
  const { playFlip, playMatch, playMismatch, playVictory, playSelect, playStart } =
    useMemorySound();

  // Ref pour tracker les paramètres URL
  const lastLevelParamRef = useRef<string | undefined>(undefined);

  // ============================================================================
  // EFFECTS - Sélection automatique niveau
  // ============================================================================
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
        const memoryLevel = getLevelByNumber(defaultLevel.number);
        if (memoryLevel) {
          orchestrator.setMascotMessage(MEMO_MESSAGES.levelSelect(memoryLevel.pairCount));
          setMascotEmotion('happy');
        }
      }
    }
  }, [orchestrator.levels, orchestrator.selectedLevel, orchestrator.params.level, orchestrator]);

  // ============================================================================
  // EFFECTS - Feedback jeu
  // ============================================================================
  useEffect(() => {
    if (gameState?.phase === 'victory' && result) {
      playVictory();
      orchestrator.setMascotMessage(MEMO_MESSAGES.victory);
      setMascotEmotion('excited');

      // Navigation vers victoire après délai
      const timer = setTimeout(() => {
        orchestrator.transitionToSelectionMode();
        orchestrator.setMascotMessage(MEMO_MESSAGES.victory);
        setMascotEmotion('excited');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [gameState?.phase, result, playVictory, orchestrator]);

  // ============================================================================
  // TRAINING CONFIG
  // ============================================================================
  const trainingParams: TrainingParam[] = useMemo(
    () => [
      {
        id: 'theme',
        label: 'Thème',
        type: 'select',
        options: THEME_OPTIONS.map((t) => ({ value: t.id, label: `${t.icon} ${t.name}` })),
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
    ],
    []
  );

  const trainingConfig: TrainingConfig = useMemo(
    () => ({
      availableParams: trainingParams,
      currentValues: trainingValues,
      onParamChange: (paramId: string, value: string | number | boolean) => {
        setTrainingValues((prev) => ({ ...prev, [paramId]: value }));
        if (paramId === 'theme') {
          setSelectedTheme(value as CardTheme);
        }
      },
    }),
    [trainingParams, trainingValues]
  );

  // ============================================================================
  // HANDLERS SPÉCIFIQUES
  // ============================================================================

  const handleSelectLevel = useCallback(
    (level: LevelConfig) => {
      playSelect();
      orchestrator.handleSelectLevel(level);
      const memoryLevel = getLevelByNumber(level.number);
      if (memoryLevel) {
        orchestrator.setMascotMessage(MEMO_MESSAGES.levelSelect(memoryLevel.pairCount));
        setMascotEmotion('happy');
      }
    },
    [orchestrator, playSelect]
  );

  const handleStartPlaying = useCallback(() => {
    if (!orchestrator.selectedLevel) return;

    // En mode entraînement (niveau 0), créer un niveau personnalisé
    let levelToPlay: MemoryLevel | null = null;

    if (isTrainingMode || orchestrator.selectedLevel.number === 0) {
      const pairCount = parseInt(trainingValues.pairs as string, 10) || 4;
      levelToPlay = createTrainingLevel(selectedTheme, pairCount);
    } else {
      levelToPlay = currentMemoryLevel;
    }

    if (!levelToPlay) return;

    playStart();
    startGame(levelToPlay);
    orchestrator.handleStartPlaying();
    orchestrator.setMascotMessage(MEMO_MESSAGES.start);
    setMascotEmotion('excited');
    setHintsRemaining(3);
  }, [
    orchestrator,
    currentMemoryLevel,
    isTrainingMode,
    trainingValues,
    selectedTheme,
    startGame,
    playStart,
  ]);

  const handleBack = useCallback(() => {
    if (orchestrator.isPlaying) {
      if (gameState?.phase === 'playing') {
        Alert.alert('Quitter le jeu ?', 'Ta progression sera perdue.', [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Quitter',
            style: 'destructive',
            onPress: () => {
              orchestrator.transitionToSelectionMode();
              orchestrator.setMascotMessage(MEMO_MESSAGES.back);
              setMascotEmotion('encouraging');
            },
          },
        ]);
      } else {
        orchestrator.transitionToSelectionMode();
        orchestrator.setMascotMessage(MEMO_MESSAGES.back);
        setMascotEmotion('encouraging');
      }
    } else {
      orchestrator.router.back();
    }
  }, [orchestrator, gameState]);

  const handleHelpPress = useCallback(() => {
    orchestrator.setMascotMessage(MEMO_MESSAGES.hint);
    setMascotEmotion('thinking');
  }, [orchestrator]);

  const handleTrainingPress = useCallback(() => {
    setIsTrainingMode(!isTrainingMode);
    orchestrator.setMascotMessage(isTrainingMode ? MEMO_MESSAGES.intro : MEMO_MESSAGES.training);
    setMascotEmotion('thinking');
  }, [isTrainingMode, orchestrator]);

  const handleReset = useCallback(() => {
    orchestrator.handleSelectLevel(null as unknown as LevelConfig);
    orchestrator.setMascotMessage(MEMO_MESSAGES.intro);
    setMascotEmotion('neutral');
  }, [orchestrator]);

  const handleHint = useCallback(() => {
    if (hintsRemaining > 0) {
      requestHint();
      setHintsRemaining((prev) => prev - 1);
      orchestrator.setMascotMessage(MEMO_MESSAGES.thinking);
      setMascotEmotion('thinking');
    }
  }, [hintsRemaining, requestHint, orchestrator]);

  const handleCardFlip = useCallback(
    (cardId: string) => {
      playFlip();
      flipCard(cardId);
    },
    [playFlip, flipCard]
  );

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
      completedLevels: orchestrator.completedLevelIds.length,
      currentLevel: orchestrator.selectedLevel?.number || 0,
      totalStars: 0, // TODO: calculer depuis le store
    };
  }, [orchestrator.completedLevelIds, orchestrator.selectedLevel]);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Depuis orchestrator
    levels: orchestrator.levels,
    selectedLevel: orchestrator.selectedLevel,
    currentMemoryLevel,
    handleSelectLevel,

    // État jeu
    isPlaying: orchestrator.isPlaying,
    isTrainingMode,

    // Animations
    selectorStyle: orchestrator.selectorStyle,
    progressPanelStyle: orchestrator.progressPanelStyle,

    // Mascot
    mascotMessage: orchestrator.mascotMessage,
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
    handleParentPress: orchestrator.handleParentPress,
    handleHelpPress,
    handleTrainingPress,
    handlePause,
    handleResume,

    // Hints
    hintsRemaining,

    // Parent drawer
    showParentDrawer: orchestrator.showParentDrawer,
    setShowParentDrawer: orchestrator.setShowParentDrawer,
  };
}

export default useMemoryIntro;
