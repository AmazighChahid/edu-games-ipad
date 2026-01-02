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
  clueUsedBg: '#E8F5E9',
  checkmarkBg: '#4CAF50',
  helpCardBg: '#FFF9E6',
};

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
                isUsed && styles.clueCardUsed,
                isActive && styles.clueCardActive,
              ]}
              onPress={() => onCluePress(clue.id)}
              accessibilityRole="button"
              accessibilityLabel={`Indice ${index + 1}: ${clue.text}`}
              accessibilityState={{ selected: isUsed }}
            >
              <View style={styles.clueNumber}>
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
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    margin: theme.spacing[2],
  },
  scrollContent: {
    padding: theme.spacing[3],
  },
  title: {
    fontSize: theme.fontSize.lg, // 20pt
    fontFamily: theme.fontFamily.displayBold,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[3],
  },
  clueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[3],
    marginBottom: theme.spacing[2],
    minHeight: theme.touchTargets.child, // 64dp
    ...theme.shadows.sm,
  },
  clueCardUsed: {
    backgroundColor: COLORS.clueUsedBg,
    opacity: 0.8,
  },
  clueCardActive: {
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
  },
  clueNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing[2],
  },
  clueNumberText: {
    fontSize: theme.fontSize.md, // 16pt pour badge plus grand
    fontFamily: theme.fontFamily.bold,
    fontWeight: '700',
    color: '#FFF',
  },
  clueText: {
    flex: 1,
    fontSize: theme.fontSize.lg, // 18pt minimum enfant
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.text.primary,
    lineHeight: 24,
  },
  clueTextUsed: {
    color: theme.colors.text.tertiary,
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
    fontSize: theme.fontSize.md, // 16pt pour badge plus grand
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
