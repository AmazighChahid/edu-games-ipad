/**
 * Conteur Curieux Stories
 *
 * Collection d'histoires pour le jeu de compréhension de lecture
 */

import type { ConteurLevel, Story, StoryTheme, VocabularyWord, StoryCollectible, QuestionCategory } from '../types';

// ============================================================================
// HISTOIRES NIVEAU 1 (Facile - textes courts, questions simples)
// ============================================================================

const STORY_LE_PETIT_CHAT: Story = {
  id: 'petit-chat',
  title: 'Le Petit Chat',
  emoji: '🐱',
  theme: 'nature',
  content: 'Minou est un petit chat roux. Il vit dans une jolie maison avec sa famille. Chaque matin, Minou aime jouer dans le jardin. Il court après les papillons et se roule dans l\'herbe. Quand il a faim, il rentre à la maison et miaule devant son bol. Sa maîtresse lui donne des croquettes. Minou est un chat très heureux !',
  paragraphs: [
    'Minou est un petit chat roux. Il vit dans une jolie maison avec sa famille.',
    'Chaque matin, Minou aime jouer dans le jardin. Il court après les papillons et se roule dans l\'herbe.',
    'Quand il a faim, il rentre à la maison et miaule devant son bol. Sa maîtresse lui donne des croquettes.',
    'Minou est un chat très heureux !',
  ],
  vocabulary: [
    { word: 'roux', definition: 'De couleur orange-brun, comme les feuilles en automne', emoji: '🍂' },
    { word: 'croquettes', definition: 'Petits morceaux de nourriture sèche pour animaux', emoji: '🥣' },
  ],
  summary: 'Minou le chat roux vit heureux avec sa famille, jouant dans le jardin.',
  collectible: {
    id: 'card-minou',
    storyId: 'petit-chat',
    name: 'Minou le Chat',
    emoji: '🐱',
    description: 'Un adorable chat roux qui aime jouer dans le jardin',
    rarity: 'common',
    trait: 'Joueur',
    traitEmoji: '🦋',
  },
  skills: ['comprehension', 'vocabulary'],
  questions: [
    {
      id: 'q1',
      text: 'De quelle couleur est Minou ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '🎨',
      options: [
        { id: 'a', text: 'Noir', isCorrect: false },
        { id: 'b', text: 'Roux', isCorrect: true },
        { id: 'c', text: 'Blanc', isCorrect: false },
        { id: 'd', text: 'Gris', isCorrect: false },
      ],
      hint: 'Relis le début de l\'histoire...',
      relatedParagraph: 0,
      explanation: 'L\'histoire dit que Minou est un petit chat roux.',
    },
    {
      id: 'q2',
      text: 'Où Minou aime-t-il jouer ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '🏡',
      options: [
        { id: 'a', text: 'Dans la cuisine', isCorrect: false },
        { id: 'b', text: 'Dans le jardin', isCorrect: true },
        { id: 'c', text: 'Dans la chambre', isCorrect: false },
        { id: 'd', text: 'Dans la rue', isCorrect: false },
      ],
      hint: 'Que fait Minou chaque matin ?',
      relatedParagraph: 1,
    },
    {
      id: 'q3',
      text: 'Que fait Minou quand il a faim ?',
      type: 'multiple_choice',
      category: 'sequential',
      emoji: '🍽️',
      options: [
        { id: 'a', text: 'Il dort', isCorrect: false },
        { id: 'b', text: 'Il miaule devant son bol', isCorrect: true },
        { id: 'c', text: 'Il joue', isCorrect: false },
        { id: 'd', text: 'Il court', isCorrect: false },
      ],
      relatedParagraph: 2,
    },
  ],
  readingTime: 2,
};

