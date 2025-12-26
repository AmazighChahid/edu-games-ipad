/**
 * Child Assistant
 *
 * Assistant IA pédagogique bienveillant pour les enfants
 * Réutilisable par tous les jeux de l'application
 *
 * Principes :
 * - Jamais de feedback négatif ou punitif
 * - Encouragements personnalisés selon le contexte
 * - Intervention progressive (pas d'interruption abusive)
 * - Adaptation au rythme de l'enfant
 */

import type {
  AssistantContext,
  AssistantScript,
  AssistantTrigger,
  GameId,
} from '../types/core.types';
import { ContextTracker, CONTEXT_THRESHOLDS } from './contextTracker';

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Délais minimum entre interventions (en secondes)
 */
export const INTERVENTION_COOLDOWNS = {
  // Après une intervention, attendre avant la prochaine
  AFTER_ENCOURAGEMENT: 10,
  AFTER_HINT: 15,
  AFTER_HELP: 20,
  AFTER_CELEBRATION: 5,

  // Délai minimum entre deux messages du même type
  SAME_TYPE_COOLDOWN: 30,
};

/**
 * Probabilités d'intervention spontanée
 */
export const INTERVENTION_PROBABILITIES = {
  // Probabilité d'encourager après un bon coup (évite spam)
  ENCOURAGE_ON_SUCCESS: 0.3,

  // Probabilité de féliciter un streak
  CELEBRATE_STREAK: 0.8,

  // Toujours intervenir pour aider si bloqué
  HELP_WHEN_STUCK: 1.0,
};

// ============================================================================
// TYPES LOCAUX
// ============================================================================

interface InterventionState {
  lastInterventionTime: number;
  lastInterventionType: AssistantTrigger | null;
  interventionCount: number;
  sessionStartTime: number;
}

interface InterventionDecision {
  shouldIntervene: boolean;
  trigger: AssistantTrigger | null;
  priority: 'low' | 'medium' | 'high' | 'critical';
  reason?: string;
}

// ============================================================================
// CLASSE CHILD ASSISTANT
// ============================================================================

/**
 * Assistant pédagogique IA pour accompagner les enfants
 */
export class ChildAssistant {
  private gameId: GameId;
  private scripts: AssistantScript[];
  private contextTracker: ContextTracker;
  private interventionState: InterventionState;
  private messageHistory: Array<{ trigger: AssistantTrigger; timestamp: number }> = [];

  constructor(gameId: GameId, levelId: string, scripts: AssistantScript[]) {
    this.gameId = gameId;
    this.scripts = scripts;
    this.contextTracker = new ContextTracker(gameId, levelId);
    this.interventionState = {
      lastInterventionTime: 0,
      lastInterventionType: null,
      interventionCount: 0,
      sessionStartTime: Date.now(),
    };
  }

  // ============================================================================
  // MÉTHODES PRINCIPALES
  // ============================================================================

  /**
   * Décide si l'assistant doit intervenir
   * Retourne la décision avec le trigger approprié
   */
  shouldIntervene(): InterventionDecision {
    const now = Date.now();
    const timeSinceLastIntervention =
      (now - this.interventionState.lastInterventionTime) / 1000;

    // Vérifier le cooldown global
    if (timeSinceLastIntervention < INTERVENTION_COOLDOWNS.AFTER_ENCOURAGEMENT) {
      return {
        shouldIntervene: false,
        trigger: null,
        priority: 'low',
        reason: 'Cooldown actif',
      };
    }

    // PRIORITÉ CRITIQUE : Enfant bloqué (inactivité prolongée)
    if (this.contextTracker.isStuck()) {
      return {
        shouldIntervene: true,
        trigger: 'stuck',
        priority: 'critical',
        reason: 'Inactivité détectée',
      };
    }

    // PRIORITÉ HAUTE : Erreurs répétées
    const consecutiveErrors = this.contextTracker.getConsecutiveErrors();
    if (consecutiveErrors >= CONTEXT_THRESHOLDS.CONSECUTIVE_ERRORS_HELP) {
      return {
        shouldIntervene: true,
        trigger: 'repeated_error',
        priority: 'high',
        reason: `${consecutiveErrors} erreurs consécutives`,
      };
    }

    // PRIORITÉ MOYENNE : Proposer un indice après 2 erreurs
    if (this.contextTracker.shouldOfferHint()) {
      return {
        shouldIntervene: true,
        trigger: 'hint_requested',
        priority: 'medium',
        reason: 'Indice suggéré',
      };
    }

    // PRIORITÉ BASSE : Célébrer un streak
    if (this.contextTracker.hasStreak() && !this.contextTracker.hasTriggered('streak')) {
      if (Math.random() < INTERVENTION_PROBABILITIES.CELEBRATE_STREAK) {
        return {
          shouldIntervene: true,
          trigger: 'streak',
          priority: 'low',
          reason: 'Streak à célébrer',
        };
      }
    }

    return {
      shouldIntervene: false,
      trigger: null,
      priority: 'low',
    };
  }

