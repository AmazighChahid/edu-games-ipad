# ⚙️ Spécifications Techniques - Tour de Hanoï

## Architecture Composants React Native

### Structure des Fichiers

```
/src/components/activities/TourHanoi/
├── index.ts                    # Export principal
├── TourHanoiGame.tsx           # Composant principal du jeu
├── components/
│   ├── Disk.tsx                # Composant disque individuel
│   ├── Peg.tsx                 # Composant piquet
│   ├── GameBoard.tsx           # Plateau de jeu
│   ├── ControlBar.tsx          # Barre de contrôle (home, hint, reset)
│   └── MascotBubble.tsx        # Bulle de dialogue mascotte
├── hooks/
│   ├── useHanoiGame.ts         # Logique de jeu principale
│   ├── useDragAndDrop.ts       # Gestion du drag & drop
│   └── useHints.ts             # Système d'indices
├── utils/
│   ├── hanoiSolver.ts          # Algorithme de résolution
│   └── gameValidation.ts       # Validation des mouvements
├── constants.ts                # Constantes (couleurs, tailles)
├── types.ts                    # Types TypeScript
└── animations.ts               # Configurations Reanimated
```

---

## 📦 Types TypeScript

```typescript
// types.ts

export interface Disk {
  id: number;
  size: number;        // 1 = plus petit, n = plus grand
  color: string;
}

export interface Peg {
  id: 'A' | 'B' | 'C';
  disks: Disk[];       // Du bas vers le haut
  position: { x: number; y: number };
}

export interface GameState {
  pegs: Record<'A' | 'B' | 'C', Peg>;
  selectedDisk: Disk | null;
  moveCount: number;
  startTime: Date;
  hintsUsed: number;
  isComplete: boolean;
  difficulty: DifficultyLevel;
}

export type DifficultyLevel = 'tutorial' | 'easy' | 'medium' | 'hard' | 'expert';

export interface DifficultyConfig {
  diskCount: number;
  optimalMoves: number;
  hintsEnabled: boolean;
  autoHintDelay: number;    // ms avant suggestion d'indice
}

export interface HanoiMove {
  disk: Disk;
  from: Peg['id'];
  to: Peg['id'];
  timestamp: Date;
}

export interface HintLevel {
  level: 1 | 2 | 3;
  message: string;
  targetDisk?: Disk;
  targetPeg?: Peg['id'];
}
```

---

## 🎮 Composant Principal

```typescript
// TourHanoiGame.tsx

import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';

import { GameBoard } from './components/GameBoard';
import { ControlBar } from './components/ControlBar';
import { MascotBubble } from './components/MascotBubble';
import { useHanoiGame } from './hooks/useHanoiGame';
import { COLORS, DIMENSIONS } from './constants';
import type { DifficultyLevel } from './types';

interface TourHanoiGameProps {
  difficulty?: DifficultyLevel;
  onComplete?: (stats: GameStats) => void;
  onExit?: () => void;
  childAge?: number;  // Pour adapter les dialogues
}

export const TourHanoiGame: React.FC<TourHanoiGameProps> = ({
  difficulty = 'easy',
  onComplete,
  onExit,
  childAge = 7,
}) => {
  const {
    gameState,
    selectDisk,
    moveDisk,
    resetGame,
    requestHint,
    currentHint,
    mascotMessage,
    dismissMascot,
  } = useHanoiGame({ difficulty, onComplete });

  const handleDiskSelect = useCallback((diskId: number, pegId: string) => {
    selectDisk(diskId, pegId);
  }, [selectDisk]);

  const handleDiskDrop = useCallback((targetPegId: string) => {
    const result = moveDisk(targetPegId);
    if (!result.valid) {
      // Feedback d'erreur géré dans le hook
    }
  }, [moveDisk]);

  return (
    <View style={styles.container}>
      <ControlBar
        onHome={onExit}
        onHint={requestHint}
        onReset={resetGame}
        hintsEnabled={!gameState.isComplete}
      />

      <GameBoard
        pegs={gameState.pegs}
        selectedDisk={gameState.selectedDisk}
        onDiskSelect={handleDiskSelect}
        onDiskDrop={handleDiskDrop}
        currentHint={currentHint}
      />

      {mascotMessage && (
        <MascotBubble
          message={mascotMessage}
          onDismiss={dismissMascot}
          childAge={childAge}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
```

