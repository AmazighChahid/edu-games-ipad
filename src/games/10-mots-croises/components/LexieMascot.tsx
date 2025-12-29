/**
 * LexieMascot component - Lexie le Perroquet
 * Mascotte animée pour le jeu Mots Croisés
 *
 * Personnalité : Éloquente, cultivée, aime les mots et la littérature
 * Style : Perroquet coloré avec un béret d'artiste et des lunettes
 *
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
} from 'react-native-reanimated';
import Svg, {
  G,
  Path,
  Circle,
  Ellipse,
  Rect,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';

import { spacing } from '../../../theme';
import { MascotBubble } from '../../../components/common';

// ============================================================================
// TYPES
// ============================================================================

export type LexieEmotionType = 'neutral' | 'happy' | 'thinking' | 'excited' | 'encouraging';

interface LexieMascotProps {
  message: string;
  emotion?: LexieEmotionType;
  visible?: boolean;
  canPlayAudio?: boolean;
}

// ============================================================================
// COULEURS LEXIE
// ============================================================================

const LEXIE_COLORS = {
  // Corps principal - vert tropical
  bodyMain: '#2ECC71',
  bodyLight: '#58D68D',
  bodyDark: '#27AE60',

  // Poitrine - jaune doré
  chest: '#F1C40F',
  chestLight: '#F4D03F',

  // Ailes - bleu tropical
  wingMain: '#3498DB',
  wingLight: '#5DADE2',
  wingDark: '#2980B9',

  // Queue - rouge/orange
  tailMain: '#E74C3C',
  tailLight: '#EC7063',

  // Bec - orange
  beakMain: '#E67E22',
  beakDark: '#D35400',

  // Yeux
  eyeWhite: '#FFFFFF',
  eyePupil: '#2C3E50',
  eyeHighlight: '#FFFFFF',

  // Accessoires
  beretMain: '#9B59B6', // Béret violet d'artiste
  beretDark: '#8E44AD',
  glassesFrame: '#34495E',
  glassesLens: 'rgba(52, 73, 94, 0.15)',

  // Joues
  blush: '#FADBD8',
};

// ============================================================================
// EMOTION CONFIGS
// ============================================================================

const EMOTIONS = {
  neutral: {
    eyeScale: 1,
    beakOpen: 0,
    wingRotate: 0,
  },
  happy: {
    eyeScale: 1.1,
    beakOpen: 5,
    wingRotate: -5,
  },
  thinking: {
    eyeScale: 0.9,
    beakOpen: 0,
    wingRotate: 10,
  },
  excited: {
    eyeScale: 1.3,
    beakOpen: 8,
    wingRotate: -15,
  },
  encouraging: {
    eyeScale: 1.05,
    beakOpen: 3,
    wingRotate: -8,
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

export function LexieMascot({
  message,
  emotion = 'neutral',
  visible = true,
}: LexieMascotProps) {
  // Animation values
  const bodyY = useSharedValue(0);
  const headTilt = useSharedValue(0);
  const wingRotate = useSharedValue(0);
  const tailWag = useSharedValue(0);
  const beretBounce = useSharedValue(0);
  const eyeBlink = useSharedValue(1);

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
  }, []);

  // Head tilt animation
  useEffect(() => {
    headTilt.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(8, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  // Wing animation based on emotion
  useEffect(() => {
    const targetRotate = EMOTIONS[emotion].wingRotate;
    wingRotate.value = withSpring(targetRotate, { damping: 12, stiffness: 100 });

    if (emotion === 'excited') {
      wingRotate.value = withRepeat(
        withSequence(
          withTiming(-20, { duration: 200 }),
          withTiming(-5, { duration: 200 })
        ),
        -1,
        true
      );
    }
  }, [emotion]);

  // Tail wag
  useEffect(() => {
    tailWag.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(10, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  // Beret bounce
  useEffect(() => {
    beretBounce.value = withRepeat(
      withSequence(
        withTiming(-2, { duration: 1500 }),
        withTiming(2, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  // Eye blink
  useEffect(() => {
    const blink = () => {
      eyeBlink.value = withSequence(
        withTiming(0.1, { duration: 80 }),
        withTiming(1, { duration: 80 })
      );
    };

    const interval = setInterval(blink, 3500);
    return () => clearInterval(interval);
  }, []);

  // Animated styles
  const bodyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bodyY.value }],
  }));

  const headStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${headTilt.value}deg` }],
  }));

  const leftWingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${wingRotate.value}deg` }],
  }));

  const rightWingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-wingRotate.value}deg` }],
  }));

  const tailStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${tailWag.value}deg` }],
  }));

  const beretStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: beretBounce.value }],
  }));

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {/* Lexie SVG */}
      <Animated.View style={[styles.mascot, bodyStyle]}>
        <Svg width="110" height="130" viewBox="0 0 110 130">
          <Defs>
            {/* Gradient corps */}
            <SvgLinearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={LEXIE_COLORS.bodyLight} />
              <Stop offset="100%" stopColor={LEXIE_COLORS.bodyMain} />
            </SvgLinearGradient>
            {/* Gradient aile */}
            <SvgLinearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={LEXIE_COLORS.wingLight} />
              <Stop offset="100%" stopColor={LEXIE_COLORS.wingMain} />
            </SvgLinearGradient>
            {/* Gradient béret */}
            <SvgLinearGradient id="beretGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={LEXIE_COLORS.beretMain} />
              <Stop offset="100%" stopColor={LEXIE_COLORS.beretDark} />
            </SvgLinearGradient>
          </Defs>

          {/* Queue (derrière le corps) */}
          <Animated.View style={tailStyle}>
            <G transform="translate(55, 115)">
              <Path
                d="M -5 0 Q -15 20 -25 35 Q -20 30 -15 25"
                fill={LEXIE_COLORS.tailMain}
                stroke={LEXIE_COLORS.tailLight}
                strokeWidth="1"
              />
              <Path
                d="M 0 0 Q 0 25 -5 40 Q 0 35 5 25"
                fill={LEXIE_COLORS.bodyMain}
                stroke={LEXIE_COLORS.bodyDark}
                strokeWidth="1"
              />
              <Path
                d="M 5 0 Q 15 20 25 35 Q 20 30 15 25"
                fill={LEXIE_COLORS.wingMain}
                stroke={LEXIE_COLORS.wingDark}
                strokeWidth="1"
              />
            </G>
          </Animated.View>

          {/* Corps */}
          <Ellipse
            cx="55"
            cy="85"
            rx="28"
            ry="35"
            fill="url(#bodyGradient)"
            stroke={LEXIE_COLORS.bodyDark}
            strokeWidth="2"
          />

          {/* Poitrine jaune */}
          <Ellipse
            cx="55"
            cy="90"
            rx="18"
            ry="22"
            fill={LEXIE_COLORS.chest}
            stroke={LEXIE_COLORS.chestLight}
            strokeWidth="1"
          />

          {/* Aile gauche */}
          <Animated.View style={leftWingStyle}>
            <G transform="translate(25, 75)">
              <Ellipse
                cx="0"
                cy="0"
                rx="12"
                ry="25"
                fill="url(#wingGradient)"
                stroke={LEXIE_COLORS.wingDark}
                strokeWidth="1.5"
                transform="rotate(-20)"
              />
              {/* Détails plumes */}
              <Path
                d="M -8 -15 Q -12 -5 -10 5"
                stroke={LEXIE_COLORS.wingLight}
                strokeWidth="2"
                fill="none"
              />
              <Path
                d="M -5 -10 Q -10 0 -8 10"
                stroke={LEXIE_COLORS.wingLight}
                strokeWidth="1.5"
                fill="none"
              />
            </G>
          </Animated.View>

          {/* Aile droite */}
          <Animated.View style={rightWingStyle}>
            <G transform="translate(85, 75)">
              <Ellipse
                cx="0"
                cy="0"
                rx="12"
                ry="25"
                fill="url(#wingGradient)"
                stroke={LEXIE_COLORS.wingDark}
                strokeWidth="1.5"
                transform="rotate(20)"
              />
              {/* Détails plumes */}
              <Path
                d="M 8 -15 Q 12 -5 10 5"
                stroke={LEXIE_COLORS.wingLight}
                strokeWidth="2"
                fill="none"
              />
              <Path
                d="M 5 -10 Q 10 0 8 10"
                stroke={LEXIE_COLORS.wingLight}
                strokeWidth="1.5"
                fill="none"
              />
            </G>
          </Animated.View>

          {/* Tête */}
          <Animated.View style={headStyle}>
            <G transform="translate(55, 40)">
              {/* Forme tête */}
              <Circle
                cx="0"
                cy="0"
                r="25"
                fill="url(#bodyGradient)"
                stroke={LEXIE_COLORS.bodyDark}
                strokeWidth="2"
              />

              {/* Joues */}
              <Ellipse
                cx="-15"
                cy="8"
                rx="6"
                ry="4"
                fill={LEXIE_COLORS.blush}
                opacity="0.6"
              />
              <Ellipse
                cx="15"
                cy="8"
                rx="6"
                ry="4"
                fill={LEXIE_COLORS.blush}
                opacity="0.6"
              />

              {/* Lunettes */}
              {/* Monture gauche */}
              <Circle
                cx="-10"
                cy="-2"
                r="10"
                fill={LEXIE_COLORS.glassesLens}
                stroke={LEXIE_COLORS.glassesFrame}
                strokeWidth="2"
              />
              {/* Monture droite */}
              <Circle
                cx="10"
                cy="-2"
                r="10"
                fill={LEXIE_COLORS.glassesLens}
                stroke={LEXIE_COLORS.glassesFrame}
                strokeWidth="2"
              />
              {/* Pont */}
              <Path
                d="M 0 -2 Q 0 0 0 -2"
                stroke={LEXIE_COLORS.glassesFrame}
                strokeWidth="2"
                fill="none"
              />
              <Rect
                x="-2"
                y="-3"
                width="4"
                height="2"
                fill={LEXIE_COLORS.glassesFrame}
              />

              {/* Yeux derrière les lunettes */}
              {/* Oeil gauche */}
              <Circle cx="-10" cy="-2" r="5" fill={LEXIE_COLORS.eyeWhite} />
              <Circle cx="-10" cy="-1" r="3" fill={LEXIE_COLORS.eyePupil} />
              <Circle cx="-11" cy="-3" r="1.5" fill={LEXIE_COLORS.eyeHighlight} />

              {/* Oeil droit */}
              <Circle cx="10" cy="-2" r="5" fill={LEXIE_COLORS.eyeWhite} />
              <Circle cx="10" cy="-1" r="3" fill={LEXIE_COLORS.eyePupil} />
              <Circle cx="9" cy="-3" r="1.5" fill={LEXIE_COLORS.eyeHighlight} />

              {/* Bec */}
              <Path
                d="M 0 8 L -8 15 Q 0 20 8 15 Z"
                fill={LEXIE_COLORS.beakMain}
                stroke={LEXIE_COLORS.beakDark}
                strokeWidth="1"
              />
              {/* Ligne du bec */}
              <Path
                d="M -6 14 Q 0 16 6 14"
                stroke={LEXIE_COLORS.beakDark}
                strokeWidth="1"
                fill="none"
              />

              {/* Béret d'artiste */}
              <Animated.View style={beretStyle}>
                <G transform="translate(0, -22)">
                  <Ellipse
                    cx="5"
                    cy="0"
                    rx="20"
                    ry="8"
                    fill="url(#beretGradient)"
                    transform="rotate(-15)"
                  />
                  {/* Pompon */}
                  <Circle
                    cx="18"
                    cy="-5"
                    r="4"
                    fill={LEXIE_COLORS.beretMain}
                    stroke={LEXIE_COLORS.beretDark}
                    strokeWidth="1"
                  />
                </G>
              </Animated.View>
            </G>
          </Animated.View>

          {/* Pattes */}
          <G transform="translate(55, 118)">
            {/* Patte gauche */}
            <Path
              d="M -10 0 L -12 8 M -10 0 L -8 8 M -10 0 L -14 6"
              stroke={LEXIE_COLORS.beakDark}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Patte droite */}
            <Path
              d="M 10 0 L 12 8 M 10 0 L 8 8 M 10 0 L 14 6"
              stroke={LEXIE_COLORS.beakDark}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </G>
        </Svg>
      </Animated.View>

      {/* Bulle de dialogue */}
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

export default LexieMascot;
