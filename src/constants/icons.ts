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

  // Memory
  memoryPairs: '🎴',
  eyes: '👀',
  muscle: '💪',

  // Labyrinthe - Objets
  key: '🔑',
  door: '🚪',
  gem: '💎',
  button: '🔘',
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
  elephant: '🐘',
  fox: '🦊',
  dog: '🐶',
  pawprints: '🐾',
  parrot: '🦜',
  beaver: '🦫',
  ant: '🐜',

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
  play: '▶️',

  // ============================================
  // FEEDBACK & STATUS
  // ============================================
  success: '✅',
  square: '🔲',
  squareFilled: '🔳',
  checkmark: '✓',
  check: '✓',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
  lock: '🔒',
  unlock: '🔓',
  lightbulb: '💡',
  hint: '💡',
  refresh: '↻',
  close: '✕',
  search: '🔍',
  crossMark: '✗',
  starEmpty: '☆',
  starFull: '★',
  swap: '↔',
  backspace: '⌫',

  // ============================================
  // ROTATION & TRANSFORMATION
  // ============================================
  rotateLeft: '↺',
  rotateRight: '↻',
  flip: '⇄',

  // ============================================
  // FLÈCHES & DIRECTIONS
  // ============================================
  arrowLeft: '←',
  arrowRight: '→',
  arrowUp: '↑',
  arrowDown: '↓',

  // ============================================
  // MODES DE JEU
  // ============================================
  lab: '🔬',
  sandbox: '🎨',
  journal: '📖',
  experiment: '🧪',
  numbers: '🔢',
  mystery: '❓',

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
  chocolate: '🍫',
  trash: '🗑️',
  microphone: '🎙️',
  audio: '🎧',
  stop: '⏹️',
  compass: '🧭',
  heart: '❤️',
  question: '❓',
  list: '📋',

} as const;

export type IconName = keyof typeof Icons;

/**
 * Helper pour obtenir une icône avec fallback
 */
export const getIcon = (name: IconName, fallback: string = '❓'): string => {
  return Icons[name] ?? fallback;
};
