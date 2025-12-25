/**
 * Types pour le jeu Tour de Hanoï
 * Design moderne 6-10 ans
 */

import { Colors } from '../../constants';

// Un disque individuel
export interface Disc {
  id: string;
  size: number;  // 1 = petit, n = grand (extensible jusqu'à 7)
  color: string;
}

// Une tour (piquet)
export interface Tower {
  id: number;    // 0 = gauche, 1 = centre, 2 = droite
  discs: Disc[]; // Stack : le dernier élément est au sommet
}

// Modes de jeu disponibles
export type GameMode = 'discovery' | 'challenge' | 'expert';

// État complet du jeu
export interface GameState {
  towers: Tower[];
  moveCount: number;
  isComplete: boolean;
  startTime: number | null;
  selectedTower: number | null;
}

// Information sur un mouvement
export interface Move {
  fromTower: number;
  toTower: number;
  disc: Disc;
}

// Résultat d'une tentative de mouvement
export interface MoveResult {
  success: boolean;
  message?: string;
  newState?: GameState;
}

// Configuration du niveau
export interface LevelConfig {
  discCount: number;
  targetTower: number;
  mode: GameMode;
}

// Configuration des modes de jeu
export interface GameModeConfig {
  id: GameMode;
  label: string;
  description: string;
  minDiscs: number;
  maxDiscs: number;
  hintsEnabled: boolean;
  maxHints: number;
  showOptimal: boolean;
  blockInvalidMoves: boolean;
}

export const GAME_MODES: GameModeConfig[] = [
  {
    id: 'discovery',
    label: 'Découverte',
    description: '3-5 disques, avec aide',
    minDiscs: 3,
    maxDiscs: 5,
    hintsEnabled: true,
    maxHints: 5,
    showOptimal: false,
    blockInvalidMoves: true,
  },
  {
    id: 'challenge',
    label: 'Défi',
    description: '5-7 disques, indices limités',
    minDiscs: 5,
    maxDiscs: 7,
    hintsEnabled: true,
    maxHints: 3,
    showOptimal: true,
    blockInvalidMoves: true,
  },
  {
    id: 'expert',
    label: 'Expert',
    description: 'Sans aide',
    minDiscs: 5,
    maxDiscs: 7,
    hintsEnabled: false,
    maxHints: 0,
    showOptimal: true,
    blockInvalidMoves: false,
  },
];

// Obtenir la couleur d'un disque par sa taille (1-indexed)
export const getDiscColor = (size: number): string => {
  const colors = Colors.discs as string[];
  const index = Math.max(0, Math.min(size - 1, colors.length - 1));
  return colors[index];
};

// Couleurs des disques par taille (rétrocompatibilité)
export const DISC_COLORS: Record<number, string> = {
  1: (Colors.discs as string[])[0],
  2: (Colors.discs as string[])[1],
  3: (Colors.discs as string[])[2],
  4: (Colors.discs as string[])[3],
  5: (Colors.discs as string[])[4],
  6: (Colors.discs as string[])[5],
  7: (Colors.discs as string[])[6],
};
