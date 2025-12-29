/**
 * AdaMascot Component - Ada la Fourmi
 *
 * Mascotte animée pour le jeu Logix Grid.
 * Ada est une fourmi détective qui aide les enfants à résoudre des énigmes logiques.
 * Utilise le composant commun MascotBubble pour les dialogues.
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
  Circle,
  Ellipse,
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  G,
} from 'react-native-svg';

import { spacing } from '../../../theme';
import { MascotBubble } from '../../../components/common';

// ============================================================================
// TYPES
// ============================================================================

export type AdaEmotionType = 'neutral' | 'happy' | 'thinking' | 'excited' | 'encouraging';

interface AdaMascotProps {
  /** Message à afficher */
  message: string;
  /** Émotion actuelle */
  emotion?: AdaEmotionType;
  /** Visible */
  visible?: boolean;
  /** Callback fin de message */
  onMessageComplete?: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

// Palette de couleurs Ada
const ADA_COLORS = {
  body: '#8B4513', // Marron foncé (corps fourmi)
  bodyLight: '#A0522D', // Marron clair
  bodyDark: '#5D3A1A', // Marron très foncé
  eyes: '#2C2C2C', // Noir pour les yeux
  eyeHighlight: '#FFFFFF', // Reflet blanc
  antennae: '#654321', // Marron antennes
  antennaeGlow: '#FFD700', // Bout doré (loupe détective)
  legs: '#5D3A1A', // Pattes
  accent: '#FFD700', // Accent doré
  magnifyingGlass: '#87CEEB', // Verre loupe
  magnifyingGlassFrame: '#C0C0C0', // Cadre loupe
};

