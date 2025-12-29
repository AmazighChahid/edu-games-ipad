/**
 * Parent Guide Data for Labyrinthe Logique
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

export const labyrintheGameData: GameObjectiveData = {
  objective: "Naviguer dans des labyrinthes de complexite croissante pour trouver le chemin de l'entree vers la sortie.",
  optimalSolution: "Trouver la sortie avec le minimum de retours en arriere",
  rules: [
    "Glisser le doigt pour deplacer le personnage",
    "Collecter les cles pour ouvrir les portes",
    "Trouver la sortie marquee par une etoile",
  ],
  strategy: "Observer le labyrinthe avant de commencer, reperer les impasses et planifier son chemin.",
  tip: "Chaque impasse t'apprend ou NE PAS aller !",
};

export const labyrintheAppBehavior: AppBehaviorData = {
  does: [
    "Laisse explorer a son rythme",
    "Affiche un fil d'Ariane optionnel",
    "Propose une mini-carte",
    "Celebre chaque sortie trouvee",
    "Adapte la difficulte progressivement",
  ],
  doesnt: [
    "Pas de chronometre stressant",
    "Pas de penalite pour les impasses",
    "Jamais de chemin montre directement",
    "Pas de comparaison avec d'autres",
  ],
};

// =============================================================================
// TAB 2: COMPETENCES
// =============================================================================

export const labyrintheCompetences: CompetenceData[] = [
  {
    id: 'spatial',
    icon: '🗺️',
    title: 'Orientation spatiale',
    description: 'Construire une carte mentale',
    stars: 5,
    iconBgColor: 'rgba(91, 141, 238, 0.15)',
  },
  {
    id: 'workingMemory',
    icon: '🧠',
    title: 'Memoire de travail',
    description: 'Retenir les chemins deja essayes',
    stars: 5,
    iconBgColor: 'rgba(123, 199, 77, 0.15)',
  },
  {
    id: 'flexibility',
    icon: '🔄',
    title: 'Flexibilite cognitive',
    description: 'Changer de strategie face a un obstacle',
    stars: 4,
    iconBgColor: 'rgba(255, 179, 71, 0.15)',
  },
  {
    id: 'planning',
    icon: '📋',
    title: 'Planification',
    description: 'Anticiper plusieurs etapes',
    stars: 4,
    iconBgColor: 'rgba(224, 86, 253, 0.15)',
  },
  {
    id: 'perseverance',
    icon: '💪',
    title: 'Perseverance',
    description: 'Continuer malgre les impasses',
    stars: 4,
    iconBgColor: 'rgba(255, 182, 193, 0.15)',
  },
  {
    id: 'inhibition',
    icon: '✋',
    title: 'Inhibition',
    description: 'Resister a l\'envie de revenir inutilement',
    stars: 3,
    iconBgColor: 'rgba(139, 115, 85, 0.15)',
  },
];

export const labyrintheScienceData: ScienceData = {
  text: "La representation spatiale se construit progressivement (Piaget, 1956). Le concept de \"carte cognitive\" permet de planifier des trajets (Tolman, 1948). Les fonctions executives developpees par les labyrinthes sont des predicteurs majeurs de la reussite scolaire (Diamond, 2013).",
};

// =============================================================================
// TAB 3: ACCOMPAGNEMENT
// =============================================================================

export const labyrintheAdvices: AdviceData[] = [
  {
    situation: "Votre enfant tourne en rond",
    response: "\"Tu te souviens d'etre passe par la ?\" (activer le fil d'Ariane)",
  },
  {
    situation: "Il s'enerve a chaque impasse",
    response: "\"C'est normal de rencontrer des murs. Ca t'apprend ou ne pas aller !\"",
  },
  {
    situation: "Il demande toujours les indices",
    response: "\"Tu veux d'abord essayer seul ? Je suis sur que tu peux !\"",
  },
  {
    situation: "Il finit tres vite",
    response: "\"Super ! Tu veux essayer de collecter les gemmes bonus ?\"",
  },
  {
    situation: "Il a peur d'etre perdu",
    response: "\"Regarde la mini-carte, tu vois ou tu es. Tu es en securite !\"",
  },
];

export const labyrintheWarningText = "Ne montrez pas le chemin ! Pointer la direction coupe le processus d'apprentissage. Les impasses SONT l'apprentissage.";

export const labyrintheTeamMessage = "\"Le labyrinthe est un exercice cognitif complet qui developpe l'orientation spatiale, la memoire de travail et la perseverance. Laissez votre enfant explorer, se tromper et recommencer. C'est ainsi qu'il construit sa carte mentale !\"";

// =============================================================================
// TAB 4: QUESTIONS A POSER
// =============================================================================

export const labyrintheQuestionsDuring: QuestionData[] = [
  { text: "\"Par ou vas-tu commencer ?\"" },
  { text: "\"Tu vois combien de chemins possibles ?\"" },
  { text: "\"Qu'est-ce que tu n'as pas encore essaye ?\"" },
];

export const labyrintheQuestionsAfter: QuestionData[] = [
  { text: "\"Comment tu as fait pour trouver ?\"" },
  { text: "\"C'etait quoi le moment le plus difficile ?\"" },
  { text: "\"Tu voudrais reessayer pour battre ton temps ?\"" },
];

export const labyrintheQuestionsWarning = "Questions ouvertes > Directions donnees. Guidez sa reflexion, pas ses pas !";

// =============================================================================
// TAB 5: VIE QUOTIDIENNE
// =============================================================================

export const labyrintheDailyActivities: DailyActivityData[] = [
  {
    icon: '🗺️',
    title: 'Chasse au tresor',
    description: 'Cacher un objet et donner des indices directionnels',
  },
  {
    icon: '🏠',
    title: 'Plan de la maison',
    description: 'Dessiner sa chambre vue de dessus',
  },
  {
    icon: '🚶',
    title: 'Donner le chemin',
    description: 'L\'enfant guide vers un lieu connu',
  },
  {
    icon: '🌲',
    title: 'Randonnee',
    description: 'Suivre un sentier balise ensemble',
  },
];

export const labyrintheTransferPhrases: string[] = [
  "\"Tu te souviens du chemin ? Comme dans le jeu du labyrinthe !\"",
  "\"Fais-toi une carte dans ta tete pour retrouver le chemin.\"",
];

export const labyrintheResources: ResourceData[] = [
  {
    type: 'Jeu',
    icon: '🧩',
    title: 'Labyrinthe (Ravensburger)',
    author: '7+ ans - Labyrinthe qui change',
  },
  {
    type: 'Jeu',
    icon: '🏝️',
    title: 'Karuba',
    author: '8+ ans - Construction de chemin',
  },
  {
    type: 'Jeu',
    icon: '🤖',
    title: 'Ricochet Robots',
    author: '10+ ans - Planification',
  },
  {
    type: 'Activite',
    icon: '📍',
    title: 'Geocaching',
    author: 'Tous ages - Orientation GPS',
  },
];

// =============================================================================
// TAB 6: PROGRESSION
// =============================================================================

export const labyrintheBadges: BadgeData[] = [
  {
    id: 'explorer',
    icon: '🧭',
    title: 'Explorateur',
    description: 'Decouvre tout le labyrinthe',
    earned: true,
  },
  {
    id: 'efficient',
    icon: '🎯',
    title: 'Efficace',
    description: 'Trouve la sortie rapidement',
    earned: false,
  },
  {
    id: 'collector',
    icon: '💎',
    title: 'Collectionneur',
    description: 'Ramasse toutes les gemmes bonus',
    earned: false,
  },
];

export const labyrintheAgeExpectations: AgeExpectationData[] = [
  { age: 6, expectation: 'Grilles 5x5, beaucoup de retours' },
  { age: 7, expectation: 'Grilles 7x7, debut planification' },
  { age: 8, expectation: 'Cles/portes, coordination d\'objectifs' },
  { age: 9, expectation: 'Grilles 11x11+, exploration optimisee' },
];

export const labyrintheSettings: SettingData[] = [
  { id: 'showTrail', label: 'Fil d\'Ariane', enabled: true },
  { id: 'showMinimap', label: 'Mini-carte', enabled: true },
  { id: 'soundEffects', label: 'Effets sonores', enabled: true },
  { id: 'sessionLimit', label: 'Plafond session (20 min)', enabled: true },
];

// =============================================================================
// COMPLETE DATA EXPORT
// =============================================================================

export const labyrintheParentGuideData = {
  activityName: 'Labyrinthe Logique',
  activityEmoji: '🗺️',
  gameData: labyrintheGameData,
  appBehavior: labyrintheAppBehavior,
  competences: labyrintheCompetences,
  scienceData: labyrintheScienceData,
  advices: labyrintheAdvices,
  warningText: labyrintheWarningText,
  teamMessage: labyrintheTeamMessage,
  questionsDuring: labyrintheQuestionsDuring,
  questionsAfter: labyrintheQuestionsAfter,
  questionsWarning: labyrintheQuestionsWarning,
  dailyActivities: labyrintheDailyActivities,
  transferPhrases: labyrintheTransferPhrases,
  resources: labyrintheResources,
  badges: labyrintheBadges,
  ageExpectations: labyrintheAgeExpectations,
  settings: labyrintheSettings,
};
