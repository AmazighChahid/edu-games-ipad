import { useState, useCallback, useMemo } from 'react';
import { useMazeGenerator } from './useMazeGenerator';
import {
  MazeState,
  GameStatus,
  LevelConfig,
  Position,
  Direction,
  InventoryItem,
  MazeGrid,
} from '../types';
import { positionToKey, positionsEqual } from '../utils/helpers';

export function useMazeGame(level: LevelConfig) {
  const { generateMaze } = useMazeGenerator();

  // État initial
  const [mazeState, setMazeState] = useState<MazeState>(() => {
    const grid = generateMaze(level);
    return {
      grid,
      avatarPosition: grid.start,
      avatarDirection: 'down',
      inventory: [],
      pathHistory: [grid.start],
      visitedCells: new Set([positionToKey(grid.start)]),
      hintsUsed: 0,
      gemsCollected: 0,
      totalGems: level.gemCount,
      startTime: new Date(),
      isComplete: false,
      isPaused: false,
    };
  });

  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');

  // Déplacer l'avatar
  const moveAvatar = useCallback(
    (direction: Direction) => {
      const { avatarPosition, grid, inventory } = mazeState;

      const delta = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 },
      };

      const newPosition: Position = {
        x: avatarPosition.x + delta[direction].x,
        y: avatarPosition.y + delta[direction].y,
      };

      // Vérifier si le mouvement est valide
      const moveResult = isValidMove(grid, avatarPosition, newPosition, inventory);

      if (!moveResult.valid) {
        setGameStatus(moveResult.blockedBy === 'door' ? 'door_locked' : 'blocked');

        setTimeout(() => setGameStatus('idle'), 500);

        return { success: false };
      }

      // Variables pour capturer les informations
      let capturedCollectedItem: any = null;

      // Mettre à jour l'état
      setMazeState((prev) => {
        const cell = prev.grid.cells[newPosition.y][newPosition.x];
        let newInventory = [...prev.inventory];

        // Gérer les interactions
        if (cell.interactive) {
          const interactive = cell.interactive;

          if (interactive.type === 'key' && !interactive.collected) {
            newInventory.push({
              id: interactive.id,
              type: 'key',
              color: interactive.color,
              collectedAt: new Date(),
            });
            capturedCollectedItem = interactive;
            cell.interactive.collected = true;
          } else if (interactive.type === 'gem' && !interactive.collected) {
            newInventory.push({
              id: interactive.id,
              type: 'gem',
              collectedAt: new Date(),
            });
            capturedCollectedItem = interactive;
            cell.interactive.collected = true;
          }
        }

        const newVisited = new Set(prev.visitedCells);
        newVisited.add(positionToKey(newPosition));

        // Marquer la cellule comme visitée
        prev.grid.cells[newPosition.y][newPosition.x].visited = true;

        return {
          ...prev,
          avatarPosition: newPosition,
          avatarDirection: direction,
          inventory: newInventory,
          pathHistory: [...prev.pathHistory, newPosition],
          visitedCells: newVisited,
          gemsCollected: newInventory.filter((i) => i.type === 'gem').length,
        };
      });

      // Vérifier la victoire
      const isVictory = positionsEqual(newPosition, grid.end);
      if (isVictory) {
        setGameStatus('victory');
        setMazeState((prev) => ({ ...prev, isComplete: true }));
      } else {
        setGameStatus('idle');
      }

      return {
        success: true,
        newPosition,
        collectedItem: capturedCollectedItem,
        reachedEnd: isVictory,
      };
    },
    [mazeState]
  );

  // Demander un indice
  const requestHint = useCallback(() => {
    const hintLevel = mazeState.hintsUsed + 1;

    if (hintLevel > 5) return null;

    setMazeState((prev) => ({ ...prev, hintsUsed: hintLevel }));

    const hints = [
      {
        level: 1,
        type: 'verbal',
        message: "Regarde les chemins que tu n'as pas encore essayés...",
      },
      {
        level: 2,
        type: 'zoom',
        message: 'Voilà une vue plus large ! La sortie est par là ⭐',
      },
      {
        level: 3,
        type: 'direction',
        message: 'Mon flair d\'écureuil me dit... C\'est par là ! ➡️',
        direction: findDirectionToEnd(),
      },
      {
        level: 4,
        type: 'partial_path',
        message: 'Suis les cases qui brillent !',
      },
      {
        level: 5,
        type: 'full_path',
        message: 'Voilà le chemin complet !',
      },
    ];

    return hints.find((h) => h.level === hintLevel) || null;
  }, [mazeState]);

  // Direction vers la sortie (pour indice)
  const findDirectionToEnd = useCallback(() => {
    const { avatarPosition, grid } = mazeState;
    const dx = grid.end.x - avatarPosition.x;
    const dy = grid.end.y - avatarPosition.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left';
    }
    return dy > 0 ? 'down' : 'up';
  }, [mazeState]);

  // Réinitialiser le niveau
  const resetLevel = useCallback(() => {
    const grid = generateMaze(level);
    setMazeState({
      grid,
      avatarPosition: grid.start,
      avatarDirection: 'down',
      inventory: [],
      pathHistory: [grid.start],
      visitedCells: new Set([positionToKey(grid.start)]),
      hintsUsed: 0,
      gemsCollected: 0,
      totalGems: level.gemCount,
      startTime: new Date(),
      isComplete: false,
      isPaused: false,
    });
    setGameStatus('idle');
  }, [level, generateMaze]);

  // Statistiques de session
  const stats = useMemo(
    () => ({
      levelId: level.id,
      completed: mazeState.isComplete,
      time: mazeState.isComplete
        ? (new Date().getTime() - mazeState.startTime.getTime()) / 1000
        : 0,
      pathLength: mazeState.pathHistory.length,
      explorationPercent: Math.round(
        (mazeState.visitedCells.size / countPathCells(mazeState.grid)) * 100
      ),
      backtracks: countBacktracks(mazeState.pathHistory),
      hintsUsed: mazeState.hintsUsed,
      gemsCollected: mazeState.gemsCollected,
      stars: calculateStars(mazeState, level),
    }),
    [mazeState, level]
  );

  return {
    mazeState: { ...mazeState, stats } as MazeState & { stats: any },
    gameStatus,
    moveAvatar,
    requestHint,
    resetLevel,
  };
}