---

## 🪝 Hook Principal de Jeu

```typescript
// hooks/useHanoiGame.ts

import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, DifficultyLevel, HanoiMove, HintLevel } from '../types';
import { DIFFICULTY_CONFIGS, INACTIVITY_DELAY } from '../constants';
import { validateMove, checkWinCondition, getOptimalMove } from '../utils/gameValidation';
import { getMascotMessage } from '../utils/mascotDialogues';

interface UseHanoiGameProps {
  difficulty: DifficultyLevel;
  onComplete?: (stats: GameStats) => void;
}

export const useHanoiGame = ({ difficulty, onComplete }: UseHanoiGameProps) => {
  const config = DIFFICULTY_CONFIGS[difficulty];
  
  const [gameState, setGameState] = useState<GameState>(() => 
    initializeGame(config.diskCount)
  );
  
  const [currentHint, setCurrentHint] = useState<HintLevel | null>(null);
  const [mascotMessage, setMascotMessage] = useState<string | null>(null);
  
  const lastActivityRef = useRef<Date>(new Date());
  const hintLevelRef = useRef<number>(0);
  const moveHistoryRef = useRef<HanoiMove[]>([]);

  // Détection d'inactivité
  useEffect(() => {
    const interval = setInterval(() => {
      const inactiveTime = Date.now() - lastActivityRef.current.getTime();
      
      if (inactiveTime > config.autoHintDelay && !currentHint) {
        setMascotMessage(getMascotMessage('inactivity', hintLevelRef.current));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [config.autoHintDelay, currentHint]);

  // Vérification de victoire
  useEffect(() => {
    if (checkWinCondition(gameState)) {
      setGameState(prev => ({ ...prev, isComplete: true }));
      setMascotMessage(getMascotMessage('victory', gameState.hintsUsed));
      
      onComplete?.({
        moveCount: gameState.moveCount,
        hintsUsed: gameState.hintsUsed,
        duration: Date.now() - gameState.startTime.getTime(),
        difficulty,
      });
    }
  }, [gameState.pegs]);

  const selectDisk = useCallback((diskId: number, pegId: string) => {
    lastActivityRef.current = new Date();
    
    const peg = gameState.pegs[pegId as 'A' | 'B' | 'C'];
    const topDisk = peg.disks[peg.disks.length - 1];
    
    if (topDisk?.id === diskId) {
      setGameState(prev => ({ ...prev, selectedDisk: topDisk }));
      setCurrentHint(null);
    }
  }, [gameState.pegs]);

  const moveDisk = useCallback((targetPegId: string) => {
    lastActivityRef.current = new Date();
    
    if (!gameState.selectedDisk) {
      return { valid: false, reason: 'no_selection' };
    }

    const sourcePeg = findDiskPeg(gameState.pegs, gameState.selectedDisk.id);
    const validation = validateMove(
      gameState.pegs,
      gameState.selectedDisk,
      targetPegId as 'A' | 'B' | 'C'
    );

    if (!validation.valid) {
      // Feedback d'erreur
      setMascotMessage(getMascotMessage('invalidMove'));
      return validation;
    }

    // Effectuer le mouvement
    setGameState(prev => {
      const newPegs = { ...prev.pegs };
      
      // Retirer du piquet source
      newPegs[sourcePeg].disks = newPegs[sourcePeg].disks.slice(0, -1);
      
      // Ajouter au piquet cible
      newPegs[targetPegId].disks = [
        ...newPegs[targetPegId].disks,
        prev.selectedDisk!
      ];

      return {
        ...prev,
        pegs: newPegs,
        selectedDisk: null,
        moveCount: prev.moveCount + 1,
      };
    });

    // Enregistrer le mouvement
    moveHistoryRef.current.push({
      disk: gameState.selectedDisk,
      from: sourcePeg,
      to: targetPegId as 'A' | 'B' | 'C',
      timestamp: new Date(),
    });

    // Reset du niveau d'indice après un mouvement réussi
    hintLevelRef.current = 0;
    setCurrentHint(null);

    return { valid: true };
  }, [gameState]);

  const requestHint = useCallback(() => {
    lastActivityRef.current = new Date();
    hintLevelRef.current = Math.min(hintLevelRef.current + 1, 3);

    const optimalMove = getOptimalMove(gameState.pegs);
    const hint = generateHint(hintLevelRef.current, optimalMove);
    
    setCurrentHint(hint);
    setMascotMessage(hint.message);
    setGameState(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
  }, [gameState.pegs]);

  const resetGame = useCallback(() => {
    setGameState(initializeGame(config.diskCount));
    setCurrentHint(null);
    setMascotMessage(null);
    hintLevelRef.current = 0;
    moveHistoryRef.current = [];
  }, [config.diskCount]);

  const dismissMascot = useCallback(() => {
    setMascotMessage(null);
  }, []);

  return {
    gameState,
    selectDisk,
    moveDisk,
    resetGame,
    requestHint,
    currentHint,
    mascotMessage,
    dismissMascot,
  };
};

// Fonction d'initialisation
function initializeGame(diskCount: number): GameState {
  const disks: Disk[] = Array.from({ length: diskCount }, (_, i) => ({
    id: i + 1,
    size: diskCount - i,
    color: DISK_COLORS[i],
  }));

  return {
    pegs: {
      A: { id: 'A', disks, position: { x: 0, y: 0 } },
      B: { id: 'B', disks: [], position: { x: 0, y: 0 } },
      C: { id: 'C', disks: [], position: { x: 0, y: 0 } },
    },
    selectedDisk: null,
    moveCount: 0,
    startTime: new Date(),
    hintsUsed: 0,
    isComplete: false,
    difficulty: 'easy',
  };
}
```

