/**
 * CollectionFloating - Collection de cartes flottante avec sparkles
 * Animation flottante + effet d'éventail sur hover
 */

import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  HomeV10Layout,
  HomeV10ZIndex,
  HomeV10Animations,
} from '@/theme/home-v10-colors';

interface CollectionFloatingProps {
  cardCount: number;
  cardEmojis?: [string, string, string];
  onPress?: () => void;
}

// Sparkle Component
const Sparkle = memo(({ emoji, delay, position }: {
  emoji: string;
  delay: number;
  position: { top?: number; bottom?: number; left?: number; right?: number };
}) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const translateY = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const duration = HomeV10Animations.sparkleFloat / 2;

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration }),
          withTiming(0, { duration })
        ),
        -1,
        false
      )
    );

    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.3, { duration }),
          withTiming(0.5, { duration })
        ),
        -1,
        false
      )
    );

    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-12, { duration }),
          withTiming(0, { duration })
        ),
        -1,
        false
      )
    );
  }, [reducedMotion, delay, opacity, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View style={[styles.sparkle, position, animatedStyle]}>
      <Text style={styles.sparkleEmoji}>{emoji}</Text>
    </Animated.View>
  );
});

Sparkle.displayName = 'Sparkle';

// Mini Card Component
const MiniCard = memo(({
  emoji,
  colors,
  style,
}: {
  emoji: string;
  colors: readonly [string, string];
  style: object;
}) => {
  return (
    <View style={[styles.miniCard, style]}>
      <LinearGradient
        colors={[...colors]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.miniCardGradient}
      >
        <Text style={styles.miniCardEmoji}>{emoji}</Text>
      </LinearGradient>
    </View>
  );
});

MiniCard.displayName = 'MiniCard';

export const CollectionFloating = memo(({
  cardCount,
  cardEmojis = ['🦊', '🦁', '🐼'],
  onPress,
}: CollectionFloatingProps) => {
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(-1);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const duration = HomeV10Animations.collectionFloat / 2;

    translateY.value = withRepeat(
      withSequence(
        withTiming(-20, { duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    rotate.value = withRepeat(
      withSequence(
        withTiming(2, { duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(-1, { duration, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [reducedMotion, translateY, rotate]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.pressable,
          pressed && styles.pressed,
        ]}
      >
        {/* Sparkles */}
        <View style={styles.sparklesContainer}>
          <Sparkle emoji="✨" delay={0} position={{ top: 0, left: '20%' }} />
          <Sparkle emoji="⭐" delay={800} position={{ top: '25%', right: 0 }} />
          <Sparkle emoji="✨" delay={1500} position={{ bottom: '20%', left: -5 }} />
          <Sparkle emoji="🫧" delay={2200} position={{ bottom: 5, right: '25%' }} />
        </View>

        {/* Cards Stack */}
        <View style={styles.cardsContainer}>
          <MiniCard
            emoji={cardEmojis[0]}
            colors={['#FFD93D', '#F5C800']}
            style={styles.card1}
          />
          <MiniCard
            emoji={cardEmojis[1]}
            colors={['#FF6B6B', '#EE5A5A']}
            style={styles.card2}
          />
          <MiniCard
            emoji={cardEmojis[2]}
            colors={['#5B8DEE', '#4A7BD9']}
            style={styles.card3}
          />

          {/* Badge */}
          <View style={styles.badge}>
            <LinearGradient
              colors={['#9B59B6', '#8E44AD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.badgeGradient}
            >
              <Text style={styles.badgeText}>{cardCount}</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Shadow */}
        <View style={styles.shadow} />
      </Pressable>
    </Animated.View>
  );
});

CollectionFloating.displayName = 'CollectionFloating';

const styles = StyleSheet.create({
  container: {
    marginRight: 60,
  },
  pressable: {
    alignItems: 'center',
  },
  pressed: {
    transform: [{ scale: 1.12 }],
  },

  // Sparkles
  sparklesContainer: {
    position: 'absolute',
    top: -35,
    left: -35,
    right: -35,
    bottom: -35,
    pointerEvents: 'none',
  },
  sparkle: {
    position: 'absolute',
  },
  sparkleEmoji: {
    fontSize: 18,
  },

  // Cards
  cardsContainer: {
    width: 150,
    height: 110,
    position: 'relative',
  },
  miniCard: {
    position: 'absolute',
    width: HomeV10Layout.miniCardWidth,
    height: HomeV10Layout.miniCardHeight,
    borderRadius: 14,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 8,
    overflow: 'hidden',
  },
  miniCardGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniCardEmoji: {
    fontSize: 36,
  },
  card1: {
    bottom: 0,
    left: 0,
    transform: [{ rotate: '-18deg' }],
    zIndex: 1,
  },
  card2: {
    bottom: 10,
    left: 38,
    transform: [{ rotate: '-2deg' }],
    zIndex: 2,
  },
  card3: {
    bottom: 18,
    left: 72,
    transform: [{ rotate: '14deg' }],
    zIndex: 3,
  },

  // Badge
  badge: {
    position: 'absolute',
    top: -12,
    right: -12,
    width: HomeV10Layout.badgeSize,
    height: HomeV10Layout.badgeSize,
    borderRadius: HomeV10Layout.badgeSize / 2,
    borderWidth: 4,
    borderColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#9B59B6',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 10,
    zIndex: 10,
  },
  badgeGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  // Shadow
  shadow: {
    position: 'absolute',
    bottom: -25,
    left: '50%',
    marginLeft: -55,
    width: 110,
    height: 22,
    backgroundColor: 'rgba(0,0,0,0.12)',
    borderRadius: 55,
  },
});
