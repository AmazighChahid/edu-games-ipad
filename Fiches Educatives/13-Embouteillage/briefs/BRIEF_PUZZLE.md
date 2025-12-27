# BRIEF REACT NATIVE : EmbouteillageGameScreen

## 📋 MÉTADONNÉES
| Champ | Valeur |
|-------|--------|
| Type | Screen |
| Fichier HTML | embouteillage-puzzle.html |
| Dépendances | ParkingGrid, Vehicle, DraggableVehicle, GarageMascot, HintButton, MovesCounter, GameHeader |

---

## 🌳 STRUCTURE

```
EmbouteillageGameScreen
├── [GestureHandlerRootView] (flex: 1)
│   │
│   ├── [CityBackground] (style: background, animated)
│   │   ├── [Sky] (gradient: evening blue to dark)
│   │   ├── [Stars] (animated twinkle, 15-20 stars)
│   │   ├── [Moon] (style: moon)
│   │   ├── [CityBuildings] (silhouettes with lit windows)
│   │   ├── [Lampposts] (2-3, with glow)
│   │   └── [Ground] (asphalt)
│   │
│   ├── [Header] (style: header)
│   │   ├── [LeftSection]
│   │   │   ├── [BackButton] (touchable, 56×56)
│   │   │   └── [LevelBadge] (icon + "Niveau X")
│   │   ├── [CenterSection]
│   │   │   ├── [StarsDisplay] (3 stars, filled/empty)
│   │   │   └── [MovesCounter] ("X Coups / Optimal: Y")
│   │   └── [RightSection]
│   │       ├── [UndoButton] (touchable, 48×48)
│   │       ├── [ResetButton] (touchable, 48×48)
│   │       └── [HintButton] (touchable, 56×56, pulsing)
│   │
│   ├── [GameArea] (style: gameArea, flex: 1)
│   │   ├── [ParkingGrid] (style: parkingGrid)
│   │   │   ├── [GridBackground] (6×6 cells)
│   │   │   ├── [ExitZone] (right side, row 2, animated glow)
│   │   │   └── [Vehicles] (mapped from puzzle data)
│   │   │       ├── [DraggableVehicle] (taxi, always id: 'taxi')
│   │   │       ├── [DraggableVehicle] (cars, length: 2)
│   │   │       └── [DraggableVehicle] (trucks, length: 3)
│   │   │
│   │   └── [MascotSection] (style: mascotSection)
│   │       ├── [GarageMascot] (Gus mini, 120×130)
│   │       ├── [SpeechBubble] (contextual message)
│   │       └── [TipBox] (optional, hint display)
│   │
│   └── [Footer] (style: footer)
│       ├── [TimerDisplay] (⏱️ MM:SS)
│       ├── [UndoCount] (↩️ X)
│       └── [RecordDisplay] (🏆 X coups)
```

---

## 🎨 STYLES