---

## 🎨 Composant Disque avec Animation

```typescript
// components/Disk.tsx

import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

import { DIMENSIONS, COLORS } from '../constants';
import type { Disk as DiskType } from '../types';

interface DiskProps {
  disk: DiskType;
  isSelected: boolean;
  isTopDisk: boolean;
  pegPosition: { x: number; y: number };
  stackIndex: number;
  onSelect: () => void;
  onDrop: (targetPegId: string) => void;
  pegsPositions: Record<string, { x: number; y: number }>;
}

export const Disk: React.FC<DiskProps> = ({
  disk,
  isSelected,
  isTopDisk,
  pegPosition,
  stackIndex,
  onSelect,
  onDrop,
  pegsPositions,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const zIndex = useSharedValue(0);

  const diskWidth = DIMENSIONS.disk.baseWidth + disk.size * DIMENSIONS.disk.sizeIncrement;
  const diskHeight = DIMENSIONS.disk.height;

  // Animation de sélection
  React.useEffect(() => {
    if (isSelected) {
      scale.value = withSpring(1.05);
      translateY.value = withSpring(-20);
      zIndex.value = 100;
    } else {
      scale.value = withSpring(1);
      translateY.value = withSpring(0);
      zIndex.value = stackIndex;
    }
  }, [isSelected]);

  // Geste de drag
  const panGesture = Gesture.Pan()
    .enabled(isTopDisk)
    .onStart(() => {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      runOnJS(onSelect)();
      zIndex.value = 100;
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY - 20;
    })
    .onEnd((event) => {
      // Trouver le piquet cible
      const targetPeg = findTargetPeg(
        event.absoluteX,
        event.absoluteY,
        pegsPositions
      );

      if (targetPeg) {
        runOnJS(onDrop)(targetPeg);
      }

      // Reset position
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      zIndex.value = stackIndex;
    });

  // Geste de tap
  const tapGesture = Gesture.Tap()
    .enabled(isTopDisk)
    .onStart(() => {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      runOnJS(onSelect)();
    });

  const composedGesture = Gesture.Exclusive(panGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: zIndex.value,
  }));

  // Animation d'erreur (shake)
  const shakeAnimation = () => {
    translateX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          styles.disk,
          {
            width: diskWidth,
            height: diskHeight,
            backgroundColor: disk.color,
            bottom: stackIndex * (diskHeight + 2),
          },
          isSelected && styles.selectedDisk,
          animatedStyle,
        ]}
      />
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  disk: {
    position: 'absolute',
    borderRadius: DIMENSIONS.disk.borderRadius,
    alignSelf: 'center',
    // Ombre portée
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedDisk: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
});

// Helper pour trouver le piquet cible
function findTargetPeg(
  x: number,
  y: number,
  pegsPositions: Record<string, { x: number; y: number }>
): string | null {
  const threshold = DIMENSIONS.peg.dropZoneRadius;

  for (const [pegId, pos] of Object.entries(pegsPositions)) {
    const distance = Math.sqrt(
      Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2)
    );
    if (distance < threshold) {
      return pegId;
    }
  }
  return null;
}
```

