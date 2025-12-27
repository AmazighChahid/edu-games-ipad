/**
 * PerformanceAnalysis Component
 * Educational feedback explaining why more moves were used
 */

import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface PerformanceAnalysisProps {
  moves: number;
  optimalMoves: number;
  isPerfect: boolean;
}

function getPerformanceAnalysis(moves: number, optimalMoves: number): {
  title: string;
  icon: string;
  tips: string[];
} {
  const extraMoves = moves - optimalMoves;
  const efficiency = moves / optimalMoves;

  if (extraMoves === 0) {
    return {
      title: 'Performance parfaite ! 🏆',
      icon: '🌟',
      tips: [
        'Tu as trouvé le chemin optimal !',
        'Tu comprends très bien la stratégie.',
        'Continue comme ça pour les prochains niveaux !',
      ],
    };
  }

  if (efficiency <= 1.3) {
    return {
      title: 'Excellente performance ! 💫',
      icon: '✨',
      tips: [
        `Tu n'es qu'à ${extraMoves} coup${extraMoves > 1 ? 's' : ''} de l'optimal.`,
        'Tu as peut-être fait 1 ou 2 petites erreurs.',
        'Astuce : Essaie de toujours déplacer le plus petit disque en premier.',
      ],
    };
  }

  if (efficiency <= 1.5) {
    return {
      title: 'Bonne performance ! 💪',
      icon: '🎯',
      tips: [
        `Tu as utilisé ${extraMoves} coups de plus que nécessaire.`,
        'Tu as probablement inversé l\'ordre de quelques disques.',
        'Astuce : Déplace toujours un petit disque avant un grand.',
        'Planifie tes 2-3 prochains coups à l\'avance.',
      ],
    };
  }

  if (efficiency <= 2.0) {
    return {
      title: 'Tu peux t\'améliorer ! 🌱',
      icon: '💡',
      tips: [
        `Tu as utilisé ${extraMoves} coups supplémentaires.`,
        'Tu as peut-être défait des étapes déjà réussies.',
        'Astuce : Visualise la tour complète avant de commencer.',
        'Pense à la règle : petit sur moyen, moyen sur grand.',
        'N\'hésite pas à utiliser le bouton d\'indice ! 👁️',
      ],
    };
  }

  return {
    title: 'Continue à apprendre ! 🌈',
    icon: '🚀',
    tips: [
      'Ce puzzle demande de la pratique, ne t\'inquiète pas !',
      'Stratégie : Décompose le problème en petites étapes.',
      'Observe bien où tu veux amener chaque disque.',
      'Astuce : La tour du milieu est ton amie pour les changements.',
      'Rejoue ce niveau pour t\'entraîner ! 🔄',
    ],
  };
}

export function PerformanceAnalysis({
  moves,
  optimalMoves,
  isPerfect,
}: PerformanceAnalysisProps) {
  const analysis = getPerformanceAnalysis(moves, optimalMoves);

  return (
    <Animated.View entering={FadeInDown.delay(2200)} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.icon}>{analysis.icon}</Text>
        <Text style={styles.title}>{analysis.title}</Text>
      </View>

      {/* Tips */}
      <View style={styles.tipsContainer}>
        {analysis.tips.map((tip, index) => (
          <View key={index} style={styles.tipRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 30,
    marginBottom: 20,
    backgroundColor: '#F8F9FF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E8ECFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 18,
    fontWeight: '700',
    color: '#4A4A4A',
    flex: 1,
  },
  tipsContainer: {
    gap: 10,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bullet: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 18,
    color: '#5B8DEE',
    marginTop: 2,
  },
  tipText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 15,
    color: '#4A4A4A',
    flex: 1,
    lineHeight: 22,
  },
});
