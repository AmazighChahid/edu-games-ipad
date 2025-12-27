/**
 * Game Timer Component
 * Displays elapsed game time in MM:SS format
 * Matches the HTML mockup design
 */

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@/theme';

interface GameTimerProps {
  startTime: Date;
  isActive: boolean;
}

export function GameTimer({ startTime, isActive }: GameTimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime.getTime()) / 1000);
      setElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isActive]);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⏱️</Text>
      <Text style={styles.time}>{timeString}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
    ...shadows.sm,
  },
  icon: {
    fontSize: 20,
  },
  time: {
    fontFamily: 'Fredoka',
    fontSize: 24,
    fontWeight: '700',
    color: '#4A4A4A',
  },
});
