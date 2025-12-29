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
// HISTOIRES SUPPLÉMENTAIRES NIVEAU 1
// ============================================================================

const STORY_LE_PETIT_LAPIN: Story = {
  id: 'petit-lapin',
  title: 'Le Petit Lapin',
  emoji: '🐰',
  theme: 'nature',
  content: 'Pompon est un petit lapin blanc avec de longues oreilles. Il habite dans un terrier sous un grand chêne. Chaque matin, il sort pour chercher des carottes dans le potager. Un jour, il rencontre une tortue. "Bonjour, je m\'appelle Lentille", dit la tortue. Ils deviennent amis et jouent ensemble tous les jours.',
  paragraphs: [
    'Pompon est un petit lapin blanc avec de longues oreilles.',
    'Il habite dans un terrier sous un grand chêne.',
    'Chaque matin, il sort pour chercher des carottes dans le potager.',
    'Un jour, il rencontre une tortue. "Bonjour, je m\'appelle Lentille", dit la tortue.',
    'Ils deviennent amis et jouent ensemble tous les jours.',
  ],
  vocabulary: [
    { word: 'terrier', definition: 'Un trou dans la terre où vivent certains animaux', emoji: '🕳️' },
    { word: 'potager', definition: 'Un jardin où on fait pousser des légumes', emoji: '🥕' },
  ],
  summary: 'Pompon le lapin rencontre Lentille la tortue et ils deviennent amis.',
  collectible: {
    id: 'card-pompon',
    storyId: 'petit-lapin',
    name: 'Pompon le Lapin',
    emoji: '🐰',
    description: 'Un lapin blanc qui aime les carottes et l\'amitié',
    rarity: 'common',
    trait: 'Amical',
    traitEmoji: '💕',
  },
  skills: ['comprehension', 'vocabulary'],
  questions: [
    {
      id: 'q1',
      text: 'Comment s\'appelle le lapin ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '🐰',
      options: [
        { id: 'a', text: 'Pompon', isCorrect: true },
        { id: 'b', text: 'Lentille', isCorrect: false },
        { id: 'c', text: 'Carotte', isCorrect: false },
        { id: 'd', text: 'Neige', isCorrect: false },
      ],
      relatedParagraph: 0,
    },
    {
      id: 'q2',
      text: 'Où habite Pompon ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '🏠',
      options: [
        { id: 'a', text: 'Dans un nid', isCorrect: false },
        { id: 'b', text: 'Dans un terrier', isCorrect: true },
        { id: 'c', text: 'Dans une maison', isCorrect: false },
        { id: 'd', text: 'Dans une grotte', isCorrect: false },
      ],
      relatedParagraph: 1,
    },
    {
      id: 'q3',
      text: 'Qui est Lentille ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '🐢',
      options: [
        { id: 'a', text: 'Un escargot', isCorrect: false },
        { id: 'b', text: 'Une tortue', isCorrect: true },
        { id: 'c', text: 'Un hérisson', isCorrect: false },
        { id: 'd', text: 'Un écureuil', isCorrect: false },
      ],
      relatedParagraph: 3,
    },
  ],
  readingTime: 2,
};

