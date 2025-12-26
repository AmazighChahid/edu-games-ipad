import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SuitesLogiquesGame } from '../../../src/games/suites-logiques';
import type { SessionStats } from '../../../src/games/suites-logiques';

// ============================================
// ÉCRAN PRINCIPAL - SUITES LOGIQUES
// ============================================

export default function SuitesLogiquesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ level?: string }>();
  const initialLevel = parseInt(params.level ?? '1', 10);

  const handleSessionEnd = (stats: SessionStats) => {
    console.log('Session terminée:', stats);
    // Naviguer vers l'écran de victoire avec les statistiques
    router.replace({
      pathname: '/(games)/suites-logiques/victory',
      params: {
        completed: stats.completed.toString(),
        correctFirstTry: stats.correctFirstTry.toString(),
        maxStreak: stats.maxStreak.toString(),
        totalTime: stats.totalTime.toString(),
        level: initialLevel.toString(),
      },
    });
  };

  const handleExit = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <SuitesLogiquesGame
        theme="shapes" // Thème par défaut
        initialLevel={initialLevel}
        onSessionEnd={handleSessionEnd}
        onExit={handleExit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
