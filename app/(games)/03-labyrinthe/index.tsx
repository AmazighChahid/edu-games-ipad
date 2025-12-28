/**
 * Écran principal du jeu Labyrinthe
 * Utilise les composants standards PageContainer et ScreenHeader
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { PageContainer, ScreenHeader, GameModal } from '../../../src/components/common';
import { theme } from '../../../src/theme';
import { LabyrintheGame, LEVELS, LevelConfig, SessionStats } from '../../../src/games/03-labyrinthe';

export default function LabyrintheScreen() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
  const [showHelp, setShowHelp] = useState(false);

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
    <PageContainer variant="playful" scrollable>
      <ScreenHeader
        variant="game"
        title="Labyrinthe Logique"
        emoji="🐿️"
        onBack={() => router.back()}
        showParentButton
        onParentPress={() => router.push('/(parent)')}
        showHelpButton
        onHelpPress={() => setShowHelp(true)}
      />

      <View style={styles.content}>
        {/* Section Forêt Enchantée */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌲 Forêt Enchantée</Text>
          <View style={styles.levelsGrid}>
            {LEVELS.filter((l) => l.theme === 'forest').map((level) => (
              <LevelCard
                key={level.id}
                level={level}
                isCompleted={completedLevels.has(level.id)}
                onPress={() => setSelectedLevel(level)}
              />
            ))}
          </View>
        </View>

        {/* Section Temple Ancien */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏛️ Temple Ancien</Text>
          <View style={styles.levelsGrid}>
            {LEVELS.filter((l) => l.theme === 'temple').map((level) => (
              <LevelCard
                key={level.id}
                level={level}
                isCompleted={completedLevels.has(level.id)}
                onPress={() => setSelectedLevel(level)}
              />
            ))}
          </View>
        </View>

        {/* Boîte d'information */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Comment jouer ? 🎮</Text>
          <Text style={styles.infoText}>• Glisse ton doigt pour déplacer l'avatar</Text>
          <Text style={styles.infoText}>• Trouve la sortie ⭐ du labyrinthe</Text>
          <Text style={styles.infoText}>• Collecte les clés 🔑 pour ouvrir les portes</Text>
          <Text style={styles.infoText}>• Ramasse les gemmes 💎 bonus</Text>
          <Text style={styles.infoText}>• Demande des indices 💡 si tu es bloqué</Text>
        </View>
      </View>

      {/* Modal d'aide */}
      <GameModal
        visible={showHelp}
        onClose={() => setShowHelp(false)}
        variant="info"
        title="Comment jouer"
        emoji="❓"
        buttons={[
          { label: 'Compris !', onPress: () => setShowHelp(false), variant: 'primary' },
        ]}
      >
        <Text style={styles.infoText}>
          Guide Noisette l'Écureuil à travers le labyrinthe ! Glisse ton doigt pour le déplacer, collecte les clés pour ouvrir les portes et trouve la sortie ⭐
        </Text>
      </GameModal>
    </PageContainer>
  );
}

// Composant LevelCard avec animations
interface LevelCardProps {
  level: LevelConfig;
  isCompleted: boolean;
  onPress: () => void;
}

const LevelCard: React.FC<LevelCardProps> = ({ level, isCompleted, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessible
      accessibilityLabel={`Niveau ${level.id}: ${level.name}${isCompleted ? ', complété' : ''}`}
      accessibilityRole="button"
    >
      <Animated.View
        style={[
          styles.levelCard,
          isCompleted && styles.levelCardCompleted,
          animatedStyle,
        ]}
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
        {isCompleted && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedIcon}>✓</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing[4],
  },
  section: {
    marginBottom: theme.spacing[8],
  },
  sectionTitle: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: theme.fontSize.xl, // 24pt pour titres de section
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
  },
  levelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
  },
  levelCard: {
    width: '47%',
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    ...theme.shadows.md,
    position: 'relative',
  },
  levelCardCompleted: {
    borderWidth: 2,
    borderColor: theme.colors.feedback.success,
  },
  levelNumber: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing[2],
  },
  levelName: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: theme.fontSize.lg, // 18pt minimum
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  levelSize: {
    fontFamily: 'Nunito_400Regular',
    fontSize: theme.fontSize.lg, // 18pt minimum (était 14)
    color: theme.colors.text.secondary,
  },
  levelIcon: {
    fontSize: 18,
  },
  completedBadge: {
    position: 'absolute',
    top: theme.spacing[2],
    right: theme.spacing[2],
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.feedback.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedIcon: {
    color: theme.colors.text.inverse,
    fontSize: 18,
    fontWeight: '700',
  },
  infoBox: {
    backgroundColor: theme.colors.primary.light,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[5],
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
  },
  infoTitle: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: theme.fontSize.lg, // 18pt
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[3],
  },
  infoText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: theme.fontSize.lg, // 18pt minimum (était 16)
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[2],
    lineHeight: 24,
  },
});