const STORY_LA_POMME_ROUGE: Story = {
  id: 'pomme-rouge',
  title: 'La Pomme Rouge',
  emoji: '🍎',
  theme: 'nature',
  content: 'Dans le verger, il y a un grand pommier. Sur une branche haute, une belle pomme rouge brille au soleil. Un petit oiseau vient se poser près d\'elle. "Comme tu es jolie !" dit l\'oiseau. La pomme est très fière. Un jour, la pomme tombe de l\'arbre. Un enfant la ramasse et la croque. "Miam, elle est délicieuse !" dit-il en souriant.',
  paragraphs: [
    'Dans le verger, il y a un grand pommier. Sur une branche haute, une belle pomme rouge brille au soleil.',
    'Un petit oiseau vient se poser près d\'elle. "Comme tu es jolie !" dit l\'oiseau. La pomme est très fière.',
    'Un jour, la pomme tombe de l\'arbre. Un enfant la ramasse et la croque.',
    '"Miam, elle est délicieuse !" dit-il en souriant.',
  ],
  vocabulary: [
    { word: 'verger', definition: 'Un jardin avec beaucoup d\'arbres fruitiers', emoji: '🌳' },
    { word: 'fière', definition: 'Contente de soi, heureuse d\'un compliment', emoji: '😊' },
  ],
  summary: 'Une pomme rouge fière reçoit un compliment d\'un oiseau avant d\'être mangée.',
  collectible: {
    id: 'card-pomme',
    storyId: 'pomme-rouge',
    name: 'Pomme Brillante',
    emoji: '🍎',
    description: 'Une pomme rouge qui brille au soleil dans le verger',
    rarity: 'common',
    trait: 'Fière',
    traitEmoji: '✨',
  },
  skills: ['comprehension', 'vocabulary'],
  questions: [
    {
      id: 'q1',
      text: 'Où se trouve la pomme au début ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '🌳',
      options: [
        { id: 'a', text: 'Par terre', isCorrect: false },
        { id: 'b', text: 'Sur une branche', isCorrect: true },
        { id: 'c', text: 'Dans un panier', isCorrect: false },
        { id: 'd', text: 'Sur une table', isCorrect: false },
      ],
      relatedParagraph: 0,
    },
    {
      id: 'q2',
      text: 'Qui parle à la pomme ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '🐦',
      options: [
        { id: 'a', text: 'Un chat', isCorrect: false },
        { id: 'b', text: 'Un oiseau', isCorrect: true },
        { id: 'c', text: 'Un enfant', isCorrect: false },
        { id: 'd', text: 'Un jardinier', isCorrect: false },
      ],
      relatedParagraph: 1,
    },
    {
      id: 'q3',
      text: 'Que fait l\'enfant avec la pomme ?',
      type: 'multiple_choice',
      category: 'sequential',
      emoji: '👦',
      options: [
        { id: 'a', text: 'Il la jette', isCorrect: false },
        { id: 'b', text: 'Il la mange', isCorrect: true },
        { id: 'c', text: 'Il la donne', isCorrect: false },
        { id: 'd', text: 'Il la regarde', isCorrect: false },
      ],
      relatedParagraph: 2,
    },
  ],
  readingTime: 2,
};

// ============================================================================
// HISTOIRES NIVEAU 2 (Moyen - textes plus longs)
// ============================================================================

