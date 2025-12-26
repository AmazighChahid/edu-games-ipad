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
    id: 'sudoku',
    name: 'Sudoku Montessori',
    nameKey: 'games.sudoku.name',
    description: 'Complète la grille avec logique',
    descriptionKey: 'games.sudoku.description',
    icon: null,
    minAge: 6,
    maxAge: 10,
    category: 'logic',
    skills: ['deductive_reasoning', 'concentration', 'patience', 'systematic_thinking'],
    status: 'available',
    route: '/(games)/sudoku',
  },
  {
    id: 'suites-logiques',
    name: 'Suites Logiques',
    nameKey: 'games.suiteslogiques.name',
    description: 'Découvre les motifs et complète les suites',
    descriptionKey: 'games.suiteslogiques.description',
    icon: null,
    minAge: 6,
    maxAge: 10,
    category: 'logic',
    skills: ['pattern_recognition', 'deductive_reasoning', 'sequencing', 'problem_solving'],
    status: 'available',
    route: '/(games)/suites-logiques',
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
