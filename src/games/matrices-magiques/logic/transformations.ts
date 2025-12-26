/**
 * Transformation logic for Matrices Magiques
 * Pure functions to apply transformations to shapes
 */

import {
  ShapeConfig,
  ShapeColor,
  ShapeSize,
  RotationAngle,
  FillStyle,
  Transformation,
  TransformationType,
} from '../types';
import { getNextColor, COLOR_SEQUENCES } from '../data/shapes';

// ============================================================================
// SIZE TRANSFORMATIONS
// ============================================================================

const SIZE_SEQUENCE: ShapeSize[] = ['small', 'medium', 'large'];

/** Get next size in sequence */
export function getNextSize(current: ShapeSize): ShapeSize {
  const idx = SIZE_SEQUENCE.indexOf(current);
  return SIZE_SEQUENCE[(idx + 1) % SIZE_SEQUENCE.length];
}

/** Get previous size in sequence */
export function getPreviousSize(current: ShapeSize): ShapeSize {
  const idx = SIZE_SEQUENCE.indexOf(current);
  return SIZE_SEQUENCE[(idx - 1 + SIZE_SEQUENCE.length) % SIZE_SEQUENCE.length];
}

// ============================================================================
// ROTATION TRANSFORMATIONS
// ============================================================================

const ROTATION_SEQUENCE: RotationAngle[] = [0, 45, 90, 135, 180, 225, 270, 315];

/** Apply rotation step */
export function applyRotation(
  current: RotationAngle,
  step: 45 | 90 | 180
): RotationAngle {
  const newAngle = (current + step) % 360;
  return newAngle as RotationAngle;
}

/** Get next rotation in 90-degree sequence */
export function getNextRotation90(current: RotationAngle): RotationAngle {
  return applyRotation(current, 90);
}

/** Get next rotation in 45-degree sequence */
export function getNextRotation45(current: RotationAngle): RotationAngle {
  return applyRotation(current, 45);
}

// ============================================================================
// FILL TRANSFORMATIONS
// ============================================================================

const FILL_SEQUENCE: FillStyle[] = ['solid', 'outline'];

/** Toggle fill style */
export function toggleFill(current: FillStyle): FillStyle {
  return current === 'solid' ? 'outline' : 'solid';
}

// ============================================================================
// COUNT TRANSFORMATIONS
// ============================================================================

/** Get next count (1-3) */
export function getNextCount(current: number): number {
  return ((current - 1 + 1) % 3) + 1; // 1 -> 2 -> 3 -> 1
}

/** Get previous count (1-3) */
export function getPreviousCount(current: number): number {
  return ((current - 1 - 1 + 3) % 3) + 1; // 3 -> 2 -> 1 -> 3
}

// ============================================================================
// APPLY TRANSFORMATION
// ============================================================================

/**
 * Apply a transformation to a shape config
 * Returns a new ShapeConfig with the transformation applied
 */
export function applyTransformation(
  shape: ShapeConfig,
  transformation: Transformation,
  colorSequence?: ShapeColor[]
): ShapeConfig {
  const newShape = { ...shape };

  switch (transformation.type) {
    case 'color_change':
      const sequence = colorSequence || transformation.colorSequence || COLOR_SEQUENCES[0];
      newShape.color = getNextColor(shape.color, sequence);
      break;

    case 'size_change':
      newShape.size = getNextSize(shape.size);
      break;

    case 'rotation':
      const rotationStep = transformation.rotationStep || 90;
      newShape.rotation = applyRotation(shape.rotation, rotationStep);
      break;

    case 'addition':
      newShape.count = Math.min((shape.count || 1) + 1, 3);
      break;

    case 'subtraction':
      newShape.count = Math.max((shape.count || 1) - 1, 1);
      break;

    case 'fill_toggle':
      newShape.fill = toggleFill(shape.fill);
      break;

    case 'count_change':
      newShape.count = getNextCount(shape.count || 1);
      break;

    case 'reflection':
      // For horizontal reflection, we can approximate with rotation
      if (transformation.reflectionAxis === 'horizontal') {
        // Flip vertically = rotate 180 if has orientation
        newShape.rotation = applyRotation(shape.rotation, 180);
      } else {
        // Flip horizontally - for now, just negate rotation direction
        newShape.rotation = ((360 - shape.rotation) % 360) as RotationAngle;
      }
      break;

    case 'superposition':
      // This would require combining shapes - handled at puzzle level
      break;
  }

  return newShape;
}

