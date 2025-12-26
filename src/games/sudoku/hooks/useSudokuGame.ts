/**
 * useSudokuGame Hook
 * Main game logic and state management for Sudoku
 */

import { useState, useCallback, useEffect } from 'react';
import type {
  SudokuState,
  SudokuConfig,
  SudokuGrid,
  SudokuValue,
  GameStats,
} from '../types';
import { generateSudoku, getPreMadeGrid } from '../logic/generator';
import {
  validatePlacement,
  isGridComplete,
  markConflicts,
  findEasiestEmptyCell,
} from '../logic/validation';

interface UseSudokuGameProps {
  config: SudokuConfig;
  onComplete?: (stats: GameStats) => void;
}

export function useSudokuGame({ config, onComplete }: UseSudokuGameProps) {
  const [gameState, setGameState] = useState<SudokuState>(() =>
    initializeGame(config)
  );
  const [selectedSymbol, setSelectedSymbol] = useState<SudokuValue>(null);
  const [errorCount, setErrorCount] = useState(0);

  // Check for completion
  useEffect(() => {
    if (isGridComplete(gameState.grid)) {
      setGameState((prev) => ({ ...prev, isComplete: true }));

      const stats: GameStats = {
        activityId: 'sudoku',
        difficulty: gameState.difficulty,
        size: gameState.grid.size,
        completed: true,
        hintsUsed: gameState.hintsUsed,
        duration: Date.now() - gameState.startTime.getTime(),
        errorsCount: errorCount,
        timestamp: new Date(),
      };

      onComplete?.(stats);
    }
  }, [gameState.grid, gameState.difficulty, gameState.hintsUsed, errorCount, onComplete, gameState.startTime]);

  const handleCellPress = useCallback(
    (row: number, col: number) => {
      const cell = gameState.grid.cells[row][col];

      // Cannot select fixed cells
      if (cell.isFixed) return;

      setGameState((prev) => ({
        ...prev,
        selectedCell: { row, col },
      }));
    },
    [gameState.grid.cells]
  );

  const handleSymbolSelect = useCallback(
    (symbol: SudokuValue) => {
      if (!gameState.selectedCell) return;

      const { row, col } = gameState.selectedCell;
      const cell = gameState.grid.cells[row][col];

      // Cannot modify fixed cells
      if (cell.isFixed) return;

      // Validate the placement
      const validation = validatePlacement(gameState.grid, row, col, symbol);

      if (!validation.valid && config.showConflicts) {
        // Invalid placement - increment error count
        setErrorCount((prev) => prev + 1);
      }

      // Update grid with new value
      setGameState((prev) => {
        const newGrid: SudokuGrid = {
          ...prev.grid,
          cells: prev.grid.cells.map((rowCells, r) =>
            rowCells.map((c, col_) => {
              if (r === row && col_ === col) {
                return { ...c, value: symbol };
              }
              return { ...c };
            })
          ),
        };

        // Mark conflicts if enabled
        const gridWithConflicts = config.showConflicts
          ? markConflicts(newGrid)
          : newGrid;

        // Add to history for undo
        return {
          ...prev,
          grid: gridWithConflicts,
          history: [...prev.history, prev.grid],
        };
      });

      setSelectedSymbol(symbol);
    },
    [gameState.selectedCell, gameState.grid, config.showConflicts]
  );

  const handleClearCell = useCallback(() => {
    if (!gameState.selectedCell) return;

    const { row, col } = gameState.selectedCell;
    const cell = gameState.grid.cells[row][col];

    if (cell.isFixed) return;

    handleSymbolSelect(null);
  }, [gameState.selectedCell, gameState.grid.cells, handleSymbolSelect]);

  const handleUndo = useCallback(() => {
    if (gameState.history.length === 0) return;

    setGameState((prev) => {
      const newHistory = [...prev.history];
      const previousGrid = newHistory.pop()!;

      return {
        ...prev,
        grid: previousGrid,
        history: newHistory,
      };
    });
  }, [gameState.history]);

  const handleHint = useCallback(() => {
    const easiestCell = findEasiestEmptyCell(gameState.grid);

    if (!easiestCell) return null;

    setGameState((prev) => ({
      ...prev,
      selectedCell: { row: easiestCell.row, col: easiestCell.col },
      hintsUsed: prev.hintsUsed + 1,
    }));

    // Return hint information for display
    return {
      row: easiestCell.row,
      col: easiestCell.col,
      possibilities: easiestCell.possibilities,
      suggestedValue: gameState.grid.solution[easiestCell.row][easiestCell.col],
    };
  }, [gameState.grid]);

  const handleReset = useCallback(() => {
    setGameState(initializeGame(config));
    setSelectedSymbol(null);
    setErrorCount(0);
  }, [config]);

  const handleVerify = useCallback(() => {
    const gridWithConflicts = markConflicts(gameState.grid);
    setGameState((prev) => ({
      ...prev,
      grid: gridWithConflicts,
    }));

    return isGridComplete(gridWithConflicts);
  }, [gameState.grid]);

  return {
    gameState,
    selectedSymbol,
    errorCount,
    handleCellPress,
    handleSymbolSelect,
    handleClearCell,
    handleUndo,
    handleHint,
    handleReset,
    handleVerify,
  };
}

function initializeGame(config: SudokuConfig): SudokuState {
  // Use pre-made grid for tutorials, generate for others
  const grid =
    config.size === 4 && config.difficulty === 1
      ? getPreMadeGrid(config.theme)
      : generateSudoku(config);

  return {
    grid,
    selectedCell: null,
    history: [],
    hintsUsed: 0,
    startTime: new Date(),
    isComplete: false,
    difficulty: config.difficulty,
  };
}
