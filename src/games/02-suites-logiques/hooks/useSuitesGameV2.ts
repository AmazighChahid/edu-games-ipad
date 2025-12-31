/**
 * useSuitesGameV2 - Hook principal du jeu avec moteur adaptatif
 *
 * Version 2 utilisant le nouveau moteur pedagogique.
 * Compatible avec les composants UI existants via puzzleToSequence().
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  Sequence,
  SequenceElement,
  ThemeType,
  GameState,
  SessionState,
} from '../types';
import { GAME_CONFIG } from '../data/gameConfig';
import {
  // Engine imports
  DifficultyController,
  generatePuzzle,
  validateAnswer,
  getHint,
  puzzleToSequence,
  loadPlayerModel,
  savePlayerModel,
  PlayerModel,
  SequencePuzzle,
  AttemptResult,
  HintPayload,
  ErrorType,
} from '../logic';
import { useStreakTracker } from './useStreakTracker';
import { suitesLogiquesLevels, getLevelByOrder, SuitesLogiquesLevel } from '../data/levels';

// ============================================
// TYPES
// ============================================

interface UseSuitesGameV2Props {
  theme: ThemeType;
  initialLevel?: number;
  playerId?: string;
}

interface UseSuitesGameV2Return {
  // Etat du jeu (compatible avec l'ancien format)
  gameState: GameState;
  sessionState: SessionState;
  currentSequence: Sequence | null;

  // Actions
  selectAnswer: (element: SequenceElement) => void;
  confirmAnswer: () => void;
  requestHint: () => void;
  nextSequence: (levelOverride?: number) => void;

  // Etat
  isSessionComplete: boolean;

  // Nouvelles donnees du moteur
  currentLevelInfo: SuitesLogiquesLevel | undefined;
  hintsRemaining: number;
  lastHint: HintPayload | null;
  lastErrorType: ErrorType | undefined;
  playerModel: PlayerModel | null;

  // Debug
  currentPuzzle: SequencePuzzle | null;
}

// ============================================
// HOOK PRINCIPAL
// ============================================

export function useSuitesGameV2({
  theme,
  initialLevel = 1,
  playerId = 'default',
}: UseSuitesGameV2Props): UseSuitesGameV2Return {
  // ============================================
  // STATE
  // ============================================

  // Etat du jeu (format legacy pour compatibilite UI)
  const [gameState, setGameState] = useState<GameState>({
    currentSequence: null,
    selectedAnswer: null,
    attempts: 0,
    hintsUsed: 0,
    currentHintLevel: 0,
    isComplete: false,
    status: 'idle',
  });

  // Etat de la session
  const [sessionState, setSessionState] = useState<SessionState>({
    sequencesCompleted: 0,
    sequencesCorrectFirstTry: 0,
    totalAttempts: 0,
    totalHints: 0,
    currentStreak: 0,
    maxStreak: 0,
    currentLevel: initialLevel,
    startTime: new Date(),
    theme,
  });

  // Player model (nouveau)
  const [playerModel, setPlayerModel] = useState<PlayerModel | null>(null);

  // Puzzle courant (nouveau format)
  const [currentPuzzle, setCurrentPuzzle] = useState<SequencePuzzle | null>(null);

  // Dernier hint affiche
  const [lastHint, setLastHint] = useState<HintPayload | null>(null);

  // Dernier type d'erreur (pour hints adaptes)
  const [lastErrorType, setLastErrorType] = useState<ErrorType | undefined>(undefined);

  // Temps de debut de la tentative courante
  const attemptStartTime = useRef<number>(Date.now());

  // Niveaux de hints utilises dans cette sequence
  const usedHintLevels = useRef<number[]>([]);

  // Controleur de difficulte
  const controller = useMemo(() => new DifficultyController(), []);

  // Tracker de series
  const { streak, incrementStreak, resetStreak } = useStreakTracker();

  // ============================================
  // DERIVED STATE
  // ============================================

  // Info niveau depuis levels.ts
  const currentLevelInfo = useMemo(() => {
    return getLevelByOrder(sessionState.currentLevel);
  }, [sessionState.currentLevel]);

  // Hints max pour ce niveau
  const maxHintsForLevel = currentLevelInfo?.hintsAvailable ?? 3;

  // Hints restants
  const hintsRemaining = maxHintsForLevel - gameState.hintsUsed;

  // Sequence au format legacy
  const currentSequence = useMemo(() => {
    if (!currentPuzzle) return null;
    return puzzleToSequence(currentPuzzle);
  }, [currentPuzzle]);

  // Session complete ?
  const isSessionComplete =
    sessionState.sequencesCompleted >= GAME_CONFIG.sequencesPerSession;

  // ============================================
  // EFFECTS
  // ============================================

  // Charger le player model au mount
  useEffect(() => {
    loadPlayerModel(playerId).then(model => {
      setPlayerModel(model);
    });
  }, [playerId]);

  // ============================================
  // ACTIONS
  // ============================================

  /**
   * Selectionner une reponse
   */
  const selectAnswer = useCallback(
    (element: SequenceElement) => {
      if (gameState.status === 'checking' || gameState.status === 'success') {
        return;
      }

      setGameState(prev => ({
        ...prev,
        selectedAnswer: element,
        status: 'selected',
      }));
    },
    [gameState.status]
  );

  /**
   * Confirmer la reponse
   */
  const confirmAnswer = useCallback(() => {
    const { selectedAnswer } = gameState;
    if (!selectedAnswer || !currentPuzzle) return;

    setGameState(prev => ({ ...prev, status: 'checking' }));

    // Valider avec le moteur
    const timeMs = Date.now() - attemptStartTime.current;
    const result = validateAnswer(
      currentPuzzle,
      selectedAnswer,
      timeMs,
      gameState.hintsUsed,
      usedHintLevels.current
    );

    setTimeout(() => {
      if (result.isCorrect) {
        // Succes !
        const wasFirstTry = gameState.attempts === 0;
        incrementStreak();

        setGameState(prev => ({
          ...prev,
          status: 'success',
          isComplete: true,
        }));

        setSessionState(prev => ({
          ...prev,
          sequencesCompleted: prev.sequencesCompleted + 1,
          sequencesCorrectFirstTry:
            prev.sequencesCorrectFirstTry + (wasFirstTry ? 1 : 0),
          totalAttempts: prev.totalAttempts + gameState.attempts + 1,
          currentStreak: streak + 1,
          maxStreak: Math.max(prev.maxStreak, streak + 1),
        }));

        // Mettre a jour le player model
        if (playerModel) {
          const updated = controller.updateModel(playerModel, result);
          setPlayerModel(updated);
          savePlayerModel(updated);
        }

        // Reset error type
        setLastErrorType(undefined);
      } else {
        // Erreur
        const newAttempts = gameState.attempts + 1;

        // Stocker le type d'erreur pour le prochain hint
        setLastErrorType(result.errorType);

        // Verifier si hint automatique
        const shouldShowHint = GAME_CONFIG.hintThresholds.includes(newAttempts);
        const newHintLevel = shouldShowHint
          ? Math.min(gameState.currentHintLevel + 1, 4)
          : gameState.currentHintLevel;

        // Max attempts atteint ?
        const hasReachedMaxAttempts = newAttempts >= GAME_CONFIG.maxAttempts;

        setGameState(prev => ({
          ...prev,
          attempts: newAttempts,
          selectedAnswer: null,
          status: (hasReachedMaxAttempts ? 'success' : 'error') as GameState['status'],
          currentHintLevel: (hasReachedMaxAttempts ? 4 : newHintLevel) as GameState['currentHintLevel'],
          isComplete: hasReachedMaxAttempts,
        }));

        if (hasReachedMaxAttempts) {
          // Compter comme echec
          resetStreak();
          setSessionState(prev => ({
            ...prev,
            sequencesCompleted: prev.sequencesCompleted + 1,
            totalAttempts: prev.totalAttempts + newAttempts,
            currentStreak: 0,
          }));

          // Mettre a jour le player model
          if (playerModel) {
            const updated = controller.updateModel(playerModel, result);
            setPlayerModel(updated);
            savePlayerModel(updated);
          }
        }
      }
    }, 300);
  }, [
    gameState,
    currentPuzzle,
    incrementStreak,
    resetStreak,
    streak,
    playerModel,
    controller,
  ]);

  /**
   * Demander un hint
   */
  const requestHint = useCallback(() => {
    if (gameState.hintsUsed >= maxHintsForLevel) return;
    if (gameState.currentHintLevel >= 3) return; // Max 3 niveaux Montessori
    if (!currentPuzzle) return;

    const nextLevel = (gameState.currentHintLevel + 1) as 1 | 2 | 3;

    // Obtenir le hint adapte
    const hint = getHint(currentPuzzle, nextLevel, lastErrorType);
    setLastHint(hint);

    // Tracker le niveau utilise
    usedHintLevels.current.push(nextLevel);

    setGameState(prev => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
      currentHintLevel: nextLevel,
      status: 'hint',
    }));

    setSessionState(prev => ({
      ...prev,
      totalHints: prev.totalHints + 1,
    }));

    // Retour a idle apres animation
    setTimeout(() => {
      setGameState(prev => ({ ...prev, status: 'idle' }));
    }, GAME_CONFIG.animationDurations.hint);
  }, [
    gameState.currentHintLevel,
    gameState.hintsUsed,
    maxHintsForLevel,
    currentPuzzle,
    lastErrorType,
  ]);

  /**
   * Passer a la sequence suivante
   */
  const nextSequence = useCallback(
    (levelOverride?: number) => {
      const levelToUse = levelOverride ?? sessionState.currentLevel;

      // Utiliser le controleur adaptatif si player model disponible
      let targetDifficulty = levelToUse;
      let family = undefined;

      if (playerModel) {
        const selection = controller.selectNextPuzzle(playerModel);
        targetDifficulty = selection.targetDifficulty;
        family = selection.family;
        console.log('[nextSequence] Adaptive selection:', selection);
      }

      // Generer le puzzle
      const puzzle = generatePuzzle({
        targetDifficulty,
        family,
        theme,
      });

      console.log('[nextSequence] Generated puzzle:', {
        pattern: puzzle.pattern.type,
        family: puzzle.family,
        difficulty: puzzle.difficulty,
        qualityScore: puzzle.qualityScore,
      });

      setCurrentPuzzle(puzzle);

      // Reset state
      setGameState({
        currentSequence: puzzleToSequence(puzzle),
        selectedAnswer: null,
        attempts: 0,
        hintsUsed: 0,
        currentHintLevel: 0,
        isComplete: false,
        status: 'idle',
      });

      setLastHint(null);
      setLastErrorType(undefined);
      attemptStartTime.current = Date.now();
      usedHintLevels.current = [];
    },
    [sessionState.currentLevel, playerModel, controller, theme]
  );

  // ============================================
  // RETURN
  // ============================================

  return {
    // Legacy compatible
    gameState,
    sessionState,
    currentSequence,

    // Actions
    selectAnswer,
    confirmAnswer,
    requestHint,
    nextSequence,

    // State
    isSessionComplete,

    // New engine data
    currentLevelInfo,
    hintsRemaining,
    lastHint,
    lastErrorType,
    playerModel,

    // Debug
    currentPuzzle,
  };
}
