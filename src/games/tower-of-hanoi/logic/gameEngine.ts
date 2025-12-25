/**
 * Moteur de jeu Tour de Hanoï
 * Contient toutes les règles et la logique du puzzle
 */

import { Disc, Tower, GameState, MoveResult, DISC_COLORS } from '../types';

/**
 * Initialise une nouvelle partie
 * Tous les disques commencent sur la tour 0 (gauche)
 * Empilés du plus grand (bas) au plus petit (haut)
 */
export function initializeGame(discCount: number = 3): GameState {
  // Créer les disques (du plus grand au plus petit)
  const discs: Disc[] = [];
  for (let i = discCount; i >= 1; i--) {
    discs.push({
      id: `disc-${i}`,
      size: i,
      color: DISC_COLORS[i] || '#CCCCCC',
    });
  }

  // Créer les trois tours
  const towers: Tower[] = [
    { id: 0, discs: discs },     // Tour gauche avec tous les disques
    { id: 1, discs: [] },        // Tour centrale vide
    { id: 2, discs: [] },        // Tour droite vide (cible)
  ];

  return {
    towers,
    moveCount: 0,
    isComplete: false,
    startTime: null,
    selectedTower: null,
  };
}

/**
 * Obtient le disque au sommet d'une tour (celui qui peut être déplacé)
 */
export function getTopDisc(tower: Tower): Disc | null {
  if (tower.discs.length === 0) return null;
  return tower.discs[tower.discs.length - 1];
}

/**
 * Vérifie si un mouvement est valide selon les règles
 * Règle : Un disque ne peut être posé que sur un disque plus grand ou une tour vide
 */
export function isValidMove(
  towers: Tower[],
  fromTowerIndex: number,
  toTowerIndex: number
): boolean {
  const fromTower = towers[fromTowerIndex];
  const toTower = towers[toTowerIndex];

  // Vérifier que les indices sont valides
  if (!fromTower || !toTower) return false;

  // Ne peut pas déplacer depuis une tour vide
  if (fromTower.discs.length === 0) return false;

  // Ne peut pas déplacer vers la même tour
  if (fromTowerIndex === toTowerIndex) return false;

  // Si la tour cible est vide, le mouvement est toujours valide
  if (toTower.discs.length === 0) return true;

  // Sinon, vérifier que le disque déplacé est plus petit
  const movingDisc = getTopDisc(fromTower)!;
  const targetTopDisc = getTopDisc(toTower)!;

  return movingDisc.size < targetTopDisc.size;
}

/**
 * Exécute un mouvement (suppose que la validation a déjà été faite)
 * Retourne un nouvel état sans muter l'original
 */
export function executeMove(
  state: GameState,
  fromTowerIndex: number,
  toTowerIndex: number
): GameState {
  // Copie profonde des tours
  const newTowers = state.towers.map(tower => ({
    ...tower,
    discs: [...tower.discs],
  }));

  // Retirer le disque du sommet de la tour source
  const disc = newTowers[fromTowerIndex].discs.pop()!;

  // Ajouter le disque au sommet de la tour cible
  newTowers[toTowerIndex].discs.push(disc);

  return {
    ...state,
    towers: newTowers,
    moveCount: state.moveCount + 1,
    startTime: state.startTime || Date.now(),
  };
}

/**
 * Tente d'effectuer un mouvement avec validation
 */
export function tryMove(
  state: GameState,
  fromTowerIndex: number,
  toTowerIndex: number
): MoveResult {
  if (!isValidMove(state.towers, fromTowerIndex, toTowerIndex)) {
    return {
      success: false,
      message: 'Ce mouvement n\'est pas permis !',
    };
  }

  const newState = executeMove(state, fromTowerIndex, toTowerIndex);
  const complete = checkVictory(newState.towers, state.towers[0].discs.length +
    state.towers[1].discs.length + state.towers[2].discs.length);

  return {
    success: true,
    newState: {
      ...newState,
      isComplete: complete,
    },
  };
}

/**
 * Vérifie si le puzzle est résolu
 * Victoire : tous les disques sont sur la tour 2 (droite)
 */
export function checkVictory(towers: Tower[], totalDiscs: number): boolean {
  return towers[2].discs.length === totalDiscs;
}

/**
 * Calcule le nombre minimum de mouvements pour résoudre le puzzle
 * Formule : 2^n - 1 où n est le nombre de disques
 */
export function getOptimalMoves(discCount: number): number {
  return Math.pow(2, discCount) - 1;
}

/**
 * Calcule le nombre d'étoiles basé sur la performance
 * 3 étoiles : solution optimale
 * 2 étoiles : jusqu'à 50% de mouvements en plus
 * 1 étoile : plus de 50% de mouvements en plus
 */
export function calculateStars(moves: number, discCount: number): number {
  const optimal = getOptimalMoves(discCount);

  if (moves <= optimal) return 3;
  if (moves <= optimal * 1.5) return 2;
  return 1;
}

/**
 * Génère un indice pour aider l'enfant
 * Retourne le prochain mouvement optimal (simplifié)
 */
export function getHint(state: GameState): { from: number; to: number } | null {
  const { towers } = state;

  // Stratégie simplifiée : trouver le plus petit disque et le déplacer
  // vers une position valide qui fait progresser vers la solution

  // Trouver le plus petit disque mobile
  let smallestTower = -1;
  let smallestSize = Infinity;

  towers.forEach((tower, index) => {
    const topDisc = getTopDisc(tower);
    if (topDisc && topDisc.size < smallestSize) {
      smallestSize = topDisc.size;
      smallestTower = index;
    }
  });

  if (smallestTower === -1) return null;

  // Trouver une destination valide
  for (let i = 0; i < 3; i++) {
    if (i !== smallestTower && isValidMove(towers, smallestTower, i)) {
      // Préférer la tour 2 (cible) si possible
      if (i === 2) return { from: smallestTower, to: i };
    }
  }

  // Sinon retourner la première destination valide
  for (let i = 0; i < 3; i++) {
    if (i !== smallestTower && isValidMove(towers, smallestTower, i)) {
      return { from: smallestTower, to: i };
    }
  }

  return null;
}

/**
 * Vérifie si un disque est au sommet de sa tour (donc déplaçable)
 */
export function isTopDisc(towers: Tower[], towerIndex: number, discId: string): boolean {
  const tower = towers[towerIndex];
  if (!tower || tower.discs.length === 0) return false;

  const topDisc = tower.discs[tower.discs.length - 1];
  return topDisc.id === discId;
}

/**
 * Trouve la tour contenant un disque spécifique
 */
export function findDiscTower(towers: Tower[], discId: string): number {
  for (let i = 0; i < towers.length; i++) {
    if (towers[i].discs.some(d => d.id === discId)) {
      return i;
    }
  }
  return -1;
}
