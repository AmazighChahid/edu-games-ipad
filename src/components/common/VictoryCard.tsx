/**
 * VictoryCard - Composant réutilisable pour écrans de victoire
 *
 * Caractéristiques:
 * - Animation de célébration avec confettis
 * - Affichage des stats (moves, temps, étoiles)
 * - Système de badges non-compétitifs
 * - Boutons d'action standardisés
 * - Design cohérent avec le Design System
 * - Support pour mascotte personnalisée
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  ZoomIn,
  BounceIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { theme } from '../../theme';

// Badge non-compétitif
export interface VictoryBadge {
  icon: string;
  label: string;
}

// Statistique personnalisée
export interface CustomStat {
  label: string;
  value: string | number;
  icon?: string;
}

export interface VictoryStats {
  moves?: number;
  optimalMoves?: number;
  timeElapsed?: number; // en secondes
  stars?: number;
  hintsUsed?: number;
  // Stats personnalisées additionnelles
  customStats?: CustomStat[];
}

export interface VictoryCardProps {
  title?: string;
  message?: string;
  stats?: VictoryStats;
  badge?: VictoryBadge;
  mascot?: {
    emoji: string;
    message?: string;
  };
  onNextLevel?: () => void;
  onReplay?: () => void;
  onHome?: () => void;
  onCollection?: () => void;
  hasNextLevel?: boolean;
  nextLevelLabel?: string;
  celebrationEmoji?: string;
  showConfetti?: boolean;
  variant?: 'default' | 'overlay' | 'fullscreen';
}

export const VictoryCard: React.FC<VictoryCardProps> = ({
  title = 'Bravo !',
  message = 'Tu as réussi !',
  stats,
  badge,
  mascot,
  onNextLevel,
  onReplay,
  onHome,
  onCollection,
  hasNextLevel = false,
  nextLevelLabel,
  celebrationEmoji = '🎉',
  showConfetti = true,
  variant = 'default',
}) => {
  // Animation confettis
  const confettiRotate = useSharedValue(0);
  const confettiScale = useSharedValue(0);

  useEffect(() => {
    if (showConfetti) {
      confettiScale.value = withDelay(
        300,
        withSequence(
          withTiming(1.2, { duration: 300, easing: Easing.out(Easing.back(2)) }),
          withTiming(1, { duration: 200 })
        )
      );
      confettiRotate.value = withRepeat(
        withTiming(360, { duration: 3000, easing: Easing.linear }),
        -1,
        false
      );
    }
  }, [showConfetti]);

  const confettiStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: confettiScale.value },
      { rotate: `${confettiRotate.value}deg` },
    ],
  }));

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
  };

  const containerStyle = [
    styles.container,
    variant === 'overlay' && styles.containerOverlay,
    variant === 'fullscreen' && styles.containerFullscreen,
  ];

  return (
    <View style={containerStyle}>
      {/* Confetti decoration */}
      {showConfetti && (
        <>
          <Animated.View style={[styles.confettiContainer, styles.confettiRight, confettiStyle]}>
            <Text style={styles.confetti}>🎊</Text>
          </Animated.View>
          <Animated.View style={[styles.confettiContainer, styles.confettiLeft, confettiStyle]}>
            <Text style={styles.confetti}>✨</Text>
          </Animated.View>
        </>
      )}

      <Animated.View
        entering={ZoomIn.duration(500).delay(200)}
        style={styles.card}
      >
        {/* Mascot with message */}
        {mascot && (
          <Animated.View entering={FadeInDown.delay(100)} style={styles.mascotContainer}>
            <Text style={styles.mascotEmoji}>{mascot.emoji}</Text>
            {mascot.message && (
              <View style={styles.mascotBubble}>
                <Text style={styles.mascotMessage}>{mascot.message}</Text>
              </View>
            )}
          </Animated.View>
        )}

        {/* Celebration Emoji */}
        <Animated.View entering={ZoomIn.delay(200)} style={styles.emojiContainer}>
          <Text style={styles.celebrationEmoji}>{celebrationEmoji}</Text>
        </Animated.View>

        {/* Title */}
        <Animated.Text
          entering={FadeIn.delay(400)}
          style={styles.title}
        >
          {title}
        </Animated.Text>

        {/* Message */}
        <Animated.Text
          entering={FadeIn.delay(600)}
          style={styles.message}
        >
          {message}
        </Animated.Text>

        {/* Stats Card */}
        {stats && (
          <Animated.View
            entering={FadeInDown.delay(800)}
            style={styles.statsContainer}
          >
            {/* Main stats row */}
            <View style={styles.statsRow}>
              {stats.moves !== undefined && (
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Coups</Text>
                  <Text style={styles.statValue}>{stats.moves}</Text>
                </View>
              )}

              {stats.moves !== undefined && stats.optimalMoves !== undefined && (
                <>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Optimal</Text>
                    <Text style={styles.statValueOptimal}>{stats.optimalMoves}</Text>
                  </View>
                </>
              )}

              {stats.timeElapsed !== undefined && (
                <>
                  {stats.moves !== undefined && <View style={styles.statDivider} />}
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Temps</Text>
                    <Text style={styles.statValue}>{formatTime(stats.timeElapsed)}</Text>
                  </View>
                </>
              )}
            </View>

            {/* Custom stats */}
            {stats.customStats && stats.customStats.length > 0 && (
              <View style={styles.customStatsContainer}>
                {stats.customStats.map((stat, index) => (
                  <Text key={index} style={styles.customStatText}>
                    {stat.icon ? `${stat.icon} ` : ''}{stat.label}: {stat.value}
                  </Text>
                ))}
              </View>
            )}

            {/* Hints used */}
            {stats.hintsUsed !== undefined && stats.hintsUsed > 0 && (
              <Text style={styles.hintsText}>💡 {stats.hintsUsed} indice{stats.hintsUsed > 1 ? 's' : ''} utilisé{stats.hintsUsed > 1 ? 's' : ''}</Text>
            )}

            {/* Stars display */}
            {stats.stars !== undefined && (
              <View style={styles.starsRow}>
                {[1, 2, 3].map((star) => (
                  <Animated.Text
                    key={star}
                    entering={ZoomIn.delay(1000 + star * 150)}
                    style={styles.star}
                  >
                    {star <= stats.stars! ? '⭐' : '☆'}
                  </Animated.Text>
                ))}
              </View>
            )}

            {/* Badge non-compétitif */}
            {badge && (
              <Animated.View entering={BounceIn.delay(1200)} style={styles.badgeContainer}>
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                <Text style={styles.badgeLabel}>{badge.label}</Text>
              </Animated.View>
            )}
          </Animated.View>
        )}

        {/* Action Buttons */}
        <Animated.View
          entering={FadeInDown.delay(1000)}
          style={styles.buttonsContainer}
        >
          {/* Primary: Next level */}
          {hasNextLevel && onNextLevel ? (
            <Pressable style={styles.buttonPrimary} onPress={onNextLevel}>
              <Text style={styles.buttonTextPrimary}>
                {nextLevelLabel || 'Niveau suivant →'}
              </Text>
            </Pressable>
          ) : !hasNextLevel && onNextLevel === undefined ? (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>Tous les niveaux terminés !</Text>
            </View>
          ) : null}

          {/* Secondary: Replay */}
          {onReplay && (
            <Pressable style={styles.buttonSecondary} onPress={onReplay}>
              <Text style={styles.buttonTextSecondary}>↻ Rejouer</Text>
            </Pressable>
          )}

          {/* Collection button */}
          {onCollection && (
            <Pressable style={styles.buttonCollection} onPress={onCollection}>
              <Text style={styles.buttonCollectionIcon}>📚</Text>
              <Text style={styles.buttonCollectionText}>Ma Collection</Text>
            </Pressable>
          )}

          {/* Tertiary: Home */}
          {onHome && (
            <Pressable style={styles.buttonOutline} onPress={onHome}>
              <Text style={styles.buttonTextOutline}>Retour à l'accueil</Text>
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
  containerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 100,
  },
  containerFullscreen: {
    backgroundColor: theme.colors.background.game,
  },
  confettiContainer: {
    position: 'absolute',
    zIndex: 10,
  },
  confettiRight: {
    top: 40,
    right: 40,
  },
  confettiLeft: {
    top: 60,
    left: 40,
  },
  confetti: {
    fontSize: 40,
  },
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing[6],
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  mascotContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  mascotEmoji: {
    fontSize: 60,
    marginBottom: theme.spacing[2],
  },
  mascotBubble: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[3],
    maxWidth: 280,
  },
  mascotMessage: {
    ...theme.textStyles.body,
    color: theme.colors.text.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
  emojiContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.secondary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[4],
    ...theme.shadows.lg,
  },
  celebrationEmoji: {
    fontSize: 50,
  },
  title: {
    ...theme.textStyles.gameTitle,
    color: theme.colors.primary.main,
    textAlign: 'center',
    marginBottom: theme.spacing[1],
  },
  message: {
    ...theme.textStyles.h3,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing[5],
  },
  statsContainer: {
    width: '100%',
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing[5],
    marginBottom: theme.spacing[5],
    alignItems: 'center',
    ...theme.shadows.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[3],
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing[5],
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.background.secondary,
  },
  statLabel: {
    ...theme.textStyles.caption,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[1],
  },
  statValue: {
    ...theme.textStyles.gameTitle,
    color: theme.colors.primary.main,
    fontSize: 28,
  },
  statValueOptimal: {
    ...theme.textStyles.h2,
    color: theme.colors.feedback.success,
  },
  customStatsContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  customStatText: {
    ...theme.textStyles.body,
    color: theme.colors.text.muted,
  },
  hintsText: {
    ...theme.textStyles.body,
    color: theme.colors.text.muted,
    marginBottom: theme.spacing[3],
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[3],
  },
  star: {
    fontSize: 36,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary.light,
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.borderRadius.round,
    gap: theme.spacing[2],
  },
  badgeIcon: {
    fontSize: 20,
  },
  badgeLabel: {
    ...theme.textStyles.body,
    color: theme.colors.secondary.dark,
    fontWeight: '600',
  },
  buttonsContainer: {
    width: '100%',
    gap: theme.spacing[3],
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: theme.colors.secondary.main,
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[6],
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    minHeight: theme.touchTargets.large,
    justifyContent: 'center',
    width: '100%',
    ...theme.shadows.md,
  },
  buttonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.card,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[6],
    borderRadius: theme.borderRadius.xl,
    gap: theme.spacing[2],
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
    ...theme.shadows.sm,
  },
  buttonCollection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(224, 86, 253, 0.1)',
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing[2],
    borderWidth: 2,
    borderColor: '#E056FD',
  },
  buttonCollectionIcon: {
    fontSize: 16,
  },
  buttonCollectionText: {
    ...theme.textStyles.body,
    color: '#E056FD',
    fontWeight: '600',
  },
  buttonOutline: {
    paddingVertical: theme.spacing[2],
  },
  completedBadge: {
    backgroundColor: theme.colors.feedback.success,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[6],
    borderRadius: theme.borderRadius.xl,
  },
  completedText: {
    ...theme.textStyles.body,
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
  buttonTextPrimary: {
    ...theme.textStyles.button,
    color: theme.colors.text.inverse,
    fontSize: 18,
  },
  buttonTextSecondary: {
    ...theme.textStyles.body,
    color: theme.colors.primary.main,
    fontWeight: '600',
  },
  buttonTextOutline: {
    ...theme.textStyles.body,
    color: theme.colors.text.muted,
    textDecorationLine: 'underline',
  },
});
