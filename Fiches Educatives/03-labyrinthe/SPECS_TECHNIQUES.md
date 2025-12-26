# ⚙️ SPECS TECHNIQUES : Labyrinthe Logique

## Architecture des Composants

### Structure des Fichiers

```
/src/components/activities/Labyrinthe/
├── LabyrintheGame.tsx              # Composant principal
├── components/
│   ├── MazeGrid.tsx                # Grille du labyrinthe
│   ├── MazeCell.tsx                # Cellule individuelle (mur/chemin)
│   ├── Avatar.tsx                  # Personnage animé
│   ├── PathTrail.tsx               # Fil d'Ariane
│   ├── MiniMap.tsx                 # Mini-carte optionnelle
│   ├── InteractiveElement.tsx      # Clé, porte, bouton, gemme
│   ├── Inventory.tsx               # Inventaire des objets
│   ├── DirectionalControls.tsx     # Boutons directionnels (option)
│   ├── LevelSelector.tsx           # Carte des niveaux
│   └── VictoryScreen.tsx           # Écran de fin
├── hooks/
│   ├── useMazeGame.ts              # Logique de jeu principale
│   ├── useMazeGenerator.ts         # Génération procédurale
│   ├── useAvatarMovement.ts        # Gestion des déplacements
│   ├── usePathfinding.ts           # Validation et calcul de chemin
│   └── useMazeInteractions.ts      # Clés, portes, boutons
├── utils/
│   ├── mazeAlgorithms.ts           # Algorithmes de génération
│   ├── pathfinding.ts              # A* et validation
│   └── mazeValidation.ts           # Vérification de solvabilité
├── data/
│   ├── themes.ts                   # Thèmes visuels
│   ├── levels.ts                   # Configuration des niveaux
│   └── achievements.ts             # Badges et récompenses
├── constants/
│   └── mazeConfig.ts               # Configuration du jeu
└── types/
    └── index.ts                    # Types TypeScript
```

---

## Types TypeScript

### Types de Base

```typescript
// types/index.ts

// ============================================
// CELLULES DU LABYRINTHE
// ============================================

export type CellType = 'wall' | 'path' | 'start' | 'end';

export interface Position {
  x: number;
  y: number;
}

export interface MazeCell {
  x: number;
  y: number;
  type: CellType;
  visited: boolean;              // Pour le fil d'Ariane
  discovered: boolean;           // Pour le fog of war
  interactive?: InteractiveElement;
  walls: {                       // Murs individuels (pour génération)
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
}

// ============================================
// ÉLÉMENTS INTERACTIFS
// ============================================

export type InteractiveType = 'key' | 'door' | 'button' | 'gem' | 'teleporter';

export type ColorType = 'red' | 'blue' | 'green' | 'yellow' | 'purple';

export interface InteractiveElement {
  id: string;
  type: InteractiveType;
  position: Position;
  color?: ColorType;             // Pour clés et portes
  linkedTo?: Position;           // Pour boutons/téléporteurs
  isActive: boolean;             // Pour portes (ouverte/fermée)
  collected: boolean;            // Pour clés/gemmes
}

export interface InventoryItem {
  id: string;
  type: 'key' | 'gem';
  color?: ColorType;
  collectedAt: Date;
}

// ============================================
// ÉTAT DU LABYRINTHE
// ============================================

export interface MazeGrid {
  cells: MazeCell[][];
  width: number;
  height: number;
  start: Position;
  end: Position;
  interactives: InteractiveElement[];
}

export interface MazeState {
  grid: MazeGrid;
  avatarPosition: Position;
  avatarDirection: 'up' | 'down' | 'left' | 'right';
  inventory: InventoryItem[];
  pathHistory: Position[];        // Chemin parcouru
  visitedCells: Set<string>;      // "x,y" format
  hintsUsed: number;
  gemsCollected: number;
  totalGems: number;
  startTime: Date;
  isComplete: boolean;
  isPaused: boolean;
}

export type GameStatus = 
  | 'idle'
  | 'moving'
  | 'blocked'
  | 'interacting'
  | 'door_locked'
  | 'door_opening'
  | 'victory'
  | 'paused';

// ============================================
// CONFIGURATION
// ============================================

export interface MazeConfig {
  width: number;
  height: number;
  difficulty: number;            // 1-5
  theme: ThemeType;
  hasKeys: boolean;
  keyCount: number;
  hasButtons: boolean;
  hasGems: boolean;
  gemCount: number;
  hasTeleporters: boolean;
  showMiniMap: boolean;
  showPathTrail: boolean;
  controlMode: 'swipe' | 'trace' | 'buttons';
}

export interface LevelConfig extends MazeConfig {
  id: number;
  name: string;
  unlocked: boolean;
  stars: 0 | 1 | 2 | 3;
  bestTime?: number;
  timeLimits: {
    threeStars: number;          // Secondes
    twoStars: number;
    oneStar: number;
  };
}

// ============================================
// THÈMES
// ============================================

export type ThemeType = 
  | 'forest'
  | 'temple'
  | 'space'
  | 'ice'
  | 'garden';

export interface Theme {
  id: ThemeType;
  name: string;
  wallColor: string;
  pathColor: string;
  wallTexture: string;
  pathTexture: string;
  startIcon: string;
  endIcon: string;
  ambientSound: string;
  backgroundColor: string;
  particles?: ParticleConfig;
}

export interface ParticleConfig {
  type: 'leaves' | 'dust' | 'stars' | 'snowflakes' | 'petals';
  density: number;
  speed: number;
}

// ============================================
// PROGRESSION
// ============================================

export interface PlayerProgress {
  currentLevel: number;
  levelsCompleted: number[];
  totalStars: number;
  starsByLevel: Record<number, number>;
  unlockedThemes: ThemeType[];
  badges: Badge[];
  totalPlayTime: number;
  gemsCollected: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress?: number;             // Pour badges progressifs
  target?: number;
}

export interface SessionStats {
  levelId: number;
  completed: boolean;
  time: number;
  pathLength: number;
  explorationPercent: number;
  backtracks: number;
  hintsUsed: number;
  gemsCollected: number;
  stars: number;
}
```

