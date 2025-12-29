/**
 * useMatricesGame - Main game hook for Matrices Magiques
 * Orchestrates puzzle generation, game state, hints, and scoring
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import {
  PuzzleConfig,
  WorldTheme,
  GameState,
  HintLevel,
  HintConfig,
  PixelMood,
  SessionState,
  PuzzleAttempt,
} from '../types';
import { PIXEL_DIALOGUES, WORLDS } from '../data';
import { checkAnswer, calculatePuzzleScore, getCorrectChoiceIndex } from '../logic/validator';
import { usePuzzleGenerator } from './usePuzzleGenerator';
import { useHintSystem } from './useHintSystem';

// ============================================================================
// TYPES
// ============================================================================

interface UseMatricesGameReturn {
  // Puzzle state
  puzzle: PuzzleConfig | null;
  puzzleIndex: number;
  totalPuzzles: number;

  // Selection state
  selectedChoice: number | null;
  correctChoiceIndex: number | null;
  incorrectChoiceIndex: number | null;

  // Game state
  gameState: GameState;
  attempts: number;
  maxAttempts: number;

  // Mascot state
  pixelMood: PixelMood;
  pixelMessage: string;

  // Hints
  hintsUsed: HintLevel[];
  hintsRemaining: number;
  currentHint: HintConfig | null;
  canRequestHint: boolean;

  // Session stats
  sessionScore: number;
  starsEarned: number;

  // Actions
  startGame: (worldId: WorldTheme, levelNumber?: number) => void;
  selectChoice: (index: number) => void;
  submitAnswer: () => void;
  requestHint: () => HintConfig | null;
  nextPuzzle: () => void;
  resetPuzzle: () => void;
  exitGame: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const MAX_ATTEMPTS = 3;
const FEEDBACK_DELAY = 1500;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getRandomDialogue(context: keyof typeof PIXEL_DIALOGUES): string {
  const dialogues = PIXEL_DIALOGUES[context];
  if (!dialogues || dialogues.length === 0) {
    return '';
  }
  return dialogues[Math.floor(Math.random() * dialogues.length)];
}

function getMoodForState(gameState: GameState, attempts: number): PixelMood {
  switch (gameState) {
    case 'correct':
      return 'celebrating';
    case 'incorrect':
      return attempts >= MAX_ATTEMPTS ? 'encouraging' : 'thinking';
    case 'revealing':
      return 'encouraging';
    case 'complete':
      return 'excited';
    default:
      return 'neutral';
  }
}

// ============================================================================
// HOOK
// ============================================================================

export function useMatricesGame(): UseMatricesGameReturn {
  // Core state
  const [worldId, setWorldId] = useState<WorldTheme | null>(null);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [correctChoiceIndex, setCorrectChoiceIndex] = useState<number | null>(null);
  const [incorrectChoiceIndex, setIncorrectChoiceIndex] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsedForPuzzle, setHintsUsedForPuzzle] = useState<HintLevel[]>([]);

  // Session stats
  const [sessionScore, setSessionScore] = useState(0);
  const [starsEarned, setStarsEarned] = useState(0);
  const [puzzleAttempts, setPuzzleAttempts] = useState<PuzzleAttempt[]>([]);

  // Mascot state
  const [pixelMood, setPixelMood] = useState<PixelMood>('neutral');
  const [pixelMessage, setPixelMessage] = useState('');

  // Use puzzle generator hook
  const {
    currentPuzzle: puzzle,
    currentIndex: puzzleIndex,
    totalPuzzles,
    generateNewSession,
    nextPuzzle: goToNextPuzzle,
    resetSession,
  } = usePuzzleGenerator();

  // Use hint system hook
  const {
    currentHint,
    canRequestHint,
    hintsRemaining,
    requestHint: requestHintFromSystem,
    resetHints,
    hintState,
  } = useHintSystem(puzzle);

  // Update mood when game state changes
  useEffect(() => {
    setPixelMood(getMoodForState(gameState, attempts));
  }, [gameState, attempts]);

  /**
   * Start a new game
   * @param newWorldId - The world to play
   * @param levelNumber - Optional level number (1-10) for difficulty
   */
  const startGame = useCallback((newWorldId: WorldTheme, levelNumber?: number) => {
    setWorldId(newWorldId);
    setGameState('playing');
    setSelectedChoice(null);
    setCorrectChoiceIndex(null);
    setIncorrectChoiceIndex(null);
    setAttempts(0);
    setHintsUsedForPuzzle([]);
    setSessionScore(0);
    setStarsEarned(0);
    setPuzzleAttempts([]);

    // Generate session with optional level number
    if (levelNumber !== undefined) {
      generateNewSession(newWorldId, { worldId: newWorldId, levelNumber });
    } else {
      generateNewSession(newWorldId);
    }

    // Set intro message
    setPixelMood('happy');
    setPixelMessage(getRandomDialogue('intro'));
  }, [generateNewSession]);

  /**
   * Select a choice
   */
  const selectChoice = useCallback((index: number) => {
    if (gameState !== 'playing') return;

    setSelectedChoice(index);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Clear previous incorrect highlight
    setIncorrectChoiceIndex(null);

    // Update mascot
    setPixelMood('curious');
  }, [gameState]);

  /**
   * Submit the selected answer
   */
  const submitAnswer = useCallback(() => {
    if (!puzzle || selectedChoice === null || gameState !== 'playing') return;

    setGameState('checking');
    const isCorrect = checkAnswer(puzzle, selectedChoice);

    if (isCorrect) {
      // Correct answer!
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setGameState('correct');
      setCorrectChoiceIndex(selectedChoice);
      setPixelMood('celebrating');
      setPixelMessage(getRandomDialogue('correct'));

      // Calculate and add score
      const puzzleScore = calculatePuzzleScore(
        puzzle.difficulty,
        attempts + 1,
        hintsUsedForPuzzle,
        30 // Default time
      );
      setSessionScore((prev) => prev + puzzleScore);

      // Record attempt
      const attempt: PuzzleAttempt = {
        puzzleId: puzzle.id,
        selectedChoiceIndex: selectedChoice,
        isCorrect: true,
        timestamp: Date.now(),
        hintsUsed: hintsUsedForPuzzle,
        attemptNumber: attempts + 1,
      };
      setPuzzleAttempts((prev) => [...prev, attempt]);

    } else {
      // Wrong answer
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setIncorrectChoiceIndex(selectedChoice);
      setSelectedChoice(null);

      // Record attempt
      const attempt: PuzzleAttempt = {
        puzzleId: puzzle.id,
        selectedChoiceIndex: selectedChoice,
        isCorrect: false,
        timestamp: Date.now(),
        hintsUsed: hintsUsedForPuzzle,
        attemptNumber: newAttempts,
      };
      setPuzzleAttempts((prev) => [...prev, attempt]);

      if (newAttempts >= MAX_ATTEMPTS) {
        // Max attempts reached - reveal solution
        setGameState('revealing');
        setCorrectChoiceIndex(getCorrectChoiceIndex(puzzle));
        setPixelMood('encouraging');
        setPixelMessage(getRandomDialogue('reveal'));
      } else {
        // Still have attempts
        setGameState('incorrect');
        setPixelMood('encouraging');
        setPixelMessage(getRandomDialogue('incorrect'));

        // Return to playing state after delay
        setTimeout(() => {
          setGameState('playing');
          setIncorrectChoiceIndex(null);
        }, FEEDBACK_DELAY);
      }
    }
  }, [puzzle, selectedChoice, gameState, attempts, hintsUsedForPuzzle]);

  /**
   * Request a hint
   */
  const requestHint = useCallback((): HintConfig | null => {
    const hint = requestHintFromSystem();

    if (hint) {
      setHintsUsedForPuzzle((prev) => [...prev, hint.level]);
      setPixelMood('thinking');
      setPixelMessage(hint.message);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    return hint;
  }, [requestHintFromSystem]);

  /**
   * Go to next puzzle
   */
  const nextPuzzle = useCallback(() => {
    const next = goToNextPuzzle();

    if (!next) {
      // Session complete!
      setGameState('complete');
      setPixelMood('excited');
      setPixelMessage(getRandomDialogue('world_complete'));

      // Calculate stars based on performance
      const avgAttempts = puzzleAttempts.length > 0
        ? puzzleAttempts.filter(a => a.isCorrect).length / totalPuzzles
        : 0;
      const totalHints = puzzleAttempts.reduce(
        (sum, a) => sum + a.hintsUsed.length, 0
      );

      if (totalHints === 0 && avgAttempts < 1.2) {
        setStarsEarned(3);
      } else if (totalHints < totalPuzzles && avgAttempts < 1.5) {
        setStarsEarned(2);
      } else {
        setStarsEarned(1);
      }

      return;
    }

    // Reset for new puzzle
    setGameState('playing');
    setSelectedChoice(null);
    setCorrectChoiceIndex(null);
    setIncorrectChoiceIndex(null);
    setAttempts(0);
    setHintsUsedForPuzzle([]);
    resetHints();

    setPixelMood('happy');
    setPixelMessage(getRandomDialogue('puzzle_start'));
  }, [goToNextPuzzle, puzzleAttempts, totalPuzzles, resetHints]);

  /**
   * Reset current puzzle
   */
  const resetPuzzle = useCallback(() => {
    setGameState('playing');
    setSelectedChoice(null);
    setCorrectChoiceIndex(null);
    setIncorrectChoiceIndex(null);
    // Note: we keep attempts and hints used (for fairness)

    setPixelMood('encouraging');
  }, []);

  /**
   * Exit the game
   */
  const exitGame = useCallback(() => {
    setGameState('idle');
    setWorldId(null);
    setSelectedChoice(null);
    setCorrectChoiceIndex(null);
    setIncorrectChoiceIndex(null);
    setAttempts(0);
    setHintsUsedForPuzzle([]);
    setSessionScore(0);
    setStarsEarned(0);
    setPuzzleAttempts([]);
    resetHints();
  }, [resetHints]);

  return {
    // Puzzle state
    puzzle,
    puzzleIndex,
    totalPuzzles,

    // Selection state
    selectedChoice,
    correctChoiceIndex,
    incorrectChoiceIndex,

    // Game state
    gameState,
    attempts,
    maxAttempts: MAX_ATTEMPTS,

    // Mascot state
    pixelMood,
    pixelMessage,

    // Hints
    hintsUsed: hintsUsedForPuzzle,
    hintsRemaining,
    currentHint,
    canRequestHint,

    // Session stats
    sessionScore,
    starsEarned,

    // Actions
    startGame,
    selectChoice,
    submitAnswer,
    requestHint,
    nextPuzzle,
    resetPuzzle,
    exitGame,
  };
}
