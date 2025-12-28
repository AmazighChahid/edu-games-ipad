# BRIEF REACT NATIVE : Écran de Jeu
## La Fabrique de Réactions - FabriqueGameScreen

---

## 📋 Informations Générales

| Propriété | Valeur |
|-----------|--------|
| **Fichier** | `src/games/fabrique-reactions/screens/FabriqueGameScreen.tsx` |
| **Type** | Screen Component (Complexe) |
| **Prototype HTML** | `fabrique-puzzle.html` |
| **Priorité** | Critique |

---

## 🏗️ Hiérarchie des Composants

```
FabriqueGameScreen
├── WorkshopBackground                # Fond atelier simplifié
│
├── Header
│   ├── BackButton                    # Retour sélection
│   ├── LevelInfo                     # Monde + Niveau
│   ├── StarsDisplay                  # 3 étoiles potentielles
│   ├── AttemptsCounter               # Compteur essais
│   └── ActionButtons                 # Indice, Reset, Settings
│
├── MainArea
│   ├── BuildZone                     # Zone construction principale
│   │   ├── MachineCanvas             # Canvas de la machine
│   │   │   ├── GridOverlay           # Grille de placement
│   │   │   ├── PlacedElements        # Éléments placés
│   │   │   │   └── MachineElement    # Élément individuel
│   │   │   ├── EmptySlots            # Emplacements vides (?)
│   │   │   ├── ConnectionLines       # Lignes de connexion
│   │   │   └── EnergyFlow            # Animation énergie
│   │   │
│   │   └── ElementPalette            # Palette d'éléments
│   │       ├── PaletteHeader
│   │       └── PaletteScroll
│   │           └── PaletteItem (×n)  # Élément draggable
│   │
│   └── MascotZone                    # Zone latérale Gédéon
│       ├── MascotContainer
│       │   ├── GedeonMini            # Gédéon compact
│       │   └── SpeechBubble          # Dialogue contextuel
│       ├── ObjectiveBox              # Objectif du niveau
│       └── TipBox                    # Conseil
│
└── Footer
    ├── UndoButton                    # Annuler
    ├── ResetButton                   # Tout effacer
    └── TestButton                    # TESTER !
```

---

## 🎨 Design Tokens

### Couleurs Spécifiques au Jeu

```typescript
const GAME_COLORS = {
  // Canvas
  canvasBg: 'rgba(255,255,255,0.85)',
  
  // Grille
  gridCell: 'rgba(241,196,15,0.1)',
  gridCellBorder: 'rgba(241,196,15,0.3)',
  gridCellDropTarget: 'rgba(241,196,15,0.3)',
  emptySlot: 'rgba(241,196,15,0.15)',
  emptySlotBorder: '#F1C40F',
  
  // Éléments par catégorie
  elementSource: {
    bg: 'rgba(46,204,113,0.2)',
    border: '#27AE60',
  },
  elementTransmission: {
    bg: 'rgba(230,126,34,0.2)',
    border: '#E67E22',
  },
  elementMobile: {
    bg: 'rgba(52,152,219,0.2)',
    border: '#3498DB',
  },
  elementTrigger: {
    bg: 'rgba(155,89,182,0.2)',
    border: '#9B59B6',
  },
  elementEffect: {
    bg: 'rgba(241,196,15,0.2)',
    border: '#F1C40F',
  },
  
  // Énergie
  energyStart: '#E67E22',
  energyEnd: '#F1C40F',
  energyGlow: 'rgba(241,196,15,0.5)',
  
  // Boutons
  testButton: '#27AE60',
  testButtonTesting: '#E67E22',
  resetButton: '#E74C3C',
  hintButton: '#F39C12',
};
```

### Dimensions de Jeu

```typescript
const GAME_SIZES = {
  // Grille
  cellSize: 90,              // iPad
  cellSizePhone: 60,
  cellGap: 10,
  gridPadding: 20,
  
  // Éléments
  elementSize: 80,
  elementRadius: 16,
  paletteItemSize: 80,
  paletteItemHeight: 90,
  
  // Canvas
  canvasRadius: 24,
  
  // Palette
  paletteHeight: 130,
  paletteItemGap: 12,
  
  // Mascotte zone
  mascotZoneWidth: 280,
  gedeonMiniSize: 120,
  
  // Boutons
  actionButtonSize: 52,
  testButtonHeight: 64,
  testButtonPaddingH: 50,
};
```