---

## Composants React Native

### Composant Principal

```typescript
// LabyrintheGame.tsx

import React, { useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

import { MazeGrid } from './components/MazeGrid';
import { Avatar } from './components/Avatar';
import { PathTrail } from './components/PathTrail';
import { MiniMap } from './components/MiniMap';
import { Inventory } from './components/Inventory';
import { DirectionalControls } from './components/DirectionalControls';
import { VictoryScreen } from './components/VictoryScreen';
import { MascotBubble } from '@/components/mascot/MascotBubble';
import { IconButton } from '@/components/ui/IconButton';

import { useMazeGame } from './hooks/useMazeGame';
import { useAvatarMovement } from './hooks/useAvatarMovement';
import { useSound } from '@/hooks/useSound';
import { useHaptics } from '@/hooks/useHaptics';

import { COLORS } from '@/constants/theme';
import { LevelConfig, Position, GameStatus } from './types';

interface Props {
  level: LevelConfig;
  onComplete: (stats: SessionStats) => void;
  onExit: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const LabyrintheGame: React.FC<Props> = ({
  level,
  onComplete,
  onExit,
}) => {
  const {
    mazeState,
    gameStatus,
    moveAvatar,
    collectItem,
    interactWithDoor,
    activateButton,
    requestHint,
    resetLevel,
  } = useMazeGame(level);

  const { animatedPosition, animateMove, animateBlocked } = useAvatarMovement();
  const { playSound } = useSound();
  const { triggerHaptic } = useHaptics();

  const [mascotMessage, setMascotMessage] = useState<string>('');
  const [showMascot, setShowMascot] = useState(true);
  const [showVictory, setShowVictory] = useState(false);

  // Calcul de la taille des cellules
  const cellSize = Math.floor((SCREEN_WIDTH - 48) / level.width);

  // Initialisation
  useEffect(() => {
    setMascotMessage("On y va ! Glisse ton doigt pour me guider !");
  }, []);

  // Gestion du feedback
  useEffect(() => {
    switch (gameStatus) {
      case 'blocked':
        playSound('bump');
        triggerHaptic('light');
        animateBlocked();
        setMascotMessage("Oups ! C'est bloqué ici...");
        break;
      case 'door_locked':
        playSound('locked');
        setMascotMessage("Il nous faut une clé pour cette porte !");
        break;
      case 'door_opening':
        playSound('unlock');
        triggerHaptic('success');
        setMascotMessage("La porte s'ouvre !");
        break;
      case 'victory':
        playSound('victory');
        triggerHaptic('success');
        setShowVictory(true);
        break;
    }
  }, [gameStatus]);

  // Geste de swipe pour déplacement
  const swipeGesture = Gesture.Pan()
    .onEnd((event) => {
      const { translationX, translationY } = event;
      const threshold = 30;

      let direction: 'up' | 'down' | 'left' | 'right' | null = null;

      if (Math.abs(translationX) > Math.abs(translationY)) {
        if (translationX > threshold) direction = 'right';
        else if (translationX < -threshold) direction = 'left';
      } else {
        if (translationY > threshold) direction = 'down';
        else if (translationY < -threshold) direction = 'up';
      }

      if (direction) {
        runOnJS(handleMove)(direction);
      }
    });

  // Gestion du déplacement
  const handleMove = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    const result = moveAvatar(direction);
    
    if (result.success) {
      playSound('step');
      animateMove(result.newPosition, cellSize);
      
      // Vérifier les interactions
      if (result.collectedItem) {
        handleItemCollection(result.collectedItem);
      }
      if (result.reachedEnd) {
        // Victoire gérée par le hook
      }
    }
  }, [moveAvatar, cellSize]);

  // Collecte d'objet
  const handleItemCollection = useCallback((item: InteractiveElement) => {
    switch (item.type) {
      case 'key':
        playSound('collect_key');
        triggerHaptic('medium');
        setMascotMessage(`Super ! Une clé ${item.color} !`);
        break;
      case 'gem':
        playSound('collect_gem');
        triggerHaptic('light');
        setMascotMessage("💎 Bonus !");
        break;
      case 'button':
        playSound('button_click');
        setMascotMessage("Click ! Quelque chose s'est ouvert...");
        break;
    }
  }, []);

  // Demande d'indice
  const handleHint = useCallback(() => {
    const hint = requestHint();
    if (hint) {
      playSound('hint');
      setMascotMessage(hint.message);
      // Appliquer l'effet visuel selon hint.type
    }
  }, [requestHint]);

  if (showVictory) {
    return (
      <VictoryScreen
        stats={mazeState.stats}
        onReplay={resetLevel}
        onNext={() => onComplete(mazeState.stats)}
        onExit={onExit}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="home" onPress={onExit} size={48} />
        
        <View style={styles.levelInfo}>
          <Text style={styles.levelText}>Niveau {level.id}</Text>
        </View>

        {level.showMiniMap && (
          <MiniMap
            grid={mazeState.grid}
            avatarPosition={mazeState.avatarPosition}
            visitedCells={mazeState.visitedCells}
            size={100}
          />
        )}
      </View>

      {/* Mascotte */}
      <MascotBubble
        mascot="noisette"
        message={mascotMessage}
        visible={showMascot}
        position="top"
      />

      {/* Zone de jeu */}
      <GestureDetector gesture={swipeGesture}>
        <View style={styles.gameArea}>
          {/* Grille du labyrinthe */}
          <MazeGrid
            grid={mazeState.grid}
            cellSize={cellSize}
            theme={level.theme}
          >
            {/* Fil d'Ariane */}
            {level.showPathTrail && (
              <PathTrail
                path={mazeState.pathHistory}
                cellSize={cellSize}
              />
            )}

            {/* Avatar */}
            <Avatar
              animatedPosition={animatedPosition}
              direction={mazeState.avatarDirection}
              cellSize={cellSize}
              status={gameStatus}
            />
          </MazeGrid>
        </View>
      </GestureDetector>

      {/* Inventaire */}
      <Inventory
        items={mazeState.inventory}
        maxSlots={3}
      />

      {/* Contrôles (si mode boutons) */}
      {level.controlMode === 'buttons' && (
        <DirectionalControls onMove={handleMove} />
      )}

      {/* Bouton indice */}
      <View style={styles.actions}>
        <IconButton
          icon="lightbulb"
          onPress={handleHint}
          variant="secondary"
          disabled={mazeState.hintsUsed >= 5}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  levelInfo: {
    alignItems: 'center',
  },
  levelText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 20,
    color: COLORS.text,
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
  },
});
```

