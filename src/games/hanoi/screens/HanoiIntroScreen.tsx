/**
 * Hanoi unified screen - Intro + Game with seamless transition
 * The game board is always visible and updates based on selected level
 * When user taps "Play", the level selector slides up and game UI appears
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';

import { colors, spacing, textStyles, borderRadius, shadows, touchTargets } from '@/theme';
import { DraggableGameBoard } from '../components';
import { useHanoiGame } from '../hooks/useHanoiGame';
import { hanoiLevels } from '../data/levels';
import type { HanoiLevelConfig, TowerId } from '../types';

export function HanoiIntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Game state
  const [selectedLevel, setSelectedLevel] = useState<HanoiLevelConfig>(hanoiLevels[1]); // Default 3 disks
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLevelId, setCurrentLevelId] = useState<string>(hanoiLevels[1].id);

  // Demo state
  const [showDemo, setShowDemo] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const demoTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Animation values
  const selectorY = useSharedValue(0);
  const selectorOpacity = useSharedValue(1);
  const hudOpacity = useSharedValue(0);
  const playButtonScale = useSharedValue(1);

  // Demo animation values
  const fingerX = useSharedValue(0);
  const fingerY = useSharedValue(0);
  const fingerScale = useSharedValue(1);
  const fingerOpacity = useSharedValue(1);
  const demoDisk1X = useSharedValue(0);
  const demoDisk1Y = useSharedValue(0);
  const demoDisk2X = useSharedValue(0);
  const demoDisk2Y = useSharedValue(0);

  // Use the actual game hook
  const handleVictory = useCallback(() => {
    setTimeout(() => {
      router.push('/(games)/hanoi/victory');
    }, 1500);
  }, [router]);

  const {
    gameState,
    level,
    moveCount,
    isVictory,
    selectTower,
    canMoveTo,
    performMove,
    reset,
  } = useHanoiGame({
    levelId: currentLevelId,
    onVictory: handleVictory,
  });

  // Update game when level selection changes (only in selection mode)
  useEffect(() => {
    if (!isPlaying) {
      setCurrentLevelId(selectedLevel.id);
    }
  }, [selectedLevel, isPlaying]);

  // Reset game when currentLevelId changes
  useEffect(() => {
    reset();
  }, [currentLevelId]);

  const handleBack = () => {
    if (isPlaying) {
      // Return to level selection with animation
      setIsPlaying(false);
      selectorY.value = withSpring(0, { damping: 15 });
      selectorOpacity.value = withTiming(1, { duration: 300 });
      hudOpacity.value = withTiming(0, { duration: 200 });
      reset();
    } else {
      router.back();
    }
  };

  const handlePlay = () => {
    // Animate play button
    playButtonScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    // Slide selector up and fade out
    selectorY.value = withTiming(-250, { duration: 400, easing: Easing.out(Easing.quad) });
    selectorOpacity.value = withTiming(0, { duration: 300 });

    // Fade in game HUD
    hudOpacity.value = withDelay(200, withTiming(1, { duration: 300 }));

    // Start playing after animation
    setTimeout(() => {
      setIsPlaying(true);
    }, 300);
  };

  const handleReset = () => {
    reset();
  };

  const handleTowerPress = (towerId: TowerId) => {
    if (!isPlaying || isVictory) return;
    selectTower(towerId);
  };

  const handleMove = (from: TowerId, to: TowerId) => {
    if (!isPlaying || isVictory) return;
    performMove(from, to);
  };

  // Demo functions
  const clearDemoTimeouts = () => {
    demoTimeoutsRef.current.forEach(clearTimeout);
    demoTimeoutsRef.current = [];
  };

  const resetDemoPositions = () => {
    demoDisk1X.value = 0;
    demoDisk1Y.value = 0;
    demoDisk2X.value = 0;
    demoDisk2Y.value = 0;
    fingerX.value = 0;
    fingerY.value = 0;
    fingerScale.value = 1;
    fingerOpacity.value = 1;
  };

  const startDemo = useCallback(() => {
    resetDemoPositions();
    setDemoStep(0);

    const TOWER_SPACING = 120;

    const t1 = setTimeout(() => {
      setDemoStep(1);
      fingerX.value = withTiming(0, { duration: 300 });
      fingerScale.value = withDelay(300, withSequence(
        withTiming(0.85, { duration: 100 }),
        withTiming(1, { duration: 100 })
      ));
      demoDisk1Y.value = withDelay(500, withTiming(-60, { duration: 200 }));
      fingerY.value = withDelay(500, withTiming(-60, { duration: 200 }));
      demoDisk1X.value = withDelay(700, withTiming(TOWER_SPACING, { duration: 500 }));
      fingerX.value = withDelay(700, withTiming(TOWER_SPACING, { duration: 500 }));
      demoDisk1Y.value = withDelay(1200, withTiming(0, { duration: 200 }));
      fingerY.value = withDelay(1200, withTiming(0, { duration: 200 }));
    }, 500);

    const t2 = setTimeout(() => {
      setDemoStep(2);
      fingerX.value = withTiming(0, { duration: 300 });
      fingerY.value = withTiming(24, { duration: 300 });
      fingerScale.value = withDelay(300, withSequence(
        withTiming(0.85, { duration: 100 }),
        withTiming(1, { duration: 100 })
      ));
      demoDisk2Y.value = withDelay(500, withTiming(-60, { duration: 200 }));
      fingerY.value = withDelay(500, withTiming(-36, { duration: 200 }));
      demoDisk2X.value = withDelay(700, withTiming(TOWER_SPACING * 2, { duration: 500 }));
      fingerX.value = withDelay(700, withTiming(TOWER_SPACING * 2, { duration: 500 }));
      demoDisk2Y.value = withDelay(1200, withTiming(0, { duration: 200 }));
      fingerY.value = withDelay(1200, withTiming(24, { duration: 200 }));
    }, 2200);

    const t3 = setTimeout(() => {
      setDemoStep(3);
      fingerX.value = withTiming(TOWER_SPACING, { duration: 300 });
      fingerY.value = withTiming(0, { duration: 300 });
      fingerScale.value = withDelay(300, withSequence(
        withTiming(0.85, { duration: 100 }),
        withTiming(1, { duration: 100 })
      ));
      demoDisk1Y.value = withDelay(500, withTiming(-60, { duration: 200 }));
      fingerY.value = withDelay(500, withTiming(-60, { duration: 200 }));
      demoDisk1X.value = withDelay(700, withTiming(TOWER_SPACING * 2, { duration: 500 }));
      fingerX.value = withDelay(700, withTiming(TOWER_SPACING * 2, { duration: 500 }));
      demoDisk1Y.value = withDelay(1200, withTiming(-24, { duration: 200 }));
      fingerY.value = withDelay(1200, withTiming(-24, { duration: 200 }));
    }, 3900);

    const t4 = setTimeout(() => {
      setDemoStep(4);
      fingerOpacity.value = withTiming(0, { duration: 300 });
    }, 5600);

    const t5 = setTimeout(() => {
      setShowDemo(false);
      setDemoStep(0);
    }, 7500);

    demoTimeoutsRef.current = [t1, t2, t3, t4, t5];
  }, []);

  useEffect(() => {
    if (showDemo) {
      startDemo();
    } else {
      clearDemoTimeouts();
      resetDemoPositions();
    }
    return () => clearDemoTimeouts();
  }, [showDemo, startDemo]);

  // Animated styles
  const selectorStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: selectorY.value }],
    opacity: selectorOpacity.value,
  }));

  const hudStyle = useAnimatedStyle(() => ({
    opacity: hudOpacity.value,
  }));

  const fingerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: fingerX.value },
      { translateY: fingerY.value },
      { scale: fingerScale.value },
    ],
    opacity: fingerOpacity.value,
  }));

  const demoDisk1Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: demoDisk1X.value },
      { translateY: demoDisk1Y.value },
    ],
  }));

  const demoDisk2Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: demoDisk2X.value },
      { translateY: demoDisk2Y.value },
    ],
  }));

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing[3],
          paddingBottom: insets.bottom + spacing[3],
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>←</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Tour de Hanoï</Text>

        <Pressable onPress={() => setShowDemo(true)} style={styles.helpButton}>
          <Text style={styles.helpButtonText}>?</Text>
        </Pressable>
      </View>

      {/* Game HUD - Appears when playing */}
      <Animated.View style={[styles.gameHud, hudStyle]} pointerEvents={isPlaying ? 'auto' : 'none'}>
        <View style={styles.hudItem}>
          <Text style={styles.hudLabel}>Coups</Text>
          <Text style={styles.hudValue}>{moveCount}</Text>
        </View>
        <View style={styles.hudDivider} />
        <View style={styles.hudItem}>
          <Text style={styles.hudLabel}>Optimal</Text>
          <Text style={styles.hudValueOptimal}>{level.optimalMoves}</Text>
        </View>
        <Pressable onPress={handleReset} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>↻</Text>
        </Pressable>
      </Animated.View>

      {/* Game Board - Always visible, uses the real DraggableGameBoard component */}
      <View style={styles.boardContainer}>
        <DraggableGameBoard
          gameState={gameState}
          totalDisks={level.diskCount}
          onMove={handleMove}
          onTowerPress={handleTowerPress}
          canMoveTo={canMoveTo}
        />
      </View>

      {/* Level Selector - Slides up when playing */}
      <Animated.View style={[styles.selectorContainer, selectorStyle]} pointerEvents={isPlaying ? 'none' : 'auto'}>
        <Text style={styles.selectorTitle}>Choisis le nombre de disques</Text>

        <View style={styles.levelButtons}>
          {hanoiLevels.slice(0, 5).map((lvl) => {
            const isSelected = selectedLevel.id === lvl.id;
            return (
              <Pressable
                key={lvl.id}
                onPress={() => setSelectedLevel(lvl)}
                style={[
                  styles.levelButton,
                  isSelected && styles.levelButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.levelButtonNumber,
                    isSelected && styles.levelButtonNumberSelected,
                  ]}
                >
                  {lvl.diskCount}
                </Text>
                {/* Mini disk stack preview */}
                <View style={styles.miniDisks}>
                  {Array.from({ length: lvl.diskCount }).map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.miniDisk,
                        {
                          width: 14 + (lvl.diskCount - i) * 5,
                          backgroundColor: isSelected
                            ? colors.primary.contrast
                            : colors.game[`disk${(i % 5) + 1}` as keyof typeof colors.game],
                        },
                      ]}
                    />
                  ))}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Play button */}
        <Animated.View style={{ transform: [{ scale: playButtonScale }] }}>
          <Pressable onPress={handlePlay} style={styles.playButton}>
            <Text style={styles.playButtonIcon}>▶</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>

      {/* Victory overlay */}
      {isVictory && (
        <Animated.View entering={FadeIn} style={styles.victoryOverlay}>
          <Text style={styles.victoryEmoji}>🎉</Text>
          <Text style={styles.victoryText}>Bravo !</Text>
        </Animated.View>
      )}

      {/* Demo Modal */}
      <Modal
        visible={showDemo}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDemo(false)}
      >
        <View style={styles.demoOverlay}>
          <Animated.View entering={FadeIn} style={styles.demoModal}>
            <Pressable onPress={() => setShowDemo(false)} style={styles.demoCloseButton}>
              <Text style={styles.demoCloseText}>✕</Text>
            </Pressable>

            <Text style={styles.demoTitle}>Comment jouer</Text>

            <View style={styles.demoArea}>
              <View style={styles.demoPlatform} />
              <View style={styles.demoTowers}>
                <View style={styles.demoTowerContainer}>
                  <View style={styles.demoTowerPole} />
                  <Text style={styles.demoTowerLabel}>A</Text>
                  <View style={styles.demoDisksContainer}>
                    <Animated.View style={[styles.demoDiskStyle, styles.demoDiskSmall, demoDisk1Style]} />
                    <Animated.View style={[styles.demoDiskStyle, styles.demoDiskMedium, demoDisk2Style]} />
                    <View style={[styles.demoDiskStyle, styles.demoDiskLarge]} />
                  </View>
                </View>
                <View style={styles.demoTowerContainer}>
                  <View style={styles.demoTowerPole} />
                  <Text style={styles.demoTowerLabel}>B</Text>
                </View>
                <View style={styles.demoTowerContainer}>
                  <View style={[styles.demoTowerPole, styles.demoTowerPoleTarget]} />
                  <Text style={[styles.demoTowerLabel, styles.demoTowerLabelTarget]}>C</Text>
                </View>
              </View>
              <Animated.View style={[styles.fingerContainer, fingerStyle]}>
                <Text style={styles.fingerEmoji}>👆</Text>
              </Animated.View>
            </View>

            <View style={styles.demoHintContainer}>
              {demoStep === 0 && <Text style={styles.demoHint}>Déplace tous les disques de A vers C</Text>}
              {demoStep === 1 && <Text style={styles.demoHint}>Touche un disque pour le sélectionner...</Text>}
              {demoStep === 2 && <Text style={styles.demoHint}>Puis touche une tour pour le déposer</Text>}
              {demoStep === 3 && <Text style={styles.demoHint}>Continue jusqu'à empiler sur C !</Text>}
              {demoStep === 4 && <Text style={styles.demoHintBig}>À toi !</Text>}
            </View>

            <View style={styles.demoRules}>
              <Text style={styles.demoRule}>1 disque à la fois</Text>
              <Text style={styles.demoRuleSeparator}>•</Text>
              <Text style={styles.demoRule}>Grand sur petit = interdit</Text>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.game,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    marginBottom: spacing[2],
  },
  headerButton: {
    width: touchTargets.medium,
    height: touchTargets.medium,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  headerButtonText: {
    fontSize: 24,
    color: colors.text.primary,
  },
  headerTitle: {
    ...textStyles.h2,
    color: colors.text.primary,
  },
  helpButton: {
    width: touchTargets.medium,
    height: touchTargets.medium,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondary.main,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  helpButtonText: {
    fontSize: 20,
    color: colors.text.inverse,
    fontWeight: 'bold',
  },
  gameHud: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[2],
    gap: spacing[4],
  },
  hudItem: {
    alignItems: 'center',
  },
  hudLabel: {
    ...textStyles.caption,
    color: colors.text.muted,
  },
  hudValue: {
    ...textStyles.h2,
    color: colors.primary.main,
  },
  hudValueOptimal: {
    ...textStyles.h3,
    color: colors.feedback.success,
  },
  hudDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.background.secondary,
  },
  resetButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing[4],
    ...shadows.sm,
  },
  resetButtonText: {
    fontSize: 20,
    color: colors.text.secondary,
  },
  boardContainer: {
    flex: 1,
  },
  selectorContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  selectorTitle: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginBottom: spacing[4],
  },
  levelButtons: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[5],
  },
  levelButton: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    alignItems: 'center',
    minWidth: 56,
    borderWidth: 3,
    borderColor: 'transparent',
    ...shadows.sm,
  },
  levelButtonSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.main,
  },
  levelButtonNumber: {
    ...textStyles.h2,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  levelButtonNumberSelected: {
    color: colors.primary.contrast,
  },
  miniDisks: {
    alignItems: 'center',
    gap: 2,
  },
  miniDisk: {
    height: 5,
    borderRadius: 2.5,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  playButtonIcon: {
    fontSize: 28,
    color: colors.primary.contrast,
    marginLeft: 4,
  },
  victoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  victoryEmoji: {
    fontSize: 80,
    marginBottom: spacing[4],
  },
  victoryText: {
    ...textStyles.gameTitle,
    color: colors.primary.contrast,
  },

  // Demo styles
  demoOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoModal: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    width: '90%',
    maxWidth: 500,
    alignItems: 'center',
    ...shadows.lg,
  },
  demoCloseButton: {
    position: 'absolute',
    top: spacing[3],
    right: spacing[3],
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoCloseText: {
    fontSize: 18,
    color: colors.text.secondary,
  },
  demoTitle: {
    ...textStyles.h2,
    color: colors.text.primary,
    marginBottom: spacing[5],
  },
  demoArea: {
    width: '100%',
    height: 200,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  demoPlatform: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 12,
    backgroundColor: colors.game.towerBase,
    borderRadius: 6,
  },
  demoTowers: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    height: 160,
  },
  demoTowerContainer: {
    alignItems: 'center',
    width: 100,
  },
  demoTowerPole: {
    width: 8,
    height: 120,
    backgroundColor: colors.game.towerBase,
    borderRadius: 4,
  },
  demoTowerPoleTarget: {
    backgroundColor: colors.feedback.success,
  },
  demoTowerLabel: {
    marginTop: spacing[1],
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.secondary,
  },
  demoTowerLabelTarget: {
    color: colors.feedback.success,
  },
  demoDisksContainer: {
    position: 'absolute',
    bottom: 24,
    alignItems: 'center',
  },
  demoDiskStyle: {
    height: 20,
    borderRadius: 10,
    marginBottom: 2,
  },
  demoDiskSmall: {
    width: 40,
    backgroundColor: colors.game.disk1,
    zIndex: 3,
  },
  demoDiskMedium: {
    width: 60,
    backgroundColor: colors.game.disk2,
    zIndex: 2,
  },
  demoDiskLarge: {
    width: 80,
    backgroundColor: colors.game.disk3,
    zIndex: 1,
  },
  fingerContainer: {
    position: 'absolute',
    left: '16.5%',
    bottom: 100,
    zIndex: 10,
  },
  fingerEmoji: {
    fontSize: 40,
  },
  demoHintContainer: {
    marginTop: spacing[4],
    minHeight: 40,
    justifyContent: 'center',
  },
  demoHint: {
    ...textStyles.body,
    color: colors.primary.main,
    textAlign: 'center',
  },
  demoHintBig: {
    ...textStyles.h2,
    color: colors.feedback.success,
    textAlign: 'center',
  },
  demoRules: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[4],
    gap: spacing[3],
  },
  demoRule: {
    ...textStyles.caption,
    color: colors.text.muted,
  },
  demoRuleSeparator: {
    color: colors.text.muted,
  },
});
