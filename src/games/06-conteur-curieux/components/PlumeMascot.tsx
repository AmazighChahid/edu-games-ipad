/**
 * PlumeMascot Component
 *
 * Mascotte Plume le Hibou pour Le Conteur Curieux
 * Hibou sage avec casquette de graduation et livre
 *
 * Expressions:
 * - neutral: État de base, attentif
 * - happy: Yeux en croissants, sourire
 * - thinking: Tête penchée, sourcil levé
 * - encouraging: Pouces levés (ailes), clin d'œil
 * - celebrating: Bat des ailes, yeux brillants
 * - listening: Grandes oreilles dressées
 * - reading: Regarde un livre
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from 'react-native-reanimated';

import { spacing } from '../../../theme';
import { MascotBubble } from '../../../components/common';
import type { PlumeExpression } from '../types';

type PlumeSize = 'small' | 'medium' | 'large';

interface PlumeMascotProps {
  expression?: PlumeExpression;
  size?: PlumeSize;
  message?: string;
  showBubble?: boolean;
  bubblePosition?: 'top' | 'right';
  style?: ViewStyle;
}

// Palette de couleurs pour Plume
const PLUME_COLORS = {
  body: '#8B7355',        // Brun chaud
  bodyLight: '#A08060',   // Brun clair pour le ventre
  wing: '#7A6550',        // Ailes légèrement plus foncées
  beak: '#FFB347',        // Bec orange
  eye: '#FFFFFF',         // Blanc des yeux
  pupil: '#2D3748',       // Pupille
  eyeHappy: '#FFD93D',    // Yeux joyeux (croissants)
  cap: '#2D3748',         // Casquette graduation
  capTassel: '#FFD93D',   // Pompon doré
  book: '#9B59B6',        // Livre violet (thème Conteur)
  bookPages: '#FFF9F0',   // Pages
};

// Dimensions par taille
const SIZES: Record<PlumeSize, { width: number; height: number; scale: number }> = {
  small: { width: 60, height: 70, scale: 0.75 },
  medium: { width: 100, height: 120, scale: 1 },
  large: { width: 140, height: 160, scale: 1.25 },
};

export function PlumeMascot({
  expression = 'neutral',
  size = 'medium',
  message,
  showBubble = false,
  bubblePosition = 'top',
  style,
}: PlumeMascotProps) {
  const dimensions = SIZES[size];

  // Animation values
  const bodyY = useSharedValue(0);
  const bodyRotate = useSharedValue(0);
  const leftPupilScale = useSharedValue(1);
  const rightPupilScale = useSharedValue(1);
  const leftWingRotate = useSharedValue(0);
  const rightWingRotate = useSharedValue(0);
  const bookY = useSharedValue(0);

  // Idle floating animation
  useEffect(() => {
    bodyY.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
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
        withDelay(15, withTiming(0.1, { duration: 80 })),
        withTiming(1, { duration: 80 })
      );
    };

    const interval = setInterval(() => {
      if (expression !== 'happy' && expression !== 'celebrating') {
        blink();
      }
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [expression]);

  // Expression-based animations
  useEffect(() => {
    switch (expression) {
      case 'thinking':
        bodyRotate.value = withTiming(-8, { duration: 300 });
        break;

      case 'celebrating':
        // Wing flapping (continuous)
        leftWingRotate.value = withRepeat(
          withSequence(
            withTiming(-25, { duration: 120 }),
            withTiming(0, { duration: 120 })
          ),
          -1, // Infinite
          true
        );
        rightWingRotate.value = withRepeat(
          withSequence(
            withTiming(25, { duration: 120 }),
            withTiming(0, { duration: 120 })
          ),
          -1, // Infinite
          true
        );
        // Continuous jumping animation
        bodyY.value = withRepeat(
          withSequence(
            withTiming(-20, { duration: 300, easing: Easing.out(Easing.ease) }),
            withTiming(0, { duration: 300, easing: Easing.in(Easing.ease) })
          ),
          -1, // Infinite
          true
        );
        break;

      case 'encouraging':
        // Head tilt side to side
        bodyRotate.value = withRepeat(
          withSequence(
            withTiming(-5, { duration: 400 }),
            withTiming(5, { duration: 400 })
          ),
          2,
          true
        );
        break;

      case 'reading':
        // Book bounce
        bookY.value = withRepeat(
          withSequence(
            withTiming(-3, { duration: 800 }),
            withTiming(0, { duration: 800 })
          ),
          -1,
          true
        );
        break;

      default:
        bodyRotate.value = withTiming(0, { duration: 300 });
        leftWingRotate.value = withTiming(0, { duration: 200 });
        rightWingRotate.value = withTiming(0, { duration: 200 });
    }
  }, [expression]);

  // Animated styles
  const bodyStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bodyY.value },
      { rotate: `${bodyRotate.value}deg` },
    ],
  }));

  const leftPupilStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: leftPupilScale.value }],
  }));

  const rightPupilStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: rightPupilScale.value }],
  }));

  const leftWingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${leftWingRotate.value - 10}deg` }],
  }));

  const rightWingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rightWingRotate.value + 10}deg` }],
  }));

  const bookStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bookY.value }],
  }));

  // Eyes based on expression
  const renderEyes = () => {
    if (expression === 'happy' || expression === 'celebrating') {
      // Happy eyes (curved lines)
      return (
        <>
          <View style={[styles.happyEye, styles.eyeLeft, { width: 18 * dimensions.scale }]} />
          <View style={[styles.happyEye, styles.eyeRight, { width: 18 * dimensions.scale }]} />
        </>
      );
    }

    // Normal eyes
    return (
      <>
        <View style={[styles.eye, styles.eyeLeft, { width: 20 * dimensions.scale, height: 20 * dimensions.scale }]}>
          <Animated.View style={[styles.pupil, leftPupilStyle, { width: 10 * dimensions.scale, height: 10 * dimensions.scale }]} />
        </View>
        <View style={[styles.eye, styles.eyeRight, { width: 20 * dimensions.scale, height: 20 * dimensions.scale }]}>
          <Animated.View style={[styles.pupil, rightPupilStyle, { width: 10 * dimensions.scale, height: 10 * dimensions.scale }]} />
        </View>
      </>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {/* Speech bubble */}
      {showBubble && message && (
        <View style={[
          styles.bubbleContainer,
          bubblePosition === 'right' && styles.bubbleRight,
        ]}>
          <MascotBubble
            message={message}
            tailPosition={bubblePosition === 'right' ? 'left' : 'bottom'}
            maxWidth={220}
            showDecorations={false}
            hideTail={false}
            typing={true}
            typingSpeed={30}
          />
        </View>
      )}

      {/* Owl body */}
      <Animated.View style={[styles.owl, { width: dimensions.width, height: dimensions.height }, bodyStyle]}>
        {/* Graduation cap */}
        <View style={[styles.cap, { width: 40 * dimensions.scale }]}>
          <View style={[styles.capTop, { width: 36 * dimensions.scale }]} />
          <View style={styles.capTassel} />
        </View>

        {/* Wings */}
        <Animated.View style={[styles.wing, styles.wingLeft, { width: 22 * dimensions.scale, height: 30 * dimensions.scale }, leftWingStyle]} />
        <Animated.View style={[styles.wing, styles.wingRight, { width: 22 * dimensions.scale, height: 30 * dimensions.scale }, rightWingStyle]} />

        {/* Body */}
        <View style={[styles.body, { width: dimensions.width * 0.85, height: dimensions.height * 0.75 }]}>
          {/* Belly */}
          <View style={[styles.belly, { width: dimensions.width * 0.5, height: dimensions.height * 0.4 }]} />

          {/* Eyes */}
          {renderEyes()}

          {/* Beak */}
          <View style={[styles.beak, {
            borderLeftWidth: 8 * dimensions.scale,
            borderRightWidth: 8 * dimensions.scale,
            borderTopWidth: 12 * dimensions.scale
          }]} />

          {/* Ear tufts */}
          <View style={[styles.earTuft, styles.earTuftLeft, { height: 15 * dimensions.scale }]} />
          <View style={[styles.earTuft, styles.earTuftRight, { height: 15 * dimensions.scale }]} />
        </View>

        {/* Book (shown for reading expression or always for large size) */}
        {(expression === 'reading' || size === 'large') && (
          <Animated.View style={[styles.book, bookStyle]}>
            <View style={styles.bookCover}>
              <Text style={styles.bookEmoji}>📖</Text>
            </View>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleContainer: {
    marginBottom: spacing[3],
  },
  bubbleRight: {
    position: 'absolute',
    right: -240,
    top: '20%',
  },
  owl: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  // Graduation cap
  cap: {
    position: 'absolute',
    top: -5,
    alignItems: 'center',
    zIndex: 10,
  },
  capTop: {
    height: 8,
    backgroundColor: PLUME_COLORS.cap,
    borderRadius: 2,
  },
  capTassel: {
    position: 'absolute',
    top: 6,
    right: -8,
    width: 2,
    height: 15,
    backgroundColor: PLUME_COLORS.capTassel,
    borderRadius: 1,
  },

  // Body
  body: {
    backgroundColor: PLUME_COLORS.body,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 25,
  },
  belly: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: PLUME_COLORS.bodyLight,
    borderRadius: 30,
  },

  // Eyes
  eye: {
    position: 'absolute',
    top: 20,
    backgroundColor: PLUME_COLORS.eye,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeLeft: {
    left: '22%',
  },
  eyeRight: {
    right: '22%',
  },
  pupil: {
    backgroundColor: PLUME_COLORS.pupil,
    borderRadius: 5,
  },
  happyEye: {
    position: 'absolute',
    top: 25,
    height: 4,
    backgroundColor: PLUME_COLORS.pupil,
    borderRadius: 4,
    transform: [{ rotate: '-10deg' }],
  },

  // Beak
  beak: {
    position: 'absolute',
    top: 45,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: PLUME_COLORS.beak,
  },

  // Ear tufts
  earTuft: {
    position: 'absolute',
    top: -10,
    width: 6,
    backgroundColor: PLUME_COLORS.body,
    borderRadius: 3,
  },
  earTuftLeft: {
    left: 15,
    transform: [{ rotate: '-15deg' }],
  },
  earTuftRight: {
    right: 15,
    transform: [{ rotate: '15deg' }],
  },

  // Wings
  wing: {
    position: 'absolute',
    top: '45%',
    backgroundColor: PLUME_COLORS.wing,
    borderRadius: 12,
  },
  wingLeft: {
    left: -10,
  },
  wingRight: {
    right: -10,
  },

  // Book
  book: {
    position: 'absolute',
    bottom: -5,
    right: -15,
  },
  bookCover: {
    width: 30,
    height: 24,
    backgroundColor: PLUME_COLORS.book,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookEmoji: {
    fontSize: 16,
  },
});

export default PlumeMascot;
