/**
 * VocabularyBubble Component
 *
 * Popup de définition pour les mots de vocabulaire
 * S'affiche quand l'enfant tape sur un mot souligné
 */

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { spacing, borderRadius, shadows, fontFamily } from '../../../theme';
import type { VocabularyWord } from '../types';

interface VocabularyBubbleProps {
  /** Mot de vocabulaire à afficher */
  word: VocabularyWord | null;
  /** Visible ou non */
  visible: boolean;
  /** Callback de fermeture */
  onClose: () => void;
}

export function VocabularyBubble({
  word,
  visible,
  onClose,
}: VocabularyBubbleProps) {
  const handleClose = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  }, [onClose]);

  if (!word) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Animated.View
          style={styles.backdropOverlay}
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
        />
      </Pressable>

      <View style={styles.container} pointerEvents="box-none">
        <View style={styles.bubble}>
          {/* Header avec emoji et mot */}
          <View style={styles.header}>
            <Text style={styles.emoji}>{word.emoji || '📖'}</Text>
            <Text style={styles.word}>{word.word}</Text>
          </View>

          {/* Définition */}
          <View style={styles.definitionContainer}>
            <Text style={styles.definitionLabel}>Définition :</Text>
            <Text style={styles.definition}>{word.definition}</Text>
          </View>

          {/* Exemple (si disponible) */}
          {word.example && (
            <View style={styles.exampleContainer}>
              <Text style={styles.exampleLabel}>Exemple :</Text>
              <Text style={styles.example}>« {word.example} »</Text>
            </View>
          )}

          {/* Bouton fermer */}
          <Pressable
            style={styles.closeButton}
            onPress={handleClose}
            accessibilityLabel="Fermer"
            accessibilityRole="button"
          >
            <Text style={styles.closeButtonText}>J'ai compris !</Text>
          </Pressable>

          {/* Flèche décorative en bas */}
          <View style={styles.arrow} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[4],
  },
  bubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: spacing[5],
    maxWidth: 340,
    width: '100%',
    ...shadows.xl,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[4],
    paddingBottom: spacing[3],
    borderBottomWidth: 2,
    borderBottomColor: '#E8E8E8',
  },
  emoji: {
    fontSize: 40,
  },
  word: {
    flex: 1,
    fontSize: 24,
    fontFamily: fontFamily.displayBold,
    color: '#9B59B6',
  },

  // Definition
  definitionContainer: {
    marginBottom: spacing[3],
  },
  definitionLabel: {
    fontSize: 12,
    fontFamily: fontFamily.bold,
    color: '#718096',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing[1],
  },
  definition: {
    fontSize: 18,
    fontFamily: fontFamily.regular,
    color: '#2D3748',
    lineHeight: 26,
  },

  // Example
  exampleContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: borderRadius.lg,
    padding: spacing[3],
    marginBottom: spacing[4],
  },
  exampleLabel: {
    fontSize: 12,
    fontFamily: fontFamily.bold,
    color: '#718096',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing[1],
  },
  example: {
    fontSize: 16,
    fontFamily: fontFamily.regular,
    fontStyle: 'italic',
    color: '#4A5568',
    lineHeight: 24,
  },

  // Close button
  closeButton: {
    backgroundColor: '#9B59B6',
    borderRadius: borderRadius.xl,
    paddingVertical: spacing[3],
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(155, 89, 182, 0.25)',
    elevation: 3,
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
    color: '#FFFFFF',
  },

  // Arrow (decorative)
  arrow: {
    position: 'absolute',
    bottom: -10,
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },
});

export default VocabularyBubble;