  /**
   * Sélectionne le message approprié pour le trigger donné
   * Retourne le script complet avec le message sélectionné
   */
  selectMessage(trigger: AssistantTrigger): AssistantScript | null {
    // Trouver les scripts correspondant au trigger
    const matchingScripts = this.scripts.filter((script) => script.trigger === trigger);

    if (matchingScripts.length === 0) {
      return null;
    }

    // Si plusieurs scripts, en choisir un aléatoirement
    // Éviter de répéter le dernier message utilisé
    const recentMessages = this.messageHistory
      .filter((h) => h.trigger === trigger)
      .slice(-3);

    const availableScripts = matchingScripts.filter(
      (script) =>
        !recentMessages.some(
          (recent) =>
            this.scripts.find((s) => s.trigger === recent.trigger)?.message === script.message
        )
    );

    const scriptsToChooseFrom =
      availableScripts.length > 0 ? availableScripts : matchingScripts;
    const selectedScript =
      scriptsToChooseFrom[Math.floor(Math.random() * scriptsToChooseFrom.length)];

    // Enregistrer dans l'historique
    this.messageHistory.push({ trigger, timestamp: Date.now() });

    // Limiter la taille de l'historique
    if (this.messageHistory.length > 50) {
      this.messageHistory = this.messageHistory.slice(-30);
    }

    return selectedScript;
  }

  /**
   * Obtient un message d'intervention si nécessaire
   * Combine shouldIntervene et selectMessage
   */
  getIntervention(): { script: AssistantScript; context: AssistantContext } | null {
    const decision = this.shouldIntervene();

    if (!decision.shouldIntervene || !decision.trigger) {
      return null;
    }

    const script = this.selectMessage(decision.trigger);

    if (!script) {
      return null;
    }

    // Mettre à jour l'état d'intervention
    this.interventionState.lastInterventionTime = Date.now();
    this.interventionState.lastInterventionType = decision.trigger;
    this.interventionState.interventionCount++;

    // Marquer comme déclenché pour éviter répétition
    this.contextTracker.markTriggered(decision.trigger);

    return {
      script,
      context: this.contextTracker.getContext(decision.trigger),
    };
  }

  // ============================================================================
  // MÉTHODES D'ENREGISTREMENT (délègue au ContextTracker)
  // ============================================================================

  /**
   * Enregistre un mouvement valide
   */
  recordMove(action?: string): void {
    this.contextTracker.recordMove(action);
  }

  /**
   * Enregistre une erreur
   */
  recordError(action?: string): void {
    this.contextTracker.recordError(action);
  }

  /**
   * Enregistre l'utilisation d'un indice
   */
  recordHint(): void {
    this.contextTracker.recordHint();
  }

  /**
   * Met à jour les données spécifiques au jeu
   */
  updateGameData(data: Record<string, unknown>): void {
    this.contextTracker.updateGameData(data);
  }

  // ============================================================================
  // MÉTHODES DE REQUÊTE DIRECTE
  // ============================================================================

  /**
   * Obtient un message de bienvenue pour le début de niveau
   */
  getWelcomeMessage(): AssistantScript | null {
    return this.selectMessage('level_start');
  }

  /**
   * Obtient un message de victoire
   */
  getVictoryMessage(): AssistantScript | null {
    // Choisir entre victory et near_victory selon performance
    const trigger = this.contextTracker.getErrorCount() === 0 ? 'victory' : 'near_victory';
    return this.selectMessage(trigger) || this.selectMessage('victory');
  }

  /**
   * Obtient un message d'erreur bienveillant
   */
  getErrorMessage(): AssistantScript | null {
    const consecutiveErrors = this.contextTracker.getConsecutiveErrors();

    if (consecutiveErrors >= CONTEXT_THRESHOLDS.CONSECUTIVE_ERRORS_HELP) {
      return this.selectMessage('repeated_error');
    }

    return this.selectMessage('error');
  }

  /**
   * Obtient un indice pour le niveau actuel
   */
  getHint(): AssistantScript | null {
    this.contextTracker.recordHint();
    return this.selectMessage('hint_requested');
  }

  /**
   * Obtient un message d'encouragement générique
   */
  getEncouragement(): AssistantScript | null {
    if (this.contextTracker.hasAmazingStreak()) {
      return this.selectMessage('streak');
    }
    return this.selectMessage('first_move');
  }

  // ============================================================================
  // MÉTHODES UTILITAIRES
  // ============================================================================

  /**
   * Réinitialise pour un nouveau niveau
   */
  resetForNewLevel(levelId: string): void {
    this.contextTracker = new ContextTracker(this.gameId, levelId);
    this.interventionState = {
      lastInterventionTime: 0,
      lastInterventionType: null,
      interventionCount: 0,
      sessionStartTime: Date.now(),
    };
  }

  /**
   * Met à jour les scripts (pour chargement dynamique)
   */
  updateScripts(scripts: AssistantScript[]): void {
    this.scripts = scripts;
  }

  /**
   * Obtient les statistiques de la session
   */
  getSessionStats(): {
    interventionCount: number;
    moveCount: number;
    errorCount: number;
    hintsUsed: number;
    timeElapsed: number;
  } {
    return {
      interventionCount: this.interventionState.interventionCount,
      moveCount: this.contextTracker.getMoveCount(),
      errorCount: this.contextTracker.getErrorCount(),
      hintsUsed: this.contextTracker.getHintsUsed(),
      timeElapsed: this.contextTracker.getTimeElapsed(),
    };
  }

  /**
   * Vérifie si un trigger spécifique a déjà été utilisé
   */
  hasTriggered(trigger: AssistantTrigger): boolean {
    return this.contextTracker.hasTriggered(trigger);
  }

  /**
   * Obtient le contexte actuel
   */
  getContext(trigger: AssistantTrigger): AssistantContext {
    return this.contextTracker.getContext(trigger);
  }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

/**
 * Crée une instance de ChildAssistant pour un jeu
 */
export function createChildAssistant(
  gameId: GameId,
  levelId: string,
  scripts: AssistantScript[]
): ChildAssistant {
  return new ChildAssistant(gameId, levelId, scripts);
}

// ============================================================================
// EXPORTS
// ============================================================================

export { ChildAssistant, createChildAssistant };
