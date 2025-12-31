# SPECS TECHNIQUES : Embouteillage 🚗

> **Stack** : React Native + Expo SDK 52+  
> **Plateforme** : iPad (principal), iPhone (secondaire)

---

## 📦 Structures de données

### Types principaux

```typescript
// Types de véhicules
type VehicleType = 'car' | 'truck' | 'taxi';

// Orientation du véhicule
type Orientation = 'horizontal' | 'vertical';

// Direction de déplacement
type Direction = 'up' | 'down' | 'left' | 'right';

// Définition d'un véhicule
interface Vehicle {
  id: string;
  type: VehicleType;
  color: string;
  colorName: string;           // Nom pour enfant ("Pompier", "Police"...)
  orientation: Orientation;
  length: 2 | 3;               // Voiture=2, Camion=3
  row: number;                 // Position Y (0-5)
  col: number;                 // Position X (0-5)
  pattern?: string;            // Motif accessibilité daltonisme
  icon?: string;               // Icône camion (📦, 🧱...)
}

// État de la grille
interface GridState {
  cells: (string | null)[][];  // 6x6, contient vehicle.id ou null
  vehicles: Vehicle[];
}

// Configuration d'un puzzle
interface Puzzle {
  id: number;
  difficulty: 'beginner' | 'apprentice' | 'mechanic' | 'expert' | 'master';
  difficultyLevel: number;     // 1-80
  optimalMoves: number;
  vehicles: Vehicle[];
  exitRow: number;             // Toujours 2 (rangée du milieu, 0-indexed)
  exitCol: number;             // Toujours 5 (côté droit)
  hints: PuzzleHint[];
}

// Indice pour un puzzle
interface PuzzleHint {
  level: 1 | 2 | 3 | 4;
  type: 'text' | 'highlight' | 'moves' | 'solution';
  content: string | string[] | Move[];
}

// Un mouvement
interface Move {
  vehicleId: string;
  direction: Direction;
  distance: number;            // Nombre de cases
}

// Session de jeu
interface GameSession {
  puzzleId: number;
  startTime: number;
  moves: Move[];
  movesCount: number;
  undoCount: number;
  hintsUsed: number[];         // Niveaux d'indices utilisés
  isCompleted: boolean;
  stars: 0 | 1 | 2 | 3;
  completionTime?: number;
}

// Progression utilisateur
interface UserProgress {
  completedPuzzles: number[];
  puzzleStars: Record<number, number>;  // puzzleId -> stars
  totalStars: number;
  badges: Badge[];
  unlockedCategories: string[];
  currentPuzzle: number;
  collectedCards: string[];
}

// Badge
interface Badge {
  id: string;
  name: string;
  icon: string;
  unlockedAt: number;          // Timestamp
  condition: string;
}

// Carte à collectionner
interface CollectibleCard {
  id: string;
  name: string;
  emoji: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  description: string;
}
```

### Constantes de configuration

```typescript
// Dimensions de la grille
const GRID_SIZE = 6;
const EXIT_ROW = 2;  // 0-indexed, rangée du milieu
const EXIT_COL = 5;  // Côté droit

// Couleurs des véhicules
const VEHICLE_COLORS = {
  taxi: { hex: '#FFD700', name: 'Taxi' },
  cars: [
    { hex: '#E74C3C', name: 'Pompier' },
    { hex: '#3498DB', name: 'Police' },
    { hex: '#27AE60', name: 'Jardinier' },
    { hex: '#9B59B6', name: 'Magicien' },
    { hex: '#E67E22', name: 'Livreur' },
    { hex: '#FD79A8', name: 'Princesse' },
  ],
  trucks: [
    { hex: '#8B4513', name: 'Déménageur' },
    { hex: '#2C3E50', name: 'Transporteur' },
    { hex: '#1E8449', name: 'Recyclage' },
    { hex: '#7F8C8D', name: 'Ciment' },
  ],
};

// Seuils d'étoiles
const STAR_THRESHOLDS = {
  three: 2,   // optimal + 2
  two: 5,     // optimal + 5
  one: Infinity,
};

// Coûts des indices
const HINT_COSTS = {
  1: 0,   // Gratuit
  2: 1,   // -1 étoile
  3: 2,   // -2 étoiles
  4: 3,   // -3 étoiles (solution complète)
};

// Catégories de difficulté
const DIFFICULTY_RANGES = {
  beginner: { min: 1, max: 10, minMoves: 5, maxMoves: 8 },
  apprentice: { min: 11, max: 25, minMoves: 8, maxMoves: 12 },
  mechanic: { min: 26, max: 40, minMoves: 12, maxMoves: 18 },
  expert: { min: 41, max: 60, minMoves: 18, maxMoves: 25 },
  master: { min: 61, max: 80, minMoves: 25, maxMoves: 40 },
};
```

