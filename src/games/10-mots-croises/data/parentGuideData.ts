/**
 * Parent Guide Data for Mots Croisés
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

export const motsCroisesGameData: GameObjectiveData = {
  objective: "Compléter une grille de mots croisés en trouvant les mots correspondant aux définitions.",
  optimalSolution: "Lecture des définitions et déduction des mots",
  rules: [
    "Lire les définitions horizontales et verticales",
    "Écrire les mots lettre par lettre",
    "Les lettres communes aident à trouver d'autres mots",
  ],
  strategy: "Commencer par les mots les plus courts ou les définitions les plus claires.",
  tip: "Les lettres partagées entre mots sont tes meilleurs indices !",
};

export const motsCroisesAppBehavior: AppBehaviorData = {
  does: [
    "Propose des définitions adaptées à l'âge",
    "Affiche les lettres validées en vert",
    "Permet de naviguer facilement entre les cases",
    "Propose des indices sur demande",
    "Célèbre chaque mot trouvé",
  ],
  doesnt: [
    "Pas de limite de temps",
    "Pas de pénalité pour les erreurs",
    "Ne révèle jamais les mots complets",
    "Pas de vocabulaire trop complexe",
  ],
};

// =============================================================================
// TAB 2: COMPÉTENCES
// =============================================================================

export const motsCroisesCompetences: CompetenceData[] = [
  {
    id: 'vocabulary',
    icon: '📚',
    title: 'Vocabulaire',
    description: 'Enrichir et consolider le lexique',
    stars: 5,
    iconBgColor: 'rgba(91, 141, 238, 0.15)',
  },
  {
    id: 'spelling',
    icon: '✏️',
    title: 'Orthographe',
    description: 'Écrire correctement les mots',
    stars: 5,
    iconBgColor: 'rgba(123, 199, 77, 0.15)',
  },
  {
    id: 'comprehension',
    icon: '🔍',
    title: 'Compréhension',
    description: 'Interpréter les définitions',
    stars: 4,
    iconBgColor: 'rgba(224, 86, 253, 0.15)',
  },
  {
    id: 'deduction',
    icon: '🧠',
    title: 'Déduction',
    description: 'Utiliser les lettres communes',
    stars: 4,
    iconBgColor: 'rgba(255, 182, 193, 0.15)',
  },
  {
    id: 'culture',
    icon: '🌍',
    title: 'Culture générale',
    description: 'Découvrir de nouveaux sujets',
    stars: 3,
    iconBgColor: 'rgba(255, 215, 0, 0.15)',
  },
  {
    id: 'patience',
    icon: '⏳',
    title: 'Patience',
    description: 'Chercher sans se décourager',
    stars: 3,
    iconBgColor: 'rgba(139, 115, 85, 0.15)',
  },
];

export const motsCroisesScienceData: ScienceData = {
  text: "Les mots croisés stimulent la mémoire sémantique et la fluidité verbale (Hambrick et al., 1999). Ils renforcent les connexions entre orthographe, sens et contexte, essentielles pour une maîtrise approfondie du vocabulaire.",
};

// =============================================================================
// TAB 3: ACCOMPAGNEMENT
// =============================================================================

export const motsCroisesAdvices: AdviceData[] = [
  {
    situation: "Votre enfant ne comprend pas une définition",
    response: "\"C'est un mot pour dire... Tu connais un autre mot pour ça ?\"",
  },
  {
    situation: "Il fait une faute d'orthographe",
    response: "\"Presque ! Comment ça s'écrit déjà ? Écoute bien le son...\"",
  },
  {
    situation: "Il est bloqué",
    response: "\"Regarde les lettres que tu as déjà. Ça te donne un indice !\"",
  },
  {
    situation: "Il réussit facilement",
    response: "\"Bravo ! Tu connais beaucoup de mots ! On en cherche de plus longs ?\"",
  },
  {
    situation: "Il veut abandonner",
    response: "\"On cherche ensemble ? Lis-moi la définition.\"",
  },
];

export const motsCroisesWarningText = "Valorisez les mots trouvés même si l'orthographe n'est pas parfaite. L'important est la démarche de recherche.";

export const motsCroisesTeamMessage = "\"Les mots croisés sont un trésor pour le vocabulaire ! Chaque mot trouvé renforce la mémoire orthographique. Faites de ce moment un jeu partagé : cherchez ensemble, discutez des définitions, riez des erreurs. C'est comme ça qu'on apprend !\"";

// =============================================================================
// TAB 4: QUESTIONS À POSER
// =============================================================================

export const motsCroisesQuestionsDuring: QuestionData[] = [
  { text: "\"Qu'est-ce que ça veut dire cette définition ?\"" },
  { text: "\"Tu connais un mot qui commence par cette lettre ?\"" },
  { text: "\"Combien de lettres il faut ?\"" },
];

export const motsCroisesQuestionsAfter: QuestionData[] = [
  { text: "\"Quel mot as-tu appris aujourd'hui ?\"" },
  { text: "\"C'est quoi ton mot préféré de la grille ?\"" },
  { text: "\"Tu peux m'expliquer ce que ça veut dire ?\"" },
];

export const motsCroisesQuestionsWarning = "Demandez à l'enfant d'expliquer le sens des mots trouvés pour renforcer l'apprentissage.";

// =============================================================================
// TAB 5: VIE QUOTIDIENNE
// =============================================================================

export const motsCroisesDailyActivities: DailyActivityData[] = [
  {
    icon: '📰',
    title: 'Mots mêlés',
    description: 'Chercher des mots cachés dans une grille',
  },
  {
    icon: '🎯',
    title: 'Jeu du pendu',
    description: 'Deviner un mot lettre par lettre',
  },
  {
    icon: '📖',
    title: 'Lecture quotidienne',
    description: 'Enrichir le vocabulaire par la lecture',
  },
  {
    icon: '💬',
    title: 'Devinettes',
    description: 'Faire deviner des mots par des définitions',
  },
];

export const motsCroisesTransferPhrases: string[] = [
  "\"Comment s'appelle cette chose déjà ? Tu te souviens du mot ?\"",
  "\"C'est quoi le contraire de... ?\"",
];

export const motsCroisesResources: ResourceData[] = [
  {
    type: 'Livre',
    icon: '📖',
    title: 'Mes premiers mots croisés',
    author: 'Lito',
  },
  {
    type: 'Magazine',
    icon: '📰',
    title: 'J\'aime les mots',
    author: 'Bayard Presse',
  },
  {
    type: 'App',
    icon: '📱',
    title: 'Mots Fléchés Enfants',
    author: 'Kedronic',
  },
  {
    type: 'Jeu',
    icon: '🎲',
    title: 'Scrabble Junior',
    author: 'Mattel',
  },
];

// =============================================================================
// TAB 6: PROGRESSION
// =============================================================================

export const motsCroisesBadges: BadgeData[] = [
  {
    id: 'chercheur',
    icon: '🔍',
    title: 'Chercheur de mots',
    description: 'Trouve ses premiers mots',
    earned: true,
  },
  {
    id: 'lexique',
    icon: '📚',
    title: 'Maître du lexique',
    description: 'Connaît beaucoup de mots',
    earned: false,
  },
  {
    id: 'cruciverbiste',
    icon: '✏️',
    title: 'Cruciverbiste',
    description: 'Complète des grilles difficiles',
    earned: false,
  },
];

export const motsCroisesAgeExpectations: AgeExpectationData[] = [
  { age: 6, expectation: 'Grilles avec images comme indices' },
  { age: 7, expectation: 'Petites grilles avec définitions simples' },
  { age: 8, expectation: 'Grilles moyennes, définitions variées' },
  { age: 9, expectation: 'Grilles plus grandes, vocabulaire enrichi' },
  { age: 10, expectation: 'Grilles complexes, définitions subtiles' },
];

export const motsCroisesSettings: SettingData[] = [
  { id: 'showHints', label: 'Afficher les indices', enabled: true },
  { id: 'autoCheck', label: 'Vérification automatique', enabled: false },
  { id: 'showLetterCount', label: 'Nombre de lettres visible', enabled: true },
  { id: 'sessionLimit', label: 'Plafond session (20 min)', enabled: true },
];

// =============================================================================
// COMPLETE DATA EXPORT
// =============================================================================

export const motsCroisesParentGuideData = {
  activityName: 'Mots Croisés',
  activityEmoji: '📝',
  gameData: motsCroisesGameData,
  appBehavior: motsCroisesAppBehavior,
  competences: motsCroisesCompetences,
  scienceData: motsCroisesScienceData,
  advices: motsCroisesAdvices,
  warningText: motsCroisesWarningText,
  teamMessage: motsCroisesTeamMessage,
  questionsDuring: motsCroisesQuestionsDuring,
  questionsAfter: motsCroisesQuestionsAfter,
  questionsWarning: motsCroisesQuestionsWarning,
  dailyActivities: motsCroisesDailyActivities,
  transferPhrases: motsCroisesTransferPhrases,
  resources: motsCroisesResources,
  badges: motsCroisesBadges,
  ageExpectations: motsCroisesAgeExpectations,
  settings: motsCroisesSettings,
};
