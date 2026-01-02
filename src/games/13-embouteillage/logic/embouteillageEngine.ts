/**
 * Embouteillage Engine
 * Logique pure du jeu Rush Hour / Embouteillage
 *
 * Fonctions de validation des mouvements et détection de victoire.
 * Ces fonctions sont pures (pas d'effets de bord) et testables unitairement.
 */

import type { Vehicle, EmbouteillageLevel } from '../types';

// ============================================
// TYPES
// ============================================

export interface MoveValidation {
  valid: boolean;
  reason?: 'out_of_bounds' | 'collision' | 'wrong_direction';
  maxDistance?: number;
}

export interface GridCell {
  occupied: boolean;
  vehicleId: string | null;
}

// ============================================
// CONSTANTES
// ============================================

export const GRID_SIZE = 6;
export const EXIT_ROW = 2; // Rangée de sortie (0-indexed)
export const EXIT_COL = 5; // Colonne de sortie

// ============================================
// CRÉATION DE LA GRILLE
// ============================================

/**
 * Crée une grille vide 6x6
 */
export function createEmptyGrid(): GridCell[][] {
  return Array(GRID_SIZE)
    .fill(null)
    .map(() =>
      Array(GRID_SIZE)
        .fill(null)
        .map(() => ({ occupied: false, vehicleId: null }))
    );
}

/**
 * Place les véhicules sur la grille
 */
export function placeVehiclesOnGrid(
  vehicles: Vehicle[]
): GridCell[][] {
  const grid = createEmptyGrid();

  for (const vehicle of vehicles) {
    const { row, col } = vehicle.position;
    const length = vehicle.length;

    for (let i = 0; i < length; i++) {
      const r = vehicle.orientation === 'vertical' ? row + i : row;
      const c = vehicle.orientation === 'horizontal' ? col + i : col;

      if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
        grid[r][c] = { occupied: true, vehicleId: vehicle.id };
      }
    }
  }

  return grid;
}

// ============================================
// VALIDATION DES MOUVEMENTS
// ============================================

/**
 * Vérifie si un véhicule peut se déplacer dans une direction
 */
export function canVehicleMove(
  vehicle: Vehicle,
  direction: 'up' | 'down' | 'left' | 'right',
  grid: GridCell[][]
): MoveValidation {
  // Vérifier si la direction est compatible avec l'orientation
  const isHorizontal = vehicle.orientation === 'horizontal';
  const isVertical = vehicle.orientation === 'vertical';

  if (isHorizontal && (direction === 'up' || direction === 'down')) {
    return { valid: false, reason: 'wrong_direction' };
  }
  if (isVertical && (direction === 'left' || direction === 'right')) {
    return { valid: false, reason: 'wrong_direction' };
  }

  // Calculer la distance maximale de déplacement
  const maxDistance = getMaxMoveDistance(vehicle, direction, grid);

  if (maxDistance === 0) {
    return { valid: false, reason: 'collision', maxDistance: 0 };
  }

  return { valid: true, maxDistance };
}

/**
 * Calcule la distance maximale de déplacement dans une direction
 */
export function getMaxMoveDistance(
  vehicle: Vehicle,
  direction: 'up' | 'down' | 'left' | 'right',
  grid: GridCell[][]
): number {
  const { row, col } = vehicle.position;
  const length = vehicle.length;
  let distance = 0;

  // Déterminer le point de départ et la direction de scan
  let checkRow = row;
  let checkCol = col;

  switch (direction) {
    case 'up':
      checkRow = row - 1;
      while (checkRow >= 0 && !grid[checkRow][col].occupied) {
        distance++;
        checkRow--;
      }
      break;

    case 'down':
      checkRow = row + length;
      while (checkRow < GRID_SIZE && !grid[checkRow][col].occupied) {
        distance++;
        checkRow++;
      }
      break;

    case 'left':
      checkCol = col - 1;
      while (checkCol >= 0 && !grid[row][checkCol].occupied) {
        distance++;
        checkCol--;
      }
      break;

    case 'right':
      checkCol = col + length;
      while (checkCol < GRID_SIZE && !grid[row][checkCol].occupied) {
        distance++;
        checkCol++;
      }
      break;
  }

  return distance;
}

/**
 * Déplace un véhicule dans une direction
 */
export function moveVehicle(
  vehicle: Vehicle,
  direction: 'up' | 'down' | 'left' | 'right',
  distance: number = 1
): Vehicle {
  const { row, col } = vehicle.position;

  let newRow = row;
  let newCol = col;

  switch (direction) {
    case 'up':
      newRow = row - distance;
      break;
    case 'down':
      newRow = row + distance;
      break;
    case 'left':
      newCol = col - distance;
      break;
    case 'right':
      newCol = col + distance;
      break;
  }

  return {
    ...vehicle,
    position: { row: newRow, col: newCol },
  };
}

// ============================================
// DÉTECTION DE VICTOIRE
// ============================================

/**
 * Vérifie si la voiture rouge peut sortir (victoire)
 */
export function checkVictory(vehicles: Vehicle[]): boolean {
  const redCar = vehicles.find((v) => v.isTarget);
  if (!redCar) return false;

  // La voiture rouge doit être sur la rangée de sortie
  if (redCar.position.row !== EXIT_ROW) return false;

  // Et sa position + longueur doit atteindre ou dépasser la sortie
  return redCar.position.col + redCar.length > EXIT_COL;
}

/**
 * Vérifie si le chemin vers la sortie est libre
 */
export function isPathToExitClear(
  vehicles: Vehicle[],
  grid: GridCell[][]
): boolean {
  const redCar = vehicles.find((v) => v.isTarget);
  if (!redCar) return false;

  // Vérifier toutes les cases entre la voiture rouge et la sortie
  const startCol = redCar.position.col + redCar.length;
  for (let col = startCol; col < GRID_SIZE; col++) {
    if (grid[EXIT_ROW][col].occupied) {
      return false;
    }
  }

  return true;
}

// ============================================
// UTILITAIRES
// ============================================

/**
 * Clone un tableau de véhicules (deep copy)
 */
export function cloneVehicles(vehicles: Vehicle[]): Vehicle[] {
  return vehicles.map((v) => ({
    ...v,
    position: { ...v.position },
  }));
}

/**
 * Calcule le nombre minimum de coups pour résoudre un niveau
 * (Placeholder - implémentation réelle nécessiterait BFS/A*)
 */
export function calculateOptimalMoves(level: EmbouteillageLevel): number {
  return level.optimalMoves ?? 10;
}

/**
 * Calcule le score basé sur les mouvements
 */
export function calculateScore(
  moves: number,
  optimalMoves: number,
  hintsUsed: number
): { score: number; stars: 1 | 2 | 3 } {
  const ratio = optimalMoves / moves;
  const hintPenalty = hintsUsed * 0.1;

  let stars: 1 | 2 | 3;
  if (ratio >= 0.9 - hintPenalty) {
    stars = 3;
  } else if (ratio >= 0.6 - hintPenalty) {
    stars = 2;
  } else {
    stars = 1;
  }

  const score = Math.round(1000 * ratio * (1 - hintPenalty * 0.5));

  return { score: Math.max(100, score), stars };
}

export default {
  createEmptyGrid,
  placeVehiclesOnGrid,
  canVehicleMove,
  getMaxMoveDistance,
  moveVehicle,
  checkVictory,
  isPathToExitClear,
  cloneVehicles,
  calculateOptimalMoves,
  calculateScore,
  GRID_SIZE,
  EXIT_ROW,
  EXIT_COL,
};