---

## 📱 Props & Types

```typescript
interface FabriqueGameScreenProps {
  level: LevelConfig;
  mode: GameMode;
  childName: string;
  onComplete: (result: LevelResult) => void;
  onBack: () => void;
}

interface LevelConfig {
  id: string;
  worldId: number;
  levelNumber: number;
  mode: GameMode;
  difficulty: 1 | 2 | 3 | 4 | 5;
  
  gridSize: { rows: number; cols: number };
  fixedElements: PlacedElement[];
  emptySlots: GridPosition[];
  availableElements: string[];
  
  optimalMoves: number;
  stars3Threshold: number;
  stars2Threshold: number;
  
  introDialogue: string;
  hintDialogues: string[];
  victoryDialogue: string;
}

interface PlacedElement {
  id: string;
  elementId: string;
  position: GridPosition;
  rotation: 0 | 90 | 180 | 270;
  isFixed: boolean;
  state: ElementState;
}

interface GridPosition {
  row: number;
  col: number;
}

type ElementState = 
  | 'idle' 
  | 'ready' 
  | 'activating' 
  | 'active' 
  | 'completed' 
  | 'error';

interface LevelResult {
  success: boolean;
  stars: 0 | 1 | 2 | 3;
  moves: number;
  hintsUsed: number;
  time: number;
  unlockedElement?: string;
  unlockedBadge?: string;
}
```

---

## 🎣 Hook Principal : useFabriqueGame

```typescript
interface UseFabriqueGameReturn {
  // État machine
  placedElements: PlacedElement[];
  connections: Connection[];
  selectedElement: string | null;
  isDragging: boolean;
  
  // État simulation
  isSimulating: boolean;
  energyPath: EnergyPathStep[];
  simulationResult: SimulationResult | null;
  
  // État UI
  attemptsCount: number;
  hintsUsed: number;
  potentialStars: number;
  gedeonMessage: string;
  gedeonExpression: GedeonExpression;
  
  // Actions
  placeElement: (elementId: string, position: GridPosition) => boolean;
  removeElement: (placedId: string) => void;
  moveElement: (placedId: string, newPosition: GridPosition) => boolean;
  selectElement: (placedId: string | null) => void;
  
  // Contrôles
  runSimulation: () => Promise<SimulationResult>;
  resetMachine: () => void;
  undoLastAction: () => void;
  requestHint: () => void;
  
  // Queries
  canPlaceAt: (elementId: string, position: GridPosition) => boolean;
  getAvailableElements: () => ElementDefinition[];
  isLevelComplete: boolean;
}
```

---

## 🎬 Animations Reanimated 3

### 1. Drag & Drop Element

```typescript
// Gesture Handler + Reanimated pour drag
const elementX = useSharedValue(0);
const elementY = useSharedValue(0);
const elementScale = useSharedValue(1);
const elementOpacity = useSharedValue(1);

const dragGesture = Gesture.Pan()
  .onStart(() => {
    elementScale.value = withSpring(1.1, { damping: 15 });
    runOnJS(onDragStart)(elementId);
  })
  .onUpdate((event) => {
    elementX.value = event.translationX;
    elementY.value = event.translationY;
  })
  .onEnd((event) => {
    const dropPosition = calculateDropPosition(event);
    
    if (isValidDrop(dropPosition)) {
      // Snap vers la cellule
      const cellCoords = getCellCoordinates(dropPosition);
      elementX.value = withSpring(cellCoords.x, { damping: 20, stiffness: 300 });
      elementY.value = withSpring(cellCoords.y, { damping: 20, stiffness: 300 });
      elementScale.value = withSpring(1, { damping: 15 });
      runOnJS(onDropSuccess)(elementId, dropPosition);
    } else {
      // Retour position originale
      elementX.value = withSpring(0, { damping: 15, stiffness: 200 });
      elementY.value = withSpring(0, { damping: 15, stiffness: 200 });
      elementScale.value = withSpring(1, { damping: 15 });
      runOnJS(onDropCancel)(elementId);
    }
  });

const dragStyle = useAnimatedStyle(() => ({
  transform: [
    { translateX: elementX.value },
    { translateY: elementY.value },
    { scale: elementScale.value },
  ],
  zIndex: elementScale.value > 1 ? 100 : 1,
}));
```

