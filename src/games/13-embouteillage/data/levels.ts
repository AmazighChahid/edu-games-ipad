/**
 * Embouteillage - Level Configurations
 *
 * 10 niveaux progressifs pour le jeu Rush Hour
 * Chaque niveau définit la position initiale des véhicules
 * La voiture rouge (target) doit atteindre la sortie à droite (row 2, col 5)
 *
 * Grille 6x6 avec coordonnées :
 *   0 1 2 3 4 5
 * 0 . . . . . .
 * 1 . . . . . .
 * 2 . . . . . . → EXIT
 * 3 . . . . . .
 * 4 . . . . . .
 * 5 . . . . . .
 */

import type { EmbouteillageLevel, Vehicle } from '../types';

// ============================================
// PALETTE DE COULEURS DES VÉHICULES
// ============================================

export const VEHICLE_COLORS = {
  target: '#E53935', // Rouge vif - voiture à libérer
  blue: '#1E88E5',
  green: '#43A047',
  yellow: '#FDD835',
  purple: '#8E24AA',
  orange: '#FB8C00',
  teal: '#00897B',
  pink: '#D81B60',
  brown: '#6D4C41',
  lime: '#C0CA33',
  cyan: '#00ACC1',
  indigo: '#3949AB',
} as const;

// ============================================
// DÉFINITION DES 10 NIVEAUX
// ============================================

