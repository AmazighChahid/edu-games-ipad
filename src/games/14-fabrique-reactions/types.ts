/**
 * La Fabrique de Reactions - Type definitions
 * Chain reaction logic puzzle game
 */

export type MachineType =
  | 'ball_dropper'    // Drops a ball
  | 'conveyor'        // Moves objects horizontally
  | 'ramp'            // Slides objects down
  | 'lever'           // Triggers when weight is applied
  | 'domino'          // Falls and triggers next
  | 'spring'          // Bounces objects upward
  | 'funnel'          // Collects and redirects
  | 'bell'            // Goal element - rings when hit
  | 'fan'             // Blows objects
  | 'magnet';         // Attracts metal objects

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface MachinePiece {
  id: string;
  type: MachineType;
  row: number;
  col: number;
  direction?: Direction;
  isFixed: boolean; // Cannot be moved by player
  isPlaced: boolean; // Player has placed this piece
}

export interface FabriqueLevel {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  gridRows: number;
  gridCols: number;
  fixedPieces: MachinePiece[]; // Pre-placed pieces
  availablePieces: MachinePiece[]; // Pieces player can place
  startPieceId: string; // Where the chain reaction begins
  goalPieceIds: string[]; // Elements that must be activated
  maxPiecesToPlace: number;
}

export interface FabriqueGameState {
  level: FabriqueLevel | null;
  grid: (MachinePiece | null)[][];
  availablePieces: MachinePiece[];
  placedPieces: MachinePiece[];
  isSimulating: boolean;
  simulationStep: number;
  activatedPieces: string[];
  goalsReached: string[];
  isCompleted: boolean;
  attempts: number;
}

export interface FabriqueProgress {
  levelId: string;
  completed: boolean;
  bestAttempts: number | null;
  stars: 1 | 2 | 3 | null; // Based on pieces used and attempts
  lastPlayed: number;
}
