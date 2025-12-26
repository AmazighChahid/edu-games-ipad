# ⚙️ SPECS TECHNIQUES : Balance Logique

## Architecture des Composants

### Structure des Fichiers

```
/src/components/activities/Balance/
├── BalanceGame.tsx                 # Composant principal
├── components/
│   ├── BalanceScale.tsx            # Balance complète animée
│   ├── BalanceBeam.tsx             # Fléau (barre horizontale)
│   ├── BalancePlate.tsx            # Plateau (gauche/droite)
│   ├── BalancePivot.tsx            # Pivot central
│   ├── WeightObject.tsx            # Objet draggable
│   ├── ObjectStock.tsx             # Réserve d'objets
│   ├── EquivalenceDisplay.tsx      # Affichage équivalence découverte
│   ├── EquivalenceJournal.tsx      # Journal des découvertes
│   ├── LevelSelector.tsx           # Sélection du niveau
│   └── VictoryScreen.tsx           # Écran de victoire
├── hooks/
│   ├── useBalanceGame.ts           # Logique de jeu principale
│   ├── useBalancePhysics.ts        # Physique et animation de la balance
│   ├── useDragAndDrop.ts           # Gestion du drag & drop
│   └── useEquivalences.ts          # Gestion des découvertes
├── utils/
│   ├── weightCalculator.ts         # Calcul des poids
│   └── equivalenceChecker.ts       # Vérification des équivalences
├── data/
│   ├── puzzles.ts                  # Défis par niveau
│   ├── objects.ts                  # Définition des objets
│   └── equivalences.ts             # Équivalences à découvrir
├── constants/
│   └── balanceConfig.ts            # Configuration globale
└── types/
    └── index.ts                    # Types TypeScript
```

---

## Types TypeScript

### Types de Base

