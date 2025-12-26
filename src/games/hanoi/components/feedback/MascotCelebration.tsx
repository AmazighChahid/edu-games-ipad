/**
 * MascotCelebration Component
 * Bouncing owl mascot with speech bubble
 */

import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface MascotCelebrationProps {
  message: string;
  delay?: number;
}

export function MascotCelebration({
  message,
  delay = 2500,
}: MascotCelebrationProps) {
  const scale = useSharedValue(0);
  const bounce = useSharedValue(0);

  useEffect(() => {
    // Popup animation
    scale.value = withDelay(delay, withSpring(1, { damping: 10, stiffness: 200 }));

    // Continuous bounce
    bounce.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-15, { duration: 400 }),
          withTiming(0, { duration: 400 })
        ),
        -1,
        false
      )
    );
  }, [delay]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: bounce.value }],
  }));

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      {/* Speech Bubble */}
      <View style={styles.speechBubble}>
        <Text style={styles.speechText}>{message}</Text>
        <View style={styles.speechTail} />
      </View>

      {/* Owl Mascot */}
      <Text style={styles.mascot}>🦉</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
    right: 80,
    alignItems: 'center',
  },
  speechBubble: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 12,
    maxWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  speechTail: {
    position: 'absolute',
    bottom: -8,
    left: 30,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#fff',
  },
  speechText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: '#4A4A4A',
    lineHeight: 20,
    textAlign: 'center',
  },
  mascot: {
    fontSize: 60,
  },
});
