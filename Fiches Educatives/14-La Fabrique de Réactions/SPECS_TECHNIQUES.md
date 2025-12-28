# SPÉCIFICATIONS TECHNIQUES : La Fabrique de Réactions ⚙️

> **Stack** : React Native + Expo SDK 52+ • TypeScript • Reanimated 3
> **Plateforme** : iPad (principal) • iPhone (secondaire)

---

## 📁 Architecture des Fichiers

```
src/games/fabrique-reactions/
├── index.ts                      # Exports publics
├── types.ts                      # Types TypeScript (30+ types)
│
├── components/
│   ├── index.ts
│   │
│   ├── core/                     # Composants de base
│   │   ├── MachineCanvas.tsx     # Canvas principal de construction
│   │   ├── ElementSlot.tsx       # Emplacement pour élément
│   │   ├── ConnectionLine.tsx    # Ligne de connexion énergie
│   │   └── EnergyParticle.tsx    # Particule d'énergie animée
│   │
│   ├── elements/                 # Éléments de machine
│   │   ├── BaseElement.tsx       # Composant de base
│   │   ├── sources/
│   │   │   ├── HamsterWheel.tsx  # Roue de hamster (Gédéon)
│   │   │   ├── WaterDrop.tsx     # Goutte d'eau
│   │   │   ├── Battery.tsx       # Pile électrique
│   │   │   ├── Spring.tsx        # Ressort
│   │   │   └── WindSource.tsx    # Source de vent
│   │   │
│   │   ├── transmissions/
│   │   │   ├── Gear.tsx          # Engrenage
│   │   │   ├── Belt.tsx          # Courroie
│   │   │   ├── Lever.tsx         # Levier
│   │   │   ├── Pulley.tsx        # Poulie
│   │   │   ├── Ramp.tsx          # Rampe
│   │   │   ├── Tube.tsx          # Tube
│   │   │   ├── Dominos.tsx       # Dominos
│   │   │   ├── Trampoline.tsx    # Trampoline
│   │   │   └── Magnet.tsx        # Aimant
│   │   │
│   │   ├── mobiles/
│   │   │   ├── Ball.tsx          # Balle
│   │   │   ├── Marble.tsx        # Bille
│   │   │   ├── Stone.tsx         # Pierre
│   │   │   ├── Balloon.tsx       # Ballon
│   │   │   └── ToyCar.tsx        # Petite voiture
│   │   │
│   │   ├── triggers/
│   │   │   ├── Button.tsx        # Bouton poussoir
│   │   │   ├── Scale.tsx         # Balance
│   │   │   ├── Target.tsx        # Cible
│   │   │   └── Switch.tsx        # Interrupteur
│   │   │
│   │   └── effects/
│   │       ├── Light.tsx         # Lumière
│   │       ├── Bell.tsx          # Cloche
│   │       ├── Rocket.tsx        # Fusée
│   │       ├── MusicBox.tsx      # Boîte à musique
│   │       ├── Confetti.tsx      # Canon à confettis
│   │       ├── Fan.tsx           # Ventilateur
│   │       └── Flag.tsx          # Drapeau
│   │
│   ├── ui/
│   │   ├── ElementPalette.tsx    # Palette d'éléments
│   │   ├── ElementCard.tsx       # Carte d'élément dans palette
│   │   ├── TestButton.tsx        # Bouton de test
│   │   ├── ResetButton.tsx       # Bouton reset
│   │   ├── StarDisplay.tsx       # Affichage étoiles
│   │   ├── WorldSelector.tsx     # Sélecteur de monde
│   │   ├── LevelGrid.tsx         # Grille des niveaux
│   │   └── ModeSelector.tsx      # Sélecteur de mode
│   │
│   ├── mascot/
│   │   ├── GedeonMascot.tsx      # Mascotte principale
│   │   ├── GedeonExpressions.tsx # États/expressions
│   │   └── SpeechBubble.tsx      # Bulle de dialogue
│   │
│   ├── backgrounds/
│   │   ├── WorkshopBg.tsx        # Fond Atelier (Monde 1)
│   │   ├── LaboratoryBg.tsx      # Fond Laboratoire (Monde 2)
│   │   ├── FactoryBg.tsx         # Fond Usine (Monde 3)
│   │   ├── SpaceStationBg.tsx    # Fond Station (Monde 4)
│   │   └── DreamWorldBg.tsx      # Fond Rêves (Monde 5)
│   │
│   └── feedback/
│       ├── VictoryOverlay.tsx    # Overlay de victoire
│       ├── FailureOverlay.tsx    # Overlay d'échec
│       ├── NewElementUnlock.tsx  # Déblocage nouvel élément
│       ├── BadgeUnlock.tsx       # Déblocage badge
│       └── CardReveal.tsx        # Révélation carte
│
├── hooks/
│   ├── useFabriqueGame.ts        # Hook principal (~500 lignes)
│   ├── useMachineSimulation.ts   # Simulation de la machine
│   ├── useElementDrag.ts         # Drag & drop des éléments
│   ├── useEnergyFlow.ts          # Animation du flux d'énergie
│   └── useLevelProgress.ts       # Progression dans les niveaux
│
├── logic/
│   ├── machineEngine.ts          # Moteur de simulation
│   ├── connectionValidator.ts    # Validation des connexions
│   ├── energyPropagation.ts      # Propagation de l'énergie
│   ├── solutionChecker.ts        # Vérification solution
│   ├── optimalSolver.ts          # Calcul solution optimale
│   └── levelGenerator.ts         # Génération de niveaux
│
├── data/
│   ├── elements.ts               # Définition des éléments
│   ├── levels/
│   │   ├── world1.ts             # Niveaux Monde 1
│   │   ├── world2.ts             # Niveaux Monde 2
│   │   ├── world3.ts             # Niveaux Monde 3
│   │   ├── world4.ts             # Niveaux Monde 4
│   │   └── world5.ts             # Niveaux Monde 5
│   ├── assistantScripts.ts       # Dialogues Gédéon
│   ├── collectibleCards.ts       # Cartes inventeurs
│   └── badges.ts                 # Définition badges
│
├── screens/
│   ├── index.ts
│   ├── FabriqueIntroScreen.tsx   # Écran d'accueil/sélection
│   ├── FabriqueGameScreen.tsx    # Écran de jeu principal
│   ├── FabriqueVictoryScreen.tsx # Écran de victoire
│   └── FabriqueCreativeScreen.tsx # Mode créatif
│
└── utils/
    ├── coordinates.ts            # Utilitaires coordonnées
    ├── animations.ts             # Configurations animations
    └── sounds.ts                 # Gestion sons
```