const STORY_AVENTURE_FORET: Story = {
  id: 'aventure-foret',
  title: 'L\'Aventure dans la Forêt',
  emoji: '🌲',
  theme: 'adventure',
  content: 'Léo et sa sœur Emma décident d\'explorer la forêt derrière leur maison. Ils préparent un sac avec une gourde d\'eau et des biscuits. Dans la forêt, ils découvrent un petit ruisseau. "Regarde, il y a des poissons !" s\'exclame Emma. Les enfants s\'amusent à observer les animaux. Soudain, ils entendent un bruit étrange. C\'est un hibou perché sur une branche ! "Il est l\'heure de rentrer", dit Léo en voyant le soleil se coucher. Ils retournent chez eux, heureux de leur belle aventure.',
  paragraphs: [
    'Léo et sa sœur Emma décident d\'explorer la forêt derrière leur maison.',
    'Ils préparent un sac avec une gourde d\'eau et des biscuits.',
    'Dans la forêt, ils découvrent un petit ruisseau. "Regarde, il y a des poissons !" s\'exclame Emma.',
    'Les enfants s\'amusent à observer les animaux.',
    'Soudain, ils entendent un bruit étrange. C\'est un hibou perché sur une branche !',
    '"Il est l\'heure de rentrer", dit Léo en voyant le soleil se coucher. Ils retournent chez eux, heureux de leur belle aventure.',
  ],
  vocabulary: [
    { word: 'explorer', definition: 'Partir à la découverte d\'un endroit nouveau', emoji: '🔍' },
    { word: 'ruisseau', definition: 'Un petit cours d\'eau qui coule doucement', emoji: '💧' },
    { word: 'perché', definition: 'Posé en hauteur sur quelque chose', emoji: '🦅' },
  ],
  summary: 'Léo et Emma explorent la forêt, découvrent un ruisseau et rencontrent un hibou.',
  collectible: {
    id: 'card-hibou-foret',
    storyId: 'aventure-foret',
    name: 'Hibou Mystérieux',
    emoji: '🦉',
    description: 'Un hibou sage qui veille sur la forêt',
    rarity: 'rare',
    trait: 'Observateur',
    traitEmoji: '👀',
  },
  skills: ['comprehension', 'inference', 'memory'],
  questions: [
    {
      id: 'q1',
      text: 'Qui sont les personnages principaux ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '👫',
      options: [
        { id: 'a', text: 'Léo et son frère', isCorrect: false },
        { id: 'b', text: 'Léo et sa sœur Emma', isCorrect: true },
        { id: 'c', text: 'Emma et son chat', isCorrect: false },
        { id: 'd', text: 'Léo et son ami', isCorrect: false },
      ],
      relatedParagraph: 0,
    },
    {
      id: 'q2',
      text: 'Que mettent-ils dans leur sac ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '🎒',
      options: [
        { id: 'a', text: 'Des jouets', isCorrect: false },
        { id: 'b', text: 'De l\'eau et des biscuits', isCorrect: true },
        { id: 'c', text: 'Des livres', isCorrect: false },
        { id: 'd', text: 'Des crayons', isCorrect: false },
      ],
      relatedParagraph: 1,
    },
    {
      id: 'q3',
      text: 'Qu\'est-ce qu\'Emma voit dans le ruisseau ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '🐟',
      options: [
        { id: 'a', text: 'Des grenouilles', isCorrect: false },
        { id: 'b', text: 'Des poissons', isCorrect: true },
        { id: 'c', text: 'Des canards', isCorrect: false },
        { id: 'd', text: 'Des tortues', isCorrect: false },
      ],
      relatedParagraph: 2,
    },
    {
      id: 'q4',
      text: 'Quel animal fait un bruit étrange ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '🦉',
      options: [
        { id: 'a', text: 'Un loup', isCorrect: false },
        { id: 'b', text: 'Un hibou', isCorrect: true },
        { id: 'c', text: 'Un renard', isCorrect: false },
        { id: 'd', text: 'Un écureuil', isCorrect: false },
      ],
      relatedParagraph: 4,
    },
  ],
  readingTime: 3,
};

// ============================================================================
// HISTOIRES NIVEAU 3 (Difficile - textes complexes)
// ============================================================================

