/**
 * Chasseur de Papillons - Type definitions
 * Selective attention and working memory game
 *
 * Le jeu travaille:
 * - L'attention sélective (filtrer les stimuli non pertinents)
 * - La mémoire de travail (retenir les consignes)
 * - L'inhibition (ne pas attraper les mauvais papillons)
 * - La reconnaissance de patterns
 */

// ============================================
// PAPILLON ATTRIBUTES
// ============================================

export type ButterflyColor = 'red' | 'blue' | 'yellow' | 'green' | 'purple' | 'orange' | 'pink';

export type ButterflyPattern = 'solid' | 'striped' | 'spotted' | 'gradient' | 'hearts' | 'stars';

export type ButterflySize = 'small' | 'medium' | 'large';

export type ButterflyWingShape = 'round' | 'pointed' | 'wavy';

// ============================================
// PAPILLON ENTITY
// ============================================

export interface Butterfly {
  id: string;
  color: ButterflyColor;
  pattern: ButterflyPattern;
  size: ButterflySize;
  wingShape: ButterflyWingShape;
  /** Position X en pourcentage (0-100) */
  x: number;
  /** Position Y en pourcentage (0-100) */
  y: number;
  /** Vélocité X (-1 à 1) */
  velocityX: number;
  /** Vélocité Y (-1 à 1) */
  velocityY: number;
  /** Angle de rotation actuel */
  rotation: number;
  /** Est-ce une cible selon la règle actuelle? */
  isTarget: boolean;
  /** A été attrapé? */
  isCaught: boolean;
  /** Temps d'apparition (ms depuis début de vague) */
  spawnTime: number;
}

// ============================================
// GAME RULES
// ============================================

export type RuleType =
  | 'color'           // Attrape les papillons d'une couleur spécifique
  | 'pattern'         // Attrape les papillons avec un motif spécifique
  | 'size'            // Attrape les papillons d'une taille spécifique
  | 'color_and_size'  // Attrape une couleur ET une taille spécifique
  | 'not_color'       // Attrape TOUS sauf une couleur spécifique
  | 'two_colors'      // Attrape l'une des deux couleurs
  | 'color_or_pattern' // Attrape une couleur OU un motif
  | 'size_and_pattern' // Attrape une taille ET un motif
  | 'not_size'        // Attrape TOUS sauf une taille
  | 'complex';        // Combinaison complexe (niveau expert)

export interface GameRule {
  id: string;
  type: RuleType;
  /** Les valeurs cibles pour cette règle */
  values: string[];
  /** Instruction en français pour l'enfant */
  description: string;
  /** Icône emoji pour l'aide visuelle */
  iconHint: string;
  /** Texte court pour le badge de règle */
  shortText: string;
}

// ============================================
// LEVEL CONFIGURATION
// ============================================

export interface ChasseurLevel {
  id: string;
  gameId: 'chasseur-papillons';
  difficulty: 'easy' | 'medium' | 'hard';
  displayOrder: number;
  targetAge: number;
  estimatedMinutes: number;
  name: string;
  description: string;
  /** Niveau de difficulté 1-10 */
  difficultyLevel: number;
  /** Règles possibles pour ce niveau */
  rules: GameRule[];
  /** Nombre de papillons par vague */
  butterfliesPerWave: number;
  /** Durée d'une vague en secondes */
  waveDuration: number;
  /** Nombre total de vagues */
  totalWaves: number;
  /** Taux de réussite requis (0-1) */
  targetCatchRate: number;
  /** Ratio de distracteurs (0-1) */
  distractorRatio: number;
  /** Vitesse des papillons (1 = normale, 2 = rapide) */
  butterflySpeed: number;
  /** Nombre d'indices disponibles */
  hintsAvailable: number;
  /** Les couleurs disponibles à ce niveau */
  availableColors: ButterflyColor[];
  /** Les motifs disponibles à ce niveau */
  availablePatterns: ButterflyPattern[];
  /** Les tailles disponibles à ce niveau */
  availableSizes: ButterflySize[];
}

// ============================================
// GAME STATE
// ============================================

export type GameStatus = 'idle' | 'playing' | 'wave_complete' | 'paused' | 'victory' | 'game_over';

export interface ChasseurGameState {
  /** Configuration du niveau actuel */
  level: ChasseurLevel | null;
  /** Numéro de vague actuelle (1-indexed) */
  currentWave: number;
  /** Règle de jeu actuelle */
  currentRule: GameRule | null;
  /** Papillons actuellement à l'écran */
  butterflies: Butterfly[];
  /** Score total */
  score: number;
  /** Nombre de cibles attrapées */
  targetsCaught: number;
  /** Nombre de cibles manquées (sorties de l'écran) */
  targetsMissed: number;
  /** Nombre de mauvais papillons attrapés */
  wrongCatches: number;
  /** Série actuelle de bonnes prises */
  streak: number;
  /** Meilleure série */
  bestStreak: number;
  /** Statut du jeu */
  status: GameStatus;
  /** Temps restant dans la vague (ms) */
  timeRemaining: number;
  /** Nombre d'indices utilisés */
  hintsUsed: number;
  /** Niveau d'indice actuel (0-3) */
  currentHintLevel: 0 | 1 | 2 | 3;
}

// ============================================
// SESSION STATE
// ============================================

export interface ChasseurSessionState {
  /** ID du niveau joué */
  levelId: string;
  /** Timestamp de début */
  startTime: Date;
  /** Vagues complétées */
  wavesCompleted: number;
  /** Total papillons cibles attrapés */
  totalTargetsCaught: number;
  /** Total papillons cibles manqués */
  totalTargetsMissed: number;
  /** Total mauvais papillons attrapés */
  totalWrongCatches: number;
  /** Meilleure série de la session */
  sessionBestStreak: number;
  /** Score total de la session */
  sessionScore: number;
  /** Total d'indices utilisés */
  totalHints: number;
  /** Niveau de difficulté actuel */
  currentLevel: number;
}

// ============================================
// PROGRESS & COMPLETION
// ============================================

export interface ChasseurProgress {
  levelId: string;
  completed: boolean;
  bestScore: number | null;
  /** Meilleure précision (0-1) */
  bestAccuracy: number | null;
  /** Étoiles obtenues */
  stars: 0 | 1 | 2 | 3;
  /** Timestamp dernière partie */
  lastPlayed: number;
  /** Nombre de fois joué */
  timesPlayed: number;
}

export interface ChasseurCompletion {
  levelId: string;
  score: number;
  accuracy: number;
  targetsCaught: number;
  totalTargets: number;
  wrongCatches: number;
  bestStreak: number;
  hintsUsed: number;
  timeSeconds: number;
  stars: 1 | 2 | 3;
}

// ============================================
// FEEDBACK & ANIMATIONS
// ============================================

export type FeedbackType = 'catch' | 'miss' | 'wrong' | 'streak' | 'wave_complete' | 'victory';

export interface CatchFeedback {
  type: FeedbackType;
  position: { x: number; y: number };
  points?: number;
  message?: string;
}

// ============================================
// MASCOT EMOTION
// ============================================

export type FluttyEmotion =
  | 'neutral'      // Expression normale
  | 'happy'        // Content (bonne prise)
  | 'excited'      // Très excité (streak)
  | 'encouraging'  // Encourageant (après erreur)
  | 'thinking'     // Réfléchit (indice)
  | 'celebrating'  // Célébration (victoire)
  | 'sad';         // Déçu (trop d'erreurs)