---

## 🎮 Logique de jeu

### Moteur de puzzle (puzzleEngine.ts)

```typescript
// Initialiser la grille à partir des véhicules
function initializeGrid(vehicles: Vehicle[]): GridState {
  const cells: (string | null)[][] = Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(null));
  
  vehicles.forEach(vehicle => {
    for (let i = 0; i < vehicle.length; i++) {
      const row = vehicle.orientation === 'horizontal' 
        ? vehicle.row 
        : vehicle.row + i;
      const col = vehicle.orientation === 'horizontal' 
        ? vehicle.col + i 
        : vehicle.col;
      cells[row][col] = vehicle.id;
    }
  });
  
  return { cells, vehicles };
}

// Vérifier si un mouvement est valide
function isValidMove(
  gridState: GridState,
  vehicleId: string,
  direction: Direction,
  distance: number = 1
): boolean {
  const vehicle = gridState.vehicles.find(v => v.id === vehicleId);
  if (!vehicle) return false;
  
  // Vérifier que la direction correspond à l'orientation
  if (vehicle.orientation === 'horizontal' && (direction === 'up' || direction === 'down')) {
    return false;
  }
  if (vehicle.orientation === 'vertical' && (direction === 'left' || direction === 'right')) {
    return false;
  }
  
  // Calculer les nouvelles positions
  const newPositions = getNewPositions(vehicle, direction, distance);
  
  // Vérifier les limites et collisions
  return newPositions.every(pos => {
    if (pos.row < 0 || pos.row >= GRID_SIZE || pos.col < 0 || pos.col >= GRID_SIZE) {
      // Exception : le taxi peut sortir par la sortie
      if (vehicle.type === 'taxi' && pos.row === EXIT_ROW && pos.col === GRID_SIZE) {
        return true;
      }
      return false;
    }
    const occupant = gridState.cells[pos.row][pos.col];
    return occupant === null || occupant === vehicleId;
  });
}

// Calculer les nouvelles positions après mouvement
function getNewPositions(
  vehicle: Vehicle,
  direction: Direction,
  distance: number
): { row: number; col: number }[] {
  const positions: { row: number; col: number }[] = [];
  const delta = getDelta(direction);
  
  for (let i = 0; i < vehicle.length; i++) {
    const baseRow = vehicle.orientation === 'horizontal' ? vehicle.row : vehicle.row + i;
    const baseCol = vehicle.orientation === 'horizontal' ? vehicle.col + i : vehicle.col;
    positions.push({
      row: baseRow + delta.row * distance,
      col: baseCol + delta.col * distance,
    });
  }
  
  return positions;
}

// Obtenir le delta de déplacement
function getDelta(direction: Direction): { row: number; col: number } {
  const deltas = {
    up: { row: -1, col: 0 },
    down: { row: 1, col: 0 },
    left: { row: 0, col: -1 },
    right: { row: 0, col: 1 },
  };
  return deltas[direction];
}

// Appliquer un mouvement
function applyMove(
  gridState: GridState,
  vehicleId: string,
  direction: Direction,
  distance: number = 1
): GridState {
  const vehicle = gridState.vehicles.find(v => v.id === vehicleId);
  if (!vehicle || !isValidMove(gridState, vehicleId, direction, distance)) {
    return gridState;
  }
  
  // Nouvelle grille
  const newCells = gridState.cells.map(row => [...row]);
  
  // Effacer anciennes positions
  for (let i = 0; i < vehicle.length; i++) {
    const row = vehicle.orientation === 'horizontal' ? vehicle.row : vehicle.row + i;
    const col = vehicle.orientation === 'horizontal' ? vehicle.col + i : vehicle.col;
    newCells[row][col] = null;
  }
  
  // Nouvelle position du véhicule
  const delta = getDelta(direction);
  const newVehicle = {
    ...vehicle,
    row: vehicle.row + delta.row * distance,
    col: vehicle.col + delta.col * distance,
  };
  
  // Marquer nouvelles positions
  for (let i = 0; i < newVehicle.length; i++) {
    const row = newVehicle.orientation === 'horizontal' ? newVehicle.row : newVehicle.row + i;
    const col = newVehicle.orientation === 'horizontal' ? newVehicle.col + i : newVehicle.col;
    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
      newCells[row][col] = vehicleId;
    }
  }
  
  return {
    cells: newCells,
    vehicles: gridState.vehicles.map(v => v.id === vehicleId ? newVehicle : v),
  };
}

// Vérifier si le puzzle est résolu
function isPuzzleSolved(gridState: GridState): boolean {
  const taxi = gridState.vehicles.find(v => v.type === 'taxi');
  if (!taxi) return false;
  
  // Le taxi est à la position de sortie (col + length - 1 === 5)
  // ou a dépassé (pour l'animation de sortie)
  return taxi.col + taxi.length - 1 >= EXIT_COL && taxi.row === EXIT_ROW;
}

// Calculer la distance maximum de déplacement dans une direction
function getMaxDistance(
  gridState: GridState,
  vehicleId: string,
  direction: Direction
): number {
  let distance = 0;
  while (isValidMove(gridState, vehicleId, direction, distance + 1)) {
    distance++;
    if (distance > GRID_SIZE) break; // Sécurité
  }
  return distance;
}
```

