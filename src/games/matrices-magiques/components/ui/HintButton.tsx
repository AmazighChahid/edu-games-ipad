/**
 * HintButton - Button to request hints
 * Shows remaining hints count with animated feedback
 */

import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

// ============================================================================
// TYPES
// ============================================================================

interface HintButtonProps {
  hintsRemaining: number;
  onPress: () => void;
  disabled?: boolean;
}

// ============================================================================
// HINT BUTTON COMPONENT
// ============================================================================

function HintButtonComponent({
  hintsRemaining,
  onPress,
  disabled = false,
}: HintButtonProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const handlePress = () => {
    if (disabled || hintsRemaining <= 0) {
      // Shake animation
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      rotation.value = withSequence(
        withTiming(-5, { duration: 50 }),
        withTiming(5, { duration: 100 }),
        withTiming(-5, { duration: 100 }),
        withTiming(0, { duration: 50 })
      );
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const isDisabled = disabled || hintsRemaining <= 0;

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={() => { scale.value = withSpring(0.9); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      accessibilityRole="button"
      accessibilityLabel={`Demander un indice, ${hintsRemaining} restants`}
      accessibilityState={{ disabled: isDisabled }}
    >
      <Animated.View
        style={[
          styles.container,
          isDisabled && styles.containerDisabled,
          animatedStyle,
        ]}
      >
        <Text style={styles.icon}>💡</Text>

        {/* Remaining hints indicator */}
        <View style={styles.countContainer}>
          {[1, 2, 3].map((dot) => (
            <View
              key={dot}
              style={[
                styles.dot,
                dot <= hintsRemaining ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      </Animated.View>
    </Pressable>
  );
}

export const HintButton = memo(HintButtonComponent);

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFB347',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  containerDisabled: {
    backgroundColor: '#BDBDBD',
    opacity: 0.7,
  },
  icon: {
    fontSize: 28,
    marginBottom: 4,
  },
  countContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
  },
  dotInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});
