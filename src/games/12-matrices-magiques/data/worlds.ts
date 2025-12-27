/**
 * World configurations for Matrices Magiques
 * 5 thematic worlds with progressive difficulty
 */

import {
  WorldConfig,
  WorldTheme,
  TransformationType,
  BasicShapeType,
  ForestShapeType,
  SpaceShapeType,
  CastleShapeType,
  ArtShapeType,
  MysteryShapeType,
} from '../types';

/** Forest world - Beginner level */
export const FOREST_WORLD: WorldConfig = {
  id: 'forest',
  name: 'Forêt Enchantée',
  nameKey: 'matrices.worlds.forest.name',
  description: 'Puzzles avec animaux et plantes',
  descriptionKey: 'matrices.worlds.forest.description',
  icon: '🌲',
  gradientColors: ['#81C784', '#4CAF50'],
  backgroundColor: '#E8F5E9',
  surfaceColor: '#FFFFFF',
  primaryColor: '#4A9D5A',
  shapeTypes: [
    'circle', 'square', 'triangle',
    'tree', 'leaf', 'mushroom', 'flower', 'butterfly', 'ladybug',
  ] as (BasicShapeType | ForestShapeType)[],
  allowedTransformations: ['color_change', 'size_change'] as TransformationType[],
  gridSize: '2x2',
  puzzleCount: 10,
  unlockCondition: { type: 'default' },
  difficultyRange: ['easy', 'easy'],
};

/** Space world - Intermediate level */
export const SPACE_WORLD: WorldConfig = {
  id: 'space',
  name: 'Station Spatiale',
  nameKey: 'matrices.worlds.space.name',
  description: 'Formes géométriques spatiales',
  descriptionKey: 'matrices.worlds.space.description',
  icon: '🚀',
  gradientColors: ['#667eea', '#764ba2'],
  backgroundColor: '#1A1A2E',
  surfaceColor: '#2D2D44',
  primaryColor: '#5B8DEE',
  shapeTypes: [
    'circle', 'square', 'triangle', 'hexagon', 'star',
    'planet', 'rocket', 'satellite', 'moon', 'meteor',
  ] as (BasicShapeType | SpaceShapeType)[],
  allowedTransformations: ['color_change', 'size_change', 'rotation'] as TransformationType[],
  gridSize: '3x3',
  puzzleCount: 10,
  unlockCondition: { type: 'complete_world', worldId: 'forest' },
  difficultyRange: ['easy', 'medium'],
};

/** Castle world - Advanced level */
export const CASTLE_WORLD: WorldConfig = {
  id: 'castle',
  name: 'Château Magique',
  nameKey: 'matrices.worlds.castle.name',
  description: 'Symboles fantastiques',
  descriptionKey: 'matrices.worlds.castle.description',
  icon: '🏰',
  gradientColors: ['#a18cd1', '#fbc2eb'],
  backgroundColor: '#F5E6FF',
  surfaceColor: '#FFFFFF',
  primaryColor: '#9B59B6',
  shapeTypes: [
    'circle', 'square', 'diamond', 'hexagon',
    'crown', 'key', 'shield', 'sword', 'gem', 'flag',
  ] as (BasicShapeType | CastleShapeType)[],
  allowedTransformations: [
    'color_change', 'size_change', 'rotation', 'addition',
  ] as TransformationType[],
  gridSize: '3x3',
  puzzleCount: 12,
  unlockCondition: { type: 'complete_world', worldId: 'space' },
  difficultyRange: ['medium', 'hard'],
};

/** Art world - Expert level */
export const ART_WORLD: WorldConfig = {
  id: 'art',
  name: "Atelier d'Artiste",
  nameKey: 'matrices.worlds.art.name',
  description: 'Formes abstraites',
  descriptionKey: 'matrices.worlds.art.description',
  icon: '🎨',
  gradientColors: ['#f093fb', '#f5576c'],
  backgroundColor: '#FFF0F5',
  surfaceColor: '#FFFFFF',
  primaryColor: '#E91E63',
  shapeTypes: [
    'circle', 'square', 'triangle', 'diamond', 'hexagon', 'pentagon',
    'spiral', 'wave', 'zigzag', 'dots', 'stripes', 'cross', 'arrow', 'heart',
  ] as (BasicShapeType | ArtShapeType)[],
  allowedTransformations: [
    'color_change', 'size_change', 'rotation', 'addition', 'fill_toggle',
  ] as TransformationType[],
  gridSize: '3x3',
  puzzleCount: 12,
  unlockCondition: { type: 'complete_world', worldId: 'castle' },
  difficultyRange: ['hard', 'expert'],
};

