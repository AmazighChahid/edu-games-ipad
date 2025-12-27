/**
 * Badge configurations for Matrices Magiques
 * Badges reward different types of achievements
 */

import { Badge, BadgeType, WorldTheme } from '../types';

/** All available badges */
export const BADGES: Badge[] = [
  {
    id: 'color_master',
    name: 'Maître des Couleurs',
    nameKey: 'badges.colorMaster.name',
    description: 'Tu as maîtrisé les transformations de couleur',
    descriptionKey: 'badges.colorMaster.description',
    icon: '🎨',
    condition: {
      type: 'transformation_mastery',
      value: 10, // 10 puzzles with color transformations
    },
  },
  {
    id: 'rotation_expert',
    name: 'Expert de la Rotation',
    nameKey: 'badges.rotationExpert.name',
    description: 'Tu fais tourner les formes comme un pro',
    descriptionKey: 'badges.rotationExpert.description',
    icon: '🔄',
    condition: {
      type: 'transformation_mastery',
      value: 10, // 10 puzzles with rotation
    },
  },
  {
    id: 'pattern_detective',
    name: 'Détective des Patterns',
    nameKey: 'badges.patternDetective.name',
    description: 'Tu trouves les règles très rapidement',
    descriptionKey: 'badges.patternDetective.description',
    icon: '🔍',
    condition: {
      type: 'speed',
      value: 5, // 5 puzzles solved in under 30 seconds each
    },
  },
  {
    id: 'no_hints_hero',
    name: 'Héros Sans Indice',
    nameKey: 'badges.noHintsHero.name',
    description: 'Tu as terminé un monde sans utiliser d\'indices',
    descriptionKey: 'badges.noHintsHero.description',
    icon: '💪',
    condition: {
      type: 'no_hints',
    },
  },
  {
    id: 'speed_solver',
    name: 'Solveur Rapide',
    nameKey: 'badges.speedSolver.name',
    description: 'Tu résous les puzzles à la vitesse de l\'éclair',
    descriptionKey: 'badges.speedSolver.description',
    icon: '⚡',
    condition: {
      type: 'speed',
      value: 10, // 10 puzzles solved quickly
    },
  },
  {
    id: 'perseverance',
    name: 'Persévérant',
    nameKey: 'badges.perseverance.name',
    description: 'Tu n\'abandonnes jamais, même quand c\'est difficile',
    descriptionKey: 'badges.perseverance.description',
    icon: '🌟',
    condition: {
      type: 'perseverance',
      value: 5, // 5 puzzles completed after 2+ attempts
    },
  },
  {
    id: 'world_conqueror',
    name: 'Conquérant du Monde',
    nameKey: 'badges.worldConqueror.name',
    description: 'Tu as terminé tous les puzzles d\'un monde',
    descriptionKey: 'badges.worldConqueror.description',
    icon: '🏆',
    condition: {
      type: 'completion',
    },
  },
  {
    id: 'ultimate_genius',
    name: 'Génie Ultime',
    nameKey: 'badges.ultimateGenius.name',
    description: 'Tu as conquis TOUS les mondes. Tu es un génie !',
    descriptionKey: 'badges.ultimateGenius.description',
    icon: '🧠',
    condition: {
      type: 'completion',
      value: 5, // All 5 worlds completed
    },
  },
];

/** Get badge by ID */
export function getBadgeById(id: BadgeType): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}

/** Check if badge is earned based on stats */
export interface BadgeCheckParams {
  colorPuzzlesSolved: number;
  rotationPuzzlesSolved: number;
  fastPuzzlesSolved: number;
  worldsCompletedWithoutHints: WorldTheme[];
  puzzlesWithMultipleAttempts: number;
  worldsCompleted: WorldTheme[];
  totalPuzzlesSolved: number;
}

export function checkBadgeEarned(
  badge: Badge,
  params: BadgeCheckParams
): boolean {
  switch (badge.condition.type) {
    case 'transformation_mastery':
      if (badge.id === 'color_master') {
        return params.colorPuzzlesSolved >= (badge.condition.value || 10);
      }
      if (badge.id === 'rotation_expert') {
        return params.rotationPuzzlesSolved >= (badge.condition.value || 10);
      }
      return false;

    case 'speed':
      return params.fastPuzzlesSolved >= (badge.condition.value || 5);

    case 'no_hints':
      return params.worldsCompletedWithoutHints.length > 0;

    case 'perseverance':
      return params.puzzlesWithMultipleAttempts >= (badge.condition.value || 5);

    case 'completion':
      if (badge.id === 'world_conqueror') {
        return params.worldsCompleted.length > 0;
      }
      if (badge.id === 'ultimate_genius') {
        return params.worldsCompleted.length >= 5;
      }
      return false;

    default:
      return false;
  }
}

/** Get all newly earned badges */
export function getNewlyEarnedBadges(
  currentBadges: BadgeType[],
  params: BadgeCheckParams
): Badge[] {
  const newBadges: Badge[] = [];

  for (const badge of BADGES) {
    if (!currentBadges.includes(badge.id)) {
      if (checkBadgeEarned(badge, params)) {
        newBadges.push(badge);
      }
    }
  }

  return newBadges;
}

/** Get badge display data for UI */
export interface BadgeDisplay {
  id: BadgeType;
  name: string;
  description: string;
  icon: string;
  isEarned: boolean;
  progress?: {
    current: number;
    target: number;
  };
}

export function getBadgeDisplayData(
  earnedBadges: BadgeType[],
  params: Partial<BadgeCheckParams>
): BadgeDisplay[] {
  return BADGES.map((badge) => {
    const isEarned = earnedBadges.includes(badge.id);
    let progress: { current: number; target: number } | undefined;

    // Calculate progress for non-earned badges
    if (!isEarned && badge.condition.value) {
      switch (badge.id) {
        case 'color_master':
          progress = {
            current: params.colorPuzzlesSolved || 0,
            target: badge.condition.value,
          };
          break;
        case 'rotation_expert':
          progress = {
            current: params.rotationPuzzlesSolved || 0,
            target: badge.condition.value,
          };
          break;
        case 'pattern_detective':
        case 'speed_solver':
          progress = {
            current: params.fastPuzzlesSolved || 0,
            target: badge.condition.value,
          };
          break;
        case 'perseverance':
          progress = {
            current: params.puzzlesWithMultipleAttempts || 0,
            target: badge.condition.value,
          };
          break;
        case 'ultimate_genius':
          progress = {
            current: params.worldsCompleted?.length || 0,
            target: 5,
          };
          break;
      }
    }

    return {
      id: badge.id,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      isEarned,
      progress,
    };
  });
}