---

## 🔷 Types TypeScript

```typescript
// types.ts

// ============ ÉLÉMENTS ============

export type ElementCategory = 
  | 'source'       // Démarreurs
  | 'transmission' // Transmetteurs
  | 'mobile'       // Objets mobiles
  | 'trigger'      // Déclencheurs
  | 'effect';      // Effets finaux

export type EnergyType =
  | 'rotation'     // Mouvement rotatif
  | 'linear'       // Mouvement linéaire
  | 'impact'       // Impact/collision
  | 'electric'     // Électricité
  | 'air'          // Flux d'air
  | 'water';       // Flux d'eau

export interface ElementDefinition {
  id: string;
  name: string;
  emoji: string;
  category: ElementCategory;
  description: string;
  
  // Entrées/sorties
  acceptsEnergy: EnergyType[];
  producesEnergy: EnergyType[];
  
  // Connexions possibles
  connectionPoints: ConnectionPoint[];
  
  // Comportement
  activationDelay: number;    // ms avant activation
  animationDuration: number;  // ms d'animation
  
  // Restrictions
  unlockedAtWorld: number;
  unlockedAtLevel: number;
  
  // Visuel
  size: { width: number; height: number };
  zIndex: number;
}

export interface ConnectionPoint {
  id: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  type: 'input' | 'output' | 'both';
  acceptedEnergy: EnergyType[];
}

// ============ MACHINE ============

export interface PlacedElement {
  id: string;
  elementId: string;           // Référence à ElementDefinition
  position: GridPosition;
  rotation: 0 | 90 | 180 | 270;
  state: ElementState;
  connections: Connection[];
}

export interface GridPosition {
  row: number;
  col: number;
}

export interface Connection {
  fromElementId: string;
  fromPointId: string;
  toElementId: string;
  toPointId: string;
  energyType: EnergyType;
}

export type ElementState =
  | 'idle'           // Au repos
  | 'ready'          // Prêt à recevoir énergie
  | 'activating'     // En cours d'activation
  | 'active'         // Activé, transmet énergie
  | 'completed'      // A fini son cycle
  | 'error';         // Erreur de connexion

// ============ NIVEAUX ============

export type GameMode =
  | 'complete'    // Compléter la machine
  | 'reorder'     // Remettre dans l'ordre
  | 'build'       // Construire librement
  | 'findError';  // Trouver l'erreur

export interface LevelConfig {
  id: string;
  worldId: number;
  levelNumber: number;
  
  mode: GameMode;
  difficulty: 1 | 2 | 3 | 4 | 5;
  
  // Configuration de la machine
  gridSize: { rows: number; cols: number };
  fixedElements: PlacedElement[];      // Éléments fixes (non déplaçables)
  emptySlots: GridPosition[];          // Emplacements à remplir
  availableElements: string[];         // IDs des éléments disponibles
  
  // Pour mode 'reorder'
  scrambledElements?: PlacedElement[];
  
  // Pour mode 'findError'
  errorElementId?: string;
  
  // Pour mode 'build'
  objective?: string;                  // "Allume la lumière"
  budget?: number;                     // Nombre max d'éléments
  requiredElements?: string[];         // Éléments obligatoires
  forbiddenElements?: string[];        // Éléments interdits
  
  // Solution
  optimalSolution: PlacedElement[];
  optimalMoves: number;
  
  // Récompenses
  stars3Threshold: number;             // Moves pour 3 étoiles
  stars2Threshold: number;             // Moves pour 2 étoiles
  
  // Dialogue
  introDialogue: string;
  hintDialogues: string[];
  victoryDialogue: string;
  
  // Déblocages
  unlocksElement?: string;
  unlocksBadge?: string;
  unlocksCard?: string;
}

export interface WorldConfig {
  id: number;
  name: string;
  theme: string;
  description: string;
  backgroundColor: string;
  accentColor: string;
  levels: LevelConfig[];
  unlockedByDefault: boolean;
  requiredStarsToUnlock: number;
}

// ============ ÉTAT DU JEU ============

export interface MachineState {
  placedElements: PlacedElement[];
  connections: Connection[];
  selectedElementId: string | null;
  draggedElement: DragState | null;
  simulationState: SimulationState;
}

export interface DragState {
  elementId: string;
  originalPosition: GridPosition | 'palette';
  currentPosition: { x: number; y: number };
}

export interface SimulationState {
  isRunning: boolean;
  currentStep: number;
  energyPath: EnergyPathStep[];
  result: SimulationResult | null;
}

export interface EnergyPathStep {
  elementId: string;
  energyType: EnergyType;
  timestamp: number;
  success: boolean;
}

export type SimulationResult =
  | { success: true; steps: number; time: number }
  | { success: false; failedAt: string; reason: string };

// ============ PROGRESSION ============

export interface FabriqueProgress {
  currentWorld: number;
  currentLevel: number;
  
  worldProgress: WorldProgress[];
  totalStars: number;
  
  unlockedElements: string[];
  unlockedBadges: string[];
  collectedCards: string[];
  
  createdMachines: CreatedMachine[];
  
  stats: FabriqueStats;
}

export interface WorldProgress {
  worldId: number;
  isUnlocked: boolean;
  levelsCompleted: number;
  totalLevels: number;
  stars: number;
  maxStars: number;
  levelDetails: LevelProgress[];
}

export interface LevelProgress {
  levelId: string;
  isCompleted: boolean;
  stars: number;
  bestMoves: number;
  bestTime: number;
  attempts: number;
  hintsUsed: number;
}

export interface CreatedMachine {
  id: string;
  name: string;
  elements: PlacedElement[];
  createdAt: Date;
  isWorking: boolean;
  complexity: number;
}

export interface FabriqueStats {
  totalPlayTime: number;
  levelsCompleted: number;
  totalAttempts: number;
  perfectLevels: number;        // 3 étoiles
  totalHintsUsed: number;
  longestStreak: number;
  machinesCreated: number;
  elementsUsed: Record<string, number>;
}

// ============ UI ============

export interface PaletteState {
  availableElements: ElementDefinition[];
  selectedElement: string | null;
  isExpanded: boolean;
}

export type GedeonExpression =
  | 'neutral'
  | 'thinking'
  | 'happy'
  | 'excited'
  | 'encouraging'
  | 'surprised'
  | 'waiting';

export interface MascotState {
  expression: GedeonExpression;
  message: string;
  isVisible: boolean;
  animation: 'idle' | 'talk' | 'celebrate' | 'think';
}
```