---

## 📏 Constantes

```typescript
// constants.ts

export const COLORS = {
  background: '#FFF9F0',
  primary: '#5B8DEE',
  secondary: '#FFB347',
  success: '#7BC74D',
  accent: '#E056FD',
  attention: '#F39C12',
  peg: '#8B4513',
  
  disks: [
    '#E74C3C', // Rouge
    '#F39C12', // Orange
    '#F1C40F', // Jaune
    '#2ECC71', // Vert
    '#3498DB', // Bleu
    '#9B59B6', // Violet
    '#1ABC9C', // Turquoise
  ],
};

export const DIMENSIONS = {
  disk: {
    baseWidth: 60,
    sizeIncrement: 25,
    height: 30,
    borderRadius: 8,
  },
  peg: {
    width: 12,
    height: 180,
    baseWidth: 140,
    baseHeight: 20,
    dropZoneRadius: 80,
  },
  button: {
    size: 64,        // Minimum pour enfants
    iconSize: 32,
  },
  spacing: {
    pegGap: 20,
  },
};

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  tutorial: {
    diskCount: 2,
    optimalMoves: 3,
    hintsEnabled: true,
    autoHintDelay: 15000,
  },
  easy: {
    diskCount: 3,
    optimalMoves: 7,
    hintsEnabled: true,
    autoHintDelay: 30000,
  },
  medium: {
    diskCount: 4,
    optimalMoves: 15,
    hintsEnabled: true,
    autoHintDelay: 45000,
  },
  hard: {
    diskCount: 5,
    optimalMoves: 31,
    hintsEnabled: true,
    autoHintDelay: 60000,
  },
  expert: {
    diskCount: 6,
    optimalMoves: 63,
    hintsEnabled: true,
    autoHintDelay: 90000,
  },
};

export const ANIMATION = {
  spring: {
    damping: 15,
    stiffness: 150,
  },
  timing: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  shake: {
    duration: 50,
    distance: 10,
    count: 3,
  },
};

export const SOUNDS = {
  diskSelect: 'disk_select.mp3',
  diskPlace: 'disk_place.mp3',
  invalidMove: 'invalid_move.mp3',
  victory: 'victory.mp3',
  hint: 'hint.mp3',
};

export const INACTIVITY_DELAY = {
  firstWarning: 30000,   // 30 secondes
  hintSuggestion: 60000, // 1 minute
};
```

---

## 🧮 Algorithme de Résolution

