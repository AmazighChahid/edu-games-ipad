/**
 * FelixMascot Component
 * Animated fox mascot for Sudoku game
 *
 * Features:
 * - 5 emotions: neutral, happy, thinking, excited, encouraging
 * - Idle animations: bobbing
 * - Integration with MascotBubble for speech
 */

import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
  cancelAnimation,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import Svg, {
  Path,
  Circle,
  Ellipse,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

import { MascotBubble } from '@/components/common';
import { spacing } from '@/theme';

// ============================================
// TYPES
// ============================================

export type FelixEmotion = 'neutral' | 'happy' | 'thinking' | 'excited' | 'encouraging';

interface FelixMascotProps {
  message: string;
  emotion?: FelixEmotion;
  visible?: boolean;
  onMessageComplete?: () => void;
  size?: 'small' | 'medium' | 'large';
}

// ============================================
// COLORS
// ============================================

const FELIX_COLORS = {
  body: '#E67E22',
  bodyDark: '#D35400',
  bodyLight: '#F39C12',
  face: '#FDFEFE',
  faceShadow: '#F5F5F5',
  nose: '#2C3E50',
  eyeWhite: '#FFFFFF',
  eyePupil: '#2C3E50',
  earInner: '#FADBD8',
  cheeks: '#FADBD8',
  tailTip: '#FDFEFE',
  mouth: '#2C3E50',
};

// ============================================
// EMOTION CONFIGS
// ============================================

const EMOTION_CONFIG = {
  neutral: {
    mouthPath: 'M 42 72 Q 50 74 58 72',
    eyeScaleY: 1,
  },
  happy: {
    mouthPath: 'M 40 70 Q 50 80 60 70',
    eyeScaleY: 0.5,
  },
  thinking: {
    mouthPath: 'M 45 72 Q 52 70 55 72',
    eyeScaleY: 1,
  },
  excited: {
    mouthPath: 'M 38 68 Q 50 85 62 68',
    eyeScaleY: 1.1,
  },
  encouraging: {
    mouthPath: 'M 40 70 Q 50 78 60 70',
    eyeScaleY: 1,
  },
};

const SIZE_CONFIG = {
  small: 0.7,
  medium: 1,
  large: 1.3,
};

const ANIMATION = {
  bobbing: {
    amplitude: 4,
    duration: 1200,
  },
};

// ============================================
// COMPONENT
// ============================================

export function FelixMascot({
  message,
  emotion = 'neutral',
  visible = true,
  onMessageComplete,
  size = 'medium',
}: FelixMascotProps) {
  const bobY = useSharedValue(0);
  const bodyScale = useSharedValue(1);
  const scale = SIZE_CONFIG[size];

  // Bobbing animation
  useEffect(() => {
    bobY.value = withRepeat(
      withSequence(
        withTiming(-ANIMATION.bobbing.amplitude, {
          duration: ANIMATION.bobbing.duration / 2,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration: ANIMATION.bobbing.duration / 2,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );

    return () => cancelAnimation(bobY);
  }, [bobY]);

  // Emotion-based animations
  useEffect(() => {
    switch (emotion) {
      case 'excited':
        bodyScale.value = withRepeat(
          withSequence(
            withSpring(1.05, { damping: 6, stiffness: 200 }),
            withSpring(1, { damping: 10, stiffness: 150 })
          ),
          -1,
          false
        );
        break;
      case 'happy':
        bodyScale.value = withSequence(
          withTiming(1.05, { duration: 300 }),
          withTiming(1, { duration: 300 })
        );
        break;
      default:
        bodyScale.value = withTiming(1, { duration: 200 });
    }
  }, [emotion, bodyScale]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bobY.value },
      { scale: bodyScale.value * scale },
    ],
  }));

  if (!visible) return null;

  const emotionConfig = EMOTION_CONFIG[emotion];

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={styles.container}
    >
      {/* Felix SVG */}
      <Animated.View style={[styles.foxContainer, containerStyle]}>
        <Svg width={100} height={120} viewBox="0 0 100 120">
          <Defs>
            <LinearGradient id="felixBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={FELIX_COLORS.bodyLight} />
              <Stop offset="100%" stopColor={FELIX_COLORS.body} />
            </LinearGradient>
            <LinearGradient id="felixFaceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={FELIX_COLORS.face} />
              <Stop offset="100%" stopColor={FELIX_COLORS.faceShadow} />
            </LinearGradient>
          </Defs>

          {/* Tail */}
          <Path
            d="M 85 85 Q 100 70 95 55 Q 90 45 80 50 Q 70 55 75 70 Q 78 80 85 85"
            fill={FELIX_COLORS.body}
          />
          <Path
            d="M 95 55 Q 90 45 82 48 Q 88 50 92 58 Q 95 52 95 55"
            fill={FELIX_COLORS.tailTip}
          />

          {/* Body */}
          <Ellipse
            cx="50"
            cy="95"
            rx="28"
            ry="22"
            fill="url(#felixBodyGradient)"
          />

          {/* Head */}
          <Circle
            cx="50"
            cy="52"
            r="32"
            fill="url(#felixBodyGradient)"
          />

          {/* Left Ear */}
          <Path
            d="M 25 35 L 15 8 Q 25 2 35 8 Z"
            fill={FELIX_COLORS.body}
          />
          <Path
            d="M 26 30 L 18 12 Q 26 8 32 12 Z"
            fill={FELIX_COLORS.earInner}
          />

          {/* Right Ear */}
          <Path
            d="M 75 35 L 85 8 Q 75 2 65 8 Z"
            fill={FELIX_COLORS.body}
          />
          <Path
            d="M 74 30 L 82 12 Q 74 8 68 12 Z"
            fill={FELIX_COLORS.earInner}
          />

          {/* Face (white area) */}
          <Path
            d="M 25 48 Q 25 78 50 82 Q 75 78 75 48 Q 75 38 50 42 Q 25 38 25 48"
            fill="url(#felixFaceGradient)"
          />

          {/* Left Eye */}
          <Ellipse
            cx="38"
            cy="50"
            rx="6"
            ry={8 * emotionConfig.eyeScaleY}
            fill={FELIX_COLORS.eyeWhite}
          />
          <Circle
            cx="38"
            cy="50"
            r={4 * Math.min(emotionConfig.eyeScaleY, 1)}
            fill={FELIX_COLORS.eyePupil}
          />
          <Circle cx="40" cy="48" r={2} fill="#FFFFFF" />

          {/* Right Eye */}
          <Ellipse
            cx="62"
            cy="50"
            rx="6"
            ry={8 * emotionConfig.eyeScaleY}
            fill={FELIX_COLORS.eyeWhite}
          />
          <Circle
            cx="62"
            cy="50"
            r={4 * Math.min(emotionConfig.eyeScaleY, 1)}
            fill={FELIX_COLORS.eyePupil}
          />
          <Circle cx="64" cy="48" r={2} fill="#FFFFFF" />

          {/* Nose */}
          <Ellipse
            cx="50"
            cy="64"
            rx="5"
            ry="4"
            fill={FELIX_COLORS.nose}
          />

          {/* Mouth */}
          <Path
            d={emotionConfig.mouthPath}
            stroke={FELIX_COLORS.mouth}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cheeks */}
          <Ellipse cx="32" cy="62" rx="7" ry="5" fill={FELIX_COLORS.cheeks} opacity={0.5} />
          <Ellipse cx="68" cy="62" rx="7" ry="5" fill={FELIX_COLORS.cheeks} opacity={0.5} />

          {/* Whiskers */}
          <Path d="M 24 58 L 8 54" stroke={FELIX_COLORS.nose} strokeWidth="1.5" strokeLinecap="round" opacity={0.4} />
          <Path d="M 24 62 L 6 62" stroke={FELIX_COLORS.nose} strokeWidth="1.5" strokeLinecap="round" opacity={0.4} />
          <Path d="M 24 66 L 8 70" stroke={FELIX_COLORS.nose} strokeWidth="1.5" strokeLinecap="round" opacity={0.4} />
          <Path d="M 76 58 L 92 54" stroke={FELIX_COLORS.nose} strokeWidth="1.5" strokeLinecap="round" opacity={0.4} />
          <Path d="M 76 62 L 94 62" stroke={FELIX_COLORS.nose} strokeWidth="1.5" strokeLinecap="round" opacity={0.4} />
          <Path d="M 76 66 L 92 70" stroke={FELIX_COLORS.nose} strokeWidth="1.5" strokeLinecap="round" opacity={0.4} />
        </Svg>
      </Animated.View>

      {/* Speech Bubble */}
      <View style={styles.bubbleContainer}>
        <MascotBubble
          message={message}
          typing={true}
          typingSpeed={30}
          onTypingComplete={onMessageComplete}
          tailPosition="left"
          maxWidth={280}
        />
      </View>
    </Animated.View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    gap: spacing[2],
  },
  foxContainer: {
    width: 100,
    height: 120,
  },
  bubbleContainer: {
    flex: 1,
    paddingTop: spacing[2],
  },
});

export default FelixMascot;
