/**
 * VictoryCelebration component
 * Festive celebration overlay with confetti, star bursts and adaptive messages
 * Child-friendly design celebrating effort, not just perfection
 */

import { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  FadeIn,
  FadeInDown,
  ZoomIn,
  BounceIn,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VictoryCelebrationProps {
  visible: boolean;
  moves: number;
  optimalMoves: number;
  hintsUsed?: number;
  onComplete?: () => void;
  onReplay: () => void;
  onNextLevel?: () => void;
}

// Confetti configuration
const CONFETTI_COUNT = 35;
const CONFETTI_EMOJIS = ['🎉', '⭐', '🌟', '💫', '🎊', '✨', '🏆', '💪'];

// Badge system based on performance
interface Badge {
  emoji: string;
  label: string;
  color: string;
}

const getBadge = (moves: number, optimalMoves: number, hintsUsed: number = 0): Badge => {
  const efficiency = moves / optimalMoves;

  if (efficiency === 1 && hintsUsed === 0) {
    return { emoji: '🏆', label: 'Parfait !', color: '#FFD700' };
  } else if (efficiency <= 1.2 && hintsUsed === 0) {
    return { emoji: '🧠', label: 'Stratège', color: '#9B59B6' };
  } else if (efficiency <= 1.5) {
    return { emoji: '⭐', label: 'Efficace', color: '#F39C12' };
  } else if (hintsUsed >= 3) {
    return { emoji: '💪', label: 'Persévérant', color: '#E74C3C' };
  } else {
    return { emoji: '🌟', label: 'Champion', color: '#3498DB' };
  }
};

// Star rating system by threshold
const getStars = (moves: number, optimalMoves: number): number => {
  const efficiency = moves / optimalMoves;
  if (efficiency <= 1.0) return 3;  // Parfait
  if (efficiency <= 1.3) return 3;  // Très bien
  if (efficiency <= 1.5) return 2;  // Bien
  if (efficiency <= 2.0) return 1;  // OK
  return 0;
};

// Animated Star component
function AnimatedStar({ index, filled, delay }: { index: number; filled: boolean; delay: number }) {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withSpring(1, { damping: 8, stiffness: 200 })
    );
    rotation.value = withDelay(
      delay,
      withSequence(
        withTiming(15, { duration: 150 }),
        withTiming(-15, { duration: 150 }),
        withTiming(0, { duration: 150 })
      )
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <Animated.Text style={[styles.starIcon, animatedStyle]}>
      {filled ? '⭐' : '☆'}
    </Animated.Text>
  );
}

// Generate random confetti pieces
const generateConfetti = () => {
  return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    id: i,
    emoji: CONFETTI_EMOJIS[Math.floor(Math.random() * CONFETTI_EMOJIS.length)],
    x: Math.random() * SCREEN_WIDTH,
    y: Math.random() * SCREEN_HEIGHT * 0.6,
    delay: Math.random() * 600,
    duration: 2000 + Math.random() * 1000,
    rotationSpeed: 1 + Math.random() * 2,
    size: 20 + Math.random() * 16,
  }));
};

// Individual confetti piece
function ConfettiPiece({
  emoji,
  x,
  y,
  delay,
  duration,
  rotationSpeed,
  size,
}: {
  emoji: string;
  x: number;
  y: number;
  delay: number;
  duration: number;
  rotationSpeed: number;
  size: number;
}) {
  const rotation = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Start rotation
    rotation.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, { duration: duration / rotationSpeed, easing: Easing.linear }),
        -1,
        false
      )
    );

    // Float down animation
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(30, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: duration / 2, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    );

    // Fade in
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text
      style={[
        styles.confetti,
        { left: x, top: y, fontSize: size },
        animatedStyle,
      ]}
    >
      {emoji}
    </Animated.Text>
  );
}

// Star burst rays
function StarBurst() {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 8000, easing: Easing.linear }),
      -1,
      false
    );
    scale.value = withSequence(
      withTiming(1.2, { duration: 400, easing: Easing.out(Easing.back(1.5)) }),
      withTiming(1, { duration: 300 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
  }));

  const rays = Array.from({ length: 12 }, (_, i) => i * 30);

  return (
    <Animated.View style={[styles.starBurstContainer, animatedStyle]}>
      {rays.map((angle, index) => (
        <View
          key={index}
          style={[
            styles.ray,
            {
              transform: [{ rotate: `${angle}deg` }],
              opacity: 0.3 + (index % 2) * 0.2,
            },
          ]}
        >
          <LinearGradient
            colors={['#FFD700', 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.rayGradient}
          />
        </View>
      ))}
    </Animated.View>
  );
}