---

## ⚙️ Moteur de Simulation

### machineEngine.ts

```typescript
/**
 * Moteur de simulation de machine
 * Gère la propagation de l'énergie et la validation
 */

import { 
  PlacedElement, 
  Connection, 
  EnergyType, 
  SimulationResult,
  EnergyPathStep 
} from '../types';

export class MachineEngine {
  private elements: Map<string, PlacedElement>;
  private connections: Map<string, Connection[]>;
  private energyPath: EnergyPathStep[];
  
  constructor(
    placedElements: PlacedElement[],
    connections: Connection[]
  ) {
    this.elements = new Map(placedElements.map(e => [e.id, e]));
    this.connections = this.buildConnectionMap(connections);
    this.energyPath = [];
  }
  
  /**
   * Lance la simulation de la machine
   */
  async simulate(): Promise<SimulationResult> {
    this.energyPath = [];
    
    // Trouver les sources d'énergie
    const sources = this.findSources();
    
    if (sources.length === 0) {
      return {
        success: false,
        failedAt: 'start',
        reason: 'Aucune source d\'énergie trouvée'
      };
    }
    
    // Propager l'énergie depuis chaque source
    for (const source of sources) {
      const result = await this.propagateEnergy(source, null);
      if (!result.success) {
        return result;
      }
    }
    
    // Vérifier si un effet final a été atteint
    const effectReached = this.checkEffectReached();
    
    if (effectReached) {
      return {
        success: true,
        steps: this.energyPath.length,
        time: this.calculateTotalTime()
      };
    }
    
    return {
      success: false,
      failedAt: this.energyPath[this.energyPath.length - 1]?.elementId || 'unknown',
      reason: 'L\'énergie n\'a pas atteint l\'objectif'
    };
  }
  
  /**
   * Propage l'énergie d'un élément au suivant
   */
  private async propagateEnergy(
    element: PlacedElement,
    incomingEnergy: EnergyType | null
  ): Promise<SimulationResult> {
    const definition = getElementDefinition(element.elementId);
    
    // Vérifier si l'élément peut recevoir cette énergie
    if (incomingEnergy && !definition.acceptsEnergy.includes(incomingEnergy)) {
      return {
        success: false,
        failedAt: element.id,
        reason: `${definition.name} ne peut pas recevoir l'énergie de type ${incomingEnergy}`
      };
    }
    
    // Enregistrer le passage de l'énergie
    this.energyPath.push({
      elementId: element.id,
      energyType: incomingEnergy || definition.producesEnergy[0],
      timestamp: Date.now(),
      success: true
    });
    
    // Attendre le délai d'activation (pour animation)
    await this.delay(definition.activationDelay);
    
    // Trouver les connexions sortantes
    const outgoingConnections = this.connections.get(element.id) || [];
    
    // Si c'est un effet final, on s'arrête ici (succès)
    if (definition.category === 'effect') {
      return { success: true, steps: this.energyPath.length, time: 0 };
    }
    
    // Si pas de connexion sortante et pas effet final = échec
    if (outgoingConnections.length === 0) {
      return {
        success: false,
        failedAt: element.id,
        reason: 'L\'énergie ne peut pas continuer'
      };
    }
    
    // Propager aux éléments suivants
    for (const connection of outgoingConnections) {
      const nextElement = this.elements.get(connection.toElementId);
      if (!nextElement) continue;
      
      const result = await this.propagateEnergy(
        nextElement,
        connection.energyType
      );
      
      if (!result.success) {
        return result;
      }
    }
    
    return { success: true, steps: this.energyPath.length, time: 0 };
  }
  
  /**
   * Trouve toutes les sources d'énergie
   */
  private findSources(): PlacedElement[] {
    return Array.from(this.elements.values()).filter(element => {
      const def = getElementDefinition(element.elementId);
      return def.category === 'source';
    });
  }
  
  /**
   * Vérifie si un effet final a été activé
   */
  private checkEffectReached(): boolean {
    return this.energyPath.some(step => {
      const element = this.elements.get(step.elementId);
      if (!element) return false;
      const def = getElementDefinition(element.elementId);
      return def.category === 'effect';
    });
  }
  
  /**
   * Construit la map des connexions pour accès rapide
   */
  private buildConnectionMap(
    connections: Connection[]
  ): Map<string, Connection[]> {
    const map = new Map<string, Connection[]>();
    
    for (const conn of connections) {
      const existing = map.get(conn.fromElementId) || [];
      existing.push(conn);
      map.set(conn.fromElementId, existing);
    }
    
    return map;
  }
  
  /**
   * Calcule le temps total de simulation
   */
  private calculateTotalTime(): number {
    if (this.energyPath.length === 0) return 0;
    const first = this.energyPath[0].timestamp;
    const last = this.energyPath[this.energyPath.length - 1].timestamp;
    return last - first;
  }
  
  /**
   * Retourne le chemin de l'énergie pour animation
   */
  getEnergyPath(): EnergyPathStep[] {
    return [...this.energyPath];
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### connectionValidator.ts

```typescript
/**
 * Valide les connexions entre éléments
 */

import { PlacedElement, Connection, GridPosition } from '../types';
import { getElementDefinition } from '../data/elements';

/**
 * Vérifie si deux éléments peuvent être connectés
 */
export function canConnect(
  fromElement: PlacedElement,
  toElement: PlacedElement
): { canConnect: boolean; reason?: string } {
  const fromDef = getElementDefinition(fromElement.elementId);
  const toDef = getElementDefinition(toElement.elementId);
  
  // Vérifier si les types d'énergie sont compatibles
  const compatibleEnergy = fromDef.producesEnergy.some(
    energy => toDef.acceptsEnergy.includes(energy)
  );
  
  if (!compatibleEnergy) {
    return {
      canConnect: false,
      reason: `${fromDef.name} produit ${fromDef.producesEnergy.join('/')} mais ${toDef.name} accepte ${toDef.acceptsEnergy.join('/')}`
    };
  }
  
  // Vérifier la proximité sur la grille
  const distance = getGridDistance(fromElement.position, toElement.position);
  if (distance > 2) {
    return {
      canConnect: false,
      reason: 'Les éléments sont trop éloignés'
    };
  }
  
  // Vérifier les points de connexion
  const hasValidPoints = checkConnectionPoints(fromElement, toElement);
  if (!hasValidPoints) {
    return {
      canConnect: false,
      reason: 'Les points de connexion ne correspondent pas'
    };
  }
  
  return { canConnect: true };
}

/**
 * Calcule la distance Manhattan entre deux positions
 */
function getGridDistance(a: GridPosition, b: GridPosition): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

/**
 * Vérifie si les points de connexion sont alignés
 */
function checkConnectionPoints(
  from: PlacedElement,
  to: PlacedElement
): boolean {
  const fromDef = getElementDefinition(from.elementId);
  const toDef = getElementDefinition(to.elementId);
  
  // Trouver un point de sortie compatible avec un point d'entrée
  for (const fromPoint of fromDef.connectionPoints) {
    if (fromPoint.type === 'input') continue;
    
    for (const toPoint of toDef.connectionPoints) {
      if (toPoint.type === 'output') continue;
      
      // Vérifier si les types d'énergie matchent
      const energyMatch = fromPoint.acceptedEnergy.some(
        e => toPoint.acceptedEnergy.includes(e)
      );
      
      if (energyMatch) {
        // Vérifier l'alignement spatial selon rotation
        if (arePointsAligned(from, fromPoint, to, toPoint)) {
          return true;
        }
      }
    }
  }
  
  return false;
}

/**
 * Génère automatiquement les connexions valides
 */
export function autoConnect(
  elements: PlacedElement[]
): Connection[] {
  const connections: Connection[] = [];
  
  for (let i = 0; i < elements.length; i++) {
    for (let j = 0; j < elements.length; j++) {
      if (i === j) continue;
      
      const result = canConnect(elements[i], elements[j]);
      if (result.canConnect) {
        connections.push({
          fromElementId: elements[i].id,
          fromPointId: 'auto',
          toElementId: elements[j].id,
          toPointId: 'auto',
          energyType: findCompatibleEnergy(elements[i], elements[j])
        });
      }
    }
  }
  
  return connections;
}
```

---

## 🎣 Hook Principal

```typescript
// hooks/useFabriqueGame.ts

import { useState, useCallback, useMemo } from 'react';
import { 
  MachineState, 
  LevelConfig, 
  PlacedElement,
  SimulationResult,
  GedeonExpression
} from '../types';
import { MachineEngine } from '../logic/machineEngine';
import { autoConnect } from '../logic/connectionValidator';

interface UseFabriqueGameReturn {
  // État
  machineState: MachineState;
  levelConfig: LevelConfig;
  gedeonState: { expression: GedeonExpression; message: string };
  
  // Actions
  placeElement: (elementId: string, position: GridPosition) => void;
  removeElement: (placedId: string) => void;
  moveElement: (placedId: string, newPosition: GridPosition) => void;
  selectElement: (placedId: string | null) => void;
  
  // Simulation
  runSimulation: () => Promise<SimulationResult>;
  resetMachine: () => void;
  
  // Indices
  requestHint: (level: number) => void;
  
  // Requêtes
  canPlaceAt: (elementId: string, position: GridPosition) => boolean;
  isLevelComplete: boolean;
  currentStars: number;
}

export function useFabriqueGame(
  level: LevelConfig,
  onLevelComplete: (result: LevelResult) => void
): UseFabriqueGameReturn {
  
  // État de la machine
  const [placedElements, setPlacedElements] = useState<PlacedElement[]>(
    level.fixedElements
  );
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  
  // État de Gédéon
  const [gedeonExpression, setGedeonExpression] = useState<GedeonExpression>('neutral');
  const [gedeonMessage, setGedeonMessage] = useState(level.introDialogue);
  
  // Connexions auto-calculées
  const connections = useMemo(
    () => autoConnect(placedElements),
    [placedElements]
  );
  
  /**
   * Place un élément sur la grille
   */
  const placeElement = useCallback((
    elementId: string,
    position: GridPosition
  ) => {
    // Vérifier si la position est valide
    if (!canPlaceAt(elementId, position)) {
      setGedeonExpression('thinking');
      setGedeonMessage("Hmm, cet élément ne peut pas aller là...");
      return;
    }
    
    const newElement: PlacedElement = {
      id: `placed_${Date.now()}`,
      elementId,
      position,
      rotation: 0,
      state: 'idle',
      connections: []
    };
    
    setPlacedElements(prev => [...prev, newElement]);
    setGedeonExpression('happy');
    setGedeonMessage("Bien vu !");
  }, []);
  
  /**
   * Retire un élément de la grille
   */
  const removeElement = useCallback((placedId: string) => {
    const element = placedElements.find(e => e.id === placedId);
    
    // Vérifier si l'élément est fixe
    const isFixed = level.fixedElements.some(e => e.id === placedId);
    if (isFixed) {
      setGedeonMessage("Cet élément fait partie de la machine, on ne peut pas le retirer !");
      return;
    }
    
    setPlacedElements(prev => prev.filter(e => e.id !== placedId));
  }, [placedElements, level.fixedElements]);
  
  /**
   * Lance la simulation de la machine
   */
  const runSimulation = useCallback(async (): Promise<SimulationResult> => {
    setAttemptsCount(prev => prev + 1);
    setGedeonExpression('excited');
    setGedeonMessage("Voyons voir... 3... 2... 1... GO !");
    
    // Créer le moteur de simulation
    const engine = new MachineEngine(placedElements, connections);
    
    // Lancer la simulation
    const result = await engine.simulate();
    
    setSimulationResult(result);
    
    if (result.success) {
      // Calculer les étoiles
      const stars = calculateStars(
        attemptsCount + 1,
        hintsUsed,
        level.stars3Threshold,
        level.stars2Threshold
      );
      
      setGedeonExpression('excited');
      setGedeonMessage(level.victoryDialogue);
      
      // Notifier la completion
      onLevelComplete({
        success: true,
        stars,
        moves: attemptsCount + 1,
        hintsUsed,
        time: result.time
      });
    } else {
      setGedeonExpression('encouraging');
      
      // Message contextuel selon l'échec
      if (result.failedAt === 'start') {
        setGedeonMessage("La machine n'a pas de source d'énergie !");
      } else {
        setGedeonMessage(`Oups ! L'énergie s'est arrêtée. Regarde ce qui bloque...`);
      }
    }
    
    return result;
  }, [placedElements, connections, attemptsCount, hintsUsed, level, onLevelComplete]);
  
  /**
   * Réinitialise la machine
   */
  const resetMachine = useCallback(() => {
    setPlacedElements(level.fixedElements);
    setSimulationResult(null);
    setSelectedElement(null);
    setGedeonExpression('neutral');
    setGedeonMessage("On recommence ! Prends ton temps.");
  }, [level.fixedElements]);
  
  /**
   * Demande un indice
   */
  const requestHint = useCallback((hintLevel: number) => {
    if (hintLevel > level.hintDialogues.length) return;
    
    setHintsUsed(prev => Math.max(prev, hintLevel));
    setGedeonExpression('thinking');
    setGedeonMessage(level.hintDialogues[hintLevel - 1]);
    
    // Actions visuelles selon le niveau d'indice
    // (gérées par le composant UI)
  }, [level.hintDialogues]);
  
  /**
   * Vérifie si un élément peut être placé à une position
   */
  const canPlaceAt = useCallback((
    elementId: string,
    position: GridPosition
  ): boolean => {
    // Vérifier si la position est un slot vide
    const isEmptySlot = level.emptySlots.some(
      slot => slot.row === position.row && slot.col === position.col
    );
    
    if (!isEmptySlot) return false;
    
    // Vérifier si pas déjà occupé
    const isOccupied = placedElements.some(
      e => e.position.row === position.row && e.position.col === position.col
    );
    
    if (isOccupied) return false;
    
    // Vérifier si l'élément est disponible
    const isAvailable = level.availableElements.includes(elementId);
    
    return isAvailable;
  }, [level.emptySlots, level.availableElements, placedElements]);
  
  // Calcul des étoiles potentielles
  const currentStars = useMemo(() => {
    return calculateStars(
      attemptsCount,
      hintsUsed,
      level.stars3Threshold,
      level.stars2Threshold
    );
  }, [attemptsCount, hintsUsed, level]);
  
  // Vérifier si le niveau est complet
  const isLevelComplete = simulationResult?.success ?? false;
  
  return {
    machineState: {
      placedElements,
      connections,
      selectedElementId: selectedElement,
      draggedElement: null,
      simulationState: {
        isRunning: false,
        currentStep: 0,
        energyPath: [],
        result: simulationResult
      }
    },
    levelConfig: level,
    gedeonState: {
      expression: gedeonExpression,
      message: gedeonMessage
    },
    
    placeElement,
    removeElement,
    moveElement: () => {}, // TODO
    selectElement: setSelectedElement,
    
    runSimulation,
    resetMachine,
    requestHint,
    
    canPlaceAt,
    isLevelComplete,
    currentStars
  };
}

/**
 * Calcule le nombre d'étoiles
 */
function calculateStars(
  attempts: number,
  hints: number,
  threshold3: number,
  threshold2: number
): number {
  const adjustedAttempts = attempts + (hints * 2);
  
  if (adjustedAttempts <= threshold3) return 3;
  if (adjustedAttempts <= threshold2) return 2;
  return 1;
}
```

---

## 📊 Données des Éléments

```typescript
// data/elements.ts

import { ElementDefinition } from '../types';

export const ELEMENTS: ElementDefinition[] = [
  // ========== SOURCES ==========
  {
    id: 'hamster_wheel',
    name: 'Roue de Gédéon',
    emoji: '🐹',
    category: 'source',
    description: 'Gédéon court et fait tourner la roue !',
    acceptsEnergy: [],
    producesEnergy: ['rotation'],
    connectionPoints: [
      { id: 'out', position: 'right', type: 'output', acceptedEnergy: ['rotation'] }
    ],
    activationDelay: 500,
    animationDuration: 2000,
    unlockedAtWorld: 1,
    unlockedAtLevel: 1,
    size: { width: 120, height: 120 },
    zIndex: 10
  },
  {
    id: 'water_drop',
    name: 'Goutte d\'Eau',
    emoji: '💧',
    category: 'source',
    description: 'Une goutte tombe et fait du poids',
    acceptsEnergy: [],
    producesEnergy: ['impact', 'water'],
    connectionPoints: [
      { id: 'out', position: 'bottom', type: 'output', acceptedEnergy: ['impact', 'water'] }
    ],
    activationDelay: 300,
    animationDuration: 800,
    unlockedAtWorld: 1,
    unlockedAtLevel: 5,
    size: { width: 60, height: 80 },
    zIndex: 10
  },
  {
    id: 'battery',
    name: 'Pile',
    emoji: '🔋',
    category: 'source',
    description: 'Fournit de l\'électricité',
    acceptsEnergy: [],
    producesEnergy: ['electric'],
    connectionPoints: [
      { id: 'out', position: 'right', type: 'output', acceptedEnergy: ['electric'] }
    ],
    activationDelay: 100,
    animationDuration: 500,
    unlockedAtWorld: 2,
    unlockedAtLevel: 1,
    size: { width: 80, height: 50 },
    zIndex: 10
  },
  {
    id: 'spring',
    name: 'Ressort',
    emoji: '🌀',
    category: 'source',
    description: 'Se détend et pousse !',
    acceptsEnergy: [],
    producesEnergy: ['linear'],
    connectionPoints: [
      { id: 'out', position: 'top', type: 'output', acceptedEnergy: ['linear'] }
    ],
    activationDelay: 200,
    animationDuration: 400,
    unlockedAtWorld: 1,
    unlockedAtLevel: 8,
    size: { width: 60, height: 80 },
    zIndex: 10
  },
  
  // ========== TRANSMISSIONS ==========
  {
    id: 'gear',
    name: 'Engrenage',
    emoji: '⚙️',
    category: 'transmission',
    description: 'Transmet la rotation à un autre engrenage',
    acceptsEnergy: ['rotation'],
    producesEnergy: ['rotation'],
    connectionPoints: [
      { id: 'in', position: 'left', type: 'input', acceptedEnergy: ['rotation'] },
      { id: 'out', position: 'right', type: 'output', acceptedEnergy: ['rotation'] }
    ],
    activationDelay: 100,
    animationDuration: 1000,
    unlockedAtWorld: 1,
    unlockedAtLevel: 3,
    size: { width: 90, height: 90 },
    zIndex: 5
  },
  {
    id: 'belt',
    name: 'Courroie',
    emoji: '🔗',
    category: 'transmission',
    description: 'Transmet la rotation à distance',
    acceptsEnergy: ['rotation'],
    producesEnergy: ['rotation'],
    connectionPoints: [
      { id: 'in', position: 'left', type: 'input', acceptedEnergy: ['rotation'] },
      { id: 'out', position: 'right', type: 'output', acceptedEnergy: ['rotation'] }
    ],
    activationDelay: 150,
    animationDuration: 800,
    unlockedAtWorld: 1,
    unlockedAtLevel: 6,
    size: { width: 150, height: 40 },
    zIndex: 3
  },
  {
    id: 'lever',
    name: 'Levier',
    emoji: '🎚️',
    category: 'transmission',
    description: 'Bascule quand on appuie',
    acceptsEnergy: ['impact', 'linear'],
    producesEnergy: ['linear'],
    connectionPoints: [
      { id: 'in', position: 'left', type: 'input', acceptedEnergy: ['impact', 'linear'] },
      { id: 'out', position: 'right', type: 'output', acceptedEnergy: ['linear'] }
    ],
    activationDelay: 200,
    animationDuration: 600,
    unlockedAtWorld: 2,
    unlockedAtLevel: 3,
    size: { width: 120, height: 60 },
    zIndex: 5
  },
  {
    id: 'pulley',
    name: 'Poulie',
    emoji: '🪝',
    category: 'transmission',
    description: 'Change la direction de la force',
    acceptsEnergy: ['linear'],
    producesEnergy: ['linear'],
    connectionPoints: [
      { id: 'in', position: 'bottom', type: 'input', acceptedEnergy: ['linear'] },
      { id: 'out', position: 'top', type: 'output', acceptedEnergy: ['linear'] }
    ],
    activationDelay: 150,
    animationDuration: 700,
    unlockedAtWorld: 2,
    unlockedAtLevel: 6,
    size: { width: 70, height: 100 },
    zIndex: 5
  },
  {
    id: 'ramp',
    name: 'Rampe',
    emoji: '📐',
    category: 'transmission',
    description: 'Fait rouler les objets',
    acceptsEnergy: ['impact'],
    producesEnergy: ['linear'],
    connectionPoints: [
      { id: 'in', position: 'top', type: 'input', acceptedEnergy: ['impact'] },
      { id: 'out', position: 'bottom', type: 'output', acceptedEnergy: ['linear'] }
    ],
    activationDelay: 50,
    animationDuration: 1000,
    unlockedAtWorld: 1,
    unlockedAtLevel: 4,
    size: { width: 120, height: 80 },
    zIndex: 2
  },
  {
    id: 'dominos',
    name: 'Dominos',
    emoji: '🀱',
    category: 'transmission',
    description: 'Cascade d\'impacts',
    acceptsEnergy: ['impact', 'linear'],
    producesEnergy: ['impact'],
    connectionPoints: [
      { id: 'in', position: 'left', type: 'input', acceptedEnergy: ['impact', 'linear'] },
      { id: 'out', position: 'right', type: 'output', acceptedEnergy: ['impact'] }
    ],
    activationDelay: 100,
    animationDuration: 1500,
    unlockedAtWorld: 1,
    unlockedAtLevel: 2,
    size: { width: 140, height: 60 },
    zIndex: 5
  },
  {
    id: 'trampoline',
    name: 'Trampoline',
    emoji: '🎪',
    category: 'transmission',
    description: 'Fait rebondir vers le haut',
    acceptsEnergy: ['impact'],
    producesEnergy: ['linear'],
    connectionPoints: [
      { id: 'in', position: 'top', type: 'input', acceptedEnergy: ['impact'] },
      { id: 'out', position: 'top', type: 'output', acceptedEnergy: ['linear'] }
    ],
    activationDelay: 50,
    animationDuration: 600,
    unlockedAtWorld: 2,
    unlockedAtLevel: 8,
    size: { width: 100, height: 40 },
    zIndex: 2
  },
  
  // ========== OBJETS MOBILES ==========
  {
    id: 'ball',
    name: 'Balle',
    emoji: '⚽',
    category: 'mobile',
    description: 'Roule et rebondit',
    acceptsEnergy: ['linear', 'impact'],
    producesEnergy: ['impact'],
    connectionPoints: [
      { id: 'in', position: 'center', type: 'input', acceptedEnergy: ['linear', 'impact'] },
      { id: 'out', position: 'center', type: 'output', acceptedEnergy: ['impact'] }
    ],
    activationDelay: 0,
    animationDuration: 1000,
    unlockedAtWorld: 1,
    unlockedAtLevel: 1,
    size: { width: 50, height: 50 },
    zIndex: 8
  },
  {
    id: 'marble',
    name: 'Bille',
    emoji: '🔵',
    category: 'mobile',
    description: 'Roule précisément',
    acceptsEnergy: ['linear'],
    producesEnergy: ['impact'],
    connectionPoints: [
      { id: 'in', position: 'center', type: 'input', acceptedEnergy: ['linear'] },
      { id: 'out', position: 'center', type: 'output', acceptedEnergy: ['impact'] }
    ],
    activationDelay: 0,
    animationDuration: 800,
    unlockedAtWorld: 1,
    unlockedAtLevel: 4,
    size: { width: 30, height: 30 },
    zIndex: 8
  },
  
  // ========== DÉCLENCHEURS ==========
  {
    id: 'button',
    name: 'Bouton',
    emoji: '🔘',
    category: 'trigger',
    description: 'Appuyer pour activer',
    acceptsEnergy: ['impact', 'linear'],
    producesEnergy: ['electric'],
    connectionPoints: [
      { id: 'in', position: 'top', type: 'input', acceptedEnergy: ['impact', 'linear'] },
      { id: 'out', position: 'bottom', type: 'output', acceptedEnergy: ['electric'] }
    ],
    activationDelay: 100,
    animationDuration: 300,
    unlockedAtWorld: 1,
    unlockedAtLevel: 7,
    size: { width: 60, height: 40 },
    zIndex: 5
  },
  {
    id: 'scale',
    name: 'Balance',
    emoji: '⚖️',
    category: 'trigger',
    description: 'Bascule avec assez de poids',
    acceptsEnergy: ['impact'],
    producesEnergy: ['linear'],
    connectionPoints: [
      { id: 'in', position: 'top', type: 'input', acceptedEnergy: ['impact'] },
      { id: 'out', position: 'bottom', type: 'output', acceptedEnergy: ['linear'] }
    ],
    activationDelay: 300,
    animationDuration: 500,
    unlockedAtWorld: 2,
    unlockedAtLevel: 5,
    size: { width: 100, height: 80 },
    zIndex: 5
  },
  {
    id: 'target',
    name: 'Cible',
    emoji: '🎯',
    category: 'trigger',
    description: 'Se déclenche quand touchée',
    acceptsEnergy: ['impact'],
    producesEnergy: ['electric'],
    connectionPoints: [
      { id: 'in', position: 'center', type: 'input', acceptedEnergy: ['impact'] },
      { id: 'out', position: 'bottom', type: 'output', acceptedEnergy: ['electric'] }
    ],
    activationDelay: 50,
    animationDuration: 400,
    unlockedAtWorld: 2,
    unlockedAtLevel: 2,
    size: { width: 70, height: 70 },
    zIndex: 5
  },
  
  // ========== EFFETS FINAUX ==========
  {
    id: 'light',
    name: 'Lumière',
    emoji: '💡',
    category: 'effect',
    description: 'S\'allume !',
    acceptsEnergy: ['electric', 'rotation'],
    producesEnergy: [],
    connectionPoints: [
      { id: 'in', position: 'bottom', type: 'input', acceptedEnergy: ['electric', 'rotation'] }
    ],
    activationDelay: 50,
    animationDuration: 1000,
    unlockedAtWorld: 1,
    unlockedAtLevel: 1,
    size: { width: 60, height: 80 },
    zIndex: 10
  },
  {
    id: 'bell',
    name: 'Cloche',
    emoji: '🔔',
    category: 'effect',
    description: 'Ding dong !',
    acceptsEnergy: ['impact'],
    producesEnergy: [],
    connectionPoints: [
      { id: 'in', position: 'center', type: 'input', acceptedEnergy: ['impact'] }
    ],
    activationDelay: 0,
    animationDuration: 1500,
    unlockedAtWorld: 1,
    unlockedAtLevel: 3,
    size: { width: 70, height: 90 },
    zIndex: 10
  },
  {
    id: 'rocket',
    name: 'Fusée',
    emoji: '🚀',
    category: 'effect',
    description: 'Décolle vers les étoiles !',
    acceptsEnergy: ['electric'],
    producesEnergy: [],
    connectionPoints: [
      { id: 'in', position: 'bottom', type: 'input', acceptedEnergy: ['electric'] }
    ],
    activationDelay: 500,
    animationDuration: 2000,
    unlockedAtWorld: 2,
    unlockedAtLevel: 10,
    size: { width: 60, height: 100 },
    zIndex: 10
  },
  {
    id: 'confetti',
    name: 'Confettis',
    emoji: '🎉',
    category: 'effect',
    description: 'Explosion festive !',
    acceptsEnergy: ['electric', 'impact'],
    producesEnergy: [],
    connectionPoints: [
      { id: 'in', position: 'bottom', type: 'input', acceptedEnergy: ['electric', 'impact'] }
    ],
    activationDelay: 100,
    animationDuration: 2000,
    unlockedAtWorld: 1,
    unlockedAtLevel: 10,
    size: { width: 80, height: 80 },
    zIndex: 10
  },
  {
    id: 'music_box',
    name: 'Boîte à Musique',
    emoji: '🎵',
    category: 'effect',
    description: 'Joue une mélodie',
    acceptsEnergy: ['rotation'],
    producesEnergy: [],
    connectionPoints: [
      { id: 'in', position: 'left', type: 'input', acceptedEnergy: ['rotation'] }
    ],
    activationDelay: 200,
    animationDuration: 3000,
    unlockedAtWorld: 2,
    unlockedAtLevel: 7,
    size: { width: 90, height: 70 },
    zIndex: 10
  },
  {
    id: 'fan',
    name: 'Ventilateur',
    emoji: '🌬️',
    category: 'effect',
    description: 'Souffle !',
    acceptsEnergy: ['electric', 'rotation'],
    producesEnergy: [],
    connectionPoints: [
      { id: 'in', position: 'bottom', type: 'input', acceptedEnergy: ['electric', 'rotation'] }
    ],
    activationDelay: 300,
    animationDuration: 2000,
    unlockedAtWorld: 1,
    unlockedAtLevel: 8,
    size: { width: 80, height: 80 },
    zIndex: 10
  },
  {
    id: 'flag',
    name: 'Drapeau',
    emoji: '🚩',
    category: 'effect',
    description: 'Se lève !',
    acceptsEnergy: ['linear'],
    producesEnergy: [],
    connectionPoints: [
      { id: 'in', position: 'bottom', type: 'input', acceptedEnergy: ['linear'] }
    ],
    activationDelay: 200,
    animationDuration: 1000,
    unlockedAtWorld: 1,
    unlockedAtLevel: 5,
    size: { width: 50, height: 100 },
    zIndex: 10
  }
];

/**
 * Récupère la définition d'un élément par son ID
 */
export function getElementDefinition(id: string): ElementDefinition {
  const element = ELEMENTS.find(e => e.id === id);
  if (!element) {
    throw new Error(`Element not found: ${id}`);
  }
  return element;
}

/**
 * Récupère les éléments par catégorie
 */
export function getElementsByCategory(
  category: ElementCategory
): ElementDefinition[] {
  return ELEMENTS.filter(e => e.category === category);
}

/**
 * Récupère les éléments débloqués pour un niveau donné
 */
export function getUnlockedElements(
  worldId: number,
  levelNumber: number
): ElementDefinition[] {
  return ELEMENTS.filter(e => 
    e.unlockedAtWorld < worldId ||
    (e.unlockedAtWorld === worldId && e.unlockedAtLevel <= levelNumber)
  );
}
```

---

## 🎨 Constantes Visuelles

```typescript
// constants/fabriqueTheme.ts

export const FABRIQUE_COLORS = {
  // Couleurs principales
  primary: '#F1C40F',        // Jaune chantier
  primaryDark: '#D4AC0D',
  secondary: '#3498DB',      // Bleu mécanique
  secondaryDark: '#2980B9',
  
  // Énergie
  energyRotation: '#E67E22', // Orange
  energyLinear: '#9B59B6',   // Violet
  energyImpact: '#E74C3C',   // Rouge
  energyElectric: '#F1C40F', // Jaune
  energyAir: '#1ABC9C',      // Turquoise
  energyWater: '#3498DB',    // Bleu
  
  // États
  success: '#27AE60',
  error: '#E74C3C',
  warning: '#F39C12',
  
  // Fonds par monde
  workshop: '#FFF5E6',       // Atelier - crème chaud
  laboratory: '#E8F6FF',     // Labo - bleu clair
  factory: '#F0F0F0',        // Usine - gris clair
  station: '#1A1A2E',        // Station - bleu nuit
  dreams: '#F8E8FF',         // Rêves - violet pastel
  
  // Éléments UI
  slotEmpty: 'rgba(241, 196, 15, 0.2)',
  slotHighlight: 'rgba(241, 196, 15, 0.5)',
  connectionLine: '#E67E22',
  
  // Gédéon
  hamsterBody: '#C9A86C',
  hamsterBelly: '#F5E6D3',
  hamsterNose: '#2C1810',
};

export const FABRIQUE_SIZES = {
  // Grille
  cellSize: 90,              // Taille cellule (tablet)
  cellSizePhone: 60,         // Taille cellule (phone)
  gridPadding: 20,
  
  // Éléments
  elementMinSize: 50,
  elementMaxSize: 150,
  
  // UI
  paletteHeight: 120,
  mascotSize: 150,
  buttonHeight: 64,
  
  // Touch
  touchTarget: 64,
  dragThreshold: 10,
};

export const FABRIQUE_ANIMATIONS = {
  // Durées
  elementPlace: 200,
  elementRemove: 150,
  energyFlow: 800,
  celebrationDuration: 2000,
  
  // Springs
  dragSpring: {
    damping: 20,
    stiffness: 300,
  },
  bounceSpring: {
    damping: 10,
    stiffness: 200,
  },
  
  // Easing
  energyEasing: 'easeInOutCubic',
};
```

---

## 📱 Routes Expo Router

```typescript
// app/(games)/fabrique-reactions/_layout.tsx

import { Stack } from 'expo-router';

export default function FabriqueLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="play" 
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen 
        name="victory"
        options={{ 
          presentation: 'transparentModal',
          animation: 'fade'
        }}
      />
      <Stack.Screen 
        name="creative"
        options={{ gestureEnabled: false }}
      />
    </Stack>
  );
}
```

---

## ✅ Checklist Technique

### Phase 1 : Core
- [ ] Types TypeScript complets
- [ ] Moteur de simulation basic
- [ ] 10 éléments de base
- [ ] Grille de placement
- [ ] Drag & drop éléments

### Phase 2 : Gameplay
- [ ] Validation des connexions
- [ ] Animation flux d'énergie
- [ ] Système d'étoiles
- [ ] 30 niveaux (Monde 1-2)
- [ ] Mascotte Gédéon

### Phase 3 : Polish
- [ ] Tous les éléments (20+)
- [ ] 5 mondes complets (75 niveaux)
- [ ] Mode créatif
- [ ] Système de badges
- [ ] Cartes à collectionner
- [ ] Sons et musique

### Phase 4 : Accessibilité
- [ ] Mode daltonien
- [ ] Mode tap-tap
- [ ] Vitesse ajustable
- [ ] VoiceOver support

---

*Spécifications Techniques v1.0 — La Fabrique de Réactions*
*App Éducative iPad — Décembre 2024*