const STORY_LE_SOLEIL_CACHE: Story = {
  id: 'soleil-cache',
  title: 'Le Soleil Caché',
  emoji: '☀️',
  theme: 'nature',
  content: 'Ce matin, le soleil ne veut pas se lever. Les nuages lui font un gros câlin. "Laissez-moi sortir !" dit le soleil. Un petit vent arrive et souffle très fort. Les nuages s\'envolent. Le soleil brille enfin et tout le monde est content. Les fleurs ouvrent leurs pétales et les oiseaux chantent.',
  paragraphs: [
    'Ce matin, le soleil ne veut pas se lever. Les nuages lui font un gros câlin.',
    '"Laissez-moi sortir !" dit le soleil.',
    'Un petit vent arrive et souffle très fort. Les nuages s\'envolent.',
    'Le soleil brille enfin et tout le monde est content.',
    'Les fleurs ouvrent leurs pétales et les oiseaux chantent.',
  ],
  vocabulary: [
    { word: 'pétales', definition: 'Les parties colorées d\'une fleur', emoji: '🌸' },
    { word: 'briller', definition: 'Émettre de la lumière', emoji: '✨' },
  ],
  summary: 'Le soleil caché par les nuages est libéré par le vent.',
  collectible: {
    id: 'card-soleil',
    storyId: 'soleil-cache',
    name: 'Soleil Joyeux',
    emoji: '☀️',
    description: 'Un soleil qui apporte la joie partout où il brille',
    rarity: 'common',
    trait: 'Radieux',
    traitEmoji: '😊',
  },
  skills: ['comprehension', 'vocabulary'],
  questions: [
    {
      id: 'q1',
      text: 'Pourquoi le soleil ne se lève-t-il pas ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '☁️',
      options: [
        { id: 'a', text: 'Il dort', isCorrect: false },
        { id: 'b', text: 'Les nuages le cachent', isCorrect: true },
        { id: 'c', text: 'Il est fatigué', isCorrect: false },
        { id: 'd', text: 'Il fait nuit', isCorrect: false },
      ],
      relatedParagraph: 0,
    },
    {
      id: 'q2',
      text: 'Qui aide le soleil ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '💨',
      options: [
        { id: 'a', text: 'La pluie', isCorrect: false },
        { id: 'b', text: 'Le vent', isCorrect: true },
        { id: 'c', text: 'La lune', isCorrect: false },
        { id: 'd', text: 'Les étoiles', isCorrect: false },
      ],
      relatedParagraph: 2,
    },
    {
      id: 'q3',
      text: 'Que font les fleurs quand le soleil brille ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '🌷',
      options: [
        { id: 'a', text: 'Elles dorment', isCorrect: false },
        { id: 'b', text: 'Elles ouvrent leurs pétales', isCorrect: true },
        { id: 'c', text: 'Elles se cachent', isCorrect: false },
        { id: 'd', text: 'Elles pleurent', isCorrect: false },
      ],
      relatedParagraph: 4,
    },
  ],
  readingTime: 2,
};

// ============================================================================
// HISTOIRES SUPPLÉMENTAIRES NIVEAU 2
// ============================================================================

const STORY_ECOLE_MAGIQUE: Story = {
  id: 'ecole-magique',
  title: 'L\'École Magique',
  emoji: '🏫',
  theme: 'fantasy',
  content: 'Luna entre pour la première fois dans l\'école des sorciers. Le bâtiment est immense avec des tours qui touchent les nuages. Sa professeure, Madame Étoile, l\'accueille avec un sourire. "Bienvenue ! Aujourd\'hui, nous allons apprendre à faire voler une plume." Luna sort sa baguette magique. Elle prononce la formule : "Pluma Volanta !" La plume s\'élève doucement dans les airs. Luna est très fière de sa première magie !',
  paragraphs: [
    'Luna entre pour la première fois dans l\'école des sorciers.',
    'Le bâtiment est immense avec des tours qui touchent les nuages.',
    'Sa professeure, Madame Étoile, l\'accueille avec un sourire.',
    '"Bienvenue ! Aujourd\'hui, nous allons apprendre à faire voler une plume."',
    'Luna sort sa baguette magique. Elle prononce la formule : "Pluma Volanta !"',
    'La plume s\'élève doucement dans les airs. Luna est très fière de sa première magie !',
  ],
  vocabulary: [
    { word: 'sorciers', definition: 'Des personnes qui font de la magie', emoji: '🧙' },
    { word: 'formule', definition: 'Des mots magiques à prononcer pour faire un sort', emoji: '✨' },
    { word: 'baguette', definition: 'Un bâton magique utilisé par les sorciers', emoji: '🪄' },
  ],
  summary: 'Luna découvre l\'école des sorciers et réussit son premier sort de lévitation.',
  collectible: {
    id: 'card-luna',
    storyId: 'ecole-magique',
    name: 'Luna l\'Apprentie',
    emoji: '🧙‍♀️',
    description: 'Une jeune sorcière pleine de talent',
    rarity: 'rare',
    trait: 'Magique',
    traitEmoji: '🪄',
  },
  skills: ['comprehension', 'inference', 'memory'],
  questions: [
    {
      id: 'q1',
      text: 'Comment s\'appelle la professeure ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '👩‍🏫',
      options: [
        { id: 'a', text: 'Madame Lune', isCorrect: false },
        { id: 'b', text: 'Madame Étoile', isCorrect: true },
        { id: 'c', text: 'Madame Soleil', isCorrect: false },
        { id: 'd', text: 'Madame Nuage', isCorrect: false },
      ],
      relatedParagraph: 2,
    },
    {
      id: 'q2',
      text: 'Quelle est la formule magique ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '🪄',
      options: [
        { id: 'a', text: 'Abracadabra', isCorrect: false },
        { id: 'b', text: 'Pluma Volanta', isCorrect: true },
        { id: 'c', text: 'Alakazam', isCorrect: false },
        { id: 'd', text: 'Simsalabim', isCorrect: false },
      ],
      relatedParagraph: 4,
    },
    {
      id: 'q3',
      text: 'Qu\'est-ce que Luna fait voler ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '🪶',
      options: [
        { id: 'a', text: 'Un livre', isCorrect: false },
        { id: 'b', text: 'Une plume', isCorrect: true },
        { id: 'c', text: 'Un chapeau', isCorrect: false },
        { id: 'd', text: 'Une balle', isCorrect: false },
      ],
      relatedParagraph: 5,
    },
    {
      id: 'q4',
      text: 'Comment se sent Luna à la fin ?',
      type: 'multiple_choice',
      category: 'inferential',
      emoji: '😊',
      options: [
        { id: 'a', text: 'Triste', isCorrect: false },
        { id: 'b', text: 'Fière', isCorrect: true },
        { id: 'c', text: 'En colère', isCorrect: false },
        { id: 'd', text: 'Fatiguée', isCorrect: false },
      ],
      relatedParagraph: 5,
    },
  ],
  readingTime: 3,
};

