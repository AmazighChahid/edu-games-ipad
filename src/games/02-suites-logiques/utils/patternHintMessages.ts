/**
 * Pattern Hint Messages - Messages d'aide contextuels pour la mascotte
 *
 * Ces messages aident l'enfant à comprendre la logique du pattern
 * après une erreur ou quand il demande de l'aide.
 */

import { PatternType, PatternDefinition } from '../types';

// ============================================
// TYPES
// ============================================

export interface PatternHintConfig {
  // Message après première erreur (encourageant + indice léger)
  afterFirstError: string[];
  // Message après deuxième erreur (plus explicite)
  afterSecondError: string[];
  // Message d'indice niveau 1 (question orientée)
  hintLevel1: string[];
  // Message d'indice niveau 2 (guide le regard)
  hintLevel2: string[];
  // Message d'indice niveau 3 (explique la règle)
  hintLevel3: string[];
  // Description du pattern pour les parents
  parentDescription: string;
}

// ============================================
// MESSAGES PAR TYPE DE PATTERN
// ============================================

const PATTERN_HINTS: Record<string, PatternHintConfig> = {
  // ========== PATTERNS CYCLIQUES SIMPLES ==========
  ABAB: {
    afterFirstError: [
      'Regarde bien : il y a 2 éléments qui se répètent !',
      'C\'est comme une chanson : la-la, la-la... Quel est le prochain ?',
      'Observe les deux premiers, ils reviennent toujours dans le même ordre !',
    ],
    afterSecondError: [
      'Le motif est simple : A, B, A, B... Tu vois ? C\'est toujours pareil !',
      'Regarde : le 1er et le 3ème sont pareils, le 2ème et le 4ème aussi !',
    ],
    hintLevel1: ['Compte : 1er, 2ème, 1er, 2ème... Lequel vient après ?'],
    hintLevel2: ['Les éléments qui brillent sont pareils. Tu vois comment ils alternent ?'],
    hintLevel3: ['C\'est le pattern A-B-A-B : toujours le même ordre qui se répète !'],
    parentDescription: 'Pattern d\'alternance simple entre 2 éléments',
  },

  AABB: {
    afterFirstError: [
      'Regarde : chaque élément apparaît 2 fois de suite !',
      'C\'est comme AA, BB, AA, BB... Tu vois les paires ?',
    ],
    afterSecondError: [
      'Compte les répétitions : 2 pareils, puis 2 autres pareils !',
      'Le motif c\'est : deux fois le même, puis deux fois un autre.',
    ],
    hintLevel1: ['Combien de fois chaque élément apparaît-il de suite ?'],
    hintLevel2: ['Regarde les paires qui se forment...'],
    hintLevel3: ['Chaque élément vient par 2 : A-A puis B-B puis A-A...'],
    parentDescription: 'Pattern de paires (doublons) alternées',
  },

  AAB: {
    afterFirstError: [
      'Regarde : un élément vient 2 fois, l\'autre 1 fois !',
      'C\'est AA puis B, AA puis B...',
    ],
    afterSecondError: [
      'Le motif c\'est : 2 pareils, puis 1 différent. Et ça recommence !',
    ],
    hintLevel1: ['Compte combien de fois chaque élément apparaît dans le groupe.'],
    hintLevel2: ['Tu vois le "groupe" qui se répète ? 2 + 1...'],
    hintLevel3: ['C\'est le pattern A-A-B qui se répète : 2 fois le même, puis 1 différent.'],
    parentDescription: 'Pattern asymétrique 2+1',
  },

  ABC: {
    afterFirstError: [
      'Il y a 3 éléments différents qui se suivent !',
      'Regarde : 1er, 2ème, 3ème... puis ça recommence !',
    ],
    afterSecondError: [
      'Le cycle fait 3 : A, B, C, puis encore A, B, C...',
      'Après le 3ème élément, on revient au 1er !',
    ],
    hintLevel1: ['Combien d\'éléments différents vois-tu ?'],
    hintLevel2: ['Observe les 3 premiers éléments, ils reviennent !'],
    hintLevel3: ['C\'est A-B-C-A-B-C : un cycle de 3 éléments qui se répète.'],
    parentDescription: 'Cycle de 3 éléments différents',
  },

  // ========== PATTERNS MIROIR ==========
  ABCBA: {
    afterFirstError: [
      'C\'est comme un miroir ! Regarde le milieu...',
      'Le début et la fin sont pareils, comme un reflet !',
    ],
    afterSecondError: [
      'Plie la suite en deux : le début = la fin, comme un palindrome !',
      'A-B-C-B-A : tu vois la symétrie ?',
    ],
    hintLevel1: ['Où est le centre de ce motif ?'],
    hintLevel2: ['Compare le début et la fin...'],
    hintLevel3: ['C\'est un miroir : A-B-C au milieu, puis C-B-A en sens inverse !'],
    parentDescription: 'Pattern miroir symétrique',
  },

  ABCDCBA: {
    afterFirstError: [
      'C\'est un grand miroir ! Trouve le centre.',
      'La suite se reflète au milieu.',
    ],
    afterSecondError: [
      'Compte depuis le début ET depuis la fin : tu verras la même chose !',
    ],
    hintLevel1: ['C\'est comme un palindrome. Où est le milieu ?'],
    hintLevel2: ['Les éléments aux extrémités sont les mêmes...'],
    hintLevel3: ['Miroir : A-B-C-D au centre, puis D-C-B-A en retour !'],
    parentDescription: 'Pattern miroir long (7 éléments)',
  },

  // ========== PATTERNS NUMÉRIQUES ==========
  numeric_add: {
    afterFirstError: [
      'Regarde la différence entre chaque nombre !',
      'De combien augmente-t-on à chaque fois ?',
    ],
    afterSecondError: [
      'Calcule : 2ème - 1er = ? C\'est toujours la même chose !',
      'On ajoute toujours le même nombre.',
    ],
    hintLevel1: ['Quelle est la différence entre deux nombres voisins ?'],
    hintLevel2: ['Compare : combien ajoute-t-on à chaque étape ?'],
    hintLevel3: ['C\'est une suite +N : on ajoute toujours le même nombre !'],
    parentDescription: 'Suite arithmétique (+N)',
  },

  numeric_mult: {
    afterFirstError: [
      'Par combien multiplie-t-on chaque nombre ?',
      'Regarde : chaque nombre est combien de fois plus grand ?',
    ],
    afterSecondError: [
      'Divise le 2ème par le 1er. C\'est toujours pareil !',
      'On multiplie toujours par le même nombre.',
    ],
    hintLevel1: ['Divise un nombre par celui d\'avant. Tu trouves quoi ?'],
    hintLevel2: ['C\'est une multiplication qui se répète...'],
    hintLevel3: ['C\'est une suite ×N : on multiplie toujours par le même !'],
    parentDescription: 'Suite géométrique (×N)',
  },

  numeric_square: {
    afterFirstError: [
      'Ces nombres sont spéciaux... Tu les reconnais ?',
      'Ce sont des carrés parfaits ! 1×1, 2×2, 3×3...',
    ],
    afterSecondError: [
      'Regarde : 1, 4, 9, 16, 25... Ce sont 1², 2², 3², 4², 5² !',
      'Chaque nombre c\'est quelque chose × lui-même.',
    ],
    hintLevel1: ['Ces nombres ont quelque chose de spécial. Les reconnais-tu ?'],
    hintLevel2: ['Essaie de trouver la racine carrée de chaque nombre...'],
    hintLevel3: ['Ce sont les carrés parfaits : 1², 2², 3², 4²... N×N !'],
    parentDescription: 'Carrés parfaits (N²)',
  },

  fibonacci: {
    afterFirstError: [
      'Regarde les deux nombres d\'avant pour trouver le suivant !',
      'Chaque nombre = la somme des 2 précédents.',
    ],
    afterSecondError: [
      '1+1=2, 1+2=3, 2+3=5, 3+5=8... Tu additionnes les 2 derniers !',
    ],
    hintLevel1: ['Que se passe-t-il si tu additionnes les 2 nombres précédents ?'],
    hintLevel2: ['C\'est la suite de Fibonacci : chaque nombre = somme des 2 avant.'],
    hintLevel3: ['Fibonacci : 1, 1, 2, 3, 5, 8, 13... Additionne toujours les 2 derniers !'],
    parentDescription: 'Suite de Fibonacci',
  },

  prime: {
    afterFirstError: [
      'Ces nombres ne peuvent être divisés que par 1 et eux-mêmes !',
      'Ce sont des nombres premiers. Tu les connais ?',
    ],
    afterSecondError: [
      '2, 3, 5, 7, 11, 13... Ces nombres n\'ont que 2 diviseurs.',
    ],
    hintLevel1: ['Qu\'ont ces nombres en commun ? Pense à la division...'],
    hintLevel2: ['Ce sont des nombres qu\'on ne peut pas diviser facilement.'],
    hintLevel3: ['Nombres premiers : divisibles seulement par 1 et eux-mêmes !'],
    parentDescription: 'Nombres premiers',
  },

  // ========== PATTERNS DE TRANSFORMATION ==========
  rotation: {
    afterFirstError: [
      'Regarde comment la forme tourne à chaque étape !',
      'La forme pivote toujours du même angle.',
    ],
    afterSecondError: [
      'Compare la rotation entre chaque élément. C\'est toujours pareil !',
    ],
    hintLevel1: ['De combien de degrés la forme tourne-t-elle ?'],
    hintLevel2: ['Suis la rotation pas à pas...'],
    hintLevel3: ['La forme tourne toujours du même angle à chaque étape !'],
    parentDescription: 'Rotation progressive',
  },

  increasing: {
    afterFirstError: [
      'Regarde la taille ! Elle change à chaque fois.',
      'Les éléments grandissent ou rapetissent ?',
    ],
    afterSecondError: [
      'Petit, moyen, grand... ou l\'inverse ! Tu vois la progression ?',
    ],
    hintLevel1: ['Compare les tailles entre les éléments.'],
    hintLevel2: ['La taille change de façon régulière...'],
    hintLevel3: ['C\'est une suite de tailles croissantes ou décroissantes !'],
    parentDescription: 'Progression de taille',
  },

  // ========== PATTERNS COMPLEXES ==========
  nested: {
    afterFirstError: [
      'Il y a plusieurs motifs ici ! Regarde bien.',
      'Un petit pattern se répète dans un plus grand.',
    ],
    afterSecondError: [
      'Cherche le motif principal, puis le sous-motif.',
    ],
    hintLevel1: ['Combien de "couches" de répétition vois-tu ?'],
    hintLevel2: ['Un motif dans un motif...'],
    hintLevel3: ['Pattern imbriqué : un petit cycle dans un plus grand !'],
    parentDescription: 'Pattern imbriqué (nested)',
  },

  // Pattern avec un élément "ancre" qui revient (ABAC, ABACAD, etc.)
  alternation_with_anchor: {
    afterFirstError: [
      'Un élément revient très souvent ! Lequel ?',
      'Regarde : un élément est toujours là, entre les autres.',
      'Il y a un élément "pivot" qui revient régulièrement.',
    ],
    afterSecondError: [
      'L\'élément du début revient à chaque fois entre les autres !',
      'C\'est comme A-B-A-C-A-D... Le A revient toujours !',
    ],
    hintLevel1: ['Quel élément vois-tu le plus souvent ?'],
    hintLevel2: ['Un élément fait le "lien" entre tous les autres...'],
    hintLevel3: ['Il y a un élément ancre qui alterne avec les autres !'],
    parentDescription: 'Pattern avec élément ancre',
  },

  // Pattern miroir générique
  mirror: {
    afterFirstError: [
      'C\'est comme un miroir ! Regarde le milieu...',
      'Le début et la fin se ressemblent.',
    ],
    afterSecondError: [
      'Compare le début et la fin : c\'est pareil mais à l\'envers !',
    ],
    hintLevel1: ['Où est le centre de ce motif ?'],
    hintLevel2: ['Compare les deux côtés...'],
    hintLevel3: ['C\'est un miroir : le motif se reflète autour du centre !'],
    parentDescription: 'Pattern miroir',
  },

  // ========== FALLBACK ==========
  custom: {
    afterFirstError: [
      'Regarde bien le début de la suite. Tu vois ce qui se répète ?',
      'Cherche le motif qui revient toujours.',
    ],
    afterSecondError: [
      'Compare les premiers éléments avec ceux qui suivent.',
      'Le pattern se répète, trouve son rythme !',
    ],
    hintLevel1: ['Observe attentivement. Qu\'est-ce qui se répète ?'],
    hintLevel2: ['Les éléments qui brillent t\'aident à voir le pattern.'],
    hintLevel3: ['Le motif se répète dans un cycle régulier.'],
    parentDescription: 'Pattern personnalisé',
  },
};

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

