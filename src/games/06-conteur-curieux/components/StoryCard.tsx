/**
 * StoryCard Component
 *
 * Carte de sélection d'histoire pour l'écran d'introduction
 * Affiche: couverture, titre, thème, durée, étoiles, état (verrouillé/complété)
 */

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { spacing, borderRadius, shadows, fontFamily } from '../../../theme';
import type { ConteurLevel, StoryTheme } from '../types';

interface StoryCardProps {
  level: ConteurLevel;
  index?: number;
  isLocked?: boolean;
  isCompleted?: boolean;
  stars?: number;
  onPress: (level: ConteurLevel) => void;
}

// Couleurs par thème
const THEME_COLORS: Record<StoryTheme, { gradient: string[]; accent: string }> = {
  nature: { gradient: ['#27AE60', '#2ECC71'], accent: '#27AE60' },
  adventure: { gradient: ['#E67E22', '#F39C12'], accent: '#E67E22' },
  magic: { gradient: ['#9B59B6', '#8E44AD'], accent: '#9B59B6' },
  family: { gradient: ['#3498DB', '#2980B9'], accent: '#3498DB' },
  friendship: { gradient: ['#E91E63', '#C2185B'], accent: '#E91E63' },
  discovery: { gradient: ['#00BCD4', '#0097A7'], accent: '#00BCD4' },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function StoryCard({
  level,
  index = 0,
  isLocked = false,
  isCompleted = false,
  stars = 0,
  onPress,
}: StoryCardProps) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  // Card dimensions based on device
  const cardWidth = isTablet ? 180 : 150;
  const cardHeight = isTablet ? 260 : 220;

  // Animation values
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.15);

  // Get theme colors
  const themeKey = (level.story.theme || 'nature') as StoryTheme;
  const themeColors = THEME_COLORS[themeKey] || THEME_COLORS.nature;

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 200 });
    shadowOpacity.value = withTiming(0.25, { duration: 100 });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 150 });
    shadowOpacity.value = withTiming(0.15, { duration: 200 });
  }, []);

  const handlePress = useCallback(() => {
    if (isLocked) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress(level);
  }, [isLocked, level, onPress]);

  // Animated styles
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: shadowOpacity.value,
  }));

  // Render stars
  const renderStars = () => {
    if (stars === 0) return null;
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Text key={i} style={[styles.star, i > stars && styles.starEmpty]}>
            ⭐
          </Text>
        ))}
      </View>
    );
  };

  return (
    <AnimatedPressable
      style={[
        styles.card,
        { width: cardWidth, height: cardHeight },
        cardStyle,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      entering={FadeIn.delay(index * 80).duration(400)}
      accessibilityLabel={`Histoire ${level.story.title}, ${isLocked ? 'verrouillée' : 'disponible'}`}
      accessibilityHint={isLocked ? 'Continue pour débloquer cette histoire' : 'Appuie pour choisir cette histoire'}
      accessibilityRole="button"
    >
      {/* Cover */}
      <View style={[styles.cover, { backgroundColor: themeColors.accent }]}>
        <Text style={styles.emoji}>{level.story.emoji}</Text>

        {/* Level stars */}
        <View style={styles.levelBadge}>
          {[1, 2, 3].map((i) => (
            <Text key={i} style={styles.levelStar}>
              {i <= level.difficulty ? '⭐' : '☆'}
            </Text>
          ))}
        </View>

        {/* Completed badge */}
        {isCompleted && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedIcon}>✓</Text>
          </View>
        )}

        {/* New badge */}
        {!isCompleted && !isLocked && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NOUVEAU</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {level.story.title}
        </Text>
        <Text style={styles.theme}>
          {level.themeEmoji} {level.theme}
        </Text>
        <View style={styles.duration}>
          <Text style={styles.durationIcon}>⏱️</Text>
          <Text style={styles.durationText}>{level.story.readingTime} min</Text>
        </View>
        {renderStars()}
      </View>

      {/* Lock overlay */}
      {isLocked && (
        <View style={styles.lockOverlay}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.lockText}>Continue pour débloquer</Text>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    boxShadow: '0px 4px 8px rgba(155, 89, 182, 0.15)',
    elevation: 5,
  },

  // Cover
  cover: {
    height: '55%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
  },
  emoji: {
    fontSize: 56,
  },
  levelBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    gap: 1,
  },
  levelStar: {
    fontSize: 12,
  },
  completedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    backgroundColor: '#7BC74D',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Info
  info: {
    flex: 1,
    padding: spacing[3],
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fontFamily.displayBold,
    fontSize: 14,
    color: '#2D3748',
    lineHeight: 18,
  },
  theme: {
    fontSize: 11,
    color: '#718096',
    marginTop: 2,
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  durationIcon: {
    fontSize: 12,
  },
  durationText: {
    fontSize: 11,
    color: '#9B59B6',
    fontWeight: '600',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 4,
  },
  star: {
    fontSize: 12,
  },
  starEmpty: {
    opacity: 0.3,
  },

  // Lock overlay
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.xl,
  },
  lockIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  lockText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: spacing[2],
  },
});

export default StoryCard;
