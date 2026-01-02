/**
 * Parent Guide Data for Conteur Curieux
 * Contains all the pedagogical content for the ParentDrawer component
 */

import type {
  GameObjectiveData,
  AppBehaviorData,
  CompetenceData,
  ScienceData,
  AdviceData,
  QuestionData,
  DailyActivityData,
  ResourceData,
  BadgeData,
  AgeExpectationData,
  SettingData,
} from '../../../components/parent/ParentDrawer';

// =============================================================================
// TAB 1: OBJECTIF & RÈGLES
// =============================================================================

export const conteurGameData: GameObjectiveData = {
  objective: "Écouter une histoire et répondre à des questions pour développer la compréhension orale et le vocabulaire.",
  optimalSolution: "Écoute attentive et réponses réfléchies",
  rules: [
    "Écouter l'histoire jusqu'au bout",
    "Répondre aux questions posées",
    "Utiliser ses propres mots pour reformuler",
  ],
  strategy: "Se concentrer sur les personnages, les lieux et les événements clés de l'histoire.",
  tip: "Écoute bien, chaque détail peut être important !",
};

export const conteurAppBehavior: AppBehaviorData = {
  does: [
    "Lit les histoires avec une voix expressive",
    "Pose des questions adaptées à l'âge",
    "Encourage la reformulation avec ses propres mots",
    "Félicite l'effort de compréhension",
    "Propose des histoires variées et captivantes",
  ],
  doesnt: [
    "Pas de pression de temps",
    "Pas de pénalité pour les erreurs",
    "Jamais de jugement sur les réponses",
    "Pas de vocabulaire trop complexe",
  ],
};

// =============================================================================
// TAB 2: COMPÉTENCES
// =============================================================================

export const conteurCompetences: CompetenceData[] = [
  {
    id: 'comprehension',
    icon: '📖',
    title: 'Compréhension orale',
    description: 'Comprendre le sens d\'une histoire entendue',
    stars: 5,
    iconBgColor: 'rgba(91, 141, 238, 0.15)',
  },
  {
    id: 'vocabulary',
    icon: '📚',
    title: 'Vocabulaire',
    description: 'Enrichir son lexique avec de nouveaux mots',
    stars: 5,
    iconBgColor: 'rgba(123, 199, 77, 0.15)',
  },
  {
    id: 'inference',
    icon: '🔍',
    title: 'Inférence',
    description: 'Déduire des informations non explicites',
    stars: 4,
    iconBgColor: 'rgba(224, 86, 253, 0.15)',
  },
  {
    id: 'memory',
    icon: '🧠',
    title: 'Mémoire narrative',
    description: 'Retenir les éléments clés de l\'histoire',
    stars: 4,
    iconBgColor: 'rgba(255, 182, 193, 0.15)',
  },
  {
    id: 'expression',
    icon: '💬',
    title: 'Expression orale',
    description: 'Reformuler avec ses propres mots',
    stars: 4,
    iconBgColor: 'rgba(255, 215, 0, 0.15)',
  },
  {
    id: 'attention',
    icon: '👂',
    title: 'Écoute active',
    description: 'Se concentrer sur le récit',
    stars: 3,
    iconBgColor: 'rgba(139, 115, 85, 0.15)',
  },
];

export const conteurScienceData: ScienceData = {
  text: "L'exposition aux histoires développe le vocabulaire et la compréhension textuelle (Mol & Bus, 2011). La lecture dialogique améliore les compétences langagières des enfants (Whitehurst et al., 1988). Les questions ouvertes stimulent la pensée critique et l'expression.",
};

// =============================================================================
// TAB 3: ACCOMPAGNEMENT
// =============================================================================

export const conteurAdvices: AdviceData[] = [
  {
    situation: "Votre enfant n'écoute pas attentivement",
    response: "\"Regardons ensemble les images. Qui vois-tu sur cette page ?\"",
  },
  {
    situation: "Il ne comprend pas un mot",
    response: "\"C'est un mot nouveau ! Ça veut dire... Tu as déjà vu ça ?\"",
  },
  {
    situation: "Il répond à côté de la question",
    response: "\"Intéressant ! Et dans l'histoire, qu'est-ce qui s'est passé ?\"",
  },
  {
    situation: "Il réussit à reformuler",
    response: "\"Super ! Tu as bien compris l'histoire. Tu veux la raconter à quelqu'un ?\"",
  },
  {
    situation: "Il veut réécouter",
    response: "\"Bonne idée ! On découvre souvent des détails à la deuxième écoute.\"",
  },
];

export const conteurWarningText = "Laissez l'enfant s'exprimer avec ses propres mots. Valorisez ses tentatives de reformulation plutôt que de corriger chaque erreur.";

