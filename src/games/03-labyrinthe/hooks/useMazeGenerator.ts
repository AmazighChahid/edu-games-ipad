import { useCallback } from 'react';
import {
  MazeGrid,
  MazeCell,
  LevelConfig,
  Position,
  InteractiveElement,
  ColorType,
} from '../types';
import { generateId, shuffle, isInBounds } from '../utils/helpers';

export function useMazeGenerator() {
  /**
   * Génération principale du labyrinthe
   */
  const generateMaze = useCallback((config: LevelConfig): MazeGrid => {
    const { width, height } = config;

    // 1. Initialiser la grille avec tous les murs
    const cells = initializeGrid(width, height);

    // 2. Creuser les chemins avec Recursive Backtracking
    recursiveBacktrack(cells, 0, 0, new Set());

    // 3. Définir départ et arrivée
    const start: Position = { x: 0, y: 0 };
    const end: Position = { x: width - 1, y: height - 1 };

    cells[start.y][start.x].type = 'start';
    cells[end.y][end.x].type = 'end';

    // 4. Ajouter des éléments interactifs
    const interactives: InteractiveElement[] = [];

    if (config.hasKeys) {
      addKeysAndDoors(cells, interactives, config.keyCount, start, end);
    }

    if (config.hasGems) {
      addGems(cells, interactives, config.gemCount);
    }

    // 5. Valider que le labyrinthe est solvable
    if (!validateMaze(cells, start, end)) {
      // Regénérer si non solvable
      if (__DEV__) console.warn('Maze not solvable, regenerating...');
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
  }, []);

  return { generateMaze };
}

// ============================================
// ALGORITHME DE GÉNÉRATION
// ============================================

function initializeGrid(width: number, height: number): MazeCell[][] {
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

function recursiveBacktrack(
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

  // Directions aléatoires
  const directions = shuffle([
    { dx: 0, dy: -1, wall: 'top' as const, opposite: 'bottom' as const },
    { dx: 1, dy: 0, wall: 'right' as const, opposite: 'left' as const },
    { dx: 0, dy: 1, wall: 'bottom' as const, opposite: 'top' as const },
    { dx: -1, dy: 0, wall: 'left' as const, opposite: 'right' as const },
  ]);

  for (const { dx, dy, wall, opposite } of directions) {
    const nx = x + dx;
    const ny = y + dy;

    // Vérifier les limites
    if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;

    // Vérifier si déjà visité
    if (visited.has(`${nx},${ny}`)) continue;

    // Retirer les murs entre les deux cellules
    cells[y][x].walls[wall] = false;
    cells[ny][nx].walls[opposite] = false;

    // Récursion
    recursiveBacktrack(cells, nx, ny, visited);
  }
}

// ============================================
// AJOUT D'ÉLÉMENTS INTERACTIFS
// ============================================

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

    // Trouver une position pour la clé (avant la porte)
    const keyCandidates = pathCells.filter(
      (c) => (c.x < doorCell.x || c.y < doorCell.y) && !cells[c.y][c.x].interactive
    );
    if (keyCandidates.length === 0) continue;

    const keyCell = keyCandidates[Math.floor(Math.random() * keyCandidates.length)];

    // Ajouter la clé
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

// ============================================
// UTILITAIRES
// ============================================

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

function validateMaze(cells: MazeCell[][], start: Position, end: Position): boolean {
  // Utiliser BFS pour vérifier qu'un chemin existe
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
