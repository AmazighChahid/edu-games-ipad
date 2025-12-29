/**
 * Assistant Scripts - Balance (La Balance Magique)
 *
 * Dialogues de Dr. Hibou pour le jeu de la balance
 * Ton bienveillant et pédagogique sur les concepts d'équilibre et d'égalité
 */

import type { AssistantScript, AssistantTrigger } from '../../../core/types/core.types';

// ============================================================================
// TYPE LOCAL POUR SIMPLIFIER LA DÉFINITION
// ============================================================================

interface BalanceScript {
  trigger: AssistantTrigger;
  text: string;
  mood: 'happy' | 'encouraging' | 'neutral' | 'thinking' | 'excited';
  animation?: string;
  visualHint?: string;
  conditions?: Record<string, unknown>;
}

// Helper pour convertir en AssistantScript complet
const createScript = (
  id: string,
  script: BalanceScript,
  priority: number = 1
): AssistantScript => ({
  id,
  gameId: 'balance',
  trigger: script.trigger,
  priority,
  conditions: script.conditions ? [
    {
      field: Object.keys(script.conditions)[0],
      operator: 'eq',
      value: Object.values(script.conditions)[0] as string | number | boolean,
    }
  ] : undefined,
  messages: [{
    id: `${id}_msg`,
    text: script.text,
    mood: script.mood,
    duration: 4000,
    animation: script.animation as 'wave' | 'nod' | 'think' | 'celebrate' | 'point' | undefined,
  }],
});

// ============================================================================
// SCRIPTS D'ACCUEIL
// ============================================================================

const welcomeScripts: BalanceScript[] = [
  {
    trigger: 'game_start',
    text: 'Bienvenue dans mon laboratoire ! Trouvons ensemble l\'équilibre. ⚖️',
    mood: 'excited',
    animation: 'wave',
  },
  {
    trigger: 'game_start',
    text: 'Une balance équilibrée, c\'est quand les deux côtés pèsent pareil. Prêt ? 🦉',
    mood: 'encouraging',
    animation: 'nod',
  },
  {
    trigger: 'game_start',
    text: 'Observe bien les objets... Lequel va équilibrer la balance ?',
    mood: 'thinking',
    animation: 'think',
  },
];

// ============================================================================
// SCRIPTS DE PREMIER COUP
// ============================================================================

const firstMoveScripts: BalanceScript[] = [
  {
    trigger: 'first_move',
    text: 'Bonne initiative ! Voyons ce que ça donne...',
    mood: 'encouraging',
    animation: 'nod',
  },
  {
    trigger: 'first_move',
    text: 'Tu essaies, c\'est le plus important ! 👍',
    mood: 'happy',
    animation: 'celebrate',
  },
];

// ============================================================================
// SCRIPTS D'ERREUR
// ============================================================================

const errorScripts: BalanceScript[] = [
  {
    trigger: 'invalid_move',
    text: 'Hmm, la balance penche... Essaie un autre objet ! ⚖️',
    mood: 'thinking',
    animation: 'think',
  },
  {
    trigger: 'invalid_move',
    text: 'Pas encore équilibré. Regarde bien les poids !',
    mood: 'encouraging',
    animation: 'nod',
  },
  {
    trigger: 'invalid_move',
    text: 'C\'est trop lourd ou trop léger. Continue d\'explorer !',
    mood: 'encouraging',
    animation: 'nod',
  },
];

// ============================================================================
// SCRIPTS D'ERREURS RÉPÉTÉES
// ============================================================================

const repeatedErrorScripts: BalanceScript[] = [
  {
    trigger: 'repeated_error',
    text: 'Je vais t\'aider ! Regarde le poids de chaque côté. 💡',
    mood: 'encouraging',
    animation: 'point',
    visualHint: 'showWeights',
  },
  {
    trigger: 'repeated_error',
    text: 'Compte les petits carrés sur chaque objet, ils indiquent le poids.',
    mood: 'encouraging',
    animation: 'point',
    visualHint: 'highlightWeightIndicators',
  },
  {
    trigger: 'repeated_error',
    text: 'N\'oublie pas : équilibré = même poids des deux côtés ! 🦉',
    mood: 'thinking',
    animation: 'think',
    visualHint: 'showEquation',
  },
];

// ============================================================================
// SCRIPTS D'INDICE
// ============================================================================

const hintScripts: BalanceScript[] = [
  {
    trigger: 'hint_requested',
    text: 'Indice : additionne les poids d\'un côté, puis cherche l\'objet qui correspond.',
    mood: 'thinking',
    animation: 'think',
    visualHint: 'showSum',
  },
  {
    trigger: 'hint_requested',
    text: 'Regarde : ce côté pèse X. Quel objet pèse aussi X ? 🔍',
    mood: 'encouraging',
    animation: 'point',
    visualHint: 'highlightTarget',
  },
  {
    trigger: 'hint_requested',
    text: 'Parfois il faut combiner plusieurs objets pour trouver le bon poids.',
    mood: 'thinking',
    animation: 'think',
    visualHint: 'showCombinations',
  },
];

// ============================================================================
// SCRIPTS DE BLOCAGE
// ============================================================================

