/**
 * Dialogues for Pixel the Fox mascot
 * All messages are encouraging and never give the answer directly
 */

import { DialogueContext, WorldTheme, PixelMood } from '../types';

export interface DialogueEntry {
  message: string;
  messageKey: string;
  mood: PixelMood;
  /** Weight for random selection (higher = more likely) */
  weight?: number;
}

// ============================================================================
// INTRO DIALOGUES
// ============================================================================

export const INTRO_DIALOGUES: DialogueEntry[] = [
  {
    message: 'Salut détective ! Choisis un monde et trouve les règles cachées dans chaque grille !',
    messageKey: 'pixel.intro.welcome',
    mood: 'excited',
    weight: 2,
  },
  {
    message: 'Bienvenue ! Je suis Pixel, ton guide. Prêt à découvrir des mystères ?',
    messageKey: 'pixel.intro.welcome2',
    mood: 'happy',
  },
  {
    message: 'Hey ! Chaque grille a un secret. À toi de le trouver !',
    messageKey: 'pixel.intro.welcome3',
    mood: 'curious',
  },
];

// ============================================================================
// PUZZLE START DIALOGUES (by world)
// ============================================================================

export const PUZZLE_START_DIALOGUES: Record<WorldTheme, DialogueEntry[]> = {
  forest: [
    {
      message: 'Observe bien les animaux de la forêt. Que font-ils de pareil ?',
      messageKey: 'pixel.forest.start1',
      mood: 'curious',
    },
    {
      message: 'Les créatures de la forêt suivent un pattern. Tu le vois ?',
      messageKey: 'pixel.forest.start2',
      mood: 'thinking',
    },
    {
      message: 'Regarde chaque ligne... puis chaque colonne. Qu\'est-ce qui change ?',
      messageKey: 'pixel.forest.start3',
      mood: 'neutral',
    },
  ],
  space: [
    {
      message: 'Dans l\'espace, tout suit des règles précises. Observe bien !',
      messageKey: 'pixel.space.start1',
      mood: 'thinking',
    },
    {
      message: 'Les étoiles ont un pattern. Prends ton temps pour le trouver.',
      messageKey: 'pixel.space.start2',
      mood: 'curious',
    },
    {
      message: 'Chaque ligne et colonne cache un secret spatial...',
      messageKey: 'pixel.space.start3',
      mood: 'neutral',
    },
  ],
  castle: [
    {
      message: 'Le château est plein de mystères. Observe les symboles magiques !',
      messageKey: 'pixel.castle.start1',
      mood: 'excited',
    },
    {
      message: 'Les objets magiques suivent une logique. Quelle est-elle ?',
      messageKey: 'pixel.castle.start2',
      mood: 'thinking',
    },
    {
      message: 'Regarde bien les motifs royaux. Il y a plusieurs règles ici !',
      messageKey: 'pixel.castle.start3',
      mood: 'curious',
    },
  ],
  art: [
    {
      message: 'L\'art abstrait a aussi ses règles. Cherche le pattern !',
      messageKey: 'pixel.art.start1',
      mood: 'curious',
    },
    {
      message: 'Ces formes artistiques se transforment. Comment ?',
      messageKey: 'pixel.art.start2',
      mood: 'thinking',
    },
    {
      message: 'Observe les couleurs ET les formes. Plusieurs règles se combinent !',
      messageKey: 'pixel.art.start3',
      mood: 'neutral',
    },
  ],
  mystery: [
    {
      message: 'La dimension mystère... Ici, tout est plus complexe !',
      messageKey: 'pixel.mystery.start1',
      mood: 'excited',
    },
    {
      message: 'Ces puzzles combinent PLUSIEURS règles. Tu es prêt ?',
      messageKey: 'pixel.mystery.start2',
      mood: 'thinking',
    },
    {
      message: 'Le défi ultime ! Observe bien chaque détail...',
      messageKey: 'pixel.mystery.start3',
      mood: 'curious',
    },
  ],
};

// ============================================================================
// HINT DIALOGUES (progressive)
// ============================================================================

