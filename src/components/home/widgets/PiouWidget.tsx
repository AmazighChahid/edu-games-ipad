/**
 * PiouWidget - Mascot advice widget (blue)
 * Shows personalized advice from Piou the owl
 */

import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { PiouAdvice, WIDGET_COLORS } from '@/types/home.types';

interface PiouWidgetProps {
  advice: PiouAdvice;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Piou mascot component (owl)
const PiouMascot = memo(() => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.piouAvatar, animatedStyle]}>
      <LinearGradient
        colors={['#C9A86C', '#A68B5B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.piouBody}
      >
        {/* Belly */}
        <View style={styles.piouBelly} />
        {/* Eyes */}
        <View style={[styles.piouEye, styles.piouEyeLeft]}>
          <View style={styles.piouPupil} />
        </View>
        <View style={[styles.piouEye, styles.piouEyeRight]}>
          <View style={styles.piouPupil} />
        </View>
        {/* Beak */}
        <View style={styles.piouBeak} />
      </LinearGradient>
    </Animated.View>
  );
});

PiouMascot.displayName = 'PiouMascot';

// Action button
const ActionButton = memo(({ label, onPress }: { label: string; onPress: () => void }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.actionButton, animatedStyle]}
    >
      <Text style={styles.actionButtonIcon}>🎮</Text>
      <Text style={styles.actionButtonText}>{label}</Text>
    </AnimatedPressable>
  );
});

ActionButton.displayName = 'ActionButton';

export const PiouWidget = memo(({ advice }: PiouWidgetProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const handleActionPress = () => {
    if (advice.targetGameId) {
      router.push(`/(games)/${advice.targetGameId}` as any);
    }
  };

  // Parse message to highlight the highlighted part
  const renderMessage = () => {
    const parts = advice.message.split(advice.highlightedPart);
    if (parts.length === 2) {
      return (
        <Text style={styles.messageText}>
          {parts[0]}
          <Text style={styles.messageHighlight}>{advice.highlightedPart}</Text>
          {parts[1]}
        </Text>
      );
    }
    return <Text style={styles.messageText}>{advice.message}</Text>;
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
    >
      <LinearGradient
        colors={['rgba(91,141,238,0.95)', 'rgba(59,111,206,0.95)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Background icon */}
        <Text style={styles.bgIcon}>{WIDGET_COLORS.piou.bgIcon}</Text>

        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>✨ Piou conseille</Text>

          {/* Piou content */}
          <View style={styles.piouContent}>
            <PiouMascot />
            <View style={styles.messageContainer}>
              {renderMessage()}
              <ActionButton label={advice.actionLabel} onPress={handleActionPress} />
            </View>
          </View>
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );
});

PiouWidget.displayName = 'PiouWidget';

const styles = StyleSheet.create({
  container: {
    height: 140,
    borderRadius: 20,
    padding: 18,
    position: 'relative',
    overflow: 'hidden',
  },
  bgIcon: {
    position: 'absolute',
    top: '50%',
    right: -10,
    fontSize: 130,
    opacity: 0.15,
    transform: [{ translateY: -65 }],
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
  title: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  piouContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  // Piou mascot
  piouAvatar: {
    width: 60,
    height: 65,
  },
  piouBody: {
    width: 60,
    height: 65,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 27,
    borderBottomRightRadius: 27,
    position: 'relative',
  },
  piouBelly: {
    position: 'absolute',
    bottom: 5,
    left: '50%',
    marginLeft: -19,
    width: 38,
    height: 28,
    backgroundColor: '#F5E6D3',
    borderRadius: 19,
  },
  piouEye: {
    position: 'absolute',
    top: 14,
    width: 14,
    height: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
  },
  piouEyeLeft: {
    left: 8,
  },
  piouEyeRight: {
    right: 8,
  },
  piouPupil: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -3.5,
    marginLeft: -3.5,
    width: 7,
    height: 7,
    backgroundColor: '#2C1810',
    borderRadius: 3.5,
  },
  piouBeak: {
    position: 'absolute',
    top: 28,
    left: '50%',
    marginLeft: -7,
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFB347',
  },

  // Message
  messageContainer: {
    flex: 1,
    gap: 10,
  },
  messageText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 19,
  },
  messageHighlight: {
    fontFamily: 'Nunito_700Bold',
    color: '#FFFFFF',
  },

  // Action button
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  actionButtonIcon: {
    fontSize: 14,
  },
  actionButtonText: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 14,
    color: '#5B8DEE',
  },
});