/**
 * Apply transformation in reverse (for solving)
 */
export function reverseTransformation(
  shape: ShapeConfig,
  transformation: Transformation,
  colorSequence?: ShapeColor[]
): ShapeConfig {
  const newShape = { ...shape };

  switch (transformation.type) {
    case 'color_change':
      const sequence = colorSequence || transformation.colorSequence || COLOR_SEQUENCES[0];
      // Find previous color in sequence
      const idx = sequence.indexOf(shape.color);
      const prevIdx = (idx - 1 + sequence.length) % sequence.length;
      newShape.color = sequence[prevIdx];
      break;

    case 'size_change':
      newShape.size = getPreviousSize(shape.size);
      break;

    case 'rotation':
      const rotationStep = transformation.rotationStep || 90;
      newShape.rotation = applyRotation(shape.rotation, (360 - rotationStep) as 45 | 90 | 180);
      break;

    case 'addition':
      newShape.count = Math.max((shape.count || 1) - 1, 1);
      break;

    case 'subtraction':
      newShape.count = Math.min((shape.count || 1) + 1, 3);
      break;

    case 'fill_toggle':
      newShape.fill = toggleFill(shape.fill);
      break;

    case 'count_change':
      newShape.count = getPreviousCount(shape.count || 1);
      break;

    case 'reflection':
      // Reflection is its own inverse
      return applyTransformation(shape, transformation);

    case 'superposition':
      break;
  }

  return newShape;
}

/**
 * Get the transformation that was applied between two shapes
 */
export function detectTransformation(
  before: ShapeConfig,
  after: ShapeConfig
): TransformationType | null {
  // Color change
  if (before.color !== after.color &&
      before.type === after.type &&
      before.size === after.size &&
      before.rotation === after.rotation) {
    return 'color_change';
  }

  // Size change
  if (before.size !== after.size &&
      before.type === after.type &&
      before.color === after.color) {
    return 'size_change';
  }

  // Rotation
  if (before.rotation !== after.rotation &&
      before.type === after.type &&
      before.color === after.color) {
    return 'rotation';
  }

  // Fill toggle
  if (before.fill !== after.fill &&
      before.type === after.type) {
    return 'fill_toggle';
  }

  // Count change
  if ((before.count || 1) !== (after.count || 1) &&
      before.type === after.type) {
    if ((after.count || 1) > (before.count || 1)) {
      return 'addition';
    } else {
      return 'subtraction';
    }
  }

  return null;
}

/**
 * Check if two shapes are equal
 */
export function shapesEqual(a: ShapeConfig, b: ShapeConfig): boolean {
  return (
    a.type === b.type &&
    a.color === b.color &&
    a.size === b.size &&
    a.rotation === b.rotation &&
    a.fill === b.fill &&
    (a.count || 1) === (b.count || 1) &&
    a.secondaryColor === b.secondaryColor &&
    a.pattern === b.pattern
  );
}

/**
 * Create a sequence of shapes by applying transformation multiple times
 */
export function createTransformationSequence(
  initial: ShapeConfig,
  transformation: Transformation,
  length: number,
  colorSequence?: ShapeColor[]
): ShapeConfig[] {
  const sequence: ShapeConfig[] = [initial];
  let current = initial;

  for (let i = 1; i < length; i++) {
    current = applyTransformation(current, transformation, colorSequence);
    sequence.push(current);
  }

  return sequence;
}

/**
 * Validate that a sequence follows a transformation rule
 */
export function validateSequence(
  sequence: ShapeConfig[],
  transformation: Transformation,
  colorSequence?: ShapeColor[]
): boolean {
  if (sequence.length < 2) return true;

  for (let i = 1; i < sequence.length; i++) {
    const expected = applyTransformation(sequence[i - 1], transformation, colorSequence);
    if (!shapesEqual(expected, sequence[i])) {
      return false;
    }
  }

  return true;
}