export const conteurTeamMessage = "\"Les histoires sont la porte d'entrée vers la lecture. En développant la compréhension orale et le plaisir d'écouter, votre enfant construit les bases essentielles pour devenir un bon lecteur. Partagez ce moment de plaisir !\"";

// =============================================================================
// TAB 4: QUESTIONS À POSER
// =============================================================================

export const conteurQuestionsDuring: QuestionData[] = [
  { text: "\"Qui est le personnage principal ?\"" },
  { text: "\"Où se passe l'histoire ?\"" },
  { text: "\"Que va-t-il se passer d'après toi ?\"" },
];

export const conteurQuestionsAfter: QuestionData[] = [
  { text: "\"Peux-tu me raconter l'histoire ?\"" },
  { text: "\"Quel est ton passage préféré ?\"" },
  { text: "\"Comment s'est terminée l'histoire ?\"" },
];

export const conteurQuestionsWarning = "Posez des questions ouvertes qui invitent à développer la réponse.";

// =============================================================================
// TAB 5: VIE QUOTIDIENNE
// =============================================================================

export const conteurDailyActivities: DailyActivityData[] = [
  {
    icon: '📖',
    title: 'Lecture du soir',
    description: 'Lire une histoire avant le coucher',
  },
  {
    icon: '🎤',
    title: 'Raconter sa journée',
    description: 'Demander à l\'enfant de raconter ce qu\'il a fait',
  },
  {
    icon: '🎭',
    title: 'Jouer les histoires',
    description: 'Rejouer l\'histoire avec des jouets ou en mime',
  },
  {
    icon: '🖼️',
    title: 'Inventer des histoires',
    description: 'Créer des histoires à partir d\'images',
  },
];

export const conteurTransferPhrases: string[] = [
  "\"Raconte-moi ce qui s'est passé à l'école aujourd'hui.\"",
  "\"Si tu devais changer la fin de l'histoire, que ferais-tu ?\"",
];

export const conteurResources: ResourceData[] = [
  {
    type: 'Livre',
    icon: '📖',
    title: 'Histoires du soir',
    author: 'Collection Père Castor',
  },
  {
    type: 'App',
    icon: '📱',
    title: 'Lunii',
    author: 'Fabrique à histoires',
  },
  {
    type: 'Podcast',
    icon: '🎧',
    title: 'Une histoire et Oli',
    author: 'France Inter',
  },
  {
    type: 'Livre',
    icon: '📚',
    title: 'Les Contes de la rue Broca',
    author: 'Pierre Gripari',
  },
];

// =============================================================================
// TAB 6: PROGRESSION
// =============================================================================

export const conteurBadges: BadgeData[] = [
  {
    id: 'ecouteur',
    icon: '👂',
    title: 'Bon écouteur',
    description: 'Écoute les histoires jusqu\'au bout',
    earned: true,
  },
  {
    id: 'conteur',
    icon: '🎤',
    title: 'Petit conteur',
    description: 'Sait raconter l\'histoire avec ses mots',
    earned: false,
  },
  {
    id: 'curieux',
    icon: '🔍',
    title: 'Curieux',
    description: 'Pose des questions sur l\'histoire',
    earned: true,
  },
];

export const conteurAgeExpectations: AgeExpectationData[] = [
  { age: 5, expectation: 'Histoires simples avec répétitions' },
  { age: 6, expectation: 'Comprend les personnages principaux' },
  { age: 7, expectation: 'Suit une intrigue à plusieurs épisodes' },
  { age: 8, expectation: 'Fait des inférences sur les motivations' },
  { age: 9, expectation: 'Analyse critique des personnages' },
];

export const conteurSettings: SettingData[] = [
  { id: 'autoPlay', label: 'Lecture automatique', enabled: true },
  { id: 'voiceSpeed', label: 'Vitesse normale', enabled: true },
  { id: 'showImages', label: 'Afficher les illustrations', enabled: true },
  { id: 'sessionLimit', label: 'Plafond session (15 min)', enabled: true },
];

// =============================================================================
// COMPLETE DATA EXPORT
// =============================================================================

export const conteurParentGuideData = {
  activityName: 'Le Conteur Curieux',
  activityEmoji: '📖',
  gameData: conteurGameData,
  appBehavior: conteurAppBehavior,
  competences: conteurCompetences,
  scienceData: conteurScienceData,
  advices: conteurAdvices,
  warningText: conteurWarningText,
  teamMessage: conteurTeamMessage,
  questionsDuring: conteurQuestionsDuring,
  questionsAfter: conteurQuestionsAfter,
  questionsWarning: conteurQuestionsWarning,
  dailyActivities: conteurDailyActivities,
  transferPhrases: conteurTransferPhrases,
  resources: conteurResources,
  badges: conteurBadges,
  ageExpectations: conteurAgeExpectations,
  settings: conteurSettings,
};
