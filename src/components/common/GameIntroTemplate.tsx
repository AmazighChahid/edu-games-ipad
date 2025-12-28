/**
 * GameIntroTemplate
 * Unified template for game intro screens following the Hanoi pattern:
 * - Level selection visible at top
 * - Game preview always visible below
 * - Animated transition when game starts (selector slides up, fades out)
 * - Progress panel appears when playing
 * - Mascot moves up to fill space
 *
 * @see HanoiIntroScreen.tsx for reference implementation
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';

import { colors, spacing, textStyles, borderRadius, shadows, fontFamily } from '../../theme';
import { ScreenBackground } from './ScreenBackground';
import type {
  GameIntroTemplateProps,
  LevelConfig,
  IntroAnimationConfig,
  DEFAULT_ANIMATION_CONFIG,
} from './GameIntroTemplate.types';

// Re-export types for convenience
export type { GameIntroTemplateProps, LevelConfig, TrainingConfig, TrainingParam } from './GameIntroTemplate.types';
export { calculateLevelsForAge, generateDefaultLevels, DEFAULT_ANIMATION_CONFIG } from './GameIntroTemplate.types';

// ============================================
// CONSTANTS
// ============================================

const DIFFICULTY_COLORS: Record<LevelConfig['difficulty'], string> = {
  easy: colors.feedback.success,
  medium: colors.secondary.main,
  hard: colors.primary.main,
  expert: colors.home.categories.spatial,
};

const DIFFICULTY_LABELS: Record<LevelConfig['difficulty'], string> = {
  easy: 'Facile',
  medium: 'Moyen',
  hard: 'Difficile',
  expert: 'Expert',
};

// ============================================
// DEFAULT LEVEL CARD COMPONENT
// ============================================

interface DefaultLevelCardProps {
  level: LevelConfig;
  isSelected: boolean;
  onPress: () => void;
}

const DefaultLevelCard: React.FC<DefaultLevelCardProps> = ({
  level,
  isSelected,
  onPress,
}) => {
  const difficultyColor = DIFFICULTY_COLORS[level.difficulty];

  return (
    <Pressable
      onPress={onPress}
      disabled={!level.isUnlocked}
      style={[
        styles.levelCard,
        isSelected && styles.levelCardSelected,
        !level.isUnlocked && styles.levelCardLocked,
        isSelected && { borderColor: difficultyColor },
      ]}
      accessible
      accessibilityLabel={`Niveau ${level.number}${!level.isUnlocked ? ', verrouillé' : ''}`}
      accessibilityRole="button"
    >
      {/* Stars indicator */}
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
              ★
            </Text>
          ))}
        </View>
      )}

      {/* Level number */}
      <Text
        style={[
          styles.levelNumber,
          isSelected && { color: difficultyColor },
          !level.isUnlocked && styles.levelNumberLocked,
        ]}
      >
        {level.isUnlocked ? level.number : '🔒'}
      </Text>

      {/* Difficulty indicator */}
      <View
        style={[
          styles.difficultyBadge,
          { backgroundColor: level.isUnlocked ? difficultyColor : colors.text.muted },
        ]}
      >
        <Text style={styles.difficultyText}>
          {level.isUnlocked ? DIFFICULTY_LABELS[level.difficulty] : 'Bloqué'}
        </Text>
      </View>
    </Pressable>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export const GameIntroTemplate: React.FC<GameIntroTemplateProps> = ({
  // Header
  title,
  emoji,
  onBack,
  onParentPress,
  onHelpPress,
  showParentButton = true,
  showHelpButton = true,

  // Level selection
  levels,
  selectedLevel,
  onSelectLevel,
  renderLevelCard,
  levelColumns = 5,

  // Training mode
  showTrainingMode = true,
  trainingConfig,
  onTrainingPress,
  isTrainingMode = false,

  // Game
  renderGame,
  isPlaying,
  onStartPlaying,

  // Progress
  renderProgress,

  // Mascot
  mascotComponent,
  mascotMessage,
  mascotMessageType = 'intro',

  // Customization
  backgroundComponent,
  backgroundColor,

  // Animation
  animationConfig: customAnimationConfig,

  // Floating buttons
  showResetButton = true,
  onReset,
  showHintButton = true,
  onHint,
  hintsRemaining = 0,
  hintsDisabled = false,

  // Victory
  isVictory = false,
  victoryComponent,
}) => {
  const insets = useSafeAreaInsets();

  // Merge animation config with defaults
  const animConfig: IntroAnimationConfig = useMemo(
    () => ({
      selectorSlideDuration: 400,
      selectorFadeDuration: 300,
      progressDelayDuration: 200,
      mascotSlideDuration: 400,
      selectorSlideDistance: -150,
      mascotSlideDistance: -180,
      springDamping: 15,
      springStiffness: 150,
      ...customAnimationConfig,
    }),
    [customAnimationConfig]
  );

  // Animation shared values
  const selectorY = useSharedValue(0);
  const selectorOpacity = useSharedValue(1);
  const progressPanelOpacity = useSharedValue(0);
  const mascotY = useSharedValue(0);

  // Transition to play mode
  const transitionToPlayMode = useCallback(() => {
    if (isPlaying) return;

    // Slide selector up and fade out
    selectorY.value = withTiming(animConfig.selectorSlideDistance, {
      duration: animConfig.selectorSlideDuration,
      easing: Easing.out(Easing.quad),
    });
    selectorOpacity.value = withTiming(0, {
      duration: animConfig.selectorFadeDuration,
    });

    // Fade in progress panel
    progressPanelOpacity.value = withDelay(
      animConfig.progressDelayDuration,
      withTiming(1, { duration: animConfig.selectorFadeDuration })
    );

    // Move mascot up
    mascotY.value = withTiming(animConfig.mascotSlideDistance, {
      duration: animConfig.mascotSlideDuration,
      easing: Easing.out(Easing.quad),
    });

    // Trigger callback
    onStartPlaying?.();
  }, [isPlaying, animConfig, selectorY, selectorOpacity, progressPanelOpacity, mascotY, onStartPlaying]);

  // Return to selection mode
  const transitionToSelectionMode = useCallback(() => {
    // Show selector
    selectorY.value = withSpring(0, {
      damping: animConfig.springDamping,
      stiffness: animConfig.springStiffness,
    });
    selectorOpacity.value = withTiming(1, {
      duration: animConfig.selectorFadeDuration,
    });

    // Hide progress panel
    progressPanelOpacity.value = withTiming(0, { duration: 200 });

    // Reset mascot position
    mascotY.value = withSpring(0, {
      damping: animConfig.springDamping,
      stiffness: animConfig.springStiffness,
    });
  }, [animConfig, selectorY, selectorOpacity, progressPanelOpacity, mascotY]);

  // Handle back button
  const handleBack = useCallback(() => {
    if (isPlaying && !isVictory) {
      // Return to level selection (no popup, just reset)
      transitionToSelectionMode();
      onReset?.();
    } else {
      onBack();
    }
  }, [isPlaying, isVictory, transitionToSelectionMode, onReset, onBack]);

  // Animated styles
  const selectorStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: selectorY.value }],
    opacity: selectorOpacity.value,
  }));

  const progressPanelStyle = useAnimatedStyle(() => ({
    opacity: progressPanelOpacity.value,
  }));

  const mascotStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: mascotY.value }],
  }));

  // Render level grid
  const renderLevelGrid = () => {
    const rows: LevelConfig[][] = [];
    for (let i = 0; i < levels.length; i += levelColumns) {
      rows.push(levels.slice(i, i + levelColumns));
    }

    return (
      <View style={styles.levelGrid}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.levelRow}>
            {row.map((level) => {
              const isSelected = selectedLevel?.id === level.id;
              if (renderLevelCard) {
                return (
                  <Pressable
                    key={level.id}
                    onPress={() => level.isUnlocked && onSelectLevel(level)}
                  >
                    {renderLevelCard(level, isSelected)}
                  </Pressable>
                );
              }
              return (
                <DefaultLevelCard
                  key={level.id}
                  level={level}
                  isSelected={isSelected}
                  onPress={() => onSelectLevel(level)}
                />
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      {backgroundComponent || (
        <ScreenBackground variant="playful">
          <></>
        </ScreenBackground>
      )}

      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + spacing[2],
            paddingBottom: insets.bottom + spacing[2],
          },
        ]}
      >
        {/* === HEADER === */}
        <View style={styles.header}>
          {/* Back button */}
          <Pressable
            onPress={handleBack}
            style={styles.headerButton}
            accessible
            accessibilityLabel="Retour"
            accessibilityRole="button"
          >
            <Text style={styles.headerButtonText}>←</Text>
          </Pressable>

          {/* Title (centered) */}
          <View style={styles.headerTitleWrapper}>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerEmoji}>{emoji}</Text>
              <Text style={styles.headerTitle}>{title}</Text>
            </View>
          </View>

          {/* Right buttons */}
          <View style={styles.headerRightButtons}>
            {showParentButton && onParentPress && (
              <Pressable
                onPress={onParentPress}
                style={styles.parentButton}
                accessible
                accessibilityLabel="Espace parent"
                accessibilityRole="button"
              >
                <LinearGradient
                  colors={['#E056FD', '#9B59B6']}
                  style={styles.parentIconContainer}
                >
                  <Text style={styles.parentButtonIcon}>👨‍👩‍👧</Text>
                </LinearGradient>
                <Text style={styles.parentText}>Parent</Text>
              </Pressable>
            )}

            {showHelpButton && onHelpPress && (
              <Pressable
                onPress={onHelpPress}
                style={styles.helpButton}
                accessible
                accessibilityLabel="Aide"
                accessibilityRole="button"
              >
                <Text style={styles.helpButtonText}>?</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* === SCROLLABLE CONTENT === */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* === LEVEL SELECTOR (slides up when playing) === */}
          <Animated.View
            style={[styles.selectorContainer, selectorStyle]}
            pointerEvents={isPlaying ? 'none' : 'auto'}
          >
          {/* Training mode button */}
          {showTrainingMode && onTrainingPress && (
            <Pressable
              onPress={onTrainingPress}
              style={[
                styles.trainingButton,
                isTrainingMode && styles.trainingButtonActive,
              ]}
              accessible
              accessibilityLabel="Mode entraînement"
              accessibilityRole="button"
            >
              <Text style={styles.trainingButtonEmoji}>🎯</Text>
              <Text
                style={[
                  styles.trainingButtonText,
                  isTrainingMode && styles.trainingButtonTextActive,
                ]}
              >
                Entraînement
              </Text>
            </Pressable>
          )}

          {/* Level grid */}
          {!isTrainingMode && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.levelScrollContent}
            >
              {renderLevelGrid()}
            </ScrollView>
          )}

          {/* Training config (when in training mode) */}
          {isTrainingMode && trainingConfig && (
            <View style={styles.trainingConfig}>
              {trainingConfig.availableParams.map((param) => (
                <View key={param.id} style={styles.trainingParam}>
                  <Text style={styles.trainingParamLabel}>{param.label}</Text>
                  {param.type === 'select' && param.options && (
                    <View style={styles.trainingOptions}>
                      {param.options.map((option) => (
                        <Pressable
                          key={String(option.value)}
                          onPress={() =>
                            trainingConfig.onParamChange(param.id, option.value)
                          }
                          style={[
                            styles.trainingOption,
                            trainingConfig.currentValues[param.id] === option.value &&
                              styles.trainingOptionSelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.trainingOptionText,
                              trainingConfig.currentValues[param.id] === option.value &&
                                styles.trainingOptionTextSelected,
                            ]}
                          >
                            {option.label}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
          </Animated.View>

          {/* === PROGRESS PANEL (fades in when playing) === */}
          <Animated.View
            style={[styles.progressPanelContainer, progressPanelStyle]}
            pointerEvents={isPlaying ? 'auto' : 'none'}
          >
            {renderProgress?.()}
          </Animated.View>

          {/* === MASCOT (moves up when playing) === */}
          <Animated.View
            style={[styles.mascotContainer, mascotStyle]}
            pointerEvents="box-none"
          >
            {mascotComponent}
          </Animated.View>

          {/* === GAME AREA (always visible) === */}
          <View style={styles.gameContainer}>
            {renderGame()}
          </View>
        </ScrollView>

        {/* === FLOATING BUTTONS (visible when playing) === */}
        {isPlaying && !isVictory && (
          <View style={styles.floatingButtons}>
            {showResetButton && onReset && (
              <Pressable
                onPress={onReset}
                style={styles.floatingButton}
                accessible
                accessibilityLabel="Recommencer"
                accessibilityRole="button"
              >
                <Text style={styles.floatingButtonEmoji}>🔄</Text>
              </Pressable>
            )}

            {showHintButton && onHint && !hintsDisabled && (
              <Pressable
                onPress={onHint}
                style={[
                  styles.floatingButton,
                  styles.floatingButtonHint,
                  hintsRemaining === 0 && styles.floatingButtonDisabled,
                ]}
                disabled={hintsRemaining === 0}
                accessible
                accessibilityLabel={`Indice, ${hintsRemaining} restants`}
                accessibilityRole="button"
              >
                <Text style={styles.floatingButtonEmoji}>💡</Text>
                {hintsRemaining > 0 && (
                  <View style={styles.hintBadge}>
                    <Text style={styles.hintBadgeText}>{hintsRemaining}</Text>
                  </View>
                )}
              </Pressable>
            )}
          </View>
        )}

        {/* === VICTORY OVERLAY === */}
        {isVictory && victoryComponent}
      </View>
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing[6],
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    marginBottom: spacing[2],
    zIndex: 100,
  },
  headerButton: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  headerButtonText: {
    fontSize: 24,
    color: colors.primary.main,
  },
  headerTitleWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: -1,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[5],
    borderRadius: 20,
    ...shadows.md,
  },
  headerTitle: {
    ...textStyles.h2,
    color: colors.text.secondary,
    fontFamily: fontFamily.bold,
  },
  headerEmoji: {
    fontSize: 24,
  },
  headerRightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  parentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.md,
    ...shadows.md,
  },
  parentIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  parentButtonIcon: {
    fontSize: 18,
  },
  parentText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    color: colors.text.muted,
  },
  helpButton: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.secondary.main,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  helpButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: fontFamily.bold,
  },

  // Level Selector
  selectorContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    zIndex: 50,
    alignItems: 'center',
  },
  levelScrollContent: {
    paddingHorizontal: spacing[2],
    flexGrow: 1,
    justifyContent: 'center',
  },
  levelGrid: {
    gap: spacing[2],
    alignItems: 'center',
  },
  levelRow: {
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'center',
  },
  levelCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[5],
    alignItems: 'center',
    minWidth: 100,
    minHeight: 120,
    borderWidth: 3,
    borderColor: colors.background.secondary,
    ...shadows.md,
  },
  levelCardSelected: {
    backgroundColor: colors.primary.light,
    transform: [{ scale: 1.05 }],
  },
  levelCardLocked: {
    backgroundColor: colors.background.secondary,
    opacity: 0.7,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: spacing[1],
  },
  star: {
    fontSize: 14,
    marginHorizontal: 1,
  },
  starFilled: {
    color: colors.secondary.main,
  },
  starEmpty: {
    color: colors.text.muted,
    opacity: 0.3,
  },
  levelNumber: {
    fontSize: 36,
    fontFamily: fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  levelNumberLocked: {
    fontSize: 28,
  },
  difficultyBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
  },
  difficultyText: {
    fontSize: 11,
    fontFamily: fontFamily.semiBold,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },

  // Training mode
  trainingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: spacing[2],
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.lg,
    marginBottom: spacing[3],
    ...shadows.sm,
  },
  trainingButtonActive: {
    backgroundColor: colors.secondary.light,
  },
  trainingButtonEmoji: {
    fontSize: 20,
  },
  trainingButtonText: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    color: colors.text.secondary,
  },
  trainingButtonTextActive: {
    color: colors.secondary.dark,
  },
  trainingConfig: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    gap: spacing[4],
    ...shadows.md,
  },
  trainingParam: {
    gap: spacing[2],
  },
  trainingParamLabel: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    color: colors.text.primary,
  },
  trainingOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  trainingOption: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.secondary,
    minWidth: 64,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trainingOptionSelected: {
    backgroundColor: colors.primary.main,
  },
  trainingOptionText: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    color: colors.text.secondary,
  },
  trainingOptionTextSelected: {
    color: '#FFFFFF',
  },

  // Progress panel
  progressPanelContainer: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    zIndex: 50,
  },

  // Mascot
  mascotContainer: {
    zIndex: 40,
    alignItems: 'center',
    paddingVertical: spacing[2],
  },

  // Game area
  gameContainer: {
    flex: 1,
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: spacing[4],
  },

  // Floating buttons
  floatingButtons: {
    position: 'absolute',
    bottom: spacing[6],
    right: spacing[4],
    gap: spacing[3],
    zIndex: 60,
  },
  floatingButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  floatingButtonHint: {
    backgroundColor: colors.secondary.main,
  },
  floatingButtonDisabled: {
    opacity: 0.5,
  },
  floatingButtonEmoji: {
    fontSize: 28,
  },
  hintBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintBadgeText: {
    fontSize: 12,
    fontFamily: fontFamily.bold,
    color: '#FFFFFF',
  },
});

export default GameIntroTemplate;
