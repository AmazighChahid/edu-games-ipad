/**
 * Progress Bar Component
 * Shows filled cells progress with smooth animation
 * Matches the HTML mockup design
 */

import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { spacing } from '../../../theme';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = current / total;
  const progressWidth = Animated.useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withTiming(progress * 100, {
      duration: 500,
      easing: Easing.out(Easing.quad),
    });
  }, [progress]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <Animated.View style={[styles.barFill, progressStyle]} />
      </View>
      <Text style={styles.text}>
        <Text style={styles.textHighlight}>{current}</Text> / {total} cases
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: spacing[4],
  },
  barContainer: {
    width: 300,
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#7BC74D', // Green gradient would be: linear-gradient(90deg, #7BC74D, #5BAE6B)
    borderRadius: 8,
  },
  text: {
    fontFamily: 'Fredoka',
    fontSize: 16,
    color: '#4A4A4A',
  },
  textHighlight: {
    color: '#7BC74D',
    fontWeight: '700',
  },
});
