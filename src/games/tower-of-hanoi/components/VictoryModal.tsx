/**
 * Modal de victoire
 * Affiche les félicitations et le score
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Button } from '../../../components/core';
import { Colors, Layout, Typography } from '../../../constants';
import { calculateStars, getOptimalMoves } from '../logic/gameEngine';

interface VictoryModalProps {
  visible: boolean;
  moves: number;
  discCount: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  visible,
  moves,
  discCount,
  onPlayAgain,
  onGoHome,
}) => {
  const stars = calculateStars(moves, discCount);
  const optimal = getOptimalMoves(discCount);

  // Animations
  const scale = useSharedValue(0);
  const starScales = [useSharedValue(0), useSharedValue(0), useSharedValue(0)];
  const confettiY = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Vibration de succès
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Animation d'entrée du modal
      scale.value = withSpring(1, { damping: 12, stiffness: 100 });

      // Animation des étoiles en cascade
      starScales.forEach((starScale, index) => {
        starScale.value = withDelay(
          300 + index * 200,
          withSpring(index < stars ? 1 : 0.3, { damping: 10 })
        );
      });

      // Animation de confettis
      confettiY.value = withRepeat(
        withSequence(
          withTiming(-20, { duration: 500 }),
          withTiming(0, { duration: 500 })
        ),
        -1,
        true
      );
    } else {
      scale.value = 0;
      starScales.forEach((s) => (s.value = 0));
    }
  }, [visible]);

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const starAnimatedStyles = starScales.map((starScale) =>
    useAnimatedStyle(() => ({
      transform: [{ scale: starScale.value }],
      opacity: starScale.value,
    }))
  );

  const getMessage = () => {
    if (stars === 3) return 'Parfait ! Tu es un champion !';
    if (stars === 2) return 'Bravo ! Très bien joué !';
    return 'Bien joué ! Tu as réussi !';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.modal, modalAnimatedStyle]}>
          {/* Confettis simulés */}
          <View style={styles.confettiContainer}>
            {['🎉', '⭐', '🎊', '✨', '🌟'].map((emoji, i) => (
              <Text key={i} style={[styles.confetti, { left: `${15 + i * 15}%` }]}>
                {emoji}
              </Text>
            ))}
          </View>

          {/* Titre */}
          <Text style={styles.title}>Victoire !</Text>

          {/* Étoiles */}
          <View style={styles.starsContainer}>
            {[0, 1, 2].map((i) => (
              <Animated.Text
                key={i}
                style={[styles.star, starAnimatedStyles[i]]}
              >
                ⭐
              </Animated.Text>
            ))}
          </View>

          {/* Message */}
          <Text style={styles.message}>{getMessage()}</Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{moves}</Text>
              <Text style={styles.statLabel}>coups</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{optimal}</Text>
              <Text style={styles.statLabel}>minimum</Text>
            </View>
          </View>

          {/* Boutons */}
          <View style={styles.buttonsContainer}>
            <Button
              label="Rejouer"
              onPress={onPlayAgain}
              variant="primary"
              accessibilityLabel="Rejouer une partie"
              style={styles.button}
            />
            <Button
              label="Accueil"
              onPress={onGoHome}
              variant="outline"
              accessibilityLabel="Retourner à l'accueil"
              style={styles.button}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: Colors.neutral.surface,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.xl,
    alignItems: 'center',
    width: '85%',
    maxWidth: 400,
    ...Layout.shadow.large,
  },
  confettiContainer: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  confetti: {
    fontSize: 30,
    position: 'absolute',
    top: 0,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.primary.dark,
    marginBottom: Layout.spacing.lg,
    marginTop: Layout.spacing.md,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.lg,
  },
  star: {
    fontSize: 50,
    marginHorizontal: Layout.spacing.sm,
  },
  message: {
    fontSize: Typography.sizes.md,
    color: Colors.neutral.text,
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  stat: {
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
  },
  statValue: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.primary.medium,
  },
  statLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral.textLight,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.neutral.border,
  },
  buttonsContainer: {
    width: '100%',
    gap: Layout.spacing.md,
  },
  button: {
    width: '100%',
  },
});
