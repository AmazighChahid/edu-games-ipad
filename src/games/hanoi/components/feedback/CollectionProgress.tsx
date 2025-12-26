/**
 * CollectionProgress Component
 * Shows progress bar for card collection
 */

import { View, Text, StyleSheet } from 'react-native';
import { getTotalCardCount } from '../../data/collectibleCards';

interface CollectionProgressProps {
  unlockedCount: number;
}

export function CollectionProgress({ unlockedCount }: CollectionProgressProps) {
  const totalCards = getTotalCardCount();
  const progress = unlockedCount / totalCards;

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎁</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>
        {unlockedCount}/{totalCards} cartes
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
  },
  emoji: {
    fontSize: 18,
  },
  progressBar: {
    width: 120,
    height: 8,
    backgroundColor: '#EEE',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#5B8DEE',
    borderRadius: 4,
  },
  progressText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#9A9A9A',
  },
});
