/**
 * Pixel le Renard - Mascot Component for Matrices Magiques
 * Orange fox with purple glasses - guide for the matrix puzzles
 * Adapted from FelixMascot with unique visual identity
 */

import React, { memo, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

import { PixelMood, PixelMascotProps } from '../../types';

// ============================================================================
// CONSTANTS
// ============================================================================

const SIZE_MULTIPLIERS = {
  small: 0.6,
  medium: 0.8,
  large: 1.0,
};

const COLORS = {
  fur: '#FF9F43',        // Bright orange fur
  furDark: '#EE8B30',    // Darker orange for shading
  face: '#FDFEFE',       // White face
  nose: '#2C3E50',       // Dark nose
  eyes: '#FFFFFF',       // White eye background
  pupil: '#2C3E50',      // Dark pupil
  glasses: '#A29BFE',    // Purple glasses!
  glassesFrame: '#7C73E6', // Darker purple frame
  cheeks: '#FFCCBC',     // Peachy cheeks
  earInner: '#FFCCBC',   // Inner ear
  tailTip: '#FDFEFE',    // White tail tip
};

// ============================================================================
// PIXEL MASCOT COMPONENT
// ============================================================================

function PixelMascotComponent({
  mood = 'neutral',
  size = 'medium',
  animated = true,
  showSpeechBubble = false,
  message,
}: PixelMascotProps) {
  const sizeMultiplier = SIZE_MULTIPLIERS[size];

  // Animation values
  const bobOffset = useSharedValue(0);
  const tailWag = useSharedValue(0);
  const blinkScale = useSharedValue(1);
  const earWiggle = useSharedValue(0);
  const glassesGlint = useSharedValue(0);

  // Mood-specific animations
  const jumpOffset = useSharedValue(0);
  const headTilt = useSharedValue(0);

  useEffect(() => {
    if (!animated) return;

    // Base bobbing animation
    bobOffset.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Tail wagging - faster when excited
    const tailSpeed = mood === 'excited' || mood === 'celebrating' ? 250 : 400;
    const tailAngle = mood === 'excited' || mood === 'celebrating' ? 12 : 8;
    tailWag.value = withRepeat(
      withSequence(
        withTiming(-tailAngle, { duration: tailSpeed }),
        withTiming(tailAngle, { duration: tailSpeed })
      ),
      -1,
      true
    );

    // Blinking animation
    const blink = () => {
      blinkScale.value = withSequence(
        withTiming(0.1, { duration: 80 }),
        withTiming(1, { duration: 80 })
      );
    };
    const blinkInterval = setInterval(blink, 3000 + Math.random() * 2000);

    // Glasses glint
    glassesGlint.value = withRepeat(
      withSequence(
        withDelay(2000, withTiming(1, { duration: 300 })),
        withTiming(0, { duration: 300 })
      ),
      -1,
      false
    );

    // Mood-specific animations
    switch (mood) {
      case 'thinking':
        headTilt.value = withRepeat(
          withSequence(
            withTiming(5, { duration: 800 }),
            withTiming(-5, { duration: 800 })
          ),
          -1,
          true
        );
        break;

      case 'excited':
      case 'celebrating':
        jumpOffset.value = withRepeat(
          withSequence(
            withSpring(-10, { damping: 6 }),
            withSpring(0, { damping: 6 })
          ),
          -1,
          false
        );
        earWiggle.value = withRepeat(
          withSequence(
            withTiming(8, { duration: 150 }),
            withTiming(-8, { duration: 150 })
          ),
          -1,
          true
        );
        break;

      case 'curious':
        headTilt.value = withTiming(10, { duration: 300 });
        break;

      default:
        headTilt.value = withTiming(0, { duration: 200 });
        jumpOffset.value = withTiming(0, { duration: 200 });
    }

    return () => {
      clearInterval(blinkInterval);
    };
  }, [mood, animated]);

  // Animated styles
  const bodyStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bobOffset.value + jumpOffset.value },
    ],
  }));

  const headStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${headTilt.value}deg` },
    ],
  }));

  const tailStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${tailWag.value}deg` },
    ],
  }));

  const leftEyeStyle = useAnimatedStyle(() => ({
    transform: [
      { scaleY: blinkScale.value },
    ],
  }));

  const rightEyeStyle = useAnimatedStyle(() => ({
    transform: [
      { scaleY: blinkScale.value },
    ],
  }));

  const earStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${earWiggle.value}deg` },
    ],
  }));

  const glintStyle = useAnimatedStyle(() => ({
    opacity: glassesGlint.value,
  }));

  const baseSize = 85 * sizeMultiplier;

  return (
    <Animated.View
      entering={animated ? FadeIn.duration(300) : undefined}
      style={[styles.container, { width: baseSize, height: baseSize }]}
    >
      <Animated.View style={[styles.body, bodyStyle]}>
        {/* Tail */}
        <Animated.View
          style={[
            styles.tail,
            {
              width: 28 * sizeMultiplier,
              height: 45 * sizeMultiplier,
              bottom: -5 * sizeMultiplier,
              right: -10 * sizeMultiplier,
              borderRadius: 14 * sizeMultiplier,
            },
            tailStyle,
          ]}
        >
          <View
            style={[
              styles.tailTip,
              {
                width: 16 * sizeMultiplier,
                height: 22 * sizeMultiplier,
                borderRadius: 8 * sizeMultiplier,
                left: 6 * sizeMultiplier,
              },
            ]}
          />
        </Animated.View>

        {/* Head */}
        <Animated.View
          style={[
            styles.head,
            {
              width: 70 * sizeMultiplier,
              height: 65 * sizeMultiplier,
              borderRadius: 32 * sizeMultiplier,
              left: 5 * sizeMultiplier,
            },
            headStyle,
          ]}
        >
          {/* Ears */}
          <Animated.View
            style={[
              styles.ear,
              styles.earLeft,
              {
                width: 20 * sizeMultiplier,
                height: 28 * sizeMultiplier,
                top: -14 * sizeMultiplier,
                left: 8 * sizeMultiplier,
                borderTopLeftRadius: 12 * sizeMultiplier,
                borderTopRightRadius: 12 * sizeMultiplier,
              },
              earStyle,
            ]}
          >
            <View
              style={[
                styles.earInner,
                {
                  width: 12 * sizeMultiplier,
                  height: 16 * sizeMultiplier,
                  top: 5 * sizeMultiplier,
                  left: 4 * sizeMultiplier,
                  borderTopLeftRadius: 6 * sizeMultiplier,
                  borderTopRightRadius: 6 * sizeMultiplier,
                },
              ]}
            />
          </Animated.View>
          <Animated.View
            style={[
              styles.ear,
              styles.earRight,
              {
                width: 20 * sizeMultiplier,
                height: 28 * sizeMultiplier,
                top: -14 * sizeMultiplier,
                right: 8 * sizeMultiplier,
                borderTopLeftRadius: 12 * sizeMultiplier,
                borderTopRightRadius: 12 * sizeMultiplier,
              },
              earStyle,
            ]}
          >
            <View
              style={[
                styles.earInner,
                {
                  width: 12 * sizeMultiplier,
                  height: 16 * sizeMultiplier,
                  top: 5 * sizeMultiplier,
                  left: 4 * sizeMultiplier,
                  borderTopLeftRadius: 6 * sizeMultiplier,
                  borderTopRightRadius: 6 * sizeMultiplier,
                },
              ]}
            />
          </Animated.View>

          {/* Face (white area) */}
          <View
            style={[
              styles.face,
              {
                width: 45 * sizeMultiplier,
                height: 40 * sizeMultiplier,
                borderRadius: 22 * sizeMultiplier,
                bottom: 5 * sizeMultiplier,
                left: 12.5 * sizeMultiplier,
              },
            ]}
          >
            {/* Eyes */}
            <Animated.View
              style={[
                styles.eye,
                styles.eyeLeft,
                {
                  width: 16 * sizeMultiplier,
                  height: 16 * sizeMultiplier,
                  borderRadius: 8 * sizeMultiplier,
                  top: 6 * sizeMultiplier,
                  left: 3 * sizeMultiplier,
                },
                leftEyeStyle,
              ]}
            >
              <View
                style={[
                  styles.pupil,
                  {
                    width: 10 * sizeMultiplier,
                    height: 10 * sizeMultiplier,
                    borderRadius: 5 * sizeMultiplier,
                    top: 2 * sizeMultiplier,
                    left: 2 * sizeMultiplier,
                  },
                ]}
              />
              <View
                style={[
                  styles.eyeShine,
                  {
                    width: 4 * sizeMultiplier,
                    height: 4 * sizeMultiplier,
                    borderRadius: 2 * sizeMultiplier,
                    top: 2 * sizeMultiplier,
                    left: 2 * sizeMultiplier,
                  },
                ]}
              />
            </Animated.View>
            <Animated.View
              style={[
                styles.eye,
                styles.eyeRight,
                {
                  width: 16 * sizeMultiplier,
                  height: 16 * sizeMultiplier,
                  borderRadius: 8 * sizeMultiplier,
                  top: 6 * sizeMultiplier,
                  right: 3 * sizeMultiplier,
                },
                rightEyeStyle,
              ]}
            >
              <View
                style={[
                  styles.pupil,
                  {
                    width: 10 * sizeMultiplier,
                    height: 10 * sizeMultiplier,
                    borderRadius: 5 * sizeMultiplier,
                    top: 2 * sizeMultiplier,
                    left: 2 * sizeMultiplier,
                  },
                ]}
              />
              <View
                style={[
                  styles.eyeShine,
                  {
                    width: 4 * sizeMultiplier,
                    height: 4 * sizeMultiplier,
                    borderRadius: 2 * sizeMultiplier,
                    top: 2 * sizeMultiplier,
                    left: 2 * sizeMultiplier,
                  },
                ]}
              />
            </Animated.View>

            {/* Nose */}
            <View
              style={[
                styles.nose,
                {
                  width: 12 * sizeMultiplier,
                  height: 9 * sizeMultiplier,
                  borderRadius: 6 * sizeMultiplier,
                  bottom: 14 * sizeMultiplier,
                  left: 16.5 * sizeMultiplier,
                },
              ]}
            />

            {/* Smile - varies by mood */}
            {mood === 'happy' || mood === 'excited' || mood === 'celebrating' ? (
              <View
                style={[
                  styles.smileBig,
                  {
                    width: 20 * sizeMultiplier,
                    height: 10 * sizeMultiplier,
                    borderRadius: 10 * sizeMultiplier,
                    bottom: 4 * sizeMultiplier,
                    left: 12.5 * sizeMultiplier,
                  },
                ]}
              />
            ) : (
              <View
                style={[
                  styles.smile,
                  {
                    width: 18 * sizeMultiplier,
                    height: 8 * sizeMultiplier,
                    bottom: 5 * sizeMultiplier,
                    left: 13.5 * sizeMultiplier,
                  },
                ]}
              />
            )}
          </View>

          {/* PURPLE GLASSES - Pixel's signature look! */}
          <View
            style={[
              styles.glasses,
              {
                width: 60 * sizeMultiplier,
                height: 22 * sizeMultiplier,
                top: 18 * sizeMultiplier,
                left: 5 * sizeMultiplier,
              },
            ]}
          >
            {/* Left lens */}
            <View
              style={[
                styles.lens,
                {
                  width: 22 * sizeMultiplier,
                  height: 18 * sizeMultiplier,
                  borderRadius: 9 * sizeMultiplier,
                  left: 2 * sizeMultiplier,
                },
              ]}
            >
              <Animated.View style={[styles.lensGlint, glintStyle]} />
            </View>
            {/* Bridge */}
            <View
              style={[
                styles.bridge,
                {
                  width: 10 * sizeMultiplier,
                  height: 4 * sizeMultiplier,
                  top: 7 * sizeMultiplier,
                  left: 25 * sizeMultiplier,
                },
              ]}
            />
            {/* Right lens */}
            <View
              style={[
                styles.lens,
                {
                  width: 22 * sizeMultiplier,
                  height: 18 * sizeMultiplier,
                  borderRadius: 9 * sizeMultiplier,
                  right: 2 * sizeMultiplier,
                },
              ]}
            >
              <Animated.View style={[styles.lensGlint, glintStyle]} />
            </View>
          </View>

          {/* Cheeks */}
          <View
            style={[
              styles.cheek,
              styles.cheekLeft,
              {
                width: 14 * sizeMultiplier,
                height: 10 * sizeMultiplier,
                borderRadius: 7 * sizeMultiplier,
                bottom: 18 * sizeMultiplier,
                left: 2 * sizeMultiplier,
              },
            ]}
          />
          <View
            style={[
              styles.cheek,
              styles.cheekRight,
              {
                width: 14 * sizeMultiplier,
                height: 10 * sizeMultiplier,
                borderRadius: 7 * sizeMultiplier,
                bottom: 18 * sizeMultiplier,
                right: 2 * sizeMultiplier,
              },
            ]}
          />
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

export const PixelMascot = memo(PixelMascotComponent);

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  tail: {
    position: 'absolute',
    backgroundColor: COLORS.fur,
    transformOrigin: 'top center',
  },
  tailTip: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: COLORS.tailTip,
  },
  head: {
    position: 'absolute',
    top: 0,
    backgroundColor: COLORS.fur,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
    elevation: 3,
  },
  ear: {
    position: 'absolute',
    backgroundColor: COLORS.fur,
  },
  earLeft: {
    transform: [{ rotate: '-15deg' }],
  },
  earRight: {
    transform: [{ rotate: '15deg' }],
  },
  earInner: {
    position: 'absolute',
    backgroundColor: COLORS.earInner,
  },
  face: {
    position: 'absolute',
    backgroundColor: COLORS.face,
  },
  eye: {
    position: 'absolute',
    backgroundColor: COLORS.eyes,
    borderWidth: 1,
    borderColor: COLORS.fur,
  },
  eyeLeft: {},
  eyeRight: {},
  pupil: {
    position: 'absolute',
    backgroundColor: COLORS.pupil,
  },
  eyeShine: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  nose: {
    position: 'absolute',
    backgroundColor: COLORS.nose,
  },
  smile: {
    position: 'absolute',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.nose,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: 'transparent',
  },
  smileBig: {
    position: 'absolute',
    backgroundColor: COLORS.nose,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  cheek: {
    position: 'absolute',
    backgroundColor: COLORS.cheeks,
  },
  cheekLeft: {},
  cheekRight: {},
  // GLASSES - Pixel's signature!
  glasses: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  lens: {
    position: 'absolute',
    backgroundColor: COLORS.glasses + '40', // Semi-transparent
    borderWidth: 3,
    borderColor: COLORS.glassesFrame,
    top: 0,
  },
  lensGlint: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  bridge: {
    position: 'absolute',
    backgroundColor: COLORS.glassesFrame,
    borderRadius: 2,
  },
});
