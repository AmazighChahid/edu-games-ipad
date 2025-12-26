/**
 * MascotOwl component
 * Animated owl mascot "Piou" with speech bubble
 * Provides contextual messages during gameplay
 */

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  withDelay,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

import { textStyles, spacing, borderRadius, shadows } from '@/theme';

type MessageType = 'intro' | 'hint' | 'error' | 'encourage' | 'victory';

interface MascotOwlProps {
  message: string;
  messageType?: MessageType;
  visible?: boolean;
}

// Color palette for the owl
const OWL_COLORS = {
  body: ['#D4A574', '#C49A6C'],
  wing: '#C49A6C',
  beak: '#FFB347',
  eye: '#FFFFFF',
  pupil: '#4A4A4A',
};

// Message type to color mapping
const MESSAGE_COLORS: Record<MessageType, string> = {
  intro: '#4A4A4A',
  hint: '#5B8DEE',
  error: '#E67E22',
  encourage: '#7BC74D',
  victory: '#FFD700',
};

export function MascotOwl({
  message,
  messageType = 'intro',
  visible = true,
}: MascotOwlProps) {
  const [currentMessage, setCurrentMessage] = useState(message);

  // Animation values
  const bodyY = useSharedValue(0);
  const leftPupilScale = useSharedValue(1);
  const rightPupilScale = useSharedValue(1);
  const bubbleScale = useSharedValue(0);

  // Idle floating animation
  useEffect(() => {
    bodyY.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  // Blinking animation
  useEffect(() => {
    const blink = () => {
      leftPupilScale.value = withSequence(
        withTiming(0.1, { duration: 80 }),
        withTiming(1, { duration: 80 })
      );
      rightPupilScale.value = withSequence(
        withDelay(20, withTiming(0.1, { duration: 80 })),
        withTiming(1, { duration: 80 })
      );
    };

    // Blink every 3-5 seconds randomly
    const interval = setInterval(() => {
      blink();
    }, 3500 + Math.random() * 1500);

    return () => clearInterval(interval);
  }, []);

  // Bubble appearance animation
  useEffect(() => {
    if (visible) {
      bubbleScale.value = withSpring(1, { damping: 12, stiffness: 200 });
    } else {
      bubbleScale.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  // Update message with fade transition
  useEffect(() => {
    setCurrentMessage(message);
  }, [message]);

  // Animated styles
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

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {/* Speech bubble */}
      <Animated.View style={[styles.speechBubble, bubbleStyle]}>
        <Text style={[styles.bubbleName, { color: MESSAGE_COLORS[messageType] }]}>
          Piou le Hibou :
        </Text>
        <Text style={styles.bubbleText}>{currentMessage}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    left: 20,
    zIndex: 100,
  },

  // Speech bubble
  speechBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    paddingBottom: spacing[3],
    maxWidth: 220,
    ...shadows.lg,
    marginBottom: spacing[3],
  },
  bubbleName: {
    ...textStyles.caption,
    fontWeight: '700',
    marginBottom: spacing[1],
  },
  bubbleText: {
    ...textStyles.body,
    color: '#4A4A4A',
    lineHeight: 22,
  },
  bubbleArrow: {
    position: 'absolute',
    bottom: -10,
    left: 30,
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },

  // Owl body
  owl: {
    width: 80,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },
  body: {
    width: 80,
    height: 90,
    backgroundColor: OWL_COLORS.body[0],
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 15,
  },

  // Eyes
  eye: {
    position: 'absolute',
    top: 20,
    width: 24,
    height: 24,
    backgroundColor: OWL_COLORS.eye,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeLeft: {
    left: 12,
  },
  eyeRight: {
    right: 12,
  },
  pupil: {
    width: 12,
    height: 12,
    backgroundColor: OWL_COLORS.pupil,
    borderRadius: 6,
  },

  // Beak
  beak: {
    position: 'absolute',
    top: 45,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: OWL_COLORS.beak,
  },

  // Wings
  wing: {
    position: 'absolute',
    top: 50,
    width: 25,
    height: 35,
    backgroundColor: OWL_COLORS.wing,
    borderRadius: 12,
  },
  wingLeft: {
    left: -15,
    transform: [{ rotate: '-10deg' }],
  },
  wingRight: {
    right: -15,
    transform: [{ rotate: '10deg' }],
  },
});
