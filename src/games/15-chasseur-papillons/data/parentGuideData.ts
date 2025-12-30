/**
 * Parent Guide Data - Chasseur de Papillons
 * Données pour la fiche parent du jeu
 */

export const chasseurParentGuideData = {
  activityName: 'Chasseur de Papillons',
  activityEmoji: '🦋',

  gameData: {
    title: 'Chasseur de Papillons',
    emoji: '🦋',
    description: 'Un jeu d\'attention sélective où l\'enfant doit attraper les papillons qui correspondent à une règle donnée.',
    ageRange: '5-8 ans',
    duration: '3-8 min par niveau',
    category: 'Attention & Mémoire',
  },

  appBehavior: {
    description: 'L\'application présente des papillons volants avec différentes couleurs, motifs et tailles. L\'enfant doit attraper uniquement ceux qui correspondent à la consigne affichée.',
    features: [
      'Consignes visuelles claires avec icônes',
      'Papillons animés avec trajectoires variées',
      'Feedback immédiat (son et visuel)',
      'Difficulté progressive sur 10 niveaux',
      'Indices visuels disponibles',
    ],
  },

  competences: [
    {
      name: 'Attention sélective',
      description: 'Capacité à se concentrer sur les stimuli pertinents en ignorant les distracteurs',
      icon: '👁️',
    },
    {
      name: 'Mémoire de travail',
      description: 'Maintenir la règle active en mémoire pendant le jeu',
      icon: '🧠',
    },
    {
      name: 'Inhibition',
      description: 'Résister à l\'envie d\'attraper les mauvais papillons',
      icon: '🛑',
    },
    {
      name: 'Flexibilité cognitive',
      description: 'S\'adapter aux changements de règles entre les vagues',
      icon: '🔄',
    },
  ],

  scienceData: {
    title: 'Les fonctions exécutives',
    content: 'L\'attention sélective et l\'inhibition sont des fonctions exécutives cruciales pour l\'apprentissage scolaire. Ce jeu entraîne ces capacités de manière ludique, ce qui peut améliorer la concentration en classe et la régulation comportementale.',
    source: 'Diamond, A. (2013). Executive Functions. Annual Review of Psychology.',
  },

  advices: [
    'Encouragez l\'enfant à lire la consigne à voix haute avant de commencer',
    'Félicitez les bonnes décisions, pas seulement la vitesse',
    'Si l\'enfant fait beaucoup d\'erreurs, proposez-lui de prendre son temps',
    'Utilisez les indices sans culpabilité - ils font partie de l\'apprentissage',
    'Célébrez les séries de bonnes captures pour renforcer la concentration',
  ],

  warningText: 'Ce jeu implique des éléments en mouvement. Si votre enfant est sensible aux stimuli visuels rapides, commencez par les niveaux les plus lents.',

  teamMessage: 'Le Chasseur de Papillons aide les enfants à développer leur capacité de concentration de manière amusante. Les compétences travaillées ici sont directement transférables à la salle de classe !',

  questionsDuring: [
    'De quelle couleur sont les papillons que tu dois attraper ?',
    'Comment fais-tu pour ne pas te tromper ?',
    'Est-ce que c\'est difficile d\'ignorer les autres papillons ?',
  ],

  questionsAfter: [
    'Quelle règle était la plus difficile ?',
    'Comment as-tu fait pour te concentrer ?',
    'As-tu remarqué des astuces pour être plus rapide ?',
  ],

  questionsWarning: 'Ces questions aident l\'enfant à développer sa métacognition - la conscience de ses propres processus de pensée.',

  dailyActivities: [
    {
      title: 'Tri de chaussettes',
      description: 'Demandez à l\'enfant de trier les chaussettes par couleur tout en écoutant de la musique (distraction)',
      icon: '🧦',
    },
    {
      title: 'Observation en promenade',
      description: 'Chercher tous les objets rouges (ou d\'une autre couleur) pendant une balade',
      icon: '🚶',
    },
    {
      title: 'Jeu du robot',
      description: 'L\'enfant doit faire l\'action demandée seulement si vous dites "Simon dit"',
      icon: '🤖',
    },
  ],

  transferPhrases: [
    'Tu te souviens comme tu faisais attention aux bons papillons ? C\'est pareil en classe !',
    'Concentre-toi sur ce que dit la maîtresse, comme sur la consigne du jeu.',
    'Tu sais ignorer les distracteurs, tu l\'as fait avec les papillons !',
  ],

  resources: [
    {
      title: 'L\'attention chez l\'enfant',
      url: 'https://www.reseau-canope.fr/',
      type: 'article',
    },
    {
      title: 'Développer les fonctions exécutives',
      url: 'https://www.edumoov.com/',
      type: 'guide',
    },
  ],

  badges: [
    { icon: '🦋', name: 'Maître Chasseur', condition: '90% de précision sans indice' },
    { icon: '🔥', name: 'En Feu', condition: 'Série de 10 bonnes captures' },
    { icon: '👁️', name: 'Oeil de Lynx', condition: '70% de précision' },
    { icon: '💪', name: 'Persévérant', condition: 'Utilisation des indices' },
    { icon: '🌸', name: 'Explorateur', condition: 'Premier niveau terminé' },
  ],

  ageExpectations: [
    { age: '5 ans', expectations: 'Niveaux 1-3 avec aide' },
    { age: '6 ans', expectations: 'Niveaux 1-4 autonomie' },
    { age: '7 ans', expectations: 'Niveaux 1-6 avec règles composées' },
    { age: '8 ans', expectations: 'Niveaux 1-8 avec règles négatives' },
  ],

  settings: {
    soundEffects: true,
    vibration: true,
    autoHints: false,
  },
};

export default chasseurParentGuideData;