export function VictoryCelebration({
  visible,
  moves,
  optimalMoves,
  hintsUsed = 0,
  onComplete,
  onReplay,
  onNextLevel,
}: VictoryCelebrationProps) {
  const confetti = useMemo(() => generateConfetti(), [visible]);
  const badge = useMemo(() => getBadge(moves, optimalMoves, hintsUsed), [moves, optimalMoves, hintsUsed]);
  const stars = useMemo(() => getStars(moves, optimalMoves), [moves, optimalMoves]);

  // Haptic celebration
  useEffect(() => {
    if (visible && Platform.OS !== 'web') {
      // Celebration haptic pattern
      const hapticSequence = async () => {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 200);
        setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 400);
      };
      hapticSequence();

      // Notify completion after animations
      if (onComplete) {
        setTimeout(onComplete, 1500);
      }
    }
  }, [visible]);

  if (!visible) return null;

  const efficiency = moves / optimalMoves;
  const getMessage = () => {
    if (efficiency === 1) return 'Tu as trouvé la solution parfaite !';
    if (efficiency <= 1.3) return 'Très belle réflexion !';
    if (efficiency <= 1.5) return 'Bien joué, tu progresses !';
    return 'Bravo, tu as réussi !';
  };

  return (
    <View style={styles.overlay}>
      {/* Semi-transparent background */}
      <Animated.View
        style={styles.backdrop}
        entering={FadeIn.duration(300)}
      />

      {/* Star burst background */}
      <StarBurst />

      {/* Confetti pieces */}
      {confetti.map((piece) => (
        <ConfettiPiece key={piece.id} {...piece} />
      ))}

      {/* Main content card */}
      <Animated.View
        style={styles.card}
        entering={ZoomIn.delay(200).springify().damping(15)}
      >
        {/* Stars */}
        <View style={styles.starsContainer}>
          {[0, 1, 2].map((index) => (
            <AnimatedStar
              key={index}
              index={index}
              filled={index < stars}
              delay={400 + index * 200}
            />
          ))}
        </View>

        {/* Badge */}
        <Animated.View
          style={[styles.badgeContainer, { backgroundColor: badge.color + '20' }]}
          entering={BounceIn.delay(1000)}
        >
          <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
          <Text style={[styles.badgeLabel, { color: badge.color }]}>{badge.label}</Text>
        </Animated.View>

        {/* Message */}
        <Animated.Text
          style={styles.message}
          entering={FadeIn.delay(600)}
        >
          {getMessage()}
        </Animated.Text>

        {/* Stats */}
        <Animated.View
          style={styles.statsContainer}
          entering={FadeInDown.delay(800)}
        >
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{moves}</Text>
            <Text style={styles.statLabel}>Tes coups</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={[styles.statValue, styles.optimalValue]}>{optimalMoves}</Text>
            <Text style={styles.statLabel}>Optimal</Text>
          </View>

          {hintsUsed > 0 && (
            <>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{hintsUsed}</Text>
                <Text style={styles.statLabel}>Indices</Text>
              </View>
            </>
          )}
        </Animated.View>

        {/* Buttons */}
        <Animated.View
          style={styles.buttonsContainer}
          entering={BounceIn.delay(1000)}
        >
          <Pressable
            style={styles.replayButton}
            onPress={onReplay}
          >
            <LinearGradient
              colors={['#5B8DEE', '#4A7BD9']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Rejouer</Text>
            </LinearGradient>
          </Pressable>

          {onNextLevel && (
            <Pressable
              style={styles.nextButton}
              onPress={onNextLevel}
            >
              <LinearGradient
                colors={['#69DB7C', '#55C266']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Niveau +</Text>
              </LinearGradient>
            </Pressable>
          )}
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  starBurstContainer: {
    position: 'absolute',
    width: 400,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ray: {
    position: 'absolute',
    width: 8,
    height: 200,
    transformOrigin: 'center bottom',
  },
  rayGradient: {
    flex: 1,
    borderRadius: 4,
  },
  confetti: {
    position: 'absolute',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
    maxWidth: SCREEN_WIDTH * 0.85,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  starIcon: {
    fontSize: 42,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    marginBottom: 16,
  },
  badgeEmoji: {
    fontSize: 32,
    marginRight: 8,
  },
  badgeLabel: {
    fontSize: 20,
    fontWeight: '700',
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    textAlign: 'center',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 28,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#5B8DEE',
  },
  optimalValue: {
    color: '#69DB7C',
  },
  statLabel: {
    fontSize: 12,
    color: '#636E72',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#DFE6E9',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  replayButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#5B8DEE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#69DB7C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
