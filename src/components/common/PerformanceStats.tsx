/**
 * PerformanceStats Component
 *
 * Affichage des statistiques de performance avec analyse pédagogique
 * Utilisable pour les écrans de victoire de tous les jeux
 *
 * @example
 * // Analyse automatique basée sur moves/optimal
 * <PerformanceStats
 *   current={15}
 *   optimal={7}
 *   type="moves"
 *   showAnalysis
 * />
 *
 * // Tips personnalisés
 * <PerformanceStats
 *   current={120}
 *   optimal={60}
 *   type="time"
 *   customTips={['Essaie plus vite !', 'Tu peux y arriver !']}
 * />
 */

import { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { colors, spacing, borderRadius, fontFamily } from '@/theme';

// Types
type PerformanceType = 'moves' | 'time' | 'score' | 'custom';
type PerformanceLevel = 'perfect' | 'excellent' | 'good' | 'needsWork' | 'learning';

interface PerformanceTip {
  title: string;
  icon: string;
  tips: string[];
  level: PerformanceLevel;
}

interface PerformanceStatsProps {
  /** Valeur actuelle (coups, temps, score) */
  current: number;
  /** Valeur optimale/cible */
  optimal: number;
  /** Type de métrique */
  type?: PerformanceType;
  /** Afficher l'analyse détaillée */
  showAnalysis?: boolean;
  /** Tips personnalisés (remplace l'auto-génération) */
  customTips?: string[];
  /** Titre personnalisé */
  customTitle?: string;
  /** Icône personnalisée */
  customIcon?: string;
  /** Délai d'animation d'entrée (ms) */
  enterDelay?: number;
  /** Style du conteneur */
  style?: ViewStyle;
  /** Thème de couleur */
  colorScheme?: 'default' | 'success' | 'warning';
}

// Configuration des couleurs par thème
const COLOR_SCHEMES = {
  default: {
    background: '#F8F9FF',
    border: '#E8ECFF',
    bullet: colors.primary.main,
  },
  success: {
    background: '#F0FFF4',
    border: '#C6F6D5',
    bullet: colors.feedback.success,
  },
  warning: {
    background: '#FFFAF0',
    border: '#FEEBC8',
    bullet: colors.feedback.warning,
  },
};

/**
 * Calcule le niveau de performance basé sur le ratio current/optimal
 */
function getPerformanceLevel(current: number, optimal: number): PerformanceLevel {
  if (optimal === 0) return 'perfect';

  const efficiency = current / optimal;

  if (efficiency <= 1) return 'perfect';
  if (efficiency <= 1.3) return 'excellent';
  if (efficiency <= 1.5) return 'good';
  if (efficiency <= 2.0) return 'needsWork';
  return 'learning';
}

/**
 * Génère l'analyse de performance pour les jeux de type "moves"
 */
function getMovesAnalysis(current: number, optimal: number): PerformanceTip {
  const extraMoves = current - optimal;
  const level = getPerformanceLevel(current, optimal);

  switch (level) {
    case 'perfect':
      return {
        level,
        title: 'Performance parfaite !',
        icon: '🏆',
        tips: [
          'Tu as trouvé le chemin optimal !',
          'Tu comprends très bien la stratégie.',
          'Continue comme ça pour les prochains niveaux !',
        ],
      };
    case 'excellent':
      return {
        level,
        title: 'Excellente performance !',
        icon: '✨',
        tips: [
          `Tu n'es qu'à ${extraMoves} coup${extraMoves > 1 ? 's' : ''} de l'optimal.`,
          'Tu as peut-être fait 1 ou 2 petites erreurs.',
          'Astuce : Planifie tes coups à l\'avance.',
        ],
      };
    case 'good':
      return {
        level,
        title: 'Bonne performance !',
        icon: '🎯',
        tips: [
          `Tu as utilisé ${extraMoves} coups de plus que nécessaire.`,
          'Planifie tes 2-3 prochains coups à l\'avance.',
          'Astuce : Observe bien avant d\'agir.',
        ],
      };
    case 'needsWork':
      return {
        level,
        title: 'Tu peux t\'améliorer !',
        icon: '💡',
        tips: [
          `Tu as utilisé ${extraMoves} coups supplémentaires.`,
          'Tu as peut-être défait des étapes déjà réussies.',
          'Astuce : Visualise le résultat avant de commencer.',
          'N\'hésite pas à utiliser les indices !',
        ],
      };
    default:
      return {
        level,
        title: 'Continue à apprendre !',
        icon: '🚀',
        tips: [
          'Ce puzzle demande de la pratique, ne t\'inquiète pas !',
          'Stratégie : Décompose le problème en petites étapes.',
          'Rejoue ce niveau pour t\'entraîner !',
        ],
      };
  }
}

/**
 * Génère l'analyse de performance pour les jeux de type "time"
 */
function getTimeAnalysis(current: number, optimal: number): PerformanceTip {
  const level = getPerformanceLevel(current, optimal);
  const extraSeconds = Math.max(0, current - optimal);

  switch (level) {
    case 'perfect':
      return {
        level,
        title: 'Temps parfait !',
        icon: '⚡',
        tips: [
          'Tu as été super rapide !',
          'Excellente concentration.',
        ],
      };
    case 'excellent':
      return {
        level,
        title: 'Très bon temps !',
        icon: '🎯',
        tips: [
          `Seulement ${extraSeconds}s de plus que l'optimal.`,
          'Tu maîtrises bien ce niveau.',
        ],
      };
    default:
      return {
        level,
        title: 'Tu peux aller plus vite !',
        icon: '⏱️',
        tips: [
          'La pratique rend parfait !',
          'Rejoue pour améliorer ton temps.',
        ],
      };
  }
}

export function PerformanceStats({
  current,
  optimal,
  type = 'moves',
  showAnalysis = true,
  customTips,
  customTitle,
  customIcon,
  enterDelay = 2000,
  style,
  colorScheme = 'default',
}: PerformanceStatsProps) {
  // Calcul de l'analyse
  const analysis = useMemo<PerformanceTip>(() => {
    if (customTips) {
      return {
        level: 'good',
        title: customTitle || 'Analyse',
        icon: customIcon || '📊',
        tips: customTips,
      };
    }

    switch (type) {
      case 'moves':
        return getMovesAnalysis(current, optimal);
      case 'time':
        return getTimeAnalysis(current, optimal);
      default:
        return getMovesAnalysis(current, optimal);
    }
  }, [current, optimal, type, customTips, customTitle, customIcon]);

  const colors = COLOR_SCHEMES[colorScheme];

  if (!showAnalysis) return null;

  return (
    <Animated.View
      entering={FadeInDown.delay(enterDelay)}
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.icon}>{analysis.icon}</Text>
        <Text style={styles.title}>{analysis.title}</Text>
      </View>

      {/* Tips */}
      <View style={styles.tipsContainer}>
        {analysis.tips.map((tip, index) => (
          <View key={index} style={styles.tipRow}>
            <Text style={[styles.bullet, { color: colors.bullet }]}>•</Text>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing[6],
    marginBottom: spacing[5],
    borderRadius: borderRadius.xl,
    padding: spacing[5],
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    flex: 1,
  },
  tipsContainer: {
    gap: spacing[3],
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  bullet: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    marginTop: 2,
  },
  tipText: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: colors.text.primary,
    flex: 1,
    lineHeight: 22,
  },
});

export type { PerformanceLevel, PerformanceTip };
export default PerformanceStats;
