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
 */

import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { theme } from '@/theme';

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
          <Text style={[styles.iconText, size === 'large' && styles.iconTextLarge]}>←</Text>
        </Animated.View>
      </Pressable>
    );
  }

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
        <Text style={styles.textButtonIcon}>←</Text>
        <Text style={styles.textButtonLabel}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // Icon variant
  iconButton: {
    width: theme.touchTargets.child,
    height: theme.touchTargets.child,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  iconButtonLarge: {
    width: theme.touchTargets.large,
    height: theme.touchTargets.large,
  },
  iconText: {
    fontSize: 28,
    color: theme.colors.text.primary,
    fontWeight: 'bold',
  },
  iconTextLarge: {
    fontSize: 32,
  },

  // Text variant
  textButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    minHeight: 48, // Touch target minimum
    ...theme.shadows.sm,
  },
  textButtonIcon: {
    fontSize: 20,
    color: theme.colors.primary.contrast,
    fontWeight: 'bold',
  },
  textButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary.contrast,
    fontFamily: 'Nunito_600SemiBold',
  },
});
