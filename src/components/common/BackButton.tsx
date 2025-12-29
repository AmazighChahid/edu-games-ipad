/**
 * BackButton - Bouton retour standardisé pour toute l'application
 *
 * Variants:
 * - 'icon': Flèche seule (défaut)
 * - 'text': Flèche + texte "Menu" ou personnalisé
 *
 * Caractéristiques:
 * - Touch target ≥ 64dp (conforme guidelines enfant)
 * - Animation spring au tap
 * - Feedback visuel immédiat
 * - Design unifié avec les écrans de jeu (carré blanc, coins arrondis)
 * - Icône SVG propre (pas de caractère texte)
 */

import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { colors, spacing, shadows } from '../../theme';

// ============================================
// CHEVRON ICON COMPONENT
// ============================================

interface ChevronLeftIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const ChevronLeftIcon: React.FC<ChevronLeftIconProps> = ({
  size = 28,
  color = '#5B8DEE',
  strokeWidth = 3,
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M15 19L8 12L15 5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ============================================
// BACK BUTTON COMPONENT
// ============================================

export interface BackButtonProps {
  onPress: () => void;
  variant?: 'icon' | 'text';
  label?: string;
  size?: 'medium' | 'large';
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  variant = 'icon',
  label = 'Menu',
  size = 'medium',
}) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1.02, { damping: 10, stiffness: 200 });
    translateY.value = withSpring(-3, { damping: 10, stiffness: 200 });

    setTimeout(() => {
      scale.value = withSpring(1, { damping: 10, stiffness: 200 });
      translateY.value = withSpring(0, { damping: 10, stiffness: 200 });
    }, 150);
  };

  const handlePress = () => {
    onPress();
  };

  // Tailles selon le variant
  const iconSize = size === 'large' ? 32 : 28;
  const strokeWidth = size === 'large' ? 3.5 : 3;

  if (variant === 'icon') {
    return (
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessible
        accessibilityLabel="Retour"
        accessibilityRole="button"
        accessibilityHint="Revenir à l'écran précédent"
      >
        <Animated.View
          style={[
            styles.iconButton,
            size === 'large' && styles.iconButtonLarge,
            animatedStyle,
          ]}
        >
          <ChevronLeftIcon
            size={iconSize}
            color={colors.primary.main}
            strokeWidth={strokeWidth}
          />
        </Animated.View>
      </Pressable>
    );
  }

  // Variant text
  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessible
      accessibilityLabel={`Retour au ${label}`}
      accessibilityRole="button"
      accessibilityHint="Revenir à l'écran précédent"
    >
      <Animated.View style={[styles.textButton, animatedStyle]}>
        <ChevronLeftIcon
          size={22}
          color={colors.primary.contrast}
          strokeWidth={2.5}
        />
        <Text style={styles.textButtonLabel}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  // Icon variant - Design unifié avec HanoiIntroScreen
  iconButton: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  iconButtonLarge: {
    width: 72,
    height: 72,
    borderRadius: 24,
  },

  // Text variant
  textButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.primary.main,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    borderRadius: 20,
    minHeight: 56,
    ...shadows.md,
  },
  textButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary.contrast,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default BackButton;
