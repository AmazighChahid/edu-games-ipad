/**
 * Hanoi unified screen - Intro + Game with seamless transition
 * The game board is always visible and updates based on selected level
 * When user moves a disk OR taps play, transition to game mode
 *
 * Features:
 * - Level selection with disk count preview
 * - Micro-objectives display during gameplay
 * - Blocage detection with strategy pause
 * - Animated hints system
 * - Parent zone with method explanation
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';

import { colors, spacing, textStyles, borderRadius, shadows, touchTargets } from '@/theme';
import {
  DraggableGameBoard,
  VictoryOverlay,
  GameBackground,
  MascotOwl,
  ProgressPanel,
  TowerLabel,
  FloatingButtons,
} from '../components';
import { useHanoiGame } from '../hooks/useHanoiGame';
import { hanoiLevels } from '../data/levels';
import { ParentZone, type GameMode } from '@/components/parent/ParentZone';
import { useStore } from '@/store/useStore';
import type { HanoiLevelConfig, TowerId } from '../types';

// Owl messages based on game state
type OwlMessageType = 'intro' | 'hint' | 'error' | 'encourage' | 'victory';

const getOwlMessage = (
  isPlaying: boolean,
  isVictory: boolean,
  consecutiveInvalid: number,
  progress: number
): { message: string; type: OwlMessageType } => {
  if (isVictory) {
    return { message: 'Bravo ! Tu as réussi ! 🎉', type: 'victory' };
  }
  if (consecutiveInvalid >= 2) {
    return { message: 'Oups ! Un grand anneau ne peut pas aller sur un petit 🤔', type: 'error' };
  }
  if (progress > 0.7) {
    return { message: 'Tu y es presque ! Continue comme ça 💪', type: 'encourage' };
  }
  if (!isPlaying) {
    return { message: 'Déplace un seul anneau à la fois ! Le plus gros reste en dessous 🎯', type: 'intro' };
  }
  return { message: 'Continue, tu te débrouilles bien ! ✨', type: 'intro' };
};

// Micro-objectifs selon la progression
const getMicroObjective = (progress: number): string => {
  if (progress < 0.3) {
    return 'Libérer le grand disque';
  } else if (progress < 0.6) {
    return 'Construire une pile provisoire';
  } else {
    return 'Recomposer la pile finale';
  }
};

export function HanoiIntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Tutorial state from store
  const hasSeenHanoiTutorial = useStore((state) => state.hasSeenHanoiTutorial);
  const setHasSeenHanoiTutorial = useStore((state) => state.setHasSeenHanoiTutorial);

  // Game state
  const [selectedLevel, setSelectedLevel] = useState<HanoiLevelConfig>(hanoiLevels[1]); // Default 3 disks
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLevelId, setCurrentLevelId] = useState<string>(hanoiLevels[1].id);

  // Demo state
  const [showDemo, setShowDemo] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const demoTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Auto-show demo on first launch
  useEffect(() => {
    if (!hasSeenHanoiTutorial) {
      // Small delay to let the screen render first
      const timer = setTimeout(() => {
        setShowDemo(true);
        setHasSeenHanoiTutorial();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasSeenHanoiTutorial, setHasSeenHanoiTutorial]);

  // Parent zone state
  const [showParentZone, setShowParentZone] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('discovery');
  const [hintsUsed, setHintsUsed] = useState(0);

  // Gameplay UI state
  const [showRulesOverlay, setShowRulesOverlay] = useState(false);
  const [showStrategyPause, setShowStrategyPause] = useState(false);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [highlightedTowers, setHighlightedTowers] = useState<{source: TowerId, target: TowerId} | null>(null);

  // Blocage detection
  const lastMoveTimeRef = useRef<number>(Date.now());
  const blockageCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Hints based on mode
  const maxHints = gameMode === 'discovery' ? 99 : gameMode === 'challenge' ? 3 : 0;
  const hintsRemaining = Math.max(0, maxHints - hintsUsed);

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

  // Use the actual game hook (no navigation - overlay handles victory)
  const {
    gameState,
    level,
    moveCount,
    consecutiveInvalid,
    isVictory,
    hasMovedOnce,
    timeElapsed,
    performMove,
    reset,
    getHint,
    playHint,
  } = useHanoiGame({
    levelId: currentLevelId,
  });

  // Hint animation
  const hintPulse = useSharedValue(1);

  // Calculate progress for micro-objective
  const targetDisks = level.diskCount;
  const disksOnTarget = gameState.towers[2].disks.length;
  const progress = disksOnTarget / targetDisks;
  const microObjective = getMicroObjective(progress);

  // Get owl message based on current game state
  const owlState = getOwlMessage(isPlaying, isVictory, consecutiveInvalid, progress);

  // Update last move time on each move
  useEffect(() => {
    lastMoveTimeRef.current = Date.now();
  }, [moveCount]);

  // Blocage detection
  useEffect(() => {
    if (!isPlaying || isVictory) return;

    blockageCheckRef.current = setInterval(() => {
      const idleTime = (Date.now() - lastMoveTimeRef.current) / 1000;

      // Trigger pause stratégie if:
      // - 3+ invalid moves quickly OR
      // - 25+ seconds idle
      if ((consecutiveInvalid >= 3 || idleTime >= 25) && !showStrategyPause) {
        setShowStrategyPause(true);
      }
    }, 5000);

    return () => {
      if (blockageCheckRef.current) {
        clearInterval(blockageCheckRef.current);
      }
    };
  }, [isPlaying, consecutiveInvalid, isVictory, showStrategyPause]);

  // Animated hint handler
  const handleHint = useCallback(() => {
    if (hintsRemaining > 0 && !isVictory) {
      setHintsUsed((prev) => prev + 1);

      hintPulse.value = withSequence(
        withTiming(1.2, { duration: 150 }),
        withTiming(1, { duration: 150 })
      );

      const hint = getHint();
      if (hint) {
        const towerNames = ['A', 'B', 'C'];
        setHintMessage(`Déplace vers ${towerNames[hint.to]}`);

        // Highlight source and target towers
        setHighlightedTowers({ source: hint.from, target: hint.to });

        setTimeout(() => {
          playHint();
          setHintMessage(null);
          setHighlightedTowers(null);
        }, 1500);
      }
    }
  }, [hintsRemaining, isVictory, getHint, playHint, hintPulse]);

  // Strategy pause handlers
  const handleStrategyHint = () => {
    setShowStrategyPause(false);
    handleHint();
  };

  const handleStrategyDemo = () => {
    setShowStrategyPause(false);
    playHint();
    setTimeout(() => {
      if (!isVictory) playHint();
    }, 1000);
  };

  const handleStrategyContinue = () => {
    setShowStrategyPause(false);
  };

  const handleModeChange = (mode: GameMode) => {
    setGameMode(mode);
    setHintsUsed(0);
    reset();
  };

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

  // Function to transition to play mode
  const transitionToPlayMode = useCallback(() => {
    if (isPlaying) return;

    // Slide selector down and fade out
    selectorY.value = withTiming(150, { duration: 400, easing: Easing.out(Easing.quad) });
    selectorOpacity.value = withTiming(0, { duration: 300 });

    // Fade in game HUD
    hudOpacity.value = withDelay(200, withTiming(1, { duration: 300 }));

    // Start playing after animation
    setTimeout(() => {
      setIsPlaying(true);
    }, 300);
  }, [isPlaying, selectorY, selectorOpacity, hudOpacity]);

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

    transitionToPlayMode();
  };

  const handleReset = () => {
    reset();
  };

  const handleMove = (from: TowerId, to: TowerId) => {
    if (isVictory) return;

    // If not playing yet, transition to play mode on first move
    if (!isPlaying) {
      transitionToPlayMode();
    }

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
    <GameBackground>
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + spacing[2],
            paddingBottom: insets.bottom + spacing[2],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>←</Text>
          </Pressable>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerEmoji}>🏰</Text>
            <Text style={styles.headerTitle}>La Tour Magique</Text>
            <Text style={styles.headerEmoji}>✨</Text>
          </View>

          <View style={styles.headerRightButtons}>
            <Pressable onPress={() => setShowParentZone(!showParentZone)} style={styles.parentButton}>
              <Text style={styles.parentButtonIcon}>👨‍👩‍👧</Text>
            </Pressable>

            <Pressable onPress={() => setShowDemo(true)} style={styles.helpButton}>
              <Text style={styles.helpButtonText}>?</Text>
            </Pressable>
          </View>
        </View>

        {/* Mascot Owl - shows contextual messages */}
        <MascotOwl
          message={owlState.message}
          messageType={owlState.type}
          visible={!isVictory}
        />

        {/* Progress Panel - shows when playing */}
        {isPlaying && (
          <ProgressPanel
            currentMoves={moveCount}
            optimalMoves={level.optimalMoves ?? 7}
            progress={progress}
            visible={!isVictory}
          />
        )}

      {/* Level Selector - At top, slides down when playing */}
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

      {/* Micro-objective - Appears when playing */}
      {isPlaying && !isVictory && (
        <Animated.View entering={FadeIn} style={styles.microObjective}>
          <Text style={styles.microObjectiveLabel}>Mini-but :</Text>
          <Text style={styles.microObjectiveText}>{microObjective}</Text>
        </Animated.View>
      )}

      {/* Game Board - Always visible, takes most of the space */}
      <View style={styles.boardContainer}>
        <DraggableGameBoard
          gameState={gameState}
          totalDisks={level.diskCount}
          onMove={handleMove}
          hasMovedOnce={hasMovedOnce}
          highlightedTowers={highlightedTowers}
        />
      </View>

      {/* Floating Action Buttons - Reset and Hint */}
      {isPlaying && !isVictory && (
        <FloatingButtons
          onReset={handleReset}
          onHint={handleHint}
          hintsRemaining={hintsRemaining}
          hintDisabled={gameMode === 'expert'}
          visible={true}
        />
      )}

      {/* Hint Toast */}
      {hintMessage && (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.hintToast}>
          <Text style={styles.hintToastText}>{hintMessage}</Text>
        </Animated.View>
      )}

      {/* Victory Overlay */}
      <VictoryOverlay
        visible={isVictory}
        moves={moveCount}
        optimalMoves={level.optimalMoves ?? 7}
        timeElapsed={timeElapsed}
        hintsUsed={3 - hintsRemaining}
        levelId={level.id}
        hasNextLevel={hanoiLevels.findIndex(l => l.id === selectedLevel.id) < hanoiLevels.length - 1}
        onNextLevel={() => {
          // Find next level
          const currentIndex = hanoiLevels.findIndex(l => l.id === selectedLevel.id);
          if (currentIndex < hanoiLevels.length - 1) {
            const nextLevel = hanoiLevels[currentIndex + 1];
            setSelectedLevel(nextLevel);
            setCurrentLevelId(nextLevel.id);
            reset();
            setIsPlaying(false);
            selectorY.value = withSpring(0, { damping: 15 });
            selectorOpacity.value = withTiming(1, { duration: 300 });
            hudOpacity.value = withTiming(0, { duration: 200 });
          }
        }}
        onReplay={() => {
          reset();
          setIsPlaying(false);
          selectorY.value = withSpring(0, { damping: 15 });
          selectorOpacity.value = withTiming(1, { duration: 300 });
          hudOpacity.value = withTiming(0, { duration: 200 });
        }}
        onHome={() => router.back()}
      />

      {/* Parent Zone */}
      <ParentZone
        progression={moveCount}
        maxProgression={level.optimalMoves ?? 7}
        hintsRemaining={hintsRemaining}
        maxHints={maxHints}
        currentMode={gameMode}
        onModeChange={handleModeChange}
        onHintPress={handleHint}
        isVisible={showParentZone}
      />

      {/* Rules Overlay Modal */}
      <Modal
        visible={showRulesOverlay}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRulesOverlay(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View entering={FadeIn} style={styles.rulesCard}>
            <Text style={styles.rulesTitle}>Les règles</Text>

            <View style={styles.ruleItem}>
              <View style={[styles.ruleIcon, { backgroundColor: colors.primary.main }]}>
                <Text style={styles.ruleIconText}>1</Text>
              </View>
              <Text style={styles.ruleText}>Déplace un seul disque à la fois</Text>
            </View>

            <View style={styles.ruleItem}>
              <View style={[styles.ruleIcon, { backgroundColor: colors.secondary.main }]}>
                <Text style={styles.ruleIconText}>2</Text>
              </View>
              <Text style={styles.ruleText}>Un grand disque ne peut pas aller sur un petit</Text>
            </View>

            <View style={styles.ruleItem}>
              <View style={[styles.ruleIcon, { backgroundColor: colors.feedback.success }]}>
                <Text style={styles.ruleIconText}>3</Text>
              </View>
              <Text style={styles.ruleText}>Empile tous les disques sur la tour C</Text>
            </View>

            <Pressable
              onPress={() => setShowRulesOverlay(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Compris !</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Modal>

      {/* Strategy Pause Modal */}
      <Modal
        visible={showStrategyPause}
        transparent
        animationType="fade"
        onRequestClose={handleStrategyContinue}
      >
        <View style={styles.modalOverlay}>
          <Animated.View entering={FadeIn} style={styles.strategyCard}>
            <Text style={styles.strategyTitle}>Besoin d'aide ?</Text>
            <Text style={styles.strategySubtitle}>
              Pas de souci ! Choisis une option :
            </Text>

            <View style={styles.strategyButtons}>
              <Pressable onPress={handleStrategyHint} style={styles.strategyButton}>
                <Text style={styles.strategyButtonIcon}>💡</Text>
                <Text style={styles.strategyButtonText}>Un indice</Text>
              </Pressable>

              <Pressable onPress={handleStrategyDemo} style={styles.strategyButton}>
                <Text style={styles.strategyButtonIcon}>▶️</Text>
                <Text style={styles.strategyButtonText}>Voir 2 coups</Text>
              </Pressable>

              <Pressable
                onPress={handleStrategyContinue}
                style={[styles.strategyButton, styles.strategyButtonOutline]}
              >
                <Text style={styles.strategyButtonTextOutline}>Je continue seul</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>

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
    </GameBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Transparent pour laisser voir le GameBackground
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
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  headerTitle: {
    ...textStyles.h2,
    color: colors.text.primary,
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
    height: 40,
    paddingHorizontal: spacing[3],
    borderRadius: 20,
    backgroundColor: '#FFA94D',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing[1],
    ...shadows.sm,
  },
  parentButtonIcon: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    backgroundColor: '#E8943D',
    width: 22,
    height: 22,
    borderRadius: 11,
    textAlign: 'center',
    lineHeight: 22,
    overflow: 'hidden',
  },
  parentButtonLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
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
    fontSize: 16,
    color: colors.text.inverse,
    fontWeight: 'bold',
  },
  selectorContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  selectorTitle: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginBottom: spacing[3],
  },
  levelButtons: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[4],
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
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  playButtonIcon: {
    fontSize: 24,
    color: colors.primary.contrast,
    marginLeft: 3,
  },
  gameHud: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
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
    minHeight: 300,
  },

  // Micro-objective styles
  microObjective: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    alignSelf: 'center',
    marginBottom: spacing[2],
    ...shadows.sm,
  },
  microObjectiveLabel: {
    ...textStyles.caption,
    color: colors.text.secondary,
    marginRight: spacing[2],
  },
  microObjectiveText: {
    ...textStyles.body,
    color: colors.primary.main,
    fontWeight: '600',
  },

  // Hint toast
  hintToast: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: colors.primary.main,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    borderRadius: borderRadius.xl,
    ...shadows.lg,
  },
  hintToastText: {
    ...textStyles.h3,
    color: colors.primary.contrast,
  },

  // Modal overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Rules card
  rulesCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    width: 320,
    ...shadows.lg,
  },
  rulesTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing[5],
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  ruleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleIconText: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: 'bold',
  },
  ruleText: {
    ...textStyles.body,
    color: colors.text.primary,
    flex: 1,
  },

  // Strategy pause card
  strategyCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    width: 340,
    alignItems: 'center',
    ...shadows.lg,
  },
  strategyTitle: {
    ...textStyles.h2,
    color: colors.primary.main,
    marginBottom: spacing[2],
  },
  strategySubtitle: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing[6],
  },
  strategyButtons: {
    width: '100%',
    gap: spacing[3],
  },
  strategyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary.main,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    borderRadius: borderRadius.xl,
    gap: spacing[2],
  },
  strategyButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.text.muted,
  },
  strategyButtonIcon: {
    fontSize: 20,
  },
  strategyButtonText: {
    ...textStyles.body,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  strategyButtonTextOutline: {
    ...textStyles.body,
    color: colors.text.primary,
    fontWeight: '600',
  },

  // Close button
  closeButton: {
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing[3],
    marginTop: spacing[6],
    alignItems: 'center',
    width: '100%',
  },
  closeButtonText: {
    ...textStyles.body,
    color: colors.primary.contrast,
    fontWeight: 'bold',
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