### Solveur BFS (solver.ts)

```typescript
// Trouver la solution optimale avec BFS
function findOptimalSolution(puzzle: Puzzle): Move[] | null {
  const initialState = initializeGrid(puzzle.vehicles);
  const initialStateKey = stateToString(initialState);
  
  const queue: { state: GridState; moves: Move[] }[] = [
    { state: initialState, moves: [] }
  ];
  const visited = new Set<string>([initialStateKey]);
  
  while (queue.length > 0) {
    const { state, moves } = queue.shift()!;
    
    // Vérifier si résolu
    if (isPuzzleSolved(state)) {
      return moves;
    }
    
    // Générer tous les mouvements possibles
    for (const vehicle of state.vehicles) {
      const directions: Direction[] = vehicle.orientation === 'horizontal'
        ? ['left', 'right']
        : ['up', 'down'];
      
      for (const direction of directions) {
        for (let distance = 1; distance <= GRID_SIZE; distance++) {
          if (!isValidMove(state, vehicle.id, direction, distance)) break;
          
          const newState = applyMove(state, vehicle.id, direction, distance);
          const stateKey = stateToString(newState);
          
          if (!visited.has(stateKey)) {
            visited.add(stateKey);
            queue.push({
              state: newState,
              moves: [...moves, { vehicleId: vehicle.id, direction, distance }],
            });
          }
        }
      }
    }
  }
  
  return null; // Pas de solution
}

// Convertir l'état en string pour comparaison
function stateToString(state: GridState): string {
  return state.vehicles
    .map(v => `${v.id}:${v.row},${v.col}`)
    .sort()
    .join('|');
}
```

---

## 🎨 Composants React Native

### Structure des fichiers

