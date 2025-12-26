/**
 * MatricesVictoryScreen - Victory celebration screen
 * Shows stars, collectible card, and stats with animations
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Pressable,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  withRepeat,
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInUp,
  BounceIn,
  ZoomIn,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { WorldTheme, CollectibleCard } from '../types';
import { WORLDS, COLLECTIBLE_CARDS, PIXEL_DIALOGUES } from '../data';
import { PixelMascot, PixelWithBubble } from '../components';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ============================================================================
// CONFETTI COMPONENT
// ============================================================================

const CONFETTI_COLORS = ['#FF6B6B', '#5B8DEE', '#7BC74D', '#FFD93D', '#A29BFE', '#FFB347'];

interface ConfettiPieceProps {
  index: number;
  color: string;
}

const ConfettiPiece = ({ index, color }: ConfettiPieceProps) => {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const startX = Math.random() * SCREEN_WIDTH;
    const endX = startX + (Math.random() - 0.5) * 100;

    translateX.value = startX;
    translateY.value = withDelay(
      index * 50,
      withTiming(SCREEN_HEIGHT + 50, {
        duration: 2000 + Math.random() * 1000,
        easing: Easing.out(Easing.quad),
      })
    );

    rotation.value = withDelay(
      index * 50,
      withRepeat(
        withTiming(360, { duration: 1000 }),
        -1,
        false
      )
    );

    opacity.value = withDelay(
      2000 + index * 50,
      withTiming(0, { duration: 500 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.confettiPiece,
        { backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
};

const ConfettiCannon = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {Array.from({ length: 30 }).map((_, i) => (
      <ConfettiPiece
        key={i}
        index={i}
        color={CONFETTI_COLORS[i % CONFETTI_COLORS.length]}
      />
    ))}
  </View>
);

// ============================================================================
// ANIMATED STAR COMPONENT
// ============================================================================

interface AnimatedStarProps {
  earned: boolean;
  delay: number;
  index: number;
}

const AnimatedStar = ({ earned, delay, index }: AnimatedStarProps) => {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(-30);

  useEffect(() => {
    if (earned) {
      scale.value = withDelay(
        delay,
        withSequence(
          withSpring(1.3, { damping: 6, stiffness: 100 }),
          withSpring(1, { damping: 10 })
        )
      );
      rotation.value = withDelay(
        delay,
        withSequence(
          withTiming(10, { duration: 200 }),
          withTiming(0, { duration: 200 })
        )
      );
      // Haptic feedback when star appears
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }, delay);
    } else {
      scale.value = withDelay(delay, withSpring(1));
    }
  }, [earned, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <Animated.Text
      style={[
        styles.star,
        earned ? styles.starEarned : styles.starEmpty,
        animatedStyle,
      ]}
    >
      ⭐
    </Animated.Text>
  );
};

// ============================================================================
// COLLECTIBLE CARD COMPONENT
// ============================================================================

interface CardRevealProps {
  card: CollectibleCard | null;
}

const CardReveal = ({ card }: CardRevealProps) => {
  const flipProgress = useSharedValue(0);
  const [showFront, setShowFront] = useState(false);

  useEffect(() => {
    if (card) {
      // Flip animation after delay
      flipProgress.value = withDelay(
        1500,
        withSpring(180, { damping: 12 })
      );

      setTimeout(() => {
        setShowFront(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }, 1800);
    }
  }, [card]);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${flipProgress.value}deg` },
    ],
    opacity: flipProgress.value > 90 ? 1 : 0,
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${flipProgress.value}deg` },
    ],
    opacity: flipProgress.value <= 90 ? 1 : 0,
  }));

  if (!card) return null;

  const rarityColors = {
    common: ['#90A4AE', '#78909C'],
    rare: ['#5B8DEE', '#3D5AFE'],
    epic: ['#A29BFE', '#7C4DFF'],
    legendary: ['#FFD93D', '#FFB300'],
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(1200).duration(400)}
      style={styles.cardContainer}
    >
      <Text style={styles.cardTitle}>Carte débloquée !</Text>

      <View style={styles.cardWrapper}>
        {/* Back */}
        <Animated.View style={[styles.card, styles.cardBack, backStyle]}>
          <LinearGradient
            colors={['#4A4A4A', '#2A2A2A']}
            style={styles.cardGradient}
          >
            <Text style={styles.cardBackPattern}>?</Text>
          </LinearGradient>
        </Animated.View>

        {/* Front */}
        <Animated.View style={[styles.card, styles.cardFront, frontStyle]}>
          <LinearGradient
            colors={rarityColors[card.rarity] as [string, string]}
            style={styles.cardGradient}
          >
            <Text style={styles.cardEmoji}>{card.emoji}</Text>
            <Text style={styles.cardName}>{card.name}</Text>
            <View style={styles.cardTraitContainer}>
              <Text style={styles.cardTraitIcon}>{card.traitIcon}</Text>
              <Text style={styles.cardTrait}>{card.trait}</Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

