/**
 * Conteur Curieux Assistant Scripts
 *
 * Dialogues de l'assistant IA pour le jeu de lecture
 * Mascotte: Plume le Hibou Conteur 🦉
 */

// Type local pour les scripts d'assistant
interface AssistantMessage {
  text: string;
  duration: number;
}

interface AssistantScript {
  id: string;
  trigger: string;
  messages: AssistantMessage[];
  conditions: {
    maxTriggers?: number;
    maxHintsUsed?: number;
  };
  priority: number;
}

// ============================================================================
// SCRIPTS
// ============================================================================

export const conteurAssistantScripts: AssistantScript[] = [
  // ===== DÉMARRAGE =====
  {
    id: 'conteur-start-1',
    trigger: 'game_start',
    messages: [
      {
        text: 'Bienvenue dans ma bibliothèque ! 🦉',
        duration: 2500,
      },
      {
        text: 'Je suis Plume le Hibou Conteur. J\'ai une histoire passionnante à te raconter !',
        duration: 3500,
      },
      {
        text: 'Lis bien attentivement, je te poserai des questions ensuite.',
        duration: 3000,
      },
    ],
    conditions: {
      maxTriggers: 1,
    },
    priority: 100,
  },

  // ===== DÉBUT LECTURE =====
  {
    id: 'conteur-reading-start-1',
    trigger: 'reading_start',
    messages: [
      {
        text: 'C\'est parti pour la lecture ! 📖',
        duration: 2000,
      },
      {
        text: 'Prends ton temps et imagine la scène dans ta tête.',
        duration: 2500,
      },
    ],
    conditions: {
      maxTriggers: 1,
    },
    priority: 90,
  },

  // ===== FIN LECTURE =====
  {
    id: 'conteur-reading-end-1',
    trigger: 'reading_end',
    messages: [
      {
        text: 'Tu as fini de lire ! Super ! 🌟',
        duration: 2000,
      },
      {
        text: 'Maintenant, voyons ce que tu as retenu...',
        duration: 2500,
      },
    ],
    conditions: {
      maxTriggers: 1,
    },
    priority: 85,
  },

  // ===== DÉBUT QUESTIONS =====
  {
    id: 'conteur-questions-start-1',
    trigger: 'questions_start',
    messages: [
      {
        text: 'C\'est l\'heure des questions ! 🎯',
        duration: 2000,
      },
      {
        text: 'Tu peux toujours relire l\'histoire si tu as besoin.',
        duration: 2500,
      },
    ],
    conditions: {
      maxTriggers: 1,
    },
    priority: 80,
  },

  // ===== BONNE RÉPONSE =====
  {
    id: 'conteur-correct-1',
    trigger: 'correct_answer',
    messages: [
      {
        text: 'Bravo ! C\'est la bonne réponse ! 🎉',
        duration: 2000,
      },
    ],
    conditions: {},
    priority: 70,
  },
  {
    id: 'conteur-correct-2',
    trigger: 'correct_answer',
    messages: [
      {
        text: 'Excellent ! Tu as bien lu ! ⭐',
        duration: 2000,
      },
    ],
    conditions: {},
    priority: 65,
  },
  {
    id: 'conteur-correct-3',
    trigger: 'correct_answer',
    messages: [
      {
        text: 'Super ! Tu es un très bon lecteur ! 📚',
        duration: 2000,
      },
    ],
    conditions: {},
    priority: 60,
  },

  // ===== MAUVAISE RÉPONSE =====
  {
    id: 'conteur-wrong-1',
    trigger: 'wrong_answer',
    messages: [
      {
        text: 'Hmm, ce n\'est pas tout à fait ça... 🤔',
        duration: 2000,
      },
      {
        text: 'Pas grave, continue ! Tu vas y arriver.',
        duration: 2000,
      },
    ],
    conditions: {},
    priority: 70,
  },
  {
    id: 'conteur-wrong-2',
    trigger: 'wrong_answer',
    messages: [
      {
        text: 'Oups ! La réponse était différente.',
        duration: 2000,
      },
      {
        text: 'Ne t\'inquiète pas, l\'important c\'est d\'apprendre ! 💪',
        duration: 2500,
      },
    ],
    conditions: {},
    priority: 65,
  },

  // ===== DEMANDE D'INDICE =====
  {
    id: 'conteur-hint-1',
    trigger: 'hint_requested',
    messages: [
      {
        text: 'Voici un petit indice pour t\'aider ! 💡',
        duration: 2000,
      },
    ],
    conditions: {},
    priority: 80,
  },
  {
    id: 'conteur-hint-2',
    trigger: 'hint_requested',
    messages: [
      {
        text: 'Regarde bien, je te donne un coup de pouce ! 🤝',
        duration: 2500,
      },
    ],
    conditions: {},
    priority: 75,
  },

  // ===== VICTOIRE =====
  {
    id: 'conteur-victory-1',
    trigger: 'victory',
    messages: [
      {
        text: 'FÉLICITATIONS ! 🎉📚',
        duration: 2500,
      },
      {
        text: 'Tu as très bien compris l\'histoire ! Je suis fier de toi !',
        duration: 3000,
      },
    ],
    conditions: {},
    priority: 100,
  },
  {
    id: 'conteur-victory-perfect',
    trigger: 'victory',
    messages: [
      {
        text: 'PARFAIT ! Toutes les réponses sont correctes ! 🏆',
        duration: 2500,
      },
      {
        text: 'Tu es un vrai champion de la lecture !',
        duration: 2500,
      },
    ],
    conditions: {
      maxHintsUsed: 0,
    },
    priority: 110,
  },

  // ===== BESOIN D'AMÉLIORATION =====
  {
    id: 'conteur-improve-1',
    trigger: 'needs_improvement',
    messages: [
      {
        text: 'Continue à t\'entraîner ! 💪',
        duration: 2000,
      },
      {
        text: 'Chaque lecture te rend plus fort. Essaie encore !',
        duration: 2500,
      },
    ],
    conditions: {},
    priority: 90,
  },
];

export default conteurAssistantScripts;