export const embouteillageLevels: EmbouteillageLevel[] = [
  // ============================================
  // NIVEAU 1 : Introduction (6-7 ans)
  // Très simple - 1 seul véhicule bloque
  // ============================================
  {
    id: 'level_1',
    gameId: 'embouteillage',
    difficulty: 'easy',
    displayOrder: 1,
    targetAge: 6,
    estimatedMinutes: 2,
    name: 'Premier parking',
    description: 'Libère la voiture rouge !',
    gridSize: 6,
    exitRow: 2,
    exitCol: 5,
    minMoves: 2,
    hintsAvailable: 3,
    vehicles: [
      // Voiture rouge (target) - horizontale, ligne 2
      { id: 'target', type: 'car', orientation: 'horizontal', length: 2, row: 2, col: 0, isTarget: true, color: VEHICLE_COLORS.target, label: 'Voiture rouge' },
      // Un seul bloqueur vertical
      { id: 'blue1', type: 'car', orientation: 'vertical', length: 2, row: 2, col: 4, isTarget: false, color: VEHICLE_COLORS.blue, label: 'Voiture bleue' },
    ],
  },

  // ============================================
  // NIVEAU 2 : Deux bloqueurs (6-7 ans)
  // ============================================
  {
    id: 'level_2',
    gameId: 'embouteillage',
    difficulty: 'easy',
    displayOrder: 2,
    targetAge: 6,
    estimatedMinutes: 3,
    name: 'Petit embouteillage',
    description: 'Deux voitures à déplacer',
    gridSize: 6,
    exitRow: 2,
    exitCol: 5,
    minMoves: 4,
    hintsAvailable: 3,
    vehicles: [
      { id: 'target', type: 'car', orientation: 'horizontal', length: 2, row: 2, col: 1, isTarget: true, color: VEHICLE_COLORS.target, label: 'Voiture rouge' },
      { id: 'blue1', type: 'car', orientation: 'vertical', length: 2, row: 1, col: 3, isTarget: false, color: VEHICLE_COLORS.blue, label: 'Voiture bleue' },
      { id: 'green1', type: 'car', orientation: 'vertical', length: 2, row: 2, col: 5, isTarget: false, color: VEHICLE_COLORS.green, label: 'Voiture verte' },
    ],
  },

  // ============================================
  // NIVEAU 3 : Premier camion (7 ans)
  // ============================================
  {
    id: 'level_3',
    gameId: 'embouteillage',
    difficulty: 'easy',
    displayOrder: 3,
    targetAge: 7,
    estimatedMinutes: 3,
    name: 'Le camion',
    description: 'Attention au camion !',
    gridSize: 6,
    exitRow: 2,
    exitCol: 5,
    minMoves: 5,
    hintsAvailable: 3,
    vehicles: [
      { id: 'target', type: 'car', orientation: 'horizontal', length: 2, row: 2, col: 0, isTarget: true, color: VEHICLE_COLORS.target, label: 'Voiture rouge' },
      { id: 'truck1', type: 'truck', orientation: 'vertical', length: 3, row: 1, col: 2, isTarget: false, color: VEHICLE_COLORS.yellow, label: 'Camion jaune' },
      { id: 'blue1', type: 'car', orientation: 'horizontal', length: 2, row: 0, col: 3, isTarget: false, color: VEHICLE_COLORS.blue, label: 'Voiture bleue' },
    ],
  },

  // ============================================
  // NIVEAU 4 : Configuration plus complexe (7-8 ans)
  // ============================================
  {
    id: 'level_4',
    gameId: 'embouteillage',
    difficulty: 'medium',
    displayOrder: 4,
    targetAge: 7,
    estimatedMinutes: 4,
    name: 'Parking bondé',
    description: 'Plus de véhicules à gérer',
    gridSize: 6,
    exitRow: 2,
    exitCol: 5,
    minMoves: 8,
    hintsAvailable: 2,
    vehicles: [
      { id: 'target', type: 'car', orientation: 'horizontal', length: 2, row: 2, col: 0, isTarget: true, color: VEHICLE_COLORS.target, label: 'Voiture rouge' },
      { id: 'blue1', type: 'car', orientation: 'vertical', length: 2, row: 0, col: 2, isTarget: false, color: VEHICLE_COLORS.blue, label: 'Voiture bleue' },
      { id: 'green1', type: 'car', orientation: 'vertical', length: 2, row: 2, col: 3, isTarget: false, color: VEHICLE_COLORS.green, label: 'Voiture verte' },
      { id: 'truck1', type: 'truck', orientation: 'horizontal', length: 3, row: 4, col: 2, isTarget: false, color: VEHICLE_COLORS.yellow, label: 'Camion jaune' },
      { id: 'purple1', type: 'car', orientation: 'vertical', length: 2, row: 1, col: 5, isTarget: false, color: VEHICLE_COLORS.purple, label: 'Voiture violette' },
    ],
  },

  // ============================================
  // NIVEAU 5 : Réflexion requise (8 ans)
  // ============================================
  {
    id: 'level_5',
    gameId: 'embouteillage',
    difficulty: 'medium',
    displayOrder: 5,
    targetAge: 8,
    estimatedMinutes: 5,
    name: 'Stratégie',
    description: 'Planifie tes mouvements',
    gridSize: 6,
    exitRow: 2,
    exitCol: 5,
    minMoves: 10,
    hintsAvailable: 2,
    vehicles: [
      { id: 'target', type: 'car', orientation: 'horizontal', length: 2, row: 2, col: 1, isTarget: true, color: VEHICLE_COLORS.target, label: 'Voiture rouge' },
      { id: 'truck1', type: 'truck', orientation: 'vertical', length: 3, row: 0, col: 0, isTarget: false, color: VEHICLE_COLORS.yellow, label: 'Camion jaune' },
      { id: 'blue1', type: 'car', orientation: 'horizontal', length: 2, row: 0, col: 3, isTarget: false, color: VEHICLE_COLORS.blue, label: 'Voiture bleue' },
      { id: 'green1', type: 'car', orientation: 'vertical', length: 2, row: 1, col: 3, isTarget: false, color: VEHICLE_COLORS.green, label: 'Voiture verte' },
      { id: 'orange1', type: 'car', orientation: 'vertical', length: 2, row: 3, col: 4, isTarget: false, color: VEHICLE_COLORS.orange, label: 'Voiture orange' },
      { id: 'truck2', type: 'truck', orientation: 'horizontal', length: 3, row: 5, col: 0, isTarget: false, color: VEHICLE_COLORS.teal, label: 'Camion turquoise' },
    ],
  },

  // ============================================
  // NIVEAU 6 : Encombré (8-9 ans)
  // ============================================
  {
    id: 'level_6',
    gameId: 'embouteillage',
    difficulty: 'medium',
    displayOrder: 6,
    targetAge: 8,
    estimatedMinutes: 6,
    name: 'Heure de pointe',
    description: 'Le parking est plein !',
    gridSize: 6,
    exitRow: 2,
    exitCol: 5,
    minMoves: 12,
    hintsAvailable: 2,
    vehicles: [
      { id: 'target', type: 'car', orientation: 'horizontal', length: 2, row: 2, col: 0, isTarget: true, color: VEHICLE_COLORS.target, label: 'Voiture rouge' },
      { id: 'truck1', type: 'truck', orientation: 'vertical', length: 3, row: 0, col: 2, isTarget: false, color: VEHICLE_COLORS.yellow, label: 'Camion jaune' },
      { id: 'truck2', type: 'truck', orientation: 'vertical', length: 3, row: 3, col: 2, isTarget: false, color: VEHICLE_COLORS.teal, label: 'Camion turquoise' },
      { id: 'blue1', type: 'car', orientation: 'horizontal', length: 2, row: 0, col: 4, isTarget: false, color: VEHICLE_COLORS.blue, label: 'Voiture bleue' },
      { id: 'green1', type: 'car', orientation: 'vertical', length: 2, row: 1, col: 4, isTarget: false, color: VEHICLE_COLORS.green, label: 'Voiture verte' },
      { id: 'purple1', type: 'car', orientation: 'horizontal', length: 2, row: 3, col: 4, isTarget: false, color: VEHICLE_COLORS.purple, label: 'Voiture violette' },
      { id: 'orange1', type: 'car', orientation: 'vertical', length: 2, row: 4, col: 0, isTarget: false, color: VEHICLE_COLORS.orange, label: 'Voiture orange' },
    ],
  },

  // ============================================
  // NIVEAU 7 : Défi (9 ans)
  // ============================================
  {
    id: 'level_7',
    gameId: 'embouteillage',
    difficulty: 'hard',
    displayOrder: 7,
    targetAge: 9,
    estimatedMinutes: 7,
    name: 'Le défi',
    description: 'Réfléchis bien avant de bouger',
    gridSize: 6,
    exitRow: 2,
    exitCol: 5,
    minMoves: 15,
    hintsAvailable: 2,
    vehicles: [
      { id: 'target', type: 'car', orientation: 'horizontal', length: 2, row: 2, col: 1, isTarget: true, color: VEHICLE_COLORS.target, label: 'Voiture rouge' },
      { id: 'truck1', type: 'truck', orientation: 'vertical', length: 3, row: 0, col: 0, isTarget: false, color: VEHICLE_COLORS.yellow, label: 'Camion jaune' },
      { id: 'blue1', type: 'car', orientation: 'vertical', length: 2, row: 0, col: 3, isTarget: false, color: VEHICLE_COLORS.blue, label: 'Voiture bleue' },
      { id: 'green1', type: 'car', orientation: 'horizontal', length: 2, row: 1, col: 4, isTarget: false, color: VEHICLE_COLORS.green, label: 'Voiture verte' },
      { id: 'truck2', type: 'truck', orientation: 'vertical', length: 3, row: 2, col: 4, isTarget: false, color: VEHICLE_COLORS.teal, label: 'Camion turquoise' },
      { id: 'purple1', type: 'car', orientation: 'horizontal', length: 2, row: 3, col: 0, isTarget: false, color: VEHICLE_COLORS.purple, label: 'Voiture violette' },
      { id: 'orange1', type: 'car', orientation: 'vertical', length: 2, row: 4, col: 2, isTarget: false, color: VEHICLE_COLORS.orange, label: 'Voiture orange' },
      { id: 'pink1', type: 'car', orientation: 'horizontal', length: 2, row: 5, col: 3, isTarget: false, color: VEHICLE_COLORS.pink, label: 'Voiture rose' },
    ],
  },

  // ============================================
  // NIVEAU 8 : Complexe (9-10 ans)
  // ============================================
  {
    id: 'level_8',
    gameId: 'embouteillage',
    difficulty: 'hard',
    displayOrder: 8,
    targetAge: 9,
    estimatedMinutes: 8,
    name: 'Embouteillage monstre',
    description: 'Un vrai casse-tête !',
    gridSize: 6,
    exitRow: 2,
    exitCol: 5,
    minMoves: 18,
    hintsAvailable: 1,
    vehicles: [
      { id: 'target', type: 'car', orientation: 'horizontal', length: 2, row: 2, col: 0, isTarget: true, color: VEHICLE_COLORS.target, label: 'Voiture rouge' },
      { id: 'truck1', type: 'truck', orientation: 'vertical', length: 3, row: 0, col: 2, isTarget: false, color: VEHICLE_COLORS.yellow, label: 'Camion jaune' },
      { id: 'truck2', type: 'truck', orientation: 'horizontal', length: 3, row: 0, col: 3, isTarget: false, color: VEHICLE_COLORS.teal, label: 'Camion turquoise' },
      { id: 'blue1', type: 'car', orientation: 'vertical', length: 2, row: 1, col: 5, isTarget: false, color: VEHICLE_COLORS.blue, label: 'Voiture bleue' },
      { id: 'green1', type: 'car', orientation: 'vertical', length: 2, row: 3, col: 3, isTarget: false, color: VEHICLE_COLORS.green, label: 'Voiture verte' },
      { id: 'purple1', type: 'car', orientation: 'horizontal', length: 2, row: 4, col: 0, isTarget: false, color: VEHICLE_COLORS.purple, label: 'Voiture violette' },
      { id: 'orange1', type: 'car', orientation: 'vertical', length: 2, row: 4, col: 4, isTarget: false, color: VEHICLE_COLORS.orange, label: 'Voiture orange' },
      { id: 'truck3', type: 'truck', orientation: 'horizontal', length: 3, row: 5, col: 1, isTarget: false, color: VEHICLE_COLORS.brown, label: 'Camion marron' },
      { id: 'pink1', type: 'car', orientation: 'vertical', length: 2, row: 3, col: 0, isTarget: false, color: VEHICLE_COLORS.pink, label: 'Voiture rose' },
    ],
  },

  // ============================================
  // NIVEAU 9 : Expert (10 ans)
  // ============================================
  {
    id: 'level_9',
    gameId: 'embouteillage',
    difficulty: 'hard',
    displayOrder: 9,
    targetAge: 10,
    estimatedMinutes: 10,
    name: 'Expert',
    description: 'Pour les vrais stratèges',
    gridSize: 6,
    exitRow: 2,
    exitCol: 5,
    minMoves: 22,
    hintsAvailable: 1,
    vehicles: [
      { id: 'target', type: 'car', orientation: 'horizontal', length: 2, row: 2, col: 1, isTarget: true, color: VEHICLE_COLORS.target, label: 'Voiture rouge' },
      { id: 'truck1', type: 'truck', orientation: 'vertical', length: 3, row: 0, col: 0, isTarget: false, color: VEHICLE_COLORS.yellow, label: 'Camion jaune' },
      { id: 'blue1', type: 'car', orientation: 'horizontal', length: 2, row: 0, col: 1, isTarget: false, color: VEHICLE_COLORS.blue, label: 'Voiture bleue' },
      { id: 'green1', type: 'car', orientation: 'vertical', length: 2, row: 0, col: 3, isTarget: false, color: VEHICLE_COLORS.green, label: 'Voiture verte' },
      { id: 'truck2', type: 'truck', orientation: 'vertical', length: 3, row: 0, col: 5, isTarget: false, color: VEHICLE_COLORS.teal, label: 'Camion turquoise' },
      { id: 'purple1', type: 'car', orientation: 'horizontal', length: 2, row: 1, col: 1, isTarget: false, color: VEHICLE_COLORS.purple, label: 'Voiture violette' },
      { id: 'orange1', type: 'car', orientation: 'vertical', length: 2, row: 2, col: 4, isTarget: false, color: VEHICLE_COLORS.orange, label: 'Voiture orange' },
      { id: 'truck3', type: 'truck', orientation: 'horizontal', length: 3, row: 3, col: 0, isTarget: false, color: VEHICLE_COLORS.brown, label: 'Camion marron' },
      { id: 'pink1', type: 'car', orientation: 'vertical', length: 2, row: 4, col: 2, isTarget: false, color: VEHICLE_COLORS.pink, label: 'Voiture rose' },
      { id: 'lime1', type: 'car', orientation: 'horizontal', length: 2, row: 4, col: 4, isTarget: false, color: VEHICLE_COLORS.lime, label: 'Voiture citron' },
      { id: 'cyan1', type: 'car', orientation: 'horizontal', length: 2, row: 5, col: 0, isTarget: false, color: VEHICLE_COLORS.cyan, label: 'Voiture cyan' },
    ],
  },

  // ============================================
  // NIVEAU 10 : Maître (10+ ans)
  // ============================================
  {
    id: 'level_10',
    gameId: 'embouteillage',
    difficulty: 'expert',
    displayOrder: 10,
    targetAge: 10,
    estimatedMinutes: 12,
    name: 'Maître du parking',
    description: 'Le puzzle ultime !',
    gridSize: 6,
    exitRow: 2,
    exitCol: 5,
    minMoves: 25,
    hintsAvailable: 1,
    vehicles: [
      { id: 'target', type: 'car', orientation: 'horizontal', length: 2, row: 2, col: 0, isTarget: true, color: VEHICLE_COLORS.target, label: 'Voiture rouge' },
      { id: 'truck1', type: 'truck', orientation: 'vertical', length: 3, row: 0, col: 2, isTarget: false, color: VEHICLE_COLORS.yellow, label: 'Camion jaune' },
      { id: 'truck2', type: 'truck', orientation: 'vertical', length: 3, row: 3, col: 2, isTarget: false, color: VEHICLE_COLORS.teal, label: 'Camion turquoise' },
      { id: 'blue1', type: 'car', orientation: 'horizontal', length: 2, row: 0, col: 0, isTarget: false, color: VEHICLE_COLORS.blue, label: 'Voiture bleue' },
      { id: 'green1', type: 'car', orientation: 'vertical', length: 2, row: 0, col: 4, isTarget: false, color: VEHICLE_COLORS.green, label: 'Voiture verte' },
      { id: 'purple1', type: 'car', orientation: 'horizontal', length: 2, row: 1, col: 3, isTarget: false, color: VEHICLE_COLORS.purple, label: 'Voiture violette' },
      { id: 'orange1', type: 'car', orientation: 'vertical', length: 2, row: 2, col: 4, isTarget: false, color: VEHICLE_COLORS.orange, label: 'Voiture orange' },
      { id: 'truck3', type: 'truck', orientation: 'horizontal', length: 3, row: 3, col: 3, isTarget: false, color: VEHICLE_COLORS.brown, label: 'Camion marron' },
      { id: 'pink1', type: 'car', orientation: 'vertical', length: 2, row: 4, col: 0, isTarget: false, color: VEHICLE_COLORS.pink, label: 'Voiture rose' },
      { id: 'lime1', type: 'car', orientation: 'horizontal', length: 2, row: 4, col: 4, isTarget: false, color: VEHICLE_COLORS.lime, label: 'Voiture citron' },
      { id: 'cyan1', type: 'car', orientation: 'vertical', length: 2, row: 5, col: 1, isTarget: false, color: VEHICLE_COLORS.cyan, label: 'Voiture cyan' },
      { id: 'indigo1', type: 'car', orientation: 'horizontal', length: 2, row: 5, col: 3, isTarget: false, color: VEHICLE_COLORS.indigo, label: 'Voiture indigo' },
    ],
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Obtient un niveau par son ID
 */
export function getLevel(levelId: string): EmbouteillageLevel | undefined {
  return embouteillageLevels.find((level) => level.id === levelId);
}

/**
 * Obtient le niveau par défaut (premier niveau)
 */
export function getDefaultLevel(): EmbouteillageLevel {
  return embouteillageLevels[0];
}

/**
 * Obtient un niveau par son ordre d'affichage
 */
export function getLevelByOrder(order: number): EmbouteillageLevel | undefined {
  return embouteillageLevels.find((level) => level.displayOrder === order);
}

/**
 * Obtient les niveaux par difficulté
 */
export function getLevelsByDifficulty(difficulty: 'easy' | 'medium' | 'hard' | 'expert'): EmbouteillageLevel[] {
  return embouteillageLevels.filter((level) => level.difficulty === difficulty);
}

/**
 * Obtient le niveau suivant
 */
export function getNextLevel(currentLevelId: string): EmbouteillageLevel | undefined {
  const currentLevel = getLevel(currentLevelId);
  if (!currentLevel) return undefined;
  return embouteillageLevels.find((level) => level.displayOrder === currentLevel.displayOrder + 1);
}

/**
 * Clone les véhicules d'un niveau (pour éviter les mutations)
 */
export function cloneVehicles(vehicles: Vehicle[]): Vehicle[] {
  return vehicles.map(v => ({ ...v }));
}

// ============================================
// EXPORTS
// ============================================

export { embouteillageLevels as levels };
