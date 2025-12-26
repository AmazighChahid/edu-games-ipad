/**
 * GameCardV10 - Carte de jeu pour l'écran d'accueil V10
 * Design avec gradient, icône de fond, médaille et badge
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  HomeV10Layout,
  gameCardGradients,
  medalGradients,
} from '@/theme/home-v10-colors';

type GameColor = keyof typeof gameCardGradients;
type MedalType = 'bronze' | 'silver' | 'gold' | 'diamond' | 'locked';

interface GameCardV10Props {
  name: string;
  icon: string;
  color: GameColor;
  medal: MedalType;
  badge?: 'new' | 'hot' | 'soon';
  isLocked?: boolean;
  onPress?: () => void;
}

const medalConfigs: Record<MedalType, { icon: string; label: string; textColor: string }> = {
  bronze: { icon: '🥉', label: 'Bronze', textColor: '#FFFFFF' },
  silver: { icon: '🥈', label: 'Argent', textColor: '#FFFFFF' },
  gold: { icon: '🥇', label: 'Or', textColor: '#FFFFFF' },
  diamond: { icon: '💎', label: 'Diamant', textColor: '#006666' },
  locked: { icon: '🔒', label: 'Verrouillé', textColor: 'rgba(255,255,255,0.8)' },
};

const badgeConfigs = {
  new: { label: 'Nouveau', color: '#27AE60' },
  hot: { label: '🔥 Hot', color: '#E74C3C' },
  soon: { label: 'Bientôt', color: '#F39C12' },
};

// Medal Badge Component
const MedalBadge = memo(({ type }: { type: MedalType }) => {
  const config = medalConfigs[type];
  const colors = medalGradients[type];

  return (
    <View style={styles.medalBadge}>
      <LinearGradient
        colors={[...colors]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.medalGradient}
      >
        <Text style={styles.medalIcon}>{config.icon}</Text>
        <Text style={[styles.medalLabel, { color: config.textColor }]}>
          {config.label}
        </Text>
      </LinearGradient>
    </View>
  );
});

MedalBadge.displayName = 'MedalBadge';

// Game Badge Component
const GameBadge = memo(({ type }: { type: 'new' | 'hot' | 'soon' }) => {
  const config = badgeConfigs[type];

  return (
    <View style={styles.gameBadge}>
      <Text style={[styles.gameBadgeText, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
});

GameBadge.displayName = 'GameBadge';

export const GameCardV10 = memo(({
  name,
  icon,
  color,
  medal,
  badge,
  isLocked = false,
  onPress,
}: GameCardV10Props) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const colors = gameCardGradients[color] || gameCardGradients.blue;

  const handlePressIn = () => {
    if (isLocked) return;
    scale.value = withTiming(1.03, { duration: 150, easing: Easing.out(Easing.ease) });
    translateY.value = withTiming(-10, { duration: 150, easing: Easing.out(Easing.ease) });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) });
    translateY.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.ease) });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Pressable
      onPress={isLocked ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isLocked}
    >
      <Animated.View style={[styles.container, isLocked && styles.locked, animatedStyle]}>
        <LinearGradient
          colors={[...colors]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Badge (if any) */}
          {badge && <GameBadge type={badge} />}

          {/* Background Icon */}
          <Text style={styles.bgIcon}>{icon}</Text>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.gameName}>{name}</Text>
            <MedalBadge type={medal} />
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
});

GameCardV10.displayName = 'GameCardV10';

const styles = StyleSheet.create({
  container: {
    width: HomeV10Layout.gameCardWidth,
    height: HomeV10Layout.gameCardHeight,
    borderRadius: HomeV10Layout.gameCardBorderRadius,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 10,
  },
  locked: {
    opacity: 0.55,
  },
  gradient: {
    flex: 1,
    padding: HomeV10Layout.gameCardPadding,
    justifyContent: 'flex-end',
  },

  // Background Icon
  bgIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -50,
    marginLeft: -50,
    fontSize: 100,
    opacity: 0.15,
  },

  // Content
  content: {
    zIndex: 2,
  },
  gameName: {
    fontSize: HomeV10Layout.gameTitleSize,
    fontWeight: '400',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 14,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },

  // Medal Badge
  medalBadge: {
    alignSelf: 'flex-start',
    borderRadius: 18,
    overflow: 'hidden',
  },
  medalGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  medalIcon: {
    fontSize: 20,
  },
  medalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Game Badge
  gameBadge: {
    position: 'absolute',
    top: 18,
    left: 18,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    zIndex: 3,
  },
  gameBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
