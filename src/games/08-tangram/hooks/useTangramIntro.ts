/**
 * useTangramIntro - Hook orchestrateur pour Tangram
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
import { useTangramGame } from './useTangramGame';
import { getAllPuzzles, createLevelFromPuzzle } from '../data/puzzles';
import type { TangramPuzzle } from '../types';

// ============================================================================
// TYPES
// ============================================================================

export type GeoEmotionType = EmotionType;

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

  // Animations (styles animés)
  selectorStyle: ReturnType<typeof useGameIntroOrchestrator>['selectorStyle'];
  progressPanelStyle: ReturnType<typeof useGameIntroOrchestrator>['progressPanelStyle'];

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
    'Bonjour ! Je suis Géo le renard. Choisis un puzzle !',
    "Les formes t'attendent ! Quel puzzle veux-tu résoudre ?",
    'Bienvenue dans le monde du Tangram !',
  ],
  levelSelect: {
    easy: "Un puzzle facile ! Parfait pour s'échauffer !",
    medium: 'Ce puzzle demande de la réflexion. Tu es prêt ?',
    hard: 'Un vrai défi ! Montre-moi ce que tu sais faire !',
  },
  start: [
    "C'est parti ! Place les 7 pièces pour former la silhouette !",
    "Observe bien la forme grise, c'est ton guide !",
    'Tu peux tourner et retourner les pièces. Amuse-toi !',
  ],
  hint: [
    "Regarde la zone qui clignote, c'est là que va une pièce !",
    "Parfois, il faut tourner la pièce pour qu'elle rentre.",
    'Le parallélogramme peut se retourner, essaie !',
  ],
  error: [
    'Pas tout à fait... Essaie de tourner la pièce !',
    'Cette pièce ne rentre pas ici. Cherche ailleurs !',
    'Hmm, observe mieux la silhouette.',
  ],
  progress: ['Super ! Continue comme ça !', 'Une pièce de plus ! Tu avances bien !', 'Bravo, tu y es presque !'],
  victory: [
    'BRAVO ! Tu as reconstitué la forme ! 🎉',
    'Magnifique ! Tu es un vrai artiste géomètre !',
    'Incroyable ! Le puzzle est complet !',
  ],
  reset: ['On recommence ? Les pièces sont prêtes !', 'Nouvelle tentative ! Tu vas y arriver !'],
  back: ['Tu veux choisir un autre puzzle ?', 'Pas de souci, on peut changer de niveau !'],
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
  // ============================================================================
  // ORCHESTRATOR (logique commune factorisée)
  // ============================================================================
  const orchestrator = useGameIntroOrchestrator({
    gameId: 'tangram',
    mascotMessages: {
      welcome: getRandomMessage(GEO_MESSAGES.welcome),
      startPlaying: getRandomMessage(GEO_MESSAGES.start),
      backToSelection: getRandomMessage(GEO_MESSAGES.back),
      help: "Observe la silhouette grise, c'est ton guide ! Tu peux tourner et retourner les pièces.",
    },
  });

  // ============================================================================
  // LOCAL STATE (spécifique à Tangram)
  // ============================================================================
  const [mascotEmotion, setMascotEmotion] = useState<GeoEmotionType>('neutral');

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

  // ============================================================================
  // GÉNÉRATION DES NIVEAUX (spécifique - basé sur puzzles)
  // ============================================================================
  const levels: LevelConfig[] = useMemo(() => {
    const puzzles = getAllPuzzles();

    return puzzles.map((puzzle, index) => {
      const levelNumber = index + 1;
      const isCompleted = orchestrator.completedLevelIds.includes(`tangram_${puzzle.id}`);

      // Mapping de difficulté
      let difficulty: LevelConfig['difficulty'] = 'easy';
      if (puzzle.difficulty === 'medium') difficulty = 'medium';
      else if (puzzle.difficulty === 'hard') difficulty = 'hard';

      // Déblocage : les 3 premiers sont toujours débloqués
      const isUnlocked =
        levelNumber <= 3 || (levelNumber > 3 && orchestrator.completedLevelIds.length >= levelNumber - 3);

      return {
        id: `tangram_${puzzle.id}`,
        number: levelNumber,
        difficulty,
        isCompleted,
        isUnlocked,
        stars: isCompleted ? (orchestrator.gameProgress?.completedLevels?.[puzzle.id]?.stars || 0) : 0,
        data: puzzle, // Stocker le puzzle pour usage ultérieur
      };
    });
  }, [orchestrator.completedLevelIds, orchestrator.gameProgress?.completedLevels]);

  // Ref pour tracker les paramètres URL
  const lastLevelParamRef = useRef<string | undefined>(undefined);

  // ============================================================================
  // EFFECTS - Sélection automatique niveau
  // ============================================================================
  useEffect(() => {
    const levelParamChanged = orchestrator.params.puzzle !== lastLevelParamRef.current;
    if (levelParamChanged) {
      lastLevelParamRef.current = orchestrator.params.puzzle;
    }

    if (levels.length > 0 && (!orchestrator.selectedLevel || levelParamChanged)) {
      let defaultLevel: LevelConfig | undefined;

      // Si un puzzle est passé en paramètre URL
      if (orchestrator.params.puzzle) {
        defaultLevel = levels.find(
          (l) => l.id === `tangram_${orchestrator.params.puzzle}` && l.isUnlocked
        );
      }

      // Sinon, trouver le premier niveau débloqué mais non complété
      if (!defaultLevel) {
        const firstIncompleteLevel = levels.find((level) => level.isUnlocked && !level.isCompleted);
        defaultLevel =
          firstIncompleteLevel || levels.filter((l) => l.isUnlocked).pop() || levels[0];
      }

      if (defaultLevel) {
        orchestrator.handleSelectLevel(defaultLevel);
      }
    }
  }, [levels, orchestrator.selectedLevel, orchestrator.params.puzzle, orchestrator]);

  // Démarrer le jeu quand un niveau est sélectionné
  useEffect(() => {
    if (orchestrator.selectedLevel && orchestrator.selectedLevel.data) {
      const puzzle = orchestrator.selectedLevel.data as TangramPuzzle;
      selectedPuzzleRef.current = puzzle;
      const tangramLevel = createLevelFromPuzzle(puzzle);
      startGame(tangramLevel);
    }
  }, [orchestrator.selectedLevel, startGame]);

  // ============================================================================
  // EFFECTS - Détection victoire
  // ============================================================================
  useEffect(() => {
    if (gameState?.phase === 'victory' && result && !orchestrator.isVictory) {
      orchestrator.setIsVictory(true);
      orchestrator.setMascotMessage(getRandomMessage(GEO_MESSAGES.victory));
      setMascotEmotion('excited');

      // Navigation vers victory après délai
      const timer = setTimeout(() => {
        orchestrator.router.push({
          pathname: '/(games)/08-tangram/victory',
          params: {
            puzzleId: selectedPuzzleRef.current?.id || '',
            puzzleName: selectedPuzzleRef.current?.name || '',
            timeSeconds: result.timeSeconds.toString(),
            moveCount: result.moveCount.toString(),
            hintsUsed: result.hintsUsed.toString(),
            stars: result.stars.toString(),
            level: orchestrator.selectedLevel?.number.toString() || '1',
          },
        });
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [gameState?.phase, result, orchestrator]);

  // ============================================================================
  // PROGRESS DATA
  // ============================================================================
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

    const piecesPlaced = gameState.pieces.filter((p) => p.isPlaced).length;

    return {
      piecesPlaced,
      totalPieces: gameState.pieces.length,
      moveCount: gameState.moveCount,
      timeElapsed: gameState.timeElapsed,
      hintsUsed: gameState.hintsUsed,
    };
  }, [gameState]);

  // ============================================================================
  // HANDLERS SPÉCIFIQUES
  // ============================================================================

  const handleSelectLevel = useCallback(
    (level: LevelConfig) => {
      orchestrator.handleSelectLevel(level);
      orchestrator.setIsVictory(false);

      const difficultyMessage =
        GEO_MESSAGES.levelSelect[level.difficulty as keyof typeof GEO_MESSAGES.levelSelect] ||
        GEO_MESSAGES.levelSelect.easy;
      orchestrator.setMascotMessage(difficultyMessage);
      setMascotEmotion('happy');
    },
    [orchestrator]
  );

  const handleStartPlaying = useCallback(() => {
    if (!orchestrator.selectedLevel) return;
    orchestrator.handleStartPlaying();
    orchestrator.setMascotMessage(getRandomMessage(GEO_MESSAGES.start));
    setMascotEmotion('excited');
  }, [orchestrator]);

  const handleBack = useCallback(() => {
    if (orchestrator.isPlaying) {
      orchestrator.transitionToSelectionMode();
      orchestrator.setMascotMessage(getRandomMessage(GEO_MESSAGES.back));
      setMascotEmotion('neutral');
      orchestrator.setIsVictory(false);
    } else {
      orchestrator.router.replace('/');
    }
  }, [orchestrator]);

  const handleHelpPress = useCallback(() => {
    orchestrator.setMascotMessage(
      "Observe la silhouette grise, c'est ton guide ! Tu peux tourner et retourner les pièces."
    );
    setMascotEmotion('thinking');
  }, [orchestrator]);

  const handleReset = useCallback(() => {
    restartLevel();
    orchestrator.setIsVictory(false);
    orchestrator.setMascotMessage(getRandomMessage(GEO_MESSAGES.reset));
    setMascotEmotion('encouraging');
  }, [restartLevel, orchestrator]);

  const handleHintPress = useCallback(() => {
    requestHint();
    orchestrator.setMascotMessage(getRandomMessage(GEO_MESSAGES.hint));
    setMascotEmotion('thinking');
  }, [requestHint, orchestrator]);

  const handleMovePiece = useCallback(
    (pieceId: string, deltaX: number, deltaY: number) => {
      // Passer automatiquement en mode jeu au premier mouvement
      if (!orchestrator.isPlaying) {
        orchestrator.transitionToPlayMode();
        orchestrator.setMascotMessage(getRandomMessage(GEO_MESSAGES.start));
        setMascotEmotion('happy');
      }
      handleMove(pieceId, deltaX, deltaY);
    },
    [orchestrator, handleMove]
  );

  const handleRotatePiece = useCallback(
    (pieceId: string, clockwise: boolean = true) => {
      handleRotate(pieceId, clockwise);
    },
    [handleRotate]
  );

  const handleFlipPiece = useCallback(
    (pieceId: string) => {
      handleFlip(pieceId);
    },
    [handleFlip]
  );

  const handleSelectPiece = useCallback(
    (pieceId: string | null) => {
      handleSelect(pieceId);
    },
    [handleSelect]
  );

  const handlePause = useCallback(() => {
    pauseGame();
  }, [pauseGame]);

  const handleResume = useCallback(() => {
    resumeGame();
  }, [resumeGame]);

  // DEV: Force complete level (for testing)
  const handleForceComplete = useCallback(() => {
    orchestrator.setIsVictory(true);
    orchestrator.router.push({
      pathname: '/(games)/08-tangram/victory',
      params: {
        puzzleId: selectedPuzzleRef.current?.id || 'test',
        puzzleName: selectedPuzzleRef.current?.name || 'Test',
        timeSeconds: '60',
        moveCount: '20',
        hintsUsed: '0',
        stars: '3',
        level: orchestrator.selectedLevel?.number.toString() || '1',
      },
    });
  }, [orchestrator]);

  // ============================================================================
  // HINTS COMPUTATION
  // ============================================================================
  const hintsRemaining = useMemo(() => {
    if (!gameState) return 3;
    return gameState.level.hintsAvailable - gameState.hintsUsed;
  }, [gameState]);

  const hintsDisabled = hintsRemaining <= 0;

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Niveaux (custom pour tangram)
    levels,
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
    handleParentPress: orchestrator.handleParentPress,
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
