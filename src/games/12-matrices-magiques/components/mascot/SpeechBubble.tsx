/**
 * SpeechBubble - Dialogue bubble for Pixel mascot
 * Animated pop-in with arrow pointing to mascot
 */

import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  FadeIn,
  FadeOut,
  SlideInLeft,
} from 'react-native-reanimated';

import { WorldTheme } from '../../types';
import { WORLDS } from '../../data';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================================================
// TYPES
// ============================================================================

interface SpeechBubbleProps {
  message: string;
  theme?: WorldTheme;
  isVisible?: boolean;
  onPress?: () => void;
  showSkip?: boolean;
  position?: 'left' | 'right' | 'center';
  maxWidth?: number;
}

// ============================================================================
// SPEECH BUBBLE COMPONENT
// ============================================================================

function SpeechBubbleComponent({
  message,
  theme = 'forest',
  isVisible = true,
  onPress,
  showSkip = false,
  position = 'right',
  maxWidth = SCREEN_WIDTH - 120,
}: SpeechBubbleProps) {
  const world = WORLDS[theme];

  // Animation values
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSequence(
        withSpring(1.05, { damping: 10, stiffness: 150 }),
        withSpring(1, { damping: 12, stiffness: 100 })
      );
    } else {
      opacity.value = withTiming(0, { duration: 150 });
      scale.value = withTiming(0.9, { duration: 150 });
    }
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  // Arrow position styles
  const getArrowStyle = () => {
    switch (position) {
      case 'left':
        return styles.arrowRight;
      case 'center':
        return styles.arrowBottom;
      default:
        return styles.arrowLeft;
    }
  };

  if (!isVisible) return null;

  const content = (
    <Animated.View
      style={[
        styles.container,
        { maxWidth },
        animatedStyle,
      ]}
    >
      {/* Main bubble */}
      <View style={[styles.bubble, { borderColor: world.primaryColor + '30' }]}>
        {/* Arrow */}
        <View style={[styles.arrow, getArrowStyle()]} />
        <View style={[styles.arrowInner, getArrowStyle()]} />

        {/* Message text */}
        <Text style={styles.message}>
          <Text style={[styles.mascotName, { color: world.primaryColor }]}>
            Pixel :{' '}
          </Text>
          {message}
        </Text>

        {/* Skip hint */}
        {showSkip && (
          <Text style={styles.skipHint}>Appuie pour continuer</Text>
        )}
      </View>
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={styles.pressable}>
        {content}
      </Pressable>
    );
  }

  return content;
}

export const SpeechBubble = memo(SpeechBubbleComponent);

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  pressable: {
    flexShrink: 1,
  },
  container: {
    flexShrink: 1,
  },
  bubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    paddingLeft: 18,
    paddingRight: 18,
    position: 'relative',
    borderWidth: 2,
    // Shadow
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    elevation: 5,
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
  },
  arrowInner: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
  },
  arrowLeft: {
    left: -12,
    top: 20,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderRightWidth: 14,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#FFFFFF',
  },
  arrowRight: {
    right: -12,
    top: 20,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 14,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#FFFFFF',
  },
  arrowBottom: {
    left: '50%',
    bottom: -14,
    marginLeft: -10,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4A4A4A',
    fontFamily: 'Nunito-Regular',
  },
  mascotName: {
    fontWeight: '700',
    fontFamily: 'Nunito-Bold',
  },
  skipHint: {
    marginTop: 8,
    fontSize: 12,
    color: '#9E9E9E',
    textAlign: 'center',
    fontFamily: 'Nunito-Regular',
    fontStyle: 'italic',
  },
});
