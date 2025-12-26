/**
 * Collection Cards Data
 * 20 collectible cards organized by thematic categories
 */

// ============================================
// TYPES
// ============================================

export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type CardCategory = 'animals' | 'robots' | 'nature' | 'stars';

export interface CardStats {
  intelligence: number;
  speed: number;
  strategy: number;
}

export interface CardUnlockCondition {
  type: 'fixed' | 'random';
  // For fixed unlocks
  activity?: string;
  level?: number;
  requirement?: string;
  // For random unlocks
  rarityPool?: CardRarity;
  minLevel?: number;
}

export interface Card {
  id: string;
  name: string;
  emoji: string;
  category: CardCategory;
  rarity: CardRarity;
  title: string;
  traits: string[];
  story: string;
  stats: CardStats;
  unlockCondition: CardUnlockCondition;
  number: number; // Card number in collection (#001, #002, etc.)
}

// ============================================
// RARITY CONFIGURATION
// ============================================

export const RARITY_CONFIG: Record<CardRarity, {
  label: string;
  color: string;
  gradientColors: [string, string];
  dropChance: number; // Probability in random pool
}> = {
  common: {
    label: 'Commun',
    color: '#A0AEC0',
    gradientColors: ['#A0AEC0', '#718096'],
    dropChance: 0.50,
  },
  rare: {
    label: 'Rare',
    color: '#5B8DEE',
    gradientColors: ['#5B8DEE', '#4A7BD9'],
    dropChance: 0.30,
  },
  epic: {
    label: 'Épique',
    color: '#E056FD',
    gradientColors: ['#E056FD', '#9B59B6'],
    dropChance: 0.15,
  },
  legendary: {
    label: 'Légendaire',
    color: '#FFD700',
    gradientColors: ['#FFD700', '#FFA500'],
    dropChance: 0.05,
  },
};

// ============================================
// CATEGORY CONFIGURATION
// ============================================

export const CATEGORY_CONFIG: Record<CardCategory, {
  label: string;
  emoji: string;
  color: string;
  gradientColors: [string, string];
}> = {
  animals: {
    label: 'Animaux de la Forêt',
    emoji: '🦊',
    color: '#FFB347',
    gradientColors: ['#FFB347', '#FFA020'],
  },
  robots: {
    label: 'Robots du Futur',
    emoji: '🤖',
    color: '#7BC74D',
    gradientColors: ['#7BC74D', '#5FB030'],
  },
  nature: {
    label: 'Gardiens de la Nature',
    emoji: '🌿',
    color: '#5B8DEE',
    gradientColors: ['#5B8DEE', '#4A7BD9'],
  },
  stars: {
    label: 'Étoiles Cosmiques',
    emoji: '⭐',
    color: '#E056FD',
    gradientColors: ['#E056FD', '#C840E0'],
  },
};

// ============================================
// ALL CARDS DATA (20 cards)
// ============================================