### 2. Drop Target Highlight

```typescript
// Animation quand un élément est au-dessus d'une cellule valide
const cellScale = useSharedValue(1);
const cellBgOpacity = useSharedValue(0.1);

const highlightCell = (isTarget: boolean) => {
  cellScale.value = withSpring(isTarget ? 1.05 : 1, { damping: 15, stiffness: 300 });
  cellBgOpacity.value = withTiming(isTarget ? 0.3 : 0.1, { duration: 150 });
};

const cellStyle = useAnimatedStyle(() => ({
  transform: [{ scale: cellScale.value }],
  backgroundColor: `rgba(241, 196, 15, ${cellBgOpacity.value})`,
}));
```

### 3. Energy Flow Animation

```typescript
// Animation du flux d'énergie le long des connexions
const energyProgress = useSharedValue(0);
const particleOpacity = useSharedValue(1);

const animateEnergyFlow = async (path: EnergyPathStep[]) => {
  for (let i = 0; i < path.length; i++) {
    // Reset pour chaque segment
    energyProgress.value = 0;
    particleOpacity.value = 1;
    
    // Animation le long du segment
    energyProgress.value = withTiming(1, { 
      duration: 500, 
      easing: Easing.inOut(Easing.ease) 
    });
    
    // Attendre la fin
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Activer l'élément suivant
    runOnJS(activateElement)(path[i].elementId);
  }
};

const energyParticleStyle = useAnimatedStyle(() => ({
  left: `${energyProgress.value * 100}%`,
  opacity: particleOpacity.value,
}));
```

### 4. Element Activation

```typescript
// Animation quand un élément est activé par l'énergie
const elementGlow = useSharedValue(0);
const elementPulse = useSharedValue(1);

const activateElement = (elementId: string) => {
  elementGlow.value = withSequence(
    withTiming(1, { duration: 200 }),
    withTiming(0.5, { duration: 300 }),
    withRepeat(
      withSequence(
        withTiming(0.8, { duration: 500 }),
        withTiming(0.5, { duration: 500 })
      ),
      -1,
      true
    )
  );
  
  elementPulse.value = withSequence(
    withSpring(1.15, { damping: 10, stiffness: 200 }),
    withSpring(1, { damping: 15 })
  );
};

const activatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: elementPulse.value }],
  shadowOpacity: elementGlow.value,
  shadowRadius: interpolate(elementGlow.value, [0, 1], [0, 20]),
  shadowColor: '#F1C40F',
}));
```

### 5. Empty Slot Question Mark

```typescript
// Animation subtile du "?" dans les slots vides
const questionOpacity = useSharedValue(0.5);

useEffect(() => {
  questionOpacity.value = withRepeat(
    withSequence(
      withTiming(0.8, { duration: 1000 }),
      withTiming(0.5, { duration: 1000 })
    ),
    -1,
    true
  );
}, []);

const questionStyle = useAnimatedStyle(() => ({
  opacity: questionOpacity.value,
}));
```

### 6. Test Button States

```typescript
// États du bouton tester
const testBtnScale = useSharedValue(1);
const testBtnBg = useSharedValue(0); // 0 = vert, 1 = orange

const onTestPress = async () => {
  // Animation de presse
  testBtnScale.value = withSequence(
    withSpring(0.95, { damping: 15 }),
    withSpring(1.02, { damping: 10 }),
    withSpring(1, { damping: 15 })
  );
  
  // Changer couleur pendant simulation
  testBtnBg.value = withTiming(1, { duration: 200 });
  
  await runSimulation();
  
  // Retour couleur normale
  testBtnBg.value = withTiming(0, { duration: 200 });
};

const testBtnStyle = useAnimatedStyle(() => {
  const backgroundColor = interpolateColor(
    testBtnBg.value,
    [0, 1],
    ['#27AE60', '#E67E22']
  );
  
  return {
    transform: [{ scale: testBtnScale.value }],
    backgroundColor,
  };
});
```

### 7. Hint Button Glow

