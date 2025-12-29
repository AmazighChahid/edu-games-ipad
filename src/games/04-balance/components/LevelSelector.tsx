/**
 * Level Selector Component
 * Displays puzzles organized by phase with progress indicators
 * Features: Phase tabs, level grid, locked/unlocked states, star ratings
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { colors, spacing, borderRadius, shadows, touchTargets, fontFamily, fontSize } from '../../../theme';
import { Icons } from '../../../constants/icons';
import type { Phase, Puzzle, PlayerProgress } from '../types';
import { PHASE_INFO } from '../types';
import { getPuzzlesByPhase, getPhaseProgress, getAllPuzzles } from '../data/puzzles';

// ============================================
// TYPES
// ============================================

interface LevelSelectorProps {
  playerProgress: PlayerProgress;
  onSelectPuzzle: (puzzle: Puzzle) => void;
  onClose?: () => void;
}

// ============================================
// CONSTANTS
// ============================================

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const LEVEL_CARD_SIZE = (SCREEN_WIDTH - spacing[4] * 2 - spacing[3] * 3) / 4;

// ============================================
// SUB-COMPONENTS
// ============================================

interface PhaseTabProps {
  phase: Phase;
  isActive: boolean;
  isUnlocked: boolean;
  progress: { completed: number; total: number };
  onPress: () => void;
}

function PhaseTab({ phase, isActive, isUnlocked, progress, onPress }: PhaseTabProps) {
  const phaseInfo = PHASE_INFO[phase];
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (isUnlocked) {
      scale.value = withSpring(0.95);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={!isUnlocked}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.phaseTab,
          isActive && styles.phaseTabActive,
          !isUnlocked && styles.phaseTabLocked,
          { borderColor: isActive ? phaseInfo.color : 'transparent' },
          animatedStyle,
        ]}
      >
        <Text style={styles.phaseIcon}>{phaseInfo.icon}</Text>
        <Text
          style={[
            styles.phaseName,
            isActive && styles.phaseNameActive,
            !isUnlocked && styles.phaseNameLocked,
          ]}
        >
          {phase}
        </Text>

        {/* Progress indicator */}
        {isUnlocked && (
          <View style={styles.phaseProgress}>
            <View
              style={[
                styles.phaseProgressBar,
                {
                  width: `${(progress.completed / progress.total) * 100}%`,
                  backgroundColor: phaseInfo.color,
                },
              ]}
            />
          </View>
        )}

        {/* Lock icon */}
        {!isUnlocked && (
          <View style={styles.lockBadge}>
            <Text style={styles.lockIcon}>{Icons.lock}</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

interface LevelCardProps {
  puzzle: Puzzle;
  isUnlocked: boolean;
  isCompleted: boolean;
  stars?: 1 | 2 | 3;
  index: number;
  onPress: () => void;
}

function LevelCard({
  puzzle,
  isUnlocked,
  isCompleted,
  stars,
  index,
  onPress,
}: LevelCardProps) {
  const phaseInfo = PHASE_INFO[puzzle.phase];
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (isUnlocked) {
      scale.value = withSpring(0.92);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Render stars
  const renderStars = () => {
    if (!isCompleted) return null;

    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3].map((starNum) => (
          <Text
            key={starNum}
            style={[
              styles.star,
              starNum <= (stars || 0) ? styles.starFilled : styles.starEmpty,
            ]}
          >
            {starNum <= (stars || 0) ? Icons.starFull : Icons.starEmpty}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 50).springify()}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={!isUnlocked}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.levelCard,
            isCompleted && styles.levelCardCompleted,
            !isUnlocked && styles.levelCardLocked,
            { borderColor: isCompleted ? phaseInfo.color : colors.ui.border },
            animatedStyle,
          ]}
        >
          {/* Level number */}
          <Text
            style={[
              styles.levelNumber,
              isCompleted && styles.levelNumberCompleted,
              !isUnlocked && styles.levelNumberLocked,
            ]}
          >
            {isUnlocked ? puzzle.level : '?'}
          </Text>

          {/* Difficulty dots */}
          <View style={styles.difficultyContainer}>
            {Array.from({ length: 5 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.difficultyDot,
                  i < puzzle.difficulty && {
                    backgroundColor: isUnlocked ? phaseInfo.color : colors.ui.disabled,
                  },
                ]}
              />
            ))}
          </View>

          {/* Stars */}
          {renderStars()}

          {/* Lock overlay */}
          {!isUnlocked && (
            <View style={styles.lockOverlay}>
              <Text style={styles.lockEmoji}>{Icons.lock}</Text>
            </View>
          )}

          {/* Completed checkmark */}
          {isCompleted && (
            <View style={[styles.completedBadge, { backgroundColor: phaseInfo.color }]}>
              <Text style={styles.completedCheck}>{Icons.checkmark}</Text>
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

interface PhaseHeaderProps {
  phase: Phase;
  progress: { completed: number; total: number };
}

function PhaseHeader({ phase, progress }: PhaseHeaderProps) {
  const phaseInfo = PHASE_INFO[phase];
  const progressPercent = (progress.completed / progress.total) * 100;

  return (
    <Animated.View
      entering={FadeIn.delay(200)}
      style={styles.phaseHeader}
    >
      <View style={styles.phaseHeaderTop}>
        <View style={styles.phaseHeaderLeft}>
          <Text style={styles.phaseHeaderIcon}>{phaseInfo.icon}</Text>
          <View>
            <Text style={styles.phaseHeaderName}>{phaseInfo.name}</Text>
            <Text style={styles.phaseHeaderAge}>
              {phaseInfo.ageGroup} ans
            </Text>
          </View>
        </View>

        <View style={styles.phaseHeaderRight}>
          <Text style={styles.phaseHeaderProgress}>
            {progress.completed}/{progress.total}
          </Text>
          <Text style={styles.phaseHeaderProgressLabel}>niveaux</Text>
        </View>
      </View>

      <Text style={styles.phaseDescription}>{phaseInfo.description}</Text>

      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${progressPercent}%`, backgroundColor: phaseInfo.color },
          ]}
        />
      </View>
    </Animated.View>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function LevelSelector({
  playerProgress,
  onSelectPuzzle,
  onClose,
}: LevelSelectorProps) {
  const [selectedPhase, setSelectedPhase] = useState<Phase>(1);

  // Get puzzles for selected phase
  const puzzles = useMemo(() => {
    return getPuzzlesByPhase(selectedPhase);
  }, [selectedPhase]);

  // Calculate phase progress
  const phaseProgress = useMemo(() => {
    const result: Record<Phase, { completed: number; total: number }> = {
      1: { completed: 0, total: 0 },
      2: { completed: 0, total: 0 },
      3: { completed: 0, total: 0 },
      4: { completed: 0, total: 0 },
    };

    ([1, 2, 3, 4] as Phase[]).forEach((phase) => {
      const phasePuzzles = getPuzzlesByPhase(phase);
      result[phase].total = phasePuzzles.length;
      result[phase].completed = phasePuzzles.filter(
        (p) => playerProgress.completedPuzzles.includes(p.id)
      ).length;
    });

    return result;
  }, [playerProgress.completedPuzzles]);

  // Check if a puzzle is unlocked
  const isPuzzleUnlocked = useCallback(
    (puzzle: Puzzle) => {
      // First puzzle of each phase is unlocked if phase is unlocked
      if (puzzle.level === 1) {
        return playerProgress.unlockedPhases.includes(puzzle.phase);
      }

      // Other puzzles require previous puzzle to be completed
      const allPuzzles = getAllPuzzles();
      const previousPuzzle = allPuzzles.find(
        (p) => p.phase === puzzle.phase && p.level === puzzle.level - 1
      );

      return previousPuzzle
        ? playerProgress.completedPuzzles.includes(previousPuzzle.id)
        : false;
    },
    [playerProgress]
  );

  // Handle puzzle selection
  const handlePuzzleSelect = useCallback(
    (puzzle: Puzzle) => {
      if (isPuzzleUnlocked(puzzle)) {
        onSelectPuzzle(puzzle);
      }
    },
    [isPuzzleUnlocked, onSelectPuzzle]
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>{Icons.close}</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Sélectionne un niveau</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Phase tabs */}
      <View style={styles.phaseTabs}>
        {([1, 2, 3, 4] as Phase[]).map((phase) => (
          <PhaseTab
            key={phase}
            phase={phase}
            isActive={selectedPhase === phase}
            isUnlocked={playerProgress.unlockedPhases.includes(phase)}
            progress={phaseProgress[phase]}
            onPress={() => {
              if (playerProgress.unlockedPhases.includes(phase)) {
                setSelectedPhase(phase);
              }
            }}
          />
        ))}
      </View>

      {/* Phase header */}
      <PhaseHeader
        phase={selectedPhase}
        progress={phaseProgress[selectedPhase]}
      />

      {/* Levels grid */}
      <ScrollView
        style={styles.levelsScroll}
        contentContainerStyle={styles.levelsGrid}
        showsVerticalScrollIndicator={false}
      >
        {puzzles.map((puzzle, index) => {
          const isUnlocked = isPuzzleUnlocked(puzzle);
          const isCompleted = playerProgress.completedPuzzles.includes(puzzle.id);
          const stars = playerProgress.starsPerPuzzle[puzzle.id];

          return (
            <LevelCard
              key={puzzle.id}
              puzzle={puzzle}
              isUnlocked={isUnlocked}
              isCompleted={isCompleted}
              stars={stars}
              index={index}
              onPress={() => handlePuzzleSelect(puzzle)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[6],
    paddingBottom: spacing[4],
    backgroundColor: colors.background.card,
    ...shadows.sm,
  },
  closeButton: {
    width: touchTargets.large,
    height: touchTargets.large,
    borderRadius: touchTargets.large / 2,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: fontSize.xl,
    color: colors.text.secondary,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.text.primary,
  },
  headerSpacer: {
    width: touchTargets.large,
  },

  // Phase tabs
  phaseTabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    gap: spacing[2],
  },
  phaseTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[2],
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    ...shadows.sm,
  },
  phaseTabActive: {
    backgroundColor: colors.background.card,
  },
  phaseTabLocked: {
    backgroundColor: colors.ui.disabled,
    opacity: 0.6,
  },
  phaseIcon: {
    fontSize: 24,
    marginBottom: spacing[1],
  },
  phaseName: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.text.primary,
  },
  phaseNameActive: {
    color: colors.text.primary,
  },
  phaseNameLocked: {
    color: colors.text.muted,
  },
  phaseProgress: {
    width: '100%',
    height: 4,
    backgroundColor: colors.ui.divider,
    borderRadius: 2,
    marginTop: spacing[1],
    overflow: 'hidden',
  },
  phaseProgressBar: {
    height: '100%',
    borderRadius: 2,
  },
  lockBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  lockIcon: {
    fontSize: 12,
  },

  // Phase header
  phaseHeader: {
    marginHorizontal: spacing[4],
    marginBottom: spacing[3],
    padding: spacing[4],
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  phaseHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  phaseHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  phaseHeaderIcon: {
    fontSize: 36,
  },
  phaseHeaderName: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.text.primary,
  },
  phaseHeaderAge: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: colors.text.secondary,
  },
  phaseHeaderRight: {
    alignItems: 'flex-end',
  },
  phaseHeaderProgress: {
    fontSize: fontSize.xl,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.text.primary,
  },
  phaseHeaderProgressLabel: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: colors.text.secondary,
  },
  phaseDescription: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.regular,
    color: colors.text.secondary,
    marginBottom: spacing[3],
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.ui.divider,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },

  // Levels grid
  levelsScroll: {
    flex: 1,
  },
  levelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing[4],
    gap: spacing[3],
    paddingBottom: 100,
  },

  // Level card
  levelCard: {
    width: LEVEL_CARD_SIZE,
    height: LEVEL_CARD_SIZE,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    ...shadows.sm,
    position: 'relative',
  },
  levelCardCompleted: {
    backgroundColor: colors.background.card,
  },
  levelCardLocked: {
    backgroundColor: colors.ui.disabled,
    opacity: 0.5,
  },
  levelNumber: {
    fontSize: fontSize['2xl'],
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.text.primary,
  },
  levelNumberCompleted: {
    color: colors.feedback.success,
  },
  levelNumberLocked: {
    color: colors.text.muted,
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: 3,
    marginTop: spacing[1],
  },
  difficultyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.ui.divider,
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: spacing[1],
  },
  star: {
    fontSize: fontSize.sm,
  },
  starFilled: {
    color: colors.secondary.main,
  },
  starEmpty: {
    color: colors.ui.disabled,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: borderRadius.md,
  },
  lockEmoji: {
    fontSize: fontSize.xl,
  },
  completedBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  completedCheck: {
    color: colors.text.inverse,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
  },
});

export default LevelSelector;
