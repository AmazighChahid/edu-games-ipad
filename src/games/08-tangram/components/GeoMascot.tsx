/**
 * GeoMascot Component - Géo le Renard
 *
 * Mascotte animée pour le jeu Tangram.
 * Géo est un renard astucieux qui aide les enfants à reconstituer des formes.
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
  Polygon,
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

export type GeoEmotionType = 'neutral' | 'happy' | 'thinking' | 'excited' | 'encouraging';

interface GeoMascotProps {
  /** Message à afficher */
  message: string;
  /** Émotion actuelle */
  emotion?: GeoEmotionType;
  /** Visible */
  visible?: boolean;
  /** Callback fin de message */
  onMessageComplete?: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

// Palette de couleurs Géo (renard)
const GEO_COLORS = {
  // Corps principal (orange renard)
  body: '#E67E22', // Orange vif
  bodyLight: '#F39C12', // Orange clair
  bodyDark: '#D35400', // Orange foncé
  // Ventre et museau (blanc crème)
  belly: '#FFF8E7',
  bellyDark: '#F5DEB3',
  // Yeux
  eyes: '#2C3E50', // Noir charbon
  eyeHighlight: '#FFFFFF',
  eyeIris: '#8B4513', // Marron ambre
  // Nez
  nose: '#1A1A1A',
  // Oreilles intérieur
  earInner: '#FFB6C1', // Rose pâle
  // Queue
  tailTip: '#FFFFFF',
  // Accessoire (triangle tangram)
  accessory: '#3498DB', // Bleu
  accessoryAlt: '#E74C3C', // Rouge
};

