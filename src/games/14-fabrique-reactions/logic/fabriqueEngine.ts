/**
 * Fabrique de Réactions Engine
 * Logique pure du jeu de réactions en chaîne
 *
 * Fonctions de validation des connexions, simulation d'énergie,
 * et détection de victoire.
 * Ces fonctions sont pures (pas d'effets de bord) et testables unitairement.
 */

import type {
  PlacedElement,
  Connection,
  GridPosition,
  ElementRotation,
  EnergyType,
  ElementState,
  EnergyPathStep,
  SimulationResult,
  LevelConfig,
  ConnectionDirection,
} from '../types';

// ============================================
// TYPES
// ============================================

export interface PlacementValidation {
  valid: boolean;
  reason?: 'occupied' | 'out_of_bounds' | 'element_not_available';
}

export interface ConnectionValidation {
  valid: boolean;
  reason?: 'no_output' | 'no_input' | 'incompatible_energy' | 'wrong_direction';
  energyType?: EnergyType;
}

export interface GridCell {
  occupied: boolean;
  elementId: string | null;
}

// ============================================
// CONSTANTES
// ============================================

export const DEFAULT_GRID_SIZE = { rows: 6, cols: 8 };

// Mappage des directions après rotation
const DIRECTION_ROTATION_MAP: Record<ElementRotation, Record<ConnectionDirection, ConnectionDirection>> = {
  0: { top: 'top', right: 'right', bottom: 'bottom', left: 'left', center: 'center' },
  90: { top: 'right', right: 'bottom', bottom: 'left', left: 'top', center: 'center' },
  180: { top: 'bottom', right: 'left', bottom: 'top', left: 'right', center: 'center' },
  270: { top: 'left', right: 'top', bottom: 'right', left: 'bottom', center: 'center' },
};

// ============================================
// CRÉATION DE LA GRILLE
// ============================================

/**
 * Crée une grille vide
 */
export function createEmptyGrid(rows: number, cols: number): GridCell[][] {
  return Array(rows)
    .fill(null)
    .map(() =>
      Array(cols)
        .fill(null)
        .map(() => ({ occupied: false, elementId: null }))
    );
}

/**
 * Place les éléments sur la grille
 */
export function placeElementsOnGrid(
  elements: PlacedElement[],
  gridSize: { rows: number; cols: number }
): GridCell[][] {
  const grid = createEmptyGrid(gridSize.rows, gridSize.cols);

  for (const element of elements) {
    const { row, col } = element.position;
    if (row >= 0 && row < gridSize.rows && col >= 0 && col < gridSize.cols) {
      grid[row][col] = { occupied: true, elementId: element.id };
    }
  }

  return grid;
}

// ============================================
// VALIDATION DE PLACEMENT
// ============================================

/**
 * Vérifie si un élément peut être placé à une position
 */
export function canPlaceElement(
  position: GridPosition,
  grid: GridCell[][],
  gridSize: { rows: number; cols: number },
  availableElements?: string[],
  elementId?: string
): PlacementValidation {
  const { row, col } = position;

  // Vérifier les limites
  if (row < 0 || row >= gridSize.rows || col < 0 || col >= gridSize.cols) {
    return { valid: false, reason: 'out_of_bounds' };
  }

  // Vérifier si la case est occupée
  if (grid[row][col].occupied) {
    return { valid: false, reason: 'occupied' };
  }

  // Vérifier si l'élément est disponible
  if (availableElements && elementId && !availableElements.includes(elementId)) {
    return { valid: false, reason: 'element_not_available' };
  }

  return { valid: true };
}

/**
 * Obtient la direction effective après rotation
 */
export function getRotatedDirection(
  direction: ConnectionDirection,
  rotation: ElementRotation
): ConnectionDirection {
  return DIRECTION_ROTATION_MAP[rotation][direction];
}

/**
 * Obtient la direction opposée
 */
export function getOppositeDirection(direction: ConnectionDirection): ConnectionDirection {
  const opposites: Record<ConnectionDirection, ConnectionDirection> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
    center: 'center',
  };
  return opposites[direction];
}

// ============================================
// GESTION DES CONNEXIONS
// ============================================

/**
 * Trouve les voisins d'une position
 */
export function getNeighbors(
  position: GridPosition,
  gridSize: { rows: number; cols: number }
): { position: GridPosition; direction: ConnectionDirection }[] {
  const { row, col } = position;
  const neighbors: { position: GridPosition; direction: ConnectionDirection }[] = [];

  if (row > 0) neighbors.push({ position: { row: row - 1, col }, direction: 'top' });
  if (row < gridSize.rows - 1) neighbors.push({ position: { row: row + 1, col }, direction: 'bottom' });
  if (col > 0) neighbors.push({ position: { row, col: col - 1 }, direction: 'left' });
  if (col < gridSize.cols - 1) neighbors.push({ position: { row, col: col + 1 }, direction: 'right' });

  return neighbors;
}

