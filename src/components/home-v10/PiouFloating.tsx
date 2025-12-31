/**
 * PiouFloating - Piou volant avec bulle de dialogue style panneau bois
 * Animation de vol flottant + battement d'ailes
 */

import React, { memo, useEffect } from 'react';
import {
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
import {
  HomeV10Layout,
  HomeV10Animations,
} from '../../theme/home-v10-colors';
import LottieView from 'lottie-react-native';
import { MascotBubble, bubbleTextStyles } from '../common';

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

  // Build message with highlight if provided
  const renderMessage = () => {
    if (!highlightedPart) {
      return message;
    }

    const parts = message.split(highlightedPart);
    return (
      <>
        {parts[0]}
        <Text style={bubbleTextStyles.highlightOrange}>{highlightedPart}</Text>
        {parts[1]}
      </>
    );
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <PiouCharacter onPress={onPiouPress} />
      <MascotBubble
        message={renderMessage()}
        buttonText={actionLabel}
        buttonIcon="🏰"
        onPress={onActionPress || (() => {})}
        buttonVariant="blue"
        showDecorations={true}
        showSparkles={false}
        tailPosition="left"
        maxWidth={HomeV10Layout.bubbleWidth}
        style={styles.bubble}
        disableEnterAnimation={true}
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

  // MascotBubble positioning
  bubble: {
    marginLeft: 10,
  },
});