export const ALL_CARDS: Card[] = [
  // ========== ANIMAUX (5 cards) ==========
  {
    id: 'card_felix_fox',
    name: 'Félix le Renard',
    emoji: '🦊',
    category: 'animals',
    rarity: 'legendary',
    title: 'Maître Stratège',
    traits: ['🧠 Logique', '🎯 Précision'],
    story: 'Félix est le plus malin des animaux de la forêt ! Il adore résoudre des énigmes et aider ses amis à trouver des solutions. Son super-pouvoir ? Voir 3 coups à l\'avance !',
    stats: { intelligence: 98, speed: 85, strategy: 92 },
    unlockCondition: {
      type: 'fixed',
      activity: 'hanoi',
      level: 4,
      requirement: '3 disques en optimal',
    },
    number: 1,
  },
  {
    id: 'card_luna_owl',
    name: 'Luna la Chouette',
    emoji: '🦉',
    category: 'animals',
    rarity: 'epic',
    title: 'Sage Nocturne',
    traits: ['📚 Sage', '🌙 Nocturne'],
    story: 'Luna veille sur la forêt pendant la nuit. Elle connaît tous les secrets des étoiles et guide les animaux perdus avec sa sagesse infinie.',
    stats: { intelligence: 95, speed: 70, strategy: 88 },
    unlockCondition: { type: 'random', rarityPool: 'epic', minLevel: 3 },
    number: 2,
  },
  {
    id: 'card_noisette_squirrel',
    name: 'Noisette l\'Écureuil',
    emoji: '🐿️',
    category: 'animals',
    rarity: 'rare',
    title: 'Collectionneur Agile',
    traits: ['⚡ Rapide', '🌰 Collectionneur'],
    story: 'Noisette connaît chaque cachette de la forêt ! Avec sa mémoire incroyable, il n\'oublie jamais où il a rangé ses trésors.',
    stats: { intelligence: 75, speed: 95, strategy: 72 },
    unlockCondition: { type: 'random', rarityPool: 'rare', minLevel: 2 },
    number: 3,
  },
  {
    id: 'card_pompon_rabbit',
    name: 'Pompon le Lapin',
    emoji: '🐰',
    category: 'animals',
    rarity: 'common',
    title: 'Explorateur Curieux',
    traits: ['🫧 Curieux', '🥕 Gourmand'],
    story: 'Pompon saute partout ! Sa curiosité sans limite l\'amène à découvrir des endroits extraordinaires. Il ne peut pas s\'empêcher de poser des questions.',
    stats: { intelligence: 68, speed: 88, strategy: 60 },
    unlockCondition: { type: 'random', rarityPool: 'common', minLevel: 1 },
    number: 4,
  },
  {
    id: 'card_pico_hedgehog',
    name: 'Pico le Hérisson',
    emoji: '🦔',
    category: 'animals',
    rarity: 'rare',
    title: 'Protecteur Épineux',
    traits: ['🛡️ Protecteur', '💪 Courageux'],
    story: 'Pico est petit mais courageux ! Il protège tous ses amis avec ses piquants magiques. Rien ne lui fait peur quand il s\'agit d\'aider les autres.',
    stats: { intelligence: 72, speed: 65, strategy: 80 },
    unlockCondition: { type: 'random', rarityPool: 'rare', minLevel: 2 },
    number: 5,
  },

  // ========== ROBOTS (5 cards) ==========
  {
    id: 'card_pixel_robot',
    name: 'Pixel le Robot',
    emoji: '🤖',
    category: 'robots',
    rarity: 'legendary',
    title: 'Génie Numérique',
    traits: ['💻 Programmeur', '🔢 Calculateur'],
    story: 'Pixel est le robot le plus intelligent de la galaxie ! Il peut résoudre n\'importe quel puzzle en quelques secondes grâce à son super-processeur quantique.',
    stats: { intelligence: 99, speed: 90, strategy: 95 },
    unlockCondition: {
      type: 'fixed',
      activity: 'sudoku',
      level: 10,
      requirement: 'Niveau 10 complété',
    },
    number: 6,
  },
  {
    id: 'card_gizmo_robot',
    name: 'Gizmo l\'Inventeur',
    emoji: '🔧',
    category: 'robots',
    rarity: 'epic',
    title: 'Bricoleur Fou',
    traits: ['🔩 Inventeur', '💡 Créatif'],
    story: 'Gizmo passe ses journées à inventer des gadgets extraordinaires. Parfois ça explose, mais le résultat est toujours spectaculaire !',
    stats: { intelligence: 88, speed: 75, strategy: 82 },
    unlockCondition: { type: 'random', rarityPool: 'epic', minLevel: 3 },
    number: 7,
  },
  {
    id: 'card_beep_robot',
    name: 'Beep le Messager',
    emoji: '📡',
    category: 'robots',
    rarity: 'rare',
    title: 'Communicateur Ultra-Rapide',
    traits: ['📨 Messager', '🌐 Connecté'],
    story: 'Beep peut envoyer des messages à travers toute la galaxie en un clin d\'œil. Il est le lien entre tous les robots de l\'univers.',
    stats: { intelligence: 78, speed: 98, strategy: 70 },
    unlockCondition: { type: 'random', rarityPool: 'rare', minLevel: 2 },
    number: 8,
  },
  {
    id: 'card_bolt_robot',
    name: 'Bolt le Rapide',
    emoji: '⚡',
    category: 'robots',
    rarity: 'common',
    title: 'Coureur Électrique',
    traits: ['🏃 Rapide', '⚡ Énergique'],
    story: 'Bolt est le robot le plus rapide ! Il adore les courses et ne peut jamais rester en place. Son énergie est contagieuse !',
    stats: { intelligence: 65, speed: 99, strategy: 55 },
    unlockCondition: { type: 'random', rarityPool: 'common', minLevel: 1 },
    number: 9,
  },
  {
    id: 'card_nova_robot',
    name: 'Nova l\'Astronaute',
    emoji: '🚀',
    category: 'robots',
    rarity: 'rare',
    title: 'Explorateur Spatial',
    traits: ['🌌 Explorateur', '🛸 Aventurier'],
    story: 'Nova a visité 1000 planètes ! Elle ramène des histoires incroyables de ses voyages et rêve de découvrir de nouveaux mondes.',
    stats: { intelligence: 82, speed: 85, strategy: 78 },
    unlockCondition: { type: 'random', rarityPool: 'rare', minLevel: 2 },
    number: 10,
  },

  // ========== NATURE (5 cards) ==========
  {
    id: 'card_flora_guardian',
    name: 'Flora la Gardienne',
    emoji: '🌸',
    category: 'nature',
    rarity: 'legendary',
    title: 'Reine des Fleurs',
    traits: ['🌺 Floraison', '💚 Guérisseuse'],
    story: 'Flora fait pousser les plus belles fleurs du monde ! Elle peut soigner n\'importe quelle plante malade et transformer un désert en jardin.',
    stats: { intelligence: 90, speed: 60, strategy: 88 },
    unlockCondition: {
      type: 'fixed',
      activity: 'collection',
      requirement: '100% d\'une catégorie',
    },
    number: 11,
  },
  {
    id: 'card_rocky_mountain',
    name: 'Rocky le Montagnard',
    emoji: '⛰️',
    category: 'nature',
    rarity: 'epic',
    title: 'Gardien des Sommets',
    traits: ['🏔️ Solide', '🦅 Vigilant'],
    story: 'Rocky surveille les montagnes depuis des millénaires. Rien n\'échappe à son regard perçant et il protège tous les animaux des hauteurs.',
    stats: { intelligence: 75, speed: 50, strategy: 90 },
    unlockCondition: { type: 'random', rarityPool: 'epic', minLevel: 3 },
    number: 12,
  },
  {
    id: 'card_aqua_wave',
    name: 'Aqua la Vague',
    emoji: '🌊',
    category: 'nature',
    rarity: 'rare',
    title: 'Danseuse des Océans',
    traits: ['💧 Fluide', '🐚 Mystérieuse'],
    story: 'Aqua danse avec les courants marins et connaît tous les secrets des profondeurs. Les poissons la suivent partout où elle va.',
    stats: { intelligence: 80, speed: 88, strategy: 75 },
    unlockCondition: { type: 'random', rarityPool: 'rare', minLevel: 2 },
    number: 13,
  },
  {
    id: 'card_sunny_sunflower',
    name: 'Sunny le Tournesol',
    emoji: '🌻',
    category: 'nature',
    rarity: 'common',
    title: 'Ami du Soleil',
    traits: ['☀️ Joyeux', '🌞 Optimiste'],
    story: 'Sunny suit toujours le soleil et répand la joie partout ! Son sourire radieux illumine même les jours les plus gris.',
    stats: { intelligence: 60, speed: 55, strategy: 65 },
    unlockCondition: { type: 'random', rarityPool: 'common', minLevel: 1 },
    number: 14,
  },
  {
    id: 'card_fern_forest',
    name: 'Fern la Fougère',
    emoji: '🌿',
    category: 'nature',
    rarity: 'rare',
    title: 'Ancienne Sage',
    traits: ['🍃 Ancienne', '📖 Savante'],
    story: 'Fern existe depuis l\'époque des dinosaures ! Elle a vu le monde changer et possède une sagesse millénaire.',
    stats: { intelligence: 92, speed: 40, strategy: 85 },
    unlockCondition: { type: 'random', rarityPool: 'rare', minLevel: 2 },
    number: 15,
  },

  // ========== ÉTOILES (5 cards) ==========
  {
    id: 'card_stella_star',
    name: 'Stella l\'Étoile',
    emoji: '⭐',
    category: 'stars',
    rarity: 'legendary',
    title: 'Reine des Cieux',
    traits: ['✨ Brillante', '🌟 Inspirante'],
    story: 'Stella brille plus fort que toutes les autres étoiles ! Elle guide les voyageurs perdus et exauce les vœux des enfants sages.',
    stats: { intelligence: 95, speed: 99, strategy: 90 },
    unlockCondition: {
      type: 'fixed',
      activity: 'streak',
      requirement: '7 jours consécutifs',
    },
    number: 16,
  },
  {
    id: 'card_cosmo_comet',
    name: 'Cosmo la Comète',
    emoji: '☄️',
    category: 'stars',
    rarity: 'epic',
    title: 'Voyageur Éternel',
    traits: ['🌠 Voyageur', '💫 Mystique'],
    story: 'Cosmo traverse l\'univers depuis des milliards d\'années. Chaque fois qu\'il passe près de la Terre, il apporte chance et émerveillement.',
    stats: { intelligence: 85, speed: 99, strategy: 80 },
    unlockCondition: { type: 'random', rarityPool: 'epic', minLevel: 3 },
    number: 17,
  },
  {
    id: 'card_luna_moon',
    name: 'Luna la Lune',
    emoji: '🌙',
    category: 'stars',
    rarity: 'rare',
    title: 'Gardienne des Rêves',
    traits: ['🌜 Douce', '💤 Protectrice'],
    story: 'Luna veille sur tous les enfants qui dorment. Elle chasse les cauchemars et apporte les plus beaux rêves.',
    stats: { intelligence: 88, speed: 70, strategy: 82 },
    unlockCondition: { type: 'random', rarityPool: 'rare', minLevel: 2 },
    number: 18,
  },
  {
    id: 'card_spark_firefly',
    name: 'Spark la Luciole',
    emoji: '🔥',
    category: 'stars',
    rarity: 'common',
    title: 'Petite Lumière',
    traits: ['💡 Lumineuse', '🎇 Magique'],
    story: 'Spark est minuscule mais sa lumière est immense ! Elle illumine les chemins sombres et apporte l\'espoir partout où elle passe.',
    stats: { intelligence: 62, speed: 85, strategy: 58 },
    unlockCondition: { type: 'random', rarityPool: 'common', minLevel: 1 },
    number: 19,
  },
  {
    id: 'card_nebula_cloud',
    name: 'Nebula le Nuage',
    emoji: '🌌',
    category: 'stars',
    rarity: 'rare',
    title: 'Créateur d\'Étoiles',
    traits: ['🌀 Créateur', '☁️ Mystérieux'],
    story: 'Nebula est une pouponnière d\'étoiles ! Dans ses nuages colorés naissent de nouvelles étoiles qui illumineront l\'univers.',
    stats: { intelligence: 90, speed: 45, strategy: 88 },
    unlockCondition: { type: 'random', rarityPool: 'rare', minLevel: 2 },
    number: 20,
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get card by ID
 */
export const getCardById = (cardId: string): Card | undefined => {
  return ALL_CARDS.find((card) => card.id === cardId);
};

/**
 * Get cards by category
 */
export const getCardsByCategory = (category: CardCategory): Card[] => {
  return ALL_CARDS.filter((card) => card.category === category);
};

/**
 * Get cards by rarity
 */
export const getCardsByRarity = (rarity: CardRarity): Card[] => {
  return ALL_CARDS.filter((card) => card.rarity === rarity);
};

/**
 * Get all legendary cards (for fixed unlocks)
 */
export const getLegendaryCards = (): Card[] => {
  return ALL_CARDS.filter((card) => card.rarity === 'legendary');
};

/**
 * Get random pool cards (non-legendary)
 */
export const getRandomPoolCards = (): Card[] => {
  return ALL_CARDS.filter((card) => card.unlockCondition.type === 'random');
};

/**
 * Check if a card should be unlocked based on completion
 */
export const shouldUnlockCard = (
  card: Card,
  gameId: string,
  levelNumber: number,
  additionalConditions?: {
    isOptimal?: boolean;
    streakDays?: number;
    categoryCompletion?: number;
  }
): boolean => {
  const condition = card.unlockCondition;

  if (condition.type !== 'fixed') return false;

  // Check activity match
  if (condition.activity && condition.activity !== gameId) return false;

  // Check level requirement
  if (condition.level && levelNumber < condition.level) return false;

  // Special conditions
  if (condition.requirement?.includes('optimal') && !additionalConditions?.isOptimal) {
    return false;
  }

  if (condition.requirement?.includes('jours') && additionalConditions?.streakDays) {
    const requiredDays = parseInt(condition.requirement.match(/\d+/)?.[0] || '0');
    if (additionalConditions.streakDays < requiredDays) return false;
  }

  if (condition.requirement?.includes('100%') && additionalConditions?.categoryCompletion) {
    if (additionalConditions.categoryCompletion < 100) return false;
  }

  return true;
};

/**
 * Get a random card from the pool based on rarity chances
 */
export const getRandomCardFromPool = (
  unlockedCardIds: string[],
  minLevel: number = 1
): Card | null => {
  // Filter available cards (not yet unlocked, from random pool)
  const availableCards = getRandomPoolCards().filter(
    (card) =>
      !unlockedCardIds.includes(card.id) &&
      (card.unlockCondition.minLevel || 1) <= minLevel
  );

  if (availableCards.length === 0) return null;

  // Calculate total weight
  let totalWeight = 0;
  const weightedCards = availableCards.map((card) => {
    const weight = RARITY_CONFIG[card.rarity].dropChance;
    totalWeight += weight;
    return { card, weight };
  });

  // Random selection
  let random = Math.random() * totalWeight;
  for (const { card, weight } of weightedCards) {
    random -= weight;
    if (random <= 0) return card;
  }

  // Fallback to first available
  return availableCards[0];
};

/**
 * Get total cards count
 */
export const getTotalCardsCount = (): number => ALL_CARDS.length;

/**
 * Get category progress
 */
export const getCategoryProgress = (
  category: CardCategory,
  unlockedCardIds: string[]
): { unlocked: number; total: number; percentage: number } => {
  const categoryCards = getCardsByCategory(category);
  const unlockedCount = categoryCards.filter((card) =>
    unlockedCardIds.includes(card.id)
  ).length;

  return {
    unlocked: unlockedCount,
    total: categoryCards.length,
    percentage: Math.round((unlockedCount / categoryCards.length) * 100),
  };
};