```typescript
// types/index.ts

// ============================================
// OBJETS ET POIDS
// ============================================

export type ObjectCategory = 'fruit' | 'animal' | 'weight' | 'unknown';

export interface WeightObject {
  id: string;
  type: ObjectCategory;
  name: string;
  emoji: string;
  value: number;              // Poids réel (peut être caché)
  displayValue?: number;      // Valeur affichée (pour poids numériques)
  isUnknown?: boolean;        // Pour les [?]
  color?: string;             // Couleur de fond optionnelle
}

// Objets prédéfinis
export const OBJECTS: Record<string, WeightObject> = {
  // Fruits
  apple: { id: 'apple', type: 'fruit', name: 'Pomme', emoji: '🍎', value: 1 },
  banana: { id: 'banana', type: 'fruit', name: 'Banane', emoji: '🍌', value: 2 },
  watermelon: { id: 'watermelon', type: 'fruit', name: 'Pastèque', emoji: '🍉', value: 3 },
  orange: { id: 'orange', type: 'fruit', name: 'Orange', emoji: '🍊', value: 1.5 },
  strawberry: { id: 'strawberry', type: 'fruit', name: 'Fraise', emoji: '🍓', value: 0.5 },
  
  // Animaux
  elephant: { id: 'elephant', type: 'animal', name: 'Éléphant', emoji: '🐘', value: 5 },
  bear: { id: 'bear', type: 'animal', name: 'Ours', emoji: '🐻', value: 4 },
  rabbit: { id: 'rabbit', type: 'animal', name: 'Lapin', emoji: '🐰', value: 2 },
  mouse: { id: 'mouse', type: 'animal', name: 'Souris', emoji: '🐭', value: 0.5 },
  
  // Poids numériques
  weight1: { id: 'weight1', type: 'weight', name: '1', emoji: '1', value: 1, displayValue: 1 },
  weight2: { id: 'weight2', type: 'weight', name: '2', emoji: '2', value: 2, displayValue: 2 },
  weight3: { id: 'weight3', type: 'weight', name: '3', emoji: '3', value: 3, displayValue: 3 },
  weight4: { id: 'weight4', type: 'weight', name: '4', emoji: '4', value: 4, displayValue: 4 },
  weight5: { id: 'weight5', type: 'weight', name: '5', emoji: '5', value: 5, displayValue: 5 },
  // ... jusqu'à 10
  
  // Inconnue
  unknown: { id: 'unknown', type: 'unknown', name: '?', emoji: '?', value: 0, isUnknown: true },
};

// ============================================
// PLATEAUX ET BALANCE
// ============================================

export type PlateSide = 'left' | 'right';

export interface PlateContent {
  side: PlateSide;
  objects: PlacedObject[];
  totalWeight: number;
}

export interface PlacedObject extends WeightObject {
  instanceId: string;         // ID unique pour cette instance
  position: { x: number; y: number };  // Position sur le plateau
}

export interface BalanceState {
  leftPlate: PlateContent;
  rightPlate: PlateContent;
  angle: number;              // -30 à +30 degrés
  isBalanced: boolean;
  isAnimating: boolean;
}

// ============================================
// PUZZLES / NIVEAUX
// ============================================

export type Phase = 1 | 2 | 3 | 4;

export interface Puzzle {
  id: number;
  phase: Phase;
  name: string;
  description: string;
  
  // Configuration initiale
  initialLeft: ObjectConfig[];
  initialRight: ObjectConfig[];
  
  // Objets disponibles dans le stock
  availableObjects: StockConfig[];
  
  // Objectif
  targetBalance: boolean;     // Doit équilibrer (toujours true pour l'instant)
  
  // Pour les niveaux avec inconnue (phase 4)
  unknownValue?: number;      // Valeur que le [?] doit avoir
  
  // Équivalences pouvant être découvertes
  possibleEquivalences?: Equivalence[];
  
  // Indices
  hints: string[];
  
  // Critères de réussite
  maxHintsForThreeStars: number;
  maxAttemptsForThreeStars: number;
}

export interface ObjectConfig {
  objectId: string;           // Référence à OBJECTS
  count: number;
  isLocked?: boolean;         // Ne peut pas être retiré
}

export interface StockConfig {
  objectId: string;
  count: number;              // Nombre disponible
  infinite?: boolean;         // Stock infini
}

// ============================================
// ÉQUIVALENCES
// ============================================

export interface Equivalence {
  id: string;
  leftSide: { objectId: string; count: number }[];
  rightSide: { objectId: string; count: number }[];
  displayString: string;      // "1 🍉 = 3 🍎"
  discoveredAt?: Date;
}

// ============================================
// ÉTAT DU JEU
// ============================================

export interface GameState {
  currentPuzzle: Puzzle;
  balance: BalanceState;
  stock: Map<string, number>;           // objectId -> count restant
  history: HistoryEntry[];
  hintsUsed: number;
  attempts: number;                     // Nombre de configurations essayées
  startTime: Date;
  isComplete: boolean;
  discoveredEquivalences: Equivalence[];
}

export interface HistoryEntry {
  action: 'add' | 'remove';
  side: PlateSide;
  object: WeightObject;
  timestamp: Date;
  balanceAngle: number;
}

export type GameStatus = 
  | 'idle'
  | 'dragging'
  | 'animating'
  | 'balanced'
  | 'complete';

// ============================================
// PROGRESSION
// ============================================

export interface PlayerProgress {
  completedPuzzles: number[];
  starsPerPuzzle: Record<number, 1 | 2 | 3>;
  discoveredEquivalences: Equivalence[];
  unlockedPhases: Phase[];
  totalTime: number;
  currentStreak: number;
}

export interface SessionStats {
  puzzleId: number;
  completed: boolean;
  time: number;
  attempts: number;
  hintsUsed: number;
  stars: 1 | 2 | 3;
  newEquivalences: Equivalence[];
}
```

---

## Composants React Native

### Composant Principal

