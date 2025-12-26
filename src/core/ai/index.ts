/**
 * Module AI - Assistant IA pédagogique centralisé
 *
 * Exports :
 * - childAssistant : Classe principale de l'assistant IA
 * - scriptRunner : Exécuteur de scripts d'assistant
 * - contextTracker : Suivi du contexte de jeu
 */

// Child Assistant
export {
  ChildAssistant,
  createChildAssistant,
  INTERVENTION_COOLDOWNS,
  INTERVENTION_PROBABILITIES,
} from './childAssistant';

// Script Runner
export {
  ScriptRunner,
  createScriptRunner,
  validateScripts,
  mergeScripts,
  filterScriptsByGame,
  createScript,
  VALID_TRIGGERS,
  type ScriptValidationResult,
  type ScriptCollection,
  type RunnerOptions,
} from './scriptRunner';

// Context Tracker
export {
  ContextTracker,
  isComeback,
  calculateCompletionPercentage,
  isNearVictory,
  CONTEXT_THRESHOLDS,
} from './contextTracker';
