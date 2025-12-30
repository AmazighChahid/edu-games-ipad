/**
 * Embouteillage - Victory Screen
 * Affiche les résultats après avoir libéré la voiture rouge
 */

import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  FadeIn,
  SlideInUp,
} from 'react-native-reanimated';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

import { useStore, useGameProgress } from '../../../src/store/useStore';
import { spacing, borderRadius, shadows, fontFamily, colors, fontSize } from '../../../src/theme';

// ============================================
// TYPES
// ============================================

interface VictoryParams {
  moves: string;
  minMoves: string;
  hintsUsed: string;
  totalTime: string;
  level: string;
}

// ============================================
// HELPERS
// ============================================

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds}s`;
}

function calculateStars(moves: number, minMoves: number, hintsUsed: number): 0 | 1 | 2 | 3 {
  if (moves <= minMoves && hintsUsed === 0) return 3;
  if (moves <= minMoves * 1.5 && hintsUsed <= 1) return 2;
  if (moves <= minMoves * 2) return 1;
  return 0;
}

// ============================================
// CAR ANIMATION COMPONENT
// ============================================

function AnimatedCar() {
  const translateX = useSharedValue(-100);

  useEffect(() => {
    translateX.value = withDelay(
      500,
      withSpring(150, { damping: 12, stiffness: 80 })
    );
  }, []);

  const carStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[styles.carContainer, carStyle]}>
      <Svg width="120" height="60" viewBox="0 0 120 60">
        {/* Car body */}
        <Rect x="10" y="20" width="100" height="30" rx="8" fill="#E53935" />
        {/* Car roof */}
        <Path
          d="M 30 20 Q 35 5 60 5 Q 85 5 90 20"
          fill="#C62828"
        />
        {/* Windows */}
        <Rect x="35" y="8" width="20" height="12" rx="3" fill="rgba(100, 200, 255, 0.8)" />
        <Rect x="60" y="8" width="20" height="12" rx="3" fill="rgba(100, 200, 255, 0.8)" />
        {/* Wheels */}
        <Circle cx="30" cy="50" r="10" fill="#333" />
        <Circle cx="30" cy="50" r="5" fill="#666" />
        <Circle cx="90" cy="50" r="10" fill="#333" />
        <Circle cx="90" cy="50" r="5" fill="#666" />
        {/* Headlights */}
        <Rect x="105" y="28" width="5" height="8" rx="2" fill="#FFD700" />
      </Svg>
    </Animated.View>
  );
}

// ============================================
// STAR COMPONENT
// ============================================

function Star({ filled, delay }: { filled: boolean; delay: number }) {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(-30);

  useEffect(() => {
    scale.value = withDelay(delay, withSpring(1, { damping: 8, stiffness: 150 }));
    rotation.value = withDelay(delay, withSpring(0, { damping: 10, stiffness: 100 }));
  }, []);

  const starStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <Animated.View style={starStyle}>
      <Text style={[styles.star, !filled && styles.starEmpty]}>
        {filled ? '⭐' : '☆'}
      </Text>
    </Animated.View>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function EmbouteillageVictoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<VictoryParams>();
  const completeLevel = useStore((state) => state.completeLevel);

  const moves = parseInt(params.moves || '0', 10);
  const minMoves = parseInt(params.minMoves || '1', 10);
  const hintsUsed = parseInt(params.hintsUsed || '0', 10);
  const totalTime = parseInt(params.totalTime || '0', 10);
  const level = parseInt(params.level || '1', 10);

  const stars = useMemo(() => calculateStars(moves, minMoves, hintsUsed), [moves, minMoves, hintsUsed]);

  // Save progress
  useEffect(() => {
    completeLevel('embouteillage', `level_${level}`, stars);
  }, [completeLevel, level, stars]);

  const isOptimal = moves <= minMoves;

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      {/* Animated car */}
      <AnimatedCar />

      {/* Victory text */}
      <Animated.View entering={SlideInUp.delay(200).springify()}>
        <Text style={styles.title}>
          {isOptimal ? '🏆 PARFAIT !' : '🎉 BRAVO !'}
        </Text>
        <Text style={styles.subtitle}>
          Voiture libérée !
        </Text>
      </Animated.View>

      {/* Stars */}
      <Animated.View entering={FadeIn.delay(400)} style={styles.starsContainer}>
        <Star filled={stars >= 1} delay={600} />
        <Star filled={stars >= 2} delay={800} />
        <Star filled={stars >= 3} delay={1000} />
      </Animated.View>

      {/* Stats */}
      <Animated.View entering={FadeIn.delay(800)} style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{moves}</Text>
          <Text style={styles.statLabel}>Coups</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{minMoves}</Text>
          <Text style={styles.statLabel}>Optimal</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatTime(totalTime)}</Text>
          <Text style={styles.statLabel}>Temps</Text>
        </View>
      </Animated.View>

      {/* Message */}
      <Animated.View entering={FadeIn.delay(1000)} style={styles.messageContainer}>
        <Text style={styles.message}>
          {isOptimal && hintsUsed === 0
            ? "Incroyable ! Solution optimale sans indice !"
            : isOptimal
            ? "Solution optimale trouvée !"
            : moves <= minMoves * 1.5
            ? "Très bien joué !"
            : "Tu as réussi ! Essaie de faire moins de coups."
          }
        </Text>
      </Animated.View>

      {/* Buttons */}
      <Animated.View entering={FadeIn.delay(1200)} style={styles.buttonsContainer}>
        <Pressable
          style={styles.buttonSecondary}
          onPress={() => router.replace({
            pathname: '/(games)/13-embouteillage',
            params: { level: level.toString() },
          })}
          accessibilityLabel="Rejouer ce niveau"
          accessibilityRole="button"
        >
          <Text style={styles.buttonSecondaryText}>🔄 Rejouer</Text>
        </Pressable>

        <Pressable
          style={styles.buttonPrimary}
          onPress={() => router.replace({
            pathname: '/(games)/13-embouteillage',
            params: { level: (level + 1).toString() },
          })}
          accessibilityLabel="Passer au niveau suivant"
          accessibilityRole="button"
        >
          <Text style={styles.buttonPrimaryText}>Niveau suivant ➡️</Text>
        </Pressable>
      </Animated.View>

      {/* Home button */}
      <Animated.View entering={FadeIn.delay(1400)}>
        <Pressable
          style={styles.homeButton}
          onPress={() => router.replace('/')}
          accessibilityLabel="Retour à l'accueil"
          accessibilityRole="button"
        >
          <Text style={styles.homeButtonText}>🏠 Retour à l'accueil</Text>
        </Pressable>
      </Animated.View>
    </LinearGradient>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[6],
  },

  carContainer: {
    marginBottom: spacing[6],
  },

  title: {
    fontSize: 36,
    fontFamily: fontFamily.bold,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing[2],
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },

  subtitle: {
    fontSize: 20,
    fontFamily: fontFamily.semiBold,
    color: '#48BB78',
    textAlign: 'center',
    marginBottom: spacing[6],
  },

  starsContainer: {
    flexDirection: 'row',
    gap: spacing[4],
    marginBottom: spacing[6],
  },

  star: {
    fontSize: 48,
  },

  starEmpty: {
    opacity: 0.3,
  },

  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    gap: spacing[6],
    marginBottom: spacing[6],
  },

  statItem: {
    alignItems: 'center',
    minWidth: 70,
  },

  statValue: {
    fontSize: 28,
    fontFamily: fontFamily.bold,
    color: '#FFFFFF',
  },

  statLabel: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: spacing[1],
  },

  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  messageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    marginBottom: spacing[6],
  },

  message: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    color: '#FFFFFF',
    textAlign: 'center',
  },

  buttonsContainer: {
    flexDirection: 'row',
    gap: spacing[4],
    marginBottom: spacing[4],
  },

  buttonPrimary: {
    backgroundColor: '#E53935',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    borderRadius: borderRadius.round,
    ...shadows.md,
  },

  buttonPrimaryText: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
    color: '#FFFFFF',
  },

  buttonSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    borderRadius: borderRadius.round,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  buttonSecondaryText: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    color: '#FFFFFF',
  },

  homeButton: {
    padding: spacing[3],
  },

  homeButtonText: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
