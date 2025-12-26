/**
 * Types for Matrices Magiques
 * A Raven-style matrix reasoning game for children 7-10 years old
 */

// ============================================================================
// SHAPE TYPES
// ============================================================================

/** Basic geometric shapes */
export type BasicShapeType =
  | 'circle'
  | 'square'
  | 'triangle'
  | 'diamond'
  | 'hexagon'
  | 'star'
  | 'pentagon'
  | 'oval';

/** Forest theme shapes */
export type ForestShapeType =
  | 'tree'
  | 'leaf'
  | 'mushroom'
  | 'flower'
  | 'butterfly'
  | 'ladybug'
  | 'acorn'
  | 'pine';

/** Space theme shapes */
export type SpaceShapeType =
  | 'planet'
  | 'rocket'
  | 'satellite'
  | 'moon'
  | 'meteor'
  | 'ufo'
  | 'astronaut'
  | 'comet';

/** Castle theme shapes */
export type CastleShapeType =
  | 'crown'
  | 'key'
  | 'shield'
  | 'sword'
  | 'gem'
  | 'flag'
  | 'tower'
  | 'potion';

/** Art theme shapes */
export type ArtShapeType =
  | 'spiral'
  | 'wave'
  | 'zigzag'
  | 'dots'
  | 'stripes'
  | 'cross'
  | 'arrow'
  | 'heart';

/** Mystery theme shapes (combinations) */
export type MysteryShapeType =
  | 'morphed'
  | 'layered'
  | 'split'
  | 'merged'
  | 'inverted'
  | 'fragmented';

/** All shape types */
export type ShapeType =
  | BasicShapeType
  | ForestShapeType
  | SpaceShapeType
  | CastleShapeType
  | ArtShapeType
  | MysteryShapeType;

// ============================================================================
// SHAPE ATTRIBUTES
// ============================================================================

/** Shape colors - child-friendly palette */
export type ShapeColor =
  | 'red'      // #FF6B6B
  | 'blue'     // #5B8DEE
  | 'green'    // #7BC74D
  | 'yellow'   // #FFD93D
  | 'purple'   // #A29BFE
  | 'orange'   // #FFB347
  | 'pink'     // #FF9FF3
  | 'cyan';    // #00D2D3

/** Color hex values */
export const SHAPE_COLORS: Record<ShapeColor, string> = {
  red: '#FF6B6B',
  blue: '#5B8DEE',
  green: '#7BC74D',
  yellow: '#FFD93D',
  purple: '#A29BFE',
  orange: '#FFB347',
  pink: '#FF9FF3',
  cyan: '#00D2D3',
};

/** Shape sizes */
export type ShapeSize = 'small' | 'medium' | 'large';

/** Rotation angles in degrees */
export type RotationAngle = 0 | 45 | 90 | 135 | 180 | 225 | 270 | 315;

/** Fill style */
export type FillStyle = 'solid' | 'outline' | 'dashed' | 'dotted';

/** Complete shape configuration */
export interface ShapeConfig {
  type: ShapeType;
  color: ShapeColor;
  size: ShapeSize;
  rotation: RotationAngle;
  fill: FillStyle;
  /** For composite shapes */
  secondaryColor?: ShapeColor;
  /** Number of elements (1-3) */
  count?: number;
  /** Pattern for daltonism accessibility */
  pattern?: 'none' | 'striped' | 'dotted' | 'checkered';
}

// ============================================================================
// TRANSFORMATION TYPES
// ============================================================================

/** Types of transformations that can be applied */
export type TransformationType =
  | 'color_change'     // Color cycles through sequence
  | 'size_change'      // small → medium → large
  | 'rotation'         // 0° → 90° → 180° → 270°
  | 'addition'         // 1 → 2 → 3 elements
  | 'subtraction'      // 3 → 2 → 1 elements
  | 'fill_toggle'      // solid ↔ outline
  | 'count_change'     // Increase/decrease count
  | 'reflection'       // horizontal/vertical mirror
  | 'superposition';   // Layer shapes

/** Transformation rule */
export interface Transformation {
  type: TransformationType;
  /** Direction: 'row' | 'column' | 'diagonal' */
  direction: 'row' | 'column' | 'diagonal';
  /** For color change: sequence of colors */
  colorSequence?: ShapeColor[];
  /** For rotation: degrees per step */
  rotationStep?: 45 | 90 | 180;
  /** For reflection: axis */
  reflectionAxis?: 'horizontal' | 'vertical';
}

