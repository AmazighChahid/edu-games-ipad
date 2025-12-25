/**
 * Bulle de dialogue de l'assistant
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { Colors, Layout, Typography } from '../../constants';

interface SpeechBubbleProps {
  message: string;
  visible: boolean;
  onDismiss?: () => void;
  position?: 'top' | 'bottom';
  autoHide?: boolean;
  autoHideDelay?: number;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  message,
  visible,
  onDismiss,
  position = 'top',
  autoHide = true,
  autoHideDelay = 5000,
}) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 12, stiffness: 100 });

      if (autoHide && onDismiss) {
        const timer = setTimeout(onDismiss, autoHideDelay);
        return () => clearTimeout(timer);
      }
    } else {
      scale.value = withSpring(0);
    }
  }, [visible, autoHide, autoHideDelay, onDismiss]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        position === 'bottom' ? styles.containerBottom : styles.containerTop,
        animatedStyle,
      ]}
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
    >
      <Pressable
        style={styles.bubble}
        onPress={onDismiss}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={message}
        accessibilityHint="Tapez pour fermer"
      >
        <Text style={styles.message}>{message}</Text>
      </Pressable>

      {/* Flèche pointant vers le personnage */}
      <View
        style={[
          styles.arrow,
          position === 'bottom' ? styles.arrowTop : styles.arrowBottom,
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 100,
  },
  containerTop: {
    bottom: '100%',
    marginBottom: Layout.spacing.md,
  },
  containerBottom: {
    top: '100%',
    marginTop: Layout.spacing.md,
  },
  bubble: {
    backgroundColor: Colors.neutral.surface,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    maxWidth: 280,
    ...Layout.shadow.medium,
  },
  message: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral.text,
    textAlign: 'center',
    lineHeight: Typography.sizes.sm * Typography.lineHeights.relaxed,
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  arrowBottom: {
    borderTopWidth: 10,
    borderTopColor: Colors.neutral.surface,
  },
  arrowTop: {
    borderBottomWidth: 10,
    borderBottomColor: Colors.neutral.surface,
  },
});
