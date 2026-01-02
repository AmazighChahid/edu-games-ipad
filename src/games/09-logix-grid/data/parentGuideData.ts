/**
 * Parent Guide Data for Logix Grid
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

export const logixGridGameData: GameObjectiveData = {
  objective: "Compléter une grille logique en déduisant les positions des éléments à partir d'indices.",
  optimalSolution: "Déduction par élimination et recoupement des indices",
  rules: [
    "Lire attentivement chaque indice",
    "Placer un élément par case",
    "Utiliser l'élimination pour avancer",
  ],
  strategy: "Commencer par les indices les plus restrictifs, puis procéder par élimination.",
  tip: "Note ce que tu sais ET ce qui est impossible !",
};

export const logixGridAppBehavior: AppBehaviorData = {
  does: [
    "Présente des grilles de difficulté progressive",
    "Fournit des indices clairs et lisibles",
    "Permet de marquer les cases impossibles",
    "Valide au fur et à mesure les bonnes réponses",
    "Propose des indices supplémentaires si bloqué",
  ],
  doesnt: [
    "Pas de limite de temps stressante",
    "Pas de pénalité pour les essais",
    "Ne révèle jamais la solution complète",
    "Pas de distractions visuelles",
  ],
};

// =============================================================================
// TAB 2: COMPÉTENCES
// =============================================================================

export const logixGridCompetences: CompetenceData[] = [
  {
    id: 'logic',
    icon: '🧠',
    title: 'Raisonnement logique',
    description: 'Déduire des informations à partir d\'indices',
    stars: 5,
    iconBgColor: 'rgba(91, 141, 238, 0.15)',
  },
  {
    id: 'elimination',
    icon: '❌',
    title: 'Élimination',
    description: 'Identifier ce qui est impossible',
    stars: 5,
    iconBgColor: 'rgba(224, 86, 253, 0.15)',
  },
  {
    id: 'reading',
    icon: '📖',
    title: 'Compréhension',
    description: 'Interpréter correctement les indices',
    stars: 4,
    iconBgColor: 'rgba(123, 199, 77, 0.15)',
  },
  {
    id: 'organization',
    icon: '📊',
    title: 'Organisation',
    description: 'Structurer l\'information dans la grille',
    stars: 4,
    iconBgColor: 'rgba(255, 182, 193, 0.15)',
  },
  {
    id: 'persistence',
    icon: '💪',
    title: 'Persévérance',
    description: 'Ne pas abandonner face à la complexité',
    stars: 3,
    iconBgColor: 'rgba(255, 215, 0, 0.15)',
  },
  {
    id: 'attention',
    icon: '👁️',
    title: 'Attention aux détails',
    description: 'Ne pas manquer d\'information cruciale',
    stars: 4,
    iconBgColor: 'rgba(139, 115, 85, 0.15)',
  },
];

export const logixGridScienceData: ScienceData = {
  text: "Les puzzles logiques développent le raisonnement déductif et la pensée critique (Lau & Chan, 2006). L'entraînement au raisonnement logique améliore les performances en mathématiques et en résolution de problèmes.",
};

// =============================================================================
// TAB 3: ACCOMPAGNEMENT
// =============================================================================

export const logixGridAdvices: AdviceData[] = [
  {
    situation: "Votre enfant ne comprend pas un indice",
    response: "\"Relisons ensemble. Qu'est-ce que ça veut dire exactement ?\"",
  },
  {
    situation: "Il se trompe souvent",
    response: "\"Vérifions les indices un par un. Lequel te dit quelque chose de sûr ?\"",
  },
  {
    situation: "Il est bloqué",
    response: "\"Qu'est-ce qu'on sait pour sûr ? Et qu'est-ce qui est impossible ?\"",
  },
  {
    situation: "Il réussit facilement",
    response: "\"Excellent raisonnement ! Tu peux expliquer comment tu as trouvé ?\"",
  },
  {
    situation: "Il abandonne",
    response: "\"On recommence ensemble ? Je vais t'aider avec le premier indice.\"",
  },
];

export const logixGridWarningText = "Accompagnez l'enfant dans la lecture des indices. Guidez son raisonnement sans donner les réponses.";

export const logixGridTeamMessage = "\"Les grilles logiques sont un excellent entraînement pour le cerveau ! Elles développent une pensée structurée et méthodique qui servira toute la vie. Félicitez les bonnes déductions, pas seulement les solutions trouvées !\"";

// =============================================================================
// TAB 4: QUESTIONS À POSER
// =============================================================================

export const logixGridQuestionsDuring: QuestionData[] = [
  { text: "\"Que nous dit cet indice ?\"" },
  { text: "\"Où est-ce que ça NE peut PAS être ?\"" },
  { text: "\"Quelles cases peux-tu éliminer ?\"" },
];

export const logixGridQuestionsAfter: QuestionData[] = [
  { text: "\"Quel indice t'a le plus aidé ?\"" },
  { text: "\"C'était quoi le plus difficile ?\"" },
  { text: "\"Tu pourrais créer ta propre énigme ?\"" },
];

export const logixGridQuestionsWarning = "Encouragez l'enfant à verbaliser son raisonnement étape par étape.";

// =============================================================================
// TAB 5: VIE QUOTIDIENNE
// =============================================================================

export const logixGridDailyActivities: DailyActivityData[] = [
  {
    icon: '🔍',
    title: 'Jeu de Cluedo',
    description: 'Deviner par élimination',
  },
  {
    icon: '📰',
    title: 'Mots croisés',
    description: 'Remplir une grille avec des indices',
  },
  {
    icon: '🎲',
    title: 'Sudoku adapté',
    description: 'Grilles simplifiées pour enfants',
  },
  {
    icon: '🧩',
    title: 'Énigmes familiales',
    description: 'Poser des devinettes logiques',
  },
];

export const logixGridTransferPhrases: string[] = [
  "\"Si ce n'est pas A et pas B, qu'est-ce qui reste ?\"",
  "\"Comment pourrais-tu vérifier cette information ?\"",
];

export const logixGridResources: ResourceData[] = [
  {
    type: 'Livre',
    icon: '📖',
    title: 'Énigmes logiques pour enfants',
    author: 'Marabout',
  },
  {
    type: 'Jeu',
    icon: '🎮',
    title: 'Mastermind Junior',
    author: 'Hasbro',
  },
  {
    type: 'App',
    icon: '📱',
    title: 'Logic Puzzles',
    author: 'Egghead Games',
  },
  {
    type: 'Livre',
    icon: '📚',
    title: 'Casse-têtes malins',
    author: 'Usborne',
  },
];

// =============================================================================
// TAB 6: PROGRESSION
// =============================================================================

export const logixGridBadges: BadgeData[] = [
  {
    id: 'detective',
    icon: '🔍',
    title: 'Petit détective',
    description: 'Résout ses premières grilles',
    earned: true,
  },
  {
    id: 'logicien',
    icon: '🧠',
    title: 'Logicien',
    description: 'Maîtrise l\'élimination',
    earned: false,
  },
  {
    id: 'sherlock',
    icon: '🎩',
    title: 'Sherlock',
    description: 'Résout les grilles difficiles',
    earned: false,
  },
];

export const logixGridAgeExpectations: AgeExpectationData[] = [
  { age: 6, expectation: 'Grilles 2x2 avec aide' },
  { age: 7, expectation: 'Grilles 2x3 simples' },
  { age: 8, expectation: 'Grilles 3x3 avec indices clairs' },
  { age: 9, expectation: 'Grilles 3x4 avec indices complexes' },
  { age: 10, expectation: 'Grilles 4x4 avancées' },
];

export const logixGridSettings: SettingData[] = [
  { id: 'showEliminations', label: 'Afficher les éliminations', enabled: true },
  { id: 'autoValidate', label: 'Validation automatique', enabled: true },
  { id: 'hintsEnabled', label: 'Indices disponibles', enabled: true },
  { id: 'sessionLimit', label: 'Plafond session (20 min)', enabled: true },
];

// =============================================================================
// COMPLETE DATA EXPORT
// =============================================================================

export const logixGridParentGuideData = {
  activityName: 'Logix Grid',
  activityEmoji: '🔢',
  gameData: logixGridGameData,
  appBehavior: logixGridAppBehavior,
  competences: logixGridCompetences,
  scienceData: logixGridScienceData,
  advices: logixGridAdvices,
  warningText: logixGridWarningText,
  teamMessage: logixGridTeamMessage,
  questionsDuring: logixGridQuestionsDuring,
  questionsAfter: logixGridQuestionsAfter,
  questionsWarning: logixGridQuestionsWarning,
  dailyActivities: logixGridDailyActivities,
  transferPhrases: logixGridTransferPhrases,
  resources: logixGridResources,
  badges: logixGridBadges,
  ageExpectations: logixGridAgeExpectations,
  settings: logixGridSettings,
};
