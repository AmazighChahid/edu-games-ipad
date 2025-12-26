/**
 * CollectibleCard Component
 *
 * Carte collectionnable avec animation flip 3D
 * Débloquée après avoir terminé une histoire
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { spacing, borderRadius, shadows, fontFamily } from '@/theme';
import type { StoryCollectible, CardRarity } from '../types';

interface CollectibleCardProps {
  /** Carte collectionnable */
  collectible: StoryCollectible;
  /** Afficher face cachée puis révéler */
  startFlipped?: boolean;
  /** Délai avant révélation (ms) */
  revealDelay?: number;
  /** Callback après révélation */
  onRevealed?: () => void;
  /** Taille de la carte */
  size?: 'small' | 'medium' | 'large';
}

// Couleurs par rareté
const RARITY_COLORS: Record<CardRarity, { bg: string; border: string; glow: string }> = {
  common: {
    bg: '#F8F9FA',
    border: '#CBD5E0',
    glow: '#A0AEC0',
  },
  rare: {
    bg: '#EBF8FF',
    border: '#4299E1',
    glow: '#3182CE',
  },
  epic: {
    bg: '#FAF5FF',
    border: '#9B59B6',
    glow: '#805AD5',
  },
  legendary: {
    bg: '#FFFBEB',
    border: '#F6AD55',
    glow: '#DD6B20',
  },
};

// Labels de rareté
const RARITY_LABELS: Record<CardRarity, string> = {
  common: 'Commune',
  rare: 'Rare',
  epic: 'Épique',
  legendary: 'Légendaire',
};

// Dimensions par taille
const SIZES = {
  small: { width: 120, height: 160 },
  medium: { width: 180, height: 240 },
  large: { width: 240, height: 320 },
};

