/**
 * WorldCard - Card component for world selection
 * Displays world info with progress, stars, and lock state
 */

import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  withRepeat,
  FadeIn,
  SlideInUp,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { WorldConfig, WorldProgress, WorldCardProps } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48 - 12) / 2; // 2 columns with spacing
const CARD_HEIGHT = 180;

// ============================================================================
// WORLD CARD COMPONENT
// ============================================================================

function WorldCardComponent({
  world,
  progress,
  onPress,
  isLocked,
}: WorldCardProps) {
  const scale = useSharedValue(1);
  const lockShake = useSharedValue(0);

  const handlePress = () => {
    if (isLocked) {
      // Shake animation for locked world
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      lockShake.value = withSequence(
        withTiming(-5, { duration: 50 }),
        withRepeat(
          withSequence(
            withTiming(5, { duration: 100 }),
            withTiming(-5, { duration: 100 })
          ),
          2,
          true
        ),
        withTiming(0, { duration: 50 })
      );
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${lockShake.value}deg` },
    ],
  }));

  const progressPercent = progress.totalPuzzles > 0
    ? (progress.puzzlesCompleted / progress.totalPuzzles) * 100
    : 0;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={[styles.container, animatedStyle]}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={() => { scale.value = withSpring(0.95); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={styles.pressable}
        accessibilityRole="button"
        accessibilityLabel={`Monde ${world.name}${isLocked ? ', verrouillé' : ''}`}
        accessibilityState={{ disabled: isLocked }}
      >
        {/* Background gradient */}
        <LinearGradient
          colors={isLocked
            ? ['#9E9E9E', '#757575']
            : world.gradientColors as [string, string]
          }
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{world.icon}</Text>
          </View>

          {/* World name */}
          <Text style={styles.name} numberOfLines={1}>
            {world.name}
          </Text>

          {/* Stars earned */}
          <View style={styles.starsContainer}>
            {[1, 2, 3].map((star) => (
              <Text
                key={star}
                style={[
                  styles.star,
                  progress.bestStars >= star ? styles.starEarned : styles.starEmpty,
                ]}
              >
                ⭐
              </Text>
            ))}
          </View>

          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progressPercent}%`,
                    backgroundColor: isLocked ? '#BDBDBD' : '#FFFFFF',
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {progress.puzzlesCompleted}/{progress.totalPuzzles}
            </Text>
          </View>

          {/* Lock overlay */}
          {isLocked && (
            <View style={styles.lockOverlay}>
              <View style={styles.lockIcon}>
                <Text style={styles.lockEmoji}>🔒</Text>
              </View>
              <Text style={styles.lockText}>Termine le monde précédent</Text>
            </View>
          )}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

export const WorldCard = memo(WorldCardComponent);

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  pressable: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 32,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Fredoka-Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  star: {
    fontSize: 16,
    marginHorizontal: 2,
  },
  starEarned: {
    opacity: 1,
  },
  starEmpty: {
    opacity: 0.4,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    marginTop: 4,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Nunito-SemiBold',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  lockIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  lockEmoji: {
    fontSize: 24,
  },
  lockText: {
    fontSize: 11,
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Nunito-Medium',
    paddingHorizontal: 8,
  },
});