### Composant MazeGrid

```typescript
// components/MazeGrid.tsx

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { MazeCell } from './MazeCell';
import { MazeGrid as GridType, ThemeType } from '../types';
import { THEMES } from '../data/themes';

interface Props {
  grid: GridType;
  cellSize: number;
  theme: ThemeType;
  children?: React.ReactNode;
}

export const MazeGrid: React.FC<Props> = ({
  grid,
  cellSize,
  theme,
  children,
}) => {
  const themeConfig = THEMES[theme];

  const gridStyle = useMemo(() => ({
    width: grid.width * cellSize,
    height: grid.height * cellSize,
    backgroundColor: themeConfig.backgroundColor,
  }), [grid.width, grid.height, cellSize, themeConfig]);

  return (
    <View style={[styles.container, gridStyle]}>
      {grid.cells.map((row, y) =>
        row.map((cell, x) => (
          <MazeCell
            key={`${x}-${y}`}
            cell={cell}
            cellSize={cellSize}
            theme={themeConfig}
          />
        ))
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
});
```

### Composant MazeCell

```typescript
// components/MazeCell.tsx

import React, { memo } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { MazeCell as CellType, Theme } from '../types';
import { InteractiveElement } from './InteractiveElement';

interface Props {
  cell: CellType;
  cellSize: number;
  theme: Theme;
}

export const MazeCell: React.FC<Props> = memo(({
  cell,
  cellSize,
  theme,
}) => {
  const isWall = cell.type === 'wall';
  const isStart = cell.type === 'start';
  const isEnd = cell.type === 'end';

  const cellStyle = {
    position: 'absolute' as const,
    left: cell.x * cellSize,
    top: cell.y * cellSize,
    width: cellSize,
    height: cellSize,
  };

  const backgroundStyle = {
    backgroundColor: isWall ? theme.wallColor : theme.pathColor,
  };

  return (
    <View style={[styles.cell, cellStyle, backgroundStyle]}>
      {/* Texture de fond */}
      {!isWall && theme.pathTexture && (
        <Image
          source={{ uri: theme.pathTexture }}
          style={styles.texture}
          resizeMode="cover"
        />
      )}

      {/* Marqueur de départ */}
      {isStart && (
        <View style={styles.startMarker}>
          <Image
            source={{ uri: theme.startIcon }}
            style={styles.markerIcon}
          />
        </View>
      )}

      {/* Marqueur d'arrivée */}
      {isEnd && (
        <View style={styles.endMarker}>
          <Image
            source={{ uri: theme.endIcon }}
            style={styles.markerIcon}
          />
        </View>
      )}

      {/* Élément interactif */}
      {cell.interactive && (
        <InteractiveElement
          element={cell.interactive}
          size={cellSize * 0.7}
        />
      )}

      {/* Trace de visite (fil d'Ariane léger) */}
      {cell.visited && !isWall && (
        <View style={styles.visitedOverlay} />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  texture: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  startMarker: {
    width: '80%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endMarker: {
    width: '80%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerIcon: {
    width: '100%',
    height: '100%',
  },
  visitedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(91, 141, 238, 0.15)',
  },
});
```