```typescript
// Pulsation lumineuse du bouton indice
const hintGlow = useSharedValue(0.4);

useEffect(() => {
  hintGlow.value = withRepeat(
    withSequence(
      withTiming(0.6, { duration: 1000 }),
      withTiming(0.4, { duration: 1000 })
    ),
    -1,
    true
  );
}, []);

const hintBtnStyle = useAnimatedStyle(() => ({
  shadowOpacity: hintGlow.value,
  shadowRadius: interpolate(hintGlow.value, [0.4, 0.6], [12, 20]),
  shadowColor: '#F39C12',
}));
```

### 8. Gédéon Reactions

```typescript
// Expressions contextuelles de Gédéon
const gedeonScale = useSharedValue(1);

const triggerGedeonReaction = (expression: GedeonExpression) => {
  switch (expression) {
    case 'happy':
      gedeonScale.value = withSequence(
        withSpring(1.1, { damping: 10 }),
        withSpring(1, { damping: 15 })
      );
      break;
    case 'thinking':
      gedeonScale.value = withSequence(
        withTiming(0.95, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );
      break;
    case 'excited':
      gedeonScale.value = withRepeat(
        withSequence(
          withSpring(1.1, { damping: 8 }),
          withSpring(0.95, { damping: 8 })
        ),
        3,
        true
      );
      break;
  }
};
```

### 9. Connection Line Drawing

```typescript
// Dessin animé des lignes de connexion
const lineProgress = useSharedValue(0);

const drawConnection = () => {
  lineProgress.value = 0;
  lineProgress.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
};

// Utiliser avec SVG ou Canvas
const getPathData = (from: Point, to: Point, progress: number) => {
  const length = Math.sqrt(
    Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2)
  );
  const dashOffset = length * (1 - progress);
  return {
    path: `M ${from.x} ${from.y} L ${to.x} ${to.y}`,
    strokeDasharray: length,
    strokeDashoffset: dashOffset,
  };
};
```

---

## 📦 Composants Clés

### MachineElement

```typescript
interface MachineElementProps {
  element: PlacedElement;
  definition: ElementDefinition;
  isSelected: boolean;
  isDraggable: boolean;
  onPress: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragEnd: (id: string, position: GridPosition | null) => void;
}

const MachineElement: React.FC<MachineElementProps> = ({
  element,
  definition,
  isSelected,
  isDraggable,
  onPress,
  onDragStart,
  onDragEnd,
}) => {
  const categoryColors = GAME_COLORS[`element${capitalize(definition.category)}`];
  
  return (
    <GestureDetector gesture={isDraggable ? dragGesture : undefined}>
      <Animated.View
        style={[
          styles.machineElement,
          {
            backgroundColor: categoryColors.bg,
            borderColor: categoryColors.border,
          },
          isSelected && styles.machineElementSelected,
          dragStyle,
          activatedStyle,
        ]}
      >
        <Animated.View style={[styles.elementGlow, glowStyle]} />
        <Text style={styles.elementIcon}>{definition.emoji}</Text>
      </Animated.View>
    </GestureDetector>
  );
};
```

### ElementPalette

```typescript
interface ElementPaletteProps {
  availableElements: ElementDefinition[];
  usedElements: string[];
  onDragElement: (elementId: string) => void;
}

const ElementPalette: React.FC<ElementPaletteProps> = ({
  availableElements,
  usedElements,
  onDragElement,
}) => {
  return (
    <View style={styles.paletteContainer}>
      <View style={styles.paletteHeader}>
        <Text style={styles.paletteTitle}>
          <Text style={styles.paletteIcon}>🧰</Text> Boîte à Outils
        </Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.paletteScroll}
      >
        {availableElements.map((element) => {
          const isUsed = usedElements.includes(element.id);
          
          return (
            <PaletteItem
              key={element.id}
              element={element}
              isUsed={isUsed}
              onDrag={() => !isUsed && onDragElement(element.id)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};
```

### EnergyFlowVisualizer

```typescript
interface EnergyFlowVisualizerProps {
  path: EnergyPathStep[];
  isAnimating: boolean;
  onPathComplete: () => void;
}

const EnergyFlowVisualizer: React.FC<EnergyFlowVisualizerProps> = ({
  path,
  isAnimating,
  onPathComplete,
}) => {
  // SVG ou Canvas pour dessiner les particules d'énergie
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      {path.map((step, index) => (
        <EnergySegment
          key={`${step.elementId}-${index}`}
          from={getElementCenter(step.fromElement)}
          to={getElementCenter(step.toElement)}
          delay={index * 400}
          energyType={step.energyType}
        />
      ))}
      
      {isAnimating && (
        <EnergyParticle
          path={path}
          onComplete={onPathComplete}
        />
      )}
    </Svg>
  );
};
```

