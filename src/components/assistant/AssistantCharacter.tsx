/**
 * Mascotte Assistant
 * Personnage animé qui guide l'enfant
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Colors, Layout } from '../../constants';

interface AssistantCharacterProps {
  mood?: 'idle' | 'happy' | 'thinking' | 'encouraging';
  size?: 'small' | 'medium' | 'large';
}

export const AssistantCharacter: React.FC<AssistantCharacterProps> = ({
  mood = 'idle',
  size = 'medium',
}) => {
  // Animations
  const bounceY = useSharedValue(0);
  const eyeBlink = useSharedValue(1);
  const mouthScale = useSharedValue(1);
  const bodyRotate = useSharedValue(0);

  // Tailles
  const dimensions = {
    small: { body: 60, eye: 10, mouth: 15 },
    medium: { body: 80, eye: 14, mouth: 20 },
    large: { body: 120, eye: 20, mouth: 30 },
  }[size];

  useEffect(() => {
    // Animation de rebond idle
    bounceY.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Animation de clignement des yeux
    const blinkInterval = setInterval(() => {
      eyeBlink.value = withSequence(
        withTiming(0.1, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    // Réactions selon l'humeur
    switch (mood) {
      case 'happy':
        mouthScale.value = withSpring(1.3);
        bodyRotate.value = withSequence(
          withTiming(-5, { duration: 100 }),
          withTiming(5, { duration: 100 }),
          withTiming(0, { duration: 100 })
        );
        break;
      case 'thinking':
        bodyRotate.value = withTiming(10, { duration: 300 });
        break;
      case 'encouraging':
        bounceY.value = withSequence(
          withSpring(-15),
          withSpring(0)
        );
        break;
      default:
        mouthScale.value = withSpring(1);
        bodyRotate.value = withTiming(0);
    }
  }, [mood]);

  const bodyAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bounceY.value },
      { rotate: `${bodyRotate.value}deg` },
    ],
  }));

  const eyeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: eyeBlink.value }],
  }));

  const mouthAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: mouthScale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        { width: dimensions.body, height: dimensions.body },
        bodyAnimatedStyle,
      ]}
    >
      {/* Corps principal (cercle) */}
      <View
        style={[
          styles.body,
          { width: dimensions.body, height: dimensions.body, borderRadius: dimensions.body / 2 },
        ]}
      >
        {/* Yeux */}
        <View style={styles.eyesContainer}>
          <Animated.View
            style={[
              styles.eye,
              { width: dimensions.eye, height: dimensions.eye, borderRadius: dimensions.eye / 2 },
              eyeAnimatedStyle,
            ]}
          />
          <Animated.View
            style={[
              styles.eye,
              { width: dimensions.eye, height: dimensions.eye, borderRadius: dimensions.eye / 2 },
              eyeAnimatedStyle,
            ]}
          />
        </View>

        {/* Bouche */}
        <Animated.View
          style={[
            styles.mouth,
            {
              width: dimensions.mouth,
              height: dimensions.mouth / 2,
              borderBottomLeftRadius: dimensions.mouth / 2,
              borderBottomRightRadius: dimensions.mouth / 2,
            },
            mouthAnimatedStyle,
          ]}
        />

        {/* Joues (rougeurs) */}
        <View style={[styles.cheeksContainer, { top: dimensions.body * 0.45 }]}>
          <View
            style={[
              styles.cheek,
              { width: dimensions.eye * 0.8, height: dimensions.eye * 0.4, borderRadius: dimensions.eye * 0.4 },
            ]}
          />
          <View
            style={[
              styles.cheek,
              { width: dimensions.eye * 0.8, height: dimensions.eye * 0.4, borderRadius: dimensions.eye * 0.4 },
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    backgroundColor: Colors.primary.soft,
    alignItems: 'center',
    justifyContent: 'center',
    ...Layout.shadow.medium,
  },
  eyesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    position: 'absolute',
    top: '30%',
  },
  eye: {
    backgroundColor: Colors.neutral.text,
  },
  mouth: {
    backgroundColor: Colors.secondary.medium,
    position: 'absolute',
    bottom: '25%',
  },
  cheeksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    position: 'absolute',
  },
  cheek: {
    backgroundColor: Colors.secondary.soft,
    opacity: 0.6,
  },
});
