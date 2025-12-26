/**
 * VictoryCard - Composant réutilisable pour écrans de victoire
 *
 * Caractéristiques:
 * - Animation de célébration
 * - Affichage des stats (moves, temps, étoiles)
 * - Boutons d'action standardisés
 * - Design cohérent avec le Design System
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { theme } from '@/theme';

export interface VictoryStats {
  moves?: number;
  optimalMoves?: number;
  timeElapsed?: number;
  stars?: number;
  hintsUsed?: number;
}

export interface VictoryCardProps {
  title?: string;
  message?: string;
  stats?: VictoryStats;
  onNextLevel?: () => void;
  onReplay?: () => void;
  onHome?: () => void;
  hasNextLevel?: boolean;
  celebrationEmoji?: string;
}

export const VictoryCard: React.FC<VictoryCardProps> = ({
  title = 'Bravo !',
  message = 'Tu as réussi !',
  stats,
  onNextLevel,
  onReplay,
  onHome,
  hasNextLevel = false,
  celebrationEmoji = '🎉',
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getPerformanceMessage = (): string => {
    if (!stats?.moves || !stats?.optimalMoves) return '';

    if (stats.moves === stats.optimalMoves) {
      return 'Solution parfaite ! ⭐⭐⭐';
    } else if (stats.moves <= stats.optimalMoves * 1.5) {
      return 'Très bien joué ! ⭐⭐';
    } else {
      return 'Bon travail ! ⭐';
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        entering={ZoomIn.duration(500).delay(200)}
        style={styles.card}
      >
        {/* Celebration */}
        <Animated.Text
          entering={FadeIn.duration(400).delay(400)}
          style={styles.celebrationEmoji}
        >
          {celebrationEmoji}
        </Animated.Text>

        {/* Title */}
        <Animated.Text
          entering={FadeIn.duration(400).delay(600)}
          style={styles.title}
        >
          {title}
        </Animated.Text>

        {/* Message */}
        <Animated.Text
          entering={FadeIn.duration(400).delay(800)}
          style={styles.message}
        >
          {message}
        </Animated.Text>

        {/* Performance Message */}
        {stats && (
          <Animated.Text
            entering={FadeIn.duration(400).delay(1000)}
            style={styles.performanceMessage}
          >
            {getPerformanceMessage()}
          </Animated.Text>
        )}

        {/* Stats */}
        {stats && (
          <Animated.View
            entering={FadeIn.duration(400).delay(1200)}
            style={styles.statsContainer}
          >
            {stats.moves !== undefined && stats.optimalMoves !== undefined && (
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Coups</Text>
                <Text style={styles.statValue}>
                  {stats.moves} / {stats.optimalMoves}
                </Text>
              </View>
            )}

            {stats.timeElapsed !== undefined && (
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Temps</Text>
                <Text style={styles.statValue}>{formatTime(stats.timeElapsed)}</Text>
              </View>
            )}

            {stats.hintsUsed !== undefined && stats.hintsUsed > 0 && (
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Indices utilisés</Text>
                <Text style={styles.statValue}>{stats.hintsUsed}</Text>
              </View>
            )}

            {stats.stars !== undefined && (
              <View style={styles.starsRow}>
                {[1, 2, 3].map((star) => (
                  <Text key={star} style={styles.star}>
                    {star <= stats.stars! ? '⭐' : '☆'}
                  </Text>
                ))}
              </View>
            )}
          </Animated.View>
        )}

        {/* Action Buttons */}
        <Animated.View
          entering={FadeIn.duration(400).delay(1400)}
          style={styles.buttonsContainer}
        >
          {hasNextLevel && onNextLevel && (
            <Pressable style={styles.buttonPrimary} onPress={onNextLevel}>
              <Text style={styles.buttonTextPrimary}>Niveau suivant ▶</Text>
            </Pressable>
          )}

          {onReplay && (
            <Pressable style={styles.buttonSecondary} onPress={onReplay}>
              <Text style={styles.buttonTextSecondary}>↻ Rejouer</Text>
            </Pressable>
          )}

          {onHome && (
            <Pressable style={styles.buttonOutline} onPress={onHome}>
              <Text style={styles.buttonTextOutline}>🏠 Menu</Text>
            </Pressable>
          )}
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[6],
  },
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing[8],
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  celebrationEmoji: {
    fontSize: 80,
    marginBottom: theme.spacing[4],
  },
  title: {
    ...theme.textStyles.h1,
    color: theme.colors.primary.main,
    textAlign: 'center',
    marginBottom: theme.spacing[2],
  },
  message: {
    ...theme.textStyles.h3,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing[4],
  },
  performanceMessage: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.feedback.success,
    textAlign: 'center',
    marginBottom: theme.spacing[5],
    fontFamily: 'Nunito_600SemiBold',
  },
  statsContainer: {
    width: '100%',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[6],
    gap: theme.spacing[2],
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    ...theme.textStyles.body,
    color: theme.colors.text.secondary,
  },
  statValue: {
    ...theme.textStyles.h3,
    color: theme.colors.primary.main,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing[2],
    marginTop: theme.spacing[2],
  },
  star: {
    fontSize: 32,
  },
  buttonsContainer: {
    width: '100%',
    gap: theme.spacing[3],
  },
  buttonPrimary: {
    backgroundColor: theme.colors.secondary.main,
    paddingVertical: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    minHeight: theme.touchTargets.child,
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    minHeight: theme.touchTargets.child,
    justifyContent: 'center',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.text.muted,
    paddingVertical: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    minHeight: theme.touchTargets.child,
    justifyContent: 'center',
  },
  buttonTextPrimary: {
    ...theme.textStyles.button,
    color: theme.colors.text.inverse,
  },
  buttonTextSecondary: {
    ...theme.textStyles.button,
    color: theme.colors.text.inverse,
  },
  buttonTextOutline: {
    ...theme.textStyles.button,
    color: theme.colors.text.primary,
  },
});
