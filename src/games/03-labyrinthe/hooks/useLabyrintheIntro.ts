/**
 * useLabyrintheIntro - Hook orchestrateur pour Labyrinthe Logique
 *
 * VERSION MIGRÉE (Janvier 2026)
 * Utilise useGameIntroOrchestrator pour la logique commune.
 * Ce fichier ne contient plus que la logique spécifique au jeu.
 *
 * @see docs/GAME_ARCHITECTURE.md pour le pattern complet
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';

import { useGameIntroOrchestrator, type EmotionType } from '../../../hooks';
import type { LevelConfig, TrainingConfig, TrainingParam } from '../../../components/common';
import { useMazeGenerator } from './useMazeGenerator';
import { LEVELS } from '../data/levels';
import { Icons } from '../../../constants/icons';
import type { LevelConfig as MazeLevelConfig, MazeGrid, ThemeType, SessionStats } from '../types';

// Re-export EmotionType for backward compatibility
export type { EmotionType } from '../../../hooks';

// ============================================
// TYPES
// ============================================

export interface UseLabyrintheIntroReturn {
  // Niveaux (depuis orchestrator)
  levels: LevelConfig[];
  selectedLevel: LevelConfig | null;
  handleSelectLevel: (level: LevelConfig) => void;
  completedLevels: Set<number>;

  // État jeu (depuis orchestrator)
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

  // Parent drawer (depuis orchestrator)
  showParentDrawer: boolean;
  setShowParentDrawer: (show: boolean) => void;

  // Animations (depuis orchestrator)
  selectorStyle: ReturnType<typeof useGameIntroOrchestrator>['selectorStyle'];
  progressPanelStyle: ReturnType<typeof useGameIntroOrchestrator>['progressPanelStyle'];

  // Mascot (depuis orchestrator)
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
};

// ============================================
// HOOK
// ============================================

export function useLabyrintheIntro(): UseLabyrintheIntroReturn {
  const { width: screenWidth } = useWindowDimensions();
  const { generateMaze } = useMazeGenerator();

  // ============================================
  // ORCHESTRATOR (logique commune factorisée)
  // ============================================
  const orchestrator = useGameIntroOrchestrator({
    gameId: 'labyrinthe',
    mascotMessages: {
      welcome: MASCOT_MESSAGES.welcome,
      startPlaying: MASCOT_MESSAGES.startPlaying,
      backToSelection: MASCOT_MESSAGES.backToSelection,
      help: MASCOT_MESSAGES.help,
    },
  });

  // ============================================
  // LOCAL STATE (spécifique à Labyrinthe)
  // ============================================
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('cozy');
  const [previewMaze, setPreviewMaze] = useState<MazeGrid | null>(null);
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
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

  // Configuration labyrinthe actuelle (basée sur le niveau sélectionné)
  const currentMazeConfig = useMemo((): MazeLevelConfig | null => {
    if (!orchestrator.selectedLevel) return null;

    const levelNum = orchestrator.selectedLevel.number;
    const mazeConfig = LEVEL_TO_MAZE_CONFIG[levelNum] || LEVEL_TO_MAZE_CONFIG[1];

    // Trouver le niveau existant le plus proche dans LEVELS
    const existingLevel = LEVELS.find((l) => l.id === levelNum) || LEVELS[0];

    return {
      ...existingLevel,
      ...mazeConfig,
      theme: selectedTheme,
    };
  }, [orchestrator.selectedLevel, selectedTheme]);

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
  // EFFECTS - Preview maze generation
  // ============================================
  useEffect(() => {
    if (currentMazeConfig && !orchestrator.isPlaying) {
      const maze = generateMaze(currentMazeConfig);
      setPreviewMaze(maze);
    }
  }, [currentMazeConfig, generateMaze, orchestrator.isPlaying]);

  // ============================================
  // EFFECTS - Level selection message
  // ============================================
  useEffect(() => {
    if (orchestrator.selectedLevel) {
      const config =
        LEVEL_TO_MAZE_CONFIG[orchestrator.selectedLevel.number] || LEVEL_TO_MAZE_CONFIG[1];
      const sizeText = config.width === 5 ? 'petit' : config.width === 7 ? 'moyen' : 'grand';
      orchestrator.setMascotMessage(
        MASCOT_MESSAGES.selectLevel(
          orchestrator.selectedLevel.number,
          sizeText,
          config.hasKeys ?? false
        )
      );
      orchestrator.setMascotEmotion('happy');
    }
  }, [orchestrator.selectedLevel, orchestrator]);

  // ============================================
  // HANDLERS SPÉCIFIQUES
  // ============================================

  const handleSelectLevel = useCallback(
    (level: LevelConfig) => {
      orchestrator.handleSelectLevel(level);
      const config = LEVEL_TO_MAZE_CONFIG[level.number] || LEVEL_TO_MAZE_CONFIG[1];
      const sizeText = config.width === 5 ? 'petit' : config.width === 7 ? 'moyen' : 'grand';
      orchestrator.setMascotMessage(
        MASCOT_MESSAGES.selectLevel(level.number, sizeText, config.hasKeys ?? false)
      );
      orchestrator.setMascotEmotion('happy');
    },
    [orchestrator]
  );

  const handleStartPlaying = useCallback(() => {
    if (!orchestrator.selectedLevel) return;
    orchestrator.handleStartPlaying();
    orchestrator.setMascotMessage(MASCOT_MESSAGES.startPlaying);
    orchestrator.setMascotEmotion('excited');
  }, [orchestrator]);

  const handleBack = useCallback(() => {
    if (orchestrator.isPlaying) {
      orchestrator.transitionToSelectionMode();
      orchestrator.setMascotMessage(MASCOT_MESSAGES.backToSelection);
      orchestrator.setMascotEmotion('encouraging');
    } else {
      orchestrator.router.back();
    }
  }, [orchestrator]);

  const handleHelpPress = useCallback(() => {
    orchestrator.setMascotMessage(MASCOT_MESSAGES.help);
    orchestrator.setMascotEmotion('thinking');
  }, [orchestrator]);

  const handleTrainingPress = useCallback(() => {
    setIsTrainingMode((prev) => !prev);
    orchestrator.setMascotMessage(
      isTrainingMode ? MASCOT_MESSAGES.trainingOff : MASCOT_MESSAGES.trainingOn
    );
    orchestrator.setMascotEmotion('thinking');
  }, [isTrainingMode, orchestrator]);

  const handleReset = useCallback(() => {
    if (currentMazeConfig) {
      const maze = generateMaze(currentMazeConfig);
      setPreviewMaze(maze);
      orchestrator.setMascotMessage(MASCOT_MESSAGES.newMaze);
      orchestrator.setMascotEmotion('neutral');
    }
  }, [currentMazeConfig, generateMaze, orchestrator]);

  const handleHint = useCallback(() => {
    orchestrator.setMascotMessage(MASCOT_MESSAGES.hint);
    orchestrator.setMascotEmotion('thinking');
    setHintsRemaining((prev) => Math.max(0, prev - 1));
  }, [orchestrator]);

  const handleLevelComplete = useCallback(
    (stats: SessionStats) => {
      setCompletedLevels((prev) => new Set(prev).add(stats.levelId));

      const currentIndex = orchestrator.levels.findIndex(
        (l) => l.number === orchestrator.selectedLevel?.number
      );
      if (currentIndex < orchestrator.levels.length - 1) {
        orchestrator.handleSelectLevel(orchestrator.levels[currentIndex + 1]);
        orchestrator.setMascotMessage(MASCOT_MESSAGES.nextLevel);
        orchestrator.setMascotEmotion('excited');
      } else {
        orchestrator.setMascotMessage(MASCOT_MESSAGES.allComplete);
        orchestrator.setMascotEmotion('excited');
      }
      orchestrator.setIsPlaying(false);
    },
    [orchestrator]
  );

  const setMascotMessage = useCallback(
    (message: string) => {
      orchestrator.setMascotMessage(message);
    },
    [orchestrator]
  );

  // ============================================
  // RETURN
  // ============================================

  return {
    // Depuis orchestrator
    levels: orchestrator.levels,
    selectedLevel: orchestrator.selectedLevel,
    handleSelectLevel,
    completedLevels,

    // État jeu
    isPlaying: orchestrator.isPlaying,
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
    showParentDrawer: orchestrator.showParentDrawer,
    setShowParentDrawer: orchestrator.setShowParentDrawer,

    // Animations
    selectorStyle: orchestrator.selectorStyle,
    progressPanelStyle: orchestrator.progressPanelStyle,

    // Mascot
    mascotMessage: orchestrator.mascotMessage,
    mascotEmotion: orchestrator.mascotEmotion,

    // Handlers
    handleBack,
    handleStartPlaying,
    handleParentPress: orchestrator.handleParentPress,
    handleHelpPress,
    handleTrainingPress,
    handleReset,
    handleHint,
    handleLevelComplete,
    setIsPlaying: orchestrator.setIsPlaying,
    setMascotMessage,

    // Hints
    hintsRemaining,
  };
}
