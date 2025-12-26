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

      <View style={styles.divider} />

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

      <View style={styles.divider} />

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
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 20,
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 32,
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
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
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
