/**
 * Parent Guide Data for Math Blocks
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

export const mathBlocksGameData: GameObjectiveData = {
  objective: "Associer des calculs a leurs resultats en trouvant les paires correspondantes dans la grille pour les faire disparaitre.",
  optimalSolution: "Trouver toutes les paires avant la fin du temps imparti",
  rules: [
    "Cliquer sur un bloc avec un calcul (ex: 4+3)",
    "Puis cliquer sur le bloc avec le resultat (ex: 7)",
    "Si c'est correct, la paire disparait",
  ],
  strategy: "Commencer par les calculs faciles pour gagner du temps et de la confiance.",
  tip: "Les doubles (5+5, 6+6) sont de bons reperes pour calculer !",
};

export const mathBlocksAppBehavior: AppBehaviorData = {
  does: [
    "Propose une progression adaptee (+ avant x)",
    "Celebre les combos (paires consecutives)",
    "Donne des bonus de temps",
    "S'adapte au niveau de l'enfant",
    "Encourage sans stresser",
  ],
  doesnt: [
    "Pas de penalite excessive pour les erreurs",
    "Pas de comparaison avec d'autres joueurs",
    "Jamais de reponse donnee directement",
    "Pas de pression temporelle trop forte",
  ],
};

// =============================================================================
// TAB 2: COMPETENCES
// =============================================================================

export const mathBlocksCompetences: CompetenceData[] = [
  {
    id: 'mentalCalc',
    icon: '🧮',
    title: 'Calcul mental',
    description: 'Effectuer des operations de tete',
    stars: 5,
    iconBgColor: 'rgba(91, 141, 238, 0.15)',
  },
  {
    id: 'numeration',
    icon: '🔢',
    title: 'Numeration',
    description: 'Comprendre les nombres et leurs relations',
    stars: 5,
    iconBgColor: 'rgba(123, 199, 77, 0.15)',
  },
  {
    id: 'memorization',
    icon: '🧠',
    title: 'Memorisation',
    description: 'Tables d\'addition et multiplication',
    stars: 4,
    iconBgColor: 'rgba(255, 179, 71, 0.15)',
  },
  {
    id: 'speed',
    icon: '⚡',
    title: 'Rapidite',
    description: 'Automatiser les calculs',
    stars: 4,
    iconBgColor: 'rgba(224, 86, 253, 0.15)',
  },
  {
    id: 'concentration',
    icon: '🎯',
    title: 'Concentration',
    description: 'Chercher les bonnes paires dans la grille',
    stars: 4,
    iconBgColor: 'rgba(255, 182, 193, 0.15)',
  },
  {
    id: 'confidence',
    icon: '💪',
    title: 'Confiance',
    description: 'Oser cliquer sur une paire',
    stars: 3,
    iconBgColor: 'rgba(139, 115, 85, 0.15)',
  },
];

export const mathBlocksScienceData: ScienceData = {
  text: "Le \"sens du nombre\" est inne mais doit etre developpe par la pratique (Dehaene, 1997). L'automatisation du calcul libere des ressources cognitives pour la resolution de problemes complexes. Les exercices de calcul mental renforcent les connexions neuronales.",
};

// =============================================================================
// TAB 3: ACCOMPAGNEMENT
// =============================================================================

export const mathBlocksAdvices: AdviceData[] = [
  {
    situation: "Votre enfant clique au hasard",
    response: "\"Prends le temps de calculer dans ta tete avant de cliquer.\"",
  },
  {
    situation: "Il compte sur ses doigts (apres 7 ans)",
    response: "\"Essaie de visualiser les nombres, comme sur un de !\"",
  },
  {
    situation: "Il stresse avec le chronometre",
    response: "\"L'important c'est de calculer juste. Prends ton temps.\"",
  },
  {
    situation: "Il evite la multiplication",
    response: "\"On reprend les tables ensemble ? Tu en connais deja !\"",
  },
  {
    situation: "Il reussit facilement",
    response: "\"Super ! Tu veux essayer un niveau plus difficile ?\"",
  },
];

export const mathBlocksWarningText = "Ne donnez pas la reponse ! Critiquer les erreurs cree de l'anxiete mathematique. L'erreur fait partie de l'apprentissage.";

export const mathBlocksTeamMessage = "\"Le calcul mental est une competence fondamentale qui facilite tous les apprentissages mathematiques. Des sessions regulieres mais courtes sont plus efficaces qu'une longue seance occasionnelle. Celebrez les progres !\"";

// =============================================================================
// TAB 4: QUESTIONS A POSER
// =============================================================================

export const mathBlocksQuestionsDuring: QuestionData[] = [
  { text: "\"Comment tu as calcule ca ?\"" },
  { text: "\"Tu vois des paires faciles ?\"" },
  { text: "\"Par quoi tu commences ?\"" },
];

export const mathBlocksQuestionsAfter: QuestionData[] = [
  { text: "\"C'etait quoi le calcul le plus difficile ?\"" },
  { text: "\"Tu as utilise une astuce ?\"" },
  { text: "\"Tu peux m'expliquer comment tu as fait ?\"" },
];

export const mathBlocksQuestionsWarning = "Valorisez la strategie, pas seulement le resultat !";

// =============================================================================
// TAB 5: VIE QUOTIDIENNE
// =============================================================================

export const mathBlocksDailyActivities: DailyActivityData[] = [
  {
    icon: '🛒',
    title: 'Courses',
    description: 'Ca coute 3e, tu donnes 5e, combien de monnaie ?',
  },
  {
    icon: '🍳',
    title: 'Cuisine',
    description: 'Il faut 2 oeufs par personne, on est 4...',
  },
  {
    icon: '🎲',
    title: 'Jeux de des',
    description: 'Additionner les points rapidement',
  },
  {
    icon: '🚗',
    title: 'Plaques',
    description: 'Additionner les chiffres des plaques',
  },
];

export const mathBlocksTransferPhrases: string[] = [
  "\"Tu peux calculer ca de tete, comme dans le jeu !\"",
  "\"Quel calcul mental tu dois faire ici ?\"",
];

export const mathBlocksResources: ResourceData[] = [
  {
    type: 'Jeu',
    icon: '🤼',
    title: 'Mathsumo',
    author: '7+ ans - Calcul mental rapide',
  },
  {
    type: 'Jeu',
    icon: '🔢',
    title: 'Num Num',
    author: '6+ ans - Associations numeriques',
  },
  {
    type: 'Jeu',
    icon: '🎲',
    title: 'Yahtzee',
    author: '7+ ans - Addition, multiplication',
  },
  {
    type: 'Jeu',
    icon: '🧗',
    title: 'Prime Climb',
    author: '8+ ans - Operations et strategie',
  },
];

// =============================================================================
// TAB 6: PROGRESSION
// =============================================================================

export const mathBlocksBadges: BadgeData[] = [
  {
    id: 'calculator',
    icon: '🧮',
    title: 'Calculateur',
    description: 'Calcule sans les doigts',
    earned: false,
  },
  {
    id: 'combo',
    icon: '🔥',
    title: 'Comboteur',
    description: 'Longue serie sans erreur',
    earned: true,
  },
  {
    id: 'speed',
    icon: '⚡',
    title: 'Eclair',
    description: 'Finit avec beaucoup de temps restant',
    earned: false,
  },
];

export const mathBlocksAgeExpectations: AgeExpectationData[] = [
  { age: 5, expectation: 'Addition 1-10' },
  { age: 6, expectation: 'Addition 1-20, debut soustraction' },
  { age: 7, expectation: 'Soustraction, tables x2 x5' },
  { age: 8, expectation: 'Toutes tables, debut division' },
  { age: 9, expectation: 'Toutes operations melangees' },
];

export const mathBlocksSettings: SettingData[] = [
  { id: 'soundEffects', label: 'Effets sonores', enabled: true },
  { id: 'showTimer', label: 'Afficher le chrono', enabled: true },
  { id: 'vibration', label: 'Vibrations', enabled: true },
  { id: 'sessionLimit', label: 'Plafond session (15 min)', enabled: true },
];

// =============================================================================
// COMPLETE DATA EXPORT
// =============================================================================

export const mathBlocksParentGuideData = {
  activityName: 'Math Blocks',
  activityEmoji: '🧮',
  gameData: mathBlocksGameData,
  appBehavior: mathBlocksAppBehavior,
  competences: mathBlocksCompetences,
  scienceData: mathBlocksScienceData,
  advices: mathBlocksAdvices,
  warningText: mathBlocksWarningText,
  teamMessage: mathBlocksTeamMessage,
  questionsDuring: mathBlocksQuestionsDuring,
  questionsAfter: mathBlocksQuestionsAfter,
  questionsWarning: mathBlocksQuestionsWarning,
  dailyActivities: mathBlocksDailyActivities,
  transferPhrases: mathBlocksTransferPhrases,
  resources: mathBlocksResources,
  badges: mathBlocksBadges,
  ageExpectations: mathBlocksAgeExpectations,
  settings: mathBlocksSettings,
};