// ============================================
// UTILITAIRES
// ============================================

function isValidMove(
  grid: MazeGrid,
  from: Position,
  to: Position,
  inventory: InventoryItem[]
): { valid: boolean; blockedBy?: 'wall' | 'door' } {
  // Vérifier les limites
  if (to.x < 0 || to.x >= grid.width || to.y < 0 || to.y >= grid.height) {
    return { valid: false, blockedBy: 'wall' };
  }

  const fromCell = grid.cells[from.y][from.x];
  const toCell = grid.cells[to.y][to.x];

  // Vérifier si c'est un mur
  if (toCell.type === 'wall') {
    return { valid: false, blockedBy: 'wall' };
  }

  // Vérifier les murs entre les cellules
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

  // Vérifier les portes
  if (toCell.interactive?.type === 'door' && !toCell.interactive.isActive) {
    const hasKey = inventory.some(
      (item) => item.type === 'key' && item.color === toCell.interactive!.color
    );
    if (!hasKey) {
      return { valid: false, blockedBy: 'door' };
    }
    // Ouvrir la porte
    toCell.interactive.isActive = true;
  }

  return { valid: true };
}

function countPathCells(grid: MazeGrid): number {
  let count = 0;
  for (const row of grid.cells) {
    for (const cell of row) {
      if (cell.type !== 'wall') count++;
    }
  }
  return count;
}

function countBacktracks(path: Position[]): number {
  let backtracks = 0;
  const visited = new Set<string>();

  for (const pos of path) {
    const key = positionToKey(pos);
    if (visited.has(key)) {
      backtracks++;
    }
    visited.add(key);
  }

  return backtracks;
}

function calculateStars(state: MazeState, level: LevelConfig): 0 | 1 | 2 | 3 {
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
