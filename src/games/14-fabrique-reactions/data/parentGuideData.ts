/**
 * Parent Guide Data for Fabrique de Réactions
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

export const fabriqueGameData: GameObjectiveData = {
  objective: "Combiner des éléments pour créer des réactions et découvrir de nouvelles substances.",
  optimalSolution: "Trouver toutes les combinaisons possibles",
  rules: [
    "Glisser deux éléments ensemble pour tenter une réaction",
    "Certaines combinaisons créent de nouveaux éléments",
    "Collecter tous les éléments découvrables",
  ],
  strategy: "Essayer systématiquement différentes combinaisons et observer les résultats.",
  tip: "Chaque élément peut réagir avec plusieurs autres !",
};

export const fabriqueAppBehavior: AppBehaviorData = {
  does: [
    "Propose des éléments de base à combiner",
    "Affiche les nouvelles découvertes de façon ludique",
    "Garde un journal des éléments découverts",
    "Propose des indices pour les combinaisons difficiles",
    "Célèbre chaque nouvelle découverte",
  ],
  doesnt: [
    "Pas de limite de temps",
    "Pas de pénalité pour les mauvaises combinaisons",
    "Ne révèle pas les solutions directement",
    "Pas de contenu scientifique dangereux",
  ],
};

// =============================================================================
// TAB 2: COMPÉTENCES
// =============================================================================

export const fabriqueCompetences: CompetenceData[] = [
  {
    id: 'experimentation',
    icon: '🧪',
    title: 'Esprit d\'expérimentation',
    description: 'Tester des hypothèses par l\'essai',
    stars: 5,
    iconBgColor: 'rgba(91, 141, 238, 0.15)',
  },
  {
    id: 'curiosity',
    icon: '🔍',
    title: 'Curiosité scientifique',
    description: 'S\'interroger sur les réactions',
    stars: 5,
    iconBgColor: 'rgba(123, 199, 77, 0.15)',
  },
  {
    id: 'logic',
    icon: '🧠',
    title: 'Raisonnement logique',
    description: 'Déduire les combinaisons possibles',
    stars: 4,
    iconBgColor: 'rgba(224, 86, 253, 0.15)',
  },
  {
    id: 'memory',
    icon: '📝',
    title: 'Mémoire',
    description: 'Se souvenir des combinaisons testées',
    stars: 4,
    iconBgColor: 'rgba(255, 182, 193, 0.15)',
  },
  {
    id: 'persistence',
    icon: '💪',
    title: 'Persévérance',
    description: 'Continuer à chercher malgré les échecs',
    stars: 3,
    iconBgColor: 'rgba(255, 215, 0, 0.15)',
  },
  {
    id: 'organization',
    icon: '📊',
    title: 'Organisation',
    description: 'Systématiser les expériences',
    stars: 3,
    iconBgColor: 'rgba(139, 115, 85, 0.15)',
  },
];

export const fabriqueScienceData: ScienceData = {
  text: "L'apprentissage par découverte stimule la curiosité et la mémorisation (Bruner, 1961). Les jeux de combinaison développent le raisonnement hypothético-déductif, fondement de la démarche scientifique.",
};

// =============================================================================
// TAB 3: ACCOMPAGNEMENT
// =============================================================================

export const fabriqueAdvices: AdviceData[] = [
  {
    situation: "Votre enfant essaie au hasard",
    response: "\"Qu'est-ce que ça pourrait donner si on mélangeait ça ?\"",
  },
  {
    situation: "Il ne trouve plus de nouvelles combinaisons",
    response: "\"Et si tu essayais avec les éléments que tu viens de créer ?\"",
  },
  {
    situation: "Il est frustré par les échecs",
    response: "\"En science, les échecs nous apprennent ce qui ne marche pas. C'est utile !\"",
  },
  {
    situation: "Il fait une découverte",
    response: "\"Waouh ! Comment ça s'est passé ? Tu peux refaire ?\"",
  },
  {
    situation: "Il veut des indices",
    response: "\"Réfléchissons : dans la vraie vie, qu'est-ce qui pourrait créer ça ?\"",
  },
];

export const fabriqueWarningText = "Encouragez l'exploration sans pression de résultat. Le processus de découverte est aussi important que les découvertes elles-mêmes.";

export const fabriqueTeamMessage = "\"La Fabrique de Réactions éveille le petit scientifique en chaque enfant ! En expérimentant librement, votre enfant développe une démarche d'investigation qui lui servira dans tous ses apprentissages. Posez des questions, émettez des hypothèses ensemble !\"";

// =============================================================================
// TAB 4: QUESTIONS À POSER
// =============================================================================

export const fabriqueQuestionsDuring: QuestionData[] = [
  { text: "\"Qu'est-ce que tu penses qu'il va se passer ?\"" },
  { text: "\"Pourquoi tu as choisi ces deux éléments ?\"" },
  { text: "\"C'est quoi ton hypothèse ?\"" },
];

export const fabriqueQuestionsAfter: QuestionData[] = [
  { text: "\"Quelle était ta découverte préférée ?\"" },
  { text: "\"Tu as remarqué un pattern dans les réactions ?\"" },
  { text: "\"Qu'est-ce que tu aimerais créer ensuite ?\"" },
];

export const fabriqueQuestionsWarning = "Utilisez le vocabulaire scientifique : hypothèse, expérience, observation, conclusion.";

// =============================================================================
// TAB 5: VIE QUOTIDIENNE
// =============================================================================

export const fabriqueDailyActivities: DailyActivityData[] = [
  {
    icon: '🍳',
    title: 'Cuisine',
    description: 'Observer les transformations des ingrédients',
  },
  {
    icon: '🌱',
    title: 'Jardinage',
    description: 'Observer la croissance des plantes',
  },
  {
    icon: '🎨',
    title: 'Mélange de couleurs',
    description: 'Créer de nouvelles teintes',
  },
  {
    icon: '🧊',
    title: 'États de l\'eau',
    description: 'Observer glace, eau, vapeur',
  },
];

export const fabriqueTransferPhrases: string[] = [
  "\"Qu'est-ce qui se passe si on mélange le jaune et le bleu ?\"",
  "\"D'après toi, pourquoi le gâteau gonfle dans le four ?\"",
];

export const fabriqueResources: ResourceData[] = [
  {
    type: 'Livre',
    icon: '📖',
    title: 'Mon premier livre de chimie',
    author: 'Usborne',
  },
  {
    type: 'Kit',
    icon: '🧪',
    title: 'Chimie sans danger',
    author: 'Buki',
  },
  {
    type: 'App',
    icon: '📱',
    title: 'Little Alchemy',
    author: 'Recloak',
  },
  {
    type: 'Livre',
    icon: '📚',
    title: 'Expériences scientifiques',
    author: 'Gallimard Jeunesse',
  },
];

// =============================================================================
// TAB 6: PROGRESSION
// =============================================================================

export const fabriqueBadges: BadgeData[] = [
  {
    id: 'apprenti',
    icon: '🧪',
    title: 'Apprenti chimiste',
    description: 'Réalise ses premières réactions',
    earned: true,
  },
  {
    id: 'chercheur',
    icon: '🔬',
    title: 'Chercheur',
    description: 'Découvre des éléments avancés',
    earned: false,
  },
  {
    id: 'inventeur',
    icon: '💡',
    title: 'Inventeur',
    description: 'Trouve toutes les combinaisons',
    earned: false,
  },
];

export const fabriqueAgeExpectations: AgeExpectationData[] = [
  { age: 5, expectation: 'Combinaisons simples avec 4-5 éléments' },
  { age: 6, expectation: 'Exploration libre, 10+ éléments' },
  { age: 7, expectation: 'Recherche systématique' },
  { age: 8, expectation: 'Compréhension des catégories d\'éléments' },
  { age: 9, expectation: 'Collection complète, chaînes de réactions' },
];

export const fabriqueSettings: SettingData[] = [
  { id: 'showDiscoveryCount', label: 'Afficher le compteur', enabled: true },
  { id: 'showHints', label: 'Indices disponibles', enabled: true },
  { id: 'autosave', label: 'Sauvegarde automatique', enabled: true },
  { id: 'sessionLimit', label: 'Plafond session (20 min)', enabled: true },
];

// =============================================================================
// COMPLETE DATA EXPORT
// =============================================================================

export const fabriqueParentGuideData = {
  activityName: 'Fabrique de Réactions',
  activityEmoji: '🧪',
  gameData: fabriqueGameData,
  appBehavior: fabriqueAppBehavior,
  competences: fabriqueCompetences,
  scienceData: fabriqueScienceData,
  advices: fabriqueAdvices,
  warningText: fabriqueWarningText,
  teamMessage: fabriqueTeamMessage,
  questionsDuring: fabriqueQuestionsDuring,
  questionsAfter: fabriqueQuestionsAfter,
  questionsWarning: fabriqueQuestionsWarning,
  dailyActivities: fabriqueDailyActivities,
  transferPhrases: fabriqueTransferPhrases,
  resources: fabriqueResources,
  badges: fabriqueBadges,
  ageExpectations: fabriqueAgeExpectations,
  settings: fabriqueSettings,
};