// Configurations des émotions
const EMOTIONS = {
  neutral: {
    eyeScale: 1,
    mouthCurve: 0,
  },
  happy: {
    eyeScale: 1.1,
    mouthCurve: 4,
  },
  thinking: {
    eyeScale: 0.85,
    mouthCurve: -2,
  },
  excited: {
    eyeScale: 1.3,
    mouthCurve: 6,
  },
  encouraging: {
    eyeScale: 1.05,
    mouthCurve: 3,
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

export function GeoMascot({
  message,
  emotion = 'neutral',
  visible = true,
  onMessageComplete,
}: GeoMascotProps) {
  // Animation values
  const bodyY = useSharedValue(0);
  const earRotateLeft = useSharedValue(0);
  const earRotateRight = useSharedValue(0);
  const tailWag = useSharedValue(0);
  const eyesPulse = useSharedValue(1);

  // Idle floating animation
  useEffect(() => {
    bodyY.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 1300, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1300, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [bodyY]);

  // Ear twitch animation (alternating)
  useEffect(() => {
    earRotateLeft.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(5, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    earRotateRight.value = withRepeat(
      withSequence(
        withTiming(8, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(-5, { duration: 700, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [earRotateLeft, earRotateRight]);

  // Tail wagging animation
  useEffect(() => {
    tailWag.value = withRepeat(
      withSequence(
        withTiming(15, { duration: 400, easing: Easing.inOut(Easing.ease) }),
        withTiming(-15, { duration: 400, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [tailWag]);

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

  const tailStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${tailWag.value}deg` }],
  }));

  if (!visible) return null;

  const currentEmotion = EMOTIONS[emotion];
  const mouthY = 75 + currentEmotion.mouthCurve;

  return (
    <View style={styles.container}>
      {/* Géo SVG - positioned left */}
      <Animated.View
        style={[styles.mascot, bodyStyle]}
        accessible={true}
        accessibilityRole="image"
        accessibilityLabel="Géo le renard, mascotte du jeu Tangram"
      >
        <Svg width="110" height="130" viewBox="0 0 110 130">
          <Defs>
            <SvgLinearGradient id="geoBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={GEO_COLORS.bodyLight} />
              <Stop offset="100%" stopColor={GEO_COLORS.body} />
            </SvgLinearGradient>
            <SvgLinearGradient id="geoBellyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={GEO_COLORS.belly} />
              <Stop offset="100%" stopColor={GEO_COLORS.bellyDark} />
            </SvgLinearGradient>
          </Defs>

          {/* Tail (behind body) */}
          <Animated.View style={tailStyle}>
            <G transform="translate(75, 85)">
              <Path
                d="M 0 0 Q 25 -10 35 5 Q 40 15 30 20 Q 15 25 5 15 Q -5 10 0 0"
                fill="url(#geoBodyGradient)"
                stroke={GEO_COLORS.bodyDark}
                strokeWidth="1.5"
              />
              {/* Tail tip (white) */}
              <Ellipse
                cx="32"
                cy="12"
                rx="10"
                ry="8"
                fill={GEO_COLORS.tailTip}
              />
            </G>
          </Animated.View>

          {/* Body (oval) */}
          <Ellipse
            cx="55"
            cy="90"
            rx="28"
            ry="25"
            fill="url(#geoBodyGradient)"
            stroke={GEO_COLORS.bodyDark}
            strokeWidth="2"
          />

          {/* Belly */}
          <Ellipse
            cx="55"
            cy="92"
            rx="18"
            ry="18"
            fill="url(#geoBellyGradient)"
          />

          {/* Front legs */}
          <Ellipse
            cx="40"
            cy="110"
            rx="8"
            ry="12"
            fill="url(#geoBodyGradient)"
            stroke={GEO_COLORS.bodyDark}
            strokeWidth="1.5"
          />
          <Ellipse
            cx="70"
            cy="110"
            rx="8"
            ry="12"
            fill="url(#geoBodyGradient)"
            stroke={GEO_COLORS.bodyDark}
            strokeWidth="1.5"
          />

          {/* Head */}
          <Ellipse
            cx="55"
            cy="45"
            rx="30"
            ry="28"
            fill="url(#geoBodyGradient)"
            stroke={GEO_COLORS.bodyDark}
            strokeWidth="2"
          />

          {/* Ears */}
          {/* Left ear */}
          <G transform={`rotate(-5, 32, 20)`}>
            <Polygon
              points="32,8 22,35 42,35"
              fill="url(#geoBodyGradient)"
              stroke={GEO_COLORS.bodyDark}
              strokeWidth="2"
            />
            <Polygon
              points="32,14 26,32 38,32"
              fill={GEO_COLORS.earInner}
            />
          </G>

          {/* Right ear */}
          <G transform={`rotate(5, 78, 20)`}>
            <Polygon
              points="78,8 68,35 88,35"
              fill="url(#geoBodyGradient)"
              stroke={GEO_COLORS.bodyDark}
              strokeWidth="2"
            />
            <Polygon
              points="78,14 72,32 84,32"
              fill={GEO_COLORS.earInner}
            />
          </G>

          {/* Face mask (white area) */}
          <Path
            d="M 55 35 Q 75 40 72 55 Q 70 70 55 78 Q 40 70 38 55 Q 35 40 55 35"
            fill={GEO_COLORS.belly}
          />

          {/* Muzzle */}
          <Ellipse
            cx="55"
            cy="65"
            rx="15"
            ry="12"
            fill={GEO_COLORS.belly}
          />

          {/* Eyes */}
          <G transform={`scale(${currentEmotion.eyeScale}) translate(${55 - 55 * currentEmotion.eyeScale}, ${42 - 42 * currentEmotion.eyeScale})`}>
            {/* Left eye - white */}
            <Ellipse cx="42" cy="42" rx="8" ry="9" fill="white" />
            {/* Left eye - iris */}
            <Circle cx="43" cy="43" r="5" fill={GEO_COLORS.eyeIris} />
            {/* Left eye - pupil */}
            <Circle cx="44" cy="43" r="2.5" fill={GEO_COLORS.eyes} />
            {/* Left eye - highlight */}
            <Circle cx="45" cy="41" r="1.5" fill={GEO_COLORS.eyeHighlight} />

            {/* Right eye - white */}
            <Ellipse cx="68" cy="42" rx="8" ry="9" fill="white" />
            {/* Right eye - iris */}
            <Circle cx="67" cy="43" r="5" fill={GEO_COLORS.eyeIris} />
            {/* Right eye - pupil */}
            <Circle cx="66" cy="43" r="2.5" fill={GEO_COLORS.eyes} />
            {/* Right eye - highlight */}
            <Circle cx="65" cy="41" r="1.5" fill={GEO_COLORS.eyeHighlight} />
          </G>

          {/* Nose */}
          <Ellipse
            cx="55"
            cy="60"
            rx="5"
            ry="4"
            fill={GEO_COLORS.nose}
          />
          {/* Nose highlight */}
          <Ellipse
            cx="54"
            cy="59"
            rx="1.5"
            ry="1"
            fill="#444444"
          />

          {/* Mouth - curved based on emotion */}
          <Path
            d={`M 48 ${mouthY} Q 55 ${mouthY + currentEmotion.mouthCurve + 3} 62 ${mouthY}`}
            stroke={GEO_COLORS.bodyDark}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Whiskers */}
          {/* Left whiskers */}
          <Path d="M 35 62 L 20 58" stroke={GEO_COLORS.bodyDark} strokeWidth="1.5" strokeLinecap="round" />
          <Path d="M 35 65 L 18 65" stroke={GEO_COLORS.bodyDark} strokeWidth="1.5" strokeLinecap="round" />
          <Path d="M 35 68 L 20 72" stroke={GEO_COLORS.bodyDark} strokeWidth="1.5" strokeLinecap="round" />

          {/* Right whiskers */}
          <Path d="M 75 62 L 90 58" stroke={GEO_COLORS.bodyDark} strokeWidth="1.5" strokeLinecap="round" />
          <Path d="M 75 65 L 92 65" stroke={GEO_COLORS.bodyDark} strokeWidth="1.5" strokeLinecap="round" />
          <Path d="M 75 68 L 90 72" stroke={GEO_COLORS.bodyDark} strokeWidth="1.5" strokeLinecap="round" />

          {/* Accessory: Small tangram triangle on chest */}
          <Polygon
            points="55,82 48,95 62,95"
            fill={GEO_COLORS.accessory}
            stroke="#2980B9"
            strokeWidth="1"
          />
          <Polygon
            points="55,86 51,93 59,93"
            fill={GEO_COLORS.accessoryAlt}
          />
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
    width: 110,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bubble: {
    flex: 1,
    marginLeft: spacing[3],
  },
});

export default GeoMascot;