```typescript
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

// Grid calculations
const GRID_SIZE = 6;
const CELL_SIZE = isTablet ? 90 : 55;
const GRID_PADDING = isTablet ? 40 : 20;
const GRID_WIDTH = CELL_SIZE * GRID_SIZE + GRID_PADDING * 2;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e', // Night sky
  },

  // === BACKGROUND ===
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  sky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '70%',
    // LinearGradient: ['#1a1a2e', '#2d3561', '#4a5568']
  },
  
  star: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  
  moon: {
    position: 'absolute',
    top: 40,
    right: 80,
    width: 60,
    height: 60,
    backgroundColor: '#F5F5DC',
    borderRadius: 30,
    shadowColor: '#F5F5DC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  
  buildings: {
    position: 'absolute',
    bottom: 150,
    left: 0,
    right: 0,
    height: 200,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  
  building: {
    backgroundColor: '#2D3436',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  
  window: {
    width: 8,
    height: 10,
    backgroundColor: '#FFD93D',
    borderRadius: 1,
    margin: 4,
  },
  
  lamppost: {
    position: 'absolute',
    bottom: 100,
    width: 10,
    height: 120,
    backgroundColor: '#4A4A4A',
    borderRadius: 5,
  },
  
  lampGlow: {
    position: 'absolute',
    top: -20,
    left: -25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 200, 100, 0.3)',
  },
  
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#3D3D3D',
  },

  // === HEADER ===
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    zIndex: 10,
  },
  
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  backButton: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  
  levelIcon: {
    fontSize: 20,
  },
  
  levelText: {
    fontFamily: 'Fredoka',
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3436',
  },
  
  centerSection: {
    alignItems: 'center',
    gap: 8,
  },
  
  starsDisplay: {
    flexDirection: 'row',
    gap: 4,
  },
  
  starIcon: {
    fontSize: 28,
  },
  
  starEmpty: {
    opacity: 0.3,
  },
  
  movesCounter: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  
  movesText: {
    fontFamily: 'Fredoka',
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
  },
  
  movesOptimal: {
    color: '#7BC74D',
  },
  
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  
  actionButton: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  
  actionButtonDisabled: {
    opacity: 0.5,
  },
  
  hintButton: {
    width: 56,
    height: 56,
    backgroundColor: '#FFB347',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  
  hintButtonIcon: {
    fontSize: 28,
  },

  // === GAME AREA ===
  gameArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 24,
  },
  
  parkingGrid: {
    width: GRID_WIDTH,
    height: GRID_WIDTH,
    backgroundColor: '#4A4A4A',
    borderRadius: 16,
    padding: GRID_PADDING,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  
  gridInner: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  
  gridCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
  },
  
  exitZone: {
    position: 'absolute',
    right: -GRID_PADDING - 20,
    top: GRID_PADDING + CELL_SIZE * 2,
    width: GRID_PADDING + 40,
    height: CELL_SIZE,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    // LinearGradient: ['#27AE60', '#2ECC71']
  },
  
  exitText: {
    fontFamily: 'Fredoka',
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  
  exitArrow: {
    fontSize: 24,
  },

  // === VEHICLES ===
  vehicle: {
    position: 'absolute',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  
  vehicleHorizontal2: {
    width: CELL_SIZE * 2 - 8,
    height: CELL_SIZE - 8,
  },
  
  vehicleVertical2: {
    width: CELL_SIZE - 8,
    height: CELL_SIZE * 2 - 8,
  },
  
  vehicleHorizontal3: {
    width: CELL_SIZE * 3 - 8,
    height: CELL_SIZE - 8,
  },
  
  vehicleVertical3: {
    width: CELL_SIZE - 8,
    height: CELL_SIZE * 3 - 8,
  },
  
  vehicleSelected: {
    shadowColor: '#5B8DEE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 3,
    borderColor: 'rgba(91, 141, 238, 0.8)',
  },
  
  vehicleWindow: {
    position: 'absolute',
    top: 6,
    left: '20%',
    right: '20%',
    height: '30%',
    backgroundColor: 'rgba(135, 206, 250, 0.6)',
    borderRadius: 4,
  },
  
  vehicleWheels: {
    position: 'absolute',
    bottom: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 8,
  },
  
  wheel: {
    width: 10,
    height: 10,
    backgroundColor: '#2D3436',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#4A4A4A',
  },
  
  vehicleIcon: {
    fontSize: 24,
  },
  
  taxiStripe: {
    position: 'absolute',
    bottom: '40%',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#000',
  },

  // === MASCOT SECTION ===
  mascotSection: {
    alignItems: 'center',
    gap: 16,
    maxWidth: isTablet ? 200 : 140,
  },
  
  speechBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  
  speechText: {
    fontFamily: 'Nunito',
    fontSize: 13,
    fontWeight: '600',
    color: '#2D3436',
    lineHeight: 18,
    textAlign: 'center',
  },
  
  tipBox: {
    backgroundColor: 'rgba(255, 179, 71, 0.2)',
    borderWidth: 2,
    borderColor: '#FFB347',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  
  tipIcon: {
    fontSize: 18,
  },
  
  tipText: {
    fontFamily: 'Nunito',
    fontSize: 12,
    fontWeight: '600',
    color: '#2D3436',
    lineHeight: 16,
    marginTop: 4,
  },

  // === FOOTER ===
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  
  footerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  
  footerIcon: {
    fontSize: 16,
  },
  
  footerValue: {
    fontFamily: 'Fredoka',
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
  },
  
  blockedIndicator: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#E74C3C',
    borderStyle: 'dashed',
    borderRadius: 4,
    pointerEvents: 'none',
  },
});
```

### Couleurs Véhicules
| Type | Couleur | Hex |
|------|---------|-----|
| Taxi | Jaune | #FFD700 |
| Pompier | Rouge | #E74C3C |
| Police | Bleu | #3498DB |
| Jardinier | Vert | #27AE60 |
| Magicien | Violet | #9B59B6 |
| Livreur | Orange | #E67E22 |
| Princesse | Rose | #FD79A8 |
| Déménageur (truck) | Marron | #8B4513 |
| Transporteur (truck) | Bleu foncé | #2C3E50 |
| Recyclage (truck) | Vert foncé | #1E8449 |
| Ciment (truck) | Gris | #7F8C8D |

---

## 🎬 ANIMATIONS

