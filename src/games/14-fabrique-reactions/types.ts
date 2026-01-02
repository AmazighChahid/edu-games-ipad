/**
 * La Fabrique de Réactions - Type definitions
 * ============================================
 * Jeu de puzzle logique de réactions en chaîne
 * Mascotte : Gédéon le Hamster Ingénieur
 *
 * @see docs/TRAME_REFERENTIEL.md - Activité 14
 */

// ============================================
// TYPES D'ÉLÉMENTS DE MACHINE
// ============================================

/** Catégories d'éléments */
export type ElementCategory =
  | 'source'        // Démarreurs (roue de hamster, ressort, etc.)
  | 'transmission'  // Transmetteurs (engrenage, levier, rampe, etc.)
  | 'mobile'        // Objets mobiles (balle, bille, etc.)
  | 'trigger'       // Déclencheurs (bouton, balance, cible, etc.)
  | 'effect';       // Effets finaux (lumière, cloche, fusée, etc.)

/** Types d'énergie transmise entre éléments */
export type EnergyType =
  | 'rotation'   // Mouvement rotatif (engrenages, roue)
  | 'linear'     // Mouvement linéaire (poussée, chute)
  | 'impact'     // Impact/collision (balle qui frappe)
  | 'electric';  // Électricité (pile, bouton)

/** Direction de connexion */
export type ConnectionDirection = 'top' | 'bottom' | 'left' | 'right' | 'center';

/** Type de point de connexion */
export type ConnectionType = 'input' | 'output' | 'both';

// ============================================
// DÉFINITION D'UN ÉLÉMENT
// ============================================

/** Point de connexion d'un élément */
export interface ConnectionPoint {
  id: string;
  position: ConnectionDirection;
  type: ConnectionType;
  acceptedEnergy: EnergyType[];
}

/** Définition complète d'un élément de machine */
export interface ElementDefinition {
  id: string;
  name: string;
  emoji: string;
  category: ElementCategory;
  description: string;

  // Entrées/sorties d'énergie
  acceptsEnergy: EnergyType[];
  producesEnergy: EnergyType[];

  // Points de connexion
  connectionPoints: ConnectionPoint[];

  // Timing d'animation
  activationDelay: number;    // ms avant activation
  animationDuration: number;  // ms d'animation

  // Déblocage progressif
  unlockedAtLevel: number;    // Niveau où l'élément est débloqué

  // Dimensions visuelles
  size: { width: number; height: number };
  zIndex: number;
}

// ============================================
// ÉLÉMENTS PLACÉS SUR LA GRILLE
// ============================================

/** Position sur la grille */
export interface GridPosition {
  row: number;
  col: number;
}

/** Rotation possible d'un élément */
export type ElementRotation = 0 | 90 | 180 | 270;

/** État d'un élément pendant la simulation */
export type ElementState =
  | 'idle'         // Au repos
  | 'ready'        // Prêt à recevoir énergie
  | 'activating'   // En cours d'activation
  | 'active'       // Activé, transmet énergie
  | 'completed'    // A fini son cycle
  | 'error';       // Erreur de connexion

/** Connexion entre deux éléments */
export interface Connection {
  fromElementId: string;
  fromPointId: string;
  toElementId: string;
  toPointId: string;
  energyType: EnergyType;
}

/** Élément placé sur la grille */
export interface PlacedElement {
  id: string;
  elementId: string;           // Référence à ElementDefinition.id
  position: GridPosition;
  rotation: ElementRotation;
  state: ElementState;
  isFixed: boolean;            // Ne peut pas être déplacé par le joueur
}

// ============================================
// CONFIGURATION DES NIVEAUX
// ============================================

/** Mode de jeu */
export type GameMode =
  | 'complete'     // Compléter la machine (placer les pièces manquantes)
  | 'reorder'      // Remettre les éléments dans le bon ordre
  | 'findError'    // Trouver l'élément qui bloque
  | 'build';       // Construire librement (mode créatif)

/** Difficulté d'un niveau */
export type LevelDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

/** Configuration d'un niveau */
export interface LevelConfig {
  id: string;
  number: number;
  title: string;

  mode: GameMode;
  difficulty: LevelDifficulty;

  // Configuration de la grille
  gridSize: { rows: number; cols: number };

  // Éléments du puzzle
  fixedElements: PlacedElement[];      // Éléments fixes (déjà placés)
  emptySlots: GridPosition[];          // Emplacements à remplir
  availableElements: string[];         // IDs des éléments disponibles à placer