/**
 * Analyser un cycle pour déterminer le type de pattern
 * Cela aide à donner des messages contextuels pour les patterns "custom"
 */
function analyzeCycleType(cycle: number[]): string {
  if (!cycle || cycle.length === 0) return 'custom';

  const uniqueElements = new Set(cycle);
  const numUnique = uniqueElements.size;
  const cycleStr = cycle.join(',');

  // Vérifier les patterns miroir
  const halfLen = Math.floor(cycle.length / 2);
  let isMirror = cycle.length > 2;
  for (let i = 0; i < halfLen && isMirror; i++) {
    if (cycle[i] !== cycle[cycle.length - 1 - i]) {
      isMirror = false;
    }
  }
  if (isMirror) return 'mirror';

  // Vérifier ABAB (alternance simple de 2)
  if (numUnique === 2 && cycle.length >= 2) {
    const isAlternating = cycle.every((val, i) => val === cycle[i % 2]);
    if (isAlternating) return 'ABAB';
  }

  // Vérifier AABB (paires)
  if (cycleStr.includes('0,0,1,1') || cycleStr.includes('1,1,0,0')) return 'AABB';

  // Vérifier AAB
  if (cycleStr === '0,0,1' || cycleStr.includes('0,0,1')) return 'AAB';

  // Vérifier ABC (cycle simple de 3)
  if (numUnique === 3 && cycle.length === 3) return 'ABC';

  // Pattern avec un élément qui revient régulièrement (comme ABAC, ABACAD)
  if (cycle[0] === 0 && cycle.filter(x => x === 0).length >= cycle.length / 2) {
    return 'alternation_with_anchor';
  }

  return 'custom';
}

