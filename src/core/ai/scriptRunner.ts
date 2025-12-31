/**
 * Script Runner
 *
 * Exécuteur de scripts pour l'assistant IA
 * Gère le parsing, la validation et l'exécution des scripts d'assistant
 *
 * Fonctionnalités :
 * - Chargement de scripts depuis fichiers/objets
 * - Validation de la structure des scripts
 * - Sélection contextuelle de messages
 * - Support des conditions et probabilités
 */

import type { AssistantScript, AssistantTrigger, GameId } from '../types/core.types';

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Triggers valides pour les scripts
 */
export const VALID_TRIGGERS: AssistantTrigger[] = [
  'level_start',
  'first_move',
  'error',
  'repeated_error',
  'hint_requested',
  'near_victory',
  'victory',
  'stuck',
  'streak',
  'comeback',
];

/**
 * Structure minimale requise pour un script valide
 */
export interface ScriptValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// ============================================================================
// TYPES
// ============================================================================

/**
 * Collection de scripts par trigger
 */
export type ScriptCollection = Record<AssistantTrigger, AssistantScript[]>;

/**
 * Options d'exécution
 */
export interface RunnerOptions {
  /** Éviter les répétitions des X derniers messages */
  avoidRecentCount?: number;
  /** Seed pour la randomisation (tests) */
  randomSeed?: number;
  /** Logger pour debug */
  debug?: boolean;
}

// ============================================================================
// CLASSE SCRIPT RUNNER
// ============================================================================

/**
 * Exécuteur de scripts d'assistant IA
 */
export class ScriptRunner {
  private scripts: AssistantScript[];
  private scriptsByTrigger: Map<AssistantTrigger, AssistantScript[]>;
  private recentMessages: string[] = [];
  private options: RunnerOptions;

  constructor(scripts: AssistantScript[], options: RunnerOptions = {}) {
    this.scripts = scripts;
    this.options = {
      avoidRecentCount: 3,
      debug: false,
      ...options,
    };
    this.scriptsByTrigger = this.indexByTrigger(scripts);
  }

  // ============================================================================
  // MÉTHODES PRINCIPALES
  // ============================================================================

  /**
   * Exécute un script pour un trigger donné
   * Retourne le script sélectionné ou null
   */
  run(trigger: AssistantTrigger): AssistantScript | null {
    const available = this.scriptsByTrigger.get(trigger);

    if (!available || available.length === 0) {
      if (this.options.debug) {
        console.log(`[ScriptRunner] Aucun script pour trigger: ${trigger}`);
      }
      return null;
    }

    // Filtrer les messages récents pour éviter répétitions
    const filtered = this.filterRecentMessages(available);
    const scriptsToChoose = filtered.length > 0 ? filtered : available;

    // Sélection aléatoire pondérée si des probabilités sont définies
    const selected = this.selectWeighted(scriptsToChoose);

    if (selected) {
      this.recordMessage(selected.message);
      if (this.options.debug) {
        console.log(`[ScriptRunner] Script sélectionné pour ${trigger}:`, selected.message);
      }
    }

    return selected;
  }

  /**
   * Exécute un script avec contexte conditionnel
   */
  runWithContext(
    trigger: AssistantTrigger,
    context: Record<string, unknown>
  ): AssistantScript | null {
    const available = this.scriptsByTrigger.get(trigger);

    if (!available || available.length === 0) {
      return null;
    }

    // Filtrer par conditions si présentes
    const matching = available.filter((script) => {
      if (!script.conditions) return true;
      return this.evaluateConditions(script.conditions, context);
    });

    if (matching.length === 0) {
      // Fallback aux scripts sans conditions
      const fallback = available.filter((s) => !s.conditions);
      return this.selectWeighted(fallback);
    }

    const filtered = this.filterRecentMessages(matching);
    return this.selectWeighted(filtered.length > 0 ? filtered : matching);
  }

  /**
   * Obtient tous les scripts pour un trigger
   */
  getScriptsForTrigger(trigger: AssistantTrigger): AssistantScript[] {
    return this.scriptsByTrigger.get(trigger) || [];
  }

  /**
   * Vérifie si des scripts existent pour un trigger
   */
  hasScriptsForTrigger(trigger: AssistantTrigger): boolean {
    const scripts = this.scriptsByTrigger.get(trigger);
    return scripts !== undefined && scripts.length > 0;
  }

  /**
   * Ajoute des scripts dynamiquement
   */
  addScripts(scripts: AssistantScript[]): void {
    this.scripts = [...this.scripts, ...scripts];
    this.scriptsByTrigger = this.indexByTrigger(this.scripts);
  }

  /**
   * Remplace tous les scripts
   */
  setScripts(scripts: AssistantScript[]): void {
    this.scripts = scripts;
    this.scriptsByTrigger = this.indexByTrigger(scripts);
    this.recentMessages = [];
  }

  /**
   * Réinitialise l'historique des messages récents
   */
  resetHistory(): void {
    this.recentMessages = [];
  }

  // ============================================================================
  // MÉTHODES PRIVÉES
  // ============================================================================

  /**
   * Indexe les scripts par trigger pour accès rapide
   */
  private indexByTrigger(scripts: AssistantScript[]): Map<AssistantTrigger, AssistantScript[]> {
    const index = new Map<AssistantTrigger, AssistantScript[]>();

    for (const script of scripts) {
      const existing = index.get(script.trigger) || [];
      existing.push(script);
      index.set(script.trigger, existing);
    }

    return index;
  }

