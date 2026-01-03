/**
 * CluePanel Component
 *
 * Panneau affichant les indices du puzzle
 * Refactorisé avec theme, Icons et fontSize ≥18pt
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';

import { theme } from '../../../theme';
import { Icons } from '../../../constants/icons';
import { useAccessibilityAnimations } from '../../../hooks';
import type { Clue } from '../types';

// ============================================================================
// TYPES
// ============================================================================

interface CluePanelProps {
  /** Liste des indices */
  clues: Clue[];
  /** IDs des indices utilisés */
  usedClueIds: string[];
  /** Indice actif (mis en évidence) */
  activeClueId: string | null;
  /** Callback quand on touche un indice */
  onCluePress: (clueId: string) => void;
}

// ============================================================================
// COLORS
// ============================================================================

const COLORS = {
  clueUsedBg: 'rgba(232, 245, 233, 0.7)',
  checkmarkBg: '#4CAF50',
  helpCardBg: 'rgba(255, 249, 230, 0.7)',
};

/** Couleurs pour les numeros d'indices (cycle de 3) */
const CLUE_NUMBER_COLORS = [
  theme.colors.primary.main,      // Bleu pour indice 1
  theme.colors.secondary.main,    // Orange pour indice 2
  theme.colors.feedback.success,  // Vert pour indice 3
];

/** Couleurs de fond semi-transparentes pour les indices */
const CLUE_BG_COLORS = [
  'rgba(91, 141, 238, 0.15)',    // Bleu transparent pour indice 1
  'rgba(255, 179, 71, 0.15)',    // Orange transparent pour indice 2
  'rgba(123, 199, 77, 0.15)',    // Vert transparent pour indice 3
];

// ============================================================================
// COMPONENT
// ============================================================================

export function CluePanel({
  clues,
  usedClueIds,
  activeClueId,
  onCluePress,
}: CluePanelProps) {
  const { shouldAnimate, getDuration } = useAccessibilityAnimations();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>{Icons.search} Indices</Text>

      {clues.map((clue, index) => {
        const isUsed = usedClueIds.includes(clue.id);
        const isActive = activeClueId === clue.id;
        // Couleurs basees sur l'index (cycle de 3 couleurs)
        const numberColor = CLUE_NUMBER_COLORS[index % CLUE_NUMBER_COLORS.length];
        const bgColor = CLUE_BG_COLORS[index % CLUE_BG_COLORS.length];

        return (
          <Animated.View
            key={clue.id}
            entering={
              shouldAnimate
                ? FadeInLeft.delay(index * 100).duration(getDuration(300))
                : undefined
            }
          >
            <Pressable
              style={[
                styles.clueCard,
                { backgroundColor: bgColor },
                isUsed && styles.clueCardUsed,
                isActive && styles.clueCardActive,
              ]}
              onPress={() => onCluePress(clue.id)}
              accessibilityRole="button"
              accessibilityLabel={`Indice ${index + 1}: ${clue.text}`}
              accessibilityState={{ selected: isUsed }}
            >
              <View style={[styles.clueNumber, { backgroundColor: numberColor }]}>
                <Text style={styles.clueNumberText}>{index + 1}</Text>
              </View>
              <Text
                style={[
                  styles.clueText,
                  isUsed && styles.clueTextUsed,
                ]}
              >
                {clue.text}
              </Text>
              {isUsed && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>{Icons.checkmark}</Text>
                </View>
              )}
            </Pressable>
          </Animated.View>
        );
      })}

      <View style={styles.helpCard}>
        <Text style={styles.helpTitle}>{Icons.lightbulb} Astuce</Text>
        <Text style={styles.helpText}>
          Touche une case pour marquer {Icons.checkmark} (oui) ou {Icons.crossMark} (non).{'\n'}
          Quand tu trouves un {Icons.checkmark}, les autres cases de la même ligne deviennent automatiquement {Icons.crossMark}.
        </Text>
      </View>
    </ScrollView>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Glass effect - iOS Liquid Glass Style
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 28,
    margin: theme.spacing[2],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    // Shadow for glass effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 8,
  },
  scrollContent: {
    padding: theme.spacing[4],
  },
  title: {
    fontSize: theme.fontSize.xl, // 24pt
    fontFamily: theme.fontFamily.displayBold,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
    paddingBottom: theme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
  },
  clueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor is set dynamically based on index
    borderRadius: 16,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[3],
    minHeight: theme.touchTargets.large, // 64dp
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  clueCardUsed: {
    backgroundColor: COLORS.clueUsedBg,
    opacity: 0.85,
  },
  clueCardActive: {
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
  },
  clueNumber: {
    width: 44,
    height: 44,
    borderRadius: 22,
    // backgroundColor is set dynamically based on index
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing[3],
    // Shadow comme dans le HTML
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  clueNumberText: {
    fontSize: theme.fontSize.lg, // 20pt
    fontFamily: theme.fontFamily.bold,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  clueText: {
    flex: 1,
    fontSize: theme.fontSize.lg, // 20pt
    fontFamily: theme.fontFamily.medium,
    fontWeight: '500',
    color: theme.colors.text.primary,
    lineHeight: 28,
  },
  clueTextUsed: {
    color: theme.colors.text.muted,
  },
  checkmark: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.checkmarkBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing[2],
  },
  checkmarkText: {
    fontSize: theme.fontSize.base, // 16pt pour badge plus grand
    fontFamily: theme.fontFamily.bold,
    fontWeight: '700',
    color: '#FFF',
  },
  helpCard: {
    backgroundColor: COLORS.helpCardBg,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[3],
    marginTop: theme.spacing[2],
  },
  helpTitle: {
    fontSize: theme.fontSize.lg, // 18pt
    fontFamily: theme.fontFamily.semiBold,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  helpText: {
    fontSize: theme.fontSize.lg, // 18pt - corrigé depuis 12pt
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
});

export default CluePanel;