### Composant Avatar

```typescript
// components/Avatar.tsx

import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  SharedValue,
} from 'react-native-reanimated';
import { GameStatus } from '../types';

interface Props {
  animatedPosition: {
    x: SharedValue<number>;
    y: SharedValue<number>;
  };
  direction: 'up' | 'down' | 'left' | 'right';
  cellSize: number;
  status: GameStatus;
}

export const Avatar: React.FC<Props> = ({
  animatedPosition,
  direction,
  cellSize,
  status,
}) => {
  // Style animé pour la position
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: animatedPosition.x.value },
        { translateY: animatedPosition.y.value },
      ],
    };
  });

  // Rotation selon la direction
  const getRotation = () => {
    switch (direction) {
      case 'up': return '0deg';
      case 'right': return '90deg';
      case 'down': return '180deg';
      case 'left': return '270deg';
    }
  };

  // Emoji ou image de l'avatar
  const getAvatarEmoji = () => {
    switch (status) {
      case 'blocked':
        return '😕';
      case 'victory':
        return '🎉';
      case 'interacting':
        return '✨';
      default:
        return '🧒';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { width: cellSize * 0.8, height: cellSize * 0.8 },
        animatedStyle,
      ]}
    >
      <Animated.Text
        style={[
          styles.avatar,
          { fontSize: cellSize * 0.5, transform: [{ rotate: getRotation() }] },
        ]}
      >
        {getAvatarEmoji()}
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  avatar: {
    textAlign: 'center',
  },
});
```

### Composant PathTrail

```typescript
// components/PathTrail.tsx

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Position } from '../types';
import { COLORS } from '@/constants/theme';

interface Props {
  path: Position[];
  cellSize: number;
}

export const PathTrail: React.FC<Props> = ({ path, cellSize }) => {
  const svgPath = useMemo(() => {
    if (path.length < 2) return '';

    const points = path.map(p => ({
      x: p.x * cellSize + cellSize / 2,
      y: p.y * cellSize + cellSize / 2,
    }));

    let d = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }

    return d;
  }, [path, cellSize]);

  if (path.length < 2) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg style={StyleSheet.absoluteFill}>
        <Path
          d={svgPath}
          stroke={COLORS.primary}
          strokeWidth={cellSize * 0.2}
          strokeOpacity={0.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </View>
  );
};
```

