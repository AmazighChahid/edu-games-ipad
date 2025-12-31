/**
 * useTangramIntro - Hook orchestrateur pour Tangram
 *
 * Encapsule toute la logique métier de l'écran d'introduction :
 * - Progression store (lecture/écriture)
 * - Génération des niveaux
 * - Messages mascotte (Géo le Renard)
 * - Navigation
 * - Coordination avec useTangramGame
 *
 * @see docs/GAME_ARCHITECTURE.md pour le pattern complet
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';

import {
  generateDefaultLevels,
  type LevelConfig,
} from '../../../components/common';
import { useTangramGame } from './useTangramGame';
import { useActiveProfile, useGameProgress, useStore } from '../../../store/useStore';
import { getAllPuzzles, createLevelFromPuzzle } from '../data/puzzles';
import type { TangramPuzzle } from '../types';

// ============================================================================
// TYPES
// ============================================================================

export type GeoEmotionType = 'neutral' | 'happy' | 'thinking' | 'excited' | 'encouraging';

export interface UseTangramIntroReturn {
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

  // Mascot
  mascotMessage: string;
  mascotEmotion: GeoEmotionType;

  // Game state (depuis useTangramGame)
  gameState: ReturnType<typeof useTangramGame>['gameState'];
  result: ReturnType<typeof useTangramGame>['result'];

  // Progress data pour ProgressPanel
  progressData: {
    piecesPlaced: number;
    totalPieces: number;
    moveCount: number;
    timeElapsed: number;
    hintsUsed: number;
  };

  // Handlers
  handleMovePiece: (pieceId: string, deltaX: number, deltaY: number) => void;
  handleMoveEnd: (pieceId: string) => void;
  handleRotate: (pieceId: string, clockwise?: boolean) => void;
  handleFlip: (pieceId: string) => void;
  handleSelect: (pieceId: string | null) => void;
  handleReset: () => void;
  handleHint: () => void;
  handleBack: () => void;
  handleStartPlaying: () => void;
  handleParentPress: () => void;
  handleHelpPress: () => void;
  handleForceComplete: () => void;
  handlePause: () => void;
  handleResume: () => void;

  // Hints
  hintsRemaining: number;
  hintsDisabled: boolean;
}

// ============================================================================
// CONSTANTS - Messages Géo
// ============================================================================

const GEO_MESSAGES = {
  welcome: [
    "Bonjour ! Je suis Géo le renard. Choisis un puzzle !",
    "Les formes t'attendent ! Quel puzzle veux-tu résoudre ?",
    "Bienvenue dans le monde du Tangram !",
  ],
  levelSelect: {
    easy: "Un puzzle facile ! Parfait pour s'échauffer !",
    medium: "Ce puzzle demande de la réflexion. Tu es prêt ?",
    hard: "Un vrai défi ! Montre-moi ce que tu sais faire !",
  },
  start: [
    "C'est parti ! Place les 7 pièces pour former la silhouette !",
    "Observe bien la forme grise, c'est ton guide !",
    "Tu peux tourner et retourner les pièces. Amuse-toi !",
  ],
  hint: [
    "Regarde la zone qui clignote, c'est là que va une pièce !",
    "Parfois, il faut tourner la pièce pour qu'elle rentre.",
    "Le parallélogramme peut se retourner, essaie !",
  ],
  error: [
    "Pas tout à fait... Essaie de tourner la pièce !",
    "Cette pièce ne rentre pas ici. Cherche ailleurs !",
    "Hmm, observe mieux la silhouette.",
  ],
  progress: [
    "Super ! Continue comme ça !",
    "Une pièce de plus ! Tu avances bien !",
    "Bravo, tu y es presque !",
  ],
  victory: [
    "BRAVO ! Tu as reconstitué la forme ! 🎉",
    "Magnifique ! Tu es un vrai artiste géomètre !",
    "Incroyable ! Le puzzle est complet !",
  ],
  reset: [
    "On recommence ? Les pièces sont prêtes !",
    "Nouvelle tentative ! Tu vas y arriver !",
  ],
  back: [
    "Tu veux choisir un autre puzzle ?",
    "Pas de souci, on peut changer de niveau !",
  ],
};

// ============================================================================
// HELPER
// ============================================================================

function getRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

// ============================================================================
// HOOK
// ============================================================================

export function useTangramIntro(): UseTangramIntroReturn {
  const router = useRouter();
  const params = useLocalSearchParams<{ level?: string; puzzle?: string }>();
  const profile = useActiveProfile();

  // Store - progression
  const gameProgress = useGameProgress('tangram');
  const initGameProgress = useStore((state) => state.initGameProgress);

  // Initialiser le progress si nécessaire
  useEffect(() => {
    initGameProgress('tangram');
  }, [initGameProgress]);

  // État local
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [mascotMessage, setMascotMessage] = useState(getRandomMessage(GEO_MESSAGES.welcome));
  const [mascotEmotion, setMascotEmotion] = useState<GeoEmotionType>('neutral');
  const [showParentDrawer, setShowParentDrawer] = useState(false);

  // Ref pour le puzzle sélectionné
  const selectedPuzzleRef = useRef<TangramPuzzle | null>(null);

  // Hook du jeu Tangram
  const tangramGame = useTangramGame();
  const {
    gameState,
    result,
    isLoading,
    startGame,
    handleMove,
    handleMoveEnd,
    handleRotate,
    handleFlip,
    handleSelect,
    pauseGame,
    resumeGame,
    restartLevel,
    requestHint,
  } = tangramGame;

  // ============================================
  // GÉNÉRATION DES NIVEAUX
  // ============================================

  // Extraire les IDs des niveaux complétés depuis le store
  const completedLevelIds = useMemo(() => {
    if (!gameProgress?.completedLevels) return [];
    return Object.keys(gameProgress.completedLevels).map(
      (levelId) => `tangram_${levelId}`
    );
  }, [gameProgress?.completedLevels]);

  // Générer les niveaux basés sur les puzzles disponibles
  const levels: LevelConfig[] = useMemo(() => {
    const puzzles = getAllPuzzles();

    return puzzles.map((puzzle, index) => {
      const levelNumber = index + 1;
      const isCompleted = completedLevelIds.includes(`tangram_${puzzle.id}`);

      // Mapping de difficulté
      let difficulty: LevelConfig['difficulty'] = 'easy';
      if (puzzle.difficulty === 'medium') difficulty = 'medium';
      else if (puzzle.difficulty === 'hard') difficulty = 'hard';

      // Déblocage : les 3 premiers sont toujours débloqués
      const isUnlocked = levelNumber <= 3 || (levelNumber > 3 && completedLevelIds.length >= levelNumber - 3);

      return {
        id: `tangram_${puzzle.id}`,
        number: levelNumber,
        difficulty,
        isCompleted,
        isUnlocked,
        stars: isCompleted ? (gameProgress?.completedLevels?.[puzzle.id]?.stars || 0) : 0,
        data: puzzle, // Stocker le puzzle pour usage ultérieur
      };
    });
  }, [completedLevelIds, gameProgress?.completedLevels]);

  // ============================================
  // EFFECTS - Sélection automatique niveau
  // ============================================

  useEffect(() => {
    if (levels.length > 0 && !selectedLevel) {
      // Si un puzzle est passé en paramètre URL
      if (params.puzzle) {
        const targetLevel = levels.find((l) => l.id === `tangram_${params.puzzle}`);
        if (targetLevel && targetLevel.isUnlocked) {
          setSelectedLevel(targetLevel);
          return;
        }
      }

      // Trouver le premier niveau débloqué mais non complété
      const firstIncompleteLevel = levels.find(
        (level) => level.isUnlocked && !level.isCompleted
      );

      const defaultLevel = firstIncompleteLevel ||
        levels.filter(l => l.isUnlocked).pop() ||
        levels[0];

      if (defaultLevel) {
        setSelectedLevel(defaultLevel);
      }
    }
  }, [levels, selectedLevel, params.puzzle]);

  // Démarrer le jeu quand un niveau est sélectionné
  useEffect(() => {
    if (selectedLevel && selectedLevel.data) {
      const puzzle = selectedLevel.data as TangramPuzzle;
      selectedPuzzleRef.current = puzzle;
      const tangramLevel = createLevelFromPuzzle(puzzle);
      startGame(tangramLevel);
    }
  }, [selectedLevel, startGame]);

  // ============================================
  // EFFECTS - Détection victoire
  // ============================================

  useEffect(() => {
    if (gameState?.phase === 'victory' && result && !isVictory) {
      setIsVictory(true);
      setMascotMessage(getRandomMessage(GEO_MESSAGES.victory));
      setMascotEmotion('excited');

      // Navigation vers victory après délai
      const timer = setTimeout(() => {
        router.push({
          pathname: '/(games)/08-tangram/victory',
          params: {
            puzzleId: selectedPuzzleRef.current?.id || '',
            puzzleName: selectedPuzzleRef.current?.name || '',
            timeSeconds: result.timeSeconds.toString(),
            moveCount: result.moveCount.toString(),
            hintsUsed: result.hintsUsed.toString(),
            stars: result.stars.toString(),
            level: selectedLevel?.number.toString() || '1',
          },
        });
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [gameState?.phase, result, isVictory, router, selectedLevel]);

  // ============================================
  // PROGRESS DATA
  // ============================================

  const progressData = useMemo(() => {
    if (!gameState) {
      return {
        piecesPlaced: 0,
        totalPieces: 7,
        moveCount: 0,
        timeElapsed: 0,
        hintsUsed: 0,
      };
    }

    const piecesPlaced = gameState.pieces.filter(p => p.isPlaced).length;

    return {
      piecesPlaced,
      totalPieces: gameState.pieces.length,
      moveCount: gameState.moveCount,
      timeElapsed: gameState.timeElapsed,
      hintsUsed: gameState.hintsUsed,
    };
  }, [gameState]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleSelectLevel = useCallback((level: LevelConfig) => {
    setSelectedLevel(level);
    setIsVictory(false);

    const difficultyMessage = GEO_MESSAGES.levelSelect[level.difficulty as keyof typeof GEO_MESSAGES.levelSelect]
      || GEO_MESSAGES.levelSelect.easy;
    setMascotMessage(difficultyMessage);
    setMascotEmotion('happy');
  }, []);

  const handleStartPlaying = useCallback(() => {
    if (!selectedLevel) return;
    setIsPlaying(true);
    setMascotMessage(getRandomMessage(GEO_MESSAGES.start));
    setMascotEmotion('excited');
  }, [selectedLevel]);

  const handleBack = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      setMascotMessage(getRandomMessage(GEO_MESSAGES.back));
      setMascotEmotion('neutral');
    } else {
      router.replace('/');
    }
  }, [isPlaying, router]);

  const handleParentPress = useCallback(() => {
    setShowParentDrawer(true);
  }, []);

  const handleHelpPress = useCallback(() => {
    setMascotMessage("Observe la silhouette grise, c'est ton guide ! Tu peux tourner et retourner les pièces.");
    setMascotEmotion('thinking');
  }, []);

  const handleReset = useCallback(() => {
    restartLevel();
    setIsVictory(false);
    setMascotMessage(getRandomMessage(GEO_MESSAGES.reset));
    setMascotEmotion('encouraging');
  }, [restartLevel]);

  const handleHintPress = useCallback(() => {
    requestHint();
    setMascotMessage(getRandomMessage(GEO_MESSAGES.hint));
    setMascotEmotion('thinking');
  }, [requestHint]);

  const handleMovePiece = useCallback((pieceId: string, deltaX: number, deltaY: number) => {
    // Passer automatiquement en mode jeu au premier mouvement
    if (!isPlaying) {
      setIsPlaying(true);
      setMascotMessage(getRandomMessage(GEO_MESSAGES.start));
      setMascotEmotion('happy');
    }
    handleMove(pieceId, deltaX, deltaY);
  }, [isPlaying, handleMove]);

  const handleRotatePiece = useCallback((pieceId: string, clockwise: boolean = true) => {
    handleRotate(pieceId, clockwise);
  }, [handleRotate]);

  const handleFlipPiece = useCallback((pieceId: string) => {
    handleFlip(pieceId);
  }, [handleFlip]);

  const handleSelectPiece = useCallback((pieceId: string | null) => {
    handleSelect(pieceId);
  }, [handleSelect]);

  const handlePause = useCallback(() => {
    pauseGame();
  }, [pauseGame]);

  const handleResume = useCallback(() => {
    resumeGame();
  }, [resumeGame]);

  // DEV: Force complete level (for testing)
  const handleForceComplete = useCallback(() => {
    setIsVictory(true);
    router.push({
      pathname: '/(games)/08-tangram/victory',
      params: {
        puzzleId: selectedPuzzleRef.current?.id || 'test',
        puzzleName: selectedPuzzleRef.current?.name || 'Test',
        timeSeconds: '60',
        moveCount: '20',
        hintsUsed: '0',
        stars: '3',
        level: selectedLevel?.number.toString() || '1',
      },
    });
  }, [router, selectedLevel]);

  // ============================================
  // HINTS COMPUTATION
  // ============================================

  const hintsRemaining = useMemo(() => {
    if (!gameState) return 3;
    return gameState.level.hintsAvailable - gameState.hintsUsed;
  }, [gameState]);

  const hintsDisabled = hintsRemaining <= 0;

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

    // Mascot
    mascotMessage,
    mascotEmotion,

    // Game state
    gameState,
    result,

    // Progress data
    progressData,

    // Handlers
    handleMovePiece,
    handleMoveEnd,
    handleRotate: handleRotatePiece,
    handleFlip: handleFlipPiece,
    handleSelect: handleSelectPiece,
    handleReset,
    handleHint: handleHintPress,
    handleBack,
    handleStartPlaying,
    handleParentPress,
    handleHelpPress,
    handleForceComplete,
    handlePause,
    handleResume,

    // Hints
    hintsRemaining,
    hintsDisabled,
  };
}

export default useTangramIntro;
