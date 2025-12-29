/**
 * Puzzle Engine for Matrices Magiques
 * Generates valid puzzles with correct answers and distractors
 */

import {
  PuzzleConfig,
  MatrixCell,
  ShapeConfig,
  ShapeType,
  ShapeColor,
  ShapeSize,
  RotationAngle,
  FillStyle,
  Transformation,
  TransformationType,
  GridSize,
  Position,
  WorldTheme,
  DifficultyLevel,
  WorldConfig,
} from '../types';
import { getWorldById, WORLDS } from '../data/worlds';
import { COLOR_SEQUENCES, getRandomColorSequence } from '../data/shapes';
import {
  applyTransformation,
  shapesEqual,
  createTransformationSequence,
} from './transformations';

// ============================================================================
// RANDOM HELPERS
// ============================================================================

function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateId(): string {
  return `puzzle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// SHAPE GENERATION
// ============================================================================

const COLORS: ShapeColor[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
const SIZES: ShapeSize[] = ['small', 'medium', 'large'];
const ROTATIONS: RotationAngle[] = [0, 90, 180, 270];
const FILLS: FillStyle[] = ['solid', 'outline'];

/** Generate a random shape config */
export function generateRandomShape(
  allowedTypes: ShapeType[],
  options?: {
    colors?: ShapeColor[];
    sizes?: ShapeSize[];
    rotations?: RotationAngle[];
    fills?: FillStyle[];
  }
): ShapeConfig {
  const colors = options?.colors || COLORS;
  const sizes = options?.sizes || SIZES;
  const rotations = options?.rotations || ROTATIONS;
  const fills = options?.fills || FILLS;

  return {
    type: randomFromArray(allowedTypes),
    color: randomFromArray(colors),
    size: randomFromArray(sizes),
    rotation: randomFromArray(rotations),
    fill: randomFromArray(fills),
    count: 1,
    pattern: 'none',
  };
}

// ============================================================================
// GRID GENERATION
// ============================================================================

/** Get grid dimensions from size string */
function getGridDimensions(size: GridSize): { rows: number; cols: number } {
  switch (size) {
    case '2x2':
      return { rows: 2, cols: 2 };
    case '3x3':
      return { rows: 3, cols: 3 };
    default:
      return { rows: 3, cols: 3 };
  }
}

/** Create empty grid */
function createEmptyGrid(size: GridSize): MatrixCell[][] {
  const { rows, cols } = getGridDimensions(size);
  const grid: MatrixCell[][] = [];

  for (let r = 0; r < rows; r++) {
    const row: MatrixCell[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        position: { row: r, col: c },
        shape: null,
        isTarget: false,
      });
    }
    grid.push(row);
  }

  return grid;
}

// ============================================================================
// PUZZLE GENERATION STRATEGIES
// ============================================================================

/**
 * Strategy 1: Distribution Rule (Latin Square)
 * Each shape/color appears exactly once per row and column
 */
function generateDistributionPuzzle(
  world: WorldConfig,
  difficulty: DifficultyLevel
): PuzzleConfig {
  const { rows, cols } = getGridDimensions(world.gridSize);
  const grid = createEmptyGrid(world.gridSize);

  // Choose colors for distribution
  const numElements = Math.max(rows, cols);
  const selectedColors = shuffleArray(COLORS).slice(0, numElements);
  const selectedTypes = shuffleArray(world.shapeTypes as ShapeType[]).slice(0, 1);
  const shapeType = selectedTypes[0];

  // Create Latin square for colors
  // Row i, Col j -> color (i + j) % n
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const colorIndex = (r + c) % numElements;
      grid[r][c].shape = {
        type: shapeType,
        color: selectedColors[colorIndex],
        size: 'medium',
        rotation: 0,
        fill: 'solid',
        count: 1,
        pattern: 'none',
      };
    }
  }

  // Set target position (bottom-right for simplicity)
  const targetRow = rows - 1;
  const targetCol = cols - 1;
  grid[targetRow][targetCol].isTarget = true;

  // Store correct answer before nullifying
  const correctAnswer = { ...grid[targetRow][targetCol].shape! };
  grid[targetRow][targetCol].shape = null;

  // Generate choices
  const choices = generateDistractors(
    correctAnswer,
    selectedColors,
    shapeType,
    difficulty === 'easy' ? 4 : 6
  );

  // Create transformation for explanation
  const transformation: Transformation = {
    type: 'color_change',
    direction: 'row',
    colorSequence: selectedColors,
  };

  return {
    id: generateId(),
    gridSize: world.gridSize,
    cells: grid,
    targetPosition: { row: targetRow, col: targetCol },
    correctAnswer,
    choices,
    correctChoiceIndex: choices.findIndex((c) => shapesEqual(c, correctAnswer)),
    transformations: [transformation],
    difficulty,
    theme: world.id,
    ruleExplanation: 'Chaque couleur apparaît une fois par ligne et par colonne.',
  };
}

/**
 * Strategy 2: Row Transformation
 * Each row follows a transformation pattern
 */
function generateRowTransformationPuzzle(
  world: WorldConfig,
  difficulty: DifficultyLevel,
  transformationType: TransformationType
): PuzzleConfig {
  const { rows, cols } = getGridDimensions(world.gridSize);
  const grid = createEmptyGrid(world.gridSize);

  // Color sequence for color_change transformation
  const colorSequence = getRandomColorSequence();

  // Create transformation
  const transformation: Transformation = {
    type: transformationType,
    direction: 'row',
    colorSequence: transformationType === 'color_change' ? colorSequence : undefined,
    rotationStep: transformationType === 'rotation' ? 90 : undefined,
  };

  // Generate first column with random shapes
  const baseType = randomFromArray(world.shapeTypes as ShapeType[]);

  for (let r = 0; r < rows; r++) {
    // Start shape for this row
    const startShape: ShapeConfig = {
      type: baseType,
      color: colorSequence[0],
      size: 'medium',
      rotation: 0,
      fill: 'solid',
      count: 1,
      pattern: 'none',
    };

    // Generate row by applying transformation
    const rowShapes = createTransformationSequence(
      startShape,
      transformation,
      cols,
      colorSequence
    );

    for (let c = 0; c < cols; c++) {
      grid[r][c].shape = rowShapes[c];
    }
  }

  // Set target position
  const targetRow = rows - 1;
  const targetCol = cols - 1;
  grid[targetRow][targetCol].isTarget = true;

  const correctAnswer = { ...grid[targetRow][targetCol].shape! };
  grid[targetRow][targetCol].shape = null;

  // Generate choices
  const choices = generateTransformationDistractors(
    correctAnswer,
    transformation,
    colorSequence,
    difficulty === 'easy' ? 4 : 6
  );

  // Get rule explanation
  const ruleExplanation = getTransformationExplanation(transformationType);

  return {
    id: generateId(),
    gridSize: world.gridSize,
    cells: grid,
    targetPosition: { row: targetRow, col: targetCol },
    correctAnswer,
    choices,
    correctChoiceIndex: choices.findIndex((c) => shapesEqual(c, correctAnswer)),
    transformations: [transformation],
    difficulty,
    theme: world.id,
    ruleExplanation,
  };
}

/**
 * Strategy 3: Combined Transformations (for harder puzzles)
 * Row AND column follow different transformation patterns
 */
function generateCombinedPuzzle(
  world: WorldConfig,
  difficulty: DifficultyLevel
): PuzzleConfig {
  // For now, delegate to row transformation with color
  // TODO: Implement true combined transformations
  return generateRowTransformationPuzzle(world, difficulty, 'color_change');
}

// ============================================================================
// DISTRACTOR GENERATION
// ============================================================================

/**
 * Generate distractors for distribution puzzles
 * Distractors are plausible wrong answers (same shape, different colors)
 */
function generateDistractors(
  correct: ShapeConfig,
  usedColors: ShapeColor[],
  shapeType: ShapeType,
  count: number
): ShapeConfig[] {
  const distractors: ShapeConfig[] = [correct];
  const wrongColors = usedColors.filter((c) => c !== correct.color);

  // Add wrong colors
  for (const color of wrongColors) {
    if (distractors.length >= count) break;
    distractors.push({
      ...correct,
      color,
    });
  }

  // If we need more, add from other colors
  const otherColors = COLORS.filter((c) => !usedColors.includes(c));
  for (const color of otherColors) {
    if (distractors.length >= count) break;
    distractors.push({
      ...correct,
      color,
    });
  }

  return shuffleArray(distractors);
}

/**
 * Generate distractors for transformation puzzles
 */
function generateTransformationDistractors(
  correct: ShapeConfig,
  transformation: Transformation,
  colorSequence: ShapeColor[],
  count: number
): ShapeConfig[] {
  const distractors: ShapeConfig[] = [correct];

  // Previous step in transformation (common mistake)
  const previous = applyTransformation(
    correct,
    { ...transformation },
    colorSequence
  );
  // Actually go backwards
  const wrongPrev: ShapeConfig = {
    ...correct,
    color: colorSequence[(colorSequence.indexOf(correct.color) - 1 + colorSequence.length) % colorSequence.length],
  };
  distractors.push(wrongPrev);

  // Next step (overshooting)
  const wrongNext = applyTransformation(correct, transformation, colorSequence);
  if (!shapesEqual(wrongNext, correct)) {
    distractors.push(wrongNext);
  }

  // Random other variations
  const otherColors = colorSequence.filter((c) => c !== correct.color);
  for (const color of otherColors) {
    if (distractors.length >= count) break;
    if (!distractors.some((d) => d.color === color)) {
      distractors.push({ ...correct, color });
    }
  }

  // Pad with random if needed
  while (distractors.length < count) {
    const randomColor = randomFromArray(COLORS);
    if (!distractors.some((d) => d.color === randomColor)) {
      distractors.push({ ...correct, color: randomColor });
    }
  }

  return shuffleArray(distractors.slice(0, count));
}

// ============================================================================
// RULE EXPLANATIONS
// ============================================================================

function getTransformationExplanation(type: TransformationType): string {
  switch (type) {
    case 'color_change':
      return 'La couleur change dans un ordre précis à chaque case.';
    case 'size_change':
      return 'La taille change progressivement : petit → moyen → grand.';
    case 'rotation':
      return 'La forme tourne de 90° à chaque case.';
    case 'addition':
      return 'Un élément s\'ajoute à chaque case.';
    case 'subtraction':
      return 'Un élément disparaît à chaque case.';
    case 'fill_toggle':
      return 'Le remplissage alterne : plein ↔ contour.';
    case 'count_change':
      return 'Le nombre d\'éléments change à chaque case.';
    case 'reflection':
      return 'La forme se retourne comme dans un miroir.';
    case 'superposition':
      return 'Les formes se superposent progressivement.';
    default:
      return 'Observe bien le pattern !';
  }
}

// ============================================================================
// MAIN PUZZLE GENERATOR
// ============================================================================

/**
 * Generate a puzzle for a specific world and difficulty
 */
export function generatePuzzle(
  worldId: WorldTheme,
  difficulty: DifficultyLevel
): PuzzleConfig {
  const world = getWorldById(worldId);
  if (!world) {
    throw new Error(`Unknown world: ${worldId}`);
  }

  // Choose strategy based on difficulty and allowed transformations
  const allowedTransformations = world.allowedTransformations;

  if (difficulty === 'easy') {
    // Simple distribution puzzle
    return generateDistributionPuzzle(world, difficulty);
  }

  if (difficulty === 'medium') {
    // Row transformation puzzle
    const transformationType = randomFromArray(
      allowedTransformations.filter((t) => t !== 'superposition')
    );
    return generateRowTransformationPuzzle(world, difficulty, transformationType);
  }

  if (difficulty === 'hard' || difficulty === 'expert') {
    // Combined or complex transformation
    const transformationType = randomFromArray(allowedTransformations);
    return generateRowTransformationPuzzle(world, difficulty, transformationType);
  }

  // Default fallback
  return generateDistributionPuzzle(world, difficulty);
}

/**
 * Generate a complete session of puzzles for a world
 * @param worldId - The world theme identifier
 * @param puzzleCount - Number of puzzles to generate (default: world.puzzleCount)
 * @param levelNumber - Optional level number (1-10) to determine difficulty
 */
export function generateSession(
  worldId: WorldTheme,
  puzzleCount?: number,
  levelNumber?: number
): PuzzleConfig[] {
  const world = getWorldById(worldId);
  if (!world) {
    throw new Error(`Unknown world: ${worldId}`);
  }

  const count = puzzleCount || world.puzzleCount;
  const puzzles: PuzzleConfig[] = [];
  const [minDifficulty, maxDifficulty] = world.difficultyRange;

  // Difficulty levels
  const difficulties: DifficultyLevel[] = ['easy', 'medium', 'hard', 'expert'];
  const minIdx = difficulties.indexOf(minDifficulty);
  const maxIdx = difficulties.indexOf(maxDifficulty);

  // If levelNumber is provided, use it to determine base difficulty
  // Levels 1-10 map to the world's difficulty range
  let baseDifficultyIdx: number | null = null;
  if (levelNumber !== undefined && levelNumber >= 1 && levelNumber <= 10) {
    // Map level 1-10 to the world's difficulty range
    const levelProgress = (levelNumber - 1) / 9; // 0 to 1
    baseDifficultyIdx = Math.round(minIdx + levelProgress * (maxIdx - minIdx));
  }

  for (let i = 0; i < count; i++) {
    let difficultyIdx: number;

    if (baseDifficultyIdx !== null) {
      // When level is specified, use consistent difficulty with slight variation
      // within the session (±1 step for variety)
      const variation = i < count / 2 ? 0 : 1; // Second half slightly harder
      difficultyIdx = Math.min(baseDifficultyIdx + variation, maxIdx);
    } else {
      // Progressive difficulty through session (original behavior)
      const progressRatio = i / (count - 1);
      difficultyIdx = Math.round(minIdx + progressRatio * (maxIdx - minIdx));
    }

    const difficulty = difficulties[difficultyIdx];
    puzzles.push(generatePuzzle(worldId, difficulty));
  }

  return puzzles;
}

/**
 * Validate that a puzzle is solvable and correct
 */
export function validatePuzzle(puzzle: PuzzleConfig): boolean {
  // Check that correct answer exists in choices
  const correctExists = puzzle.choices.some((c) =>
    shapesEqual(c, puzzle.correctAnswer)
  );
  if (!correctExists) return false;

  // Check that correctChoiceIndex is valid
  if (
    puzzle.correctChoiceIndex < 0 ||
    puzzle.correctChoiceIndex >= puzzle.choices.length
  ) {
    return false;
  }

  // Check that indexed choice matches correct answer
  if (!shapesEqual(puzzle.choices[puzzle.correctChoiceIndex], puzzle.correctAnswer)) {
    return false;
  }

  return true;
}
