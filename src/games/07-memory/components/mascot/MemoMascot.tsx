/**
 * MemoMascot component - Mémo l'Éléphant
 * Animated elephant mascot with speech bubble and emotions
 * Shows different facial expressions based on game state
 * Uses the common MascotBubble component for consistent UI
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import Svg, {
  Ellipse,
  Circle,
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  G,
} from 'react-native-svg';

import { spacing } from '../../../../theme';
import { MascotBubble } from '../../../../components/common';

// ============================================================================
// TYPES
// ============================================================================

export type MemoEmotionType = 'neutral' | 'happy' | 'thinking' | 'excited' | 'encouraging';

interface MemoMascotProps {
  message: string;
  emotion?: MemoEmotionType;
  visible?: boolean;
  onMessageComplete?: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

// Elephant color palette
const ELEPHANT_COLORS = {
  body: '#8FAABE',
  bodyDark: '#6B8A9E',
  bodyLight: '#A8C4D4',
  ear: '#C4A4B4',
  earInner: '#E8C8D8',
  eyes: '#2D3748',
  eyeHighlight: '#FFFFFF',
  trunk: '#9BB4C4',
  tusk: '#F5F0E8',
  cheek: '#FFCCD5',
};

// Emotion configurations
const EMOTIONS: Record<MemoEmotionType, {
  eyeScale: number;
  eyeOffsetY: number;
  mouthType: 'neutral' | 'smile' | 'big-smile' | 'thinking';
  earWiggle: number;
}> = {
  neutral: {
    eyeScale: 1,
    eyeOffsetY: 0,
    mouthType: 'neutral',
    earWiggle: 5,
  },
  happy: {
    eyeScale: 1.1,
    eyeOffsetY: -1,
    mouthType: 'smile',
    earWiggle: 10,
  },
  thinking: {
    eyeScale: 0.9,
    eyeOffsetY: 2,
    mouthType: 'thinking',
    earWiggle: 3,
  },
  excited: {
    eyeScale: 1.3,
    eyeOffsetY: -2,
    mouthType: 'big-smile',
    earWiggle: 15,
  },
  encouraging: {
    eyeScale: 1.15,
    eyeOffsetY: 0,
    mouthType: 'smile',
    earWiggle: 8,
  },
};

// Mouth paths
const MOUTH_PATHS: Record<string, string> = {
  'neutral': 'M 42 78 Q 50 80 58 78',
  'smile': 'M 40 75 Q 50 85 60 75',
  'big-smile': 'M 38 73 Q 50 88 62 73',
  'thinking': 'M 45 78 Q 50 76 55 78',
};

// ============================================================================
// COMPONENT
// ============================================================================

export function MemoMascot({
  message,
  emotion = 'neutral',
  visible = true,
  onMessageComplete,
}: MemoMascotProps) {
  // Animation values
  const bodyY = useSharedValue(0);
  const earRotateLeft = useSharedValue(0);
  const earRotateRight = useSharedValue(0);
  const trunkSwing = useSharedValue(0);
  const eyesBlink = useSharedValue(1);

  const currentEmotion = EMOTIONS[emotion];

  // Idle floating animation
  useEffect(() => {
    bodyY.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [bodyY]);

  // Ear wiggling animation
  useEffect(() => {
    const wiggle = currentEmotion.earWiggle;

    earRotateLeft.value = withRepeat(
      withSequence(
        withTiming(-wiggle, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(wiggle, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    earRotateRight.value = withRepeat(
      withSequence(
        withTiming(wiggle, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(-wiggle, { duration: 900, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [earRotateLeft, earRotateRight, currentEmotion.earWiggle]);

  // Trunk swinging animation
  useEffect(() => {
    trunkSwing.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(8, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [trunkSwing]);

  // Blinking animation
  useEffect(() => {
    const blink = () => {
      eyesBlink.value = withSequence(
        withTiming(0.1, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
    };

    // Blink every 3-5 seconds
    const interval = setInterval(blink, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [eyesBlink]);

  // Eye scale animation based on emotion
  useEffect(() => {
    eyesBlink.value = withSpring(currentEmotion.eyeScale, { damping: 10, stiffness: 150 });
  }, [emotion, eyesBlink, currentEmotion.eyeScale]);

  // Animated styles
  const bodyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bodyY.value }],
  }));

  const leftEarStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${earRotateLeft.value}deg` }],
  }));

  const rightEarStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${earRotateRight.value}deg` }],
  }));

  const trunkStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${trunkSwing.value}deg` }],
  }));

  const eyesStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: eyesBlink.value }],
  }));

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {/* Elephant SVG */}
      <Animated.View style={[styles.mascot, bodyStyle]}>
        <Svg width="100" height="110" viewBox="0 0 100 110">
          <Defs>
            <SvgLinearGradient id="elephantBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={ELEPHANT_COLORS.bodyLight} />
              <Stop offset="100%" stopColor={ELEPHANT_COLORS.body} />
            </SvgLinearGradient>
            <SvgLinearGradient id="elephantEarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={ELEPHANT_COLORS.ear} />
              <Stop offset="100%" stopColor={ELEPHANT_COLORS.earInner} />
            </SvgLinearGradient>
          </Defs>

          {/* Left Ear */}
          <G transform="translate(10, 30)">
            <Animated.View style={leftEarStyle}>
              <Ellipse
                cx="8"
                cy="20"
                rx="15"
                ry="25"
                fill="url(#elephantEarGradient)"
              />
              <Ellipse
                cx="10"
                cy="20"
                rx="10"
                ry="18"
                fill={ELEPHANT_COLORS.earInner}
                opacity="0.6"
              />
            </Animated.View>
          </G>

          {/* Right Ear */}
          <G transform="translate(65, 30)">
            <Animated.View style={rightEarStyle}>
              <Ellipse
                cx="17"
                cy="20"
                rx="15"
                ry="25"
                fill="url(#elephantEarGradient)"
              />
              <Ellipse
                cx="15"
                cy="20"
                rx="10"
                ry="18"
                fill={ELEPHANT_COLORS.earInner}
                opacity="0.6"
              />
            </Animated.View>
          </G>

          {/* Head */}
          <Ellipse
            cx="50"
            cy="50"
            rx="35"
            ry="38"
            fill="url(#elephantBodyGradient)"
          />

          {/* Trunk */}
          <G transform="translate(50, 65)">
            <Animated.View style={trunkStyle}>
              <Path
                d="M 0 0 Q -5 15 0 30 Q 5 38 10 35 Q 12 30 8 25 Q 3 20 5 10 Q 6 5 0 0"
                fill={ELEPHANT_COLORS.trunk}
              />
              {/* Trunk ridges */}
              <Path
                d="M -2 10 Q 2 11 6 10"
                stroke={ELEPHANT_COLORS.bodyDark}
                strokeWidth="1"
                fill="none"
                opacity="0.4"
              />
              <Path
                d="M -1 18 Q 3 19 7 18"
                stroke={ELEPHANT_COLORS.bodyDark}
                strokeWidth="1"
                fill="none"
                opacity="0.4"
              />
            </Animated.View>
          </G>

          {/* Tusks */}
          <Path
            d="M 30 65 Q 25 75 28 82"
            stroke={ELEPHANT_COLORS.tusk}
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d="M 70 65 Q 75 75 72 82"
            stroke={ELEPHANT_COLORS.tusk}
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Eyes */}
          <G>
            <Animated.View style={eyesStyle}>
              {/* Left eye */}
              <Circle cx="38" cy={48 + currentEmotion.eyeOffsetY} r="7" fill="#FFFFFF" />
              <Circle cx="39" cy={47 + currentEmotion.eyeOffsetY} r="4" fill={ELEPHANT_COLORS.eyes} />
              <Circle cx="40" cy={45 + currentEmotion.eyeOffsetY} r="1.5" fill={ELEPHANT_COLORS.eyeHighlight} />

              {/* Right eye */}
              <Circle cx="62" cy={48 + currentEmotion.eyeOffsetY} r="7" fill="#FFFFFF" />
              <Circle cx="63" cy={47 + currentEmotion.eyeOffsetY} r="4" fill={ELEPHANT_COLORS.eyes} />
              <Circle cx="64" cy={45 + currentEmotion.eyeOffsetY} r="1.5" fill={ELEPHANT_COLORS.eyeHighlight} />
            </Animated.View>
          </G>

          {/* Cheeks */}
          <Circle cx="28" cy="58" r="6" fill={ELEPHANT_COLORS.cheek} opacity="0.5" />
          <Circle cx="72" cy="58" r="6" fill={ELEPHANT_COLORS.cheek} opacity="0.5" />

          {/* Mouth */}
          <Path
            d={MOUTH_PATHS[currentEmotion.mouthType]}
            stroke={ELEPHANT_COLORS.bodyDark}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Eyebrows for thinking emotion */}
          {emotion === 'thinking' && (
            <>
              <Path
                d="M 32 38 Q 38 36 44 38"
                stroke={ELEPHANT_COLORS.bodyDark}
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <Path
                d="M 56 38 Q 62 36 68 38"
                stroke={ELEPHANT_COLORS.bodyDark}
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </>
          )}
        </Svg>
      </Animated.View>

      {/* Speech bubble using common MascotBubble */}
      <MascotBubble
        message={message}
        tailPosition="left"
        showDecorations={true}
        maxWidth={500}
        style={styles.bubble}
        disableEnterAnimation={true}
        typing={true}
        typingSpeed={35}
        onTypingComplete={onMessageComplete}
      />
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
  },
  mascot: {
    width: 100,
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

export default MemoMascot;
