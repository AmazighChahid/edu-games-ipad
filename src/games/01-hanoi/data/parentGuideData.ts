/**
 * Parent Guide Data for Tour de Hanoï
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

export const hanoiGameData: GameObjectiveData = {
  objective: "Déplacer tous les disques de la tour A vers la tour C, en utilisant B comme intermédiaire.",
  optimalSolution: "7 mouvements pour 3 disques",
  rules: [
    "Un seul disque à la fois",
    "Seul le disque du haut bouge",
    "Jamais un grand sur un petit",
  ],
  strategy: "Pour déplacer N disques : d'abord déplacer les N-1 du dessus vers la tour intermédiaire, puis le grand vers la destination.",
  tip: "Commencez toujours par le plus petit disque !",
};

export const hanoiAppBehavior: AppBehaviorData = {
  does: [
    "Guide sans donner la réponse",
    "Signale les erreurs doucement (le disque refuse de se poser)",
    "Propose des indices progressifs",
    "Célèbre l'effort, pas juste le résultat",
    "S'adapte au rythme de l'enfant",
  ],
  doesnt: [
    "Pas de timer stressant",
    "Pas de score ni classement compétitif",
    "Pas de punition pour les erreurs",
    "Jamais de solution donnée directement",
  ],
};

// =============================================================================
// TAB 2: COMPÉTENCES
// =============================================================================

export const hanoiCompetences: CompetenceData[] = [
  {
    id: 'planning',
    icon: '📋',
    title: 'Planification',
    description: 'Capacité à penser avant d\'agir',
    stars: 5,
    iconBgColor: 'rgba(255, 215, 0, 0.15)',
  },
  {
    id: 'logic',
    icon: '🧩',
    title: 'Raisonnement',
    description: 'Déduire les conséquences',
    stars: 4,
    iconBgColor: 'rgba(123, 199, 77, 0.15)',
  },
  {
    id: 'patience',
    icon: '⏳',
    title: 'Patience',
    description: 'Accepter que ça prend du temps',
    stars: 5,
    iconBgColor: 'rgba(139, 115, 85, 0.15)',
  },
  {
    id: 'memory',
    icon: '🧠',
    title: 'Mémoire',
    description: 'Retenir plusieurs informations',
    stars: 3,
    iconBgColor: 'rgba(255, 182, 193, 0.15)',
  },
  {
    id: 'inhibition',
    icon: '🛑',
    title: 'Inhibition',
    description: 'Résister aux réponses impulsives',
    stars: 4,
    iconBgColor: 'rgba(224, 86, 253, 0.15)',
  },
  {
    id: 'flexibility',
    icon: '🔄',
    title: 'Flexibilité',
    description: 'S\'adapter quand ça ne marche pas',
    stars: 4,
    iconBgColor: 'rgba(91, 141, 238, 0.15)',
  },
];

export const hanoiScienceData: ScienceData = {
  text: "La Tour de Hanoï est utilisée en neuropsychologie pour évaluer les fonctions exécutives. Des études montrent que la pratique régulière améliore la capacité de planification (+15% en moyenne), la résistance à l'impulsivité, et les performances en mathématiques.",
};

// =============================================================================
// TAB 3: ACCOMPAGNEMENT
// =============================================================================

export const hanoiAdvices: AdviceData[] = [
  {
    situation: "Votre enfant hésite",
    response: "\"Prends ton temps pour réfléchir\"",
  },
  {
    situation: "Il fait une erreur",
    response: "\"Tu as essayé, que s'est-il passé ?\"",
  },
  {
    situation: "Il est bloqué",
    response: "\"Quel disque voudrais-tu déplacer en premier ?\"",
  },
  {
    situation: "Il réussit",
    response: "\"Tu as bien réfléchi avant d'agir, bravo !\"",
  },
  {
    situation: "Il s'impatiente",
    response: "\"C'est normal que ça prenne du temps, c'est un vrai défi !\"",
  },
];

export const hanoiWarningText = "Ne donnez pas la solution ! Cela prive l'enfant de la satisfaction de trouver seul et réduit considérablement les bénéfices pédagogiques de l'activité.";

export const hanoiTeamMessage = "\"La Tour de Hanoï n'est pas qu'un jeu : c'est un véritable entraînement cérébral. Ne vous inquiétez pas si votre enfant fait beaucoup d'erreurs au début, c'est ainsi qu'il apprend. Célébrez ses efforts et sa persévérance, pas seulement ses réussites. Et surtout, laissez-le chercher par lui-même — c'est là que la magie opère !\"";

// =============================================================================
// TAB 4: QUESTIONS À POSER
// =============================================================================

export const hanoiQuestionsDuring: QuestionData[] = [
  { text: "\"Par quel disque vas-tu commencer ?\"" },
  { text: "\"Que se passe-t-il si tu mets celui-ci là ?\"" },
  { text: "\"Comment peux-tu libérer le grand disque ?\"" },
];

export const hanoiQuestionsAfter: QuestionData[] = [
  { text: "\"Comment as-tu su quel disque bouger en premier ?\"" },
  { text: "\"Qu'est-ce qui était le plus difficile ?\"" },
  { text: "\"Si tu recommençais, ferais-tu pareil ?\"" },
];

export const hanoiQuestionsWarning = "Ne donnez pas la solution ! Cela prive l'enfant de la satisfaction de trouver seul.";

// =============================================================================
// TAB 5: VIE QUOTIDIENNE
// =============================================================================

export const hanoiDailyActivities: DailyActivityData[] = [
  {
    icon: '🎒',
    title: 'Ranger le cartable',
    description: 'Planifier et organiser les affaires par ordre d\'importance',
  },
  {
    icon: '✨',
    title: 'Organiser sa chambre',
    description: 'Même logique de "petit sur grand" pour empiler',
  },
  {
    icon: '📚',
    title: 'Planifier ses devoirs',
    description: 'Séquencer les étapes comme dans le jeu',
  },
  {
    icon: '🧱',
    title: 'Construire avec Lego',
    description: 'Anticiper plusieurs coups à l\'avance',
  },
];

export const hanoiTransferPhrases: string[] = [
  "\"Tu te souviens de la Tour de Hanoï ? C'est pareil ici : il faut réfléchir à l'ordre des étapes.\"",
  "\"Comme dans le jeu, si tu es bloqué, essaie de voir quel est le 'gros disque' à bouger.\"",
];

export const hanoiResources: ResourceData[] = [
  {
    type: 'Livre',
    icon: '📖',
    title: 'Les fonctions exécutives de l\'enfant',
    author: 'Rémi Samier',
  },
  {
    type: 'Jeu physique',
    icon: '🎲',
    title: 'Tour de Hanoï en bois',
    author: 'Magasins jeux éducatifs',
  },
  {
    type: 'Application',
    icon: '📱',
    title: 'Rush Hour',
    author: 'Même type de raisonnement',
  },
];

// =============================================================================
// TAB 6: PROGRESSION
// =============================================================================

export const hanoiBadges: BadgeData[] = [
  {
    id: 'perseverant',
    icon: '🐢',
    title: 'Persévérant',
    description: 'Continue même quand c\'est difficile',
    earned: true,
  },
  {
    id: 'calme',
    icon: '🧘',
    title: 'Calme',
    description: 'Prend son temps pour réfléchir',
    earned: false,
  },
  {
    id: 'stratege',
    icon: '🎯',
    title: 'Stratège',
    description: 'Planifie avant d\'agir',
    earned: true,
  },
];

export const hanoiAgeExpectations: AgeExpectationData[] = [
  { age: 6, expectation: '3 disques avec indices' },
  { age: 7, expectation: '3 disques sans aide' },
  { age: 8, expectation: '4 disques' },
  { age: 9, expectation: '5 disques' },
  { age: 10, expectation: '5+ disques' },
];

export const hanoiSettings: SettingData[] = [
  { id: 'autoHints', label: 'Indices automatiques', enabled: true },
  { id: 'voiceOver', label: 'Voix off', enabled: true },
  { id: 'reduceAnimations', label: 'Réduire animations', enabled: false },
  { id: 'sessionLimit', label: 'Plafond session (12 min)', enabled: true },
];

// =============================================================================
// COMPLETE DATA EXPORT
// =============================================================================

export const hanoiParentGuideData = {
  activityName: 'Tour de Hanoï',
  activityEmoji: '🏰',
  gameData: hanoiGameData,
  appBehavior: hanoiAppBehavior,
  competences: hanoiCompetences,
  scienceData: hanoiScienceData,
  advices: hanoiAdvices,
  warningText: hanoiWarningText,
  teamMessage: hanoiTeamMessage,
  questionsDuring: hanoiQuestionsDuring,
  questionsAfter: hanoiQuestionsAfter,
  questionsWarning: hanoiQuestionsWarning,
  dailyActivities: hanoiDailyActivities,
  transferPhrases: hanoiTransferPhrases,
  resources: hanoiResources,
  badges: hanoiBadges,
  ageExpectations: hanoiAgeExpectations,
  settings: hanoiSettings,
};