const STORY_ROBOT_TIMIDE: Story = {
  id: 'robot-timide',
  title: 'Le Robot Timide',
  emoji: '🤖',
  theme: 'fantasy',
  content: 'Dans la ville du futur, il y a un petit robot nommé Bip. Bip est différent des autres robots : il est très timide. Quand les autres robots jouent ensemble, Bip reste dans son coin. Un jour, une petite fille appelée Maya le remarque. "Tu veux jouer avec moi ?" demande-t-elle. Bip fait clignoter ses lumières de joie. Ensemble, ils construisent un château de cubes. Bip apprend que l\'amitié peut commencer par un simple sourire.',
  paragraphs: [
    'Dans la ville du futur, il y a un petit robot nommé Bip.',
    'Bip est différent des autres robots : il est très timide.',
    'Quand les autres robots jouent ensemble, Bip reste dans son coin.',
    'Un jour, une petite fille appelée Maya le remarque.',
    '"Tu veux jouer avec moi ?" demande-t-elle.',
    'Bip fait clignoter ses lumières de joie.',
    'Ensemble, ils construisent un château de cubes. Bip apprend que l\'amitié peut commencer par un simple sourire.',
  ],
  vocabulary: [
    { word: 'timide', definition: 'Qui a peur de parler aux autres ou de se montrer', emoji: '😳' },
    { word: 'clignoter', definition: 'S\'allumer et s\'éteindre plusieurs fois', emoji: '💡' },
  ],
  summary: 'Bip le robot timide trouve une amie qui l\'aide à sortir de sa coquille.',
  collectible: {
    id: 'card-bip',
    storyId: 'robot-timide',
    name: 'Bip le Robot',
    emoji: '🤖',
    description: 'Un robot au grand cœur qui a vaincu sa timidité',
    rarity: 'rare',
    trait: 'Sensible',
    traitEmoji: '💝',
  },
  skills: ['comprehension', 'inference', 'memory'],
  questions: [
    {
      id: 'q1',
      text: 'Pourquoi Bip est-il différent ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '🤖',
      options: [
        { id: 'a', text: 'Il est grand', isCorrect: false },
        { id: 'b', text: 'Il est timide', isCorrect: true },
        { id: 'c', text: 'Il est méchant', isCorrect: false },
        { id: 'd', text: 'Il est cassé', isCorrect: false },
      ],
      relatedParagraph: 1,
    },
    {
      id: 'q2',
      text: 'Comment s\'appelle la petite fille ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '👧',
      options: [
        { id: 'a', text: 'Luna', isCorrect: false },
        { id: 'b', text: 'Maya', isCorrect: true },
        { id: 'c', text: 'Emma', isCorrect: false },
        { id: 'd', text: 'Léa', isCorrect: false },
      ],
      relatedParagraph: 3,
    },
    {
      id: 'q3',
      text: 'Que construisent-ils ensemble ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '🏰',
      options: [
        { id: 'a', text: 'Une tour', isCorrect: false },
        { id: 'b', text: 'Un château de cubes', isCorrect: true },
        { id: 'c', text: 'Un robot', isCorrect: false },
        { id: 'd', text: 'Une maison', isCorrect: false },
      ],
      relatedParagraph: 6,
    },
    {
      id: 'q4',
      text: 'Quelle leçon Bip apprend-il ?',
      type: 'multiple_choice',
      category: 'inferential',
      emoji: '💡',
      options: [
        { id: 'a', text: 'Les robots sont les meilleurs', isCorrect: false },
        { id: 'b', text: 'L\'amitié peut commencer par un sourire', isCorrect: true },
        { id: 'c', text: 'Il faut rester seul', isCorrect: false },
        { id: 'd', text: 'Les cubes sont amusants', isCorrect: false },
      ],
      relatedParagraph: 6,
    },
  ],
  readingTime: 3,
};

