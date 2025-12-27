/**
 * PopupHeader Component
 * Golden header with rotating ray burst and stars
 */

import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSequence,
  withSpring,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface PopupHeaderProps {
  stars: number; // 0-3
}

function RotatingRays() {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    // Continuous rotation
    rotation.value = withRepeat(
      withTiming(360, { duration: 8000, easing: Easing.linear }),
      -1,
      false
    );

    // Initial scale animation
    scale.value = withSequence(
      withTiming(1.2, { duration: 400, easing: Easing.out(Easing.back(1.5)) }),
      withTiming(1, { duration: 300 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
  }));

  // Create 12 rays at 30° intervals
  const rays = Array.from({ length: 12 }, (_, i) => i * 30);

  return (
    <Animated.View style={[styles.raysContainer, animatedStyle]}>
      {rays.map((angle, index) => (
        <View
          key={index}
          style={[
            styles.ray,
            {
              transform: [{ rotate: `${angle}deg` }],
              opacity: 0.2 + (index % 2) * 0.1,
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.3)', 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.rayGradient}
          />
        </View>
      ))}
    </Animated.View>
  );
}

export function PopupHeader({ stars }: PopupHeaderProps) {
  const titleScale = useSharedValue(0);

  useEffect(() => {
    // Title bounce animation (300ms delay)
    titleScale.value = withDelay(
      300,
      withSequence(
        withTiming(1.2, { duration: 150 }),
        withTiming(0.9, { duration: 100 }),
        withTiming(1, { duration: 100 })
      )
    );
  }, []);

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
  }));

  return (
    <LinearGradient
      colors={['#FFD93D', '#FFB347']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <RotatingRays />

      <View style={styles.content}>
        <Animated.Text style={[styles.title, titleAnimatedStyle]}>
          🎉 BRAVO ! 🎉
        </Animated.Text>
        <Text style={styles.subtitle}>Tu as résolu le puzzle !</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 60,
    position: 'relative',
    overflow: 'hidden',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  content: {
    position: 'relative',
    zIndex: 2,
    alignItems: 'center',
  },
  raysContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 400,
    height: 400,
    marginLeft: -200,
    marginTop: -200,
    zIndex: 1,
  },
  ray: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 4,
    height: 200,
    marginLeft: -2,
    transformOrigin: 'center top',
  },
  rayGradient: {
    flex: 1,
    borderRadius: 2,
  },
  title: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 15,
  },
  subtitle: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'Nunito-Regular',
  },
});
