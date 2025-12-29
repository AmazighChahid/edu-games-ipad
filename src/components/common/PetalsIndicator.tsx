/**
 * PetalsIndicator
 * ===============
 * Indicateur de score sous forme de pétales/feuilles.
 * Remplace les étoiles ⭐ pour un style flat et cohérent avec le thème forêt.
 *
 * @example
 * // État normal (2/3 pétales)
 * <PetalsIndicator filledCount={2} />
 *
 * // Dans une card sélectionnée (couleurs blanches)
 * <PetalsIndicator filledCount={2} isSelected />
 *
 * // Grande taille avec animation
 * <PetalsIndicator filledCount={3} size="large" animated />
 */

import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

// ============================================
// TYPES
// ============================================

export interface PetalsIndicatorProps {
  /** Nombre de pétales remplis (0-3) */
  filledCount: 0 | 1 | 2 | 3;

  /** Nombre total de pétales (défaut: 3) */
  totalCount?: number;

  /** Taille des pétales */
  size?: 'small' | 'medium' | 'large';

  /** Mode sélectionné (couleurs blanches) */
  isSelected?: boolean;

  /** Animation d'entrée activée */
  animated?: boolean;

  /** Couleur personnalisée pour filled (optionnel) */
  filledColor?: string;

  /** Couleur personnalisée pour empty (optionnel) */
  emptyColor?: string;
}

// ============================================
// CONSTANTES
// ============================================

const SIZES = {
  small: { width: 8, height: 13, gap: 3, radiusTop: 8, radiusBottom: 3 },
  medium: { width: 10, height: 16, gap: 4, radiusTop: 10, radiusBottom: 4 },
  large: { width: 14, height: 22, gap: 6, radiusTop: 14, radiusBottom: 5 },
};

const COLORS = {
  filled: '#7BC74D', // Vert nature
  empty: '#E0E0E0', // Gris neutre
  selectedFilled: '#FFFFFF',
  selectedEmpty: 'rgba(255, 255, 255, 0.3)',
};

// ============================================
// SOUS-COMPOSANT: PÉTALE ANIMÉ
// ============================================

interface AnimatedPetalProps {
  index: number;
  style: ViewStyle;
}

const AnimatedPetal: React.FC<AnimatedPetalProps> = ({ index, style }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Animation d'entrée staggerée
    scale.value = withDelay(
      index * 80,
      withSpring(1, { damping: 12, stiffness: 150 })
    );
    opacity.value = withDelay(
      index * 80,
      withSpring(1, { damping: 15, stiffness: 200 })
    );
  }, [index, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[style, animatedStyle]} />;
};

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const PetalsIndicator: React.FC<PetalsIndicatorProps> = ({
  filledCount,
  totalCount = 3,
  size = 'medium',
  isSelected = false,
  animated = false,
  filledColor,
  emptyColor,
}) => {
  const sizeConfig = SIZES[size];

  // Couleurs selon l'état
  const colors = useMemo(
    () => ({
      filled: isSelected
        ? COLORS.selectedFilled
        : filledColor || COLORS.filled,
      empty: isSelected ? COLORS.selectedEmpty : emptyColor || COLORS.empty,
    }),
    [isSelected, filledColor, emptyColor]
  );

  // Style de base pour un pétale
  const getPetalStyle = (isFilled: boolean): ViewStyle => ({
    width: sizeConfig.width,
    height: sizeConfig.height,
    backgroundColor: isFilled ? colors.filled : colors.empty,
    borderTopLeftRadius: sizeConfig.radiusTop,
    borderTopRightRadius: sizeConfig.radiusTop,
    borderBottomLeftRadius: sizeConfig.radiusBottom,
    borderBottomRightRadius: sizeConfig.radiusBottom,
  });

  // Rendu des pétales
  const renderPetals = () => {
    return Array.from({ length: totalCount }, (_, index) => {
      const isFilled = index < filledCount;

      if (animated) {
        return (
          <AnimatedPetal
            key={index}
            index={index}
            style={getPetalStyle(isFilled)}
          />
        );
      }

      return <View key={index} style={getPetalStyle(isFilled)} />;
    });
  };

  return (
    <View
      style={[styles.container, { gap: sizeConfig.gap }]}
      accessibilityLabel={`${filledCount} pétales sur ${totalCount}`}
      accessibilityRole="text"
    >
      {renderPetals()}
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PetalsIndicator;
