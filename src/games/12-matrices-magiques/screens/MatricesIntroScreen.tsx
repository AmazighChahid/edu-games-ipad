/**
 * MatricesIntroScreen - Unified intro screen with world + level selection
 * Uses GameIntroTemplate pattern with world tabs
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { WorldTheme, WorldProgress, WorldConfig, DifficultyLevel } from '../types';
import { WORLDS, WORLD_ORDER, PIXEL_DIALOGUES } from '../data';
import { PixelWithBubble, PixelMascot } from '../components';
import { Icons } from '@/constants/icons';
import { PageContainer } from '@/components/common/PageContainer';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { MascotBubble } from '@/components/common/MascotBubble';
import type { LevelConfig } from '@/components/common/GameIntroTemplate.types';

// ============================================================================
// TYPES
// ============================================================================

interface MatricesIntroScreenProps {
  initialProgress?: Record<WorldTheme, WorldProgress>;
}

// ============================================================================
// HELPERS
// ============================================================================

function getRandomDialogue(): string {
  const dialogues = PIXEL_DIALOGUES.intro;
  return dialogues[Math.floor(Math.random() * dialogues.length)];
}

function createDefaultProgress(): Record<WorldTheme, WorldProgress> {
  const progress: Record<WorldTheme, WorldProgress> = {} as Record<WorldTheme, WorldProgress>;

  WORLD_ORDER.forEach((worldId) => {
    const world = WORLDS[worldId];
    progress[worldId] = {
      worldId,
      isUnlocked: true,
      puzzlesCompleted: 0,
      totalPuzzles: world.puzzleCount,
      bestStars: 0,
      hintsUsedTotal: 0,
      completedAt: null,
      lastPlayedAt: null,
      badges: [],
    };
  });

  return progress;
}

/**
 * Generate LevelConfig[] for a world based on its configuration
 */
function generateLevelsForWorld(
  world: WorldConfig,
  worldProgress: WorldProgress
): LevelConfig[] {
  const puzzleCount = world.puzzleCount;
  const [minDiff, maxDiff] = world.difficultyRange;

  // Map difficulty to number for interpolation
  const difficultyOrder: DifficultyLevel[] = ['easy', 'medium', 'hard', 'expert'];
  const minIdx = difficultyOrder.indexOf(minDiff);
  const maxIdx = difficultyOrder.indexOf(maxDiff);

  return Array.from({ length: puzzleCount }, (_, i) => {
    const levelNumber = i + 1;
    const levelId = `${world.id}_level_${levelNumber}`;

    // Calculate difficulty based on level position
    const progressRatio = i / (puzzleCount - 1);
    const diffIdx = Math.round(minIdx + progressRatio * (maxIdx - minIdx));
    const difficulty = difficultyOrder[diffIdx];

    // Check completion based on progress
    const isCompleted = i < worldProgress.puzzlesCompleted;
    const isUnlocked = i === 0 || i <= worldProgress.puzzlesCompleted;

    return {
      id: levelId,
      number: levelNumber,
      difficulty,
      isUnlocked,
      isCompleted,
      stars: isCompleted ? Math.min(3, Math.floor(Math.random() * 3) + 1) : undefined,
    };
  });
}

// ============================================================================
// WORLD TAB COMPONENT
// ============================================================================

interface WorldTabProps {
  world: WorldConfig;
  isSelected: boolean;
  onPress: () => void;
  progress: WorldProgress;
}