/** Mystery world - Ultimate challenges */
export const MYSTERY_WORLD: WorldConfig = {
  id: 'mystery',
  name: 'Dimension Mystère',
  nameKey: 'matrices.worlds.mystery.name',
  description: 'Défis ultimes pour les maîtres des patterns',
  descriptionKey: 'matrices.worlds.mystery.description',
  icon: '🌀',
  gradientColors: ['#a55eea', '#8854d0'],
  backgroundColor: '#2D3436',
  surfaceColor: '#3D4449',
  primaryColor: '#6C5CE7',
  shapeTypes: [
    'circle', 'square', 'triangle', 'diamond', 'hexagon', 'star', 'pentagon',
    'morphed', 'layered', 'split', 'merged',
  ] as (BasicShapeType | MysteryShapeType)[],
  allowedTransformations: [
    'color_change', 'size_change', 'rotation', 'addition', 'subtraction',
    'fill_toggle', 'reflection', 'superposition',
  ] as TransformationType[],
  gridSize: '3x3',
  puzzleCount: 15,
  unlockCondition: { type: 'complete_all' },
  difficultyRange: ['expert', 'expert'],
};

/** World order (IDs only) */
export const WORLD_ORDER: WorldTheme[] = [
  'forest',
  'space',
  'castle',
  'art',
  'mystery',
];

/** All worlds in order (as array) */
export const WORLDS_ARRAY: WorldConfig[] = [
  FOREST_WORLD,
  SPACE_WORLD,
  CASTLE_WORLD,
  ART_WORLD,
  MYSTERY_WORLD,
];

/** All worlds by ID (for quick access) */
export const WORLDS: Record<WorldTheme, WorldConfig> = {
  forest: FOREST_WORLD,
  space: SPACE_WORLD,
  castle: CASTLE_WORLD,
  art: ART_WORLD,
  mystery: MYSTERY_WORLD,
};

/** Get world by ID */
export function getWorldById(id: WorldTheme): WorldConfig | undefined {
  return WORLDS[id];
}

/** Get next world after current */
export function getNextWorld(currentId: WorldTheme): WorldConfig | undefined {
  const currentIndex = WORLD_ORDER.indexOf(currentId);
  if (currentIndex >= 0 && currentIndex < WORLD_ORDER.length - 1) {
    return WORLDS[WORLD_ORDER[currentIndex + 1]];
  }
  return undefined;
}

/** Check if world is unlocked based on progress */
export function isWorldUnlocked(
  worldId: WorldTheme,
  completedWorlds: WorldTheme[]
): boolean {
  const world = getWorldById(worldId);
  if (!world) return false;

  switch (world.unlockCondition.type) {
    case 'default':
      return true;
    case 'complete_world':
      return completedWorlds.includes(world.unlockCondition.worldId!);
    case 'complete_all':
      // All worlds except mystery must be completed
      return WORLD_ORDER.filter((id) => id !== 'mystery').every((id) =>
        completedWorlds.includes(id)
      );
    default:
      return false;
  }
}

/** Get world theme colors */
export function getWorldColors(worldId: WorldTheme) {
  const world = getWorldById(worldId);
  if (!world) {
    return {
      gradient: ['#6C5CE7', '#A29BFE'] as [string, string],
      background: '#F8F4FF',
      surface: '#FFFFFF',
      primary: '#6C5CE7',
    };
  }
  return {
    gradient: world.gradientColors,
    background: world.backgroundColor,
    surface: world.surfaceColor,
    primary: world.primaryColor,
  };
}