const STORY_PRINCESSE_DRAGON: Story = {
  id: 'princesse-dragon',
  title: 'La Princesse et le Dragon',
  emoji: '👸',
  theme: 'fantasy',
  content: 'La princesse Rose habite dans un château au sommet d\'une montagne. Un jour, un dragon arrive près du château. Tout le monde a peur ! Mais Rose remarque que le dragon pleure. "Qu\'est-ce qui ne va pas ?" demande-t-elle doucement. "Je me suis perdu, je ne retrouve plus ma maman", sanglote le dragon. Rose décide de l\'aider. Ensemble, ils survolent le royaume jusqu\'à trouver la maman dragon. Pour la remercier, le dragon offre à Rose une écaille d\'or.',
  paragraphs: [
    'La princesse Rose habite dans un château au sommet d\'une montagne.',
    'Un jour, un dragon arrive près du château. Tout le monde a peur !',
    'Mais Rose remarque que le dragon pleure.',
    '"Qu\'est-ce qui ne va pas ?" demande-t-elle doucement.',
    '"Je me suis perdu, je ne retrouve plus ma maman", sanglote le dragon.',
    'Rose décide de l\'aider. Ensemble, ils survolent le royaume jusqu\'à trouver la maman dragon.',
    'Pour la remercier, le dragon offre à Rose une écaille d\'or.',
  ],
  vocabulary: [
    { word: 'sanglote', definition: 'Pleurer très fort avec des hoquets', emoji: '😢' },
    { word: 'survoler', definition: 'Voler au-dessus de quelque chose', emoji: '🦅' },
    { word: 'écaille', definition: 'Une petite plaque qui recouvre la peau des dragons et des poissons', emoji: '🐉' },
  ],
  summary: 'La princesse Rose aide un petit dragon perdu à retrouver sa maman.',
  collectible: {
    id: 'card-rose',
    storyId: 'princesse-dragon',
    name: 'Princesse Rose',
    emoji: '👸',
    description: 'Une princesse courageuse au cœur tendre',
    rarity: 'rare',
    trait: 'Courageuse',
    traitEmoji: '💪',
  },
  skills: ['comprehension', 'inference', 'memory'],
  questions: [
    {
      id: 'q1',
      text: 'Où habite la princesse Rose ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '🏰',
      options: [
        { id: 'a', text: 'Dans une forêt', isCorrect: false },
        { id: 'b', text: 'Dans un château sur une montagne', isCorrect: true },
        { id: 'c', text: 'Au bord de la mer', isCorrect: false },
        { id: 'd', text: 'Dans un village', isCorrect: false },
      ],
      relatedParagraph: 0,
    },
    {
      id: 'q2',
      text: 'Pourquoi le dragon pleure-t-il ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '🐉',
      options: [
        { id: 'a', text: 'Il a faim', isCorrect: false },
        { id: 'b', text: 'Il a perdu sa maman', isCorrect: true },
        { id: 'c', text: 'Il est blessé', isCorrect: false },
        { id: 'd', text: 'Il a froid', isCorrect: false },
      ],
      relatedParagraph: 4,
    },
    {
      id: 'q3',
      text: 'Comment voyagent Rose et le dragon ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '✈️',
      options: [
        { id: 'a', text: 'À pied', isCorrect: false },
        { id: 'b', text: 'En volant', isCorrect: true },
        { id: 'c', text: 'En bateau', isCorrect: false },
        { id: 'd', text: 'À cheval', isCorrect: false },
      ],
      relatedParagraph: 5,
    },
    {
      id: 'q4',
      text: 'Quel cadeau le dragon offre-t-il ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '🎁',
      options: [
        { id: 'a', text: 'Une couronne', isCorrect: false },
        { id: 'b', text: 'Une écaille d\'or', isCorrect: true },
        { id: 'c', text: 'Un diamant', isCorrect: false },
        { id: 'd', text: 'Une fleur', isCorrect: false },
      ],
      relatedParagraph: 6,
    },
  ],
  readingTime: 3,
};

