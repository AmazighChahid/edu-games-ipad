/**
 * ProgressIndicator Component
 *
 * Indicateur de progression unifié pour les jeux
 * Supporte plusieurs modes : barre de progression, timer, statistiques
 *
 * @example
 * // Mode progression (cases remplies)
 * <ProgressIndicator
 *   type="progress"
 *   current={15}
 *   total={81}
 *   unit="cases"
 * />
 *
 * // Mode timer avec couleur critique
 * <ProgressIndicator
 *   type="timer"
 *   timeRemaining={30}
 *   totalTime={120}
 * />
 *
 * // Mode statistiques
 * <ProgressIndicator
 *   type="stats"
 *   stats={[
 *     { label: 'Coups', value: 15 },
 *     { label: 'Optimal', value: 7 },
 *   ]}
 * />
 */

import { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { colors, spacing, borderRadius, fontFamily } from '@/theme';

// Types
type IndicatorType = 'progress' | 'timer' | 'stats';
type ColorScheme = 'default' | 'success' | 'warning' | 'error' | 'auto';

interface StatItem {
  label: string;
  value: number | string;
  highlight?: boolean;
}

interface ProgressIndicatorProps {
  /** Type d'indicateur */
  type?: IndicatorType;

  // Props pour type 'progress'
  /** Valeur actuelle */
  current?: number;
  /** Valeur totale */
  total?: number;
  /** Unité à afficher (ex: "cases", "points") */
  unit?: string;

  // Props pour type 'timer'
  /** Temps restant en secondes */
  timeRemaining?: number;
  /** Temps total en secondes */
  totalTime?: number;

  // Props pour type 'stats'
  /** Liste de statistiques */
  stats?: StatItem[];

  // Props communes
  /** Schéma de couleurs */
  colorScheme?: ColorScheme;
  /** Largeur de la barre (pour progress/timer) */
  barWidth?: number;
  /** Afficher le texte */
  showLabel?: boolean;
  /** Durée de l'animation en ms */
  animationDuration?: number;
}

// Couleurs des états
const STATE_COLORS = {
  default: colors.primary.main,
  success: colors.feedback.success,
  warning: colors.feedback.warning,
  error: colors.feedback.error,
};

/**
 * Calcule la couleur automatique selon le pourcentage
 */
function getAutoColor(progress: number): string {
  if (progress < 0.1) return STATE_COLORS.error;
  if (progress < 0.25) return STATE_COLORS.warning;
  return STATE_COLORS.success;
}

/**
 * Formate le temps en MM:SS
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Composant barre de progression
 */
function ProgressBar({
  current = 0,
  total = 100,
  unit = '',
  colorScheme = 'success',
  barWidth = 200,
  showLabel = true,
  animationDuration = 500,
}: Omit<ProgressIndicatorProps, 'type'>) {
  const progress = total > 0 ? current / total : 0;
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withTiming(progress * 100, {
      duration: animationDuration,
      easing: Easing.out(Easing.quad),
    });
  }, [progress, animationDuration]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const barColor = colorScheme === 'auto' ? getAutoColor(progress) : STATE_COLORS[colorScheme];

  return (
    <View style={styles.container}>
      <View style={[styles.barContainer, { width: barWidth }]}>
        <Animated.View
          style={[
            styles.barFill,
            { backgroundColor: barColor },
            progressStyle,
          ]}
        />
      </View>
      {showLabel && (
        <Text style={styles.labelText}>
          <Text style={[styles.labelHighlight, { color: barColor }]}>
            {current}
          </Text>
          {' / '}
          {total}
          {unit ? ` ${unit}` : ''}
        </Text>
      )}
    </View>
  );
}

/**
 * Composant barre de timer
 */
function TimerBar({
  timeRemaining = 0,
  totalTime = 60,
  colorScheme = 'auto',
  barWidth,
  showLabel = true,
  animationDuration = 300,
}: Omit<ProgressIndicatorProps, 'type'>) {
  const progress = totalTime > 0 ? timeRemaining / totalTime : 1;
  const isLow = progress < 0.25;
  const isCritical = progress < 0.1;

  const animatedWidth = useSharedValue(progress * 100);

  useEffect(() => {
    animatedWidth.value = withTiming(progress * 100, {
      duration: animationDuration,
    });
  }, [progress, animationDuration]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%`,
  }));

  // Couleur selon le temps restant
  const barColor = useMemo(() => {
    if (colorScheme !== 'auto') return STATE_COLORS[colorScheme];
    if (isCritical) return STATE_COLORS.error;
    if (isLow) return STATE_COLORS.warning;
    return STATE_COLORS.success;
  }, [colorScheme, isCritical, isLow]);

  const timeDisplay = formatTime(timeRemaining);

  return (
    <View style={styles.container}>
      <View style={[styles.barContainer, styles.timerBar, barWidth ? { width: barWidth } : { flex: 1 }]}>
        <Animated.View
          style={[
            styles.barFill,
            { backgroundColor: barColor },
            barStyle,
          ]}
        />
      </View>
      {showLabel && (
        <Text style={[styles.timeText, isCritical && styles.timeTextCritical]}>
          {timeDisplay}
        </Text>
      )}
    </View>
  );
}

/**
 * Composant statistiques
 */
function StatsPanel({ stats = [] }: Omit<ProgressIndicatorProps, 'type'>) {
  if (stats.length === 0) return null;

  return (
    <View style={styles.statsContainer}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.statItem}>
          <Text style={styles.statLabel}>{stat.label}</Text>
          <Text
            style={[
              styles.statValue,
              stat.highlight && styles.statValueHighlight,
            ]}
          >
            {stat.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

/**
 * Composant principal ProgressIndicator
 */
export function ProgressIndicator({
  type = 'progress',
  ...props
}: ProgressIndicatorProps) {
  switch (type) {
    case 'progress':
      return <ProgressBar {...props} />;
    case 'timer':
      return <TimerBar {...props} />;
    case 'stats':
      return <StatsPanel {...props} />;
    default:
      return <ProgressBar {...props} />;
  }
}

const styles = StyleSheet.create({
  // Container commun
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    paddingHorizontal: spacing[4],
  },

  // Barre de progression
  barContainer: {
    height: 16,
    backgroundColor: colors.ui.divider,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: borderRadius.round,
  },

  // Labels pour progress
  labelText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: colors.text.secondary,
  },
  labelHighlight: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
  },

  // Timer spécifique
  timerBar: {
    height: 12,
  },
  timeText: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    fontWeight: '600',
    color: colors.text.primary,
    minWidth: 50,
    textAlign: 'right',
  },
  timeTextCritical: {
    color: colors.feedback.error,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing[6],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: borderRadius.lg,
  },
  statItem: {
    alignItems: 'center',
    gap: spacing[1],
  },
  statLabel: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: colors.text.muted,
  },
  statValue: {
    fontSize: 20,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statValueHighlight: {
    color: colors.primary.main,
  },
});

export type { StatItem, IndicatorType, ColorScheme };
export default ProgressIndicator;
