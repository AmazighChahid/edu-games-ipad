/**
 * SpeechBubble Component
 *
 * Bulle de dialogue réutilisable pour Plume le Hibou
 * Avec animation d'apparition et effet de "typing"
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { spacing, borderRadius, shadows, fontFamily } from '@/theme';

type TailPosition = 'bottom' | 'bottom-left' | 'bottom-right' | 'left' | 'right';

interface SpeechBubbleProps {
  message: string;
  visible?: boolean;
  tailPosition?: TailPosition;
  typing?: boolean;
  typingSpeed?: number;
  maxWidth?: number;
  style?: ViewStyle;
  onTypingComplete?: () => void;
}

// Couleurs du thème Conteur Curieux
const CONTEUR_COLORS = {
  bubble: '#FFFFFF',
  text: '#2D3748',
  accent: '#9B59B6',
};

export function SpeechBubble({
  message,
  visible = true,
  tailPosition = 'bottom',
  typing = true,
  typingSpeed = 25,
  maxWidth = 280,
  style,
  onTypingComplete,
}: SpeechBubbleProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [lastMessage, setLastMessage] = useState('');

  // Animation values
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  // Bubble appearance animation
  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    } else {
      opacity.value = withTiming(0, { duration: 150 });
      scale.value = withTiming(0.8, { duration: 150 });
    }
  }, [visible]);

  // Typing effect
  useEffect(() => {
    if (!visible || message === lastMessage) return;

    setLastMessage(message);

    if (!typing) {
      setDisplayedText(message);
      onTypingComplete?.();
      return;
    }

    setDisplayedText('');
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < message.length) {
        setDisplayedText(message.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        onTypingComplete?.();
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [message, visible, typing, typingSpeed, lastMessage, onTypingComplete]);

  // Animated styles
  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  // Tail styles based on position
  const getTailStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      position: 'absolute',
      width: 0,
      height: 0,
      borderLeftWidth: 10,
      borderRightWidth: 10,
      borderTopWidth: 12,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: CONTEUR_COLORS.bubble,
    };

    switch (tailPosition) {
      case 'bottom':
        return { ...baseStyle, bottom: -10, left: '50%', marginLeft: -10 };
      case 'bottom-left':
        return { ...baseStyle, bottom: -10, left: 24 };
      case 'bottom-right':
        return { ...baseStyle, bottom: -10, right: 24 };
      case 'left':
        return {
          ...baseStyle,
          left: -10,
          top: '50%',
          marginTop: -10,
          transform: [{ rotate: '-90deg' }],
        };
      case 'right':
        return {
          ...baseStyle,
          right: -10,
          top: '50%',
          marginTop: -10,
          transform: [{ rotate: '90deg' }],
        };
      default:
        return baseStyle;
    }
  };

  return (
    <Animated.View style={[styles.container, { maxWidth }, bubbleStyle, style]}>
      <Text style={styles.text}>{displayedText}</Text>
      <View style={getTailStyle()} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: CONTEUR_COLORS.bubble,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    ...shadows.lg,
    // Shadow with purple tint for Conteur theme
    shadowColor: CONTEUR_COLORS.accent,
    shadowOpacity: 0.15,
  },
  text: {
    fontSize: 16,
    fontFamily: fontFamily.medium,
    color: CONTEUR_COLORS.text,
    lineHeight: 24,
  },
});

export default SpeechBubble;
