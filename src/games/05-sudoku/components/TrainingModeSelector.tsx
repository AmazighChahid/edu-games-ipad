/**
 * TrainingModeSelector Component
 * Modal de sélection pour le mode entraînement libre
 * Permet de choisir thème, taille et difficulté
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable, Modal, ScrollView, StyleSheet } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import {
  colors,
  spacing,
  borderRadius,
  shadows,
  fontFamily,
  textStyles,
  touchTargets,
} from '@/theme';
import { useStore } from '@/store';
import type { TrainingConfig, SudokuSize, SudokuTheme, SudokuDifficulty } from '../types';
import {
  TRAINING_OPTIONS,
  TRAINING_LABELS,
  THEME_PREVIEW_EMOJIS,
} from '../data/levels';

// ============================================
// TYPES
// ============================================

interface TrainingModeSelectorProps {
  visible: boolean;
  onClose: () => void;
  config: TrainingConfig;
  onConfigChange: (config: Partial<TrainingConfig>) => void;
  onStart: () => void;
}

// ============================================
// COMPONENT
// ============================================

export function TrainingModeSelector({
  visible,
  onClose,
  config,
  onConfigChange,
  onStart,
}: TrainingModeSelectorProps) {
  const hapticEnabled = useStore((state) => state.hapticEnabled);

  const handleSelect = useCallback(
    <T extends keyof TrainingConfig>(key: T, value: TrainingConfig[T]) => {
      if (hapticEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onConfigChange({ [key]: value });
    },
    [hapticEnabled, onConfigChange]
  );

  const handleStart = useCallback(() => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onStart();
  }, [hapticEnabled, onStart]);

  const handleClose = useCallback(() => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onClose();
  }, [hapticEnabled, onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />

        <Animated.View
          entering={SlideInDown.springify().damping(15).stiffness(150)}
          exiting={SlideOutDown.duration(200)}
          style={styles.modal}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Mode Entraînement</Text>
            <Text style={styles.subtitle}>Personnalise ta grille !</Text>
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Sélection du thème */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Thème</Text>
              <View style={styles.optionsRow}>
                {TRAINING_OPTIONS.themes.map((theme) => (
                  <ThemeOption
                    key={theme}
                    theme={theme}
                    isSelected={config.theme === theme}
                    onSelect={() => handleSelect('theme', theme)}
                  />
                ))}
              </View>
            </View>

            {/* Sélection de la taille */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Taille de grille</Text>
              <View style={styles.optionsRow}>
                {TRAINING_OPTIONS.sizes.map((size) => (
                  <SizeOption
                    key={size}
                    size={size}
                    isSelected={config.size === size}
                    onSelect={() => handleSelect('size', size)}
                  />
                ))}
              </View>
            </View>

            {/* Sélection de la difficulté */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Difficulté</Text>
              <View style={styles.optionsRow}>
                {TRAINING_OPTIONS.difficulties.map((difficulty) => (
                  <DifficultyOption
                    key={difficulty}
                    difficulty={difficulty}
                    isSelected={config.difficulty === difficulty}
                    onSelect={() => handleSelect('difficulty', difficulty)}
                  />
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Boutons */}
          <View style={styles.footer}>
            <Pressable style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </Pressable>

            <Pressable style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>Jouer !</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

interface ThemeOptionProps {
  theme: SudokuTheme;
  isSelected: boolean;
  onSelect: () => void;
}

function ThemeOption({ theme, isSelected, onSelect }: ThemeOptionProps) {
  return (
    <Pressable
      onPress={onSelect}
      style={[styles.themeOption, isSelected && styles.optionSelected]}
    >
      <Text style={styles.themeEmoji}>{THEME_PREVIEW_EMOJIS[theme]}</Text>
      <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
        {TRAINING_LABELS.themes[theme]}
      </Text>
    </Pressable>
  );
}

interface SizeOptionProps {
  size: SudokuSize;
  isSelected: boolean;
  onSelect: () => void;
}

function SizeOption({ size, isSelected, onSelect }: SizeOptionProps) {
  const sizeColors: Record<SudokuSize, string> = {
    4: '#A8E6CF',
    6: '#FFE082',
    9: '#FFAB91',
  };

  return (
    <Pressable
      onPress={onSelect}
      style={[
        styles.sizeOption,
        isSelected && styles.optionSelected,
        isSelected && { borderColor: sizeColors[size] },
      ]}
    >
      <View style={[styles.sizePreview, { backgroundColor: sizeColors[size] }]}>
        <Text style={styles.sizeNumber}>{size}</Text>
      </View>
      <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
        {TRAINING_LABELS.sizes[size]}
      </Text>
    </Pressable>
  );
}

interface DifficultyOptionProps {
  difficulty: SudokuDifficulty;
  isSelected: boolean;
  onSelect: () => void;
}

function DifficultyOption({ difficulty, isSelected, onSelect }: DifficultyOptionProps) {
  const difficultyColors: Record<SudokuDifficulty, string> = {
    1: colors.feedback.success,
    2: colors.secondary.main,
    3: colors.primary.main,
  };

  const stars = '★'.repeat(difficulty);

  return (
    <Pressable
      onPress={onSelect}
      style={[
        styles.difficultyOption,
        isSelected && styles.optionSelected,
        isSelected && { borderColor: difficultyColors[difficulty] },
      ]}
    >
      <Text style={[styles.difficultyStars, { color: difficultyColors[difficulty] }]}>
        {stars}
      </Text>
      <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
        {TRAINING_LABELS.difficulties[difficulty]}
      </Text>
    </Pressable>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '85%',
    ...shadows.lg,
  },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: spacing[5],
    paddingBottom: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.border,
  },
  title: {
    ...textStyles.h2,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  subtitle: {
    ...textStyles.bodyLarge,
    color: colors.text.secondary,
  },

  // Content
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing[4],
    gap: spacing[5],
  },

  // Sections
  section: {
    gap: spacing[3],
  },
  sectionTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    justifyContent: 'center',
  },

  // Theme options
  themeOption: {
    width: 100,
    height: 80,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    minWidth: touchTargets.minimum,
    minHeight: touchTargets.minimum,
  },
  themeEmoji: {
    fontSize: 20,
    letterSpacing: -2,
  },

  // Size options
  sizeOption: {
    width: 90,
    height: 80,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    minWidth: touchTargets.minimum,
    minHeight: touchTargets.minimum,
  },
  sizePreview: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeNumber: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: colors.text.primary,
  },

  // Difficulty options
  difficultyOption: {
    width: 100,
    height: 70,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    minWidth: touchTargets.minimum,
    minHeight: touchTargets.minimum,
  },
  difficultyStars: {
    fontSize: 18,
  },

  // Shared option styles
  optionSelected: {
    borderWidth: 3,
    backgroundColor: colors.background.secondary,
    ...shadows.md,
  },
  optionLabel: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    color: colors.text.secondary,
  },
  optionLabelSelected: {
    color: colors.text.primary,
    fontFamily: fontFamily.semiBold,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    gap: spacing[3],
    padding: spacing[4],
    paddingBottom: spacing[6],
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
  },
  cancelButton: {
    flex: 1,
    height: touchTargets.comfortable,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.ui.border,
  },
  cancelButtonText: {
    ...textStyles.button,
    color: colors.text.secondary,
  },
  startButton: {
    flex: 2,
    height: touchTargets.comfortable,
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  startButtonText: {
    ...textStyles.button,
    color: colors.text.inverse,
  },
});

export default TrainingModeSelector;