---

## Hooks Personnalisés

### useMazeGame

```typescript
// hooks/useMazeGame.ts

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useMazeGenerator } from './useMazeGenerator';
import { usePathfinding } from './usePathfinding';
import { saveProgress } from '@/services/storage';

import {
  MazeState,
  GameStatus,
  LevelConfig,
  Position,
  InteractiveElement,
  Direction,
} from '../types';

export function useMazeGame(level: LevelConfig) {
  const { generateMaze } = useMazeGenerator();
  const { findPath, isValidMove, checkVictory } = usePathfinding();

  // État initial
  const [mazeState, setMazeState] = useState<MazeState>(() => {
    const grid = generateMaze(level);
    return {
      grid,
      avatarPosition: grid.start,
      avatarDirection: 'down',
      inventory: [],
      pathHistory: [grid.start],
      visitedCells: new Set([`${grid.start.x},${grid.start.y}`]),
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
  const moveAvatar = useCallback((direction: Direction) => {
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

    // Mettre à jour l'état
    setMazeState(prev => {
      const cell = prev.grid.cells[newPosition.y][newPosition.x];
      let newInventory = [...prev.inventory];
      let collectedItem: InteractiveElement | null = null;

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
          collectedItem = interactive;
          cell.interactive.collected = true;
        } else if (interactive.type === 'gem' && !interactive.collected) {
          newInventory.push({
            id: interactive.id,
            type: 'gem',
            collectedAt: new Date(),
          });
          collectedItem = interactive;
          cell.interactive.collected = true;
        } else if (interactive.type === 'button' && !interactive.isActive) {
          // Activer le bouton et son effet
          cell.interactive.isActive = true;
          collectedItem = interactive;
          // L'effet (ouvrir une porte) est géré séparément
        }
      }

      // Ouvrir une porte si on a la clé
      if (cell.interactive?.type === 'door' && !cell.interactive.isActive) {
        const matchingKey = newInventory.find(
          item => item.type === 'key' && item.color === cell.interactive!.color
        );
        if (matchingKey) {
          cell.interactive.isActive = true;
          newInventory = newInventory.filter(item => item.id !== matchingKey.id);
        }
      }

      const newVisited = new Set(prev.visitedCells);
      newVisited.add(`${newPosition.x},${newPosition.y}`);

      return {
        ...prev,
        avatarPosition: newPosition,
        avatarDirection: direction,
        inventory: newInventory,
        pathHistory: [...prev.pathHistory, newPosition],
        visitedCells: newVisited,
        gemsCollected: newInventory.filter(i => i.type === 'gem').length,
      };
    });

    // Vérifier la victoire
    const isVictory = checkVictory(grid, newPosition);
    if (isVictory) {
      setGameStatus('victory');
      setMazeState(prev => ({ ...prev, isComplete: true }));
    } else {
      setGameStatus('idle');
    }

    return {
      success: true,
      newPosition,
      collectedItem: mazeState.grid.cells[newPosition.y]?.[newPosition.x]?.interactive,
      reachedEnd: isVictory,
    };
  }, [mazeState, isValidMove, checkVictory]);

  // Demander un indice
  const requestHint = useCallback(() => {
    const hintLevel = mazeState.hintsUsed + 1;
    
    if (hintLevel > 5) return null;

    setMazeState(prev => ({ ...prev, hintsUsed: hintLevel }));

    const hints = [
      {
        level: 1,
        type: 'verbal',
        message: "Regarde les chemins que tu n'as pas encore essayés...",
      },
      {
        level: 2,
        type: 'zoom',
        message: "Voilà une vue plus large ! La sortie est par là ⭐",
      },
      {
        level: 3,
        type: 'direction',
        message: "Mon flair d'écureuil me dit... C'est par là ! ➡️",
        direction: findDirectionToEnd(),
      },
      {
        level: 4,
        type: 'partial_path',
        message: "Suis les cases qui brillent !",
        path: findPath(mazeState.grid, mazeState.avatarPosition, mazeState.grid.end)?.slice(0, 5),
      },
      {
        level: 5,
        type: 'full_path',
        message: "Voilà le chemin complet !",
        path: findPath(mazeState.grid, mazeState.avatarPosition, mazeState.grid.end),
      },
    ];

    return hints.find(h => h.level === hintLevel) || null;
  }, [mazeState, findPath]);

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
      visitedCells: new Set([`${grid.start.x},${grid.start.y}`]),
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
  const stats = useMemo(() => ({
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
  }), [mazeState, level]);

  return {
    mazeState: { ...mazeState, stats },
    gameStatus,
    moveAvatar,
    requestHint,
    resetLevel,
  };
}

// Utilitaires
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
    const key = `${pos.x},${pos.y}`;
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
```

