/**
 * GameCardV9 - Game card component for V9 home screen
 * Shows game with gradient background, icon, medal, and optional badge
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {
  GameV9,
  MedalType,
  BadgeType,
} from '@/types/home.types';

// Medal configurations with inline colors for type safety
const MEDAL_COLORS: Record<MedalType, { colors: readonly [string, string]; icon: string; label: string; textColor: string }> = {
  none: { colors: ['transparent', 'transparent'], icon: '', label: '', textColor: '' },
  bronze: { colors: ['#CD7F32', '#8B5A2B'], icon: '🥉', label: 'Bronze', textColor: '#FFFFFF' },
  silver: { colors: ['#C0C0C0', '#909090'], icon: '🥈', label: 'Argent', textColor: '#FFFFFF' },
  gold: { colors: ['#FFD700', '#FFA500'], icon: '🥇', label: 'Or', textColor: '#FFFFFF' },
  diamond: { colors: ['#B9F2FF', '#00CED1'], icon: '💎', label: 'Diamant', textColor: '#006666' },
};

// Game color configurations with inline colors for type safety
const GAME_COLORS: Record<string, readonly [string, string]> = {
  blue: ['#5B8DEE', '#3B6FCE'],
  purple: ['#9B59B6', '#8E44AD'],
  green: ['#27AE60', '#1E8449'],
  orange: ['#F39C12', '#D68910'],
  teal: ['#1ABC9C', '#16A085'],
  pink: ['#E91E63', '#C2185B'],
  indigo: ['#5C6BC0', '#3F51B5'],
  red: ['#E74C3C', '#C0392B'],
};

interface GameCardV9Props {
  game: GameV9;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Badge component
const Badge = memo(({ type }: { type: BadgeType }) => {
  const config = {
    new: { text: 'NOUVEAU', color: '#27AE60' },
    hot: { text: '🔥 HOT', color: '#E74C3C' },
    soon: { text: 'BIENTÔT', color: '#F39C12' },
  };

  const { text, color } = config[type];

  return (
    <View style={styles.badge}>
      <Text style={[styles.badgeText, { color }]}>{text}</Text>
    </View>
  );
});

Badge.displayName = 'Badge';

// Medal component
const Medal = memo(({ type }: { type: MedalType }) => {
  const config = MEDAL_COLORS[type];

  if (type === 'none') {
    return null;
  }

  return (
    <LinearGradient
      colors={[config.colors[0], config.colors[1]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.medal}
    >
      <Text style={styles.medalIcon}>{config.icon}</Text>
      <Text style={[styles.medalText, { color: config.textColor }]}>
        {config.label}
      </Text>
    </LinearGradient>
  );
});

Medal.displayName = 'Medal';

// Locked medal
const LockedMedal = memo(() => (
  <View style={styles.lockedMedal}>
    <Text style={styles.medalIcon}>🔒</Text>
    <Text style={styles.lockedMedalText}>Verrouillé</Text>
  </View>
));

LockedMedal.displayName = 'LockedMedal';

export const GameCardV9 = memo(({ game }: GameCardV9Props) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const iconScale = useSharedValue(1);

  const colors = GAME_COLORS[game.color] || GAME_COLORS.blue;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const handlePressIn = () => {
    if (game.isLocked) return;
    scale.value = withSpring(1.02, { damping: 15 });
    translateY.value = withSpring(-5, { damping: 15 });
    iconScale.value = withTiming(1.1, { duration: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
    translateY.value = withSpring(0, { damping: 15 });
    iconScale.value = withTiming(1, { duration: 200 });
  };

  const handlePress = () => {
    if (game.isLocked) return;
    router.push(`/(games)/${game.id}` as any);
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={game.isLocked}
      style={[styles.wrapper, animatedStyle]}
      accessibilityLabel={game.name}
      accessibilityRole="button"
      accessibilityState={{ disabled: game.isLocked }}
    >
      <LinearGradient
        colors={[colors[0], colors[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, game.isLocked && styles.containerLocked]}
      >
        {/* Badge if present */}
        {game.badge && <Badge type={game.badge} />}

        {/* Background icon */}
        <Animated.Text style={[styles.bgIcon, iconAnimatedStyle]}>
          {game.icon}
        </Animated.Text>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.gameName}>{game.name}</Text>
          {game.isLocked ? <LockedMedal /> : <Medal type={game.medal} />}
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );
});

GameCardV9.displayName = 'GameCardV9';

const styles = StyleSheet.create({
  wrapper: {
    minWidth: 200,
    height: 170,
    flexShrink: 0,
  },
  container: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  containerLocked: {
    opacity: 0.6,
  },

  // Badge
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
    zIndex: 3,
  },
  badgeText: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 10,
    textTransform: 'uppercase',
  },

  // Background icon
  bgIcon: {
    position: 'absolute',
    top: '50%',
    right: 0,
    fontSize: 120,
    opacity: 0.2,
    transform: [{ translateY: -60 }],
  },

  // Content
  content: {
    zIndex: 2,
    gap: 8,
  },
  gameName: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 17,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // Medal
  medal: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  medalIcon: {
    fontSize: 16,
  },
  medalText: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 13,
  },

  // Locked medal
  lockedMedal: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  lockedMedalText: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
