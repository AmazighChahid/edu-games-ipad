/**
 * MascotOwl component
 * Animated owl mascot "Piou" with speech bubble using Lottie animation
 * Provides contextual messages during gameplay
 */

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import LottieView from 'lottie-react-native';

import { spacing, borderRadius, shadows } from '../../../theme';

type MessageType = 'intro' | 'hint' | 'error' | 'encourage' | 'victory';

interface MascotOwlProps {
  message: string;
  messageType?: MessageType;
  visible?: boolean;
}

// Message type to color mapping
const MESSAGE_COLORS: Record<MessageType, string> = {
  intro: '#4A4A4A',
  hint: '#5B8DEE',
  error: '#E67E22',
  encourage: '#7BC74D',
  victory: '#FFD700',
};

export function MascotOwl({
  message,
  messageType = 'intro',
  visible = true,
}: MascotOwlProps) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [displayedText, setDisplayedText] = useState('');

  // Animation values
  const bubbleScale = useSharedValue(0);

  // Bubble appearance animation - reduced pop effect
  useEffect(() => {
    if (visible) {
      bubbleScale.value = withSpring(1, { damping: 18, stiffness: 150 });
    } else {
      bubbleScale.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  // Streaming text effect - like LLM typing
  useEffect(() => {
    if (message === currentMessage) return; // Don't retype same message

    setCurrentMessage(message);
    setDisplayedText(''); // Reset displayed text

    let currentIndex = 0;
    const typingSpeed = 30; // ms per character (adjust for speed)

    const interval = setInterval(() => {
      if (currentIndex < message.length) {
        setDisplayedText(message.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [message]);

  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bubbleScale.value }],
    opacity: bubbleScale.value,
  }));

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {/* Owl Lottie animation - à gauche */}
      <View style={styles.owl}>
        <LottieView
          source={require('../../../../assets/animations/cute-owl.json')}
          style={styles.lottie}
          autoPlay
          loop
        />
      </View>

      {/* Speech bubble - à droite du hibou */}
      <Animated.View style={[styles.speechBubble, bubbleStyle]}>
        <View style={styles.bubbleArrowLeft} />
        <Text style={[styles.bubbleName, { color: MESSAGE_COLORS[messageType] }]}>
          Piou le Hibou :
        </Text>
        <Text style={styles.bubbleText}>{displayedText}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },

  // Owl Lottie container - taille doublée
  owl: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: 200,
    height: 200,
  },

  // Speech bubble - à droite du hibou
  speechBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing[5],
    paddingLeft: spacing[6],
    maxWidth: 450,
    minWidth: 350,
    minHeight: 90,
    ...shadows.lg,
    position: 'relative',
  },
  bubbleName: {
    fontSize: 14,
    fontFamily: 'Fredoka_600SemiBold',
    fontWeight: '700',
    marginBottom: spacing[1],
  },
  bubbleText: {
    fontSize: 18,
    fontFamily: 'Fredoka_500Medium',
    color: '#4A4A4A',
    lineHeight: 26,
  },
  bubbleArrowLeft: {
    position: 'absolute',
    left: -10,
    top: '50%',
    marginTop: -12,
    width: 0,
    height: 0,
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderRightWidth: 12,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#FFFFFF',
  },
});