```
src/games/embouteillage/
├── index.ts
├── types.ts
├── components/
│   ├── index.ts
│   ├── ParkingGrid.tsx          # Grille 6x6
│   ├── Vehicle.tsx              # Véhicule individuel
│   ├── DraggableVehicle.tsx     # Véhicule avec gesture
│   ├── GridCell.tsx             # Cellule de la grille
│   ├── ExitZone.tsx             # Zone de sortie (droite)
│   ├── GarageMascot.tsx         # Gus le Garagiste
│   ├── HintButton.tsx           # Bouton indice
│   ├── MovesCounter.tsx         # Compteur de coups
│   ├── CategoryCard.tsx         # Carte de catégorie
│   ├── PuzzleSelector.tsx       # Sélecteur de niveau
│   └── feedback/
│       ├── VictoryOverlay.tsx
│       ├── TaxiExitAnimation.tsx
│       └── StarRating.tsx
├── data/
│   ├── puzzles.ts               # 80 puzzles prédéfinis
│   ├── assistantScripts.ts
│   └── collectibleCards.ts
├── hooks/
│   ├── useEmbouteillageGame.ts  # Hook principal
│   └── useDragVehicle.ts        # Hook pour drag & drop
├── logic/
│   ├── puzzleEngine.ts
│   ├── solver.ts
│   └── progressManager.ts
└── screens/
    ├── index.ts
    ├── EmbouteillageIntroScreen.tsx
    ├── EmbouteillageGameScreen.tsx
    └── EmbouteillageVictoryScreen.tsx
```

### Hook principal (useEmbouteillageGame.ts)

```typescript
interface UseEmbouteillageGameReturn {
  // État
  gridState: GridState;
  currentPuzzle: Puzzle;
  session: GameSession;
  selectedVehicle: string | null;
  
  // Actions
  selectVehicle: (vehicleId: string) => void;
  moveVehicle: (vehicleId: string, direction: Direction, distance: number) => void;
  undoMove: () => void;
  resetPuzzle: () => void;
  useHint: (level: 1 | 2 | 3 | 4) => void;
  
  // État dérivé
  isCompleted: boolean;
  canUndo: boolean;
  availableMoves: Map<string, { direction: Direction; maxDistance: number }[]>;
  pathToExit: { blocked: boolean; obstacles: string[] };
  
  // Progression
  earnedStars: 0 | 1 | 2 | 3;
  hintsAvailable: (1 | 2 | 3 | 4)[];
}

function useEmbouteillageGame(puzzleId: number): UseEmbouteillageGameReturn {
  // ... implémentation
}
```

---

## 🔧 Calcul des étoiles

```typescript
function calculateStars(
  movesCount: number,
  optimalMoves: number,
  hintsUsed: number[]
): 0 | 1 | 2 | 3 {
  // Pénalité pour indices
  const hintPenalty = hintsUsed.reduce((sum, level) => sum + HINT_COSTS[level], 0);
  const adjustedMoves = movesCount + hintPenalty * 3; // Chaque étoile perdue = +3 coups
  
  if (adjustedMoves <= optimalMoves + STAR_THRESHOLDS.three) {
    return 3;
  } else if (adjustedMoves <= optimalMoves + STAR_THRESHOLDS.two) {
    return 2;
  } else {
    return 1;
  }
}
```

---

## 🏆 Système de badges

```typescript
const BADGE_CONDITIONS = {
  'first-start': {
    check: (progress: UserProgress) => progress.completedPuzzles.length >= 1,
  },
  'planner': {
    check: (progress: UserProgress, sessions: GameSession[]) => 
      sessions.filter(s => s.movesCount <= puzzles[s.puzzleId].optimalMoves).length >= 5,
  },
  'patience': {
    check: (progress: UserProgress, sessions: GameSession[]) =>
      sessions.some(s => s.movesCount >= 50 && s.isCompleted),
  },
  'lightning': {
    check: (progress: UserProgress, sessions: GameSession[]) =>
      sessions.some(s => s.completionTime && s.completionTime < 30000),
  },
  'no-help': {
    check: (progress: UserProgress, sessions: GameSession[]) =>
      sessions.filter(s => s.hintsUsed.length === 0 && s.isCompleted).length >= 10,
  },
  'strategist': {
    check: (progress: UserProgress) =>
      DIFFICULTY_RANGES.apprentice.min <= Math.min(...progress.completedPuzzles) &&
      progress.completedPuzzles.filter(id => id <= DIFFICULTY_RANGES.apprentice.max).length >= 15,
  },
  'mechanic-pro': {
    check: (progress: UserProgress) =>
      progress.completedPuzzles.filter(
        id => id >= DIFFICULTY_RANGES.mechanic.min && id <= DIFFICULTY_RANGES.mechanic.max
      ).length >= 15,
  },
  'parking-master': {
    check: (progress: UserProgress) => progress.completedPuzzles.includes(80),
  },
};
```

