/**
 * TrafficMascot component - Caro le Castor
 * Animated beaver mascot with speech bubble and emotions
 * Shows different expressions based on game state
 * Uses the common MascotBubble component for consistent UI
 */

import { useEffect, useRef } from 'react';
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
import { useAppSettings } from '../../../store/useStore';
import Svg, {
  Rect,
  Circle,
  Ellipse,
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop
} from 'react-native-svg';

import { spacing } from '../../../theme';
import { MascotBubble } from '../../../components/common';

type EmotionType = 'neutral' | 'happy' | 'thinking' | 'excited' | 'encouraging';

interface TrafficMascotProps {
  message: string;
  emotion?: EmotionType;
  visible?: boolean;
  canPlayAudio?: boolean;
}

// Beaver color palette
const BEAVER_COLORS = {
  body: '#8B5A2B',        // Brown body
  bodyDark: '#6B4423',    // Darker brown
  bodyLight: '#A67B5B',   // Lighter brown
  belly: '#DEB887',       // Cream belly
  nose: '#2C1810',        // Dark nose
  eyes: '#1A1A1A',        // Dark eyes
  eyeWhite: '#FFFFFF',
  teeth: '#FFFEF0',       // Off-white teeth
  tail: '#5D3A1A',        // Dark brown tail
  cheeks: '#E8A87C',      // Rosy cheeks
  hardHat: '#FFD700',     // Yellow construction hat
  hardHatBand: '#FF8C00', // Orange band
};

// Emotion configurations
const EMOTIONS = {
  neutral: {
    mouthPath: 'M 35 75 L 45 75',
    eyeScale: 1,
    cheekOpacity: 0.5,
  },
  happy: {
    mouthPath: 'M 32 72 Q 40 80 48 72',
    eyeScale: 1.1,
    cheekOpacity: 0.8,
  },
  thinking: {
    mouthPath: 'M 35 74 Q 38 76 42 74',
    eyeScale: 0.9,
    cheekOpacity: 0.4,
  },
  excited: {
    mouthPath: 'M 30 70 Q 40 85 50 70',
    eyeScale: 1.3,
    cheekOpacity: 1,
  },
  encouraging: {
    mouthPath: 'M 33 73 Q 40 78 47 73',
    eyeScale: 1.05,
    cheekOpacity: 0.7,
  },
};

