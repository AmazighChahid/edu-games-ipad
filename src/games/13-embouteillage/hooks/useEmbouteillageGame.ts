/**
 * useEmbouteillageGame - Hook de logique de jeu pure
 *
 * Gère toute la mécanique du jeu Rush Hour :
 * - État des véhicules et leurs positions
 * - Validation des mouvements
 * - Détection de victoire
 * - Historique des coups pour undo
 *
 * @see docs/GAME_ARCHITECTURE.md pour le pattern complet
 */

import { useState, useCallback, useMemo } from 'react';
import type {
  Vehicle,
  EmbouteillageLevel,
  EmbouteillageGameState,
  EmbouteillageSessionState,
  EmbouteillageMoveRecord,
  MoveValidation,
} from '../types';
import { embouteillageLevels, getLevelByOrder, cloneVehicles } from '../data/levels';

// ============================================
// CONFIGURATION DU JEU
// ============================================

const GAME_CONFIG = {
  puzzlesPerSession: 8,
  gridSize: 6,
  animationDurations: {
    vehicleMove: 200,
    success: 500,
    error: 300,
    hint: 400,
    victory: 1000,
  },
};

// ============================================
// TYPES
// ============================================

interface UseEmbouteillageGameProps {
  initialLevel?: number;
}

interface UseEmbouteillageGameReturn {
  // État du jeu
  gameState: EmbouteillageGameState;
  sessionState: EmbouteillageSessionState;
  currentLevel: EmbouteillageLevel | null;

  // Actions
  moveVehicle: (vehicleId: string, direction: 'up' | 'down' | 'left' | 'right', distance?: number) => boolean;
  selectVehicle: (vehicle: Vehicle | null) => void;
  undoLastMove: () => void;
  resetPuzzle: () => void;
  loadLevel: (levelNumber: number) => void;
  requestHint: () => void;

  // Validations
  canMove: (vehicleId: string, direction: 'up' | 'down' | 'left' | 'right') => MoveValidation;
  getMaxMoveDistance: (vehicleId: string, direction: 'up' | 'down' | 'left' | 'right') => number;

  // État dérivé
  isVictory: boolean;
  isSessionComplete: boolean;
  currentLevelInfo: EmbouteillageLevel | undefined;
  hintsRemaining: number;
}

// ============================================
// HOOK PRINCIPAL
// ============================================

