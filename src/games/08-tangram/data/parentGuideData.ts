/**
 * Parent Guide Data for Tangram
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

export const tangramGameData: GameObjectiveData = {
  objective: "Reconstituer une figure en assemblant les 7 pièces du tangram dans le bon agencement.",
  optimalSolution: "Rotation et positionnement précis de chaque pièce",
  rules: [
    "Utiliser toutes les 7 pièces",
    "Les pièces ne doivent pas se chevaucher",
    "Faire correspondre les pièces à la silhouette",
  ],
  strategy: "Commencer par les grandes pièces, puis ajuster avec les petites.",
  tip: "Tourne les pièces dans tous les sens avant de les poser !",
};

export const tangramAppBehavior: AppBehaviorData = {
  does: [
    "Propose des silhouettes de difficulté progressive",
    "Permet de tourner et déplacer librement les pièces",
    "Valide automatiquement quand le puzzle est correct",
    "Propose des indices visuels sur demande",
    "Célèbre chaque réussite avec des animations",
  ],
  doesnt: [
    "Pas de limite de temps",
    "Pas de pénalité pour les erreurs",
    "Ne déplace pas les pièces automatiquement",
    "Pas de solutions toutes faites",
  ],
};

// =============================================================================
// TAB 2: COMPÉTENCES
// =============================================================================

export const tangramCompetences: CompetenceData[] = [
  {
    id: 'spatial',
    icon: '🧩',
    title: 'Vision spatiale',
    description: 'Visualiser et manipuler des formes dans l\'espace',
    stars: 5,
    iconBgColor: 'rgba(91, 141, 238, 0.15)',
  },
  {
    id: 'geometry',
    icon: '📐',
    title: 'Géométrie',
    description: 'Reconnaître les formes et leurs propriétés',
    stars: 5,
    iconBgColor: 'rgba(123, 199, 77, 0.15)',
  },
  {
    id: 'rotation',
    icon: '🔄',
    title: 'Rotation mentale',
    description: 'Imaginer une forme tournée dans différentes positions',
    stars: 4,
    iconBgColor: 'rgba(224, 86, 253, 0.15)',
  },
  {
    id: 'problem-solving',
    icon: '💡',
    title: 'Résolution de problèmes',
    description: 'Trouver la bonne combinaison de pièces',
    stars: 4,
    iconBgColor: 'rgba(255, 182, 193, 0.15)',
  },
  {
    id: 'patience',
    icon: '⏳',
    title: 'Patience',
    description: 'Persévérer jusqu\'à trouver la solution',
    stars: 3,
    iconBgColor: 'rgba(255, 215, 0, 0.15)',
  },
  {
    id: 'fine-motor',
    icon: '✋',
    title: 'Motricité fine',
    description: 'Précision du placement des pièces',
    stars: 3,
    iconBgColor: 'rgba(139, 115, 85, 0.15)',
  },
];

export const tangramScienceData: ScienceData = {
  text: "Le tangram stimule la rotation mentale et la vision spatiale (Clements & Sarama, 2004). La manipulation de formes géométriques renforce la compréhension des concepts mathématiques. Ces compétences sont prédictives de la réussite en STEM.",
};

// =============================================================================
// TAB 3: ACCOMPAGNEMENT
// =============================================================================

export const tangramAdvices: AdviceData[] = [
  {
    situation: "Votre enfant ne trouve pas où placer une pièce",
    response: "\"Et si tu la tournais ? Essaie dans l'autre sens !\"",
  },
  {
    situation: "Il abandonne rapidement",
    response: "\"Commençons par les grandes pièces ensemble. Tu vois ce triangle ?\"",
  },
  {
    situation: "Il place les pièces au hasard",
    response: "\"Regarde bien la silhouette. Quelle pièce a cette forme ?\"",
  },
  {
    situation: "Il réussit facilement",
    response: "\"Bravo ! Tu veux essayer une figure plus difficile ?\"",
  },
  {
    situation: "Il veut de l'aide",
    response: "\"Je vois que tu as bien placé ce triangle. Cherche une pièce qui va à côté.\"",
  },
];

export const tangramWarningText = "Laissez l'enfant manipuler les pièces lui-même. L'apprentissage passe par l'essai-erreur et la découverte personnelle.";

export const tangramTeamMessage = "\"Le tangram est un puzzle millénaire qui développe l'intelligence spatiale. En jouant régulièrement, votre enfant renforce des compétences essentielles pour les mathématiques et les sciences. Profitez de ce moment de calme et de concentration ensemble !\"";

// =============================================================================
// TAB 4: QUESTIONS À POSER
// =============================================================================

export const tangramQuestionsDuring: QuestionData[] = [
  { text: "\"Quelle forme a cette pièce ?\"" },
  { text: "\"Où pourrait aller ce triangle ?\"" },
  { text: "\"Combien de côtés a ce morceau ?\"" },
];

export const tangramQuestionsAfter: QuestionData[] = [
  { text: "\"Quelle était la figure ?\"" },
  { text: "\"Quelle pièce était la plus difficile à placer ?\"" },
  { text: "\"Tu pourrais créer ta propre figure ?\"" },
];

export const tangramQuestionsWarning = "Encouragez l'enfant à décrire ses actions et son raisonnement.";

// =============================================================================
// TAB 5: VIE QUOTIDIENNE
// =============================================================================

export const tangramDailyActivities: DailyActivityData[] = [
  {
    icon: '🧱',
    title: 'Constructions',
    description: 'Jouer avec des blocs de construction',
  },
  {
    icon: '🗺️',
    title: 'Puzzles classiques',
    description: 'Faire des puzzles traditionnels',
  },
  {
    icon: '✂️',
    title: 'Découpage',
    description: 'Découper et assembler des formes',
  },
  {
    icon: '🎨',
    title: 'Dessin géométrique',
    description: 'Dessiner avec des règles et compas',
  },
];

export const tangramTransferPhrases: string[] = [
  "\"Regarde ce panneau ! Quelles formes vois-tu dedans ?\"",
  "\"On pourrait faire cette forme avec les pièces du tangram ?\"",
];

export const tangramResources: ResourceData[] = [
  {
    type: 'Livre',
    icon: '📖',
    title: 'Tangrams : 330 puzzles',
    author: 'Ronald C. Read',
  },
  {
    type: 'Jeu',
    icon: '🧩',
    title: 'Tangram en bois',
    author: 'Djeco',
  },
  {
    type: 'App',
    icon: '📱',
    title: 'Tangram for Kids',
    author: 'Education Apps',
  },
  {
    type: 'Livre',
    icon: '📚',
    title: 'Formes et Puzzles',
    author: 'Usborne',
  },
];

// =============================================================================
// TAB 6: PROGRESSION
// =============================================================================

export const tangramBadges: BadgeData[] = [
  {
    id: 'debutant',
    icon: '🌟',
    title: 'Débutant',
    description: 'Complète 5 tangrams simples',
    earned: true,
  },
  {
    id: 'geometre',
    icon: '📐',
    title: 'Géomètre',
    description: 'Maîtrise toutes les rotations',
    earned: false,
  },
  {
    id: 'architecte',
    icon: '🏗️',
    title: 'Architecte',
    description: 'Complète les puzzles difficiles',
    earned: false,
  },
];

export const tangramAgeExpectations: AgeExpectationData[] = [
  { age: 4, expectation: 'Tangrams très simples (3-4 pièces)' },
  { age: 5, expectation: 'Tangrams simples avec toutes les pièces' },
  { age: 6, expectation: 'Figures moyennes avec aide' },
  { age: 7, expectation: 'Figures moyennes sans aide' },
  { age: 8, expectation: 'Figures complexes, création personnelle' },
];

export const tangramSettings: SettingData[] = [
  { id: 'showOutline', label: 'Afficher le contour', enabled: true },
  { id: 'snapToGrid', label: 'Aimantation des pièces', enabled: true },
  { id: 'showHints', label: 'Indices disponibles', enabled: true },
  { id: 'sessionLimit', label: 'Plafond session (20 min)', enabled: true },
];

// =============================================================================
// COMPLETE DATA EXPORT
// =============================================================================

export const tangramParentGuideData = {
  activityName: 'Tangram',
  activityEmoji: '🧩',
  gameData: tangramGameData,
  appBehavior: tangramAppBehavior,
  competences: tangramCompetences,
  scienceData: tangramScienceData,
  advices: tangramAdvices,
  warningText: tangramWarningText,
  teamMessage: tangramTeamMessage,
  questionsDuring: tangramQuestionsDuring,
  questionsAfter: tangramQuestionsAfter,
  questionsWarning: tangramQuestionsWarning,
  dailyActivities: tangramDailyActivities,
  transferPhrases: tangramTransferPhrases,
  resources: tangramResources,
  badges: tangramBadges,
  ageExpectations: tangramAgeExpectations,
  settings: tangramSettings,
};
