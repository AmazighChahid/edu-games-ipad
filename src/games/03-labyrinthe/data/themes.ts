import { Theme, ThemeType } from '../types';
import { Icons } from '@/constants/icons';

export const THEMES: Record<ThemeType, Theme> = {
  // Thème par défaut - Bois Cozy (Version 5)
  cozy: {
    id: 'cozy',
    name: 'Bois Cozy',
    wallColor: '#5D4E37',
    pathColor: '#DEB887',
    startIcon: Icons.squirrel,
    endIcon: Icons.chocolate,
    backgroundColor: '#8B6B45',
    cellGradient: {
      start: '#F5DEB3',
      middle: '#DEB887',
      end: '#D2B48C',
    },
    cellHighlight: 'rgba(255,255,255,0.15)',
    borderColor: '#8B6914',
    borderStyle: 'ridge',
    wallThickness: 8,
  },

  forest: {
    id: 'forest',
    name: 'Forêt Enchantée',
    wallColor: '#2D5016',
    pathColor: '#8B7355',
    startIcon: '🏕️',
    endIcon: '⭐',
    backgroundColor: '#1A3D0C',
  },

  temple: {
    id: 'temple',
    name: 'Temple Ancien',
    wallColor: '#4A4A4A',
    pathColor: '#8B8B7A',
    startIcon: '🏛️',
    endIcon: '💎',
    backgroundColor: '#2C2C2C',
  },

  space: {
    id: 'space',
    name: 'Station Spatiale',
    wallColor: '#1E3A5F',
    pathColor: '#0D1B2A',
    startIcon: '🚀',
    endIcon: '🌟',
    backgroundColor: '#0D1B2A',
  },

  ice: {
    id: 'ice',
    name: 'Château de Glace',
    wallColor: '#A8D8EA',
    pathColor: '#E8F4F8',
    startIcon: '❄️',
    endIcon: '👑',
    backgroundColor: '#D4F1F9',
  },

  garden: {
    id: 'garden',
    name: 'Jardin Secret',
    wallColor: '#228B22',
    pathColor: '#F5F5DC',
    startIcon: '🌺',
    endIcon: '🦋',
    backgroundColor: '#90EE90',
  },

  cave: {
    id: 'cave',
    name: 'Grotte Mystérieuse',
    wallColor: '#4A4A4A',
    pathColor: '#8B7355',
    startIcon: '🕯️',
    endIcon: '💎',
    backgroundColor: '#2D2D2D',
  },
};
