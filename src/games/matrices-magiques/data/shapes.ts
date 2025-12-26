/**
 * Shape definitions for Matrices Magiques
 * All SVG shapes with their properties and rendering data
 */

import {
  ShapeType,
  BasicShapeType,
  ForestShapeType,
  SpaceShapeType,
  CastleShapeType,
  ArtShapeType,
  MysteryShapeType,
  ShapeColor,
  SHAPE_COLORS,
} from '../types';

// ============================================================================
// SHAPE CATEGORIES
// ============================================================================

export const BASIC_SHAPES: BasicShapeType[] = [
  'circle',
  'square',
  'triangle',
  'diamond',
  'hexagon',
  'star',
  'pentagon',
  'oval',
];

export const FOREST_SHAPES: ForestShapeType[] = [
  'tree',
  'leaf',
  'mushroom',
  'flower',
  'butterfly',
  'ladybug',
  'acorn',
  'pine',
];

export const SPACE_SHAPES: SpaceShapeType[] = [
  'planet',
  'rocket',
  'satellite',
  'moon',
  'meteor',
  'ufo',
  'astronaut',
  'comet',
];

export const CASTLE_SHAPES: CastleShapeType[] = [
  'crown',
  'key',
  'shield',
  'sword',
  'gem',
  'flag',
  'tower',
  'potion',
];

export const ART_SHAPES: ArtShapeType[] = [
  'spiral',
  'wave',
  'zigzag',
  'dots',
  'stripes',
  'cross',
  'arrow',
  'heart',
];

export const MYSTERY_SHAPES: MysteryShapeType[] = [
  'morphed',
  'layered',
  'split',
  'merged',
  'inverted',
  'fragmented',
];

// ============================================================================
// SHAPE METADATA
// ============================================================================

export interface ShapeMetadata {
  type: ShapeType;
  category: 'basic' | 'forest' | 'space' | 'castle' | 'art' | 'mystery';
  displayName: string;
  displayNameKey: string;
  /** SVG path data (for basic shapes) */
  pathData?: string;
  /** Whether shape supports rotation visually */
  supportsRotation: boolean;
  /** Whether shape has distinct orientation */
  hasOrientation: boolean;
  /** Default viewBox size */
  viewBox: number;
}

