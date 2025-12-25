/**
 * Main Calcul Posé game hook
 * Orchestrates game state, drawing recognition, and interactions
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics';

import { useStore } from '@/store/useStore';
import type { CalculPoseGameState, CalculPoseLevelConfig, DrawingPath } from '../types';
import {
  createInitialState,
  updateCellValue,
  moveToNextCell,
  checkVictory,
  isComplete,
  clearDrawing,
  getCorrectCount,
  getTotalDigits,
  generateProblem,
  createCells,
} from '../logic/calculEngine';
import {
  initializeRecognition,
  recognizeDigit,
} from '../logic/digitRecognition';
import { getDefaultLevel, getLevel } from '../data/levels';
import { calculPoseScripts } from '../data/assistantScripts';

interface UseCalculPoseGameOptions {
  levelId?: string;
  onVictory?: () => void;
}

export function useCalculPoseGame(options: UseCalculPoseGameOptions = {}) {
  const { levelId, onVictory } = options;

  const level = levelId ? getLevel(levelId) : getDefaultLevel();
  if (!level) throw new Error(`Level not found: ${levelId}`);

  const [gameState, setGameState] = useState<CalculPoseGameState>(() =>
    createInitialState(level)
  );
  const [problemIndex, setProblemIndex] = useState(0);
  const [isVictory, setIsVictory] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognitionReady, setRecognitionReady] = useState(false);

  const {
    hapticEnabled,
    showMessage,
    queueMessage,
    startSession,
    incrementMoves,
    recordInvalidMove,
    setStatus,
    endSession,
    recordCompletion,
  } = useStore();

  const hasShownWelcome = useRef(false);
  const canvasSize = useRef({ width: 200, height: 200 });

  // Initialize recognition on mount
  useEffect(() => {
    initializeRecognition().then(ready => {
      setRecognitionReady(ready);
    });
  }, []);

  // Start game session
  useEffect(() => {
    startSession('calcul-pose', level.id, gameState);

    if (!hasShownWelcome.current) {
      hasShownWelcome.current = true;
      const welcomeScript = calculPoseScripts.find(s => s.id === 'calcul_pose_intro');
      if (welcomeScript && welcomeScript.messages[0]) {
        showMessage({
          ...welcomeScript.messages[0],
          triggerType: 'game_start',
        });
      }
    }
  }, [level.id]);

  const reset = useCallback(() => {
    setGameState(createInitialState(level));
    setProblemIndex(0);
    setIsVictory(false);
    hasShownWelcome.current = false;
    startSession('calcul-pose', level.id, createInitialState(level));
  }, [level, startSession]);

  const selectCell = useCallback((cellId: string) => {
    setGameState(state => ({
      ...state,
      currentCellId: cellId,
      drawingPaths: [],
      recognizedDigit: null,
    }));
  }, []);

  const handleDrawingComplete = useCallback(
    async (paths: DrawingPath[]) => {
      if (!gameState.currentCellId || paths.length === 0) return;

      setIsRecognizing(true);
      setGameState(state => ({
        ...state,
        drawingPaths: paths,
      }));

      try {
        const result = await recognizeDigit(
          paths,
          canvasSize.current.width,
          canvasSize.current.height
        );

        if (result.digit >= 0 && result.confidence > 0.3) {
          setGameState(state => ({
            ...state,
            recognizedDigit: result.digit,
          }));

          // Auto-submit after short delay
          setTimeout(() => {
            submitDigit(result.digit);
          }, 500);
        }
      } catch (error) {
        console.error('Recognition error:', error);
      } finally {
        setIsRecognizing(false);
      }
    },
    [gameState.currentCellId]
  );

  const submitDigit = useCallback(
    (digit: number) => {
      if (!gameState.currentCellId || isVictory) return;

      const currentCell = gameState.cells.find(
        c => c.id === gameState.currentCellId
      );
      if (!currentCell || !currentCell.isEditable) return;

      const isCorrect = digit === currentCell.expectedValue;

      // Update cell
      let newState = updateCellValue(gameState, gameState.currentCellId, digit);

      incrementMoves();

      if (isCorrect) {
        if (hapticEnabled) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        const correctScript = calculPoseScripts.find(
          s => s.id === 'calcul_pose_correct'
        );
        if (correctScript && correctScript.messages[0]) {
          queueMessage({
            ...correctScript.messages[0],
            triggerType: 'good_progress',
          });
        }

        // Check if this problem is complete
        if (checkVictory(newState)) {
          // Check if more problems in level
          if (problemIndex < level.problemCount - 1) {
            // Next problem
            setTimeout(() => {
              const newProblem = generateProblem(level);
              const newCells = createCells(newProblem);
              const firstEditable = newCells.find(c => c.isEditable);

              setGameState({
                problem: newProblem,
                cells: newCells,
                currentCellId: firstEditable?.id ?? null,
                drawingPaths: [],
                recognizedDigit: null,
                carry: [],
              });
              setProblemIndex(prev => prev + 1);
            }, 1000);
          } else {
            // Level complete!
            setIsVictory(true);
            setStatus('victory');

            if (hapticEnabled) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }

            const victoryScript = calculPoseScripts.find(
              s => s.id === 'calcul_pose_victory'
            );
            if (victoryScript && victoryScript.messages[0]) {
              queueMessage({
                ...victoryScript.messages[0],
                triggerType: 'victory',
              });
            }

            const session = endSession();
            if (session) {
              recordCompletion(session);
            }

            onVictory?.();
          }
        } else {
          // Move to next cell
          newState = moveToNextCell(newState);
        }
      } else {
        if (hapticEnabled) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }

        recordInvalidMove();

        const incorrectScript = calculPoseScripts.find(
          s => s.id === 'calcul_pose_incorrect'
        );
        if (incorrectScript && incorrectScript.messages[0]) {
          queueMessage({
            ...incorrectScript.messages[0],
            triggerType: 'invalid_move',
          });
        }

        // Clear drawing after wrong answer
        newState = clearDrawing(newState);
      }

      setGameState(newState);
    },
    [
      gameState,
      isVictory,
      level,
      problemIndex,
      hapticEnabled,
      incrementMoves,
      recordInvalidMove,
      queueMessage,
      setStatus,
      endSession,
      recordCompletion,
      onVictory,
    ]
  );

  const clearCurrentDrawing = useCallback(() => {
    setGameState(state => clearDrawing(state));
  }, []);

  const setCanvasSize = useCallback((width: number, height: number) => {
    canvasSize.current = { width, height };
  }, []);

  return {
    gameState,
    level,
    problemIndex,
    totalProblems: level.problemCount,
    isVictory,
    isRecognizing,
    recognitionReady,
    correctCount: getCorrectCount(gameState),
    totalDigits: getTotalDigits(gameState),
    selectCell,
    handleDrawingComplete,
    submitDigit,
    clearCurrentDrawing,
    setCanvasSize,
    reset,
  };
}