// Configurations des émotions
const EMOTIONS = {
  neutral: {
    eyeScale: 1,
    mouthCurve: 0,
  },
  happy: {
    eyeScale: 1.1,
    mouthCurve: 5,
  },
  thinking: {
    eyeScale: 0.9,
    mouthCurve: -2,
  },
  excited: {
    eyeScale: 1.3,
    mouthCurve: 8,
  },
  encouraging: {
    eyeScale: 1.05,
    mouthCurve: 3,
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

export function AdaMascot({
  message,
  emotion = 'neutral',
  visible = true,
  onMessageComplete,
}: AdaMascotProps) {
  // Animation values
  const bodyY = useSharedValue(0);
  const antennaRotate = useSharedValue(0);
  const eyesPulse = useSharedValue(1);
  const legWiggle = useSharedValue(0);
  const magnifyingGlassRotate = useSharedValue(-15);

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
  }, [bodyY]);

  // Antennae bobbing
  useEffect(() => {
    antennaRotate.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(10, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [antennaRotate]);

  // Leg wiggle animation
  useEffect(() => {
    legWiggle.value = withRepeat(
      withSequence(
        withTiming(3, { duration: 400 }),
        withTiming(-3, { duration: 400 })
      ),
      -1,
      true
    );
  }, [legWiggle]);

  // Magnifying glass subtle movement
  useEffect(() => {
    magnifyingGlassRotate.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [magnifyingGlassRotate]);

  // Eyes animation based on emotion
  useEffect(() => {
    const targetScale = EMOTIONS[emotion].eyeScale;
    eyesPulse.value = withSpring(targetScale, { damping: 10, stiffness: 150 });

    // Special animation for excited emotion
    if (emotion === 'excited') {
      eyesPulse.value = withRepeat(
        withSequence(
          withTiming(1.4, { duration: 250 }),
          withTiming(1.2, { duration: 250 })
        ),
        -1,
        true
      );
    }
  }, [emotion, eyesPulse]);

  // Animated styles
  const bodyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bodyY.value }],
  }));

  const antennaStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${antennaRotate.value}deg` }],
  }));

  const magnifyingGlassStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${magnifyingGlassRotate.value}deg` }],
  }));

  if (!visible) return null;

  const currentEmotion = EMOTIONS[emotion];
  const mouthY = 72 + currentEmotion.mouthCurve;

  return (
    <View style={styles.container}>
      {/* Ada SVG - positioned left */}
      <Animated.View
        style={[styles.mascot, bodyStyle]}
        accessible={true}
        accessibilityRole="image"
        accessibilityLabel="Ada la fourmi détective, mascotte du jeu"
      >
        <Svg width="100" height="120" viewBox="0 0 100 120">
          <Defs>
            <SvgLinearGradient id="adaBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={ADA_COLORS.bodyLight} />
              <Stop offset="100%" stopColor={ADA_COLORS.body} />
            </SvgLinearGradient>
            <SvgLinearGradient id="adaGlassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={ADA_COLORS.magnifyingGlass} stopOpacity={0.6} />
              <Stop offset="100%" stopColor={ADA_COLORS.magnifyingGlass} stopOpacity={0.3} />
            </SvgLinearGradient>
          </Defs>

          {/* Antennae */}
          <Animated.View style={antennaStyle}>
            <G>
              {/* Left antenna */}
              <Path
                d="M 35 25 Q 30 10 25 5"
                stroke={ADA_COLORS.antennae}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <Circle cx="25" cy="5" r="4" fill={ADA_COLORS.antennaeGlow} />

              {/* Right antenna */}
              <Path
                d="M 65 25 Q 70 10 75 5"
                stroke={ADA_COLORS.antennae}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <Circle cx="75" cy="5" r="4" fill={ADA_COLORS.antennaeGlow} />
            </G>
          </Animated.View>

          {/* Head */}
          <Ellipse
            cx="50"
            cy="40"
            rx="25"
            ry="20"
            fill="url(#adaBodyGradient)"
            stroke={ADA_COLORS.bodyDark}
            strokeWidth="2"
          />

          {/* Eyes */}
          <G transform={`scale(${currentEmotion.eyeScale}) translate(${50 - 50 * currentEmotion.eyeScale}, ${40 - 40 * currentEmotion.eyeScale})`}>
            {/* Left eye */}
            <Circle cx="40" cy="38" r="6" fill={ADA_COLORS.eyes} />
            <Circle cx="42" cy="36" r="2" fill={ADA_COLORS.eyeHighlight} />

            {/* Right eye */}
            <Circle cx="60" cy="38" r="6" fill={ADA_COLORS.eyes} />
            <Circle cx="62" cy="36" r="2" fill={ADA_COLORS.eyeHighlight} />
          </G>

          {/* Mouth - curved based on emotion */}
          <Path
            d={`M 42 ${mouthY} Q 50 ${mouthY + currentEmotion.mouthCurve} 58 ${mouthY}`}
            stroke={ADA_COLORS.bodyDark}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Body segment 1 (thorax) */}
          <Ellipse
            cx="50"
            cy="70"
            rx="18"
            ry="15"
            fill="url(#adaBodyGradient)"
            stroke={ADA_COLORS.bodyDark}
            strokeWidth="2"
          />

          {/* Body segment 2 (abdomen) */}
          <Ellipse
            cx="50"
            cy="95"
            rx="22"
            ry="18"
            fill="url(#adaBodyGradient)"
            stroke={ADA_COLORS.bodyDark}
            strokeWidth="2"
          />

          {/* Legs (simplified, 3 pairs) */}
          {/* Left legs */}
          <Path
            d="M 35 65 L 20 75"
            stroke={ADA_COLORS.legs}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <Path
            d="M 33 75 L 15 85"
            stroke={ADA_COLORS.legs}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <Path
            d="M 32 88 L 12 100"
            stroke={ADA_COLORS.legs}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Right legs */}
          <Path
            d="M 65 65 L 80 75"
            stroke={ADA_COLORS.legs}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <Path
            d="M 67 75 L 85 85"
            stroke={ADA_COLORS.legs}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <Path
            d="M 68 88 L 88 100"
            stroke={ADA_COLORS.legs}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Magnifying glass (detective accessory) */}
          <Animated.View style={magnifyingGlassStyle}>
            <G>
              {/* Handle */}
              <Path
                d="M 78 55 L 90 70"
                stroke={ADA_COLORS.magnifyingGlassFrame}
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Glass frame */}
              <Circle
                cx="72"
                cy="48"
                r="12"
                fill="url(#adaGlassGradient)"
                stroke={ADA_COLORS.magnifyingGlassFrame}
                strokeWidth="3"
              />
              {/* Glass reflection */}
              <Path
                d="M 66 44 Q 68 42 72 43"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                opacity={0.6}
              />
            </G>
          </Animated.View>
        </Svg>
      </Animated.View>

      {/* Speech bubble - uses common MascotBubble */}
      <MascotBubble
        message={message}
        tailPosition="left"
        showDecorations={true}
        maxWidth={450}
        style={styles.bubble}
        disableEnterAnimation={true}
        typing={true}
        typingSpeed={30}
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

export default AdaMascot;
