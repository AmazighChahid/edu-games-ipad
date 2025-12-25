/**
 * Calcul Posé Intro Screen
 * Level selection and introduction to handwriting calculation game
 */

import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { colors, spacing, textStyles, borderRadius, shadows, touchTargets } from '@/theme';
import { calculPoseLevels } from '../data/levels';
import type { CalculPoseLevelConfig } from '../types';
import { getOperationSymbol } from '../logic/calculEngine';

export function CalculPoseIntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedLevel, setSelectedLevel] = useState<CalculPoseLevelConfig>(calculPoseLevels[0]);

  const playButtonScale = useSharedValue(1);

  const handleBack = () => {
    router.back();
  };

  const handlePlay = () => {
    playButtonScale.value = withSpring(0.9, {}, () => {
      playButtonScale.value = withSpring(1);
    });

    router.push({
      pathname: '/(games)/calcul-pose/play',
      params: { levelId: selectedLevel.id },
    });
  };

  const playButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: playButtonScale.value }],
  }));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return colors.feedback.success;
      case 'medium':
        return colors.secondary.main;
      case 'hard':
        return colors.feedback.error;
      default:
        return colors.text.secondary;
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Facile';
      case 'medium':
        return 'Moyen';
      case 'hard':
        return 'Difficile';
      default:
        return '';
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing[3],
          paddingBottom: insets.bottom + spacing[3],
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>←</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Calcul Posé</Text>

        <View style={styles.headerPlaceholder} />
      </View>

      {/* Description */}
      <Animated.View entering={FadeIn} style={styles.description}>
        <Text style={styles.descriptionIcon}>✏️</Text>
        <Text style={styles.descriptionText}>
          Dessine le résultat dans les cases noires !
        </Text>
      </Animated.View>

      {/* Preview card */}
      <Animated.View entering={FadeIn.delay(100)} style={styles.previewCard}>
        <View style={styles.previewHeader}>
          <Text style={styles.previewTitle}>
            {selectedLevel.operation === 'addition' ? 'Addition' : 'Soustraction'}
          </Text>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(selectedLevel.difficulty) }]}>
            <Text style={styles.difficultyText}>
              {getDifficultyLabel(selectedLevel.difficulty)}
            </Text>
          </View>
        </View>

        <View style={styles.previewExample}>
          <Text style={styles.previewNumber}>{selectedLevel.maxOperand}</Text>
          <Text style={styles.previewOperator}>{getOperationSymbol(selectedLevel.operation)}</Text>
          <Text style={styles.previewNumber}>{Math.floor(selectedLevel.maxOperand / 2)}</Text>
          <View style={styles.previewLine} />
          <View style={styles.previewResult}>
            <View style={styles.previewBox} />
            <View style={styles.previewBox} />
          </View>
        </View>

        <Text style={styles.previewInfo}>
          {selectedLevel.problemCount} calculs • {selectedLevel.requiresCarry ? 'Avec retenue' : 'Sans retenue'}
        </Text>
      </Animated.View>

      {/* Level selector */}
      <View style={styles.levelSelector}>
        <Text style={styles.selectorTitle}>Choisis un niveau</Text>

        <View style={styles.levelGrid}>
          {calculPoseLevels.map((level, index) => {
            const isSelected = selectedLevel.id === level.id;
            return (
              <Pressable
                key={level.id}
                onPress={() => setSelectedLevel(level)}
                style={[
                  styles.levelButton,
                  isSelected && styles.levelButtonSelected,
                ]}
              >
                <Text style={[
                  styles.levelNumber,
                  isSelected && styles.levelNumberSelected,
                ]}>
                  {index + 1}
                </Text>
                <Text style={[
                  styles.levelOperation,
                  isSelected && styles.levelOperationSelected,
                ]}>
                  {getOperationSymbol(level.operation)}
                </Text>
                <View style={[
                  styles.levelDot,
                  { backgroundColor: getDifficultyColor(level.difficulty) }
                ]} />
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Play button */}
      <Animated.View style={[styles.playButtonContainer, playButtonStyle]}>
        <Pressable onPress={handlePlay} style={styles.playButton}>
          <Text style={styles.playButtonIcon}>▶</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.game,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    marginBottom: spacing[4],
  },
  headerButton: {
    width: touchTargets.medium,
    height: touchTargets.medium,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  headerButtonText: {
    fontSize: 24,
    color: colors.text.primary,
  },
  headerTitle: {
    ...textStyles.h2,
    color: colors.text.primary,
  },
  headerPlaceholder: {
    width: touchTargets.medium,
  },
  description: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    marginBottom: spacing[6],
    gap: spacing[3],
  },
  descriptionIcon: {
    fontSize: 32,
  },
  descriptionText: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  previewCard: {
    backgroundColor: '#FFFDE7',
    marginHorizontal: spacing[6],
    padding: spacing[5],
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    ...shadows.md,
    borderWidth: 2,
    borderColor: '#E0D8B0',
    marginBottom: spacing[6],
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  previewTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
  },
  difficultyBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  difficultyText: {
    ...textStyles.caption,
    color: colors.text.inverse,
    fontWeight: 'bold',
  },
  previewExample: {
    alignItems: 'flex-end',
    marginBottom: spacing[3],
  },
  previewNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  previewOperator: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text.primary,
    alignSelf: 'flex-start',
    marginRight: spacing[2],
  },
  previewLine: {
    width: 120,
    height: 3,
    backgroundColor: colors.text.primary,
    marginVertical: spacing[2],
  },
  previewResult: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  previewBox: {
    width: 40,
    height: 40,
    backgroundColor: colors.text.primary,
    borderRadius: borderRadius.sm,
  },
  previewInfo: {
    ...textStyles.caption,
    color: colors.text.muted,
  },
  levelSelector: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
  selectorTitle: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing[3],
  },
  levelButton: {
    width: 70,
    height: 80,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    ...shadows.sm,
  },
  levelButtonSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light + '20',
  },
  levelNumber: {
    ...textStyles.h3,
    color: colors.text.primary,
  },
  levelNumberSelected: {
    color: colors.primary.main,
  },
  levelOperation: {
    fontSize: 20,
    color: colors.text.secondary,
  },
  levelOperationSelected: {
    color: colors.primary.main,
  },
  levelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: spacing[1],
  },
  playButtonContainer: {
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  playButtonIcon: {
    fontSize: 28,
    color: colors.primary.contrast,
    marginLeft: 4,
  },
});
