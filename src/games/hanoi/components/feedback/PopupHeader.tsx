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
              opacity: 0.3 + (index % 2) * 0.2,
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255, 215, 0, 0.6)', 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.rayGradient}
          />
        </View>
      ))}
    </Animated.View>
  );
}

function AnimatedStar({ index, filled }: { index: number; filled: boolean }) {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(-180);

  useEffect(() => {
    const delay = 500 + index * 200; // 500ms, 700ms, 900ms

    scale.value = withDelay(delay, withSpring(1, { damping: 8, stiffness: 200 }));
    rotation.value = withDelay(
      delay,
      withSequence(
        withTiming(15, { duration: 150 }),
        withTiming(-15, { duration: 150 }),
        withTiming(0, { duration: 150 })
      )
    );
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.Text style={[styles.star, animatedStyle]}>
      {filled ? '⭐' : '☆'}
    </Animated.Text>
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

        <View style={styles.starsContainer}>
          {[0, 1, 2].map((index) => (
            <AnimatedStar key={index} index={index} filled={index < stars} />
          ))}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 80,
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
    width: 8,
    height: 200,
    marginLeft: -4,
    transformOrigin: 'center top',
  },
  rayGradient: {
    flex: 1,
    borderRadius: 4,
  },
  title: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 15,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'Nunito-Regular',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
  },
  star: {
    fontSize: 42,
  },
});