export function CollectibleCard({
  collectible,
  startFlipped = true,
  revealDelay = 1000,
  onRevealed,
  size = 'medium',
}: CollectibleCardProps) {
  const [isFlipped, setIsFlipped] = useState(startFlipped);
  const rotateY = useSharedValue(startFlipped ? 180 : 0);
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  const colors = RARITY_COLORS[collectible.rarity];
  const dimensions = SIZES[size];

  // Animation de révélation
  useEffect(() => {
    if (startFlipped) {
      const timer = setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Flip animation
        rotateY.value = withSpring(0, { damping: 15, stiffness: 100 });

        // Scale bounce
        scale.value = withSequence(
          withTiming(0.9, { duration: 150 }),
          withSpring(1.1, { damping: 8 }),
          withSpring(1, { damping: 12 })
        );

        // Glow effect
        glowOpacity.value = withSequence(
          withDelay(300, withTiming(0.8, { duration: 200 })),
          withTiming(0.3, { duration: 500 }),
          withTiming(0, { duration: 500 })
        );

        setIsFlipped(false);
        if (onRevealed) {
          setTimeout(onRevealed, 800);
        }
      }, revealDelay);

      return () => clearTimeout(timer);
    }
  }, [startFlipped, revealDelay]);

  // Handle manual flip
  const handlePress = () => {
    if (!isFlipped) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      // Petit bounce quand on tape sur la carte
      scale.value = withSequence(
        withSpring(0.95, { damping: 15 }),
        withSpring(1, { damping: 12 })
      );
    }
  };

  // Style animé face avant
  const frontStyle = useAnimatedStyle(() => {
    const rotateYValue = interpolate(
      rotateY.value,
      [0, 180],
      [0, 180],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateYValue}deg` },
        { scale: scale.value },
      ],
      backfaceVisibility: 'hidden' as const,
      opacity: rotateY.value < 90 ? 1 : 0,
    };
  });

  // Style animé face arrière
  const backStyle = useAnimatedStyle(() => {
    const rotateYValue = interpolate(
      rotateY.value,
      [0, 180],
      [180, 360],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateYValue}deg` },
        { scale: scale.value },
      ],
      backfaceVisibility: 'hidden' as const,
      opacity: rotateY.value >= 90 ? 1 : 0,
    };
  });

  // Style glow
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <Pressable onPress={handlePress}>
      <View style={[styles.container, dimensions]}>
        {/* Glow effect */}
        <Animated.View
          style={[
            styles.glow,
            { backgroundColor: colors.glow },
            dimensions,
            glowStyle,
          ]}
        />

        {/* Front face (card content) */}
        <Animated.View
          style={[
            styles.card,
            styles.front,
            {
              backgroundColor: colors.bg,
              borderColor: colors.border,
            },
            dimensions,
            frontStyle,
          ]}
        >
          {/* Rarity badge */}
          <View style={[styles.rarityBadge, { backgroundColor: colors.border }]}>
            <Text style={styles.rarityText}>{RARITY_LABELS[collectible.rarity]}</Text>
          </View>

          {/* Card content */}
          <View style={styles.cardContent}>
            <Text style={[styles.emoji, size === 'small' && styles.emojiSmall]}>
              {collectible.emoji}
            </Text>
            <Text
              style={[styles.name, size === 'small' && styles.nameSmall]}
              numberOfLines={2}
            >
              {collectible.name}
            </Text>

            {size !== 'small' && (
              <Text style={styles.description} numberOfLines={3}>
                {collectible.description}
              </Text>
            )}

            {/* Trait (if available) */}
            {collectible.trait && size !== 'small' && (
              <View style={styles.traitContainer}>
                <Text style={styles.traitEmoji}>{collectible.traitEmoji}</Text>
                <Text style={styles.traitText}>{collectible.trait}</Text>
              </View>
            )}
          </View>

          {/* Decorative corners */}
          <View style={[styles.corner, styles.cornerTL, { borderColor: colors.border }]} />
          <View style={[styles.corner, styles.cornerTR, { borderColor: colors.border }]} />
          <View style={[styles.corner, styles.cornerBL, { borderColor: colors.border }]} />
          <View style={[styles.corner, styles.cornerBR, { borderColor: colors.border }]} />
        </Animated.View>

        {/* Back face (hidden card) */}
        <Animated.View
          style={[
            styles.card,
            styles.back,
            dimensions,
            backStyle,
          ]}
        >
          <View style={styles.backPattern}>
            <Text style={styles.backEmoji}>📚</Text>
            <Text style={styles.backText}>?</Text>
          </View>
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Card base
  card: {
    position: 'absolute',
    borderRadius: borderRadius.xl,
    borderWidth: 3,
    ...shadows.xl,
  },
  front: {
    padding: spacing[3],
  },
  back: {
    backgroundColor: '#9B59B6',
    borderColor: '#7B3FA0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Glow effect
  glow: {
    position: 'absolute',
    borderRadius: borderRadius.xl,
    ...shadows.xl,
  },

  // Rarity badge
  rarityBadge: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.round,
  },
  rarityText: {
    fontSize: 10,
    fontFamily: fontFamily.bold,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Card content
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing[3],
  },
  emoji: {
    fontSize: 60,
    marginBottom: spacing[2],
  },
  emojiSmall: {
    fontSize: 36,
  },
  name: {
    fontSize: 18,
    fontFamily: fontFamily.displayBold,
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  nameSmall: {
    fontSize: 14,
  },
  description: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing[2],
  },

  // Trait
  traitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.round,
    gap: spacing[1],
  },
  traitEmoji: {
    fontSize: 14,
  },
  traitText: {
    fontSize: 12,
    fontFamily: fontFamily.medium,
    color: '#4A5568',
  },

  // Decorative corners
  corner: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderWidth: 2,
  },
  cornerTL: {
    top: 6,
    left: 6,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 6,
    right: 6,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 6,
    left: 6,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 6,
    right: 6,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 4,
  },

  // Back pattern
  backPattern: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backEmoji: {
    fontSize: 40,
    marginBottom: spacing[2],
  },
  backText: {
    fontSize: 48,
    fontFamily: fontFamily.displayBold,
    color: 'rgba(255,255,255,0.5)',
  },
});

export default CollectibleCard;
