/**
 * HanoiMascot
 * Mascotte Piou le Hibou pour Tour de Hanoï
 *
 * Combine :
 * - Animation Lottie du hibou (cute-owl.json)
 * - MascotBubble standard pour la bulle de dialogue
 *
 * @see MascotBubble dans @/components/common pour le style bois
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { MascotBubble } from '../../../components/common';
import { spacing } from '../../../theme';
import type { EmotionType } from '../hooks/useHanoiIntro';

// ============================================
// TYPES
// ============================================

interface HanoiMascotProps {
  /** Message to display in the bubble */
  message: string;
  /** Emotion affects bubble styling */
  emotion?: EmotionType;
  /** Whether the mascot is visible */
  visible?: boolean;
  /** Whether to show typing animation */
  typing?: boolean;
  /** Callback when typing animation completes */
  onTypingComplete?: () => void;
}

// ============================================
// COMPONENT
// ============================================

export function HanoiMascot({
  message,
  emotion = 'neutral',
  visible = true,
  typing = true,
  onTypingComplete,
}: HanoiMascotProps) {
  // Animation for visibility
  const bubbleScale = useSharedValue(visible ? 1 : 0);

  React.useEffect(() => {
    if (visible) {
      bubbleScale.value = withSpring(1, { damping: 18, stiffness: 150 });
    } else {
      bubbleScale.value = withTiming(0, { duration: 200 });
    }
  }, [visible, bubbleScale]);

  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bubbleScale.value }],
    opacity: bubbleScale.value,
  }));

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {/* Owl Lottie animation */}
      <View style={styles.owlContainer}>
        <LottieView
          source={require('../../../../assets/animations/cute-owl.json')}
          style={styles.lottie}
          autoPlay
          loop
        />
      </View>

      {/* Speech bubble using MascotBubble */}
      <Animated.View style={[styles.bubbleWrapper, bubbleStyle]}>
        <MascotBubble
          message={message}
          typing={typing}
          typingSpeed={30}
          onTypingComplete={onTypingComplete}
          tailPosition="left"
          hideTail={false}
          showDecorations
          maxWidth={400}
          disableEnterAnimation
        />
      </Animated.View>
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    gap: spacing[3],
  },

  // Owl Lottie container
  owlContainer: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: 180,
    height: 180,
  },

  // Bubble wrapper for animation
  bubbleWrapper: {
    flex: 1,
    maxWidth: 420,
  },
});

export default HanoiMascot;