/**
 * Obtenir la configuration d'indices pour un type de pattern
 */
export function getPatternHintConfig(patternType: PatternType): PatternHintConfig {
  return PATTERN_HINTS[patternType] || PATTERN_HINTS.custom;
}

/**
 * Obtenir la configuration d'indices en analysant aussi le cycle
 * Plus intelligent pour les patterns "custom"
 */
export function getPatternHintConfigSmart(pattern: PatternDefinition): PatternHintConfig {
  // D'abord essayer avec le type exact
  if (PATTERN_HINTS[pattern.type]) {
    return PATTERN_HINTS[pattern.type];
  }

  // Pour les patterns "custom", analyser le cycle
  if (pattern.type === 'custom' && pattern.cycle) {
    const analyzedType = analyzeCycleType(pattern.cycle);
    if (PATTERN_HINTS[analyzedType]) {
      return PATTERN_HINTS[analyzedType];
    }
  }

  // Vérifier les transformations
  if (pattern.transform === 'rotation') {
    return PATTERN_HINTS.rotation;
  }
  if (pattern.transform === 'size') {
    return PATTERN_HINTS.increasing;
  }
  if (pattern.transform === 'numeric') {
    // Essayer de trouver le bon type numérique
    if (pattern.type.includes('square')) return PATTERN_HINTS.numeric_square;
    if (pattern.type.includes('mult')) return PATTERN_HINTS.numeric_mult;
    if (pattern.type.includes('add')) return PATTERN_HINTS.numeric_add;
    if (pattern.type.includes('fib')) return PATTERN_HINTS.fibonacci;
    if (pattern.type.includes('prime')) return PATTERN_HINTS.prime;
  }

  return PATTERN_HINTS.custom;
}