// ============================================================================
// HISTOIRES SUPPLÉMENTAIRES NIVEAU 3
// ============================================================================

const STORY_INVENTEUR_FOU: Story = {
  id: 'inventeur-fou',
  title: 'L\'Inventeur Fou',
  emoji: '🔬',
  theme: 'adventure',
  content: 'Le professeur Génius travaille dans son laboratoire depuis des années sur une invention secrète. Son assistant, le jeune Martin, l\'aide chaque jour après l\'école. Un soir d\'orage, le professeur termine enfin sa machine : un traducteur animal ! "Avec ceci, nous pourrons comprendre ce que disent les animaux", explique-t-il. Martin est émerveillé. Ils testent l\'invention sur le chat du laboratoire. "J\'ai faim et je veux des câlins", dit le chat. Martin éclate de rire. Le professeur note tout dans son carnet. Cette découverte va changer le monde !',
  paragraphs: [
    'Le professeur Génius travaille dans son laboratoire depuis des années sur une invention secrète.',
    'Son assistant, le jeune Martin, l\'aide chaque jour après l\'école.',
    'Un soir d\'orage, le professeur termine enfin sa machine : un traducteur animal !',
    '"Avec ceci, nous pourrons comprendre ce que disent les animaux", explique-t-il.',
    'Martin est émerveillé. Ils testent l\'invention sur le chat du laboratoire.',
    '"J\'ai faim et je veux des câlins", dit le chat.',
    'Martin éclate de rire. Le professeur note tout dans son carnet. Cette découverte va changer le monde !',
  ],
  vocabulary: [
    { word: 'laboratoire', definition: 'Une pièce équipée pour faire des expériences scientifiques', emoji: '🔬' },
    { word: 'assistant', definition: 'Une personne qui aide quelqu\'un dans son travail', emoji: '👨‍🔬' },
    { word: 'traducteur', definition: 'Un appareil ou une personne qui transforme une langue en une autre', emoji: '🗣️' },
    { word: 'émerveillé', definition: 'Très impressionné et admiratif', emoji: '🤩' },
  ],
  summary: 'Le professeur Génius invente une machine pour parler aux animaux avec l\'aide de Martin.',
  collectible: {
    id: 'card-genius',
    storyId: 'inventeur-fou',
    name: 'Professeur Génius',
    emoji: '🔬',
    description: 'Un inventeur génial qui a révolutionné la communication avec les animaux',
    rarity: 'epic',
    trait: 'Brillant',
    traitEmoji: '💡',
  },
  skills: ['comprehension', 'inference', 'critical_thinking', 'memory'],
  questions: [
    {
      id: 'q1',
      text: 'Que fait Martin après l\'école ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '👦',
      options: [
        { id: 'a', text: 'Il joue', isCorrect: false },
        { id: 'b', text: 'Il aide le professeur', isCorrect: true },
        { id: 'c', text: 'Il dort', isCorrect: false },
        { id: 'd', text: 'Il regarde la télé', isCorrect: false },
      ],
      relatedParagraph: 1,
    },
    {
      id: 'q2',
      text: 'Qu\'est-ce que l\'invention permet de faire ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '🤖',
      options: [
        { id: 'a', text: 'Voler', isCorrect: false },
        { id: 'b', text: 'Comprendre les animaux', isCorrect: true },
        { id: 'c', text: 'Voyager dans le temps', isCorrect: false },
        { id: 'd', text: 'Devenir invisible', isCorrect: false },
      ],
      relatedParagraph: 3,
    },
    {
      id: 'q3',
      text: 'Que dit le chat ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '🐱',
      options: [
        { id: 'a', text: 'Je veux dormir', isCorrect: false },
        { id: 'b', text: 'J\'ai faim et je veux des câlins', isCorrect: true },
        { id: 'c', text: 'Je veux sortir', isCorrect: false },
        { id: 'd', text: 'Je suis content', isCorrect: false },
      ],
      relatedParagraph: 5,
    },
    {
      id: 'q4',
      text: 'Quel temps fait-il quand l\'invention est terminée ?',
      type: 'multiple_choice',
      category: 'factual',
      emoji: '🌩️',
      options: [
        { id: 'a', text: 'Il neige', isCorrect: false },
        { id: 'b', text: 'Il y a un orage', isCorrect: true },
        { id: 'c', text: 'Il fait soleil', isCorrect: false },
        { id: 'd', text: 'Il pleut doucement', isCorrect: false },
      ],
      relatedParagraph: 2,
    },
    {
      id: 'q5',
      text: 'Pourquoi cette invention est-elle importante ?',
      type: 'multiple_choice',
      category: 'inferential',
      emoji: '🌍',
      options: [
        { id: 'a', text: 'Elle fait rire', isCorrect: false },
        { id: 'b', text: 'Elle va changer le monde', isCorrect: true },
        { id: 'c', text: 'Elle est jolie', isCorrect: false },
        { id: 'd', text: 'Elle coûte cher', isCorrect: false },
      ],
      relatedParagraph: 6,
    },
  ],
  readingTime: 4,
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

// Nouveaux niveaux
const LEVEL_PETIT_LAPIN: ConteurLevel = {
  id: 'level-petit-lapin',
  name: 'Le Petit Lapin',
  description: 'L\'histoire de Pompon et son nouvel ami.',
  difficulty: 1,
  theme: 'Animaux',
  themeEmoji: '🐰',
  story: STORY_LE_PETIT_LAPIN,
  hintsAvailable: 3,
  passingScore: 50,
};

const LEVEL_SOLEIL_CACHE: ConteurLevel = {
  id: 'level-soleil-cache',
  name: 'Le Soleil Caché',
  description: 'Une histoire poétique sur la météo.',
  difficulty: 1,
  theme: 'Nature',
  themeEmoji: '☀️',
  story: STORY_LE_SOLEIL_CACHE,
  hintsAvailable: 3,
  passingScore: 50,
};

const LEVEL_ECOLE_MAGIQUE: ConteurLevel = {
  id: 'level-ecole-magique',
  name: 'L\'École Magique',
  description: 'Découvre la magie avec Luna !',
  difficulty: 2,
  theme: 'Fantaisie',
  themeEmoji: '🏫',
  story: STORY_ECOLE_MAGIQUE,
  hintsAvailable: 3,
  passingScore: 60,
};

const LEVEL_ROBOT_TIMIDE: ConteurLevel = {
  id: 'level-robot-timide',
  name: 'Le Robot Timide',
  description: 'L\'histoire touchante de Bip.',
  difficulty: 2,
  theme: 'Fantaisie',
  themeEmoji: '🤖',
  story: STORY_ROBOT_TIMIDE,
  hintsAvailable: 3,
  passingScore: 60,
};

const LEVEL_PRINCESSE_DRAGON: ConteurLevel = {
  id: 'level-princesse-dragon',
  name: 'La Princesse et le Dragon',
  description: 'Une aventure magique avec Rose.',
  difficulty: 2,
  theme: 'Fantaisie',
  themeEmoji: '👸',
  story: STORY_PRINCESSE_DRAGON,
  hintsAvailable: 3,
  passingScore: 60,
};

const LEVEL_INVENTEUR_FOU: ConteurLevel = {
  id: 'level-inventeur-fou',
  name: 'L\'Inventeur Fou',
  description: 'Une invention qui change tout !',
  difficulty: 3,
  theme: 'Aventure',
  themeEmoji: '🔬',
  story: STORY_INVENTEUR_FOU,
  hintsAvailable: 4,
  passingScore: 60,
};

// ============================================================================
// EXPORTS
// ============================================================================

export const CONTEUR_LEVELS: ConteurLevel[] = [
  // Niveau 1 (4 histoires)
  LEVEL_PETIT_CHAT,
  LEVEL_POMME_ROUGE,
  LEVEL_PETIT_LAPIN,
  LEVEL_SOLEIL_CACHE,
  // Niveau 2 (4 histoires)
  LEVEL_AVENTURE_FORET,
  LEVEL_ECOLE_MAGIQUE,
  LEVEL_ROBOT_TIMIDE,
  LEVEL_PRINCESSE_DRAGON,
  // Niveau 3 (2 histoires)
  LEVEL_TRESOR_PIRATE,
  LEVEL_INVENTEUR_FOU,
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