// ============================================================================
// STATS COMPONENT
// ============================================================================

interface StatsProps {
  puzzlesCompleted: number;
  hintsUsed: number;
  timeSeconds: number;
}

const Stats = ({ puzzlesCompleted, hintsUsed, timeSeconds }: StatsProps) => {
  const minutes = Math.floor(timeSeconds / 60);
  const seconds = timeSeconds % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <Animated.View
      entering={FadeInDown.delay(2000).duration(400)}
      style={styles.statsContainer}
    >
      <View style={styles.statItem}>
        <Text style={styles.statIcon}>🧩</Text>
        <Text style={styles.statValue}>{puzzlesCompleted}</Text>
        <Text style={styles.statLabel}>puzzles</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statIcon}>💡</Text>
        <Text style={styles.statValue}>{hintsUsed}</Text>
        <Text style={styles.statLabel}>indices</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statIcon}>⏱️</Text>
        <Text style={styles.statValue}>{timeString}</Text>
        <Text style={styles.statLabel}>temps</Text>
      </View>
    </Animated.View>
  );
};

// ============================================================================
// VICTORY SCREEN COMPONENT
// ============================================================================

export function MatricesVictoryScreen() {
  const params = useLocalSearchParams<{
    worldId: WorldTheme;
    puzzlesCompleted?: string;
    hintsUsed?: string;
    timeSeconds?: string;
    starsEarned?: string;
  }>();

  const worldId = (params.worldId || 'forest') as WorldTheme;
  const puzzlesCompleted = parseInt(params.puzzlesCompleted || '8', 10);
  const hintsUsed = parseInt(params.hintsUsed || '0', 10);
  const timeSeconds = parseInt(params.timeSeconds || '180', 10);
  const starsEarned = parseInt(params.starsEarned || '2', 10);

  const world = WORLDS[worldId];

  // Get a random card for this world
  const [unlockedCard] = useState<CollectibleCard | null>(() => {
    const worldCards = COLLECTIBLE_CARDS.filter((c) => c.worldId === worldId);
    if (worldCards.length === 0) return null;
    return worldCards[Math.floor(Math.random() * worldCards.length)];
  });

  // Get random celebration message
  const [message] = useState(() => {
    const messages = PIXEL_DIALOGUES.world_complete;
    return messages[Math.floor(Math.random() * messages.length)];
  });

  // Handle navigation
  const handleNextWorld = useCallback(() => {
    // Navigate to next world or back to intro
    router.replace('/(games)/matrices-magiques/');
  }, []);

  const handleReplay = useCallback(() => {
    router.replace({
      pathname: '/(games)/matrices-magiques/puzzle',
      params: { worldId },
    });
  }, [worldId]);

  const handleHome = useCallback(() => {
    router.replace('/(games)/matrices-magiques/');
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background */}
      <LinearGradient
        colors={world.gradientColors as [string, string]}
        style={StyleSheet.absoluteFill}
      />

      {/* Confetti */}
      <ConfettiCannon />

      {/* Rotating rays background */}
      <RotatingRays color={world.primaryColor} />

      <SafeAreaView style={styles.safeArea}>
        {/* Title */}
        <Animated.View
          entering={BounceIn.delay(300).duration(600)}
          style={styles.titleContainer}
        >
          <Text style={styles.title}>MALIN !</Text>
        </Animated.View>

        {/* Stars */}
        <Animated.View
          entering={FadeIn.delay(500).duration(400)}
          style={styles.starsContainer}
        >
          <AnimatedStar earned={starsEarned >= 1} delay={600} index={0} />
          <AnimatedStar earned={starsEarned >= 2} delay={800} index={1} />
          <AnimatedStar earned={starsEarned >= 3} delay={1000} index={2} />
        </Animated.View>

        {/* Mascot */}
        <Animated.View
          entering={SlideInUp.delay(1200).duration(400).springify()}
          style={styles.mascotArea}
        >
          <View style={styles.mascotRow}>
            <PixelMascot mood="celebrating" size="medium" animated={true} />
          </View>
          <Text style={styles.mascotMessage}>{message}</Text>
        </Animated.View>

        {/* Card */}
        <CardReveal card={unlockedCard} />

        {/* Stats */}
        <Stats
          puzzlesCompleted={puzzlesCompleted}
          hintsUsed={hintsUsed}
          timeSeconds={timeSeconds}
        />

        {/* Buttons */}
        <Animated.View
          entering={FadeInUp.delay(2500).duration(400)}
          style={styles.buttonsContainer}
        >
          <Pressable
            onPress={handleNextWorld}
            style={[styles.button, styles.primaryButton]}
          >
            <Text style={styles.primaryButtonText}>Monde suivant</Text>
          </Pressable>

          <View style={styles.secondaryButtons}>
            <Pressable
              onPress={handleReplay}
              style={[styles.button, styles.secondaryButton]}
            >
              <Text style={styles.secondaryButtonText}>Rejouer</Text>
            </Pressable>

            <Pressable
              onPress={handleHome}
              style={[styles.button, styles.secondaryButton]}
            >
              <Text style={styles.secondaryButtonText}>Accueil</Text>
            </Pressable>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

// ============================================================================
// ROTATING RAYS COMPONENT
// ============================================================================

interface RotatingRaysProps {
  color: string;
}

const RotatingRays = ({ color }: RotatingRaysProps) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 30000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[styles.raysContainer, animatedStyle]}>
      {Array.from({ length: 12 }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.ray,
            {
              backgroundColor: color + '20',
              transform: [{ rotate: `${i * 30}deg` }],
            },
          ]}
        />
      ))}
    </Animated.View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  // Confetti
  confettiPiece: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  // Rotating rays
  raysContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ray: {
    position: 'absolute',
    width: 2000,
    height: 40,
  },
  // Title
  titleContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Fredoka-Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  // Stars
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  star: {
    fontSize: 48,
  },
  starEarned: {
    opacity: 1,
  },
  starEmpty: {
    opacity: 0.3,
  },
  // Mascot
  mascotArea: {
    alignItems: 'center',
    marginBottom: 16,
  },
  mascotRow: {
    marginBottom: 8,
  },
  mascotMessage: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Nunito-SemiBold',
    maxWidth: 280,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // Card
  cardContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
    fontFamily: 'Nunito-Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardWrapper: {
    width: 140,
    height: 180,
  },
  card: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    zIndex: 1,
  },
  cardFront: {
    zIndex: 2,
  },
  cardGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  cardBackPattern: {
    fontSize: 64,
    color: 'rgba(255, 255, 255, 0.2)',
    fontWeight: '900',
  },
  cardEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Fredoka-Bold',
  },
  cardTraitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardTraitIcon: {
    fontSize: 14,
  },
  cardTrait: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Nunito-Medium',
  },
  // Stats
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    fontFamily: 'Fredoka-Bold',
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
    fontFamily: 'Nunito-Regular',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  // Buttons
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    fontFamily: 'Fredoka-Bold',
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    flex: 1,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Nunito-SemiBold',
  },
});
