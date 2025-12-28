/**
 * Embouteillage - Type definitions
 * Rush Hour-style puzzle game
 */

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
}

export interface EmbouteillageLevel {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  gridSize: 6; // Standard Rush Hour grid is 6x6
  vehicles: Vehicle[];
  exitRow: number; // Row where the target car needs to reach
  exitCol: number; // Column of the exit (usually 5 for right edge)
  minMoves: number; // Optimal solution move count
}

export interface EmbouteillageMoveRecord {
  vehicleId: string;
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  timestamp: number;
}

export interface EmbouteillageGameState {
  level: EmbouteillageLevel | null;
  vehicles: Vehicle[];
  moves: EmbouteillageMoveRecord[];
  moveCount: number;
  isCompleted: boolean;
  startTime: number | null;
  elapsedTime: number;
  hintsUsed: number;
}

export interface EmbouteillageProgress {
  levelId: string;
  completed: boolean;
  bestMoves: number | null;
  bestTime: number | null;
  attempts: number;
  lastPlayed: number;
}