export const HINT_DIALOGUES: Record<1 | 2 | 3 | 4, DialogueEntry[]> = {
  1: [
    {
      message: 'Regarde bien chaque LIGNE de la grille. Qu\'est-ce qui se répète ?',
      messageKey: 'pixel.hint1.row',
      mood: 'encouraging',
    },
    {
      message: 'Compare les cases d\'une même ligne. Tu vois un pattern ?',
      messageKey: 'pixel.hint1.compare',
      mood: 'thinking',
    },
  ],
  2: [
    {
      message: 'Maintenant observe les COLONNES. Même question : qu\'est-ce qui change ?',
      messageKey: 'pixel.hint2.column',
      mood: 'encouraging',
    },
    {
      message: 'De haut en bas, il y a aussi une règle. Cherche-la !',
      messageKey: 'pixel.hint2.vertical',
      mood: 'thinking',
    },
  ],
  3: [
    {
      message: 'Concentre-toi sur la dernière ligne. Quelles couleurs manquent ?',
      messageKey: 'pixel.hint3.lastRow',
      mood: 'encouraging',
    },
    {
      message: 'Regarde ce qui apparaît déjà dans la dernière ligne et colonne...',
      messageKey: 'pixel.hint3.elimination',
      mood: 'thinking',
    },
  ],
  4: [
    {
      message: 'La réponse doit compléter la ligne ET la colonne. Élimine les mauvais choix !',
      messageKey: 'pixel.hint4.final',
      mood: 'encouraging',
    },
    {
      message: 'Il ne reste qu\'une possibilité qui respecte TOUTES les règles...',
      messageKey: 'pixel.hint4.oneLeft',
      mood: 'thinking',
    },
  ],
};

// ============================================================================
// CORRECT ANSWER DIALOGUES
// ============================================================================

export const CORRECT_DIALOGUES: DialogueEntry[] = [
  {
    message: 'Bravo ! Tu as trouvé la règle !',
    messageKey: 'pixel.correct.bravo',
    mood: 'celebrating',
    weight: 2,
  },
  {
    message: 'Excellent ! Tu es un vrai détective !',
    messageKey: 'pixel.correct.excellent',
    mood: 'excited',
  },
  {
    message: 'Super ! Tu as compris le pattern !',
    messageKey: 'pixel.correct.super',
    mood: 'happy',
  },
  {
    message: 'Génial ! Continue comme ça !',
    messageKey: 'pixel.correct.genial',
    mood: 'celebrating',
  },
  {
    message: 'Parfait ! Tu deviens un expert !',
    messageKey: 'pixel.correct.parfait',
    mood: 'proud',
  },
  {
    message: 'Wow ! Bien joué !',
    messageKey: 'pixel.correct.wow',
    mood: 'excited',
  },
];

// ============================================================================
// INCORRECT ANSWER DIALOGUES (encouraging, never punitive)
// ============================================================================

export const INCORRECT_DIALOGUES: DialogueEntry[] = [
  {
    message: 'Hmm, pas tout à fait. Observe encore une fois !',
    messageKey: 'pixel.incorrect.tryAgain',
    mood: 'encouraging',
    weight: 2,
  },
  {
    message: 'Presque ! Regarde bien les lignes ET les colonnes.',
    messageKey: 'pixel.incorrect.almost',
    mood: 'thinking',
  },
  {
    message: 'Ce n\'est pas la bonne, mais tu y es presque !',
    messageKey: 'pixel.incorrect.close',
    mood: 'encouraging',
  },
  {
    message: 'Essaie encore ! Tu vas trouver.',
    messageKey: 'pixel.incorrect.keepTrying',
    mood: 'neutral',
  },
  {
    message: 'Pas celle-là. Prends ton temps pour observer.',
    messageKey: 'pixel.incorrect.takeTime',
    mood: 'thinking',
  },
];

// ============================================================================
// REVEAL DIALOGUES (after 3 failed attempts)
// ============================================================================

export const REVEAL_DIALOGUES: DialogueEntry[] = [
  {
    message: 'Voici la solution ! La règle était : chaque élément apparaît une fois par ligne et colonne.',
    messageKey: 'pixel.reveal.distribution',
    mood: 'neutral',
  },
  {
    message: 'C\'était difficile ! La prochaine fois, regarde d\'abord ce qui manque.',
    messageKey: 'pixel.reveal.tip',
    mood: 'encouraging',
  },
  {
    message: 'Tu vois ? La couleur change dans chaque ligne. On continue !',
    messageKey: 'pixel.reveal.colorChange',
    mood: 'neutral',
  },
];

// ============================================================================
// WORLD COMPLETE DIALOGUES
// ============================================================================

export const WORLD_COMPLETE_DIALOGUES: Record<WorldTheme, DialogueEntry[]> = {
  forest: [
    {
      message: 'INCROYABLE ! Tu as maîtrisé la Forêt Enchantée !',
      messageKey: 'pixel.complete.forest',
      mood: 'celebrating',
    },
  ],
  space: [
    {
      message: 'BRAVO ! La Station Spatiale n\'a plus de secrets pour toi !',
      messageKey: 'pixel.complete.space',
      mood: 'celebrating',
    },
  ],
  castle: [
    {
      message: 'FANTASTIQUE ! Tu es le nouveau roi du Château Magique !',
      messageKey: 'pixel.complete.castle',
      mood: 'celebrating',
    },
  ],
  art: [
    {
      message: 'MAGNIFIQUE ! Tu es un véritable artiste des patterns !',
      messageKey: 'pixel.complete.art',
      mood: 'celebrating',
    },
  ],
  mystery: [
    {
      message: 'LÉGENDAIRE ! Tu as conquis la Dimension Mystère ! Tu es un GÉNIE !',
      messageKey: 'pixel.complete.mystery',
      mood: 'celebrating',
    },
  ],
};

