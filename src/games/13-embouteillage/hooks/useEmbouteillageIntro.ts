/**
 * useEmbouteillageIntro - Hook orchestrateur pour Embouteillage
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
import { useEmbouteillageGame } from './useEmbouteillageGame';
import { useEmbouteillageSound } from './useEmbouteillageSound';
import { useActiveProfile, useGameProgress, useStore } from '../../../store/useStore';
import { TRAFFIC_MESSAGES } from '../data/assistantScripts';
import type { Vehicle } from '../types';

// ============================================
// TYPES
// ============================================

export type EmotionType = 'neutral' | 'happy' | 'thinking' | 'excited' | 'encouraging';

export interface UseEmbouteillageIntroReturn {
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

  // Game state (depuis useEmbouteillageGame)
  gameState: ReturnType<typeof useEmbouteillageGame>['gameState'];
  sessionState: ReturnType<typeof useEmbouteillageGame>['sessionState'];
  currentLevel: ReturnType<typeof useEmbouteillageGame>['currentLevel'];
  vehicles: Vehicle[];

  // Progress data pour ProgressPanel
  progressData: {
    current: number;
    total: number;
    moves: number;
    minMoves: number;
    hintsUsed: number;
  };

  // Handlers
  handleMoveVehicle: (vehicleId: string, direction: 'up' | 'down' | 'left' | 'right', distance?: number) => boolean;
  handleSelectVehicle: (vehicle: Vehicle | null) => void;
  handleUndo: () => void;
  handleReset: () => void;
  handleHint: () => void;
  handleBack: () => void;
  handleStartPlaying: () => void;
  handleParentPress: () => void;
  handleHelpPress: () => void;
  handleForceComplete: () => void;

  // Validation
  canMove: ReturnType<typeof useEmbouteillageGame>['canMove'];
  getMaxMoveDistance: ReturnType<typeof useEmbouteillageGame>['getMaxMoveDistance'];

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

const TOTAL_PUZZLES = 8;

// ============================================
// HOOK
// ============================================

export function useEmbouteillageIntro(): UseEmbouteillageIntroReturn {
  const router = useRouter();
  const params = useLocalSearchParams<{ level?: string }>();
  const profile = useActiveProfile();

  // Store - progression
  const gameProgress = useGameProgress('embouteillage');
  const initGameProgress = useStore((state) => state.initGameProgress);

  // Initialiser le progress si nécessaire
  useEffect(() => {
    initGameProgress('embouteillage');
  }, [initGameProgress]);

  // État local
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [mascotMessage, setMascotMessage] = useState("Salut ! Je suis Caro le Castor. Libérons la voiture rouge !");
  const [mascotEmotion, setMascotEmotion] = useState<EmotionType>('neutral');
  const [showParentDrawer, setShowParentDrawer] = useState(false);

  // Extraire les IDs des niveaux complétés depuis le store
  const completedLevelIds = useMemo(() => {
    if (!gameProgress?.completedLevels) return [];
    return Object.keys(gameProgress.completedLevels).map(
      (levelId) => `embouteillage_${levelId}`
    );
  }, [gameProgress?.completedLevels]);

  // Générer les niveaux basés sur l'âge de l'enfant et les niveaux complétés
  const levels = useMemo(() => {
    return generateDefaultLevels('embouteillage', profile?.birthDate, completedLevelIds);
  }, [profile?.birthDate, completedLevelIds]);

  // Hook du jeu
  const currentLevelNumber = selectedLevel?.number || 1;
  const gameHook = useEmbouteillageGame({
    initialLevel: currentLevelNumber,
  });

  const {
    gameState,
    sessionState,
    currentLevel,
    moveVehicle,
    selectVehicle,
    undoLastMove,
    resetPuzzle,
    loadLevel,
    requestHint,
    canMove,
    getMaxMoveDistance,
    hintsRemaining,
  } = gameHook;

  // Sons
  const { playSelect, playMove, playBlocked, playVictory } = useEmbouteillageSound();

  // Ref pour tracker le changement de niveau
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
  // EFFECTS - Sélection automatique niveau
  // ============================================

  useEffect(() => {
    const levelParamChanged = params.level !== lastLevelParamRef.current;
    if (levelParamChanged) {
      lastLevelParamRef.current = params.level;
    }

    if (levels.length > 0 && (!selectedLevel || levelParamChanged)) {
      try {
        let defaultLevel: LevelConfig | undefined;

        if (params.level) {
          const levelNumber = parseInt(params.level, 10);
          defaultLevel = levels.find((l) => l.number === levelNumber && l.isUnlocked);
        }

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
          loadLevel(defaultLevel.number);
          setMascotMessage(
            `Niveau ${defaultLevel.number} ! ${
              defaultLevel.difficulty === 'easy'
                ? 'Parfait pour commencer !'
                : defaultLevel.difficulty === 'hard'
                ? 'Un vrai défi !'
                : 'Bonne difficulté !'
            }`
          );
          setMascotEmotion('happy');
        }
      } catch {
        const level1 = levels[0];
        if (level1) {
          setSelectedLevel(level1);
          loadLevel(1);
          setMascotMessage("Niveau 1 ! Parfait pour commencer !");
          setMascotEmotion('happy');
        }
      }
    }
  }, [levels, selectedLevel, params.level, loadLevel]);

  // ============================================
  // EFFECTS - Feedback jeu
  // ============================================

  useEffect(() => {
    if (gameState.status === 'victory') {
      playVictory();
      const messages = TRAFFIC_MESSAGES.success;
      setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
      setMascotEmotion('excited');
      setIsVictory(true);

      // Navigation vers victory après délai
      const timer = setTimeout(() => {
        const totalTimeMs = gameState.startTime
          ? Date.now() - gameState.startTime
          : 0;

        router.push({
          pathname: '/(games)/13-embouteillage/victory',
          params: {
            moves: gameState.moveCount.toString(),
            minMoves: currentLevel?.minMoves.toString() || '0',
            hintsUsed: gameState.hintsUsed.toString(),
            totalTime: totalTimeMs.toString(),
            level: currentLevelNumber.toString(),
          },
        });
      }, 1500);

      return () => clearTimeout(timer);
    } else if (gameState.status === 'error') {
      playBlocked();
      const messages = TRAFFIC_MESSAGES.error;
      setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
      setMascotEmotion('encouraging');
    }
  }, [gameState.status, playVictory, playBlocked, router, currentLevelNumber, currentLevel, gameState]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleSelectLevel = useCallback((level: LevelConfig) => {
    setSelectedLevel(level);
    loadLevel(level.number);
    setMascotMessage(
      `Niveau ${level.number} ! ${
        level.difficulty === 'easy'
          ? 'Parfait pour commencer !'
          : level.difficulty === 'hard'
          ? 'Un vrai défi !'
          : 'Bonne difficulté !'
      }`
    );
    setMascotEmotion('happy');
  }, [loadLevel]);

  const handleStartPlaying = useCallback(() => {
    if (!selectedLevel) return;
    transitionToPlayMode();
    setMascotMessage("C'est parti ! Libère la voiture rouge !");
    setMascotEmotion('excited');
  }, [selectedLevel, transitionToPlayMode]);

  const handleBack = useCallback(() => {
    if (isPlaying) {
      transitionToSelectionMode();
      setMascotMessage("On recommence ? Choisis un niveau !");
      setMascotEmotion('encouraging');
    } else {
      router.replace('/');
    }
  }, [isPlaying, router, transitionToSelectionMode]);

  const handleParentPress = useCallback(() => {
    setShowParentDrawer(true);
  }, []);

  const handleHelpPress = useCallback(() => {
    setMascotMessage("Regarde quel véhicule bloque la voiture rouge...");
    setMascotEmotion('thinking');
  }, []);

  const handleReset = useCallback(() => {
    resetPuzzle();
    setMascotMessage("On recommence ! Observe bien le parking...");
    setMascotEmotion('neutral');
  }, [resetPuzzle]);

  const handleUndo = useCallback(() => {
    undoLastMove();
    setMascotMessage("Coup annulé !");
    setMascotEmotion('neutral');
  }, [undoLastMove]);

  const handleHint = useCallback(() => {
    requestHint();
    setMascotMessage(TRAFFIC_MESSAGES.hint1);
    setMascotEmotion('thinking');
  }, [requestHint]);

  const handleMoveVehicle = useCallback((
    vehicleId: string,
    direction: 'up' | 'down' | 'left' | 'right',
    distance?: number
  ) => {
    if (!isPlaying) {
      transitionToPlayMode();
    }
    playMove();
    const success = moveVehicle(vehicleId, direction, distance);
    if (success) {
      setMascotMessage("Bien joué !");
      setMascotEmotion('happy');
    }
    return success;
  }, [isPlaying, transitionToPlayMode, playMove, moveVehicle]);

  const handleSelectVehicle = useCallback((vehicle: Vehicle | null) => {
    if (vehicle) {
      playSelect();
      setMascotMessage(`${vehicle.isTarget ? 'Voiture rouge' : 'Véhicule'} sélectionné !`);
    }
    selectVehicle(vehicle);
  }, [selectVehicle, playSelect]);

  const handleForceComplete = useCallback(() => {
    setIsVictory(true);
    const totalTimeMs = gameState.startTime
      ? Date.now() - gameState.startTime
      : 0;

    router.push({
      pathname: '/(games)/13-embouteillage/victory',
      params: {
        moves: '1',
        minMoves: currentLevel?.minMoves.toString() || '1',
        hintsUsed: '0',
        totalTime: totalTimeMs.toString(),
        level: currentLevelNumber.toString(),
      },
    });
  }, [router, gameState.startTime, currentLevel, currentLevelNumber]);

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
    sessionState,
    currentLevel,
    vehicles: gameState.vehicles,

    // Progress data
    progressData: {
      current: sessionState.puzzlesCompleted,
      total: TOTAL_PUZZLES,
      moves: gameState.moveCount,
      minMoves: currentLevel?.minMoves || 0,
      hintsUsed: gameState.hintsUsed,
    },

    // Handlers
    handleMoveVehicle,
    handleSelectVehicle,
    handleUndo,
    handleReset,
    handleHint,
    handleBack,
    handleStartPlaying,
    handleParentPress,
    handleHelpPress,
    handleForceComplete,

    // Validation
    canMove,
    getMaxMoveDistance,

    // Hints
    hintsRemaining,
    canPlayAudio: isPlaying,
  };
}

export default useEmbouteillageIntro;