/**
 * Obtenir un message après erreur basé sur le pattern et le nombre d'erreurs
 */
export function getErrorHintMessage(
  pattern: PatternDefinition,
  errorCount: number
): string {
  // Utiliser la version intelligente qui analyse le cycle
  const config = getPatternHintConfigSmart(pattern);

  if (errorCount <= 1) {
    const messages = config.afterFirstError;
    return messages[Math.floor(Math.random() * messages.length)];
  } else {
    const messages = config.afterSecondError;
    return messages[Math.floor(Math.random() * messages.length)];
  }
}

/**
 * Obtenir un message d'indice pour un niveau donné
 */
export function getHintLevelMessage(
  pattern: PatternDefinition,
  level: 1 | 2 | 3
): string {
  // Utiliser la version intelligente qui analyse le cycle
  const config = getPatternHintConfigSmart(pattern);

  let messages: string[];
  switch (level) {
    case 1:
      messages = config.hintLevel1;
      break;
    case 2:
      messages = config.hintLevel2;
      break;
    case 3:
      messages = config.hintLevel3;
      break;
  }

  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Générer un message contextuel pour un pattern spécifique
 * basé sur le cycle et la transformation
 */
export function generateContextualHint(
  pattern: PatternDefinition,
  missingIndex: number,
  sequenceLength: number
): string {
  const cycleLength = pattern.cycle.length;
  const positionInCycle = missingIndex % cycleLength;

  // Messages basés sur la position dans le cycle
  if (positionInCycle === 0) {
    return 'Le cycle recommence ici ! Quel est le premier élément du pattern ?';
  }

  if (missingIndex === sequenceLength - 1) {
    return 'C\'est le dernier élément. Suis le pattern depuis le début !';
  }

  // Message générique
  const config = getPatternHintConfig(pattern.type);
  return config.afterFirstError[0];
}

/**
 * Messages d'encouragement après avoir utilisé un indice
 */
export const ENCOURAGEMENT_AFTER_HINT = [
  'Prends ton temps pour bien regarder...',
  'Tu vas trouver, j\'en suis sûr !',
  'Observe bien ce que je t\'ai montré.',
  'La réponse est là, tu es proche !',
  'Continue de chercher, tu y es presque !',
];

/**
 * Messages de félicitation quand l'enfant trouve après une aide
 */
export const SUCCESS_AFTER_HINT = [
  'Bravo ! Tu as compris le pattern !',
  'Excellent ! L\'indice t\'a aidé à trouver.',
  'Super ! Tu sais maintenant comment ça marche.',
  'Bien joué ! Tu as trouvé la logique.',
];

/**
 * Obtenir un message d'encouragement aléatoire
 */
export function getRandomEncouragement(): string {
  return ENCOURAGEMENT_AFTER_HINT[
    Math.floor(Math.random() * ENCOURAGEMENT_AFTER_HINT.length)
  ];
}

export default {
  getPatternHintConfig,
  getErrorHintMessage,
  getHintLevelMessage,
  generateContextualHint,
  getRandomEncouragement,
};
