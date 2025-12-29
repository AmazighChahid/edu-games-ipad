/**
 * Hint System - Systeme d'indices Montessori-compatible
 *
 * Genere des hints adaptes au type de pattern et a l'erreur commise.
 */

import {
  SequencePuzzle,
  HintPayload,
  HintTemplate,
  HintType,
  HighlightKey,
  LogicFamily,
  ErrorType,
} from './types';
import { getErrorDimension } from './errorDiagnostic';

// ============================================
// TEMPLATES DE HINTS PAR FAMILLE
// ============================================

/**
 * Templates de hints pour chaque famille de patterns
 * 3 niveaux progressifs Montessori:
 * - Niveau 1: Question orientee (faire reflechir)
 * - Niveau 2: Highlight dimension pertinente (guider le regard)
 * - Niveau 3: Montrer la regle sur 2 pas (sans donner la reponse)
 */
const HINT_TEMPLATES: Record<LogicFamily, HintTemplate[]> = {
  alternation: [
    {
      level: 1,
      type: 'question',
      message: "Observe bien : qu'est-ce qui se repete dans ce motif ?",
    },
    {
      level: 2,
      type: 'highlight',
      message: 'Regarde les elements qui reviennent...',
      highlightKey: 'shape',
    },
    {
      level: 3,
      type: 'rule',
      message: 'Le motif se repete : apres celui-ci vient toujours celui-la.',
      ruleDemo: true,
    },
  ],

  numeric_linear: [
    {
      level: 1,
      type: 'question',
      message: 'De combien augmente ou diminue chaque nombre ?',
    },
    {
      level: 2,
      type: 'highlight',
      message: 'Compare les nombres voisins...',
      highlightKey: 'number',
    },
    {
      level: 3,
      type: 'rule',
      message: 'Regarde : on ajoute toujours le meme nombre.',
      ruleDemo: true,
    },
  ],

  numeric_mult: [
    {
      level: 1,
      type: 'question',
      message: 'Par combien multiplie-t-on chaque nombre ?',
    },
    {
      level: 2,
      type: 'highlight',
      message: 'Divise un nombre par le precedent...',
      highlightKey: 'number',
    },
    {
      level: 3,
      type: 'rule',
      message: 'On multiplie toujours par le meme nombre.',
      ruleDemo: true,
    },
  ],

  numeric_power: [
    {
      level: 1,
      type: 'question',
      message: 'Ces nombres ont quelque chose de special. Les reconnais-tu ?',
    },
    {
      level: 2,
      type: 'highlight',
      message: 'Ce sont des nombres particuliers...',
      highlightKey: 'number',
    },
    {
      level: 3,
      type: 'rule',
      message: 'Ce sont les carres parfaits : 1, 4, 9, 16...',
      ruleDemo: true,
    },
  ],

  mirror: [
    {
      level: 1,
      type: 'question',
      message: 'Ce motif ressemble a un miroir. Ou est le centre ?',
    },
    {
      level: 2,
      type: 'highlight',
      message: 'Le motif se reflete de chaque cote...',
      highlightKey: 'shape',
    },
    {
      level: 3,
      type: 'rule',
      message: 'Comme dans un miroir : gauche et droite sont pareils.',
      ruleDemo: true,
    },
  ],

  transform: [
    {
      level: 1,
      type: 'question',
      message: "Qu'est-ce qui change a chaque etape ?",
    },
    {
      level: 2,
      type: 'highlight',
      message: 'Regarde comment les elements se transforment...',
      highlightKey: 'size',
    },
    {
      level: 3,
      type: 'rule',
      message: 'A chaque etape, la meme transformation se produit.',
      ruleDemo: true,
    },
  ],

  nested: [
    {
      level: 1,
      type: 'question',
      message: 'Il y a plusieurs motifs ici. Lesquels ?',
    },
    {
      level: 2,
      type: 'highlight',
      message: 'Cherche les repetitions dans les repetitions...',
      highlightKey: 'shape',
    },
    {
      level: 3,
      type: 'rule',
      message: 'Un petit motif se repete a l\'interieur d\'un plus grand.',
      ruleDemo: true,
    },
  ],
};

// ============================================
// MESSAGES ADAPTES AUX ERREURS
// ============================================

/**
 * Messages specifiques selon le type d'erreur
 */
const ERROR_SPECIFIC_MESSAGES: Partial<Record<ErrorType, {
  message: string;
  highlightKey?: HighlightKey;
}>> = {
  off_by_one: {
    message: 'Tu es tres proche ! Recompte une fois de plus...',
    highlightKey: 'number',
  },
  wrong_step: {
    message: "Le pas n'est pas le bon. Calcule la difference entre deux nombres.",
    highlightKey: 'number',
  },
  used_previous: {
    message: "Tu as pris celui d'avant ! Il faut trouver le suivant.",
    highlightKey: 'number',
  },
  used_next_next: {
    message: 'Tu as saute une etape ! Reviens en arriere.',
    highlightKey: 'number',
  },
  confusion_add_mult: {
    message: 'Est-ce qu\'on ajoute ou qu\'on multiplie ?',
    highlightKey: 'number',
  },
  wrong_color: {
    message: 'Tu as trouve la bonne forme ! Maintenant regarde la couleur...',
    highlightKey: 'color',
  },
  wrong_shape: {
    message: 'La couleur est bonne ! Maintenant trouve la bonne forme...',
    highlightKey: 'shape',
  },
  wrong_size: {
    message: 'C\'est le bon element, mais pas la bonne taille !',
    highlightKey: 'size',
  },
  wrong_rotation: {
    message: 'C\'est le bon element, mais tourne differemment !',
    highlightKey: 'rotation',
  },
  mirror_confusion: {
    message: 'Attention a la symetrie ! Ou est le centre du miroir ?',
    highlightKey: 'shape',
  },
  cycle_shift: {
    message: 'Tu t\'es decale dans le motif. Recommence depuis le debut.',
    highlightKey: 'shape',
  },
  random_guess: {
    message: 'Cherche la regle qui se repete dans la suite.',
  },
};

