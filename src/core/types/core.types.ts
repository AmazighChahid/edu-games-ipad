/**
 * Core Types - Types partagés pour le module /src/core
 * Types fondamentaux pour la pédagogie, l'assistant IA et la progression
 */

// ============================================================================
// PROGRESSION MONTESSORI
// ============================================================================

/**
 * Niveau d'aide visuelle selon la progression Montessori
 * Diminue progressivement à mesure que l'enfant maîtrise
 */
export type HelpLevel = 'full' | 'medium' | 'low' | 'none';

/**
 * Configuration d'un niveau de jeu
 */
export interface LevelConfig {
  id: string;
  gameId: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  minAge: number;
  maxAge: number;
  estimatedDuration: number; // en secondes
  requiredCompletions: number; // Nombre de fois à réussir pour débloquer le suivant
}

/**
 * Progression d'un niveau pour un joueur
 */
export interface LevelProgress {
  levelId: string;
  completions: number;
  bestTime?: number;
  bestMoves?: number;
  lastPlayedAt?: number;
  unlocked: boolean;
}

/**
 * Historique de performance pour l'adaptation
 */
export interface PerformanceHistory {
  gameId: string;
  sessions: SessionSummary[];
  averageErrorRate: number;
  averageCompletionTime: number;
  streakCount: number;
}

/**
 * Résumé d'une session de jeu
 */
export interface SessionSummary {
  sessionId: string;
  levelId: string;
  startedAt: number;
  endedAt: number;
  moveCount: number;
  errorCount: number;
  hintsUsed: number;
  completed: boolean;
  stars?: number; // 1-3 étoiles
}

// ============================================================================
// FEEDBACK PÉDAGOGIQUE
// ============================================================================

/**
 * Types de feedback selon le contexte
 */
export type FeedbackType =
  | 'success'           // Réussite d'une action
  | 'victory'           // Victoire complète du niveau
  | 'error'             // Erreur sur une action
  | 'hint'              // Indice donné
  | 'encouragement'     // Encouragement général
  | 'streak'            // Série de succès
  | 'milestone';        // Accomplissement majeur

/**
 * Contexte pour sélectionner le feedback approprié
 */
export interface FeedbackContext {
  type: FeedbackType;
  gameId: string;
  errorCount?: number;
  moveCount?: number;
  timeElapsed?: number;
  streakCount?: number;
  isFirstAttempt?: boolean;
  levelDifficulty?: 'easy' | 'medium' | 'hard' | 'expert';
}

/**
 * Configuration d'un message de feedback
 */
export interface FeedbackMessage {
  id: string;
  text: string;
  mood: 'happy' | 'encouraging' | 'neutral' | 'thinking';
  duration?: number; // ms
  animation?: 'confetti' | 'stars' | 'shake' | 'pulse' | 'none';
  sound?: string;
  haptic?: 'light' | 'medium' | 'success' | 'error' | 'none';
}

/**
 * Configuration des animations de feedback
 */
export interface FeedbackAnimationConfig {
  type: 'confetti' | 'stars' | 'shake' | 'pulse' | 'glow' | 'bounce';
  duration: number;
  intensity: 'light' | 'medium' | 'strong';
  color?: string;
}

// ============================================================================
// ASSISTANT IA PÉDAGOGIQUE
// ============================================================================

/**
 * Déclencheurs pour l'assistant IA
 */
export type AssistantTrigger =
  | 'game_start'        // Début du jeu
  | 'first_move'        // Premier mouvement
  | 'valid_move'        // Mouvement valide
  | 'invalid_move'      // Mouvement invalide
  | 'stuck'             // Enfant bloqué (inactivité)
  | 'repeated_error'    // Même erreur répétée
  | 'hint_requested'    // Indice demandé
  | 'near_victory'      // Proche de la victoire
  | 'victory'           // Victoire
  | 'level_up'          // Passage au niveau suivant
  | 'comeback'          // Retour après absence
  | 'streak';           // Série de réussites

