/**
 * PiouFloating - Piou volant avec bulle de dialogue
 * Animation de vol flottant + battement d'ailes
 */

import React, { memo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import {
  HomeV10Colors,
  HomeV10Layout,
  HomeV10Animations,
} from '../../theme/home-v10-colors';

interface PiouFloatingProps {
  message: string;
  highlightedPart?: string;
  actionLabel: string;
  onActionPress?: () => void;
  onPiouPress?: () => void;
}

// Piou Character Component - using Lottie animation
const PiouCharacter = memo(({ onPress }: { onPress?: () => void }) => {
  return (
    <Pressable onPress={onPress} style={styles.piouCharacter}>
      <LottieView
        source={require('../../../assets/animations/cute-owl.json')}
        style={styles.piouLottie}
        autoPlay
        loop
      />
    </Pressable>
  );
});

PiouCharacter.displayName = 'PiouCharacter';

// Bubble Component
const PiouBubble = memo(({
  message,
  highlightedPart,
  actionLabel,
  onActionPress,
}: Omit<PiouFloatingProps, 'onPiouPress'>) => {
  // Split message to highlight part if provided
  const renderMessage = () => {
    if (!highlightedPart) {
      return <Text style={styles.bubbleText}>{message}</Text>;
    }

    const parts = message.split(highlightedPart);
    return (
      <Text style={styles.bubbleText}>
        {parts[0]}
        <Text style={styles.bubbleHighlight}>{highlightedPart}</Text>
        {parts[1]}
      </Text>
    );
  };

  return (
    <View style={styles.bubble}>
      <View style={styles.bubbleArrow} />
      {renderMessage()}
      <Pressable
        onPress={onActionPress}
        style={({ pressed }) => [
          styles.bubbleButton,
          pressed && styles.bubbleButtonPressed,
        ]}
      >
        <LinearGradient
          colors={['#5B8DEE', '#4A7BD9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bubbleButtonGradient}
        >
          <Text style={styles.bubbleButtonIcon}>🏰</Text>
          <Text style={styles.bubbleButtonText}>{actionLabel}</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
});

PiouBubble.displayName = 'PiouBubble';

export const PiouFloating = memo(({
  message,
  highlightedPart,
  actionLabel,
  onActionPress,
  onPiouPress,
}: PiouFloatingProps) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(-2);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const duration = HomeV10Animations.piouFly / 4;

    // Floating animation
    translateX.value = withRepeat(
      withSequence(
        withTiming(12, { duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(4, { duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(-8, { duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    translateY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(-18, { duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(-6, { duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    rotate.value = withRepeat(
      withSequence(
        withTiming(2, { duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(-1, { duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(2, { duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(-2, { duration, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [reducedMotion, translateX, translateY, rotate]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <PiouCharacter onPress={onPiouPress} />
      <PiouBubble
        message={message}
        highlightedPart={highlightedPart}
        actionLabel={actionLabel}
        onActionPress={onActionPress}
      />
    </Animated.View>
  );
});

PiouFloating.displayName = 'PiouFloating';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },

  // Piou Character - Lottie animation
  piouCharacter: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  piouLottie: {
    width: 200,
    height: 200,
  },

  // Bubble
  bubble: {
    marginLeft: 25,
    backgroundColor: HomeV10Colors.bubbleBg,
    padding: 24,
    paddingRight: 32,
    borderRadius: 28,
    width: HomeV10Layout.bubbleWidth,
    boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.1)',
    elevation: 10,
  },
  bubbleArrow: {
    position: 'absolute',
    left: -14,
    top: '50%',
    marginTop: -14,
    width: 0,
    height: 0,
    borderTopWidth: 14,
    borderBottomWidth: 14,
    borderRightWidth: 14,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: HomeV10Colors.bubbleBg,
  },
  bubbleText: {
    fontSize: HomeV10Layout.bubbleTextSize,
    color: HomeV10Colors.textSecondary,
    lineHeight: 28,
    marginBottom: 18,
  },
  bubbleHighlight: {
    color: HomeV10Colors.textAccent,
    fontWeight: '700',
  },
  bubbleButton: {
    alignSelf: 'flex-start',
    borderRadius: 18,
    overflow: 'hidden',
    boxShadow: '0px 5px 20px rgba(91, 141, 238, 0.3)',
    elevation: 5,
  },
  bubbleButtonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  bubbleButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  bubbleButtonIcon: {
    fontSize: 17,
  },
  bubbleButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