const stuckScripts: BalanceScript[] = [
  {
    trigger: 'stuck',
    text: 'Tu réfléchis ? C\'est bien ! L\'équilibre demande de la patience. 🦉',
    mood: 'encouraging',
    animation: 'nod',
  },
  {
    trigger: 'stuck',
    text: 'Besoin d\'un coup de pouce ? Clique sur moi !',
    mood: 'happy',
    animation: 'wave',
  },
  {
    trigger: 'stuck',
    text: 'Les maths, c\'est comme une balance : il faut trouver l\'égalité.',
    mood: 'thinking',
    animation: 'think',
  },
];

// ============================================================================
// SCRIPTS DE QUASI-VICTOIRE
// ============================================================================

const nearVictoryScripts: BalanceScript[] = [
  {
    trigger: 'near_victory',
    text: 'Presque ! La balance est proche de l\'équilibre ! ⚖️',
    mood: 'excited',
    animation: 'celebrate',
  },
  {
    trigger: 'near_victory',
    text: 'Tu y es presque ! Un petit ajustement et c\'est bon !',
    mood: 'encouraging',
    animation: 'nod',
  },
];

// ============================================================================
// SCRIPTS DE VICTOIRE
// ============================================================================

const victoryScripts: BalanceScript[] = [
  {
    trigger: 'victory',
    text: 'PARFAIT ! La balance est en équilibre ! 🎉⚖️',
    mood: 'excited',
    animation: 'celebrate',
  },
  {
    trigger: 'victory',
    text: 'Bravo ! Tu as trouvé l\'égalité ! 🦉🏆',
    mood: 'happy',
    animation: 'celebrate',
  },
  {
    trigger: 'victory',
    text: 'Équilibre atteint ! Tu maîtrises les poids et mesures ! 🌟',
    mood: 'excited',
    animation: 'celebrate',
  },
];

// ============================================================================
// SCRIPTS DE STREAK
// ============================================================================

const streakScripts: BalanceScript[] = [
  {
    trigger: 'streak',
    text: 'Incroyable ! Tu enchaînes les équilibres ! 🔥',
    mood: 'excited',
    animation: 'celebrate',
  },
  {
    trigger: 'streak',
    text: 'Tu as l\'œil pour les balances ! Continue ! 🌟',
    mood: 'happy',
    animation: 'celebrate',
  },
];

// ============================================================================
// SCRIPTS DE RETOUR
// ============================================================================

const comebackScripts: BalanceScript[] = [
  {
    trigger: 'comeback',
    text: 'Rebonjour jeune scientifique ! Prêt pour de nouvelles expériences ? 🦉',
    mood: 'happy',
    animation: 'wave',
  },
  {
    trigger: 'comeback',
    text: 'Ah, tu es de retour ! Ma balance t\'attendait. ⚖️',
    mood: 'happy',
    animation: 'wave',
  },
];

// ============================================================================
// SCRIPTS DE NIVEAU SUIVANT
// ============================================================================

const levelUpScripts: BalanceScript[] = [
  {
    trigger: 'level_up',
    text: 'Tu viens de découvrir le concept d\'équivalence ! C\'est important en maths. 🎓',
    mood: 'excited',
    animation: 'celebrate',
  },
  {
    trigger: 'level_up',
    text: 'Nouveau niveau débloqué ! Les défis deviennent plus intéressants !',
    mood: 'happy',
    animation: 'celebrate',
  },
];

// ============================================================================
// CONVERSION ET EXPORT
// ============================================================================

// Convertir tous les scripts en AssistantScript complets
let scriptId = 0;
const generateId = () => `balance_script_${++scriptId}`;

export const balanceAssistantScripts: AssistantScript[] = [
  ...welcomeScripts.map((s, i) => createScript(generateId(), s, 10 - i)),
  ...firstMoveScripts.map((s, i) => createScript(generateId(), s, 8 - i)),
  ...errorScripts.map((s, i) => createScript(generateId(), s, 5 - i)),
  ...repeatedErrorScripts.map((s, i) => createScript(generateId(), s, 6 - i)),
  ...hintScripts.map((s, i) => createScript(generateId(), s, 7 - i)),
  ...stuckScripts.map((s, i) => createScript(generateId(), s, 4 - i)),
  ...nearVictoryScripts.map((s, i) => createScript(generateId(), s, 9 - i)),
  ...victoryScripts.map((s, i) => createScript(generateId(), s, 10 - i)),
  ...streakScripts.map((s, i) => createScript(generateId(), s, 8 - i)),
  ...comebackScripts.map((s, i) => createScript(generateId(), s, 7 - i)),
  ...levelUpScripts.map((s, i) => createScript(generateId(), s, 9 - i)),
];

// Exports nommés pour accès direct par catégorie
export const BALANCE_WELCOME_SCRIPTS = welcomeScripts.map((s, i) => createScript(`welcome_${i}`, s, 10 - i));
export const BALANCE_ERROR_SCRIPTS = errorScripts.map((s, i) => createScript(`error_${i}`, s, 5 - i));
export const BALANCE_HINT_SCRIPTS = hintScripts.map((s, i) => createScript(`hint_${i}`, s, 7 - i));
export const BALANCE_VICTORY_SCRIPTS = victoryScripts.map((s, i) => createScript(`victory_${i}`, s, 10 - i));

export default balanceAssistantScripts;
