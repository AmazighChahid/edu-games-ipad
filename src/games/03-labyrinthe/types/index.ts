// ============================================
// TYPES : Labyrinthe Logique
// ============================================

// Cellules du labyrinthe
export type CellType = 'wall' | 'path' | 'start' | 'end';

export interface Position {
  x: number;
  y: number;
}

export interface MazeCell {
  x: number;
  y: number;
  type: CellType;
  visited: boolean;              // Pour le fil d'Ariane
  discovered: boolean;           // Pour le fog of war
  interactive?: InteractiveElement;
  walls: {                       // Murs individuels (pour génération)
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
}

// ============================================
// ÉLÉMENTS INTERACTIFS
// ============================================

export type InteractiveType = 'key' | 'door' | 'button' | 'gem' | 'teleporter';

export type ColorType = 'red' | 'blue' | 'green' | 'yellow' | 'purple';

export interface InteractiveElement {
  id: string;
  type: InteractiveType;
  position: Position;
  color?: ColorType;             // Pour clés et portes
  linkedTo?: Position;           // Pour boutons/téléporteurs
  isActive: boolean;             // Pour portes (ouverte/fermée)
  collected: boolean;            // Pour clés/gemmes
}

export interface InventoryItem {
  id: string;
  type: 'key' | 'gem';
  color?: ColorType;
  collectedAt: Date;
}

// ============================================
// ÉTAT DU LABYRINTHE
// ============================================

export interface MazeGrid {
  cells: MazeCell[][];
  width: number;
  height: number;
  start: Position;
  end: Position;
  interactives: InteractiveElement[];
}

export interface MazeState {
  grid: MazeGrid;
  avatarPosition: Position;
  avatarDirection: 'up' | 'down' | 'left' | 'right';
  inventory: InventoryItem[];
  pathHistory: Position[];        // Chemin parcouru
  visitedCells: Set<string>;      // "x,y" format
  hintsUsed: number;
  gemsCollected: number;
  totalGems: number;
  startTime: Date;
  isComplete: boolean;
  isPaused: boolean;
}

export type GameStatus =
  | 'idle'
  | 'moving'
  | 'blocked'
  | 'interacting'
  | 'door_locked'
  | 'door_opening'
  | 'victory'
  | 'paused';

export type Direction = 'up' | 'down' | 'left' | 'right';

// ============================================
// CONFIGURATION
// ============================================

export interface MazeConfig {
  width: number;
  height: number;
  difficulty: number;            // 1-5
  theme: ThemeType;
  hasKeys: boolean;
  keyCount: number;
  hasButtons: boolean;
  hasGems: boolean;
  gemCount: number;
  hasTeleporters: boolean;
  showMiniMap: boolean;
  showPathTrail: boolean;
  controlMode: 'swipe' | 'trace' | 'buttons';
}

export interface LevelConfig extends MazeConfig {
  id: number;
  name: string;
  unlocked: boolean;
  stars: 0 | 1 | 2 | 3;
  bestTime?: number;
  timeLimits: {
    threeStars: number;          // Secondes
    twoStars: number;
    oneStar: number;
  };
}

// ============================================
// THÈMES
// ============================================

export type ThemeType =
  | 'forest'
  | 'temple'
  | 'space'
  | 'ice'
  | 'garden'
  | 'cave';

export interface Theme {
  id: ThemeType;
  name: string;
  wallColor: string;
  pathColor: string;
  startIcon: string;
  endIcon: string;
  backgroundColor: string;
}

// ============================================
// PROGRESSION
// ============================================

export interface SessionStats {
  levelId: number;
  completed: boolean;
  time: number;
  pathLength: number;
  explorationPercent: number;
  backtracks: number;
  hintsUsed: number;
  gemsCollected: number;
  stars: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress?: number;             // Pour badges progressifs
  target?: number;
}