  // Pour mode 'reorder' - éléments mélangés
  scrambledElements?: PlacedElement[];

  // Pour mode 'findError' - élément incorrect
  errorElementId?: string;

  // Solution optimale
  optimalSolution: PlacedElement[];
  optimalMoves: number;

  // Seuils pour étoiles
  stars3Threshold: number;   // Coups max pour 3 étoiles
  stars2Threshold: number;   // Coups max pour 2 étoiles

  // Dialogues
  introDialogue: string;
  hintDialogues: string[];
  victoryDialogue: string;

  // Déblocages (optionnel)
  unlocksElement?: string;
  unlocksBadge?: string;
}

// ============================================
// ÉTAT DE LA SIMULATION
// ============================================

/** Étape du chemin de l'énergie */
export interface EnergyPathStep {
  elementId: string;
  energyType: EnergyType;
  timestamp: number;
  success: boolean;
}

/** Résultat de la simulation */
export type SimulationResult =
  | { success: true; steps: number; time: number }
  | { success: false; failedAt: string; reason: string };

/** État de la simulation */
export interface SimulationState {
  isRunning: boolean;
  currentStep: number;
  energyPath: EnergyPathStep[];
  result: SimulationResult | null;
}

// ============================================
// ÉTAT DU JEU
// ============================================

/** État de glissement d'un élément */
export interface DragState {
  elementId: string;
  originalPosition: GridPosition | 'palette';
  currentPosition: { x: number; y: number };
}

/** État complet de la machine */
export interface MachineState {
  placedElements: PlacedElement[];
  connections: Connection[];
  selectedElementId: string | null;
  draggedElement: DragState | null;
  simulationState: SimulationState;
}

/** Statut du jeu */
export type GameStatus =
  | 'idle'       // En attente
  | 'placing'    // En train de placer
  | 'simulating' // Simulation en cours
  | 'success'    // Victoire
  | 'error';     // Échec

/** État du jeu */
export interface FabriqueGameState {
  currentLevel: LevelConfig | null;
  machineState: MachineState;
  status: GameStatus;
  attempts: number;
  hintsUsed: number;
  currentHintLevel: 0 | 1 | 2 | 3;
  isComplete: boolean;
}

// ============================================
// ÉTAT DE SESSION
// ============================================

export interface SessionState {
  levelsCompleted: number;
  levelsCorrectFirstTry: number;
  totalAttempts: number;
  totalHints: number;
  currentStreak: number;
  maxStreak: number;
  currentLevel: number;
  startTime: Date;
}

export interface SessionStats {
  completed: number;
  correctFirstTry: number;
  maxStreak: number;
  totalTime: number;
}

// ============================================
// PROGRESSION
// ============================================

export interface LevelProgress {
  levelId: string;
  isCompleted: boolean;
  stars: 0 | 1 | 2 | 3;
  bestMoves: number;
  bestTime: number;
  attempts: number;
  hintsUsed: number;
}

export interface FabriqueProgress {
  currentLevel: number;
  levelsProgress: Record<string, LevelProgress>;
  totalStars: number;
  unlockedElements: string[];
  unlockedBadges: string[];
  stats: {
    totalPlayTime: number;
    levelsCompleted: number;
    totalAttempts: number;
    perfectLevels: number;
    totalHintsUsed: number;
    longestStreak: number;
  };
}

// ============================================
// MASCOTTE GÉDÉON
// ============================================

export type GedeonExpression =
  | 'neutral'      // Expression neutre
  | 'thinking'     // En train de réfléchir
  | 'happy'        // Content
  | 'excited'      // Très content, célébration
  | 'encouraging'  // Encourageant après erreur
  | 'surprised';   // Surpris

export interface MascotState {
  expression: GedeonExpression;
  message: string;
  isVisible: boolean;
  animation: 'idle' | 'talk' | 'celebrate' | 'think' | 'bounce';
}

// ============================================
// RÉSULTAT DE NIVEAU
// ============================================

export interface LevelResult {
  success: boolean;
  stars: 0 | 1 | 2 | 3;
  moves: number;
  hintsUsed: number;
  time: number;
}

// ============================================
// SCRIPT ASSISTANT
// ============================================

export interface AssistantScript {
  trigger: string;
  message: string;
  animation?: string;
  visualHint?: string;
  conditions?: Record<string, unknown>;
}
