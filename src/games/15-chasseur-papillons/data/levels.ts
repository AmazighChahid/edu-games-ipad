/**
 * Chasseur de Papillons - Level Configurations
 *
 * 10 niveaux progressifs de 5 à 10 ans :
 * - Niveaux 1-3 : Facile (règles simples, couleurs uniquement)
 * - Niveaux 4-6 : Moyen (patterns, tailles, combinaisons simples)
 * - Niveaux 7-10 : Difficile (règles négatives, combinaisons complexes)
 */

import type { ChasseurLevel, GameRule, ButterflyColor, ButterflyPattern, ButterflySize } from '../types';

// ============================================
// RÈGLES DE JEU PAR TYPE
// ============================================

// Traductions françaises des couleurs
const COLOR_NAMES: Record<ButterflyColor, string> = {
  red: 'rouges',
  blue: 'bleus',
  yellow: 'jaunes',
  green: 'verts',
  purple: 'violets',
  orange: 'oranges',
  pink: 'roses',
};

const COLOR_ICONS: Record<ButterflyColor, string> = {
  red: '🔴',
  blue: '🔵',
  yellow: '🟡',
  green: '🟢',
  purple: '🟣',
  orange: '🟠',
  pink: '🩷',
};

const SIZE_NAMES: Record<ButterflySize, string> = {
  small: 'petits',
  medium: 'moyens',
  large: 'grands',
};

const PATTERN_NAMES: Record<ButterflyPattern, string> = {
  solid: 'unis',
  striped: 'rayés',
  spotted: 'à pois',
  gradient: 'dégradés',
  hearts: 'à coeurs',
  stars: 'étoilés',
};

// ============================================
// GÉNÉRATEURS DE RÈGLES
// ============================================

function createColorRule(color: ButterflyColor): GameRule {
  return {
    id: `color_${color}`,
    type: 'color',
    values: [color],
    description: `Attrape les papillons ${COLOR_NAMES[color]} !`,
    iconHint: COLOR_ICONS[color],
    shortText: COLOR_NAMES[color].charAt(0).toUpperCase() + COLOR_NAMES[color].slice(1),
  };
}

function createTwoColorsRule(color1: ButterflyColor, color2: ButterflyColor): GameRule {
  return {
    id: `two_colors_${color1}_${color2}`,
    type: 'two_colors',
    values: [color1, color2],
    description: `Attrape les papillons ${COLOR_NAMES[color1]} ou ${COLOR_NAMES[color2]} !`,
    iconHint: `${COLOR_ICONS[color1]}${COLOR_ICONS[color2]}`,
    shortText: `${COLOR_NAMES[color1]} ou ${COLOR_NAMES[color2]}`,
  };
}

function createSizeRule(size: ButterflySize): GameRule {
  return {
    id: `size_${size}`,
    type: 'size',
    values: [size],
    description: `Attrape les ${SIZE_NAMES[size]} papillons !`,
    iconHint: size === 'small' ? '🦋' : size === 'medium' ? '🦋🦋' : '🦋🦋🦋',
    shortText: SIZE_NAMES[size].charAt(0).toUpperCase() + SIZE_NAMES[size].slice(1),
  };
}

function createPatternRule(pattern: ButterflyPattern): GameRule {
  const icons: Record<ButterflyPattern, string> = {
    solid: '⬛',
    striped: '📏',
    spotted: '🔘',
    gradient: '🌈',
    hearts: '💕',
    stars: '⭐',
  };
  return {
    id: `pattern_${pattern}`,
    type: 'pattern',
    values: [pattern],
    description: `Attrape les papillons ${PATTERN_NAMES[pattern]} !`,
    iconHint: icons[pattern],
    shortText: PATTERN_NAMES[pattern].charAt(0).toUpperCase() + PATTERN_NAMES[pattern].slice(1),
  };
}

function createNotColorRule(color: ButterflyColor): GameRule {
  return {
    id: `not_color_${color}`,
    type: 'not_color',
    values: [color],
    description: `Attrape TOUS les papillons SAUF les ${COLOR_NAMES[color]} !`,
    iconHint: `🚫${COLOR_ICONS[color]}`,
    shortText: `Pas ${COLOR_NAMES[color]}`,
  };
}

function createColorAndSizeRule(color: ButterflyColor, size: ButterflySize): GameRule {
  return {
    id: `color_size_${color}_${size}`,
    type: 'color_and_size',
    values: [color, size],
    description: `Attrape les ${SIZE_NAMES[size]} papillons ${COLOR_NAMES[color]} !`,
    iconHint: `${COLOR_ICONS[color]}`,
    shortText: `${SIZE_NAMES[size]} ${COLOR_NAMES[color]}`,
  };
}

