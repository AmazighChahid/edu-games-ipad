/**
 * Weight Object Component
 * Draggable object that can be placed on balance plates
 */

import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

import { colors, touchTargets, shadows, borderRadius } from '@/theme';
import type { WeightObject as WeightObjectType } from '../types';

interface WeightObjectProps {
  object: WeightObjectType;
  onDragStart?: () => void;
  onDragEnd?: (x: number, y: number) => void;
  onPress?: () => void;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function WeightObject({
  object,
  onDragStart,
  onDragEnd,
  onPress,
  disabled = false,
}: WeightObjectProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const isDragging = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .onStart(() => {
      isDragging.value = true;
      scale.value = withSpring(1.1);
      if (onDragStart) runOnJS(onDragStart)();
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      isDragging.value = false;
      scale.value = withSpring(1);

      if (onDragEnd) {
        runOnJS(onDragEnd)(event.absoluteX, event.absoluteY);
      }

      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const tapGesture = Gesture.Tap()
    .enabled(!disabled && !!onPress)
    .onStart(() => {
      scale.value = withSpring(0.95);
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    })
    .onEnd(() => {
      scale.value = withSpring(1);
      if (onPress) runOnJS(onPress)();
    });

  const composedGesture = Gesture.Race(panGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: isDragging.value ? 1000 : 1,
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <AnimatedPressable
        style={[
          styles.container,
          { backgroundColor: object.color },
          disabled && styles.disabled,
          animatedStyle,
        ]}
        accessibilityLabel={`${object.name}`}
        accessibilityRole="button"
      >
        <Text style={styles.emoji}>{object.emoji}</Text>
        {object.displayValue !== undefined && (
          <Text style={styles.value}>{object.displayValue}</Text>
        )}
      </AnimatedPressable>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    width: touchTargets.xlarge,
    height: touchTargets.xlarge,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  emoji: {
    fontSize: 36,
  },
  value: {
    position: 'absolute',
    bottom: 4,
    right: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.inverse,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  disabled: {
    opacity: 0.5,
  },
});
