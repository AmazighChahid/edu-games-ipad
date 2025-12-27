/**
 * Stats Panel Component
 * Displays game statistics: errors, hints used, and reset button
 * Matches the HTML mockup design
 */

import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { colors, spacing, textStyles, borderRadius, shadows } from '@/theme';
import { useStore } from '@/store';

interface StatsPanelProps {
  errorCount: number;
  hintsUsed: number;
  onReset: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function StatsPanel({ errorCount, hintsUsed, onReset }: StatsPanelProps) {
  const hapticEnabled = useStore((state) => state.hapticEnabled);
  const resetScale = useSharedValue(1);

  const handleReset = () => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    resetScale.value = withSequence(
      withSpring(0.9, { duration: 100 }),
      withSpring(1, { duration: 100 })
    );

    onReset();
  };

  const resetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: resetScale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Errors stat */}
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Erreurs</Text>
        <Text style={[styles.statValue, styles.statValueError]}>{errorCount}</Text>
      </View>

      <View style={styles.divider} />

      {/* Hints stat */}
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Indices</Text>
        <Text style={[styles.statValue, styles.statValueHints]}>{hintsUsed}</Text>
      </View>

      {/* Reset button */}
      <AnimatedPressable
        onPress={handleReset}
        style={[styles.resetButton, resetAnimatedStyle]}
      >
        <Text style={styles.resetIcon}>↻</Text>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 18,
    gap: 24,
    ...shadows.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#9A9A9A',
    marginBottom: 4,
  },
  statValue: {
    fontFamily: 'Fredoka',
    fontSize: 28,
    fontWeight: '700',
  },
  statValueError: {
    color: '#E57373', // Red for errors
  },
  statValueHints: {
    color: '#5B8DEE', // Blue for hints
  },
  divider: {
    width: 2,
    height: 40,
    backgroundColor: '#EEEEEE',
  },
  resetButton: {
    width: 44,
    height: 44,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetIcon: {
    fontSize: 20,
    color: '#7A7A7A',
  },
});