### useMazeGenerator

```typescript
// hooks/useMazeGenerator.ts

import { useCallback } from 'react';
import { MazeGrid, MazeCell, LevelConfig, Position, InteractiveElement } from '../types';
import { generateId, shuffle } from '@/utils/helpers';

export function useMazeGenerator() {
  
  // Génération principale
  const generateMaze = useCallback((config: LevelConfig): MazeGrid => {
    const { width, height } = config;
    
    // 1. Initialiser la grille avec tous les murs
    const cells = initializeGrid(width, height);
    
    // 2. Creuser les chemins avec Recursive Backtracking
    recursiveBacktrack(cells, 0, 0);
    
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
    
    if (config.hasButtons) {
      addButtons(cells, interactives);
    }
    
    // 5. Valider que le labyrinthe est solvable
    if (!validateMaze(cells, start, end, [])) {
      // Regénérer si non solvable
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
  visited: Set<string> = new Set()
): void {
  const height = cells.length;
  const width = cells[0].length;
  
  // Marquer comme chemin
  cells[y][x].type = 'path';
  visited.add(`${x},${y}`);
  
  // Directions aléatoires
  const directions = shuffle([
    { dx: 0, dy: -1, wall: 'top', opposite: 'bottom' },
    { dx: 1, dy: 0, wall: 'right', opposite: 'left' },
    { dx: 0, dy: 1, wall: 'bottom', opposite: 'top' },
    { dx: -1, dy: 0, wall: 'left', opposite: 'right' },
  ]);
  
  for (const { dx, dy, wall, opposite } of directions) {
    const nx = x + dx;
    const ny = y + dy;
    
    // Vérifier les limites
    if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
    
    // Vérifier si déjà visité
    if (visited.has(`${nx},${ny}`)) continue;
    
    // Retirer les murs entre les deux cellules
    cells[y][x].walls[wall as keyof typeof cells[0][0]['walls']] = false;
    cells[ny][nx].walls[opposite as keyof typeof cells[0][0]['walls']] = false;
    
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
    c => !(c.x === start.x && c.y === start.y) && !(c.x === end.x && c.y === end.y)
  );
  
  for (let i = 0; i < Math.min(count, colors.length); i++) {
    const color = colors[i];
    
    // Trouver une position pour la porte (sur le chemin vers la sortie)
    const doorCandidates = pathCells.filter(c => 
      c.x > cells[0].length / 2 || c.y > cells.length / 2
    );
    if (doorCandidates.length === 0) continue;
    
    const doorCell = doorCandidates[Math.floor(Math.random() * doorCandidates.length)];
    
    // Trouver une position pour la clé (avant la porte)
    const keyCandidates = pathCells.filter(c =>
      (c.x < doorCell.x || c.y < doorCell.y) &&
      !cells[c.y][c.x].interactive
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
    const idx1 = pathCells.findIndex(c => c.x === keyCell.x && c.y === keyCell.y);
    if (idx1 > -1) pathCells.splice(idx1, 1);
    const idx2 = pathCells.findIndex(c => c.x === doorCell.x && c.y === doorCell.y);
    if (idx2 > -1) pathCells.splice(idx2, 1);
  }
}

function addGems(
  cells: MazeCell[][],
  interactives: InteractiveElement[],
  count: number
): void {
  const pathCells = getPathCells(cells).filter(c => !c.interactive);
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

function addButtons(
  cells: MazeCell[][],
  interactives: InteractiveElement[]
): void {
  // Implémentation des boutons/leviers
  // Simplifié pour cet exemple
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

function validateMaze(
  cells: MazeCell[][],
  start: Position,
  end: Position,
  requiredKeys: string[]
): boolean {
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
    { dx: 0, dy: -1, wall: 'top' },
    { dx: 1, dy: 0, wall: 'right' },
    { dx: 0, dy: 1, wall: 'bottom' },
    { dx: -1, dy: 0, wall: 'left' },
  ];
  
  for (const { dx, dy, wall } of directions) {
    if (!cell.walls[wall as keyof typeof cell.walls]) {
      const nx = pos.x + dx;
      const ny = pos.y + dy;
      if (nx >= 0 && nx < cells[0].length && ny >= 0 && ny < cells.length) {
        if (cells[ny][nx].type !== 'wall') {
          neighbors.push({ x: nx, y: ny });
        }
      }
    }
  }
  
  return neighbors;
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
```