```typescript
// BalanceGame.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { BalanceScale } from './components/BalanceScale';
import { ObjectStock } from './components/ObjectStock';
import { EquivalenceDisplay } from './components/EquivalenceDisplay';
import { VictoryScreen } from './components/VictoryScreen';
import { MascotBubble } from '@/components/mascot/MascotBubble';
import { IconButton } from '@/components/ui/IconButton';

import { useBalanceGame } from './hooks/useBalanceGame';
import { useBalancePhysics } from './hooks/useBalancePhysics';
import { useSound } from '@/hooks/useSound';
import { useHaptics } from '@/hooks/useHaptics';

import { COLORS } from '@/constants/theme';
import { Puzzle, PlacedObject, PlateSide, SessionStats, Equivalence } from './types';

interface Props {
  puzzle: Puzzle;
  onComplete: (stats: SessionStats) => void;
  onExit: () => void;
}

export const BalanceGame: React.FC<Props> = ({
  puzzle,
  onComplete,
  onExit,
}) => {
  const {
    gameState,
    addObjectToPlate,
    removeObjectFromPlate,
    requestHint,
    resetPuzzle,
    checkBalance,
  } = useBalanceGame(puzzle);

  const { angle, isBalanced } = useBalancePhysics(
    gameState.balance.leftPlate.totalWeight,
    gameState.balance.rightPlate.totalWeight
  );

  const { playSound } = useSound();
  const { triggerHaptic } = useHaptics();

  const [mascotMessage, setMascotMessage] = useState<string>('');
  const [showVictory, setShowVictory] = useState(false);
  const [newEquivalence, setNewEquivalence] = useState<Equivalence | null>(null);
  const [draggedObject, setDraggedObject] = useState<PlacedObject | null>(null);

  // Initialisation
  useEffect(() => {
    setMascotMessage("Glisse des objets sur le plateau pour équilibrer !");
  }, [puzzle.id]);

  // Surveillance de l'équilibre
  useEffect(() => {
    if (isBalanced && !gameState.isComplete) {
      handleBalanceAchieved();
    }
  }, [isBalanced]);

  // Gestion du drag start
  const handleDragStart = useCallback((object: PlacedObject) => {
    setDraggedObject(object);
    playSound('pickup');
    triggerHaptic('light');
  }, []);

  // Gestion du drop sur un plateau
  const handleDropOnPlate = useCallback((side: PlateSide) => {
    if (!draggedObject) return;

    const success = addObjectToPlate(draggedObject, side);
    
    if (success) {
      playSound('drop');
      triggerHaptic('medium');
      updateMascotMessage();
    }

    setDraggedObject(null);
  }, [draggedObject, addObjectToPlate]);

  // Gestion du retrait d'un objet
  const handleRemoveObject = useCallback((object: PlacedObject, side: PlateSide) => {
    removeObjectFromPlate(object.instanceId, side);
    playSound('whoosh');
  }, [removeObjectFromPlate]);

  // Équilibre atteint !
  const handleBalanceAchieved = useCallback(() => {
    playSound('balance');
    triggerHaptic('success');
    
    // Vérifier si nouvelle équivalence découverte
    const equivalence = checkForNewEquivalence();
    if (equivalence) {
      setNewEquivalence(equivalence);
      playSound('discovery');
    }

    // Attendre un moment avant la victoire
    setTimeout(() => {
      setShowVictory(true);
      
      const stats: SessionStats = {
        puzzleId: puzzle.id,
        completed: true,
        time: (Date.now() - gameState.startTime.getTime()) / 1000,
        attempts: gameState.attempts,
        hintsUsed: gameState.hintsUsed,
        stars: calculateStars(),
        newEquivalences: equivalence ? [equivalence] : [],
      };

      onComplete(stats);
    }, 1500);
  }, [gameState, puzzle]);

  // Mise à jour du message de la mascotte
  const updateMascotMessage = useCallback(() => {
    const leftWeight = gameState.balance.leftPlate.totalWeight;
    const rightWeight = gameState.balance.rightPlate.totalWeight;
    const diff = leftWeight - rightWeight;

    if (Math.abs(diff) < 0.1) {
      setMascotMessage("🎉 Parfait équilibre !");
    } else if (diff > 2) {
      setMascotMessage("Le côté gauche est bien plus lourd !");
    } else if (diff > 0) {
      setMascotMessage("Presque ! Encore un peu à droite...");
    } else if (diff < -2) {
      setMascotMessage("Oups ! Trop lourd à droite !");
    } else {
      setMascotMessage("Presque équilibré ! Un petit ajustement ?");
    }
  }, [gameState.balance]);

  // Demande d'indice
  const handleHint = useCallback(() => {
    const hint = requestHint();
    if (hint) {
      playSound('hint');
      setMascotMessage(hint);
    }
  }, [requestHint]);

  // Calcul des étoiles
  const calculateStars = useCallback((): 1 | 2 | 3 => {
    const { maxHintsForThreeStars, maxAttemptsForThreeStars } = puzzle;
    
    if (gameState.hintsUsed <= maxHintsForThreeStars && 
        gameState.attempts <= maxAttemptsForThreeStars) {
      return 3;
    } else if (gameState.hintsUsed <= maxHintsForThreeStars + 1) {
      return 2;
    }
    return 1;
  }, [gameState, puzzle]);

  // Vérification de nouvelle équivalence
  const checkForNewEquivalence = useCallback((): Equivalence | null => {
    // Logique de détection d'équivalence
    // Compare les objets des deux côtés et vérifie si c'est une nouvelle découverte
    return null; // Implémentation à compléter
  }, [gameState]);

  if (showVictory) {
    return (
      <VictoryScreen
        stats={gameState.stats}
        newEquivalence={newEquivalence}
        onNextLevel={() => {/* navigation */}}
        onReplay={resetPuzzle}
        onExit={onExit}
      />
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="home" onPress={onExit} size={48} />
        <View style={styles.actions}>
          <IconButton icon="lightbulb" onPress={handleHint} size={48} />
          <IconButton icon="refresh" onPress={resetPuzzle} size={48} />
        </View>
      </View>

      {/* Mascotte */}
      <MascotBubble
        mascot="hibou"
        message={mascotMessage}
        visible={!!mascotMessage}
        position="top"
      />

      {/* Balance */}
      <View style={styles.balanceContainer}>
        <BalanceScale
          leftPlate={gameState.balance.leftPlate}
          rightPlate={gameState.balance.rightPlate}
          angle={angle}
          isBalanced={isBalanced}
          onDropLeft={() => handleDropOnPlate('left')}
          onDropRight={() => handleDropOnPlate('right')}
          onRemoveObject={handleRemoveObject}
        />
      </View>

      {/* Stock d'objets */}
      <ObjectStock
        stock={gameState.stock}
        puzzle={puzzle}
        onDragStart={handleDragStart}
        disabled={gameState.isComplete}
      />

      {/* Affichage équivalence découverte */}
      {newEquivalence && (
        <EquivalenceDisplay
          equivalence={newEquivalence}
          onDismiss={() => setNewEquivalence(null)}
        />
      )}
    </GestureHandlerRootView>
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
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  balanceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});
```