---

## 📱 Responsive

### Dimensions iPad vs iPhone

```typescript
const LAYOUT = {
  iPad: {
    cellSize: 90,           // Taille d'une cellule
    gridPadding: 40,
    vehiclePadding: 4,
    mascotSize: 180,
  },
  iPhone: {
    cellSize: 55,
    gridPadding: 20,
    vehiclePadding: 2,
    mascotSize: 120,
  },
};

// Calcul dynamique
const getCellSize = (screenWidth: number) => {
  const isTablet = screenWidth >= 768;
  const gridWidth = isTablet 
    ? Math.min(screenWidth * 0.6, 600)
    : screenWidth - 40;
  return Math.floor(gridWidth / GRID_SIZE);
};
```

---

## 🎬 Animations

### Mouvement de véhicule

```typescript
const MOVE_ANIMATION = {
  duration: 200,
  easing: Easing.out(Easing.cubic),
};
```

### Victoire - Taxi sort

```typescript
const EXIT_ANIMATION = {
  duration: 800,
  stages: [
    { translateX: cellSize, duration: 300 },      // Sort de la grille
    { translateX: cellSize * 2, duration: 500 },  // Continue hors écran
  ],
};
```

### Shake sur mouvement impossible

```typescript
const SHAKE_ANIMATION = {
  duration: 300,
  sequence: [
    { translateX: -8 },
    { translateX: 8 },
    { translateX: -6 },
    { translateX: 6 },
    { translateX: -3 },
    { translateX: 0 },
  ],
};
```

---

## 📊 Base de puzzles

### Format de stockage

```typescript
// Exemple de puzzle (niveau 1)
const PUZZLE_1: Puzzle = {
  id: 1,
  difficulty: 'beginner',
  difficultyLevel: 1,
  optimalMoves: 5,
  exitRow: 2,
  exitCol: 5,
  vehicles: [
    { id: 'taxi', type: 'taxi', color: '#FFD700', colorName: 'Taxi', 
      orientation: 'horizontal', length: 2, row: 2, col: 0 },
    { id: 'car1', type: 'car', color: '#E74C3C', colorName: 'Pompier',
      orientation: 'vertical', length: 2, row: 0, col: 2 },
    { id: 'car2', type: 'car', color: '#3498DB', colorName: 'Police',
      orientation: 'horizontal', length: 2, row: 2, col: 3 },
    { id: 'truck1', type: 'truck', color: '#8B4513', colorName: 'Déménageur',
      orientation: 'vertical', length: 3, row: 3, col: 4 },
  ],
  hints: [
    { level: 1, type: 'text', content: "Regarde ce qui bloque le taxi directement." },
    { level: 2, type: 'highlight', content: 'car2' },
    { level: 3, type: 'moves', content: [
      { vehicleId: 'car2', direction: 'right', distance: 1 },
      { vehicleId: 'truck1', direction: 'down', distance: 2 },
    ]},
    { level: 4, type: 'solution', content: [] }, // Solution complète générée
  ],
};
```

---

## ✅ Checklist d'implémentation

### Phase 1 - Core
- [ ] Types et interfaces
- [ ] PuzzleEngine (mouvement, validation, victoire)
- [ ] Composant ParkingGrid
- [ ] Composant Vehicle avec drag
- [ ] Hook useEmbouteillageGame

### Phase 2 - Puzzles
- [ ] Base de 80 puzzles
- [ ] Solveur BFS pour validation
- [ ] Système d'indices

### Phase 3 - UI/UX
- [ ] Écran intro avec catégories
- [ ] Écran de jeu
- [ ] Écran victoire
- [ ] Mascotte Gus

### Phase 4 - Progression
- [ ] Sauvegarde progression
- [ ] Système d'étoiles
- [ ] Badges
- [ ] Cartes à collectionner

### Phase 5 - Polish
- [ ] Animations fluides
- [ ] Sons et feedback haptique
- [ ] Adaptation par âge
- [ ] Accessibilité

---

*Specs Techniques v1.0 — Embouteillage 🚗*
*App Éducative iPad — Décembre 2024*
