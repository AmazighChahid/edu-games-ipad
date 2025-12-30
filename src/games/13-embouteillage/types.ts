/**
 * Embouteillage - Type definitions
 * Rush Hour-style puzzle game
 *
 * Le but du jeu est de libérer la voiture rouge (target) en faisant
 * glisser les autres véhicules sur une grille 6x6.
 */

// ============================================
// TYPES DE BASE
// ============================================

export type VehicleOrientation = 'horizontal' | 'vertical';
export type VehicleType = 'car' | 'truck';

export interface Vehicle {
  id: string;
  type: VehicleType;
  orientation: VehicleOrientation;
  length: 2 | 3; // Cars are 2, trucks are 3
  row: number;
  col: number;
  isTarget: boolean; // The red car that needs to escape
  color: string;
  label?: string; // For accessibility
}

// ============================================
// NIVEAU
// ============================================

export interface EmbouteillageLevel {
  id: string;
  gameId: 'embouteillage';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  displayOrder: number;
  targetAge: number;
  estimatedMinutes: number;
  name: string;
  description: string;
  gridSize: 6; // Standard Rush Hour grid is 6x6
  vehicles: Vehicle[];
  exitRow: number; // Row where the target car needs to reach (usually 2 for classic)
  exitCol: number; // Column of the exit (usually 5 for right edge)
  minMoves: number; // Optimal solution move count
  hintsAvailable: number;
}

// ============================================
// ENREGISTREMENT DE MOUVEMENT
// ============================================

export interface EmbouteillageMoveRecord {
  vehicleId: string;
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  direction: 'up' | 'down' | 'left' | 'right';
  timestamp: number;
}

// ============================================
// ÉTAT DU JEU
// ============================================

export type GameStatus = 'idle' | 'dragging' | 'moving' | 'success' | 'error' | 'hint' | 'victory';

export interface EmbouteillageGameState {
  currentSequence: number; // For compatibility with GameIntroTemplate
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  moves: EmbouteillageMoveRecord[];
  moveCount: number;
  hintsUsed: number;
  currentHintLevel: 0 | 1 | 2 | 3;
  status: GameStatus;
  isComplete: boolean;
  startTime: number | null;
  elapsedTime: number;
}

export interface EmbouteillageSessionState {
  puzzlesCompleted: number;
  puzzlesCorrectFirstTry: number;
  totalMoves: number;
  totalHints: number;
  currentStreak: number;
  maxStreak: number;
  currentLevel: number;
  startTime: Date;
}

// ============================================
// PROGRESSION
// ============================================

export interface EmbouteillageProgress {
  levelId: string;
  completed: boolean;
  bestMoves: number | null;
  bestTime: number | null;
  attempts: number;
  stars: 0 | 1 | 2 | 3;
  lastPlayed: number;
}

// ============================================
// VALIDATION DE MOUVEMENT
// ============================================

export interface MoveValidation {
  valid: boolean;
  reason?: 'blocked' | 'out_of_bounds' | 'wrong_direction';
  maxDistance?: number; // Maximum cells the vehicle can move
}

// ============================================
// INDICE
// ============================================

export interface HintData {
  vehicleId: string;
  direction: 'up' | 'down' | 'left' | 'right';
  distance: number;
  message: string;
}

// ============================================
// CONFIGURATION
// ============================================

export interface EmbouteillageConfig {
  puzzlesPerSession: number;
  maxHints: number;
  animationDurations: {
    vehicleMove: number;
    success: number;
    error: number;
    hint: number;
    victory: number;
  };
  gridCellSize: number;
  vehicleColors: Record<string, string>;
}

// ============================================
// STATISTIQUES DE SESSION
// ============================================

export interface SessionStats {
  completed: number;
  optimalSolutions: number;
  maxStreak: number;
  totalTime: number;
  totalMoves: number;
  hintsUsed: number;
}
