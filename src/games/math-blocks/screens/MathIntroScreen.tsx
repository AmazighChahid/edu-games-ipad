/**
 * MathBlocks Intro Screen
 * Game introduction and level selection
 *
 * Refactored to use standardized components:
 * - ScreenHeader for consistent header
 * - ScreenBackground for playful background
 * - PageContainer for layout
 */

import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { theme } from '@/theme';
import { PageContainer, ScreenHeader } from '@/components/common';
import { mathLevels } from '../data/levels';
import { OPERATION_SYMBOLS } from '../types';

export function MathIntroScreen() {
  const router = useRouter();

  const handlePlayLevel = (levelId: string) => {
    router.push(`/(games)/math-blocks/play?levelId=${levelId}`);
  };

  const handleBack = () => {
    router.push('/');
  };

  const handleParentPress = () => {
    router.push('/(parent)');
  };

  return (
    <PageContainer variant="playful" scrollable>
      {/* Header standardisé */}
      <ScreenHeader
        variant="game"
        title="MathBlocks"
        emoji="🧮"
        onBack={handleBack}
        showParentButton
        onParentPress={handleParentPress}
      />

      {/* Subtitle */}
      <View style={styles.subtitleContainer}>
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
              ? theme.colors.feedback.success
              : level.difficulty === 'medium'
              ? theme.colors.feedback.warning
              : theme.colors.feedback.error;

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
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  subtitleContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing[6],
    marginTop: theme.spacing[2],
    paddingHorizontal: theme.spacing[6],
  },
  subtitle: {
    ...theme.textStyles.h3,
    color: theme.colors.text.secondary,
  },
  instructionsCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing[5],
    marginBottom: theme.spacing[6],
    marginHorizontal: theme.spacing[6],
    ...theme.shadows.md,
  },
  instructionsTitle: {
    ...theme.textStyles.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[3],
  },
  instructionsList: {
    gap: theme.spacing[2],
  },
  instruction: {
    fontSize: 18, // ✅ Augmenté de 15 → 18 pour respecter guideline enfant
    color: theme.colors.text.secondary,
    lineHeight: 26,
    fontFamily: 'Nunito_400Regular',
  },
  sectionTitle: {
    ...theme.textStyles.h2,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
    paddingHorizontal: theme.spacing[6],
  },
  levelsGrid: {
    gap: theme.spacing[4],
    paddingHorizontal: theme.spacing[6],
  },
  levelCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing[5],
    ...theme.shadows.md,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[3],
    borderRadius: theme.borderRadius.round,
    marginBottom: theme.spacing[2],
  },
  levelBadgeText: {
    color: theme.colors.text.inverse,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Nunito_700Bold',
  },
  levelNumber: {
    ...theme.textStyles.h2,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  levelInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[4],
  },
  levelOperations: {
    fontSize: 20,
    color: theme.colors.primary.main,
    fontWeight: '600',
    fontFamily: 'Nunito_600SemiBold',
  },
  levelRange: {
    fontSize: 16, // ✅ Augmenté de 14 → 16
    color: theme.colors.text.secondary,
    fontFamily: 'Nunito_400Regular',
  },
  levelPairs: {
    fontSize: 16, // ✅ Augmenté de 14 → 16
    color: theme.colors.text.secondary,
    fontFamily: 'Nunito_400Regular',
  },
  levelTime: {
    fontSize: 16, // ✅ Augmenté de 14 → 16
    color: theme.colors.text.muted,
    fontFamily: 'Nunito_400Regular',
  },
  playButton: {
    backgroundColor: theme.colors.secondary.main,
    paddingVertical: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    minHeight: theme.touchTargets.child, // ✅ Touch target enfant
    justifyContent: 'center',
  },
  playButtonText: {
    ...theme.textStyles.button,
    color: theme.colors.text.inverse,
  },
});