// ============================================
// GENERATION DE HINTS
// ============================================

/**
 * Obtenir un hint adapte au puzzle et a l'erreur
 */
export function getHint(
  puzzle: SequencePuzzle,
  hintLevel: 1 | 2 | 3,
  lastErrorType?: ErrorType
): HintPayload {
  // Obtenir le template de base pour cette famille
  const templates = HINT_TEMPLATES[puzzle.family] || HINT_TEMPLATES.alternation;
  const baseTemplate = templates.find(t => t.level === hintLevel) || templates[0];

  // Si on a une erreur recente, adapter le hint
  if (lastErrorType && hintLevel <= 2) {
    const errorSpecific = ERROR_SPECIFIC_MESSAGES[lastErrorType];
    if (errorSpecific) {
      return {
        level: hintLevel,
        type: 'highlight',
        message: errorSpecific.message,
        highlightKey: errorSpecific.highlightKey || baseTemplate.highlightKey,
        highlightIndices: getHighlightIndices(puzzle, hintLevel, lastErrorType),
      };
    }
  }

  // Construire le payload standard
  const payload: HintPayload = {
    level: hintLevel,
    type: baseTemplate.type || 'question',
    message: baseTemplate.message,
    highlightKey: baseTemplate.highlightKey,
    highlightIndices: getHighlightIndices(puzzle, hintLevel, lastErrorType),
  };

  // Ajouter la demo de regle pour niveau 3
  if (hintLevel === 3 && baseTemplate.ruleDemo) {
    payload.ruleDemo = getRuleDemo(puzzle);
  }

  return payload;
}

/**
 * Obtenir les indices des elements a mettre en surbrillance
 */
function getHighlightIndices(
  puzzle: SequencePuzzle,
  hintLevel: 1 | 2 | 3,
  errorType?: ErrorType
): number[] {
  const seqLength = puzzle.sequence.length;

  switch (hintLevel) {
    case 1:
      // Niveau 1: Pas de highlight
      return [];

    case 2:
      // Niveau 2: Highlight les premiers elements pour montrer le pattern
      if (puzzle.family === 'mirror') {
        // Pour miroir, montrer le centre et les bords
        const mid = Math.floor(seqLength / 2);
        return [0, mid, seqLength - 1];
      }
      // Pour les autres, montrer les 3 premiers
      return [0, 1, 2].filter(i => i < seqLength);

    case 3:
      // Niveau 3: Highlight tout le pattern visible
      return Array.from({ length: seqLength }, (_, i) => i);

    default:
      return [];
  }
}

/**
 * Obtenir une demonstration de la regle
 */
function getRuleDemo(puzzle: SequencePuzzle): {
  before: typeof puzzle.sequence[0];
  after: typeof puzzle.sequence[0];
} | undefined {
  if (puzzle.sequence.length < 2) return undefined;

  // Prendre deux elements consecutifs pour montrer la transformation
  const idx = Math.min(puzzle.sequence.length - 2, 1); // Preferer les premiers elements
  return {
    before: puzzle.sequence[idx],
    after: puzzle.sequence[idx + 1],
  };
}

// ============================================
// MESSAGES ENCOURAGEANTS
// ============================================

/**
 * Messages d'encouragement apres un hint
 */
export const ENCOURAGEMENT_MESSAGES = {
  afterHint1: [
    'Prends ton temps pour observer...',
    'Tu vas trouver !',
    'Regarde bien le debut de la suite...',
  ],
  afterHint2: [
    'Tu te rapproches !',
    'Continue a chercher...',
    'La reponse est presque la !',
  ],
  afterHint3: [
    'Maintenant tu as toutes les cartes en main !',
    'Tu peux y arriver !',
    'Fais confiance a ce que tu as observe.',
  ],
};

/**
 * Obtenir un message d'encouragement aleatoire
 */
export function getEncouragementMessage(hintLevel: 1 | 2 | 3): string {
  const messages =
    hintLevel === 1
      ? ENCOURAGEMENT_MESSAGES.afterHint1
      : hintLevel === 2
      ? ENCOURAGEMENT_MESSAGES.afterHint2
      : ENCOURAGEMENT_MESSAGES.afterHint3;

  return messages[Math.floor(Math.random() * messages.length)];
}

// ============================================
// INTEGRATION UI
// ============================================

/**
 * Determiner quelle dimension mettre en evidence dans l'UI
 */
export function getUIHighlightConfig(hint: HintPayload): {
  highlightSequenceIndices: number[];
  highlightChoiceIds?: string[];
  pulseKey?: HighlightKey;
  showArrows?: boolean;
} {
  return {
    highlightSequenceIndices: hint.highlightIndices || [],
    pulseKey: hint.highlightKey,
    showArrows: hint.type === 'rule' && hint.ruleDemo !== undefined,
  };
}

/**
 * Verifier si un hint supplementaire est disponible
 */
export function canShowMoreHints(
  currentHintLevel: number,
  maxHintLevel: number = 3
): boolean {
  return currentHintLevel < maxHintLevel;
}

/**
 * Obtenir le texte du bouton hint selon le niveau
 */
export function getHintButtonText(nextHintLevel: 1 | 2 | 3): string {
  switch (nextHintLevel) {
    case 1:
      return 'Un indice ?';
    case 2:
      return 'Plus d\'aide';
    case 3:
      return 'Montrer la regle';
    default:
      return 'Indice';
  }
}
