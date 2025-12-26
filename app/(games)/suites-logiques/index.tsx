import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SuitesLogiquesGame } from '../../../src/games/suites-logiques';
import type { SessionStats } from '../../../src/games/suites-logiques';

// ============================================
// ÉCRAN PRINCIPAL - SUITES LOGIQUES
// ============================================

export default function SuitesLogiquesScreen() {
  const router = useRouter();

  const handleSessionEnd = (stats: SessionStats) => {
    console.log('Session terminée:', stats);
    // TODO: Sauvegarder les statistiques
    // TODO: Afficher un écran de résumé
    router.back();
  };

  const handleExit = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <SuitesLogiquesGame
        theme="shapes" // Thème par défaut
        initialLevel={1}
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