export function TrafficMascot({
  message,
  emotion = 'neutral',
  visible = true,
  canPlayAudio = false,
}: TrafficMascotProps) {
  const { soundEnabled } = useAppSettings();

  // Ref pour tracker le message précédent
  const currentMessageRef = useRef<string>('');

  // Animation values
  const bodyY = useSharedValue(0);
  const tailRotate = useSharedValue(0);
  const eyesPulse = useSharedValue(1);
  const hatBounce = useSharedValue(0);

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

  // Tail wagging
  useEffect(() => {
    tailRotate.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 400, easing: Easing.inOut(Easing.ease) }),
        withTiming(10, { duration: 400, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  // Hat bounce for excited emotion
  useEffect(() => {
    if (emotion === 'excited') {
      hatBounce.value = withRepeat(
        withSequence(
          withTiming(-3, { duration: 200 }),
          withTiming(0, { duration: 200 })
        ),
        -1,
        true
      );
    } else {
      hatBounce.value = withTiming(0, { duration: 200 });
    }
  }, [emotion]);

  // Eyes animation based on emotion
  useEffect(() => {
    const targetScale = EMOTIONS[emotion].eyeScale;
    eyesPulse.value = withSpring(targetScale, { damping: 10, stiffness: 150 });

    if (emotion === 'excited') {
      eyesPulse.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 300 }),
          withTiming(1.1, { duration: 300 })
        ),
        -1,
        true
      );
    }
  }, [emotion]);

  // Animated styles
  const bodyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bodyY.value }],
  }));

  const tailStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${tailRotate.value}deg` }],
  }));

  const hatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: hatBounce.value }],
  }));

  if (!visible) return null;

  const currentEmotion = EMOTIONS[emotion];

  return (
    <View style={styles.container}>
      {/* Beaver SVG - positioned left */}
      <Animated.View style={[styles.mascot, bodyStyle]}>
        <Svg width="100" height="120" viewBox="0 0 80 100">
          <Defs>
            <SvgLinearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={BEAVER_COLORS.bodyLight} />
              <Stop offset="100%" stopColor={BEAVER_COLORS.body} />
            </SvgLinearGradient>
            <SvgLinearGradient id="hatGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FFEC8B" />
              <Stop offset="100%" stopColor={BEAVER_COLORS.hardHat} />
            </SvgLinearGradient>
          </Defs>

          {/* Tail */}
          <Animated.View style={[{ position: 'absolute', left: 55, top: 65 }, tailStyle]}>
            <Ellipse
              cx="15"
              cy="15"
              rx="12"
              ry="8"
              fill={BEAVER_COLORS.tail}
              transform="rotate(-20)"
            />
            {/* Tail texture lines */}
            <Path
              d="M 8 12 L 22 12 M 6 15 L 24 15 M 8 18 L 22 18"
              stroke={BEAVER_COLORS.bodyDark}
              strokeWidth="1"
              opacity="0.5"
            />
          </Animated.View>

          {/* Body */}
          <Ellipse
            cx="40"
            cy="70"
            rx="25"
            ry="22"
            fill="url(#bodyGradient)"
          />

          {/* Belly */}
          <Ellipse
            cx="40"
            cy="72"
            rx="16"
            ry="14"
            fill={BEAVER_COLORS.belly}
          />

          {/* Head */}
          <Circle
            cx="40"
            cy="40"
            r="28"
            fill="url(#bodyGradient)"
          />

          {/* Ears */}
          <Circle cx="18" cy="22" r="8" fill={BEAVER_COLORS.body} />
          <Circle cx="18" cy="22" r="5" fill={BEAVER_COLORS.cheeks} opacity="0.6" />
          <Circle cx="62" cy="22" r="8" fill={BEAVER_COLORS.body} />
          <Circle cx="62" cy="22" r="5" fill={BEAVER_COLORS.cheeks} opacity="0.6" />

          {/* Hard Hat */}
          <Animated.View style={hatStyle}>
            {/* Hat dome */}
            <Path
              d="M 20 25 Q 20 8 40 8 Q 60 8 60 25 L 20 25"
              fill="url(#hatGradient)"
            />
            {/* Hat brim */}
            <Rect
              x="15"
              y="23"
              width="50"
              height="6"
              rx="2"
              fill={BEAVER_COLORS.hardHat}
            />
            {/* Hat band */}
            <Rect
              x="22"
              y="18"
              width="36"
              height="5"
              rx="1"
              fill={BEAVER_COLORS.hardHatBand}
            />
          </Animated.View>

          {/* Cheeks */}
          <Circle
            cx="22"
            cy="48"
            r="8"
            fill={BEAVER_COLORS.cheeks}
            opacity={currentEmotion.cheekOpacity}
          />
          <Circle
            cx="58"
            cy="48"
            r="8"
            fill={BEAVER_COLORS.cheeks}
            opacity={currentEmotion.cheekOpacity}
          />

          {/* Eyes */}
          {/* Left eye */}
          <Circle cx="32" cy="40" r="7" fill={BEAVER_COLORS.eyeWhite} />
          <Circle cx="33" cy="40" r="4" fill={BEAVER_COLORS.eyes} />
          <Circle cx="34" cy="38" r="1.5" fill={BEAVER_COLORS.eyeWhite} />

          {/* Right eye */}
          <Circle cx="48" cy="40" r="7" fill={BEAVER_COLORS.eyeWhite} />
          <Circle cx="49" cy="40" r="4" fill={BEAVER_COLORS.eyes} />
          <Circle cx="50" cy="38" r="1.5" fill={BEAVER_COLORS.eyeWhite} />

          {/* Nose */}
          <Ellipse
            cx="40"
            cy="52"
            rx="6"
            ry="4"
            fill={BEAVER_COLORS.nose}
          />
          {/* Nose highlight */}
          <Ellipse
            cx="38"
            cy="51"
            rx="2"
            ry="1"
            fill="#4A3228"
          />

          {/* Mouth */}
          <Path
            d={currentEmotion.mouthPath}
            stroke={BEAVER_COLORS.nose}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Beaver teeth */}
          <Rect
            x="36"
            y="78"
            width="4"
            height="8"
            rx="1"
            fill={BEAVER_COLORS.teeth}
            stroke={BEAVER_COLORS.bodyDark}
            strokeWidth="0.5"
          />
          <Rect
            x="41"
            y="78"
            width="4"
            height="8"
            rx="1"
            fill={BEAVER_COLORS.teeth}
            stroke={BEAVER_COLORS.bodyDark}
            strokeWidth="0.5"
          />

          {/* Arms/Paws */}
          <Ellipse cx="18" cy="65" rx="6" ry="8" fill={BEAVER_COLORS.body} />
          <Ellipse cx="62" cy="65" rx="6" ry="8" fill={BEAVER_COLORS.body} />

          {/* Feet */}
          <Ellipse cx="30" cy="92" rx="8" ry="5" fill={BEAVER_COLORS.tail} />
          <Ellipse cx="50" cy="92" rx="8" ry="5" fill={BEAVER_COLORS.tail} />
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
          typingSpeed={35}
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

  mascot: {
    width: 100,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  bubble: {
    flex: 1,
    marginLeft: spacing[3],
  },
});

export default TrafficMascot;
