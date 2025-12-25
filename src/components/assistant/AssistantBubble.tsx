/**
 * AssistantBubble component
 * Displays assistant messages with character and speech bubble
 */

import { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';

import { colors, spacing, textStyles, borderRadius, shadows } from '@/theme';
import type { AssistantMessage, AssistantMood } from '@/types';

interface AssistantBubbleProps {
  message: AssistantMessage;
  mood: AssistantMood;
  onDismiss?: () => void;
}

const moodEmojis: Record<AssistantMood, string> = {
  neutral: '🦉',
  happy: '😊',
  encouraging: '💪',
  celebrating: '🎉',
  thinking: '🤔',
};

export function AssistantBubble({ message, mood, onDismiss }: AssistantBubbleProps) {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 15 });
    opacity.value = withSpring(1);

    if (message.duration > 0 && onDismiss) {
      const timer = setTimeout(() => {
        opacity.value = withSpring(0);
        translateY.value = withDelay(
          200,
          withSpring(100, {}, () => {
            runOnJS(onDismiss)();
          })
        );
      }, message.duration);

      return () => clearTimeout(timer);
    }
  }, [message, onDismiss, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    if (onDismiss) {
      opacity.value = withSpring(0);
      translateY.value = withSpring(100, {}, () => {
        runOnJS(onDismiss)();
      });
    }
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable onPress={handlePress} style={styles.content}>
        <View style={styles.character}>
          <Text style={styles.emoji}>{moodEmojis[mood]}</Text>
        </View>
        <View style={styles.bubble}>
          <Text style={styles.message}>{message.text}</Text>
          <View style={styles.bubbleArrow} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing[6],
    left: spacing[6],
    right: spacing[6],
    zIndex: 100,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  character: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.assistant.character,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  emoji: {
    fontSize: 32,
  },
  bubble: {
    flex: 1,
    marginLeft: spacing[3],
    backgroundColor: colors.assistant.bubble,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    borderWidth: 2,
    borderColor: colors.assistant.bubbleBorder,
    ...shadows.md,
  },
  bubbleArrow: {
    position: 'absolute',
    left: -10,
    bottom: 16,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: 'transparent',
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: colors.assistant.bubble,
  },
  message: {
    ...textStyles.assistantMessage,
    color: colors.text.primary,
  },
});
