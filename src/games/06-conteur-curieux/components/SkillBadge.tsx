/**
 * SkillBadge Component
 *
 * Badge représentant une compétence développée
 * Utilisé sur l'écran de victoire
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';

import { spacing, borderRadius, fontFamily } from '@/theme';

interface SkillBadgeProps {
  emoji: string;
  label: string;
  color?: string;
  delay?: number;
  animated?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function SkillBadge({
  emoji,
  label,
  color = '#5B8DEE',
  delay = 0,
  animated = true,
  size = 'medium',
}: SkillBadgeProps) {
  const Container = animated ? Animated.View : View;
  const containerProps = animated
    ? { entering: FadeInUp.delay(delay).duration(300) }
    : {};

  const sizeStyles = SIZE_STYLES[size];

  return (
    <Container
      style={[
        styles.container,
        { backgroundColor: `${color}15` },
        sizeStyles.container,
      ]}
      {...containerProps}
    >
      <Text style={[styles.emoji, sizeStyles.emoji]}>{emoji}</Text>
      <Text style={[styles.label, { color }, sizeStyles.label]}>{label}</Text>
    </Container>
  );
}

const SIZE_STYLES = {
  small: {
    container: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      gap: 4,
    },
    emoji: {
      fontSize: 12,
    },
    label: {
      fontSize: 10,
    },
  },
  medium: {
    container: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      gap: 6,
    },
    emoji: {
      fontSize: 16,
    },
    label: {
      fontSize: 12,
    },
  },
  large: {
    container: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      gap: 8,
    },
    emoji: {
      fontSize: 20,
    },
    label: {
      fontSize: 14,
    },
  },
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
  },
  emoji: {
    fontSize: 16,
  },
  label: {
    fontFamily: fontFamily.semiBold,
  },
});

export default SkillBadge;