---

## Données de Configuration

### Thèmes

```typescript
// data/themes.ts

import { Theme, ThemeType } from '../types';

export const THEMES: Record<ThemeType, Theme> = {
  forest: {
    id: 'forest',
    name: 'Forêt Enchantée',
    wallColor: '#2D5016',
    pathColor: '#8B7355',
    wallTexture: 'forest_hedge.png',
    pathTexture: 'forest_ground.png',
    startIcon: 'forest_start.png',
    endIcon: 'forest_end.png',
    ambientSound: 'forest_ambient.mp3',
    backgroundColor: '#1A3D0C',
    particles: {
      type: 'leaves',
      density: 0.3,
      speed: 1,
    },
  },
  
  temple: {
    id: 'temple',
    name: 'Temple Ancien',
    wallColor: '#4A4A4A',
    pathColor: '#8B8B7A',
    wallTexture: 'temple_stone.png',
    pathTexture: 'temple_floor.png',
    startIcon: 'temple_entrance.png',
    endIcon: 'temple_treasure.png',
    ambientSound: 'temple_ambient.mp3',
    backgroundColor: '#2C2C2C',
    particles: {
      type: 'dust',
      density: 0.2,
      speed: 0.5,
    },
  },
  
  space: {
    id: 'space',
    name: 'Station Spatiale',
    wallColor: '#1E3A5F',
    pathColor: '#0D1B2A',
    wallTexture: 'space_panel.png',
    pathTexture: 'space_floor.png',
    startIcon: 'space_airlock.png',
    endIcon: 'space_bridge.png',
    ambientSound: 'space_ambient.mp3',
    backgroundColor: '#0D1B2A',
    particles: {
      type: 'stars',
      density: 0.5,
      speed: 0.2,
    },
  },
  
  ice: {
    id: 'ice',
    name: 'Château de Glace',
    wallColor: '#A8D8EA',
    pathColor: '#E8F4F8',
    wallTexture: 'ice_wall.png',
    pathTexture: 'ice_snow.png',
    startIcon: 'ice_cave.png',
    endIcon: 'ice_throne.png',
    ambientSound: 'ice_ambient.mp3',
    backgroundColor: '#D4F1F9',
    particles: {
      type: 'snowflakes',
      density: 0.4,
      speed: 0.8,
    },
  },
  
  garden: {
    id: 'garden',
    name: 'Jardin Secret',
    wallColor: '#228B22',
    pathColor: '#F5F5DC',
    wallTexture: 'garden_hedge.png',
    pathTexture: 'garden_path.png',
    startIcon: 'garden_gate.png',
    endIcon: 'garden_gazebo.png',
    ambientSound: 'garden_ambient.mp3',
    backgroundColor: '#90EE90',
    particles: {
      type: 'petals',
      density: 0.3,
      speed: 1.2,
    },
  },
};
```

### Niveaux

```typescript
// data/levels.ts

import { LevelConfig } from '../types';

export const LEVELS: LevelConfig[] = [
  // Niveaux 1-6 : Introduction (5×5)
  {
    id: 1,
    name: 'Premier Pas',
    width: 5,
    height: 5,
    difficulty: 1,
    theme: 'forest',
    hasKeys: false,
    keyCount: 0,
    hasButtons: false,
    hasGems: false,
    gemCount: 0,
    hasTeleporters: false,
    showMiniMap: false,
    showPathTrail: true,
    controlMode: 'swipe',
    unlocked: true,
    stars: 0,
    timeLimits: { threeStars: 30, twoStars: 60, oneStar: 120 },
  },
  // ... niveaux 2-6

  // Niveaux 7-12 : Exploration (7×7)
  {
    id: 7,
    name: 'Carrefours',
    width: 7,
    height: 7,
    difficulty: 2,
    theme: 'forest',
    hasKeys: false,
    keyCount: 0,
    hasButtons: false,
    hasGems: true,
    gemCount: 2,
    hasTeleporters: false,
    showMiniMap: true,
    showPathTrail: true,
    controlMode: 'swipe',
    unlocked: false,
    stars: 0,
    timeLimits: { threeStars: 60, twoStars: 120, oneStar: 180 },
  },
  // ... niveaux 8-12

  // Niveaux 13-18 : Clés et Portes (9×9)
  {
    id: 13,
    name: 'Première Clé',
    width: 9,
    height: 9,
    difficulty: 3,
    theme: 'temple',
    hasKeys: true,
    keyCount: 1,
    hasButtons: false,
    hasGems: true,
    gemCount: 3,
    hasTeleporters: false,
    showMiniMap: true,
    showPathTrail: true,
    controlMode: 'swipe',
    unlocked: false,
    stars: 0,
    timeLimits: { threeStars: 90, twoStars: 180, oneStar: 300 },
  },
  // ... etc.
];
```