### Composant BalanceScale

```typescript
// components/BalanceScale.tsx

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

import { BalanceBeam } from './BalanceBeam';
import { BalancePlate } from './BalancePlate';
import { BalancePivot } from './BalancePivot';
import { PlateContent, PlateSide, PlacedObject } from '../types';
import { COLORS } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BALANCE_WIDTH = SCREEN_WIDTH * 0.8;
const BEAM_HEIGHT = 20;
const PLATE_SIZE = 120;

interface Props {
  leftPlate: PlateContent;
  rightPlate: PlateContent;
  angle: Animated.SharedValue<number>;
  isBalanced: boolean;
  onDropLeft: () => void;
  onDropRight: () => void;
  onRemoveObject: (object: PlacedObject, side: PlateSide) => void;
}

export const BalanceScale: React.FC<Props> = ({
  leftPlate,
  rightPlate,
  angle,
  isBalanced,
  onDropLeft,
  onDropRight,
  onRemoveObject,
}) => {
  // Animation du fléau
  const beamStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${angle.value}deg` }],
  }));

  // Animation des plateaux (montée/descente)
  const leftPlateStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      angle.value,
      [-30, 0, 30],
      [-40, 0, 40],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateY }],
    };
  });

  const rightPlateStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      angle.value,
      [-30, 0, 30],
      [40, 0, -40],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateY }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Pivot central */}
      <BalancePivot isBalanced={isBalanced} />

      {/* Fléau */}
      <Animated.View style={[styles.beamContainer, beamStyle]}>
        <BalanceBeam width={BALANCE_WIDTH} />

        {/* Plateau gauche */}
        <Animated.View style={[styles.plateLeft, leftPlateStyle]}>
          <BalancePlate
            content={leftPlate}
            side="left"
            size={PLATE_SIZE}
            onDrop={onDropLeft}
            onRemoveObject={(obj) => onRemoveObject(obj, 'left')}
          />
        </Animated.View>

        {/* Plateau droit */}
        <Animated.View style={[styles.plateRight, rightPlateStyle]}>
          <BalancePlate
            content={rightPlate}
            side="right"
            size={PLATE_SIZE}
            onDrop={onDropRight}
            onRemoveObject={(obj) => onRemoveObject(obj, 'right')}
          />
        </Animated.View>
      </Animated.View>

      {/* Halo doré quand équilibré */}
      {isBalanced && <View style={styles.balancedGlow} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: BALANCE_WIDTH,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  beamContainer: {
    width: BALANCE_WIDTH,
    height: BEAM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plateLeft: {
    position: 'absolute',
    left: 0,
    top: BEAM_HEIGHT / 2,
  },
  plateRight: {
    position: 'absolute',
    right: 0,
    top: BEAM_HEIGHT / 2,
  },
  balancedGlow: {
    position: 'absolute',
    width: BALANCE_WIDTH + 40,
    height: 340,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
});
```

### Composant BalancePlate

```typescript
// components/BalancePlate.tsx

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { PlateContent, PlateSide, PlacedObject } from '../types';
import { WeightObject } from './WeightObject';
import { COLORS } from '@/constants/theme';

interface Props {
  content: PlateContent;
  side: PlateSide;
  size: number;
  onDrop: () => void;
  onRemoveObject: (object: PlacedObject) => void;
}

export const BalancePlate: React.FC<Props> = ({
  content,
  side,
  size,
  onDrop,
  onRemoveObject,
}) => {
  return (
    <Pressable 
      style={[styles.container, { width: size, height: size }]}
      onPress={onDrop}
    >
      {/* Plateau visuel */}
      <View style={styles.plate}>
        {/* Chaînes de suspension */}
        <View style={styles.chains}>
          <View style={styles.chain} />
          <View style={styles.chain} />
        </View>

        {/* Objets placés */}
        <View style={styles.objectsContainer}>
          {content.objects.map((object) => (
            <WeightObject
              key={object.instanceId}
              object={object}
              size={50}
              onPress={() => onRemoveObject(object)}
              isOnPlate
            />
          ))}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  plate: {
    width: '100%',
    height: 80,
    backgroundColor: '#D4A574',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#A6845C',
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  chains: {
    position: 'absolute',
    top: -40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  chain: {
    width: 3,
    height: 40,
    backgroundColor: '#888',
  },
  objectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    gap: 4,
  },
});
```

### Composant WeightObject

```typescript
// components/WeightObject.tsx

import React, { memo } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { WeightObject as WeightObjectType } from '../types';
import { COLORS } from '@/constants/theme';

interface Props {
  object: WeightObjectType;
  size: number;
  onPress?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  isOnPlate?: boolean;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const WeightObject: React.FC<Props> = memo(({
  object,
  size,
  onPress,
  onDragStart,
  onDragEnd,
  isOnPlate,
  disabled,
}) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);

  // Geste de drag
  const dragGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
      scale.value = withSpring(1.2);
      onDragStart?.();
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      isDragging.value = false;
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
      onDragEnd?.();
    })
    .enabled(!disabled && !isOnPlate);

  // Style animé
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: isDragging.value ? 100 : 1,
    opacity: disabled ? 0.5 : 1,
  }));

  // Affichage du contenu
  const renderContent = () => {
    if (object.type === 'weight') {
      return (
        <View style={[styles.weightBox, { width: size, height: size }]}>
          <Text style={styles.weightNumber}>{object.displayValue}</Text>
        </View>
      );
    }

    if (object.isUnknown) {
      return (
        <View style={[styles.unknownBox, { width: size, height: size }]}>
          <Text style={styles.unknownText}>?</Text>
        </View>
      );
    }

    return (
      <Text style={[styles.emoji, { fontSize: size * 0.7 }]}>
        {object.emoji}
      </Text>
    );
  };

  return (
    <GestureDetector gesture={dragGesture}>
      <AnimatedPressable
        style={[
          styles.container,
          { width: size, height: size },
          animatedStyle,
        ]}
        onPress={onPress}
      >
        {renderContent()}
      </AnimatedPressable>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  emoji: {
    textAlign: 'center',
  },
  weightBox: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.primaryDark,
  },
  weightNumber: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 24,
    color: '#fff',
  },
  unknownBox: {
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.accentDark,
  },
  unknownText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 28,
    color: '#fff',
  },
});
```

---

## Hooks Personnalisés

### useBalancePhysics

```typescript
// hooks/useBalancePhysics.ts

