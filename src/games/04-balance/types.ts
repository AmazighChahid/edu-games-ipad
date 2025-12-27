/**
 * Balance Logic Game - Type Definitions
 * Enhanced version with all phases, equivalences, and journal system
 */

// ============================================
// OBJECT TYPES
// ============================================

export type ObjectCategory = 'fruit' | 'animal' | 'weight' | 'unknown';
export type ObjectType = ObjectCategory; // Backward compatibility

export interface WeightObject {
  id: string;
  type: ObjectCategory;
  name: string;
  value: number;
  displayValue?: number;
  emoji: string;
  color: string;
  isUnknown?: boolean;
  isLocked?: boolean;
}

export interface PlacedObject extends WeightObject {
  instanceId: string;
  position: { x: number; y: number };
}

// ============================================
// BALANCE STATE
// ============================================

export type PlateSide = 'left' | 'right';

export interface BalancePlate {
  side: PlateSide;
  objects: PlacedObject[];
  totalWeight: number;
}

export interface BalanceState {
  leftPlate: BalancePlate;
  rightPlate: BalancePlate;
  angle: number;
  isBalanced: boolean;
  isAnimating: boolean;
  tolerance: number;
}

// ============================================
// PHASES & PUZZLES
// ============================================

export type Phase = 1 | 2 | 3 | 4;

export interface PhaseInfo {
  phase: Phase;
  name: string;
  description: string;
  ageGroup: '6-7' | '7-8' | '8-9' | '9-10';
  icon: string;
  color: string;
  unlockRequirement: number;
}

export interface ObjectConfig {
  objectId: string;
  count: number;
  isLocked?: boolean;
}

export interface StockConfig {
  objectId: string;
  count: number;
  infinite?: boolean;
}

export interface Puzzle {
  id: string;
  level: number;
  phase: Phase;
  difficulty: 1 | 2 | 3 | 4 | 5;
  ageGroup: '6-7' | '7-8' | '8-9' | '9-10';
  name: string;
  description: string;
  initialLeft: ObjectConfig[];
  initialRight: ObjectConfig[];
  availableObjects: StockConfig[];
  targetBalance: boolean;
  unknownValue?: number;
  possibleEquivalences?: Equivalence[];
  hints: string[];
  maxHintsForThreeStars: number;
  maxAttemptsForThreeStars: number;
}

// ============================================
// EQUIVALENCES & JOURNAL
// ============================================

export interface Equivalence {
  id: string;
  leftSide: { objectId: string; count: number }[];
  rightSide: { objectId: string; count: number }[];
  displayString: string;
  discoveredAt?: Date;
  discoveredInLevel?: number;
}

export interface JournalEntry {
  equivalence: Equivalence;
  discoveredAt: Date;
  puzzleId: string;
  puzzleLevel: number;
}

// ============================================
// GAME STATE
// ============================================

export type GameMode = 'levels' | 'sandbox' | 'journal';
export type GameStatus = 'idle' | 'dragging' | 'animating' | 'balanced' | 'complete';

export interface GameState {
  currentPuzzle: Puzzle | null;
  balance: BalanceState;
  stock: Map<string, number>;
  history: HistoryEntry[];
  hintsUsed: number;
  attempts: number;
  startTime: Date;
  isComplete: boolean;
  discoveredEquivalences: Equivalence[];
  status: GameStatus;
}

export interface HistoryEntry {
  action: 'add' | 'remove';
  side: PlateSide;
  object: WeightObject;
  timestamp: Date;
  balanceAngle: number;
}

// ============================================
// PROGRESSION & STATS
// ============================================

export interface BalanceProgress {
  levelId: string;
  completed: boolean;
  attempts: number;
  hintsUsed: number;
  timeSpent: number;
  stars: 1 | 2 | 3;
  equivalenciesDiscovered: string[];
}

export interface PlayerProgress {
  completedPuzzles: string[];
  starsPerPuzzle: Record<string, 1 | 2 | 3>;
  discoveredEquivalences: Equivalence[];
  unlockedPhases: Phase[];
  totalTime: number;
  currentStreak: number;
  sandboxTimeSpent: number;
}

export interface SessionStats {
  puzzleId: string;
  completed: boolean;
  time: number;
  attempts: number;
  hintsUsed: number;
  stars: 1 | 2 | 3;
  newEquivalences: Equivalence[];
}

// ============================================
// MASCOT & DIALOGUES
// ============================================

export type MascotMood = 'neutral' | 'curious' | 'excited' | 'encouraging' | 'celebratory';

export interface MascotDialogue {
  id: string;
  context: DialogueContext;
  messages: string[];
  mood: MascotMood;
  duration?: number;
}

export type DialogueContext =
  | 'intro'
  | 'level_start'
  | 'first_move'
  | 'wrong_move'
  | 'close_balance'
  | 'balanced'
  | 'discovery'
  | 'hint_1'
  | 'hint_2'
  | 'hint_3'
  | 'hint_4'
  | 'hint_5'
  | 'idle'
  | 'sandbox_start'
  | 'sandbox_discovery'
  | 'victory'
  | 'badge_earned';

// ============================================
// CONFIGURATION
// ============================================

export interface BalanceConfig {
  maxAngle: number;
  sensitivity: number;
  balanceTolerance: number;
  springConfig: {
    damping: number;
    stiffness: number;
    mass: number;
  };
  victoryDelay: number;
  hintAutoShowDelay: number;
}

export const BALANCE_CONFIG: BalanceConfig = {
  maxAngle: 30,
  sensitivity: 3,
  balanceTolerance: 0.1,
  springConfig: {
    damping: 12,
    stiffness: 100,
    mass: 1,
  },
  victoryDelay: 1500,
  hintAutoShowDelay: 45000,
};

export const PHASE_INFO: Record<Phase, PhaseInfo> = {
  1: {
    phase: 1,
    name: 'Objets Identiques',
    description: 'Découvre le concept d\'équilibre',
    ageGroup: '6-7',
    icon: '🍎',
    color: '#E74C3C',
    unlockRequirement: 0,
  },
  2: {
    phase: 2,
    name: 'Équivalences',
    description: 'Découvre que différents objets peuvent peser pareil',
    ageGroup: '7-8',
    icon: '⚖️',
    color: '#3498DB',
    unlockRequirement: 5,
  },
  3: {
    phase: 3,
    name: 'Nombres',
    description: 'Manipule des poids numériques',
    ageGroup: '8-9',
    icon: '🔢',
    color: '#9B59B6',
    unlockRequirement: 12,
  },
  4: {
    phase: 4,
    name: 'Équations',
    description: 'Trouve la valeur de l\'inconnue',
    ageGroup: '9-10',
    icon: '❓',
    color: '#E056FD',
    unlockRequirement: 20,
  },
};
