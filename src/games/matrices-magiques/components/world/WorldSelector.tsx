/**
 * WorldSelector - Grid of world cards for selection
 * Displays all 5 worlds with progress and lock states
 */

import React, { memo, useMemo } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

import { WorldTheme, WorldProgress, WorldConfig } from '../../types';
import { WORLDS, WORLD_ORDER } from '../../data';
import { WorldCard } from './WorldCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================================================
// TYPES
// ============================================================================

interface WorldSelectorProps {
  progress: Record<WorldTheme, WorldProgress>;
  onWorldSelect: (worldId: WorldTheme) => void;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if a world is unlocked based on progress
 */
function isWorldUnlocked(
  world: WorldConfig,
  progress: Record<WorldTheme, WorldProgress>
): boolean {
  const condition = world.unlockCondition;

  switch (condition.type) {
    case 'default':
      return true; // Always unlocked

    case 'complete_world':
      if (!condition.worldId) return true;
      const prevProgress = progress[condition.worldId];
      return prevProgress && prevProgress.puzzlesCompleted >= prevProgress.totalPuzzles;

    case 'complete_all':
      // Check all previous worlds are complete
      return WORLD_ORDER.every((worldId) => {
        if (worldId === world.id) return true; // Skip current world
        const wp = progress[worldId];
        return wp && wp.puzzlesCompleted >= wp.totalPuzzles;
      });

    default:
      return true;
  }
}

/**
 * Create default progress for a world
 */
function getDefaultProgress(worldId: WorldTheme): WorldProgress {
  const world = WORLDS[worldId];
  return {
    worldId,
    isUnlocked: world.unlockCondition.type === 'default',
    puzzlesCompleted: 0,
    totalPuzzles: world.puzzleCount,
    bestStars: 0,
    hintsUsedTotal: 0,
    completedAt: null,
    lastPlayedAt: null,
    badges: [],
  };
}

// ============================================================================
// WORLD SELECTOR COMPONENT
// ============================================================================

function WorldSelectorComponent({
  progress,
  onWorldSelect,
}: WorldSelectorProps) {
  // Get worlds with their unlock status
  const worldsWithStatus = useMemo(() => {
    return WORLD_ORDER.map((worldId) => {
      const world = WORLDS[worldId];
      const worldProgress = progress[worldId] || getDefaultProgress(worldId);
      const isLocked = !isWorldUnlocked(world, progress);

      return {
        world,
        progress: worldProgress,
        isLocked,
      };
    });
  }, [progress]);

  // Split worlds for layout: 2 on top row, 2 on second row, 1 full width at bottom
  const topRow = worldsWithStatus.slice(0, 2);
  const secondRow = worldsWithStatus.slice(2, 4);
  const bottomWorld = worldsWithStatus[4];

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      style={styles.container}
    >
      <Text style={styles.title}>Choisis ton monde</Text>

      {/* Top row: 2 worlds */}
      <Animated.View
        entering={FadeInUp.delay(100).duration(300)}
        style={styles.row}
      >
        {topRow.map(({ world, progress: worldProgress, isLocked }, index) => (
          <WorldCard
            key={world.id}
            world={world}
            progress={worldProgress}
            isLocked={isLocked}
            onPress={() => onWorldSelect(world.id)}
          />
        ))}
      </Animated.View>

      {/* Second row: 2 worlds */}
      <Animated.View
        entering={FadeInUp.delay(200).duration(300)}
        style={styles.row}
      >
        {secondRow.map(({ world, progress: worldProgress, isLocked }, index) => (
          <WorldCard
            key={world.id}
            world={world}
            progress={worldProgress}
            isLocked={isLocked}
            onPress={() => onWorldSelect(world.id)}
          />
        ))}
      </Animated.View>

      {/* Bottom: Mystery world (full width) */}
      {bottomWorld && (
        <Animated.View
          entering={FadeInUp.delay(300).duration(300)}
          style={styles.fullWidthRow}
        >
          <View style={styles.fullWidthCard}>
            <WorldCard
              world={bottomWorld.world}
              progress={bottomWorld.progress}
              isLocked={bottomWorld.isLocked}
              onPress={() => onWorldSelect(bottomWorld.world.id)}
            />
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
}

export const WorldSelector = memo(WorldSelectorComponent);

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Fredoka-Bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  fullWidthRow: {
    alignItems: 'center',
    marginTop: 4,
  },
  fullWidthCard: {
    // The card component handles its own width
  },
});
