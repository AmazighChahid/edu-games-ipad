import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SessionStats } from '../types';

interface Props {
  stats: SessionStats;
  onReplay: () => void;
  onNext: () => void;
  onExit: () => void;
}

const Star: React.FC<{ filled: boolean; delay: number }> = ({ filled, delay }) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    // Animation d'apparition avec délai
    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(1.2, { duration: 200 }),
        withTiming(1, { duration: 100 })
      )
    );

    // Animation de pulsation continue pour les étoiles remplies
    if (filled) {
      const pulseTimer = setTimeout(() => {
        scale.value = withRepeat(
          withSequence(
            withTiming(1.1, { duration: 500 }),
            withTiming(1, { duration: 500 })
          ),
          -1,
          true
        );
      }, delay + 300);
      return () => clearTimeout(pulseTimer);
    }
  }, [filled, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.Text style={[styles.star, animatedStyle]}>
      {filled ? '⭐' : '☆'}
    </Animated.Text>
  );
};

// Composant pour animer l'apparition avec délai
const AnimatedSection: React.FC<{
  delay: number;
  children: React.ReactNode;
  style?: any;
}> = ({ delay, children, style }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 15 }));
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
};

export const VictoryScreen: React.FC<Props> = ({ stats, onReplay, onNext, onExit }) => {
  const containerOpacity = useSharedValue(0);

  useEffect(() => {
    containerOpacity.value = withTiming(1, { duration: 300 });
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, containerAnimatedStyle]}>
        {/* Mascotte */}
        <AnimatedSection delay={200} style={styles.mascotContainer}>
          <Text style={styles.mascot}>🐿️</Text>
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>
              {stats.stars === 3
                ? 'Incroyable ! Tu es un vrai champion ! 🎉'
                : stats.stars === 2
                  ? 'Super ! Tu as été rapide ! 👏'
                  : 'Hourra ! On est sortis ! 🎉'}
            </Text>
          </View>
        </AnimatedSection>

        {/* Titre */}
        <AnimatedSection delay={400}>
          <Text style={styles.title}>Victoire !</Text>
        </AnimatedSection>

        {/* Étoiles */}
        <AnimatedSection delay={600} style={styles.starsContainer}>
          <Star filled={stats.stars >= 1} delay={700} />
          <Star filled={stats.stars >= 2} delay={900} />
          <Star filled={stats.stars >= 3} delay={1100} />
        </AnimatedSection>

        {/* Statistiques */}
        <AnimatedSection delay={1300} style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>⏱️ Temps</Text>
            <Text style={styles.statValue}>{formatTime(stats.time)}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>🗺️ Exploration</Text>
            <Text style={styles.statValue}>{stats.explorationPercent}%</Text>
          </View>
          {stats.gemsCollected > 0 && (
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>💎 Gemmes</Text>
              <Text style={styles.statValue}>{stats.gemsCollected}</Text>
            </View>
          )}
          {stats.hintsUsed > 0 && (
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>💡 Indices</Text>
              <Text style={styles.statValue}>{stats.hintsUsed}</Text>
            </View>
          )}
        </AnimatedSection>

        {/* Boutons */}
        <AnimatedSection delay={1500} style={styles.buttonsContainer}>
          <Pressable style={[styles.button, styles.buttonSecondary]} onPress={onReplay}>
            <Text style={styles.buttonText}>🔄 Rejouer</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.buttonPrimary]} onPress={onNext}>
            <Text style={styles.buttonTextWhite}>➡️ Niveau suivant</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.buttonGhost]} onPress={onExit}>
            <Text style={styles.buttonText}>🏠 Menu</Text>
          </Pressable>
        </AnimatedSection>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    backgroundColor: '#FFF9F0',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  mascotContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  mascot: {
    fontSize: 80,
    marginBottom: 16,
  },
  bubble: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  bubbleText: {
    fontSize: 18,
    color: '#2D3748',
    textAlign: 'center',
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5B8DEE',
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  star: {
    fontSize: 48,
  },
  statsContainer: {
    width: '100%',
    backgroundColor: 'rgba(91, 141, 238, 0.1)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 16,
    color: '#4A5568',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 64,
  },
  buttonPrimary: {
    backgroundColor: '#5B8DEE',
    shadowColor: '#5B8DEE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonSecondary: {
    backgroundColor: '#FFB347',
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#5B8DEE',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  buttonTextWhite: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
});
