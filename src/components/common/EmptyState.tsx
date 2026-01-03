/**
 * EmptyState component
 * Displays a placeholder message when no content is available
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

import { colors, spacing, fontFamily, fontSize, borderRadius } from '../../theme';

type EmptyStateSize = 'small' | 'medium' | 'large';

export interface EmptyStateProps {
  /** Main message to display */
  message: string;
  /** Decorative emoji (optional) */
  emoji?: string;
  /** Secondary text (optional) */
  subtitle?: string;
  /** Size variant. Default: 'medium' */
  size?: EmptyStateSize;
  /** Container style override */
  style?: ViewStyle;
}

const sizeConfig: Record<EmptyStateSize, { emoji: number; message: number; subtitle: number; padding: number }> = {
  small: {
    emoji: 32,
    message: fontSize.md,
    subtitle: fontSize.sm,
    padding: spacing[4],
  },
  medium: {
    emoji: 48,
    message: fontSize.lg,
    subtitle: fontSize.md,
    padding: spacing[6],
  },
  large: {
    emoji: 64,
    message: fontSize.xl,
    subtitle: fontSize.lg,
    padding: spacing[8],
  },
};

export function EmptyState({
  message,
  emoji,
  subtitle,
  size = 'medium',
  style,
}: EmptyStateProps) {
  const config = sizeConfig[size];

  return (
    <View style={[styles.container, { padding: config.padding }, style]}>
      {emoji && (
        <Text style={[styles.emoji, { fontSize: config.emoji }]}>{emoji}</Text>
      )}
      <Text style={[styles.message, { fontSize: config.message }]}>{message}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { fontSize: config.subtitle }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: borderRadius.lg,
  },
  emoji: {
    marginBottom: spacing[3],
  },
  message: {
    fontFamily: fontFamily.medium,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 28,
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing[2],
  },
});
