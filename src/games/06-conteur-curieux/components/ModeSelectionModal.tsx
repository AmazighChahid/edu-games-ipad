/**
 * ModeSelectionModal Component
 *
 * Modal de sélection du mode de lecture
 * - Écouter 🎧 (audio only)
 * - Lire 👁️ (text only)
 * - Mixte 🎧👁️ (audio + text, recommended)
 */

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { spacing, borderRadius, shadows, fontFamily } from '../../../theme';
import type { ReadingMode, ConteurLevel } from '../types';

interface ModeSelectionModalProps {
  visible: boolean;
  level: ConteurLevel | null;
  selectedMode: ReadingMode;
  onSelectMode: (mode: ReadingMode) => void;
  onStart: () => void;
  onClose: () => void;
}

interface ModeButtonProps {
  mode: ReadingMode;
  emoji: string;
  label: string;
  description: string;
  isSelected: boolean;
  isRecommended?: boolean;
  onPress: (mode: ReadingMode) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function ModeButton({
  mode,
  emoji,
  label,
  description,
  isSelected,
  isRecommended,
  onPress,
}: ModeButtonProps) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 200 });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 150 });
  }, []);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(mode);
  }, [mode, onPress]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[
        styles.modeButton,
        isSelected && styles.modeButtonSelected,
        buttonStyle,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${label}: ${description}`}
    >
      {isRecommended && (
        <View style={styles.recommendedBadge}>
          <Text style={styles.recommendedText}>⭐</Text>
        </View>
      )}
      <Text style={styles.modeEmoji}>{emoji}</Text>
      <Text style={[styles.modeLabel, isSelected && styles.modeLabelSelected]}>
        {label}
      </Text>
      <Text style={styles.modeDescription}>{description}</Text>
    </AnimatedPressable>
  );
}

export function ModeSelectionModal({
  visible,
  level,
  selectedMode,
  onSelectMode,
  onStart,
  onClose,
}: ModeSelectionModalProps) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const handleStart = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onStart();
  }, [onStart]);

  const handleClose = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  }, [onClose]);

  if (!level) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleClose} />

        <Animated.View
          style={[styles.modal, { width: isTablet ? 480 : '90%' }]}
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
        >
          {/* Close button */}
          <Pressable style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeIcon}>✕</Text>
          </Pressable>

          {/* Story preview */}
          <View style={styles.storyPreview}>
            <Text style={styles.storyEmoji}>{level.story.emoji}</Text>
            <View style={styles.storyInfo}>
              <Text style={styles.storyTitle}>{level.story.title}</Text>
              <Text style={styles.storyMeta}>
                {level.themeEmoji} {level.theme} • {level.story.readingTime} min
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Comment veux-tu découvrir cette histoire ?</Text>

          {/* Mode options */}
          <View style={styles.modesContainer}>
            <ModeButton
              mode="listen"
              emoji="🎧"
              label="Écouter"
              description="Audio uniquement"
              isSelected={selectedMode === 'listen'}
              onPress={onSelectMode}
            />
            <ModeButton
              mode="mixed"
              emoji="🎧👁️"
              label="Mixte"
              description="Audio + Texte"
              isSelected={selectedMode === 'mixed'}
              isRecommended
              onPress={onSelectMode}
            />
            <ModeButton
              mode="read"
              emoji="👁️"
              label="Lire"
              description="Texte uniquement"
              isSelected={selectedMode === 'read'}
              onPress={onSelectMode}
            />
          </View>

          {/* Start button */}
          <Pressable style={styles.startButton} onPress={handleStart}>
            <Text style={styles.startButtonText}>C'est parti ! 🚀</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: spacing[6],
    ...shadows.xl,
  },
  closeButton: {
    position: 'absolute',
    top: spacing[4],
    right: spacing[4],
    width: 40,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeIcon: {
    fontSize: 18,
    color: '#718096',
  },

  // Story preview
  storyPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    marginBottom: spacing[5],
    paddingRight: spacing[8], // Space for close button
  },
  storyEmoji: {
    fontSize: 48,
  },
  storyInfo: {
    flex: 1,
  },
  storyTitle: {
    fontFamily: fontFamily.displayBold,
    fontSize: 18,
    color: '#2D3748',
    marginBottom: 4,
  },
  storyMeta: {
    fontSize: 14,
    color: '#718096',
  },

  // Title
  title: {
    fontFamily: fontFamily.displayBold,
    fontSize: 20,
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: spacing[5],
  },

  // Modes
  modesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[3],
    marginBottom: spacing[5],
  },
  modeButton: {
    width: 110,
    height: 130,
    backgroundColor: '#F8F9FA',
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[3],
    borderWidth: 3,
    borderColor: 'transparent',
  },
  modeButtonSelected: {
    borderColor: '#9B59B6',
    backgroundColor: 'rgba(155,89,182,0.08)',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#F39C12',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendedText: {
    fontSize: 12,
  },
  modeEmoji: {
    fontSize: 32,
    marginBottom: spacing[2],
  },
  modeLabel: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: '#2D3748',
    marginBottom: 4,
  },
  modeLabelSelected: {
    color: '#9B59B6',
  },
  modeDescription: {
    fontSize: 11,
    color: '#718096',
    textAlign: 'center',
  },

  // Start button
  startButton: {
    height: 56,
    backgroundColor: '#9B59B6',
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 4px rgba(155, 89, 182, 0.25)',
    elevation: 3,
  },
  startButtonText: {
    fontFamily: fontFamily.displayBold,
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default ModeSelectionModal;
