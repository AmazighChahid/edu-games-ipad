/**
 * Parent Guide Data for Super Mémoire (Memory)
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

export const memoryGameData: GameObjectiveData = {
  objective: "Retrouver toutes les paires de cartes identiques en retournant les cartes deux par deux et en mémorisant leur position.",
  optimalSolution: "Trouver toutes les paires avec le minimum d'essais",
  rules: [
    "Retourner 2 cartes par tour",
    "Si elles sont identiques, la paire est gagnée",
    "Sinon, elles se retournent et on mémorise leur position",
  ],
  strategy: "Observer attentivement chaque carte retournée et mémoriser sa position pour former les paires plus rapidement.",
  tip: "Commence par explorer le plateau, puis concentre-toi sur les positions !",
};

export const memoryAppBehavior: AppBehaviorData = {
  does: [
    "Laisse l'enfant chercher à son rythme",
    "Célèbre chaque paire trouvée",
    "Adapte le nombre de cartes selon l'âge",
    "Propose des thèmes variés et attrayants",
    "Encourage sans montrer les réponses",
  ],
  doesnt: [
    "Pas de chronomètre stressant (optionnel)",
    "Pas de compétition contre l'app",
    "Pas de pénalité pour les erreurs",
    "Jamais de réponse donnée directement",
  ],
};

// =============================================================================
// TAB 2: COMPÉTENCES
// =============================================================================

export const memoryCompetences: CompetenceData[] = [
  {
    id: 'shortTermMemory',
    icon: '🧠',
    title: 'Mémoire à court terme',
    description: 'Retenir la position des cartes vues',
    stars: 5,
    iconBgColor: 'rgba(91, 141, 238, 0.15)',
  },
  {
    id: 'visualMemory',
    icon: '👁️',
    title: 'Mémoire visuelle',
    description: 'Se souvenir des images',
    stars: 5,
    iconBgColor: 'rgba(123, 199, 77, 0.15)',
  },
  {
    id: 'concentration',
    icon: '🎯',
    title: 'Concentration',
    description: 'Maintenir l\'attention sur le plateau',
    stars: 5,
    iconBgColor: 'rgba(255, 179, 71, 0.15)',
  },
  {
    id: 'visualRecognition',
    icon: '🔍',
    title: 'Reconnaissance visuelle',
    description: 'Identifier les symboles/images',
    stars: 4,
    iconBgColor: 'rgba(224, 86, 253, 0.15)',
  },
  {
    id: 'strategy',
    icon: '♟️',
    title: 'Stratégie',
    description: 'Optimiser ses choix pour trouver les paires',
    stars: 3,
    iconBgColor: 'rgba(255, 182, 193, 0.15)',
  },
  {
    id: 'patience',
    icon: '⏳',
    title: 'Patience',
    description: 'Attendre de trouver les bonnes paires',
    stars: 4,
    iconBgColor: 'rgba(139, 115, 85, 0.15)',
  },
];

export const memoryScienceData: ScienceData = {
  text: "La mémoire de travail se développe par l'exercice répété (Baddeley, 1992). Le jeu de Memory sollicite le \"calepin visuo-spatial\", composant clé de la mémoire de travail. Les capacités de mémoire de travail sont fortement liées à la réussite scolaire (Gathercole, 2008).",
};

// =============================================================================
// TAB 3: ACCOMPAGNEMENT
// =============================================================================

export const memoryAdvices: AdviceData[] = [
  {
    situation: "Votre enfant retourne les cartes au hasard",
    response: "\"Essaie de te souvenir de 2 cartes avant de jouer. Où était le chat ?\"",
  },
  {
    situation: "Il ne se souvient pas des cartes",
    response: "\"Regarde bien chaque carte quand tu la retournes. Prends ton temps.\"",
  },
  {
    situation: "Il se décourage après des erreurs",
    response: "\"Tu as déjà trouvé 3 paires, c'est super ! Continue !\"",
  },
  {
    situation: "Il réussit facilement",
    response: "\"Bravo ! Tu veux essayer avec plus de cartes ?\"",
  },
  {
    situation: "Il abandonne avant de finir",
    response: "\"On fait une pause et on reprend ? Tu y étais presque !\"",
  },
];

export const memoryWarningText = "Ne montrez pas les cartes ! L'enfant entraîne sa mémoire en cherchant lui-même. Évitez de dire \"Tu l'as déjà vue !\" qui casse la confiance.";

export const memoryTeamMessage = "\"La mémoire visuelle est fondamentale pour la lecture, les mathématiques et l'organisation quotidienne. En jouant régulièrement, votre enfant développe sa capacité à retenir et à se concentrer. Célébrez les efforts, pas seulement les victoires !\"";

// =============================================================================
// TAB 4: QUESTIONS À POSER
// =============================================================================

export const memoryQuestionsDuring: QuestionData[] = [
  { text: "\"Tu te souviens où tu as vu le [animal/objet] ?\"" },
  { text: "\"Par où tu veux commencer ?\"" },
  { text: "\"Tu as une technique pour te rappeler ?\"" },
];

export const memoryQuestionsAfter: QuestionData[] = [
  { text: "\"Comment tu fais pour te souvenir des cartes ?\"" },
  { text: "\"C'est plus facile de se rappeler quand c'est groupé ?\"" },
  { text: "\"Tu préfères retourner par zone ou au hasard ?\"" },
];

export const memoryQuestionsWarning = "Questions > Réponses. Guidez par des questions, pas en montrant les cartes !";

// =============================================================================
// TAB 5: VIE QUOTIDIENNE
// =============================================================================

export const memoryDailyActivities: DailyActivityData[] = [
  {
    icon: '🧸',
    title: "Qu'est-ce qui manque ?",
    description: 'Poser des objets, en retirer un, deviner lequel',
  },
  {
    icon: '👀',
    title: 'Kim visuel',
    description: 'Observer une image 30s, puis la décrire',
  },
  {
    icon: '🛒',
    title: 'Courses en mémoire',
    description: 'Mémoriser 3-5 articles sans liste',
  },
  {
    icon: '🎒',
    title: 'Ranger ses affaires',
    description: 'Se souvenir où va chaque chose',
  },
];

export const memoryTransferPhrases: string[] = [
  "\"Tu te souviens où tu as rangé ton jouet ? Comme dans le jeu de mémoire !\"",
  "\"Essaie de mémoriser ces 3 choses à faire, sans les écrire.\"",
];

export const memoryResources: ResourceData[] = [
  {
    type: 'Jeu',
    icon: '🃏',
    title: 'Memory classique',
    author: '4+ ans - Version physique',
  },
  {
    type: 'Jeu',
    icon: '🔍',
    title: 'Lynx',
    author: '5+ ans - Rapidité et mémoire visuelle',
  },
  {
    type: 'Jeu',
    icon: '🎯',
    title: 'Dobble',
    author: '6+ ans - Observation rapide',
  },
  {
    type: 'Jeu',
    icon: '🔴',
    title: 'Simon',
    author: '6+ ans - Mémoire séquentielle',
  },
];

// =============================================================================
// TAB 6: PROGRESSION
// =============================================================================

export const memoryBadges: BadgeData[] = [
  {
    id: 'elephant',
    icon: '🐘',
    title: 'Mémoire d\'éléphant',
    description: 'Trouve les paires avec peu d\'essais',
    earned: false,
  },
  {
    id: 'patient',
    icon: '🐢',
    title: 'Patient',
    description: 'Prend le temps d\'observer',
    earned: true,
  },
  {
    id: 'strategist',
    icon: '♟️',
    title: 'Stratège',
    description: 'Développe une technique efficace',
    earned: false,
  },
];

export const memoryAgeExpectations: AgeExpectationData[] = [
  { age: 4, expectation: '4 paires (8 cartes)' },
  { age: 5, expectation: '6 paires (12 cartes)' },
  { age: 6, expectation: '8 paires (16 cartes)' },
  { age: 7, expectation: '10 paires (20 cartes)' },
  { age: 8, expectation: '12+ paires' },
];

export const memorySettings: SettingData[] = [
  { id: 'soundEffects', label: 'Effets sonores', enabled: true },
  { id: 'voiceOver', label: 'Voix de Mémo', enabled: true },
  { id: 'showTimer', label: 'Afficher le chronomètre', enabled: false },
  { id: 'sessionLimit', label: 'Plafond session (15 min)', enabled: true },
];

// =============================================================================
// COMPLETE DATA EXPORT
// =============================================================================

export const memoryParentGuideData = {
  activityName: 'Super Mémoire',
  activityEmoji: '🐘',
  gameData: memoryGameData,
  appBehavior: memoryAppBehavior,
  competences: memoryCompetences,
  scienceData: memoryScienceData,
  advices: memoryAdvices,
  warningText: memoryWarningText,
  teamMessage: memoryTeamMessage,
  questionsDuring: memoryQuestionsDuring,
  questionsAfter: memoryQuestionsAfter,
  questionsWarning: memoryQuestionsWarning,
  dailyActivities: memoryDailyActivities,
  transferPhrases: memoryTransferPhrases,
  resources: memoryResources,
  badges: memoryBadges,
  ageExpectations: memoryAgeExpectations,
  settings: memorySettings,
};
