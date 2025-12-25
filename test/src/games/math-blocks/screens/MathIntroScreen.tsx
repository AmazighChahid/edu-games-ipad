/**
 * MathBlocks Intro Screen
 * Game introduction and level selection
 */

import { View, StyleSheet, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, borderRadius, shadows } from '@/theme';
import { mathLevels } from '../data/levels';
import { OPERATION_SYMBOLS } from '../types';

export function MathIntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handlePlayLevel = (levelId: string) => {
    router.push(`/(games)/math-blocks/play?levelId=${levelId}`);
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <ScrollView
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing[4],
          paddingLeft: insets.left + spacing[4],
          paddingRight: insets.right + spacing[4],
        },
      ]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'} Menu</Text>
        </Pressable>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>MathBlocks</Text>
        <Text style={styles.subtitle}>Calcul Mental</Text>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>Comment jouer ?</Text>
        <View style={styles.instructionsList}>
          <Text style={styles.instruction}>
            1. Trouve les paires : un calcul et son resultat
          </Text>
          <Text style={styles.instruction}>
            2. Touche le calcul (ex: 4 + 1)
          </Text>
          <Text style={styles.instruction}>
            3. Puis touche le resultat (ex: 5)
          </Text>
          <Text style={styles.instruction}>
            4. Les paires correctes disparaissent !
          </Text>
        </View>
      </View>

      {/* Levels */}
      <Text style={styles.sectionTitle}>Choisis un niveau</Text>

      <View style={styles.levelsGrid}>
        {mathLevels.map((level) => {
          const operationSymbols = level.operations
            .map((op) => OPERATION_SYMBOLS[op])
            .join(' ');

          const difficultyColor =
            level.difficulty === 'easy'
              ? colors.feedback.success
              : level.difficulty === 'medium'
              ? colors.feedback.warning
              : colors.feedback.error;

          return (
            <Pressable
              key={level.id}
              style={styles.levelCard}
              onPress={() => handlePlayLevel(level.id)}
            >
              <View
                style={[
                  styles.levelBadge,
                  { backgroundColor: difficultyColor },
                ]}
              >
                <Text style={styles.levelBadgeText}>
                  {level.difficulty === 'easy'
                    ? 'Facile'
                    : level.difficulty === 'medium'
                    ? 'Moyen'
                    : 'Difficile'}
                </Text>
              </View>

              <Text style={styles.levelNumber}>Niveau {level.displayOrder}</Text>

              <View style={styles.levelInfo}>
                <Text style={styles.levelOperations}>{operationSymbols}</Text>
                <Text style={styles.levelRange}>
                  Nombres: {level.numberRange[0]}-{level.numberRange[1]}
                </Text>
                <Text style={styles.levelPairs}>
                  {level.targetPairs} paires
                </Text>
                {level.timeLimit > 0 && (
                  <Text style={styles.levelTime}>
                    {Math.floor(level.timeLimit / 60)}:{String(level.timeLimit % 60).padStart(2, '0')}
                  </Text>
                )}
              </View>

              <View style={styles.playButton}>
                <Text style={styles.playButtonText}>Jouer</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    paddingBottom: spacing[8],
  },
  header: {
    marginBottom: spacing[4],
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary.main,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.lg,
  },
  backButtonText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: colors.primary.main,
  },
  subtitle: {
    fontSize: 18,
    color: colors.text.secondary,
    marginTop: spacing[1],
  },
  instructionsCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[5],
    marginBottom: spacing[6],
    ...shadows.md,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing[3],
  },
  instructionsList: {
    gap: spacing[2],
  },
  instruction: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  levelsGrid: {
    gap: spacing[4],
  },
  levelCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    ...shadows.md,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.full,
    marginBottom: spacing[2],
  },
  levelBadgeText: {
    color: colors.text.inverse,
    fontSize: 12,
    fontWeight: 'bold',
  },
  levelNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  levelInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  levelOperations: {
    fontSize: 20,
    color: colors.primary.main,
    fontWeight: '600',
  },
  levelRange: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  levelPairs: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  levelTime: {
    fontSize: 14,
    color: colors.text.muted,
  },
  playButton: {
    backgroundColor: colors.secondary.main,
    paddingVertical: spacing[3],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  playButtonText: {
    color: colors.text.inverse,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
