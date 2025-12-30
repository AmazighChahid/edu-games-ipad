/**
 * RuleBadge component
 * Affiche la règle de jeu actuelle avec icône et description
 * Composant memoizé pour les performances
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import type { GameRule } from '../types';
import { colors, spacing, borderRadius, fontFamily } from '../../../theme';

// ============================================
// TYPES
// ============================================

interface RuleBadgeProps {
  rule: GameRule;
}

// ============================================
// COMPONENT
// ============================================

function RuleBadgePure({ rule }: RuleBadgeProps) {
  return (
    <View style={styles.ruleBadge}>
      <Text style={styles.ruleBadgeIcon}>{rule.iconHint}</Text>
      <Text style={styles.ruleBadgeText}>{rule.description}</Text>
    </View>
  );
}

// ============================================
// MEMOIZATION
// ============================================

export const RuleBadge = React.memo(RuleBadgePure);

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  ruleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: 'rgba(155, 89, 182, 0.15)',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: '#9B59B6',
    marginBottom: spacing[3],
  },
  ruleBadgeIcon: {
    fontSize: 24,
  },
  ruleBadgeText: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    color: colors.text.secondary,
    flex: 1,
  },
});

export default RuleBadge;
