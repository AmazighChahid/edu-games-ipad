import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LabyrintheGame, LEVELS, LevelConfig, SessionStats } from '../../../src/games/03-labyrinthe';

export default function LabyrintheScreen() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());

  const handleLevelComplete = (stats: SessionStats) => {
    console.log('Niveau terminé !', stats);
    setCompletedLevels((prev) => new Set(prev).add(stats.levelId));

    // Passer au niveau suivant
    const currentIndex = LEVELS.findIndex((l) => l.id === stats.levelId);
    if (currentIndex < LEVELS.length - 1) {
      setSelectedLevel(LEVELS[currentIndex + 1]);
    } else {
      // Retour à la sélection de niveau
      setSelectedLevel(null);
    }
  };

  const handleExit = () => {
    setSelectedLevel(null);
  };

  if (selectedLevel) {
    return (
      <LabyrintheGame
        level={selectedLevel}
        onComplete={handleLevelComplete}
        onExit={handleExit}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </Pressable>
        <View style={styles.headerContent}>
          <Text style={styles.mascot}>🐿️</Text>
          <View>
            <Text style={styles.title}>Labyrinthe Logique</Text>
            <Text style={styles.subtitle}>avec Noisette l'Écureuil</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌲 Forêt Enchantée</Text>
          <View style={styles.levelsGrid}>
            {LEVELS.filter((l) => l.theme === 'forest').map((level) => (
              <Pressable
                key={level.id}
                style={[
                  styles.levelCard,
                  completedLevels.has(level.id) && styles.levelCardCompleted,
                ]}
                onPress={() => setSelectedLevel(level)}
              >
                <Text style={styles.levelNumber}>{level.id}</Text>
                <Text style={styles.levelName}>{level.name}</Text>
                <View style={styles.levelInfo}>
                  <Text style={styles.levelSize}>
                    {level.width}×{level.height}
                  </Text>
                  {level.hasKeys && <Text style={styles.levelIcon}>🔑</Text>}
                  {level.hasGems && <Text style={styles.levelIcon}>💎</Text>}
                </View>
                {completedLevels.has(level.id) && (
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedIcon}>✓</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏛️ Temple Ancien</Text>
          <View style={styles.levelsGrid}>
            {LEVELS.filter((l) => l.theme === 'temple').map((level) => (
              <Pressable
                key={level.id}
                style={[
                  styles.levelCard,
                  completedLevels.has(level.id) && styles.levelCardCompleted,
                ]}
                onPress={() => setSelectedLevel(level)}
              >
                <Text style={styles.levelNumber}>{level.id}</Text>
                <Text style={styles.levelName}>{level.name}</Text>
                <View style={styles.levelInfo}>
                  <Text style={styles.levelSize}>
                    {level.width}×{level.height}
                  </Text>
                  {level.hasKeys && <Text style={styles.levelIcon}>🔑</Text>}
                  {level.hasGems && <Text style={styles.levelIcon}>💎</Text>}
                </View>
                {completedLevels.has(level.id) && (
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedIcon}>✓</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Comment jouer ? 🎮</Text>
          <Text style={styles.infoText}>• Glisse ton doigt pour déplacer l'avatar</Text>
          <Text style={styles.infoText}>• Trouve la sortie ⭐ du labyrinthe</Text>
          <Text style={styles.infoText}>• Collecte les clés 🔑 pour ouvrir les portes</Text>
          <Text style={styles.infoText}>• Ramasse les gemmes 💎 bonus</Text>
          <Text style={styles.infoText}>• Demande des indices 💡 si tu es bloqué</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(91, 141, 238, 0.2)',
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#5B8DEE',
    fontWeight: '600',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mascot: {
    fontSize: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
  },
  subtitle: {
    fontSize: 14,
    color: '#4A5568',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 16,
  },
  levelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  levelCard: {
    width: '47%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  levelCardCompleted: {
    borderWidth: 2,
    borderColor: '#7BC74D',
  },
  levelNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#5B8DEE',
    marginBottom: 8,
  },
  levelName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelSize: {
    fontSize: 14,
    color: '#4A5568',
  },
  levelIcon: {
    fontSize: 16,
  },
  completedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#7BC74D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedIcon: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  infoBox: {
    backgroundColor: 'rgba(91, 141, 238, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(91, 141, 238, 0.3)',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 8,
    lineHeight: 24,
  },
});
