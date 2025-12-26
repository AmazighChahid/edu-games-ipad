/**
 * MascotRobot component - Pixel le Robot
 * Animated robot mascot with speech bubble and emotions
 * Shows different facial expressions based on game state
 */

import { useEffect } from 'react';
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
} from 'react-native-reanimated';
import Svg, {
  Rect,
  Circle,
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop
} from 'react-native-svg';

import { spacing, borderRadius, shadows } from '@/theme';

type EmotionType = 'neutral' | 'happy' | 'thinking' | 'excited' | 'encouraging';

interface MascotRobotProps {
  message: string;
  emotion?: EmotionType;
  visible?: boolean;
}

// Robot color palette
const ROBOT_COLORS = {
  body: '#5B8DEE',
  bodyDark: '#4A6FC4',
  bodyLight: '#7BA3F5',
  screen: '#2D4A7C',
  screenGlow: '#6B9FFF',
  antenna: '#FFB347',
  eyes: '#00E5FF',
  eyesGlow: '#00FFFF',
  accent: '#FFD700',
};

// Emotion configurations
const EMOTIONS = {
  neutral: {
    mouthPath: 'M 30 50 L 70 50', // Ligne droite
    eyeScale: 1,
    color: '#4A4A4A',
  },
  happy: {
    mouthPath: 'M 30 45 Q 50 60 70 45', // Sourire
    eyeScale: 1.2,
    color: '#7BC74D',
  },
  thinking: {
    mouthPath: 'M 30 50 Q 40 48 50 50', // Petite courbe
    eyeScale: 0.8,
    color: '#5B8DEE',
  },
  excited: {
    mouthPath: 'M 25 40 Q 50 65 75 40', // Grand sourire
    eyeScale: 1.5,
    color: '#FFD700',
  },
  encouraging: {
    mouthPath: 'M 30 47 Q 50 58 70 47', // Sourire modéré
    eyeScale: 1.1,
    color: '#FFB347',
  },
};