const STORY_TRESOR_PIRATE: Story = {
  id: 'tresor-pirate',
  title: 'Le Trésor du Pirate',
  emoji: '🏴‍☠️',
  theme: 'adventure',
  content: 'Il était une fois un vieux pirate nommé Barbe-Rousse. Il avait caché son trésor sur une île mystérieuse. Avant de mourir, il dessina une carte au trésor et la donna à son petit-fils, Tom. Tom était un garçon courageux et curieux. Il décida de partir à l\'aventure avec son meilleur ami, Max, et leur perroquet Coco. Après plusieurs jours de navigation, ils arrivèrent sur l\'île. La carte indiquait : "Sous le palmier le plus haut, creusez trois pas vers l\'ouest." Les enfants suivirent les instructions et commencèrent à creuser. Soudain, leur pelle toucha quelque chose de dur : un coffre en bois ! À l\'intérieur, ils découvrirent des pièces d\'or, des bijoux et une lettre de Barbe-Rousse qui disait : "Le vrai trésor, c\'est l\'amitié et les aventures partagées."',
  paragraphs: [
    'Il était une fois un vieux pirate nommé Barbe-Rousse. Il avait caché son trésor sur une île mystérieuse.',
    'Avant de mourir, il dessina une carte au trésor et la donna à son petit-fils, Tom.',
    'Tom était un garçon courageux et curieux. Il décida de partir à l\'aventure avec son meilleur ami, Max, et leur perroquet Coco.',
    'Après plusieurs jours de navigation, ils arrivèrent sur l\'île.',
    'La carte indiquait : "Sous le palmier le plus haut, creusez trois pas vers l\'ouest."',
    'Les enfants suivirent les instructions et commencèrent à creuser. Soudain, leur pelle toucha quelque chose de dur : un coffre en bois !',
    'À l\'intérieur, ils découvrirent des pièces d\'or, des bijoux et une lettre de Barbe-Rousse.',
    'La lettre disait : "Le vrai trésor, c\'est l\'amitié et les aventures partagées."',
  ],
  vocabulary: [
    { word: 'mystérieuse', definition: 'Qui cache des secrets, qu\'on ne connaît pas bien', emoji: '🔮' },
    { word: 'navigation', definition: 'Le voyage en bateau sur la mer', emoji: '⛵' },
    { word: 'palmier', definition: 'Un grand arbre avec des feuilles en forme de plumes au sommet', emoji: '🌴' },
    { word: 'coffre', definition: 'Une grande boîte en bois pour ranger des objets précieux', emoji: '📦' },
  ],
  summary: 'Tom et Max partent à la recherche du trésor de Barbe-Rousse et découvrent la valeur de l\'amitié.',
  collectible: {
    id: 'card-barbe-rousse',
    storyId: 'tresor-pirate',
    name: 'Barbe-Rousse',
    emoji: '🏴‍☠️',
    description: 'Le légendaire pirate qui a caché un trésor plein de sagesse',
    rarity: 'epic',
    trait: 'Sage',
    traitEmoji: '🧠',
  },
  skills: ['comprehension', 'inference', 'critical_thinking', 'memory'],
  questions: [
    {
      id: 'q1',
      text: 'Comment s\'appelle le pirate ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '🏴‍☠️',
      options: [
        { id: 'a', text: 'Barbe-Noire', isCorrect: false },
        { id: 'b', text: 'Barbe-Rousse', isCorrect: true },
        { id: 'c', text: 'Barbe-Grise', isCorrect: false },
        { id: 'd', text: 'Barbe-Blanche', isCorrect: false },
      ],
      relatedParagraph: 0,
    },
    {
      id: 'q2',
      text: 'Qui est Tom pour le pirate ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '👨‍👦',
      options: [
        { id: 'a', text: 'Son fils', isCorrect: false },
        { id: 'b', text: 'Son petit-fils', isCorrect: true },
        { id: 'c', text: 'Son neveu', isCorrect: false },
        { id: 'd', text: 'Son frère', isCorrect: false },
      ],
      relatedParagraph: 1,
    },
    {
      id: 'q3',
      text: 'Qui accompagne Tom dans son aventure ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '👥',
      options: [
        { id: 'a', text: 'Son frère et un chien', isCorrect: false },
        { id: 'b', text: 'Max et le perroquet Coco', isCorrect: true },
        { id: 'c', text: 'Sa sœur et un chat', isCorrect: false },
        { id: 'd', text: 'Ses parents', isCorrect: false },
      ],
      relatedParagraph: 2,
    },
    {
      id: 'q4',
      text: 'Où fallait-il creuser selon la carte ?',
      type: 'multiple_choice',
      category: 'sequential',
      emoji: '🗺️',
      options: [
        { id: 'a', text: 'Près de la plage', isCorrect: false },
        { id: 'b', text: 'Sous le palmier le plus haut', isCorrect: true },
        { id: 'c', text: 'Dans une grotte', isCorrect: false },
        { id: 'd', text: 'Au sommet de la montagne', isCorrect: false },
      ],
      relatedParagraph: 4,
    },
    {
      id: 'q5',
      text: 'Quel est le message de la lettre de Barbe-Rousse ?',
      type: 'multiple_choice',
      category: 'inferential',
      emoji: '💌',
      options: [
        { id: 'a', text: 'L\'or rend heureux', isCorrect: false },
        { id: 'b', text: 'Le vrai trésor c\'est l\'amitié', isCorrect: true },
        { id: 'c', text: 'Il faut chercher plus de trésors', isCorrect: false },
        { id: 'd', text: 'Les pirates sont les plus forts', isCorrect: false },
      ],
      relatedParagraph: 7,
      explanation: 'La lettre révèle que le vrai trésor n\'est pas l\'or, mais l\'amitié et les aventures partagées.',
    },
  ],
  readingTime: 5,
};