/**
 * Contexte de jeu pour l'assistant
 */
export interface AssistantContext {
  gameId: string;
  levelId: string;
  trigger: AssistantTrigger;
  moveCount: number;
  errorCount: number;
  consecutiveErrors: number;
  hintsUsed: number;
  timeElapsed: number; // en secondes
  idleTime: number; // temps sans action
  lastAction?: string;
  gameSpecificData?: Record<string, unknown>;
}

/**
 * Script de l'assistant pour un contexte donné
 */
export interface AssistantScript {
  id: string;
  gameId: string;
  trigger: AssistantTrigger;
  priority: number; // Plus haut = plus prioritaire
  conditions?: AssistantCondition[];
  messages: AssistantMessage[];
}

/**
 * Condition pour déclencher un script
 */
export interface AssistantCondition {
  field: keyof AssistantContext | string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'between';
  value: number | string | boolean;
  valueMax?: number; // Pour 'between'
}

/**
 * Message de l'assistant
 */
export interface AssistantMessage {
  id: string;
  text: string;
  mood: 'happy' | 'encouraging' | 'neutral' | 'thinking' | 'excited';
  duration: number; // ms
  delay?: number; // ms avant d'afficher
  animation?: 'wave' | 'nod' | 'think' | 'celebrate' | 'point';
}

/**
 * État de l'assistant pendant une session
 */
export interface AssistantState {
  isVisible: boolean;
  currentMessage?: AssistantMessage;
  messageQueue: AssistantMessage[];
  mood: 'happy' | 'encouraging' | 'neutral' | 'thinking' | 'excited';
  lastInteractionAt?: number;
}

// ============================================================================
// ADAPTATION DE DIFFICULTÉ
// ============================================================================

/**
 * Configuration pour l'adaptation automatique
 */
export interface DifficultyAdaptationConfig {
  // Seuils pour augmenter la difficulté
  upgradeThreshold: {
    minCompletions: number;
    maxErrorRate: number;
    maxHintsPerLevel: number;
  };
  // Seuils pour diminuer la difficulté
  downgradeThreshold: {
    minErrors: number;
    maxCompletionRate: number;
  };
  // Configuration de l'aide visuelle
  helpLevelProgression: {
    full: { maxErrors: number; maxCompletions: number };
    medium: { maxErrors: number; maxCompletions: number };
    low: { maxErrors: number; maxCompletions: number };
    none: { minCompletions: number };
  };
}

/**
 * Recommandation d'adaptation
 */
export interface DifficultyRecommendation {
  action: 'upgrade' | 'maintain' | 'downgrade';
  currentHelpLevel: HelpLevel;
  suggestedHelpLevel: HelpLevel;
  reason: string;
  confidence: number; // 0-1
}

// ============================================================================
// INDICES VISUELS
// ============================================================================

/**
 * Configuration des indices visuels selon le niveau d'aide
 */
export interface VisualHintsConfig {
  helpLevel: HelpLevel;
  showTargetZones: boolean;
  highlightNextMove: boolean;
  showMovePath: boolean;
  pulseValidTargets: boolean;
  dimInvalidOptions: boolean;
  showMoveCounter: boolean;
  showOptimalMoves: boolean;
}

// ============================================================================
// EXPORTS GROUPÉS
// ============================================================================

export type {
  HelpLevel,
  LevelConfig,
  LevelProgress,
  PerformanceHistory,
  SessionSummary,
  FeedbackType,
  FeedbackContext,
  FeedbackMessage,
  FeedbackAnimationConfig,
  AssistantTrigger,
  AssistantContext,
  AssistantScript,
  AssistantCondition,
  AssistantMessage,
  AssistantState,
  DifficultyAdaptationConfig,
  DifficultyRecommendation,
  VisualHintsConfig,
};
