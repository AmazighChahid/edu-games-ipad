/**
 * TimerBar component
 * Displays remaining time as a progress bar
 */

import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { colors, borderRadius, spacing } from '@/theme';

interface TimerBarProps {
  timeRemaining: number;
  totalTime: number;
}

export function TimerBar({ timeRemaining, totalTime }: TimerBarProps) {
  const progress = totalTime > 0 ? timeRemaining / totalTime : 1;
  const isLow = progress < 0.25;
  const isCritical = progress < 0.1;

  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(`${progress * 100}%`, { duration: 300 }),
    backgroundColor: withTiming(
      isCritical
        ? colors.feedback.error
        : isLow
        ? colors.feedback.warning
        : colors.feedback.success,
      { duration: 300 }
    ),
  }));

  // Format time as MM:SS
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <Animated.View style={[styles.bar, animatedStyle]} />
      </View>
      <Text style={[styles.timeText, isCritical && styles.timeTextCritical]}>
        {timeDisplay}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
  },
  barContainer: {
    flex: 1,
    height: 12,
    backgroundColor: colors.ui.divider,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: borderRadius.round,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    minWidth: 50,
    textAlign: 'right',
  },
  timeTextCritical: {
    color: colors.feedback.error,
  },
});
