/**
 * GardenWidget - Progress visualization widget (green)
 * Shows flowers earned through game completions
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { GardenStats, WIDGET_COLORS, FlowerType } from '@/types/home.types';

interface GardenWidgetProps {
  stats: GardenStats;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Single flower with stem
const Flower = memo(({ emoji }: { emoji: FlowerType }) => (
  <View style={styles.plant}>
    <Text style={styles.plantFlower}>{emoji}</Text>
    <View style={styles.plantStem} />
  </View>
));

Flower.displayName = 'Flower';

// Stat display
const Stat = memo(({ value, label }: { value: string | number; label: string }) => (
  <View style={styles.stat}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
));

Stat.displayName = 'Stat';

export const GardenWidget = memo(({ stats }: GardenWidgetProps) => {
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

  // Ensure we have 5 flowers (fill with empty if needed)
  const displayFlowers: FlowerType[] = [
    ...stats.flowers,
    ...Array(5 - stats.flowers.length).fill('🌿'),
  ].slice(0, 5) as FlowerType[];

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
    >
      <LinearGradient
        colors={['rgba(39,174,96,0.95)', 'rgba(30,132,73,0.95)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Background icon */}
        <Text style={styles.bgIcon}>{WIDGET_COLORS.garden.bgIcon}</Text>

        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>🌱 Mon Jardin</Text>

          {/* Garden content */}
          <View style={styles.gardenContent}>
            {/* Flowers visual */}
            <View style={styles.gardenVisual}>
              {displayFlowers.map((flower, index) => (
                <Flower key={index} emoji={flower} />
              ))}
            </View>

            {/* Stats */}
            <View style={styles.gardenStats}>
              <Stat value={stats.flowers.length} label="Fleurs" />
              <Stat value={stats.totalGames} label="Jeux" />
              <Stat value={stats.totalTime} label="Temps" />
            </View>
          </View>
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );
});

GardenWidget.displayName = 'GardenWidget';

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
  gardenContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },

  // Garden visual
  gardenVisual: {
    flexDirection: 'row',
    gap: 6,
    padding: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
  },
  plant: {
    alignItems: 'center',
  },
  plantFlower: {
    fontSize: 26,
  },
  plantStem: {
    width: 2,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginTop: -4,
    borderRadius: 1,
  },

  // Stats
  gardenStats: {
    flexDirection: 'row',
    gap: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 26,
    color: '#FFFFFF',
  },
  statLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
  },
});
