/**
 * Context Tracker
 *
 * Suivi du contexte de jeu pour l'assistant IA
 * Permet de savoir quand et comment intervenir
 */

import type { AssistantContext, AssistantTrigger } from '../types/core.types';

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Seuils pour détection des situations
 */
export const CONTEXT_THRESHOLDS = {
  // Inactivité (secondes)
  IDLE_WARNING: 30,
  IDLE_STUCK: 60,

  // Erreurs
  CONSECUTIVE_ERRORS_HINT: 2,
  CONSECUTIVE_ERRORS_HELP: 4,

  // Proximité de victoire
  NEAR_VICTORY_THRESHOLD: 0.85, // 85% complété

  // Streak
  STREAK_CELEBRATE: 3,
  STREAK_AMAZING: 5,

  // Comeback (secondes depuis dernière session)
  COMEBACK_THRESHOLD: 86400, // 24 heures
};

// ============================================================================
// CLASSE CONTEXT TRACKER
// ============================================================================

/**
 * Tracker de contexte pour une session de jeu
 */
export class ContextTracker {
  private gameId: string;
  private levelId: string;
  private startTime: number;
  private lastActionTime: number;
  private moveCount: number = 0;
  private errorCount: number = 0;
  private consecutiveErrors: number = 0;
  private consecutiveSuccess: number = 0;
  private hintsUsed: number = 0;
  private lastAction: string | undefined;
  private gameSpecificData: Record<string, unknown> = {};
  private triggeredEvents: Set<AssistantTrigger> = new Set();

  constructor(gameId: string, levelId: string) {
    this.gameId = gameId;
    this.levelId = levelId;
    this.startTime = Date.now();
    this.lastActionTime = Date.now();
  }

  // ============================================================================
  // MÉTHODES D'ENREGISTREMENT
  // ============================================================================

  /**
   * Enregistre un mouvement valide
   */
  recordMove(action?: string): void {
    this.moveCount++;
    this.consecutiveErrors = 0;
    this.consecutiveSuccess++;
    this.lastAction = action;
    this.lastActionTime = Date.now();
  }

  /**
   * Enregistre une erreur
   */
  recordError(action?: string): void {
    this.errorCount++;
    this.consecutiveErrors++;
    this.consecutiveSuccess = 0;
    this.lastAction = action;
    this.lastActionTime = Date.now();
  }

  /**
   * Enregistre l'utilisation d'un indice
   */
  recordHint(): void {
    this.hintsUsed++;
    this.lastActionTime = Date.now();
  }

  /**
   * Met à jour les données spécifiques au jeu
   */
  updateGameData(data: Record<string, unknown>): void {
    this.gameSpecificData = { ...this.gameSpecificData, ...data };
  }

  /**
   * Marque un événement comme déclenché (pour éviter les répétitions)
   */
  markTriggered(trigger: AssistantTrigger): void {
    this.triggeredEvents.add(trigger);
  }

  /**
   * Vérifie si un événement a déjà été déclenché
   */
  hasTriggered(trigger: AssistantTrigger): boolean {
    return this.triggeredEvents.has(trigger);
  }

  /**
   * Réinitialise les événements déclenchés (pour nouveau niveau)
   */
  resetTriggers(): void {
    this.triggeredEvents.clear();
  }

  // ============================================================================
  // MÉTHODES DE CALCUL
  // ============================================================================

  /**
   * Calcule le temps écoulé en secondes
   */
  getTimeElapsed(): number {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  /**
   * Calcule le temps d'inactivité en secondes
   */
  getIdleTime(): number {
    return Math.floor((Date.now() - this.lastActionTime) / 1000);
  }

  /**
   * Retourne le contexte actuel complet
   */
  getContext(trigger: AssistantTrigger): AssistantContext {
    return {
      gameId: this.gameId,
      levelId: this.levelId,
      trigger,
      moveCount: this.moveCount,
      errorCount: this.errorCount,
      consecutiveErrors: this.consecutiveErrors,
      hintsUsed: this.hintsUsed,
      timeElapsed: this.getTimeElapsed(),
      idleTime: this.getIdleTime(),
      lastAction: this.lastAction,
      gameSpecificData: this.gameSpecificData,
    };
  }

  // ============================================================================
  // DÉTECTION DE SITUATIONS
  // ============================================================================

  /**
   * Détecte le trigger approprié basé sur l'état actuel
   */
  detectTrigger(): AssistantTrigger | null {
    // Vérifier l'inactivité (stuck)
    if (this.getIdleTime() >= CONTEXT_THRESHOLDS.IDLE_STUCK) {
      return 'stuck';
    }

    // Vérifier les erreurs répétées
    if (this.consecutiveErrors >= CONTEXT_THRESHOLDS.CONSECUTIVE_ERRORS_HELP) {
      return 'repeated_error';
    }

    // Vérifier le streak
    if (this.consecutiveSuccess >= CONTEXT_THRESHOLDS.STREAK_CELEBRATE) {
      if (!this.hasTriggered('streak')) {
        return 'streak';
      }
    }

    return null;
  }

  /**
   * Vérifie si l'enfant est bloqué
   */
  isStuck(): boolean {
    return this.getIdleTime() >= CONTEXT_THRESHOLDS.IDLE_STUCK;
  }

  /**
   * Vérifie si un indice devrait être proposé
   */
  shouldOfferHint(): boolean {
    return (
      this.consecutiveErrors >= CONTEXT_THRESHOLDS.CONSECUTIVE_ERRORS_HINT &&
      !this.hasTriggered('hint_requested')
    );
  }

  /**
   * Vérifie si c'est un streak à célébrer
   */
  hasStreak(): boolean {
    return this.consecutiveSuccess >= CONTEXT_THRESHOLDS.STREAK_CELEBRATE;
  }

  /**
   * Vérifie si c'est un streak incroyable
   */
  hasAmazingStreak(): boolean {
    return this.consecutiveSuccess >= CONTEXT_THRESHOLDS.STREAK_AMAZING;
  }

  // ============================================================================
  // GETTERS
  // ============================================================================

  getMoveCount(): number {
    return this.moveCount;
  }

  getErrorCount(): number {
    return this.errorCount;
  }

  getConsecutiveErrors(): number {
    return this.consecutiveErrors;
  }

  getConsecutiveSuccess(): number {
    return this.consecutiveSuccess;
  }

  getHintsUsed(): number {
    return this.hintsUsed;
  }

  getGameId(): string {
    return this.gameId;
  }

  getLevelId(): string {
    return this.levelId;
  }
}

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Vérifie si c'est un retour après une longue absence
 */
export function isComeback(lastSessionTime: number | null): boolean {
  if (!lastSessionTime) return false;
  const timeSinceLastSession = (Date.now() - lastSessionTime) / 1000;
  return timeSinceLastSession >= CONTEXT_THRESHOLDS.COMEBACK_THRESHOLD;
}

/**
 * Calcule le pourcentage de complétion pour détecter "near_victory"
 */
export function calculateCompletionPercentage(
  currentProgress: number,
  totalRequired: number
): number {
  if (totalRequired <= 0) return 0;
  return currentProgress / totalRequired;
}

/**
 * Vérifie si on est proche de la victoire
 */
export function isNearVictory(completionPercentage: number): boolean {
  return completionPercentage >= CONTEXT_THRESHOLDS.NEAR_VICTORY_THRESHOLD;
}

// ============================================================================
// EXPORTS
// ============================================================================

export { ContextTracker, isComeback, calculateCompletionPercentage, isNearVictory };
