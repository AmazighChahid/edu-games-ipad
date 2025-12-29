/**
 * PixelWithBubble - Combined mascot and speech bubble component
 * Convenient wrapper for using Pixel with dialogue
 * Uses MascotBubble from Design System for consistent UI
 */

import React, { memo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

import { PixelMood, WorldTheme } from '../../types';
import { PixelMascot } from './PixelMascot';
import { MascotBubble } from '@/components/common/MascotBubble';

// ============================================================================
// TYPES
// ============================================================================

interface PixelWithBubbleProps {
  message: string;
  mood?: PixelMood;
  theme?: WorldTheme;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  onPress?: () => void;
  showSkip?: boolean;
  layout?: 'horizontal' | 'vertical';
}

// ============================================================================
// PIXEL WITH BUBBLE COMPONENT
// ============================================================================

function PixelWithBubbleComponent({
  message,
  mood = 'neutral',
  theme = 'forest',
  size = 'medium',
  animated = true,
  onPress,
  showSkip = false,
  layout = 'horizontal',
}: PixelWithBubbleProps) {
  const isHorizontal = layout === 'horizontal';

  return (
    <Animated.View
      entering={animated ? FadeIn.duration(300) : undefined}
      exiting={animated ? FadeOut.duration(200) : undefined}
      style={[
        styles.container,
        isHorizontal ? styles.horizontal : styles.vertical,
      ]}
    >
      {/* Mascot */}
      <View style={styles.mascotContainer}>
        <PixelMascot
          mood={mood}
          size={size}
          animated={animated}
        />
      </View>

      {/* MascotBubble from Design System */}
      <View style={styles.bubbleContainer}>
        <MascotBubble
          message={message}
          buttonText={showSkip ? 'Continuer' : undefined}
          onPress={onPress}
          tailPosition={isHorizontal ? 'left' : 'top'}
          showDecorations={false}
          disableEnterAnimation={!animated}
        />
      </View>
    </Animated.View>
  );
}

export const PixelWithBubble = memo(PixelWithBubbleComponent);

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  vertical: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  mascotContainer: {
    flexShrink: 0,
  },
  bubbleContainer: {
    flex: 1,
  },
});