import { useEffect } from 'react';
import { useSharedValue, withSpring, withTiming, Easing } from 'react-native-reanimated';

interface UseBalancePhysicsReturn {
  angle: Animated.SharedValue<number>;
  isBalanced: boolean;
}

const BALANCE_CONFIG = {
  maxAngle: 30,           // Angle maximum en degrés
  sensitivity: 3,         // Poids par degré
  balanceTolerance: 0.1,  // Tolérance pour considérer équilibré
  springConfig: {
    damping: 12,
    stiffness: 100,
    mass: 1,
  },
};

export function useBalancePhysics(
  leftWeight: number,
  rightWeight: number
): UseBalancePhysicsReturn {
  const angle = useSharedValue(0);

  // Calcul de l'équilibre
  const diff = leftWeight - rightWeight;
  const isBalanced = Math.abs(diff) < BALANCE_CONFIG.balanceTolerance;

  useEffect(() => {
    // Calculer l'angle cible basé sur la différence de poids
    let targetAngle: number;

    if (isBalanced) {
      targetAngle = 0;
    } else {
      // L'angle est proportionnel à la différence
      // Gauche plus lourd = angle positif (penche à gauche)
      const rawAngle = (diff / BALANCE_CONFIG.sensitivity) * BALANCE_CONFIG.maxAngle;
      
      // Limiter l'angle
      targetAngle = Math.max(
        -BALANCE_CONFIG.maxAngle,
        Math.min(BALANCE_CONFIG.maxAngle, rawAngle)
      );
    }

    // Animation fluide vers l'angle cible
    angle.value = withSpring(targetAngle, BALANCE_CONFIG.springConfig);
  }, [leftWeight, rightWeight]);

  // Animation d'oscillation légère quand équilibré
  useEffect(() => {
    if (isBalanced) {
      // Petite oscillation puis stabilisation
      angle.value = withSpring(0, {
        ...BALANCE_CONFIG.springConfig,
        damping: 20, // Plus de damping pour stabiliser
      });
    }
  }, [isBalanced]);

  return { angle, isBalanced };
}
```

### useBalanceGame

```typescript
// hooks/useBalanceGame.ts

