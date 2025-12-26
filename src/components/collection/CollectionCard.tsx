/**
 * CollectionCard Component
 * Individual card in the collection grid with locked/unlocked/new states
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Card, RARITY_CONFIG, CATEGORY_CONFIG } from '../../data/cards';
import { COLORS } from '@/constants/colors';

interface CollectionCardProps {
  card: Card;
  isUnlocked: boolean;
  isNew: boolean;
  onPress: () => void;
  index: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const CollectionCard: React.FC<CollectionCardProps> = ({
  card,
  isUnlocked,
  isNew,
  onPress,
  index,
}) => {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  // Animate glow for new cards
  React.useEffect(() => {
    if (isNew) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }
  }, [isNew]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const rarityConfig = RARITY_CONFIG[card.rarity];

  if (!isUnlocked) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.cardContainer, animatedStyle]}
      >
        <View style={styles.lockedCard}>
          <View style={styles.lockedContent}>
            <Text style={styles.lockIcon}>🔒</Text>
            <Text style={styles.lockText}>
              {card.unlockCondition.activity || '???'}
            </Text>
            {card.unlockCondition.level && (
              <Text style={styles.lockSubtext}>
                Niveau {card.unlockCondition.level}
              </Text>
            )}
          </View>
        </View>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.cardContainer, animatedStyle]}
    >
      {/* Glow effect for new cards */}
      {isNew && (
        <Animated.View style={[styles.glowEffect, glowStyle]}>
          <LinearGradient
            colors={['transparent', rarityConfig.color, 'transparent']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>
      )}

      {/* Card content */}
      <View style={[styles.unlockedCard, { borderColor: rarityConfig.color }]}>
        {/* NEW badge */}
        {isNew && (
          <Animated.View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW!</Text>
          </Animated.View>
        )}

        {/* Rarity badge */}
        <LinearGradient
          colors={rarityConfig.gradientColors}
          style={styles.rarityBadge}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[
            styles.rarityText,
            card.rarity === 'legendary' && styles.rarityTextDark
          ]}>
            {rarityConfig.label}
          </Text>
        </LinearGradient>

        {/* Card inner content */}
        <View style={styles.cardInner}>
          <Text style={styles.cardEmoji}>{card.emoji}</Text>
          <Text style={styles.cardName} numberOfLines={2}>
            {card.name}
          </Text>
          <View style={styles.traitBadge}>
            <Text style={styles.traitIcon}>
              {card.traits[0]?.split(' ')[0] || ''}
            </Text>
            <Text style={styles.traitText}>
              {card.traits[0]?.split(' ').slice(1).join(' ') || card.title}
            </Text>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    aspectRatio: 3 / 4,
    position: 'relative',
  },
  lockedCard: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#CBD5E0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 2,
  },
  lockedContent: {
    alignItems: 'center',
    gap: 6,
  },
  lockIcon: {
    fontSize: 36,
    opacity: 0.4,
  },
  lockText: {
    fontSize: 11,
    fontFamily: 'Nunito_600SemiBold',
    color: '#A0AEC0',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  lockSubtext: {
    fontSize: 10,
    fontFamily: 'Nunito_400Regular',
    color: '#A0AEC0',
    textAlign: 'center',
  },
  glowEffect: {
    position: 'absolute',
    inset: -6,
    borderRadius: 22,
    zIndex: -1,
  },
  unlockedCard: {
    flex: 1,
    backgroundColor: '#FFF9F0',
    borderRadius: 16,
    borderWidth: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 4,
  },
  newBadge: {
    position: 'absolute',
    top: -5,
    left: -5,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    transform: [{ rotate: '-15deg' }],
    zIndex: 10,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 3,
  },
  newBadgeText: {
    color: 'white',
    fontSize: 9,
    fontFamily: 'Fredoka_700Bold',
    letterSpacing: 0.5,
  },
  rarityBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 5,
  },
  rarityText: {
    color: 'white',
    fontSize: 9,
    fontFamily: 'Fredoka_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rarityTextDark: {
    color: '#4A4A4A',
  },
  cardInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    paddingTop: 28,
  },
  cardEmoji: {
    fontSize: 52,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  cardName: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 13,
    color: '#4A5568',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 6,
  },
  traitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(91, 141, 238, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  traitIcon: {
    fontSize: 12,
  },
  traitText: {
    fontSize: 10,
    fontFamily: 'Fredoka_600SemiBold',
    color: COLORS.primary,
  },
});

export default CollectionCard;