// ============================================================================
// NIVEAUX
// ============================================================================

const LEVEL_PETIT_CHAT: ConteurLevel = {
  id: 'level-petit-chat',
  name: 'Le Petit Chat',
  description: 'Découvre l\'histoire de Minou, un chat adorable !',
  difficulty: 1,
  theme: 'Animaux',
  themeEmoji: '🐾',
  story: STORY_LE_PETIT_CHAT,
  hintsAvailable: 3,
  passingScore: 50,
};

const LEVEL_POMME_ROUGE: ConteurLevel = {
  id: 'level-pomme-rouge',
  name: 'La Pomme Rouge',
  description: 'Une jolie histoire dans le verger.',
  difficulty: 1,
  theme: 'Nature',
  themeEmoji: '🌳',
  story: STORY_LA_POMME_ROUGE,
  hintsAvailable: 3,
  passingScore: 50,
};

const LEVEL_AVENTURE_FORET: ConteurLevel = {
  id: 'level-aventure-foret',
  name: 'L\'Aventure dans la Forêt',
  description: 'Suis Léo et Emma dans leur exploration !',
  difficulty: 2,
  theme: 'Aventure',
  themeEmoji: '🌲',
  story: STORY_AVENTURE_FORET,
  hintsAvailable: 3,
  passingScore: 60,
};

const LEVEL_TRESOR_PIRATE: ConteurLevel = {
  id: 'level-tresor-pirate',
  name: 'Le Trésor du Pirate',
  description: 'Une aventure de pirates passionnante !',
  difficulty: 3,
  theme: 'Pirates',
  themeEmoji: '🏴‍☠️',
  story: STORY_TRESOR_PIRATE,
  hintsAvailable: 4,
  passingScore: 60,
};

// ============================================================================
// EXPORTS
// ============================================================================

export const CONTEUR_LEVELS: ConteurLevel[] = [
  LEVEL_PETIT_CHAT,
  LEVEL_POMME_ROUGE,
  LEVEL_AVENTURE_FORET,
  LEVEL_TRESOR_PIRATE,
];

/**
 * Obtient un niveau par ID
 */
export function getLevelById(id: string): ConteurLevel | undefined {
  return CONTEUR_LEVELS.find((l) => l.id === id);
}

/**
 * Obtient les niveaux par difficulté
 */
export function getLevelsByDifficulty(difficulty: 1 | 2 | 3): ConteurLevel[] {
  return CONTEUR_LEVELS.filter((l) => l.difficulty === difficulty);
}

/**
 * Obtient le premier niveau
 */
export function getFirstLevel(): ConteurLevel {
  return CONTEUR_LEVELS[0];
}

/**
 * Obtient tous les niveaux
 */
export function getAllLevels(): ConteurLevel[] {
  return CONTEUR_LEVELS;
}

/**
 * Obtient les niveaux par thème
 */
export function getLevelsByTheme(theme: StoryTheme): ConteurLevel[] {
  return CONTEUR_LEVELS.filter((l) => l.story.theme === theme);
}

/**
 * Obtient tous les thèmes disponibles
 */
export function getAvailableThemes(): StoryTheme[] {
  const themes = new Set<StoryTheme>();
  CONTEUR_LEVELS.forEach((l) => {
    if (l.story.theme) themes.add(l.story.theme);
  });
  return Array.from(themes);
}
