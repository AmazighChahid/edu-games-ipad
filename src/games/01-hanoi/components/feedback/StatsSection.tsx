/**
 * StatsSection Component
 * Displays game stats (moves, optimal, time, perfect badge)
 */

import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface StatsSectionProps {
  moves: number;
  optimalMoves: number;
  timeElapsed: number; // in seconds
  isPerfect: boolean;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function StatsSection({
  moves,
  optimalMoves,
  timeElapsed,
  isPerfect,
}: StatsSectionProps) {
  return (
    <Animated.View entering={FadeInDown.delay(2000)} style={styles.container}>
      {/* Moves */}
      <View style={styles.statItem}>
        <Text style={[styles.statValue, styles.blueValue]}>{moves}</Text>
        <Text style={styles.statLabel}>Tes coups</Text>
      </View>

      {/* Optimal */}
      <View style={styles.statItem}>
        <Text style={[styles.statValue, styles.greenValue]}>{optimalMoves}</Text>
        <Text style={styles.statLabel}>Optimal</Text>
        {isPerfect && (
          <View style={styles.perfectBadge}>
            <Text style={styles.perfectEmoji}>🏆</Text>
            <Text style={styles.perfectText}>Parfait !</Text>
          </View>
        )}
      </View>

      {/* Time */}
      <View style={styles.statItem}>
        <Text style={[styles.statValue, styles.goldValue]}>{formatTime(timeElapsed)}</Text>
        <Text style={styles.statLabel}>Temps</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderTopWidth: 2,
    borderTopColor: '#F0F0F0',
    gap: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 36,
    fontWeight: '700',
  },
  blueValue: {
    color: '#5B8DEE',
  },
  greenValue: {
    color: '#7BC74D',
  },
  goldValue: {
    color: '#FFB347',
  },
  statLabel: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#9A9A9A',
    marginTop: 4,
  },
  perfectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(123, 199, 77, 0.15)',
    borderWidth: 2,
    borderColor: '#7BC74D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  perfectEmoji: {
    fontSize: 16,
  },
  perfectText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 13,
    fontWeight: '700',
    color: '#5BAE6B',
  },
});
