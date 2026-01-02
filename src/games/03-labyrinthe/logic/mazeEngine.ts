/**
 * Maze Engine
 *
 * Logique centrale du jeu Labyrinthe
 * Gere la generation, la validation et le scoring
 */

import type {
  MazeGrid,
  MazeCell,
  LevelConfig,
  Position,
  Direction,
  InteractiveElement,
  ColorType,
  InventoryItem,
  MazeState,
} from '../types';
import { generateId, shuffle, isInBounds } from '../utils/helpers';

// ============================================================================
// GENERATION DU LABYRINTHE
// ============================================================================

/**
 * Genere un labyrinthe complet a partir d'une configuration
 */
export function generateMaze(config: LevelConfig): MazeGrid {
  const { width, height } = config;

  // 1. Initialiser la grille avec tous les murs
  const cells = initializeGrid(width, height);

  // 2. Creuser les chemins avec Recursive Backtracking
  recursiveBacktrack(cells, 0, 0, new Set());

  // 3. Definir depart et arrivee
  const start: Position = { x: 0, y: 0 };
  const end: Position = { x: width - 1, y: height - 1 };

  cells[start.y][start.x].type = 'start';
  cells[end.y][end.x].type = 'end';

  // 4. Ajouter des elements interactifs
  const interactives: InteractiveElement[] = [];

  if (config.hasKeys) {
    addKeysAndDoors(cells, interactives, config.keyCount, start, end);
  }

  if (config.hasGems) {
    addGems(cells, interactives, config.gemCount);
  }

  // 5. Valider que le labyrinthe est solvable
  if (!validateMaze(cells, start, end)) {
    // Regenerer si non solvable
    return generateMaze(config);
  }

  return {
    cells,
    width,
    height,
    start,
    end,
    interactives,
  };
}

/**
 * Initialise une grille vide avec tous les murs
 */
export function initializeGrid(width: number, height: number): MazeCell[][] {
  const cells: MazeCell[][] = [];

  for (let y = 0; y < height; y++) {
    const row: MazeCell[] = [];
    for (let x = 0; x < width; x++) {
      row.push({
        x,
        y,
        type: 'wall',
        visited: false,
        discovered: false,
        walls: { top: true, right: true, bottom: true, left: true },
      });
    }
    cells.push(row);
  }

  return cells;
}

/**
 * Algorithme Recursive Backtracking pour creuser les chemins
 */
export function recursiveBacktrack(
  cells: MazeCell[][],
  x: number,
  y: number,
  visited: Set<string>
): void {
  const height = cells.length;
  const width = cells[0].length;

  // Marquer comme chemin
  cells[y][x].type = 'path';
  visited.add(`${x},${y}`);

  // Directions aleatoires
  const directions = shuffle([
    { dx: 0, dy: -1, wall: 'top' as const, opposite: 'bottom' as const },
    { dx: 1, dy: 0, wall: 'right' as const, opposite: 'left' as const },
    { dx: 0, dy: 1, wall: 'bottom' as const, opposite: 'top' as const },
    { dx: -1, dy: 0, wall: 'left' as const, opposite: 'right' as const },
  ]);

  for (const { dx, dy, wall, opposite } of directions) {
    const nx = x + dx;
    const ny = y + dy;

    // Verifier les limites
    if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;

    // Verifier si deja visite
    if (visited.has(`${nx},${ny}`)) continue;

    // Retirer les murs entre les deux cellules
    cells[y][x].walls[wall] = false;
    cells[ny][nx].walls[opposite] = false;

    // Recursion
    recursiveBacktrack(cells, nx, ny, visited);
  }
}

// ============================================================================
// VALIDATION DES MOUVEMENTS
// ============================================================================

/**
 * Verifie si un mouvement est valide
 */
