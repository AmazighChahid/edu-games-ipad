/**
 * useLabyrintheIntro - Hook orchestrateur pour Labyrinthe Logique
 *
 * Encapsule toute la logique métier de l'écran d'introduction :
 * - Progression store (lecture/écriture)
 * - Paramètres URL
 * - Génération des niveaux
 * - Messages mascotte
 * - Animations de transition
 * - Navigation
 * - Configuration du labyrinthe
 *
 * @see docs/GAME_ARCHITECTURE.md pour le pattern complet
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useWindowDimensions } from 'react-native';
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
  type TrainingConfig,
  type TrainingParam,
} from '../../../components/common';
import { useMazeGenerator } from './useMazeGenerator';
import { useActiveProfile, useGameProgress, useStore } from '../../../store/useStore';
import { LEVELS } from '../data/levels';
import { Icons } from '../../../constants/icons';
import type {
  LevelConfig as MazeLevelConfig,
  MazeGrid,
  ThemeType,
  SessionStats,
} from '../types';

// ============================================
// TYPES
// ============================================

export type EmotionType = 'neutral' | 'happy' | 'thinking' | 'excited' | 'encouraging';

export interface UseLabyrintheIntroReturn {
  // Niveaux
  levels: LevelConfig[];
  selectedLevel: LevelConfig | null;
  handleSelectLevel: (level: LevelConfig) => void;
  completedLevels: Set<number>;

  // État jeu
  isPlaying: boolean;
  isTrainingMode: boolean;

  // Configuration labyrinthe
  currentMazeConfig: MazeLevelConfig | null;
  previewMaze: MazeGrid | null;
  selectedTheme: ThemeType;
  cellSize: number;

  // Mode entraînement
  trainingConfig: TrainingConfig;
  trainingValues: Record<string, string | number | boolean>;

  // Parent drawer
  showParentDrawer: boolean;
  setShowParentDrawer: (show: boolean) => void;

  // Animations (styles animés)
  selectorStyle: ReturnType<typeof useAnimatedStyle>;
  progressPanelStyle: ReturnType<typeof useAnimatedStyle>;

  // Mascot
  mascotMessage: string;
  mascotEmotion: EmotionType;

  // Handlers
  handleBack: () => void;
  handleStartPlaying: () => void;
  handleParentPress: () => void;
  handleHelpPress: () => void;
  handleTrainingPress: () => void;
  handleReset: () => void;
  handleHint: () => void;
  handleLevelComplete: (stats: SessionStats) => void;
  setIsPlaying: (playing: boolean) => void;
  setMascotMessage: (message: string) => void;

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

// Mapping niveau -> configuration labyrinthe
const LEVEL_TO_MAZE_CONFIG: Record<number, Partial<MazeLevelConfig>> = {
  1: { width: 5, height: 5, hasKeys: false, hasGems: false, difficulty: 1 },
  2: { width: 5, height: 5, hasKeys: false, hasGems: true, gemCount: 1, difficulty: 1 },
  3: { width: 5, height: 5, hasKeys: false, hasGems: true, gemCount: 2, difficulty: 1 },
  4: { width: 5, height: 5, hasKeys: true, keyCount: 1, hasGems: true, gemCount: 2, difficulty: 2 },
  5: { width: 7, height: 7, hasKeys: false, hasGems: true, gemCount: 3, difficulty: 2 },
  6: { width: 7, height: 7, hasKeys: true, keyCount: 1, hasGems: true, gemCount: 3, difficulty: 2 },
  7: { width: 7, height: 7, hasKeys: true, keyCount: 2, hasGems: true, gemCount: 4, difficulty: 3 },
  8: { width: 9, height: 9, hasKeys: true, keyCount: 1, hasGems: true, gemCount: 4, difficulty: 3 },
  9: { width: 9, height: 9, hasKeys: true, keyCount: 2, hasGems: true, gemCount: 5, difficulty: 4 },
  10: { width: 9, height: 9, hasKeys: true, keyCount: 3, hasGems: true, gemCount: 6, difficulty: 5 },
};

const MASCOT_MESSAGES = {
  welcome: `${Icons.squirrel} Coucou ! Je suis Noisette ! Aide-moi à trouver la sortie du labyrinthe !`,
  selectLevel: (level: number, sizeText: string, hasKeys: boolean) =>
    `Niveau ${level} ! Un labyrinthe ${sizeText} t'attend !${hasKeys ? ` Avec des clés à trouver ! ${Icons.key}` : ''}`,
  startPlaying: `C'est parti ! Guide-moi vers la sortie ! ${Icons.star}`,
  backToSelection: "On recommence ? Choisis un niveau !",
  trainingOn: "Mode entraînement ! Configure le labyrinthe comme tu veux !",
  trainingOff: "Retour aux niveaux normaux !",
  newMaze: "Nouveau labyrinthe ! Observe bien le chemin...",
  hint: `Regarde bien où sont les impasses ! Essaie de repérer le chemin avant de partir ! ${Icons.help}`,
  help: `Glisse ton doigt pour me déplacer ! Collecte les clés ${Icons.key} pour ouvrir les portes et trouve la sortie ${Icons.star} !`,
  nextLevel: `Bravo ! ${Icons.celebration} Prêt pour le niveau suivant ?`,
  allComplete: `Incroyable ! Tu as terminé tous les niveaux ! ${Icons.trophy}`,
  exitGame: "On réessaie ? Choisis un niveau !",
};

// ============================================
// HOOK
// ============================================

export function useLabyrintheIntro(): UseLabyrintheIntroReturn {
  const router = useRouter();
  const params = useLocalSearchParams<{ level?: string }>();
  const profile = useActiveProfile();
  const { width: screenWidth } = useWindowDimensions();
  const { generateMaze } = useMazeGenerator();

  // Store - progression
  const gameProgress = useGameProgress('labyrinthe');
  const initGameProgress = useStore((state) => state.initGameProgress);

  // Initialiser le progress si nécessaire
  useEffect(() => {
    initGameProgress('labyrinthe');
  }, [initGameProgress]);

  // ============================================
  // STATE
  // ============================================

  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('cozy');
  const [mascotMessage, setMascotMessage] = useState(MASCOT_MESSAGES.welcome);
  const [mascotEmotion, setMascotEmotion] = useState<EmotionType>('neutral');
  const [previewMaze, setPreviewMaze] = useState<MazeGrid | null>(null);
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
  const [showParentDrawer, setShowParentDrawer] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);

  // Training mode values
  const [trainingValues, setTrainingValues] = useState<Record<string, string | number | boolean>>({
    theme: 'cozy',
    size: 'small',
    hasKeys: false,
  });

  // ============================================
  // MEMOS
  // ============================================

  // Générer les niveaux basés sur l'âge de l'enfant
  const levels = useMemo(() => {
    return generateDefaultLevels('labyrinthe', profile?.birthDate, []);
  }, [profile?.birthDate]);

  // Configuration labyrinthe actuelle (basée sur le niveau sélectionné)
  const currentMazeConfig = useMemo((): MazeLevelConfig | null => {
    if (!selectedLevel) return null;

    const levelNum = selectedLevel.number;
    const mazeConfig = LEVEL_TO_MAZE_CONFIG[levelNum] || LEVEL_TO_MAZE_CONFIG[1];

    // Trouver le niveau existant le plus proche dans LEVELS
    const existingLevel = LEVELS.find((l) => l.id === levelNum) || LEVELS[0];

    return {
      ...existingLevel,
      ...mazeConfig,
      theme: selectedTheme,
    };
  }, [selectedLevel, selectedTheme]);

  // Taille des cellules pour le preview
  const cellSize = useMemo(() => {
    if (!currentMazeConfig) return 30;
    const maxGridWidth = screenWidth - 64; // padding
    return Math.floor(maxGridWidth / currentMazeConfig.width);
  }, [screenWidth, currentMazeConfig]);

  // Configuration entraînement
  const trainingParams: TrainingParam[] = useMemo(
    () => [
      {
        id: 'theme',
        label: 'Thème',
        type: 'select',
        options: [
          { value: 'cozy', label: `${Icons.squirrel} Bois Cozy` },
          { value: 'forest', label: `${Icons.tree} Forêt` },
          { value: 'temple', label: `${Icons.castle} Temple` },
          { value: 'space', label: `${Icons.rocket} Espace` },
        ],
        defaultValue: 'cozy',
      },
      {
        id: 'size',
        label: 'Taille',
        type: 'select',
        options: [
          { value: 'small', label: '5×5 (Petit)' },
          { value: 'medium', label: '7×7 (Moyen)' },
          { value: 'large', label: '9×9 (Grand)' },
        ],
        defaultValue: 'small',
      },
      {
        id: 'hasKeys',
        label: 'Clés & Portes',
        type: 'toggle',
        defaultValue: false,
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
          setSelectedTheme(value as ThemeType);
        }
      },
    }),
    [trainingParams, trainingValues]
  );

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

  // ============================================
  // EFFECTS
  // ============================================

  // Générer un labyrinthe de preview quand le niveau change
  useEffect(() => {
    if (currentMazeConfig && !isPlaying) {
      const maze = generateMaze(currentMazeConfig);
      setPreviewMaze(maze);
    }
  }, [currentMazeConfig, generateMaze, isPlaying]);

  // Sélection automatique du premier niveau débloqué
  useEffect(() => {
    if (levels.length > 0 && !selectedLevel) {
      const levelFromParams = params.level ? parseInt(params.level, 10) : null;
      let defaultLevel: LevelConfig | undefined;

      if (levelFromParams) {
        defaultLevel = levels.find((l) => l.number === levelFromParams && l.isUnlocked);
      }

      if (!defaultLevel) {
        const firstIncompleteLevel = levels.find(
          (level) => level.isUnlocked && !level.isCompleted
        );
        defaultLevel =
          firstIncompleteLevel || levels.filter((l) => l.isUnlocked).pop() || levels[0];
      }

      if (defaultLevel) {
        setSelectedLevel(defaultLevel);
        const config = LEVEL_TO_MAZE_CONFIG[defaultLevel.number] || LEVEL_TO_MAZE_CONFIG[1];
        const sizeText = config.width === 5 ? 'petit' : config.width === 7 ? 'moyen' : 'grand';
        setMascotMessage(
          MASCOT_MESSAGES.selectLevel(defaultLevel.number, sizeText, config.hasKeys ?? false)
        );
        setMascotEmotion('happy');
      }
    }
  }, [levels, selectedLevel, params.level]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleSelectLevel = useCallback((level: LevelConfig) => {
    setSelectedLevel(level);
    const config = LEVEL_TO_MAZE_CONFIG[level.number] || LEVEL_TO_MAZE_CONFIG[1];
    const sizeText = config.width === 5 ? 'petit' : config.width === 7 ? 'moyen' : 'grand';
    setMascotMessage(MASCOT_MESSAGES.selectLevel(level.number, sizeText, config.hasKeys ?? false));
    setMascotEmotion('happy');
  }, []);

  const handleStartPlaying = useCallback(() => {
    if (!selectedLevel) return;
    setIsPlaying(true);
    setMascotMessage(MASCOT_MESSAGES.startPlaying);
    setMascotEmotion('excited');
  }, [selectedLevel]);

  const handleBack = useCallback(() => {
    if (isPlaying) {
      transitionToSelectionMode();
      setMascotMessage(MASCOT_MESSAGES.backToSelection);
      setMascotEmotion('encouraging');
    } else {
      router.back();
    }
  }, [isPlaying, router, transitionToSelectionMode]);

  const handleParentPress = useCallback(() => {
    setShowParentDrawer(true);
  }, []);

  const handleHelpPress = useCallback(() => {
    setMascotMessage(MASCOT_MESSAGES.help);
    setMascotEmotion('thinking');
  }, []);

  const handleTrainingPress = useCallback(() => {
    setIsTrainingMode((prev) => !prev);
    setMascotMessage(isTrainingMode ? MASCOT_MESSAGES.trainingOff : MASCOT_MESSAGES.trainingOn);
    setMascotEmotion('thinking');
  }, [isTrainingMode]);

  const handleReset = useCallback(() => {
    if (currentMazeConfig) {
      const maze = generateMaze(currentMazeConfig);
      setPreviewMaze(maze);
      setMascotMessage(MASCOT_MESSAGES.newMaze);
      setMascotEmotion('neutral');
    }
  }, [currentMazeConfig, generateMaze]);

  const handleHint = useCallback(() => {
    setMascotMessage(MASCOT_MESSAGES.hint);
    setMascotEmotion('thinking');
    setHintsRemaining((prev) => Math.max(0, prev - 1));
  }, []);

  const handleLevelComplete = useCallback(
    (stats: SessionStats) => {
      setCompletedLevels((prev) => new Set(prev).add(stats.levelId));

      // Passer au niveau suivant ou retour à la sélection
      const currentIndex = levels.findIndex((l) => l.number === selectedLevel?.number);
      if (currentIndex < levels.length - 1) {
        setSelectedLevel(levels[currentIndex + 1]);
        setMascotMessage(MASCOT_MESSAGES.nextLevel);
        setMascotEmotion('excited');
      } else {
        setSelectedLevel(null);
        setMascotMessage(MASCOT_MESSAGES.allComplete);
        setMascotEmotion('excited');
      }
      setIsPlaying(false);
    },
    [levels, selectedLevel]
  );

  // ============================================
  // RETURN
  // ============================================

  return {
    // Niveaux
    levels,
    selectedLevel,
    handleSelectLevel,
    completedLevels,

    // État jeu
    isPlaying,
    isTrainingMode,

    // Configuration labyrinthe
    currentMazeConfig,
    previewMaze,
    selectedTheme,
    cellSize,

    // Mode entraînement
    trainingConfig,
    trainingValues,

    // Parent drawer
    showParentDrawer,
    setShowParentDrawer,

    // Animations
    selectorStyle,
    progressPanelStyle,

    // Mascot
    mascotMessage,
    mascotEmotion,

    // Handlers
    handleBack,
    handleStartPlaying,
    handleParentPress,
    handleHelpPress,
    handleTrainingPress,
    handleReset,
    handleHint,
    handleLevelComplete,
    setIsPlaying,
    setMascotMessage,

    // Hints
    hintsRemaining,
  };
}
