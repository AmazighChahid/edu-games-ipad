/**
 * VictoryMascot Component
 * Enhanced owl mascot "Piou" for victory screen with larger size
 * Uses same design as MascotOwl but optimized for victory popup
 */

import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';

interface VictoryMascotProps {
  message: string;
  delay?: number;
}

// Color palette for the owl (matching MascotOwl)
const OWL_COLORS = {
  body: '#D4A574',
  wing: '#C49A6C',
  beak: '#FFB347',
  eye: '#FFFFFF',
  pupil: '#4A4A4A',
};

export function VictoryMascot({ message, delay = 2500 }: VictoryMascotProps) {
  // Animation values
  const containerScale = useSharedValue(0);
  const bodyY = useSharedValue(0);
  const leftPupilScale = useSharedValue(1);
  const rightPupilScale = useSharedValue(1);
  const bubbleScale = useSharedValue(0);

  // Initial popup animation
  useEffect(() => {
    containerScale.value = withDelay(
      delay,
      withSpring(1, { damping: 12, stiffness: 200 })
    );

    // Bubble appears slightly after owl
    bubbleScale.value = withDelay(
      delay + 200,
      withSpring(1, { damping: 10, stiffness: 150 })
    );
  }, [delay]);

  // Idle floating animation
  useEffect(() => {
    bodyY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-8, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    );
  }, [delay]);

  // Blinking animation
  useEffect(() => {
    const blink = () => {
      leftPupilScale.value = withSequence(
        withTiming(0.1, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
      rightPupilScale.value = withSequence(
        withDelay(30, withTiming(0.1, { duration: 100 })),
        withTiming(1, { duration: 100 })
      );
    };

    const interval = setInterval(() => {
      blink();
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, []);

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
    opacity: containerScale.value,
  }));

  const bodyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bodyY.value }],
  }));

  const leftPupilStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: leftPupilScale.value }],
  }));

  const rightPupilStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: rightPupilScale.value }],
  }));

  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bubbleScale.value }],
    opacity: bubbleScale.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Speech bubble */}
      <Animated.View style={[styles.speechBubble, bubbleStyle]}>
        <Text style={styles.bubbleName}>Piou le Hibou :</Text>
        <Text style={styles.bubbleText}>{message}</Text>
        <View style={styles.bubbleArrow} />
      </Animated.View>

      {/* Owl body */}
      <Animated.View style={[styles.owl, bodyStyle]}>
        {/* Wings */}
        <View style={[styles.wing, styles.wingLeft]} />
        <View style={[styles.wing, styles.wingRight]} />

        {/* Body */}
        <View style={styles.body}>
          {/* Eyes */}
          <View style={[styles.eye, styles.eyeLeft]}>
            <Animated.View style={[styles.pupil, leftPupilStyle]} />
          </View>
          <View style={[styles.eye, styles.eyeRight]}>
            <Animated.View style={[styles.pupil, rightPupilStyle]} />
          </View>

          {/* Beak */}
          <View style={styles.beak} />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    right: 60,
    zIndex: 200,
    alignItems: 'center',
  },

  // Speech bubble (larger than original)
  speechBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    paddingBottom: 16,
    maxWidth: 280,
    minWidth: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    marginBottom: 16,
  },
  bubbleName: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 16,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 6,
  },
  bubbleText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 18,
    color: '#4A4A4A',
    lineHeight: 26,
    textAlign: 'center',
  },
  bubbleArrow: {
    position: 'absolute',
    bottom: -14,
    left: '50%',
    marginLeft: -16,
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderTopWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },

  // Owl body (larger than original)
  owl: {
    width: 120,
    height: 135,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    width: 120,
    height: 135,
    backgroundColor: OWL_COLORS.body,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    borderBottomLeftRadius: 54,
    borderBottomRightRadius: 54,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },

  // Eyes (larger)
  eye: {
    position: 'absolute',
    top: 30,
    width: 36,
    height: 36,
    backgroundColor: OWL_COLORS.eye,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  eyeLeft: {
    left: 18,
  },
  eyeRight: {
    right: 18,
  },
  pupil: {
    width: 18,
    height: 18,
    backgroundColor: OWL_COLORS.pupil,
    borderRadius: 9,
  },

  // Beak (larger)
  beak: {
    position: 'absolute',
    top: 68,
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderTopWidth: 22,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: OWL_COLORS.beak,
  },

  // Wings (larger)
  wing: {
    position: 'absolute',
    top: 75,
    width: 38,
    height: 52,
    backgroundColor: OWL_COLORS.wing,
    borderRadius: 18,
  },
  wingLeft: {
    left: -22,
    transform: [{ rotate: '-12deg' }],
  },
  wingRight: {
    right: -22,
    transform: [{ rotate: '12deg' }],
  },
});