// ============================================================================
// BADGE EARNED DIALOGUES
// ============================================================================

export const BADGE_EARNED_DIALOGUES: DialogueEntry[] = [
  {
    message: 'Tu as gagné un nouveau badge ! Continue comme ça !',
    messageKey: 'pixel.badge.earned',
    mood: 'excited',
  },
  {
    message: 'Wow, un badge ! Tu deviens vraiment fort !',
    messageKey: 'pixel.badge.wow',
    mood: 'proud',
  },
];

// ============================================================================
// CARD UNLOCKED DIALOGUES
// ============================================================================

export const CARD_UNLOCKED_DIALOGUES: DialogueEntry[] = [
  {
    message: 'Tu as débloqué une nouvelle carte pour ta collection !',
    messageKey: 'pixel.card.unlocked',
    mood: 'excited',
  },
  {
    message: 'Super ! Une carte rare rejoint ta collection !',
    messageKey: 'pixel.card.rare',
    mood: 'celebrating',
  },
];

// ============================================================================
// ENCOURAGEMENT DIALOGUES (idle/waiting)
// ============================================================================

export const ENCOURAGEMENT_DIALOGUES: DialogueEntry[] = [
  {
    message: 'Prends ton temps, il n\'y a pas de chrono !',
    messageKey: 'pixel.encourage.noRush',
    mood: 'neutral',
  },
  {
    message: 'Tu peux y arriver, je crois en toi !',
    messageKey: 'pixel.encourage.believe',
    mood: 'encouraging',
  },
  {
    message: 'Observe bien... la solution est là !',
    messageKey: 'pixel.encourage.observe',
    mood: 'thinking',
  },
  {
    message: 'N\'hésite pas à demander un indice si tu bloques.',
    messageKey: 'pixel.encourage.hint',
    mood: 'neutral',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/** Get random dialogue from array, respecting weights */
export function getRandomDialogue(dialogues: DialogueEntry[]): DialogueEntry {
  // Calculate total weight
  const totalWeight = dialogues.reduce((sum, d) => sum + (d.weight || 1), 0);

  // Random value based on weight
  let random = Math.random() * totalWeight;

  for (const dialogue of dialogues) {
    random -= dialogue.weight || 1;
    if (random <= 0) {
      return dialogue;
    }
  }

  // Fallback
  return dialogues[0];
}

/** Get dialogue for specific context */
export function getDialogueForContext(
  context: DialogueContext,
  world?: WorldTheme,
  hintLevel?: 1 | 2 | 3 | 4
): DialogueEntry {
  switch (context) {
    case 'intro':
      return getRandomDialogue(INTRO_DIALOGUES);

    case 'puzzle_start':
      if (world && PUZZLE_START_DIALOGUES[world]) {
        return getRandomDialogue(PUZZLE_START_DIALOGUES[world]);
      }
      return getRandomDialogue(PUZZLE_START_DIALOGUES.forest);

    case 'hint_1':
    case 'hint_2':
    case 'hint_3':
    case 'hint_4':
      const level = parseInt(context.split('_')[1]) as 1 | 2 | 3 | 4;
      return getRandomDialogue(HINT_DIALOGUES[level]);

    case 'correct':
      return getRandomDialogue(CORRECT_DIALOGUES);

    case 'incorrect':
      return getRandomDialogue(INCORRECT_DIALOGUES);

    case 'reveal':
      return getRandomDialogue(REVEAL_DIALOGUES);

    case 'world_complete':
      if (world && WORLD_COMPLETE_DIALOGUES[world]) {
        return getRandomDialogue(WORLD_COMPLETE_DIALOGUES[world]);
      }
      return getRandomDialogue(WORLD_COMPLETE_DIALOGUES.forest);

    case 'badge_earned':
      return getRandomDialogue(BADGE_EARNED_DIALOGUES);

    case 'card_unlocked':
      return getRandomDialogue(CARD_UNLOCKED_DIALOGUES);

    case 'encouragement':
      return getRandomDialogue(ENCOURAGEMENT_DIALOGUES);

    default:
      return getRandomDialogue(ENCOURAGEMENT_DIALOGUES);
  }
}