export function useEmbouteillageGame({
  initialLevel = 1,
}: UseEmbouteillageGameProps = {}): UseEmbouteillageGameReturn {
  // État du niveau actuel
  const [currentLevel, setCurrentLevel] = useState<EmbouteillageLevel | null>(() => {
    const level = getLevelByOrder(initialLevel);
    return level || null;
  });

  // État du jeu
  const [gameState, setGameState] = useState<EmbouteillageGameState>(() => ({
    currentSequence: 0,
    vehicles: currentLevel ? cloneVehicles(currentLevel.vehicles) : [],
    selectedVehicle: null,
    moves: [],
    moveCount: 0,
    hintsUsed: 0,
    currentHintLevel: 0,
    status: 'idle',
    isComplete: false,
    startTime: null,
    elapsedTime: 0,
  }));

  // État de la session
  const [sessionState, setSessionState] = useState<EmbouteillageSessionState>({
    puzzlesCompleted: 0,
    puzzlesCorrectFirstTry: 0,
    totalMoves: 0,
    totalHints: 0,
    currentStreak: 0,
    maxStreak: 0,
    currentLevel: initialLevel,
    startTime: new Date(),
  });

  // Info du niveau actuel
  const currentLevelInfo = useMemo(() => {
    return getLevelByOrder(sessionState.currentLevel);
  }, [sessionState.currentLevel]);

  // Nombre d'indices disponibles
  const hintsRemaining = currentLevelInfo
    ? currentLevelInfo.hintsAvailable - gameState.hintsUsed
    : 0;

  // Session complète ?
  const isSessionComplete = sessionState.puzzlesCompleted >= GAME_CONFIG.puzzlesPerSession;

  // Victoire ?
  const isVictory = gameState.status === 'victory';

  // ============================================
  // HELPERS - Calcul de grille
  // ============================================

  /**
   * Crée une grille 6x6 avec les positions des véhicules
   */
  const buildGrid = useCallback((vehicles: Vehicle[]): (string | null)[][] => {
    const grid: (string | null)[][] = Array(6).fill(null).map(() => Array(6).fill(null));

    for (const vehicle of vehicles) {
      for (let i = 0; i < vehicle.length; i++) {
        const row = vehicle.orientation === 'vertical' ? vehicle.row + i : vehicle.row;
        const col = vehicle.orientation === 'horizontal' ? vehicle.col + i : vehicle.col;
        if (row >= 0 && row < 6 && col >= 0 && col < 6) {
          grid[row][col] = vehicle.id;
        }
      }
    }

    return grid;
  }, []);

  /**
   * Vérifie si une case est libre
   */
  const isCellFree = useCallback((grid: (string | null)[][], row: number, col: number, excludeId?: string): boolean => {
    if (row < 0 || row >= 6 || col < 0 || col >= 6) return false;
    const cell = grid[row][col];
    return cell === null || cell === excludeId;
  }, []);

  // ============================================
  // VALIDATION DES MOUVEMENTS
  // ============================================

  /**
   * Vérifie si un véhicule peut bouger dans une direction
   */
  const canMove = useCallback((vehicleId: string, direction: 'up' | 'down' | 'left' | 'right'): MoveValidation => {
    const vehicle = gameState.vehicles.find(v => v.id === vehicleId);
    if (!vehicle) {
      return { valid: false, reason: 'blocked' };
    }

    // Vérifier que la direction correspond à l'orientation
    const isHorizontal = vehicle.orientation === 'horizontal';
    const isVertical = vehicle.orientation === 'vertical';

    if ((isHorizontal && (direction === 'up' || direction === 'down')) ||
        (isVertical && (direction === 'left' || direction === 'right'))) {
      return { valid: false, reason: 'wrong_direction' };
    }

    const grid = buildGrid(gameState.vehicles);
    let maxDistance = 0;

    // Calculer la distance maximale possible
    if (direction === 'left') {
      for (let d = 1; d <= vehicle.col; d++) {
        if (isCellFree(grid, vehicle.row, vehicle.col - d, vehicle.id)) {
          maxDistance = d;
        } else break;
      }
    } else if (direction === 'right') {
      const endCol = vehicle.col + vehicle.length - 1;
      for (let d = 1; d < 6 - endCol; d++) {
        if (isCellFree(grid, vehicle.row, endCol + d, vehicle.id)) {
          maxDistance = d;
        } else break;
      }
    } else if (direction === 'up') {
      for (let d = 1; d <= vehicle.row; d++) {
        if (isCellFree(grid, vehicle.row - d, vehicle.col, vehicle.id)) {
          maxDistance = d;
        } else break;
      }
    } else if (direction === 'down') {
      const endRow = vehicle.row + vehicle.length - 1;
      for (let d = 1; d < 6 - endRow; d++) {
        if (isCellFree(grid, endRow + d, vehicle.col, vehicle.id)) {
          maxDistance = d;
        } else break;
      }
    }

    return {
      valid: maxDistance > 0,
      maxDistance,
      reason: maxDistance === 0 ? 'blocked' : undefined,
    };
  }, [gameState.vehicles, buildGrid, isCellFree]);

  /**
   * Retourne la distance maximale de déplacement
   */
  const getMaxMoveDistance = useCallback((vehicleId: string, direction: 'up' | 'down' | 'left' | 'right'): number => {
    const validation = canMove(vehicleId, direction);
    return validation.maxDistance || 0;
  }, [canMove]);

  // ============================================
  // DÉTECTION DE VICTOIRE
  // ============================================

  /**
   * Vérifie si la voiture rouge a atteint la sortie
   */
  const checkVictory = useCallback((vehicles: Vehicle[]): boolean => {
    if (!currentLevel) return false;

    const targetVehicle = vehicles.find(v => v.isTarget);
    if (!targetVehicle) return false;

    // La voiture rouge (horizontale) doit atteindre la colonne 4 (pour que sa fin soit en 5)
    // Car elle fait 2 cases de long, si col = 4, elle occupe 4 et 5
    return targetVehicle.col + targetVehicle.length > currentLevel.exitCol;
  }, [currentLevel]);

  // ============================================
  // ACTIONS
  // ============================================

  /**
   * Déplace un véhicule
   */
  const moveVehicle = useCallback((
    vehicleId: string,
    direction: 'up' | 'down' | 'left' | 'right',
    distance: number = 1
  ): boolean => {
    const validation = canMove(vehicleId, direction);
    if (!validation.valid) {
      setGameState(prev => ({ ...prev, status: 'error' }));
      setTimeout(() => {
        setGameState(prev => ({ ...prev, status: 'idle' }));
      }, GAME_CONFIG.animationDurations.error);
      return false;
    }

    // Limiter la distance au maximum possible
    const actualDistance = Math.min(distance, validation.maxDistance || 1);

    setGameState(prev => {
      const vehicle = prev.vehicles.find(v => v.id === vehicleId);
      if (!vehicle) return prev;

      // Calculer la nouvelle position
      let newRow = vehicle.row;
      let newCol = vehicle.col;

      switch (direction) {
        case 'up': newRow -= actualDistance; break;
        case 'down': newRow += actualDistance; break;
        case 'left': newCol -= actualDistance; break;
        case 'right': newCol += actualDistance; break;
      }

      // Créer l'enregistrement du mouvement
      const moveRecord: EmbouteillageMoveRecord = {
        vehicleId,
        fromRow: vehicle.row,
        fromCol: vehicle.col,
        toRow: newRow,
        toCol: newCol,
        direction,
        timestamp: Date.now(),
      };

      // Mettre à jour le véhicule
      const updatedVehicles = prev.vehicles.map(v =>
        v.id === vehicleId ? { ...v, row: newRow, col: newCol } : v
      );

      // Démarrer le timer si c'est le premier mouvement
      const startTime = prev.startTime || Date.now();

      // Vérifier la victoire
      const victory = checkVictory(updatedVehicles);

      return {
        ...prev,
        vehicles: updatedVehicles,
        moves: [...prev.moves, moveRecord],
        moveCount: prev.moveCount + 1,
        status: victory ? 'victory' : 'moving',
        isComplete: victory,
        startTime,
      };
    });

    // Après l'animation, revenir à idle
    setTimeout(() => {
      setGameState(prev => {
        if (prev.status === 'moving') {
          return { ...prev, status: 'idle' };
        }
        return prev;
      });
    }, GAME_CONFIG.animationDurations.vehicleMove);

    return true;
  }, [canMove, checkVictory]);

  /**
   * Sélectionne un véhicule
   */
  const selectVehicle = useCallback((vehicle: Vehicle | null) => {
    setGameState(prev => ({
      ...prev,
      selectedVehicle: vehicle,
      status: vehicle ? 'idle' : prev.status,
    }));
  }, []);

  /**
   * Annule le dernier mouvement
   */
  const undoLastMove = useCallback(() => {
    setGameState(prev => {
      if (prev.moves.length === 0) return prev;

      const lastMove = prev.moves[prev.moves.length - 1];
      const updatedVehicles = prev.vehicles.map(v =>
        v.id === lastMove.vehicleId
          ? { ...v, row: lastMove.fromRow, col: lastMove.fromCol }
          : v
      );

      return {
        ...prev,
        vehicles: updatedVehicles,
        moves: prev.moves.slice(0, -1),
        moveCount: Math.max(0, prev.moveCount - 1),
        status: 'idle',
        isComplete: false,
      };
    });
  }, []);

  /**
   * Réinitialise le puzzle actuel
   */
  const resetPuzzle = useCallback(() => {
    if (!currentLevel) return;

    setGameState({
      currentSequence: gameState.currentSequence,
      vehicles: cloneVehicles(currentLevel.vehicles),
      selectedVehicle: null,
      moves: [],
      moveCount: 0,
      hintsUsed: 0,
      currentHintLevel: 0,
      status: 'idle',
      isComplete: false,
      startTime: null,
      elapsedTime: 0,
    });
  }, [currentLevel, gameState.currentSequence]);

  /**
   * Charge un niveau
   */
  const loadLevel = useCallback((levelNumber: number) => {
    const level = getLevelByOrder(levelNumber);
    if (!level) return;

    setCurrentLevel(level);
    setGameState({
      currentSequence: 0,
      vehicles: cloneVehicles(level.vehicles),
      selectedVehicle: null,
      moves: [],
      moveCount: 0,
      hintsUsed: 0,
      currentHintLevel: 0,
      status: 'idle',
      isComplete: false,
      startTime: null,
      elapsedTime: 0,
    });

    setSessionState(prev => ({
      ...prev,
      currentLevel: levelNumber,
    }));
  }, []);

  /**
   * Demande un indice
   */
  const requestHint = useCallback(() => {
    if (hintsRemaining <= 0) return;
    if (gameState.currentHintLevel >= 3) return;

    setGameState(prev => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
      currentHintLevel: Math.min(prev.currentHintLevel + 1, 3) as 0 | 1 | 2 | 3,
      status: 'hint',
    }));

    setSessionState(prev => ({
      ...prev,
      totalHints: prev.totalHints + 1,
    }));

    // Retour à idle après l'animation
    setTimeout(() => {
      setGameState(prev => ({ ...prev, status: 'idle' }));
    }, GAME_CONFIG.animationDurations.hint);
  }, [hintsRemaining, gameState.currentHintLevel]);

  // ============================================
  // RETURN
  // ============================================

  return {
    // État
    gameState,
    sessionState,
    currentLevel,

    // Actions
    moveVehicle,
    selectVehicle,
    undoLastMove,
    resetPuzzle,
    loadLevel,
    requestHint,

    // Validations
    canMove,
    getMaxMoveDistance,

    // État dérivé
    isVictory,
    isSessionComplete,
    currentLevelInfo,
    hintsRemaining,
  };
}

export default useEmbouteillageGame;
