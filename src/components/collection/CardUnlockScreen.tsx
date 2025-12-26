/**
 * CardUnlockScreen Component
 * Full-screen celebration animation when a new card is unlocked
 */

import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  interpolate,
  runOnJS,
  cancelAnimation,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { Card, RARITY_CONFIG, getTotalCardsCount } from '@/data/cards';
import { COLORS } from '@/constants/colors';

interface CardUnlockScreenProps {
  card: Card;
  unlockedCount: number;
  onViewCollection: () => void;
  onContinue: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Confetti configuration
const CONFETTI_COLORS = ['#5B8DEE', '#FFB347', '#7BC74D', '#E056FD', '#FFD93D', '#FF6B6B'];
const CONFETTI_COUNT = 20;

// Ray configuration
const RAY_COUNT = 12;

export const CardUnlockScreen: React.FC<CardUnlockScreenProps> = ({
  card,
  unlockedCount,
  onViewCollection,
  onContinue,
}) => {
  // Animation values
  const titleScale = useSharedValue(0.5);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const cardRotateY = useSharedValue(180);
  const cardScale = useSharedValue(0.8);
  const infoOpacity = useSharedValue(0);
  const progressWidth = useSharedValue(((unlockedCount - 1) / getTotalCardsCount()) * 100);
  const buttonsOpacity = useSharedValue(0);
  const raysRotation = useSharedValue(0);
  const sparkleOpacity = useSharedValue(0.3);

  const rarityConfig = RARITY_CONFIG[card.rarity];

  // Start animation sequence
  useEffect(() => {
    // Timeline:
    // 0.0s - Rays start rotating
    // 0.3s - Title pops
    // 0.5s - Subtitle fades in
    // 0.8s - Card appears (back visible)
    // 1.2s - Card flips
    // 2.0s - Card revealed, info fades in
    // 2.2s - Progress bar animates
    // 2.4s - Buttons fade in

    // Continuous animations
    raysRotation.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1
    );

    sparkleOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 })
      ),
      -1,
      true
    );

    // Title animation (0.3s)
    titleScale.value = withDelay(
      300,
      withSpring(1, { damping: 10, stiffness: 100 })
    );
    titleOpacity.value = withDelay(300, withTiming(1, { duration: 300 }));

    // Subtitle animation (0.5s)
    subtitleOpacity.value = withDelay(500, withTiming(1, { duration: 300 }));

    // Card flip animation (0.8s -> 2.0s)
    cardScale.value = withDelay(
      800,
      withSequence(
        withTiming(1.1, { duration: 400 }),
        withTiming(1, { duration: 400 })
      )
    );
    cardRotateY.value = withDelay(
      1200,
      withTiming(0, { duration: 800, easing: Easing.inOut(Easing.ease) })
    );

    // Info animation (2.0s)
    infoOpacity.value = withDelay(2000, withTiming(1, { duration: 300 }));

    // Progress animation (2.2s)
    progressWidth.value = withDelay(
      2200,
      withTiming((unlockedCount / getTotalCardsCount()) * 100, { duration: 800 })
    );

    // Buttons animation (2.4s)
    buttonsOpacity.value = withDelay(2400, withTiming(1, { duration: 300 }));

    return () => {
      // Cleanup
      cancelAnimation(raysRotation);
      cancelAnimation(sparkleOpacity);
    };
  }, []);

  // Animated styles
  const raysStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${raysRotation.value}deg` }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ scale: titleScale.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: interpolate(subtitleOpacity.value, [0, 1], [20, 0]) }],
  }));

  const cardContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: cardScale.value },
      { perspective: 1500 },
      { rotateY: `${cardRotateY.value}deg` },
    ],
  }));

  const cardFrontStyle = useAnimatedStyle(() => ({
    opacity: cardRotateY.value < 90 ? 1 : 0,
    backfaceVisibility: 'hidden',
  }));

  const cardBackStyle = useAnimatedStyle(() => ({
    opacity: cardRotateY.value >= 90 ? 1 : 0,
    backfaceVisibility: 'hidden',
    transform: [{ rotateY: '180deg' }],
  }));

  const infoStyle = useAnimatedStyle(() => ({
    opacity: infoOpacity.value,
    transform: [{ translateY: interpolate(infoOpacity.value, [0, 1], [20, 0]) }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const buttonsStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: interpolate(buttonsOpacity.value, [0, 1], [20, 0]) }],
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
    transform: [{ scale: interpolate(sparkleOpacity.value, [0.3, 1], [0.8, 1.2]) }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#2d2d44']}
        style={StyleSheet.absoluteFill}
      />

      {/* Rotating rays */}
      <Animated.View style={[styles.raysContainer, raysStyle]}>
        {Array.from({ length: RAY_COUNT }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.ray,
              { transform: [{ rotate: `${(360 / RAY_COUNT) * i}deg` }] },
            ]}
          >
            <LinearGradient
              colors={['rgba(255,215,0,0.3)', 'transparent']}
              style={styles.rayGradient}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
          </View>
        ))}
      </Animated.View>

      {/* Confetti */}
      {Array.from({ length: CONFETTI_COUNT }).map((_, i) => (
        <ConfettiPiece key={i} index={i} />
      ))}

      {/* Flying stars */}
      <Animated.Text style={[styles.flyingStar, styles.star1, sparkleStyle]}>⭐</Animated.Text>
      <Animated.Text style={[styles.flyingStar, styles.star2, sparkleStyle]}>💫</Animated.Text>
      <Animated.Text style={[styles.flyingStar, styles.star3, sparkleStyle]}>✨</Animated.Text>
      <Animated.Text style={[styles.flyingStar, styles.star4, sparkleStyle]}>⭐</Animated.Text>
      <Animated.Text style={[styles.flyingStar, styles.star5, sparkleStyle]}>💫</Animated.Text>

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Animated.Text style={[styles.title, titleStyle]}>
          🎉 Nouvelle Carte Débloquée ! 🎉
        </Animated.Text>
        <Animated.Text style={[styles.subtitle, subtitleStyle]}>
          Tu as complété le niveau avec brio !
        </Animated.Text>

        {/* Card */}
        <Animated.View style={[styles.cardContainer, cardContainerStyle]}>
          {/* Card back */}
          <Animated.View style={[styles.cardFace, styles.cardBack, cardBackStyle]}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.accent]}
              style={styles.cardBackGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardBackPattern}>
                <Text style={styles.cardBackText}>?</Text>
              </View>
              <View style={styles.cardBackBorder} />
            </LinearGradient>
          </Animated.View>

          {/* Card front */}
          <Animated.View style={[styles.cardFace, styles.cardFront, cardFrontStyle]}>
            {/* NEW badge */}
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW!</Text>
            </View>

            <View style={[styles.cardInner, { borderColor: rarityConfig.color }]}>
              {/* Header */}
              <LinearGradient
                colors={rarityConfig.gradientColors}
                style={styles.cardHeader}
              >
                <View style={styles.rarityBadge}>
                  <Text style={styles.rarityIcon}>👑</Text>
                  <Text style={[styles.rarityText, card.rarity === 'legendary' && styles.rarityTextDark]}>
                    {rarityConfig.label}
                  </Text>
                </View>
                <Text style={styles.cardNumber}>#{String(card.number).padStart(3, '0')}</Text>
              </LinearGradient>

              {/* Body */}
              <View style={styles.cardBody}>
                <Text style={styles.cardEmoji}>{card.emoji}</Text>
                <Text style={styles.cardName}>{card.name}</Text>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <View style={styles.traitBadge}>
                  <Text style={styles.traitText}>{card.traits[0]}</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </Animated.View>

        {/* Info */}
        <Animated.View style={[styles.infoContainer, infoStyle]}>
          <Text style={styles.infoText}>
            Tu as ajouté <Text style={styles.infoHighlight}>{card.name}</Text> à ta collection !
          </Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressEmoji}>📚</Text>
            <View style={styles.progressBar}>
              <Animated.View style={[styles.progressFill, progressStyle]}>
                <LinearGradient
                  colors={[COLORS.primary, COLORS.accent]}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </Animated.View>
            </View>
            <Text style={styles.progressText}>
              {unlockedCount} / {getTotalCardsCount()} cartes
            </Text>
          </View>
        </Animated.View>

        {/* Buttons */}
        <Animated.View style={[styles.buttonsContainer, buttonsStyle]}>
          <Pressable style={styles.buttonPrimary} onPress={onViewCollection}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryDark]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonIcon}>📚</Text>
              <Text style={styles.buttonText}>Voir ma collection</Text>
            </LinearGradient>
          </Pressable>
          <Pressable style={styles.buttonSecondary} onPress={onContinue}>
            <Text style={styles.buttonSecondaryIcon}>🎮</Text>
            <Text style={styles.buttonSecondaryText}>Niveau suivant</Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
};

// Confetti piece component
const ConfettiPiece: React.FC<{ index: number }> = ({ index }) => {
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const startX = (index / CONFETTI_COUNT) * SCREEN_WIDTH;
  const size = 10 + Math.random() * 6;
  const isCircle = index % 3 === 0;

  useEffect(() => {
    const delay = 800 + index * 50;
    const duration = 3000 + Math.random() * 1000;

    translateY.value = withDelay(
      delay,
      withTiming(SCREEN_HEIGHT + 50, { duration, easing: Easing.linear })
    );

    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(20 + Math.random() * 30, { duration: 500 }),
          withTiming(-20 - Math.random() * 30, { duration: 500 })
        ),
        -1,
        true
      )
    );

    rotate.value = withDelay(
      delay,
      withTiming(720, { duration, easing: Easing.linear })
    );

    opacity.value = withDelay(
      delay + duration - 500,
      withTiming(0, { duration: 500 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.confetti,
        {
          left: startX,
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: isCircle ? size / 2 : 0,
        },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  raysContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: SCREEN_WIDTH * 2,
    height: SCREEN_HEIGHT * 2,
    marginLeft: -SCREEN_WIDTH,
    marginTop: -SCREEN_HEIGHT,
  },
  ray: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 8,
    height: '100%',
    marginLeft: -4,
  },
  rayGradient: {
    flex: 1,
  },
  confetti: {
    position: 'absolute',
    top: -20,
  },
  flyingStar: {
    position: 'absolute',
    fontSize: 30,
  },
  star1: { left: '25%', top: '35%' },
  star2: { right: '20%', top: '30%' },
  star3: { left: '15%', top: '50%' },
  star4: { right: '15%', top: '55%' },
  star5: { left: '50%', top: '20%' },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    zIndex: 10,
  },
  title: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 42,
    color: '#FFD700',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 20,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 40,
  },
  cardContainer: {
    width: 280,
    height: 380,
    marginBottom: 40,
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  cardBack: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  cardBackGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 24,
  },
  cardBackPattern: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBackText: {
    fontSize: 100,
    color: 'rgba(255,255,255,0.3)',
    fontFamily: 'Fredoka_700Bold',
  },
  cardBackBorder: {
    position: 'absolute',
    inset: 15,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
  },
  cardFront: {
    position: 'relative',
  },
  newBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    transform: [{ rotate: '-15deg' }],
    zIndex: 10,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  newBadgeText: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 10,
    color: 'white',
    letterSpacing: 0.5,
  },
  cardInner: {
    flex: 1,
    backgroundColor: '#FFF9F0',
    borderRadius: 24,
    borderWidth: 5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 50,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  rarityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  rarityIcon: {
    fontSize: 12,
  },
  rarityText: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 10,
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rarityTextDark: {
    color: '#4A4A4A',
  },
  cardNumber: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
  },
  cardBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cardEmoji: {
    fontSize: 100,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 6 },
    textShadowRadius: 15,
  },
  cardName: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 22,
    color: '#4A5568',
    marginTop: 12,
    textAlign: 'center',
  },
  cardTitle: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 13,
    color: COLORS.accent,
    marginTop: 4,
  },
  traitBadge: {
    backgroundColor: 'rgba(91, 141, 238, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(91, 141, 238, 0.2)',
    marginTop: 15,
  },
  traitText: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 12,
    color: COLORS.primary,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  infoText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 10,
  },
  infoHighlight: {
    fontFamily: 'Nunito_700Bold',
    color: '#FFD700',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressEmoji: {
    fontSize: 20,
  },
  progressBar: {
    width: 200,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  buttonPrimary: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 28,
    paddingVertical: 16,
  },
  buttonIcon: {
    fontSize: 20,
  },
  buttonText: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 16,
    color: 'white',
  },
  buttonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  buttonSecondaryIcon: {
    fontSize: 20,
  },
  buttonSecondaryText: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 16,
    color: 'white',
  },
});

export default CardUnlockScreen;