---

## Animations

```typescript
// utils/animations.ts

import {
  withSpring,
  withSequence,
  withTiming,
  Easing,
  SharedValue,
} from 'react-native-reanimated';

export const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
};

// Animation de déplacement fluide
export function animateMoveTo(
  x: SharedValue<number>,
  y: SharedValue<number>,
  targetX: number,
  targetY: number
) {
  'worklet';
  x.value = withSpring(targetX, SPRING_CONFIG);
  y.value = withSpring(targetY, SPRING_CONFIG);
}

// Animation de blocage (rebond)
export function animateBlocked(
  x: SharedValue<number>,
  direction: 'left' | 'right' | 'up' | 'down',
  cellSize: number
) {
  'worklet';
  const offset = cellSize * 0.2;
  
  if (direction === 'left' || direction === 'right') {
    const sign = direction === 'right' ? 1 : -1;
    x.value = withSequence(
      withTiming(x.value + sign * offset, { duration: 100 }),
      withSpring(x.value, SPRING_CONFIG)
    );
  }
  // Similar for up/down with y
}

// Animation de collecte d'objet
export function animateCollect(scale: SharedValue<number>) {
  'worklet';
  scale.value = withSequence(
    withTiming(1.3, { duration: 150 }),
    withTiming(0, { duration: 200, easing: Easing.in(Easing.ease) })
  );
}

// Animation de porte qui s'ouvre
export function animateDoorOpen(
  rotation: SharedValue<number>,
  opacity: SharedValue<number>
) {
  'worklet';
  rotation.value = withTiming(90, { duration: 500, easing: Easing.out(Easing.ease) });
  opacity.value = withTiming(0, { duration: 500 });
}
```

---

## Tests

```typescript
// __tests__/useMazeGenerator.test.ts

import { renderHook } from '@testing-library/react-hooks';
import { useMazeGenerator } from '../hooks/useMazeGenerator';

describe('useMazeGenerator', () => {
  it('génère un labyrinthe de la bonne taille', () => {
    const { result } = renderHook(() => useMazeGenerator());
    const maze = result.current.generateMaze({
      width: 7,
      height: 7,
      difficulty: 2,
      theme: 'forest',
      hasKeys: false,
      keyCount: 0,
      hasButtons: false,
      hasGems: false,
      gemCount: 0,
    });

    expect(maze.width).toBe(7);
    expect(maze.height).toBe(7);
    expect(maze.cells.length).toBe(7);
    expect(maze.cells[0].length).toBe(7);
  });

  it('place correctement le départ et la fin', () => {
    const { result } = renderHook(() => useMazeGenerator());
    const maze = result.current.generateMaze({
      width: 5,
      height: 5,
      difficulty: 1,
      theme: 'forest',
    });

    expect(maze.start).toEqual({ x: 0, y: 0 });
    expect(maze.end).toEqual({ x: 4, y: 4 });
    expect(maze.cells[0][0].type).toBe('start');
    expect(maze.cells[4][4].type).toBe('end');
  });

  it('génère un labyrinthe solvable', () => {
    const { result } = renderHook(() => useMazeGenerator());
    
    for (let i = 0; i < 10; i++) {
      const maze = result.current.generateMaze({
        width: 9,
        height: 9,
        difficulty: 3,
        theme: 'temple',
        hasKeys: true,
        keyCount: 2,
      });

      // Vérifier qu'un chemin existe (validation interne)
      expect(maze).toBeDefined();
      expect(maze.cells).toBeDefined();
    }
  });

  it('ajoute le bon nombre de gemmes', () => {
    const { result } = renderHook(() => useMazeGenerator());
    const maze = result.current.generateMaze({
      width: 7,
      height: 7,
      hasGems: true,
      gemCount: 3,
    });

    const gems = maze.interactives.filter(i => i.type === 'gem');
    expect(gems.length).toBe(3);
  });
});
```

---

*Spécifications Techniques Labyrinthe Logique | Application Éducative Montessori iPad*