  /**
   * Filtre les messages récemment utilisés
   */
  private filterRecentMessages(scripts: AssistantScript[]): AssistantScript[] {
    const avoidCount = this.options.avoidRecentCount || 3;
    const recent = this.recentMessages.slice(-avoidCount);

    return scripts.filter((script) => !recent.includes(script.message));
  }

  /**
   * Sélection pondérée basée sur les probabilités
   */
  private selectWeighted(scripts: AssistantScript[]): AssistantScript | null {
    if (scripts.length === 0) return null;
    if (scripts.length === 1) return scripts[0];

    // Vérifier si des probabilités sont définies
    const hasWeights = scripts.some(
      (s) => s.conditions?.probability !== undefined
    );

    if (!hasWeights) {
      // Sélection uniforme
      return scripts[Math.floor(Math.random() * scripts.length)];
    }

    // Sélection pondérée
    const weights = scripts.map((s) => s.conditions?.probability ?? 1);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < scripts.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return scripts[i];
      }
    }

    return scripts[scripts.length - 1];
  }

  /**
   * Évalue les conditions d'un script
   */
  private evaluateConditions(
    conditions: NonNullable<AssistantScript['conditions']>,
    context: Record<string, unknown>
  ): boolean {
    // Vérifier minErrors
    if (conditions.minErrors !== undefined) {
      const errors = (context.errorCount as number) ?? 0;
      if (errors < conditions.minErrors) return false;
    }

    // Vérifier maxErrors
    if (conditions.maxErrors !== undefined) {
      const errors = (context.errorCount as number) ?? 0;
      if (errors > conditions.maxErrors) return false;
    }

    // Vérifier minMoves
    if (conditions.minMoves !== undefined) {
      const moves = (context.moveCount as number) ?? 0;
      if (moves < conditions.minMoves) return false;
    }

    // Vérifier minHints
    if (conditions.minHints !== undefined) {
      const hints = (context.hintsUsed as number) ?? 0;
      if (hints < conditions.minHints) return false;
    }

    return true;
  }

  /**
   * Enregistre un message dans l'historique
   */
  private recordMessage(message: string): void {
    this.recentMessages.push(message);

    // Limiter la taille de l'historique
    const maxHistory = (this.options.avoidRecentCount || 3) * 5;
    if (this.recentMessages.length > maxHistory) {
      this.recentMessages = this.recentMessages.slice(-maxHistory);
    }
  }
}

// ============================================================================
// FONCTIONS DE VALIDATION
// ============================================================================

/**
 * Valide un tableau de scripts
 */
export function validateScripts(scripts: unknown[]): ScriptValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!Array.isArray(scripts)) {
    return {
      isValid: false,
      errors: ['Les scripts doivent être un tableau'],
      warnings: [],
    };
  }

  scripts.forEach((script, index) => {
    const scriptErrors = validateSingleScript(script, index);
    errors.push(...scriptErrors.errors);
    warnings.push(...scriptErrors.warnings);
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Valide un script individuel
 */
function validateSingleScript(
  script: unknown,
  index: number
): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const prefix = `Script[${index}]`;

  if (typeof script !== 'object' || script === null) {
    errors.push(`${prefix}: Doit être un objet`);
    return { errors, warnings };
  }

  const s = script as Record<string, unknown>;

  // Vérifier trigger
  if (!s.trigger) {
    errors.push(`${prefix}: Trigger manquant`);
  } else if (!VALID_TRIGGERS.includes(s.trigger as AssistantTrigger)) {
    errors.push(`${prefix}: Trigger invalide "${s.trigger}"`);
  }

  // Vérifier message
  if (!s.message) {
    errors.push(`${prefix}: Message manquant`);
  } else if (typeof s.message !== 'string') {
    errors.push(`${prefix}: Message doit être une chaîne`);
  } else if (s.message.length < 5) {
    warnings.push(`${prefix}: Message très court`);
  }

  // Vérifier animation (optionnel)
  if (s.animation && typeof s.animation !== 'string') {
    warnings.push(`${prefix}: Animation doit être une chaîne`);
  }

  // Vérifier visualHint (optionnel)
  if (s.visualHint && typeof s.visualHint !== 'string') {
    warnings.push(`${prefix}: VisualHint doit être une chaîne`);
  }

  return { errors, warnings };
}

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Crée un ScriptRunner pour un jeu spécifique
 */
export function createScriptRunner(
  scripts: AssistantScript[],
  options?: RunnerOptions
): ScriptRunner {
  return new ScriptRunner(scripts, options);
}

/**
 * Fusionne plusieurs collections de scripts
 */
export function mergeScripts(...collections: AssistantScript[][]): AssistantScript[] {
  return collections.flat();
}

/**
 * Filtre les scripts par jeu
 */
export function filterScriptsByGame(
  scripts: AssistantScript[],
  gameId: GameId
): AssistantScript[] {
  return scripts.filter((script) => {
    // Si pas de gameId spécifié, le script est générique
    if (!script.conditions) return true;
    // Vérifier si conditions contient un gameId
    const conditions = script.conditions as Record<string, unknown>;
    return !conditions.gameId || conditions.gameId === gameId;
  });
}

/**
 * Crée un script simple
 */
export function createScript(
  trigger: AssistantTrigger,
  message: string,
  options?: Partial<Omit<AssistantScript, 'trigger' | 'message'>>
): AssistantScript {
  return {
    trigger,
    message,
    ...options,
  };
}