export function isValidMove(
  grid: MazeGrid,
  from: Position,
  to: Position,
  inventory: InventoryItem[]
): { valid: boolean; blockedBy?: 'wall' | 'door' } {
  // Verifier les limites
  if (to.x < 0 || to.x >= grid.width || to.y < 0 || to.y >= grid.height) {
    return { valid: false, blockedBy: 'wall' };
  }

  const fromCell = grid.cells[from.y][from.x];
  const toCell = grid.cells[to.y][to.x];

  // Verifier si c'est un mur
  if (toCell.type === 'wall') {
    return { valid: false, blockedBy: 'wall' };
  }

  // Verifier les murs entre les cellules
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (dx === 1 && fromCell.walls.right) {
    return { valid: false, blockedBy: 'wall' };
  }
  if (dx === -1 && fromCell.walls.left) {
    return { valid: false, blockedBy: 'wall' };
  }
  if (dy === 1 && fromCell.walls.bottom) {
    return { valid: false, blockedBy: 'wall' };
  }
  if (dy === -1 && fromCell.walls.top) {
    return { valid: false, blockedBy: 'wall' };
  }

  // Verifier les portes
  if (toCell.interactive?.type === 'door' && !toCell.interactive.isActive) {
    const hasKey = inventory.some(
      (item) => item.type === 'key' && item.color === toCell.interactive!.color
    );
    if (!hasKey) {
      return { valid: false, blockedBy: 'door' };
    }
  }

  return { valid: true };
}

/**
 * Calcule la nouvelle position apres un mouvement
 */
export function calculateNewPosition(current: Position, direction: Direction): Position {
  const delta: Record<Direction, { x: number; y: number }> = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };

  return {
    x: current.x + delta[direction].x,
    y: current.y + delta[direction].y,
  };
}

// ============================================================================
// SCORE ET RESULTATS
// ============================================================================

/**
 * Calcule le nombre d'etoiles obtenues
 */
export function calculateStars(
  state: MazeState,
  level: LevelConfig
): 0 | 1 | 2 | 3 {
  if (!state.isComplete) return 0;

  const time = (new Date().getTime() - state.startTime.getTime()) / 1000;

  if (time <= level.timeLimits.threeStars && state.gemsCollected === level.gemCount) {
    return 3;
  }
  if (time <= level.timeLimits.twoStars) {
    return 2;
  }
  return 1;
}

/**
 * Compte le nombre de cellules de chemin
 */
export function countPathCells(grid: MazeGrid): number {
  let count = 0;
  for (const row of grid.cells) {
    for (const cell of row) {
      if (cell.type !== 'wall') count++;
    }
  }
  return count;
}

/**
 * Compte les retours en arriere dans le parcours
 */
export function countBacktracks(path: Position[]): number {
  let backtracks = 0;
  const visited = new Set<string>();

  for (const pos of path) {
    const key = `${pos.x},${pos.y}`;
    if (visited.has(key)) {
      backtracks++;
    }
    visited.add(key);
  }

  return backtracks;
}

/**
 * Trouve la direction vers la sortie (pour les indices)
 */
export function findDirectionToEnd(
  avatarPosition: Position,
  endPosition: Position
): Direction {
  const dx = endPosition.x - avatarPosition.x;
  const dy = endPosition.y - avatarPosition.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'right' : 'left';
  }
  return dy > 0 ? 'down' : 'up';
}

// ============================================================================
// UTILITAIRES INTERNES
// ============================================================================