### Animation 1 : Stars Twinkle
```typescript
const starTwinkle = useAnimatedStyle(() => ({
  opacity: withRepeat(
    withSequence(
      withTiming(0.3, { duration: random(1000, 2000) }),
      withTiming(1, { duration: random(1000, 2000) })
    ),
    -1,
    true
  ),
}));
```

### Animation 2 : Exit Zone Glow
```typescript
const exitGlow = useAnimatedStyle(() => ({
  shadowOpacity: withRepeat(
    withSequence(
      withTiming(0.8, { duration: 1000 }),
      withTiming(0.3, { duration: 1000 })
    ),
    -1,
    true
  ),
}));
```

### Animation 3 : Hint Button Pulse
```typescript
const hintPulse = useAnimatedStyle(() => ({
  transform: [
    { scale: withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      true
    )}
  ],
}));
```

### Animation 4 : Vehicle Move
```typescript
const moveVehicle = (toRow: number, toCol: number) => {
  const x = toCol * CELL_SIZE;
  const y = toRow * CELL_SIZE;
  
  translateX.value = withTiming(x, { 
    duration: 200,
    easing: Easing.out(Easing.cubic)
  });
  translateY.value = withTiming(y, { 
    duration: 200,
    easing: Easing.out(Easing.cubic)
  });
};
```

### Animation 5 : Invalid Move Shake
```typescript
const shakeAnimation = () => {
  translateX.value = withSequence(
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(0, { duration: 50 })
  );
};
```

### Animation 6 : Vehicle Drag
```typescript
const dragStyle = useAnimatedStyle(() => ({
  transform: [
    { translateX: translateX.value },
    { translateY: translateY.value },
    { scale: withSpring(isDragging.value ? 1.05 : 1) },
  ],
  zIndex: isDragging.value ? 100 : 1,
  shadowOpacity: withSpring(isDragging.value ? 0.3 : 0.1),
}));
```

### Animation 7 : Taxi Exit
```typescript
const taxiExit = () => {
  // Phase 1: Move to exit
  translateX.value = withTiming(GRID_WIDTH, { duration: 300 });
  
  // Phase 2: Zoom out
  runOnJS(setTimeout)(() => {
    scale.value = withTiming(0.5, { duration: 500 });
    opacity.value = withTiming(0, { duration: 500 });
    translateX.value = withTiming(GRID_WIDTH + 200, { duration: 500 });
  }, 300);
};
```

| Élément | Propriété | Animation | Durée |
|---------|-----------|-----------|-------|
| Stars | opacity | 0.3 ↔ 1 | 2-4s random |
| Exit zone | shadowOpacity | 0.3 ↔ 0.8 | 2s loop |
| Hint button | scale | 1 ↔ 1.1 | 1.6s loop |
| Vehicle move | translate | current → target | 200ms |
| Invalid move | translateX | shake | 250ms |
| Vehicle drag | scale | 1 → 1.05 | spring |
| Taxi exit | multi | exit sequence | 800ms |

---

## 👆 INTERACTIONS

### Drag & Drop Vehicle
```typescript
const panGesture = Gesture.Pan()
  .onStart(() => {
    isDragging.value = true;
    startX.value = translateX.value;
    startY.value = translateY.value;
    runOnJS(hapticFeedback)('impactLight');
  })
  .onUpdate((event) => {
    // Constrain to vehicle axis
    if (vehicle.orientation === 'horizontal') {
      const newX = startX.value + event.translationX;
      const maxX = getMaxDistance('right') * CELL_SIZE;
      const minX = -getMaxDistance('left') * CELL_SIZE;
      translateX.value = Math.max(minX, Math.min(maxX, newX));
    } else {
      const newY = startY.value + event.translationY;
      const maxY = getMaxDistance('down') * CELL_SIZE;
      const minY = -getMaxDistance('up') * CELL_SIZE;
      translateY.value = Math.max(minY, Math.min(maxY, newY));
    }
  })
  .onEnd(() => {
    isDragging.value = false;
    // Snap to nearest cell
    const snappedCol = Math.round(translateX.value / CELL_SIZE);
    const snappedRow = Math.round(translateY.value / CELL_SIZE);
    
    translateX.value = withSpring(snappedCol * CELL_SIZE);
    translateY.value = withSpring(snappedRow * CELL_SIZE);
    
    runOnJS(applyMove)(vehicle.id, snappedRow, snappedCol);
  });
```

