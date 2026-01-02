/**
 * Parent Guide Data for Matrices Magiques
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

export const matricesGameData: GameObjectiveData = {
  objective: "Identifier le motif manquant dans une matrice en analysant les transformations des formes.",
  optimalSolution: "Observation des patterns et déduction logique",
  rules: [
    "Observer la matrice ligne par ligne et colonne par colonne",
    "Identifier les transformations (rotation, couleur, taille)",
    "Choisir l'élément qui complète le pattern",
  ],
  strategy: "Chercher d'abord les règles simples (couleur, forme) puis les plus complexes (rotation, combinaison).",
  tip: "Compare chaque ligne ET chaque colonne pour trouver la règle !",
};

export const matricesAppBehavior: AppBehaviorData = {
  does: [
    "Présente des matrices de difficulté progressive",
    "Propose des indices visuels progressifs",
    "Utilise des thèmes ludiques et colorés",
    "Célèbre chaque bonne réponse",
    "Permet plusieurs tentatives",
  ],
  doesnt: [
    "Pas de limite de temps stressante",
    "Pas de pénalité définitive pour erreurs",
    "Ne montre jamais la réponse directement",
    "Pas de comparaison avec d'autres joueurs",
  ],
};

// =============================================================================
// TAB 2: COMPÉTENCES
// =============================================================================

export const matricesCompetences: CompetenceData[] = [
  {
    id: 'reasoning',
    icon: '🧠',
    title: 'Raisonnement analogique',
    description: 'Identifier les relations entre éléments',
    stars: 5,
    iconBgColor: 'rgba(91, 141, 238, 0.15)',
  },
  {
    id: 'pattern',
    icon: '🔄',
    title: 'Reconnaissance de patterns',
    description: 'Détecter les motifs qui se répètent',
    stars: 5,
    iconBgColor: 'rgba(224, 86, 253, 0.15)',
  },
  {
    id: 'spatial',
    icon: '📐',
    title: 'Vision spatiale',
    description: 'Visualiser les rotations et transformations',
    stars: 4,
    iconBgColor: 'rgba(123, 199, 77, 0.15)',
  },
  {
    id: 'attention',
    icon: '👁️',
    title: 'Attention aux détails',
    description: 'Observer les différences subtiles',
    stars: 4,
    iconBgColor: 'rgba(255, 182, 193, 0.15)',
  },
  {
    id: 'abstraction',
    icon: '💭',
    title: 'Pensée abstraite',
    description: 'Comprendre les règles implicites',
    stars: 4,
    iconBgColor: 'rgba(255, 215, 0, 0.15)',
  },
  {
    id: 'flexibility',
    icon: '🔀',
    title: 'Flexibilité cognitive',
    description: 'Changer de stratégie si nécessaire',
    stars: 3,
    iconBgColor: 'rgba(139, 115, 85, 0.15)',
  },
];

export const matricesScienceData: ScienceData = {
  text: "Les matrices progressives mesurent l'intelligence fluide, la capacité à résoudre des problèmes nouveaux (Raven, 1938). L'entraînement sur ce type de tâches améliore les capacités de raisonnement général (Jaeggi et al., 2008).",
};

// =============================================================================
// TAB 3: ACCOMPAGNEMENT
// =============================================================================

export const matricesAdvices: AdviceData[] = [
  {
    situation: "Votre enfant répond au hasard",
    response: "\"Regarde bien chaque ligne. Qu'est-ce qui change ?\"",
  },
  {
    situation: "Il ne voit pas le pattern",
    response: "\"Essayons ensemble : compare ces deux cases. Pareil ou différent ?\"",
  },
  {
    situation: "Il se trompe souvent",
    response: "\"Pas grave ! Chaque erreur nous apprend quelque chose. Qu'est-ce que tu as remarqué ?\"",
  },
  {
    situation: "Il réussit facilement",
    response: "\"Bravo ! Tu peux m'expliquer comment tu as trouvé ?\"",
  },
  {
    situation: "Il veut abandonner",
    response: "\"Prenons un indice ensemble. Ça va nous aider à comprendre.\"",
  },
];

export const matricesWarningText = "Ces exercices demandent une vraie concentration. Si l'enfant montre des signes de fatigue, faites une pause.";

export const matricesTeamMessage = "\"Les matrices développent une forme d'intelligence précieuse : la capacité à voir des patterns invisibles aux autres. C'est une compétence qui servira dans tous les domaines de la vie. Encouragez la réflexion, pas seulement les bonnes réponses !\"";

// =============================================================================
// TAB 4: QUESTIONS À POSER
// =============================================================================

export const matricesQuestionsDuring: QuestionData[] = [
  { text: "\"Qu'est-ce qui change entre cette case et celle-là ?\"" },
  { text: "\"Tu vois une règle dans cette ligne ?\"" },
  { text: "\"Et si tu regardais les colonnes ?\"" },
];

export const matricesQuestionsAfter: QuestionData[] = [
  { text: "\"C'était quoi la règle de ce puzzle ?\"" },
  { text: "\"Quel puzzle était le plus difficile ?\"" },
  { text: "\"Tu as trouvé une astuce pour les résoudre ?\"" },
];

export const matricesQuestionsWarning = "Demandez à l'enfant de verbaliser son raisonnement. Cela renforce l'apprentissage.";

// =============================================================================
// TAB 5: VIE QUOTIDIENNE
// =============================================================================

export const matricesDailyActivities: DailyActivityData[] = [
  {
    icon: '🧩',
    title: 'Sudoku simplifié',
    description: 'Grilles de sudoku pour enfants',
  },
  {
    icon: '🔍',
    title: 'Cherche et trouve',
    description: 'Identifier des patterns dans des images',
  },
  {
    icon: '🎨',
    title: 'Frises décoratives',
    description: 'Continuer des motifs répétitifs',
  },
  {
    icon: '🧱',
    title: 'Constructions symétriques',
    description: 'Reproduire des patterns avec des blocs',
  },
];

export const matricesTransferPhrases: string[] = [
  "\"Tu vois le pattern sur ce tissu ? Quel serait le prochain motif ?\"",
  "\"Regarde cette suite de formes. Qu'est-ce qui vient après ?\"",
];

export const matricesResources: ResourceData[] = [
  {
    type: 'Livre',
    icon: '📖',
    title: 'Matrices progressives',
    author: 'Raven',
  },
  {
    type: 'Jeu',
    icon: '🎮',
    title: 'IQ Puzzler Pro',
    author: 'SmartGames',
  },
  {
    type: 'App',
    icon: '📱',
    title: 'Lumosity',
    author: 'Lumos Labs',
  },
  {
    type: 'Livre',
    icon: '📚',
    title: 'Entraînement cérébral',
    author: 'Larousse',
  },
];

// =============================================================================
// TAB 6: PROGRESSION
// =============================================================================

export const matricesBadges: BadgeData[] = [
  {
    id: 'observateur',
    icon: '👁️',
    title: 'Observateur',
    description: 'Résout ses premières matrices',
    earned: true,
  },
  {
    id: 'analyste',
    icon: '🔍',
    title: 'Analyste',
    description: 'Maîtrise les transformations simples',
    earned: false,
  },
  {
    id: 'genie',
    icon: '🧠',
    title: 'Génie',
    description: 'Résout les matrices complexes',
    earned: false,
  },
];

export const matricesAgeExpectations: AgeExpectationData[] = [
  { age: 5, expectation: 'Matrices 2x2 avec 1 transformation' },
  { age: 6, expectation: 'Matrices 2x2 avec 2 transformations' },
  { age: 7, expectation: 'Matrices 3x3 simples' },
  { age: 8, expectation: 'Matrices 3x3 avec rotations' },
  { age: 9, expectation: 'Matrices 3x3 complexes' },
];

export const matricesSettings: SettingData[] = [
  { id: 'showHints', label: 'Indices visuels disponibles', enabled: true },
  { id: 'colorblindMode', label: 'Mode daltonien', enabled: false },
  { id: 'extendedTime', label: 'Temps étendu', enabled: false },
  { id: 'sessionLimit', label: 'Plafond session (15 min)', enabled: true },
];

// =============================================================================
// COMPLETE DATA EXPORT
// =============================================================================

export const matricesParentGuideData = {
  activityName: 'Matrices Magiques',
  activityEmoji: '🔮',
  gameData: matricesGameData,
  appBehavior: matricesAppBehavior,
  competences: matricesCompetences,
  scienceData: matricesScienceData,
  advices: matricesAdvices,
  warningText: matricesWarningText,
  teamMessage: matricesTeamMessage,
  questionsDuring: matricesQuestionsDuring,
  questionsAfter: matricesQuestionsAfter,
  questionsWarning: matricesQuestionsWarning,
  dailyActivities: matricesDailyActivities,
  transferPhrases: matricesTransferPhrases,
  resources: matricesResources,
  badges: matricesBadges,
  ageExpectations: matricesAgeExpectations,
  settings: matricesSettings,
};
