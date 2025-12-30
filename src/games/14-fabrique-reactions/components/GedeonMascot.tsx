/**
 * GedeonMascot component - Gédéon le Hamster Ingénieur
 * =====================================================
 * Mascotte animée avec bulle de dialogue et émotions
 * Thème : atelier mécanique, engrenages
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
import Svg, {
  Rect,
  Circle,
  Ellipse,
  Path,
  G,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';

import { spacing } from '../../../theme';
import { MascotBubble } from '../../../components/common';
import type { GedeonExpression } from '../types';

interface GedeonMascotProps {
  message: string;
  emotion?: GedeonExpression;
  visible?: boolean;
}

// Palette de couleurs de Gédéon
const GEDEON_COLORS = {
  // Corps du hamster
  fur: '#D4A574',         // Beige/marron clair
  furDark: '#B8956A',     // Marron foncé
  furLight: '#E8C9A6',    // Beige clair
  belly: '#F5E6D3',       // Ventre crème

  // Visage
  nose: '#FFB6C1',        // Nez rose
  eyes: '#2D1B0E',        // Yeux marron foncé
  eyeHighlight: '#FFFFFF',

  // Accessoires ingénieur
  goggles: '#4A90D9',     // Lunettes bleues
  gogglesFrame: '#2D5A87',
  gogglesLens: '#7FDBFF',
  helmet: '#FFB347',      // Casque orange
  helmetStripe: '#FF8C00',
  gear: '#8B8B8B',        // Engrenage gris

  // Expressions
  blush: '#FFCCCC',
  whiskers: '#8B7355',
};

// Configuration des émotions
const EMOTIONS = {
  neutral: {
    mouthPath: 'M 42 75 Q 50 78 58 75',
    eyeScale: 1,
    cheekOpacity: 0,
  },
  thinking: {
    mouthPath: 'M 45 75 Q 50 73 55 75',
    eyeScale: 0.9,
    cheekOpacity: 0,
  },
  happy: {
    mouthPath: 'M 40 73 Q 50 82 60 73',
    eyeScale: 1.1,
    cheekOpacity: 0.3,
  },
  excited: {
    mouthPath: 'M 38 70 Q 50 88 62 70',
    eyeScale: 1.3,
    cheekOpacity: 0.5,
  },
  encouraging: {
    mouthPath: 'M 42 74 Q 50 80 58 74',
    eyeScale: 1.05,
    cheekOpacity: 0.2,
  },
  surprised: {
    mouthPath: 'M 45 75 Q 50 85 55 75',
    eyeScale: 1.4,
    cheekOpacity: 0.1,
  },
};

export function GedeonMascot({
  message,
  emotion = 'neutral',
  visible = true,
}: GedeonMascotProps) {
  // Animation values
  const bodyY = useSharedValue(0);
  const wheelRotation = useSharedValue(0);
  const earWiggle = useSharedValue(0);
  const cheekPulse = useSharedValue(1);

  // Idle bouncing animation (hamster style)
  useEffect(() => {
    bodyY.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 400, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 400, easing: Easing.in(Easing.quad) })
      ),
      -1,
      false
    );
  }, []);

  // Wheel rotation (represents gears/thinking)
  useEffect(() => {
    wheelRotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  // Ear wiggle
  useEffect(() => {
    earWiggle.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(5, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  // Cheek animation based on emotion
  useEffect(() => {
    if (emotion === 'excited' || emotion === 'happy') {
      cheekPulse.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 300 }),
          withTiming(1, { duration: 300 })
        ),
        -1,
        true
      );
    } else {
      cheekPulse.value = withSpring(1);
    }
  }, [emotion]);

  // Animated styles
  const bodyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bodyY.value }],
  }));

  const gearStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${wheelRotation.value}deg` }],
  }));

  const earStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${earWiggle.value}deg` }],
  }));

  if (!visible) return null;

  const currentEmotion = EMOTIONS[emotion];

  return (
    <View style={styles.container}>
      {/* Gédéon SVG */}
      <Animated.View style={[styles.mascot, bodyStyle]}>
        <Svg width="110" height="130" viewBox="0 0 110 130">
          <Defs>
            <SvgLinearGradient id="furGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={GEDEON_COLORS.furLight} />
              <Stop offset="100%" stopColor={GEDEON_COLORS.fur} />
            </SvgLinearGradient>
            <SvgLinearGradient id="helmetGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={GEDEON_COLORS.helmet} />
              <Stop offset="100%" stopColor={GEDEON_COLORS.helmetStripe} />
            </SvgLinearGradient>
          </Defs>

          {/* Casque d'ingénieur */}
          <G>
            <Ellipse
              cx="55"
              cy="25"
              rx="35"
              ry="20"
              fill="url(#helmetGradient)"
            />
            <Rect
              x="25"
              y="20"
              width="60"
              height="8"
              fill={GEDEON_COLORS.helmetStripe}
            />
            {/* Lampe du casque */}
            <Circle cx="55" cy="12" r="6" fill="#FFEB3B" />
            <Circle cx="55" cy="12" r="4" fill="#FFF59D" />
          </G>

          {/* Oreilles (avec animation) */}
          <Animated.View style={earStyle}>
            {/* Oreille gauche */}
            <Ellipse
              cx="28"
              cy="45"
              rx="12"
              ry="18"
              fill={GEDEON_COLORS.fur}
            />
            <Ellipse
              cx="28"
              cy="45"
              rx="8"
              ry="12"
              fill={GEDEON_COLORS.furLight}
            />
            {/* Oreille droite */}
            <Ellipse
              cx="82"
              cy="45"
              rx="12"
              ry="18"
              fill={GEDEON_COLORS.fur}
            />
            <Ellipse
              cx="82"
              cy="45"
              rx="8"
              ry="12"
              fill={GEDEON_COLORS.furLight}
            />
          </Animated.View>

          {/* Tête */}
          <Ellipse
            cx="55"
            cy="60"
            rx="35"
            ry="32"
            fill="url(#furGradient)"
          />

          {/* Joues (bajoues de hamster) */}
          <Ellipse
            cx="30"
            cy="68"
            rx="15"
            ry="12"
            fill={GEDEON_COLORS.furLight}
            opacity={0.8}
          />
          <Ellipse
            cx="80"
            cy="68"
            rx="15"
            ry="12"
            fill={GEDEON_COLORS.furLight}
            opacity={0.8}
          />

          {/* Lunettes de protection */}
          <G>
            {/* Monture */}
            <Path
              d="M 25 58 Q 55 52 85 58"
              stroke={GEDEON_COLORS.gogglesFrame}
              strokeWidth="3"
              fill="none"
            />
            {/* Verre gauche */}
            <Ellipse
              cx="38"
              cy="58"
              rx="14"
              ry="12"
              fill={GEDEON_COLORS.gogglesLens}
              opacity={0.7}
            />
            <Ellipse
              cx="38"
              cy="58"
              rx="14"
              ry="12"
              stroke={GEDEON_COLORS.gogglesFrame}
              strokeWidth="2"
              fill="none"
            />
            {/* Verre droit */}
            <Ellipse
              cx="72"
              cy="58"
              rx="14"
              ry="12"
              fill={GEDEON_COLORS.gogglesLens}
              opacity={0.7}
            />
            <Ellipse
              cx="72"
              cy="58"
              rx="14"
              ry="12"
              stroke={GEDEON_COLORS.gogglesFrame}
              strokeWidth="2"
              fill="none"
            />
          </G>

          {/* Yeux (derrière les lunettes) */}
          <G transform={`scale(${currentEmotion.eyeScale})`} origin="55, 58">
            {/* Oeil gauche */}
            <Circle cx="38" cy="58" r="5" fill={GEDEON_COLORS.eyes} />
            <Circle cx="36" cy="56" r="2" fill={GEDEON_COLORS.eyeHighlight} />
            {/* Oeil droit */}
            <Circle cx="72" cy="58" r="5" fill={GEDEON_COLORS.eyes} />
            <Circle cx="70" cy="56" r="2" fill={GEDEON_COLORS.eyeHighlight} />
          </G>

          {/* Nez */}
          <Ellipse
            cx="55"
            cy="70"
            rx="6"
            ry="4"
            fill={GEDEON_COLORS.nose}
          />

          {/* Moustaches */}
          <G>
            {/* Gauche */}
            <Path
              d="M 35 72 L 15 68"
              stroke={GEDEON_COLORS.whiskers}
              strokeWidth="1.5"
            />
            <Path
              d="M 35 74 L 15 74"
              stroke={GEDEON_COLORS.whiskers}
              strokeWidth="1.5"
            />
            <Path
              d="M 35 76 L 15 80"
              stroke={GEDEON_COLORS.whiskers}
              strokeWidth="1.5"
            />
            {/* Droite */}
            <Path
              d="M 75 72 L 95 68"
              stroke={GEDEON_COLORS.whiskers}
              strokeWidth="1.5"
            />
            <Path
              d="M 75 74 L 95 74"
              stroke={GEDEON_COLORS.whiskers}
              strokeWidth="1.5"
            />
            <Path
              d="M 75 76 L 95 80"
              stroke={GEDEON_COLORS.whiskers}
              strokeWidth="1.5"
            />
          </G>

          {/* Bouche (selon émotion) */}
          <Path
            d={currentEmotion.mouthPath}
            stroke={GEDEON_COLORS.furDark}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Joues roses (selon émotion) */}
          <Circle
            cx="28"
            cy="72"
            r="6"
            fill={GEDEON_COLORS.blush}
            opacity={currentEmotion.cheekOpacity}
          />
          <Circle
            cx="82"
            cy="72"
            r="6"
            fill={GEDEON_COLORS.blush}
            opacity={currentEmotion.cheekOpacity}
          />

          {/* Corps avec salopette */}
          <Ellipse
            cx="55"
            cy="105"
            rx="28"
            ry="22"
            fill={GEDEON_COLORS.fur}
          />
          {/* Ventre */}
          <Ellipse
            cx="55"
            cy="108"
            rx="18"
            ry="15"
            fill={GEDEON_COLORS.belly}
          />
          {/* Salopette */}
          <Path
            d="M 35 95 L 35 120 Q 55 130 75 120 L 75 95"
            fill="#5B7FFF"
            opacity={0.8}
          />
          <Rect x="45" y="100" width="20" height="10" rx="3" fill="#4A6FEF" />

          {/* Petit engrenage accessoire */}
          <Animated.View style={gearStyle}>
            <Circle cx="90" cy="105" r="8" fill={GEDEON_COLORS.gear} />
            <Circle cx="90" cy="105" r="4" fill="#6B6B6B" />
            {/* Dents de l'engrenage */}
            <Rect x="88" y="95" width="4" height="4" fill={GEDEON_COLORS.gear} />
            <Rect x="88" y="108" width="4" height="4" fill={GEDEON_COLORS.gear} />
            <Rect x="80" y="103" width="4" height="4" fill={GEDEON_COLORS.gear} />
            <Rect x="96" y="103" width="4" height="4" fill={GEDEON_COLORS.gear} />
          </Animated.View>

          {/* Pattes */}
          <Ellipse cx="35" cy="125" rx="10" ry="6" fill={GEDEON_COLORS.furDark} />
          <Ellipse cx="75" cy="125" rx="10" ry="6" fill={GEDEON_COLORS.furDark} />
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

export default GedeonMascot;