### Tap-Tap Mode (Alternative pour accessibilité)
```typescript
const onVehicleTap = (vehicle: Vehicle) => {
  if (selectedVehicle === vehicle.id) {
    // Deselect
    setSelectedVehicle(null);
  } else {
    // Select
    setSelectedVehicle(vehicle.id);
    showMoveOptions(vehicle);
  }
};

const onMoveOptionTap = (direction: 'up' | 'down' | 'left' | 'right', distance: number) => {
  applyMove(selectedVehicle, direction, distance);
  setSelectedVehicle(null);
};
```

| Élément | Geste | Feedback |
|---------|-------|----------|
| Vehicle | Pan | Drag along axis, snap to grid |
| Vehicle | Tap | Select (tap-tap mode) |
| BackButton | onPress | scale 0.95, confirm dialog |
| UndoButton | onPress | scale 0.95, undo last move |
| ResetButton | onPress | scale 0.95, confirm dialog |
| HintButton | onPress | scale 0.95, show next hint |

---

## 👶 CONTRAINTES ENFANT

- [x] Touch targets ≥ 64dp (Back 56×56, Hint 56×56, Vehicles 80×80 minimum)
- [x] Contraste ≥ 4.5:1 
- [x] Feedback immédiat sur tap (vehicle lifts with shadow)
- [x] Pas de feedback punitif (shake instead of error sound)
- [x] Bouton retour visible (top left)
- [x] Mode tap-tap pour motricité réduite
- [x] Patterns + formes sur véhicules pour daltonisme

---

## 🖼️ ASSETS

### Emojis/Icônes
| Usage | Valeur |
|-------|--------|
| Level icons | 🌱 🔧 ⚙️ 🏆 👑 |
| Stars | ⭐ |
| Timer | ⏱️ |
| Undo | ↩️ |
| Reset | 🔄 |
| Hint | 💡 |
| Exit | ➡️ |
| Trophy | 🏆 |
| Taxi | 🚕 |
| Truck icons | 📦 🚚 |

### Sons
| Événement | Fichier |
|-----------|---------|
| Vehicle pickup | pickup.mp3 |
| Vehicle drop | drop.mp3 |
| Invalid move | soft-bump.mp3 |
| Hint reveal | ding.mp3 |
| Victory | fanfare.mp3 |

---

## 🧩 COMPOSANTS À CRÉER

### DraggableVehicle
```typescript
interface DraggableVehicleProps {
  vehicle: Vehicle;
  cellSize: number;
  onMoveComplete: (vehicleId: string, newRow: number, newCol: number) => void;
  getMaxDistance: (direction: Direction) => number;
  isSelected?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
}
```

### ParkingGrid
```typescript
interface ParkingGridProps {
  puzzle: Puzzle;
  vehicles: Vehicle[];
  onVehicleMove: (vehicleId: string, row: number, col: number) => void;
  selectedVehicle: string | null;
  onVehicleSelect: (id: string | null) => void;
  showBlockedPath?: boolean;
  cellSize: number;
}
```

### ExitZone
```typescript
interface ExitZoneProps {
  row: number;
  col: number;
  cellSize: number;
  isActive?: boolean;
}
```

### MovesCounter
```typescript
interface MovesCounterProps {
  moves: number;
  optimal: number;
  showComparison?: boolean;
}
```

---

## 💬 NOTES CLAUDE CODE

1. **Grid Coordinate System** : Row 0 is top, Col 0 is left. Exit is always at row 2, col 5 (right edge)
2. **Vehicle Axis Lock** : Horizontal vehicles can only move left/right, vertical only up/down
3. **Collision Detection** : Check all cells the vehicle would occupy during move
4. **Snap to Grid** : Use Math.round for final position, spring animation for natural feel
5. **Victory Detection** : Taxi reaches col where col + length - 1 >= 5 AND row === 2
6. **Blocked Path Indicator** : Show dashed red line from taxi to first blocking vehicle
7. **Undo Stack** : Store complete grid state for each move, allow unlimited undo
8. **Timer** : Start on first move, pause on hint/modal, stop on victory

---

## 🔧 HOOK: useEmbouteillageGame

```typescript
interface UseEmbouteillageGameReturn {
  // State
  puzzle: Puzzle;
  vehicles: Vehicle[];
  moves: number;
  timer: number;
  hintsUsed: number[];
  isVictory: boolean;
  stars: 0 | 1 | 2 | 3;
  
  // Actions
  moveVehicle: (id: string, row: number, col: number) => boolean;
  undo: () => void;
  reset: () => void;
  getHint: () => Hint | null;
  
  // Queries
  canUndo: boolean;
  getMaxDistance: (vehicleId: string, direction: Direction) => number;
  isValidMove: (vehicleId: string, row: number, col: number) => boolean;
  getBlockingVehicle: () => string | null;
}
```

---
