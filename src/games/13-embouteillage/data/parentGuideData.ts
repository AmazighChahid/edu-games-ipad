/**
 * Parent Guide Data for Embouteillage
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

export const embouteillageGameData: GameObjectiveData = {
  objective: "Faire sortir la voiture rouge de l'embouteillage en déplaçant les autres véhicules.",
  optimalSolution: "Minimum de mouvements possible",
  rules: [
    "Les véhicules ne peuvent se déplacer que dans leur sens (horizontal ou vertical)",
    "Un seul véhicule peut être bougé à la fois",
    "Les véhicules ne peuvent pas se chevaucher",
  ],
  strategy: "Identifier les véhicules qui bloquent directement la sortie et les dégager en premier.",
  tip: "Parfois il faut reculer pour mieux avancer !",
};

export const embouteillageAppBehavior: AppBehaviorData = {
  does: [
    "Propose des puzzles de difficulté progressive",
    "Compte le nombre de mouvements",
    "Permet d'annuler les mouvements",
    "Propose des indices sur demande",
    "Compare au nombre optimal de mouvements",
  ],
  doesnt: [
    "Pas de limite de temps",
    "Pas de pénalité pour les mouvements supplémentaires",
    "Ne résout jamais le puzzle automatiquement",
    "Pas de publicités",
  ],
};

// =============================================================================
// TAB 2: COMPÉTENCES
// =============================================================================

export const embouteillageCompetences: CompetenceData[] = [
  {
    id: 'planning',
    icon: '🗺️',
    title: 'Planification',
    description: 'Prévoir plusieurs coups à l\'avance',
    stars: 5,
    iconBgColor: 'rgba(91, 141, 238, 0.15)',
  },
  {
    id: 'spatial',
    icon: '📐',
    title: 'Raisonnement spatial',
    description: 'Visualiser les déplacements possibles',
    stars: 5,
    iconBgColor: 'rgba(123, 199, 77, 0.15)',
  },
  {
    id: 'problem-solving',
    icon: '🧩',
    title: 'Résolution de problèmes',
    description: 'Trouver la séquence de mouvements',
    stars: 4,
    iconBgColor: 'rgba(224, 86, 253, 0.15)',
  },
  {
    id: 'flexibility',
    icon: '🔄',
    title: 'Flexibilité cognitive',
    description: 'Changer de stratégie si nécessaire',
    stars: 4,
    iconBgColor: 'rgba(255, 182, 193, 0.15)',
  },
  {
    id: 'patience',
    icon: '⏳',
    title: 'Patience',
    description: 'Persévérer face aux blocages',
    stars: 3,
    iconBgColor: 'rgba(255, 215, 0, 0.15)',
  },
  {
    id: 'optimization',
    icon: '🎯',
    title: 'Optimisation',
    description: 'Chercher le chemin le plus court',
    stars: 3,
    iconBgColor: 'rgba(139, 115, 85, 0.15)',
  },
];

export const embouteillageScienceData: ScienceData = {
  text: "Rush Hour est un classique des puzzles de planification. Ce type de jeu développe les fonctions exécutives, particulièrement la planification et l'inhibition (Diamond, 2013). Résoudre ces puzzles améliore les capacités de résolution de problèmes séquentiels.",
};

// =============================================================================
// TAB 3: ACCOMPAGNEMENT
// =============================================================================

export const embouteillageAdvices: AdviceData[] = [
  {
    situation: "Votre enfant bouge les voitures au hasard",
    response: "\"Où veux-tu aller ? Qu'est-ce qui bloque le chemin ?\"",
  },
  {
    situation: "Il est bloqué depuis longtemps",
    response: "\"Regarde la voiture rouge. Qu'est-ce qui l'empêche de sortir ?\"",
  },
  {
    situation: "Il utilise trop de mouvements",
    response: "\"Tu as réussi ! Maintenant, tu penses pouvoir faire moins de coups ?\"",
  },
  {
    situation: "Il réussit facilement",
    response: "\"Bravo ! C'était le minimum de coups ? Essayons un plus dur !\"",
  },
  {
    situation: "Il veut abandonner",
    response: "\"On utilise l'undo et on réfléchit ensemble ?\"",
  },
];

export const embouteillageWarningText = "Laissez l'enfant explorer les mouvements. Le bouton 'undo' permet d'apprendre de ses erreurs sans frustration.";

export const embouteillageTeamMessage = "\"L'embouteillage est un excellent exercice de planification ! Chaque puzzle résolu renforce la capacité à penser plusieurs étapes à l'avance. C'est une compétence précieuse dans la vie quotidienne et les apprentissages scolaires.\"";

// =============================================================================
// TAB 4: QUESTIONS À POSER
// =============================================================================

export const embouteillageQuestionsDuring: QuestionData[] = [
  { text: "\"Quelle voiture bloque la rouge ?\"" },
  { text: "\"Dans quel sens peut bouger ce camion ?\"" },
  { text: "\"Et si tu bougeais celle-là d'abord ?\"" },
];

export const embouteillageQuestionsAfter: QuestionData[] = [
  { text: "\"C'était quoi l'astuce pour ce puzzle ?\"" },
  { text: "\"Tu aurais pu faire moins de mouvements ?\"" },
  { text: "\"Quel véhicule était le plus gênant ?\"" },
];

export const embouteillageQuestionsWarning = "Encouragez l'enfant à verbaliser sa stratégie avant de bouger les pièces.";

// =============================================================================
// TAB 5: VIE QUOTIDIENNE
// =============================================================================

export const embouteillageDailyActivities: DailyActivityData[] = [
  {
    icon: '🅿️',
    title: 'Parking réel',
    description: 'Observer comment les voitures manoeuvrent',
  },
  {
    icon: '🧱',
    title: 'Blocs de construction',
    description: 'Créer des labyrinthes avec des blocs',
  },
  {
    icon: '🎲',
    title: 'Jeux de société',
    description: 'Rush Hour physique, Quoridor',
  },
  {
    icon: '📦',
    title: 'Ranger sa chambre',
    description: 'Organiser l\'espace pour tout faire tenir',
  },
];

export const embouteillageTransferPhrases: string[] = [
  "\"Comment on pourrait faire passer tous les vélos ici ?\"",
  "\"Si on veut sortir le grand carton, il faut d'abord déplacer quoi ?\"",
];

export const embouteillageResources: ResourceData[] = [
  {
    type: 'Jeu',
    icon: '🎮',
    title: 'Rush Hour',
    author: 'ThinkFun',
  },
  {
    type: 'Jeu',
    icon: '🧩',
    title: 'Rush Hour Junior',
    author: 'ThinkFun',
  },
  {
    type: 'App',
    icon: '📱',
    title: 'Unblock Me',
    author: 'Kiragames',
  },
  {
    type: 'Jeu',
    icon: '🎲',
    title: 'Quoridor',
    author: 'Gigamic',
  },
];

// =============================================================================
// TAB 6: PROGRESSION
// =============================================================================

export const embouteillageBadges: BadgeData[] = [
  {
    id: 'conducteur',
    icon: '🚗',
    title: 'Conducteur',
    description: 'Résout ses premiers embouteillages',
    earned: true,
  },
  {
    id: 'pilote',
    icon: '🏎️',
    title: 'Pilote',
    description: 'Résout en minimum de coups',
    earned: false,
  },
  {
    id: 'champion',
    icon: '🏆',
    title: 'Champion',
    description: 'Maîtrise les puzzles difficiles',
    earned: false,
  },
];

export const embouteillageAgeExpectations: AgeExpectationData[] = [
  { age: 5, expectation: 'Puzzles très simples (2-3 voitures)' },
  { age: 6, expectation: 'Puzzles simples (4-5 véhicules)' },
  { age: 7, expectation: 'Puzzles moyens (6-8 véhicules)' },
  { age: 8, expectation: 'Puzzles difficiles' },
  { age: 9, expectation: 'Puzzles experts, optimisation' },
];

export const embouteillageSettings: SettingData[] = [
  { id: 'showMoveCount', label: 'Afficher le compteur', enabled: true },
  { id: 'showOptimal', label: 'Afficher le score optimal', enabled: false },
  { id: 'enableUndo', label: 'Bouton Annuler actif', enabled: true },
  { id: 'sessionLimit', label: 'Plafond session (20 min)', enabled: true },
];

// =============================================================================
// COMPLETE DATA EXPORT
// =============================================================================

export const embouteillageParentGuideData = {
  activityName: 'Embouteillage',
  activityEmoji: '🚗',
  gameData: embouteillageGameData,
  appBehavior: embouteillageAppBehavior,
  competences: embouteillageCompetences,
  scienceData: embouteillageScienceData,
  advices: embouteillageAdvices,
  warningText: embouteillageWarningText,
  teamMessage: embouteillageTeamMessage,
  questionsDuring: embouteillageQuestionsDuring,
  questionsAfter: embouteillageQuestionsAfter,
  questionsWarning: embouteillageQuestionsWarning,
  dailyActivities: embouteillageDailyActivities,
  transferPhrases: embouteillageTransferPhrases,
  resources: embouteillageResources,
  badges: embouteillageBadges,
  ageExpectations: embouteillageAgeExpectations,
  settings: embouteillageSettings,
};