import { useState, useCallback, useMemo } from 'react';
import {
  GameState,
  Puzzle,
  PlacedObject,
  PlateSide,
  WeightObject,
  Equivalence,
} from '../types';
import { OBJECTS } from '../types';
import { generateId } from '@/utils/helpers';

export function useBalanceGame(puzzle: Puzzle) {
  // État initial
  const [gameState, setGameState] = useState<GameState>(() => 
    initializeGame(puzzle)
  );

  // Ajouter un objet sur un plateau
  const addObjectToPlate = useCallback((
    object: WeightObject,
    side: PlateSide
  ): boolean => {
    // Vérifier si l'objet est disponible dans le stock
    const currentStock = gameState.stock.get(object.id) ?? 0;
    if (currentStock <= 0) return false;

    const placedObject: PlacedObject = {
      ...object,
      instanceId: generateId(),
      position: { x: 0, y: 0 },
    };

    setGameState(prev => {
      const plateKey = side === 'left' ? 'leftPlate' : 'rightPlate';
      const plate = prev.balance[plateKey];

      return {
        ...prev,
        balance: {
          ...prev.balance,
          [plateKey]: {
            ...plate,
            objects: [...plate.objects, placedObject],
            totalWeight: plate.totalWeight + object.value,
          },
        },
        stock: new Map(prev.stock).set(object.id, currentStock - 1),
        attempts: prev.attempts + 1,
        history: [
          ...prev.history,
          {
            action: 'add',
            side,
            object,
            timestamp: new Date(),
            balanceAngle: 0, // Sera mis à jour
          },
        ],
      };
    });

    return true;
  }, [gameState.stock]);

  // Retirer un objet d'un plateau
  const removeObjectFromPlate = useCallback((
    instanceId: string,
    side: PlateSide
  ) => {
    setGameState(prev => {
      const plateKey = side === 'left' ? 'leftPlate' : 'rightPlate';
      const plate = prev.balance[plateKey];
      
      const objectToRemove = plate.objects.find(o => o.instanceId === instanceId);
      if (!objectToRemove) return prev;

      const currentStock = prev.stock.get(objectToRemove.id) ?? 0;

      return {
        ...prev,
        balance: {
          ...prev.balance,
          [plateKey]: {
            ...plate,
            objects: plate.objects.filter(o => o.instanceId !== instanceId),
            totalWeight: plate.totalWeight - objectToRemove.value,
          },
        },
        stock: new Map(prev.stock).set(objectToRemove.id, currentStock + 1),
        history: [
          ...prev.history,
          {
            action: 'remove',
            side,
            object: objectToRemove,
            timestamp: new Date(),
            balanceAngle: 0,
          },
        ],
      };
    });
  }, []);

  // Demander un indice
  const requestHint = useCallback((): string | null => {
    const hintIndex = gameState.hintsUsed;
    
    if (hintIndex >= puzzle.hints.length) {
      return "Je n'ai plus d'indices...";
    }

    setGameState(prev => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
    }));

    return puzzle.hints[hintIndex];
  }, [gameState.hintsUsed, puzzle.hints]);

  // Réinitialiser le puzzle
  const resetPuzzle = useCallback(() => {
    setGameState(initializeGame(puzzle));
  }, [puzzle]);

  // Vérifier l'équilibre
  const checkBalance = useCallback(() => {
    const { leftPlate, rightPlate } = gameState.balance;
    return Math.abs(leftPlate.totalWeight - rightPlate.totalWeight) < 0.1;
  }, [gameState.balance]);

  // Statistiques calculées
  const stats = useMemo(() => ({
    puzzleId: puzzle.id,
    completed: gameState.isComplete,
    time: gameState.isComplete 
      ? (new Date().getTime() - gameState.startTime.getTime()) / 1000 
      : 0,
    attempts: gameState.attempts,
    hintsUsed: gameState.hintsUsed,
    stars: calculateStars(gameState, puzzle),
    newEquivalences: gameState.discoveredEquivalences,
  }), [gameState, puzzle]);

  return {
    gameState: { ...gameState, stats },
    addObjectToPlate,
    removeObjectFromPlate,
    requestHint,
    resetPuzzle,
    checkBalance,
  };
}