function addKeysAndDoors(
  cells: MazeCell[][],
  interactives: InteractiveElement[],
  count: number,
  start: Position,
  end: Position
): void {
  const colors: ColorType[] = ['red', 'blue', 'green', 'yellow', 'purple'];
  const pathCells = getPathCells(cells).filter(
    (c) => !(c.x === start.x && c.y === start.y) && !(c.x === end.x && c.y === end.y)
  );

  for (let i = 0; i < Math.min(count, colors.length); i++) {
    const color = colors[i];

    // Trouver une position pour la porte (sur le chemin vers la sortie)
    const doorCandidates = pathCells.filter(
      (c) => c.x > cells[0].length / 2 || c.y > cells.length / 2
    );
    if (doorCandidates.length === 0) continue;

    const doorCell = doorCandidates[Math.floor(Math.random() * doorCandidates.length)];

    // Trouver une position pour la cle (avant la porte)
    const keyCandidates = pathCells.filter(
      (c) => (c.x < doorCell.x || c.y < doorCell.y) && !cells[c.y][c.x].interactive
    );
    if (keyCandidates.length === 0) continue;

    const keyCell = keyCandidates[Math.floor(Math.random() * keyCandidates.length)];

    // Ajouter la cle
    const key: InteractiveElement = {
      id: generateId(),
      type: 'key',
      position: { x: keyCell.x, y: keyCell.y },
      color,
      isActive: false,
      collected: false,
    };
    cells[keyCell.y][keyCell.x].interactive = key;
    interactives.push(key);

    // Ajouter la porte
    const door: InteractiveElement = {
      id: generateId(),
      type: 'door',
      position: { x: doorCell.x, y: doorCell.y },
      color,
      isActive: false,
      collected: false,
    };
    cells[doorCell.y][doorCell.x].interactive = door;
    interactives.push(door);

    // Retirer ces cellules des candidats
    const idx1 = pathCells.findIndex((c) => c.x === keyCell.x && c.y === keyCell.y);
    if (idx1 > -1) pathCells.splice(idx1, 1);
    const idx2 = pathCells.findIndex((c) => c.x === doorCell.x && c.y === doorCell.y);
    if (idx2 > -1) pathCells.splice(idx2, 1);
  }
}

function addGems(
  cells: MazeCell[][],
  interactives: InteractiveElement[],
  count: number
): void {
  const pathCells = getPathCells(cells).filter((c) => !c.interactive);
  const shuffled = shuffle(pathCells);

  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    const cell = shuffled[i];
    const gem: InteractiveElement = {
      id: generateId(),
      type: 'gem',
      position: { x: cell.x, y: cell.y },
      isActive: false,
      collected: false,
    };
    cells[cell.y][cell.x].interactive = gem;
    interactives.push(gem);
  }
}

function getPathCells(cells: MazeCell[][]): MazeCell[] {
  const paths: MazeCell[] = [];
  for (const row of cells) {
    for (const cell of row) {
      if (cell.type === 'path') {
        paths.push(cell);
      }
    }
  }
  return paths;
}

/**
 * Valide que le labyrinthe est solvable via BFS
 */
export function validateMaze(
  cells: MazeCell[][],
  start: Position,
  end: Position
): boolean {
  const queue: Position[] = [start];
  const visited = new Set<string>();
  visited.add(`${start.x},${start.y}`);

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.x === end.x && current.y === end.y) {
      return true;
    }

    const neighbors = getNeighbors(cells, current);
    for (const neighbor of neighbors) {
      const key = `${neighbor.x},${neighbor.y}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push(neighbor);
      }
    }
  }

  return false;
}

function getNeighbors(cells: MazeCell[][], pos: Position): Position[] {
  const neighbors: Position[] = [];
  const cell = cells[pos.y][pos.x];

  const directions = [
    { dx: 0, dy: -1, wall: 'top' as const },
    { dx: 1, dy: 0, wall: 'right' as const },
    { dx: 0, dy: 1, wall: 'bottom' as const },
    { dx: -1, dy: 0, wall: 'left' as const },
  ];

  for (const { dx, dy, wall } of directions) {
    if (!cell.walls[wall]) {
      const nx = pos.x + dx;
      const ny = pos.y + dy;
      if (isInBounds({ x: nx, y: ny }, cells[0].length, cells.length)) {
        if (cells[ny][nx].type !== 'wall') {
          neighbors.push({ x: nx, y: ny });
        }
      }
    }
  }

  return neighbors;
}

/**
 * Verifie si deux positions sont egales
 */
export function positionsEqual(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

/**
 * Convertit une position en cle de string
 */
export function positionToKey(pos: Position): string {
  return `${pos.x},${pos.y}`;
}
