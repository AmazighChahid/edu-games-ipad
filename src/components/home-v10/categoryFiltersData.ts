/**
 * Category Filters Data
 * Données des 8 catégories avec couleurs pour la version compacte
 */

export type CategoryId =
  | 'all'
  | 'attention'
  | 'logic'
  | 'math'
  | 'reading'
  | 'spatial'
  | 'creativity'
  | 'favorites';

export interface CategoryColors {
  bg: string;
  border: string;
  activeBg: string;
  activeBorder: string;
  iconColor: string;
}

export interface Category {
  id: CategoryId;
  label: string;
  colors: CategoryColors;
}

export const CATEGORIES: Category[] = [
  {
    id: 'all',
    label: 'Tous',
    colors: {
      bg: '#E8F5E9',
      border: '#A5D6A7',
      activeBg: '#5FB535',
      activeBorder: '#4CA030',
      iconColor: '#4CAF50',
    },
  },
  {
    id: 'attention',
    label: 'Attention',
    colors: {
      bg: '#E0F7FA',
      border: '#80DEEA',
      activeBg: '#3BBFD5',
      activeBorder: '#2AA5BE',
      iconColor: '#00ACC1',
    },
  },
  {
    id: 'logic',
    label: 'Logique',
    colors: {
      bg: '#FFF3E0',
      border: '#FFCC80',
      activeBg: '#F59A00',
      activeBorder: '#E08800',
      iconColor: '#F57C00',
    },
  },
  {
    id: 'math',
    label: 'Chiffres',
    colors: {
      bg: '#E3F2FD',
      border: '#90CAF9',
      activeBg: '#4580E8',
      activeBorder: '#3568C8',
      iconColor: '#1976D2',
    },
  },
  {
    id: 'reading',
    label: 'Mots',
    colors: {
      bg: '#F3E5F5',
      border: '#CE93D8',
      activeBg: '#C845E8',
      activeBorder: '#A830C8',
      iconColor: '#9C27B0',
    },
  },
  {
    id: 'spatial',
    label: 'Formes',
    colors: {
      bg: '#FFF8E1',
      border: '#FFD54F',
      activeBg: '#F09000',
      activeBorder: '#D07800',
      iconColor: '#FF8F00',
    },
  },
  {
    id: 'creativity',
    label: 'Créativité',
    colors: {
      bg: '#FCE4EC',
      border: '#F48FB1',
      activeBg: '#E84D82',
      activeBorder: '#C83868',
      iconColor: '#E91E63',
    },
  },
  {
    id: 'favorites',
    label: 'Favoris',
    colors: {
      bg: '#FFEBEE',
      border: '#EF9A9A',
      activeBg: '#E84D4D',
      activeBorder: '#C83838',
      iconColor: '#E53935',
    },
  },
];

/**
 * Mapping des catégories du registry vers les CategoryId
 */
export const CATEGORY_MAPPING: Record<string, CategoryId> = {
  logic: 'logic',
  numbers: 'math',
  words: 'reading',
  memory: 'attention',
  shapes: 'spatial',
  creativity: 'creativity',
};

/**
 * Récupère la catégorie à partir de l'ID
 */
export const getCategoryById = (id: CategoryId): Category | undefined => {
  return CATEGORIES.find((cat) => cat.id === id);
};
