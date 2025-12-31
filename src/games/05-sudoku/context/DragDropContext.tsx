/**
 * DragDropContext
 * Global context for managing drag & drop state in Sudoku game
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { SudokuValue } from '../types';

// ============================================
// TYPES
// ============================================

export type DragSourceType = 'selector' | 'cell';

export interface DragState {
  isDragging: boolean;
  symbol: SudokuValue;
  sourceType: DragSourceType | null;
  sourceCell: { row: number; col: number } | null;
  position: { x: number; y: number };
}

interface DragDropContextValue {
  dragState: DragState;
  startDrag: (
    symbol: SudokuValue,
    sourceType: DragSourceType,
    sourceCell: { row: number; col: number } | null,
    position: { x: number; y: number }
  ) => void;
  updateDragPosition: (position: { x: number; y: number }) => void;
  endDrag: () => void;
  dropTarget: { row: number; col: number } | null;
  setDropTarget: (target: { row: number; col: number } | null) => void;
}

// ============================================
// CONTEXT
// ============================================

const DragDropContext = createContext<DragDropContextValue | null>(null);

export function useDragDrop() {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
}

// ============================================
// PROVIDER
// ============================================

interface DragDropProviderProps {
  children: ReactNode;
}

const initialDragState: DragState = {
  isDragging: false,
  symbol: null,
  sourceType: null,
  sourceCell: null,
  position: { x: 0, y: 0 },
};

export function DragDropProvider({ children }: DragDropProviderProps) {
  const [dragState, setDragState] = useState<DragState>(initialDragState);
  const [dropTarget, setDropTarget] = useState<{ row: number; col: number } | null>(null);

  const startDrag = useCallback(
    (
      symbol: SudokuValue,
      sourceType: DragSourceType,
      sourceCell: { row: number; col: number } | null,
      position: { x: number; y: number }
    ) => {
      setDragState({
        isDragging: true,
        symbol,
        sourceType,
        sourceCell,
        position,
      });
    },
    []
  );

  const updateDragPosition = useCallback((position: { x: number; y: number }) => {
    setDragState((prev) => ({
      ...prev,
      position,
    }));
  }, []);

  const endDrag = useCallback(() => {
    setDragState(initialDragState);
    setDropTarget(null);
  }, []);

  return (
    <DragDropContext.Provider
      value={{
        dragState,
        startDrag,
        updateDragPosition,
        endDrag,
        dropTarget,
        setDropTarget,
      }}
    >
      {children}
    </DragDropContext.Provider>
  );
}
