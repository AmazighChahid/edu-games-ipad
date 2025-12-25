/**
 * Game registry
 * Central catalog of all available games
 */

import type { GameMetadata } from '@/types';

export const gameRegistry: GameMetadata[] = [
  {
    id: 'hanoi',
    name: 'Tour de Hanoï',
    nameKey: 'games.hanoi.name',
    description: 'Déplace les disques d\'une tour à l\'autre',
    descriptionKey: 'games.hanoi.description',
    icon: null,
    minAge: 6,
    maxAge: 10,
    category: 'logic',
    skills: ['planning', 'problem_solving', 'sequencing', 'perseverance'],
    status: 'available',
    route: '/(games)/hanoi',
  },
  {
    id: 'math-blocks',
    name: 'MathBlocks',
    nameKey: 'games.mathblocks.name',
    description: 'Associe les calculs avec leurs résultats',
    descriptionKey: 'games.mathblocks.description',
    icon: null,
    minAge: 5,
    maxAge: 12,
    category: 'math',
    skills: ['concentration', 'problem_solving', 'pattern_recognition'],
    status: 'available',
    route: '/(games)/math-blocks',
  },
  {
    id: 'calcul-pose',
    name: 'Calcul Posé',
    nameKey: 'games.calculpose.name',
    description: 'Pose tes calculs et dessine le résultat',
    descriptionKey: 'games.calculpose.description',
    icon: null,
    minAge: 6,
    maxAge: 10,
    category: 'math',
    skills: ['problem_solving', 'concentration', 'pattern_recognition'],
    status: 'available',
    route: '/(games)/calcul-pose',
  },
  {
    id: 'memory',
    name: 'Memory',
    nameKey: 'games.memory.name',
    description: 'Trouve les paires d\'images',
    descriptionKey: 'games.memory.description',
    icon: null,
    minAge: 5,
    maxAge: 8,
    category: 'memory',
    skills: ['working_memory', 'concentration', 'pattern_recognition'],
    status: 'coming_soon',
    route: '/(games)/memory',
  },
];

export const getGameById = (id: string): GameMetadata | undefined => {
  return gameRegistry.find((game) => game.id === id);
};

export const getAvailableGames = (): GameMetadata[] => {
  return gameRegistry.filter((game) => game.status === 'available');
};
