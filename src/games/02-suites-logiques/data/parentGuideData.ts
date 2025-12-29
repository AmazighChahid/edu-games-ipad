/**
 * Parent Guide Data for Suites Logiques
 * Contains all the pedagogical content for the ParentDrawer component
 * Based on FICHE_PARENT.md
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

export const suitesGameData: GameObjectiveData = {
  objective: "Observer une séquence d'éléments et trouver celui qui vient après, en comprenant la règle du motif.",
  optimalSolution: "8 séquences à compléter par niveau",
  rules: [
    "Observer attentivement la suite",
    "Identifier le motif qui se répète",
    "Choisir l'élément qui continue la suite",
  ],
  strategy: "Chercher d'abord ce qui se répète : couleurs, formes, tailles. Puis prédire la suite.",
  tip: "Prends ton temps pour observer avant de répondre !",
};

export const suitesAppBehavior: AppBehaviorData = {
  does: [
    "Guide sans donner la réponse",
    "Propose des indices progressifs (mise en évidence, élimination)",
    "Célèbre l'effort et la réflexion",
    "S'adapte au rythme et à l'âge de l'enfant",
    "Utilise des thèmes variés (formes, couleurs, animaux)",
  ],
  doesnt: [
    "Pas de chronomètre stressant",
    "Pas de classement compétitif",
    "Pas de pénalité pour les erreurs",
    "Jamais de réponse donnée directement",
  ],
};

// =============================================================================
// TAB 2: COMPÉTENCES
// =============================================================================

export const suitesCompetences: CompetenceData[] = [
  {
    id: 'induction',
    icon: '🔍',
    title: 'Raisonnement inductif',
    description: 'Déduire une règle à partir d\'exemples',
    stars: 5,
    iconBgColor: 'rgba(91, 141, 238, 0.15)',
  },
  {
    id: 'classification',
    icon: '📦',
    title: 'Classification',
    description: 'Regrouper selon des critères communs',
    stars: 5,
    iconBgColor: 'rgba(123, 199, 77, 0.15)',
  },
  {
    id: 'abstraction',
    icon: '💭',
    title: 'Abstraction',
    description: 'Extraire l\'essentiel, ignorer les détails',
    stars: 4,
    iconBgColor: 'rgba(224, 86, 253, 0.15)',
  },
  {
    id: 'memory',
    icon: '🧠',
    title: 'Mémoire de travail',
    description: 'Retenir le motif pendant l\'analyse',
    stars: 4,
    iconBgColor: 'rgba(255, 182, 193, 0.15)',
  },
  {
    id: 'attention',
    icon: '👁️',
    title: 'Attention sélective',
    description: 'Se concentrer sur les éléments clés',
    stars: 3,
    iconBgColor: 'rgba(255, 215, 0, 0.15)',
  },
  {
    id: 'patience',
    icon: '⏳',
    title: 'Patience',
    description: 'Observer avant de répondre',
    stars: 4,
    iconBgColor: 'rgba(139, 115, 85, 0.15)',
  },
];

export const suitesScienceData: ScienceData = {
  text: "La reconnaissance de patterns est un prédicteur fort des compétences mathématiques futures (Clements & Sarama, 2009). Les activités de pattern recognition développent les fonctions exécutives (Diamond, 2013). L'explicitation verbale des règles améliore le transfert des apprentissages (Rittle-Johnson, 2017).",
};

// =============================================================================
// TAB 3: ACCOMPAGNEMENT
// =============================================================================

export const suitesAdvices: AdviceData[] = [
  {
    situation: "Votre enfant clique au hasard",
    response: "\"Qu'est-ce que tu vois dans cette suite ? Montre-moi les couleurs.\"",
  },
  {
    situation: "Il ne trouve pas le motif",
    response: "\"Est-ce que tu vois quelque chose qui se répète ?\"",
  },
  {
    situation: "Il fait une erreur",
    response: "\"C'est pas grave, observe encore. Qu'est-ce qui vient après le rouge ?\"",
  },
  {
    situation: "Il réussit",
    response: "\"Tu as bien observé ! Tu peux m'expliquer comment tu as trouvé ?\"",
  },
  {
    situation: "Il s'énerve après une erreur",
    response: "\"L'erreur fait partie du jeu. Tu cherches, c'est super !\"",
  },
];

export const suitesWarningText = "Ne donnez pas la réponse ! L'enfant apprend en cherchant lui-même. Posez des questions pour guider sa réflexion.";

export const suitesTeamMessage = "\"Les suites logiques préparent votre enfant aux mathématiques, à la lecture et aux sciences. La capacité à identifier des patterns est fondamentale pour l'apprentissage. Laissez-le observer, chercher, et surtout célébrez ses efforts de réflexion !\"";

// =============================================================================
// TAB 4: QUESTIONS À POSER
// =============================================================================

export const suitesQuestionsDuring: QuestionData[] = [
  { text: "\"Qu'est-ce que tu vois dans cette suite ?\"" },
  { text: "\"Combien d'éléments différents il y a ?\"" },
  { text: "\"Est-ce que tu vois quelque chose qui se répète ?\"" },
];

export const suitesQuestionsAfter: QuestionData[] = [
  { text: "\"Tu peux m'expliquer la règle ?\"" },
  { text: "\"Comment tu as trouvé ?\"" },
  { text: "\"Tu connais d'autres suites qui marchent pareil ?\"" },
];

export const suitesQuestionsWarning = "Questions > Réponses. Guidez par des questions, pas des solutions !";

// =============================================================================
// TAB 5: VIE QUOTIDIENNE
// =============================================================================

export const suitesDailyActivities: DailyActivityData[] = [
  {
    icon: '🍴',
    title: 'Mettre la table',
    description: 'Fourchette-couteau-fourchette-couteau...',
  },
  {
    icon: '📿',
    title: 'Perles à enfiler',
    description: 'Créer des colliers avec motifs répétitifs',
  },
  {
    icon: '🚗',
    title: 'En voiture',
    description: 'Chercher des patterns dans les plaques, maisons, feux',
  },
  {
    icon: '🎨',
    title: 'Dessiner des frises',
    description: 'Décorer avec des motifs qui se répètent',
  },
];

export const suitesTransferPhrases: string[] = [
  "\"Tu vois, ici aussi il y a un motif qui se répète, comme dans le jeu !\"",
  "\"Qu'est-ce qui viendrait après dans cette suite ?\"",
];

export const suitesResources: ResourceData[] = [
  {
    type: 'Jeu',
    icon: '🎲',
    title: 'Dobble',
    author: '6+ ans - Observation, rapidité',
  },
  {
    type: 'Jeu',
    icon: '🎴',
    title: 'Uno',
    author: '7+ ans - Suites de couleurs/nombres',
  },
  {
    type: 'Jeu',
    icon: '🧩',
    title: 'Rummikub',
    author: '8+ ans - Suites numériques',
  },
  {
    type: 'Livre',
    icon: '📖',
    title: 'Logique et raisonnement',
    author: 'Cahiers Montessori',
  },
];

// =============================================================================
// TAB 6: PROGRESSION
// =============================================================================

export const suitesBadges: BadgeData[] = [
  {
    id: 'observateur',
    icon: '🔍',
    title: 'Observateur',
    description: 'Prend le temps de regarder avant de répondre',
    earned: true,
  },
  {
    id: 'perseverant',
    icon: '🐢',
    title: 'Persévérant',
    description: 'Continue même après une erreur',
    earned: false,
  },
  {
    id: 'explicateur',
    icon: '💬',
    title: 'Explicateur',
    description: 'Sait expliquer comment il a trouvé',
    earned: true,
  },
];

export const suitesAgeExpectations: AgeExpectationData[] = [
  { age: 6, expectation: 'Alternances simples (AB)' },
  { age: 7, expectation: 'Motifs à 3 éléments (ABC)' },
  { age: 8, expectation: 'Progressions visuelles, rotations' },
  { age: 9, expectation: 'Suites numériques (+2, ×2)' },
  { age: 10, expectation: 'Multi-critères, Fibonacci' },
];

export const suitesSettings: SettingData[] = [
  { id: 'autoHints', label: 'Indices automatiques', enabled: true },
  { id: 'voiceOver', label: 'Voix de Pixel', enabled: true },
  { id: 'reduceAnimations', label: 'Réduire animations', enabled: false },
  { id: 'sessionLimit', label: 'Plafond session (10 min)', enabled: true },
];

// =============================================================================
// COMPLETE DATA EXPORT
// =============================================================================

export const suitesParentGuideData = {
  activityName: 'Suites Logiques',
  activityEmoji: '🔮',
  gameData: suitesGameData,
  appBehavior: suitesAppBehavior,
  competences: suitesCompetences,
  scienceData: suitesScienceData,
  advices: suitesAdvices,
  warningText: suitesWarningText,
  teamMessage: suitesTeamMessage,
  questionsDuring: suitesQuestionsDuring,
  questionsAfter: suitesQuestionsAfter,
  questionsWarning: suitesQuestionsWarning,
  dailyActivities: suitesDailyActivities,
  transferPhrases: suitesTransferPhrases,
  resources: suitesResources,
  badges: suitesBadges,
  ageExpectations: suitesAgeExpectations,
  settings: suitesSettings,
};