```typescript
// utils/hanoiSolver.ts

import { Peg } from '../types';

/**
 * Calcule le mouvement optimal suivant pour résoudre la Tour de Hanoï
 * Utilise l'algorithme récursif classique
 */
export function getOptimalMove(
  pegs: Record<'A' | 'B' | 'C', Peg>
): { from: string; to: string; disk: number } | null {
  const moves = solveHanoi(
    countDisks(pegs),
    'A',
    'C',
    'B'
  );

  // Trouver le premier mouvement non encore effectué
  const currentState = serializeState(pegs);
  let simulatedState = getInitialState(countDisks(pegs));

  for (const move of moves) {
    if (serializeState(simulatedState) === currentState) {
      return move;
    }
    simulatedState = applyMove(simulatedState, move);
  }

  return null; // Puzzle déjà résolu
}

/**
 * Génère la séquence complète de mouvements optimaux
 */
function solveHanoi(
  n: number,
  source: string,
  target: string,
  auxiliary: string
): Array<{ from: string; to: string; disk: number }> {
  if (n === 0) return [];

  return [
    ...solveHanoi(n - 1, source, auxiliary, target),
    { from: source, to: target, disk: n },
    ...solveHanoi(n - 1, auxiliary, target, source),
  ];
}

/**
 * Valide si un mouvement est légal
 */
export function validateMove(
  pegs: Record<'A' | 'B' | 'C', Peg>,
  disk: Disk,
  targetPegId: 'A' | 'B' | 'C'
): { valid: boolean; reason?: string } {
  const targetPeg = pegs[targetPegId];
  const topDiskOnTarget = targetPeg.disks[targetPeg.disks.length - 1];

  if (!topDiskOnTarget) {
    return { valid: true };
  }

  if (disk.size > topDiskOnTarget.size) {
    return { 
      valid: false, 
      reason: 'cannot_place_larger_on_smaller' 
    };
  }

  return { valid: true };
}

/**
 * Vérifie si le puzzle est résolu
 */
export function checkWinCondition(
  pegs: Record<'A' | 'B' | 'C', Peg>,
  totalDisks: number
): boolean {
  return pegs.C.disks.length === totalDisks;
}

// Helpers
function countDisks(pegs: Record<'A' | 'B' | 'C', Peg>): number {
  return pegs.A.disks.length + pegs.B.disks.length + pegs.C.disks.length;
}

function serializeState(pegs: Record<'A' | 'B' | 'C', Peg>): string {
  return JSON.stringify({
    A: pegs.A.disks.map(d => d.id),
    B: pegs.B.disks.map(d => d.id),
    C: pegs.C.disks.map(d => d.id),
  });
}
```

---

## 📊 Métriques et Analytics

```typescript
// utils/analytics.ts

export interface GameStats {
  activityId: 'tour_hanoi';
  difficulty: DifficultyLevel;
  completed: boolean;
  moveCount: number;
  optimalMoves: number;
  efficiency: number;        // moveCount / optimalMoves
  hintsUsed: number;
  duration: number;          // ms
  invalidMoveAttempts: number;
  timestamp: Date;
}

export function calculateStats(gameState: GameState): GameStats {
  const config = DIFFICULTY_CONFIGS[gameState.difficulty];
  
  return {
    activityId: 'tour_hanoi',
    difficulty: gameState.difficulty,
    completed: gameState.isComplete,
    moveCount: gameState.moveCount,
    optimalMoves: config.optimalMoves,
    efficiency: gameState.moveCount / config.optimalMoves,
    hintsUsed: gameState.hintsUsed,
    duration: Date.now() - gameState.startTime.getTime(),
    invalidMoveAttempts: 0, // À tracker séparément
    timestamp: new Date(),
  };
}

export function getProgressionInsights(stats: GameStats[]): ProgressionInsight {
  // Analyse pour l'espace parent
  return {
    averageEfficiency: calculateAverage(stats.map(s => s.efficiency)),
    hintsUsageTrend: calculateTrend(stats.map(s => s.hintsUsed)),
    highestDifficulty: getHighestDifficulty(stats),
    totalPlayTime: stats.reduce((acc, s) => acc + s.duration, 0),
    sessionsCount: stats.length,
    improvementRate: calculateImprovementRate(stats),
  };
}
```

---

## ✅ Checklist d'Implémentation

- [ ] Composant `TourHanoiGame` principal
- [ ] Composant `Disk` avec animations Reanimated
- [ ] Composant `Peg` avec zone de drop
- [ ] Hook `useHanoiGame` avec logique complète
- [ ] Système de drag & drop avec Gesture Handler
- [ ] Validation des mouvements
- [ ] Algorithme de calcul d'indices
- [ ] Animations de feedback (succès, erreur, shake)
- [ ] Intégration sons (expo-av)
- [ ] Haptics feedback
- [ ] Persistance progression (AsyncStorage)
- [ ] Tests unitaires logique de jeu
- [ ] Tests E2E avec Detox

---

*Spécifications Techniques - Tour de Hanoï | React Native + Expo SDK 52+*