/**
 * Trouve toutes les connexions valides entre les éléments placés
 */
export function findAllConnections(
  elements: PlacedElement[],
  elementDefinitions: Map<string, { acceptsEnergy: EnergyType[]; producesEnergy: EnergyType[]; connectionPoints: { position: ConnectionDirection; type: 'input' | 'output' | 'both' }[] }>,
  gridSize: { rows: number; cols: number }
): Connection[] {
  const connections: Connection[] = [];
  const elementsByPosition = new Map<string, PlacedElement>();

  // Indexer les éléments par position
  for (const element of elements) {
    const key = `${element.position.row},${element.position.col}`;
    elementsByPosition.set(key, element);
  }

  // Pour chaque élément, chercher les connexions possibles
  for (const element of elements) {
    const definition = elementDefinitions.get(element.elementId);
    if (!definition) continue;

    const neighbors = getNeighbors(element.position, gridSize);

    for (const { position: neighborPos, direction } of neighbors) {
      const neighborKey = `${neighborPos.row},${neighborPos.col}`;
      const neighbor = elementsByPosition.get(neighborKey);
      if (!neighbor) continue;

      const neighborDef = elementDefinitions.get(neighbor.elementId);
      if (!neighborDef) continue;

      // Chercher un point de sortie sur l'élément actuel dans cette direction
      const rotatedDir = getRotatedDirection(direction, element.rotation);
      const outputPoint = definition.connectionPoints.find(
        (p) => p.position === rotatedDir && (p.type === 'output' || p.type === 'both')
      );

      if (!outputPoint) continue;

      // Chercher un point d'entrée sur le voisin dans la direction opposée
      const oppositeDir = getOppositeDirection(direction);
      const neighborRotatedDir = getRotatedDirection(oppositeDir, neighbor.rotation);
      const inputPoint = neighborDef.connectionPoints.find(
        (p) => p.position === neighborRotatedDir && (p.type === 'input' || p.type === 'both')
      );

      if (!inputPoint) continue;

      // Vérifier la compatibilité des énergies
      const compatibleEnergy = definition.producesEnergy.find((e) =>
        neighborDef.acceptsEnergy.includes(e)
      );

      if (compatibleEnergy) {
        connections.push({
          fromElementId: element.id,
          fromPointId: `${rotatedDir}-output`,
          toElementId: neighbor.id,
          toPointId: `${neighborRotatedDir}-input`,
          energyType: compatibleEnergy,
        });
      }
    }
  }

  return connections;
}

// ============================================
// SIMULATION
// ============================================

/**
 * Trouve les éléments sources (sans entrée active)
 */
export function findSourceElements(
  elements: PlacedElement[],
  elementCategories: Map<string, string>
): PlacedElement[] {
  return elements.filter((e) => elementCategories.get(e.elementId) === 'source');
}

/**
 * Simule la propagation de l'énergie
 */
export function simulateEnergyFlow(
  elements: PlacedElement[],
  connections: Connection[],
  sources: PlacedElement[]
): EnergyPathStep[] {
  const path: EnergyPathStep[] = [];
  const activated = new Set<string>();
  let currentTime = 0;
  const STEP_DELAY = 500; // ms entre chaque étape

  // File d'attente pour la propagation BFS
  const queue: { elementId: string; energyType: EnergyType }[] = [];

  // Démarrer par les sources
  for (const source of sources) {
    queue.push({ elementId: source.id, energyType: 'rotation' }); // Type par défaut
    activated.add(source.id);
    path.push({
      elementId: source.id,
      energyType: 'rotation',
      timestamp: currentTime,
      success: true,
    });
  }

  // Propager l'énergie
  while (queue.length > 0) {
    const current = queue.shift()!;
    currentTime += STEP_DELAY;

    // Trouver les connexions sortantes
    const outgoing = connections.filter((c) => c.fromElementId === current.elementId);

    for (const conn of outgoing) {
      if (activated.has(conn.toElementId)) continue;

      activated.add(conn.toElementId);
      queue.push({ elementId: conn.toElementId, energyType: conn.energyType });
      path.push({
        elementId: conn.toElementId,
        energyType: conn.energyType,
        timestamp: currentTime,
        success: true,
      });
    }
  }

  return path;
}

/**
 * Vérifie si la simulation atteint tous les effets finaux
 */
export function checkSimulationSuccess(
  path: EnergyPathStep[],
  elements: PlacedElement[],
  elementCategories: Map<string, string>
): SimulationResult {
  const activatedIds = new Set(path.map((p) => p.elementId));
  const effects = elements.filter((e) => elementCategories.get(e.elementId) === 'effect');

  // Tous les effets doivent être activés
  const allEffectsActivated = effects.every((e) => activatedIds.has(e.id));

  if (allEffectsActivated && effects.length > 0) {
    return {
      success: true,
      steps: path.length,
      time: path.length > 0 ? path[path.length - 1].timestamp : 0,
    };
  }

  // Trouver le premier effet non activé
  const failedEffect = effects.find((e) => !activatedIds.has(e.id));

  return {
    success: false,
    failedAt: failedEffect?.id ?? 'unknown',
    reason: 'Certains effets ne sont pas atteints',
  };
}