/** Shape metadata registry */
export const SHAPE_METADATA: Record<ShapeType, ShapeMetadata> = {
  // Basic shapes
  circle: {
    type: 'circle',
    category: 'basic',
    displayName: 'Cercle',
    displayNameKey: 'shapes.circle',
    supportsRotation: false,
    hasOrientation: false,
    viewBox: 100,
  },
  square: {
    type: 'square',
    category: 'basic',
    displayName: 'Carré',
    displayNameKey: 'shapes.square',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  triangle: {
    type: 'triangle',
    category: 'basic',
    displayName: 'Triangle',
    displayNameKey: 'shapes.triangle',
    pathData: 'M50 10 L90 90 L10 90 Z',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  diamond: {
    type: 'diamond',
    category: 'basic',
    displayName: 'Losange',
    displayNameKey: 'shapes.diamond',
    pathData: 'M50 5 L95 50 L50 95 L5 50 Z',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  hexagon: {
    type: 'hexagon',
    category: 'basic',
    displayName: 'Hexagone',
    displayNameKey: 'shapes.hexagon',
    pathData: 'M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  star: {
    type: 'star',
    category: 'basic',
    displayName: 'Étoile',
    displayNameKey: 'shapes.star',
    pathData: 'M50 5 L61 39 L97 39 L68 61 L79 95 L50 73 L21 95 L32 61 L3 39 L39 39 Z',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  pentagon: {
    type: 'pentagon',
    category: 'basic',
    displayName: 'Pentagone',
    displayNameKey: 'shapes.pentagon',
    pathData: 'M50 5 L95 38 L77 95 L23 95 L5 38 Z',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  oval: {
    type: 'oval',
    category: 'basic',
    displayName: 'Ovale',
    displayNameKey: 'shapes.oval',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },

  // Forest shapes
  tree: {
    type: 'tree',
    category: 'forest',
    displayName: 'Arbre',
    displayNameKey: 'shapes.tree',
    supportsRotation: false,
    hasOrientation: true,
    viewBox: 100,
  },
  leaf: {
    type: 'leaf',
    category: 'forest',
    displayName: 'Feuille',
    displayNameKey: 'shapes.leaf',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  mushroom: {
    type: 'mushroom',
    category: 'forest',
    displayName: 'Champignon',
    displayNameKey: 'shapes.mushroom',
    supportsRotation: false,
    hasOrientation: true,
    viewBox: 100,
  },
  flower: {
    type: 'flower',
    category: 'forest',
    displayName: 'Fleur',
    displayNameKey: 'shapes.flower',
    supportsRotation: true,
    hasOrientation: false,
    viewBox: 100,
  },
  butterfly: {
    type: 'butterfly',
    category: 'forest',
    displayName: 'Papillon',
    displayNameKey: 'shapes.butterfly',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  ladybug: {
    type: 'ladybug',
    category: 'forest',
    displayName: 'Coccinelle',
    displayNameKey: 'shapes.ladybug',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  acorn: {
    type: 'acorn',
    category: 'forest',
    displayName: 'Gland',
    displayNameKey: 'shapes.acorn',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  pine: {
    type: 'pine',
    category: 'forest',
    displayName: 'Sapin',
    displayNameKey: 'shapes.pine',
    supportsRotation: false,
    hasOrientation: true,
    viewBox: 100,
  },

  // Space shapes
  planet: {
    type: 'planet',
    category: 'space',
    displayName: 'Planète',
    displayNameKey: 'shapes.planet',
    supportsRotation: false,
    hasOrientation: false,
    viewBox: 100,
  },
  rocket: {
    type: 'rocket',
    category: 'space',
    displayName: 'Fusée',
    displayNameKey: 'shapes.rocket',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  satellite: {
    type: 'satellite',
    category: 'space',
    displayName: 'Satellite',
    displayNameKey: 'shapes.satellite',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  moon: {
    type: 'moon',
    category: 'space',
    displayName: 'Lune',
    displayNameKey: 'shapes.moon',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  meteor: {
    type: 'meteor',
    category: 'space',
    displayName: 'Météore',
    displayNameKey: 'shapes.meteor',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  ufo: {
    type: 'ufo',
    category: 'space',
    displayName: 'OVNI',
    displayNameKey: 'shapes.ufo',
    supportsRotation: false,
    hasOrientation: true,
    viewBox: 100,
  },
  astronaut: {
    type: 'astronaut',
    category: 'space',
    displayName: 'Astronaute',
    displayNameKey: 'shapes.astronaut',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  comet: {
    type: 'comet',
    category: 'space',
    displayName: 'Comète',
    displayNameKey: 'shapes.comet',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },

  // Castle shapes
  crown: {
    type: 'crown',
    category: 'castle',
    displayName: 'Couronne',
    displayNameKey: 'shapes.crown',
    supportsRotation: false,
    hasOrientation: true,
    viewBox: 100,
  },
  key: {
    type: 'key',
    category: 'castle',
    displayName: 'Clé',
    displayNameKey: 'shapes.key',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  shield: {
    type: 'shield',
    category: 'castle',
    displayName: 'Bouclier',
    displayNameKey: 'shapes.shield',
    supportsRotation: false,
    hasOrientation: true,
    viewBox: 100,
  },
  sword: {
    type: 'sword',
    category: 'castle',
    displayName: 'Épée',
    displayNameKey: 'shapes.sword',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  gem: {
    type: 'gem',
    category: 'castle',
    displayName: 'Gemme',
    displayNameKey: 'shapes.gem',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  flag: {
    type: 'flag',
    category: 'castle',
    displayName: 'Drapeau',
    displayNameKey: 'shapes.flag',
    supportsRotation: false,
    hasOrientation: true,
    viewBox: 100,
  },
  tower: {
    type: 'tower',
    category: 'castle',
    displayName: 'Tour',
    displayNameKey: 'shapes.tower',
    supportsRotation: false,
    hasOrientation: true,
    viewBox: 100,
  },
  potion: {
    type: 'potion',
    category: 'castle',
    displayName: 'Potion',
    displayNameKey: 'shapes.potion',
    supportsRotation: false,
    hasOrientation: true,
    viewBox: 100,
  },

  // Art shapes
  spiral: {
    type: 'spiral',
    category: 'art',
    displayName: 'Spirale',
    displayNameKey: 'shapes.spiral',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  wave: {
    type: 'wave',
    category: 'art',
    displayName: 'Vague',
    displayNameKey: 'shapes.wave',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  zigzag: {
    type: 'zigzag',
    category: 'art',
    displayName: 'Zigzag',
    displayNameKey: 'shapes.zigzag',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  dots: {
    type: 'dots',
    category: 'art',
    displayName: 'Points',
    displayNameKey: 'shapes.dots',
    supportsRotation: false,
    hasOrientation: false,
    viewBox: 100,
  },
  stripes: {
    type: 'stripes',
    category: 'art',
    displayName: 'Rayures',
    displayNameKey: 'shapes.stripes',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  cross: {
    type: 'cross',
    category: 'art',
    displayName: 'Croix',
    displayNameKey: 'shapes.cross',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  arrow: {
    type: 'arrow',
    category: 'art',
    displayName: 'Flèche',
    displayNameKey: 'shapes.arrow',
    pathData: 'M50 10 L90 50 L65 50 L65 90 L35 90 L35 50 L10 50 Z',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  heart: {
    type: 'heart',
    category: 'art',
    displayName: 'Coeur',
    displayNameKey: 'shapes.heart',
    pathData: 'M50 88 C20 65 5 45 5 30 C5 15 20 5 35 5 C45 5 50 15 50 15 C50 15 55 5 65 5 C80 5 95 15 95 30 C95 45 80 65 50 88 Z',
    supportsRotation: false,
    hasOrientation: true,
    viewBox: 100,
  },

  // Mystery shapes
  morphed: {
    type: 'morphed',
    category: 'mystery',
    displayName: 'Morphé',
    displayNameKey: 'shapes.morphed',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  layered: {
    type: 'layered',
    category: 'mystery',
    displayName: 'Superposé',
    displayNameKey: 'shapes.layered',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  split: {
    type: 'split',
    category: 'mystery',
    displayName: 'Divisé',
    displayNameKey: 'shapes.split',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  merged: {
    type: 'merged',
    category: 'mystery',
    displayName: 'Fusionné',
    displayNameKey: 'shapes.merged',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  inverted: {
    type: 'inverted',
    category: 'mystery',
    displayName: 'Inversé',
    displayNameKey: 'shapes.inverted',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
  fragmented: {
    type: 'fragmented',
    category: 'mystery',
    displayName: 'Fragmenté',
    displayNameKey: 'shapes.fragmented',
    supportsRotation: true,
    hasOrientation: true,
    viewBox: 100,
  },
};

// ============================================================================
// COLOR SEQUENCES FOR TRANSFORMATIONS
// ============================================================================

/** Standard color sequences for color_change transformation */
export const COLOR_SEQUENCES: ShapeColor[][] = [
  ['red', 'blue', 'green'],
  ['yellow', 'purple', 'orange'],
  ['blue', 'green', 'yellow'],
  ['red', 'orange', 'yellow'],
  ['purple', 'blue', 'cyan'],
  ['pink', 'purple', 'blue'],
  ['green', 'cyan', 'blue'],
  ['orange', 'red', 'pink'],
];

/** Get a random color sequence */
export function getRandomColorSequence(): ShapeColor[] {
  return COLOR_SEQUENCES[Math.floor(Math.random() * COLOR_SEQUENCES.length)];
}

/** Get next color in sequence */
export function getNextColor(current: ShapeColor, sequence: ShapeColor[]): ShapeColor {
  const currentIndex = sequence.indexOf(current);
  if (currentIndex === -1) return sequence[0];
  return sequence[(currentIndex + 1) % sequence.length];
}

/** Get color hex value */
export function getColorHex(color: ShapeColor): string {
  return SHAPE_COLORS[color];
}

// ============================================================================
// DALTONISM PATTERNS
// ============================================================================

/** Pattern types for daltonism accessibility */
export type PatternType = 'none' | 'striped' | 'dotted' | 'checkered' | 'dashed';

/** Map colors to patterns for daltonism mode */
export const COLOR_PATTERNS: Record<ShapeColor, PatternType> = {
  red: 'striped',
  blue: 'dotted',
  green: 'checkered',
  yellow: 'dashed',
  purple: 'striped',
  orange: 'dotted',
  pink: 'checkered',
  cyan: 'dashed',
};

/** Get pattern for color (daltonism mode) */
export function getPatternForColor(color: ShapeColor): PatternType {
  return COLOR_PATTERNS[color];
}
