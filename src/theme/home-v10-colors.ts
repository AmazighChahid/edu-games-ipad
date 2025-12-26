/**
 * HomeScreen V10 - "Forêt Immersive" Color Theme
 * Palette de couleurs et gradients pour l'écran d'accueil V10
 */

export const HomeV10Colors = {
  // Ciel
  skyTop: '#7EC8E3',
  skyMid: '#A8E0F0',
  skyLight: '#C5EAF0',
  skyTransition: '#D4F0D4',

  // Végétation
  grassLight: '#A8D9A8',
  grass: '#7BC74D',
  grassDark: '#5BAE6B',
  hillLight: '#7DD78D',
  hillMid: '#6FCF7F',
  hillDark: '#5BBE6B',
  treeLight: '#4D9B5F',
  treeMid: '#3D8B4F',
  treeDark: '#2D6B3F',
  treeFar: '#2D5A3F',

  // Montagnes
  mountainFar: '#7A9E8A',
  mountainMid: '#6B8E7B',
  mountainNear: '#5A9D6A',
  mountainDark: '#5A7D6A',
  mountainSnow: 'rgba(255,255,255,0.6)',

  // Piou
  piouBody: '#D4A574',
  piouBodyDark: '#C49A6C',
  piouBelly: '#F5E6D3',
  piouBeak: '#FFB347',
  piouEye: '#FFFFFF',
  piouPupil: '#2C1810',

  // Soleil
  sunCore: '#FFE066',
  sunMid: '#FFD93D',
  sunOuter: '#F5C800',
  sunGlow: 'rgba(255,217,61,0.3)',

  // UI
  bubbleBg: 'rgba(255,255,255,0.97)',
  cardBg: 'rgba(255,255,255,0.95)',
  textPrimary: '#2D3436',
  textSecondary: '#4A5568',
  textAccent: '#5B8DEE',

  // Trunk (bois)
  trunkLight: '#8B5A2B',
  trunkMid: '#5D4023',
  trunkDark: '#5D4023',
};

// Gradient du ciel (vertical)
export const skyGradient = {
  colors: [
    '#7EC8E3',  // Bleu ciel haut
    '#A8E0F0',  // Bleu clair
    '#C5EAF0',  // Bleu très pâle
    '#D4F0D4',  // Transition vert pâle
    '#A8D9A8',  // Vert prairie
    '#7BC74D',  // Vert herbe
    '#5BAE6B',  // Vert forêt
  ] as const,
  locations: [0, 0.2, 0.35, 0.5, 0.65, 0.8, 1] as const,
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
};

// Gradients pour les cartes de jeu
export const gameCardGradients = {
  blue: ['#5B8DEE', '#3B6FCE'] as const,
  purple: ['#9B59B6', '#8E44AD'] as const,
  orange: ['#F39C12', '#D68910'] as const,
  teal: ['#00B894', '#00876A'] as const,
  pink: ['#FD79A8', '#E84393'] as const,
  indigo: ['#6C5CE7', '#5541D7'] as const,
  coral: ['#FF7675', '#D63031'] as const,
  cyan: ['#00CEC9', '#0097A7'] as const,
  amber: ['#FDCB6E', '#E17055'] as const,
};

// Gradients pour les médailles
export const medalGradients = {
  none: ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.15)'] as const, // Non joué mais accessible
  bronze: ['#CD7F32', '#8B5A2B'] as const,
  silver: ['#C0C0C0', '#909090'] as const,
  gold: ['#FFD700', '#FFA500'] as const,
  diamond: ['#B9F2FF', '#00CED1'] as const,
  locked: ['rgba(100,100,100,0.4)', 'rgba(80,80,80,0.3)'] as const,
};

// Dimensions et layout
export const HomeV10Layout = {
  // Screen
  screenPadding: 60,

  // Header
  headerPaddingVertical: 24,
  avatarSize: 72,
  avatarLevelSize: 28,
  statPaddingH: 22,
  statPaddingV: 12,

  // Games
  gamesSectionPaddingTop: 260,
  gamesSectionPaddingH: 80,
  gamesSectionPaddingBottom: 80,
  gamesRowGap: 60,
  gamesRowMarginBottom: 50,

  // Game Card
  gameCardWidth: 320,
  gameCardHeight: 180,
  gameCardBorderRadius: 32,
  gameCardPadding: 28,

  // Piou
  piouTop: 110,
  piouLeft: 80,
  piouSize: 80,
  bubbleWidth: 420,
  bubbleLeft: 105,

  // Collection
  collectionTop: 110,
  collectionRight: 80,
  miniCardWidth: 70,
  miniCardHeight: 95,
  badgeSize: 48,

  // Typography
  gameTitleSize: 26,
  greetingSize: 28,
  bubbleTextSize: 17,
};

// Z-index layers (du bas vers le haut)
export const HomeV10ZIndex = {
  sky: 0,
  mountainsFar: 2,
  mountainsNear: 3,
  clouds: 4,
  sun: 5,
  hills: 6,
  trees: 7,
  bushes: 8,
  garden: 9,
  animals: 11,
  content: 30,
  floatingElements: 50,
};

// Animation durations
export const HomeV10Animations = {
  // Background elements
  sunPulse: 4000,
  sunGlow: 3000,
  cloudMove: [35000, 42000, 50000, 38000] as const,
  flowerSway: 4000,
  plantSway: 3000,

  // Animals
  birdFly: [14000, 18000, 22000] as const,
  squirrelRun: 28000,
  rabbitHop: 22000,
  ladybugWalk: 30000,
  beeFly: 20000,
  butterflyFly: [10000, 12000, 11000] as const,

  // Piou
  piouFly: 6000,
  wingFlap: 400,

  // Collection
  collectionFloat: 5000,
  sparkleFloat: 3000,

  // UI interactions
  buttonPress: 200,
  cardHover: 300,
};
