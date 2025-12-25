/**
 * Constantes de mise en page
 * Optimisées pour iPad et interaction enfant
 */

import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Layout = {
  // Dimensions écran
  screen: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },

  // Tailles de cibles tactiles (Apple HIG + adaptations enfant)
  touchTarget: {
    minimum: 44,          // Minimum Apple HIG
    comfortable: 60,      // Recommandé pour enfants
    large: 80,            // Actions principales
    extraLarge: 100,      // Boutons très importants
  },

  // Échelle d'espacement (système 8px)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  // Rayons de bordure
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    full: 9999,  // Cercle parfait
  },

  // Spécifique iPad
  iPad: {
    minWidth: 768,
    contentMaxWidth: 600,  // Largeur max contenu lisible
    sideMargin: 48,        // Marges latérales
    topMargin: 60,         // Marge supérieure
  },

  // Tour de Hanoï - dimensions du jeu
  hanoi: {
    towerWidth: 150,
    towerHeight: 200,
    poleWidth: 16,
    poleHeight: 180,
    baseWidth: 140,
    baseHeight: 20,
    discMinWidth: 60,
    discMaxWidth: 130,
    discHeight: 40,
    discSpacing: 4,
  },

  // Zones de drop (plus grandes que les éléments visuels)
  dropZone: {
    padding: 20,  // Zone de tolérance autour des tours
  },

  // Animations
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
  },

  // Ombres
  shadow: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
} as const;

// Helper pour vérifier si c'est un iPad
export const isTablet = (): boolean => {
  const aspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
  return (
    Platform.OS === 'ios' &&
    (SCREEN_WIDTH >= Layout.iPad.minWidth || aspectRatio < 1.6)
  );
};

// Helper pour obtenir la largeur de contenu optimale
export const getContentWidth = (): number => {
  if (isTablet()) {
    return Math.min(SCREEN_WIDTH - Layout.iPad.sideMargin * 2, Layout.iPad.contentMaxWidth);
  }
  return SCREEN_WIDTH - Layout.spacing.lg * 2;
};
