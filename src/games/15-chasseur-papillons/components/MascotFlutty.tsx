/**
 * MascotFlutty component - Flutty le Papillon
 * Animated butterfly mascot with speech bubble and emotions
 * Shows different expressions based on game state
 * Uses the common MascotBubble component for consistent UI
 */

import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import Svg, {
  Path,
  Circle,
  Ellipse,
  G,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  RadialGradient,
} from 'react-native-svg';

import { spacing } from '../../../theme';
import { MascotBubble } from '../../../components/common';
import type { FluttyEmotion } from '../types';

interface MascotFluttyProps {
  message: string;
  emotion?: FluttyEmotion;
  visible?: boolean;
}

// Butterfly color palette
const BUTTERFLY_COLORS = {
  // Wings gradient
  wingPrimary: '#9B59B6',      // Violet
  wingSecondary: '#E74C8A',    // Rose
  wingAccent: '#F39C12',       // Orange
  wingHighlight: '#FFE4B5',    // Beige clair
  // Body
  body: '#4A3728',             // Marron foncé
  bodyLight: '#6B4423',        // Marron clair
  // Antennae
  antenna: '#2C1810',          // Marron très foncé
  antennaEnd: '#F39C12',       // Orange (bout)
  // Eyes
  eyes: '#2C3E50',             // Bleu foncé
  eyesHighlight: '#FFFFFF',    // Blanc
  // Patterns
  patternDot: '#FFFFFF',
  patternRing: 'rgba(255, 255, 255, 0.6)',
};

// Emotion configurations
const EMOTIONS: Record<FluttyEmotion, {
  eyeScale: number;
  mouthCurve: number;
  wingSpeed: number;
}> = {
  neutral: {
    eyeScale: 1,
    mouthCurve: 0,
    wingSpeed: 1,
  },
  happy: {
    eyeScale: 1.2,
    mouthCurve: 5,
    wingSpeed: 1.2,
  },
  excited: {
    eyeScale: 1.4,
    mouthCurve: 8,
    wingSpeed: 1.8,
  },
  encouraging: {
    eyeScale: 1.1,
    mouthCurve: 3,
    wingSpeed: 1,
  },
  thinking: {
    eyeScale: 0.9,
    mouthCurve: -2,
    wingSpeed: 0.6,
  },
  celebrating: {
    eyeScale: 1.5,
    mouthCurve: 10,
    wingSpeed: 2,
  },
  sad: {
    eyeScale: 0.8,
    mouthCurve: -5,
    wingSpeed: 0.4,
  },
};