export function MascotRobot({
  message,
  emotion = 'neutral',
  visible = true,
}: MascotRobotProps) {
  // Animation values
  const bodyY = useSharedValue(0);
  const antennaRotate = useSharedValue(0);
  const eyesPulse = useSharedValue(1);
  const bubbleScale = useSharedValue(0);
  const screenGlow = useSharedValue(0.5);

  // Idle floating animation
  useEffect(() => {
    bodyY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  // Antenna bobbing
  useEffect(() => {
    antennaRotate.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(15, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  // Eyes animation based on emotion
  useEffect(() => {
    const targetScale = EMOTIONS[emotion].eyeScale;
    eyesPulse.value = withSpring(targetScale, { damping: 10, stiffness: 150 });

    // Special animation for excited emotion
    if (emotion === 'excited') {
      eyesPulse.value = withRepeat(
        withSequence(
          withTiming(1.5, { duration: 300 }),
          withTiming(1.2, { duration: 300 })
        ),
        -1,
        true
      );
    }
  }, [emotion]);

  // Screen glow animation
  useEffect(() => {
    screenGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0.5, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  // Bubble appearance animation
  useEffect(() => {
    if (visible) {
      bubbleScale.value = withSpring(1, { damping: 15, stiffness: 200 });
    } else {
      bubbleScale.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  // Animated styles
  const bodyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bodyY.value }],
  }));

  const antennaStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${antennaRotate.value}deg` }],
  }));

  const eyesStyle = useAnimatedStyle(() => ({
    transform: [{ scale: eyesPulse.value }],
  }));

  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bubbleScale.value }],
    opacity: bubbleScale.value,
  }));

  const screenGlowStyle = useAnimatedStyle(() => ({
    opacity: screenGlow.value,
  }));

  if (!visible) return null;

  const currentEmotion = EMOTIONS[emotion];

  return (
    <View style={styles.container}>
      {/* Speech bubble with fun styling */}
      <Animated.View style={[styles.speechBubble, bubbleStyle]}>
        <View style={styles.bubbleHeader}>
          <Text style={[styles.bubbleName, { color: currentEmotion.color }]}>
            🤖 Pixel :
          </Text>
        </View>
        <Text style={styles.bubbleText}>{message}</Text>
        <View style={styles.bubbleArrow} />
      </Animated.View>

      {/* Robot SVG */}
      <Animated.View style={[styles.robot, bodyStyle]}>
        <Svg width="100" height="120" viewBox="0 0 100 120">
          <Defs>
            <SvgLinearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={ROBOT_COLORS.bodyLight} />
              <Stop offset="100%" stopColor={ROBOT_COLORS.body} />
            </SvgLinearGradient>
            <SvgLinearGradient id="screenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={ROBOT_COLORS.screenGlow} />
              <Stop offset="100%" stopColor={ROBOT_COLORS.screen} />
            </SvgLinearGradient>
          </Defs>

          {/* Antenna */}
          <Animated.View style={antennaStyle}>
            <Circle cx="50" cy="10" r="5" fill={ROBOT_COLORS.antenna} />
            <Rect x="48" y="10" width="4" height="15" fill={ROBOT_COLORS.bodyDark} />
          </Animated.View>

          {/* Head */}
          <Rect
            x="20"
            y="25"
            width="60"
            height="50"
            rx="8"
            fill="url(#bodyGradient)"
            stroke={ROBOT_COLORS.bodyDark}
            strokeWidth="2"
          />

          {/* Screen with glow effect */}
          <Animated.View style={screenGlowStyle}>
            <Rect
              x="25"
              y="30"
              width="50"
              height="35"
              rx="5"
              fill="url(#screenGradient)"
              opacity="0.3"
            />
          </Animated.View>
          <Rect
            x="27"
            y="32"
            width="46"
            height="31"
            rx="4"
            fill={ROBOT_COLORS.screen}
          />

          {/* Eyes with emotion-based animation */}
          <Animated.View style={eyesStyle}>
            {/* Left eye */}
            <Circle cx="38" cy="48" r="6" fill={ROBOT_COLORS.eyes} opacity="0.9" />
            <Circle cx="38" cy="48" r="4" fill={ROBOT_COLORS.eyesGlow} />

            {/* Right eye */}
            <Circle cx="62" cy="48" r="6" fill={ROBOT_COLORS.eyes} opacity="0.9" />
            <Circle cx="62" cy="48" r="4" fill={ROBOT_COLORS.eyesGlow} />
          </Animated.View>

          {/* Mouth - changes with emotion */}
          <Path
            d={currentEmotion.mouthPath}
            stroke={ROBOT_COLORS.accent}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />

          {/* Body */}
          <Rect
            x="30"
            y="75"
            width="40"
            height="35"
            rx="6"
            fill="url(#bodyGradient)"
            stroke={ROBOT_COLORS.bodyDark}
            strokeWidth="2"
          />

          {/* Chest panel */}
          <Rect
            x="40"
            y="82"
            width="20"
            height="20"
            rx="3"
            fill={ROBOT_COLORS.screen}
          />
          <Circle cx="50" cy="92" r="3" fill={ROBOT_COLORS.accent} />

          {/* Arms */}
          <Rect x="15" y="80" width="12" height="25" rx="6" fill={ROBOT_COLORS.body} />
          <Circle cx="21" cy="107" r="5" fill={ROBOT_COLORS.bodyDark} />

          <Rect x="73" y="80" width="12" height="25" rx="6" fill={ROBOT_COLORS.body} />
          <Circle cx="79" cy="107" r="5" fill={ROBOT_COLORS.bodyDark} />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    marginBottom: spacing[4],
  },

  // Speech bubble with enhanced styling
  speechBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: spacing[5],
    paddingBottom: spacing[4],
    minWidth: 280,
    maxWidth: '90%',
    ...shadows.lg,
    marginBottom: spacing[3],
    borderWidth: 3,
    borderColor: '#E0E8F8',
  },
  bubbleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  bubbleName: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bubbleText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2C3E50',
    lineHeight: 26,
    fontFamily: 'System',
  },
  bubbleArrow: {
    position: 'absolute',
    bottom: -15,
    left: 40,
    width: 0,
    height: 0,
    borderLeftWidth: 18,
    borderRightWidth: 18,
    borderTopWidth: 18,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },

  // Robot container
  robot: {
    width: 100,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 30,
  },
});