// ============================================================================
// PUZZLE & GRID TYPES
// ============================================================================

/** Grid sizes */
export type GridSize = '2x2' | '3x3';

/** Position in grid */
export interface Position {
  row: number;
  col: number;
}

/** Single cell in the matrix */
export interface MatrixCell {
  position: Position;
  shape: ShapeConfig | null;
  isTarget: boolean;
}

/** Complete puzzle configuration */
export interface PuzzleConfig {
  id: string;
  gridSize: GridSize;
  cells: MatrixCell[][];
  targetPosition: Position;
  correctAnswer: ShapeConfig;
  choices: ShapeConfig[];
  correctChoiceIndex: number;
  transformations: Transformation[];
  difficulty: DifficultyLevel;
  theme: WorldTheme;
  /** Explanation for learning */
  ruleExplanation: string;
}

// ============================================================================
// WORLD & DIFFICULTY
// ============================================================================

/** Game difficulty levels */
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

/** World themes */
export type WorldTheme = 'forest' | 'space' | 'castle' | 'art' | 'mystery';

/** World configuration */
export interface WorldConfig {
  id: WorldTheme;
  name: string;
  nameKey: string;
  description: string;
  descriptionKey: string;
  icon: string;
  /** Gradient colors */
  gradientColors: [string, string];
  /** Background color */
  backgroundColor: string;
  /** Surface color for cards */
  surfaceColor: string;
  /** Primary accent color */
  primaryColor: string;
  /** Allowed shape types in this world */
  shapeTypes: ShapeType[];
  /** Allowed transformations */
  allowedTransformations: TransformationType[];
  /** Grid size for this world */
  gridSize: GridSize;
  /** Puzzles per world */
  puzzleCount: number;
  /** Unlock condition */
  unlockCondition: {
    type: 'default' | 'complete_world' | 'complete_all';
    worldId?: WorldTheme;
  };
  /** Difficulty range */
  difficultyRange: [DifficultyLevel, DifficultyLevel];
}

// ============================================================================
// HINT SYSTEM
// ============================================================================

/** Hint levels (progressive) */
export type HintLevel = 1 | 2 | 3 | 4;

/** Hint configuration */
export interface HintConfig {
  level: HintLevel;
  message: string;
  /** Visual hint type */
  visualHint?: 'highlight_row' | 'highlight_column' | 'show_pattern' | 'reveal_answer';
  /** Star cost for this hint */
  starCost: number;
}

/** Hint state in game */
export interface HintState {
  hintsUsed: HintLevel[];
  availableHints: number;
  currentHint: HintConfig | null;
}

// ============================================================================
// GAME STATE & PROGRESS
// ============================================================================

/** Game states */
export type GameState =
  | 'idle'
  | 'playing'
  | 'checking'
  | 'correct'
  | 'incorrect'
  | 'revealing'
  | 'complete'
  | 'paused';

/** Single puzzle attempt */
export interface PuzzleAttempt {
  puzzleId: string;
  selectedChoiceIndex: number;
  isCorrect: boolean;
  timestamp: number;
  hintsUsed: HintLevel[];
  attemptNumber: number;
}

/** Session state (one playthrough of a world) */
export interface SessionState {
  worldId: WorldTheme;
  startedAt: number;
  puzzles: PuzzleConfig[];
  currentPuzzleIndex: number;
  attempts: PuzzleAttempt[];
  hintsUsedTotal: number;
  starsEarned: number;
  gameState: GameState;
  selectedChoiceIndex: number | null;
  currentAttemptNumber: number;
}

/** Progress for a single world */
export interface WorldProgress {
  worldId: WorldTheme;
  isUnlocked: boolean;
  puzzlesCompleted: number;
  totalPuzzles: number;
  bestStars: number;
  hintsUsedTotal: number;
  completedAt: number | null;
  lastPlayedAt: number | null;
  /** Badges earned in this world */
  badges: BadgeType[];
}

/** Overall player progress */
export interface PlayerProgress {
  worlds: Record<WorldTheme, WorldProgress>;
  totalPuzzlesSolved: number;
  totalStarsEarned: number;
  currentLevel: DifficultyLevel;
  badges: BadgeType[];
  cardsUnlocked: string[];
  lastPlayedAt: number | null;
}

