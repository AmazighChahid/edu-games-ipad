/**
 * PetalsIndicator
 * ===============
 * Indicateur de score sous forme d'étoiles outline (contour uniquement).
 * Style flat et cohérent avec le thème de l'app.
 *
 * @example
 * // État normal (2/3 étoiles)
 * <PetalsIndicator filledCount={2} />
 *
 * // Dans une card sélectionnée (couleurs blanches)
 * <PetalsIndicator filledCount={2} isSelected />
 *
 * // Grande taille avec animation
 * <PetalsIndicator filledCount={3} size="large" animated />
 */

import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
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
  small: { size: 17, strokeWidth: 1.5, gap: 3 },
  medium: { size: 21, strokeWidth: 2, gap: 4 },
  large: { size: 27, strokeWidth: 2.5, gap: 6 },
};

const COLORS = {
  filled: '#fff000', // Or/Jaune pour étoile remplie
  empty: '#D0D0D0', // Gris pour contour vide
  selectedFilled: '#FFFFFF',
  selectedEmpty: 'rgba(255, 255, 255, 0.4)',
};

// Générer les points d'une étoile à 5 branches
const generateStarPoints = (cx: number, cy: number, outerRadius: number, innerRadius: number): string => {
  const points = [];
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  return points.join(' ');
};

// ============================================
// SOUS-COMPOSANT: ÉTOILE SVG
// ============================================

interface StarSVGProps {
  size: number;
  strokeWidth: number;
  strokeColor: string;
  filled: boolean;
}

const StarSVG: React.FC<StarSVGProps> = ({ size, strokeWidth, strokeColor, filled }) => {
  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = (size / 2) - strokeWidth;
  const innerRadius = outerRadius * 0.4;
  const points = generateStarPoints(cx, cy, outerRadius, innerRadius);

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Polygon
        points={points}
        fill={filled ? strokeColor : 'none'}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
};

// ============================================
// SOUS-COMPOSANT: ÉTOILE ANIMÉE
// ============================================

interface AnimatedStarProps {
  index: number;
  size: number;
  strokeWidth: number;
  strokeColor: string;
  filled: boolean;
}

const AnimatedStar: React.FC<AnimatedStarProps> = ({ index, size, strokeWidth, strokeColor, filled }) => {
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

  return (
    <Animated.View style={animatedStyle}>
      <StarSVG size={size} strokeWidth={strokeWidth} strokeColor={strokeColor} filled={filled} />
    </Animated.View>
  );
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

  // Rendu des étoiles
  const renderStars = () => {
    return Array.from({ length: totalCount }, (_, index) => {
      const isFilled = index < filledCount;
      const strokeColor = isFilled ? colors.filled : colors.empty;

      if (animated) {
        return (
          <AnimatedStar
            key={index}
            index={index}
            size={sizeConfig.size}
            strokeWidth={sizeConfig.strokeWidth}
            strokeColor={strokeColor}
            filled={isFilled}
          />
        );
      }

      return (
        <StarSVG
          key={index}
          size={sizeConfig.size}
          strokeWidth={sizeConfig.strokeWidth}
          strokeColor={strokeColor}
          filled={isFilled}
        />
      );
    });
  };

  return (
    <View
      style={[styles.container, { gap: sizeConfig.gap }]}
      accessibilityLabel={`${filledCount} étoiles sur ${totalCount}`}
      accessibilityRole="text"
    >
      {renderStars()}
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
