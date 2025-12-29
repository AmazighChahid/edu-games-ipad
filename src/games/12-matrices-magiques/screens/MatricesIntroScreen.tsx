/**
 * MatricesIntroScreen - World selection screen
 * Entry point for Matrices Magiques game
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown, SlideInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { WorldTheme, WorldProgress } from '../types';
import { WORLDS, WORLD_ORDER, PIXEL_DIALOGUES } from '../data';
import { WorldSelector, PixelWithBubble } from '../components';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ============================================================================
// TYPES
// ============================================================================

interface MatricesIntroScreenProps {
  // Progress can come from props or store
  initialProgress?: Record<WorldTheme, WorldProgress>;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getRandomDialogue(): string {
  const dialogues = PIXEL_DIALOGUES.intro;
  return dialogues[Math.floor(Math.random() * dialogues.length)];
}

function createDefaultProgress(): Record<WorldTheme, WorldProgress> {
  const progress: Record<WorldTheme, WorldProgress> = {} as any;

  WORLD_ORDER.forEach((worldId) => {
    const world = WORLDS[worldId];
    progress[worldId] = {
      worldId,
      isUnlocked: true, // All worlds unlocked by default
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

// ============================================================================
// STATS HEADER COMPONENT
// ============================================================================

interface StatsHeaderProps {
  totalStars: number;
  totalPuzzles: number;
  completedPuzzles: number;
}

const StatsHeader = ({ totalStars, totalPuzzles, completedPuzzles }: StatsHeaderProps) => (
  <Animated.View
    entering={FadeInDown.delay(200).duration(300)}
    style={styles.statsContainer}
  >
    <View style={styles.statItem}>
      <Text style={styles.statIcon}>⭐</Text>
      <Text style={styles.statValue}>{totalStars}</Text>
      <Text style={styles.statLabel}>étoiles</Text>
    </View>
    <View style={styles.statDivider} />
    <View style={styles.statItem}>
      <Text style={styles.statIcon}>🧩</Text>
      <Text style={styles.statValue}>{completedPuzzles}/{totalPuzzles}</Text>
      <Text style={styles.statLabel}>puzzles</Text>
    </View>
  </Animated.View>
);

// ============================================================================
// INTRO SCREEN COMPONENT
// ============================================================================

export function MatricesIntroScreen({ initialProgress }: MatricesIntroScreenProps) {
  // Use provided progress or create default
  const [progress] = useState<Record<WorldTheme, WorldProgress>>(
    initialProgress || createDefaultProgress()
  );

  const [introMessage] = useState(getRandomDialogue());

  // Calculate stats
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

  // Handle world selection
  const handleWorldSelect = useCallback((worldId: WorldTheme) => {
    // Navigate to puzzle screen with selected world
    router.push({
      pathname: '/(games)/12-matrices-magiques/puzzle',
      params: { worldId },
    });
  }, []);

  // Handle back navigation
  const handleBack = useCallback(() => {
    router.back();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Background gradient */}
      <LinearGradient
        colors={['#F8F9FA', '#E8F4F8', '#F0F8FF']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Decorative elements */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View
            entering={FadeIn.duration(400)}
            style={styles.header}
          >
            <Text style={styles.title}>Matrices Magiques</Text>
            <Text style={styles.subtitle}>
              Trouve le motif caché !
            </Text>
          </Animated.View>

          {/* Stats */}
          <StatsHeader {...stats} />

          {/* Mascot greeting */}
          <Animated.View
            entering={SlideInUp.delay(300).duration(400).springify()}
            style={styles.mascotSection}
          >
            <PixelWithBubble
              message={introMessage}
              mood="happy"
              theme="forest"
              size="medium"
              animated={true}
            />
          </Animated.View>

          {/* World selector */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(400)}
            style={styles.selectorSection}
          >
            <WorldSelector
              progress={progress}
              onWorldSelect={handleWorldSelect}
            />
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  // Decorative elements
  decorativeCircle1: {
    position: 'absolute',
    top: -80,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(91, 141, 238, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: 100,
    left: -60,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(123, 199, 77, 0.1)',
  },
  // Header
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#5B8DEE',
    textAlign: 'center',
    fontFamily: 'Fredoka-Bold',
    textShadow: '0px 2px 4px rgba(91, 141, 238, 0.2)',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
    fontFamily: 'Nunito-Medium',
  },
  // Stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    fontFamily: 'Fredoka-Bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Nunito-Regular',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  // Mascot section
  mascotSection: {
    marginTop: 20,
    marginHorizontal: 8,
  },
  // World selector section
  selectorSection: {
    marginTop: 8,
  },
});
