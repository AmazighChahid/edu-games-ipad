/**
 * ProgressDots - Visual progress indicator for puzzles
 * Shows completed, current, and remaining puzzles as dots
 */

import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  FadeIn,
} from 'react-native-reanimated';
import { useEffect } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface ProgressDotsProps {
  total: number;
  current: number;
  completed: number;
  primaryColor?: string;
}

// ============================================================================
// ANIMATED DOT COMPONENT
// ============================================================================

interface DotProps {
  state: 'completed' | 'current' | 'remaining';
  primaryColor: string;
  index: number;
}

const AnimatedDot = memo(({ state, primaryColor, index }: DotProps) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (state === 'current') {
      // Pulse animation for current dot
      scale.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1,
        true
      );
    } else {
      scale.value = withTiming(1, { duration: 200 });
    }
  }, [state]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getDotStyle = () => {
    switch (state) {
      case 'completed':
        return [styles.dot, styles.dotCompleted, { backgroundColor: primaryColor }];
      case 'current':
        return [styles.dot, styles.dotCurrent, { backgroundColor: primaryColor }];
      default:
        return [styles.dot, styles.dotRemaining];
    }
  };

  return (
    <Animated.View
      entering={FadeIn.delay(50 * index).duration(200)}
      style={[getDotStyle(), animatedStyle]}
    >
      {state === 'completed' && (
        <View style={styles.checkmark}>
          <View style={styles.checkmarkShort} />
          <View style={styles.checkmarkLong} />
        </View>
      )}
    </Animated.View>
  );
});

// ============================================================================
// PROGRESS DOTS COMPONENT
// ============================================================================

function ProgressDotsComponent({
  total,
  current,
  completed,
  primaryColor = '#5B8DEE',
}: ProgressDotsProps) {
  // Limit visible dots if there are too many
  const maxVisibleDots = 10;
  const showEllipsis = total > maxVisibleDots;
  const visibleTotal = showEllipsis ? maxVisibleDots : total;

  const getDotState = (index: number): 'completed' | 'current' | 'remaining' => {
    if (index < completed) return 'completed';
    if (index === current) return 'current';
    return 'remaining';
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: visibleTotal }).map((_, index) => (
        <AnimatedDot
          key={index}
          state={getDotState(index)}
          primaryColor={primaryColor}
          index={index}
        />
      ))}
      {showEllipsis && (
        <View style={styles.ellipsis}>
          <View style={[styles.ellipsisDot, { backgroundColor: primaryColor + '50' }]} />
          <View style={[styles.ellipsisDot, { backgroundColor: primaryColor + '50' }]} />
          <View style={[styles.ellipsisDot, { backgroundColor: primaryColor + '50' }]} />
        </View>
      )}
    </View>
  );
}

export const ProgressDots = memo(ProgressDotsComponent);

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCompleted: {
    // backgroundColor set dynamically
  },
  dotCurrent: {
    // backgroundColor set dynamically
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  dotRemaining: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  checkmark: {
    width: 8,
    height: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkShort: {
    position: 'absolute',
    width: 3,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
    transform: [{ rotate: '45deg' }, { translateX: -1 }, { translateY: 1 }],
  },
  checkmarkLong: {
    position: 'absolute',
    width: 5,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
    transform: [{ rotate: '-45deg' }, { translateX: 1 }],
  },
  ellipsis: {
    flexDirection: 'row',
    gap: 3,
    marginLeft: 4,
  },
  ellipsisDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