export function MascotFlutty({
  message,
  emotion = 'neutral',
  visible = true,
}: MascotFluttyProps) {
  // Animation values
  const bodyY = useSharedValue(0);
  const leftWingRotate = useSharedValue(0);
  const rightWingRotate = useSharedValue(0);
  const antennaRotate = useSharedValue(0);
  const eyesScale = useSharedValue(1);

  const emotionConfig = EMOTIONS[emotion];

  // Idle floating animation
  useEffect(() => {
    bodyY.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  // Wing flapping animation - speed based on emotion
  useEffect(() => {
    const duration = 400 / emotionConfig.wingSpeed;

    leftWingRotate.value = withRepeat(
      withSequence(
        withTiming(-25, { duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(15, { duration, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    rightWingRotate.value = withRepeat(
      withSequence(
        withTiming(25, { duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(-15, { duration, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [emotionConfig.wingSpeed]);

  // Antennae wobble
  useEffect(() => {
    antennaRotate.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(8, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  // Eyes animation based on emotion
  useEffect(() => {
    eyesScale.value = withSpring(emotionConfig.eyeScale, {
      damping: 10,
      stiffness: 150,
    });
  }, [emotion, emotionConfig.eyeScale]);

  // Animated styles
  const bodyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bodyY.value }],
  }));

  const leftWingStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: 50 },
      { rotate: `${leftWingRotate.value}deg` },
      { translateX: -50 },
    ],
  }));

  const rightWingStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -50 },
      { rotate: `${rightWingRotate.value}deg` },
      { translateX: 50 },
    ],
  }));

  const antennaStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${antennaRotate.value}deg` }],
  }));

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {/* Butterfly SVG */}
      <Animated.View style={[styles.butterfly, bodyStyle]}>
        <Svg width="130" height="110" viewBox="0 0 130 110">
          <Defs>
            {/* Gradients pour les ailes */}
            <SvgLinearGradient id="leftWingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={BUTTERFLY_COLORS.wingPrimary} />
              <Stop offset="50%" stopColor={BUTTERFLY_COLORS.wingSecondary} />
              <Stop offset="100%" stopColor={BUTTERFLY_COLORS.wingAccent} />
            </SvgLinearGradient>
            <SvgLinearGradient id="rightWingGradient" x1="100%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={BUTTERFLY_COLORS.wingPrimary} />
              <Stop offset="50%" stopColor={BUTTERFLY_COLORS.wingSecondary} />
              <Stop offset="100%" stopColor={BUTTERFLY_COLORS.wingAccent} />
            </SvgLinearGradient>
            <RadialGradient id="bodyGradient" cx="50%" cy="30%" r="70%">
              <Stop offset="0%" stopColor={BUTTERFLY_COLORS.bodyLight} />
              <Stop offset="100%" stopColor={BUTTERFLY_COLORS.body} />
            </RadialGradient>
          </Defs>

          {/* Left Wing (upper + lower) */}
          <Animated.View style={leftWingStyle}>
            <G>
              {/* Upper left wing */}
              <Path
                d="M 65 50
                   Q 35 20, 15 35
                   Q 5 45, 15 55
                   Q 35 65, 65 50"
                fill="url(#leftWingGradient)"
                stroke={BUTTERFLY_COLORS.wingPrimary}
                strokeWidth="1.5"
              />
              {/* Lower left wing */}
              <Path
                d="M 65 55
                   Q 40 70, 25 85
                   Q 20 92, 30 92
                   Q 50 85, 65 60"
                fill="url(#leftWingGradient)"
                stroke={BUTTERFLY_COLORS.wingPrimary}
                strokeWidth="1.5"
              />
              {/* Wing patterns */}
              <Circle cx="30" cy="42" r="6" fill={BUTTERFLY_COLORS.patternDot} opacity="0.8" />
              <Circle cx="30" cy="42" r="4" fill={BUTTERFLY_COLORS.wingSecondary} opacity="0.6" />
              <Circle cx="40" cy="78" r="4" fill={BUTTERFLY_COLORS.patternDot} opacity="0.7" />
            </G>
          </Animated.View>

          {/* Right Wing (upper + lower) */}
          <Animated.View style={rightWingStyle}>
            <G>
              {/* Upper right wing */}
              <Path
                d="M 65 50
                   Q 95 20, 115 35
                   Q 125 45, 115 55
                   Q 95 65, 65 50"
                fill="url(#rightWingGradient)"
                stroke={BUTTERFLY_COLORS.wingPrimary}
                strokeWidth="1.5"
              />
              {/* Lower right wing */}
              <Path
                d="M 65 55
                   Q 90 70, 105 85
                   Q 110 92, 100 92
                   Q 80 85, 65 60"
                fill="url(#rightWingGradient)"
                stroke={BUTTERFLY_COLORS.wingPrimary}
                strokeWidth="1.5"
              />
              {/* Wing patterns */}
              <Circle cx="100" cy="42" r="6" fill={BUTTERFLY_COLORS.patternDot} opacity="0.8" />
              <Circle cx="100" cy="42" r="4" fill={BUTTERFLY_COLORS.wingSecondary} opacity="0.6" />
              <Circle cx="90" cy="78" r="4" fill={BUTTERFLY_COLORS.patternDot} opacity="0.7" />
            </G>
          </Animated.View>

          {/* Body */}
          <Ellipse
            cx="65"
            cy="55"
            rx="8"
            ry="20"
            fill="url(#bodyGradient)"
          />
          {/* Body segments */}
          <Path
            d="M 57 48 Q 65 46, 73 48"
            stroke={BUTTERFLY_COLORS.body}
            strokeWidth="1"
            fill="none"
          />
          <Path
            d="M 58 55 Q 65 53, 72 55"
            stroke={BUTTERFLY_COLORS.body}
            strokeWidth="1"
            fill="none"
          />
          <Path
            d="M 58 62 Q 65 60, 72 62"
            stroke={BUTTERFLY_COLORS.body}
            strokeWidth="1"
            fill="none"
          />

          {/* Head */}
          <Circle cx="65" cy="32" r="10" fill="url(#bodyGradient)" />

          {/* Antennae */}
          <Animated.View style={antennaStyle}>
            <G>
              {/* Left antenna */}
              <Path
                d="M 60 25 Q 50 10, 45 8"
                stroke={BUTTERFLY_COLORS.antenna}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <Circle cx="45" cy="8" r="3" fill={BUTTERFLY_COLORS.antennaEnd} />

              {/* Right antenna */}
              <Path
                d="M 70 25 Q 80 10, 85 8"
                stroke={BUTTERFLY_COLORS.antenna}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <Circle cx="85" cy="8" r="3" fill={BUTTERFLY_COLORS.antennaEnd} />
            </G>
          </Animated.View>

          {/* Eyes */}
          <G transform={`scale(${emotionConfig.eyeScale}) translate(${65 * (1 - emotionConfig.eyeScale) / emotionConfig.eyeScale}, ${32 * (1 - emotionConfig.eyeScale) / emotionConfig.eyeScale})`}>
            {/* Left eye */}
            <Circle cx="60" cy="30" r="4" fill={BUTTERFLY_COLORS.eyes} />
            <Circle cx="59" cy="29" r="1.5" fill={BUTTERFLY_COLORS.eyesHighlight} />

            {/* Right eye */}
            <Circle cx="70" cy="30" r="4" fill={BUTTERFLY_COLORS.eyes} />
            <Circle cx="69" cy="29" r="1.5" fill={BUTTERFLY_COLORS.eyesHighlight} />
          </G>

          {/* Mouth - changes with emotion */}
          <Path
            d={`M 62 38 Q 65 ${38 + emotionConfig.mouthCurve}, 68 38`}
            stroke={BUTTERFLY_COLORS.body}
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      </Animated.View>

      {/* Speech bubble */}
      {visible && (
        <MascotBubble
          message={message}
          tailPosition="left"
          showDecorations={true}
          maxWidth={500}
          style={styles.bubble}
          disableEnterAnimation={true}
          typing={true}
          typingSpeed={30}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
  },

  butterfly: {
    width: 130,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  bubble: {
    flex: 1,
    marginLeft: spacing[3],
  },
});

export default MascotFlutty;