// ============================================
// DÉTECTION DE VICTOIRE
// ============================================

/**
 * Vérifie si le puzzle est résolu
 */
export function checkVictory(
  placedElements: PlacedElement[],
  optimalSolution: PlacedElement[],
  emptySlots: GridPosition[]
): boolean {
  // Vérifier que tous les emplacements vides sont remplis
  const filledPositions = new Set(
    placedElements.map((e) => `${e.position.row},${e.position.col}`)
  );

  for (const slot of emptySlots) {
    if (!filledPositions.has(`${slot.row},${slot.col}`)) {
      return false;
    }
  }

  // La victoire est validée par la simulation réussie, pas par la solution exacte
  return true;
}

/**
 * Compare la solution du joueur avec l'optimale
 */
export function compareSolutions(
  playerSolution: PlacedElement[],
  optimalSolution: PlacedElement[]
): { matches: number; total: number; isOptimal: boolean } {
  let matches = 0;
  const total = optimalSolution.length;

  const optimalByPosition = new Map(
    optimalSolution.map((e) => [`${e.position.row},${e.position.col}`, e])
  );

  for (const element of playerSolution) {
    const key = `${element.position.row},${element.position.col}`;
    const optimal = optimalByPosition.get(key);
    if (optimal && optimal.elementId === element.elementId && optimal.rotation === element.rotation) {
      matches++;
    }
  }

  return {
    matches,
    total,
    isOptimal: matches === total,
  };
}

// ============================================
// UTILITAIRES
// ============================================

/**
 * Clone un tableau d'éléments (deep copy)
 */
export function cloneElements(elements: PlacedElement[]): PlacedElement[] {
  return elements.map((e) => ({
    ...e,
    position: { ...e.position },
  }));
}

/**
 * Déplace un élément à une nouvelle position
 */
export function moveElement(
  element: PlacedElement,
  newPosition: GridPosition
): PlacedElement {
  return {
    ...element,
    position: { ...newPosition },
  };
}

/**
 * Fait pivoter un élément
 */
export function rotateElement(
  element: PlacedElement,
  clockwise: boolean = true
): PlacedElement {
  const rotations: ElementRotation[] = [0, 90, 180, 270];
  const currentIndex = rotations.indexOf(element.rotation);
  const newIndex = clockwise
    ? (currentIndex + 1) % 4
    : (currentIndex + 3) % 4;

  return {
    ...element,
    rotation: rotations[newIndex],
  };
}

/**
 * Met à jour l'état d'un élément
 */
export function updateElementState(
  element: PlacedElement,
  newState: ElementState
): PlacedElement {
  return {
    ...element,
    state: newState,
  };
}

/**
 * Calcule le score basé sur les mouvements
 */
export function calculateScore(
  moves: number,
  optimalMoves: number,
  hintsUsed: number,
  timeSeconds: number
): { score: number; stars: 1 | 2 | 3 } {
  const moveRatio = optimalMoves / Math.max(moves, 1);
  const hintPenalty = hintsUsed * 0.15;
  const timePenalty = Math.max(0, (timeSeconds - 60) * 0.001); // Pénalité après 1 minute

  let stars: 1 | 2 | 3;
  const efficiency = moveRatio - hintPenalty - timePenalty;

  if (efficiency >= 0.9) {
    stars = 3;
  } else if (efficiency >= 0.6) {
    stars = 2;
  } else {
    stars = 1;
  }

  const score = Math.round(1000 * efficiency);

  return { score: Math.max(100, score), stars };
}

/**
 * Génère un indice basé sur l'état actuel
 */
export function generateHint(
  level: LevelConfig,
  placedElements: PlacedElement[],
  hintLevel: 0 | 1 | 2 | 3
): string {
  const hints = level.hintDialogues;

  if (hintLevel < hints.length) {
    return hints[hintLevel];
  }

  return "Essaie de connecter les éléments pour que l'énergie circule de la source jusqu'à l'effet final !";
}

// ============================================
// EXPORT DEFAULT
// ============================================

export default {
  createEmptyGrid,
  placeElementsOnGrid,
  canPlaceElement,
  getRotatedDirection,
  getOppositeDirection,
  getNeighbors,
  findAllConnections,
  findSourceElements,
  simulateEnergyFlow,
  checkSimulationSuccess,
  checkVictory,
  compareSolutions,
  cloneElements,
  moveElement,
  rotateElement,
  updateElementState,
  calculateScore,
  generateHint,
  DEFAULT_GRID_SIZE,
};
