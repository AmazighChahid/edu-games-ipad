/**
 * CollectionWidgetV9 - Card collection widget (purple)
 * Shows unlocked cards preview and progress
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { CollectionDataV9, WIDGET_COLORS } from '@/types/home.types';

interface CollectionWidgetV9Props {
  collection: CollectionDataV9;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Card preview component
const CardPreview = memo(({ emoji, isLocked }: { emoji: string; isLocked: boolean }) => (
  <View style={[styles.card, isLocked && styles.cardLocked]}>
    <Text style={styles.cardEmoji}>{isLocked ? '❓' : emoji}</Text>
  </View>
));

CardPreview.displayName = 'CardPreview';

export const CollectionWidgetV9 = memo(({ collection }: CollectionWidgetV9Props) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const handlePress = () => {
    router.push('/(games)/collection');
  };

  const unlockedCount = collection.unlockedCards.length;
  const progressPercent = (unlockedCount / collection.totalCards) * 100;

  // Show first 4 cards + 1 locked placeholder
  const previewCards = collection.unlockedCards.slice(0, 4);
  const showLocked = previewCards.length < 5;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
    >
      <LinearGradient
        colors={['rgba(155,89,182,0.95)', 'rgba(142,68,173,0.95)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Background icon */}
        <Text style={styles.bgIcon}>{WIDGET_COLORS.collection.bgIcon}</Text>

        {/* NEW badge if there are new cards */}
        {collection.newCardIds.length > 0 && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>
              {collection.newCardIds.length} NEW!
            </Text>
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>🏆 Ma Collection</Text>

          {/* Collection content */}
          <View style={styles.collectionContent}>
            {/* Card previews */}
            <View style={styles.cardsPreview}>
              {previewCards.map((emoji, index) => (
                <CardPreview key={index} emoji={emoji} isLocked={false} />
              ))}
              {showLocked && <CardPreview emoji="❓" isLocked={true} />}
            </View>

            {/* Collection info */}
            <View style={styles.collectionInfo}>
              <Text style={styles.collectionCount}>
                {unlockedCount}{' '}
                <Text style={styles.collectionTotal}>/ {collection.totalCards}</Text>
              </Text>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={['#FFFFFF', '#E8E8E8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: `${progressPercent}%` }]}
                />
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );
});

CollectionWidgetV9.displayName = 'CollectionWidgetV9';

const styles = StyleSheet.create({
  container: {
    height: 140,
    borderRadius: 20,
    padding: 18,
    position: 'relative',
    overflow: 'hidden',
  },
  bgIcon: {
    position: 'absolute',
    top: '50%',
    right: -10,
    fontSize: 130,
    opacity: 0.15,
    transform: [{ translateY: -65 }],
  },
  newBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 10,
  },
  newBadgeText: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
  title: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  collectionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  // Card previews
  cardsPreview: {
    flexDirection: 'row',
    gap: 6,
  },
  card: {
    width: 44,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  cardLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    shadowOpacity: 0,
    elevation: 0,
  },
  cardEmoji: {
    fontSize: 24,
  },

  // Collection info
  collectionInfo: {
    flex: 1,
    gap: 8,
  },
  collectionCount: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 28,
    color: '#FFFFFF',
  },
  collectionTotal: {
    fontSize: 16,
    opacity: 0.8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    width: 150,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});
