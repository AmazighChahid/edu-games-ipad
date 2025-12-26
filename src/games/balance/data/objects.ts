/**
 * Weight objects definitions for Balance game
 * Complete library with fruits, animals, weights, and unknown objects
 */

import type { WeightObject, ObjectCategory } from '../types';

// ============================================
// WEIGHT VALUES
// ============================================

// Fruits (Phase 1 & 2)
export const WEIGHT_STRAWBERRY = 0.5;
export const WEIGHT_APPLE = 1;
export const WEIGHT_ORANGE = 1.5;
export const WEIGHT_BANANA = 2;
export const WEIGHT_WATERMELON = 3;
export const WEIGHT_PINEAPPLE = 4;

// Animals (Phase 2)
export const WEIGHT_MOUSE = 0.5;
export const WEIGHT_RABBIT = 2;
export const WEIGHT_CAT = 3;
export const WEIGHT_BEAR = 4;
export const WEIGHT_ELEPHANT = 5;

// ============================================
// OBJECTS LIBRARY
// ============================================

export const OBJECTS_LIBRARY: Record<string, Omit<WeightObject, 'id'>> = {
  // ============================================
  // FRUITS
  // ============================================
  strawberry: {
    type: 'fruit',
    name: 'Fraise',
    value: WEIGHT_STRAWBERRY,
    emoji: '🍓',
    color: '#E91E63',
  },
  apple: {
    type: 'fruit',
    name: 'Pomme',
    value: WEIGHT_APPLE,
    emoji: '🍎',
    color: '#E74C3C',
  },
  orange: {
    type: 'fruit',
    name: 'Orange',
    value: WEIGHT_ORANGE,
    emoji: '🍊',
    color: '#FF9800',
  },
  banana: {
    type: 'fruit',
    name: 'Banane',
    value: WEIGHT_BANANA,
    emoji: '🍌',
    color: '#F1C40F',
  },
  watermelon: {
    type: 'fruit',
    name: 'Pastèque',
    value: WEIGHT_WATERMELON,
    emoji: '🍉',
    color: '#2ECC71',
  },
  pineapple: {
    type: 'fruit',
    name: 'Ananas',
    value: WEIGHT_PINEAPPLE,
    emoji: '🍍',
    color: '#F39C12',
  },

  // ============================================
  // ANIMALS
  // ============================================
  mouse: {
    type: 'animal',
    name: 'Souris',
    value: WEIGHT_MOUSE,
    emoji: '🐭',
    color: '#95A5A6',
  },
  rabbit: {
    type: 'animal',
    name: 'Lapin',
    value: WEIGHT_RABBIT,
    emoji: '🐰',
    color: '#FFECD2',
  },
  cat: {
    type: 'animal',
    name: 'Chat',
    value: WEIGHT_CAT,
    emoji: '🐱',
    color: '#FFB347',
  },
  bear: {
    type: 'animal',
    name: 'Ours',
    value: WEIGHT_BEAR,
    emoji: '🐻',
    color: '#8B4513',
  },
  elephant: {
    type: 'animal',
    name: 'Éléphant',
    value: WEIGHT_ELEPHANT,
    emoji: '🐘',
    color: '#7F8C8D',
  },

  // ============================================
  // NUMERIC WEIGHTS (Phase 3)
  // ============================================
  weight_1: {
    type: 'weight',
    name: '1',
    value: 1,
    displayValue: 1,
    emoji: '1️⃣',
    color: '#3498DB',
  },
  weight_2: {
    type: 'weight',
    name: '2',
    value: 2,
    displayValue: 2,
    emoji: '2️⃣',
    color: '#9B59B6',
  },
  weight_3: {
    type: 'weight',
    name: '3',
    value: 3,
    displayValue: 3,
    emoji: '3️⃣',
    color: '#1ABC9C',
  },
  weight_4: {
    type: 'weight',
    name: '4',
    value: 4,
    displayValue: 4,
    emoji: '4️⃣',
    color: '#E67E22',
  },
  weight_5: {
    type: 'weight',
    name: '5',
    value: 5,
    displayValue: 5,
    emoji: '5️⃣',
    color: '#E056FD',
  },
  weight_6: {
    type: 'weight',
    name: '6',
    value: 6,
    displayValue: 6,
    emoji: '6️⃣',
    color: '#00BCD4',
  },
  weight_7: {
    type: 'weight',
    name: '7',
    value: 7,
    displayValue: 7,
    emoji: '7️⃣',
    color: '#FF5722',
  },
  weight_8: {
    type: 'weight',
    name: '8',
    value: 8,
    displayValue: 8,
    emoji: '8️⃣',
    color: '#673AB7',
  },
  weight_9: {
    type: 'weight',
    name: '9',
    value: 9,
    displayValue: 9,
    emoji: '9️⃣',
    color: '#4CAF50',
  },
  weight_10: {
    type: 'weight',
    name: '10',
    value: 10,
    displayValue: 10,
    emoji: '🔟',
    color: '#F44336',
  },

  // ============================================
  // UNKNOWN (Phase 4 - Equations)
  // ============================================
  unknown: {
    type: 'unknown',
    name: 'Inconnue',
    value: 0, // Will be set dynamically per puzzle
    emoji: '❓',
    color: '#E056FD',
    isUnknown: true,
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

let objectCounter = 0;

/**
 * Generate unique ID for object instances
 */
function generateId(): string {
  objectCounter += 1;
  return `obj_${Date.now()}_${objectCounter}_${Math.random().toString(36).substr(2, 5)}`;
}

/**
 * Create a single weight object instance
 */
export function createObject(
  type: keyof typeof OBJECTS_LIBRARY,
  customId?: string,
  overrideValue?: number
): WeightObject {
  const template = OBJECTS_LIBRARY[type];
  if (!template) {
    throw new Error(`Unknown object type: ${type}`);
  }

  return {
    ...template,
    id: customId || generateId(),
    value: overrideValue ?? template.value,
  };
}

/**
 * Create multiple instances of the same object type
 */
export function createMultipleObjects(
  type: keyof typeof OBJECTS_LIBRARY,
  count: number
): WeightObject[] {
  return Array.from({ length: count }, () => createObject(type));
}

/**
 * Create an unknown object with specific value
 */
export function createUnknownObject(targetValue: number, customId?: string): WeightObject {
  return {
    ...OBJECTS_LIBRARY.unknown,
    id: customId || generateId(),
    value: targetValue,
    isUnknown: true,
  };
}

/**
 * Get object template by ID
 */
export function getObjectTemplate(objectId: string): Omit<WeightObject, 'id'> | undefined {
  return OBJECTS_LIBRARY[objectId];
}

/**
 * Get all objects by category
 */
export function getObjectsByCategory(category: ObjectCategory): WeightObject[] {
  return Object.entries(OBJECTS_LIBRARY)
    .filter(([_, obj]) => obj.type === category)
    .map(([key, obj]) => ({ ...obj, id: key }));
}

/**
 * Get emoji representation for an object count
 */
export function getObjectEmojis(objectId: string, count: number): string {
  const template = OBJECTS_LIBRARY[objectId];
  if (!template) return '';
  return Array(count).fill(template.emoji).join('');
}

/**
 * Format equivalence for display
 */
export function formatEquivalence(
  leftSide: { objectId: string; count: number }[],
  rightSide: { objectId: string; count: number }[]
): string {
  const left = leftSide
    .map(({ objectId, count }) => getObjectEmojis(objectId, count))
    .join(' ');
  const right = rightSide
    .map(({ objectId, count }) => getObjectEmojis(objectId, count))
    .join(' ');
  return `${left} = ${right}`;
}

// ============================================
// SANDBOX MODE - All Objects
// ============================================

export const SANDBOX_OBJECTS: string[] = [
  // Fruits
  'strawberry',
  'apple',
  'orange',
  'banana',
  'watermelon',
  'pineapple',
  // Animals
  'mouse',
  'rabbit',
  'cat',
  'bear',
  'elephant',
  // Weights
  'weight_1',
  'weight_2',
  'weight_3',
  'weight_4',
  'weight_5',
  'weight_6',
  'weight_7',
  'weight_8',
  'weight_9',
  'weight_10',
];
