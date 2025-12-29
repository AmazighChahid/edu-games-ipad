/**
 * Parent Guide Data for Balance Logique
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
// TAB 1: OBJECTIF & REGLES
// =============================================================================

export const balanceGameData: GameObjectiveData = {
  objective: "Equilibrer une balance en ajoutant ou retirant des objets jusqu'a ce que les deux cotes aient la meme valeur.",
  optimalSolution: "Trouver l'equilibre avec le minimum d'essais",
  rules: [
    "Glisser les objets sur les plateaux de la balance",
    "Observer si la balance penche",
    "Equilibrer signifie meme poids des deux cotes",
  ],
  strategy: "Observer d'abord de quel cote la balance penche, puis estimer combien il faut ajouter ou retirer.",
  tip: "La balance TE montre si c'est juste, pas besoin qu'on te le dise !",
};

export const balanceAppBehavior: AppBehaviorData = {
  does: [
    "Montre immediatement si c'est equilibre ou non",
    "Propose un mode libre pour experimenter",
    "Enregistre les equivalences decouvertes",
    "Progresse du concret vers l'abstrait",
    "Celebre les decouvertes autonomes",
  ],
  doesnt: [
    "Pas de jugement sur les essais",
    "Pas de solution donnee directement",
    "Pas de pression temporelle",
    "Jamais de critique des erreurs",
  ],
};

// =============================================================================
// TAB 2: COMPETENCES
// =============================================================================

export const balanceCompetences: CompetenceData[] = [
  {
    id: 'equality',
    icon: '⚖️',
    title: 'Sens de l\'egalite',
    description: 'Comprendre que = signifie meme valeur',
    stars: 5,
    iconBgColor: 'rgba(91, 141, 238, 0.15)',
  },
  {
    id: 'equivalence',
    icon: '🔄',
    title: 'Equivalence',
    description: 'Decouvrir que des objets differents peuvent etre egaux',
    stars: 5,
    iconBgColor: 'rgba(123, 199, 77, 0.15)',
  },
  {
    id: 'preAlgebra',
    icon: '❓',
    title: 'Pre-algebre',
    description: 'Trouver l\'inconnue (? + 3 = 7)',
    stars: 4,
    iconBgColor: 'rgba(255, 179, 71, 0.15)',
  },
  {
    id: 'reasoning',
    icon: '💭',
    title: 'Raisonnement logique',
    description: 'Si j\'ajoute X, alors la balance va...',
    stars: 4,
    iconBgColor: 'rgba(224, 86, 253, 0.15)',
  },
  {
    id: 'estimation',
    icon: '🎯',
    title: 'Estimation',
    description: 'Evaluer a peu pres combien',
    stars: 3,
    iconBgColor: 'rgba(255, 182, 193, 0.15)',
  },
  {
    id: 'scientific',
    icon: '🔬',
    title: 'Pensee scientifique',
    description: 'Hypothese - Experience - Conclusion',
    stars: 4,
    iconBgColor: 'rgba(139, 115, 85, 0.15)',
  },
];

export const balanceScienceData: ScienceData = {
  text: "La comprehension de la conservation des quantites se developpe entre 5 et 7 ans (Piaget, 1952). La manipulation de balances aide a construire les concepts abstraits (Bruner, 1966). Les representations visuelles de l'equilibre reduisent les erreurs en algebre (Vlassis, 2002).",
};

// =============================================================================
// TAB 3: ACCOMPAGNEMENT
// =============================================================================

export const balanceAdvices: AdviceData[] = [
  {
    situation: "Votre enfant met des objets au hasard",
    response: "\"Regarde ce qui se passe quand tu ajoutes une pomme. La balance te montre !\"",
  },
  {
    situation: "Il s'enerve quand ce n'est pas equilibre",
    response: "\"La balance te montre juste si c'est egal ou pas, ce n'est pas une erreur.\"",
  },
  {
    situation: "Il ne comprend pas les equivalences",
    response: "\"Combien de pommes pour equilibrer cette pasteque ? Essaie !\"",
  },
  {
    situation: "Il demande toujours les solutions",
    response: "\"Tu veux encore essayer ou tu preferes un indice ?\"",
  },
  {
    situation: "Il passe tout son temps en mode libre",
    response: "\"C'est super que tu explores ! Tu decouvres plein de choses.\"",
  },
];

export const balanceWarningText = "Ne donnez pas la solution ! La balance EST le professeur : elle montre immediatement si c'est egal ou non, sans jugement. Laissez l'enfant decouvrir.";

export const balanceTeamMessage = "\"La balance prepare votre enfant a l'algebre de maniere concrete et intuitive. L'equivalence '1 pasteque = 3 pommes' est le meme concept que '1/2 = 2/4'. Celebrez chaque decouverte autonome !\"";

// =============================================================================
// TAB 4: QUESTIONS A POSER
// =============================================================================

export const balanceQuestionsDuring: QuestionData[] = [
  { text: "\"De quel cote la balance penche-t-elle ?\"" },
  { text: "\"Combien de pommes penses-tu qu'il faut ?\"" },
  { text: "\"Qu'est-ce qui se passe si tu ajoutes une pomme a droite ?\"" },
];

export const balanceQuestionsAfter: QuestionData[] = [
  { text: "\"Comment tu as trouve ?\"" },
  { text: "\"1 pasteque, c'est combien de pommes ?\"" },
  { text: "\"Il y avait une autre facon de faire ?\"" },
];

export const balanceQuestionsWarning = "Questionner plutot qu'aider : \"Que se passe-t-il si...?\" vaut mieux que \"Mets ca\"";

// =============================================================================
// TAB 5: VIE QUOTIDIENNE
// =============================================================================

export const balanceDailyActivities: DailyActivityData[] = [
  {
    icon: '⚖️',
    title: 'Balance de cuisine',
    description: 'Peser les ingredients pour une recette',
  },
  {
    icon: '🎢',
    title: 'Balancoire',
    description: 'Comment s\'equilibrer avec un ami plus lourd ?',
  },
  {
    icon: '🍰',
    title: 'Partage equitable',
    description: 'Partager un gateau pour que tout le monde ait pareil',
  },
  {
    icon: '🛒',
    title: 'Jeu de marchande',
    description: '3 pommes = 1 euro, combien pour 6 pommes ?',
  },
];

export const balanceTransferPhrases: string[] = [
  "\"C'est comme la balance ! Les deux cotes doivent etre egaux.\"",
  "\"Combien il te faut pour que ce soit pareil des deux cotes ?\"",
];

export const balanceResources: ResourceData[] = [
  {
    type: 'Jeu',
    icon: '⚖️',
    title: 'Equilibrio',
    author: '5+ ans - Equilibre physique reel',
  },
  {
    type: 'Jeu',
    icon: '🎲',
    title: 'Mathador',
    author: '8+ ans - Calcul, combinaisons',
  },
  {
    type: 'App',
    icon: '🐉',
    title: 'DragonBox Algebra',
    author: '9+ ans - Introduction a l\'algebre',
  },
  {
    type: 'Jeu',
    icon: '🐔',
    title: 'Pickomino',
    author: '8+ ans - Addition, probabilite',
  },
];

// =============================================================================
// TAB 6: PROGRESSION
// =============================================================================

export const balanceBadges: BadgeData[] = [
  {
    id: 'scientist',
    icon: '🔬',
    title: 'Scientifique',
    description: 'Verbalise ses hypotheses avant d\'agir',
    earned: false,
  },
  {
    id: 'discoverer',
    icon: '💡',
    title: 'Decouvreur',
    description: 'Trouve les equivalences tout seul',
    earned: true,
  },
  {
    id: 'explorer',
    icon: '🧭',
    title: 'Explorateur',
    description: 'Passe du temps en mode libre',
    earned: true,
  },
];

export const balanceAgeExpectations: AgeExpectationData[] = [
  { age: 6, expectation: 'Objets identiques (2 pommes = 2 pommes)' },
  { age: 7, expectation: 'Equivalences (1 pasteque = 3 pommes)' },
  { age: 8, expectation: 'Nombres (5 = 2 + 3)' },
  { age: 9, expectation: 'Pre-algebre (? + 3 = 8)' },
];

export const balanceSettings: SettingData[] = [
  { id: 'showWeights', label: 'Afficher les poids', enabled: false },
  { id: 'soundEffects', label: 'Effets sonores', enabled: true },
  { id: 'vibration', label: 'Vibrations', enabled: true },
  { id: 'sessionLimit', label: 'Plafond session (15 min)', enabled: true },
];

// =============================================================================
// COMPLETE DATA EXPORT
// =============================================================================

export const balanceParentGuideData = {
  activityName: 'Balance Logique',
  activityEmoji: '⚖️',
  gameData: balanceGameData,
  appBehavior: balanceAppBehavior,
  competences: balanceCompetences,
  scienceData: balanceScienceData,
  advices: balanceAdvices,
  warningText: balanceWarningText,
  teamMessage: balanceTeamMessage,
  questionsDuring: balanceQuestionsDuring,
  questionsAfter: balanceQuestionsAfter,
  questionsWarning: balanceQuestionsWarning,
  dailyActivities: balanceDailyActivities,
  transferPhrases: balanceTransferPhrases,
  resources: balanceResources,
  badges: balanceBadges,
  ageExpectations: balanceAgeExpectations,
  settings: balanceSettings,
};
