import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TEXT_STYLES, TYPOGRAPHY } from '../../constants/typography';

interface MascotBubbleProps {
  message: string;
  position?: 'top-right' | 'top-left';
  onDismiss?: () => void;
}

export const MascotBubble: React.FC<MascotBubbleProps> = ({
  message,
  position = 'top-right',
  onDismiss,
}) => {
  // Animation de la bulle (apparition)
  const bubbleScale = useSharedValue(0);
  const bubbleOpacity = useSharedValue(0);

  // Animation du hibou (flottement)
  const owlTranslateY = useSharedValue(0);

  // Animation des yeux (clignement)
  const eyeScaleY = useSharedValue(1);

  useEffect(() => {
    // Apparition de la bulle
    bubbleScale.value = withSpring(1, { damping: 12, stiffness: 180 });
    bubbleOpacity.value = withTiming(1, { duration: 300 });

    // Flottement du hibou
    owlTranslateY.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Clignement des yeux toutes les 4 secondes
    const blinkInterval = setInterval(() => {
      eyeScaleY.value = withSequence(
        withTiming(0.1, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
    }, 4000);

    return () => clearInterval(blinkInterval);
  }, []);

  const bubbleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bubbleScale.value }],
    opacity: bubbleOpacity.value,
  }));

  const owlAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: owlTranslateY.value }],
  }));

  const eyeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: eyeScaleY.value }],
  }));

  const positionStyle = position === 'top-right'
    ? { top: 140, right: 60 }
    : { top: 140, left: 60 };

  return (
    <View style={[styles.container, positionStyle]}>
      {/* Bulle de dialogue */}
      <Animated.View style={[styles.bubble, bubbleAnimatedStyle]}>
        <Pressable
          onPress={onDismiss}
          accessible
          accessibilityLabel={`Message du hibou: ${message}`}
          accessibilityRole={onDismiss ? 'button' : 'text'}
        >
          <Text style={styles.bubbleText}>{message}</Text>
        </Pressable>
      </Animated.View>

      {/* Hibou */}
      <Animated.View style={[styles.owlContainer, owlAnimatedStyle]}>
        <View style={styles.owl}>
          {/* Yeux */}
          <Animated.View style={[styles.eye, styles.eyeLeft, eyeAnimatedStyle]}>
            <View style={styles.pupil} />
          </Animated.View>
          <Animated.View style={[styles.eye, styles.eyeRight, eyeAnimatedStyle]}>
            <View style={styles.pupil} />
          </Animated.View>

          {/* Bec */}
          <View style={styles.beak} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 25,
    alignItems: 'flex-end',
  },
  bubble: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.xl,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sizeXl,
    maxWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 10,
    position: 'relative',
  },
  bubbleText: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textDark,
  },
  owlContainer: {
    marginLeft: 20,
  },
  owl: {
    width: SPACING.owlSmallWidth,
    height: SPACING.owlSmallHeight,
    backgroundColor: COLORS.owlBrown,
    borderBottomLeftRadius: SPACING.owlSmallWidth * 0.45,
    borderBottomRightRadius: SPACING.owlSmallWidth * 0.45,
    borderTopLeftRadius: SPACING.owlSmallWidth * 0.5,
    borderTopRightRadius: SPACING.owlSmallWidth * 0.5,
    position: 'relative',
    shadowColor: COLORS.owlBrownDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  eye: {
    position: 'absolute',
    top: 15,
    width: 18,
    height: 18,
    backgroundColor: COLORS.owlEye,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeLeft: {
    left: 10,
  },
  eyeRight: {
    right: 10,
  },
  pupil: {
    width: 9,
    height: 9,
    backgroundColor: COLORS.owlPupil,
    borderRadius: 4.5,
  },
  beak: {
    position: 'absolute',
    top: 35,
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.owlBeak,
  },
});
