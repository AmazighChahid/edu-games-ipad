/**
 * Constantes pour les icônes emoji utilisées dans l'application
 * Centralise tous les emojis pour faciliter la maintenance
 */

export const Icons = {
  // ============================================
  // NAVIGATION & ACTIONS
  // ============================================
  pedagogy: '🎓',
  help: '?',
  settings: '⚙️',
  home: '🏠',
  back: '←',

  // ============================================
  // FAMILLE & PROFIL
  // ============================================
  family: '👨‍👩‍👧',
  profile: '👤',

  // ============================================
  // RÉCOMPENSES & SUCCÈS
  // ============================================
  star: '⭐',
  trophy: '🏆',
  sparkles: '✨',
  fire: '🔥',
  rocket: '🚀',

  // Médailles
  medalBronze: '🥉',
  medalSilver: '🥈',
  medalGold: '🥇',
  medalDiamond: '💎',

  // Badges
  badgeProgress: '📈',
  badgeTarget: '🎯',
  badgeCelebration: '🎉',

  // ============================================
  // SALUTATIONS & ÉMOTIONS
  // ============================================
  wave: '👋',
  thinking: '🤔',
  celebration: '🎉',

  // ============================================
  // CATÉGORIES DE JEUX
  // ============================================
  categoryAll: '🏠',
  categoryFavorites: '❤️',
  categoryLogic: '🧠',
  categoryMath: '🔢',
  categoryReading: '📖',
  categoryTarget: '🎯',
  categoryPuzzle: '🧩',

  // ============================================
  // JEUX SPÉCIFIQUES
  // ============================================
  // Tour de Hanoï
  hanoi: '🗼',
  castle: '🏰',

  // Puzzle & Logique
  puzzle: '🧩',
  brain: '🧠',
  blocks: '🧱',

  // Mathématiques
  math: '🔢',
  abacus: '🧮',
  balance: '⚖️',

  // Lecture & Écriture
  letters: '🔤',
  book: '📚',
  writing: '📝',

  // Autres jeux
  dice: '🎲',
  target: '🎯',
  map: '🗺️',
  crystal: '🔮',
  car: '🚗',
  spiral: '🌀',
  cards: '🃏',
  colors: '🎨',
  game: '🎮',

  // Labyrinthe - Objets
  key: '🔑',
  door: '🚪',
  gem: '💎',
  ice: '❄️',
  garden: '🌸',
  cave: '🦇',
  candle: '🕯️',
  crown: '👑',
  tent: '🏕️',

  // ============================================
  // MASCOTTE & ANIMAUX
  // ============================================
  owl: '🦉',
  rabbit: '🐰',
  turtle: '🐢',
  cat: '🐱',
  bear: '🐻',
  panda: '🐼',
  penguin: '🐧',
  dragon: '🐉',
  tiger: '🐯',
  butterfly: '🦋',
  bird: '🐦',
  squirrel: '🐿️',
  hedgehog: '🦔',
  robot: '🤖',

  // ============================================
  // NATURE & FLEURS
  // ============================================
  flowerCherry: '🌸',
  flowerSunflower: '🌻',
  flowerTulip: '🌷',
  flowerHibiscus: '🌺',
  flowerBlossom: '🌼',
  flowerRose: '🌹',
  flowerHyacinth: '🪻',
  tree: '🌳',
  seedling: '🌱',
  mountain: '⛰️',
  comet: '☄️',
  moon: '🌙',
  galaxy: '🌌',

  // ============================================
  // TEMPS & PLANIFICATION
  // ============================================
  clock: '⏰',
  timer: '⏱️',
  calendar: '📅',
  sun: '☀️',
  pause: '⏸️',

  // ============================================
  // FEEDBACK & STATUS
  // ============================================
  success: '✅',
  checkmark: '✓',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
  lock: '🔒',
  unlock: '🔓',

  // ============================================
  // OBJETS & DIVERS
  // ============================================
  clipboard: '📋',
  chart: '📊',
  link: '🔗',
  wrench: '🔧',
  shield: '🛡️',
  topHat: '🎩',
  chess: '♟️',
  peace: '☮️',
  calm: '😌',
  music: '🎵',
  apple: '🍎',
  plate: '🍽️',
  friends: '🤝',

} as const;

export type IconName = keyof typeof Icons;

/**
 * Helper pour obtenir une icône avec fallback
 */
export const getIcon = (name: IconName, fallback: string = '❓'): string => {
  return Icons[name] ?? fallback;
};