// ============================================
// DÉFINITION DES 10 NIVEAUX
// ============================================

export const chasseurLevels: ChasseurLevel[] = [
  // ==========================================
  // NIVEAU 1 : Introduction aux couleurs (5-6 ans)
  // ==========================================
  {
    id: 'level_1',
    gameId: 'chasseur-papillons',
    difficulty: 'easy',
    displayOrder: 1,
    targetAge: 5,
    estimatedMinutes: 3,
    name: 'Premières couleurs',
    description: 'Attrape les papillons d\'une seule couleur',
    difficultyLevel: 1,
    rules: [
      createColorRule('blue'),
      createColorRule('red'),
      createColorRule('yellow'),
    ],
    butterfliesPerWave: 5,
    waveDuration: 30,
    totalWaves: 3,
    targetCatchRate: 0.6,
    distractorRatio: 0.3,
    butterflySpeed: 0.5,
    hintsAvailable: 3,
    availableColors: ['blue', 'red', 'yellow'],
    availablePatterns: ['solid'],
    availableSizes: ['medium'],
  },

  // ==========================================
  // NIVEAU 2 : Plus de couleurs (5-6 ans)
  // ==========================================
  {
    id: 'level_2',
    gameId: 'chasseur-papillons',
    difficulty: 'easy',
    displayOrder: 2,
    targetAge: 6,
    estimatedMinutes: 3,
    name: 'Arc-en-ciel',
    description: 'Plus de couleurs à reconnaître',
    difficultyLevel: 2,
    rules: [
      createColorRule('green'),
      createColorRule('purple'),
      createColorRule('orange'),
      createColorRule('blue'),
    ],
    butterfliesPerWave: 6,
    waveDuration: 30,
    totalWaves: 3,
    targetCatchRate: 0.6,
    distractorRatio: 0.4,
    butterflySpeed: 0.6,
    hintsAvailable: 3,
    availableColors: ['blue', 'red', 'yellow', 'green', 'purple', 'orange'],
    availablePatterns: ['solid'],
    availableSizes: ['medium'],
  },

  // ==========================================
  // NIVEAU 3 : Tailles (6-7 ans)
  // ==========================================
  {
    id: 'level_3',
    gameId: 'chasseur-papillons',
    difficulty: 'easy',
    displayOrder: 3,
    targetAge: 6,
    estimatedMinutes: 4,
    name: 'Petits et grands',
    description: 'Reconnaître les différentes tailles',
    difficultyLevel: 3,
    rules: [
      createSizeRule('small'),
      createSizeRule('large'),
      createColorRule('blue'),
      createColorRule('red'),
    ],
    butterfliesPerWave: 6,
    waveDuration: 30,
    totalWaves: 4,
    targetCatchRate: 0.65,
    distractorRatio: 0.4,
    butterflySpeed: 0.7,
    hintsAvailable: 3,
    availableColors: ['blue', 'red', 'yellow', 'green'],
    availablePatterns: ['solid'],
    availableSizes: ['small', 'medium', 'large'],
  },

  // ==========================================
  // NIVEAU 4 : Patterns simples (7 ans)
  // ==========================================
  {
    id: 'level_4',
    gameId: 'chasseur-papillons',
    difficulty: 'medium',
    displayOrder: 4,
    targetAge: 7,
    estimatedMinutes: 4,
    name: 'Motifs magiques',
    description: 'Repérer les motifs sur les ailes',
    difficultyLevel: 4,
    rules: [
      createPatternRule('striped'),
      createPatternRule('spotted'),
      createColorRule('purple'),
      createSizeRule('large'),
    ],
    butterfliesPerWave: 7,
    waveDuration: 35,
    totalWaves: 4,
    targetCatchRate: 0.65,
    distractorRatio: 0.45,
    butterflySpeed: 0.8,
    hintsAvailable: 2,
    availableColors: ['blue', 'red', 'yellow', 'green', 'purple', 'orange'],
    availablePatterns: ['solid', 'striped', 'spotted'],
    availableSizes: ['small', 'medium', 'large'],
  },

  // ==========================================
  // NIVEAU 5 : Deux couleurs (7-8 ans)
  // ==========================================
  {
    id: 'level_5',
    gameId: 'chasseur-papillons',
    difficulty: 'medium',
    displayOrder: 5,
    targetAge: 7,
    estimatedMinutes: 5,
    name: 'Double couleur',
    description: 'Attrape deux couleurs à la fois',
    difficultyLevel: 5,
    rules: [
      createTwoColorsRule('blue', 'yellow'),
      createTwoColorsRule('red', 'green'),
      createTwoColorsRule('purple', 'orange'),
      createPatternRule('spotted'),
    ],
    butterfliesPerWave: 8,
    waveDuration: 35,
    totalWaves: 4,
    targetCatchRate: 0.65,
    distractorRatio: 0.4,
    butterflySpeed: 0.9,
    hintsAvailable: 2,
    availableColors: ['blue', 'red', 'yellow', 'green', 'purple', 'orange'],
    availablePatterns: ['solid', 'striped', 'spotted'],
    availableSizes: ['small', 'medium', 'large'],
  },

  // ==========================================
  // NIVEAU 6 : Combinaisons couleur+taille (8 ans)
  // ==========================================
  {
    id: 'level_6',
    gameId: 'chasseur-papillons',
    difficulty: 'medium',
    displayOrder: 6,
    targetAge: 8,
    estimatedMinutes: 5,
    name: 'Double critère',
    description: 'Couleur ET taille à la fois',
    difficultyLevel: 6,
    rules: [
      createColorAndSizeRule('blue', 'large'),
      createColorAndSizeRule('red', 'small'),
      createColorAndSizeRule('green', 'medium'),
      createTwoColorsRule('yellow', 'purple'),
    ],
    butterfliesPerWave: 8,
    waveDuration: 40,
    totalWaves: 5,
    targetCatchRate: 0.6,
    distractorRatio: 0.5,
    butterflySpeed: 1.0,
    hintsAvailable: 2,
    availableColors: ['blue', 'red', 'yellow', 'green', 'purple', 'orange'],
    availablePatterns: ['solid', 'striped', 'spotted', 'gradient'],
    availableSizes: ['small', 'medium', 'large'],
  },

  // ==========================================
  // NIVEAU 7 : Règles négatives (8-9 ans)
  // ==========================================
  {
    id: 'level_7',
    gameId: 'chasseur-papillons',
    difficulty: 'hard',
    displayOrder: 7,
    targetAge: 8,
    estimatedMinutes: 6,
    name: 'Attention !',
    description: 'Attrape TOUS sauf une couleur',
    difficultyLevel: 7,
    rules: [
      createNotColorRule('red'),
      createNotColorRule('blue'),
      createNotColorRule('yellow'),
      createColorAndSizeRule('purple', 'large'),
    ],
    butterfliesPerWave: 9,
    waveDuration: 40,
    totalWaves: 5,
    targetCatchRate: 0.6,
    distractorRatio: 0.3, // Moins de distracteurs car la règle est inversée
    butterflySpeed: 1.1,
    hintsAvailable: 2,
    availableColors: ['blue', 'red', 'yellow', 'green', 'purple', 'orange', 'pink'],
    availablePatterns: ['solid', 'striped', 'spotted', 'gradient'],
    availableSizes: ['small', 'medium', 'large'],
  },

  // ==========================================
  // NIVEAU 8 : Patterns avancés (9 ans)
  // ==========================================
  {
    id: 'level_8',
    gameId: 'chasseur-papillons',
    difficulty: 'hard',
    displayOrder: 8,
    targetAge: 9,
    estimatedMinutes: 6,
    name: 'Expert motifs',
    description: 'Motifs complexes et rapides',
    difficultyLevel: 8,
    rules: [
      createPatternRule('hearts'),
      createPatternRule('stars'),
      createPatternRule('gradient'),
      createNotColorRule('green'),
      createTwoColorsRule('pink', 'purple'),
    ],
    butterfliesPerWave: 10,
    waveDuration: 45,
    totalWaves: 5,
    targetCatchRate: 0.55,
    distractorRatio: 0.5,
    butterflySpeed: 1.2,
    hintsAvailable: 1,
    availableColors: ['blue', 'red', 'yellow', 'green', 'purple', 'orange', 'pink'],
    availablePatterns: ['solid', 'striped', 'spotted', 'gradient', 'hearts', 'stars'],
    availableSizes: ['small', 'medium', 'large'],
  },

  // ==========================================
  // NIVEAU 9 : Multi-critères (9-10 ans)
  // ==========================================
  {
    id: 'level_9',
    gameId: 'chasseur-papillons',
    difficulty: 'hard',
    displayOrder: 9,
    targetAge: 9,
    estimatedMinutes: 7,
    name: 'Champion',
    description: 'Règles changeantes et rapides',
    difficultyLevel: 9,
    rules: [
      createColorAndSizeRule('blue', 'small'),
      createColorAndSizeRule('red', 'large'),
      createNotColorRule('orange'),
      createPatternRule('stars'),
      createTwoColorsRule('green', 'purple'),
    ],
    butterfliesPerWave: 10,
    waveDuration: 45,
    totalWaves: 6,
    targetCatchRate: 0.5,
    distractorRatio: 0.55,
    butterflySpeed: 1.3,
    hintsAvailable: 1,
    availableColors: ['blue', 'red', 'yellow', 'green', 'purple', 'orange', 'pink'],
    availablePatterns: ['solid', 'striped', 'spotted', 'gradient', 'hearts', 'stars'],
    availableSizes: ['small', 'medium', 'large'],
  },

  // ==========================================
  // NIVEAU 10 : Maître chasseur (10 ans)
  // ==========================================
  {
    id: 'level_10',
    gameId: 'chasseur-papillons',
    difficulty: 'hard',
    displayOrder: 10,
    targetAge: 10,
    estimatedMinutes: 8,
    name: 'Maître chasseur',
    description: 'Le défi ultime !',
    difficultyLevel: 10,
    rules: [
      createColorAndSizeRule('pink', 'small'),
      createNotColorRule('yellow'),
      createPatternRule('hearts'),
      createTwoColorsRule('blue', 'purple'),
      createColorAndSizeRule('orange', 'large'),
      createPatternRule('gradient'),
    ],
    butterfliesPerWave: 12,
    waveDuration: 50,
    totalWaves: 6,
    targetCatchRate: 0.5,
    distractorRatio: 0.6,
    butterflySpeed: 1.5,
    hintsAvailable: 1,
    availableColors: ['blue', 'red', 'yellow', 'green', 'purple', 'orange', 'pink'],
    availablePatterns: ['solid', 'striped', 'spotted', 'gradient', 'hearts', 'stars'],
    availableSizes: ['small', 'medium', 'large'],
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Obtient un niveau par son ID
 */
export function getLevel(levelId: string): ChasseurLevel | undefined {
  return chasseurLevels.find((level) => level.id === levelId);
}

/**
 * Obtient le niveau par défaut (premier niveau)
 */
export function getDefaultLevel(): ChasseurLevel {
  return chasseurLevels[0];
}

/**
 * Obtient un niveau par son ordre d'affichage
 */
export function getLevelByOrder(order: number): ChasseurLevel | undefined {
  return chasseurLevels.find((level) => level.displayOrder === order);
}

/**
 * Obtient les niveaux par difficulté
 */
export function getLevelsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): ChasseurLevel[] {
  return chasseurLevels.filter((level) => level.difficulty === difficulty);
}

/**
 * Obtient le niveau suivant
 */
export function getNextLevel(currentLevelId: string): ChasseurLevel | undefined {
  const currentLevel = getLevel(currentLevelId);
  if (!currentLevel) return undefined;
  return chasseurLevels.find((level) => level.displayOrder === currentLevel.displayOrder + 1);
}

/**
 * Sélectionne une règle aléatoire pour un niveau
 */
export function getRandomRuleForLevel(levelId: string): GameRule | undefined {
  const level = getLevel(levelId);
  if (!level || level.rules.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * level.rules.length);
  return level.rules[randomIndex];
}

/**
 * Vérifie si un papillon correspond à une règle
 */
export function matchesRule(
  butterfly: { color: ButterflyColor; pattern: ButterflyPattern; size: ButterflySize },
  rule: GameRule
): boolean {
  switch (rule.type) {
    case 'color':
      return butterfly.color === rule.values[0];

    case 'pattern':
      return butterfly.pattern === rule.values[0];

    case 'size':
      return butterfly.size === rule.values[0];

    case 'two_colors':
      return rule.values.includes(butterfly.color);

    case 'not_color':
      return butterfly.color !== rule.values[0];

    case 'color_and_size':
      return butterfly.color === rule.values[0] && butterfly.size === rule.values[1];

    case 'not_size':
      return butterfly.size !== rule.values[0];

    case 'color_or_pattern':
      return butterfly.color === rule.values[0] || butterfly.pattern === rule.values[1];

    case 'size_and_pattern':
      return butterfly.size === rule.values[0] && butterfly.pattern === rule.values[1];

    default:
      return false;
  }
}

// ============================================
// EXPORTS
// ============================================

export { COLOR_NAMES, COLOR_ICONS, SIZE_NAMES, PATTERN_NAMES };