---

## 📐 StyleSheet Principal

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  worldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1C40F',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  starsDisplay: {
    flexDirection: 'row',
    gap: 8,
  },
  starSlot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starSlotPotential: {
    backgroundColor: 'rgba(241, 196, 15, 0.3)',
  },
  
  // Main area
  mainArea: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 20,
  },
  
  // Build zone
  buildZone: {
    flex: 1,
  },
  machineCanvas: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 24,
    overflow: 'hidden',
    padding: 20,
  },
  
  // Grid
  placementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    alignContent: 'center',
  },
  gridCell: {
    width: 90,
    height: 90,
    backgroundColor: 'rgba(241, 196, 15, 0.1)',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(241, 196, 15, 0.3)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridCellEmpty: {
    backgroundColor: 'rgba(241, 196, 15, 0.15)',
    borderWidth: 3,
    borderColor: '#F1C40F',
  },
  emptySlotQuestion: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 36,
    color: 'rgba(241, 196, 15, 0.5)',
  },
  
  // Elements
  machineElement: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  elementIcon: {
    fontSize: 42,
  },
  elementGlow: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 20,
  },
  
  // Palette
  paletteContainer: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 14,
  },
  paletteHeader: {
    marginBottom: 12,
  },
  paletteTitle: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 16,
    color: '#4A3728',
  },
  paletteScroll: {
    gap: 12,
  },
  paletteItem: {
    width: 80,
    height: 90,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paletteItemUsed: {
    opacity: 0.4,
  },
  
  // Mascot zone
  mascotZone: {
    width: 280,
    gap: 16,
  },
  mascotContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 16,
  },
  mascotSpeech: {
    backgroundColor: '#FFF9F0',
    borderRadius: 16,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#F1C40F',
  },
  objectiveBox: {
    backgroundColor: 'rgba(241,196,15,0.1)',
    borderWidth: 2,
    borderColor: '#F1C40F',
    borderRadius: 16,
    padding: 14,
  },
  tipBox: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 14,
  },
  
  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  footerLeft: {
    flexDirection: 'row',
    gap: 12,
  },
  undoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderWidth: 2,
    borderColor: '#E74C3C',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  testBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#27AE60',
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 18,
    shadowColor: '#27AE60',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 6,
  },
  testBtnText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 22,
    color: '#fff',
  },
});
```

---

## 🔊 Sons de Jeu

| Action | Fichier | Volume |
|--------|---------|--------|
| Place élément | `element_place.mp3` | 0.7 |
| Retire élément | `element_remove.mp3` | 0.5 |
| Drop invalide | `invalid_drop.mp3` | 0.6 |
| Lance test | `test_start.mp3` | 0.8 |
| Énergie flow | `energy_flow.mp3` | 0.6 |
| Élément activé | `element_activate.mp3` | 0.7 |
| Machine réussie | `machine_success.mp3` | 1.0 |
| Machine échouée | `machine_fail.mp3` | 0.7 |
| Demande indice | `hint_request.mp3` | 0.6 |
| Reset machine | `reset.mp3` | 0.5 |

---

## ✅ Checklist Implémentation

### Core
- [ ] Structure écran et layout
- [ ] Hook useFabriqueGame
- [ ] Système de grille
- [ ] Placement éléments

### Drag & Drop
- [ ] Gesture Handler setup
- [ ] Drag depuis palette
- [ ] Drop sur grille
- [ ] Validation positions
- [ ] Annuler/Reset

### Simulation
- [ ] Moteur de simulation
- [ ] Validation connexions
- [ ] Animation flux énergie
- [ ] Activation éléments
- [ ] Résultat succès/échec

### UI/UX
- [ ] Composant Gédéon + dialogues
- [ ] Palette scrollable
- [ ] États boutons
- [ ] Étoiles potentielles
- [ ] Compteur essais

### Polish
- [ ] Toutes animations
- [ ] Sons intégrés
- [ ] Haptic feedback
- [ ] Performance optimisée

---

*Brief React Native v1.0 — FabriqueGameScreen*