// Initialisation du jeu
function initializeGame(puzzle: Puzzle): GameState {
  // Créer le stock initial
  const stock = new Map<string, number>();
  for (const config of puzzle.availableObjects) {
    stock.set(config.objectId, config.count);
  }

  // Créer les plateaux initiaux
  const createPlate = (configs: ObjectConfig[], side: PlateSide) => {
    const objects: PlacedObject[] = [];
    let totalWeight = 0;

    for (const config of configs) {
      const baseObject = OBJECTS[config.objectId];
      for (let i = 0; i < config.count; i++) {
        objects.push({
          ...baseObject,
          instanceId: generateId(),
          position: { x: 0, y: 0 },
        });
        totalWeight += baseObject.value;
      }
    }

    return { side, objects, totalWeight };
  };

  return {
    currentPuzzle: puzzle,
    balance: {
      leftPlate: createPlate(puzzle.initialLeft, 'left'),
      rightPlate: createPlate(puzzle.initialRight, 'right'),
      angle: 0,
      isBalanced: false,
      isAnimating: false,
    },
    stock,
    history: [],
    hintsUsed: 0,
    attempts: 0,
    startTime: new Date(),
    isComplete: false,
    discoveredEquivalences: [],
  };
}

// Calcul des étoiles
function calculateStars(state: GameState, puzzle: Puzzle): 1 | 2 | 3 {
  if (state.hintsUsed <= puzzle.maxHintsForThreeStars && 
      state.attempts <= puzzle.maxAttemptsForThreeStars) {
    return 3;
  } else if (state.hintsUsed <= puzzle.maxHintsForThreeStars + 1) {
    return 2;
  }
  return 1;
}
```

---

## Données des Puzzles

```typescript
// data/puzzles.ts

import { Puzzle } from '../types';

export const PUZZLES: Puzzle[] = [
  // ============================================
  // PHASE 1 : OBJETS IDENTIQUES (Niveaux 1-5)
  // ============================================
  {
    id: 1,
    phase: 1,
    name: "Première balance",
    description: "Mets la même chose à droite",
    initialLeft: [{ objectId: 'apple', count: 1 }],
    initialRight: [],
    availableObjects: [{ objectId: 'apple', count: 5 }],
    targetBalance: true,
    hints: [
      "La balance penche à gauche...",
      "Mets une pomme à droite !",
    ],
    maxHintsForThreeStars: 0,
    maxAttemptsForThreeStars: 1,
  },
  {
    id: 2,
    phase: 1,
    name: "Deux pommes",
    description: "Équilibre avec 2 pommes",
    initialLeft: [{ objectId: 'apple', count: 2 }],
    initialRight: [],
    availableObjects: [{ objectId: 'apple', count: 5 }],
    targetBalance: true,
    hints: [
      "Compte les pommes à gauche : 1, 2...",
      "Il faut 2 pommes à droite aussi !",
    ],
    maxHintsForThreeStars: 0,
    maxAttemptsForThreeStars: 2,
  },
  // ... niveaux 3-5

  // ============================================
  // PHASE 2 : ÉQUIVALENCES (Niveaux 6-12)
  // ============================================
  {
    id: 6,
    phase: 2,
    name: "La pastèque mystérieuse",
    description: "Découvre le poids de la pastèque",
    initialLeft: [{ objectId: 'watermelon', count: 1 }],
    initialRight: [],
    availableObjects: [{ objectId: 'apple', count: 6 }],
    targetBalance: true,
    possibleEquivalences: [{
      id: 'watermelon-apples',
      leftSide: [{ objectId: 'watermelon', count: 1 }],
      rightSide: [{ objectId: 'apple', count: 3 }],
      displayString: '🍉 = 🍎🍎🍎',
    }],
    hints: [
      "La pastèque est lourde... Combien de pommes ?",
      "Essaie d'ajouter des pommes une par une.",
      "La pastèque = 3 pommes !",
    ],
    maxHintsForThreeStars: 1,
    maxAttemptsForThreeStars: 4,
  },
  // ... niveaux 7-12

  // ============================================
  // PHASE 3 : NOMBRES (Niveaux 13-20)
  // ============================================
  {
    id: 13,
    phase: 3,
    name: "Premier calcul",
    description: "Fais 5 avec les poids",
    initialLeft: [{ objectId: 'weight5', count: 1 }],
    initialRight: [],
    availableObjects: [
      { objectId: 'weight1', count: 2 },
      { objectId: 'weight2', count: 2 },
      { objectId: 'weight3', count: 2 },
      { objectId: 'weight4', count: 2 },
    ],
    targetBalance: true,
    hints: [
      "Il faut faire 5 à droite.",
      "Quels nombres font 5 ensemble ?",
      "2 + 3 = 5 !",
    ],
    maxHintsForThreeStars: 1,
    maxAttemptsForThreeStars: 3,
  },
  // ... niveaux 14-20

  // ============================================
  // PHASE 4 : PRÉ-ALGÈBRE (Niveaux 21-30)
  // ============================================
  {
    id: 21,
    phase: 4,
    name: "L'inconnue",
    description: "Trouve la valeur du ?",
    initialLeft: [{ objectId: 'weight5', count: 1 }],
    initialRight: [
      { objectId: 'unknown', count: 1 },
      { objectId: 'weight2', count: 1 },
    ],
    availableObjects: [
      { objectId: 'weight1', count: 1 },
      { objectId: 'weight2', count: 1 },
      { objectId: 'weight3', count: 1 },
      { objectId: 'weight4', count: 1 },
    ],
    targetBalance: true,
    unknownValue: 3,
    hints: [
      "5 = ? + 2. Que vaut ? ?",
      "Si tu enlèves 2 des deux côtés...",
      "? = 3 car 5 - 2 = 3",
    ],
    maxHintsForThreeStars: 1,
    maxAttemptsForThreeStars: 3,
  },
  // ... niveaux 22-30
];
```

---

## Configuration

```typescript
// constants/balanceConfig.ts