const WorldTab: React.FC<WorldTabProps> = ({ world, isSelected, onPress, progress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  const completionPercent = Math.round((progress.puzzlesCompleted / progress.totalPuzzles) * 100);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessible
      accessibilityLabel={`${world.name}, ${completionPercent}% complété`}
      accessibilityRole="tab"
      accessibilityState={{ selected: isSelected }}
    >
      <Animated.View
        style={[
          styles.worldTab,
          isSelected && styles.worldTabSelected,
          isSelected && { borderColor: world.primaryColor },
          animatedStyle,
        ]}
      >
        <Text style={styles.worldTabIcon}>{world.icon}</Text>
        <Text
          style={[
            styles.worldTabName,
            isSelected && { color: world.primaryColor },
          ]}
          numberOfLines={1}
        >
          {world.name}
        </Text>
        {progress.puzzlesCompleted > 0 && (
          <View style={[styles.worldTabBadge, { backgroundColor: world.primaryColor }]}>
            <Text style={styles.worldTabBadgeText}>
              {progress.puzzlesCompleted}/{progress.totalPuzzles}
            </Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

// ============================================================================
// LEVEL CARD COMPONENT
// ============================================================================

interface LevelCardProps {
  level: LevelConfig;
  isSelected: boolean;
  onPress: () => void;
  worldColor: string;
}

const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  easy: '#7BC74D',
  medium: '#FFB347',
  hard: '#5B8DEE',
  expert: '#A29BFE',
};

const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  easy: 'Facile',
  medium: 'Moyen',
  hard: 'Difficile',
  expert: 'Expert',
};

const LevelCard: React.FC<LevelCardProps> = ({ level, isSelected, onPress, worldColor }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (level.isUnlocked) {
      scale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  const difficultyColor = DIFFICULTY_COLORS[level.difficulty];

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={!level.isUnlocked}
      accessible
      accessibilityLabel={`Niveau ${level.number}${level.isCompleted ? ', complété' : ''}${!level.isUnlocked ? ', verrouillé' : ''}`}
      accessibilityRole="button"
    >
      <Animated.View
        style={[
          styles.levelCard,
          level.isCompleted && styles.levelCardCompleted,
          isSelected && styles.levelCardSelected,
          !level.isUnlocked && styles.levelCardLocked,
          isSelected && { borderColor: worldColor },
          animatedStyle,
        ]}
      >
        {/* Stars (if completed) */}
        {level.isCompleted && level.stars !== undefined && (
          <View style={styles.starsContainer}>
            {[1, 2, 3].map((star) => (
              <Text
                key={star}
                style={[
                  styles.star,
                  star <= (level.stars || 0) ? styles.starFilled : styles.starEmpty,
                ]}
              >
                {Icons.star}
              </Text>
            ))}
          </View>
        )}

        {/* Level number */}
        <Text
          style={[
            styles.levelNumber,
            isSelected && { color: worldColor },
            !level.isUnlocked && styles.levelNumberLocked,
          ]}
        >
          {level.isUnlocked ? level.number : Icons.lock}
        </Text>

        {/* Difficulty badge */}
        <View
          style={[
            styles.difficultyBadge,
            { backgroundColor: level.isUnlocked ? difficultyColor : '#9E9E9E' },
          ]}
        >
          <Text style={styles.difficultyText}>
            {level.isUnlocked ? DIFFICULTY_LABELS[level.difficulty] : 'Bloqué'}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function MatricesIntroScreen({ initialProgress }: MatricesIntroScreenProps) {
  const [progress] = useState<Record<WorldTheme, WorldProgress>>(
    initialProgress || createDefaultProgress()
  );

  const [selectedWorldId, setSelectedWorldId] = useState<WorldTheme>('forest');
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [introMessage] = useState(getRandomDialogue());

  const selectedWorld = WORLDS[selectedWorldId];
  const worldProgress = progress[selectedWorldId];

  // Generate levels for selected world
  const levels = useMemo(
    () => generateLevelsForWorld(selectedWorld, worldProgress),
    [selectedWorld, worldProgress]
  );

  // Calculate total stats
  const stats = useMemo(() => {
    let totalStars = 0;
    let totalPuzzles = 0;
    let completedPuzzles = 0;

    WORLD_ORDER.forEach((worldId) => {
      const wp = progress[worldId];
      if (wp) {
        totalStars += wp.bestStars;
        totalPuzzles += wp.totalPuzzles;
        completedPuzzles += wp.puzzlesCompleted;
      }
    });

    return { totalStars, totalPuzzles, completedPuzzles };
  }, [progress]);

  // Handlers
  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleWorldSelect = useCallback((worldId: WorldTheme) => {
    setSelectedWorldId(worldId);
    setSelectedLevel(null);
  }, []);

  const handleLevelSelect = useCallback((level: LevelConfig) => {
    if (level.isUnlocked) {
      setSelectedLevel(level);
    }
  }, []);

  const handleStartPlaying = useCallback(() => {
    if (selectedLevel) {
      router.push({
        pathname: '/(games)/12-matrices-magiques/puzzle',
        params: {
          worldId: selectedWorldId,
          levelNumber: selectedLevel.number,
        },
      });
    }
  }, [selectedWorldId, selectedLevel]);

  return (
    <PageContainer variant="playful" scrollable={false}>
      {/* Header */}
      <ScreenHeader
        variant="game"
        title="Matrices Magiques"
        emoji={Icons.puzzle}
        onBack={handleBack}
        showParentButton={false}
      />

      <View style={styles.mainContainer}>
        {/* Stats bar */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(300)}
          style={styles.statsContainer}
        >
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>{Icons.star}</Text>
            <Text style={styles.statValue}>{stats.totalStars}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>{Icons.puzzle}</Text>
            <Text style={styles.statValue}>{stats.completedPuzzles}/{stats.totalPuzzles}</Text>
          </View>
        </Animated.View>

        {/* World tabs */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(300)}
          style={styles.worldTabsContainer}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.worldTabsContent}
          >
            {WORLD_ORDER.map((worldId) => (
              <WorldTab
                key={worldId}
                world={WORLDS[worldId]}
                isSelected={worldId === selectedWorldId}
                onPress={() => handleWorldSelect(worldId)}
                progress={progress[worldId]}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Level grid */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(300)}
          style={styles.levelGridContainer}
        >
          <LinearGradient
            colors={[selectedWorld.backgroundColor, '#FFFFFF']}
            style={styles.levelGridGradient}
          >
            <Text style={[styles.worldTitle, { color: selectedWorld.primaryColor }]}>
              {selectedWorld.icon} {selectedWorld.name}
            </Text>
            <Text style={styles.worldDescription}>{selectedWorld.description}</Text>

            <View style={styles.levelGrid}>
              {levels.map((level) => (
                <LevelCard
                  key={level.id}
                  level={level}
                  isSelected={selectedLevel?.id === level.id}
                  onPress={() => handleLevelSelect(level)}
                  worldColor={selectedWorld.primaryColor}
                />
              ))}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Mascot + Play button */}
        <Animated.View
          entering={FadeIn.delay(400).duration(300)}
          style={styles.bottomSection}
        >
          <View style={styles.mascotRow}>
            <PixelMascot mood={selectedLevel ? 'excited' : 'happy'} size="small" animated />
            <View style={styles.bubbleContainer}>
              <MascotBubble
                message={selectedLevel
                  ? `Niveau ${selectedLevel.number} - ${DIFFICULTY_LABELS[selectedLevel.difficulty]} ! Tu es prêt ?`
                  : introMessage
                }
                tailPosition="left"
                showDecorations={false}
              />
            </View>
          </View>

          {/* Play button */}
          {selectedLevel && (
            <Animated.View entering={FadeIn.duration(200)}>
              <Pressable
                onPress={handleStartPlaying}
                style={[styles.playButton, { backgroundColor: selectedWorld.primaryColor }]}
                accessible
                accessibilityLabel="Commencer à jouer"
                accessibilityRole="button"
              >
                <Text style={styles.playButtonEmoji}>{Icons.play}</Text>
                <Text style={styles.playButtonText}>C'est parti !</Text>
              </Pressable>
            </Animated.View>
          )}
        </Animated.View>
      </View>
    </PageContainer>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  // Stats bar
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
  },
  statIcon: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    fontFamily: 'Fredoka-Bold',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E0E0E0',
  },

  // World tabs
  worldTabsContainer: {
    marginTop: 12,
  },
  worldTabsContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  worldTab: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 100,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  worldTabSelected: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  worldTabIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  worldTabName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    fontFamily: 'Nunito-SemiBold',
  },
  worldTabBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  worldTabBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Nunito-Bold',
  },

  // Level grid
  levelGridContainer: {
    flex: 1,
    marginTop: 12,
    marginHorizontal: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  levelGridGradient: {
    flex: 1,
    padding: 16,
  },
  worldTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'Fredoka-Bold',
    marginBottom: 4,
  },
  worldDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Nunito-Regular',
    marginBottom: 16,
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },

  // Level card
  levelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    minWidth: 80,
    minHeight: 100,
    borderWidth: 3,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  levelCardCompleted: {
    backgroundColor: '#E8F5E9',
    borderColor: '#7BC74D',
  },
  levelCardSelected: {
    backgroundColor: '#E3F2FD',
    transform: [{ scale: 1.05 }],
  },
  levelCardLocked: {
    backgroundColor: '#F5F5F5',
    opacity: 0.7,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  star: {
    fontSize: 12,
    marginHorizontal: 1,
  },
  starFilled: {
    opacity: 1,
  },
  starEmpty: {
    opacity: 0.3,
  },
  levelNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    fontFamily: 'Fredoka-Bold',
    marginBottom: 4,
  },
  levelNumberLocked: {
    fontSize: 22,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Nunito-Bold',
    textTransform: 'uppercase',
  },

  // Bottom section
  bottomSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  mascotRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  bubbleContainer: {
    flex: 1,
  },

  // Play button - minHeight 64dp pour accessibilité enfant
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 32,
    minHeight: 64,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  playButtonEmoji: {
    fontSize: 24,
  },
  playButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Fredoka-Bold',
  },
});