// ============================================================================
// BADGES & REWARDS
// ============================================================================

/** Badge types */
export type BadgeType =
  | 'color_master'        // Mastered color transformations
  | 'rotation_expert'     // Mastered rotation transformations
  | 'pattern_detective'   // Found patterns quickly
  | 'no_hints_hero'       // Completed world without hints
  | 'speed_solver'        // Completed puzzles quickly
  | 'perseverance'        // Kept trying after mistakes
  | 'world_conqueror'     // Completed all puzzles in a world
  | 'ultimate_genius';    // Completed all worlds

/** Badge configuration */
export interface Badge {
  id: BadgeType;
  name: string;
  nameKey: string;
  description: string;
  descriptionKey: string;
  icon: string;
  /** Condition to unlock */
  condition: {
    type: 'transformation_mastery' | 'no_hints' | 'speed' | 'perseverance' | 'completion';
    value?: number;
    worldId?: WorldTheme;
  };
}

// ============================================================================
// COLLECTIBLE CARDS
// ============================================================================

/** Card rarity */
export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary';

/** Collectible card */
export interface CollectibleCard {
  id: string;
  name: string;
  nameKey: string;
  description: string;
  descriptionKey: string;
  emoji: string;
  rarity: CardRarity;
  trait: string;
  traitKey: string;
  traitIcon: string;
  /** World this card belongs to */
  worldId: WorldTheme;
  /** Unlock condition */
  unlockCondition: {
    type: 'world_complete' | 'world_perfect' | 'badge_earned';
    worldId?: WorldTheme;
    badgeId?: BadgeType;
    starsRequired?: number;
  };
}

// ============================================================================
// MASCOT (PIXEL LE RENARD)
// ============================================================================

/** Pixel's moods */
export type PixelMood =
  | 'neutral'
  | 'thinking'
  | 'happy'
  | 'excited'
  | 'encouraging'
  | 'celebrating'
  | 'curious'
  | 'proud';

/** Pixel's animation state */
export type PixelAnimation =
  | 'idle'
  | 'bob'
  | 'tail_wag'
  | 'blink'
  | 'wave'
  | 'jump'
  | 'think';

/** Pixel state */
export interface PixelState {
  mood: PixelMood;
  animation: PixelAnimation;
  message: string;
  isVisible: boolean;
}

/** Dialogue context for Pixel */
export type DialogueContext =
  | 'intro'
  | 'puzzle_start'
  | 'hint_1'
  | 'hint_2'
  | 'hint_3'
  | 'hint_4'
  | 'correct'
  | 'incorrect'
  | 'reveal'
  | 'world_complete'
  | 'badge_earned'
  | 'card_unlocked'
  | 'encouragement';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

/** Props for ShapeRenderer */
export interface ShapeRendererProps {
  config: ShapeConfig;
  size?: number;
  animated?: boolean;
  onPress?: () => void;
  testID?: string;
}

/** Props for MatrixCell */
export interface MatrixCellProps {
  cell: MatrixCell;
  size: number;
  onPress?: () => void;
  isHighlighted?: boolean;
  showPattern?: boolean;
}

/** Props for ChoiceButton */
export interface ChoiceButtonProps {
  shape: ShapeConfig;
  index: number;
  isSelected: boolean;
  state: 'idle' | 'selected' | 'correct' | 'incorrect' | 'disabled';
  onPress: (index: number) => void;
  size?: number;
}

/** Props for PixelMascot */
export interface PixelMascotProps {
  mood?: PixelMood;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  showSpeechBubble?: boolean;
  message?: string;
}

/** Props for WorldCard */
export interface WorldCardProps {
  world: WorldConfig;
  progress: WorldProgress;
  onPress: () => void;
  isLocked: boolean;
}

// ============================================================================
// SCREEN PARAMS
// ============================================================================

/** Route params for puzzle screen */
export interface PuzzleScreenParams {
  worldId: WorldTheme;
  puzzleIndex?: number;
}

/** Route params for victory screen */
export interface VictoryScreenParams {
  worldId: WorldTheme;
  puzzlesCompleted: number;
  hintsUsed: number;
  timeSeconds: number;
  starsEarned: number;
  unlockedCardId?: string;
  unlockedBadges?: BadgeType[];
}