export const BALANCE_CONFIG = {
  // Physique
  maxAngle: 30,
  sensitivity: 3,
  balanceTolerance: 0.1,
  
  // Animations
  springConfig: {
    damping: 12,
    stiffness: 100,
  },
  
  // UI
  plateSize: 120,
  objectSize: 80,
  beamWidth: '80%',
  
  // Timing
  victoryDelay: 1500,
  
  // Progression
  unlockRequirements: {
    phase2: { completedPuzzles: 5 },
    phase3: { completedPuzzles: 12 },
    phase4: { completedPuzzles: 20, minAge: 9 },
  },
};
```

---

## Tests

```typescript
// __tests__/useBalancePhysics.test.ts

import { renderHook } from '@testing-library/react-hooks';
import { useBalancePhysics } from '../hooks/useBalancePhysics';

describe('useBalancePhysics', () => {
  it('retourne angle=0 quand les poids sont égaux', () => {
    const { result } = renderHook(() => useBalancePhysics(5, 5));
    
    expect(result.current.isBalanced).toBe(true);
  });

  it('penche à gauche quand gauche est plus lourd', () => {
    const { result } = renderHook(() => useBalancePhysics(10, 5));
    
    expect(result.current.isBalanced).toBe(false);
    // L'angle sera positif après animation
  });

  it('penche à droite quand droite est plus lourd', () => {
    const { result } = renderHook(() => useBalancePhysics(5, 10));
    
    expect(result.current.isBalanced).toBe(false);
    // L'angle sera négatif après animation
  });

  it('est équilibré avec une tolérance de 0.1', () => {
    const { result } = renderHook(() => useBalancePhysics(5, 5.05));
    
    expect(result.current.isBalanced).toBe(true);
  });
});

// __tests__/useBalanceGame.test.ts

import { renderHook, act } from '@testing-library/react-hooks';
import { useBalanceGame } from '../hooks/useBalanceGame';
import { PUZZLES } from '../data/puzzles';

describe('useBalanceGame', () => {
  const puzzle = PUZZLES[0]; // Premier puzzle

  it('initialise correctement le jeu', () => {
    const { result } = renderHook(() => useBalanceGame(puzzle));
    
    expect(result.current.gameState.balance.leftPlate.objects.length).toBe(1);
    expect(result.current.gameState.balance.rightPlate.objects.length).toBe(0);
    expect(result.current.gameState.hintsUsed).toBe(0);
  });

  it('ajoute un objet au plateau', () => {
    const { result } = renderHook(() => useBalanceGame(puzzle));
    
    act(() => {
      result.current.addObjectToPlate(
        { id: 'apple', type: 'fruit', name: 'Pomme', emoji: '🍎', value: 1 },
        'right'
      );
    });

    expect(result.current.gameState.balance.rightPlate.objects.length).toBe(1);
    expect(result.current.gameState.balance.rightPlate.totalWeight).toBe(1);
  });

  it('retourne un indice et incrémente le compteur', () => {
    const { result } = renderHook(() => useBalanceGame(puzzle));
    
    let hint: string | null;
    act(() => {
      hint = result.current.requestHint();
    });

    expect(hint).toBe(puzzle.hints[0]);
    expect(result.current.gameState.hintsUsed).toBe(1);
  });
});
```

---

*Spécifications Techniques Balance Logique | Application Éducative Montessori iPad*
