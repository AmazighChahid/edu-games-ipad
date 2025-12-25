/**
 * Compteur de mouvements
 * Affiche le nombre de coups effectués
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Layout, Typography } from '../../../constants';
import { getOptimalMoves } from '../logic/gameEngine';

interface MoveCounterProps {
  moves: number;
  discCount: number;
}

export const MoveCounter: React.FC<MoveCounterProps> = ({ moves, discCount }) => {
  const optimalMoves = getOptimalMoves(discCount);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Coups</Text>
      <View style={styles.counterContainer}>
        <Text style={styles.count}>{moves}</Text>
      </View>
      <Text style={styles.optimal}>
        Minimum : {optimalMoves}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: Layout.spacing.md,
  },
  label: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral.textLight,
    marginBottom: Layout.spacing.xs,
  },
  counterContainer: {
    backgroundColor: Colors.neutral.surface,
    borderRadius: Layout.borderRadius.lg,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    ...Layout.shadow.small,
  },
  count: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.primary.dark,
  },
  optimal: {
    fontSize: Typography.sizes.xs,
    color: Colors.neutral.textLight,
    marginTop: Layout.spacing.xs,
  },
});
